'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const SITE_DIR = path.join(REPO_ROOT, 'site');

function runBuild() {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
}

function readIndexHtml() {
  return fs.readFileSync(path.join(SITE_DIR, 'index.html'), 'utf8');
}

// Extracts the full source text of `function <fnName>(...) { ... }` from
// `html` using brace counting (not a lazy regex), so a function body that
// itself contains nested `{`/`}` is captured whole rather than truncated at
// the first closing brace.
function extractFunctionSource(html, fnName) {
  const startMatch = html.match(new RegExp(`function\\s+${fnName}\\s*\\([^)]*\\)\\s*\\{`));
  if (!startMatch) return null;
  const openBraceIndex = startMatch.index + startMatch[0].length - 1;
  let depth = 0;
  for (let i = openBraceIndex; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) return html.slice(startMatch.index, i + 1);
    }
  }
  return null;
}

test('AC1: index.html has an <input type="search" id="site-search"> positioned before the first <section>', () => {
  runBuild();
  const html = readIndexHtml();

  const inputMatch = html.match(/<input\b[^>]*>/);
  assert.ok(inputMatch, 'expected an <input> element in index.html');
  assert.ok(/type="search"/.test(inputMatch[0]), 'expected the input to have type="search"');
  assert.ok(/id="site-search"/.test(inputMatch[0]), 'expected the input to have id="site-search"');

  const sectionIndex = html.indexOf('<section>');
  assert.ok(sectionIndex !== -1, 'expected at least one <section> in index.html');
  assert.ok(inputMatch.index < sectionIndex, 'expected the #site-search input to appear before the first <section>');
});

test('AC2: index.html contains an inline <script> defining a standalone title/query matching function', () => {
  runBuild();
  const html = readIndexHtml();

  const scriptMatch = html.match(/<script>[\s\S]*?<\/script>/);
  assert.ok(scriptMatch, 'expected an inline <script>...</script> block in index.html');

  const fnSource = extractFunctionSource(scriptMatch[0], 'siteSearchMatches');
  assert.ok(
    fnSource,
    'expected a standalone matching function (e.g. function siteSearchMatches(title, query)) inside the inline <script>'
  );
});

test('AC3: the extracted matching function does case-insensitive substring matching against real design-shelf titles', () => {
  runBuild();
  const html = readIndexHtml();

  const scriptMatch = html.match(/<script>[\s\S]*?<\/script>/);
  assert.ok(scriptMatch, 'expected an inline <script>...</script> block in index.html');

  const fnSource = extractFunctionSource(scriptMatch[0], 'siteSearchMatches');
  assert.ok(fnSource, 'expected a standalone matching function inside the inline <script>');

  // eslint-disable-next-line no-eval
  const siteSearchMatches = eval(`(${fnSource})`);
  assert.strictEqual(typeof siteSearchMatches, 'function', 'expected the extracted source to evaluate to a callable function');

  // Real page titles currently on the design shelf (design/cards/alpha-set.md
  // and design/cards/wormhole-closure-cards.md), so this test breaks loudly
  // if those source titles ever change out from under it.
  const alphaSetTitle = 'Alpha Set — First Cards of the Amaranth Expanse';
  const wormholeTitle = 'Wormhole Closure Cards — Sealing the Battlefield Graph';

  assert.strictEqual(siteSearchMatches(alphaSetTitle, 'alpha'), true, 'expected a lowercase substring of the Alpha Set title to match');
  assert.strictEqual(siteSearchMatches(alphaSetTitle, 'ALPHA SET'), true, 'expected an uppercase query to match case-insensitively');
  assert.strictEqual(
    siteSearchMatches(wormholeTitle, 'wormhole closure'),
    true,
    'expected a lowercase substring of the Wormhole Closure Cards title to match'
  );
  assert.strictEqual(siteSearchMatches(wormholeTitle, 'WORMHOLE'), true, 'expected an uppercase query to match case-insensitively');

  assert.strictEqual(siteSearchMatches(alphaSetTitle, ''), true, 'expected an empty query to match every title');
  assert.strictEqual(siteSearchMatches(alphaSetTitle, '   '), true, 'expected a whitespace-only query to match every title');

  assert.strictEqual(
    siteSearchMatches(alphaSetTitle, 'xyzzy-not-present'),
    false,
    "expected a query matching none of the Alpha Set title's words to not match"
  );
  assert.strictEqual(
    siteSearchMatches(wormholeTitle, 'xyzzy-not-present'),
    false,
    "expected a query matching none of the Wormhole Closure Cards title's words to not match"
  );
});
