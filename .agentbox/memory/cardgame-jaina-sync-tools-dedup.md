# cardgame-jaina-sync-tools-dedup

- merged: 2026-07-30T15:49:54.068Z
- intent: tools/sync-characters-to-jaina.js and tools/sync-races-to-jaina.js each hand-roll the identical control flow: check process.argv for --dry-run; if absent, console.error a 'not yet implemented' message naming --dry-run and exit 1; if present, load records and console.log(JSON.stringify(buildRecord(item))) once per record. Nothing about this flow is tool-specific except the loader function, the buildRecord() field mapping, and the wording of the not-implemented message. Add lib/run-jaina-dryrun-cli.js exporting a single function, runDryRunSyncCli({ loadItems, buildRecord, notImplementedMessage, argv }), that performs exactly this shared flow and returns/sets the appropriate exit code; have both tools/sync-characters-to-jaina.js and tools/sync-races-to-jaina.js import it and call it from main(), keeping their own buildRecord() and loader imports (lib/parse-character-markdown.js, lib/parse-race-markdown.js) untouched so record shape and field mapping cannot drift. Do not touch tools/sync-cards-to-jaina.js — it already has a real credential-gated live-sync path (resolveLiveClient/runLiveSync) that is a materially different shape, not a copy of this stub pattern, and its live-sync decision (ms4l0xre) is still pending per T19/T20 — leave it alone. Do not create tools/sync-star-atlas-to-jaina.js, tools/sync-lore-eras-to-jaina.js, or tools/sync-founts-to-jaina.js in this unit; those are separately promoted/queued and may adopt the new helper on their own schedule.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-jaina-sync-tools-dedup, cycle 1

## Method note
Test execution was not permitted in this reviewer session (all `node --test`
invocations were blocked pending approval that never arrived), so verification
was done statically: full read of `lib/run-jaina-dryrun-cli.js`,
`test/run-jaina-dryrun-cli.test.js`, both refactored tool files, both existing
tool test suites, and `git diff --stat` scoped to every file the spec calls
out as off-limits (all empty — confirmed untouched).

## AC-by-AC

- **AC1** — `lib/run-jaina-dryrun-cli.js` exports exactly one function,
  `runDryRunSyncCli`, matching the plan's implementation verbatim (argv check,
  not-implemented/exit-1 branch, per-record print loop, no try/catch added).
  Both `tools/sync-characters-to-jaina.js` and `tools/sync-races-to-jaina.js`
  now call it from `main()`, and the old duplicated argv-check/exit-1/print-loop
  code is gone from both files (confirmed via diff hunks — only `main()`'s body
  changed). **Met.**

- **AC2** — Diffed `buildRecord()`, `NOT_IMPLEMENTED_MESSAGE`, and the loader
  imports in both tool files: byte-identical to the plan's "untouched" claim
  (same field mappings: name/slug/race/
