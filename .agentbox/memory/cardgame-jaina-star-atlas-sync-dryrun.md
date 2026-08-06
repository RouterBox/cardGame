# cardgame-jaina-star-atlas-sync-dryrun

- merged: 2026-07-30T11:08:47.378Z
- intent: design/DESIGN-READINESS.md's Open Gap 4 names the hole directly: tools/sync-cards-to-jaina.js only syncs card records, and while the character and race slices are already in flight as open sibling proposals, design/star-atlas.md (5 Homeworld sections plus 3 Frontier & Contested World sections, 8 total) remains markdown-only prose with no Jaina schema or sync path. This is the next narrow slice under the same 2026-07-28 ideas-inbox 'use Jaina as the content backbone' directive that produced cardgame-jaina-card-sync-dryrun (T1 discipline: no live write, star atlas only, not world.md's or lore.md's free-form prose in the same shot — those need their own parsing approach and are explicitly left out of scope here). Add lib/parse-star-atlas-markdown.js, a shared parser mirroring lib/parse-card-markdown.js's conventions, that reads design/star-atlas.md and extracts one record per '###' section: name (the heading text before any em-dash), slug (the identical slugify algorithm already used by lib/parse-card-markdown.js), type ('homeworld' for the 5 sections under '## Homeworlds', 'frontier' for the 3 sections under '## Frontier & Contested Worlds'), race (the civilization named after the heading's em-dash for Homeworld sections, e.g. 'Ashkeel — Homeworld of the Cindral Reach' -> race 'Cindral Reach'; null for Frontier sections, which have no em-dash), and description (that section's prose paragraph). tools/sync-star-atlas-to-jaina.js prints one JSON payload per record in --dry-run mode and, mirroring the dry-run-only scope of its sibling proposals, makes no live Jaina API calls in this unit — printing a 'not yet implemented' message and exiting 1 without --dry-run, so no credentials or network access are required by node --test. This is content-authoring tooling under the T16 partial software-gate opening, not game implementation.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Review: cardgame-jaina-star-atlas-sync-dryrun (cycle 1)

## Verification performed

Static trace of the diff against the actual (unmodified) `design/star-atlas.md`
and `lib/parse-card-markdown.js` in the worktree (dynamic `node --test`
execution was blocked by this session's command-approval gate, so correctness
was confirmed by manual trace + targeted `Grep` checks instead of running the
suite):

- `lib/parse-card-markdown.js`'s `slugify` (lines 98-103) is byte-for-byte
  identical to the new `slugify` in `lib/parse-star-atlas-markdown.js` — AC2's
  cross-file identity claim holds.
- `design/star-atlas.md` (untouched by this diff) has exactly 8 `###`
  sections: 5 under `## Homeworlds` (each titled `Name — Homeworld of the
  <Race>`), 3 under `## Frontier & Contested Worlds` (bare names, no em
  dash) — confirmed via `Grep`, including confirming the heading dash is the
  literal U+2014 em dash the parser's `NAME_SUBTITLE_PATTERN` (and the repo's
  own file) both use, so the split isn't silently failing on an en dash/hyphen
  lookalike.
- Traced `splitIntoH3SectionsWithParent` → `splitNameAndSubtitle` →
  `raceFromSubtitle` by hand against all 8 real headings: name/type/race come
