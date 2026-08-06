name: cardgame-winning-losing-conditions-rules
title: Winning & Losing Conditions Rules (Amaranth Expanse rules — game-end conditions)
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Fifth-plus design deliverable for the cardGame pilot: design/rules.md establishes Turn Structure, Resources, Priority & Timing, Zones, and (Section 8) the Spatial Battlefield's Capture mechanic, but no section anywhere states what happens when a Homeworld is captured or how a game ends. This unit adds a Winning & Losing Conditions section defining player elimination and game-end conditions, cross-referencing Section 8's existing Capture rule rather than redefining it, at the MTG-Comprehensive-Rules structural bar (T9) — numbered subsection, glossary-first terms, at least one worked edge-case example. Pure design/rules text; no code, no game software (T8).

## Acceptance Criteria

- AC1 [inferred]: design/rules.md gains a new numbered 'Winning & Losing Conditions' section defining at least one player-elimination condition, tied explicitly to the Homeworld Capture rule already defined in Section 8 by cross-referencing its section number rather than restating the mechanic
- AC2 [inferred]: The section states what ends the game (a single remaining un-eliminated player, or an explicit draw condition) and how remaining players' turns proceed once another player is eliminated
- AC3 [paraphrase]: The section includes at least one numbered worked example resolving a concrete game-end edge case (e.g. two players eliminated in the same turn), matching the MTG-Comprehensive-Rules-level rigor bar (T9) used by the shipped Spatial Battlefield section
- AC4 [inferred]: New terms introduced by this section (e.g. 'eliminated', 'game end') are added to the Section 2 glossary before substantive use, consistent with rules.md's existing glossary-first discipline
- AC5 [inferred] (held_out): The new section does not redefine or contradict the existing Section 8 Capture rule — it only adds the game-end consequence of capture, cross-referencing rather than restating the mechanic
