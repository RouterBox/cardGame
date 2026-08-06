name: cardgame-art-briefs-spatial-race-identity-wave-2
title: Write the missing art briefs for spatial-race-identity-set-wave-2.md's 2 cards (Bloom Fount, Circuit Fount)
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/cards/art-briefs.md documents an art brief for every card in every other shipped card set, but design/cards/spatial-race-identity-set-wave-2.md's 2 cards (Bloom Fount — a Mireth Bloom Generator built with 'Bloomfront Expansion,' costed 2 Bloom, that MAY be built on a Planet its controller does not control; Circuit Fount — a Wrought Assembly Generator costed 2 Circuit that costs 1 less when built on a Discovery-added Planet) have none. This wave-2 file shipped after the wave-1 spatial-race-identity-set.md briefs were already written, and DESIGN-READINESS.md's Open Gap 1 (and both open proposals fixing it) only ever tracked the wave-1 set plus wormhole-closure-cards.md — the wave-2 file was never named as a gap anywhere, so it was silently missed. Add one brief per card, following the exact format every prior art-briefs unit has used (Palette, Subject/Scene, Key visual elements, Composition), naming each card's Fount-driven palette color from design/cards/card-anatomy.md's Frame/Border color table (the Bloom (biology) -> Green, the Circuit (technology) -> Copper), a Subject/Scene naming the respective race (Mireth Bloom / Wrought Assembly) and the card's own specific mechanic, a Key visual elements bulleted list of at least 3 items, and a Composition line citing the Art Window's landscape rectangle shape and aspect ratio (matching the ~5:3 precedent every prior entry uses) — so these 2 cards can go through the compositing pipeline like every other shipped card.

## Acceptance Criteria

- AC1 [inferred]: design/cards/art-briefs.md gains exactly one '###' section per card, titled 'Bloom Fount' and 'Circuit Fount' verbatim, appended after the existing content with no pre-existing section touched
- AC2 [inferred]: Bloom Fount's Palette line names Green (card-anatomy.md's Frame/Border color for the Bloom) and Circuit Fount's Palette line names Copper (the Circuit's color), each explicitly naming its Fount
- AC3 [paraphrase] (held_out): Each brief's Subject/Scene names the card's own race (Mireth Bloom for Bloom Fount, Wrought Assembly for Circuit Fount) and references that card's specific printed mechanic (Bloomfront Expansion's build-on-uncontrolled-Planet exception / the Discovery-triggered cost reduction), and each includes a Key visual elements list of at least 3 bullet points
- AC4 [paraphrase]: Each brief's Composition line cites the Art Window as a wide landscape rectangle with an aspect ratio matching the ~5:3 precedent used by every prior art-briefs.md entry
- AC5 [inferred]: Running tools/composite-card-art.js against design/cards/spatial-race-identity-set-wave-2.md's cards no longer prints a 'no art brief for "<name>"' warning for Bloom Fount or Circuit Fount
