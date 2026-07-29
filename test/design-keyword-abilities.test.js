'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection, normalizeProse } = require('./helpers/markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const WORLD_PATH = path.join(__dirname, '..', 'design', 'world.md');

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

function glossaryBody() {
  return sectionText(rulesSections(), /^2\.\s+glossary/i);
}

function keywordSectionBody() {
  return sectionText(rulesSections(), /^14\.\s+keyword abilities/i);
}

function keywordProse() {
  const body = keywordSectionBody();
  return body === null ? null : normalizeProse(body);
}

// Finds the level-3 subsection under Section 14 whose title mentions `name`.
function findKeywordSubsection(name) {
  const sections = rulesSections();
  const idx = findSection(sections, /^14\.\s+keyword abilities/i);
  if (idx === -1) return null;
  const level = sections[idx].level;
  for (let i = idx + 1; i < sections.length; i++) {
    if (sections[i].level <= level) break;
    if (new RegExp(`\\b${name}\\b`, 'i').test(sections[i].title)) return sections[i];
  }
  return null;
}

function findWorkedExampleSubsection() {
  const sections = rulesSections();
  const idx = findSection(sections, /^14\.\s+keyword abilities/i);
  if (idx === -1) return null;
  const level = sections[idx].level;
  for (let i = idx + 1; i < sections.length; i++) {
    if (sections[i].level <= level) break;
    if (/worked example/i.test(sections[i].title)) return sections[i];
  }
  return null;
}

// The 5 keyword abilities this unit adds, one bound to each Fount, per the
// unit's plan (traceable to design/world.md's per-Fount identity text and
// the corresponding design/races/*.md file).
const KEYWORDS = [
  {
    name: 'Bulwark',
    fount: 'Mass',
    identityRe: /\bendures?\b|shrug(s)? off/i,
    mechanicRe: /single source[^.]*prevent \S+ of that damage/i,
    onceRe: /once (per turn|each turn)/i,
  },
  {
    name: 'Regenerate',
    fount: 'Bloom',
    identityRe: /mutat/i,
    mechanicRe: /(remove all damage marked|instead of being destroyed)/i,
    onceRe: /once (per turn|each turn)/i,
  },
  {
    name: 'Foresee',
    fount: 'Signal',
    identityRe: /before (it|they) happens?|knowing what comes next/i,
    mechanicRe: /enters the field[^.]*top[^.]*archive/i,
    onceRe: /(any order|reorder|puts? (it|them) back)/i,
  },
  {
    name: 'Swarm',
    fount: 'Circuit',
    identityRe: /cop(y|ies|ied)|replicat/i,
    mechanicRe: /combat strength[^.]*(sharing|shares)[^.]*name/i,
    onceRe: /\+\d+/,
  },
  {
    name: 'Paradox',
    fount: 'Tangle',
    identityRe: /negotiat/i,
    mechanicRe: /(does not become spent|without becoming spent)/i,
    onceRe: /declared as an attacker/i,
  },
];

const ALL_FOUNTS = ['Mass', 'Bloom', 'Signal', 'Circuit', 'Tangle'];

// ---------------------------------------------------------------------------
// AC1: design/rules.md gains a new numbered section defining at least 5
// distinct named keyword abilities, each tied to exactly one of the five
// Founts and consistent with that Fount's identity in design/world.md and
// its corresponding race file.
// ---------------------------------------------------------------------------

test('AC1: rules.md has a numbered top-level "14. Keyword Abilities" section immediately after "13. Targeting"', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  const idx13 = titles.findIndex((t) => /^13\.\s+targeting/i.test(t));
  assert.notStrictEqual(idx13, -1, `expected "13. Targeting" to still exist, got [${titles.join(', ')}]`);
  const idx14 = titles.findIndex((t) => /^14\.\s+keyword abilities/i.test(t));
  assert.notStrictEqual(
    idx14,
    -1,
    `expected a "14. Keyword Abilities" top-level section, got [${titles.join(', ')}]`
  );
  assert.strictEqual(idx14, idx13 + 1, 'expected "14. Keyword Abilities" to immediately follow "13. Targeting"');
});

test('AC1: top-level section numbers remain in strict sequence through Section 14', () => {
  const sections = topLevelSections(readRules());
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  assert.ok(numbers.includes(14), `expected section number 14 among [${numbers.join(', ')}]`);
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strict sequence starting at 1, got [${numbers.join(', ')}]`);
  }
});

test('AC1: "14. Keyword Abilities" is a level-2 heading with a non-empty body', () => {
  const sections = rulesSections();
  const idx = findSection(sections, /^14\.\s+keyword abilities/i);
  assert.notStrictEqual(idx, -1, 'expected a "14. Keyword Abilities" heading');
  assert.strictEqual(sections[idx].level, 2, 'expected "14. Keyword Abilities" to be a top-level (##) heading');
  const body = keywordSectionBody();
  assert.ok(body && body.trim().length > 0, 'expected the Keyword Abilities section to have body content');
});

for (const kw of KEYWORDS) {
  test(`AC1: Section 14 defines a keyword ability named "${kw.name}", tied to the ${kw.fount} Fount`, () => {
    const sub = findKeywordSubsection(kw.name);
    assert.ok(sub, `expected a Section 14 subsection naming the keyword "${kw.name}"`);
    assert.strictEqual(sub.level, 3, `expected "${kw.name}"'s subsection to be a numbered (###) sub-heading`);
    assert.ok(/^14\.\d+/.test(sub.title), `expected "${kw.name}"'s subsection title to be numbered under 14 (e.g. "14.1"), got "${sub.title}"`);

    const body = normalizeProse(sub.lines.join('\n'));
    assert.ok(
      new RegExp(`\\b${kw.fount}\\b`, 'i').test(body) || new RegExp(`\\b${kw.fount}\\b`, 'i').test(sub.title),
      `expected "${kw.name}"'s subsection to name the ${kw.fount} Fount`
    );

    const otherFounts = ALL_FOUNTS.filter((f) => f !== kw.fount);
    for (const other of otherFounts) {
      assert.ok(
        !new RegExp(`\\bthe ${other}\\b`, 'i').test(body),
        `expected "${kw.name}" to be tied to exactly one Fount (${kw.fount}), but its subsection also names "the ${other}"`
      );
    }
  });

  test(`AC1: "${kw.name}" is consistent with the ${kw.fount} Fount's identity in design/world.md`, () => {
    const worldContent = fs.readFileSync(WORLD_PATH, 'utf8');
    assert.ok(
      kw.identityRe.test(worldContent),
      `sanity check failed: expected design/world.md's ${kw.fount} passage to match ${kw.identityRe}`
    );
    const sub = findKeywordSubsection(kw.name);
    assert.ok(sub, `expected a Section 14 subsection naming the keyword "${kw.name}"`);
    const body = normalizeProse(sub.lines.join('\n'));
    assert.ok(
      kw.identityRe.test(body),
      `expected "${kw.name}"'s subsection to echo the ${kw.fount} Fount's identity (matching ${kw.identityRe})`
    );
  });
}

test('AC1: the 5 new keyword abilities are bound to 5 distinct Founts, covering all five', () => {
  const founts = new Set();
  for (const kw of KEYWORDS) {
    const sub = findKeywordSubsection(kw.name);
    assert.ok(sub, `expected a Section 14 subsection naming the keyword "${kw.name}"`);
    founts.add(kw.fount);
  }
  assert.strictEqual(founts.size, 5, `expected all 5 Founts covered exactly once, got [${[...founts].join(', ')}]`);
  for (const fount of ALL_FOUNTS) {
    assert.ok(founts.has(fount), `expected a keyword ability bound to the ${fount} Fount`);
  }
});

// ---------------------------------------------------------------------------
// AC2: each keyword ability has its own numbered subsection stating its full
// rules-text meaning precisely enough that a future card could invoke it by
// name alone, with no further explanation needed.
// ---------------------------------------------------------------------------

for (const kw of KEYWORDS) {
  test(`AC2: "${kw.name}"'s subsection states a precise rules meaning (not just flavor text)`, () => {
    const sub = findKeywordSubsection(kw.name);
    assert.ok(sub, `expected a Section 14 subsection naming the keyword "${kw.name}"`);
    const body = normalizeProse(sub.lines.join('\n'));
    assert.ok(
      kw.mechanicRe.test(body),
      `expected "${kw.name}"'s subsection to state its precise mechanical effect (matching ${kw.mechanicRe})`
    );
    assert.ok(
      kw.onceRe.test(body),
      `expected "${kw.name}"'s subsection to state the precise condition/frequency of its effect (matching ${kw.onceRe})`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3: each new keyword's name is added to the Section 2 glossary before its
// substantive use later in the document, matching the existing glossary-first
// discipline.
// ---------------------------------------------------------------------------

test('AC3: the Section 2 glossary defines the generic term "Keyword ability"', () => {
  const glossary = glossaryBody();
  assert.ok(glossary, 'expected a Section 2 Glossary & Vocabulary body');
  assert.ok(
    /\*\*Keyword ability\*\*/i.test(glossary),
    'expected a bolded glossary entry defining "Keyword ability" (e.g. "**Keyword ability** — ...")'
  );
});

for (const kw of KEYWORDS) {
  test(`AC3: the Section 2 glossary defines "${kw.name}" before Section 14`, () => {
    const glossary = glossaryBody();
    assert.ok(glossary, 'expected a Section 2 Glossary & Vocabulary body');
    const re = new RegExp(`\\*\\*${kw.name}\\*\\*`, 'i');
    assert.ok(re.test(glossary), `expected a bolded glossary entry defining "${kw.name}" (e.g. "**${kw.name}** — ...")`);
  });
}

test('AC3: Section 2 (Glossary) precedes Section 14 (Keyword Abilities)', () => {
  const sections = topLevelSections(readRules());
  const glossaryIdx = sections.findIndex((s) => /glossary|vocabulary/i.test(s.title));
  const keywordIdx = sections.findIndex((s) => /^14\.\s+keyword abilities/i.test(s.title));
  assert.notStrictEqual(glossaryIdx, -1, 'expected a numbered Glossary/Vocabulary section');
  assert.notStrictEqual(keywordIdx, -1, 'expected a numbered Keyword Abilities section');
  assert.ok(glossaryIdx < keywordIdx, 'expected the Glossary section to precede the Keyword Abilities section');
});

// ---------------------------------------------------------------------------
// AC4: the new section includes at least one numbered worked example
// applying one or more of the new keywords to a concrete hypothetical game
// state, matching the rigor of Sections 7, 8.7, 10.3, and 12.5.
// ---------------------------------------------------------------------------

test('AC4: Section 14 includes a numbered "Worked Example" subsection', () => {
  const sub = findWorkedExampleSubsection();
  assert.ok(sub, 'expected a Section 14 subsection titled "Worked Example: ..."');
  assert.strictEqual(sub.level, 3, 'expected the worked example to be a numbered (###) sub-heading');
  assert.ok(/^14\.\d+/.test(sub.title), `expected the worked example's heading to be numbered under 14, got "${sub.title}"`);
});

test('AC4: the worked example walks through a numbered sequence of concrete steps', () => {
  const sub = findWorkedExampleSubsection();
  assert.ok(sub, 'expected a Section 14 worked example subsection');
  const raw = sub.lines.join('\n');
  const stepMatches = raw.match(/^\d+\.\s+\S/gm) || [];
  assert.ok(
    stepMatches.length >= 3,
    `expected at least 3 numbered steps in the worked example, found ${stepMatches.length}`
  );
});

test('AC4: the worked example applies at least 2 of the new keywords to the game state it describes', () => {
  const sub = findWorkedExampleSubsection();
  assert.ok(sub, 'expected a Section 14 worked example subsection');
  const body = normalizeProse(sub.lines.join('\n'));
  const used = KEYWORDS.filter((kw) => new RegExp(`\\b${kw.name}\\b`, 'i').test(body));
  assert.ok(
    used.length >= 2,
    `expected the worked example to reference at least 2 of [${KEYWORDS.map((k) => k.name).join(', ')}], found [${used.map((k) => k.name).join(', ')}]`
  );
});

test('AC4: the worked example references a concrete game state (named challengers or permanents, and section cross-references)', () => {
  const sub = findWorkedExampleSubsection();
  assert.ok(sub, 'expected a Section 14 worked example subsection');
  const body = normalizeProse(sub.lines.join('\n'));
  assert.ok(
    /\bSection \d+/.test(body),
    'expected the worked example to cross-reference other rules sections by number, as Sections 7, 8.7, 10.3, and 12.5 do'
  );
});
