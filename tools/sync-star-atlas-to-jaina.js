#!/usr/bin/env node
'use strict';

const { loadAllWorlds } = require('../lib/parse-star-atlas-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for the star atlas in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'star atlas' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(world) {
  return {
    name: world.name,
    slug: world.slug,
    type: world.type,
    race: world.race,
    description: world.description,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  runDryRunSyncCli({
    loadItems: loadAllWorlds,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
    // Live path (RouterBox approved 2026-08-06): active only when the
    // environment carries Jaina credentials — see lib/run-jaina-dryrun-cli.js.
    // The `world` schema stores the owning race as plain text (race_name),
    // not a reference — cross-record references are a follow-up.
    live: {
      schemaSlug: 'world',
      packageSlug: 'main',
      label: 'world',
      toWire: (r) => ({ name: r.name, world_type: r.type, race_name: r.race, description: r.description }),
    },
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
