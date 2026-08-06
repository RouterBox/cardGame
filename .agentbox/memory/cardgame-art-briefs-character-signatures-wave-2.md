# cardgame-art-briefs-character-signatures-wave-2

- merged: 2026-07-29T11:11:16.909Z
- intent: design/cards/art-briefs.md states its own purpose as giving one written art brief per card so illustration work can be approved before it starts (T8), but character-signatures-wave-2.md (shipped, one named card per race built from a design/characters/ entry) has never had briefs written for it, leaving its 5 cards with no path through tools/composite-card-art.js's brief-driven compositing loop. This unit adds one new '###' brief section per wave-2 card to art-briefs.md, using the identical Palette/Subject-Scene/Key-visual-elements/Composition template already established for alpha-set.md and fount-economy-set.md, with each Palette line naming the card-anatomy.md Fount-identity color matching the single Fount in that card's own Cost line, and each Key-visual-elements list drawing concretely on that card's own Rules text and flavor text (e.g. Torel Ashgrave's uniform Ember Vanguard hulls, Rathe Ossuary-Kin's Growth counters, Doran Vex Amaranthine's Archive-reading, Ysolde Thane's Unwritten Sign, Foreman-Prime Yssa Ductile's singular reproduced pattern) rather than generic filler. It adds a new, independent test/design-art-briefs-character-signatures-wave-2.test.js mirroring the assertion shape of the existing design-art-briefs tests, so it has zero touch-overlap with the in-flight frontier-signatures unit or the open fount-economy-art-briefs proposal, both of which edit different files. No card file, rules.md, or the compositing/rendering code itself is touched — only art-briefs.md grows and a new test file is added.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-art-briefs-character-signatures-wave-2 (cycle 1)

## AC-by-AC verification

**AC1** — `design/cards/art-briefs.md` gains exactly 5 new `###` sections, titled verbatim, no pre-existing section touched.
Verified: diff is a pure append after line 549 (`@@ -546,3 +546,83 @@`), no existing line removed or altered. The 5 new headings match the required titles character-for-character:
`Torel Ashgrave, Line-Captain of the Ember Vanguard`, `Rathe Ossuary-Kin, Spore-Hound of the Sprawl`, `Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive`, `Ysolde Thane, Pilgrim of the Unwritten Sign`, `Foreman-Prime Yssa Ductile, Keeper of the First Pattern`. **PASS.**

**AC2** — Each brief's Palette line names the Fount-driven color matching the card's own Cost line, per `card-anatomy.md`'s Fount identity table.
Checked `design/cards/card-anatomy.md` directly (lines 47-51: Mass→Ash-grey, Bloom→Green, Signal→Cyan, Circuit→Copper, Tangle→Violet) against each new brief and each card's real Cost line in `character-signatures-wave-2.md`:
Torel (2 Mass)→"Palette: Ash-grey", Rathe (3 Bloom)→"Palette: Green", Doran (2 Signal)→"Palette: Cyan", Ysolde (2 Tangle)→"Palette: Vi
