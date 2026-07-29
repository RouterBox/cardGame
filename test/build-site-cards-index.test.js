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
