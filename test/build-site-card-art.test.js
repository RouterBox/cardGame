'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const SITE_DIR = path.join(REPO_ROOT, 'site');

const { resolveFilePath } = require('../tools/serve-site.js');

function runBuild() {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
}

// "Line-Fleet Trooper" (design/cards/alpha-set.md) has a composited render
// at renders/cards-composited/line-fleet-trooper.svg.
const CARD_WITH_ART = {
  pageRelPath: 'design/cards/alpha-set.html',
  slug: 'line-fleet-trooper',
};

// "Cradle-Root Colony" (design/cards/fount-economy-set.md) has no brief in
// design/cards/art-briefs.md and so no composited render exists for it.
const CARD_WITHOUT_ART = {
  pageRelPath: 'design/cards/fount-economy-set.html',
  cardName: 'Cradle-Root Colony',
};

test('AC1: a card with a matching composited render gets an <img> whose resolved src is a byte-identical copy', () => {
  runBuild();

  const pageAbsPath = path.join(SITE_DIR, ...CARD_WITH_ART.pageRelPath.split('/'));
  const pageHtml = fs.readFileSync(pageAbsPath, 'utf8');

  const imgMatch = pageHtml.match(/<img class="card-art" src="([^"]+)"[^>]*>/);
  assert.ok(imgMatch, 'expected an <img class="card-art"> tag in the page');

  const resolvedImgAbsPath = path.resolve(path.dirname(pageAbsPath), imgMatch[1]);
  assert.ok(fs.existsSync(resolvedImgAbsPath), `expected ${resolvedImgAbsPath} to exist`);

  const sourceSvgAbsPath = path.join(REPO_ROOT, 'renders', 'cards-composited', `${CARD_WITH_ART.slug}.svg`);
  assert.deepStrictEqual(
    fs.readFileSync(resolvedImgAbsPath),
    fs.readFileSync(sourceSvgAbsPath),
    'expected the copied site/ SVG to be byte-identical to the source composited render'
  );
});

test('AC2: a card with no composited render gets no <img class="card-art">, and the build still exits 0', () => {
  runBuild();

  const pageAbsPath = path.join(SITE_DIR, ...CARD_WITHOUT_ART.pageRelPath.split('/'));
  const pageHtml = fs.readFileSync(pageAbsPath, 'utf8');

  const h3Index = pageHtml.indexOf(`<h3>${CARD_WITHOUT_ART.cardName}</h3>`);
  assert.ok(h3Index !== -1, `expected an <h3> for "${CARD_WITHOUT_ART.cardName}"`);

  const nextH3Index = pageHtml.indexOf('<h3>', h3Index + 1);
  const sectionEnd = nextH3Index === -1 ? pageHtml.length : nextH3Index;
  const section = pageHtml.slice(h3Index, sectionEnd);

  assert.ok(!section.includes('class="card-art"'), 'expected no card-art <img> for a card with no composited render');
});

test('AC3: every copied card-art SVG resolves and would be served successfully by serve-site.js', () => {
  runBuild();

  const cardArtDir = path.join(SITE_DIR, '_card-art');
  assert.ok(fs.existsSync(cardArtDir), 'expected site/_card-art/ to exist');

  const svgFiles = fs.readdirSync(cardArtDir).filter((name) => name.endsWith('.svg'));
  assert.ok(svgFiles.length > 0, 'expected at least one copied card-art SVG');

  for (const name of svgFiles) {
    const resolved = resolveFilePath(`/_card-art/${name}`);
    assert.ok(resolved, `expected resolveFilePath to serve /_card-art/${name}`);
    assert.strictEqual(resolved, path.join(cardArtDir, name));
  }
});
