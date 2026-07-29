# cardgame-site-index-search: Add a client-side search box to the design-shelf index — the site has 28+ pages and zero find-by-name today

## Header

- unit: cardgame-site-index-search
- title: Add a client-side search box to the design-shelf index — the site has 28+ pages and zero find-by-name today
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: 9e46a39759a982e14ba2d3cddb49e761c37fdfce
- end_sha: 63f99454cc5857fdb0709f079ba2b9c4792f728f

## Intent

tools/build-site.js (shipped) generates the phone-browsable design shelf RouterBox asked for specifically to avoid 'picking through files and folders' (design/ideas-inbox.md, T16) — but its buildIndexHtml() only ever emits static per-section <ul> lists with no way to jump to a specific card or doc by name, and the shelf has grown to 28 source pages across World, Races, Characters, Cards (8 card-set files), Rules, and Plans & Ideas, with more Cards-section growth already promoted in the ready queue. This unit adds a search box to the generated index.html: a <input type="search" id="site-search"> placed above the section list, and an inline <script> block containing a small pure function (e.g. `function siteSearchMatches(title, query)`) implementing case-insensitive substring matching with an empty query matching everything, wired to the input's 'input' event to toggle each <li>'s visibility and hide any <section> whose every item is hidden. No server, build step, or new dependency is introduced — the script is inlined the same way the existing CSS constant is inlined, matching the file's established zero-tooling style. The matching logic is written as a standalone, evalable function specifically so it can be tested directly: the new test/build-site-index-search.test.js runs the real build (mirroring test/build-site.test.js's execFileSync pattern), extracts the function's source text from the generated site/index.html via regex, evals it in the test process, and asserts correct behavior against real titles drawn from the current design shelf. Only tools/build-site.js (buildIndexHtml, the CSS constant, and the new matching function) and the new test file change — sectionFor(), SECTION_ORDER, per-page rendering (buildPageHtml, renderMarkdown, cardArtImgHtml), and every design/*.md source are untouched, and test/build-site.test.js is not edited, so this has zero scope overlap with the open cardgame-site-world-section-categorization proposal.

## Acceptance Criteria

- AC1 [paraphrase]: The generated site/index.html contains an <input type="search" id="site-search"> element positioned before the first <section>.
- AC2 [paraphrase]: site/index.html contains an inline <script> defining a standalone matching function that performs case-insensitive substring matching between a title and a query, and treats an empty/whitespace-only query as matching every title.
- AC3 [inferred]: The extracted matching function, evaluated directly in the test process against real titles from the current design shelf (e.g. a card title from alpha-set.md and one from wormhole-closure-cards.md), returns true for a substring query matching that title case-insensitively and false for a query matching none of its words.
- AC4 [inferred] (held_out): The script wires the search input via an 'input' event listener that sets the visibility of each <li> in the index and hides a <section> entirely once none of its <li> items remain visible, without triggering a page navigation or reload.
- AC5 [inferred] (held_out): No file other than tools/build-site.js and the new test/build-site-index-search.test.js is created or modified; sectionFor(), SECTION_ORDER, buildPageHtml, renderMarkdown, and cardArtImgHtml behavior are unchanged from before this unit, and every pre-existing assertion in test/build-site.test.js still passes.

## Plan

(no plan.md)

## Findings

# Blind Review — cardgame-site-index-search, cycle 1

## Scope of diff
- `site/index.html` — adds `<input type="search" id="site-search">` before the section list, and an inline `<script>` at the end of `<main>` defining `siteSearchMatches(title, query)` and wiring it to filter `<li>`/`<section>` visibility on `input`.
- `tools/build-site.js` — adds a new `SITE_SEARCH_SCRIPT` template-literal constant (mirrors the existing `CSS` constant pattern) and inserts exactly two lines into `buildIndexHtml()`'s output array: the `<input>` `<p>` and the `<script>${SITE_SEARCH_SCRIPT}</script>` tag. Verified via direct diff of `git show HEAD~1:tools/build-site.js` vs `git show HEAD:tools/build-site.js` — no other lines changed. `sectionFor()`, `SECTION_ORDER`, `buildPageHtml`, `renderMarkdown`, `cardArtImgHtml`, and `buildCardsIndexHtml` are untouched, matching the stated scope.
- `test/build-site-index-search.test.js` — new file, one test per AC, following the `execFileSync` real-build pattern from `test/build-site.test.js` (which is itself unedited).

## AC-by-AC
- **AC1** (input before first `<section>`): Confirmed in generated `site/index.html:62-63` — `<input type="search" id="site-search">` appears before the first `<section>`. Test asserts this via `inputMatch.index < sectionIndex`. Satisfied.
- **AC2** (standalone case-insensitive matching function, empty/whitespace matches all): `siteSearchMatches` at `site/index.html:129-133` does `query.trim().toLowerCase()`, returns `true` on empty, else substring-checks against `title.toLowerCase()`. Satisfied.
- **AC3** (real-title behavior, evaluated directly): Traced the test's `extractFunctionSource` brace-counter by hand — it correctly isolates just the `siteSearchMatches` function body from the rendered `<script>` (the function has no internal `{}` beyond its own boundary, so depth returns to 0 exactly at its closing brace, not spilling into the following `addEventListener` code). Confirmed the two titles used (`Alpha Set — First Cards of the Amaranth Expanse`, `Wormhole Closure Cards — Sealing the Battlefield Graph`) are the real, current H1 titles in `design/cards/alpha-set.md` and `design/cards/wormhole-closure-cards.md`. Manually evaluated all 8 assertions against the actual function body — all pass. Satisfied.

## Regression check against existing test/build-site.test.js
Read that file's assertions (determinism-by-hash test, `.includes()` substring checks on index.html sections/links, no-external-URL check, nav-resolves-to-index check). The diff only prepends static content before the section list and appends a static inline `<script>` after `</main>`/before `</body>` — none of it removes or reorders existing content, introduces an `http(s)://` reference, or touches non-index pages, so none of these pre-existing assertions should regress. (Not executed directly — `node --test` invocations in this sandbox required interactive approval that wasn't available in this review pass; verified statically instead by reading generated output and tracing the test logic by hand.)

## Non-gating observation (PRE-EXISTING)
The diff for `tools/build-site.js` shows as "Binary files a/tools/build-site.js and b/tools/build-site.js differ" in git rather than a text diff. Checked history: this same binary-diff behavior already occurs on prior, separately-merged commits touching this file (e.g. `28c04ab`, the `cardgame-site-world-section-categorization` builder cycle), so it's a pre-existing git/file characteristic (likely non-ASCII em-dash/ellipsis bytes tripping git's binary heuristic), not something this diff introduced. Confirmed the actual text content is a clean, minimal, readable diff by extracting both blobs and diffing them directly.

## Scope-overlap claim
Diff does not touch `sectionFor()` or `SECTION_ORDER`, and does not edit `test/build-site.test.js`, matching the claimed zero overlap with the open `cardgame-site-world-section-categorization` proposal.

## Verdict
No INTRODUCED findings. All three visible ACs are met, the change is minimal and isolated, and no regression to existing tests is apparent from tracing the logic.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T10:46:21.531Z] **bolt:start** — unit=cardgame-site-index-search start_sha=fee3464eb2df00c7ed700c5a03cc5b9f06763077 branch=bolt/cardgame-site-index-search
- [2026-07-29T10:46:29.408Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T10:51:48.476Z] **bolt:start** — unit=cardgame-site-index-search start_sha=d7c27b9d85a6f2ba1af121d176aac0c094f9a359 branch=bolt/cardgame-site-index-search
- [2026-07-29T10:51:56.424Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T10:51:56.434Z] **plan:done** — plan.md written
- [2026-07-29T10:52:04.616Z] **receipt:done** — valid=false exit=0 diff=false
- [2026-07-29T12:12:43.416Z] **bolt:start** — unit=cardgame-site-index-search start_sha=9e46a39759a982e14ba2d3cddb49e761c37fdfce branch=bolt/cardgame-site-index-search worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-site-index-search
- [2026-07-29T12:12:53.521Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T12:14:26.601Z] **tests:done** — RED verified on test/build-site-index-search.test.js (exit=1)
- [2026-07-29T12:15:29.124Z] **build:c1** — tests green, committed
- [2026-07-29T12:19:09.737Z] **review:c1** — APPROVE
- [2026-07-29T12:24:47.732Z] **review:devils-advocate** — APPROVE
- [2026-07-29T12:24:56.507Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T12:24:56.845Z] **merge:done** — auto-merged bolt/cardgame-site-index-search into master (worktree)


## Receipt

```json
{
  "start_sha": "9e46a39759a982e14ba2d3cddb49e761c37fdfce",
  "end_sha": "78e8a2a4f3161ddeac2fc85ad9022170f24f3f78",
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
  "timestamp": "2026-07-29T12:24:56.506Z",
  "valid": true,
  "agent_reports": {
    "test_writer": "The command needs approval to run. Can you approve running `node --test test/build-site-index-search.test.js` so I can confirm the new tests fail against the current (unimplemented) code?",
    "builder_c1": "Only `tools/build-site.js` was modified (plus the generated `site/index.html` artifact from running the build) — no test files touched. The suite is green: 829/829 passing.",
    "reviewer_c1": "Findings written to `findings.md`. Verified the diff is isolated to `buildIndexHtml()` in tools/build-site.js plus the new test file, traced the AC3 test logic by hand (brace-counting extraction, real titles from the design shelf), and confirmed the \"Binary files differ\" git artifact is a pre-existing quirk (same pattern in an earlier merged commit), not something this diff introduced. No regressions found against the existing test suite's assertions.\n\nAPPROVE",
    "devils_advocate": "## Devil's Advocate Review — cardgame-site-index-search\n\n**Attack attempted:** the diff shows `Binary files a/tools/build-site.js and b/tools/build-site.js differ` — meaning neither the original reviewer nor I could see a textual diff of the actual source change, only the generated `site/index.html` diff. That's a real red flag worth chasing: an approval based on a diff that hides the code change is weak.\n\nI chased it down by reading the full current `tools/build-site.js`, extracting the pre-diff blob via `git show HEAD~1`, and hex-comparing both. Root cause: `renderInline()`'s `protect()`/restore logic (lines ~167, ~189, unrelated to this unit) contains 3 literal NUL bytes embedded in place of expected space characters inside template-literal/regex source — that's what makes git classify the whole file as binary on every diff touching it. I confirmed byte-for-byte that these 3 NUL bytes exist at identical offsets/context in **both** the pre-unit and post-unit blobs. **Pre-existing, not introduced by this diff** — so it can't gate this review, though it's worth a separate ticket since it silently defeats textual review of this file going forward.\n\nWith that dead end ruled out, I checked the actual feature for introduced defects:\n- AC1/AC2/AC3 all verified against the real generated markup and the `SITE_SEARCH_SCRIPT` source in `tools/build-site.js` — input is positioned correctly, `siteSearchMatches` does case-insensitive substring matching with empty-query-matches-all, and the test's real titles (`alpha-set.md`, `wormhole-closure-cards.md`) match the actual current H1s in those files.\n- Checked `test/build-site.test.js` AC4 (\"no external asset references anywhere\") against the new inline `<script>`/`<input>` — neither has `src=`/`href=` so it doesn't trip that regex; AC5 determinism holds since the new HTML is a fixed template with no nondeterminism.\n- No dangling `getElementById` null-deref risk (input and script are always emitted together, unconditionally, by th"
  }
}
```

## Comments

(no comments.md)
