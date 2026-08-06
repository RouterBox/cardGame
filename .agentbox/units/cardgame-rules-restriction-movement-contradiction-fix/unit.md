name: cardgame-rules-restriction-movement-contradiction-fix
title: Fix rules.md's Section 8.1/8.4 contradiction over whether Restrictions govern future Unit movement — resolve the hedge, don't leave it open
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/rules.md Section 8 (Spatial Battlefield) was drafted, then partially reconciled by the merged cardgame-spatial-rules-notes-reconciliation unit, which closed four named open-note/contradiction spots but did not touch a fifth: Section 8.1's paragraph on Unit location (lines 452-472) states unconditionally that 'any such movement, however granted, must still traverse a Wormhole that is not Closed (Section 8.5) and whose Restrictions (Section 8.4) permit it' — treating Restrictions in general, not just Unit-type Restriction, as movement-gating. Section 8.4 (lines 536-564), by contrast, explicitly hedges: after defining Directional, Team, and Unit-type Restrictions and stating a Unit-type Restriction 'governs such movement directly,' it adds 'Whether a Directional or Team Restriction also limits a future rule's or card's Unit movement (Section 8.1), and not only an Assault's path (Section 8.6), is an open question this section does not resolve.' Rewrite Section 8.4's final paragraph (replacing the 'is an open question this section does not resolve' sentence) to state definitively that a Directional or Team Restriction governs future Unit movement exactly as it already governs an Assault's path — i.e. movement across a Wormhole respects the same Directional/Team constraints Assault already respects, matching Section 8.1's unconditional 'Restrictions (Section 8.4) permit it' wording and removing the contradiction. Do not change what a Unit-type Restriction does (it remains the one Restriction kind already stated, elsewhere, to govern movement — this unit's change is additive to Directional/Team, not a revision of Unit-type's status), do not touch Section 8.1's own wording (it is already correct and is the anchor this fix aligns 8.4 to), and do not touch any other section of rules.md, any card file, or any other test file. Extend test/design-battlefield.test.js with one new assertion that Section 8.4's text contains no 'open question this section does not resolve' hedge (or equivalent unresolved-marginalia phrasing) about Restriction-governed movement, alongside its existing Section 8 checks, which must all still pass. Regenerate site/design/rules.html via tools/build-site.js.

## Acceptance Criteria

- AC1 [inferred]: design/rules.md Section 8.4 no longer contains a sentence stating it is an open/unresolved question whether a Directional or Team Restriction governs future Unit movement
- AC2 [paraphrase]: design/rules.md Section 8.4 states definitively that a Directional or Team Restriction governs future Unit movement (Section 8.1) in addition to an Assault's path (Section 8.6), consistent with Section 8.1's existing unconditional wording
- AC3 [inferred] (held_out): Unit-type Restriction's existing, already-confirmed governance of movement (Section 8.4's Unit-type Restriction paragraph) is textually unchanged
- AC4 [inferred]: Section 8.1's own paragraph on Unit location and movement, every other section of design/rules.md, and every design/cards/*.md file are byte-for-byte unchanged
- AC5 [paraphrase]: test/design-battlefield.test.js passes with one new assertion added for the resolved hedge, and site/design/rules.html is regenerated via tools/build-site.js to match the updated markdown
