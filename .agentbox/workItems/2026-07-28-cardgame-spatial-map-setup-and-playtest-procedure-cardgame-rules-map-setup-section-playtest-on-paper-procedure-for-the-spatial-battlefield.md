# cardgame-spatial-map-setup-and-playtest-procedure: cardGame rules — Map Setup section + playtest-on-paper procedure for the Spatial Battlefield

## Header

- unit: cardgame-spatial-map-setup-and-playtest-procedure
- title: cardGame rules — Map Setup section + playtest-on-paper procedure for the Spatial Battlefield
- project: cardgame
- completed: 2026-07-28
- outcome: merged
- start_sha: 54a01b9df6e3bd8b1791dca2a4c0578cce62a92a
- end_sha: 94ee1cc5c526b692665beee94a71260e4ae960c9

## Intent

design/ideas-inbox.md's spatial-layer directive (2026-07-26, verbatim: 'planets are nodes on a graph connected by wormholes of variable lengths. Generators are built on planets.') listed five implications to design through, including: 'Map setup is part of game setup (fixed maps? drafted maps? symmetric?) — needs a rules.md section and playtest-on-paper procedures.' The shipped cardgame-spatial-battlefield-rules unit delivered Section 8's graph mechanics (Planets, Wormholes, Discovery, Restrictions, Closure, Blockade & Capture, a worked example) at MTG-Comprehensive-Rules-level rigor (T9) but stopped short of this specific implication — there is no rule anywhere stating how a game's starting battlefield graph is assembled, and no playtest-on-paper walkthrough exists in the repo. T1 holds that MVP means the full decided scope, not the first working slice; this unit finishes the decided scope the spatial directive already named rather than letting the [incorporated] tag stand for partial delivery. This is pure rules-writing and a procedural document — no code, no game software — squarely inside the design phase (T8/T9) and I6.

## Acceptance Criteria

- AC1 [paraphrase]: design/rules.md contains a numbered '### 8.8 Map Setup' heading (or equivalent numbered subsection under Section 8) that explicitly states whether the starting map is fixed, drafted, or symmetric, and specifies the starting Planet count and their placement relative to each Homeworld.
- AC2 [paraphrase]: design/playtest-spatial.md exists and contains a numbered step-by-step procedure that two humans can follow with physical materials (e.g. a drawn graph, tokens, index cards) to set up and play a full game using the Spatial Battlefield rules.
- AC3 [inferred]: design/playtest-spatial.md's steps cite specific rules.md Section 8 subsection numbers (8.1 through 8.7, plus the new 8.8) at the points where each spatial mechanic first comes into play, so a playtester can cross-check any step against the exact rule text.
- AC4 [inferred] (held_out): The new 8.8 Map Setup section does not silently redefine any term already defined in Section 2's Glossary (per rules.md's own stated convention that later sections may repeat but not redefine a term).

## Plan

# Plan: cardgame-spatial-map-setup-and-playtest-procedure

GATE: none

Risk self-assessment (FIRE):
- **Reversibility:** Fully reversible. This unit modifies exactly one existing file (`design/rules.md`, one new `### 8.8` subsection appended after the existing `### 8.7` worked example, nothing else in that file touched) and creates exactly one new file (`design/playtest-spatial.md`). It also regenerates `site/` via the existing build script (see Verification) — that output is itself fully reproducible from the two source files by re-running `node tools/build-site.js`. Deleting the new file, reverting the `rules.md` hunk, and rebuilding the site fully undoes this unit.
- **Security impact:** None. Pure Markdown prose — no code, no scripts, no dependencies, no network/API calls, nothing executable.
- **User data:** None touched. No user input, no runtime data, no PII — this is a design document and a paper playtest script.
- **Schema changes:** None. No test files, tooling, or rendering logic are touched. `tools/build-site.js` is *run*, not edited — it already auto-discovers every `.md` file under `design/` (see `walkMarkdownFiles`/`discoverSourceFiles` in that file), so the new file needs no code change to be picked up.

Unit size: fits easily in one bolt. One new `### 8.8` subsection (a few short paragraphs) plus one new procedural document (a materials list and a numbered walkthrough) — no code, no wiring, no cross-cutting changes.

Held-out criteria check: AC4 (8.8 must not silently redefine a Section 2 Glossary term) is redundant with the visible intent, which already frames this unit as *closing a gap* in rules the shipped `cardgame-spatial-battlefield-rules` unit left implicit — not re-opening or contradicting anything that unit already defined. Section 2 states its own convention explicitly: "Later sections may repeat a term but will not silently redefine it." Section 8.1–8.7 already reuse bolded Glossary terms (Planet, Wormhole, Homeworld, Control) in restated-but-consistent form without tripping this rule, so precedent shows *reuse* is fine and only *contradiction* is the failure mode. No spec bug — plan accordingly by writing 8.8 so every fact it states about Homeworld/Planet/Wormhole/Discovery/Unexplored is a direct, non-contradicting restatement of what Sections 2, 8.1, and 8.2 already say (see exact wording below, and the "no new bold-definition" discipline noted in Design notes).

## Repo context (verified)

- Repo root for this worktree: `C:\github\.agentbox-worktrees\cardGame\cardgame-spatial-map-setup-and-playtest-procedure`, branch `bolt/cardgame-spatial-map-setup-and-playtest-procedure`.
- `design/rules.md` currently runs Sections 1–9. Section 8 ("Spatial Battlefield") has subsections `### 8.1 Planets & Wormholes` through `### 8.7 Worked Example: Discovery, Blockade, and Capture`, then the file moves straight to `## 9. Card Types & Templating`. There is no `8.8` yet, and no rule anywhere states whether the starting map is fixed, drafted, or symmetric, or how many Planets exist at game start.
- `design/playtest-spatial.md` does not exist yet. No test currently references it.
- Test helper `test/helpers/markdown.js` exports `parseSections`/`sectionText`/`findSection`, splitting on `#{1,6}` headings and collecting each section's raw body (including nested subsections) until a heading of equal-or-shallower level. `test/design-battlefield.test.js` already uses `sectionText(sections, /spatial battlefield/i)` to grab the *entire* Section 8 body (all subsections, `8.1`–`8.8` once this unit lands) for its own regex assertions — none of those existing assertions conflict with the new 8.8 text below (verified by reading every assertion in that file; they all look for facts already stated elsewhere in Section 8, matched with `.test()` OR-style regexes).
- `tools/build-site.js` discovers every `.md` file under `design/` recursively (`walkMarkdownFiles(DESIGN_DIR)`) and renders one `.html` per source into `site/`, wiping and rebuilding the whole `site/` directory each run (`fs.rmSync(SITE_DIR, {recursive:true, force:true})` then rebuild). `design/playtest-spatial.md` doesn't match any of the specific `sectionFor()` cases (`design/world.md`, `design/rules.md`, `design/races/`, `design/characters/`, `design/cards/`), so it falls into the generic `'Other'` section on the generated index page — that's expected and requires no code change. The repo's working tree already shows many `site/**/*.html` files as modified going into this unit (from a prior unit's own doc changes not yet rebuilt/committed) — this unit's job is only to add its own two source-file changes and rebuild; it should not try to "clean up" or hand-edit any `site/**/*.html` file directly.
- Test command: `node --test`, run from repo root, auto-discovering `test/*.test.js`. Per this repo's established workflow (visible in `git log`: a `test(...)` commit precedes each `feat(...)` builder commit), a separate stage writes the test file(s) checking AC1–AC4 against the two files this plan creates/edits — **this plan does not write a test file**, matching the precedent in `units/cardgame-alpha-set-art-briefs/plan.md`.

## Files to change (1 modified, 1 created)

### 1. Modify `design/rules.md` — append `### 8.8 Map Setup`

Insert a new subsection immediately after the existing `### 8.7 Worked Example: Discovery, Blockade, and Capture` section and immediately before `## 9. Card Types & Templating`. Use an exact-match edit: find this existing text (the tail of 8.7 plus the very next heading) and replace it with the same text plus the new subsection inserted between:

**Old text (must match exactly, currently the last paragraph of 8.7 followed directly by the Section 9 heading):**

```
This confirms, on paper, that a Planet's Generator can be pressured without
being destroyed (Blockade) and only lost outright through a second, further
Assault (Capture) — and that reaching an enemy Planet costs strictly more
Fount Points the farther the qualifying path runs, exactly as Section 8.6
states.

## 9. Card Types & Templating
```

**New text (replaces the above):**

```
This confirms, on paper, that a Planet's Generator can be pressured without
being destroyed (Blockade) and only lost outright through a second, further
Assault (Capture) — and that reaching an enemy Planet costs strictly more
Fount Points the farther the qualifying path runs, exactly as Section 8.6
states.

### 8.8 Map Setup

Map setup happens once, before either challenger's first turn, as part of
general game setup — alongside shuffling each Archive and determining who
takes the first turn — and fixes the entire starting battlefield graph
before a single card is played.

1. The starting map is fixed and symmetric, not drafted: every game played
   under this rulebook begins from the same starting graph, never one
   either challenger chooses, drafts, or assembles piece by piece before
   play begins.
2. Each challenger controls their own Homeworld from the start of the game
   and it can never change control (Section 8.2). The starting Planet
   count is exactly two: one Planet per challenger, that challenger's own
   Homeworld, and no others.
3. Each Homeworld's placement is simply itself: a Homeworld does not sit at
   any distance or direction from another Planet at setup, because no
   other Planet is on the graph yet to measure it against. Section 8.2
   already states the two Homeworlds are never adjacent at the start of
   the game; this subsection confirms why — no Wormhole, and no other
   Planet, is placed during map setup at all.
4. Every Planet besides the two Homeworlds begins the game Unexplored
   (Section 8.1): off the battlefield graph entirely, not named, numbered,
   or positioned during map setup. Each one joins the graph only later,
   one at a time, the moment some Discovery (Section 8.3) names it as a
   destination.

This is the same starting graph the worked example in Section 8.7 already
assumes; this subsection states it as a rule of general game setup rather
than leaving it implicit.

## 9. Card Types & Templating
```

Net effect: one new `### 8.8` subsection is added; nothing else in `design/rules.md` changes (Section 9 onward is untouched, just shifted down in the file — no renumbering needed since `## 9.` was already `9`).

### 2. Create `design/playtest-spatial.md`

Exact contents:

```markdown
# Spatial Battlefield Playtest Procedure (On Paper)

This is a step-by-step, on-paper procedure for two humans to set up and
play a full game under *design/rules.md*, using ordinary physical
materials instead of printed cards or a computer. It is written for two
playtesters, "A" and "B", sitting at the same table. Every step below
cites the exact rules.md section it is exercising, so either playtester
can stop at any point and cross-check the physical action just taken
against the rule text itself.

## Materials

- A large sheet of paper, poster board, or whiteboard space, to lay out
  the battlefield graph.
- Index cards or sticky notes, one per Planet as it enters the graph,
  each labeled with that Planet's name.
- Two sets of differently colored tokens, coins, or dice (one color per
  challenger), used to mark which challenger controls a Planet.
- A marker or pen, for drawing a line (Wormhole) between two Planet cards
  and writing that Wormhole's Length as a number on the line.
- Small blank stickers or scratch-paper markers, to flag a Planet as
  Blockaded or to flag a Wormhole as Closed or Restricted.
- Five small piles of counters (or a tally sheet), one pile per Fount
  (Mass, Bloom, Signal, Circuit, Tangle) per challenger, to track each
  challenger's five resource pools.
- Two shuffled decks of index cards, standing in for each challenger's
  Archive (or an actual prototype card set, if one is available), plus a
  discard area for each challenger's Wreck.
- A tally sheet or a d20 per challenger, to track Core Integrity.

## Procedure

1. **Lay out the two starting Planets.** Before either challenger looks
   at a card, place two Planet index cards on the table a few inches
   apart: one per challenger, each labeled with that challenger's
   Homeworld's name. Put that challenger's own token on their own
   Homeworld card. A Planet is a node in the battlefield graph, and this
   pair of cards is how this playtest physically represents that graph
   (Section 8.1).

2. **Confirm the starting graph matches Map Setup.** Each challenger
   controls their own Homeworld from the start of the game and it can
   never change control (Section 8.2); the two Homeworlds are never
   adjacent at the start of the game, which is why no line connects them
   yet. Check that exactly these two cards are on the table, no others,
   and that no line connects them — this is the whole starting graph:
   fixed and symmetric, exactly one Planet per challenger, and nothing
   else (Section 8.8).

3. **Finish ordinary game setup.** Each challenger shuffles their
   Archive, draws an opening hand, and the group determines who takes
   the first turn, exactly as Sections 1 and 3 describe; none of this is
   spatial-layer-specific, so it isn't re-detailed here.

4. **Play turns in the normal five-phase order** (Dawn, Generation,
   Main, Conflict, Dusk — Section 5), tracking Fount Point counters
   during each Generation Phase and Core Integrity as combat damage
   lands, until a spatial action becomes available, picked up at step 5.

5. **Build the first Generator on a Homeworld.** The first time each
   challenger plays a Generator, place a small "Generator" marker on
   their own Homeworld card, not anywhere else — a challenger's first
   Generator MUST be built on their Homeworld.

6. **Take a Discovery action.** On a later Main Phase, once the Queue is
   empty and it is the active player's priority, that challenger MAY
   take one Discovery action (Section 8.3):
   a. Point to a Planet card they control as the origin (at first, this
      can only be their own Homeworld).
   b. Decide the kind of Discovery: a **Frontier Discovery**, whose
      destination is a brand-new index card not yet on the table
      (Unexplored, Section 8.1); or a **Contested Discovery**, whose
      destination is a Planet card already on the table that this
      challenger does not control.
   c. Write any positive integer as the new Wormhole's Length on a line
      connecting the origin and destination cards.
   d. Pay Fount Point counters from the active player's resource pools:
      Length counters for a Frontier Discovery, or double that for a
      Contested Discovery.
   e. Place the destination card on the table if it wasn't already
      there. A Frontier destination starts Neutral — no token on it
      (Section 8.1) — Discovery alone never grants control.
   Run this step on at least two separate turns, for each challenger,
   until each side has performed at least one Frontier Discovery and at
   least one Contested Discovery, so both costs get exercised on paper.

7. **Build a second Generator on a newly Discovered Planet.** On a Main
   Phase after Discovering a Planet, a challenger MAY build a Generator
   there. Place its "Generator" marker and that challenger's control
   token on the card the moment the Generator is played — control passes
   to whichever challenger most recently built a Generator on a Planet,
   or Captured it (Section 8.1).

8. **Add a Restriction to a Wormhole.** Pick any drawn line on the table
   and write "one-way: [origin]→[destination]" on it, narrating that
   some card or effect just granted it a Directional Restriction
   (Section 8.4) — this rulebook has no default action that grants one,
   so for this playtest simply declare which card would. Confirm aloud
   that a Wormhole with no such note may still be traversed either way,
   since no-Restriction is the default.

9. **Close a Wormhole.** Pick a different drawn line, cross it out
   fully, and note that the two Planets it connected are no longer
   adjacent unless some other, un-Closed line also connects them
   (Section 8.5). Confirm aloud that this line MAY NOT be redrawn —
   reconnecting those same two Planets later would require paying for a
   brand-new Discovery action from scratch.

10. **Take an Assault action.** Once a challenger has a qualifying path
    — running only along un-crossed-out lines that carry no Restriction
    forbidding this challenger or this direction — from a Planet they
    control to a Planet they do not control, that challenger MAY take
    one Assault action on their Main Phase, under the same
    Queue-empty/priority timing as Discovery (Section 8.6):
    a. Trace the chosen path with a finger, out loud, planet by planet.
    b. Add up the Length written on every line along that path, and pay
       that many Fount Point counters.
    c. Choose **Blockade** — stick a "Blockaded" sticker on the target
       card; from the target's controller's next Generation Phase on,
       its Generator marker stops earning counters until its controller
       later pays that same amount again on their own Main Phase,
       removing the sticker — or, if the target is already Blockaded by
       this same challenger, choose **Capture** instead — flip the
       target's control token to the assaulting challenger's color,
       remove the "Blockaded" sticker, and move the Generator marker off
       the card into its owner's Wreck pile, since it is destroyed.
    A Homeworld card MAY be Blockaded this way but its control token MAY
    NEVER be flipped by a Capture.

11. **Replay Section 8.7's worked example once, on this same table.**
    Using the graph already on the table (or resetting to just the two
    Homeworlds if preferred), walk through Section 8.7's four numbered
    steps move for move — a Frontier Discovery to a new Planet, a
    Generator built there, an Assault that Blockades it, and a second
    Assault that Captures it — checking each physical action here
    against that worked example's text before moving to the next.

12. **Play to a conclusion.** Keep alternating turns (Section 5), taking
    further Discovery and Assault actions as the graph and each side's
    Fount Point income allow, until either challenger's Core Integrity
    tally reaches 0, or a challenger must draw from an empty Archive and
    cannot (Section 1) — either ends the game.

## What to watch for while playtesting

- After step 2, is the starting graph really just two cards with no line
  between them, for every game, every time? If a playtester's instinct
  is to add a third starting Planet or draw a starting connection,
  that's a signal Section 8.8's Map Setup rule isn't landing as written.
- After step 6, does a Contested Discovery visibly cost double a
  Frontier Discovery of the same Length, on the actual counters paid?
  That's the "aggression costs more" toll Section 8.3 states.
- After step 10, does the Blockaded Generator's marker visibly stop
  earning counters at the very next Generation Phase, and does Capture
  visibly move it to the Wreck rather than just crossing it out? Those
  are two different states (Blockade vs. Capture) and the physical
  materials should make the difference obvious at a glance.
```

## Design notes (so the junior doesn't improvise)

- Reproduce both blocks exactly. In `design/rules.md`, only insert the new `### 8.8` subsection between the existing 8.7 paragraph and the `## 9.` heading — do not touch, reword, or reflow anything else in the file, and do not renumber any existing section or subsection.
- In the new 8.8 text: do **not** introduce a new bolded "`**Term** — definition`"-style entry for any term Section 2's Glossary already defines (Planet, Wormhole, Homeworld, Discovery, Control, Length, Restriction, Closure, Assault, Blockade, Capture). The draft above only ever restates facts about those terms that Sections 2, 8.1, and 8.2 already state (Homeworld count/control, never-adjacent-at-start, Unexplored meaning) — it never gives any of them a new or conflicting meaning. Keep it that way; this is what the held-out AC4 checks.
- In `design/playtest-spatial.md`: keep the exact heading structure (`# Spatial Battlefield Playtest Procedure (On Paper)`, `## Materials`, `## Procedure`, `## What to watch for while playtesting`) and keep the `Procedure` list as a single top-level numbered list, 1 through 12, with lettered sub-steps only inside steps 6 and 10 — a future test will very likely parse this file for a numbered-step-by-step structure and for literal citation substrings `Section 8.1` through `Section 8.8`; do not renumber, merge, split, or reorder the steps, and do not drop or reword any `(Section 8.x)` citation.
- Every one of Section 8's eight subsections (8.1 through 8.8) is cited by exact substring at least once in `playtest-spatial.md`, at the point that mechanic is first physically exercised: 8.1 (step 1, and again for Unexplored/Control in steps 6 and 7), 8.2 (step 2, twice), 8.3 (step 6, and again in step 11), 8.4 (step 8), 8.5 (step 9), 8.6 (step 10), 8.7 (step 11), 8.8 (step 2). Preserve all of these — this is exactly what AC3 checks.
- Do not create any test file. Per this repo's established workflow (see `git log` and the precedent in `units/cardgame-alpha-set-art-briefs/plan.md`), a separate stage writes `test/design-*.test.js` assertions over these two files directly from AC1–AC4; building the files to match the AC → content mapping below should make that future test pass without further edits to either file.
- Do not touch `design/ideas-inbox.md` — the directive it records stays as historical log entry; this unit fulfills one of its five listed implications, it doesn't need to be marked or edited there (the unit intent already treats the "[incorporated]" tag on the *battlefield-rules* entry as accounting for this follow-on unit, not something this unit needs to touch).
- Do not hand-edit anything under `site/`; only regenerate it via the build script (see Verification).

## AC → content mapping

| AC | Covered by |
|---|---|
| AC1: `### 8.8 Map Setup` states fixed/drafted/symmetric, starting Planet count, and placement relative to each Homeworld | New `design/rules.md` §8.8, numbered points 1 (fixed/symmetric/not-drafted), 2 (exactly two Planets, one per challenger's Homeworld), 3 (placement — each Homeworld's placement is itself, no other Planet exists yet to be relative to) |
| AC2: `design/playtest-spatial.md` exists with a numbered step-by-step procedure usable with physical materials | The `## Materials` list + the 12-step `## Procedure` list in the new file |
| AC3 (inferred): playtest steps cite rules.md §8.1–8.8 at first use | Citations embedded in steps 1 (8.1), 2 (8.2, 8.8), 6 (8.3), 8 (8.4), 9 (8.5), 10 (8.6), 11 (8.7) |
| AC4 (held_out): §8.8 doesn't redefine a Section 2 Glossary term | §8.8's text only restates facts Sections 2/8.1/8.2 already establish (Homeworld control/adjacency, Unexplored meaning) — no new or conflicting bolded definitions; see Design notes |

## Verification

Run from repo root (`C:\github\.agentbox-worktrees\cardGame\cardgame-spatial-map-setup-and-playtest-procedure`):

```
node tools/build-site.js
```

Expected output: `Built N pages into site/` where `N` is one greater than the previous run's count (the new `design/playtest-spatial.md` adds exactly one page, `site/design/playtest-spatial.html`, listed under the "Other" section of `site/index.html`). Exit code 0.

```
node --test
```

Expected output: every existing test file still passes (same pass count as before this unit, since `design/rules.md`'s only change is an additive subsection that no existing assertion in `test/design-rules.test.js` or `test/design-battlefield.test.js` contradicts — verified by reading every assertion in both files against the exact 8.8 text above) plus whichever new test file a later stage adds for AC1–AC4, all green, process exit code 0.

Observable/manual check (sanity, not required for the test command to pass):

```
node -e "const fs=require('fs'); const c=fs.readFileSync('design/rules.md','utf8'); console.log(/### 8\.8 Map Setup/.test(c));"
```

Expected output: `true`.

```
node -e "const fs=require('fs'); const c=fs.readFileSync('design/playtest-spatial.md','utf8'); for (let i=1;i<=8;i++) console.log('8.'+i, c.includes('Section 8.'+i));"
```

Expected output: `8.1 true` through `8.8 true`, one line each.

## Out of scope — do NOT do

- Do not renumber, reword, or otherwise touch any existing section or subsection of `design/rules.md` besides appending the new `### 8.8`.
- Do not create a test file.
- Do not touch `design/ideas-inbox.md`, `design/world.md`, `design/cards/**`, `design/characters/**`, or `design/races/**`.
- Do not hand-edit any file under `site/` — only regenerate it by running `node tools/build-site.js`.
- Do not modify `tools/build-site.js`, `tools/render-card.js`, or any file under `test/`.
- Do not add a rules mechanic beyond what §8.8 states (e.g. do not invent a drafting mini-game, a fixed extra neutral Planet, or any new Wormhole default) — the decision this unit makes is deliberately the simplest one consistent with the already-shipped Section 8.7 worked example: fixed, symmetric, two Homeworlds, nothing else at start.


## Findings

# Blind Review: cardgame-spatial-map-setup-and-playtest-procedure (cycle 2)

## Cycle 1 finding — verified fixed

Cycle 1 flagged an INTRODUCED self-contradiction in `### 8.8 Map Setup` point 3:
the old text justified a Homeworld's lack of placement by saying "no other Planet
is on the graph yet," which directly contradicted point 2's "the starting Planet
count is exactly two" (i.e. both Homeworlds *are* on the graph at setup).

The shipped diff now reads:

> 3. Each Homeworld's placement relative to the other Homeworld is simply
>    unconnected: map setup draws no Wormhole between them, so no adjacency
>    or path connects the two nodes and no distance or direction can be
>    measured across (Section 8.2, which already states the two Homeworlds
>    are never adjacent at the start of the game). No other Wormhole is
>    drawn during map setup either.

This grounds the "no placement" claim in connectivity (no Wormhole/edge between
the two Homeworld nodes) rather than in graph membership, and explicitly cites
Section 8.2 — consistent with point 2 (both Homeworlds exist on the graph) and
with 8.2's pre-existing adjacency rule. No contradiction remains. Confirmed
fixed.

## AC coverage

- **AC1** (`### 8.8 Map Setup` states fixed/drafted/symmetric, starting Planet
  count, placement relative to each Homeworld) — satisfied. Inserted correctly
  between `8.7` and `## 9.` (verified by diff context and the `idx87 < idx88 <
  idx9` ordering test). States the map is "fixed and symmetric, not drafted,"
  the starting count is "exactly two," and (per above) gives a non-contradictory
  connectivity-based account of Homeworld placement.
- **AC2** (`design/playtest-spatial.md` numbered step-by-step procedure, two
  humans, physical materials, full game) — satisfied. New file has a Materials
  list (index cards, tokens, counters, paper, dice) and a strictly sequential
  1–12 numbered Procedure (verified no gaps/repeats) covering setup through
  Discovery, Generator building, Restriction, Closure, Assault
  (Blockade/Capture), and play-to-conclusion — for two named playtesters ("A"
  and "B").
- **AC3** (playtest cites rules.md 8.1–8.8 at point of first use) — satisfied.
  Section 8.1 through 8.8 are all cited, each at (or before) the step
  introducing that mechanic: 8.1 (step 1, reused for Unexplored/control), 8.2 +
  8.8 (step 2), 8.3 (step 6, Discovery), 8.4 (step 8, Restriction), 8.5 (step 9,
  Closure), 8.6 (step 10, Assault), 8.7 (step 11, replay). All correspond to
  real `rules.md` headings (confirmed by the round-trip `findSection` test for
  8.1–8.8). One minor gap noted below.

## Findings

### INTRODUCED (minor, non-blocking) — Step 5 asserts a spatial rule with no Section 8.x citation

**File:** `design/playtest-spatial.md`, Procedure step 5 ("Build the first
Generator on a Homeworld").

Every other step that states a new spatial-mechanic fact cites the rules.md
subsection it comes from — that's the whole cross-checking premise the intro
paragraph promises ("Every step below cites the exact rules.md section it is
exercising, so either playtester can stop at any point and cross-check the
physical action just taken against the rule text itself"). Step 5 is the one
exception: it asserts "a challenger's first Generator MUST be built on their
Homeworld" with no `(Section 8.x)` pointer. The fact follows from 8.8 point 2
(at setup, a challenger controls exactly one Planet — their Homeworld — so
their first Generator has nowhere else to go), but that citation isn't given.

**Failure scenario:** A playtester at step 5 wants to verify the "MUST be built
on their Homeworld" claim the way they can for every other step (e.g. step 8's
Restriction claim, step 9's Closure claim) and finds no section to flip to —
the one gap in an otherwise fully cross-referenced procedure.

This doesn't fail either automated test (the AC3 tests only require citations
8.1–8.8 to appear somewhere in the file, which they do) and doesn't contradict
any rule. Recommend adding `(Section 8.8)` to step 5 opportunistically; not
severe enough to block this cycle.

## Non-gating observations

- `site/**/*.html` regeneration is mechanically consistent with the two
  source-file changes (new page linked from `index.html` and `lore.html`'s
  sibling nav; rendered content matches the markdown sources). The renderer
  splits each wrapped list item across a single-item `<ol>`/`<ul>` plus a
  stray `<p>` for continuation lines — a pre-existing quirk of
  `tools/build-site.js` (untouched by this diff), applying uniformly to old
  and new content. No visible AC governs generated site HTML. PRE-EXISTING,
  not this unit's responsibility.
- Cross-checked the new 8.8 text and playtest procedure against Sections
  8.1–8.7 and the Glossary (Section 2) for other contradictions: none found
  beyond the already-fixed cycle 1 item.

## Verdict

Cycle 1's sole INTRODUCED finding is fixed and verified. One new minor,
non-blocking INTRODUCED gap noted (a single missing citation in step 5) — it
doesn't fail a test, contradict a rule, or confuse a playtester about what to
do, only about which rule to cross-check against. All three visible ACs are
satisfied by both the shipped prose and its test suite.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T11:25:46.188Z] **bolt:start** — unit=cardgame-spatial-map-setup-and-playtest-procedure start_sha=54a01b9df6e3bd8b1791dca2a4c0578cce62a92a branch=bolt/cardgame-spatial-map-setup-and-playtest-procedure worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-spatial-map-setup-and-playtest-procedure
- [2026-07-28T11:25:53.095Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T11:33:47.008Z] **plan:done** — plan.md written
- [2026-07-28T11:36:59.395Z] **tests:done** — RED verified on test/design-map-setup-playtest.test.js (exit=1)
- [2026-07-28T11:40:03.420Z] **build:c1** — tests green, committed
- [2026-07-28T11:45:49.835Z] **review:c1** — NEEDS_WORK
- [2026-07-28T11:49:02.223Z] **build:c2** — tests green, committed
- [2026-07-28T11:53:02.778Z] **review:c2** — APPROVE
- [2026-07-28T11:53:06.849Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-28T11:53:07.141Z] **merge:done** — auto-merged bolt/cardgame-spatial-map-setup-and-playtest-procedure into master (worktree)


## Receipt

```json
{
  "start_sha": "54a01b9df6e3bd8b1791dca2a4c0578cce62a92a",
  "end_sha": "b75be8b16e1f8214208a3418c89c017130a7baa0",
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
  "timestamp": "2026-07-28T11:53:06.847Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-spatial-map-setup-and-playtest-procedure\\plan.md`.\n\nSummary: **GATE: none** (pure Markdown, fully reversible, no code/security/data/schema impact). The plan has a junior implement two changes:\n\n1. **`design/rules.md`** — append a new `### 8.8 Map Setup` subsection after the existing 8.7 worked example, stating the starting map is fixed/symmetric/not-drafted, exactly two Planets (each challenger's own Homeworld), and no other Planet placed at setup — written to restate, never redefine, Section 2's Glossary terms (satisfies the held-out AC4).\n2. **`design/playtest-spatial.md`** (new) — a materials list plus a 12-step numbered procedure for two humans to physically set up and play a full game, citing rules.md §8.1 through §8.8 at each mechanic's first use (satisfies AC3), including a step that replays §8.7's own worked example move-for-move.\n\nVerification runs `node tools/build-site.js` (regenerates the site, +1 page) then `node --test`. No test file is written by this plan — per repo precedent, that's a separate stage.",
    "test_writer": "I've verified through manual code tracing (since test execution is gated by approval in this harness — the harness runs its own RED check after this stage) that the test file is syntactically consistent with `test/helpers/markdown.js`'s API and matches the plan's exact drafted content for both `design/rules.md` §8.8 and `design/playtest-spatial.md`. Since neither the `8.8` heading nor the `playtest-spatial.md` file exist yet in this worktree (confirmed via `grep`/`ls`), all tests will fail now (RED) as required.\n\nSummary of `test/design-map-setup-playtest.test.js`:\n- **AC1** (5 tests): confirms `### 8.8 Map Setup` heading exists, states fixed/symmetric/not-drafted, states exactly two starting Planets, states Homeworld-relative placement, and sits correctly between 8.7 and Section 9.\n- **AC2** (4 tests): confirms `design/playtest-spatial.md` exists, references physical materials for two humans, contains a strictly sequential numbered procedure (≥5 steps), and covers Generators/Discovery/Assault mechanics.\n- **AC3** (9 tests): confirms citations of `Section 8.1` through `Section 8.8` each appear in the playtest doc, and that those subsection numbers correspond to real headings in `rules.md`.\n\nNo files under `src/` were touched — only the new test file was added.",
    "builder_c1": "All 18 targeted tests plus the full suite (336/336) pass. Changes match the plan exactly: `design/rules.md` gained `### 8.8 Map Setup`, `design/playtest-spatial.md` was created, and `site/` was regenerated via the build script. No files under `test/` were touched.",
    "reviewer_c1": "Findings written to `findings.md`. Summary: AC1, AC2, and AC3 are all substantively covered by the diff — the new `### 8.8 Map Setup` subsection, `design/playtest-spatial.md`'s 12-step procedure, and its Section 8.1–8.8 citations all check out structurally and cross-reference correctly against the pre-existing rules. One INTRODUCED defect: 8.8 point 3 justifies a Homeworld's lack of \"placement\" by claiming \"no other Planet is on the graph yet,\" which directly contradicts point 2's own statement that exactly two Planets (both Homeworlds) are on the starting graph — a self-contradiction inside newly-authored text, in a document explicitly held to MTG-Comprehensive-Rules-level rigor.\n\nNEEDS_WORK",
    "builder_c2": "Fixed the reviewer's finding: `design/rules.md` §8.8 point 3 now grounds the Homeworld non-placement claim in graph connectivity (no Wormhole between the two Homeworlds, per Section 8.2) instead of the self-contradictory \"no other Planet is on the graph yet\" claim, which conflicted with point 2's \"exactly two Planets\" count. Rebuilt `site/`, ran `node --test` — all 336 tests pass, no `test/` files touched, and the fix is committed.",
    "reviewer_c2": "Cycle 1's flagged contradiction in 8.8 point 3 is fixed and verified in this diff. All three visible ACs (AC1–AC3) are satisfied by both the shipped prose and its test suite. One new minor, non-blocking gap noted: playtest step 5 asserts a spatial rule (\"first Generator MUST be built on Homeworld\") without a Section 8.x citation, unlike every other step — doesn't fail tests or contradict any rule.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
