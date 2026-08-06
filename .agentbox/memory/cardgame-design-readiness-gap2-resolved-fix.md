# cardgame-design-readiness-gap2-resolved-fix

- merged: 2026-07-30T10:46:11.196Z
- intent: design/DESIGN-READINESS.md Section 3 already documents 'Spatial Race Identity Set, Wave 2 — 2 cards. Grounds the two remaining races (Mireth Bloom, Wrought Assembly) in the wormhole/battlefield graph, completing the wave-1 set above.' Yet Section 6's Open Gap 2 still reads 'The Spatial Race Identity Set only speaks for 3 of 5 races... The Mireth Bloom and the Wrought Assembly have no card in this wave' — a claim the wave-2 unit (shipped as cardgame-spatial-race-identity-cards-wave-2) already falsified. Since this document's entire purpose (per its own opening paragraph) is to make the I6 software-gate judgment call an informed one via file-citation-backed claims, a stale contradiction between two of its own sections undermines that purpose. Edit only the Open Gap 2 entry: replace its claim of an unresolved hole with a short resolved-status note citing design/cards/spatial-race-identity-set-wave-2.md by filename, and renumber the remaining gaps (art-brief coverage hole, no digital implementation, Jaina card-only) so the list stays a clean sequential numbered list. Do not touch Section 3's existing wave-2 description, the rulebook section list, the era timeline, or any other Open Gap's substance — only Gap 2's own text and the renumbering it requires.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-design-readiness-gap2-resolved-fix (cycle 1)

## Scope of diff
- `design/DESIGN-READINESS.md`: Open Gap 2's stale "3 of 5 races" entry replaced
  with an unnumbered "Resolved —" paragraph citing
  `spatial-race-identity-set-wave-2.md`; old items 3/4 renumbered to 2/3.
- `site/design/DESIGN-READINESS.html`: hand-edited to mirror the markdown change.
- `test/design-readiness-gap2-resolved.test.js`: new test file asserting AC1/AC2/AC3/AC5.

## AC-by-AC verification

- **AC1** — "no card in this wave" and "only speaks for 3 of 5 races" are both
  gone from the Open Gaps section (confirmed by direct read of the file, lines
  167-202). Satisfied.
- **AC2** — new paragraph opens "Resolved — the Spatial Race Identity Set now
  speaks for all 5 races." and its second sentence contains the verbatim
  substring `spatial-race-identity-set-wave-2.md`. Satisfied.
- **AC3** — Open Gaps section now has exactly three digit-leading lines: `1.
  **Art-brief...`, `2. **No digital...`, `3. **Jaina...` — sequential 1,2,3,
  no skips/repeats, ≥3 items. Verified against `test/helpers/markdown.js`'s
  `sectionText`/regex logic (same logic both the pre-existing AC5 test in
  `test/
