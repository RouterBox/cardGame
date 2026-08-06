# cardgame-keyword-abilities-rules: Keyword Abilities Rules (Amaranth Expanse rules — evergreen combat/utility keywords)

## Header

- unit: cardgame-keyword-abilities-rules
- title: Keyword Abilities Rules (Amaranth Expanse rules — evergreen combat/utility keywords)
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: 25b4ce192bb084380b2ad03d02690078a6884dc5
- end_sha: 895b69404351e532741ad528a96e16637ec25a04

## Intent

design/rules.md's 13 existing sections define every core system of the game (turns, resources, priority/timing, spatial battlefield, card types, winning/losing, deck construction, combat, targeting), each written to the MTG Comprehensive Rules structural bar named in T9 — numbered subsections, glossary-first vocabulary defined in Section 2 before substantive use, and at least one worked example per major chapter (Section 7, 8.7, 10.3, 12.5, 13.3 all follow this pattern). One CR-shape chapter is conspicuously absent: Keyword Abilities. Every card printed so far (alpha-set.md, frontier-set.md, character-signatures.md) spells its effect out in full sentences because no named, reusable rules-text shorthand exists. This unit adds a new numbered section defining at least 5 keyword abilities, one bound to each Fount's already-established identity from world.md and the race files, following the same glossary-first, worked-example discipline as every other rules.md chapter. It adds vocabulary only — no existing card file is touched, and no card is retextualized to use a new keyword (that is left as a follow-on unit); this is pure design/rules text, no game software (T8).

## Acceptance Criteria

- AC1 [inferred]: design/rules.md gains a new numbered section (e.g. 'Keyword Abilities') defining at least 5 distinct named keyword abilities, each explicitly tied to exactly one of the five Founts (Mass, Bloom, Signal, Circuit, Tangle) and consistent with that Fount's identity as established in design/world.md and the corresponding race file.
- AC2 [inferred]: Each keyword ability has its own numbered subsection stating its full rules-text meaning precisely enough that a future card could invoke the keyword by name alone with no further explanation needed.
- AC3 [paraphrase]: Each new keyword's name is added to the Section 2 glossary before its substantive use later in the document, consistent with rules.md's existing glossary-first discipline already followed by every prior section.
- AC4 [paraphrase]: The new section includes at least one numbered worked example applying one or more of the new keywords to a concrete hypothetical game state, matching the same worked-example rigor used by Section 7, 8.7, 10.3, 12.5, and 13.3.
- AC5 [inferred] (held_out): design/cards/alpha-set.md, frontier-set.md, and character-signatures.md are byte-identical to before this unit — no existing card's rules text is rewritten to use a new keyword, and no other rules.md section is altered besides the new section and its Section 2 glossary additions.

## Plan

GATE: none

# Plan: cardgame-keyword-abilities-rules

## Summary

Add a new numbered chapter, "14. Keyword Abilities", to `design/rules.md`,
defining 5 named keyword abilities — one per Fount — each in its own
numbered subsection (14.1-14.5), plus a numbered worked example (14.6).
Add the 5 keyword names (plus the generic "Keyword ability" term) to the
Section 2 glossary, inserted before Section 3, so the glossary-first
discipline holds. No other section of `rules.md` is touched, and no file
under `design/cards/` is touched.

One additional, mechanical fix is required to keep `node --test` green:
`test/design-targeting.test.js` currently asserts the *exact, full* list of
top-level section titles in `rules.md` (1 through 13) via
`assert.deepStrictEqual(titles, EXPECTED_TOP_LEVEL_TITLES, ...)`. Adding
Section 14 will make `titles` have 14 entries, so that exact-equality
assertion will start failing the instant Section 14 exists — not because
anything about Section 14 is wrong, but because that test was written
before Section 14 existed. This is the same problem `test/design-combat.test.js`
already hit and fixed (see its comment: "amended by cardgame-targeting-rules
recovery: later units append further ... sections"). Apply the identical
fix — a prefix/slice comparison instead of a full-array comparison — to
`test/design-targeting.test.js`. This is not scope creep: without it, the
pre-existing suite regresses through no fault of the new content, and the
same fix was already precedented one unit ago.

Two files change:
1. `design/rules.md` — content addition only (append-only; one glossary
   insertion point).
2. `test/design-targeting.test.js` — one assertion changed from exact-array
   to prefix-array, matching the pattern already used in
   `test/design-combat.test.js`.

`design/cards/alpha-set.md`, `design/cards/frontier-set.md`, and
`design/cards/character-signatures.md` are not touched at all (AC5).

## Why these 5 keywords

Each keyword is chosen to match its Fount's identity as stated in
`design/world.md` and its bound race file in `design/races/`, and each is a
genuinely reusable evergreen combat/utility keyword distinct from that
Fount's existing Section 4 resource mechanic (so it adds vocabulary, not a
restatement):

| Keyword | Fount | Race file | Identity link |
|---|---|---|---|
| Bulwark X | Mass | cindral-reach.md | matter bent to endure; hulls that shrug off harm |
| Regenerate | Bloom | mireth-bloom.md | answers threats by mutating past them, not enduring them |
| Foresee X | Signal | panoptic-concord.md | knowing what comes next before it happens |
| Swarm | Circuit | wrought-assembly.md | one idea copied without end, stronger the more it has replicated |
| Paradox | Tangle | starweave-communion.md | negotiates with cause and effect rather than obeying it |

None of these restate an existing Section 4 mechanic: Bulwark is a static
damage-prevention effect (Section 4.1's Fortification counters are a
separate, counter-based, Mass-Point-spending mechanic); Regenerate is a
once-per-turn damage-shedding effect distinct from Section 4.2's
once-per-*game* Growth-counter revival; Foresee is a free enters-the-Field
trigger distinct from Section 4.3's pay-per-use Signal Point mechanic;
Swarm is a static combat-strength scaler distinct from Section 4.4's
pay-Circuit-Points-to-copy mechanic; Paradox changes whether attacking
causes a Unit to become Spent, which Section 4.5 (Tangle Queue-reordering)
never touches.

---

## File 1: `design/rules.md`

### Edit 1a — Glossary additions (Section 2)

Location: insert immediately **after** the existing `**Stats/counters
line**` bullet (the last bullet in Section 2, ending `...the permanent
enters play with.`) and **before** the blank line that precedes the `## 3.
Zones` heading.

Today that's right after this exact text (do not change it, just anchor
on it):

```
- **Stats/counters line** — the optional field of a Permanent's printed
  template (Section 9.1) stating a Unit's combat strength or any counters
  the permanent enters play with.
```

Insert this block right after it (before the blank line / `## 3. Zones`):

```
- **Keyword ability** — a single named word or short phrase that a card's
  rules text may use in place of writing out its effect in full sentences;
  each keyword ability is defined exactly once, in Section 14, and using
  its name on a card means precisely what that definition states, no more
  and no less.
- **Bulwark** — a keyword ability, defined in Section 14.1, that prevents
  a fixed amount of damage a permanent would otherwise take from a single
  source, once per turn.
- **Regenerate** — a keyword ability, defined in Section 14.2, that lets a
  Unit shed lethal damage instead of being destroyed by it, once per turn.
- **Foresee** — a keyword ability, defined in Section 14.3, that lets a
  permanent's controller look at and reorder cards from the top of their
  Archive as that permanent enters the Field.
- **Swarm** — a keyword ability, defined in Section 14.4, that increases a
  Unit's combat strength for each other permanent sharing its printed Name
  that its controller controls.
- **Paradox** — a keyword ability, defined in Section 14.5, that lets a
  Unit attack without becoming Spent.
```

Nothing else in Section 2 changes. Every other existing bullet, in its
current order, stays exactly as-is.

### Edit 1b — New Section 14 (append at end of file)

Location: append at the very end of `design/rules.md`, immediately after
the last line of the current file (which today ends with Section 13.3's
closing paragraph, "...resolving against nothing or letting its controller
retarget it (Section 13.2)."). Add one blank line, then the new section.
Sections 1-13 are not renumbered, reworded, or reordered in any way.

Append exactly this:

```
## 14. Keyword Abilities

Every card printed so far in *design/cards/* spells its rules text out in
full sentences, because until now this rulebook has defined no named,
reusable shorthand a card could invoke instead. This section closes that
gap: it defines five **keyword abilities** (Section 2), one bound to each
of the five Founts (Section 4) and consistent with that Fount's identity
in *design/world.md* and its corresponding civilization in
*design/races/*. A keyword ability's name, printed on a future card's
rules text, means exactly what this section states for it — nothing more,
nothing assumed. Nothing in this section changes or restates any rule
already stated in Sections 1-13; where a rule already exists, this section
cross-references it by section number instead. This section adds
vocabulary only: no card in *design/cards/alpha-set.md*,
*frontier-set.md*, or *character-signatures.md* is retextualized to use a
keyword defined here.

### 14.1 Bulwark X — the Mass

**Bulwark X** is a keyword ability a permanent may have, printed with a
number in place of X. The first time each turn a permanent with Bulwark X
would be dealt damage from a single source, prevent X of that damage
instead of marking it (Section 2's Damage); any damage beyond X from that
same source is marked as normal. Bulwark X triggers at most once per turn,
on the first qualifying instance of damage that turn, regardless of how
many further sources deal damage to the permanent afterward. Bulwark
reflects the Mass's identity (*design/world.md*,
*design/races/cindral-reach.md*): matter bent to endure, armor that
shrugs off harm rather than avoiding it.

### 14.2 Regenerate — the Bloom

**Regenerate** is a keyword ability a Unit may have. The first time each
turn a Unit with Regenerate would be destroyed by damage (Section 12.3),
instead remove all damage marked against it; it is not destroyed and
remains on the Field. Regenerate does not prevent destruction by any
effect that destroys a permanent without reference to damage, and it
applies at most once per turn — a Unit with Regenerate that would be
destroyed by damage a second time in the same turn is destroyed as
normal. Regenerate reflects the Bloom's identity (*design/world.md*,
*design/races/mireth-bloom.md*): a civilization that answers threats by
mutating past them rather than enduring them outright.

### 14.3 Foresee X — the Signal

**Foresee X** is a keyword ability a permanent may have, printed with a
number in place of X. When a permanent with Foresee X enters the Field,
its controller looks at the top X cards of their own Archive, then puts
them back on top of their Archive in any order of their choosing. Foresee
X triggers only as the permanent enters the Field, not again for as long
as it remains on the Field, unless a future card or effect explicitly
grants it again. Foresee reflects the Signal's identity (*design/world.md*,
*design/races/panoptic-concord.md*): knowing what comes next before it
happens, and arranging accordingly.

### 14.4 Swarm — the Circuit

**Swarm** is a keyword ability a Unit may have. A Unit with Swarm gets +1
to its combat strength for each other permanent its controller controls
that shares its printed Name (Section 9.1), recalculated continuously as
permanents sharing that Name enter or leave the Field. Swarm reflects the
Circuit's identity (*design/world.md*,
*design/races/wrought-assembly.md*): one working idea, copied without
end, growing stronger the more of itself it has already made.

### 14.5 Paradox — the Tangle

**Paradox** is a keyword ability a Unit may have. A Unit with Paradox does
not become Spent when it is declared as an attacker (Section 5.4); it
remains Ready. Paradox has no effect on a Unit being declared as a
blocker, and does not prevent the Unit from becoming Spent by any other
stated cost. Paradox reflects the Tangle's identity (*design/world.md*,
*design/races/starweave-communion.md*): a civilization that negotiates
with cause and effect rather than obeying it, here breaking the ordinary
link between attacking and becoming Spent (Section 2's Spent).

### 14.6 Worked Example: Three Keywords in One Conflict Phase

This example follows one Conflict Phase (Section 5.4) between Reva
(active player) and Toma (non-active player). Reva controls Cinder
Warden, a Materials Unit with combat strength 3 and Bulwark 2, and Signal
Drone, a Unit with combat strength 2 and Paradox. Toma controls Spore
Warden (Section 9.5), combat strength 3, with Regenerate.

1. Reva declares both Cinder Warden and Signal Drone as attackers.
   Because Signal Drone has Paradox (Section 14.5), it does not become
   Spent; Cinder Warden, which has no such keyword, becomes Spent as
   normal (Section 5.4).
2. Toma declares Spore Warden as a blocker against Cinder Warden, leaving
   Signal Drone unblocked. Signal Drone deals 2 damage to Toma's Core
   Integrity (Section 5.4), since an unblocked attacker deals its combat
   strength as damage to the non-active player.
3. Cinder Warden and Spore Warden deal their combat strength to each
   other (Section 12.1): 3 damage from Cinder Warden to Spore Warden, and
   3 damage from Spore Warden to Cinder Warden. Spore Warden's 3 marked
   damage equals its own combat strength, so it would be destroyed
   (Section 12.3) — but it has Regenerate (Section 14.2), so instead all
   3 marked damage is removed from it and it is not destroyed, remaining
   on the Field. Cinder Warden has Bulwark 2 (Section 14.1); this is the
   first damage Cinder Warden has taken this turn, so 2 of the 3 damage
   is prevented and only 1 damage is actually marked against it — short
   of its combat strength of 3, so Cinder Warden also survives, carrying
   1 marked damage until it clears at the end of the turn (Section 12.4).
4. Because Signal Drone has Paradox (Section 14.5), it never became Spent
   in step 1, even though it attacked and dealt combat damage; it remains
   Ready for the rest of the turn, available to block or use a
   Spent-requiring ability without first needing to be readied.

This confirms, on paper, that Bulwark prevents rather than reduces damage
from a single source once per turn (Section 14.1), that Regenerate
answers lethal damage by shedding it rather than the Unit avoiding combat
altogether (Section 14.2), and that Paradox breaks the ordinary link
between attacking and becoming Spent (Section 5.4, Section 14.5) — each
keyword acting exactly as its own subsection states, with no further
explanation needed on the card that carries it.
```

That is the entire new section, verbatim. Nothing else in the file changes.

---

## File 2: `test/design-targeting.test.js`

### Edit 2a — forward-compatible top-level title check

Find this test (currently around lines 59-67):

```js
test('AC1: rules.md appends "13. Targeting" immediately after "12. Combat Resolution", with every earlier section\'s number and title unchanged', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  assert.deepStrictEqual(
    titles,
    EXPECTED_TOP_LEVEL_TITLES,
    `expected exactly ${JSON.stringify(EXPECTED_TOP_LEVEL_TITLES)}, got ${JSON.stringify(titles)}`
  );
});
```

Replace it with (same pattern already used in `test/design-combat.test.js`
for the identical problem — see that file's `AC1` top-level-titles test):

```js
test('AC1: rules.md appends "13. Targeting" immediately after "12. Combat Resolution", with every earlier section\'s number and title unchanged', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  assert.ok(
    titles.length >= EXPECTED_TOP_LEVEL_TITLES.length,
    `expected at least ${EXPECTED_TOP_LEVEL_TITLES.length} top-level sections, got ${titles.length}`
  );
  assert.deepStrictEqual(
    titles.slice(0, EXPECTED_TOP_LEVEL_TITLES.length),
    EXPECTED_TOP_LEVEL_TITLES,
    `expected the first sections to be exactly ${JSON.stringify(EXPECTED_TOP_LEVEL_TITLES)}, got ${JSON.stringify(titles)}`
  );
});
```

Do not touch `EXPECTED_TOP_LEVEL_TITLES` itself (still lists exactly
Sections 1-13) or any other test in the file — only this one assertion
changes, from full-array equality to prefix-array equality, so it keeps
verifying Sections 1-13 are unchanged and in order while no longer
choking on Section 14 existing afterward.

---

## Expected outputs

- `node --test` run from the repo root: exit code 0, no failing tests. In
  particular:
  - `test/design-rules.test.js` — unaffected, still passes (it only
    asserts `>= 5` top-level sections and checks specific ones by regex,
    never an exact top-level count).
  - `test/design-targeting.test.js` — passes after Edit 2a; still proves
    Sections 1-13 are present, in order, and unchanged.
  - `test/design-combat.test.js`, `test/design-winning-losing.test.js`,
    `test/design-full-game-playtest.test.js`, `test/design-cardtypes.test.js`,
    `test/design-battlefield.test.js`, `test/design-characters.test.js`,
    `test/design-deckbuilding.test.js` — all unaffected (verified during
    planning: none of them assert an exact, full top-level section list;
    `design-full-game-playtest.test.js`'s section-citation check only
    fails on a citation that stops resolving, and adding a section never
    removes one).
  - Whatever new test file a later step adds for this unit (e.g.
    `test/design-keyword-abilities.test.js`) should pass against the
    `design/rules.md` content above, since it satisfies AC1-AC4 directly:
    a numbered top-level "14. Keyword Abilities" section; 5 named keyword
    subsections (14.1-14.5), each naming exactly one Fount by name in its
    own heading and body; the 5 keyword names plus the generic term added
    to the Section 2 glossary ahead of Section 14; and a numbered worked
    example (14.6) applying 3 of the 5 keywords to a concrete game state.
- `git diff --stat` after this unit's changes should show exactly two
  files: `design/rules.md` (insertions only) and `test/design-targeting.test.js`
  (one small hunk). `git diff design/cards/` should be empty.

## Risk self-assessment (FIRE)

- **Reversibility:** trivial. Pure text/markdown addition to one doc file
  plus one test-assertion loosening; both are one-commit reverts.
- **Security impact:** none. No code path, no input handling, no secrets.
- **User data:** none. No game software, no persistence, no schema (T8 —
  this unit is design/rules text only).
- **Schema changes:** none.

Nothing here is ambiguous enough to need a check-in: the keyword choices
are directly traceable to `world.md`/`design/races/*` identity text, the
insertion points are exact and anchored to existing unique text, and the
one test-file fix is mechanically identical to a fix already precedented
in `test/design-combat.test.js`. **GATE: none.**

## Held-out AC note

AC5 (held out) — "no existing card file is touched, no other rules.md
section is altered besides the new section and its Section 2 glossary
additions" — is redundant with the intent paragraph's own explicit
statement ("no existing card file is touched, and no card is retextualized
to use a new keyword... this is pure design/rules text"). It is not a
spec bug: it's the same constraint stated twice, once as prose intent and
once as a held-out check. This plan satisfies it by construction (Edit 1a
and 1b are the only content changes to `rules.md`; no file under
`design/cards/` is opened for writing at all).


## Findings

# Blind Review — cardgame-keyword-abilities-rules, cycle 1

## AC coverage

**AC1** (new Section 14 with ≥5 named keyword abilities, each tied to exactly one
Fount, consistent with `world.md`/race-file identity) — **MET**. `design/rules.md`
gains `## 14. Keyword Abilities` immediately after `13. Targeting`, with strict
numeric sequence (1–14) preserved. Five subsections: 14.1 Bulwark X (Mass), 14.2
Regenerate (Bloom), 14.3 Foresee X (Signal), 14.4 Swarm (Circuit), 14.5 Paradox
(Tangle). Cross-checked each against `design/world.md`'s per-Fount passages
(lines 19–37): Bulwark/"endures... shrugs off"→Mass, Regenerate/"mutating past
them"→Bloom, Foresee/"knowing... a moment before"→Signal, Swarm/"copies of
itself"→Circuit, Paradox/"negotiate with cause and effect"→Tangle. All five
match. Plan's table distinguishing each keyword from its Fount's existing
Section 4 resource mechanic (Fortification, Growth, Signal-point scry, Circuit
copy-pay, Tangle Queue-reorder) checks out on reading Section 4.1–4.4.

**AC2** (each keyword's own numbered subsection states precise rules-text
meaning) — **MET**, with one minor precision note (see Findings). All five
subsections state trigger condition, effect, and frequency in operative
rules-text terms, cross-referencing existing sections (5.4, 9.1, 12.3) where a
rule already exists rather than restating it.

**AC3** (glossary-first: each name defined in Section 2 before Section 14) —
**MET**. Six new glossary bullets (generic "Keyword ability" plus the five
named keywords) inserted immediately after the existing "Stats/counters line"
bullet, before `## 3. Zones` — well before Section 14. Wording of each glossary
entry is consistent with its Section 14.x body.

**AC4** (numbered worked example applying new keywords to a concrete
hypothetical state) — **MET**. 14.6 "Worked Example: Three Keywords in One
Conflict Phase" uses the document's established recurring example challengers
(Reva/Toma, used 69 times elsewhere in the file) and the canonical Spore
Warden card from Section 9.5, walks 4 numbered steps applying Bulwark,
Regenerate, and Paradox, and the arithmetic is internally consistent: Cinder
Warden (combat 3, Bulwark 2) takes 3 damage from Spore Warden, prevents 2,
marks 1, survives; Spore Warden (combat 3, Regenerate) takes 3 damage, would
be destroyed at 12.3's threshold, Regenerate clears it instead; Signal Drone
(Paradox) attacks unblocked for 2 without becoming Spent. Matches the rigor of
Section 12.5's existing multi-blocker worked example.

## Mechanical fix (test/design-targeting.test.js)

Verified against precedent: `test/design-combat.test.js` (lines 58–71) already
uses the identical pattern — `assert.ok(titles.length >= EXPECTED...)` plus
`assert.deepStrictEqual(titles.slice(0, EXPECTED.length), EXPECTED, ...)` —
applied for the same reason (`cardgame-targeting-rules recovery`). The diff's
change to `design-targeting.test.js` is a faithful copy of that established
shape. Confirmed no other test file needs the same fix: `design-rules.test.js`,
`design-winning-losing.test.js`, `design-deckbuilding.test.js`,
`design-cardtypes.test.js`, and `design-battlefield.test.js` all already use
prefix/`startsWith`-style top-level-section assertions that tolerate a
trailing Section 14, so Section 14's addition does not regress them.
(`design-deckbuilding.test.js`'s "at least 11 total" test is a pre-existing
tautological assertion — `Math.max(n,11)===n ? n : 11` always equals `n` — not
touched by this diff, so out of scope here.)

## Scope check (AC5, not visible but plan-asserted)

Diff touches exactly `design/rules.md`, `site/design/rules.html` (build-site
output, mechanically regenerated from the same content), `test/design-
keyword-abilities.test.js` (new), and `test/design-targeting.test.js`. No file
under `design/cards/` is touched, matching the intent's "vocabulary only, no
retexturing" scope.

## Findings

### 1. [INTRODUCED, low severity] Bulwark's scope ("a permanent") is wider than what the rules ever let take damage

- **File**: design/rules.md, Section 14.1 (line 1117) and its glossary entry
  (line 152).
- **Summary**: Bulwark X is defined for "a permanent," but Section 2's Damage
  definition (line 72) restricts damage to being "subtracted from Core
  Integrity, or marked against a Unit" — never against a non-Unit permanent.
  Compare Section 4.2's Growth counters, an analogous damage/destruction
  effect, which is correctly scoped to "a Unit" (line 213), while Section
  4.1's Fortification counters (a general destroy-prevention, not
  damage-specific) is correctly scoped to "any permanent." Bulwark is a
  damage-specific effect like Growth, but is scoped like Fortification.
- **Failure scenario**: A future card prints "Bulwark 2" on a non-Unit
  Materials permanent (e.g., a Generator, which Section 9.6 explicitly allows
  Materials cards to be). Per Section 14.1's own wording the keyword should
  apply to it, but because Section 2 never lets damage be marked against a
  non-Unit permanent, the keyword can never actually trigger there — a
  designer or player reading only the keyword definition (as AC2 intends —
  "invoke the keyword by name alone with no further explanation needed")
  would have no way to know this from Section 14.1 alone.
- This does not affect the worked example (Cinder Warden is a Unit throughout)
  and does not contradict any other stated rule; it is an imprecision in an
  edge case outside what this unit's cards or example exercise. Not blocking.

No other INTRODUCED findings survived review. All PRE-EXISTING items noticed
in passing (Section 5.4's leftover placeholder comments; the tautological
`design-deckbuilding.test.js` assertion) predate this diff and are out of
scope for this unit.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T05:20:50.979Z] **bolt:start** — unit=cardgame-keyword-abilities-rules start_sha=3a889feeec5c166f98b622fa55846886d389f160 branch=bolt/cardgame-keyword-abilities-rules worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-keyword-abilities-rules
- [2026-07-29T05:20:58.396Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T05:30:52.544Z] **bolt:escalated** — Planner produced no plan.md
- [2026-07-29T05:30:52.857Z] **archive:done** — outcome=escalated file=C:\github\cardGame\workItems\2026-07-29-cardgame-keyword-abilities-rules-keyword-abilities-rules-amaranth-expanse-rules-evergreen-combat-utility-keywords.md
- [2026-07-29T05:30:53.034Z] **worktree:removed** — C:\github\.agentbox-worktrees\cardGame\cardgame-keyword-abilities-rules (branch bolt/cardgame-keyword-abilities-rules left for recovery)
- [2026-07-29T05:51:37.768Z] **resolution:retry** — Try again as-is
- [2026-07-29T05:51:38.574Z] **bolt:start** — unit=cardgame-keyword-abilities-rules start_sha=25b4ce192bb084380b2ad03d02690078a6884dc5 branch=bolt/cardgame-keyword-abilities-rules worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-keyword-abilities-rules
- [2026-07-29T05:51:45.773Z] **baseline:done** — pre-edit test exit=1
- [2026-07-29T06:01:14.458Z] **plan:done** — plan.md written
- [2026-07-29T06:07:10.004Z] **tests:done** — RED verified on test/design-targeting.test.js, test/design-keyword-abilities.test.js (exit=1)
- [2026-07-29T06:09:22.106Z] **build:c1** — tests green, committed
- [2026-07-29T06:14:46.776Z] **review:c1** — APPROVE
- [2026-07-29T06:16:38.401Z] **review:devils-advocate-inconclusive** — NEEDS_WORK with no substantive findings — attack does not count
- [2026-07-29T06:16:38.403Z] **review:devils-advocate** — APPROVE
- [2026-07-29T06:16:45.724Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T06:16:46.046Z] **merge:done** — auto-merged bolt/cardgame-keyword-abilities-rules into master (worktree)


## Receipt

```json
{
  "start_sha": "25b4ce192bb084380b2ad03d02690078a6884dc5",
  "end_sha": "f6ca7a0dea95019a017883c0d726d513f8a6fd19",
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
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC5",
      "held_out": true,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-29T06:16:45.722Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-keyword-abilities-rules\\plan.md`.\n\n**Approach:** append a new \"14. Keyword Abilities\" section to `design/rules.md` with 5 Fount-bound keywords — Bulwark (Mass), Regenerate (Bloom), Foresee (Signal), Swarm (Circuit), Paradox (Tangle) — each in its own numbered subsection, plus a 14.6 worked example, and add the corresponding glossary entries to Section 2 before Section 3. Full verbatim text for both edits is in the plan.\n\nOne thing I caught during research: `test/design-targeting.test.js` currently does an exact-array `deepStrictEqual` over all 13 top-level section titles, which would break the instant Section 14 exists — this is the same problem `design-combat.test.js` already hit and fixed with a prefix/slice check. The plan includes that identical one-hunk fix so `node --test` stays green; no other test file is at risk (verified by grep). GATE: none — no ambiguity, card files are never touched.",
    "test_writer": "Wrote failing tests for `cardgame-keyword-abilities-rules`:\n\n- **`test/design-keyword-abilities.test.js`** (new) — covers AC1–AC4: Section 14 exists right after Section 13; 5 keyword subsections (Bulwark/Mass, Regenerate/Bloom, Foresee/Signal, Swarm/Circuit, Paradox/Tangle), each tied to exactly one Fount and consistent with its `world.md` identity text; each states a precise, invokable mechanic; all 5 names plus \"Keyword ability\" added to the Section 2 glossary ahead of Section 14; and a numbered worked example applying ≥2 of the keywords with section cross-references. All fail now since Section 14 doesn't exist.\n- **`test/design-targeting.test.js`** (edited) — loosened the exact-array title assertion to a prefix check, same fix already precedented in `design-combat.test.js`, so the pre-existing suite doesn't spuriously break once Section 14 is appended.\n\nNote: I couldn't execute `node --test` myself — the sandbox denied `node` invocations against files — so I verified correctness by manual trace against the plan's exact intended `rules.md` text (and caught/fixed one bug: my Bulwark regex assumed \"prevent...single source\" order, but the planned text has \"single source\" before \"prevent\").",
    "builder_c1": "No card files were touched, and `test/` is untouched (the targeting-test fix was already committed by the previous cycle). `node --test` is green: 523/523 passing. Work complete for this cycle — `design/rules.md` gained Section 14 (Keyword Abilities) with 5 Fount-bound keywords, glossary entries, and a worked example, plus the regenerated `site/design/rules.html` artifact (matching the repo's established pattern).",
    "reviewer_c1": "Findings written to `C:\\github\\AgentBox\\units\\cardgame-keyword-abilities-rules\\findings.md`. Summary: all four visible ACs are met, the mechanical test fix correctly mirrors the `design-combat.test.js` precedent and I confirmed no other test file needed the same treatment. One low-severity INTRODUCED precision gap noted (Bulwark's \"permanent\" scope is broader than what Section 2 ever lets take damage) — doesn't affect the worked example or any stated rule, so it doesn't gate.\n\nAPPROVE",
    "devils_advocate": "NEEDS_WORK"
  }
}
```

## Comments

(no comments.md)
