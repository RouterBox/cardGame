# cardgame-spatial-rules-notes-reconciliation

- merged: 2026-07-29T08:12:42.921Z
- intent: design/rules.md's Section 8 (Spatial Battlefield, shipped as part of cardgame-spatial-battlefield-rules) was drafted with several of RouterBox's own inline review notes left as raw `//` comments and one <strikethrough>-marked passage instead of being incorporated into finished, numbered rules prose — a violation of the MTG-Comprehensive-Rules structural bar T9 sets for this document (no contradictions, no unresolved marginalia). Four spots need reconciliation: the 8.1 passage stating a Unit's location is untracked, struck through and marked "Wrong" by RouterBox with a same-passage correction that Units are located at Planets and move between them via Wormholes ("the graph is the battlefield", superseding the implicit MTG-zone analogy); an unincorporated note on which Planets exist at game start; the 8.3 Discovery cost formula, which a RouterBox note says should be inverted (shorter Wormholes cost MORE Fount Points, being more valuable/easier to traverse) but which the adjacent shipped rule text still states as directly proportional to Length; and 8.6 Blockade & Capture, which a 2026-07-28 RouterBox note flags as merely "an ok start" needing a real combat tie-in — Units present at the target Planet dealing damage equal to the Planet's Generator count to Blockade, and that amount again to Capture — replacing today's shipped mechanic, which never references Units or damage at all. This unit rewrites these four spots into clean numbered prose (removing all raw comment/strikethrough markup in the process, including the 07/28 4:00pm review-checkpoint marker once its note is resolved), and updates 8.4's Unit-type Restriction description so it no longer claims to be inert/for-future-cards-only, since Unit location is now a real, current mechanic per the corrected 8.1. Only design/rules.md and its existing owning test file change; no card file, no other rules.md section, and no code outside the test file is touched. This is pure design/rules-text correctness work (T8), not game software.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-spatial-rules-notes-reconciliation, cycle 2

Scope of the diff reviewed: design/rules.md (Section 2 Glossary + Section 8
+ Sections 5.2-5.4), site/design/rules.html (generated), and
test/design-battlefield.test.js, cumulative from before this unit started
through the current HEAD (commit 419fb3b). Reviewed against unit.md's
visible ACs, plan.md, and the diff only.

Note on cycle 2 specifically: `git show 419fb3b` isolates cycle 2's own
delta from cycle 1 — it touches only design/rules.md (Sections 5.2, 5.3,
5.4) and the regenerated site/design/rules.html. Everything else in the
cumulative diff (Section 2 Glossary, Section 8.1/8.3/8.4/8.6/8.7, and the
new test block) was already present at the end of cycle 1.

## AC-by-AC

**AC1** (no `<strikethrough>` tags, no `//` lines "anywhere in the
document"): SATISFIED, document-wide. A direct grep of the post-diff file
for `^\s*//` and `strikethrough` returns zero matches anywhere in
design/rules.md — not just within Section 8. Cycle 1 had left 7 raw `//`
lines standing in Sections 5.2-5.4 (RouterBox's own notes on
graph-linked resource generation, Discovery/Main-Phase placement, and
unit-movement/"place-holder mag
