GATE: none

# Unit: cardgame-art-compositing-dryrun

## Summary

Build `tools/composite-card-art.js`. It reads `design/cards/art-briefs.md` (18
`###` brief sections, one per card in `design/cards/alpha-set.md`), and for
each brief: renders that card's full placeholder SVG using the **existing**
layout engine in `tools/render-card.js`, asks an **injectable art-generation
client** for an image, and swaps the Art Window's placeholder `<rect>`+label
for an `<image>` sized to the exact same bounds the placeholder rect used.
Output goes to `renders/cards-composited/<slug>.svg`, one file per brief.

The default (and only, for this unit) client is a deterministic mock: no
network calls, no API key, same output every run. A real Leonardo-backed
client is explicitly out of scope (per the unit intent) — it would be a
different object passed into the same `generateArt(...)` call.

### Design decision: where the Art Window bounds come from

`design/cards/card-anatomy.md` describes the Art Window only in prose ("the
large rectangular window beneath the Name Slot") — it has **no numeric
bounds**. The actual numbers (`x=24, y=94, width=702, height=420`) live only
in `tools/render-card.js`'s geometry constants, which is the executable
implementation of card-anatomy.md's zone layout. AC2's phrase "bounds defined
in design/cards/card-anatomy.md" is read as "the bounds that implement
card-anatomy.md's Art Window zone" — i.e. render-card.js's constants — not a
literal number that must appear in the .md file. This is not treated as a
spec bug (it's redundant with the visible intent, just imprecisely worded),
so no GATE.

To guarantee the composited `<image>` bounds can never drift out of sync
with the placeholder rect they replace, `composite-card-art.js` does **not**
hardcode a second copy of those numbers. Instead it:
1. Imports the geometry constants and the `renderCardSvg`/`loadAllCards`
   functions directly from `tools/render-card.js` (small, additive export
   change — see File 2 below).
2. Renders the full card SVG exactly as `render-card.js` would.
3. Regex-replaces the placeholder `<rect class="art-window".../>` +
   `<text>Art Placeholder</text>` pair with an `<image>` using those same
   imported bounds.

This also means every other zone in a composited SVG (frame bands, name,
cost pips, type line, rules text, stats corner) is byte-identical to what
`renders/cards/<slug>.svg` already contains — only the Art Window differs.

## Risk self-assessment (FIRE)

- **Reversibility:** high. All changes are new files or small additive
  exports guarded by `require.main === module`, which preserves every
  existing script's CLI behavior exactly (verified below).
- **Security impact:** none. No network calls, no secrets, no API keys in
  the default path.
- **User data:** none touched.
- **Schema changes:** none.

Low-risk, mechanical unit → **GATE: none**.

---

## File 1 (modify): `lib/parse-card-markdown.js`

Only the last line changes — export the already-existing internal
`splitIntoH3Sections` helper so `composite-card-art.js` can reuse it to parse
`art-briefs.md`'s `###` sections without duplicating that logic. No behavior
change to any existing export.

Find:
```js
module.exports = { parseCardMarkdown, slugify };
```

Replace with:
```js
module.exports = { parseCardMarkdown, slugify, splitIntoH3Sections };
```

That's the only change to this file.

---

## File 2 (modify): `tools/render-card.js`

Two changes, both at the very bottom of the file, both additive:

1. Guard the `main()` call so requiring this file as a library (from
   `composite-card-art.js`) does **not** re-run its CLI side effects
   (reading `design/cards/*.md` and rewriting `renders/cards/*.svg`).
2. Export the geometry constants, `loadAllCards`, `renderCardSvg`, and
   `escapeXml` so `composite-card-art.js` can reuse them instead of
   duplicating ~150 lines of SVG-building logic.

Find (the last two lines of the file):
```js
main();
```

Replace with:
```js
if (require.main === module) {
  main();
}

module.exports = {
  INNER_X,
  INNER_Y,
  INNER_WIDTH,
  NAME_SLOT_HEIGHT,
  ART_WINDOW_HEIGHT,
  loadAllCards,
  renderCardSvg,
  escapeXml,
};
```

**Why this is safe:** `test/render-card.test.js` invokes this script via
`execFileSync('node', [SCRIPT_PATH])` — when Node runs a file directly as the
entry script, `require.main === module` is `true`, so `main()` still runs
exactly as before and that test suite is unaffected. Confirm this by running
`node --test test/render-card.test.js` after making the change — it must
still report all tests passing, 0 failures.

---

## File 3 (create): `tools/composite-card-art.js`

```js
#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {
  INNER_X,
  INNER_Y,
  INNER_WIDTH,
  NAME_SLOT_HEIGHT,
  ART_WINDOW_HEIGHT,
  loadAllCards,
  renderCardSvg,
  escapeXml,
} = require('./render-card');
const { slugify, splitIntoH3Sections } = require('../lib/parse-card-markdown');

const REPO_ROOT = path.join(__dirname, '..');
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');

// ---------------------------------------------------------------------------
// Art Window bounds — inherited from tools/render-card.js's own geometry so
// this never duplicates (and can't drift from) the numbers the layout engine
// actually draws the placeholder rect with.
// ---------------------------------------------------------------------------

const ART_WINDOW_X = INNER_X;
const ART_WINDOW_Y = INNER_Y + NAME_SLOT_HEIGHT;
const ART_WINDOW_WIDTH = INNER_WIDTH;

// ---------------------------------------------------------------------------
// Brief loading — design/cards/art-briefs.md, one brief per "###" section
// ---------------------------------------------------------------------------

function loadBriefs() {
  const markdown = fs.readFileSync(BRIEFS_PATH, 'utf8');
  return splitIntoH3Sections(markdown).map((section) => ({
    cardName: section.title,
    text: section.lines.join('\n').trim(),
  }));
}

// ---------------------------------------------------------------------------
// Injectable art-generation client.
//
// generateArt({ cardName, brief }) -> Promise<{ href: string }>
//
// The default client is a deterministic mock: `href` is a data: URI built
// from a SHA-256 hash of the card name + brief text, so it never changes
// between runs, never touches the network, and never needs a Leonardo API
// key. A real Leonardo-backed client is a separate, later decision — pass a
// different client into main() to use one.
// ---------------------------------------------------------------------------

function mockArtSvg({ cardName, brief }) {
  const hash = crypto.createHash('sha256').update(`${cardName}\n${brief}`, 'utf8').digest('hex');
  const hue = parseInt(hash.slice(0, 6), 16) % 360;
  const color = `hsl(${hue}, 45%, 55%)`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ART_WINDOW_WIDTH}" height="${ART_WINDOW_HEIGHT}">`,
    `<rect width="100%" height="100%" fill="${color}"/>`,
    `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#14151a">${escapeXml(cardName)}</text>`,
    `</svg>`,
  ].join('');
}

function createMockLeonardoClient() {
  return {
    async generateArt({ cardName, brief }) {
      const svg = mockArtSvg({ cardName, brief });
      const href = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
      return { href };
    },
  };
}

// ---------------------------------------------------------------------------
// Compositing — swap the Art Window placeholder rect+label for an <image>
// ---------------------------------------------------------------------------

const ART_WINDOW_PLACEHOLDER_RE = /<rect class="art-window"[^>]*\/>\n<text[^>]*>Art Placeholder<\/text>/;

function compositeArtWindow(baseSvg, href) {
  if (!ART_WINDOW_PLACEHOLDER_RE.test(baseSvg)) {
    throw new Error('could not find the Art Window placeholder block in the rendered card SVG');
  }
  const imageTag =
    `<image class="art-window" x="${ART_WINDOW_X}" y="${ART_WINDOW_Y}" width="${ART_WINDOW_WIDTH}" ` +
    `height="${ART_WINDOW_HEIGHT}" href="${href}" preserveAspectRatio="xMidYMid slice"/>`;
  return baseSvg.replace(ART_WINDOW_PLACEHOLDER_RE, imageTag);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(client = createMockLeonardoClient()) {
  const briefs = loadBriefs();
  const cardsByName = new Map(loadAllCards().map((card) => [card.name, card]));

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const brief of briefs) {
    const card = cardsByName.get(brief.cardName);
    if (!card) {
      throw new Error(`art-briefs.md brief "${brief.cardName}" has no matching card in design/cards/*.md`);
    }

    const baseSvg = renderCardSvg(card);
    const { href } = await client.generateArt({ cardName: card.name, brief: brief.text });
    const compositedSvg = compositeArtWindow(baseSvg, href);

    fs.writeFileSync(path.join(OUT_DIR, `${slugify(card.name)}.svg`), compositedSvg, 'utf8');
  }

  console.log(
    `Composited ${briefs.length} card art window(s) into ${path.relative(REPO_ROOT, OUT_DIR).split(path.sep).join('/')}/`
  );
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack || err.message || String(err));
    process.exitCode = 1;
  });
}

module.exports = {
  main,
  createMockLeonardoClient,
  compositeArtWindow,
  loadBriefs,
  ART_WINDOW_X,
  ART_WINDOW_Y,
  ART_WINDOW_WIDTH,
  ART_WINDOW_HEIGHT,
};
```

### Expected manual-run output

```
$ node tools/composite-card-art.js
Composited 18 card art window(s) into renders/cards-composited/
$ echo $?
0
```

`renders/cards-composited/` will contain 18 files, one per brief, named like
`renders/cards/` already is: `unwritten-hour.svg`, `oathbreaker-s-toll.svg`,
`echo-recall.svg`, `replicant-foundry-core.svg`, `firmware-sentinel.svg`,
`drone-cascade.svg`, `foreknowledge-cipher.svg`, `whispered-contract.svg`,
`static-ambush.svg`, `sporeknit-warden.svg`, `feral-bloomcaller.svg`,
`rootbind-thicket.svg`, `salvage-wrought-bastion.svg`,
`line-fleet-trooper.svg`, `cinder-forged-plating.svg`,
`wrought-bloom-graft.svg`, `signal-wrought-prototype.svg`,
`tangle-forged-bolt.svg`.

Each file's Art Window slot will contain, in place of the old
`<rect class="art-window" .../><text ...>Art Placeholder</text>`:

```xml
<image class="art-window" x="24" y="94" width="702" height="420" href="data:image/svg+xml;base64,...." preserveAspectRatio="xMidYMid slice"/>
```

Do **not** add `renders/cards-composited/` to `.gitignore` — `renders/cards/`
is already tracked in git (see `git status` at session start showing those
SVGs as modified), so the composited output should follow the same
convention and be committed.

---

## File 4 (create): `test/composite-card-art.test.js`

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'composite-card-art.js');
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');

const { slugify, splitIntoH3Sections } = require('../lib/parse-card-markdown');
const composite = require('../tools/composite-card-art');

function listBriefTitles() {
  const markdown = fs.readFileSync(BRIEFS_PATH, 'utf8');
  return splitIntoH3Sections(markdown).map((s) => s.title);
}

function hashOutDir() {
  const hashes = {};
  for (const title of listBriefTitles()) {
    const file = path.join(OUT_DIR, `${slugify(title)}.svg`);
    hashes[title] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  }
  return hashes;
}

let runError = null;

test.before(() => {
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    runError = err;
  }
});

// ---------------------------------------------------------------------------
// AC1: running `node tools/composite-card-art.js` exits 0 and writes exactly
// one composited SVG per brief section in design/cards/art-briefs.md into
// renders/cards-composited/.
// ---------------------------------------------------------------------------

test('AC1: node tools/composite-card-art.js exits 0 and writes exactly one composited SVG per brief section', () => {
  assert.ok(
    !runError,
    `expected the script to exit 0, got: ${runError && (runError.message + '\n' + (runError.stdout || '') + (runError.stderr || ''))}`
  );

  const titles = listBriefTitles();
  assert.ok(titles.length > 0, 'expected at least one brief section in design/cards/art-briefs.md');
  assert.ok(fs.existsSync(OUT_DIR), `expected ${OUT_DIR} to exist after running the script`);

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
});

// ---------------------------------------------------------------------------
// AC2: each composited SVG's Art Window slot contains an <image> element
// (not the placeholder rect) positioned and sized to match the Art Window
// bounds.
// ---------------------------------------------------------------------------

test('AC2: composited SVGs hold an <image> in the Art Window slot, sized to the layout engine bounds, placeholder rect gone', () => {
  assert.ok(!runError, 'compositing script must succeed before its output can be checked');

  const titles = listBriefTitles();
  for (const title of titles) {
    const file = path.join(OUT_DIR, `${slugify(title)}.svg`);
    const svg = fs.readFileSync(file, 'utf8');

    assert.ok(
      !/<rect[^>]*class="art-window"/.test(svg),
      `expected "${title}"'s composited SVG to have no remaining art-window placeholder rect`
    );

    const imageMatch = svg.match(/<image[^>]*class="art-window"[^>]*\/>/);
    assert.ok(imageMatch, `expected an <image class="art-window"> element in "${title}"'s composited SVG`);

    const tag = imageMatch[0];
    assert.strictEqual(Number(/\bx="([-\d.]+)"/.exec(tag)[1]), composite.ART_WINDOW_X);
    assert.strictEqual(Number(/\by="([-\d.]+)"/.exec(tag)[1]), composite.ART_WINDOW_Y);
    assert.strictEqual(Number(/\bwidth="([-\d.]+)"/.exec(tag)[1]), composite.ART_WINDOW_WIDTH);
    assert.strictEqual(Number(/\bheight="([-\d.]+)"/.exec(tag)[1]), composite.ART_WINDOW_HEIGHT);
    assert.ok(/href="/.test(tag), `expected the <image> element to carry an href in "${title}"'s composited SVG`);
  }
});

// ---------------------------------------------------------------------------
// AC3 (inferred): image generation goes through an injectable client; the
// default/test client is a deterministic mock that makes no network calls
// and requires no Leonardo API key.
// ---------------------------------------------------------------------------

test('AC3: default client is an injectable, deterministic mock requiring no network access or Leonardo API key', () => {
  const source = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(!/\bfetch\s*\(/.test(source), 'expected no fetch() calls to a real image-generation service');
  assert.ok(
    !/require\(\s*['"]https?['"]\s*\)/.test(source),
    'expected no built-in http(s) module usage for a live API call'
  );
  assert.ok(
    !/process\.env\.\w*LEONARDO\w*/i.test(source),
    'expected the default path to never read a Leonardo API key from the environment'
  );

  assert.strictEqual(typeof composite.createMockLeonardoClient, 'function');
  assert.strictEqual(typeof composite.main, 'function');
});

test('AC3: main() succeeds with the default mock client even with no LEONARDO_API_KEY set', async () => {
  const previousKey = process.env.LEONARDO_API_KEY;
  delete process.env.LEONARDO_API_KEY;
  try {
    await assert.doesNotReject(composite.main());
  } finally {
    if (previousKey !== undefined) process.env.LEONARDO_API_KEY = previousKey;
  }
});

// ---------------------------------------------------------------------------
// AC4 (held_out): running the script twice in a row with the mock client
// produces byte-identical output across all composited SVGs.
// ---------------------------------------------------------------------------

test('AC4: running the script twice in a row produces byte-identical composited SVGs', () => {
  assert.ok(!runError, 'compositing script must succeed before its output can be checked');
  const firstRunHashes = hashOutDir();

  execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  const secondRunHashes = hashOutDir();

  assert.deepStrictEqual(secondRunHashes, firstRunHashes, 'expected identical SHA-256 hashes across two runs');
});
```

### Expected `node --test` output

All tests in the repo (existing suites + this new one) pass. The new file
alone contributes 5 `test(...)` blocks, all green, 0 failures. Example tail
of `node --test` output:

```
# pass 5
# fail 0
```

(exact aggregate pass count across the whole repo will be higher — just
confirm 0 fail, 0 cancelled for the full run).

---

## Build order for the implementer

1. Edit `lib/parse-card-markdown.js` (File 1) — one-line export change.
2. Edit `tools/render-card.js` (File 2) — guard `main()`, add exports.
3. Run `node --test test/render-card.test.js` — must still pass, confirming
   File 2's change didn't break the existing CLI behavior.
4. Create `tools/composite-card-art.js` (File 3).
5. Run `node tools/composite-card-art.js` manually once — confirm exit code
   0, confirm the console line, confirm `renders/cards-composited/` has 18
   `.svg` files, spot-check one file's Art Window slot by eye (`<image
   class="art-window" x="24" y="94" width="702" height="420" .../>`, no
   `<rect class="art-window"`).
6. Create `test/composite-card-art.test.js` (File 4).
7. Run `node --test` (full suite) — must be all green.
