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

const TYPES = [
  { name: 'Magic', fount: 'Tangle', behavior: 'resolving' },
  { name: 'Technology', fount: 'Circuit', behavior: 'permanent' },
  { name: 'Intelligence', fount: 'Signal', behavior: 'resolving' },
  { name: 'Biology', fount: 'Bloom', behavior: 'permanent' },
  { name: 'Materials', fount: 'Mass', behavior: 'permanent' },
];

function typeHeadingRegex(t) {
  return new RegExp(`${t.name}\\s*[—-]\\s*the\\s+${t.fount}`, 'i');
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md gains a new numbered section defining all five card
// types from gamePlan.md, each naming which Fount it draws cost from and its
// behavior class (instant/sorcery-speed resolving vs. permanent).
// ---------------------------------------------------------------------------

test('AC1: rules.md has a numbered top-level Card Types & Templating section', () => {
  const sections = topLevelSections(readRules());
  const found = sections.some((s) => /card types.{0,10}templating/i.test(s.title));
  assert.ok(
    found,
    `expected a numbered top-level heading mentioning "Card Types & Templating" among [${sections.map((s) => s.title).join(', ')}]`
  );
});

test('AC1: the top-level numbered sections remain in strict sequence starting at 1', () => {
  const sections = topLevelSections(readRules());
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strict numbering, got [${numbers.join(', ')}]`);
  }
});

for (const t of TYPES) {
  test(`AC1: ${t.name} names the ${t.fount} Fount and is classed as ${t.behavior}`, () => {
    const sections = parseSections(readRules());
    const body = sectionText(sections, typeHeadingRegex(t));
    assert.ok(body, `expected a subsection heading naming ${t.name} and the ${t.fount}`);
    assert.ok(
      new RegExp(`${t.name}\\s+cards\\s+draw\\s+their\\s+cost\\s+from\\s+the\\s+${t.fount}`, 'i').test(body),
      `expected ${t.name}'s subsection to state it draws cost from the ${t.fount}`
    );
    if (t.behavior === 'permanent') {
      assert.ok(/\bare\s+permanent\b/i.test(body), `expected ${t.name} to be classed as permanent`);
    } else {
      assert.ok(
        /\bare\s+instant\/sorcery-speed\s+resolving\b/i.test(body),
        `expected ${t.name} to be classed as instant/sorcery-speed resolving`
      );
    }
  });
}

// ---------------------------------------------------------------------------
// AC2: a canonical card template (name, cost line, type line, rules text,
// optional stats/counters line for permanents) and one fully worked example
// per type, each naming its Fount cost, its type(s), and its rules text.
// ---------------------------------------------------------------------------

test('AC2: has a Canonical Card Template subsection', () => {
  const sections = parseSections(readRules());
  const idx = findSection(sections, /canonical card template/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Canonical Card Template"');
});

const TEMPLATE_FIELDS = ['Name', 'Cost line', 'Type line', 'Rules text', 'Stats/counters line'];

for (const field of TEMPLATE_FIELDS) {
  test(`AC2: the Canonical Card Template defines the "${field}" field`, () => {
    const sections = parseSections(readRules());
    const body = sectionText(sections, /canonical card template/i);
    assert.ok(body, 'expected a Canonical Card Template section to check');
    const re = new RegExp(`\\*\\*${field.replace(/\//g, '\\/')}\\*\\*`);
    assert.ok(re.test(body), `expected a bolded "${field}" field in the template`);
  });
}

for (const t of TYPES) {
  test(`AC2: ${t.name} has a worked example card naming its ${t.fount} cost, its type, and rules text`, () => {
    const sections = parseSections(readRules());
    const typeBody = sectionText(sections, typeHeadingRegex(t));
    assert.ok(typeBody, `expected a subsection for ${t.name}`);
    assert.ok(
      new RegExp(`Cost line:\\s*\\d+\\s+${t.fount}`).test(typeBody),
      `expected a worked example card naming its ${t.fount} cost`
    );
    assert.ok(
      new RegExp(`Type line:\\s*${t.name}`).test(typeBody),
      `expected a worked example card naming its type as ${t.name}`
    );
    assert.ok(/Rules text:/.test(typeBody), 'expected a worked example card with rules text');
  });
}

// ---------------------------------------------------------------------------
// AC3: the rule for cards with multiple types/costs — how total cost is
// computed across multiple Founts and which type-specific rules apply — with
// at least one worked multi-type example.
// ---------------------------------------------------------------------------

test('AC3: has a Multiple Types and Multiple Costs subsection', () => {
  const sections = parseSections(readRules());
  const idx = findSection(sections, /multiple types.{0,10}multiple costs/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Multiple Types and Multiple Costs"');
});

test("AC3: states total cost across multiple Founts is a sum, paid from each Fount's own pool", () => {
  const sections = parseSections(readRules());
  const body = sectionText(sections, /multiple types.{0,10}multiple costs/i);
  assert.ok(body, 'expected a Multiple Types and Multiple Costs section to check');
  assert.ok(/\bsum\b/i.test(body), 'expected the total cost to be described as a sum');
  assert.ok(/\bMAY NOT\b/.test(body), 'expected an explicit MAY NOT on substituting one Fount for another');
});

test('AC3: states which type-specific rules apply when a card lists multiple types', () => {
  const sections = parseSections(readRules());
  const body = sectionText(sections, /multiple types.{0,10}multiple costs/i);
  assert.ok(body, 'expected a Multiple Types and Multiple Costs section to check');
  assert.ok(
    /every rule stated for each of its listed types/i.test(body),
    'expected a stated rule for which type-specific rules apply on a multi-type card'
  );
});

test('AC3: gives a worked multi-type example card with more than one Fount and more than one type', () => {
  const sections = parseSections(readRules());
  const body = sectionText(sections, /multiple types.{0,10}multiple costs/i);
  assert.ok(body, 'expected a Multiple Types and Multiple Costs section to check');
  const costMatch = body.match(/Cost line:\s*([^\n]+)/);
  assert.ok(costMatch, 'expected a worked example cost line');
  const founts = ['Mass', 'Bloom', 'Signal', 'Circuit', 'Tangle'].filter((f) =>
    new RegExp(`\\b${f}\\b`).test(costMatch[1])
  );
  assert.ok(founts.length >= 2, `expected the example's cost line to name at least 2 Founts, got: ${costMatch[1]}`);
  const typeMatch = body.match(/Type line:\s*([^\n]+)/);
  assert.ok(typeMatch, 'expected a worked example type line');
  const types = TYPES.filter((t) => new RegExp(`\\b${t.name}\\b`).test(typeMatch[1]));
  assert.ok(types.length >= 2, `expected the example's type line to name at least 2 Card Types, got: ${typeMatch[1]}`);
});

// ---------------------------------------------------------------------------
// AC4: new terms ("type line," "rules text," etc.) are added to the Section 2
// glossary before substantive use.
// ---------------------------------------------------------------------------

const NEW_GLOSSARY_TERMS = ['Card Type', 'Cost line', 'Type line', 'Rules text', 'Stats/counters line'];

for (const term of NEW_GLOSSARY_TERMS) {
  test(`AC4: the Glossary/Vocabulary section defines "${term}"`, () => {
    const sections = parseSections(readRules());
    const glossary = sectionText(sections, /glossary|vocabulary/i);
    assert.ok(glossary, 'expected a Glossary/Vocabulary section');
    const re = new RegExp(`\\*\\*${term.replace(/\//g, '\\/')}\\*\\*`);
    assert.ok(re.test(glossary), `expected a bolded glossary entry defining "${term}"`);
  });
}

test('AC4: the Glossary/Vocabulary section precedes the Card Types & Templating section', () => {
  const sections = topLevelSections(readRules());
  const glossaryIdx = sections.findIndex((s) => /glossary|vocabulary/i.test(s.title));
  const cardTypesIdx = sections.findIndex((s) => /card types.{0,10}templating/i.test(s.title));
  assert.notStrictEqual(glossaryIdx, -1, 'expected a Glossary/Vocabulary section');
  assert.notStrictEqual(cardTypesIdx, -1, 'expected a Card Types & Templating section');
  assert.ok(glossaryIdx < cardTypesIdx, 'expected Glossary to precede Card Types & Templating');
});
