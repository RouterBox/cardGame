'use strict';

const fs = require('node:fs');
const path = require('node:path');

const STAR_ATLAS_PATH = path.join(__dirname, '..', 'design', 'star-atlas.md');

const HOMEWORLDS_TITLE = 'Homeworlds';
const FRONTIER_TITLE = 'Frontier & Contested Worlds';

// ---------------------------------------------------------------------------
// Markdown parsing — design/star-atlas.md "## Homeworlds / ## Frontier &
// Contested Worlds, each holding `###` per-world sections" convention. One
// file holds all records (unlike lib/parse-race-markdown.js, where one file
// = one record) so, unlike splitIntoH2Sections in that file, each `###`
// section here must remember which `##` section it fell under.
// ---------------------------------------------------------------------------

// Splits a markdown file into its `###` (level-3) heading sections, the same
// way lib/parse-card-markdown.js's splitIntoH3Sections does, but additionally
// tags each section with the text of the nearest preceding `##` (level-2)
// heading, so callers can tell a Homeworlds world from a Frontier one.
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

// "Ashkeel — Homeworld of the Cindral Reach" -> { name: 'Ashkeel', subtitle:
// 'Homeworld of the Cindral Reach' }; "Halvorne Junction" (no em dash) ->
// { name: 'Halvorne Junction', subtitle: null }. Split on the em dash
// (U+2014), the same way lib/parse-character-markdown.js's NAME_TITLE_PATTERN
// splits "Name — Title".
const NAME_SUBTITLE_PATTERN = /^(.+?)\s+—\s+(.+)$/;

function splitNameAndSubtitle(heading) {
  const match = heading.match(NAME_SUBTITLE_PATTERN);
  if (!match) return { name: heading.trim(), subtitle: null };
  return { name: match[1].trim(), subtitle: match[2].trim() };
}

// "Homeworld of the Cindral Reach" -> "Cindral Reach".
const HOMEWORLD_OF_PREFIX = /^Homeworld of the\s+/;

function raceFromSubtitle(subtitle) {
  if (!subtitle) return null;
  return subtitle.replace(HOMEWORLD_OF_PREFIX, '').trim();
}

// Joins a section's non-blank lines into a single prose paragraph — the same
// blank-line-delimited convention lib/parse-race-markdown.js's
// extractParagraph uses for the Identity / Visual Identity sections.
function extractParagraph(lines) {
  const trimmed = lines.map((line) => line.trim()).filter((line) => line !== '');
  const joined = trimmed.join(' ').trim();
  return joined || null;
}

// A `###` section only counts as a world record if it fell under one of the
// two known `##` parents — this is what would exclude any future prose
// subsection from being mistaken for a world, the same way
// parseCardBody/parseCharacterBody gate on required shape elsewhere in this
// repo's lib/ parsers.
function parseStarAtlasMarkdown(markdown) {
  const sections = splitIntoH3SectionsWithParent(markdown);
  const worlds = [];
  for (const section of sections) {
    const isHomeworld = section.parentH2 === HOMEWORLDS_TITLE;
    const isFrontier = section.parentH2 === FRONTIER_TITLE;
    if (!isHomeworld && !isFrontier) continue;

    const { name, subtitle } = splitNameAndSubtitle(section.title);
    worlds.push({
      name,
      slug: slugify(name),
      type: isHomeworld ? 'homeworld' : 'frontier',
      race: isHomeworld ? raceFromSubtitle(subtitle) : null,
      description: extractParagraph(section.lines),
    });
  }
  return worlds;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------------------------------------------------------------------------
// World loading — design/star-atlas.md via parseStarAtlasMarkdown above
// ---------------------------------------------------------------------------

function loadAllWorlds() {
  const markdown = fs.readFileSync(STAR_ATLAS_PATH, 'utf8');
  return parseStarAtlasMarkdown(markdown);
}

module.exports = {
  parseStarAtlasMarkdown,
  slugify,
  splitIntoH3SectionsWithParent,
  loadAllWorlds,
};
