# cardgame-playtest-fount-economy-refresh: Correct playtest-full-game.md's stale 'only Mass and Circuit are sustainable' finding now that fount-economy-set.md closed that exact gap, and add a worked Bloom-economy Combat example

## Header

- unit: cardgame-playtest-fount-economy-refresh
- title: Correct playtest-full-game.md's stale 'only Mass and Circuit are sustainable' finding now that fount-economy-set.md closed that exact gap, and add a worked Bloom-economy Combat example
- project: cardgame
- completed: 2026-07-29
- outcome: escalated
- start_sha: d7c27b9d85a6f2ba1af121d176aac0c094f9a359
- end_sha: 563e2eaee0d45132aeddccaf87444eccab7d1a44

## Intent

design/playtest-full-game.md's 'What This Playtest Surfaced' section (lines 249-288) documents a real limitation it found by actually playing the game on paper with the card pool that existed at the time: Bloom, Signal, and Tangle had no Generator card, capping every deck at Mass or Circuit and making Combat, Discovery past Length 1, and Capture unreachable through ordinary play. design/cards/fount-economy-set.md was written specifically to close that gap — its Summary quotes the finding and names the fix — and is already committed to the repo with a Generator for each of the three previously-dead Founts (Cradle-Root Colony for Bloom, Panoptic Relay Spire for Signal, Communion Waystone for Tangle) plus cheap 1-cost follow-up cards. What was never done is going back to playtest-full-game.md and updating the analysis that motivated fount-economy-set.md in the first place: the table still says 'none' and 'N/A' for all three Founts, and the prose still asserts Combat can't happen with 'the 28 cards currently named' even though 44 are now named across the card files. This unit corrects that table and its surrounding conclusion to reflect the current card pool, and proves the fix in the same load-bearing way the rest of the document already proves everything else — a new, section-cited Worked Example (matching the style of the existing Combat and Capture Worked Examples later in the same file) that plays a Bloom-Fount economy from Cradle-Root Colony's first Generation Phase output through to a Bloom Unit (Feral Bloomcaller or Rootbind Thicket, both already printed in alpha-set.md) being declared an attacker in the Conflict Phase. Only design/playtest-full-game.md and its owning test file, test/design-full-game-playtest.test.js, change; the two existing 40-card decklists (Ada's Mass deck, Kestrel's Circuit deck) and every other already-correct step of the numbered Procedure are left untouched — this unit fixes the stale analysis and adds proof, it does not rewrite the whole document or touch rules.md or any card file.

## Acceptance Criteria

- AC1 [paraphrase]: design/playtest-full-game.md's 'What This Playtest Surfaced' table no longer states 'none' in the Generator column for the Bloom, Signal, or Tangle rows; each names an actual Generator card (Cradle-Root Colony, Panoptic Relay Spire, Communion Waystone respectively).
- AC2 [paraphrase]: The prose in 'What This Playtest Surfaced' no longer claims Combat cannot occur through ordinary play with 'the 28 cards currently named' unqualified by the existence of fount-economy-set.md's 6 additional cards.
- AC3 [paraphrase]: A new Worked Example subsection demonstrates a Bloom-Fount economy: Cradle-Root Colony producing Bloom Points across Generation Phases until Feral Bloomcaller or Rootbind Thicket is played and later declared as an attacker in the Conflict Phase, citing exact rules.md section numbers throughout, in the same style as the file's pre-existing Combat and Capture Worked Examples.
- AC4 [inferred]: Every card named in the new Worked Example exists by exact name in design/cards/alpha-set.md or design/cards/fount-economy-set.md.
- AC5 [inferred] (held_out): The file's two pre-existing 40-card decklists (Ada's Mass deck, Kestrel's Circuit deck) and every numbered Procedure step outside 'What This Playtest Surfaced' and the Worked Examples area are left unchanged.
- AC6 [inferred] (held_out): `node --test` passes, including every pre-existing assertion in test/design-full-game-playtest.test.js.

## Plan

GATE: none

# Plan: cardgame-playtest-fount-economy-refresh

## What this unit does

`design/playtest-full-game.md`'s "What This Playtest Surfaced" section (lines 249-288) was
written when only 28 cards existed across `alpha-set.md`, `character-signatures.md`, and
`frontier-set.md`, and it correctly found that Bloom, Signal, and Tangle had no Generator,
so Combat/Discovery-past-Length-1/Capture could never happen through ordinary play.
`design/cards/fount-economy-set.md` (6 cards, already committed) fixed the card pool — but
nobody went back and updated the analysis. The table still says "none"/"N/A" for three
Founts that now have Generators, and the prose still talks about "the 28 cards currently
named" as if `fount-economy-set.md` didn't exist.

This unit:
1. Rewrites the table and its surrounding two paragraphs in "What This Playtest Surfaced"
   to reflect the current (44-card) pool.
2. Adds a new `### Worked Example 3` (Bloom-Fount economy → attacker declaration) in the
   same style as the file's existing Worked Examples 1 and 2.
3. Makes two one-sentence touch-ups elsewhere in the file so it stays internally consistent
   with the new Worked Example (see Edit A and Edit B below) — both sit inside areas AC5
   already allows to change (the file's own framing prose, not a numbered Procedure step or
   either decklist).
4. Updates `test/design-full-game-playtest.test.js` so its existing card-name allowlist
   includes `fount-economy-set.md`, and adds new assertions that pin down AC1-AC4.

**Do not touch:** `design/rules.md`, any file under `design/cards/`, the two decklists in
Procedure step 1, or any other numbered Procedure step (2-16). Only these two files change:
- `design/playtest-full-game.md`
- `test/design-full-game-playtest.test.js`

## Background facts you need (already verified against the repo)

- `Cradle-Root Colony` (2 Bloom, Biology — Permanent, Generator) and `Sporeling Latch`
  (1 Bloom) are in `design/cards/fount-economy-set.md`.
- `Panoptic Relay Spire` (1 Signal, 1 Circuit, Intelligence Technology — Permanent,
  Generator) is in `design/cards/fount-economy-set.md`.
- `Communion Waystone` (1 Tangle, 1 Mass, Magic Materials — Permanent, Generator) and
  `Whispered Rite` (1 Tangle) are in `design/cards/fount-economy-set.md`.
- `Stamped Chassis Unit` (1 Circuit, Technology — Permanent) is in
  `design/cards/fount-economy-set.md`.
- `Feral Bloomcaller` and `Rootbind Thicket` (both 2 Bloom, Biology — Permanent, combat
  strength 1 and 0 respectively) are in `design/cards/alpha-set.md`. Per rules.md Section
  9.5, "every Biology card is a Unit" — so both are legal attackers once played.
- rules.md Section 8.3, step 4 (confirmed against rules.md's own Section 8.7 Worked
  Example, which computes "10 minus the new Wormhole's Length"): **a Frontier Discovery
  costs `10 - Length` Fount Points, minimum 1** — NOT "cost equals Length". (Procedure step
  13 in playtest-full-game.md asserts cost = Length; that is a pre-existing error in a
  Procedure step, out of scope for this unit — do not touch it. The new Worked Example
  below uses the correct formula so it doesn't repeat that error.)
- rules.md Section 4.7 (Graph-Driven Generation): after Generator production, the active
  player gains **one bonus Fount Point of a Fount of their choice, per Planet they control
  beyond their Homeworld**. This is the only legal way to get more than 1 point of a single
  Fount in one turn without a second Generator — it's what makes a 2-cost Bloom Unit
  reachable off a single 1-point/turn Generator, and it's what the new Worked Example uses.
- rules.md Section 5.5: pools empty at the end of every turn — points never carry over.

## Edit 1 of 5 — `design/playtest-full-game.md`, top intro paragraph

This is a one-sentence necessary consistency fix: the intro currently claims every card
named in the file comes from 3 named files; once Worked Example 3 names `Cradle-Root
Colony` (from `fount-economy-set.md`), that claim needs to say so.

Find this exact text (near the top of the file, in the first paragraph):

```
software prototype. Every card named below exists by exact name in
*design/cards/alpha-set.md*, *design/cards/character-signatures.md*, or
*design/cards/frontier-set.md*. Every major step cites the exact rules.md section that
```

Replace with:

```
software prototype. Every card named in the numbered Procedure below exists by exact name
in *design/cards/alpha-set.md*, *design/cards/character-signatures.md*, or
*design/cards/frontier-set.md*; the Worked Examples section later in this file also names
one card from *design/cards/fount-economy-set.md*. Every major step cites the exact
rules.md section that
```

## Edit 2 of 5 — `design/playtest-full-game.md`, "## Worked Examples" intro paragraph

Find this exact text (the paragraph right after the `## Worked Examples (illustrative —
not reachable through steps 1-16)` heading):

```
The Procedure above is entirely real: every step is something the current rules and card
pool genuinely support, ending in a genuine win. But it never reaches Combat or an Assault
against enemy territory, for the reasons in "What This Playtest Surfaced" below. Rules.md
resolves this same tension for its own text with constructed Worked Examples (Section 7,
Section 8.7, Section 10.3, Section 12.5, Section 13.3): a hypothetical state, stated as
hypothetical, used to pin down a rule concretely. The two examples below do the same for
this procedure, using the same named cards, so Section 5.4/Section 12 and Section 8.6 still
get an on-paper demonstration even though the scripted game above cannot reach them.
```

Replace with:

```
The Procedure above is entirely real: every step is something the current rules and card
pool genuinely support, ending in a genuine win. But it never reaches Combat or an Assault
against enemy territory, for the reasons in "What This Playtest Surfaced" below. Rules.md
resolves this same tension for its own text with constructed Worked Examples (Section 7,
Section 8.7, Section 10.3, Section 12.5, Section 13.3): a hypothetical state, stated as
hypothetical, used to pin down a rule concretely. The three examples below do the same for
this procedure: the first two reuse cards already named in the decklists above, so Section
5.4/Section 12 and Section 8.6 still get an on-paper demonstration even though the scripted
game above cannot reach them. The third adds `Cradle-Root Colony` from
*design/cards/fount-economy-set.md*, the Generator that closes the Bloom's half of the gap
described in "What This Playtest Surfaced" below, so Section 4.7 and Section 5.2's
Bloom-Fount economy get the same on-paper demonstration.
```

## Edit 3 of 5 — `design/playtest-full-game.md`, insert new Worked Example 3

Find this exact text (the end of Worked Example 2, right before the "What This Playtest
Surfaced" heading):

```
- Ada does not clear the Blockade. On a later turn, Kestrel takes a second Assault along
  the same path, this time choosing Capture. Control of Cindral Drift passes to Kestrel
  immediately, and Ada's `Salvage-Wrought Bastion` there is destroyed, moved to her Wreck
  (Section 8.6).

## What This Playtest Surfaced
```

Replace with (this inserts a whole new subsection between the two, everything else
identical):

```
- Ada does not clear the Blockade. On a later turn, Kestrel takes a second Assault along
  the same path, this time choosing Capture. Control of Cindral Drift passes to Kestrel
  immediately, and Ada's `Salvage-Wrought Bastion` there is destroyed, moved to her Wreck
  (Section 8.6).

### Worked Example 3: A Bloom-Fount Economy Reaching an Attacker (Section 4.7, Section 5.2, Section 5.4)

Suppose, hypothetically, a third challenger, Bryn, built a Bloom deck instead of a Mass or
Circuit one, using the same one-time starting Fount Point allotment convention as Procedure
step 6: before her Turn 1, Bryn places 2 counters into her own Bloom pool, the cost of
`Cradle-Root Colony`, the Generator she intends to play first.

- **Turn 1, Main Phase.** Bryn plays `Cradle-Root Colony`, paying her 2 Bloom Points
  (Section 5.3). Because it is her first Generator, it MUST be built on her own Homeworld
  (Section 4.6, Section 8.2). It enters Ready with no counters, as its Stats/counters line
  states.
- **A later turn — Discovery.** On one of her own later turns, exactly as Ada does in
  Procedure step 13, Bryn takes a Frontier Discovery from her Homeworld (Section 8.3), this
  time naming a Wormhole of Length 9 rather than Length 1: a Frontier Discovery costs Fount
  Points equal to 10 minus the new Wormhole's Length, so a Length-9 Wormhole costs only 1.
  Bryn pays her 1 Bloom Point, produced that turn's Generation Phase (Section 5.2, Section
  4.2) by `Cradle-Root Colony`, naming the new Planet and joining it to the battlefield
  graph, adjacent to her Homeworld.
- **A still later turn — Generation Phase.** `Cradle-Root Colony` produces its usual 1
  Bloom Point (Section 5.2, Section 4.2). Because Bryn now controls one Planet beyond her
  Homeworld, she also gains one bonus Fount Point of a single Fount of her choice (Section
  4.7); she chooses Bloom, bringing her Bloom pool to 2 Bloom Points for this turn only —
  Section 5.5 would empty it again at Dusk if she didn't spend it first.
- **Same turn, Main Phase.** Bryn plays `Feral Bloomcaller`, paying her 2 Bloom Points
  (Section 5.3). It enters Ready with no counters, combat strength 1, as its Stats/counters
  line states; every Biology card is a Unit (Section 9.5), so it may be declared as an
  attacker or blocker in a future Conflict Phase (Section 5.4). (`Rootbind Thicket`, the
  other 2-Bloom Unit printed in *design/cards/alpha-set.md*, would reach this same state
  identically, just entering with three Growth counters and combat strength 0 instead of
  Feral Bloomcaller's no counters and combat strength 1.)
- **A later turn — Conflict Phase.** `Feral Bloomcaller` has not attacked, blocked, or used
  its Spent ability since being played, so it is still Ready. Bryn declares it as an
  attacker, naming the Planet she is attacking; it becomes Spent as she does (Section 5.4).

## What This Playtest Surfaced
```

## Edit 4 of 5 — `design/playtest-full-game.md`, rewrite the whole "What This Playtest Surfaced" section

Find this exact text (this is the entire section, from its heading to the end of the
file — nothing follows it, so it's safe to match to end-of-file):

```
## What This Playtest Surfaced

The Procedure above genuinely plays, and genuinely ends in a win — but it never involves a
Unit, a Fount other than Mass and Circuit, an Assault, or a Blockade, and that is not this
procedure's choice. It is a consequence of exactly two facts, checkable against
*design/rules.md* and the three card files:

| Fount   | Generator card(s) in the current pool                                     | Cheapest other card in that Fount | Sustainable past the opening Generator? |
|---------|-----------------------------------------------------------------------------|------------------------------------|------------------------------------------|
| Mass    | `Salvage-Wrought Bastion` (2), `Kordelia Vess, Salvage-Marshal of the Cinder Yards` (3) | `Cinder-Forged Plating` (1) | Yes — the only Fount with both a Generator and a card cheap enough to replay inside the 1-point/turn cap |
| Circuit | `Replicant Foundry Core` (3), `Replication Beachhead` (2)                   | `Firmware Sentinel` (2)             | No — total lockout the instant the Generator is played |
| Bloom   | none                                                                         | `Feral Bloomcaller` / `Rootbind Thicket` (2) | N/A — nothing ever produces Bloom |
| Signal  | none                                                                         | `Whispered Contract` / `Wormhole Ledger` (1) | N/A — nothing ever produces Signal |
| Tangle  | none                                                                         | `Oathbreaker's Toll` / `Echo Recall` / `Rite of Unmaking` / `Meridian Aule, Star-Read Oracle of the Tangle` (2) | N/A — nothing ever produces Tangle |

Because Section 4 empties every resource pool at the end of each turn, and Section 5.2 lets
only an *already-controlled* Generator produce points, and every printed Generator costs
strictly more than the single-turn output of one Generator, a challenger can never field a
second Generator once they have exactly one — the economy is capped, forever, at 1 Fount
Point of a single Fount per turn, immediately after the opening Generator. Combined with
every reachable printed Unit costing at least 3 (the cheapest one, `Line-Fleet Trooper`, is
3 Mass — two cheaper Units are printed, `Feral Bloomcaller` and `Rootbind Thicket` at 2 Bloom
each, but Bloom has no Generator, so neither is ever reachable in ordinary play) and a
Contested Discovery costing at least 2 (double the minimum Length of 1), this means Combat
(Section 5.4, Section 12) and any Assault against an opponent's territory (Section 8.6)
cannot occur through ordinary play with the 28 cards currently named across the three card
files — which is exactly why the two mechanics are demonstrated above as Worked Examples
instead of inside the numbered Procedure.

Separately, because only 10 of those 28 named cards are ever payable at all (5 Materials +
5 Technology), and Section 11.2 caps any one of them at 3 copies, the most any legal deck
can lean on payable cards is 30 slots — 10 short of the Section 11.1 minimum of 40. Every
legal deck, not just the two built for this procedure, is forced to include at least 10
copies of cards that can never be cast.

For a future card set or rules revision: this playtest's single clearest, most actionable
finding is that Bloom, Signal, and Tangle each need at least one Generator card, and every
Fount needs at least one card cheap enough (1 point) to sustain a single-Generator economy,
before a full game can be expected to naturally reach Combat, Discovery past Length 1, or
Capture.
```

Replace with:

```
## What This Playtest Surfaced

The Procedure above genuinely plays, and genuinely ends in a win — but it never involves a
Unit, a Fount other than Mass and Circuit, an Assault, or a Blockade, and that is not this
procedure's choice. It is a consequence of exactly two facts, checkable against
*design/rules.md* and all four card files this document draws from — the three the
Procedure's own decks are built from, plus *design/cards/fount-economy-set.md*:

| Fount   | Generator card(s) in the current pool                                     | Cheapest other card in that Fount | Sustainable past the opening Generator? |
|---------|-----------------------------------------------------------------------------|------------------------------------|------------------------------------------|
| Mass    | `Salvage-Wrought Bastion` (2), `Kordelia Vess, Salvage-Marshal of the Cinder Yards` (3) | `Cinder-Forged Plating` (1) | Yes — a Generator and a card cheap enough to replay inside the 1-point/turn cap |
| Circuit | `Replicant Foundry Core` (3), `Replication Beachhead` (2)                   | `Stamped Chassis Unit` (1)          | Yes — `Stamped Chassis Unit` (*design/cards/fount-economy-set.md*) now gives the Circuit a 1-point card too |
| Bloom   | `Cradle-Root Colony` (2)                                                     | `Sporeling Latch` (1)               | Yes — both from *design/cards/fount-economy-set.md*: a Generator, plus a 1-point card cheap enough to replay |
| Signal  | `Panoptic Relay Spire` (1 Signal, 1 Circuit)                                 | `Whispered Contract` / `Wormhole Ledger` (1) | Yes, once built — `Panoptic Relay Spire` (*design/cards/fount-economy-set.md*) is the Generator; its own cost is dual, so building it needs a one-time Circuit contribution too |
| Tangle  | `Communion Waystone` (1 Tangle, 1 Mass)                                      | `Whispered Rite` (1)                | Yes, once built — `Communion Waystone` (*design/cards/fount-economy-set.md*) is the Generator; its own cost is dual, so building it needs a one-time Mass contribution too |

Because Section 4 empties every resource pool at the end of each turn, and Section 5.2 lets
only an *already-controlled* Generator produce points, and every printed Generator costs
strictly more than the single-turn output of one Generator, a challenger can never field a
second Generator once they have exactly one — the economy is capped at 1 Fount Point of a
single Fount per turn immediately after the opening Generator, Section 4.7's Graph-Driven
Generation bonus aside (one further point per extra Planet a challenger controls, itself
gated on taking a Discovery action to reach that Planet first). With the 28 cards originally
named across the three card files above, this cap meant every reachable printed Unit cost at
least 3 (the cheapest one, `Line-Fleet Trooper`, is 3 Mass — `Feral Bloomcaller` and
`Rootbind Thicket` at 2 Bloom each were cheaper, but Bloom had no Generator, so neither was
ever reachable in ordinary play), and combined with a Contested Discovery costing at least 2
(double the minimum Length of 1), Combat (Section 5.4, Section 12) and any Assault against an
opponent's territory (Section 8.6) could not occur through ordinary play with those 28 cards
alone — which is exactly why the two mechanics are demonstrated above as Worked Examples
instead of inside the numbered Procedure. *design/cards/fount-economy-set.md* closes this gap
for the Bloom specifically: with `Cradle-Root Colony` in a deck, `Feral Bloomcaller` and
`Rootbind Thicket` become reachable Units through ordinary play, as Worked Example 3
demonstrates. The two decks built for this procedure (step 1) predate that card and still
can't reach Combat, which is exactly why it remains a Worked Example here rather than a step
in the numbered Procedure.

Separately, because only 10 of the 28 cards originally named across the three card files
were ever payable at all (5 Materials + 5 Technology), and Section 11.2 caps any one of them
at 3 copies, the most a deck built only from those 28 cards could lean on payable cards was
30 slots — 10 short of the Section 11.1 minimum of 40, exactly the shape both decks above
still have. *design/cards/fount-economy-set.md*'s 6 additional cards change this for any deck
built after it: since every Fount now has both a Generator and a card cheap enough to replay
after it (see the table above), a Bloom, Signal, or Tangle deck can now reach 40 payable slots
the same way the Mass and Circuit decks above always could.

This playtest's single clearest, most actionable finding was that Bloom, Signal, and Tangle
each needed at least one Generator card, and every Fount needed at least one card cheap
enough (1 point) to sustain a single-Generator economy, before a full game could be expected
to naturally reach Combat, Discovery past Length 1, or Capture.
*design/cards/fount-economy-set.md* was written to close exactly this gap: a Generator for
each of the three previously-dead Founts (`Cradle-Root Colony` for the Bloom, `Panoptic Relay
Spire` for the Signal, `Communion Waystone` for the Tangle) plus cheap 1-cost follow-up cards
for the Circuit, the Bloom, and the Tangle — see the updated table above, and Worked Example
3, for what that closes.
```

**Note:** the "Contested Discovery costing at least 2 (double the minimum Length of 1)"
clause is carried over unchanged from the original — it's a separate, pre-existing piece of
reasoning not named in any AC for this unit; leave its wording exactly as-is even though
you're rewriting the sentence around it.

## Edit 5 of 5 — `test/design-full-game-playtest.test.js`

### 5a. Add `fount-economy-set.md` to the allowed card files

Find:

```js
const CARD_FILES = ['alpha-set.md', 'character-signatures.md', 'frontier-set.md'].map((f) =>
  path.join(__dirname, '..', 'design', 'cards', f)
);
```

Replace with:

```js
const CARD_FILES = ['alpha-set.md', 'character-signatures.md', 'frontier-set.md', 'fount-economy-set.md'].map((f) =>
  path.join(__dirname, '..', 'design', 'cards', f)
);
```

This one-line change is why the pre-existing test `AC2: at least one card from each of the
three permitted files is named` will now also require (and, after Edit 3 above, get) at
least one citation from `fount-economy-set.md` — no need to touch that test's body.

### 5b. Import `sectionText` from the markdown helper

Find:

```js
const { parseSections, findSection, normalizeProse } = require('./helpers/markdown');
```

Replace with:

```js
const { parseSections, findSection, sectionText, normalizeProse } = require('./helpers/markdown');
```

### 5c. Add new tests

Add this new block right before the final `// ---... Sanity ...` comment block (i.e.,
right before the `test('sanity: rules.md still has its full Section 1-13 structure
(untouched)'...` test), so it reads naturally as the newest set of assertions:

```js
// ---------------------------------------------------------------------------
// AC1/AC2/AC3/AC4 (fount-economy-set.md refresh): "What This Playtest Surfaced" reflects
// the current card pool, and a new Worked Example proves a Bloom-Fount economy reaching
// an attacker.
// ---------------------------------------------------------------------------

function surfacedSectionText() {
  const sections = parseSections(readDoc());
  const text = sectionText(sections, /^What This Playtest Surfaced$/);
  assert.ok(text, 'expected a "What This Playtest Surfaced" section to exist');
  return text;
}

test('AC1: the Generator column names a real card for Bloom, Signal, and Tangle', () => {
  const text = surfacedSectionText();
  assert.ok(
    /\|\s*Bloom\s*\|[^\n]*`Cradle-Root Colony`/.test(text),
    'expected the Bloom row to name `Cradle-Root Colony` as its Generator'
  );
  assert.ok(
    /\|\s*Signal\s*\|[^\n]*`Panoptic Relay Spire`/.test(text),
    'expected the Signal row to name `Panoptic Relay Spire` as its Generator'
  );
  assert.ok(
    /\|\s*Tangle\s*\|[^\n]*`Communion Waystone`/.test(text),
    'expected the Tangle row to name `Communion Waystone` as its Generator'
  );
  assert.ok(!/\|\s*Bloom\s*\|\s*none\s*\|/.test(text), 'expected the Bloom row to no longer say "none"');
  assert.ok(!/\|\s*Signal\s*\|\s*none\s*\|/.test(text), 'expected the Signal row to no longer say "none"');
  assert.ok(!/\|\s*Tangle\s*\|\s*none\s*\|/.test(text), 'expected the Tangle row to no longer say "none"');
});

test('AC2: no longer claims Combat is unreachable with an unqualified "28 cards currently named"', () => {
  const text = normalizeProse(surfacedSectionText());
  assert.ok(
    !/cannot occur through ordinary play with the 28 cards currently named across the three card files/i.test(
      text
    ),
    'expected the old, unqualified claim about the 28 cards to be gone'
  );
  assert.ok(/fount-economy-set\.md/i.test(text), 'expected the section to reference fount-economy-set.md');
});

test('AC3: a new Worked Example demonstrates a Bloom-Fount economy reaching an attacker', () => {
  const sections = parseSections(readDoc());
  const text = sectionText(sections, /^Worked Example 3\b/);
  assert.ok(text, 'expected a "Worked Example 3" subsection to exist');
  assert.ok(/`Cradle-Root Colony`/.test(text), 'expected the example to name `Cradle-Root Colony`');
  assert.ok(
    /`Feral Bloomcaller`/.test(text) || /`Rootbind Thicket`/.test(text),
    'expected the example to name `Feral Bloomcaller` or `Rootbind Thicket`'
  );
  assert.ok(/Section\s+5\.2\b/.test(text), 'expected a citation of Section 5.2 (Generation Phase)');
  assert.ok(/Section\s+5\.4\b/.test(text), 'expected a citation of Section 5.4 (Conflict Phase)');
  assert.ok(/attacker/i.test(text), 'expected the example to declare an attacker');
});

test('AC4: every card in Worked Example 3 exists in alpha-set.md or fount-economy-set.md', () => {
  const sections = parseSections(readDoc());
  const text = sectionText(sections, /^Worked Example 3\b/);
  const cited = extractCardNameCitations(text);
  const allowed = new Set([
    ...loadCardsFromFile(path.join(__dirname, '..', 'design', 'cards', 'alpha-set.md')).map((c) => c.name),
    ...loadCardsFromFile(path.join(__dirname, '..', 'design', 'cards', 'fount-economy-set.md')).map((c) => c.name),
  ]);
  const missing = cited.filter((name) => !allowed.has(name));
  assert.deepStrictEqual(missing, [], `unexpected card names in Worked Example 3: ${JSON.stringify(missing)}`);
});
```

## Verification

Run:

```
node --test
```

Expected: every test in `test/design-full-game-playtest.test.js` passes (the pre-existing
ones unchanged, plus the 4 new ones above), and no other test file regresses (nothing
outside `design/playtest-full-game.md` and this test file was touched, so
`design-fount-economy-cards.test.js`, `design-cards.test.js`, etc. are unaffected). Node's
test runner prints a final summary line like `# pass 900+` and `# fail 0` — confirm the
fail count is exactly 0.

Also run a quick manual diff check before calling this done:

```
git diff --stat
```

Expected output: exactly two files listed —
`design/playtest-full-game.md` and `test/design-full-game-playtest.test.js`. If anything
else shows up (rules.md, any file under design/cards/, etc.), something went wrong — revert
it.

## Held-out AC note (for the reviewer, not the implementer)

AC5 and AC6 are redundant with the intent's explicit scope statement ("Only
design/playtest-full-game.md and its owning test file... change... the two existing 40-card
decklists... and every other already-correct step of the numbered Procedure are left
untouched") and with the standard "tests must pass" bar — nothing novel in their specifics
beyond what's already planned above. No spec-bug flag needed.


## Findings

# Review Findings — cardgame-playtest-fount-economy-refresh (cycle 3)

## Finding 1 — INTRODUCED — Worked Example 3's Section 4.7 bonus is triggered by a premise the rules explicitly deny

**File:** `design/playtest-full-game.md`, lines 266-277 (new Worked Example 3, "A later turn —
Discovery" / "A still later turn — Generation Phase" bullets)

**Summary:** Worked Example 3 has Bryn take a Frontier Discovery to a new Unexplored Planet,
then immediately asserts "Because Bryn now controls one Planet beyond her Homeworld, she also
gains one bonus Fount Point... (Section 4.7)". This is false under the rules cited in this same
document. `design/rules.md` Section 8.1 states plainly: *"A Planet is controlled by whichever
challenger most recently built a Generator on it or Captured it (Section 8.6); **Discovering a
Planet does not by itself grant control of it** (Section 8.3)."* Section 8.3 step 5 repeats this
verbatim for Frontier Discovery specifically: *"If the destination was Unexplored, it enters the
graph as a Neutral Planet — Discovery alone does not grant control of it."* The document's own
pre-existing Procedure step 13 — which Worked Example 3 explicitly says it mirrors ("exactly as
Ada does in Procedure step 13") — confirms this: Ada's Discovery makes Cindral Drift "a Neutral
Planet," not a Planet Ada controls.

So after Bryn's Discovery, the new Planet is Neutral. She does not control "one Planet beyond her
Homeworld," and Section 4.7's bonus point does not fire. Without that bonus, `Cradle-Root Colony`
alone produces exactly 1 Bloom Point per turn (Section 5.5 empties pools every turn, no
carryover), which is one short of `Feral Bloomcaller`/`Rootbind Thicket`'s 2-Bloom cost. The only
way to actually gain control of an extra Planet is Capture via Assault (Section 8.6) — which
itself requires a Unit already located at the target and a separate Fount-Point payment equal to
the path's summed Length — and Worked Example 3 never performs that action.

**Failure scenario:** A playtester follows Worked Example 3 verbatim, expecting (per AC3) a
faithful demonstration of how a Bloom-only economy reaches a 2-cost Unit. At the "still later
turn" step they check Section 4.7 against Section 8.1/8.3 and find the bonus point cannot
legally be claimed — Bryn's Bloom pool that turn is 1, not 2, and `Feral Bloomcaller` cannot be
played. The worked example's central claim (a single 1-point/turn Generator plus the graph bonus
reaches a 2-cost Unit) is not actually demonstrated; it's asserted on a false premise. This
directly undercuts AC3, which requires the new Worked Example to genuinely prove the Bloom-Fount
economy claim the table (AC1) and prose (AC2) now make.

**Why this gates the merge:** AC3 isn't just "a Worked Example subsection exists with the right
citations" — its whole point (stated in both the unit's intent and plan.md) is to *prove* the
Bloom economy works, the same load-bearing way the file's other Worked Examples prove Combat and
Capture. As written, it doesn't prove that; it contradicts rules.md sections it cites from within
the very same document.

---

## AC accounting

- **AC1** (table no longer says "none" for Bloom/Signal/Tangle Generators): Satisfied.
  `design/playtest-full-game.md` lines 297-303 name `Cradle-Root Colony`, `Panoptic Relay Spire`,
  and `Communion Waystone` respectively; verified these exist with matching costs/types in
  `design/cards/fount-economy-set.md`.
- **AC2** (prose no longer claims Combat is unreachable with unqualified "28 cards currently
  named"): Satisfied. Lines 311-324 qualify the claim as "originally named," "those 28 cards
  alone," and immediately state `fount-economy-set.md` closes the gap for Bloom via Worked
  Example 3.
- **AC3** (new Worked Example proving the Bloom-Fount economy, citing rules.md sections, matching
  the file's existing style): Present and stylistically consistent with Worked Examples 1-2, and
  most of its section citations (5.2, 5.3, 5.4, 8.2, 8.3, 9.5, 4.6, 4.7) check out individually —
  but see Finding 1: the mechanism it uses to reach the 2-Bloom threshold is not actually
  supported by the cited rules, so the demonstration does not hold up. **Not satisfied as
  written.**
- **AC4** (every card named in the new Worked Example exists by exact name in alpha-set.md or
  fount-economy-set.md): Satisfied. `Cradle-Root Colony` (fount-economy-set.md), `Feral
  Bloomcaller` and `Rootbind Thicket` (alpha-set.md) all verified present with exact names and
  matching stats.

## Other notes (not gating)

- `test/design-full-game-playtest.test.js` line 140's comment still says "three permitted files"
  even though `CARD_FILES` (line 11) now has four entries including `fount-economy-set.md`; the
  test logic itself is correct (it now also requires a fount-economy-set.md card be cited, which
  Worked Example 3 satisfies) — just a stale comment. Pre-existing test, cosmetic only.
- Diff scope matches the stated intent: only `design/playtest-full-game.md`, its generated
  `site/design/playtest-full-game.html`, and `test/design-full-game-playtest.test.js` change;
  `design/rules.md` and all card files are untouched, and both existing 40-card decklists and
  numbered Procedure steps 1-16 are untouched.

NEEDS_WORK


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T10:52:08.187Z] **bolt:start** — unit=cardgame-playtest-fount-economy-refresh start_sha=d7c27b9d85a6f2ba1af121d176aac0c094f9a359 branch=bolt/cardgame-playtest-fount-economy-refresh worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-playtest-fount-economy-refresh
- [2026-07-29T10:52:17.681Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T11:03:24.770Z] **plan:done** — plan.md written
- [2026-07-29T11:04:38.504Z] **tests:done** — RED verified on test/design-full-game-playtest.test.js (exit=1)
- [2026-07-29T11:10:53.687Z] **build:c1** — tests still red (exit=1)
- [2026-07-29T11:13:30.121Z] **build:c2** — tests still red (exit=1)
- [2026-07-29T11:15:46.116Z] **build:c3** — tests green, committed
- [2026-07-29T11:19:46.913Z] **review:c3** — NEEDS_WORK
- [2026-07-29T11:19:46.917Z] **bolt:escalated** — circuit breaker after 3 cycles


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
