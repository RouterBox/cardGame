'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection } = require('./helpers/markdown');

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
    const body = phase.lines.join('\n');
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
    const body = subheading.lines.join(' ').replace(/\s+/g, ' ').trim();
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
        bodies.push(sections[i].lines.join(' ').replace(/\s+/g, ' ').trim().toLowerCase());
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
  const body = sectionText(sections, /priority.{0,5}timing/i);
  assert.ok(body, 'expected a Priority & Timing section to check');
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
  const body = sectionText(sections, /priority.{0,5}timing/i);
  assert.ok(body, 'expected a Priority & Timing section to check');
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
  const body = edgeCaseHeadings[0].lines.join(' ').replace(/\s+/g, ' ').trim();
  assert.ok(body.length > 100, `expected the edge case to be resolved with substantive text (>100 chars), got ${body.length} chars`);
});
