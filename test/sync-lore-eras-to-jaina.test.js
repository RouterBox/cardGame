'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-lore-eras-to-jaina.js');

const ERA_NAMES = [
  'The Weave Age',
  'The Sundering',
  'The Long Dark',
  'The Five Risings',
  'The Cinderglass War',
  'Current Era: The Uneasy Expanse',
];
const ERA_SLUGS = [
  'the-weave-age',
  'the-sundering',
  'the-long-dark',
  'the-five-risings',
  'the-cinderglass-war',
  'current-era-the-uneasy-expanse',
];

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly 6 JSON objects, one per era
// heading in design/lore.md, in Timeline-of-Eras order.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints exactly 6 JSON objects, in Timeline-of-Eras order', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-lore-eras-to-jaina.js --dry-run` to exit 0');

  const lines = parseLines(stdout);
  assert.strictEqual(lines.length, 6, `expected exactly 6 JSON lines, got ${lines.length}`);

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  assert.deepStrictEqual(records.map((r) => r.name), ERA_NAMES);
});

// ---------------------------------------------------------------------------
// AC2: every printed record has exactly name/slug/order/summary; slug
// matches slugify(name) using the identical algorithm as
// lib/parse-card-markdown.js.
// ---------------------------------------------------------------------------

test('AC2: each record carries exactly the 4 required fields, and slug matches slugify(name)', () => {
  const { slugify } = require(path.join(REPO_ROOT, 'lib', 'parse-card-markdown.js'));
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.strictEqual(records.length, 6);
  for (const record of records) {
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      ['name', 'order', 'slug', 'summary'],
      `expected record for "${record.name}" to carry exactly the 4 required fields`
    );
    assert.strictEqual(
      record.slug,
      slugify(record.name),
      `expected slug "${record.slug}" for "${record.name}" to match slugify(name)`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3: order is the 1-based Timeline-of-Eras position; 1..6 unique, no
// gaps or repeats.
// ---------------------------------------------------------------------------

test('AC3: order values are 1..6 in Timeline-of-Eras order with no gaps or repeats', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.deepStrictEqual(records.map((r) => r.order), [1, 2, 3, 4, 5, 6]);
  assert.strictEqual(records[0].name, 'The Weave Age');
  assert.strictEqual(records[0].order, 1);
  assert.strictEqual(records[5].name, 'Current Era: The Uneasy Expanse');
  assert.strictEqual(records[5].order, 6);
});

// ---------------------------------------------------------------------------
// AC4 (held out): no record's summary contains the literal heading text of
// any other era, and every summary is non-empty.
// ---------------------------------------------------------------------------

test('AC4 (held out): no record summary contains another era\'s literal heading text, and all are non-empty', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  for (const record of records) {
    assert.ok(record.summary.length > 0, `expected non-empty summary for "${record.name}"`);
    for (const other of records) {
      if (other.name === record.name) continue;
      assert.ok(
        !record.summary.includes(other.name),
        `expected "${record.name}"'s summary not to contain "${other.name}"`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// AC5: without --dry-run, the script makes no Jaina API calls, requires no
// network access or credentials, prints a "not yet implemented" message,
// and exits 1.
// ---------------------------------------------------------------------------

test('AC5: without --dry-run, exits 1 with a "not yet implemented" message and makes no network/subprocess calls', () => {
  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-lore-eras-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(/not yet implemented/i.test(output), `expected a "not yet implemented" message, got: ${output}`);
  assert.ok(/lore eras?/i.test(output), `expected the message to mention lore eras, got: ${output}`);
  assert.ok(/--dry-run/.test(output), `expected the message to point at --dry-run, got: ${output}`);

  const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(
    !/require\(\s*['"](?:https?|child_process)['"]\s*\)/.test(scriptSource),
    'expected no network or subprocess module usage in the sync script'
  );
  assert.ok(!/\bfetch\s*\(/.test(scriptSource), 'expected no direct fetch() calls in the tool file');
  assert.ok(
    !/jaina-client/.test(scriptSource),
    'expected no dependency on lib/jaina-client.js in this dry-run-only unit'
  );
});

test('AC5: node --test needs no JAINA_API_KEY / JAINA_PROJECT_ID to exercise the no-flag path', () => {
  const env = { ...process.env };
  delete env.JAINA_API_KEY;
  delete env.JAINA_PROJECT_ID;

  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8', env });
  } catch (err) {
    error = err;
  }
  assert.ok(error, 'expected the no-flag path to exit non-zero even without Jaina credentials in the environment');
  assert.strictEqual(error.status, 1);
});

// ---------------------------------------------------------------------------
// AC5: running --dry-run twice in a row against unchanged markdown produces
// byte-identical stdout (deterministic ordering, no timestamps/randomness).
// ---------------------------------------------------------------------------

test('AC5: running --dry-run twice in a row produces byte-identical stdout', () => {
  const first = runDryRun();
  const second = runDryRun();
  assert.strictEqual(first, second, 'expected two consecutive --dry-run runs to produce identical stdout');
});

test('AC5: --dry-run slug order is the-weave-age .. current-era-the-uneasy-expanse', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));
  assert.deepStrictEqual(records.map((r) => r.slug), ERA_SLUGS);
});
