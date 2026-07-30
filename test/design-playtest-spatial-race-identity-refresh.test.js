'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const PLAYTEST_PATH = path.join(REPO_ROOT, 'design', 'playtest-spatial.md');
const WAVE1_CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'spatial-race-identity-set.md');
const WAVE2_CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'spatial-race-identity-set-wave-2.md');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const SITE_HTML_PATH = path.join(REPO_ROOT, 'site', 'design', 'playtest-spatial.html');

function readFile(p) {
  assert.ok(fs.existsSync(p), `expected ${p} to exist`);
  return fs.readFileSync(p, 'utf8');
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

function cardBlock(cardsContent, headingName) {
  const idx = cardsContent.indexOf(`### ${headingName}`);
  assert.notStrictEqual(idx, -1, `expected an exact "### ${headingName}" heading`);
  return cardsContent.slice(idx, idx + 400);
}

const CARDS = [
  { name: 'Preemptive Survey', cost: '1 Signal', type: 'Intelligence', file: WAVE1_CARDS_PATH, sections: ['8.3'] },
  { name: 'Unbound Passage', cost: '2 Tangle', type: 'Magic', file: WAVE1_CARDS_PATH, sections: ['8.4', '8.6'] },
  { name: 'Chokepoint Garrison', cost: '2 Mass', type: 'Materials', file: WAVE1_CARDS_PATH, sections: ['8.5'] },
  { name: 'Bloom Fount', cost: '2 Bloom', type: 'Biology', file: WAVE2_CARDS_PATH, sections: ['4.6'] },
  { name: 'Circuit Fount', cost: '2 Circuit', type: 'Technology', file: WAVE2_CARDS_PATH, sections: ['8.3'] },
];

// ---------------------------------------------------------------------------
// AC1: the new step names all 5 cards verbatim.
// ---------------------------------------------------------------------------

test('AC1: step 11 names all 5 Spatial Race Identity cards verbatim', () => {
  const body = stepText(readFile(PLAYTEST_PATH), 11);
  for (const card of CARDS) {
    assert.ok(body.includes(card.name), `expected step 11 to name "${card.name}"`);
  }
});

// ---------------------------------------------------------------------------
// AC2: each card's narrated Cost line matches its source file exactly.
// ---------------------------------------------------------------------------

test('AC2: step 11 cites each card\'s exact Cost line', () => {
  const body = stepText(readFile(PLAYTEST_PATH), 11);
  for (const card of CARDS) {
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(body),
      `expected step 11 to cite "${card.name}"'s Cost line "${card.cost}"`
    );
  }
});

test('AC2: each card\'s Cost line in its source file matches what step 11 narrates', () => {
  const wave1 = readFile(WAVE1_CARDS_PATH);
  const wave2 = readFile(WAVE2_CARDS_PATH);
  for (const card of CARDS) {
    const cardsContent = card.file === WAVE1_CARDS_PATH ? wave1 : wave2;
    const block = cardBlock(cardsContent, card.name);
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(block),
      `expected ${card.name}'s Cost line in its source file to read "${card.cost}"`
    );
    assert.ok(
      new RegExp(`Type line:\\s*${card.type}`).test(block),
      `expected ${card.name}'s Type line in its source file to start with "${card.type}"`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3 (held_out): step 11 cites the correct rules.md sections per card.
// ---------------------------------------------------------------------------

test('AC3: step 11 cites the correct rules.md section(s) for each card', () => {
  const body = stepText(readFile(PLAYTEST_PATH), 11);
  for (const card of CARDS) {
    for (const section of card.sections) {
      assert.ok(
        new RegExp(`Section ${section.replace('.', '\\.')}`).test(body),
        `expected step 11 to cite Section ${section} for ${card.name}`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// AC4: steps 1-10, Materials, and existing "What to watch for" bullets are
// unchanged; only additive changes were made (new step 11, renumbered
// 12/13, one new "What to watch for" bullet).
// ---------------------------------------------------------------------------

test('AC4: Materials section is unchanged', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(content.includes('## Materials'), 'expected "## Materials" heading to still exist');
  assert.ok(
    content.includes('Five small piles of counters (or a tally sheet), one pile per Fount'),
    'expected the Fount-piles Materials bullet to be unchanged'
  );
});

test('AC4: steps 1-10 are unchanged', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    stepText(content, 1).includes('Lay out the two starting Planets.'),
    'expected step 1 to be unchanged'
  );
  assert.ok(
    stepText(content, 6).includes('Take a Discovery action.'),
    'expected step 6 to be unchanged'
  );
  assert.ok(
    stepText(content, 8).includes(
      'Confirm aloud that a Wormhole with no such note may still be traversed either way, since no-Restriction is the default.'
    ),
    'expected step 8 to still end with its unchanged aloud confirmation'
  );
  assert.ok(
    stepText(content, 9).includes(
      'Confirm aloud that this line MAY NOT be redrawn — reconnecting those same two Planets later would require paying for a brand-new Discovery action from scratch.'
    ),
    'expected step 9 to still end with its unchanged aloud confirmation'
  );
  assert.ok(
    stepText(content, 10).includes('A Homeworld card MAY be Blockaded this way'),
    'expected step 10 to be unchanged'
  );
});

test('AC4: renumbered steps 12 and 13 carry the old step 11/12 content', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    stepText(content, 12).includes("Replay Section 8.7's worked example"),
    'expected renumbered step 12 to be the old worked-example replay step'
  );
  assert.ok(
    stepText(content, 13).includes('Play to a conclusion.'),
    'expected renumbered step 13 to be the old play-to-a-conclusion step'
  );
});

test('AC4: existing "What to watch for" bullets are unchanged and a new one was added', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    content.includes(
      "that's a signal Section 8.8's Map Setup rule isn't landing as written."
    ),
    'expected the step-2 "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    content.includes('That\'s the "aggression costs more" toll Section 8.3 states.'),
    'expected the step-6 "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    content.includes('materials should make the difference obvious at a glance.'),
    'expected the step-10 "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    /After step 11,.*signal this coverage gap existed/s.test(content),
    'expected a new "What to watch for" bullet referencing step 11 and the coverage gap'
  );
});

// ---------------------------------------------------------------------------
// AC5: site/design/playtest-spatial.html is regenerated and contains the
// same 5 card names.
// ---------------------------------------------------------------------------

test('AC5: node tools/build-site.js regenerates playtest-spatial.html with all 5 card names', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
  const html = readFile(SITE_HTML_PATH);
  for (const card of CARDS) {
    assert.ok(html.includes(card.name), `expected site/design/playtest-spatial.html to contain "${card.name}"`);
  }
});
