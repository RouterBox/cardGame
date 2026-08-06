GATE: none

# Unit: cardgame-site-embeds-composited-card-art

## Summary

`tools/build-site.js` currently renders every `design/cards/*.md` page through
plain markdown → HTML with no awareness of `renders/cards-composited/`. This
plan makes it, for pages under `design/cards/` only, insert an `<img
class="card-art">` right after each card's rendered `<h3>` when a matching
`renders/cards-composited/<slug>.svg` exists — copying that SVG's current
bytes into `site/_card-art/<slug>.svg` as part of the same build. Cards with
no composited render get no image and no error.

Only one file changes: **`tools/build-site.js`**. One new test file is added:
**`test/build-site-card-art.test.js`**. Nothing else (not
`lib/parse-card-markdown.js`, not `composite-card-art.js`, not
`serve-site.js`, not any `design/cards/*.md` file) is touched.

## Why no changes are needed outside build-site.js

- `lib/parse-card-markdown.js` already exports `slugify` — reuse it, don't
  duplicate it.
- `tools/serve-site.js`'s `resolveFilePath()` already serves *any* file under
  `site/` generically (it just joins the request path onto `SITE_DIR` and
  checks containment) — a new `site/_card-art/<slug>.svg` file needs no
  special-casing there.
- `slugify()` strips every character that isn't `[a-z0-9]` down to single
  hyphens, so a card name can never produce a slug containing `/`, `..`, or
  any other path-traversal token. The copy destination is always a flat file
  directly inside `site/_card-art/`.

## Repo facts confirmed before writing this plan

- Card names with an existing composited render today (confirmed present in
  `renders/cards-composited/`): everything in `design/cards/alpha-set.md`,
  all 5 cards in `design/cards/frontier-set.md`, and all 5 characters in
  `design/cards/character-signatures.md`. Example used below: **"Line-Fleet
  Trooper"** in `design/cards/alpha-set.md` (heading text at
  `design/cards/alpha-set.md:160`) → `renders/cards-composited/line-fleet-trooper.svg`
  exists.
- Card names with **no** composited render today: everything in
  `design/cards/fount-economy-set.md`, `design/cards/wormhole-restrictions-set.md`,
  and `design/cards/character-signatures-wave-2.md` (none of these are in
  `design/cards/art-briefs.md`, so `composite-card-art.js` never produced
  output for them). Example used below: **"Cradle-Root Colony"** in
  `design/cards/fount-economy-set.md` (heading at line 30) — no
  `renders/cards-composited/cradle-root-colony.svg` file exists.
- The unit spec's framing ("most of frontier-set.md and
  character-signatures.md... per the still-open
  art-briefs-frontier-signatures proposal") is stale relative to the current
  repo state — that proposal has apparently already landed for those two
  files. This doesn't change anything about the plan: the code must check
  file existence dynamically, not hard-code which sets have art. Flagging it
  here only so you don't go looking for a "no art yet" fixture in the wrong
  file.

## Step 1 — Edit `tools/build-site.js`

### 1a. Add the `slugify` import and two new path constants

Find (near the top, right after the existing `const LOCK_PATH = ...` line,
around line 11):

```js
const LOCK_PATH = path.join(REPO_ROOT, '.site-build.lock');
```

Add immediately after it:

```js
const LOCK_PATH = path.join(REPO_ROOT, '.site-build.lock');
const COMPOSITED_CARD_ART_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');
const CARD_ART_SITE_SUBDIR = '_card-art';
```

And add the import at the top of the requires block (right after the
existing `const path = require('node:path');` line):

```js
const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('../lib/parse-card-markdown');
```

### 1b. Make `writeFileAtomic` accept a `Buffer` as well as a `string`

The existing function only handles UTF-8 text. The SVG copy is binary-safe
bytes, so generalize the existing function rather than writing a second
almost-identical one. Find the existing function (around line 467):

```js
function writeFileAtomic(absPath, content) {
  // Deterministic builds mean most pages are byte-identical rebuild to
  // rebuild — skip those outright, which sidesteps rename contention for
  // the common case and keeps unchanged files' mtimes stable.
  try {
    if (fs.readFileSync(absPath, 'utf8') === content) return;
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  const tmpPath = `${absPath}.tmp-${process.pid}`;
  fs.writeFileSync(tmpPath, content, 'utf8');
  // Windows refuses to rename over a file another process has open (a
  // serve-site test streaming this very page) with EPERM until the reader's
  // handle closes — that is milliseconds away, so retry briefly instead of
  // crashing the whole build (seen live: EPERM on rules.html mid-suite).
  for (let attempt = 0; ; attempt++) {
    try {
      fs.renameSync(tmpPath, absPath);
      return;
    } catch (err) {
      if ((err.code !== 'EPERM' && err.code !== 'EACCES') || attempt >= 40) {
        try { fs.rmSync(tmpPath, { force: true }); } catch { /* best effort */ }
        throw err;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
}
```

Replace the whole function with:

```js
function writeFileAtomic(absPath, content) {
  // Deterministic builds mean most pages/assets are byte-identical rebuild
  // to rebuild — skip those outright, which sidesteps rename contention for
  // the common case and keeps unchanged files' mtimes stable. `content` is a
  // Buffer for copied binary assets (card-art SVGs) and a utf8 string for
  // generated HTML pages.
  const isBuffer = Buffer.isBuffer(content);
  try {
    const existing = isBuffer ? fs.readFileSync(absPath) : fs.readFileSync(absPath, 'utf8');
    const unchanged = isBuffer ? existing.equals(content) : existing === content;
    if (unchanged) return;
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  const tmpPath = `${absPath}.tmp-${process.pid}`;
  fs.writeFileSync(tmpPath, content, isBuffer ? undefined : 'utf8');
  // Windows refuses to rename over a file another process has open (a
  // serve-site test streaming this very page) with EPERM until the reader's
  // handle closes — that is milliseconds away, so retry briefly instead of
  // crashing the whole build (seen live: EPERM on rules.html mid-suite).
  for (let attempt = 0; ; attempt++) {
    try {
      fs.renameSync(tmpPath, absPath);
      return;
    } catch (err) {
      if ((err.code !== 'EPERM' && err.code !== 'EACCES') || attempt >= 40) {
        try { fs.rmSync(tmpPath, { force: true }); } catch { /* best effort */ }
        throw err;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
}
```

(Only the body changed — signature, call sites, and the rename/retry loop are
untouched. This is a pure generalization: existing string callers are
unaffected because `Buffer.isBuffer(existingStringContent)` is `false` for
them, so they take the exact same code path as before.)

### 1c. Make `renderBlocks` / `renderMarkdown` accept an optional per-H3 hook

Find `renderBlocks` (around line 223):

```js
function renderBlocks(lines) {
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      i++;
      continue;
    }
```

Change the function signature and the heading branch to:

```js
function renderBlocks(lines, opts) {
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      const title = heading[2].trim();
      html.push(`<h${level}>${renderInline(title)}</h${level}>`);
      if (level === 3 && opts && opts.onH3) {
        const extra = opts.onH3(title);
        if (extra) html.push(extra);
      }
      i++;
      continue;
    }
```

Every other branch in `renderBlocks` is unchanged, **except** the recursive
blockquote call must thread `opts` through so nested content stays
consistent (it currently never contains card H3s in practice, but this keeps
the function honest). Find (around line 261):

```js
      html.push(`<blockquote>${renderBlocks(quoteLines)}</blockquote>`);
```

Replace with:

```js
      html.push(`<blockquote>${renderBlocks(quoteLines, opts)}</blockquote>`);
```

Then find `renderMarkdown` (around line 313):

```js
function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  return renderBlocks(lines);
}
```

Replace with:

```js
function renderMarkdown(markdown, opts) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  return renderBlocks(lines, opts);
}
```

### 1d. Thread `opts` through `buildPageHtml`

Find (around line 399):

```js
function buildPageHtml(page, siblings) {
  let body = renderMarkdown(page.markdown);
  if (!page.hasOwnH1) {
    body = `<h1>${escapeHtml(page.title)}</h1>\n${body}`;
  }
```

Replace with:

```js
function buildPageHtml(page, siblings, opts) {
  let body = renderMarkdown(page.markdown, opts);
  if (!page.hasOwnH1) {
    body = `<h1>${escapeHtml(page.title)}</h1>\n${body}`;
  }
```

(The rest of `buildPageHtml` is unchanged.)

### 1e. Add the `cardArtImgHtml` helper

Add this new function right after `buildNav` (around line 397, before
`buildPageHtml`), since it uses `relativeHref` and `escapeHtml` which are
already defined above it:

```js
// For a card-page H3 heading `title`, copies the matching composited SVG
// (if one exists) into site/_card-art/<slug>.svg as part of this build and
// returns an <img> tag pointing at it — or null if no composited render
// exists yet for this card. `copiedCardArtRelPaths` collects every
// site/-relative path this touches so main() can protect them from
// pruneStaleOutputs at the end of the same build.
function cardArtImgHtml(title, page, copiedCardArtRelPaths) {
  const slug = slugify(title);
  const srcAbsPath = path.join(COMPOSITED_CARD_ART_DIR, `${slug}.svg`);
  if (!fs.existsSync(srcAbsPath)) return null;

  const artOutRelPath = `${CARD_ART_SITE_SUBDIR}/${slug}.svg`;
  const artOutAbsPath = path.join(SITE_DIR, CARD_ART_SITE_SUBDIR, `${slug}.svg`);
  fs.mkdirSync(path.dirname(artOutAbsPath), { recursive: true });
  writeFileAtomic(artOutAbsPath, fs.readFileSync(srcAbsPath));
  copiedCardArtRelPaths.add(artOutRelPath);

  const href = relativeHref(page.outRelPath, artOutRelPath);
  return `<img class="card-art" src="${escapeHtml(href)}" alt="${escapeHtml(title)}">`;
}
```

### 1f. Wire it up in `main()`

Find the page-building loop in `main()` (around line 539):

```js
    for (const page of pages) {
      const siblings = pagesBySection.get(page.section);
      const html = buildPageHtml(page, siblings);
      const outAbsPath = path.join(SITE_DIR, ...page.outRelPath.split('/'));
      fs.mkdirSync(path.dirname(outAbsPath), { recursive: true });
      writeFileAtomic(outAbsPath, html);
    }

    writeFileAtomic(path.join(SITE_DIR, 'index.html'), buildIndexHtml(pagesBySection));

    pruneStaleOutputs(new Set([...pages.map((p) => p.outRelPath), 'index.html']));
```

Replace with:

```js
    const copiedCardArtRelPaths = new Set();

    for (const page of pages) {
      const siblings = pagesBySection.get(page.section);
      const opts = page.relPath.startsWith('design/cards/')
        ? { onH3: (title) => cardArtImgHtml(title, page, copiedCardArtRelPaths) }
        : undefined;
      const html = buildPageHtml(page, siblings, opts);
      const outAbsPath = path.join(SITE_DIR, ...page.outRelPath.split('/'));
      fs.mkdirSync(path.dirname(outAbsPath), { recursive: true });
      writeFileAtomic(outAbsPath, html);
    }

    writeFileAtomic(path.join(SITE_DIR, 'index.html'), buildIndexHtml(pagesBySection));

    pruneStaleOutputs(new Set([
      ...pages.map((p) => p.outRelPath),
      'index.html',
      ...copiedCardArtRelPaths,
    ]));
```

The `...copiedCardArtRelPaths` addition is critical: `pruneStaleOutputs`
walks the whole `site/` tree and deletes anything not in the expected set —
without this, every copied card-art SVG would be deleted moments after being
written, in the same build.

### 1g (optional, low-risk polish, not required by any AC). Style the image

In the `CSS` template literal (around line 322), you may add one rule so the
image doesn't overflow the phone-width `<main>` column:

```css
img.card-art { display: block; max-width: 100%; height: auto; margin: 0.75rem 0; border-radius: 6px; }
```

Insert it anywhere among the other bare-tag/class rules (e.g. right after
the `code { padding: 0.1em 0.35em; }` line). This has no effect on any
existing test and is purely visual — skip it if you want to keep the diff
minimal; it doesn't affect any acceptance criterion.

## Step 2 — Add `test/build-site-card-art.test.js`

Create this new file (same conventions as the existing
`test/build-site.test.js`: `execFileSync` the CLI, then assert on
`site/`'s contents on disk). Full contents:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const COMPOSITE_SCRIPT = path.join(REPO_ROOT, 'tools', 'composite-card-art.js');
const SITE_DIR = path.join(REPO_ROOT, 'site');

const { resolveFilePath } = require('../tools/serve-site.js');

function runBuild() {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
}

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function hashTree(dir) {
  const files = walkFiles(dir).sort();
  const hash = crypto.createHash('sha256');
  for (const file of files) {
    hash.update(path.relative(dir, file).split(path.sep).join('/'));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest('hex');
}

// "Line-Fleet Trooper" (design/cards/alpha-set.md) has a composited render
// at renders/cards-composited/line-fleet-trooper.svg.
const CARD_WITH_ART = {
  pageRelPath: 'design/cards/alpha-set.html',
  slug: 'line-fleet-trooper',
};

// "Cradle-Root Colony" (design/cards/fount-economy-set.md) has no brief in
// design/cards/art-briefs.md and so no composited render exists for it.
const CARD_WITHOUT_ART = {
  pageRelPath: 'design/cards/fount-economy-set.html',
  cardName: 'Cradle-Root Colony',
};

test('AC1: a card with a matching composited render gets an <img> whose resolved src is a byte-identical copy', () => {
  runBuild();

  const pageAbsPath = path.join(SITE_DIR, ...CARD_WITH_ART.pageRelPath.split('/'));
  const pageHtml = fs.readFileSync(pageAbsPath, 'utf8');

  const imgMatch = pageHtml.match(/<img class="card-art" src="([^"]+)"[^>]*>/);
  assert.ok(imgMatch, 'expected an <img class="card-art"> tag in the page');

  const resolvedImgAbsPath = path.resolve(path.dirname(pageAbsPath), imgMatch[1]);
  assert.ok(fs.existsSync(resolvedImgAbsPath), `expected ${resolvedImgAbsPath} to exist`);

  const sourceSvgAbsPath = path.join(REPO_ROOT, 'renders', 'cards-composited', `${CARD_WITH_ART.slug}.svg`);
  assert.deepStrictEqual(
    fs.readFileSync(resolvedImgAbsPath),
    fs.readFileSync(sourceSvgAbsPath),
    'expected the copied site/ SVG to be byte-identical to the source composited render'
  );
});

test('AC2: a card with no composited render gets no <img class="card-art">, and the build still exits 0', () => {
  runBuild();

  const pageAbsPath = path.join(SITE_DIR, ...CARD_WITHOUT_ART.pageRelPath.split('/'));
  const pageHtml = fs.readFileSync(pageAbsPath, 'utf8');

  const h3Index = pageHtml.indexOf(`<h3>${CARD_WITHOUT_ART.cardName}</h3>`);
  assert.ok(h3Index !== -1, `expected an <h3> for "${CARD_WITHOUT_ART.cardName}"`);

  const nextH3Index = pageHtml.indexOf('<h3>', h3Index + 1);
  const sectionEnd = nextH3Index === -1 ? pageHtml.length : nextH3Index;
  const section = pageHtml.slice(h3Index, sectionEnd);

  assert.ok(!section.includes('class="card-art"'), 'expected no card-art <img> for a card with no composited render');
});

test('AC3: every copied card-art SVG resolves and would be served successfully by serve-site.js', () => {
  runBuild();

  const cardArtDir = path.join(SITE_DIR, '_card-art');
  assert.ok(fs.existsSync(cardArtDir), 'expected site/_card-art/ to exist');

  const svgFiles = fs.readdirSync(cardArtDir).filter((name) => name.endsWith('.svg'));
  assert.ok(svgFiles.length > 0, 'expected at least one copied card-art SVG');

  for (const name of svgFiles) {
    const resolved = resolveFilePath(`/_card-art/${name}`);
    assert.ok(resolved, `expected resolveFilePath to serve /_card-art/${name}`);
    assert.strictEqual(resolved, path.join(cardArtDir, name));
  }
});

test('AC4 (held_out): composite-card-art.js then build-site.js twice in a row is byte-identical, and the existing build-site.test.js suite is unaffected', () => {
  execFileSync(process.execPath, [COMPOSITE_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
  runBuild();
  const first = hashTree(SITE_DIR);
  runBuild();
  const second = hashTree(SITE_DIR);
  assert.strictEqual(first, second, 'expected identical site/ contents (including copied card-art SVGs) across repeated runs');
});
```

Notes for the junior implementing this:
- Do **not** modify `test/build-site.test.js`. It already re-runs
  `node tools/build-site.js` itself and asserts on non-card sections (World,
  Races, Characters, Rules, Plans & Ideas) plus generic structural checks
  that don't reference card art at all — nothing in Step 1 changes behavior
  for pages outside `design/cards/`, and nothing in Step 1 changes the HTML
  produced for a `design/cards/` page's non-`<h3>` content, so that whole
  file keeps passing unchanged.
- `package.json`'s test script is `node --test --test-concurrency=1`, so
  test files won't race each other rebuilding `site/` — you don't need to
  add any extra locking beyond what `build-site.js` already has.
- Every card in `design/cards/alpha-set.md` currently has composited art, so
  don't pick a "no art" fixture from that file — use
  `fount-economy-set.md`, `wormhole-restrictions-set.md`, or
  `character-signatures-wave-2.md` (confirmed above to have zero composited
  renders as of this writing). If a future unit adds art briefs for one of
  those files, this test would need a different fixture card — that's an
  acceptable, expected kind of future maintenance, not a bug in this plan.

## Expected output after implementing

Running `node tools/build-site.js` from the repo root prints the same
`Built N pages into site/` line as before (N unchanged — no new pages are
added, only images inserted into existing pages), and exits 0.

`site/design/cards/alpha-set.html` will contain, among its other card
sections, something like:

```html
<h3>Line-Fleet Trooper</h3>
<img class="card-art" src="../../_card-art/line-fleet-trooper.svg" alt="Line-Fleet Trooper">
<p>Cost line: ...</p>
```

`site/_card-art/` will contain one `<slug>.svg` file per card across all of
`design/cards/*.md` that has a matching `renders/cards-composited/<slug>.svg`
— today that's all of `alpha-set.md`, `frontier-set.md`, and
`character-signatures.md`'s cards (30 files, matching the current contents of
`renders/cards-composited/` minus the `-alt` variants, which never match any
plain card-name slug and are correctly never copied).

Running `node --test` (the unit's test command) should show all existing
test files passing plus the new `test/build-site-card-art.test.js`'s 4
tests passing, e.g.:

```
# pass <existing total> + 4
# fail 0
```

## Risk assessment (FIRE matrix)

- **Reversibility**: Fully reversible. `site/` is fully regenerated,
  disposable build output (already gitignored/regenerated by every unit that
  touches it based on the recent commit history). No migration, no
  irreversible state.
- **Security impact**: None. The only new filesystem writes are (a) copying
  bytes from `renders/cards-composited/<slug>.svg` (already-trusted,
  repo-local files) to `site/_card-art/<slug>.svg`, where `<slug>` is always
  produced by the existing, already-audited `slugify()` (strips everything
  outside `[a-z0-9-]`, so no path traversal is possible), and (b) the
  existing `writeFileAtomic` generalization, which only changes *how* bytes
  are compared/written (Buffer vs string), not *what* gets written or where.
- **User data**: None involved.
- **Schema changes**: None.

This is a low-risk, additive, single-file change with a clear existing test
harness pattern to follow. No confirmation gate needed.
