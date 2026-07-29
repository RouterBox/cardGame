'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const SITE_DIR = path.join(REPO_ROOT, 'site');
const DESIGN_DIR = path.join(REPO_ROOT, 'design');
const GAME_PLAN_PATH = path.join(REPO_ROOT, 'gamePlan.md');

function runBuild() {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
}

function walkFiles(dir, predicate) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, predicate));
    else if (!predicate || predicate(entry.name)) out.push(full);
  }
  return out;
}

function sourceMdFiles() {
  const files = walkFiles(DESIGN_DIR, (name) => name.endsWith('.md'));
  files.push(GAME_PLAN_PATH);
  return files;
}

function outputPathFor(srcAbsPath) {
  const rel = path.relative(REPO_ROOT, srcAbsPath).split(path.sep).join('/');
  const outRel = rel.slice(0, -'.md'.length) + '.html';
  return path.join(SITE_DIR, ...outRel.split('/'));
}

function escapeForCheck(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function extractSectionHtml(indexHtml, sectionTitle) {
  const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = indexHtml.match(new RegExp(`<section>\\n<h2>${escaped}</h2>[\\s\\S]*?</section>`));
  return m ? m[0] : null;
}

function hashTree(dir) {
  const files = walkFiles(dir, null).sort();
  const hash = crypto.createHash('sha256');
  for (const file of files) {
    hash.update(path.relative(dir, file).split(path.sep).join('/'));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest('hex');
}

test('AC1: node tools/build-site.js exits 0 and produces one page per markdown source plus index.html', () => {
  runBuild();
  assert.ok(fs.existsSync(path.join(SITE_DIR, 'index.html')), 'expected site/index.html to exist');
  for (const src of sourceMdFiles()) {
    const outPath = outputPathFor(src);
    assert.ok(fs.existsSync(outPath), `expected generated page at ${path.relative(REPO_ROOT, outPath)}`);
  }
});

test('AC2: index page links to every generated page, grouped into named sections with source-H1 titles', () => {
  runBuild();
  const indexHtml = fs.readFileSync(path.join(SITE_DIR, 'index.html'), 'utf8');

  for (const section of ['World', 'Races', 'Characters', 'Cards', 'Rules']) {
    assert.ok(indexHtml.includes(section), `expected index.html to name section "${section}"`);
  }

  for (const src of sourceMdFiles()) {
    const rel = path.relative(REPO_ROOT, src).split(path.sep).join('/');
    const outRel = rel.slice(0, -'.md'.length) + '.html';
    assert.ok(indexHtml.includes(outRel), `expected index.html to link to ${outRel}`);

    const md = fs.readFileSync(src, 'utf8');
    const h1 = md.match(/^#\s+(.+?)\s*$/m);
    if (h1) {
      assert.ok(
        indexHtml.includes(escapeForCheck(h1[1].trim())),
        `expected index.html link text to include the source's first H1 "${h1[1].trim()}" for ${rel}`
      );
    }
  }
});

test('AC3: markdown structure renders as real HTML elements, not raw syntax', () => {
  runBuild();

  const cardAnatomyHtml = fs.readFileSync(
    path.join(SITE_DIR, 'design', 'cards', 'card-anatomy.html'),
    'utf8'
  );
  assert.ok(/<table>/.test(cardAnatomyHtml), 'expected a <table> from the field/zone mapping table');
  assert.ok(/<ul>/.test(cardAnatomyHtml) && /<li>/.test(cardAnatomyHtml), 'expected <ul>/<li> from a skeleton bullet list');
  assert.ok(!/\|---/.test(cardAnatomyHtml), 'raw table separator syntax should not leak through');

  const rulesHtml = fs.readFileSync(path.join(SITE_DIR, 'design', 'rules.html'), 'utf8');
  assert.ok(/<blockquote>/.test(rulesHtml), 'expected a <blockquote> from a worked card example');
  assert.ok(!/^&gt;\s/m.test(rulesHtml) && !/^>\s/m.test(rulesHtml), 'raw blockquote syntax should not leak through');
  assert.ok(/<ol>/.test(rulesHtml), 'expected an <ol> from a numbered worked example');
});

test('AC4: every non-index page has a nav resolving back to index.html, and no external asset references anywhere', () => {
  runBuild();
  const outFiles = walkFiles(SITE_DIR, (name) => name.endsWith('.html'));
  const indexAbsPath = path.resolve(path.join(SITE_DIR, 'index.html'));
  assert.ok(outFiles.length > 1);

  for (const file of outFiles) {
    const html = fs.readFileSync(file, 'utf8');

    for (const [, url] of html.matchAll(/(?:src|href)="([^"]*)"/g)) {
      assert.ok(!/^https?:\/\//i.test(url), `expected no external http(s) reference, found ${url} in ${path.relative(SITE_DIR, file)}`);
    }

    if (path.resolve(file) === indexAbsPath) continue;

    const navMatch = html.match(/<nav[\s\S]*?<\/nav>/);
    assert.ok(navMatch, `expected a <nav>...</nav> element in ${path.relative(SITE_DIR, file)}`);

    const hrefs = [...navMatch[0].matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    const resolvesToIndex = hrefs.some(
      (href) => path.resolve(path.dirname(file), href.split('/').join(path.sep)) === indexAbsPath
    );
    assert.ok(resolvesToIndex, `expected nav in ${path.relative(SITE_DIR, file)} to resolve back to index.html (hrefs: ${hrefs.join(', ')})`);
  }
});

test('AC5: the generator is deterministic — rerunning produces byte-identical output', () => {
  runBuild();
  const first = hashTree(SITE_DIR);
  runBuild();
  const second = hashTree(SITE_DIR);
  assert.strictEqual(first, second, 'expected identical site/ contents (by hash) across repeated runs');
});

test('World section: design/lore.md and design/star-atlas.md are grouped with design/world.md, not Other', () => {
  runBuild();
  const indexHtml = fs.readFileSync(path.join(SITE_DIR, 'index.html'), 'utf8');

  const worldSection = extractSectionHtml(indexHtml, 'World');
  assert.ok(worldSection, 'expected a World section in index.html');
  assert.ok(worldSection.includes('design/lore.html'), 'expected World section to link to design/lore.html');
  assert.ok(worldSection.includes('design/star-atlas.html'), 'expected World section to link to design/star-atlas.html');
  assert.ok(worldSection.includes('design/world.html'), 'expected World section to still link to design/world.html');

  const otherSection = extractSectionHtml(indexHtml, 'Other');
  if (otherSection) {
    assert.ok(!otherSection.includes('design/lore.html'), 'design/lore.html should not appear under Other');
    assert.ok(!otherSection.includes('design/star-atlas.html'), 'design/star-atlas.html should not appear under Other');
  }
});

test('Other section: playtest docs remain unclassified, unaffected by this unit', () => {
  runBuild();
  const indexHtml = fs.readFileSync(path.join(SITE_DIR, 'index.html'), 'utf8');

  const otherSection = extractSectionHtml(indexHtml, 'Other');
  assert.ok(otherSection, 'expected an Other section in index.html');
  assert.ok(otherSection.includes('design/playtest-full-game.html'), 'expected design/playtest-full-game.html to remain in Other');
  assert.ok(otherSection.includes('design/playtest-spatial.html'), 'expected design/playtest-spatial.html to remain in Other');
});
