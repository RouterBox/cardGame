'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');

const WORLD_MD = path.join(REPO_ROOT, 'design', 'world.md');
const LORE_MD = path.join(REPO_ROOT, 'design', 'lore.md');
const STAR_ATLAS_MD = path.join(REPO_ROOT, 'design', 'star-atlas.md');

const WORLD_HTML = path.join(REPO_ROOT, 'site', 'design', 'world.html');
const LORE_HTML = path.join(REPO_ROOT, 'site', 'design', 'lore.html');
const STAR_ATLAS_HTML = path.join(REPO_ROOT, 'site', 'design', 'star-atlas.html');

const RULES_MD = path.join(REPO_ROOT, 'design', 'rules.md');
const INDEX_HTML = path.join(REPO_ROOT, 'site', 'index.html');
const CARDS_DIR = path.join(REPO_ROOT, 'design', 'cards');

function listCardFiles() {
  return fs
    .readdirSync(CARDS_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => path.join(CARDS_DIR, name));
}

test('AC1: design/world.md names "Wreck Tangle" and keeps its H1', () => {
  const content = fs.readFileSync(WORLD_MD, 'utf8');
  assert.ok(content.includes('Wreck Tangle'), 'expected design/world.md to name the game "Wreck Tangle"');
  assert.ok(content.startsWith('# The Amaranth Expanse'), 'expected design/world.md H1 to be unchanged');
});

test('AC2: design/lore.md names "Wreck Tangle" and keeps its H1', () => {
  const content = fs.readFileSync(LORE_MD, 'utf8');
  assert.ok(content.includes('Wreck Tangle'), 'expected design/lore.md to name the game "Wreck Tangle"');
  assert.ok(
    content.startsWith('# The Long Record — A Chronicle of the Amaranth Expanse'),
    'expected design/lore.md H1 to be unchanged'
  );
});

test('AC3: design/star-atlas.md names "Wreck Tangle" and keeps its H1', () => {
  const content = fs.readFileSync(STAR_ATLAS_MD, 'utf8');
  assert.ok(content.includes('Wreck Tangle'), 'expected design/star-atlas.md to name the game "Wreck Tangle"');
  assert.ok(content.startsWith('# The Star Atlas'), 'expected design/star-atlas.md H1 to be unchanged');
});

test('AC4: design/rules.md, site/index.html, and design/cards/*.md are unchanged by this unit', () => {
  const beforeRules = fs.readFileSync(RULES_MD, 'utf8');
  const beforeIndex = fs.readFileSync(INDEX_HTML, 'utf8');
  const beforeCards = listCardFiles().map((p) => [p, fs.readFileSync(p, 'utf8')]);

  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });

  assert.strictEqual(fs.readFileSync(RULES_MD, 'utf8'), beforeRules, 'expected design/rules.md to be unchanged');
  assert.strictEqual(fs.readFileSync(INDEX_HTML, 'utf8'), beforeIndex, 'expected site/index.html to be unchanged');
  for (const [p, before] of beforeCards) {
    assert.strictEqual(
      fs.readFileSync(p, 'utf8'),
      before,
      `expected ${path.relative(REPO_ROOT, p)} to be unchanged`
    );
  }
});

test('AC5: site/design/{world,lore,star-atlas}.html are regenerated and name "Wreck Tangle"', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });

  for (const htmlPath of [WORLD_HTML, LORE_HTML, STAR_ATLAS_HTML]) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    assert.ok(html.includes('Wreck Tangle'), `expected ${path.relative(REPO_ROOT, htmlPath)} to name "Wreck Tangle"`);
  }
});
