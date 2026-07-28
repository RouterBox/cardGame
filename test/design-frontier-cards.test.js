'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'frontier-set.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');

// Section 8 spatial terms -> the Section 8 subsection that defines each,
// per design/rules.md (8.3 Discovery, 8.4 Wormhole Restrictions,
// 8.5 Wormhole Closure, 8.6 Positional Generators: Blockade & Capture,
// which also defines the Assault action).
const SPATIAL_TERM_SECTIONS = {
  Discovery: '8.3',
  Restriction: '8.4',
  Closure: '8.5',
  Assault: '8.6',
  Blockade: '8.6',
  Capture: '8.6',
};
const SPATIAL_TERMS = Object.keys(SPATIAL_TERM_SECTIONS);

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readCardsFile() {
  if (!fs.existsSync(CARDS_PATH)) return null;
  return fs.readFileSync(CARDS_PATH, 'utf8');
}

// Each `###` heading is one card; its body is the raw lines directly under
// it — same convention as design/cards/alpha-set.md and
// test/design-cards.test.js.
function listCards() {
  const content = readCardsFile();
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
  : [{ title: '<no cards found — design/cards/frontier-set.md missing or empty>', body: '' }];

const races = listRaces();
const racesToCheck = races.length
  ? races
  : [{ file: '<no race files found under design/races/>', raceName: null }];

// ---------------------------------------------------------------------------
// AC1: design/cards/frontier-set.md exists and contains exactly 5 distinct
// named cards, one per race under design/races/.
// ---------------------------------------------------------------------------

test('AC1: design/cards/frontier-set.md exists', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
});

test('AC1: frontier-set.md contains exactly 5 distinct named cards', () => {
  const names = cards.map((c) => c.title);
  assert.strictEqual(names.length, 5, `expected exactly 5 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

for (const race of racesToCheck) {
  test(`AC1: exactly one Frontier Set card is tied to the race in ${race.file}`, () => {
    assert.ok(race.raceName, `expected a race title ("# The <Name>") in ${race.file}`);
    const raceNameRe = new RegExp(escapeRegExp(race.raceName));
    const matches = cards.filter((c) => raceNameRe.test(c.body));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one Frontier Set card naming "${race.raceName}", found ${matches.length}: [${matches
        .map((m) => m.title)
        .join(', ')}]`
    );
  });
}

// ---------------------------------------------------------------------------
// AC2: every card uses the canonical template from rules.md Section 9.1 in
// order (Cost line, then Type line, then Rules text, and, only for
// Permanents, an optional Stats/counters line after Rules text).
// ---------------------------------------------------------------------------

for (const card of cardsToCheck) {
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
    assert.ok(
      rulesIdx !== -1 && statsIdx > rulesIdx,
      `expected Stats/counters line to follow Rules text in "${card.title}"`
    );
    const typeMatch = body.match(/Type line:\s*([^\n]+)/);
    assert.ok(typeMatch, `expected a Type line to check permanence in "${card.title}"`);
    assert.ok(
      /\bPermanent\b/.test(typeMatch[1]),
      `expected "${card.title}" to be a Permanent since it carries a Stats/counters line, got type line: ${typeMatch[1]}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3: each card's rules text names at least one Section 8 spatial term
// (Discovery, Restriction, Closure, Assault, Blockade, or Capture) and
// cites the specific rules.md Section 8 subsection number that defines it.
// ---------------------------------------------------------------------------

for (const card of cardsToCheck) {
  test(`AC3: "${card.title}" names a Section 8 spatial term and cites its defining subsection`, () => {
    const body = card.body;
    const termsPresent = SPATIAL_TERMS.filter((t) => new RegExp(`\\b${t}\\b`).test(body));
    assert.ok(
      termsPresent.length > 0,
      `expected "${card.title}" to name at least one of [${SPATIAL_TERMS.join(', ')}]`
    );
    const citesCorrectSection = termsPresent.some((t) => {
      const section = SPATIAL_TERM_SECTIONS[t];
      return new RegExp(`Section\\s+${section.replace('.', '\\.')}\\b`).test(body);
    });
    assert.ok(
      citesCorrectSection,
      `expected "${card.title}" to cite the correct Section 8 subsection for one of [${termsPresent.join(
        ', '
      )}] (expected one of [${termsPresent.map((t) => SPATIAL_TERM_SECTIONS[t]).join(', ')}])`
    );
  });
}
