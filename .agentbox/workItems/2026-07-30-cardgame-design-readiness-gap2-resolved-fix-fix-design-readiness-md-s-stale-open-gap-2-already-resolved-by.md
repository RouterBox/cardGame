# cardgame-design-readiness-gap2-resolved-fix: Fix DESIGN-READINESS.md's stale Open Gap 2 (already resolved by the shipped Wave 2 spatial set)

## Header

- unit: cardgame-design-readiness-gap2-resolved-fix
- title: Fix DESIGN-READINESS.md's stale Open Gap 2 (already resolved by the shipped Wave 2 spatial set)
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: 6c8f9220ef4de428671a89073b460a22f7d66fed
- end_sha: b4fd4511c79de9a62d7ba236c8d3b1acbb81f43b

## Intent

design/DESIGN-READINESS.md Section 3 already documents 'Spatial Race Identity Set, Wave 2 — 2 cards. Grounds the two remaining races (Mireth Bloom, Wrought Assembly) in the wormhole/battlefield graph, completing the wave-1 set above.' Yet Section 6's Open Gap 2 still reads 'The Spatial Race Identity Set only speaks for 3 of 5 races... The Mireth Bloom and the Wrought Assembly have no card in this wave' — a claim the wave-2 unit (shipped as cardgame-spatial-race-identity-cards-wave-2) already falsified. Since this document's entire purpose (per its own opening paragraph) is to make the I6 software-gate judgment call an informed one via file-citation-backed claims, a stale contradiction between two of its own sections undermines that purpose. Edit only the Open Gap 2 entry: replace its claim of an unresolved hole with a short resolved-status note citing design/cards/spatial-race-identity-set-wave-2.md by filename, and renumber the remaining gaps (art-brief coverage hole, no digital implementation, Jaina card-only) so the list stays a clean sequential numbered list. Do not touch Section 3's existing wave-2 description, the rulebook section list, the era timeline, or any other Open Gap's substance — only Gap 2's own text and the renumbering it requires.

## Acceptance Criteria

- AC1 [inferred]: design/DESIGN-READINESS.md's Open Gaps section no longer contains the sentence claiming the Mireth Bloom or the Wrought Assembly have 'no card in this wave'
- AC2 [inferred]: The same Open Gaps section now states that this gap was resolved and names 'spatial-race-identity-set-wave-2.md' verbatim as the resolving file
- AC3 [paraphrase]: The Open Gaps section still parses as a sequential numbered list (1., 2., 3., ... with no skipped or repeated numbers) with at least 3 items, so test/design-readiness.test.js's existing AC5 assertion continues to pass unmodified
- AC4 [inferred] (held_out): Section 3's existing description of 'Spatial Race Identity Set, Wave 2' (the 2-card, two-remaining-races summary) is present in the file byte-for-byte unchanged
- AC5 [paraphrase]: The other three Open Gap entries (art-brief coverage hole, no digital implementation ever built, Jaina wired for cards only) each still appear in the document with their original substantive text intact, only renumbered

## Plan

GATE: none

# Plan: cardgame-design-readiness-gap2-resolved-fix

## Summary

`design/DESIGN-READINESS.md` Section 6 ("Open Gaps & Unresolved Questions")
still lists Open Gap 2 as an unresolved hole ("The Spatial Race Identity Set
only speaks for 3 of 5 races... The Mireth Bloom and the Wrought Assembly
have no card in this wave"). This is now false: Section 3 of the same
document already describes `design/cards/spatial-race-identity-set-wave-2.md`
as covering exactly those two races. This plan replaces Open Gap 2's text
with a short resolved-status note citing that file by filename, and
renumbers the remaining three gap entries so the list stays sequential
(1, 2, 3 — no skipped or repeated numbers).

**Single file touched:** `design/DESIGN-READINESS.md`. No test file changes,
no other design file changes.

## Why the numbered list shrinks from 4 items to 3

The unit's intent text explicitly names the three *other* gaps (art-brief
coverage hole, no digital implementation, Jaina card-only) as "the remaining
gaps" that need renumbering. That only makes sense if the resolved gap 2
entry is pulled out of the numbered sequence entirely (otherwise items 1, 3,
4 would already be numbered 1, 3, 4 with no renumbering needed). So:

- The old numbered items were: 1 (art-brief hole), 2 (spatial race gap —
  now resolved), 3 (no digital implementation), 4 (Jaina card-only).
- The resolved note replaces old item 2's numbered entry with an
  **unnumbered** paragraph (so it doesn't count toward or break the
  numbered-list sequence the test checks).
- Old item 3 becomes new item 2. Old item 4 becomes new item 3.
- Final numbered list: 1, 2, 3 — sequential, 3 items, satisfies AC3/AC5.

## Exact edit

File: `design/DESIGN-READINESS.md`

Find this exact block (currently lines 167–202, but match on text content,
not line numbers, since a prior edit could shift lines):

```
## 6. Open Gaps & Unresolved Questions

1. **Art-brief coverage has an 8-card hole.** None of the 3 cards in
   `design/cards/spatial-race-identity-set.md` or the 5 cards in
   `design/cards/wormhole-closure-cards.md` have a matching entry in
   `design/cards/art-briefs.md`, so `tools/composite-card-art.js` cannot
   generate art for them — confirmed live by that tool's own
   `no art brief for "<name>"` warning (see
   `workItems/2026-07-29-cardgame-art-brief-coverage-warning-*.md`). No
   unit has yet been proposed to close it.

2. **The Spatial Race Identity Set only speaks for 3 of 5 races.**
   `design/cards/spatial-race-identity-set.md` realizes
   `design/ideas-inbox.md`'s 2026-07-26 (later) entry — wormhole mechanics
   as race identity — for the Panoptic Concord, Starweave Communion, and
   Cindral Reach only. The Mireth Bloom and the Wrought Assembly have no
   card in this wave, even though that same ideas-inbox entry frames the
   mechanic as combining with "every race identity."

3. **No digital implementation of the design has ever been built or run.**
   `design/ideas-inbox.md`'s "software gate ruling" entry (I6 — the gate
   this review exists to inform) has, so far, kept every shipped unit to
   content-authoring tools. Nobody has yet tested whether the spatial
   battlefield graph, the five-Fount economy, or the Conflict Phase's
   priority/response system actually play well in real time; the only
   games ever run against this design are the two on-paper procedures in
   `design/playtest-spatial.md` and `design/playtest-full-game.md`, each a
   single walkthrough of one prewritten deck pairing.

4. **Jaina is wired up for card records only.** `design/ideas-inbox.md`'s
   "use Jaina as the content backbone" entry asked to make heavy use of
   Jaina "the whole way," but `tools/sync-cards-to-jaina.js` only syncs
   parsed card records. Characters (`design/characters/`), races
   (`design/races/`), world/lore (`design/world.md`, `design/lore.md`), and
   the star atlas (`design/star-atlas.md`) remain markdown-only prose with
   no Jaina schema or sync path yet.
```

Replace it with exactly this block (only the item-2 entry and the three
numeric labels change; the substantive text of items 1, 3, 4 is copied
byte-for-byte, only their leading digit changes):

```
## 6. Open Gaps & Unresolved Questions

1. **Art-brief coverage has an 8-card hole.** None of the 3 cards in
   `design/cards/spatial-race-identity-set.md` or the 5 cards in
   `design/cards/wormhole-closure-cards.md` have a matching entry in
   `design/cards/art-briefs.md`, so `tools/composite-card-art.js` cannot
   generate art for them — confirmed live by that tool's own
   `no art brief for "<name>"` warning (see
   `workItems/2026-07-29-cardgame-art-brief-coverage-warning-*.md`). No
   unit has yet been proposed to close it.

**Resolved — the Spatial Race Identity Set now speaks for all 5 races.**
`design/cards/spatial-race-identity-set.md` grounded only the Panoptic
Concord, Starweave Communion, and Cindral Reach; the Mireth Bloom and the
Wrought Assembly are now grounded by
`design/cards/spatial-race-identity-set-wave-2.md`, closing the gap this
entry used to track (see Section 3 above).

2. **No digital implementation of the design has ever been built or run.**
   `design/ideas-inbox.md`'s "software gate ruling" entry (I6 — the gate
   this review exists to inform) has, so far, kept every shipped unit to
   content-authoring tools. Nobody has yet tested whether the spatial
   battlefield graph, the five-Fount economy, or the Conflict Phase's
   priority/response system actually play well in real time; the only
   games ever run against this design are the two on-paper procedures in
   `design/playtest-spatial.md` and `design/playtest-full-game.md`, each a
   single walkthrough of one prewritten deck pairing.

3. **Jaina is wired up for card records only.** `design/ideas-inbox.md`'s
   "use Jaina as the content backbone" entry asked to make heavy use of
   Jaina "the whole way," but `tools/sync-cards-to-jaina.js` only syncs
   parsed card records. Characters (`design/characters/`), races
   (`design/races/`), world/lore (`design/world.md`, `design/lore.md`), and
   the star atlas (`design/star-atlas.md`) remain markdown-only prose with
   no Jaina schema or sync path yet.
```

**Implementation note:** use the `Edit` tool with `old_string` set to the
first block above and `new_string` set to the second block above, in a
single call against `design/DESIGN-READINESS.md`. Do not touch any other
part of the file — in particular, do not touch Section 3's "Spatial Race
Identity Set, Wave 2" bullet (lines ~90–93 in the current file), the
rulebook section list (Section 1), the era timeline (Section 2), or Open
Gap entries 1, 3, 4's substantive wording (only their leading number
changes, from 1/3/4 to 1/2/3).

## Why this satisfies each acceptance criterion

- **AC1** — the sentence "The Mireth Bloom and the Wrought Assembly have no
  card in this wave" is deleted entirely (it appeared only in old item 2,
  which is replaced).
- **AC2** — the new unnumbered paragraph starts with "Resolved —" and
  states the gap is closed, and its second sentence contains the exact
  substring `spatial-race-identity-set-wave-2.md` (inside the backtick-
  quoted path `design/cards/spatial-race-identity-set-wave-2.md`, same
  citation style Section 3 already uses).
- **AC3** — `test/design-readiness.test.js`'s AC5 test extracts the Open
  Gaps section body and regex-matches `^\d+\.\s+\S.*` per line. The new
  section has exactly three such lines: `1. **Art-brief...`, `2. **No
  digital...`, `3. **Jaina...` — sequential, ≥3, no gaps or repeats. The
  "Resolved — ..." paragraph does not start with a digit, so it is not
  counted as a list item and cannot break the sequence.
- **AC4 (held out)** — Section 3's existing "Spatial Race Identity Set,
  Wave 2" bullet (`design/DESIGN-READINESS.md` lines ~90–93 today) is
  outside the edited block and is not touched by this change, so it
  remains byte-for-byte identical.
- **AC5** — items 1, 3, 4's full original text (art-brief hole, no digital
  implementation, Jaina card-only) is preserved verbatim in the
  replacement block; only their leading digit changes (1 stays 1; 3
  becomes 2; 4 becomes 3).

## Test command and expected output

Run from the repo root:

```
node --test
```

Expected: all existing tests continue to pass, including
`test/design-readiness.test.js`'s five tests (`AC1`..`AC5`), with no new
failures. Specifically:

- `AC5: closes with a numbered list of at least 3 open gaps` — passes
  (finds exactly 3 sequential items: 1, 2, 3).
- No other test in the suite references Open Gap 2's old wording or the
  gap count, so no other test is affected. (Confirm by grepping the test
  suite for `no card in this wave` or `only speaks for 3 of 5` before and
  after the edit — should be zero matches in both cases in files other
  than `design/DESIGN-READINESS.md` itself, since that phrase never
  appeared in the test suite to begin with.)

## Risk assessment (FIRE matrix)

- **Reversibility:** trivial — single-file markdown text edit, fully
  reversible via git revert.
- **Security impact:** none — no code, no config, no secrets.
- **User data:** none — static design documentation only.
- **Schema changes:** none.

Overall risk: minimal. This is a documentation-only text correction with a
single exact-match edit. `GATE: none`.

## Explicit non-goals (do not do these)

- Do not modify `design/cards/spatial-race-identity-set-wave-2.md` or any
  other card file.
- Do not modify Section 3, Section 1 (rulebook list), Section 2 (era
  timeline), or Open Gap entries 1, 3, 4's substance beyond renumbering.
- Do not modify `test/design-readiness.test.js` or any other test file —
  the existing AC5 assertion must pass unmodified against the new prose.
- Do not add a 4th numbered gap or otherwise change the total gap count
  logic beyond what's described above.


## Findings

# Blind Review — cardgame-design-readiness-gap2-resolved-fix (cycle 1)

## Scope of diff
- `design/DESIGN-READINESS.md`: Open Gap 2's stale "3 of 5 races" entry replaced
  with an unnumbered "Resolved —" paragraph citing
  `spatial-race-identity-set-wave-2.md`; old items 3/4 renumbered to 2/3.
- `site/design/DESIGN-READINESS.html`: hand-edited to mirror the markdown change.
- `test/design-readiness-gap2-resolved.test.js`: new test file asserting AC1/AC2/AC3/AC5.

## AC-by-AC verification

- **AC1** — "no card in this wave" and "only speaks for 3 of 5 races" are both
  gone from the Open Gaps section (confirmed by direct read of the file, lines
  167-202). Satisfied.
- **AC2** — new paragraph opens "Resolved — the Spatial Race Identity Set now
  speaks for all 5 races." and its second sentence contains the verbatim
  substring `spatial-race-identity-set-wave-2.md`. Satisfied.
- **AC3** — Open Gaps section now has exactly three digit-leading lines: `1.
  **Art-brief...`, `2. **No digital...`, `3. **Jaina...` — sequential 1,2,3,
  no skips/repeats, ≥3 items. Verified against `test/helpers/markdown.js`'s
  `sectionText`/regex logic (same logic both the pre-existing AC5 test in
  `test/design-readiness.test.js` and the new AC3 test use). The unnumbered
  "Resolved —" paragraph does not start with a digit, so it does not perturb
  the sequence. Satisfied.
- **AC5** — items 1 (art-brief hole), 2 (no digital implementation, ex-3), and
  3 (Jaina card-only, ex-4) are byte-for-byte identical to their prior text —
  confirmed against the diff hunks, which only touch the leading digit on
  those two lines and leave everything else in context. Satisfied.

## Consistency check beyond the stated ACs (not gating, but verified)

Traced `tools/build-site.js`'s markdown→HTML block renderer by hand: numbered
list items only consume the single line starting with `\d+.` (continuation
lines break the `<ol>` collection into a separate `<p>`, a pre-existing
quirk), and paragraph lines are joined with a single space. Replaying that
logic against the new markdown block produces HTML byte-identical to what
was hand-committed in `site/design/DESIGN-READINESS.html`. The site file is
not stale relative to the generator.

## Findings

None. No INTRODUCED defects found. The edit is scoped exactly as the plan
describes — only Open Gap 2's text and the mechanical renumbering of the two
following items — and Section 3, the rulebook section list, the era
timeline, and Gap 1's/3's/4's substantive wording are untouched.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T10:30:24.393Z] **bolt:start** — unit=cardgame-design-readiness-gap2-resolved-fix start_sha=6c8f9220ef4de428671a89073b460a22f7d66fed branch=bolt/cardgame-design-readiness-gap2-resolved-fix worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-design-readiness-gap2-resolved-fix
- [2026-07-30T10:30:35.458Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T10:32:55.683Z] **plan:done** — plan.md written
- [2026-07-30T10:35:10.240Z] **tests:done** — RED verified on test/design-readiness-gap2-resolved.test.js (exit=1)
- [2026-07-30T10:40:16.157Z] **build:c1** — tests green, committed
- [2026-07-30T10:42:52.102Z] **review:c1** — APPROVE
- [2026-07-30T10:46:01.492Z] **review:devils-advocate** — APPROVE
- [2026-07-30T10:46:10.657Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T10:46:11.016Z] **merge:done** — auto-merged bolt/cardgame-design-readiness-gap2-resolved-fix into master (worktree)


## Receipt

```json
{
  "start_sha": "6c8f9220ef4de428671a89073b460a22f7d66fed",
  "end_sha": "4e98e96a1c75daaf6e905c0236381ce54070b6c1",
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
    },
    {
      "id": "AC5",
      "held_out": false,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-30T10:46:10.656Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-design-readiness-gap2-resolved-fix\\plan.md`.\n\nSummary of the approach: replace Open Gap 2's stale text in `design/DESIGN-READINESS.md` with an unnumbered \"Resolved —\" note citing `spatial-race-identity-set-wave-2.md`, and renumber the remaining two gaps (3→2, 4→3) so the list stays sequential at 1, 2, 3 — leaving Section 3 and the other gaps' substance untouched. `GATE: none` (docs-only, trivially reversible).",
    "test_writer": "I've written the failing tests to `test/design-readiness-gap2-resolved.test.js` (no changes to `src/` or `design/`). I can't get shell execution approved in this session to run `node --test` myself — every attempt to the Bash/PowerShell tools is being blocked before it reaches me. \n\nSummary of what the tests check against the current (unfixed) `design/DESIGN-READINESS.md`:\n- **AC1**: asserts the Open Gaps section no longer contains \"no card in this wave\" / \"only speaks for 3 of 5 races\" — currently present, so this fails now.\n- **AC2**: asserts the section states the gap is \"resolved\" and cites `spatial-race-identity-set-wave-2.md` verbatim — not present yet, so this fails now.\n- **AC3**: sequential numbered list check (1,2,3...) — passes both before and after (regression guard).\n- **AC5**: the other three gap entries' original text — passes both before and after (regression guard).\n\nPlease run `node --test test/design-readiness-gap2-resolved.test.js` (or approve my next attempt) to confirm the RED state before the fix lands.",
    "builder_c1": "Full suite is green (941/941), tree is clean, and no `test/` files were touched.\n\nSummary:\n- Edited `design/DESIGN-READINESS.md`'s Open Gap 2 exactly per plan: replaced the stale \"no card in this wave\" claim with an unnumbered \"Resolved —\" paragraph citing `spatial-race-identity-set-wave-2.md`, and renumbered gaps 3/4 → 2/3 with their text untouched.\n- `node --test` regenerates `site/design/DESIGN-READINESS.html` as a side effect of the site-build tests, so that file changed too (expected, not a design file).\n- Had to commit both files before the final test run: `test/card-template-helper.test.js`'s AC4 asserts a clean `git status -- design`, which is only satisfiable once the design edit is committed. This is a known structural quirk — the wave-2 unit (`8c6936c`) hit and resolved the identical conflict the same way, as noted in its commit message. I followed that precedent rather than touching the test.",
    "reviewer_c1": "Findings written to `findings.md`. All four visible ACs are satisfied, the edit is scoped exactly to Gap 2's text and the mechanical renumbering, and hand-tracing the site generator's rendering logic confirms the accompanying HTML edit is byte-consistent (not stale). No introduced defects.\n\nAPPROVE",
    "devils_advocate": "HTML is well-formed and consistent with the intended change. The Devil's Advocate attack fails: the numbering approach (pulling the resolved entry out of the sequential open-gaps enumeration rather than assigning it a number) satisfies AC3's sequential-numbering requirement exactly as written, matches the intent's explicit instruction to renumber only \"the remaining gaps\" (the three still-open ones), and the file citation checks out factually against `spatial-race-identity-set-wave-2.md`. The only candidate weakness — the resolved entry losing its `<ol><li>` wrapper in the HTML mirror — sits in a file no test covers, and every other gap entry in that file was already rendering with broken/non-representative numbering (single-item `<ol>` blocks with no `start` attribute) before this diff, so it isn't a regression introduced here.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
