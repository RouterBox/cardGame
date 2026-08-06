# cardgame-character-markdown-slugify-dedup

- merged: 2026-07-30T20:07:50.468Z
- intent: lib/parse-character-markdown.js was written before the codebase's slugify convention settled: lib/parse-card-markdown.js exports the canonical implementation, and lib/parse-lore-markdown.js and lib/parse-founts-markdown.js both already import it (`const { slugify } = require('./parse-card-markdown')`) rather than redeclaring it. lib/parse-character-markdown.js and lib/parse-race-markdown.js/lib/parse-star-atlas-markdown.js are the three straggler files that still redeclare their own copy — the latter two are already claimed by the pending cardgame-lib-markdown-section-parser-dedup proposal, leaving parse-character-markdown.js as the one remaining, unclaimed instance. Delete lines 103-108 (the local slugify function) from lib/parse-character-markdown.js, add a `const { slugify } = require('./parse-card-markdown');` import near the top (mirroring parse-lore-markdown.js's exact import style and placement), and leave every other function (splitIntoH2Sections, splitNameAndTitle, parseCharacterBody, parseCharacterMarkdown, raceFromFilename, loadCharactersFromFile, loadAllCharacters) and the module.exports list itself completely unchanged — slugify stays exported, just re-exporting the imported function instead of a locally-defined one. Do not touch lib/parse-card-markdown.js, lib/parse-race-markdown.js, lib/parse-star-atlas-markdown.js, lib/parse-lore-markdown.js, lib/parse-founts-markdown.js, or any design/ or tools/ file — this unit only removes one redundant function body from one file.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-character-markdown-slugify-dedup, cycle 1

## Scope note

The diff supplied for review spans two commits: `c9632a1` (test-writing
phase, adds `test/parse-character-markdown-slugify-dedup.test.js`, 83 lines)
and `180329a` (builder cycle 1, touches only `lib/parse-character-markdown.js`,
+1/-7 lines). Confirmed via `git show --stat` on both commits. The builder's
actual contribution this cycle is the `lib/parse-character-markdown.js` edit
only; the new test file is PRE-EXISTING relative to this cycle (authored by
the prior test-writing step, not the builder).

## AC-by-AC verification

**AC1** — no local `slugify` function declaration; imports from
`./parse-card-markdown`. Confirmed by reading the resulting file: line 5 adds
`const { slugify } = require('./parse-card-markdown');` immediately after the
`path` require (matching `parse-lore-markdown.js`'s placement per the plan),
and the old `function slugify(name) {...}` block (former lines 103-108) is
gone. Satisfied.

**AC2** — `module.exports` still includes `slugify`; behavior preserved.
Confirmed: `module.exports` block (lines 144-151) is untouched and still
lists `slugify`. Compared the deleted local imp
