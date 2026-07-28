#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parseCardMarkdown, slugify } = require('../lib/parse-card-markdown');

const REPO_ROOT = path.join(__dirname, '..');
const CARDS_DIR = path.join(REPO_ROOT, 'design', 'cards');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented in this unit. Re-run with --dry-run ' +
  'to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Card loading — design/cards/*.md via the shared parser (lib/parse-card-markdown.js)
// ---------------------------------------------------------------------------

function loadCardsFromFile(absPath) {
  const markdown = fs.readFileSync(absPath, 'utf8');
  return parseCardMarkdown(markdown);
}

function loadAllCards() {
  const files = fs
    .readdirSync(CARDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
  const cards = [];
  for (const file of files) {
    cards.push(...loadCardsFromFile(path.join(CARDS_DIR, file)));
  }
  return cards;
}

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
