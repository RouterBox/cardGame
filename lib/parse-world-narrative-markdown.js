'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');
const { splitIntoH2Sections, extractParagraph } = require('./markdown-sections');

const WORLD_PATH = path.join(__dirname, '..', 'design', 'world.md');

// The two free-form narrative H2 sections in design/world.md, in the order
// their records must be returned. 'Cosmology: The Five Founts' is
// deliberately absent from this list — that section stays
// lib/parse-founts-markdown.js's own territory, never re-parsed here.
const NARRATIVE_SECTION_TITLES = ['The Setting', 'A History in Brief'];

// ---------------------------------------------------------------------------
// Markdown parsing — design/world.md's named H2 narrative sections, found by
// exact title match via lib/markdown-sections.js's splitIntoH2Sections, with
// each section's body built by extractParagraph exactly as
// lib/parse-founts-markdown.js does for a Fount's description.
// ---------------------------------------------------------------------------

function parseWorldNarrativeMarkdown(markdown) {
  const sections = splitIntoH2Sections(markdown);
  const records = [];
  for (const title of NARRATIVE_SECTION_TITLES) {
    const section = sections.find((candidate) => candidate.title === title);
    if (!section) continue;
    records.push({
      title: section.title,
      slug: slugify(section.title),
      body: extractParagraph(section),
    });
  }
  return records;
}

// ---------------------------------------------------------------------------
// World narrative loading — design/world.md via parseWorldNarrativeMarkdown
// ---------------------------------------------------------------------------

function loadWorldNarrativeSections() {
  const markdown = fs.readFileSync(WORLD_PATH, 'utf8');
  return parseWorldNarrativeMarkdown(markdown);
}

module.exports = {
  parseWorldNarrativeMarkdown,
  slugify,
  splitIntoH2Sections,
  loadWorldNarrativeSections,
};
