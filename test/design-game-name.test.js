'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const RULES_PATH = path.join(REPO_ROOT, 'design', 'rules.md');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const INDEX_PATH = path.join(REPO_ROOT, 'site', 'index.html');

test('AC3: "Wreck Tangle" appears in design/rules.md', () => {
  const rulesText = fs.readFileSync(RULES_PATH, 'utf8');
  assert.ok(
    rulesText.includes('Wreck Tangle'),
    'expected design/rules.md to name the game "Wreck Tangle"'
  );
});

test('AC3: "Wreck Tangle" appears in site/index.html', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
  const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');
  assert.ok(
    indexHtml.includes('Wreck Tangle'),
    'expected site/index.html to name the game "Wreck Tangle"'
  );
});
