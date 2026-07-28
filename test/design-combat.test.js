'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection, normalizeProse } = require('./helpers/markdown');

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

function combatBody() {
  return sectionText(rulesSections(), /^12\.\s+combat resolution/i);
}

// Prose-phrase assertions below regex-match against normalized text so a
// phrase split across the rulebook's ~75-char line wrap still matches.
function combatProse() {
  const body = combatBody();
  return body === null ? null : normalizeProse(body);
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md contains a new numbered top-level section titled
// "Combat Resolution" appended after the current last top-level section,
// and every previously-existing section keeps its original number and
// title unchanged.
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
];

// (amended by cardgame-targeting-rules recovery: later units append further
// numbered sections — assert the fixed PREFIX, not the exact full list, the
// same forward-compatible shape the deckbuilding test now uses.)
test('AC1: rules.md appends "12. Combat Resolution" after the prior last section, with every earlier section\'s number and title unchanged', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  assert.ok(titles.length >= EXPECTED_TOP_LEVEL_TITLES.length,
    `expected at least ${EXPECTED_TOP_LEVEL_TITLES.length} top-level sections, got ${titles.length}`);
  assert.deepStrictEqual(
    titles.slice(0, EXPECTED_TOP_LEVEL_TITLES.length),
    EXPECTED_TOP_LEVEL_TITLES,
    `expected the first sections to be exactly ${JSON.stringify(EXPECTED_TOP_LEVEL_TITLES)}, got ${JSON.stringify(titles)}`
  );
});

test('AC1: "12. Combat Resolution" has a non-empty section body', () => {
  const idx = findSection(rulesSections(), /^12\.\s+combat resolution/i);
  assert.notStrictEqual(idx, -1, 'expected a "12. Combat Resolution" heading');
  const body = combatBody();
  assert.ok(body && body.trim().length > 0, 'expected the Combat Resolution section to have body content');
});

// ---------------------------------------------------------------------------
// AC2: a blocked attacker deals its combat strength as damage to its
// blocker(s) rather than to the non-active player's Core Integrity.
// ---------------------------------------------------------------------------

test('AC2: Combat Resolution states a blocked attacker deals its combat strength as damage to its blocker(s) instead of Core Integrity', () => {
  const body = combatProse();
  assert.ok(body, 'expected a Combat Resolution section body');
  assert.ok(/\bblocked\b/i.test(body) && /\bblocker/i.test(body), 'expected the section to discuss blocked attackers and blockers');
  assert.ok(
    /combat strength as damage to (its|their) blocker/i.test(body),
    'expected the section to state a blocked attacker deals its combat strength as damage to its blocker(s)'
  );
  assert.ok(
    (/instead of/i.test(body) || /rather than/i.test(body)) && /core integrity/i.test(body),
    'expected the section to state this damage goes to blockers instead of Core Integrity'
  );
});

// ---------------------------------------------------------------------------
// AC3: who chooses the damage assignment order when a single attacker has
// more than one blocker.
// ---------------------------------------------------------------------------

test('AC3: Combat Resolution states the attacking/active player chooses damage assignment order among multiple blockers', () => {
  const body = combatProse();
  assert.ok(body, 'expected a Combat Resolution section body');
  assert.ok(/more than one blocker/i.test(body), 'expected the section to address the multiple-blocker case');
  assert.ok(
    /(attacking player|active player)[^.]*chooses[^.]*order/i.test(body),
    'expected the section to state the attacking/active player chooses the damage assignment order'
  );
});
