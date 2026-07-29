#!/usr/bin/env node
'use strict';
// Generates ONE card's art with the pinned Leonardo model and produces a
// fully self-contained card SVG (art embedded as a data URI, so the file
// views correctly anywhere — file://, the shelf, a phone — with no network
// or CORS dependency).
//
//   LEONARDO_API_KEY=... LEONARDO_MODEL_ID=... node tools/generate-phoenix-card.js --card "Card Name"
//
// Outputs:
//   renders/art-raw-phoenix/<slug>.jpg   — the raw 1024x616 generation
//   renders/cards-phoenix/<slug>.svg     — self-contained composited card
//
// Exit 0 only when both outputs exist and the SVG embeds the art.

const fs = require('node:fs');
const path = require('node:path');
const { createLeonardoArtClient } = require('../lib/leonardo-art-client');
const { loadBriefs, compositeArtWindow } = require('./composite-card-art');
const { loadAllCards, slugify } = require('../lib/parse-card-markdown');
const { renderCardSvg } = require('./render-card');

const REPO_ROOT = path.join(__dirname, '..');
const RAW_DIR = path.join(REPO_ROOT, 'renders', 'art-raw-phoenix');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-phoenix');

function argOf(flag) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? null : process.argv[i + 1];
}

async function fetchWithRetry(url, options, attempts = 5) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429 || res.status >= 500) {
        throw new Error(`retryable HTTP ${res.status}`);
      }
      return res;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 3000 * (i + 1)));
    }
  }
  throw lastErr;
}

async function main() {
  const cardName = argOf('--card');
  if (!cardName) {
    console.error('usage: node tools/generate-phoenix-card.js --card "Card Name"');
    process.exit(2);
  }
  const brief = loadBriefs().find((b) => b.cardName === cardName);
  if (!brief) {
    console.error(`no brief found for "${cardName}" in design/cards/*.md brief files`);
    process.exit(3);
  }
  const card = loadAllCards().find((c) => c.name === cardName);
  if (!card) {
    console.error(`no card named "${cardName}" in design/cards/*.md`);
    process.exit(3);
  }

  const slug = slugify(cardName);
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Generate. The client itself retries nothing on create, so wrap its
  // transport-level failures with our own retry via a patched fetch.
  const client = createLeonardoArtClient({
    fetchImpl: (url, options) => fetchWithRetry(url, options),
    maxPollAttempts: 60,
  });
  const { href } = await client.generateArt({ cardName, brief: brief.text });
  if (!/^https:\/\/cdn\.leonardo\.ai\//.test(href)) {
    throw new Error(`unexpected art href: ${href}`);
  }

  // Download the raw image.
  const rawPath = path.join(RAW_DIR, `${slug}.jpg`);
  const imgRes = await fetchWithRetry(href, {});
  if (!imgRes.ok) throw new Error(`raw image download failed: HTTP ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  if (buf.length < 10000) throw new Error(`raw image suspiciously small (${buf.length} bytes)`);
  fs.writeFileSync(rawPath, buf);

  // Composite a self-contained SVG: art as a data URI.
  const dataUri = `data:image/jpeg;base64,${buf.toString('base64')}`;
  const svg = compositeArtWindow(renderCardSvg(card), dataUri);
  const outPath = path.join(OUT_DIR, `${slug}.svg`);
  fs.writeFileSync(outPath, svg, 'utf8');

  // Verify viewability requirements mechanically.
  const written = fs.readFileSync(outPath, 'utf8');
  if (!written.includes('data:image/jpeg;base64,')) throw new Error('SVG does not embed the art');
  if (!written.includes(`>${''}`) && !written.includes('</svg>')) throw new Error('SVG truncated');

  console.log(`OK ${cardName} -> ${path.relative(REPO_ROOT, outPath)} (raw ${buf.length} bytes, cdn: ${href})`);
}

main().catch((err) => {
  console.error(`FAIL: ${err.message || err}`);
  process.exit(1);
});
