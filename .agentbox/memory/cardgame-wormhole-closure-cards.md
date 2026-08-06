# cardgame-wormhole-closure-cards

- merged: 2026-07-29T07:31:45.433Z
- intent: design/rules.md Section 8.5 (shipped, part of cardgame-spatial-battlefield-rules) fully defines Wormhole Closure: a Wormhole MAY be Closed only by a card or effect that states it (no default action Closes one), and once Closed it is permanently removed from the battlefield graph, may never be traversed, counted along an Assault path, have its Restrictions changed, or be reopened — a new Discovery is required between the same two Planets. Despite this being one of the two card design spaces the 2026-07-26 ideas-inbox spatial-layer directive explicitly named ('wormholes can be closed... cut a chokepoint, strand a fleet, seal your flank'), a search of every printed card file (alpha-set.md, frontier-set.md, character-signatures.md) for a card that Closes a Wormhole returns zero results. This unit adds a new design/cards/wormhole-closure-cards.md with 5 cards, one per race, each with Rules text that Closes an existing Wormhole, citing 'Section 8.5' by number the same way frontier-set.md's cards cite their sections, paid in that race's own Fount (Cindral Reach/Mass, Mireth Bloom/Bloom, Panoptic Concord/Signal, Starweave Communion/Tangle, Wrought Assembly/Circuit) consistent with every other shipped card file, and using the same Cost/Type/Rules-text/Stats-line template test/design-frontier-cards.test.js already enforces for frontier-set.md. This is a distinct mechanic and a distinct new file from the currently-open cardgame-wormhole-restriction-cards proposal (which covers only Section 8.4 Directional/Team Restrictions) — no overlap in file, mechanic, or card names. No rules.md, alpha-set.md, frontier-set.md, or character-signatures.md change is needed or made.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Review: cardgame-wormhole-closure-cards, cycle 1

## Scope

Diff adds `design/cards/wormhole-closure-cards.md` (5 cards), a dedicated
test file `test/design-wormhole-closure-cards.test.js`, 5 new SVGs under
`renders/cards/`, and regenerated `site/**` output (nav siblings + index) for
the new page. No existing card file, no `rules.md`, no `wormhole-restrictions-
set.md` content was touched.

## AC-by-AC verification

**AC1** (file exists, exactly 5 distinct cards, one per race, Cost → Type →
Rules text order, Stats/counters line only when Type line contains
'Permanent'):
- File exists with 5 `###` cards: Bastion Seal Detachment (Cindral Reach),
  Withering Conduit Rot (Mireth Bloom), Severance Directive (Panoptic
  Concord), Rite of the Sealed Tangle (Starweave Communion), Chokepoint
  Demolition Charge (Wrought Assembly).
- Confirmed via `design/races/*.md` (5 files present, one per race) that each
  card's flavor text names exactly one race, and no race name appears in more
  than one card body — the new test's per-race "exactly one card" checks
  will pass.
- Cost → Type → Rules text order holds for all 5 (checked field indices by
  hand).
- Only Bastion Seal Detachment carries
