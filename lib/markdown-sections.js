'use strict';

// ---------------------------------------------------------------------------
// Shared low-level markdown-section helpers used by lib/parse-race-markdown.js,
// lib/parse-lore-markdown.js, lib/parse-star-atlas-markdown.js, and
// lib/parse-founts-markdown.js. Moved here verbatim from those four files —
// no behavior change.
// ---------------------------------------------------------------------------

// Splits a markdown file into its `##` (level-2) heading sections. Any
// heading that isn't level-2 (H1, H3, ...) resets the current section, so
// lines under a non-H2 heading are dropped until the next H2 heading.
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

// Splits a markdown file into its `###` (level-3) heading sections, tagging
// each with the text of the nearest preceding `##` (level-2) heading (or
// `null` if none preceded it) so callers can tell which H2 group a record
// fell under.
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

// Joins a section's non-blank lines into a single prose paragraph: trims
// each line, drops blank ones, and joins what's left with a single space.
// Returns null for a null section or a section with no non-blank lines.
function extractParagraph(section) {
  if (!section) return null;
  const lines = section.lines.map((line) => line.trim()).filter((line) => line !== '');
  const joined = lines.join(' ').trim();
  return joined || null;
}

module.exports = { splitIntoH2Sections, splitIntoH3SectionsWithParent, extractParagraph };
