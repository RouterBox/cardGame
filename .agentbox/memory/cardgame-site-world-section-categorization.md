# cardgame-site-world-section-categorization

- merged: 2026-07-29T11:03:15.285Z
- intent: tools/build-site.js (shipped) generates the phone-browsable design-shelf site that exists specifically because RouterBox needs to 'see what we got without going over to my computer and picking through files and folders' (design/ideas-inbox.md, incorporated by cardgame-design-browser-site). Its sectionFor() function is the sole router deciding which of SECTION_ORDER's named buckets (World, Races, Characters, Cards, Rules, Plans & Ideas, Other) each design doc lands in on the generated index.html, and it currently has an explicit case for design/world.md ('World') but none for design/lore.md or design/star-atlas.md — both shipped, both core world-building documents (a 7-era history timeline and a 5-homeworld-plus-frontier-worlds atlas respectively) — so both fall through to the generic `return 'Other';` at the end of the function. This unit adds two more explicit cases to sectionFor() so relPath === 'design/lore.md' and relPath === 'design/star-atlas.md' both return 'World', grouping them on index.html with design/world.md exactly as their content already belongs. It leaves every other classification untouched: design/playtest-full-game.md, design/playtest-spatial.md, and any other unclassified doc continue to fall to 'Other' (explicitly out of scope for this unit), design/ideas-inbox.md and gamePlan.md keep their existing 'Plans & Ideas' mapping, and Races/Characters/Cards/Rules are untouched. Only tools/build-site.js's sectionFor() function and its owning test/build-site.test.js change — no design/*.md content, no rendering logic (renderMarkdown/renderBlocks/cardArtImgHtml), and no other tool is touched.
- criteria: AC1, AC2, AC3, AC4, AC5 (2 held out)

## Reviewer notes worth keeping

# Review: cardgame-site-world-section-categorization (cycle 1)

## AC coverage

- **AC1** (`sectionFor('design/lore.md')` / `sectionFor('design/star-atlas.md')` → `'World'`,
  visible in generated `index.html`): Confirmed. `tools/build-site.js` lines 107–108 add the
  two exact cases specified in plan.md, verbatim. `site/index.html`'s World `<section>` now
  lists `design/lore.html`, `design/star-atlas.html`, `design/world.html` (alphabetical, as
  plan.md predicted). New test `'World section: ...'` in `test/build-site.test.js` asserts
  this directly against the real generated output. **Met.**

- **AC2** (no `Other` entry for lore/star-atlas): Confirmed. The `index.html` diff removes
  exactly those two `<li>` entries from the `Other` section and nothing else. New test asserts
  their absence from the `Other` section. **Met.**

- **AC3** (every other section unchanged; playtest docs stay in `Other`): Confirmed. The diff
  contains no hunks touching the Races/Characters/Cards/Rules/Plans & Ideas sections of
  `index.html` (i.e. unchanged). `Other` retains both `design/playtest-full-game.html` and
  `design/playtest-spatial.html`; per-page sibling nav in `playtest-full-game.html` /

