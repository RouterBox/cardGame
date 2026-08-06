# cardgame-art-briefs-wormhole-restrictions

- merged: 2026-07-29T12:00:01.875Z
- intent: design/cards/art-briefs.md (shipped) states its own purpose as giving one written art brief per card so illustration work can be approved before it starts (T8), and tools/composite-card-art.js's loadBriefs() drives its entire compositing loop off exactly that file's '###' sections — a card absent from art-briefs.md is permanently un-renderable. design/cards/wormhole-restrictions-set.md (shipped) added 5 named cards, one per race — Bastion Lockdown Line (Cindral Reach, 2 Mass), Conveyance Directive (Wrought Assembly, 2 Circuit), Rootbound Corridor (Mireth Bloom, 2 Bloom), Vector Interdiction (Panoptic Concord, 1 Signal), Pilgrim's Right of Way (Starweave Communion, 2 Tangle) — with no corresponding briefs ever written. This unit adds one new '###' brief section per card to art-briefs.md, following the identical Palette/Subject-Scene/Key-visual-elements/Composition template the file already uses for alpha-set.md and fount-economy-set.md, with each Palette line naming the single card-anatomy.md Fount-identity color matching the one Fount in that card's own Cost line (Ash-grey for Mass, Copper for Circuit, Green for Bloom, Cyan for Signal, Violet for Tangle), and each Key-visual-elements list drawing concretely on that card's own rules text and flavor text (e.g. Bastion Lockdown Line's one-way welded door, Conveyance Directive's one-way outward flow, Rootbound Corridor's growth taking root in a Wormhole, Vector Interdiction's manifest/route-writing, Pilgrim's Right of Way's rite of passage) rather than generic filler. It adds a new, independent test/design-art-briefs-wormhole-restrictions.test.js mirroring the assertion shape of the existing design-art-briefs tests, so it has zero touch-overlap with the two open art-briefs proposals or any in-flight unit, all of which edit different card files or the shared test file this unit avoids. No card file, rules.md, or the compositing/rendering code itself is touched — only art-briefs.md grows and a new test file is added.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-art-briefs-wormhole-restrictions (cycle 1)

## AC accounting

### AC1 — 5 new `###` sections, titled verbatim, no pre-existing brief altered
Diff appends a single hunk at the end of `design/cards/art-briefs.md` (`@@ -626,3 +626,81 @@`), after the existing last line (`... receding symmetrically behind her.`). No other hunk touches the file, so no pre-existing section is removed, renamed, or altered.

Confirmed present in the built file, in order: `### Bastion Lockdown Line`, `### Conveyance Directive`, `### Rootbound Corridor`, `### Vector Interdiction`, `### Pilgrim's Right of Way` (line 692, plain `'` apostrophe — matches the apostrophe used in `design/cards/wormhole-restrictions-set.md` line 83). Exactly 5 new sections, titles verbatim. **AC1 satisfied.**

### AC2 — Palette line names the correct Fount-driven color
Checked each new brief's Cost-line Fount against its Palette line:
- Bastion Lockdown Line: `2 Mass` → Palette: Ash-grey ✓
- Conveyance Directive: `2 Circuit` → Palette: Copper ✓
- Rootbound Corridor: `2 Bloom` → Palette: Green ✓
- Vector Interdiction: `1 Signal` → Palette: Cyan ✓
- Pilgrim's Right of Way: `2 Tangle` → Palette: Violet ✓

All m
