'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');

const LORE_PATH = path.join(__dirname, '..', 'design', 'lore.md');

const SUMMARY_TITLE = 'Summary';
const TIMELINE_TITLE = 'Timeline of Eras';

// ---------------------------------------------------------------------------
// Markdown parsing — design/lore.md "## Summary / ## Timeline of Eras /
// one `##` section per era" convention. The Timeline of Eras list is the
// authoritative source of each era's 1-based `order`, independent of the
// era sections' own order in the file.
// ---------------------------------------------------------------------------

// Splits a markdown file into its `##` (level-2) heading sections, the same
// way lib/parse-race-markdown.js's splitIntoH2Sections does.
function splitIntoH2Sections(markdown) {
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

// Reads the numbered list inside '## Timeline of Eras' ("1. The Weave
// Age", ...) and returns era names in list order.
function extractTimelineOrder(sections) {
  const timelineSection = sections.find((section) => section.title === TIMELINE_TITLE);
  if (!timelineSection) return [];
  const names = [];
  for (const rawLine of timelineSection.lines) {
    const match = rawLine.trim().match(/^\d+\.\s+(.+)$/);
    if (match) names.push(match[1].trim());
  }
  return names;
}

// Joins a section's non-blank lines into a single prose paragraph — the
// same blank-line-delimited convention lib/parse-race-markdown.js's
// extractParagraph uses.
function extractSummary(section) {
  const lines = section.lines.map((line) => line.trim()).filter((line) => line !== '');
  return lines.join(' ').trim();
}

// A `##` section only counts as an era record if it isn't Summary/Timeline
// of Eras itself, and its heading text appears in the Timeline of Eras
// list — that lookup is what fixes the record's `order` field. Records are
// returned sorted by `order` so output order matches Timeline-of-Eras order
// even if a future edit reshuffled the era sections within the file.
function parseLoreMarkdown(markdown) {
  const sections = splitIntoH2Sections(markdown);
  const timelineOrder = extractTimelineOrder(sections);

  const eras = [];
  for (const section of sections) {
    if (section.title === SUMMARY_TITLE || section.title === TIMELINE_TITLE) continue;
    const position = timelineOrder.indexOf(section.title);
    if (position === -1) continue;
    eras.push({
      name: section.title,
      slug: slugify(section.title),
      order: position + 1,
      summary: extractSummary(section),
    });
  }

  eras.sort((a, b) => a.order - b.order);
  return eras;
}

// ---------------------------------------------------------------------------
// Era loading — design/lore.md via parseLoreMarkdown above
// ---------------------------------------------------------------------------

function loadAllEras() {
  const markdown = fs.readFileSync(LORE_PATH, 'utf8');
  return parseLoreMarkdown(markdown);
}

module.exports = {
  parseLoreMarkdown,
  slugify,
  splitIntoH2Sections,
  loadAllEras,
};
