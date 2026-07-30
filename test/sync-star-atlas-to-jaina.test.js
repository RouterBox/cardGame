'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-star-atlas-to-jaina.js');
const STAR_ATLAS_PATH = path.join(REPO_ROOT, 'design', 'star-atlas.md');

const HOMEWORLDS_TITLE = 'Homeworlds';
const FRONTIER_TITLE = 'Frontier & Contested Worlds';

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Independently derives the expected world records straight from
// design/star-atlas.md, mirroring the "## Homeworlds / ## Frontier &
// Contested Worlds, each holding `###` per-world sections" convention
// documented in the unit's plan — without depending on
// lib/parse-star-atlas-markdown.js itself.
function listExpectedWorlds() {
  const content = fs.readFileSync(STAR_ATLAS_PATH, 'utf8');
  const sections = parseSections(content);

  const worlds = [];
  let currentH2 = null;
  for (const section of sections) {
    if (section.level === 2) {
      currentH2 = section.title;
      continue;
    }
    if (section.level !== 3) continue;
    if (currentH2 !== HOMEWORLDS_TITLE && currentH2 !== FRONTIER_TITLE) continue;

    const match = section.title.match(/^(.+?)\s+—\s+(.+)$/);
    const name = match ? match[1].trim() : section.title.trim();
    const subtitle = match ? match[2].trim() : null;
    const type = currentH2 === HOMEWORLDS_TITLE ? 'homeworld' : 'frontier';
    const race = type === 'homeworld' && subtitle ? subtitle.replace(/^Homeworld of the\s+/, '').trim() : null;
    const description = section.lines.map((l) => l.trim()).filter(Boolean).join(' ').trim();

    worlds.push({ name, slug: slugify(name), type, race, description });
  }
  return worlds;
}

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly 8 JSON objects, one per `###`
// heading in design/star-atlas.md, in file order.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints exactly 8 JSON objects, one per world section', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-star-atlas-to-jaina.js --dry-run` to exit 0');

  const lines = parseLines(stdout);
  assert.strictEqual(lines.length, 8, `expected exactly 8 JSON lines, got ${lines.length}`);

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  const expected = listExpectedWorlds();
  assert.deepStrictEqual(
    records.map((r) => r.name),
    expected.map((r) => r.name)
  );
  assert.deepStrictEqual(
    records.map((r) => r.name),
    ['Ashkeel', 'Fenwreath', 'Vantaris', 'Ansareth', 'Corewright', 'Halvorne Junction', 'Kelmourn Drift', 'Tallowfen']
  );
});

// ---------------------------------------------------------------------------
// AC2: every printed record has exactly name/slug/type/race/description;
// slug matches slugify(name) using the identical algorithm as
// lib/parse-card-markdown.js.
// ---------------------------------------------------------------------------

test('AC2: each record carries exactly the 5 required fields, and slug matches slugify(name)', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.strictEqual(records.length, 8);
  for (const record of records) {
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      ['description', 'name', 'race', 'slug', 'type'],
      `expected record for "${record.name}" to carry exactly the 5 required fields`
    );
    assert.strictEqual(
      record.slug,
      slugify(record.name),
      `expected slug "${record.slug}" for "${record.name}" to match slugify(name)`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3 (held out): the 5 Homeworlds records have type 'homeworld' and race
// matching the civilization named after the heading's em-dash; the 3
// Frontier records have type 'frontier' and race null.
// ---------------------------------------------------------------------------

test('AC3: Homeworlds records are type homeworld with correct race; Frontier records are type frontier with race null', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));
  const expected = listExpectedWorlds();

  assert.strictEqual(records.length, expected.length);
  for (let i = 0; i < records.length; i++) {
    assert.strictEqual(records[i].type, expected[i].type, `type mismatch for "${records[i].name}"`);
    assert.strictEqual(records[i].race, expected[i].race, `race mismatch for "${records[i].name}"`);
    assert.strictEqual(records[i].description, expected[i].description, `description mismatch for "${records[i].name}"`);
  }

  const homeworldRecords = records.slice(0, 5);
  const expectedRaces = ['Cindral Reach', 'Mireth Bloom', 'Panoptic Concord', 'Starweave Communion', 'Wrought Assembly'];
  homeworldRecords.forEach((record, i) => {
    assert.strictEqual(record.type, 'homeworld');
    assert.strictEqual(record.race, expectedRaces[i]);
  });

  const frontierRecords = records.slice(5);
  for (const record of frontierRecords) {
    assert.strictEqual(record.type, 'frontier');
    assert.strictEqual(record.race, null);
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

  assert.ok(error, 'expected `node tools/sync-star-atlas-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(/not yet implemented/i.test(output), `expected a "not yet implemented" message, got: ${output}`);
  assert.ok(/star atlas/i.test(output), `expected the message to mention the star atlas, got: ${output}`);
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

test('AC5: --dry-run output order is ashkeel, fenwreath, vantaris, ansareth, corewright, halvorne-junction, kelmourn-drift, tallowfen', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.deepStrictEqual(
    records.map((r) => r.slug),
    ['ashkeel', 'fenwreath', 'vantaris', 'ansareth', 'corewright', 'halvorne-junction', 'kelmourn-drift', 'tallowfen']
  );
});
