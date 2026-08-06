# cardgame-art-briefs-wormhole-closure

- merged: 2026-07-30T05:30:40.241Z
- intent: design/cards/art-briefs.md (shipped) states its own purpose as giving one written art brief per card so illustration work can be approved before it starts (T8), and tools/composite-card-art.js's loadBriefs() drives its whole compositing loop off exactly that file's '###' sections — a card absent from art-briefs.md is permanently un-renderable. design/cards/wormhole-closure-cards.md (shipped) added 5 named cards, one per race, each Closing an existing Wormhole per rules.md Section 8.5: Bastion Seal Detachment (Cindral Reach, 2 Mass), Withering Conduit Rot (Mireth Bloom, 2 Bloom), Severance Directive (Panoptic Concord, 1 Signal), Rite of the Sealed Tangle (Starweave Communion, 2 Tangle), Chokepoint Demolition Charge (Wrought Assembly, 2 Circuit) — with no corresponding briefs ever written. This unit adds one new '###' brief section per card to art-briefs.md, following the identical Palette/Subject-Scene/Key-visual-elements/Composition template the file already uses for alpha-set.md, wormhole-restrictions-set.md, and fount-economy-set.md, with each Palette line naming the single card-anatomy.md Fount-identity color matching the one Fount in that card's own Cost line, and each Key-visual-elements list drawing concretely on that card's own rules text and flavor text (e.g. Bastion Seal Detachment's welded-shut border, Withering Conduit Rot's overtaken lining, Severance Directive's issued order outpacing the reader, Rite of the Sealed Tangle's returning-to-shape framing, Chokepoint Demolition Charge's single charge/pulse) rather than generic filler. It adds a new, independent test/design-art-briefs-wormhole-closure.test.js mirroring the assertion shape of the existing design-art-briefs tests, so it has zero touch-overlap with the open wormhole-restrictions or fount-economy art-briefs work, or with the open art-brief-test-helper-dedup proposal's edits to the shared test/design-art-briefs.test.js. No card file, rules.md, or the compositing/rendering code itself is touched — only art-briefs.md grows and a new test file is added.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-art-briefs-wormhole-closure (cycle 1)

## AC accounting

**AC1** — `design/cards/art-briefs.md` gains exactly 5 new `###` sections, titled exactly
'Bastion Seal Detachment', 'Withering Conduit Rot', 'Severance Directive', 'Rite of the Sealed
Tangle', 'Chokepoint Demolition Charge', with no pre-existing brief altered.
**PASS.** The diff hunk against `art-briefs.md` starts at line 707 (after the existing last
brief's closing line, unchanged) and only *adds* lines — nothing above the insertion point is
touched, removed, or reordered. All 5 titles match verbatim, one `###` each, nested under a new
`## Wormhole Closure Cards — Sealing the Battlefield Graph` heading, following the same
Palette/Subject-Scene/Key-visual-elements/Composition template as every sibling set.

**AC2** — Palette line names the single Fount-driven color matching the card's own Cost line.
**PASS** for all 5:
- Bastion Seal Detachment (Cost: 2 Mass) → Palette: Ash-grey ✓
- Withering Conduit Rot (Cost: 2 Bloom) → Palette: Green ✓
- Severance Directive (Cost: 1 Signal) → Palette: Cyan ✓
- Rite of the Sealed Tangle (Cost: 2 Tangle) → Palette: Violet ✓
- Chokepoint Demolition Charge (Cost: 2 C
