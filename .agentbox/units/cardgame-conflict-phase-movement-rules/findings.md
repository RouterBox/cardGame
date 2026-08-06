# Blind Review — cardgame-conflict-phase-movement-rules (cycle 2)

## AC coverage

- **AC1** (no `//` lines in Section 5.4): Satisfied. The rewritten section
  (design/rules.md:297-325) contains no `//`-prefixed lines. Verified by
  reading the current file and by the new `movement-rules AC1` test.
- **AC2** (Movement action across a Wormhole to an adjacent Planet): Satisfied.
  Rule 1 ("Movement") states the active player MAY take a Movement action
  moving a Ready Unit across a single Wormhole to an adjacent Planet
  (design/rules.md:302-305). New test regex verified by hand-tracing against
  `normalizeProse` output — matches.
- **AC3** (moved Unit cannot attack unless a card/ability says otherwise):
  Satisfied. Rule 2 states this exactly, including the exception clause
  (design/rules.md:313-316).
- **AC4** (blocker must occupy the same Planet as the Planet under attack):
  Satisfied. Rule 3 states this exactly (design/rules.md:317-321).
- **AC5** (Fount Point cost equal to the Wormhole's Length): Satisfied. Rule 1
  states the Movement action costs Fount Points equal to the traversed
  Wormhole's Length (design/rules.md:307-309), consistent with the existing
  Assault cost model (Section 8.6: "Fount Points ... equal to the sum of the
  Lengths of every Wormhole on the path").

All 5 new tests in test/design-rules.test.js were hand-verified against the
actual Section 5.4 text and `test/helpers/markdown.js`'s `normalizeProse`
(collapses newlines/whitespace, so the ~75-char line wrapping in the new
prose does not break the regex assertions). Each regex was traced against
the literal committed text and matches.

## Findings

### PRE-EXISTING: numbered-list rendering breaks in site/design/rules.html
`tools/build-site.js`'s block parser only recognizes list continuation on
lines that themselves start with `N.` (`/^\s*\d+\.\s+/`); wrapped/indented
continuation lines fall through to the paragraph branch. This fragments each
of the new Section 5.4 list items into a one-`<li>` `<ol>` plus a sibling
`<p>` containing the wrapped continuation text with literal multi-space runs
(e.g. `Ready    Unit`). This looks like a diff-introduced regression at
first glance (site/design/rules.html is part of the diff), but the exact
same broken pattern already exists, pre-diff, for the untouched Section 8.3
Discovery list (confirmed by inspecting the currently-checked-out
site/design/rules.html at e.g. "Choose an origin Planet..."). The parser bug
is a latent, pre-existing limitation of the site generator that this diff
merely re-triggers by adding another wrapped numbered list; it is not caused
by this diff. **PRE-EXISTING — does not gate.**

### INTRODUCED (non-blocking, explicitly scoped out): Section 8.1 (and, relatedly, 8.4) go stale
Section 8.1 (design/rules.md:443-450, untouched by this diff) says: "Section
5.4 already carries open, unresolved notes contemplating a costed
wormhole-movement system... this rulebook currently defines no action, on
its own, that relocates an already-deployed Unit... a design space Section
5.4's open notes already flag." That statement is now false: Section 5.4
Rule 1 defines exactly such an action. The same framing ("whenever a future
rule or card grants it") recurs in Section 8.4's Unit-type Restriction text
(design/rules.md:530-538) and is likewise now slightly stale, since a base
rule (not just a "future rule or card") now grants movement.

This is a real, concrete inconsistency caused by this diff (before it,
Section 8.1's claim was accurate). However: (1) it is explicitly identified
and deliberately deferred in plan.md's "Known residual inconsistency"
section with a clear rationale and a proposed follow-up; (2) the unit's own
Intent explicitly restricts scope to "design/rules.md's Section 5.4 and its
owning test file" only, and this project's global instructions direct
against touching unrelated code/sections; (3) no visible AC covers Section
8.1/8.4 consistency. Fixing it here would mean exceeding the unit's own
chartered scope. **INTRODUCED, but a deliberate, documented, low-severity
scope decision consistent with the unit's own Intent — does not gate.**

## Verdict rationale

Both files touched match the plan exactly (verified via diff and direct
file read). No code outside the test file changed. All 5 visible ACs are
demonstrably true in the shipped design/rules.md text and are covered by
correctly-matching new tests. The only two findings are (a) a pre-existing
site-generator limitation re-triggered but not caused by this diff, and (b)
a documentation-staleness side effect that the unit's own Intent explicitly
scoped out of this change, with the inconsistency clearly logged for a
follow-up unit.

APPROVE
