'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');
const { registerCardTemplateChecks } = require('./helpers/card-template');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'spatial-race-identity-set.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');

// The 3 races this set realizes race-identity combos for, per the unit's
// Intent (Concord/Signal/Discovery, Communion/Tangle/wormhole-restriction
// exception, Reach/Mass/fortification — the third is AC4, held out).
const TARGET_RACE_FILES = ['panoptic-concord.md', 'starweave-communion.md', 'cindral-reach.md'];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readCardsFile() {
  if (!fs.existsSync(CARDS_PATH)) return null;
  return fs.readFileSync(CARDS_PATH, 'utf8');
}

// Each `###` heading is one card; its body is the raw lines directly under
// it — same convention as design/cards/frontier-set.md and
// test/design-frontier-cards.test.js.
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
  : [{ title: '<no cards found — design/cards/spatial-race-identity-set.md missing or empty>', body: '' }];

const races = TARGET_RACE_FILES.map((file) => ({ file, raceName: raceNameFromFile(file) }));

// ---------------------------------------------------------------------------
// AC1: design/cards/spatial-race-identity-set.md exists and contains exactly
// 3 distinct named cards, one each for Panoptic Concord, Starweave Communion,
// and Cindral Reach.
// ---------------------------------------------------------------------------

test('AC1: design/cards/spatial-race-identity-set.md exists', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
});

test('AC1: spatial-race-identity-set.md contains exactly 3 distinct named cards', () => {
  const names = cards.map((c) => c.title);
  assert.strictEqual(names.length, 3, `expected exactly 3 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

for (const race of races) {
  test(`AC1: exactly one Spatial Race Identity Set card is tied to the race in ${race.file}`, () => {
    assert.ok(race.raceName, `expected a race title ("# The <Name>") in ${race.file}`);
    const raceNameRe = new RegExp(escapeRegExp(race.raceName));
    const matches = cards.filter((c) => raceNameRe.test(c.body));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one Spatial Race Identity Set card naming "${race.raceName}", found ${matches.length}: [${matches
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

// ---------------------------------------------------------------------------
// AC2: the Panoptic Concord's card names the Signal Fount in its Cost line
// and its Rules text reduces a Discovery action's Fount Point cost, citing
// Section 8.3.
// ---------------------------------------------------------------------------

function findCardForRace(raceFile) {
  const raceName = raceNameFromFile(raceFile);
  return cards.find((c) => new RegExp(escapeRegExp(raceName)).test(c.body));
}

test('AC2: the Panoptic Concord card exists and its Cost line names the Signal Fount', () => {
  const card = findCardForRace('panoptic-concord.md');
  assert.ok(card, 'expected a card in spatial-race-identity-set.md naming "Panoptic Concord"');
  const costMatch = card.body.match(/Cost line:\s*([^\n]+)/);
  assert.ok(costMatch, `expected a Cost line in "${card.title}"`);
  assert.ok(
    /\bSignal\b/.test(costMatch[1]),
    `expected the Panoptic Concord card's Cost line to name the Signal Fount, got: ${costMatch[1]}`
  );
});

test('AC2: the Panoptic Concord card reduces a Discovery action\'s Fount Point cost, citing Section 8.3', () => {
  const card = findCardForRace('panoptic-concord.md');
  assert.ok(card, 'expected a card in spatial-race-identity-set.md naming "Panoptic Concord"');
  const rulesIdx = card.body.indexOf('Rules text:');
  assert.notStrictEqual(rulesIdx, -1, `expected a Rules text field in "${card.title}"`);
  const rulesText = card.body.slice(rulesIdx);
  assert.ok(/\bDiscovery\b/.test(rulesText), `expected "${card.title}" Rules text to name a Discovery action`);
  assert.ok(
    /cost|Fount Point/i.test(rulesText),
    `expected "${card.title}" Rules text to reduce a Fount Point cost`
  );
  assert.ok(
    /Section\s+8\.3\b/.test(rulesText),
    `expected "${card.title}" Rules text to cite "Section 8.3" literally, got: ${rulesText}`
  );
});

// ---------------------------------------------------------------------------
// AC3: the Starweave Communion's card names the Tangle Fount in its Cost
// line and its Rules text lets its controller's Assault treat a Directional
// or Team Restriction on a Wormhole as absent for the purpose of counting
// that Assault's path, citing both Section 8.4 and Section 8.6.
// ---------------------------------------------------------------------------

test('AC3: the Starweave Communion card exists and its Cost line names the Tangle Fount', () => {
  const card = findCardForRace('starweave-communion.md');
  assert.ok(card, 'expected a card in spatial-race-identity-set.md naming "Starweave Communion"');
  const costMatch = card.body.match(/Cost line:\s*([^\n]+)/);
  assert.ok(costMatch, `expected a Cost line in "${card.title}"`);
  assert.ok(
    /\bTangle\b/.test(costMatch[1]),
    `expected the Starweave Communion card's Cost line to name the Tangle Fount, got: ${costMatch[1]}`
  );
});

test('AC3: the Starweave Communion card lets its controller\'s Assault ignore a Directional or Team Restriction on a Wormhole for counting its path, citing Section 8.4 and Section 8.6', () => {
  const card = findCardForRace('starweave-communion.md');
  assert.ok(card, 'expected a card in spatial-race-identity-set.md naming "Starweave Communion"');
  const rulesIdx = card.body.indexOf('Rules text:');
  assert.notStrictEqual(rulesIdx, -1, `expected a Rules text field in "${card.title}"`);
  const rulesText = card.body.slice(rulesIdx);
  assert.ok(/\bAssault\b/.test(rulesText), `expected "${card.title}" Rules text to name an Assault`);
  assert.ok(
    /\bDirectional\b/.test(rulesText) && /\bTeam\b/.test(rulesText) && /\bRestriction\b/.test(rulesText),
    `expected "${card.title}" Rules text to name a Directional or Team Restriction`
  );
  assert.ok(/\bWormhole\b/.test(rulesText), `expected "${card.title}" Rules text to name a Wormhole`);
  assert.ok(
    /\babsent\b/.test(rulesText),
    `expected "${card.title}" Rules text to state the Restriction is treated as absent`
  );
  assert.ok(
    /\bpath\b/.test(rulesText),
    `expected "${card.title}" Rules text to scope the exception to counting that Assault's path`
  );
  assert.ok(
    /Section\s+8\.4\b/.test(rulesText),
    `expected "${card.title}" Rules text to cite "Section 8.4" literally, got: ${rulesText}`
  );
  assert.ok(
    /Section\s+8\.6\b/.test(rulesText),
    `expected "${card.title}" Rules text to cite "Section 8.6" literally, got: ${rulesText}`
  );
});
