'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'fount-economy-set.md');

// Fount -> the race whose card ties to it, per the race-to-Fount mapping
// design/cards/frontier-set.md already uses (one card per race, keyed by
// that race's own primary Fount strength under design/races/).
const FOUNT_TO_RACE = {
  Mass: 'Cindral Reach',
  Bloom: 'Mireth Bloom',
  Signal: 'Panoptic Concord',
  Circuit: 'Wrought Assembly',
  Tangle: 'Starweave Communion',
};

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

const cards = listCards();
const cardsToCheck = cards.length
  ? cards
  : [{ title: '<no cards found — design/cards/fount-economy-set.md missing or empty>', body: '' }];

function isGeneratorAttunedTo(card, fount) {
  return new RegExp(`This permanent is a Generator attuned to the ${fount}\\b`).test(card.body);
}

function costLine(card) {
  const m = card.body.match(/Cost line:\s*([^\n]+)/);
  return m ? m[1].trim() : '';
}

// ---------------------------------------------------------------------------
// AC1: design/cards/fount-economy-set.md exists and contains exactly 6
// distinct named cards, each with Cost line, Type line, and Rules text in
// that order (and a Stats/counters line, only if present, only on
// Permanents) — the same template test/design-frontier-cards.test.js
// already enforces for frontier-set.md.
// ---------------------------------------------------------------------------

test('AC1: design/cards/fount-economy-set.md exists', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
});

test('AC1: fount-economy-set.md contains exactly 6 distinct named cards', () => {
  const names = cards.map((c) => c.title);
  assert.strictEqual(names.length, 6, `expected exactly 6 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

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
// AC2: exactly one of the 6 cards is a Permanent whose rules text reads as
// a Generator attuned to Bloom, exactly one to Signal, and exactly one to
// Tangle, each producing 1 point of that Fount during the Generation Phase
// and citing Section 5.2, matching the existing "This permanent is a
// Generator attuned to the <Fount>" pattern used by Salvage-Wrought Bastion
// and Replicant Foundry Core.
// ---------------------------------------------------------------------------

for (const fount of ['Bloom', 'Signal', 'Tangle']) {
  test(`AC2: exactly one card is a Generator attuned to the ${fount}`, () => {
    const matches = cards.filter((c) => isGeneratorAttunedTo(c, fount));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one Generator attuned to the ${fount}, found ${matches.length}: [${matches
        .map((m) => m.title)
        .join(', ')}]`
    );
  });

  test(`AC2: the ${fount} Generator produces 1 ${fount} Point, cites Section 5.2, and is a Permanent`, () => {
    const match = cards.find((c) => isGeneratorAttunedTo(c, fount));
    assert.ok(match, `expected to find a Generator attuned to the ${fount}`);
    if (!match) return;
    assert.match(match.body, /Section\s+5\.2/, `expected "${match.title}" to cite Section 5.2`);
    assert.match(
      match.body,
      new RegExp(`produces 1 ${fount} Point`),
      `expected "${match.title}" to produce 1 ${fount} Point`
    );
    const typeMatch = match.body.match(/Type line:\s*([^\n]+)/);
    assert.ok(
      typeMatch && /\bPermanent\b/.test(typeMatch[1]),
      `expected "${match.title}" to be a Permanent`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3: exactly one of the 6 cards (distinct from the three Generators
// above) has a Cost line of exactly "1 Circuit", exactly one has "1 Bloom",
// and exactly one has "1 Tangle".
// ---------------------------------------------------------------------------

for (const fount of ['Circuit', 'Bloom', 'Tangle']) {
  test(`AC3: exactly one non-Generator card has a Cost line of exactly "1 ${fount}"`, () => {
    const matches = cards.filter(
      (c) => costLine(c) === `1 ${fount}` && !/This permanent is a Generator attuned to/.test(c.body)
    );
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one non-Generator card costed exactly "1 ${fount}", found ${matches.length}: [${matches
        .map((m) => m.title)
        .join(', ')}]`
    );
  });
}

// ---------------------------------------------------------------------------
// AC4 (held-out, inferred): each new card's flavor text names the race
// matching the Fount it's tied to — Generators keyed by the Fount they're
// attuned to, the three 1-cost cards keyed by their Cost line's Fount — per
// the existing Cindral Reach/Mireth Bloom/Panoptic Concord/Starweave
// Communion/Wrought Assembly-to-Fount mapping used in frontier-set.md. The
// "alpha-set.md, frontier-set.md, and character-signatures.md are
// byte-identical to before this unit" half of AC4 is not automated here —
// see plan.md's "Step 3" verification note.
// ---------------------------------------------------------------------------

for (const fount of ['Bloom', 'Signal', 'Tangle']) {
  test(`AC4: the ${fount} Generator names the ${FOUNT_TO_RACE[fount]}`, () => {
    const match = cards.find((c) => isGeneratorAttunedTo(c, fount));
    assert.ok(match, `expected to find a Generator attuned to the ${fount}`);
    if (!match) return;
    assert.match(
      match.body,
      new RegExp(escapeRegExp(FOUNT_TO_RACE[fount])),
      `expected "${match.title}" to name the ${FOUNT_TO_RACE[fount]}`
    );
  });
}

for (const fount of ['Circuit', 'Bloom', 'Tangle']) {
  test(`AC4: the 1 ${fount} card names the ${FOUNT_TO_RACE[fount]}`, () => {
    const match = cards.find(
      (c) => costLine(c) === `1 ${fount}` && !/This permanent is a Generator attuned to/.test(c.body)
    );
    assert.ok(match, `expected to find a non-Generator card costed exactly "1 ${fount}"`);
    if (!match) return;
    assert.match(
      match.body,
      new RegExp(escapeRegExp(FOUNT_TO_RACE[fount])),
      `expected "${match.title}" to name the ${FOUNT_TO_RACE[fount]}`
    );
  });
}
