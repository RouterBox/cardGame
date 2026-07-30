'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');
const { splitIntoH2Sections, extractParagraph } = require('./markdown-sections');

const RACES_DIR = path.join(__dirname, '..', 'design', 'races');

// ---------------------------------------------------------------------------
// Markdown parsing — design/races/{race}.md "H1 name + fixed H2 sections"
// convention: Identity / Strengths & Weaknesses / Signature Hooks / Visual
// Identity. One file = exactly one race record (unlike the card/character
// parsers, which split one file into many `###`/`##` record sections).
// ---------------------------------------------------------------------------

function findSection(sections, titleRegex) {
  return sections.find((section) => titleRegex.test(section.title)) || null;
}

function extractH1(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  for (const line of lines) {
    const heading = line.match(/^#\s+(.+?)\s*$/);
    if (heading) return heading[1].trim();
  }
  return null;
}

const PRIMARY_STRENGTH_PATTERN = /^-\s+\*\*Primary strength:\*\*\s*(.+)$/;
const COMPLEMENTARY_STRENGTHS_PATTERN = /^-\s+\*\*Complementary strengths:\*\*\s*(.+)$/;
const COUNTERING_WEAKNESSES_PATTERN = /^-\s+\*\*Countering weaknesses:\*\*\s*(.+)$/;

function splitCategoryList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractStrengths(section) {
  const result = { primaryStrength: null, complementaryStrengths: [], counteringWeaknesses: [] };
  if (!section) return result;
  for (const rawLine of section.lines) {
    const line = rawLine.trim();
    const primary = line.match(PRIMARY_STRENGTH_PATTERN);
    if (primary) {
      result.primaryStrength = primary[1].trim();
      continue;
    }
    const complementary = line.match(COMPLEMENTARY_STRENGTHS_PATTERN);
    if (complementary) {
      result.complementaryStrengths = splitCategoryList(complementary[1]);
      continue;
    }
    const countering = line.match(COUNTERING_WEAKNESSES_PATTERN);
    if (countering) {
      result.counteringWeaknesses = splitCategoryList(countering[1]);
    }
  }
  return result;
}

// "- **Salvage Doctrine** — destroyed Cindral units leave behind scrap
// tokens..." -> { name: 'Salvage Doctrine', description: 'destroyed...' },
// split on the em dash (U+2014) the same way
// lib/parse-character-markdown.js's NAME_TITLE_PATTERN splits "Name — Title".
const SIGNATURE_HOOK_PATTERN = /^-\s+\*\*(.+?)\*\*\s+—\s+(.+)$/;

function extractSignatureHooks(section) {
  if (!section) return [];
  const hooks = [];
  for (const rawLine of section.lines) {
    const match = rawLine.trim().match(SIGNATURE_HOOK_PATTERN);
    if (match) {
      hooks.push({ name: match[1].trim(), description: match[2].trim() });
    }
  }
  return hooks;
}

// A file only produces a record if it has an H1 name — this is the same
// required-field gate parseCardMarkdown/parseCharacterMarkdown use to skip
// non-record content, applied here even though every current design/races/
// file does carry an H1.
function parseRaceMarkdown(markdown) {
  const name = extractH1(markdown);
  if (!name) return null;

  const sections = splitIntoH2Sections(markdown);
  const identitySection = findSection(sections, /^identity$/i);
  const strengthsSection = findSection(sections, /^strengths\s*&\s*weaknesses$/i);
  const hooksSection = findSection(sections, /^signature hooks$/i);
  const visualSection = findSection(sections, /^visual identity$/i);

  const { primaryStrength, complementaryStrengths, counteringWeaknesses } =
    extractStrengths(strengthsSection);

  return {
    name,
    slug: slugify(name),
    identity: extractParagraph(identitySection),
    primaryStrength,
    complementaryStrengths,
    counteringWeaknesses,
    signatureHooks: extractSignatureHooks(hooksSection),
    visualIdentity: extractParagraph(visualSection),
  };
}

// ---------------------------------------------------------------------------
// Race loading — design/races/*.md via parseRaceMarkdown above
// ---------------------------------------------------------------------------

function loadRaceFromFile(absPath) {
  const markdown = fs.readFileSync(absPath, 'utf8');
  return parseRaceMarkdown(markdown);
}

function loadAllRaces() {
  const files = fs
    .readdirSync(RACES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
  const races = [];
  for (const file of files) {
    const race = loadRaceFromFile(path.join(RACES_DIR, file));
    if (race) races.push(race);
  }
  return races;
}

module.exports = {
  parseRaceMarkdown,
  slugify,
  splitIntoH2Sections,
  loadRaceFromFile,
  loadAllRaces,
};
