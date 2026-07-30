'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');
const { splitIntoH3SectionsWithParent, extractParagraph } = require('./markdown-sections');

const STAR_ATLAS_PATH = path.join(__dirname, '..', 'design', 'star-atlas.md');

const HOMEWORLDS_TITLE = 'Homeworlds';
const FRONTIER_TITLE = 'Frontier & Contested Worlds';

// ---------------------------------------------------------------------------
// Markdown parsing — design/star-atlas.md "## Homeworlds / ## Frontier &
// Contested Worlds, each holding `###` per-world sections" convention. One
// file holds all records (unlike lib/parse-race-markdown.js, where one file
// = one record) so, unlike splitIntoH2Sections, each `###` section here must
// remember which `##` section it fell under.
// ---------------------------------------------------------------------------

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
      description: extractParagraph(section),
    });
  }
  return worlds;
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
