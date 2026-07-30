# cardgame-art-briefs-wormhole-closure: Art briefs for the Wormhole Closure Cards — the newest shipped card file with zero briefs

## Header

- unit: cardgame-art-briefs-wormhole-closure
- title: Art briefs for the Wormhole Closure Cards — the newest shipped card file with zero briefs
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: 6ef2e361cb11898ae23ee9b7313288a06108c85f
- end_sha: a2ee234540039a5ff32d98da2492873c5021f671

## Intent

design/cards/art-briefs.md (shipped) states its own purpose as giving one written art brief per card so illustration work can be approved before it starts (T8), and tools/composite-card-art.js's loadBriefs() drives its whole compositing loop off exactly that file's '###' sections — a card absent from art-briefs.md is permanently un-renderable. design/cards/wormhole-closure-cards.md (shipped) added 5 named cards, one per race, each Closing an existing Wormhole per rules.md Section 8.5: Bastion Seal Detachment (Cindral Reach, 2 Mass), Withering Conduit Rot (Mireth Bloom, 2 Bloom), Severance Directive (Panoptic Concord, 1 Signal), Rite of the Sealed Tangle (Starweave Communion, 2 Tangle), Chokepoint Demolition Charge (Wrought Assembly, 2 Circuit) — with no corresponding briefs ever written. This unit adds one new '###' brief section per card to art-briefs.md, following the identical Palette/Subject-Scene/Key-visual-elements/Composition template the file already uses for alpha-set.md, wormhole-restrictions-set.md, and fount-economy-set.md, with each Palette line naming the single card-anatomy.md Fount-identity color matching the one Fount in that card's own Cost line, and each Key-visual-elements list drawing concretely on that card's own rules text and flavor text (e.g. Bastion Seal Detachment's welded-shut border, Withering Conduit Rot's overtaken lining, Severance Directive's issued order outpacing the reader, Rite of the Sealed Tangle's returning-to-shape framing, Chokepoint Demolition Charge's single charge/pulse) rather than generic filler. It adds a new, independent test/design-art-briefs-wormhole-closure.test.js mirroring the assertion shape of the existing design-art-briefs tests, so it has zero touch-overlap with the open wormhole-restrictions or fount-economy art-briefs work, or with the open art-brief-test-helper-dedup proposal's edits to the shared test/design-art-briefs.test.js. No card file, rules.md, or the compositing/rendering code itself is touched — only art-briefs.md grows and a new test file is added.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/art-briefs.md gains exactly 5 new '###' sections, titled exactly 'Bastion Seal Detachment', 'Withering Conduit Rot', 'Severance Directive', 'Rite of the Sealed Tangle', and 'Chokepoint Demolition Charge' verbatim, with no pre-existing brief section removed, renamed, or altered.
- AC2 [paraphrase]: Each new brief's Palette line names the single Fount-driven color from card-anatomy.md's Fount identity table matching the one Fount named in that card's own Cost line (Ash-grey for Mass, Green for Bloom, Cyan for Signal, Copper for Circuit, Violet for Tangle).
- AC3 [paraphrase]: Each new brief has a 'Key visual elements:' list of at least 2 bullets sharing at least 2 significant words with that card's own rules text or flavor text (not generic filler phrasing), and a 'Composition:' line naming the Art Window's rectangular/landscape shape and an aspect ratio.
- AC4 [inferred] (held_out): test/design-art-briefs-wormhole-closure.test.js exists and enforces the above against the real, current wormhole-closure-cards.md and art-briefs.md content; every other card file and every pre-existing test file remain byte-identical to before this unit.

## Plan

GATE: none

# Plan: cardgame-art-briefs-wormhole-closure

## Summary

Add 5 new `###` art-brief sections to `design/cards/art-briefs.md` — one per
card in `design/cards/wormhole-closure-cards.md` — and add one new,
self-contained test file `test/design-art-briefs-wormhole-closure.test.js`
that asserts against them. Nothing else changes: no card file, no
`rules.md`, no compositing/rendering code, no other test file.

This is a pure documentation + test addition. Low risk, fully reversible,
no schema/security/user-data impact. Two files touched, both new content
appended/created (no existing content is deleted or rewritten).

## Files touched

1. `design/cards/art-briefs.md` — **append** (do not touch any existing
   line). Add a new `##` section at the very end of the file, after the
   existing last section (`### Pilgrim's Right of Way`, ending at line 707).
2. `test/design-art-briefs-wormhole-closure.test.js` — **new file**.

Do not modify `design/cards/wormhole-closure-cards.md`, `design/rules.md`,
`tools/composite-card-art.js`, or any existing test file (in particular
leave `test/design-art-briefs.test.js` and
`test/design-art-briefs-wormhole-restrictions.test.js` byte-identical).

## Background facts this plan relies on (verified in-repo)

- `design/cards/wormhole-closure-cards.md` has exactly 5 `###` cards, one
  per race, each with a single-Fount Cost line:
  - `Bastion Seal Detachment` — Cindral Reach — Cost: `2 Mass` — Type:
    `Materials — Permanent`
  - `Withering Conduit Rot` — Mireth Bloom — Cost: `2 Bloom` — Type:
    `Biology`
  - `Severance Directive` — Panoptic Concord — Cost: `1 Signal` — Type:
    `Intelligence`
  - `Rite of the Sealed Tangle` — Starweave Communion — Cost: `2 Tangle` —
    Type: `Magic`
  - `Chokepoint Demolition Charge` — Wrought Assembly — Cost: `2 Circuit` —
    Type: `Technology`
  All 5 share the same rules-text shape ("choose a Wormhole with an
  endpoint at a Planet you control; it undergoes Closure (Section 8.5,
  which defines Closure) and is removed from the battlefield graph"), each
  with its own flavor-text sentence beneath it.
- `design/cards/card-anatomy.md` (lines 45-51) has the Fount identity
  table: Mass → Ash-grey, Bloom → Green, Signal → Cyan, Circuit → Copper,
  Tangle → Violet. Matches AC2 exactly.
- `design/cards/card-anatomy.md` line 12 describes the Art Window as "the
  large rectangular window beneath the Name Slot" — every existing brief's
  `Composition:` line quotes this plus a `~5:3` aspect ratio; new briefs
  must do the same.
- `tools/composite-card-art.js`'s `loadBriefs()` parses `art-briefs.md` by
  splitting on `###` (H3) headings only — the new sections must be `###`,
  nested under a `##` section, exactly like every existing set.
- `test/design-art-briefs-wormhole-restrictions.test.js` is the closest
  existing precedent (same "5 cards, one Fount each, Closure-flavored"
  shape as this unit, just for Restrictions instead of Closure) — the new
  test file mirrors its structure almost exactly, just repointed at
  `wormhole-closure-cards.md` and the 5 new titles.
- Test helper `test/helpers/markdown.js` exports `parseSections(content)`,
  returning `{level, title, lines}` per heading — already used by every
  sibling art-briefs test; reuse it, don't reimplement.
- `node --test` (per `package.json`'s `test` script:
  `node --test --test-concurrency=1`) auto-discovers every `test/*.test.js`
  file — the new file needs no registration anywhere.

## Step 1 — Append to `design/cards/art-briefs.md`

Open `design/cards/art-briefs.md`. Go to the very end of the file (it
currently ends at line 707 with the `Pilgrim's Right of Way` brief's
Composition line: `...frame's edge.`). Add a blank line, then append the
following text verbatim as new content (do not alter anything above it):

```markdown

## Wormhole Closure Cards — Sealing the Battlefield Graph

### Bastion Seal Detachment

Palette: Ash-grey — the Mass's industrial endurance, spent once to weld a
passage shut for good.
Subject/Scene: A Cindral Reach work crew welds a fresh seal across a
Wormhole's endpoint at a Planet under their control, the passage
undergoing Closure as its connection fades from the battlefield graph
behind them.
Key visual elements:
- A welded-shut seam closing directly over a Wormhole's endpoint at a Planet under the crew's control, ash-grey Materials plating still sparking at the weld
- The battlefield graph itself shown thinning where that Wormhole's connection is removed, the passage undergoing Closure rather than a fight
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — center the welded endpoint
with the fading graph connection receding toward the frame's edge.

### Withering Conduit Rot

Palette: Green — the Bloom's patient growth, spent once to let a passage
be overtaken rather than fought over.
Subject/Scene: A Mireth Bloom growth-mass spreads across the lining of a
Wormhole's endpoint at a Planet its controller holds, spores thickening
over the passage until it undergoes Closure and fades from the
battlefield graph.
Key visual elements:
- Living spore-growth visibly overtaking the lining of a Wormhole's endpoint at a Planet the Bloom holds, Biology rather than force closing the passage
- The battlefield graph shown losing that Wormhole's connection as the passage is removed, undergoing Closure without a single blow struck
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — let the overtaking growth fill
the endpoint from one edge of the frame, the graph connection fading at
the other.

### Severance Directive

Palette: Cyan — the Signal's cool analytic watchfulness, an order that
outpaces the reader.
Subject/Scene: A Panoptic Concord cipher issues a severance directive in
cyan light at a Wormhole's endpoint, the order already resolved before
anyone can finish reading it, the passage undergoing Closure and
vanishing from the battlefield graph.
Key visual elements:
- A cyan directive-order shown racing ahead of a reader's eye toward a Wormhole's endpoint at a Planet the Concord holds, the Signal outpacing the reading of its own text
- The battlefield graph fading where that Wormhole's connection is removed, gone before the directive finishes unrolling
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — angle the directive-order
diagonally ahead of the reading gaze, outpacing it toward the fading
endpoint.

### Rite of the Sealed Tangle

Palette: Violet — the Tangle's uncanny ritual mood, closure framed as a
return rather than a loss.
Subject/Scene: A Starweave Communion ritualist winds violet threads of
light around a Wormhole's endpoint at a Planet they control, the rite
framed as the Tangle returning to a shape it should never have left,
until the passage undergoes Closure and fades from the battlefield graph.
Key visual elements:
- Violet ritual threads winding a Wormhole's endpoint closed at a Planet under the ritualist's control, framed as the Tangle returning to its proper shape rather than being torn
- The battlefield graph shown losing that Wormhole's connection as it is removed, the rite ending in stillness rather than violence
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — let the violet threads curl
inward around the endpoint, closing the frame's center like the rite
itself.

### Chokepoint Demolition Charge

Palette: Copper — the Circuit's warm mechanized precision, spent in a
single pulse.
Subject/Scene: A Wrought Assembly demolition charge fires one copper
Circuit pulse into a Wormhole's endpoint at a Planet its controller
holds, the chokepoint undergoing Closure in a single detonation and
vanishing from the battlefield graph.
Key visual elements:
- A single charge and one copper Circuit pulse detonating at a Wormhole's endpoint at a Planet the Assembly holds, one shot rather than a sustained assault
- The battlefield graph shown losing that Wormhole's connection the instant it is removed, the chokepoint gone as a variable for good
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — center the single pulse at
the moment of detonation, the chokepoint's graph connection fading at the
frame's edge.
```

Notes for the implementer:
- Keep the blank line between each `###` subsection and between the
  `##` heading and the first `###`, matching the rest of the file.
- Each `Key visual elements:` bullet must stay on **one physical line**
  (do not hand-wrap it) — every existing brief in this file follows that
  convention, and the test's bullet-parsing regex only captures lines that
  themselves start with `-`.
- `Palette:` and `Composition:` lines may wrap onto a second physical line
  (as shown above) — this matches the rest of the file and is safe because
  the test only regex-matches up to the first `\n` after the label, and
  the required content (color name; `5:3` + "rectangle"/"landscape") is
  already on that first line in every case above.
- Do not renumber, reformat, or touch anything before line 707 of the
  current file.

## Step 2 — Create `test/design-art-briefs-wormhole-closure.test.js`

Create this file with the following full contents (mirrors
`test/design-art-briefs-wormhole-restrictions.test.js` structurally,
repointed at the wormhole-closure cards and titles):

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');
const WORMHOLE_CLOSURE_CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'wormhole-closure-cards.md');
const ANATOMY_PATH = path.join(__dirname, '..', 'design', 'cards', 'card-anatomy.md');

// AC4 (held_out) also requires that every other card file and the
// pre-existing art-briefs test files stay byte-identical to before this
// unit. That's a diff-time property, not something this test file can
// usefully assert on its own (a hardcoded hash here would be correct today
// and a guaranteed false alarm the moment any later unit legitimately
// touches a shared card-set file — see the identical note in
// test/design-art-briefs-wormhole-restrictions.test.js). It's verified by
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

const wormholeClosureCards = listCardsFromFile(WORMHOLE_CLOSURE_CARDS_PATH);
const cardsToCheck = wormholeClosureCards.length
  ? wormholeClosureCards
  : [{ title: '<no cards found — design/cards/wormhole-closure-cards.md missing or empty>', body: '' }];

// ---------------------------------------------------------------------------
// AC1: design/cards/art-briefs.md gains exactly one brief section per
// wormhole-closure-cards.md card, titled verbatim, with no pre-existing
// brief sections removed/renamed/altered (that last part is verified by the
// orchestrator's diff at merge time — see note above).
// ---------------------------------------------------------------------------

test('design/cards/art-briefs.md exists', () => {
  assert.ok(fs.existsSync(BRIEFS_PATH), `expected ${BRIEFS_PATH} to exist`);
});

test('AC1: wormhole-closure-cards.md has exactly 5 cards (sanity check on fixture)', () => {
  assert.strictEqual(
    wormholeClosureCards.length,
    5,
    `expected 5 cards in wormhole-closure-cards.md, found ${wormholeClosureCards.length}`
  );
});

test('AC1: all 5 wormhole-closure-cards.md card titles are present verbatim in art-briefs.md as "###" sections', () => {
  const briefTitles = briefBriefsSections().map((s) => s.title);
  const expectedTitles = [
    'Bastion Seal Detachment',
    'Withering Conduit Rot',
    'Severance Directive',
    'Rite of the Sealed Tangle',
    'Chokepoint Demolition Charge',
  ];
  const cardTitles = wormholeClosureCards.map((c) => c.title);
  assert.deepStrictEqual(
    [...cardTitles].sort(),
    [...expectedTitles].sort(),
    `expected wormhole-closure-cards.md's own card titles to be exactly ${JSON.stringify(expectedTitles)}, got ${JSON.stringify(cardTitles)}`
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
// AC3: each brief has a "Key visual elements:" list of >=2 bullets sharing
// >=2 significant words with the card's own Type line/Rules text, and a
// "Composition:" line naming the Art Window's rectangular/landscape shape
// and an aspect ratio.
// ---------------------------------------------------------------------------

test('AC3: card-anatomy.md describes the Art Window as a rectangular shape (sanity check on fixture)', () => {
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

  test(`AC3: "${card.title}" brief has a composition note referencing the Art Window's shape/aspect ratio`, () => {
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

## Step 3 — Verify

Run:

```
node --test
```

Expected output: every existing suite still passes unchanged (no file it
depends on was touched), plus a new `design-art-briefs-wormhole-closure`
suite reporting all its `test()` blocks passing — specifically:
- 1 file-exists test
- 1 "exactly 5 cards" sanity test
- 1 "all 5 titles present" test
- 5× "has exactly one matching brief section" tests (AC1, one per card)
- 5× "names the correct Fount-driven palette color(s)" tests (AC2)
- 1 "Art Window described as rectangular" sanity test
- 5× "lists at least 2 concrete, card-specific visual elements" tests (AC3)
- 5× "has a composition note referencing the Art Window's shape/aspect
  ratio" tests (AC3)

Total new passing tests from this file: 19. The overall `node --test`
summary line should show `# fail 0` (or equivalent "pass" tally increased
by 19 with 0 new failures), and `git diff --stat` should show exactly two
files changed: `design/cards/art-briefs.md` (insertions only, appended at
the end) and `test/design-art-briefs-wormhole-closure.test.js` (new file).

## Risk self-assessment (FIRE matrix)

- **F**ully reversible: yes — pure append to one markdown file plus one new
  test file; `git revert` trivially undoes it.
- **I**mpact / blast radius: none beyond this repo's docs/tests. No code
  path, schema, API, or runtime behavior changes. `composite-card-art.js`
  is not touched, though it will now additionally be able to render these
  5 cards once art is generated (a strict capability gain, not a
  behavior change to existing cards).
- **S**ecurity impact: none — no code execution paths, no dependencies, no
  user input parsing changed.
- **U**ser data: none — this repo has no user data; these are static
  design docs and tests.
- Schema changes: none.

`GATE: none` — this unit is unambiguous, additive-only, and has a single
verifiable outcome (`node --test` passing with the 19 new tests above).


## Findings

# Blind Review — cardgame-art-briefs-wormhole-closure (cycle 1)

## AC accounting

**AC1** — `design/cards/art-briefs.md` gains exactly 5 new `###` sections, titled exactly
'Bastion Seal Detachment', 'Withering Conduit Rot', 'Severance Directive', 'Rite of the Sealed
Tangle', 'Chokepoint Demolition Charge', with no pre-existing brief altered.
**PASS.** The diff hunk against `art-briefs.md` starts at line 707 (after the existing last
brief's closing line, unchanged) and only *adds* lines — nothing above the insertion point is
touched, removed, or reordered. All 5 titles match verbatim, one `###` each, nested under a new
`## Wormhole Closure Cards — Sealing the Battlefield Graph` heading, following the same
Palette/Subject-Scene/Key-visual-elements/Composition template as every sibling set.

**AC2** — Palette line names the single Fount-driven color matching the card's own Cost line.
**PASS** for all 5:
- Bastion Seal Detachment (Cost: 2 Mass) → Palette: Ash-grey ✓
- Withering Conduit Rot (Cost: 2 Bloom) → Palette: Green ✓
- Severance Directive (Cost: 1 Signal) → Palette: Cyan ✓
- Rite of the Sealed Tangle (Cost: 2 Tangle) → Palette: Violet ✓
- Chokepoint Demolition Charge (Cost: 2 Circuit) → Palette: Copper ✓

**AC3** — Key visual elements: ≥2 bullets sharing ≥2 significant words with the card's own
rules/flavor text (not filler), plus a Composition line naming the Art Window's
rectangular/landscape shape and an aspect ratio.
**PASS.** Every new brief has exactly 2 bullets, each concretely referencing that card's own
rules text (Wormhole/endpoint/Planet/battlefield graph/Closure) and flavor text (welded seam,
overtaking spore-growth, outpacing directive, returning-to-shape rite, single charge/pulse) —
none read as generic filler. Every Composition line reads "wide, landscape rectangle (~5:3), the
large rectangular window beneath the Name Slot per card-anatomy.md — ...", satisfying both the
shape and aspect-ratio requirement.

## Findings

### INTRODUCED (non-blocking) — diff touches more files than plan.md declares
`plan.md` states "Two files touched" (`art-briefs.md` append + one new test file) and explicitly
lists `design/cards/wormhole-closure-cards.md`, `design/rules.md`, and
`tools/composite-card-art.js` as untouched. The actual diff also adds/modifies 10 more files:
5 new SVGs under `renders/cards-composited/`, 5 duplicate SVGs under `site/_card-art/`, and
edits to the generated `site/design/cards/art-briefs.html` and
`site/design/cards/wormhole-closure-cards.html`.

This is plausibly just the expected, mechanical output of running the existing compositing
pipeline now that the 5 cards have briefs and are "renderable" for the first time (per the
intent's own framing) — the new SVGs are internally consistent (correct Fount colors, correct
cost-pip numbers, stats-corner present only on the one Permanent card), and none of it alters
pre-existing rendered content for other cards. It does not violate any visible AC.

Flagging because: (a) it contradicts plan.md's explicit "two files touched" scope claim, and (b)
`site/design/cards/art-briefs.html` is a generated file that sibling in-flight units
(wormhole-restrictions, fount-economy art-briefs work) will very likely also regenerate/append
to — if the underlying tool does a full-file regeneration rather than an incremental append,
landing these units in sequence could silently drop one unit's section from the checked-in HTML.
This is a process/build-hygiene question for the orchestrator, not a defect in this diff's own
content — no visible AC requires these files stay untouched, and nothing in what was generated
is factually wrong. Not gating on this alone.

## Verdict rationale
All 3 visible ACs are met with no gaps, and the one deviation found (broader-than-planned file
footprint) is consistent, correct, and doesn't corrupt any pre-existing content or fail an AC.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T05:07:47.547Z] **bolt:start** — unit=cardgame-art-briefs-wormhole-closure start_sha=6ef2e361cb11898ae23ee9b7313288a06108c85f branch=bolt/cardgame-art-briefs-wormhole-closure worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-art-briefs-wormhole-closure
- [2026-07-30T05:08:00.452Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T05:12:34.870Z] **plan:done** — plan.md written
- [2026-07-30T05:14:05.072Z] **tests:done** — RED verified on test/design-art-briefs-wormhole-closure.test.js (exit=1)
- [2026-07-30T05:21:56.588Z] **build:c1** — tests green, committed
- [2026-07-30T05:25:37.361Z] **review:c1** — APPROVE
- [2026-07-30T05:30:31.105Z] **review:devils-advocate** — APPROVE
- [2026-07-30T05:30:39.633Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T05:30:40.062Z] **merge:done** — auto-merged bolt/cardgame-art-briefs-wormhole-closure into master (worktree)


## Receipt

```json
{
  "start_sha": "6ef2e361cb11898ae23ee9b7313288a06108c85f",
  "end_sha": "156955e5769b9400dec7aa1984b51c082fcd6a0d",
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
  "timestamp": "2026-07-30T05:30:39.631Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-art-briefs-wormhole-closure\\plan.md`.\n\nSummary of the plan:\n- **GATE: none** — additive-only docs + test, no ambiguity.\n- **Step 1**: append a new `## Wormhole Closure Cards` section with 5 `###` briefs to `design/cards/art-briefs.md`, each with a verified Fount→color match (Ash-grey/Green/Cyan/Violet/Copper) and bullets that reuse concrete words (`Wormhole`, `endpoint`, `Planet`, `battlefield`, `graph`, `Closure`, `removed`) drawn straight from each card's own rules text, plus a card-specific flavor image (welded seam, overtaken lining, outpacing directive, returning-to-shape rite, single charge/pulse).\n- **Step 2**: full source for a new `test/design-art-briefs-wormhole-closure.test.js`, mirroring the existing wormhole-restrictions test's structure and mirroring its own held-out-AC caveat note.\n- **Step 3**: `node --test` expectations — 19 new passing tests, 2 files changed in the diff.\n\nI hand-verified the word-overlap and regex requirements (including a possessive-apostrophe pitfall in \"Wormhole's\" that would've broken naive overlap matching) against the actual test regexes before finalizing the brief text, so a junior can copy-paste directly without re-deriving that logic.",
    "test_writer": "I need your approval to run `node --test test/design-art-briefs-wormhole-closure.test.js` to verify the new tests fail as expected (RED check) before finishing. Could you approve the command?",
    "builder_c1": "The full suite is green: **872 tests, 0 failures**, working tree clean.\n\nSummary of what I did, and one deviation from `plan.md` worth flagging:\n\n- Appended the 5 planned `###` art-brief sections to `design/cards/art-briefs.md` exactly as specified (verbatim titles, correct Fount-color Palettes, card-specific Key-visual-elements bullets, `~5:3` landscape Composition lines). The test file `test/design-art-briefs-wormhole-closure.test.js` was already present (written by the test-writer stage) and needed no changes.\n- **Deviation from plan.md:** the plan said only `art-briefs.md` and the new test file would be touched. In practice, adding those 5 briefs made `tools/composite-card-art.js` able to render 5 previously-unrenderable cards, and two *other*, already-merged units' tests (`test/leonardo-art-client.test.js` AC2, `test/card-template-helper.test.js` AC4) assert via `git status --porcelain` that `renders/cards-composited/` and `design/` have zero uncommitted diff. That's unavoidable fallout of correctly shipping this feature, not a bug in my change. I resolved it by running the repo's own `tools/composite-card-art.js` and `tools/build-site.js` to regenerate the derived render/site output, then committing everything (source + generated artifacts) together — mirroring the existing precedent in the repo history (`03d0fa6 art: recover genuine Leonardo renders...`). This was necessary because those two tests' git-status checks can only pass once the tree is committed, not merely staged.",
    "reviewer_c1": "Findings written to `findings.md`. All 3 visible ACs pass cleanly (no pre-existing brief content altered, correct Fount-color palettes, concrete non-filler visual elements with proper Composition lines). One non-blocking note: the diff touches 10 more files than plan.md's declared \"two files touched\" scope (generated render SVGs + site HTML), but the content is internally consistent and doesn't violate any AC or corrupt existing content — flagged as a process observation, not a defect.\n\nAPPROVE",
    "devils_advocate": "Ran a deep verification pass rather than just re-reading the diff:\n\n**Attack attempted:** The unit's Intent explicitly claims \"only art-briefs.md grows and a new test file is added,\" but the actual diff also adds 10 new SVG files (`renders/cards-composited/`, `site/_card-art/`) and modifies two site HTML files. My hypothesis was that these hand-looking SVGs were fabricated by hand rather than genuinely produced by `tools/composite-card-art.js`, risking drift from the real deterministic-mock output that other tests depend on.\n\n**Verification:** I reconstructed the exact hash input (`cardName + \"\\n\" + trimmed brief text`) for \"Bastion Seal Detachment\" straight from the committed `art-briefs.md`, ran it through `sha256sum`, and computed `hue = parseInt(hash.slice(0,6),16) % 360` by hand: `869047` → 8818759 → `mod 360 = 199`. That matches the committed SVG's `hsl(199, 45%, 55%)` exactly — the derived art is genuinely the tool's real deterministic output, not hand-faked.\n\nI also checked for collateral test breakage:\n- `test/design-art-briefs.test.js` (the file with an open dedup proposal) only scopes `alpha-set.md`, `frontier-set.md`, `character-signatures.md` — zero overlap, as claimed.\n- `composite-card-art.test.js` requires at least one card with no matching brief to exercise its warning path; `design/cards/spatial-race-identity-set.md`'s 3 cards remain uncovered after this unit, so that fixture still holds.\n- Site `<img>` paths (`../../_card-art/...`) match the existing convention used elsewhere in the same file.\n- AC2/AC3 spot-checks (Fount→color mapping, word-overlap, aspect-ratio regex) hold on manual inspection.\n\nThe Intent's \"only art-briefs.md grows\" line is technically incomplete versus what shipped, but it's explained by the commit message (regenerating derived output to keep existing idempotency tests green) and doesn't violate any visible AC or break anything — no concrete failure scenario survives.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
