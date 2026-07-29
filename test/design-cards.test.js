'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');
const { registerCardTemplateChecks } = require('./helpers/card-template');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'alpha-set.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');

const CARD_TYPES = ['Magic', 'Technology', 'Intelligence', 'Biology', 'Materials'];
const FOUNTS = ['Tangle', 'Circuit', 'Signal', 'Bloom', 'Mass'];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readCardsFile() {
  if (!fs.existsSync(CARDS_PATH)) return null;
  return fs.readFileSync(CARDS_PATH, 'utf8');
}

// Each `###` heading is one card; its body is the raw lines directly under
// it (no deeper subsections exist in this file).
function listCards() {
  const content = readCardsFile();
  if (content === null) return [];
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function extractRacePrimaries() {
  if (!fs.existsSync(RACES_DIR)) return [];
  return fs
    .readdirSync(RACES_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const content = fs.readFileSync(path.join(RACES_DIR, file), 'utf8');
      const titleMatch = content.match(/^#\s+The\s+(.+)$/m);
      const primaryMatch = content.match(/Primary strength:?\**\s*([A-Za-z]+)/i);
      return {
        file,
        raceName: titleMatch ? titleMatch[1].trim() : null,
        primary: primaryMatch ? primaryMatch[1].trim() : null,
      };
    });
}

const cards = listCards();
const cardsToCheck = cards.length
  ? cards
  : [{ title: '<no cards found — design/cards/alpha-set.md missing or empty>', body: '' }];

const racePrimaries = extractRacePrimaries();
const racesToCheck = racePrimaries.length
  ? racePrimaries
  : [{ file: '<no race files found under design/races/>', raceName: null, primary: null }];

// ---------------------------------------------------------------------------
// AC1: design/cards/alpha-set.md exists and contains at least 15 distinct
// named cards.
// ---------------------------------------------------------------------------

test('AC1: design/cards/alpha-set.md exists and contains at least 15 distinct named cards', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
  const names = cards.map((c) => c.title);
  assert.ok(names.length >= 15, `expected at least 15 cards, found ${names.length}`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

// ---------------------------------------------------------------------------
// AC2: every card uses the canonical template from rules.md Section 9.1 in
// order (Name, Cost line, Type line, Rules text, and for Permanents an
// optional Stats/counters line) with no required field missing.
// ---------------------------------------------------------------------------

for (const card of cardsToCheck) {
  registerCardTemplateChecks(card.title, card.body);
}

// ---------------------------------------------------------------------------
// AC3: the set includes at least one card for each of the five Card Types
// and at least one card costed from each of the five Founts.
// ---------------------------------------------------------------------------

for (const t of CARD_TYPES) {
  test(`AC3: at least one card has Card Type ${t}`, () => {
    const found = cards.some((c) => new RegExp(`Type line:\\s*[^\\n]*\\b${t}\\b`).test(c.body));
    assert.ok(found, `expected at least one card with Card Type ${t}`);
  });
}

for (const f of FOUNTS) {
  test(`AC3: at least one card is costed from the ${f}`, () => {
    const found = cards.some((c) => new RegExp(`Cost line:\\s*[^\\n]*\\b${f}\\b`).test(c.body));
    assert.ok(found, `expected at least one card costed from the ${f}`);
  });
}

// ---------------------------------------------------------------------------
// AC4: each of the five races has at least one card whose Rules text or
// flavor ties back to that race's own primary Fount strength as named in
// its race file.
// ---------------------------------------------------------------------------

for (const race of racesToCheck) {
  test(`AC4: ${race.file} — a card ties back to its primary strength`, () => {
    assert.ok(race.raceName, `expected a race title ("# The <Name>") in ${race.file}`);
    assert.ok(race.primary && CARD_TYPES.includes(race.primary), `expected a primary strength among [${CARD_TYPES.join(', ')}] in ${race.file}, got "${race.primary}"`);
    const raceNameRe = new RegExp(escapeRegExp(race.raceName));
    const found = cards.some(
      (c) => raceNameRe.test(c.body) && new RegExp(`Type line:\\s*[^\\n]*\\b${race.primary}\\b`).test(c.body)
    );
    assert.ok(
      found,
      `expected a ${race.primary} card whose text names the ${race.raceName}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC5: at least one card demonstrates the multi-type/multi-cost rule from
// rules.md Section 9.7 — a card listing more than one Card Type and
// drawing cost from more than one Fount.
// ---------------------------------------------------------------------------

test('AC5: at least one card lists more than one Card Type and draws cost from more than one Fount', () => {
  const found = cards.some((c) => {
    const typeMatch = c.body.match(/Type line:\s*([^\n]+)/);
    const costMatch = c.body.match(/Cost line:\s*([^\n]+)/);
    if (!typeMatch || !costMatch) return false;
    const typesFound = CARD_TYPES.filter((t) => new RegExp(`\\b${t}\\b`).test(typeMatch[1]));
    const founstFound = FOUNTS.filter((f) => new RegExp(`\\b${f}\\b`).test(costMatch[1]));
    return typesFound.length >= 2 && founstFound.length >= 2;
  });
  assert.ok(found, 'expected at least one card with a multi-Card-Type type line and multi-Fount cost line');
});
