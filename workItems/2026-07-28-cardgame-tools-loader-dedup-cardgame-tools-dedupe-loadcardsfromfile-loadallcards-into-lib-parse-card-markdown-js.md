# cardgame-tools-loader-dedup: cardGame tools — dedupe loadCardsFromFile/loadAllCards into lib/parse-card-markdown.js

## Header

- unit: cardgame-tools-loader-dedup
- title: cardGame tools — dedupe loadCardsFromFile/loadAllCards into lib/parse-card-markdown.js
- project: cardgame
- completed: 2026-07-28
- outcome: merged
- start_sha: a7ed5f9939b945a8cd78df6f8638246b471689e2
- end_sha: 2814af18631d3a3f45ae1db39e846dc8250fb05c

## Intent

Move the identical loadCardsFromFile/loadAllCards helper pair — currently duplicated verbatim in tools/render-card.js and tools/sync-cards-to-jaina.js — into lib/parse-card-markdown.js (which already owns the CARDS_DIR-adjacent parsing concerns both tools depend on), export it, and update both tools to import the shared version instead of defining their own. This is a pure internal refactor with zero behavior change: it touches only game-authoring tooling explicitly named as in-bounds by T16's software-gate carve-out (tools for content generation/authoring, not gameplay implementation), and it follows the same working pattern as the already-shipped cardgame-tools-shared-parser-dedup unit and test/parse-card-markdown-dedup.test.js — a mechanical, testable assertion that no duplicate logic remains, per T11's guidance that cleanup work must be framed as testable future behavior rather than an assertion about current repo state.

## Acceptance Criteria

- AC1 [paraphrase]: lib/parse-card-markdown.js exports loadCardsFromFile and loadAllCards, which read design/cards/*.md filenames in sorted order and parse each via parseCardMarkdown.
- AC2 [inferred]: tools/render-card.js no longer declares its own loadCardsFromFile or loadAllCards functions; it imports both from lib/parse-card-markdown.js.
- AC3 [inferred]: tools/sync-cards-to-jaina.js no longer declares its own loadCardsFromFile or loadAllCards functions; it imports both from lib/parse-card-markdown.js.
- AC4 [inferred] (held_out): A new test/tools-loader-dedup.test.js statically asserts neither tools/render-card.js nor tools/sync-cards-to-jaina.js source text contains a local function declaration named loadCardsFromFile or loadAllCards, and the existing render-card/sync-cards-to-jaina/composite-card-art test suites still pass unmodified.

## Plan

GATE: none

# Plan: cardgame-tools-loader-dedup

## Summary

`tools/render-card.js` and `tools/sync-cards-to-jaina.js` each declare an
identical `loadCardsFromFile`/`loadAllCards` pair that reads
`design/cards/*.md` filenames in sorted order and parses each via
`parseCardMarkdown`. Move that pair into `lib/parse-card-markdown.js`
(which already owns the CARDS_DIR-adjacent parsing concerns both tools
depend on), export it, and have both tools import the shared version
instead of declaring their own. Zero behavior change — this is the same
shape of change as the already-shipped
`cardgame-tools-shared-parser-dedup` unit.

This is a small, low-risk, purely mechanical refactor. One bolt.

## Risk self-assessment (FIRE)

- **Reversibility**: trivial — pure code move, fully covered by existing
  test suites plus one new static-assertion test. Revert = git revert.
- **Security impact**: none. No user input, no network, no auth surface.
- **User data**: none touched. Tooling only reads local markdown files
  and writes local SVG/JSON output, same as before.
- **Schema changes**: none.

No ambiguity in the spec — proceeding without a confirm gate.

## Files to inspect before starting (context, not to be modified beyond what's listed below)

- `lib/parse-card-markdown.js` — current exports: `parseCardMarkdown`,
  `slugify`, `splitIntoH3Sections`.
- `tools/render-card.js` — current exports include `loadAllCards`
  (re-exported for `tools/composite-card-art.js`, which does
  `const { loadAllCards, ... } = require('./render-card')` and calls
  `loadAllCards()`). **Do not remove `loadAllCards` from
  `tools/render-card.js`'s `module.exports` — only change where the
  function is defined.**
- `tools/composite-card-art.js` — depends on `tools/render-card.js`'s
  re-exported `loadAllCards`. Not modified by this unit, but its test
  (`test/composite-card-art.test.js`) must keep passing unmodified —
  confirms the `render-card.js` re-export chain isn't broken.
- `test/parse-card-markdown-dedup.test.js` — the analogous test from the
  already-shipped `cardgame-tools-shared-parser-dedup` unit. Use as the
  structural template for the new test file.

## Step 1 — `lib/parse-card-markdown.js`: add `fs`/`path` requires and the loader pair

Current top of file (lines 1–7):

```js
'use strict';

// ---------------------------------------------------------------------------
// Markdown parsing — design/cards/*.md field-prefix convention
// ---------------------------------------------------------------------------

const FIELD_PREFIXES = ['Cost line:', 'Type line:', 'Rules text:', 'Stats/counters line:'];
```

Change to:

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const CARDS_DIR = path.join(__dirname, '..', 'design', 'cards');

// ---------------------------------------------------------------------------
// Markdown parsing — design/cards/*.md field-prefix convention
// ---------------------------------------------------------------------------

const FIELD_PREFIXES = ['Cost line:', 'Type line:', 'Rules text:', 'Stats/counters line:'];
```

`lib/parse-card-markdown.js` lives directly under the repo root (in
`lib/`), same nesting depth as `tools/`, so `path.join(__dirname, '..')`
resolves to the same `REPO_ROOT` the tools compute — `CARDS_DIR` here is
byte-for-byte equivalent to the `CARDS_DIR` currently duplicated in both
tools.

Then, immediately before the final `module.exports` line (currently line
100: `module.exports = { parseCardMarkdown, slugify, splitIntoH3Sections };`),
insert the moved functions as a new section:

```js
// ---------------------------------------------------------------------------
// Card loading — design/cards/*.md via parseCardMarkdown above
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
```

Finally, change the last line of the file from:

```js
module.exports = { parseCardMarkdown, slugify, splitIntoH3Sections };
```

to:

```js
module.exports = { parseCardMarkdown, slugify, splitIntoH3Sections, loadCardsFromFile, loadAllCards };
```

This is a pure text-identical move: the function bodies are copied
verbatim from `tools/render-card.js` (its `CARDS_DIR` local was defined
as `path.join(REPO_ROOT, 'design', 'cards')`, which is the same absolute
path as the new lib-level `CARDS_DIR`).

## Step 2 — `tools/render-card.js`: remove the local pair, import from lib

**Edit A** — the require line (currently line 6):

```js
const { parseCardMarkdown, slugify } = require('../lib/parse-card-markdown');
```

becomes:

```js
const { slugify, loadCardsFromFile, loadAllCards } = require('../lib/parse-card-markdown');
```

(`parseCardMarkdown` is dropped from the destructure — after Step 2 Edit
C removes the local `loadCardsFromFile`, `parseCardMarkdown` is no
longer referenced anywhere else in this file. Confirm with
`grep -n parseCardMarkdown tools/render-card.js` — the only other hit
before this edit is inside the function being deleted in Edit C.)

**Edit B** — delete the now-orphaned `CARDS_DIR` constant (currently line
9):

```js
const CARDS_DIR = path.join(REPO_ROOT, 'design', 'cards');
```

Delete this line entirely. (`REPO_ROOT` stays — it's still used by
`OUT_DIR` and by `path.relative(REPO_ROOT, OUT_DIR)` in `main()`. `fs`
and `path` stay too — both are used extensively elsewhere in this file.)

**Edit C** — delete the entire loader section (currently lines 48–68):

```js
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
```

Delete this whole block (including both blank lines immediately
surrounding it, so you go straight from the `parseCostItems`/cost-parsing
section header comment above down to the next section, `// Cost line
parsing (...)`, with the same single blank line of separation the file
uses elsewhere).

**Do not touch** the file's `module.exports` block at the bottom
(currently lines 326–335):

```js
module.exports = {
  INNER_X,
  INNER_Y,
  INNER_WIDTH,
  NAME_SLOT_HEIGHT,
  ART_WINDOW_HEIGHT,
  loadAllCards,
  renderCardSvg,
  escapeXml,
};
```

This continues to work unchanged: `loadAllCards` here now resolves to
the function imported from `lib/parse-card-markdown.js` at the top of
the file (Edit A), not a locally-declared one. `tools/composite-card-art.js`
still gets a working `loadAllCards` through this re-export.

## Step 3 — `tools/sync-cards-to-jaina.js`: remove the local pair, import from lib

This file's `fs`, `path`, `REPO_ROOT`, and `CARDS_DIR` are used **only**
inside the loader pair being removed — confirmed by grepping the file:
`fs.` and `path.` each appear only within lines 8–35 below. So all four
of those get deleted, not just the function bodies.

Current top of file (lines 1–35):

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
```

Replace all of that (lines 1–35) with:

```js
#!/usr/bin/env node
'use strict';

const { slugify, loadCardsFromFile, loadAllCards } = require('../lib/parse-card-markdown');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented in this unit. Re-run with --dry-run ' +
  'to preview the record payloads a future live-sync step would write.';
```

The rest of the file (from `// --- Jaina 'cards' schema record shape ---`
comment through the end, currently lines 36–72) is unchanged — `slugify`
and `loadAllCards` are both still called exactly as before, just sourced
from the shared import. (`loadCardsFromFile` is imported but not called
directly in this file — same as in `render-card.js`, it's pulled in
because AC2/AC3 require both names to be imported from the shared
module, not because this file calls it directly. There's no lint step in
this repo — confirmed no `.eslintrc*`/`eslint.config.*` file exists — so
an unused destructured import doesn't fail any check.)

## Step 4 (held-out AC4) — new `test/tools-loader-dedup.test.js`

Create `C:\github\.agentbox-worktrees\cardGame\cardgame-tools-loader-dedup\test\tools-loader-dedup.test.js`
(repo-relative: `test/tools-loader-dedup.test.js`) with the following
full content:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const RENDER_CARD_PATH = path.join(REPO_ROOT, 'tools', 'render-card.js');
const SYNC_CARDS_PATH = path.join(REPO_ROOT, 'tools', 'sync-cards-to-jaina.js');
const LIB_PATH = path.join(REPO_ROOT, 'lib', 'parse-card-markdown.js');
const LIB_RELATIVE_FROM_TOOLS = '../lib/parse-card-markdown';

const LOADER_FUNCTION_NAMES = ['loadCardsFromFile', 'loadAllCards'];

function assertNoLocalDeclaration(source, filePath, name) {
  const pattern = new RegExp(`function\\s+${name}\\s*\\(`, 'g');
  assert.strictEqual(
    (source.match(pattern) || []).length,
    0,
    `expected no local function ${name}(...) definition left in ${filePath}`
  );
}

function assertImportsBothFromLib(source, filePath) {
  assert.ok(
    source.includes(LIB_RELATIVE_FROM_TOOLS),
    `expected ${filePath} to require('${LIB_RELATIVE_FROM_TOOLS}')`
  );
  const requireLine = source.split('\n').find((line) => line.includes(LIB_RELATIVE_FROM_TOOLS));
  assert.ok(requireLine, `expected to find the require line importing the shared parser in ${filePath}`);
  for (const name of LOADER_FUNCTION_NAMES) {
    assert.ok(
      new RegExp(`\\b${name}\\b`).test(requireLine),
      `expected ${name} to be destructured from the shared import in ${filePath}`
    );
  }
}

// ---------------------------------------------------------------------------
// AC1: lib/parse-card-markdown.js exports loadCardsFromFile and loadAllCards,
// which read design/cards/*.md filenames in sorted order and parse each via
// parseCardMarkdown.
// ---------------------------------------------------------------------------

test('AC1: lib/parse-card-markdown.js exports loadCardsFromFile and loadAllCards functions', () => {
  const mod = require(LIB_PATH);
  assert.strictEqual(typeof mod.loadCardsFromFile, 'function', 'expected an exported loadCardsFromFile function');
  assert.strictEqual(typeof mod.loadAllCards, 'function', 'expected an exported loadAllCards function');
});

test('AC1: loadAllCards reads design/cards/*.md and returns parsed cards', () => {
  const { loadAllCards } = require(LIB_PATH);
  const cards = loadAllCards();
  assert.ok(Array.isArray(cards), 'expected loadAllCards() to return an array');
  assert.ok(cards.length > 0, 'expected at least one card to be loaded from design/cards/');
  for (const card of cards) {
    assert.strictEqual(typeof card.name, 'string');
    assert.strictEqual(typeof card.costLine, 'string');
    assert.strictEqual(typeof card.typeLine, 'string');
    assert.strictEqual(typeof card.rulesText, 'string');
  }
});

// ---------------------------------------------------------------------------
// AC2/AC3/AC4: tools/render-card.js and tools/sync-cards-to-jaina.js no
// longer declare their own loadCardsFromFile/loadAllCards; both import them
// from lib/parse-card-markdown.js instead.
// ---------------------------------------------------------------------------

test('AC2/AC4: tools/render-card.js contains no local loadCardsFromFile/loadAllCards declarations', () => {
  const source = fs.readFileSync(RENDER_CARD_PATH, 'utf8');
  for (const name of LOADER_FUNCTION_NAMES) {
    assertNoLocalDeclaration(source, RENDER_CARD_PATH, name);
  }
});

test('AC2: tools/render-card.js imports loadCardsFromFile and loadAllCards from lib/parse-card-markdown', () => {
  const source = fs.readFileSync(RENDER_CARD_PATH, 'utf8');
  assertImportsBothFromLib(source, RENDER_CARD_PATH);
});

test('AC3/AC4: tools/sync-cards-to-jaina.js contains no local loadCardsFromFile/loadAllCards declarations', () => {
  const source = fs.readFileSync(SYNC_CARDS_PATH, 'utf8');
  for (const name of LOADER_FUNCTION_NAMES) {
    assertNoLocalDeclaration(source, SYNC_CARDS_PATH, name);
  }
});

test('AC3: tools/sync-cards-to-jaina.js imports loadCardsFromFile and loadAllCards from lib/parse-card-markdown', () => {
  const source = fs.readFileSync(SYNC_CARDS_PATH, 'utf8');
  assertImportsBothFromLib(source, SYNC_CARDS_PATH);
});
```

Note: the existing `test/render-card.test.js`, `test/sync-cards-to-jaina.test.js`,
and `test/composite-card-art.test.js` are **not modified** — AC4 requires
they keep passing unmodified, which they will, since this refactor is a
zero-behavior-change move.

## Expected output after implementing

Running the test command from the repo root:

```
node --test
```

should report all suites passing, including (new) `test/tools-loader-dedup.test.js`
and (unmodified, still green) `test/render-card.test.js`,
`test/sync-cards-to-jaina.test.js`, `test/composite-card-art.test.js`,
`test/parse-card-markdown.test.js`, and `test/parse-card-markdown-dedup.test.js`.
No test file names change; no test counts should regress. Sample expected
tail of `node --test` output (exact pass counts vary/grow if the suite
has changed since this plan was written, but the run must exit 0 with
zero failing tests):

```
# pass <N>
# fail 0
```

As a manual sanity check while implementing, these two commands should
still behave exactly as before (same stdout/exit code as pre-refactor):

```
node tools/render-card.js
```
prints `Rendered 18 card(s) into renders/cards/` (or however many cards
`design/cards/alpha-set.md` currently defines) and exits 0.

```
node tools/sync-cards-to-jaina.js --dry-run
```
prints one JSON-per-line record per card and exits 0.

## Verification checklist for the builder

1. `grep -n "function loadCardsFromFile\|function loadAllCards" tools/render-card.js tools/sync-cards-to-jaina.js` → no matches.
2. `grep -n "loadCardsFromFile\|loadAllCards" lib/parse-card-markdown.js` → matches in both the function definitions and `module.exports`.
3. `node --test` → all green, no changes needed to any existing test file.
4. `git diff --stat` → only `lib/parse-card-markdown.js`, `tools/render-card.js`, `tools/sync-cards-to-jaina.js` modified, plus the one new `test/tools-loader-dedup.test.js` file. No other files touched.


## Findings

# Blind Review: cardgame-tools-loader-dedup (cycle 1)

## AC coverage

- **AC1** — `lib/parse-card-markdown.js` now requires `node:fs`/`node:path`, defines `CARDS_DIR = path.join(__dirname, '..', 'design', 'cards')`, and exports `loadCardsFromFile`/`loadAllCards` (reads `*.md` filenames sorted, parses each via `parseCardMarkdown`). Verified `__dirname` for `lib/` resolves to the same repo-root-relative path as the tools' old `CARDS_DIR`. **Satisfied.**
- **AC2** — `tools/render-card.js`: local `loadCardsFromFile`/`loadAllCards` function declarations and the local `CARDS_DIR` constant are removed; both are now destructured from `require('../lib/parse-card-markdown')`. `module.exports.loadAllCards` (relied on by `tools/composite-card-art.js`) now resolves to the imported function — re-export chain intact. **Satisfied.**
- **AC3** — `tools/sync-cards-to-jaina.js`: local loader pair removed, along with the now-fully-unused `fs`, `path`, `REPO_ROOT`, `CARDS_DIR` (confirmed by reading the full file — nothing else in it touches `fs.`/`path.`). Both functions imported from the lib. **Satisfied.**

All three visible ACs are met, and the new test file (`test/tools-loader-dedup.test.js`) exercises each directly.

## Notes (non-blocking)

- `tools/render-card.js`'s require line keeps `parseCardMarkdown` in the destructure even though the function body no longer calls it directly. This looks like plan drift at first glance (plan Step 2 Edit A says to drop it), but it's actually necessary: the pre-existing `test/parse-card-markdown-dedup.test.js` (AC2 of the earlier shipped `cardgame-tools-shared-parser-dedup` unit) asserts the require line still destructures `parseCardMarkdown`. Removing it would have broken that pre-existing, unmodified test. Correct call by the Builder to deviate from the plan's literal text here. Same reasoning covers the now-unused `loadCardsFromFile` destructure in both tool files — dead but harmless (no lint config in the repo enforces `no-unused-vars`).
- Behavior-preservation is covered transitively by the pre-existing `test/render-card.test.js`, `test/sync-cards-to-jaina.test.js`, and `test/composite-card-art.test.js`, none of which were modified — they still spawn the tools as child processes and assert on real output.

## INTRODUCED findings

None found.

## PRE-EXISTING findings

None observed in the touched regions (this is a pure code move; nothing pre-existing in the touched files stood out as a defect).

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T13:37:53.694Z] **bolt:start** — unit=cardgame-tools-loader-dedup start_sha=a7ed5f9939b945a8cd78df6f8638246b471689e2 branch=bolt/cardgame-tools-loader-dedup worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-tools-loader-dedup
- [2026-07-28T13:38:07.534Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T13:42:26.570Z] **plan:done** — plan.md written
- [2026-07-28T13:43:47.271Z] **tests:done** — RED verified on test/tools-loader-dedup.test.js (exit=1)
- [2026-07-28T13:46:29.237Z] **build:c1** — tests green, committed
- [2026-07-28T13:50:34.729Z] **review:c1** — APPROVE
- [2026-07-28T13:55:05.915Z] **review:devils-advocate** — APPROVE
- [2026-07-28T13:55:16.104Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-28T13:55:16.422Z] **merge:done** — auto-merged bolt/cardgame-tools-loader-dedup into master (worktree)


## Receipt

```json
{
  "start_sha": "a7ed5f9939b945a8cd78df6f8638246b471689e2",
  "end_sha": "8fa9c1dffe1f78a1cc4641af3029facc65a9d131",
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
  "timestamp": "2026-07-28T13:55:16.103Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-tools-loader-dedup\\plan.md`. It's `GATE: none` — a single, low-risk bolt.\n\nKey findings baked into the plan:\n- The loader pair is truly identical in both tools files, and `lib/parse-card-markdown.js` needs new `fs`/`path` requires plus a `CARDS_DIR` const (same absolute path as the tools' current one, since `lib/` sits at the same depth as `tools/`).\n- In `tools/render-card.js`, only the `CARDS_DIR` const and the loader functions are dead after the move — `fs`, `path`, `REPO_ROOT` are still used elsewhere, so those stay.\n- In `tools/sync-cards-to-jaina.js`, `fs`, `path`, `REPO_ROOT`, and `CARDS_DIR` are used *only* inside the loader pair, so all four get deleted, not just the functions.\n- `tools/render-card.js`'s `module.exports.loadAllCards` must stay, since `tools/composite-card-art.js` imports `loadAllCards` through it — that's the one existing consumer this refactor could silently break if `render-card.js` stopped re-exporting it.\n- The new `test/tools-loader-dedup.test.js` covers AC1–AC4 with static source assertions plus a real `loadAllCards()` call, following the same pattern as the shipped `parse-card-markdown-dedup.test.js`.",
    "test_writer": "I need your approval on that `node --test` command to verify the tests currently fail (RED check) before wrapping up. Could you approve it?",
    "builder_c1": "Only the three intended files changed, no `test/` edits, and `node --test` is fully green (376 pass, 0 fail).\n\nSummary: moved `loadCardsFromFile`/`loadAllCards` into `lib/parse-card-markdown.js` and re-exported them; both tools now import the shared pair. One deviation from the plan: kept `parseCardMarkdown` in `render-card.js`'s destructured import (unused) instead of dropping it, because the existing frozen test `parse-card-markdown-dedup.test.js` asserts it must still be destructured there — dropping it would have broken that unmodifiable test.",
    "reviewer_c1": "All three visible ACs are satisfied by a clean, mechanical move. No introduced defects — the one thing that looked like plan drift (`parseCardMarkdown` staying in `render-card.js`'s destructure) is actually required to keep a pre-existing test from the earlier shipped `cardgame-tools-shared-parser-dedup` unit passing.\n\nAPPROVE",
    "devils_advocate": "Ran a full static trace of the diff — checked both tool files end-to-end, the sync helper's remaining usages, `composite-card-art.js` (which imports `loadAllCards` transitively through `render-card.js`'s exports), and the new test file's regex logic — and couldn't find a behavior break. The `CARDS_DIR` computed in `lib/parse-card-markdown.js` (`path.join(__dirname, '..', 'design', 'cards')`) resolves to the identical path both tools used before. Neither tool leaves a dangling reference to the removed `fs`/`path`/`CARDS_DIR`/`REPO_ROOT` locals that would throw a `ReferenceError`.\n\nOne real but non-blocking smell: the diff leaves `parseCardMarkdown` unused in `tools/render-card.js` (it was used inside the local `loadCardsFromFile` that got deleted, but the import wasn't cleaned up), and `loadCardsFromFile` is imported-but-never-called in both tool files (only `loadAllCards` is actually invoked; the test suite mandates importing both, seemingly to mirror the sister unit's pattern). No lint gate exists in this repo (no eslint config, no lint script) to catch this, so it doesn't fail CI or produce a concrete wrong-output/crash scenario — it's dead code, not a bug. Doesn't clear the bar for a blocking finding.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
