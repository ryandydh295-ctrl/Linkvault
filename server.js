import http from 'node:http';
import httpProxy from 'http-proxy';
import { config } from './config.js';

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  xfwd: true,
  timeout: config.timeout,
});

// ---------- Helpers ----------
function isBlocked(hostname) {
  const h = hostname.toLowerCase();
  if (config.blockedHosts.includes(h)) return true;
  if (config.allowedHosts.length && !config.allowedHosts.includes(h)) return true;
  return false;
}

function checkAuth(req) {
  if (!config.authToken) return true;
  const header = req.headers['proxy-authorization'] || req.headers['authorization'] || '';
  return header === `Bearer ${config.authToken}`;
}

function sendError(res, code, message) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
}

// ---------- Server ----------
const server = http.createServer((req, res) => {
  // Health check
  if (req.url === '/__linkvault/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', name: 'linkvault' }));
  }

  if (!checkAuth(req)) {
    return sendError(res, 407, 'Proxy authentication required');
  }

  // Handle HTTPS CONNECT (tunneling)
  if (req.method === 'CONNECT') {
    const [hostname, port = '443'] = req.url.split(':');

    if (isBlocked(hostname)) {
      return sendError(res, 403, `Host blocked: ${hostname}`);
    }

    return proxy.web(req, res, {
      target: `http://${hostname}:${port}`,
      secure: false,
    });
  }

  // Handle regular HTTP requests
  let targetUrl;
  try {
    targetUrl = new URL(req.url);
  } catch {
    return sendError(res, 400, 'Invalid URL');
  }

  if (isBlocked(targetUrl.hostname)) {
    return sendError(res, 403, `Host blocked: ${targetUrl.hostname}`);
  }

  proxy.web(req, res, {
    target: `${targetUrl.protocol}//${targetUrl.host}`,
  });
});

// ---------- Proxy events ----------
proxy.on('error', (err, req, res) => {
  console.error('[linkvault] proxy error:', err.message);
  if (res && !res.headersSent) {
    sendError(res, 502, 'Bad gateway');
  } else if (res) {
    res.end();
  }
});

proxy.on('proxyReq', (proxyReq, req) => {
  console.log(`[linkvault] ${req.method} ${req.url}`);
});

// ---------- CONNECT tunneling for HTTPS ----------
server.on('connect', (req, socket) => {
  if (!checkAuth(req)) {
    socket.write('HTTP/1.1 407 Proxy Authentication Required\r\n\r\n');
    return socket.end();
  }

  const [hostname, port = '443'] = req.url.split(':');

  if (isBlocked(hostname)) {
    socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
    return socket.end();
  }

  const net = require('node:net');
  const serverSocket = net.connect(port, hostname, () => {
    socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    serverSocket.pipe(socket);
    socket.pipe(serverSocket);
  });

  serverSocket.on('error', (err) => {
    console.error('[linkvault] tunnel error:', err.message);
    socket.end();
  });

  socket.on('error', () => serverSocket.end());
});

server.listen(config.port, config.host, () => {
  console.log(`[linkvault] listening on ${config.host}:${config.port}`);
  console.log(`[linkvault] auth: ${config.authToken ? 'enabled' : 'disabled'}`);
});
