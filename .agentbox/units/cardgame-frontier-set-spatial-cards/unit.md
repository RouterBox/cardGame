name: cardgame-frontier-set-spatial-cards
title: cardGame cards — Frontier Set (5 cards that actually use the spatial battlefield graph)
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Add a new design/cards/frontier-set.md file containing exactly five new cards — one per race (the Cindral Reach, the Mireth Bloom, the Panoptic Concord, the Starweave Communion, the Wrought Assembly) — each mechanically tied to the spatial battlefield graph shipped in rules.md Section 8 (Planets, Wormholes, Discovery, Restriction, Closure, Assault, Blockade, Capture). Each card follows the canonical card template from rules.md Section 9.1 (Name, Cost line, Type line, Rules text, and, for Permanents, an optional Stats/counters line, always in that order), and each card's rules text must name one specific Section 8 term and cite the subsection number that defines it, so the tie between card and spatial rule is checkable by name rather than merely thematic. This closes a real, previously-unaddressed gap: two card-shipping units (alpha-set-starter-cards) and two spatial-layer units (spatial-battlefield-rules, spatial-map-setup-and-playtest-procedure) have shipped, but no card built since either spatial unit landed references the graph at all. It continues I6's MTG-Comprehensive-Rules-rigor bar (T9), the decided full scope of the design phase rather than stopping at the first working slice (T1), and mechanical, document-based acceptance criteria (T8). It deliberately does not touch design/rules.md, design/cards/alpha-set.md, or design/cards/character-signatures.md.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/frontier-set.md exists and contains exactly 5 distinct named cards, one per race under design/races/.
- AC2 [inferred]: Every card uses the canonical template from rules.md Section 9.1 in order (Cost line, then Type line, then Rules text, and, only for Permanents, an optional Stats/counters line after Rules text).
- AC3 [inferred]: Each card's rules text names at least one of: Discovery, Restriction, Closure, Assault, Blockade, or Capture, and cites the specific rules.md Section 8 subsection number that defines the named term.
- AC4 [inferred] (held_out): No two Frontier Set cards name the same race, and a new test/design-frontier-cards.test.js asserts this alongside the count, template-order, and spatial-term-citation checks above.
