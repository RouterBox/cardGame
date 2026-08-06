name: cardgame-fount-economy-generators
title: Close the Bloom/Signal/Tangle Generator gap the full-game playtest found
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/playtest-full-game.md (shipped) played a complete game under the current 28-card pool across design/cards/alpha-set.md, frontier-set.md, and character-signatures.md, and its closing 'What This Playtest Surfaced' section documents, with a table checkable against those three files, that Mass is the only Fount with both a Generator and a card cheap enough (1 point) to replay after the Generator; Circuit has a Generator but no 1-cost card; Bloom and Tangle have neither a Generator nor a 1-cost card; Signal has a 1-cost card (Whispered Contract) but no Generator. Because Section 4 empties resource pools every turn and Section 5.2 lets only an already-controlled Generator produce points, this caps every deck at 1 Fount Point/turn forever and makes Combat, Discovery past Length 1, and Capture unreachable through ordinary play. This unit adds exactly the 6 cards the playtest document's own recommendation names to close that gap: a Generator permanent for Bloom (Mireth Bloom/Biology), Signal (Panoptic Concord/Intelligence), and Tangle (Starweave Communion/Magic), each following the existing Generator rules-text pattern from Salvage-Wrought Bastion/Replicant Foundry Core and citing Section 5.2; plus a 1-cost card for Circuit (Wrought Assembly/Technology), Bloom (Mireth Bloom/Biology), and Tangle (Starweave Communion/Magic). All 6 cards live in a new design/cards/fount-economy-set.md file, following the canonical Section 9.1 template already enforced by test/design-frontier-cards.test.js and test/design-cards.test.js, with a matching test/design-fount-economy-cards.test.js. No existing card file is touched, and no rules.md change is needed since Generators and costs are already-defined mechanics being applied to the three under-served Founts.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/fount-economy-set.md exists and contains exactly 6 distinct named cards, each with Cost line, Type line, and Rules text in that order (and a Stats/counters line, only if present, only on Permanents) — the same template test/design-frontier-cards.test.js already enforces for frontier-set.md.
- AC2 [paraphrase]: Exactly one of the 6 cards is a Permanent whose rules text reads as a Generator attuned to Bloom, exactly one to Signal, and exactly one to Tangle, each producing 1 point of that Fount during the Generation Phase and citing Section 5.2, matching the existing 'This permanent is a Generator attuned to the <Fount>' pattern used by Salvage-Wrought Bastion and Replicant Foundry Core.
- AC3 [paraphrase]: Exactly one of the 6 cards (distinct from the three Generators above) has a Cost line of exactly '1 Circuit', exactly one has 'exactly 1 Bloom', and exactly one has exactly '1 Tangle'.
- AC4 [inferred] (held_out): design/cards/alpha-set.md, design/cards/frontier-set.md, and design/cards/character-signatures.md are byte-identical to before this unit, and each new card's flavor text names the correct race per the existing Cindral Reach/Mireth Bloom/Panoptic Concord/Starweave Communion/Wrought Assembly-to-Fount mapping used in frontier-set.md.
