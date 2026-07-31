'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { parseSections, findSection } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const CARDS_DIR = path.join(REPO_ROOT, 'design', 'cards');
const SITE_CARDS_DIR = path.join(REPO_ROOT, 'site', 'design', 'cards');
const INBOX_PATH = path.join(REPO_ROOT, 'design', 'ideas-inbox.md');
const RULES_MD = path.join(REPO_ROOT, 'design', 'rules.md');
const INDEX_HTML = path.join(REPO_ROOT, 'site', 'index.html');

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

// Each of the 10 files this unit targets. `marker` is the exact heading
// that begins the content immediately after "## Summary" — unchanged by
// this unit. `hash` is the sha256 of everything from that heading to
// end-of-file, captured from the repo BEFORE this unit's edit landed, i.e.
// it proves every "###" card entry and every heading after Summary is
// byte-for-byte unchanged, regardless of how long the Summary paragraph
// grows. If a LATER, unrelated unit legitimately edits one of these
// files' card entries, recompute by slicing the file's content from the
// marker string to EOF and sha256-hashing that slice.
const CARD_SET_FILES = [
  {
    file: 'alpha-set.md',
    h1: '# Alpha Set — First Cards of the Amaranth Expanse',
    marker: '## Magic — the Tangle',
    hash: '937a469c451505d3629ed4f9951d779535894a3a4f0cd3eadb328c4e6dd7e728',
    sentence: 'This starter set is the earliest published card list for *Wreck Tangle*, the game these five races and five Founts belong to.',
  },
  {
    file: 'frontier-set.md',
    h1: '# Frontier Set — Cards of the Battlefield Graph',
    marker: '## The Cindral Reach',
    hash: '662d00035c63d8e2c32f97a29bbca05944e0eaeed132f7effb3f4e578556198f',
    sentence: 'These cards belong to *Wreck Tangle*, the game whose battlefield graph every card here is built to exercise.',
  },
  {
    file: 'character-signatures.md',
    h1: '# Character Signatures — Named Cards for the Amaranth Expanse',
    marker: '## The Cindral Reach — Materials',
    hash: '9c2dfae95d674ef4576b653ea656b34fc2842356fbad112210f13a3e3b6eb248',
    sentence: 'Each of these signature cards carries a named face into *Wreck Tangle*, the card game they are playable in.',
  },
  {
    file: 'character-signatures-wave-2.md',
    h1: '# Character Signatures, Wave 2 — More Named Cards for the Amaranth Expanse',
    marker: '## The Cindral Reach — Materials',
    hash: 'be281b539358d71f25bd4ce0eb64ce20ffe397214943064fb049383c2206800c',
    sentence: "This second wave adds five more named faces to *Wreck Tangle*'s roster of playable signature cards.",
  },
  {
    file: 'character-signatures-wave-3.md',
    h1: '# Character Signatures, Wave 3 — A Third Named Card per Race',
    marker: '## The Cindral Reach — Materials',
    hash: '7f1f4b90cac1b030802c7814e97184b34ee5d87fdd4703c692e8ca474292b580',
    sentence: 'With this third wave, every race now has three named signature cards playable in *Wreck Tangle*.',
  },
  {
    file: 'spatial-race-identity-set.md',
    h1: '# Spatial Race Identity Set — Wormholes as Race Identity',
    marker: '## The Panoptic Concord',
    hash: '561d7c46d3e82996ce78522a20126e9a2083f115a70955f4396836b75e0b8839',
    sentence: "These three cards are *Wreck Tangle*'s first proof that race identity and the wormhole graph combine into real, playable cards.",
  },
  {
    file: 'spatial-race-identity-set-wave-2.md',
    h1: '# Spatial Race Identity Set, Wave 2 — Two More Races Grounded in the Graph',
    marker: '## The Mireth Bloom',
    hash: '8ac20a7d516bd8fdde53c95a2591c0b1b7e7e49496524f5d434aed2e5b10bb8c',
    sentence: "These two cards complete *Wreck Tangle*'s roster of wormhole-grounded race-identity cards, now covering all five races.",
  },
  {
    file: 'wormhole-restrictions-set.md',
    h1: '# Wormhole Restrictions Set — Locks on the Battlefield Graph',
    marker: '## The Cindral Reach',
    hash: 'a98d2b0c479f7518bc271c0e07db0a4d51d4ab0b6044c665aa5fd0bc837448da',
    sentence: 'These five cards give *Wreck Tangle* its first playable Wormhole Restrictions, one lock per race.',
  },
  {
    file: 'wormhole-closure-cards.md',
    h1: '# Wormhole Closure Cards — Sealing the Battlefield Graph',
    marker: '## The Cindral Reach',
    hash: '47dd8a77befa77647a7f7d8c0e7ebdc9af329daffb21e105f755c82858603925',
    sentence: 'These five cards give *Wreck Tangle* players their first way to Close a Wormhole outright, one per race.',
  },
  {
    file: 'fount-economy-set.md',
    h1: '# Fount Economy Set — Closing the Generator Gap',
    marker: '## The Mireth Bloom — Biology, the Bloom',
    hash: '1a194901930ab975efa641daec3f7007868d87834cf39b4c7ed7f2950d41ccec',
    sentence: "These six cards close *Wreck Tangle*'s Fount-economy gap, making Combat, deep Discovery, and Capture reachable for every deck.",
  },
];

for (const entry of CARD_SET_FILES) {
  test(`AC1/AC2: ${entry.file} names "Wreck Tangle" in its Summary, keeps H1 and every card entry byte-identical`, () => {
    const content = fs.readFileSync(path.join(CARDS_DIR, entry.file), 'utf8');

    assert.ok(content.startsWith(entry.h1), `expected ${entry.file}'s H1 to be unchanged`);

    const markerIdx = content.indexOf(entry.marker);
    assert.notStrictEqual(markerIdx, -1, `expected ${entry.file} to still contain "${entry.marker}"`);

    const summarySection = content.slice(0, markerIdx);
    assert.ok(
      summarySection.includes('Wreck Tangle'),
      `expected ${entry.file}'s Summary section to name "Wreck Tangle"`
    );

    const tail = content.slice(markerIdx);
    assert.strictEqual(
      sha256(tail),
      entry.hash,
      `expected ${entry.file}'s content from "${entry.marker}" onward (every "###" card entry) to be byte-for-byte unchanged`
    );
  });

  test(`AC3: ${entry.file} uses its own tailored sentence`, () => {
    const content = fs.readFileSync(path.join(CARDS_DIR, entry.file), 'utf8');
    assert.ok(
      content.includes(entry.sentence),
      `expected ${entry.file} to include: "${entry.sentence}"`
    );
  });
}

test('AC3: all 10 new sentences are pairwise distinct (no copy-paste)', () => {
  const sentences = CARD_SET_FILES.map((e) => e.sentence);
  assert.strictEqual(
    new Set(sentences).size,
    sentences.length,
    'expected 10 distinct tailored sentences'
  );
});

test("AC4: design/ideas-inbox.md's game-name heading carries the incorporated tag, and nothing else in the file changed", () => {
  const TAG = ' [incorporated: cardgame-game-name-card-set-docs]';
  const ORIGINAL_HASH = '3fb3f6fb45efe9337b5f4fa86633e7de6d2a43ad90f1c7d892daaf5328b98a13';
  const content = fs.readFileSync(INBOX_PATH, 'utf8');

  const headings = parseSections(content).filter((s) => s.level === 2);
  const idx = findSection(headings, /2026-07-29 — The game's name/);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "2026-07-29 — The game\'s name"');
  assert.ok(
    headings[idx].title.endsWith('[incorporated: cardgame-game-name-card-set-docs]'),
    `expected heading "${headings[idx].title}" to end with the incorporated tag`
  );

  const tagIdx = content.indexOf(TAG);
  assert.notStrictEqual(tagIdx, -1, 'expected the exact tag string to appear in the file');
  const withoutTag = content.slice(0, tagIdx) + content.slice(tagIdx + TAG.length);
  assert.strictEqual(
    sha256(withoutTag),
    ORIGINAL_HASH,
    'expected removing exactly the new tag to reproduce the original file byte-for-byte — i.e. nothing else in ideas-inbox.md changed'
  );
});

test('AC5: the 10 corresponding site/design/cards/*.html pages are regenerated and name "Wreck Tangle"', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });

  for (const entry of CARD_SET_FILES) {
    const htmlPath = path.join(SITE_CARDS_DIR, entry.file.replace(/\.md$/, '.html'));
    const html = fs.readFileSync(htmlPath, 'utf8');
    assert.ok(
      html.includes('Wreck Tangle'),
      `expected ${path.relative(REPO_ROOT, htmlPath)} to name "Wreck Tangle"`
    );
  }
});

test('out of scope: design/rules.md and the three card-spec/brief docs are byte-for-byte unchanged', () => {
  const GUARDS = [
    { path: RULES_MD, hash: '541bca0012c73487a3710bd2c0f524da5516e5191813419d96da176c5490501d' },
    { path: path.join(CARDS_DIR, 'card-anatomy.md'), hash: '99681c596a41999dc387979ffd4e6c48bc7bb3a1663f4d5a232ac2e0cf201356' },
    { path: path.join(CARDS_DIR, 'art-briefs.md'), hash: '26328f5e9a9208ca6d2820b597e0874f5bf709c80147e19e7cff513042883eef' },
    { path: path.join(CARDS_DIR, 'alt-art-briefs.md'), hash: 'c96add2a6100c9680c43b3efc8339e68076152926745c7419e3c4c923af97c37' },
    // Out of scope for THIS unit (see the GATE note in plan.md) even though
    // it also parses to cards — flagged, not silently claimed here.
    { path: path.join(CARDS_DIR, 'frontier-worlds-set.md'), hash: 'f058412b7941668fb27b94b86bc458fad63ea03e0402c359bb77c095843bf457' },
  ];
  for (const g of GUARDS) {
    const content = fs.readFileSync(g.path, 'utf8');
    assert.strictEqual(
      sha256(content),
      g.hash,
      `expected ${path.relative(REPO_ROOT, g.path)} to be byte-for-byte unchanged`
    );
  }
});

test('out of scope: site/index.html is not touched by rebuilding after this unit\'s edits', () => {
  const before = fs.readFileSync(INDEX_HTML, 'utf8');
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
  const after = fs.readFileSync(INDEX_HTML, 'utf8');
  assert.strictEqual(after, before, 'expected site/index.html to be unchanged by this unit');
});
