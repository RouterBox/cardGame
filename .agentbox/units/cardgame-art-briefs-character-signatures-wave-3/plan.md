GATE: none

# Plan: cardgame-art-briefs-character-signatures-wave-3

## Summary

Append exactly 5 new `###` art-brief sections (under one new `##` wave
header) to `design/cards/art-briefs.md`, one per card in
`design/cards/character-signatures-wave-3.md`, using the identical
Palette / Subject-Scene / Key visual elements / Composition template the
wave-2 unit established. Add one new, independent test file,
`test/design-art-briefs-character-signatures-wave-3.test.js`, mirroring
`test/design-art-briefs-character-signatures-wave-2.test.js`'s assertion
shape (title-exists, field-shape, Palette-matches-Fount, generic-filler
and word-overlap checks).

No other file is touched. `design/cards/character-signatures-wave-3.md`,
`design/cards/card-anatomy.md`, and every existing byte of
`design/cards/art-briefs.md` stay exactly as they are today — this unit
only appends.

## Risk self-assessment (FIRE)

- **Reversibility:** trivial. Pure append to a markdown file + one new
  test file. `git revert` undoes it cleanly. No destructive edits.
- **Security impact:** none. No code paths, no executable logic beyond a
  test file reading two static markdown files.
- **User data:** none touched.
- **Schema changes:** none.

This is a low-risk, mechanical documentation + test unit. `GATE: none`.

## Source facts gathered (read-only, for the builder's reference)

`design/cards/character-signatures-wave-3.md` (already shipped, do not
touch) defines these 5 cards, in this order:

1. **Bren Hollowmelt, the Cindergrown** — Cost line `3 Mass`, Type line
   `Materials — Permanent`, Rules text: "Slow. This permanent is a Unit.
   The first time each turn this Unit would be destroyed by damage,
   instead remove all damage marked against it; it remains on the
   Field." Stats/counters: "Combat strength 2. Enters with no counters."
   Flavor: a wound grown into something not fully his own, over a
   Bloom-claimed debris field, The Cindral Reach undecided which parts
   are still its own.
2. **Vesk-Aduun, the Graft-Wearer** — Cost line `3 Bloom`, Type line
   `Biology — Permanent`, Rules text: "Slow. This permanent is a Unit.
   Whenever this Unit deals damage to a Unit that is destroyed as a
   result, place a Growth counter on this Unit." Stats/counters: "Combat
   strength 2. Enters with no counters." Flavor: a fused fragment of
   Assembly design-memory in his flesh, growing stranger with every kill,
   which The Mireth Bloom doesn't mind.
3. **Ilio Marn-Cassity, Contract-Broker of the Rewritten Clause** — Cost
   line `2 Signal`, Type line `Intelligence` (not a Permanent — no
   Stats/counters line), Rules text: "Fast. When this resolves, look at
   an opponent's Hand; choose a card there and swap its printed cost with
   the printed cost of a card in your Hand." Flavor: never loses sleep
   over a contract's fine print — for The Panoptic Concord's best
   brokers, the fine print is the whole point.
4. **Ossian Thale, Reclamation-Warden of the Standing Stones** — Cost
   line `3 Tangle`, Type line `Magic` (not a Permanent — no
   Stats/counters line), Rules text: "Fast. When this resolves, destroy
   any Biology permanent; its controller draws a card." Flavor: failed
   three times to reclaim a shrine the Bloom swallowed whole; would
   rather see the ground burned to bare stone than let The Starweave
   Communion's claim lapse a fourth time.
5. **Replica-Sergeant Kess Ninefold, the Named Copy** — Cost line
   `2 Circuit`, Type line `Technology — Permanent`, Rules text: "Slow.
   This permanent is a Unit. The first time this Unit is dealt damage and
   not destroyed, its combat strength is increased by 1 for the rest of
   the game." Stats/counters: "Combat strength 1. Enters with no
   counters." Flavor: never supposed to have a name (Assembly patrol
   units are numbered) until an Iron-Choir enforcer broke protocol and
   named it, after Kess hesitated rather than destroy a mostly-children
   Reach salvage crew; The Wrought Assembly wasn't built for that mercy,
   and Kess kept it anyway.

`design/cards/card-anatomy.md` (do not touch) Fount → Frame/Border color
table (line ~45-52):

| Fount | Color |
|---|---|
| The Mass | Ash-grey |
| The Bloom | Green |
| The Signal | Cyan |
| The Circuit | Copper |
| The Tangle | Violet |

So: Bren (Mass) → Ash-grey, Vesk-Aduun (Bloom) → Green, Ilio (Signal) →
Cyan, Ossian (Tangle) → Violet, Kess (Circuit) → Copper. Matches unit.md
exactly.

`design/cards/art-briefs.md` is currently 855 lines, CRLF line endings,
no trailing blank line after the final line (`...frame's edge.` then a
single `\r\n` and EOF — verified with `tail -c 5 | od -c` showing
`g e . \r \n`). Its last section is `## Spatial Race Identity Set, Wave 2
— Two More Races Grounded in the Graph` / `### Circuit Fount`. The
existing `## Character Signatures, Wave 2` section (line 550) is the
exact style template this unit must copy: a `##` wave header followed by
five `###` card sections, each with `Palette:`, `Subject/Scene:`, `Key
visual elements:` (a `-`-bulleted list of single-line, unwrapped bullets,
3 per card in the existing waves), and `Composition:` — the Composition
line always ends with `~5:3` and the words `landscape rectangle`, per
`test/design-art-briefs-character-signatures-wave-2.test.js`'s regex
checks (`/\d+\s*:\s*\d+/` and `/rectangular|rectangle|landscape/i`).

`test/helpers/markdown.js`'s `parseSections` splits on any `#{1,6}
`-prefixed line, case- and CRLF-insensitive (`split(/\r?\n/)`), so a new
`##` header is safe to add — it does not disturb parsing of neighboring
sections.

## Step 1 — Append to `design/cards/art-briefs.md`

**Who does this:** the builder may edit this file directly — it is not a
`test/*.js` file, so the test-writer-ownership rule doesn't apply here.

Open `design/cards/art-briefs.md`. Go to the very end of the file (after
the final line, `frame's edge.`, which is the last line of the `###
Circuit Fount` section). Append the following text, starting with a blank
line then `## Character Signatures, Wave 3`, exactly as shown below (use
the file's existing CRLF line endings — check what your editor/tool
defaults to and match the surrounding file; do not mix line-ending
styles). Do not modify, reflow, or touch a single existing byte above
this appended block.

```markdown

## Character Signatures, Wave 3

### Bren Hollowmelt, the Cindergrown

Palette: Ash-grey — the Mass's industrial endurance, refusing to fully
surrender a wound to whatever claimed it.
Subject/Scene: Bren Hollowmelt, the Cindergrown, stands over the
Bloom-claimed debris field where he should have died, his ash-grey
Materials plating fused at the wound with something that grew into it
instead of finishing him.
Key visual elements:
- Bren Hollowmelt himself, a named Cindral Reach Materials Unit whose old wound has grown into something not fully his own, not a generic Unit
- The wound itself shown mid-transformation, damage marked against this Unit fading and being removed rather than destroyed, per his own Rules text
- The Bloom-claimed debris field around him, growth reclaiming wreckage the same uncertain way it reclaimed part of him
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — place Bren
center-frame with the transforming wound catching the light and the
debris field receding behind him.

### Vesk-Aduun, the Graft-Wearer

Palette: Green — the Bloom's patient growth, closing over whatever it's
grafted onto.
Subject/Scene: Vesk-Aduun, the Graft-Wearer, stands mid-Sprawl with a
stolen fragment of Assembly design-memory fused into his flesh, the
straight-line geometry of it fighting against the Bloom's own green
growth.
Key visual elements:
- Vesk-Aduun himself, a named Mireth Bloom Biology Unit whose flesh carries a fused design-memory fragment, not a generic creature
- A Growth counter taking root on his form the instant a Unit he damages is destroyed, per his own Rules text
- The rigid, machined lines of the stolen design-memory fragment visibly at odds with the organic growth spreading around it
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — keep Vesk-Aduun low
and central with the new Growth counter catching the light at the point
of impact.

### Ilio Marn-Cassity, Contract-Broker of the Rewritten Clause

Palette: Cyan — the Signal's cool analytic watchfulness, reading the fine
print before anyone else notices it's changed.
Subject/Scene: Ilio Marn-Cassity, Contract-Broker of the Rewritten
Clause, leans over an opponent's fanned Hand in cyan light, swapping a
card's printed cost with one drawn from Ilio's own Hand.
Key visual elements:
- Ilio Marn-Cassity herself, a named Panoptic Concord Intelligence broker reading an opponent's Hand of cards, not a generic figure
- Two contracts shown mid-swap, their printed cost fine print visibly exchanged between Ilio's Hand and the opponent's
- A satisfied, unhurried expression — the swapped fine print is the whole point of the deal, not a trick played reluctantly
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — keep Ilio close over
the opponent's Hand with the two swapped cards lit at the frame's center.

### Ossian Thale, Reclamation-Warden of the Standing Stones

Palette: Violet — the Tangle's uncanny ritual mood, turned here toward
burning a claim clean rather than losing it.
Subject/Scene: Ossian Thale, Reclamation-Warden of the Standing Stones,
stands over a reclaimed shrine the Bloom once swallowed, a violet Magic
working destroying a Biology permanent as the ground around it is burned
back to bare stone.
Key visual elements:
- Ossian Thale himself, a named Starweave Communion Magic warden reclaiming ground the Bloom has taken, not a generic caster
- A Biology permanent shown being reduced to ruin by the same violet Magic working that will destroy it, per his own Rules text
- The reclaimed shrine and the bare, burned stone Ossian leaves behind rather than let the Starweave Communion's claim lapse a fourth time
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — center Ossian over the
burning shrine ground with the dying Biology permanent lit at the frame's
midpoint.

### Replica-Sergeant Kess Ninefold, the Named Copy

Palette: Copper — the Circuit's warm mechanized repetition, worn here by
the one copy that was given a name.
Subject/Scene: Replica-Sergeant Kess Ninefold, the Named Copy, stands
apart from the Wrought Assembly's numbered patrol units, a broken-protocol
name mark visible on copper Technology plating that grows stronger the
more damage it survives.
Key visual elements:
- Replica-Sergeant Kess Ninefold himself, a named Wrought Assembly Technology Unit standing apart from the numbered patrol units around it, not a generic copy
- The instant this Unit is dealt damage without being destroyed, its combat strength visibly increased for the rest of the game
- The broken-protocol naming mark that gave Kess a name mid-raid, and the memory of the mostly-children Reach salvage crew it refused to destroy
Composition: wide, landscape rectangle (~5:3), the large rectangular
window beneath the Name Slot per card-anatomy.md — place Kess
center-frame against a receding grid of numbered, unnamed patrol units
behind them.
```

### Notes on writing this block

- Every `###` title above must match the corresponding
  `character-signatures-wave-3.md` title **verbatim**, including the
  comma and honorific phrase — copy-paste, don't retype, to avoid a stray
  character mismatch (e.g. `Ilio Marn-Cassity, Contract-Broker of the
  Rewritten Clause` — note the hyphen in `Marn-Cassity`, no space).
- Each `Key visual elements:` bullet is a single unwrapped line (matches
  existing sections' style — the automated test doesn't care about line
  wrapping since it collapses on the `- ` bullet marker, but keep it
  consistent with the rest of the file for a human reader).
- Do not use any of these filler phrases anywhere in the bullets (the
  wave-2 test's `GENERIC_FILLER` list forbids them and the new wave-3
  test will carry the identical list — see Step 2): "dramatic lighting",
  "epic composition", "epic scene", "stunning artwork", "stunning
  visual", "beautiful scene", "amazing artwork", "amazing visual",
  "breathtaking", "awe-inspiring". None of the text above uses them.
- The Palette line for each card names its color once, case-sensitively
  matching the table (`Ash-grey`, `Green`, `Cyan`, `Violet`, `Copper`) —
  the test's regex is case-insensitive so exact casing isn't required,
  but match it anyway for consistency with the rest of the file.

## Step 2 — Add `test/design-art-briefs-character-signatures-wave-3.test.js`

**Who does this:** the test-writer stage. This is a brand-new file, not
an edit to any pre-existing `test/*.js` file, so there is no ownership
conflict — but per the standing rule, the builder must not create or
touch anything under `test/` in this unit; that's the test-writer's job.

Create `test/design-art-briefs-character-signatures-wave-3.test.js` with
this exact content (this is `test/design-art-briefs-character-signatures-wave-2.test.js`
verbatim, with only the wave-2 → wave-3 path/title/card-count
substitutions called out inline):

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');
const CHARACTER_SIGNATURES_WAVE_3_PATH = path.join(__dirname, '..', 'design', 'cards', 'character-signatures-wave-3.md');
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

const wave3Cards = listCardsFromFile(CHARACTER_SIGNATURES_WAVE_3_PATH);
const cardsToCheck = wave3Cards.length
  ? wave3Cards
  : [{ title: '<no cards found — design/cards/character-signatures-wave-3.md missing or empty>', body: '' }];

// ---------------------------------------------------------------------------
// AC1: design/cards/art-briefs.md gains exactly one brief section per
// character-signatures-wave-3.md card, titled verbatim, with no pre-existing
// brief sections removed/renamed/altered (that last part is verified by the
// orchestrator's diff at merge time — see note above).
// ---------------------------------------------------------------------------

test('design/cards/art-briefs.md exists', () => {
  assert.ok(fs.existsSync(BRIEFS_PATH), `expected ${BRIEFS_PATH} to exist`);
});

test('AC1: character-signatures-wave-3.md has exactly 5 cards (sanity check on fixture)', () => {
  assert.strictEqual(
    wave3Cards.length,
    5,
    `expected 5 cards in character-signatures-wave-3.md, found ${wave3Cards.length}`
  );
});

test('AC1: all 5 character-signatures-wave-3.md card titles are present verbatim in art-briefs.md as "###" sections', () => {
  const briefTitles = briefBriefsSections().map((s) => s.title);
  const expectedTitles = [
    'Bren Hollowmelt, the Cindergrown',
    'Vesk-Aduun, the Graft-Wearer',
    'Ilio Marn-Cassity, Contract-Broker of the Rewritten Clause',
    'Ossian Thale, Reclamation-Warden of the Standing Stones',
    'Replica-Sergeant Kess Ninefold, the Named Copy',
  ];
  const cardTitles = wave3Cards.map((c) => c.title);
  assert.deepStrictEqual(
    [...cardTitles].sort(),
    [...expectedTitles].sort(),
    `expected character-signatures-wave-3.md's own card titles to be exactly ${JSON.stringify(expectedTitles)}, got ${JSON.stringify(cardTitles)}`
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

The only substantive differences from the wave-2 test file are: the
`CHARACTER_SIGNATURES_WAVE_3_PATH` constant (name + path), `wave3Cards`
variable name, the "wave-3" wording in the two comment/test-title strings
that mention the wave number, and the `expectedTitles` array (the 5
wave-3 titles instead of the 5 wave-2 titles). Everything else —
`FOUNT_COLORS`, `GENERIC_FILLER`, `STOPWORDS`, every helper function, and
every AC2/AC3 test body — is copied unchanged, since the assertion logic
itself is wave-agnostic.

## Step 3 — Verify

Run:

```
node --test
```

Expected output: all existing test files still pass (0 changed), and the
new `test/design-art-briefs-character-signatures-wave-3.test.js` reports
all tests passing — specifically:
- 1 "exists" test
- 1 "has exactly 5 cards" sanity test
- 1 "all 5 ... titles are present verbatim" test
- 5 "has exactly one matching brief section" tests (one per card)
- 5 "names the correct Fount-driven palette color(s)" tests
- 1 "Art Window ... rectangular" sanity test
- 5 "lists at least 2 concrete, card-specific visual elements" tests
- 5 "has a composition note referencing the Art Window's shape/aspect
  ratio" tests

For a total of 24 passing tests in the new file, 0 failing.

Also run a targeted diff check to confirm nothing else moved:

```
git diff --stat
```

Expected: exactly two files listed —
`design/cards/art-briefs.md` (insertions only, 0 deletions) and
`test/design-art-briefs-character-signatures-wave-3.test.js` (new file).
If `git diff` shows any deletions in `art-briefs.md`, or shows
`character-signatures-wave-3.md`, `card-anatomy.md`, or any other file
under `test/` in the stat output, stop — something touched a file this
unit must not touch.

## Held-out AC note

AC3 (held_out) — the Palette-matches-Fount requirement — is fully
redundant with the visible intent already spelled out in unit.md's own
"Each Palette line must name..." sentence, which lists the exact same
five card→color mappings. No spec-bug flag needed; nothing novel is
being tested here beyond what the visible intent already commits to.
