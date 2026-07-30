'use strict';

// Verifies AC1 and AC2: the four domain parsers (parse-race-markdown.js,
// parse-lore-markdown.js, parse-star-atlas-markdown.js,
// parse-founts-markdown.js) must import splitIntoH2Sections /
// splitIntoH3SectionsWithParent / extractParagraph from
// lib/markdown-sections.js, and slugify from lib/parse-card-markdown.js,
// instead of each hand-rolling its own copy. A hand-rolled copy would be a
// distinct function object even if byte-identical, so reference equality
// against the shared module's exports proves it's actually imported. Source
// text is also checked directly for the now-redundant local declarations,
// mirroring the plan's own verification grep.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const LIB_DIR = path.join(__dirname, '..', 'lib');
const MARKDOWN_SECTIONS_PATH = path.join(LIB_DIR, 'markdown-sections.js');
const PARSE_CARD_PATH = path.join(LIB_DIR, 'parse-card-markdown.js');

const PARSERS = {
  race: path.join(LIB_DIR, 'parse-race-markdown.js'),
  lore: path.join(LIB_DIR, 'parse-lore-markdown.js'),
  starAtlas: path.join(LIB_DIR, 'parse-star-atlas-markdown.js'),
  founts: path.join(LIB_DIR, 'parse-founts-markdown.js'),
};

function readSource(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('AC1: parse-race-markdown.js and parse-lore-markdown.js import splitIntoH2Sections from lib/markdown-sections.js (not their own copy)', () => {
  const shared = require(MARKDOWN_SECTIONS_PATH);
  const race = require(PARSERS.race);
  const lore = require(PARSERS.lore);

  assert.strictEqual(
    race.splitIntoH2Sections,
    shared.splitIntoH2Sections,
    'parse-race-markdown.js should re-export the exact splitIntoH2Sections function imported from lib/markdown-sections.js, not a locally declared copy'
  );
  assert.strictEqual(
    lore.splitIntoH2Sections,
    shared.splitIntoH2Sections,
    'parse-lore-markdown.js should re-export the exact splitIntoH2Sections function imported from lib/markdown-sections.js, not a locally declared copy'
  );
});

test('AC1: parse-star-atlas-markdown.js and parse-founts-markdown.js import splitIntoH3SectionsWithParent from lib/markdown-sections.js (not their own copy)', () => {
  const shared = require(MARKDOWN_SECTIONS_PATH);
  const starAtlas = require(PARSERS.starAtlas);
  const founts = require(PARSERS.founts);

  assert.strictEqual(
    starAtlas.splitIntoH3SectionsWithParent,
    shared.splitIntoH3SectionsWithParent,
    'parse-star-atlas-markdown.js should re-export the exact splitIntoH3SectionsWithParent function imported from lib/markdown-sections.js, not a locally declared copy'
  );
  assert.strictEqual(
    founts.splitIntoH3SectionsWithParent,
    shared.splitIntoH3SectionsWithParent,
    'parse-founts-markdown.js should re-export the exact splitIntoH3SectionsWithParent function imported from lib/markdown-sections.js, not a locally declared copy'
  );
});

test('AC1: none of the four parser files declare their own splitIntoH2Sections/splitIntoH3SectionsWithParent function', () => {
  for (const [key, filePath] of Object.entries(PARSERS)) {
    const source = readSource(filePath);
    assert.doesNotMatch(
      source,
      /function\s+splitIntoH2Sections\s*\(/,
      `${key} (${path.basename(filePath)}) should not declare its own splitIntoH2Sections`
    );
    assert.doesNotMatch(
      source,
      /function\s+splitIntoH3SectionsWithParent\s*\(/,
      `${key} (${path.basename(filePath)}) should not declare its own splitIntoH3SectionsWithParent`
    );
  }
});

test('AC2: none of the four parser files declare their own extractParagraph/extractSummary function, and each imports extractParagraph from lib/markdown-sections.js', () => {
  for (const [key, filePath] of Object.entries(PARSERS)) {
    const source = readSource(filePath);
    assert.doesNotMatch(
      source,
      /function\s+extractParagraph\s*\(/,
      `${key} (${path.basename(filePath)}) should not declare its own extractParagraph`
    );
    assert.doesNotMatch(
      source,
      /function\s+extractSummary\s*\(/,
      `${key} (${path.basename(filePath)}) should not declare its own extractSummary`
    );

    const importsMarkdownSections = /require\(\s*['"]\.\/markdown-sections['"]\s*\)/.test(source);
    assert.ok(
      importsMarkdownSections,
      `${key} (${path.basename(filePath)}) should require('./markdown-sections')`
    );

    const destructuresExtractParagraph =
      /\{[^}]*\bextractParagraph\b[^}]*\}\s*=\s*require\(\s*['"]\.\/markdown-sections['"]\s*\)/.test(source);
    assert.ok(
      destructuresExtractParagraph,
      `${key} (${path.basename(filePath)}) should destructure extractParagraph from require('./markdown-sections')`
    );
  }
});

test('AC2: parse-race-markdown.js and parse-star-atlas-markdown.js import slugify from lib/parse-card-markdown.js (not their own copy)', () => {
  const parseCard = require(PARSE_CARD_PATH);
  const race = require(PARSERS.race);
  const starAtlas = require(PARSERS.starAtlas);

  assert.strictEqual(typeof parseCard.slugify, 'function', 'expected lib/parse-card-markdown.js to export slugify');

  assert.strictEqual(
    race.slugify,
    parseCard.slugify,
    'parse-race-markdown.js should re-export the exact slugify function imported from lib/parse-card-markdown.js, not a locally declared copy'
  );
  assert.strictEqual(
    starAtlas.slugify,
    parseCard.slugify,
    'parse-star-atlas-markdown.js should re-export the exact slugify function imported from lib/parse-card-markdown.js, not a locally declared copy'
  );
});

test('AC2: parse-race-markdown.js and parse-star-atlas-markdown.js no longer declare their own slugify function', () => {
  for (const key of ['race', 'starAtlas']) {
    const source = readSource(PARSERS[key]);
    assert.doesNotMatch(
      source,
      /function\s+slugify\s*\(/,
      `${key} (${path.basename(PARSERS[key])}) should not declare its own slugify`
    );
  }
});
