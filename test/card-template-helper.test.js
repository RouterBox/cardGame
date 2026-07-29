'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const HELPER_PATH = path.join(REPO_ROOT, 'test', 'helpers', 'card-template.js');

const CONSUMER_FILES = [
  path.join(REPO_ROOT, 'test', 'design-cards.test.js'),
  path.join(REPO_ROOT, 'test', 'design-frontier-cards.test.js'),
  path.join(REPO_ROOT, 'test', 'design-signature-cards.test.js'),
];

const DUPLICATED_LITERALS = ["'Cost line:'", "'Type line:'", "'Rules text:'", "'Stats/counters line:'"];

// Runs registerCardTemplateChecks(title, body) in a throwaway child process
// via `node --test`, so we can observe whether the two checks it registers
// pass or fail for a given card body without polluting this file's own run.
function runFixture(body) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'card-template-fixture-'));
  const fixturePath = path.join(tmpDir, 'fixture.test.js');
  const fixtureSrc = [
    "'use strict';",
    `const { registerCardTemplateChecks } = require(${JSON.stringify(HELPER_PATH)});`,
    `registerCardTemplateChecks('Fixture Card', ${JSON.stringify(body)});`,
    '',
  ].join('\n');
  fs.writeFileSync(fixturePath, fixtureSrc);
  try {
    return spawnSync(process.execPath, ['--test', fixturePath], { encoding: 'utf8' });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// Fails loudly if the fixture process couldn't even load the helper module,
// so a "expected failure" assertion below can't be satisfied merely because
// test/helpers/card-template.js doesn't exist yet.
function assertHelperLoaded(result) {
  assert.ok(
    !/Cannot find module/.test(result.stderr || ''),
    `expected test/helpers/card-template.js to load successfully in the fixture, got:\n${result.stderr}`
  );
}

// ---------------------------------------------------------------------------
// AC1: test/helpers/card-template.js exists and exports a function that,
// given a card's title and body text, registers the same two checks
// currently duplicated in design-cards.test.js, design-frontier-cards.test.js,
// and design-signature-cards.test.js: Cost line -> Type line -> Rules text
// ordering, and Stats/counters line only present, and only after Rules text,
// when the Type line contains "Permanent".
// ---------------------------------------------------------------------------

test('AC1: test/helpers/card-template.js exists and exports registerCardTemplateChecks', () => {
  assert.ok(fs.existsSync(HELPER_PATH), `expected ${HELPER_PATH} to exist`);
  const mod = require(HELPER_PATH);
  assert.strictEqual(
    typeof mod.registerCardTemplateChecks,
    'function',
    'expected an exported registerCardTemplateChecks function'
  );
});

test('AC1: registerCardTemplateChecks passes a card with Cost -> Type -> Rules text in order and no Stats line', () => {
  const body = ['Cost line: 2 Circuit', 'Type line: Technology', 'Rules text: Draw a card.'].join('\n');
  const result = runFixture(body);
  assertHelperLoaded(result);
  assert.strictEqual(result.status, 0, `expected the fixture run to pass, got:\n${result.stdout}\n${result.stderr}`);
});

test('AC1: registerCardTemplateChecks fails a card whose Type line comes before its Cost line', () => {
  const body = ['Type line: Technology', 'Cost line: 2 Circuit', 'Rules text: Draw a card.'].join('\n');
  const result = runFixture(body);
  assertHelperLoaded(result);
  assert.notStrictEqual(result.status, 0, 'expected the fixture run to fail on out-of-order Cost/Type lines');
});

test('AC1: registerCardTemplateChecks passes a Permanent card with a Stats/counters line after Rules text', () => {
  const body = [
    'Cost line: 3 Mass',
    'Type line: Materials Permanent',
    'Rules text: Enters with two counters.',
    'Stats/counters line: 2/2',
  ].join('\n');
  const result = runFixture(body);
  assertHelperLoaded(result);
  assert.strictEqual(result.status, 0, `expected the fixture run to pass, got:\n${result.stdout}\n${result.stderr}`);
});

test('AC1: registerCardTemplateChecks fails a non-Permanent card that carries a Stats/counters line', () => {
  const body = [
    'Cost line: 3 Mass',
    'Type line: Materials',
    'Rules text: Deal 2 damage.',
    'Stats/counters line: 2/2',
  ].join('\n');
  const result = runFixture(body);
  assertHelperLoaded(result);
  assert.notStrictEqual(
    result.status,
    0,
    'expected the fixture run to fail: a non-Permanent must not carry a Stats/counters line'
  );
});

test('AC1: registerCardTemplateChecks fails a Permanent card whose Stats/counters line appears before Rules text', () => {
  const body = [
    'Cost line: 3 Mass',
    'Type line: Materials Permanent',
    'Stats/counters line: 2/2',
    'Rules text: Enters with two counters.',
  ].join('\n');
  const result = runFixture(body);
  assertHelperLoaded(result);
  assert.notStrictEqual(
    result.status,
    0,
    'expected the fixture run to fail: Stats/counters line must follow Rules text'
  );
});

// ---------------------------------------------------------------------------
// AC2: design-cards.test.js, design-frontier-cards.test.js, and
// design-signature-cards.test.js no longer contain their own inline
// implementation of the Cost/Type/Rules-text-order and
// Stats-line-only-if-Permanent checks — each calls the shared helper from
// test/helpers/card-template.js instead.
// ---------------------------------------------------------------------------

for (const filePath of CONSUMER_FILES) {
  const relative = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/');

  test(`AC2: ${relative} contains no inline Cost/Type/Rules-text field-prefix literals of its own`, () => {
    const source = fs.readFileSync(filePath, 'utf8');
    for (const literal of DUPLICATED_LITERALS) {
      assert.ok(
        !source.includes(literal),
        `expected ${relative} to no longer contain the literal ${literal} (should live only in test/helpers/card-template.js)`
      );
    }
  });

  test(`AC2: ${relative} calls registerCardTemplateChecks from test/helpers/card-template`, () => {
    const source = fs.readFileSync(filePath, 'utf8');
    assert.ok(
      source.includes('./helpers/card-template'),
      `expected ${relative} to require('./helpers/card-template')`
    );
    assert.ok(
      /\bregisterCardTemplateChecks\s*\(/.test(source),
      `expected ${relative} to call registerCardTemplateChecks(...)`
    );
  });
}

// ---------------------------------------------------------------------------
// AC4: this unit only touches files under test/ — no design/ file is
// modified.
// ---------------------------------------------------------------------------

test('AC4: no file under design/ is modified (git status against design/ is empty)', () => {
  const result = spawnSync('git', ['status', '--porcelain', '--', 'design'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  assert.strictEqual(result.status, 0, `expected git status to succeed, got:\n${result.stderr}`);
  assert.strictEqual(
    result.stdout.trim(),
    '',
    `expected no modifications under design/, got:\n${result.stdout}`
  );
});
