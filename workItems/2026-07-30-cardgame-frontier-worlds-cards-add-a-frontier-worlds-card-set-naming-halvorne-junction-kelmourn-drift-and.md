# cardgame-frontier-worlds-cards: Add a Frontier Worlds card set naming Halvorne Junction, Kelmourn Drift, and Tallowfen — the only 3 named worlds in star-atlas.md with zero card representation

## Header

- unit: cardgame-frontier-worlds-cards
- title: Add a Frontier Worlds card set naming Halvorne Junction, Kelmourn Drift, and Tallowfen — the only 3 named worlds in star-atlas.md with zero card representation
- project: cardgame
- completed: 2026-07-30
- outcome: escalated
- start_sha: 310093b21d6c6f27f1c9acf8082ce404c992ce1a
- end_sha: 310093b21d6c6f27f1c9acf8082ce404c992ce1a

## Intent

design/star-atlas.md's 'Frontier & Contested Worlds' section names Halvorne Junction (a wormhole-transit world valuable for its tangle of cheap wormholes, seized by Starweave Communion oath-sworn during the Cinderglass War and still contested with the Cindral Reach), Kelmourn Drift (a debris-field world where First Weave wreckage keeps resurfacing, reopening the same discovery-claim argument that started the Cinderglass War), and Tallowfen (a resource-poor world whose only value is a single chokepoint wormhole, held and re-held by whoever last had the fleet to spare) — and frames all 3 explicitly as Discovery-action targets (rules.md Section 8.3). No card in any of the 9 shipped card-set files has ever named any of them. Write design/cards/frontier-worlds-set.md with 5 cards, one per race (following the same 'one per race' structure as frontier-set.md, wormhole-restrictions-set.md, wormhole-closure-cards.md, and spatial-race-identity-set.md), distributing the 3 worlds across the 5 cards so every world is named by at least one card's Rules text and flavor text (at least one world will be named by two cards). Ground each card's mechanic in rules.md Section 8.3's existing vocabulary (Frontier Discovery, Contested Discovery, Neutral Planet) or another already-defined Section 8 mechanic (Blockade, Wormhole Length) the way frontier-set.md's own 5 cards already cite Section 8.x mechanics generically — but this time naming the specific world instead of leaving it abstract, consistent with each world's own lore detail already written in star-atlas.md (e.g. a card exercising Contested Discovery whose flavor text names Kelmourn Drift's resurfacing-wreckage claims; a card referencing Wormhole Length or cheap-wormhole Discovery whose flavor text names Halvorne Junction; a card referencing Blockade or a chokepoint Wormhole whose flavor text names Tallowfen). Add exactly one new bullet to design/DESIGN-READINESS.md's Section 3 card-set list citing 'frontier-worlds-set.md' by filename, matching the existing bullet format for every other set, and touch no other section or line of that file. Do not touch design/star-atlas.md, design/cards/frontier-set.md, or any other existing design/cards/*.md file — this unit only adds one new card-set file and one citation bullet. Regenerate site/ via tools/build-site.js. Art briefs for these 5 cards are out of scope for this unit, matching the established precedent (art-brief coverage for a new set ships as its own later unit).

## Acceptance Criteria

- AC1 [inferred]: design/cards/frontier-worlds-set.md exists with exactly 5 cards, one per race under design/races/, each following the Section 9.1 template field order (Name, Cost line, Type line, Rules text, flavor text)
- AC2 [inferred]: Across the 5 cards, the exact strings 'Halvorne Junction', 'Kelmourn Drift', and 'Tallowfen' each appear at least once
- AC3 [paraphrase] (held_out): Each card's Rules text names a Discovery-family or other Section 8 mechanic (Frontier Discovery, Contested Discovery, Neutral Planet, Blockade, or Wormhole Length) already defined in rules.md, not an invented mechanic
- AC4 [inferred]: design/DESIGN-READINESS.md's Section 3 contains exactly one new bullet citing 'frontier-worlds-set.md', and every other section of that file, design/star-atlas.md, and every other design/cards/*.md file are byte-for-byte unchanged
- AC5 [paraphrase]: site/design/cards/frontier-worlds-set.html exists and site/design/DESIGN-READINESS.html is regenerated via tools/build-site.js, and a new test file mechanically asserts all of the above

## Plan

(no plan.md)

## Findings

(no findings.md)

## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T23:22:17.610Z] **bolt:start** — unit=cardgame-frontier-worlds-cards start_sha=310093b21d6c6f27f1c9acf8082ce404c992ce1a branch=bolt/cardgame-frontier-worlds-cards worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-frontier-worlds-cards
- [2026-07-30T23:22:30.825Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T23:34:29.431Z] **bolt:escalated** — Planner produced no plan.md


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
