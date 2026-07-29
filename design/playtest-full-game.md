# Full Game Playtest Procedure (On Paper)

This is a step-by-step, on-paper procedure for two humans, "Ada" and "Kestrel," to build
decks, set up, and play one complete game under *design/rules.md*, from deck construction
through an explicit win, using ordinary physical materials instead of a computer or
software prototype. Every card named below exists by exact name in
*design/cards/alpha-set.md*, *design/cards/character-signatures.md*, or
*design/cards/frontier-set.md*. Every major step cites the exact rules.md section that
governs it, so either playtester can stop and check the physical action just taken against
the rule text itself. This procedure builds on the spatial-layer procedure already written
in *design/playtest-spatial.md*, but where that document focuses narrowly on the
battlefield graph, this one plays every phase of an entire game, from an empty table to a
declared winner.

Read "What This Playtest Surfaced" at the end before running this procedure — it explains,
with exact numbers, why both decks below draw only from the Mass and Circuit Founts, and
why Combat and Capture are demonstrated separately as Worked Examples rather than inside
the numbered Procedure itself.

## Materials

- Two sets of 40 index cards each, one set per challenger, built to the decklists in step 1
  below, standing in for that challenger's Archive (Section 3); shuffle each into a
  face-down pile.
- A discard area per challenger for their Wreck (Section 3), and a shared area for the Void
  (Section 3) — this procedure never needs the Void, but keep the area ready in case a
  playtester wants to check the rule.
- Five small piles of counters or a tally sheet, one pile per Fount (Mass, Bloom, Signal,
  Circuit, Tangle) per challenger, for that challenger's five resource pools (Section 4).
- A tally sheet or a d20 per challenger, starting at 20, to track Core Integrity (Section
  2's Home base and Core Integrity terms). Rules.md does not fix a starting Core Integrity
  value; this procedure uses 20 as a workable table number.
- A large sheet of paper or whiteboard space for the battlefield graph, Planet index cards,
  and a marker, exactly as *design/playtest-spatial.md*'s own Materials list already
  describes (Section 8.1).
- A way to mark a permanent Spent versus Ready (Section 2) — turning the card sideways
  works well.
- A small "Queue" area on the table, and a token to mark who currently holds priority
  (Section 6).

## Procedure

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

2. **Lay out the two Homeworlds.** Place two Planet index cards a few inches apart: one
   labeled "Verge Hollow" for Ada, one labeled "Ironreach Station" for Kestrel. Put each
   challenger's own token on their own Homeworld card. A Planet is a node in the
   battlefield graph, and each challenger controls their own Homeworld from the start of
   the game (Section 8.1, Section 8.2).

3. **Confirm the starting map matches Map Setup.** Exactly these two cards should be on
   the table, no others, and no line connects them yet — the two Homeworlds are never
   adjacent at the start of the game, and the starting Planet count is exactly two, one
   per challenger, fixed and symmetric every time (Section 8.8).

4. **Shuffle, draw opening hands, and set starting trackers.** Each challenger shuffles
   their 40-card Archive (Section 3) and draws an opening hand of 5 cards from it — 35
   cards then remain in each Archive. Rules.md does not fix an opening hand size; this
   procedure uses 5 as a table convention, not a rules.md citation. Set each challenger's
   Core Integrity tracker to 20 (also a table convention, per the Materials list above).

5. **Determine who takes the first turn.** Flip a coin, or use any other neutral method —
   determining who takes the first turn is named as part of general game setup, but no
   particular method is fixed (Section 8.8). For the rest of this procedure, assume Ada
   wins the flip and takes the first turn.

6. **Apply the one-time starting Fount Point allotment.** This step is a playtest
   convention only — it is not stated anywhere in rules.md, and exists solely to break a
   bootstrap problem the rules otherwise leave unsolved: Section 5.2 only lets an
   *existing* Generator produce points, so without some starting grant, neither
   challenger could ever pay for their very first Generator. Before Turn 1, Ada places 2
   counters into her own Mass pool (the cost of `Salvage-Wrought Bastion`, the Generator
   she intends to play first) and Kestrel places 2 counters into her own Circuit pool (the
   cost of `Replication Beachhead`). Do not cite any rules.md section for this step when
   playing — there isn't one.

7. **Turn 1 — Ada's Dawn Phase.** Ada would ready any Spent permanents she controls (she
   controls none yet). Because this is the very first turn of the game, Ada does NOT draw
   this Dawn Phase — the one stated exception in Section 5.1.

8. **Turn 1 — Ada's Generation Phase and Main Phase.** Ada controls 0 Generators, so
   Generation Phase (Section 5.2) produces nothing from the Field; her Mass pool still
   holds the 2 counters from step 6. In her Main Phase (Section 5.3), Ada plays
   `Salvage-Wrought Bastion`, paying 2 Mass. Because this is her first Generator, it MUST
   be built on her own Homeworld (Section 4.6, Section 8.2) — place it on Verge Hollow. It
   enters Ready, with one Fortification counter as printed on its Stats/counters line. Ada
   has no Fount Points left and passes.

9. **Turn 1 — Ada's Conflict Phase and Dusk Phase.** Neither challenger controls a Ready
   Unit, so no attackers are declared (Section 5.4). No triggered ability applies; both
   challengers pass in succession, Ada's already-empty Mass pool stays empty (Section
   5.5), and the turn ends.

10. **Turn 2 — Kestrel's full turn.** Dawn Phase: Kestrel draws 1 card — the first-turn
    exception in Section 5.1 applies only to whoever takes the game's very first turn
    (Ada), not to Kestrel's own first turn, so she draws normally. Generation Phase
    produces nothing from the Field (0 Generators); her Circuit pool still holds the 2
    counters from step 6. Main Phase: she plays `Replication Beachhead`, paying 2 Circuit,
    built on her own Homeworld, Ironreach Station, since it is her first Generator
    (Section 4.6, Section 5.3, Section 8.2). Conflict Phase: nothing to declare (Section
    5.4). Dusk Phase: pools already empty, turn ends (Section 5.5).

11. **Turn 3 — Ada's turn.** Dawn Phase: Ada draws 1 card (Section 5.1 — the exception
    only ever applied to her very first turn). Generation Phase: `Salvage-Wrought Bastion`
    produces 1 Mass Point, added to Ada's Mass pool (Section 5.2, Section 4.1). Main
    Phase: Ada plays `Cinder-Forged Plating`, paying her 1 Mass Point (Section 5.3), then
    activates its own Spent ability (its only cost is becoming Spent — no further Fount
    Point cost), choosing `Salvage-Wrought Bastion` (a permanent she controls) as the
    target the instant the ability is added to the Queue (Section 13.1). Both challengers
    pass in succession; the ability resolves (Section 6), placing a second Fortification
    counter on `Salvage-Wrought Bastion`. Conflict and Dusk Phases: nothing to declare,
    pools empty (Section 5.4, Section 5.5).

12. **Turn 4 — Kestrel's turn.** Dawn Phase: draws 1 (Section 5.1). Generation Phase:
    `Replication Beachhead` produces 1 Circuit Point (Section 5.2, Section 4.4). Main
    Phase: Kestrel checks her hand for anything costing 1 Circuit or less — nothing in the
    entire card pool costs that little in pure Circuit (the cheapest other Circuit card,
    `Firmware Sentinel`, costs 2). She has no legal play; Section 5.3 says the active
    player MAY play cards, never MUST, so she simply passes. Conflict and Dusk Phases:
    nothing to declare, pools empty.

13. **Turn 5 — Ada's turn.** Dawn and Generation Phases proceed as turn 3 (Section 5.1,
    Section 5.2, Section 4.1): draw 1, produce 1 Mass Point. This time, in her Main Phase,
    Ada takes a Discovery action instead of playing another `Cinder-Forged Plating`
    (Section 8.3): a Frontier Discovery from her Homeworld to a new Unexplored Planet,
    naming it "Cindral Drift," with a Wormhole of Length 1. A Frontier Discovery costs
    Fount Points equal to Length, so she pays her 1 Mass Point. Cindral Drift joins the
    battlefield graph as a Neutral Planet, adjacent to Verge Hollow. Conflict and Dusk
    Phases: nothing to declare, pools empty.

14. **Turn 6 — Kestrel's turn.** Repeat turn 4's shape exactly: draw 1 (Section 5.1),
    produce 1 Circuit Point (Section 5.2, Section 4.4), no legal Main Phase play, pass
    (Section 5.3).

15. **Continue alternating turns in this pattern.** On each further Ada turn, she draws 1
    card (Section 5.1), her `Salvage-Wrought Bastion` produces 1 Mass Point (Section 5.2,
    Section 4.1), and she spends it in her Main Phase (Section 5.3) either on one of her
    two remaining unplayed `Cinder-Forged Plating` copies (activating its Spent ability
    again once played) or on another Length-1 Frontier Discovery (Section 8.3) from
    whichever Planet she controls. On each further Kestrel turn, she draws 1 card (Section
    5.1), produces 1 Circuit Point (Section 5.2, Section 4.4), has no legal Main Phase
    play, and passes (Section 5.3). Neither challenger ever declares an attacker, since
    neither ever controls a Ready Unit (Section 5.4) — see "What This Playtest Surfaced"
    for exactly why. Keep alternating until a challenger is required to draw with an empty
    Archive, picked up in the next step.

16. **The explicit win.** Both Archives started at 40 cards, less the 5-card opening hand
    (step 4), leaving 35 cards apiece. Kestrel draws on every one of her own turns,
    starting with her very first (Turn 2); Ada draws on every one of her own turns
    *except* her very first (Turn 1's exception, Section 5.1). Because of that one-turn
    head start, Kestrel always has drawn exactly one more card than Ada has, at the same
    point in the game — so Kestrel empties her Archive first: on her 35th personal turn
    (the game's 70th turn) her last card is drawn, and on her 36th personal turn (the
    game's 72nd turn) she is required to draw during her Dawn Phase with no card left to
    draw. Section 10.1's second Elimination condition Eliminates Kestrel immediately, in
    the middle of that Dawn Phase, before the rest of her turn is played. Ada is now the
    only challenger left un-Eliminated, so Section 10.2 ends the game immediately: Ada
    wins, and no further phase or turn is played.

## Worked Examples (illustrative — not reachable through steps 1-16)

The Procedure above is entirely real: every step is something the current rules and card
pool genuinely support, ending in a genuine win. But it never reaches Combat or an Assault
against enemy territory, for the reasons in "What This Playtest Surfaced" below. Rules.md
resolves this same tension for its own text with constructed Worked Examples (Section 7,
Section 8.7, Section 10.3, Section 12.5, Section 13.3): a hypothetical state, stated as
hypothetical, used to pin down a rule concretely. The two examples below do the same for
this procedure, using the same named cards, so Section 5.4/Section 12 and Section 8.6 still
get an on-paper demonstration even though the scripted game above cannot reach them.

### Worked Example 1: Combat Resolution (Section 5.4, Section 12)

Suppose, hypothetically, Ada controlled a Ready `Line-Fleet Trooper` (combat strength 3)
and Kestrel controlled two Ready Units: a `Drone Cascade` (combat strength 3) and a
`Unit 0-Prime "Cast-Aside", the First Flaw` (combat strength 3).

- Ada declares `Line-Fleet Trooper` as an attacker; it becomes Spent. Kestrel declares both
  `Drone Cascade` and `Unit 0-Prime "Cast-Aside", the First Flaw` as blockers against it
  (Section 5.4).
- Because it is blocked, `Line-Fleet Trooper` deals its combat strength as damage to its
  blockers instead of Kestrel's Core Integrity (Section 12.1). Ada, the active player,
  chooses the assignment: all 3 damage to `Drone Cascade` (Section 12.2).
- `Drone Cascade` has 3 damage marked against it, equal to its own combat strength, so it
  is destroyed and moved to Kestrel's Wreck (Section 12.3).
  `Unit 0-Prime "Cast-Aside", the First Flaw` takes none.
- Both of Kestrel's blockers also deal their combat strength to `Line-Fleet Trooper` at
  the same time (Section 12.1): 3 from each, 6 total. Its combat strength is 3, so 6
  damage destroys it too, moved to Ada's Wreck (Section 12.3).

### Worked Example 2: Discovery, Blockade, and Capture (Section 8.3, Section 8.6)

Suppose, hypothetically, Ada had built a second `Salvage-Wrought Bastion` on Cindral Drift
(the Planet discovered in step 13), and Kestrel had somehow amassed enough Fount Points in
a single turn to reach it.

- Kestrel takes an Assault action against Cindral Drift, along a qualifying path from a
  Planet she controls, paying Fount Points equal to the summed Length of that path
  (Section 8.6), and chooses to Blockade. Cindral Drift is now Blockaded: starting with
  Ada's next Generation Phase, its `Salvage-Wrought Bastion` stops producing Fount Points,
  though it is not destroyed and Ada still controls the Planet.
- Ada does not clear the Blockade. On a later turn, Kestrel takes a second Assault along
  the same path, this time choosing Capture. Control of Cindral Drift passes to Kestrel
  immediately, and Ada's `Salvage-Wrought Bastion` there is destroyed, moved to her Wreck
  (Section 8.6).

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
