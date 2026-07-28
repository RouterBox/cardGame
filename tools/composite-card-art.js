#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {
  INNER_X,
  INNER_Y,
  INNER_WIDTH,
  NAME_SLOT_HEIGHT,
  ART_WINDOW_HEIGHT,
  loadAllCards,
  renderCardSvg,
  escapeXml,
} = require('./render-card');
const { slugify, splitIntoH3Sections } = require('../lib/parse-card-markdown');

const REPO_ROOT = path.join(__dirname, '..');
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');

// ---------------------------------------------------------------------------
// Art Window bounds — inherited from tools/render-card.js's own geometry so
// this never duplicates (and can't drift from) the numbers the layout engine
// actually draws the placeholder rect with.
// ---------------------------------------------------------------------------

const ART_WINDOW_X = INNER_X;
const ART_WINDOW_Y = INNER_Y + NAME_SLOT_HEIGHT;
const ART_WINDOW_WIDTH = INNER_WIDTH;

// ---------------------------------------------------------------------------
// Brief loading — design/cards/art-briefs.md, one brief per "###" section
// ---------------------------------------------------------------------------

function loadBriefs() {
  const markdown = fs.readFileSync(BRIEFS_PATH, 'utf8');
  return splitIntoH3Sections(markdown).map((section) => ({
    cardName: section.title,
    text: section.lines.join('\n').trim(),
  }));
}

// ---------------------------------------------------------------------------
// Injectable art-generation client.
//
// generateArt({ cardName, brief }) -> Promise<{ href: string }>
//
// The default client is a deterministic mock: `href` is a data: URI built
// from a SHA-256 hash of the card name + brief text, so it never changes
// between runs, never touches the network, and never needs a Leonardo API
// key. A real Leonardo-backed client is a separate, later decision — pass a
// different client into main() to use one.
// ---------------------------------------------------------------------------

function mockArtSvg({ cardName, brief }) {
  const hash = crypto.createHash('sha256').update(`${cardName}\n${brief}`, 'utf8').digest('hex');
  const hue = parseInt(hash.slice(0, 6), 16) % 360;
  const color = `hsl(${hue}, 45%, 55%)`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ART_WINDOW_WIDTH}" height="${ART_WINDOW_HEIGHT}">`,
    `<rect width="100%" height="100%" fill="${color}"/>`,
    `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#14151a">${escapeXml(cardName)}</text>`,
    `</svg>`,
  ].join('');
}

function createMockLeonardoClient() {
  return {
    async generateArt({ cardName, brief }) {
      const svg = mockArtSvg({ cardName, brief });
      const href = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
      return { href };
    },
  };
}

// ---------------------------------------------------------------------------
// Compositing — swap the Art Window placeholder rect+label for an <image>
// ---------------------------------------------------------------------------

const ART_WINDOW_PLACEHOLDER_RE = /<rect class="art-window"[^>]*\/>\n<text[^>]*>Art Placeholder<\/text>/;

function compositeArtWindow(baseSvg, href) {
  if (!ART_WINDOW_PLACEHOLDER_RE.test(baseSvg)) {
    throw new Error('could not find the Art Window placeholder block in the rendered card SVG');
  }
  const imageTag =
    `<image class="art-window" x="${ART_WINDOW_X}" y="${ART_WINDOW_Y}" width="${ART_WINDOW_WIDTH}" ` +
    `height="${ART_WINDOW_HEIGHT}" href="${href}" preserveAspectRatio="xMidYMid slice"/>`;
  return baseSvg.replace(ART_WINDOW_PLACEHOLDER_RE, imageTag);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(client = createMockLeonardoClient()) {
  const briefs = loadBriefs();
  const cardsByName = new Map(loadAllCards().map((card) => [card.name, card]));

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const brief of briefs) {
    const card = cardsByName.get(brief.cardName);
    if (!card) {
      throw new Error(`art-briefs.md brief "${brief.cardName}" has no matching card in design/cards/*.md`);
    }

    const baseSvg = renderCardSvg(card);
    const { href } = await client.generateArt({ cardName: card.name, brief: brief.text });
    const compositedSvg = compositeArtWindow(baseSvg, href);

    fs.writeFileSync(path.join(OUT_DIR, `${slugify(card.name)}.svg`), compositedSvg, 'utf8');
  }

  console.log(
    `Composited ${briefs.length} card art window(s) into ${path.relative(REPO_ROOT, OUT_DIR).split(path.sep).join('/')}/`
  );
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack || err.message || String(err));
    process.exitCode = 1;
  });
}

module.exports = {
  main,
  createMockLeonardoClient,
  compositeArtWindow,
  loadBriefs,
  ART_WINDOW_X,
  ART_WINDOW_Y,
  ART_WINDOW_WIDTH,
  ART_WINDOW_HEIGHT,
};
