# cardgame-spatial-race-identity-cards: Race-identity spatial cards — Concord's cheap Discovery, Communion's bent Restrictions, Reach's fortified Wormholes

## Header

- unit: cardgame-spatial-race-identity-cards
- title: Race-identity spatial cards — Concord's cheap Discovery, Communion's bent Restrictions, Reach's fortified Wormholes
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: 27562140cd1222d730ff2626ae1c9db10d3ab44c
- end_sha: 85da2ffd3efffdb50754b73996a734eb05366fab

## Intent

design/ideas-inbox.md's 2026-07-26 (later) spatial-layer entry lists five implications to design through; four have since been built into rules.md Section 8 and into the wormhole-restriction-cards/wormhole-closure-cards card sets (generic, same-effect-per-race), but the fifth — 'Combos with race identity: the Concord discovering more cheaply (Signal), the Communion bending wormhole rules (Tangle), the Reach fortifying them' — has never been realized by any printed card. rules.md already fully specifies the mechanics each of these three cards needs: Section 8.3 fixes Discovery's Fount Point cost (Length for Frontier, double for Contested) as a number a card can modify; Section 8.4 defines Directional and Team Restrictions as limits on which Assault paths may count a Wormhole (Section 8.6), which a card can state an exception to; Section 8.5 defines Closure as an action only 'whatever card or effect states it' can take, meaning a card can equally state a condition that blocks it; and Section 4.1 already establishes the Mass's Fortification-counter pattern (paying Mass Points to protect a permanent from destruction) as the precedent for the Reach's fortifying identity. This unit adds a new design/cards/spatial-race-identity-set.md with exactly 3 cards, one each for Panoptic Concord, Starweave Communion, and Cindral Reach, following the same Cost/Type/Rules-text/Stats-line template test/design-frontier-cards.test.js already enforces for frontier-set.md, each card's Rules text citing the relevant rules.md section by number the same way frontier-set.md's cards do. No rules.md change is needed or made — every effect is expressible entirely within a card's own Rules text as a stated exception to an already-shipped default, and no other card file's names or content are touched.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/spatial-race-identity-set.md exists and contains exactly 3 distinct named cards — one under Panoptic Concord, one under Starweave Communion, one under Cindral Reach (per design/races/) — each with a Cost line, Type line, and Rules text in that order, and a Stats/counters line only when its Type line contains 'Permanent', matching the template test/design-frontier-cards.test.js enforces for frontier-set.md.
- AC2 [paraphrase]: The Panoptic Concord card's Cost line names the Signal Fount, and its Rules text explicitly reduces the Fount Point cost of a Discovery action, citing 'Section 8.3' by number.
- AC3 [paraphrase]: The Starweave Communion card's Cost line names the Tangle Fount, and its Rules text explicitly lets its controller's Assault treat a Directional or Team Restriction on a Wormhole as absent for the purpose of counting that Assault's path, citing both 'Section 8.4' and 'Section 8.6' by number.
- AC4 [inferred] (held_out): The Cindral Reach card's Cost line names the Mass Fount, its Rules text explicitly prevents a specified Wormhole from being Closed while a stated condition holds, citing 'Section 8.5' by number; design/rules.md and every other file under design/cards/ remain byte-identical to before this unit, and none of the 3 new card names collides with any card name already printed in alpha-set.md, frontier-set.md, or character-signatures.md.

## Plan

GATE: none

# Plan: cardgame-spatial-race-identity-cards

## Summary

Create exactly one new file, `design/cards/spatial-race-identity-set.md`,
containing exactly 3 cards — one for the Panoptic Concord, one for the
Starweave Communion, one for the Cindral Reach — realizing the fifth
implication of `design/ideas-inbox.md`'s 2026-07-26 (later) entry ("Combos
with race identity: the Concord discovering more cheaply (Signal), the
Communion bending wormhole rules (Tangle), the Reach fortifying them").

No other file is touched. No `rules.md` change is needed or made. This is a
single, small, additive unit — one bolt is sufficient; no split needed.

## Risk self-assessment (FIRE matrix)

- **Reversibility**: trivial — a single new markdown file; `git revert` or
  delete undoes it completely.
- **Security impact**: none — static design content, no code, no runtime
  behavior.
- **User data**: none touched.
- **Schema changes**: none — no code or data-schema files are touched, only
  a new design document.

This is unambiguous, fully specified by the unit's Intent (every mechanic
it needs is already defined in `rules.md` Sections 4.1, 8.3, 8.4, 8.5, 8.6),
so **GATE: none**.

## Held-out AC check (AC4)

AC4 is redundant with the visible intent, not novel: it just spells out the
same "Cindral Reach fortifies wormholes" implication named in
`ideas-inbox.md` and Section 4.1's Fortification-counter precedent already
cited in the unit's Intent, plus the general "don't touch other files" /
"don't collide names" hygiene that AC1-AC3 already imply for the other two
cards. Nothing in it introduces a requirement absent from the visible
intent — no spec bug to flag.

## File to create

**Path:** `design/cards/spatial-race-identity-set.md` (this exact path,
relative to repo root — sibling to `design/cards/frontier-set.md`).

This file does not exist yet. Create it with **exactly** the following
content (copy verbatim; the wording of Rules text matters for the tests —
see "Why the wording is exact" below):

```markdown
# Spatial Race Identity Set — Wormholes as Race Identity

## Summary

This file contains 3 named cards, realizing the one implication of
*design/ideas-inbox.md*'s 2026-07-26 (later) entry that no other card set
has yet built: race identity combined with the battlefield graph of
*design/rules.md* Section 8. Each card is paid for from the one Fount
matching its race, per the mapping *design/cards/frontier-set.md* already
uses: the Panoptic Concord (Intelligence, the Signal) discovers more
cheaply, citing Discovery's cost formula in Section 8.3; the Starweave
Communion (Magic, the Tangle) bends Wormhole Restrictions for its own
Assaults, citing Section 8.4 and Section 8.6; and the Cindral Reach
(Materials, the Mass) fortifies a Wormhole against Closure, citing Section
8.5 and following the Fortification-counter pattern Section 4.1 already
establishes for the Mass. Every card follows the canonical template of
*design/rules.md* Section 9.1.

## The Panoptic Concord

### Preemptive Survey

Cost line: 1 Signal
Type line: Intelligence
Rules text: Fast. When this resolves, the next Discovery action your
controller takes this turn (Section 8.3, which fixes a Discovery's Fount
Point cost as the new Wormhole's Length for a Frontier Discovery, or double
that for a Contested Discovery) costs 2 fewer Fount Points, to a minimum of
0.

*The Panoptic Concord never discovers blind: by the time the Fount is
spent, the destination was already read off someone else's manifest.*

## The Starweave Communion

### Unbound Passage

Cost line: 2 Tangle
Type line: Magic
Rules text: Slow. When this resolves, choose a Wormhole: until end of turn,
your Assault (Section 8.6, which defines Assault) may treat any Directional
Restriction or Team Restriction that Wormhole carries (Section 8.4, which
defines Restriction) as absent, for the purpose of counting that Assault's
path.

*The Starweave Communion doesn't ask a Wormhole for permission — the Tangle
simply forgets, for one crossing, that a rule was ever written there.*

## The Cindral Reach

### Chokepoint Garrison

Cost line: 2 Mass
Type line: Materials — Permanent
Rules text: Slow. Spent: place a Fortification counter — the same pattern
Section 4.1 establishes for the Mass — on one Wormhole with an endpoint at
a Planet you control. While that Wormhole has one or more Fortification
counters on it, it MAY NOT undergo Closure (Section 8.5, which defines
Closure).

*The Cindral Reach garrisons the graph itself: a Wormhole it fortifies
stays open no matter who wants it shut.*
```

Notes on exact formatting (a junior should not "improve" these):

- Heading levels matter: `#` for the file title, `##` for each race (`## The
  <Race Name>`), `###` for each card name. This mirrors
  `design/cards/frontier-set.md`'s structure exactly, because the test
  helper `test/helpers/markdown.js`'s `parseSections` splits the file on
  headings and a level-3 (`###`) heading's body is everything up to the
  next heading.
- Each card body's field order is **Cost line → Type line → Rules text**
  (Stats/counters line omitted here since none of the 3 cards carries one —
  it's optional even for the Permanent per Section 9.1, and
  `frontier-set.md`'s own Materials-Permanent card, "Bastion Reclamation
  Crew", also omits it).
- The italic flavor line at the end of each card **must contain the race's
  full name as printed in its `design/races/*.md` title** ("Panoptic
  Concord", "Starweave Communion", "Cindral Reach") — this is how
  `frontier-set.md`'s own cards satisfy the "card names the race" check
  (see `test/design-frontier-cards.test.js` lines 89-102, which regex-tests
  each card's *body* — not its heading — for the race's name). Do not
  remove or reword these flavor lines.
- Section citations must use the literal string `Section 8.3`, `Section
  8.4`, `Section 8.6`, `Section 8.5` (with the exact number) — the existing
  test pattern (see `test/design-frontier-cards.test.js` lines 128-131)
  matches on the literal regex `Section\s+8\.3` etc., so paraphrasing the
  citation (e.g. "the Discovery section") would fail it.
- `Section 4.1` in the Cindral Reach card's Rules text is not required by
  any AC, but keep it: it is the Intent's explicit precedent ("Section
  4.1... as the precedent for the Reach's fortifying identity") and costs
  nothing to satisfy AC4, which only requires citing Section 8.5.

## Why the wording is exact — walking each AC

**AC1** — the file has exactly 3 `###`-level cards (`Preemptive Survey`,
`Unbound Passage`, `Chokepoint Garrison`), all distinctly named, one whose
body names "Panoptic Concord", one "Starweave Communion", one "Cindral
Reach" (verified against the race titles in `design/races/panoptic-concord.md`,
`design/races/starweave-communion.md`, `design/races/cindral-reach.md`, each
of which starts `# The <Name>`). Each card has Cost line, Type line, Rules
text in that order; only the Materials — Permanent card *could* carry a
Stats/counters line, and it doesn't (optional, so this is fine per the
template rule `test/helpers/card-template.js` enforces — a missing
Stats/counters line never fails the check, only a misplaced or wrongly-gated
one does).

**AC2** — "Preemptive Survey"'s Cost line is `1 Signal` (names the Signal
Fount); its Rules text reduces "the next Discovery action['s]... Fount
Point cost... by 2... Fount Points" and cites `Section 8.3` literally.

**AC3** — "Unbound Passage"'s Cost line is `2 Tangle` (names the Tangle
Fount); its Rules text lets "your Assault... treat any Directional
Restriction or Team Restriction... as absent... for the purpose of counting
that Assault's path" and cites both `Section 8.4` and `Section 8.6`
literally.

**AC4 (held out)** — "Chokepoint Garrison"'s Cost line is `2 Mass` (names
the Mass Fount); its Rules text states a Wormhole "MAY NOT undergo Closure"
while a stated condition holds ("While that Wormhole has one or more
Fortification counters on it") and cites `Section 8.5` literally. No other
file is created, edited, or deleted by this unit, so `design/rules.md` and
every other file under `design/cards/` stay byte-identical to their current
committed state. None of the 3 new names ("Preemptive Survey", "Unbound
Passage", "Chokepoint Garrison") appears as a `###` card heading in
`design/cards/alpha-set.md`, `design/cards/frontier-set.md`, or
`design/cards/character-signatures.md` — verified by grep against all
existing `### ` headings in `design/cards/` (full list checked during
planning; see below).

Existing card names checked for collision (none match the 3 new names):
`Unwritten Hour`, `Oathbreaker's Toll`, `Echo Recall`, `Replicant Foundry
Core`, `Firmware Sentinel`, `Drone Cascade`, `Foreknowledge Cipher`,
`Whispered Contract`, `Static Ambush`, `Sporeknit Warden`, `Feral
Bloomcaller`, `Rootbind Thicket`, `Salvage-Wrought Bastion`, `Line-Fleet
Trooper`, `Cinder-Forged Plating`, `Wrought-Bloom Graft`, `Signal-Wrought
Prototype`, `Tangle-Forged Bolt` (all `alpha-set.md`); `Bastion Reclamation
Crew`, `Frontier Spore Cluster`, `Wormhole Ledger`, `Rite of Unmaking`,
`Replication Beachhead` (all `frontier-set.md`); `Kordelia Vess...`,
`Mother-Thread Ilvex...`, `Selin Vashti Corr...`, `Meridian Aule...`, `Unit
0-Prime...` (all `character-signatures.md`).

## Step-by-step for the builder

1. Confirm `design/cards/spatial-race-identity-set.md` does not already
   exist (`ls design/cards/`). If it somehow exists, stop and flag — this
   plan assumes a clean create, not an overwrite.
2. Create the file at exactly that path with exactly the content given in
   the fenced block above (copy the markdown between the triple backticks,
   not including the backtick fence lines themselves).
3. Do not modify any other file. In particular: do not touch
   `design/rules.md`, `design/cards/frontier-set.md`,
   `design/cards/alpha-set.md`, `design/cards/character-signatures.md`,
   `design/cards/wormhole-restrictions-set.md`,
   `design/cards/wormhole-closure-cards.md`, or anything under
   `design/races/`.
4. Run the test command: `node --test`. Expect the full existing suite to
   keep passing (no prior test references this new file, so nothing should
   regress), plus whatever new test file the test-authoring stage adds for
   this unit's ACs (following the same pattern as
   `test/design-frontier-cards.test.js`, pointed at
   `design/cards/spatial-race-identity-set.md` and the 3-race subset) to
   pass as well. Expected terminal output ends with a summary block whose
   `# fail 0` line reads `# fail 0` (Node's built-in test runner reporter),
   e.g.:
   ```
   # pass <N>
   # fail 0
   ```
   with no `not ok` lines anywhere above it.

## Expected observable outcome

- `design/cards/spatial-race-identity-set.md` exists, is valid Markdown,
  and contains exactly 3 cards as specified.
- `git status` shows exactly one new (untracked, then added) file:
  `design/cards/spatial-race-identity-set.md`. No other file shows as
  modified.
- `node --test` exits 0.


## Findings

# Blind Review — cardgame-spatial-race-identity-cards, cycle 1

## Scope of diff

- New `design/cards/spatial-race-identity-set.md` — 3 cards (one per race).
- New `renders/cards/{preemptive-survey,unbound-passage,chokepoint-garrison}.svg`.
- New `site/design/cards/spatial-race-identity-set.html`, plus sidebar-nav
  updates in 8 sibling `site/design/cards/*.html` files and one new `<li>`
  in `site/index.html`.
- New `test/design-spatial-race-identity-cards.test.js`.

## AC-by-AC verification

**AC1** — `design/cards/spatial-race-identity-set.md` exists, contains
exactly 3 distinctly-named `###` cards ("Preemptive Survey", "Unbound
Passage", "Chokepoint Garrison"), one under each of `## The Panoptic
Concord`, `## The Starweave Communion`, `## The Cindral Reach`. Verified the
race names against `design/races/{panoptic-concord,starweave-communion,
cindral-reach}.md` (`# The <Name>` titles) — each card's italic flavor line
names its own race exactly once, matching `test/helpers/card-template.js`'s
regex convention and `design-frontier-cards.test.js`'s pattern. Field order
is Cost line → Type line → Rules text in all three; only the one Materials —
Permanent card ("Chokepoint Garrison") could carry a Stats/counters line and
correctly omits it (optional per `frontier-set.md`'s own "Bastion
Reclamation Crew" precedent, which the new card's Rules text deliberately
mirrors almost verbatim). **Satisfied.**

**AC2** — "Preemptive Survey"'s Cost line is `1 Signal`. Its Rules text
reduces "the next Discovery action... costs 2 fewer Fount Points" and cites
`Section 8.3` literally. Cross-checked against `design/rules.md` §8.3 (lines
445-475): the parenthetical restatement ("fixes a Discovery's Fount Point
cost as the new Wormhole's Length for a Frontier Discovery, or double that
for a Contested Discovery") is an accurate paraphrase of the actual rule
text. **Satisfied.**

**AC3** — "Unbound Passage"'s Cost line is `2 Tangle`. Its Rules text lets
"your Assault... may treat any Directional Restriction or Team Restriction
that Wormhole carries... as absent, for the purpose of counting that
Assault's path," citing both `Section 8.4` and `Section 8.6` literally.
Cross-checked against `design/rules.md` §8.4 (Directional/Team Restriction
definitions) and §8.6 (Assault requires a path using Wormholes that "do not
carry a Restriction... that forbids this challenger's team or this
direction of travel") — the card's effect is a precise, coherent negation of
that exact clause. **Satisfied.**

**AC4 (held out, informational only)** — "Chokepoint Garrison" (`2 Mass`,
Materials — Permanent) places a Fortification counter on a Wormhole,
blocking Closure (§8.5) while a counter remains, following the
Fortification-counter pattern §4.1 establishes for the Mass and which
`frontier-set.md`'s own "Bastion Reclamation Crew" already uses for the same
race. Consistent with the plan's stated (non-gating) treatment.

## Other checks

- Name collision check: grepped all of `design/cards/` for "Preemptive
  Survey", "Unbound Passage", "Chokepoint Garrison" — no collisions with any
  existing card name.
- Build-artifact footprint: the diff also touches 8 sibling
  `site/design/cards/*.html` nav sidebars, adds `site/design/cards/
  spatial-race-identity-set.html`, adds a `site/index.html` entry, and adds
  3 `renders/cards/*.svg` files. The plan's text says "No other file is
  touched," which is technically inaccurate, but every one of these is a
  generated build artifact (SVG-per-card and HTML-per-set are both
  established repo-wide conventions — every other card in `renders/cards/`
  has a matching SVG, and every other card-set file has a matching
  `site/design/cards/*.html` with the same sidebar-nav list). The Intent's
  "no other card file's names or content are touched" refers to
  `design/cards/*.md` sibling files, none of which were touched. Classified
  as **PRE-EXISTING pattern, not a defect** — not flagged as a finding.
- New test file (`test/design-spatial-race-identity-cards.test.js`) reuses
  the shared `registerCardTemplateChecks` helper and `parseSections`, same
  as `design-frontier-cards.test.js`; assertions read straightforwardly and
  match the card content exactly (traced by hand since test execution
  requires shell approval not available in this review session).

## Findings

None. No INTRODUCED defects found against any visible AC.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T08:11:07.170Z] **bolt:start** — unit=cardgame-spatial-race-identity-cards start_sha=27562140cd1222d730ff2626ae1c9db10d3ab44c branch=bolt/cardgame-spatial-race-identity-cards worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-spatial-race-identity-cards
- [2026-07-29T08:11:15.315Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T08:15:30.932Z] **plan:done** — plan.md written
- [2026-07-29T08:17:48.286Z] **tests:done** — RED verified on test/design-spatial-race-identity-cards.test.js (exit=1)
- [2026-07-29T08:20:29.553Z] **build:c1** — tests green, committed
- [2026-07-29T08:23:38.649Z] **review:c1** — APPROVE
- [2026-07-29T08:27:23.865Z] **review:devils-advocate-inconclusive** — NEEDS_WORK with no substantive findings — attack does not count
- [2026-07-29T08:27:23.867Z] **review:devils-advocate** — APPROVE
- [2026-07-29T08:27:31.670Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T08:27:32.077Z] **merge:done** — auto-merged bolt/cardgame-spatial-race-identity-cards into master (worktree)


## Receipt

```json
{
  "start_sha": "27562140cd1222d730ff2626ae1c9db10d3ab44c",
  "end_sha": "b44a24c68957de770945cefda3e6ba3776c7ed64",
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
  "cycles": 1,
  "timestamp": "2026-07-29T08:27:31.668Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-spatial-race-identity-cards\\plan.md`.\n\nSummary: `GATE: none`. The plan specifies creating exactly one new file, `design/cards/spatial-race-identity-set.md`, with 3 fully-written cards (Panoptic Concord's \"Preemptive Survey\" discounting Discovery cost per §8.3, Starweave Communion's \"Unbound Passage\" bypassing Wormhole Restrictions for Assaults per §8.4/§8.6, Cindral Reach's \"Chokepoint Garrison\" fortifying a Wormhole against Closure per §8.5/§4.1), verified against all 4 ACs including the held-out one, with a name-collision check against every existing card file. No spec bugs found in the held-out AC — it's redundant with the visible intent as expected.",
    "test_writer": "Only the new test file was added; nothing under `design/` or `src/` was touched.\n\nNote: `node --test` invocations were blocked by the permission layer in this session (even simple `node -e`), so I couldn't execute the suite directly. I traced the test logic by hand instead: since `design/cards/spatial-race-identity-set.md` doesn't exist yet, `readCardsFile()` returns `null`, every downstream assertion (file-exists, card-count, per-race match, template fields, Fount/Section citations) hits its failure branch — confirming RED. I also walked the exact card content from `plan.md` through each assertion to confirm the tests would pass once that file is created, matching the same pattern `test/design-frontier-cards.test.js` uses for `frontier-set.md`.\n\nSummary of what was written (`test/design-spatial-race-identity-cards.test.js`):\n- **AC1**: file exists, exactly 3 distinct `###` cards, one naming each of Panoptic Concord/Starweave Communion/Cindral Reach (via `design/races/*.md` titles), and all 3 pass the shared Cost→Type→Rules-text template check (reusing `test/helpers/card-template.js`).\n- **AC2**: Panoptic Concord card's Cost line names the Signal Fount; Rules text reduces a Discovery's Fount Point cost and cites `Section 8.3`.\n- **AC3**: Starweave Communion card's Cost line names the Tangle Fount; Rules text lets the controller's Assault treat a Directional/Team Restriction on a Wormhole as absent for counting that Assault's path, citing both `Section 8.4` and `Section 8.6`.\n\nAC4 (Cindral Reach fortification specifics) is held out and intentionally not tested beyond the shared AC1 structural/template checks.",
    "builder_c1": "All 703 tests pass (0 failures). \n\nSummary: Created `design/cards/spatial-race-identity-set.md` exactly per plan.md with the three cards (Preemptive Survey/Concord, Unbound Passage/Communion, Chokepoint Garrison/Reach). Hit one snag: a pre-existing test in `test/card-template-helper.test.js` (from an earlier merged unit) asserts `git status --porcelain -- design` is empty — it's a leftover invariant from that unit's own \"don't touch design/\" self-check, but since it's now permanent in the suite, any unit adding real design content trips it while uncommitted. Resolved by committing the new file (not amending) rather than weakening anything under `test/`; after that commit, `git status -- design` is clean and the full suite is green. Left as untracked: `site/*.html` and `renders/cards/*.svg`, which are build-output side effects of running the test suite itself (as prior commits like `9ac5e3b` show is normal), not files I edited — out of scope for this bolt.",
    "reviewer_c1": "All three visible ACs are satisfied and cross-checked against `design/rules.md` §8.3/§8.4/§8.6 for mechanical accuracy, race names verified against `design/races/*.md`, and no card-name collisions found. The extra site/render files are consistent with the repo's established per-card build convention, not scope creep. Findings written to `findings.md`.\n\nAPPROVE",
    "devils_advocate": "NEEDS_WORK"
  }
}
```

## Comments

(no comments.md)
