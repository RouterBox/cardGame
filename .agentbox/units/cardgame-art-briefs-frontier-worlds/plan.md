GATE: none

# Plan — cardgame-art-briefs-frontier-worlds

## Summary

`design/cards/frontier-worlds-set.md` (5 cards, shipped and merged this
session, never briefed) needs one art-brief `###` section per card
appended to `design/cards/art-briefs.md`, in the exact
Palette/Subject-Scene/Key-visual-elements/Composition template every prior
art-briefs unit used (most recently `cardgame-art-briefs-wormhole-closure`
and `cardgame-art-briefs-spatial-race-identity`). `design/DESIGN-READINESS.md`
Section 4's coverage sentence needs `frontier-worlds-set.md` added to its
file list and its stale `59` art-brief-section count bumped to the live
`64`. A new, independent test file verifies all of it.

This is a pure documentation + new-test-file unit: no source code, no
schema, no user data, fully reversible (git revert). Risk is low.

## Files touched

1. `design/cards/art-briefs.md` — **append only**, 5 new `###` sections
   plus one new `##` wrapper heading. Do not touch any of the 59
   pre-existing sections.
2. `design/DESIGN-READINESS.md` — **edit only** the Section 4 coverage
   bullet (one 6-line block). Section 3 is a false lead — see "Section 3:
   verified, no edit needed" below; do not touch it.
3. `test/design-art-briefs-frontier-worlds.test.js` — **new file**. This is
   a brand-new test file (not a pre-existing one), so the builder creates
   it directly — this does NOT need to go through the test-writer stage.
   No pre-existing `test/*.js` file needs any edit for this unit (verified
   below).

Do not touch: `design/cards/frontier-worlds-set.md`,
`design/cards/card-anatomy.md`, `design/cards/alt-art-briefs.md`.

## Why no pre-existing test file needs editing

Checked both tests that read `design/DESIGN-READINESS.md` Section 4 against
`art-briefs.md`:

- `test/design-readiness.test.js` AC7 re-derives everything live off disk
  (which files are fully covered by brief titles, whether Section 4 cites
  them) — no hardcoded filenames or counts to update.
- `test/design-readiness-section4-art-briefs-coverage.test.js` AC2
  re-derives the live `###` count from `art-briefs.md` itself
  (`sectionCount = (artBriefsContent.match(/^###\s+/gm) || []).length`) and
  asserts Section 4's text contains `"${sectionCount} art-brief sections"`.
  It only requires `sectionCount >= 52` as a floor — no upper pin.

Both are satisfied automatically once the two file edits below land,
because both tests read from disk at test-run time. No `test/*.js` file
needs a builder-authored edit, so the "existing-test-edits go to the
test-writer" rule doesn't apply to this unit at all.

---

## Step 1 — Append 5 sections to `design/cards/art-briefs.md`

**Important formatting note:** `design/cards/art-briefs.md` uses CRLF line
endings throughout (confirmed via raw byte inspection). Use the Edit tool
(not Write) so only the appended bytes change and all 59 existing sections
stay byte-for-byte identical — Edit's old_string/new_string matching
handles the file's existing line-ending convention transparently, but do
**not** manually retype any of the existing tail content from scratch;
copy it verbatim as the old_string.

The file currently ends (last 4 lines) with:

```
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — place Kess
center-frame against a receding grid of numbered, unnamed patrol units
behind them.
```

Use an Edit call on `design/cards/art-briefs.md` with:

- `old_string`: exactly that 4-line block above (copy it verbatim from the
  file — this block is unique in the file, since it's the literal EOF
  content)
- `new_string`: that same 4-line block, followed by two newlines, then the
  new content below

### New content to append (verbatim)

```
## Frontier Worlds Set — Named Ground for Section 8.3

### Halvorne Reclamation Fleet

Palette: Ash-grey — the Mass's industrial endurance, sent back to a
junction that's never stayed held.
Subject/Scene: A Cindral Reach reclamation fleet returns to Halvorne
Junction mid-Contested Discovery, ash-grey Materials hulls threading the
tangle of cheap wormholes that meet there to weld a Fortification counter
onto a Generator the Reach still holds.
Key visual elements:
- A Contested Discovery action resolving at Halvorne Junction, the tangle of short, cheap wormholes converging behind the fleet
- A Fortification counter being welded directly onto a Generator, ash-grey Materials plating still sparking at the seam
- The Planet itself shown mid-contest, a hold neither the Reach nor the Communion has ever fully finished
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — keep the fleet
arriving low across the frame with Halvorne Junction's tangle of
wormholes converging behind it.

### Tanglekeeper's Vigil

Palette: Violet — the Tangle's uncanny ritual mood, kept up over a
junction it has never stopped haunting.
Subject/Scene: A Starweave Communion ritualist keeps vigil at Halvorne
Junction after a Frontier Discovery, violet thread trailing from her
hands as she reads whether the top card of her Archive is worth keeping
or sending to the bottom.
Key visual elements:
- A Frontier Discovery action just completed, its Wormhole Length short enough — three or fewer — to reach Halvorne Junction in one crossing
- A Starweave Communion ritualist reading the top card of an Archive, violet thread deciding whether it stays or returns to the bottom
- The Wormhole itself shown as the short, cheap thread Halvorne Junction is known for, still answering to an oath sworn generations ago
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — center the ritualist
over the Wormhole's mouth with the Archive's top card lit at the frame's
edge.

### Kelmourn Wreck-Bloom

Palette: Green — the Bloom's patient growth, rooting into ground no
Contested Discovery has ever settled.
Subject/Scene: A Mireth Bloom growth roots into Kelmourn Drift's
resurfacing wreckage mid-Contested Discovery, a Growth counter swelling
onto the Unit as the debris field's Neutral Planet claim reopens again.
Key visual elements:
- A Contested Discovery action just completed at Kelmourn Drift, a Neutral Planet claim reopened as First Weave wreckage resurfaces
- A Growth counter taking root on this Unit, green Biology growth answering the claim rather than a combat stance
- Kelmourn Drift's debris field cradling the Unit, First Weave wreckage still being claimed and reclaimed
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — root the Unit low in
frame with Kelmourn Drift's resurfacing wreckage filling the width
beneath it.

### Kelmourn Claim Ledger

Palette: Cyan — the Signal's cool analytic watchfulness, kept over a
Neutral Planet's ledger of claims.
Subject/Scene: A Panoptic Concord broker reads the top card of an
Archive in cyan ledger-light while Kelmourn Drift sits on the battlefield
graph as a Neutral Planet, claimed by no one civilization outright.
Key visual elements:
- Kelmourn Drift shown on the battlefield graph as a Neutral Planet, claimed by no one civilization outright
- A Panoptic Concord broker reading the top card of an Archive, cyan Intelligence ledger-light weighing whether it stays or moves to the bottom
- The debris field's wreckage in the background, the same argument every claim there reopens since the Cinderglass War
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — keep the broker close
over the Archive with Kelmourn Drift's Neutral Planet marker visible at
the frame's edge.

### Tallowfen Chokepoint Works

Palette: Copper — the Circuit's warm mechanized repetition, held at a
chokepoint worth nothing but the wormhole running through it.
Subject/Scene: A Wrought Assembly Generator produces a Circuit Point at
Tallowfen's one chokepoint wormhole, copper conduits humming as an
Assault action resolves into a Blockade and a token copy of the
permanent begins to form.
Key visual elements:
- A Wrought Assembly Generator at Tallowfen producing a Circuit Point every Generation Phase, copper conduits feeding the resource pool
- An Assault action resolving into a Blockade of Tallowfen's chokepoint wormhole, the permanent's token copy already forming beside it
- The chokepoint wormhole itself, the only thing Tallowfen has ever been worth holding, ships massed to keep the Blockade
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — center the Generator
at the chokepoint with the forming token copy and the massed Blockade
fleet sharing the frame.
```

### Why this content satisfies AC3/AC4/AC5

- **Palette colors** match the Fount → color mapping in
  `design/cards/card-anatomy.md`'s "Frame/Border color identity" table
  (Mass→Ash-grey, Bloom→Green, Signal→Cyan, Circuit→Copper, Tangle→Violet),
  applied per each card's own Cost line in `frontier-worlds-set.md`:
  Halvorne Reclamation Fleet (2 Mass→Ash-grey), Tanglekeeper's Vigil
  (2 Tangle→Violet), Kelmourn Wreck-Bloom (2 Bloom→Green), Kelmourn Claim
  Ledger (1 Signal→Cyan), Tallowfen Chokepoint Works (2 Circuit→Copper).
- **Key visual elements overlap** — each card's 3 bullets were built by
  reusing the card's own named world/mechanic terms, which are also the
  words that appear in that same card's Type line/Rules text in
  `frontier-worlds-set.md`. Verified by hand against the exact word-overlap
  logic `test/design-art-briefs-spatial-race-identity.test.js` uses
  (`significantWords()`, 4+ letter words minus its `STOPWORDS` set — note
  `STOPWORDS` includes `slow`, `spent`, `resolves`, `permanent`,
  `controller`, `combat`, `strength`, `enters`, `counters`, `counter`,
  `look`, so those particular words don't count toward overlap even though
  they appear in the rules text):
  - Halvorne Reclamation Fleet: overlaps on "contested", "discovery",
    "action", "halvorne", "junction", "fortification", "generator",
    "materials", "planet" (9, well over the required 2).
  - Tanglekeeper's Vigil: overlaps on "frontier", "discovery", "wormhole",
    "length", "halvorne", "junction", "archive", "bottom".
  - Kelmourn Wreck-Bloom: overlaps on "contested", "discovery",
    "kelmourn", "drift", "neutral", "planet", "growth", "unit", "biology".
  - Kelmourn Claim Ledger: overlaps on "kelmourn", "drift", "battlefield",
    "graph", "neutral", "planet", "archive", "bottom", "intelligence".
  - Tallowfen Chokepoint Works: overlaps on "generator", "circuit",
    "generation", "phase", "tallowfen", "assault", "blockade".
  - None of the bullets contain any of the `GENERIC_FILLER` phrases
    ("dramatic lighting", "epic composition", "stunning artwork", etc.).
- **Composition aspect ratio/shape** — every Composition line's *first
  physical line* (the part the test's `[^\n]+` regex actually captures,
  since it stops at the first newline) is exactly
  `wide, landscape rectangle (~5:3), the large rectangular`, matching the
  pattern every other brief in the file already uses on its first line.
  Do not let the aspect ratio or "landscape rectangle" wording drift past
  the first `\n` when appending — that would silently break AC5's regex
  even though the text reads fine to a human.
- **Section shape** — each new section has all 4 required fields
  (`Palette:`, `Subject/Scene:`, `Key visual elements:` with 3 bullets,
  `Composition:`), matching the shape of every existing section.

---

## Step 2 — Edit `design/DESIGN-READINESS.md` Section 4

Use Edit with:

`old_string`:
```
- **`design/cards/art-briefs.md`** — 59 art-brief sections, covering every
  card in `alpha-set.md`, `frontier-set.md`, `character-signatures.md`,
  `character-signatures-wave-2.md`, `character-signatures-wave-3.md`,
  `fount-economy-set.md`, `wormhole-restrictions-set.md`,
  `wormhole-closure-cards.md`, `spatial-race-identity-set.md`, and
  `spatial-race-identity-set-wave-2.md`.
```

`new_string`:
```
- **`design/cards/art-briefs.md`** — 64 art-brief sections, covering every
  card in `alpha-set.md`, `frontier-set.md`, `character-signatures.md`,
  `character-signatures-wave-2.md`, `character-signatures-wave-3.md`,
  `fount-economy-set.md`, `wormhole-restrictions-set.md`,
  `wormhole-closure-cards.md`, `spatial-race-identity-set.md`,
  `spatial-race-identity-set-wave-2.md`, and `frontier-worlds-set.md`.
```

(This is the only change to `DESIGN-READINESS.md`. `64` = the current 59
`###` sections in `art-briefs.md` + the 5 new ones from Step 1 — verify
this arithmetic against the actual post-Step-1 file before committing,
in case the exact count differs from what's assumed here.)

### Section 3: verified, no edit needed

The unit spec says to update Section 3's "Total: 59 named cards" sentence
"if it names art-briefs.md's section count." It doesn't — Section 3's
sentence ("**Total: 59 named cards across 10 files.**") is about the total
number of playable cards across `design/cards/*.md` set files, re-derived
live by `test/design-readiness.test.js`, and is completely unrelated to
`art-briefs.md`'s section count (which lives only in Section 4). This
unit doesn't add any new cards to any set — it only adds art briefs for
cards that already existed — so the card total stays 59 and Section 3 is
correctly left untouched. (The fact that both numbers happen to read "59"
today is coincidental and will diverge to 59 cards / 64 brief sections
after this unit — that's expected and correct, not a bug.)

---

## Step 3 — Create `test/design-art-briefs-frontier-worlds.test.js`

This mirrors `test/design-art-briefs-spatial-race-identity.test.js`
structurally, exactly (same AC1/AC2/AC3/AC4 test labels and logic),
parameterized to `frontier-worlds-set.md`'s 5 cards instead of
`spatial-race-identity-set.md`'s 3. Create this file verbatim:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');
const FRONTIER_WORLDS_CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'frontier-worlds-set.md');
const ANATOMY_PATH = path.join(__dirname, '..', 'design', 'cards', 'card-anatomy.md');

// AC1 also requires that every other card file and the pre-existing
// art-briefs test files stay byte-identical to before this unit. That's a
// diff-time property, not something this test file can usefully assert on
// its own — see the identical note in
// test/design-art-briefs-spatial-race-identity.test.js. It's verified by
// the orchestrator's diff at merge time instead.

const FOUNT_COLORS = {
  Mass: 'Ash-grey',
  Bloom: 'Green',
  Signal: 'Cyan',
  Circuit: 'Copper',
  Tangle: 'Violet',
};
const FOUNTS = Object.keys(FOUNT_COLORS);

const GENERIC_FILLER = [
  'dramatic lighting',
  'epic composition',
  'epic scene',
  'stunning artwork',
  'stunning visual',
  'beautiful scene',
  'amazing artwork',
  'amazing visual',
  'breathtaking',
  'awe-inspiring',
];

const STOPWORDS = new Set([
  'this', 'that', 'with', 'from', 'your', 'their', 'when', 'resolves',
  'permanent', 'controller', 'holds', 'priority', 'until', 'during', 'usable',
  'instant', 'speed', 'combat', 'strength', 'enters', 'counters', 'counter',
  'deal', 'damage', 'move', 'card', 'look', 'onto', 'other', 'than', 'front',
  'into', 'them', 'about', 'have', 'been', 'told', 'precisely', 'once',
  'slow', 'fast', 'spent', 'ready',
]);

function readFile(p) {
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

function listCardsFromFile(cardsPath) {
  const content = readFile(cardsPath);
  if (content === null) return [];
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function costFounts(card) {
  const costMatch = card.body.match(/Cost line:\s*([^\n]+)/);
  if (!costMatch) return [];
  const costText = costMatch[1];
  const found = [];
  const re = new RegExp(FOUNTS.join('|'), 'g');
  let m;
  while ((m = re.exec(costText)) !== null) {
    if (!found.includes(m[0])) found.push(m[0]);
  }
  return found;
}

function significantWords(text) {
  const words = (text.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || []);
  return new Set(words.filter((w) => !STOPWORDS.has(w)));
}

function briefBriefsSections() {
  const content = readFile(BRIEFS_PATH);
  if (content === null) return [];
  const sections = parseSections(content);
  return sections.filter((s) => s.level === 3);
}

function findBriefSection(title) {
  return briefBriefsSections().find((s) => s.title === title) || null;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const frontierWorldsCards = listCardsFromFile(FRONTIER_WORLDS_CARDS_PATH);
const cardsToCheck = frontierWorldsCards.length
  ? frontierWorldsCards
  : [{ title: '<no cards found — design/cards/frontier-worlds-set.md missing or empty>', body: '' }];

// ---------------------------------------------------------------------------
// AC1: design/cards/art-briefs.md gains exactly one brief section per
// frontier-worlds-set.md card, titled verbatim, with no pre-existing
// brief sections removed/renamed/altered (that last part is verified by the
// orchestrator's diff at merge time — see note above).
// ---------------------------------------------------------------------------

test('design/cards/art-briefs.md exists', () => {
  assert.ok(fs.existsSync(BRIEFS_PATH), `expected ${BRIEFS_PATH} to exist`);
});

test('AC1: frontier-worlds-set.md has exactly 5 cards (sanity check on fixture)', () => {
  assert.strictEqual(
    frontierWorldsCards.length,
    5,
    `expected 5 cards in frontier-worlds-set.md, found ${frontierWorldsCards.length}`
  );
});

test('AC1: all 5 frontier-worlds-set.md card titles are present verbatim in art-briefs.md as "###" sections', () => {
  const briefTitles = briefBriefsSections().map((s) => s.title);
  const expectedTitles = [
    'Halvorne Reclamation Fleet',
    "Tanglekeeper's Vigil",
    'Kelmourn Wreck-Bloom',
    'Kelmourn Claim Ledger',
    'Tallowfen Chokepoint Works',
  ];
  const cardTitles = frontierWorldsCards.map((c) => c.title);
  assert.deepStrictEqual(
    [...cardTitles].sort(),
    [...expectedTitles].sort(),
    `expected frontier-worlds-set.md's own card titles to be exactly ${JSON.stringify(expectedTitles)}, got ${JSON.stringify(cardTitles)}`
  );
  for (const name of expectedTitles) {
    assert.ok(
      briefTitles.includes(name),
      `expected a brief section titled exactly "${name}" in art-briefs.md`
    );
  }
});

for (const card of cardsToCheck) {
  test(`AC1: "${card.title}" has exactly one matching brief section in art-briefs.md`, () => {
    const matches = briefBriefsSections().filter((s) => s.title === card.title);
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one brief section titled "${card.title}", found ${matches.length}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC2: each of the 5 new briefs' Palette line names the Fount-driven color
// for every Fount in that card's own Cost line.
// ---------------------------------------------------------------------------

for (const card of cardsToCheck) {
  test(`AC2: "${card.title}" brief names the correct Fount-driven palette color(s)`, () => {
    const section = findBriefSection(card.title);
    assert.ok(section, `expected a brief section for "${card.title}"`);
    const body = section.lines.join('\n');
    const paletteMatch = body.match(/Palette:\s*([^\n]+)/i);
    assert.ok(paletteMatch, `expected a "Palette:" line in the "${card.title}" brief`);

    const founts = costFounts(card);
    assert.ok(founts.length > 0, `expected to find Fount(s) named in "${card.title}"'s Cost line`);
    const expectedColors = founts.map((f) => FOUNT_COLORS[f]);
    for (const color of expectedColors) {
      const re = new RegExp(escapeRegExp(color), 'i');
      assert.ok(
        re.test(paletteMatch[1]),
        `expected "${card.title}"'s Palette line to name "${color}" (per card-anatomy.md's Fount identity table), got: "${paletteMatch[1]}"`
      );
    }
  });
}

// ---------------------------------------------------------------------------
// AC3 (held_out): each brief has a "Key visual elements:" list of >=2
// bullets sharing >=2 significant words with the card's own Type
// line/Rules text, and a "Composition:" line naming the Art Window's
// rectangular/landscape shape and an aspect ratio.
// ---------------------------------------------------------------------------

test('AC4: card-anatomy.md describes the Art Window as a rectangular shape (sanity check on fixture)', () => {
  const anatomy = readFile(ANATOMY_PATH);
  assert.ok(anatomy, `expected ${ANATOMY_PATH} to exist`);
  assert.ok(
    /Art Window.*rectangular|rectangular.*window/i.test(anatomy.replace(/\n/g, ' ')),
    'expected card-anatomy.md to describe the Art Window as a rectangular window'
  );
});

for (const card of cardsToCheck) {
  test(`AC3: "${card.title}" brief lists at least 2 concrete, card-specific visual elements`, () => {
    const section = findBriefSection(card.title);
    assert.ok(section, `expected a brief section for "${card.title}"`);
    const body = section.lines.join('\n');

    const keyElementsMatch = body.match(/Key visual elements:\s*\n((?:\s*-\s*.+\n?)+)/i);
    assert.ok(keyElementsMatch, `expected a "Key visual elements:" bulleted list in the "${card.title}" brief`);

    const bulletLines = keyElementsMatch[1]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('-'));
    assert.ok(
      bulletLines.length >= 2,
      `expected at least 2 "Key visual elements" bullets in "${card.title}", found ${bulletLines.length}`
    );

    const bulletsText = bulletLines.join(' ').toLowerCase();
    for (const filler of GENERIC_FILLER) {
      assert.ok(
        !bulletsText.includes(filler),
        `expected "${card.title}"'s visual elements to avoid generic filler phrase "${filler}"`
      );
    }

    const typeMatch = card.body.match(/Type line:\s*([^\n]+)/);
    const rulesMatch = card.body.match(/Rules text:\s*([^\n]+(?:\n(?!\*)[^\n]+)*)/);
    const sourceText = `${typeMatch ? typeMatch[1] : ''} ${rulesMatch ? rulesMatch[1] : ''}`;
    const sourceWords = significantWords(sourceText);
    const bulletWords = significantWords(bulletsText);
    const overlap = [...sourceWords].filter((w) => bulletWords.has(w));
    assert.ok(
      overlap.length >= 2,
      `expected "${card.title}"'s visual-elements bullets to draw on at least 2 concrete words from its own ` +
        `Rules text/Type line (found overlap: [${overlap.join(', ')}]) — not generic filler`
    );
  });

  test(`AC4: "${card.title}" brief has a composition note referencing the Art Window's shape/aspect ratio`, () => {
    const section = findBriefSection(card.title);
    assert.ok(section, `expected a brief section for "${card.title}"`);
    const body = section.lines.join('\n');

    const compositionMatch = body.match(/Composition:\s*([^\n]+)/i);
    assert.ok(compositionMatch, `expected a "Composition:" line in the "${card.title}" brief`);

    const note = compositionMatch[1];
    assert.ok(
      /\d+\s*:\s*\d+/.test(note),
      `expected "${card.title}"'s Composition note to reference the Art Window's aspect ratio (e.g. "5:3"), got: "${note}"`
    );
    assert.ok(
      /rectangular|rectangle|landscape/i.test(note),
      `expected "${card.title}"'s Composition note to reference the Art Window's rectangular/landscape shape, got: "${note}"`
    );
  });
}
```

---

## Verification

1. Run `node --test test/design-art-briefs-frontier-worlds.test.js` — all
   tests pass (roughly 5 cards × 4 test bodies + 3 fixed-shape tests ≈ 23
   passing assertions, 0 failing).
2. Run `node --test test/design-readiness.test.js
   test/design-readiness-section4-art-briefs-coverage.test.js` — both
   still pass (they re-derive from disk, no hardcoded values to break).
3. Run `node --test test/design-art-briefs-spatial-race-identity.test.js
   test/design-art-briefs-wormhole-closure.test.js
   test/design-alt-art-briefs.test.js` — unaffected, still pass (proves
   the append didn't disturb any pre-existing section).
4. Run the full suite: `node --test`. Expected: all tests pass, 0 failing
   (exact total count will be whatever the suite currently reports plus
   the ~23 new tests from step 3's file — do not hand-pin this number in
   any file; nothing in this plan requires it).
5. Manually diff `design/cards/frontier-worlds-set.md`,
   `design/cards/card-anatomy.md`, and `design/cards/alt-art-briefs.md`
   against their pre-unit state — all three must show zero changes.
6. Manually diff `design/cards/art-briefs.md` — the only changes should be
   a pure append (one new `##` line, 5 new `###` sections) with every byte
   before that point unchanged.

## Risk assessment (FIRE)

- **Reversibility:** trivial — a `git revert` undoes two markdown edits and
  removes one new test file. No migrations, no generated artifacts depend
  on this content yet (composite-card-art.js only reads art-briefs.md at
  render time, and isn't run by this unit).
- **Security impact:** none — no code changes, no new dependencies, no
  network calls.
- **User data:** none — this is a design-content repo with no user data or
  runtime service.
- **Schema changes:** none.

Net: low risk, straightforward docs + new-test-file unit. `GATE: none`.
