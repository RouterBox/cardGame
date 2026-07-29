'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'composite-card-art.js');
const ALT_BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'alt-art-briefs.md');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function listAltBriefTitles() {
  if (!fs.existsSync(ALT_BRIEFS_PATH)) return [];
  const content = fs.readFileSync(ALT_BRIEFS_PATH, 'utf8');
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => s.title);
}

let runError = null;

// node's test runner gives each *.test.js file its own process, so this
// file re-runs the composite CLI itself rather than assuming
// composite-card-art.test.js's own test.before() already ran in this
// process (or ran first). It deliberately does NOT spawn
// tools/render-card.js: nothing in this file reads renders/cards/ (the
// compositor calls renderCardSvg() in-process), and a second concurrent
// render-card.js run would race the pre-existing test file's own run
// against the shared renders/cards/ directory.
test.before(() => {
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    runError = err;
  }
});

const ALT_TITLES = listAltBriefTitles();

// ---------------------------------------------------------------------------
// AC3: writes renders/cards-composited/<slug>.svg for all previously-briefed
// cards plus exactly one <slug>-alt.svg per alt brief named in
// alt-art-briefs.md, and no other card gets a "-alt.svg" file.
// ---------------------------------------------------------------------------

test('AC3: design/cards/alt-art-briefs.md names exactly 5 alt briefs (sanity check on fixture)', () => {
  assert.strictEqual(ALT_TITLES.length, 5, `expected exactly 5 alt briefs, found ${ALT_TITLES.length}`);
});

test('AC3: node tools/composite-card-art.js writes exactly one <slug>-alt.svg per alt brief', () => {
  assert.ok(
    !runError,
    `expected node tools/composite-card-art.js to exit 0, got: ${runError && (runError.message + '\n' + (runError.stdout || '') + (runError.stderr || ''))}`
  );

  assert.ok(fs.existsSync(OUT_DIR), `expected ${OUT_DIR} to exist after running the script`);

  const altFiles = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('-alt.svg'));
  assert.strictEqual(
    altFiles.length,
    ALT_TITLES.length,
    `expected exactly ${ALT_TITLES.length} "-alt.svg" files, found ${altFiles.length}: [${altFiles.join(', ')}]`
  );

  const expected = new Set(ALT_TITLES.map((t) => `${slugify(t)}-alt.svg`));
  for (const file of altFiles) {
    assert.ok(expected.has(file), `unexpected "-alt.svg" file for a card not named in alt-art-briefs.md: ${file}`);
  }
  for (const title of ALT_TITLES) {
    const file = path.join(OUT_DIR, `${slugify(title)}-alt.svg`);
    assert.ok(fs.existsSync(file), `expected ${file} to exist`);
  }
});

test('AC3: the base <slug>.svg for each alt-art card still exists alongside its "-alt.svg"', () => {
  assert.ok(!runError, 'compositing script must succeed before its output can be checked');
  for (const title of ALT_TITLES) {
    const baseFile = path.join(OUT_DIR, `${slugify(title)}.svg`);
    assert.ok(fs.existsSync(baseFile), `expected the base ${baseFile} to still exist alongside its "-alt.svg"`);
  }
});

test('AC3: no card outside alt-art-briefs.md gets a "-alt.svg" file', () => {
  assert.ok(!runError, 'compositing script must succeed before its output can be checked');
  const expectedAltSlugs = new Set(ALT_TITLES.map((t) => slugify(t)));
  const altFiles = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('-alt.svg'));
  for (const file of altFiles) {
    const slug = file.slice(0, -'-alt.svg'.length);
    assert.ok(
      expectedAltSlugs.has(slug),
      `found "-alt.svg" file "${file}" for a card not named in alt-art-briefs.md`
    );
  }
});

// ---------------------------------------------------------------------------
// Intent: an alt brief naming a card with no base brief throws the same
// clear error loadBriefs() already throws for an unmatched card name,
// rather than silently skipping it.
// ---------------------------------------------------------------------------

test('composite-card-art.js source throws a clear error for an alt brief with no base brief', () => {
  const source = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(
    /has no base brief/i.test(source),
    'expected composite-card-art.js to throw a clear error when an alt brief names a card with no base brief'
  );
});
