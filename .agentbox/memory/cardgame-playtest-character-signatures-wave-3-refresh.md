# cardgame-playtest-character-signatures-wave-3-refresh

- merged: 2026-07-31T02:16:44.967Z
- intent: design/playtest-full-game.md is the on-paper playtest procedure demonstrating design/rules.md against real decks; its own 'Worked Examples' section (added incrementally — Worked Example 4 closed the identical gap for character-signatures-wave-2.md) exists precisely to give a fully-specified, legal card a concrete on-paper demonstration when it was never reachable through the numbered Procedure's fixed decklists. character-signatures-wave-3.md (5 cards, one third-named character per race: Bren Hollowmelt/Cindral Reach/3 Mass, Vesk-Aduun/Mireth Bloom/3 Bloom, Ilio Marn-Cassity/Panoptic Concord/2 Signal, Ossian Thale/Starweave Communion/3 Tangle, Replica-Sergeant Kess Ninefold/Wrought Assembly/2 Circuit) has never appeared in any playtest document. Add a 'Worked Example 5' section immediately after the existing 'Worked Example 4' section and before 'What This Playtest Surfaced', following that section's exact established shape: a heading citing the rules.md sections each card's own rules text exercises, then one sub-block per card giving its exact Cost line and Type line (quoted verbatim from character-signatures-wave-3.md via lib/parse-card-markdown.js's own field format, 'Cost line: X' / 'Type line: Y') followed by a hypothetical 'Suppose...' demonstration reusing an already-established challenger (Ada, Kestrel, or Bryn) or introducing a new one only where none fits, exactly as Worked Example 4 did for wave-2. Update the 'Worked Examples' section's own intro paragraph (currently ending '...for cards that were fully specified and legal, but had never appeared in any playtest procedure before now') to add a sentence naming the fifth example and character-signatures-wave-3.md, and update the file's opening paragraph's source-file list to add 'character-signatures-wave-3.md'. Do not touch Worked Examples 1-4's existing text, Step 1's two decklists, Section 11's copy-count discussion, design/playtest-full-game-2.md, design/playtest-spatial.md, character-signatures-wave-3.md itself, or any card file. Add a new test/design-playtest-character-signatures-wave-3-refresh.test.js mirroring test/design-playtest-character-signatures-wave-2-refresh.test.js's assertion shape (section-exists, section-ordering, heading-citations, card-names-verbatim, Cost/Type-line-exactness, unchanged-prior-content, and site-regeneration checks). Regenerate site/ via tools/build-site.js.
- criteria: AC1, AC2, AC3, AC4, AC5 (2 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-playtest-character-signatures-wave-3-refresh (cycle 3)

## Method

Since this is a non-interactive review environment, `node --test` execution
was blocked by the harness's permission/sandbox layer (consistent with the
Reviewer's no-write mandate, since the test suite's own AC5 check calls
`execFileSync` on `tools/build-site.js`, which writes to `site/`). Verified
statically instead:

- Confirmed via `git diff --stat` from the unit's true base commit (`51eca60`,
  right after the prior unit's archive commit) to `HEAD` that only three files
  changed: `design/playtest-full-game.md`, `site/design/playtest-full-game.html`,
  and the new `test/design-playtest-character-signatures-wave-3-refresh.test.js`
  — exactly matching the diff shown for blind review, byte-for-byte (compared
  full diff text line by line).
- Independently recomputed SHA-256 over `design/playtest-full-game-2.md`,
  `design/playtest-spatial.md`, and `design/cards/character-signatures-wave-3.md`
  using `Get-FileHash`; all three match the hashes hardcoded in the new test's
  `UNCHANGED_FILE_HASHES` exactly, confirming those files are genuinely
  untouched and that AC4's hash-based test would 
