#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const CARDS_DIR = path.join(REPO_ROOT, 'design', 'cards');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards');

// ---------------------------------------------------------------------------
// Fount identity table (design/cards/card-anatomy.md, "The Variables")
// ---------------------------------------------------------------------------

const FOUNT_COLORS = {
  Mass: { name: 'ash-grey', hex: '#8a8d93' },
  Bloom: { name: 'green', hex: '#2f9e44' },
  Signal: { name: 'cyan', hex: '#06b6d4' },
  Circuit: { name: 'copper', hex: '#b5651d' },
  Tangle: { name: 'violet', hex: '#7c3aed' },
};

// ---------------------------------------------------------------------------
// Card layout geometry (all fixed constants — the layout never varies)
// ---------------------------------------------------------------------------

const CARD_WIDTH = 750;
const CARD_HEIGHT = 1050;
const FRAME_MARGIN = 24;

const INNER_X = FRAME_MARGIN;
const INNER_Y = FRAME_MARGIN;
const INNER_WIDTH = CARD_WIDTH - 2 * FRAME_MARGIN;
const INNER_HEIGHT = CARD_HEIGHT - 2 * FRAME_MARGIN;

const NAME_SLOT_HEIGHT = 70;
const ART_WINDOW_HEIGHT = 420;
const TYPE_LINE_HEIGHT = 50;

const RULES_BOX_Y = INNER_Y + NAME_SLOT_HEIGHT + ART_WINDOW_HEIGHT + TYPE_LINE_HEIGHT;
const RULES_BOX_HEIGHT = INNER_HEIGHT - NAME_SLOT_HEIGHT - ART_WINDOW_HEIGHT - TYPE_LINE_HEIGHT;

const STATS_CORNER_WIDTH = 220;
const STATS_CORNER_HEIGHT = 90;
const STATS_CORNER_PADDING = 16;

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
function loadCardsFromFile(absPath) {
  const markdown = fs.readFileSync(absPath, 'utf8');
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

function loadAllCards() {
  const files = fs
    .readdirSync(CARDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
  const cards = [];
  for (const file of files) {
    cards.push(...loadCardsFromFile(path.join(CARDS_DIR, file)));
  }
  return cards;
}

// ---------------------------------------------------------------------------
// Cost line parsing ("1 Signal, 1 Circuit" -> ordered cost items)
// ---------------------------------------------------------------------------

function parseCostItems(costLine) {
  return costLine.split(',').map((entry) => {
    const match = entry.trim().match(/^(\d+)\s+(\S+)$/);
    if (!match) {
      throw new Error(`could not parse cost entry "${entry.trim()}" from cost line "${costLine}"`);
    }
    const [, amount, fount] = match;
    if (!FOUNT_COLORS[fount]) {
      throw new Error(`unknown Fount "${fount}" in cost line "${costLine}"`);
    }
    return { amount, fount };
  });
}

// Unique Founts, in order of first appearance in the Cost line — this is the
// order both the frame bands and the cost pips render in.
function orderedFrameFounts(costItems) {
  const seen = [];
  for (const item of costItems) {
    if (!seen.includes(item.fount)) seen.push(item.fount);
  }
  return seen;
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Greedy word-wrap by character count. This is a fixed-width approximation
// (not real font-metrics measurement) — good enough for a deterministic
// placeholder layout where no specific font is guaranteed to be installed.
function wrapText(text, maxChars) {
  if (!text) return [];
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function textBlock({ x, y, lines, fontSize, lineHeight, fill, fontStyle, fontWeight }) {
  if (lines.length === 0) return '';
  const tspans = lines
    .map((line, idx) => `<tspan x="${x}" dy="${idx === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('');
  const style = [
    `font-size="${fontSize}"`,
    fill ? `fill="${fill}"` : '',
    fontStyle ? `font-style="${fontStyle}"` : '',
    fontWeight ? `font-weight="${fontWeight}"` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return `<text x="${x}" y="${y}" font-family="Georgia, 'Times New Roman', serif" ${style}>${tspans}</text>`;
}

// ---------------------------------------------------------------------------
// SVG rendering
// ---------------------------------------------------------------------------

function renderFrameBands(frameFounts) {
  const bandWidth = CARD_WIDTH / frameFounts.length;
  return frameFounts
    .map((fount, idx) => {
      const color = FOUNT_COLORS[fount];
      return `<rect class="frame-band" data-fount="${fount}" data-color="${color.name}" x="${idx * bandWidth}" y="0" width="${bandWidth}" height="${CARD_HEIGHT}" fill="${color.hex}"/>`;
    })
    .join('\n');
}

function renderCostPips(costItems) {
  const pipDiameter = 56;
  const gap = 10;
  const clusterWidth = costItems.length * pipDiameter + (costItems.length - 1) * gap;
  const startX = INNER_X + INNER_WIDTH - 16 - clusterWidth;
  const centerY = INNER_Y + NAME_SLOT_HEIGHT / 2;

  return costItems
    .map((item, idx) => {
      const color = FOUNT_COLORS[item.fount];
      const cx = startX + idx * (pipDiameter + gap) + pipDiameter / 2;
      return [
        `<g class="cost-pip" data-fount="${item.fount}" data-color="${color.name}">`,
        `<circle cx="${cx}" cy="${centerY}" r="${pipDiameter / 2}" fill="${color.hex}" stroke="#14151a" stroke-width="3"/>`,
        `<text x="${cx}" y="${centerY + 8}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-weight="bold" fill="#14151a">${escapeXml(item.amount)}</text>`,
        `</g>`,
      ].join('\n');
    })
    .join('\n');
}

function renderNameSlot(name) {
  return [
    `<rect class="name-slot" x="${INNER_X}" y="${INNER_Y}" width="${INNER_WIDTH}" height="${NAME_SLOT_HEIGHT}" fill="#f5f1e6"/>`,
    textBlock({
      x: INNER_X + 16,
      y: INNER_Y + NAME_SLOT_HEIGHT / 2 + 10,
      lines: [name],
      fontSize: 32,
      lineHeight: 0,
      fill: '#14151a',
      fontWeight: 'bold',
    }),
  ].join('\n');
}

function renderArtWindow() {
  const y = INNER_Y + NAME_SLOT_HEIGHT;
  return [
    `<rect class="art-window" x="${INNER_X}" y="${y}" width="${INNER_WIDTH}" height="${ART_WINDOW_HEIGHT}" fill="#c9ccd3" stroke="#9a9da5" stroke-width="2"/>`,
    `<text x="${INNER_X + INNER_WIDTH / 2}" y="${y + ART_WINDOW_HEIGHT / 2}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#5a5d66">Art Placeholder</text>`,
  ].join('\n');
}

function renderTypeLine(typeLine) {
  const y = INNER_Y + NAME_SLOT_HEIGHT + ART_WINDOW_HEIGHT;
  return [
    `<rect class="type-line" x="${INNER_X}" y="${y}" width="${INNER_WIDTH}" height="${TYPE_LINE_HEIGHT}" fill="#e4dfd0"/>`,
    textBlock({
      x: INNER_X + 16,
      y: y + TYPE_LINE_HEIGHT / 2 + 7,
      lines: [typeLine],
      fontSize: 20,
      lineHeight: 0,
      fill: '#3a3a3f',
    }),
  ].join('\n');
}

function renderRulesTextBox(rulesText, flavorText) {
  const rulesLines = wrapText(rulesText, 46);
  const parts = [
    `<rect class="rules-text-box" x="${INNER_X}" y="${RULES_BOX_Y}" width="${INNER_WIDTH}" height="${RULES_BOX_HEIGHT}" fill="#faf8f2" stroke="#c9ccd3" stroke-width="2"/>`,
    textBlock({
      x: INNER_X + 16,
      y: RULES_BOX_Y + 32,
      lines: rulesLines,
      fontSize: 20,
      lineHeight: 26,
      fill: '#1c1c22',
    }),
  ];
  if (flavorText) {
    const flavorLines = wrapText(flavorText, 46);
    const flavorY = RULES_BOX_Y + 32 + rulesLines.length * 26 + 20;
    parts.push(
      textBlock({
        x: INNER_X + 16,
        y: flavorY,
        lines: flavorLines,
        fontSize: 18,
        lineHeight: 24,
        fill: '#5a5d66',
        fontStyle: 'italic',
      })
    );
  }
  return parts.join('\n');
}

function renderStatsCorner(statsLine) {
  const x = INNER_X + INNER_WIDTH - STATS_CORNER_WIDTH - STATS_CORNER_PADDING;
  const y = RULES_BOX_Y + RULES_BOX_HEIGHT - STATS_CORNER_HEIGHT - STATS_CORNER_PADDING;
  const lines = wrapText(statsLine, 26);
  return [
    `<g class="stats-corner">`,
    `<rect x="${x}" y="${y}" width="${STATS_CORNER_WIDTH}" height="${STATS_CORNER_HEIGHT}" fill="#1f2126" stroke="#f5f1e6" stroke-width="2"/>`,
    textBlock({
      x: x + 12,
      y: y + 24,
      lines,
      fontSize: 16,
      lineHeight: 20,
      fill: '#f5f1e6',
    }),
    `</g>`,
  ].join('\n');
}

function renderCardSvg(card) {
  const costItems = parseCostItems(card.costLine);
  const frameFounts = orderedFrameFounts(costItems);
  const isPermanent = /\bPermanent\b/.test(card.typeLine);
  const hasStatsCorner = isPermanent && Boolean(card.statsLine);

  const layers = [
    renderFrameBands(frameFounts),
    renderNameSlot(card.name),
    renderArtWindow(),
    renderTypeLine(card.typeLine),
    renderRulesTextBox(card.rulesText, card.flavorText),
    renderCostPips(costItems),
  ];
  if (hasStatsCorner) layers.push(renderStatsCorner(card.statsLine));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}">`,
    `<title>${escapeXml(card.name)}</title>`,
    layers.join('\n'),
    '</svg>',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const cards = loadAllCards();

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const usedSlugs = new Set();
  for (const card of cards) {
    const slug = slugify(card.name);
    if (usedSlugs.has(slug)) {
      throw new Error(`duplicate card filename slug "${slug}" from card name "${card.name}"`);
    }
    usedSlugs.add(slug);

    const svg = renderCardSvg(card);
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.svg`), svg, 'utf8');
  }

  console.log(`Rendered ${cards.length} card(s) into ${path.relative(REPO_ROOT, OUT_DIR).split(path.sep).join('/')}/`);
}

main();
