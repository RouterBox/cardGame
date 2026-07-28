# cardgame-design-browser-site: cardGame tool — design-shelf browser website (read what we have from the phone)

## Header

- unit: cardgame-design-browser-site
- title: cardGame tool — design-shelf browser website (read what we have from the phone)
- project: cardgame
- completed: 2026-07-28
- outcome: escalated
- start_sha: fcaa2ccd22cd7fc136c0d3affa8a30b8e436ff46
- end_sha: fcaa2ccd22cd7fc136c0d3affa8a30b8e436ff46

## Intent

User directive (2026-07-28, verbatim, logged in design/ideas-inbox.md): "we can build tools for content generation and game authoring. For instance I think we also need a simple website to browse the game plans and concepts generated. I need to be able to see what we got without going over to my computer and picking through files and folders."

This is the first TOOL unit under the T16 gate ruling (game implementation stays off-limits; authoring/presentation tools are allowed). Build a static-site generator that turns the existing design shelf into a browsable website, so RouterBox can read everything from a phone.

Constraints (simplest thing that works, T2/user's global rules):

- Node-only, zero npm dependencies (match the repo: plain node, node:test). A single script `tools/build-site.js` reads the markdown under `design/` (including subdirectories `races/`, `characters/`, `cards/`) plus `gamePlan.md`, converts each to an HTML page, and writes a self-contained site to `site/` (gitignored or committed — commit it, so it can be statically served/deployed with no build step).
- Markdown conversion may be minimal but must correctly render the constructs the design docs actually use: headings, paragraphs, bold/italic, bullet and numbered lists, blockquotes, tables, fenced code blocks, and internal links. No external CDN assets — one inline CSS block, readable on a phone (max-width column, legible font sizes, dark-friendly).
- Site structure: an index page grouping documents by shelf area (World, Races, Characters, Rules, Cards, Plans/Ideas) with document titles taken from each file's first H1; every page gets a persistent nav back to the index and to its section siblings.
- The generator is deterministic: same inputs produce byte-identical outputs (no timestamps, no randomness) — rerunning it after a design merge refreshes the site.
- NO game logic anywhere in this unit: it renders documents; it does not interpret rules or simulate anything (T16 bright line).

## Acceptance Criteria

- AC1 [user]: Running `node tools/build-site.js` exits 0 and produces `site/index.html` plus one HTML page for every markdown file under `design/` (recursively) and for `gamePlan.md`.
- AC2 [user]: The index page links to every generated page, grouped into named sections covering at least World, Races, Characters, Cards, and Rules, with each link's text taken from the source file's first H1 heading.
- AC3 [paraphrase]: Generated pages render markdown structure as real HTML — a page generated from a design doc containing a table, a bulleted list, and a blockquote contains corresponding table/ul/blockquote elements, not raw markdown syntax.
- AC4 [inferred]: Every generated page contains a nav element linking back to index.html, and pages contain no external resource references (no http/https URLs in src or href of assets; document links to other generated pages are relative).
- AC5 [inferred]: The generator is deterministic — running it twice in a row produces identical bytes for every file in site/ (verifiable by hashing).
- AC6 [inferred] (held_out): The site contains no JavaScript that implements game behavior — generated pages are readable documents only; any script tag present is limited to navigation/display conveniences, and none of the generator's code interprets game rules.

## Plan

GATE: none

# Plan: cardgame-design-browser-site

## Risk self-assessment (FIRE)

- **Reversibility:** fully reversible. Everything produced (`tools/build-site.js`, `test/build-site.test.js`, and the generated `site/` directory) is static, regeneratable, and trivially deletable. No migrations, no destructive edits to existing `design/` content.
- **Security impact:** none. The script only reads local `.md` files already committed to the repo and writes local `.html` files. No network calls, no shelling out, no eval, no template injection surface beyond a repo the user already controls.
- **User data:** none. Content is game-design prose the user already authored; nothing personal/sensitive is introduced.
- **Schema changes:** none. No database, no API, no persisted config format changes.

Overall: low risk, mechanical, read-only-input/write-only-output tool. `GATE: none`.

## Held-out AC note

AC6 (held out — "no game logic anywhere; no `<script>` beyond navigation/display; generator doesn't interpret rules") is **not a novel requirement** — it restates the unit's own explicit bright line ("NO game logic anywhere in this unit... T16 bright line") in testable form. Not a spec bug. The design below satisfies it trivially: the generator emits zero `<script>` tags anywhere, and its own source code never branches on game vocabulary (Fount, combat strength, resolve, priority, etc.) — it only does generic markdown→HTML string transformation keyed on file paths and heading syntax.

## What already exists (context gathered from repo inspection)

- `design/world.md`, `design/rules.md`, `design/ideas-inbox.md` (top-level docs)
- `design/races/{cindral-reach,mireth-bloom,panoptic-concord,starweave-communion,wrought-assembly}.md` (5 files)
- `design/characters/{cindral-reach,mireth-bloom,panoptic-concord,starweave-communion,wrought-assembly,web}.md` (6 files)
- `design/cards/{alpha-set,card-anatomy}.md` (2 files)
- `gamePlan.md` at repo root
- **Total: 17 source markdown files** → generator must produce 17 pages + `index.html` = **18 files in `site/`**.
- `package.json` already has `"scripts": {"test": "node --test"}` — no changes needed there; `node --test`'s default discovery already picks up anything under `test/**/*.test.js`.
- No `tools/`, no `site/`, no `.gitignore` currently exist in the repo. Nothing to avoid clobbering.
- Constructs actually used in the source docs (confirmed by direct inspection, this drives what the parser must handle correctly):
  - Headings `#`..`######` (every file has exactly one `# H1` at the top **except `gamePlan.md`, which has no heading at all** — the generator must fall back to a derived title for it).
  - Multi-line paragraphs (soft-wrapped across consecutive non-blank lines, blank line = paragraph break).
  - `**bold**` and single-`*italic*` (e.g. `design/world.md` uses `*tune*`). No `_underscore_` emphasis anywhere in the corpus — **the parser intentionally only supports `*`/`**`, not `_`/`__`**, since that's the simplest thing that covers real usage (per repo convention: simplest solution first, no speculative generality).
  - Bullet lists (`- **Bold label** — text`) — `design/cards/card-anatomy.md`, race/character files, `rules.md` Section 2 glossary.
  - Numbered lists (`1. `, `2. `, ...) — `rules.md` worked examples (Sections 6.4/8.7/9.1).
  - Blockquotes: consecutive `> ` lines, sometimes containing `**bold**` — `rules.md` Section 9 card examples, `design/ideas-inbox.md` verbatim quotes.
  - Pipe tables with a `|---|---|` separator row — `design/cards/card-anatomy.md` (two tables: Field→Zone Mapping, Fount→color).
  - Inline code spans using single backticks around file paths, e.g. `` `design/world.md` `` — appears throughout `card-anatomy.md`. Not in the unit's explicit construct list but appears constantly in the actual corpus, so the parser renders these as `<code>` rather than leaking raw backticks.
  - **No fenced code blocks and no `[text](url)` links exist anywhere in the corpus today.** The generator must still support both per the spec's constraints (forward-looking correctness), but there's nothing in the current docs to visually verify them against beyond unit tests exercising the parser logic directly. Handle these as generically as the rest — no special-casing.

## Files to create

### 1. `tools/build-site.js` (new file — the entire generator, zero dependencies)

Create this exact file:

```js
#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const DESIGN_DIR = path.join(REPO_ROOT, 'design');
const GAME_PLAN_PATH = path.join(REPO_ROOT, 'gamePlan.md');
const SITE_DIR = path.join(REPO_ROOT, 'site');

const SECTION_ORDER = ['World', 'Races', 'Characters', 'Cards', 'Rules', 'Plans & Ideas', 'Other'];

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

function walkMarkdownFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function byRelPath(a, b) {
  return a.relPath < b.relPath ? -1 : a.relPath > b.relPath ? 1 : 0;
}

function discoverSourceFiles() {
  const absPaths = walkMarkdownFiles(DESIGN_DIR);
  absPaths.push(GAME_PLAN_PATH);
  const files = absPaths.map((absPath) => ({
    absPath,
    relPath: path.relative(REPO_ROOT, absPath).split(path.sep).join('/'),
  }));
  files.sort(byRelPath);
  return files;
}

function sectionFor(relPath) {
  if (relPath === 'gamePlan.md') return 'Plans & Ideas';
  if (relPath === 'design/ideas-inbox.md') return 'Plans & Ideas';
  if (relPath === 'design/world.md') return 'World';
  if (relPath === 'design/rules.md') return 'Rules';
  if (relPath.startsWith('design/races/')) return 'Races';
  if (relPath.startsWith('design/characters/')) return 'Characters';
  if (relPath.startsWith('design/cards/')) return 'Cards';
  return 'Other';
}

function outputRelPath(relPath) {
  return relPath.slice(0, -'.md'.length) + '.html';
}

function extractFirstH1(markdown) {
  const m = markdown.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

function fallbackTitle(relPath) {
  const base = path.basename(relPath, '.md');
  const spaced = base
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim();
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Inline (span-level) rendering
// ---------------------------------------------------------------------------

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function splitHash(target) {
  const i = target.indexOf('#');
  if (i === -1) return [target, ''];
  return [target.slice(0, i), target.slice(i + 1)];
}

function resolveLink(target) {
  if (/^https?:\/\//i.test(target)) return target;
  if (target.startsWith('#')) return target;
  const [pathPart, hash] = splitHash(target);
  if (pathPart.endsWith('.md')) {
    const htmlPath = pathPart.slice(0, -'.md'.length) + '.html';
    return hash ? `${htmlPath}#${hash}` : htmlPath;
  }
  return target;
}

function renderInline(text) {
  const protectedTokens = [];
  function protect(html) {
    const token = ` ${protectedTokens.length} `;
    protectedTokens.push(html);
    return token;
  }

  // 1. Inline code spans — protected verbatim (escaped, no further processing inside).
  let work = text.replace(/`([^`]+)`/g, (_, code) => protect(`<code>${escapeHtml(code)}</code>`));

  // 2. Links — target resolved to a relative .html path when it points at a .md source.
  work = work.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, linkText, target) => {
    const href = resolveLink(target.trim());
    return protect(`<a href="${escapeHtml(href)}">${escapeHtml(linkText)}</a>`);
  });

  // 3. Escape everything else that's left as plain text.
  work = escapeHtml(work);

  // 4. Bold, then italic (order matters: consume ** pairs before single *).
  work = work.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  work = work.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

  // 5. Restore protected code/link spans.
  work = work.replace(/ (\d+) /g, (_, idx) => protectedTokens[Number(idx)]);

  return work;
}

// ---------------------------------------------------------------------------
// Block-level rendering
// ---------------------------------------------------------------------------

function isTableRow(line) {
  return line.trim() !== '' && line.includes('|');
}

function splitTableRow(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map((c) => c.trim());
}

function isSeparatorRow(line) {
  if (!line.includes('-')) return false;
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));
}

function isTableStart(lines, i) {
  return i + 1 < lines.length && isTableRow(lines[i]) && isSeparatorRow(lines[i + 1]);
}

function renderTable(lines, startIndex) {
  const headerCells = splitTableRow(lines[startIndex]);
  let i = startIndex + 2;
  const rows = [];
  while (i < lines.length && isTableRow(lines[i])) {
    rows.push(splitTableRow(lines[i]));
    i++;
  }
  const thead = `<thead><tr>${headerCells.map((c) => `<th>${renderInline(c)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${renderInline(c)}</td>`).join('')}</tr>`)
    .join('')}</tbody>`;
  return { html: `<table>${thead}${tbody}</table>`, next: i };
}

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

    if (/^```/.test(line)) {
      const fenceLines = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        fenceLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      html.push(`<pre><code>${escapeHtml(fenceLines.join('\n'))}</code></pre>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      html.push(`<blockquote>${renderBlocks(quoteLines)}</blockquote>`);
      continue;
    }

    if (isTableStart(lines, i)) {
      const { html: tableHtml, next } = renderTable(lines, i);
      html.push(tableHtml);
      i = next;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      html.push(`<ul>${items.map((it) => `<li>${renderInline(it)}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      html.push(`<ol>${items.map((it) => `<li>${renderInline(it)}</li>`).join('')}</ol>`);
      continue;
    }

    // Paragraph: consecutive plain lines up to a blank line or the start of another block.
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !isTableStart(lines, i)
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    html.push(`<p>${renderInline(paraLines.join(' '))}</p>`);
  }

  return html.join('\n');
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  return renderBlocks(lines);
}

// ---------------------------------------------------------------------------
// Page shell (nav + CSS)
// ---------------------------------------------------------------------------

const CSS = `
:root { color-scheme: dark light; }
* { box-sizing: border-box; }
body {
  margin: 0;
  padding: 1.25rem;
  background: #14151a;
  color: #e6e6ea;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 17px;
  line-height: 1.6;
}
main, nav { max-width: 42rem; margin-left: auto; margin-right: auto; }
h1, h2, h3, h4, h5, h6 { line-height: 1.25; color: #f4f1ff; }
a { color: #8ab4ff; }
a:visited { color: #b79cff; }
nav {
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #34363f;
  font-size: 0.95rem;
}
nav .home-link { font-weight: 600; margin-right: 0.75rem; }
nav .section-label { color: #9a9aa5; margin-right: 0.75rem; }
nav .siblings { margin-top: 0.4rem; }
nav .siblings .current { font-weight: 600; color: #f4f1ff; }
blockquote {
  margin: 1rem 0;
  padding: 0.25rem 1rem;
  border-left: 3px solid #5a5d6b;
  color: #c7c7d1;
}
table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.95rem; }
th, td { border: 1px solid #34363f; padding: 0.4rem 0.6rem; text-align: left; }
code, pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  background: #1e2027;
  border-radius: 4px;
}
code { padding: 0.1em 0.35em; }
pre { padding: 0.75rem; overflow-x: auto; }
ul, ol { padding-left: 1.4rem; }
section h2 { margin-top: 2rem; }
@media (prefers-color-scheme: light) {
  body { background: #fbfbfd; color: #1c1c22; }
  a { color: #2454c7; }
  blockquote { color: #454550; }
  code, pre { background: #eef0f4; }
  th, td { border-color: #d6d8e0; }
}
`.trim();

function relativeHref(fromOutRelPath, toOutRelPath) {
  const fromDir = path.posix.dirname(fromOutRelPath);
  const rel = path.posix.relative(fromDir, toOutRelPath);
  return rel === '' ? path.posix.basename(toOutRelPath) : rel;
}

function buildNav(page, siblings) {
  const indexHref = relativeHref(page.outRelPath, 'index.html');
  const siblingHtml = siblings
    .map((p) => {
      if (p.outRelPath === page.outRelPath) {
        return `<span class="current">${escapeHtml(p.title)}</span>`;
      }
      return `<a href="${escapeHtml(relativeHref(page.outRelPath, p.outRelPath))}">${escapeHtml(p.title)}</a>`;
    })
    .join(' &middot; ');
  return [
    '<nav>',
    `<a class="home-link" href="${escapeHtml(indexHref)}">&larr; Index</a>`,
    `<span class="section-label">${escapeHtml(page.section)}</span>`,
    `<div class="siblings">${siblingHtml}</div>`,
    '</nav>',
  ].join('\n');
}

function buildPageHtml(page, siblings) {
  let body = renderMarkdown(page.markdown);
  if (!page.hasOwnH1) {
    body = `<h1>${escapeHtml(page.title)}</h1>\n${body}`;
  }
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(page.title)} — Amaranth Expanse Design</title>`,
    `<style>${CSS}</style>`,
    '</head>',
    '<body>',
    buildNav(page, siblings),
    '<main>',
    body,
    '</main>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

function buildIndexHtml(pagesBySection) {
  const sections = SECTION_ORDER.filter((s) => pagesBySection.has(s));
  const body = sections
    .map((section) => {
      const items = pagesBySection
        .get(section)
        .map((p) => `<li><a href="${escapeHtml(p.outRelPath)}">${escapeHtml(p.title)}</a></li>`)
        .join('\n');
      return `<section>\n<h2>${escapeHtml(section)}</h2>\n<ul>\n${items}\n</ul>\n</section>`;
    })
    .join('\n');
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Amaranth Expanse — Design Shelf</title>',
    `<style>${CSS}</style>`,
    '</head>',
    '<body>',
    '<main>',
    '<h1>Amaranth Expanse — Design Shelf</h1>',
    body,
    '</main>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  fs.rmSync(SITE_DIR, { recursive: true, force: true });
  fs.mkdirSync(SITE_DIR, { recursive: true });

  const sourceFiles = discoverSourceFiles();

  const pages = sourceFiles.map(({ absPath, relPath }) => {
    const markdown = fs.readFileSync(absPath, 'utf8');
    const ownH1 = extractFirstH1(markdown);
    return {
      relPath,
      outRelPath: outputRelPath(relPath),
      title: ownH1 || fallbackTitle(relPath),
      hasOwnH1: Boolean(ownH1),
      section: sectionFor(relPath),
      markdown,
    };
  });

  const pagesBySection = new Map();
  for (const page of pages) {
    if (!pagesBySection.has(page.section)) pagesBySection.set(page.section, []);
    pagesBySection.get(page.section).push(page);
  }

  for (const page of pages) {
    const siblings = pagesBySection.get(page.section);
    const html = buildPageHtml(page, siblings);
    const outAbsPath = path.join(SITE_DIR, ...page.outRelPath.split('/'));
    fs.mkdirSync(path.dirname(outAbsPath), { recursive: true });
    fs.writeFileSync(outAbsPath, html, 'utf8');
  }

  fs.writeFileSync(path.join(SITE_DIR, 'index.html'), buildIndexHtml(pagesBySection), 'utf8');

  console.log(`Built ${pages.length} pages into ${path.relative(REPO_ROOT, SITE_DIR).split(path.sep).join('/')}/`);
}

main();
```

**Notes for the implementer:**
- This is deliberately a single file, matching the spec's "a single script `tools/build-site.js`" wording — do not split into `tools/lib/*.js` helper modules.
- No `require` of anything beyond `node:fs` and `node:path`. No `package.json` dependency changes.
- Determinism is achieved by: never calling `Date`/`Math.random`; sorting the file list by a plain string comparator (not `localeCompare`, which is locale-dependent); using `path.posix` for all href computation so output doesn't vary between Windows/POSIX; joining with `'\n'` explicitly rather than relying on OS line endings.

### 2. `test/build-site.test.js` (new file — covers AC1–AC6)

Create this exact file:

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
const SITE_DIR = path.join(REPO_ROOT, 'site');
const DESIGN_DIR = path.join(REPO_ROOT, 'design');
const GAME_PLAN_PATH = path.join(REPO_ROOT, 'gamePlan.md');

function runBuild() {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
}

function walkFiles(dir, predicate) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, predicate));
    else if (!predicate || predicate(entry.name)) out.push(full);
  }
  return out;
}

function sourceMdFiles() {
  const files = walkFiles(DESIGN_DIR, (name) => name.endsWith('.md'));
  files.push(GAME_PLAN_PATH);
  return files;
}

function outputPathFor(srcAbsPath) {
  const rel = path.relative(REPO_ROOT, srcAbsPath).split(path.sep).join('/');
  const outRel = rel.slice(0, -'.md'.length) + '.html';
  return path.join(SITE_DIR, ...outRel.split('/'));
}

function escapeForCheck(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function hashTree(dir) {
  const files = walkFiles(dir, null).sort();
  const hash = crypto.createHash('sha256');
  for (const file of files) {
    hash.update(path.relative(dir, file).split(path.sep).join('/'));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest('hex');
}

test('AC1: node tools/build-site.js exits 0 and produces one page per markdown source plus index.html', () => {
  runBuild();
  assert.ok(fs.existsSync(path.join(SITE_DIR, 'index.html')), 'expected site/index.html to exist');
  for (const src of sourceMdFiles()) {
    const outPath = outputPathFor(src);
    assert.ok(fs.existsSync(outPath), `expected generated page at ${path.relative(REPO_ROOT, outPath)}`);
  }
});

test('AC2: index page links to every generated page, grouped into named sections with source-H1 titles', () => {
  runBuild();
  const indexHtml = fs.readFileSync(path.join(SITE_DIR, 'index.html'), 'utf8');

  for (const section of ['World', 'Races', 'Characters', 'Cards', 'Rules']) {
    assert.ok(indexHtml.includes(section), `expected index.html to name section "${section}"`);
  }

  for (const src of sourceMdFiles()) {
    const rel = path.relative(REPO_ROOT, src).split(path.sep).join('/');
    const outRel = rel.slice(0, -'.md'.length) + '.html';
    assert.ok(indexHtml.includes(outRel), `expected index.html to link to ${outRel}`);

    const md = fs.readFileSync(src, 'utf8');
    const h1 = md.match(/^#\s+(.+?)\s*$/m);
    if (h1) {
      assert.ok(
        indexHtml.includes(escapeForCheck(h1[1].trim())),
        `expected index.html link text to include the source's first H1 "${h1[1].trim()}" for ${rel}`
      );
    }
  }
});

test('AC3: markdown structure renders as real HTML elements, not raw syntax', () => {
  runBuild();

  const cardAnatomyHtml = fs.readFileSync(
    path.join(SITE_DIR, 'design', 'cards', 'card-anatomy.html'),
    'utf8'
  );
  assert.ok(/<table>/.test(cardAnatomyHtml), 'expected a <table> from the field/zone mapping table');
  assert.ok(/<ul>/.test(cardAnatomyHtml) && /<li>/.test(cardAnatomyHtml), 'expected <ul>/<li> from a skeleton bullet list');
  assert.ok(!/\|---/.test(cardAnatomyHtml), 'raw table separator syntax should not leak through');

  const rulesHtml = fs.readFileSync(path.join(SITE_DIR, 'design', 'rules.html'), 'utf8');
  assert.ok(/<blockquote>/.test(rulesHtml), 'expected a <blockquote> from a worked card example');
  assert.ok(!/^&gt;\s/m.test(rulesHtml) && !/^>\s/m.test(rulesHtml), 'raw blockquote syntax should not leak through');
  assert.ok(/<ol>/.test(rulesHtml), 'expected an <ol> from a numbered worked example');
});

test('AC4: every non-index page has a nav resolving back to index.html, and no external asset references anywhere', () => {
  runBuild();
  const outFiles = walkFiles(SITE_DIR, (name) => name.endsWith('.html'));
  const indexAbsPath = path.resolve(path.join(SITE_DIR, 'index.html'));
  assert.ok(outFiles.length > 1);

  for (const file of outFiles) {
    const html = fs.readFileSync(file, 'utf8');

    for (const [, url] of html.matchAll(/(?:src|href)="([^"]*)"/g)) {
      assert.ok(!/^https?:\/\//i.test(url), `expected no external http(s) reference, found ${url} in ${path.relative(SITE_DIR, file)}`);
    }

    if (path.resolve(file) === indexAbsPath) continue;

    const navMatch = html.match(/<nav[\s\S]*?<\/nav>/);
    assert.ok(navMatch, `expected a <nav>...</nav> element in ${path.relative(SITE_DIR, file)}`);

    const hrefs = [...navMatch[0].matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    const resolvesToIndex = hrefs.some(
      (href) => path.resolve(path.dirname(file), href.split('/').join(path.sep)) === indexAbsPath
    );
    assert.ok(resolvesToIndex, `expected nav in ${path.relative(SITE_DIR, file)} to resolve back to index.html (hrefs: ${hrefs.join(', ')})`);
  }
});

test('AC5: the generator is deterministic — rerunning produces byte-identical output', () => {
  runBuild();
  const first = hashTree(SITE_DIR);
  runBuild();
  const second = hashTree(SITE_DIR);
  assert.strictEqual(first, second, 'expected identical site/ contents (by hash) across repeated runs');
});

test('AC6 (held out): no script tags anywhere, and the generator source contains no game-rule logic', () => {
  runBuild();
  const outFiles = walkFiles(SITE_DIR, (name) => name.endsWith('.html'));
  for (const file of outFiles) {
    const html = fs.readFileSync(file, 'utf8');
    assert.ok(!/<script/i.test(html), `expected no <script> tag in ${path.relative(SITE_DIR, file)}`);
  }

  const generatorSource = fs.readFileSync(BUILD_SCRIPT, 'utf8');
  for (const term of ['combat strength', 'Fount Point', 'priority window', 'Generation Phase']) {
    assert.ok(!generatorSource.includes(term), `generator source should not reference game-rule concept "${term}"`);
  }
});
```

**Notes for the implementer:**
- `runBuild()` shells out to `node tools/build-site.js` as a real subprocess for every test (matches AC1's literal wording: "Running `node tools/build-site.js`"). This is fast (17 small files) — no need to optimize.
- AC4's nav check deliberately resolves hrefs on disk rather than string-matching an exact href format, so it doesn't overconstrain how `relativeHref` computes paths — any correct relative path passes.
- Do not add a `.mocharc`/jest config or change `package.json`'s `test` script — `node --test`'s default discovery already finds `test/build-site.test.js` alongside the existing `test/*.test.js` files.

## Build step — do this after writing the two files above

Run the generator once and commit its output, per the unit's explicit constraint ("commit it, so it can be statically served/deployed with no build step"):

```
node tools/build-site.js
git add tools/build-site.js test/build-site.test.js site/
```

Expected console output from the run:
```
Built 17 pages into site/
```

Expected `site/` layout after the run (18 files total):
```
site/index.html
site/gamePlan.html
site/design/ideas-inbox.html
site/design/rules.html
site/design/world.html
site/design/cards/alpha-set.html
site/design/cards/card-anatomy.html
site/design/characters/cindral-reach.html
site/design/characters/mireth-bloom.html
site/design/characters/panoptic-concord.html
site/design/characters/starweave-communion.html
site/design/characters/web.html
site/design/characters/wrought-assembly.html
site/design/races/cindral-reach.html
site/design/races/mireth-bloom.html
site/design/races/panoptic-concord.html
site/design/races/starweave-communion.html
site/design/races/wrought-assembly.html
```

## Verification

1. `node tools/build-site.js` → exits 0, prints `Built 17 pages into site/`.
2. `node --test` → all existing test files continue to pass unchanged, plus the new `test/build-site.test.js` suite (6 top-level `test()` blocks) passes. Expect a summary line like `# pass 6` for this file's tests (exact count depends on node version's summary format — the important thing is `# fail 0`).
3. Manual spot check (optional but recommended): open `site/index.html` in a browser, confirm sections World/Races/Characters/Cards/Rules/Plans & Ideas render with links; click into `design/cards/card-anatomy.html` and confirm the two tables and bullet lists render as real HTML, not `|---|` text; resize the browser to a phone width and confirm the column stays narrow and legible.
4. Re-run `node tools/build-site.js` a second time and confirm `git status` shows no changes to any file under `site/` (proves determinism in practice, not just via the test's hash comparison).

## Explicit non-goals (do not implement)

- No image/`![alt](url)` handling — none exist in the corpus and the spec doesn't require it.
- No `_underscore_` emphasis syntax — none exist in the corpus; only `*`/`**` is implemented.
- No client-side JS, search, or interactivity of any kind (AC6).
- No changes to any file under `design/` or to `gamePlan.md` — this unit only reads them.
- No changes to `package.json`.


## Findings

# Blind Review — cardgame-design-browser-site, cycle 1

## Verdict: NEEDS_WORK

## AC accounting

- **AC1** (`node tools/build-site.js` exits 0, produces `site/index.html` + one page per markdown source): Satisfied structurally. `tools/build-site.js` discovers all 16 files under `design/` (recursively) plus `gamePlan.md` = 17 sources, and the diff shows 17 generated `.html` pages + `site/index.html` = 18 output files, matching plan.md's inventory. Script has no obvious early-exit/throw paths for the current corpus.
- **AC2** (index groups pages into named sections incl. World/Races/Characters/Cards/Rules, titles from first H1): Satisfied. `site/index.html` has `World`, `Races`, `Characters`, `Cards`, `Rules`, and `Plans & Ideas` sections, each linking every page in that section with H1-derived titles (verified by reading `site/index.html` directly).
- **AC3** (markdown structure — table/ul/blockquote — renders as real HTML, not raw syntax): Structurally satisfied — `<table>`, `<ul>`/`<li>`, `<blockquote>`, `<ol>` all appear correctly in `site/design/cards/card-anatomy.html` and `site/design/rules.html`. However, see **Finding 1**: while the *structural* markdown renders correctly, the *inline text content* inside those same structural elements (and in plain paragraphs) is being corrupted independently of AC3's literal scope.
- **AC4** (every page has a nav back to index; no external http/https references): Satisfied. Every non-index page's diff shows a `<nav>` with a `href="../../index.html"` (or equivalent relative depth) home link and section siblings; no `http://`/`https://` literals appear in any `src`/`href` in the sampled output.
- **AC5** (deterministic — identical bytes across reruns): Not independently re-run (script execution required approval not available in this session), but code inspection shows no `Date.now()`, `Math.random()`, or other nondeterministic input — file discovery is sorted by `relPath` before rendering, iteration order is otherwise stable. No evidence of a determinism defect.

## Findings

### Finding 1 — INTRODUCED, blocks merge: token-restoration regex corrupts any literal number in source prose into `"undefined"` (or, worse, into an unrelated protected span)

**File:** `tools/build-site.js`, `renderInline()`, lines 105–133 (root cause at line 130).

`renderInline()` protects inline code spans and links by replacing them with a placeholder of the form `` ` ${protectedTokens.length} ` `` — i.e. a bare integer surrounded by single spaces (e.g. `" 0 "`, `" 1 "`, `" 2 "`). After bold/italic processing, it "restores" these placeholders with:

```js
work = work.replace(/ (\d+) /g, (_, idx) => protectedTokens[Number(idx)]);
```

This regex is not restricted to matching the tool's own placeholder tokens — it matches **any** run of digits surrounded by single spaces anywhere in the rendered text, including literal numbers that were already present in the source markdown (card costs, damage amounts, section references, counts, etc.). When such a number doesn't happen to correspond to a valid `protectedTokens` index, `protectedTokens[Number(idx)]` is `undefined`, and the literal string `"undefined"` gets spliced into the page with no surrounding whitespace (since the entire ` N ` match, spaces included, is replaced). When a source number *does* happen to coincide with a valid index, the literal number is silently replaced with an unrelated protected code/link span instead — a worse, silent-corruption case.

This is not a hypothetical edge case — it fires throughout the actual generated site. Verified via `grep -c "undefined" site/**/*.html`: **35 occurrences across 5 of the 17 generated pages** (`design/rules.html`: 13, `design/cards/alpha-set.html`: 19, `design/cards/card-anatomy.html`: 1, `gamePlan.html`: 1, `design/ideas-inbox.html`: 1).

**Failure scenario:** Open `site/design/cards/alpha-set.html` and read the Summary section. The source (`design/cards/alpha-set.md` line 5) reads "This file contains 18 named cards: 15 single-type cards... and 3 multi-type, multi-cost cards." The rendered page reads: "This file containsundefinednamed cards:undefinedsingle-type cards... andundefinedmulti-type, multi-cost cards." Every card's Cost line is similarly destroyed, e.g. "Cost line: 3 Tangle" renders as "Cost line:undefinedTangle". `site/design/rules.html` loses every numbered section cross-reference ("Section 2 defines..." → "Sectionundefineddefines...") and every worked-example damage/cost value. Even the user's own quoted directive in `site/design/ideas-inbox.html` is scrambled ("Also want 3 to 5 characters..." → "Also wantundefinedtoundefinedcharacters..."). This directly undermines the unit's stated purpose — "I need to be able to see what we got without going over to my computer and picking through files" — the numbers that carry the actual game-design information (costs, damage, counts) are unreadable or wrong on the generated site.

Root-cause fix is straightforward: use a placeholder that cannot collide with real document content (e.g. a non-printable/UUID-style sentinel, or a delimiter pair that can't appear in escaped HTML text such as ` ${i} `) instead of bare space-padded digits.

**Note on test coverage:** the pre-existing `test/build-site.test.js` (committed prior to this diff, so out of scope for this review) does not assert on inline text fidelity anywhere, so this defect passes the full visible-AC test suite undetected. Not a diff defect, but worth flagging since it's why this wasn't caught before this review.

## Pre-existing / out of scope

- No pre-existing issues observed in the touched area; `design/*.md` source content read as clean prose with no template/generation bug of its own (confirmed by reading `design/cards/alpha-set.md` directly — the "18 named cards: 15 single-type... and 3 multi-type" text is intact and correct in the source).


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T05:38:35.115Z] **bolt:start** — unit=cardgame-design-browser-site start_sha=fcaa2ccd22cd7fc136c0d3affa8a30b8e436ff46 branch=bolt/cardgame-design-browser-site worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-design-browser-site
- [2026-07-28T05:38:36.470Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T05:46:34.551Z] **plan:done** — plan.md written
- [2026-07-28T05:48:03.689Z] **tests:done** — RED verified on test/build-site.test.js (exit=1)
- [2026-07-28T05:49:50.774Z] **build:c1** — tests green, committed
- [2026-07-28T05:53:49.472Z] **review:c1** — NEEDS_WORK
- [2026-07-28T06:00:22.024Z] **build:c2** — tests green, committed
- [2026-07-28T06:06:28.609Z] **review:c2** — NEEDS_WORK
- [2026-07-28T06:08:19.953Z] **build:c3** — tests green, committed
- [2026-07-28T06:08:20.019Z] **bolt:escalated** — no-change iteration (diff hash unchanged between cycles)


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
