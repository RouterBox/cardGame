'use strict';

// Shared --dry-run / --live control flow for the Jaina sync tools. Each tool
// supplies its own loader, record shape, wording, and (since 2026-08-06) an
// optional `live` config; this module owns the argv check, the
// credentials/not-implemented exit-1 branch, the per-record JSON print loop,
// and the live upsert loop.
//
// The live path exists because RouterBox explicitly approved all six content
// live syncs on 2026-08-06 ("approve all those"). It stays inert unless BOTH
// are true: the tool passes a `live` config AND the operator's environment
// carries JAINA_API_KEY + JAINA_PROJECT_ID. Without either, the no-flag
// invocation prints the tool's own message (which always contains the phrase
// "not yet implemented", the contract every sync tool's AC test pins) and
// exits 1 — byte-identical to the pre-live behavior, so `node --test` runs
// (which never set Jaina credentials) exercise exactly the old contract.
//
// The tools themselves never require lib/jaina-client.js — their own AC
// tests forbid it ("no dependency on lib/jaina-client.js in this
// dry-run-only unit"); this helper is the only importer.
function runDryRunSyncCli({ loadItems, buildRecord, notImplementedMessage, argv, live, env }) {
  const dryRun = argv.includes('--dry-run');

  if (!dryRun) {
    const environment = env || process.env;
    const apiKey = environment.JAINA_API_KEY;
    const projectId = environment.JAINA_PROJECT_ID;
    if (!live || !apiKey || !projectId) {
      console.error(notImplementedMessage);
      process.exitCode = 1;
      return;
    }
    const { createJainaClient } = require('./jaina-client');
    const client = createJainaClient({
      apiKey,
      projectId,
      schemaSlug: live.schemaSlug,
      packageSlug: live.packageSlug,
      toWire: live.toWire,
    });
    const items = loadItems();
    return (async () => {
      for (const item of items) {
        await client.upsert(buildRecord(item));
      }
      console.log(`Synced ${items.length} ${live.label} record(s) to Jaina.`);
    })().catch((err) => {
      console.error(err && err.message ? err.message : String(err));
      process.exitCode = 1;
    });
  }

  const items = loadItems();
  for (const item of items) {
    console.log(JSON.stringify(buildRecord(item)));
  }
}

module.exports = { runDryRunSyncCli };
