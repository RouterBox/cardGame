name: cardgame-design-readiness-gap3-jaina-sync-fix
title: Fix DESIGN-READINESS.md's stale 'Jaina wired up for card records only' claim — 4 more sync tools already shipped since it was written
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/DESIGN-READINESS.md Section 5 currently lists only 'tools/sync-cards-to-jaina.js — dry-run and --live sync of parsed card records into Jaina' under its tooling inventory, and Section 6's Open Gap 3 states: 'Jaina is wired up for card records only. tools/sync-cards-to-jaina.js only syncs parsed card records. Characters (design/characters/), races (design/races/), world/lore (design/world.md, design/lore.md), and the star atlas (design/star-atlas.md) remain markdown-only prose with no Jaina schema or sync path yet.' Both claims are now stale: cardgame-jaina-character-sync-dryrun, cardgame-jaina-race-sync-dryrun, cardgame-jaina-star-atlas-sync-dryrun, and cardgame-jaina-lore-sync-dryrun all merged on 2026-07-30, adding tools/sync-characters-to-jaina.js, tools/sync-races-to-jaina.js, tools/sync-star-atlas-to-jaina.js, and tools/sync-lore-eras-to-jaina.js (each a dry-run-only tool backed by its own lib/parse-*-markdown.js parser, per those units' own merged intents). Edit Section 5 to add one bullet per new tool, matching the existing sync-cards-to-jaina.js bullet's style (one line naming the tool and what it dry-run-syncs). Edit Section 6 item 3 to drop the now-false claim about characters/races/star-atlas/lore, replacing it with an accurate narrower statement: design/lore.md's eras are now synced (lore-eras, not all of lore.md's prose) but design/world.md's Cosmology/Founts section still has no parser or sync tool, and design/cards/fount-economy-set.md-adjacent Fount records are only in flight (cardgame-jaina-founts-sync-dryrun, not yet merged) — so the item should state world.md and the founts sync as the remaining hole, not the four now-closed ones. Do not touch Section 4's art-brief coverage bullets (subject of the separate open section4-art-briefs-coverage-fix proposal), Section 6 item 1 (subject of the in-flight gap1-wormhole-resolved-fix unit), or any other section's substance.

## Acceptance Criteria

- AC1 [inferred]: design/DESIGN-READINESS.md Section 5's tooling list contains one new bullet each for tools/sync-characters-to-jaina.js, tools/sync-races-to-jaina.js, tools/sync-star-atlas-to-jaina.js, and tools/sync-lore-eras-to-jaina.js, alongside the existing sync-cards-to-jaina.js bullet
- AC2 [inferred]: Section 6 item 3 no longer contains the sentence claiming characters, races, world/lore, or the star atlas 'remain markdown-only prose with no Jaina schema or sync path yet'
- AC3 [paraphrase] (held_out): Section 6 item 3's rewritten text names design/world.md's Cosmology/Founts content as still lacking a sync tool, and references the founts sync as in-flight rather than shipped
- AC4 [inferred]: Section 4's art-brief coverage bullets and Section 6 item 1's wormhole/art-brief text are present byte-for-byte unchanged
- AC5 [paraphrase]: test/design-readiness.test.js and test/design-readiness-gap2-resolved.test.js's existing assertions pass unmodified against the edited file
