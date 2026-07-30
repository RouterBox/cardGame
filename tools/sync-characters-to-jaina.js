#!/usr/bin/env node
'use strict';

const { loadAllCharacters } = require('../lib/parse-character-markdown');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for characters in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'characters' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(character) {
  return {
    name: character.name,
    slug: character.slug,
    race: character.race,
    title: character.title,
    bio: character.bio,
    threads: character.threads,
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

  const characters = loadAllCharacters();
  for (const character of characters) {
    console.log(JSON.stringify(buildRecord(character)));
  }
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
