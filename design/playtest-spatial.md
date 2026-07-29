# Spatial Battlefield Playtest Procedure (On Paper)

This is a step-by-step, on-paper procedure for two humans to set up and
play a full game under *design/rules.md*, using ordinary physical
materials instead of printed cards or a computer. It is written for two
playtesters, "A" and "B", sitting at the same table. Every step below
cites the exact rules.md section it is exercising, so either playtester
can stop at any point and cross-check the physical action just taken
against the rule text itself.

## Materials

- A large sheet of paper, poster board, or whiteboard space, to lay out
  the battlefield graph.
- Index cards or sticky notes, one per Planet as it enters the graph,
  each labeled with that Planet's name.
- Two sets of differently colored tokens, coins, or dice (one color per
  challenger), used to mark which challenger controls a Planet.
- A marker or pen, for drawing a line (Wormhole) between two Planet cards
  and writing that Wormhole's Length as a number on the line.
- Small blank stickers or scratch-paper markers, to flag a Planet as
  Blockaded or to flag a Wormhole as Closed or Restricted.
- Five small piles of counters (or a tally sheet), one pile per Fount
  (Mass, Bloom, Signal, Circuit, Tangle) per challenger, to track each
  challenger's five resource pools.
- Two shuffled decks of index cards, standing in for each challenger's
  Archive (or an actual prototype card set, if one is available), plus a
  discard area for each challenger's Wreck.
- A tally sheet or a d20 per challenger, to track Core Integrity.

## Procedure

1. **Lay out the two starting Planets.** Before either challenger looks
   at a card, place two Planet index cards on the table a few inches
   apart: one per challenger, each labeled with that challenger's
   Homeworld's name. Put that challenger's own token on their own
   Homeworld card. A Planet is a node in the battlefield graph, and this
   pair of cards is how this playtest physically represents that graph
   (Section 8.1).

2. **Confirm the starting graph matches Map Setup.** Each challenger
   controls their own Homeworld from the start of the game and it can
   never change control (Section 8.2); the two Homeworlds are never
   adjacent at the start of the game, which is why no line connects them
   yet. Check that exactly these two cards are on the table, no others,
   and that no line connects them — this is the whole starting graph:
   fixed and symmetric, exactly one Planet per challenger, and nothing
   else (Section 8.8).

3. **Finish ordinary game setup.** Each challenger shuffles their
   Archive, draws an opening hand, and the group determines who takes
   the first turn, exactly as Sections 1 and 3 describe; none of this is
   spatial-layer-specific, so it isn't re-detailed here.

4. **Play turns in the normal five-phase order** (Dawn, Generation,
   Main, Conflict, Dusk — Section 5), tracking Fount Point counters
   during each Generation Phase and Core Integrity as combat damage
   lands, until a spatial action becomes available, picked up at step 5.

5. **Build the first Generator on a Homeworld.** The first time each
   challenger plays a Generator, place a small "Generator" marker on
   their own Homeworld card, not anywhere else — a challenger's first
   Generator MUST be built on their Homeworld.

6. **Take a Discovery action.** On a later Main Phase, once the Queue is
   empty and it is the active player's priority, that challenger MAY
   take one Discovery action (Section 8.3):
   a. Point to a Planet card they control as the origin (at first, this
      can only be their own Homeworld).
   b. Decide the kind of Discovery: a **Frontier Discovery**, whose
      destination is a brand-new index card not yet on the table
      (Unexplored, Section 8.1); or a **Contested Discovery**, whose
      destination is a Planet card already on the table that this
      challenger does not control.
   c. Write any positive integer as the new Wormhole's Length on a line
      connecting the origin and destination cards.
   d. Pay Fount Point counters from the active player's resource pools:
      Length counters for a Frontier Discovery, or double that for a
      Contested Discovery.
   e. Place the destination card on the table if it wasn't already
      there. A Frontier destination starts Neutral — no token on it
      (Section 8.1) — Discovery alone never grants control.
   Run this step on at least two separate turns, for each challenger,
   until each side has performed at least one Frontier Discovery and at
   least one Contested Discovery, so both costs get exercised on paper.

7. **Build a second Generator on a newly Discovered Planet.** On a Main
   Phase after Discovering a Planet, a challenger MAY build a Generator
   there. Place its "Generator" marker and that challenger's control
   token on the card the moment the Generator is played — control passes
   to whichever challenger most recently built a Generator on a Planet,
   or Captured it (Section 8.1).

8. **Add a Restriction to a Wormhole.** Pick a drawn line on the table
   with an endpoint at a Planet the active player controls, and write
   "one-way: [origin]→[destination]" on it — with that controlled
   Planet as the origin — narrating that **Bastion Lockdown Line** (Cost
   line: 2 Mass, the Cindral Reach card in
   *design/cards/wormhole-restrictions-set.md*) is the card just played
   to grant it a Directional Restriction (Section 8.4). Confirm aloud
   that a Wormhole with no such note may still be traversed either way,
   since no-Restriction is the default.

9. **Close a Wormhole.** Pick a different drawn line, cross it out
   fully, narrating that **Chokepoint Demolition Charge** (Cost line: 2
   Circuit, the Wrought Assembly card in
   *design/cards/wormhole-closure-cards.md*) is the card just played to
   Close it, and note that the two Planets it connected are no longer
   adjacent unless some other, un-Closed line also connects them
   (Section 8.5). Confirm aloud that this line MAY NOT be redrawn —
   reconnecting those same two Planets later would require paying for a
   brand-new Discovery action from scratch.

10. **Take an Assault action.** Once a challenger has a qualifying path
    — running only along un-crossed-out lines that carry no Restriction
    forbidding this challenger or this direction — from a Planet they
    control to a Planet they do not control, that challenger MAY take
    one Assault action on their Main Phase, under the same
    Queue-empty/priority timing as Discovery (Section 8.6):
    a. Trace the chosen path with a finger, out loud, planet by planet.
    b. Add up the Length written on every line along that path, and pay
       that many Fount Point counters.
    c. Choose **Blockade** — stick a "Blockaded" sticker on the target
       card; from the target's controller's next Generation Phase on,
       its Generator marker stops earning counters until its controller
       later pays that same amount again on their own Main Phase,
       removing the sticker — or, if the target is already Blockaded by
       this same challenger, choose **Capture** instead — flip the
       target's control token to the assaulting challenger's color,
       remove the "Blockaded" sticker, and move the Generator marker off
       the card into its owner's Wreck pile, since it is destroyed.
    A Homeworld card MAY be Blockaded this way but its control token MAY
    NEVER be flipped by a Capture.

11. **Replay Section 8.7's worked example once, on this same table.**
    Using the graph already on the table (or resetting to just the two
    Homeworlds if preferred), walk through Section 8.7's four numbered
    steps move for move — a Frontier Discovery to a new Planet, a
    Generator built there, an Assault that Blockades it, and a second
    Assault that Captures it — checking each physical action here
    against that worked example's text before moving to the next.

12. **Play to a conclusion.** Keep alternating turns (Section 5), taking
    further Discovery and Assault actions as the graph and each side's
    Fount Point income allow, until either challenger's Core Integrity
    tally reaches 0, or a challenger must draw from an empty Archive and
    cannot (Section 1) — either ends the game.

## What to watch for while playtesting

- After step 2, is the starting graph really just two cards with no line
  between them, for every game, every time? If a playtester's instinct
  is to add a third starting Planet or draw a starting connection,
  that's a signal Section 8.8's Map Setup rule isn't landing as written.
- After step 6, does a Contested Discovery visibly cost double a
  Frontier Discovery of the same Length, on the actual counters paid?
  That's the "aggression costs more" toll Section 8.3 states.
- After step 10, does the Blockaded Generator's marker visibly stop
  earning counters at the very next Generation Phase, and does Capture
  visibly move it to the Wreck rather than just crossing it out? Those
  are two different states (Blockade vs. Capture) and the physical
  materials should make the difference obvious at a glance.
