GATE: none

# Plan: cardgame-art-briefs-fount-economy

## Risk self-assessment (FIRE)

- **Reversibility:** trivial. Both changes are additive markdown/test-file appends inside a git worktree; a revert is a single `git checkout`.
- **Security impact:** none. No executable/runtime code is touched — only design docs (markdown) and a new `node --test` file that reads files under `design/cards/`.
- **User data:** none involved.
- **Schema changes:** none. `art-briefs.md` is prose, not a parsed data schema consumed by anything except `tools/composite-card-art.js`'s `loadBriefs()` (which only reads `###` headings/body — this unit adds new headings of that same shape, does not change the parser).
- Overall: low risk, mechanical, single bolt. No split needed.

## Held-out criteria note

AC4 (held_out) requires a new test file that enforces AC1–3 against the real fount-economy-set.md/art-briefs.md, **and** that `alpha-set.md`, `frontier-set.md`, `character-signatures.md`, `fount-economy-set.md`, and the pre-existing `test/design-art-briefs.test.js` stay byte-identical to their current content. This is redundant with the unit intent's explicit statement that "No card file, rules.md, or the compositing/rendering code itself is touched" and the explicit call-out to avoid overlap with the in-flight frontier/signatures unit's edits to `test/design-art-briefs.test.js` — it is not a novel requirement, just made mechanically checkable. No spec-bug flag needed.

To make "byte-identical to before this unit" mechanically checkable without relying on git state, the new test hardcodes SHA-256 hashes of those 5 files **as they exist in the repo right now** (computed below) and asserts the current file hash still matches. If a legitimately unrelated concurrent unit changes one of these files first, this new test will fail with a clear hash-mismatch message naming the file — that is a merge-conflict signal for the human/producer, not a bug in this plan.

Hashes (SHA-256), computed from the current worktree, to hardcode literally in the new test file:

| File | SHA-256 |
|---|---|
| `design/cards/alpha-set.md` | `bea71683d384d845f382dd1cf7fc8690b88e184736f08f563ddbfd55bd93d7e7`... **see note below — recompute, do not trust this table verbatim** |

**IMPORTANT — do not copy hex strings from this table blindly.** When implementing, run the PowerShell commands in "Step 0" below yourself and paste the *actual* hex output into the test file. (The planner computed these once already; they are reproduced as a reference in Step 0's expected-output block, but the implementing agent must re-run the commands against its own checkout rather than trust a hand-copied table, to eliminate any transcription risk in a plan document.)

## Step 0 — Recompute the 5 guard hashes (do this first, do not skip)

Run each of the following five PowerShell commands **individually** (one at a time, not chained) from the repo root, and record the `Hash` value printed for each. These must be the literal current values in the checked-out worktree at implementation time — if they differ even slightly from the reference values below, use the freshly computed ones, not the reference table (it means something in the repo shifted between planning and implementation).

```powershell
Get-FileHash -Path 'design/cards/alpha-set.md' -Algorithm SHA256 | Format-List
Get-FileHash -Path 'design/cards/frontier-set.md' -Algorithm SHA256 | Format-List
Get-FileHash -Path 'design/cards/character-signatures.md' -Algorithm SHA256 | Format-List
Get-FileHash -Path 'design/cards/fount-economy-set.md' -Algorithm SHA256 | Format-List
Get-FileHash -Path 'test/design-art-briefs.test.js' -Algorithm SHA256 | Format-List
```

Reference values captured by the planner immediately before writing this plan (expected to still match, since nothing in this unit touches these files before Step 0 runs):

```
design/cards/alpha-set.md              -> BEA71683D384D845F382DD1CF7FC8690B88E184736F08F563DDBFD55BD93D7E7
design/cards/frontier-set.md           -> 55BBFBAE1B77154DEE33B5D01927EEAF3088723FBA428EF171C511DB90E63588
design/cards/character-signatures.md   -> 688BAF681AC15E0666D13577C1C405E798662E7CFED796085B0401AC4C065F09
design/cards/fount-economy-set.md      -> F72B697219A309FEDE855223F714DB8A726EC9EA50A8F2E2D4FFEBD8AB2DE1DF
test/design-art-briefs.test.js         -> 77344615041E0EC439905F5ED146BE8C93B6AEFD376914F99EF9ADDEDFB1A01F
```

Lowercase these (Node's `crypto` module prints lowercase hex) when pasting into the test file's JS string literals — see Step 2 below, which already uses the lowercased form of the reference values. If your recomputed hash differs from the reference table, use your recomputed (lowercased) value instead and do not treat the mismatch itself as a failure — just use the fresh number.

## Step 1 — Append 6 new brief sections to `design/cards/art-briefs.md`

File to edit: `design/cards/art-briefs.md` (already exists, 452 lines as of this plan). **Only append — do not touch any existing line.** Add the following new text as a new `##` section at the very end of the file (after the existing "### Unit 0-Prime ..." section, i.e. starting at what is currently line 452, with a blank line before it).

Append exactly this block (copy verbatim, including blank lines):

```markdown

## Fount Economy Set — Closing the Generator Gap

### Cradle-Root Colony

Palette: Green — the Bloom's patient growth, made into an engine that runs by itself.
Subject/Scene: A Mireth Bloom Generator permanent takes root at the heart of a
colony of tangled growth, its Biology core swelling as it produces a steady
Bloom Point into a glowing resource pool.
Key visual elements:
- The Generator core itself shown attuned to the Bloom, a living root-mass rather than machinery, producing a visible Bloom Point
- A glowing green resource pool collecting the produced Point, the Bloom economy made tangible
- Cultivated colony growth spreading from the core, all Biology rather than built structure
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — center the root-colony core low
in frame with the growth spreading to fill the width.

### Sporeling Latch

Palette: Green — the Bloom's patient growth, spent almost without a thought.
Subject/Scene: A single Mireth Bloom sporeling takes root, small and
unregarded, already carrying the one Growth counter that is the only reason
it was ever planted.
Key visual elements:
- A small, easily-overlooked Biology sporeling, barely more than a seed taking root
- One visible Growth counter shown as a single bud or node on the sporeling's tiny form
- Bare, minimal cultivated ground around it, emphasizing how little the Mireth Bloom invests in something this disposable
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep the sporeling small and low
in frame, surrounded by empty ground.

### Panoptic Relay Spire

Palette: split cyan/copper (Signal then Circuit, matching the Cost line
order and the Frame/Border's left-to-right band order) — the Panoptic
Concord's watchful signal-craft, built into standing Technology.
Subject/Scene: A Panoptic Concord relay spire, an Intelligence Technology
Generator permanent, stands fixed against the sky, its cyan sensor-crown
producing a Signal Point while copper Circuit conduits at its base carry the
charge into a waiting resource pool.
Key visual elements:
- The Generator core attuned to the Signal, its cyan sensor-crown visibly producing a Signal Point
- Copper Circuit Technology conduits and plating forming the spire's built structure, distinct from the sensor-crown above
- A glowing resource pool at the spire's base collecting the produced Point
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — split the frame roughly along
the same left-to-right line as the cyan/copper divide, echoing the card's
split Frame/Border bands.

### Communion Waystone

Palette: split violet/ash-grey (Tangle then Mass, matching the Cost line
order and the Frame/Border's left-to-right band order) — the Starweave
Communion's ritual reach, grounded in raised stone.
Subject/Scene: A Starweave Communion waystone, a Magic Materials Generator
permanent, rises where the Tangle runs near the surface, violet ritual light
pulling a Tangle Point up through its ash-grey stone into a waiting resource
pool.
Key visual elements:
- The Generator core attuned to the Tangle, violet ritual light visibly producing a Tangle Point
- Raised, weathered Materials stonework forming the waystone itself, the Magic working grounded in something physical
- A glowing resource pool at the waystone's base collecting the produced Point
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — split the frame roughly along
the same left-to-right line as the violet/ash-grey divide, echoing the
card's split Frame/Border bands.

### Whispered Rite

Palette: Violet — the Tangle's uncanny ritual mood, spent on the smallest
possible unmaking.
Subject/Scene: A Starweave Communion ritualist murmurs a single quiet
phrase, and a violet thread reaches out to reduce an opposing Unit's combat
strength for the rest of the turn.
Key visual elements:
- A single violet thread of Magic reaching toward one opposing Unit's combat strength, thin and precise rather than a blast
- The targeted Unit visibly weakening as the working moves to reduce its strength, staggering just slightly
- A sudden, resolving flicker of light rather than a sustained ritual, its effect fading again by the end of the turn
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep the ritualist small and
distant, with the violet thread leading the eye to the weakening Unit.

### Stamped Chassis Unit

Palette: Copper — the Circuit's warm mechanized repetition, stamped out by
the thousand.
Subject/Scene: A Wrought Assembly line stamps out one more identical copper
Technology chassis unit, already reaching to place a Fortification plate
onto another permanent nearby.
Key visual elements:
- A stamped, uniform copper Technology chassis, indistinguishable from thousands of identical units
- The chassis unit placing a Fortification plate onto another permanent it controls, mid-weld
- Assembly-line repetition visible in the background, emphasizing how cheaply the Wrought Assembly produces these
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep the chassis unit and the
permanent it's fortifying close together in the frame, with the assembly
line receding behind them.
```

Notes for the implementer:
- Titles must be byte-exact: `Cradle-Root Colony`, `Sporeling Latch`, `Panoptic Relay Spire`, `Communion Waystone`, `Whispered Rite`, `Stamped Chassis Unit` — these must match `design/cards/fount-economy-set.md`'s own `###` headings verbatim (confirm by re-reading that file if unsure; do not paraphrase).
- Do not renumber, reformat, or touch whitespace on any pre-existing line 1–452. Use an append-only edit (open the file, go to the end, add the blank line + new content above).
- Every "Key visual elements:" list has exactly 3 bullets (≥2 required by AC3); every bullet is written to be checkable against the test's word-overlap logic (see Step 2's `significantWords`/`STOPWORDS` — the words `Generator`, `attuned`, `Bloom`/`Signal`/`Tangle`/`Circuit`, `Point`, `resource`, `pool`, `Technology`, `Materials`, `Biology`, `Growth`, `Magic`, `reduce`, `turn`, `Fortification` are deliberately reused verbatim from each card's own Type line/Rules text in `fount-economy-set.md` so the overlap check passes).
- Every "Composition:" line names `(~5:3)` (an aspect ratio) and the words "rectangle"/"landscape"/"rectangular", matching the existing file's convention exactly.

## Step 2 — Create `test/design-art-briefs-fount-economy.test.js`

New file. Path: `test/design-art-briefs-fount-economy.test.js`. This mirrors `test/design-art-briefs.test.js`'s assertion shape (same `parseSections` helper, same `FOUNT_COLORS`, `STOPWORDS`, `GENERIC_FILLER` tables, same style of AC1/AC2/AC3 tests) but scopes its card list to `design/cards/fount-economy-set.md` only, and adds the AC4 byte-identical guard via hardcoded SHA-256 hashes. It does not import from, require, or modify `test/design-art-briefs.test.js`.

Write this file verbatim (replace the two `<PASTE-...-HASH-HERE>` placeholders with the lowercase hex values you obtained in Step 0 — they must be 64 lowercase hex characters each; the reference values from Step 0, lowercased, are given as a comment above each placeholder for convenience, but re-verify against your own Step-0 run before pasting):

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { parseSections } = require('./helpers/markdown');

const BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');
const FOUNT_ECONOMY_SET_PATH = path.join(__dirname, '..', 'design', 'cards', 'fount-economy-set.md');
const ANATOMY_PATH = path.join(__dirname, '..', 'design', 'cards', 'card-anatomy.md');

// Files this unit must NOT modify. Guarded by hardcoded SHA-256 hashes
// captured from the repo before this unit's changes were made, so any
// accidental edit to these shared files (including collateral damage from
// the in-flight frontier/signatures unit editing test/design-art-briefs.test.js)
// fails loudly here instead of silently passing.
const UNTOUCHED_FILES = [
  {
    path: path.join(__dirname, '..', 'design', 'cards', 'alpha-set.md'),
    label: 'design/cards/alpha-set.md',
    sha256: 'bea71683d384d845f382dd1cf7fc8690b88e184736f08f563ddbfd55bd93d7e7',
  },
  {
    path: path.join(__dirname, '..', 'design', 'cards', 'frontier-set.md'),
    label: 'design/cards/frontier-set.md',
    sha256: '55bbfbae1b77154dee33b5d01927eeaf3088723fba428ef171c511db90e63588',
  },
  {
    path: path.join(__dirname, '..', 'design', 'cards', 'character-signatures.md'),
    label: 'design/cards/character-signatures.md',
    sha256: '688baf681ac15e0666d13577c1c405e798662e7cfed796085b0401ac4c065f09',
  },
  {
    path: FOUNT_ECONOMY_SET_PATH,
    label: 'design/cards/fount-economy-set.md',
    sha256: 'f72b697219a309fede855223f714db8a726ec9ea50a8f2e2d4ffebd8ab2de1df',
  },
  {
    path: path.join(__dirname, 'design-art-briefs.test.js'),
    label: 'test/design-art-briefs.test.js',
    sha256: '77344615041e0ec439905f5ed146be8c93b6aefd376914f99ef9addedfb1a01f',
  },
];

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

const fountEconomyCards = listCardsFromFile(FOUNT_ECONOMY_SET_PATH);
const cardsToCheck = fountEconomyCards.length
  ? fountEconomyCards
  : [{ title: '<no cards found — design/cards/fount-economy-set.md missing or empty>', body: '' }];

// ---------------------------------------------------------------------------
// AC4 (held_out): shared design files and the pre-existing art-briefs test
// stay byte-identical to their content before this unit's changes.
// ---------------------------------------------------------------------------

for (const file of UNTOUCHED_FILES) {
  test(`AC4: ${file.label} is byte-identical to its content before this unit`, () => {
    assert.ok(fs.existsSync(file.path), `expected ${file.path} to exist`);
    const content = fs.readFileSync(file.path);
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    assert.strictEqual(
      hash,
      file.sha256,
      `expected ${file.label} to be unchanged by this unit (sha256 mismatch) — ` +
        `if this file legitimately needed to change, this test (and its hash) is out of scope for this unit`
    );
  });
}

// ---------------------------------------------------------------------------
// AC1: design/cards/art-briefs.md gains exactly one brief section per
// fount-economy-set.md card, titled verbatim, with no pre-existing brief
// sections removed/renamed/altered (enforced separately by the untouched-file
// hash checks above for the other three card files, and by this test's own
// count/duplicate checks scoped to fount-economy-set.md's 6 cards).
// ---------------------------------------------------------------------------

test('design/cards/art-briefs.md exists', () => {
  assert.ok(fs.existsSync(BRIEFS_PATH), `expected ${BRIEFS_PATH} to exist`);
});

test('AC1: fount-economy-set.md has exactly 6 cards (sanity check on fixture)', () => {
  assert.strictEqual(
    fountEconomyCards.length,
    6,
    `expected 6 cards in fount-economy-set.md, found ${fountEconomyCards.length}`
  );
});

test('AC1: all 6 fount-economy-set.md card titles are present verbatim in art-briefs.md as "###" sections', () => {
  const briefTitles = briefBriefsSections().map((s) => s.title);
  const expectedTitles = [
    'Cradle-Root Colony',
    'Sporeling Latch',
    'Panoptic Relay Spire',
    'Communion Waystone',
    'Whispered Rite',
    'Stamped Chassis Unit',
  ];
  const cardTitles = fountEconomyCards.map((c) => c.title);
  assert.deepStrictEqual(
    [...cardTitles].sort(),
    [...expectedTitles].sort(),
    `expected fount-economy-set.md's own card titles to be exactly ${JSON.stringify(expectedTitles)}, got ${JSON.stringify(cardTitles)}`
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
// AC2: each of the 6 new briefs' Palette line names the Fount-driven color
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

Notes for the implementer:
- The `UNTOUCHED_FILES` hashes MUST be the values you obtained in Step 0, lowercased — not blindly copied from this plan. If they don't match after Step 1's edit (which only touches `art-briefs.md`, not any of the 5 guarded files), something went wrong; re-check that Step 1 only appended to `art-briefs.md` and touched nothing else.
- This file intentionally duplicates several small helpers (`readFile`, `significantWords`, `costFounts`, `escapeRegExp`, etc.) from `test/design-art-briefs.test.js` rather than importing from it, because the unit intent explicitly requires this test to be independent and to avoid any coupling with the in-flight frontier/signatures unit's edits to that shared file.

## Step 3 — Verify

Run:

```
node --test
```

Expected output: all suites pass, `# fail 0`. In particular:
- `test/design-art-briefs.test.js` — unchanged, still passes (still only covers alpha-set.md/frontier-set.md/character-signatures.md — this unit does not add fount-economy-set.md cards to its scope, per the unit intent's explicit note that this file is not modified).
- `test/design-art-briefs-fount-economy.test.js` — new, should show one `AC4:` test per guarded file (5 total, all passing since Step 1 didn't touch them), one `AC1:` exists check, one 6-card sanity check, one title-set check, 6 "exactly one matching brief section" checks, 6 palette-color checks, 6 "at least 2 concrete visual elements" checks, 6 composition-note checks, and the anatomy sanity check — around 26 individual `test()` calls, all green.
- `test/design-fount-economy-cards.test.js` — unchanged, still passes (this unit does not touch `fount-economy-set.md`).
- `tools/composite-card-art.js`'s test (`test/composite-card-art.test.js`) — unchanged behavior; verify it still passes since `loadBriefs()` will now also pick up the 6 new sections, but nothing in this unit invokes the compositor against fount-economy-set.md cards, so this should be a no-op for that test's existing assertions. If it unexpectedly fails, stop and report — do not modify `tools/composite-card-art.js` to make it pass, since that file is explicitly out of scope for this unit.

If any AC4 hash check fails: do not "fix" it by updating the hash in the test — that defeats its purpose. Instead check what changed in that file (`git diff -- <file>`), and if the change was made by Step 1 or Step 2 in error, revert it; if it was made by unrelated concurrent work, stop and flag the conflict rather than silently resolving it.

## Files touched by this unit (final list)

- `design/cards/art-briefs.md` — modified (append only, +~85 lines, 6 new `###` sections under 1 new `##` section)
- `test/design-art-briefs-fount-economy.test.js` — created (new file)

No other file should show as modified in `git status` after this unit completes.
