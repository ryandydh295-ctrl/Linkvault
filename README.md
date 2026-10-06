# LinkVault

A browser-based workspace that runs entirely in a single HTML file. Tabbed windows, a dock, and a set of built-in apps — all inside one page.

---

## Vision

LinkVault aims to be a full OS-like interface in the browser: a desktop you open in a tab, with windows you can move, resize, and stack, plus a growing set of apps that run inside it. No installs, no accounts, no dependencies beyond the browser itself.

The first app is a web proxy: type a URL, get the page, rendered inside a LinkVault window. Future apps extend from the same shell — a file viewer, a notes panel, a settings app, a browser, whatever fits.

---

## Features

**Shell**
- Single HTML file, no build step, no dependencies
- Window manager — draggable, resizable, stackable windows
- Dock with app launchers
- Desktop background and taskbar
- Persistent layout across reloads

**Apps (shipping)**
- **Proxy** — type a URL, load it through the proxy in a window
- **Settings** — configure server, token, theme

**Apps (planned)**
- Notes — local scratchpad, saved per browser
- Files — browse a mounted directory via the proxy
- Terminal — fake shell with a few built-in commands
- Browser — multi-tab browsing inside a single window

---

## Proxy app

The Proxy app is the core of LinkVault right now. Open it from the dock, paste a URL, hit enter. The page loads through the configured proxy and renders inside the window.

- Supports http and https targets
- All HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD)
- Streaming responses — content loads as it arrives
- Token auth for access control
- Host allow/block lists, configurable per instance

---

## Configuration

In the Settings app, enter:

- **Server URL** — where your LinkVault instance lives
- **Token** — if the instance requires one
- **Theme** — light, dark, or system

All settings persist in browser storage. Configure once, and the shell is ready every time you open it.

---

## Hosting

LinkVault is a single HTML file. Host it however you like:

- Static host — GitHub Pages, Cloudflare Pages, Netlify, anything
- Open locally — `file://` works
- Served alongside your proxy instance — same origin, no CORS issues

---

## Usage

Open LinkVault in a browser. The desktop loads. Click the Proxy app in the dock. Type a URL. Hit enter.

From the shell itself, everything is point-and-click. No command line needed.

---

## Roadmap

- [x] Proxy app with URL bar
- [x] Settings app
- [ ] Window manager polish — snapping, minimize, maximize
- [ ] Notes app
- [ ] Terminal app
- [ ] File browser
- [ ] Theme system with custom palettes
- [ ] Keyboard shortcuts
- [ ] Import/export layout

---

## Limitations

- No CONNECT tunneling — HTTPS through a system proxy setting won't work
- No CORS headers by default — add them if calling from a different origin
- No caching — every request hits the target
- Free-tier hosting caps at 100,000 requests/day

---

## Legal and ethical use

This is a tool for fetching URLs. What you fetch and why is on you.
