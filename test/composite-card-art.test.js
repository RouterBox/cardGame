'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const RENDER_SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'render-card.js');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'composite-card-art.js');
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
const PLACEHOLDER_DIR = path.join(REPO_ROOT, 'renders', 'cards');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');

// Requiring the tool under test at module-load time is intentional: until
// tools/composite-card-art.js exists, this throws and the whole file is
// reported as failing — the expected RED state before the unit is built.
const composite = require('../tools/composite-card-art');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function listBriefTitles() {
  const content = fs.readFileSync(BRIEFS_PATH, 'utf8');
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => s.title);
}

// Ground truth for "the Art Window bounds" comes from the layout engine's
// own placeholder output (renders/cards/<slug>.svg), not from a second,
// hand-copied set of numbers — so this test can never encode a stale value.
function readPlaceholderBounds(title) {
  const file = path.join(PLACEHOLDER_DIR, `${slugify(title)}.svg`);
  assert.ok(
    fs.existsSync(file),
    `expected a placeholder-rendered SVG for "${title}" at ${file} (produced by tools/render-card.js)`
  );
  const svg = fs.readFileSync(file, 'utf8');
  const rectMatch = svg.match(/<rect[^>]*class="art-window"[^>]*\/>/);
  assert.ok(
    rectMatch,
    `expected renders/cards/${slugify(title)}.svg to contain the art-window placeholder rect`
  );
  const tag = rectMatch[0];
  return {
    x: Number(/\bx="([-\d.]+)"/.exec(tag)[1]),
    y: Number(/\by="([-\d.]+)"/.exec(tag)[1]),
    width: Number(/\bwidth="([-\d.]+)"/.exec(tag)[1]),
    height: Number(/\bheight="([-\d.]+)"/.exec(tag)[1]),
  };
}

let renderError = null;
let runError = null;

test.before(() => {
  try {
    execFileSync('node', [RENDER_SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    renderError = err;
  }
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    runError = err;
  }
});

// ---------------------------------------------------------------------------
// AC1: tools/composite-card-art.js exists; running
// `node tools/composite-card-art.js` exits 0 and writes exactly one
// composited SVG per brief section in design/cards/art-briefs.md into
// renders/cards-composited/.
// ---------------------------------------------------------------------------

test('AC1: tools/composite-card-art.js exists', () => {
  assert.ok(fs.existsSync(SCRIPT_PATH), `expected ${SCRIPT_PATH} to exist`);
});

test('AC1: node tools/composite-card-art.js exits 0 and writes exactly one composited SVG per brief section', () => {
  assert.ok(
    !renderError,
    `setup failed: node tools/render-card.js must succeed to establish expected Art Window bounds, got: ${renderError && (renderError.message + '\n' + (renderError.stdout || '') + (renderError.stderr || ''))}`
  );
  assert.ok(
    !runError,
    `expected node tools/composite-card-art.js to exit 0, got: ${runError && (runError.message + '\n' + (runError.stdout || '') + (runError.stderr || ''))}`
  );

  const titles = listBriefTitles();
  assert.ok(titles.length > 0, 'expected at least one brief section in design/cards/art-briefs.md');
  assert.ok(fs.existsSync(OUT_DIR), `expected ${OUT_DIR} to exist after running the script`);

  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg'));
  assert.strictEqual(
    files.length,
    titles.length,
    `expected exactly ${titles.length} composited SVGs, found ${files.length}: [${files.join(', ')}]`
  );

  const expectedFiles = new Set(titles.map((t) => `${slugify(t)}.svg`));
  for (const file of files) {
    assert.ok(expectedFiles.has(file), `unexpected output file ${file} does not match any brief section`);
  }
});

// ---------------------------------------------------------------------------
// AC2: each composited SVG's Art Window slot contains an <image> element
// (not the placeholder rect), positioned and sized to match the Art Window
// bounds defined in design/cards/card-anatomy.md (i.e. the exact bounds the
// placeholder rect it replaces used).
// ---------------------------------------------------------------------------

test('AC2: composited SVGs replace the Art Window placeholder rect with an <image> sized to the placeholder bounds', () => {
  assert.ok(!runError, 'compositing script must succeed before its output can be checked');

  const titles = listBriefTitles();
  for (const title of titles) {
    const expectedBounds = readPlaceholderBounds(title);
    const compositedFile = path.join(OUT_DIR, `${slugify(title)}.svg`);
    assert.ok(fs.existsSync(compositedFile), `expected a composited SVG for "${title}"`);
    const svg = fs.readFileSync(compositedFile, 'utf8');

    assert.ok(
      !/<rect[^>]*class="art-window"/.test(svg),
      `expected no remaining art-window placeholder rect in "${title}"'s composited SVG`
    );

    const imageMatch = svg.match(/<image[^>]*class="art-window"[^>]*\/?>/);
    assert.ok(imageMatch, `expected an <image class="art-window"> element in "${title}"'s composited SVG`);
    const tag = imageMatch[0];

    assert.strictEqual(
      Number(/\bx="([-\d.]+)"/.exec(tag)[1]),
      expectedBounds.x,
      `expected "${title}"'s composited <image> x to match the placeholder rect's x`
    );
    assert.strictEqual(
      Number(/\by="([-\d.]+)"/.exec(tag)[1]),
      expectedBounds.y,
      `expected "${title}"'s composited <image> y to match the placeholder rect's y`
    );
    assert.strictEqual(
      Number(/\bwidth="([-\d.]+)"/.exec(tag)[1]),
      expectedBounds.width,
      `expected "${title}"'s composited <image> width to match the placeholder rect's width`
    );
    assert.strictEqual(
      Number(/\bheight="([-\d.]+)"/.exec(tag)[1]),
      expectedBounds.height,
      `expected "${title}"'s composited <image> height to match the placeholder rect's height`
    );

    assert.ok(
      /\bhref="[^"]+"/.test(tag) || /\bxlink:href="[^"]+"/.test(tag),
      `expected the <image> element to carry an href in "${title}"'s composited SVG`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3: image generation goes through an injectable client; the
// default/test client is a deterministic mock that makes no network calls
// and requires no Leonardo API key, so `node --test` runs fully offline.
// ---------------------------------------------------------------------------

test('AC3: default art-generation path has no fetch/http calls and never reads a Leonardo API key', () => {
  const source = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(!/\bfetch\s*\(/.test(source), 'expected no fetch() calls to a real image-generation service');
  assert.ok(
    !/require\(\s*['"]https?['"]\s*\)/.test(source),
    'expected no built-in http(s) module usage for a live API call'
  );
  assert.ok(
    !/process\.env\.\w*LEONARDO\w*/i.test(source),
    'expected the default path to never read a Leonardo API key from the environment'
  );
});

test('AC3: image generation is injected via a client argument — a custom client\'s output is used instead of the default', async () => {
  assert.ok(!renderError, 'setup failed: node tools/render-card.js must succeed first');
  assert.strictEqual(typeof composite.main, 'function', 'expected composite-card-art.js to export a main(client) function');

  const titles = listBriefTitles();
  assert.ok(titles.length > 0, 'expected at least one brief in design/cards/art-briefs.md');
  const firstTitle = titles[0];

  const seenBriefs = [];
  const fakeClient = {
    async generateArt(request) {
      seenBriefs.push(request);
      return { href: 'data:image/png;base64,AAAA' };
    },
  };

  await assert.doesNotReject(
    composite.main(fakeClient),
    'expected main() to accept and use an injected art-generation client'
  );

  assert.strictEqual(
    seenBriefs.length,
    titles.length,
    `expected the injected client's generateArt to be called once per brief (${titles.length}), was called ${seenBriefs.length} times`
  );

  const outFile = path.join(OUT_DIR, `${slugify(firstTitle)}.svg`);
  const svg = fs.readFileSync(outFile, 'utf8');
  assert.ok(
    svg.includes('data:image/png;base64,AAAA'),
    `expected "${firstTitle}"'s composited SVG to use the injected client's href, proving generation is not hardcoded`
  );
});

test('AC3: default (mock) client resolves with no LEONARDO_API_KEY set, fully offline', async () => {
  assert.strictEqual(typeof composite.main, 'function', 'expected composite-card-art.js to export a main function');

  const previousKey = process.env.LEONARDO_API_KEY;
  delete process.env.LEONARDO_API_KEY;
  try {
    await assert.doesNotReject(
      composite.main(),
      'expected main() with the default client to resolve without a Leonardo API key present'
    );
  } finally {
    if (previousKey !== undefined) process.env.LEONARDO_API_KEY = previousKey;
  }
});
