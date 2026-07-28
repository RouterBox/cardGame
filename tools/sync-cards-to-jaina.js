#!/usr/bin/env node
'use strict';

const { slugify, loadCardsFromFile, loadAllCards } = require('../lib/parse-card-markdown');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented in this unit. Re-run with --dry-run ' +
  'to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'cards' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(card) {
  return {
    name: card.name,
    slug: slugify(card.name),
    costLine: card.costLine,
    typeLine: card.typeLine,
    rulesText: card.rulesText,
    statsLine: card.statsLine,
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

  const cards = loadAllCards();
  for (const card of cards) {
    console.log(JSON.stringify(buildRecord(card)));
  }
}

main();
