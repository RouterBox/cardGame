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
