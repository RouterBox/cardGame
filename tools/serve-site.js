#!/usr/bin/env node
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const SITE_DIR = path.join(REPO_ROOT, 'site');

// RouterBox 2026-07-28: serve on localhost at the next open port — not
// 0.0.0.0. Port 0 asks the OS for a free ephemeral port, so starting the
// shelf never collides with anything else running on this machine; the
// startup log prints the real URL to open. PORT/HOST env vars still
// override for anyone who wants a fixed address.
const DEFAULT_PORT = 0;
const DEFAULT_HOST = '127.0.0.1';

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};
const DEFAULT_CONTENT_TYPE = 'application/octet-stream';

function contentTypeFor(filePath) {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] || DEFAULT_CONTENT_TYPE;
}

// Resolves a request URL to an absolute file path inside SITE_DIR, or null
// if the request escapes SITE_DIR or doesn't match an existing file.
function resolveFilePath(requestUrl) {
  // decodeURIComponent throws a synchronous URIError on invalid
  // percent-encoding (a bare "%" typed into a phone address bar, "%zz"
  // from a port scanner). Uncaught inside the request listener that would
  // kill the whole process — one bad request from any LAN client takes the
  // shelf down for everyone. Treat undecodable paths as not-found instead.
  let pathname;
  try {
    pathname = decodeURIComponent(requestUrl.split('?')[0]);
  } catch {
    return null;
  }
  const relPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const resolved = path.normalize(path.join(SITE_DIR, relPath));

  if (resolved !== SITE_DIR && !resolved.startsWith(SITE_DIR + path.sep)) {
    return null;
  }

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return null;
  }

  return resolved;
}

function requestHandler(req, res) {
  const filePath = resolveFilePath(req.url);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  res.writeHead(200, { 'Content-Type': contentTypeFor(filePath) });
  fs.createReadStream(filePath).pipe(res);
}

function createServer() {
  return http.createServer(requestHandler);
}

function resolveConfig() {
  // `PORT=0`/unset -> ephemeral next-open port; Number('') is 0 so an empty
  // env var also lands on the ephemeral default. `??` (not ||) keeps an
  // explicit 0 meaning "OS picks".
  const port = process.env.PORT !== undefined && process.env.PORT !== ''
    ? Number(process.env.PORT)
    : DEFAULT_PORT;
  const host = process.env.HOST || DEFAULT_HOST;
  return { port, host };
}

function main() {
  const { port, host } = resolveConfig();
  const server = createServer();
  server.listen(port, host, () => {
    // With port 0 the OS assigns the real port at listen time — report the
    // bound address, not the requested one, so the printed URL always works.
    const bound = server.address().port;
    console.log(`Serving ${path.relative(REPO_ROOT, SITE_DIR).split(path.sep).join('/')}/ at http://${host === '0.0.0.0' ? 'localhost' : host}:${bound}/`);
  });
  return server;
}

if (require.main === module) {
  main();
}

module.exports = { createServer, resolveConfig, contentTypeFor, resolveFilePath, SITE_DIR };
