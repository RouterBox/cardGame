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

function gameStartSectionBody() {
  return sectionText(rulesSections(), /^15\.\s+starting the game/i);
}

// Finds the level-3 subsection under Section 15 whose title matches titleRegex.
function findGameStartSubsection(titleRegex) {
  const sections = rulesSections();
  const idx = findSection(sections, /^15\.\s+starting the game/i);
  if (idx === -1) return null;
  const level = sections[idx].level;
  for (let i = idx + 1; i < sections.length; i++) {
    if (sections[i].level <= level) break;
    if (titleRegex.test(sections[i].title)) return sections[i];
  }
  return null;
}

function findWorkedExampleSubsection() {
  return findGameStartSubsection(/worked example/i);
}

// The exact top-level heading lines Sections 1-14 must remain byte-identical
// to, before this unit's Section 15 addition (AC1).
const EXPECTED_PRE_EXISTING_HEADINGS = [
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
  '14. Keyword Abilities',
];

// ---------------------------------------------------------------------------
// AC1: design/rules.md gains a new top-level section "## 15. Starting the
// Game" appearing immediately after Section 14 ends; every existing Section
// 1-14 heading and its numbering is byte-identical to before this unit.
// ---------------------------------------------------------------------------

test('AC1: Sections 1-14 headings and numbering are unchanged', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.slice(0, EXPECTED_PRE_EXISTING_HEADINGS.length).map((s) => s.title);
  assert.deepStrictEqual(titles, EXPECTED_PRE_EXISTING_HEADINGS);
});

test('AC1: rules.md has a numbered top-level "15. Starting the Game" section immediately after "14. Keyword Abilities"', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  const idx14 = titles.findIndex((t) => /^14\.\s+keyword abilities/i.test(t));
  assert.notStrictEqual(idx14, -1, `expected "14. Keyword Abilities" to still exist, got [${titles.join(', ')}]`);
  const idx15 = titles.findIndex((t) => /^15\.\s+starting the game/i.test(t));
  assert.notStrictEqual(
    idx15,
    -1,
    `expected a "15. Starting the Game" top-level section, got [${titles.join(', ')}]`
  );
  assert.strictEqual(idx15, idx14 + 1, 'expected "15. Starting the Game" to immediately follow "14. Keyword Abilities"');
});

test('AC1: top-level section numbers remain in strict sequence through Section 15', () => {
  const sections = topLevelSections(readRules());
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  assert.ok(numbers.includes(15), `expected section number 15 among [${numbers.join(', ')}]`);
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strict sequence starting at 1, got [${numbers.join(', ')}]`);
  }
});

test('AC1: "15. Starting the Game" is a level-2 heading with a non-empty body', () => {
  const sections = rulesSections();
  const idx = findSection(sections, /^15\.\s+starting the game/i);
  assert.notStrictEqual(idx, -1, 'expected a "15. Starting the Game" heading');
  assert.strictEqual(sections[idx].level, 2, 'expected "15. Starting the Game" to be a top-level (##) heading');
  const body = gameStartSectionBody();
  assert.ok(body && body.trim().length > 0, 'expected the Starting the Game section to have body content');
});

// ---------------------------------------------------------------------------
// AC2: shuffling cross-referencing Section 3 and Section 11.1, plus a
// specific, unambiguous numbered first-turn procedure.
// ---------------------------------------------------------------------------

test('AC2: Section 15 states each challenger shuffles their Archive before the game begins, citing Section 3 and Section 11.1', () => {
  const body = normalizeProse(gameStartSectionBody() || '');
  assert.ok(/shuffle/i.test(body), 'expected Section 15 to mention shuffling');
  assert.ok(/Section 3/.test(body), 'expected Section 15 to cross-reference Section 3 (Zones)');
  assert.ok(/Section 11\.1/.test(body), "expected Section 15 to cross-reference Section 11.1's 40-card minimum");
});

test('AC2: Section 15 has a subsection stating a specific, numbered procedure for determining the first turn', () => {
  const sub = findGameStartSubsection(/first turn/i);
  assert.ok(sub, 'expected a Section 15 subsection about determining the first turn');
  assert.ok(/^15\.\d+/.test(sub.title), `expected the subsection heading to be numbered under 15, got "${sub.title}"`);
  const raw = sub.lines.join('\n');
  const stepMatches = raw.match(/^\d+\.\s+\S/gm) || [];
  assert.ok(stepMatches.length >= 2, `expected at least 2 numbered procedure steps, found ${stepMatches.length}`);
  const body = normalizeProse(raw);
  assert.ok(/first turn/i.test(body), 'expected the procedure to state which challenger takes the first turn');
});

// ---------------------------------------------------------------------------
// AC3: a specific numeric opening hand size, and a mulligan procedure
// (shuffle hand back into Archive, redraw same size) with an explicit cap,
// consistent with Section 5.1's first-turn-doesn't-draw exception.
// ---------------------------------------------------------------------------

test('AC3: Section 15 states a specific numeric opening hand size', () => {
  const body = normalizeProse(gameStartSectionBody() || '');
  assert.ok(/opening hand/i.test(body), 'expected Section 15 to mention "opening hand"');
  assert.ok(/\b5 cards\b/i.test(body), 'expected Section 15 to state a specific numeric opening hand size (5 cards)');
});

test('AC3: Section 15 has a mulligan subsection: shuffle hand back into Archive, redraw same size, explicit cap', () => {
  const sub = findGameStartSubsection(/mulligan/i);
  assert.ok(sub, 'expected a Section 15 subsection about mulligans');
  assert.ok(/^15\.\d+/.test(sub.title), `expected the subsection heading to be numbered under 15, got "${sub.title}"`);
  const body = normalizeProse(sub.lines.join('\n'));
  assert.ok(
    /shuffle[^.]*(back into|into)[^.]*archive/i.test(body),
    'expected the mulligan procedure to shuffle the hand back into the Archive'
  );
  assert.ok(/draw[^.]*new opening hand/i.test(body), 'expected the mulligan procedure to redraw a new opening hand');
  assert.ok(/\b5 cards\b/i.test(body), 'expected the redraw to be the same stated opening hand size (5 cards)');
  assert.ok(
    /\b2 mulligans\b|\bmore than 2\b|\bat most 2\b/i.test(body),
    'expected an explicit numeric cap on mulligans'
  );
});

test("AC3: the mulligan procedure is written to remain consistent with Section 5.1's first-turn-doesn't-draw exception", () => {
  const sub = findGameStartSubsection(/mulligan/i);
  assert.ok(sub, 'expected a Section 15 subsection about mulligans');
  const body = normalizeProse(sub.lines.join('\n'));
  assert.ok(/Section 5\.1/.test(body), 'expected the mulligan subsection to cross-reference Section 5.1');
  assert.ok(
    /still does not draw/i.test(body),
    'expected the mulligan subsection to reaffirm the first-turn challenger still does not draw during their first Dawn Phase'
  );
});

// ---------------------------------------------------------------------------
// AC4: a Worked Example subsection, in the cited/numbered style of Sections
// 8.7, 10.3, 11.3, walking two challengers through shuffling, first-player
// determination, opening hands, and one challenger taking a mulligan.
// ---------------------------------------------------------------------------

test('AC4: Section 15 includes a numbered "Worked Example" subsection', () => {
  const sub = findWorkedExampleSubsection();
  assert.ok(sub, 'expected a Section 15 subsection titled "Worked Example: ..."');
  assert.strictEqual(sub.level, 3, 'expected the worked example to be a numbered (###) sub-heading');
  assert.ok(/^15\.\d+/.test(sub.title), `expected the worked example's heading to be numbered under 15, got "${sub.title}"`);
});

test('AC4: the worked example walks through a numbered sequence of at least 3 concrete steps', () => {
  const sub = findWorkedExampleSubsection();
  assert.ok(sub, 'expected a Section 15 worked example subsection');
  const raw = sub.lines.join('\n');
  const stepMatches = raw.match(/^\d+\.\s+\S/gm) || [];
  assert.ok(stepMatches.length >= 3, `expected at least 3 numbered steps in the worked example, found ${stepMatches.length}`);
});

test('AC4: the worked example covers shuffling, first-player determination, opening hands, and a mulligan, citing section numbers', () => {
  const sub = findWorkedExampleSubsection();
  assert.ok(sub, 'expected a Section 15 worked example subsection');
  const body = normalizeProse(sub.lines.join('\n'));
  assert.ok(/shuffl/i.test(body), 'expected the worked example to cover shuffling');
  assert.ok(/first turn/i.test(body), 'expected the worked example to cover first-turn/first-player determination');
  assert.ok(/opening hand/i.test(body), 'expected the worked example to cover opening hands');
  assert.ok(/mulligan/i.test(body), 'expected the worked example to cover a mulligan');
  assert.ok(/\bSection \d+/.test(body), 'expected the worked example to cross-reference other rules sections by number');
});
