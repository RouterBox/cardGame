# Blind Review: cardgame-ideas-inbox-jaina-sync-tag (cycle 2)

## AC coverage

- **AC1** [user]: `design/ideas-inbox.md` line 121 heading now reads
  `## 2026-07-28 — use Jaina as the content backbone (from RouterBox, verbatim) [incorporated: cardgame-jaina-card-sync-live]`.
  Matches the required tag exactly, appended in the same pattern as the other
  five tagged headings. **Met.**

- **AC2** [paraphrase]: The old test `AC3: "use Jaina as the content backbone"
  heading remains untagged` (asserting `!title.includes('[incorporated:')`)
  is replaced by `AC3: "use Jaina as the content backbone" heading ends with
  [incorporated: cardgame-jaina-card-sync-live]` (asserting
  `title.endsWith('[incorporated: cardgame-jaina-card-sync-live]')`). Diff
  shows exactly one test block changed; the other five tests in the file
  (file-exists, AC1 characters-per-race, AC2 card-anatomy, AC2 authoring-engine,
  AC3 software-gate-ruling) are byte-identical to before. **Met.**

- **AC3** [inferred]: Read back the full current `design/ideas-inbox.md` and
  diffed it mentally against the diff hunk — only line 121 changed (one
  trailing ` [incorporated: cardgame-jaina-card-sync-live]` appended). The
  other six `## ` headings (lines 8, 26, 49, 62, 82, 104) and all `>` quote
  blocks (lines 10-11, 28-32, 51-52, 64-69, 84-90, 106-110, 123-124) are
  unchanged. Diff contains no hunks outside line 121 for this file. **Met.**

## Other diff content (not covered by a visible AC)

- `site/design/ideas-inbox.html` is also changed, mirroring the same
  heading's `<h2>` text. This file is a generated artifact produced by
  `tools/build-site.js` from `design/*.md` (confirmed by reading the script
  header and by the fact the other five already-tagged headings already
  appear tagged in this same HTML file, i.e. it was already kept in sync by
  a prior unit's build step). Regenerating it to stay consistent with the
  one md line that changed is not a scope violation — it's a mechanical
  build artifact, not a hand-authored edit, and no AC restricts it.

## Verification performed

- Read `design/ideas-inbox.md` and `test/design-ideas-inbox.test.js` in full
  in the built worktree; content matches the diff exactly (diff already
  applied and committed — working tree clean).
- Grepped the repo for `remains untagged` / `cardgame-jaina-card-sync-live`:
  only the three files in the diff (plus unrelated site/index.html,
  site/gamePlan.html nav links and workItems archive docs, none of which
  reference this test/heading) match.
- Confirmed `tools/build-site.js` exists and generates `site/design/*.html`
  from `design/*.md`, explaining the mirrored HTML diff.
- Was not able to execute `node --test` / `npm test` in this review sandbox
  (command required approval that wasn't available in this session). Static
  read-back of both files line-by-line against the diff confirms no other
  test or heading was touched, so no functional risk is expected from the
  change; this is noted as a gap in the review rather than a finding.

## Findings

None. No INTRODUCED issues found. The diff is exactly the two targeted edits
described in the plan, plus a consistent regeneration of the derived HTML
file.

APPROVE
