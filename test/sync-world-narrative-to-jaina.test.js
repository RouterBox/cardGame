'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections, sectionText } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-world-narrative-to-jaina.js');
const WORLD_PATH = path.join(REPO_ROOT, 'design', 'world.md');

const NARRATIVE_TITLES = ['The Setting', 'A History in Brief'];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function paragraphFromBody(body) {
  if (!body) return '';
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}

// Independently derives the expected narrative records straight from
// design/world.md, mirroring test/sync-founts-to-jaina.test.js's
// listExpectedFounts() — without depending on
// lib/parse-world-narrative-markdown.js itself.
function listExpectedNarrativeSections() {
  const content = fs.readFileSync(WORLD_PATH, 'utf8');
  const sections = parseSections(content);

  return NARRATIVE_TITLES.map((title) => {
    const body = sectionText(sections, new RegExp(`^${escapeRegExp(title)}$`));
    return { title, slug: slugify(title), body: paragraphFromBody(body) };
  });
}

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC3: --dry-run exits 0 and prints exactly 2 JSON objects, one per named H2
// narrative section, in order.
// ---------------------------------------------------------------------------

test('AC3: --dry-run exits 0 and prints exactly 2 JSON objects, titled "The Setting" then "A History in Brief"', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-world-narrative-to-jaina.js --dry-run` to exit 0');

  const lines = parseLines(stdout);
  assert.strictEqual(lines.length, 2, `expected exactly 2 JSON lines, got ${lines.length}`);

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  assert.deepStrictEqual(records.map((r) => r.title), NARRATIVE_TITLES);

  const expected = listExpectedNarrativeSections();
  assert.strictEqual(records.length, expected.length);
  for (let i = 0; i < records.length; i++) {
    assert.strictEqual(records[i].title, expected[i].title);
    assert.strictEqual(records[i].slug, expected[i].slug);
    assert.strictEqual(records[i].body, expected[i].body, `body mismatch for "${records[i].title}"`);
  }
});

// ---------------------------------------------------------------------------
// AC3: every printed record has exactly title/slug/body; slug matches
// slugify(title).
// ---------------------------------------------------------------------------

test('AC3: each record carries exactly the 3 required fields, and slug matches slugify(title)', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.strictEqual(records.length, 2);
  for (const record of records) {
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      ['body', 'slug', 'title'],
      `expected record for "${record.title}" to carry exactly the 3 required fields`
    );
    assert.strictEqual(
      record.slug,
      slugify(record.title),
      `expected slug "${record.slug}" for "${record.title}" to match slugify(title)`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3: without --dry-run, the script makes no Jaina API calls, requires no
// network access or credentials, prints a "not yet implemented" message, and
// exits 1.
// ---------------------------------------------------------------------------

test('AC3: without --dry-run, exits 1 with a "not yet implemented" message and makes no network/subprocess calls', () => {
  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-world-narrative-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(/not yet implemented/i.test(output), `expected a "not yet implemented" message, got: ${output}`);
  assert.ok(/world narrative/i.test(output), `expected the message to mention World Narrative, got: ${output}`);
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

test('AC3: node --test needs no JAINA_API_KEY / JAINA_PROJECT_ID to exercise the no-flag path', () => {
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
// AC3: the tool delegates its dry-run control flow to
// lib/run-jaina-dryrun-cli.js's runDryRunSyncCli rather than hand-rolling it.
// ---------------------------------------------------------------------------

test('AC3: the tool calls runDryRunSyncCli rather than hand-rolling the --dry-run control flow', () => {
  const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');

  assert.ok(
    /runDryRunSyncCli/.test(scriptSource),
    'expected the tool source to reference runDryRunSyncCli'
  );
  assert.ok(
    /require\(\s*['"]\.\.\/lib\/run-jaina-dryrun-cli['"]\s*\)/.test(scriptSource),
    'expected the tool to require ../lib/run-jaina-dryrun-cli'
  );
  assert.ok(
    !/argv\.includes\(\s*['"]--dry-run/.test(scriptSource),
    'expected no hand-rolled argv.includes(\'--dry-run\') check — that belongs to the shared helper'
  );
  assert.ok(
    !/process\.exitCode\s*=\s*1/.test(scriptSource),
    'expected no direct process.exitCode = 1 assignment — that belongs to the shared helper'
  );
});

// ---------------------------------------------------------------------------
// AC3: running --dry-run twice in a row against unchanged markdown produces
// byte-identical stdout (deterministic ordering, no timestamps/randomness).
// ---------------------------------------------------------------------------

test('AC3: running --dry-run twice in a row produces byte-identical stdout', () => {
  const first = runDryRun();
  const second = runDryRun();
  assert.strictEqual(first, second, 'expected two consecutive --dry-run runs to produce identical stdout');
});
