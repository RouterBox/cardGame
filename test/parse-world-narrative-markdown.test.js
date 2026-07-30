'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText } = require('./helpers/markdown');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-world-narrative-markdown.js');
const CARD_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');
const FOUNTS_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-founts-markdown.js');
const WORLD_PATH = path.join(__dirname, '..', 'design', 'world.md');

const NARRATIVE_TITLES = ['The Setting', 'A History in Brief'];
const NARRATIVE_SLUGS = ['the-setting', 'a-history-in-brief'];

const FOUNT_NAMES = ['The Mass', 'The Bloom', 'The Signal', 'The Circuit', 'The Tangle'];
const FOUNT_SLUGS = ['the-mass', 'the-bloom', 'the-signal', 'the-circuit', 'the-tangle'];
const FOUNT_DOMAINS = ['materials', 'biology', 'intelligence', 'technology', 'magic'];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function paragraphFromBody(body) {
  if (!body) return '';
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}

// Independently derives the expected narrative records straight from
// design/world.md's own "## The Setting" / "## A History in Brief" H2
// sections, mirroring how test/sync-races-to-jaina.test.js's
// listExpectedRaces() and test/sync-founts-to-jaina.test.js's
// listExpectedFounts() build their own expectations, without depending on
// lib/parse-world-narrative-markdown.js itself.
function listExpectedNarrativeSections() {
  const content = fs.readFileSync(WORLD_PATH, 'utf8');
  const sections = parseSections(content);

  return NARRATIVE_TITLES.map((title) => {
    const body = sectionText(sections, new RegExp(`^${escapeRegExp(title)}$`));
    return { title, slug: slugify(title), body: paragraphFromBody(body) };
  });
}

test('AC1: lib/parse-world-narrative-markdown.js exists and exports parseWorldNarrativeMarkdown, slugify, and loadWorldNarrativeSections', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseWorldNarrativeMarkdown, 'function', 'expected an exported parseWorldNarrativeMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
  assert.strictEqual(typeof mod.loadWorldNarrativeSections, 'function', 'expected an exported loadWorldNarrativeSections function');
});

test('AC1: slugify is the identical function reused from lib/parse-card-markdown.js', () => {
  const mod = require(LIB_PATH);
  const cardParse = require(CARD_LIB_PATH);

  assert.strictEqual(
    mod.slugify,
    cardParse.slugify,
    'expected the same slugify function reference to be re-exported, not a duplicate implementation'
  );

  assert.strictEqual(mod.slugify('The Setting'), 'the-setting');
  assert.strictEqual(mod.slugify('A History in Brief'), 'a-history-in-brief');
});

test('AC1: loadWorldNarrativeSections returns exactly 2 records, titled "The Setting" then "A History in Brief"', () => {
  const { loadWorldNarrativeSections } = require(LIB_PATH);

  const sections = loadWorldNarrativeSections();
  assert.strictEqual(sections.length, 2, `expected exactly 2 narrative sections, found ${sections.length}`);
  assert.deepStrictEqual(sections.map((s) => s.title), NARRATIVE_TITLES);
  assert.deepStrictEqual(sections.map((s) => s.slug), NARRATIVE_SLUGS);
});

test('AC1: each loaded record has exactly the 3 keys title/slug/body, with slug matching slugify(title) and a non-empty body', () => {
  const { loadWorldNarrativeSections } = require(LIB_PATH);

  const sections = loadWorldNarrativeSections();
  for (const section of sections) {
    assert.deepStrictEqual(
      Object.keys(section).sort(),
      ['body', 'slug', 'title'],
      `expected record for "${section.title}" to carry exactly the 3 required fields`
    );
    assert.strictEqual(section.slug, slugify(section.title));
    assert.strictEqual(typeof section.body, 'string');
    assert.ok(section.body.length > 0, `expected non-empty body for "${section.title}"`);
  }
});

test('AC1: each record\'s body matches an independently-derived expected paragraph from design/world.md', () => {
  const { loadWorldNarrativeSections } = require(LIB_PATH);

  const sections = loadWorldNarrativeSections();
  const expected = listExpectedNarrativeSections();

  assert.strictEqual(sections.length, expected.length);
  for (let i = 0; i < sections.length; i++) {
    assert.strictEqual(sections[i].title, expected[i].title);
    assert.strictEqual(sections[i].slug, expected[i].slug);
    assert.strictEqual(
      sections[i].body,
      expected[i].body,
      `body mismatch for "${sections[i].title}"`
    );
  }
});

test('AC2 (held out): no returned record is titled "Cosmology: The Five Founts"', () => {
  const { loadWorldNarrativeSections } = require(LIB_PATH);

  const sections = loadWorldNarrativeSections();
  for (const section of sections) {
    assert.notStrictEqual(section.title, 'Cosmology: The Five Founts');
  }
});

test('AC2 (held out): lib/parse-founts-markdown.js\'s loadAllFounts() is unaffected — still 5 records with the same names/slugs/domains', () => {
  const { loadAllFounts } = require(FOUNTS_LIB_PATH);

  const founts = loadAllFounts();
  assert.strictEqual(founts.length, 5, `expected exactly 5 Founts, found ${founts.length}`);
  assert.deepStrictEqual(founts.map((f) => f.name), FOUNT_NAMES);
  assert.deepStrictEqual(founts.map((f) => f.slug), FOUNT_SLUGS);
  assert.deepStrictEqual(founts.map((f) => f.domain), FOUNT_DOMAINS);
});

test('AC1/AC2: parseWorldNarrativeMarkdown extracts only the two narrative H2 records from a sample containing all three H2 sections, ignoring the Founts H2 and its H3 subsection', () => {
  const { parseWorldNarrativeMarkdown } = require(LIB_PATH);

  const markdown = `# Test World

## The Setting

Some prose here. It spans a single paragraph.

## A History in Brief

Other prose here. It also spans a single paragraph.

## Cosmology: The Five Founts

### Some Fount

Fount prose that must never be mistaken for a narrative record.
`;

  const sections = parseWorldNarrativeMarkdown(markdown);
  assert.deepStrictEqual(sections, [
    { title: 'The Setting', slug: 'the-setting', body: 'Some prose here. It spans a single paragraph.' },
    { title: 'A History in Brief', slug: 'a-history-in-brief', body: 'Other prose here. It also spans a single paragraph.' },
  ]);

  for (const section of sections) {
    assert.notStrictEqual(section.title, 'Cosmology: The Five Founts');
    assert.notStrictEqual(section.title, 'Some Fount');
  }
});
