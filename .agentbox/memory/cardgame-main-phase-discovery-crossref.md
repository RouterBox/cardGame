# cardgame-main-phase-discovery-crossref

- merged: 2026-07-30T05:33:08.550Z
- intent: design/rules.md's Section 5 Phase Sequence (shipped) states the game's turn structure at the MTG-Comprehensive-Rules structural bar (T9) RouterBox set for this project, but Section 5.3 (Main Phase) still ends with a raw, unresolved dev note — '//discovering new planets, and creating new wormholes goes in this phase.' — left over from drafting, distinct from the six other `//` notes elsewhere in the file that three separate open or in-flight proposals already claim by section. This unit deletes that one comment line and replaces it with a proper rules-prose sentence stating that the Discovery action (already described earlier in the same Main Phase paragraph, Section 8.3) is how new Planets and Wormholes enter the battlefield graph, matching the sentence style already used elsewhere in Section 5. It touches only Section 5.3's text and adds one new test file; it does not rewrite Section 5.4's placeholder combat, does not touch Section 5.2 or Section 8, and does not invent any resolution for those sections' own open notes — finishing this one already-decided, narrowly-scoped gap (T1) without creating touch overlap with cardgame-conflict-phase-movement-rules, cardgame-graph-driven-generation, or cardgame-spatial-rules-notes-reconciliation.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-main-phase-discovery-crossref (cycle 2)

## AC coverage

- **AC1** (no raw `//discovering new planets...` line anywhere in
  design/rules.md): Satisfied, and unaffected by this diff — the raw
  comment was already removed by an earlier, unrelated merged unit
  (`cardgame-spatial-rules-notes-reconciliation`). Verified no `//`-prefixed
  line exists anywhere in the current file.

- **AC2** (Section 5.3 prose states Discovery creates new Planets/Wormholes
  and cross-references Section 8.3, in a full sentence not a comment):
  Satisfied by this diff's `fix` commit. Plan.md asserted this was already
  true pre-diff and that no edit to `design/rules.md` was needed — that
  premise was actually wrong. The pre-diff sentence read `"Discovery
  (Section 8.3), which can add a new Planet ... Wormhole, is one of the two
  special actions..."`. The new test's regex
  (`/Discovery[^.]*\b(Planet|Wormhole)\b/i`, run against whitespace-
  collapsed prose) requires no period between "Discovery" and
  "Planet"/"Wormhole" in the same clause — but `"8.3"` itself contains a
  period, so both occurrences of "Discovery" in the old text had a period
  intervening before reaching P
