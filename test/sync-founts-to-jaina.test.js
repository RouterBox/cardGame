'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-founts-to-jaina.js');
const WORLD_PATH = path.join(REPO_ROOT, 'design', 'world.md');

const FOUNTS_SECTION_TITLE = 'Cosmology: The Five Founts';

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Independently derives the expected Fount records straight from
// design/world.md, mirroring the "## Cosmology: The Five Founts, each
// holding `###` per-Fount sections" convention documented in the unit's
// plan — without depending on lib/parse-founts-markdown.js itself.
function listExpectedFounts() {
  const content = fs.readFileSync(WORLD_PATH, 'utf8');
  const sections = parseSections(content);

  const founts = [];
  let currentH2 = null;
  for (const section of sections) {
    if (section.level === 2) {
      currentH2 = section.title;
      continue;
    }
    if (section.level !== 3) continue;
    if (currentH2 !== FOUNTS_SECTION_TITLE) continue;

    const match = section.title.match(/^(.+?)\s+—\s+(.+)$/);
    const name = match ? match[1].trim() : section.title.trim();
    const domain = match ? match[2].trim() : null;
    const description = section.lines.map((l) => l.trim()).filter(Boolean).join(' ').trim();

    founts.push({ name, slug: slugify(name), domain, description });
  }
  return founts;
}

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly 5 JSON objects, one per `###`
// heading in design/world.md's Founts section, in file order.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints exactly 5 JSON objects, one per Fount section', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-founts-to-jaina.js --dry-run` to exit 0');

  const lines = parseLines(stdout);
  assert.strictEqual(lines.length, 5, `expected exactly 5 JSON lines, got ${lines.length}`);

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  const expected = listExpectedFounts();
  assert.deepStrictEqual(
    records.map((r) => r.name),
    expected.map((r) => r.name)
  );
  assert.deepStrictEqual(
    records.map((r) => r.name),
    ['The Mass', 'The Bloom', 'The Signal', 'The Circuit', 'The Tangle']
  );
});

// ---------------------------------------------------------------------------
// AC2: every printed record has exactly name/slug/domain/description; slug
// matches slugify(name) using the identical algorithm as
// lib/parse-card-markdown.js.
// ---------------------------------------------------------------------------

test('AC2: each record carries exactly the 4 required fields, and slug matches slugify(name)', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.strictEqual(records.length, 5);
  for (const record of records) {
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      ['description', 'domain', 'name', 'slug'],
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
// AC3 (held out): domain matches the word(s) after the em-dash in that
// Fount's own heading; description is non-empty and contains no
// bleed-through from an adjacent Fount's heading text.
// ---------------------------------------------------------------------------

test('AC3: domain matches the heading em-dash text, and description has no cross-Fount bleed-through', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));
  const expected = listExpectedFounts();

  assert.strictEqual(records.length, expected.length);
  for (let i = 0; i < records.length; i++) {
    assert.strictEqual(records[i].domain, expected[i].domain, `domain mismatch for "${records[i].name}"`);
    assert.strictEqual(records[i].description, expected[i].description, `description mismatch for "${records[i].name}"`);
  }

  const expectedDomains = ['materials', 'biology', 'intelligence', 'technology', 'magic'];
  records.forEach((record, i) => {
    assert.strictEqual(record.domain, expectedDomains[i]);
  });

  for (const record of records) {
    assert.ok(record.description.length > 0, `expected non-empty description for "${record.name}"`);
    for (const other of records) {
      if (other.name === record.name) continue;
      assert.ok(
        !record.description.includes(other.name),
        `expected "${record.name}"'s description not to contain "${other.name}"`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// AC4: without --dry-run, the script makes no Jaina API calls, requires no
// network access or credentials, prints a "not yet implemented" message, and
// exits 1.
// ---------------------------------------------------------------------------

test('AC4: without --dry-run, exits 1 with a "not yet implemented" message and makes no network/subprocess calls', () => {
  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-founts-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(/not yet implemented/i.test(output), `expected a "not yet implemented" message, got: ${output}`);
  assert.ok(/founts/i.test(output), `expected the message to mention Founts, got: ${output}`);
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

test('AC4: node --test needs no JAINA_API_KEY / JAINA_PROJECT_ID to exercise the no-flag path', () => {
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

test('AC5: --dry-run output order is the-mass, the-bloom, the-signal, the-circuit, the-tangle', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.deepStrictEqual(
    records.map((r) => r.slug),
    ['the-mass', 'the-bloom', 'the-signal', 'the-circuit', 'the-tangle']
  );
});
