'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const PLAYTEST_PATH = path.join(__dirname, '..', 'design', 'playtest-spatial.md');
const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'wormhole-restrictions-set.md');

function readPlaytest() {
  assert.ok(fs.existsSync(PLAYTEST_PATH), `expected ${PLAYTEST_PATH} to exist`);
  return fs.readFileSync(PLAYTEST_PATH, 'utf8');
}

function readCards() {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
  return fs.readFileSync(CARDS_PATH, 'utf8');
}

// Extracts the body text of numbered procedure step `n` from
// playtest-spatial.md: from the "^n. " marker up to (not including) the
// next "^(n+1). " marker. Whitespace is collapsed to single spaces so
// assertions don't care where the source happens to wrap a line.
function stepText(content, n) {
  const startRe = new RegExp(`^${n}\\.\\s+`, 'm');
  const endRe = new RegExp(`^${n + 1}\\.\\s+`, 'm');
  const startMatch = startRe.exec(content);
  assert.ok(startMatch, `expected a "${n}. " numbered step in playtest-spatial.md`);
  const rest = content.slice(startMatch.index);
  const endMatch = endRe.exec(rest);
  const body = endMatch ? rest.slice(0, endMatch.index) : rest;
  return body.replace(/\s+/g, ' ').trim();
}

function step8() {
  return stepText(readPlaytest(), 8);
}

// ---------------------------------------------------------------------------
// AC1: Step 8 no longer claims no card grants a Restriction.
// ---------------------------------------------------------------------------

test('AC1: Step 8 no longer contains the "no default action" disclaimer', () => {
  const body = step8();
  assert.ok(
    !/no default action that grants one/i.test(body),
    'expected Step 8 to no longer contain the "no default action that grants one" disclaimer'
  );
  assert.ok(
    !/simply declare which card would/i.test(body),
    'expected Step 8 to no longer ask playtesters to declare a hypothetical card'
  );
});

// ---------------------------------------------------------------------------
// AC2: Step 8 names Bastion Lockdown Line and its Cost line (2 Mass), and
// that card really exists in wormhole-restrictions-set.md.
// ---------------------------------------------------------------------------

test('AC2: Step 8 names Bastion Lockdown Line and its Cost line (2 Mass)', () => {
  const body = step8();
  assert.ok(/Bastion Lockdown Line/.test(body), 'expected Step 8 to name "Bastion Lockdown Line"');
  assert.ok(/2 Mass/.test(body), 'expected Step 8 to cite the "2 Mass" Cost line');
});

test('AC2: Bastion Lockdown Line exists in wormhole-restrictions-set.md with a 2 Mass Cost line', () => {
  const cards = readCards();
  const idx = cards.indexOf('### Bastion Lockdown Line');
  assert.notStrictEqual(
    idx,
    -1,
    'expected an exact "### Bastion Lockdown Line" heading in wormhole-restrictions-set.md'
  );
  const afterHeading = cards.slice(idx, idx + 400);
  assert.ok(
    /Cost line:\s*2 Mass/.test(afterHeading),
    "expected Bastion Lockdown Line's Cost line to read \"2 Mass\""
  );
});

// ---------------------------------------------------------------------------
// AC3: Step 8 still ends with the same write-the-note action and the same
// aloud two-way-default confirmation, unchanged from before this unit.
// ---------------------------------------------------------------------------

test('AC3: Step 8 still instructs writing "one-way: [origin]->[destination]" on the line', () => {
  const body = step8();
  assert.ok(
    body.includes('write "one-way: [origin]→[destination]" on it'),
    'expected Step 8 to still instruct writing "one-way: [origin]→[destination]" on the line'
  );
});

test('AC3: Step 8 still ends with the unchanged aloud two-way-default confirmation', () => {
  const body = step8();
  assert.ok(
    body.includes(
      'Confirm aloud that a Wormhole with no such note may still be traversed either way, since no-Restriction is the default.'
    ),
    'expected Step 8 to still end with the unchanged aloud two-way-default confirmation sentence'
  );
});
