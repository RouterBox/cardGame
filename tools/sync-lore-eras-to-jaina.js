#!/usr/bin/env node
'use strict';

const { loadAllEras } = require('../lib/parse-lore-markdown');

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
  const dryRun = process.argv.includes('--dry-run');

  if (!dryRun) {
    console.error(NOT_IMPLEMENTED_MESSAGE);
    process.exitCode = 1;
    return;
  }

  const eras = loadAllEras();
  for (const era of eras) {
    console.log(JSON.stringify(buildRecord(era)));
  }
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
