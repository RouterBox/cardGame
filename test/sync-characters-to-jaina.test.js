'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-characters-to-jaina.js');
const CHAR_DIR = path.join(REPO_ROOT, 'design', 'characters');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function raceFromFilename(basename) {
  return basename
    .replace(/\.md$/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Independently derives the expected character list straight from the
// design/characters/*.md source files (excluding web.md), mirroring the
// "## Name — Title" / bio / "**Threads:**" convention documented in the
// unit's plan — without depending on lib/parse-character-markdown.js itself.
function listExpectedCharacters() {
  const files = fs
    .readdirSync(CHAR_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'web.md')
    .sort();

  const characters = [];
  for (const file of files) {
    const race = raceFromFilename(file);
    const content = fs.readFileSync(path.join(CHAR_DIR, file), 'utf8');
    const sections = parseSections(content).filter((s) => s.level === 2);

    for (const section of sections) {
      const heading = section.title.match(/^(.+?)\s+—\s+(.+)$/);
      if (!heading) continue;
      const name = heading[1].trim();
      const title = heading[2].trim();
      const body = section.lines.join('\n');

      const threadsIdx = body.search(/\*\*Threads:?\*\*/i);
      const bioBlock = threadsIdx === -1 ? body : body.slice(0, threadsIdx);
      const bio = bioBlock
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .join(' ')
        .trim();

      const threads = [];
      if (threadsIdx !== -1) {
        const listLines = body.slice(threadsIdx).split(/\r?\n/).slice(1);
        for (const line of listLines) {
          const bullet = line.trim().match(/^-\s+(.+)$/);
          if (bullet) threads.push(bullet[1].trim());
        }
      }

      characters.push({ name, slug: slugify(name), race, title, bio, threads });
    }
  }
  return characters;
}

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly 20 JSON objects, one per
// character found across the 5 race files under design/characters/, with
// design/characters/web.md excluded entirely.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints exactly one JSON record per character (20 total), excluding web.md', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-characters-to-jaina.js --dry-run` to exit 0');

  const expectedCharacters = listExpectedCharacters();
  assert.strictEqual(expectedCharacters.length, 20, `expected 20 characters in the fixture source, found ${expectedCharacters.length}`);

  const lines = parseLines(stdout);
  assert.strictEqual(lines.length, 20, `expected exactly 20 JSON lines, got ${lines.length}`);

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  const expectedNames = new Set(expectedCharacters.map((c) => c.name));
  for (const record of records) {
    assert.ok(expectedNames.has(record.name), `unexpected character name "${record.name}" in sync output`);
  }

  // web.md must never contribute a record — its H2s ("## Overview", thread
  // titles) don't match the "Name — Title" heading pattern at all.
  assert.ok(
    !records.some((r) => r.name === 'Overview'),
    'expected no record derived from web.md\'s "## Overview" section'
  );
});

// ---------------------------------------------------------------------------
// AC2: every printed record has name, slug, race, title, bio, and threads
// fields; slug is computed with the identical slugify(name) algorithm used
// by lib/parse-card-markdown.js and tools/render-card.js.
// ---------------------------------------------------------------------------

test('AC2: each record carries exactly name/slug/race/title/bio/threads, and slug matches slugify(name)', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.strictEqual(records.length, 20);
  for (const record of records) {
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      ['bio', 'name', 'race', 'slug', 'threads', 'title'],
      `expected record for "${record.name}" to carry exactly name/slug/race/title/bio/threads`
    );
    assert.strictEqual(typeof record.name, 'string');
    assert.strictEqual(typeof record.race, 'string');
    assert.strictEqual(typeof record.title, 'string');
    assert.strictEqual(typeof record.bio, 'string');
    assert.ok(Array.isArray(record.threads));
    assert.strictEqual(
      record.slug,
      slugify(record.name),
      `expected slug "${record.slug}" for "${record.name}" to match slugify(name)`
    );
  }

  // Spot-check a hyphenated name, since the em-dash/hyphen distinction is the
  // whole reason this parser can't reuse a naive split-on-hyphen approach.
  const ilvex = records.find((r) => r.name === 'Mother-Thread Ilvex');
  assert.ok(ilvex, 'expected to find "Mother-Thread Ilvex" in the sync output');
  assert.strictEqual(ilvex.slug, 'mother-thread-ilvex');
});

// ---------------------------------------------------------------------------
// AC4: without --dry-run, the script makes no Jaina API calls, requires no
// network access or credentials, prints a "not yet implemented" message, and
// exits 1 — mirroring tools/sync-cards-to-jaina.js's original (dry-run-only)
// no-flag behavior.
// ---------------------------------------------------------------------------

test('AC4: without --dry-run, exits 1 with a "not yet implemented" message and makes no network/subprocess calls', () => {
  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-characters-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(/not yet implemented/i.test(output), `expected a "not yet implemented" message, got: ${output}`);
  assert.ok(/live sync/i.test(output), `expected the message to mention live sync, got: ${output}`);
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
// byte-identical stdout output (deterministic ordering, no timestamps).
// ---------------------------------------------------------------------------

test('AC5: running --dry-run twice in a row produces byte-identical stdout', () => {
  const first = runDryRun();
  const second = runDryRun();
  assert.strictEqual(first, second, 'expected two consecutive --dry-run runs to produce identical stdout');
});

test('AC5: --dry-run output order matches on-disk file order (cindral-reach, mireth-bloom, panoptic-concord, starweave-communion, wrought-assembly), 4 characters per file', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));
  const expectedCharacters = listExpectedCharacters();

  assert.deepStrictEqual(
    records.map((r) => r.name),
    expectedCharacters.map((c) => c.name),
    'expected sync output order to match the independently-derived file order'
  );

  const raceOrder = [
    'Cindral Reach',
    'Mireth Bloom',
    'Panoptic Concord',
    'Starweave Communion',
    'Wrought Assembly',
  ];
  const raceCounts = {};
  for (const record of records) {
    raceCounts[record.race] = (raceCounts[record.race] || 0) + 1;
  }
  for (const race of raceOrder) {
    assert.strictEqual(raceCounts[race], 4, `expected exactly 4 characters for race "${race}", got ${raceCounts[race] || 0}`);
  }
});
