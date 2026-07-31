'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');
const { registerCardTemplateChecks } = require('./helpers/card-template');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'frontier-worlds-set.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');
const DESIGN_READINESS_PATH = path.join(__dirname, '..', 'design', 'DESIGN-READINESS.md');
const BUILD_SCRIPT = path.join(__dirname, '..', 'tools', 'build-site.js');
const SITE_DIR = path.join(__dirname, '..', 'site');
const { execFileSync } = require('node:child_process');

const RACE_TO_FOUNT = {
  'Cindral Reach': 'Mass',
  'Mireth Bloom': 'Bloom',
  'Panoptic Concord': 'Signal',
  'Starweave Communion': 'Tangle',
  'Wrought Assembly': 'Circuit',
};

const WORLDS = ['Halvorne Junction', 'Kelmourn Drift', 'Tallowfen'];

// Section 8.3/8.6 terms this unit is allowed to ground cards in, and the
// section that defines each (see rules.md).
const MECHANIC_SECTIONS = {
  'Frontier Discovery': '8.3',
  'Contested Discovery': '8.3',
  'Neutral Planet': '8.3',
  'Wormhole Length': '8.3',
  'Blockade': '8.6',
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readFile(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function listCards() {
  const content = readFile(CARDS_PATH);
  if (content === null) return [];
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function listRaces() {
  if (!fs.existsSync(RACES_DIR)) return [];
  return fs
    .readdirSync(RACES_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const content = fs.readFileSync(path.join(RACES_DIR, file), 'utf8');
      const titleMatch = content.match(/^#\s+The\s+(.+)$/m);
      return { file, raceName: titleMatch ? titleMatch[1].trim() : null };
    });
}

const cards = listCards();
const cardsToCheck = cards.length
  ? cards
  : [{ title: '<no cards found — design/cards/frontier-worlds-set.md missing or empty>', body: '' }];

const races = listRaces();
const racesToCheck = races.length
  ? races
  : [{ file: '<no race files found under design/races/>', raceName: null }];

// --- AC1: file exists, exactly 5 cards, one per race, Section 9.1 order ---

test('AC1: design/cards/frontier-worlds-set.md exists', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
});

test('AC1: frontier-worlds-set.md contains exactly 5 distinct named cards', () => {
  const names = cards.map((c) => c.title);
  assert.strictEqual(names.length, 5, `expected exactly 5 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(new Set(names).size, names.length, 'expected all card names to be distinct');
});

for (const race of racesToCheck) {
  test(`AC1: exactly one Frontier Worlds card is tied to the race in ${race.file}`, () => {
    assert.ok(race.raceName, `expected a race title in ${race.file}`);
    const raceNameRe = new RegExp(escapeRegExp(race.raceName));
    const matches = cards.filter((c) => raceNameRe.test(c.body));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one Frontier Worlds card naming "${race.raceName}", found ${matches.length}`
    );
  });
}

for (const card of cardsToCheck) {
  registerCardTemplateChecks(card.title, card.body);
}

// --- AC2: each world named at least once across the 5 cards; at least one
// world named by two cards ---

test('AC2: Halvorne Junction, Kelmourn Drift, and Tallowfen are each named at least once', () => {
  const allText = cards.map((c) => c.body).join('\n');
  for (const world of WORLDS) {
    assert.ok(allText.includes(world), `expected "${world}" to appear somewhere across the 5 cards`);
  }
});

test('AC2: at least one world is named by two or more cards', () => {
  const counts = WORLDS.map((world) => cards.filter((c) => c.body.includes(world)).length);
  assert.ok(counts.some((n) => n >= 2), `expected at least one world named by 2+ cards, got counts ${JSON.stringify(counts)}`);
});

for (const world of WORLDS) {
  test(`AC2: "${world}" is named in both the Rules text and the flavor text of at least one card`, () => {
    const match = cards.find((c) => {
      const rulesMatch = c.body.match(/Rules text:[\s\S]*?(?=\n[A-Z][a-z]+ ?[a-z]*:|\n\n|\n\*|$)/);
      const rulesText = rulesMatch ? rulesMatch[0] : '';
      const flavorMatch = c.body.match(/\*[^*]+\*/);
      const flavorText = flavorMatch ? flavorMatch[0] : '';
      return rulesText.includes(world) && flavorText.includes(world);
    });
    assert.ok(match, `expected at least one card to name "${world}" in both its Rules text and its flavor text`);
  });
}

// --- AC3 (held_out, paraphrase): each card's Rules text names one of the
// allowed Section 8.3/8.6 terms and cites the correct section number, no
// invented mechanic ---

for (const card of cardsToCheck) {
  test(`AC3: "${card.title}" names an allowed Section 8.3/8.6 mechanic and cites its section`, () => {
    const body = card.body;
    const termsPresent = Object.keys(MECHANIC_SECTIONS).filter((t) => body.includes(t));
    assert.ok(
      termsPresent.length > 0,
      `expected "${card.title}" to name one of [${Object.keys(MECHANIC_SECTIONS).join(', ')}]`
    );
    const citesCorrectSection = termsPresent.some((t) =>
      new RegExp(`Section\\s+${MECHANIC_SECTIONS[t].replace('.', '\\.')}\\b`).test(body)
    );
    assert.ok(
      citesCorrectSection,
      `expected "${card.title}" to cite the correct section for one of [${termsPresent.join(', ')}]`
    );
  });
}

// --- AC4: DESIGN-READINESS.md Section 3 has exactly one new bullet citing
// the file; every other design/cards/*.md and star-atlas.md are untouched
// (verified structurally: the file exists and is cited; this test does not
// and cannot verify "byte-for-byte unchanged" against a prior git state —
// that is a code-review concern for the builder/gate, not a runtime
// assertion) ---

test('AC4: DESIGN-READINESS.md Section 3 cites frontier-worlds-set.md', () => {
  const content = fs.readFileSync(DESIGN_READINESS_PATH, 'utf8');
  assert.ok(content.includes('frontier-worlds-set.md'), 'expected Section 3 to cite frontier-worlds-set.md');
});

// --- AC5: site/ regenerates correctly ---

test('AC5: site/design/cards/frontier-worlds-set.html exists and DESIGN-READINESS.html is regenerated after build', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
  const cardPage = path.join(SITE_DIR, 'design', 'cards', 'frontier-worlds-set.html');
  const readinessPage = path.join(SITE_DIR, 'design', 'DESIGN-READINESS.html');
  assert.ok(fs.existsSync(cardPage), `expected ${cardPage} to exist after build`);
  assert.ok(fs.existsSync(readinessPage), `expected ${readinessPage} to exist after build`);
  const readinessHtml = fs.readFileSync(readinessPage, 'utf8');
  assert.ok(readinessHtml.includes('frontier-worlds-set.md'), 'expected the built DESIGN-READINESS.html to cite frontier-worlds-set.md');
});
