# cardgame-spatial-map-setup-and-playtest-procedure

- merged: 2026-07-28T11:53:07.335Z
- intent: design/ideas-inbox.md's spatial-layer directive (2026-07-26, verbatim: 'planets are nodes on a graph connected by wormholes of variable lengths. Generators are built on planets.') listed five implications to design through, including: 'Map setup is part of game setup (fixed maps? drafted maps? symmetric?) — needs a rules.md section and playtest-on-paper procedures.' The shipped cardgame-spatial-battlefield-rules unit delivered Section 8's graph mechanics (Planets, Wormholes, Discovery, Restrictions, Closure, Blockade & Capture, a worked example) at MTG-Comprehensive-Rules-level rigor (T9) but stopped short of this specific implication — there is no rule anywhere stating how a game's starting battlefield graph is assembled, and no playtest-on-paper walkthrough exists in the repo. T1 holds that MVP means the full decided scope, not the first working slice; this unit finishes the decided scope the spatial directive already named rather than letting the [incorporated] tag stand for partial delivery. This is pure rules-writing and a procedural document — no code, no game software — squarely inside the design phase (T8/T9) and I6.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review: cardgame-spatial-map-setup-and-playtest-procedure (cycle 2)

## Cycle 1 finding — verified fixed

Cycle 1 flagged an INTRODUCED self-contradiction in `### 8.8 Map Setup` point 3:
the old text justified a Homeworld's lack of placement by saying "no other Planet
is on the graph yet," which directly contradicted point 2's "the starting Planet
count is exactly two" (i.e. both Homeworlds *are* on the graph at setup).

The shipped diff now reads:

> 3. Each Homeworld's placement relative to the other Homeworld is simply
>    unconnected: map setup draws no Wormhole between them, so no adjacency
>    or path connects the two nodes and no distance or direction can be
>    measured across (Section 8.2, which already states the two Homeworlds
>    are never adjacent at the start of the game). No other Wormhole is
>    drawn during map setup either.

This grounds the "no placement" claim in connectivity (no Wormhole/edge between
the two Homeworld nodes) rather than in graph membership, and explicitly cites
Section 8.2 — consistent with point 2 (both Homeworlds exist on the graph) and
with 8.2's pre-existing adjacency rule. No contradiction remains. Confirmed
fixed.

## AC cove
