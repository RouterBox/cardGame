'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');

// ---------------------------------------------------------------------------
// AC1: lib/parse-card-markdown.js exists and exports parseCardMarkdown(markdown)
// implementing the field-prefix parsing convention ('Cost line:', 'Type line:',
// 'Rules text:', 'Stats/counters line:'), plus a slugify(name) function matching
// the existing algorithm.
// ---------------------------------------------------------------------------

test('AC1: lib/parse-card-markdown.js exists and exports parseCardMarkdown and slugify functions', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseCardMarkdown, 'function', 'expected an exported parseCardMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
});

test('AC1: parseCardMarkdown parses a card section carrying all four field-prefix lines', () => {
  const { parseCardMarkdown } = require(LIB_PATH);

  const markdown = `
### Ledger Wraith

Cost line: 2 Mass, 1 Tangle
Type line: Unit — Permanent
Rules text: Ambush. When this enters, draw a card.
Stats/counters line: Combat strength 4. Enters with one growth counter.

*Every debt eventually collects itself.*
`;

  const cards = parseCardMarkdown(markdown);
  assert.strictEqual(cards.length, 1, 'expected exactly one parsed card');
  assert.deepStrictEqual(cards[0], {
    name: 'Ledger Wraith',
    costLine: '2 Mass, 1 Tangle',
    typeLine: 'Unit — Permanent',
    rulesText: 'Ambush. When this enters, draw a card.',
    statsLine: 'Combat strength 4. Enters with one growth counter.',
    flavorText: 'Every debt eventually collects itself.',
  });
});

test('AC1: parseCardMarkdown parses a card missing the optional Stats/counters line, with statsLine null', () => {
  const { parseCardMarkdown } = require(LIB_PATH);

  const markdown = `
### Quiet Ledger

Cost line: 1 Signal
Type line: Magic
Rules text: Fast. Look at the top card of the Queue.

*Not every silence is empty.*
`;

  const cards = parseCardMarkdown(markdown);
  assert.strictEqual(cards.length, 1, 'expected exactly one parsed card');
  assert.strictEqual(cards[0].statsLine, null, 'expected statsLine to be null when the field is absent');
  assert.strictEqual(cards[0].costLine, '1 Signal');
  assert.strictEqual(cards[0].typeLine, 'Magic');
  assert.strictEqual(cards[0].rulesText, 'Fast. Look at the top card of the Queue.');
  assert.strictEqual(cards[0].flavorText, 'Not every silence is empty.');
});

test('AC1: parseCardMarkdown excludes level-3 sections that do not carry the required card fields', () => {
  const { parseCardMarkdown } = require(LIB_PATH);

  const markdown = `
### Worked Example: reading a Cost line

This section talks about a Cost line and a Type line in prose, but never
starts a line with the actual field prefixes, so it is not a card record.

### Real Card

Cost line: 1 Bloom
Type line: Magic
Rules text: Draw a card.
`;

  const cards = parseCardMarkdown(markdown);
  assert.strictEqual(cards.length, 1, 'expected only the section with real field-prefix lines to be parsed as a card');
  assert.strictEqual(cards[0].name, 'Real Card');
});

test('AC1: slugify matches the existing algorithm (lowercase, hyphenate, trim edge hyphens)', () => {
  const { slugify } = require(LIB_PATH);

  assert.strictEqual(slugify('Ledger Wraith'), 'ledger-wraith');
  assert.strictEqual(slugify("Oathbreaker's Toll"), 'oathbreaker-s-toll');
  assert.strictEqual(slugify('  Multiple   Spaces  '), 'multiple-spaces');
  assert.strictEqual(slugify('Signal-Wrought Prototype'), 'signal-wrought-prototype');
});
