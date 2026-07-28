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

function rulesSections() {
  return parseSections(readRules());
}

function topLevelSections(content) {
  const sections = parseSections(content);
  return sections
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title));
}

function targetingBody() {
  return sectionText(rulesSections(), /^13\.\s+targeting/i);
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md contains a new numbered top-level section titled
// "Targeting" appended immediately after the current Section 12 (Combat
// Resolution), and every previously-existing section keeps its original
// number and title unchanged.
// ---------------------------------------------------------------------------

const EXPECTED_TOP_LEVEL_TITLES = [
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
  '11. Deck Construction',
  '12. Combat Resolution',
  '13. Targeting',
];

test('AC1: rules.md appends "13. Targeting" immediately after "12. Combat Resolution", with every earlier section\'s number and title unchanged', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  assert.deepStrictEqual(
    titles,
    EXPECTED_TOP_LEVEL_TITLES,
    `expected exactly ${JSON.stringify(EXPECTED_TOP_LEVEL_TITLES)}, got ${JSON.stringify(titles)}`
  );
});

test('AC1: "13. Targeting" is a level-2 heading with a non-empty body', () => {
  const sections = rulesSections();
  const idx = findSection(sections, /^13\.\s+targeting/i);
  assert.notStrictEqual(idx, -1, 'expected a "13. Targeting" heading');
  assert.strictEqual(sections[idx].level, 2, 'expected "13. Targeting" to be a top-level (##) heading');
  const body = targetingBody();
  assert.ok(body && body.trim().length > 0, 'expected the Targeting section to have body content');
});

// ---------------------------------------------------------------------------
// AC2: a target is chosen at the moment the targeting card or ability is
// added to the Queue (Section 6), not later, and must be legal at that
// moment.
// ---------------------------------------------------------------------------

test('AC2: Targeting states a target is chosen when the card/ability is added to the Queue, not when it resolves', () => {
  const body = targetingBody();
  assert.ok(body, 'expected a Targeting section body');
  assert.ok(
    /target is chosen[^.]*added to the Queue/i.test(body),
    'expected the section to state a target is chosen at the moment the card/ability is added to the Queue'
  );
  assert.ok(
    /never (at the moment it resolves|later)/i.test(body),
    'expected the section to explicitly rule out choosing a target later or at resolution'
  );
});

test('AC2: Targeting states a target must be legal at the moment it is chosen', () => {
  const body = targetingBody();
  assert.ok(body, 'expected a Targeting section body');
  assert.ok(
    /must be a legal target at that moment/i.test(body),
    'expected the section to state a chosen target must be legal at the moment it is chosen'
  );
});

// ---------------------------------------------------------------------------
// AC3: target legality is rechecked immediately before the entry resolves,
// and an entry with exactly one target that is illegal at that recheck
// fizzles: it does nothing and is removed from the Queue.
// ---------------------------------------------------------------------------

test('AC3: Targeting states target legality is rechecked immediately before the entry resolves', () => {
  const body = targetingBody();
  assert.ok(body, 'expected a Targeting section body');
  assert.ok(
    /rechecked immediately before the entry[^.]*resolves/i.test(body),
    'expected the section to state legality is rechecked immediately before the entry resolves'
  );
});

test('AC3: Targeting states an entry with exactly one illegal target at recheck fizzles: does nothing and is removed from the Queue', () => {
  const body = targetingBody();
  assert.ok(body, 'expected a Targeting section body');
  assert.ok(
    /exactly one target[^.]*not a legal target[^.]*fizzles/i.test(body),
    'expected the section to state an entry with exactly one illegal target at recheck fizzles'
  );
  assert.ok(/does nothing/i.test(body), 'expected the section to state a fizzled entry does nothing');
  assert.ok(
    /removed from the Queue/i.test(body),
    'expected the section to state a fizzled entry is removed from the Queue'
  );
});
