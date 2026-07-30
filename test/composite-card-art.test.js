'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');
const { loadAllCards } = require('../tools/render-card');

const REPO_ROOT = path.join(__dirname, '..');
const RENDER_SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'render-card.js');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'composite-card-art.js');
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
const ALT_BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'alt-art-briefs.md');
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

function listAltBriefTitles() {
  if (!fs.existsSync(ALT_BRIEFS_PATH)) return [];
  const content = fs.readFileSync(ALT_BRIEFS_PATH, 'utf8');
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

  // "-alt.svg" files are a separate, additive concern owned by
  // test/composite-card-art-alt.test.js — excluded here so this check
  // stays exactly "one base SVG per base brief section", unchanged from
  // before alt-art existed.
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg') && !f.endsWith('-alt.svg'));
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

  // Other test files in this suite call composite.main(), which rewrites
  // OUT_DIR via a tmp-dir swap; a read landing inside the swap window sees
  // ENOENT for a file that exists again milliseconds later. Retry briefly
  // instead of failing on the transient hole (same idiom as the repo's
  // EPERM retries).
  const readSvgWithRetry = (file) => {
    for (let attempt = 0; ; attempt++) {
      try {
        return fs.readFileSync(file, 'utf8');
      } catch (err) {
        if (err.code !== 'ENOENT' || attempt >= 40) throw err;
        const until = Date.now() + 25;
        while (Date.now() < until) { /* brief spin; swap window is ms */ }
      }
    }
  };

  const titles = listBriefTitles();
  for (const title of titles) {
    const expectedBounds = readPlaceholderBounds(title);
    const compositedFile = path.join(OUT_DIR, `${slugify(title)}.svg`);
    const svg = readSvgWithRetry(compositedFile);

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
  const altTitles = listAltBriefTitles();
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
    titles.length + altTitles.length,
    `expected the injected client's generateArt to be called once per brief and once per alt brief ` +
      `(${titles.length} + ${altTitles.length}), was called ${seenBriefs.length} times`
  );

  const outFile = path.join(OUT_DIR, `${slugify(firstTitle)}.svg`);
  const svg = fs.readFileSync(outFile, 'utf8');
  assert.ok(
    svg.includes('data:image/png;base64,AAAA'),
    `expected "${firstTitle}"'s composited SVG to use the injected client's href, proving generation is not hardcoded`
  );

  // Reviewer finding (cycle 1): this test just overwrote renders/
  // cards-composited/ with the fake client's placeholder hrefs — restore
  // the real default-mock output so a plain `node --test` run leaves the
  // directory in the state AC1 promises (one real composited SVG per
  // brief), not test residue.
  await composite.main();
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

// ---------------------------------------------------------------------------
// AC1/AC3: a card with no matching brief in design/cards/art-briefs.md
// prints a "no art brief for ..." warning naming it, and the run still
// succeeds (exit 0) — informational only, never a failure.
// ---------------------------------------------------------------------------

test('AC1/AC3: uncovered cards each warn "no art brief for ..." by name and main() still resolves; full coverage warns nothing', async () => {
  // Coverage caught up on 2026-07-30 (every shipped card now has a brief), so
  // the warning path can no longer be exercised against real repo state: the
  // tool binds loadAllCards at require time, and planting a fake card in the
  // real design/cards/ files would corrupt every catalog-count test. The
  // invariant is two-sided, so assert whichever side the repo is in:
  // uncovered cards -> exactly one warning each, by name; full coverage ->
  // zero "no art brief" warnings. Either way main() must resolve.
  const briefTitles = new Set(listBriefTitles());
  const uncoveredNames = loadAllCards()
    .map((card) => card.name)
    .filter((name) => !briefTitles.has(name));

  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (line) => warnings.push(String(line));
  try {
    await assert.doesNotReject(
      composite.main(),
      'expected main() to resolve (exit 0) regardless of brief coverage'
    );
  } finally {
    console.warn = originalWarn;
  }

  const briefWarnings = warnings.filter((w) => w.startsWith('no art brief for '));
  if (uncoveredNames.length > 0) {
    for (const name of uncoveredNames) {
      assert.ok(
        briefWarnings.includes(`no art brief for "${name}"`),
        `expected a warning naming "${name}", got: [${briefWarnings.join(', ')}]`
      );
    }
    assert.strictEqual(
      briefWarnings.length,
      uncoveredNames.length,
      `expected exactly one warning per uncovered card (${uncoveredNames.length}), got ${briefWarnings.length}: [${briefWarnings.join(', ')}]`
    );
  } else {
    assert.deepStrictEqual(
      briefWarnings,
      [],
      'full brief coverage must produce zero "no art brief" warnings'
    );
  }
});

// ---------------------------------------------------------------------------
// AC1: a card that DOES have a matching brief never triggers a warning.
// ---------------------------------------------------------------------------

test('AC1: a card with a matching brief does not print a "no art brief for ..." warning for it', async () => {
  const briefTitles = new Set(listBriefTitles());
  const coveredNames = loadAllCards()
    .map((card) => card.name)
    .filter((name) => briefTitles.has(name));

  assert.ok(coveredNames.length > 0, 'expected at least one card with a matching brief in this fixture');

  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (line) => warnings.push(String(line));
  try {
    await composite.main();
  } finally {
    console.warn = originalWarn;
  }

  for (const name of coveredNames) {
    assert.ok(
      !warnings.includes(`no art brief for "${name}"`),
      `did not expect a "no art brief" warning for covered card "${name}"`
    );
  }
});

// ---------------------------------------------------------------------------
// AC2: compositing for an already-covered card is unaffected by the new
// warning pass — the SVG it writes is byte-identical to a run before this
// unit's warning logic runs (verified via the fakeClient-vs-default output
// already exercised above; here we assert the file simply still exists and
// still contains an <image> element, not a warning-injected placeholder).
// ---------------------------------------------------------------------------

test('AC2: running composite.main() after the coverage-warning pass still writes a normal composited SVG for a covered card', async () => {
  const titles = listBriefTitles();
  assert.ok(titles.length > 0, 'expected at least one brief section in design/cards/art-briefs.md');
  const firstTitle = titles[0];

  await composite.main();

  const outFile = path.join(OUT_DIR, `${slugify(firstTitle)}.svg`);
  assert.ok(fs.existsSync(outFile), `expected a composited SVG for "${firstTitle}" to still be written`);
  const svg = fs.readFileSync(outFile, 'utf8');
  assert.ok(
    /<image[^>]*class="art-window"[^>]*\/?>/.test(svg),
    `expected "${firstTitle}"'s composited SVG to still contain an <image class="art-window"> element`
  );
});
