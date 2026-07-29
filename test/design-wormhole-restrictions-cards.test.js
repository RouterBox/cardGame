'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'wormhole-restrictions-set.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');

// Race -> the one Fount its Cost line must name, per the mapping
// design/cards/frontier-set.md already uses.
const RACE_TO_FOUNT = {
  'Cindral Reach': 'Mass',
  'Mireth Bloom': 'Bloom',
  'Panoptic Concord': 'Signal',
  'Starweave Communion': 'Tangle',
  'Wrought Assembly': 'Circuit',
};
const ALL_FOUNTS = Object.values(RACE_TO_FOUNT);

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readFile(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

// Each `###` heading is one card; its body is the raw lines directly under
// it — same convention as design/cards/frontier-set.md and
// test/design-frontier-cards.test.js.
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

function costLine(card) {
  const m = card.body.match(/Cost line:\s*([^\n]+)/);
  return m ? m[1].trim() : '';
}

function raceForCard(card) {
  return Object.keys(RACE_TO_FOUNT).find((race) => new RegExp(escapeRegExp(race)).test(card.body));
}

const cards = listCards();
const cardsToCheck = cards.length
  ? cards
  : [{ title: '<no cards found — design/cards/wormhole-restrictions-set.md missing or empty>', body: '' }];

const races = listRaces();
const racesToCheck = races.length
  ? races
  : [{ file: '<no race files found under design/races/>', raceName: null }];

// ---------------------------------------------------------------------------
// AC1: design/cards/wormhole-restrictions-set.md exists and contains exactly
// 5 distinct named cards, one per race under design/races/, each with a Cost
// line, Type line, and Rules text in that order, and a Stats/counters line
// only when its Type line contains 'Permanent' — the same template
// test/design-frontier-cards.test.js enforces for frontier-set.md.
// ---------------------------------------------------------------------------

test('AC1: design/cards/wormhole-restrictions-set.md exists', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
});

test('AC1: wormhole-restrictions-set.md contains exactly 5 distinct named cards', () => {
  const names = cards.map((c) => c.title);
  assert.strictEqual(names.length, 5, `expected exactly 5 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

for (const race of racesToCheck) {
  test(`AC1: exactly one Wormhole Restriction card is tied to the race in ${race.file}`, () => {
    assert.ok(race.raceName, `expected a race title ("# The <Name>") in ${race.file}`);
    const raceNameRe = new RegExp(escapeRegExp(race.raceName));
    const matches = cards.filter((c) => raceNameRe.test(c.body));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one Wormhole Restriction card naming "${race.raceName}", found ${matches.length}: [${matches
        .map((m) => m.title)
        .join(', ')}]`
    );
  });
}

for (const card of cardsToCheck) {
  test(`AC1: "${card.title}" has Cost line, Type line, and Rules text in order`, () => {
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

  test(`AC1: "${card.title}" only carries a Stats/counters line after Rules text, and only if a Permanent`, () => {
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
// AC2: every card's Rules text explicitly places a Directional Restriction
// or a Team Restriction (as defined in rules.md Section 8.4) onto a
// Wormhole, cites 'Section 8.4' by number, and never creates or references a
// Unit-type Restriction.
// ---------------------------------------------------------------------------

for (const card of cardsToCheck) {
  test(`AC2: "${card.title}" places a Directional or Team Restriction and cites Section 8.4`, () => {
    const body = card.body;
    const placesDirectional = /place a Directional Restriction\b/.test(body);
    const placesTeam = /place a Team Restriction\b/.test(body);
    assert.ok(
      placesDirectional || placesTeam,
      `expected "${card.title}" to place a Directional Restriction or a Team Restriction onto a Wormhole`
    );
    assert.match(body, /Section\s+8\.4\b/, `expected "${card.title}" to cite Section 8.4 by number`);
    assert.ok(/\bWormhole\b/.test(body), `expected "${card.title}" to place its Restriction onto a Wormhole`);
  });

  test(`AC2: "${card.title}" never creates or references a Unit-type Restriction`, () => {
    assert.ok(
      !/Unit-type Restriction/i.test(card.body),
      `expected "${card.title}" not to mention a Unit-type Restriction`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3: each card's Cost line names exactly the Fount matching its race, per
// the Cindral Reach/Mass, Mireth Bloom/Bloom, Panoptic Concord/Signal,
// Starweave Communion/Tangle, Wrought Assembly/Circuit mapping already used
// in frontier-set.md.
// ---------------------------------------------------------------------------

for (const card of cardsToCheck) {
  test(`AC3: "${card.title}" Cost line names exactly the Fount matching its race`, () => {
    const race = raceForCard(card);
    assert.ok(race, `expected "${card.title}" to name one of the five races`);
    if (!race) return;
    const expectedFount = RACE_TO_FOUNT[race];
    const cost = costLine(card);
    assert.match(
      cost,
      new RegExp(`\\b${expectedFount}\\b`),
      `expected "${card.title}"'s Cost line ("${cost}") to name the ${expectedFount}, matching its race ${race}`
    );
    const otherFounts = ALL_FOUNTS.filter((f) => f !== expectedFount);
    for (const other of otherFounts) {
      assert.ok(
        !new RegExp(`\\b${other}\\b`).test(cost),
        `expected "${card.title}"'s Cost line ("${cost}") not to name any Fount besides ${expectedFount}, but it also names ${other}`
      );
    }
  });
}
