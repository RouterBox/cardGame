'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection, normalizeProse } = require('./helpers/markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const FOUNTS = ['Mass', 'Bloom', 'Signal', 'Circuit', 'Tangle'];

function readRules() {
  return fs.readFileSync(RULES_PATH, 'utf8');
}

function topLevelSections(content) {
  const sections = parseSections(content);
  return sections
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title));
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md exists with a numbered top-level section structure
// (1., 2., 3., ...) covering at minimum Game Concepts, Turn Structure,
// Resources, Priority & Timing, and Zones.
// ---------------------------------------------------------------------------

test('AC1: design/rules.md exists', () => {
  assert.ok(fs.existsSync(RULES_PATH), `expected ${RULES_PATH} to exist`);
});

test('AC1: has a numbered top-level section structure (1., 2., 3., ...) in strict sequence', () => {
  const content = readRules();
  const sections = topLevelSections(content);
  assert.ok(
    sections.length >= 5,
    `expected at least 5 numbered top-level sections (e.g. "1. Game Concepts"), found ${sections.length}: ${sections.map((s) => s.title).join(', ')}`
  );
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(
      numbers[i],
      i + 1,
      `expected numbered top-level sections in strict sequence starting at 1, got [${numbers.join(', ')}]`
    );
  }
});

const REQUIRED_TOP_LEVEL_TOPICS = [
  { name: 'Game Concepts', re: /game concepts/i },
  { name: 'Turn Structure', re: /turn structure/i },
  { name: 'Resources', re: /resources/i },
  { name: 'Priority & Timing', re: /priority.{0,5}timing/i },
  { name: 'Zones', re: /\bzones\b/i },
];

for (const topic of REQUIRED_TOP_LEVEL_TOPICS) {
  test(`AC1: has a numbered top-level section covering "${topic.name}"`, () => {
    const content = readRules();
    const sections = topLevelSections(content);
    const found = sections.some((s) => topic.re.test(s.title));
    assert.ok(
      found,
      `expected a numbered top-level heading matching ${topic.re} among [${sections.map((s) => s.title).join(', ')}]`
    );
  });
}

// ---------------------------------------------------------------------------
// AC2: a glossary/vocabulary section defines every game term (e.g. priority,
// zone, resource pool) before or at its first substantive use elsewhere.
// ---------------------------------------------------------------------------

test('AC2: has a Glossary/Vocabulary section', () => {
  const content = readRules();
  const sections = parseSections(content);
  const idx = findSection(sections, /glossary|vocabulary/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Glossary" or "Vocabulary"');
});

test('AC2: the Glossary/Vocabulary section defines a substantial number of distinct terms', () => {
  const content = readRules();
  const sections = parseSections(content);
  const glossary = sectionText(sections, /glossary|vocabulary/i);
  assert.ok(glossary, 'expected a Glossary/Vocabulary section to check');
  const boldedTerms = glossary.match(/\*\*[^*\n]+\*\*/g) || [];
  const distinctTerms = new Set(boldedTerms.map((t) => t.toLowerCase()));
  assert.ok(
    distinctTerms.size >= 15,
    `expected at least 15 distinct bolded glossary term definitions, found ${distinctTerms.size}`
  );
});

const EXAMPLE_GLOSSARY_TERMS = ['priority', 'zone', 'resource pool'];

for (const term of EXAMPLE_GLOSSARY_TERMS) {
  test(`AC2: the Glossary/Vocabulary section explicitly defines "${term}"`, () => {
    const content = readRules();
    const sections = parseSections(content);
    const glossary = sectionText(sections, /glossary|vocabulary/i);
    assert.ok(glossary, 'expected a Glossary/Vocabulary section to check');
    const re = new RegExp(`\\*\\*[^*\\n]*\\b${term.replace(/ /g, '\\s+')}s?\\b[^*\\n]*\\*\\*`, 'i');
    assert.ok(re.test(glossary), `expected a bolded glossary entry defining "${term}" (e.g. "**${term}** — ...")`);
  });
}

test('AC2: the Glossary/Vocabulary section precedes the Zones, Resources, Turn Structure, and Priority & Timing sections', () => {
  const content = readRules();
  const sections = topLevelSections(content);
  const glossaryIdx = sections.findIndex((s) => /glossary|vocabulary/i.test(s.title));
  assert.notStrictEqual(glossaryIdx, -1, 'expected a numbered top-level Glossary/Vocabulary section');
  for (const topic of REQUIRED_TOP_LEVEL_TOPICS.filter((t) => t.name !== 'Game Concepts')) {
    const otherIdx = sections.findIndex((s) => topic.re.test(s.title));
    assert.notStrictEqual(otherIdx, -1, `expected a section matching ${topic.re}`);
    assert.ok(
      glossaryIdx < otherIdx,
      `expected the Glossary/Vocabulary section to come before the "${topic.name}" section`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3: the Turn Structure section lists the full phase sequence for one turn
// as a numbered sub-list, stating what a player may and may not do in each.
// ---------------------------------------------------------------------------

test('AC3: the Turn Structure section has a numbered sub-list of at least 4 phases', () => {
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
  assert.ok(
    phaseHeadings.length >= 4,
    `expected at least 4 numbered phase sub-headings under Turn Structure, found ${phaseHeadings.length}: ${phaseHeadings.map((s) => s.title).join(', ')}`
  );
});

test('AC3: each phase in Turn Structure states what a player may and may not do', () => {
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
  assert.ok(phaseHeadings.length > 0, 'expected at least one numbered phase sub-heading to check (see prior test)');
  for (const phase of phaseHeadings) {
    // Normalized: "may not" / "no player" are literal-space phrases that
    // could otherwise be split by the rulebook's ~75-char line wrap.
    const body = normalizeProse(phase.lines.join('\n'));
    assert.ok(/\bmay\b/i.test(body), `expected phase "${phase.title}" to state what a player MAY do`);
    assert.ok(
      /\bmay not\b|\bcannot\b|\bno player\b|\bnever\b/i.test(body),
      `expected phase "${phase.title}" to state what a player may NOT do`
    );
  }
});

// ---------------------------------------------------------------------------
// AC4: each of the five Founts (Mass, Bloom, Signal, Circuit, Tangle) has an
// explicit resource/mechanic rule in Resources naming the Fount, tied to a
// mechanic — not restated flavor text.
// ---------------------------------------------------------------------------

test('AC4: the Resources section exists', () => {
  const content = readRules();
  const sections = parseSections(content);
  const idx = findSection(sections, /resources/i);
  assert.notStrictEqual(idx, -1, 'expected a Resources section');
});

for (const fount of FOUNTS) {
  test(`AC4: Resources has a named mechanic for the ${fount} Fount`, () => {
    const content = readRules();
    const sections = parseSections(content);
    const resourcesIdx = findSection(sections, /resources/i);
    assert.notStrictEqual(resourcesIdx, -1, 'expected a Resources section');
    const resourcesLevel = sections[resourcesIdx].level;
    let subheading = null;
    for (let i = resourcesIdx + 1; i < sections.length; i++) {
      if (sections[i].level <= resourcesLevel) break;
      if (new RegExp(`\\b${fount}\\b`, 'i').test(sections[i].title)) {
        subheading = sections[i];
        break;
      }
    }
    assert.ok(subheading, `expected a Resources sub-heading naming the ${fount} Fount`);
    const body = normalizeProse(subheading.lines.join('\n'));
    assert.ok(
      body.length > 80,
      `expected a substantive mechanic description (>80 chars) for the ${fount} Fount, got ${body.length} chars`
    );
    assert.ok(
      /\bpoints?\b/i.test(body),
      `expected the ${fount} Fount's mechanic to reference its Points, not just restate flavor text`
    );
  });
}

test('AC4: the five Fount mechanics are distinct from one another', () => {
  const content = readRules();
  const sections = parseSections(content);
  const resourcesIdx = findSection(sections, /resources/i);
  assert.notStrictEqual(resourcesIdx, -1, 'expected a Resources section');
  const resourcesLevel = sections[resourcesIdx].level;
  const bodies = [];
  for (const fount of FOUNTS) {
    for (let i = resourcesIdx + 1; i < sections.length; i++) {
      if (sections[i].level <= resourcesLevel) break;
      if (new RegExp(`\\b${fount}\\b`, 'i').test(sections[i].title)) {
        bodies.push(normalizeProse(sections[i].lines.join('\n')).toLowerCase());
        break;
      }
    }
  }
  assert.strictEqual(bodies.length, FOUNTS.length, 'expected to find a mechanic body for each of the 5 Founts (see prior tests)');
  assert.strictEqual(new Set(bodies).size, bodies.length, 'expected each Fount to have a distinct mechanic description, not a copy-pasted one');
});

// ---------------------------------------------------------------------------
// AC5: Priority & Timing defines active-player priority, passing, what closes
// a priority window, and resolves at least one concrete timing edge case.
// ---------------------------------------------------------------------------

test('AC5: has a Priority & Timing section', () => {
  const content = readRules();
  const sections = parseSections(content);
  const idx = findSection(sections, /priority.{0,5}timing/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Priority" and "Timing"');
});

test('AC5: Priority & Timing defines active-player priority', () => {
  const content = readRules();
  const sections = parseSections(content);
  const rawBody = sectionText(sections, /priority.{0,5}timing/i);
  assert.ok(rawBody, 'expected a Priority & Timing section to check');
  // Normalized: "active player" is a literal-space phrase that could
  // otherwise be split by the rulebook's ~75-char line wrap.
  const body = normalizeProse(rawBody);
  assert.ok(
    /active player/i.test(body) && /priority/i.test(body),
    'expected the Priority & Timing section to define what priority means for the active player'
  );
});

test('AC5: Priority & Timing defines passing', () => {
  const content = readRules();
  const sections = parseSections(content);
  const body = sectionText(sections, /priority.{0,5}timing/i);
  assert.ok(body, 'expected a Priority & Timing section to check');
  assert.ok(/\bpass(es|ing|ed)?\b/i.test(body), 'expected the Priority & Timing section to define passing');
});

test('AC5: Priority & Timing defines what closes a priority window', () => {
  const content = readRules();
  const sections = parseSections(content);
  const rawBody = sectionText(sections, /priority.{0,5}timing/i);
  assert.ok(rawBody, 'expected a Priority & Timing section to check');
  // Normalized: "priority window" is a literal-space phrase that could
  // otherwise be split by the rulebook's ~75-char line wrap.
  const body = normalizeProse(rawBody);
  assert.ok(
    /priority window/i.test(body) && /\bclose(s|d)?\b/i.test(body),
    'expected the Priority & Timing section to define what closes a priority window'
  );
});

test('AC5: Priority & Timing resolves at least one concrete timing edge case on paper', () => {
  const content = readRules();
  const sections = parseSections(content);
  const priorityIdx = findSection(sections, /priority.{0,5}timing/i);
  assert.notStrictEqual(priorityIdx, -1, 'expected a Priority & Timing section');
  const priorityLevel = sections[priorityIdx].level;
  const edgeCaseHeadings = [];
  for (let i = priorityIdx + 1; i < sections.length; i++) {
    if (sections[i].level <= priorityLevel) break;
    if (/edge case|simultaneous|during resolution/i.test(sections[i].title)) edgeCaseHeadings.push(sections[i]);
  }
  assert.ok(
    edgeCaseHeadings.length >= 1,
    'expected at least one edge-case sub-heading under Priority & Timing (e.g. simultaneous triggers, or a response arriving during resolution)'
  );
  const body = normalizeProse(edgeCaseHeadings[0].lines.join('\n'));
  assert.ok(body.length > 100, `expected the edge case to be resolved with substantive text (>100 chars), got ${body.length} chars`);
});

// ---------------------------------------------------------------------------
// Unit cardgame-conflict-phase-movement-rules — Section 5.4 Conflict Phase
// movement rules (AC1-AC5 of that unit; AC6 is "existing assertions in this
// file and in design-combat.test.js still pass", which is covered by simply
// running the full suite, not by a dedicated test here).
// ---------------------------------------------------------------------------

function conflictPhaseSection() {
  const sections = parseSections(readRules());
  const idx = findSection(sections, /^5\.4\s+conflict phase/i);
  return idx === -1 ? null : sections[idx];
}

function conflictPhaseProse() {
  const section = conflictPhaseSection();
  return section === null ? null : normalizeProse(section.lines.join('\n'));
}

test('movement-rules AC1: Section 5.4 has no lines beginning with a "//" inline comment', () => {
  const section = conflictPhaseSection();
  assert.ok(section, 'expected a "5.4 Conflict Phase" heading');
  const commentLines = section.lines.filter((line) => /^\s*\/\//.test(line));
  assert.deepStrictEqual(
    commentLines,
    [],
    `expected no "//" comment lines in Section 5.4, found: ${JSON.stringify(commentLines)}`
  );
});

test('movement-rules AC2: Section 5.4 states the active player may take a Movement action moving a Ready Unit across a single Wormhole to an adjacent Planet', () => {
  const body = conflictPhaseProse();
  assert.ok(body, 'expected a "5.4 Conflict Phase" section body');
  assert.ok(
    /active player MAY take[^.]*Movement action/i.test(body),
    'expected the active player MAY take a Movement action'
  );
  assert.ok(/Ready Unit/i.test(body), 'expected the Movement action to move a Ready Unit');
  assert.ok(/single Wormhole/i.test(body), 'expected the Movement action to cross a single Wormhole');
  assert.ok(/adjacent Planet/i.test(body), 'expected the Movement action to move to an adjacent Planet');
});

test('movement-rules AC3: Section 5.4 states a Unit that moved this turn cannot be declared as an attacker unless a card or ability says otherwise', () => {
  const body = conflictPhaseProse();
  assert.ok(body, 'expected a "5.4 Conflict Phase" section body');
  assert.ok(
    /Unit that moved this turn[^.]*MAY NOT be declared as an attacker/i.test(body),
    'expected a Unit that moved this turn MAY NOT be declared as an attacker this turn'
  );
  assert.ok(
    /unless a card or ability specifically says otherwise/i.test(body),
    'expected the default-no-attack rule to carry a card/ability exception'
  );
});

test('movement-rules AC4: Section 5.4 states a Unit may only be declared as a blocker if it occupies the same Planet as the Planet being attacked', () => {
  const body = conflictPhaseProse();
  assert.ok(body, 'expected a "5.4 Conflict Phase" section body');
  assert.ok(
    /MAY only be declared as a blocker[^.]*occupies the same Planet[^.]*Planet being attacked/i.test(body),
    'expected a blocker declaration to require occupying the same Planet as the Planet being attacked'
  );
});

test("movement-rules AC5: Section 5.4 states the Movement action costs Fount Points equal to the traversed Wormhole's Length", () => {
  const body = conflictPhaseProse();
  assert.ok(body, 'expected a "5.4 Conflict Phase" section body');
  assert.ok(
    /Movement action costs Fount Points[^.]*equal to[^.]*Wormhole's Length/i.test(body),
    "expected the Movement action to cost Fount Points equal to the traversed Wormhole's Length"
  );
});
