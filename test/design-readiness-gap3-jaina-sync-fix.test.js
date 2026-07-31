'use strict';

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
// AC1: Section 5's tooling list contains one new bullet each for
// tools/sync-characters-to-jaina.js, tools/sync-races-to-jaina.js,
// tools/sync-star-atlas-to-jaina.js, and tools/sync-lore-eras-to-jaina.js,
// alongside the existing sync-cards-to-jaina.js bullet.
// ---------------------------------------------------------------------------

test('AC1: Section 5 still lists tools/sync-cards-to-jaina.js', () => {
  assert.ok(toolingBody, 'expected a "Authoring, Render, Site & Sync Tooling" section in design/DESIGN-READINESS.md');
  assert.ok(
    toolingBody.includes('tools/sync-cards-to-jaina.js'),
    'expected Section 5 to still cite tools/sync-cards-to-jaina.js'
  );
});

test('AC1: Section 5 adds a bullet for tools/sync-characters-to-jaina.js', () => {
  assert.ok(toolingBody, 'expected a "Authoring, Render, Site & Sync Tooling" section in design/DESIGN-READINESS.md');
  assert.ok(
    toolingBody.includes('tools/sync-characters-to-jaina.js'),
    'expected Section 5 to cite tools/sync-characters-to-jaina.js'
  );
  assert.ok(
    toolingBody.includes('design/characters/'),
    'expected the new sync-characters-to-jaina.js bullet to cite design/characters/'
  );
});

test('AC1: Section 5 adds a bullet for tools/sync-races-to-jaina.js', () => {
  assert.ok(toolingBody, 'expected a "Authoring, Render, Site & Sync Tooling" section in design/DESIGN-READINESS.md');
  assert.ok(
    toolingBody.includes('tools/sync-races-to-jaina.js'),
    'expected Section 5 to cite tools/sync-races-to-jaina.js'
  );
  assert.ok(
    toolingBody.includes('design/races/'),
    'expected the new sync-races-to-jaina.js bullet to cite design/races/'
  );
});

test('AC1: Section 5 adds a bullet for tools/sync-star-atlas-to-jaina.js', () => {
  assert.ok(toolingBody, 'expected a "Authoring, Render, Site & Sync Tooling" section in design/DESIGN-READINESS.md');
  assert.ok(
    toolingBody.includes('tools/sync-star-atlas-to-jaina.js'),
    'expected Section 5 to cite tools/sync-star-atlas-to-jaina.js'
  );
  assert.ok(
    toolingBody.includes('design/star-atlas.md'),
    'expected the new sync-star-atlas-to-jaina.js bullet to cite design/star-atlas.md'
  );
});

test('AC1: Section 5 adds a bullet for tools/sync-lore-eras-to-jaina.js', () => {
  assert.ok(toolingBody, 'expected a "Authoring, Render, Site & Sync Tooling" section in design/DESIGN-READINESS.md');
  assert.ok(
    toolingBody.includes('tools/sync-lore-eras-to-jaina.js'),
    'expected Section 5 to cite tools/sync-lore-eras-to-jaina.js'
  );
  assert.ok(
    toolingBody.includes('design/lore.md'),
    'expected the new sync-lore-eras-to-jaina.js bullet to cite design/lore.md'
  );
});

// ---------------------------------------------------------------------------
// AC2: Section 6 item 3 no longer contains the sentence claiming characters,
// races, world/lore, or the star atlas "remain markdown-only prose with no
// Jaina schema or sync path yet".
// ---------------------------------------------------------------------------

test('AC2: Open Gaps item 3 no longer claims characters/races/world-lore/star-atlas remain markdown-only prose', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  assert.ok(
    !/remain markdown-only prose with no jaina schema or sync path yet/i.test(gapsBody),
    'expected the Open Gaps section to no longer contain the stale "remain markdown-only prose with no Jaina schema or sync path yet" claim'
  );
  assert.ok(
    gapsBody.includes('Jaina is wired up for card records only'),
    'expected the Jaina gap entry\'s bolded lead-in sentence to still be present verbatim'
  );
});

// ---------------------------------------------------------------------------
// AC4: Section 4's art-brief coverage bullets and Section 6 item 1's
// wormhole/art-brief text are present byte-for-byte unchanged. Each check
// below is a single contiguous substring copied verbatim (including its
// exact line wraps) from the file as it stood before this unit, so any
// reflow or edit to these ranges breaks the match.
// ---------------------------------------------------------------------------

// The art-briefs.md bullet that used to sit between these two chunks is
// deliberately NOT snapshotted: its count and covering list legitimately
// change with every new brief set (54->59 broke this three times in one
// day) and are already asserted live-count-style by
// design-readiness-section4-art-briefs-coverage.test.js. The two chunks
// around it are checked as separate contiguous substrings.
const SECTION4_ANATOMY_VERBATIM = [
  '- **`design/cards/card-anatomy.md`** — the shared card skeleton (Frame/',
  '  Border, Name Slot, Cost Slot, Art Window, Type Line, Rules-Text Box, Stats',
  '  Corner, Set/Collector Strip), the mapping from every `rules.md` Section',
  '  9.1 template field to exactly one zone, and the premium-treatment layers',
  '  (borderless, foil, extended art) that dress the same skeleton without',
  '  changing what a card says or does.',
].join('\n');

const SECTION4_ALTART_GAP_VERBATIM = [
  '- **`design/cards/alt-art-briefs.md`** — 5 alternate-art briefs for the',
  '  fount Generators (Sporeknit Warden, Salvage-Wrought Bastion, Replicant',
  '  Foundry Core, Foreknowledge Cipher, Unwritten Hour).',
  '- **Known gap — resolved:** the 3 cards in `spatial-race-identity-set.md`',
  '  and the 5 cards in `wormhole-closure-cards.md` (8 cards total) previously',
  '  had no brief in `art-briefs.md`; both sets are now fully covered, closed',
  '  by the merged units `cardgame-art-briefs-wormhole-closure` and',
  '  `cardgame-art-briefs-spatial-race-identity` (see Open Gap 1 in Section 6',
  '  below, which already reflects this).',
].join('\n');

const SECTION6_ITEM1_VERBATIM = [
  '1. **Resolved — art-brief coverage for the wormhole-closure and',
  '   spatial-race-identity sets is complete.** All 8 cards this gap used to',
  '   track now have a matching entry in `design/cards/art-briefs.md`: the 5',
  '   in `design/cards/wormhole-closure-cards.md`, closed by',
  '   `cardgame-art-briefs-wormhole-closure` (see',
  '   `workItems/2026-07-30-cardgame-art-briefs-wormhole-closure-*.md`), and',
  '   the 3 in `design/cards/spatial-race-identity-set.md` — Preemptive',
  '   Survey, Unbound Passage, Chokepoint Garrison — closed by',
  '   `cardgame-art-briefs-spatial-race-identity` (see',
  '   `workItems/2026-07-30-cardgame-art-briefs-spatial-race-identity-*.md`).',
  '   `tools/composite-card-art.js` no longer prints a',
  '   `no art brief for "<name>"` warning for any of them.',
].join('\n');

test('AC4: Section 4\'s art-brief coverage bullets are present byte-for-byte unchanged', () => {
  assert.ok(
    content.includes(SECTION4_ANATOMY_VERBATIM) && content.includes(SECTION4_ALTART_GAP_VERBATIM),
    'expected Section 4\'s art-brief coverage bullets to be untouched by this unit\'s edits'
  );
});

test('AC4: Section 6 item 1\'s wormhole/art-brief text is present byte-for-byte unchanged', () => {
  assert.ok(
    content.includes(SECTION6_ITEM1_VERBATIM),
    'expected Section 6 item 1\'s wormhole/art-brief resolution text to be untouched by this unit\'s edits'
  );
});

// ---------------------------------------------------------------------------
// AC5: the pre-existing test/design-readiness.test.js and
// test/design-readiness-gap2-resolved.test.js assertions must keep passing,
// unmodified, against the edited file. Those files are the authority on
// their own ACs; this test mirrors their load-bearing assertions on the
// exact ranges this unit's plan says it will touch, as a canary within this
// unit's own test file.
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

test('AC5: Open Gaps item 3 still cites tools/sync-cards-to-jaina.js verbatim', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  assert.ok(
    gapsBody.includes('tools/sync-cards-to-jaina.js'),
    'expected the Jaina gap entry to still cite tools/sync-cards-to-jaina.js, as relied on by test/design-readiness-gap1-resolved.test.js and test/design-readiness-gap2-resolved.test.js'
  );
});
