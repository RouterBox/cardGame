# cardgame-playtest-spatial-restriction-refresh: Fix playtest-spatial.md Step 8 — it says no card grants a Directional Restriction, but Bastion Lockdown Line shipped and does exactly that

## Header

- unit: cardgame-playtest-spatial-restriction-refresh
- title: Fix playtest-spatial.md Step 8 — it says no card grants a Directional Restriction, but Bastion Lockdown Line shipped and does exactly that
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: 68694431e0ea69da2b56b7858ec990062922a80a
- end_sha: cac06be0bd498914c9dba7bfb52e2363427f6a69

## Intent

design/playtest-spatial.md (shipped) is a step-by-step on-paper procedure that cites exact rules.md sections for every action so playtesters can cross-check physical actions against rule text — but Step 8 ('Add a Restriction to a Wormhole') was written before any card existed that actually grants a Restriction, so it asks playtesters to narrate a hypothetical: 'this rulebook has no default action that grants one, so for this playtest simply declare which card would.' design/cards/wormhole-restrictions-set.md has since shipped with Bastion Lockdown Line, a real Cindral Reach card whose Rules text places exactly the Directional Restriction Step 8 already walks (one-way, permitting travel only from the controlled Planet toward the other endpoint) — the same 'one-way: [origin]→[destination]' notation the step already tells playtesters to write. This unit rewrites Step 8's setup sentence to name Bastion Lockdown Line as the concrete card being played (2 Mass, Cindral Reach) instead of asserting no such card exists, keeping every physical action in the step (writing the note, confirming aloud that a no-Restriction Wormhole defaults to two-way) exactly as written. It adds one new, independent test/design-playtest-spatial-restriction-refresh.test.js verifying Step 8 names a real card that exists by exact name and Cost line in design/cards/wormhole-restrictions-set.md and no longer contains the 'no default action' disclaimer. Only design/playtest-spatial.md and this new test file change — Steps 1-7 and 9-12, the Materials list, and the 'What to watch for' section are untouched, and test/design-map-setup-playtest.test.js (which exercises Step 2 and Section 8.8, not Step 8) is not touched either.

## Acceptance Criteria

- AC1 [paraphrase]: design/playtest-spatial.md Step 8 no longer contains the sentence 'this rulebook has no default action that grants one, so for this playtest simply declare which card would' or any equivalent claim that no card grants a Restriction.
- AC2 [paraphrase]: Step 8 names 'Bastion Lockdown Line' and its Cost line (2 Mass) as the card being played to place the Directional Restriction it walks.
- AC3 [paraphrase]: Step 8 still ends with the same physical action (writing 'one-way: [origin]→[destination]' on the line) and the same aloud-confirmation that a Wormhole with no such note defaults to two-way travel, unchanged from before this unit.
- AC4 [inferred] (held_out): Steps 1-7 and 9-12, the Materials list, and the 'What to watch for while playtesting' section of playtest-spatial.md are byte-identical to their content before this unit, and every existing assertion in test/design-map-setup-playtest.test.js still passes.

## Plan

GATE: none

# Unit: cardgame-playtest-spatial-restriction-refresh

## Summary

`design/playtest-spatial.md` Step 8 currently tells playtesters that "this
rulebook has no default action that grants" a Directional Restriction, and
asks them to narrate a hypothetical card. That's now false:
`design/cards/wormhole-restrictions-set.md` ships **Bastion Lockdown Line**
(Cindral Reach, Cost line: 2 Mass), whose Rules text places exactly the
one-way Directional Restriction Step 8 already walks through. This unit
rewrites Step 8's narration sentence to name that real card instead of the
"no such card exists" disclaimer, and adds one new, independent test file
asserting the fix. Nothing else in the file changes.

Only two files are touched:
1. `design/playtest-spatial.md` — edit Step 8's narration sentence only.
2. `test/design-playtest-spatial-restriction-refresh.test.js` — new file.

`test/design-map-setup-playtest.test.js` is NOT touched and must continue
to pass unmodified (AC4). Steps 1-7, 9-12, the Materials list, and the
"What to watch for while playtesting" section of `playtest-spatial.md` must
remain byte-identical (AC4) — this is achieved simply by editing only the
Step 8 paragraph and nothing else in the file.

## Risk self-assessment (FIRE)

- **Reversibility**: trivial — a single markdown paragraph edit plus one
  new, additive test file. Fully reversible via git revert.
- **Security impact**: none — no code paths, no user input, no auth.
- **User data**: none — this is a design/rules document, not runtime data.
- **Schema changes**: none.

This is a low-risk, well-scoped documentation + test change. `GATE: none`.

## Step-by-step implementation

### Step 1 — Edit `design/playtest-spatial.md`, Step 8 only

Current file content at lines 94-100 (verify line numbers match before
editing — if the file has drifted, locate this text by content instead of
line number):

```
8. **Add a Restriction to a Wormhole.** Pick any drawn line on the table
   and write "one-way: [origin]→[destination]" on it, narrating that
   some card or effect just granted it a Directional Restriction
   (Section 8.4) — this rulebook has no default action that grants one,
   so for this playtest simply declare which card would. Confirm aloud
   that a Wormhole with no such note may still be traversed either way,
   since no-Restriction is the default.
```

Replace it with (use this exact text as the tool's `old_string` — it is
unique in the file — and this exact text as `new_string`):

**old_string:**
```
8. **Add a Restriction to a Wormhole.** Pick any drawn line on the table
   and write "one-way: [origin]→[destination]" on it, narrating that
   some card or effect just granted it a Directional Restriction
   (Section 8.4) — this rulebook has no default action that grants one,
   so for this playtest simply declare which card would. Confirm aloud
   that a Wormhole with no such note may still be traversed either way,
   since no-Restriction is the default.
```

**new_string:**
```
8. **Add a Restriction to a Wormhole.** Pick any drawn line on the table
   and write "one-way: [origin]→[destination]" on it, narrating that
   **Bastion Lockdown Line** (Cost line: 2 Mass, the Cindral Reach card
   in *design/cards/wormhole-restrictions-set.md*) is the card just
   played to grant it a Directional Restriction (Section 8.4). Confirm
   aloud that a Wormhole with no such note may still be traversed either
   way, since no-Restriction is the default.
```

Notes for the implementer:
- Do NOT touch any other line in the file — no reflow of Steps 1-7, 9-12,
  the Materials list, or "What to watch for while playtesting". Use a
  scoped find/replace (e.g. the `Edit` tool with the exact `old_string`
  above) rather than rewriting the whole file, so the rest is guaranteed
  byte-identical.
- The em dash (`—`) and the disclaimer clause ("this rulebook has no
  default action that grants one, so for this playtest simply declare
  which card would") must be fully removed — do not leave a fragment of
  it behind.
- Keep the arrow character in `[origin]→[destination]` exactly as-is (it's
  a Unicode `→`, not `->`).
- The first two lines of the paragraph ("8. **Add a Restriction..." and
  "and write \"one-way:...") and the closing "Confirm aloud that a
  Wormhole with no such note may still be traversed either way, since
  no-Restriction is the default." sentence are unchanged in wording —
  only the middle narration clause changes. This satisfies AC3 (same
  physical write-the-note action, same aloud confirmation).

### Step 2 — Create `test/design-playtest-spatial-restriction-refresh.test.js`

Create this new file with exactly this content:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const PLAYTEST_PATH = path.join(__dirname, '..', 'design', 'playtest-spatial.md');
const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'wormhole-restrictions-set.md');

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

function step8() {
  return stepText(readPlaytest(), 8);
}

// ---------------------------------------------------------------------------
// AC1: Step 8 no longer claims no card grants a Restriction.
// ---------------------------------------------------------------------------

test('AC1: Step 8 no longer contains the "no default action" disclaimer', () => {
  const body = step8();
  assert.ok(
    !/no default action that grants one/i.test(body),
    'expected Step 8 to no longer contain the "no default action that grants one" disclaimer'
  );
  assert.ok(
    !/simply declare which card would/i.test(body),
    'expected Step 8 to no longer ask playtesters to declare a hypothetical card'
  );
});

// ---------------------------------------------------------------------------
// AC2: Step 8 names Bastion Lockdown Line and its Cost line (2 Mass), and
// that card really exists in wormhole-restrictions-set.md.
// ---------------------------------------------------------------------------

test('AC2: Step 8 names Bastion Lockdown Line and its Cost line (2 Mass)', () => {
  const body = step8();
  assert.ok(/Bastion Lockdown Line/.test(body), 'expected Step 8 to name "Bastion Lockdown Line"');
  assert.ok(/2 Mass/.test(body), 'expected Step 8 to cite the "2 Mass" Cost line');
});

test('AC2: Bastion Lockdown Line exists in wormhole-restrictions-set.md with a 2 Mass Cost line', () => {
  const cards = readCards();
  const idx = cards.indexOf('### Bastion Lockdown Line');
  assert.notStrictEqual(
    idx,
    -1,
    'expected an exact "### Bastion Lockdown Line" heading in wormhole-restrictions-set.md'
  );
  const afterHeading = cards.slice(idx, idx + 400);
  assert.ok(
    /Cost line:\s*2 Mass/.test(afterHeading),
    "expected Bastion Lockdown Line's Cost line to read \"2 Mass\""
  );
});

// ---------------------------------------------------------------------------
// AC3: Step 8 still ends with the same write-the-note action and the same
// aloud two-way-default confirmation, unchanged from before this unit.
// ---------------------------------------------------------------------------

test('AC3: Step 8 still instructs writing "one-way: [origin]->[destination]" on the line', () => {
  const body = step8();
  assert.ok(
    body.includes('write "one-way: [origin]→[destination]" on it'),
    'expected Step 8 to still instruct writing "one-way: [origin]→[destination]" on the line'
  );
});

test('AC3: Step 8 still ends with the unchanged aloud two-way-default confirmation', () => {
  const body = step8();
  assert.ok(
    body.includes(
      'Confirm aloud that a Wormhole with no such note may still be traversed either way, since no-Restriction is the default.'
    ),
    'expected Step 8 to still end with the unchanged aloud two-way-default confirmation sentence'
  );
});
```

Notes on this test file:
- It uses `→` for the `→` arrow character in the source string so the
  file has no encoding ambiguity; this matches the literal Unicode arrow
  used in `playtest-spatial.md`.
- It is fully independent of `test/helpers/markdown.js` and of
  `test/design-map-setup-playtest.test.js` (does not import or modify
  either) — per the unit's "one new, independent test file" requirement.
- Run this test **before** editing `playtest-spatial.md` to confirm it
  fails against the current (unfixed) file (AC1/AC2 assertions should
  fail), then again after the edit to confirm it passes. This is the
  cheapest way to be sure the test is actually exercising the fix and not
  vacuously passing.

## Verifying AC4 (held-out) before finishing

AC4 requires Steps 1-7, 9-12, the Materials list, and "What to watch for
while playtesting" to be byte-identical to before this unit, and every
existing assertion in `test/design-map-setup-playtest.test.js` to still
pass. Since only the Step 8 paragraph is edited (Step 1 above), this is
satisfied automatically — but confirm it explicitly before finishing:

```
git diff design/playtest-spatial.md
```

Expected output: a diff touching only the Step 8 paragraph (roughly lines
94-100), with no other hunks. If any other line shows up in the diff,
revert and redo the edit more narrowly.

## Test command and expected output

Run:

```
node --test
```

Expected: all test files pass, including the two directly relevant ones:

```
# test/design-playtest-spatial-restriction-refresh.test.js
ok 1 - AC1: Step 8 no longer contains the "no default action" disclaimer
ok 2 - AC2: Step 8 names Bastion Lockdown Line and its Cost line (2 Mass)
ok 3 - AC2: Bastion Lockdown Line exists in wormhole-restrictions-set.md with a 2 Mass Cost line
ok 4 - AC3: Step 8 still instructs writing "one-way: [origin]->[destination]" on the line
ok 5 - AC3: Step 8 still ends with the unchanged aloud two-way-default confirmation

# test/design-map-setup-playtest.test.js
ok ... (all pre-existing assertions continue to pass, unmodified)
```

Overall summary line should read `# pass <N>` with `# fail 0` (no
regressions in any other test file in `test/`).

## Explicitly out of scope

- Do not touch `test/design-map-setup-playtest.test.js`.
- Do not touch `test/helpers/markdown.js`.
- Do not touch `design/cards/wormhole-restrictions-set.md` — it already
  ships Bastion Lockdown Line as needed; this unit only cites it.
- Do not reflow, renumber, or otherwise edit Steps 1-7 or 9-12, the
  Materials list, or the "What to watch for while playtesting" section of
  `design/playtest-spatial.md`.


## Findings

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
  card just played to grant it a Directional Restriction." Confirmed the
  card is real and pre-existing (not part of this diff):
  `design/cards/wormhole-restrictions-set.md` has an exact
  `### Bastion Lockdown Line` heading, `Cost line: 2 Mass`, and Rules text
  "Slow. Spent: choose a Wormhole with an endpoint at a Planet you control;
  place a Directional Restriction ... permitting travel only from that
  Planet toward its other endpoint, never the reverse."

- **AC3** (Step 8 still ends with the same write-the-note action and the
  same aloud two-way-default confirmation, unchanged): SATISFIED. The
  instruction `write "one-way: [origin]→[destination]" on it` remains
  intact as a contiguous clause (an appositive is inserted immediately
  after it, not inside it), and the closing sentence — "Confirm aloud that
  a Wormhole with no such note may still be traversed either way, since
  no-Restriction is the default." — is byte-identical to the pre-unit text.

## Cycle-2 change beyond the reviewed plan.md (not gating)

This cycle's commit (76bf230, "constrain Step 8 to a controlled-Planet
endpoint") changes "Pick any drawn line on the table" to "Pick a drawn line
on the table with an endpoint at a Planet the active player controls," and
pins that Planet as the notation's origin ("with that controlled Planet as
the origin"). The plan.md shown for this review only specifies the cycle-1
old_string/new_string (narration clause only, no line-selection qualifier),
so this text is not literally covered by that plan excerpt.

This is a correctness fix, not a defect: Bastion Lockdown Line's real Rules
text (verified above) only lets it target a Wormhole with an endpoint at a
Planet the caster controls, one-way away from that Planet. Without this
qualifier, Step 8 would let a playtester pick an arbitrary line — including
one touching no Planet either player controls — and narrate Bastion
Lockdown Line being played there, a scenario the actual card cannot
produce. "Active player" is also the term already used elsewhere in this
same document (Steps 6 and "Take an Assault action"), so it's consistent
usage, not a new vocabulary term. It doesn't touch AC3's specific
"same physical action" clause (the write-the-note instruction and the aloud
confirmation, both intact), so it doesn't violate any visible AC. Flagging
for visibility, not gating the merge.

## HTML companion file

`site/design/playtest-spatial.html` is generated output (see
`tools/build-site.js` / `test/build-site.test.js`, which regenerates and
byte-diffs `site/` on every run). The hand-edited hunk mirrors the markdown
change using the same conversion conventions visible in the surrounding
untouched HTML (raw em dash, `&quot;`/`&#39;` entities, `<strong>`/`<em>` for
`**`/`*` spans). Cycle 1 already established the convention of updating
this file alongside the markdown source (see prior commit history), so this
is not a new pattern. `build-site.test.js` regenerates `site/` before
asserting on it, so any latent formatting drift here is not a merge risk.

## New test file

`test/design-playtest-spatial-restriction-refresh.test.js` is new,
independent, and correctly scoped to Step 8 and the cards file only. All
assertions were checked against the current working-tree file contents and
hold: AC1 (disclaimer/"simply declare" absent), AC2 (card name + "2 Mass"
present in Step 8; card exists with matching heading/Cost line), AC3
(write-the-note and aloud-confirmation sentences unchanged).

## Findings

None. No INTRODUCED defects found.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T11:46:06.995Z] **bolt:start** — unit=cardgame-playtest-spatial-restriction-refresh start_sha=68694431e0ea69da2b56b7858ec990062922a80a branch=bolt/cardgame-playtest-spatial-restriction-refresh worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-playtest-spatial-restriction-refresh
- [2026-07-29T11:46:16.883Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T11:48:51.631Z] **plan:done** — plan.md written
- [2026-07-29T11:50:06.322Z] **tests:done** — RED verified on test/design-playtest-spatial-restriction-refresh.test.js (exit=1)
- [2026-07-29T11:56:05.611Z] **build:c1** — tests green, committed
- [2026-07-29T11:57:20.021Z] **review:c1** — APPROVE
- [2026-07-29T12:00:31.861Z] **review:devils-advocate** — NEEDS_WORK
- [2026-07-29T12:03:12.704Z] **build:c2** — tests green, committed
- [2026-07-29T12:07:10.964Z] **review:c2** — APPROVE
- [2026-07-29T12:07:19.021Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T12:07:19.371Z] **merge:done** — auto-merged bolt/cardgame-playtest-spatial-restriction-refresh into master (worktree)


## Receipt

```json
{
  "start_sha": "68694431e0ea69da2b56b7858ec990062922a80a",
  "end_sha": "76bf23053ffe43c36064cab3d5a77110f42bf221",
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
  "timestamp": "2026-07-29T12:07:19.019Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-playtest-spatial-restriction-refresh\\plan.md` (GATE: none — low-risk doc + additive test change).\n\nSummary: it specifies an exact old_string/new_string edit to Step 8 of `design/playtest-spatial.md` (naming Bastion Lockdown Line, 2 Mass, from the Cindral Reach card, while keeping the write-the-note action and aloud two-way confirmation sentence verbatim), plus the complete content for a new independent test file `test/design-playtest-spatial-restriction-refresh.test.js` covering AC1-AC3, and a verification step (`git diff` scoped check) to guard the held-out AC4 byte-identity requirement.",
    "test_writer": "Done. Only `test/design-playtest-spatial-restriction-refresh.test.js` was added — no files under `src/` or `design/` were touched, and the pre-existing `test/design-map-setup-playtest.test.js` is untouched.\n\nThe test covers all 3 visible ACs against the current `design/playtest-spatial.md` Step 8, which still contains the \"no default action that grants one, so for this playtest simply declare which card would\" disclaimer:\n- **AC1** will fail now (disclaimer is still present).\n- **AC2** will fail now (Step 8 doesn't yet name \"Bastion Lockdown Line\" or \"2 Mass\" — the card-file assertion alone would pass since `wormhole-restrictions-set.md` already ships the card, but the Step-8-naming assertion fails).\n- **AC3** should already pass (write-the-note action and aloud confirmation sentence are unchanged) — this is intentional per the plan, since AC3 only needs to keep passing once Step 8 is edited, not fail now.\n\nI wasn't able to actually execute `node --test` in this session (sandboxed command execution required approval that didn't go through), so I confirmed the RED state by inspection of the current file content rather than a live run — the harness's RED check will verify this directly.",
    "builder_c1": "Diff scope matches the plan exactly: only Step 8's narration sentence in `design/playtest-spatial.md`, its regenerated `site/design/playtest-spatial.html` companion, and the new test file. Steps 1-7, 9-12, Materials, and \"What to watch for\" are untouched, and no file under `test/` was modified. Full suite is green (798/798 pass, 0 fail).",
    "reviewer_c1": "All three visible ACs are satisfied, verified directly against the working-tree files (Step 8 text, the Bastion Lockdown Line card entry, and the new test's assertions). No INTRODUCED findings — the only out-of-plan file (`site/design/playtest-spatial.html`) is a pre-existing generated build artifact consistently regenerated in prior units, and its content faithfully mirrors the markdown change.\n\nAPPROVE",
    "devils_advocate": "## Devil's Advocate Review — cardgame-playtest-spatial-restriction-refresh\n\n**Finding (INTRODUCED): Step 8 now cites a real card whose printed rules text directly contradicts the unconstrained instruction the step still gives.**\n\n`design/cards/wormhole-restrictions-set.md` gives Bastion Lockdown Line's Rules text as:\n\n> Slow. Spent: choose a Wormhole with **an endpoint at a Planet you control**; place a Directional Restriction ... on it, permitting travel only from that Planet toward its other endpoint, never the reverse.\n\nStep 8, after this unit's edit, still opens with (unchanged, context line):\n\n> \"Pick **any** drawn line on the table and write 'one-way: [origin]→[destination]' on it, narrating that **Bastion Lockdown Line** ... is the card just played to grant it a Directional Restriction.\"\n\nBefore this unit, that \"pick any line\" instruction was harmless because the card was explicitly a hallucinated placeholder (\"this rulebook has no default action ... simply declare which card would\") — there was no real rules text to be inconsistent with. This unit deliberately swaps that placeholder for a real, textually-defined card, but does not audit whether the rest of Step 8 still holds up against that card's actual printed constraint. It doesn't: the real Bastion Lockdown Line can only target a Wormhole with an endpoint at a Planet the caster controls, while Step 8 as rewritten still tells playtesters to pick *any* line, with no such qualifier.\n\nThis is exactly the failure mode the document exists to prevent — its own preamble states every step \"cites the exact rules.md section it is exercising, so either playtester can stop at any point and cross-check the physical action just taken against the rule text itself\" (design/playtest-spatial.md:6-9). A playtester following Step 8 literally (e.g., picking a line between two Planets neither belonging to the active player) would narrate an action the named card's own Rules text cannot perform. Note the document's authors clea",
    "builder_c2": "All 798 tests pass, working tree clean.\n\nFixed the devil's-advocate finding: Step 8 in `design/playtest-spatial.md` said \"Pick any drawn line on the table,\" which contradicted Bastion Lockdown Line's actual Rules text (it can only target a Wormhole with an endpoint at a Planet the caster controls). Added that qualifier and pinned the controlled Planet as the notation's origin — everything else in Step 8 (the write-the-note action, the aloud confirmation) stayed unchanged, so all three visible ACs and the held-out AC4 still pass. Committed as `76bf230`.",
    "reviewer_c2": "All three visible ACs are satisfied, scope is exactly as expected (only the two files plus companion HTML), and I verified the cited card (Bastion Lockdown Line) actually exists with matching Cost line and Rules text that requires the controlled-Planet-endpoint constraint the cycle-2 fix added. No introduced defects.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
