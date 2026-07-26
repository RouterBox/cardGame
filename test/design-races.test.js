'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText } = require('./helpers/markdown');

const RACES_DIR = path.join(__dirname, '..', 'design', 'races');
const CATEGORIES = ['Materials', 'Biology', 'Intelligence', 'Technology', 'Magic'];

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function listRaceFiles() {
  if (!fs.existsSync(RACES_DIR)) return [];
  return fs.readdirSync(RACES_DIR).filter((f) => f.endsWith('.md')).sort();
}

function extractStrengths(content) {
  const primary = content.match(/Primary strength:?\**\s*([A-Za-z]+)/i);
  const complementary = content.match(/Complementary strengths?:?\**\s*([A-Za-z, ]+)/i);
  const countering = content.match(/Countering weaknesses?:?\**\s*([A-Za-z, ]+)/i);
  const splitList = (m) => (m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : []);
  return {
    primary: primary ? primary[1].trim() : null,
    complementary: splitList(complementary),
    countering: splitList(countering),
  };
}

function extractHooks(content) {
  const sections = parseSections(content);
  const body = sectionText(sections, /signature hooks/i);
  if (!body) return [];
  return body.split(/\r?\n/).filter((line) => /^\s*-\s+\S/.test(line));
}

// The set of race files to iterate over is resolved once, at module load
// (fresh per test run). If design/races/ doesn't exist yet, this is empty
// and a single placeholder entry is used so per-file tests still run and fail.
const raceFiles = listRaceFiles();
const filesToCheck = raceFiles.length ? raceFiles : ['<no race files found under design/races/>'];

test('AC2: design/races/ exists and contains exactly five race files', () => {
  assert.ok(fs.existsSync(RACES_DIR), `expected ${RACES_DIR} to exist`);
  assert.strictEqual(
    raceFiles.length,
    5,
    `expected exactly 5 files under design/races/, found ${raceFiles.length}: ${raceFiles.join(', ')}`
  );
});

for (const file of filesToCheck) {
  const filePath = path.join(RACES_DIR, file);

  test(`AC2: ${file} has an identity paragraph`, () => {
    const content = fs.readFileSync(filePath, 'utf8');
    const sections = parseSections(content);
    const identity = sectionText(sections, /identity/i);
    assert.ok(identity, `expected an Identity section in ${file}`);
    assert.ok(
      identity.replace(/\s+/g, ' ').trim().length > 150,
      `expected a substantive one-paragraph identity in ${file}`
    );
  });

  test(`AC2: ${file} declares one primary strength, two complementary strengths, two countering weaknesses`, () => {
    const content = fs.readFileSync(filePath, 'utf8');
    const { primary, complementary, countering } = extractStrengths(content);

    assert.ok(
      primary && CATEGORIES.includes(capitalize(primary)),
      `expected a primary strength drawn from ${CATEGORIES.join('/')} in ${file}, got "${primary}"`
    );
    assert.strictEqual(
      complementary.length,
      2,
      `expected exactly 2 complementary strengths in ${file}, got [${complementary.join(', ')}]`
    );
    assert.strictEqual(
      countering.length,
      2,
      `expected exactly 2 countering weaknesses in ${file}, got [${countering.join(', ')}]`
    );
    for (const cat of complementary.concat(countering)) {
      assert.ok(
        CATEGORIES.includes(capitalize(cat)),
        `expected "${cat}" in ${file} to be one of ${CATEGORIES.join('/')}`
      );
    }
  });

  test(`AC3: ${file} does not repeat a category across primary/complementary/countering`, () => {
    const content = fs.readFileSync(filePath, 'utf8');
    const { primary, complementary, countering } = extractStrengths(content);
    const all = [primary, ...complementary, ...countering].filter(Boolean).map(capitalize);
    const unique = new Set(all);
    assert.strictEqual(unique.size, all.length, `expected no repeated categories in ${file}, got [${all.join(', ')}]`);
  });

  test(`AC4: ${file} has 3-5 signature hooks`, () => {
    const content = fs.readFileSync(filePath, 'utf8');
    const hooks = extractHooks(content);
    assert.ok(
      hooks.length >= 3 && hooks.length <= 5,
      `expected 3-5 signature hooks in ${file}, found ${hooks.length}`
    );
  });

  test(`AC4: ${file} has a visual-identity paragraph`, () => {
    const content = fs.readFileSync(filePath, 'utf8');
    const sections = parseSections(content);
    const visual = sectionText(sections, /visual identity/i);
    assert.ok(visual, `expected a Visual Identity section in ${file}`);
    assert.ok(
      visual.replace(/\s+/g, ' ').trim().length > 100,
      `expected a substantive visual-identity paragraph in ${file}`
    );
  });
}

test('AC3: each of the five categories is a primary strength exactly once across all race files', () => {
  assert.strictEqual(raceFiles.length, 5, 'need exactly 5 race files to check AC3 (see AC2 failure above)');
  const primaries = raceFiles.map((file) => {
    const content = fs.readFileSync(path.join(RACES_DIR, file), 'utf8');
    return capitalize(extractStrengths(content).primary);
  });
  for (const category of CATEGORIES) {
    const count = primaries.filter((p) => p === category).length;
    assert.strictEqual(
      count,
      1,
      `expected "${category}" to be a primary strength exactly once, found ${count} times (primaries: ${primaries.join(', ')})`
    );
  }
});
