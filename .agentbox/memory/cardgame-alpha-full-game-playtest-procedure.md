# cardgame-alpha-full-game-playtest-procedure

- merged: 2026-07-28T23:22:05.373Z
- intent: Add a new design/playtest-full-game.md file containing a numbered, step-by-step playtest-on-paper procedure that two human players can follow with physical materials (decks built from the shipped card sets, tokens, index cards) to play one complete game from deck construction through an explicit win condition, using only cards that exist by name in design/cards/alpha-set.md, design/cards/character-signatures.md, and design/cards/frontier-set.md, and citing the exact rules.md section number that governs each major step. This closes the gap between section-by-section rules rigor (already shipped: core rules, resources, deck construction, card types/templating, spatial battlefield + map setup, combat resolution, winning/losing conditions) and an actual demonstration that the whole system coheres as a playable game, which is the single strongest lever toward I6's end goal of a design compelling enough to ungate software. It reads but never modifies design/rules.md or any design/cards/*.md file, avoiding any conflict with the concurrently in-flight cardgame-targeting-rules unit that is currently editing rules.md.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-alpha-full-game-playtest-procedure, cycle 3

## Note on a stale prior findings.md

This file previously held cycle 1's review (NEEDS_WORK, two findings about imprecise
wording in the closing "What This Playtest Surfaced" table/paragraph: an "only Mass has a
card cheap enough" claim that ignored Signal's two 1-cost cards, and an unqualified "every
printed Unit costing at least 3" claim that ignored the two 2-cost Bloom Units). Both of
those specific wordings have since been fixed in the diff under review now: the table's Mass
row now reads "the only Fount with both a Generator and a card cheap enough," and the closing
paragraph now reads "every **reachable** printed Unit costing at least 3 ... — two cheaper
Units are printed, `Feral Bloomcaller` and `Rootbind Thicket` at 2 Bloom each, but Bloom has
no Generator, so neither is ever reachable in ordinary play." I independently re-derived both
claims against the actual card data before noticing this and confirm they are now accurate as
written. This review (cycle 3) replaces that stale content below.

## Scope of diff

- New: `design/playtest-full-game.md` (288 lines) — the walkthrough itself.
- New: `test/des
