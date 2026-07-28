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

function topLevelSections(content) {
  const sections = parseSections(content);
  return sections
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title));
}

function endgameBody() {
  const content = readRules();
  const sections = parseSections(content);
  return sectionText(sections, /winning.{0,5}losing/i);
}

// Prose-phrase assertions below regex-match against normalized text so a
// phrase split across the rulebook's ~75-char line wrap still matches.
function endgameProse() {
  const body = endgameBody();
  return body === null ? null : normalizeProse(body);
}

// ---------------------------------------------------------------------------
// AC1: a new numbered 'Winning & Losing Conditions' section defines at least
// one player-elimination condition, tied explicitly to Section 8's Capture
// rule by cross-referencing its section number rather than restating it.
// ---------------------------------------------------------------------------

test('AC1: rules.md has a numbered top-level Winning & Losing Conditions section', () => {
  const sections = topLevelSections(readRules());
  const found = sections.some((s) => /winning.{0,5}losing/i.test(s.title));
  assert.ok(
    found,
    `expected a numbered top-level heading mentioning "Winning & Losing Conditions" among [${sections.map((s) => s.title).join(', ')}]`
  );
});

test('AC1: the top-level numbered sections remain in strict sequence starting at 1', () => {
  const sections = topLevelSections(readRules());
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strict numbering, got [${numbers.join(', ')}]`);
  }
});

test('AC1: no existing numbered section is removed or renumbered (Sections 1-9 remain, in order, before Section 10)', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  const expectedPrefixes = ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.'];
  for (let i = 0; i < expectedPrefixes.length; i++) {
    assert.ok(
      titles[i] && titles[i].startsWith(expectedPrefixes[i]),
      `expected section ${i} to start with "${expectedPrefixes[i]}", got [${titles.join(', ')}]`
    );
  }
});

test('AC1: defines a player-elimination condition tied to Core Integrity reaching 0', () => {
  const body = endgameProse();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(/eliminat/i.test(body), 'expected elimination language');
  assert.ok(/core integrity/i.test(body) && /reduced to 0|reaches? 0/i.test(body), 'expected an elimination condition tied to Core Integrity reaching 0');
});

test('AC1: cross-references Section 8\'s Capture rule by section number rather than restating it', () => {
  const body = endgameProse();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(/section 8\.\d/i.test(body), 'expected an explicit cross-reference to a Section 8.x subsection');
  assert.ok(/captur/i.test(body), 'expected the section to discuss Capture in relation to elimination');
});

// ---------------------------------------------------------------------------
// AC2: states what ends the game (single remaining un-eliminated player, or
// an explicit draw condition) and how remaining players' turns proceed once
// another player is eliminated.
// ---------------------------------------------------------------------------

test('AC2: states the game ends when a single challenger remains un-eliminated', () => {
  const body = endgameProse();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(
    /only one challenger remains|one challenger remains un-eliminated/i.test(body),
    'expected an explicit single-remaining-player win condition'
  );
});

test('AC2: states an explicit draw condition', () => {
  const body = endgameProse();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(/\bdraw\b/i.test(body), 'expected a draw result to be named');
  assert.ok(/same instant|simultaneous/i.test(body), 'expected the draw to be tied to simultaneous elimination');
});

test('AC2: states how turns proceed once a challenger is eliminated', () => {
  const body = endgameProse();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(
    /no further turn|does not continue/i.test(body),
    'expected the section to state what happens to turns once a challenger is eliminated'
  );
});

// ---------------------------------------------------------------------------
// AC3: includes at least one numbered worked example resolving a concrete
// game-end edge case (e.g. two players eliminated in the same turn).
// ---------------------------------------------------------------------------

test('AC3: includes a worked-example sub-heading under Winning & Losing Conditions', () => {
  const content = readRules();
  const sections = parseSections(content);
  const idx = findSection(sections, /winning.{0,5}losing/i);
  assert.notStrictEqual(idx, -1, 'expected a Winning & Losing Conditions section');
  const level = sections[idx].level;
  const exampleHeadings = [];
  for (let i = idx + 1; i < sections.length; i++) {
    if (sections[i].level <= level) break;
    if (/worked example/i.test(sections[i].title)) exampleHeadings.push(sections[i]);
  }
  assert.ok(exampleHeadings.length >= 1, 'expected at least one "Worked Example" sub-heading');
});

test('AC3: the worked example resolves a concrete simultaneous/same-turn elimination edge case with a numbered list', () => {
  const content = readRules();
  const sections = parseSections(content);
  const idx = findSection(sections, /winning.{0,5}losing/i);
  assert.notStrictEqual(idx, -1, 'expected a Winning & Losing Conditions section');
  const level = sections[idx].level;
  let example = null;
  for (let i = idx + 1; i < sections.length; i++) {
    if (sections[i].level <= level) break;
    if (/worked example/i.test(sections[i].title)) { example = sections[i]; break; }
  }
  assert.ok(example, 'expected a "Worked Example" sub-heading to check');
  const body = example.lines.join('\n');
  const numberedSteps = body.match(/^\d+\.\s+\S/gm) || [];
  assert.ok(numberedSteps.length >= 3, `expected at least 3 numbered steps in the worked example, found ${numberedSteps.length}`);
  assert.ok(body.length > 300, `expected a substantive worked example (>300 chars), got ${body.length} chars`);
  assert.ok(/eliminat/i.test(body), 'expected the worked example to involve elimination');
  assert.ok(/draw|simultaneous/i.test(body), 'expected the worked example to involve the draw/simultaneous edge case');
});

// ---------------------------------------------------------------------------
// AC4: new terms introduced by this section are added to the Section 2
// glossary before substantive use.
// ---------------------------------------------------------------------------

const NEW_GLOSSARY_TERMS = [
  { label: 'eliminated', pattern: 'eliminated' },
  { label: 'game end', pattern: 'game\\s+end' },
  { label: 'draw', pattern: 'draw' },
];

for (const { label, pattern } of NEW_GLOSSARY_TERMS) {
  test(`AC4: the Glossary/Vocabulary section defines "${label}"`, () => {
    const content = readRules();
    const sections = parseSections(content);
    const glossary = sectionText(sections, /glossary|vocabulary/i);
    assert.ok(glossary, 'expected a Glossary/Vocabulary section');
    const re = new RegExp(`\\*\\*[^*\\n]*\\b${pattern}\\b[^*\\n]*\\*\\*`, 'i');
    assert.ok(re.test(glossary), `expected a bolded glossary entry defining "${label}"`);
  });
}

test('AC4: the Glossary/Vocabulary section precedes the Winning & Losing Conditions section', () => {
  const sections = topLevelSections(readRules());
  const glossaryIdx = sections.findIndex((s) => /glossary|vocabulary/i.test(s.title));
  const endgameIdx = sections.findIndex((s) => /winning.{0,5}losing/i.test(s.title));
  assert.notStrictEqual(glossaryIdx, -1, 'expected a Glossary/Vocabulary section');
  assert.notStrictEqual(endgameIdx, -1, 'expected a Winning & Losing Conditions section');
  assert.ok(glossaryIdx < endgameIdx, 'expected Glossary to precede Winning & Losing Conditions');
});

// ---------------------------------------------------------------------------
// AC5 (held-out, checked here for construction-time consistency): the new
// section must not contradict Section 8's rule that Homeworlds cannot be
// Captured.
// ---------------------------------------------------------------------------

test('AC5: does not claim a Homeworld can be Captured (must stay consistent with Section 8.2/8.6)', () => {
  const body = endgameProse();
  assert.ok(body, 'expected a Winning & Losing Conditions section');
  assert.ok(
    /may not be captured/i.test(body),
    'expected the section to affirm, consistent with Section 8, that a Homeworld cannot be Captured'
  );
});
