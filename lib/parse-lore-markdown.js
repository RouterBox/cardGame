'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');
const { splitIntoH2Sections, extractParagraph } = require('./markdown-sections');

const LORE_PATH = path.join(__dirname, '..', 'design', 'lore.md');

const SUMMARY_TITLE = 'Summary';
const TIMELINE_TITLE = 'Timeline of Eras';

// ---------------------------------------------------------------------------
// Markdown parsing — design/lore.md "## Summary / ## Timeline of Eras /
// one `##` section per era" convention. The Timeline of Eras list is the
// authoritative source of each era's 1-based `order`, independent of the
// era sections' own order in the file.
// ---------------------------------------------------------------------------

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
      summary: extractParagraph(section) || '',
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
