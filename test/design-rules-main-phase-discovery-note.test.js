'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection, normalizeProse } = require('./helpers/markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const RAW_NOTE = '//discovering new planets, and creating new wormholes goes in this phase.';

function readRules() {
  return fs.readFileSync(RULES_PATH, 'utf8');
}

function rulesSections() {
  return parseSections(readRules());
}

function mainPhaseBody() {
  return sectionText(rulesSections(), /^5\.3\s+main phase/i);
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md no longer contains any line reading exactly
// '//discovering new planets, and creating new wormholes goes in this phase.'
// anywhere in the file.
// ---------------------------------------------------------------------------

test('AC1: design/rules.md contains no line reading exactly the raw Main Phase discovery/wormhole dev note', () => {
  const lines = readRules().split(/\r?\n/);
  const offenders = lines
    .map((line, i) => ({ n: i + 1, line }))
    .filter(({ line }) => line.trim() === RAW_NOTE);
  assert.deepStrictEqual(
    offenders,
    [],
    `expected zero lines reading exactly "${RAW_NOTE}", found at line(s): ${offenders.map((o) => o.n).join(', ')}`
  );
});

test('AC1: design/rules.md contains no raw "//" comment-marker line anywhere', () => {
  const lines = readRules().split(/\r?\n/);
  const offenders = [];
  lines.forEach((line, i) => {
    if (/^\s*\/\//.test(line)) offenders.push(`${i + 1}: ${line.trim().slice(0, 80)}`);
  });
  assert.deepStrictEqual(
    offenders,
    [],
    `expected no raw // comment lines in design/rules.md, found:\n${offenders.join('\n')}`
  );
});

// ---------------------------------------------------------------------------
// AC2: Section 5.3 (Main Phase)'s prose explicitly states, in a full
// sentence (not a comment), that the Discovery action creates new Planets
// and/or Wormholes on the battlefield graph, and cross-references Section
// 8.3.
// ---------------------------------------------------------------------------

test('AC2: Section 5.3 (Main Phase) exists with a non-empty body', () => {
  const idx = findSection(rulesSections(), /^5\.3\s+main phase/i);
  assert.notStrictEqual(idx, -1, 'expected a "5.3 Main Phase" heading');
  const body = mainPhaseBody();
  assert.ok(body && body.trim().length > 0, 'expected Section 5.3 to have body content');
});

test('AC2: Section 5.3 states in prose that Discovery creates a new Planet and/or a new Wormhole on the battlefield graph', () => {
  const body = normalizeProse(mainPhaseBody() || '');
  assert.ok(/\bDiscovery\b/.test(body), 'expected Section 5.3 to mention Discovery');
  assert.ok(
    /Discovery[^.]*\b(Planet|Wormhole)\b/i.test(body),
    'expected a single sentence linking Discovery to adding a Planet or Wormhole'
  );
  assert.ok(/new Planet/i.test(body), 'expected Section 5.3 to state Discovery can add a new Planet');
  assert.ok(/new Wormhole/i.test(body), 'expected Section 5.3 to state Discovery opens a new Wormhole');
});

test('AC2: Section 5.3 cross-references Section 8.3 in prose, not a "//" comment', () => {
  const rawBody = mainPhaseBody() || '';
  const body = normalizeProse(rawBody);
  assert.ok(/Section 8\.3/.test(body), 'expected Section 5.3 to cross-reference "Section 8.3"');
  const lines = rawBody.split(/\r?\n/).filter((l) => l.trim().length > 0);
  assert.ok(
    lines.every((l) => !/^\s*\/\//.test(l)),
    'expected Section 5.3 to contain no raw "//" comment lines'
  );
});

// ---------------------------------------------------------------------------
// AC3: every other existing note/passage in design/rules.md remains present,
// word-for-word unchanged, and no section other than 5.3 is modified.
// ---------------------------------------------------------------------------

test('AC3: Section 5.2 (Generation Phase) still cross-references Section 4.7 (Graph-Driven Generation), unchanged by this unit', () => {
  const body = normalizeProse(sectionText(rulesSections(), /^5\.2\s+generation phase/i) || '');
  assert.ok(
    /Section 4\.7 \(Graph-Driven Generation\)/.test(body),
    'expected Section 5.2 to still cross-reference Section 4.7 (Graph-Driven Generation)'
  );
});

test('AC3: Section 5.4 (Conflict Phase) still defines Movement/attacker/blocker rules, unchanged by this unit', () => {
  const body = normalizeProse(sectionText(rulesSections(), /^5\.4\s+conflict phase/i) || '');
  assert.ok(/Movement action/.test(body), 'expected Section 5.4 to still define a Movement action');
  assert.ok(/declaring attackers/i.test(body), 'expected Section 5.4 to still cover declaring attackers');
});

test('AC3: Section 8 (Spatial Battlefield) still carries its own unresolved-question prose, unchanged by this unit', () => {
  const body = normalizeProse(sectionText(rulesSections(), /^8\.\s+spatial battlefield/i) || '');
  assert.ok(
    /is an open question this section does not resolve/i.test(body),
    'expected Section 8.4 to still carry its unresolved Restriction-and-movement open question'
  );
  assert.ok(
    /This deployment freedom is provisional/i.test(body),
    'expected Section 8.1 to still carry its provisional-deployment note'
  );
});

test('AC3: no section anywhere in design/rules.md still contains the raw Main Phase discovery/wormhole dev-note fragment', () => {
  const rawFragment = 'discovering new planets, and creating new wormholes goes in this phase';
  assert.ok(
    !readRules().includes(rawFragment),
    'expected the raw dev-note fragment to be gone from the whole document'
  );
});
