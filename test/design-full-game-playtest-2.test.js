'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, findSection, normalizeProse } = require('./helpers/markdown');
const { loadCardsFromFile, loadAllCards } = require('../lib/parse-card-markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const DOC_PATH = path.join(__dirname, '..', 'design', 'playtest-full-game-2.md');
const READINESS_PATH = path.join(__dirname, '..', 'design', 'DESIGN-READINESS.md');

const FOCUS_FILES = [
  'wormhole-restrictions-set.md',
  'wormhole-closure-cards.md',
  'spatial-race-identity-set.md',
  'spatial-race-identity-set-wave-2.md',
  'character-signatures-wave-2.md',
].map((f) => path.join(__dirname, '..', 'design', 'cards', f));

function readDoc() {
  assert.ok(fs.existsSync(DOC_PATH), `expected ${DOC_PATH} to exist`);
  return fs.readFileSync(DOC_PATH, 'utf8');
}

function readRules() {
  return fs.readFileSync(RULES_PATH, 'utf8');
}

function rulesSections() {
  return parseSections(readRules());
}

// Same citation-matching convention as test/design-full-game-playtest.test.js.
function citationExistsInRules(sections, citation) {
  const escaped = citation.replace(/\./g, '\\.');
  const re = new RegExp('^' + escaped + '(?:\\.|\\s|$)');
  return findSection(sections, re) !== -1;
}

function extractSectionCitations(content) {
  const matches = content.match(/Section\s+\d+(?:\.\d+)?/g) || [];
  return Array.from(new Set(matches.map((m) => m.replace(/^Section\s+/, ''))));
}

function extractCardNameCitations(content) {
  const matches = content.match(/`([^`]+)`/g) || [];
  return Array.from(new Set(matches.map((m) => m.slice(1, -1))));
}

function focusCardNames() {
  const names = new Set();
  for (const file of FOCUS_FILES) {
    for (const card of loadCardsFromFile(file)) names.add(card.name);
  }
  return names;
}

function focusCardCostByName() {
  const map = new Map();
  for (const file of FOCUS_FILES) {
    for (const card of loadCardsFromFile(file)) map.set(card.name, card.costLine);
  }
  return map;
}

function extractDeckEntries(content, label, endMarkerRe) {
  const headerRe = new RegExp('\\*\\*Deck ' + label + ' \\("[^"]+"\\)\\*\\*[\\s\\S]*?40 cards[^:]*:');
  const headerMatch = content.match(headerRe);
  assert.ok(headerMatch, `expected to find the Deck ${label} header`);
  const rest = content.slice(headerMatch.index + headerMatch[0].length);
  const endMatch = rest.match(endMarkerRe);
  const body = endMatch ? rest.slice(0, endMatch.index) : rest;
  const lineRe = /-\s+(\d+)x\s+`([^`]+)`\s*\(([^)]*)\)/g;
  const entries = [];
  let m;
  while ((m = lineRe.exec(body))) {
    entries.push({ count: parseInt(m[1], 10), name: m[2], paren: m[3] });
  }
  return entries;
}

function deck1Entries(content) {
  return extractDeckEntries(content, '1', /\*\*Deck 2/);
}

function deck2Entries(content) {
  return extractDeckEntries(content, '2', /\n\s*Check each deck/);
}

function parseCostFounts(costLine) {
  const founts = [];
  const re = /\d+\s+(Mass|Bloom|Signal|Circuit|Tangle)/g;
  let m;
  while ((m = re.exec(costLine))) founts.push(m[1]);
  return founts;
}

// The four permitted "fill" files plus the five focus files make up the whole legal card pool
// this document may cite from.
function allowedCardNames() {
  const names = new Set();
  for (const card of loadAllCards()) names.add(card.name);
  return names;
}

// ---------------------------------------------------------------------------
// AC1: two Section-11-legal 40-card decklists.
// ---------------------------------------------------------------------------

test('AC1: design/playtest-full-game-2.md exists', () => {
  assert.ok(fs.existsSync(DOC_PATH));
});

test('AC1: Deck 1 and Deck 2 each total exactly 40 cards with no name over 3 copies', () => {
  const content = readDoc();
  for (const [label, entries] of [
    ['1', deck1Entries(content)],
    ['2', deck2Entries(content)],
  ]) {
    assert.ok(entries.length > 0, `expected to parse decklist entries for Deck ${label}`);
    const total = entries.reduce((sum, e) => sum + e.count, 0);
    assert.strictEqual(total, 40, `expected Deck ${label} to total 40 cards, got ${total}`);
    for (const e of entries) {
      assert.ok(e.count <= 3, `expected Deck ${label} to cap \`${e.name}\` at 3 copies, got ${e.count}`);
    }
  }
});

// ---------------------------------------------------------------------------
// AC2: all 20 named cards appear at least once across the two decklists combined, and each
// one's Cost line in the decklist matches its source file's Cost line exactly.
// ---------------------------------------------------------------------------

test('AC2: all 20 named focus cards appear at least once across the two decklists', () => {
  const content = readDoc();
  const allEntries = [...deck1Entries(content), ...deck2Entries(content)];
  const citedNames = new Set(allEntries.map((e) => e.name));
  const focusNames = focusCardNames();
  assert.strictEqual(focusNames.size, 20, `expected exactly 20 named focus cards, found ${focusNames.size}`);
  const missing = [...focusNames].filter((n) => !citedNames.has(n));
  assert.deepStrictEqual(missing, [], `expected every focus card to appear in a decklist, missing: ${JSON.stringify(missing)}`);
});

test("AC2: each focus card's decklist Cost line matches its source file's Cost line exactly", () => {
  const content = readDoc();
  const allEntries = [...deck1Entries(content), ...deck2Entries(content)];
  const costByName = focusCardCostByName();
  for (const [name, sourceCost] of costByName) {
    const entry = allEntries.find((e) => e.name === name);
    assert.ok(entry, `expected \`${name}\` to appear in a decklist`);
    const decklistCost = entry.paren.split('—')[0].trim();
    assert.strictEqual(
      decklistCost,
      sourceCost,
      `expected \`${name}\`'s decklist Cost ("${decklistCost}") to match its source Cost line ("${sourceCost}")`
    );
  }
});

test('AC2: every backtick-wrapped card name in the document is a real card', () => {
  const content = readDoc();
  const cited = extractCardNameCitations(content);
  const allowed = allowedCardNames();
  const missing = cited.filter((name) => !allowed.has(name));
  assert.deepStrictEqual(missing, [], `unexpected card names: ${JSON.stringify(missing)}`);
});

// ---------------------------------------------------------------------------
// AC3 (held out): every Fount either deck uses has an in-deck Generator attuned to it.
// ---------------------------------------------------------------------------

test('AC3: every Fount used by a deck has an in-deck Generator attuned to it', () => {
  const content = readDoc();
  const allCards = loadAllCards();
  const generatorFountByName = new Map();
  for (const card of allCards) {
    const m = card.rulesText.match(/Generator attuned to the (\w+)/);
    if (m) generatorFountByName.set(card.name, m[1]);
  }
  const costByName = new Map(allCards.map((c) => [c.name, c.costLine]));

  for (const [label, entries] of [
    ['1', deck1Entries(content)],
    ['2', deck2Entries(content)],
  ]) {
    const usedFounts = new Set();
    const generatorFounts = new Set();
    for (const e of entries) {
      const cost = costByName.get(e.name);
      assert.ok(cost, `expected \`${e.name}\` to be a real card with a Cost line`);
      for (const f of parseCostFounts(cost)) usedFounts.add(f);
      if (generatorFountByName.has(e.name)) generatorFounts.add(generatorFountByName.get(e.name));
    }
    for (const fount of usedFounts) {
      assert.ok(
        generatorFounts.has(fount),
        `expected Deck ${label} to include a Generator attuned to ${fount} (it uses that Fount)`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// AC4: the numbered Procedure cites real rules.md sections throughout, and ends with an
// explicit declared winner.
// ---------------------------------------------------------------------------

test('AC4: contains a numbered step-by-step Procedure with at least 20 steps', () => {
  const content = readDoc();
  const stepMatches = content.match(/^\d+\.\s+\*\*/gm) || [];
  assert.ok(stepMatches.length >= 20, `expected at least 20 numbered steps, found ${stepMatches.length}`);
  const numbers = (content.match(/^(\d+)\.\s+\*\*/gm) || []).map((s) => parseInt(s, 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strictly sequential numbered steps, got [${numbers.join(', ')}]`);
  }
});

test('AC4: every "Section N" or "Section N.M" citation corresponds to a real rules.md heading', () => {
  const content = readDoc();
  const sections = rulesSections();
  const cited = extractSectionCitations(content);
  assert.ok(cited.length >= 10, `expected at least 10 distinct section citations, found ${cited.length}`);
  const missing = cited.filter((n) => !citationExistsInRules(sections, n));
  assert.deepStrictEqual(missing, [], `these cited sections don't exist in rules.md: ${JSON.stringify(missing)}`);
});

test('AC4: cites Section 11 (deck construction), Section 15 (game start), and Section 8 subsections (spatial battlefield)', () => {
  const content = readDoc();
  assert.ok(/Section\s+11\.1\b/.test(content) && /Section\s+11\.2\b/.test(content));
  assert.ok(/Section\s+15\.[123]\b/.test(content));
  assert.ok(/Section\s+8\.3\b/.test(content), 'expected a Discovery citation (8.3)');
  assert.ok(/Section\s+8\.4\b/.test(content), 'expected a Restriction citation (8.4)');
  assert.ok(/Section\s+8\.5\b/.test(content), 'expected a Closure citation (8.5)');
});

test('AC4: cites Section 4.1 for a Fortification action', () => {
  assert.ok(/Section\s+4\.1\b/.test(readDoc()));
});

test('AC4: demonstrates all five character-signatures-wave-2.md cards', () => {
  const content = readDoc();
  const waveTwo = loadCardsFromFile(
    path.join(__dirname, '..', 'design', 'cards', 'character-signatures-wave-2.md')
  );
  assert.strictEqual(waveTwo.length, 5);
  const cited = new Set(extractCardNameCitations(content));
  for (const card of waveTwo) {
    assert.ok(cited.has(card.name), `expected \`${card.name}\` to be cited in the Procedure body`);
  }
});

test('AC4: ends with an explicit declared winner (Section 10)', () => {
  const content = normalizeProse(readDoc());
  assert.ok(/Section\s+10\.1\b/.test(content) && /Section\s+10\.2\b/.test(content));
  assert.ok(/eliminat/i.test(content) && /(wins|winner|game ends)/i.test(content));
});

// ---------------------------------------------------------------------------
// AC5: site/design/playtest-full-game-2.html exists via tools/build-site.js, and the other
// four families of files this unit must not touch are still present.
// ---------------------------------------------------------------------------

test('AC5: site/design/playtest-full-game-2.html exists', () => {
  const sitePath = path.join(__dirname, '..', 'site', 'design', 'playtest-full-game-2.html');
  assert.ok(
    fs.existsSync(sitePath),
    `expected ${sitePath} to exist — run "node tools/build-site.js" after creating the markdown source`
  );
});

test('AC5: design/playtest-full-game.md and design/playtest-spatial.md still exist untouched by this unit', () => {
  // A light in-suite guard (existence + no accidental corruption), not a substitute for the
  // reviewer confirming byte-for-byte-unchanged via `git diff` — same convention already used by
  // test/design-full-game-playtest.test.js's own "sanity" test.
  const untouched = ['playtest-full-game.md', 'playtest-spatial.md'].map((f) =>
    path.join(__dirname, '..', 'design', f)
  );
  for (const p of untouched) {
    assert.ok(fs.existsSync(p), `expected ${p} to still exist`);
    assert.ok(fs.readFileSync(p, 'utf8').length > 0, `expected ${p} to be non-empty`);
  }
});

test('AC5: every design/cards/*.md file still parses (sanity that none was corrupted)', () => {
  const cardsDir = path.join(__dirname, '..', 'design', 'cards');
  const files = fs.readdirSync(cardsDir).filter((f) => f.endsWith('.md'));
  assert.ok(files.length >= 9, `expected at least 9 card-set files, found ${files.length}`);
  for (const f of files) {
    assert.doesNotThrow(() => loadCardsFromFile(path.join(cardsDir, f)), `expected ${f} to still parse`);
  }
});

test('sanity: rules.md still has its full Section 1-15 structure (untouched)', () => {
  const sections = rulesSections();
  for (let n = 1; n <= 15; n++) {
    const idx = findSection(sections, new RegExp(`^${n}\\.\\s+\\S`));
    assert.notStrictEqual(idx, -1, `expected rules.md to still have a top-level Section ${n} heading`);
  }
});

test('sanity: DESIGN-READINESS.md Open Gap 2 language is still present (for the closing note to reference)', () => {
  // normalizeProse collapses line wraps: the quoted phrase spans a wrapped
  // line in the raw file, and a byte-level includes() would only pass if the
  // doc were reflowed — which is exactly the out-of-scope edit the cycle-2
  // review rejected.
  const content = normalizeProse(fs.readFileSync(READINESS_PATH, 'utf8'));
  assert.ok(
    content.includes('each a single walkthrough of one prewritten deck pairing'),
    'expected DESIGN-READINESS.md to still carry the Open Gap 2 language this doc\'s closing note quotes'
  );
});
