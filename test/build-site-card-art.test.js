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

// Any card with no render in cards-live/ or cards-composited/ works here —
// found dynamically, because hardcoding one (originally Cradle-Root Colony)
// breaks the moment a later unit adds that card's art brief.
const { loadCardsFromFile, slugify: slugifyCardName } = require('../lib/parse-card-markdown');
function findCardWithoutArt() {
  const cardsDir = path.join(REPO_ROOT, 'design', 'cards');
  for (const file of fs.readdirSync(cardsDir).filter((f) => f.endsWith('.md')).sort()) {
    for (const card of loadCardsFromFile(path.join(cardsDir, file))) {
      const slug = slugifyCardName(card.name);
      const hasArt = ['cards-live', 'cards-composited'].some((dir) =>
        fs.existsSync(path.join(REPO_ROOT, 'renders', dir, `${slug}.svg`))
      );
      if (!hasArt) {
        return { pageRelPath: `design/cards/${file.replace(/\.md$/, '.html')}`, cardName: card.name };
      }
    }
  }
  return null; // full art coverage — the no-art test below skips itself
}
const CARD_WITHOUT_ART = findCardWithoutArt();

test('AC1: a card with a matching composited render gets an <img> whose resolved src is a byte-identical copy', () => {
  runBuild();

  const pageAbsPath = path.join(SITE_DIR, ...CARD_WITH_ART.pageRelPath.split('/'));
  const pageHtml = fs.readFileSync(pageAbsPath, 'utf8');

  // Match THIS card's img specifically — the page carries one card-art img
  // per rendered card, and the first img on the page belongs to whichever
  // card section happens to come first, not necessarily this one.
  const imgMatch = pageHtml.match(
    new RegExp(`<img class="card-art" src="([^"]*${CARD_WITH_ART.slug}\\.svg)"[^>]*>`)
  );
  assert.ok(imgMatch, `expected an <img class="card-art"> tag for ${CARD_WITH_ART.slug} in the page`);

  const resolvedImgAbsPath = path.resolve(path.dirname(pageAbsPath), imgMatch[1]);
  assert.ok(fs.existsSync(resolvedImgAbsPath), `expected ${resolvedImgAbsPath} to exist`);

  // Mirror build-site's own preference: live art (renders/cards-live/)
  // wins over the deterministic mock baseline when both exist.
  const liveSvgAbsPath = path.join(REPO_ROOT, 'renders', 'cards-live', `${CARD_WITH_ART.slug}.svg`);
  const sourceSvgAbsPath = fs.existsSync(liveSvgAbsPath)
    ? liveSvgAbsPath
    : path.join(REPO_ROOT, 'renders', 'cards-composited', `${CARD_WITH_ART.slug}.svg`);
  assert.deepStrictEqual(
    fs.readFileSync(resolvedImgAbsPath),
    fs.readFileSync(sourceSvgAbsPath),
    'expected the copied site/ SVG to be byte-identical to the source composited render'
  );
});

test('AC2: a card with no composited render gets no <img class="card-art">, and the build still exits 0', { skip: CARD_WITHOUT_ART === null && 'every card currently has art' }, () => {
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
