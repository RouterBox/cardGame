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
// AC3: the server binds host 0.0.0.0 by default (overridable)
// ---------------------------------------------------------------------------

test('AC3: resolveConfig() defaults host to 0.0.0.0, overridable via HOST env var', () => {
  const originalHost = process.env.HOST;
  try {
    delete process.env.HOST;
    assert.strictEqual(resolveConfig().host, '0.0.0.0');

    process.env.HOST = '127.0.0.1';
    assert.strictEqual(resolveConfig().host, '127.0.0.1');
  } finally {
    if (originalHost === undefined) delete process.env.HOST;
    else process.env.HOST = originalHost;
  }
});

test('AC3: a server bound to 0.0.0.0 actually accepts connections from another interface', async () => {
  const server = createServer();
  server.listen(0, '0.0.0.0');
  try {
    await waitForListening(server);
    assert.strictEqual(server.address().address, '0.0.0.0');
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
