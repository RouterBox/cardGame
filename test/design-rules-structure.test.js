'use strict';
// Mechanical safety net for design/rules.md's structure (unit
// cardgame-rules-structure-integrity-check, authored directly by the
// orchestrator: a purely diagnostic test-only unit has no RED state for the
// bolt to verify, so it cannot flow through the pipeline).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const rulesText = fs.readFileSync(RULES_PATH, 'utf8');
const lines = rulesText.split(/\r?\n/);

// Top-level sections: "## N. Title". Subsections: "### N.M Title".
const topSections = [];
const subSections = [];
for (const line of lines) {
  let m = line.match(/^## (\d+)\. /);
  if (m) topSections.push(Number(m[1]));
  m = line.match(/^### (\d+)\.(\d+) /);
  if (m) subSections.push({ major: Number(m[1]), minor: Number(m[2]) });
}

test('AC1: top-level section numbers run strictly sequentially from 1 with no gaps or duplicates', () => {
  assert.ok(topSections.length > 0, 'expected at least one "## N. " section heading');
  for (let i = 0; i < topSections.length; i++) {
    assert.strictEqual(
      topSections[i],
      i + 1,
      `expected section ${i + 1} at position ${i + 1}, found ${topSections[i]} — sequence so far: [${topSections.join(', ')}]`
    );
  }
});

test('AC2: decimal subsections strictly increase within their parent section and nest under it', () => {
  const seenMajors = new Set(topSections);
  let prev = null;
  for (const sub of subSections) {
    assert.ok(
      seenMajors.has(sub.major),
      `subsection ${sub.major}.${sub.minor} has no parent "## ${sub.major}. " section`
    );
    if (prev && prev.major === sub.major) {
      assert.ok(
        sub.minor > prev.minor,
        `subsection ${sub.major}.${sub.minor} does not increase after ${prev.major}.${prev.minor}`
      );
    }
    prev = sub;
  }
});

test('AC3: no line begins with a raw // review-note marker', () => {
  const offenders = [];
  lines.forEach((line, i) => {
    if (/^\s*\/\//.test(line)) offenders.push(`${i + 1}: ${line.trim().slice(0, 60)}`);
  });
  assert.deepStrictEqual(
    offenders,
    [],
    `expected zero raw // note lines in design/rules.md — unresolved design notes belong in ideas-inbox.md or a chartered unit:\n${offenders.join('\n')}`
  );
});
