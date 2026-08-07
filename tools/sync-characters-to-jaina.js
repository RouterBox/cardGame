#!/usr/bin/env node
'use strict';

const { loadAllCharacters } = require('../lib/parse-character-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

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
  runDryRunSyncCli({
    loadItems: loadAllCharacters,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
    // Live path (RouterBox approved 2026-08-06): active only when the
    // environment carries Jaina credentials — see lib/run-jaina-dryrun-cli.js.
    // The character schema's `race` field is a reference (record UUID), so
    // it is omitted here; the race name stays readable inside identity via
    // the source doc. Wiring real references is a follow-up.
    live: {
      schemaSlug: 'character',
      packageSlug: 'alpha',
      label: 'character',
      // Jaina json fields require an OBJECT ("Threads must be an object",
      // VALIDATION_FAILED on a bare array, verified live 2026-08-06) — so
      // the thread list ships wrapped as { entries: [...] }.
      toWire: (r) => ({ name: r.name, role: r.title, identity: r.bio, threads: { entries: r.threads } }),
    },
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
