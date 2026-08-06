# cardgame-playtest-fount-economy-refresh

- merged: 2026-07-29T12:23:19.608Z
- intent: design/playtest-full-game.md's 'What This Playtest Surfaced' section (lines 249-288) documents a real limitation it found by actually playing the game on paper with the card pool that existed at the time: Bloom, Signal, and Tangle had no Generator card, capping every deck at Mass or Circuit and making Combat, Discovery past Length 1, and Capture unreachable through ordinary play. design/cards/fount-economy-set.md was written specifically to close that gap — its Summary quotes the finding and names the fix — and is already committed to the repo with a Generator for each of the three previously-dead Founts (Cradle-Root Colony for Bloom, Panoptic Relay Spire for Signal, Communion Waystone for Tangle) plus cheap 1-cost follow-up cards. What was never done is going back to playtest-full-game.md and updating the analysis that motivated fount-economy-set.md in the first place: the table still says 'none' and 'N/A' for all three Founts, and the prose still asserts Combat can't happen with 'the 28 cards currently named' even though 44 are now named across the card files. This unit corrects that table and its surrounding conclusion to reflect the current card pool, and proves the fix in the same load-bearing way the rest of the document already proves everything else — a new, section-cited Worked Example (matching the style of the existing Combat and Capture Worked Examples later in the same file) that plays a Bloom-Fount economy from Cradle-Root Colony's first Generation Phase output through to a Bloom Unit (Feral Bloomcaller or Rootbind Thicket, both already printed in alpha-set.md) being declared an attacker in the Conflict Phase. Only design/playtest-full-game.md and its owning test file, test/design-full-game-playtest.test.js, change; the two existing 40-card decklists (Ada's Mass deck, Kestrel's Circuit deck) and every other already-correct step of the numbered Procedure are left untouched — this unit fixes the stale analysis and adds proof, it does not rewrite the whole document or touch rules.md or any card file.
- criteria: AC1, AC2, AC3, AC4, AC5, AC6 (2 held out)

## Reviewer notes worth keeping

# Review Findings — cardgame-playtest-fount-economy-refresh (cycle 1, restart)

This is the first review of the restarted attempt. The previous attempt (preserved above
this line's predecessor content, see git history / `findings-c3.md`) was rejected because
Worked Example 3 fired rules.md Section 4.7's graph bonus off a bare Frontier Discovery,
which Section 8.1/8.3 explicitly say does not grant control. This diff's Worked Example 3
does not use that mechanism at all — no Discovery, no Section 4.7 — so that specific defect
is gone. Full re-verification below, from scratch, against the current diff.

## Scope of diff

- `design/playtest-full-game.md` — intro paragraph, "Worked Examples" intro paragraph, new
  "### Worked Example 3" subsection, and a rewrite of "## What This Playtest Surfaced"
  (table + three prose paragraphs).
- `site/design/playtest-full-game.html` — regenerated build artifact matching the .md
  change 1:1; not independently authored content.
- `test/design-full-game-playtest.test.js` — allowlists `fount-economy-set.md`, adds
  AC1–AC4 assertions.

No file under `design/cards/`, `design/rules.md`, the two decklists in Procedure step 1, or
any other numbered Proce
