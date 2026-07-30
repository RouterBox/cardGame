'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections, sectionText } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-races-to-jaina.js');
const RACES_DIR = path.join(REPO_ROOT, 'design', 'races');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractH1(content) {
  const match = content.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1].trim() : null;
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

// Independently derives the expected race record straight from the
// design/races/*.md source files, mirroring the H1 / Identity / Strengths &
// Weaknesses / Signature Hooks / Visual Identity convention documented in
// the unit's plan — without depending on lib/parse-race-markdown.js itself.
function listExpectedRaces() {
  const files = fs.readdirSync(RACES_DIR).filter((f) => f.endsWith('.md')).sort();

  return files.map((file) => {
    const content = fs.readFileSync(path.join(RACES_DIR, file), 'utf8');
    const name = extractH1(content);
    const sections = parseSections(content);

    const identity = paragraphFromBody(sectionText(sections, /^identity$/i));
    const visualIdentity = paragraphFromBody(sectionText(sections, /^visual identity$/i));

    const strengthsBody = sectionText(sections, /^strengths\s*&\s*weaknesses$/i) || '';
    const primaryMatch = strengthsBody.match(/^-\s+\*\*Primary strength:\*\*\s*(.+)$/m);
    const complementaryMatch = strengthsBody.match(/^-\s+\*\*Complementary strengths:\*\*\s*(.+)$/m);
    const counteringMatch = strengthsBody.match(/^-\s+\*\*Countering weaknesses:\*\*\s*(.+)$/m);
    const splitList = (m) => (m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : []);

    const hooksBody = sectionText(sections, /^signature hooks$/i) || '';
    const signatureHooks = hooksBody
      .split(/\r?\n/)
      .map((line) => line.trim())
      .map((line) => line.match(/^-\s+\*\*(.+?)\*\*\s+—\s+(.+)$/))
      .filter(Boolean)
      .map((m) => ({ name: m[1].trim(), description: m[2].trim() }));

    return {
      name,
      slug: slugify(name),
      identity,
      primaryStrength: primaryMatch ? primaryMatch[1].trim() : null,
      complementaryStrengths: splitList(complementaryMatch),
      counteringWeaknesses: splitList(counteringMatch),
      signatureHooks,
      visualIdentity,
    };
  });
}

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly 5 JSON objects, one per file
// under design/races/.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints exactly 5 JSON objects, one per design/races/*.md file', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-races-to-jaina.js --dry-run` to exit 0');

  const lines = parseLines(stdout);
  assert.strictEqual(lines.length, 5, `expected exactly 5 JSON lines, got ${lines.length}`);

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  const expected = listExpectedRaces();
  assert.deepStrictEqual(
    records.map((r) => r.name),
    expected.map((r) => r.name)
  );
});

// ---------------------------------------------------------------------------
// AC2: every printed record has exactly the 8 required fields; slug matches
// slugify(name) using the identical algorithm as lib/parse-card-markdown.js.
// ---------------------------------------------------------------------------

test('AC2: each record carries exactly the 8 required fields, and slug matches slugify(name)', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.strictEqual(records.length, 5);
  for (const record of records) {
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      [
        'complementaryStrengths',
        'counteringWeaknesses',
        'identity',
        'name',
        'primaryStrength',
        'signatureHooks',
        'slug',
        'visualIdentity',
      ],
      `expected record for "${record.name}" to carry exactly the 8 required fields`
    );
    assert.strictEqual(
      record.slug,
      slugify(record.name),
      `expected slug "${record.slug}" for "${record.name}" to match slugify(name)`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3 (held out): complementaryStrengths / counteringWeaknesses are each
// exactly 2 strings, and signatureHooks is exactly 5 {name, description}
// objects, all matching each race file's own bullets verbatim.
// ---------------------------------------------------------------------------

test('AC3: complementaryStrengths/counteringWeaknesses have exactly 2 entries and signatureHooks exactly 5, verbatim vs source', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));
  const expected = listExpectedRaces();

  assert.strictEqual(records.length, expected.length);
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const exp = expected[i];

    assert.strictEqual(record.complementaryStrengths.length, 2, `expected 2 complementary strengths for "${record.name}"`);
    assert.strictEqual(record.counteringWeaknesses.length, 2, `expected 2 countering weaknesses for "${record.name}"`);
    assert.strictEqual(record.signatureHooks.length, 5, `expected 5 signature hooks for "${record.name}"`);

    assert.deepStrictEqual(record.complementaryStrengths, exp.complementaryStrengths, `complementaryStrengths mismatch for "${record.name}"`);
    assert.deepStrictEqual(record.counteringWeaknesses, exp.counteringWeaknesses, `counteringWeaknesses mismatch for "${record.name}"`);
    assert.deepStrictEqual(record.signatureHooks, exp.signatureHooks, `signatureHooks mismatch for "${record.name}"`);
    assert.strictEqual(record.identity, exp.identity, `identity mismatch for "${record.name}"`);
    assert.strictEqual(record.primaryStrength, exp.primaryStrength, `primaryStrength mismatch for "${record.name}"`);
    assert.strictEqual(record.visualIdentity, exp.visualIdentity, `visualIdentity mismatch for "${record.name}"`);
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

  assert.ok(error, 'expected `node tools/sync-races-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(/not yet implemented/i.test(output), `expected a "not yet implemented" message, got: ${output}`);
  assert.ok(/races/i.test(output), `expected the message to mention races, got: ${output}`);
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

test('AC5: --dry-run output order is cindral-reach, mireth-bloom, panoptic-concord, starweave-communion, wrought-assembly', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.deepStrictEqual(
    records.map((r) => r.name),
    [
      'The Cindral Reach',
      'The Mireth Bloom',
      'The Panoptic Concord',
      'The Starweave Communion',
      'The Wrought Assembly',
    ]
  );
});
