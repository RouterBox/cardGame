'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');
const { loadAllCards, renderCardSvg } = require('../tools/render-card');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'render-card.js');
// Every design/cards/*.md contributes card entries (alpha-set, frontier-set,
// ...); doc-only files (art-briefs, card-anatomy) contribute none because
// listExpectedCards filters on the card field prefixes.
const CARDS_DIR = path.join(REPO_ROOT, 'design', 'cards');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// A level-3 section only counts as a card record if it carries the three
// required fields — same convention test/design-cards.test.js already
// relies on for this file.
function listExpectedCards() {
  const files = fs.readdirSync(CARDS_DIR).filter((f) => f.endsWith('.md')).sort();
  const cards = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(CARDS_DIR, file), 'utf8');
    const sections = parseSections(content);
    cards.push(...sections
      .filter((s) => s.level === 3)
      .map((s) => ({ title: s.title, body: s.lines.join('\n') }))
      .filter(
        (c) =>
          c.body.includes('Cost line:') &&
          c.body.includes('Type line:') &&
          c.body.includes('Rules text:')
      ));
  }
  return cards;
}

function readCardSvg(name) {
  const file = path.join(OUT_DIR, `${slugify(name)}.svg`);
  assert.ok(fs.existsSync(file), `expected a rendered SVG for "${name}" at ${file}`);
  return fs.readFileSync(file, 'utf8');
}

let runError = null;

test.before(() => {
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    runError = err;
  }
});

// ---------------------------------------------------------------------------
// AC1: running `node tools/render-card.js` exits 0 and produces exactly one
// SVG file under renders/cards/ for every card entry found in
// design/cards/alpha-set.md.
// ---------------------------------------------------------------------------

test('AC1: node tools/render-card.js exits 0 and produces exactly one SVG per alpha-set.md card', () => {
  assert.ok(
    !runError,
    `expected node tools/render-card.js to exit 0, got: ${runError && (runError.message + '\n' + (runError.stdout || '') + (runError.stderr || ''))}`
  );

  const expectedCards = listExpectedCards();
  assert.ok(expectedCards.length > 0, 'expected at least one parseable card in design/cards/alpha-set.md');

  assert.ok(fs.existsSync(OUT_DIR), `expected ${OUT_DIR} to exist after running the script`);
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg'));
  assert.strictEqual(
    files.length,
    expectedCards.length,
    `expected exactly ${expectedCards.length} SVG files, found ${files.length}: [${files.join(', ')}]`
  );

  const expectedFiles = new Set(expectedCards.map((c) => `${slugify(c.title)}.svg`));
  for (const file of files) {
    assert.ok(expectedFiles.has(file), `unexpected output file ${file} does not match any card name`);
  }
});

// ---------------------------------------------------------------------------
// AC2: Signal-Wrought Prototype (Cost line '1 Signal, 1 Circuit') — Frame
// splits into two equal vertical bands, cyan then copper, left-to-right.
// ---------------------------------------------------------------------------

test('AC2: Signal-Wrought Prototype frame splits into two equal bands, cyan then copper', () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  const svg = readCardSvg('Signal-Wrought Prototype');

  const bands = svg.match(/<rect[^>]*class="frame-band"[^>]*\/>/g) || [];
  assert.strictEqual(bands.length, 2, `expected exactly 2 frame bands, found ${bands.length}`);

  const parsed = bands
    .map((tag) => ({
      x: Number(/\bx="([-\d.]+)"/.exec(tag)[1]),
      width: Number(/\bwidth="([-\d.]+)"/.exec(tag)[1]),
      fill: /\bfill="(#[0-9a-fA-F]{3,8})"/.exec(tag)[1].toLowerCase(),
    }))
    .sort((a, b) => a.x - b.x);

  assert.strictEqual(parsed[0].width, parsed[1].width, 'expected the two frame bands to be equal width');
  assert.strictEqual(parsed[0].fill, '#06b6d4', 'expected the left band to be cyan (Signal)');
  assert.strictEqual(parsed[1].fill, '#b5651d', 'expected the right band to be copper (Circuit)');
});

// ---------------------------------------------------------------------------
// AC3: Sporeknit Warden (Cost line '3 Bloom') — single solid green Frame
// band and a Cost Slot pip reading '3'.
// ---------------------------------------------------------------------------

test("AC3: Sporeknit Warden has one solid green frame band and a cost pip reading '3'", () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  const svg = readCardSvg('Sporeknit Warden');

  const bands = svg.match(/<rect[^>]*class="frame-band"[^>]*\/>/g) || [];
  assert.strictEqual(bands.length, 1, `expected exactly 1 frame band, found ${bands.length}`);
  const fill = /\bfill="(#[0-9a-fA-F]{3,8})"/.exec(bands[0])[1].toLowerCase();
  assert.strictEqual(fill, '#2f9e44', 'expected a solid green (Bloom) frame band');

  const viewBoxMatch = /viewBox="0 0 ([\d.]+) [\d.]+"/.exec(svg);
  assert.ok(viewBoxMatch, 'expected the svg to declare a viewBox to compare band width against card width');
  const cardWidth = Number(viewBoxMatch[1]);
  const bandWidth = Number(/\bwidth="([-\d.]+)"/.exec(bands[0])[1]);
  assert.strictEqual(bandWidth, cardWidth, 'expected the single frame band to span the full card width');

  const pips = svg.match(/<g[^>]*class="cost-pip"[\s\S]*?<\/g>/g) || [];
  assert.strictEqual(pips.length, 1, `expected exactly 1 cost pip, found ${pips.length}`);
  assert.ok(/>3</.test(pips[0]), 'expected the cost pip to display the amount "3"');
});

// ---------------------------------------------------------------------------
// AC4: a Permanent with a Stats/counters line renders a Stats Corner; a
// Permanent with none contains no Stats Corner element at all.
// ---------------------------------------------------------------------------

test('AC4: Stats Corner is present only when a Permanent carries a Stats/counters line', () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  const withStats = readCardSvg('Sporeknit Warden');
  const withoutStats = readCardSvg('Signal-Wrought Prototype');

  assert.ok(/class="stats-corner"/.test(withStats), 'expected a Stats Corner element for Sporeknit Warden');
  assert.ok(
    /Combat strength 2/.test(withStats),
    'expected the Stats Corner to render the Stats/counters line text'
  );

  assert.ok(
    !/stats-corner/.test(withoutStats),
    'expected no Stats Corner element (empty or otherwise) for Signal-Wrought Prototype'
  );
});

// ---------------------------------------------------------------------------
// AC5: the Art Window is a placeholder rectangle only — no illustration, no
// image-generation call, no game-rule logic anywhere in the script.
// ---------------------------------------------------------------------------

test('AC5: Art Window is a placeholder rectangle with no illustration or image-generation calls', () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  const svg = readCardSvg('Sporeknit Warden');

  assert.ok(/<rect[^>]*class="art-window"[^>]*\/>/.test(svg), 'expected an art-window placeholder rect');
  assert.ok(!/<image[\s>]/.test(svg), 'expected no <image> element compositing an illustration');
  assert.ok(!/href="/.test(svg), 'expected no href reference to an external art asset');

  const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(
    !/require\(\s*['"](?:https?|child_process)['"]\s*\)/.test(scriptSource),
    'expected no network or subprocess module usage in the render script'
  );
  assert.ok(!/\bfetch\s*\(/.test(scriptSource), 'expected no fetch() calls to an image-generation service');
  assert.ok(
    !/\b(combat resolution|turn phase|resource pool|damage calculation|phase simulation)\b/i.test(scriptSource),
    'expected no game-rule simulation logic in the layout script'
  );
});

// ---------------------------------------------------------------------------
// Premium layer treatments (renderCardSvg's `treatment` parameter).
//
// design/cards/card-anatomy.md's "The Layers" section defines Base Treatment
// plus Borderless/Foil/Extended-Art premium layer swaps. renderCardSvg today
// (pre-unit) only ever produces Base Treatment output and silently ignores
// any second argument, so every assertion below that depends on a treatment
// actually changing the output is expected to fail until the `treatment`
// parameter and its three branches are implemented.
// ---------------------------------------------------------------------------

function frameBandRects(svg) {
  return svg.match(/<rect[^>]*class="frame-band"[^>]*\/>/g) || [];
}

function artWindowRect(svg) {
  const match = /<rect[^>]*class="art-window"[^>]*\/>/.exec(svg);
  assert.ok(match, 'expected an art-window rect element');
  return match[0];
}

function attr(tag, name) {
  const match = new RegExp(`\\b${name}="([^"]*)"`).exec(tag);
  assert.ok(match, `expected element to carry a "${name}" attribute: ${tag}`);
  return match[1];
}

function cardDimensions(svg) {
  const match = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
  assert.ok(match, 'expected the svg to declare a viewBox to read card dimensions from');
  return { width: Number(match[1]), height: Number(match[2]) };
}

// font-size="32" + font-weight="bold" is unique to the Name Slot's
// textBlock() call (renderNameSlot); no other zone uses that combination.
function extractNameSlotText(svg) {
  const match = /<text[^>]*font-size="32"[^>]*font-weight="bold"[^>]*>[\s\S]*?<\/text>/.exec(svg);
  assert.ok(match, 'expected a Name Slot text element');
  return match[0];
}

// font-size="20" fill="#3a3a3f" is unique to the Type Line's textBlock()
// call (renderTypeLine); the Rules-Text Box also uses font-size 20 but a
// different fill.
function extractTypeLineText(svg) {
  const match = /<text[^>]*font-size="20" fill="#3a3a3f"[^>]*>[\s\S]*?<\/text>/.exec(svg);
  assert.ok(match, 'expected a Type Line text element');
  return match[0];
}

test("Treatment AC1: renderCardSvg's treatment parameter defaults to/matches 'base' but actually distinguishes 'borderless', 'foil', and 'extended-art'", () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  for (const card of loadAllCards()) {
    const withDefault = renderCardSvg(card);
    const withBase = renderCardSvg(card, 'base');
    assert.strictEqual(
      withDefault,
      withBase,
      `expected renderCardSvg(card) === renderCardSvg(card, 'base') for "${card.name}"`
    );

    for (const treatment of ['borderless', 'foil', 'extended-art']) {
      const treated = renderCardSvg(card, treatment);
      assert.notStrictEqual(
        treated,
        withBase,
        `expected renderCardSvg(card, '${treatment}') to differ from the base treatment for "${card.name}" (treatment argument appears to have no effect)`
      );
    }
  }
});

test('Treatment AC2: borderless shrinks every frame band below base width and expands the art window to the full card', () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  for (const card of loadAllCards()) {
    const baseSvg = renderCardSvg(card, 'base');
    const borderlessSvg = renderCardSvg(card, 'borderless');

    const baseBands = frameBandRects(baseSvg);
    const borderlessBands = frameBandRects(borderlessSvg);
    assert.ok(baseBands.length > 0, `expected at least one base frame band for "${card.name}"`);

    const baseWidth = Number(attr(baseBands[0], 'width'));
    for (const band of borderlessBands) {
      const width = Number(attr(band, 'width'));
      assert.ok(
        width < baseWidth,
        `expected every borderless frame band width (got ${width}) to be materially smaller than the base width (${baseWidth}) for "${card.name}"`
      );
    }

    const { width: cardWidth, height: cardHeight } = cardDimensions(borderlessSvg);
    const borderlessArtWindow = artWindowRect(borderlessSvg);
    const artWidth = Number(attr(borderlessArtWindow, 'width'));
    const artHeight = Number(attr(borderlessArtWindow, 'height'));
    assert.strictEqual(artWidth, cardWidth, `expected borderless art window width to equal the full card width for "${card.name}"`);
    assert.strictEqual(artHeight, cardHeight, `expected borderless art window height to equal the full card height for "${card.name}"`);

    const baseArtWindow = artWindowRect(baseSvg);
    assert.notStrictEqual(
      artWidth,
      Number(attr(baseArtWindow, 'width')),
      `expected borderless art window width to differ from base for "${card.name}"`
    );
  }
});

test('Treatment AC3: foil marks every frame band with data-foil="true" while keeping x/y/width/height/fill identical to base', () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  for (const card of loadAllCards()) {
    const baseSvg = renderCardSvg(card, 'base');
    const foilSvg = renderCardSvg(card, 'foil');

    const baseBands = frameBandRects(baseSvg);
    const foilBands = frameBandRects(foilSvg);
    assert.strictEqual(foilBands.length, baseBands.length, `expected the same frame band count for "${card.name}"`);
    assert.ok(baseBands.length > 0, `expected at least one frame band for "${card.name}"`);

    for (let i = 0; i < baseBands.length; i++) {
      assert.ok(
        /data-foil="true"/.test(foilBands[i]),
        `expected foil frame band ${i} to carry data-foil="true" for "${card.name}"`
      );
      for (const name of ['x', 'y', 'width', 'height', 'fill']) {
        assert.strictEqual(
          attr(foilBands[i], name),
          attr(baseBands[i], name),
          `expected foil frame band ${i} attribute "${name}" to match base for "${card.name}"`
        );
      }
    }
  }
});

test('Treatment AC4: extended-art enlarges the art window past base height while Name Slot/Type Line text stay identical', () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  for (const card of loadAllCards()) {
    const baseSvg = renderCardSvg(card, 'base');
    const extendedSvg = renderCardSvg(card, 'extended-art');

    const baseHeight = Number(attr(artWindowRect(baseSvg), 'height'));
    const extendedHeight = Number(attr(artWindowRect(extendedSvg), 'height'));
    assert.ok(
      extendedHeight > baseHeight,
      `expected extended-art window height (${extendedHeight}) to exceed base (${baseHeight}) for "${card.name}"`
    );

    assert.strictEqual(
      extractNameSlotText(extendedSvg),
      extractNameSlotText(baseSvg),
      `expected Name Slot text element unchanged for "${card.name}"`
    );
    assert.strictEqual(
      extractTypeLineText(extendedSvg),
      extractTypeLineText(baseSvg),
      `expected Type Line text element unchanged for "${card.name}"`
    );
  }
});
