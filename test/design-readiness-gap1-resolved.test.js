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
// AC1: the Open Gaps section no longer claims the 5 wormhole-closure-cards
// cards lack a matching art-brief entry.
// ---------------------------------------------------------------------------

test('AC1: Open Gaps section no longer claims the wormhole-closure-cards cards lack an art-brief entry', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  assert.ok(
    !/cannot generate art for them/i.test(gapsBody),
    'expected the Open Gaps section to no longer claim composite-card-art.js "cannot generate art for them"'
  );
  assert.ok(
    !/None of the 3 cards in/i.test(gapsBody),
    'expected the Open Gaps section to no longer open with the stale "None of the 3 cards in..." claim'
  );
});

// ---------------------------------------------------------------------------
// AC2: the section now states design/cards/art-briefs.md covers the
// wormhole-closure-cards set, citing that file verbatim, in place of the old
// "8-card hole" headline.
// ---------------------------------------------------------------------------

test('AC2: Open Gaps section states art-briefs.md covers the wormhole-closure-cards set', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  assert.ok(
    !gapsBody.includes('Art-brief coverage has an 8-card hole'),
    'expected the old "Art-brief coverage has an 8-card hole" headline to be replaced with a resolved framing'
  );
  assert.ok(
    gapsBody.includes('design/cards/art-briefs.md'),
    'expected the Open Gaps section to cite "design/cards/art-briefs.md" verbatim'
  );
  assert.ok(
    gapsBody.includes('design/cards/wormhole-closure-cards.md'),
    'expected the Open Gaps section to cite "design/cards/wormhole-closure-cards.md" verbatim'
  );
  assert.ok(
    /resolved/i.test(gapsBody),
    'expected the Open Gaps section to state the art-brief coverage gap is resolved'
  );
});

// ---------------------------------------------------------------------------
// AC3 (paraphrase): the Open Gaps section still parses as a sequential
// numbered list (1., 2., 3., ... no skipped or repeated numbers) with at
// least 3 items — test/design-readiness.test.js's existing AC5 assertion
// must keep passing unmodified.
// ---------------------------------------------------------------------------

test('AC3: Open Gaps section is still a sequential numbered list with at least 3 items', () => {
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
// AC5 (paraphrase): the other Open Gap entries — the already-resolved
// Spatial Race Identity paragraph, "No digital implementation...", and
// "Jaina is wired up..." — keep their original substantive text intact.
// ---------------------------------------------------------------------------

test('AC5: the other Open Gap entries keep their original substantive text', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');

  assert.ok(
    gapsBody.includes('the Spatial Race Identity Set now speaks for all 5 races'),
    'expected the already-resolved Spatial Race Identity paragraph to still be present verbatim'
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
