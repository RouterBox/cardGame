'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');

const WORLD_PATH = path.join(__dirname, '..', 'design', 'world.md');

const FOUNTS_SECTION_TITLE = 'Cosmology: The Five Founts';

// ---------------------------------------------------------------------------
// Markdown parsing — design/world.md's single "## Cosmology: The Five
// Founts" section holding one `###` per Fount. Mirrors
// lib/parse-star-atlas-markdown.js's splitIntoH3SectionsWithParent, since
// one file holds all records and each `###` section must remember which
// `##` section it fell under.
// ---------------------------------------------------------------------------

function splitIntoH3SectionsWithParent(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let currentH2 = null;
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 2) {
        currentH2 = heading[2].trim();
        current = null;
      } else if (level === 3) {
        current = { title: heading[2].trim(), parentH2: currentH2, lines: [] };
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

// "The Mass — materials" -> { name: 'The Mass', domain: 'materials' }. Split
// on the em dash (U+2014), the same way
// lib/parse-star-atlas-markdown.js's splitNameAndSubtitle does.
const NAME_DOMAIN_PATTERN = /^(.+?)\s+—\s+(.+)$/;

function splitNameAndDomain(heading) {
  const match = heading.match(NAME_DOMAIN_PATTERN);
  if (!match) return { name: heading.trim(), domain: null };
  return { name: match[1].trim(), domain: match[2].trim() };
}

// Joins a section's non-blank lines into a single prose paragraph — the
// same blank-line-delimited convention lib/parse-race-markdown.js's
// extractParagraph uses.
function extractParagraph(lines) {
  const trimmed = lines.map((line) => line.trim()).filter((line) => line !== '');
  const joined = trimmed.join(' ').trim();
  return joined || null;
}

// A `###` section only counts as a Fount record if it fell directly under
// '## Cosmology: The Five Founts' — this is what excludes 'The Setting' and
// 'A History in Brief' (free-form narrative prose, explicitly out of scope
// per the unit spec) from being mistaken for Fount records.
function parseFountsMarkdown(markdown) {
  const sections = splitIntoH3SectionsWithParent(markdown);
  const founts = [];
  for (const section of sections) {
    if (section.parentH2 !== FOUNTS_SECTION_TITLE) continue;
    const { name, domain } = splitNameAndDomain(section.title);
    founts.push({
      name,
      slug: slugify(name),
      domain,
      description: extractParagraph(section.lines),
    });
  }
  return founts;
}

// ---------------------------------------------------------------------------
// Fount loading — design/world.md via parseFountsMarkdown above
// ---------------------------------------------------------------------------

function loadAllFounts() {
  const markdown = fs.readFileSync(WORLD_PATH, 'utf8');
  return parseFountsMarkdown(markdown);
}

module.exports = {
  parseFountsMarkdown,
  slugify,
  splitIntoH3SectionsWithParent,
  loadAllFounts,
};
