'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText } = require('./helpers/markdown');
const { loadCardsFromFile } = require('../lib/parse-card-markdown');

const DOC_PATH = path.join(__dirname, '..', 'design', 'DESIGN-READINESS.md');
const CARDS_DIR = path.join(__dirname, '..', 'design', 'cards');
const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const LORE_PATH = path.join(__dirname, '..', 'design', 'lore.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');
const ART_BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');

const content = fs.existsSync(DOC_PATH) ? fs.readFileSync(DOC_PATH, 'utf8') : '';
const sections = parseSections(content);

// ---------------------------------------------------------------------------
// AC1: the document exists and is non-empty markdown.
// ---------------------------------------------------------------------------

test('AC1: design/DESIGN-READINESS.md exists and is non-empty', () => {
  assert.ok(fs.existsSync(DOC_PATH), `expected ${DOC_PATH} to exist`);
  assert.ok(content.trim().length > 0, 'expected design/DESIGN-READINESS.md to be non-empty');
});

// ---------------------------------------------------------------------------
// AC2: every numbered rulebook section is named by number and title.
// Derived live from design/rules.md itself, so this can't drift if rules.md
// gains or renames a section later.
// ---------------------------------------------------------------------------

test('AC2: every numbered rulebook section in design/rules.md is named by number and title', () => {
  const rulesContent = fs.readFileSync(RULES_PATH, 'utf8');
  const rulesSections = parseSections(rulesContent).filter(
    (s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title)
  );
  assert.ok(rulesSections.length > 0, 'expected design/rules.md to have numbered top-level sections');

  for (const section of rulesSections) {
    assert.ok(
      content.includes(section.title),
      `expected design/DESIGN-READINESS.md to name rulebook section "${section.title}"`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3 / AC6 (held_out): every card set/wave that actually parses to 1+ real
// cards under design/cards/*.md (via the shared parser) is cited by filename
// in the document. This is the T12-driven check: it reads design/cards/ at
// run time, so it fails the moment a new set lands without a doc update.
// ---------------------------------------------------------------------------

test('AC3/AC6: every real card-set file under design/cards/ is cited in the readiness doc', () => {
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

// ---------------------------------------------------------------------------
// AC4: world lore eras and races/star atlas are named with citations.
// Era titles are derived live from lore.md's own "Timeline of Eras" list.
// ---------------------------------------------------------------------------

test('AC4: world lore eras and races/star atlas are named with file citations', () => {
  assert.ok(content.includes('design/world.md'), 'expected a citation to design/world.md');
  assert.ok(content.includes('design/lore.md'), 'expected a citation to design/lore.md');
  assert.ok(content.includes('design/star-atlas.md'), 'expected a citation to design/star-atlas.md');

  const loreContent = fs.readFileSync(LORE_PATH, 'utf8');
  const loreSections = parseSections(loreContent);
  const timeline = sectionText(loreSections, /timeline of eras/i);
  assert.ok(timeline, 'expected design/lore.md to have a "Timeline of Eras" section');

  const eraLines = timeline
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^\d+\.\s+\S/.test(l));
  assert.ok(eraLines.length >= 4, 'expected at least 4 eras in lore.md\'s own timeline');

  for (const line of eraLines) {
    const title = line.replace(/^\d+\.\s+/, '').trim();
    assert.ok(
      content.includes(title),
      `expected design/DESIGN-READINESS.md to name lore era "${title}"`
    );
  }

  const raceFiles = fs.readdirSync(RACES_DIR).filter((f) => f.endsWith('.md'));
  assert.ok(raceFiles.length > 0, 'expected race files under design/races/');
  for (const raceFile of raceFiles) {
    assert.ok(
      content.includes(raceFile),
      `expected design/DESIGN-READINESS.md to cite design/races/${raceFile}`
    );
  }
});

// ---------------------------------------------------------------------------
// AC5: closes with a numbered list of at least 3 open gaps, scoped to the
// document's own "Open Gaps" section (not any other numbered list in the
// doc, e.g. the rulebook or era lists).
// ---------------------------------------------------------------------------

test('AC5: closes with a numbered list of at least 3 open gaps', () => {
  const gapsBody = sectionText(sections, /open gaps|unresolved questions/i);
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');

  const items = gapsBody.match(/^\d+\.\s+\S.*/gm) || [];
  assert.ok(
    items.length >= 3,
    `expected at least 3 numbered open-gap items, found ${items.length}`
  );
});

// ---------------------------------------------------------------------------
// AC7 (new, mechanical): Section 4's art-brief-coverage sentence is derived
// live from actual brief coverage, not hand-typed. For every design/cards/
// file that parses to 1+ real cards, if every one of that file's card names
// appears as a "###" heading anywhere in art-briefs.md, the filename must be
// cited in the "Card Anatomy & Art Brief Coverage" section text. Files with
// partial or zero art-brief coverage are NOT required to be cited — this is
// what keeps the check from racing with an art-briefs proposal that's still
// in flight for some other file.
// ---------------------------------------------------------------------------

test('AC7: every card-set file fully covered by art-briefs.md is cited in Section 4\'s coverage sentence', () => {
  const artBriefsContent = fs.readFileSync(ART_BRIEFS_PATH, 'utf8');
  const briefTitles = new Set(
    parseSections(artBriefsContent)
      .filter((s) => s.level === 3)
      .map((s) => s.title)
  );

  const section4 = sectionText(sections, /card anatomy & art brief coverage/i);
  assert.ok(
    section4,
    'expected a "Card Anatomy & Art Brief Coverage" section in design/DESIGN-READINESS.md'
  );

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
    const cardNames = loadCardsFromFile(path.join(CARDS_DIR, file)).map((c) => c.name);
    const fullyCovered = cardNames.every((name) => briefTitles.has(name));
    if (!fullyCovered) continue;

    assert.ok(
      section4.includes(file),
      `expected Section 4 ("Card Anatomy & Art Brief Coverage") to cite "${file}" — ` +
        `all ${cardNames.length} of its card(s) already have an art-brief section in art-briefs.md`
    );
  }
});
