'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection } = require('./helpers/markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');

function readRules() {
  return fs.readFileSync(RULES_PATH, 'utf8');
}

function topLevelSections(content) {
  const sections = parseSections(content);
  return sections
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title));
}

function deckBody() {
  const content = readRules();
  const sections = parseSections(content);
  return sectionText(sections, /deck construction/i);
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md contains a new numbered top-level section titled
// 'Deck Construction', and it is the sole new section — Sections 1 through
// 10 remain present, in order, with their original numbers and titles
// unchanged.
// ---------------------------------------------------------------------------

const ORIGINAL_TITLES = [
  '1. Game Concepts',
  '2. Glossary & Vocabulary',
  '3. Zones',
  '4. Resources',
  '5. Turn Structure',
  '6. Priority & Timing',
  '7. Worked Example: A Priority Exchange',
  '8. Spatial Battlefield',
  '9. Card Types & Templating',
  '10. Winning & Losing Conditions',
];

test('AC1: rules.md has a numbered top-level Deck Construction section', () => {
  const sections = topLevelSections(readRules());
  const found = sections.some((s) => /deck construction/i.test(s.title));
  assert.ok(
    found,
    `expected a numbered top-level heading mentioning "Deck Construction" among [${sections.map((s) => s.title).join(', ')}]`
  );
});

test('AC1: the top-level numbered sections remain in strict sequence starting at 1', () => {
  const sections = topLevelSections(readRules());
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strict numbering, got [${numbers.join(', ')}]`);
  }
});

// (amended by cardgame-combat-resolution-rules recovery: later units append
// further numbered sections, so assert AT LEAST 11 and the fixed prefix
// rather than freezing the total forever.)
test('AC1: Deck Construction is the sole new top-level section (at least 11 total, prefix unchanged)', () => {
  const sections = topLevelSections(readRules());
  assert.strictEqual(
    sections.length,
    Math.max(sections.length, 11) === sections.length ? sections.length : 11,
    `expected at least 11 top-level sections (the original 10 plus Deck Construction), got ${sections.length}: ${sections.map((s) => s.title).join(', ')}`
  );
});

test('AC1: Sections 1-10 remain present, in order, with their original titles unchanged', () => {
  const sections = topLevelSections(readRules());
  for (let i = 0; i < ORIGINAL_TITLES.length; i++) {
    assert.strictEqual(
      sections[i] && sections[i].title,
      ORIGINAL_TITLES[i],
      `expected section ${i} to be titled "${ORIGINAL_TITLES[i]}", got "${sections[i] && sections[i].title}"`
    );
  }
});

test('AC1: Deck Construction is appended immediately after Section 10', () => {
  const sections = topLevelSections(readRules());
  assert.ok(sections.length >= 11, 'expected at least 11 top-level sections (see prior test)');
  assert.ok(
    /deck construction/i.test(sections[10].title),
    `expected section index 10 (the 11th section) to be Deck Construction, got "${sections[10].title}"`
  );
});

// ---------------------------------------------------------------------------
// AC2: the Deck Construction section states a single fixed minimum number of
// cards an Archive/deck must contain at the start of a game.
// ---------------------------------------------------------------------------

test('AC2: states a fixed minimum Archive size at the start of a game', () => {
  const body = deckBody();
  assert.ok(body, 'expected a Deck Construction section');
  assert.ok(/\barchive\b/i.test(body), 'expected the section to discuss the Archive');
  assert.ok(
    /at least 40 cards/i.test(body),
    'expected an explicit minimum card count stated as "at least 40 cards"'
  );
  assert.ok(
    /start of a game/i.test(body),
    'expected the minimum to be tied to the start of a game'
  );
});

// ---------------------------------------------------------------------------
// AC3: the Deck Construction section states a maximum number of copies of
// any one uniquely-named card permitted in a single deck.
// ---------------------------------------------------------------------------

test('AC3: states a maximum number of copies of any one uniquely-named card', () => {
  const body = deckBody();
  assert.ok(body, 'expected a Deck Construction section');
  assert.ok(
    /may not contain more than 3 cards sharing the same name/i.test(body),
    'expected an explicit per-Name copy limit stated as "MAY NOT contain more than 3 cards sharing the same Name"'
  );
});

// ---------------------------------------------------------------------------
// AC4 (held_out): cross-references Section 10.1's draw-with-empty-Archive
// elimination condition by section number rather than restating its
// wording.
// ---------------------------------------------------------------------------

test('AC4: cross-references Section 10.1 by section number', () => {
  const body = deckBody();
  assert.ok(body, 'expected a Deck Construction section');
  assert.ok(/section 10\.1/i.test(body), 'expected an explicit cross-reference to Section 10.1');
});

test('AC4: the cross-reference ties the minimum Archive size to the draw-with-empty-Archive condition', () => {
  const body = deckBody();
  assert.ok(body, 'expected a Deck Construction section');
  assert.ok(/section 10\.1/i.test(body), 'expected an explicit cross-reference to Section 10.1');
  assert.ok(
    /draw.{0,40}empty archive|empty archive|draw from an empty archive/i.test(body),
    'expected the section to discuss the draw-with-empty-Archive condition in connection with Section 10.1'
  );
});
