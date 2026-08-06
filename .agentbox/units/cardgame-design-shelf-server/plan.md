GATE: none

# Plan: cardgame-design-shelf-server

## Summary

Add a zero-dependency static file server (`tools/serve-site.js`) that serves the
already-built `site/` directory (produced by `tools/build-site.js`) over HTTP,
bound to `0.0.0.0` by default so the design shelf is reachable from a phone on
the LAN. Wire it up via an npm script `site:serve`. Add
`test/serve-site.test.js` covering all six ACs, including the two held-out
ones (404 handling, Content-Type headers).

This is a small, self-contained unit — one new source file, one new test
file, one `package.json` edit. No split needed.

## Repo conventions this plan follows (verified by reading the repo)

- CommonJS throughout (`package.json` has no `"type": "module"`); tools use
  `'use strict'` + `require('node:...')`.
- `tools/*.js` scripts are plain Node, no dependencies, executed directly
  (`node tools/build-site.js`) and via `execFileSync` from tests.
- Tests live in `test/*.test.js`, use `node:test` + `node:assert`, and are
  picked up automatically by the existing `"test": "node --test"` script —
  no config changes needed to register a new test file.
- `tools/build-site.js` always rebuilds `site/` from scratch
  (`fs.rmSync(SITE_DIR, { recursive: true, force: true })` then rebuild), so
  tests that depend on `site/` contents call the build script first via
  `execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' })`
  (see `test/build-site.test.js`). This plan's test file does the same once,
  at module load time, so every test sees a known-good `site/`.
- Node version available in this repo/environment is v23.11.0 — global
  `fetch()` is available in tests without imports or flags.

## Design decisions (stated explicitly since they aren't fully pinned by the AC list)

1. **Default port: `8080`.** Not specified by the ACs. Overridable via
   `PORT` env var (mirrors the `HOST` override required by AC3, same
   mechanism, so there's exactly one pattern to learn). `8080` is a common,
   easy-to-type default for a LAN static server.
2. **Host default `0.0.0.0`, override via `HOST` env var.** This directly
   implements AC3.
3. **The script must be requirable without side effects for testing**, because
   an HTTP server that calls `.listen()` at module scope never lets
   `node --test` exit and can't run in-process. So `tools/serve-site.js`
   exports a `createServer()` function (returns an `http.Server` that is
   *not* listening yet) and a `resolveConfig()` function (pure, reads
   `process.env`), and only calls `.listen()` when the file is executed
   directly:
   ```js
   if (require.main === module) {
     main();
   }
   module.exports = { createServer, resolveConfig, contentTypeFor, resolveFilePath, SITE_DIR };
   ```
   This is the standard Node idiom for a script that is both a CLI entry
   point and a testable module — it is not a speculative abstraction, it's
   required for AC4/AC5/AC6 to be testable at all without spawning and
   port-managing a real child process per test.
4. **Path traversal guard.** Not called out in the ACs, but a static file
   server that maps arbitrary request paths onto the filesystem without
   guarding `..` segments would let any LAN client read files outside
   `site/` (e.g. `design/` source markdown, or anything else in the repo).
   Since AC3 explicitly makes this reachable from other devices on the LAN,
   leaving this out would be a real (if minor) vulnerability, not a missing
   feature. The guard is 3 lines using `path.normalize` + a prefix check —
   kept minimal, no new dependency.
5. **Content-Type map.** AC6 only requires `.html` and `.svg` to be correct.
   The plan includes a slightly wider map (css/js/json/images/fonts/txt) at
   no extra complexity cost (one object literal) so other asset types the
   site might later reference aren't silently served as
   `application/octet-stream`; this does not add any new code paths or
   behavior beyond "look up the extension in a table," so it isn't scope
   creep in the sense CLAUDE.md warns about — it's the same amount of code
   either way. If you want to trim it to exactly `.html`/`.svg` +
   `application/octet-stream` fallback, that's a valid simplification; the
   tests only assert on `.html` and `.svg`.

## Held-out AC check

- AC5 (404 instead of crash) and AC6 (correct Content-Types) are both
  ordinary, expected behavior of *any* correct static file server implied by
  AC1's "serves files from `site/` directory" — they are specific
  consequences of the visible intent, not novel requirements smuggled in.
  No spec bug to flag.

## Files to create / modify

### 1. `tools/serve-site.js` (new file)

Full contents:

```js
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
```

### 2. `package.json` (modify)

Current:
```json
{
  "name": "cardgame",
  "version": "0.1.0",
  "description": "Galactic civilizations TCG — rules engine and card database",
  "scripts": { "test": "node --test" },
  "license": "UNLICENSED"
}
```

Change the `"scripts"` line to add `site:serve`:
```json
{
  "name": "cardgame",
  "version": "0.1.0",
  "description": "Galactic civilizations TCG — rules engine and card database",
  "scripts": {
    "test": "node --test",
    "site:serve": "node tools/serve-site.js"
  },
  "license": "UNLICENSED"
}
```
(This satisfies AC2 directly: `npm run site:serve` runs `tools/serve-site.js`.)

### 3. `test/serve-site.test.js` (new file)

Full contents:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const SITE_DIR = path.join(REPO_ROOT, 'site');

const { createServer, resolveConfig } = require('../tools/serve-site.js');

// Build once up front so every test sees a known-good site/ (same pattern
// as test/build-site.test.js's runBuild()).
execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });

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
// AC1 / AC4: serves files from site/, GET / returns 200 + index.html body
// ---------------------------------------------------------------------------

test('AC1/AC4: GET / returns 200 and the design-shelf index.html body', async () => {
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

test('AC1: serves a nested page from site/', async () => {
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
// AC3: binds 0.0.0.0 by default, overridable via HOST
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

test('AC3: a server bound to 0.0.0.0 actually accepts connections', async () => {
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
// AC5 (held out): nonexistent path -> 404, not a crash
// ---------------------------------------------------------------------------

test('AC5: a nonexistent path returns 404 and the server keeps serving', async () => {
  const server = startTestServer();
  try {
    await waitForListening(server);
    const res = await fetch(`${baseUrl(server)}/does/not/exist.html`);
    assert.strictEqual(res.status, 404);

    // Prove the process is still alive and serving after the 404.
    const res2 = await fetch(`${baseUrl(server)}/`);
    assert.strictEqual(res2.status, 200);
  } finally {
    server.close();
  }
});

test('AC5: a path traversal attempt does not escape site/ and returns 404', async () => {
  const server = startTestServer();
  try {
    await waitForListening(server);
    const res = await fetch(`${baseUrl(server)}/..%2f..%2fpackage.json`);
    assert.strictEqual(res.status, 404);
  } finally {
    server.close();
  }
});

// ---------------------------------------------------------------------------
// AC6 (held out): correct Content-Type for .html and .svg
// ---------------------------------------------------------------------------

test('AC6: .html responses carry a text/html Content-Type', async () => {
  const server = startTestServer();
  try {
    await waitForListening(server);
    const res = await fetch(`${baseUrl(server)}/index.html`);
    assert.match(res.headers.get('content-type') || '', /text\/html/);
  } finally {
    server.close();
  }
});

test('AC6: .svg responses carry an image/svg+xml Content-Type', async () => {
  // site/ has no .svg output today (build-site.js only emits .html), so this
  // test drops a small fixture file into site/ to exercise real file-serving
  // for the extension, then removes it.
  const fixturePath = path.join(SITE_DIR, '__serve-site-test-fixture.svg');
  fs.writeFileSync(fixturePath, '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  const server = startTestServer();
  try {
    await waitForListening(server);
    const res = await fetch(`${baseUrl(server)}/__serve-site-test-fixture.svg`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type') || '', /image\/svg\+xml/);
  } finally {
    server.close();
    fs.rmSync(fixturePath, { force: true });
  }
});
```

## Expected outputs

- `npm run site:serve` (or `node tools/serve-site.js`) prints one line and
  then blocks, listening:
  ```
  Serving site/ at http://0.0.0.0:8080/
  ```
  Visiting `http://<this-machine's-LAN-IP>:8080/` from a phone on the same
  Wi-Fi shows the design shelf index page (same content as opening
  `site/index.html` locally).
  `HOST=127.0.0.1 node tools/serve-site.js` binds loopback-only instead.
  `PORT=3000 node tools/serve-site.js` listens on port 3000 instead of 8080.

- `npm test` (i.e. `node --test`) picks up `test/serve-site.test.js`
  automatically alongside the existing suites and prints a summary like:
  ```
  # pass 8
  # fail 0
  ```
  for this file's 8 tests (2 for AC1/AC4, 2 for AC3, 2 for AC5, 2 for AC6),
  with the repo's total pass count increased by 8 and 0 new failures.

## Manual sanity check (optional, not part of the automated test command)

1. `node tools/build-site.js` (regenerate `site/` if needed).
2. `node tools/serve-site.js`.
3. On the same machine: `curl -i http://localhost:8080/` → `200`, HTML body,
   `Content-Type: text/html; charset=utf-8`.
4. `curl -i http://localhost:8080/nope` → `404`.
5. Find the machine's LAN IP (e.g. `ipconfig` on Windows → IPv4 Address),
   and load `http://<that-ip>:8080/` from a phone on the same Wi-Fi network
   to confirm real LAN reachability (this is the actual product goal behind
   AC3 and can't be fully automated in `node --test`).
6. Ctrl+C to stop the server.

## FIRE risk self-assessment

- **F**ully reversible: yes — two new files and one additive `package.json`
  script entry; nothing existing is deleted or rewritten; trivially revert
  with `git revert` / `git checkout`.
- **I**mpact if wrong: low. Worst case is a dev-only local server that fails
  to start, binds the wrong host/port, or serves a 500 — no production
  system, no CI pipeline, no other unit depends on this file existing.
- **R**each: local machine only, opt-in (`npm run site:serve` must be run
  manually); default binds `0.0.0.0` which is the explicit, intended
  behavior per AC3 (exposes only the already-public design-shelf HTML/SVG
  content to the LAN, not the whole repo — mitigated further by the
  path-traversal guard in `resolveFilePath`).
- **E**xposure/security: no secrets, no user data, no auth, no external
  network calls, no new dependencies (uses only `node:http`, `node:fs`,
  `node:path`). Path traversal is explicitly guarded.
- **Schema/data changes:** none.

Net: low risk, spec is unambiguous, no confirmation gate needed.
