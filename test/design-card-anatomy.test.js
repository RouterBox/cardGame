'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection } = require('./helpers/markdown');

const ANATOMY_PATH = path.join(__dirname, '..', 'design', 'cards', 'card-anatomy.md');
const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'alpha-set.md');

const CARD_TYPES = ['Magic', 'Technology', 'Intelligence', 'Biology', 'Materials'];
const FOUNTS = ['Tangle', 'Circuit', 'Signal', 'Bloom', 'Mass'];

const REQUIRED_ZONES = [
  'Frame/Border',
  'Name Slot',
  'Cost Slot',
  'Type Line',
  'Art Window',
  'Rules-Text Box',
];

const FIELD_TO_ZONE = [
  ['Name', 'Name Slot'],
  ['Cost line', 'Cost Slot'],
  ['Type line', 'Type Line'],
  ['Rules text', 'Rules-Text Box'],
  ['Stats/counters line', 'Stats Corner'],
];

const REQUIRED_TREATMENTS = ['Borderless', 'Foil', 'Alt-Art'];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readAnatomy() {
  if (!fs.existsSync(ANATOMY_PATH)) return null;
  return fs.readFileSync(ANATOMY_PATH, 'utf8');
}

function readCardsFile() {
  if (!fs.existsSync(CARDS_PATH)) return null;
  return fs.readFileSync(CARDS_PATH, 'utf8');
}

// Each `###` heading in alpha-set.md is one card; its body is the raw lines
// directly under it.
function listAlphaSetCards() {
  const content = readCardsFile();
  if (content === null) return [];
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function isMultiTypeMultiCost(card) {
  const typeMatch = card.body.match(/Type line:\s*([^\n]+)/);
  const costMatch = card.body.match(/Cost line:\s*([^\n]+)/);
  if (!typeMatch || !costMatch) return false;
  const typesFound = CARD_TYPES.filter((t) => new RegExp(`\\b${t}\\b`).test(typeMatch[1]));
  const founstFound = FOUNTS.filter((f) => new RegExp(`\\b${f}\\b`).test(costMatch[1]));
  return typesFound.length >= 2 && founstFound.length >= 2;
}

const anatomyContent = readAnatomy();
const anatomySections = anatomyContent ? parseSections(anatomyContent) : [];
const alphaSetCards = listAlphaSetCards();

// ---------------------------------------------------------------------------
// AC1: design/cards/card-anatomy.md exists and defines a shared skeleton with
// named zones including at minimum a frame/border, name slot, cost slot,
// type line, art window, and rules-text box.
// ---------------------------------------------------------------------------

test('AC1: design/cards/card-anatomy.md exists', () => {
  assert.ok(fs.existsSync(ANATOMY_PATH), `expected ${ANATOMY_PATH} to exist`);
});

test('AC1: has a "The Skeleton" section', () => {
  const idx = findSection(anatomySections, /^the skeleton$/i);
  assert.notStrictEqual(idx, -1, 'expected a heading titled "The Skeleton"');
});

for (const zone of REQUIRED_ZONES) {
  test(`AC1: The Skeleton defines the "${zone}" zone`, () => {
    const body = sectionText(anatomySections, /^the skeleton$/i);
    assert.ok(body, 'expected a "The Skeleton" section to check');
    const re = new RegExp(`\\*\\*${escapeRegExp(zone)}\\*\\*`);
    assert.ok(re.test(body), `expected a bolded "${zone}" zone under The Skeleton`);
  });
}

// ---------------------------------------------------------------------------
// AC3: every required field of the rules.md Section 9 card template (Name,
// Cost line, Type line, Rules text, Stats/counters line) maps to exactly one
// skeleton zone, and the mapping is stated in the document.
// ---------------------------------------------------------------------------

for (const [field, zone] of FIELD_TO_ZONE) {
  test(`AC3: field "${field}" is mapped to skeleton zone "${zone}"`, () => {
    const body = sectionText(anatomySections, /^the skeleton$/i);
    assert.ok(body, 'expected a "The Skeleton" section to check');
    const re = new RegExp(
      `\\|\\s*\\*\\*${escapeRegExp(field)}\\*\\*\\s*\\|\\s*${escapeRegExp(zone)}\\s*\\|`
    );
    assert.ok(re.test(body), `expected a mapping row "| **${field}** | ${zone} |"`);
  });
}

test('AC3: the five mapped fields map to five distinct zones', () => {
  const zones = new Set(FIELD_TO_ZONE.map(([, zone]) => zone));
  assert.strictEqual(zones.size, FIELD_TO_ZONE.length, 'expected each field to map to its own zone');
});

// ---------------------------------------------------------------------------
// AC4: the variables section states how frame identity is driven by the
// card's Fount(s), including the rendering rule for cards with more than one
// Fount in their cost.
// ---------------------------------------------------------------------------

test('AC4: has a "The Variables" section', () => {
  const idx = findSection(anatomySections, /^the variables$/i);
  assert.notStrictEqual(idx, -1, 'expected a heading titled "The Variables"');
});

test('AC4: The Variables ties Frame/Border color identity to the Fount(s)', () => {
  const body = sectionText(anatomySections, /^the variables$/i);
  assert.ok(body, 'expected a "The Variables" section to check');
  assert.ok(/Frame\/Border/.test(body), 'expected the Frame/Border zone to be discussed');
  for (const fount of FOUNTS) {
    assert.ok(new RegExp(`\\b${fount}\\b`).test(body), `expected The Variables to name the ${fount}`);
  }
});

test('AC4: The Variables states a rendering rule for cards with more than one Fount', () => {
  const body = sectionText(anatomySections, /^the variables$/i);
  assert.ok(body, 'expected a "The Variables" section to check');
  assert.ok(
    /more than one Fount/i.test(body),
    'expected an explicit statement covering cards with more than one Fount in their cost'
  );
  assert.ok(/band/i.test(body), 'expected the multi-Fount rendering rule to describe a split/band treatment');
});

// ---------------------------------------------------------------------------
// AC2: a section on premium treatments defines at least three treatments
// (such as borderless, foil, alt-art) each described as a layer on the
// shared skeleton, and states an explicit cohesion rule about what
// treatments may not change.
// ---------------------------------------------------------------------------

test('AC2: has a "The Layers" section', () => {
  const idx = findSection(anatomySections, /^the layers$/i);
  assert.notStrictEqual(idx, -1, 'expected a heading titled "The Layers"');
});

for (const treatment of REQUIRED_TREATMENTS) {
  test(`AC2: The Layers defines the "${treatment}" premium treatment as a layer swap`, () => {
    const body = sectionText(anatomySections, /^the layers$/i);
    assert.ok(body, 'expected a "The Layers" section to check');
    const nameRe = new RegExp(`\\*\\*${escapeRegExp(treatment)}\\*\\*`);
    assert.ok(nameRe.test(body), `expected a bolded "${treatment}" treatment`);
    assert.ok(/layer swap/i.test(body), 'expected treatments to be described as a "layer swap"');
  });
}

test('AC2: The Layers states an explicit cohesion rule about what may not change', () => {
  const body = sectionText(anatomySections, /^the layers$/i);
  assert.ok(body, 'expected a "The Layers" section to check');
  assert.ok(/cohesion rule/i.test(body), 'expected an explicit "Cohesion rule" statement');
  assert.ok(
    /may never change in content/i.test(body),
    'expected the cohesion rule to state what may never change across treatments'
  );
});

// ---------------------------------------------------------------------------
// AC5 (held_out): at least two named cards from alpha-set.md appear as
// worked examples walked through the anatomy zone by zone, at least one of
// which is one of the set's multi-type/multi-cost cards.
// ---------------------------------------------------------------------------

test('AC5: has a "Worked Examples" section', () => {
  const idx = findSection(anatomySections, /^worked examples$/i);
  assert.notStrictEqual(idx, -1, 'expected a heading titled "Worked Examples"');
});

function workedExampleSubsections() {
  const worked = sectionText(anatomySections, /^worked examples$/i);
  if (worked === null) return [];
  const idx = findSection(anatomySections, /^worked examples$/i);
  const level = anatomySections[idx].level;
  const subs = [];
  for (let i = idx + 1; i < anatomySections.length; i++) {
    if (anatomySections[i].level <= level) break;
    subs.push(anatomySections[i]);
  }
  return subs;
}

test('AC5: at least two named alpha-set.md cards appear as worked examples', () => {
  const subs = workedExampleSubsections();
  const alphaNames = new Set(alphaSetCards.map((c) => c.title));
  const matched = subs.filter((s) => {
    const m = s.title.match(/^Worked Example:\s*(.+?)\s*(?:\(|$)/i);
    return m && alphaNames.has(m[1].trim());
  });
  assert.ok(
    matched.length >= 2,
    `expected at least 2 worked examples naming real alpha-set.md cards, found ${matched.length} among [${subs.map((s) => s.title).join(', ')}]`
  );
});

test('AC5: at least one worked example is a multi-type/multi-cost card', () => {
  const subs = workedExampleSubsections();
  const cardsByName = new Map(alphaSetCards.map((c) => [c.title, c]));
  const matchedNames = subs
    .map((s) => {
      const m = s.title.match(/^Worked Example:\s*(.+?)\s*(?:\(|$)/i);
      return m ? m[1].trim() : null;
    })
    .filter((name) => name && cardsByName.has(name));
  const anyMultiType = matchedNames.some((name) => isMultiTypeMultiCost(cardsByName.get(name)));
  assert.ok(
    anyMultiType,
    `expected at least one worked example among [${matchedNames.join(', ')}] to be multi-type/multi-cost per alpha-set.md`
  );
});

for (const zone of REQUIRED_ZONES) {
  test(`AC5: every worked example walks through the "${zone}" zone`, () => {
    const subs = workedExampleSubsections();
    const alphaNames = new Set(alphaSetCards.map((c) => c.title));
    const matched = subs.filter((s) => {
      const m = s.title.match(/^Worked Example:\s*(.+?)\s*(?:\(|$)/i);
      return m && alphaNames.has(m[1].trim());
    });
    assert.ok(matched.length > 0, 'expected at least one worked example to check');
    for (const s of matched) {
      const body = s.lines.join('\n');
      const re = new RegExp(`\\*\\*${escapeRegExp(zone)}:?\\*\\*`);
      assert.ok(re.test(body), `expected worked example "${s.title}" to walk through the "${zone}" zone`);
    }
  });
}
