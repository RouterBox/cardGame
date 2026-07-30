'use strict';

// Verifies the two design/DESIGN-READINESS.md edits this unit makes: a new
// Section 5 bullet for tools/sync-world-narrative-to-jaina.js, and a
// rewritten final sentence in Section 6's Gap 3 stating the narrative-sync
// gap is now closed. Mirrors test/design-readiness-gap3-jaina-sync-fix.test.js's
// approach (read the file directly, isolate the two relevant section bodies
// with test/helpers/markdown.js).

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText } = require('./helpers/markdown');

const DOC_PATH = path.join(__dirname, '..', 'design', 'DESIGN-READINESS.md');

const content = (fs.existsSync(DOC_PATH) ? fs.readFileSync(DOC_PATH, 'utf8') : '').replace(/\r\n/g, '\n');
const sections = parseSections(content);
const toolingBody = sectionText(sections, /authoring, render, site.*sync tooling/i) || '';
const gapsBody = sectionText(sections, /open gaps|unresolved questions/i) || '';

// ---------------------------------------------------------------------------
// AC5: Section 5 gains exactly one new bullet citing
// tools/sync-world-narrative-to-jaina.js, alongside the existing
// sync-founts-to-jaina.js bullet.
// ---------------------------------------------------------------------------

test('AC5: Section 5 still lists tools/sync-founts-to-jaina.js', () => {
  assert.ok(toolingBody, 'expected a "Authoring, Render, Site & Sync Tooling" section in design/DESIGN-READINESS.md');
  assert.ok(
    toolingBody.includes('tools/sync-founts-to-jaina.js'),
    'expected Section 5 to still cite tools/sync-founts-to-jaina.js'
  );
});

test('AC5: Section 5 adds a bullet for tools/sync-world-narrative-to-jaina.js', () => {
  assert.ok(toolingBody, 'expected a "Authoring, Render, Site & Sync Tooling" section in design/DESIGN-READINESS.md');
  assert.ok(
    toolingBody.includes('tools/sync-world-narrative-to-jaina.js'),
    'expected Section 5 to cite tools/sync-world-narrative-to-jaina.js'
  );
});

// ---------------------------------------------------------------------------
// AC5: Gap 3's final sentence now states the narrative-sync gap is closed,
// citing the new tool, and no longer contains "What's left:".
// ---------------------------------------------------------------------------

test('AC5: Open Gaps item 3 cites tools/sync-world-narrative-to-jaina.js and no longer says "What\'s left:"', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  assert.ok(
    gapsBody.includes('tools/sync-world-narrative-to-jaina.js'),
    'expected Gap 3 to cite tools/sync-world-narrative-to-jaina.js'
  );
  assert.ok(
    !gapsBody.includes("What's left:"),
    'expected Gap 3 to no longer contain the literal "What\'s left:" phrase'
  );
});

test('AC5: Open Gaps item 3 still cites the lead-in sentence and tools/sync-cards-to-jaina.js verbatim', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  assert.ok(
    gapsBody.includes('Jaina is wired up for card records only'),
    'expected the Jaina gap entry\'s bolded lead-in sentence to still be present verbatim'
  );
  assert.ok(
    gapsBody.includes('tools/sync-cards-to-jaina.js'),
    'expected the Jaina gap entry to still cite tools/sync-cards-to-jaina.js verbatim'
  );
});

// ---------------------------------------------------------------------------
// AC5: the Open Gaps list still runs 1, 2, 3 with no skips/reflow.
// ---------------------------------------------------------------------------

test('AC5: Open Gaps section still closes with a sequential numbered list of at least 3 items', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  const items = gapsBody.match(/^\d+\.\s+\S.*/gm) || [];
  assert.ok(items.length >= 3, `expected at least 3 numbered open-gap items, found ${items.length}`);

  const numbers = items.map((line) => parseInt(line.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(
      numbers[i],
      i + 1,
      `expected numbered open-gap items to run sequentially from 1 with no skips/repeats, got [${numbers.join(', ')}]`
    );
  }
});
