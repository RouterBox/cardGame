# cardgame-jaina-character-sync-dryrun

- merged: 2026-07-30T10:13:57.369Z
- intent: design/DESIGN-READINESS.md's Open Gap 4 names the hole directly: tools/sync-cards-to-jaina.js only syncs card records, while design/characters/ (20 named characters, 4 per race) has no Jaina schema or sync path. This unit is the next narrow slice under the same 2026-07-28 ideas-inbox directive that produced cardgame-jaina-card-sync-dryrun (T1 discipline: no live write, no claim on the full 'races/world/lore' scope in one shot — characters only). Add lib/parse-character-markdown.js, a shared parser mirroring lib/parse-card-markdown.js's conventions, that reads each design/characters/{race}.md file (excluding design/characters/web.md, which is a cross-race narrative index, not per-character content) and extracts one record per '## Name — Title' section: name, slug (same slugify algorithm as the card parser), race (derived from the source filename), title (the text after the em-dash in the heading), bio (the section's prose paragraph), and threads (the '**Threads:**' bullet list, or an empty array when absent). tools/sync-characters-to-jaina.js prints one JSON payload per record in --dry-run mode and, mirroring sync-cards-to-jaina.js exactly, makes no live Jaina API calls in this unit — printing a 'not yet implemented' message and exiting 1 without --dry-run, so no credentials or network access are required by node --test. This is content-authoring tooling under the T16 partial software-gate opening, not game implementation.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Review — cardgame-jaina-character-sync-dryrun (cycle 1)

## Method

Blind review against unit.md intent + visible ACs and plan.md, then cross-checked the diff
against the actual on-disk files in the worktree (all 5 `design/characters/*.md` race files,
`design/characters/web.md`, `lib/parse-card-markdown.js`, the current
`tools/sync-cards-to-jaina.js`, `test/helpers/markdown.js`, and `test/design-characters.test.js`)
to verify the parser's assumptions hold against real content, not just the fixtures in its own
tests. `node --test` could not be executed in this sandbox (command execution was blocked
pending approval that never arrived), so correctness was verified by manual trace of the parser
logic against the real markdown rather than by running the test suite.

## AC-by-AC

- **AC1** (20 records across the 5 race files, `web.md` excluded): Verified by reading all 5
  race files — each has exactly 4 `## Name — Title` (em dash) sections, all with the expected
  bio + `**Threads:**` shape. `web.md`'s H2s (`## Overview`, `## The Cinderglass Bargain`, etc.)
  never match the `Name — Title` heading regex, so they're excluded by the heading-shape check
  in `parseCharacterMarkdown`, no
