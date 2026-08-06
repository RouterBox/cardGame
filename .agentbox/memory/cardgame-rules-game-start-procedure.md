# cardgame-rules-game-start-procedure

- merged: 2026-07-29T11:21:41.255Z
- intent: design/rules.md (shipped) already reached the MTG Comprehensive Rules structural bar T9 names — numbered sections, defined vocabulary, cross-referenced edge cases — across Sections 1 through 14, but two of those sections already presuppose a game-start procedure that was never itself written: Section 11.1 says a challenger's Archive must hold 40+ cards 'before shuffling and before that challenger's opening hand is drawn from it,' and Section 5.1 carves out an exception for 'the challenger who takes the very first turn of the game,' both treating shuffling, opening hands, and first-turn determination as already-defined concepts when no section defines any of them. This unit adds a new '## 15. Starting the Game' section — appended after Section 14 rather than inserted earlier, matching the precedent set by Sections 11-14 themselves each being appended in turn without renumbering anything before them — that states, in numbered rules prose: (1) each challenger shuffles their Archive (Section 3, Section 11.1) before the game begins; (2) a specific procedure for determining who takes the first turn; (3) a specific numeric opening hand size drawn before the first Dawn Phase; (4) a mulligan procedure letting a dissatisfied challenger shuffle their hand back and redraw the same size, capped at a stated number of times, written to stay consistent with Section 5.1's existing first-turn-doesn't-draw exception rather than contradict it. It closes with a Worked Example subsection, in the same cited, section-numbered style as Sections 8.7, 10.3, and 11.3, walking two challengers through shuffling, first-player determination, opening hands, and one challenger taking a mulligan. Only design/rules.md (adding Section 15; Sections 1-14 untouched) and a new test/design-rules-game-start.test.js change — no card file, no other design doc, and no in-flight or open proposal's claimed section is touched.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review: cardgame-rules-game-start-procedure (cycle 3)

## Verdict: APPROVE

## Diff scope
`design/rules.md` (append-only, new `## 15. Starting the Game`), `site/design/rules.html` (regenerated companion), and `test/design-rules-game-start.test.js` (new). `design/playtest-full-game.md` is **not** touched in this diff — cycle 2's out-of-scope edit to that file (which gated the merge as NEEDS_WORK) was reverted in `fc7a9b8`, ahead of this cycle's diff. That prior finding is resolved.

## AC coverage

- **AC1** (new `## 15. Starting the Game` immediately after Section 14; Sections 1-14 byte-identical): MET. The diff hunk is purely additive starting after the prior last line (1299); no line above it is touched. `test/design-rules-game-start.test.js` locks the pre-existing Section 1-14 heading list and the 14→15 adjacency, and asserts strict 1..15 numbering.
- **AC2** (shuffle before game begins, citing Section 3 and Section 11.1; specific numbered first-turn procedure): MET. Section 15.1 cites `(Section 3)` and `(Section 11.1)`, framing the 40-card floor correctly — I read the shipped Section 11.1 text directly (rules.md:940-941: "at least 40 cards at the start of a game, before
