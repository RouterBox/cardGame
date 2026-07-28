#!/usr/bin/env node
'use strict';

const { slugify, loadCardsFromFile, loadAllCards } = require('../lib/parse-card-markdown');
const { createJainaClient } = require('../lib/jaina-client');

const CREDENTIALS_MISSING_MESSAGE =
  'Jaina credentials not configured: set JAINA_API_KEY and JAINA_PROJECT_ID to run a live ' +
  'sync — without them, live sync is not yet implemented for this invocation. Re-run with ' +
  '--dry-run to preview the record payloads without any credentials.';

// ---------------------------------------------------------------------------
// Jaina 'cards' schema record shape — shared by --dry-run preview and the
// live upsert path so they can never drift from each other.
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
// Live sync — upserts one record per card through an injected client so
// tests can swap in a fake and never touch the real network.
// ---------------------------------------------------------------------------

async function runLiveSync(client, cards) {
  for (const card of cards) {
    await client.upsert(buildRecord(card));
  }
  console.log(`Synced ${cards.length} card record(s) to Jaina.`);
}

// Resolves the live client from the environment. createJainaClient() does no
// I/O (see lib/jaina-client.js), so this function is safe to unit-test
// directly without touching the network.
function resolveLiveClient(env) {
  const apiKey = env.JAINA_API_KEY;
  const projectId = env.JAINA_PROJECT_ID;
  if (!apiKey || !projectId) {
    return { error: CREDENTIALS_MISSING_MESSAGE };
  }
  return { client: createJainaClient({ apiKey, projectId }) };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!dryRun) {
    const resolved = resolveLiveClient(process.env);
    if (resolved.error) {
      console.error(resolved.error);
      process.exitCode = 1;
      return;
    }
    const cards = loadAllCards();
    await runLiveSync(resolved.client, cards);
    return;
  }

  const cards = loadAllCards();
  for (const card of cards) {
    console.log(JSON.stringify(buildRecord(card)));
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err && err.message ? err.message : String(err));
    process.exitCode = 1;
  });
}

module.exports = { buildRecord, runLiveSync, resolveLiveClient, CREDENTIALS_MISSING_MESSAGE };
