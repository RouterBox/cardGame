# cardgame-frontier-worlds-cards

- merged: 2026-07-31T00:13:19.867Z
- intent: design/star-atlas.md's 'Frontier & Contested Worlds' section names Halvorne Junction (a wormhole-transit world valuable for its tangle of cheap wormholes, seized by Starweave Communion oath-sworn during the Cinderglass War and still contested with the Cindral Reach), Kelmourn Drift (a debris-field world where First Weave wreckage keeps resurfacing, reopening the same discovery-claim argument that started the Cinderglass War), and Tallowfen (a resource-poor world whose only value is a single chokepoint wormhole, held and re-held by whoever last had the fleet to spare) — and frames all 3 explicitly as Discovery-action targets (rules.md Section 8.3). No card in any of the 9 shipped card-set files has ever named any of them. Write design/cards/frontier-worlds-set.md with 5 cards, one per race (following the same 'one per race' structure as frontier-set.md, wormhole-restrictions-set.md, wormhole-closure-cards.md, and spatial-race-identity-set.md), distributing the 3 worlds across the 5 cards so every world is named by at least one card's Rules text and flavor text (at least one world will be named by two cards). Ground each card's mechanic in rules.md Section 8.3's existing vocabulary (Frontier Discovery, Contested Discovery, Neutral Planet) or another already-defined Section 8 mechanic (Blockade, Wormhole Length) the way frontier-set.md's own 5 cards already cite Section 8.x mechanics generically — but this time naming the specific world instead of leaving it abstract, consistent with each world's own lore detail already written in star-atlas.md (e.g. a card exercising Contested Discovery whose flavor text names Kelmourn Drift's resurfacing-wreckage claims; a card referencing Wormhole Length or cheap-wormhole Discovery whose flavor text names Halvorne Junction; a card referencing Blockade or a chokepoint Wormhole whose flavor text names Tallowfen). Add exactly one new bullet to design/DESIGN-READINESS.md's Section 3 card-set list citing 'frontier-worlds-set.md' by filename, matching the existing bullet format for every other set, and touch no other section or line of that file. Do not touch design/star-atlas.md, design/cards/frontier-set.md, or any other existing design/cards/*.md file — this unit only adds one new card-set file and one citation bullet. Regenerate site/ via tools/build-site.js. Art briefs for these 5 cards are out of scope for this unit, matching the established precedent (art-brief coverage for a new set ships as its own later unit).
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-frontier-worlds-cards (cycle 1)

## Scope of diff reviewed
`design/DESIGN-READINESS.md` (+5 lines, one bullet), new
`design/cards/frontier-worlds-set.md` (98 lines), new
`test/design-frontier-worlds-cards.test.js` (177 lines), 5 new
`renders/cards/*.svg`, and mechanical `site/**` regeneration output
(nav siblings, cards-index, index, DESIGN-READINESS.html,
frontier-worlds-set.html). Confirmed via
`git diff d6d50cd~1 6dea635 --stat` this is the full and only diff for
this unit — matches the diff shown in the prompt exactly.

## AC-by-AC verification

**AC1** (5 cards, one per race, Section 9.1 field order) — PASS.
Read `design/cards/frontier-worlds-set.md` directly: 5 distinct `###`
cards, one under each of the 5 race `##` headings (Cindral Reach,
Starweave Communion, Mireth Bloom, Panoptic Concord, Wrought Assembly),
each with `Cost line:` → `Type line:` → `Rules text:` → (optional
`Stats/counters line:`) → blank line → italic flavor, matching
`design/rules.md` Section 9.1 and the shared `lib/parse-card-markdown.js`
convention. Only the Biology card (Kelmourn Wreck-Bloom) carries a Stats
line, correctly gated by the Type line containing "Permanent" (verifi
