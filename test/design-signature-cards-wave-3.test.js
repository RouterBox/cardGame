'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseCardMarkdown } = require('../lib/parse-card-markdown');
const { parseSections } = require('./helpers/markdown');
const { registerCardTemplateChecks } = require('./helpers/card-template');

const REPO_ROOT = path.join(__dirname, '..');
const CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'character-signatures-wave-3.md');
const WAVE1_PATH = path.join(REPO_ROOT, 'design', 'cards', 'character-signatures.md');
const WAVE2_PATH = path.join(REPO_ROOT, 'design', 'cards', 'character-signatures-wave-2.md');
const RACES_DIR = path.join(REPO_ROOT, 'design', 'races');
const CHAR_DIR = path.join(REPO_ROOT, 'design', 'characters');
const SITE_PATH = path.join(REPO_ROOT, 'site', 'design', 'cards', 'character-signatures-wave-3.html');

// Section 9.2-9.6 of design/rules.md: each Card Type draws its cost from
// exactly one Fount, and each Card Type falls into a fixed permanent /
// instant-sorcery-speed behavior class — both facts are stable rulebook
// definitions, not something this unit can change, so it's safe to assert
// against directly (mirrors the FOUNT_COLORS convention in
// test/design-art-briefs-character-signatures-wave-2.test.js).
const FOUNT_BY_DOMAIN = {
  Materials: 'Mass',
  Biology: 'Bloom',
  Intelligence: 'Signal',
  Magic: 'Tangle',
  Technology: 'Circuit',
};
const PERMANENT_DOMAINS = new Set(['Materials', 'Biology', 'Technology']);
const NEVER_PERMANENT_DOMAINS = new Set(['Intelligence', 'Magic']);

function listMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
}

// The race title exactly as printed in the race file's `# The X` H1 heading
// (including the leading "The"), since AC4 requires the title "as printed".
function raceTitle(raceFile) {
  const content = fs.readFileSync(path.join(RACES_DIR, raceFile), 'utf8');
  const m = content.match(/^#\s+(The\s+.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

// The race's own primary Fount domain, from its "- **Primary strength:** X"
// bullet under "## Strengths & Weaknesses".
function raceDomain(raceFile) {
  const content = fs.readFileSync(path.join(RACES_DIR, raceFile), 'utf8');
  const m = content.match(/\*\*Primary strength:\*\*\s*([A-Za-z]+)/);
  return m ? m[1].trim() : null;
}

// Parses "## Name — Role" character sections, same convention used by
// test/design-signature-cards.test.js and test/design-signature-cards-wave-2.test.js.
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
  domain: raceDomain(file),
  characters: fs.existsSync(path.join(CHAR_DIR, file)) ? parseCharacterNames(file) : [],
}));
const racesToCheck = races.length
  ? races
  : [{ file: '<no race files found under design/races/>', title: null, domain: null, characters: [] }];

// Master roster of every named character across every race, so a card's
// combined text can be checked against the whole roster, not just its own
// race — mirrors the roster test/design-signature-cards-wave-2.test.js
// builds, so wave-1, wave-2, and wave-3 cards can all be checked against the
// same character list.
const roster = races.flatMap((r) => r.characters.map((name) => ({ name, race: r.title, file: r.file })));

const cardSections = readCardSections(CARDS_PATH);
const sectionsToCheck = cardSections.length
  ? cardSections
  : [{ title: '<no cards found — design/cards/character-signatures-wave-3.md missing or empty>', body: '' }];

const cards = readCards(CARDS_PATH);
const cardsToCheck = cards.length
  ? cards
  : [{ name: '<no cards found>', costLine: '', typeLine: '', rulesText: '', statsLine: null, flavorText: null }];

const wave1Cards = readCards(WAVE1_PATH);
const wave2Cards = readCards(WAVE2_PATH);

function cardText(card) {
  return `${card.rulesText || ''} ${card.flavorText || ''}`;
}

function namedCharacters(card) {
  return roster.filter((c) => cardText(card).includes(c.name));
}

// Every character name already named by any wave-1 or wave-2 card, so
// wave-3 cards can be checked against "not already signed" (AC3's
// cross-file rule).
const priorNamedCharacterNames = new Set(
  [...wave1Cards, ...wave2Cards].flatMap((card) => namedCharacters(card).map((c) => c.name))
);

// ---------------------------------------------------------------------------
// AC1: design/cards/character-signatures-wave-3.md exists with exactly 5
// cards, one per race under design/races/.
// ---------------------------------------------------------------------------

test('AC1: design/cards/character-signatures-wave-3.md exists and contains exactly 5 distinct named cards', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
  const names = cards.map((c) => c.name);
  assert.strictEqual(names.length, 5, `expected exactly 5 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

test('AC1: there are exactly 5 race files, one wave-3 card is expected per race', () => {
  assert.strictEqual(raceFiles.length, 5, `expected exactly 5 files under design/races/, found ${raceFiles.length}`);
});

for (const race of racesToCheck) {
  test(`AC1: exactly one wave-3 signature card names "${race.title}"`, () => {
    assert.ok(race.title, `expected a race title ("# The <Name>") in ${race.file}`);
    const withRace = cards.filter((c) => cardText(c).includes(race.title));
    assert.strictEqual(
      withRace.length,
      1,
      `expected exactly one wave-3 card naming "${race.title}", found ${withRace.length}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3: across character-signatures.md, character-signatures-wave-2.md, and
// character-signatures-wave-3.md combined, no named character is used by
// more than one card.
// ---------------------------------------------------------------------------

test('AC3: none of the wave-3 card names collides with a card name in character-signatures.md or character-signatures-wave-2.md', () => {
  const priorNames = new Set([...wave1Cards, ...wave2Cards].map((c) => c.name));
  for (const card of cards) {
    assert.ok(
      !priorNames.has(card.name),
      `expected wave-3 card "${card.name}" not to collide with a wave-1 or wave-2 card name`
    );
  }
});

for (const race of racesToCheck) {
  test(`AC3: the wave-3 card naming "${race.title}" names a character not already signed by wave 1 or wave 2`, () => {
    const withRace = cards.filter((c) => cardText(c).includes(race.title));
    if (withRace.length !== 1) return; // covered by the AC1 test above
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
      !priorNamedCharacterNames.has(matches[0].name),
      `expected "${card.name}" not to re-sign "${matches[0].name}", already named by a wave-1 or wave-2 card`
    );
  });
}

test('AC3: across all three character-signatures files combined, no named character is used by more than one card', () => {
  const seenBy = new Map();
  const allCards = [...wave1Cards, ...wave2Cards, ...cardsToCheck];
  for (const card of allCards) {
    for (const match of namedCharacters(card)) {
      assert.ok(
        !seenBy.has(match.name),
        `character "${match.name}" is named by both "${seenBy.get(match.name)}" and "${card.name}"`
      );
      seenBy.set(match.name, card.name);
    }
  }
});

// ---------------------------------------------------------------------------
// AC4: each card's Cost line names that race's own primary Fount (per
// design/races/*.md), its Type line matches that race's own domain, and
// every card follows the Section 9.1 template field order (Name, Cost line,
// Type line, Rules text, optional Stats/counters line).
// ---------------------------------------------------------------------------

for (const card of sectionsToCheck) {
  registerCardTemplateChecks(card.title, card.body);
}

for (const race of racesToCheck) {
  test(`AC4: the wave-3 card naming "${race.title}" uses that race's own primary Fount in its Cost line`, () => {
    assert.ok(race.domain, `expected a "Primary strength" bullet in design/races/${race.file}`);
    const expectedFount = FOUNT_BY_DOMAIN[race.domain];
    assert.ok(expectedFount, `no known Fount for domain "${race.domain}" (${race.file})`);

    const withRace = cards.filter((c) => cardText(c).includes(race.title));
    assert.strictEqual(withRace.length, 1, `expected exactly one wave-3 card naming "${race.title}"`);
    const card = withRace[0];

    assert.ok(
      new RegExp(`\\b${expectedFount}\\b`).test(card.costLine || ''),
      `expected "${card.name}"'s Cost line to name "${expectedFount}" (${race.title}'s primary Fount), got: "${card.costLine}"`
    );
  });

  test(`AC4: the wave-3 card naming "${race.title}" has a Type line matching that race's own domain`, () => {
    assert.ok(race.domain, `expected a "Primary strength" bullet in design/races/${race.file}`);
    const withRace = cards.filter((c) => cardText(c).includes(race.title));
    assert.strictEqual(withRace.length, 1, `expected exactly one wave-3 card naming "${race.title}"`);
    const card = withRace[0];

    assert.ok(
      new RegExp(`\\b${race.domain}\\b`).test(card.typeLine || ''),
      `expected "${card.name}"'s Type line to name "${race.domain}" (${race.title}'s own domain), got: "${card.typeLine}"`
    );

    if (PERMANENT_DOMAINS.has(race.domain)) {
      assert.ok(
        /\bPermanent\b/.test(card.typeLine || ''),
        `expected "${card.name}"'s Type line to say "Permanent" since ${race.domain} is always a Permanent (rules.md Section 9), got: "${card.typeLine}"`
      );
    } else if (NEVER_PERMANENT_DOMAINS.has(race.domain)) {
      assert.ok(
        !/\bPermanent\b/.test(card.typeLine || ''),
        `expected "${card.name}"'s Type line not to say "Permanent" since ${race.domain} is never a Permanent (rules.md Section 9), got: "${card.typeLine}"`
      );
    }
  });
}

// ---------------------------------------------------------------------------
// AC5: site/design/cards/character-signatures-wave-3.html exists via
// tools/build-site.js, and character-signatures.md,
// character-signatures-wave-2.md, and every design/characters/*.md file are
// byte-for-byte unchanged.
//
// The byte-for-byte-unchanged half of this AC is a diff-time property, not
// something this test file can usefully assert on its own (a hardcoded hash
// here would be correct today and a guaranteed false alarm the moment a
// later unit legitimately touches one of these shared files) — same
// convention already used by test/design-art-briefs-character-signatures-wave-2.test.js
// and test/design-full-game-playtest-2.test.js. It's verified by the
// orchestrator's diff at merge time instead; this suite only checks that the
// files still exist, are non-empty, and still parse.
// ---------------------------------------------------------------------------

test('AC5: site/design/cards/character-signatures-wave-3.html exists', () => {
  assert.ok(
    fs.existsSync(SITE_PATH),
    `expected ${SITE_PATH} to exist — run "node tools/build-site.js" after creating the markdown source`
  );
});

test('AC5: character-signatures.md and character-signatures-wave-2.md still exist, non-empty, and parse', () => {
  for (const p of [WAVE1_PATH, WAVE2_PATH]) {
    assert.ok(fs.existsSync(p), `expected ${p} to still exist`);
    assert.ok(fs.readFileSync(p, 'utf8').length > 0, `expected ${p} to be non-empty`);
    assert.doesNotThrow(() => parseCardMarkdown(fs.readFileSync(p, 'utf8')), `expected ${p} to still parse`);
  }
});

test('AC5: every design/characters/*.md file still exists, non-empty, and parses', () => {
  const charFiles = listMdFiles(CHAR_DIR);
  assert.ok(charFiles.length > 0, `expected at least one file under ${CHAR_DIR}`);
  for (const f of charFiles) {
    const p = path.join(CHAR_DIR, f);
    assert.ok(fs.readFileSync(p, 'utf8').length > 0, `expected ${p} to be non-empty`);
    assert.doesNotThrow(() => parseSections(fs.readFileSync(p, 'utf8')), `expected ${p} to still parse`);
  }
});
