export const config = {
  port: process.env.PORT || 8080,
  host: process.env.HOST || '0.0.0.0',

  // Optional: restrict which hosts can be proxied (empty = allow all)
  allowedHosts: [
    // 'example.com',
    // 'api.github.com',
  ],

  // Optional: block these hosts
  blockedHosts: [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
  ],

  // Optional: require a token to use the proxy
  authToken: process.env.PROXY_TOKEN || null,

  // Timeouts
  timeout: 30_000,
};
