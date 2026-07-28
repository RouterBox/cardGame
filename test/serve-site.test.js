'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const SERVE_SCRIPT = path.join(REPO_ROOT, 'tools', 'serve-site.js');
const SITE_DIR = path.join(REPO_ROOT, 'site');
const PACKAGE_JSON_PATH = path.join(REPO_ROOT, 'package.json');

// Build once up front so every test sees a known-good site/ (same pattern
// as test/build-site.test.js's runBuild()).
execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });

const { createServer, resolveConfig } = require('../tools/serve-site.js');

function startTestServer() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  return server;
}

function waitForListening(server) {
  return new Promise((resolve) => server.once('listening', resolve));
}

function baseUrl(server) {
  return `http://127.0.0.1:${server.address().port}`;
}

// ---------------------------------------------------------------------------
// AC1: tools/serve-site.js exists and starts a Node http server that serves
// files from the site/ directory
// ---------------------------------------------------------------------------

test('AC1: tools/serve-site.js exists', () => {
  assert.ok(fs.existsSync(SERVE_SCRIPT), 'expected tools/serve-site.js to exist');
});

test('AC1: createServer() returns a Node http.Server that serves a file from site/', async () => {
  const server = startTestServer();
  try {
    await waitForListening(server);
    const res = await fetch(`${baseUrl(server)}/design/rules.html`);
    const body = await res.text();
    assert.strictEqual(res.status, 200);
    const expected = fs.readFileSync(path.join(SITE_DIR, 'design', 'rules.html'), 'utf8');
    assert.strictEqual(body, expected);
  } finally {
    server.close();
  }
});

// ---------------------------------------------------------------------------
// AC2: an npm script named site:serve runs tools/serve-site.js
// ---------------------------------------------------------------------------

test('AC2: package.json defines a site:serve script that runs tools/serve-site.js', () => {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  assert.ok(pkg.scripts && typeof pkg.scripts['site:serve'] === 'string', 'expected a "site:serve" npm script');
  assert.match(pkg.scripts['site:serve'], /tools[\\/]serve-site\.js/);
});

// ---------------------------------------------------------------------------
// AC3 (amended by RouterBox 2026-07-28): the server binds localhost at the
// next open port by default — "I think I just want it served on
// http://localhost:nextOpen". HOST/PORT env vars still override.
// ---------------------------------------------------------------------------

test('AC3: resolveConfig() defaults to localhost + ephemeral port, overridable via HOST/PORT env vars', () => {
  const originalHost = process.env.HOST;
  const originalPort = process.env.PORT;
  try {
    delete process.env.HOST;
    delete process.env.PORT;
    assert.strictEqual(resolveConfig().host, '127.0.0.1');
    assert.strictEqual(resolveConfig().port, 0);

    process.env.HOST = '0.0.0.0';
    process.env.PORT = '8080';
    assert.strictEqual(resolveConfig().host, '0.0.0.0');
    assert.strictEqual(resolveConfig().port, 8080);
  } finally {
    if (originalHost === undefined) delete process.env.HOST; else process.env.HOST = originalHost;
    if (originalPort === undefined) delete process.env.PORT; else process.env.PORT = originalPort;
  }
});

test('AC3: default config yields a localhost server on an OS-assigned open port', async () => {
  const { port, host } = (() => {
    const oh = process.env.HOST, op = process.env.PORT;
    delete process.env.HOST; delete process.env.PORT;
    const cfg = resolveConfig();
    if (oh !== undefined) process.env.HOST = oh;
    if (op !== undefined) process.env.PORT = op;
    return cfg;
  })();
  const server = createServer();
  server.listen(port, host);
  try {
    await waitForListening(server);
    assert.strictEqual(server.address().address, '127.0.0.1');
    assert.ok(server.address().port > 0, 'OS must assign a real open port');
    const res = await fetch(`http://127.0.0.1:${server.address().port}/`);
    assert.strictEqual(res.status, 200);
  } finally {
    server.close();
  }
});

// ---------------------------------------------------------------------------
// AC4: GET / returns HTTP 200 and the design-shelf index.html body
// ---------------------------------------------------------------------------

test('AC4: GET / returns 200 and the design-shelf index.html body', async () => {
  const server = startTestServer();
  try {
    await waitForListening(server);
    const res = await fetch(`${baseUrl(server)}/`);
    const body = await res.text();
    assert.strictEqual(res.status, 200);
    const expected = fs.readFileSync(path.join(SITE_DIR, 'index.html'), 'utf8');
    assert.strictEqual(body, expected);
  } finally {
    server.close();
  }
});

test('reviewer finding 1: a malformed percent-encoded path returns 404 and does not crash the server', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  try {
    // Raw socket: http.get would reject the invalid URL client-side.
    const res = await new Promise((resolve, reject) => {
      const net = require('node:net');
      const sock = net.createConnection(port, '127.0.0.1', () => {
        sock.write('GET /% HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
      });
      let buf = '';
      sock.on('data', (d) => { buf += d; });
      sock.on('end', () => resolve(buf));
      sock.on('error', reject);
    });
    assert.match(res, /HTTP\/1\.1 404/, 'malformed path must 404, not crash');
    // The server must still answer a healthy request afterwards.
    const ok = await new Promise((resolve, reject) => {
      require('node:http').get({ host: '127.0.0.1', port, path: '/' }, (r) => resolve(r.statusCode)).on('error', reject);
    });
    assert.strictEqual(ok, 200, 'server must survive the malformed request');
  } finally {
    server.close();
  }
});
