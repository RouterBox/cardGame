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
const ALT_BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'alt-art-briefs.md');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');
// Live runs land in their own directory: the committed cards-composited/
// baseline must stay byte-identical to a deterministic MOCK run (the suite
// asserts exactly that), so real Leonardo output must never overwrite it.
const LIVE_OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-live');

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

function loadBriefsFromFile(filePath) {
  const markdown = fs.readFileSync(filePath, 'utf8');
  return splitIntoH3Sections(markdown).map((section) => ({
    cardName: section.title,
    text: section.lines.join('\n').trim(),
  }));
}

function loadBriefs() {
  return loadBriefsFromFile(BRIEFS_PATH);
}

// alt-art-briefs.md is optional — main() only loads it when present, so a
// checkout with no Alt-Art briefs yet still composites exactly as before.
function loadAltBriefs() {
  if (!fs.existsSync(ALT_BRIEFS_PATH)) return [];
  return loadBriefsFromFile(ALT_BRIEFS_PATH);
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

const LOCK_STALE_MS = 30000; // the guarded section is just a remove+rename, so any lock
// older than this was abandoned by a process that died mid-swap, not one still working.

// Windows refuses to rename a directory while another process holds a
// handle inside it (build-site reading a render, an AV scan) — that
// surfaces as EPERM and clears in milliseconds. Retry briefly instead of
// failing the whole run.
function renameWithRetry(from, to) {
  for (let attempt = 0; ; attempt++) {
    try {
      fs.renameSync(from, to);
      return;
    } catch (err) {
      if ((err.code !== 'EPERM' && err.code !== 'EACCES') || attempt >= 40) throw err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
}

async function withOutDirLock(outDir, fn) {
  const lockDir = `${outDir}.lock`;
  for (;;) {
    try {
      fs.mkdirSync(lockDir);
      break;
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
      let staleMtimeMs = null;
      try {
        staleMtimeMs = fs.statSync(lockDir).mtimeMs;
      } catch (statErr) {
        if (statErr.code !== 'ENOENT') throw statErr;
      }
      if (staleMtimeMs !== null && Date.now() - staleMtimeMs > LOCK_STALE_MS) {
        fs.rmSync(lockDir, { recursive: true, force: true });
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }
  try {
    return await fn();
  } finally {
    fs.rmdirSync(lockDir);
  }
}

async function main(client = createMockLeonardoClient(), altClient = client, outDir = OUT_DIR) {
  const briefs = loadBriefs();
  const altBriefs = loadAltBriefs();
  const allCards = loadAllCards();
  const cardsByName = new Map(allCards.map((card) => [card.name, card]));
  const baseBriefNames = new Set(briefs.map((brief) => brief.cardName));

  const tmpDir = `${outDir}.tmp-${process.pid}-${crypto.randomBytes(6).toString('hex')}`;
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

    for (const altBrief of altBriefs) {
      const card = cardsByName.get(altBrief.cardName);
      if (!card) {
        throw new Error(`alt-art-briefs.md brief "${altBrief.cardName}" has no matching card in design/cards/*.md`);
      }
      if (!baseBriefNames.has(altBrief.cardName)) {
        throw new Error(`alt-art-briefs.md brief "${altBrief.cardName}" has no base brief in design/cards/art-briefs.md`);
      }

      const baseSvg = renderCardSvg(card);
      const { href } = await altClient.generateArt({ cardName: card.name, brief: altBrief.text });
      const compositedSvg = compositeArtWindow(baseSvg, href);

      fs.writeFileSync(path.join(tmpDir, `${slugify(card.name)}-alt.svg`), compositedSvg, 'utf8');
    }

    await withOutDirLock(outDir, async () => {
      // Two renames instead of rm+rename: if the second rename fails partway
      // (e.g. Windows refusing a rename while another process still holds a
      // handle on the directory), the first rename lets us put the old
      // OUT_DIR back rather than leaving OUT_DIR permanently missing.
      const backupDir = `${outDir}.bak-${process.pid}-${crypto.randomBytes(6).toString('hex')}`;
      const hadExisting = fs.existsSync(outDir);
      if (hadExisting) {
        renameWithRetry(outDir, backupDir);
      }
      try {
        renameWithRetry(tmpDir, outDir);
      } catch (err) {
        if (hadExisting) {
          renameWithRetry(backupDir, outDir);
        }
        throw err;
      }
      if (hadExisting) {
        fs.rmSync(backupDir, { recursive: true, force: true });
      }
    });
  } catch (err) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw err;
  }

  console.log(
    `Composited ${briefs.length} card art window(s)` +
      `${altBriefs.length ? ` plus ${altBriefs.length} alt-art window(s)` : ''}` +
      ` into ${path.relative(REPO_ROOT, outDir).split(path.sep).join('/')}/`
  );

  // Informational only: a card with no brief in art-briefs.md is not an
  // error (this tool doesn't gate on card content), but the gap should be
  // visible instead of silently invisible — that silence is what let past
  // card sets ship with zero briefs before anyone noticed by hand.
  for (const card of allCards) {
    if (!baseBriefNames.has(card.name)) {
      console.warn(`no art brief for "${card.name}"`);
    }
  }
}

async function runCli(argv = process.argv) {
  const useLive = argv.includes('--live');
  // --live only swaps the *base* pass onto the real Leonardo API — the
  // already-shipped live-client contract is exactly one live request per
  // design/cards/art-briefs.md brief. Alt-Art keeps using the deterministic
  // mock client here; wiring alt-art into live generation is a separate,
  // later decision, not part of this pipeline's live-client surface.
  const client = useLive ? require('../lib/leonardo-art-client').createLeonardoArtClient() : undefined;
  const altClient = useLive ? createMockLeonardoClient() : undefined;
  // Live output is quarantined in renders/cards-live/ so the committed mock
  // baseline in renders/cards-composited/ stays byte-identical (AC2).
  // CARDGAME_LIVE_OUT_DIR exists for the --live WIRING test: it runs this
  // exact path with a mocked transport, and without the redirect it
  // overwrote every genuine Leonardo render with the mock's placeholder URL
  // (discovered 2026-07-29 — the real art had to be dug back out of git).
  const liveOutDir = process.env.CARDGAME_LIVE_OUT_DIR || LIVE_OUT_DIR;
  await main(client, altClient, useLive ? liveOutDir : undefined);
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
  loadAltBriefs,
  ART_WINDOW_X,
  ART_WINDOW_Y,
  ART_WINDOW_WIDTH,
  ART_WINDOW_HEIGHT,
};
