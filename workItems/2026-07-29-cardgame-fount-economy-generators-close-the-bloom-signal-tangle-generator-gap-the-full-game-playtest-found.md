# cardgame-fount-economy-generators: Close the Bloom/Signal/Tangle Generator gap the full-game playtest found

## Header

- unit: cardgame-fount-economy-generators
- title: Close the Bloom/Signal/Tangle Generator gap the full-game playtest found
- project: cardgame
- completed: 2026-07-29
- outcome: escalated
- start_sha: 3a889feeec5c166f98b622fa55846886d389f160
- end_sha: 67de71057980de1f4140c1ada2ea839109980a14

## Intent

design/playtest-full-game.md (shipped) played a complete game under the current 28-card pool across design/cards/alpha-set.md, frontier-set.md, and character-signatures.md, and its closing 'What This Playtest Surfaced' section documents, with a table checkable against those three files, that Mass is the only Fount with both a Generator and a card cheap enough (1 point) to replay after the Generator; Circuit has a Generator but no 1-cost card; Bloom and Tangle have neither a Generator nor a 1-cost card; Signal has a 1-cost card (Whispered Contract) but no Generator. Because Section 4 empties resource pools every turn and Section 5.2 lets only an already-controlled Generator produce points, this caps every deck at 1 Fount Point/turn forever and makes Combat, Discovery past Length 1, and Capture unreachable through ordinary play. This unit adds exactly the 6 cards the playtest document's own recommendation names to close that gap: a Generator permanent for Bloom (Mireth Bloom/Biology), Signal (Panoptic Concord/Intelligence), and Tangle (Starweave Communion/Magic), each following the existing Generator rules-text pattern from Salvage-Wrought Bastion/Replicant Foundry Core and citing Section 5.2; plus a 1-cost card for Circuit (Wrought Assembly/Technology), Bloom (Mireth Bloom/Biology), and Tangle (Starweave Communion/Magic). All 6 cards live in a new design/cards/fount-economy-set.md file, following the canonical Section 9.1 template already enforced by test/design-frontier-cards.test.js and test/design-cards.test.js, with a matching test/design-fount-economy-cards.test.js. No existing card file is touched, and no rules.md change is needed since Generators and costs are already-defined mechanics being applied to the three under-served Founts.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/fount-economy-set.md exists and contains exactly 6 distinct named cards, each with Cost line, Type line, and Rules text in that order (and a Stats/counters line, only if present, only on Permanents) — the same template test/design-frontier-cards.test.js already enforces for frontier-set.md.
- AC2 [paraphrase]: Exactly one of the 6 cards is a Permanent whose rules text reads as a Generator attuned to Bloom, exactly one to Signal, and exactly one to Tangle, each producing 1 point of that Fount during the Generation Phase and citing Section 5.2, matching the existing 'This permanent is a Generator attuned to the <Fount>' pattern used by Salvage-Wrought Bastion and Replicant Foundry Core.
- AC3 [paraphrase]: Exactly one of the 6 cards (distinct from the three Generators above) has a Cost line of exactly '1 Circuit', exactly one has 'exactly 1 Bloom', and exactly one has exactly '1 Tangle'.
- AC4 [inferred] (held_out): design/cards/alpha-set.md, design/cards/frontier-set.md, and design/cards/character-signatures.md are byte-identical to before this unit, and each new card's flavor text names the correct race per the existing Cindral Reach/Mireth Bloom/Panoptic Concord/Starweave Communion/Wrought Assembly-to-Fount mapping used in frontier-set.md.

## Plan

GATE: none

# Plan: cardgame-fount-economy-generators

## What this unit does

Adds exactly 6 new cards to a brand-new file, `design/cards/fount-economy-set.md`,
closing the gap documented in `design/playtest-full-game.md`'s "What This Playtest
Surfaced" section: today only the Mass Fount has both a Generator and a 1-cost
card cheap enough to replay after it, capping every deck at 1 Fount Point/turn
forever and making Combat, Discovery past Length 1, and Capture unreachable
through ordinary play.

The 6 cards:

1. A Generator attuned to the **Bloom** (Mireth Bloom race, Biology type).
2. A Generator attuned to the **Signal** (Panoptic Concord race, Intelligence type).
3. A Generator attuned to the **Tangle** (Starweave Communion race, Magic type).
4. A 1-cost card in the **Circuit** (Wrought Assembly race, Technology type).
5. A 1-cost card in the **Bloom** (Mireth Bloom race, Biology type).
6. A 1-cost card in the **Tangle** (Starweave Communion race, Magic type).

A matching test file, `test/design-fount-economy-cards.test.js`, verifies AC1-AC4.

**Nothing else in the repo is touched.** Not `design/cards/alpha-set.md`, not
`design/cards/frontier-set.md`, not `design/cards/character-signatures.md`, not
`design/rules.md`, not `design/playtest-full-game.md`. This unit ships new cards
only; wiring them into the playtest procedure's decklists is explicitly out of
scope (it's not named by any AC).

## Risk self-assessment (FIRE)

- **Reversibility:** trivial — two new files, `git revert` undoes everything.
- **Security impact:** none — static design-doc content and a `node:test` file,
  no executable game logic, no user input.
- **User data:** none.
- **Schema changes:** none.

Low risk, low ambiguity, fully specified below. GATE: none.

## Important design decision — read before implementing (do not "fix" this)

The Intent paragraph describes the Signal and Tangle Generators as tied to
"Panoptic Concord/Intelligence" and "Starweave Communion/Magic." Taken literally
as single-Card-Type cards, this is impossible under the current rules text:

- `design/rules.md` Section 9.4: "Intelligence cards ... are
  instant/sorcery-speed resolving ... never a Permanent."
- `design/rules.md` Section 9.2: "a Magic card is never a Permanent."
- `design/rules.md` Section 2 Glossary: "**Generator** — a permanent that
  produces Fount Points."

So a pure-Intelligence or pure-Magic card literally cannot be a Generator — it
can never be a Permanent in the first place. This is a real conflict between
the Intent's shorthand and the existing rules text, not a held-out AC issue (it
sits inside AC2, which is visible), and it's resolved here, not left for the
builder to guess at:

**Resolution:** give the Signal and Tangle Generators a second, permanent-legal
Card Type via the already-defined Section 9.7 multi-type/multi-cost mechanic,
exactly mirroring two cards that already exist in `design/cards/alpha-set.md`:
`Signal-Wrought Prototype` (`Intelligence Technology — Permanent`, cost `1
Signal, 1 Circuit`) and `Tangle-Forged Bolt` (`Magic Materials — Permanent`,
cost `1 Tangle, 1 Mass`). This is not an arbitrary choice: `design/races/
panoptic-concord.md` lists "Complementary strengths: Technology, Magic" and
`design/races/starweave-communion.md` lists "Complementary strengths:
Materials, Biology" — Technology and Materials are each already the
*complementary* strength of the race that needs the second type, so the
pairing is thematically load-bearing, not incidental.

The Bloom Generator does **not** need this treatment: Biology alone is already
a permanent Card Type (Section 9.6 lists Biology among the three permanent
types; Section 9.5 confirms "Biology cards ... are permanent"). One
consequence to keep: Section 9.5 also says "every Biology card is a Unit," so
the Bloom Generator (and the Bloom 1-cost card) MUST carry a Stats/counters
line with a combat strength — this is not optional for Biology cards, unlike
Materials/Technology.

No rules.md change is needed or wanted — per the Intent, Generators and
multi-typing are already-defined mechanics being applied to under-served
Founts, not new mechanics.

## Step 1 — create `design/cards/fount-economy-set.md`

Create this file with exactly this content:

```markdown
# Fount Economy Set — Closing the Generator Gap

## Summary

This file contains 6 named cards that close the Fount-economy gap documented
in *design/playtest-full-game.md*'s "What This Playtest Surfaced" section: of
the five Founts, only the Mass has both a Generator and a card cheap enough (1
point) to replay after it, and Combat, Discovery past Length 1, and Capture
are unreachable through ordinary play as a result. This file adds exactly
what that section's own recommendation names — a Generator permanent attuned
to the Bloom (the Mireth Bloom), the Signal (the Panoptic Concord), and the
Tangle (the Starweave Communion), each following the canonical Generator
rules-text pattern of `Salvage-Wrought Bastion` and `Replicant Foundry Core`
and citing *design/rules.md* Section 5.2; and a 1-cost card for the Circuit
(the Wrought Assembly), the Bloom (the Mireth Bloom again), and the Tangle
(the Starweave Communion again). Every card follows the canonical template of
*design/rules.md* Section 9.1.

The Signal and Tangle Generators are dual-typed (Intelligence Technology, and
Magic Materials) with a matching dual-Fount cost line, per Section 9.7:
Intelligence and Magic alone can never be a Permanent (Sections 9.4, 9.2), so
a Signal or Tangle Generator — which by definition must be a Permanent
(Section 2) — needs a second, permanent-legal Card Type. This mirrors the
existing `Signal-Wrought Prototype` and `Tangle-Forged Bolt` cards in
*design/cards/alpha-set.md*, and lines up with each race's own complementary
strengths in *design/races/*.

## The Mireth Bloom — Biology, the Bloom

### Cradle-Root Colony

Cost line: 2 Bloom
Type line: Biology — Permanent
Rules text: Slow. This permanent is a Generator attuned to the Bloom: during
the Generation Phase (Section 5.2), it produces 1 Bloom Point, added to its
controller's Bloom resource pool.
Stats/counters line: Combat strength 1. Enters with no counters.

*The Mireth Bloom doesn't build a generator so much as let one happen —
root-flesh finds a Fount vein and drinks, and drinking is already growing.*

### Sporeling Latch

Cost line: 1 Bloom
Type line: Biology — Permanent
Rules text: Slow.
Stats/counters line: Combat strength 0. Enters with one Growth counter.

*The Mireth Bloom spares nothing this small a second thought. It isn't the
Sporeling Latch that matters — only what it becomes.*

## The Panoptic Concord — Intelligence, the Signal

### Panoptic Relay Spire

Cost line: 1 Signal, 1 Circuit
Type line: Intelligence Technology — Permanent
Rules text: Slow. This permanent is a Generator attuned to the Signal: during
the Generation Phase (Section 5.2), it produces 1 Signal Point, added to its
controller's Signal resource pool.

*The Panoptic Concord built the Relay Spire to do, continuously and without
fanfare, the one thing the Concord already does better than anyone: turn
watching into power.*

## The Starweave Communion — Magic, the Tangle

### Communion Waystone

Cost line: 1 Tangle, 1 Mass
Type line: Magic Materials — Permanent
Rules text: Slow. This permanent is a Generator attuned to the Tangle: during
the Generation Phase (Section 5.2), it produces 1 Tangle Point, added to its
controller's Tangle resource pool.

*The Starweave Communion raises a Waystone wherever the Tangle runs close
enough to the surface to be petitioned — and the First Weave, unasked,
answers anyway.*

### Whispered Rite

Cost line: 1 Tangle
Type line: Magic
Rules text: Fast. When this resolves, reduce any Unit's combat strength by 1
until the end of the turn.

*The Starweave Communion needs no grand ritual for a small unmaking.
Sometimes the Tangle only asks for a whisper.*

## The Wrought Assembly — Technology, the Circuit

### Stamped Chassis Unit

Cost line: 1 Circuit
Type line: Technology — Permanent
Rules text: Slow. Spent: place a Fortification counter on any permanent you
control.

*The Wrought Assembly stamps ten thousand of these before breakfast — cheap
enough to lose, uniform enough that losing one changes nothing.*
```

Notes on this content:

- Headings must be exactly `#`, `##`, `###` as shown — the test parser
  (`test/helpers/markdown.js`) treats every `###` heading as one card and
  everything under it, up to the next heading of any level, as that card's
  body.
- The blank line between fields is not required by the parser, but keep the
  field order exactly `Cost line:` → `Type line:` → `Rules text:` → (optional)
  `Stats/counters line:`, matching `frontier-set.md` and `alpha-set.md`.
- `Whispered Rite` and `Panoptic Relay Spire`/`Communion Waystone`
  deliberately do **not** carry a Stats/counters line — `Panoptic Relay
  Spire` and `Communion Waystone` are Permanents but not Units (Technology/
  Materials don't force a Unit), and `Whispered Rite` is not a Permanent at
  all (pure Magic).

## Step 2 — create `test/design-fount-economy-cards.test.js`

Create this file with exactly this content:

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'fount-economy-set.md');

// Fount -> the race whose card ties to it, per the race-to-Fount mapping
// design/cards/frontier-set.md already uses (one card per race, keyed by
// that race's own primary Fount strength under design/races/).
const FOUNT_TO_RACE = {
  Mass: 'Cindral Reach',
  Bloom: 'Mireth Bloom',
  Signal: 'Panoptic Concord',
  Circuit: 'Wrought Assembly',
  Tangle: 'Starweave Communion',
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readCardsFile() {
  if (!fs.existsSync(CARDS_PATH)) return null;
  return fs.readFileSync(CARDS_PATH, 'utf8');
}

// Each `###` heading is one card; its body is the raw lines directly under
// it — same convention as design/cards/frontier-set.md and
// test/design-frontier-cards.test.js.
function listCards() {
  const content = readCardsFile();
  if (content === null) return [];
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

const cards = listCards();
const cardsToCheck = cards.length
  ? cards
  : [{ title: '<no cards found — design/cards/fount-economy-set.md missing or empty>', body: '' }];

function isGeneratorAttunedTo(card, fount) {
  return new RegExp(`This permanent is a Generator attuned to the ${fount}\\b`).test(card.body);
}

function costLine(card) {
  const m = card.body.match(/Cost line:\s*([^\n]+)/);
  return m ? m[1].trim() : '';
}

// ---------------------------------------------------------------------------
// AC1: design/cards/fount-economy-set.md exists and contains exactly 6
// distinct named cards, each with Cost line, Type line, and Rules text in
// that order (and a Stats/counters line, only if present, only on
// Permanents) — the same template test/design-frontier-cards.test.js
// already enforces for frontier-set.md.
// ---------------------------------------------------------------------------

test('AC1: design/cards/fount-economy-set.md exists', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
});

test('AC1: fount-economy-set.md contains exactly 6 distinct named cards', () => {
  const names = cards.map((c) => c.title);
  assert.strictEqual(names.length, 6, `expected exactly 6 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

for (const card of cardsToCheck) {
  test(`AC1: "${card.title}" has Cost line, Type line, and Rules text in order`, () => {
    const body = card.body;
    const costIdx = body.indexOf('Cost line:');
    const typeIdx = body.indexOf('Type line:');
    const rulesIdx = body.indexOf('Rules text:');
    assert.notStrictEqual(costIdx, -1, `expected a "Cost line:" field in "${card.title}"`);
    assert.notStrictEqual(typeIdx, -1, `expected a "Type line:" field in "${card.title}"`);
    assert.notStrictEqual(rulesIdx, -1, `expected a "Rules text:" field in "${card.title}"`);
    assert.ok(
      costIdx < typeIdx && typeIdx < rulesIdx,
      `expected Cost line -> Type line -> Rules text order in "${card.title}"`
    );
  });

  test(`AC1: "${card.title}" only carries a Stats/counters line after Rules text, and only if a Permanent`, () => {
    const body = card.body;
    const rulesIdx = body.indexOf('Rules text:');
    const statsIdx = body.indexOf('Stats/counters line:');
    if (statsIdx === -1) return;
    assert.ok(
      rulesIdx !== -1 && statsIdx > rulesIdx,
      `expected Stats/counters line to follow Rules text in "${card.title}"`
    );
    const typeMatch = body.match(/Type line:\s*([^\n]+)/);
    assert.ok(typeMatch, `expected a Type line to check permanence in "${card.title}"`);
    assert.ok(
      /\bPermanent\b/.test(typeMatch[1]),
      `expected "${card.title}" to be a Permanent since it carries a Stats/counters line, got type line: ${typeMatch[1]}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC2: exactly one of the 6 cards is a Permanent whose rules text reads as
// a Generator attuned to Bloom, exactly one to Signal, and exactly one to
// Tangle, each producing 1 point of that Fount during the Generation Phase
// and citing Section 5.2, matching the existing "This permanent is a
// Generator attuned to the <Fount>" pattern used by Salvage-Wrought Bastion
// and Replicant Foundry Core.
// ---------------------------------------------------------------------------

for (const fount of ['Bloom', 'Signal', 'Tangle']) {
  test(`AC2: exactly one card is a Generator attuned to the ${fount}`, () => {
    const matches = cards.filter((c) => isGeneratorAttunedTo(c, fount));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one Generator attuned to the ${fount}, found ${matches.length}: [${matches
        .map((m) => m.title)
        .join(', ')}]`
    );
  });

  test(`AC2: the ${fount} Generator produces 1 ${fount} Point, cites Section 5.2, and is a Permanent`, () => {
    const match = cards.find((c) => isGeneratorAttunedTo(c, fount));
    assert.ok(match, `expected to find a Generator attuned to the ${fount}`);
    if (!match) return;
    assert.match(match.body, /Section\s+5\.2/, `expected "${match.title}" to cite Section 5.2`);
    assert.match(
      match.body,
      new RegExp(`produces 1 ${fount} Point`),
      `expected "${match.title}" to produce 1 ${fount} Point`
    );
    const typeMatch = match.body.match(/Type line:\s*([^\n]+)/);
    assert.ok(
      typeMatch && /\bPermanent\b/.test(typeMatch[1]),
      `expected "${match.title}" to be a Permanent`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3: exactly one of the 6 cards (distinct from the three Generators
// above) has a Cost line of exactly "1 Circuit", exactly one has "1 Bloom",
// and exactly one has "1 Tangle".
// ---------------------------------------------------------------------------

for (const fount of ['Circuit', 'Bloom', 'Tangle']) {
  test(`AC3: exactly one non-Generator card has a Cost line of exactly "1 ${fount}"`, () => {
    const matches = cards.filter(
      (c) => costLine(c) === `1 ${fount}` && !/This permanent is a Generator attuned to/.test(c.body)
    );
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one non-Generator card costed exactly "1 ${fount}", found ${matches.length}: [${matches
        .map((m) => m.title)
        .join(', ')}]`
    );
  });
}

// ---------------------------------------------------------------------------
// AC4 (held-out, inferred): each new card's flavor text names the race
// matching the Fount it's tied to — Generators keyed by the Fount they're
// attuned to, the three 1-cost cards keyed by their Cost line's Fount — per
// the existing Cindral Reach/Mireth Bloom/Panoptic Concord/Starweave
// Communion/Wrought Assembly-to-Fount mapping used in frontier-set.md. The
// "alpha-set.md, frontier-set.md, and character-signatures.md are
// byte-identical to before this unit" half of AC4 is not automated here —
// see plan.md's "Step 3" verification note.
// ---------------------------------------------------------------------------

for (const fount of ['Bloom', 'Signal', 'Tangle']) {
  test(`AC4: the ${fount} Generator names the ${FOUNT_TO_RACE[fount]}`, () => {
    const match = cards.find((c) => isGeneratorAttunedTo(c, fount));
    assert.ok(match, `expected to find a Generator attuned to the ${fount}`);
    if (!match) return;
    assert.match(
      match.body,
      new RegExp(escapeRegExp(FOUNT_TO_RACE[fount])),
      `expected "${match.title}" to name the ${FOUNT_TO_RACE[fount]}`
    );
  });
}

for (const fount of ['Circuit', 'Bloom', 'Tangle']) {
  test(`AC4: the 1 ${fount} card names the ${FOUNT_TO_RACE[fount]}`, () => {
    const match = cards.find(
      (c) => costLine(c) === `1 ${fount}` && !/This permanent is a Generator attuned to/.test(c.body)
    );
    assert.ok(match, `expected to find a non-Generator card costed exactly "1 ${fount}"`);
    if (!match) return;
    assert.match(
      match.body,
      new RegExp(escapeRegExp(FOUNT_TO_RACE[fount])),
      `expected "${match.title}" to name the ${FOUNT_TO_RACE[fount]}`
    );
  });
}
```

## Step 3 — verify nothing else changed

`node --test` has no baseline snapshot of the other three card files to diff
against, so the "byte-identical" half of AC4 is enforced by discipline, not a
new test: **do not open `design/cards/alpha-set.md`,
`design/cards/frontier-set.md`, `design/cards/character-signatures.md`,
`design/rules.md`, or `design/playtest-full-game.md` in write/edit mode at
all.** Their own existing tests (`test/design-cards.test.js`,
`test/design-frontier-cards.test.js`, `test/design-signature-cards.test.js`,
`test/design-rules.test.js`, `test/design-full-game-playtest.test.js`) will
still run and still pass unmodified, since those files are untouched.

Before calling this unit done, run:

```
git status
```

and confirm the only changes are the two new files:

```
	new file:   design/cards/fount-economy-set.md
	new file:   test/design-fount-economy-cards.test.js
```

## Step 4 — run the test suite

```
node --test
```

Expected output: every existing test file still passes (unaffected — no
existing file was touched), plus the new `test/design-fount-economy-cards.test.js`
contributes 29 new passing subtests (1 file-exists + 1 count + 6 cards × 2
template checks + 3 fount × 2 AC2 checks + 3 fount AC3 checks + 6 AC4 checks
= 1 + 1 + 12 + 6 + 3 + 6 = 29), all green, 0 failing. The final summary line
from `node --test` will show a higher total pass count than before this unit
and `# fail 0`.

## Acceptance criteria checklist

- **AC1** — `fount-economy-set.md` exists, 6 distinct cards, canonical
  Section 9.1 field order, Stats/counters only on Permanents: covered by
  Step 1's content + Step 2's AC1 tests.
- **AC2** — exactly one Bloom, one Signal, one Tangle Generator, each citing
  Section 5.2 and matching the `Salvage-Wrought Bastion`/`Replicant Foundry
  Core` rules-text pattern: covered by `Cradle-Root Colony`,
  `Panoptic Relay Spire`, `Communion Waystone` + Step 2's AC2 tests.
- **AC3** — exactly one card each costed exactly `1 Circuit`, `1 Bloom`,
  `1 Tangle`, distinct from the three Generators: covered by
  `Stamped Chassis Unit`, `Sporeling Latch`, `Whispered Rite` + Step 2's AC3
  tests.
- **AC4** — other three card files untouched (Step 3, manual/discipline
  check) and each new card's flavor text names the correct race (Step 2's
  AC4 tests, covering all 6 cards via their Fount-keyed race mapping).


## Findings

# Blind Review — cardgame-fount-economy-generators (cycle 2)

## AC coverage

- **AC1** (exactly 6 cards, Cost/Type/Rules-text order, Stats/counters only on Permanents): card content in `design/cards/fount-economy-set.md` satisfies this — 6 distinct names, correct field order, Stats/counters lines present only on the two Biology Permanents. See INTRODUCED-1 below for why the accompanying test can't be trusted to confirm this reliably (it shares the same file/parsing approach, though the specific bug below doesn't happen to hit the AC1 assertions).
- **AC2** (exactly one Generator each for Bloom/Signal/Tangle, producing 1 point, citing Section 5.2, matching the "This permanent is a Generator attuned to the `<Fount>`" pattern): the card *content* does this correctly (Cradle-Root Colony/Bloom, Panoptic Relay Spire/Signal, Communion Waystone/Tangle). However the *test* added to verify it is broken — see INTRODUCED-1. This is the blocking finding.
- **AC3** (exactly one non-Generator card each costed exactly "1 Circuit" / "1 Bloom" / "1 Tangle"): satisfied by content (Stamped Chassis Unit, Sporeling Latch, Whispered Rite) and correctly verified by the test (its Generator-exclusion regex is a substring check that isn't affected by the bug below).

## Findings

### INTRODUCED-1 (blocking): AC2's core regex can never match the card text it's meant to verify

`test/design-fount-economy-cards.test.js` builds each card's `body` as the raw
markdown lines joined with `'\n'` (no whitespace normalization):

```js
return sections
  .filter((s) => s.level === 3)
  .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
```

`isGeneratorAttunedTo` then matches against that raw body with a plain regex
that requires a literal space between "to" and "the `<Fount>`":

```js
function isGeneratorAttunedTo(card, fount) {
  return new RegExp(`This permanent is a Generator attuned to the ${fount}\\b`).test(card.body);
}
```

But in `design/cards/fount-economy-set.md`, all three Generators wrap their
rules text at exactly that point, e.g. Cradle-Root Colony:

```
Rules text: Slow. This permanent is a Generator attuned to
the Bloom: during the Generation Phase
...
```

The literal source text is `"...attuned to\nthe Bloom:..."` — a newline, not
a space, sits between "to" and "the". A plain space character in a JS regex
only matches U+0020, never `\n`, so `isGeneratorAttunedTo` returns `false`
for all three Generator cards (Cradle-Root Colony/Bloom, Panoptic Relay
Spire/Signal, Communion Waystone/Tangle) — despite the content genuinely
satisfying AC2.

**Failure scenario:** run `node --test test/design-fount-economy-cards.test.js`.
Every test built on `isGeneratorAttunedTo` fails with 0-matches-instead-of-1:
- `AC2: exactly one card is a Generator attuned to the Bloom` (and Signal, Tangle)
- `AC2: the <Fount> Generator produces 1 <Fount> Point, cites Section 5.2, and is a Permanent` (all three — the `assert.ok(match, ...)` fires first since `match` is `undefined`)
- `AC4: the <Fount> Generator names the <Race>` (all three, same root cause)

That's at least 9 failing tests in a suite whose entire purpose is to gate
this merge on AC2. The unit cannot be considered to have verified AC2 in its
current state.

The pre-existing helper `test/helpers/markdown.js` already ships a
`normalizeProse()` function built for exactly this situation — its own
comment says it "Collapses all whitespace runs (including newlines from the
rulebook's ~75-char line wrapping) to a single space... Lets prose regex
assertions match phrases regardless of where the source markdown happens to
wrap a line." The new test file imports only `parseSections` from that
helper and never uses `normalizeProse`, so none of the established handling
for wrapped rules text was applied here. Fix is either: normalize `body`
(or run `isGeneratorAttunedTo`'s regex against a normalized copy) before
matching, or replace the literal space in the regex with `\s+` (consistent
with how `Section\s+5\.2` is already written a few lines below it in the
same file).

## Summary

Card content is well-formed and does satisfy AC1–AC3 as written (the file,
races, costs, and Generator rules text all line up with the plan's
dual-typing resolution for Signal/Tangle). The blocker is that the test
suite this unit ships to verify AC2 (and the held-out AC4) does not actually
run green against that content, due to a whitespace-handling bug in the new
test file's Generator-matching regex.


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T05:20:50.070Z] **bolt:start** — unit=cardgame-fount-economy-generators start_sha=3a889feeec5c166f98b622fa55846886d389f160 branch=bolt/cardgame-fount-economy-generators worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-fount-economy-generators
- [2026-07-29T05:20:57.411Z] **baseline:done** — pre-edit test exit=1
- [2026-07-29T05:29:03.275Z] **plan:done** — plan.md written
- [2026-07-29T05:30:48.483Z] **tests:done** — RED verified on test/design-fount-economy-cards.test.js (exit=1)
- [2026-07-29T05:31:56.548Z] **build:c1** — tests still red (exit=1)
- [2026-07-29T05:32:33.516Z] **build:c2** — tests green, committed
- [2026-07-29T05:36:00.150Z] **review:c2** — NEEDS_WORK
- [2026-07-29T05:37:34.454Z] **build:c3** — tests green, committed
- [2026-07-29T05:37:34.520Z] **bolt:escalated** — no-change iteration (diff hash unchanged between cycles)


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
