'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-star-atlas-markdown.js');
const CARD_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');

test('AC2: lib/parse-star-atlas-markdown.js exists and exports parseStarAtlasMarkdown, slugify, and loadAllWorlds', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseStarAtlasMarkdown, 'function', 'expected an exported parseStarAtlasMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
  assert.strictEqual(typeof mod.loadAllWorlds, 'function', 'expected an exported loadAllWorlds function');
});

test('AC2: slugify matches lib/parse-card-markdown.js\'s existing algorithm', () => {
  const { slugify } = require(LIB_PATH);
  const { slugify: cardSlugify } = require(CARD_LIB_PATH);

  assert.strictEqual(slugify('Halvorne Junction'), 'halvorne-junction');
  assert.strictEqual(slugify('  Multiple   Spaces  '), 'multiple-spaces');

  const samples = ['Ashkeel', 'Fenwreath', 'Vantaris', 'Ansareth', 'Corewright', 'Halvorne Junction', 'Kelmourn Drift', 'Tallowfen'];
  for (const name of samples) {
    assert.strictEqual(slugify(name), cardSlugify(name), `expected slugify("${name}") to match the card parser's slugify`);
  }
});

test('AC1/AC2/AC3: parseStarAtlasMarkdown extracts a homeworld and a frontier record from a well-formed sample', () => {
  const { parseStarAtlasMarkdown } = require(LIB_PATH);

  const markdown = `# The Test Atlas

## Homeworlds

### Testhome — Homeworld of the Test Reach

Testhome is a paragraph describing the world in prose. It spans one
paragraph for testing purposes only.

## Frontier & Contested Worlds

### Testfrontier

Testfrontier is a frontier world used only to exercise the parser.
`;

  const worlds = parseStarAtlasMarkdown(markdown);
  assert.deepStrictEqual(worlds, [
    {
      name: 'Testhome',
      slug: 'testhome',
      type: 'homeworld',
      race: 'Test Reach',
      description: 'Testhome is a paragraph describing the world in prose. It spans one paragraph for testing purposes only.',
    },
    {
      name: 'Testfrontier',
      slug: 'testfrontier',
      type: 'frontier',
      race: null,
      description: 'Testfrontier is a frontier world used only to exercise the parser.',
    },
  ]);
});

test('AC1: loadAllWorlds returns exactly 8 records in file order with correct type/race per section', () => {
  const { loadAllWorlds } = require(LIB_PATH);

  const worlds = loadAllWorlds();
  assert.strictEqual(worlds.length, 8, `expected exactly 8 worlds, found ${worlds.length}`);

  assert.deepStrictEqual(
    worlds.map((w) => w.name),
    ['Ashkeel', 'Fenwreath', 'Vantaris', 'Ansareth', 'Corewright', 'Halvorne Junction', 'Kelmourn Drift', 'Tallowfen']
  );

  const homeworlds = worlds.slice(0, 5);
  const expectedRaces = ['Cindral Reach', 'Mireth Bloom', 'Panoptic Concord', 'Starweave Communion', 'Wrought Assembly'];
  homeworlds.forEach((world, i) => {
    assert.strictEqual(world.type, 'homeworld', `expected "${world.name}" to be type 'homeworld'`);
    assert.strictEqual(world.race, expectedRaces[i], `expected "${world.name}" race to be "${expectedRaces[i]}"`);
  });

  const frontierWorlds = worlds.slice(5);
  for (const world of frontierWorlds) {
    assert.strictEqual(world.type, 'frontier', `expected "${world.name}" to be type 'frontier'`);
    assert.strictEqual(world.race, null, `expected "${world.name}" race to be null`);
  }
});

test('AC2: every loaded world carries exactly the 5 required fields with correct shapes', () => {
  const { loadAllWorlds, slugify } = require(LIB_PATH);

  const worlds = loadAllWorlds();
  for (const world of worlds) {
    assert.deepStrictEqual(
      Object.keys(world).sort(),
      ['description', 'name', 'race', 'slug', 'type'],
      `expected record for "${world.name}" to carry exactly the 5 required fields`
    );
    assert.strictEqual(world.slug, slugify(world.name));
    assert.ok(['homeworld', 'frontier'].includes(world.type), `expected type to be 'homeworld' or 'frontier' for "${world.name}"`);
    assert.strictEqual(typeof world.description, 'string');
    assert.ok(world.description.length > 0, `expected non-empty description for "${world.name}"`);
  }
});
