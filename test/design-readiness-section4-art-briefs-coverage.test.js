'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText } = require('./helpers/markdown');
const { loadCardsFromFile } = require('../lib/parse-card-markdown');

const DOC_PATH = path.join(__dirname, '..', 'design', 'DESIGN-READINESS.md');
const CARDS_DIR = path.join(__dirname, '..', 'design', 'cards');

const content = fs.existsSync(DOC_PATH) ? fs.readFileSync(DOC_PATH, 'utf8') : '';
const sections = parseSections(content);
const anatomyBody = sectionText(sections, /card anatomy|art brief coverage/i) || '';

// ---------------------------------------------------------------------------
// AC1: Section 4's art-briefs.md coverage bullet lists both
// wormhole-closure-cards.md and spatial-race-identity-set.md alongside the
// existing 6 file names.
// ---------------------------------------------------------------------------

test('AC1: Section 4 coverage bullet lists wormhole-closure-cards.md and spatial-race-identity-set.md', () => {
  assert.ok(
    anatomyBody,
    'expected a "Card Anatomy & Art Brief Coverage" section in design/DESIGN-READINESS.md'
  );

  const coverageBullet = anatomyBody.match(/\*\*`design\/cards\/art-briefs\.md`\*\*[^\n]*(\n[^\n*-][^\n]*)*/);
  assert.ok(coverageBullet, 'expected an art-briefs.md coverage bullet in Section 4');
  const bulletText = coverageBullet[0];

  assert.ok(
    bulletText.includes('wormhole-closure-cards.md'),
    'expected the art-briefs.md coverage bullet to name wormhole-closure-cards.md'
  );
  assert.ok(
    bulletText.includes('spatial-race-identity-set.md'),
    'expected the art-briefs.md coverage bullet to name spatial-race-identity-set.md'
  );

  // Original 6 files must still be present alongside the two new ones.
  for (const file of [
    'alpha-set.md',
    'frontier-set.md',
    'character-signatures.md',
    'character-signatures-wave-2.md',
    'fount-economy-set.md',
    'wormhole-restrictions-set.md',
  ]) {
    assert.ok(bulletText.includes(file), `expected the coverage bullet to still name ${file}`);
  }
});

// ---------------------------------------------------------------------------
// AC2: that same bullet states the total art-brief section count as 52,
// not 44 — and 52 is verified live against art-briefs.md on disk so this
// can't drift from reality.
// ---------------------------------------------------------------------------

test('AC2: Section 4 coverage bullet states 52 art-brief sections, not 44', () => {
  assert.ok(
    anatomyBody,
    'expected a "Card Anatomy & Art Brief Coverage" section in design/DESIGN-READINESS.md'
  );

  const artBriefsPath = path.join(CARDS_DIR, 'art-briefs.md');
  const artBriefsContent = fs.readFileSync(artBriefsPath, 'utf8');
  const sectionCount = (artBriefsContent.match(/^###\s+/gm) || []).length;
  assert.strictEqual(sectionCount, 52, 'expected design/cards/art-briefs.md to currently have 52 "###" sections');

  assert.ok(
    !/\b44 art-brief sections\b/.test(anatomyBody),
    'expected Section 4 to no longer claim "44 art-brief sections"'
  );
  assert.ok(
    /\b52 art-brief sections\b/.test(anatomyBody),
    'expected Section 4 to state "52 art-brief sections"'
  );
});

// ---------------------------------------------------------------------------
// AC3: Section 4's "Known gap" bullet no longer claims the 3
// spatial-race-identity-set.md cards or the 5 wormhole-closure-cards.md
// cards lack a matching art-brief entry.
// ---------------------------------------------------------------------------

test('AC3: Section 4 "Known gap" bullet no longer claims the 8 cards lack an art brief', () => {
  assert.ok(
    anatomyBody,
    'expected a "Card Anatomy & Art Brief Coverage" section in design/DESIGN-READINESS.md'
  );

  assert.ok(
    !/have no brief in `art-briefs\.md` yet/i.test(anatomyBody),
    'expected Section 4 to no longer claim any cards "have no brief in art-briefs.md yet"'
  );
  assert.ok(
    !/the 3 cards in `spatial-race-identity-set\.md` and the 5\s*\n?\s*cards in `wormhole-closure-cards\.md`/i.test(
      anatomyBody
    ),
    'expected Section 4 to no longer state the 3-and-5-card art-brief hole claim'
  );
});

// ---------------------------------------------------------------------------
// AC5 (paraphrase): test/design-readiness.test.js's existing assertions
// still pass unmodified. That file isn't touched by this unit, but its
// AC3/AC6 check (every real card-set file is cited somewhere in the doc)
// exercises the same two filenames this fix affects, so re-running that
// exact logic here guards against a regression the other file wouldn't
// itself re-verify until the next full suite run.
// ---------------------------------------------------------------------------

test('AC5: every real card-set file under design/cards/ is still cited in the readiness doc', () => {
  const files = fs
    .readdirSync(CARDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();

  const cardSetFiles = files.filter(
    (file) => loadCardsFromFile(path.join(CARDS_DIR, file)).length > 0
  );

  assert.ok(cardSetFiles.length > 0, 'expected at least one real card-set file under design/cards/');

  for (const file of cardSetFiles) {
    assert.ok(
      content.includes(file),
      `expected design/DESIGN-READINESS.md to cite "${file}" (a real card set on disk) but it did not`
    );
  }
});
