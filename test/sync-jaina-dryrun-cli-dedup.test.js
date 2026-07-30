'use strict';

// Verifies the cardgame-jaina-sync-tools-dryrun-cli-dedup refactor: each of
// sync-lore-eras-to-jaina.js, sync-founts-to-jaina.js, and
// sync-star-atlas-to-jaina.js must delegate its dry-run/not-implemented CLI
// control flow to lib/run-jaina-dryrun-cli.js's runDryRunSyncCli, exactly
// like tools/sync-characters-to-jaina.js already does, instead of inlining
// that logic by hand.
//
// This file does NOT touch the existing black-box subprocess tests for
// these tools (test/sync-lore-eras-to-jaina.test.js,
// test/sync-founts-to-jaina.test.js, test/sync-star-atlas-to-jaina.test.js)
// per the unit's explicit instructions -- those must keep passing unmodified
// (AC3). It adds independent coverage for the source-level delegation shape
// (AC1) and the untouched public shape of each tool module (AC2).

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');

const TOOLS = [
  {
    label: 'sync-lore-eras-to-jaina.js',
    toolRelPath: '../tools/sync-lore-eras-to-jaina.js',
    parseModuleRelPath: '../lib/parse-lore-markdown',
    loadItemsName: 'loadAllEras',
  },
  {
    label: 'sync-founts-to-jaina.js',
    toolRelPath: '../tools/sync-founts-to-jaina.js',
    parseModuleRelPath: '../lib/parse-founts-markdown',
    loadItemsName: 'loadAllFounts',
  },
  {
    label: 'sync-star-atlas-to-jaina.js',
    toolRelPath: '../tools/sync-star-atlas-to-jaina.js',
    parseModuleRelPath: '../lib/parse-star-atlas-markdown',
    loadItemsName: 'loadAllWorlds',
  },
];

const LIB_PATH = require.resolve('../lib/run-jaina-dryrun-cli');

function withMockedRunDryRunSyncCli(mockRunDryRunSyncCli, fn) {
  const original = require.cache[LIB_PATH];
  require.cache[LIB_PATH] = {
    id: LIB_PATH,
    filename: LIB_PATH,
    loaded: true,
    exports: { runDryRunSyncCli: mockRunDryRunSyncCli },
  };
  try {
    return fn();
  } finally {
    if (original) {
      require.cache[LIB_PATH] = original;
    } else {
      delete require.cache[LIB_PATH];
    }
  }
}

// Every tool file calls its own main() unconditionally at require-time, and
// (both before and after the refactor) that main() ends up touching
// process.exitCode / console.error when --dry-run isn't in this test
// process's real argv. Isolate that side effect so requiring these files
// for inspection never pollutes the overall `node --test` run.
function requireToolModuleIsolated(scriptPath, { mockRunDryRunSyncCli } = {}) {
  delete require.cache[scriptPath];
  const originalExitCode = process.exitCode;
  const originalLog = console.log;
  const originalError = console.error;
  console.log = () => {};
  console.error = () => {};

  const load = () => require(scriptPath);

  try {
    const toolModule = mockRunDryRunSyncCli
      ? withMockedRunDryRunSyncCli(mockRunDryRunSyncCli, load)
      : load();
    return toolModule;
  } finally {
    console.log = originalLog;
    console.error = originalError;
    process.exitCode = originalExitCode;
    delete require.cache[scriptPath];
  }
}

for (const { label, toolRelPath, parseModuleRelPath, loadItemsName } of TOOLS) {
  const scriptPath = require.resolve(toolRelPath);

  // ---------------------------------------------------------------------
  // AC1: the file imports runDryRunSyncCli from lib/run-jaina-dryrun-cli
  // ---------------------------------------------------------------------
  test(`AC1: ${label} requires runDryRunSyncCli from lib/run-jaina-dryrun-cli`, () => {
    const source = fs.readFileSync(scriptPath, 'utf8');
    assert.ok(
      /require\(\s*['"]\.\.\/lib\/run-jaina-dryrun-cli['"]\s*\)/.test(source),
      `expected ${label} to require '../lib/run-jaina-dryrun-cli'`
    );
    assert.ok(
      /const\s*\{\s*runDryRunSyncCli\s*\}\s*=\s*require\(\s*['"]\.\.\/lib\/run-jaina-dryrun-cli['"]\s*\)/.test(
        source
      ),
      `expected ${label} to destructure runDryRunSyncCli from the '../lib/run-jaina-dryrun-cli' require`
    );
  });

  // ---------------------------------------------------------------------
  // AC1: main() calls runDryRunSyncCli, passing this tool's own loadItems
  // function, buildRecord, NOT_IMPLEMENTED_MESSAGE, and process.argv --
  // instead of inlining the --dry-run / not-implemented control flow.
  // ---------------------------------------------------------------------
  test(`AC1: ${label} main() delegates to runDryRunSyncCli with its own loadItems/buildRecord/message/argv`, () => {
    let capturedArgs = null;
    const toolModule = requireToolModuleIsolated(scriptPath, {
      mockRunDryRunSyncCli: (args) => {
        capturedArgs = args;
      },
    });

    assert.ok(
      capturedArgs,
      `expected ${label}'s main() to call runDryRunSyncCli instead of inlining the dry-run control flow`
    );

    const { [loadItemsName]: expectedLoadItems } = require(parseModuleRelPath);
    assert.strictEqual(
      capturedArgs.loadItems,
      expectedLoadItems,
      `expected ${label} to pass its own ${loadItemsName} as loadItems`
    );
    assert.strictEqual(
      capturedArgs.buildRecord,
      toolModule.buildRecord,
      `expected ${label} to pass its exported buildRecord`
    );
    assert.strictEqual(
      capturedArgs.notImplementedMessage,
      toolModule.NOT_IMPLEMENTED_MESSAGE,
      `expected ${label} to pass its exported NOT_IMPLEMENTED_MESSAGE`
    );
    assert.strictEqual(
      capturedArgs.argv,
      process.argv,
      `expected ${label} to pass process.argv through unmodified`
    );
  });

  // ---------------------------------------------------------------------
  // AC1: the file's own main() no longer reimplements the dry-run check
  // by hand (no direct process.argv.includes('--dry-run') / exitCode=1
  // inlining outside of the shared helper).
  // ---------------------------------------------------------------------
  test(`AC1: ${label} no longer inlines the --dry-run / exitCode=1 control flow in its own source`, () => {
    const source = fs.readFileSync(scriptPath, 'utf8');
    assert.ok(
      !/process\.argv\.includes\(\s*['"]--dry-run['"]\s*\)/.test(source),
      `expected ${label} not to inline its own '--dry-run' check`
    );
    assert.ok(
      !/process\.exitCode\s*=\s*1/.test(source),
      `expected ${label} not to set process.exitCode = 1 directly (that belongs to the shared helper)`
    );
  });

  // ---------------------------------------------------------------------
  // AC2: the file keeps its own buildRecord + NOT_IMPLEMENTED_MESSAGE and
  // an unchanged module.exports shape.
  // ---------------------------------------------------------------------
  test(`AC2: ${label} still exports exactly { buildRecord, NOT_IMPLEMENTED_MESSAGE }`, () => {
    const toolModule = requireToolModuleIsolated(scriptPath);

    assert.deepStrictEqual(Object.keys(toolModule).sort(), ['NOT_IMPLEMENTED_MESSAGE', 'buildRecord']);
    assert.strictEqual(typeof toolModule.buildRecord, 'function');
    assert.strictEqual(typeof toolModule.NOT_IMPLEMENTED_MESSAGE, 'string');
    assert.ok(toolModule.NOT_IMPLEMENTED_MESSAGE.includes('--dry-run'));
  });

  // ---------------------------------------------------------------------
  // AC3: the refactor must be behavior-preserving -- spawning the real CLI
  // (unmodified by this test) still exits 1 with the not-implemented
  // message when --dry-run is absent, and exits 0 printing JSON when
  // --dry-run is present. This guards the same observable contract that
  // the existing black-box test files (left untouched) assert on.
  // ---------------------------------------------------------------------
  test(`AC3: ${label} still exits 1 with its not-implemented message when run without --dry-run`, () => {
    let error;
    try {
      execFileSync('node', [scriptPath], { cwd: REPO_ROOT, encoding: 'utf8' });
    } catch (err) {
      error = err;
    }
    assert.ok(error, `expected \`node ${path.relative(REPO_ROOT, scriptPath)}\` (no flag) to exit non-zero`);
    assert.strictEqual(error.status, 1);
    assert.ok(/not yet implemented/i.test(`${error.stdout || ''}${error.stderr || ''}`));
  });

  test(`AC3: ${label} still exits 0 and prints one JSON line per item when run with --dry-run`, () => {
    const stdout = execFileSync('node', [scriptPath, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
    const lines = stdout.split('\n').filter((line) => line.trim() !== '');
    assert.ok(lines.length > 0, `expected at least one JSON line from ${label} --dry-run`);
    for (const line of lines) {
      assert.doesNotThrow(() => JSON.parse(line), `expected valid JSON line from ${label}: ${line}`);
    }
  });
}
