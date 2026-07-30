'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-lore-markdown.js');
const CARD_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');

const ERA_NAMES = [
  'The Weave Age',
  'The Sundering',
  'The Long Dark',
  'The Five Risings',
  'The Cinderglass War',
  'Current Era: The Uneasy Expanse',
];
const ERA_SLUGS = [
  'the-weave-age',
  'the-sundering',
  'the-long-dark',
  'the-five-risings',
  'the-cinderglass-war',
  'current-era-the-uneasy-expanse',
];

test('AC2: lib/parse-lore-markdown.js exists and exports parseLoreMarkdown, slugify, and loadAllEras', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseLoreMarkdown, 'function', 'expected an exported parseLoreMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
  assert.strictEqual(typeof mod.loadAllEras, 'function', 'expected an exported loadAllEras function');
});

test('AC2: slugify is the identical function reused from lib/parse-card-markdown.js', () => {
  const mod = require(LIB_PATH);
  const cardParse = require(CARD_LIB_PATH);

  assert.strictEqual(mod.slugify, cardParse.slugify, 'expected the same slugify function reference to be re-exported, not a duplicate implementation');

  ERA_NAMES.forEach((name, i) => {
    assert.strictEqual(mod.slugify(name), ERA_SLUGS[i], `expected slugify("${name}") to be "${ERA_SLUGS[i]}"`);
  });
});

test('AC1/AC3: parseLoreMarkdown extracts one record per era from a well-formed sample, ordered by the Timeline of Eras list', () => {
  const { parseLoreMarkdown } = require(LIB_PATH);

  const markdown = `# Test Chronicle

## Summary

This is a summary paragraph that should not become an era record.

## Timeline of Eras

1. Era Alpha
2. Era Beta

## Era Beta

Beta's own prose, describing only Beta. It spans one paragraph.

## Era Alpha

Alpha's own prose, describing only Alpha. It spans one paragraph.
`;

  const eras = parseLoreMarkdown(markdown);
  assert.deepStrictEqual(eras, [
    {
      name: 'Era Alpha',
      slug: 'era-alpha',
      order: 1,
      summary: 'Alpha\'s own prose, describing only Alpha. It spans one paragraph.',
    },
    {
      name: 'Era Beta',
      slug: 'era-beta',
      order: 2,
      summary: 'Beta\'s own prose, describing only Beta. It spans one paragraph.',
    },
  ]);
});

test('AC1: loadAllEras returns exactly 6 records in Timeline-of-Eras order', () => {
  const { loadAllEras } = require(LIB_PATH);

  const eras = loadAllEras();
  assert.strictEqual(eras.length, 6, `expected exactly 6 eras, found ${eras.length}`);
  assert.deepStrictEqual(eras.map((e) => e.name), ERA_NAMES);
  assert.deepStrictEqual(eras.map((e) => e.slug), ERA_SLUGS);
  assert.deepStrictEqual(eras.map((e) => e.order), [1, 2, 3, 4, 5, 6]);
});

test('AC2: every loaded era carries exactly the 4 required fields with correct shapes', () => {
  const { loadAllEras, slugify } = require(LIB_PATH);

  const eras = loadAllEras();
  for (const era of eras) {
    assert.deepStrictEqual(
      Object.keys(era).sort(),
      ['name', 'order', 'slug', 'summary'],
      `expected record for "${era.name}" to carry exactly the 4 required fields`
    );
    assert.strictEqual(era.slug, slugify(era.name));
    assert.strictEqual(typeof era.order, 'number');
    assert.strictEqual(typeof era.summary, 'string');
    assert.ok(era.summary.length > 0, `expected non-empty summary for "${era.name}"`);
  }
});

test('AC3: order values are the unique integers 1..6 with no gaps or repeats', () => {
  const { loadAllEras } = require(LIB_PATH);

  const orders = loadAllEras().map((e) => e.order);
  assert.deepStrictEqual([...orders].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6]);
  assert.strictEqual(new Set(orders).size, 6, 'expected 6 unique order values');
});

test('AC4 (held out): no era summary contains the literal heading text of another era', () => {
  const { loadAllEras } = require(LIB_PATH);

  const eras = loadAllEras();
  for (const era of eras) {
    for (const other of eras) {
      if (other.name === era.name) continue;
      assert.ok(
        !era.summary.includes(other.name),
        `expected "${era.name}"'s summary not to contain the literal heading text of "${other.name}"`
      );
    }
  }
});
