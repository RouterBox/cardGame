#!/usr/bin/env node
'use strict';

const { loadAllWorlds } = require('../lib/parse-star-atlas-markdown');

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
  const dryRun = process.argv.includes('--dry-run');

  if (!dryRun) {
    console.error(NOT_IMPLEMENTED_MESSAGE);
    process.exitCode = 1;
    return;
  }

  const worlds = loadAllWorlds();
  for (const world of worlds) {
    console.log(JSON.stringify(buildRecord(world)));
  }
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
