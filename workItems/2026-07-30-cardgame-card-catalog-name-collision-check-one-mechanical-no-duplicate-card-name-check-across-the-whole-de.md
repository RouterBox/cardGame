# cardgame-card-catalog-name-collision-check: One mechanical no-duplicate-card-name check across the whole design/cards/ catalog

## Header

- unit: cardgame-card-catalog-name-collision-check
- title: One mechanical no-duplicate-card-name check across the whole design/cards/ catalog
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: 6ef2e361cb11898ae23ee9b7313288a06108c85f
- end_sha: aeb3b5e4144603dce833dde0435c40893bd6487e

## Intent

lib/parse-card-markdown.js's loadAllCards() (shipped) already reads every file in design/cards/ into one flat array of card records, but nothing in the repo ever uses that full-catalog view to check for duplicate names — every existing uniqueness check (test/design-cards.test.js AC1, and the equivalent checks in design-frontier-cards.test.js and design-signature-cards.test.js) only compares names within its own single file via a Set, so a card added in a new file (frontier-set.md, character-signatures.md, or any of the several new card-set files currently open as proposals or in-flight as units) could silently reuse a name already printed in another file with nothing catching it except each proposal's own manually-written, non-enforced promise not to collide. This unit adds a new lib/card-catalog.js exporting a function that takes the array loadAllCards() already produces (or any array of {name} records) and returns the list of names that occur more than once, comparing case-insensitively so trivial-casing variants also collide. It does not modify lib/parse-card-markdown.js, any file under design/cards/, or any existing test file — it only adds the new lib file and a new test/card-catalog-collision.test.js that (a) proves detection works via fixture data containing an injected duplicate (including a same-name-different-case pair), and (b) runs the same function against the real, current design/cards/ catalog via loadAllCards() and asserts zero duplicates today. This gives every future card-adding unit — including the six already sitting in the queue or in-flight — a single, real, mechanical safety net instead of a held-out promise repeated per-proposal, directly serving the concurrency stress-test RouterBox set up on purpose (T19) at a moment when several parallel card-authoring bolts are running at once.

## Acceptance Criteria

- AC1 [inferred]: lib/card-catalog.js exists and exports a function that, given an array of card records each with a `name` field, returns the list of names that appear more than once (comparing case-insensitively, so 'Wormhole Ledger' and 'wormhole ledger' count as the same name).
- AC2 [inferred]: test/card-catalog-collision.test.js proves detection with fixture data: given a synthetic set of card records containing one name repeated across two entries (including at least one case-only variant), the function returns that name as a duplicate; given a synthetic set with no repeated names, it returns an empty list.
- AC3 [paraphrase]: test/card-catalog-collision.test.js also calls the same function against the real card catalog returned by lib/parse-card-markdown.js's loadAllCards(), and asserts it currently returns zero duplicate names.
- AC4 [inferred] (held_out): No file under design/cards/, lib/parse-card-markdown.js, or any pre-existing test/*.js file is modified by this unit — only lib/card-catalog.js and test/card-catalog-collision.test.js are added, and every pre-existing test file's pass/fail outcome under `node --test` is unchanged.

## Plan

GATE: none

# Plan: cardgame-card-catalog-name-collision-check

## Summary

Add one new library module, `lib/card-catalog.js`, exporting a function
that finds duplicate card names (case-insensitively) in any array of
`{ name }` records. Add one new test file,
`test/card-catalog-collision.test.js`, that proves the function works on
fixture data and then runs it against the real catalog via
`loadAllCards()` from `lib/parse-card-markdown.js`, asserting zero
duplicates today.

No existing file is modified. Two new files only:

1. `lib/card-catalog.js` (new)
2. `test/card-catalog-collision.test.js` (new)

## Background / verified facts

- `lib/parse-card-markdown.js` already exports `loadAllCards()`
  (`lib/parse-card-markdown.js:114-125`), which reads every `.md` file in
  `design/cards/`, parses `###` (H3) sections, and keeps only sections
  that have all three of `Cost line:`, `Type line:`, `Rules text:`
  (`lib/parse-card-markdown.js:86-96`). Each surviving record has shape
  `{ name, costLine, typeLine, rulesText, statsLine, flavorText }` where
  `name` is the heading text (`lib/parse-card-markdown.js:92`, note the
  field is `name`, not `title`).
- Files like `design/cards/art-briefs.md`, `alt-art-briefs.md`, and the
  "Worked Example: ..." sections of `card-anatomy.md` reuse the same H3
  heading text as real card files but contain no `Cost line:` /
  `Type line:` / `Rules text:` fields — confirmed by grep, zero matches
  in both `art-briefs.md` and `alt-art-briefs.md`. `loadAllCards()`
  filters these out, so they never appear as duplicate names.
- I manually enumerated every `###` heading in `design/cards/*.md` and
  cross-checked which files actually carry the three required fields.
  The real card-bearing files today are: `alpha-set.md`,
  `character-signatures.md`, `character-signatures-wave-2.md`,
  `fount-economy-set.md`, `frontier-set.md`,
  `spatial-race-identity-set.md`, `wormhole-closure-cards.md`,
  `wormhole-restrictions-set.md`. Across all of their card names, there
  are no duplicates and no case-only variants — confirming AC3's "zero
  duplicates today" claim is currently true and the test should pass
  once written, with no other unit needing to fix data first.
- `package.json`'s `test` script is `node --test --test-concurrency=1`;
  the unit's stated test command `node --test` also works directly.
- Existing per-file uniqueness checks (e.g. `test/design-cards.test.js:73`,
  `new Set(names).size`) are case-sensitive and file-scoped — this unit
  does not touch them, it only adds a cross-file, case-insensitive check.

## File 1: `lib/card-catalog.js` (new)

Create with this exact content:

```js
'use strict';

// Given an array of card records each with a `name` field, returns the
// list of names (in their first-seen casing) that occur more than once,
// comparing case-insensitively so casing-only variants also collide.
function findDuplicateNames(cards) {
  const firstSeen = new Map(); // lowercased name -> first-seen original name
  const duplicates = [];
  const flagged = new Set(); // lowercased names already added to duplicates

  for (const card of cards) {
    const key = card.name.toLowerCase();
    if (firstSeen.has(key)) {
      if (!flagged.has(key)) {
        duplicates.push(firstSeen.get(key));
        flagged.add(key);
      }
    } else {
      firstSeen.set(key, card.name);
    }
  }

  return duplicates;
}

module.exports = { findDuplicateNames };
```

Notes for the implementer:

- Function name is `findDuplicateNames` — chosen to read clearly at the
  call site (`findDuplicateNames(loadAllCards())`); no other name is
  used anywhere else in the repo so there is no collision risk.
- The returned name is the **first-seen** casing/spelling of the
  duplicated name (e.g. if `Wormhole Ledger` appears before
  `wormhole ledger`, the returned entry is `Wormhole Ledger`). This is
  an implementation choice — AC1/AC2 only require that *the* duplicate
  name is returned, and fixture assertions below check membership, not
  exact casing, so this choice doesn't need to be more specific than
  that.
- A name that appears 3+ times still only appears **once** in the
  output (the `flagged` set prevents duplicate entries in the result
  list). This is not explicitly required by any AC, but it's the
  obviously-correct behavior for a "list of names that occur more than
  once" — avoid the trap of pushing once per repeat occurrence.
- Do not add a third parameter, options object, or case-sensitivity
  toggle — AC1 requires case-insensitive comparison unconditionally,
  and CLAUDE.md says not to add unrequested flexibility.

## File 2: `test/card-catalog-collision.test.js` (new)

Create with this exact content:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');

const { findDuplicateNames } = require('../lib/card-catalog');
const { loadAllCards } = require('../lib/parse-card-markdown');

// ---------------------------------------------------------------------------
// AC2: fixture-data detection, including a case-only-variant collision.
// ---------------------------------------------------------------------------

test('AC2: detects a name repeated across two entries, including a case-only variant', () => {
  const cards = [
    { name: 'Wormhole Ledger' },
    { name: 'Static Ambush' },
    { name: 'wormhole ledger' },
    { name: 'Drone Cascade' },
  ];

  const duplicates = findDuplicateNames(cards);

  assert.strictEqual(duplicates.length, 1);
  assert.strictEqual(duplicates[0].toLowerCase(), 'wormhole ledger');
});

test('AC2: returns an empty list when no names repeat', () => {
  const cards = [
    { name: 'Wormhole Ledger' },
    { name: 'Static Ambush' },
    { name: 'Drone Cascade' },
  ];

  const duplicates = findDuplicateNames(cards);

  assert.deepStrictEqual(duplicates, []);
});

test('AC2: a name repeated 3+ times is reported only once', () => {
  const cards = [
    { name: 'Echo Recall' },
    { name: 'echo recall' },
    { name: 'ECHO RECALL' },
  ];

  const duplicates = findDuplicateNames(cards);

  assert.strictEqual(duplicates.length, 1);
  assert.strictEqual(duplicates[0].toLowerCase(), 'echo recall');
});

// ---------------------------------------------------------------------------
// AC3: the real, current design/cards/ catalog has zero duplicate names.
// ---------------------------------------------------------------------------

test('AC3: the real design/cards/ catalog has zero duplicate names today', () => {
  const cards = loadAllCards();
  const duplicates = findDuplicateNames(cards);

  assert.deepStrictEqual(
    duplicates,
    [],
    `expected no duplicate card names, found: ${duplicates.join(', ')}`
  );
});
```

Notes for the implementer:

- `loadAllCards()` reads from `design/cards/` on disk relative to
  `lib/parse-card-markdown.js`'s own `__dirname`
  (`lib/parse-card-markdown.js:6`), so this test needs no path setup —
  just call it.
- Do not mock or stub `loadAllCards()` — AC3 explicitly requires calling
  the real function against the real catalog.
- Keep the fixture tests and the real-catalog test in the same file
  (as the unit intent specifies one new test file covering both (a) and
  (b)).

## Expected output

Running the test command from the repo root:

```
node --test
```

(or `npm test`, which runs `node --test --test-concurrency=1`) should
report all four new tests passing, e.g. output containing:

```
✔ AC2: detects a name repeated across two entries, including a case-only variant
✔ AC2: returns an empty list when no names repeat
✔ AC2: a name repeated 3+ times is reported only once
✔ AC3: the real design/cards/ catalog has zero duplicate names today
```

with the overall summary showing `# fail 0` and all pre-existing test
files' pass/fail counts unchanged from their current baseline (capture
`node --test` output before making changes if a literal before/after
diff is wanted to prove AC4).

## AC4 (held-out) — how to satisfy it

AC4 requires that no file under `design/cards/`, `lib/parse-card-markdown.js`,
or any pre-existing `test/*.js` file is modified, and that only
`lib/card-catalog.js` and `test/card-catalog-collision.test.js` are
added. This falls out naturally from following this plan exactly: don't
open or edit any other file. Verify before finishing with:

```
git status --porcelain
```

Expected output: exactly two new (`??`) entries —
`lib/card-catalog.js` and `test/card-catalog-collision.test.js` — and
nothing else (no `M` modified entries).

## Risk assessment (FIRE)

- **Reversibility**: trivial — two new, self-contained files; deleting
  them fully reverts the change. No existing file touched.
- **Impact**: purely additive dev-tooling/test infrastructure. No
  runtime/production code path is touched (nothing under `tools/` or
  the site build imports `lib/card-catalog.js`).
- **Security**: none — no user input, no network, no filesystem writes
  (only reads via the existing, already-used `loadAllCards()`).
- **Data/schema**: none — no schema, no persisted data touched.

Low risk, unambiguous scope. `GATE: none`.

## Explicitly out of scope (do not do these)

- Do not modify `lib/parse-card-markdown.js`.
- Do not modify any file under `design/cards/`.
- Do not modify `test/design-cards.test.js`,
  `test/design-frontier-cards.test.js`,
  `test/design-signature-cards.test.js`, or any other pre-existing test
  file — leave their own single-file `Set`-based uniqueness checks as
  they are; this unit adds a separate, additional safety net rather
  than replacing them.
- Do not add a CLI script, npm script, or git hook that runs the new
  check automatically — the unit only asks for the library function and
  its test; wiring it into a pre-commit/CI gate is not in scope and
  would be a separate unit.
- Do not add options/flags to `findDuplicateNames` beyond the single
  array argument.

## Held-out AC audit

AC4 (held-out) is redundant with the visible intent paragraph, which
already states "It does not modify lib/parse-card-markdown.js, any file
under design/cards/, or any existing test file — it only adds the new
lib file and a new test file." AC4 just makes that promise mechanically
checkable (via `git status`) rather than introducing any new
requirement. No spec bug found.


## Findings

# Blind Review: cardgame-card-catalog-name-collision-check (cycle 1)

## Diff scope

`git diff HEAD~2 HEAD --name-status` confirms exactly two new files, no
existing file touched:

```
A   lib/card-catalog.js
A   test/card-catalog-collision.test.js
```

This matches the intent's claim of not modifying `lib/parse-card-markdown.js`,
anything under `design/cards/`, or any existing test file.

## AC-by-AC verification

**AC1** — `lib/card-catalog.js` exists and exports `findDuplicateNames`,
which takes an array of `{ name }` records and returns names occurring
more than once, case-insensitively. Read the file: it lowercases each
`card.name` as a map key, records the first-seen original-cased name,
and pushes into `duplicates` (deduped via a `flagged` Set) the first
time a key repeats. Matches AC1 exactly, including the not-explicitly-
required-but-correct behavior of reporting a 3+-times-repeated name
only once. Satisfied.

**AC2** — `test/card-catalog-collision.test.js` fixture tests:
- Test 1: 4 records incl. `'Wormhole Ledger'` / `'wormhole ledger'` →
  asserts exactly one duplicate, case-insensitively equal to
  `'wormhole ledger'`. Traced by hand against the implementation:
  correct.
- Test 2: no repeats → asserts `[]`. Correct.
- Test 3 (bonus, not required but harmless): 3× casing variants of
  `'Echo Recall'` → asserts reported once. Correct given the `flagged`
  Set logic.
Satisfied.

**AC3** — the same test file's fourth test calls the real
`loadAllCards()` from `lib/parse-card-markdown.js` (not mocked) and
asserts `findDuplicateNames(cards)` is `[]` against the real catalog.
I could not execute `node --test` in this session (all command
executions required approval that wasn't available), so I verified
this statically instead:
- Grepped every `### ` heading under `design/cards/` (see raw listing
  gathered during review) and cross-referenced against
  `lib/parse-card-markdown.js`'s filter, which only keeps H3 sections
  that have all of `Cost line:`, `Type line:`, `Rules text:`.
- Confirmed via grep that `art-briefs.md`, `alt-art-briefs.md`, and
  `card-anatomy.md` — the files that reuse headings from real card
  files (e.g. `Sporeknit Warden`, `Salvage-Wrought Bastion`, `Bastion
  Lockdown Line`, `Conveyance Directive`, `Rootbound Corridor`,
  `Vector Interdiction`, `Pilgrim's Right of Way`) — contain **zero**
  occurrences of `Cost line:`/`Type line:`/`Rules text:` at line-start,
  so `loadAllCards()` filters all their sections out entirely.
- Enumerated the remaining 8 real card-bearing files' names by hand
  (`alpha-set.md`, `character-signatures.md`,
  `character-signatures-wave-2.md`, `fount-economy-set.md`,
  `frontier-set.md`, `spatial-race-identity-set.md`,
  `wormhole-closure-cards.md`, `wormhole-restrictions-set.md`) and
  found no case-insensitive collisions among them.
This matches the plan's own verified-facts section and confirms AC3
will pass. Satisfied (verified statically; recommend the merge owner
do one live `node --test` run before/after as normal CI hygiene, since
I couldn't execute it here).

## Findings

None. The diff is a minimal, faithful implementation of the plan: one
pure function, one test file, no scope creep, no touched files outside
the two declared. Logic was hand-traced against every test case and
against the real on-disk catalog and is correct.

No INTRODUCED findings. No PRE-EXISTING findings relevant to this diff's
scope (the diff doesn't touch or depend on any other file's behavior
beyond reading `loadAllCards()`, which is unchanged/shipped).

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T05:07:49.834Z] **bolt:start** — unit=cardgame-card-catalog-name-collision-check start_sha=6ef2e361cb11898ae23ee9b7313288a06108c85f branch=bolt/cardgame-card-catalog-name-collision-check worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-card-catalog-name-collision-check
- [2026-07-30T05:08:01.164Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T05:10:25.711Z] **plan:done** — plan.md written
- [2026-07-30T05:11:07.165Z] **tests:done** — RED verified on test/card-catalog-collision.test.js (exit=1)
- [2026-07-30T05:12:06.464Z] **build:c1** — tests green, committed
- [2026-07-30T05:13:46.973Z] **review:c1** — APPROVE
- [2026-07-30T05:16:23.545Z] **review:devils-advocate** — APPROVE
- [2026-07-30T05:16:32.993Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T05:16:33.581Z] **merge:done** — auto-merged bolt/cardgame-card-catalog-name-collision-check into master (worktree)


## Receipt

```json
{
  "start_sha": "6ef2e361cb11898ae23ee9b7313288a06108c85f",
  "end_sha": "3ba523b495e033e86fd0f2ce9a8183194d9b2b93",
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
  "timestamp": "2026-07-30T05:16:32.990Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-card-catalog-name-collision-check\\plan.md`.\n\nSummary: this is a low-risk, unambiguous unit (`GATE: none`) — add `lib/card-catalog.js` exporting `findDuplicateNames()` and `test/card-catalog-collision.test.js` with fixture tests plus a real-catalog check. I verified by hand (grep across `design/cards/*.md` for the `Cost line:`/`Type line:`/`Rules text:` field markers) that the real card-bearing files today have zero cross-file name collisions, so AC3 will pass as written. No held-out spec bugs found — AC4 just makes the intent paragraph's existing promise mechanically checkable.",
    "test_writer": "I need your approval to run `node --test test/card-catalog-collision.test.js` to verify the new test currently fails (as expected, since `lib/card-catalog.js` doesn't exist yet).",
    "builder_c1": "All 852 tests pass (4 new + 848 pre-existing), 0 failures. `git status --porcelain` shows only `lib/card-catalog.js` as a new untracked file — `test/card-catalog-collision.test.js` was already committed by the harness's RED-verification step and matches the plan exactly, so no test file was touched. Implementation is complete and green.",
    "reviewer_c1": "All three ACs verified against the actual repo (diff scope confirmed as exactly two new files via `git diff --name-status`, function logic hand-traced, AC3's \"zero duplicates today\" claim confirmed by grepping every card-bearing file and confirming the non-card files are correctly filtered out). No introduced findings. Findings written to findings.md.\n\nAPPROVE",
    "devils_advocate": "Attempted attack surface and findings:\n\n1. **Does AC3's \"zero duplicates today\" claim actually hold?** Manually enumerated every `### ` heading across all 11 files in `design/cards/`. `art-briefs.md` and `alt-art-briefs.md` reuse the exact same card names as `alpha-set.md`, `frontier-set.md`, `character-signatures.md`, `fount-economy-set.md`, and `wormhole-restrictions-set.md` — a lot of apparent collisions. But those are art-brief documents, not card definitions: grepping confirmed neither file has any line starting with `Cost line:`/`Type line:`/`Rules text:`, so `parseCardMarkdown`'s existing filter (`fields.costLine && fields.typeLine && fields.rulesText`) excludes every section in them from `loadAllCards()`. `character-signatures-wave-2.md` does carry real card fields but its five names (Torel Ashgrave, Rathe Ossuary-Kin, etc.) are distinct from `character-signatures.md`'s five. No real collision exists — attack fails.\n2. **Correctness of `findDuplicateNames`** — Map+Set logic correctly reports each duplicate name once regardless of occurrence count (verified against the 3-occurrence fixture test), keys off `card.name.toLowerCase()` where `name` is always a non-empty trimmed string from `section.title` in the shared parser, so no null/undefined dereference risk on real data.\n3. **Scope discipline** — diff touches only two new files (`lib/card-catalog.js`, `test/card-catalog-collision.test.js`); confirmed via `git show --stat` across both commits that no existing file (parser, design/cards/*, other tests) was touched.\n4. **Require paths / module wiring** — `require('../lib/card-catalog')` and `require('../lib/parse-card-markdown')` match the established relative-path convention used by every other test file in this repo.\n\nI could not construct a scenario where this diff breaks CI, misreports the catalog, or destabilizes concurrent in-flight units — a future collision from another parallel bolt would correctly fail *that* merge's test run, which is the intended f"
  }
}
```

## Comments

(no comments.md)
