# cardgame-jaina-world-narrative-sync-dryrun

- merged: 2026-07-30T23:37:58.117Z
- intent: design/ideas-inbox.md's 'use Jaina as the content backbone' directive (2026-07-28) asked structured game content to become schema-backed Jaina records; five dry-run-only sync tools already cover cards, characters, races, star-atlas worlds, lore eras, and Fount cosmology, each with its own lib/parse-*-markdown.js parser. DESIGN-READINESS.md Section 6 Gap 3 names the one remaining piece: design/world.md's 'The Setting' and 'A History in Brief' H2 sections, pure narrative prose with no per-item structure, explicitly left out of lib/parse-founts-markdown.js's own H3-under-Founts scan. Add lib/parse-world-narrative-markdown.js exporting parseWorldNarrativeMarkdown(markdown) and loadWorldNarrativeSections(), using lib/markdown-sections.js's existing splitIntoH2Sections to find the two named H2 sections (by exact title match, in file order) and extractParagraph to build each record's body (joining that section's non-blank lines into one prose string, exactly as parse-founts-markdown.js does for a Fount's description); each record is { title, slug, body }, slug via lib/parse-card-markdown.js's shared slugify. Explicitly skip 'Cosmology: The Five Founts' -- that H2 stays lib/parse-founts-markdown.js's own territory, never re-parsed here. Add tools/sync-world-narrative-to-jaina.js mirroring tools/sync-races-to-jaina.js's structure: import loadWorldNarrativeSections, define buildRecord(section) returning { title, slug, body }, define a NOT_IMPLEMENTED_MESSAGE for World Narrative, and call lib/run-jaina-dryrun-cli.js's runDryRunSyncCli(loadWorldNarrativeSections, buildRecord, NOT_IMPLEMENTED_MESSAGE, process.argv) instead of hand-rolling the dry-run control flow. Add design/world.md's own bullet to DESIGN-READINESS.md Section 5's tooling list (matching the existing bullet format for every other sync tool) and rewrite Gap 3's final sentence to state the narrative-sync gap is now closed, citing the new tool by filename -- touch no other line of DESIGN-READINESS.md. Do not touch design/world.md, lib/parse-founts-markdown.js, lib/markdown-sections.js, lib/run-jaina-dryrun-cli.js, lib/parse-card-markdown.js, or any other existing tools/sync-*-to-jaina.js file or its test.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-jaina-world-narrative-sync-dryrun (cycle 2)

## AC coverage

- **AC1** — `lib/parse-world-narrative-markdown.js` exports `loadWorldNarrativeSections()`.
  Verified against `design/world.md`'s actual H2 headings (`## The Setting`,
  `## A History in Brief`, `## Cosmology: The Five Founts`, in that file order):
  the fixed `NARRATIVE_SECTION_TITLES` array + per-title `sections.find(...)`
  guarantees the returned order is always `['The Setting', 'A History in
  Brief']` regardless of file order, and structurally excludes the Founts H2.
  Uses `splitIntoH2Sections`/`extractParagraph` from `lib/markdown-sections.js`
  exactly as those functions are actually implemented (confirmed by reading
  the file — H2-only split, non-H2 headings reset `current` to null, so a
  `###` under Founts can never leak into these two records).
  `slugify` is re-exported by direct reference from `lib/parse-card-markdown.js`
  (confirmed identical implementation), not reimplemented. **Satisfied.**

- **AC3** — `tools/sync-world-narrative-to-jaina.js` calls
  `runDryRunSyncCli({ loadItems, buildRecord, notImplementedMessage, argv })`.
  Confirmed this is the actual (object-form) sign
