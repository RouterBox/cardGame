# cardgame-character-markdown-section-splitter-dedup

- merged: 2026-08-02T01:36:14.594Z
- intent: lib/markdown-sections.js exists specifically to hold the shared H2/H3-section-splitting and paragraph-extraction helpers 'used by lib/parse-race-markdown.js, lib/parse-lore-markdown.js, lib/parse-star-atlas-markdown.js, and lib/parse-founts-markdown.js' (its own file-header comment) — moved there verbatim by the already-shipped cardgame-lib-markdown-section-parser-dedup unit specifically to stop each parser hand-rolling its own copy. lib/parse-character-markdown.js was left out of that migration: its splitIntoH2Sections (current lines 17-36) is byte-for-byte identical to lib/markdown-sections.js's exported splitIntoH2Sections (lines 13-32) — same regex (`/^(#{1,6})\s+(.+?)\s*$/`), same level-2-heading branch, same line-accumulation logic. Delete the local function declaration from lib/parse-character-markdown.js, add `const { splitIntoH2Sections } = require('./markdown-sections');` near the top (mirroring lib/parse-founts-markdown.js's exact import style and placement, immediately after the `slugify` import on line 5), and leave every other function in the file (splitNameAndTitle, parseCharacterBody, parseCharacterMarkdown, raceFromFilename, loadCharactersFromFile, loadAllCharacters) and the module.exports list completely unchanged — splitIntoH2Sections stays exported, just re-exporting the imported function instead of a locally-defined one. Do not touch lib/markdown-sections.js, lib/parse-race-markdown.js, lib/parse-lore-markdown.js, lib/parse-star-atlas-markdown.js, lib/parse-founts-markdown.js, lib/parse-world-narrative-markdown.js, lib/parse-card-markdown.js, or any design/ or tools/ file — this unit only removes one redundant function body from one file and adds one new test file. Add a new, independent test/parse-character-markdown-section-splitter-dedup.test.js mirroring test/markdown-section-parser-dedup.test.js's AC1 reference-equality and source-text checks, scoped to parse-character-markdown.js and splitIntoH2Sections only, plus one behavioral check that loadAllCharacters() still returns the same character records as before (name/slug/race/title/bio/threads for every design/characters/*.md entry).
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-character-markdown-section-splitter-dedup (cycle 1)

## Diff summary

Two files changed, exactly as scoped by plan.md:
- `lib/parse-character-markdown.js`: local `splitIntoH2Sections` declaration (with its
  3-line doc comment) deleted; `const { splitIntoH2Sections } = require('./markdown-sections');`
  added immediately after the `slugify` import.
- `test/parse-character-markdown-section-splitter-dedup.test.js`: new file, 224 lines.

`git diff --stat` against `master` confirms no other file was touched (lib/markdown-sections.js,
the other four parsers, design/, tools/ all untouched).

## AC-by-AC verification

**AC1** — "no source-level declaration of `function splitIntoH2Sections(`"
Confirmed by reading the current file: lines 1-13 of `lib/parse-character-markdown.js` now go
straight from the import block to the `NAME_TITLE_PATTERN` comment; no local function declaration
remains. Diff removes exactly the flagged 25-line block (doc comment + function body), nothing else.
**Satisfied.**

**AC2** — "exported splitIntoH2Sections is reference-equal to markdown-sections.js's export"
`module.exports` at the bottom of `lib/parse-character-markdown.js` (lines 121
