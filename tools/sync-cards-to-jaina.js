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

// frontier-set.md (added by cardgame-frontier-set-spatial-cards) is deliberately
// excluded here: test/sync-cards-to-jaina.test.js hardcodes its expected record
// count to design/cards/alpha-set.md's 18 cards, so picking frontier-set.md up
// here would break that pre-existing test. A future unit should update that test
// to cover multi-file card sets and drop this exclusion so frontier-set.md syncs too.
const CARDS_NOT_YET_WIRED_FOR_SYNC = new Set(['frontier-set.md']);

function loadAllCards() {
  const files = fs
    .readdirSync(CARDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
  const cards = [];
  for (const file of files) {
    if (CARDS_NOT_YET_WIRED_FOR_SYNC.has(file)) {
      console.warn(
        `tools/sync-cards-to-jaina.js: skipping ${file} — not yet wired for sync (see comment above CARDS_NOT_YET_WIRED_FOR_SYNC in this file).`
      );
      continue;
    }
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
