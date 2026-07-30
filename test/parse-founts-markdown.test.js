'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-founts-markdown.js');
const CARD_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');

const FOUNT_NAMES = ['The Mass', 'The Bloom', 'The Signal', 'The Circuit', 'The Tangle'];
const FOUNT_SLUGS = ['the-mass', 'the-bloom', 'the-signal', 'the-circuit', 'the-tangle'];
const FOUNT_DOMAINS = ['materials', 'biology', 'intelligence', 'technology', 'magic'];

test('AC2: lib/parse-founts-markdown.js exists and exports parseFountsMarkdown, slugify, and loadAllFounts', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseFountsMarkdown, 'function', 'expected an exported parseFountsMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
  assert.strictEqual(typeof mod.loadAllFounts, 'function', 'expected an exported loadAllFounts function');
});

test('AC2: slugify is the identical function reused from lib/parse-card-markdown.js', () => {
  const mod = require(LIB_PATH);
  const cardParse = require(CARD_LIB_PATH);

  assert.strictEqual(
    mod.slugify,
    cardParse.slugify,
    'expected the same slugify function reference to be re-exported, not a duplicate implementation'
  );

  FOUNT_NAMES.forEach((name, i) => {
    assert.strictEqual(mod.slugify(name), FOUNT_SLUGS[i], `expected slugify("${name}") to be "${FOUNT_SLUGS[i]}"`);
  });
});

test('AC1/AC2/AC3: parseFountsMarkdown extracts one record per Fount from a well-formed sample, ignoring non-Founts sections', () => {
  const { parseFountsMarkdown } = require(LIB_PATH);

  const markdown = `# Test World

## The Setting

Free-form prose that should never be mistaken for a Fount record.

## Cosmology: The Five Founts

Intro prose for the cosmology section itself.

### Test Alpha — alpha-domain

Alpha's own prose, describing only Alpha. It spans one paragraph.

### Test Beta — beta-domain

Beta's own prose, describing only Beta. It spans one paragraph.

## A History in Brief

### Not A Fount

This heading is a \`###\` under a non-Founts \`##\` section and must be ignored.
`;

  const founts = parseFountsMarkdown(markdown);
  assert.deepStrictEqual(founts, [
    {
      name: 'Test Alpha',
      slug: 'test-alpha',
      domain: 'alpha-domain',
      description: "Alpha's own prose, describing only Alpha. It spans one paragraph.",
    },
    {
      name: 'Test Beta',
      slug: 'test-beta',
      domain: 'beta-domain',
      description: "Beta's own prose, describing only Beta. It spans one paragraph.",
    },
  ]);
});

test('AC1: loadAllFounts returns exactly 5 records in file order', () => {
  const { loadAllFounts } = require(LIB_PATH);

  const founts = loadAllFounts();
  assert.strictEqual(founts.length, 5, `expected exactly 5 Founts, found ${founts.length}`);
  assert.deepStrictEqual(founts.map((f) => f.name), FOUNT_NAMES);
  assert.deepStrictEqual(founts.map((f) => f.slug), FOUNT_SLUGS);
  assert.deepStrictEqual(founts.map((f) => f.domain), FOUNT_DOMAINS);
});

test('AC2: every loaded Fount carries exactly the 4 required fields with correct shapes', () => {
  const { loadAllFounts, slugify } = require(LIB_PATH);

  const founts = loadAllFounts();
  for (const fount of founts) {
    assert.deepStrictEqual(
      Object.keys(fount).sort(),
      ['description', 'domain', 'name', 'slug'],
      `expected record for "${fount.name}" to carry exactly the 4 required fields`
    );
    assert.strictEqual(fount.slug, slugify(fount.name));
    assert.strictEqual(typeof fount.domain, 'string');
    assert.ok(fount.domain.length > 0, `expected non-empty domain for "${fount.name}"`);
    assert.strictEqual(typeof fount.description, 'string');
    assert.ok(fount.description.length > 0, `expected non-empty description for "${fount.name}"`);
  }
});

test('AC3 (held out): no Fount description contains the literal heading text of another Fount', () => {
  const { loadAllFounts } = require(LIB_PATH);

  const founts = loadAllFounts();
  for (const fount of founts) {
    for (const other of founts) {
      if (other.name === fount.name) continue;
      assert.ok(
        !fount.description.includes(other.name),
        `expected "${fount.name}"'s description not to contain the literal heading text of "${other.name}"`
      );
    }
  }
});
