'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { normalizeProse } = require('./helpers/markdown');

// ---------------------------------------------------------------------------
// normalizeProse(text): collapses all whitespace runs (including newlines
// introduced by the rulebook's ~75-char line wrap) to a single space and
// trims the ends, so prose regex assertions can match a phrase regardless of
// where the source markdown happens to wrap a line.
// ---------------------------------------------------------------------------

test('normalizeProse: collapses a line-wrapped phrase onto one line', () => {
  const wrapped = 'a blocked attacker deals its combat strength as damage\nto its blocker(s) instead of Core Integrity';
  const normalized = normalizeProse(wrapped);
  assert.ok(
    /combat strength as damage to its blocker/i.test(normalized),
    `expected the wrapped phrase to read as one line, got: ${JSON.stringify(normalized)}`
  );
});

test('normalizeProse: collapses runs of blank lines, tabs, and repeated spaces, and trims the ends', () => {
  const messy = '\n\n  Some   text\twith\r\nirregular    whitespace.  \n\n';
  assert.strictEqual(normalizeProse(messy), 'Some text with irregular whitespace.');
});
