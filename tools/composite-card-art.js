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
//
// OUT_DIR is a shared, on-disk resource that multiple test files (each their
// own OS process under `node --test`) can call main()/runCli() against
// concurrently. The (possibly slow — a real --live run polls Leonardo per
// brief) generation loop writes into a private, uniquely-named temp
// directory first, so it never touches the shared path. Only the final swap
// onto OUT_DIR (remove + rename, a couple of fast fs calls) is guarded by a
// cross-process lock, which keeps that swap from racing another process's
// swap (Windows in particular refuses a rename while another process is
// touching the same directory). The lock itself self-heals: if a holder is
// killed (SIGINT/SIGKILL/OOM) before releasing it, the lock directory goes
// stale and a later run reclaims it instead of hanging forever.
// ---------------------------------------------------------------------------

const OUT_DIR_LOCK = `${OUT_DIR}.lock`;
const LOCK_STALE_MS = 30000; // the guarded section is just a remove+rename, so any lock
// older than this was abandoned by a process that died mid-swap, not one still working.

async function withOutDirLock(fn) {
  for (;;) {
    try {
      fs.mkdirSync(OUT_DIR_LOCK);
      break;
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
      let staleMtimeMs = null;
      try {
        staleMtimeMs = fs.statSync(OUT_DIR_LOCK).mtimeMs;
      } catch (statErr) {
        if (statErr.code !== 'ENOENT') throw statErr;
      }
      if (staleMtimeMs !== null && Date.now() - staleMtimeMs > LOCK_STALE_MS) {
        fs.rmSync(OUT_DIR_LOCK, { recursive: true, force: true });
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }
  try {
    return await fn();
  } finally {
    fs.rmdirSync(OUT_DIR_LOCK);
  }
}

async function main(client = createMockLeonardoClient()) {
  const briefs = loadBriefs();
  const cardsByName = new Map(loadAllCards().map((card) => [card.name, card]));

  const tmpDir = `${OUT_DIR}.tmp-${process.pid}-${crypto.randomBytes(6).toString('hex')}`;
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    for (const brief of briefs) {
      const card = cardsByName.get(brief.cardName);
      if (!card) {
        throw new Error(`art-briefs.md brief "${brief.cardName}" has no matching card in design/cards/*.md`);
      }

      const baseSvg = renderCardSvg(card);
      const { href } = await client.generateArt({ cardName: card.name, brief: brief.text });
      const compositedSvg = compositeArtWindow(baseSvg, href);

      fs.writeFileSync(path.join(tmpDir, `${slugify(card.name)}.svg`), compositedSvg, 'utf8');
    }

    await withOutDirLock(async () => {
      fs.rmSync(OUT_DIR, { recursive: true, force: true });
      fs.renameSync(tmpDir, OUT_DIR);
    });
  } catch (err) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw err;
  }

  console.log(
    `Composited ${briefs.length} card art window(s) into ${path.relative(REPO_ROOT, OUT_DIR).split(path.sep).join('/')}/`
  );
}

async function runCli(argv = process.argv) {
  const useLive = argv.includes('--live');
  const client = useLive ? require('../lib/leonardo-art-client').createLeonardoArtClient() : undefined;
  await main(client);
}

if (require.main === module) {
  runCli().catch((err) => {
    console.error(err.stack || err.message || String(err));
    process.exitCode = 1;
  });
}

module.exports = {
  main,
  runCli,
  createMockLeonardoClient,
  compositeArtWindow,
  loadBriefs,
  ART_WINDOW_X,
  ART_WINDOW_Y,
  ART_WINDOW_WIDTH,
  ART_WINDOW_HEIGHT,
};
