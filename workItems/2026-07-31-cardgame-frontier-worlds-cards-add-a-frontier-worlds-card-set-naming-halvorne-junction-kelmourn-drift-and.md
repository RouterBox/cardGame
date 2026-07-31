# cardgame-frontier-worlds-cards: Add a Frontier Worlds card set naming Halvorne Junction, Kelmourn Drift, and Tallowfen — the only 3 named worlds in star-atlas.md with zero card representation

## Header

- unit: cardgame-frontier-worlds-cards
- title: Add a Frontier Worlds card set naming Halvorne Junction, Kelmourn Drift, and Tallowfen — the only 3 named worlds in star-atlas.md with zero card representation
- project: cardgame
- completed: 2026-07-31
- outcome: merged
- start_sha: aa639b81c551f70b2948e98867fb7f7e1246ff54
- end_sha: 6418aaa75df250f673365d8591a4e307757811be

## Intent

design/star-atlas.md's 'Frontier & Contested Worlds' section names Halvorne Junction (a wormhole-transit world valuable for its tangle of cheap wormholes, seized by Starweave Communion oath-sworn during the Cinderglass War and still contested with the Cindral Reach), Kelmourn Drift (a debris-field world where First Weave wreckage keeps resurfacing, reopening the same discovery-claim argument that started the Cinderglass War), and Tallowfen (a resource-poor world whose only value is a single chokepoint wormhole, held and re-held by whoever last had the fleet to spare) — and frames all 3 explicitly as Discovery-action targets (rules.md Section 8.3). No card in any of the 9 shipped card-set files has ever named any of them. Write design/cards/frontier-worlds-set.md with 5 cards, one per race (following the same 'one per race' structure as frontier-set.md, wormhole-restrictions-set.md, wormhole-closure-cards.md, and spatial-race-identity-set.md), distributing the 3 worlds across the 5 cards so every world is named by at least one card's Rules text and flavor text (at least one world will be named by two cards). Ground each card's mechanic in rules.md Section 8.3's existing vocabulary (Frontier Discovery, Contested Discovery, Neutral Planet) or another already-defined Section 8 mechanic (Blockade, Wormhole Length) the way frontier-set.md's own 5 cards already cite Section 8.x mechanics generically — but this time naming the specific world instead of leaving it abstract, consistent with each world's own lore detail already written in star-atlas.md (e.g. a card exercising Contested Discovery whose flavor text names Kelmourn Drift's resurfacing-wreckage claims; a card referencing Wormhole Length or cheap-wormhole Discovery whose flavor text names Halvorne Junction; a card referencing Blockade or a chokepoint Wormhole whose flavor text names Tallowfen). Add exactly one new bullet to design/DESIGN-READINESS.md's Section 3 card-set list citing 'frontier-worlds-set.md' by filename, matching the existing bullet format for every other set, and touch no other section or line of that file. Do not touch design/star-atlas.md, design/cards/frontier-set.md, or any other existing design/cards/*.md file — this unit only adds one new card-set file and one citation bullet. Regenerate site/ via tools/build-site.js. Art briefs for these 5 cards are out of scope for this unit, matching the established precedent (art-brief coverage for a new set ships as its own later unit).

## Acceptance Criteria

- AC1 [inferred]: design/cards/frontier-worlds-set.md exists with exactly 5 cards, one per race under design/races/, each following the Section 9.1 template field order (Name, Cost line, Type line, Rules text, flavor text)
- AC2 [inferred]: Across the 5 cards, the exact strings 'Halvorne Junction', 'Kelmourn Drift', and 'Tallowfen' each appear at least once
- AC3 [paraphrase] (held_out): Each card's Rules text names a Discovery-family or other Section 8 mechanic (Frontier Discovery, Contested Discovery, Neutral Planet, Blockade, or Wormhole Length) already defined in rules.md, not an invented mechanic
- AC4 [inferred]: design/DESIGN-READINESS.md's Section 3 contains exactly one new bullet citing 'frontier-worlds-set.md', and every other section of that file, design/star-atlas.md, and every other design/cards/*.md file are byte-for-byte unchanged
- AC5 [paraphrase]: site/design/cards/frontier-worlds-set.html exists and site/design/DESIGN-READINESS.html is regenerated via tools/build-site.js, and a new test file mechanically asserts all of the above

## Plan

GATE: none

# Plan — cardgame-frontier-worlds-cards

## Summary

Add a new 5-card set, `design/cards/frontier-worlds-set.md`, one card per
race, that names the three worlds star-atlas.md's "Frontier & Contested
Worlds" section describes (Halvorne Junction, Kelmourn Drift, Tallowfen) and
grounds each card in an already-defined `rules.md` Section 8 mechanic. Add
one citation bullet to `design/DESIGN-READINESS.md` Section 3. Regenerate
`site/` via `tools/build-site.js`. Add one new test file. Touch nothing else.

This is a small, single-bolt unit — one new card-set file, one new
DESIGN-READINESS bullet, a site rebuild, and one new test file, all
following patterns already used by `frontier-set.md` /
`wormhole-restrictions-set.md` / `wormhole-closure-cards.md` and their test
files. No split needed.

## Files touched

1. **CREATE** `design/cards/frontier-worlds-set.md` (builder)
2. **EDIT** `design/DESIGN-READINESS.md` — exactly one new bullet in Section
   3, no other line touched (builder)
3. **CREATE** `test/design-frontier-worlds-cards.test.js` (test-writer)
4. **REGENERATE** `site/` via `node tools/build-site.js` (builder, after 1
   and 2 are in place — see step 4 below)

Do NOT touch: `design/star-atlas.md`, `design/cards/frontier-set.md`, any
other `design/cards/*.md` file, any other section of
`design/DESIGN-READINESS.md`, or any pre-existing `test/*.js` file. (There
are none to edit here — this unit only adds a new test file, it does not
need to touch a pre-existing one.)

---

## Background the builder needs

### Race → Fount/Card-Type mapping (fixed, used by every prior set)

| Race | Card Type | Fount |
|---|---|---|
| Cindral Reach | Materials | Mass |
| Mireth Bloom | Biology | Bloom |
| Panoptic Concord | Intelligence | Signal |
| Starweave Communion | Magic | Tangle |
| Wrought Assembly | Technology | Circuit |

Source: `design/races/*.md` titles (`# The <Name>`), and every existing
card set (`design/cards/frontier-set.md`,
`design/cards/wormhole-restrictions-set.md`,
`design/cards/wormhole-closure-cards.md`) uses this exact mapping.

### Section 9.1 template (rules.md lines 722–738)

Every card, in this exact order:
1. `### <Name>` (H3 heading — this is what the shared parser
   `lib/parse-card-markdown.js` treats as one card record)
2. `Cost line: <N> <Fount>`
3. `Type line: <CardType>` (append ` — Permanent` if the card is a
   Permanent: Materials and Technology are always Permanent-capable,
   Biology is always Permanent, Magic and Intelligence are never
   Permanent)
4. `Rules text: <Fast|Slow>. <effect text, using terms rules.md has
   already defined>`
5. `Stats/counters line: Combat strength <N>. Enters with no counters.`
   — **only** if the Type line contains "Permanent" **and** the card is a
   Unit (Biology cards always are; Materials/Technology cards are only if
   the design calls for one — see the 5 cards below, none of which need a
   stats line except the Biology one)
6. Blank line, then italic flavor text: `*<flavor text>*`

Cards are grouped under `## The <Race Name>` H2 headings (one per race),
matching `frontier-set.md`'s structure exactly.

### Allowed Section 8 mechanics for this unit (per AC3, held-out)

Only cite these five, each already defined in `design/rules.md`:

| Term | Defined in |
|---|---|
| Frontier Discovery | Section 8.3 |
| Contested Discovery | Section 8.3 |
| Neutral Planet | Section 8.3 |
| Wormhole Length | Section 8.3 (the Wormhole's Length, chosen in Discovery step 3) |
| Blockade | Section 8.6 |

Do NOT invent a new mechanic name. Do NOT cite Restriction (8.4), Closure
(8.5), Assault, or Capture (8.6) — those are the vocabulary of the
*other* existing sets (`wormhole-restrictions-set.md`,
`wormhole-closure-cards.md`, `frontier-set.md`), not this one. Every card's
Rules text must contain the literal term it's grounded in, immediately
followed by a `Section 8.3` / `Section 8.6` citation, e.g.:
`(Section 8.3, which defines Contested Discovery)`.

### The 3 worlds (star-atlas.md lines 97–129, do not edit that file)

- **Halvorne Junction** — wormhole-transit world, tangle of cheap
  wormholes, seized by Starweave Communion oath-sworn during the
  Cinderglass War, still contested by Cindral Reach fleets.
- **Kelmourn Drift** — debris-field world, First Weave wreckage keeps
  resurfacing, reopens the same discovery-claim argument that started the
  Cinderglass War, no civilization holds it outright.
- **Tallowfen** — resource-poor world, single chokepoint wormhole, held
  and re-held by whoever last had the fleet to spare.

### World-to-card distribution

5 cards, 3 worlds. Halvorne Junction and Kelmourn Drift are each named by
**two** cards (satisfying "at least one world named by two cards"; naming
two worlds twice is not forbidden and lets each card's flavor track the
lore precisely — Halvorne Junction is explicitly described as contested
*between* Starweave Communion and Cindral Reach, and Kelmourn Drift's
"reopens the same discovery-claim argument" line naturally supports two
different reactions to it). Tallowfen is named by one card.

| Card # | Race | World | Mechanic |
|---|---|---|---|
| 1 | Cindral Reach | Halvorne Junction | Contested Discovery (8.3) |
| 2 | Starweave Communion | Halvorne Junction | Frontier Discovery + Wormhole Length (8.3) |
| 3 | Mireth Bloom | Kelmourn Drift | Contested Discovery + Neutral Planet (8.3) |
| 4 | Panoptic Concord | Kelmourn Drift | Neutral Planet (8.3) |
| 5 | Wrought Assembly | Tallowfen | Blockade (8.6) |

Every card's Rules text names its world by the exact string (satisfying
AC2 and the fuller intent that both Rules text and flavor text name it),
and every card's flavor text also names its world.

---

## Step 1 (builder) — create `design/cards/frontier-worlds-set.md`

Create the file with exactly this content:

```markdown
# Frontier Worlds Set — Named Ground for Section 8.3

## Summary

This file contains 5 named cards, one per race, each mechanically tied to
a specific named world from *design/star-atlas.md*'s "Frontier & Contested
Worlds" section: Halvorne Junction (the Cindral Reach, Materials; the
Starweave Communion, Magic), Kelmourn Drift (the Mireth Bloom, Biology; the
Panoptic Concord, Intelligence), and Tallowfen (the Wrought Assembly,
Technology). Where *design/cards/frontier-set.md* cites *design/rules.md*
Section 8's mechanics generically, every card here names the specific world
its mechanic targets, grounded only in Discovery-family terms already
defined by Section 8.3 (Frontier Discovery, Contested Discovery, Neutral
Planet, Wormhole Length) or Blockade, already defined by Section 8.6. Every
card follows the canonical template of *design/rules.md* Section 9.1, and
each is paid for from the one Fount matching its race, per the mapping
*design/cards/frontier-set.md* already uses.

## The Cindral Reach

### Halvorne Reclamation Fleet

Cost line: 2 Mass
Type line: Materials — Permanent
Rules text: Slow. Spent: if you have taken a Contested Discovery action
this turn (Section 8.3, which defines Contested Discovery) whose
destination was Halvorne Junction, place a Fortification counter on any
Generator you control on that Planet.

*Halvorne Junction has never stopped being worth the fight — the Cindral
Reach keeps sending fleets back through the tangle of cheap wormholes the
Communion took, testing a hold that was never quite finished.*

## The Starweave Communion

### Tanglekeeper's Vigil

Cost line: 2 Tangle
Type line: Magic
Rules text: Slow. When this resolves, if you have taken a Frontier
Discovery action this turn (Section 8.3, which defines Frontier Discovery
and Wormhole Length) whose Wormhole Length was 3 or less and whose
destination was Halvorne Junction, look at the top card of your Archive;
you may put it on the bottom of your Archive instead of leaving it on top.

*The Starweave Communion doesn't garrison Halvorne Junction so much as
haunt it — every short, cheap wormhole that meets there still answers to
an oath sworn during the Cinderglass War.*

## The Mireth Bloom

### Kelmourn Wreck-Bloom

Cost line: 2 Bloom
Type line: Biology — Permanent
Rules text: Slow. Spent, usable at instant speed (any time its controller
holds priority): if you have taken a Contested Discovery action this turn
(Section 8.3, which defines Contested Discovery and Neutral Planet) whose
destination was Kelmourn Drift, place a Growth counter on this Unit.
Stats/counters line: Combat strength 1. Enters with no counters.

*Kelmourn Drift keeps surfacing First Weave wreckage no map agrees on, and
the Mireth Bloom roots itself in whatever claim is freshest — growth is
the only argument it ever bothers to win.*

## The Panoptic Concord

### Kelmourn Claim Ledger

Cost line: 1 Signal
Type line: Intelligence
Rules text: Fast. When this resolves, if Kelmourn Drift is on the
battlefield graph as a Neutral Planet (Section 8.3, which defines Neutral
Planet), look at the top card of your Archive; you may put it on the
bottom of your Archive instead of leaving it on top.

*Every crew that stakes a claim on Kelmourn Drift reopens the same
argument the Cinderglass War never finished — the Panoptic Concord just
keeps a longer memory of who claimed what, and when.*

## The Wrought Assembly

### Tallowfen Chokepoint Works

Cost line: 2 Circuit
Type line: Technology — Permanent
Rules text: Slow. This permanent is a Generator attuned to the Circuit:
during the Generation Phase, it produces 1 Circuit Point, added to its
controller's Circuit resource pool. Spent: if you have taken an Assault
action this turn that resulted in a Blockade (Section 8.6, which defines
Blockade) of Tallowfen, create an exact token copy of this permanent, put
directly onto the Field under your control.

*Tallowfen has nothing worth keeping except the one wormhole running
through it, and the Wrought Assembly has learned the same lesson every
other fleet learns there: hold the chokepoint only as long as you can
spare the ships.*
```

Notes for the builder:
- Copy this block verbatim — line wrapping in the fields doesn't matter to
  the parser (it joins wrapped lines with spaces), but keep it close to
  the ~75-char wrap width the other files use for readability.
- The "Tallowfen Chokepoint Works" card mentions "Assault" in its Rules
  text (`...if you have taken an Assault action this turn that resulted in
  a Blockade...`) — this is required plumbing, since Blockade only ever
  happens as the result of an Assault action (Section 8.6), exactly like
  `frontier-set.md`'s own "Replication Beachhead" card phrases its Capture
  trigger the same way. This does not count as "citing Assault" for AC3
  purposes — the card's *grounding* mechanic is Blockade, which it also
  cites by section number.
- Do not add a `Stats/counters line` to any card except "Kelmourn
  Wreck-Bloom" — the other four are not Units.

---

## Step 2 (builder) — edit `design/DESIGN-READINESS.md` Section 3

Open `design/DESIGN-READINESS.md`. Find this existing bullet (currently
the last card-set bullet before the "Total:" line, around line 103–105):

```
- **Fount Economy Set** — `design/cards/fount-economy-set.md` — 6 cards.
  Closes the Bloom/Signal/Tangle Generator gap `design/playtest-full-game.md`
  surfaced.
```

Immediately after it (and before the blank line that precedes `**Total:
59 named cards across 10 files.**`), insert exactly this new bullet:

```
- **Frontier Worlds Set** — `design/cards/frontier-worlds-set.md` — 5
  cards. One per race, each naming a specific world from
  `star-atlas.md`'s "Frontier & Contested Worlds" section (Halvorne
  Junction, Kelmourn Drift, Tallowfen) and grounding its mechanic in a
  Section 8.3/8.6 term already defined by `rules.md`.
```

**Do not touch the "Total: 59 named cards across 10 files." line, and do
not touch any other line, bullet, or section in this file.** That total is
now stale (it will really be 64 cards across 11 files once this unit
lands) but the unit's own instructions are explicit: only one new bullet,
nothing else in this file changes. This is intentional — no test in the
repo asserts that hand-typed total matches the live count (confirmed: only
`test/design-readiness.test.js`'s AC3/AC6 checks every real card-set file
is *cited by filename* somewhere in the doc, which the new bullet already
satisfies; it does not check the "Total:" sentence).

---

## Step 3 (test-writer) — create `test/design-frontier-worlds-cards.test.js`

This is a **new** file — not an edit to any pre-existing `test/*.js` file
— so the test-writer stage owns it cleanly; there is no
touch-pre-existing-test-file concern on this unit.

Model it closely on `test/design-frontier-cards.test.js` and
`test/design-wormhole-restrictions-cards.test.js` (both already in the
repo — read them first). Required checks:

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');
const { registerCardTemplateChecks } = require('./helpers/card-template');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'frontier-worlds-set.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');
const DESIGN_READINESS_PATH = path.join(__dirname, '..', 'design', 'DESIGN-READINESS.md');
const BUILD_SCRIPT = path.join(__dirname, '..', 'tools', 'build-site.js');
const SITE_DIR = path.join(__dirname, '..', 'site');
const { execFileSync } = require('node:child_process');

const RACE_TO_FOUNT = {
  'Cindral Reach': 'Mass',
  'Mireth Bloom': 'Bloom',
  'Panoptic Concord': 'Signal',
  'Starweave Communion': 'Tangle',
  'Wrought Assembly': 'Circuit',
};

const WORLDS = ['Halvorne Junction', 'Kelmourn Drift', 'Tallowfen'];

// Section 8.3/8.6 terms this unit is allowed to ground cards in, and the
// section that defines each (see rules.md).
const MECHANIC_SECTIONS = {
  'Frontier Discovery': '8.3',
  'Contested Discovery': '8.3',
  'Neutral Planet': '8.3',
  'Wormhole Length': '8.3',
  'Blockade': '8.6',
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readFile(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function listCards() {
  const content = readFile(CARDS_PATH);
  if (content === null) return [];
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function listRaces() {
  if (!fs.existsSync(RACES_DIR)) return [];
  return fs
    .readdirSync(RACES_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const content = fs.readFileSync(path.join(RACES_DIR, file), 'utf8');
      const titleMatch = content.match(/^#\s+The\s+(.+)$/m);
      return { file, raceName: titleMatch ? titleMatch[1].trim() : null };
    });
}

const cards = listCards();
const cardsToCheck = cards.length
  ? cards
  : [{ title: '<no cards found — design/cards/frontier-worlds-set.md missing or empty>', body: '' }];

const races = listRaces();
const racesToCheck = races.length
  ? races
  : [{ file: '<no race files found under design/races/>', raceName: null }];

// --- AC1: file exists, exactly 5 cards, one per race, Section 9.1 order ---

test('AC1: design/cards/frontier-worlds-set.md exists', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
});

test('AC1: frontier-worlds-set.md contains exactly 5 distinct named cards', () => {
  const names = cards.map((c) => c.title);
  assert.strictEqual(names.length, 5, `expected exactly 5 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(new Set(names).size, names.length, 'expected all card names to be distinct');
});

for (const race of racesToCheck) {
  test(`AC1: exactly one Frontier Worlds card is tied to the race in ${race.file}`, () => {
    assert.ok(race.raceName, `expected a race title in ${race.file}`);
    const raceNameRe = new RegExp(escapeRegExp(race.raceName));
    const matches = cards.filter((c) => raceNameRe.test(c.body));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one Frontier Worlds card naming "${race.raceName}", found ${matches.length}`
    );
  });
}

for (const card of cardsToCheck) {
  registerCardTemplateChecks(card.title, card.body);
}

// --- AC2: each world named at least once across the 5 cards; at least one
// world named by two cards ---

test('AC2: Halvorne Junction, Kelmourn Drift, and Tallowfen are each named at least once', () => {
  const allText = cards.map((c) => c.body).join('\n');
  for (const world of WORLDS) {
    assert.ok(allText.includes(world), `expected "${world}" to appear somewhere across the 5 cards`);
  }
});

test('AC2: at least one world is named by two or more cards', () => {
  const counts = WORLDS.map((world) => cards.filter((c) => c.body.includes(world)).length);
  assert.ok(counts.some((n) => n >= 2), `expected at least one world named by 2+ cards, got counts ${JSON.stringify(counts)}`);
});

for (const world of WORLDS) {
  test(`AC2: "${world}" is named in both the Rules text and the flavor text of at least one card`, () => {
    const match = cards.find((c) => {
      const rulesMatch = c.body.match(/Rules text:[\s\S]*?(?=\n[A-Z][a-z]+ ?[a-z]*:|\n\n|\n\*|$)/);
      const rulesText = rulesMatch ? rulesMatch[0] : '';
      const flavorMatch = c.body.match(/\*[^*]+\*/);
      const flavorText = flavorMatch ? flavorMatch[0] : '';
      return rulesText.includes(world) && flavorText.includes(world);
    });
    assert.ok(match, `expected at least one card to name "${world}" in both its Rules text and its flavor text`);
  });
}

// --- AC3 (held_out, paraphrase): each card's Rules text names one of the
// allowed Section 8.3/8.6 terms and cites the correct section number, no
// invented mechanic ---

for (const card of cardsToCheck) {
  test(`AC3: "${card.title}" names an allowed Section 8.3/8.6 mechanic and cites its section`, () => {
    const body = card.body;
    const termsPresent = Object.keys(MECHANIC_SECTIONS).filter((t) => body.includes(t));
    assert.ok(
      termsPresent.length > 0,
      `expected "${card.title}" to name one of [${Object.keys(MECHANIC_SECTIONS).join(', ')}]`
    );
    const citesCorrectSection = termsPresent.some((t) =>
      new RegExp(`Section\\s+${MECHANIC_SECTIONS[t].replace('.', '\\.')}\\b`).test(body)
    );
    assert.ok(
      citesCorrectSection,
      `expected "${card.title}" to cite the correct section for one of [${termsPresent.join(', ')}]`
    );
  });
}

// --- AC4: DESIGN-READINESS.md Section 3 has exactly one new bullet citing
// the file; every other design/cards/*.md and star-atlas.md are untouched
// (verified structurally: the file exists and is cited; this test does not
// and cannot verify "byte-for-byte unchanged" against a prior git state —
// that is a code-review concern for the builder/gate, not a runtime
// assertion) ---

test('AC4: DESIGN-READINESS.md Section 3 cites frontier-worlds-set.md', () => {
  const content = fs.readFileSync(DESIGN_READINESS_PATH, 'utf8');
  assert.ok(content.includes('frontier-worlds-set.md'), 'expected Section 3 to cite frontier-worlds-set.md');
});

// --- AC5: site/ regenerates correctly ---

test('AC5: site/design/cards/frontier-worlds-set.html exists and DESIGN-READINESS.html is regenerated after build', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
  const cardPage = path.join(SITE_DIR, 'design', 'cards', 'frontier-worlds-set.html');
  const readinessPage = path.join(SITE_DIR, 'design', 'DESIGN-READINESS.html');
  assert.ok(fs.existsSync(cardPage), `expected ${cardPage} to exist after build`);
  assert.ok(fs.existsSync(readinessPage), `expected ${readinessPage} to exist after build`);
  const readinessHtml = fs.readFileSync(readinessPage, 'utf8');
  assert.ok(readinessHtml.includes('frontier-worlds-set.md'), 'expected the built DESIGN-READINESS.html to cite frontier-worlds-set.md');
});
```

Notes for the test-writer:
- `registerCardTemplateChecks` is the exact helper `design-frontier-cards.test.js`
  and `design-wormhole-restrictions-cards.test.js` already import from
  `test/helpers/card-template.js` — reuse it, don't reimplement it.
- The Rules-text/flavor-text extraction regex above is a best-effort split;
  if it proves brittle against the actual card bodies once written, a
  simpler and equally valid version is to just check
  `c.body.split('Rules text:')[1].split(/\n\*/)[0].includes(world)` for the
  Rules-text half and `(c.body.match(/\*[^*]+\*/) || [''])[0].includes(world)`
  for the flavor half — pick whichever passes cleanly against the real file
  from Step 1.
- Do not assert anything about the stale "Total: 59 named cards across 10
  files" sentence — it is deliberately left untouched (see Step 2).

---

## Step 4 (builder) — regenerate `site/`

After Steps 1–2 are on disk, run:

```
node tools/build-site.js
```

from the repo root. This is deterministic and safe to run multiple times.
Expected output: no console output on success (the script writes files and
exits 0); if it prints anything to stderr, treat that as a build failure
and fix the underlying markdown before proceeding. Confirm afterward that
these two files exist and were updated:

- `site/design/cards/frontier-worlds-set.html`
- `site/design/DESIGN-READINESS.html` (should now contain
  "frontier-worlds-set.md")

`site/cards-index.html` will also pick up the 5 new rows automatically —
no manual edit needed there.

---

## Step 5 — run the full test suite

```
node --test
```

Expected: all tests pass, including (at minimum):
- `test/design-frontier-worlds-cards.test.js` (new)
- `test/design-readiness.test.js` (existing — AC3/AC6 now also sees
  `frontier-worlds-set.md` cited)
- `test/build-site-cards-index.test.js` (existing — card count grows by 5,
  it re-derives the expected count live via `loadAllCards()` so this
  cannot break)
- `test/card-catalog-collision.test.js` (existing — the 5 new card names
  were checked against the existing catalog during planning; no
  collisions found)

No pre-existing test file requires an edit for this unit.

---

## Risk assessment (FIRE matrix)

- **Reversibility:** high. Pure content addition (one new markdown file,
  one new bullet, one new test file) plus a deterministic, idempotent
  site rebuild. Trivially revertable with `git revert`.
- **Security impact:** none. No code paths, no user input, no network
  calls, no secrets.
- **User data:** none touched.
- **Schema changes:** none. No database, no API contract, no card-parser
  changes.

This is a low-risk, additive content unit. `GATE: none`.

---

## Held-out AC discipline note

AC3 (held_out) is a paraphrase of a real hidden test, presumably checking
that each card's Rules text names one of Section 8's already-defined
mechanics rather than inventing one — this is redundant with the visible
intent text ("Ground each card's mechanic in rules.md Section 8.3's
existing vocabulary... or another already-defined Section 8 mechanic"), so
it carries no novel requirement beyond specifics (which mechanics, which
section numbers) already spelled out in the intent's own parenthetical
examples. No spec-bug flag needed here.


## Findings

# Blind Review — cardgame-frontier-worlds-cards (cycle 1)

## Scope of diff reviewed
`design/DESIGN-READINESS.md` (+5 lines, one bullet), new
`design/cards/frontier-worlds-set.md` (98 lines), new
`test/design-frontier-worlds-cards.test.js` (177 lines), 5 new
`renders/cards/*.svg`, and mechanical `site/**` regeneration output
(nav siblings, cards-index, index, DESIGN-READINESS.html,
frontier-worlds-set.html). Confirmed via
`git diff d6d50cd~1 6dea635 --stat` this is the full and only diff for
this unit — matches the diff shown in the prompt exactly.

## AC-by-AC verification

**AC1** (5 cards, one per race, Section 9.1 field order) — PASS.
Read `design/cards/frontier-worlds-set.md` directly: 5 distinct `###`
cards, one under each of the 5 race `##` headings (Cindral Reach,
Starweave Communion, Mireth Bloom, Panoptic Concord, Wrought Assembly),
each with `Cost line:` → `Type line:` → `Rules text:` → (optional
`Stats/counters line:`) → blank line → italic flavor, matching
`design/rules.md` Section 9.1 and the shared `lib/parse-card-markdown.js`
convention. Only the Biology card (Kelmourn Wreck-Bloom) carries a Stats
line, correctly gated by the Type line containing "Permanent" (verified
against `test/helpers/card-template.js`'s own rule). Cross-checked
Fount→race mapping against `design/cards/frontier-set.md`'s established
convention: Mass/Cindral Reach, Tangle/Starweave Communion,
Bloom/Mireth Bloom, Signal/Panoptic Concord, Circuit/Wrought Assembly —
all correct.

**AC2** (Halvorne Junction, Kelmourn Drift, Tallowfen each named ≥1x) —
PASS. Grepped the file directly: each of the 3 world names appears in
card body text (not just the Summary preamble): Halvorne Junction in
cards 1 and 2 (Rules text + flavor in both), Kelmourn Drift in cards 3
and 4 (Rules text + flavor in both), Tallowfen in card 5 (Rules text +
flavor). Halvorne Junction and Kelmourn Drift are each named by two
cards, satisfying "at least one world named by two cards." Every world
is named in both Rules text and flavor text of at least one card, per
the fuller intent.

**AC4** (exactly one new DESIGN-READINESS.md Section 3 bullet; all else
byte-for-byte unchanged) — PASS. `git diff d6d50cd~1 6dea635 --stat --
"design/cards/*.md" "design/DESIGN-READINESS.md"` shows only
`design/DESIGN-READINESS.md` (+5/-0) and the new
`design/cards/frontier-worlds-set.md`. Directly diffed
`design/star-atlas.md` and `design/cards/frontier-set.md` against their
pre-unit blobs (`d6d50cd~1`) — zero output, confirming byte-for-byte
unchanged. The new bullet's format (`- **Name** — \`path\` — N cards.`
+ wrapped description) matches the existing Fount Economy Set bullet
immediately above it. Note: the file's own "Total: 59 named cards
across 10 files" summary sentence is now stale (actual is 64 cards / 11
card-set files) — but that sentence was already present, unchanged,
before this unit's commit (confirmed via `git show d6d50cd~1` on the
same file), so this diff did not introduce or worsen it, and both
plan.md and the visible AC4 explicitly require every other line of the
file to stay untouched. PRE-EXISTING, not gating.

**AC5** (site regenerated; new test file added) — PASS by inspection.
`site/design/cards/frontier-worlds-set.html` exists and is a faithful
HTML rendering of the new markdown. `site/design/DESIGN-READINESS.html`
carries the new bullet. `site/cards-index.html` and `site/index.html`
gained the expected new rows/links, and the unrelated nav-sibling-link
diffs across every other `site/design/cards/*.html` page are the
expected mechanical byproduct of `build-site.js` regenerating the
shared cross-page sibling nav (adding the new set to everyone's sibling
list) — consistent with how every prior card-set addition in this
repo's history has touched those same nav lines. `test/design-frontier-worlds-cards.test.js`
was added and asserts AC1/AC2/AC4/AC5 (plus a held-out AC3 on Section
8.3/8.6 mechanic grounding) structurally and correctly against the
shipped files; I could not execute `node --test` in this sandboxed
review environment (blocked as a mutating/build-invoking action), so
this is verified by static reading of the test file and its target
files rather than a green run, but the assertions and the file content
they check against line up exactly.

Additionally verified: the 5 new `renders/cards/*.svg` files match
precedent — every card in every prior card set (e.g. `frontier-set.md`)
has a corresponding `renders/cards/<slug>.svg`, so this is expected
pipeline output, not scope creep. Each new SVG's rendered rules/flavor
text matches the corresponding card in `frontier-worlds-set.md` exactly.

## Findings

None. No INTRODUCED defects found. The diff is a clean, minimal,
single-bolt addition matching plan.md and every visible AC.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T23:22:17.610Z] **bolt:start** — unit=cardgame-frontier-worlds-cards start_sha=310093b21d6c6f27f1c9acf8082ce404c992ce1a branch=bolt/cardgame-frontier-worlds-cards worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-frontier-worlds-cards
- [2026-07-30T23:22:30.825Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T23:34:29.431Z] **bolt:escalated** — Planner produced no plan.md
- [2026-07-30T23:34:29.733Z] **archive:done** — outcome=escalated file=C:\github\cardGame\workItems\2026-07-30-cardgame-frontier-worlds-cards-add-a-frontier-worlds-card-set-naming-halvorne-junction-kelmourn-drift-and.md
- [2026-07-30T23:34:30.061Z] **worktree:removed** — C:\github\.agentbox-worktrees\cardGame\cardgame-frontier-worlds-cards (branch bolt/cardgame-frontier-worlds-cards left for recovery)
- [2026-07-30T23:53:29.316Z] **resolution:retry** — Try again as-is
- [2026-07-30T23:53:30.972Z] **bolt:start** — unit=cardgame-frontier-worlds-cards start_sha=aa639b81c551f70b2948e98867fb7f7e1246ff54 branch=bolt/cardgame-frontier-worlds-cards worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-frontier-worlds-cards
- [2026-07-30T23:53:41.916Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T23:59:04.180Z] **plan:done** — plan.md written
- [2026-07-31T00:00:33.360Z] **tests:done** — RED verified on test/design-frontier-worlds-cards.test.js (exit=1)
- [2026-07-31T00:05:11.384Z] **build:c1** — tests green, committed
- [2026-07-31T00:09:06.328Z] **review:c1** — APPROVE
- [2026-07-31T00:13:08.159Z] **review:devils-advocate** — APPROVE
- [2026-07-31T00:13:19.202Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-31T00:13:19.649Z] **merge:done** — auto-merged bolt/cardgame-frontier-worlds-cards into master (worktree)


## Receipt

```json
{
  "start_sha": "aa639b81c551f70b2948e98867fb7f7e1246ff54",
  "end_sha": "6dea6356469265096c7d4be27e9deee22c8a83f5",
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
      "held_out": true,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC5",
      "held_out": false,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-31T00:13:19.200Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-frontier-worlds-cards\\plan.md`.\n\nSummary of the plan:\n- **New file** `design/cards/frontier-worlds-set.md` — 5 complete cards (one per race), fully drafted with exact text, distributing Halvorne Junction and Kelmourn Drift across two cards each and Tallowfen across one, each grounded in an allowed Section 8.3/8.6 term (Frontier Discovery, Contested Discovery, Neutral Planet, Wormhole Length, Blockade) with correct section citations.\n- **One bullet added** to `design/DESIGN-READINESS.md` Section 3 (exact text given), explicitly leaving the stale \"Total: 59 named cards\" line and everything else untouched, since no test checks that count.\n- **New test file** `test/design-frontier-worlds-cards.test.js`, modeled on the existing `frontier-set`/`wormhole-restrictions-set` tests, fully drafted — assigned to the test-writer stage since it's a brand-new file, no pre-existing test edits needed.\n- **Site rebuild** via `node tools/build-site.js`, with expected output files listed.\n\nRisk assessment: `GATE: none` — pure additive content, no schema/security/data impact.",
    "test_writer": "I can't get command execution approved in this non-interactive session, so I can't directly run the test suite to confirm the RED state. However, this is structurally guaranteed: `design/cards/frontier-worlds-set.md` does not exist (confirmed above), so `CARDS_PATH` won't exist, and the very first test (`AC1: design/cards/frontier-worlds-set.md exists`) will fail on `fs.existsSync`. All the other tests that depend on `cards` will also fail or use the placeholder title.\n\nSummary of what was done:\n- Created `test/design-frontier-worlds-cards.test.js` (test-only, nothing under `design/` or `src/` touched), covering AC1 (file exists, exactly 5 cards, one per race, template order via `registerCardTemplateChecks`), AC2 (all 3 worlds named, at least one named twice, Rules+flavor text co-naming), AC3 (allowed Section 8.3/8.6 mechanic citation), AC4 (DESIGN-READINESS.md cites the new file), and AC5 (site rebuild produces the new HTML pages).\n- Confirmed `design/cards/frontier-worlds-set.md` does not exist yet, so the tests are guaranteed to fail (RED) until the builder stage implements the feature.",
    "builder_c1": "No changes under `test/`. The full suite is green: 1220/1220 pass.\n\nSummary: created `design/cards/frontier-worlds-set.md` (5 cards, one per race, naming Halvorne Junction, Kelmourn Drift, and Tallowfen per the plan), added the one required bullet to `design/DESIGN-READINESS.md` Section 3, regenerated `site/` via `tools/build-site.js`, and committed. One line-wrap in the Cindral Reach card's flavor text had split the race name across two lines, breaking the parser's per-race-card check — rewrapped it without changing content. Committed the changes (matching the pattern of prior units' builder stages) since one pre-existing test (`test/card-template-helper.test.js`) asserts a clean `git status` under `design/`.",
    "reviewer_c1": "All 4 visible ACs verified against the actual files: card structure/template (AC1), all 3 world names present with the required dual-mention (AC2), DESIGN-READINESS.md diff is exactly one bullet with everything else byte-for-byte unchanged including star-atlas.md and frontier-set.md (AC4), and site regeneration + new test file are consistent and correct (AC5). No introduced defects.\n\nAPPROVE",
    "devils_advocate": "Devil's Advocate attack attempted and failed. Summary of what I tried:\n\n**Strongest candidate attack (refuted):** Card \"Tanglekeeper's Vigil\" ties its ability to a *Frontier Discovery* (rules.md §8.3: destination must be \"an Unexplored Planet not yet on the battlefield graph\") whose destination is Halvorne Junction — a world star-atlas.md describes as already seized/contested with existing wormholes. That looked like a self-contradiction (a world that's already \"contested\" can't be the target of a discovery-of-the-unexplored). It fails on inspection: rules.md §8.8 (Map Setup) explicitly states every Planet besides the two Homeworlds \"begins the game Unexplored... off the battlefield graph entirely\" and \"joins the graph only later, one at a time, the moment some Discovery names it as a destination\" — regardless of fictional backstory. So within any single game, the first Discovery of Halvorne Junction is legitimately a Frontier Discovery, and a later one (by a different player, after it's already on the graph) is legitimately a Contested Discovery — exactly what Card 1 (Halvorne Reclamation Fleet) and Card 2 (Tanglekeeper's Vigil) each model. Not a contradiction.\n\nAlso checked and found clean:\n- Field order (Name → Cost line → Type line → Rules text → Stats/counters) matches §9.1 exactly.\n- Cost/Fount/race alignment matches the established race→Fount mapping.\n- All five mechanic citations (Contested Discovery, Frontier Discovery, Neutral Planet, Wormhole Length, Blockade) correctly cite §8.3/§8.6 and match those sections' actual definitions.\n- \"Spent,\" \"instant speed\" phrasing, and the Fortification-counter/Generator idiom are copied verbatim from existing canonical precedent (rules.md §9.3 example, frontier-set.md, fount-economy-set.md) — not invented.\n- DESIGN-READINESS.md diff is exactly one bullet in the right format/location; the stale \"Total: 59... across 10 files\" line is untouched, which is what AC4 explicitly requires (not a bug — it's compliance with an int"
  }
}
```

## Comments

(no comments.md)
