# cardgame-character-markdown-slugify-dedup: Remove lib/parse-character-markdown.js's byte-identical redeclaration of slugify — import it from lib/parse-card-markdown.js instead

## Header

- unit: cardgame-character-markdown-slugify-dedup
- title: Remove lib/parse-character-markdown.js's byte-identical redeclaration of slugify — import it from lib/parse-card-markdown.js instead
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: 91495947dd4878e3c22132afa67823607903e617
- end_sha: 0a4cee0eb1ffd3d85c673bb3781cb0d26d584847

## Intent

lib/parse-character-markdown.js was written before the codebase's slugify convention settled: lib/parse-card-markdown.js exports the canonical implementation, and lib/parse-lore-markdown.js and lib/parse-founts-markdown.js both already import it (`const { slugify } = require('./parse-card-markdown')`) rather than redeclaring it. lib/parse-character-markdown.js and lib/parse-race-markdown.js/lib/parse-star-atlas-markdown.js are the three straggler files that still redeclare their own copy — the latter two are already claimed by the pending cardgame-lib-markdown-section-parser-dedup proposal, leaving parse-character-markdown.js as the one remaining, unclaimed instance. Delete lines 103-108 (the local slugify function) from lib/parse-character-markdown.js, add a `const { slugify } = require('./parse-card-markdown');` import near the top (mirroring parse-lore-markdown.js's exact import style and placement), and leave every other function (splitIntoH2Sections, splitNameAndTitle, parseCharacterBody, parseCharacterMarkdown, raceFromFilename, loadCharactersFromFile, loadAllCharacters) and the module.exports list itself completely unchanged — slugify stays exported, just re-exporting the imported function instead of a locally-defined one. Do not touch lib/parse-card-markdown.js, lib/parse-race-markdown.js, lib/parse-star-atlas-markdown.js, lib/parse-lore-markdown.js, lib/parse-founts-markdown.js, or any design/ or tools/ file — this unit only removes one redundant function body from one file.

## Acceptance Criteria

- AC1 [inferred]: lib/parse-character-markdown.js no longer contains a local function declaration for slugify; it imports slugify from lib/parse-card-markdown.js
- AC2 [inferred]: lib/parse-character-markdown.js's module.exports still includes slugify, and calling it returns the same values as before (e.g. slugify('Torel Ashgrave') === 'torel-ashgrave')
- AC3 [inferred] (held_out): lib/parse-card-markdown.js, lib/parse-race-markdown.js, lib/parse-star-atlas-markdown.js, lib/parse-lore-markdown.js, and lib/parse-founts-markdown.js are byte-for-byte unchanged
- AC4 [paraphrase]: test/parse-character-markdown.test.js passes unmodified against the refactored file, and loadAllCharacters() called against the real design/characters/ files returns the same character records (including slug values) as before the refactor

## Plan

GATE: none

# Plan: cardgame-character-markdown-slugify-dedup

## Summary

`lib/parse-character-markdown.js` currently declares its own local `slugify`
function (lines 103-108) instead of importing the canonical implementation
from `lib/parse-card-markdown.js`, the way `lib/parse-lore-markdown.js` and
`lib/parse-founts-markdown.js` already do. This plan removes the local
declaration and replaces it with an import, matching the existing convention
exactly. No behavior changes — the imported `slugify` is byte-identical in
algorithm to the one being deleted.

This is a single small, low-risk, mechanical edit to one file.

## File to modify

`lib/parse-character-markdown.js` (repo root: `C:\github\.agentbox-worktrees\cardGame\cardgame-character-markdown-slugify-dedup\lib\parse-character-markdown.js`)

No other file is touched. Do not modify `lib/parse-card-markdown.js`,
`lib/parse-race-markdown.js`, `lib/parse-star-atlas-markdown.js`,
`lib/parse-lore-markdown.js`, `lib/parse-founts-markdown.js`, any file under
`design/`, any file under `tools/`, or `test/parse-character-markdown.test.js`.

## Step 1 — Add the import

Current top of file (lines 1-8):

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const CHARACTERS_DIR = path.join(__dirname, '..', 'design', 'characters');
const EXCLUDED_FILES = new Set(['web.md']);

```

Change lines 1-4 (`'use strict';` through `const path = require('node:path');`)
to add the slugify import immediately after the `path` require, mirroring
`lib/parse-lore-markdown.js`'s exact import style and placement (see
`lib/parse-lore-markdown.js` lines 1-6, which does
`const fs = ...; const path = ...; const { slugify } = require('./parse-card-markdown'); const { splitIntoH2Sections, ... } = require('./markdown-sections');`
— i.e. the `slugify` import goes right after `path`, before any other
project-local require). `parse-character-markdown.js` has no other
project-local requires, so this is the only line to add:

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');

const CHARACTERS_DIR = path.join(__dirname, '..', 'design', 'characters');
const EXCLUDED_FILES = new Set(['web.md']);

```

Concretely: use the Edit tool with

- old_string:
  ```
  const fs = require('node:fs');
  const path = require('node:path');

  const CHARACTERS_DIR = path.join(__dirname, '..', 'design', 'characters');
  ```
- new_string:
  ```
  const fs = require('node:fs');
  const path = require('node:path');
  const { slugify } = require('./parse-card-markdown');

  const CHARACTERS_DIR = path.join(__dirname, '..', 'design', 'characters');
  ```

## Step 2 — Delete the local slugify function

Current lines 103-108 (immediately after `parseCharacterMarkdown`'s closing
brace, before the "Race name derivation" comment block):

```js
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

```

Delete this entire function declaration, including the blank line that
follows it, so that `parseCharacterMarkdown`'s closing `}` is followed
directly by the `// ---...---` comment block that currently starts at line
110.

Concretely: use the Edit tool with

- old_string:
  ```
    return characters;
  }

  function slugify(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ---------------------------------------------------------------------------
  // Race name derivation
  ```
- new_string:
  ```
    return characters;
  }

  // ---------------------------------------------------------------------------
  // Race name derivation
  ```

(Match indentation/whitespace exactly as it appears in the current file when
performing the edit — the snippets above are reproduced faithfully from the
Read output at `lib/parse-character-markdown.js:100-112`.)

## Step 3 — Leave everything else untouched

Do not change, reorder, or reformat any of:

- `splitIntoH2Sections`
- `splitNameAndTitle`
- `parseCharacterBody`
- `parseCharacterMarkdown` (its body calls `slugify(heading.name)` at line 93
  — this call site does not change; it now resolves to the imported function)
- `raceFromFilename`
- `loadCharactersFromFile`
- `loadAllCharacters`
- the `module.exports = { parseCharacterMarkdown, slugify, splitIntoH2Sections, raceFromFilename, loadCharactersFromFile, loadAllCharacters };` block at the end (lines 150-157) — leave this exactly as-is; `slugify` is still a valid identifier in scope (now bound via `require` instead of `function slugify`), so the export list needs no edit.

## Resulting file (for verification only — do not paste this over the file; apply via the two edits above)

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');

const CHARACTERS_DIR = path.join(__dirname, '..', 'design', 'characters');
const EXCLUDED_FILES = new Set(['web.md']);

// ---------------------------------------------------------------------------
// Markdown parsing — design/characters/{race}.md "## Name — Title" convention
// ---------------------------------------------------------------------------

function splitIntoH2Sections(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 2) {
        current = { title: heading[2].trim(), lines: [] };
        sections.push(current);
      } else {
        current = null;
      }
      continue;
    }
    if (current) current.lines.push(line);
  }
  return sections;
}

const NAME_TITLE_PATTERN = /^(.+?)\s+—\s+(.+)$/;

function splitNameAndTitle(heading) {
  const match = heading.match(NAME_TITLE_PATTERN);
  if (!match) return null;
  return { name: match[1].trim(), title: match[2].trim() };
}

function parseCharacterBody(lines) {
  // ... unchanged ...
}

function parseCharacterMarkdown(markdown, race) {
  const sections = splitIntoH2Sections(markdown);
  const characters = [];
  for (const section of sections) {
    const heading = splitNameAndTitle(section.title);
    if (!heading) continue;
    const { bio, threads } = parseCharacterBody(section.lines);
    characters.push({
      name: heading.name,
      slug: slugify(heading.name),
      race,
      title: heading.title,
      bio,
      threads,
    });
  }
  return characters;
}

// ---------------------------------------------------------------------------
// Race name derivation — filename basename -> title-cased race name
// ("mireth-bloom.md" -> "Mireth Bloom"), matching test/design-characters.test.js's
// own raceDisplayName helper so both stay in lockstep.
// ---------------------------------------------------------------------------

function raceFromFilename(filename) {
  // ... unchanged ...
}

// ---------------------------------------------------------------------------
// Character loading — design/characters/*.md (excluding web.md) via
// parseCharacterMarkdown above
// ---------------------------------------------------------------------------

function loadCharactersFromFile(absPath) {
  // ... unchanged ...
}

function loadAllCharacters() {
  // ... unchanged ...
}

module.exports = {
  parseCharacterMarkdown,
  slugify,
  splitIntoH2Sections,
  raceFromFilename,
  loadCharactersFromFile,
  loadAllCharacters,
};
```

(`// ... unchanged ...` markers above are for this plan document only — the
real file keeps those function bodies exactly as they are today.)

## Verification

Run:

```
node --test
```

Expected: the full suite passes, same pass count as before this change (no
test file is modified by this unit). In particular:

- `test/parse-character-markdown.test.js` passes unmodified. Its
  `AC2: slugify matches lib/parse-card-markdown.js's existing algorithm`
  test already asserts `slugify(name) === cardSlugify(name)` for several
  sample names — this now trivially holds because both are the same function
  reference.
- Any test that calls `loadAllCharacters()` against the real
  `design/characters/*.md` files (e.g. the "returns exactly 20 records"
  and "every record exactly the name/slug/race/title/bio/threads fields"
  tests in `test/parse-character-markdown.test.js`, and any tests in
  `test/design-characters.test.js` if that file exists) must produce the
  same slug values as before, e.g. `slugify('Torel Ashgrave') === 'torel-ashgrave'`.

Also spot-check manually if desired:

```
node -e "const {slugify} = require('./lib/parse-character-markdown'); console.log(slugify('Torel Ashgrave'));"
```

Expected output: `torel-ashgrave`

## AC mapping

- AC1: satisfied by Step 2 (local `function slugify` declaration removed) and
  Step 1 (import added).
- AC2: satisfied because `module.exports` is untouched (Step 3) and the
  imported `slugify` is byte-identical in behavior to the deleted local one
  (both repos of the same trim/lowercase/hyphenate algorithm) — same
  input/output pairs as before, including `slugify('Torel Ashgrave') === 'torel-ashgrave'`.
- AC3 (held_out): satisfied trivially — this unit's steps only touch
  `lib/parse-character-markdown.js`. `lib/parse-card-markdown.js`,
  `lib/parse-race-markdown.js`, `lib/parse-star-atlas-markdown.js`,
  `lib/parse-lore-markdown.js`, and `lib/parse-founts-markdown.js` are never
  opened for writing. This AC is redundant with the unit's stated scope, not
  a new requirement — no spec-bug flag needed.
- AC4: satisfied by the Verification section — `node --test` run with no
  test files modified, and `loadAllCharacters()`'s output (including slugs)
  is provably unchanged since the slugify algorithm is byte-identical
  before/after.

## Risk assessment (FIRE)

- **Reversibility**: trivial — one file, two small edits (add one require
  line, delete one 6-line function), easily reverted with `git checkout`.
- **Security impact**: none — no user input handling changes, no new
  dependencies, `require('./parse-card-markdown')` is an existing sibling
  file in the same directory.
- **User data**: none — this is a build-time markdown-parsing utility with
  no runtime user data or persistence involved.
- **Schema changes**: none — `module.exports` shape, function signatures,
  and returned record shapes are all unchanged.

Overall: low risk, mechanical, single-file, easily verified by the existing
unmodified test suite. `GATE: none`.


## Findings

# Blind Review — cardgame-character-markdown-slugify-dedup, cycle 1

## Scope note

The diff supplied for review spans two commits: `c9632a1` (test-writing
phase, adds `test/parse-character-markdown-slugify-dedup.test.js`, 83 lines)
and `180329a` (builder cycle 1, touches only `lib/parse-character-markdown.js`,
+1/-7 lines). Confirmed via `git show --stat` on both commits. The builder's
actual contribution this cycle is the `lib/parse-character-markdown.js` edit
only; the new test file is PRE-EXISTING relative to this cycle (authored by
the prior test-writing step, not the builder).

## AC-by-AC verification

**AC1** — no local `slugify` function declaration; imports from
`./parse-card-markdown`. Confirmed by reading the resulting file: line 5 adds
`const { slugify } = require('./parse-card-markdown');` immediately after the
`path` require (matching `parse-lore-markdown.js`'s placement per the plan),
and the old `function slugify(name) {...}` block (former lines 103-108) is
gone. Satisfied.

**AC2** — `module.exports` still includes `slugify`; behavior preserved.
Confirmed: `module.exports` block (lines 144-151) is untouched and still
lists `slugify`. Compared the deleted local implementation against
`lib/parse-card-markdown.js`'s `slugify` (lines 98-103) — the two are
byte-identical:
```js
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```
So `slugify('Torel Ashgrave') === 'torel-ashgrave'` holds under the new
import exactly as it did under the old local definition. Satisfied.

**AC4** — `test/parse-character-markdown.test.js` passes unmodified, and
`loadAllCharacters()` returns the same records/slugs as before. This diff
does not touch that test file or any other file besides
`lib/parse-character-markdown.js`, and the only functional change is
identical-algorithm re-wiring of `slugify` (see AC2) — no observable
behavior change to `parseCharacterMarkdown`, `loadCharactersFromFile`, or
`loadAllCharacters`. Statically verified the design data backing the new
test file's assumptions: `design/characters/*.md` (excluding `web.md`)
contains exactly 20 `## Name — Title` sections across
`cindral-reach.md`, `mireth-bloom.md`, `panoptic-concord.md`,
`starweave-communion.md`, `wrought-assembly.md`, and one of those
(`cindral-reach.md`) contains a "Torel Ashgrave" heading — matching the new
test's hardcoded expectations. Could not execute `node --test` in this
review sandbox (command approval unavailable non-interactively); relying on
static verification given the change is a pure identical-algorithm
re-wiring with zero surface-area change to parsing logic. Satisfied, with
that execution caveat noted.

## Diff hygiene vs. intent

- Only `lib/parse-character-markdown.js` is touched by the builder's commit
  (`180329a`, +1/-7), matching the plan's two-step edit exactly (add import
  after `path` require, delete lines 103-108 local `slugify`).
- Every other function (`splitIntoH2Sections`, `splitNameAndTitle`,
  `parseCharacterBody`, `parseCharacterMarkdown`, `raceFromFilename`,
  `loadCharactersFromFile`, `loadAllCharacters`) and the `module.exports`
  list are byte-for-byte unchanged, per plan Step 3.
- No files under `design/` or `tools/` touched; `lib/parse-card-markdown.js`,
  `lib/parse-race-markdown.js`, `lib/parse-star-atlas-markdown.js`,
  `lib/parse-lore-markdown.js`, `lib/parse-founts-markdown.js` all untouched.

## Findings

None. No INTRODUCED issues found — the change is a mechanical, behavior-
preserving import swap that matches the plan exactly.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T19:59:29.552Z] **bolt:start** — unit=cardgame-character-markdown-slugify-dedup start_sha=91495947dd4878e3c22132afa67823607903e617 branch=bolt/cardgame-character-markdown-slugify-dedup worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-character-markdown-slugify-dedup
- [2026-07-30T19:59:39.796Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T20:00:50.002Z] **plan:done** — plan.md written
- [2026-07-30T20:04:03.773Z] **tests:done** — RED verified on test/parse-character-markdown-slugify-dedup.test.js (exit=1)
- [2026-07-30T20:04:47.732Z] **build:c1** — tests green, committed
- [2026-07-30T20:06:28.644Z] **review:c1** — APPROVE
- [2026-07-30T20:07:39.632Z] **review:devils-advocate** — APPROVE
- [2026-07-30T20:07:49.908Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T20:07:50.268Z] **merge:done** — auto-merged bolt/cardgame-character-markdown-slugify-dedup into master (worktree)


## Receipt

```json
{
  "start_sha": "91495947dd4878e3c22132afa67823607903e617",
  "end_sha": "180329a47e6f7552f197a34a874dfc40ba702c3a",
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
      "held_out": true,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": false,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-30T20:07:49.907Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-character-markdown-slugify-dedup\\plan.md`.\n\nSummary: two edits to `lib/parse-character-markdown.js` — add `const { slugify } = require('./parse-card-markdown');` after the `path` require, and delete the local `function slugify` block (lines 103-108). Everything else, including `module.exports`, stays untouched. Risk is low (`GATE: none`); verification is `node --test` plus a manual `slugify('Torel Ashgrave') === 'torel-ashgrave'` spot-check.",
    "test_writer": "I've written the failing tests; the sandbox here won't let me execute `node --test` directly (every invocation requires approval that isn't granted), so I verified correctness by manual trace against the current file contents instead of running it.\n\nNew file: `test/parse-character-markdown-slugify-dedup.test.js` — 4 tests, none touching `src/`:\n- **AC1** (2 tests): asserts `lib/parse-character-markdown.js`'s source has no `function slugify(...)` declaration, and does contain a `require('./parse-card-markdown')`. Both currently fail — the file still has the local declaration (lines 103-108) and no such require.\n- **AC2**: asserts the exported `slugify` is `===` (same reference) to `parse-card-markdown.js`'s `slugify`, plus the known-good values (`'Torel Ashgrave' → 'torel-ashgrave'`). Fails now on the reference check since it's currently a separately-declared function.\n- **AC4**: same reference check, plus `loadAllCharacters()` still returning 20 records with correct slugs (including the real `Torel Ashgrave` record from `design/characters/`). Fails now for the same reference reason.\n\nI left `test/parse-character-markdown.test.js` untouched, per the plan's AC4 requirement that it pass unmodified after the refactor.",
    "builder_c1": "All 1123 tests pass, 0 failures. The refactor is complete: `lib/parse-character-markdown.js` now imports `slugify` from `./parse-card-markdown` instead of redeclaring it, with everything else unchanged.",
    "reviewer_c1": "Findings written to `findings.md`. Summary: the builder's actual cycle-1 diff (`180329a`) touches only `lib/parse-character-markdown.js` — the new test file was added by the prior test-writing commit (`c9632a1`), pre-existing relative to this cycle. The edit matches the plan exactly: import added right after `path`, local `slugify` deleted, everything else byte-identical. Confirmed the deleted local `slugify` and `parse-card-markdown.js`'s `slugify` are byte-identical implementations, so AC2's behavior-preservation claim holds. AC1/AC2/AC4 all verified by static reading (couldn't execute `node --test` — command approval unavailable in this sandbox — but the change has zero behavioral surface area, so static verification is sufficient here). No unrelated files touched. No findings.\n\nAPPROVE",
    "devils_advocate": "Import style and placement match exactly (line 5, right after `path`, same syntax). Everything checks out: no circular dependency (parse-card-markdown.js has no reverse require), the exported `slugify` is now a shared reference producing identical output, module.exports list is untouched, and the diff touches only the one file it was scoped to. The pre-existing `test/parse-character-markdown.test.js` (unmodified) already pins the 20-record/slug-consistency behavior this refactor must preserve, and the new test file correctly red-pins the reference-identity wiring before the fix. I looked for the classic dedup-refactor traps — circular requires, identity-sensitive callers, stale exports, formatting drift from the mirrored file — and found none.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
