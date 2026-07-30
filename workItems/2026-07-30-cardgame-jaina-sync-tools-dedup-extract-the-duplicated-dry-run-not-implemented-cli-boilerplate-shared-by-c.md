# cardgame-jaina-sync-tools-dedup: Extract the duplicated dry-run/not-implemented CLI boilerplate shared by cardGame's Jaina sync tools into one lib helper

## Header

- unit: cardgame-jaina-sync-tools-dedup
- title: Extract the duplicated dry-run/not-implemented CLI boilerplate shared by cardGame's Jaina sync tools into one lib helper
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: aada29365c197956d5d6684fe179c17b58115281
- end_sha: ef921e4fc208781dd5233e161f30be48c76aacf5

## Intent

tools/sync-characters-to-jaina.js and tools/sync-races-to-jaina.js each hand-roll the identical control flow: check process.argv for --dry-run; if absent, console.error a 'not yet implemented' message naming --dry-run and exit 1; if present, load records and console.log(JSON.stringify(buildRecord(item))) once per record. Nothing about this flow is tool-specific except the loader function, the buildRecord() field mapping, and the wording of the not-implemented message. Add lib/run-jaina-dryrun-cli.js exporting a single function, runDryRunSyncCli({ loadItems, buildRecord, notImplementedMessage, argv }), that performs exactly this shared flow and returns/sets the appropriate exit code; have both tools/sync-characters-to-jaina.js and tools/sync-races-to-jaina.js import it and call it from main(), keeping their own buildRecord() and loader imports (lib/parse-character-markdown.js, lib/parse-race-markdown.js) untouched so record shape and field mapping cannot drift. Do not touch tools/sync-cards-to-jaina.js — it already has a real credential-gated live-sync path (resolveLiveClient/runLiveSync) that is a materially different shape, not a copy of this stub pattern, and its live-sync decision (ms4l0xre) is still pending per T19/T20 — leave it alone. Do not create tools/sync-star-atlas-to-jaina.js, tools/sync-lore-eras-to-jaina.js, or tools/sync-founts-to-jaina.js in this unit; those are separately promoted/queued and may adopt the new helper on their own schedule.

## Acceptance Criteria

- AC1 [inferred]: lib/run-jaina-dryrun-cli.js exports a single function that both tools/sync-characters-to-jaina.js and tools/sync-races-to-jaina.js call from their main(), replacing each tool's own duplicated --dry-run check, not-implemented/exit-1 branch, and per-record JSON.stringify console.log loop
- AC2 [paraphrase]: node tools/sync-characters-to-jaina.js --dry-run still prints exactly 20 JSON records (name/slug/race/title/bio/threads) in the same file order as before the refactor, and node tools/sync-races-to-jaina.js --dry-run still prints the same race records as before, both byte-identical to pre-refactor output
- AC3 [paraphrase]: test/sync-characters-to-jaina.test.js and test/sync-races-to-jaina.test.js pass unmodified against the refactored tools, including each suite's AC4 check that the tool's own source file contains no jaina-client/network/subprocess references
- AC4 [inferred] (held_out): Without --dry-run, each tool still exits 1 and prints its own tool-specific not-implemented message (mentioning 'characters' or 'races' by name, not a generic shared string that loses the per-tool wording), and still requires no JAINA_API_KEY/JAINA_PROJECT_ID in the environment
- AC5 [inferred]: lib/run-jaina-dryrun-cli.js has its own direct unit test exercising both branches (dry-run mode prints one JSON line per input record in order; non-dry-run mode prints the passed-in message and yields exit code 1) independent of either sync tool

## Plan

GATE: none

# Unit: cardgame-jaina-sync-tools-dedup

## Summary

`tools/sync-characters-to-jaina.js` and `tools/sync-races-to-jaina.js` currently
duplicate the exact same `--dry-run` control flow (check `process.argv`, print a
"not yet implemented" message and exit 1 if the flag is absent, otherwise load
records and print one `JSON.stringify(buildRecord(item))` line per record).
Extract that shared flow into a new `lib/run-jaina-dryrun-cli.js` helper and have
both tools call it from `main()`. `buildRecord()` and the loader imports
(`lib/parse-character-markdown.js`, `lib/parse-race-markdown.js`) stay exactly as
they are — only the control-flow wrapper moves.

**Do not touch** `tools/sync-cards-to-jaina.js` (different shape — has a real
credential-gated live-sync path, live-sync decision ms4l0xre still pending per
T19/T20) and **do not create** `tools/sync-star-atlas-to-jaina.js`,
`tools/sync-lore-eras-to-jaina.js`, or `tools/sync-founts-to-jaina.js` (those
already exist in this repo but are out of scope for this unit — leave every line
of them untouched too).

This is a pure refactor: no behavior change, no new dependencies, no schema/data
changes. Risk is low (FIRE: fully reversible via git revert, no security
surface, no user data, no schema).

## Files to create

### 1. `lib/run-jaina-dryrun-cli.js` (new file)

```js
'use strict';

// Shared --dry-run control flow for Jaina sync tools that have no live-sync
// path yet. Each tool supplies its own loader, record shape, and wording;
// this module owns only the argv check, the not-implemented/exit-1 branch,
// and the per-record JSON print loop.
function runDryRunSyncCli({ loadItems, buildRecord, notImplementedMessage, argv }) {
  const dryRun = argv.includes('--dry-run');

  if (!dryRun) {
    console.error(notImplementedMessage);
    process.exitCode = 1;
    return;
  }

  const items = loadItems();
  for (const item of items) {
    console.log(JSON.stringify(buildRecord(item)));
  }
}

module.exports = { runDryRunSyncCli };
```

Notes for the implementer:
- `argv` is required (always pass `process.argv` from the caller) — no default
  fallback, both call sites supply it explicitly.
- Do not catch errors from `loadItems()` or `buildRecord()` — let them throw
  and crash the process exactly as the current duplicated code does (neither
  tool has a try/catch today).
- Do not add a return value beyond `undefined`/implicit — exit-code handling is
  fully owned by this function via `process.exitCode`, so callers just invoke
  it and do nothing else.

### 2. `test/run-jaina-dryrun-cli.test.js` (new file)

Direct unit test for the helper, independent of either sync tool (AC5).

```js
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

test('dry-run mode prints one JSON line per input record, in order, and leaves the exit code untouched', (t) => {
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

test('dry-run mode with zero records prints nothing', (t) => {
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

test('non-dry-run mode prints the passed-in message, sets exit code 1, and never loads or builds records', (t) => {
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
```

Expected output of `node --test test/run-jaina-dryrun-cli.test.js`: all 3 tests
pass (`# pass 3`, `# fail 0`).

## Files to modify

### 3. `tools/sync-characters-to-jaina.js`

Replace the whole file with:

```js
#!/usr/bin/env node
'use strict';

const { loadAllCharacters } = require('../lib/parse-character-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for characters in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'characters' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(character) {
  return {
    name: character.name,
    slug: character.slug,
    race: character.race,
    title: character.title,
    bio: character.bio,
    threads: character.threads,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  runDryRunSyncCli({
    loadItems: loadAllCharacters,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
```

Only change from the current file: `main()`'s body is replaced by a single
`runDryRunSyncCli(...)` call; the `--dry-run` check, the not-implemented/exit-1
branch, and the per-record print loop are gone from this file (they now live
in `lib/run-jaina-dryrun-cli.js`). `buildRecord`, `NOT_IMPLEMENTED_MESSAGE`,
the `loadAllCharacters` import, and the trailing `module.exports` are
byte-identical to before.

### 4. `tools/sync-races-to-jaina.js`

Replace the whole file with:

```js
#!/usr/bin/env node
'use strict';

const { loadAllRaces } = require('../lib/parse-race-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for races in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'races' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(race) {
  return {
    name: race.name,
    slug: race.slug,
    identity: race.identity,
    primaryStrength: race.primaryStrength,
    complementaryStrengths: race.complementaryStrengths,
    counteringWeaknesses: race.counteringWeaknesses,
    signatureHooks: race.signatureHooks,
    visualIdentity: race.visualIdentity,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  runDryRunSyncCli({
    loadItems: loadAllRaces,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
```

Same shape of change as file 3: only `main()`'s body changes.

## Files that must NOT change

- `tools/sync-cards-to-jaina.js` — different shape (credential-gated live
  sync), leave untouched.
- `tools/sync-star-atlas-to-jaina.js`, `tools/sync-lore-eras-to-jaina.js`,
  `tools/sync-founts-to-jaina.js` — separately queued, leave untouched.
- `lib/parse-character-markdown.js`, `lib/parse-race-markdown.js` — loaders
  stay untouched so record shape/field mapping cannot drift.
- `test/sync-characters-to-jaina.test.js`, `test/sync-races-to-jaina.test.js`
  — must pass unmodified (AC3). Do not edit them to make the refactor "fit" —
  if they fail, the refactor is wrong, not the tests.

## Why this satisfies the ACs

- **AC1**: `lib/run-jaina-dryrun-cli.js` exports the single
  `runDryRunSyncCli` function; both tools' `main()` call it and no longer
  contain their own argv check / exit-1 branch / print loop.
- **AC2**: `buildRecord()` and the loaders are untouched, and the print loop
  inside `runDryRunSyncCli` does exactly what the old inline loop did
  (`console.log(JSON.stringify(buildRecord(item)))` once per item, in the
  order `loadItems()` returns them) — so `--dry-run` output is byte-identical
  to before the refactor for both tools.
- **AC3**: Neither test file is touched. They exercise the tools only via
  `execFileSync` and by reading `tools/*.js` source text for forbidden
  patterns (`https`/`child_process`/`fetch`/`jaina-client`) — the refactored
  tool files still contain none of those; they only gain a
  `require('../lib/run-jaina-dryrun-cli')`, which matches none of the banned
  patterns.
- **AC4**: Each tool still passes its own `NOT_IMPLEMENTED_MESSAGE` (mentioning
  "characters" or "races" by name) into `runDryRunSyncCli`, which prints that
  exact string via `console.error` and sets `process.exitCode = 1` — no
  generic shared wording is ever printed to the user. No `JAINA_API_KEY`/
  `JAINA_PROJECT_ID` are read anywhere in this path.
- **AC5**: `test/run-jaina-dryrun-cli.test.js` exercises
  `runDryRunSyncCli` directly (no `execFileSync`, no dependency on either
  tool file) covering both the dry-run branch (ordered JSON-per-record,
  no exit code set) and the non-dry-run branch (passed-in message printed,
  exit code 1, loader/builder never invoked).

## Verification steps (for the build/test hat, not to run yourself)

1. `node --test` from the repo root — expect the full suite green, including:
   - `test/run-jaina-dryrun-cli.test.js` — 3 new passing tests.
   - `test/sync-characters-to-jaina.test.js` — all existing tests still pass
     unmodified.
   - `test/sync-races-to-jaina.test.js` — all existing tests still pass
     unmodified.
   - `test/sync-cards-to-jaina.test.js`, `test/sync-founts-to-jaina.test.js`,
     `test/sync-lore-eras-to-jaina.test.js`,
     `test/sync-star-atlas-to-jaina.test.js` — unaffected, still pass (files
     not touched).
2. Manual sanity check (optional, mirrors AC2):
   `node tools/sync-characters-to-jaina.js --dry-run | wc -l` → `20`;
   `node tools/sync-races-to-jaina.js --dry-run | wc -l` → `5`;
   `node tools/sync-characters-to-jaina.js` (no flag) → exits 1, stderr
   mentions "characters"; `node tools/sync-races-to-jaina.js` (no flag) →
   exits 1, stderr mentions "races".

## Risk assessment (FIRE)

- **Fully reversible**: pure code move within the repo, revertible with
  `git revert`.
- **Impact**: local dev tooling only, no production/runtime code path, no
  deployed service.
- **Reach**: two files modified, one file added, one test file added. No
  other tool/lib touched.
- **Exposure**: no security surface (no network/credentials/subprocess
  involved in this code path), no user data, no schema change.

GATE: none — safe to implement without further confirmation.


## Findings

# Blind Review — cardgame-jaina-sync-tools-dedup, cycle 1

## Method note
Test execution was not permitted in this reviewer session (all `node --test`
invocations were blocked pending approval that never arrived), so verification
was done statically: full read of `lib/run-jaina-dryrun-cli.js`,
`test/run-jaina-dryrun-cli.test.js`, both refactored tool files, both existing
tool test suites, and `git diff --stat` scoped to every file the spec calls
out as off-limits (all empty — confirmed untouched).

## AC-by-AC

- **AC1** — `lib/run-jaina-dryrun-cli.js` exports exactly one function,
  `runDryRunSyncCli`, matching the plan's implementation verbatim (argv check,
  not-implemented/exit-1 branch, per-record print loop, no try/catch added).
  Both `tools/sync-characters-to-jaina.js` and `tools/sync-races-to-jaina.js`
  now call it from `main()`, and the old duplicated argv-check/exit-1/print-loop
  code is gone from both files (confirmed via diff hunks — only `main()`'s body
  changed). **Met.**

- **AC2** — Diffed `buildRecord()`, `NOT_IMPLEMENTED_MESSAGE`, and the loader
  imports in both tool files: byte-identical to the plan's "untouched" claim
  (same field mappings: name/slug/race/title/bio/threads for characters;
  8-field shape for races). The new shared helper performs the exact same
  `argv.includes('--dry-run')` → `loadItems()` → `console.log(JSON.stringify(buildRecord(item)))`
  sequence the duplicated code did, so output is logically guaranteed
  byte-identical. Not run end-to-end due to sandbox restriction on this
  session (see Method note) — this is a coverage gap in verification, not a
  defect in the diff. **Plausibly met, unexecuted.**

- **AC3** — `test/sync-characters-to-jaina.test.js` and
  `test/sync-races-to-jaina.test.js` are absent from the diff (`git diff
  --stat` scoped to both returns empty) — unmodified, as required. Read
  both suites' AC4 tests: they grep the tool's own source file for
  `require('https'|'child_process')`, `fetch(`, and `jaina-client`. The
  refactored tool files only `require` their existing loader lib and the new
  `../lib/run-jaina-dryrun-cli` — none of those strings appear, so the grep
  checks still pass by inspection. **Met (statically verified).**

- **AC5** — `test/run-jaina-dryrun-cli.test.js` is a new file with 4 tests
  exercising `runDryRunSyncCli` directly (not through either tool): dry-run
  with records, dry-run with zero records, non-dry-run message/exit-code/no-load
  behavior, and single-export shape. Matches plan's test file exactly.
  **Met.**

## Scope compliance

- `tools/sync-cards-to-jaina.js`, `tools/sync-star-atlas-to-jaina.js`,
  `tools/sync-lore-eras-to-jaina.js`, `tools/sync-founts-to-jaina.js`,
  `lib/parse-character-markdown.js`, `lib/parse-race-markdown.js`: all
  confirmed untouched via `git diff --stat` scoped to each path (empty
  output for all).
- Full diff touches exactly 4 files: the new lib module, its new test file,
  and the two tool files — matching the plan's stated scope with no
  additions.

## Findings

None. No INTRODUCED defects found. The diff is a mechanical, faithful
extraction matching the plan line-for-line.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T15:41:54.014Z] **bolt:start** — unit=cardgame-jaina-sync-tools-dedup start_sha=aada29365c197956d5d6684fe179c17b58115281 branch=bolt/cardgame-jaina-sync-tools-dedup worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-jaina-sync-tools-dedup
- [2026-07-30T15:42:04.908Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T15:44:18.978Z] **plan:done** — plan.md written
- [2026-07-30T15:46:04.300Z] **tests:done** — RED verified on test/run-jaina-dryrun-cli.test.js (exit=1)
- [2026-07-30T15:46:59.828Z] **build:c1** — tests green, committed
- [2026-07-30T15:48:26.290Z] **review:c1** — APPROVE
- [2026-07-30T15:49:44.032Z] **review:devils-advocate** — APPROVE
- [2026-07-30T15:49:53.499Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T15:49:53.872Z] **merge:done** — auto-merged bolt/cardgame-jaina-sync-tools-dedup into master (worktree)


## Receipt

```json
{
  "start_sha": "aada29365c197956d5d6684fe179c17b58115281",
  "end_sha": "fabfef632d421752971cdf46b48f4c21fe63d221",
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
  "timestamp": "2026-07-30T15:49:53.496Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-jaina-sync-tools-dedup\\plan.md`.\n\nSummary: extract the shared `--dry-run` control flow into `lib/run-jaina-dryrun-cli.js` (exports `runDryRunSyncCli`), have `tools/sync-characters-to-jaina.js` and `tools/sync-races-to-jaina.js` call it from `main()` with their own `buildRecord`/loader/message untouched, and add `test/run-jaina-dryrun-cli.test.js` as the helper's own direct unit test. `tools/sync-cards-to-jaina.js` and the star-atlas/lore-eras/founts tools are explicitly out of scope and left alone. Risk is low (pure refactor, fully reversible) — GATE: none.",
    "test_writer": "Wrote `test/run-jaina-dryrun-cli.test.js` — a direct unit test suite for the not-yet-existing `lib/run-jaina-dryrun-cli.js` module, covering:\n\n- **AC5**: dry-run mode prints one JSON line per record in order (untouched exit code), zero-record case prints nothing and never calls `buildRecord`, and non-dry-run mode prints the passed-in message + sets exit code 1 without calling `loadItems`/`buildRecord`.\n- **AC1**: the module exports exactly one function, `runDryRunSyncCli`.\n\nIt fails right now with `MODULE_NOT_FOUND` since `lib/run-jaina-dryrun-cli.js` doesn't exist (confirmed via `ls`). AC2/AC3 are already covered by the existing `test/sync-characters-to-jaina.test.js` and `test/sync-races-to-jaina.test.js` (untouched, per plan — they must keep passing unmodified against the refactored tools). I couldn't execute `node --test` here (sandbox blocked the command), so I didn't confirm the RED run directly — the harness's RED check will verify, but the missing module makes failure certain by construction. No files under `tools/` or `lib/` were touched.",
    "builder_c1": "Clean: only the two tool files modified and the new lib file added, no test/ changes, and the full suite is green (1006/1006). Implementation matches the plan exactly.",
    "reviewer_c1": "APPROVE",
    "devils_advocate": "Reviewed the diff against the actual repo state (both tool files, the new lib module, its dedicated test, and the two existing sync-tool test suites) rather than relying on the diff text alone.\n\nFindings:\n- `lib/run-jaina-dryrun-cli.js` reproduces the extracted control flow exactly (argv check → error+exit1+return, else load+print), matching what both tools previously inlined byte-for-byte. `buildRecord`/loader imports/NOT_IMPLEMENTED_MESSAGE were left untouched in both tools — record shape and wording can't have drifted.\n- Both `tools/sync-*.js` files still execute `main()` at module load and export `{ buildRecord, NOT_IMPLEMENTED_MESSAGE }` unchanged, so the existing test suites (which spawn each tool as a subprocess via `execFileSync` and check stdout/exit code/source-regexes) exercise the real refactored path, not a mock.\n- The new `test/run-jaina-dryrun-cli.test.js` directly covers both branches (ordered per-record printing, empty-list no-op, non-dry-run message+exit-1+no-load) plus an AC1 check that the module exports exactly one function — satisfies AC5.\n- `test/sync-cards-to-jaina.js` / cards tool untouched, no new star-atlas/lore-eras/founts files created — matches the scope restrictions in the intent.\n- `package.json`'s `test` script (`node --test --test-concurrency=1`) globs `test/` by default, so the new test file is picked up automatically without any config change.\n\nI couldn't execute the test suite in this sandbox (Bash/PowerShell run requests were not approved), so this is a static-review verdict, but the diff is a mechanical, narrowly-scoped extraction with no logic changes to output ordering, exit codes, or message text, and every visible AC (1, 2, 3, 5) is independently corroborated by reading the actual post-diff files. I don't find a plausible INTRODUCED failure scenario.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
