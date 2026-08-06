# cardgame-site-index-search

- merged: 2026-07-29T12:24:57.031Z
- intent: tools/build-site.js (shipped) generates the phone-browsable design shelf RouterBox asked for specifically to avoid 'picking through files and folders' (design/ideas-inbox.md, T16) — but its buildIndexHtml() only ever emits static per-section <ul> lists with no way to jump to a specific card or doc by name, and the shelf has grown to 28 source pages across World, Races, Characters, Cards (8 card-set files), Rules, and Plans & Ideas, with more Cards-section growth already promoted in the ready queue. This unit adds a search box to the generated index.html: a <input type="search" id="site-search"> placed above the section list, and an inline <script> block containing a small pure function (e.g. `function siteSearchMatches(title, query)`) implementing case-insensitive substring matching with an empty query matching everything, wired to the input's 'input' event to toggle each <li>'s visibility and hide any <section> whose every item is hidden. No server, build step, or new dependency is introduced — the script is inlined the same way the existing CSS constant is inlined, matching the file's established zero-tooling style. The matching logic is written as a standalone, evalable function specifically so it can be tested directly: the new test/build-site-index-search.test.js runs the real build (mirroring test/build-site.test.js's execFileSync pattern), extracts the function's source text from the generated site/index.html via regex, evals it in the test process, and asserts correct behavior against real titles drawn from the current design shelf. Only tools/build-site.js (buildIndexHtml, the CSS constant, and the new matching function) and the new test file change — sectionFor(), SECTION_ORDER, per-page rendering (buildPageHtml, renderMarkdown, cardArtImgHtml), and every design/*.md source are untouched, and test/build-site.test.js is not edited, so this has zero scope overlap with the open cardgame-site-world-section-categorization proposal.
- criteria: AC1, AC2, AC3, AC4, AC5 (2 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-site-index-search, cycle 1

## Scope of diff
- `site/index.html` — adds `<input type="search" id="site-search">` before the section list, and an inline `<script>` at the end of `<main>` defining `siteSearchMatches(title, query)` and wiring it to filter `<li>`/`<section>` visibility on `input`.
- `tools/build-site.js` — adds a new `SITE_SEARCH_SCRIPT` template-literal constant (mirrors the existing `CSS` constant pattern) and inserts exactly two lines into `buildIndexHtml()`'s output array: the `<input>` `<p>` and the `<script>${SITE_SEARCH_SCRIPT}</script>` tag. Verified via direct diff of `git show HEAD~1:tools/build-site.js` vs `git show HEAD:tools/build-site.js` — no other lines changed. `sectionFor()`, `SECTION_ORDER`, `buildPageHtml`, `renderMarkdown`, `cardArtImgHtml`, and `buildCardsIndexHtml` are untouched, matching the stated scope.
- `test/build-site-index-search.test.js` — new file, one test per AC, following the `execFileSync` real-build pattern from `test/build-site.test.js` (which is itself unedited).

## AC-by-AC
- **AC1** (input before first `<section>`): Confirmed in generated `site/index.html:62-63` — `<input type="search" id="site-search
