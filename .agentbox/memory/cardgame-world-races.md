# cardgame-world-races

- merged: 2026-07-26T17:52:18.924Z
- intent: First design deliverable for the cardGame pilot (see gamePlan.md at the repo root — the source of truth for scope). This is a DESIGN unit, not software (taste ledger T8): the outputs are markdown documents a human reads and reacts to. Produce the world bible and the five playable race identities for a galactic-civilizations trading card game in the terran/zerg/protoss asymmetry tradition.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review: cardgame-world-races, cycle 2

## Scope reviewed
- `design/world.md` (new)
- `design/races/{cindral-reach,mireth-bloom,panoptic-concord,wrought-assembly,starweave-communion}.md` (new)
- `test/design-world.test.js`, `test/design-races.test.js`, `test/helpers/markdown.js` (present in diff, but per git log these were committed in the prior "failing tests from visible ACs" commit, i.e. PRE-EXISTING relative to this builder cycle — the diff shown is cumulative against `main`, not cycle-1-to-cycle-2 delta)

## AC-by-AC accounting

**AC1** — `design/world.md` exists, has a `## The Setting` overview (two substantive paragraphs, evocative prose) and a `## Cosmology: The Five Founts` section with five `###` subsections explicitly naming and grounding all five categories: "The Mass — materials", "The Bloom — biology", "The Signal — intelligence", "The Circuit — technology", "The Skein — magic," each with a stated gift and a stated limit. Satisfied.

**AC2** — Exactly five files under `design/races/`. Each has an `## Identity` paragraph (well over a substantive length), and a `## Strengths & Weaknesses` block with one **Primary strength**, exactly two **Complementary strengths*
