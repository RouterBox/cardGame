# cardgame-site-world-section-categorization: Design-shelf site buries lore.md and star-atlas.md in a generic 'Other' bucket instead of grouping them with World — fix sectionFor()

## Header

- unit: cardgame-site-world-section-categorization
- title: Design-shelf site buries lore.md and star-atlas.md in a generic 'Other' bucket instead of grouping them with World — fix sectionFor()
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: d7c27b9d85a6f2ba1af121d176aac0c094f9a359
- end_sha: c774872bd04828c018d24bceb65123a68880ea97

## Intent

tools/build-site.js (shipped) generates the phone-browsable design-shelf site that exists specifically because RouterBox needs to 'see what we got without going over to my computer and picking through files and folders' (design/ideas-inbox.md, incorporated by cardgame-design-browser-site). Its sectionFor() function is the sole router deciding which of SECTION_ORDER's named buckets (World, Races, Characters, Cards, Rules, Plans & Ideas, Other) each design doc lands in on the generated index.html, and it currently has an explicit case for design/world.md ('World') but none for design/lore.md or design/star-atlas.md — both shipped, both core world-building documents (a 7-era history timeline and a 5-homeworld-plus-frontier-worlds atlas respectively) — so both fall through to the generic `return 'Other';` at the end of the function. This unit adds two more explicit cases to sectionFor() so relPath === 'design/lore.md' and relPath === 'design/star-atlas.md' both return 'World', grouping them on index.html with design/world.md exactly as their content already belongs. It leaves every other classification untouched: design/playtest-full-game.md, design/playtest-spatial.md, and any other unclassified doc continue to fall to 'Other' (explicitly out of scope for this unit), design/ideas-inbox.md and gamePlan.md keep their existing 'Plans & Ideas' mapping, and Races/Characters/Cards/Rules are untouched. Only tools/build-site.js's sectionFor() function and its owning test/build-site.test.js change — no design/*.md content, no rendering logic (renderMarkdown/renderBlocks/cardArtImgHtml), and no other tool is touched.

## Acceptance Criteria

- AC1 [paraphrase]: sectionFor('design/lore.md') and sectionFor('design/star-atlas.md') both return 'World' — verified by running node tools/build-site.js and checking that the generated site/index.html's World section contains links to both lore.html and star-atlas.html alongside world.html.
- AC2 [paraphrase]: No generated page for design/lore.md or design/star-atlas.md appears under an 'Other' section heading in site/index.html after this unit.
- AC3 [inferred]: Every other existing section's membership (Races, Characters, Cards, Rules, Plans & Ideas) is unchanged from before this unit, and design/playtest-full-game.md and design/playtest-spatial.md remain classified as 'Other' (not moved by this unit).
- AC4 [inferred] (held_out): Running node tools/build-site.js twice in a row produces byte-identical site/ output on both runs, matching the existing determinism guarantee already covered by test/build-site.test.js.
- AC5 [inferred] (held_out): test/build-site.test.js is updated to assert the new World-section membership against the real, current design/lore.md and design/star-atlas.md files, and every pre-existing assertion in that file still passes.

## Plan

GATE: none

# Plan: cardgame-site-world-section-categorization

## Summary

`tools/build-site.js`'s `sectionFor(relPath)` (lines 103–112) has an explicit
case for `design/world.md` → `'World'` but none for `design/lore.md` or
`design/star-atlas.md`, so both currently fall through to the trailing
`return 'Other';`. Add two explicit cases so both map to `'World'`, and add
test coverage in `test/build-site.test.js` that asserts the new grouping
against the real generated `site/index.html`. Nothing else changes.

This is a tiny, mechanical, low-risk change: two added `if` lines in a pure
function plus two added assertions in an existing test file. No schema, no
user data, fully reversible via git revert.

## Files to change

1. `tools/build-site.js` — add 2 lines inside `sectionFor()`.
2. `test/build-site.test.js` — add 2 new `test(...)` blocks plus one small
   shared helper.

No other file is touched. Do not touch `design/*.md` content, `renderMarkdown`,
`renderBlocks`, `cardArtImgHtml`, or any other tool.

---

## Step 1 — `tools/build-site.js`

Current code (lines 103–112):

```js
function sectionFor(relPath) {
  if (relPath === 'gamePlan.md') return 'Plans & Ideas';
  if (relPath === 'design/ideas-inbox.md') return 'Plans & Ideas';
  if (relPath === 'design/world.md') return 'World';
  if (relPath === 'design/rules.md') return 'Rules';
  if (relPath.startsWith('design/races/')) return 'Races';
  if (relPath.startsWith('design/characters/')) return 'Characters';
  if (relPath.startsWith('design/cards/')) return 'Cards';
  return 'Other';
}
```

Change it to (insert two lines immediately after the `design/world.md` line):

```js
function sectionFor(relPath) {
  if (relPath === 'gamePlan.md') return 'Plans & Ideas';
  if (relPath === 'design/ideas-inbox.md') return 'Plans & Ideas';
  if (relPath === 'design/world.md') return 'World';
  if (relPath === 'design/lore.md') return 'World';
  if (relPath === 'design/star-atlas.md') return 'World';
  if (relPath === 'design/rules.md') return 'Rules';
  if (relPath.startsWith('design/races/')) return 'Races';
  if (relPath.startsWith('design/characters/')) return 'Characters';
  if (relPath.startsWith('design/cards/')) return 'Cards';
  return 'Other';
}
```

That is the entire production-code change. Everything downstream
(`discoverSourceFiles`, `buildIndexHtml`, `pagesBySection`) already handles
any relPath → section mapping generically; no other line needs to move.

Do NOT touch `design/playtest-full-game.md`, `design/playtest-spatial.md`, or
any other relPath — they must keep falling through to `'Other'`.

---

## Step 2 — `test/build-site.test.js`

The existing file already has a `runBuild()` helper (line 15–17) and reads
`site/index.html` in its `AC2` test. Add a small helper to pull one
`<section>...</section>` block out of `index.html` by its `<h2>` title, then
two new tests that use it. Insert the helper right after `escapeForCheck`
(after line 43), and the two new tests right after the last existing test
(after line 137, i.e. at the end of the file, before nothing — it's the last
test currently).

### 2a. Add helper (after `escapeForCheck`, i.e. after current line 43)

```js
function extractSectionHtml(indexHtml, sectionTitle) {
  const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = indexHtml.match(new RegExp(`<section>\\n<h2>${escaped}</h2>[\\s\\S]*?</section>`));
  return m ? m[0] : null;
}
```

This mirrors the exact `<section>\n<h2>...\n</section>` shape emitted by
`buildIndexHtml()` in `tools/build-site.js` (see its `.map((section) => ...)`
block), so it reliably isolates one named section's HTML (including its
`<ul><li><a href=...>` entries) from the rest of the index page.

### 2b. Add two new tests (at the end of the file, after the existing
`'AC5: the generator is deterministic...'` test, i.e. after line 137)

```js
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
```

Notes for the implementer:
- `design/lore.md` and `design/star-atlas.md` both exist today in the repo
  and both start with an `# H1` (`# The Long Record — A Chronicle of the
  Amaranth Expanse` and `# The Star Atlas` respectively), so `buildPageHtml`
  will use those as page titles — irrelevant to this test, which only checks
  the `outRelPath` hrefs (`design/lore.html`, `design/star-atlas.html`).
- `outRelPath` values always use `/` (see `outputRelPath()` /
  `discoverSourceFiles()`, which join with `.split(path.sep).join('/')`), so
  the literal string `'design/lore.html'` is safe to search for on all
  platforms including Windows.
- Do not rename or remove any pre-existing test in this file — AC5 (held
  out) requires every pre-existing assertion to still pass.

---

## Expected output after the change

Running:

```
node tools/build-site.js
```

prints (unchanged format):

```
Built <N> pages into site/
```

where `<N>` is the same page count as before (no pages added or removed —
only their section changed). `site/index.html`'s `World` section's `<ul>`
will now contain three `<li><a>` entries — for `design/world.html`,
`design/lore.html`, and `design/star-atlas.html` (exact order follows
existing `pagesBySection` insertion order, which follows `discoverSourceFiles`'s
sorted-by-relPath order: `design/lore.md` < `design/star-atlas.md` <
`design/world.md` alphabetically, so lore.html appears first, then
star-atlas.html, then world.html). The `Other` section's `<ul>` will no
longer contain `design/lore.html` or `design/star-atlas.html`, but will still
contain `design/playtest-full-game.html` and `design/playtest-spatial.html`.

Running:

```
npm test
```

(equivalently `node --test --test-concurrency=1`) runs all suites including
`test/build-site.test.js`, `test/build-site-card-art.test.js`, and
`test/build-site-cards-index.test.js`. Expected: all pass, with 2 new test
cases added to `test/build-site.test.js`'s pass count. No other test file
needs to change — `build-site-card-art.test.js` and
`build-site-cards-index.test.js` don't assert on `sectionFor`/section
membership (confirm this by reading them before starting, but the unit spec
says only `build-site.test.js` is the "owning test" for this function, and
those two files are about card-art compositing / the cards index table, not
sections).

## Acceptance criteria mapping

- AC1: covered by the new "World section: ..." test (checks `lore.html` and
  `star-atlas.html` both appear in the `World` `<section>` alongside
  `world.html`).
- AC2: covered by the same test's negative assertions against the `Other`
  section.
- AC3: covered by the new "Other section: playtest docs remain
  unclassified..." test, plus the untouched pre-existing `AC2` test in the
  same file (line 64–86 in the current file) which already asserts `World`,
  `Races`, `Characters`, `Cards`, `Rules` section names and per-file links
  still exist — since no other `sectionFor` branch changed, that test's
  behavior is unaffected and must still pass unmodified.
- AC4 (held out): already covered, unmodified, by the pre-existing
  `'AC5: the generator is deterministic — rerunning produces byte-identical
  output'` test in `test/build-site.test.js` (line 131–137) — this unit adds
  no new source of nondeterminism (no `Date.now()`, no unordered iteration),
  so that test requires no change and should keep passing.
- AC5 (held out): satisfied by Step 2 above — new assertions run against the
  real, current `design/lore.md` and `design/star-atlas.md` files (via a real
  `runBuild()` + reading the real generated `site/index.html`, not mocks),
  and no pre-existing test in the file is modified or removed.

## Risk self-assessment (FIRE)

- **Reversibility**: trivial — a 2-line pure-function change plus additive
  test code; `git revert` fully undoes it.
- **Impact/blast radius**: confined to `tools/build-site.js` and
  `test/build-site.test.js`; no other tool, no design content, no schema.
- **Security**: none — no user input, no network, no secrets.
- **User data**: none — this is a local static-site generator for design
  docs; no data model or persistence touched.

Risk class: standard. No confirmation gate needed.


## Findings

# Review: cardgame-site-world-section-categorization (cycle 1)

## AC coverage

- **AC1** (`sectionFor('design/lore.md')` / `sectionFor('design/star-atlas.md')` → `'World'`,
  visible in generated `index.html`): Confirmed. `tools/build-site.js` lines 107–108 add the
  two exact cases specified in plan.md, verbatim. `site/index.html`'s World `<section>` now
  lists `design/lore.html`, `design/star-atlas.html`, `design/world.html` (alphabetical, as
  plan.md predicted). New test `'World section: ...'` in `test/build-site.test.js` asserts
  this directly against the real generated output. **Met.**

- **AC2** (no `Other` entry for lore/star-atlas): Confirmed. The `index.html` diff removes
  exactly those two `<li>` entries from the `Other` section and nothing else. New test asserts
  their absence from the `Other` section. **Met.**

- **AC3** (every other section unchanged; playtest docs stay in `Other`): Confirmed. The diff
  contains no hunks touching the Races/Characters/Cards/Rules/Plans & Ideas sections of
  `index.html` (i.e. unchanged). `Other` retains both `design/playtest-full-game.html` and
  `design/playtest-spatial.html`; per-page sibling nav in `playtest-full-game.html` /
  `playtest-spatial.html` was regenerated consistently (each now only lists the other, since
  lore/star-atlas left `Other`) — this is expected, deterministic fallout of the section
  change, not a manual edit. New test `'Other section: ...'` covers this. **Met.**

## Diff scope check

- `tools/build-site.js`: only the two new `if` lines inside `sectionFor()`, matching plan.md
  exactly (verified by reading the file directly — see note below on why the diff itself
  didn't show text).
- `test/build-site.test.js`: adds `extractSectionHtml()` helper and two new tests, exactly as
  specified in plan.md. No existing test renamed/removed/modified (AC5 determinism test
  untouched).
- `site/**/*.html`: regenerated build output (lore, star-atlas, world, playtest-full-game,
  playtest-spatial, index.html) — all changes are consistent with a real re-run of the
  generator (nav "siblings" cross-links line up correctly across all five affected pages;
  ordering matches `discoverSourceFiles`'s alphabetical sort). No hand-edited HTML.
- No changes to `design/*.md` content, `renderMarkdown`/`renderBlocks`/`cardArtImgHtml`, or any
  other tool — confirmed via diff scope and via grep, `test/build-site-card-art.test.js` and
  `test/build-site-cards-index.test.js` contain no section-related assertions, so they're
  correctly left untouched.

## Investigated: `tools/build-site.js` showing as "Binary files ... differ"

The diff supplied for review renders `tools/build-site.js` as a binary diff instead of a text
diff, which could look like a corrupted/introduced encoding problem. Investigated directly in
the worktree:

- The file is plain ASCII/UTF-8 text with CRLF line endings — reading it (via the `Read` tool
  and via `od`) shows normal source, including the exact `sectionFor()` change described above.
- It contains exactly 4 literal NUL (`\0`) bytes, all inside the pre-existing `protect()` /
  restore regex (`` `\0${protectedTokens.length}\0` `` and `/\0(\d+)\0/g`) — an intentional
  sentinel-token technique to shield already-rendered HTML spans from markdown escaping, unrelated
  to this unit.
- Confirmed via `git show HEAD~1:tools/build-site.js` that these same 4 NUL bytes were already
  present **before** this unit's commit — git's binary-detection heuristic (any NUL byte in the
  sampled content) was already tripping on this file pre-existing this diff.

**Classification: PRE-EXISTING, not gating.** This is a repo/tooling quirk (this file has always
displayed as a binary diff to git) that predates this unit and isn't something the unit could
reasonably have avoided — it doesn't touch that part of the file. Not a functional issue: NUL
bytes inside a JS string/template literal are valid and don't affect `node`'s ability to
require/run the file.

## Other observations

- No production logic beyond `sectionFor()` changed; `pagesBySection`/`buildIndexHtml`/nav
  rendering handled the new grouping generically as plan.md predicted, so no risk of missed
  cascading updates.
- Working tree is clean after inspection; no stray/uncommitted files.

## Verdict

No INTRODUCED findings. All three visible ACs are met, scope matches plan.md exactly, and the
one anomaly worth investigating (binary-flagged `build-site.js`) traces to pre-existing repo
state, not this diff.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T10:52:09.636Z] **bolt:start** — unit=cardgame-site-world-section-categorization start_sha=d7c27b9d85a6f2ba1af121d176aac0c094f9a359 branch=bolt/cardgame-site-world-section-categorization worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-site-world-section-categorization
- [2026-07-29T10:52:18.716Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T10:53:40.934Z] **plan:done** — plan.md written
- [2026-07-29T10:54:54.101Z] **tests:done** — RED verified on test/build-site.test.js (exit=1)
- [2026-07-29T10:55:38.834Z] **build:c1** — tests green, committed
- [2026-07-29T10:58:18.947Z] **review:c1** — APPROVE
- [2026-07-29T11:03:06.644Z] **review:devils-advocate** — APPROVE
- [2026-07-29T11:03:14.726Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T11:03:15.097Z] **merge:done** — auto-merged bolt/cardgame-site-world-section-categorization into master (worktree)


## Receipt

```json
{
  "start_sha": "d7c27b9d85a6f2ba1af121d176aac0c094f9a359",
  "end_sha": "28c04ab05b04aeebc20165d444397aac24ac4464",
  "diff_nonempty": true,
  "test_cmd": "node --test",
  "exit_code": 0,
  "criteria_covered": [
    {
      "id": "AC1",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC2",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC3",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": true,
      "passed": true
    },
    {
      "id": "AC5",
      "held_out": true,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-29T11:03:14.724Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-site-world-section-categorization\\plan.md`.\n\nSummary: two `if` lines added to `sectionFor()` in `tools/build-site.js` (lore.md, star-atlas.md → 'World'), plus two new tests in `test/build-site.test.js` asserting the new World-section membership and that playtest docs stay in Other. `GATE: none` — trivial, reversible, no schema/security/data impact.",
    "test_writer": "The file matches the plan exactly. Since `sectionFor()` in `tools/build-site.js` doesn't yet have cases for `design/lore.md` or `design/star-atlas.md`, both currently fall through to `'Other'`, so the new \"World section: ...\" test will fail against current code (its `worldSection.includes('design/lore.html')` assertion fails, and the `Other` section will contain them) — confirming RED. No files under `src/` were touched.\n\nSummary: added `extractSectionHtml` helper and two new tests (`World section: design/lore.md and design/star-atlas.md are grouped...` covering AC1/AC2, and `Other section: playtest docs remain unclassified...` covering AC3) to `test/build-site.test.js`. All pre-existing tests were left untouched. `tools/build-site.js` was not modified.",
    "builder_c1": "test/ is untouched (empty diff), and only tools/build-site.js plus generated site/ output changed — exactly as scoped. Test suite is green: 757/757 passing.\n\nUnit `cardgame-site-world-section-categorization` is complete: added two lines to `sectionFor()` in `tools/build-site.js` mapping `design/lore.md` and `design/star-atlas.md` to `'World'`, matching the plan exactly. Full suite passes (757/757), `test/` directory is untouched.",
    "reviewer_c1": "All three visible ACs are met, the diff is scoped exactly to `sectionFor()` plus its owning test file and regenerated `site/` output, and the one anomaly (the file diffing as \"binary\") traces to pre-existing NUL-byte sentinel tokens in `protect()` that were already there before this unit's commit — confirmed via `git show HEAD~1`.\n\nAPPROVE",
    "devils_advocate": "Devil's-advocate attempt: I traced the one place a hidden bug could plausibly survive review — `tools/build-site.js` shows as `Binary files ... differ` in the diff, meaning nobody actually saw the real code change in the raw diff text, only the paraphrase and the rendered HTML deltas. That's a real gap in reviewability.\n\nBut verifying it directly: `git show HEAD~1:tools/build-site.js` (the commit *before* this unit) is *also* flagged as binary by `file`/git's heuristics, at the same relative position in `sectionFor()` shifted only by the byte-count of the two added lines. So whatever trips the binary heuristic is pre-existing, not introduced by this diff — and reading the file directly (not through git diff) shows the change is exactly the two intended lines, nothing else:\n\n```js\nif (relPath === 'design/lore.md') return 'World';\nif (relPath === 'design/star-atlas.md') return 'World';\n```\n\nI then hand-traced every touched HTML file against `discoverSourceFiles()`'s alphabetical sort invariant (lore.md < star-atlas.md < world.md) and confirmed every sibling-nav list and both index.html sections (`World` gains lore/star-atlas in correct order, `Other` loses exactly those two, keeps the two playtest docs) match what the code would actually produce. Checked the full `design/*.md` listing — no other file was eligible for `Other`→`World` reclassification that the diff might have missed. AC1–AC3 all hold.\n\nI could not execute `node --test` in this sandbox (repeatedly denied approval), so this is a static/manual verification rather than a live test run, but nothing in the diff itself shows an introduced defect.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
