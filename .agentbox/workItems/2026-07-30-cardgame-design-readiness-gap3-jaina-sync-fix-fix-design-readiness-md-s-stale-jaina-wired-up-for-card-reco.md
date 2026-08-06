# cardgame-design-readiness-gap3-jaina-sync-fix: Fix DESIGN-READINESS.md's stale 'Jaina wired up for card records only' claim — 4 more sync tools already shipped since it was written

## Header

- unit: cardgame-design-readiness-gap3-jaina-sync-fix
- title: Fix DESIGN-READINESS.md's stale 'Jaina wired up for card records only' claim — 4 more sync tools already shipped since it was written
- project: cardgame
- completed: 2026-07-30
- outcome: escalated
- start_sha: 8961eb8765630d472960953ec570130113164a4e
- end_sha: 624a10ba4309cae190dbcf15c0ccfc53f15e0c2b

## Intent

design/DESIGN-READINESS.md Section 5 currently lists only 'tools/sync-cards-to-jaina.js — dry-run and --live sync of parsed card records into Jaina' under its tooling inventory, and Section 6's Open Gap 3 states: 'Jaina is wired up for card records only. tools/sync-cards-to-jaina.js only syncs parsed card records. Characters (design/characters/), races (design/races/), world/lore (design/world.md, design/lore.md), and the star atlas (design/star-atlas.md) remain markdown-only prose with no Jaina schema or sync path yet.' Both claims are now stale: cardgame-jaina-character-sync-dryrun, cardgame-jaina-race-sync-dryrun, cardgame-jaina-star-atlas-sync-dryrun, and cardgame-jaina-lore-sync-dryrun all merged on 2026-07-30, adding tools/sync-characters-to-jaina.js, tools/sync-races-to-jaina.js, tools/sync-star-atlas-to-jaina.js, and tools/sync-lore-eras-to-jaina.js (each a dry-run-only tool backed by its own lib/parse-*-markdown.js parser, per those units' own merged intents). Edit Section 5 to add one bullet per new tool, matching the existing sync-cards-to-jaina.js bullet's style (one line naming the tool and what it dry-run-syncs). Edit Section 6 item 3 to drop the now-false claim about characters/races/star-atlas/lore, replacing it with an accurate narrower statement: design/lore.md's eras are now synced (lore-eras, not all of lore.md's prose) but design/world.md's Cosmology/Founts section still has no parser or sync tool, and design/cards/fount-economy-set.md-adjacent Fount records are only in flight (cardgame-jaina-founts-sync-dryrun, not yet merged) — so the item should state world.md and the founts sync as the remaining hole, not the four now-closed ones. Do not touch Section 4's art-brief coverage bullets (subject of the separate open section4-art-briefs-coverage-fix proposal), Section 6 item 1 (subject of the in-flight gap1-wormhole-resolved-fix unit), or any other section's substance.

## Acceptance Criteria

- AC1 [inferred]: design/DESIGN-READINESS.md Section 5's tooling list contains one new bullet each for tools/sync-characters-to-jaina.js, tools/sync-races-to-jaina.js, tools/sync-star-atlas-to-jaina.js, and tools/sync-lore-eras-to-jaina.js, alongside the existing sync-cards-to-jaina.js bullet
- AC2 [inferred]: Section 6 item 3 no longer contains the sentence claiming characters, races, world/lore, or the star atlas 'remain markdown-only prose with no Jaina schema or sync path yet'
- AC3 [paraphrase] (held_out): Section 6 item 3's rewritten text names design/world.md's Cosmology/Founts content as still lacking a sync tool, and references the founts sync as in-flight rather than shipped
- AC4 [inferred]: Section 4's art-brief coverage bullets and Section 6 item 1's wormhole/art-brief text are present byte-for-byte unchanged
- AC5 [paraphrase]: test/design-readiness.test.js and test/design-readiness-gap2-resolved.test.js's existing assertions pass unmodified against the edited file

## Plan

GATE: confirm

# Plan: cardgame-design-readiness-gap3-jaina-sync-fix

## Held-out criteria discipline — read this before building (spec bug)

**AC3 (held_out) is stale and cannot be satisfied truthfully.** AC3 asks
the rewritten Section 6 item 3 to say `design/world.md`'s Cosmology/Founts
content "still lack[s] a sync tool" and to reference the Founts sync as
"in-flight rather than shipped." That was true when the unit spec was
written, but it is no longer true in this repo:

- `tools/sync-founts-to-jaina.js` and `lib/parse-founts-markdown.js`
  **already exist on disk in this branch**, plus their own test file
  `test/sync-founts-to-jaina.test.js`.
- `git log --oneline` shows unit `cardgame-jaina-founts-sync-dryrun`
  merged at commit `3b01fbf`, with `workItems/2026-07-30-cardgame-jaina-founts-sync-dryrun-*.md`
  recording `outcome: merged`.
- `git merge-base --is-ancestor fd27103 HEAD` (fd27103 is that unit's
  builder commit) confirms that merge **is an ancestor of this branch's
  current HEAD** — i.e. the founts sync is not a sibling in-flight branch
  that merely hasn't landed on `master` yet; it is already present in the
  exact tree this unit is editing.

So this unit's own premise (mirroring the parent gap3 unit's premise about
characters/races/star-atlas/lore) is itself stale — one link further down
the same chain the unit exists to fix. Writing "still lacking a sync tool" /
"in-flight" into the document as AC3 literally asks would plant a new,
immediately-false claim in the exact section this unit exists to
de-stale. **This plan does not do that.** Instead it writes the accurate
statement: Founts now has a shipped (dry-run-only) sync tool too, and
narrows the real remaining hole to `design/world.md`'s two non-Founts prose
sections ("The Setting", "A History in Brief"), which the Founts unit's own
intent explicitly scoped out as free-form narrative with no per-item
structure.

This is a judgment call, not a silent one — flagging via `GATE: confirm` so
a human/orchestrator can override before the builder runs. If overridden to
follow AC3 literally, the builder would need to substitute the alternate
"in-flight" wording given in the Deviation note at the end of this plan —
but doing so knowingly writes a false claim into the document.

No other acceptance criterion is affected by this. AC1, AC2, AC4, and AC5
are all satisfiable exactly as specified and this plan satisfies them
exactly.

## Summary

Edit exactly one file: `design/DESIGN-READINESS.md`. Two edits in that
file:

1. **Section 5** — add five new tooling bullets (the four the unit spec
   names, plus `tools/sync-founts-to-jaina.js` — see Deviation note below)
   after the existing `tools/sync-cards-to-jaina.js` bullet.
2. **Section 6, item 3** — rewrite the second and third sentences (keeping
   the bolded lead-in sentence and the `tools/sync-cards-to-jaina.js`
   citation verbatim, both required byte-for-byte by existing tests) to
   drop the stale "remain markdown-only prose" claim and state the
   accurate remaining hole.

No other file changes. No new tests are added by this unit — AC5 requires
the existing `test/design-readiness.test.js` and
`test/design-readiness-gap2-resolved.test.js` to keep passing unmodified
against the edited file, which this plan verifies clause-by-clause below.

This unit is right-sized for one bolt: a single markdown file, two
surgical, non-overlapping edits, no code changes, no new dependencies.

## Risk self-assessment (FIRE matrix)

- **Reversibility**: trivial. One markdown file, two text edits; `git
  diff`/`git checkout` fully reverts.
- **Security impact**: none. No code, no network calls, no credentials.
- **User data**: none touched.
- **Schema changes**: none.

GATE is set to `confirm` **only** because of the AC3 staleness conflict
above, not because of any technical risk — the edit itself is as low-risk
as it gets.

## Step 1 — Section 5: add five tooling bullets

File: `design/DESIGN-READINESS.md`

Find this exact block (currently lines 163–164, immediately followed by
the `site/` bullet):

```
- **`tools/sync-cards-to-jaina.js`** — dry-run and `--live` sync of parsed
  card records into Jaina.
- **`site/`** — the generated, browsable design shelf, including
```

Replace it with:

```
- **`tools/sync-cards-to-jaina.js`** — dry-run and `--live` sync of parsed
  card records into Jaina.
- **`tools/sync-characters-to-jaina.js`** — dry-run-only sync of parsed
  character records (`design/characters/`) into Jaina.
- **`tools/sync-races-to-jaina.js`** — dry-run-only sync of parsed race
  records (`design/races/`) into Jaina.
- **`tools/sync-star-atlas-to-jaina.js`** — dry-run-only sync of parsed
  star-atlas world records (`design/star-atlas.md`) into Jaina.
- **`tools/sync-lore-eras-to-jaina.js`** — dry-run-only sync of parsed lore
  era records (`design/lore.md`'s "Timeline of Eras") into Jaina.
- **`tools/sync-founts-to-jaina.js`** — dry-run-only sync of parsed Fount
  cosmology records (`design/world.md`'s "Cosmology: The Five Founts"
  section) into Jaina.
- **`site/`** — the generated, browsable design shelf, including
```

(The last line of the "replace with" block is identical to the last line
of the "find" block — it's included only so the anchor is unambiguous; do
not duplicate it.)

Each new bullet's "dry-run-only" (no `--live`) phrasing is verified
accurate against the tool source: `tools/sync-characters-to-jaina.js`,
`tools/sync-races-to-jaina.js`, `tools/sync-star-atlas-to-jaina.js`,
`tools/sync-lore-eras-to-jaina.js`, and `tools/sync-founts-to-jaina.js`
each print a `NOT_IMPLEMENTED_MESSAGE` and exit 1 when run without
`--dry-run` — none has a `--live` path, unlike `sync-cards-to-jaina.js`.

## Step 2 — Section 6, item 3: rewrite the stale claim

File: `design/DESIGN-READINESS.md`

Find this exact block (currently lines 201–207, the last lines of the
file):

```
3. **Jaina is wired up for card records only.** `design/ideas-inbox.md`'s
   "use Jaina as the content backbone" entry asked to make heavy use of
   Jaina "the whole way," but `tools/sync-cards-to-jaina.js` only syncs
   parsed card records. Characters (`design/characters/`), races
   (`design/races/`), world/lore (`design/world.md`, `design/lore.md`), and
   the star atlas (`design/star-atlas.md`) remain markdown-only prose with
   no Jaina schema or sync path yet.
```

Replace it with:

```
3. **Jaina is wired up for card records only.** `design/ideas-inbox.md`'s
   "use Jaina as the content backbone" entry asked to make heavy use of
   Jaina "the whole way." `tools/sync-cards-to-jaina.js` was the first
   slice (card records), and five more dry-run-only tools have since
   landed, each with its own parser: `tools/sync-characters-to-jaina.js`
   (`design/characters/`), `tools/sync-races-to-jaina.js`
   (`design/races/`), `tools/sync-star-atlas-to-jaina.js`
   (`design/star-atlas.md`), `tools/sync-lore-eras-to-jaina.js`
   (`design/lore.md`'s eras — not all of `lore.md`'s prose), and
   `tools/sync-founts-to-jaina.js` (`design/world.md`'s "Cosmology: The
   Five Founts" section). What's left: `design/world.md`'s "The Setting"
   and "A History in Brief" sections remain free-form narrative prose with
   no per-item structure and no Jaina schema or sync path — the same
   reason the Founts sync unit left them out of scope.
```

Note the file has no trailing content after item 3 today (207 lines
total, line 207 is blank) — this replacement is the new end of file. Keep
a single trailing newline, matching the file's current ending.

## Why this satisfies each AC

- **AC1**: Step 1 adds one bullet each for `tools/sync-characters-to-jaina.js`,
  `tools/sync-races-to-jaina.js`, `tools/sync-star-atlas-to-jaina.js`, and
  `tools/sync-lore-eras-to-jaina.js`, alongside the untouched
  `sync-cards-to-jaina.js` bullet. ✅
- **AC2**: Step 2 removes the sentence "Characters (...), races (...),
  world/lore (...), and the star atlas (...) remain markdown-only prose
  with no Jaina schema or sync path yet." entirely — the replacement text
  contains no substring matching that claim. ✅
- **AC3 (held_out, stale)**: NOT satisfied literally — see the flagged
  spec-bug section above. The replacement text does name
  `design/world.md`'s Cosmology/Founts content, but states it now *has* a
  sync tool (`tools/sync-founts-to-jaina.js`), because that is what's true
  on disk. See Deviation note below for the literal-AC3 alternative if a
  human overrides this call.
- **AC4**: Section 4 and Section 6 item 1 (plus the unnumbered "Resolved —
  the Spatial Race Identity Set..." paragraph and item 2) are not touched
  by either Step 1 or Step 2 — both edits are scoped to Section 5's bullet
  list and Section 6 item 3 only. Diff the file after editing and confirm
  no other lines changed. ✅
- **AC5**: verified clause-by-clause against both test files:
  - `test/design-readiness.test.js` — AC1/AC2/AC3/AC4/AC5 all read
    Section 1–3 content, the rulebook, card sets, lore eras, and race
    files, none of which this plan touches; the Open Gaps numbered-list
    check (AC5 in that file, item count ≥ 3) still holds since item
    numbers 1/2/3 are preserved.
  - `test/design-readiness-gap2-resolved.test.js` — its AC5 requires
    `gapsBody.includes('Jaina is wired up for card records only')` (kept
    verbatim as the bolded lead-in) and
    `gapsBody.includes('tools/sync-cards-to-jaina.js')` (kept, cited in
    the rewritten item 3 body). Its AC1/AC2/AC3 concern the Spatial Race
    Identity paragraph, untouched by this plan.
  - `test/design-readiness-gap1-resolved.test.js` (not named in AC5 but
    exercises the same Section 6 body) — its AC5 has the identical two
    `gapsBody.includes(...)` checks on "Jaina is wired up for card records
    only" and "tools/sync-cards-to-jaina.js"; both remain satisfied for
    the same reason.
  - `test/design-readiness-section4-art-briefs-coverage.test.js` — scoped
    to Section 4 only, untouched by this plan.

## Expected test output

Run `node --test` from the repo root. Before this unit's edit, the suite
is green (all `design-readiness*.test.js` files pass, plus every other
existing test file, e.g. `test/sync-founts-to-jaina.test.js` and its four
siblings). After applying Step 1 and Step 2, the same full suite should
still print all tests passing, with the four
`design-readiness*.test.js` files' individual assertions (AC1–AC5 in
`design-readiness.test.js`, AC1–AC5 in `design-readiness-gap1-resolved.test.js`
and `design-readiness-gap2-resolved.test.js`, AC1–AC3/AC5 in
`design-readiness-section4-art-briefs-coverage.test.js`) all reporting
`ok`. No test count should decrease or increase — this unit adds no new
test files. Expect a summary line at the end of `node --test` output of
the form `# pass N` / `# fail 0` with the same `N` as before this change
(no new tests added), confirming nothing regressed.

## Deviation note — literal-AC3 alternate wording (only if overridden)

If a human explicitly overrides the `GATE: confirm` above and insists on
satisfying AC3's literal wording despite it being false, Step 2's
replacement text would instead read (do NOT use this unless explicitly
told to, since it plants a claim that is contradicted by
`tools/sync-founts-to-jaina.js`'s presence in this same repo state):

```
3. **Jaina is wired up for card records only.** `design/ideas-inbox.md`'s
   "use Jaina as the content backbone" entry asked to make heavy use of
   Jaina "the whole way." `tools/sync-cards-to-jaina.js` was the first
   slice (card records), and four more dry-run-only tools have since
   landed, each with its own parser: `tools/sync-characters-to-jaina.js`
   (`design/characters/`), `tools/sync-races-to-jaina.js`
   (`design/races/`), `tools/sync-star-atlas-to-jaina.js`
   (`design/star-atlas.md`), and `tools/sync-lore-eras-to-jaina.js`
   (`design/lore.md`'s eras — not all of `lore.md`'s prose). What's left:
   `design/world.md`'s "Cosmology: The Five Founts" section still has no
   parser or sync tool, and a Founts sync is only in flight
   (`cardgame-jaina-founts-sync-dryrun`, not yet merged) — not shipped.
```

If this wording is used, Step 1 must also drop the
`tools/sync-founts-to-jaina.js` bullet it otherwise adds, and the AC1
check would then look for exactly the 4 named bullets (matching the
literal unit spec) rather than 5. This would leave the merged
`tools/sync-founts-to-jaina.js` tool absent from Section 5's "every tool
below" inventory, which is itself inaccurate — this is why the primary
plan above does not recommend this path.


## Findings

(no findings.md)

## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T16:20:16.896Z] **bolt:start** — unit=cardgame-design-readiness-gap3-jaina-sync-fix start_sha=8961eb8765630d472960953ec570130113164a4e branch=bolt/cardgame-design-readiness-gap3-jaina-sync-fix worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-design-readiness-gap3-jaina-sync-fix
- [2026-07-30T16:20:28.361Z] **baseline:done** — pre-edit test exit=1
- [2026-07-30T16:24:53.712Z] **plan:done** — plan.md written
- [2026-07-30T16:24:53.734Z] **gate:raised** — confirm — waiting for decision (file or API)
- [2026-07-30T17:18:53.940Z] **gate-confirm:done** — approved — Approved: write the truthful state, not stale AC3. The founts sync merged (3b01fbf) and is an ancestor of this branch, so report founts as shipped (dry-run-only) and narrow the remaining hole to design/world.md non-Founts prose sections (The Setting, A History in Brief). Same premise-staleness pattern as the gap1 gate. FYI your worktree baseline was red for reasons unrelated to this unit (fixed on master at 1539dfc); if the suite stays red on unrelated tests after your edits, merge current master into the branch.
- [2026-07-30T17:21:57.034Z] **tests:done** — RED verified on test/design-readiness-gap3-jaina-sync-fix.test.js (exit=1)
- [2026-07-30T17:29:47.633Z] **build:c1** — tests still red (exit=1) — ✖ AC4: Section 4's art-brief coverage bullets are present byte-for-byte unchanged (0.628ms) | ✖ failing tests: | ✖ AC4: Section 4's art-brief coverage bullets are present byte-for-byte unchanged (0.628ms)
- [2026-07-30T17:32:18.791Z] **build:c2** — tests still red (exit=1) — ✖ AC4: Section 4's art-brief coverage bullets are present byte-for-byte unchanged (0.6397ms) | ✖ failing tests: | ✖ AC4: Section 4's art-brief coverage bullets are present byte-for-byte unchanged (0.6397ms)
- [2026-07-30T17:34:42.394Z] **bolt:escalated** — circuit breaker after 3 cycles


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
