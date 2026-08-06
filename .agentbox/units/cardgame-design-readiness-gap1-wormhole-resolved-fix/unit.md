name: cardgame-design-readiness-gap1-wormhole-resolved-fix
title: Fix DESIGN-READINESS.md's stale Open Gap 1 (wormhole-closure half already resolved by shipped art briefs)
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/DESIGN-READINESS.md Section 6, Open Gap 1 reads: 'Art-brief coverage has an 8-card hole. None of the 3 cards in design/cards/spatial-race-identity-set.md or the 5 cards in design/cards/wormhole-closure-cards.md have a matching entry in design/cards/art-briefs.md...' This is now half-false: design/cards/art-briefs.md (verified by grep of its own '###' headings) already contains entries for all 5 wormhole-closure-cards titles (Bastion Seal Detachment, Withering Conduit Rot, Severance Directive, Rite of the Sealed Tangle, Chokepoint Demolition Charge), shipped by the already-merged unit cardgame-art-briefs-wormhole-closure (T24: confirmed merged at commit a2ee234). Edit only Open Gap 1's own text: narrow its claim to the 3 remaining uncovered cards in spatial-race-identity-set.md (Preemptive Survey, Unbound Passage, Chokepoint Garrison), state that the wormhole-closure-cards half is resolved, and cite design/cards/art-briefs.md as the file where those 5 briefs now live. Do not touch Section 3, Section 4's 'Known gap' note, any other Open Gap entry's substance, or the numbered-list numbering beyond what this edit itself requires — leave Gap 2, 3, and 4 untouched (Gap 2 is already the subject of a separate in-flight proposal).

## Acceptance Criteria

- AC1 [inferred]: design/DESIGN-READINESS.md's Open Gap 1 no longer contains the claim that the 5 wormhole-closure-cards cards lack a matching art-brief entry
- AC2 [inferred]: Open Gap 1's text now states that design/cards/art-briefs.md already covers the wormhole-closure-cards set, naming that file verbatim, and narrows the remaining hole to the 3 cards in spatial-race-identity-set.md
- AC3 [paraphrase]: The Open Gaps section still parses as a sequential numbered list (1., 2., 3., ... no skipped or repeated numbers) with at least 3 items, so test/design-readiness.test.js's existing AC5 assertion continues to pass unmodified
- AC4 [inferred] (held_out): Section 3's card-set inventory and Section 4's 'Known gap' note are present in the file byte-for-byte unchanged
- AC5 [paraphrase]: Open Gaps 2, 3, and 4 each still appear with their original substantive text intact, only renumbered if the edit requires it
