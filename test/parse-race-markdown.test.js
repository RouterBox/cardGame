'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-race-markdown.js');
const CARD_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');

test('AC2: lib/parse-race-markdown.js exists and exports parseRaceMarkdown, slugify, and loadAllRaces', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseRaceMarkdown, 'function', 'expected an exported parseRaceMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
  assert.strictEqual(typeof mod.loadAllRaces, 'function', 'expected an exported loadAllRaces function');
});

test('AC2: slugify matches lib/parse-card-markdown.js\'s existing algorithm', () => {
  const { slugify } = require(LIB_PATH);
  const { slugify: cardSlugify } = require(CARD_LIB_PATH);

  assert.strictEqual(slugify('The Cindral Reach'), 'the-cindral-reach');
  assert.strictEqual(slugify('  Multiple   Spaces  '), 'multiple-spaces');

  const samples = ['The Cindral Reach', 'The Mireth Bloom', 'The Panoptic Concord', "The Starweave Communion"];
  for (const name of samples) {
    assert.strictEqual(slugify(name), cardSlugify(name), `expected slugify("${name}") to match the card parser's slugify`);
  }
});

test('AC1/AC2: parseRaceMarkdown extracts all 8 fields from a well-formed race file', () => {
  const { parseRaceMarkdown } = require(LIB_PATH);

  const markdown = `# The Test Reach

## Identity

This is a test race that exists only to exercise the parser. It spans
one paragraph.

## Strengths & Weaknesses

- **Primary strength:** Materials
- **Complementary strengths:** Biology, Intelligence
- **Countering weaknesses:** Technology, Magic

## Signature Hooks

- **First Hook** — the first hook's description.
- **Second Hook** — the second hook's description.

## Visual Identity

A visual identity paragraph for the test race.
`;

  const race = parseRaceMarkdown(markdown);
  assert.deepStrictEqual(race, {
    name: 'The Test Reach',
    slug: 'the-test-reach',
    identity: 'This is a test race that exists only to exercise the parser. It spans one paragraph.',
    primaryStrength: 'Materials',
    complementaryStrengths: ['Biology', 'Intelligence'],
    counteringWeaknesses: ['Technology', 'Magic'],
    signatureHooks: [
      { name: 'First Hook', description: "the first hook's description." },
      { name: 'Second Hook', description: "the second hook's description." },
    ],
    visualIdentity: 'A visual identity paragraph for the test race.',
  });
});

test('AC1: parseRaceMarkdown returns null when the markdown has no H1', () => {
  const { parseRaceMarkdown } = require(LIB_PATH);
  const race = parseRaceMarkdown('## Identity\n\nNo H1 heading here.\n');
  assert.strictEqual(race, null);
});

test('AC1: loadAllRaces returns exactly 5 records, in cindral/mireth/panoptic/starweave/wrought file order', () => {
  const { loadAllRaces } = require(LIB_PATH);

  const races = loadAllRaces();
  assert.strictEqual(races.length, 5, `expected exactly 5 races, found ${races.length}`);

  assert.deepStrictEqual(
    races.map((r) => r.name),
    [
      'The Cindral Reach',
      'The Mireth Bloom',
      'The Panoptic Concord',
      'The Starweave Communion',
      'The Wrought Assembly',
    ]
  );
});

test('AC2/AC3: every loaded race carries exactly the 8 required fields with correct shapes', () => {
  const { loadAllRaces, slugify } = require(LIB_PATH);

  const races = loadAllRaces();
  for (const race of races) {
    assert.deepStrictEqual(
      Object.keys(race).sort(),
      [
        'complementaryStrengths',
        'counteringWeaknesses',
        'identity',
        'name',
        'primaryStrength',
        'signatureHooks',
        'slug',
        'visualIdentity',
      ],
      `expected record for "${race.name}" to carry exactly the 8 required fields`
    );
    assert.strictEqual(race.slug, slugify(race.name));
    assert.strictEqual(typeof race.identity, 'string');
    assert.ok(race.identity.length > 0, `expected non-empty identity for "${race.name}"`);
    assert.strictEqual(typeof race.visualIdentity, 'string');
    assert.ok(race.visualIdentity.length > 0, `expected non-empty visualIdentity for "${race.name}"`);
    assert.strictEqual(typeof race.primaryStrength, 'string');
    assert.strictEqual(race.complementaryStrengths.length, 2, `expected 2 complementary strengths for "${race.name}"`);
    assert.strictEqual(race.counteringWeaknesses.length, 2, `expected 2 countering weaknesses for "${race.name}"`);
    assert.strictEqual(race.signatureHooks.length, 5, `expected 5 signature hooks for "${race.name}"`);
    for (const hook of race.signatureHooks) {
      assert.strictEqual(typeof hook.name, 'string');
      assert.strictEqual(typeof hook.description, 'string');
      assert.ok(hook.name.length > 0);
      assert.ok(hook.description.length > 0);
    }
  }
});
