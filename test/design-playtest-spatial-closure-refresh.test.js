'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const PLAYTEST_PATH = path.join(__dirname, '..', 'design', 'playtest-spatial.md');
const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'wormhole-closure-cards.md');

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

function step9() {
  return stepText(readPlaytest(), 9);
}

// ---------------------------------------------------------------------------
// AC1: Step 9 no longer crosses out a line and narrates Closure without
// naming any card producing it.
// ---------------------------------------------------------------------------

test('AC1: Step 9 no longer narrates Closure as a bare note with no card named', () => {
  const body = step9();
  assert.ok(
    !/cross it out fully, and note that the two Planets it connected are no longer adjacent/.test(body),
    'expected Step 9 to no longer narrate Closure as a bare note with no card named'
  );
});

// ---------------------------------------------------------------------------
// AC2: Step 9 names Chokepoint Demolition Charge and its Cost line (2
// Circuit), and that card really exists in wormhole-closure-cards.md.
// ---------------------------------------------------------------------------

test('AC2: Step 9 names Chokepoint Demolition Charge and its Cost line (2 Circuit)', () => {
  const body = step9();
  assert.ok(/Chokepoint Demolition Charge/.test(body), 'expected Step 9 to name "Chokepoint Demolition Charge"');
  assert.ok(/2 Circuit/.test(body), 'expected Step 9 to cite the "2 Circuit" Cost line');
});

test('AC2: Chokepoint Demolition Charge exists in wormhole-closure-cards.md with a 2 Circuit Cost line', () => {
  const cards = readCards();
  const idx = cards.indexOf('### Chokepoint Demolition Charge');
  assert.notStrictEqual(
    idx,
    -1,
    'expected an exact "### Chokepoint Demolition Charge" heading in wormhole-closure-cards.md'
  );
  const afterHeading = cards.slice(idx, idx + 400);
  assert.ok(
    /Cost line:\s*2 Circuit/.test(afterHeading),
    "expected Chokepoint Demolition Charge's Cost line to read \"2 Circuit\""
  );
});

// ---------------------------------------------------------------------------
// AC3: Step 9 still ends with the same physical action (crossing out the
// line fully) and the same aloud confirmation, unchanged from before this
// unit.
// ---------------------------------------------------------------------------

test('AC3: Step 9 still instructs crossing out the line fully', () => {
  const body = step9();
  assert.ok(
    /cross it out\s*fully/.test(body),
    'expected Step 9 to still instruct crossing out the line fully'
  );
});

test('AC3: Step 9 still ends with the unchanged aloud never-redraw confirmation', () => {
  const body = step9();
  assert.ok(
    body.includes(
      'Confirm aloud that this line MAY NOT be redrawn — reconnecting those same two Planets later would require paying for a brand-new Discovery action from scratch.'
    ),
    'expected Step 9 to still end with the unchanged aloud never-redraw confirmation sentence'
  );
});
