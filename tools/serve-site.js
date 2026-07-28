#!/usr/bin/env node
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const SITE_DIR = path.join(REPO_ROOT, 'site');

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = '0.0.0.0';

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
  const pathname = decodeURIComponent(requestUrl.split('?')[0]);
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
  const port = Number(process.env.PORT) || DEFAULT_PORT;
  const host = process.env.HOST || DEFAULT_HOST;
  return { port, host };
}

function main() {
  const { port, host } = resolveConfig();
  const server = createServer();
  server.listen(port, host, () => {
    console.log(`Serving ${path.relative(REPO_ROOT, SITE_DIR).split(path.sep).join('/')}/ at http://${host}:${port}/`);
  });
  return server;
}

if (require.main === module) {
  main();
}

module.exports = { createServer, resolveConfig, contentTypeFor, resolveFilePath, SITE_DIR };
