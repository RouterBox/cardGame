'use strict';

const test = require('node:test');
const assert = require('node:assert');

const { findDuplicateNames } = require('../lib/card-catalog');
const { loadAllCards } = require('../lib/parse-card-markdown');

// ---------------------------------------------------------------------------
// AC2: fixture-data detection, including a case-only-variant collision.
// ---------------------------------------------------------------------------

test('AC2: detects a name repeated across two entries, including a case-only variant', () => {
  const cards = [
    { name: 'Wormhole Ledger' },
    { name: 'Static Ambush' },
    { name: 'wormhole ledger' },
    { name: 'Drone Cascade' },
  ];

  const duplicates = findDuplicateNames(cards);

  assert.strictEqual(duplicates.length, 1);
  assert.strictEqual(duplicates[0].toLowerCase(), 'wormhole ledger');
});

test('AC2: returns an empty list when no names repeat', () => {
  const cards = [
    { name: 'Wormhole Ledger' },
    { name: 'Static Ambush' },
    { name: 'Drone Cascade' },
  ];

  const duplicates = findDuplicateNames(cards);

  assert.deepStrictEqual(duplicates, []);
});

test('AC2: a name repeated 3+ times is reported only once', () => {
  const cards = [
    { name: 'Echo Recall' },
    { name: 'echo recall' },
    { name: 'ECHO RECALL' },
  ];

  const duplicates = findDuplicateNames(cards);

  assert.strictEqual(duplicates.length, 1);
  assert.strictEqual(duplicates[0].toLowerCase(), 'echo recall');
});

// ---------------------------------------------------------------------------
// AC3: the real, current design/cards/ catalog has zero duplicate names.
// ---------------------------------------------------------------------------

test('AC3: the real design/cards/ catalog has zero duplicate names today', () => {
  const cards = loadAllCards();
  const duplicates = findDuplicateNames(cards);

  assert.deepStrictEqual(
    duplicates,
    [],
    `expected no duplicate card names, found: ${duplicates.join(', ')}`
  );
});
