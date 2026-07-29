'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-cards-to-jaina.js');
// All of design/cards/*.md — the sync tool covers every card file
// (alpha-set, frontier-set, ...), matching lib/parse-card-markdown's
// loadAllCards.
const CARDS_DIR = path.join(REPO_ROOT, 'design', 'cards');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// A level-3 section only counts as a card record if it carries the three
// required fields — same convention render-card.test.js relies on for this file.
function listExpectedCards() {
  const files = fs.readdirSync(CARDS_DIR).filter((f) => f.endsWith('.md')).sort();
  const cards = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(CARDS_DIR, file), 'utf8');
    const sections = parseSections(content);
    cards.push(...sections
      .filter((s) => s.level === 3)
      .map((s) => ({ title: s.title, body: s.lines.join('\n') }))
      .filter(
        (c) =>
          c.body.includes('Cost line:') &&
          c.body.includes('Type line:') &&
          c.body.includes('Rules text:')
      ));
  }
  return cards;
}

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly one JSON object per card record
// found under design/cards/, each carrying name, slug, costLine, typeLine,
// rulesText, and statsLine.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints one JSON record per card with the required fields', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-cards-to-jaina.js --dry-run` to exit 0');

  const expectedCards = listExpectedCards();
  assert.ok(expectedCards.length >= 18, `expected at least the 18 Alpha cards across design/cards/, found ${expectedCards.length}`);

  const lines = parseLines(stdout);
  assert.strictEqual(
    lines.length,
    expectedCards.length,
    `expected exactly ${expectedCards.length} JSON lines, got ${lines.length}`
  );

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  const expectedNames = new Set(expectedCards.map((c) => c.title));
  for (const record of records) {
    assert.ok(expectedNames.has(record.name), `unexpected card name "${record.name}" in sync output`);
    assert.strictEqual(typeof record.slug, 'string');
    assert.strictEqual(typeof record.costLine, 'string');
    assert.strictEqual(typeof record.typeLine, 'string');
    assert.strictEqual(typeof record.rulesText, 'string');
    assert.ok(
      record.statsLine === null || typeof record.statsLine === 'string',
      'expected statsLine to be a string or null'
    );
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      ['costLine', 'name', 'rulesText', 'slug', 'statsLine', 'typeLine'],
      `expected record for "${record.name}" to carry exactly the name/slug/costLine/typeLine/rulesText/statsLine fields`
    );
  }
});

// ---------------------------------------------------------------------------
// AC2: slug is computed with the identical slugify(name) algorithm already
// used in tools/render-card.js.
// ---------------------------------------------------------------------------

test('AC2: slug matches the render-card.js slugify(name) algorithm', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.ok(records.length > 0, 'expected at least one record to check slugs against');
  for (const record of records) {
    assert.strictEqual(
      record.slug,
      slugify(record.name),
      `expected slug "${record.slug}" for "${record.name}" to match slugify(name)`
    );
  }

  // Spot-check a name with an apostrophe, matching parse-card-markdown.test.js's
  // slugify coverage of "Oathbreaker's Toll" -> "oathbreaker-s-toll".
  const toll = records.find((r) => r.name === "Oathbreaker's Toll");
  assert.ok(toll, 'expected to find "Oathbreaker\'s Toll" in the sync output');
  assert.strictEqual(toll.slug, 'oathbreaker-s-toll');
});

// ---------------------------------------------------------------------------
// AC3 (live-sync unit): without --dry-run and without Jaina credentials in
// the environment, the script exits 1 with a clear "Jaina credentials not
// configured" message — no unhandled exception, no silent no-op, and no
// network call (the tool file itself still never calls fetch(); only
// lib/jaina-client.js may).
// ---------------------------------------------------------------------------

function envWithoutJainaCredentials() {
  const env = { ...process.env };
  delete env.JAINA_API_KEY;
  delete env.JAINA_PROJECT_ID;
  return env;
}

test('AC3: without --dry-run and without credentials, exits 1 with a clear credentials message', () => {
  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: envWithoutJainaCredentials(),
    });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-cards-to-jaina.js` (no flag, no creds) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(
    /Jaina credentials not configured/.test(output),
    `expected a "Jaina credentials not configured" message, got: ${output}`
  );
  assert.ok(
    /JAINA_API_KEY/.test(output) && /JAINA_PROJECT_ID/.test(output),
    `expected the message to name both required env vars, got: ${output}`
  );

  const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(
    !/require\(\s*['"](?:https?|child_process)['"]\s*\)/.test(scriptSource),
    'expected no network or subprocess module usage in the sync script'
  );
  assert.ok(!/\bfetch\s*\(/.test(scriptSource), 'expected no direct fetch() calls in the tool file');
});

// ---------------------------------------------------------------------------
// Live-sync path (AC1 + AC2 of the live-sync unit): the non-dry-run code path
// is exercised end to end through a fake injected client — upsert() is called
// exactly once per card record, a one-line summary is printed, and no network
// module is ever touched.
// ---------------------------------------------------------------------------

const {
  buildRecord,
  runLiveSync,
  resolveLiveClient,
  CREDENTIALS_MISSING_MESSAGE,
} = require('../tools/sync-cards-to-jaina');
const { loadAllCards } = require('../lib/parse-card-markdown');

test('AC1: runLiveSync calls the injected client upsert once per card and prints a one-line summary', async () => {
  const cards = loadAllCards();
  assert.ok(cards.length >= 18, `expected at least 18 cards, found ${cards.length}`);

  const upserted = [];
  const fakeClient = {
    upsert: async (record) => {
      upserted.push(record);
      return { id: `fake-${upserted.length}` };
    },
  };

  const logged = [];
  const originalLog = console.log;
  console.log = (line) => logged.push(String(line));
  try {
    await runLiveSync(fakeClient, cards);
  } finally {
    console.log = originalLog;
  }

  assert.strictEqual(upserted.length, cards.length, 'expected exactly one upsert per parsed card record');
  assert.deepStrictEqual(
    upserted,
    cards.map(buildRecord),
    'expected each upsert to receive the same record shape --dry-run prints'
  );
  assert.strictEqual(logged.length, 1, 'expected exactly one summary line');
  assert.strictEqual(logged[0], `Synced ${cards.length} card record(s) to Jaina.`);
});

test('AC1: the production client is constructed only when both env vars are present', () => {
  assert.deepStrictEqual(resolveLiveClient({}), { error: CREDENTIALS_MISSING_MESSAGE });
  assert.deepStrictEqual(resolveLiveClient({ JAINA_API_KEY: 'k' }), { error: CREDENTIALS_MISSING_MESSAGE });
  assert.deepStrictEqual(resolveLiveClient({ JAINA_PROJECT_ID: 'p' }), { error: CREDENTIALS_MISSING_MESSAGE });

  const resolved = resolveLiveClient({ JAINA_API_KEY: 'k', JAINA_PROJECT_ID: 'p' });
  assert.ok(resolved.client, 'expected a client when both env vars are present');
  assert.strictEqual(typeof resolved.client.upsert, 'function');
  assert.strictEqual(resolved.error, undefined);
});

// ---------------------------------------------------------------------------
// AC4 (held_out): running the dry-run twice in a row against unchanged
// markdown produces byte-identical stdout output.
// ---------------------------------------------------------------------------

test('AC4: running --dry-run twice in a row produces byte-identical stdout', () => {
  const first = runDryRun();
  const second = runDryRun();
  assert.strictEqual(first, second, 'expected two consecutive --dry-run runs to produce identical stdout');
});
