name: cardgame-playtest-frontier-worlds-refresh
title: Narrate the Frontier Worlds Set in the spatial playtest procedure — 5 shipped cards, zero mentions in playtest-spatial.md
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/playtest-spatial.md is the step-by-step on-paper procedure that lets two humans playtest design/rules.md's spatial battlefield with physical materials, and it earns its rigor by citing an exact rules.md section for every action and, where a card exists, naming the real card producing that action instead of narrating a bare rule. Steps 8, 9, 10, and 12 already do this for the Wormhole Restriction, Wormhole Closure, and Spatial Race Identity card sets as each shipped — but design/cards/frontier-worlds-set.md (5 cards, one per race, each grounding a mechanic in Section 8.3 Discovery-family terms or Section 8.6 Blockade, each naming a specific Frontier/Contested world from design/star-atlas.md) has since shipped with no corresponding narration anywhere in the file. This unit adds one new step, following the established 'Narrate the ... cards on this same graph' sub-step pattern (steps 10 and 12), inserted before the closing 'Play to a conclusion' step, narrating all 5 Frontier Worlds Set cards against the graph state already on the table from steps 6 (Discovery) and 11 (Assault/Blockade): Halvorne Reclamation Fleet and Tanglekeeper's Vigil naming Halvorne Junction, Kelmourn Wreck-Bloom and Kelmourn Claim Ledger naming Kelmourn Drift, and Tallowfen Chokepoint Works naming Tallowfen — each with its real Cost line and the Section 8.3/8.6 term its own Rules text already cites. Every existing step's body text is otherwise untouched aside from the renumbering the insertion causes. A new, independent test/design-playtest-frontier-worlds-refresh.test.js verifies the new step names all 5 cards with correct Cost lines and world attributions, cross-checked against design/cards/frontier-worlds-set.md's actual on-disk text, and that no existing step's content changed.

## Acceptance Criteria

- AC1 [paraphrase]: design/playtest-spatial.md gains a new numbered step narrating the Frontier Worlds Set (design/cards/frontier-worlds-set.md), inserted before the final 'Play to a conclusion' step, following the same 'Narrate the ... cards on this same graph' sub-step pattern already used by steps 10 and 12.
- AC2 [paraphrase]: The new step names all 5 Frontier Worlds Set cards by exact heading: Halvorne Reclamation Fleet, Tanglekeeper's Vigil, Kelmourn Wreck-Bloom, Kelmourn Claim Ledger, Tallowfen Chokepoint Works.
- AC3 [paraphrase]: Each named card's Cost line in the new step matches its Cost line in frontier-worlds-set.md exactly: Halvorne Reclamation Fleet 2 Mass, Tanglekeeper's Vigil 2 Tangle, Kelmourn Wreck-Bloom 2 Bloom, Kelmourn Claim Ledger 1 Signal, Tallowfen Chokepoint Works 2 Circuit.
- AC4 [inferred] (held_out): The new step names the specific Frontier/Contested world each card's trigger condition targets — Halvorne Junction for Halvorne Reclamation Fleet and Tanglekeeper's Vigil, Kelmourn Drift for Kelmourn Wreck-Bloom and Kelmourn Claim Ledger, Tallowfen for Tallowfen Chokepoint Works — matching frontier-worlds-set.md's own world attributions.
- AC5 [paraphrase]: The new step cites Section 8.3 or Section 8.6 by number for each card, matching whichever section that card's own Rules text in frontier-worlds-set.md already cites.
- AC6 [inferred] (held_out): All previously existing numbered steps' body text in playtest-spatial.md, plus the Materials list and 'What to watch for' section, are unchanged aside from renumbering caused by inserting the new step.
- AC7 [inferred]: node --test passes for the whole cardGame suite, including a new test file asserting the above against both playtest-spatial.md and frontier-worlds-set.md's actual on-disk text.
