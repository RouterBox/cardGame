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
    // Live path (RouterBox approved 2026-08-06): active only when the
    // environment carries Jaina credentials — see lib/run-jaina-dryrun-cli.js.
    // The schema's required `name` field doubles the title: `name` is the
    // upsert identity key every schema shares (see the client the shared
    // CLI helper resolves).
    live: {
      schemaSlug: 'world-narrative',
      packageSlug: 'main',
      label: 'world narrative',
      toWire: (r) => ({ name: r.title, title: r.title, body: r.body }),
    },
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
