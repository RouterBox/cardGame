# cardgame-deck-construction-rules: cardGame rules — Section 11: Deck Construction

## Header

- unit: cardgame-deck-construction-rules
- title: cardGame rules — Section 11: Deck Construction
- project: cardgame
- completed: 2026-07-28
- outcome: merged
- start_sha: a7ed5f9939b945a8cd78df6f8638246b471689e2
- end_sha: 9ef04e39f94db5db18f6275e9a10a3fe79d7c737

## Intent

Extend design/rules.md with a new numbered top-level section, Deck Construction, giving the Amaranth Expanse rulebook the one core-loop rule gamePlan.md names ("build your deck, and play") but rules.md has never stated: a fixed minimum Archive size and a maximum number of copies of any single named card permitted in one deck. The section is appended after the existing Section 10 (Winning & Losing Conditions) so no already-numbered section is renumbered, matching the pattern every prior rules-extension unit (spatial-battlefield-rules, map-setup-and-playtest-procedure, winning-losing) has followed. It must explicitly cross-reference Section 10.1's 'required to draw with an empty Archive' elimination condition by section number, since that condition is currently unformalizable without a stated deck size — this closes that gap rather than leaving it implicit. This continues I6's MTG-Comprehensive-Rules-rigor bar (T9) and the decided full scope of the design phase (T1), with acceptance criteria as mechanical document checks per T8.

## Acceptance Criteria

- AC1 [paraphrase]: design/rules.md contains a new numbered top-level section titled 'Deck Construction', and it is the sole new section — Sections 1 through 10 remain present, in order, with their original numbers and titles unchanged.
- AC2 [inferred]: The Deck Construction section states a single fixed minimum number of cards an Archive/deck must contain at the start of a game.
- AC3 [inferred]: The Deck Construction section states a maximum number of copies of any one uniquely-named card permitted in a single deck.
- AC4 [inferred] (held_out): The Deck Construction section cross-references Section 10.1's draw-with-empty-Archive elimination condition by section number rather than restating its wording, and a new test/design-deckbuilding.test.js asserts this cross-reference alongside the numbering and content checks above.

## Plan

GATE: none

# Plan: cardgame-deck-construction-rules

## Design decision this plan makes (not a spec bug, just recording the choice)

AC2 and AC3 require "a single fixed minimum number" and "a maximum number of
copies" but the unit spec does not hand us the numbers — nothing anywhere in
`design/rules.md`, `gamePlan.md`, `design/world.md`, or `design/cards/*.md`
states a deck size or a copy limit today (checked; none exists). This plan
picks two concrete numbers so the section is checkable, per the same
"fixed rulebook facts get invented once, consistently, by whichever unit
first needs them" pattern every cost/stat number in Section 9's card examples
already follows:

- **Minimum Archive size: 40 cards.**
- **Maximum copies of any one uniquely-named card: 3.**

These are ordinary constructed-deckbuilder defaults (in the same neighborhood
as Legends of Runeterra's 40/3), chosen only because *some* fixed pair of
numbers is required and these are unremarkable, easy to rebalance later, and
don't strain anything else in the document (e.g. they don't imply an
absurdly long or short game against the one-card-per-Dawn-Phase draw rate in
Section 5.1). This is a Markdown rulebook fact, trivially revised in one
place later if a human wants different numbers — not a schema or code
decision — so it does not need a confirm-gate. If the user wants different
numbers, that's a one-line edit to Section 11.1/11.2 below plus the two
matching regexes in the test file.

## Scope check (T-size)

Single bolt. One file gets one new top-level section appended
(`design/rules.md`), one new test file is added
(`test/design-deckbuilding.test.js`, path fixed by held-out AC4). No code, no
other files, no glossary edit needed (see note below). This is small enough
for one plan → test → build → review cycle.

**Why no Section 2 glossary edit, unlike the winning-losing-conditions unit:**
that unit introduced brand-new proper-noun terms (Eliminated, Game End, Draw)
that Section 2's own rule ("terms are defined once, here, before... used
substantively elsewhere") required inserting first. This unit introduces no
new term — it just puts numbers on two concepts the glossary already defines
(**Archive**, Section 2 line ~41; a card's **Name**, Section 9.1 field 1). No
glossary insert is needed or appropriate.

## Files to modify/create

1. `design/rules.md` — modify (one edit: append new Section 11 at the end of
   the file, immediately after the existing Section 10.3 worked example).
2. `test/design-deckbuilding.test.js` — create (new file; write this FIRST
   and confirm it fails against the current, un-edited `design/rules.md`,
   per this repo's TDD convention — see `cardgame-winning-losing-conditions-rules`
   and its commit history for the same pattern).

Do not touch any other file. Do not renumber Sections 1-10. Do not edit
Section 1's intro paragraph or Section 2's glossary.

---

## Edit 1 of 1: New Section 11, appended at end of file

File: `design/rules.md`

The file currently ends (this is the exact final text in the file today —
confirmed by reading the file's tail) with:

```
### 10.3 Worked Example: Simultaneous Elimination

This example picks up during Reva's Main Phase (Section 5.3), with Reva's
Core Integrity at 4 and Toma's Core Integrity at 4. One entry already sits
in the Queue: a Fast card Toma played earlier this Main Phase, reading
"When this resolves, deal 4 damage to each challenger."

1. The Queue holds only this one entry, and both challengers have now
   passed in succession (Section 6), so the current priority window
   closes and the entry resolves.
2. Resolving deals 4 damage to Reva and 4 damage to Toma, as part of the
   same, single resolution (Section 6.2: an entry finishes resolving
   completely before anything else happens). Reva's Core Integrity drops
   from 4 to 0 and Toma's drops from 4 to 0, in the same instant.
3. Both challengers meet the Core Integrity elimination condition (Section
   10.1) at that same instant, so the game ends in a draw (Section 10.2).
   Neither the rest of the Main Phase, nor the Conflict Phase, nor any
   later phase of this turn is reached — the turn, and the game, end here.

This confirms, on paper, that because this rules set resolves a Queue
entry's full effect atomically before anything else happens (Section
6.2), a single symmetric effect can Eliminate both challengers in the same
instant, ending the game in a draw rather than letting whichever
challenger happened to be checked first "win" a race the shared effect
never created.
```

Find that exact block (it is the last text in the file, byte-for-byte — do
not change anything inside it) and append the following new section
immediately after it, separated by one blank line:

```

## 11. Deck Construction

*design/gamePlan.md* names one rule this rulebook has never formally stated:
"build your deck, and play." This section states it: a fixed minimum Archive
size, and a maximum number of copies of any one uniquely-named card. Doing so
closes a real gap in Section 10.1 — that section's second elimination
condition (a challenger required to draw a card during their Dawn Phase,
Section 5.1, with no card left in their Archive) has, until now, had no
stated floor on how large an Archive starts, so nothing has fixed how soon
that condition could ever be reached. Nothing in this section changes or
restates any rule already stated in Sections 1-10; where a rule already
exists, this section cross-references it by section number instead.

### 11.1 Minimum Archive Size

Each challenger's Archive (Section 3) MUST contain at least 40 cards at the
start of a game, before shuffling and before that challenger's opening hand
is drawn from it. A challenger MAY NOT begin a game with an Archive
containing fewer than 40 cards. This is the number Section 10.1's
draw-with-an-empty-Archive elimination condition depends on to mean anything
concrete: the fewer cards an Archive holds relative to how many turns a game
runs, the sooner a challenger is forced to draw from an empty Archive and is
Eliminated (Section 10.1) as a result. An Archive MAY contain more than 40
cards; this section fixes a floor, not a ceiling.

### 11.2 Maximum Copies of a Single Named Card

A challenger's Archive MAY NOT contain more than 3 cards sharing the same
Name (Section 9.1's Name field). This limit applies per uniquely-named card,
independent of which Card Type(s) or Fount(s) that card lists (Section 9):
a challenger's Archive could, for example, hold 3 copies of Spore Warden and
3 copies of Foundry Works at once (Section 9.5, Section 9.6), but never a
4th copy of either.

### 11.3 Worked Example: A Legal and an Illegal Archive

This example checks two Archives a challenger might try to bring to a game,
built from cards already printed as examples in Section 9.

1. Challenger A's Archive contains 40 cards total: 3 copies each of
   Cinderfall Bolt, Signal Relay, Foresight Ping, Spore Warden, Foundry
   Works, and Reactive Turret (18 cards), plus 22 further cards, none of
   them sharing a Name with each other or with any of those six. This
   Archive is legal: it meets the 40-card minimum (Section 11.1) exactly,
   and no Name appears more than 3 times (Section 11.2).
2. Challenger B's Archive contains 45 cards total, comfortably above the
   minimum, but 4 of them are copies of Cinderfall Bolt. This Archive is
   illegal: it clears the 40-card minimum (Section 11.1), but the 4th copy
   of Cinderfall Bolt violates the per-Name limit (Section 11.2) regardless
   of the Archive's total size.

This confirms, on paper, that the two limits in this section are checked
independently — an Archive can fail either one without failing the other —
and that Section 10.1's draw-with-empty-Archive elimination condition now
has a concrete floor to reason about: no legal Archive can ever hold fewer
than 40 cards.
```

(The rest of the file above this point is unchanged. Nothing before the
appended block is edited.)

---

## New test file: `test/design-deckbuilding.test.js`

Create this file with the following complete content. It follows the exact
conventions already used by `test/design-winning-losing.test.js` and
`test/design-rules.test.js` (same helpers, same `topLevelSections` pattern,
same AC-labeled test names). Write this file FIRST and confirm the tests
fail against the current (un-edited) `design/rules.md`, before making Edit 1
above.

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection } = require('./helpers/markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');

function readRules() {
  return fs.readFileSync(RULES_PATH, 'utf8');
}

function topLevelSections(content) {
  const sections = parseSections(content);
  return sections
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title));
}

function deckBody() {
  const content = readRules();
  const sections = parseSections(content);
  return sectionText(sections, /deck construction/i);
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md contains a new numbered top-level section titled
// 'Deck Construction', and it is the sole new section — Sections 1 through
// 10 remain present, in order, with their original numbers and titles
// unchanged.
// ---------------------------------------------------------------------------

const ORIGINAL_TITLES = [
  '1. Game Concepts',
  '2. Glossary & Vocabulary',
  '3. Zones',
  '4. Resources',
  '5. Turn Structure',
  '6. Priority & Timing',
  '7. Worked Example: A Priority Exchange',
  '8. Spatial Battlefield',
  '9. Card Types & Templating',
  '10. Winning & Losing Conditions',
];

test('AC1: rules.md has a numbered top-level Deck Construction section', () => {
  const sections = topLevelSections(readRules());
  const found = sections.some((s) => /deck construction/i.test(s.title));
  assert.ok(
    found,
    `expected a numbered top-level heading mentioning "Deck Construction" among [${sections.map((s) => s.title).join(', ')}]`
  );
});

test('AC1: the top-level numbered sections remain in strict sequence starting at 1', () => {
  const sections = topLevelSections(readRules());
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strict numbering, got [${numbers.join(', ')}]`);
  }
});

test('AC1: Deck Construction is the sole new top-level section (exactly 11 total)', () => {
  const sections = topLevelSections(readRules());
  assert.strictEqual(
    sections.length,
    11,
    `expected exactly 11 top-level sections (the original 10 plus Deck Construction), got ${sections.length}: ${sections.map((s) => s.title).join(', ')}`
  );
});

test('AC1: Sections 1-10 remain present, in order, with their original titles unchanged', () => {
  const sections = topLevelSections(readRules());
  for (let i = 0; i < ORIGINAL_TITLES.length; i++) {
    assert.strictEqual(
      sections[i] && sections[i].title,
      ORIGINAL_TITLES[i],
      `expected section ${i} to be titled "${ORIGINAL_TITLES[i]}", got "${sections[i] && sections[i].title}"`
    );
  }
});

test('AC1: Deck Construction is appended immediately after Section 10', () => {
  const sections = topLevelSections(readRules());
  assert.strictEqual(sections.length, 11, 'expected exactly 11 top-level sections (see prior test)');
  assert.ok(
    /deck construction/i.test(sections[10].title),
    `expected section index 10 (the 11th section) to be Deck Construction, got "${sections[10].title}"`
  );
});

// ---------------------------------------------------------------------------
// AC2: the Deck Construction section states a single fixed minimum number of
// cards an Archive/deck must contain at the start of a game.
// ---------------------------------------------------------------------------

test('AC2: states a fixed minimum Archive size at the start of a game', () => {
  const body = deckBody();
  assert.ok(body, 'expected a Deck Construction section');
  assert.ok(/\barchive\b/i.test(body), 'expected the section to discuss the Archive');
  assert.ok(
    /at least 40 cards/i.test(body),
    'expected an explicit minimum card count stated as "at least 40 cards"'
  );
  assert.ok(
    /start of a game/i.test(body),
    'expected the minimum to be tied to the start of a game'
  );
});

// ---------------------------------------------------------------------------
// AC3: the Deck Construction section states a maximum number of copies of
// any one uniquely-named card permitted in a single deck.
// ---------------------------------------------------------------------------

test('AC3: states a maximum number of copies of any one uniquely-named card', () => {
  const body = deckBody();
  assert.ok(body, 'expected a Deck Construction section');
  assert.ok(
    /may not contain more than 3 cards sharing the same name/i.test(body),
    'expected an explicit per-Name copy limit stated as "MAY NOT contain more than 3 cards sharing the same Name"'
  );
});

// ---------------------------------------------------------------------------
// AC4 (held_out): cross-references Section 10.1's draw-with-empty-Archive
// elimination condition by section number rather than restating its
// wording.
// ---------------------------------------------------------------------------

test('AC4: cross-references Section 10.1 by section number', () => {
  const body = deckBody();
  assert.ok(body, 'expected a Deck Construction section');
  assert.ok(/section 10\.1/i.test(body), 'expected an explicit cross-reference to Section 10.1');
});

test('AC4: the cross-reference ties the minimum Archive size to the draw-with-empty-Archive condition', () => {
  const body = deckBody();
  assert.ok(body, 'expected a Deck Construction section');
  assert.ok(/section 10\.1/i.test(body), 'expected an explicit cross-reference to Section 10.1');
  assert.ok(
    /draw.{0,40}empty archive|empty archive|draw from an empty archive/i.test(body),
    'expected the section to discuss the draw-with-empty-Archive condition in connection with Section 10.1'
  );
});
```

### Expected output

Before Edit 1 (rules.md unedited): running `node --test` fails with multiple
`not ok` lines from `test/design-deckbuilding.test.js` — every test that
calls `deckBody()`/`sectionText(...)` on a section that does not yet exist
fails on the `assert.ok(body, ...)` guard, and the "sole new top-level
section" / "exactly 11 total" tests fail because there are only 10 today.
All other existing test files continue to pass unchanged.

After Edit 1 is applied: `node --test` reports all tests passing, ending in
a summary block like:

```
# pass <total including all new tests>
# fail 0
```

with zero `not ok` lines anywhere in the output, and no change to any
existing test file's pass/fail status (this unit touches no `.js` source
file, no `.html`/`.svg` file, and no test file other than the new one).

## Manual/observable check

This is pure Markdown; there is no UI to click through. The observable
"feature" is that `design/rules.md`, read top to bottom, now has an unbroken
numbered section sequence 1-11, and a reader can now answer, standalone and
without re-deriving it from `gamePlan.md`'s one-line summary, "how big does
my Archive have to be, and how many copies of one card can I run?" — and can
see exactly why that number matters by following the Section 10.1
cross-reference to the draw-elimination rule it makes concrete.

## Risk self-assessment (FIRE)

- **Fixability / reversibility**: trivial to revert — a single Markdown file
  append plus one new test file, both plain-text, in version control.
- **Impact**: none on running software; `design/rules.md` is documentation
  consumed by humans (and by these structural tests), not by any game engine
  (T8: "no code, no game software").
- **Reach**: no other file depends on `design/rules.md`'s prose content
  structurally except the `test/design-*.test.js` files. Verified none of
  the existing test files (`design-rules.test.js`, `design-winning-losing.test.js`,
  `design-battlefield.test.js`, `design-map-setup-playtest.test.js`) assert
  an exact total section count or otherwise break when an 11th top-level
  section is appended — each only checks strict *sequential* numbering or
  specific section titles/prefixes it already expects to find at fixed
  low indices.
- **Exposure**: none — no secrets, no user data, no schema, no runtime
  behavior change.

Overall low blast radius. The only judgment call is the two invented numbers
(40 / 3), called out above; they are ordinary, easily revised documentation
facts, not a technical or security risk, so this does not need a
confirmation gate.


## Findings

# Blind Review — cardgame-deck-construction-rules, cycle 1

## Method

Reviewed spec, plan.md, and diff. Note: sandboxed command execution
(Bash/PowerShell) was unavailable in this session (all invocations were
rejected with "This command requires approval"), so `node --test` could not
be run directly. Verification was instead done statically: read the full
current `design/rules.md` (all section headings, and the full text of
Sections 3, 5.1, 9, 10, and the new Section 11), read
`test/helpers/markdown.js` to hand-trace the test helpers' logic against the
new section's actual heading structure and body text, and grepped the repo
for section-count assumptions in sibling test files that a new Section 11
could break.

## AC-by-AC accounting

**AC1** — `design/rules.md` gains one new numbered top-level section,
`## 11. Deck Construction`, appended immediately after the end of the
existing `## 10. Winning & Losing Conditions` content (confirmed via
`git grep -n '^## \d+\.'`: headings run `1.`...`10.` unchanged, in order,
then `11. Deck Construction`). Titles for Sections 1-10 are byte-identical
to the pre-diff file (diff only appends after the last line). Satisfied.

**AC2** — Section 11.1 states: "Each challenger's Archive (Section 3) MUST
contain at least 40 cards at the start of a game... A challenger MAY NOT
begin a game with an Archive containing fewer than 40 cards." One fixed
minimum, tied explicitly to game start. Satisfied.

**AC3** — Section 11.2 states: "A challenger's Archive MAY NOT contain more
than 3 cards sharing the same Name (Section 9.1's Name field)." Satisfied.

**AC4 (held out, cross-reference requirement from Intent)** — Section 11's
intro and 11.1 both cite "Section 10.1" explicitly and correctly describe
its actual content (checked Section 10.1 directly: condition 2 is "required
to draw a card during their Dawn Phase (Section 5.1) and their Archive holds
no card to draw" — matches what Section 11 says it's closing the gap on).
Not a visible AC but confirmed accurate and non-fabricated.

## Cross-reference accuracy check (not required by ACs, but checked to rule
out a plausible-sounding-but-wrong document)

- Section 3 does define Archive as "each challenger's deck." Correct.
- Section 5.1 (Dawn Phase) is where the draw happens. Correct.
- Section 9.1 field 1 is "Name." Correct.
- All six cards used in the 11.3 worked example (Cinderfall Bolt, Signal
  Relay, Foresight Ping, Spore Warden, Foundry Works, Reactive Turret) exist
  in Section 9 with exactly the cost/type text the worked example relies on
  (verified against Sections 9.2–9.7 directly). The arithmetic in the
  example (18 + 22 = 40; 45 total with a 4th Cinderfall Bolt) is correct.
- The `gamePlan.md` quote ("build your deck, and play") is real —
  confirmed via grep against `gamePlan.md:23`.

## Test file sanity

- `test/design-deckbuilding.test.js` requires
  `./helpers/markdown` (`parseSections`, `sectionText`, `findSection`),
  which already exists pre-diff and is unmodified; hand-traced its regex
  logic (`/^(#{1,6})\s+(.*)$/` heading matcher, level-based section-body
  slicing) against the new Section 11/11.1/11.2/11.3 headings and confirmed
  each assertion in the new test file matches real file content.
- Grepped sibling test files (`design-winning-losing.test.js`,
  `design-rules.test.js`, `design-cardtypes.test.js`,
  `design-battlefield.test.js`) for hardcoded total-section-count
  assumptions that a new Section 11 could break. None found — the closest
  is `design-rules.test.js`'s `sections.length >= 5` (a floor, not an exact
  count) and `design-winning-losing.test.js`'s strict-sequential-numbering
  check, which the new Section 11 (numbered 11, immediately after 10)
  satisfies rather than breaks.

## Other observations (non-gating)

- The diff also regenerates `site/design/rules.html`. This isn't in
  plan.md's stated file list ("Do not touch any other file"), but the repo
  has a `tools/build-site.js` + `test/build-site.test.js` pair that
  regenerates `site/*.html` from `design/*.md`; leaving the site page stale
  would itself be a gap. The regenerated HTML preserves the same
  list-rendering quirk (a `<ol><li>` capturing only a list item's first
  line, with the rest of the paragraph flowing as a separate `<p>`) already
  visible in the unchanged, pre-existing part of the diff context (Section
  10.3's list). That confirms the new HTML was produced by actually running
  the existing build tool on the new content, not hand-written — the quirk
  is PRE-EXISTING to the build tool, not something this diff introduces.
- No glossary edit was made. Plan's justification (Archive and Name are
  already-defined terms; this unit puts numbers on them, not new
  terminology) checks out against Section 2's actual glossary entries.

## Findings

None. No INTRODUCED defects found.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T13:37:27.937Z] **bolt:start** — unit=cardgame-deck-construction-rules start_sha=a7ed5f9939b945a8cd78df6f8638246b471689e2 branch=bolt/cardgame-deck-construction-rules worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-deck-construction-rules
- [2026-07-28T13:37:37.958Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T13:43:33.128Z] **plan:done** — plan.md written
- [2026-07-28T13:46:32.913Z] **tests:done** — RED verified on test/design-deckbuilding.test.js (exit=1)
- [2026-07-28T13:49:47.430Z] **build:c1** — tests green, committed
- [2026-07-28T13:53:10.630Z] **review:c1** — APPROVE
- [2026-07-28T13:57:59.012Z] **review:devils-advocate-inconclusive** — NEEDS_WORK with no substantive findings — attack does not count
- [2026-07-28T13:57:59.013Z] **review:devils-advocate** — APPROVE
- [2026-07-28T13:58:09.226Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-28T13:58:09.721Z] **merge:done** — auto-merged bolt/cardgame-deck-construction-rules into master (worktree)


## Receipt

```json
{
  "start_sha": "a7ed5f9939b945a8cd78df6f8638246b471689e2",
  "end_sha": "b2f3dfc70a572f47dfaba37464186e645366e059",
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
  "timestamp": "2026-07-28T13:58:09.223Z",
  "valid": true,
  "agent_reports": {
    "planner": "The plan is written to `C:\\github\\AgentBox\\units\\cardgame-deck-construction-rules\\plan.md`.\n\nSummary: single-bolt plan appending a new Section 11 (Deck Construction) to `design/rules.md` after the existing Section 10, plus a new `test/design-deckbuilding.test.js`. I picked minimum Archive size = 40 and max copies-per-name = 3 (no numbers existed anywhere in the repo, so these are new documentation facts, called out explicitly rather than silently assumed) and cross-referenced Section 10.1's draw-with-empty-Archive elimination condition by number. Verified against the existing test suite's conventions (`design-rules.test.js`, `design-winning-losing.test.js`, etc.) that appending an 11th top-level section won't break any existing assertions. GATE: none — this is low-risk, reversible documentation with no code/schema impact.",
    "test_writer": "Wrote `test/design-deckbuilding.test.js` under `test/`, verbatim from the plan's spec — no files under `src/` were touched (this unit has no `src/` directory at all; it's pure Markdown).\n\nTest execution via `node --test` is being auto-blocked in this session, but by inspection against the current `design/rules.md`:\n- It has exactly 10 top-level numbered sections ending at \"10. Winning & Losing Conditions\" — no \"Deck Construction\" section exists yet.\n- All AC1 tests will fail (section count is 10, not 11; `sections[10]` is undefined).\n- AC2/AC3/AC4 tests call `deckBody()`, which returns `null` since no matching section exists, failing their `assert.ok(body, ...)` guards.\n\nThis matches the plan's documented RED expectation exactly, so the suite is currently failing as required — the harness's RED check should confirm this.",
    "builder_c1": "All 379 tests pass, and the only changes are to `design/rules.md` (the new Section 11) plus the auto-regenerated `site/design/rules.html` build artifact — no files under `test/` were touched.\n\nSummary: added `## 11. Deck Construction` to `design/rules.md` after Section 10, with 11.1 (40-card minimum Archive size), 11.2 (max 3 copies per named card), and 11.3 (worked example), cross-referencing Section 10.1's empty-Archive elimination condition. Fixed one wording issue where a line wrap broke the AC3 regex match (moved \"Name\" onto the same line as \"sharing the same\" instead of wrapping after \"same\").",
    "reviewer_c1": "All three visible ACs are satisfied and verified against the actual file content (not just the diff text), cross-references to Section 10.1/9.1/3/5.1 are accurate, section numbering is unbroken, no sibling test assumes a fixed total section count, and the regenerated `site/design/rules.html` shows the same pre-existing build-tool quirk seen in untouched diff context — confirming it's a real build-tool run, not manual edit drift. No introduced defects found.\n\nAPPROVE",
    "devils_advocate": "NEEDS_WORK"
  }
}
```

## Comments

(no comments.md)
