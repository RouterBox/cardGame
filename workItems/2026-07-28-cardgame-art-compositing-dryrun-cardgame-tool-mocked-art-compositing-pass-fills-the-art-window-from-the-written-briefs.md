# cardgame-art-compositing-dryrun: cardGame tool — mocked art-compositing pass fills the Art Window from the written briefs

## Header

- unit: cardgame-art-compositing-dryrun
- title: cardGame tool — mocked art-compositing pass fills the Art Window from the written briefs
- project: cardgame
- completed: 2026-07-28
- outcome: escalated
- start_sha: a49fe10b3ed00bb4bfd2b71cd235b2cf526cc148
- end_sha: a49fe10b3ed00bb4bfd2b71cd235b2cf526cc148

## Intent

T16 named the art-compositing step explicitly: 'Leonardo/gen-AI produces ONLY the art-window image, composited into its slot, because generators can't do text/symbols or hold a style across runs.' The layout engine (cardgame-card-authoring-engine) already renders every other zone from data and leaves the Art Window a placeholder rectangle for exactly this follow-up. This unit builds tools/composite-card-art.js: it reads design/cards/art-briefs.md, turns each brief into a generation request, and replaces the Art Window placeholder with an <image> element sized to the Art Window bounds from design/cards/card-anatomy.md. The art-generation call goes through an injectable client interface so the default path (and the whole test suite) uses a deterministic mock and makes zero real Leonardo API calls or spend — mirroring the dry-run-before-live pattern the ledger already validated for the Jaina sync tool (T17/T19/T20), so wiring a real Leonardo key stays a separate, later decision rather than bundled into this unit.

## Acceptance Criteria

- AC1 [user]: tools/composite-card-art.js exists; running `node tools/composite-card-art.js` exits 0 and writes exactly one composited SVG per brief section in design/cards/art-briefs.md into renders/cards-composited/.
- AC2 [paraphrase]: Each composited SVG's Art Window slot contains an <image> element (not the placeholder rect) positioned and sized to match the Art Window bounds defined in design/cards/card-anatomy.md.
- AC3 [inferred]: Image generation goes through an injectable client; the default/test client is a deterministic mock that makes no network calls and requires no Leonardo API key, so `node --test` runs fully offline.
- AC4 [inferred] (held_out): Running the script twice in a row with the mock client produces byte-identical output across all composited SVGs, verifiable by hashing.

## Plan

GATE: none

# Unit: cardgame-art-compositing-dryrun

## Summary

Build `tools/composite-card-art.js`. It reads `design/cards/art-briefs.md` (18
`###` brief sections, one per card in `design/cards/alpha-set.md`), and for
each brief: renders that card's full placeholder SVG using the **existing**
layout engine in `tools/render-card.js`, asks an **injectable art-generation
client** for an image, and swaps the Art Window's placeholder `<rect>`+label
for an `<image>` sized to the exact same bounds the placeholder rect used.
Output goes to `renders/cards-composited/<slug>.svg`, one file per brief.

The default (and only, for this unit) client is a deterministic mock: no
network calls, no API key, same output every run. A real Leonardo-backed
client is explicitly out of scope (per the unit intent) — it would be a
different object passed into the same `generateArt(...)` call.

### Design decision: where the Art Window bounds come from

`design/cards/card-anatomy.md` describes the Art Window only in prose ("the
large rectangular window beneath the Name Slot") — it has **no numeric
bounds**. The actual numbers (`x=24, y=94, width=702, height=420`) live only
in `tools/render-card.js`'s geometry constants, which is the executable
implementation of card-anatomy.md's zone layout. AC2's phrase "bounds defined
in design/cards/card-anatomy.md" is read as "the bounds that implement
card-anatomy.md's Art Window zone" — i.e. render-card.js's constants — not a
literal number that must appear in the .md file. This is not treated as a
spec bug (it's redundant with the visible intent, just imprecisely worded),
so no GATE.

To guarantee the composited `<image>` bounds can never drift out of sync
with the placeholder rect they replace, `composite-card-art.js` does **not**
hardcode a second copy of those numbers. Instead it:
1. Imports the geometry constants and the `renderCardSvg`/`loadAllCards`
   functions directly from `tools/render-card.js` (small, additive export
   change — see File 2 below).
2. Renders the full card SVG exactly as `render-card.js` would.
3. Regex-replaces the placeholder `<rect class="art-window".../>` +
   `<text>Art Placeholder</text>` pair with an `<image>` using those same
   imported bounds.

This also means every other zone in a composited SVG (frame bands, name,
cost pips, type line, rules text, stats corner) is byte-identical to what
`renders/cards/<slug>.svg` already contains — only the Art Window differs.

## Risk self-assessment (FIRE)

- **Reversibility:** high. All changes are new files or small additive
  exports guarded by `require.main === module`, which preserves every
  existing script's CLI behavior exactly (verified below).
- **Security impact:** none. No network calls, no secrets, no API keys in
  the default path.
- **User data:** none touched.
- **Schema changes:** none.

Low-risk, mechanical unit → **GATE: none**.

---

## File 1 (modify): `lib/parse-card-markdown.js`

Only the last line changes — export the already-existing internal
`splitIntoH3Sections` helper so `composite-card-art.js` can reuse it to parse
`art-briefs.md`'s `###` sections without duplicating that logic. No behavior
change to any existing export.

Find:
```js
module.exports = { parseCardMarkdown, slugify };
```

Replace with:
```js
module.exports = { parseCardMarkdown, slugify, splitIntoH3Sections };
```

That's the only change to this file.

---

## File 2 (modify): `tools/render-card.js`

Two changes, both at the very bottom of the file, both additive:

1. Guard the `main()` call so requiring this file as a library (from
   `composite-card-art.js`) does **not** re-run its CLI side effects
   (reading `design/cards/*.md` and rewriting `renders/cards/*.svg`).
2. Export the geometry constants, `loadAllCards`, `renderCardSvg`, and
   `escapeXml` so `composite-card-art.js` can reuse them instead of
   duplicating ~150 lines of SVG-building logic.

Find (the last two lines of the file):
```js
main();
```

Replace with:
```js
if (require.main === module) {
  main();
}

module.exports = {
  INNER_X,
  INNER_Y,
  INNER_WIDTH,
  NAME_SLOT_HEIGHT,
  ART_WINDOW_HEIGHT,
  loadAllCards,
  renderCardSvg,
  escapeXml,
};
```

**Why this is safe:** `test/render-card.test.js` invokes this script via
`execFileSync('node', [SCRIPT_PATH])` — when Node runs a file directly as the
entry script, `require.main === module` is `true`, so `main()` still runs
exactly as before and that test suite is unaffected. Confirm this by running
`node --test test/render-card.test.js` after making the change — it must
still report all tests passing, 0 failures.

---

## File 3 (create): `tools/composite-card-art.js`

```js
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
// ---------------------------------------------------------------------------

async function main(client = createMockLeonardoClient()) {
  const briefs = loadBriefs();
  const cardsByName = new Map(loadAllCards().map((card) => [card.name, card]));

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const brief of briefs) {
    const card = cardsByName.get(brief.cardName);
    if (!card) {
      throw new Error(`art-briefs.md brief "${brief.cardName}" has no matching card in design/cards/*.md`);
    }

    const baseSvg = renderCardSvg(card);
    const { href } = await client.generateArt({ cardName: card.name, brief: brief.text });
    const compositedSvg = compositeArtWindow(baseSvg, href);

    fs.writeFileSync(path.join(OUT_DIR, `${slugify(card.name)}.svg`), compositedSvg, 'utf8');
  }

  console.log(
    `Composited ${briefs.length} card art window(s) into ${path.relative(REPO_ROOT, OUT_DIR).split(path.sep).join('/')}/`
  );
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack || err.message || String(err));
    process.exitCode = 1;
  });
}

module.exports = {
  main,
  createMockLeonardoClient,
  compositeArtWindow,
  loadBriefs,
  ART_WINDOW_X,
  ART_WINDOW_Y,
  ART_WINDOW_WIDTH,
  ART_WINDOW_HEIGHT,
};
```

### Expected manual-run output

```
$ node tools/composite-card-art.js
Composited 18 card art window(s) into renders/cards-composited/
$ echo $?
0
```

`renders/cards-composited/` will contain 18 files, one per brief, named like
`renders/cards/` already is: `unwritten-hour.svg`, `oathbreaker-s-toll.svg`,
`echo-recall.svg`, `replicant-foundry-core.svg`, `firmware-sentinel.svg`,
`drone-cascade.svg`, `foreknowledge-cipher.svg`, `whispered-contract.svg`,
`static-ambush.svg`, `sporeknit-warden.svg`, `feral-bloomcaller.svg`,
`rootbind-thicket.svg`, `salvage-wrought-bastion.svg`,
`line-fleet-trooper.svg`, `cinder-forged-plating.svg`,
`wrought-bloom-graft.svg`, `signal-wrought-prototype.svg`,
`tangle-forged-bolt.svg`.

Each file's Art Window slot will contain, in place of the old
`<rect class="art-window" .../><text ...>Art Placeholder</text>`:

```xml
<image class="art-window" x="24" y="94" width="702" height="420" href="data:image/svg+xml;base64,...." preserveAspectRatio="xMidYMid slice"/>
```

Do **not** add `renders/cards-composited/` to `.gitignore` — `renders/cards/`
is already tracked in git (see `git status` at session start showing those
SVGs as modified), so the composited output should follow the same
convention and be committed.

---

## File 4 (create): `test/composite-card-art.test.js`

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'composite-card-art.js');
const BRIEFS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'art-briefs.md');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards-composited');

const { slugify, splitIntoH3Sections } = require('../lib/parse-card-markdown');
const composite = require('../tools/composite-card-art');

function listBriefTitles() {
  const markdown = fs.readFileSync(BRIEFS_PATH, 'utf8');
  return splitIntoH3Sections(markdown).map((s) => s.title);
}

function hashOutDir() {
  const hashes = {};
  for (const title of listBriefTitles()) {
    const file = path.join(OUT_DIR, `${slugify(title)}.svg`);
    hashes[title] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  }
  return hashes;
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
// AC1: running `node tools/composite-card-art.js` exits 0 and writes exactly
// one composited SVG per brief section in design/cards/art-briefs.md into
// renders/cards-composited/.
// ---------------------------------------------------------------------------

test('AC1: node tools/composite-card-art.js exits 0 and writes exactly one composited SVG per brief section', () => {
  assert.ok(
    !runError,
    `expected the script to exit 0, got: ${runError && (runError.message + '\n' + (runError.stdout || '') + (runError.stderr || ''))}`
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
// (not the placeholder rect) positioned and sized to match the Art Window
// bounds.
// ---------------------------------------------------------------------------

test('AC2: composited SVGs hold an <image> in the Art Window slot, sized to the layout engine bounds, placeholder rect gone', () => {
  assert.ok(!runError, 'compositing script must succeed before its output can be checked');

  const titles = listBriefTitles();
  for (const title of titles) {
    const file = path.join(OUT_DIR, `${slugify(title)}.svg`);
    const svg = fs.readFileSync(file, 'utf8');

    assert.ok(
      !/<rect[^>]*class="art-window"/.test(svg),
      `expected "${title}"'s composited SVG to have no remaining art-window placeholder rect`
    );

    const imageMatch = svg.match(/<image[^>]*class="art-window"[^>]*\/>/);
    assert.ok(imageMatch, `expected an <image class="art-window"> element in "${title}"'s composited SVG`);

    const tag = imageMatch[0];
    assert.strictEqual(Number(/\bx="([-\d.]+)"/.exec(tag)[1]), composite.ART_WINDOW_X);
    assert.strictEqual(Number(/\by="([-\d.]+)"/.exec(tag)[1]), composite.ART_WINDOW_Y);
    assert.strictEqual(Number(/\bwidth="([-\d.]+)"/.exec(tag)[1]), composite.ART_WINDOW_WIDTH);
    assert.strictEqual(Number(/\bheight="([-\d.]+)"/.exec(tag)[1]), composite.ART_WINDOW_HEIGHT);
    assert.ok(/href="/.test(tag), `expected the <image> element to carry an href in "${title}"'s composited SVG`);
  }
});

// ---------------------------------------------------------------------------
// AC3 (inferred): image generation goes through an injectable client; the
// default/test client is a deterministic mock that makes no network calls
// and requires no Leonardo API key.
// ---------------------------------------------------------------------------

test('AC3: default client is an injectable, deterministic mock requiring no network access or Leonardo API key', () => {
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

  assert.strictEqual(typeof composite.createMockLeonardoClient, 'function');
  assert.strictEqual(typeof composite.main, 'function');
});

test('AC3: main() succeeds with the default mock client even with no LEONARDO_API_KEY set', async () => {
  const previousKey = process.env.LEONARDO_API_KEY;
  delete process.env.LEONARDO_API_KEY;
  try {
    await assert.doesNotReject(composite.main());
  } finally {
    if (previousKey !== undefined) process.env.LEONARDO_API_KEY = previousKey;
  }
});

// ---------------------------------------------------------------------------
// AC4 (held_out): running the script twice in a row with the mock client
// produces byte-identical output across all composited SVGs.
// ---------------------------------------------------------------------------

test('AC4: running the script twice in a row produces byte-identical composited SVGs', () => {
  assert.ok(!runError, 'compositing script must succeed before its output can be checked');
  const firstRunHashes = hashOutDir();

  execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  const secondRunHashes = hashOutDir();

  assert.deepStrictEqual(secondRunHashes, firstRunHashes, 'expected identical SHA-256 hashes across two runs');
});
```

### Expected `node --test` output

All tests in the repo (existing suites + this new one) pass. The new file
alone contributes 5 `test(...)` blocks, all green, 0 failures. Example tail
of `node --test` output:

```
# pass 5
# fail 0
```

(exact aggregate pass count across the whole repo will be higher — just
confirm 0 fail, 0 cancelled for the full run).

---

## Build order for the implementer

1. Edit `lib/parse-card-markdown.js` (File 1) — one-line export change.
2. Edit `tools/render-card.js` (File 2) — guard `main()`, add exports.
3. Run `node --test test/render-card.test.js` — must still pass, confirming
   File 2's change didn't break the existing CLI behavior.
4. Create `tools/composite-card-art.js` (File 3).
5. Run `node tools/composite-card-art.js` manually once — confirm exit code
   0, confirm the console line, confirm `renders/cards-composited/` has 18
   `.svg` files, spot-check one file's Art Window slot by eye (`<image
   class="art-window" x="24" y="94" width="702" height="420" .../>`, no
   `<rect class="art-window"`).
6. Create `test/composite-card-art.test.js` (File 4).
7. Run `node --test` (full suite) — must be all green.


## Findings

# Blind Review — cardgame-art-compositing-dryrun, cycle 1

## Review visibility note (not gating)

The diff supplied for review includes `lib/parse-card-markdown.js`, all 18
new `renders/cards-composited/*.svg` files, and `test/composite-card-art.test.js`
(itself cut off mid-file). It does **not** include hunks for
`tools/composite-card-art.js` (the plan's File 3, the core deliverable) or
`tools/render-card.js` (the plan's File 2, the additive-export change) —
these are presumably present in the real commit but were not part of the
diff text I was given to review, most likely due to truncation. My
assessment of AC1–AC3 below is therefore based on the generated output
artifacts and the visible test file, not a direct read of the
implementation source. This is a review-input gap, not a code defect, so it
does not gate on its own — but it means source-level issues in those two
files (error handling, regex correctness, exports) could not be checked
directly.

## AC-by-AC accounting

**AC1** — `tools/composite-card-art.js` exists; running it exits 0 and
writes exactly one composited SVG per brief section into
`renders/cards-composited/`.
The diff adds exactly 18 new files under `renders/cards-composited/`,
matching the plan's stated "18 `###` brief sections, one per card in
`design/cards/alpha-set.md`". Filenames are slugified titles
(`cinder-forged-plating.svg`, `drone-cascade.svg`, ...), consistent with
`slugify()` reuse. Evidence supports AC1 for a fresh run. See finding #1 for
a caveat about post-test-run integrity of these same files.

**AC2** — each composited SVG's Art Window slot contains an `<image>`
element (not the placeholder rect), positioned/sized to the Art Window
bounds.
Every one of the 18 output files shows
`<image class="art-window" x="24" y="94" width="702" height="420" href="data:image/svg+xml;base64,..." preserveAspectRatio="xMidYMid slice"/>`
and no `<rect class="art-window">` remains. Bounds are consistent across all
18 files and match the plan's stated geometry
(`x=24, y=94, width=702, height=420`, i.e. `INNER_X`, `INNER_Y+NAME_SLOT_HEIGHT`,
`INNER_WIDTH`, `ART_WINDOW_HEIGHT`). AC2 is satisfied by the visible output.

**AC3** — image generation goes through an injectable client; default/test
client is a deterministic mock, no network calls, no API key needed, so
`node --test` runs fully offline.
`test/composite-card-art.test.js` asserts (via source-text checks) that
`composite-card-art.js` contains no `fetch(`, no `require('http'|'https')`,
and no `process.env.*LEONARDO*` read. It also verifies `main()` accepts an
injected client object and that the injected client's `href` shows up in
output, proving generation isn't hardcoded. The mock's data-URI href values
embedded in the 18 committed SVGs (`data:image/svg+xml;base64,...`, decodes
to a deterministic hash-colored placeholder SVG with the card's name) are
consistent with a deterministic, offline, hash-based mock as described in
the plan. AC3 is satisfied — with the caveat in finding #1.

## Findings

### Finding 1 (INTRODUCED) — running the test suite corrupts the committed compositing output it's supposed to verify

**File:** `test/composite-card-art.test.js`

In the visible portion of the file, the AC3 test titled *"image generation
is injected via a client argument — a custom client's output is used
instead of the default"* does this:

```js
const fakeClient = {
  async generateArt(request) {
    seenBriefs.push(request);
    return { href: 'data:image/png;base64,AAAA' };
  },
};
await composite.main(fakeClient);
```

`composite.main()` writes to `OUT_DIR`, which the test file itself defines
as `path.join(REPO_ROOT, 'renders', 'cards-composited')` — the exact same
directory the diff commits 18 real files into, and the same directory AC1's
own test just finished validating in an earlier test via
`execFileSync('node', [SCRIPT_PATH])`. The test asserts
`seenBriefs.length === titles.length` (i.e. **all 18** briefs get
re-processed through the fake client, not just one), then only spot-checks
`firstTitle`'s output file for the fake href.

**Failure scenario:** a developer (or CI) runs `node --test`. By the time
the suite finishes, every file in `renders/cards-composited/` —
`cinder-forged-plating.svg` through `wrought-bloom-graft.svg` — has had its
`<image href="...">` overwritten with the four-byte placeholder
`data:image/png;base64,AAAA`, replacing the real deterministic mock art with
a 1x1-ish broken image reference. If that working tree is then committed
(or if CI re-checks `git diff --exit-code` after running tests, or a
teammate `git status`es and is confused by 18 modified files), the
"deterministic, one real composited SVG per brief" guarantee AC1/AC2 exist
to provide is silently broken by the very test suite meant to enforce it.
Nothing in the visible test file restores the real mock output afterward
(no `test.after()` re-run of the default client, no writing to a temp
`OUT_DIR` for this one test).

This is squarely INTRODUCED — `OUT_DIR` and this test are new in this diff,
and the collision with the CLI-run output directory is what causes the
corruption. A minimal fix would be having this one test invoke
`composite.main(fakeClient, { outDir: tmpDir })` (if `main` supports an
output-dir override) or restoring the real mock output via
`test.after(() => composite.main(createMockLeonardoClient()))` /
re-running the CLI — but I did not see such a safeguard in the visible
portion of the file, including its truncated tail.

## Verdict rationale

AC1–AC3 are each satisfiable per the visible evidence, but the test file
that is supposed to lock AC3's injectable-client behavior in place has a
side effect that undermines AC1's own guarantee about the contents of
`renders/cards-composited/` immediately after a normal `node --test` run.
That's a concrete, INTRODUCED problem with a clear repro, not a
pre-existing or hypothetical one.

NEEDS_WORK


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T12:19:53.138Z] **bolt:start** — unit=cardgame-art-compositing-dryrun start_sha=a49fe10b3ed00bb4bfd2b71cd235b2cf526cc148 branch=bolt/cardgame-art-compositing-dryrun worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-art-compositing-dryrun
- [2026-07-28T12:20:02.938Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T12:26:36.742Z] **plan:done** — plan.md written
- [2026-07-28T12:31:29.585Z] **tests:done** — RED verified on test/composite-card-art.test.js (exit=1)
- [2026-07-28T12:33:33.316Z] **build:c1** — tests green, committed
- [2026-07-28T12:36:16.422Z] **review:c1** — NEEDS_WORK
- [2026-07-28T12:40:10.537Z] **build:c2** — tests green, committed
- [2026-07-28T12:40:10.603Z] **bolt:escalated** — no-change iteration (diff hash unchanged between cycles)


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
