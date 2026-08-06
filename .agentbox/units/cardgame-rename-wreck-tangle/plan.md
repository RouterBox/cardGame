GATE: confirm

# Plan: cardgame-rename-wreck-tangle

## Judgment calls to confirm before/while building (read this first)

The visible ACs (AC1-AC3) fully pin down `design/rules.md` and
`site/index.html`. Two things in the Intent paragraph are **not** covered by
any AC, so this plan makes an explicit interpretive call on each — flagging
per the "ask, don't assume" rule rather than silently deciding:

1. **`gamePlan.md` "should be updated"** — but `gamePlan.md` currently
   doesn't name the game *or* the setting anywhere (it's raw brainstorm
   prose starting "Galactic civilizations themed TCG."). There is no
   existing "Amaranth Expanse" text to swap for "Wreck Tangle" — the only
   way to "update" it per the Intent is to *introduce* the name. This plan
   adds a one-line `# Wreck Tangle — Game Plan` heading at the top,
   matching how every other design doc (`design/world.md`'s
   `# The Amaranth Expanse`, `design/rules.md`'s own H1) names itself. This
   also naturally makes `site/gamePlan.html`'s title/nav-link read "Wreck
   Tangle — Game Plan" once rebuilt, reinforcing "propagate ... everywhere
   a reader meets it" — but no AC actually tests `gamePlan.md` or
   `gamePlan.html` content, so confirm this interpretation is wanted before
   building, or say what to do instead (e.g. leave `gamePlan.md` untouched).

2. **`design/DESIGN-READINESS.md` line 14** currently reads:
   `` `design/rules.md` ("Amaranth Expanse — Core Rules") currently defines 15 `` —
   a direct quote of `rules.md`'s *old* title. Once `rules.md`'s H1 changes
   (AC1), this quote goes stale/wrong. `DESIGN-READINESS.md` is not named
   in unit.md's file list and no AC touches it, but leaving a direct
   misquote of the rulebook's real title in a doc that exists specifically
   to cite facts accurately seems worse than a 1-line fix. This plan
   updates just that quoted phrase. Confirm, or say to leave it stale.

Everything else below (design/rules.md, tools/build-site.js, the new test
file) is directly required by AC1-AC3 and not in question.

## Scope check (T-size)

Single bolt. Four small edits (two prose files, one doc-consistency
one-liner, one code file's two hardcoded strings) plus one new test file.
No renames, no new tools, no schema/data changes. Well within one
plan → test → build → review cycle.

## Facts verified by inspection (do not re-derive — given so the junior
doesn't need to re-search)

- `design/ideas-inbox.md` already has RouterBox's verbatim naming decision
  (committed in `d3ae59e`, 2026-07-29): the game is **Wreck Tangle**; "The
  Amaranth Expanse" remains the SETTING name. This unit does not touch
  `design/ideas-inbox.md` again — it's already correct.
- `design/rules.md`'s only occurrence of the string "Amaranth Expanse"
  anywhere in the file is its own H1 title on line 1 (`# Amaranth Expanse
  — Core Rules`). The body (Section 1 "Game Concepts" onward) never says
  "Amaranth Expanse" — it refers to the setting only via "the five Founts
  described in *design/world.md*". Confirmed via grep across the whole
  file.
- `design/rules.md`'s structure tests
  (`test/design-rules-structure.test.js`, `test/design-rules.test.js`) only
  ever inspect `## N. Title` / `### N.M Title` headings via
  `test/helpers/markdown.js`'s `parseSections` (which starts at level 2)
  and raw `//`-marker lines. Neither reads or asserts on the H1 (line 1) or
  any text between the H1 and the first `## 1.` heading. Adding a new
  paragraph there, and changing the H1 text, is 100% safe against both
  test files — verified by reading both in full.
- `tools/build-site.js`'s `buildIndexHtml()` (lines 501-533) hardcodes
  `<title>Amaranth Expanse — Design Shelf</title>` (line 518) and
  `<h1>Amaranth Expanse — Design Shelf</h1>` (line 523) — these two literal
  strings are the entire "site header and index page title" AC2 refers to.
  Every *other* generated page's `<title>` uses
  `` `${escapeHtml(page.title)} — Amaranth Expanse Design` `` (line 463,
  `buildPageHtml`) — a per-page suffix naming the design-shelf publication
  itself, not the index page. AC2 only requires the *index* page's
  title/header to lead with Wreck Tangle, so this plan leaves that
  per-page suffix (and `buildCardsIndexHtml`'s `All Cards — Amaranth
  Expanse Design` title) untouched — out of the stated scope, lower risk.
- `test/build-site.test.js`'s AC2 test
  (`'AC2: index page links to every generated page ...'`) derives expected
  link text **live** from each source `.md` file's own H1 at test-run time
  (`md.match(/^#\s+(.+?)\s*$/m)`) rather than hardcoding any title string —
  confirmed by reading the test. So changing `design/rules.md`'s H1 and
  adding one to `gamePlan.md` cannot break this test; the test will just
  expect the new title text, which the rebuilt `index.html` will contain.
- No existing test anywhere in `test/` contains the literal string "Amaranth
  Expanse — Core Rules" or otherwise hardcodes `rules.md`'s or
  `gamePlan.md`'s title text — confirmed by grep across `test/`. No test
  currently contains the string "Wreck Tangle" anywhere (confirmed by
  grep) — this unit is the first to introduce it into any test.
- `test/design-readiness.test.js` (the test for `design/DESIGN-READINESS.md`)
  never asserts the literal string "Core Rules" or "Amaranth Expanse —
  Core Rules" — it only checks that each of `rules.md`'s live `## N. Title`
  section titles appears somewhere in the doc, and that file citations
  (`design/world.md`, etc.) are present. Editing line 14's quoted phrase
  cannot break it — confirmed by reading the full test file.

## Files to modify

1. `design/rules.md` — modify (H1 + one new intro paragraph; AC1)
2. `tools/build-site.js` — modify (2 hardcoded strings in `buildIndexHtml()`; AC2)
3. `gamePlan.md` — modify (add one H1 line; judgment call 1 above)
4. `design/DESIGN-READINESS.md` — modify (1-line quote fix; judgment call 2 above)
5. `test/design-game-name.test.js` — **create** (new file; AC3)

Do not touch any other file. Do not rename any file, card, race, or
character (AC4). Do not touch `design/ideas-inbox.md` (already correct).
Do not touch `site/**` by hand — it is fully regenerated by running
`node tools/build-site.js` (step 6 below); hand-editing generated HTML
would just be overwritten and is wasted work.

Note: `git status` currently shows `site/design/ideas-inbox.html` as
modified-but-uncommitted in the working tree (a stale local rebuild
artifact reflecting `design/ideas-inbox.md`'s already-committed naming
entry — unrelated to anything this unit does). Running
`node tools/build-site.js` in step 6 will regenerate the *entire* `site/`
tree deterministically, including this file, as a normal side effect — no
special handling needed, just let the rebuild happen.

---

## Edit 1 of 4: `design/rules.md` — game title + setting framing (AC1)

Find this exact existing text at the very top of the file (lines 1-9):

```markdown
# Amaranth Expanse — Core Rules

## 1. Game Concepts

Two challengers face each other, each commanding a civilization drawn from one of
the five Founts described in *design/world.md*: the Mass, the Bloom, the Signal,
the Circuit, and the Tangle. Each challenger brings a deck of cards representing
that civilization's generators, combatants, and effects, and begins the game
defending a home base.
```

Replace it with:

```markdown
# Wreck Tangle — Core Rules

*Wreck Tangle* is set in the Amaranth Expanse — the galaxy described in full
in *design/world.md*.

## 1. Game Concepts

Two challengers face each other, each commanding a civilization drawn from one of
the five Founts described in *design/world.md*: the Mass, the Bloom, the Signal,
the Circuit, and the Tangle. Each challenger brings a deck of cards representing
that civilization's generators, combatants, and effects, and begins the game
defending a home base.
```

Only the H1 line and the new one-line paragraph after it are new. Nothing
from `## 1. Game Concepts` onward changes. Do not renumber or touch any
other section — this is the only edit to this file.

## Edit 2 of 4: `tools/build-site.js` — index page title/header (AC2)

In `buildIndexHtml()`, find this exact existing text (around line 512-524):

```js
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Amaranth Expanse — Design Shelf</title>',
    `<style>${CSS}</style>`,
    '</head>',
    '<body>',
    '<main>',
    '<h1>Amaranth Expanse — Design Shelf</h1>',
    '<p><a href="cards-index.html">All Cards</a> · <a href="phoenix-gallery.html">Phoenix Card Gallery (illustrated)</a></p>',
```

Replace only the `<title>` and `<h1>` lines (leave every other line,
including the `<p>` link line right after, unchanged):

```js
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Wreck Tangle — Design Shelf</title>',
    `<style>${CSS}</style>`,
    '</head>',
    '<body>',
    '<main>',
    '<h1>Wreck Tangle — Design Shelf</h1>',
    '<p><a href="cards-index.html">All Cards</a> · <a href="phoenix-gallery.html">Phoenix Card Gallery (illustrated)</a></p>',
```

Do not touch `buildPageHtml()`'s `` `${escapeHtml(page.title)} — Amaranth
Expanse Design` `` title suffix (line ~463) or `buildCardsIndexHtml()`'s
`'<title>All Cards — Amaranth Expanse Design</title>'` (line ~570) — out of
scope per the "Facts verified by inspection" note above. Do not touch
anything else in this file.

## Edit 3 of 4: `gamePlan.md` — introduce the game name (judgment call 1)

Find this exact existing text (the very first line of the file):

```
Galactic civilizations themed TCG.
```

Replace it with (adds a new H1 line and a blank line before the existing
first line; the existing first line itself is untouched):

```
# Wreck Tangle — Game Plan

Galactic civilizations themed TCG.
```

Nothing else in `gamePlan.md` changes.

## Edit 4 of 4: `design/DESIGN-READINESS.md` — fix stale title quote (judgment call 2)

Find this exact existing text (line 14):

```
`design/rules.md` ("Amaranth Expanse — Core Rules") currently defines 15
numbered top-level sections:
```

Replace it with:

```
`design/rules.md` ("Wreck Tangle — Core Rules") currently defines 15
numbered top-level sections:
```

Nothing else in `design/DESIGN-READINESS.md` changes.

---

## New file: `test/design-game-name.test.js` (AC3)

Create this file with exactly the following content:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const RULES_PATH = path.join(REPO_ROOT, 'design', 'rules.md');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const INDEX_PATH = path.join(REPO_ROOT, 'site', 'index.html');

test('AC3: "Wreck Tangle" appears in design/rules.md', () => {
  const rulesText = fs.readFileSync(RULES_PATH, 'utf8');
  assert.ok(
    rulesText.includes('Wreck Tangle'),
    'expected design/rules.md to name the game "Wreck Tangle"'
  );
});

test('AC3: "Wreck Tangle" appears in site/index.html', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
  const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');
  assert.ok(
    indexHtml.includes('Wreck Tangle'),
    'expected site/index.html to name the game "Wreck Tangle"'
  );
});
```

Notes for the junior implementer on this test file:
- It rebuilds the site itself (`execFileSync(process.execPath, [BUILD_SCRIPT], ...)`)
  before reading `site/index.html`, the same pattern
  `test/build-site.test.js`'s own `runBuild()` helper uses — this guarantees
  the test checks freshly generated output, not a possibly-stale committed
  copy of `site/index.html`.
- Deliberately two separate `test(...)` calls (one per file) rather than one
  combined test, so a failure output tells you immediately which of the two
  source-of-truth files (`design/rules.md` vs. the generated
  `site/index.html`) is missing the name.
- Do not add a third test asserting on `gamePlan.md`/`gamePlan.html` or
  `design/DESIGN-READINESS.md` — AC3 only names `design/rules.md` and
  `site/index.html`; the other two files are judgment-call edits (see top
  of this plan), not separately gated by any AC.

---

## Commands to run, and expected output

1. **Before any edit (RED check for the new test):**
   ```
   node --test test/design-game-name.test.js
   ```
   Fails: `design/rules.md` does not yet contain "Wreck Tangle" (first test
   fails), and the freshly-rebuilt `site/index.html` does not either (second
   test fails). Expected summary line: `# fail 2`, `# pass 0`.

2. **After Edit 1 only (`design/rules.md`), before Edit 2:**
   ```
   node --test test/design-game-name.test.js
   ```
   First test (`design/rules.md`) now passes. Second test likely passes
   too at this point: `site/index.html`'s own hardcoded `<title>`/`<h1>`
   still read "Amaranth Expanse — Design Shelf" (Edit 2 not applied yet),
   but its Rules-section link text is generated live from `rules.md`'s H1
   (per `test/build-site.test.js`'s AC2 pattern — see "Facts verified by
   inspection"), which is now "Wreck Tangle — Core Rules" — so the string
   "Wreck Tangle" already appears somewhere in `site/index.html` via that
   link. Either outcome is fine; proceed to Edit 2 regardless of whether
   this intermediate run is green or red.

3. **After all 4 edits + new test file:**
   ```
   node --test
   ```
   Expected: `# fail 0`. Every existing test file still passes unchanged
   (no test anywhere hardcodes the old "Amaranth Expanse — Core Rules" /
   "Amaranth Expanse — Design Shelf" strings — verified above), plus both
   new tests in `test/design-game-name.test.js` pass. `node --test` is this
   repo's declared test command (`package.json`'s `"test"` script also runs
   this, with `--test-concurrency=1`).

4. **Manual visual sanity check (optional but recommended given this is a
   site-facing rename):**
   ```
   node tools/build-site.js
   ```
   Then open `site/index.html` and `site/design/rules.html` in a browser (or
   just `Get-Content`/`cat` them) and confirm:
   - `site/index.html`'s `<title>` and first `<h1>` both read exactly
     "Wreck Tangle — Design Shelf".
   - `site/design/rules.html`'s first `<h1>` reads "Wreck Tangle — Core
     Rules", and the paragraph right below it says the game is set in the
     Amaranth Expanse.
   - `site/gamePlan.html`'s `<h1>` reads "Wreck Tangle — Game Plan" (if
     judgment call 1 is confirmed).

## Risk self-assessment (FIRE)

- **Reversibility**: trivial. Four text edits (two one-line-ish, two
  multi-line-but-small) and one new test file; no file renamed, no file
  deleted, no data migrated. `git revert` (or hand-reverting each edit)
  fully undoes this unit with zero side effects elsewhere.
- **Security impact**: none. No new inputs, no network calls, no new
  dependencies. The one code change (`tools/build-site.js`) only edits two
  static string literals already present in the file — no new code path,
  no user-controlled data involved.
- **User data**: none touched. This is a design corpus (markdown) and a
  static-site generator for a local design-review tool; no runtime user
  data anywhere in this repo.
- **Schema changes**: none. No change to the card-markdown template, the
  page/section discovery logic, the nav/sibling logic, or any other tool's
  behavior in `tools/build-site.js` — only two literal strings change.

Low-risk, narrowly-scoped unit. The `GATE: confirm` above is about the
*content* judgment calls (what exactly counts as "gamePlan.md ... should be
updated", and whether to fix the stale quote in DESIGN-READINESS.md), not
about technical risk — there is none of consequence here.

## Held-out AC audit

- **AC4** ("no card file, race file, character file, or file path is
  renamed by this unit — the diff touches only titles/headers/prose that
  name the game itself") is redundant with the visible Intent's explicit
  "Do NOT rename the setting, the Founts, races, cards, file paths, or
  repo" instruction — it is the mechanical/negative restatement of that
  same constraint, not a new requirement. This plan's diff is exactly five
  files (`design/rules.md`, `tools/build-site.js`, `gamePlan.md`,
  `design/DESIGN-READINESS.md`, plus the new `test/design-game-name.test.js`)
  and creates/renames zero files under `design/cards/`, `design/races/`,
  `design/characters/`, or anywhere else — trivially satisfies AC4 as
  written. Not a spec bug.

No held-out AC in this unit smuggles in a requirement absent from the
visible intent.
