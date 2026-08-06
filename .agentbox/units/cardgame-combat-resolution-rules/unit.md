name: cardgame-combat-resolution-rules
title: cardGame rules — Combat Resolution (blocked damage, multi-block assignment, lethal destruction)
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Extend design/rules.md with a new numbered top-level section, Combat Resolution, closing the gap Section 5.4 (Conflict Phase) leaves open: it defines the unblocked-attacker case (damage to Core Integrity) but never states what happens when an attacker IS blocked. The section must state that a blocked attacker deals its combat strength as damage to its blocker(s) instead of Core Integrity; that when more than one blocker is declared against a single attacker, the attacking player chooses the order in which damage is assigned among them (mirroring the existing convention in Section 6.1 that ties order-choice to the acting/active player); that a Unit carrying accumulated damage at least equal to its combat strength is destroyed and moved to its owner's Wreck (Section 3); and when damage marked on Units is cleared (end of the Conflict Phase or end of turn — the unit must pick one and state it). It is appended after whichever section is currently last, matching the pattern every prior rules-extension unit (spatial-battlefield-rules, map-setup-and-playtest-procedure, deck-construction-rules) has followed, so no already-numbered section is renumbered. This continues I6's MTG-Comprehensive-Rules-rigor bar (T9) and the decided full scope of the design phase (T1), with acceptance criteria as mechanical document checks per T8.

## Acceptance Criteria

- AC1 [paraphrase]: design/rules.md contains a new numbered top-level section titled 'Combat Resolution' appended after the current last top-level section, and every previously-existing section keeps its original number and title unchanged.
- AC2 [inferred]: The Combat Resolution section states that a blocked attacker deals its combat strength as damage to its blocker(s) rather than to the non-active player's Core Integrity.
- AC3 [inferred]: The Combat Resolution section states who chooses the damage assignment order when a single attacker has more than one blocker.
- AC4 [inferred] (held_out): The Combat Resolution section states that a Unit with accumulated damage at least equal to its combat strength is destroyed and moved to its owner's Wreck, and states when marked damage on Units is cleared; a new test/design-combat.test.js asserts both facts alongside the section-numbering and blocked-damage checks above.
