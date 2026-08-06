# Blind Review — cardgame-frontier-set-spatial-cards (cycle 3)

## AC coverage

**AC1** — `design/cards/frontier-set.md` exists and contains exactly 5 distinct
named cards, one per race under `design/races/`.
- The file exists with exactly 5 `###` (level-3) card headings, distinct
  titles: Bastion Reclamation Crew, Frontier Spore Cluster, Wormhole Ledger,
  Rite of Unmaking, Replication Beachhead.
- Each card's body (flavor-text line included) names exactly one race by its
  exact `# The <Name>` title string, one card per race, no orphans or
  duplicates: Cindral Reach, Mireth Bloom, Panoptic Concord, Starweave
  Communion, Wrought Assembly.
- `test/design-frontier-cards.test.js` encodes this exact check (count,
  distinctness, one-card-per-race-file loop against `design/races/*.md`).
- **Status: satisfied.**

**AC2** — every card uses the canonical Section 9.1 template in order (Cost
line, Type line, Rules text, and only for Permanents an optional
Stats/counters line after Rules text).
- All 5 cards have `Cost line:` → `Type line:` → `Rules text:` in that order.
- Frontier Spore Cluster (Type line: "Biology — Permanent") carries a
  `Stats/counters line:` after `Rules text:` — correctly placed and
  correctly gated on the Type line containing "Permanent". No other card
  carries a Stats/counters line, and none of the non-Permanent cards
  (Wormhole Ledger, Rite of Unmaking) would be allowed one.
- Bastion Reclamation Crew and Replication Beachhead are Permanents that
  simply omit the optional line, which is allowed.
- `test/design-frontier-cards.test.js` enforces both the field-order and the
  Permanent-only-gating for Stats/counters lines via `indexOf`-based checks.
- **Status: satisfied.**

**AC3** — each card's rules text names a Section 8 spatial term and cites the
subsection number that defines it.
- Each card names one of Discovery/Restriction/Closure/Assault/Blockade/
  Capture and inline-cites the matching subsection (Discovery→8.3,
  Restriction→8.4, Closure→8.5, Assault/Blockade/Capture→8.6), per the
  mapping plan.md documents from `design/rules.md` §8.
- `test/design-frontier-cards.test.js` checks both term-presence and
  section-citation via the same `SPATIAL_TERM_SECTIONS` map, so the test and
  the card content can't silently drift apart.
- Blind-review caveat: `design/rules.md` itself is not part of what this
  review is scoped to see, so the correctness of "Discovery is defined in
  8.3" etc. is taken from plan.md's own stated research, not independently
  re-verified here.
- **Status: satisfied.**

## Findings

### INTRODUCED — `tools/render-card.js` / `tools/sync-cards-to-jaina.js` still permanently exclude the 5 new cards from render and sync; this cycle only silenced the exclusion, it did not remove it

Both tools still glob the whole `design/cards/` directory (good — a prior
cycle's regression where the glob was replaced by a hardcoded path to
`alpha-set.md` only, breaking discovery of *any* future card file, is gone).
But each tool's `loadAllCards()` now filters that glob through a new
hardcoded exclusion set — `CARDS_NOT_YET_WIRED_FOR_RENDER` /
`CARDS_NOT_YET_WIRED_FOR_SYNC`, each `new Set(['frontier-set.md'])` — and
skips the file entirely, emitting only a `console.warn`.

plan.md states the unit's scope as *"Add exactly two new files. No existing
file is modified,"* and its `GATE: none` reasoning rests on having grepped
that `test/render-card.test.js` and `test/sync-cards-to-jaina.test.js`
hardcode their expected count/path to `alpha-set.md` and therefore "cannot
break" from adding `frontier-set.md` "in isolation." That grep only checked
the *tests'* hardcoded paths — it never checked that the *tools* those tests
exercise (`tools/render-card.js`, `tools/sync-cards-to-jaina.js`) glob the
entire `design/cards/` directory and would have picked up the new file (and
correctly failed the stale hardcoded-count tests) had it not been carved
out. Because that gap wasn't caught during planning, this diff still makes
undisclosed, unplanned edits to two shared production tool files — outside
plan.md's declared "two new files" scope — to dodge the conflict, rather
than updating the two pre-existing tests to tolerate additional card files.

**Failure scenario:** After this merges, `node tools/render-card.js` will
never render SVGs for the 5 new Frontier Set cards, and
`node tools/sync-cards-to-jaina.js` will never emit records for them — this
is now clearly logged via `console.warn` rather than silent, but it is still
permanent: nothing tracks it as temporary beyond a code comment asking "a
future unit" to fix it, and no test anywhere asserts the exclusion is
intentional or time-bound. Anyone using either tool to produce the actual
rendered card set or the live Jaina sync feed gets an incomplete result.
This is exactly the kind of unrelated-code edit `CLAUDE.md` asks not to make
("If a file or function is not directly part of the current task, do not
modify it"), and it is a real, checkable behavior regression in shared
tooling that no visible AC requires and no test guards against ever being
lifted.

The five cards' own content is correct (see AC1–AC3 above), the new test
file `test/design-frontier-cards.test.js` is in-scope and well-built, and
the regenerated `site/design/cards/*.html` / `site/index.html` changes look
like deterministic output of the existing site-generation/nav-sync pattern
(same boilerplate and sibling-nav convention as the other card pages) — not
a concern on their own.

## Verdict rationale

All three visible ACs pass. But the diff still modifies two pieces of
shared, unrelated production tooling — outside plan.md's declared scope and
contrary to its own "safe to add in isolation" analysis — to route around a
pre-existing test conflict, and it still permanently drops the render/sync
pipeline's coverage of every card in this new file; this cycle only added a
warning log, it did not remove the exclusion or make it provisional/tested.
That is a concrete, checkable, INTRODUCED failure mode with no test coverage
of its own, so it gates the merge.

NEEDS_WORK
