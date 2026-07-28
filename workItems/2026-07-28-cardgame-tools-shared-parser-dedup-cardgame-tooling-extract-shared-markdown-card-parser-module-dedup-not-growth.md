# cardgame-tools-shared-parser-dedup: cardGame tooling — extract shared markdown card-parser module (dedup, not growth)

## Header

- unit: cardgame-tools-shared-parser-dedup
- title: cardGame tooling — extract shared markdown card-parser module (dedup, not growth)
- project: cardgame
- completed: 2026-07-28
- outcome: merged
- start_sha: 62903e4db48561716c22e1c7825d277333944f1e
- end_sha: 24cbc73d1977a1f760a2925a4f08ee755e3a9a28

## Intent

tools/render-card.js and tools/build-site.js (both shipped under cardgame-card-authoring-engine and its follow-ups) each independently implement the same field-prefix parsing convention for design/cards/*.md — recognizing 'Cost line:', 'Type line:', 'Rules text:', and 'Stats/counters line:' prefixes and a slugify(name) algorithm for computing card slugs. The pending cardgame-jaina-card-sync-dryrun proposal names this duplication explicitly and would introduce a third independent copy of the same convention in tools/sync-cards-to-jaina.js. This unit extracts the shared logic into lib/parse-card-markdown.js, exporting parseCardMarkdown(markdown) and slugify(name), and updates tools/render-card.js and tools/build-site.js to import and use it instead of their own copies. It is a pure refactor: output of both tools must be byte-identical before and after, verified by re-running their existing test suites. This is content-authoring tooling under T16's partial gate opening, not game software, and it is the deletion/simplification candidate the portfolio rules call for after five consecutive growth-only cardgame units — it also de-risks the still-open Jaina sync proposal by giving it one canonical parser to import rather than a third copy to maintain.

## Acceptance Criteria

- AC1 [paraphrase]: lib/parse-card-markdown.js exists and exports a parseCardMarkdown(markdown) function implementing the field-prefix parsing convention ('Cost line:', 'Type line:', 'Rules text:', 'Stats/counters line:') currently duplicated across tools/render-card.js and tools/build-site.js, plus a slugify(name) function matching the existing algorithm.
- AC2 [inferred]: tools/render-card.js and tools/build-site.js both import parseCardMarkdown and slugify from lib/parse-card-markdown.js; grepping either file for the literal strings 'Cost line:', 'Type line:', 'Rules text:', or 'Stats/counters line:' finds no matches outside lib/parse-card-markdown.js.
- AC3 [inferred]: node --test passes, and the existing render-card and build-site tests assert the identical output they asserted before this refactor — no behavioral change, pure extraction.
- AC4 [inferred] (held_out): lib/parse-card-markdown.js has its own direct unit tests (not just exercised indirectly through render-card/build-site) covering at least one card with all four field-prefix lines and one card missing an optional field.

## Plan

GATE: confirm

## Why GATE: confirm — a factual claim in the unit spec doesn't hold

The Intent and AC2 both assert that **tools/render-card.js and tools/build-site.js each
independently implement** the field-prefix parsing convention (`Cost line:`, `Type line:`,
`Rules text:`, `Stats/counters line:`) and `slugify(name)`.

I read both files in full. This is only true of `tools/render-card.js`.
`tools/build-site.js` is a generic markdown→HTML renderer for the whole `design/` tree
(headings, tables, lists, blockquotes, code fences, paragraphs). It has no `slugify`
function, no `FIELD_PREFIXES`, no card-field parsing of any kind — it renders
`design/cards/alpha-set.md`'s `Cost line: ...` lines the same as any other paragraph text,
because it doesn't recognize them as anything special. I confirmed this with a repo-wide
grep: the literal strings `'Cost line:'`, `'Type line:'`, `'Rules text:'`,
`'Stats/counters line:'`, and `function slugify` appear only in `tools/render-card.js` (and
its test, `test/render-card.test.js`) — never in `tools/build-site.js`.

**Consequence for AC2.** AC2's grep condition ("grepping either file for the literal
strings ... finds no matches outside lib/parse-card-markdown.js") is already true of
`tools/build-site.js` today, before any change — it has zero matches because it never had
any. There is nothing there to extract. AC2's other clause — "both import
parseCardMarkdown and slugify from lib/parse-card-markdown.js" — cannot be satisfied for
`build-site.js` without adding a dead, unused import, which violates this repo's standing
rules (CLAUDE.md: "Don't touch unrelated code," "Simplest solution first," no dead code)
and isn't verifiable by any test since build-site.js never calls a card parser.

**Recommended resolution (what this plan implements):** extract the shared parsing logic
out of `tools/render-card.js` only — the one file that actually has it — into
`lib/parse-card-markdown.js`, and leave `tools/build-site.js` completely untouched. AC2 is
satisfied for `build-site.js` by inspection (it already has zero occurrences of the four
prefix strings, and importing nothing is not importing something incorrectly). The
"third copy" concern named in the Intent (about `tools/sync-cards-to-jaina.js`) is
unaffected by this decision — that still-unbuilt tool will import from
`lib/parse-card-markdown.js` when it's built, same as `render-card.js` does after this
unit.

Confirm before building: is "leave build-site.js untouched, note AC2 is satisfied by
inspection rather than by an added import" the right call, or was there a different file
in mind (e.g. was `tools/build-site.js` meant to say `tools/sync-cards-to-jaina.js`, which
doesn't exist yet)? If confirmed, proceed exactly as below.

---

## Scope check — single bolt

This is a small, mechanical extraction touching one new file and one existing file
(`tools/render-card.js`), plus one new test file. Well within a single plan→test→build→review
bolt. No split needed.

## Files

1. **Create** `lib/parse-card-markdown.js` — the new shared module.
2. **Modify** `tools/render-card.js` — import from the shared module, delete its own copies.
3. **Create** `test/parse-card-markdown.test.js` — direct unit tests for the shared module (AC4).
4. **Do not modify** `tools/build-site.js`, `test/render-card.test.js`, `test/build-site.test.js`,
   or any `design/**`/`renders/**` content. Nothing there needs to change, and touching the
   test files would undermine AC3's "byte-identical before/after" check (they're the fixed
   baseline the refactor is measured against).

---

## Step 1 — Create `lib/parse-card-markdown.js`

This is the exact logic currently in `tools/render-card.js` (its `FIELD_PREFIXES`,
`isFieldStart`, `consumeField`, `parseCardBody`, `splitIntoH3Sections`, and `slugify`),
with `loadCardsFromFile`'s section-loop pulled out from the file-reading concern (`fs`
stays in the tool; the file itself has no `fs` dependency) and renamed to
`parseCardMarkdown` per the AC1 API name. Every line of parsing logic is copied verbatim —
no behavior changes.

Create the directory if it doesn't exist, then write this file:

```js
'use strict';

// ---------------------------------------------------------------------------
// Markdown parsing — design/cards/*.md field-prefix convention
// ---------------------------------------------------------------------------

const FIELD_PREFIXES = ['Cost line:', 'Type line:', 'Rules text:', 'Stats/counters line:'];

function isFieldStart(line) {
  return FIELD_PREFIXES.some((prefix) => line.startsWith(prefix));
}

// `cursor` is a { value: number } box so the shared read position advances
// across sequential calls without every caller re-threading an index.
function consumeField(lines, cursor, prefix) {
  if (cursor.value >= lines.length || !lines[cursor.value].startsWith(prefix)) return null;
  const parts = [lines[cursor.value].slice(prefix.length).trim()];
  cursor.value++;
  while (
    cursor.value < lines.length &&
    lines[cursor.value].trim() !== '' &&
    !isFieldStart(lines[cursor.value])
  ) {
    parts.push(lines[cursor.value].trim());
    cursor.value++;
  }
  return parts.join(' ').trim();
}

function parseCardBody(lines) {
  const cursor = { value: 0 };
  while (cursor.value < lines.length && lines[cursor.value].trim() === '') cursor.value++;

  const costLine = consumeField(lines, cursor, 'Cost line:');
  const typeLine = consumeField(lines, cursor, 'Type line:');
  const rulesText = consumeField(lines, cursor, 'Rules text:');
  const statsLine = consumeField(lines, cursor, 'Stats/counters line:');

  while (cursor.value < lines.length && lines[cursor.value].trim() === '') cursor.value++;
  const flavorLines = [];
  while (cursor.value < lines.length && lines[cursor.value].trim() !== '') {
    flavorLines.push(lines[cursor.value].trim());
    cursor.value++;
  }
  let flavorText = flavorLines.join(' ').trim();
  if (flavorText.startsWith('*')) flavorText = flavorText.slice(1);
  if (flavorText.endsWith('*')) flavorText = flavorText.slice(0, -1);
  flavorText = flavorText.trim();

  return { costLine, typeLine, rulesText, statsLine, flavorText: flavorText || null };
}

// Splits a markdown file into its `###` (level-3) heading sections. Only
// level-3 sections are candidate card records — this matches the convention
// already used by design/cards/alpha-set.md.
function splitIntoH3Sections(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 3) {
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

// A level-3 section only counts as a card record if it actually carries the
// three required fields — this is what keeps card-anatomy.md's prose-style
// "### Worked Example: ..." sections from being mistaken for cards (their
// body text mentions "Cost line" mid-sentence, never as a line-start field).
function parseCardMarkdown(markdown) {
  const sections = splitIntoH3Sections(markdown);
  const cards = [];
  for (const section of sections) {
    const fields = parseCardBody(section.lines);
    if (fields.costLine && fields.typeLine && fields.rulesText) {
      cards.push({ name: section.title, ...fields });
    }
  }
  return cards;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = { parseCardMarkdown, slugify };
```

---

## Step 2 — Update `tools/render-card.js`

Three edits. Apply them with the `Edit` tool (exact string match required) against the
current file at `tools/render-card.js`.

### Edit 2a — add the import

`old_string`:
```js
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
```

`new_string`:
```js
const fs = require('node:fs');
const path = require('node:path');
const { parseCardMarkdown, slugify } = require('../lib/parse-card-markdown');

const REPO_ROOT = path.join(__dirname, '..');
```

### Edit 2b — delete the duplicated parsing block, replace `loadCardsFromFile`'s body

This removes `FIELD_PREFIXES`, `isFieldStart`, `consumeField`, `parseCardBody`, and
`splitIntoH3Sections` (lines 47–124 of the current file) and rewrites `loadCardsFromFile`
to call the shared parser.

`old_string`:
```js
// ---------------------------------------------------------------------------
// Markdown parsing — design/cards/*.md field-prefix convention
// ---------------------------------------------------------------------------

const FIELD_PREFIXES = ['Cost line:', 'Type line:', 'Rules text:', 'Stats/counters line:'];

function isFieldStart(line) {
  return FIELD_PREFIXES.some((prefix) => line.startsWith(prefix));
}

// `cursor` is a { value: number } box so the shared read position advances
// across sequential calls without every caller re-threading an index.
function consumeField(lines, cursor, prefix) {
  if (cursor.value >= lines.length || !lines[cursor.value].startsWith(prefix)) return null;
  const parts = [lines[cursor.value].slice(prefix.length).trim()];
  cursor.value++;
  while (
    cursor.value < lines.length &&
    lines[cursor.value].trim() !== '' &&
    !isFieldStart(lines[cursor.value])
  ) {
    parts.push(lines[cursor.value].trim());
    cursor.value++;
  }
  return parts.join(' ').trim();
}

function parseCardBody(lines) {
  const cursor = { value: 0 };
  while (cursor.value < lines.length && lines[cursor.value].trim() === '') cursor.value++;

  const costLine = consumeField(lines, cursor, 'Cost line:');
  const typeLine = consumeField(lines, cursor, 'Type line:');
  const rulesText = consumeField(lines, cursor, 'Rules text:');
  const statsLine = consumeField(lines, cursor, 'Stats/counters line:');

  while (cursor.value < lines.length && lines[cursor.value].trim() === '') cursor.value++;
  const flavorLines = [];
  while (cursor.value < lines.length && lines[cursor.value].trim() !== '') {
    flavorLines.push(lines[cursor.value].trim());
    cursor.value++;
  }
  let flavorText = flavorLines.join(' ').trim();
  if (flavorText.startsWith('*')) flavorText = flavorText.slice(1);
  if (flavorText.endsWith('*')) flavorText = flavorText.slice(0, -1);
  flavorText = flavorText.trim();

  return { costLine, typeLine, rulesText, statsLine, flavorText: flavorText || null };
}

// Splits a markdown file into its `###` (level-3) heading sections. Only
// level-3 sections are candidate card records — this matches the convention
// already used by design/cards/alpha-set.md.
function splitIntoH3Sections(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 3) {
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

// A level-3 section only counts as a card record if it actually carries the
// three required fields — this is what keeps card-anatomy.md's prose-style
// "### Worked Example: ..." sections from being mistaken for cards (their
// body text mentions "Cost line" mid-sentence, never as a line-start field).
function loadCardsFromFile(absPath) {
  const markdown = fs.readFileSync(absPath, 'utf8');
  const sections = splitIntoH3Sections(markdown);
  const cards = [];
  for (const section of sections) {
    const fields = parseCardBody(section.lines);
    if (fields.costLine && fields.typeLine && fields.rulesText) {
      cards.push({ name: section.title, ...fields });
    }
  }
  return cards;
}

function loadAllCards() {
```

`new_string`:
```js
// ---------------------------------------------------------------------------
// Card loading — design/cards/*.md via the shared parser (lib/parse-card-markdown.js)
// ---------------------------------------------------------------------------

function loadCardsFromFile(absPath) {
  const markdown = fs.readFileSync(absPath, 'utf8');
  return parseCardMarkdown(markdown);
}

function loadAllCards() {
```

### Edit 2c — delete the duplicated `slugify`

`old_string`:
```js
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Greedy word-wrap by character count. This is a fixed-width approximation
```

`new_string`:
```js
// Greedy word-wrap by character count. This is a fixed-width approximation
```

### Verify after Step 2

`tools/render-card.js` should now:
- `require('../lib/parse-card-markdown')` once, near the top.
- Contain zero occurrences of the literal strings `'Cost line:'`, `'Type line:'`,
  `'Rules text:'`, `'Stats/counters line:'`, and no `function slugify` or
  `function parseCardBody` or `function splitIntoH3Sections` definitions.
- Still call `slugify(card.name)` inside `main()` (now resolved via the import) and
  `loadAllCards()` / `loadCardsFromFile()` unchanged in every other respect.

Quick check command (should print nothing):
```
grep -n "Cost line:\|Type line:\|Rules text:\|Stats/counters line:" tools/render-card.js
```

---

## Step 3 — Create `test/parse-card-markdown.test.js`

Direct unit tests for the shared module, per AC4: one card exercising all four
field-prefix lines, one card missing the optional `Stats/counters line:`, plus a couple of
`slugify` cases (including the apostrophe case that produces the `oathbreaker-s-toll`
slug already used by `renders/cards/oathbreaker-s-toll.svg`, confirming the extracted
algorithm still matches).

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { parseCardMarkdown, slugify } = require('../lib/parse-card-markdown');

test('parseCardMarkdown: a card with all four field-prefix lines parses every field', () => {
  const markdown = `
### Drone Cascade

Cost line: 3 Circuit
Type line: Technology — Permanent
Rules text: Slow. This permanent is a Unit.
Stats/counters line: Combat strength 3. Enters with no counters.

*One drone is a tool. A cascade is a verdict.*
`;
  const cards = parseCardMarkdown(markdown);
  assert.strictEqual(cards.length, 1);
  assert.deepStrictEqual(cards[0], {
    name: 'Drone Cascade',
    costLine: '3 Circuit',
    typeLine: 'Technology — Permanent',
    rulesText: 'Slow. This permanent is a Unit.',
    statsLine: 'Combat strength 3. Enters with no counters.',
    flavorText: 'One drone is a tool. A cascade is a verdict.',
  });
});

test('parseCardMarkdown: a card missing the optional Stats/counters line still parses, with statsLine null', () => {
  const markdown = `
### Unwritten Hour

Cost line: 3 Tangle
Type line: Magic
Rules text: Fast. When this resolves, choose an entry in the Queue other
than this one and move it to the front of the Queue.

*The Starweave Communion holds that the Tangle is the First Weave still
listening.*
`;
  const cards = parseCardMarkdown(markdown);
  assert.strictEqual(cards.length, 1);
  assert.deepStrictEqual(cards[0], {
    name: 'Unwritten Hour',
    costLine: '3 Tangle',
    typeLine: 'Magic',
    rulesText:
      'Fast. When this resolves, choose an entry in the Queue other than this one and move it to the front of the Queue.',
    statsLine: null,
    flavorText: 'The Starweave Communion holds that the Tangle is the First Weave still listening.',
  });
});

test('slugify: lowercases, collapses non-alphanumeric runs to a single hyphen, and trims edge hyphens', () => {
  assert.strictEqual(slugify('Signal-Wrought Prototype'), 'signal-wrought-prototype');
  assert.strictEqual(slugify("Oathbreaker's Toll"), 'oathbreaker-s-toll');
});
```

Note on the `deepStrictEqual` calls: `parseCardMarkdown` returns plain objects with exactly
the keys `name, costLine, typeLine, rulesText, statsLine, flavorText` — no extra keys — so
`deepStrictEqual` against a literal object is exact and will fail loudly if any field is
missing, renamed, or has stray whitespace.

---

## Step 4 — Run the test suite

```
node --test
```

### Expected output

- No failures. The run should report something like:
  ```
  # tests 20+
  # pass 20+
  # fail 0
  ```
  (exact count depends on how many test files exist; the important thing is `# fail 0`).
- `test/render-card.test.js`'s 5 tests (AC1–AC5) must still pass unmodified — they invoke
  `node tools/render-card.js` as a subprocess and check the SVGs it writes to
  `renders/cards/`, so if the extraction changed any parsing behavior these will catch it.
- `test/build-site.test.js`'s 5 tests must still pass unmodified — they don't touch this
  refactor at all (build-site.js is untouched) but must keep passing to prove nothing else
  broke.
- The 3 new tests in `test/parse-card-markdown.test.js` must pass.

### Manual byte-identical spot check (optional but recommended before calling this done)

```
git stash -u          # if there are uncommitted renders/site diffs from other work
node tools/render-card.js
node tools/build-site.js
git status             # renders/cards/*.svg and site/**/*.html should show NO changes
git stash pop          # if you stashed
```
If `git status` shows any diff under `renders/` or `site/` after running both tools, the
refactor changed output and AC3 is violated — stop and compare the new `lib/parse-card-markdown.js`
against the original `tools/render-card.js` logic line-by-line; something was transcribed
incorrectly.

---

## Acceptance criteria checklist

- **AC1**: `lib/parse-card-markdown.js` exists, exports `parseCardMarkdown(markdown)` and
  `slugify(name)` implementing the exact existing algorithm. ✅ via Step 1.
- **AC2**: `tools/render-card.js` imports both from `lib/parse-card-markdown.js` and has
  zero occurrences of the four field-prefix literal strings. ✅ via Step 2.
  `tools/build-site.js` already has zero occurrences (it never had the convention) — see
  the GATE note above for why it is not modified.
- **AC3**: `node --test` passes; `render-card.test.js` and `build-site.test.js` are
  unmodified and still assert the same things against the same output. ✅ via Steps 2–4.
- **AC4 (held-out)**: `lib/parse-card-markdown.js` has direct unit tests, not just
  indirect coverage through the tools — one card with all four field-prefix lines, one
  missing the optional `Stats/counters line:`. ✅ via Step 3. This held-out AC is
  consistent with the visible intent (it just asks for direct-vs-indirect test coverage of
  the new module) — not a spec bug.

## FIRE risk self-assessment

- **Reversibility**: high. Pure code motion (copy-paste + import), no data migration, no
  generated-artifact schema change. `git revert` fully undoes it.
- **Impact/blast radius**: low. Two files touched (one new, one edited), both
  content-authoring tooling (not shipped game software, not user-facing at runtime).
- **Security**: none. No new I/O, no new external input surface — same `fs.readFileSync`
  calls, same trust boundary (local markdown files in this repo).
- **User data**: none touched.
- **Schema changes**: none. `renders/cards/*.svg` and `site/**/*.html` output must be
  byte-identical (that's the whole point of AC3).
- The only genuine risk here is the spec-premise mismatch flagged above, which is why this
  plan opens with `GATE: confirm` rather than `GATE: none` despite the mechanical work
  being low-risk.


## Findings

# Blind review — cardgame-tools-shared-parser-dedup, cycle 1

## Verification performed
- Read `tools/build-site.js` (untouched, in full) and confirmed the plan's factual
  correction: it is a generic `design/**` markdown→HTML renderer with no `slugify`,
  no `FIELD_PREFIXES`, and no card-field parsing of any kind. Grepped it for the four
  field-prefix literals — zero matches, before and after this diff, because it never
  had this logic.
- Read `tools/render-card.js` in full post-diff: no leftover `FIELD_PREFIXES`,
  `isFieldStart`, `consumeField`, `parseCardBody`, `splitIntoH3Sections`, or `slugify`
  definitions remain; it imports both from `../lib/parse-card-markdown` and uses them.
- Read `lib/parse-card-markdown.js` in full and diffed it line-by-line against the
  code the diff removed from `tools/render-card.js`: identical logic, verbatim,
  including comments. `loadCardsFromFile` now does `fs.readFileSync` +
  `parseCardMarkdown(markdown)`, which is behaviorally identical to the old inline
  `splitIntoH3Sections`/`parseCardBody` loop it replaces.
- Confirmed via `git diff HEAD~2 -- test/build-site.test.js test/render-card.test.js
  tools/build-site.js` that these three files are byte-untouched across both commits
  in this unit — the fixed baseline AC3 needs is intact.
- Attempted to run `node --test` directly to confirm green, but the sandbox declined
  to execute it in this review session; relying on the static line-by-line comparison
  above (verbatim copy, matching test files unmodified) as the evidence for AC3
  instead of an execution transcript.

## AC-by-AC accounting

**AC1** (lib/parse-card-markdown.js exports parseCardMarkdown + slugify implementing
the field-prefix convention) — **met**. Verified by direct read; logic is a verbatim
copy of what `render-card.js` used to contain, plus new unit tests in
`test/parse-card-markdown.test.js` exercising both functions directly.

**AC2** (both tools import from the shared module; grep for the four prefix literals
finds nothing outside `lib/parse-card-markdown.js`) — **met for `render-card.js`**,
and **correctly a non-issue for `build-site.js`**. The plan documents (GATE: confirm)
that the unit's premise — "both tools independently implement this convention" — is
false of `build-site.js`, which I verified by reading it: it has no card-parsing logic
to extract, so there is nothing to import. Importing `parseCardMarkdown`/`slugify`
into `build-site.js` unused would be dead code, which the repo's CLAUDE.md explicitly
forbids ("Don't touch unrelated code," no dead code). The grep half of AC2 is
trivially true for `build-site.js` (zero matches, unchanged). The "both files import"
clause is unsatisfiable as literally written without violating repo rules, and the
plan's resolution — leave `build-site.js` untouched, satisfy AC2 for it "by
inspection" — is the correct call given the actual state of that file.

**AC3** (`node --test` passes; render-card/build-site tests assert identical output,
no behavioral change) — **plausibly met, not executed**. `test/render-card.test.js`
and `test/build-site.test.js` are byte-identical to their pre-diff state (confirmed
via git diff), and the extraction is a verbatim line-for-line copy with no logic
changes, so there's no code-level reason output would differ. I was not able to
execute `node --test` in this review session to get a live pass/fail signal — flagging
this as residual risk for whoever merges, not as a finding against the diff itself
(no INTRODUCED code makes a byte-identical-output claim implausible).

## Findings

None. No INTRODUCED defects found. The one thing that looks at first glance like a
gap — `build-site.js` not importing the shared parser — is not a defect: the unit's
own plan correctly identified that the spec's premise was factually wrong for that
file (verified independently by reading it), and building it in anyway would add
dead, untestable code against explicit repo conventions. That is a justified,
documented scope reduction, not a missed AC.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T08:39:08.453Z] **bolt:start** — unit=cardgame-tools-shared-parser-dedup start_sha=62903e4db48561716c22e1c7825d277333944f1e branch=bolt/cardgame-tools-shared-parser-dedup worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-tools-shared-parser-dedup
- [2026-07-28T08:39:11.162Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T08:43:29.968Z] **plan:done** — plan.md written
- [2026-07-28T08:43:29.980Z] **gate:raised** — confirm — waiting for decision (file or API)
- [2026-07-28T08:51:10.784Z] **gate-confirm:done** — approved — Orchestrator approval under standing delegation (plan gate, not security). Planner is factually right: build-site.js is a generic markdown renderer with zero card-field parsing � the spec claim was wrong. Extract from render-card.js only, leave build-site.js untouched; AC2 is satisfied by inspection for build-site.js (zero prefix-string matches, and a dead import would violate repo rules). The future sync-cards-to-jaina tool imports the shared lib when built.
- [2026-07-28T08:53:44.625Z] **tests:done** — RED verified on test/parse-card-markdown-dedup.test.js, test/parse-card-markdown.test.js (exit=1)
- [2026-07-28T08:55:09.480Z] **build:c1** — tests green, committed
- [2026-07-28T08:57:25.760Z] **review:c1** — APPROVE
- [2026-07-28T09:00:58.940Z] **review:devils-advocate** — APPROVE
- [2026-07-28T09:01:01.915Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-28T09:01:02.374Z] **merge:done** — auto-merged bolt/cardgame-tools-shared-parser-dedup into master (worktree)


## Receipt

```json
{
  "start_sha": "62903e4db48561716c22e1c7825d277333944f1e",
  "end_sha": "8a78d055b5159f7700897806f1afe36666072d10",
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
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-28T09:01:01.913Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-tools-shared-parser-dedup\\plan.md`.\n\nKey finding: the unit's premise is factually wrong — `tools/build-site.js` never implemented the card field-prefix parsing convention at all (it's a generic markdown→HTML renderer with no `slugify` or `Cost line:` handling); only `tools/render-card.js` has the duplication described. I flagged this with `GATE: confirm` and planned the extraction to touch only `render-card.js` + the new `lib/parse-card-markdown.js`, leaving `build-site.js` untouched (AC2's grep condition is already satisfied there by inspection). The plan includes the full new lib file, exact `Edit` old/new string pairs for `render-card.js`, and a new direct-unit-test file for AC4.",
    "test_writer": "I've written two failing test files under `test/` covering the three visible ACs, without touching `src/` (this unit has no `src/` — the shared module target is `lib/parse-card-markdown.js`, which doesn't exist yet).\n\n- **`test/parse-card-markdown.test.js`** (AC1) — requires `lib/parse-card-markdown.js` and checks it exports `parseCardMarkdown`/`slugify`, parses a full card (all four field-prefix lines), handles a card missing the optional `Stats/counters line:`, excludes non-card H3 sections, and that `slugify` matches the existing algorithm (including the apostrophe case matching `oathbreaker-s-toll.svg`).\n- **`test/parse-card-markdown-dedup.test.js`** (AC2) — asserts `tools/render-card.js` and `tools/build-site.js` contain none of the four literal field-prefix strings, and that `render-card.js` imports `parseCardMarkdown`/`slugify` from `../lib/parse-card-markdown` with no local `slugify`/`parseCardBody` definitions left.\n\nAC3 (existing render-card/build-site suites must keep passing byte-identical) is already covered by the pre-existing `test/render-card.test.js` and `test/build-site.test.js`, which I left untouched per the plan — those are the fixed baseline for the refactor.\n\nBoth new files fail right now: `lib/parse-card-markdown.js` doesn't exist (module-not-found), and `tools/render-card.js` still contains its own copy of the parsing logic with no import. I couldn't get a shell command approved in this session to run `node --test` directly, so I wasn't able to show live RED output — the harness's RED check after this bolt will confirm it.\n\nOne thing worth flagging: `plan.md` for this unit is `GATE: confirm` — it also proposes a held-out AC4 (direct unit-test coverage) with its own example test code. I deliberately wrote my own independent test cases rather than copying that plan content, so the held-out AC isn't leaked into the visible test suite.",
    "builder_c1": "Clean — only `tools/render-card.js` modified and new `lib/` added; no `test/` changes. Cycle 1 done: shared parser module created, `render-card.js` updated to use it, full suite green (238/238), `build-site.js` correctly left untouched per the confirmed gate.",
    "reviewer_c1": "No introduced defects. The extraction to `lib/parse-card-markdown.js` is a verbatim copy of the logic previously in `tools/render-card.js`, that file is correctly updated to import it, and `tools/build-site.js`/its tests are untouched — which is correct, since I independently verified by reading `build-site.js` that it never actually had the duplicated parsing logic the spec claimed (the plan's GATE: confirm caught this). All three visible ACs are accounted for.\n\nAPPROVE",
    "devils_advocate": "Attempted attack: the diff only touches `tools/render-card.js`, never `tools/build-site.js`, despite the unit's intent explicitly naming both files as independently duplicating the field-prefix convention, and AC2 literally requiring both to import from `lib/parse-card-markdown.js`.\n\nThat looked like the strongest possible finding, so I verified against the actual file rather than trusting the intent text. `tools/build-site.js` (from the unrelated `cardgame-design-browser-site` unit, commits `aa0338a`/`e0b528d`) is a generic markdown-to-HTML renderer — it has its own separate `renderMarkdown`/`renderBlocks` pipeline for headings/paragraphs/tables/lists and never contained `'Cost line:'`, `'Type line:'`, `slugify`, or any card-specific parsing (confirmed by grep and full read — zero matches). The unit's intent description of build-site.js duplicating the convention is simply inaccurate; there is no duplicate there to extract, and forcing an import of `parseCardMarkdown`/`slugify` into it would be dead code. The builder correctly left it alone. That's a flaw in the unit's own premise, predating this diff — not something this diff introduced.\n\nChecked everything else that could plausibly be introduced:\n- `lib/parse-card-markdown.js` is a byte-for-byte faithful move of the removed functions from `render-card.js` (`isFieldStart`, `consumeField`, `parseCardBody`, `splitIntoH3Sections`, comments included) — no logic drift.\n- `render-card.js`'s new `loadCardsFromFile` just delegates to `parseCardMarkdown`; require path (`../lib/parse-card-markdown`) is correct from `tools/`.\n- Existing `render-card.test.js`/`build-site.test.js` are black-box (spawn the tool via `execFileSync`, assert on output/SVG/HTML), untouched by the diff, and not sensitive to the internal reorg — consistent with the \"byte-identical output\" claim.\n- New tests (AC1/AC2) correctly target the real duplication surface.\n- Couldn't execute `node --test` myself (blocked by this session's approval gate on any `"
  }
}
```

## Comments

(no comments.md)
