# cardgame-design-shelf-server: Design Shelf LAN Server

## Header

- unit: cardgame-design-shelf-server
- title: Design Shelf LAN Server
- project: cardgame
- completed: 2026-07-28
- outcome: escalated
- start_sha: 54a01b9df6e3bd8b1791dca2a4c0578cce62a92a
- end_sha: 242bd172f0c0a11d868331337d9217e1a696ce41

## Intent

Add a zero-dependency static file server that serves the design-shelf site (already produced by tools/build-site.js into site/) bound to 0.0.0.0 by default, exposed via an npm script, so the existing design content is reachable from a phone on the local network without any file/folder spelunking on the desktop.

## Acceptance Criteria

- AC1 [paraphrase]: tools/serve-site.js exists and starts a Node http server that serves files from the site/ directory
- AC2 [inferred]: An npm script named site:serve runs tools/serve-site.js
- AC3 [paraphrase]: The server binds host 0.0.0.0 by default (overridable) so it is reachable from other devices on the same LAN, not just localhost
- AC4 [inferred]: GET / returns HTTP 200 and the design-shelf index.html body
- AC5 [inferred] (held_out): Requests for a nonexistent path return HTTP 404 instead of crashing the server process
- AC6 [inferred] (held_out): Served .html and .svg files include correct Content-Type response headers

## Plan

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


## Findings

# Blind review: cardgame-design-shelf-server (cycle 3)

Note on diff scope: the diff supplied for this review is cumulative (spans the whole unit, not just the cycle-3-only commit `673f2da`). Per `git log`, cycle 2 (`c114520`) already added `tools/serve-site.js`, the `package.json` script, and the first version of the build lock in `tools/build-site.js`; cycle 3 only added `.gitignore` and improved that lock. Everything in the supplied diff is new relative to the pre-unit base, so it's all treated as INTRODUCED below.

## AC coverage

- **AC1** (tools/serve-site.js exists, Node http server serves files from site/): Met. `tools/serve-site.js` exports `createServer()` returning an `http.Server` backed by `requestHandler`/`resolveFilePath`, which reads from `SITE_DIR = <repo>/site`. Covered by `test/serve-site.test.js` "AC1" tests (file exists; serving `/design/rules.html` returns the on-disk bytes).
- **AC2** (npm script `site:serve` runs `tools/serve-site.js`): Met. `package.json` adds `"site:serve": "node tools/serve-site.js"`. Covered by the "AC2" test asserting the script string.
- **AC3** (binds `0.0.0.0` by default, overridable): Met. `DEFAULT_HOST = '0.0.0.0'`, `resolveConfig()` reads `process.env.HOST` as an override. Covered by both "AC3" tests (default/override value, and an actual `0.0.0.0`-bound server accepting a connection).
- **AC4** (`GET /` returns 200 + index.html body): Met. `resolveFilePath` maps `/` to `index.html`; `requestHandler` streams it back with a 200. Covered by the "AC4" test comparing the response body to `site/index.html` on disk.

All four visible ACs are implemented and exercised by passing-shaped tests. The finding below is a defect in the same new code, not a gap in AC delivery.

## Findings

### 1. [INTRODUCED] Malformed request URL crashes the entire server process
**File:** `tools/serve-site.js`, `resolveFilePath` (line 38), called from `requestHandler` (line 54)

`resolveFilePath` calls `decodeURIComponent(requestUrl.split('?')[0])` with no try/catch. `decodeURIComponent` throws a synchronous `URIError` on invalid percent-encoding (e.g. a bare `%`, or `%zz`). That call runs directly inside the `http.Server`'s `'request'` event listener (`requestHandler`), and nothing upstream catches it — there is no `process.on('uncaughtException', ...)` anywhere in this file. A synchronous throw inside an `EventEmitter` listener with no handler propagates as an uncaught exception and terminates the Node process by default.

**Failure scenario:** any client reachable on the LAN sends `GET /%` (or any other request whose path contains invalid percent-encoding — trivially reachable via a stray `%` typed into a phone browser's address bar, `curl http://<host>:8080/%`, or an ordinary port scanner probing the newly-exposed 0.0.0.0 bind) and the whole `site:serve` process dies, taking the design shelf down for every other device on the network until someone notices and restarts it manually. This directly undercuts the point of AC3 (LAN-wide reachability from a phone with no desktop babysitting) — one bad request from anyone kills it for everyone. No test in `test/serve-site.test.js` exercises a malformed/invalid-percent-encoding path, so this is currently unverified and unguarded.

## Non-issues / resolved-since-last-cycle checked

- **Path traversal via `resolveFilePath`:** traced manually against `%2e%2e`-encoded traversal and absolute-looking segments. `path.normalize` fully collapses the joined path *before* the `resolved.startsWith(SITE_DIR + path.sep)` check runs, so escaping segments are caught regardless of encoding. The guard is sound (decoding happens first, then the traversal check runs on the decoded value, so there's no decode-after-check bypass).
- **`tools/build-site.js` lock regression (flagged in the prior cycle's review):** the prior review's finding — that the build lock added in cycle 2 could wedge every future build forever if a process was killed mid-build (no staleness check, no exit cleanup, no `.gitignore` entry) — has been addressed in this cycle: `isLockStale()`/`LOCK_STALE_MS` now reclaims a lock file older than 30s, `process.once('exit', releaseOnExit)` adds a best-effort cleanup on normal process exit, and `.gitignore` now excludes `.site-build.lock`. Residual gap: there is still no test exercising `withBuildLock`/`isLockStale` directly, but since a stray lock now self-heals within 30s instead of wedging indefinitely, this no longer rises to a blocking severity on its own.
- Binary-looking diff hunk for `tools/build-site.js` (`Binary files a/tools/build-site.js and b/tools/build-site.js differ`): confirmed via `git show`/`git cat-file` on the relevant blobs that the file is plain UTF-8 JS with no binary content; this is a diff-rendering quirk (this repo has no `.gitattributes` and `core.autocrlf=true`), not data corruption. Content was reconstructed and read directly to review it.

## Verdict

NEEDS_WORK — Finding 1 is an INTRODUCED defect in the new server (`tools/serve-site.js`) with a concrete, easily-triggered failure scenario: a single malformed request path crashes the whole process, defeating the LAN-reachability goal that is the entire point of this unit (AC3).


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T11:25:33.415Z] **bolt:start** — unit=cardgame-design-shelf-server start_sha=54a01b9df6e3bd8b1791dca2a4c0578cce62a92a branch=bolt/cardgame-design-shelf-server worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-design-shelf-server
- [2026-07-28T11:25:37.410Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T11:30:18.306Z] **plan:done** — plan.md written
- [2026-07-28T11:31:45.715Z] **tests:done** — RED verified on test/serve-site.test.js (exit=1)
- [2026-07-28T11:32:54.632Z] **build:c1** — tests still red (exit=1)
- [2026-07-28T11:36:34.287Z] **build:c2** — tests green, committed
- [2026-07-28T11:43:54.014Z] **review:c2** — NEEDS_WORK
- [2026-07-28T11:50:40.343Z] **build:c3** — tests green, committed
- [2026-07-28T11:57:26.441Z] **review:c3** — NEEDS_WORK
- [2026-07-28T11:57:26.444Z] **bolt:escalated** — circuit breaker after 3 cycles


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
