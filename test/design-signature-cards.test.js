'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseCardMarkdown } = require('../lib/parse-card-markdown');
const { parseSections } = require('./helpers/markdown');
const { registerCardTemplateChecks } = require('./helpers/card-template');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'character-signatures.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');
const CHAR_DIR = path.join(__dirname, '..', 'design', 'characters');

function listMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
}

// The race title exactly as printed in the race file's `# The X` H1 heading
// (including the leading "The"), since AC3 requires the title "as printed".
function raceTitle(raceFile) {
  const content = fs.readFileSync(path.join(RACES_DIR, raceFile), 'utf8');
  const m = content.match(/^#\s+(The\s+.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

// Parses "## Name — Role" character sections, same convention used by
// test/design-characters.test.js's parseCharacters.
function parseCharacterNames(charFile) {
  const content = fs.readFileSync(path.join(CHAR_DIR, charFile), 'utf8');
  const sections = parseSections(content);
  const names = [];
  for (const s of sections) {
    if (s.level !== 2) continue;
    const m = s.title.match(/^(.+?)\s+—\s+(.+)$/);
    if (m) names.push(m[1].trim());
  }
  return names;
}

function readCardSections() {
  if (!fs.existsSync(CARDS_PATH)) return [];
  const content = fs.readFileSync(CARDS_PATH, 'utf8');
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function readCards() {
  if (!fs.existsSync(CARDS_PATH)) return [];
  return parseCardMarkdown(fs.readFileSync(CARDS_PATH, 'utf8'));
}

const raceFiles = listMdFiles(RACES_DIR);
const races = raceFiles.map((file) => ({
  file,
  title: raceTitle(file),
  characters: fs.existsSync(path.join(CHAR_DIR, file)) ? parseCharacterNames(file) : [],
}));
const racesToCheck = races.length
  ? races
  : [{ file: '<no race files found under design/races/>', title: null, characters: [] }];

// Master roster of every named character across every race, so a card's
// combined text can be checked against the whole roster, not just its own
// race — this is what lets AC4's "no two cards name the same character"
// check and AC3's "exactly one character, and it's from the right race"
// check both work off one shared list.
const roster = races.flatMap((r) => r.characters.map((name) => ({ name, race: r.title, file: r.file })));

const cardSections = readCardSections();
const sectionsToCheck = cardSections.length
  ? cardSections
  : [{ title: '<no cards found — design/cards/character-signatures.md missing or empty>', body: '' }];

const cards = readCards();
const cardsToCheck = cards.length
  ? cards
  : [{ name: '<no cards found>', costLine: '', typeLine: '', rulesText: '', statsLine: null, flavorText: null }];

function cardText(card) {
  return `${card.rulesText || ''} ${card.flavorText || ''}`;
}

function namedCharacters(card) {
  return roster.filter((c) => cardText(card).includes(c.name));
}

// ---------------------------------------------------------------------------
// AC1: design/cards/character-signatures.md exists and contains exactly 5
// distinct named cards, one per race under design/races/.
// ---------------------------------------------------------------------------

test('AC1: design/cards/character-signatures.md exists and contains exactly 5 distinct named cards', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
  const names = cards.map((c) => c.name);
  assert.strictEqual(names.length, 5, `expected exactly 5 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

test('AC1: there are exactly 5 race files, one card is expected per race', () => {
  assert.strictEqual(raceFiles.length, 5, `expected exactly 5 files under design/races/, found ${raceFiles.length}`);
});

// ---------------------------------------------------------------------------
// AC2: every card uses the canonical template from rules.md Section 9.1 in
// order (Cost line, then Type line, then Rules text, and, only for
// Permanents, an optional Stats/counters line after Rules text).
// ---------------------------------------------------------------------------

for (const card of sectionsToCheck) {
  registerCardTemplateChecks(card.title, card.body);
}

// ---------------------------------------------------------------------------
// AC3: each card's combined rules text and flavor text names both its own
// race's title (as printed in that race's design/races/ file) and one
// specific named character drawn from that race's own file under
// design/characters/.
// ---------------------------------------------------------------------------

for (const race of racesToCheck) {
  test(`AC3: exactly one signature card names both "${race.title}" and one of its own characters`, () => {
    assert.ok(race.title, `expected a race title ("# The <Name>") in ${race.file}`);
    assert.ok(race.characters.length > 0, `expected named characters in design/characters/${race.file}`);

    const withRace = cards.filter((c) => cardText(c).includes(race.title));
    assert.strictEqual(
      withRace.length,
      1,
      `expected exactly one card naming "${race.title}", found ${withRace.length}`
    );

    const card = withRace[0];
    const matches = namedCharacters(card);
    assert.strictEqual(
      matches.length,
      1,
      `expected "${card.name}" to name exactly one character from the whole roster, found [${matches.map((m) => m.name).join(', ')}]`
    );
    assert.strictEqual(
      matches[0].race,
      race.title,
      `expected "${card.name}" (naming "${race.title}") to name a character from ${race.file}, but it names "${matches[0].name}" from ${matches[0].file}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC4 (held_out): no two signature cards name the same character.
// ---------------------------------------------------------------------------

test('AC4: no two signature cards name the same character', () => {
  const seenBy = new Map();
  for (const card of cardsToCheck) {
    for (const match of namedCharacters(card)) {
      assert.ok(
        !seenBy.has(match.name),
        `character "${match.name}" is named by both "${seenBy.get(match.name)}" and "${card.name}"`
      );
      seenBy.set(match.name, card.name);
    }
  }
});
