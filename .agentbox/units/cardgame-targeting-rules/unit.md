name: cardgame-targeting-rules
title: cardGame rules — Section 13: Targeting (legal targets, illegal-target fizzling)
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Extend design/rules.md with a new numbered top-level section, Targeting, closing a gap that Section 9's card examples (Cinderfall Bolt, Reactive Turret) and Section 2's Glossary leave open: several printed cards' rules text names a target ("any Unit") as part of resolving, but no section ever defines what a target is, when a challenger locks one in, or what happens if the chosen target stops being legal before the effect resolves (for example, a Response destroys the only targeted Unit first, per the existing Section 6 priority/Queue model). The section must state: a target is chosen at the moment the targeting card or ability is added to the Queue (Section 6), not when it resolves; a target must be legal both when chosen and rechecked immediately before the entry resolves (Section 6's Resolve); if an entry has one target and that target is not legal at the recheck, the entry does nothing and is still removed from the Queue (fizzles) rather than resolving against nothing or being replaced; this is appended after Section 12 (Combat Resolution) following the same append-only, no-renumbering pattern every prior rules-extension unit (spatial-battlefield-rules, deck-construction-rules, combat-resolution-rules) has used. This continues I6's MTG-Comprehensive-Rules-rigor bar (T9), the decided full scope of the design phase (T1) rather than stopping at the currently-complete-looking rules.md, and T14's game-only focus — acceptance criteria are mechanical document checks, per the working pattern for rules units.

## Acceptance Criteria

- AC1 [paraphrase]: design/rules.md contains a new numbered top-level section titled 'Targeting' appended immediately after the current Section 12 (Combat Resolution), and every previously-existing section keeps its original number and title unchanged.
- AC2 [inferred]: The Targeting section states that a target is chosen at the moment the targeting card or ability is added to the Queue (Section 6), not later, and that the target must be legal at that moment.
- AC3 [inferred]: The Targeting section states that a target's legality is rechecked immediately before the entry resolves, and states what happens if an entry with exactly one target finds that target illegal at that recheck (the entry does nothing and is removed from the Queue, i.e. fizzles).
- AC4 [inferred] (held_out): The Targeting section includes a worked example, in the style of Sections 7/8.7/10.3/12.5, tracing a Fast card (e.g. Cinderfall Bolt) whose sole target is destroyed by a Response before it resolves, confirming the card fizzles instead of resolving against nothing; a new test/design-targeting.test.js asserts section numbering, the definition/timing rule, the fizzle rule, and the presence of this worked example.
