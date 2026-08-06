GATE: none

# Plan — cardgame-art-briefs-spatial-race-identity-wave-2

## Summary

`design/cards/spatial-race-identity-set-wave-2.md` has 2 cards (Bloom Fount,
Circuit Fount) with no entry in `design/cards/art-briefs.md`. This plan adds
exactly those 2 briefs, in the exact `Palette` / `Subject/Scene` / `Key
visual elements` / `Composition` format every prior brief uses.

Doing this closes the **last** remaining art-brief coverage gap in the whole
repo (verified below: 54 real cards across `design/cards/*.md`, 52 existing
briefs, gap = exactly these 2). That has one direct, unavoidable side
effect on an existing test that a junior could easily miss and must handle
in the same bolt — see Step 2. Step 1 alone (just adding the briefs) will
turn `node --test` red.

## Verified facts (don't re-derive these, they're already checked)

- `tools/composite-card-art.js`'s `main()` loads briefs by exact `###`
  heading match against `loadAllCards()` (`lib/parse-card-markdown.js`),
  which reads every `.md` file directly in `design/cards/` and keeps only
  sections that have `Cost line:`/`Type line:`/`Rules text:` — so
  `art-briefs.md`, `alt-art-briefs.md`, and `card-anatomy.md`'s own `###`
  sections are correctly excluded from "real cards" (confirmed: they carry
  no such fields).
- Counting `^### ` headings per file: `alpha-set.md`=18,
  `character-signatures.md`=5, `character-signatures-wave-2.md`=5,
  `fount-economy-set.md`=6, `frontier-set.md`=5,
  `spatial-race-identity-set-wave-2.md`=2, `spatial-race-identity-set.md`=3,
  `wormhole-closure-cards.md`=5, `wormhole-restrictions-set.md`=5. Total = **54**
  real cards. `art-briefs.md` currently has **52** `###` brief sections.
  52 = 54 − 2, and the 2 missing names are exactly "Bloom Fount" and
  "Circuit Fount" (confirmed by reading `art-briefs.md` end-to-end — no
  wave-2 section exists there today).
- `test/composite-card-art.test.js`'s test `'AC1/AC3: cards with no
  matching brief print a "no art brief for ..." warning and main() still
  resolves'` (around line 265) computes `uncoveredNames` from the **real**
  `loadAllCards()` / `art-briefs.md` and asserts
  `uncoveredNames.length > 0`. Today that's true (Bloom Fount, Circuit
  Fount are the 2 uncovered names). Once Step 1 below ships, coverage
  becomes 54/54 and `uncoveredNames.length` becomes **0** — this assertion
  fails and the whole test file goes red. The test already anticipates
  this in its own assertion message: *"if this fails because coverage
  caught up, add an uncovered card fixture instead of deleting this
  test."* Step 2 does exactly that.
- `design-art-briefs.test.js` (a different file, covering only
  `alpha-set.md`/`frontier-set.md`/`character-signatures.md`) is
  unaffected by Step 1: it uses `>=` not `==` for brief-vs-card counts and
  only requires that cards from those 3 specific files have briefs (they
  already do). Not touched by this plan.
- `design/DESIGN-READINESS.md`'s gap tracking for this hole was already
  fixed by a separate, already-merged unit
  (`design-readiness-gap2-resolved` / commit history shows
  `test/design-readiness-gap2-resolved.test.js` already passing). Do not
  touch `DESIGN-READINESS.md` — out of scope for this unit.
- No other prior art-brief unit (fount-economy, frontier-signatures,
  wormhole-closure, character-signatures-wave-2, spatial-race-identity
  wave-1, alt-art) added a dedicated per-set AC1-4 test file for its own
  briefs — they all relied on the generic coverage-warning test in
  `composite-card-art.test.js` as the regression safety net. Follow that
  same precedent here: **do not** create a new test file for these 2
  briefs' Palette/Subject/Scene/Composition content.

## Step 1 — Add the 2 missing briefs

**File to modify:** `design/cards/art-briefs.md`

Do not touch any existing line. Using the Edit tool, find this exact
existing tail of the file (the last 14 lines):

```
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — keep the welded
endpoint low and central with the controlled Planet anchoring one side of
the frame.
```

Replace it with itself plus this new block appended immediately after
(same exact leading text preserved, new content follows it):

```
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — keep the welded
endpoint low and central with the controlled Planet anchoring one side of
the frame.

## Spatial Race Identity Set, Wave 2 — Two More Races Grounded in the Graph

### Bloom Fount

Palette: Green — the Bloom's patient growth, rooting wherever it likes, permission or not.
Subject/Scene: A Mireth Bloom Fount, grounding the race's own Bloomfront Expansion, roots directly into a Planet its controller does not yet control, its Biology core swelling as it produces a Bloom Point on ground nobody has ceded to it.
Key visual elements:
- The Generator core itself, a living root-mass rather than machinery, visibly producing a Bloom Point
- The ground beneath it marked or bannered as belonging to another Team, growth rooting in anyway, no permission asked
- No claim-stake, banner-plant, or conquest marker anywhere in frame — the Bloomfront Expansion needs none
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — root the Fount low in
frame with the contested, unclaimed ground filling the width beneath it.

### Circuit Fount

Palette: Copper — the Circuit's warm mechanized repetition, cheapest the instant new ground opens up.
Subject/Scene: A Wrought Assembly Fount stamps its one flawless pattern onto a Planet a Discovery action only just added to the battlefield graph, its Circuit Point flowing into the resource pool for one Point less than the pattern usually costs.
Key visual elements:
- The Generator core producing a visible Circuit Point, copper conduits carrying the charge into a resource pool
- A freshly opened Discovery site at the build location — unclaimed, newly-charted ground, not yet fought over
- A ledger or cost meter shown marked down, one Circuit Point cheaper than the pattern's usual price
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — center the Fount at
the freshly discovered site with the discount ledger visible at the
frame's edge.
```

Checklist this satisfies:
- AC1: two new `###` sections, titled `Bloom Fount` and `Circuit Fount`
  verbatim, appended after all existing content, nothing else touched.
- AC2: Bloom Fount's `Palette:` line names "Green" and says "the Bloom's";
  Circuit Fount's names "Copper" and says "the Circuit's" — each
  explicitly naming its Fount.
- AC3 (held_out): each `Subject/Scene` names its race ("A Mireth Bloom
  Fount...", "A Wrought Assembly Fount...") and cites its specific
  mechanic (Bloomfront Expansion / building on a Planet not yet
  controlled; the Discovery-added-Planet cost reduction). Each `Key
  visual elements` list has exactly 3 bullets (≥ 3 required).
- AC4: both `Composition:` lines cite "landscape rectangle (~5:3)" and
  "the large rectangular window ... per card-anatomy.md", matching every
  prior entry's exact phrasing pattern.

## Step 2 — Keep the coverage-warning test honest after 100% coverage

**File to modify:** `test/composite-card-art.test.js`

**Why this step exists:** after Step 1, `uncoveredNames.length` (computed
from real `design/cards/` + real `art-briefs.md`) becomes 0. The test at
line ~265 asserts it must be `> 0`. Left alone, `node --test` goes from
green to red purely because coverage is now complete — the test's own
assertion message says to fix this by adding "an uncovered card fixture,"
not by deleting the test.

**Design constraint:** `composite.main()` has no injection point for which
cards/briefs to load — it always reads the real `design/cards/` directory
and the real `art-briefs.md` via `fs.readdirSync`/`fs.readFileSync`
(through `lib/parse-card-markdown.js`). So:
- Do **not** add a real permanent file into `design/cards/` — that
  directory is read by ~18 other test files (site build, Jaina sync, card
  catalog collision, etc.) and by humans as the actual shipped card
  catalog; adding a fake "test-only" card there pollutes production
  content for a test-only need.
- Do **not** write a temp file into `design/cards/` and delete it during
  the test — `node --test` may run other test files concurrently in
  separate processes that also scan that same directory; a transient
  on-disk file is a real (if narrow) flakiness risk this repo has already
  hit before (see the transient-red note in recent commit history) and
  has built dedicated locking (`lib/fs-lock.js`) to avoid elsewhere.
- **Do** patch `fs.readdirSync`/`fs.readFileSync` in-memory, only for the
  duration of this one test's callback, restored in a `finally`. Both
  `composite-card-art.js`'s internal `loadAllCards()` call and the test's
  own `loadAllCards()` call resolve to the exact same `lib/parse-
  card-markdown.js` function, which reads through Node's single shared
  `fs` module — so patching `fs`'s two methods process-wide (this test
  runs in its own process; `node --test` isolates test files into
  separate processes by default) makes both sides see the identical
  synthetic card, with zero bytes ever written to disk and zero exposure
  to other test files.

Using the Edit tool, insert the following block immediately before the
`AC1/AC3` test (i.e. right after this existing comment block, which stays
unchanged):

```js
// ---------------------------------------------------------------------------
// AC1/AC3: a card with no matching brief in design/cards/art-briefs.md
// prints a "no art brief for ..." warning naming it, and the run still
// succeeds (exit 0) — informational only, never a failure.
// ---------------------------------------------------------------------------
```

New code to insert right after that comment block, before the
`test('AC1/AC3: ...')` call:

```js
// This test needs a real, guaranteed-uncovered card to exercise the
// warning path. Once every real card has a brief (which this repo's
// art-briefs units were always working toward), a hardcoded expectation
// of "at least one real uncovered card" goes red through no fault of the
// code under test. withUncoveredFixtureCard injects one synthetic,
// permanently-uncovered card in-memory — by patching fs.readdirSync/
// fs.readFileSync for the CARDS_DIR path only, for the duration of the
// callback — so this test never depends on real art-briefs.md coverage
// gaps again, and never writes anything to disk.
const CARDS_DIR = path.join(REPO_ROOT, 'design', 'cards');
const FIXTURE_FILE_NAME = 'zzz-test-fixture-uncovered.md';
const FIXTURE_CARD_NAME = 'Zzz Test Fixture Card (do not add an art brief)';
const FIXTURE_MARKDOWN = `### ${FIXTURE_CARD_NAME}

Cost line: 0 Bloom
Type line: Biology — Permanent
Rules text: This card exists only so the "no art brief" warning-path test always has a guaranteed-uncovered card to check against, independent of real art-briefs.md coverage. It is never part of any shippable card set.
Stats/counters line: Combat strength 0. Enters with no counters.
`;

async function withUncoveredFixtureCard(fn) {
  const originalReaddirSync = fs.readdirSync;
  const originalReadFileSync = fs.readFileSync;
  const resolvedCardsDir = path.resolve(CARDS_DIR);
  const resolvedFixturePath = path.resolve(CARDS_DIR, FIXTURE_FILE_NAME);

  fs.readdirSync = function patchedReaddirSync(dirPath, options) {
    const entries = originalReaddirSync(dirPath, options);
    if (path.resolve(dirPath) !== resolvedCardsDir) return entries;
    const fixtureEntry =
      options && options.withFileTypes
        ? { name: FIXTURE_FILE_NAME, isFile: () => true, isDirectory: () => false }
        : FIXTURE_FILE_NAME;
    return [...entries, fixtureEntry];
  };

  fs.readFileSync = function patchedReadFileSync(filePath, options) {
    if (path.resolve(filePath) === resolvedFixturePath) return FIXTURE_MARKDOWN;
    return originalReadFileSync(filePath, options);
  };

  try {
    return await fn();
  } finally {
    fs.readdirSync = originalReaddirSync;
    fs.readFileSync = originalReadFileSync;
  }
}
```

Then **replace** the existing `AC1/AC3` test body (do not change its
title string) from this:

```js
test('AC1/AC3: cards with no matching brief print a "no art brief for ..." warning and main() still resolves', async () => {
  const briefTitles = new Set(listBriefTitles());
  const uncoveredNames = loadAllCards()
    .map((card) => card.name)
    .filter((name) => !briefTitles.has(name));

  assert.ok(
    uncoveredNames.length > 0,
    'expected at least one card with no brief in this fixture so the warning path is exercised — ' +
      'if this fails because coverage caught up, add an uncovered card fixture instead of deleting this test'
  );

  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (line) => warnings.push(String(line));
  try {
    await assert.doesNotReject(
      composite.main(),
      'expected main() to resolve (exit 0) even when some cards have no brief'
    );
  } finally {
    console.warn = originalWarn;
  }

  for (const name of uncoveredNames) {
    assert.ok(
      warnings.includes(`no art brief for "${name}"`),
      `expected a warning naming "${name}", got: [${warnings.join(', ')}]`
    );
  }

  assert.strictEqual(
    warnings.length,
    uncoveredNames.length,
    `expected exactly one warning per uncovered card (${uncoveredNames.length}), got ${warnings.length}: [${warnings.join(', ')}]`
  );
});
```

to this:

```js
test('AC1/AC3: cards with no matching brief print a "no art brief for ..." warning and main() still resolves', async () => {
  await withUncoveredFixtureCard(async () => {
    const briefTitles = new Set(listBriefTitles());
    const uncoveredNames = loadAllCards()
      .map((card) => card.name)
      .filter((name) => !briefTitles.has(name));

    assert.ok(
      uncoveredNames.length > 0,
      'expected at least one card with no brief while the fixture card is injected — ' +
        'if this fails, withUncoveredFixtureCard is not patching fs correctly'
    );
    assert.ok(
      uncoveredNames.includes(FIXTURE_CARD_NAME),
      `expected the injected fixture card "${FIXTURE_CARD_NAME}" to be among the uncovered cards`
    );

    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (line) => warnings.push(String(line));
    try {
      await assert.doesNotReject(
        composite.main(),
        'expected main() to resolve (exit 0) even when some cards have no brief'
      );
    } finally {
      console.warn = originalWarn;
    }

    for (const name of uncoveredNames) {
      assert.ok(
        warnings.includes(`no art brief for "${name}"`),
        `expected a warning naming "${name}", got: [${warnings.join(', ')}]`
      );
    }

    assert.strictEqual(
      warnings.length,
      uncoveredNames.length,
      `expected exactly one warning per uncovered card (${uncoveredNames.length}), got ${warnings.length}: [${warnings.join(', ')}]`
    );
  });
});
```

Leave every other test in this file (including `'AC1: a card with a
matching brief does not print a "no art brief for ..." warning for it'`
and `'AC2: running composite.main() after the coverage-warning pass still
writes a normal composited SVG for a covered card'`) completely
untouched — they don't depend on there being any real uncovered card, so
they're unaffected by both Step 1 and the fixture.

## Verification / expected output

1. `node tools/composite-card-art.js` (run from repo root) should now
   print exactly:
   ```
   Composited 54 card art window(s) into renders/cards-composited/
   ```
   with **no** `no art brief for "..."` warning lines at all (before this
   plan, it printed that line twice — once for `"Bloom Fount"`, once for
   `"Circuit Fount"`). This is the direct, manual check for AC5.

2. `node --test` (full suite) should exit 0. In particular:
   - `test/composite-card-art.test.js` — every test passes, including the
     modified `AC1/AC3` test (now exercising the injected fixture card
     instead of a real gap) and the untouched `AC1`/`AC2` tests after it.
   - `test/design-art-briefs.test.js` — unaffected, still all green (it
     doesn't reference `spatial-race-identity-set-wave-2.md`).
   - No other test file references `design/cards/art-briefs.md`'s total
     section count as an exact (`===`) number, so appending 2 sections
     doesn't break anything else.

## Risk self-assessment (FIRE matrix)

- **Reversibility:** fully reversible — a content-only append to one
  design doc, plus a scoped, in-memory-only patch inside one test file.
  `git revert` cleanly undoes either half independently.
- **Security impact:** none. No runtime code path, no user input, no
  network/service change.
- **User data:** none touched.
- **Schema changes:** none. No card-anatomy.md, rules.md, or database/
  schema changes.

Risk class: standard, matches `unit.md`'s declared `risk_class: standard`.
`GATE: none` — no ambiguity requiring user confirmation; both the content
format and the one required test fix are fully determined by
already-shipped precedent in this repo.
