#!/usr/bin/env node
'use strict';

const { loadAllRaces } = require('../lib/parse-race-markdown');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for races in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'races' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(race) {
  return {
    name: race.name,
    slug: race.slug,
    identity: race.identity,
    primaryStrength: race.primaryStrength,
    complementaryStrengths: race.complementaryStrengths,
    counteringWeaknesses: race.counteringWeaknesses,
    signatureHooks: race.signatureHooks,
    visualIdentity: race.visualIdentity,
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

  const races = loadAllRaces();
  for (const race of races) {
    console.log(JSON.stringify(buildRecord(race)));
  }
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
