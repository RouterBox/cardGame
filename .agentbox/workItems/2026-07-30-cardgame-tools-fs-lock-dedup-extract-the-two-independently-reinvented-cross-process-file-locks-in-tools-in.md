# cardgame-tools-fs-lock-dedup: Extract the two independently-reinvented cross-process file locks in tools/ into one shared, tested lib/fs-lock.js

## Header

- unit: cardgame-tools-fs-lock-dedup
- title: Extract the two independently-reinvented cross-process file locks in tools/ into one shared, tested lib/fs-lock.js
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: 01724d36724d9698bef13d74da96d6228eb952ee
- end_sha: 3770459a5584e9c82b6eb60958dfe7f8e1cc79fd

## Intent

tools/build-site.js's withBuildLock/isLockStale and tools/composite-card-art.js's withOutDirLock independently implement the same cross-process exclusive-lock-with-stale-reclaim pattern (open-or-wait, compare mtimeMs against a 30s staleness threshold, reclaim and retry) with near-duplicate rationale comments but different mechanics. Extract a single shared implementation into lib/fs-lock.js, update both tools to call it instead of declaring their own lock functions, and add a direct unit test for the shared module's mutual-exclusion and stale-reclaim behavior. This is a behavior-preserving refactor verified by passing tests, not a repo-state assertion (avoids the T11 pitfall) — every existing build-site and composite-card-art test must stay green unmodified.

## Acceptance Criteria

- AC1 [inferred]: lib/fs-lock.js exists and exports a lock function implementing exclusive acquire-or-wait plus stale-lock reclaim (lock older than a threshold is treated as abandoned and reclaimed rather than blocking forever)
- AC2 [inferred]: tools/build-site.js contains no local withBuildLock/isLockStale function declarations and instead requires the lock helper from lib/fs-lock.js; test/build-site.test.js passes unmodified
- AC3 [inferred]: tools/composite-card-art.js contains no local withOutDirLock function declaration and instead requires the lock helper from lib/fs-lock.js; test/composite-card-art.test.js passes unmodified
- AC4 [inferred] (held_out): A new test/fs-lock-dedup.test.js exercises lib/fs-lock.js directly: a second concurrent acquire attempt is excluded until the first releases, and a lock left behind by a killed process (mtime older than the stale threshold) is automatically reclaimed rather than hanging
- AC5 [paraphrase]: Full `node --test` run is green (pre-existing suite plus the new fs-lock tests)

## Plan

GATE: none

# Plan: cardgame-tools-fs-lock-dedup

## Summary

`tools/build-site.js` (`withBuildLock` + `isLockStale`) and `tools/composite-card-art.js`
(`withOutDirLock`) each implement the same cross-process exclusive-lock-with-stale-reclaim
pattern independently: create a lock artifact exclusively, if it already exists either wait
or — when its mtime is older than a 30s threshold — reclaim it as abandoned. Extract one
shared implementation into `lib/fs-lock.js`, point both tools at it, and add a direct unit
test for the shared module. This is a pure refactor: every existing test must keep passing
unmodified, and no tool's externally-observable behavior changes (same lock artifact paths,
same lock kinds — build-site keeps a lock *file*, composite-card-art keeps a lock
*directory* — same staleness threshold, same timeout behavior).

Risk (FIRE): fully reversible (git), no security/user-data/schema impact, behavior-preserving
by construction and verified by the existing test suite plus one new test file. Low risk —
`GATE: none`.

## Design

One function, `withLock(lockPath, fn, options)`, covers both call sites:

- `tools/build-site.js` passes a **sync** `fn` and `kind: 'file'` (the default) — matches
  today's `withBuildLock(fn)`, which opens `LOCK_PATH` as a lock *file* via
  `fs.openSync(LOCK_PATH, 'wx')`.
- `tools/composite-card-art.js` passes an **async** `fn` and `kind: 'dir'` — matches today's
  `withOutDirLock(outDir, fn)`, which creates `${outDir}.lock` as a lock *directory* via
  `fs.mkdirSync(lockDir)`.

`withLock` detects which case it's in by checking whether `fn()`'s return value is a
thenable: if so, it releases the lock after that promise settles (matching
composite-card-art's `try { return await fn(); } finally { release() }`); if not, it
releases synchronously right after `fn()` returns (matching build-site's
`try { fn(); } finally { release() }`). Callers don't need to say which mode they're in —
existing call sites don't change shape (still `withLock(path, () => {...})` /
`await withLock(path, async () => {...}, opts)`).

Both original lock loops busy-wait via the same `Atomics.wait(new Int32Array(new
SharedArrayBuffer(4)), 0, 0, ms)` trick (composite-card-art's version used a non-blocking
`setTimeout` instead, but nothing in the test suite or either tool depends on the wait being
non-blocking — see verification note below — so unifying on the simpler, already-proven
Atomics.wait poll is safe and keeps the module single-code-path).

One deliberate, safe addition: `withLock` always registers a `process.once('exit', ...)`
cleanup handler (today only build-site's lock does this; composite-card-art's doesn't). This
only fires if the process dies mid-lock without going through the normal release path, so it
can't change any currently-tested control flow — it's strictly a safety net gained "for
free" by sharing the implementation, not a functional change either tool relies on.

Everything else in both files (markdown rendering, art compositing, the `writeFileAtomic` /
`renameWithRetry` retry-on-EPERM helpers) is untouched — those are unrelated to the lock
pattern and out of scope.

## Step 1 — Create `lib/fs-lock.js`

Create this new file with exactly this content:

```js
'use strict';

const fs = require('node:fs');

// Shared cross-process exclusive-lock-with-stale-reclaim primitive, used by
// tools/build-site.js (a lock FILE guarding site/ rebuilds) and
// tools/composite-card-art.js (a lock DIRECTORY guarding the renders/*
// swap). Both need: create the lock artifact exclusively; if it already
// exists, wait — unless it looks abandoned (older than STALE_MS, e.g. a
// process killed mid-build never got to clean up), in which case reclaim it
// instead of wedging every future run behind a lock nobody will ever
// release.
const STALE_MS = 30000;
const POLL_MS = 25;

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function isStale(lockPath, staleMs) {
  try {
    return Date.now() - fs.statSync(lockPath).mtimeMs > staleMs;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

// Windows surfaces a concurrent exclusive FILE create (or an AV scanner
// briefly holding the path) as EPERM/EACCES too, not just EEXIST. A
// directory create only ever reports EEXIST.
function isBusyError(err, kind) {
  if (err.code === 'EEXIST') return true;
  if (kind === 'file' && (err.code === 'EPERM' || err.code === 'EACCES')) return true;
  return false;
}

function createLockArtifact(lockPath, kind) {
  if (kind === 'dir') {
    fs.mkdirSync(lockPath);
  } else {
    fs.closeSync(fs.openSync(lockPath, 'wx'));
  }
}

function removeLockArtifact(lockPath, kind) {
  fs.rmSync(lockPath, { recursive: kind === 'dir', force: true });
}

// Blocks (synchronously) until the lock at `lockPath` is acquired.
//   kind: 'file' (default) | 'dir' — the lock artifact type
//   staleMs: age in ms after which a held lock is reclaimed (default 30000)
//   timeoutMs: throw if still waiting after this many ms (default: none —
//     keep retrying; a lock older than staleMs is always eventually
//     reclaimed regardless of timeoutMs)
//   timeoutMessage: error message used when timeoutMs is exceeded
function acquireLock(lockPath, options = {}) {
  const {
    kind = 'file',
    staleMs = STALE_MS,
    timeoutMs = null,
    timeoutMessage = `Timed out waiting for lock: ${lockPath}`,
  } = options;
  const start = Date.now();
  for (;;) {
    try {
      createLockArtifact(lockPath, kind);
      return;
    } catch (err) {
      if (!isBusyError(err, kind)) throw err;
      if (isStale(lockPath, staleMs)) {
        removeLockArtifact(lockPath, kind);
        continue;
      }
      if (timeoutMs !== null && Date.now() - start > timeoutMs) {
        throw new Error(timeoutMessage);
      }
      sleep(POLL_MS);
    }
  }
}

function releaseLock(lockPath, options = {}) {
  removeLockArtifact(lockPath, options.kind || 'file');
}

// Runs `fn` while holding the lock at `lockPath`, releasing it once `fn`
// completes (or throws/rejects) — and also on process exit, in case the
// process dies mid-`fn` before the normal release path runs. Returns
// whatever `fn` returns; if that's a thenable, the lock is held until it
// settles (await the result).
function withLock(lockPath, fn, options = {}) {
  acquireLock(lockPath, options);
  const kind = options.kind || 'file';
  const releaseOnExit = () => removeLockArtifact(lockPath, kind);
  process.once('exit', releaseOnExit);
  const release = () => {
    process.removeListener('exit', releaseOnExit);
    releaseOnExit();
  };

  let result;
  try {
    result = fn();
  } catch (err) {
    release();
    throw err;
  }

  if (result && typeof result.then === 'function') {
    return result.then(
      (value) => {
        release();
        return value;
      },
      (err) => {
        release();
        throw err;
      }
    );
  }

  release();
  return result;
}

module.exports = { withLock, acquireLock, releaseLock, STALE_MS };
```

## Step 2 — Edit `tools/build-site.js`

### 2a. Replace the requires/constants/lock-function block

Find this block (currently lines 4–67 — the requires down through the closing brace of
`withBuildLock`):

```js
const fs = require('node:fs');
const path = require('node:path');
const { slugify, parseCardMarkdown } = require('../lib/parse-card-markdown');

const REPO_ROOT = path.join(__dirname, '..');
const DESIGN_DIR = path.join(REPO_ROOT, 'design');
const GAME_PLAN_PATH = path.join(REPO_ROOT, 'gamePlan.md');
const SITE_DIR = path.join(REPO_ROOT, 'site');
const LOCK_PATH = path.join(REPO_ROOT, '.site-build.lock');
const COMPOSITED_CARD_ART_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');
// Real Leonardo output lives here (see composite-card-art.js --live); when a
// live render exists for a card it wins over the deterministic mock baseline.
const LIVE_CARD_ART_DIR = path.join(REPO_ROOT, 'renders', 'cards-live');
const CARD_ART_SITE_SUBDIR = '_card-art';

// Concurrent invocations of this script (e.g. from two test files that each
// (re)build site/ before asserting on it) race on rmSync/mkdirSync/writeFileSync
// against the same directory. A simple exclusive lock file serializes builds
// across processes so each run sees a consistent, fully-written site/ tree.
//
// The lock is self-healing: if a lock file is older than LOCK_STALE_MS, it is
// assumed abandoned by a process that was killed before it could clean up
// (Ctrl+C, CI timeout, SIGKILL) and is reclaimed rather than wedging every
// future build behind a 30s timeout with no automatic recovery.
const LOCK_STALE_MS = 30000;

function isLockStale() {
  try {
    return Date.now() - fs.statSync(LOCK_PATH).mtimeMs > LOCK_STALE_MS;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

function withBuildLock(fn) {
  const start = Date.now();
  let fd;
  while (fd === undefined) {
    try {
      fd = fs.openSync(LOCK_PATH, 'wx');
    } catch (err) {
      // Windows surfaces a concurrent exclusive create (or an AV scanner
      // briefly holding the path) as EPERM/EACCES, not just EEXIST — all
      // three mean "lock busy right now", none mean "crash the build".
      if (err.code !== 'EEXIST' && err.code !== 'EPERM' && err.code !== 'EACCES') throw err;
      if (isLockStale()) {
        fs.rmSync(LOCK_PATH, { force: true });
        continue;
      }
      if (Date.now() - start > LOCK_STALE_MS) throw new Error('Timed out waiting for site build lock');
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
  fs.closeSync(fd);
  const releaseOnExit = () => fs.rmSync(LOCK_PATH, { force: true });
  process.once('exit', releaseOnExit);
  try {
    fn();
  } finally {
    process.removeListener('exit', releaseOnExit);
    releaseOnExit();
  }
}
```

Replace it with:

```js
const fs = require('node:fs');
const path = require('node:path');
const { slugify, parseCardMarkdown } = require('../lib/parse-card-markdown');
const { withLock, STALE_MS } = require('../lib/fs-lock');

const REPO_ROOT = path.join(__dirname, '..');
const DESIGN_DIR = path.join(REPO_ROOT, 'design');
const GAME_PLAN_PATH = path.join(REPO_ROOT, 'gamePlan.md');
const SITE_DIR = path.join(REPO_ROOT, 'site');
// Concurrent invocations of this script (e.g. from two test files that each
// (re)build site/ before asserting on it) race on rmSync/mkdirSync/writeFileSync
// against the same directory — lib/fs-lock.js serializes builds across
// processes so each run sees a consistent, fully-written site/ tree.
const LOCK_PATH = path.join(REPO_ROOT, '.site-build.lock');
const COMPOSITED_CARD_ART_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');
// Real Leonardo output lives here (see composite-card-art.js --live); when a
// live render exists for a card it wins over the deterministic mock baseline.
const LIVE_CARD_ART_DIR = path.join(REPO_ROOT, 'renders', 'cards-live');
const CARD_ART_SITE_SUBDIR = '_card-art';
```

(The blank line and `const SECTION_ORDER = [...]` line right after stay exactly as they are —
only the block above them changes.)

### 2b. Update `main()` to call the shared lock

Find (inside `main()`, near the bottom of the file):

```js
function main() {
  withBuildLock(() => {
    fs.mkdirSync(SITE_DIR, { recursive: true });
```

Replace with:

```js
function main() {
  withLock(LOCK_PATH, () => {
    fs.mkdirSync(SITE_DIR, { recursive: true });
```

Find the end of that same callback (still inside `main()`):

```js
    console.log(`Built ${pages.length} pages into ${path.relative(REPO_ROOT, SITE_DIR).split(path.sep).join('/')}/`);
  });
}
```

Replace with:

```js
    console.log(`Built ${pages.length} pages into ${path.relative(REPO_ROOT, SITE_DIR).split(path.sep).join('/')}/`);
  }, { timeoutMs: STALE_MS, timeoutMessage: 'Timed out waiting for site build lock' });
}
```

Nothing else in `tools/build-site.js` changes — the markdown renderer, page builders,
`writeFileAtomic`, `pruneStaleOutputs`, etc. are all untouched.

## Step 3 — Edit `tools/composite-card-art.js`

### 3a. Add the require

Find:

```js
const { slugify, splitIntoH3Sections } = require('../lib/parse-card-markdown');
```

Replace with:

```js
const { slugify, splitIntoH3Sections } = require('../lib/parse-card-markdown');
const { withLock } = require('../lib/fs-lock');
```

### 3b. Remove `LOCK_STALE_MS` and `withOutDirLock`, keep `renameWithRetry`

Find this block (the "Main" section header comment through the end of `withOutDirLock`):

```js
// ---------------------------------------------------------------------------
// Main
//
// OUT_DIR is a shared, on-disk resource that multiple test files (each their
// own OS process under `node --test`) can call main()/runCli() against
// concurrently. The (possibly slow — a real --live run polls Leonardo per
// brief) generation loop writes into a private, uniquely-named temp
// directory first, so it never touches the shared path. Only the final swap
// onto OUT_DIR (remove + rename, a couple of fast fs calls) is guarded by a
// cross-process lock, which keeps that swap from racing another process's
// swap (Windows in particular refuses a rename while another process is
// touching the same directory). The lock itself self-heals: if a holder is
// killed (SIGINT/SIGKILL/OOM) before releasing it, the lock directory goes
// stale and a later run reclaims it instead of hanging forever.
// ---------------------------------------------------------------------------

const LOCK_STALE_MS = 30000; // the guarded section is just a remove+rename, so any lock
// older than this was abandoned by a process that died mid-swap, not one still working.

// Windows refuses to rename a directory while another process holds a
// handle inside it (build-site reading a render, an AV scan) — that
// surfaces as EPERM and clears in milliseconds. Retry briefly instead of
// failing the whole run.
function renameWithRetry(from, to) {
  for (let attempt = 0; ; attempt++) {
    try {
      fs.renameSync(from, to);
      return;
    } catch (err) {
      if ((err.code !== 'EPERM' && err.code !== 'EACCES') || attempt >= 40) throw err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
}

async function withOutDirLock(outDir, fn) {
  const lockDir = `${outDir}.lock`;
  for (;;) {
    try {
      fs.mkdirSync(lockDir);
      break;
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
      let staleMtimeMs = null;
      try {
        staleMtimeMs = fs.statSync(lockDir).mtimeMs;
      } catch (statErr) {
        if (statErr.code !== 'ENOENT') throw statErr;
      }
      if (staleMtimeMs !== null && Date.now() - staleMtimeMs > LOCK_STALE_MS) {
        fs.rmSync(lockDir, { recursive: true, force: true });
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }
  try {
    return await fn();
  } finally {
    fs.rmdirSync(lockDir);
  }
}
```

Replace with:

```js
// ---------------------------------------------------------------------------
// Main
//
// OUT_DIR is a shared, on-disk resource that multiple test files (each their
// own OS process under `node --test`) can call main()/runCli() against
// concurrently. The (possibly slow — a real --live run polls Leonardo per
// brief) generation loop writes into a private, uniquely-named temp
// directory first, so it never touches the shared path. Only the final swap
// onto OUT_DIR (remove + rename, a couple of fast fs calls) is guarded by a
// cross-process lock (lib/fs-lock.js), which keeps that swap from racing
// another process's swap (Windows in particular refuses a rename while
// another process is touching the same directory).
// ---------------------------------------------------------------------------

// Windows refuses to rename a directory while another process holds a
// handle inside it (build-site reading a render, an AV scan) — that
// surfaces as EPERM and clears in milliseconds. Retry briefly instead of
// failing the whole run.
function renameWithRetry(from, to) {
  for (let attempt = 0; ; attempt++) {
    try {
      fs.renameSync(from, to);
      return;
    } catch (err) {
      if ((err.code !== 'EPERM' && err.code !== 'EACCES') || attempt >= 40) throw err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
}
```

### 3c. Update the call site inside `main()`

Find:

```js
    await withOutDirLock(outDir, async () => {
      // Two renames instead of rm+rename: if the second rename fails partway
```

Replace with:

```js
    await withLock(`${outDir}.lock`, async () => {
      // Two renames instead of rm+rename: if the second rename fails partway
```

Find the closing of that same call (still inside `main()`):

```js
      if (hadExisting) {
        fs.rmSync(backupDir, { recursive: true, force: true });
      }
    });
```

Replace with:

```js
      if (hadExisting) {
        fs.rmSync(backupDir, { recursive: true, force: true });
      }
    }, { kind: 'dir' });
```

Nothing else in `tools/composite-card-art.js` changes — brief loading, `compositeArtWindow`,
the mock/live client wiring, `runCli`, and `module.exports` are all untouched (note
`withOutDirLock` was never in `module.exports`, so removing it doesn't touch the export list).

## Step 4 — Create `test/fs-lock-dedup.test.js`

Create this new file with exactly this content:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const FS_LOCK_MODULE_PATH = path.join(REPO_ROOT, 'lib', 'fs-lock.js');
const { withLock } = require('../lib/fs-lock');

// A standalone worker script (written to a temp file and run as its own
// process) that acquires the lock, records a start/end timestamp around a
// deliberate hold, and releases. Two of these spawned back-to-back is how
// this file proves mutual exclusion across real OS processes — a single
// Node process can't demonstrate "two concurrent acquire attempts" against
// a synchronous, blocking lock implementation.
const WORKER_SOURCE = [
  "'use strict';",
  "const { withLock } = require(process.argv[2]);",
  "const fs = require('node:fs');",
  'const lockPath = process.argv[3];',
  'const logPath = process.argv[4];',
  'const holdMs = Number(process.argv[5]);',
  'const label = process.argv[6];',
  '',
  'withLock(lockPath, () => {',
  "  fs.appendFileSync(logPath, label + ' start ' + Date.now() + '\\n');",
  '  const sab = new Int32Array(new SharedArrayBuffer(4));',
  '  Atomics.wait(sab, 0, 0, holdMs);',
  "  fs.appendFileSync(logPath, label + ' end ' + Date.now() + '\\n');",
  "}, { kind: 'file' });",
  '',
].join('\n');

function uniquePath(prefix) {
  return path.join(os.tmpdir(), `${prefix}-${process.pid}-${crypto.randomBytes(6).toString('hex')}`);
}

function spawnHolder(workerPath, lockPath, logPath, label, holdMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [workerPath, FS_LOCK_MODULE_PATH, lockPath, logPath, String(holdMs), label]);
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code !== 0) reject(new Error(`worker ${label} exited with code ${code}: ${stderr}`));
      else resolve();
    });
  });
}

test('AC4: a second concurrent acquire attempt is excluded until the first process releases the lock', async (t) => {
  const lockPath = uniquePath('fs-lock-test-mutex') + '.lock';
  const logPath = uniquePath('fs-lock-test-mutex') + '.log';
  const workerPath = uniquePath('fs-lock-test-worker') + '.js';
  fs.writeFileSync(workerPath, WORKER_SOURCE, 'utf8');

  t.after(() => {
    fs.rmSync(lockPath, { force: true });
    fs.rmSync(logPath, { force: true });
    fs.rmSync(workerPath, { force: true });
  });

  // Launch both holders back-to-back; whichever wins the race holds the
  // lock for 150ms while the other has to wait for the release.
  await Promise.all([
    spawnHolder(workerPath, lockPath, logPath, 'A', 150),
    spawnHolder(workerPath, lockPath, logPath, 'B', 150),
  ]);

  const events = fs
    .readFileSync(logPath, 'utf8')
    .trim()
    .split('\n')
    .map((line) => {
      const [label, kind, ts] = line.split(' ');
      return { label, kind, ts: Number(ts) };
    });

  assert.strictEqual(events.length, 4, `expected 4 lock events (start/end x2), got: ${JSON.stringify(events)}`);

  const starts = events.filter((e) => e.kind === 'start').sort((a, b) => a.ts - b.ts);
  const ends = events.filter((e) => e.kind === 'end').sort((a, b) => a.ts - b.ts);

  assert.ok(
    starts[1].ts >= ends[0].ts,
    `expected non-overlapping lock windows (mutual exclusion), got starts=${JSON.stringify(starts)} ends=${JSON.stringify(ends)}`
  );
});

test('AC4: a lock artifact older than the stale threshold is reclaimed instead of blocking forever', (t) => {
  const lockPath = uniquePath('fs-lock-test-stale') + '.lock';
  t.after(() => fs.rmSync(lockPath, { recursive: true, force: true }));

  // Simulate a lock directory abandoned by a killed process: create the
  // artifact directly (bypassing withLock, so nothing is "waiting" on it),
  // then backdate its mtime past the default 30s staleness threshold.
  fs.mkdirSync(lockPath);
  const staleTime = new Date(Date.now() - 40000);
  fs.utimesSync(lockPath, staleTime, staleTime);

  let ran = false;
  withLock(
    lockPath,
    () => {
      ran = true;
    },
    { kind: 'dir' }
  );

  assert.strictEqual(ran, true, 'expected withLock to reclaim the stale lock and run fn() instead of hanging');
  assert.ok(!fs.existsSync(lockPath), 'expected the lock artifact to be removed after release');
});
```

## Step 5 — Verify

Run, in order:

1. `node --test test/fs-lock-dedup.test.js`
   Expected: both new tests pass —
   `# pass 2`, `# fail 0` in the summary.

2. `node --test test/build-site.test.js test/build-site-card-art.test.js test/build-site-cards-index.test.js test/build-site-index-search.test.js`
   Expected: all pass, unmodified from before this change (build-site's observable behavior —
   pages written, lock file used at `.site-build.lock`, timeout error message on contention —
   is unchanged).

3. `node --test test/composite-card-art.test.js test/composite-card-art-alt.test.js test/leonardo-art-client.test.js`
   Expected: all pass, unmodified (compositing behavior, `renders/cards-composited/` output,
   and the `${outDir}.lock` directory artifact are unchanged).

4. Full suite — `node --test` (or `npm test`, which runs `node --test --test-concurrency=1`)
   Expected: **0 failures**. This is AC5 — the complete pre-existing suite plus the two new
   `test/fs-lock-dedup.test.js` tests, all green.

If step 4 fails on a file unrelated to build-site/composite-card-art/fs-lock, stop and
investigate before assuming it's caused by this change — this refactor should not be able to
affect unrelated test files at all (no other file imports `withBuildLock`, `isLockStale`, or
`withOutDirLock` — confirmed by repo-wide search before writing this plan).

## Explicitly out of scope

- Do not change `writeFileAtomic`, `pruneStaleOutputs`, or any markdown-rendering code in
  `tools/build-site.js`.
- Do not change brief-loading, `compositeArtWindow`, `runCli`, or the live/mock client wiring
  in `tools/composite-card-art.js`.
- Do not add a "no local declaration" structural test (like `test/tools-loader-dedup.test.js`
  has for the markdown-parser dedup) — it's not in this unit's acceptance criteria; the
  removal is verified by code review plus the full suite staying green.
- Do not change `.gitignore` — `.site-build.lock` is already listed there and stays a file,
  not a directory, so the existing entry is still correct.


## Findings

# Blind Review — cardgame-tools-fs-lock-dedup, cycle 1

## Method note

The diff supplied for review rendered `tools/build-site.js` as `Binary files a/tools/build-site.js and b/tools/build-site.js differ` — git/GNU diff both classify it as binary. I could not review that file's actual changes from the diff text alone, so I checked out both blobs (`HEAD` and `HEAD~1`) from the repo directly and produced a real text diff out-of-band. Root cause: the file contains 4 literal NUL (0x00) bytes embedded inside a template-literal/regex pair used for markdown inline-code token protection (`` `${NUL}${protectedTokens.length}${NUL}` `` and `/${NUL}(\d+)${NUL}/g`). I confirmed the NUL byte count is unchanged (4 in both `HEAD~1` and `HEAD`) and the bytes sit at the same logical code location before and after this diff — **this is pre-existing file corruption/quirk, not introduced by this diff.** It's flagged here for visibility only; it does not gate the merge, and fixing it is out of scope for a "behavior-preserving refactor" unit.

I was also unable to execute `node --test` in this review sandbox (all `node`/`node --test` invocations were blocked pending interactive approval I don't have in this session). I compensated with close static review of the actual diffs (recovered from the binary blob for build-site.js, and directly from the supplied diff for the other files) plus reading the untouched test files to confirm no test depends on removed internals.

## AC-by-AC

**AC1** — `lib/fs-lock.js` exists (new file, matches plan.md's Step 1 content exactly) and exports `withLock`/`acquireLock`/`releaseLock`/`STALE_MS`. `acquireLock` creates the lock artifact exclusively, on a busy error checks `isStale` (mtimeMs vs `staleMs`, default 30000) and reclaims if so, otherwise optionally times out or sleeps and retries. `test/fs-lock-dedup.test.js` adds three direct tests: cross-process mutual exclusion (spawns two real child processes racing for a file lock, asserts non-overlapping hold windows), stale-lock reclaim (backdates a lock dir's mtime past the threshold, asserts `withLock` still runs `fn`), and non-stale-not-reclaimed (fresh lock dir, asserts a short `timeoutMs` throws rather than silently reclaiming). Satisfied.

**AC2** — Recovered the real diff for `tools/build-site.js`: the local `LOCK_STALE_MS`/`isLockStale`/`withBuildLock` block is fully removed, `const { withLock, STALE_MS } = require('../lib/fs-lock')` is added, and `main()`'s call site changes from `withBuildLock(() => {...})` to `withLock(LOCK_PATH, () => {...}, { timeoutMs: STALE_MS, timeoutMessage: 'Timed out waiting for site build lock' })`. Checked the control flow against the removed original: same order of checks (stale-reclaim before timeout-check before sleep), same 30000ms threshold used for both staleness and timeout (matching the original's dual use of `LOCK_STALE_MS`), same error message. `test/build-site.test.js` is not touched by the diff and contains no assertions referencing `withBuildLock`, `isLockStale`, `LOCK_STALE_MS`, `LOCK_PATH`, or the lock-timeout error message — nothing in it depends on the removed internals. Satisfied.

**AC3** — `tools/composite-card-art.js` diff (visible directly in the supplied diff, not binary): local `withOutDirLock` and `LOCK_STALE_MS` are removed, `const { withLock } = require('../lib/fs-lock')` is added, and the call site becomes `await withLock(\`${outDir}.lock\`, async () => {...}, { kind: 'dir' })` (no `timeoutMs`, matching the original's unbounded-retry-until-stale-reclaim behavior). One real mechanical change here: the original composite-card-art poll used a non-blocking `setTimeout(resolve, 20)` between retries; the shared module always uses a blocking `Atomics.wait(..., 25)` poll (plan.md calls this out explicitly as a deliberate unification). I checked `test/composite-card-art.test.js` — no test invokes `main()` concurrently within a single process or otherwise exercises lock contention/interleaving, so the sync-vs-async poll change is not observable by the existing suite. `test/composite-card-art.test.js` is unmodified in the diff. Satisfied.

**AC5** — Could not execute `node --test` directly in this sandboxed review session (command execution required interactive approval unavailable here). Compensating evidence: (a) the recovered build-site.js diff is a mechanical, behavior-preserving substitution verified line-by-line against the removed original; (b) the composite-card-art.js diff shown in the supplied diff is likewise a clean substitution with only the documented poll-mechanism change, which the existing tests don't exercise; (c) neither pre-existing test file references any removed symbol; (d) the new `test/fs-lock-dedup.test.js` is self-contained (spawns its own worker processes, uses `os.tmpdir()` paths, cleans up via `t.after`) and doesn't touch shared fixtures the other suites depend on. I could not personally confirm a green run and say so plainly rather than asserting it.

## Findings

None. No INTRODUCED defects found. The one anomaly discovered (NUL bytes in `tools/build-site.js`) is confirmed pre-existing (identical byte count in `HEAD~1` before this unit's diff) and is noted for visibility, not as a gating finding.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T05:36:16.409Z] **bolt:start** — unit=cardgame-tools-fs-lock-dedup start_sha=01724d36724d9698bef13d74da96d6228eb952ee branch=bolt/cardgame-tools-fs-lock-dedup worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-tools-fs-lock-dedup
- [2026-07-30T05:36:26.004Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T05:44:18.309Z] **plan:done** — plan.md written
- [2026-07-30T05:46:26.660Z] **tests:done** — RED verified on test/fs-lock-dedup.test.js (exit=1)
- [2026-07-30T05:49:31.837Z] **build:c1** — tests green, committed
- [2026-07-30T05:55:43.764Z] **review:c1** — APPROVE
- [2026-07-30T06:01:30.352Z] **review:devils-advocate** — APPROVE
- [2026-07-30T06:01:39.139Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T06:01:39.474Z] **merge:done** — auto-merged bolt/cardgame-tools-fs-lock-dedup into master (worktree)


## Receipt

```json
{
  "start_sha": "01724d36724d9698bef13d74da96d6228eb952ee",
  "end_sha": "4c48999fe21bc3e707ad21f451f01a1fc582117b",
  "diff_nonempty": true,
  "test_cmd": "node --test",
  "exit_code": 0,
  "criteria_covered": [
    {
      "id": "AC1",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC2",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC3",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": true,
      "passed": true
    },
    {
      "id": "AC5",
      "held_out": false,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-30T06:01:39.138Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-tools-fs-lock-dedup\\plan.md` (`GATE: none`).\n\nSummary of the approach:\n- **New `lib/fs-lock.js`**: a single `withLock(lockPath, fn, options)` that unifies both existing lock implementations — parameterized by `kind: 'file'|'dir'` (build-site keeps a lock file, composite-card-art keeps a lock directory, exactly as today) and detecting sync vs. async `fn` automatically via thenable-checking, so both call sites keep their current shapes.\n- **`tools/build-site.js`**: removes `isLockStale`/`withBuildLock`, requires `withLock`/`STALE_MS` from the new lib, and calls `withLock(LOCK_PATH, fn, { timeoutMs: STALE_MS, timeoutMessage: '...' })` — preserving the original timeout behavior exactly.\n- **`tools/composite-card-art.js`**: removes `withOutDirLock` (keeps the unrelated `renameWithRetry` helper), requires `withLock`, calls it with `{ kind: 'dir' }`.\n- **New `test/fs-lock-dedup.test.js`** (AC4, held-out): one test spawns two real child processes racing for the same lock file and asserts their held-windows don't overlap (mutual exclusion); a second test pre-creates a stale lock directory with a backdated mtime and asserts `withLock` reclaims it instead of hanging.\n\nI verified via grep that no test or other code references `withBuildLock`/`isLockStale`/`withOutDirLock` directly, so the extraction is safe and existing tests need no changes.",
    "test_writer": "The test file looks correct — it requires `../lib/fs-lock`, which doesn't exist yet, so `node --test` on this file will fail to load (RED), confirming the feature isn't implemented. Since `node` execution requires approval I can't manually run in this session, I verified correctness by inspection instead.\n\nSummary: Created `test/fs-lock-dedup.test.js` with three tests covering AC1 (the shared `lib/fs-lock.js` lock module):\n1. Mutual exclusion across two real spawned processes contending for the same lock file.\n2. Stale-lock reclaim (artifact older than 30s threshold gets reclaimed, `fn()` runs).\n3. Fresh-lock non-reclaim (artifact younger than threshold times out instead of being silently reclaimed).\n\nNo files under `tools/` or `lib/` were touched — only the new test file was added. AC2/AC3/AC5 aren't new-test targets since they assert existing tests stay green unmodified, which is inherently verified once the refactor lands and the full `node --test` suite (including this new file) passes.",
    "builder_c1": "Only the two tools files modified plus the new `lib/fs-lock.js` — `test/` is untouched. Full suite is green (902/902 passing).\n\nImplementation complete: created `lib/fs-lock.js` with the shared `withLock`/`acquireLock`/`releaseLock` primitive, updated `tools/build-site.js` and `tools/composite-card-art.js` to use it instead of their local lock functions, and the full `node --test` suite passes with 0 failures (including the pre-existing RED tests in `test/fs-lock-dedup.test.js`, now green).",
    "reviewer_c1": "Findings written to `C:\\github\\AgentBox\\units\\cardgame-tools-fs-lock-dedup\\findings.md`. Summary: all four visible ACs (AC1, AC2, AC3, AC5) are satisfied. The diff's `tools/build-site.js` entry rendered as \"binary\" in the supplied diff — I recovered the real change out-of-band and confirmed it matches AC2 exactly (removed local lock functions, delegates to `lib/fs-lock.js`, preserves timeout/staleness semantics). Traced that to 4 pre-existing NUL bytes in the file (unchanged count before/after this diff, so not introduced here). Could not execute `node --test` in this sandboxed session, so AC5 is backed by close static verification rather than an actual test run — disclosed plainly in the findings. No INTRODUCED defects found.\n\nAPPROVE",
    "devils_advocate": "Devil's Advocate summary:\n\nThe strongest lead was that `git diff` renders `tools/build-site.js` as `Binary files ... differ` — completely opaque, meaning the first-cycle reviewer could not have visually verified AC2 from the diff text alone. I pulled the actual blob content (working around the binary flag, which turns out to be caused by a pre-existing `\\0` sentinel-token delimiter in `renderInline`, present in both HEAD~1 and HEAD — not introduced by this diff) and read it directly:\n\n- `require('../lib/fs-lock')` is present, `withBuildLock`/`isLockStale` are fully gone, and `main()` calls `withLock(LOCK_PATH, fn, { timeoutMs: STALE_MS, timeoutMessage: 'Timed out waiting for site build lock' })` — the exact same error message and 30000ms threshold as the original, satisfying AC2.\n- Cross-checked `lib/fs-lock.js`'s `acquireLock` against the original `withBuildLock`/`withOutDirLock` implementations line-by-line: same order of operations (busy → stale-check → reclaim-or-timeout-check → 25ms poll), same `EEXIST`/Windows `EPERM`/`EACCES` handling split by file-vs-dir kind, same exit-handler release pattern. `composite-card-art.js`'s call site (`withLock(`${outDir}.lock`, fn, { kind: 'dir' })`, no timeout) also matches its original infinite-retry semantics exactly.\n- The only behavioral delta I found is releasing a lock via `fs.rmSync({recursive, force:true})` instead of the original directory lock's plain `fs.rmdirSync` — harmless since the lock directory is always empty at release time.\n\nI wasn't able to execute `node --test` myself (blocked by sandbox approval for any node invocation), so AC5 rests on static verification rather than a live run, which is a real gap in this pass — but I found no evidence of behavior divergence to justify blocking on it.\n\nAttack failed — no INTRODUCED defect found.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
