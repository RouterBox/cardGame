# cardgame-jaina-race-sync-dryrun

- merged: 2026-07-30T10:42:19.334Z
- intent: design/DESIGN-READINESS.md's Open Gap 4 names the hole directly: only card records (and, once its sibling proposal merges, character records) are wired to Jaina, while design/races/ (5 files, one per race) remains markdown-only prose with no Jaina schema or sync path. This is the next narrow slice under the same 2026-07-28 ideas-inbox directive that produced cardgame-jaina-card-sync-dryrun and cardgame-jaina-character-sync-dryrun (T1 discipline: no live write, races only, not the full remaining scope in one shot). Add lib/parse-race-markdown.js, a shared parser mirroring lib/parse-card-markdown.js's conventions, that reads each design/races/{race}.md file and extracts one record: name (the H1 heading text, e.g. 'The Cindral Reach'), slug (the identical slugify algorithm used by lib/parse-card-markdown.js), identity (the '## Identity' section's prose paragraph), primaryStrength (the 'Primary strength:' bullet value), complementaryStrengths and counteringWeaknesses (the two-item lists from their respective bullets), signatureHooks (an array of {name, description} pairs parsed from the '## Signature Hooks' bold-name-plus-description bullets), and visualIdentity (the '## Visual Identity' section's prose paragraph). tools/sync-races-to-jaina.js prints one JSON payload per record in --dry-run mode; without --dry-run it makes no Jaina API calls or network access, printing a message that live sync is not yet implemented for races and exiting 1, so no credentials are required by node --test. This is content-authoring tooling under the T16 partial software-gate opening, not game implementation.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review: cardgame-jaina-race-sync-dryrun (cycle 1)

## Scope

Reviewed `lib/parse-race-markdown.js`, `tools/sync-races-to-jaina.js`, and the two
new test files, against unit.md's visible ACs, plan.md, and the actual
`design/races/*.md` source files (read all 5 in full, not just the diff's own
tests, to independently verify parser correctness against real content).

## AC-by-AC

- **AC1** (dry-run exits 0, prints exactly 5 JSON objects, one per
  `design/races/*.md` file): Satisfied. `loadAllRaces()` reads
  `design/races/`, filters `.md` files, sorts by filename (alphabetical order
  = cindral-reach, mireth-bloom, panoptic-concord, starweave-communion,
  wrought-assembly — matches AC5's required order too), and
  `main()`'s dry-run branch prints one `JSON.stringify(buildRecord(race))`
  line per loaded race with no explicit non-zero exit. Verified `extractH1`
  successfully extracts a name from all 5 real files (each starts with a
  single `# The ...` H1), so none are silently dropped.

- **AC2** (name/slug/identity/primaryStrength/complementaryStrengths/
  counteringWeaknesses/signatureHooks/visualIdentity fields; slug uses the
  identical `slugify` algorithm as `lib/parse-
