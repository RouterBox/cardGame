# cardgame-wormhole-restriction-cards

- merged: 2026-07-29T06:40:24.287Z
- intent: design/rules.md Section 8.4 (shipped, part of cardgame-spatial-battlefield-rules) fully defines three kinds of Wormhole Restriction — Directional, Team, and Unit-type — but its own text states the Unit-type Restriction currently has no operative effect because no card yet lets a Unit move or deploy between Planets ('a design space this rulebook leaves open'), while a Directional or Team Restriction already changes what Section 8.6's Assault action can legally path through today. Across alpha-set.md, frontier-set.md, and character-signatures.md (28 cards total), only Wormhole Ledger (frontier-set.md, Panoptic Concord) ever reads a Restriction — no card creates one, even though the 2026-07-26 ideas-inbox spatial-layer directive explicitly named 'Restriction effects become a whole card design space (locks, keys, tolls)' as an implication to design through. This unit adds a new design/cards/wormhole-restrictions-set.md with 5 cards, one per race, each with Rules text that places a Directional Restriction or a Team Restriction (never a Unit-type Restriction, which stays out of scope per rules.md's own inert-until-future-cards statement) onto an existing Wormhole, citing Section 8.4 by number the same way frontier-set.md's cards cite their sections, and paid in that race's own Fount (Cindral Reach/Mass, Mireth Bloom/Bloom, Panoptic Concord/Signal, Starweave Communion/Tangle, Wrought Assembly/Circuit) consistent with every other shipped card file. No rules.md, alpha-set.md, frontier-set.md, or character-signatures.md change is needed or made — this only exercises an already-defined mechanic that has sat unused since it shipped.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-wormhole-restriction-cards, cycle 1

## AC coverage

**AC1** — `design/cards/wormhole-restrictions-set.md` exists with exactly 5
distinct `###` cards, one per race directory under `design/races/`
(Cindral Reach, Wrought Assembly, Mireth Bloom, Panoptic Concord, Starweave
Communion). Verified by direct inspection of the file's heading structure
(`# Wormhole Restrictions Set` → five `## The <Race>` → one `### <Card>`
each). Every card has Cost line → Type line → Rules text in that order.
Only "Rootbound Corridor" (Mireth Bloom) carries a Stats/counters line, and
its Type line contains "Permanent" — satisfied. "Bastion Lockdown Line" and
"Conveyance Directive" are Permanents without a Stats/counters line, which
is allowed: rules.md defines Stats/counters line as *optional* even for
Permanents (§9.1 template def, line 144-146), and the shipped
`frontier-set.md` precedent ("Replication Beachhead", a Generator
Permanent) already omits it the same way. Satisfied.

**AC2** — Checked rules.md §8.4 (lines 477-498) against each card's Rules
text:
- "Bastion Lockdown Line" and "Conveyance Directive" place a **Directional
  Restriction**, worded as "permitting travel o
