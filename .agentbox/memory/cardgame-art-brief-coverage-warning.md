# cardgame-art-brief-coverage-warning

- merged: 2026-07-29T12:25:24.102Z
- intent: tools/composite-card-art.js (shipped) reads design/cards/art-briefs.md and, for each brief section, writes one composited SVG — it never looks at the full card catalog, so a card with no matching brief is not an error, not a warning, just invisible. That silence is exactly what let frontier-set.md and character-signatures.md ship with zero briefs for a while (T1: finish the full decided scope, don't declare victory early) before a Producer proposal caught it by hand, and it's about to repeat: fount-economy-set.md and character-signatures-wave-2.md carry the same gap right now, and wormhole-restriction-cards, wormhole-closure-cards, and spatial-race-identity-cards are bolting or queued behind them. This unit changes composite-card-art.js to also load the full card catalog (via the same lib/parse-card-markdown.js loadAllCards() the rest of the toolchain already uses) and, after writing composited output for every matched brief, print one warning line per card that has no matching brief, naming the card so the gap is actionable without re-deriving the diff by hand. The warning is informational only — exit code stays 0, no card, brief, or renders/ file is modified — keeping this a T16 authoring/presentation tool, not a gate on card content.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Review: cardgame-art-brief-coverage-warning (cycle 1)

## AC coverage

- **AC1** — `node tools/composite-card-art.js` prints a warning line naming any
  card with no matching brief, and still exits 0.
  Implementation: `tools/composite-card-art.js:251-255` iterates `allCards`
  (from `loadAllCards()`) after the existing success `console.log`, and
  `console.warn`s for any card whose name isn't in `baseBriefNames`.
  `console.warn` never touches `process.exitCode`, so the existing
  `runCli()` catch (`tools/composite-card-art.js:272-277`) is the only path
  that would set a non-zero exit, and nothing in the new loop can throw
  (plain Set lookup + string interp). The pre-existing `test.before()`
  harness in `test/composite-card-art.test.js` already runs the real CLI
  via `execFileSync` against the current repo state — which per plan.md has
  8 uncovered cards right now — and asserts `runError` is null, so the
  "still exits 0 while warnings fire" path is exercised end-to-end, not
  just through `main()`. Covered.
- **AC2** — a card with a matching brief still produces its composited SVG
  exactly as before. The diff does not touch the `for (const brief of
  briefs)` loop, `compo
