'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-cards-to-jaina.js');
const CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'alpha-set.md');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// A level-3 section only counts as a card record if it carries the three
// required fields — same convention render-card.test.js relies on for this file.
function listExpectedCards() {
  const content = fs.readFileSync(CARDS_PATH, 'utf8');
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }))
    .filter(
      (c) =>
        c.body.includes('Cost line:') &&
        c.body.includes('Type line:') &&
        c.body.includes('Rules text:')
    );
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
  assert.strictEqual(expectedCards.length, 18, 'expected 18 cards in design/cards/alpha-set.md');

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
// AC3: without --dry-run, the script makes no Jaina API calls — it prints a
// message that live sync is not yet implemented and exits 1.
// ---------------------------------------------------------------------------

test('AC3: without --dry-run, the script exits 1 and prints a live-sync-not-implemented message', () => {
  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-cards-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(
    /not yet implemented/i.test(output) && /live sync/i.test(output),
    `expected a "live sync ... not yet implemented" message, got: ${output}`
  );

  const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(
    !/require\(\s*['"](?:https?|child_process)['"]\s*\)/.test(scriptSource),
    'expected no network or subprocess module usage in the sync script'
  );
  assert.ok(!/\bfetch\s*\(/.test(scriptSource), 'expected no fetch() calls to a Jaina API');
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
