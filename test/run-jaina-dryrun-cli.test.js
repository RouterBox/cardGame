'use strict';

const test = require('node:test');
const assert = require('node:assert');

const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

function captureConsole(t) {
  const logs = [];
  const errors = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => logs.push(args.join(' '));
  console.error = (...args) => errors.push(args.join(' '));
  t.after(() => {
    console.log = originalLog;
    console.error = originalError;
  });
  return { logs, errors };
}

function withRestoredExitCode(t) {
  const original = process.exitCode;
  t.after(() => {
    process.exitCode = original;
  });
}

// AC5: dry-run mode prints one JSON line per input record, in order
test('AC5: dry-run mode prints one JSON line per input record, in order, and leaves the exit code untouched', (t) => {
  withRestoredExitCode(t);
  process.exitCode = undefined;
  const { logs, errors } = captureConsole(t);

  const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const buildRecord = (item) => ({ doubled: item.id * 2 });

  runDryRunSyncCli({
    loadItems: () => items,
    buildRecord,
    notImplementedMessage: 'should not be printed',
    argv: ['node', 'script.js', '--dry-run'],
  });

  assert.strictEqual(process.exitCode, undefined, 'expected dry-run mode not to set an exit code');
  assert.strictEqual(errors.length, 0, 'expected no console.error output in dry-run mode');
  assert.deepStrictEqual(logs, [
    JSON.stringify({ doubled: 2 }),
    JSON.stringify({ doubled: 4 }),
    JSON.stringify({ doubled: 6 }),
  ]);
});

// AC5: dry-run mode with zero records prints nothing
test('AC5: dry-run mode with zero records prints nothing and never calls buildRecord', (t) => {
  withRestoredExitCode(t);
  process.exitCode = undefined;
  const { logs, errors } = captureConsole(t);

  runDryRunSyncCli({
    loadItems: () => [],
    buildRecord: () => {
      throw new Error('buildRecord must not be called for an empty list');
    },
    notImplementedMessage: 'should not be printed',
    argv: ['node', 'script.js', '--dry-run'],
  });

  assert.strictEqual(process.exitCode, undefined);
  assert.deepStrictEqual(logs, []);
  assert.deepStrictEqual(errors, []);
});

// AC5: non-dry-run mode prints the passed-in message and yields exit code 1
test('AC5: non-dry-run mode prints the passed-in message, sets exit code 1, and never loads or builds records', (t) => {
  withRestoredExitCode(t);
  process.exitCode = undefined;
  const { logs, errors } = captureConsole(t);
  let loadItemsCalled = false;

  runDryRunSyncCli({
    loadItems: () => {
      loadItemsCalled = true;
      return [];
    },
    buildRecord: () => {
      throw new Error('buildRecord must not be called without --dry-run');
    },
    notImplementedMessage: 'custom not-implemented message for this tool',
    argv: ['node', 'script.js'],
  });

  assert.strictEqual(process.exitCode, 1);
  assert.strictEqual(loadItemsCalled, false, 'expected loadItems not to be called without --dry-run');
  assert.deepStrictEqual(logs, []);
  assert.deepStrictEqual(errors, ['custom not-implemented message for this tool']);
});

// AC1: the module exports exactly one function, the shared CLI entry point
test('AC1: lib/run-jaina-dryrun-cli.js exports a single runDryRunSyncCli function', () => {
  // eslint-disable-next-line global-require
  const mod = require('../lib/run-jaina-dryrun-cli');
  assert.strictEqual(typeof mod.runDryRunSyncCli, 'function');
  assert.deepStrictEqual(Object.keys(mod), ['runDryRunSyncCli']);
});
