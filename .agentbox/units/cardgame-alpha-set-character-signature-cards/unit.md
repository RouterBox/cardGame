name: cardgame-alpha-set-character-signature-cards
title: cardGame cards — Character Signature cards (one per race, tied to a named character)
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Add a new design/cards/character-signatures.md file containing exactly five new cards — one per race (the Cindral Reach, the Mireth Bloom, the Panoptic Concord, the Starweave Communion, the Wrought Assembly) — each built from a specific named character already described in that race's own file under design/characters/. Each card follows the canonical card template from rules.md Section 9.1 (Name, Cost line, Type line, Rules text, and, for Permanents, an optional Stats/counters line, always in that order), and each card's rules text or flavor text must explicitly name both the race it belongs to and the character it is based on, so the cross-reference is checkable by name rather than implied. This closes the gap the 2026-07-27 characters ideas-inbox entry named but did not yet deliver: named characters intended as future 'legendary/hero card identities' that no card has yet instantiated. It continues I6's MTG-Comprehensive-Rules-rigor bar (T9), the decided full scope of the design phase rather than stopping at the first working slice (T1), and mechanical, document-based acceptance criteria (T8). It deliberately does not touch design/cards/alpha-set.md, rules.md, or either tool under the pending Jaina/Leonardo security decisions.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/character-signatures.md exists and contains exactly 5 distinct named cards, one per race under design/races/.
- AC2 [inferred]: Every card in the file uses the canonical template from rules.md Section 9.1 in order (Cost line, then Type line, then Rules text, and, only for Permanents, an optional Stats/counters line after Rules text).
- AC3 [inferred]: Each card's combined rules text and flavor text names both its own race's title (as printed in that race's design/races/ file) and one specific named character drawn from that race's own file under design/characters/.
- AC4 [inferred] (held_out): No two signature cards name the same character, and a new test/design-signature-cards.test.js asserts this uniqueness alongside the count, template-order, and race/character cross-reference checks above.
