name: cardgame-core-rules
title: cardGame design phase 2 — core rules document (turn structure, resources, priority)
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Second design deliverable for the cardGame pilot (gamePlan.md is the source of truth for scope). This is a DESIGN unit, not software (T8): output is a markdown document a human reads and reacts to. design/world.md and the five design/races/*.md files are shipped and establish the setting, the five Founts (materials/biology/intelligence/technology/magic), and each race's primary/complementary/countering categories. This unit writes design/rules.md, the core rulebook that turns those categories into an actual playable game: turn structure and phase sequence, a resource system where each Fount maps to a concrete in-game resource or mechanic, and priority/timing rules resolving at least one basic edge case on paper. The structural bar is the MTG Comprehensive Rules (T9, local reference at C:/github/mtg-agent-arena/MagicTheGatheringComprehensiveRulesDocument.txt) — numbered sections, a glossary that defines every term before use, and edge cases resolved in the text rather than left ambiguous. Original content only; do not port Magic's specific rules or terms. Completing this gives future card-design units (Alpha set) a mechanical grammar to write cards against, and keeps the design phase moving toward the bar that would let RouterBox eventually ungate software (T9).

## Acceptance Criteria

- AC1 [user]: design/rules.md exists in the cardgame repo with a numbered top-level section structure (1., 2., 3., ...) covering at minimum Game Concepts, Turn Structure, Resources, Priority & Timing, and Zones.
- AC2 [user]: A glossary/vocabulary section defines every game term (e.g. priority, zone, resource pool) before or at its first substantive use elsewhere in the document.
- AC3 [inferred]: The Turn Structure section lists the full phase sequence for one turn as a numbered sub-list, stating what a player may and may not do in each phase.
- AC4 [paraphrase]: Each of the five Founts from design/world.md (The Mass, The Bloom, The Signal, The Circuit, The Skein) has an explicit resource or mechanic rule in the Resources section that names the Fount and ties the mechanic back to it — not restated flavor text.
- AC5 [inferred]: A Priority & Timing section defines active-player priority, passing, and what closes a priority window, and resolves at least one concrete timing edge case (e.g. simultaneous triggers, or a response arriving during resolution) on paper.
- AC6 [inferred] (held_out): The document includes a worked example — a numbered walkthrough of one full turn or one priority exchange — a reader could follow to check their own understanding, matching T9's 'edge cases resolved on paper' bar.
- AC7 [inferred] (held_out): design/rules.md contains no mention of code, APIs, databases, or software implementation anywhere — pure paper-game rules text, keeping the software gate closed per T8.
