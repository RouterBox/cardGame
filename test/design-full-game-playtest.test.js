'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, findSection, normalizeProse } = require('./helpers/markdown');
const { loadCardsFromFile } = require('../lib/parse-card-markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const DOC_PATH = path.join(__dirname, '..', 'design', 'playtest-full-game.md');
const CARD_FILES = ['alpha-set.md', 'character-signatures.md', 'frontier-set.md'].map((f) =>
  path.join(__dirname, '..', 'design', 'cards', f)
);

function readRules() {
  return fs.readFileSync(RULES_PATH, 'utf8');
}

function rulesSections() {
  return parseSections(readRules());
}

function readDoc() {
  assert.ok(fs.existsSync(DOC_PATH), `expected ${DOC_PATH} to exist`);
  return fs.readFileSync(DOC_PATH, 'utf8');
}

function allowedCardNames() {
  const names = new Set();
  for (const file of CARD_FILES) {
    for (const card of loadCardsFromFile(file)) names.add(card.name);
  }
  return names;
}

// Every rules.md heading is "## N. Title" (top-level, with a period after N) or
// "### N.M Title" (subsection, no period after N.M) — see parseSections' `title` field.
// A citation "N" or "N.M" is considered to match a heading whose title begins with that
// exact number followed by ".", whitespace, or end-of-string, so "Section 11" matches
// both "11. Deck Construction" and "11.1 Minimum Archive Size" (either is proof the
// cited section number is real), while "Section 11.1" only matches the latter.
function citationExistsInRules(sections, citation) {
  const escaped = citation.replace(/\./g, '\\.');
  const re = new RegExp('^' + escaped + '(?:\\.|\\s|$)');
  return findSection(sections, re) !== -1;
}

function extractSectionCitations(content) {
  const matches = content.match(/Section\s+\d+(?:\.\d+)?/g) || [];
  const numbers = matches.map((m) => m.replace(/^Section\s+/, ''));
  return Array.from(new Set(numbers));
}

function extractCardNameCitations(content) {
  const matches = content.match(/`([^`]+)`/g) || [];
  return Array.from(new Set(matches.map((m) => m.slice(1, -1))));
}

// ---------------------------------------------------------------------------
// AC1: design/playtest-full-game.md exists and contains a numbered, step-by-step
// procedure two human players can follow with physical materials, starting from deck
// construction and ending at an explicit win condition being reached.
// ---------------------------------------------------------------------------

test('AC1: design/playtest-full-game.md exists', () => {
  assert.ok(fs.existsSync(DOC_PATH), `expected ${DOC_PATH} to exist`);
});

test('AC1: describes physical materials for two humans to use', () => {
  const content = readDoc();
  assert.ok(
    /token|index card|counter|paper|d20|tally/i.test(content),
    'expected the document to reference physical materials such as tokens, index cards, or counters'
  );
  assert.ok(
    /\btwo\b.*(human|player|challenger|playtester)|(human|player|challenger|playtester)s?.*\btwo\b/i.test(content),
    'expected the document to describe a procedure for two humans/playtesters'
  );
});

test('AC1: contains a numbered step-by-step procedure', () => {
  const content = readDoc();
  const stepMatches = content.match(/^\d+\.\s+\S/gm) || [];
  assert.ok(
    stepMatches.length >= 10,
    `expected a numbered step-by-step procedure with at least 10 steps, found ${stepMatches.length}`
  );
  const numbers = stepMatches.map((s) => parseInt(s, 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(
      numbers[i],
      i + 1,
      `expected strictly sequential numbered steps starting at 1, got [${numbers.join(', ')}]`
    );
  }
});

test('AC1: procedure starts from deck construction', () => {
  const content = normalizeProse(readDoc());
  assert.ok(
    /deck|archive/i.test(content) && /section 11/i.test(content),
    'expected the procedure to open with deck construction, citing Section 11'
  );
  const firstStepMatch = content.match(/1\.\s+\*\*([^*]+)\*\*/);
  assert.ok(firstStepMatch, 'expected step 1 to have a bold lead sentence');
  assert.ok(
    /deck/i.test(firstStepMatch[1]),
    `expected step 1 to be about deck construction, got: "${firstStepMatch[1]}"`
  );
});

test('AC1: procedure ends at an explicit win condition being reached', () => {
  const content = normalizeProse(readDoc());
  assert.ok(
    /eliminat/i.test(content) && /(wins|winner|game ends)/i.test(content),
    'expected the procedure to end with an explicit Elimination/win/Game End'
  );
});

// ---------------------------------------------------------------------------
// AC2: every card named in the walkthrough exists by exact name in one of
// design/cards/alpha-set.md, design/cards/character-signatures.md, or
// design/cards/frontier-set.md. Card names are wrapped in backticks throughout the
// document by convention, so every backtick-wrapped span must be a real card name.
// ---------------------------------------------------------------------------

test('AC2: every backtick-wrapped card name exists in one of the three permitted card files', () => {
  const content = readDoc();
  const cited = extractCardNameCitations(content);
  assert.ok(cited.length >= 15, `expected at least 15 distinct card-name citations, found ${cited.length}`);
  const allowed = allowedCardNames();
  const missing = cited.filter((name) => !allowed.has(name));
  assert.deepStrictEqual(
    missing,
    [],
    `these backtick-wrapped names do not exist by exact name in alpha-set.md, character-signatures.md, or frontier-set.md: ${JSON.stringify(missing)}`
  );
});

test('AC2: at least one card from each of the three permitted files is named', () => {
  const content = readDoc();
  const cited = new Set(extractCardNameCitations(content));
  for (const file of CARD_FILES) {
    const names = loadCardsFromFile(file).map((c) => c.name);
    const anyCited = names.some((n) => cited.has(n));
    assert.ok(anyCited, `expected at least one card from ${path.basename(file)} to be cited in the document`);
  }
});

// ---------------------------------------------------------------------------
// AC3: each major step (turn start, resource use, combat, capture/win) cites the
// specific rules.md section number that governs it, and every cited section number
// corresponds to a section that actually exists in rules.md.
// ---------------------------------------------------------------------------

test('AC3: every "Section N" or "Section N.M" citation corresponds to a real rules.md heading', () => {
  const content = readDoc();
  const sections = rulesSections();
  const cited = extractSectionCitations(content);
  assert.ok(cited.length >= 10, `expected at least 10 distinct section citations, found ${cited.length}`);
  const missing = cited.filter((n) => !citationExistsInRules(sections, n));
  assert.deepStrictEqual(
    missing,
    [],
    `these cited section numbers do not correspond to any heading in rules.md: ${JSON.stringify(missing)}`
  );
});

test('AC3: cites the governing section for turn start (5.1)', () => {
  assert.ok(/Section\s+5\.1\b/.test(readDoc()), 'expected a citation of Section 5.1 (Dawn Phase / turn start)');
});

test('AC3: cites the governing section for resource use (Section 4 and a Fount subsection)', () => {
  const content = readDoc();
  assert.ok(/Section\s+4\b/.test(content), 'expected a citation of Section 4 (Resources)');
  assert.ok(
    /Section\s+4\.1\b|Section\s+4\.4\b/.test(content),
    'expected a citation of a specific Fount subsection (4.1 Mass or 4.4 Circuit)'
  );
});

test('AC3: cites the governing section for combat (5.4 and/or 12)', () => {
  const content = readDoc();
  assert.ok(
    /Section\s+5\.4\b/.test(content) && /Section\s+12(\.\d)?\b/.test(content),
    'expected citations of Section 5.4 (Conflict Phase) and Section 12 (Combat Resolution)'
  );
});

test('AC3: cites the governing section for capture/win (8.6, 10.1, 10.2)', () => {
  const content = readDoc();
  assert.ok(/Section\s+8\.6\b/.test(content), 'expected a citation of Section 8.6 (Blockade & Capture)');
  assert.ok(/Section\s+10\.1\b/.test(content), 'expected a citation of Section 10.1 (Player Elimination)');
  assert.ok(/Section\s+10\.2\b/.test(content), 'expected a citation of Section 10.2 (Game End)');
});

// ---------------------------------------------------------------------------
// Sanity: this unit must not have modified rules.md or any card file (AC4, held out).
// This is a light in-suite guard, not a substitute for the reviewer checking `git diff`
// touches only the two new files.
// ---------------------------------------------------------------------------

test('sanity: rules.md still has its full Section 1-13 structure (untouched)', () => {
  const sections = rulesSections();
  for (let n = 1; n <= 13; n++) {
    const idx = findSection(sections, new RegExp(`^${n}\\.\\s+\\S`));
    assert.notStrictEqual(idx, -1, `expected rules.md to still have a top-level Section ${n} heading`);
  }
});
