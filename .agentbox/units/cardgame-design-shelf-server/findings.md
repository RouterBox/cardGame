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
