name: cardgame-world-races
title: cardGame design phase 1 — world bible and five race identities
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

First design deliverable for the cardGame pilot (see gamePlan.md at the repo root — the source of truth for scope). This is a DESIGN unit, not software (taste ledger T8): the outputs are markdown documents a human reads and reacts to. Produce the world bible and the five playable race identities for a galactic-civilizations trading card game in the terran/zerg/protoss asymmetry tradition.

Deliverables in the target repo (C:/github/cardGame):

1. `design/world.md` — the setting: the galaxy, its history in brief, and a cosmology section that grounds the five tech-tree categories from gamePlan.md (materials, biology, intelligence, technology, magic) as in-universe forces every civilization draws on. Written to be read for pleasure — evocative prose, not a spec sheet — but concrete enough that card flavor and art briefs can cite it.
2. `design/races/<race-name>.md` — five files, one per race, each with: a one-paragraph identity (who they are, what they want, how they feel to play), their PRIMARY strength (one of the five categories), two COMPLEMENTARY strengths, and two COUNTERING weaknesses (the categories that punish them), per gamePlan.md's strength template — plus 3-5 signature mechanics-flavored hooks (not full card designs) and a visual identity paragraph usable as a Leonardo art-brief seed.
3. The five races' strengths must form a coherent meta: every category is some race's primary exactly once, and the counter relationships form a cycle so no race is strictly dominant on paper.

Plain-language bar (T6/plain-language-reports): a reader who has never seen gamePlan.md understands every document.

## Acceptance Criteria

- AC1 [user]: design/world.md exists in the cardgame repo and contains a galaxy/setting overview plus a cosmology section that names and grounds all five categories from gamePlan.md — materials, biology, intelligence, technology, and magic — as in-universe forces.
- AC2 [user]: Exactly five files exist under design/races/, and each contains an identity paragraph, one declared primary strength, two complementary strengths, and two countering weaknesses drawn from the five-category list.
- AC3 [paraphrase]: Across the five race files, each of the five categories appears as a primary strength exactly once, and no race lists the same category twice across its primary/complementary/countering slots.
- AC4 [inferred]: Each race file includes 3-5 signature hooks (named, one-line mechanics-flavored concepts) and a visual-identity paragraph suitable as an art-brief seed for Leonardo.
- AC5 [inferred] (held_out): design/world.md references at least three of the five races by name in its setting prose, so the world bible and the race files read as one connected universe rather than disconnected documents.
