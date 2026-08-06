# cardgame-lore-docs-game-name-references

- merged: 2026-07-30T21:49:18.139Z
- intent: design/ideas-inbox.md's 2026-07-29 entry names the game "Wreck Tangle" and states: "The name should propagate through the rulebook title, the design-shelf site, the card set docs, and lore references to the game itself." test/design-game-name.test.js already locks in the first two targets (design/rules.md's title, site/index.html). The remaining 'lore references to the game itself' target is unclaimed: design/world.md (the setting overview), design/lore.md ("The Long Record", the eras chronicle), and design/star-atlas.md (the world atlas) never mention "Wreck Tangle" anywhere, even though each is exactly the kind of lore document the directive means. Add one sentence to each of the 3 files — near the top, after the H1 title, not replacing it — naming the game "Wreck Tangle" and preserving the setting/game distinction ideas-inbox.md itself states ("The Amaranth Expanse" stays the SETTING name; "Wreck Tangle" is the GAME). For design/world.md, the sentence belongs in or right after "The Setting" section. For design/lore.md, it belongs in the "Summary" section, naturally alongside its existing reference to "the present day the Alpha card set is set in." For design/star-atlas.md, it belongs in the opening paragraph, alongside its existing framing of what the atlas is for. Do not change any file's H1 title, do not touch design/rules.md, site/index.html, design/ideas-inbox.md, or any design/cards/*.md or design/playtest-*.md file — this unit is purely additive to 3 lore files. Regenerate site/design/world.html, site/design/lore.html, and site/design/star-atlas.html via tools/build-site.js. Add one new test file that mechanically asserts the string "Wreck Tangle" appears in all 3 markdown files and all 3 regenerated site pages, and that design/rules.md, site/index.html, and every file under design/cards/ are unchanged from their current content.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-lore-docs-game-name-references (cycle 1)

## AC coverage

- **AC1** (`design/world.md` contains "Wreck Tangle", H1 unchanged): Met. New sentence
  `*Wreck Tangle* is the card game played in the Amaranth Expanse — the Expanse is the
  setting; Wreck Tangle is the game.` added as a new paragraph at the end of "## The
  Setting", before "## A History in Brief". H1 (`# The Amaranth Expanse`, line 1) is
  outside the diff hunk — confirmed unchanged by reading the file directly.
- **AC2** (`design/lore.md` contains "Wreck Tangle", H1 unchanged): Met. New sentence
  added at the end of "## Summary", before "## Timeline of Eras", naturally continuing
  the existing "present day the Alpha card set is set in" reference ("the present day
  described above"). H1 (`# The Long Record — A Chronicle of the Amaranth Expanse`)
  confirmed unchanged.
- **AC3** (`design/star-atlas.md` contains "Wreck Tangle", H1 unchanged): Met. Sentence
  appended to the end of the existing opening paragraph (continuing the paragraph, not
  starting a new one), before "## Homeworlds". H1 (`# The Star Atlas`) confirmed
  unchanged.
- **AC5** (site pages regenerated via `tools/build-site.js`, 
