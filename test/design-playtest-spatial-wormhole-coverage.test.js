'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const PLAYTEST_PATH = path.join(REPO_ROOT, 'design', 'playtest-spatial.md');
const RESTRICTIONS_CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'wormhole-restrictions-set.md');
const CLOSURE_CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'wormhole-closure-cards.md');
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

function step10() {
  return stepText(readFile(PLAYTEST_PATH), 10);
}

const RESTRICTION_CARDS = [
  { name: 'Conveyance Directive', cost: '2 Circuit' },
  { name: 'Rootbound Corridor', cost: '2 Bloom' },
  { name: 'Vector Interdiction', cost: '1 Signal' },
  { name: "Pilgrim's Right of Way", cost: '2 Tangle' },
];

const CLOSURE_CARDS = [
  { name: 'Bastion Seal Detachment', cost: '2 Mass' },
  { name: 'Withering Conduit Rot', cost: '2 Bloom' },
  { name: 'Severance Directive', cost: '1 Signal' },
  { name: 'Rite of the Sealed Tangle', cost: '2 Tangle' },
];

// ---------------------------------------------------------------------------
// AC1: step 10 names all 4 remaining Wormhole Restrictions Set cards by
// exact name and Cost line.
// ---------------------------------------------------------------------------

test('AC1: step 10 names all 4 remaining Wormhole Restrictions Set cards verbatim', () => {
  const body = step10();
  for (const card of RESTRICTION_CARDS) {
    assert.ok(body.includes(card.name), `expected step 10 to name "${card.name}"`);
  }
});

test('AC1: step 10 cites each remaining Restriction card\'s exact Cost line', () => {
  const body = step10();
  for (const card of RESTRICTION_CARDS) {
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(body),
      `expected step 10 to cite "${card.name}"'s Cost line "${card.cost}"`
    );
  }
});

test('AC1: each remaining Restriction card\'s Cost line in its source file matches what step 10 narrates', () => {
  const cards = readFile(RESTRICTIONS_CARDS_PATH);
  for (const card of RESTRICTION_CARDS) {
    const block = cardBlock(cards, card.name);
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(block),
      `expected ${card.name}'s Cost line in wormhole-restrictions-set.md to read "${card.cost}"`
    );
  }
});

// ---------------------------------------------------------------------------
// AC2: step 10 names all 4 remaining Wormhole Closure Cards cards by exact
// name and Cost line.
// ---------------------------------------------------------------------------

test('AC2: step 10 names all 4 remaining Wormhole Closure Cards cards verbatim', () => {
  const body = step10();
  for (const card of CLOSURE_CARDS) {
    assert.ok(body.includes(card.name), `expected step 10 to name "${card.name}"`);
  }
});

test('AC2: step 10 cites each remaining Closure card\'s exact Cost line', () => {
  const body = step10();
  for (const card of CLOSURE_CARDS) {
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(body),
      `expected step 10 to cite "${card.name}"'s Cost line "${card.cost}"`
    );
  }
});

test('AC2: each remaining Closure card\'s Cost line in its source file matches what step 10 narrates', () => {
  const cards = readFile(CLOSURE_CARDS_PATH);
  for (const card of CLOSURE_CARDS) {
    const block = cardBlock(cards, card.name);
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(block),
      `expected ${card.name}'s Cost line in wormhole-closure-cards.md to read "${card.cost}"`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3 (held_out): each of the 8 cards ties to a distinct physical action
// grounded in that card's own Rules text, not a bare repeat of step 8 or
// step 9's own action.
// ---------------------------------------------------------------------------

test('AC3: the 3 remaining Team-Restriction cards are tied to a Team Restriction note, distinct from step 8\'s one-way note', () => {
  const body = step10();
  for (const card of ['Rootbound Corridor', 'Vector Interdiction', "Pilgrim's Right of Way"]) {
    const idx = body.indexOf(card);
    assert.notStrictEqual(idx, -1, `expected step 10 to name "${card}"`);
    const nearby = body.slice(idx, idx + 500);
    assert.ok(
      /Team Restriction/.test(nearby),
      `expected ${card}'s narration to mention a Team Restriction, not a one-way note`
    );
  }
});

test('AC3: Conveyance Directive is tied to its own Generator ability, not just a bare one-way note', () => {
  const body = step10();
  const idx = body.indexOf('Conveyance Directive');
  assert.notStrictEqual(idx, -1, 'expected step 10 to name "Conveyance Directive"');
  const nearby = body.slice(idx, idx + 700);
  assert.ok(/one-way/.test(nearby), 'expected Conveyance Directive to still get a one-way note like step 8');
  assert.ok(
    /Generator/.test(nearby) && /Circuit Point/.test(nearby),
    'expected Conveyance Directive\'s narration to mention its own Generator/Circuit Point ability'
  );
});

test('AC3: each of the 4 remaining Closure cards is tied to a distinct card-specific detail, not identical boilerplate', () => {
  const body = step10();
  const distinguishers = {
    'Bastion Seal Detachment': /Combat strength/,
    'Withering Conduit Rot': /no Permanent tag/,
    'Severance Directive': /Fast/,
    'Rite of the Sealed Tangle': /five races/,
  };
  for (const [card, distinguisher] of Object.entries(distinguishers)) {
    const idx = body.indexOf(card);
    assert.notStrictEqual(idx, -1, `expected step 10 to name "${card}"`);
    const nearby = body.slice(idx, idx + 700);
    assert.ok(
      distinguisher.test(nearby),
      `expected ${card}'s narration to include a detail distinct from the other Closure cards' narration`
    );
  }
});

// ---------------------------------------------------------------------------
// AC4: Steps 1-9 and (the content that used to be) Step 11 are unchanged;
// Materials and "What to watch for" are unchanged; steps renumbered by
// this unit's insertion carry the expected old content.
// ---------------------------------------------------------------------------

test('AC4: steps 1-9 are unchanged', () => {
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
    stepText(content, 8).includes('Bastion Lockdown Line') &&
      stepText(content, 8).includes(
        'Confirm aloud that a Wormhole with no such note may still be traversed either way, since no-Restriction is the default.'
      ),
    'expected step 8 to still narrate only Bastion Lockdown Line, unchanged'
  );
  assert.ok(
    stepText(content, 9).includes('Chokepoint Demolition Charge') &&
      stepText(content, 9).includes(
        'Confirm aloud that this line MAY NOT be redrawn — reconnecting those same two Planets later would require paying for a brand-new Discovery action from scratch.'
      ),
    'expected step 9 to still narrate only Chokepoint Demolition Charge, unchanged'
  );
});

test('AC4: renumbered step 11 carries the old step 10 Assault content, unchanged', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    stepText(content, 11).includes('Take an Assault action.') &&
      stepText(content, 11).includes('A Homeworld card MAY be Blockaded this way'),
    'expected renumbered step 11 to be the old Assault step, unchanged'
  );
});

test('AC4: renumbered step 12 carries the old step 11 Spatial Race Identity content, unchanged', () => {
  const content = readFile(PLAYTEST_PATH);
  const body = stepText(content, 12);
  assert.ok(
    body.includes('Narrate the Spatial Race Identity cards on this same graph.'),
    'expected renumbered step 12 to be the old Spatial Race Identity step'
  );
  assert.ok(
    body.includes('Revisit the physical state already on the table from steps 6, 8, 9, and 10'),
    'expected step 12\'s body text to be byte-for-byte unchanged, including its now-stale "step 10" reference'
  );
});

test('AC4: renumbered steps 13 and 14 carry the old steps 12/13 content', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    stepText(content, 13).includes("Replay Section 8.7's worked example"),
    'expected renumbered step 13 to be the old worked-example replay step'
  );
  assert.ok(
    stepText(content, 14).includes('Play to a conclusion.'),
    'expected renumbered step 14 to be the old play-to-a-conclusion step'
  );
});

test('AC4: Materials section is unchanged', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(content.includes('## Materials'), 'expected "## Materials" heading to still exist');
  assert.ok(
    content.includes('Five small piles of counters (or a tally sheet), one pile per Fount'),
    'expected the Fount-piles Materials bullet to be unchanged'
  );
});

test('AC4: "What to watch for" section is unchanged (no new bullet added)', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    content.includes("that's a signal Section 8.8's Map Setup rule isn't landing as written."),
    'expected the step-2 "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    content.includes('materials should make the difference obvious at a glance.'),
    'expected the step-10-referencing "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    /After step 11,.*signal this coverage gap existed/s.test(content),
    'expected the step-11-referencing "What to watch for" bullet to be unchanged'
  );
});

// ---------------------------------------------------------------------------
// AC5: site/design/playtest-spatial.html is regenerated via
// tools/build-site.js and contains all 8 newly narrated card names.
// ---------------------------------------------------------------------------

test('AC5: node tools/build-site.js regenerates playtest-spatial.html with all 8 newly narrated card names', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
  // The site generator HTML-escapes apostrophes (&#39;), so card names like
  // "Pilgrim's Right of Way" never appear literally — unescape before matching.
  const html = readFile(SITE_HTML_PATH).replace(/&#39;|&apos;/g, "'");
  for (const card of [...RESTRICTION_CARDS, ...CLOSURE_CARDS]) {
    assert.ok(html.includes(card.name), `expected site/design/playtest-spatial.html to contain "${card.name}"`);
  }
});
