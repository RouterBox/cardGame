#!/usr/bin/env node
'use strict';

const { loadAllRaces } = require('../lib/parse-race-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

// Domain strength (design/races/*.md vocabulary) → Fount name (the Jaina
// race schema's select options), per design/world.md's Five Founts table.
const FOUNT_BY_DOMAIN = {
  Materials: 'The Mass',
  Biology: 'The Bloom',
  Intelligence: 'The Signal',
  Technology: 'The Circuit',
  Magic: 'The Tangle',
};

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
  runDryRunSyncCli({
    loadItems: loadAllRaces,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
    // Live path (RouterBox approved 2026-08-06): active only when the
    // environment carries Jaina credentials — see lib/run-jaina-dryrun-cli.js.
    // The race schema's fount selects use Fount NAMES ("The Mass"), while
    // the design docs speak in domain strengths ("Materials") — FOUNT_BY_
    // DOMAIN is the same mapping design/world.md's Five Founts table defines.
    live: {
      schemaSlug: 'race',
      packageSlug: 'alpha',
      label: 'race',
      toWire: (r) => ({
        name: r.name,
        identity: r.identity,
        primary_fount: FOUNT_BY_DOMAIN[r.primaryStrength],
        complementary_founts: r.complementaryStrengths.map((s) => FOUNT_BY_DOMAIN[s]),
        countering_founts: r.counteringWeaknesses.map((s) => FOUNT_BY_DOMAIN[s]),
        signature_hooks: r.signatureHooks.map((h) => `${h.name}: ${h.description}`),
        visual_identity: r.visualIdentity,
      }),
    },
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
