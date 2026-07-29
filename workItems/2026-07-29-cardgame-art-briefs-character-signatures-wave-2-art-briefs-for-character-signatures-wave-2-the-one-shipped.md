# cardgame-art-briefs-character-signatures-wave-2: Art briefs for Character Signatures Wave 2 — the one shipped card file the open art-briefs proposal doesn't reach

## Header

- unit: cardgame-art-briefs-character-signatures-wave-2
- title: Art briefs for Character Signatures Wave 2 — the one shipped card file the open art-briefs proposal doesn't reach
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: d7c27b9d85a6f2ba1af121d176aac0c094f9a359
- end_sha: 3a03805df8de39f47db796fcb62a0ce344843de1

## Intent

design/cards/art-briefs.md states its own purpose as giving one written art brief per card so illustration work can be approved before it starts (T8), but character-signatures-wave-2.md (shipped, one named card per race built from a design/characters/ entry) has never had briefs written for it, leaving its 5 cards with no path through tools/composite-card-art.js's brief-driven compositing loop. This unit adds one new '###' brief section per wave-2 card to art-briefs.md, using the identical Palette/Subject-Scene/Key-visual-elements/Composition template already established for alpha-set.md and fount-economy-set.md, with each Palette line naming the card-anatomy.md Fount-identity color matching the single Fount in that card's own Cost line, and each Key-visual-elements list drawing concretely on that card's own Rules text and flavor text (e.g. Torel Ashgrave's uniform Ember Vanguard hulls, Rathe Ossuary-Kin's Growth counters, Doran Vex Amaranthine's Archive-reading, Ysolde Thane's Unwritten Sign, Foreman-Prime Yssa Ductile's singular reproduced pattern) rather than generic filler. It adds a new, independent test/design-art-briefs-character-signatures-wave-2.test.js mirroring the assertion shape of the existing design-art-briefs tests, so it has zero touch-overlap with the in-flight frontier-signatures unit or the open fount-economy-art-briefs proposal, both of which edit different files. No card file, rules.md, or the compositing/rendering code itself is touched — only art-briefs.md grows and a new test file is added.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/art-briefs.md gains exactly 5 new '###' sections, titled exactly 'Torel Ashgrave, Line-Captain of the Ember Vanguard', 'Rathe Ossuary-Kin, Spore-Hound of the Sprawl', 'Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive', 'Ysolde Thane, Pilgrim of the Unwritten Sign', and 'Foreman-Prime Yssa Ductile, Keeper of the First Pattern' verbatim, with no pre-existing brief section removed, renamed, or altered.
- AC2 [paraphrase]: Each new brief's Palette line names the single Fount-driven color from card-anatomy.md's Fount identity table matching the Fount named in that card's own Cost line (Ash-grey for Mass, Green for Bloom, Cyan for Signal, Violet for Tangle, Copper for Circuit).
- AC3 [paraphrase]: Each new brief has a 'Key visual elements:' list of at least 2 bullets sharing at least 2 significant words with that card's own Rules text or flavor text (not generic filler phrasing), and a 'Composition:' line naming the Art Window's rectangular/landscape shape and an aspect ratio.
- AC4 [inferred] (held_out): test/design-art-briefs-character-signatures-wave-2.test.js exists and enforces the above against the real, current character-signatures-wave-2.md and art-briefs.md content; every other card file and the pre-existing art-briefs test files remain byte-identical to before this unit.

## Plan

# Plan: cardgame-art-briefs-character-signatures-wave-2

GATE: none

## Risk self-assessment (FIRE)

- **Reversibility:** trivial. Both changes are pure additions — new markdown
  content appended to the end of `design/cards/art-briefs.md`, and one new
  test file. A revert is a single `git checkout` / file delete.
- **Impact:** none. No executable/runtime/compositing code is touched.
  `design/cards/art-briefs.md` is prose read only by
  `tools/composite-card-art.js`'s `loadBriefs()`, which just scans `###`
  headings/bodies — this unit adds new headings of the same shape it already
  understands, it doesn't change the parser or any schema.
- **User data:** none involved.
- **Overlap with in-flight/other units:** none. This unit only touches
  `design/cards/art-briefs.md` (append-only) and adds a new test file. It
  does not touch `design/cards/character-signatures-wave-2.md` (read-only
  source), `design/cards/card-anatomy.md` (read-only source), or
  `test/design-art-briefs.test.js` / `test/design-art-briefs-fount-economy.test.js`
  (pre-existing tests, untouched). This mirrors the pattern already used by
  the merged `cardgame-art-briefs-fount-economy` unit.
- Overall: low risk, mechanical, single bolt. No split needed.

## Held-out criteria note

AC4 (held_out) requires a new test file enforcing AC1–3 against the real
`character-signatures-wave-2.md`/`art-briefs.md` content, plus that every
other card file and the pre-existing art-briefs test files stay
byte-identical to before this unit. That byte-identical property is a
diff-time property, not something a test file itself can usefully assert
(see the comment already living at the top of
`test/design-art-briefs-fount-economy.test.js`, added after the earlier
`cardgame-art-briefs-fount-economy` unit's held-out AC originally tried to
pin unrelated files by hardcoded SHA-256 hash and got escalated over it — a
hash pinned "correct today" becomes a guaranteed false alarm the moment any
later unit legitimately touches a shared card-set file). **Do not add
hash-pinning of other files to the new test.** Follow the fount-economy
test's resolution: the new test enforces AC1–3 against the real files, and
notes in a comment that the "byte-identical elsewhere" property is verified
by the orchestrator's diff at merge time, not by this test. This is not a
spec bug — it's the same non-novel requirement the fount-economy unit
already worked out.

## Background — what exists today

- `design/cards/art-briefs.md` gives one `###` brief (Palette / Subject-Scene
  / Key visual elements / Composition) per card across several card files
  (alpha-set.md, frontier-set.md, character-signatures.md, fount-economy-set.md).
  It has **no** briefs for `design/cards/character-signatures-wave-2.md`'s 5
  cards today (confirmed: no "Torel Ashgrave", "Rathe Ossuary-Kin", etc.
  headings currently in the file, which ends at line 549 with the
  "Stamped Chassis Unit" brief under the "## Fount Economy Set" section).
- `design/cards/character-signatures-wave-2.md` has exactly 5 `###` cards,
  quoted in full below (read verbatim from the repo — do not re-derive from
  memory when implementing):

  1. `### Torel Ashgrave, Line-Captain of the Ember Vanguard`
     Cost line: `2 Mass` · Type line: `Materials — Permanent`
     Rules text: `Slow. This permanent is a Unit. This Unit's combat
     strength is increased by 1 for each other Materials Unit you control.`
     Flavor: *"Torel Ashgrave believes uniformity is a weapon The Cindral
     Reach has never used hard enough — and every identical hull in the
     Ember Vanguard is her proof."*

  2. `### Rathe Ossuary-Kin, Spore-Hound of the Sprawl`
     Cost line: `3 Bloom` · Type line: `Biology — Permanent`
     Rules text: `Slow. This permanent is a Unit. Whenever this Unit is
     dealt damage, place a Growth counter on it.`
     Flavor: *"Rathe Ossuary-Kin has survived encounters that should have
     ended the hunt outright, and The Mireth Bloom simply grows quieter,
     and stranger, around whatever tries to put it down."*

  3. `### Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive`
     Cost line: `2 Signal` · Type line: `Intelligence`
     Rules text: `Fast. When this resolves, look at the top card of an
     opponent's Archive; then put it back.`
     Flavor: *"Doran Vex Amaranthine keeps The Panoptic Concord's oldest
     conviction alive: that anything which will happen has already left a
     trace of itself, for whoever is patient enough to read it first."*

  4. `### Ysolde Thane, Pilgrim of the Unwritten Sign`
     Cost line: `2 Tangle` · Type line: `Magic`
     Rules text: `Fast. When this resolves, look at the top card of your
     Archive; you may put it into your Hand instead of leaving it on top.`
     Flavor: *"Ysolde Thane reads the Unwritten Clause the way The
     Starweave Communion always has: as proof the Tangle can still be
     renegotiated, if you find the moment it left open."*

  5. `### Foreman-Prime Yssa Ductile, Keeper of the First Pattern`
     Cost line: `4 Circuit` · Type line: `Technology — Permanent`
     Rules text: `Slow. This permanent is a Generator attuned to the
     Circuit: during the Generation Phase, it produces 1 Circuit Point,
     added to its controller's Circuit resource pool.`
     Flavor: *"Foreman-Prime Yssa Ductile holds the actual, singular design
     every unit in The Wrought Assembly is copied from — not a description
     of perfection, but perfection itself, endlessly reproduced."*

- `design/cards/card-anatomy.md`'s Fount identity table (do not touch this
  file, just cite it):

  | Fount | Frame/Border color |
  |---|---|
  | The Mass (materials) | Ash-grey |
  | The Bloom (biology) | Green |
  | The Signal (intelligence) | Cyan |
  | The Circuit (technology) | Copper |
  | The Tangle (magic) | Violet |

  So: Torel (2 Mass) → Ash-grey. Rathe (3 Bloom) → Green. Doran (2 Signal) →
  Cyan. Ysolde (2 Tangle) → Violet. Foreman-Prime (4 Circuit) → Copper.

- `lib/parse-card-markdown.js`'s `loadAllCards()` reads every `.md` file in
  `design/cards/` and only counts a `###` section as a "card" if it has
  `Cost line:`/`Type line:`/`Rules text:` fields. `character-signatures-wave-2.md`'s
  5 sections all have these fields, so once this unit's briefs are added,
  `test/design-art-briefs.test.js`'s "every brief section names a real card
  somewhere in design/cards/*.md" check (line ~124-131 of that file) will
  continue to pass — it already tolerates `art-briefs.md` having more brief
  sections than its own 3-file `cardsToCheck` list covers, and the 5 new
  titles will resolve to real cards via `loadAllCards()`. **No change to
  that file is needed or wanted.**

## Step 1 — Append 5 new brief sections to `design/cards/art-briefs.md`

File: `design/cards/art-briefs.md` (append-only; do not touch any existing
line 1–549).

The file currently ends at line 549 with:

```
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep the chassis unit and the
permanent it's fortifying close together in the frame, with the assembly
line receding behind them.
```

Append exactly the following block after that (one blank line, then a new
`##` section, matching the file's existing style of grouping briefs under a
`##` heading per set):

```markdown

## Character Signatures, Wave 2

### Torel Ashgrave, Line-Captain of the Ember Vanguard

Palette: Ash-grey — the Mass's industrial endurance, worn identically down
the whole line.
Subject/Scene: Torel Ashgrave, Line-Captain of the Ember Vanguard, stands
at the head of a formation of identical Materials Unit hulls, her own
combat strength visibly drawn from how many stand behind her.
Key visual elements:
- Torel Ashgrave herself, a named Cindral Reach Line-Captain in ash-grey Materials plating, not a generic Unit
- A visible rank of other identical Materials Unit hulls she controls, each uniform hull explaining why her combat strength is increased
- No individual flourish anywhere in the formation — uniformity itself is the point, per her own conviction
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — place Torel at the head of the
formation with the identical hulls receding behind her to fill the frame.

### Rathe Ossuary-Kin, Spore-Hound of the Sprawl

Palette: Green — the Bloom's patient growth, thickening the longer
something tries to kill it.
Subject/Scene: Rathe Ossuary-Kin, Spore-Hound of the Sprawl, stands scarred
and unbothered at the center of the Mireth Bloom's Sprawl, a fresh Growth
counter blooming on his Biology Unit form the instant a wound lands.
Key visual elements:
- Rathe Ossuary-Kin himself, a named Mireth Bloom Biology Unit fused with spore-mass, not a generic creature
- A visible Growth counter shown taking root on his form at the exact moment damage is dealt to him, the wound feeding rather than harming
- A quiet, unhurried stillness in his stance, stranger and calmer with every scar the Sprawl gives him
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep Rathe low and central with
the new Growth counter catching the light at the point of impact.

### Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive

Palette: Cyan — the Signal's cool analytic watchfulness, reading what's
already left a trace.
Subject/Scene: Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge
Archive, leans over an opponent's Archive, reading the top card in cyan
light before setting it back exactly as he found it.
Key visual elements:
- Doran Vex Amaranthine himself, a named Panoptic Concord Intelligence figure in archive-keeper's dress, not a generic reader
- An opponent's Archive shown mid-read, its top card lit and legible before being placed back untouched
- A patient, unhurried reading posture — the working is quiet observation, not a strike, true to his own conviction that the trace was already there to find
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep Doran close over the
Archive with the opponent's pile lit at the frame's center.

### Ysolde Thane, Pilgrim of the Unwritten Sign

Palette: Violet — the Tangle's uncanny ritual mood, here turned toward
finding what's still open.
Subject/Scene: Ysolde Thane, Pilgrim of the Unwritten Sign, kneels at the
edge of her own Archive, a violet Magic working lifting its top card into
view as she decides whether to carry it into her Hand or leave it exactly
where it lies.
Key visual elements:
- Ysolde Thane herself, a named Starweave Communion Magic pilgrim reading the Unwritten Sign, not a generic caster
- The top card of her own Archive suspended in violet light, visibly a moment of choice between her Hand and leaving it in place
- A tentative, searching posture — the working reads as renegotiation, patient rather than certain of the outcome
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — center Ysolde over her own
Archive with the suspended card lit at the frame's midpoint.

### Foreman-Prime Yssa Ductile, Keeper of the First Pattern

Palette: Copper — the Circuit's warm mechanized repetition, drawn from the
one true design.
Subject/Scene: Foreman-Prime Yssa Ductile, Keeper of the First Pattern,
stands at the Generator core she keeps, its copper Circuit Point flowing
into the Wrought Assembly's resource pool as the exact pattern every other
Technology unit is stamped from.
Key visual elements:
- Foreman-Prime Yssa Ductile herself, a named Wrought Assembly Technology figure guarding the singular First Pattern, not a generic overseer
- The Generator core she attends producing a visible Circuit Point, the resource pool made tangible at her feet
- Rows of Technology units in the distance, each an exact copy of the one pattern she alone keeps, reinforcing that hers is the singular original
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — place Yssa and the Generator
core center-frame with the reproduced units receding symmetrically behind
her.
```

Notes for whoever implements this:

- Use the `Edit` tool with `old_string` = the last few lines of the current
  file (the "Composition: ... receding behind them." block quoted above,
  including its trailing content up to end-of-file) and `new_string` =
  that same text plus the new block appended after it. Do not use `Write`
  to replace the whole file — the file is long and a targeted append is
  safer.
- Every new `###` title must be byte-for-byte identical to the heading in
  `character-signatures-wave-2.md` (AC1). Copy-paste, don't retype.
- Every `Palette:` line's color must literally contain the word
  "Ash-grey"/"Green"/"Cyan"/"Violet"/"Copper" as spelled in
  `card-anatomy.md`'s table (capital first letter, hyphen in "Ash-grey").
- Every `Composition:` line must contain both an aspect ratio in `N:N` form
  (used `5:3` to match every other brief in the file) and one of
  "rectangular"/"rectangle"/"landscape".
- Every `Key visual elements:` list needs ≥2 `- ` bullets, and the bullets
  as a whole must share ≥2 words (4+ letters, case-insensitive) with that
  card's own `Type line:`/`Rules text:` — verified word overlaps per card
  (words that will match, ignoring the test's stopword list of generic
  terms like "unit's"/"permanent"/"slow"/"fast"/"combat"/"counter"/etc.):
  - Torel Ashgrave: `materials`, `unit` both appear in the rules/type text
    and in the drafted bullets above.
  - Rathe Ossuary-Kin: `biology`, `unit`, `growth`, `dealt`.
  - Doran Vex Amaranthine: `intelligence`, `archive`, `opponent's`.
  - Ysolde Thane: `magic`, `archive`, `hand`, `leaving`.
  - Foreman-Prime Yssa Ductile: `technology`, `generator`, `circuit`.
- Avoid the test's banned generic-filler phrases (already avoided above):
  "dramatic lighting", "epic composition", "epic scene", "stunning
  artwork", "stunning visual", "beautiful scene", "amazing artwork",
  "amazing visual", "breathtaking", "awe-inspiring".

## Step 2 — Add `test/design-art-briefs-character-signatures-wave-2.test.js`

Create this file with the exact content below. It mirrors
`test/design-art-briefs-fount-economy.test.js`'s structure/assertion shape,
pointed at `character-signatures-wave-2.md` instead of
`fount-economy-set.md`, with its own hardcoded list of the 5 expected
titles.

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');
const CHARACTER_SIGNATURES_WAVE_2_PATH = path.join(__dirname, '..', 'design', 'cards', 'character-signatures-wave-2.md');
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

const wave2Cards = listCardsFromFile(CHARACTER_SIGNATURES_WAVE_2_PATH);
const cardsToCheck = wave2Cards.length
  ? wave2Cards
  : [{ title: '<no cards found — design/cards/character-signatures-wave-2.md missing or empty>', body: '' }];

// ---------------------------------------------------------------------------
// AC1: design/cards/art-briefs.md gains exactly one brief section per
// character-signatures-wave-2.md card, titled verbatim, with no pre-existing
// brief sections removed/renamed/altered (that last part is verified by the
// orchestrator's diff at merge time — see note above).
// ---------------------------------------------------------------------------

test('design/cards/art-briefs.md exists', () => {
  assert.ok(fs.existsSync(BRIEFS_PATH), `expected ${BRIEFS_PATH} to exist`);
});

test('AC1: character-signatures-wave-2.md has exactly 5 cards (sanity check on fixture)', () => {
  assert.strictEqual(
    wave2Cards.length,
    5,
    `expected 5 cards in character-signatures-wave-2.md, found ${wave2Cards.length}`
  );
});

test('AC1: all 5 character-signatures-wave-2.md card titles are present verbatim in art-briefs.md as "###" sections', () => {
  const briefTitles = briefBriefsSections().map((s) => s.title);
  const expectedTitles = [
    'Torel Ashgrave, Line-Captain of the Ember Vanguard',
    'Rathe Ossuary-Kin, Spore-Hound of the Sprawl',
    'Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive',
    'Ysolde Thane, Pilgrim of the Unwritten Sign',
    'Foreman-Prime Yssa Ductile, Keeper of the First Pattern',
  ];
  const cardTitles = wave2Cards.map((c) => c.title);
  assert.deepStrictEqual(
    [...cardTitles].sort(),
    [...expectedTitles].sort(),
    `expected character-signatures-wave-2.md's own card titles to be exactly ${JSON.stringify(expectedTitles)}, got ${JSON.stringify(cardTitles)}`
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

Note: `test/helpers/markdown.js` (used above via `require('./helpers/markdown')`)
already exists and is shared by every other `design-art-briefs*.test.js`
file — do not create or modify it.

## Files touched (summary)

- `design/cards/art-briefs.md` — append 5 new `###` sections under one new
  `## Character Signatures, Wave 2` heading. No existing line altered.
- `test/design-art-briefs-character-signatures-wave-2.test.js` — new file,
  full content given above.
- Nothing else. Not touched: `design/cards/character-signatures-wave-2.md`,
  `design/cards/card-anatomy.md`, any other `design/cards/*.md` file,
  `design/rules.md`, `tools/composite-card-art.js`,
  `test/design-art-briefs.test.js`, `test/design-art-briefs-fount-economy.test.js`,
  `lib/parse-card-markdown.js`.

## Expected test output

Run: `node --test`

Expected: all suites pass, including the new
`test/design-art-briefs-character-signatures-wave-2.test.js` (1 file-exists
test + 1 fixture sanity test + 1 title-presence test + 5×"exactly one
matching brief section" + 5×AC2 palette tests + 1 AC3 anatomy sanity test +
5×AC3 visual-elements tests + 5×AC3 composition tests = 23 tests, all
passing), plus the pre-existing `test/design-art-briefs.test.js` and
`test/design-art-briefs-fount-economy.test.js` suites continuing to pass
unchanged (their "every brief section names a real card" check passes
because `character-signatures-wave-2.md`'s 5 cards are already visible to
`loadAllCards()`, independent of this unit). No test file should report
failures; `node --test`'s summary line should read `# fail 0`.

## Manual sanity check before calling this done

After Step 1, re-open `design/cards/art-briefs.md` and confirm:

- The file still starts with `# Alpha Set — Art Briefs` and every section
  before `## Character Signatures, Wave 2` is untouched.
- Exactly 5 new `###` headings exist, matching
  `character-signatures-wave-2.md`'s 5 headings byte-for-byte.
- No trailing-whitespace or blank-line inconsistencies relative to the
  file's existing style (one blank line between the end of one brief's
  `Composition:` paragraph and the next `###`/`##` heading).


## Findings

# Blind Review — cardgame-art-briefs-character-signatures-wave-2 (cycle 1)

## AC-by-AC verification

**AC1** — `design/cards/art-briefs.md` gains exactly 5 new `###` sections, titled verbatim, no pre-existing section touched.
Verified: diff is a pure append after line 549 (`@@ -546,3 +546,83 @@`), no existing line removed or altered. The 5 new headings match the required titles character-for-character:
`Torel Ashgrave, Line-Captain of the Ember Vanguard`, `Rathe Ossuary-Kin, Spore-Hound of the Sprawl`, `Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive`, `Ysolde Thane, Pilgrim of the Unwritten Sign`, `Foreman-Prime Yssa Ductile, Keeper of the First Pattern`. **PASS.**

**AC2** — Each brief's Palette line names the Fount-driven color matching the card's own Cost line, per `card-anatomy.md`'s Fount identity table.
Checked `design/cards/card-anatomy.md` directly (lines 47-51: Mass→Ash-grey, Bloom→Green, Signal→Cyan, Circuit→Copper, Tangle→Violet) against each new brief and each card's real Cost line in `character-signatures-wave-2.md`:
Torel (2 Mass)→"Palette: Ash-grey", Rathe (3 Bloom)→"Palette: Green", Doran (2 Signal)→"Palette: Cyan", Ysolde (2 Tangle)→"Palette: Violet", Foreman-Prime (4 Circuit)→"Palette: Copper". All correct. **PASS.**

**AC3** — Each brief has ≥2 "Key visual elements" bullets sharing ≥2 significant words with the card's own Rules/flavor text (not generic filler), plus a Composition line naming a rectangular/landscape shape and aspect ratio.
Hand-verified word overlap per card against each card's real Rules text (from `character-signatures-wave-2.md`), e.g. Torel: "Materials", "Unit", "increased" recur in the bullets; Rathe: "Biology", "Unit", "Growth", "dealt"; Doran: "Intelligence", "Archive", "opponent", "back"; Ysolde: "Magic", "Archive", "Hand", "leaving"; Foreman-Prime: "Technology", "Generator", "Circuit", "point", "resource", "pool". None of the `GENERIC_FILLER` phrases appear. Every brief's Composition line reads "wide, landscape rectangle (~5:3)..." — shape + ratio present. **PASS.**

## Test file review (`test/design-art-briefs-character-signatures-wave-2.test.js`)

- Reads the real `art-briefs.md`, `character-signatures-wave-2.md`, `card-anatomy.md` at import time (no fixtures/mocks) — genuinely checks the shipped content, not a tautology.
- Correctly follows the fount-economy precedent for the AC4 held-out note (byte-identical-elsewhere is a diff-time property, not hash-pinned) — matches the plan's stated approach and avoids the earlier escalation this repo already learned from.
- Minor imprecision (non-blocking): the `rulesMatch` regex (`Rules text:\s*([^\n]+(?:\n(?!\*)[^\n]+)*)`) doesn't stop at a `Stats/counters line:` line, so for Torel/Rathe (which have that line) it gets folded into the "source text" used for AC3's word-overlap check. This only makes the check slightly more permissive, and doesn't change the pass/fail outcome for any of the 5 cards — I hand-verified genuine overlap with Rules text/Type line alone for all 5. Not gating.
- Manually traced the `STOPWORDS`/`significantWords` logic (stopwords include "combat", "strength", "damage", "counter(s)" — a real filter, not gameable by reusing rules-text boilerplate) against all 5 briefs; every card still clears the ≥2-word-overlap bar via genuinely concrete, card-specific words (e.g. "Growth", "Archive", "Circuit", "Generator", "pool"). Could not execute `node --test` directly in this sandbox (command required interactive approval that wasn't available), so this is a careful manual trace rather than an executed run — I'm confident in it given the regex/stopword logic is fully legible.

## Scope note (non-gating)

The diff is larger than plan.md's FIRE risk assessment describes ("this unit only touches `design/cards/art-briefs.md` (append-only) and adds a new test file"). The actual diff also adds 5 files each under `renders/cards-composited/`, `renders/cards-live/`, and `site/_card-art/`, plus edits to `site/design/cards/art-briefs.html` and `site/design/cards/character-signatures-wave-2.html` (adding `<img>` tags + matching prose, and running the brief-driven compositing pass this unit's intent describes as the point of writing the briefs).

I checked whether this is a new/risky pattern or consistent with the rest of the repo: `renders/cards-live/*.svg` for these 5 new cards uses `href="https://cdn.leonardo.ai/gen-1/image-0.png"` — but grepping the pre-existing `renders/cards-live/` directory shows this exact same placeholder URL is already used by dozens of other already-shipped cards (bastion-reclamation-crew, drone-cascade, stamped-chassis-unit, etc.). So this is an established, pre-existing tool/pipeline convention, not something newly broken or faked by this diff. The new renders/site content is internally consistent with the new brief text (Fount colors, cost pips, rules/flavor text all match), and none of it contradicts or removes anything the visible ACs cover.

This is a real mismatch between plan.md's stated scope and the actual diff, but it doesn't violate the Intent's substance (the compositing loop being unblocked is literally the point of the unit) or break anything observable, so I'm not treating it as an INTRODUCED defect that should gate the merge — flagging it for visibility only.

## Verdict

All 3 visible ACs pass against the real files. No INTRODUCED defect found.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T10:52:06.754Z] **bolt:start** — unit=cardgame-art-briefs-character-signatures-wave-2 start_sha=d7c27b9d85a6f2ba1af121d176aac0c094f9a359 branch=bolt/cardgame-art-briefs-character-signatures-wave-2 worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-art-briefs-character-signatures-wave-2
- [2026-07-29T10:52:15.889Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T10:56:26.735Z] **plan:done** — plan.md written
- [2026-07-29T10:58:19.400Z] **tests:done** — RED verified on test/design-art-briefs-character-signatures-wave-2.test.js (exit=1)
- [2026-07-29T11:01:50.809Z] **build:c1** — tests green, committed
- [2026-07-29T11:07:04.491Z] **review:c1** — APPROVE
- [2026-07-29T11:11:07.534Z] **review:devils-advocate** — APPROVE
- [2026-07-29T11:11:16.334Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T11:11:16.722Z] **merge:done** — auto-merged bolt/cardgame-art-briefs-character-signatures-wave-2 into master (worktree)


## Receipt

```json
{
  "start_sha": "d7c27b9d85a6f2ba1af121d176aac0c094f9a359",
  "end_sha": "09b7dd9ded712191eb3196ee55128e90a85d1065",
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
  "timestamp": "2026-07-29T11:11:16.332Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-art-briefs-character-signatures-wave-2\\plan.md`.\n\nSummary of the plan:\n- **GATE: none** — purely additive doc + test changes, no code/schema touched, zero file overlap with the two other in-flight/completed art-briefs units.\n- **Step 1**: append one new `## Character Signatures, Wave 2` section with 5 fully-drafted `###` briefs to `design/cards/art-briefs.md`, each with a verified-correct Fount-color Palette line, Key-visual-elements bullets that concretely overlap ≥2 significant words with that card's own Rules/Type text (I hand-verified the tokenization against the test's actual regex/stopword logic), and a Composition line with the standard `5:3` landscape note.\n- **Step 2**: add `test/design-art-briefs-character-signatures-wave-2.test.js`, full content given verbatim, mirroring the fount-economy test's structure — and explicitly avoiding the hardcoded-SHA256 mistake that got the earlier `cardgame-art-briefs-fount-economy` unit escalated (noted in-plan with the reasoning).\n\nEvery code block, exact file paths, and expected `node --test` output are spelled out so it's typeable without further judgment calls.",
    "test_writer": "Wrote `test/design-art-briefs-character-signatures-wave-2.test.js`, mirroring `design-art-briefs-fount-economy.test.js`'s structure exactly as specified in plan.md, covering AC1 (5 verbatim `###` titles present in art-briefs.md), AC2 (Palette line names the correct Fount color per card-anatomy.md), and AC3 (Key visual elements bullets overlap the card's own Rules/Type text, Composition line has aspect ratio + rectangular/landscape wording).\n\nVerified by inspection (not execution — `node` invocations were all blocked by a permission gate in this session that never got approved, so I couldn't confirm RED via `node --test`):\n- `design/cards/character-signatures-wave-2.md` has exactly the 5 expected `###` headings, byte-matching what the test expects.\n- `design/cards/art-briefs.md` currently ends at the Fount Economy Set's last brief with no \"Character Signatures, Wave 2\" section — so every AC1/AC2/AC3 test for these 5 titles will fail right now since `findBriefSection()` returns `null` for all of them.\n- No file under `src/` was touched; only the new test file was added.\n\nYou may want to run `node --test` yourself to confirm the RED state, since I wasn't able to execute it here.",
    "builder_c1": "All 779 tests pass. The suite is green.\n\n## Summary\n\nImplemented unit `cardgame-art-briefs-character-signatures-wave-2` following the plan exactly:\n\n1. Appended 5 new `###` art-brief sections (Torel Ashgrave, Rathe Ossuary-Kin, Doran Vex Amaranthine, Ysolde Thane, Foreman-Prime Yssa Ductile) under a new `## Character Signatures, Wave 2` heading in `design/cards/art-briefs.md`, verbatim as specified.\n2. Running the test suite triggers `tools/composite-card-art.js`'s brief-driven render loop and `build-site.js` as a side effect, generating renders and site HTML for the 5 newly-unlocked cards (`renders/cards-composited/`, `renders/cards-live/`, `site/_card-art/`, `site/design/cards/*.html`). This is the same pattern the earlier `cardgame-art-briefs-fount-economy` unit hit and resolved: two pre-existing tests (`card-template-helper.test.js` AC4 and `leonardo-art-client.test.js` AC2) assert clean git status against `design/` and `renders/cards-composited/`, so the generated artifacts must be committed to be byte-identical to the \"baseline\" the tests check against. I committed them alongside the art-briefs change, mirroring the exact precedent (verified via `git log`/`git show` on the fount-economy commit).\n\n`node --test`: **779/779 passing**, `# fail 0`. No file under `test/` was modified. Not part of the plan's explicit \"files touched\" list but required to reach green: the generated render/site artifacts, committed in `09b7dd9`, following the established repo pattern.",
    "reviewer_c1": "Findings written to `findings.md`. Summary: AC1–AC3 all verified directly against the real files (art-briefs.md, character-signatures-wave-2.md, card-anatomy.md) — titles, palette-to-Fount mapping, and word-overlap all check out by hand-trace, no gameable stopword loophole. The new test file genuinely reads real content rather than fixtures. The diff is broader than plan.md's stated scope (also ships renders/site art), but that extra content is internally consistent and matches an existing repo-wide convention (verified via grep), so it's noted but non-gating.\n\nAPPROVE",
    "devils_advocate": "Devil's Advocate review complete. I attacked this diff on several angles:\n\n1. **AC1** — verified all 5 titles match verbatim, brief-section/`<h3>` counts in the generated site HTML are consistent (39/39), and the append is purely additive (no existing section touched).\n2. **AC2** — cross-checked each card's Cost-line Fount against `card-anatomy.md`'s Fount-identity table and each brief's Palette line; all 5 mappings (Mass→Ash-grey, Bloom→Green, Signal→Cyan, Tangle→Violet, Circuit→Copper) are correct, and the generated SVGs' `data-fount`/`data-color`/fill values agree.\n3. **AC3** — manually recomputed the significant-word overlap test's logic (including its stopword list and hyphen/apostrophe tokenization quirks) against each card's actual Rules/Type text vs. its brief bullets; every card clears the ≥2-word bar with margin, and all Composition lines carry both an aspect ratio and rectangular/landscape language.\n4. **Scope creep check** — the diff touches far more than the intent's \"only art-briefs.md and one test file\" claim (15 new SVG renders + 2 site HTML files). Investigated whether this breaks anything: it doesn't — `tools/composite-card-art.js`/`build-site.js` regenerate these as an inherent side effect of any brief addition, matching the existing per-card commit pattern (fount-economy-set.md precedent cited in the commit message), and this is exactly what the held-out AC4 requires per the test file's own comment.\n5. **Regression check on pre-existing tests** — `design-art-briefs.test.js`'s AC1 uses `>=` not exact counts (explicitly to survive set additions) and validates brief titles against `loadAllCards()`, which globs all `design/cards/*.md` files, so the new titles resolve cleanly. No shared-file test breaks.\n6. Found one file-count discrepancy (`cards-composited`/`cards-live` = 42 vs `site/_card-art` = 39) — traced it to a **pre-existing** gap (37 vs 34) that predates this commit, not something this diff introduced.\n\nNo surviving INTRODUCED defect.\n\nAPPRO"
  }
}
```

## Comments

(no comments.md)
