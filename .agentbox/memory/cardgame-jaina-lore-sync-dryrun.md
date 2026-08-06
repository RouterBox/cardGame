# cardgame-jaina-lore-sync-dryrun

- merged: 2026-07-30T11:34:55.020Z
- intent: design/DESIGN-READINESS.md's Open Gap 4 names the hole directly: only card records (and, once their sibling proposals merge, character/race/star-atlas records) are wired to Jaina, while design/lore.md's 6-era chronicle remains markdown-only prose with no Jaina schema or sync path. This is the next narrow slice under the same 2026-07-28 ideas-inbox 'use Jaina as the content backbone' directive that produced cardgame-jaina-card-sync-dryrun (T1 discipline: no live write, lore eras only — not design/world.md's Cosmology/Founts content, which has a different section shape and is explicitly out of scope here, matching how the star-atlas proposal deferred both world.md and lore.md). Add lib/parse-lore-markdown.js, a shared parser mirroring lib/parse-card-markdown.js's conventions (reusing its exported slugify), that reads design/lore.md, locates the ordered era names inside the '## Timeline of Eras' numbered list, and then extracts one record per matching '##' era section (excluding '## Summary' and '## Timeline of Eras' themselves): name (the heading text, verbatim), slug (slugify(name)), order (the era's 1-based position in the Timeline of Eras list), and summary (the full prose text of that section — every paragraph between this heading and the next '##' heading or end of file, joined). tools/sync-lore-eras-to-jaina.js prints one JSON payload per record in --dry-run mode and, mirroring its sibling dry-run-only proposals, makes no live Jaina API calls in this unit — printing a 'not yet implemented' message and exiting 1 without --dry-run, so no credentials or network access are required by node --test. This is content-authoring tooling under the T16 partial software-gate opening, not game implementation.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Review: cardgame-jaina-lore-sync-dryrun (cycle 1)

## Scope

Diff adds exactly the 4 planned files, all new:
- `lib/parse-lore-markdown.js`
- `tools/sync-lore-eras-to-jaina.js`
- `test/parse-lore-markdown.test.js`
- `test/sync-lore-eras-to-jaina.test.js`

No existing file is touched (confirmed against the diff — no modifications to
`design/lore.md`, `design/DESIGN-READINESS.md`, or anything else). Matches the
plan's "additive only" constraint.

## AC-by-AC verification

**AC1** — `--dry-run` exits 0, prints exactly 6 JSON objects in Timeline-of-Eras order.
Verified `design/lore.md`'s actual heading structure (`grep -n "^#"`) is exactly
Summary / Timeline of Eras / 6 era `##` sections in the order the plan claims,
and each heading text matches its Timeline-of-Eras list entry verbatim. `main()`
in the tool prints one `JSON.stringify(buildRecord(era))` line per era from
`loadAllEras()`, which returns records sorted by `order`. Satisfied.

**AC2** — name/slug/order/summary fields; slug via the identical exported `slugify`.
`lib/parse-lore-markdown.js` imports `{ slugify } = require('./parse-card-markdown')`
and re-exports the same reference (not a re-implementation) — confirmed
`lib/
