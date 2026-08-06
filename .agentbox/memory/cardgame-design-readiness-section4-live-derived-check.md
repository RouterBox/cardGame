# cardgame-design-readiness-section4-live-derived-check

- merged: 2026-07-31T01:26:16.934Z
- intent: design/DESIGN-READINESS.md exists to make the software-gate judgment call (I6) an informed one, with a file citation for every claim (T9's structural-rigor bar). Section 3's card-set list already learned T12's lesson — test/design-readiness.test.js's AC3/AC6 re-derives it live from design/cards/*.md via lib/parse-card-markdown.js's loadCardsFromFile so it cannot silently drift. Section 4 ("Card Anatomy & Art Brief Coverage") never got the same treatment: its sentence naming which card-set files are fully covered by design/cards/art-briefs.md's brief sections is hand-typed, and design/cards/spatial-race-identity-set-wave-2.md's 2 cards (Bloom Fount, Circuit Fount, both already briefed at art-briefs.md lines 832 and 844) are missing from it. Add a new test in test/design-readiness.test.js: for every file under design/cards/ that loadCardsFromFile parses to 1+ cards, extract that file's card names, then check whether every one of those names appears as a "###" heading anywhere in design/cards/art-briefs.md (parsed the same way test/design-alt-art-briefs.test.js's helpers already scan that file's headings); if and only if every card name is found, assert the DESIGN-READINESS.md Section 4 section text (use the existing sectionText/parseSections helpers already imported in this test file, matched against the section titled "Card Anatomy & Art Brief Coverage") includes that filename. Do not require citation for any file with partial or zero art-brief coverage (e.g. character-signatures-wave-3.md today) — the check is coverage-driven, not disk-presence-driven, so it does not race with the still-open art-briefs-character-signatures-wave-3 proposal. Then update design/DESIGN-READINESS.md Section 4's sentence (lines 126-130) to add "spatial-race-identity-set-wave-2.md" to the list of covered files, making the new test GREEN. Do not change Section 4's card-anatomy paragraph, alt-art-briefs.md paragraph, the "Known gap — resolved" bullet, any other section of DESIGN-READINESS.md, or any file under design/cards/ — this unit only adds the one missing filename to Section 4's existing sentence and adds the new mechanical test. Regenerate site/ via tools/build-site.js.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-design-readiness-section4-live-derived-check (cycle 1)

## Verification performed

Read the diff, then cross-checked against the actual repo file state (not just
the diff text): `design/DESIGN-READINESS.md` Section 4, `test/design-readiness.test.js`
(full file), `lib/parse-card-markdown.js`, `test/helpers/markdown.js`, and grepped
`### ` headings in every `design/cards/*.md` file plus `art-briefs.md`.

- `art-briefs.md` has exactly 59 `###` headings — matches the unchanged "59
  art-brief sections" count in Section 4.
- `spatial-race-identity-set-wave-2.md` has exactly 2 cards: "Bloom Fount"
  (line 30) and "Circuit Fount" (line 48), both present verbatim as `###`
  headings in `art-briefs.md` (lines 832, 844). Fully covered — the new
  filename citation is correct.
- Manually re-derived full coverage for all 10 card-set files the new AC7
  test will assert citation for (alpha-set.md, frontier-set.md,
  character-signatures.md, character-signatures-wave-2.md,
  character-signatures-wave-3.md, fount-economy-set.md,
  wormhole-restrictions-set.md, wormhole-closure-cards.md,
  spatial-race-identity-set.md, spatial-race-identity-set-wave-2.md): every
  card na
