'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection, normalizeProse } = require('./helpers/markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const PLAYTEST_PATH = path.join(__dirname, '..', 'design', 'playtest-spatial.md');

function readRules() {
  return fs.readFileSync(RULES_PATH, 'utf8');
}

function rulesSections() {
  return parseSections(readRules());
}

function mapSetupBody() {
  return sectionText(rulesSections(), /^8\.8\s+map setup/i);
}

function readPlaytest() {
  assert.ok(fs.existsSync(PLAYTEST_PATH), `expected ${PLAYTEST_PATH} to exist`);
  return fs.readFileSync(PLAYTEST_PATH, 'utf8');
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md contains a numbered "### 8.8 Map Setup" heading that
// explicitly states fixed/drafted/symmetric, starting Planet count, and
// placement relative to each Homeworld.
// ---------------------------------------------------------------------------

test('AC1: rules.md has a numbered "### 8.8 Map Setup" subsection under Section 8', () => {
  const idx = findSection(rulesSections(), /^8\.8\s+map setup/i);
  assert.notStrictEqual(idx, -1, 'expected a "### 8.8 Map Setup" heading in rules.md');
});

test('AC1: 8.8 states whether the starting map is fixed, drafted, or symmetric', () => {
  const body = mapSetupBody();
  assert.ok(body, 'expected an 8.8 Map Setup section body');
  assert.ok(/\bfixed\b/i.test(body), 'expected 8.8 to state the starting map is fixed');
  assert.ok(/\bsymmetric\b/i.test(body), 'expected 8.8 to state the starting map is symmetric');
  assert.ok(/not\s+drafted|never\s+drafts?/i.test(body), 'expected 8.8 to explicitly rule out drafting');
});

test('AC1: 8.8 specifies the starting Planet count', () => {
  // Normalized: "planet count is exactly two" / "exactly two planets" are
  // literal-space phrases that could otherwise be split by the rulebook's
  // ~75-char line wrap.
  const body = normalizeProse(mapSetupBody() || '');
  assert.ok(body, 'expected an 8.8 Map Setup section body');
  assert.ok(
    /\btwo\b[^.]*planet|planet count is exactly two|exactly two planets/i.test(body),
    'expected 8.8 to state the starting Planet count is exactly two'
  );
});

test('AC1: 8.8 specifies each Planet\'s placement relative to each Homeworld', () => {
  const body = mapSetupBody();
  assert.ok(body, 'expected an 8.8 Map Setup section body');
  assert.ok(/homeworld/i.test(body), 'expected 8.8 to discuss Homeworld placement');
  assert.ok(
    /placement/i.test(body),
    'expected 8.8 to explicitly describe Planet placement relative to each Homeworld'
  );
});

test('AC1: 8.8 sits between 8.7 and Section 9 without disturbing existing section order', () => {
  const sections = rulesSections();
  const idx87 = findSection(sections, /^8\.7\s+/i);
  const idx88 = findSection(sections, /^8\.8\s+map setup/i);
  const idx9 = findSection(sections, /^9\.\s+/i);
  assert.notStrictEqual(idx87, -1, 'expected an existing 8.7 subsection');
  assert.notStrictEqual(idx88, -1, 'expected the new 8.8 subsection');
  assert.notStrictEqual(idx9, -1, 'expected an existing Section 9 heading');
  assert.ok(idx87 < idx88, '8.7 should precede 8.8');
  assert.ok(idx88 < idx9, '8.8 should precede Section 9');
});

// ---------------------------------------------------------------------------
// AC2: design/playtest-spatial.md exists with a numbered step-by-step
// procedure two humans can follow with physical materials.
// ---------------------------------------------------------------------------

test('AC2: design/playtest-spatial.md exists', () => {
  assert.ok(fs.existsSync(PLAYTEST_PATH), `expected ${PLAYTEST_PATH} to exist`);
});

test('AC2: playtest-spatial.md describes physical materials for two humans to use', () => {
  const content = readPlaytest();
  assert.ok(
    /token|index card|counter|paper|sticky note|dice|die\b/i.test(content),
    'expected the document to reference physical materials such as tokens, index cards, or counters'
  );
  assert.ok(
    /\btwo\b.*(human|player|challenger|playtester)|(human|player|challenger|playtester)s?.*\btwo\b/i.test(content),
    'expected the document to describe a procedure for two humans/playtesters'
  );
});

test('AC2: playtest-spatial.md contains a numbered step-by-step procedure', () => {
  const content = readPlaytest();
  const stepMatches = content.match(/^\d+\.\s+\S/gm) || [];
  assert.ok(
    stepMatches.length >= 5,
    `expected a numbered step-by-step procedure with several steps, found ${stepMatches.length}`
  );
  const numbers = stepMatches.map((s) => parseInt(s, 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strictly sequential numbered steps starting at 1, got [${numbers.join(', ')}]`);
  }
});

test('AC2: playtest-spatial.md procedure covers full game setup and play (not just map layout)', () => {
  const content = readPlaytest();
  assert.ok(/generator/i.test(content), 'expected the procedure to cover building Generators');
  assert.ok(/discover/i.test(content), 'expected the procedure to cover Discovery actions');
  assert.ok(/assault|blockad|captur/i.test(content), 'expected the procedure to cover Assault/Blockade/Capture');
});

// ---------------------------------------------------------------------------
// AC3: playtest-spatial.md cites specific rules.md Section 8 subsection
// numbers (8.1-8.7, plus the new 8.8) where each spatial mechanic first
// comes into play.
// ---------------------------------------------------------------------------

for (let n = 1; n <= 8; n++) {
  test(`AC3: playtest-spatial.md cites rules.md Section 8.${n}`, () => {
    const content = readPlaytest();
    assert.ok(
      new RegExp(`section\\s+8\\.${n}\\b`, 'i').test(content),
      `expected a citation of "Section 8.${n}" in playtest-spatial.md`
    );
  });
}

test('AC3: cited subsection numbers correspond to real rules.md 8.x headings', () => {
  const sections = rulesSections();
  for (let n = 1; n <= 8; n++) {
    const idx = findSection(sections, new RegExp(`^8\\.${n}\\s+\\S`));
    assert.notStrictEqual(idx, -1, `expected rules.md to have an "8.${n}" subsection heading for playtest-spatial.md to cite`);
  }
});
