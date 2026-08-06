# Blind Review: cardgame-ideas-inbox-incorporated-tags (cycle 1)

## AC accounting (visible ACs only)

- **AC1** — `## 2026-07-27 — characters per race (from RouterBox, verbatim)` now ends
  with `[incorporated: cardgame-race-characters]`. Confirmed in diff. **Satisfied.**
- **AC2** — `card anatomy as layered compound object` heading ends with
  `[incorporated: cardgame-card-anatomy-skeleton]`; `deterministic card authoring
  engine …` heading ends with `[incorporated: cardgame-card-authoring-engine]`.
  Both confirmed in diff. **Satisfied.**
- **AC3** — `software gate ruling …` heading ends with
  `[incorporated: cardgame-design-browser-site]` (confirmed in diff); the `use
  Jaina as the content backbone` heading does not appear in the diff at all, i.e.
  remains untagged and byte-identical. **Satisfied.**
- **AC4** (held_out) — not visible to this review; not evaluated. The included test
  file (`test/design-ideas-inbox.test.js`) does not encode a heading-count
  assertion, consistent with AC4 being deferred to a later/held-out check rather
  than baked into this cycle's tests.

All four target tag strings match exactly what the plan specified
(`cardgame-race-characters`, `cardgame-card-anatomy-skeleton`,
`cardgame-card-authoring-engine`, `cardgame-design-browser-site`), with the
correct `[incorporated: <name>]` format and single leading space, appended only
to the ends of the four target heading lines. The two pre-existing 2026-07-26
tags are untouched, and the Jaina heading is untouched.

## Findings

### 1. INTRODUCED — `site/design/ideas-inbox.html` was edited despite the plan and unit intent explicitly scoping it out

**Summary:** The diff modifies `site/design/ideas-inbox.html` in four places
(mirroring the four `.md` heading edits), but both the unit intent ("a pure
bookkeeping edit ... add the four tags, touch nothing else") and the plan's own
Scope section explicitly exclude this file: *"Nothing else in the repo is
touched — not `site/design/ideas-inbox.html` (a build artifact of
`tools/build-site.js` ... regenerating it is out of scope per the unit's own
'touch nothing else' framing and T11)."*

**Failure scenario:** This is a hand-edit of a generated build artifact rather
than a regeneration via `tools/build-site.js`. If the build tool's actual
escaping/formatting rules for a `[incorporated: ...]` suffix differ even
slightly from what was hand-typed here (e.g. how `—`, brackets, or trailing
punctuation get escaped/rendered), the checked-in HTML will silently diverge
from what `tools/build-site.js` would produce from the now-updated `.md`
source. The next person who runs the build tool (or a CI check that diffs
generated output against committed output) gets an unexpected diff or a
silent mismatch, and — per the unit's own T11 framing — this bookkeeping-only
unit was never supposed to carry build-artifact/repo-state changes in the
first place. The plan flagged this file as explicitly out of scope; the build
step didn't follow that plan.

**Verdict:** CONFIRMED — visible directly in the diff hunk for
`site/design/ideas-inbox.html`, contradicted directly by the plan's Scope
section for the same file.

## Everything else

- No other files are touched beyond the three above (`design/ideas-inbox.md`,
  `site/design/ideas-inbox.html`, new `test/design-ideas-inbox.test.js`).
- No blockquote (`>`) lines were altered in `design/ideas-inbox.md` — matches
  plan's explicit constraint.
- No other design docs, test infra, or non-target headings were touched.
- Tags use the correct four unit names outright (no paraphrase, no `.md`
  suffix, no date insertion), matching the plan's verified merged-unit list.

## Verdict

NEEDS_WORK — one INTRODUCED finding (unplanned edit to
`site/design/ideas-inbox.html`, directly contradicting the plan's explicit
scope statement for that file) with a concrete failure scenario.
