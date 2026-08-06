GATE: confirm

# Plan: cardgame-design-readiness-gap1-wormhole-resolved-fix

## ⚠️ Read this before touching anything — the unit's premise is now stale in a way that changes the deliverable

`unit.md`'s Intent says to narrow Open Gap 1's claim to "the 3 remaining
uncovered cards in spatial-race-identity-set.md (Preemptive Survey,
Unbound Passage, Chokepoint Garrison)" because — per the Intent text — only
the 5 `wormhole-closure-cards.md` cards' briefs have shipped so far.

That was true when `unit.md` was written, but it is **no longer true**. I
grepped `design/cards/art-briefs.md`'s own `###` headings directly and
found sections titled `Preemptive Survey` (line 791), `Unbound Passage`
(line 804), and `Chokepoint Garrison` (line 817) — i.e. **all 3
spatial-race-identity-set.md cards already have briefs too**, not just the
5 wormhole-closure cards. This shipped via a sibling unit,
`cardgame-art-briefs-spatial-race-identity`, whose work-item record
(`workItems/2026-07-30-cardgame-art-briefs-spatial-race-identity-*.md`)
shows `outcome: merged`, `completed: 2026-07-30`, and a receipt with
`valid: true`. It merged today, and its diff is already present in this
worktree's `design/cards/art-briefs.md` (I read the actual file content
above — the 3 briefs are there, in the established Palette/Subject-Scene/
Key-visual-elements/Composition format, under a
`## Spatial Race Identity Set — Wormholes as Race Identity` divider).

**Net effect: Open Gap 1's entire 8-card hole is now closed, not half of
it.** Both halves — the 5 wormhole-closure cards (already known per
`unit.md`) and the 3 spatial-race-identity cards (newly discovered here) —
have matching `art-briefs.md` entries.

### Why this matters for AC2

`unit.md`'s AC2 asks for text that "narrows the remaining hole to the 3
cards in spatial-race-identity-set.md." Writing that sentence into
`DESIGN-READINESS.md` would be **factually false** — there is no remaining
hole to narrow to. This document's own stated purpose (its opening
paragraph) is to make design-readiness claims trustworthy via file
citations; inserting a claim that's false the moment it's written would
undermine that purpose the same way the original stale text did. Per this
project's held-out-criteria discipline ("if a held-out AC carries a
requirement stated nowhere else, that is a spec bug: flag it in plan.md
rather than planning around it silently") and per this repo's own root
CLAUDE.md ("Ask, don't assume"), I'm flagging this rather than silently
writing false text or silently reinterpreting the AC.

**Recommendation:** mark Open Gap 1 as fully resolved (both halves), citing
both closing units, instead of narrowing it to a 3-card hole that no
longer exists. This still satisfies AC1 in full, satisfies the citable
parts of AC2 (states `art-briefs.md` covers the wormhole-closure-cards set,
names that file verbatim), and — going further than asked, but
truthfully — also reports the spatial-race-identity half as closed rather
than open. AC3, AC4, AC5 are unaffected either way (see below). This is
why `GATE: confirm` is set: implementing AC2 exactly as literally written
would require writing a sentence that is false against the current repo
state, so a human should confirm the "fully resolved" framing before a
builder commits to it. If you'd rather keep the literal "3-card hole"
framing despite it being untrue, say so explicitly and this plan needs a
different Step 1 — do not have the builder invent that call.

### A second, smaller stale spot — intentionally left untouched

`design/DESIGN-READINESS.md` Section 4's "Known gap" bullet (the paragraph
right before Section 5, currently reading "the 3 cards in
`spatial-race-identity-set.md` and the 5 cards in
`wormhole-closure-cards.md` (8 cards total) have no brief in `art-briefs.md`
yet") is *also* now stale for the same reason. `unit.md` explicitly says
**do not touch Section 4's "Known gap" note** — only Open Gap 1's own text.
I'm following that instruction and leaving it alone; note it for whoever
plans the next design-readiness cleanup unit.

## A structural constraint that rules out the "resolved → unnumbered
paragraph" pattern used for Gap 2

The prior unit `cardgame-design-readiness-gap2-resolved-fix` resolved Open
Gap 2 by pulling it **out of the numbered sequence entirely** — replacing
`2. **The Spatial Race Identity Set only speaks for 3 of 5 races.**` with
an unnumbered `**Resolved — ...**` paragraph, then renumbering the two
gaps after it (3→2, 4→3). That worked there because the numbered list had
**4** items before the edit, so removing one still left 3 — satisfying
`test/design-readiness.test.js`'s AC5
(`expected at least 3 numbered open-gap items`).

**That pattern will not work for Gap 1.** The numbered list in the current
file has only **3** items total right now: `1.` (art-brief hole — this
gap), `2.` (no digital implementation), `3.` (Jaina card-only). If Gap 1's
entry is pulled out of the numbered sequence the same way Gap 2's was, only
2 numbered items remain, and `test/design-readiness.test.js`'s existing
AC5 test —

```js
const items = gapsBody.match(/^\d+\.\s+\S.*/gm) || [];
assert.ok(items.length >= 3, ...)
```

— **would start failing**, and `unit.md`'s own AC3 explicitly requires this
exact test to "continue to pass unmodified." So Gap 1's entry **must stay
a numbered list item** (item `1.`) — its bold lead sentence and body change
to reflect the resolved state, but it keeps its `1.` prefix. No
renumbering of items `2.`/`3.` is needed or wanted (they keep their current
numbers unchanged).

## Files touched

1. `design/DESIGN-READINESS.md` — rewrite Open Gap 1's text (only).
2. `test/design-readiness-gap2-resolved.test.js` — one assertion needs
   updating (see "Why this pre-existing test needs a small update" below)
   or it will fail after Step 1, because it currently checks that Gap 1's
   *old* headline text is still present verbatim (that check made sense
   when gap2-resolved-fix landed, since Gap 1 wasn't in scope for that
   unit — but this unit's whole job is to change Gap 1's text).
3. `test/design-readiness-gap1-resolved.test.js` — new file, this unit's
   own RED→GREEN tests for AC1/AC2/AC3/AC5 (mirrors the existing
   `test/design-readiness-gap2-resolved.test.js` pattern).

No other file needs to change. `site/design/DESIGN-READINESS.html` will be
regenerated automatically as a side effect of running the site-build tests
in `node --test` (this is a pre-existing repo convention — see "Build-order
gotcha" below) — do not hand-edit it.

## Step 1 — Edit `design/DESIGN-READINESS.md`

Use the `Edit` tool. This block is unique in the file (verified by reading
the file directly — it's Section 6, first list item).

`old_string`:
```
1. **Art-brief coverage has an 8-card hole.** None of the 3 cards in
   `design/cards/spatial-race-identity-set.md` or the 5 cards in
   `design/cards/wormhole-closure-cards.md` have a matching entry in
   `design/cards/art-briefs.md`, so `tools/composite-card-art.js` cannot
   generate art for them — confirmed live by that tool's own
   `no art brief for "<name>"` warning (see
   `workItems/2026-07-29-cardgame-art-brief-coverage-warning-*.md`). No
   unit has yet been proposed to close it.
```

`new_string`:
```
1. **Resolved — art-brief coverage for the wormhole-closure and
   spatial-race-identity sets is complete.** All 8 cards this gap used to
   track now have a matching entry in `design/cards/art-briefs.md`: the 5
   in `design/cards/wormhole-closure-cards.md`, closed by
   `cardgame-art-briefs-wormhole-closure` (see
   `workItems/2026-07-30-cardgame-art-briefs-wormhole-closure-*.md`), and
   the 3 in `design/cards/spatial-race-identity-set.md` — Preemptive
   Survey, Unbound Passage, Chokepoint Garrison — closed by
   `cardgame-art-briefs-spatial-race-identity` (see
   `workItems/2026-07-30-cardgame-art-briefs-spatial-race-identity-*.md`).
   `tools/composite-card-art.js` no longer prints a
   `no art brief for "<name>"` warning for any of them.
```

Do not touch anything else in the file: not the `**Resolved — the Spatial
Race Identity Set now speaks for all 5 races.**` paragraph that follows
(that's Gap 2's already-resolved note, untouched), not item `2.` ("No
digital implementation..."), not item `3.` ("Jaina is wired up..."), not
Section 3, not Section 4's "Known gap" bullet, not any other section.

## Why this pre-existing test needs a small update

`test/design-readiness-gap2-resolved.test.js` (already merged, from the
prior gap2 unit) has an `AC5` test that asserts the *other* gaps' text is
untouched. At the time it was written, Gap 1 ("art-brief coverage") was one
of those "other" gaps, so it asserts:

```js
assert.ok(
  gapsBody.includes('Art-brief coverage has an 8-card hole'),
  'expected the art-brief coverage gap entry to still be present verbatim'
);
```

Step 1 above removes that exact sentence (by design — that's the whole
point of this unit). Left as-is, this assertion will fail after Step 1 and
`node --test` will not be green. This is a real, necessary consequence of
this unit's scope, not scope creep — the alternative (leaving Gap 1's old
false claim in the document) is exactly what this unit exists to fix.

The line right after it (`gapsBody.includes('no art brief for "<name>"')`)
does **not** need to change — the new Gap-1 text in Step 1 deliberately
keeps that exact substring (see the last sentence of the new text), so
that assertion keeps passing unmodified.

### Step 2 — Edit `test/design-readiness-gap2-resolved.test.js`

Use the `Edit` tool.

`old_string`:
```
  assert.ok(
    gapsBody.includes('Art-brief coverage has an 8-card hole'),
    'expected the art-brief coverage gap entry to still be present verbatim'
  );
```

`new_string`:
```
  assert.ok(
    gapsBody.includes('Resolved — art-brief coverage for the wormhole-closure and'),
    'expected the art-brief coverage gap entry (now resolved by a later unit) to still be present'
  );
```

Do not change anything else in this file — the rest of its AC1/AC2/AC3/AC5
tests are about Gap 2's text and items `2.`/`3.`'s text, none of which this
unit touches.

## Step 3 — Create `test/design-readiness-gap1-resolved.test.js`

This is a new file (does not exist yet). It is a direct adaptation of
`test/design-readiness-gap2-resolved.test.js`'s pattern, pointed at this
unit's own ACs.

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText } = require('./helpers/markdown');

const DOC_PATH = path.join(__dirname, '..', 'design', 'DESIGN-READINESS.md');

const content = fs.existsSync(DOC_PATH) ? fs.readFileSync(DOC_PATH, 'utf8') : '';
const sections = parseSections(content);
const gapsBody = sectionText(sections, /open gaps|unresolved questions/i) || '';

// ---------------------------------------------------------------------------
// AC1: the Open Gaps section no longer claims the 5 wormhole-closure-cards
// cards lack a matching art-brief entry.
// ---------------------------------------------------------------------------

test('AC1: Open Gaps section no longer claims the wormhole-closure-cards cards lack an art-brief entry', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  assert.ok(
    !/cannot generate art for them/i.test(gapsBody),
    'expected the Open Gaps section to no longer claim composite-card-art.js "cannot generate art for them"'
  );
  assert.ok(
    !/None of the 3 cards in/i.test(gapsBody),
    'expected the Open Gaps section to no longer open with the stale "None of the 3 cards in..." claim'
  );
});

// ---------------------------------------------------------------------------
// AC2: the section now states design/cards/art-briefs.md covers the
// wormhole-closure-cards set, citing that file verbatim.
// ---------------------------------------------------------------------------

test('AC2: Open Gaps section states art-briefs.md covers the wormhole-closure-cards set', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  assert.ok(
    gapsBody.includes('design/cards/art-briefs.md'),
    'expected the Open Gaps section to cite "design/cards/art-briefs.md" verbatim'
  );
  assert.ok(
    gapsBody.includes('design/cards/wormhole-closure-cards.md'),
    'expected the Open Gaps section to cite "design/cards/wormhole-closure-cards.md" verbatim'
  );
  assert.ok(
    /resolved/i.test(gapsBody),
    'expected the Open Gaps section to state the art-brief coverage gap is resolved'
  );
});

// ---------------------------------------------------------------------------
// AC3 (paraphrase): the Open Gaps section still parses as a sequential
// numbered list (1., 2., 3., ... no skipped or repeated numbers) with at
// least 3 items — test/design-readiness.test.js's existing AC5 assertion
// must keep passing unmodified.
// ---------------------------------------------------------------------------

test('AC3: Open Gaps section is still a sequential numbered list with at least 3 items', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');
  const items = gapsBody.match(/^\d+\.\s+\S.*/gm) || [];
  assert.ok(items.length >= 3, `expected at least 3 numbered open-gap items, found ${items.length}`);

  const numbers = items.map((line) => parseInt(line.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(
      numbers[i],
      i + 1,
      `expected numbered open-gap items to run sequentially from 1 with no skips/repeats, got [${numbers.join(', ')}]`
    );
  }
});

// ---------------------------------------------------------------------------
// AC5 (paraphrase): Open Gaps 2 and 3 ("No digital implementation...",
// "Jaina is wired up...") keep their original substantive text.
// ---------------------------------------------------------------------------

test('AC5: the other two Open Gap entries keep their original substantive text', () => {
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');

  assert.ok(
    gapsBody.includes('No digital implementation of the design has ever been built or run'),
    'expected the no-digital-implementation gap entry to still be present verbatim'
  );
  assert.ok(
    gapsBody.includes('design/playtest-spatial.md') && gapsBody.includes('design/playtest-full-game.md'),
    'expected the no-digital-implementation gap entry to still cite both playtest files'
  );

  assert.ok(
    gapsBody.includes('Jaina is wired up for card records only'),
    'expected the Jaina card-only gap entry to still be present verbatim'
  );
  assert.ok(
    gapsBody.includes('tools/sync-cards-to-jaina.js'),
    'expected the Jaina card-only gap entry to still cite tools/sync-cards-to-jaina.js'
  );
});
```

(AC4 — held_out, Section 3 and Section 4's "Known gap" note unchanged
byte-for-byte — is not testable as a standalone automated assertion the
way AC1/AC2/AC3/AC5 are; the prior `gap2-resolved-fix` unit handled its own
analogous AC4 the same way, with no dedicated test. It's a diff-time
property: verify it by running `git diff design/DESIGN-READINESS.md`
after Step 1 and confirming Section 3 and Section 4 have zero hunks — only
the Open Gap 1 block changes. Do this check explicitly during review
before merging.)

## Build-order gotcha (do not skip)

`test/card-template-helper.test.js` has an `AC4` test —
`no file under design/ is modified (git status against design/ is empty)`
— that runs `git status --porcelain -- design` and asserts empty output.
This means **`design/DESIGN-READINESS.md`'s edit must be committed** before
the final `node --test` run that's expected to be fully green — an
uncommitted change under `design/` will fail that unrelated test. The prior
`gap2-resolved-fix` unit hit this same thing and resolved it by committing
the design-doc edit before the final verification run. Follow the same
order:

1. Make the edit to `design/DESIGN-READINESS.md` (Step 1).
2. Make the edits to the two test files (Steps 2–3).
3. Commit `design/DESIGN-READINESS.md` (and any site file `node --test`
   regenerates as a side effect, e.g. `site/design/DESIGN-READINESS.html`,
   if the site-build tests produce one — check `git status` after the
   first test run to see what changed).
4. Run `node --test` again to confirm a fully green suite with everything
   committed.

## Step 4 — Verify

Run from the repo root:

```
node --test
```

Expected output: full suite passes, exit code 0. Specifically:

- `test/design-readiness.test.js` — all 5 existing `AC1`..`AC5` tests still
  pass (its `AC5` test is the loose `items.length >= 3` check quoted
  above; it never inspected the specific wording of any gap, so it's
  unaffected by the wording change).
- `test/design-readiness-gap2-resolved.test.js` — all 4 tests
  (`AC1`, `AC2`, `AC3`, `AC5`) pass, including the updated `AC5` assertion
  from Step 2.
- `test/design-readiness-gap1-resolved.test.js` — the 4 new tests
  (`AC1`, `AC2`, `AC3`, `AC5`) from Step 3 pass.
- No other test file references the old Gap 1 wording or the gap count
  (confirmed by grepping the test suite for `Art-brief coverage has an
  8-card hole` and `None of the 3 cards in` before writing this plan — the
  only match outside `design/DESIGN-READINESS.md` itself was the single
  line in `design-readiness-gap2-resolved.test.js` that Step 2 fixes).

## Risk self-assessment (FIRE matrix)

- **Reversibility:** fully reversible — plain markdown + two test-file
  edits, trivially revertable via git. No deletions of unrelated content.
- **Security impact:** none — no code paths, no user input, no
  network/auth.
- **User data:** none — design-document and test-file content only.
- **Schema changes:** none.

Mechanically this is as low-risk as the prior `gap2-resolved-fix` unit
(`GATE: none` there). The reason this plan is `GATE: confirm` is **not**
risk — it's that the correct text deviates from `unit.md`'s AC2 as
literally written, for the discovered-stale-premise reason explained at
the top of this plan. A human should confirm the "mark fully resolved"
framing (or explicitly override it) before a builder commits to either
interpretation.

## Held-out criteria check

AC4 (held_out — Section 3's card-set inventory and Section 4's "Known gap"
note present byte-for-byte unchanged) is redundant with the visible intent
("do not touch Section 3, Section 4's 'Known gap' note... only Open Gap
1's own text") — novel only in specifying "byte-for-byte," not in a
requirement stated nowhere else. No spec bug there.

The actual spec bug in this unit is in **AC2** (not held_out) as explained
at the top of this plan: it encodes a premise (a 3-card hole still exists
in `spatial-race-identity-set.md`) that a sibling unit falsified by merging
today, before this unit was implemented. Flagged above rather than silently
planned around.

## Explicit non-goals (do not do these)

- Do not modify `design/cards/art-briefs.md`, `design/cards/
  spatial-race-identity-set.md`, or `design/cards/wormhole-closure-cards.md`
  — those files are already correct; this unit only fixes the stale prose
  describing them.
- Do not touch Section 3 ("Card Sets & Waves") or Section 4's "Known gap"
  bullet, per `unit.md`'s explicit instruction — even though Section 4's
  bullet is now also stale for the same reason as Gap 1 was. Leave it for
  a future unit.
- Do not touch Open Gap 2's already-resolved paragraph, or Open Gaps `2.`
  ("No digital implementation...") / `3.` ("Jaina is wired up...") beyond
  what Step 1 requires (nothing — their numbers and text are untouched).
- Do not renumber any Open Gap item — Step 1 keeps Gap 1 at `1.`, so no
  renumbering is triggered anywhere in the list.
- Do not hand-edit `site/design/DESIGN-READINESS.html` — let the
  site-build tests in `node --test` regenerate it, then commit whatever
  changed as a side effect (matching the `gap2-resolved-fix` precedent).
