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

test('AC1: lib/fs-lock.js withLock excludes a second concurrent acquire attempt until the first process releases', async (t) => {
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

test('AC1: lib/fs-lock.js withLock reclaims a lock artifact older than the stale threshold instead of blocking forever', (t) => {
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

test('AC1: lib/fs-lock.js withLock does not reclaim a lock artifact younger than the stale threshold', (t) => {
  const lockPath = uniquePath('fs-lock-test-fresh') + '.lock';
  t.after(() => fs.rmSync(lockPath, { recursive: true, force: true }));

  // A freshly created (non-stale) lock must be treated as actively held —
  // acquireLock should throw a timeout error rather than reclaiming it.
  fs.mkdirSync(lockPath);

  assert.throws(
    () => {
      withLock(lockPath, () => {}, { kind: 'dir', timeoutMs: 100, timeoutMessage: 'Timed out waiting for lock' });
    },
    /Timed out waiting for lock/,
    'expected withLock to time out rather than silently reclaim a fresh lock'
  );
});
