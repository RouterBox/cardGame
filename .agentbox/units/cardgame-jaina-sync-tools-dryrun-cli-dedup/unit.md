name: cardgame-jaina-sync-tools-dryrun-cli-dedup
title: Migrate the 3 remaining Jaina sync tools onto the existing runDryRunSyncCli helper
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

lib/run-jaina-dryrun-cli.js exports runDryRunSyncCli({ loadItems, buildRecord, notImplementedMessage, argv }), which owns the shared --dry-run/not-yet-implemented control flow every Jaina sync tool in this repo needs: check argv for --dry-run, print notImplementedMessage and exit 1 if absent, otherwise call loadItems() and console.log(JSON.stringify(buildRecord(item))) for each item. tools/sync-characters-to-jaina.js and tools/sync-races-to-jaina.js already import and call this helper from their main() functions. tools/sync-lore-eras-to-jaina.js (main() at lines 27-40), tools/sync-founts-to-jaina.js (main() at lines 27-40), and tools/sync-star-atlas-to-jaina.js (main() at lines 28-41) each still inline the identical logic by hand instead. For each of these 3 files: add a require of runDryRunSyncCli from '../lib/run-jaina-dryrun-cli' near the top (mirroring sync-characters-to-jaina.js's import line and placement), and replace the file's main() body with a call to runDryRunSyncCli passing that file's own loadItems function (loadAllEras / loadAllFounts / loadAllWorlds), its existing buildRecord, its existing NOT_IMPLEMENTED_MESSAGE, and process.argv. Keep each file's own buildRecord function, NOT_IMPLEMENTED_MESSAGE constant, and module.exports ({ buildRecord, NOT_IMPLEMENTED_MESSAGE }) exactly as they are today -- only the main() body changes, and only by delegating to the shared helper instead of reimplementing it. Do not touch lib/run-jaina-dryrun-cli.js, tools/sync-characters-to-jaina.js, tools/sync-races-to-jaina.js, tools/sync-cards-to-jaina.js, or any test/*.js file -- the existing sync-lore-eras/founts/star-atlas test files already exercise the CLI as a black box (spawning it as a subprocess and asserting on stdout/exit code) and must pass completely unmodified against the refactored tools.

## Acceptance Criteria

- AC1 [inferred]: tools/sync-lore-eras-to-jaina.js, tools/sync-founts-to-jaina.js, and tools/sync-star-atlas-to-jaina.js each import runDryRunSyncCli from lib/run-jaina-dryrun-cli.js and call it from main() instead of inlining the dry-run/not-implemented control flow
- AC2 [inferred]: Each of the 3 files keeps its own buildRecord function, its own NOT_IMPLEMENTED_MESSAGE constant, and an unchanged module.exports shape ({ buildRecord, NOT_IMPLEMENTED_MESSAGE })
- AC3 [paraphrase]: test/sync-lore-eras-to-jaina.test.js, test/sync-founts-to-jaina.test.js, and test/sync-star-atlas-to-jaina.test.js pass unmodified against the refactored tools, with no changes made to any file under test/
- AC4 [paraphrase] (held_out): lib/run-jaina-dryrun-cli.js, tools/sync-characters-to-jaina.js, tools/sync-races-to-jaina.js, and tools/sync-cards-to-jaina.js are byte-for-byte unchanged
