#!/usr/bin/env node
'use strict';

const { loadWorldNarrativeSections } = require('../lib/parse-world-narrative-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for World Narrative in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'world narrative' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(section) {
  return {
    title: section.title,
    slug: section.slug,
    body: section.body,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  runDryRunSyncCli({
    loadItems: loadWorldNarrativeSections,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
