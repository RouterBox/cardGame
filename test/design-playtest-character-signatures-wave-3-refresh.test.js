'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { parseSections, findSection, sectionText, normalizeProse } = require('./helpers/markdown');
const { loadCardsFromFile } = require('../lib/parse-card-markdown');

const REPO_ROOT = path.join(__dirname, '..');
const DOC_PATH = path.join(REPO_ROOT, 'design', 'playtest-full-game.md');
const WAVE3_CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'character-signatures-wave-3.md');
const SITE_HTML_PATH = path.join(REPO_ROOT, 'site', 'design', 'playtest-full-game.html');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');

const WAVE3_CARD_NAMES = [
  'Bren Hollowmelt, the Cindergrown',
  'Vesk-Aduun, the Graft-Wearer',
  'Ilio Marn-Cassity, Contract-Broker of the Rewritten Clause',
  'Ossian Thale, Reclamation-Warden of the Standing Stones',
  'Replica-Sergeant Kess Ninefold, the Named Copy',
];

function readDoc() {
  assert.ok(fs.existsSync(DOC_PATH), `expected ${DOC_PATH} to exist`);
  return fs.readFileSync(DOC_PATH, 'utf8');
}

function docSections() {
  return parseSections(readDoc());
}

function wave3Cards() {
  const cards = loadCardsFromFile(WAVE3_CARDS_PATH);
  assert.strictEqual(cards.length, 5, 'expected exactly 5 cards in character-signatures-wave-3.md');
  return cards;
}

function workedExample5Text() {
  const sections = docSections();
  return sectionText(sections, /^Worked Example 5\b/);
}

// ---------------------------------------------------------------------------
// AC1: design/playtest-full-game.md contains a new 'Worked Example 5' section
// (following Worked Example 4, before "What This Playtest Surfaced") naming
// all 5 wave-3 cards verbatim.
// ---------------------------------------------------------------------------

test('AC1: a "Worked Example 5" section exists in design/playtest-full-game.md', () => {
  const text = workedExample5Text();
  assert.ok(text, 'expected a "Worked Example 5" subsection to exist');
});

test('AC1: "Worked Example 5" appears after "Worked Example 4" and before "What This Playtest Surfaced"', () => {
  const sections = docSections();
  const idx4 = findSection(sections, /^Worked Example 4\b/);
  const idx5 = findSection(sections, /^Worked Example 5\b/);
  const idxSurfaced = findSection(sections, /^What This Playtest Surfaced$/);
  assert.notStrictEqual(idx4, -1, 'expected "Worked Example 4" to still exist');
  assert.notStrictEqual(idx5, -1, 'expected "Worked Example 5" to exist');
  assert.notStrictEqual(idxSurfaced, -1, 'expected "What This Playtest Surfaced" to still exist');
  assert.ok(idx5 > idx4, 'expected "Worked Example 5" to come after "Worked Example 4"');
  assert.ok(idx5 < idxSurfaced, 'expected "Worked Example 5" to come before "What This Playtest Surfaced"');
});

test('AC1: "Worked Example 5" heading cites Sections 9.2-9.6, 4.2, and 3', () => {
  const sections = docSections();
  const idx5 = findSection(sections, /^Worked Example 5\b/);
  assert.notStrictEqual(idx5, -1, 'expected "Worked Example 5" to exist');
  const heading = sections[idx5].title;
  for (const citation of [
    'Section 9.2',
    'Section 9.3',
    'Section 9.4',
    'Section 9.5',
    'Section 9.6',
    'Section 4.2',
    'Section 3',
  ]) {
    assert.ok(heading.includes(citation), `expected the Worked Example 5 heading to cite ${citation}, got: "${heading}"`);
  }
});

test('AC2: "Worked Example 5" names all 5 wave-3 cards verbatim', () => {
  const text = workedExample5Text();
  assert.ok(text, 'expected a "Worked Example 5" subsection to exist');
  for (const name of WAVE3_CARD_NAMES) {
    assert.ok(text.includes(name), `expected Worked Example 5 to name "${name}" verbatim`);
  }
});

// ---------------------------------------------------------------------------
// AC3 (held_out): each card's Cost line and Type line as narrated in the new
// section match character-signatures-wave-3.md exactly.
// ---------------------------------------------------------------------------

test('AC3: each wave-3 card\'s Cost line in Worked Example 5 matches character-signatures-wave-3.md exactly', () => {
  const text = workedExample5Text();
  assert.ok(text, 'expected a "Worked Example 5" subsection to exist');
  const cards = wave3Cards();
  for (const card of cards) {
    assert.ok(
      text.includes(`Cost line: ${card.costLine}`),
      `expected Worked Example 5 to quote "Cost line: ${card.costLine}" verbatim for ${card.name}`
    );
  }
});

test('AC3: each wave-3 card\'s Type line in Worked Example 5 matches character-signatures-wave-3.md exactly', () => {
  const text = workedExample5Text();
  assert.ok(text, 'expected a "Worked Example 5" subsection to exist');
  const cards = wave3Cards();
  for (const card of cards) {
    assert.ok(
      text.includes(`Type line: ${card.typeLine}`),
      `expected Worked Example 5 to quote "Type line: ${card.typeLine}" verbatim for ${card.name}`
    );
  }
});

test('AC3: the specific expected Cost/Type lines are exactly as specified', () => {
  const text = workedExample5Text();
  assert.ok(text, 'expected a "Worked Example 5" subsection to exist');
  const expected = {
    'Bren Hollowmelt, the Cindergrown': { costLine: '3 Mass', typeLine: 'Materials — Permanent' },
    'Vesk-Aduun, the Graft-Wearer': { costLine: '3 Bloom', typeLine: 'Biology — Permanent' },
    'Ilio Marn-Cassity, Contract-Broker of the Rewritten Clause': { costLine: '2 Signal', typeLine: 'Intelligence' },
    'Ossian Thale, Reclamation-Warden of the Standing Stones': { costLine: '3 Tangle', typeLine: 'Magic' },
    'Replica-Sergeant Kess Ninefold, the Named Copy': { costLine: '2 Circuit', typeLine: 'Technology — Permanent' },
  };
  for (const [name, { costLine, typeLine }] of Object.entries(expected)) {
    assert.ok(text.includes(name), `expected Worked Example 5 to name "${name}"`);
    assert.ok(
      text.includes(`Cost line: ${costLine}`),
      `expected Worked Example 5 to quote "Cost line: ${costLine}" for ${name}`
    );
    assert.ok(
      text.includes(`Type line: ${typeLine}`),
      `expected Worked Example 5 to quote "Type line: ${typeLine}" for ${name}`
    );
  }
});

// ---------------------------------------------------------------------------
// AC4 (held_out): Worked Examples 1-4's existing text, Step 1's two decklists,
// Section 11's copy-count discussion, design/playtest-full-game-2.md,
// design/playtest-spatial.md, and character-signatures-wave-3.md are all
// byte-for-byte unchanged (only additive: the new Worked Example 5 section and
// the two small prose edits to this same file's own intro paragraphs).
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

const EXPECTED_WORKED_EXAMPLE_4_BODY = `
Suppose, hypothetically, each of the 5 named cards in *design/cards/character-signatures-wave-2.md*
— one per race, none of them in either Step 1 decklist above — were played once, and, where
its rules text carries a triggered or resolving ability, that ability fired once. Each
demonstration below reuses a challenger already established earlier in this document (Ada,
Kestrel, or Bryn from Worked Example 3) whose own deck already draws from that card's Fount,
and introduces two further hypothetical challengers, Vantis and Elowen, only where none of the
three already fits.

**Torel Ashgrave, Line-Captain of the Ember Vanguard (The Cindral Reach — Materials).**
Cost line: 2 Mass. Type line: Materials — Permanent.

- Suppose, hypothetically, Ada controlled a Ready \`Line-Fleet Trooper\` (combat strength 3, a
  Materials Unit) and played Torel Ashgrave, Line-Captain of the Ember Vanguard from her Hand
  in her Main Phase, paying 2 Mass (Section 5.3). Materials cards are permanent (Section 9.6),
  so it enters the Field as a Permanent, with combat strength 1 and no counters, exactly as
  its Stats/counters line states (Section 9.1).
- Torel Ashgrave, Line-Captain of the Ember Vanguard's rules text is a static ability, not a
  trigger: its combat strength is increased by 1 for each other Materials Unit its controller
  controls. With \`Line-Fleet Trooper\` — one other Materials Unit — on the Field, its combat
  strength is 1 (printed) + 1 = 2 for as long as Ada controls that other Materials Unit
  (Section 9.1, Section 9.6).

**Rathe Ossuary-Kin, Spore-Hound of the Sprawl (The Mireth Bloom — Biology).**
Cost line: 3 Bloom. Type line: Biology — Permanent.

- Suppose, hypothetically, continuing Worked Example 3's Bryn, that by a later turn her Bloom
  pool held 3 Bloom Points: \`Cradle-Root Colony\`'s usual 1 from that turn's Generation Phase
  (Section 5.2, Section 4.2), plus 2 more — the same kind of unexplained one-turn Fount Point
  total Worked Examples 2 and 3 above already suppose. In her Main Phase, Bryn plays
  Rathe Ossuary-Kin, Spore-Hound of the Sprawl, paying 3 Bloom (Section 5.3). Every Biology
  card is a Unit (Section 9.5), so it enters Ready with combat strength 2 and no counters, as
  its Stats/counters line states.
- Suppose, hypothetically, in a later Conflict Phase, Bryn's opponent declared a Ready
  \`Feral Bloomcaller\` (combat strength 1) as an attacker, and Bryn declared her Ready
  Rathe Ossuary-Kin, Spore-Hound of the Sprawl as a blocker against it (Section 5.4).
  Because it is blocked, \`Feral Bloomcaller\` deals its combat strength as damage to
  Rathe Ossuary-Kin, Spore-Hound of the Sprawl instead of Bryn's Core Integrity (Section
  12.1): 1 damage, less than its combat strength of 2, so it survives rather than being
  destroyed (Section 12.3). Being dealt that damage triggers its own rules text: place a
  Growth counter on it (Section 4.2). With one Growth counter, its combat strength becomes 2
  (printed) + 1 = 3 until that counter is removed.

**Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive (The Panoptic Concord — Intelligence).**
Cost line: 2 Signal. Type line: Intelligence.

- Suppose, hypothetically, a fourth challenger, Vantis, built a Signal deck and had 2 Signal
  Points in his pool. In his Main Phase, he plays
  Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive as a Fast card, paying 2
  Signal (Section 5.3). Intelligence cards are instant/sorcery-speed resolving (Section 9.4),
  so it is added to the Queue rather than entering the Field as a Permanent (Section 9.1).
- Once both challengers pass in succession,
  Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive resolves (Section 6):
  Vantis looks at the top card of his opponent's Archive — a zone neither challenger may
  otherwise look through (Section 3) — then puts it back on top, exactly as its rules text
  states. It then moves to Vantis's Wreck, having resolved once (Section 9.1).

**Ysolde Thane, Pilgrim of the Unwritten Sign (The Starweave Communion — Magic).**
Cost line: 2 Tangle. Type line: Magic.

- Suppose, hypothetically, a fifth challenger, Elowen, built a Tangle deck and had 2 Tangle
  Points in her pool. In her Main Phase, she plays Ysolde Thane, Pilgrim of the Unwritten Sign
  as a Fast card, paying 2 Tangle (Section 5.3). Magic cards are instant/sorcery-speed
  resolving (Section 9.2), so it is added to the Queue rather than entering the Field as a
  Permanent (Section 9.1).
- Once both challengers pass in succession, Ysolde Thane, Pilgrim of the Unwritten Sign
  resolves (Section 6): Elowen looks at the top card of her own Archive (Section 3) and
  chooses to put it into her Hand instead of leaving it on top, exactly as its rules text
  states. It then moves to Elowen's Wreck, having resolved once (Section 9.1).

**Foreman-Prime Yssa Ductile, Keeper of the First Pattern (The Wrought Assembly — Technology).**
Cost line: 4 Circuit. Type line: Technology — Permanent.

- Suppose, hypothetically, Kestrel's Circuit pool held 4 Circuit Points in a single turn and,
  in her Main Phase, she played Foreman-Prime Yssa Ductile, Keeper of the First Pattern,
  paying 4 Circuit (Section 5.3). Technology cards are permanent (Section 9.3), so it enters
  the Field as a Permanent.
- Foreman-Prime Yssa Ductile, Keeper of the First Pattern's rules text makes it a Generator
  attuned to the Circuit, the same relationship Section 4.4 already defines for any Circuit
  Generator. At the start of Kestrel's next Generation Phase, it produces 1 Circuit Point,
  added to Kestrel's Circuit resource pool (Section 5.2, Section 4.4), exactly as any other
  Circuit Generator's own printed ability would.

This plays all 5 of *design/cards/character-signatures-wave-2.md*'s named cards — one per race
— into a hypothetical game state at least once each, exactly the way Worked Examples 1-3 above
already do for cards drawn from the four other card files: each card's Cost line and Type line
are exactly as printed (Section 9.1), each card's Card Type governs whether it is a Permanent
or resolves once to the Wreck (Sections 9.2-9.6), and each card's own triggered or resolving
ability fires exactly as its rules text states — Rathe Ossuary-Kin, Spore-Hound of the
Sprawl's Growth counter (Section 4.2) and
Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive's and
Ysolde Thane, Pilgrim of the Unwritten Sign's Archive-reading abilities (Section 3) included.
This closes the one gap left in the design's own named cards: these 5, one per race, are fully
specified and legal, but until now had never appeared in any playtest procedure at all.
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

test('AC4: Worked Example 4\'s existing text is present unchanged', () => {
  const sections = docSections();
  const text = sectionText(sections, /^Worked Example 4\b/);
  assert.ok(text, 'expected "Worked Example 4" to still exist');
  assert.strictEqual(normalizeProse(text), normalizeProse(EXPECTED_WORKED_EXAMPLE_4_BODY));
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

test('AC4: Worked Example 5 does not appear inside Step 1 or alter its card counts', () => {
  const step = stepOneText(readDoc());
  for (const name of WAVE3_CARD_NAMES) {
    assert.ok(!step.includes(name), `expected Step 1 to NOT name the wave-3 card "${name}"`);
  }
});

// SHA-256 of the exact current bytes of the three files this unit must never touch.
// Computed from the repo as it stood before this unit's changes (2026-07-30).
const UNCHANGED_FILE_HASHES = {
  'design/playtest-full-game-2.md': 'cc541038dbeffba2d189b1476ddc4210a07bfcf5e59e09ae43f2de34f070c5ab',
  'design/playtest-spatial.md': '8b257e29913c1fd8a2eedf7cb313d9223d07230f2394f5b0ff28e5fa33a7419f',
  'design/cards/character-signatures-wave-3.md': '5edec40711919cc75cb4508742c5e7f501ad3c220ca4e35bca807eef893ecf6c',
};

test('AC4: design/playtest-full-game-2.md, design/playtest-spatial.md, and character-signatures-wave-3.md are byte-for-byte unchanged', () => {
  for (const [relPath, expectedHash] of Object.entries(UNCHANGED_FILE_HASHES)) {
    const absPath = path.join(REPO_ROOT, relPath);
    assert.ok(fs.existsSync(absPath), `expected ${absPath} to exist`);
    const buf = fs.readFileSync(absPath);
    const actualHash = crypto.createHash('sha256').update(buf).digest('hex');
    assert.strictEqual(actualHash, expectedHash, `expected ${relPath} to be byte-for-byte unchanged (sha256 mismatch)`);
  }
});

// ---------------------------------------------------------------------------
// AC5: site/design/playtest-full-game.html is regenerated from the updated
// markdown via tools/build-site.js and contains all 5 card names.
// ---------------------------------------------------------------------------

test('AC5: tools/build-site.js regenerates site/design/playtest-full-game.html to contain all 5 wave-3 card names', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
  assert.ok(fs.existsSync(SITE_HTML_PATH), `expected ${SITE_HTML_PATH} to exist after build`);
  const html = fs.readFileSync(SITE_HTML_PATH, 'utf8');
  for (const name of WAVE3_CARD_NAMES) {
    assert.ok(html.includes(name), `expected site/design/playtest-full-game.html to contain "${name}"`);
  }
});
