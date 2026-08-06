# cardgame-keyword-abilities-rules

- merged: 2026-07-29T06:16:46.221Z
- intent: design/rules.md's 13 existing sections define every core system of the game (turns, resources, priority/timing, spatial battlefield, card types, winning/losing, deck construction, combat, targeting), each written to the MTG Comprehensive Rules structural bar named in T9 — numbered subsections, glossary-first vocabulary defined in Section 2 before substantive use, and at least one worked example per major chapter (Section 7, 8.7, 10.3, 12.5, 13.3 all follow this pattern). One CR-shape chapter is conspicuously absent: Keyword Abilities. Every card printed so far (alpha-set.md, frontier-set.md, character-signatures.md) spells its effect out in full sentences because no named, reusable rules-text shorthand exists. This unit adds a new numbered section defining at least 5 keyword abilities, one bound to each Fount's already-established identity from world.md and the race files, following the same glossary-first, worked-example discipline as every other rules.md chapter. It adds vocabulary only — no existing card file is touched, and no card is retextualized to use a new keyword (that is left as a follow-on unit); this is pure design/rules text, no game software (T8).
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-keyword-abilities-rules, cycle 1

## AC coverage

**AC1** (new Section 14 with ≥5 named keyword abilities, each tied to exactly one
Fount, consistent with `world.md`/race-file identity) — **MET**. `design/rules.md`
gains `## 14. Keyword Abilities` immediately after `13. Targeting`, with strict
numeric sequence (1–14) preserved. Five subsections: 14.1 Bulwark X (Mass), 14.2
Regenerate (Bloom), 14.3 Foresee X (Signal), 14.4 Swarm (Circuit), 14.5 Paradox
(Tangle). Cross-checked each against `design/world.md`'s per-Fount passages
(lines 19–37): Bulwark/"endures... shrugs off"→Mass, Regenerate/"mutating past
them"→Bloom, Foresee/"knowing... a moment before"→Signal, Swarm/"copies of
itself"→Circuit, Paradox/"negotiate with cause and effect"→Tangle. All five
match. Plan's table distinguishing each keyword from its Fount's existing
Section 4 resource mechanic (Fortification, Growth, Signal-point scry, Circuit
copy-pay, Tangle Queue-reorder) checks out on reading Section 4.1–4.4.

**AC2** (each keyword's own numbered subsection states precise rules-text
meaning) — **MET**, with one minor precision note (see Findings). All five
subsections state trigger condition, e
