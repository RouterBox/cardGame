name: cardgame-design-readiness-review
title: Cardgame Design Readiness Review
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Add design/DESIGN-READINESS.md to the cardGame repo: a single markdown document that inventories the design-phase deliverables shipped to date (rulebook sections by number and title, world lore eras, races, star atlas, every card set/wave by name, art brief coverage, the authoring/render/site tooling) with a citation (file path) for each claim, and closes with a named, numbered list of at least three concrete open gaps or unresolved questions relevant to whether the design is compelling enough to ungate game software per I6. The document must be generated/checked so its card-set list is derived programmatically from design/cards/*.md (via the existing shared parser) rather than a hand-typed count that goes stale, matching the lesson in T12 about frozen counts drifting from reality. This is a new standalone file with no edits to existing design or rules content, avoiding any shared-file collision with concurrently running bolts.

## Acceptance Criteria

- AC1 [paraphrase]: design/DESIGN-READINESS.md is created and is non-empty markdown
- AC2 [inferred]: The document names every numbered rulebook section (rules.md) by its section number and title
- AC3 [inferred]: The document names every shipped card set/wave (Alpha starters, Frontier spatial cards, character signature waves, spatial race identity waves, wormhole restriction/closure cards, fount economy cards) with a file citation for each
- AC4 [inferred]: The document names the world lore eras and the races/star atlas content with file citations
- AC5 [paraphrase]: The document closes with a numbered list of at least 3 concrete open gaps or unresolved questions, each citing specific evidence (a file or section)
- AC6 [inferred] (held_out): test/design-readiness.test.js asserts the document's card-set list, when cross-checked against design/cards/*.md loaded via the existing shared parser (lib/parse-card-markdown.js), does not omit any set present on disk
- AC7 [inferred] (held_out): test/design-readiness.test.js fails (RED) before the document exists and passes (GREEN) after, run via `node --test`
