'use strict';

// Shared --dry-run control flow for Jaina sync tools that have no live-sync
// path yet. Each tool supplies its own loader, record shape, and wording;
// this module owns only the argv check, the not-implemented/exit-1 branch,
// and the per-record JSON print loop.
function runDryRunSyncCli({ loadItems, buildRecord, notImplementedMessage, argv }) {
  const dryRun = argv.includes('--dry-run');

  if (!dryRun) {
    console.error(notImplementedMessage);
    process.exitCode = 1;
    return;
  }

  const items = loadItems();
  for (const item of items) {
    console.log(JSON.stringify(buildRecord(item)));
  }
}

module.exports = { runDryRunSyncCli };
