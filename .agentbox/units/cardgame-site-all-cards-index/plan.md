GATE: none

# Plan: cardgame-site-all-cards-index

Adds a card-level index page (`site/cards-index.html`) to the static site
generator. One file changes (`tools/build-site.js`), one file is added
(`test/build-site-cards-index.test.js`). Nothing else is touched.

## Why this is safe / sized right for one bolt

- Pure additive change to a deterministic, already-tested generator.
- No schema, no user data, no network calls, no new dependencies.
- Fully reversible (delete the added code / test file).
- Everything needed (card parsing, relative-href helpers, atomic writes,
  the build lock, prune-list mechanism) already exists in
  `tools/build-site.js` — this unit wires them together, it does not
  invent new infrastructure.
- Single bolt is appropriate; no split needed.

## Held-out AC note

AC4 (held out) — "no pre-existing generated page's content changes, and
every existing assertion in `test/build-site.test.js` still passes" — is
redundant with the visible intent (don't touch card markdown / parsing,
keep the generator deterministic). It is **not** a novel requirement, but
it does impose one concrete, non-obvious constraint on the implementation:
`test/build-site.test.js`'s existing AC4 test
(`'AC4: every non-index page has a nav resolving back to index.html...'`)
walks **every** `*.html` file under `site/` except `index.html` itself and
asserts each one has a `<nav>...</nav>` whose href resolves back to
`index.html`. `site/cards-index.html` is a new non-`index.html` page, so
it is swept into that loop automatically. **The new page must render a
real `<nav>` (via the existing `buildNav()` helper) whose home-link
resolves to `index.html`, not the nav-less bare-`<main>` shell that
`buildIndexHtml()` uses for the site root.** This is called out explicitly
below so it isn't missed — skipping it silently breaks an existing,
unrelated test.

## Background reading (already done, no need to redo)

- `tools/build-site.js` (`C:\github\.agentbox-worktrees\cardGame\cardgame-site-all-cards-index\tools\build-site.js`, 618 lines) — the whole generator. Relevant pieces:
  - `discoverSourceFiles()` walks `design/` + `gamePlan.md`, sorts by `relPath` (`byRelPath`).
  - `main()` builds a `pages[]` array (each `{ relPath, outRelPath, title, hasOwnH1, section, markdown }`), renders one HTML file per page, then `buildIndexHtml(pagesBySection)`, then `pruneStaleOutputs(expectedRelPaths)`.
  - `writeFileAtomic(absPath, content)` — skips the write if content is byte-identical (this is what makes AC5/AC3-determinism cheap and safe), otherwise writes to a `.tmp-<pid>` file and renames.
  - `pruneStaleOutputs(expectedRelPaths)` deletes any file under `site/` whose site-relative path is **not** in the passed `Set`. **Any new output file must be added to that Set or it gets deleted immediately after being written.**
  - `relativeHref(fromOutRelPath, toOutRelPath)` — the exact relative-href convention every nav/link in the site uses. Reuse this, do not hand-roll `../` math.
  - `buildNav(page, siblings)` — needs a `page` object with `.outRelPath` and `.section`, and a `siblings` array of `{ outRelPath, title }` objects (to render the current page as `<span class="current">`). It does **not** need `page.markdown` or `page.hasOwnH1`.
  - `buildIndexHtml(pagesBySection)` — the site-root page. Deliberately has no `<nav>` (there's nothing to navigate back to from the root). This is why AC4's existing test special-cases `index.html` — see the held-out-AC note above.
- `lib/parse-card-markdown.js` — exports `parseCardMarkdown(markdown)`, which is exactly what `loadAllCards()`/`loadCardsFromFile()` call per file. `parseCardMarkdown` splits on `###` (H3) headings and only counts a section as a card if it has non-empty `costLine`, `typeLine`, **and** `rulesText` (this is what correctly excludes prose sections like `design/cards/card-anatomy.md`'s `### Worked Example: ...`, which mentions "Cost line" only in body text, not as a field-prefixed line). Also exports `slugify(name)` and `loadAllCards()` (walks `design/cards/*.md` sorted by filename, concatenates `loadCardsFromFile()` per file).
- Because `discoverSourceFiles()` sorts by full `relPath` and every `design/cards/*.md` file's `relPath` shares the `design/cards/` prefix, sorting by `relPath` there is identical to `loadAllCards()`'s own `fs.readdirSync(...).sort()` by filename. **This means iterating `pages` in build order and calling `parseCardMarkdown(page.markdown)` per card-source page reproduces exactly the same cards, in exactly the same order, as `loadAllCards()`** — that's what makes AC1's count-equality guarantee hold by construction, with no extra bookkeeping needed.
- `test/build-site.test.js` — the existing generator test suite (AC1–AC5, 138 lines). Read this before writing the new test file; it establishes the `runBuild()` / `walkFiles()` / `hashTree()` helper patterns to mirror.
- `test/build-site-card-art.test.js` — sibling unit's test file; same `runBuild()` pattern, good style reference for the new test file's naming/structure.
- Card `costLine`/`typeLine` example confirmed from `design/cards/alpha-set.md`: card `### Unwritten Hour` has `Cost line: 3 Tangle` and `Type line: Magic`.

## Change 1 of 2 — `tools/build-site.js`

### 1a. Import `parseCardMarkdown` alongside the existing `slugify` import

File: `C:\github\.agentbox-worktrees\cardGame\cardgame-site-all-cards-index\tools\build-site.js`, line 6.

Old:
```js
const { slugify } = require('../lib/parse-card-markdown');
```

New:
```js
const { slugify, parseCardMarkdown } = require('../lib/parse-card-markdown');
```

### 1b. Add `buildCardsIndexHtml()` right after `buildIndexHtml()`

Insert a new function immediately after `buildIndexHtml()`'s closing brace
and before the `// Main` section comment (currently lines 501–505 in the
file as read). Use this exact anchor for the edit:

Old:
```js
    '</html>',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
```

New:
```js
    '</html>',
    '',
  ].join('\n');
}

// A card entry collected while rendering design/cards/*.md pages:
// { name, costLine, typeLine, pageOutRelPath }.
function buildCardsIndexHtml(cards) {
  // A minimal page-like object so buildNav() can render a real <nav> whose
  // home-link resolves back to index.html — required because
  // test/build-site.test.js's existing AC4 test walks every non-index.html
  // page under site/ and asserts each one has such a nav.
  const page = { outRelPath: 'cards-index.html', section: 'Cards', title: 'All Cards' };

  const rows = cards
    .map((card) => {
      const href = relativeHref(page.outRelPath, card.pageOutRelPath);
      return [
        '<tr>',
        `<td><a href="${escapeHtml(href)}">${escapeHtml(card.name)}</a></td>`,
        `<td>${escapeHtml(card.costLine)}</td>`,
        `<td>${escapeHtml(card.typeLine)}</td>`,
        '</tr>',
      ].join('');
    })
    .join('\n');

  const table = [
    '<table>',
    '<thead><tr><th>Name</th><th>Cost</th><th>Type</th></tr></thead>',
    `<tbody>\n${rows}\n</tbody>`,
    '</table>',
  ].join('\n');

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>All Cards — Amaranth Expanse Design</title>',
    `<style>${CSS}</style>`,
    '</head>',
    '<body>',
    buildNav(page, [page]),
    '<main>',
    '<h1>All Cards</h1>',
    table,
    '</main>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
```

### 1c. Give `site/index.html` a link to the new page

`buildIndexHtml()`'s body (currently lines 492–496). Add one line — no
other change to this function.

Old:
```js
    '<body>',
    '<main>',
    '<h1>Amaranth Expanse — Design Shelf</h1>',
    body,
    '</main>',
```

New:
```js
    '<body>',
    '<main>',
    '<h1>Amaranth Expanse — Design Shelf</h1>',
    '<p><a href="cards-index.html">All Cards</a></p>',
    body,
    '</main>',
```

### 1d. Collect cards while rendering pages, and emit + protect the new file in `main()`

Currently (lines 592–611):
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

Replace with:
```js
    const copiedCardArtRelPaths = new Set();
    const allCards = [];

    for (const page of pages) {
      const siblings = pagesBySection.get(page.section);
      const opts = page.relPath.startsWith('design/cards/')
        ? { onH3: (title) => cardArtImgHtml(title, page, copiedCardArtRelPaths) }
        : undefined;
      const html = buildPageHtml(page, siblings, opts);
      const outAbsPath = path.join(SITE_DIR, ...page.outRelPath.split('/'));
      fs.mkdirSync(path.dirname(outAbsPath), { recursive: true });
      writeFileAtomic(outAbsPath, html);

      if (page.relPath.startsWith('design/cards/')) {
        for (const card of parseCardMarkdown(page.markdown)) {
          allCards.push({
            name: card.name,
            costLine: card.costLine,
            typeLine: card.typeLine,
            pageOutRelPath: page.outRelPath,
          });
        }
      }
    }

    writeFileAtomic(path.join(SITE_DIR, 'index.html'), buildIndexHtml(pagesBySection));
    writeFileAtomic(path.join(SITE_DIR, 'cards-index.html'), buildCardsIndexHtml(allCards));

    pruneStaleOutputs(new Set([
      ...pages.map((p) => p.outRelPath),
      'index.html',
      'cards-index.html',
      ...copiedCardArtRelPaths,
    ]));
```

That's the entire `tools/build-site.js` diff. No other line changes.
`design/cards/*.md`, `art-briefs.md`, `lib/parse-card-markdown.js`, and
`tools/composite-card-art.js` are not touched, per the unit's intent.

## Change 2 of 2 — new test file `test/build-site-cards-index.test.js`

Create this file exactly:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const SITE_DIR = path.join(REPO_ROOT, 'site');
const CARDS_INDEX_PATH = path.join(SITE_DIR, 'cards-index.html');

const { loadAllCards } = require('../lib/parse-card-markdown');

function runBuild() {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
}

// "Unwritten Hour" (design/cards/alpha-set.md) — used as a known-good
// sample row to check name/cost/type/link content precisely.
const SAMPLE_CARD = {
  name: 'Unwritten Hour',
  costLine: '3 Tangle',
  typeLine: 'Magic',
  pageAbsPath: path.join(SITE_DIR, 'design', 'cards', 'alpha-set.html'),
};

test('AC1: cards-index.html exists with exactly one entry per card across design/cards/*.md', () => {
  runBuild();
  assert.ok(fs.existsSync(CARDS_INDEX_PATH), 'expected site/cards-index.html to exist');

  const html = fs.readFileSync(CARDS_INDEX_PATH, 'utf8');
  const rowMatches = [...html.matchAll(/<td><a href="[^"]+">/g)];
  const expectedCards = loadAllCards();
  assert.strictEqual(
    rowMatches.length,
    expectedCards.length,
    `expected ${expectedCards.length} card rows (loadAllCards() count), found ${rowMatches.length}`
  );
});

test('AC2: each entry shows name, cost line, and type line, and the name links to its source page', () => {
  runBuild();
  const html = fs.readFileSync(CARDS_INDEX_PATH, 'utf8');

  const nameIdx = html.indexOf(`>${SAMPLE_CARD.name}</a>`);
  assert.ok(nameIdx !== -1, `expected a link to "${SAMPLE_CARD.name}" in cards-index.html`);

  const rowStart = html.lastIndexOf('<tr>', nameIdx);
  const rowEnd = html.indexOf('</tr>', nameIdx);
  const row = html.slice(rowStart, rowEnd);

  assert.ok(row.includes(SAMPLE_CARD.costLine), `expected cost line "${SAMPLE_CARD.costLine}" in the row for ${SAMPLE_CARD.name}`);
  assert.ok(row.includes(`>${SAMPLE_CARD.typeLine}<`), `expected type line "${SAMPLE_CARD.typeLine}" in the row for ${SAMPLE_CARD.name}`);

  const hrefMatch = row.match(new RegExp(`<a href="([^"]+)">${SAMPLE_CARD.name}</a>`));
  assert.ok(hrefMatch, 'expected an <a href="..."> around the card name');
  const resolvedAbsPath = path.resolve(path.dirname(CARDS_INDEX_PATH), hrefMatch[1]);
  assert.strictEqual(resolvedAbsPath, SAMPLE_CARD.pageAbsPath, 'expected the name link to resolve to its source page');
});

test('AC3: site/index.html links to cards-index.html, and rebuilding twice yields byte-identical output', () => {
  runBuild();
  const indexHtml = fs.readFileSync(path.join(SITE_DIR, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('cards-index.html'), 'expected index.html to link to cards-index.html');

  const first = fs.readFileSync(CARDS_INDEX_PATH, 'utf8');
  runBuild();
  const second = fs.readFileSync(CARDS_INDEX_PATH, 'utf8');
  assert.strictEqual(first, second, 'expected cards-index.html to be byte-identical across repeated runs');
});
```

## Expected outputs

- `node tools/build-site.js` prints `Built <N> pages into site/` (same
  message as today — `N` is unchanged, since `cards-index.html` is
  written separately from the `pages` loop and is not counted in `N`).
- `site/cards-index.html` is created: a full HTML page with a `<nav>`
  (home-link → `index.html`) and a `<main><h1>All Cards</h1><table>...`
  with one `<tr>` per card, columns Name (linked) / Cost / Type.
- `site/index.html` contains one new line:
  `<p><a href="cards-index.html">All Cards</a></p>` right under its `<h1>`.
- `node --test`: every existing test still passes (nothing in
  `design/cards/*.md`, `lib/parse-card-markdown.js`, or
  `tools/composite-card-art.js` changed, and `test/build-site.test.js`'s
  own nav/no-external-asset sweep now also passes for
  `cards-index.html` because it carries a real `<nav>`), plus the 3 new
  tests in `test/build-site-cards-index.test.js` pass. Overall exit code 0,
  no failing tests reported.

## Manual verification steps for the implementer

1. Apply the two changes above.
2. Run `node tools/build-site.js` from the repo root — confirm it exits 0
   and prints the `Built <N> pages...` line.
3. Open `site/cards-index.html` in a text editor (or a browser) — confirm
   the table has one row per card and that clicking a name would land on
   the right per-card page.
4. Run `node tools/build-site.js` a second time — confirm no console
   errors and (optionally) `git status`/diff `site/` to confirm no bytes
   changed on the rebuild (skip this if `site/` isn't checked in as
   expected; check `.gitignore` first rather than assuming).
5. Run `node --test` from the repo root — confirm all tests pass,
   including the new `test/build-site-cards-index.test.js` file.
