# cardgame-world-star-atlas

- merged: 2026-07-29T06:08:19.117Z
- intent: design/rules.md Section 8.2 defines Homeworld as a mechanical concept and its own worked example (the Reva/Solmere, Toma/Kethis illustration) invents two placeholder planet names that belong to no established race. design/playtest-spatial.md's on-paper procedure instructs playtesters to label each side's starting Planet card with "that challenger's Homeworld's name" but no design document has ever supplied such a name for any of the five actual races (Cindral Reach, Mireth Bloom, Panoptic Concord, Starweave Communion, Wrought Assembly). design/world.md and design/races/*.md establish each race's identity, Fount, strengths, and visual style in depth, and design/lore.md traces six eras of shared history including the Cinderglass War that pulls in four of the five races directly — but none of these files, nor frontier-set.md's battlefield-graph-tied cards, ever name a single planet, system, or world. This unit adds a new design/star-atlas.md naming exactly one Homeworld per race, each consistent with that race's Fount identity (Materials/Biology/Intelligence/Technology/Magic) and with its role in lore.md's Cinderglass War (e.g., the Mireth Bloom entry must be consistent with lore.md's statement that the Bloom fought no battles in that war but inherited its wreckage), plus at least 3 further frontier or contested worlds that are nobody's Homeworld, giving playtest-spatial.md's Discovery concept and frontier-set.md's battlefield-graph cards real places to eventually reference by name. This is pure world-building prose, mechanically checkable by name-collision and cross-reference against the existing race/lore files — no rules.md, world.md, race file, card file, or code file is touched or needs to be, and no game software is implicated (T8).
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Review: cardgame-world-star-atlas (cycle 2)

## AC coverage

**AC1** — `design/star-atlas.md` names exactly one Homeworld per race, with a
distinct proper name, under a `### <Name> — Homeworld of the <Race>` heading
for each of the five race titles (Cindral Reach → Ashkeel, Mireth Bloom →
Fenwreath, Panoptic Concord → Vantaris, Starweave Communion → Ansareth,
Wrought Assembly → Corewright). **Met.**

**AC2** — Neither `Solmere` nor `Kethis` appears anywhere in the file
(checked by literal string search across the diff). All 8 named worlds (5
Homeworlds + Halvorne Junction, Kelmourn Drift, Tallowfen) have distinct
names, case-insensitively. **Met.**

**AC3** — Each Homeworld paragraph names its race's Fount in bold
(`**the Mass**`, `**the Bloom**`, `**the Signal**`, `**the Tangle**`,
`**the Circuit**` for Reach/Bloom/Concord/Communion/Assembly respectively,
matching `world.md`'s Cosmology mapping cited in plan.md). The Mireth
Bloom/Fenwreath entry explicitly states "no battles were fought on or from
Fenwreath, and the Mireth Bloom raised no fleet and took no side," matching
lore.md's stated Bloom role (inherits wreckage, didn't fight) per the plan's
citation. **Met.**

## INTRODUC
