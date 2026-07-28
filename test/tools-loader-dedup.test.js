'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const RENDER_CARD_PATH = path.join(REPO_ROOT, 'tools', 'render-card.js');
const SYNC_CARDS_PATH = path.join(REPO_ROOT, 'tools', 'sync-cards-to-jaina.js');
const LIB_PATH = path.join(REPO_ROOT, 'lib', 'parse-card-markdown.js');
const LIB_RELATIVE_FROM_TOOLS = '../lib/parse-card-markdown';

const LOADER_FUNCTION_NAMES = ['loadCardsFromFile', 'loadAllCards'];

function assertNoLocalDeclaration(source, filePath, name) {
  const pattern = new RegExp(`function\\s+${name}\\s*\\(`, 'g');
  assert.strictEqual(
    (source.match(pattern) || []).length,
    0,
    `expected no local function ${name}(...) definition left in ${filePath}`
  );
}

function assertImportsBothFromLib(source, filePath) {
  assert.ok(
    source.includes(LIB_RELATIVE_FROM_TOOLS),
    `expected ${filePath} to require('${LIB_RELATIVE_FROM_TOOLS}')`
  );
  const requireLine = source.split('\n').find((line) => line.includes(LIB_RELATIVE_FROM_TOOLS));
  assert.ok(requireLine, `expected to find the require line importing the shared parser in ${filePath}`);
  for (const name of LOADER_FUNCTION_NAMES) {
    assert.ok(
      new RegExp(`\\b${name}\\b`).test(requireLine),
      `expected ${name} to be destructured from the shared import in ${filePath}`
    );
  }
}

// ---------------------------------------------------------------------------
// AC1: lib/parse-card-markdown.js exports loadCardsFromFile and loadAllCards,
// which read design/cards/*.md filenames in sorted order and parse each via
// parseCardMarkdown.
// ---------------------------------------------------------------------------

test('AC1: lib/parse-card-markdown.js exports loadCardsFromFile and loadAllCards functions', () => {
  const mod = require(LIB_PATH);
  assert.strictEqual(typeof mod.loadCardsFromFile, 'function', 'expected an exported loadCardsFromFile function');
  assert.strictEqual(typeof mod.loadAllCards, 'function', 'expected an exported loadAllCards function');
});

test('AC1: loadAllCards reads design/cards/*.md and returns parsed cards', () => {
  const { loadAllCards } = require(LIB_PATH);
  const cards = loadAllCards();
  assert.ok(Array.isArray(cards), 'expected loadAllCards() to return an array');
  assert.ok(cards.length > 0, 'expected at least one card to be loaded from design/cards/');
  for (const card of cards) {
    assert.strictEqual(typeof card.name, 'string');
    assert.strictEqual(typeof card.costLine, 'string');
    assert.strictEqual(typeof card.typeLine, 'string');
    assert.strictEqual(typeof card.rulesText, 'string');
  }
});

// ---------------------------------------------------------------------------
// AC2/AC3/AC4: tools/render-card.js and tools/sync-cards-to-jaina.js no
// longer declare their own loadCardsFromFile/loadAllCards; both import them
// from lib/parse-card-markdown.js instead.
// ---------------------------------------------------------------------------

test('AC2/AC4: tools/render-card.js contains no local loadCardsFromFile/loadAllCards declarations', () => {
  const source = fs.readFileSync(RENDER_CARD_PATH, 'utf8');
  for (const name of LOADER_FUNCTION_NAMES) {
    assertNoLocalDeclaration(source, RENDER_CARD_PATH, name);
  }
});

test('AC2: tools/render-card.js imports loadCardsFromFile and loadAllCards from lib/parse-card-markdown', () => {
  const source = fs.readFileSync(RENDER_CARD_PATH, 'utf8');
  assertImportsBothFromLib(source, RENDER_CARD_PATH);
});

test('AC3/AC4: tools/sync-cards-to-jaina.js contains no local loadCardsFromFile/loadAllCards declarations', () => {
  const source = fs.readFileSync(SYNC_CARDS_PATH, 'utf8');
  for (const name of LOADER_FUNCTION_NAMES) {
    assertNoLocalDeclaration(source, SYNC_CARDS_PATH, name);
  }
});

test('AC3: tools/sync-cards-to-jaina.js imports loadCardsFromFile and loadAllCards from lib/parse-card-markdown', () => {
  const source = fs.readFileSync(SYNC_CARDS_PATH, 'utf8');
  assertImportsBothFromLib(source, SYNC_CARDS_PATH);
});
