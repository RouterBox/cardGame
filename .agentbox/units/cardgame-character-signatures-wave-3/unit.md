name: cardgame-character-signatures-wave-3
title: Add Character Signatures, Wave 3 — a third named-character card per race, completing signature-card coverage for all 20 named characters
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/characters/ commits to 4 named characters per race (20 total) with interlinking Threads, per the 2026-07-27 ideas-inbox directive. character-signatures.md and character-signatures-wave-2.md have each carded one character per race (10 of 20), following the canonical Section 9.1 template and citing the source character by name in both rules text framing and flavor text. Write design/cards/character-signatures-wave-3.md mirroring that exact structure: for each of the 5 races, pick one of its two still-uncarded characters (Cindral Reach: Bren Hollowmelt or Karrow Vantiss; Mireth Bloom: Vesk-Aduun or Nyth Corrow; Panoptic Concord: Yuen Ashcroft or Ilio Marn-Cassity; Starweave Communion: Ossian Thale or Wren Sable-Vow; Wrought Assembly: Vantel Ninth-Chorus or Replica-Sergeant Kess Ninefold), build a card whose Cost line uses that race's own primary Fount (per design/races/*.md), whose Type line matches the character's own domain (Materials/Biology/Intelligence/Magic/Technology per race), and whose Rules text mechanizes a detail already present in that character's own design/characters/ entry (e.g. a per-copy buff, a counter-on-trigger effect, a look-and-choose ability) the way Waves 1-2 each did. Do not touch character-signatures.md, character-signatures-wave-2.md, any design/characters/ file, or any other card set. Regenerate site/ via tools/build-site.js. Art briefs for these 5 cards are out of scope for this unit, matching the established precedent that art-brief coverage ships as its own later unit (cardgame-art-briefs-character-signatures-wave-2 followed character-signatures-wave-2 the same way).

## Acceptance Criteria

- AC1 [inferred]: design/cards/character-signatures-wave-3.md exists with exactly 5 cards, one per race under design/races/
- AC2 [paraphrase] (held_out): Each card's named character, verified against that race's design/characters/*.md file, is one of the two characters not already used by character-signatures.md or character-signatures-wave-2.md for that race
- AC3 [inferred]: Across character-signatures.md, character-signatures-wave-2.md, and character-signatures-wave-3.md combined, no named character is used by more than one card
- AC4 [inferred]: Each card's Cost line names that race's own primary Fount (per design/races/*.md) and each card follows the Section 9.1 template field order (Name, Cost line, Type line, Rules text, optional Stats/counters line)
- AC5 [paraphrase]: site/design/cards/character-signatures-wave-3.html exists via tools/build-site.js, and character-signatures.md, character-signatures-wave-2.md, and every design/characters/*.md file are byte-for-byte unchanged
