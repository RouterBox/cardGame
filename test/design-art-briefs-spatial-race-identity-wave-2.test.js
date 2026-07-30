'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
const WAVE2_CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'spatial-race-identity-set-wave-2.md');
const ANATOMY_PATH = path.join(REPO_ROOT, 'design', 'cards', 'card-anatomy.md');
const RENDER_SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'render-card.js');
const COMPOSITE_SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'composite-card-art.js');

// AC1 also requires that no pre-existing section in art-briefs.md is
// touched. That's a diff-time property this test file can't usefully assert
// on its own (same limitation noted in the wave-1/wormhole-closure sibling
// test files) — verified by the orchestrator's diff at merge time instead.

const EXPECTED_CARDS = [
  {
    title: 'Bloom Fount',
    fount: 'Bloom',
    color: 'Green',
    race: /Mireth Bloom/i,
    mechanic: /Bloomfront Expansion|does not control/i,
  },
  {
    title: 'Circuit Fount',
    fount: 'Circuit',
    color: 'Copper',
    race: /Wrought Assembly/i,
    mechanic: /Discovery/i,
  },
];

function readFile(p) {
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

function briefSections() {
  const content = readFile(BRIEFS_PATH);
  if (content === null) return [];
  return parseSections(content).filter((s) => s.level === 3);
}

function findBriefSection(title) {
  return briefSections().find((s) => s.title === title) || null;
}

function wave2CardTitles() {
  const content = readFile(WAVE2_CARDS_PATH);
  if (content === null) return [];
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => s.title);
}

// ---------------------------------------------------------------------------
// AC1: design/cards/art-briefs.md gains exactly one '###' section per
// wave-2 card, titled 'Bloom Fount' and 'Circuit Fount' verbatim, appended
// after existing content with no pre-existing section touched.
// ---------------------------------------------------------------------------

test('sanity: spatial-race-identity-set-wave-2.md has exactly the 2 expected cards', () => {
  assert.deepStrictEqual(
    [...wave2CardTitles()].sort(),
    [...EXPECTED_CARDS.map((c) => c.title)].sort(),
    `expected spatial-race-identity-set-wave-2.md's cards to be exactly ${JSON.stringify(EXPECTED_CARDS.map((c) => c.title))}`
  );
});

for (const card of EXPECTED_CARDS) {
  test(`AC1: art-briefs.md has exactly one '###' section titled '${card.title}' verbatim`, () => {
    const matches = briefSections().filter((s) => s.title === card.title);
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one brief section titled "${card.title}" in design/cards/art-briefs.md, found ${matches.length}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC2: Bloom Fount's Palette line names Green (card-anatomy.md's
// Frame/Border color for the Bloom) and Circuit Fount's Palette line names
// Copper (the Circuit's color), each explicitly naming its Fount.
// ---------------------------------------------------------------------------

test('sanity: card-anatomy.md names Green for the Bloom and Copper for the Circuit', () => {
  const anatomy = readFile(ANATOMY_PATH);
  assert.ok(anatomy, `expected ${ANATOMY_PATH} to exist`);
  assert.ok(
    /The Bloom \(biology\)\s*\|\s*Green/i.test(anatomy),
    'expected card-anatomy.md Frame/Border color table to map the Bloom to Green'
  );
  assert.ok(
    /The Circuit \(technology\)\s*\|\s*Copper/i.test(anatomy),
    'expected card-anatomy.md Frame/Border color table to map the Circuit to Copper'
  );
});

for (const card of EXPECTED_CARDS) {
  test(`AC2: "${card.title}" brief's Palette line names ${card.color} and its own Fount`, () => {
    const section = findBriefSection(card.title);
    assert.ok(section, `expected a brief section for "${card.title}"`);
    const body = section.lines.join('\n');
    const paletteMatch = body.match(/Palette:\s*([^\n]+)/i);
    assert.ok(paletteMatch, `expected a "Palette:" line in the "${card.title}" brief`);

    assert.ok(
      new RegExp(card.color, 'i').test(paletteMatch[1]),
      `expected "${card.title}"'s Palette line to name "${card.color}", got: "${paletteMatch[1]}"`
    );
    assert.ok(
      new RegExp(card.fount, 'i').test(paletteMatch[1]),
      `expected "${card.title}"'s Palette line to explicitly name its own Fount ("${card.fount}"), got: "${paletteMatch[1]}"`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3 (held_out): each brief's Subject/Scene names its race and its own
// specific mechanic, and Key visual elements has >= 3 bullets.
// ---------------------------------------------------------------------------

for (const card of EXPECTED_CARDS) {
  test(`AC3: "${card.title}" brief's Subject/Scene names its race and specific mechanic`, () => {
    const section = findBriefSection(card.title);
    assert.ok(section, `expected a brief section for "${card.title}"`);
    const body = section.lines.join('\n');
    const subjectMatch = body.match(/Subject\/Scene:\s*([^\n]+(?:\n(?!Key visual elements:|Composition:)[^\n]*)*)/i);
    assert.ok(subjectMatch, `expected a "Subject/Scene:" line in the "${card.title}" brief`);

    assert.ok(
      card.race.test(subjectMatch[1]),
      `expected "${card.title}"'s Subject/Scene to name its race, got: "${subjectMatch[1]}"`
    );
    assert.ok(
      card.mechanic.test(subjectMatch[1]),
      `expected "${card.title}"'s Subject/Scene to cite its own specific mechanic, got: "${subjectMatch[1]}"`
    );
  });

  test(`AC3: "${card.title}" brief's Key visual elements list has at least 3 bullets`, () => {
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
      bulletLines.length >= 3,
      `expected at least 3 "Key visual elements" bullets in "${card.title}", found ${bulletLines.length}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC4: each brief's Composition line cites the Art Window as a wide
// landscape rectangle with an aspect ratio matching the ~5:3 precedent used
// by every prior art-briefs.md entry.
// ---------------------------------------------------------------------------

test('sanity: card-anatomy.md describes the Art Window as a rectangular window', () => {
  const anatomy = readFile(ANATOMY_PATH);
  assert.ok(anatomy, `expected ${ANATOMY_PATH} to exist`);
  assert.ok(
    /Art Window.*rectangular|rectangular.*window/i.test(anatomy.replace(/\n/g, ' ')),
    'expected card-anatomy.md to describe the Art Window as a rectangular window'
  );
});

for (const card of EXPECTED_CARDS) {
  test(`AC4: "${card.title}" brief's Composition line cites a landscape rectangle at ~5:3`, () => {
    const section = findBriefSection(card.title);
    assert.ok(section, `expected a brief section for "${card.title}"`);
    const body = section.lines.join('\n');
    const compositionMatch = body.match(/Composition:\s*([^\n]+)/i);
    assert.ok(compositionMatch, `expected a "Composition:" line in the "${card.title}" brief`);

    const note = compositionMatch[1];
    assert.ok(
      /rectangular|rectangle|landscape/i.test(note),
      `expected "${card.title}"'s Composition note to reference the Art Window's rectangular/landscape shape, got: "${note}"`
    );
    assert.ok(
      /5\s*:\s*3/.test(note),
      `expected "${card.title}"'s Composition note to match the ~5:3 aspect-ratio precedent, got: "${note}"`
    );
  });
}

// ---------------------------------------------------------------------------
// AC5: running tools/composite-card-art.js against
// spatial-race-identity-set-wave-2.md's cards no longer prints a
// 'no art brief for "<name>"' warning for Bloom Fount or Circuit Fount.
// ---------------------------------------------------------------------------

test('AC5: composite.main() prints no "no art brief" warning for Bloom Fount or Circuit Fount', async (t) => {
  assert.ok(fs.existsSync(RENDER_SCRIPT_PATH), `expected ${RENDER_SCRIPT_PATH} to exist`);
  assert.ok(fs.existsSync(COMPOSITE_SCRIPT_PATH), `expected ${COMPOSITE_SCRIPT_PATH} to exist`);

  const { execFileSync } = require('node:child_process');
  execFileSync('node', [RENDER_SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });

  const composite = require('../tools/composite-card-art');
  assert.strictEqual(typeof composite.main, 'function', 'expected composite-card-art.js to export a main() function');

  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (line) => warnings.push(String(line));
  try {
    await composite.main();
  } finally {
    console.warn = originalWarn;
  }

  for (const card of EXPECTED_CARDS) {
    assert.ok(
      !warnings.includes(`no art brief for "${card.title}"`),
      `did not expect a "no art brief" warning for "${card.title}", got warnings: [${warnings.join(', ')}]`
    );
  }
});
