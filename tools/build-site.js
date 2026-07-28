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
    const token = ` ${protectedTokens.length} `;
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
  work = work.replace(/ (\d+) /g, (_, idx) => protectedTokens[Number(idx)]);

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
