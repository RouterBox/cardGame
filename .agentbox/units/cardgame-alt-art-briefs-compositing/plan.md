GATE: none

# Unit: cardgame-alt-art-briefs-compositing

## Intent recap

`design/cards/card-anatomy.md`'s "The Layers" section (shipped) already defines
Alt-Art as: swap only the Art Window's illustration for an alternate
illustration of the same subject matter; every other zone keeps the base
treatment's placement and content exactly.

`tools/composite-card-art.js` (shipped) currently:
- loads exactly one brief per card name from `design/cards/art-briefs.md`
  (`loadBriefs()`),
- for each brief, renders the base card SVG (`renderCardSvg`), generates art
  via an injectable client, composites it into the Art Window
  (`compositeArtWindow`), and writes `renders/cards-composited/<slug>.svg`.

This unit is **purely additive**:
1. A new `design/cards/alt-art-briefs.md` with 3 Alt-Art briefs (Sporeknit
   Warden, Salvage-Wrought Bastion, Replicant Foundry Core).
2. `tools/composite-card-art.js` grows a second, parallel pass that loads
   that file (when present) and writes `<slug>-alt.svg` for each alt brief,
   reusing the exact same `renderCardSvg`/`compositeArtWindow` pipeline.
3. Two *existing* test assertions in `test/composite-card-art.test.js` that
   hard-count `.svg` files in `renders/cards-composited/` must be updated —
   see "Why the existing test needs edits" below. This is the only change to
   already-shipped test code; no shipped *source* file other than
   `tools/composite-card-art.js` is touched.

Files that must remain **byte-identical** to their current state (per AC4,
held out): `design/cards/art-briefs.md`, `design/cards/alpha-set.md`,
`design/cards/frontier-set.md`, `design/cards/character-signatures.md`,
`tools/render-card.js`. Do not open these files in an editor and save them
even without changes — just don't touch them.

## Why the existing test needs edits (read this before touching anything)

`test/composite-card-art.test.js` currently asserts (AC1 test, ~line 100):

```js
const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg'));
assert.strictEqual(files.length, titles.length, ...);
```

`titles.length` is the count of brief sections in `art-briefs.md` only (28
today: 18 alpha + 5 frontier + 5 character-signatures). Once this unit makes
`main()` also write 3 `<slug>-alt.svg` files, `OUT_DIR` will contain 31
`.svg` files, and this assertion breaks — not because anything is wrong, but
because the test's "exactly one file per brief" invariant predates alt-art
existing. This is an expected, deliberate update, not a sign the plan is
wrong. The fix is a one-line filter tweak (below), not a rewrite: the base
per-brief invariant stays exactly as strict as before, just scoped to
non-alt files. A new alt-focused test file separately covers "exactly 3
`-alt.svg` files, one per alt brief, no others."

The second edit is in the "AC3: image generation is injected via a client
argument" test: it counts how many times the injected fake client's
`generateArt` was called and expects it to equal `titles.length`. Once
`main()` also calls `generateArt` once per alt brief, that count becomes
`titles.length + altTitles.length`.

Both edits are additive/widening (a filter, a `+ altTitles.length`), never a
loosening of what was already being checked.

## Step 1 — create `design/cards/alt-art-briefs.md`

Create this file with **exactly this content**:

```markdown
# Alt-Art Briefs

This document gives one Alt-Art brief for each of three cards already
briefed in `design/cards/art-briefs.md`, one card from Bloom, Mass, and
Circuit. Per the Alt-Art layer defined in `design/cards/card-anatomy.md`'s
"The Layers" section, an Alt-Art brief swaps only the Art Window's
illustration for an alternate illustration of the same subject matter —
every other zone keeps the base treatment's placement and content exactly.
Each brief below follows the same Palette/Subject-Scene/Key visual
elements/Composition template `art-briefs.md` already uses, but describes
a genuinely different scene from that card's existing base brief, not a
restatement of it.

### Sporeknit Warden

Palette: Green — the Bloom's patient growth, this time witnessed
underground rather than in the open.
Subject/Scene: Far below open ground, a Warden shape splits free of a
cracked fruiting-cocoon inside a lightless cavern, spores drifting upward
past glowing fungal shelves as a fresh Growth node cracks open at its
shoulder.
Key visual elements:
- A cracked fruiting-cocoon shell the Warden is breaking free of, not a body already standing on open ground
- One visible Growth counter shown as a shoulder-node cracking open in a scatter of drifting spores
- A lightless cavern lit only by bioluminescent fungal shelves overhead, no sky or horizon in view
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — angle the emerging Warden
diagonally from a lower corner up toward the glowing fungal shelves above.

### Salvage-Wrought Bastion

Palette: Ash-grey — the Mass's industrial endurance, here shown
mid-recovery rather than mid-production.
Subject/Scene: Under a starless salvage-yard sky, a crew locks a scavenged
bastion module into place atop a half-buried Cindral Reach ruin, its
interior glow flickering to life for the first time as the freshly bolted
plate settles home.
Key visual elements:
- A salvage crew bolting a scavenged bastion module onto a half-buried Cindral Reach ruin, not a bastion already standing complete
- A faint interior glow just beginning inside the shell, the first hint of the Mass Point it will soon produce
- A starless salvage-yard night setting, emphasizing recovery and reconstruction over an active battlefield
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep the crew and bastion
module low and central with the salvage-yard darkness filling the frame's
edges.

### Replicant Foundry Core

Palette: Copper — the Circuit's warm mechanized repetition, here shown in
storage rather than mid-assembly.
Subject/Scene: Rows of identical copper cores stand racked floor to ceiling
in a dim storage vault, a single mechanical arm sliding the newest
duplicate into its slot as a faint spark still clings to its still-warm
seams.
Key visual elements:
- Rows of identical copper foundry cores racked floor to ceiling in storage, not a single core on an assembly line
- A mechanical arm sliding the newest duplicate into its slot, the token-copy moment shown after the fact rather than mid-stamp
- A still-warm spark clinging to the newest core's seams, the only sign it was just replicated
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — let the racked cores recede in
rows toward the frame's center with the mechanical arm crossing the
foreground.
```

**Do not paraphrase or "clean up" this text.** The exact wording above was
hand-checked against AC2's word-overlap rule (see "AC2 verification" below).
Changing wording can silently push the overlap ratio over 50% and fail the
test in Step 4.

### AC2 verification (why this wording is safe)

AC2 requires each alt brief's `Subject/Scene:` line to share **fewer than
half** its "significant words" (words ≥4 letters, minus a small connector-word
stopword list — see the test in Step 4) with that same card's base brief's
`Subject/Scene:` line. Hand-counted overlap using that exact rule:

| Card | shared significant words | alt total | ratio |
|---|---|---|---|
| Sporeknit Warden | warden, fungal, growth (3) | 25 | 12% |
| Salvage-Wrought Bastion | bastion, cindral, reach (3) | 24 | 12.5% |
| Replicant Foundry Core | (none) | 23 | 0% |

All three are comfortably under 50%.

## Step 2 — extend `tools/composite-card-art.js`

Five small, additive edits to the existing file. Apply each as an exact
find/replace.

### 2a. Add the alt-briefs path constant

Find:
```js
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');
```
Replace with:
```js
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
const ALT_BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'alt-art-briefs.md');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');
```

### 2b. Factor `loadBriefs()` and add `loadAltBriefs()`

Find:
```js
function loadBriefs() {
  const markdown = fs.readFileSync(BRIEFS_PATH, 'utf8');
  return splitIntoH3Sections(markdown).map((section) => ({
    cardName: section.title,
    text: section.lines.join('\n').trim(),
  }));
}
```
Replace with:
```js
function loadBriefsFromFile(filePath) {
  const markdown = fs.readFileSync(filePath, 'utf8');
  return splitIntoH3Sections(markdown).map((section) => ({
    cardName: section.title,
    text: section.lines.join('\n').trim(),
  }));
}

function loadBriefs() {
  return loadBriefsFromFile(BRIEFS_PATH);
}

// alt-art-briefs.md is optional — main() only loads it when present, so a
// checkout with no Alt-Art briefs yet still composites exactly as before.
function loadAltBriefs() {
  if (!fs.existsSync(ALT_BRIEFS_PATH)) return [];
  return loadBriefsFromFile(ALT_BRIEFS_PATH);
}
```

### 2c. Process alt briefs in `main()`, into the same tmp dir

Find:
```js
async function main(client = createMockLeonardoClient()) {
  const briefs = loadBriefs();
  const cardsByName = new Map(loadAllCards().map((card) => [card.name, card]));

  const tmpDir = `${OUT_DIR}.tmp-${process.pid}-${crypto.randomBytes(6).toString('hex')}`;
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    for (const brief of briefs) {
      const card = cardsByName.get(brief.cardName);
      if (!card) {
        throw new Error(`art-briefs.md brief "${brief.cardName}" has no matching card in design/cards/*.md`);
      }

      const baseSvg = renderCardSvg(card);
      const { href } = await client.generateArt({ cardName: card.name, brief: brief.text });
      const compositedSvg = compositeArtWindow(baseSvg, href);

      fs.writeFileSync(path.join(tmpDir, `${slugify(card.name)}.svg`), compositedSvg, 'utf8');
    }

    await withOutDirLock(async () => {
```
Replace with:
```js
async function main(client = createMockLeonardoClient()) {
  const briefs = loadBriefs();
  const altBriefs = loadAltBriefs();
  const cardsByName = new Map(loadAllCards().map((card) => [card.name, card]));
  const baseBriefNames = new Set(briefs.map((brief) => brief.cardName));

  const tmpDir = `${OUT_DIR}.tmp-${process.pid}-${crypto.randomBytes(6).toString('hex')}`;
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    for (const brief of briefs) {
      const card = cardsByName.get(brief.cardName);
      if (!card) {
        throw new Error(`art-briefs.md brief "${brief.cardName}" has no matching card in design/cards/*.md`);
      }

      const baseSvg = renderCardSvg(card);
      const { href } = await client.generateArt({ cardName: card.name, brief: brief.text });
      const compositedSvg = compositeArtWindow(baseSvg, href);

      fs.writeFileSync(path.join(tmpDir, `${slugify(card.name)}.svg`), compositedSvg, 'utf8');
    }

    for (const altBrief of altBriefs) {
      const card = cardsByName.get(altBrief.cardName);
      if (!card) {
        throw new Error(`alt-art-briefs.md brief "${altBrief.cardName}" has no matching card in design/cards/*.md`);
      }
      if (!baseBriefNames.has(altBrief.cardName)) {
        throw new Error(`alt-art-briefs.md brief "${altBrief.cardName}" has no base brief in design/cards/art-briefs.md`);
      }

      const baseSvg = renderCardSvg(card);
      const { href } = await client.generateArt({ cardName: card.name, brief: altBrief.text });
      const compositedSvg = compositeArtWindow(baseSvg, href);

      fs.writeFileSync(path.join(tmpDir, `${slugify(card.name)}-alt.svg`), compositedSvg, 'utf8');
    }

    await withOutDirLock(async () => {
```

Note: both loops write into the same `tmpDir`, which then gets atomically
swapped onto `OUT_DIR` by the existing (untouched) `withOutDirLock` block
below it. This is why the alt pass needs no locking of its own — it rides
the same atomic swap the base pass already uses.

### 2d. Update the completion log line

Find:
```js
  console.log(
    `Composited ${briefs.length} card art window(s) into ${path.relative(REPO_ROOT, OUT_DIR).split(path.sep).join('/')}/`
  );
```
Replace with:
```js
  console.log(
    `Composited ${briefs.length} card art window(s)` +
      `${altBriefs.length ? ` plus ${altBriefs.length} alt-art window(s)` : ''}` +
      ` into ${path.relative(REPO_ROOT, OUT_DIR).split(path.sep).join('/')}/`
  );
```

### 2e. Export `loadAltBriefs`

Find:
```js
module.exports = {
  main,
  runCli,
  createMockLeonardoClient,
  compositeArtWindow,
  loadBriefs,
  ART_WINDOW_X,
  ART_WINDOW_Y,
  ART_WINDOW_WIDTH,
  ART_WINDOW_HEIGHT,
};
```
Replace with:
```js
module.exports = {
  main,
  runCli,
  createMockLeonardoClient,
  compositeArtWindow,
  loadBriefs,
  loadAltBriefs,
  ART_WINDOW_X,
  ART_WINDOW_Y,
  ART_WINDOW_WIDTH,
  ART_WINDOW_HEIGHT,
};
```

That's the entire source change. `tools/render-card.js` is not touched;
`renderCardSvg(card)` is called a second time (once per alt brief) with the
exact same `card` object already looked up for the base pass, so its output
is byte-identical between the base and alt call for the same card — this is
what makes AC4 (Name Slot/Cost Slot/Type Line/Rules-Text Box/Stats Corner
byte-identical) true "for free," with no special-casing needed.

## Step 3 — fix the two existing test assertions

File: `test/composite-card-art.test.js`.

### 3a. Add the alt-briefs path + a title-listing helper

Find:
```js
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
```
Replace with:
```js
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
const ALT_BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'alt-art-briefs.md');
```

Find:
```js
function listBriefTitles() {
  const content = fs.readFileSync(BRIEFS_PATH, 'utf8');
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => s.title);
}
```
Replace with:
```js
function listBriefTitles() {
  const content = fs.readFileSync(BRIEFS_PATH, 'utf8');
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => s.title);
}

function listAltBriefTitles() {
  if (!fs.existsSync(ALT_BRIEFS_PATH)) return [];
  const content = fs.readFileSync(ALT_BRIEFS_PATH, 'utf8');
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => s.title);
}
```

### 3b. Scope the AC1 file-count check to non-alt files

Find (inside `'AC1: node tools/composite-card-art.js exits 0 and writes exactly one composited SVG per brief section'`):
```js
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg'));
  assert.strictEqual(
    files.length,
    titles.length,
    `expected exactly ${titles.length} composited SVGs, found ${files.length}: [${files.join(', ')}]`
  );

  const expectedFiles = new Set(titles.map((t) => `${slugify(t)}.svg`));
  for (const file of files) {
    assert.ok(expectedFiles.has(file), `unexpected output file ${file} does not match any brief section`);
  }
```
Replace with:
```js
  // "-alt.svg" files are a separate, additive concern owned by
  // test/composite-card-art-alt.test.js — excluded here so this check
  // stays exactly "one base SVG per base brief section", unchanged from
  // before alt-art existed.
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg') && !f.endsWith('-alt.svg'));
  assert.strictEqual(
    files.length,
    titles.length,
    `expected exactly ${titles.length} composited SVGs, found ${files.length}: [${files.join(', ')}]`
  );

  const expectedFiles = new Set(titles.map((t) => `${slugify(t)}.svg`));
  for (const file of files) {
    assert.ok(expectedFiles.has(file), `unexpected output file ${file} does not match any brief section`);
  }
```

### 3c. Count alt-brief calls in the injected-client test

Find (inside `'AC3: image generation is injected via a client argument — a custom client\'s output is used instead of the default'`):
```js
  const titles = listBriefTitles();
  assert.ok(titles.length > 0, 'expected at least one brief in design/cards/art-briefs.md');
  const firstTitle = titles[0];
```
Replace with:
```js
  const titles = listBriefTitles();
  const altTitles = listAltBriefTitles();
  assert.ok(titles.length > 0, 'expected at least one brief in design/cards/art-briefs.md');
  const firstTitle = titles[0];
```

Find:
```js
  assert.strictEqual(
    seenBriefs.length,
    titles.length,
    `expected the injected client's generateArt to be called once per brief (${titles.length}), was called ${seenBriefs.length} times`
  );
```
Replace with:
```js
  assert.strictEqual(
    seenBriefs.length,
    titles.length + altTitles.length,
    `expected the injected client's generateArt to be called once per brief and once per alt brief ` +
      `(${titles.length} + ${altTitles.length}), was called ${seenBriefs.length} times`
  );
```

No other lines in this file change. In particular, do not touch the AC2
image-bounds test, the AC3 fetch/http/env-var static check, or the final
`await composite.main();` restoration call at the end of the injected-client
test — that call now regenerates alt files too, which is correct and
requires no edit.

## Step 4 — new test file: `test/design-alt-art-briefs.test.js`

This mirrors the existing `test/design-art-briefs.test.js` pattern (same
`parseSections` helper, same style of field-presence checks) but scoped to
the new file. Create it with exactly this content:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const ALT_BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'alt-art-briefs.md');
const BASE_BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');

const EXPECTED_TITLES = ['Sporeknit Warden', 'Salvage-Wrought Bastion', 'Replicant Foundry Core'];

const FIELD_PREFIXES = ['Palette:', 'Subject/Scene:', 'Key visual elements:', 'Composition:'];

function isFieldStart(line) {
  return FIELD_PREFIXES.some((prefix) => line.startsWith(prefix));
}

// Joins a field's soft-wrapped continuation lines (the same wrap
// convention art-briefs.md already uses) until a blank line or the next
// field label — mirrors consumeField() in lib/parse-card-markdown.js.
function extractField(lines, prefix) {
  const idx = lines.findIndex((l) => l.startsWith(prefix));
  if (idx === -1) return null;
  const parts = [lines[idx].slice(prefix.length).trim()];
  let i = idx + 1;
  while (i < lines.length && lines[i].trim() !== '' && !isFieldStart(lines[i])) {
    parts.push(lines[i].trim());
    i++;
  }
  return parts.join(' ').trim();
}

// Small connector-word stopword list — deliberately does not include
// domain nouns (Warden, Generator, Growth, ...) so overlap counts reflect
// genuine subject/scene repetition, not shared prepositions.
const STOPWORDS = new Set([
  'this', 'that', 'with', 'from', 'your', 'their', 'which', 'while', 'above',
  'being', 'there', 'where', 'about', 'after', 'before', 'under', 'between',
  'during', 'without', 'within', 'than', 'rather', 'into', 'onto', 'upon',
  'toward', 'across', 'around', 'beside', 'beneath', 'atop', 'amid', 'along',
]);

function significantWords(text) {
  const words = text.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || [];
  return new Set(words.filter((w) => !STOPWORDS.has(w)));
}

function readFile(p) {
  assert.ok(fs.existsSync(p), `expected ${p} to exist`);
  return fs.readFileSync(p, 'utf8');
}

function briefSections(content) {
  return parseSections(content).filter((s) => s.level === 3);
}

const altContent = readFile(ALT_BRIEFS_PATH);
const baseContent = readFile(BASE_BRIEFS_PATH);
const altSections = briefSections(altContent);
const baseSections = briefSections(baseContent);

// ---------------------------------------------------------------------------
// AC1: design/cards/alt-art-briefs.md exists and contains exactly 3 "###"
// brief sections, titled verbatim, each with the same
// Palette/Subject-Scene/Key visual elements/Composition shape art-briefs.md
// already uses.
// ---------------------------------------------------------------------------

test('AC1: design/cards/alt-art-briefs.md exists', () => {
  assert.ok(fs.existsSync(ALT_BRIEFS_PATH), `expected ${ALT_BRIEFS_PATH} to exist`);
});

test('AC1: alt-art-briefs.md has exactly 3 "###" sections titled verbatim', () => {
  const titles = altSections.map((s) => s.title);
  assert.strictEqual(
    titles.length,
    3,
    `expected exactly 3 brief sections, found ${titles.length}: [${titles.join(', ')}]`
  );
  assert.deepStrictEqual(
    [...titles].sort(),
    [...EXPECTED_TITLES].sort(),
    `expected titles ${JSON.stringify(EXPECTED_TITLES)}, got ${JSON.stringify(titles)}`
  );
});

for (const title of EXPECTED_TITLES) {
  test(`AC1: "${title}" alt brief has Palette/Subject-Scene/Key visual elements/Composition lines`, () => {
    const section = altSections.find((s) => s.title === title);
    assert.ok(section, `expected an alt brief section titled "${title}"`);
    const body = section.lines.join('\n');

    assert.ok(/Palette:\s*\S/.test(body), `expected a "Palette:" line in the "${title}" alt brief`);
    assert.ok(
      extractField(section.lines, 'Subject/Scene:'),
      `expected a "Subject/Scene:" line in the "${title}" alt brief`
    );
    assert.ok(
      /Key visual elements:\s*\n(?:\s*-\s*.+\n?){2,}/i.test(body + '\n'),
      `expected a "Key visual elements:" bulleted list (2+ items) in the "${title}" alt brief`
    );
    assert.ok(/Composition:\s*\S/.test(body), `expected a "Composition:" line in the "${title}" alt brief`);
  });
}

// ---------------------------------------------------------------------------
// AC2 (inferred): each alt brief's Subject/Scene line shares fewer than half
// its significant words with that same card's existing base brief's
// Subject/Scene line — a genuinely different scene, not a restatement.
// ---------------------------------------------------------------------------

for (const title of EXPECTED_TITLES) {
  test(`AC2: "${title}" alt brief's Subject/Scene describes a genuinely different scene than its base brief`, () => {
    const altSection = altSections.find((s) => s.title === title);
    const baseSection = baseSections.find((s) => s.title === title);
    assert.ok(altSection, `expected an alt brief section titled "${title}"`);
    assert.ok(baseSection, `expected a base brief section titled "${title}" in art-briefs.md`);

    const altSubject = extractField(altSection.lines, 'Subject/Scene:');
    const baseSubject = extractField(baseSection.lines, 'Subject/Scene:');
    assert.ok(altSubject, `expected a "Subject/Scene:" line in the "${title}" alt brief`);
    assert.ok(baseSubject, `expected a "Subject/Scene:" line in the "${title}" base brief`);

    const altWords = significantWords(altSubject);
    const baseWords = significantWords(baseSubject);
    const overlap = [...altWords].filter((w) => baseWords.has(w));

    assert.ok(
      overlap.length < altWords.size / 2,
      `expected "${title}"'s alt Subject/Scene to share fewer than half its significant words with the base ` +
        `brief (${overlap.length}/${altWords.size} shared: [${overlap.join(', ')}]) — describe a genuinely ` +
        `different scene`
    );
  });
}
```

## Step 5 — new test file: `test/composite-card-art-alt.test.js`

Create with exactly this content:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const RENDER_SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'render-card.js');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'composite-card-art.js');
const ALT_BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'alt-art-briefs.md');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function listAltBriefTitles() {
  const content = fs.readFileSync(ALT_BRIEFS_PATH, 'utf8');
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => s.title);
}

let renderError = null;
let runError = null;

// node's test runner gives each *.test.js file its own process, so this
// file re-runs the render + composite CLIs itself rather than assuming
// composite-card-art.test.js's own test.before() already ran in this
// process (or ran first).
test.before(() => {
  try {
    execFileSync('node', [RENDER_SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    renderError = err;
  }
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    runError = err;
  }
});

const ALT_TITLES = listAltBriefTitles();

// ---------------------------------------------------------------------------
// AC3: writes exactly one <slug>-alt.svg per alt brief, no others.
// ---------------------------------------------------------------------------

test('AC3: node tools/composite-card-art.js writes exactly one <slug>-alt.svg per alt brief', () => {
  assert.ok(
    !renderError,
    `setup failed: node tools/render-card.js must succeed, got: ${renderError && (renderError.message + '\n' + (renderError.stdout || '') + (renderError.stderr || ''))}`
  );
  assert.ok(
    !runError,
    `expected node tools/composite-card-art.js to exit 0, got: ${runError && (runError.message + '\n' + (runError.stdout || '') + (runError.stderr || ''))}`
  );

  assert.strictEqual(ALT_TITLES.length, 3, `expected exactly 3 alt briefs, found ${ALT_TITLES.length}`);

  const altFiles = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('-alt.svg'));
  assert.strictEqual(
    altFiles.length,
    ALT_TITLES.length,
    `expected exactly ${ALT_TITLES.length} "-alt.svg" files, found ${altFiles.length}: [${altFiles.join(', ')}]`
  );

  const expected = new Set(ALT_TITLES.map((t) => `${slugify(t)}-alt.svg`));
  for (const file of altFiles) {
    assert.ok(expected.has(file), `unexpected "-alt.svg" file for a card not named in alt-art-briefs.md: ${file}`);
  }
  for (const title of ALT_TITLES) {
    const file = path.join(OUT_DIR, `${slugify(title)}-alt.svg`);
    assert.ok(fs.existsSync(file), `expected ${file} to exist`);
  }
});

test('AC3: the base <slug>.svg for each alt-art card still exists alongside its "-alt.svg"', () => {
  assert.ok(!runError, 'compositing script must succeed before its output can be checked');
  for (const title of ALT_TITLES) {
    const baseFile = path.join(OUT_DIR, `${slugify(title)}.svg`);
    assert.ok(fs.existsSync(baseFile), `expected the base ${baseFile} to still exist alongside its "-alt.svg"`);
  }
});

// ---------------------------------------------------------------------------
// AC4 (held_out): Name Slot, Cost Slot, Type Line, Rules-Text Box, Stats
// Corner content in <slug>-alt.svg is byte-identical to <slug>.svg; only the
// art-window <image> href differs.
// ---------------------------------------------------------------------------

test('AC4: each <slug>-alt.svg is identical to <slug>.svg outside the art-window <image> element', () => {
  assert.ok(!runError, 'compositing script must succeed before its output can be checked');
  const IMAGE_RE = /<image class="art-window"[^>]*\/>/;

  for (const title of ALT_TITLES) {
    const slug = slugify(title);
    const baseSvg = fs.readFileSync(path.join(OUT_DIR, `${slug}.svg`), 'utf8');
    const altSvg = fs.readFileSync(path.join(OUT_DIR, `${slug}-alt.svg`), 'utf8');

    const baseImageMatch = baseSvg.match(IMAGE_RE);
    const altImageMatch = altSvg.match(IMAGE_RE);
    assert.ok(baseImageMatch, `expected an <image class="art-window"> element in "${title}"'s base SVG`);
    assert.ok(altImageMatch, `expected an <image class="art-window"> element in "${title}"'s alt SVG`);

    const baseRest = baseSvg.replace(IMAGE_RE, '');
    const altRest = altSvg.replace(IMAGE_RE, '');
    assert.strictEqual(
      altRest,
      baseRest,
      `expected "${title}"'s alt SVG to be byte-identical to its base SVG outside the art-window <image> ` +
        `element (Name Slot, Cost Slot, Type Line, Rules-Text Box, Stats Corner)`
    );

    const baseHref = /\bhref="([^"]+)"/.exec(baseImageMatch[0])[1];
    const altHref = /\bhref="([^"]+)"/.exec(altImageMatch[0])[1];
    assert.notStrictEqual(altHref, baseHref, `expected "${title}"'s alt art-window href to differ from its base href`);
  }
});

// ---------------------------------------------------------------------------
// Intent: an alt brief naming a card with no base brief throws a clear
// error rather than silently skipping it. (Not independently exercised
// end-to-end here to avoid mutating the shipped alt-art-briefs.md fixture
// mid-suite; verified as a static source check instead.)
// ---------------------------------------------------------------------------

test('composite-card-art.js source throws a clear error for an alt brief with no base brief', () => {
  const source = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(
    /has no base brief/i.test(source),
    'expected composite-card-art.js to throw a clear error when an alt brief names a card with no base brief'
  );
});
```

## Verification steps (run these yourself before calling the unit done)

1. `node tools/render-card.js` — must exit 0 (unrelated pre-req, already
   shipped).
2. `node tools/composite-card-art.js` — must exit 0. Expected stdout:
   `Composited 28 card art window(s) plus 3 alt-art window(s) into renders/cards-composited/`
   (the exact base count may differ if other in-flight units changed
   `art-briefs.md`'s brief count — that's fine, "28" is today's count, not a
   hard requirement).
3. List `renders/cards-composited/`: should contain the original files plus
   exactly 3 new ones: `sporeknit-warden-alt.svg`,
   `salvage-wrought-bastion-alt.svg`, `replicant-foundry-core-alt.svg`.
4. `node --test` — expect all tests passing, 0 failing. This includes the
   full pre-existing suite (unaffected outside the two edits in Step 3) plus
   the new tests from Steps 4 and 5.
5. Confirm via `git diff --stat` (or equivalent) that the only files touched
   are: `design/cards/alt-art-briefs.md` (new), `tools/composite-card-art.js`
   (modified), `test/composite-card-art.test.js` (modified),
   `test/design-alt-art-briefs.test.js` (new),
   `test/composite-card-art-alt.test.js` (new). Nothing else — in
   particular, confirm `design/cards/art-briefs.md`,
   `design/cards/alpha-set.md`, `design/cards/frontier-set.md`,
   `design/cards/character-signatures.md`, and `tools/render-card.js` show
   no diff at all.

## Risk assessment (FIRE)

- **Reversibility**: fully reversible; every change is additive (new file,
  new functions, new loop, new test files) plus two widening test-assertion
  edits. `git revert` cleanly undoes it.
- **Security impact**: none. No new I/O beyond reading one more local
  markdown file and writing 3 more local SVG files; no network, no secrets,
  no new dependencies.
- **User data**: none touched; this is a design-asset pipeline with no
  runtime user data.
- **Schema changes**: none.

Low risk, unambiguous spec, no held-out-AC spec bug found (AC4 is a natural
elaboration of the already-shipped Alt-Art layer definition in
card-anatomy.md, not a novel requirement). `GATE: none`.
