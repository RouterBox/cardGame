# cardgame-alt-art-briefs-signal-tangle

- merged: 2026-07-29T12:06:01.708Z
- intent: design/cards/alt-art-briefs.md (shipped) and tools/composite-card-art.js's second, parallel compositing pass (shipped) together define and prove the Alt-Art layer card-anatomy.md's 'The Layers' section describes, but the brief file itself only ever named 3 cards — one from Bloom, Mass, and Circuit — leaving Signal and Tangle as the only two of the game's 5 Founts with no Alt-Art path at all. This unit adds one new '###' brief section each for Foreknowledge Cipher (2 Signal, Panoptic Concord, already base-briefed in art-briefs.md) and Unwritten Hour (3 Tangle, Starweave Communion, already base-briefed in art-briefs.md), following the identical Palette/Subject-Scene/Key-visual-elements/Composition template the 3 existing alt briefs use, with each Subject/Scene describing a genuinely different scene from that card's existing base brief (sharing fewer than half its significant words, matching test/design-alt-art-briefs.test.js's existing AC2 check) rather than a restatement. It updates the two existing test files that currently hardcode the count '3' — test/design-alt-art-briefs.test.js's EXPECTED_TITLES array and test/composite-card-art-alt.test.js's fixture sanity-check assertion — to reflect 5, the same kind of existing-test-count-bump the original alt-art-briefs-compositing unit itself made to composite-card-art.test.js. No card file, base brief, rules.md, or the compositing/rendering source code itself is touched — only alt-art-briefs.md grows and its two owning test files' hardcoded counts move from 3 to 5.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-alt-art-briefs-signal-tangle (cycle 1)

## AC accounting

**AC1** — `design/cards/alt-art-briefs.md` gains exactly 2 new `###` sections, titled
`Foreknowledge Cipher` and `Unwritten Hour` verbatim, bringing the file to 5 total.
Verified by reading the full file: the 3 pre-existing sections (Sporeknit Warden,
Salvage-Wrought Bastion, Replicant Foundry Core) are byte-for-byte untouched except
for the diff hunk context; only the intro paragraph's first sentence and the two new
`###` sections at the end changed. The intro-paragraph edit only touches prose (not a
`###` section) and was explicitly permitted as optional in plan.md step 1c. **PASS.**

**AC2** — Each new alt brief has Palette/Subject-Scene/Key-visual-elements(2+
bullets)/Composition lines in the same shape as the 3 existing briefs (both have 3
bullets), and each Subject/Scene line must share fewer than half its significant
words with the same card's base brief Subject/Scene line in `art-briefs.md`. I
manually ran the exact algorithm `test/design-alt-art-briefs.test.js` uses
(`significantWords` + stopword list) against the real `art-briefs.md` text:
- Foreknowledge Cipher: alt Subject/Scene has 28 s
