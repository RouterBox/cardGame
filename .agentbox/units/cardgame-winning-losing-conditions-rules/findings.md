# Review: cardgame-winning-losing-conditions-rules (cycle 2)

Cycle 2 diff on top of cycle 1 is small: two sentences added to Section
10.2 (`design/rules.md:736-738,742`) stating that no further priority is
received once the game ends, plus the matching `site/design/rules.html`
regeneration. Re-reviewed the full section against the current file end
to end rather than just the incremental diff, since AC coverage is
judged against the whole shipped section.

## AC-by-AC verification

**AC1** — `design/rules.md` gains `## 10. Winning & Losing Conditions`,
immediately after Section 9; Sections 1-9 are untouched and unrenumbered
(`grep -n "^## "` shows strict 1..10 sequence). Section 10.1 defines the
elimination condition as Core Integrity reaching 0 (or a forced draw from
an empty Archive) and cross-references Section 8.6 by number when
discussing Capture, rather than making Capture itself the elimination
trigger — it explicitly states Capture does not, on its own, reduce Core
Integrity, citing 8.2/8.6 for why a Homeworld specifically cannot be
Captured. Satisfied.

**AC2** — Section 10.2 states the win condition ("only one challenger
remains un-Eliminated... wins immediately") and an explicit draw
condition (simultaneous elimination of both challengers). It also states
how turns/priority proceed once elimination happens: because Section 1
fixes the game at exactly two challengers, one Eliminated challenger
means the game has already ended, so "no further turn is taken" and (new
in cycle 2) "neither challenger receives priority again once the game has
ended" — a correct corollary of Section 6's rule that priority is only
ever held as part of a turn's phases. Satisfied.

**AC3** — Section 10.3 "Worked Example: Simultaneous Elimination" is a
3-step numbered resolution of two challengers hitting 0 Core Integrity in
the same instant via one shared Queue entry, reusing the Reva/Toma
characters and Section 6.2's atomic-resolution rule established elsewhere
in the document. Matches the rigor bar of the shipped Section 7/8 worked
examples. Satisfied.

**AC4** — Section 2 gains three new bolded entries (**Eliminated**,
**Game end**, **Draw**), inserted between the existing **Capture** and
**Card Type** entries, before Section 10's substantive use of the terms.
No duplicate entries. Glossary (Section 2) precedes Section 10 in document
order. Satisfied.

**AC5 (held-out, checked for consistency)** — Section 10.1 affirms, citing
8.2/8.6, that a Homeworld cannot be Captured, and routes the actual
elimination trigger through Core Integrity rather than Capture itself. No
contradiction with Section 8's shipped text.

## Verification performed

- Read the current `design/rules.md` end to end for Sections 1, 2, 5.1,
  5.3, 6, 6.2, 8.2, 8.6, 9-end, and the full new Section 10, confirming
  every cross-reference in the new text resolves to real, matching
  content (not just a plausible-sounding section number).
- Confirmed all ten `## ` top-level headings are strictly numbered 1-10.
- Traced `test/design-winning-losing.test.js` assertion by assertion
  against the actual post-diff file content and `test/helpers/markdown.js`
  (pre-existing, unmodified) — every assertion matches what's on disk.
  Could not execute `node --test`/`npm test` in this review session (Bash
  tool calls required approval that wasn't available), so this is a
  manual trace, not an actual run.
- Checked capitalization/modal-verb usage across the whole file
  (`MAY NOT` / `MUST`) to see whether the new section matches the
  document's established normative-language convention.

## Findings

### PRE-EXISTING / not gating

- The generated `site/design/rules.html` renders each wrapped line of a
  multi-line ordered-list item as its own `<ol><li>...</li></ol>` plus a
  stray `<p>` continuation (visible in the new Section 10.1/10.3 lists).
  This matches the pre-existing behavior of the same markdown→HTML script
  on the older Section 8.3 Discovery list, so it's a property of the
  conversion tooling this diff didn't touch, not new content it introduced.

### Nitpick (INTRODUCED, non-blocking)

- `design/rules.md:716` — "A Homeworld specifically may not be captured
  (Section 8.2, Section 8.6)" uses lowercase "may not," while the two
  Section 8 statements of this exact rule use the document's all-caps
  RFC-2119-style convention ("MAY NOT be Captured"). This is the one spot
  where the new section restates a cross-referenced Section 8 rule in
  prose rather than purely citing it, and capitalization drifts while
  doing so. Purely cosmetic — no semantic contradiction with Section 8,
  and unrelated to the cycle-2 diff itself (unchanged since cycle 1).
  Not sufficient to gate.

## Verdict

All four visible ACs are met by the currently shipped Section 10, the
AC5 hold-out is respected, and the cycle-2 addition (priority-ends-with-
the-game sentences) is accurate and consistent with Section 6. The one
INTRODUCED issue found across both cycles is a capitalization nit with no
functional or rules-consistency impact.

APPROVE
