'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection } = require('./helpers/markdown');

const WORLD_PATH = path.join(__dirname, '..', 'design', 'world.md');
const CATEGORIES = ['materials', 'biology', 'intelligence', 'technology', 'magic'];

test('AC1: design/world.md exists', () => {
  assert.ok(fs.existsSync(WORLD_PATH), `expected ${WORLD_PATH} to exist`);
});

test('AC1: world.md contains a galaxy/setting overview', () => {
  const content = fs.readFileSync(WORLD_PATH, 'utf8');
  const sections = parseSections(content);
  const overview = sectionText(sections, /setting|galaxy|overview/i);
  assert.ok(overview, 'expected a setting/galaxy overview section (heading mentioning "setting", "galaxy", or "overview")');
  assert.ok(
    overview.replace(/\s+/g, ' ').trim().length > 200,
    'expected a substantive overview paragraph, not a stub'
  );
});

test('AC1: world.md contains a Cosmology section', () => {
  const content = fs.readFileSync(WORLD_PATH, 'utf8');
  const sections = parseSections(content);
  const idx = findSection(sections, /cosmology/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Cosmology"');
});

for (const category of CATEGORIES) {
  test(`AC1: cosmology section grounds "${category}" as an in-universe force`, () => {
    const content = fs.readFileSync(WORLD_PATH, 'utf8');
    const sections = parseSections(content);
    const cosmology = sectionText(sections, /cosmology/i);
    assert.ok(cosmology, 'expected a Cosmology section to check');
    const re = new RegExp(category, 'i');
    assert.ok(re.test(cosmology), `expected the Cosmology section to name "${category}"`);
  });
}
