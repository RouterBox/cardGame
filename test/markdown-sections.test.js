'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'markdown-sections.js');

test('AC1/AC5: lib/markdown-sections.js exists and exports splitIntoH2Sections, splitIntoH3SectionsWithParent, and extractParagraph', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.splitIntoH2Sections, 'function', 'expected an exported splitIntoH2Sections function');
  assert.strictEqual(typeof mod.splitIntoH3SectionsWithParent, 'function', 'expected an exported splitIntoH3SectionsWithParent function');
  assert.strictEqual(typeof mod.extractParagraph, 'function', 'expected an exported extractParagraph function');
});

test('AC5: splitIntoH2Sections groups lines under the nearest preceding level-2 heading', () => {
  const { splitIntoH2Sections } = require(LIB_PATH);

  const markdown = [
    '# Title',
    '',
    '## Alpha',
    '',
    'alpha line one',
    'alpha line two',
    '',
    '## Beta',
    '',
    'beta line one',
    '',
  ].join('\n');

  const sections = splitIntoH2Sections(markdown);
  assert.deepStrictEqual(sections.map((s) => s.title), ['Alpha', 'Beta']);
  assert.deepStrictEqual(sections[0].lines, ['', 'alpha line one', 'alpha line two', '']);
  assert.deepStrictEqual(sections[1].lines, ['', 'beta line one', '']);
});

test('AC5: splitIntoH2Sections resets the current section on any non-H2 heading (H1, H3, ...)', () => {
  const { splitIntoH2Sections } = require(LIB_PATH);

  const markdown = [
    '## Alpha',
    '',
    'alpha body',
    '',
    '# Interrupting H1',
    '',
    'orphaned line, should not belong to any section',
    '',
  ].join('\n');

  const sections = splitIntoH2Sections(markdown);
  assert.strictEqual(sections.length, 1);
  assert.strictEqual(sections[0].title, 'Alpha');
  assert.deepStrictEqual(sections[0].lines, ['', 'alpha body', '']);
});

test('AC5: splitIntoH3SectionsWithParent tags each H3 section with its nearest preceding H2 heading', () => {
  const { splitIntoH3SectionsWithParent } = require(LIB_PATH);

  const markdown = [
    '## Group One',
    '',
    '### Item A',
    '',
    'item a body',
    '',
    '### Item B',
    '',
    'item b body',
    '',
    '## Group Two',
    '',
    '### Item C',
    '',
    'item c body',
    '',
  ].join('\n');

  const sections = splitIntoH3SectionsWithParent(markdown);
  assert.deepStrictEqual(
    sections.map((s) => ({ title: s.title, parentH2: s.parentH2 })),
    [
      { title: 'Item A', parentH2: 'Group One' },
      { title: 'Item B', parentH2: 'Group One' },
      { title: 'Item C', parentH2: 'Group Two' },
    ]
  );
});

test('AC5: splitIntoH3SectionsWithParent records a null parentH2 for an H3 with no preceding H2', () => {
  const { splitIntoH3SectionsWithParent } = require(LIB_PATH);

  const markdown = ['# Title', '', '### Orphan Item', '', 'orphan body', ''].join('\n');

  const sections = splitIntoH3SectionsWithParent(markdown);
  assert.strictEqual(sections.length, 1);
  assert.strictEqual(sections[0].title, 'Orphan Item');
  assert.strictEqual(sections[0].parentH2, null);
});

test('AC5: extractParagraph trims each line, drops blanks, and joins the rest with a single space', () => {
  const { extractParagraph } = require(LIB_PATH);

  const section = { lines: ['  First line.  ', '', 'Second line.', '   ', 'Third line.'] };
  assert.strictEqual(extractParagraph(section), 'First line. Second line. Third line.');
});

test('AC5: extractParagraph returns null for a null section or an all-blank section', () => {
  const { extractParagraph } = require(LIB_PATH);

  assert.strictEqual(extractParagraph(null), null);
  assert.strictEqual(extractParagraph({ lines: ['', '   ', ''] }), null);
});
