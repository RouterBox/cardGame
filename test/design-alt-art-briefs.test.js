'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const ALT_BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'alt-art-briefs.md');
const BASE_BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');

const EXPECTED_TITLES = ['Sporeknit Warden', 'Salvage-Wrought Bastion', 'Replicant Foundry Core'];

const FIELD_PREFIXES = ['Palette:', 'Subject/Scene:', 'Key visual elements:', 'Composition:'];

function isFieldStart(line) {
  return FIELD_PREFIXES.some((prefix) => line.startsWith(prefix));
}

// Joins a field's soft-wrapped continuation lines (the same wrap
// convention art-briefs.md already uses) until a blank line or the next
// field label.
function extractField(lines, prefix) {
  const idx = lines.findIndex((l) => l.startsWith(prefix));
  if (idx === -1) return null;
  const parts = [lines[idx].slice(prefix.length).trim()];
  let i = idx + 1;
  while (i < lines.length && lines[i].trim() !== '' && !isFieldStart(lines[i])) {
    parts.push(lines[i].trim());
    i++;
  }
  return parts.join(' ').trim();
}

// Small connector-word stopword list — deliberately does not include
// domain nouns (Warden, Generator, Growth, ...) so overlap counts reflect
// genuine subject/scene repetition, not shared prepositions.
const STOPWORDS = new Set([
  'this', 'that', 'with', 'from', 'your', 'their', 'which', 'while', 'above',
  'being', 'there', 'where', 'about', 'after', 'before', 'under', 'between',
  'during', 'without', 'within', 'than', 'rather', 'into', 'onto', 'upon',
  'toward', 'across', 'around', 'beside', 'beneath', 'atop', 'amid', 'along',
]);

function significantWords(text) {
  const words = text.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || [];
  return new Set(words.filter((w) => !STOPWORDS.has(w)));
}

function readFile(p) {
  assert.ok(fs.existsSync(p), `expected ${p} to exist`);
  return fs.readFileSync(p, 'utf8');
}

function briefSections(content) {
  return parseSections(content).filter((s) => s.level === 3);
}

const altContent = readFile(ALT_BRIEFS_PATH);
const baseContent = readFile(BASE_BRIEFS_PATH);
const altSections = briefSections(altContent);
const baseSections = briefSections(baseContent);

// ---------------------------------------------------------------------------
// AC1: design/cards/alt-art-briefs.md exists and contains exactly 3 "###"
// brief sections, titled verbatim, each with the same
// Palette/Subject-Scene/Key visual elements/Composition shape art-briefs.md
// already uses.
// ---------------------------------------------------------------------------

test('AC1: design/cards/alt-art-briefs.md exists', () => {
  assert.ok(fs.existsSync(ALT_BRIEFS_PATH), `expected ${ALT_BRIEFS_PATH} to exist`);
});

test('AC1: alt-art-briefs.md has exactly 3 "###" sections titled verbatim', () => {
  const titles = altSections.map((s) => s.title);
  assert.strictEqual(
    titles.length,
    3,
    `expected exactly 3 brief sections, found ${titles.length}: [${titles.join(', ')}]`
  );
  assert.deepStrictEqual(
    [...titles].sort(),
    [...EXPECTED_TITLES].sort(),
    `expected titles ${JSON.stringify(EXPECTED_TITLES)}, got ${JSON.stringify(titles)}`
  );
});

for (const title of EXPECTED_TITLES) {
  test(`AC1: "${title}" alt brief has Palette/Subject-Scene/Key visual elements/Composition lines`, () => {
    const section = altSections.find((s) => s.title === title);
    assert.ok(section, `expected an alt brief section titled "${title}"`);
    const body = section.lines.join('\n');

    assert.ok(/Palette:\s*\S/.test(body), `expected a "Palette:" line in the "${title}" alt brief`);
    assert.ok(
      extractField(section.lines, 'Subject/Scene:'),
      `expected a "Subject/Scene:" line in the "${title}" alt brief`
    );
    assert.ok(
      /Key visual elements:\s*\n(?:\s*-\s*.+\n?){2,}/i.test(body + '\n'),
      `expected a "Key visual elements:" bulleted list (2+ items) in the "${title}" alt brief`
    );
    assert.ok(/Composition:\s*\S/.test(body), `expected a "Composition:" line in the "${title}" alt brief`);
  });
}

// ---------------------------------------------------------------------------
// AC2 (inferred): each alt brief's Subject/Scene line shares fewer than half
// its significant words with that same card's existing base brief's
// Subject/Scene line — a genuinely different scene, not a restatement.
// ---------------------------------------------------------------------------

for (const title of EXPECTED_TITLES) {
  test(`AC2: "${title}" alt brief's Subject/Scene describes a genuinely different scene than its base brief`, () => {
    const altSection = altSections.find((s) => s.title === title);
    const baseSection = baseSections.find((s) => s.title === title);
    assert.ok(altSection, `expected an alt brief section titled "${title}"`);
    assert.ok(baseSection, `expected a base brief section titled "${title}" in art-briefs.md`);

    const altSubject = extractField(altSection.lines, 'Subject/Scene:');
    const baseSubject = extractField(baseSection.lines, 'Subject/Scene:');
    assert.ok(altSubject, `expected a "Subject/Scene:" line in the "${title}" alt brief`);
    assert.ok(baseSubject, `expected a "Subject/Scene:" line in the "${title}" base brief`);

    const altWords = significantWords(altSubject);
    const baseWords = significantWords(baseSubject);
    const overlap = [...altWords].filter((w) => baseWords.has(w));

    assert.ok(
      overlap.length < altWords.size / 2,
      `expected "${title}"'s alt Subject/Scene to share fewer than half its significant words with the base ` +
        `brief (${overlap.length}/${altWords.size} shared: [${overlap.join(', ')}]) — describe a genuinely ` +
        `different scene`
    );
  });
}
