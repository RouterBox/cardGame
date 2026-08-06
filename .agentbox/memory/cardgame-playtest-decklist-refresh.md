# cardgame-playtest-decklist-refresh

- merged: 2026-07-30T06:13:00.780Z
- intent: design/playtest-full-game.md's numbered Procedure Step 1 (lines 45-88) constructs two 40-card decklists — Deck A ('Ada', Mass-leaning) and Deck B ('Kestrel', Circuit-leaning) — using only cards that predate design/cards/fount-economy-set.md, and explicitly labels 14 of the 28 lines per deck as 'dead' (uncastable) because, at the time that text was written, Bloom, Signal, and Tangle had no Generator. cardgame-playtest-fount-economy-refresh has since corrected the 'What This Playtest Surfaced' section later in the same file to reflect that fount-economy-set.md now gives every Fount a Generator plus a cheap follow-up card, but its own stated scope explicitly left Step 1's decklists and the 'Only 10 of the 28 cards ... can ever be paid for' sentence untouched, so the document now contradicts itself within a few thousand words. This unit rewrites Step 1 only: it swaps in at least one fount-economy-set.md card per previously-dead Fount in each decklist (keeping both decks at exactly 40 cards and no more than 3 copies of any one Name, per Section 11.1/11.2), removes every 'dead'/'can never be paid' annotation that is no longer true, and replaces the stale payable-card count with one matching the current four-file pool (alpha-set.md, frontier-set.md, character-signatures.md, fount-economy-set.md). It updates test/design-full-game-playtest.test.js to mechanically parse both decklists from the document and assert deck-legality (Section 11.1/11.2) plus at least one payable card per Fount, and regenerates the matching site/design/playtest-full-game.html build artifact. It does not touch the Worked Examples, the 'What This Playtest Surfaced' table, rules.md, or any card file — only Step 1, its owning test, and the site twin change.
- criteria: AC1, AC2, AC3, AC4, AC5, AC6 (2 held out)

## Reviewer notes worth keeping

# Blind Review: cardgame-playtest-decklist-refresh (cycle 3)

## AC coverage

- **AC1** (each deck names ≥1 fount-economy-set.md card): PASS. Deck A now includes
  `Cradle-Root Colony`, `Communion Waystone`, `Panoptic Relay Spire`; Deck B includes
  `Panoptic Relay Spire`, `Communion Waystone`. Cross-checked against
  `design/cards/fount-economy-set.md`: all three are real cards from that file, and their
  parenthetical costs in the decklist (`2 Bloom`; `1 Signal, 1 Circuit`; `1 Tangle, 1
  Mass`) match that file's actual Cost lines exactly.
- **AC2** (no "dead"/"can never be paid" annotations): PASS. Every `— dead`,
  `dead, no ... Generator exists`, and `can never be paid` annotation is removed from
  both decklists. No such phrase remains anywhere in Step 1's text.
- **AC3** (payable-count sentence matches current four-file pool): PASS. New sentence:
  "All 34 of the cards currently named across the four card files ... can now be paid
  for ... every Fount ... has a Generator (Section 5.2)." Independently verified by
  counting `### ` headings: alpha-set.md=18, frontier-set.md=5,
  character-signatures.md=5, fount-economy-set.md=6 → 34, matching the stated figure.
  Confirmed vi
