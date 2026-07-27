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

function battlefieldBody() {
  const content = readRules();
  const sections = parseSections(content);
  return sectionText(sections, /spatial battlefield/i);
}

// ---------------------------------------------------------------------------
// AC1: numbered spatial-battlefield rules covering planets as nodes,
// wormholes as edges with length, homeworld start, discovery cheaper for
// unexplored than enemy worlds, wormhole restrictions (direction/team/unit
// type), and wormhole closure.
// ---------------------------------------------------------------------------

test('AC1: rules.md has a numbered top-level Spatial Battlefield section', () => {
  const sections = topLevelSections(readRules());
  const found = sections.some((s) => /spatial battlefield/i.test(s.title));
  assert.ok(
    found,
    `expected a numbered top-level heading mentioning "Spatial Battlefield" among [${sections.map((s) => s.title).join(', ')}]`
  );
});

test('AC1: the top-level numbered sections remain in strict sequence starting at 1', () => {
  const sections = topLevelSections(readRules());
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strict numbering, got [${numbers.join(', ')}]`);
  }
});

test('AC1: covers planets as graph nodes and wormholes as edges with a length attribute', () => {
  const body = battlefieldBody();
  assert.ok(body, 'expected a Spatial Battlefield section');
  assert.ok(/\bnode\b/i.test(body) && /\bplanet\b/i.test(body), 'expected planets described as graph nodes');
  assert.ok(/\bedge\b/i.test(body) && /\bwormhole\b/i.test(body), 'expected wormholes described as graph edges');
  assert.ok(/\blength\b/i.test(body), 'expected wormholes to carry a Length attribute');
});

test('AC1: covers homeworld start', () => {
  const body = battlefieldBody();
  assert.ok(/homeworld/i.test(body), 'expected homeworld rules');
  assert.ok(
    /begins? the game controlling|start(s|ing)? the game/i.test(body),
    'expected an explicit statement that challengers start the game on their Homeworld'
  );
});

test('AC1: discovering an unexplored world costs less than discovering toward an enemy/contested world', () => {
  const body = battlefieldBody();
  assert.ok(
    /frontier discovery/i.test(body) && /contested discovery/i.test(body),
    'expected both a Frontier and a Contested Discovery variant'
  );
  assert.ok(
    /twice|double|2x|x2/i.test(body),
    'expected the Contested Discovery cost to be stated as a multiple of the Frontier cost'
  );
});

test('AC1: wormholes can be restricted by direction, team, and unit type', () => {
  const body = battlefieldBody();
  assert.ok(/directional restriction|one-way/i.test(body), 'expected a direction-based restriction');
  assert.ok(/team restriction|allied/i.test(body), 'expected a team-based restriction');
  assert.ok(/unit-type restriction/i.test(body), 'expected a unit-type restriction');
});

test('AC1: wormholes can be closed, and closure removes the edge from the graph', () => {
  const body = battlefieldBody();
  assert.ok(/\bclosed\b/i.test(body) && /\bclosure\b/i.test(body), 'expected Closure rules');
  assert.ok(
    /removed from the battlefield graph|no longer adjacent/i.test(body),
    'expected Closure to remove the wormhole as a graph edge'
  );
});

// ---------------------------------------------------------------------------
// AC2: Generator rules updated - built on a specific planet, plus what
// happens to a Generator when its planet is contested or lost.
// ---------------------------------------------------------------------------

test('AC2: the Resources section states Generators are built on a specific planet', () => {
  const content = readRules();
  const sections = parseSections(content);
  const body = sectionText(sections, /resources/i);
  assert.ok(body, 'expected a Resources section');
  assert.ok(
    /built on/i.test(body) && /planet/i.test(body),
    'expected Resources to state Generators are built on a specific planet'
  );
});

test('AC2: rules state what happens to a Generator when its planet is contested (Blockaded)', () => {
  const body = battlefieldBody();
  assert.ok(/blockad/i.test(body), 'expected Blockade rules');
  assert.ok(/stops? producing|does not produce/i.test(body), 'expected Blockade to halt Generator production');
});

test('AC2: rules state what happens to a Generator when its planet is lost (Captured)', () => {
  const body = battlefieldBody();
  assert.ok(/captur/i.test(body), 'expected Capture rules');
  assert.ok(/destroyed/i.test(body) && /wreck/i.test(body), 'expected Capture to destroy the Generator, moved to the Wreck');
});

// ---------------------------------------------------------------------------
// AC3: new terms defined in the glossary before substantive use.
// ---------------------------------------------------------------------------

const NEW_GLOSSARY_TERMS = ['planet', 'wormhole', 'homeworld', 'discovery', 'length', 'closure'];

for (const term of NEW_GLOSSARY_TERMS) {
  test(`AC3: the Glossary/Vocabulary section defines "${term}"`, () => {
    const content = readRules();
    const sections = parseSections(content);
    const glossary = sectionText(sections, /glossary|vocabulary/i);
    assert.ok(glossary, 'expected a Glossary/Vocabulary section');
    const re = new RegExp(`\\*\\*[^*\\n]*\\b${term}s?\\b[^*\\n]*\\*\\*`, 'i');
    assert.ok(re.test(glossary), `expected a bolded glossary entry defining "${term}"`);
  });
}

test('AC3: the Glossary/Vocabulary section precedes the Spatial Battlefield section', () => {
  const sections = topLevelSections(readRules());
  const glossaryIdx = sections.findIndex((s) => /glossary|vocabulary/i.test(s.title));
  const battlefieldIdx = sections.findIndex((s) => /spatial battlefield/i.test(s.title));
  assert.notStrictEqual(glossaryIdx, -1, 'expected a Glossary/Vocabulary section');
  assert.notStrictEqual(battlefieldIdx, -1, 'expected a Spatial Battlefield section');
  assert.ok(glossaryIdx < battlefieldIdx, 'expected Glossary to precede Spatial Battlefield');
});

// ---------------------------------------------------------------------------
// AC4: discovery integrated into the existing turn-phase sequence, not
// bolted on as an appendix (still exactly 5 phases).
// ---------------------------------------------------------------------------

test('AC4: the Main Phase references Discovery as an in-phase action', () => {
  const content = readRules();
  const sections = parseSections(content);
  const mainPhase = sectionText(sections, /main phase/i);
  assert.ok(mainPhase, 'expected a Main Phase section');
  assert.ok(/discovery action/i.test(mainPhase), 'expected the Main Phase to reference the Discovery action');
});

test('AC4: Turn Structure still lists exactly 5 phases (Discovery is not a bolted-on 6th phase)', () => {
  const content = readRules();
  const sections = parseSections(content);
  const turnIdx = findSection(sections, /turn structure/i);
  assert.notStrictEqual(turnIdx, -1, 'expected a Turn Structure section');
  const turnLevel = sections[turnIdx].level;
  const phaseHeadings = [];
  for (let i = turnIdx + 1; i < sections.length; i++) {
    if (sections[i].level <= turnLevel) break;
    if (/^\d+\.\d+/.test(sections[i].title)) phaseHeadings.push(sections[i]);
  }
  assert.strictEqual(
    phaseHeadings.length,
    5,
    `expected exactly 5 phase sub-headings, found ${phaseHeadings.length}: ${phaseHeadings.map((s) => s.title).join(', ')}`
  );
});

test('AC4: no existing numbered section is removed or renumbered (Sections 1-7 remain, in order, before Section 8)', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  const expectedPrefixes = ['1.', '2.', '3.', '4.', '5.', '6.', '7.'];
  for (let i = 0; i < expectedPrefixes.length; i++) {
    assert.ok(
      titles[i] && titles[i].startsWith(expectedPrefixes[i]),
      `expected section ${i} to start with "${expectedPrefixes[i]}", got [${titles.join(', ')}]`
    );
  }
});
