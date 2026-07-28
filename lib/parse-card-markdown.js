'use strict';

// ---------------------------------------------------------------------------
// Markdown parsing — design/cards/*.md field-prefix convention
// ---------------------------------------------------------------------------

const FIELD_PREFIXES = ['Cost line:', 'Type line:', 'Rules text:', 'Stats/counters line:'];

function isFieldStart(line) {
  return FIELD_PREFIXES.some((prefix) => line.startsWith(prefix));
}

// `cursor` is a { value: number } box so the shared read position advances
// across sequential calls without every caller re-threading an index.
function consumeField(lines, cursor, prefix) {
  if (cursor.value >= lines.length || !lines[cursor.value].startsWith(prefix)) return null;
  const parts = [lines[cursor.value].slice(prefix.length).trim()];
  cursor.value++;
  while (
    cursor.value < lines.length &&
    lines[cursor.value].trim() !== '' &&
    !isFieldStart(lines[cursor.value])
  ) {
    parts.push(lines[cursor.value].trim());
    cursor.value++;
  }
  return parts.join(' ').trim();
}

function parseCardBody(lines) {
  const cursor = { value: 0 };
  while (cursor.value < lines.length && lines[cursor.value].trim() === '') cursor.value++;

  const costLine = consumeField(lines, cursor, 'Cost line:');
  const typeLine = consumeField(lines, cursor, 'Type line:');
  const rulesText = consumeField(lines, cursor, 'Rules text:');
  const statsLine = consumeField(lines, cursor, 'Stats/counters line:');

  while (cursor.value < lines.length && lines[cursor.value].trim() === '') cursor.value++;
  const flavorLines = [];
  while (cursor.value < lines.length && lines[cursor.value].trim() !== '') {
    flavorLines.push(lines[cursor.value].trim());
    cursor.value++;
  }
  let flavorText = flavorLines.join(' ').trim();
  if (flavorText.startsWith('*')) flavorText = flavorText.slice(1);
  if (flavorText.endsWith('*')) flavorText = flavorText.slice(0, -1);
  flavorText = flavorText.trim();

  return { costLine, typeLine, rulesText, statsLine, flavorText: flavorText || null };
}

// Splits a markdown file into its `###` (level-3) heading sections. Only
// level-3 sections are candidate card records — this matches the convention
// already used by design/cards/alpha-set.md.
function splitIntoH3Sections(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 3) {
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

// A level-3 section only counts as a card record if it actually carries the
// three required fields — this is what keeps card-anatomy.md's prose-style
// "### Worked Example: ..." sections from being mistaken for cards (their
// body text mentions "Cost line" mid-sentence, never as a line-start field).
function parseCardMarkdown(markdown) {
  const sections = splitIntoH3Sections(markdown);
  const cards = [];
  for (const section of sections) {
    const fields = parseCardBody(section.lines);
    if (fields.costLine && fields.typeLine && fields.rulesText) {
      cards.push({ name: section.title, ...fields });
    }
  }
  return cards;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = { parseCardMarkdown, slugify };
