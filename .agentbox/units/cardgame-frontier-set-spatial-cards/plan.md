GATE: none

# Plan — cardgame-frontier-set-spatial-cards

## Summary

Add exactly two new files. No existing file is modified.

1. `design/cards/frontier-set.md` — 5 new cards, one per race, each
   mechanically tied to a Section 8 (Spatial Battlefield) term.
2. `test/design-frontier-cards.test.js` — new test file (per held-out AC4)
   that checks the count, per-race uniqueness, template order, and
   spatial-term-citation requirements against `frontier-set.md`.

Nothing under `design/rules.md`, `design/cards/alpha-set.md`, or
`design/cards/character-signatures.md` (which does not currently exist in
this repo — do not create it either) is touched. No existing test file is
modified.

This is a pure content-addition task: two new markdown/JS files, no runtime
logic changes, fully reversible via git, no security/user-data/schema
impact. Hence `GATE: none`.

## Why this shape (context gathered from the repo)

- `design/rules.md` Section 9.1 (lines 595-611) fixes the canonical card
  template order: Name, Cost line, Type line, Rules text, then — Permanents
  only, optional — Stats/counters line.
- `design/rules.md` Section 8 subsections define the six spatial terms this
  unit must reference:
  - **Discovery** — defined in **Section 8.3**
  - **Restriction** — defined in **Section 8.4**
  - **Closure** — defined in **Section 8.5**
  - **Assault** — defined in **Section 8.6**
  - **Blockade** — defined in **Section 8.6**
  - **Capture** — defined in **Section 8.6**
- `design/cards/alpha-set.md` is the existing example of the card-file
  convention this new file must follow: `###` heading = card name, then
  plain-text lines `Cost line: ...` / `Type line: ...` / `Rules text: ...` /
  optional `Stats/counters line: ...`, then a blank line and an italic
  (`*...*`) flavor-text paragraph that (in several existing cards) names the
  race the card belongs to by its exact race-file title text (e.g. "The
  Cindral Reach, Materials as doctrine: ...").
- `design/races/*.md` each start with a heading `# The <Race Name>` (e.g.
  `# The Cindral Reach`). The five files are: `cindral-reach.md`,
  `mireth-bloom.md`, `panoptic-concord.md`, `starweave-communion.md`,
  `wrought-assembly.md` — race names `Cindral Reach`, `Mireth Bloom`,
  `Panoptic Concord`, `Starweave Communion`, `Wrought Assembly`.
- `test/helpers/markdown.js` exports `parseSections(content)`, which splits
  a markdown file into heading sections (`{ level, title, lines }`). Every
  existing card/test file uses `level === 3` (`###`) sections as "one card
  = one section", and matches a card to a race by testing whether the
  race's exact name string appears anywhere in the card's section body
  (`test/design-cards.test.js` lines 34-50 and 139-152 do exactly this for
  `alpha-set.md` — this plan's new test file mirrors that pattern for
  `frontier-set.md`).
- I confirmed (by grep) that none of the other test files that read
  `design/cards/*.md` — `test/design-art-briefs.test.js`,
  `test/design-card-anatomy.test.js`, `test/render-card.test.js`,
  `test/sync-cards-to-jaina.test.js` — glob the `design/cards/` directory;
  they all hardcode the path to `alpha-set.md` specifically. Adding
  `frontier-set.md` alongside it will not be picked up by any of those
  tests and cannot break them. `test/composite-card-art.test.js` doesn't
  reference `design/cards/` at all. So this unit is safe to add in
  isolation.

## Step 1 — Create `design/cards/frontier-set.md`

Create the file at the exact path
`design/cards/frontier-set.md` with **exactly** this content:

```markdown
# Frontier Set — Cards of the Battlefield Graph

## Summary

This file contains 5 named cards, one per race, each mechanically tied to
the battlefield graph defined in *design/rules.md* Section 8: the Cindral
Reach (Materials, citing Blockade, Section 8.6), the Mireth Bloom (Biology,
citing Discovery, Section 8.3), the Panoptic Concord (Intelligence, citing
Restriction, Section 8.4), the Starweave Communion (Magic, citing Closure,
Section 8.5), and the Wrought Assembly (Technology, citing Assault and
Capture, Section 8.6). Every card follows the canonical template of
*design/rules.md* Section 9.1.

## The Cindral Reach

### Bastion Reclamation Crew

Cost line: 2 Mass
Type line: Materials — Permanent
Rules text: Slow. Spent: place a Fortification counter on any Generator you
control on a Planet currently under Blockade (Section 8.6, which defines
Blockade).

*The Cindral Reach, Materials as doctrine: even a Planet under Blockade
still gets reinforced, not abandoned.*

## The Mireth Bloom

### Frontier Spore Cluster

Cost line: 2 Bloom
Type line: Biology — Permanent
Rules text: Slow. Spent, usable at instant speed (any time its controller
holds priority): if you have taken a Discovery action this turn (Section
8.3, which defines Discovery), place a Growth counter on this Unit.
Stats/counters line: Combat strength 1. Enters with no counters.

*The Mireth Bloom grows fastest wherever a Discovery just cracked open
unclaimed space.*

## The Panoptic Concord

### Wormhole Ledger

Cost line: 1 Signal
Type line: Intelligence
Rules text: Fast. When this resolves, look at the Restriction (Section 8.4,
which defines Restriction) carried by any one Wormhole; then look at the
top card of your own Archive and choose to leave it on top or move it to
the bottom.

*The Panoptic Concord reads every Restriction on the battlefield graph
before anyone else notices it was written.*

## The Starweave Communion

### Rite of Unmaking

Cost line: 2 Tangle
Type line: Magic
Rules text: Slow. When this resolves, choose a Wormhole with an endpoint at
a Planet you control: it undergoes Closure (Section 8.5, which defines
Closure) and is removed from the battlefield graph.

*The Starweave Communion calls this a mercy: some paths through the Tangle
were never meant to stay open, and Closure just makes that true again.*

## The Wrought Assembly

### Replication Beachhead

Cost line: 2 Circuit
Type line: Technology — Permanent
Rules text: Slow. This permanent is a Generator attuned to the Circuit:
during the Generation Phase, it produces 1 Circuit Point, added to its
controller's Circuit resource pool. Spent: if you have taken an Assault
action this turn that resulted in a Capture (Section 8.6, which defines
Assault and Capture), create an exact token copy of this permanent, put
directly onto the Field under your control.

*The Wrought Assembly, Technology as inevitability: the instant a Capture
lands, the design that took the Planet is already copying itself onto it.*
```

Notes for whoever types this in:

- Copy the fenced block above verbatim as the file's full contents
  (everything between the ` ```markdown ` and closing ` ``` `, exclusive of
  the fence lines themselves).
- Preserve every line break exactly as shown — in particular, `Rules text:`
  bodies that wrap onto a second line (e.g. "Cindral Reach", "Mireth
  Bloom", "Wrought Assembly" cards) must NOT have a blank line inserted
  mid-field; `test/helpers/markdown.js`'s `parseSections` only cares about
  `#`-heading boundaries, but the field parser in `lib/parse-card-markdown.js`
  (used elsewhere) and this plan's own new test both locate fields by
  `indexOf('Cost line:')` / `indexOf('Type line:')` / etc. on the whole
  section body, so wrapping is safe either way — just don't insert a `###`
  or blank-then-dash line that could be mistaken for a new heading.
- Each card is under its own `## The <Race Name>` heading purely for
  human readability; the test file in Step 2 only looks at `###` (level-3)
  sections, so the `##` grouping headings are not load-bearing for any
  test, but keep them anyway for consistency with the rest of the design
  doc set and because the Summary above references them.
- Do not add a 6th card, do not rename any of the 5 card names, and do not
  drop any of the two race-name flavor-text mentions — the test in Step 2
  requires exactly one card to name each race's exact race-file title
  string ("Cindral Reach", "Mireth Bloom", "Panoptic Concord", "Starweave
  Communion", "Wrought Assembly"), and those strings currently only appear
  in each card's italic flavor line.

## Step 2 — Create `test/design-frontier-cards.test.js`

Create the file at the exact path `test/design-frontier-cards.test.js`
with **exactly** this content:

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'frontier-set.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');

// Term -> the Section 8 subsection that defines it, per design/rules.md.
const SPATIAL_TERM_SECTIONS = {
  Discovery: '8.3',
  Restriction: '8.4',
  Closure: '8.5',
  Assault: '8.6',
  Blockade: '8.6',
  Capture: '8.6',
};
const SPATIAL_TERMS = Object.keys(SPATIAL_TERM_SECTIONS);

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readCardsFile() {
  if (!fs.existsSync(CARDS_PATH)) return null;
  return fs.readFileSync(CARDS_PATH, 'utf8');
}

// Each `###` heading is one card; its body is the raw lines directly under
// it, same convention as design/cards/alpha-set.md and test/design-cards.test.js.
function listCards() {
  const content = readCardsFile();
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
  : [{ title: '<no cards found — design/cards/frontier-set.md missing or empty>', body: '' }];

const races = listRaces();
const racesToCheck = races.length
  ? races
  : [{ file: '<no race files found under design/races/>', raceName: null }];

// ---------------------------------------------------------------------------
// AC1: design/cards/frontier-set.md exists and contains exactly 5 distinct
// named cards, one per race under design/races/.
// ---------------------------------------------------------------------------

test('AC1: design/cards/frontier-set.md exists', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
});

test('AC1: frontier-set.md contains exactly 5 distinct named cards', () => {
  const names = cards.map((c) => c.title);
  assert.strictEqual(names.length, 5, `expected exactly 5 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

// ---------------------------------------------------------------------------
// AC4 (held_out): no two Frontier Set cards name the same race — checked
// here as "exactly one card names each race", which subsumes both "every
// race is covered" (AC1's "one per race") and "no race is named twice".
// ---------------------------------------------------------------------------

for (const race of racesToCheck) {
  test(`AC1/AC4: exactly one Frontier Set card names the race in ${race.file}`, () => {
    assert.ok(race.raceName, `expected a race title ("# The <Name>") in ${race.file}`);
    const raceNameRe = new RegExp(escapeRegExp(race.raceName));
    const matches = cards.filter((c) => raceNameRe.test(c.body));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one Frontier Set card naming "${race.raceName}", found ${matches.length}: [${matches
        .map((m) => m.title)
        .join(', ')}]`
    );
  });
}

// ---------------------------------------------------------------------------
// AC2: every card uses the canonical template from rules.md Section 9.1 in
// order (Cost line, then Type line, then Rules text, and, only for
// Permanents, an optional Stats/counters line after Rules text).
// ---------------------------------------------------------------------------

for (const card of cardsToCheck) {
  test(`AC2: "${card.title}" has Cost line, Type line, and Rules text in order`, () => {
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

  test(`AC2: "${card.title}" only carries a Stats/counters line after Rules text, and only if a Permanent`, () => {
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
// AC3: each card's rules text names at least one Section 8 spatial term
// (Discovery, Restriction, Closure, Assault, Blockade, or Capture) and
// cites the specific rules.md Section 8 subsection number that defines it.
// ---------------------------------------------------------------------------

for (const card of cardsToCheck) {
  test(`AC3: "${card.title}" names a Section 8 spatial term and cites its defining subsection`, () => {
    const body = card.body;
    const termsPresent = SPATIAL_TERMS.filter((t) => new RegExp(`\\b${t}\\b`).test(body));
    assert.ok(
      termsPresent.length > 0,
      `expected "${card.title}" to name at least one of [${SPATIAL_TERMS.join(', ')}]`
    );
    const citesCorrectSection = termsPresent.some((t) => {
      const section = SPATIAL_TERM_SECTIONS[t];
      return new RegExp(`Section\\s+${section.replace('.', '\\.')}\\b`).test(body);
    });
    assert.ok(
      citesCorrectSection,
      `expected "${card.title}" to cite the correct Section 8 subsection for one of [${termsPresent.join(
        ', '
      )}] (expected one of [${termsPresent.map((t) => SPATIAL_TERM_SECTIONS[t]).join(', ')}])`
    );
  });
}
```

Copy this block verbatim as the file's full contents.

## Step 3 — Verify

Run, from the repo root:

```
node --test
```

Expected output: the run succeeds (`# pass`, `# fail 0`) and now includes a
`design-frontier-cards.test.js` block with these passing subtests:

- `AC1: design/cards/frontier-set.md exists`
- `AC1: frontier-set.md contains exactly 5 distinct named cards`
- `AC1/AC4: exactly one Frontier Set card names the race in cindral-reach.md`
- `AC1/AC4: exactly one Frontier Set card names the race in mireth-bloom.md`
- `AC1/AC4: exactly one Frontier Set card names the race in panoptic-concord.md`
- `AC1/AC4: exactly one Frontier Set card names the race in starweave-communion.md`
- `AC1/AC4: exactly one Frontier Set card names the race in wrought-assembly.md`
- `AC2: "Bastion Reclamation Crew" has Cost line, Type line, and Rules text in order` (and the matching "only carries a Stats/counters line..." test) — same pair repeated for "Frontier Spore Cluster", "Wormhole Ledger", "Rite of Unmaking", "Replication Beachhead"
- `AC3: "<name>" names a Section 8 spatial term and cites its defining subsection` — once per card, 5 total

Total new passing subtests: 1 (file exists) + 1 (count) + 5 (per-race) + 10
(AC2, two per card × 5 cards) + 5 (AC3) = 22.

All pre-existing tests (`test/design-cards.test.js`,
`test/design-art-briefs.test.js`, `test/design-battlefield.test.js`,
`test/design-card-anatomy.test.js`, `test/render-card.test.js`,
`test/sync-cards-to-jaina.test.js`, `test/composite-card-art.test.js`, and
all others) must continue to pass unchanged — they don't read
`design/cards/frontier-set.md` at all, per the grep-confirmed hardcoded
paths noted above, so this addition cannot regress them.

Also spot-check that the two files `git status` reports are exactly the two
new files (`design/cards/frontier-set.md`, `test/design-frontier-cards.test.js`)
and nothing else changed.

## Explicitly out of scope (do not do these)

- Do not modify `design/rules.md`.
- Do not modify `design/cards/alpha-set.md`.
- Do not create or modify `design/cards/character-signatures.md` (it does
  not exist in this repo currently — leave it that way).
- Do not modify any existing test file.
- Do not add art briefs for these 5 cards to `design/cards/art-briefs.md`
  — `test/design-art-briefs.test.js` is hardcoded to `alpha-set.md` only
  and this unit's scope is card text, not art direction.
- Do not attempt to render these cards to SVG or wire them into
  `tools/`/`lib/` rendering or Jaina-sync code — out of scope for this unit.
