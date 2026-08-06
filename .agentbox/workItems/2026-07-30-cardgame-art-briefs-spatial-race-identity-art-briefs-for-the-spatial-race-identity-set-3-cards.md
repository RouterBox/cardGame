# cardgame-art-briefs-spatial-race-identity: Art briefs for the Spatial Race Identity Set (3 cards)

## Header

- unit: cardgame-art-briefs-spatial-race-identity
- title: Art briefs for the Spatial Race Identity Set (3 cards)
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: 4c007175f52709f38d529a3d385b3f6674241bc7
- end_sha: c553db4da470f711157df20d337670fffd39d76a

## Intent

design/cards/art-briefs.md documents an art brief for every card in most shipped card sets, but design/cards/spatial-race-identity-set.md's 3 cards (Preemptive Survey — Panoptic Concord, Unbound Passage — Starweave Communion, Chokepoint Garrison — Cindral Reach) have none. DESIGN-READINESS.md's Open Gap 1 names this hole explicitly, and tools/composite-card-art.js already surfaces it live via its own 'no art brief for "<name>"' warning on every run. Add one brief per card, following the established format every prior art-briefs unit has used (Palette, Subject/Scene, Key visual elements, Composition), naming the Fount-driven palette color for each card's own Cost line (Signal→Cyan, Tangle→Violet, Mass→Ash-grey per card-anatomy.md's Fount identity table) and a Composition line citing the Art Window's rectangular/landscape shape and aspect ratio — so these 3 cards can go through the compositing pipeline like every other shipped card set.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/art-briefs.md contains exactly one '###' section titled verbatim 'Preemptive Survey', one titled 'Unbound Passage', and one titled 'Chokepoint Garrison' (the 3 card titles in design/cards/spatial-race-identity-set.md), with no pre-existing brief sections removed, renamed, or altered
- AC2 [paraphrase]: The 'Preemptive Survey' brief's Palette line names Cyan (Signal), the 'Unbound Passage' brief's Palette line names Violet (Tangle), and the 'Chokepoint Garrison' brief's Palette line names Ash-grey (Mass), matching each card's own Cost line per card-anatomy.md's Fount identity table
- AC3 [paraphrase] (held_out): Each of the 3 new briefs has a 'Key visual elements:' list of at least 2 bullets that share at least 2 significant words with that card's own Type line/Rules text, and none of the bullets use generic filler phrases like 'epic composition' or 'stunning artwork'
- AC4 [paraphrase]: Each of the 3 new briefs has a 'Composition:' line naming the Art Window's rectangular/landscape shape and an explicit aspect ratio (e.g. '5:3'), consistent with card-anatomy.md's Art Window description
- AC5 [inferred]: Running tools/composite-card-art.js in its default (mock) mode no longer prints 'no art brief for "Preemptive Survey"', 'no art brief for "Unbound Passage"', or 'no art brief for "Chokepoint Garrison"'

## Plan

GATE: none

# Plan: cardgame-art-briefs-spatial-race-identity

## Summary

`design/cards/art-briefs.md` is missing a brief for the 3 cards in
`design/cards/spatial-race-identity-set.md` (Preemptive Survey, Unbound
Passage, Chokepoint Garrison). This plan adds one `###` brief section per
card, in the established Palette / Subject/Scene / Key visual elements /
Composition format, and adds a new test file
`test/design-art-briefs-spatial-race-identity.test.js` that verifies AC1–AC4
for exactly these 3 cards, mirroring the pattern already used by
`test/design-art-briefs-wormhole-closure.test.js`. No other file needs to
change — `tools/composite-card-art.js` already reads `art-briefs.md` by
scanning `###` sections and matching on card name (see
`lib/parse-card-markdown.js`'s `splitIntoH3Sections`), so once the 3 new
sections exist with titles matching the card names verbatim, its
`no art brief for "<name>"` warning stops firing for them automatically
(AC5) — no code change needed there.

This is a small, single-bolt unit: 1 markdown append + 1 new test file.

## Risk self-assessment (FIRE matrix)

- **Reversibility:** fully reversible — plain markdown/test-file additions,
  trivially revertable via git. No deletions of existing content.
- **Security impact:** none — no code paths, no user input, no network/auth.
- **User data:** none — this is design-document content only.
- **Schema changes:** none.

Low risk, unambiguous scope → `GATE: none`.

## Held-out criteria check

AC3 (held_out — "Key visual elements" bullets share ≥2 significant words
with the card's own Type line/Rules text, no generic filler) is redundant
with AC1/AC2/AC4's visible intent (follow the established brief format,
which every prior art-briefs unit — see
`test/design-art-briefs-wormhole-closure.test.js` — has always required
card-specific, non-generic visual elements). It is novel only in its
specifics (which words, which card), not in a requirement stated nowhere
else. No spec bug to flag.

## Background: how the pieces fit together

- `design/cards/spatial-race-identity-set.md` has exactly 3 cards, titled
  (verbatim, these are the `###` headings):
  - `Preemptive Survey` — Cost line `1 Signal`, Type line `Intelligence`
  - `Unbound Passage` — Cost line `2 Tangle`, Type line `Magic`
  - `Chokepoint Garrison` — Cost line `2 Mass`, Type line
    `Materials — Permanent`
- `design/cards/card-anatomy.md`'s Fount identity table (around line 45-51):
  `Signal → Cyan`, `Tangle → Violet`, `Mass → Ash-grey`. Also (line 12) the
  Art Window is "the large rectangular window beneath the Name Slot".
- `design/cards/art-briefs.md` is a flat sequence of `##` set-divider
  headings each followed by one `###` section per card, in the format:
  ```
  ### <Card Name>

  Palette: <color> — <mood note>.
  Subject/Scene: <one paragraph>.
  Key visual elements:
  - <bullet>
  - <bullet>
  - <bullet>
  Composition: wide, landscape rectangle (~5:3), the large rectangular
  window beneath the Name Slot per card-anatomy.md — <framing note>.
  ```
  `tools/composite-card-art.js` (via `lib/parse-card-markdown.js`'s
  `splitIntoH3Sections`) only cares about `###`-level headings and their
  body text — `##` dividers are purely organizational and are ignored by
  the parser (it resets state on any non-`###` heading). So the new section
  can go under a new `## Spatial Race Identity Set — Wormholes as Race
  Identity` divider at the end of the file, matching the pattern every
  other set addition has used.
- **Regex constraints from the test suite (important — read before typing
  the briefs in):**
  - `Palette:\s*([^\n]+)` and `Composition:\s*([^\n]+)` in
    `test/design-art-briefs-*.test.js` only capture the **first physical
    line** after the label. So the Fount color word must be on the same
    line as `Palette:`, and the Composition line's first physical line must
    already contain both the aspect ratio (`5:3`) and the word
    "landscape"/"rectangle"/"rectangular" — exactly like every existing
    brief already does (`Composition: wide, landscape rectangle (~5:3), the
    large rectangular window` as the unbroken first line).
  - `Key visual elements:\s*\n((?:\s*-\s*.+\n?)+)` requires **every** bullet
    to be a single physical line starting with `-`. Do **not** hand-wrap a
    bullet across two lines (a wrapped continuation line without a leading
    `-` breaks the match). Every bullet in the existing file is already a
    single (sometimes long) line — follow that, not the wrapped prose style
    used for Subject/Scene.
  - Significant-word overlap (AC3) is computed by lowercasing, extracting
    tokens matching `[a-z][a-z'-]{3,}` (4+ chars) from the card's own Type
    line + Rules text, dropping a fixed stopword list (see
    `test/design-art-briefs-wormhole-closure.test.js` `STOPWORDS`, which
    includes `slow`, `fast`, `spent`, `counter`, `counters`, `resolves`,
    `when`, `your`, `that`, `until`, `controller`, etc.), and checking the
    bullets' words for at least 2 overlaps. **Watch out for possessives**:
    a source token like `wormhole's` (with the apostrophe) is a *different*
    token from `wormhole`. The briefs below deliberately use `Wormhole`
    plain in bullets (never `Wormhole's`) to match the plain-form
    occurrences that exist in each card's own rules text.

## Step 1 — Append 3 art briefs to `design/cards/art-briefs.md`

File: `design/cards/art-briefs.md`

The file currently ends (last section, at the very end of the file) with
the `### Chokepoint Demolition Charge` brief, whose last line is:

```
frame's edge.
```

Using the Edit tool, replace that unique trailing text:

- `old_string`:
  ```
  Composition: wide, landscape rectangle (~5:3), the large rectangular window
  beneath the Name Slot per card-anatomy.md — center the single pulse at
  the moment of detonation, the chokepoint's graph connection fading at the
  frame's edge.
  ```
- `new_string` (same text, plus the 3 new briefs appended after it):
  ```
  Composition: wide, landscape rectangle (~5:3), the large rectangular window
  beneath the Name Slot per card-anatomy.md — center the single pulse at
  the moment of detonation, the chokepoint's graph connection fading at the
  frame's edge.

  ## Spatial Race Identity Set — Wormholes as Race Identity

  ### Preemptive Survey

  Palette: Cyan — the Signal's cool analytic watchfulness, arriving before the Discovery it prices.
  Subject/Scene: A Panoptic Concord scout array angles toward an unclaimed system, its cyan sensor-light already tracing the ground a Discovery hasn't reached yet.
  Key visual elements:
  - A Discovery action just beginning at the frame's edge — unclaimed, unmapped space not yet reached
  - A ledger or meter of Fount Points shown marked down, cheaper than the Section 8.3 cost it would otherwise pay
  - Panoptic Concord scout architecture, cyan and watchful, reading the destination before the Fount is ever spent
  Composition: wide, landscape rectangle (~5:3), the large rectangular
  window beneath the Name Slot per card-anatomy.md — angle the scout array
  toward the unclaimed space so the eye leads outward, into the Discovery
  still to come.

  ### Unbound Passage

  Palette: Violet — the Tangle's uncanny ritual mood, unmaking a Restriction rather than fighting past it.
  Subject/Scene: A Starweave Communion ritualist stands at a Wormhole's mouth, violet threads dissolving the Directional and Team Restriction markers carved into the passage as an Assault begins to cross.
  Key visual elements:
  - A Wormhole shown with its Directional and Team Restriction markers visibly dissolving rather than breaking
  - An Assault already mid-crossing through the passage, its path unobstructed where the Restriction used to bar it
  - Violet ritual threads unwinding from the ritualist's hands toward the passage, patient rather than forceful
  Composition: wide, landscape rectangle (~5:3), the large rectangular
  window beneath the Name Slot per card-anatomy.md — center the Wormhole's
  mouth with the dissolving Restriction markers and the crossing Assault
  sharing the frame.

  ### Chokepoint Garrison

  Palette: Ash-grey — the Mass's industrial endurance, welded onto a passage rather than a wall.
  Subject/Scene: A Cindral Reach garrison crew welds a Fortification plate onto a Wormhole's endpoint at a Planet they control, the passage unable to undergo Closure while the plate holds.
  Key visual elements:
  - A Fortification plate being welded directly onto a Wormhole endpoint, ash-grey Materials work still sparking
  - The controlled Planet anchoring that endpoint shown at the frame's edge, the source of the garrison's claim
  - The passage's Closure visibly refused — a sealed, holding structure rather than a passage under threat
  Composition: wide, landscape rectangle (~5:3), the large rectangular
  window beneath the Name Slot per card-anatomy.md — keep the welded
  endpoint low and central with the controlled Planet anchoring one side of
  the frame.
  ```

Do not touch any other part of the file. Every pre-existing `###` section
must remain byte-identical.

## Step 2 — Add `test/design-art-briefs-spatial-race-identity.test.js`

Create this new file (it does not exist yet). It is a direct adaptation of
`test/design-art-briefs-wormhole-closure.test.js`, pointed at
`design/cards/spatial-race-identity-set.md` and its 3 cards instead of
`wormhole-closure-cards.md`'s 5:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');
const SPATIAL_RACE_IDENTITY_CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'spatial-race-identity-set.md');
const ANATOMY_PATH = path.join(__dirname, '..', 'design', 'cards', 'card-anatomy.md');

// AC1 also requires that every other card file and the pre-existing
// art-briefs test files stay byte-identical to before this unit. That's a
// diff-time property, not something this test file can usefully assert on
// its own — see the identical note in
// test/design-art-briefs-wormhole-closure.test.js. It's verified by the
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

const spatialRaceIdentityCards = listCardsFromFile(SPATIAL_RACE_IDENTITY_CARDS_PATH);
const cardsToCheck = spatialRaceIdentityCards.length
  ? spatialRaceIdentityCards
  : [{ title: '<no cards found — design/cards/spatial-race-identity-set.md missing or empty>', body: '' }];

// ---------------------------------------------------------------------------
// AC1: design/cards/art-briefs.md gains exactly one brief section per
// spatial-race-identity-set.md card, titled verbatim, with no pre-existing
// brief sections removed/renamed/altered (that last part is verified by the
// orchestrator's diff at merge time — see note above).
// ---------------------------------------------------------------------------

test('design/cards/art-briefs.md exists', () => {
  assert.ok(fs.existsSync(BRIEFS_PATH), `expected ${BRIEFS_PATH} to exist`);
});

test('AC1: spatial-race-identity-set.md has exactly 3 cards (sanity check on fixture)', () => {
  assert.strictEqual(
    spatialRaceIdentityCards.length,
    3,
    `expected 3 cards in spatial-race-identity-set.md, found ${spatialRaceIdentityCards.length}`
  );
});

test('AC1: all 3 spatial-race-identity-set.md card titles are present verbatim in art-briefs.md as "###" sections', () => {
  const briefTitles = briefBriefsSections().map((s) => s.title);
  const expectedTitles = ['Preemptive Survey', 'Unbound Passage', 'Chokepoint Garrison'];
  const cardTitles = spatialRaceIdentityCards.map((c) => c.title);
  assert.deepStrictEqual(
    [...cardTitles].sort(),
    [...expectedTitles].sort(),
    `expected spatial-race-identity-set.md's own card titles to be exactly ${JSON.stringify(expectedTitles)}, got ${JSON.stringify(cardTitles)}`
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
// AC2: each of the 3 new briefs' Palette line names the Fount-driven color
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

(AC5 — `tools/composite-card-art.js` no longer warning for these 3 names —
is already exercised generically by the existing
`test/composite-card-art.test.js` tests `AC1/AC3: cards with no matching
brief print a "no art brief for ..." warning...` and `AC1: a card with a
matching brief does not print a "no art brief for ..." warning for it`,
which recompute `uncoveredNames`/`coveredNames` dynamically from
`loadAllCards()` and the current `art-briefs.md` contents. Once the 3
briefs above exist, those 3 card names simply move from the "uncovered"
list to the "covered" list on the next run — no test file change needed
there. Do not add a redundant AC5-specific test; it would just duplicate
coverage that already exists and reacts automatically.)

## Step 3 — Verify

Run:

```
node --test
```

Expected output: all tests pass (exit code 0), with the new
`test/design-art-briefs-spatial-race-identity.test.js` file's tests showing
up in the results (3 cards × ~4 tests each, plus the 3 fixture/sanity
tests), and no regressions in `test/design-art-briefs.test.js`,
`test/design-art-briefs-wormhole-closure.test.js`,
`test/design-art-briefs-wormhole-restrictions.test.js`,
`test/design-art-briefs-fount-economy.test.js`,
`test/design-art-briefs-character-signatures-wave-2.test.js`,
`test/composite-card-art.test.js`, or
`test/build-site-card-art.test.js` (all of which read
`design/cards/art-briefs.md` and must still find every pre-existing brief
section untouched).

Specifically watch for:
- `test/composite-card-art.test.js`'s `AC1/AC3: cards with no matching
  brief print a "no art brief for ..." warning...` test asserting
  `uncoveredNames.length > 0` — this still passes after this change because
  `design/cards/spatial-race-identity-set-wave-2.md`'s 2 cards ("Bloom
  Fount", "Circuit Fount") remain uncovered by `art-briefs.md` (out of
  scope for this unit — do not add briefs for them).
- No pre-existing `###` section in `art-briefs.md` should differ from
  `git diff` other than the pure addition made in Step 1 — confirm with
  `git diff design/cards/art-briefs.md` that only new lines were added at
  the end of the file, nothing above it changed.

## Out of scope (do not do these)

- Do not add briefs for `design/cards/spatial-race-identity-set-wave-2.md`
  ("Bloom Fount", "Circuit Fount") — not named in this unit's acceptance
  criteria, and doing so would change `test/composite-card-art.test.js`'s
  uncovered-card assumption above.
- Do not edit `design/DESIGN-READINESS.md`'s "Open Gap 1" / coverage-count
  prose — it isn't named in the acceptance criteria, and per this
  project's "don't touch unrelated code" rule, updating a design-review
  narrative doc is a separate concern from closing the actual brief gap.
- Do not modify `tools/composite-card-art.js`, `lib/parse-card-markdown.js`,
  or any other existing test file — the coverage gap closes purely by
  adding matching `###` sections to `art-briefs.md`.


## Findings

# Blind Review — cardgame-art-briefs-spatial-race-identity (cycle 1)

## Method note
Test execution (`node --test`) required interactive approval unavailable in
this session, so verification was done statically: read the actual repo
files at HEAD (the diff is already committed on this branch), traced the
test file's regexes by hand against the real card source text, and
cross-checked cited facts (Fount→color table, Art Window description)
against `design/cards/card-anatomy.md`.

## AC-by-AC accounting

**AC1** — `design/cards/art-briefs.md` gains exactly one `###` section per
card, titled verbatim, no pre-existing content touched.
- Confirmed via `git show` on the commit: the diff is a pure append (44
  lines) after the prior file's last line ("frame's edge."); nothing above
  that line changed.
- Grepped the final file for `### (Preemptive Survey|Unbound
  Passage|Chokepoint Garrison)` — exactly one match each (lines 791, 804,
  817), no duplicates, no clash with pre-existing titles (e.g. the existing
  "Chokepoint Demolition Charge" is a distinct title from "Chokepoint
  Garrison").
- Verified `spatial-race-identity-set.md` has exactly these 3 card titles.
- **PASS.**

**AC2** — Palette line names the correct Fount-driven color per card.
- Read `design/cards/card-anatomy.md`'s Fount identity table directly:
  Mass → Ash-grey (line 47), Signal → Cyan (line 49), Tangle → Violet
  (line 51).
- Diff's Palette lines: Preemptive Survey → "Cyan" (Cost line: 1 Signal),
  Unbound Passage → "Violet" (Cost line: 2 Tangle), Chokepoint Garrison →
  "Ash-grey" (Cost line: 2 Mass). All three match.
- **PASS.**

**AC4** — Composition line cites the Art Window's rectangular/landscape
shape and an explicit aspect ratio.
- `card-anatomy.md` line 12 describes the Art Window as "the large
  rectangular window beneath the Name Slot" — the diff's Composition
  lines quote this near-verbatim ("wide, landscape rectangle (~5:3), the
  large rectangular window beneath the Name Slot per card-anatomy.md")
  for all 3 briefs, with the aspect ratio and shape words on the first
  physical line (matters for the test's `Composition:\s*([^\n]+)` regex,
  which only captures one line).
- **PASS.**

**AC5** — default (mock) `composite-card-art.js` run no longer warns "no
art brief" for these 3 cards.
- Read the tool's source: the warning fires per-card when
  `!baseBriefNames.has(card.name)`, where `baseBriefNames` comes from
  parsing `###` sections of `art-briefs.md` by exact name. Since AC1 adds
  sections titled exactly `Preemptive Survey`, `Unbound Passage`,
  `Chokepoint Garrison` (verbatim matches to the card names), the warning
  condition is now false for all 3.
- **PASS** (by construction/inspection; could not execute the tool to
  confirm empirically due to the sandbox's approval requirement on `node`
  invocations beyond `--version`).

## Other checks (not gating, but verified for diff health)

- The new test file `test/design-art-briefs-spatial-race-identity.test.js`
  also tests the held-out AC3 (bullets share ≥2 significant words with the
  card's own Type line/Rules text, no generic filler). Manually traced the
  regex extraction against the real `spatial-race-identity-set.md` body
  text (which is line-wrapped, not the single-line form the site HTML
  shows) for all 3 cards — each has 5-6 shared significant words (e.g.
  "discovery", "fount", "points" for Preemptive Survey; "wormhole",
  "restriction", "assault", "path" for Unbound Passage; "fortification",
  "wormhole", "endpoint", "closure" for Chokepoint Garrison), well above
  the ≥2 threshold, and no generic filler phrases appear. This test should
  pass.
- The diff also includes generated `renders/cards-composited/*.svg`,
  `site/_card-art/*.svg`, and updates to
  `site/design/cards/{art-briefs,spatial-race-identity-set}.html`, beyond
  what plan.md described ("1 markdown append + 1 new test file"). The
  commit message explains these are tool-regenerated output kept in sync
  so pre-existing idempotency-style tests (`test/build-site-card-art.test.js`,
  which calls the real `build-site.js` and diffs its output) stay green —
  this matches the repo's existing convention of checking in composited
  renders for every other shipped card (e.g. the pre-existing
  `line-fleet-trooper.svg` referenced by that same test). The SVG
  structure (viewBox, `data-fount`/`data-color` attributes, cost-pip
  markup) matches the established pattern from other committed renders.
  Because `build-site-card-art.test.js`'s AC1 check re-runs the build and
  compares freshly generated output to `renders/cards-composited/` (not to
  a frozen copy), even a stale hand-committed `site/` cache wouldn't fail
  that test — so this is not a correctness risk either way. No finding.
- No pre-existing brief, test, or card file was altered — confirmed via
  the isolated diff hunk for `art-briefs.md` and the fact that no other
  `design/cards/*.md` file appears in the diff.

## Findings

None. No INTRODUCED defects found; every visible AC (AC1, AC2, AC4, AC5)
is satisfied by direct inspection of the actual repo state, cross-checked
against the cited source-of-truth files (`card-anatomy.md`,
`spatial-race-identity-set.md`, `composite-card-art.js`).

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T09:34:29.782Z] **bolt:start** — unit=cardgame-art-briefs-spatial-race-identity start_sha=4c007175f52709f38d529a3d385b3f6674241bc7 branch=bolt/cardgame-art-briefs-spatial-race-identity worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-art-briefs-spatial-race-identity
- [2026-07-30T09:34:39.093Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T09:40:10.656Z] **plan:done** — plan.md written
- [2026-07-30T09:42:01.518Z] **tests:done** — RED verified on test/design-art-briefs-spatial-race-identity.test.js (exit=1)
- [2026-07-30T09:45:20.575Z] **build:c1** — tests green, committed
- [2026-07-30T09:49:26.248Z] **review:c1** — APPROVE
- [2026-07-30T09:54:41.825Z] **review:devils-advocate** — APPROVE
- [2026-07-30T09:54:51.071Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T09:54:51.498Z] **merge:done** — auto-merged bolt/cardgame-art-briefs-spatial-race-identity into master (worktree)


## Receipt

```json
{
  "start_sha": "4c007175f52709f38d529a3d385b3f6674241bc7",
  "end_sha": "33b77c768cbef31d42a413b70f1411ae5951d8fd",
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
  "timestamp": "2026-07-30T09:54:51.069Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-art-briefs-spatial-race-identity\\plan.md`.\n\nSummary: this is a small, low-risk unit (`GATE: none`) — append 3 art-brief `###` sections to `design/cards/art-briefs.md` (Preemptive Survey/Cyan, Unbound Passage/Violet, Chokepoint Garrison/Ash-grey) plus a new test file `test/design-art-briefs-spatial-race-identity.test.js` modeled directly on the existing `design-art-briefs-wormhole-closure.test.js` pattern. I verified against the actual regexes in the existing test suite (single-line bullets, first-line-only Palette/Composition capture, possessive-token pitfalls) and confirmed the AC5 warning-suppression behavior is already covered generically by `test/composite-card-art.test.js`, so no new code changes to `tools/composite-card-art.js` are needed.",
    "test_writer": "The Bash/PowerShell tools aren't approved for execution in this Test Writer session — that's consistent with this hat's role, since the harness runs the RED check itself after I finish. My work here is done regardless: I only needed to write the test file, not execute it.\n\nSummary of what was done:\n- Created `test/design-art-briefs-spatial-race-identity.test.js`, adapted from the existing `test/design-art-briefs-wormhole-closure.test.js` pattern, exactly per plan.md's Step 2.\n- It reads `design/cards/spatial-race-identity-set.md`'s 3 cards (Preemptive Survey, Unbound Passage, Chokepoint Garrison) and asserts against `design/cards/art-briefs.md`:\n  - AC1: exactly one matching `###` brief section per card title, verbatim.\n  - AC2: each brief's `Palette:` line names the correct Fount-driven color (Cyan/Violet/Ash-grey) per the card's own Cost line.\n  - AC3 (held-out): `Key visual elements:` bullets are card-specific (≥2 significant-word overlap with the card's own Type/Rules text, no generic filler).\n  - AC4: `Composition:` line names an aspect ratio and the Art Window's rectangular/landscape shape.\n- No `src/` files touched. No existing test files or design docs modified — `art-briefs.md` still has no briefs for these 3 cards, so this new file's AC1/AC2/AC4 tests will fail (as expected) until the implementer adds them; AC5 is already covered generically by the existing `composite-card-art.test.js` per the plan, so no new test was added for it.",
    "builder_c1": "All 923 tests pass. The 3 art briefs were added to `design/cards/art-briefs.md` per the plan, and the derived build outputs (composited SVGs, site HTML) that the existing tooling regenerated were committed alongside — matching the established pattern from the prior `wormhole-closure` unit's commit.",
    "reviewer_c1": "Findings written to `findings.md`. All four visible ACs (AC1, AC2, AC4, AC5) verified correct by direct inspection of the committed repo state against source-of-truth files (`card-anatomy.md`'s Fount table, the actual card markdown, and `composite-card-art.js`'s warning logic), plus the held-out AC3 test traced by hand and confirmed to pass. No pre-existing content altered; the extra generated render/site files are explained and consistent with existing repo convention. No INTRODUCED findings.\n\nAPPROVE",
    "devils_advocate": "I attacked this from several angles — file-path correctness for the new `<img>` tags, whether the mock-generated composited SVGs (with their sha256-derived hue values and base64 art payloads) actually correspond to what `tools/composite-card-art.js` would produce from the committed brief text, whether the AC1 \"exactly one section, verbatim title\" test would pass given `parseSections`' heading-boundary semantics, whether the AC2 Fount→Palette-color mapping and AC4 Composition/aspect-ratio regexes actually match the new brief text, and whether leaving `design/DESIGN-READINESS.md`'s \"8-card hole\" / Open Gap 1 claim un-updated is a defect this diff introduces.\n\nFindings:\n- Art Window `<image>` bounds (`x=24 y=94 width=702 height=420`) match every other composited card in the repo — consistent, no defect.\n- All three briefs' Palette lines correctly cite the Fount-driven color matching each card's own Cost line (Signal→Cyan, Tangle→Violet, Mass→Ash-grey), and Composition lines all carry both an aspect ratio (`~5:3`) and rectangular/landscape wording — satisfies AC2/AC4 as authored.\n- `site/_card-art/*.svg` are byte-identical to `renders/cards-composited/*.svg` per card, matching the established build-site copy contract.\n- The one plausible attack — that this diff should have updated `design/DESIGN-READINESS.md`'s \"Known gap... 8-card hole\" claim, since closing part of that named gap is literally the diff's stated motivation — does not hold up as *introduced*. I checked precedent: commit `fd0a7fc` (`cardgame-art-briefs-wormhole-closure`), an already-merged unit that closed the other half of that exact same named gap, also left `DESIGN-READINESS.md` untouched and was approved. The doc was already stale before this diff for the wormhole-closure component; this diff continues that established (and previously accepted) precedent rather than introducing a new inconsistency.\n- I could not execute `node --test` or any script in this sandbox (blocked by permission, consistent with"
  }
}
```

## Comments

(no comments.md)
