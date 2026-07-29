'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseCardMarkdown } = require('../lib/parse-card-markdown');
const { parseSections } = require('./helpers/markdown');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'character-signatures-wave-2.md');
const WAVE1_PATH = path.join(__dirname, '..', 'design', 'cards', 'character-signatures.md');
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
// test/design-signature-cards.test.js and test/design-characters.test.js.
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

function readCardSections(cardsPath) {
  if (!fs.existsSync(cardsPath)) return [];
  const content = fs.readFileSync(cardsPath, 'utf8');
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function readCards(cardsPath) {
  if (!fs.existsSync(cardsPath)) return [];
  return parseCardMarkdown(fs.readFileSync(cardsPath, 'utf8'));
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
// race — mirrors the roster test/design-signature-cards.test.js builds for
// wave 1, so both files' cards can be checked against the same character
// list.
const roster = races.flatMap((r) => r.characters.map((name) => ({ name, race: r.title, file: r.file })));

const cardSections = readCardSections(CARDS_PATH);
const sectionsToCheck = cardSections.length
  ? cardSections
  : [{ title: '<no cards found — design/cards/character-signatures-wave-2.md missing or empty>', body: '' }];

const cards = readCards(CARDS_PATH);
const cardsToCheck = cards.length
  ? cards
  : [{ name: '<no cards found>', costLine: '', typeLine: '', rulesText: '', statsLine: null, flavorText: null }];

const wave1Cards = readCards(WAVE1_PATH);

function cardText(card) {
  return `${card.rulesText || ''} ${card.flavorText || ''}`;
}

function namedCharacters(card) {
  return roster.filter((c) => cardText(card).includes(c.name));
}

// Every character name already named by any wave-1 card, so wave-2 cards
// can be checked against "not already signed" (AC3's cross-file rule).
const wave1NamedCharacterNames = new Set(
  wave1Cards.flatMap((card) => namedCharacters(card).map((c) => c.name))
);

// ---------------------------------------------------------------------------
// AC1: design/cards/character-signatures-wave-2.md exists and contains
// exactly 5 distinct named cards, one per race, none colliding with any
// card name already used in design/cards/character-signatures.md.
// ---------------------------------------------------------------------------

test('AC1: design/cards/character-signatures-wave-2.md exists and contains exactly 5 distinct named cards', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
  const names = cards.map((c) => c.name);
  assert.strictEqual(names.length, 5, `expected exactly 5 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

test('AC1: none of the wave-2 card names collides with a card name in character-signatures.md', () => {
  const wave1Names = new Set(wave1Cards.map((c) => c.name));
  for (const card of cards) {
    assert.ok(
      !wave1Names.has(card.name),
      `expected wave-2 card "${card.name}" not to collide with a wave-1 card name`
    );
  }
});

// ---------------------------------------------------------------------------
// AC2: every card uses the canonical template from rules.md Section 9.1 in
// order (Cost line, then Type line, then Rules text, and, only for
// Permanents, an optional Stats/counters line after Rules text) — same
// template test/design-signature-cards.test.js enforces for wave 1.
// ---------------------------------------------------------------------------

for (const card of sectionsToCheck) {
  test(`AC2: "${card.title}" has Cost line, Type line, and Rules text in order`, () => {
    const body = card.body;
    const costIdx = body.indexOf('Cost line:');
    const typeIdx = body.indexOf('Type line:');
    const rulesIdx = body.indexOf('Rules text:');
    assert.notStrictEqual(costIdx, -1, `expected a "Cost line:" field in "${card.title}"`);
    assert.notStrictEqual(typeIdx, -1, `expected a "Type line:" field in "${card.title}"`);
    assert.notStrictEqual(rulesIdx, -1, `expected a "Rules text:" field in "${card.title}"`);
    assert.ok(
      costIdx < typeIdx && typeIdx < rulesIdx,
      `expected Cost line -> Type line -> Rules text order in "${card.title}"`
    );
  });

  test(`AC2: "${card.title}" only carries a Stats/counters line after Rules text, and only if a Permanent`, () => {
    const body = card.body;
    const rulesIdx = body.indexOf('Rules text:');
    const statsIdx = body.indexOf('Stats/counters line:');
    if (statsIdx === -1) return;
    assert.ok(rulesIdx !== -1 && statsIdx > rulesIdx, `expected Stats/counters line to follow Rules text in "${card.title}"`);
    const typeMatch = body.match(/Type line:\s*([^\n]+)/);
    assert.ok(typeMatch, `expected a Type line to check permanence in "${card.title}"`);
    assert.ok(
      /\bPermanent\b/.test(typeMatch[1]),
      `expected "${card.title}" to be a Permanent since it carries a Stats/counters line, got type line: ${typeMatch[1]}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3: each card's combined rules text and flavor text names both its own
// race's title (as printed in that race's design/races/ file) and one
// specific named character drawn from that race's own file under
// design/characters/, and that character is not the one
// design/cards/character-signatures.md already names for that race.
// ---------------------------------------------------------------------------

for (const race of racesToCheck) {
  test(`AC3: exactly one wave-2 signature card names both "${race.title}" and one of its own characters`, () => {
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
    assert.ok(
      !wave1NamedCharacterNames.has(matches[0].name),
      `expected "${card.name}" not to re-sign "${matches[0].name}", already named by a wave-1 card in character-signatures.md`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3 (continued): no two wave-2 signature cards name the same character.
// ---------------------------------------------------------------------------

test('AC3: no two wave-2 signature cards name the same character', () => {
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
