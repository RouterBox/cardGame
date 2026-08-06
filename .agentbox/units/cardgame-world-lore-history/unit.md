name: cardgame-world-lore-history
title: cardGame design phase — world lore & history
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Fifth design deliverable for the cardGame pilot (gamePlan.md is the source of truth for scope). This is a DESIGN unit, not software (T8): output is a markdown document a human reads and reacts to. design/world.md and design/races/*.md establish setting and race identity; design/rules.md establishes mechanics through Section 9. What's missing is history — the lore layer I6 lists alongside world building and race identities. This unit writes design/lore.md: a timeline of eras and at least one central conflict tying multiple races together, grounded in terms already defined in world.md and rules.md rather than inventing new mechanics. It closes at full decided scope (T1) rather than treating races+rules as sufficient, and gives the in-flight alpha-set card unit (and any future set) a fixed narrative anchor for flavor text instead of each card inventing its own backstory.

## Acceptance Criteria

- AC1 [user]: design/lore.md exists in the cardGame repo.
- AC2 [paraphrase]: Contains a named timeline/history section listing at least 4 distinct eras or historical periods in the setting.
- AC3 [inferred]: Describes at least one central conflict or turning-point event that directly involves 3 or more of the 5 races named in design/races/*.md.
- AC4 [inferred]: References at least one Fount-related concept already defined in design/rules.md or design/world.md, so the history is grounded in existing game terms rather than inventing new mechanics.
- AC5 [inferred]: Ends with a short 'current era' section describing the state of the world at the point the Alpha card set is set, giving future card flavor text a fixed narrative anchor.
- AC6 [inferred] (held_out): The file opens with a summary paragraph naming how many eras/periods it covers and which races the central conflict(s) involve, so scope is checkable without reading the full document.
- AC7 [inferred] (held_out): No single era or event description exceeds roughly one page (about 500 words), keeping the document skimmable rather than turning into a novel.
