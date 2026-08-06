GATE: none

# Unit: cardgame-rules-restriction-movement-contradiction-fix

## Summary

`design/rules.md` Section 8.4's final paragraph currently hedges that it is
"an open question" whether a Directional or Team Restriction governs future
Unit movement (Section 8.1), while Section 8.1 itself already states
unconditionally that movement "must still traverse a Wormhole that is not
Closed (Section 8.5) and whose Restrictions (Section 8.4) permit it" — i.e.
Section 8.1 already assumes Directional/Team Restrictions gate movement, but
8.4 says that's unresolved. This unit rewrites only the final sentence of
that 8.4 paragraph to close the contradiction, in Section 8.1's favor:
Directional/Team Restrictions govern future Unit movement exactly as they
already govern an Assault's path. Nothing else in rules.md, no card file,
changes.

This is a small, low-risk, single-file text edit plus one test assertion and
a regenerated static HTML file. No schema, no runtime behavior, no user data.
FIRE assessment: Reversible (plain text edit, git-tracked), no security
impact, no user data, no schema changes. `GATE: none`.

## Step 1 — Builder: edit `design/rules.md` Section 8.4

File: `design/rules.md`

The final paragraph of Section 8.4 (currently lines 558-564, but match by
content, not line number, since earlier edits in this session could shift
line numbers by a line or two — search for the exact text below) currently
reads:

```
A Directional, Team, or Unit-type Restriction on a Wormhole never changes
that Wormhole's Length or its Closed/un-Closed state, and a Wormhole may
carry more than one Restriction of different kinds at once. Whether a
Directional or Team Restriction also limits a future rule's or card's Unit
movement (Section 8.1), and not only an Assault's path (Section 8.6), is an
open question this section does not resolve; only the Unit-type Restriction
is stated, by this rulebook, to govern such movement directly.
```

Replace ONLY the final sentence (starting "Whether a Directional or Team
Restriction...") — keep the first two sentences (about Length/Closed state
and multiple Restrictions) byte-for-byte unchanged. Replace the whole
paragraph text with:

```
A Directional, Team, or Unit-type Restriction on a Wormhole never changes
that Wormhole's Length or its Closed/un-Closed state, and a Wormhole may
carry more than one Restriction of different kinds at once. A Directional or
Team Restriction governs a future rule's or card's Unit movement (Section
8.1) exactly as it already governs an Assault's path (Section 8.6): the same
Directional and Team constraints that limit which Wormholes an Assault may
count as part of its path likewise limit which Wormholes a Unit may move
across, whenever some future rule or card grants that movement.
```

Use the Edit tool with `old_string` set to the exact final sentence below
(unique in the file — confirm with a search first) and `new_string` as
shown, so the first two sentences of the paragraph are untouched:

- `old_string`:
```
Whether a
Directional or Team Restriction also limits a future rule's or card's Unit
movement (Section 8.1), and not only an Assault's path (Section 8.6), is an
open question this section does not resolve; only the Unit-type Restriction
is stated, by this rulebook, to govern such movement directly.
```
- `new_string`:
```
A Directional or
Team Restriction governs a future rule's or card's Unit movement (Section
8.1) exactly as it already governs an Assault's path (Section 8.6): the same
Directional and Team constraints that limit which Wormholes an Assault may
count as part of its path likewise limit which Wormholes a Unit may move
across, whenever some future rule or card grants that movement.
```

Note: the exact line-wrapping of the replacement above is a suggestion, not
a requirement — match the rulebook's existing ~75-character soft line wrap
convention (look at surrounding paragraphs for the wrap width) rather than
pasting the code block's wrapping verbatim if it doesn't line up. What
matters for the tests is the prose content, not the wrap column.

### What must NOT change in this step

- Do not touch the Unit-type Restriction bullet (lines ~548-556, the bullet
  starting "A **Unit-type Restriction** limits passage...") — it is the
  paragraph AC3 (held-out) requires stay byte-for-byte identical. This edit
  only touches the paragraph AFTER the bulleted list, and only that
  paragraph's final sentence.
- Do not touch the first two sentences of the final paragraph ("A
  Directional, Team, or Unit-type Restriction on a Wormhole never changes
  that Wormhole's Length or its Closed/un-Closed state, and a Wormhole may
  carry more than one Restriction of different kinds at once.").
- Do not touch Section 8.1 (the "Unit's location" paragraph, currently around
  lines 452-472) — it is already correct per the unit spec; this fix aligns
  8.4 to it, not the reverse.
- Do not touch any other section of `design/rules.md` or any file under
  `design/cards/`.

### Verify after editing

Run:
```
grep -n "open question this section does not resolve" design/rules.md
```
Expected output: no match (empty).

```
grep -n "governs a future rule's or card's Unit movement" design/rules.md
```
Expected output: one match, in Section 8.4's final paragraph.

Confirm the Unit-type Restriction bullet (search for `Unit-type Restriction**
limits passage`) is unchanged from the version quoted above.

## Step 2 — Test-writer: extend `test/design-battlefield.test.js`

File: `test/design-battlefield.test.js` (pre-existing file — this edit is
scoped to the test-writer stage, not the builder, per this repo's rule that
builders never touch `test/*.js`).

Add ONE new test. The file already has a `battlefieldProse()` helper (see
line 29-32) that returns Section 8's body text with whitespace/line-wrap
normalized, and a `battlefieldBody()` helper (line 21-25) that returns the
raw (non-normalized) Section 8 body text — both already used by nearby tests
in the "Reconciliation ACs" block starting at line 203.

Insert the new test at the end of the file (after the last test, which
currently ends at line 278 with the "Reconciliation: a Unit may be deployed
located at a Planet..." test), so the new test appended after line 279
(closing `});` of the last existing test) reads:

```js

test('Reconciliation AC5: Section 8.4 no longer treats Restriction-governed Unit movement as an open/unresolved question', () => {
  const body = battlefieldBody();
  assert.ok(
    !/open question this section does not resolve/i.test(body),
    'expected the "open question this section does not resolve" hedge to be removed from Section 8'
  );
  assert.ok(
    /directional or\s+team restriction governs.{0,80}unit movement/i.test(battlefieldProse()),
    'expected Section 8.4 to state definitively that a Directional or Team Restriction governs future Unit movement'
  );
});
```

Notes for the test-writer:
- Use `battlefieldBody()` (raw, non-normalized) for the negative "hedge
  phrase must not appear" assertion, matching the pattern the sibling
  `Reconciliation AC1` test (line 212) already uses for a similar
  no-longer-present-phrase check.
- Use `battlefieldProse()` (normalized) for the positive assertion, since
  the replacement sentence in Step 1 wraps across multiple lines in the
  markdown source and `normalizeProse` collapses that wrapping — matching
  the pattern the sibling `Reconciliation AC2` "Unit-type Restriction"
  positive-phrase test (line 231-234) already uses.
- The regex `/directional or\s+team restriction governs.{0,80}unit movement/i`
  is written loosely (tolerant of exact wording/line-wrap) so it matches the
  Step 1 replacement text ("A Directional or Team Restriction governs a
  future rule's or card's Unit movement...") without being so tight that a
  minor future rewording of this same sentence breaks the test. Do not
  tighten it to match the Step 1 wording byte-for-byte.
- Do not modify any other existing test in this file. Do not renumber or
  rename existing `Reconciliation AC*` tests — this is a new, additional
  `AC5`, appended, not a replacement.

### Expected test output after Step 1 + Step 2

Run:
```
node --test test/design-battlefield.test.js
```
Expected: all tests in the file pass, including the new
`Reconciliation AC5: ...` test — total test count increases by exactly 1
compared to the pre-unit baseline (28 existing `test(...)` calls become 29).
No existing test's pass/fail status changes.

## Step 3 — Builder: regenerate the static site

After Step 1's markdown edit and Step 2's test addition are both in place,
regenerate the built HTML so `site/design/rules.html` reflects the updated
markdown:

```
node tools/build-site.js
```

Expected output (printed to stdout): a line like
`Built <N> pages into site/` (the exact page count `<N>` is whatever the
script currently discovers — this unit does not add or remove any page, so
`<N>` should match the count from a build before this unit's changes).

This is a full, deterministic rebuild driven by `discoverSourceFiles()` /
`buildPageHtml()` in `tools/build-site.js` — it walks all of `design/**/*.md`
plus `gamePlan.md` and rewrites every output page, including
`site/design/rules.html`, so no other page's content should be affected
except that `rules.html`'s Section 8.4 content changes to match the new
markdown. Do not hand-edit `site/design/rules.html` directly — it must come
from running the build script, since the file states elsewhere in the repo
that generated site HTML escapes characters (e.g. apostrophes as `&#39;`)
that a hand edit would get wrong.

### Verify after regenerating

```
grep -n "open question this section does not resolve" site/design/rules.html
```
Expected: no match (empty) — confirms the generated HTML picked up the
markdown change.

## Step 4 — Full test suite

Run:
```
node --test
```

Expected: full suite passes, including `test/design-battlefield.test.js`
(now 29 tests, up from 28) and any test that itself invokes
`tools/build-site.js` and asserts on `site/` output (there is site-build
locking logic in `lib/fs-lock.js` specifically because multiple test files
rebuild `site/` — Step 3's manual build is safe to run before the suite;
the suite's own build calls will simply rebuild again to the same content).

## Acceptance-criteria mapping

- AC1 → Step 1 (hedge sentence removed) + Step 2 (`Reconciliation AC5`
  negative assertion).
- AC2 → Step 1 (replacement sentence states Directional/Team Restrictions
  govern future Unit movement, consistent with 8.1's unconditional wording)
  + Step 2 (`Reconciliation AC5` positive assertion).
- AC3 (held_out) → Step 1's explicit "must NOT change" list preserves the
  Unit-type Restriction bullet byte-for-byte; this AC needs no new test
  since existing `Reconciliation AC2` positive test (line 228-235) already
  pins the Unit-type Restriction bullet's content and will fail if it's
  disturbed.
- AC4 → Step 1 touches only the one sentence identified; Step 1's "must NOT
  change" list plus normal `git diff design/rules.md` review after Step 1
  confirms Section 8.1 and all other sections/cards are untouched. No
  automated test enforces whole-file-except-one-sentence diffs; the builder
  should `git diff design/rules.md` after Step 1 and confirm the diff is
  exactly the one sentence before proceeding to Step 2.
- AC5 → Step 2 (new test) + Step 3 (site regeneration) + Step 4 (`node
  --test` passes).

## Held-out-criteria note

AC3 is redundant with the unit's own explicit instruction ("Do not change
what a Unit-type Restriction does... this unit's change is additive to
Directional/Team, not a revision of Unit-type's status") — it is not a novel
requirement, just a specific instance of "don't touch the Unit-type
paragraph." No spec-bug flag needed.
