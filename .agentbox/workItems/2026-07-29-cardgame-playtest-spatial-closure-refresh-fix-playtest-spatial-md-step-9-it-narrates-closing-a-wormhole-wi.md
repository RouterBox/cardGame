# cardgame-playtest-spatial-closure-refresh: Fix playtest-spatial.md Step 9 — it narrates closing a Wormhole with no card at all, but Chokepoint Demolition Charge shipped and does exactly that

## Header

- unit: cardgame-playtest-spatial-closure-refresh
- title: Fix playtest-spatial.md Step 9 — it narrates closing a Wormhole with no card at all, but Chokepoint Demolition Charge shipped and does exactly that
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: 9e46a39759a982e14ba2d3cddb49e761c37fdfce
- end_sha: 91ad164df7196b3facd70b50b2fb60162f2fed00

## Intent

design/playtest-spatial.md (shipped) is a step-by-step on-paper procedure that cites exact rules.md sections for every action so playtesters can cross-check physical actions against rule text — but Step 9 ('Close a Wormhole') was written before any card existed that actually grants Closure, so it has playtesters cross out a line and narrate that Closure happened with no card named at all, even though rules.md Section 8.5 itself states Closure 'is a capability granted to card design, not a base action any challenger may always take.' design/cards/wormhole-closure-cards.md has since shipped with Chokepoint Demolition Charge, a real Wrought Assembly card (2 Circuit, Fast) whose Rules text is 'choose a Wormhole with an endpoint at a Planet you control; it undergoes Closure (Section 8.5, which defines Closure) and is removed from the battlefield graph' — exactly the action Step 9 already walks. This unit rewrites Step 9's setup sentence to name Chokepoint Demolition Charge as the concrete card being played instead of narrating an uncarded action, keeping every physical action in the step (crossing out the line, confirming aloud the line may never be redrawn) exactly as written. It adds one new, independent test/design-playtest-spatial-closure-refresh.test.js verifying Step 9 names a real card that exists by exact name and Cost line in design/cards/wormhole-closure-cards.md and no longer narrates Closure without naming one. Only design/playtest-spatial.md and this new test file change — Steps 1-8 and 10-12, the Materials list, and the 'What to watch for' section are untouched, and neither test/design-map-setup-playtest.test.js nor the sibling restriction-refresh proposal's own new test file is touched.

## Acceptance Criteria

- AC1 [paraphrase]: design/playtest-spatial.md Step 9 no longer instructs playtesters to cross out a line and narrate Wormhole Closure without naming any card producing it.
- AC2 [paraphrase]: Step 9 names 'Chokepoint Demolition Charge' and its Cost line (2 Circuit) as the card being played to Close the Wormhole it walks.
- AC3 [paraphrase]: Step 9 still ends with the same physical action (crossing out the line fully) and the same aloud-confirmation that the line may never be redrawn and a new Discovery action would be required to reconnect those Planets, unchanged from before this unit.
- AC4 [inferred] (held_out): Steps 1-8 and 10-12, the Materials list, and the 'What to watch for while playtesting' section of playtest-spatial.md are byte-identical to their content before this unit, and every existing assertion in test/design-map-setup-playtest.test.js still passes.

## Plan

GATE: none

# Plan: cardgame-playtest-spatial-closure-refresh

## Summary

`design/playtest-spatial.md` Step 9 ("Close a Wormhole") currently has
playtesters cross out a line and note that Closure happened without ever
naming a card that grants it — even though `design/rules.md` Section 8.5
says Closure is "a capability granted to card design, not a base action
any challenger may always take." `design/cards/wormhole-closure-cards.md`
now has a real card for this: **Chokepoint Demolition Charge** (Cost
line: 2 Circuit, the Wrought Assembly card). This unit rewrites Step 9's
setup sentence to name that card, leaving every physical action in the
step (cross out the line fully, confirm aloud it may never be redrawn)
byte-for-byte the same as before.

This is a two-file change:
1. Edit `design/playtest-spatial.md` — Step 9 only.
2. Create `test/design-playtest-spatial-closure-refresh.test.js` — new,
   independent test file.

Nothing else changes. Do not touch Steps 1-8 or 10-12, the Materials
list, the "What to watch for" section, `test/design-map-setup-playtest.test.js`,
or `test/design-playtest-spatial-restriction-refresh.test.js`.

This exact pattern (naming a real Closure-adjacent card in a playtest
step's setup sentence, immediately followed by an unchanged aloud
confirmation) was already done for Step 8 in a prior unit — read Step 8
in the current file before editing Step 9, so the new Step 9 prose
matches its style (bold card name, "Cost line: X, the Y card in
*path*" parenthetical, "is the card just played to ... (Section N.N)").

## Step 1 — Edit `design/playtest-spatial.md`

File: `C:\github\.agentbox-worktrees\cardGame\cardgame-playtest-spatial-closure-refresh\design\playtest-spatial.md`
(repo-relative: `design/playtest-spatial.md`)

Find Step 9 exactly as it reads today (lines 104-109):

```
9. **Close a Wormhole.** Pick a different drawn line, cross it out
   fully, and note that the two Planets it connected are no longer
   adjacent unless some other, un-Closed line also connects them
   (Section 8.5). Confirm aloud that this line MAY NOT be redrawn —
   reconnecting those same two Planets later would require paying for a
   brand-new Discovery action from scratch.
```

Replace it with:

```
9. **Close a Wormhole.** Pick a different drawn line, cross it out
   fully, narrating that **Chokepoint Demolition Charge** (Cost line: 2
   Circuit, the Wrought Assembly card in
   *design/cards/wormhole-closure-cards.md*) is the card just played to
   Close it, and note that the two Planets it connected are no longer
   adjacent unless some other, un-Closed line also connects them
   (Section 8.5). Confirm aloud that this line MAY NOT be redrawn —
   reconnecting those same two Planets later would require paying for a
   brand-new Discovery action from scratch.
```

Use the Edit tool with:
- `old_string`: the exact six-line block above (from `9. **Close a
  Wormhole.**` through `brand-new Discovery action from scratch.`)
- `new_string`: the replacement seven-line block above

What changed and what didn't:
- Added: the clause naming **Chokepoint Demolition Charge**, its Cost
  line (2 Circuit), its race (Wrought Assembly), and its source file
  (`design/cards/wormhole-closure-cards.md`) — mirroring exactly how
  Step 8 names Bastion Lockdown Line for Restriction.
- Unchanged, verbatim: "cross it out fully", the "note that the two
  Planets it connected are no longer adjacent unless some other,
  un-Closed line also connects them (Section 8.5)" clause, and the full
  final sentence "Confirm aloud that this line MAY NOT be redrawn —
  reconnecting those same two Planets later would require paying for a
  brand-new Discovery action from scratch."
- Do not touch anything before line 104 or after line 109. Do not
  renumber any step. Do not touch the Materials list (lines 11-30) or
  the "What to watch for while playtesting" section (lines 146-159).

After this edit, re-read the whole file once to confirm nothing else
shifted (the Edit tool only touches the matched block, but double-check
line 110 onward — Step 10 — is untouched).

## Step 2 — Create the new test file

File: `C:\github\.agentbox-worktrees\cardGame\cardgame-playtest-spatial-closure-refresh\test\design-playtest-spatial-closure-refresh.test.js`
(repo-relative: `test/design-playtest-spatial-closure-refresh.test.js`)

This mirrors the structure of the existing sibling test
`test/design-playtest-spatial-restriction-refresh.test.js` (which does
the same job for Step 8 / Restriction), adapted for Step 9 / Closure.
Write this exact content:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const PLAYTEST_PATH = path.join(__dirname, '..', 'design', 'playtest-spatial.md');
const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'wormhole-closure-cards.md');

function readPlaytest() {
  assert.ok(fs.existsSync(PLAYTEST_PATH), `expected ${PLAYTEST_PATH} to exist`);
  return fs.readFileSync(PLAYTEST_PATH, 'utf8');
}

function readCards() {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
  return fs.readFileSync(CARDS_PATH, 'utf8');
}

// Extracts the body text of numbered procedure step `n` from
// playtest-spatial.md: from the "^n. " marker up to (not including) the
// next "^(n+1). " marker. Whitespace is collapsed to single spaces so
// assertions don't care where the source happens to wrap a line.
function stepText(content, n) {
  const startRe = new RegExp(`^${n}\\.\\s+`, 'm');
  const endRe = new RegExp(`^${n + 1}\\.\\s+`, 'm');
  const startMatch = startRe.exec(content);
  assert.ok(startMatch, `expected a "${n}. " numbered step in playtest-spatial.md`);
  const rest = content.slice(startMatch.index);
  const endMatch = endRe.exec(rest);
  const body = endMatch ? rest.slice(0, endMatch.index) : rest;
  return body.replace(/\s+/g, ' ').trim();
}

function step9() {
  return stepText(readPlaytest(), 9);
}

// ---------------------------------------------------------------------------
// AC1: Step 9 no longer crosses out a line and narrates Closure without
// naming any card producing it.
// ---------------------------------------------------------------------------

test('AC1: Step 9 no longer narrates Closure as a bare note with no card named', () => {
  const body = step9();
  assert.ok(
    !/cross it out fully, and note that the two Planets it connected are no longer adjacent/.test(body),
    'expected Step 9 to no longer narrate Closure as a bare note with no card named'
  );
});

// ---------------------------------------------------------------------------
// AC2: Step 9 names Chokepoint Demolition Charge and its Cost line (2
// Circuit), and that card really exists in wormhole-closure-cards.md.
// ---------------------------------------------------------------------------

test('AC2: Step 9 names Chokepoint Demolition Charge and its Cost line (2 Circuit)', () => {
  const body = step9();
  assert.ok(/Chokepoint Demolition Charge/.test(body), 'expected Step 9 to name "Chokepoint Demolition Charge"');
  assert.ok(/2 Circuit/.test(body), 'expected Step 9 to cite the "2 Circuit" Cost line');
});

test('AC2: Chokepoint Demolition Charge exists in wormhole-closure-cards.md with a 2 Circuit Cost line', () => {
  const cards = readCards();
  const idx = cards.indexOf('### Chokepoint Demolition Charge');
  assert.notStrictEqual(
    idx,
    -1,
    'expected an exact "### Chokepoint Demolition Charge" heading in wormhole-closure-cards.md'
  );
  const afterHeading = cards.slice(idx, idx + 400);
  assert.ok(
    /Cost line:\s*2 Circuit/.test(afterHeading),
    "expected Chokepoint Demolition Charge's Cost line to read \"2 Circuit\""
  );
});

// ---------------------------------------------------------------------------
// AC3: Step 9 still ends with the same physical action (crossing out the
// line fully) and the same aloud confirmation, unchanged from before this
// unit.
// ---------------------------------------------------------------------------

test('AC3: Step 9 still instructs crossing out the line fully', () => {
  const body = step9();
  assert.ok(
    /cross it out\s*fully/.test(body),
    'expected Step 9 to still instruct crossing out the line fully'
  );
});

test('AC3: Step 9 still ends with the unchanged aloud never-redraw confirmation', () => {
  const body = step9();
  assert.ok(
    body.includes(
      'Confirm aloud that this line MAY NOT be redrawn — reconnecting those same two Planets later would require paying for a brand-new Discovery action from scratch.'
    ),
    'expected Step 9 to still end with the unchanged aloud never-redraw confirmation sentence'
  );
});
```

Notes on this test file:
- The em dash in "MAY NOT be redrawn —" must be a literal `—` (U+2014)
  character, matching the source file exactly — copy it from the plan
  text above, don't retype it as a hyphen.
- `stepText` collapses all whitespace to single spaces, so exact line
  wrapping in the markdown source doesn't matter for these assertions.

## Step 3 — Verify

Run:

```
node --test
```

Expected output: every test file passes, including the two new/adjacent
ones:
- `test/design-playtest-spatial-closure-refresh.test.js` — 5 tests
  (AC1: 1 test, AC2: 2 tests, AC3: 2 tests), all pass.
- `test/design-map-setup-playtest.test.js` — unchanged, all pre-existing
  assertions still pass (this file doesn't reference "Step 9" or "Close
  a Wormhole" at all, confirmed by grep before writing this plan, so it
  is unaffected by the Step 9 edit).
- `test/design-playtest-spatial-restriction-refresh.test.js` — untouched
  file, still passes (its assertions target Step 8, which this unit does
  not modify).
- `test/design-wormhole-closure-cards.test.js` — untouched, still
  passes (Chokepoint Demolition Charge and its Cost line already exist
  in `design/cards/wormhole-closure-cards.md`; this unit does not modify
  that file).

The overall `node --test` summary line should show `# fail 0`.

## Risk assessment (FIRE)

- **F**easibility: trivial — a single sentence edit in one markdown
  file plus one new, independent test file.
- **I**rreversibility: fully reversible (markdown prose + a new test
  file; no schema, no runtime code, no build output regenerated by
  tests).
- **R**isk to shared/user data: none — no data, no runtime behavior,
  design docs only.
- **E**xposure/security: none.

GATE: none — low-risk, well-scoped, single-file content edit with a
directly analogous precedent (Step 8's prior refactor) to copy the style
from.

## Held-out AC note

AC4 (held out) requires Steps 1-8, 10-12, the Materials list, and "What
to watch for while playtesting" to be byte-identical, and requires
`test/design-map-setup-playtest.test.js`'s existing assertions to still
pass. This is redundant with the visible intent (the unit explicitly
scopes the edit to Step 9's setup sentence only) and is satisfied
automatically by using a precise `Edit` (old_string/new_string) on
exactly the six-line Step 9 block rather than rewriting the file. No
spec bug to flag here — AC4 is a straightforward regression guard, not a
novel requirement.


## Findings

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

### Cycle-1 finding resolved

Cycle 1 flagged that Step 9 named Chokepoint Demolition Charge without
updating "Pick a different drawn line" to reflect that card's own Rules text
restriction ("choose a Wormhole with an endpoint at a Planet you control").
This diff's lead commit, `c4fdf51` ("constrain Step 9 to a controlled-Planet
endpoint"), fixes exactly that: Step 9 now opens "Pick a different drawn
line with an endpoint at a Planet the active player controls", mirroring
Step 8's identical fix (`76bf230`) for Bastion Lockdown Line. Verified
against the card text at `design/cards/wormhole-closure-cards.md:76-78`
("choose a Wormhole with an endpoint at a Planet you control") — the step
and the card it names are now consistent. No remaining contradiction.

### site/design/playtest-spatial.html — PRE-EXISTING pattern, not a new violation

The diff again touches a third file beyond the two the intent names. As
established in cycle 1's review (and confirmed by the sibling
restriction-refresh unit's own commits `46482b8`/`76bf230`, which did the
same), this is a generated mirror of `design/*.md` and regenerating it
alongside a markdown edit is the repo's established convention, not scope
creep introduced by this unit. The new Step 9 HTML content matches the new
Step 9 markdown 1:1 (including the same multi-space line-join artifact
already present in Step 8's HTML block from the prior unit) — not a new
defect.

### No other introduced defects found

- Steps 1-8 and 10-12, Materials list, and "What to watch for" section are
  byte-for-byte untouched (confirmed by reading the full file).
- `test/design-map-setup-playtest.test.js` and
  `test/design-playtest-spatial-restriction-refresh.test.js` are untouched.
- The new test file's step-extraction regex (`^9\.\s+` / `^10\.\s+`) doesn't
  false-match "10." against "1." since `^1\.` requires a literal period as
  the second character, which "10." doesn't have — no off-by-one risk.
- Manually traced every assertion in the new test file against the current
  file content; all pass (whitespace-collapsed body no longer contains the
  old bare-note substring; both "Chokepoint Demolition Charge" and "2
  Circuit" are present in Step 9 and in the card entry; the closing
  cross-out instruction and full confirmation sentence are unchanged).

## Verdict rationale

The single blocking issue from cycle 1 is fixed, matches the established
fix pattern already used for the sibling step, and is verified consistent
with the named card's actual Rules text. All three visible ACs are met, no
new introduced defects were found, and the html mirror change is
established convention rather than an unrequested scope expansion.


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T12:12:41.130Z] **bolt:start** — unit=cardgame-playtest-spatial-closure-refresh start_sha=9e46a39759a982e14ba2d3cddb49e761c37fdfce branch=bolt/cardgame-playtest-spatial-closure-refresh worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-playtest-spatial-closure-refresh
- [2026-07-29T12:12:51.134Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T12:15:01.683Z] **plan:done** — plan.md written
- [2026-07-29T12:16:12.983Z] **tests:done** — RED verified on test/design-playtest-spatial-closure-refresh.test.js (exit=1)
- [2026-07-29T12:18:49.257Z] **build:c1** — tests green, committed
- [2026-07-29T12:21:21.939Z] **review:c1** — NEEDS_WORK
- [2026-07-29T12:24:37.740Z] **build:c2** — tests green, committed
- [2026-07-29T12:27:11.304Z] **review:c2** — APPROVE
- [2026-07-29T12:27:19.650Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T12:27:20.010Z] **merge:done** — auto-merged bolt/cardgame-playtest-spatial-closure-refresh into master (worktree)


## Receipt

```json
{
  "start_sha": "9e46a39759a982e14ba2d3cddb49e761c37fdfce",
  "end_sha": "c4fdf512c12b12e79213b9c2e668c3b9bd903dfa",
  "diff_nonempty": true,
  "test_cmd": "node --test",
  "exit_code": 0,
  "criteria_covered": [
    {
      "id": "AC1",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC2",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC3",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": true,
      "passed": true
    }
  ],
  "cycles": 2,
  "timestamp": "2026-07-29T12:27:19.648Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-playtest-spatial-closure-refresh\\plan.md`, GATE: none.\n\nSummary: Step 9 of `design/playtest-spatial.md` gets its setup sentence rewritten to name **Chokepoint Demolition Charge** (2 Circuit, Wrought Assembly card from `design/cards/wormhole-closure-cards.md`) as the card that Closes the Wormhole — mirroring the exact style Step 8 already uses for Bastion Lockdown Line — while leaving \"cross it out fully\" and the final aloud never-redraw confirmation byte-identical. A new independent test file, modeled directly on the sibling `design-playtest-spatial-restriction-refresh.test.js`, verifies AC1-AC3. I confirmed via grep that `test/design-map-setup-playtest.test.js` never references Step 9, so AC4's regression requirement is satisfied by construction as long as the Edit is scoped to exactly the six-line Step 9 block.",
    "test_writer": "I need your approval to run `node --test test/` so I can confirm the new tests fail right now (RED) before handing off. Please approve the pending command.",
    "builder_c1": "All 831 tests pass, 0 failures. The suite is green.\n\nSummary: Edited Step 9 in `design/playtest-spatial.md` to name **Chokepoint Demolition Charge** (2 Circuit, Wrought Assembly) as the card producing Wormhole Closure, matching Step 8's established style, while leaving the physical actions (cross out fully, aloud confirmation) byte-identical. Committed alongside the auto-regenerated `site/design/playtest-spatial.html` (following the sibling restriction-refresh unit's precedent) so the pre-existing `card-template-helper.test.js` AC4 git-status check stays green. `node --test` is fully green (831/831).",
    "reviewer_c1": "Findings written to `findings.md`. Summary: AC1–AC3 are all met, but the diff introduces a real contradiction — Step 9 still says \"pick a different drawn line\" with no ownership qualifier, while the card it now names (Chokepoint Demolition Charge) can only target \"a Wormhole with an endpoint at a Planet you control.\" That's the exact bug class this same file already had fixed once for Step 8/Bastion Lockdown Line (commit `76bf230`). The extra `site/design/playtest-spatial.html` diff is a pre-existing build-artifact convention, not a scope violation.\n\nNEEDS_WORK",
    "builder_c2": "All 831 tests pass. Fixed the reviewer's finding: Step 9 now reads \"Pick a different drawn line with an endpoint at a Planet the active player controls,\" mirroring Step 8's phrasing, so it no longer contradicts Chokepoint Demolition Charge's own controlled-endpoint targeting restriction. Regenerated `site/design/playtest-spatial.html` and committed both files (no `test/` changes made).",
    "reviewer_c2": "Findings written to `findings.md`. Cycle 1's blocking issue (Step 9 naming a card whose Rules text requires a controlled-Planet endpoint, without updating the \"pick a line\" instruction to match) is fixed in this cycle, mirroring the identical fix already applied to Step 8. All three visible ACs are met and no new introduced defects were found.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
