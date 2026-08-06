# cardgame-jaina-card-sync-dryrun: cardGame tool — dry-run sync of card data into Jaina (content backbone, slice 1)

## Header

- unit: cardgame-jaina-card-sync-dryrun
- title: cardGame tool — dry-run sync of card data into Jaina (content backbone, slice 1)
- project: cardgame
- completed: 2026-07-28
- outcome: merged
- start_sha: d7673b33e7f1ab053669aa666a400a69857f2010
- end_sha: ea578a09118d6c90440931c23aeed732fbb69450

## Intent

User directive (2026-07-28, verbatim, logged in design/ideas-inbox.md): "Oh also we need to make heavy use of Jaina the whole way which was built for this exact thing." ideas-inbox.md notes the authoring tools (card engine, design browser) should read from/write to Jaina rather than inventing their own storage, with markdown remaining the narrative/spec layer and Jaina holding the structured data layer. This is the first, deliberately narrow slice under that directive (T1 discipline: no decided schema exists yet, so this unit does not claim the full 'heavy use... the whole way' scope) — a dry-run sync tool, tools/sync-cards-to-jaina.js, that parses design/cards/*.md with the same field-prefix convention tools/render-card.js and tools/build-site.js already use, and prints the exact JSON record payloads a future live-sync step would write to a Jaina 'cards' schema. No live Jaina API calls are made by this unit — that follow-up is deferred until RouterBox reviews the printed schema shape, keeping this unit's acceptance checks network-free and deterministic under node --test. This is content-authoring tooling, not game implementation, so it falls within the T16 partial software-gate opening.

## Acceptance Criteria

- AC1 [paraphrase]: node tools/sync-cards-to-jaina.js --dry-run exits 0 and prints exactly one JSON object per card record found under design/cards/ (18 for the current alpha-set.md), each object carrying name, slug, costLine, typeLine, rulesText, and statsLine fields sourced by the same 'Cost line:'/'Type line:'/'Rules text:'/'Stats/counters line:' field-prefix parsing convention render-card.js and build-site.js already use.
- AC2 [inferred]: slug is computed with the identical slugify(name) algorithm already used in tools/render-card.js (lowercase, non-alphanumeric runs collapsed to a single hyphen, leading/trailing hyphens trimmed), so the same card produces the same slug across the card-authoring engine and this sync tool.
- AC3 [inferred]: Without --dry-run, the script makes no Jaina API calls in this unit — it prints a message that live sync is not yet implemented and exits 1 — so no Jaina credentials or network access are required by node --test or by this unit's acceptance checks.
- AC4 [inferred] (held_out): Running the dry-run twice in a row against unchanged markdown produces byte-identical stdout output (deterministic: no timestamps, no randomness, stable card and field ordering).

## Plan

GATE: none

# Plan: cardgame-jaina-card-sync-dryrun

## Summary

Add a new CLI tool, `tools/sync-cards-to-jaina.js`, that parses `design/cards/*.md`
with the exact same shared parser the card engine already uses
(`lib/parse-card-markdown.js`), and in `--dry-run` mode prints one JSON object
per line (NDJSON) per parsed card — the record payload shape a future live
Jaina sync step would write to a `cards` schema. Without `--dry-run` it makes
no network calls at all; it just prints a "not implemented yet" message and
exits 1. This unit does **not** touch Jaina, add a dependency, or call any
`mcp__jaina__*` tool — it's a pure, deterministic, offline preview.

This is a small, single-bolt unit: one new tool file + one new test file,
built entirely by copying the existing `tools/render-card.js` /
`lib/parse-card-markdown.js` / `test/render-card.test.js` conventions. No
split needed.

## Risk self-assessment (FIRE)

- **Reversibility:** trivial — two new files, nothing existing is modified. `git revert`/delete is a full undo.
- **Impact/blast radius:** none outside this repo — no writes to `renders/`, `site/`, or any existing file; no Jaina project/schema/record is touched (no network call is made at all, dry-run or not).
- **Security:** no credentials, no network I/O, no subprocess spawning, no dynamic `eval`.
- **User data / schema changes:** none — this unit only *prints* a proposed schema shape to stdout for RouterBox to review; it does not create or modify any Jaina schema.

Given all of that, `GATE: none`.

## Held-out AC check

AC4 (held out — byte-identical stdout across two consecutive `--dry-run`
runs) is redundant with the visible intent already stated in unit.md itself
("deterministic ... stable card and field ordering", "network-free and
deterministic under `node --test`"). It's novel only in its specifics (run
twice, diff stdout), not in requirement — no spec bug to flag.

## File 1 (new): `tools/sync-cards-to-jaina.js`

Create this file with exactly this content:

```js
#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parseCardMarkdown, slugify } = require('../lib/parse-card-markdown');

const REPO_ROOT = path.join(__dirname, '..');
const CARDS_DIR = path.join(REPO_ROOT, 'design', 'cards');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented in this unit. Re-run with --dry-run ' +
  'to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Card loading — design/cards/*.md via the shared parser (lib/parse-card-markdown.js)
// ---------------------------------------------------------------------------

function loadCardsFromFile(absPath) {
  const markdown = fs.readFileSync(absPath, 'utf8');
  return parseCardMarkdown(markdown);
}

function loadAllCards() {
  const files = fs
    .readdirSync(CARDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
  const cards = [];
  for (const file of files) {
    cards.push(...loadCardsFromFile(path.join(CARDS_DIR, file)));
  }
  return cards;
}

// ---------------------------------------------------------------------------
// Jaina 'cards' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(card) {
  return {
    name: card.name,
    slug: slugify(card.name),
    costLine: card.costLine,
    typeLine: card.typeLine,
    rulesText: card.rulesText,
    statsLine: card.statsLine,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!dryRun) {
    console.error(NOT_IMPLEMENTED_MESSAGE);
    process.exitCode = 1;
    return;
  }

  const cards = loadAllCards();
  for (const card of cards) {
    console.log(JSON.stringify(buildRecord(card)));
  }
}

main();
```

Notes for the implementer:
- This mirrors `tools/render-card.js`'s `loadCardsFromFile`/`loadAllCards`
  exactly (same sorted-filename directory walk), so ordering across files is
  deterministic and matches the render tool.
- `slugify` is *imported*, not reimplemented — this is what makes AC2 true by
  construction (same function object as `tools/render-card.js` uses via the
  same `lib/parse-card-markdown.js` module), not just by coincidentally
  matching logic.
- Output is NDJSON: one `console.log(JSON.stringify(...))` call per card, no
  banner/summary line in `--dry-run` mode. That's what makes AC1's "prints
  exactly one JSON object per card record" literally true — stdout has
  exactly N lines, each one JSON object, nothing else.
- The non-dry-run message goes to **stderr** via `console.error`, and the
  script sets `process.exitCode = 1` (not `process.exit(1)`) so stdout/stderr
  fully flush before the process exits.
- Do not add any `require('http')`, `require('https')`, `fetch(...)`, or
  `mcp__jaina__*` usage anywhere in this file — this unit is dry-run only.

## File 2 (new): `test/sync-cards-to-jaina.test.js`

Create this file with exactly this content:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-cards-to-jaina.js');
const CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'alpha-set.md');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// A level-3 section only counts as a card record if it carries the three
// required fields — same convention render-card.test.js relies on for this file.
function listExpectedCards() {
  const content = fs.readFileSync(CARDS_PATH, 'utf8');
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }))
    .filter(
      (c) =>
        c.body.includes('Cost line:') &&
        c.body.includes('Type line:') &&
        c.body.includes('Rules text:')
    );
}

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly one JSON object per card record
// found under design/cards/, each carrying name, slug, costLine, typeLine,
// rulesText, and statsLine.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints one JSON record per card with the required fields', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-cards-to-jaina.js --dry-run` to exit 0');

  const expectedCards = listExpectedCards();
  assert.strictEqual(expectedCards.length, 18, 'expected 18 cards in design/cards/alpha-set.md');

  const lines = parseLines(stdout);
  assert.strictEqual(
    lines.length,
    expectedCards.length,
    `expected exactly ${expectedCards.length} JSON lines, got ${lines.length}`
  );

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  const expectedNames = new Set(expectedCards.map((c) => c.title));
  for (const record of records) {
    assert.ok(expectedNames.has(record.name), `unexpected card name "${record.name}" in sync output`);
    assert.strictEqual(typeof record.slug, 'string');
    assert.strictEqual(typeof record.costLine, 'string');
    assert.strictEqual(typeof record.typeLine, 'string');
    assert.strictEqual(typeof record.rulesText, 'string');
    assert.ok(
      record.statsLine === null || typeof record.statsLine === 'string',
      'expected statsLine to be a string or null'
    );
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      ['costLine', 'name', 'rulesText', 'slug', 'statsLine', 'typeLine'],
      `expected record for "${record.name}" to carry exactly the name/slug/costLine/typeLine/rulesText/statsLine fields`
    );
  }
});

// ---------------------------------------------------------------------------
// AC2: slug is computed with the identical slugify(name) algorithm already
// used in tools/render-card.js.
// ---------------------------------------------------------------------------

test('AC2: slug matches the render-card.js slugify(name) algorithm', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.ok(records.length > 0, 'expected at least one record to check slugs against');
  for (const record of records) {
    assert.strictEqual(
      record.slug,
      slugify(record.name),
      `expected slug "${record.slug}" for "${record.name}" to match slugify(name)`
    );
  }

  // Spot-check a name with an apostrophe, matching parse-card-markdown.test.js's
  // slugify coverage of "Oathbreaker's Toll" -> "oathbreaker-s-toll".
  const toll = records.find((r) => r.name === "Oathbreaker's Toll");
  assert.ok(toll, 'expected to find "Oathbreaker\'s Toll" in the sync output');
  assert.strictEqual(toll.slug, 'oathbreaker-s-toll');
});

// ---------------------------------------------------------------------------
// AC3: without --dry-run, the script makes no Jaina API calls — it prints a
// message that live sync is not yet implemented and exits 1.
// ---------------------------------------------------------------------------

test('AC3: without --dry-run, the script exits 1 and prints a live-sync-not-implemented message', () => {
  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-cards-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(
    /not yet implemented/i.test(output) && /live sync/i.test(output),
    `expected a "live sync ... not yet implemented" message, got: ${output}`
  );

  const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(
    !/require\(\s*['"](?:https?|child_process)['"]\s*\)/.test(scriptSource),
    'expected no network or subprocess module usage in the sync script'
  );
  assert.ok(!/\bfetch\s*\(/.test(scriptSource), 'expected no fetch() calls to a Jaina API');
});

// ---------------------------------------------------------------------------
// AC4 (held_out): running the dry-run twice in a row against unchanged
// markdown produces byte-identical stdout output.
// ---------------------------------------------------------------------------

test('AC4: running --dry-run twice in a row produces byte-identical stdout', () => {
  const first = runDryRun();
  const second = runDryRun();
  assert.strictEqual(first, second, 'expected two consecutive --dry-run runs to produce identical stdout');
});
```

## Expected outputs

- `node tools/sync-cards-to-jaina.js --dry-run` — exits 0, prints 18 lines to
  stdout, nothing to stderr. First line (for "Unwritten Hour", the first card
  in `design/cards/alpha-set.md`):

  ```
  {"name":"Unwritten Hour","slug":"unwritten-hour","costLine":"3 Tangle","typeLine":"Magic","rulesText":"Fast. When this resolves, choose an entry in the Queue other than this one and move it to the front of the Queue.","statsLine":null}
  ```

  (`statsLine` is `null` because this card has no `Stats/counters line:` field
  — same optional-field behavior as `lib/parse-card-markdown.js` already
  implements and `parse-card-markdown.test.js` already covers.)

- `node tools/sync-cards-to-jaina.js` (no flag) — exits 1, prints nothing to
  stdout, prints to stderr:

  ```
  Live sync to Jaina is not yet implemented in this unit. Re-run with --dry-run to preview the record payloads a future live-sync step would write.
  ```

- `node --test` — all existing tests continue to pass unchanged, plus 4 new
  passing tests from `test/sync-cards-to-jaina.test.js` (AC1–AC4). Total test
  file count in `test/` goes from 15 to 16; no existing file is modified.

## Out of scope (do not implement)

- No live Jaina API calls, no `mcp__jaina__*` tool usage, no schema creation,
  no `jaina_create_record`/`jaina_create_schema` calls anywhere in this unit.
- No changes to `tools/render-card.js`, `tools/build-site.js`,
  `lib/parse-card-markdown.js`, or any `design/cards/*.md` file — this unit
  only adds the two new files listed above.
- No `package.json` dependency additions (Node core modules only, same as
  every other tool in `tools/`).


## Findings

# Blind Review — cardgame-jaina-card-sync-dryrun, cycle 1

## Diff summary
Two new files, matching plan.md verbatim:
- `tools/sync-cards-to-jaina.js` — dry-run NDJSON preview of the future Jaina `cards` record shape, sourced via the pre-existing shared parser `lib/parse-card-markdown.js` (not touched by this diff).
- `test/sync-cards-to-jaina.test.js` — tests for AC1–AC3 plus a held-out AC4 (byte-identical stdout across two runs).

No existing files are modified.

## AC verification

**AC1** (`--dry-run` exits 0, prints exactly one JSON object per card with name/slug/costLine/typeLine/rulesText/statsLine) — verified statically:
- `design/cards/` contains only `alpha-set.md` (confirmed via directory listing), so `loadAllCards()` reads exactly that file.
- `alpha-set.md` has exactly 18 `###` (level-3) headings (confirmed via grep), each formatted with `Cost line:`/`Type line:`/`Rules text:` as line-start prefixes (spot-checked), matching both the test's `listExpectedCards` filter and the real parser's stricter field-prefix logic in `lib/parse-card-markdown.js`.
- `buildRecord()` in the tool emits exactly the six required keys, one `console.log(JSON.stringify(...))` per card, nothing else on stdout (the "not implemented" message goes to stderr in the non-dry-run path only). Exit code is not set in the dry-run path, so it remains 0.
- **PASS.**

**AC2** (slug identical to `tools/render-card.js`'s algorithm) — `tools/render-card.js` imports `slugify` from `../lib/parse-card-markdown` (confirmed by reading render-card.js:6), and `tools/sync-cards-to-jaina.js` imports the identical `slugify` from the same module (same file, same function object) rather than reimplementing it. AC2 is true by construction. The test's spot-check name `"Oathbreaker's Toll"` exists in `alpha-set.md` at line 28, so the apostrophe-handling assertion isn't checking a fictitious card.
- **PASS.**

**AC3** (no `--dry-run` ⇒ exit 1, prints not-yet-implemented message, no network/API calls) — `main()` checks `process.argv.includes('--dry-run')`; if absent, writes `NOT_IMPLEMENTED_MESSAGE` to stderr via `console.error` and sets `process.exitCode = 1` (not `process.exit(1)`, so streams flush before exit — correct per plan's own note). The script's only `require`s are `node:fs`, `node:path`, and the local parser module; no `http`/`https`/`child_process`/`fetch`/`mcp__jaina__*` usage anywhere in the file (confirmed by reading the full diff).
- **PASS.**

## Findings

None. I was unable to execute `node --test` directly in this review sandbox (all Bash/PowerShell invocations required approval that wasn't available), so verification here is static/by-inspection rather than by running the suite — but the file contents, shared-module wiring, and source card data all check out consistently, and the diff is a verbatim match for plan.md's specified file contents.

No PRE-EXISTING issues are in scope since the diff touches no existing files.

## AC coverage checklist
- AC1: accounted for — PASS
- AC2: accounted for — PASS
- AC3: accounted for — PASS
- AC4 (held-out, not gating): test included in diff, consistent with stated intent; no spec bug.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T10:36:20.901Z] **bolt:start** — unit=cardgame-jaina-card-sync-dryrun start_sha=d7673b33e7f1ab053669aa666a400a69857f2010 branch=bolt/cardgame-jaina-card-sync-dryrun worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-jaina-card-sync-dryrun
- [2026-07-28T10:36:23.918Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T10:40:00.766Z] **plan:done** — plan.md written
- [2026-07-28T10:41:28.228Z] **tests:done** — RED verified on test/sync-cards-to-jaina.test.js (exit=1)
- [2026-07-28T10:42:23.109Z] **build:c1** — tests green, committed
- [2026-07-28T10:44:15.206Z] **review:c1** — APPROVE
- [2026-07-28T10:46:43.052Z] **review:devils-advocate** — APPROVE
- [2026-07-28T10:46:46.790Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-28T10:46:47.058Z] **merge:done** — auto-merged bolt/cardgame-jaina-card-sync-dryrun into master (worktree)


## Receipt

```json
{
  "start_sha": "d7673b33e7f1ab053669aa666a400a69857f2010",
  "end_sha": "c2743d3808da7d851fd91a7d946784586a14f43a",
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
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-28T10:46:46.788Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-jaina-card-sync-dryrun\\plan.md`.\n\nSummary: `GATE: none`. Two new files — `tools/sync-cards-to-jaina.js` (reuses `lib/parse-card-markdown.js`'s `parseCardMarkdown`/`slugify`; `--dry-run` prints one NDJSON line per card, no-flag prints a stderr message and exits 1) and `test/sync-cards-to-jaina.test.js` covering AC1–AC4, including the held-out determinism check. No existing files touched, no Jaina network calls anywhere in this unit.",
    "test_writer": "It looks like this command needs manual approval from you to run. Could you approve it (or let me know if you'd rather I not run tests)? It's just `node --test test/sync-cards-to-jaina.test.js`, read-only, to confirm the new tests currently fail as expected.",
    "builder_c1": "Only the new tool file was added; `test/` is untouched. Full suite is green (318/318 passing).",
    "reviewer_c1": "Findings written to `C:\\github\\AgentBox\\units\\cardgame-jaina-card-sync-dryrun\\findings.md`. All three visible ACs check out: shared parser/slugify reuse makes AC2 true by construction, `design/cards/` contains only the 18-card `alpha-set.md` matching AC1's expected count and field format, and AC3's non-dry-run path correctly exits 1 via stderr with no network/subprocess code present anywhere in the new file. No existing files were touched, so there's nothing to flag as pre-existing either. I couldn't execute `node --test` in this sandbox (all shell calls required unavailable approval), so this is a static/inspection-based verification, but everything cross-checks cleanly.\n\nAPPROVE",
    "devils_advocate": "I attempted to execute the test suite directly (`node --test test/sync-cards-to-jaina.test.js`) but the harness requires interactive approval for that command that isn't available in this pass, so I fell back to careful static verification instead.\n\n**What I checked:**\n- `lib/parse-card-markdown.js` is pre-existing (already consumed by `tools/render-card.js`), not introduced by this diff — the new script correctly reuses it rather than reinventing parsing/slugify logic, satisfying the \"same convention\" requirement in AC1/AC2.\n- Verified via grep that neither `design/cards/art-briefs.md` nor `design/cards/card-anatomy.md` contain line-start `Cost line:`/`Type line:`/`Rules text:` fields, so `loadAllCards()` (which reads all `*.md` files in `design/cards/`, same as `render-card.js`) produces exactly the 18 records from `alpha-set.md` that AC1 requires — no false-positive card records sneak in from the other two files.\n- Confirmed all 18 `###` headings in `alpha-set.md` including `Oathbreaker's Toll`, matching the AC2 spot-check slug (`oathbreaker-s-toll`) against the shared `slugify` regex.\n- `tools/sync-cards-to-jaina.js` main(): dry-run path only reads local files and `console.log`s JSON; non-dry-run path sets `process.exitCode = 1` and writes to stderr — no network/subprocess calls, matching AC3's static-source assertions.\n- No existing files were modified — this is a pure two-file addition (script + test), so no regression surface against other tests.\n- Output order is deterministic (sorted file list, stable array iteration), satisfying the held-out AC4 byte-identical-repeat check.\n\nI could not get a live test run to confirm pass/fail due to tooling restrictions in this pass, which is a limitation of this review, but static tracing of both the test assertions and the implementation shows they agree at every point I checked, and I found no case where the code would diverge from an AC.\n\nNo INTRODUCED defect survives scrutiny.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
