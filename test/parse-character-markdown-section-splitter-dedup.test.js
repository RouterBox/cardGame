'use strict';

// Verifies AC1/AC2/AC3 for lib/parse-character-markdown.js: it must import
// splitIntoH2Sections from lib/markdown-sections.js instead of hand-rolling
// its own copy (mirroring test/markdown-section-parser-dedup.test.js's
// approach for the four other parsers), while every other function and the
// module.exports list stay exactly as they were. Also verifies AC4: with
// only the section-splitter's *source* swapped for an import (not its
// behavior), loadAllCharacters() must still return the same records an
// independent, from-scratch markdown parse would produce.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const LIB_DIR = path.join(__dirname, '..', 'lib');
const CHAR_LIB_PATH = path.join(LIB_DIR, 'parse-character-markdown.js');
const MARKDOWN_SECTIONS_PATH = path.join(LIB_DIR, 'markdown-sections.js');
const CHARACTERS_DIR = path.join(__dirname, '..', 'design', 'characters');
const EXCLUDED_FILES = new Set(['web.md']);

function readSource(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// ---------------------------------------------------------------------------
// AC1: no local declaration of splitIntoH2Sections remains in the file.
// ---------------------------------------------------------------------------

test('AC1: lib/parse-character-markdown.js no longer declares its own splitIntoH2Sections', () => {
  const source = readSource(CHAR_LIB_PATH);
  assert.doesNotMatch(
    source,
    /function\s+splitIntoH2Sections\s*\(/,
    'lib/parse-character-markdown.js should not declare its own splitIntoH2Sections'
  );
});

// ---------------------------------------------------------------------------
// AC2: the exported splitIntoH2Sections is the exact function object
// imported from lib/markdown-sections.js, not a separately-declared copy.
// ---------------------------------------------------------------------------

test('AC2: lib/parse-character-markdown.js re-exports the exact splitIntoH2Sections imported from lib/markdown-sections.js', () => {
  const shared = require(MARKDOWN_SECTIONS_PATH);
  const character = require(CHAR_LIB_PATH);

  assert.strictEqual(typeof shared.splitIntoH2Sections, 'function');
  assert.strictEqual(
    character.splitIntoH2Sections,
    shared.splitIntoH2Sections,
    'parse-character-markdown.js should re-export the exact splitIntoH2Sections function imported from lib/markdown-sections.js, not a locally declared copy'
  );

  const importsMarkdownSections = /require\(\s*['"]\.\/markdown-sections['"]\s*\)/.test(
    readSource(CHAR_LIB_PATH)
  );
  assert.ok(importsMarkdownSections, "expected lib/parse-character-markdown.js to require('./markdown-sections')");

  const destructuresSplitIntoH2Sections =
    /\{[^}]*\bsplitIntoH2Sections\b[^}]*\}\s*=\s*require\(\s*['"]\.\/markdown-sections['"]\s*\)/.test(
      readSource(CHAR_LIB_PATH)
    );
  assert.ok(
    destructuresSplitIntoH2Sections,
    "expected lib/parse-character-markdown.js to destructure splitIntoH2Sections from require('./markdown-sections')"
  );
});

// ---------------------------------------------------------------------------
// AC3 (held-out): every other function and the module.exports list are
// unchanged. We can't diff against a stored "before" snapshot, so this
// mechanically checks (a) every function this unit was told not to touch
// still has its original signature in the source, and (b) the module still
// exports exactly the same six names, all still functions.
// ---------------------------------------------------------------------------

test('AC3: the other functions in lib/parse-character-markdown.js keep their original signatures', () => {
  const source = readSource(CHAR_LIB_PATH);
  const expectedSignatures = [
    'function splitNameAndTitle(heading) {',
    'function parseCharacterBody(lines) {',
    'function parseCharacterMarkdown(markdown, race) {',
    'function raceFromFilename(filename) {',
    'function loadCharactersFromFile(absPath) {',
    'function loadAllCharacters() {',
  ];
  for (const signature of expectedSignatures) {
    assert.ok(
      source.includes(signature),
      `expected lib/parse-character-markdown.js to still contain "${signature}" unchanged`
    );
  }
});

test('AC3: module.exports still lists exactly the same six names, all functions', () => {
  const character = require(CHAR_LIB_PATH);
  const expectedExportNames = [
    'parseCharacterMarkdown',
    'slugify',
    'splitIntoH2Sections',
    'raceFromFilename',
    'loadCharactersFromFile',
    'loadAllCharacters',
  ];
  assert.deepStrictEqual(
    Object.keys(character).sort(),
    [...expectedExportNames].sort(),
    'expected module.exports to list exactly the same six names as before'
  );
  for (const name of expectedExportNames) {
    assert.strictEqual(typeof character[name], 'function', `expected export "${name}" to be a function`);
  }
});

// ---------------------------------------------------------------------------
// AC4: loadAllCharacters() still returns the same records as an independent,
// from-scratch parse of design/characters/*.md (name/slug/race/title/bio/
// threads). This is written without calling any function under test, so it
// can't pass merely because both sides share a bug.
// ---------------------------------------------------------------------------

function independentSplitIntoH2Sections(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 2) {
        current = { title: heading[2].trim(), lines: [] };
        sections.push(current);
      } else {
        current = null;
      }
      continue;
    }
    if (current) current.lines.push(line);
  }
  return sections;
}

function independentSlugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function independentRaceFromFilename(filename) {
  return filename
    .replace(/\.md$/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function independentParseCharacters(markdown, race) {
  const sections = independentSplitIntoH2Sections(markdown);
  const characters = [];
  for (const section of sections) {
    const match = section.title.match(/^(.+?)\s+—\s+(.+)$/);
    if (!match) continue;
    const name = match[1].trim();
    const title = match[2].trim();

    const lines = section.lines;
    let cursor = 0;
    while (cursor < lines.length && lines[cursor].trim() === '') cursor++;
    const bioLines = [];
    while (cursor < lines.length && lines[cursor].trim() !== '') {
      bioLines.push(lines[cursor].trim());
      cursor++;
    }
    const bio = bioLines.join(' ').trim();

    while (cursor < lines.length && lines[cursor].trim() === '') cursor++;
    const threads = [];
    if (cursor < lines.length && lines[cursor].trim() === '**Threads:**') {
      cursor++;
      while (cursor < lines.length) {
        const line = lines[cursor].trim();
        if (line === '') {
          cursor++;
          continue;
        }
        const bullet = line.match(/^-\s+(.+)$/);
        if (!bullet) break;
        threads.push(bullet[1].trim());
        cursor++;
      }
    }

    characters.push({ name, slug: independentSlugify(name), race, title, bio, threads });
  }
  return characters;
}

test('AC4: loadAllCharacters() matches an independent from-scratch parse of design/characters/*.md', () => {
  const { loadAllCharacters } = require(CHAR_LIB_PATH);

  const files = fs
    .readdirSync(CHARACTERS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && !EXCLUDED_FILES.has(entry.name))
    .map((entry) => entry.name)
    .sort();
  assert.ok(files.length > 0, 'expected at least one design/characters/*.md file to check against');

  const expected = [];
  for (const file of files) {
    const markdown = fs.readFileSync(path.join(CHARACTERS_DIR, file), 'utf8');
    const race = independentRaceFromFilename(file);
    expected.push(...independentParseCharacters(markdown, race));
  }

  const actual = loadAllCharacters();
  assert.deepStrictEqual(
    actual,
    expected,
    'expected loadAllCharacters() to match an independently-parsed reading of design/characters/*.md'
  );
});
