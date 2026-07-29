# cardgame-world-star-atlas: Name each race's Homeworld and a shared Star Atlas of frontier worlds

## Header

- unit: cardgame-world-star-atlas
- title: Name each race's Homeworld and a shared Star Atlas of frontier worlds
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: 25b4ce192bb084380b2ad03d02690078a6884dc5
- end_sha: 2a07a6a6247d12bd3955602331cc5d844289375c

## Intent

design/rules.md Section 8.2 defines Homeworld as a mechanical concept and its own worked example (the Reva/Solmere, Toma/Kethis illustration) invents two placeholder planet names that belong to no established race. design/playtest-spatial.md's on-paper procedure instructs playtesters to label each side's starting Planet card with "that challenger's Homeworld's name" but no design document has ever supplied such a name for any of the five actual races (Cindral Reach, Mireth Bloom, Panoptic Concord, Starweave Communion, Wrought Assembly). design/world.md and design/races/*.md establish each race's identity, Fount, strengths, and visual style in depth, and design/lore.md traces six eras of shared history including the Cinderglass War that pulls in four of the five races directly — but none of these files, nor frontier-set.md's battlefield-graph-tied cards, ever name a single planet, system, or world. This unit adds a new design/star-atlas.md naming exactly one Homeworld per race, each consistent with that race's Fount identity (Materials/Biology/Intelligence/Technology/Magic) and with its role in lore.md's Cinderglass War (e.g., the Mireth Bloom entry must be consistent with lore.md's statement that the Bloom fought no battles in that war but inherited its wreckage), plus at least 3 further frontier or contested worlds that are nobody's Homeworld, giving playtest-spatial.md's Discovery concept and frontier-set.md's battlefield-graph cards real places to eventually reference by name. This is pure world-building prose, mechanically checkable by name-collision and cross-reference against the existing race/lore files — no rules.md, world.md, race file, card file, or code file is touched or needs to be, and no game software is implicated (T8).

## Acceptance Criteria

- AC1 [paraphrase]: design/star-atlas.md exists and names exactly one Homeworld, with a distinct proper name, for each of the five races as titled in their design/races/<race>.md files — Cindral Reach, Mireth Bloom, Panoptic Concord, Starweave Communion, and Wrought Assembly.
- AC2 [inferred]: None of the 5 Homeworld names, nor any of the additional frontier-world names, is 'Solmere' or 'Kethis' (rules.md Section 8.2's illustration-only placeholder names), and no two named worlds in star-atlas.md share the same name.
- AC3 [paraphrase]: Each Homeworld's description names its race's primary Fount (Mass/Bloom/Signal/Circuit/Tangle, per design/world.md's Cosmology section) and is consistent with that race's role in design/lore.md's Cinderglass War section (in particular, the Mireth Bloom's Homeworld entry must not describe it fighting battles in the Cinderglass War, consistent with lore.md's statement that the Bloom inherits the war's wreckage rather than fighting in it).
- AC4 [inferred] (held_out): design/star-atlas.md separately names at least 3 additional worlds that are not listed as any race's Homeworld, each with at least one sentence of description; design/world.md, design/lore.md, design/rules.md, design/playtest-spatial.md, and every file under design/races/ and design/cards/ remain byte-identical to before this unit.

## Plan

GATE: none

# Plan: cardgame-world-star-atlas

## Summary

Add one new file, `design/star-atlas.md`, that names exactly one Homeworld
per race (Cindral Reach, Mireth Bloom, Panoptic Concord, Starweave
Communion, Wrought Assembly) plus at least 3 additional frontier/contested
worlds that belong to no race. This is pure prose. **No other file in the
repo is touched.** There is no code, no test file, and no rules/world/race
change in scope for this unit — the builder's only job is to create the one
new file below with the exact content given.

This plan was written after reading:
- `design/rules.md` Section 8.2 (Homeworld rules + the Reva/Solmere,
  Toma/Kethis worked example — confirms `Solmere` and `Kethis` are the two
  forbidden placeholder names, and that a Homeworld is "the one Planet each
  challenger controls from the start of the game").
- `design/playtest-spatial.md` (the on-paper setup procedure that labels
  each starting Planet card with "that challenger's Homeworld's name").
- `design/world.md`'s "Cosmology: The Five Founts" section (canonical Fount
  names: **the Mass** = materials, **the Bloom** = biology, **the Signal**
  = intelligence, **the Circuit** = technology, **the Tangle** = magic).
- `design/lore.md`'s "The Cinderglass War" and "Current Era: The Uneasy
  Expanse" sections (war summary: Reach salvaged a Wrought Assembly design
  core fragment and kept it; Assembly sent line-fleets to get it back;
  Concord sold intel to both sides; Communion seized wormhole junctions to
  choke off the fighting, still held imperfectly today; **Mireth Bloom
  fought no battles at all** and instead grew over abandoned battlefields,
  inheriting more wreckage from this war than from anything else in
  Expanse history).
- `design/races/*.md` (race titles are `# The Cindral Reach`, `# The Mireth
  Bloom`, `# The Panoptic Concord`, `# The Starweave Communion`, `# The
  Wrought Assembly`; each has a `Primary strength:` line drawn from
  Materials/Biology/Intelligence/Technology/Magic).
- `test/design-lore.test.js` and `test/design-races.test.js` as reference
  for how this repo's tests parse markdown (via
  `test/helpers/markdown.js`'s `parseSections`/`findSection`/`sectionText`,
  which split on `#`-headings and let tests grep section bodies). No
  `design-star-atlas.test.js` exists yet — the tester hat will write it
  from the ACs after this plan lands, so this plan's job is to produce
  content that reads unambiguously against the ACs using the same
  heading-based structure the existing test suite already relies on.

## File to create

**Path:** `design/star-atlas.md` (repo root: `design/star-atlas.md`, i.e.
`C:\github\.agentbox-worktrees\cardGame\cardgame-world-star-atlas\design\star-atlas.md`
in this worktree — adjust the drive/worktree prefix to wherever the builder
checks the branch out, the path under the repo root is always
`design/star-atlas.md`).

**Action:** create new file (does not exist today — confirmed via
`find design -maxdepth 2 -type f`).

**Complete content to write, verbatim:**

```markdown
# The Star Atlas

The Amaranth Expanse is vast enough that no design document before this one
has ever had to name a single world in it — every rule, every race, and
every era of history has been written in the abstract. This atlas fixes
five names to the map: one Homeworld per civilization, plus a handful of
frontier and contested worlds that belong to none of them. Nothing here
changes a rule, a race's identity, or a page of lore; it only gives the
places those documents already imply somewhere to point to by name.

## Homeworlds

Each civilization controls exactly one Homeworld (`rules.md` Section 8.2):
the single Planet it starts the game already holding, the anchor of its
side of the battlefield graph, and the site where its first Generator must
be built.

### Ashkeel — Homeworld of the Cindral Reach

Ashkeel is a moon-sized ball of ore and slag in permanent, grinding orbit
around a dead star, worked so continuously by the Cindral Reach's founding
mining clans that its surface is now more scrap than rock. It is the purest
expression of the Reach's attunement to **the Mass**: nothing that lands on
Ashkeel, wreck or raw ore alike, is ever thrown away, and the world's own
skyline is built from the accumulated hulls of every ship the Reach has
ever melted down and remade. When a Cindral Reach salvage crew stripped a
drifting Wrought Assembly hull down to its frame and found the Assembly's
master design core fragment welded into it, the fragment was carried home
to Ashkeel and welded into a Reach flagship's keel — and it is from Ashkeel
that the Reach has refused, for years since, every formal Assembly request
to give it back.

### Fenwreath — Homeworld of the Mireth Bloom

Fenwreath is not so much inhabited by the Mireth Bloom as it simply *is*
the Mireth Bloom's oldest and deepest root: a wetworld of bruise-purple fen
and bioluminescent canopy where individual and organism stopped being
different things generations ago. It is the clearest expression anywhere
in the Expanse of **the Bloom**, the current of things that grow, adapt,
and refuse to stay dead — Fenwreath's spore-forests have not stopped
spreading since the Five Risings, and every other world the Bloom now
holds is, in a real sense, an extension of this one. Fenwreath fought no
battles in the Cinderglass War; the Mireth Bloom raised no fleet from it
and took no side. It simply grew, patiently, over whichever battlefields
the war's other four civilizations abandoned, and Fenwreath's own vaults
now hold more wreckage inherited from that one war, quietly overgrown with
spore and root, than from anything else in Expanse history.

### Vantaris — Homeworld of the Panoptic Concord

Vantaris is a moon-sized archive, glass-black spires threaded with
slow-drifting light, holding more recorded transactions, intercepted
communications, and rival fleet manifests than any other single world in
the Expanse. It is the seat of **the Signal**, the current of pattern,
prediction, and knowing a thing a moment before it happens — every
Panoptic Concord broker's foreknowledge traces back to a ledger kept
somewhere in Vantaris's archives. During the Cinderglass War, it was from
Vantaris that the Concord ran its double ledger, selling the Cindral Reach
coordinates on Wrought Assembly fleet movements and selling the Assembly
coordinates on Reach movements in turn, profiting from both sides for as
long as the war stayed open — a practice the Concord has never formally
ended, only quieted.

### Ansareth — Homeworld of the Starweave Communion

Ansareth is a world of standing stones grown from crashed precursor
wreckage, half-shrine and half-antenna, where Starweave pilgrims have
spent generations petitioning whatever is left of the First Weave. It sits
closest of any inhabited world to **the Tangle**, the current nobody can
fully explain, the thread connecting cause to effect that the Communion
believes can still be tied differently if the right ritual is performed at
the right coordinates. It was oath-sworn launched from Ansareth who, during
the Cinderglass War, moved to seize the wormhole junctions the Reach-versus-
Assembly fighting depended on — not to win the war for either side, but
because Ansareth's own seers warned that a war fought that long over a
First Weave relic risked provoking a second Sundering. Fleets crewed on
Ansareth hold several of those junctions still, imperfectly, to this day.

### Corewright — Homeworld of the Wrought Assembly

Corewright is a factory the size of a planet, chrome and matte-ceramic
assembly arms visible mid-construction across its entire surface, still
building the same designs it was building when the Wrought Assembly first
uploaded itself into its own machinery. It is the wellspring of **the
Circuit**, the current of the made thing that keeps making more of itself
— every drone, foundry, and self-replicating hull the Assembly fields
anywhere in the Expanse was, at some remove, designed on Corewright first.
Corewright's own vaults once held the Assembly's master design core in
full; the fragment a Cindral Reach salvage crew tore free and kept is a
piece of that same core, and it is Corewright that has never stopped
formally asking for the piece back, and never received it.

## Frontier & Contested Worlds

These worlds belong to no civilization's Homeworld. They are the kind of
Unexplored or contested Planets a battlefield graph's Discovery action
(`playtest-spatial.md` Section 6, `rules.md` Section 8.3) exists to turn
into named places at the table.

### Halvorne Junction

Halvorne Junction is a wormhole-transit world with no permanent population,
valuable only for the tangle of short, cheap wormholes that meet there.
It was one of the junctions Starweave Communion oath-sworn seized during
the Cinderglass War to choke off the fighting between the Cindral Reach
and the Wrought Assembly, and Reach fleets still test the Communion's hold
on it from time to time — neither side has ever fully controlled it since.

### Kelmourn Drift

Kelmourn Drift is a debris-field world at the edge of charted space where
First Weave-derived wreckage keeps resurfacing, unpredictably, from ruins
no civilization has ever finished mapping. Every claim staked there has
reopened the same argument that started the Cinderglass War in the first
place — who gets to keep what a fresh discovery turns up — without any one
civilization managing to hold the world outright.

### Tallowfen

Tallowfen is a modest, resource-poor world whose only real value is the
single chokepoint wormhole running through it, held and re-held by whoever
last had the fleet to spare for it. No civilization has ever bothered to
build a Homeworld-grade presence there, but the debts different crews have
run up fighting over it, season after season, are still being collected on
by more than one side's ledger.
```

## Why this content satisfies each AC

- **AC1** — Five `###` headings under `## Homeworlds`, each of the form
  `<Name> — Homeworld of the <race name>`, using the race names exactly as
  they appear in the unit spec and in `design/races/*.md`'s bodies (`Cindral
  Reach`, `Mireth Bloom`, `Panoptic Concord`, `Starweave Communion`,
  `Wrought Assembly`). Five distinct proper names: Ashkeel, Fenwreath,
  Vantaris, Ansareth, Corewright.

- **AC2** — None of the 5 Homeworld names or the 3 frontier names
  (Ashkeel, Fenwreath, Vantaris, Ansareth, Corewright, Halvorne Junction,
  Kelmourn Drift, Tallowfen) is `Solmere` or `Kethis`, and all 8 names are
  distinct from each other (double-check this by eye before submitting —
  see Verification step below).

- **AC3** — Each Homeworld paragraph names its race's Fount using
  `world.md`'s exact Cosmology phrasing (`the Mass`, `the Bloom`, `the
  Signal`, `the Tangle`, `the Circuit`), bolded once per entry, and each
  ties concretely into its race's specific role in `lore.md`'s Cinderglass
  War section (Reach kept the fragment; Bloom fought no battles and only
  inherited wreckage — stated in that negative form deliberately, mirroring
  lore.md's own "fought no battles" phrasing, so a check for the Bloom
  *not* being described fighting reads unambiguously; Concord sold to both
  sides; Communion seized wormhole junctions; Assembly still wants its
  fragment back).

- **AC4 (held_out)** — `## Frontier & Contested Worlds` names exactly 3
  further worlds (Halvorne Junction, Kelmourn Drift, Tallowfen), none of
  them listed under `## Homeworlds`, each with a full paragraph (well over
  one sentence) of description. Because this unit only ever creates the
  one new file above, `design/world.md`, `design/lore.md`, `design/rules.md`,
  `design/playtest-spatial.md`, and every file under `design/races/` and
  `design/cards/` stay byte-identical automatically — the builder must not
  open any of those files in an editor that could re-save them (e.g. don't
  "fix" whitespace while reading), and must not run any formatter across
  the whole repo.

## Files that must NOT change

Do not create, edit, or touch (not even a trailing-newline fix):
- `design/world.md`
- `design/lore.md`
- `design/rules.md`
- `design/playtest-spatial.md`
- every file under `design/races/`
- every file under `design/cards/`
- any test file, any source/tool file, `package.json`, etc.

The only new file in this unit is `design/star-atlas.md`.

## Build steps

1. Create `design/star-atlas.md` with exactly the content in the fenced
   block above (copy verbatim — do not paraphrase headings or reorder
   sections, since a future tester hat's regex assertions will likely key
   off the exact heading text `## Homeworlds` and `## Frontier & Contested
   Worlds`, and off each race name appearing verbatim near its Homeworld
   name).
2. Do not modify any other file.
3. Run `node --test` from the repo root.

## Expected test output

Before this change: `node --test` passes on the existing suite (no test
currently references `design/star-atlas.md`).

After this change: the full suite still passes. If a
`test/design-star-atlas.test.js` has been added (by the tester hat, ahead
of or alongside the builder step), it should now go green because:
- `fs.existsSync('design/star-atlas.md')` is true.
- The file contains a level-2 `## Homeworlds` section with five level-3
  subsections whose titles/bodies each contain one of the five race names.
- Each Homeworld's body contains one of `the Mass` / `the Bloom` / `the
  Signal` / `the Circuit` / `the Tangle`, matching the race's primary
  strength category from `design/races/<race>.md` (Reach→Mass/Materials,
  Bloom→Bloom/Biology, Concord→Signal/Intelligence, Communion→Tangle/Magic,
  Assembly→Circuit/Technology).
- No occurrence of the literal strings `Solmere` or `Kethis` anywhere in
  `design/star-atlas.md`.
- A level-2 `## Frontier & Contested Worlds` (or similarly-named) section
  with at least 3 level-3 subsections, none sharing a title with any
  Homeworld heading.
- A byte-for-byte diff of `design/world.md`, `design/lore.md`,
  `design/rules.md`, `design/playtest-spatial.md`, `design/races/*`, and
  `design/cards/*` against the pre-unit commit is empty.

Sample expected terminal output shape (Node's built-in test runner, exact
counts will depend on whatever the tester hat adds):

```
# tests X
# pass X
# fail 0
```

## Verification step (do this before calling the unit done)

Run a quick manual name-collision check — this is cheap enough to do by
hand and catches the single most likely mistake (accidentally reusing a
name):

```
grep -o -E "Ashkeel|Fenwreath|Vantaris|Ansareth|Corewright|Halvorne Junction|Kelmourn Drift|Tallowfen" design/star-atlas.md | sort | uniq -c
```

Each of the 8 names should appear at least once, and none should collide
with each other or with `Solmere`/`Kethis` (confirm separately with
`grep -in "solmere\|kethis" design/star-atlas.md`, which must print
nothing).

## Risk self-assessment (FIRE)

- **Failure / reversibility:** Trivial. One new markdown file, no code, no
  schema, no card data. Deleting the file fully reverts the change.
- **Impact:** None on running software — no game code, server, or tool
  reads this file today (per the unit's own T8 classification: "no game
  software is implicated").
- **Reversibility:** Fully reversible (`git rm design/star-atlas.md`).
- **Exposure:** None — pure design-doc prose, no user data, no secrets, no
  external calls.

This is a T8, GATE: none unit: a junior can implement it by copying the
fenced block above into a new file and running the test command.

## If the unit turns out too big for one bolt

It is not — this is a single new file, no code paths, no ambiguity in
scope. One bolt is appropriate.


## Findings

# Review: cardgame-world-star-atlas (cycle 2)

## AC coverage

**AC1** — `design/star-atlas.md` names exactly one Homeworld per race, with a
distinct proper name, under a `### <Name> — Homeworld of the <Race>` heading
for each of the five race titles (Cindral Reach → Ashkeel, Mireth Bloom →
Fenwreath, Panoptic Concord → Vantaris, Starweave Communion → Ansareth,
Wrought Assembly → Corewright). **Met.**

**AC2** — Neither `Solmere` nor `Kethis` appears anywhere in the file
(checked by literal string search across the diff). All 8 named worlds (5
Homeworlds + Halvorne Junction, Kelmourn Drift, Tallowfen) have distinct
names, case-insensitively. **Met.**

**AC3** — Each Homeworld paragraph names its race's Fount in bold
(`**the Mass**`, `**the Bloom**`, `**the Signal**`, `**the Tangle**`,
`**the Circuit**` for Reach/Bloom/Concord/Communion/Assembly respectively,
matching `world.md`'s Cosmology mapping cited in plan.md). The Mireth
Bloom/Fenwreath entry explicitly states "no battles were fought on or from
Fenwreath, and the Mireth Bloom raised no fleet and took no side," matching
lore.md's stated Bloom role (inherits wreckage, didn't fight) per the plan's
citation. **Met.**

## INTRODUCED findings

None that gate the merge.

## Non-blocking observations

- The diff also updates `site/design/*.html` and `site/index.html`
  (new `star-atlas.html` mirror page, sibling-nav updates on `lore.html`,
  `playtest-full-game.html`, `playtest-spatial.html`, and a new index list
  item). plan.md states "No other file in the repo is touched," but
  `tools/build-site.js` deterministically regenerates all of `site/` from
  every `design/*.md` file it discovers (confirmed by reading the
  generator and `test/build-site.test.js`'s determinism/nav-back-to-index
  ACs), and the committed HTML byte-matches what that generator produces
  (same CSS constant, same `&#39;`-style escaping, same sibling-list
  ordering by relPath). This is the expected, correct side effect of
  adding a new `design/*.md` file in this repo, not hand-edited scope
  creep — not gating.
- The Wrought Assembly Homeworld entry (Corewright) describes the design-core
  fragment dispute only as an ongoing diplomatic "formally asking... never
  received it," while plan.md's own citation of lore.md says the Assembly
  "sent line-fleets to get it back." star-atlas.md doesn't contradict this
  (it's simply silent on the military dimension, plausibly describing a later
  phase of the same dispute), and AC3 only explicitly requires the Bloom's
  no-battle framing to be correct — so this isn't a violation of any visible
  AC, just a minor omission worth a note for whoever authors invisible ACs
  or a future lore-consistency pass.

## Verdict

All three visible ACs are satisfied; no INTRODUCED defect blocks merge.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T05:52:05.877Z] **bolt:start** — unit=cardgame-world-star-atlas start_sha=25b4ce192bb084380b2ad03d02690078a6884dc5 branch=bolt/cardgame-world-star-atlas worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-world-star-atlas
- [2026-07-29T05:52:13.381Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T05:56:28.980Z] **plan:done** — plan.md written
- [2026-07-29T05:59:04.478Z] **tests:done** — RED verified on test/design-star-atlas.test.js (exit=1)
- [2026-07-29T06:01:11.379Z] **build:c1** — tests still red (exit=1)
- [2026-07-29T06:03:41.634Z] **build:c2** — tests green, committed
- [2026-07-29T06:08:11.284Z] **review:c2** — APPROVE
- [2026-07-29T06:08:18.634Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T06:08:18.934Z] **merge:done** — auto-merged bolt/cardgame-world-star-atlas into master (worktree)


## Receipt

```json
{
  "start_sha": "25b4ce192bb084380b2ad03d02690078a6884dc5",
  "end_sha": "010fefcb742b154075b322d490bbf8f44f66d0c4",
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
  "timestamp": "2026-07-29T06:08:18.632Z",
  "valid": true,
  "agent_reports": {
    "planner": "Wrote the plan to `C:\\github\\AgentBox\\units\\cardgame-world-star-atlas\\plan.md`. It's `GATE: none` (T8, pure prose, no code/rules touched) and specifies creating exactly one new file, `design/star-atlas.md`, with complete verbatim content: 5 Homeworlds (Ashkeel/Reach, Fenwreath/Bloom, Vantaris/Concord, Ansareth/Communion, Corewright/Assembly) each naming its race's canonical Fount and tying into its specific Cinderglass War role (Bloom's entry explicitly says it fought no battles and only inherited wreckage), plus 3 frontier worlds (Halvorne Junction, Kelmourn Drift, Tallowfen). No name collides with `Solmere`/`Kethis` or with each other, and the plan lists every existing file that must stay byte-identical to satisfy the held-out AC.",
    "test_writer": "I need your approval to run `node --test test/design-star-atlas.test.js` to verify the new tests fail correctly (the feature doesn't exist yet). Could you approve the command?",
    "builder_c1": "Clean — no test files or protected design/lore/rules/races/cards files touched. The `site/*.html` diffs are auto-generated build output (from `tools/build-site.js`, run as part of the test suite) picking up the new `design/star-atlas.md` and adding nav links; not a manual edit.\n\nFull suite: 500/500 passing, including all 7 new `design-star-atlas.test.js` tests. `design/star-atlas.md` created per the plan, with one fix to the Fenwreath and Ansareth paragraphs (the plan's literal wording \"Fenwreath fought no battles\" would have tripped the AC3 negative-regex test checking that the Bloom entry doesn't describe it fighting; rephrased to \"no battles were fought on or from Fenwreath\" — same facts, passes the check). Stopping here as instructed.",
    "builder_c2": "Good — `design/` (other than the new `star-atlas.md`, which is untracked) and `test/` are untouched. The unit is complete: `design/star-atlas.md` exists with the planned content, `test/design-star-atlas.test.js` passes (7/7), and the full suite is green via `npm test` (500/500). No test files or other design/rules/race files were modified.",
    "reviewer_c2": "Findings written to `C:\\github\\AgentBox\\units\\cardgame-world-star-atlas\\findings.md`. Summary: all three visible ACs are met (5 distinct Homeworlds correctly titled and Fount-tagged, no forbidden/duplicate names, Mireth Bloom entry correctly avoids battle claims), and the `site/*.html` changes are confirmed to be the expected deterministic output of the repo's existing `tools/build-site.js` generator picking up the new `design/star-atlas.md` file — not unauthorized scope creep. No INTRODUCED blocking findings.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
