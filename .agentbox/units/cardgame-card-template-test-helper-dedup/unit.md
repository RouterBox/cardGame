name: cardgame-card-template-test-helper-dedup
title: Extract the duplicated Section 9.1 card-template check into a shared test helper
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

test/design-cards.test.js, test/design-frontier-cards.test.js, and test/design-signature-cards.test.js each independently implement the same Section 9.1 canonical-card-template check: a pair of tests per card asserting Cost line -> Type line -> Rules text appear in that order, and that a Stats/counters line only follows Rules text when the Type line contains 'Permanent'. The implementing code (the two test-body closures and their body.indexOf/regex logic) is byte-for-byte identical across all three files today. Three units already sitting in the ready queue (cardgame-fount-economy-generators, cardgame-wormhole-restriction-cards, cardgame-character-signature-cards-wave-2) each add a new card-set file that will need this exact check, meaning without intervention the same block gets pasted a fourth, fifth, and sixth time. This unit extracts the check into test/helpers/card-template.js (alongside the existing test/helpers/markdown.js parseSections helper already shared by all three files) as a single exported function taking a card's title and body and registering the same two node:test assertions, then updates all three existing test files to call it instead of defining their own copies. This is a pure test-code refactor with the exact same precedent as the already-shipped cardgame-tools-shared-parser-dedup and cardgame-tools-loader-dedup units: no design/*.md file, no rules.md, and no card content changes; only test/ files change, and the refactor must not change which assertions run or their pass/fail outcome against the current design/cards/*.md content.

## Acceptance Criteria

- AC1 [paraphrase]: test/helpers/card-template.js exists and exports a function that, given a card's title and body text, registers the same two checks currently duplicated in design-cards.test.js, design-frontier-cards.test.js, and design-signature-cards.test.js: Cost line -> Type line -> Rules text ordering, and Stats/counters line only present and only after Rules text when the Type line contains 'Permanent'.
- AC2 [paraphrase]: design-cards.test.js, design-frontier-cards.test.js, and design-signature-cards.test.js no longer contain their own inline implementation of the Cost/Type/Rules-text-order and Stats-line-only-if-Permanent checks — each calls the shared helper from test/helpers/card-template.js instead.
- AC3 [inferred] (held_out): Running `node --test` produces the same number of passing and failing tests for design-cards.test.js, design-frontier-cards.test.js, and design-signature-cards.test.js after the refactor as it did before, run against the current unmodified design/cards/*.md files.
- AC4 [inferred]: No file under design/ is modified by this unit — git diff against design/ is empty; only files under test/ change.
