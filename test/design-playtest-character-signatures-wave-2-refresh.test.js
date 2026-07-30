'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections, findSection, sectionText, normalizeProse } = require('./helpers/markdown');
const { loadCardsFromFile } = require('../lib/parse-card-markdown');

const REPO_ROOT = path.join(__dirname, '..');
const DOC_PATH = path.join(REPO_ROOT, 'design', 'playtest-full-game.md');
const WAVE2_CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'character-signatures-wave-2.md');
const SITE_HTML_PATH = path.join(REPO_ROOT, 'site', 'design', 'playtest-full-game.html');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');

const WAVE2_CARD_NAMES = [
  'Torel Ashgrave, Line-Captain of the Ember Vanguard',
  'Rathe Ossuary-Kin, Spore-Hound of the Sprawl',
  'Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive',
  'Ysolde Thane, Pilgrim of the Unwritten Sign',
  'Foreman-Prime Yssa Ductile, Keeper of the First Pattern',
];

function readDoc() {
  assert.ok(fs.existsSync(DOC_PATH), `expected ${DOC_PATH} to exist`);
  return fs.readFileSync(DOC_PATH, 'utf8');
}

function docSections() {
  return parseSections(readDoc());
}

function wave2Cards() {
  const cards = loadCardsFromFile(WAVE2_CARDS_PATH);
  assert.strictEqual(cards.length, 5, 'expected exactly 5 cards in character-signatures-wave-2.md');
  return cards;
}

function workedExample4Text() {
  const sections = docSections();
  return sectionText(sections, /^Worked Example 4\b/);
}

// ---------------------------------------------------------------------------
// AC1: design/playtest-full-game.md contains a new 'Worked Example 4' section
// (following Worked Example 3) naming all 5 wave-2 cards verbatim.
// ---------------------------------------------------------------------------

test('AC1: a "Worked Example 4" section exists in design/playtest-full-game.md', () => {
  const text = workedExample4Text();
  assert.ok(text, 'expected a "Worked Example 4" subsection to exist');
});

test('AC1: "Worked Example 4" appears after "Worked Example 3" and before "What This Playtest Surfaced"', () => {
  const sections = docSections();
  const idx3 = findSection(sections, /^Worked Example 3\b/);
  const idx4 = findSection(sections, /^Worked Example 4\b/);
  const idxSurfaced = findSection(sections, /^What This Playtest Surfaced$/);
  assert.notStrictEqual(idx3, -1, 'expected "Worked Example 3" to still exist');
  assert.notStrictEqual(idx4, -1, 'expected "Worked Example 4" to exist');
  assert.notStrictEqual(idxSurfaced, -1, 'expected "What This Playtest Surfaced" to still exist');
  assert.ok(idx4 > idx3, 'expected "Worked Example 4" to come after "Worked Example 3"');
  assert.ok(idx4 < idxSurfaced, 'expected "Worked Example 4" to come before "What This Playtest Surfaced"');
});

test('AC1: "Worked Example 4" heading cites Sections 9.2-9.6, 4.2, and 3', () => {
  const sections = docSections();
  const idx4 = findSection(sections, /^Worked Example 4\b/);
  assert.notStrictEqual(idx4, -1, 'expected "Worked Example 4" to exist');
  const heading = sections[idx4].title;
  for (const citation of [
    'Section 9.2',
    'Section 9.3',
    'Section 9.4',
    'Section 9.5',
    'Section 9.6',
    'Section 4.2',
    'Section 3',
  ]) {
    assert.ok(heading.includes(citation), `expected the Worked Example 4 heading to cite ${citation}, got: "${heading}"`);
  }
});

test('AC1: "Worked Example 4" names all 5 wave-2 cards verbatim', () => {
  const text = workedExample4Text();
  assert.ok(text, 'expected a "Worked Example 4" subsection to exist');
  for (const name of WAVE2_CARD_NAMES) {
    assert.ok(text.includes(name), `expected Worked Example 4 to name "${name}" verbatim`);
  }
});

// ---------------------------------------------------------------------------
// AC2: each card's Cost line as narrated in the new section matches
// character-signatures-wave-2.md exactly.
// ---------------------------------------------------------------------------

test('AC2: each wave-2 card\'s Cost line in Worked Example 4 matches character-signatures-wave-2.md exactly', () => {
  const text = workedExample4Text();
  assert.ok(text, 'expected a "Worked Example 4" subsection to exist');
  const cards = wave2Cards();
  for (const card of cards) {
    assert.ok(
      text.includes(`Cost line: ${card.costLine}`),
      `expected Worked Example 4 to quote "Cost line: ${card.costLine}" verbatim for ${card.name}`
    );
  }
});

test('AC2: each wave-2 card\'s Type line in Worked Example 4 matches character-signatures-wave-2.md exactly', () => {
  const text = workedExample4Text();
  assert.ok(text, 'expected a "Worked Example 4" subsection to exist');
  const cards = wave2Cards();
  for (const card of cards) {
    assert.ok(
      text.includes(`Type line: ${card.typeLine}`),
      `expected Worked Example 4 to quote "Type line: ${card.typeLine}" verbatim for ${card.name}`
    );
  }
});

test('AC2: the specific expected Cost lines are exactly as specified', () => {
  const text = workedExample4Text();
  assert.ok(text, 'expected a "Worked Example 4" subsection to exist');
  const expected = {
    'Torel Ashgrave, Line-Captain of the Ember Vanguard': '2 Mass',
    'Rathe Ossuary-Kin, Spore-Hound of the Sprawl': '3 Bloom',
    'Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive': '2 Signal',
    'Ysolde Thane, Pilgrim of the Unwritten Sign': '2 Tangle',
    'Foreman-Prime Yssa Ductile, Keeper of the First Pattern': '4 Circuit',
  };
  for (const [name, costLine] of Object.entries(expected)) {
    assert.ok(text.includes(name), `expected Worked Example 4 to name "${name}"`);
    assert.ok(
      text.includes(`Cost line: ${costLine}`),
      `expected Worked Example 4 to quote "Cost line: ${costLine}" for ${name}`
    );
  }
});

// ---------------------------------------------------------------------------
// AC4: Step 1's two decklists, Section 11's copy-count discussion, and the
// existing text of Worked Examples 1, 2, and 3 are all present unchanged
// (only additive: the new Worked Example 4 section).
// ---------------------------------------------------------------------------

const EXPECTED_WORKED_EXAMPLE_1_BODY = `
Suppose, hypothetically, Ada controlled a Ready \`Line-Fleet Trooper\` (combat strength 3)
and Kestrel controlled two Ready Units: a \`Drone Cascade\` (combat strength 3) and a
\`Unit 0-Prime "Cast-Aside", the First Flaw\` (combat strength 3).

- Ada declares \`Line-Fleet Trooper\` as an attacker; it becomes Spent. Kestrel declares both
  \`Drone Cascade\` and \`Unit 0-Prime "Cast-Aside", the First Flaw\` as blockers against it
  (Section 5.4).
- Because it is blocked, \`Line-Fleet Trooper\` deals its combat strength as damage to its
  blockers instead of Kestrel's Core Integrity (Section 12.1). Ada, the active player,
  chooses the assignment: all 3 damage to \`Drone Cascade\` (Section 12.2).
- \`Drone Cascade\` has 3 damage marked against it, equal to its own combat strength, so it
  is destroyed and moved to Kestrel's Wreck (Section 12.3).
  \`Unit 0-Prime "Cast-Aside", the First Flaw\` takes none.
- Both of Kestrel's blockers also deal their combat strength to \`Line-Fleet Trooper\` at
  the same time (Section 12.1): 3 from each, 6 total. Its combat strength is 3, so 6
  damage destroys it too, moved to Ada's Wreck (Section 12.3).
`;

const EXPECTED_WORKED_EXAMPLE_2_BODY = `
Suppose, hypothetically, Ada had built a second \`Salvage-Wrought Bastion\` on Cindral Drift
(the Planet discovered in step 13), and Kestrel had somehow amassed enough Fount Points in
a single turn to reach it.

- Kestrel takes an Assault action against Cindral Drift, along a qualifying path from a
  Planet she controls, paying Fount Points equal to the summed Length of that path
  (Section 8.6), and chooses to Blockade. Cindral Drift is now Blockaded: starting with
  Ada's next Generation Phase, its \`Salvage-Wrought Bastion\` stops producing Fount Points,
  though it is not destroyed and Ada still controls the Planet.
- Ada does not clear the Blockade. On a later turn, Kestrel takes a second Assault along
  the same path, this time choosing Capture. Control of Cindral Drift passes to Kestrel
  immediately, and Ada's \`Salvage-Wrought Bastion\` there is destroyed, moved to her Wreck
  (Section 8.6).
`;

const EXPECTED_WORKED_EXAMPLE_3_BODY = `
Suppose, hypothetically, a third challenger, Bryn, built a Bloom deck instead of a Mass or
Circuit one, using the same one-time starting Fount Point allotment convention as Procedure
step 6: before her Turn 1, Bryn places 2 counters into her own Bloom pool, the cost of
\`Cradle-Root Colony\`, the Generator she intends to play first.

- **Turn 1, Main Phase.** Bryn plays \`Cradle-Root Colony\`, paying her 2 Bloom Points
  (Section 5.3). Because it is her first Generator, it MUST be built on her own Homeworld
  (Section 4.6, Section 8.2). It enters Ready with no counters, as its Stats/counters line
  states.
- **Bryn's next several turns.** Each Generation Phase, \`Cradle-Root Colony\` produces 1
  Bloom Point, added to Bryn's Bloom pool (Section 5.2, Section 4.2) — the same
  1-Fount-Point-per-turn baseline "What This Playtest Surfaced" below describes for a lone
  Generator. Nothing in her hand costs exactly 1 Bloom yet, so she passes her Main Phase on
  each of these turns, and Section 5.5 empties her Bloom pool again at each Dusk Phase.
- **A later turn.** Suppose, hypothetically — the same kind of unexplained one-turn Fount
  Point total Worked Example 2 above already supposes for Kestrel ("Kestrel had somehow
  amassed enough Fount Points in a single turn to reach it") — that by this turn Bryn's
  Bloom pool held 2 Bloom Points: \`Cradle-Root Colony\`'s usual 1 from that turn's Generation
  Phase (Section 5.2, Section 4.2), plus 1 more. In her Main Phase, she plays
  \`Feral Bloomcaller\`, paying both Bloom Points (Section 5.3). It enters Ready with no
  counters, combat strength 1, as its Stats/counters line states; every Biology card is a
  Unit (Section 9.5), so it may be declared as an attacker or blocker in a future Conflict
  Phase. (\`Rootbind Thicket\`, the other 2-Bloom Unit printed in *design/cards/alpha-set.md*,
  would reach this same state identically, just entering with three Growth counters and
  combat strength 0 instead of Feral Bloomcaller's no counters and combat strength 1.)
- **A later turn — Conflict Phase.** \`Feral Bloomcaller\` has not attacked, blocked, or used
  its Spent ability since being played, so it is still Ready. Bryn declares it as an
  attacker, naming the Planet she is attacking; it becomes Spent as she does (Section 5.4).

This plays the same chain "What This Playtest Surfaced" below found missing for the Bloom: a
Bloom Generator (\`Cradle-Root Colony\`) producing Bloom Points across successive Generation
Phases (Section 5.2, Section 4.2), enough Bloom Points reaching a single turn's pool to pay
for a printed Bloom Unit (Section 5.3), and that Unit reaching the Conflict Phase as a
declared attacker (Section 5.4) — the same reachability Combat, Discovery past Length 1, and
Capture all depend on, now real for the Bloom the way it was already real for the Mass.
`;

test('AC4: Worked Example 1\'s existing text is present unchanged', () => {
  const sections = docSections();
  const text = sectionText(sections, /^Worked Example 1\b/);
  assert.ok(text, 'expected "Worked Example 1" to still exist');
  assert.strictEqual(normalizeProse(text), normalizeProse(EXPECTED_WORKED_EXAMPLE_1_BODY));
});

test('AC4: Worked Example 2\'s existing text is present unchanged', () => {
  const sections = docSections();
  const text = sectionText(sections, /^Worked Example 2\b/);
  assert.ok(text, 'expected "Worked Example 2" to still exist');
  assert.strictEqual(normalizeProse(text), normalizeProse(EXPECTED_WORKED_EXAMPLE_2_BODY));
});

test('AC4: Worked Example 3\'s existing text is present unchanged', () => {
  const sections = docSections();
  const text = sectionText(sections, /^Worked Example 3\b/);
  assert.ok(text, 'expected "Worked Example 3" to still exist');
  assert.strictEqual(normalizeProse(text), normalizeProse(EXPECTED_WORKED_EXAMPLE_3_BODY));
});

const EXPECTED_STEP_1_TEXT = `
1. **Construct two legal 40-card decks (Section 11).** All 34 of the cards currently
   named across the four card files — alpha-set.md, frontier-set.md,
   character-signatures.md, and fount-economy-set.md — can now be paid for: every Fount
   (Mass, Bloom, Signal, Circuit, Tangle) has a Generator (Section 5.2), so no card below
   is uncastable. Build these two decks exactly as listed:

   **Deck A ("Ada")** — 40 cards:
   - 3x \`Salvage-Wrought Bastion\` (2 Mass, Materials — Permanent, Generator)
   - 3x \`Line-Fleet Trooper\` (3 Mass, Materials — Permanent, Unit, combat strength 3)
   - 3x \`Cinder-Forged Plating\` (1 Mass, Materials — Permanent)
   - 3x \`Kordelia Vess, Salvage-Marshal of the Cinder Yards\` (3 Mass, Materials —
     Permanent, Generator)
   - 3x \`Bastion Reclamation Crew\` (2 Mass, Materials — Permanent)
   - 3x \`Cradle-Root Colony\` (2 Bloom, Biology — Permanent, Generator)
   - 3x \`Feral Bloomcaller\` (2 Bloom)
   - 3x \`Rootbind Thicket\` (2 Bloom)
   - 3x \`Communion Waystone\` (1 Tangle, 1 Mass, Magic Materials — Permanent, Generator)
   - 3x \`Echo Recall\` (2 Tangle)
   - 3x \`Panoptic Relay Spire\` (1 Signal, 1 Circuit, Intelligence Technology —
     Permanent, Generator)
   - 3x \`Foreknowledge Cipher\` (2 Signal)
   - 3x \`Wrought-Bloom Graft\` (1 Mass, 1 Bloom)
   - 1x \`Mother-Thread Ilvex, First Voice of the Sprawl\` (4 Bloom)

   **Deck B ("Kestrel")** — 40 cards:
   - 3x \`Replicant Foundry Core\` (3 Circuit, Technology — Permanent, Generator)
   - 3x \`Firmware Sentinel\` (2 Circuit, Technology — Permanent)
   - 3x \`Drone Cascade\` (3 Circuit, Technology — Permanent, Unit, combat strength 3)
   - 3x \`Unit 0-Prime "Cast-Aside", the First Flaw\` (3 Circuit, Technology — Permanent,
     Unit, combat strength 3)
   - 3x \`Replication Beachhead\` (2 Circuit, Technology — Permanent, Generator)
   - 3x \`Panoptic Relay Spire\` (1 Signal, 1 Circuit, Intelligence Technology —
     Permanent, Generator)
   - 3x \`Signal-Wrought Prototype\` (1 Signal, 1 Circuit)
   - 3x \`Communion Waystone\` (1 Tangle, 1 Mass, Magic Materials — Permanent, Generator)
   - 3x \`Tangle-Forged Bolt\` (1 Tangle, 1 Mass)
   - 3x \`Wormhole Ledger\` (1 Signal)
   - 3x \`Rite of Unmaking\` (2 Tangle)
   - 3x \`Selin Vashti Corr, Whisper-Broker of the Glass Spires\` (2 Signal)
   - 3x \`Meridian Aule, Star-Read Oracle of the Tangle\` (2 Tangle)
   - 1x \`Whispered Contract\` (1 Signal)

   Check each deck against Section 11.1 (at least 40 cards: both are exactly 40) and
   Section 11.2 (no more than 3 copies of any one Name: confirmed above).
`;

function stepOneText(content) {
  const m = content.match(
    /\n1\.\s+\*\*Construct two legal 40-card decks[\s\S]*?(?=\n2\.\s+\*\*Lay out the two Homeworlds)/
  );
  assert.ok(m, 'expected to find numbered Step 1 (deck construction) up to Step 2');
  return m[0];
}

test('AC4: Step 1\'s two decklists and Section 11 copy-count discussion are present unchanged', () => {
  const step = stepOneText(readDoc());
  assert.strictEqual(normalizeProse(step), normalizeProse(EXPECTED_STEP_1_TEXT));
});

test('AC4: Worked Example 4 does not appear inside Step 1 or alter its card counts', () => {
  const step = stepOneText(readDoc());
  for (const name of WAVE2_CARD_NAMES) {
    assert.ok(!step.includes(name), `expected Step 1 to NOT name the wave-2 card "${name}"`);
  }
});

// ---------------------------------------------------------------------------
// AC5: site/design/playtest-full-game.html is regenerated from the updated
// markdown via tools/build-site.js and contains all 5 card names.
// ---------------------------------------------------------------------------

test('AC5: tools/build-site.js regenerates site/design/playtest-full-game.html to contain all 5 wave-2 card names', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
  assert.ok(fs.existsSync(SITE_HTML_PATH), `expected ${SITE_HTML_PATH} to exist after build`);
  const html = fs.readFileSync(SITE_HTML_PATH, 'utf8');
  for (const name of WAVE2_CARD_NAMES) {
    assert.ok(html.includes(name), `expected site/design/playtest-full-game.html to contain "${name}"`);
  }
});
