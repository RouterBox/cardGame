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

// All Section 4 subsection headings (4.1, 4.2, ... ) in document order.
function resourceSubheadings() {
  const sections = parseSections(readRules());
  return sections.filter((s) => /^4\.\d+\s+\S/.test(s.title));
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md contains a numbered subsection titled 'Graph-Driven
// Generation' under Section 4 (Resources), immediately after the existing
// 4.6 Positional Generators subsection.
// ---------------------------------------------------------------------------

test('AC1: rules.md has a "4.7 Graph-Driven Generation" subsection', () => {
  const subheadings = resourceSubheadings();
  const found = subheadings.some((s) => /^4\.7\s+.*Graph-Driven Generation/i.test(s.title));
  assert.ok(
    found,
    `expected a "4.7 Graph-Driven Generation" subsection among [${subheadings.map((s) => s.title).join(', ')}]`
  );
});

test('AC1: "Graph-Driven Generation" (4.7) immediately follows "Positional Generators" (4.6)', () => {
  const subheadings = resourceSubheadings();
  const idx46 = subheadings.findIndex((s) => /^4\.6\s+Positional Generators/i.test(s.title));
  assert.notStrictEqual(idx46, -1, `expected a "4.6 Positional Generators" subsection among [${subheadings.map((s) => s.title).join(', ')}]`);
  const next = subheadings[idx46 + 1];
  assert.ok(next, 'expected a subsection immediately after 4.6 Positional Generators');
  assert.ok(
    /^4\.7\s+.*Graph-Driven Generation/i.test(next.title),
    `expected the subsection immediately after 4.6 to be "4.7 Graph-Driven Generation", got "${next.title}"`
  );
});

// ---------------------------------------------------------------------------
// AC2: that subsection states the active player gains one bonus Fount Point,
// of a single Fount they choose, during the Generation Phase, for every
// Planet beyond their Homeworld that they currently control.
// ---------------------------------------------------------------------------

test('AC2: 4.7 states the bonus is one Fount Point per Planet beyond the Homeworld, of a chosen Fount, during the Generation Phase', () => {
  const sections = parseSections(readRules());
  const body = sectionText(sections, /^4\.7\s+.*Graph-Driven Generation/i);
  assert.ok(body, 'expected a "4.7 Graph-Driven Generation" section body to check');
  const prose = normalizeProse(body);

  assert.ok(/generation phase/i.test(prose), 'expected 4.7 to say this happens during the Generation Phase');
  assert.ok(
    /bonus fount point/i.test(prose),
    'expected 4.7 to describe a "bonus Fount Point"'
  );
  assert.ok(
    /fount of their choice|choice of fount|fount they choose|fount of their own choosing/i.test(prose),
    'expected 4.7 to state the player chooses a single Fount for the bonus'
  );
  assert.ok(
    /beyond their homeworld/i.test(prose),
    'expected 4.7 to scope the count to Planets beyond the Homeworld'
  );
  assert.ok(
    /currently control/i.test(prose),
    'expected 4.7 to key the bonus off Planets the player currently controls'
  );
});

// ---------------------------------------------------------------------------
// AC3: Section 5.2 (Generation Phase) contains no line beginning with a `//`
// inline comment, and its prose references the new Graph-Driven Generation
// subsection by number.
// ---------------------------------------------------------------------------

test('AC3: Section 5.2 has no raw "//" comment lines', () => {
  const sections = parseSections(readRules());
  const body = sectionText(sections, /^5\.2\s+Generation Phase/i);
  assert.ok(body, 'expected a "5.2 Generation Phase" section body to check');
  assert.ok(!/^\s*\/\//m.test(body), 'expected no raw "//" comment lines left in Section 5.2');
});

test('AC3: Section 5.2 references the Graph-Driven Generation subsection by number', () => {
  const sections = parseSections(readRules());
  const body = sectionText(sections, /^5\.2\s+Generation Phase/i);
  assert.ok(body, 'expected a "5.2 Generation Phase" section body to check');
  assert.ok(
    /section\s+4\.7/i.test(body),
    'expected Section 5.2 to reference "Section 4.7" by number'
  );
});

// ---------------------------------------------------------------------------
// AC4 (held-out): top-level section numbering stays strictly sequential
// starting at 1. (Sections 1-3/6-10 byte-identity and the full pre-existing
// suite are verified by running `node --test` across the whole repo, not
// re-derived here — see plan.md.)
// ---------------------------------------------------------------------------

test('AC4: top-level section numbering remains strictly sequential starting at 1', () => {
  const sections = parseSections(readRules())
    .filter((s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title));
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(
      numbers[i],
      i + 1,
      `expected strict top-level numbering starting at 1, got [${numbers.join(', ')}]`
    );
  }
});
