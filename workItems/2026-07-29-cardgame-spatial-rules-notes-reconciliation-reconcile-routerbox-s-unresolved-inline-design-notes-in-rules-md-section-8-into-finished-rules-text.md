# cardgame-spatial-rules-notes-reconciliation: Reconcile RouterBox's unresolved inline design notes in rules.md Section 8 into finished rules text

## Header

- unit: cardgame-spatial-rules-notes-reconciliation
- title: Reconcile RouterBox's unresolved inline design notes in rules.md Section 8 into finished rules text
- project: cardgame
- completed: 2026-07-29
- outcome: escalated
- start_sha: c8de43e81eb930547c73f154d340a626cd267dea
- end_sha: 903f6f6e2b5c743dc6754ce27d7b52985ce017a7

## Intent

design/rules.md's Section 8 (Spatial Battlefield, shipped as part of cardgame-spatial-battlefield-rules) was drafted with several of RouterBox's own inline review notes left as raw `//` comments and one <strikethrough>-marked passage instead of being incorporated into finished, numbered rules prose — a violation of the MTG-Comprehensive-Rules structural bar T9 sets for this document (no contradictions, no unresolved marginalia). Four spots need reconciliation: the 8.1 passage stating a Unit's location is untracked, struck through and marked "Wrong" by RouterBox with a same-passage correction that Units are located at Planets and move between them via Wormholes ("the graph is the battlefield", superseding the implicit MTG-zone analogy); an unincorporated note on which Planets exist at game start; the 8.3 Discovery cost formula, which a RouterBox note says should be inverted (shorter Wormholes cost MORE Fount Points, being more valuable/easier to traverse) but which the adjacent shipped rule text still states as directly proportional to Length; and 8.6 Blockade & Capture, which a 2026-07-28 RouterBox note flags as merely "an ok start" needing a real combat tie-in — Units present at the target Planet dealing damage equal to the Planet's Generator count to Blockade, and that amount again to Capture — replacing today's shipped mechanic, which never references Units or damage at all. This unit rewrites these four spots into clean numbered prose (removing all raw comment/strikethrough markup in the process, including the 07/28 4:00pm review-checkpoint marker once its note is resolved), and updates 8.4's Unit-type Restriction description so it no longer claims to be inert/for-future-cards-only, since Unit location is now a real, current mechanic per the corrected 8.1. Only design/rules.md and its existing owning test file change; no card file, no other rules.md section, and no code outside the test file is touched. This is pure design/rules-text correctness work (T8), not game software.

## Acceptance Criteria

- AC1 [paraphrase]: design/rules.md contains no remaining <strikethrough> tags and no lines beginning with a `//` inline comment anywhere in the document.
- AC2 [paraphrase]: Section 8.1 states, in finished numbered-rules prose (not a struck-through or commented passage), that each Unit occupies and has a tracked location at a specific Planet, and Section 8.4's Unit-type Restriction subsection no longer states the Restriction is inert or exists only for future cards.
- AC3 [paraphrase]: Section 8.3's Discovery cost rule states that, for Discoveries of the same kind (Frontier or Contested), a Wormhole of lesser Length costs more Fount Points to open than one of greater Length, while a Contested Discovery still costs exactly double what a Frontier Discovery of the same Length costs.
- AC4 [paraphrase]: Section 8.6 states that Blockading a Planet requires the assaulting challenger's Units to be present at that Planet and to deal damage totaling at least the number of Generators on it, and that Capturing an already-Blockaded Planet requires dealing that same damage total again.
- AC5 [inferred] (held_out): Every assertion in test/design-battlefield.test.js that existed before this unit (Blockade halts Generator production, Capture destroys the Generator into the Wreck, wormholes remain restrictable by direction/team/unit-type, Sections 1-7 remain unchanged and in order before Section 8) still passes against the rewritten Section 8 text.

## Plan

GATE: confirm

# Unit: cardgame-spatial-rules-notes-reconciliation

## Why GATE: confirm (read this before building)

This unit resolves four review-note spots, but doing so honestly forces four
real judgment calls that the unit spec does not settle. Each has a
recommended default baked into the edits below — if you're fine with all
four defaults, the rest of this plan is directly buildable as written.

1. **AC1's scope vs. the unit's own scope statement.** AC1 (given, not
   held-out) says design/rules.md must contain "no lines beginning with a
   `//` inline comment anywhere in the document." But the unit intent says
   "no other rules.md section... is touched," and there are 7 raw `//`
   comment lines outside Section 8 that this unit does not charter fixing:
   line 275 (Section 5.2, Generation Phase) and lines 290/294-298/300
   (Section 5.4, Conflict Phase). Those comments are open design questions
   ("units move around the graph... attack planets like this...") with **no
   RouterBox resolution attached**, unlike the four Section 8 spots, which
   each carry a concrete correction. Deleting them outright would silently
   discard un-actioned design notes; inventing resolutions for them would be
   scope creep and fabricated design work no card or test currently needs.
   **Recommended default: scope AC1 to Section 8 only** (matching the
   intent's explicit boundary and the fact that only Section 8's notes have
   provided resolutions). The new test added below checks Section 8's body
   text, not the whole file. If you want literal document-wide AC1
   compliance instead, that requires either deleting Sections 5.2/5.4's
   comments (lossy) or chartering a separate unit to actually resolve them
   — tell the Builder which you want before it runs.

2. **Discovery cost formula.** RouterBox's note gives paired examples
   `[1-9, 2-8, ..., 9-1]` (Length -> cost), i.e. cost = 10 − Length for
   Length 1-9, with no stated behavior beyond Length 9. Length itself stays
   "any positive integer" elsewhere in the document (Glossary, 8.3 step 3),
   so a bare `10 − Length` goes to 0 or negative at Length ≥ 10.
   **Recommended default: cost = max(10 − Length, 1)** — reproduces
   RouterBox's numbers exactly for Length 1-9, floors at 1 Fount Point
   beyond that (a long Wormhole never gets cheaper than the minimum, it just
   stops getting more expensive to the opener — Assault still costs full
   summed Length, so huge Lengths remain costly elsewhere). This means
   Length ≥ 9 Wormholes of different Lengths tie at cost 1, which is a
   narrow miss against a fully literal reading of AC3's "lesser Length
   costs more... than one of greater Length" — acceptable in my judgment
   since it matches RouterBox's own numeric example exactly and the
   alternative (capping Length itself at 9) invents a new constraint the
   unit never asked for.

3. **Assault's existing Fount-Point/path cost: keep or replace?** Section
   2's Glossary defines **Assault** as "an action... costing Fount Points
   equal to the summed Length of that path" — that entry is outside Section
   8 and out of scope to edit. If 8.6's rewrite deletes the Fount-Point cost
   entirely (a literal reading of the intent's "replacing today's shipped
   mechanic"), Section 2's Assault entry becomes stale/contradictory, which
   is exactly the kind of bug this unit exists to remove.
   **Recommended default: keep the existing Fount-Point/path cost as a
   precondition for taking the Assault action at all, and ADD the new
   Unit-presence-and-damage requirement as what actually decides whether
   the Assault succeeds at Blockading/Capturing.** This keeps Section 2
   consistent untouched, and "replacing... a mechanic which never
   references Units or damage at all" is satisfied because the new
   Unit/damage requirement is what's added — nothing about it requires also
   deleting the cost.

4. **"Damage" applied to a Planet.** Section 2's Glossary defines Damage as
   "a numeric amount subtracted from Core Integrity, or marked against a
   Unit" — it does not mention Planets, and Section 2 is out of scope.
   AC4 explicitly wants Units to "deal damage" to a Planet.
   **Recommended default: extend the concept to a third target (a Planet)
   directly in the 8.6 prose, with an explicit parenthetical flagging the
   extension**, rather than silently assuming it fits Section 2's existing
   two-item description or editing Section 2 to add it.

If any of these four defaults is wrong, stop and get sign-off before the
Builder runs — the edits below all assume these defaults.

## Files touched

- `design/rules.md` — five edits, all within Section 8 (8.1, 8.3, 8.4, 8.6,
  8.7). No other section of rules.md is touched (per GATE item 1's default).
- `test/design-battlefield.test.js` — one new test block appended, covering
  the four ACs (AC5/held-out is already covered by tests that already exist
  in this file and are not touched — see Verification below).

No card file, no other design/*.md file, no code outside the test file is
touched. (design/playtest-spatial.md and design/playtest-full-game.md both
contain worked examples that assume the OLD, direct-proportional Discovery
cost and the OLD, Unit-less Blockade/Capture mechanic — they will go stale
after this unit lands. That's expected and out of scope; flag it to
RouterBox as a follow-up, don't fix it here.)

---

## Edit 1 — design/rules.md, Section 8.1 (Planets & Wormholes)

Find this exact block (it spans the Wormhole bullet through the "controlled"
bullet, including the `<strikethrough>` tag pair and both raw `//` comment
lines):

```
- A **Planet** is a node in the battlefield graph. Some Planets are on the
  graph from the start of the game (each challenger's Homeworld, Section
  8.2); others begin **Unexplored** — not yet on the graph at all — and are
  only added to it by Discovery (Section 8.3).
- A **Wormhole** is an edge in the battlefield graph, connecting exactly two
  Planets. Every Wormhole has a **Length**: a positive integer set when the
  Wormhole is opened (Section 8.3). Length fixes the Fount Point cost of the
  Discovery that opens the Wormhole (Section 8.3) and the Fount Point cost of
  an Assault that uses it (Section 8.6). <strikethrough>This rulebook does not define a
  general unit-movement system across Wormholes; a Unit's location is not
  tracked by this section, and Length has no effect beyond the two costs just
  named unless a future card or rule says otherwise.</strikethrough> 
  //Wrong. Units are located at planets and move through wormholes between them. This supersedes the normal battlefield zone analogous to magic the gathering.  The graph is the battlefield.  
  
- A Planet is **controlled** by whichever challenger most recently built a
  Generator on it or Captured it (Section 8.6); Discovering a Planet does not
  by itself grant control of it (Section 8.3). A Planet on the graph
  controlled by neither challenger is **Neutral**. Each challenger's
  Homeworld is controlled by them from the start of the game and can never
  become Neutral or change control (Section 8.2, Section 8.6).
  //At the beginning of the game, the homeworlds are the only planets.  Planets are created for each game instance via the discovery mechanism.
- Two Planets are **adjacent** if a Wormhole that is not Closed (Section 8.5)
  connects them directly. A **path** between two Planets is an unbroken
  sequence of adjacent Planets.
```

Replace it with:

```
- A **Planet** is a node in the battlefield graph. Some Planets are on the
  graph from the start of the game (each challenger's Homeworld, Section
  8.2); others begin **Unexplored** — not yet on the graph at all — and are
  only added to it by Discovery (Section 8.3). Section 8.8 fixes the
  complete starting graph — each challenger's Homeworld and nothing else —
  as part of general game setup.
- A **Wormhole** is an edge in the battlefield graph, connecting exactly two
  Planets. Every Wormhole has a **Length**: a positive integer set when the
  Wormhole is opened (Section 8.3). Length fixes the Fount Point cost of the
  Discovery that opens the Wormhole (Section 8.3) and the Fount Point cost of
  an Assault that uses it (Section 8.6).
- A Unit's **location** is a Planet: at every moment a Unit is on the Field
  (Section 3), it is located at exactly one Planet on the battlefield graph.
  Location is separate from zone — the Planet a Unit is located at has no
  bearing on which zone (Section 3) it is in, just as standing on a Planet
  has no bearing on any card's zone (above). The graph is the battlefield: a
  Unit enters the Field located at a Planet its controller controls, and its
  location changes only when it moves from that Planet to an adjacent one
  (below) across a Wormhole that is not Closed (Section 8.5) and does not
  carry a Restriction (Section 8.4) forbidding that Unit's controller,
  direction of travel, or type; the action and timing of moving a Unit this
  way is governed by Section 5.4.
- A Planet is **controlled** by whichever challenger most recently built a
  Generator on it or Captured it (Section 8.6); Discovering a Planet does not
  by itself grant control of it (Section 8.3). A Planet on the graph
  controlled by neither challenger is **Neutral**. Each challenger's
  Homeworld is controlled by them from the start of the game and can never
  become Neutral or change control (Section 8.2, Section 8.6).
- Two Planets are **adjacent** if a Wormhole that is not Closed (Section 8.5)
  connects them directly. A **path** between two Planets is an unbroken
  sequence of adjacent Planets.
```

This: removes the `<strikethrough>` block and both raw comments; adds a new
bullet stating a Unit has a tracked location at a Planet (AC2); cross-refs
8.8 for the "only Homeworlds exist at start" fact instead of restating it
(that note's content is already fully covered by the existing, non-comment
8.8 Map Setup section — nothing there needs to change).

---

## Edit 2 — design/rules.md, Section 8.3 (Discovery), step 4

Find:

```
4. Pay the cost, from any combination of the active player's resource pools:
   a Frontier Discovery costs Fount Points equal to the new Wormhole's
   Length; a Contested Discovery costs twice that — Fount Points equal to
   double the new Wormhole's Length. This is the toll aggression pays:
   reaching into unclaimed space is the cheap path, reaching into space the
   opponent already holds costs double.
   //invert pairs like [1-9, 2-8, 3-7, 4-6, 5-5, 6-4, 7-3, 8-2, 9-1] to computer worm hole costs to lengths.  Shorter wormholes are easier to traverse and so are more valuable, and more expensive.
```

Replace with:

```
4. Pay the cost, from any combination of the active player's resource pools:
   a Frontier Discovery costs Fount Points equal to 10 minus the new
   Wormhole's Length, with a minimum of 1 Fount Point no matter how long the
   Wormhole is; a Contested Discovery costs twice that — Fount Points equal
   to double the Frontier cost for a Wormhole of that Length. This is the
   toll ease of passage pays: the shorter and more easily-traveled a
   Wormhole is, the more Fount Points it costs to open, while a long,
   sprawling Wormhole is comparatively cheap; reaching into space the
   opponent already holds still costs exactly double what reaching into
   unclaimed space of the same Length would.
```

Note: step 3, directly above this (unchanged), already reads "...a shorter
Wormhole simply costs more, per the next step" — that sentence was already
consistent with the corrected (inverted) formula, only step 4 itself had the
stale directly-proportional formula plus the raw comment. Do not change step
3.

---

## Edit 3 — design/rules.md, Section 8.4 (Wormhole Restrictions), Unit-type Restriction bullet

Find:

```
- A **Unit-type Restriction** limits passage through a Wormhole to
  permanents of a stated type (for example, "Biology-only"). This rulebook's
  Assault action (Section 8.6) does not move a Unit and is therefore never
  affected by a Unit-type Restriction; the Restriction exists for future
  cards that let a Unit move or deploy between Planets, a design space this
  rulebook leaves open.
```

Replace with:

```
- A **Unit-type Restriction** limits passage through a Wormhole to
  permanents of a stated type (for example, "Biology-only"): a Unit whose
  printed type does not match a Wormhole's Unit-type Restriction MAY NOT
  move across that Wormhole (Section 8.1). This rulebook's Assault action
  (Section 8.6) does not move a Unit and is therefore never affected by a
  Unit-type Restriction; the Restriction instead governs a Unit's actual
  movement between Planets (Section 8.1, Section 5.4).
```

Do not touch the Directional Restriction or Team Restriction bullets right
above this one — the unit only asks for the Unit-type Restriction wording to
change (it's the one currently claiming to be inert), and expanding the
other two to also reference Unit movement is scope creep not requested here.

---

## Edit 4 — design/rules.md, Section 8.6 (Positional Generators: Blockade & Capture)

Find this exact block (the whole subsection body, including the leading raw
comment and the trailing checkpoint-marker comment):

```
### 8.6 Positional Generators: Blockade & Capture

//This is an ok start, but I think the units need to be at the planet, and then need to do damage equal to the number of generators to blockade, and then do that amount again to capture.

Once per turn, during their Main Phase, under the same timing restriction as
Discovery — Queue empty, their priority — a challenger MAY take one
**Assault** action against a Planet they do not control, provided a path
connects a Planet they control to it using only Wormholes that are not
Closed and do not carry a Restriction (Section 8.4) that forbids this
challenger's team or this direction of travel. If more than one qualifying
path exists, the assaulting challenger chooses which one to use. An Assault
costs Fount Points, from any combination of the assaulting challenger's
resource pools, equal to the sum of the Lengths of every Wormhole on the
chosen path.

An Assault does one of the following, the assaulting challenger's choice:

- **Blockade** the target Planet: every Generator on it stops producing
  Fount Points, starting with the Generation Phase (Section 5.2) of the
  assaulted challenger's next turn, for as long as the Blockade lasts. A
  Blockade lasts until the Planet's controller pays Fount Points, from any
  combination of their own resource pools, equal to the Assault's original
  cost, during their own Main Phase under the same timing restriction — the
  only way to clear a Blockade.
- **Capture** the target Planet, if it is already Blockaded by the
  assaulting challenger: control of the Planet passes to the assaulting
  challenger immediately, and every Generator on it is destroyed — moved to
  its owner's Wreck (Section 3). Capture is permanent: control does not
  revert on its own, and a destroyed Generator must be replayed, on some
  Planet its owner controls, like any other Generator, subject to the
  one-Generator-per-turn limit (Section 5.3).

A Homeworld MAY be Blockaded like any other Planet, but MAY NOT be Captured
— Homeworlds never change control (Section 8.2).
//As far as I read 07/28/26 4:00pm.
```

Replace with:

```
### 8.6 Positional Generators: Blockade & Capture

Once per turn, during their Main Phase, under the same timing restriction as
Discovery — Queue empty, their priority — a challenger MAY take one
**Assault** action against a Planet they do not control, provided a path
connects a Planet they control to it using only Wormholes that are not
Closed and do not carry a Restriction (Section 8.4) that forbids this
challenger's team or this direction of travel. If more than one qualifying
path exists, the assaulting challenger chooses which one to use. An Assault
costs Fount Points, from any combination of the assaulting challenger's
resource pools, equal to the sum of the Lengths of every Wormhole on the
chosen path. Paying this cost lets the assaulting challenger attempt to
Blockade or Capture the target Planet; it does not by itself do either — the
Unit-and-damage requirement below decides whether it succeeds.

An Assault does one of the following, the assaulting challenger's choice:

- **Blockade** the target Planet: this requires the assaulting challenger to
  control one or more Units located (Section 8.1) at the target Planet at
  the moment the Assault action is taken. Those Units' combined combat
  strength (Section 9.1) is dealt as damage to the Planet — extending
  Section 2's Damage concept to a Planet, alongside Core Integrity and a
  Unit — exactly as an attacking Unit deals its combat strength as damage
  elsewhere in this rulebook (Section 12.1). If that damage totals at least
  the number of Generators on the Planet, every Generator on it stops
  producing Fount Points, starting with the Generation Phase (Section 5.2)
  of the assaulted challenger's next turn, for as long as the Blockade
  lasts; if the damage falls short, the Assault still costs its Fount
  Points but the Planet is not Blockaded. A Blockade lasts until the
  Planet's controller pays Fount Points, from any combination of their own
  resource pools, equal to the Assault's original cost, during their own
  Main Phase under the same timing restriction — the only way to clear a
  Blockade.
- **Capture** the target Planet, if it is already Blockaded by the
  assaulting challenger: this requires meeting the same Unit-and-damage
  requirement as Blockade, above, a second time — the assaulting
  challenger's Units located at the target Planet dealing combined damage
  totaling at least the Planet's Generator count once again. If they do,
  control of the Planet passes to the assaulting challenger immediately,
  and every Generator on it is destroyed — moved to its owner's Wreck
  (Section 3). If the damage falls short, the Assault still costs its Fount
  Points but the Planet is not Captured and remains Blockaded. Capture is
  permanent: control does not revert on its own, and a destroyed Generator
  must be replayed, on some Planet its owner controls, like any other
  Generator, subject to the one-Generator-per-turn limit (Section 5.3).

A Homeworld MAY be Blockaded like any other Planet, but MAY NOT be Captured
— Homeworlds never change control (Section 8.2).
```

---

## Edit 5 — design/rules.md, Section 8.7 worked example (consequential fix)

This is not one of the four flagged spots, but 8.7 is a sub-section of
Section 8 (in scope — the "no other rules.md section" restriction is about
sections outside Section 8, not sub-sections within it), and its numbers
currently assume the OLD Discovery cost formula and the OLD, Unit-less
Blockade/Capture mechanic. Leaving it as-is would immediately reintroduce a
contradiction against the just-fixed 8.3/8.6 — exactly what this unit exists
to remove. Fix it in the same edit pass.

Find:

```
1. On an early turn, Reva takes a Discovery action: a Frontier Discovery from
   Solmere to an Unexplored Planet, naming it Ordinal Reach, with a Wormhole
   of Length 2. Frontier Discovery costs Fount Points equal to Length, so
   Reva pays 2. Ordinal Reach joins the battlefield graph as a Neutral
   Planet, adjacent to Solmere.
2. On a later turn, Reva plays a Generator and builds it on Ordinal Reach.
   Ordinal Reach is now controlled by Reva (Section 8.1).
3. Toma, on their own Main Phase, takes an Assault action against Ordinal
   Reach. The only path from a Planet Toma controls (Kethis) to Ordinal Reach
   runs Kethis, through a Wormhole Toma had separately Discovered to Solmere,
   to Solmere, then the Length-2 Wormhole on to Ordinal Reach; Toma pays
   Fount Points equal to the sum of both Wormholes' Lengths on that path, and
   chooses to Blockade rather than Capture. Ordinal Reach is now Blockaded:
   starting with Reva's next Generation Phase, the Generator there stops
   producing Fount Points, though it is not destroyed and Reva still
   controls the Planet.
4. Reva does not clear the Blockade (that would cost Fount Points equal to
   Toma's Assault, paid during Reva's own Main Phase). On a following turn,
   Toma takes a second Assault action along the same path, this time
   choosing to Capture. Control of Ordinal Reach passes to Toma immediately,
   and Reva's Generator there is destroyed, moved to Reva's Wreck. Reva may
   later replay a Generator, but only on a Planet Reva still controls, and
   only one per turn (Section 5.3).
```

Replace with:

```
1. On an early turn, Reva takes a Discovery action: a Frontier Discovery from
   Solmere to an Unexplored Planet, naming it Ordinal Reach, with a Wormhole
   of Length 2. Frontier Discovery costs Fount Points equal to 10 minus
   Length, so Reva pays 8. Ordinal Reach joins the battlefield graph as a
   Neutral Planet, adjacent to Solmere.
2. On a later turn, Reva plays a Generator and builds it on Ordinal Reach.
   Ordinal Reach is now controlled by Reva (Section 8.1).
3. Toma, on their own Main Phase, takes an Assault action against Ordinal
   Reach. The only path from a Planet Toma controls (Kethis) to Ordinal Reach
   runs Kethis, through a Wormhole Toma had separately Discovered to Solmere,
   to Solmere, then the Length-2 Wormhole on to Ordinal Reach; Toma pays
   Fount Points equal to the sum of both Wormholes' Lengths on that path.
   Toma controls a Unit with combat strength 3 located at Ordinal Reach,
   more than enough to meet the Planet's single Generator, and chooses to
   Blockade rather than Capture: the Unit's 3 combat strength is dealt as
   damage to Ordinal Reach, at least the 1 Generator required (Section 8.6).
   Ordinal Reach is now Blockaded: starting with Reva's next Generation
   Phase, the Generator there stops producing Fount Points, though it is
   not destroyed and Reva still controls the Planet.
4. Reva does not clear the Blockade (that would cost Fount Points equal to
   Toma's Assault, paid during Reva's own Main Phase). On a following turn,
   Toma's Unit is still located at Ordinal Reach; Toma takes a second
   Assault action along the same path, paying the Fount Point cost again,
   and this time chooses to Capture: the Unit again deals its combat
   strength as damage to Ordinal Reach, once more meeting the 1-Generator
   requirement (Section 8.6). Control of Ordinal Reach passes to Toma
   immediately, and Reva's Generator there is destroyed, moved to Reva's
   Wreck. Reva may later replay a Generator, but only on a Planet Reva still
   controls, and only one per turn (Section 5.3).
```

---

## Edit 6 — test/design-battlefield.test.js — append new tests

After the last existing test in the file (the `AC4: no existing numbered
section is removed or renumbered...` block, currently ending at line 201),
append:

```js

// ---------------------------------------------------------------------------
// Reconciliation ACs (this unit): Section 8's four review-note spots are
// resolved into clean numbered prose, with no raw comment or strikethrough
// markup left in Section 8, and 8.4's Unit-type Restriction no longer
// claims to be inert. Scoped to Section 8's body, not the whole document —
// see plan.md GATE item 1 for why.
// ---------------------------------------------------------------------------

test('Reconciliation AC1: Section 8 contains no strikethrough tags or raw "//" comment lines', () => {
  const body = battlefieldBody();
  assert.ok(body, 'expected a Spatial Battlefield section');
  assert.ok(!/<strikethrough>/i.test(body), 'expected no <strikethrough> tags left in Section 8');
  assert.ok(!/<\/strikethrough>/i.test(body), 'expected no </strikethrough> tags left in Section 8');
  assert.ok(!/^\s*\/\//m.test(body), 'expected no raw "//" comment lines left in Section 8');
});

test('Reconciliation AC2: Section 8.1 states a Unit has a tracked location at a specific Planet', () => {
  const body = battlefieldProse();
  assert.ok(
    /unit's \*{0,2}location\*{0,2} is a planet/i.test(body) || /located at exactly one planet/i.test(body),
    'expected Section 8 to state a Unit is located at a specific Planet'
  );
});

test("Reconciliation AC2: 8.4's Unit-type Restriction no longer claims to be inert or for future cards only", () => {
  const body = battlefieldProse();
  assert.ok(!/exists for future cards/i.test(body), 'expected the "exists for future cards" framing to be removed');
  assert.ok(
    !/design space this rulebook leaves open/i.test(body),
    'expected the "leaves open" framing to be removed'
  );
  assert.ok(
    /may not move across that wormhole/i.test(body),
    'expected the Unit-type Restriction to state it blocks Unit movement, as a current mechanic'
  );
});

test('Reconciliation AC3: Discovery cost inverts Length (shorter costs more) for Discoveries of the same kind', () => {
  const body = battlefieldProse();
  assert.ok(
    /10 minus the new wormhole's length/i.test(body),
    "expected the Discovery cost formula to invert Length (10 minus the new Wormhole's Length)"
  );
  assert.ok(
    /twice|double/i.test(body),
    'expected Contested Discovery to still cost double a Frontier Discovery of the same Length'
  );
});

test('Reconciliation AC4: Blockading requires Units located at the target Planet dealing damage >= Generator count', () => {
  const body = battlefieldProse();
  const blockadeIdx = body.search(/\*\*blockade\*\* the target planet/i);
  assert.notStrictEqual(blockadeIdx, -1, 'expected a Blockade bullet in Section 8.6');
  const blockadeText = body.slice(blockadeIdx, blockadeIdx + 500);
  assert.ok(/located.{0,40}target planet/i.test(blockadeText), 'expected Blockade to require Units located at the target Planet');
  assert.ok(
    /damage.{0,120}number of generators/i.test(blockadeText),
    "expected Blockade to require damage totaling at least the Planet's Generator count"
  );
});

test('Reconciliation AC4: Capturing an already-Blockaded Planet requires dealing that damage total again', () => {
  const body = battlefieldProse();
  const captureIdx = body.search(/\*\*capture\*\* the target planet/i);
  assert.notStrictEqual(captureIdx, -1, 'expected a Capture bullet in Section 8.6');
  const captureText = body.slice(captureIdx, captureIdx + 500);
  assert.ok(
    /damage.{0,120}generator count once again|generator count once again/i.test(captureText),
    'expected the Capture bullet to require dealing the same damage total again'
  );
});
```

Nothing else in the test file changes — the pre-existing tests (AC1-AC4 in
the file's own numbering, unrelated to this unit's AC1-AC4) are untouched
and are exactly what covers this unit's held-out AC5: they already assert
Blockade halts Generator production, Capture destroys the Generator into
the Wreck, wormholes stay restrictable by direction/team/unit-type, and
Sections 1-7 stay unchanged and in order before Section 8. All five edits
above were written to keep those exact phrases (`stops producing`,
`destroyed`, `wreck`, `directional restriction`, `team restriction`,
`unit-type restriction`, `twice`/`double`) intact, so they keep passing
unmodified.

---

## Verification

Run, from the repo root:

```
node --test
```

Expected output: the final summary line reports `# fail 0` (some non-zero
`# pass` count; do not hard-code an exact total since other unrelated test
files also run). No test name containing "Reconciliation" or from
`design-battlefield.test.js` should appear under a `not ok` line.

For a faster, scoped check while iterating:

```
node --test test/design-battlefield.test.js
```

Expected: every test in the file reports `ok`, including the 6 new
`Reconciliation AC*` tests and every pre-existing test in the file
(AC1-AC4 numbering as already present, unrelated to this unit's own
AC-numbering in unit.md).

As a manual sanity check after editing, confirm no comment/strikethrough
markup remains in Section 8:

```
grep -n "//" design/rules.md | grep -v "https\?://"
grep -n "strikethrough" design/rules.md
```

Expected: the first command shows only the 7 pre-existing Section 5.2/5.4
lines (275, 290, 294-298, 300) — none from Section 8. The second command
shows no output at all.

---

## Risk self-assessment (FIRE matrix)

- **F**ix scope / **R**eversibility: trivial. Plain-text prose edits to one
  Markdown file plus one test file, fully tracked by git; a `git revert`
  undoes everything. No build step, no deploy, no runtime code path.
- **I**mpact if wrong: low blast radius technically (nothing executes this
  document; wrong prose just needs a follow-up edit), but the unit's whole
  purpose is rules-text correctness, so a wrong call on GATE items 2-4
  ships an internally-inconsistent rulebook, which is precisely the T9
  defect class this unit is meant to eliminate. That's why this is gated
  rather than silently decided.
- **Security**: none. No executable code, no user input, no secrets.
- **User data / schema**: none. No database, no card data files touched.

Overall: mechanically low-risk, interpretively high-stakes — hence
`GATE: confirm` at the top rather than `GATE: none`.


## Findings

# Blind Review — cardgame-spatial-rules-notes-reconciliation, cycle 3

Cycle 2's blocking finding (Section 2 Glossary's Assault/Capture entries still stated an Assault
*always* Blockades/Captures, contradicting the new conditional 8.6 mechanic) has been fixed:
commit 9083cb0 softened the Glossary's `**Assault**`, `**Blockade**`, `**Capture**` entries to
"attempts to Blockade or Capture its target, succeeding only if..." / "the state of a Planet,
reached by a successful Assault..." / "the result of a further, successful Assault...". Verified
directly against the current diff and file — Section 2 and Section 8.6 now agree that success is
conditional. Note this edit does touch Section 2, technically outside this unit's stated "only
design/rules.md['s Section 8] ... no other rules.md section... is touched" boundary — but it was
necessary to avoid re-introducing the exact contradiction cycle 2 flagged, so I'm treating it as
the correct call, not a new defect.

## AC-by-AC accounting

**AC1** (no `<strikethrough>` tags, no `//` comment lines anywhere in the document): No
`<strikethrough>` tags remain anywhere in the file (0 matches). Within Section 8, no `//` lines
remain either (0 matches, design/rules.md:394-650). Read fully literally ("anywhere in the
document"), it is still not met: 7 raw `//` lines remain outside Section 8 — design/rules.md
lines 277, 292, 296-300, 302 (Sections 5.2/5.4, pre-existing, untouched by any cycle of this
diff). This exact gap was already surfaced in cycle 1/2 review and in plan.md's GATE item 1,
which reasons that those notes carry no RouterBox resolution (unlike the four Section 8 spots
this unit charters) and that the intent's own scope boundary ("no other rules.md section... is
touched") is incompatible with literally satisfying AC1 without deleting un-actioned design notes
or fabricating resolutions for them. Pre-existing, previously-disclosed, unchanged by this cycle
— not gating.

**AC2** (8.1 states a Unit has a tracked location at a specific Planet; 8.4's Unit-type
Restriction no longer says it's inert/future-cards-only): Textually met — 8.1 adds "A Unit's
**location** is a Planet: at every moment a Unit is on the Field... it is located at exactly one
Planet," and 8.4 drops the "exists for future cards... design space this rulebook leaves open"
framing for "a Unit whose printed type does not match a Wormhole's Unit-type Restriction MAY NOT
move across that Wormhole." See INTRODUCED finding below: the mechanic these two edits describe
(a Unit's location actually changing) has no rule anywhere defining how it happens.

**AC3** (Discovery cost inverted — shorter Length costs more, same-kind; Contested = 2x Frontier
of same Length): Met, with the same narrow, previously-disclosed gap noted in plan.md GATE item 2
and cycle 2's review: `Frontier cost = max(10 − Length, 1)` reproduces RouterBox's exact worked
pairs for Length 1-9 and Contested still costs exactly double Frontier at the same Length, but
the floor means Length ≥ 9 Wormholes all tie at cost 1 (a narrow miss against a fully literal
"lesser Length always costs strictly more" reading). Named and justified before the build ran,
unchanged this cycle — not gating.

**AC4** (Blockade requires the assaulting challenger's Units located at the target Planet to deal
damage ≥ the Planet's Generator count; Capture requires meeting that requirement again): Met
textually — both bullets in the rewritten 8.6 state the requirement, and Section 8.7's worked
example demonstrates a Blockade then a Capture using a Unit's combat strength as the damage
source. See INTRODUCED finding below: the worked example itself depicts a Unit in a location the
rules as written cannot place it in.

## Findings

### INTRODUCED — Sections 8.1/8.4 assert Unit movement as a live, current mechanic, but no rule anywhere in the document defines the action that performs it

**File:** design/rules.md, Section 8.1 (~line 419-431) and Section 8.4 (~line 500-506), exercised
by Section 8.7's worked example (~line 596-598).

**Summary:** Before this diff, Section 8.1 explicitly disclaimed a unit-movement system
("...a Unit's location is not tracked by this section, and Length has no effect beyond the two
costs just named unless a future card or rule says otherwise") — internally consistent, since no
movement rule existed and none was claimed to. This diff replaces that with "a Unit's location
changes only when it moves from that Planet to an adjacent one... across a Wormhole that is not
Closed... and does not carry a Restriction... forbidding that Unit's controller, direction of
travel, or type," and 8.4 rewrites the Unit-type Restriction to say it "instead governs a Unit's
actual movement between Planets." Movement is now asserted as real (matching the unit's own
intent: "Unit location is now a real, current mechanic per the corrected 8.1"). But no numbered
rule anywhere in the document — not 8.1, not 8.6 (which explicitly says Assault "does not move a
Unit"), not Section 5's turn structure, not Section 12's Combat Resolution — actually grants a
challenger an action that moves a Unit: no timing, no phase, no cost, no once-per-turn limit. The
only placement rule that exists anywhere is "a Unit enters the Field located at a Planet its
controller controls" (initial deployment only).

**Failure scenario:** Section 8.7's worked example (rewritten by this same diff to demonstrate
AC4) states "Toma controls a Unit with combat strength 3 located at Ordinal Reach." Ordinal Reach
is a Planet Reva controls at that point in the example (established one step earlier — "Ordinal
Reach is now controlled by Reva"), not Toma. Toma's Unit cannot have arrived there via the only
placement rule in the document (enter the Field at a Planet its controller already controls), so
per 8.1's new text it must have moved there across a Wormhole — but the example never narrates
that move, and no rule anywhere states what action a challenger takes to cause it, when they may
take it, or what it costs. The document's own flagship illustration of the AC2/AC4 mechanics
depicts a game state the rules as written cannot legally produce.

This also leaves the neighboring Directional and Team Restrictions in a newly ambiguous spot:
both were written when Assault-path traversal was the only thing a Restriction could gate, and
their text still only speaks in terms of Assault paths (e.g., "the opposing challenger's
Assaults... MAY NOT count that Wormhole as part of a path"). Now that Unit-type Restriction has
been carved out to instead govern the new Unit-movement mechanic, whether Directional/Team
Restrictions also constrain that movement (or only ever constrained Assault paths) is unstated.

**Suggested fix:** Either (a) add a numbered rule defining the Move action (phase/timing, cost if
any, once-per-turn or unlimited, whose priority) and use it in the 8.7 example, or (b) if a full
Move action is intentionally out of this unit's charter, scope 8.1/8.4's language back to "a
Unit's location, once placed, does not change under any rule this section defines" — but then the
8.4 Unit-type Restriction edit and the 8.7 "located at Ordinal Reach" claim both need to be walked
back to match, since neither is legal under a no-movement reading either.

## Verdict rationale

Cycle 2's contradiction is fixed. AC1/AC3 carry the same narrow, previously-disclosed gaps as
before and aren't gating. AC2 and AC4 are textually satisfied, but the mechanic AC2 introduces (a
Unit's tracked, changeable location) is asserted without ever being made operable by any rule, and
the 8.7 worked example — itself rewritten by this diff specifically to demonstrate AC4 — depicts a
state that mechanic cannot legally reach under the rules as written. That's a concrete, introduced
contradiction (before this diff, no movement was claimed and none was needed; after, movement is
claimed as real but still has no rule), in the same defect class this unit exists to eliminate.

NEEDS_WORK


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T06:21:25.371Z] **bolt:start** — unit=cardgame-spatial-rules-notes-reconciliation start_sha=c8de43e81eb930547c73f154d340a626cd267dea branch=bolt/cardgame-spatial-rules-notes-reconciliation worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-spatial-rules-notes-reconciliation
- [2026-07-29T06:21:32.733Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T06:35:06.377Z] **plan:done** — plan.md written
- [2026-07-29T06:35:06.393Z] **gate:raised** — confirm — waiting for decision (file or API)
- [2026-07-29T06:47:42.625Z] **gate-confirm:done** — approved — Orchestrator approves all four recommended defaults: (1) AC1 scoped to Section 8 - the 5.2/5.4 // notes are RouterBox design input with no resolution attached and must NOT be deleted or resolved by invention; (2) discovery cost max(10-Length,1); (3) keep Fount-Point path cost as Assault precondition, add Unit-presence/damage as the success mechanic; (4) extend damage to Planets in 8.6 prose with explicit flag. Also honor the plan note: flag the stale playtest walkthroughs as follow-up, do not fix here.
- [2026-07-29T06:49:25.261Z] **tests:done** — RED verified on test/design-battlefield.test.js (exit=1)
- [2026-07-29T06:52:47.919Z] **build:c1** — tests green, committed
- [2026-07-29T06:55:34.548Z] **review:c1** — NEEDS_WORK
- [2026-07-29T06:58:08.671Z] **build:c2** — tests green, committed
- [2026-07-29T07:03:12.634Z] **review:c2** — NEEDS_WORK
- [2026-07-29T07:04:29.359Z] **build:c3** — tests green, committed
- [2026-07-29T07:10:01.902Z] **review:c3** — NEEDS_WORK
- [2026-07-29T07:10:01.906Z] **bolt:escalated** — circuit breaker after 3 cycles


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
