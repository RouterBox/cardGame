'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');
const { splitIntoH2Sections } = require('./markdown-sections');

const CHARACTERS_DIR = path.join(__dirname, '..', 'design', 'characters');
const EXCLUDED_FILES = new Set(['web.md']);

// ---------------------------------------------------------------------------
// Markdown parsing — design/characters/{race}.md "## Name — Title" convention
// ---------------------------------------------------------------------------

// "Mother-Thread Ilvex — First Voice of the Sprawl" -> name / title, split on
// the em dash (U+2014) rather than a hyphen, since names can contain hyphens.
const NAME_TITLE_PATTERN = /^(.+?)\s+—\s+(.+)$/;

function splitNameAndTitle(heading) {
  const match = heading.match(NAME_TITLE_PATTERN);
  if (!match) return null;
  return { name: match[1].trim(), title: match[2].trim() };
}

// A section only counts as a character record if its heading is "Name — Title"
// shaped — this is what excludes web.md's "## Overview" / "## The Cinderglass
// Bargain" thread headings from being mistaken for character records, the
// same way parseCardBody's required-field check excludes prose sections in
// lib/parse-card-markdown.js.
function parseCharacterBody(lines) {
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

  return { bio, threads };
}

function parseCharacterMarkdown(markdown, race) {
  const sections = splitIntoH2Sections(markdown);
  const characters = [];
  for (const section of sections) {
    const heading = splitNameAndTitle(section.title);
    if (!heading) continue;
    const { bio, threads } = parseCharacterBody(section.lines);
    characters.push({
      name: heading.name,
      slug: slugify(heading.name),
      race,
      title: heading.title,
      bio,
      threads,
    });
  }
  return characters;
}

// ---------------------------------------------------------------------------
// Race name derivation — filename basename -> title-cased race name
// ("mireth-bloom.md" -> "Mireth Bloom"), matching test/design-characters.test.js's
// own raceDisplayName helper so both stay in lockstep.
// ---------------------------------------------------------------------------

function raceFromFilename(filename) {
  return filename
    .replace(/\.md$/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ---------------------------------------------------------------------------
// Character loading — design/characters/*.md (excluding web.md) via
// parseCharacterMarkdown above
// ---------------------------------------------------------------------------

function loadCharactersFromFile(absPath) {
  const markdown = fs.readFileSync(absPath, 'utf8');
  const race = raceFromFilename(path.basename(absPath));
  return parseCharacterMarkdown(markdown, race);
}

function loadAllCharacters() {
  const files = fs
    .readdirSync(CHARACTERS_DIR, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && entry.name.endsWith('.md') && !EXCLUDED_FILES.has(entry.name)
    )
    .map((entry) => entry.name)
    .sort();
  const characters = [];
  for (const file of files) {
    characters.push(...loadCharactersFromFile(path.join(CHARACTERS_DIR, file)));
  }
  return characters;
}

module.exports = {
  parseCharacterMarkdown,
  slugify,
  splitIntoH2Sections,
  raceFromFilename,
  loadCharactersFromFile,
  loadAllCharacters,
};
