# cardgame-tools-loader-dedup

- merged: 2026-07-28T13:55:16.631Z
- intent: Move the identical loadCardsFromFile/loadAllCards helper pair — currently duplicated verbatim in tools/render-card.js and tools/sync-cards-to-jaina.js — into lib/parse-card-markdown.js (which already owns the CARDS_DIR-adjacent parsing concerns both tools depend on), export it, and update both tools to import the shared version instead of defining their own. This is a pure internal refactor with zero behavior change: it touches only game-authoring tooling explicitly named as in-bounds by T16's software-gate carve-out (tools for content generation/authoring, not gameplay implementation), and it follows the same working pattern as the already-shipped cardgame-tools-shared-parser-dedup unit and test/parse-card-markdown-dedup.test.js — a mechanical, testable assertion that no duplicate logic remains, per T11's guidance that cleanup work must be framed as testable future behavior rather than an assertion about current repo state.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review: cardgame-tools-loader-dedup (cycle 1)

## AC coverage

- **AC1** — `lib/parse-card-markdown.js` now requires `node:fs`/`node:path`, defines `CARDS_DIR = path.join(__dirname, '..', 'design', 'cards')`, and exports `loadCardsFromFile`/`loadAllCards` (reads `*.md` filenames sorted, parses each via `parseCardMarkdown`). Verified `__dirname` for `lib/` resolves to the same repo-root-relative path as the tools' old `CARDS_DIR`. **Satisfied.**
- **AC2** — `tools/render-card.js`: local `loadCardsFromFile`/`loadAllCards` function declarations and the local `CARDS_DIR` constant are removed; both are now destructured from `require('../lib/parse-card-markdown')`. `module.exports.loadAllCards` (relied on by `tools/composite-card-art.js`) now resolves to the imported function — re-export chain intact. **Satisfied.**
- **AC3** — `tools/sync-cards-to-jaina.js`: local loader pair removed, along with the now-fully-unused `fs`, `path`, `REPO_ROOT`, `CARDS_DIR` (confirmed by reading the full file — nothing else in it touches `fs.`/`path.`). Both functions imported from the lib. **Satisfied.**

All three visible ACs are met, and the new test file (`test/tools-loader-dedup.test.js`) exer
