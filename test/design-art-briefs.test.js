'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');
const ALPHA_SET_PATH = path.join(__dirname, '..', 'design', 'cards', 'alpha-set.md');
const FRONTIER_SET_PATH = path.join(__dirname, '..', 'design', 'cards', 'frontier-set.md');
const CHARACTER_SIGNATURES_PATH = path.join(__dirname, '..', 'design', 'cards', 'character-signatures.md');
const ANATOMY_PATH = path.join(__dirname, '..', 'design', 'cards', 'card-anatomy.md');

const FOUNT_COLORS = {
  Mass: 'Ash-grey',
  Bloom: 'Green',
  Signal: 'Cyan',
  Circuit: 'Copper',
  Tangle: 'Violet',
};
const FOUNTS = Object.keys(FOUNT_COLORS);

const GENERIC_FILLER = [
  'dramatic lighting',
  'epic composition',
  'epic scene',
  'stunning artwork',
  'stunning visual',
  'beautiful scene',
  'amazing artwork',
  'amazing visual',
  'breathtaking',
  'awe-inspiring',
];

const STOPWORDS = new Set([
  'this', 'that', 'with', 'from', 'your', 'their', 'when', 'resolves',
  'permanent', 'controller', 'holds', 'priority', 'until', 'during', 'usable',
  'instant', 'speed', 'combat', 'strength', 'enters', 'counters', 'counter',
  'deal', 'damage', 'move', 'card', 'look', 'onto', 'other', 'than', 'front',
  'into', 'them', 'about', 'have', 'been', 'told', 'precisely', 'once',
  'slow', 'fast', 'spent', 'ready',
]);

function readFile(p) {
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

function listCardsFromFile(cardsPath) {
  const content = readFile(cardsPath);
  if (content === null) return [];
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function costFounts(card) {
  const costMatch = card.body.match(/Cost line:\s*([^\n]+)/);
  if (!costMatch) return [];
  const costText = costMatch[1];
  // Preserve left-to-right order as listed in the Cost line.
  const found = [];
  const re = new RegExp(FOUNTS.join('|'), 'g');
  let m;
  while ((m = re.exec(costText)) !== null) {
    if (!found.includes(m[0])) found.push(m[0]);
  }
  return found;
}

function significantWords(text) {
  const words = (text.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || []);
  return new Set(words.filter((w) => !STOPWORDS.has(w)));
}

function briefBriefsSections() {
  const content = readFile(BRIEFS_PATH);
  if (content === null) return [];
  const sections = parseSections(content);
  return sections.filter((s) => s.level === 3);
}

const alphaSetCards = listCardsFromFile(ALPHA_SET_PATH);
const frontierSetCards = listCardsFromFile(FRONTIER_SET_PATH);
const characterSignatureCards = listCardsFromFile(CHARACTER_SIGNATURES_PATH);
const allCards = [...alphaSetCards, ...frontierSetCards, ...characterSignatureCards];
const cardsToCheck = allCards.length
  ? allCards
  : [{ title: '<no cards found — design/cards/alpha-set.md, frontier-set.md, or character-signatures.md missing or empty>', body: '' }];

// ---------------------------------------------------------------------------
// AC1: design/cards/art-briefs.md exists and contains exactly one brief
// section for each card in alpha-set.md, frontier-set.md, and
// character-signatures.md, matched by name/heading.
// ---------------------------------------------------------------------------

test('AC1: design/cards/art-briefs.md exists', () => {
  assert.ok(fs.existsSync(BRIEFS_PATH), `expected ${BRIEFS_PATH} to exist`);
});

test('AC1: alpha-set.md has exactly 18 cards (sanity check on fixture)', () => {
  assert.strictEqual(alphaSetCards.length, 18, `expected 18 cards in alpha-set.md, found ${alphaSetCards.length}`);
});

test('AC1: frontier-set.md has exactly 5 cards (sanity check on fixture)', () => {
  assert.strictEqual(frontierSetCards.length, 5, `expected 5 cards in frontier-set.md, found ${frontierSetCards.length}`);
});

test('AC1: character-signatures.md has exactly 5 cards (sanity check on fixture)', () => {
  assert.strictEqual(characterSignatureCards.length, 5, `expected 5 cards in character-signatures.md, found ${characterSignatureCards.length}`);
});

test('AC1: art-briefs.md has exactly one "###" heading per card across alpha-set.md, frontier-set.md, and character-signatures.md, no duplicates, no extras', () => {
  const briefSections = briefBriefsSections();
  const briefTitles = briefSections.map((s) => s.title);
  const cardTitles = allCards.map((c) => c.title);

  // No strays: every brief must name a real card SOMEWHERE in
  // design/cards/*.md — but newer set files (fount-economy, ...) may add
  // their own briefs beyond this test's three covered files, so the total
  // is at-least, not exactly (frozen counts broke every set addition).
  const { loadAllCards } = require('../lib/parse-card-markdown');
  const allKnownCardTitles = new Set(loadAllCards().map((c) => c.name));
  for (const title of briefTitles) {
    assert.ok(
      allKnownCardTitles.has(title),
      `brief section "${title}" names no card in any design/cards/*.md file`
    );
  }
  assert.ok(
    briefTitles.length >= cardTitles.length,
    `expected at least ${cardTitles.length} "###" brief sections, found ${briefTitles.length}`
  );
  assert.strictEqual(
    new Set(briefTitles).size,
    briefTitles.length,
    `expected no duplicate brief headings, got [${briefTitles.join(', ')}]`
  );
  for (const name of cardTitles) {
    assert.ok(
      briefTitles.includes(name),
      `expected a brief section titled exactly "${name}" (verbatim match to card heading)`
    );
  }
});

for (const card of cardsToCheck) {
  test(`AC1: "${card.title}" has exactly one matching brief section`, () => {
    const briefSections = briefBriefsSections();
    const matches = briefSections.filter((s) => s.title === card.title);
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one brief section titled "${card.title}", found ${matches.length}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC2: each brief names the card's Fount-driven color/mood palette (matching
// the Fount identity table in card-anatomy.md) and lists at least 2 concrete
// visual elements drawn from the card's own rules text or type line, not
// generic filler.
// ---------------------------------------------------------------------------

function findBriefSection(title) {
  return briefBriefsSections().find((s) => s.title === title) || null;
}

for (const card of cardsToCheck) {
  test(`AC2: "${card.title}" brief names the correct Fount-driven palette color(s)`, () => {
    const section = findBriefSection(card.title);
    assert.ok(section, `expected a brief section for "${card.title}"`);
    const body = section.lines.join('\n');
    const paletteMatch = body.match(/Palette:\s*([^\n]+)/i);
    assert.ok(paletteMatch, `expected a "Palette:" line in the "${card.title}" brief`);

    const founts = costFounts(card);
    assert.ok(founts.length > 0, `expected to find Fount(s) named in "${card.title}"'s Cost line`);
    const expectedColors = founts.map((f) => FOUNT_COLORS[f]);
    for (const color of expectedColors) {
      const re = new RegExp(escapeRegExp(color), 'i');
      assert.ok(
        re.test(paletteMatch[1]),
        `expected "${card.title}"'s Palette line to name "${color}" (per card-anatomy.md's Fount identity table), got: "${paletteMatch[1]}"`
      );
    }
  });

  test(`AC2: "${card.title}" brief lists at least 2 concrete, card-specific visual elements`, () => {
    const section = findBriefSection(card.title);
    assert.ok(section, `expected a brief section for "${card.title}"`);
    const body = section.lines.join('\n');

    const keyElementsMatch = body.match(/Key visual elements:\s*\n((?:\s*-\s*.+\n?)+)/i);
    assert.ok(keyElementsMatch, `expected a "Key visual elements:" bulleted list in the "${card.title}" brief`);

    const bulletLines = keyElementsMatch[1]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('-'));
    assert.ok(
      bulletLines.length >= 2,
      `expected at least 2 "Key visual elements" bullets in "${card.title}", found ${bulletLines.length}`
    );

    const bulletsText = bulletLines.join(' ').toLowerCase();
    for (const filler of GENERIC_FILLER) {
      assert.ok(
        !bulletsText.includes(filler),
        `expected "${card.title}"'s visual elements to avoid generic filler phrase "${filler}"`
      );
    }

    const typeMatch = card.body.match(/Type line:\s*([^\n]+)/);
    const rulesMatch = card.body.match(/Rules text:\s*([^\n]+(?:\n(?!\*)[^\n]+)*)/);
    const sourceText = `${typeMatch ? typeMatch[1] : ''} ${rulesMatch ? rulesMatch[1] : ''}`;
    const sourceWords = significantWords(sourceText);
    const bulletWords = significantWords(bulletsText);
    const overlap = [...sourceWords].filter((w) => bulletWords.has(w));
    assert.ok(
      overlap.length >= 2,
      `expected "${card.title}"'s visual-elements bullets to draw on at least 2 concrete words from its own ` +
        `Rules text/Type line (found overlap: [${overlap.join(', ')}]) — not generic filler`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3 (inferred): each brief includes a one-line composition note
// referencing the Art Window's aspect ratio/shape as defined in
// card-anatomy.md.
// ---------------------------------------------------------------------------

test('AC3: card-anatomy.md describes the Art Window as a rectangular shape (sanity check on fixture)', () => {
  const anatomy = readFile(ANATOMY_PATH);
  assert.ok(anatomy, `expected ${ANATOMY_PATH} to exist`);
  assert.ok(
    /Art Window.*rectangular|rectangular.*window/i.test(anatomy.replace(/\n/g, ' ')),
    'expected card-anatomy.md to describe the Art Window as a rectangular window'
  );
});

for (const card of cardsToCheck) {
  test(`AC3: "${card.title}" brief has a composition note referencing the Art Window's shape/aspect ratio`, () => {
    const section = findBriefSection(card.title);
    assert.ok(section, `expected a brief section for "${card.title}"`);
    const body = section.lines.join('\n');

    const compositionMatch = body.match(/Composition:\s*([^\n]+)/i);
    assert.ok(compositionMatch, `expected a "Composition:" line in the "${card.title}" brief`);

    const note = compositionMatch[1];
    assert.ok(
      /\d+\s*:\s*\d+/.test(note),
      `expected "${card.title}"'s Composition note to reference the Art Window's aspect ratio (e.g. "5:3"), got: "${note}"`
    );
    assert.ok(
      /rectangular|rectangle|landscape/i.test(note),
      `expected "${card.title}"'s Composition note to reference the Art Window's rectangular/landscape shape, got: "${note}"`
    );
  });
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
