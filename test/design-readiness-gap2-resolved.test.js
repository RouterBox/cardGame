'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText } = require('./helpers/markdown');

const DOC_PATH = path.join(__dirname, '..', 'design', 'DESIGN-READINESS.md');

const content = fs.existsSync(DOC_PATH) ? fs.readFileSync(DOC_PATH, 'utf8') : '';
const sections = parseSections(content);
const gapsBody = sectionText(sections, /open gaps|unresolved questions/i) || '';

// ---------------------------------------------------------------------------
// AC1: the stale "no card in this wave" claim about the Mireth Bloom / the
// Wrought Assembly must be gone from the Open Gaps section — it was
// falsified by the already-shipped wave-2 unit.
// ---------------------------------------------------------------------------

test('AC1: Open Gaps section no longer claims the Mireth Bloom or the Wrought Assembly have no card in this wave', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  assert.ok(
    !/no card in this wave/i.test(gapsBody),
    'expected the Open Gaps section to no longer contain the stale "no card in this wave" claim'
  );
  assert.ok(
    !/only speaks for 3 of 5 races/i.test(gapsBody),
    'expected the Open Gaps section to no longer claim the Spatial Race Identity Set "only speaks for 3 of 5 races"'
  );
});

// ---------------------------------------------------------------------------
// AC2: the same section must now say the gap is resolved and cite
// spatial-race-identity-set-wave-2.md (verbatim filename) as the file that
// resolved it.
// ---------------------------------------------------------------------------

test('AC2: Open Gaps section states this gap is resolved and cites spatial-race-identity-set-wave-2.md', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  assert.ok(
    /resolved/i.test(gapsBody),
    'expected the Open Gaps section to state that the Spatial Race Identity gap was resolved'
  );
  assert.ok(
    gapsBody.includes('spatial-race-identity-set-wave-2.md'),
    'expected the Open Gaps section to cite "spatial-race-identity-set-wave-2.md" verbatim as the resolving file'
  );
});

// ---------------------------------------------------------------------------
// AC3: the Open Gaps section still parses as a clean sequential numbered
// list (1., 2., 3., ... no skipped or repeated numbers) with at least 3
// items, so test/design-readiness.test.js's existing AC5 keeps passing.
// ---------------------------------------------------------------------------

test('AC3: Open Gaps section is a sequential numbered list with no skipped or repeated numbers', () => {
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

// ---------------------------------------------------------------------------
// AC5: the other three Open Gap entries (art-brief coverage hole, no
// digital implementation, Jaina card-only) each still appear with their
// original substantive text intact, only renumbered.
// ---------------------------------------------------------------------------

test('AC5: the other three Open Gap entries keep their original substantive text', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');

  assert.ok(
    gapsBody.includes('Art-brief coverage has an 8-card hole'),
    'expected the art-brief coverage gap entry to still be present verbatim'
  );
  assert.ok(
    gapsBody.includes('no art brief for "<name>"'),
    'expected the art-brief coverage gap entry to still cite the composite-card-art.js warning text'
  );

  assert.ok(
    gapsBody.includes('No digital implementation of the design has ever been built or run'),
    'expected the no-digital-implementation gap entry to still be present verbatim'
  );
  assert.ok(
    gapsBody.includes('design/playtest-spatial.md') && gapsBody.includes('design/playtest-full-game.md'),
    'expected the no-digital-implementation gap entry to still cite both playtest files'
  );

  assert.ok(
    gapsBody.includes('Jaina is wired up for card records only'),
    'expected the Jaina card-only gap entry to still be present verbatim'
  );
  assert.ok(
    gapsBody.includes('tools/sync-cards-to-jaina.js'),
    'expected the Jaina card-only gap entry to still cite tools/sync-cards-to-jaina.js'
  );
});
