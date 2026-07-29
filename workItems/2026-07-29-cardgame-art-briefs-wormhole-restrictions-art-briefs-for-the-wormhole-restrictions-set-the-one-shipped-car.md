# cardgame-art-briefs-wormhole-restrictions: Art briefs for the Wormhole Restrictions Set — the one shipped card file with zero briefs and no open proposal claiming it

## Header

- unit: cardgame-art-briefs-wormhole-restrictions
- title: Art briefs for the Wormhole Restrictions Set — the one shipped card file with zero briefs and no open proposal claiming it
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: 68694431e0ea69da2b56b7858ec990062922a80a
- end_sha: f0bee261ca1d7c2717625616b355b5137256807b

## Intent

design/cards/art-briefs.md (shipped) states its own purpose as giving one written art brief per card so illustration work can be approved before it starts (T8), and tools/composite-card-art.js's loadBriefs() drives its entire compositing loop off exactly that file's '###' sections — a card absent from art-briefs.md is permanently un-renderable. design/cards/wormhole-restrictions-set.md (shipped) added 5 named cards, one per race — Bastion Lockdown Line (Cindral Reach, 2 Mass), Conveyance Directive (Wrought Assembly, 2 Circuit), Rootbound Corridor (Mireth Bloom, 2 Bloom), Vector Interdiction (Panoptic Concord, 1 Signal), Pilgrim's Right of Way (Starweave Communion, 2 Tangle) — with no corresponding briefs ever written. This unit adds one new '###' brief section per card to art-briefs.md, following the identical Palette/Subject-Scene/Key-visual-elements/Composition template the file already uses for alpha-set.md and fount-economy-set.md, with each Palette line naming the single card-anatomy.md Fount-identity color matching the one Fount in that card's own Cost line (Ash-grey for Mass, Copper for Circuit, Green for Bloom, Cyan for Signal, Violet for Tangle), and each Key-visual-elements list drawing concretely on that card's own rules text and flavor text (e.g. Bastion Lockdown Line's one-way welded door, Conveyance Directive's one-way outward flow, Rootbound Corridor's growth taking root in a Wormhole, Vector Interdiction's manifest/route-writing, Pilgrim's Right of Way's rite of passage) rather than generic filler. It adds a new, independent test/design-art-briefs-wormhole-restrictions.test.js mirroring the assertion shape of the existing design-art-briefs tests, so it has zero touch-overlap with the two open art-briefs proposals or any in-flight unit, all of which edit different card files or the shared test file this unit avoids. No card file, rules.md, or the compositing/rendering code itself is touched — only art-briefs.md grows and a new test file is added.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/art-briefs.md gains exactly 5 new '###' sections, titled exactly 'Bastion Lockdown Line', 'Conveyance Directive', 'Rootbound Corridor', 'Vector Interdiction', and 'Pilgrim's Right of Way' verbatim, with no pre-existing brief section removed, renamed, or altered.
- AC2 [paraphrase]: Each new brief's Palette line names the single Fount-driven color from card-anatomy.md's Fount identity table matching the one Fount named in that card's own Cost line (Ash-grey for Mass, Copper for Circuit, Green for Bloom, Cyan for Signal, Violet for Tangle).
- AC3 [paraphrase]: Each new brief has a 'Key visual elements:' list of at least 2 bullets sharing at least 2 significant words with that card's own rules text or flavor text (not generic filler phrasing), and a 'Composition:' line naming the Art Window's rectangular/landscape shape and an aspect ratio.
- AC4 [inferred] (held_out): test/design-art-briefs-wormhole-restrictions.test.js exists and enforces the above against the real, current wormhole-restrictions-set.md and art-briefs.md content; every other card file and every pre-existing test file remain byte-identical to before this unit.

## Plan

GATE: none

# Plan: cardgame-art-briefs-wormhole-restrictions

## Summary

Append 5 new `###` art-brief sections to `design/cards/art-briefs.md` — one
each for the 5 cards in `design/cards/wormhole-restrictions-set.md` — and add
a new, independent test file `test/design-art-briefs-wormhole-restrictions.test.js`
that verifies them. No other file is touched. This mirrors the exact pattern
already used for `design-art-briefs-fount-economy.test.js` and
`design-art-briefs-character-signatures-wave-2.test.js` (both read, both
follow an identical structure).

Two files change:
1. `design/cards/art-briefs.md` — append only, at end of file.
2. `test/design-art-briefs-wormhole-restrictions.test.js` — new file.

Do not touch: any card file other than reading them, `design/rules.md`,
`tools/composite-card-art.js`, or any pre-existing test file.

## Background you need

- `design/cards/art-briefs.md` currently ends at line 629 (last section is
  `### Foreman-Prime Yssa Ductile, Keeper of the First Pattern` under
  `## Character Signatures, Wave 2`). Confirm this with `wc -l` or by reading
  the file before editing — if another in-flight unit has already appended
  something, append after whatever is actually last, don't overwrite it.
- Every existing brief follows this exact template (see any `###` section in
  the file for a live example):
  ```
  ### <Card Name verbatim>

  Palette: <Fount color> — <mood clause>.
  Subject/Scene: <one or two sentences>.
  Key visual elements:
  - <bullet 1>
  - <bullet 2>
  - <bullet 3>
  Composition: wide, landscape rectangle (~5:3), the large rectangular window
  beneath the Name Slot per card-anatomy.md — <framing note>.
  ```
- Fount → color mapping (from `design/cards/card-anatomy.md` lines 46-51,
  the "Fount identity" table): Mass → Ash-grey, Bloom → Green, Signal → Cyan,
  Circuit → Copper, Tangle → Violet.
- The 5 source cards, their Fount, and their color (from
  `design/cards/wormhole-restrictions-set.md`):
  | Card | Cost line | Fount | Color |
  |---|---|---|---|
  | Bastion Lockdown Line | 2 Mass | Mass | Ash-grey |
  | Conveyance Directive | 2 Circuit | Circuit | Copper |
  | Rootbound Corridor | 2 Bloom | Bloom | Green |
  | Vector Interdiction | 1 Signal | Signal | Cyan |
  | Pilgrim's Right of Way | 2 Tangle | Tangle | Violet |
- `tools/composite-card-art.js`'s `loadBriefs()` drives its compositing loop
  off `###` sections in this exact file — that's *why* AC1 requires the
  titles to match verbatim. You are not calling or modifying that file; just
  be aware why exact title matching matters.

## Step 1 — Append to `design/cards/art-briefs.md`

Open `design/cards/art-briefs.md`. Go to the very end of the file (after the
last line, currently line 629, `... receding symmetrically behind her.`).
Append exactly the following block (starting with a blank line, matching the
blank-line-then-`##` spacing already used between every other set's section
in the file):

```markdown

## Wormhole Restrictions Set — Locks on the Battlefield Graph

### Bastion Lockdown Line

Palette: Ash-grey — the Mass's industrial endurance, welding a passage shut
behind every convoy it sends out.
Subject/Scene: A Cindral Reach work crew welds a fresh Directional seal onto
one endpoint of a Wormhole anchored to a Planet they control, closing off
the reverse route for good.
Key visual elements:
- A welded, one-way door sealing shut at a Wormhole's endpoint, permitting travel only outward from the controlled Planet
- The reverse route shown visibly blocked, so nothing can travel back the way it came
- Ash-grey Materials plating and salvage-doctrine welding gear, the Cindral Reach's own hand at work
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — place the welded endpoint at the
frame's center with the sealed reverse route receding into shadow behind it.

### Conveyance Directive

Palette: Copper — the Circuit's warm mechanized repetition, sending
everything it makes outward and nothing back.
Subject/Scene: A Wrought Assembly conveyance directive, a Generator attuned
to the Circuit, produces a copper Circuit Point at its core while a
Directional seal locks one Wormhole endpoint to outbound-only travel.
Key visual elements:
- The Generator core producing a visible Circuit Point, the Circuit resource pool made tangible at its base
- A Wormhole endpoint sealed so travel runs only toward the far Planet, the reverse route visibly closed
- Repeating, modular Wrought Assembly conduit-work, the same one-way design copied without end
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — center the Generator core with
the sealed, outbound-only endpoint leading the eye toward the frame's edge.

### Rootbound Corridor

Palette: Green — the Bloom's patient growth, taking root in a passage that
was never planted ground to begin with.
Subject/Scene: A Mireth Bloom growth-mass takes root at a Wormhole's
endpoint, its living tendrils claiming the passage as this Planet's own the
instant its controller holds priority.
Key visual elements:
- Living root-growth visibly taking root at a Wormhole's endpoint, growth spreading rather than being built
- A Team claim shown as spreading biology sealing the passage against any opposing challenger's Assaults
- Cultivated ground beneath the growth, the Mireth Bloom's doctrine of harvesting what it becomes
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — root the growth-mass low in the
frame with the claimed Wormhole endpoint filling the width beneath it.

### Vector Interdiction

Palette: Cyan — the Signal's cool analytic watchfulness, writing a claim
onto the manifest before anyone else can contest it.
Subject/Scene: A Panoptic Concord cipher-device hovers at a Wormhole's
endpoint, its cyan sensor-light writing a Team claim onto the passage's
manifest the instant this resolves.
Key visual elements:
- A cyan analytic beam writing a claim directly onto a Wormhole's endpoint manifest, resolving in an instant rather than a sustained ritual
- An opposing challenger's Assault path shown stopping cold at the claimed endpoint, unable to count it as part of a route
- Panoptic Concord architecture — layered, watchful, data-cathedral in feel, the same Intelligence doctrine as its sibling ciphers
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — place the cipher device at the
Wormhole endpoint with the blocked Assault path fading into the frame's edge.

### Pilgrim's Right of Way

Palette: Violet — the Tangle's uncanny ritual mood, turned into a rite of
passage only the faithful may answer.
Subject/Scene: A Starweave Communion pilgrim kneels at a Wormhole's endpoint,
performing a rite of passage in violet ritual light as the Tangle itself is
petitioned to answer only to their claim.
Key visual elements:
- A rite of passage performed at a Wormhole's endpoint, violet ritual threads binding the crossing to the pilgrim's own Planet
- An opposing challenger's Assaults shown unable to count the claimed passage as part of their path, the Tangle forgetting their claim
- Starweave Communion ritual dress and posture, patient and deliberate rather than a flash of aggression
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — center the pilgrim at the
Wormhole endpoint with the violet rite-light framing the passage behind
them.
```

Notes on why this text satisfies the ACs (do not deviate from the wording
below without re-checking against these points):

- **AC1**: 5 new `###` sections, titled exactly `Bastion Lockdown Line`,
  `Conveyance Directive`, `Rootbound Corridor`, `Vector Interdiction`,
  `Pilgrim's Right of Way` (note the plain `'` apostrophe in `Pilgrim's`,
  matching the apostrophe used in `wormhole-restrictions-set.md` line 83 —
  do not substitute a curly `’`). Nothing before the appended block is
  altered.
- **AC2**: Palette lines name exactly `Ash-grey`, `Copper`, `Green`, `Cyan`,
  `Violet` respectively — the single Fount-driven color for each card's one
  Cost-line Fount.
- **AC3**: Each brief has a `Key visual elements:` list with 3 bullets (≥2
  required) and a `Composition:` line with `(~5:3)` (an aspect ratio) and the
  word "rectangle"/"landscape". None of the bullets use any of the banned
  generic-filler phrases (`dramatic lighting`, `epic composition`, `epic
  scene`, `stunning artwork`, `stunning visual`, `beautiful scene`, `amazing
  artwork`, `amazing visual`, `breathtaking`, `awe-inspiring` — see Step 2's
  test file for the authoritative list). Each brief's bullets share
  well over the required 2 significant words with that card's own Type
  line + Rules text in `wormhole-restrictions-set.md` (e.g. Bastion Lockdown
  Line's bullets reuse "wormhole", "endpoint", "travel", "only", "planet",
  "reverse" — all literal words from its own Rules text). This is checked
  word-for-word by the test in Step 2; if you reword any bullet, re-run the
  test rather than eyeballing it.

## Step 2 — Create `test/design-art-briefs-wormhole-restrictions.test.js`

Create this new file with the following exact content. It is a straight
adaptation of `test/design-art-briefs-fount-economy.test.js` (read that file
for comparison) — same helper functions, same `FOUNT_COLORS`/`GENERIC_FILLER`/
`STOPWORDS` constants, same three AC groups — retargeted at
`wormhole-restrictions-set.md` and its 5 cards instead of
`fount-economy-set.md` and its 6.

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');
const WORMHOLE_RESTRICTIONS_SET_PATH = path.join(__dirname, '..', 'design', 'cards', 'wormhole-restrictions-set.md');
const ANATOMY_PATH = path.join(__dirname, '..', 'design', 'cards', 'card-anatomy.md');

// AC4 (held_out) also requires that every other card file and the
// pre-existing art-briefs test files stay byte-identical to before this
// unit. That's a diff-time property, not something this test file can
// usefully assert on its own (a hardcoded hash here would be correct today
// and a guaranteed false alarm the moment any later unit legitimately
// touches a shared card-set file — see the identical note in
// test/design-art-briefs-fount-economy.test.js). It's verified by the
// orchestrator's diff at merge time instead.

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

const wormholeRestrictionsCards = listCardsFromFile(WORMHOLE_RESTRICTIONS_SET_PATH);
const cardsToCheck = wormholeRestrictionsCards.length
  ? wormholeRestrictionsCards
  : [{ title: '<no cards found — design/cards/wormhole-restrictions-set.md missing or empty>', body: '' }];

// ---------------------------------------------------------------------------
// AC1: design/cards/art-briefs.md gains exactly one brief section per
// wormhole-restrictions-set.md card, titled verbatim, with no pre-existing
// brief sections removed/renamed/altered (that last part is verified by the
// orchestrator's diff at merge time — see note above).
// ---------------------------------------------------------------------------

test('design/cards/art-briefs.md exists', () => {
  assert.ok(fs.existsSync(BRIEFS_PATH), `expected ${BRIEFS_PATH} to exist`);
});

test('AC1: wormhole-restrictions-set.md has exactly 5 cards (sanity check on fixture)', () => {
  assert.strictEqual(
    wormholeRestrictionsCards.length,
    5,
    `expected 5 cards in wormhole-restrictions-set.md, found ${wormholeRestrictionsCards.length}`
  );
});

test('AC1: all 5 wormhole-restrictions-set.md card titles are present verbatim in art-briefs.md as "###" sections', () => {
  const briefTitles = briefBriefsSections().map((s) => s.title);
  const expectedTitles = [
    'Bastion Lockdown Line',
    'Conveyance Directive',
    'Rootbound Corridor',
    'Vector Interdiction',
    "Pilgrim's Right of Way",
  ];
  const cardTitles = wormholeRestrictionsCards.map((c) => c.title);
  assert.deepStrictEqual(
    [...cardTitles].sort(),
    [...expectedTitles].sort(),
    `expected wormhole-restrictions-set.md's own card titles to be exactly ${JSON.stringify(expectedTitles)}, got ${JSON.stringify(cardTitles)}`
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

The only differences from `design-art-briefs-fount-economy.test.js` are:
the two `const ..._PATH` lines (retargeted at `wormhole-restrictions-set.md`),
the `wormholeRestrictionsCards`/`cardsToCheck` variable names, the "has
exactly 5 cards" sanity check (was 6), and the `expectedTitles` array (the 5
wormhole-restrictions card names instead of the 6 fount-economy ones). Do not
change `FOUNT_COLORS`, `GENERIC_FILLER`, `STOPWORDS`, or any helper function
— keep them byte-identical to the fount-economy version so the assertion
shape truly matches, per the unit's intent.

## Step 3 — Run the test suite

Run:
```
node --test
```
from the repo root.

Expected output: every existing `test/*.test.js` file still passes (nothing
else was touched), plus a new `design-art-briefs-wormhole-restrictions`
group with all tests passing — specifically:
- `design/cards/art-briefs.md exists` — pass
- `AC1: wormhole-restrictions-set.md has exactly 5 cards (sanity check on fixture)` — pass
- `AC1: all 5 wormhole-restrictions-set.md card titles are present verbatim in art-briefs.md as "###" sections` — pass
- 5× `AC1: "<title>" has exactly one matching brief section in art-briefs.md` — pass
- 5× `AC2: "<title>" brief names the correct Fount-driven palette color(s)` — pass
- `AC3: card-anatomy.md describes the Art Window as a rectangular shape (sanity check on fixture)` — pass
- 5× `AC3: "<title>" brief lists at least 2 concrete, card-specific visual elements` — pass
- 5× `AC3: "<title>" brief has a composition note referencing the Art Window's shape/aspect ratio` — pass

The final summary line should read `# fail 0` (some non-zero `# tests` count,
with `# pass` equal to `# tests` minus any pre-existing skips unrelated to
this unit). If any AC2/AC3 test fails, re-read the specific assertion
message — it names the exact word/color it expected and what it found — and
adjust the wording of that one brief in `art-briefs.md`, not the test.

## Explicitly out of scope (do not touch)

- `design/cards/alpha-set.md`, `frontier-set.md`, `character-signatures.md`,
  `character-signatures-wave-2.md`, `fount-economy-set.md`,
  `wormhole-closure-cards.md`, `spatial-race-identity-set.md`,
  `alt-art-briefs.md`, `card-anatomy.md`, `wormhole-restrictions-set.md`
  itself (read-only), `design/rules.md`.
- `tools/composite-card-art.js` or any other tool/rendering code.
- `test/design-art-briefs.test.js`, `test/design-art-briefs-fount-economy.test.js`,
  `test/design-art-briefs-character-signatures-wave-2.test.js`,
  `test/design-alt-art-briefs.test.js`, or `test/helpers/markdown.js`.
- Any pre-existing `###` section inside `art-briefs.md` — only append after
  the last existing section.

## Risk self-assessment (FIRE)

- **Reversibility**: fully reversible — plain markdown text addition and one
  new, independent test file; a `git revert` undoes it cleanly.
- **Security impact**: none — no code execution paths touched, no user
  input, no network/IO changes.
- **User data**: none — this is static design documentation for an
  in-development card game, no runtime data of any kind.
- **Schema changes**: none.

This is a small, low-risk, purely additive documentation + test unit.
GATE: none.


## Findings

# Blind Review — cardgame-art-briefs-wormhole-restrictions (cycle 1)

## AC accounting

### AC1 — 5 new `###` sections, titled verbatim, no pre-existing brief altered
Diff appends a single hunk at the end of `design/cards/art-briefs.md` (`@@ -626,3 +626,81 @@`), after the existing last line (`... receding symmetrically behind her.`). No other hunk touches the file, so no pre-existing section is removed, renamed, or altered.

Confirmed present in the built file, in order: `### Bastion Lockdown Line`, `### Conveyance Directive`, `### Rootbound Corridor`, `### Vector Interdiction`, `### Pilgrim's Right of Way` (line 692, plain `'` apostrophe — matches the apostrophe used in `design/cards/wormhole-restrictions-set.md` line 83). Exactly 5 new sections, titles verbatim. **AC1 satisfied.**

### AC2 — Palette line names the correct Fount-driven color
Checked each new brief's Cost-line Fount against its Palette line:
- Bastion Lockdown Line: `2 Mass` → Palette: Ash-grey ✓
- Conveyance Directive: `2 Circuit` → Palette: Copper ✓
- Rootbound Corridor: `2 Bloom` → Palette: Green ✓
- Vector Interdiction: `1 Signal` → Palette: Cyan ✓
- Pilgrim's Right of Way: `2 Tangle` → Palette: Violet ✓

All match the card-anatomy.md Fount-identity mapping stated in plan.md. **AC2 satisfied.**

### AC3 — ≥2 card-specific "Key visual elements" bullets + Composition line with shape/aspect ratio
For every one of the 5 briefs, at least 2 bullets under "Key visual elements:" draw concrete, card-specific language from that card's own rules/flavor text rather than generic filler, e.g.:
- Bastion Lockdown Line: "welded, one-way door... permitting travel only outward" ↔ rules text "permitting travel only from that Planet... never the reverse"; flavor "welds the door shut"
- Conveyance Directive: "Generator core producing a visible Circuit Point" ↔ rules text "Generator attuned to the Circuit... produces 1 Circuit Point"
- Rootbound Corridor: "Team claim shown as spreading biology... opposing challenger's Assaults" ↔ rules text "Team Restriction... opposing challenger's Assaults may not count it as part of a path"
- Vector Interdiction: "opposing challenger's Assault path shown stopping cold... unable to count it as part of a route" ↔ rules text, near-verbatim overlap
- Pilgrim's Right of Way: "rite of passage performed at a Wormhole's endpoint" ↔ flavor "calls this a rite of passage"

Every brief's Composition line reads "wide, landscape rectangle (~5:3), the large rectangular window beneath the Name Slot..." — names both the rectangular/landscape shape and a `5:3` aspect ratio. **AC3 satisfied.**

## Other diff contents (renders/, site/, test file)

The diff also adds `renders/cards-composited/*.svg`, `renders/cards-live/*.svg`, `site/_card-art/*.svg`, regenerates `site/design/cards/art-briefs.html` and `site/design/cards/wormhole-restrictions-set.html`, and adds `test/design-art-briefs-wormhole-restrictions.test.js`. This is broader than plan.md's "two files change" framing and the unit intent's "only art-briefs.md grows and a new test file is added" — but checking git history, this is the established, repo-wide pipeline convention for every prior art-briefs unit (`df5112b` fount-economy-set, `09b7dd9` character-signatures-wave-2, and the `cards-live`/mock-baseline split introduced in `7dc98a3`). The `cards-live`/`site/_card-art` SVGs all reference the identical placeholder `https://cdn.leonardo.ai/gen-1/image-0.png` — that's also the pre-existing convention (confirmed on an already-shipped card, `foreman-prime-yssa-ductile-...svg`), not something newly broken by this diff. **Classified PRE-EXISTING pattern, not gating.**

The new test file (`test/design-art-briefs-wormhole-restrictions.test.js`) mirrors the structure of sibling test files, asserts AC1/AC2/AC3 directly against the shipped fixtures, and explicitly documents (matching the sibling files' convention) that "no pre-existing brief altered" is verified at merge/diff time rather than by the test itself. Read through in full; logic is sound and consistent with the actual file contents (manually traced Fount-extraction and word-overlap logic against all 5 cards — no false negatives).

## Findings

None. No INTRODUCED defects found blocking merge.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T11:46:08.790Z] **bolt:start** — unit=cardgame-art-briefs-wormhole-restrictions start_sha=68694431e0ea69da2b56b7858ec990062922a80a branch=bolt/cardgame-art-briefs-wormhole-restrictions worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-art-briefs-wormhole-restrictions
- [2026-07-29T11:46:19.044Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T11:50:00.850Z] **plan:done** — plan.md written
- [2026-07-29T11:51:16.784Z] **tests:done** — RED verified on test/design-art-briefs-wormhole-restrictions.test.js (exit=1)
- [2026-07-29T11:54:10.227Z] **build:c1** — tests green, committed
- [2026-07-29T11:57:51.810Z] **review:c1** — APPROVE
- [2026-07-29T11:59:53.227Z] **review:devils-advocate** — APPROVE
- [2026-07-29T12:00:01.332Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T12:00:01.681Z] **merge:done** — auto-merged bolt/cardgame-art-briefs-wormhole-restrictions into master (worktree)


## Receipt

```json
{
  "start_sha": "68694431e0ea69da2b56b7858ec990062922a80a",
  "end_sha": "9a1414b781340b162b4319df39b6e637909869fd",
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
  "timestamp": "2026-07-29T12:00:01.330Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-art-briefs-wormhole-restrictions\\plan.md`.\n\nSummary: the plan has a junior append exactly 5 fully-written `###` brief sections (Palette/Subject-Scene/Key-visual-elements/Composition) to the end of `design/cards/art-briefs.md`, matching the existing template and each Palette color to the card's own Fount, then create `test/design-art-briefs-wormhole-restrictions.test.js` as a byte-level adaptation of `test/design-art-briefs-fount-economy.test.js` retargeted at the wormhole-restrictions set. No other files are touched; GATE: none (low-risk, purely additive doc + test change).",
    "test_writer": "The command needs your approval to run — could you approve `node --test` (or `node --test test/design-art-briefs-wormhole-restrictions.test.js`) so I can confirm the new tests fail RED as expected?",
    "builder_c1": "Full suite is green (817/817, 0 failures) and the working tree is clean. Done.\n\nSummary: appended the 5 new art-brief `###` sections to `design/cards/art-briefs.md` exactly as specified in the plan, then committed that change along with the generated render side-effects (`renders/cards-composited/`, `renders/cards-live/`, `site/_card-art/`, `site/design/cards/*.html`) — mirroring the established pattern from the fount-economy and character-signatures-wave-2 units, which is required for the `card-template-helper` (clean `design/`) and `leonardo-art-client` (renders match committed baseline) tests to pass.",
    "reviewer_c1": "All three visible ACs check out against the shipped diff: 5 verbatim `###` sections appended with no pre-existing brief touched (AC1), correct Fount→color palette lines for all 5 cards (AC2), and card-specific Key-visual-elements bullets plus a Composition line naming the rectangular/landscape shape and 5:3 ratio (AC3). The extra renders/site-HTML/asset files in the diff go beyond plan.md's stated \"two files change,\" but git history confirms this is the established, repo-wide convention every prior art-briefs unit follows (including the identical Leonardo placeholder URL), so it's pre-existing, not introduced. Findings written to `C:\\github\\AgentBox\\units\\cardgame-art-briefs-wormhole-restrictions\\findings.md`.\n\nAPPROVE",
    "devils_advocate": "APPROVE"
  }
}
```

## Comments

(no comments.md)
