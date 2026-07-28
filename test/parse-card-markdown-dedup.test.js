'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const RENDER_CARD_PATH = path.join(REPO_ROOT, 'tools', 'render-card.js');
const BUILD_SITE_PATH = path.join(REPO_ROOT, 'tools', 'build-site.js');
const LIB_RELATIVE_FROM_TOOLS = '../lib/parse-card-markdown';

const FIELD_PREFIX_LITERALS = ["'Cost line:'", "'Type line:'", "'Rules text:'", "'Stats/counters line:'"];

// ---------------------------------------------------------------------------
// AC2: tools/render-card.js and tools/build-site.js both import
// parseCardMarkdown and slugify from lib/parse-card-markdown.js; grepping
// either file for the literal field-prefix strings finds no matches outside
// lib/parse-card-markdown.js.
// ---------------------------------------------------------------------------

test('AC2: tools/render-card.js contains no literal field-prefix strings of its own', () => {
  const source = fs.readFileSync(RENDER_CARD_PATH, 'utf8');
  for (const literal of FIELD_PREFIX_LITERALS) {
    assert.ok(
      !source.includes(literal),
      `expected tools/render-card.js to no longer contain the literal ${literal} (should live only in lib/parse-card-markdown.js)`
    );
  }
});

test('AC2: tools/build-site.js contains no literal field-prefix strings of its own', () => {
  const source = fs.readFileSync(BUILD_SITE_PATH, 'utf8');
  for (const literal of FIELD_PREFIX_LITERALS) {
    assert.ok(
      !source.includes(literal),
      `expected tools/build-site.js to contain no literal ${literal}`
    );
  }
});

test('AC2: tools/render-card.js imports parseCardMarkdown and slugify from lib/parse-card-markdown', () => {
  const source = fs.readFileSync(RENDER_CARD_PATH, 'utf8');

  assert.ok(
    source.includes(LIB_RELATIVE_FROM_TOOLS),
    `expected tools/render-card.js to require('${LIB_RELATIVE_FROM_TOOLS}')`
  );

  const requireLine = source
    .split('\n')
    .find((line) => line.includes(LIB_RELATIVE_FROM_TOOLS));
  assert.ok(requireLine, 'expected to find the require line importing the shared parser');
  assert.ok(/\bparseCardMarkdown\b/.test(requireLine), 'expected parseCardMarkdown to be destructured from the shared import');
  assert.ok(/\bslugify\b/.test(requireLine), 'expected slugify to be destructured from the shared import');

  assert.strictEqual(
    (source.match(/function\s+slugify\s*\(/g) || []).length,
    0,
    'expected no local function slugify(...) definition left in tools/render-card.js'
  );
  assert.strictEqual(
    (source.match(/function\s+parseCardBody\s*\(/g) || []).length,
    0,
    'expected no local function parseCardBody(...) definition left in tools/render-card.js'
  );
});
