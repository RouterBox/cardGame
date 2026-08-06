# cardgame-playtest-spatial-restriction-refresh

- merged: 2026-07-29T12:07:19.560Z
- intent: design/playtest-spatial.md (shipped) is a step-by-step on-paper procedure that cites exact rules.md sections for every action so playtesters can cross-check physical actions against rule text — but Step 8 ('Add a Restriction to a Wormhole') was written before any card existed that actually grants a Restriction, so it asks playtesters to narrate a hypothetical: 'this rulebook has no default action that grants one, so for this playtest simply declare which card would.' design/cards/wormhole-restrictions-set.md has since shipped with Bastion Lockdown Line, a real Cindral Reach card whose Rules text places exactly the Directional Restriction Step 8 already walks (one-way, permitting travel only from the controlled Planet toward the other endpoint) — the same 'one-way: [origin]→[destination]' notation the step already tells playtesters to write. This unit rewrites Step 8's setup sentence to name Bastion Lockdown Line as the concrete card being played (2 Mass, Cindral Reach) instead of asserting no such card exists, keeping every physical action in the step (writing the note, confirming aloud that a no-Restriction Wormhole defaults to two-way) exactly as written. It adds one new, independent test/design-playtest-spatial-restriction-refresh.test.js verifying Step 8 names a real card that exists by exact name and Cost line in design/cards/wormhole-restrictions-set.md and no longer contains the 'no default action' disclaimer. Only design/playtest-spatial.md and this new test file change — Steps 1-7 and 9-12, the Materials list, and the 'What to watch for' section are untouched, and test/design-map-setup-playtest.test.js (which exercises Step 2 and Section 8.8, not Step 8) is not touched either.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-playtest-spatial-restriction-refresh, cycle 2

## Scope verified

Cumulative diff from unit base (6869443) to HEAD (76bf230) touches exactly
three files: `design/playtest-spatial.md`, `site/design/playtest-spatial.html`,
and the new `test/design-playtest-spatial-restriction-refresh.test.js`. This
matches the diff presented for review. Steps 1-7 and 9-12, the Materials
list, and "What to watch for" are untouched (single hunk, Step 8 only, in
both the markdown and its HTML companion). `test/design-map-setup-playtest.test.js`
is not touched.

## AC accounting

- **AC1** (Step 8 no longer claims no card grants a Restriction): SATISFIED.
  The "— this rulebook has no default action that grants one, so for this
  playtest simply declare which card would" clause is fully removed. New
  test's AC1 cases assert both that phrase and "simply declare which card
  would" are absent — verified true against the current file.

- **AC2** (Step 8 names Bastion Lockdown Line and its Cost line, 2 Mass):
  SATISFIED. Step 8 reads "**Bastion Lockdown Line** (Cost line: 2 Mass, the
  Cindral Reach card in *design/cards/wormhole-restrictions-set.md*) is the
  card just played to 
