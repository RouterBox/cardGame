'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, findSection } = require('./helpers/markdown');

const LORE_PATH = path.join(__dirname, '..', 'design', 'lore.md');
const RACE_NAMES = [
  'Cindral Reach',
  'Mireth Bloom',
  'Panoptic Concord',
  'Starweave Communion',
  'Wrought Assembly',
];
const FOUNT_TERMS = [
  /\bFounts?\b/,
  /\bFount Points?\b/,
  /\bthe Mass\b/,
  /\bthe Bloom\b/,
  /\bthe Signal\b/,
  /\bthe Circuit\b/,
  /\bthe Tangle\b/,
  /\bGenerators?\b/,
];

function countNumberedItems(body) {
  return body.split(/\r?\n/).filter((line) => /^\s*\d+\.\s+\S/.test(line)).length;
}

test('AC1: design/lore.md exists', () => {
  assert.ok(fs.existsSync(LORE_PATH), `expected ${LORE_PATH} to exist`);
});

const content = fs.existsSync(LORE_PATH) ? fs.readFileSync(LORE_PATH, 'utf8') : '';
const sections = parseSections(content);
const level2 = sections.filter((s) => s.level === 2);

test('AC2: lore.md has a named timeline/history section listing at least 4 distinct eras', () => {
  const idx = findSection(sections, /timeline|history/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Timeline" or "History"');
  const items = countNumberedItems(sections[idx].lines.join('\n'));
  assert.ok(items >= 4, `expected at least 4 listed eras/periods, found ${items}`);
});

test('AC3: at least one era/event section describes a central conflict directly involving 3+ of the 5 races', () => {
  const eraSections = level2.filter((s) => !/^(summary|timeline)/i.test(s.title));
  const qualifying = eraSections.filter((s) => {
    const body = s.lines.join('\n');
    return RACE_NAMES.filter((name) => body.includes(name)).length >= 3;
  });
  assert.ok(
    qualifying.length > 0,
    `expected at least one non-summary/timeline section naming 3+ of [${RACE_NAMES.join(', ')}]`
  );
});

test('AC4: lore.md references at least one Fount-related concept already defined in rules.md/world.md', () => {
  assert.ok(
    FOUNT_TERMS.some((re) => re.test(content)),
    'expected a reference to a Fount-related term (Founts, the Mass/Bloom/Signal/Circuit/Tangle, Fount Points, Generators)'
  );
});

test('AC5: lore.md ends with a short current-era section', () => {
  assert.ok(level2.length > 0, 'expected at least one level-2 section');
  const last = level2[level2.length - 1];
  assert.ok(
    /current era/i.test(last.title),
    `expected the final section to be a "current era" section, got "${last.title}"`
  );
  const body = last.lines.join(' ').replace(/\s+/g, ' ').trim();
  assert.ok(body.length > 100, 'expected a substantive current-era section');
});
