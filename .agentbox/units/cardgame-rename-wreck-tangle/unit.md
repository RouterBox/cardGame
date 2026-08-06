name: cardgame-rename-wreck-tangle
title: The game is named Wreck Tangle � propagate the title
risk_class: standard
mode: autopilot
test_cmd: node --test
project: cardgame

## Intent

RouterBox named the game (design/ideas-inbox.md, 2026-07-29, verbatim): the game is Wreck Tangle; The Amaranth Expanse remains the SETTING name. Propagate the game title everywhere a reader meets it: design/rules.md title/intro should present the game as Wreck Tangle (set in the Amaranth Expanse), the design-shelf site header and index page title should lead with Wreck Tangle, and gamePlan.md plus any doc that calls the GAME by the setting name should be updated. Do NOT rename the setting, the Founts, races, cards, file paths, or repo � this is a title propagation, not a lore rewrite.

## Acceptance Criteria

- AC1 [user]: design/rules.md opens with Wreck Tangle as the game title, presenting The Amaranth Expanse as the setting, and the rules structure integrity test still passes
- AC2 [paraphrase]: The generated site index page title and header lead with Wreck Tangle (rebuild via tools/build-site.js), and existing site tests pass
- AC3 [inferred]: A test asserts the string Wreck Tangle appears in design/rules.md and in site/index.html so future edits cannot silently drop the name
- AC4 [inferred] (held_out): No card file, race file, character file, or file path is renamed by this unit � the diff touches only titles/headers/prose that name the game itself
