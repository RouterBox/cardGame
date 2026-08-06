# cardgame-tools-shared-parser-dedup

- merged: 2026-07-28T09:01:02.584Z
- intent: tools/render-card.js and tools/build-site.js (both shipped under cardgame-card-authoring-engine and its follow-ups) each independently implement the same field-prefix parsing convention for design/cards/*.md — recognizing 'Cost line:', 'Type line:', 'Rules text:', and 'Stats/counters line:' prefixes and a slugify(name) algorithm for computing card slugs. The pending cardgame-jaina-card-sync-dryrun proposal names this duplication explicitly and would introduce a third independent copy of the same convention in tools/sync-cards-to-jaina.js. This unit extracts the shared logic into lib/parse-card-markdown.js, exporting parseCardMarkdown(markdown) and slugify(name), and updates tools/render-card.js and tools/build-site.js to import and use it instead of their own copies. It is a pure refactor: output of both tools must be byte-identical before and after, verified by re-running their existing test suites. This is content-authoring tooling under T16's partial gate opening, not game software, and it is the deletion/simplification candidate the portfolio rules call for after five consecutive growth-only cardgame units — it also de-risks the still-open Jaina sync proposal by giving it one canonical parser to import rather than a third copy to maintain.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind review — cardgame-tools-shared-parser-dedup, cycle 1

## Verification performed
- Read `tools/build-site.js` (untouched, in full) and confirmed the plan's factual
  correction: it is a generic `design/**` markdown→HTML renderer with no `slugify`,
  no `FIELD_PREFIXES`, and no card-field parsing of any kind. Grepped it for the four
  field-prefix literals — zero matches, before and after this diff, because it never
  had this logic.
- Read `tools/render-card.js` in full post-diff: no leftover `FIELD_PREFIXES`,
  `isFieldStart`, `consumeField`, `parseCardBody`, `splitIntoH3Sections`, or `slugify`
  definitions remain; it imports both from `../lib/parse-card-markdown` and uses them.
- Read `lib/parse-card-markdown.js` in full and diffed it line-by-line against the
  code the diff removed from `tools/render-card.js`: identical logic, verbatim,
  including comments. `loadCardsFromFile` now does `fs.readFileSync` +
  `parseCardMarkdown(markdown)`, which is behaviorally identical to the old inline
  `splitIntoH3Sections`/`parseCardBody` loop it replaces.
- Confirmed via `git diff HEAD~2 -- test/build-site.test.js test/render-card.test.js
  tools/build-site.js` that these three fil
