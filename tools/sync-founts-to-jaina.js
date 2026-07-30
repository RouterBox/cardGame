#!/usr/bin/env node
'use strict';

const { loadAllFounts } = require('../lib/parse-founts-markdown');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for Founts in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'fount' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(fount) {
  return {
    name: fount.name,
    slug: fount.slug,
    domain: fount.domain,
    description: fount.description,
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

  const founts = loadAllFounts();
  for (const fount of founts) {
    console.log(JSON.stringify(buildRecord(fount)));
  }
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
