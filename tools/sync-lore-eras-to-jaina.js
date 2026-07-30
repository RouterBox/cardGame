#!/usr/bin/env node
'use strict';

const { loadAllEras } = require('../lib/parse-lore-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for lore eras in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'lore era' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(era) {
  return {
    name: era.name,
    slug: era.slug,
    order: era.order,
    summary: era.summary,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  runDryRunSyncCli({
    loadItems: loadAllEras,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
