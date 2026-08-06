name: cardgame-character-signature-cards-wave-2
title: Second wave of character signature cards, one more per race
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/characters/cindral-reach.md, mireth-bloom.md, panoptic-concord.md, starweave-communion.md, and wrought-assembly.md each name exactly 4 characters (20 total across the five races), per the 2026-07-27 RouterBox directive captured in design/ideas-inbox.md calling for 3-5 interlinking characters per race. design/cards/character-signatures.md (shipped, enforced by test/design-signature-cards.test.js) graduated exactly one character per race into a playable card, following rules.md Section 9.1's canonical template. This unit adds a second card per race, in a NEW file (design/cards/character-signatures-wave-2.md) with its own test file — it does not edit character-signatures.md or its test, so the shipped wave-1 file, roster, and test stay byte-identical (T12: never let a later unit's writes land on or disturb an earlier unit's shipped artifact). Each new card names its race's title (as printed in design/races/) and exactly one character from that race's own characters file, distinct from the character already named in wave 1 (cross-checked against both files so no character is signed twice). No rules.md change is needed since Cost/Type/Rules-text/Stats-line and the Generator/Unit/Permanent vocabulary the cards may use are already-defined mechanics.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/character-signatures-wave-2.md exists and contains exactly 5 distinct named cards, one per race under design/races/, and none of the 5 names collides with any name in design/cards/character-signatures.md.
- AC2 [paraphrase]: Every card in the new file has a Cost line, Type line, and Rules text in that order, and only carries a Stats/counters line after Rules text when its Type line contains 'Permanent' — the same template enforced by test/design-signature-cards.test.js for the shipped wave.
- AC3 [inferred]: Each of the 5 new cards' combined rules text and flavor text names both its own race's title (as printed in that race's design/races/ file) and exactly one character drawn from that race's own design/characters/ file, and that named character is not the one already named in design/cards/character-signatures.md.
- AC4 [inferred] (held_out): design/cards/character-signatures.md, design/cards/alpha-set.md, design/cards/frontier-set.md, and all files under design/characters/ and design/races/ are byte-identical to before this unit — only the new card file and its new test file are added.
