# cardgame-playtest-spatial-closure-refresh

- merged: 2026-07-29T12:27:20.191Z
- intent: design/playtest-spatial.md (shipped) is a step-by-step on-paper procedure that cites exact rules.md sections for every action so playtesters can cross-check physical actions against rule text — but Step 9 ('Close a Wormhole') was written before any card existed that actually grants Closure, so it has playtesters cross out a line and narrate that Closure happened with no card named at all, even though rules.md Section 8.5 itself states Closure 'is a capability granted to card design, not a base action any challenger may always take.' design/cards/wormhole-closure-cards.md has since shipped with Chokepoint Demolition Charge, a real Wrought Assembly card (2 Circuit, Fast) whose Rules text is 'choose a Wormhole with an endpoint at a Planet you control; it undergoes Closure (Section 8.5, which defines Closure) and is removed from the battlefield graph' — exactly the action Step 9 already walks. This unit rewrites Step 9's setup sentence to name Chokepoint Demolition Charge as the concrete card being played instead of narrating an uncarded action, keeping every physical action in the step (crossing out the line, confirming aloud the line may never be redrawn) exactly as written. It adds one new, independent test/design-playtest-spatial-closure-refresh.test.js verifying Step 9 names a real card that exists by exact name and Cost line in design/cards/wormhole-closure-cards.md and no longer narrates Closure without naming one. Only design/playtest-spatial.md and this new test file change — Steps 1-8 and 10-12, the Materials list, and the 'What to watch for' section are untouched, and neither test/design-map-setup-playtest.test.js nor the sibling restriction-refresh proposal's own new test file is touched.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind review — cardgame-playtest-spatial-closure-refresh, cycle 2

## AC coverage

- **AC1** (Step 9 no longer narrates Closure as a bare, uncarded note) — MET.
  Step 9 reads "...cross it out fully, narrating that **Chokepoint Demolition
  Charge**... is the card just played to Close it, and note that..." — the
  old bare-note phrasing ("cross it out fully, and note that...") is gone.
- **AC2** (Step 9 names Chokepoint Demolition Charge and its 2 Circuit Cost
  line) — MET. Step 9 cites `**Chokepoint Demolition Charge** (Cost line: 2
  Circuit, the Wrought Assembly card in
  *design/cards/wormhole-closure-cards.md*)`. Verified the card exists at
  `design/cards/wormhole-closure-cards.md:72` with heading
  `### Chokepoint Demolition Charge` and `Cost line: 2 Circuit` immediately
  after — matches by exact name and Cost line.
- **AC3** (same physical action + same aloud confirmation, unchanged) — MET.
  "cross it out fully" and the full sentence "Confirm aloud that this line
  MAY NOT be redrawn — reconnecting those same two Planets later would
  require paying for a brand-new Discovery action from scratch." are
  byte-for-byte unchanged from the pre-diff text.

## Findings

### C
