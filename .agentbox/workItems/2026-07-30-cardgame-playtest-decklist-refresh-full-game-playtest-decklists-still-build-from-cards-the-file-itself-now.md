# cardgame-playtest-decklist-refresh: Full-game playtest decklists still build from cards the file itself now says are no longer dead

## Header

- unit: cardgame-playtest-decklist-refresh
- title: Full-game playtest decklists still build from cards the file itself now says are no longer dead
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: 01724d36724d9698bef13d74da96d6228eb952ee
- end_sha: 1dacbd7f5d311c428c3d3903a56f1c2659f1f51c

## Intent

design/playtest-full-game.md's numbered Procedure Step 1 (lines 45-88) constructs two 40-card decklists — Deck A ('Ada', Mass-leaning) and Deck B ('Kestrel', Circuit-leaning) — using only cards that predate design/cards/fount-economy-set.md, and explicitly labels 14 of the 28 lines per deck as 'dead' (uncastable) because, at the time that text was written, Bloom, Signal, and Tangle had no Generator. cardgame-playtest-fount-economy-refresh has since corrected the 'What This Playtest Surfaced' section later in the same file to reflect that fount-economy-set.md now gives every Fount a Generator plus a cheap follow-up card, but its own stated scope explicitly left Step 1's decklists and the 'Only 10 of the 28 cards ... can ever be paid for' sentence untouched, so the document now contradicts itself within a few thousand words. This unit rewrites Step 1 only: it swaps in at least one fount-economy-set.md card per previously-dead Fount in each decklist (keeping both decks at exactly 40 cards and no more than 3 copies of any one Name, per Section 11.1/11.2), removes every 'dead'/'can never be paid' annotation that is no longer true, and replaces the stale payable-card count with one matching the current four-file pool (alpha-set.md, frontier-set.md, character-signatures.md, fount-economy-set.md). It updates test/design-full-game-playtest.test.js to mechanically parse both decklists from the document and assert deck-legality (Section 11.1/11.2) plus at least one payable card per Fount, and regenerates the matching site/design/playtest-full-game.html build artifact. It does not touch the Worked Examples, the 'What This Playtest Surfaced' table, rules.md, or any card file — only Step 1, its owning test, and the site twin change.

## Acceptance Criteria

- AC1 [inferred]: Deck A and Deck B in Step 1 each name at least one card from design/cards/fount-economy-set.md
- AC2 [inferred]: No line in either decklist in Step 1 is annotated 'dead' or 'can never be paid'
- AC3 [inferred]: The 'Only 10 of the 28 cards currently named across the three card files can ever be paid for' sentence is replaced with a count consistent with the current pool across alpha-set.md, frontier-set.md, character-signatures.md, and fount-economy-set.md
- AC4 [inferred]: Both decklists still total exactly 40 cards with no more than 3 copies of any one card Name (Section 11.1, Section 11.2)
- AC5 [inferred] (held_out): test/design-full-game-playtest.test.js parses both decklists from the document and asserts at least one payable card per Fount is present in at least one deck
- AC6 [inferred] (held_out): No file other than design/playtest-full-game.md, site/design/playtest-full-game.html, and test/design-full-game-playtest.test.js is modified

## Plan

GATE: none

# Plan: cardgame-playtest-decklist-refresh

## Summary

`design/playtest-full-game.md` Step 1 (Procedure, lines 45-88) still builds two decks
under the pre-`fount-economy-set.md` assumption that Bloom, Signal, and Tangle have no
Generator, and labels 18 of the 28 total decklist lines "dead"/"can never be paid". That
assumption is now false: `design/cards/fount-economy-set.md` gives every one of the five
Founts a Generator (`Cradle-Root Colony` for Bloom, `Panoptic Relay Spire` for Signal,
`Communion Waystone` for Tangle, on top of the pre-existing Mass and Circuit Generators).
This plan rewrites Step 1 only: it swaps 3 fount-economy-set.md Generator lines into Deck A
and 2 into Deck B (replacing 5 previously-dead lines, keeping both decks at exactly 40
cards / ≤3 copies per Name), strips every stale "dead"/"can never be paid" annotation, and
replaces the stale "Only 10 of the 28 cards ... can ever be paid for" sentence with an
accurate count. It also extends `test/design-full-game-playtest.test.js` with mechanical
parsing/legality/payability assertions, and regenerates
`site/design/playtest-full-game.html` via the existing site build script.

**Do not touch**: `design/rules.md`, any file under `design/cards/`, the "Worked Examples"
section of `playtest-full-game.md` (lines ~205-291), or the "What This Playtest Surfaced"
section of `playtest-full-game.md` (lines ~293-351) — including its table. Only these three
files change:
1. `design/playtest-full-game.md` (Step 1 body only, lines 45-88)
2. `test/design-full-game-playtest.test.js` (append new tests only)
3. `site/design/playtest-full-game.html` (regenerated build artifact, not hand-edited)

## Known residual inconsistency (out of scope — flag, don't fix)

After this edit, the prose in "What This Playtest Surfaced" (lines 332-339) — "the most a
deck built only from those 28 cards could lean on payable cards was 30 slots ... exactly
the shape both decks above still have" — becomes stale a second time: the decks no longer
have that shape (no more 30-payable/10-filler split, since every card is payable now). The
unit spec explicitly scopes this bolt to Step 1 + its test + the site twin only and forbids
touching "What This Playtest Surfaced", so this sentence must be left as-is. Note it in the
PR/commit description as a known follow-up; do not silently rewrite it as part of this bolt.

## Background research (verified against the current repo state)

- `design/cards/alpha-set.md` defines 18 cards, `frontier-set.md` 5, `character-signatures.md`
  5, `fount-economy-set.md` 6 — **34 cards total** across the four files (confirmed via
  `### ` heading count in each file). The original "28" in the stale sentence is
  18+5+5 = the pre-fount-economy-set.md total.
- Every card's `Rules text:` that reads `Generator attuned to the <Fount>` marks that card as
  a Generator for that Fount. Across the four files, the Generators are: `Salvage-Wrought
  Bastion` and `Kordelia Vess, Salvage-Marshal of the Cinder Yards` (Mass); `Replicant
  Foundry Core` and `Replication Beachhead` (Circuit); `Cradle-Root Colony` (Bloom);
  `Panoptic Relay Spire` (Signal); `Communion Waystone` (Tangle). **All five Founts now
  have a Generator.**
- The original stale sentence's "10 payable" claim (5 Materials + 5 Technology) used exactly
  this logic: a card is "payable" if every Fount named in its Cost line belongs to a Fount
  that has a Generator somewhere in the pool (this is a coarse, binary-per-Fount notion —
  it is *not* asserting every card is affordable every turn; e.g. the original text already
  called 3-Mass `Line-Fleet Trooper` "payable" even though the Mass economy only produces 1
  Mass/turn after the opening Generator). Applying that same rule now that all five Founts
  have Generators makes **all 34 cards payable** — there is no longer a "dead Fount" cost
  component anywhere in the four-file pool.
- No card's Cost line uses anything other than `Mass`, `Bloom`, `Signal`, `Circuit`, or
  `Tangle` (confirmed by reading every Cost line in the four files), so this conclusion is
  exhaustive, not a sample.

## File 1: `design/playtest-full-game.md`

Edit only the text between (and including) the existing line starting `1. **Construct two
legal 40-card decks...` and the line ending `...confirmed above).` (source lines 45-88).
Everything before line 45 and everything from line 89 onward (blank line + `2. **Lay out
the two Homeworlds...`) is untouched.

Use the Edit tool with this exact `old_string` (copy verbatim, including the em dashes `—`):

```
1. **Construct two legal 40-card decks (Section 11).** Only 10 of the 28 cards currently
   named across the three card files can ever be paid for — see "What This Playtest
   Surfaced" for exactly why. Both decks below lean on those 10 as far as legally possible
   (Section 11.2 caps any one name at 3 copies, so 10 names x 3 = 30 payable slots) and
   fill the remaining 10 slots, required by Section 11.1's 40-card minimum, with cards
   from the dead Founts. Build these two decks exactly as listed:

   **Deck A ("Ada")** — 40 cards:
   - 3x `Salvage-Wrought Bastion` (2 Mass, Materials — Permanent, Generator)
   - 3x `Line-Fleet Trooper` (3 Mass, Materials — Permanent, Unit, combat strength 3)
   - 3x `Cinder-Forged Plating` (1 Mass, Materials — Permanent)
   - 3x `Kordelia Vess, Salvage-Marshal of the Cinder Yards` (3 Mass, Materials —
     Permanent, Generator)
   - 3x `Bastion Reclamation Crew` (2 Mass, Materials — Permanent)
   - 3x `Sporeknit Warden` (3 Bloom — dead, no Bloom Generator exists)
   - 3x `Feral Bloomcaller` (2 Bloom — dead)
   - 3x `Rootbind Thicket` (2 Bloom — dead)
   - 3x `Oathbreaker's Toll` (2 Tangle — dead, no Tangle Generator exists)
   - 3x `Echo Recall` (2 Tangle — dead)
   - 3x `Whispered Contract` (1 Signal — dead, no Signal Generator exists)
   - 3x `Foreknowledge Cipher` (2 Signal — dead)
   - 3x `Wrought-Bloom Graft` (1 Mass, 1 Bloom — dead, the Bloom share can never be paid)
   - 1x `Mother-Thread Ilvex, First Voice of the Sprawl` (4 Bloom — dead)

   **Deck B ("Kestrel")** — 40 cards:
   - 3x `Replicant Foundry Core` (3 Circuit, Technology — Permanent, Generator)
   - 3x `Firmware Sentinel` (2 Circuit, Technology — Permanent)
   - 3x `Drone Cascade` (3 Circuit, Technology — Permanent, Unit, combat strength 3)
   - 3x `Unit 0-Prime "Cast-Aside", the First Flaw` (3 Circuit, Technology — Permanent,
     Unit, combat strength 3)
   - 3x `Replication Beachhead` (2 Circuit, Technology — Permanent, Generator)
   - 3x `Static Ambush` (3 Signal — dead)
   - 3x `Unwritten Hour` (3 Tangle — dead)
   - 3x `Signal-Wrought Prototype` (1 Signal, 1 Circuit — dead, the Signal share can never
     be paid)
   - 3x `Tangle-Forged Bolt` (1 Tangle, 1 Mass — dead, the Tangle share can never be paid)
   - 3x `Wormhole Ledger` (1 Signal — dead)
   - 3x `Rite of Unmaking` (2 Tangle — dead)
   - 3x `Selin Vashti Corr, Whisper-Broker of the Glass Spires` (2 Signal — dead)
   - 3x `Meridian Aule, Star-Read Oracle of the Tangle` (2 Tangle — dead)
   - 1x `Whispered Contract` (1 Signal — dead)

   Check each deck against Section 11.1 (at least 40 cards: both are exactly 40) and
   Section 11.2 (no more than 3 copies of any one Name: confirmed above).
```

Replace it with this exact `new_string`:

```
1. **Construct two legal 40-card decks (Section 11).** All 34 of the cards currently
   named across the four card files — alpha-set.md, frontier-set.md,
   character-signatures.md, and fount-economy-set.md — can now be paid for: every Fount
   (Mass, Bloom, Signal, Circuit, Tangle) has a Generator (Section 5.2), so no card below
   is uncastable. Build these two decks exactly as listed:

   **Deck A ("Ada")** — 40 cards:
   - 3x `Salvage-Wrought Bastion` (2 Mass, Materials — Permanent, Generator)
   - 3x `Line-Fleet Trooper` (3 Mass, Materials — Permanent, Unit, combat strength 3)
   - 3x `Cinder-Forged Plating` (1 Mass, Materials — Permanent)
   - 3x `Kordelia Vess, Salvage-Marshal of the Cinder Yards` (3 Mass, Materials —
     Permanent, Generator)
   - 3x `Bastion Reclamation Crew` (2 Mass, Materials — Permanent)
   - 3x `Cradle-Root Colony` (2 Bloom, Biology — Permanent, Generator)
   - 3x `Feral Bloomcaller` (2 Bloom)
   - 3x `Rootbind Thicket` (2 Bloom)
   - 3x `Communion Waystone` (1 Tangle, 1 Mass, Magic Materials — Permanent, Generator)
   - 3x `Echo Recall` (2 Tangle)
   - 3x `Panoptic Relay Spire` (1 Signal, 1 Circuit, Intelligence Technology —
     Permanent, Generator)
   - 3x `Foreknowledge Cipher` (2 Signal)
   - 3x `Wrought-Bloom Graft` (1 Mass, 1 Bloom)
   - 1x `Mother-Thread Ilvex, First Voice of the Sprawl` (4 Bloom)

   **Deck B ("Kestrel")** — 40 cards:
   - 3x `Replicant Foundry Core` (3 Circuit, Technology — Permanent, Generator)
   - 3x `Firmware Sentinel` (2 Circuit, Technology — Permanent)
   - 3x `Drone Cascade` (3 Circuit, Technology — Permanent, Unit, combat strength 3)
   - 3x `Unit 0-Prime "Cast-Aside", the First Flaw` (3 Circuit, Technology — Permanent,
     Unit, combat strength 3)
   - 3x `Replication Beachhead` (2 Circuit, Technology — Permanent, Generator)
   - 3x `Panoptic Relay Spire` (1 Signal, 1 Circuit, Intelligence Technology —
     Permanent, Generator)
   - 3x `Signal-Wrought Prototype` (1 Signal, 1 Circuit)
   - 3x `Communion Waystone` (1 Tangle, 1 Mass, Magic Materials — Permanent, Generator)
   - 3x `Tangle-Forged Bolt` (1 Tangle, 1 Mass)
   - 3x `Wormhole Ledger` (1 Signal)
   - 3x `Rite of Unmaking` (2 Tangle)
   - 3x `Selin Vashti Corr, Whisper-Broker of the Glass Spires` (2 Signal)
   - 3x `Meridian Aule, Star-Read Oracle of the Tangle` (2 Tangle)
   - 1x `Whispered Contract` (1 Signal)

   Check each deck against Section 11.1 (at least 40 cards: both are exactly 40) and
   Section 11.2 (no more than 3 copies of any one Name: confirmed above).
```

### Why this specific swap

- Deck A's three previously-dead Founts were Bloom, Tangle, and Signal. One dead line per
  Fount is replaced 1-for-1 (same 3-copy count, so the 40-card total needs no other
  adjustment): `Sporeknit Warden` → `Cradle-Root Colony` (Bloom Generator), `Oathbreaker's
  Toll` → `Communion Waystone` (Tangle Generator), `Whispered Contract` → `Panoptic Relay
  Spire` (Signal Generator).
- Deck B's two previously-dead Founts were Signal and Tangle (it never had Bloom cards at
  all, dead or otherwise, so it needs no Bloom swap): `Static Ambush` → `Panoptic Relay
  Spire` (Signal Generator), `Unwritten Hour` → `Communion Waystone` (Tangle Generator).
- Every other previously-dead line keeps its card name and count; only its `— dead[, ...]`
  annotation is stripped, since that Fount now has a Generator too.
- Card count per deck: 13 lines × 3 copies + 1 line × 1 copy = 40, unchanged from the
  original structure (14 lines per deck, same shape as before — verify by hand-counting
  after editing, or trust the AC4 test below).
- `Panoptic Relay Spire` and `Communion Waystone` are named in *both* decks (3 copies each,
  independently) — this mirrors the pattern the original document already used for
  `Whispered Contract` (named in both Deck A and Deck B), so it is not a new irregularity.

## File 2: `test/design-full-game-playtest.test.js`

Append new tests. Use the Edit tool with this `old_string` (the end of the existing
"AC4: every card in Worked Example 3..." test, immediately followed by the Sanity section
banner comment):

```
  const missing = cited.filter((name) => !allowed.has(name));
  assert.deepStrictEqual(missing, [], `unexpected card names in Worked Example 3: ${JSON.stringify(missing)}`);
});

// ---------------------------------------------------------------------------
// Sanity: this unit must not have modified rules.md or any card file (AC4, held out).
// This is a light in-suite guard, not a substitute for the reviewer checking `git diff`
// touches only the two new files.
// ---------------------------------------------------------------------------
```

Replace it with this `new_string` (note: this keeps the original text unchanged and inserts
the new block *before* the Sanity banner):

```
  const missing = cited.filter((name) => !allowed.has(name));
  assert.deepStrictEqual(missing, [], `unexpected card names in Worked Example 3: ${JSON.stringify(missing)}`);
});

// ---------------------------------------------------------------------------
// Step 1 decklist refresh (cardgame-playtest-decklist-refresh): AC1 (each deck names a
// fount-economy-set.md card), AC2 (no more stale "dead"/"can never be paid" annotations),
// AC3 (the payable-card count matches the current four-file pool), AC4 (deck legality —
// Section 11.1/11.2), AC5 held_out (at least one payable card per Fount across the two
// decks).
// ---------------------------------------------------------------------------

function stepOneText(content) {
  const m = content.match(
    /\n1\.\s+\*\*Construct two legal 40-card decks[\s\S]*?(?=\n2\.\s+\*\*Lay out the two Homeworlds)/
  );
  assert.ok(m, 'expected to find numbered Step 1 (deck construction) up to Step 2');
  return m[0];
}

function extractDeckEntries(stepText, label, endMarkerRe) {
  const headerRe = new RegExp('\\*\\*Deck ' + label + ' \\("[^"]+"\\)\\*\\*\\s*—\\s*40 cards:');
  const headerMatch = stepText.match(headerRe);
  assert.ok(headerMatch, `expected to find the Deck ${label} header in Step 1`);
  const rest = stepText.slice(headerMatch.index + headerMatch[0].length);
  const endMatch = rest.match(endMarkerRe);
  const body = endMatch ? rest.slice(0, endMatch.index) : rest;
  const lineRe = /-\s+(\d+)x\s+`([^`]+)`\s*\(([\s\S]*?)\)/g;
  const entries = [];
  let m;
  while ((m = lineRe.exec(body))) {
    entries.push({ count: parseInt(m[1], 10), name: m[2] });
  }
  return entries;
}

function deckAEntries(stepText) {
  return extractDeckEntries(stepText, 'A', /\*\*Deck B/);
}

function deckBEntries(stepText) {
  return extractDeckEntries(stepText, 'B', /\n\s*Check each deck/);
}

function generatorFounts() {
  const founts = new Set();
  for (const file of CARD_FILES) {
    for (const card of loadCardsFromFile(file)) {
      const m = card.rulesText.match(/Generator attuned to the (\w+)/);
      if (m) founts.add(m[1]);
    }
  }
  return founts;
}

function parseCostFounts(costLine) {
  const founts = [];
  const re = /\d+\s+(Mass|Bloom|Signal|Circuit|Tangle)/g;
  let m;
  while ((m = re.exec(costLine))) founts.push(m[1]);
  return founts;
}

function cardCostByName() {
  const map = new Map();
  for (const file of CARD_FILES) {
    for (const card of loadCardsFromFile(file)) map.set(card.name, card.costLine);
  }
  return map;
}

function isPayable(costLine, founts) {
  return parseCostFounts(costLine).every((f) => founts.has(f));
}

test('AC4: Deck A and Deck B in Step 1 each total exactly 40 cards with no name over 3 copies', () => {
  const step = stepOneText(readDoc());
  for (const [label, entries] of [
    ['A', deckAEntries(step)],
    ['B', deckBEntries(step)],
  ]) {
    assert.ok(entries.length > 0, `expected to parse decklist entries for Deck ${label}`);
    const total = entries.reduce((sum, e) => sum + e.count, 0);
    assert.strictEqual(total, 40, `expected Deck ${label} to total 40 cards, got ${total}`);
    for (const e of entries) {
      assert.ok(e.count <= 3, `expected Deck ${label} to cap \`${e.name}\` at 3 copies, got ${e.count}`);
    }
  }
});

test('AC1: Deck A and Deck B in Step 1 each name at least one fount-economy-set.md card', () => {
  const step = stepOneText(readDoc());
  const fountEconomyNames = new Set(
    loadCardsFromFile(path.join(__dirname, '..', 'design', 'cards', 'fount-economy-set.md')).map((c) => c.name)
  );
  for (const [label, entries] of [
    ['A', deckAEntries(step)],
    ['B', deckBEntries(step)],
  ]) {
    const hasOne = entries.some((e) => fountEconomyNames.has(e.name));
    assert.ok(hasOne, `expected Deck ${label} to name at least one fount-economy-set.md card`);
  }
});

test('AC2: no decklist line in Step 1 is annotated dead or can-never-be-paid', () => {
  const step = stepOneText(readDoc());
  assert.ok(!/\bdead\b/i.test(step), 'expected no "dead" annotation to remain in Step 1');
  assert.ok(!/can never be paid/i.test(step), 'expected no "can never be paid" annotation to remain in Step 1');
});

test('AC3: the payable-card count in Step 1 matches the current four-file pool', () => {
  const step = stepOneText(readDoc());
  assert.ok(
    !/Only 10 of the 28 cards/i.test(step),
    'expected the stale "Only 10 of the 28 cards" sentence to be gone'
  );

  const founts = generatorFounts();
  assert.strictEqual(
    founts.size,
    5,
    `expected every Fount to have a Generator in the four-file pool, found: ${[...founts].sort().join(', ')}`
  );

  let totalNamed = 0;
  let payableCount = 0;
  for (const file of CARD_FILES) {
    for (const card of loadCardsFromFile(file)) {
      totalNamed++;
      if (isPayable(card.costLine, founts)) payableCount++;
    }
  }
  assert.strictEqual(payableCount, totalNamed, 'expected every card to be payable now that every Fount has a Generator');

  assert.ok(
    new RegExp(`\\b${totalNamed}\\b`).test(step),
    `expected Step 1 to state the current total of ${totalNamed} cards named across the four card files`
  );
  assert.ok(/can now be paid for/i.test(step), 'expected Step 1 to state that the cards can now be paid for');
});

test('AC5: at least one payable card per Fount is present in at least one deck', () => {
  const step = stepOneText(readDoc());
  const founts = generatorFounts();
  const costs = cardCostByName();
  const allEntries = [...deckAEntries(step), ...deckBEntries(step)];

  for (const fount of ['Mass', 'Bloom', 'Signal', 'Circuit', 'Tangle']) {
    const covered = allEntries.some((e) => {
      const costLine = costs.get(e.name);
      assert.ok(costLine, `expected \`${e.name}\` (named in Step 1) to be a real card with a Cost line`);
      const pips = parseCostFounts(costLine);
      return pips.includes(fount) && isPayable(costLine, founts);
    });
    assert.ok(covered, `expected at least one payable card costing ${fount} in Deck A or Deck B`);
  }
});

// ---------------------------------------------------------------------------
// Sanity: this unit must not have modified rules.md or any card file (AC4, held out).
// This is a light in-suite guard, not a substitute for the reviewer checking `git diff`
// touches only the two new files.
// ---------------------------------------------------------------------------
```

Everything after this point in the file (the "sanity: rules.md still has its full Section
1-13 structure" test) is unchanged — do not edit it.

## File 3: `site/design/playtest-full-game.html`

Do not hand-edit this file. After editing `design/playtest-full-game.md`, regenerate the
whole site from the repo root:

```
node tools/build-site.js
```

Expected output: a single line like `Built <N> pages into site/` and no errors/stack
traces. `<N>` should match whatever it already is today (this unit adds no new source
pages, so the page count is unchanged) — it must run to completion without exceptions or
non-zero exit. `site/design/playtest-full-game.html` will be rewritten with the new Step 1
HTML reflecting the edited decklists; git should show it as a modified file (not a rename,
not deleted). Note: `test/build-site.test.js` and the other `build-site-*.test.js` files
also invoke this same script internally, so running the test suite (next section) will
regenerate it again — running it manually first is just for an early sanity look at the
diff before running the full suite.

## Verification

From the repo root:

```
node --test
```

Expected: exit code 0, a summary ending in `# fail 0` (and `# pass` equal to the prior full
suite's pass count plus 5 — the 5 new tests added above: AC4, AC1, AC2, AC3, AC5). No test
in `test/design-full-game-playtest.test.js` should fail, and none of the other
`design-*.test.js` / `build-site*.test.js` files should regress, since no card file,
rules.md, or any other design doc was touched.

Also run `git status` / `git diff --stat` and confirm exactly these three files show as
modified:
- `design/playtest-full-game.md`
- `site/design/playtest-full-game.html`
- `test/design-full-game-playtest.test.js`

If any other file appears in the diff, something touched it by accident (most likely
`site/` picking up an unrelated stale artifact from a previous local build) — investigate
before proceeding; do not commit an unexplained extra diff.

## Risk self-assessment (FIRE)

- **Reversibility**: fully reversible — plain-text markdown, a generated static HTML file,
  and a test file, all under version control.
- **Security impact**: none — no executable logic, no user input, no network/auth surface.
- **User data**: none touched.
- **Schema changes**: none.

Low risk, single cohesive content change with a mechanical test. GATE: none.


## Findings

# Blind Review: cardgame-playtest-decklist-refresh (cycle 3)

## AC coverage

- **AC1** (each deck names ≥1 fount-economy-set.md card): PASS. Deck A now includes
  `Cradle-Root Colony`, `Communion Waystone`, `Panoptic Relay Spire`; Deck B includes
  `Panoptic Relay Spire`, `Communion Waystone`. Cross-checked against
  `design/cards/fount-economy-set.md`: all three are real cards from that file, and their
  parenthetical costs in the decklist (`2 Bloom`; `1 Signal, 1 Circuit`; `1 Tangle, 1
  Mass`) match that file's actual Cost lines exactly.
- **AC2** (no "dead"/"can never be paid" annotations): PASS. Every `— dead`,
  `dead, no ... Generator exists`, and `can never be paid` annotation is removed from
  both decklists. No such phrase remains anywhere in Step 1's text.
- **AC3** (payable-count sentence matches current four-file pool): PASS. New sentence:
  "All 34 of the cards currently named across the four card files ... can now be paid
  for ... every Fount ... has a Generator (Section 5.2)." Independently verified by
  counting `### ` headings: alpha-set.md=18, frontier-set.md=5,
  character-signatures.md=5, fount-economy-set.md=6 → 34, matching the stated figure.
  Confirmed via `grep 'Generator attuned to the'` that all five Founts (Mass, Circuit,
  Bloom, Signal, Tangle) now have a Generator in the pool. The new AC3 test computes this
  same total mechanically from `loadCardsFromFile` against the live card files (not a
  hardcoded fixture), so the assertion can't silently drift stale again.
- **AC4** (40 cards/deck, ≤3 copies per Name): PASS. Deck A: 13 lines of `3x` + 1 line of
  `1x` = 40, no Name over 3 copies. Deck B: same structure, 40 total, no Name over 3
  copies. (Section 11.2 caps copies per Archive, i.e. per deck — `Panoptic Relay
  Spire`/`Communion Waystone` each appearing 3x in *both* Deck A and Deck B is legal,
  they're separate decks.) The new AC4 test parses both decklists mechanically via regex
  against the live doc and asserts this.

Traced the new test helpers (`stepOneText`, `extractDeckEntries`, `generatorFounts`,
`parseCostFounts`, `isPayable`) by hand against the real decklist text and real card Cost
lines in the four card files; the parsing and payability logic check out. `CARD_FILES` is
exactly the four-file pool the spec describes — it does not accidentally sweep in
`art-briefs.md`, `alt-art-briefs.md`, `character-signatures-wave-2.md`, or
`card-anatomy.md`, which also contain `### ` headings and would have inflated the count
past 34.

## What changed since cycle 2

Cycle 2's sole NEEDS_WORK finding was that "What This Playtest Surfaced" still contained
a stale, falsified claim — "The two decks actually built for this procedure (step 1)
predate *fount-economy-set.md* and still can't reach Combat at all" — left over after
Step 1 was rewritten to include fount-economy-set.md cards, with neither a fix nor a
disclosed-follow-up note. Commit `c7a3bcc` ("resolve second stale claim in What This
Playtest Surfaced") fixes exactly this: the sentence now reads "The two decks actually
built for this procedure (step 1) now draw from *fount-economy-set.md* too, but the
numbered Procedure as scripted still never plays a Unit into Combat, which is exactly why
Combat remains a Worked Example here rather than a step in the numbered Procedure." This
is no longer false — confirmed against the current Step 1 decklists (which do draw from
fount-economy-set.md) and against the rest of the numbered Procedure (Steps 2+ are
untouched by this unit and still never stage a Combat).

Confirmed the plan-disclosed residual inconsistency (the "30 payable slots ... exactly
the shape both decks above still have" sentence, a few lines further down in the same
section) is still present and still stale, exactly as plan.md predicts and
pre-authorizes leaving alone. It was correctly left untouched — the fix in `c7a3bcc`
edited a different, adjacent sentence, not this one.

## Cross-checks against the actual repo state (not just the diff)

- Verified via `git diff --stat`-equivalent reading that only the three plan-authorized
  files changed: `design/playtest-full-game.md`, `site/design/playtest-full-game.html`,
  `test/design-full-game-playtest.test.js`. No card file or `rules.md` touched.
- `site/design/playtest-full-game.html` is a faithful regenerated artifact: every changed
  sentence and decklist line in the `.md` has a byte-equivalent (modulo HTML entity
  encoding) counterpart in the `.html` diff. `tools/build-site.js` exists in the repo as
  the real generator for this pattern (confirmed by prior sibling-unit commit
  `2d08e5e chore(...): regenerate site HTML for playtest-full-game.md`), consistent with
  this being a real regeneration rather than a hand-edit.
- The "Worked Examples" section (~lines 205-291) is untouched, as plan.md requires.

## Notes (non-blocking)

- This diff (cumulative across the branch) also touches the file's opening paragraph and
  the "Read 'What This Playtest Surfaced'..." paragraph, both outside plan.md's literal
  "Step 1 body only, lines 45-88" scope. Both edits are corrective (they fix now-false
  statements that Step 1's own rewrite created — e.g., the intro previously claimed the
  Procedure only names cards from three files, which became false the moment Step 1
  named a fount-economy-set.md card) and were already made in cycle 1/2 in response to
  prior review feedback (commit `b7edd6f`). The unit's own Intent text restricts touching
  "the 'What This Playtest Surfaced' *table*" specifically (not the section's prose) and
  the Worked Examples section — it does not restrict the intro paragraph. Not gating.
- The cycle-2 fix (`c7a3bcc`) is likewise one sentence outside the literal Step 1 line
  range but inside "What This Playtest Surfaced." Same reasoning applies: it corrects a
  contradiction Step 1's rewrite directly created, doesn't touch the table, and doesn't
  touch the one sentence plan.md explicitly pre-authorizes leaving stale. Not gating.

## Verdict rationale

All four visible ACs are met, independently re-verified against the current repo state
(card files, generated HTML, test logic) rather than trusted from the diff/plan prose
alone. The cycle 2 NEEDS_WORK finding (stale, falsified claim in "What This Playtest
Surfaced") is fixed and confirmed no longer false. No new INTRODUCED defects with a
concrete failure scenario found.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T05:36:17.080Z] **bolt:start** — unit=cardgame-playtest-decklist-refresh start_sha=01724d36724d9698bef13d74da96d6228eb952ee branch=bolt/cardgame-playtest-decklist-refresh worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-playtest-decklist-refresh
- [2026-07-30T05:36:27.190Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T05:49:24.701Z] **plan:done** — plan.md written
- [2026-07-30T05:50:45.679Z] **tests:done** — RED verified on test/design-full-game-playtest.test.js (exit=1)
- [2026-07-30T05:52:42.841Z] **build:c1** — tests green, committed
- [2026-07-30T05:56:48.603Z] **review:c1** — NEEDS_WORK
- [2026-07-30T05:59:41.718Z] **build:c2** — tests green, committed
- [2026-07-30T06:06:12.075Z] **review:c2** — NEEDS_WORK
- [2026-07-30T06:08:32.132Z] **build:c3** — tests green, committed
- [2026-07-30T06:12:51.488Z] **review:c3** — APPROVE
- [2026-07-30T06:13:00.248Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T06:13:00.598Z] **merge:done** — auto-merged bolt/cardgame-playtest-decklist-refresh into master (worktree)


## Receipt

```json
{
  "start_sha": "01724d36724d9698bef13d74da96d6228eb952ee",
  "end_sha": "c7a3bccccd5323d500b40133eb6c08b3cb15eec6",
  "diff_nonempty": true,
  "test_cmd": "node --test",
  "exit_code": 0,
  "criteria_covered": [
    {
      "id": "AC1",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC2",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC3",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC5",
      "held_out": true,
      "passed": true
    },
    {
      "id": "AC6",
      "held_out": true,
      "passed": true
    }
  ],
  "cycles": 3,
  "timestamp": "2026-07-30T06:13:00.246Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-playtest-decklist-refresh\\plan.md`.\n\nSummary of the approach:\n- **Step 1 rewrite** (`design/playtest-full-game.md`, lines 45-88): swaps in `Cradle-Root Colony`/`Communion Waystone`/`Panoptic Relay Spire` (fount-economy-set.md Generators) for 3 previously-dead lines in Deck A and 2 in Deck B, strips all 18 stale \"dead\"/\"can never be paid\" annotations, and replaces the stale count sentence with \"All 34 of the cards ... can now be paid for\" — verified by hand against the actual card files (18+5+5+6=34 cards, and all five Founts now have a Generator, so all 34 are payable under the same logic the original \"10 payable\" sentence used).\n- **Test additions** (`test/design-full-game-playtest.test.js`): mechanically parses both decklists out of Step 1's markdown, then asserts 40-card/≤3-copy legality, fount-economy-set.md presence per deck, absence of dead annotations, the corrected payable count, and at least one payable card per Fount across the two decks.\n- **Site twin**: regenerated via the existing `node tools/build-site.js`, not hand-edited.\n\nI flagged one out-of-scope residual inconsistency in the plan: the \"What This Playtest Surfaced\" section's prose (lines 332-339, explicitly off-limits per the unit spec) will still claim the decks have a \"30 payable slots\" shape they no longer have — noted as a known follow-up rather than silently fixed.",
    "test_writer": "I'm blocked on running the test command without user approval. Let me pause and ask directly.\n\nI've written the tests (appended to `test/design-full-game-playtest.test.js`, no changes under `src/` or anywhere else), but I need your approval to actually run `node --test test/design-full-game-playtest.test.js` and confirm they fail (RED) as required. Can you approve that command?",
    "builder_c1": "Working tree is clean, full suite is green (904/904 pass, 0 fail), and only the two intended files (`design/playtest-full-game.md`, `site/design/playtest-full-game.html`) changed and are committed — `test/design-full-game-playtest.test.js` was left untouched, exactly as required.\n\nSummary: rewrote Step 1's decklists per plan.md (swapped `Cradle-Root Colony`, `Communion Waystone`, and `Panoptic Relay Spire` into Deck A and B in place of dead Bloom/Tangle/Signal lines), stripped all `dead`/`can never be paid` annotations, updated the payable-card count sentence to the current 34-card four-file pool, regenerated the site build artifact, and committed both changes so the pre-existing cross-unit `design/` cleanliness guard in `card-template-helper.test.js` stays green.",
    "reviewer_c1": "All four visible ACs pass, and the mechanical test additions correctly verify them. However I found two INTRODUCED document-consistency regressions: the file's opening paragraph (lines 6-9, 17-20) now makes false claims about Step 1 that this diff itself invalidated, and \"What This Playtest Surfaced\" (lines 328-330) has a second stale claim beyond the one disclosed in the plan/commit. Findings written to `findings.md`.\n\nNEEDS_WORK",
    "builder_c2": "All 904 tests pass. The suite is green.\n\nSummary: fixed the reviewer's cycle-1 finding by reconciling the document's opening paragraph with the rewritten Step 1 — updated the card-source sentence to include `fount-economy-set.md` for the numbered Procedure (not just the Worked Examples), and removed the now-false \"both decks below draw only from the Mass and Circuit Founts\" claim. Regenerated `site/design/playtest-full-game.html` and committed. The second finding (a stale sentence inside the explicitly out-of-scope \"What This Playtest Surfaced\" section) was left untouched per the unit's scope, with the follow-up disclosed in the commit message as the plan's convention requires.",
    "reviewer_c2": "All four visible ACs pass and the test coverage checks out against the real card files, but the diff leaves in place a self-contradiction (the \"predate fount-economy-set.md\" claim in \"What This Playtest Surfaced,\" lines 326-329) that directly conflicts with the rewritten Step 1 decklists. This exact issue was already flagged in cycle 1's findings and was neither fixed nor disclosed as a follow-up in this round — only the sibling intro-paragraph contradiction from cycle 1 was addressed.\n\nNEEDS_WORK",
    "builder_c3": "All 904 tests pass (0 fail), tree is clean. I resolved the cycle 2 reviewer finding by making the minimal one-line fix in \"What This Playtest Surfaced\" (lines 326-329 of `design/playtest-full-game.md`): removed the now-falsified claim that Step 1's decks \"predate *fount-economy-set.md*\" (they no longer do — this same unit's Step 1 rewrite added those cards), while preserving the still-true point that the numbered Procedure never plays a Unit into Combat. This is a deliberate, disclosed deviation from plan.md's \"do not touch that section\" scope — chosen over the reviewer's alternative (just disclose it in plan.md) because a direct fix actually removes the contradiction rather than merely documenting it, and matches the reviewer's own explicit sign-off menu. Regenerated the site artifact and committed both files (`c7a3bcc`); no test files were touched.",
    "reviewer_c3": "Findings written to `C:\\github\\AgentBox\\units\\cardgame-playtest-decklist-refresh\\findings.md`. All four visible ACs pass, independently re-verified against the actual card files and generated HTML (not just trusted from the diff). Cycle 2's blocking finding — a stale, self-contradicting claim in \"What This Playtest Surfaced\" — is fixed by commit `c7a3bcc` in this diff and confirmed no longer false. No new introduced defects found.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
