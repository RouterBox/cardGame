'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');
const { registerCardTemplateChecks } = require('./helpers/card-template');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'spatial-race-identity-set-wave-2.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');

// The 2 races this wave-2 file grounds, per the unit's Intent: Mireth Bloom
// (Bloomfront Expansion -> Section 4.6 exception) and Wrought Assembly
// (replication identity -> Section 8.3 Discovery cost reduction).
const TARGET_RACE_FILES = ['mireth-bloom.md', 'wrought-assembly.md'];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readCardsFile() {
  if (!fs.existsSync(CARDS_PATH)) return null;
  return fs.readFileSync(CARDS_PATH, 'utf8');
}

// Each `###` heading is one card; its body is the raw lines directly under
// it — same convention as design/cards/frontier-set.md and
// design/cards/spatial-race-identity-set.md.
function listCards() {
  const content = readCardsFile();
  if (content === null) return [];
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function raceNameFromFile(file) {
  const content = fs.readFileSync(path.join(RACES_DIR, file), 'utf8');
  const titleMatch = content.match(/^#\s+The\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : null;
}

const cards = listCards();
const cardsToCheck = cards.length
  ? cards
  : [{ title: '<no cards found — design/cards/spatial-race-identity-set-wave-2.md missing or empty>', body: '' }];

const races = TARGET_RACE_FILES.map((file) => ({ file, raceName: raceNameFromFile(file) }));

// ---------------------------------------------------------------------------
// AC1: design/cards/spatial-race-identity-set-wave-2.md exists and contains
// exactly 2 distinct named cards, one each for Mireth Bloom and Wrought
// Assembly, each with a Cost/Type/Rules-text template (and a Stats/counters
// line only when Permanent), matching the template
// test/design-frontier-cards.test.js enforces for frontier-set.md.
// ---------------------------------------------------------------------------

test('AC1: design/cards/spatial-race-identity-set-wave-2.md exists', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
});

test('AC1: spatial-race-identity-set-wave-2.md contains exactly 2 distinct named cards', () => {
  const names = cards.map((c) => c.title);
  assert.strictEqual(names.length, 2, `expected exactly 2 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

for (const race of races) {
  test(`AC1: exactly one Spatial Race Identity Set Wave 2 card is tied to the race in ${race.file}`, () => {
    assert.ok(race.raceName, `expected a race title ("# The <Name>") in ${race.file}`);
    const raceNameRe = new RegExp(escapeRegExp(race.raceName));
    const matches = cards.filter((c) => raceNameRe.test(c.body));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one Spatial Race Identity Set Wave 2 card naming "${race.raceName}", found ${matches.length}: [${matches
        .map((m) => m.title)
        .join(', ')}]`
    );
  });
}

// AC1: each card follows the canonical Cost line -> Type line -> Rules text
// template, with a Stats/counters line only when the Type line is a
// Permanent — same template test/design-frontier-cards.test.js enforces for
// frontier-set.md.
for (const card of cardsToCheck) {
  registerCardTemplateChecks(card.title, card.body);
}

function findCardForRace(raceFile) {
  const raceName = raceNameFromFile(raceFile);
  return cards.find((c) => new RegExp(escapeRegExp(raceName)).test(c.body));
}

// ---------------------------------------------------------------------------
// AC2: the Mireth Bloom's card names the Bloom Fount in its Cost line, its
// Type line identifies it as a Generator, and its Rules text explicitly
// states it may be built on a Planet its controller does not control,
// citing "Section 4.6" by number.
// ---------------------------------------------------------------------------

test('AC2: the Mireth Bloom card exists and its Cost line names the Bloom Fount', () => {
  const card = findCardForRace('mireth-bloom.md');
  assert.ok(card, 'expected a card in spatial-race-identity-set-wave-2.md naming "Mireth Bloom"');
  const costMatch = card.body.match(/Cost line:\s*([^\n]+)/);
  assert.ok(costMatch, `expected a Cost line in "${card.title}"`);
  assert.ok(
    /\bBloom\b/.test(costMatch[1]),
    `expected the Mireth Bloom card's Cost line to name the Bloom Fount, got: ${costMatch[1]}`
  );
});

test('AC2: the Mireth Bloom card\'s Type line identifies it as a Generator', () => {
  const card = findCardForRace('mireth-bloom.md');
  assert.ok(card, 'expected a card in spatial-race-identity-set-wave-2.md naming "Mireth Bloom"');
  const typeMatch = card.body.match(/Type line:\s*([^\n]+)/);
  assert.ok(typeMatch, `expected a Type line in "${card.title}"`);
  const rulesIdx = card.body.indexOf('Rules text:');
  assert.notStrictEqual(rulesIdx, -1, `expected a Rules text field in "${card.title}"`);
  const rulesText = card.body.slice(rulesIdx);
  assert.ok(
    /\bGenerator\b/.test(typeMatch[1]) || /\bGenerator\b/.test(rulesText),
    `expected "${card.title}" to be identified as a Generator via its Type line or Rules text, got type line: ${typeMatch[1]}`
  );
});

test('AC2: the Mireth Bloom card may be built on a Planet its controller does not control, citing Section 4.6', () => {
  const card = findCardForRace('mireth-bloom.md');
  assert.ok(card, 'expected a card in spatial-race-identity-set-wave-2.md naming "Mireth Bloom"');
  const rulesIdx = card.body.indexOf('Rules text:');
  assert.notStrictEqual(rulesIdx, -1, `expected a Rules text field in "${card.title}"`);
  const rulesText = card.body.slice(rulesIdx);
  assert.ok(/\bPlanet\b/.test(rulesText), `expected "${card.title}" Rules text to name a Planet`);
  assert.ok(
    /does not control/.test(rulesText),
    `expected "${card.title}" Rules text to state it may be built on a Planet its controller does not control, got: ${rulesText}`
  );
  assert.ok(
    /Section\s+4\.6\b/.test(rulesText),
    `expected "${card.title}" Rules text to cite "Section 4.6" literally, got: ${rulesText}`
  );
});

// ---------------------------------------------------------------------------
// AC3: the Wrought Assembly's card names the Circuit Fount in its Cost
// line, its Type line identifies it as a Generator, and its Rules text
// reduces its own Circuit Point cost when built on a Planet that entered
// the battlefield graph via a Discovery action taken that game, citing
// "Section 8.3" by number.
// ---------------------------------------------------------------------------

test('AC3: the Wrought Assembly card exists and its Cost line names the Circuit Fount', () => {
  const card = findCardForRace('wrought-assembly.md');
  assert.ok(card, 'expected a card in spatial-race-identity-set-wave-2.md naming "Wrought Assembly"');
  const costMatch = card.body.match(/Cost line:\s*([^\n]+)/);
  assert.ok(costMatch, `expected a Cost line in "${card.title}"`);
  assert.ok(
    /\bCircuit\b/.test(costMatch[1]),
    `expected the Wrought Assembly card's Cost line to name the Circuit Fount, got: ${costMatch[1]}`
  );
});

test('AC3: the Wrought Assembly card\'s Type line identifies it as a Generator', () => {
  const card = findCardForRace('wrought-assembly.md');
  assert.ok(card, 'expected a card in spatial-race-identity-set-wave-2.md naming "Wrought Assembly"');
  const typeMatch = card.body.match(/Type line:\s*([^\n]+)/);
  assert.ok(typeMatch, `expected a Type line in "${card.title}"`);
  const rulesIdx = card.body.indexOf('Rules text:');
  assert.notStrictEqual(rulesIdx, -1, `expected a Rules text field in "${card.title}"`);
  const rulesText = card.body.slice(rulesIdx);
  assert.ok(
    /\bGenerator\b/.test(typeMatch[1]) || /\bGenerator\b/.test(rulesText),
    `expected "${card.title}" to be identified as a Generator via its Type line or Rules text, got type line: ${typeMatch[1]}`
  );
});

test('AC3: the Wrought Assembly card reduces its Circuit Point cost when built on a Discovery-added Planet, citing Section 8.3', () => {
  const card = findCardForRace('wrought-assembly.md');
  assert.ok(card, 'expected a card in spatial-race-identity-set-wave-2.md naming "Wrought Assembly"');
  const rulesIdx = card.body.indexOf('Rules text:');
  assert.notStrictEqual(rulesIdx, -1, `expected a Rules text field in "${card.title}"`);
  const rulesText = card.body.slice(rulesIdx);
  assert.ok(/\bPlanet\b/.test(rulesText), `expected "${card.title}" Rules text to name a Planet`);
  assert.ok(/\bDiscovery\b/.test(rulesText), `expected "${card.title}" Rules text to name a Discovery action`);
  assert.ok(
    /\bthis game\b/.test(rulesText),
    `expected "${card.title}" Rules text to scope the Discovery to "this game", got: ${rulesText}`
  );
  assert.ok(
    /\bCircuit Point\b/.test(rulesText) && /fewer|reduc|less|discount|minus/i.test(rulesText),
    `expected "${card.title}" Rules text to reduce its own Circuit Point cost, got: ${rulesText}`
  );
  assert.ok(
    /Section\s+8\.3\b/.test(rulesText),
    `expected "${card.title}" Rules text to cite "Section 8.3" literally, got: ${rulesText}`
  );
});
