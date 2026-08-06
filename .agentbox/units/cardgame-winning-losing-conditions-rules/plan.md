GATE: confirm

# Plan: cardgame-winning-losing-conditions-rules

## Spec issue to confirm before/while building (read this first)

AC1 (and the unit's Intent paragraph) assume "the Homeworld Capture rule
already defined in Section 8" is a rule under which a Homeworld *can* be
Captured, and ask the new section to state elimination "tied explicitly" to
that. But the shipped text of `design/rules.md` says the opposite, twice:

- Section 8.2: "A Homeworld MAY be Blockaded (Section 8.6) but MAY NOT be
  Captured, and MAY NOT change control by any rule or ability in this game."
- Section 8.6: "A Homeworld MAY be Blockaded like any other Planet, but MAY
  NOT be Captured — Homeworlds never change control (Section 8.2)."

So "a Homeworld is captured" cannot happen under the current rules. Writing
an elimination condition that fires "when a Homeworld is Captured" would
directly contradict Section 8 — which is exactly what held-out AC5
forbids ("does not redefine or contradict the existing Section 8 Capture
rule").

**Resolution used by this plan** (recommend confirming, but it's the only
reading that satisfies AC1 + AC5 simultaneously): the player-elimination
condition is **Core Integrity reaching 0** — a mechanic Section 1 and
Section 2 already establish ("a challenger who reaches 0 Core Integrity
loses immediately"), just never formalized into its own numbered section
or given the term "Eliminated." The new section cross-references Section
8's Capture rule by section number (satisfying AC1's "tied explicitly...
by cross-referencing its section number") specifically to state that
Capture is *not* the elimination trigger — because a Homeworld can never be
Captured, Capture alone never reduces Core Integrity directly. This keeps
the new section consistent with, not contradictory to, Section 8 (AC5),
while still substantively cross-referencing it (AC1) rather than ignoring
it. If a human wants elimination tied to Homeworld Capture literally, that
requires *also* changing Section 8.2/8.6 to allow Homeworld Capture, which
is out of scope for this unit (unit.md says "cross-referencing Section 8's
existing Capture rule rather than redefining it") — so that reading is not
available without a separate unit.

If you disagree with this resolution, stop and ask the user before
building; otherwise proceed with the plan below.

## Scope check (T-size)

Single bolt. One file gets a glossary insert + one new top-level section
appended (design/rules.md), one new test file is added (test/design-winning-losing.test.js).
No code, no other files. This is small enough for one plan → test → build → review cycle.

## Files to modify/create

1. `design/rules.md` — modify (two edits: glossary insert in Section 2, new Section 10 appended at end of file)
2. `test/design-winning-losing.test.js` — create (new file, failing tests written first per this repo's TDD convention — see recent commits like "test(cardgame-jaina-card-sync-dryrun): failing tests from visible ACs")

Do not touch any other file. Do not renumber Sections 1-9. Do not edit
Section 1's intro paragraph (it already doesn't mention Sections 8 or 9
either — precedent set by the prior two units that added those sections —
so leave it alone here too, don't fix that pre-existing gap as a drive-by).

---

## Edit 1 of 2: Glossary additions (Section 2)

File: `design/rules.md`

Insert three new bolded glossary entries between the existing **Capture**
entry (the last Section-8-related term) and the existing **Card Type**
entry (the first Section-9-related term). This preserves the document's
existing thematic grouping and satisfies AC4 ("added to the Section 2
glossary before substantive use").

Find this exact existing text (lines ~121-124 currently):

```
- **Capture** — the result of a further Assault against an already-Blockaded
  Planet: control passes to the assaulting challenger and every Generator on
  the Planet is destroyed (Section 8.6).
- **Card Type** — one of the five categories a card may belong to: Magic,
```

Replace it with (adds three bullets, keeps the two existing lines byte-for-byte):

```
- **Capture** — the result of a further Assault against an already-Blockaded
  Planet: control passes to the assaulting challenger and every Generator on
  the Planet is destroyed (Section 8.6).
- **Eliminated** — a challenger removed from the rest of the game because
  they have met an elimination condition (Section 10.1); an Eliminated
  challenger takes no further turns and receives no further priority
  (Section 10.2).
- **Game end** — the moment, defined in Section 10.2, at which the game
  stops: either because only one challenger remains un-Eliminated, or
  because every challenger is Eliminated at the same instant. Nothing
  changes in the game after Game End.
- **Draw** — the Game End (Section 10.2) result when every challenger is
  Eliminated at the same instant; a draw has no winner.
- **Card Type** — one of the five categories a card may belong to: Magic,
```

(The rest of the Card Type entry, and everything after it, is unchanged.)

---

## Edit 2 of 2: New Section 10, appended at end of file

File: `design/rules.md`

The file currently ends (last ~10 lines) with the Reactive Turret example
under Section 9.7:

```
> **Reactive Turret**
> Cost line: 1 Tangle, 1 Circuit
> Type line: Magic Technology — Permanent
> Rules text: Slow. Spent: deal 1 damage to any Unit.

Reactive Turret's total cost is 2 Fount Points: 1 paid from the Tangle
resource pool and 1 from the Circuit resource pool, never 2 from either
pool alone. Its type line lists Magic, an instant/sorcery-speed resolving
type, and Technology, a permanent type; per the rule above, the presence
of Technology makes the whole card a Permanent, so Reactive Turret stays
on the Field once played rather than resolving to the Wreck.
```

Find that exact block (it is the last text in the file) and append the
following new section immediately after it, separated by one blank line
(so the file's final line becomes the last line of the new Section 10.3
text below). Do not change anything in the block above; only append after it.

```

## 10. Winning & Losing Conditions

Section 1 already states, in prose, the two ways a challenger's game can
end: a challenger's home base being reduced to nothing, or a challenger
being unable to draw a required card. This section gives those events a
name — **Elimination** — states exactly when the game itself ends, and
resolves a concrete edge case at the same rigor as Section 8's Blockade
and Capture rules. Nothing in this section changes or restates any rule
already stated in Sections 1-9; where a rule already exists, this section
cross-references it by section number instead.

### 10.1 Player Elimination

A challenger is **Eliminated** the instant either of the following happens:

1. Their Core Integrity is reduced to 0 (Section 2's Home base and Core
   Integrity terms; Section 1).
2. They are required to draw a card during their Dawn Phase (Section 5.1)
   and their Archive holds no card to draw (Section 1).

Elimination happens immediately when its condition is met — even in the
middle of a single Queue entry's resolution (Section 6.2) or during
another challenger's turn — and is never itself added to the Queue, so it
cannot be responded to.

Capturing a Planet (Section 8.6) is not, on its own, an elimination
condition, and this section does not add one. A Homeworld specifically MAY
NOT be Captured (Section 8.2, Section 8.6), so Capture never reduces a
challenger's Core Integrity directly. Capturing a non-Homeworld Planet does
destroy every Generator on it (Section 8.6), which can starve a challenger
of Fount Points and make it easier for their opponent to eventually force
the Core Integrity condition above — but that later reduction of Core
Integrity, not the Capture itself, is what would Eliminate them.

### 10.2 Game End

The game ends the instant only one challenger remains un-Eliminated
(Section 10.1); that challenger wins immediately.

Every game under this rulebook is played between exactly two challengers
(Section 1). Because of this, Eliminating either challenger always leaves
exactly one challenger un-Eliminated, except in the simultaneous case
below — so Elimination and Game End are the same event: the instant one
challenger is Eliminated, the other has already won, and no further turn
is taken. The turn structure of Section 5 does not continue past the turn
in which the Elimination happened, no matter which phase that turn had
reached.

If both challengers meet an elimination condition (Section 10.1) at the
same instant, the game ends in a **draw**: neither challenger wins, and,
as above, no further turn is taken.

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

---

## New test file: `test/design-winning-losing.test.js`

Create this file with the following complete content. It follows the exact
conventions already used by `test/design-rules.test.js` and
`test/design-battlefield.test.js` (same helpers, same `topLevelSections`
pattern, same style of AC-labeled test names). Write this file FIRST and
confirm the tests fail against the current (un-edited) `design/rules.md`,
per this repo's TDD convention, before making Edit 1 and Edit 2 above.

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

function endgameBody() {
  const content = readRules();
  const sections = parseSections(content);
  return sectionText(sections, /winning.{0,5}losing/i);
}

// ---------------------------------------------------------------------------
// AC1: a new numbered 'Winning & Losing Conditions' section defines at least
// one player-elimination condition, tied explicitly to Section 8's Capture
// rule by cross-referencing its section number rather than restating it.
// ---------------------------------------------------------------------------

test('AC1: rules.md has a numbered top-level Winning & Losing Conditions section', () => {
  const sections = topLevelSections(readRules());
  const found = sections.some((s) => /winning.{0,5}losing/i.test(s.title));
  assert.ok(
    found,
    `expected a numbered top-level heading mentioning "Winning & Losing Conditions" among [${sections.map((s) => s.title).join(', ')}]`
  );
});

test('AC1: the top-level numbered sections remain in strict sequence starting at 1', () => {
  const sections = topLevelSections(readRules());
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strict numbering, got [${numbers.join(', ')}]`);
  }
});

test('AC1: no existing numbered section is removed or renumbered (Sections 1-9 remain, in order, before Section 10)', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  const expectedPrefixes = ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.'];
  for (let i = 0; i < expectedPrefixes.length; i++) {
    assert.ok(
      titles[i] && titles[i].startsWith(expectedPrefixes[i]),
      `expected section ${i} to start with "${expectedPrefixes[i]}", got [${titles.join(', ')}]`
    );
  }
});

test('AC1: defines a player-elimination condition tied to Core Integrity reaching 0', () => {
  const body = endgameBody();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(/eliminat/i.test(body), 'expected elimination language');
  assert.ok(/core integrity/i.test(body) && /reduced to 0|reaches? 0/i.test(body), 'expected an elimination condition tied to Core Integrity reaching 0');
});

test('AC1: cross-references Section 8\'s Capture rule by section number rather than restating it', () => {
  const body = endgameBody();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(/section 8\.\d/i.test(body), 'expected an explicit cross-reference to a Section 8.x subsection');
  assert.ok(/captur/i.test(body), 'expected the section to discuss Capture in relation to elimination');
});

// ---------------------------------------------------------------------------
// AC2: states what ends the game (single remaining un-eliminated player, or
// an explicit draw condition) and how remaining players' turns proceed once
// another player is eliminated.
// ---------------------------------------------------------------------------

test('AC2: states the game ends when a single challenger remains un-eliminated', () => {
  const body = endgameBody();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(
    /only one challenger remains|one challenger remains un-eliminated/i.test(body),
    'expected an explicit single-remaining-player win condition'
  );
});

test('AC2: states an explicit draw condition', () => {
  const body = endgameBody();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(/\bdraw\b/i.test(body), 'expected a draw result to be named');
  assert.ok(/same instant|simultaneous/i.test(body), 'expected the draw to be tied to simultaneous elimination');
});

test('AC2: states how turns proceed once a challenger is eliminated', () => {
  const body = endgameBody();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(
    /no further turn|does not continue/i.test(body),
    'expected the section to state what happens to turns once a challenger is eliminated'
  );
});

// ---------------------------------------------------------------------------
// AC3: includes at least one numbered worked example resolving a concrete
// game-end edge case (e.g. two players eliminated in the same turn).
// ---------------------------------------------------------------------------

test('AC3: includes a worked-example sub-heading under Winning & Losing Conditions', () => {
  const content = readRules();
  const sections = parseSections(content);
  const idx = findSection(sections, /winning.{0,5}losing/i);
  assert.notStrictEqual(idx, -1, 'expected a Winning & Losing Conditions section');
  const level = sections[idx].level;
  const exampleHeadings = [];
  for (let i = idx + 1; i < sections.length; i++) {
    if (sections[i].level <= level) break;
    if (/worked example/i.test(sections[i].title)) exampleHeadings.push(sections[i]);
  }
  assert.ok(exampleHeadings.length >= 1, 'expected at least one "Worked Example" sub-heading');
});

test('AC3: the worked example resolves a concrete simultaneous/same-turn elimination edge case with a numbered list', () => {
  const content = readRules();
  const sections = parseSections(content);
  const idx = findSection(sections, /winning.{0,5}losing/i);
  assert.notStrictEqual(idx, -1, 'expected a Winning & Losing Conditions section');
  const level = sections[idx].level;
  let example = null;
  for (let i = idx + 1; i < sections.length; i++) {
    if (sections[i].level <= level) break;
    if (/worked example/i.test(sections[i].title)) { example = sections[i]; break; }
  }
  assert.ok(example, 'expected a "Worked Example" sub-heading to check');
  const body = example.lines.join('\n');
  const numberedSteps = body.match(/^\d+\.\s+\S/gm) || [];
  assert.ok(numberedSteps.length >= 3, `expected at least 3 numbered steps in the worked example, found ${numberedSteps.length}`);
  assert.ok(body.length > 300, `expected a substantive worked example (>300 chars), got ${body.length} chars`);
  assert.ok(/eliminat/i.test(body), 'expected the worked example to involve elimination');
  assert.ok(/draw|simultaneous/i.test(body), 'expected the worked example to involve the draw/simultaneous edge case');
});

// ---------------------------------------------------------------------------
// AC4: new terms introduced by this section are added to the Section 2
// glossary before substantive use.
// ---------------------------------------------------------------------------

const NEW_GLOSSARY_TERMS = [
  { label: 'eliminated', pattern: 'eliminated' },
  { label: 'game end', pattern: 'game\\s+end' },
  { label: 'draw', pattern: 'draw' },
];

for (const { label, pattern } of NEW_GLOSSARY_TERMS) {
  test(`AC4: the Glossary/Vocabulary section defines "${label}"`, () => {
    const content = readRules();
    const sections = parseSections(content);
    const glossary = sectionText(sections, /glossary|vocabulary/i);
    assert.ok(glossary, 'expected a Glossary/Vocabulary section');
    const re = new RegExp(`\\*\\*[^*\\n]*\\b${pattern}\\b[^*\\n]*\\*\\*`, 'i');
    assert.ok(re.test(glossary), `expected a bolded glossary entry defining "${label}"`);
  });
}

test('AC4: the Glossary/Vocabulary section precedes the Winning & Losing Conditions section', () => {
  const sections = topLevelSections(readRules());
  const glossaryIdx = sections.findIndex((s) => /glossary|vocabulary/i.test(s.title));
  const endgameIdx = sections.findIndex((s) => /winning.{0,5}losing/i.test(s.title));
  assert.notStrictEqual(glossaryIdx, -1, 'expected a Glossary/Vocabulary section');
  assert.notStrictEqual(endgameIdx, -1, 'expected a Winning & Losing Conditions section');
  assert.ok(glossaryIdx < endgameIdx, 'expected Glossary to precede Winning & Losing Conditions');
});

// ---------------------------------------------------------------------------
// AC5 (held-out, checked here for construction-time consistency): the new
// section must not contradict Section 8's rule that Homeworlds cannot be
// Captured.
// ---------------------------------------------------------------------------

test('AC5: does not claim a Homeworld can be Captured (must stay consistent with Section 8.2/8.6)', () => {
  const body = endgameBody();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(
    /may not be captured/i.test(body),
    'expected the section to affirm, consistent with Section 8, that a Homeworld cannot be Captured'
  );
});
```

### Expected output

Before Edit 1/2 (rules.md unedited): running `node --test` fails with
multiple `not ok` lines from `test/design-winning-losing.test.js` — at
minimum "AC1: rules.md has a numbered top-level Winning & Losing Conditions
section" and every test that calls `endgameBody()`/`sectionText(...)` on a
section that does not yet exist (those helper calls return `null`, and the
`assert.ok(body, ...)` guard fails first). All other existing test files
continue to pass unchanged.

After Edit 1 and Edit 2 are applied: `node --test` reports all tests
passing, e.g. a summary block ending in:

```
# pass <total including all new tests>
# fail 0
```

with zero `not ok` lines anywhere in the output, and no change to any
existing test file's pass/fail status (this unit does not touch any test
file other than the new one, and does not touch any `.js`/`.html`/`.svg`
source file).

## Manual/observable check

This is pure Markdown; there is no UI to click through. The observable
"feature" is that `design/rules.md`, read top to bottom, now has an
unbroken numbered section sequence 1-10, a glossary that defines every
term before its first substantive use (including the three new ones), and
a Section 10 that a reader can use standalone to answer "how does this
game end?" without needing to re-derive it from Section 1's one-sentence
summary.

## Risk self-assessment (FIRE)

- **Fixability / reversibility**: trivial to revert — a single Markdown
  file edit plus one new test file, both plain-text, in version control.
- **Impact**: none on running software; `design/rules.md` is documentation
  consumed by humans (and by these structural tests), not by any game
  engine (T8: "no code, no game software").
- **Reach**: no other file depends on `design/rules.md`'s prose content
  structurally except the `test/design-*.test.js` files, none of which
  this unit touches except adding the one new file.
- **Exposure**: none — no secrets, no user data, no schema, no runtime
  behavior change.

Overall low blast radius. The one real risk is the spec-contradiction
called out at the top of this plan (AC1 vs. Section 8.2/8.6); that's why
this plan is gated on confirmation rather than a FIRE-matrix technical risk.
