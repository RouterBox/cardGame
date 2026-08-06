name: cardgame-design-readiness-section4-art-briefs-coverage-fix
title: Fix DESIGN-READINESS.md Section 4's stale art-brief coverage list and 'Known gap' bullet (both merged art-brief sets missing)
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/DESIGN-READINESS.md Section 4 currently reads: '`design/cards/art-briefs.md` — 44 art-brief sections, covering every card in `alpha-set.md`, `frontier-set.md`, `character-signatures.md`, `character-signatures-wave-2.md`, `fount-economy-set.md`, and `wormhole-restrictions-set.md`.' and its 'Known gap' bullet states 'the 3 cards in `spatial-race-identity-set.md` and the 5 cards in `wormhole-closure-cards.md` (8 cards total) have no brief in `art-briefs.md` yet.' Both claims are now false: the merged units cardgame-art-briefs-wormhole-closure and cardgame-art-briefs-spatial-race-identity (confirmed via memory/cardgame-art-briefs-spatial-race-identity.md, merged 2026-07-30T09:54:51Z) appended briefs for all 8 of those cards, bringing art-briefs.md to 52 '###' sections across 8 files. Edit only Section 4's coverage-list bullet (add 'wormhole-closure-cards.md' and 'spatial-race-identity-set.md' to the covered-file list, update the count from 44 to 52) and the 'Known gap' bullet (replace the 8-card-hole claim with a note that both sets are now covered, citing the two merged unit names). Do not touch Section 3's card-set inventory, Section 6's Open Gaps list (already the subject of two separate in-flight proposals), or any other section's substance.

## Acceptance Criteria

- AC1 [inferred]: design/DESIGN-READINESS.md Section 4's art-briefs.md coverage bullet lists 'wormhole-closure-cards.md' and 'spatial-race-identity-set.md' alongside the existing 6 file names
- AC2 [inferred]: That same bullet states the total art-brief section count as 52, not 44
- AC3 [inferred]: Section 4's 'Known gap' bullet no longer contains the claim that 3 spatial-race-identity-set.md cards or 5 wormhole-closure-cards.md cards lack a matching art-brief entry
- AC4 [inferred] (held_out): Section 3's card-set inventory and Section 6's Open Gaps list are present in the file byte-for-byte unchanged
- AC5 [paraphrase]: test/design-readiness.test.js's existing assertions still pass unmodified
