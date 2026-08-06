# cardgame-spatial-battlefield-rules: cardGame rules v2 — spatial battlefield (homeworlds, discovery, wormholes)

## Header

- unit: cardgame-spatial-battlefield-rules
- title: cardGame rules v2 — spatial battlefield (homeworlds, discovery, wormholes)
- project: cardgame
- completed: 2026-07-27
- outcome: merged
- start_sha: fa7ab5e5ca471c5fdc425eda90f822347b9212cf
- end_sha: a5707f3d48a44a7a89581b232cefb3c26aaad1a5

## Intent

Recreated after the original approved unit dir was lost with a deleted work branch. Source of truth: design/ideas-inbox.md in the cardgame repo (both RouterBox entries dated 2026-07-26) and taste T8/T9, mission I6.

Extend design/rules.md with the spatial battlefield layer RouterBox specified: the battlefield is a GRAPH — planets are nodes, wormholes are edges with a length attribute. Each player starts on a HOMEWORLD (anchor node; first generator lives there). The map GROWS during play via discovery: opening a wormhole to an unexplored world is cheaper/easier than opening one toward an enemy world (aggression pays a toll). Wormholes are typed — restrictable by direction (one-way), team (allied-only), and unit type — and can be CLOSED, making topology itself a battlefield (cut chokepoints, strand fleets, seal flanks). Generators are built on specific planets and are therefore positional: capturable, defensible, blockade-able.

Write it at the same MTG-comp-rules structural rigor as the existing rules.md sections (numbered sections, glossary-first terms, edge cases resolved on paper), as a new top-level numbered section (or sections) integrated with the existing turn structure — discovery must slot into the existing phase sequence, and the Resources section's generator rules must gain the positional layer without contradicting anything already written. Mark [incorporated: cardgame-spatial-battlefield-rules] on the two ideas-inbox entries.

## Acceptance Criteria

- AC1 [user]: design/rules.md gains numbered spatial-battlefield rules covering: planets as graph nodes, wormholes as edges with length, homeworld start, discovery of unexplored worlds cheaper than wormholes toward enemy worlds, wormhole restrictions by direction/team/unit-type, and wormhole closure.
- AC2 [user]: Generator rules are updated so generators are built on specific planets and the rules state what happens to generators when their planet is contested or lost.
- AC3 [paraphrase]: New terms (planet, wormhole, homeworld, discovery, length, closure) are defined in the glossary before substantive use, consistent with the document's glossary-first discipline.
- AC4 [inferred]: The discovery action is integrated into the existing numbered turn-phase sequence (not bolted on as an appendix), and no new rule contradicts an existing numbered rule — the existing design-rules tests still pass unmodified.
- AC5 [inferred] (held_out): Both 2026-07-26 entries in design/ideas-inbox.md are marked [incorporated: cardgame-spatial-battlefield-rules], and at least one worked example in the rules walks a discovery-then-blockade sequence on a small named graph.

## Plan

GATE: none

# Plan: cardgame-spatial-battlefield-rules

Extend `design/rules.md` with a new top-level numbered section, **8. Spatial
Battlefield**, covering the graph battlefield (planets/wormholes/length),
homeworld start, discovery economics (unexplored cheaper than enemy), typed
wormhole restrictions, and wormhole closure — plus a short **4.6 Positional
Generators** addition to the existing Resources section, one additive
sentence in **5.3 Main Phase**, nine new glossary bullets in **Section 2**,
`[incorporated: ...]` markers on the two `design/ideas-inbox.md` entries, and
a new `test/design-battlefield.test.js` covering this unit's AC1-AC5. No
other file changes. `test/design-rules.test.js`, `test/design-races.test.js`,
`test/design-world.test.js`, and `test/smoke.test.js` are not touched at all
— that is how AC4's "existing design-rules tests still pass unmodified" is
guaranteed (nothing to modify means nothing to break).

## Design decisions (read this before coding)

1. **Discovery and a new "Assault" action are both folded into the existing
   Main Phase (5.3) as additional actions, not a new phase.** Section 5's
   intro states "every turn consists of the same five phases... a turn never
   skips a phase," and Section 6 assumes exactly five phases per turn. Adding
   a sixth top-level phase would contradict that text (AC4 forbids
   contradicting an existing numbered rule). unit.md is explicit that
   "discovery must slot into the existing phase sequence," so both Discovery
   (opening a new wormhole) and Assault (the mechanism that makes "what
   happens when a generator's planet is contested/lost," AC2, concrete) are
   defined as single-per-turn, Main-Phase-only, Queue-empty-and-priority-gated
   actions — mirroring the existing "one Generator per turn" and "Slow card"
   timing rules already in 5.3, rather than inventing new timing categories.
2. **Generators are positional; Units are not.** unit.md's phrase is
   "Generators are built on specific planets and are therefore positional:
   capturable, defensible, blockade-able" — it does not ask for a
   unit-movement/stationing system, and this ruleset currently has no
   per-Unit location concept at all (the Field is one shared zone; Section
   5.4's Conflict Phase declares attackers/blockers with no location
   involved). Bolting a full movement system onto Units to make "Blockade" or
   "Capture" work would both overbuild past what was asked and risk
   contradicting 5.4's literal "an attacking Unit that is unblocked deals its
   combat strength as damage to the non-active player's Core Integrity" (an
   unconditional statement — redirecting some attacks at Generators instead
   would contradict it). Instead, Blockade/Capture is a **new, self-contained
   Fount-Point-paid action ("Assault")**, reachable via the wormhole graph
   (so Length/Restrictions/Closure all matter to it) but never touching
   Section 5.4's attack/block text. Unit-type Restrictions (AC1 requires
   direction/team/unit-type coverage) are defined and given rules meaning as
   a hook for *future* cards that let Units move between planets — a design
   space this plan explicitly leaves open rather than half-building it now.
3. **Homeworld (the graph anchor) is kept explicitly distinct from home base
   / Core Integrity (the existing HP-like loss condition).** Section 2
   already defines "Home base" and "Core Integrity" as the win/loss tracker,
   unrelated to any board position. unit.md's ideas-inbox source material
   calls the Homeworld "a likely win-condition target" but that's an
   implication note for *future* units, not an AC here — merging the two
   concepts now would contradict the existing Core Integrity definition (AC4
   forbids contradicting existing numbered rules). The plan states this
   distinction explicitly in 8.2 so a future unit can build a "planet loss
   damages Core Integrity" rule on top without this one having already
   quietly changed what Core Integrity means.
4. **Losing a planet destroys the Generator on it (to Wreck); it does not
   flip the Generator to the opponent's control.** ideas-inbox's own wording
   is "losing a planet can mean losing the generators on it" — "losing," not
   "the opponent gains a free generator." Destruction is also the simpler,
   less contradiction-prone reading: this ruleset has no owner/controller
   split for permanents (Field is shared, but nothing today distinguishes
   "who a permanent belongs to for keeps" from "who controls it right now"),
   so transferring a Generator's control would be a much larger structural
   change than this unit's scope. Capture destroys; Blockade (the
   "contested" case) only suppresses production and is reversible.
5. **Discovery/Assault cost numbers (Length as cost; double for Contested
   Discovery; sum-of-Lengths for Assault) are this plan's concrete proposal
   for "cheaper/easier" (AC1) and are testable, but they are a game-balance
   choice, not dictated word-for-word by unit.md.** unit.md only requires
   that discovery toward the unexplored be cheaper than discovery toward an
   enemy; "twice the Length" is the simplest relation that is unambiguously
   cheaper/costlier and easy to verify on paper. Flag for review if a
   different multiplier is wanted — nothing else in the plan depends on the
   exact multiplier being 2x.

## Files touched

- EDIT `design/rules.md` — 4 edits (glossary append, Resources append, one
  Main Phase sentence, new Section 8 appended at end of file).
- EDIT `design/ideas-inbox.md` — 2 edits (incorporation markers on both
  2026-07-26 headings).
- NEW `test/design-battlefield.test.js` — `node --test` coverage for this
  unit's AC1-AC5.

Do not touch `test/design-rules.test.js`, `test/design-races.test.js`,
`test/design-world.test.js`, `test/smoke.test.js`, `test/helpers/markdown.js`,
`design/world.md`, or anything under `design/races/`. No AC asks for changes
there, and AC4 explicitly requires the existing design-rules tests to keep
passing unmodified.

---

## 1. EDIT `design/rules.md` — append 9 glossary bullets (Section 2)

Find (the end of Section 2, currently the last bullet plus the following
heading):

```
- **Trigger / Triggered ability** — an ability that is added to the Queue
  automatically when its stated condition happens, rather than being played by a
  challenger's choice.

## 3. Zones
```

Replace with (same two lines, plus 9 new bullets inserted before the `## 3.
Zones` heading — note every new term is bolded alone, matching the file's
existing "**Term** — definition" convention, so the AC3 glossary regex
matches each one):

```
- **Trigger / Triggered ability** — an ability that is added to the Queue
  automatically when its stated condition happens, rather than being played by a
  challenger's choice.
- **Planet** — a node in the battlefield graph (Section 8.1); some Planets
  are on the graph from the start of the game, others begin Unexplored and
  enter the graph only through Discovery.
- **Wormhole** — an edge in the battlefield graph (Section 8.1), connecting
  exactly two Planets and carrying a Length.
- **Length** — a positive integer, set when a Wormhole is opened, that fixes
  the Fount Point cost of opening that Wormhole (Section 8.3) and of an
  Assault that uses it (Section 8.6).
- **Control (of a Planet)** — a Planet is controlled by whichever challenger
  most recently built a Generator on it, Discovered it, or Captured it
  (Section 8.1, Section 8.6); a Planet on the graph controlled by neither
  challenger is Neutral.
- **Homeworld** — the one Planet each challenger controls from the start of
  the game (Section 8.2): the anchor of their side of the battlefield graph,
  and the Planet their first Generator must be built on.
- **Discovery** — the action of opening a new Wormhole from a Planet a
  challenger controls to another Planet, adding it to the battlefield graph
  (Section 8.3).
- **Restriction** — a stated limit, carried by a Wormhole, on the direction,
  team, or unit type that may use it (Section 8.4).
- **Closure** — the permanent removal of a Wormhole from the battlefield
  graph (Section 8.5); a Closed Wormhole cannot be traversed, restricted, or
  reopened.

## 3. Zones
```

## 2. EDIT `design/rules.md` — append `4.6 Positional Generators` (Section 4)

Find (the end of Section 4, currently the last Fount subsection plus the
following heading):

```
### 4.5 The Skein

Generators attuned to the Skein produce **Skein Points**. A challenger may
spend Skein Points equal to the number of entries currently in the Queue to
move one of their own entries already in the Queue to the front, so that it
resolves next, ahead of anything else waiting. This is how the Skein
renegotiates cause and effect rather than obeying it.

## 5. Turn Structure
```

Replace with (same text, plus a new `4.6` subsection inserted before the
`## 5. Turn Structure` heading):

```
### 4.5 The Skein

Generators attuned to the Skein produce **Skein Points**. A challenger may
spend Skein Points equal to the number of entries currently in the Queue to
move one of their own entries already in the Queue to the front, so that it
resolves next, ahead of anything else waiting. This is how the Skein
renegotiates cause and effect rather than obeying it.

### 4.6 Positional Generators

Every Generator is built on a specific Planet (Section 8.1), chosen when it
is played; a challenger's first Generator MUST be built on their Homeworld
(Section 8.2), and a Generator's Planet never changes once played. Because
Generators sit on Planets, and Planets are Blockade-able and Capturable
(Section 8.6), a Generator surviving being played is not the same as it
producing forever — Section 8.6 states exactly what happens to a Generator
when its Planet is contested (Blockaded) or lost (Captured).

## 5. Turn Structure
```

## 3. EDIT `design/rules.md` — one additive sentence in `5.3 Main Phase`

Find (the entire 5.3 subsection plus the following heading — matched in full
so the insertion point is unambiguous):

```
### 5.3 Main Phase

The active player MAY play any number of Slow cards from their Hand, one
Generator at most per turn, paying each card's cost from their resource pools as
they play it. The active player MAY also play Fast cards and use activated
abilities here. Both players MAY take Fast actions here once the active player has
passed priority (Section 6). No player MAY play more than one Generator in a
single turn, and a challenger MAY NOT play a Slow card unless the Queue is empty
and it is their priority.

### 5.4 Conflict Phase
```

Replace with (same paragraph, one sentence appended at the end — nothing
before it changes):

```
### 5.3 Main Phase

The active player MAY play any number of Slow cards from their Hand, one
Generator at most per turn, paying each card's cost from their resource pools as
they play it. The active player MAY also play Fast cards and use activated
abilities here. Both players MAY take Fast actions here once the active player has
passed priority (Section 6). No player MAY play more than one Generator in a
single turn, and a challenger MAY NOT play a Slow card unless the Queue is empty
and it is their priority. The active player MAY also take one Discovery action
and one Assault action here (Sections 8.3 and 8.6), each at most once per turn
and under the same restriction as a Slow card: neither MAY be taken unless the
Queue is empty and it is the active player's priority.

### 5.4 Conflict Phase
```

## 4. EDIT `design/rules.md` — append new Section 8 at the end of the file

The file currently ends with Section 7's closing paragraph:

```
This confirms, on paper, that in this rules set the last Fast card played is
always the first to resolve — exactly the ordering the Simultaneous Triggers edge
case in Section 6.1 and the general passing rule both depend on.
```

Append the following as new content directly after that paragraph (i.e. at
the very end of the file, with one blank line separating it from the
existing last paragraph):

```

## 8. Spatial Battlefield

In addition to the zones of Section 3, the game has a second, separate
structure: the battlefield graph. Nothing in this section changes any rule
already stated in Sections 1-7; it adds a spatial layer on top of them.

### 8.1 Planets & Wormholes

The battlefield graph is made of Planets (nodes) and Wormholes (edges). A
Planet is not a zone, and standing "on" a Planet has no bearing on which of
the five zones (Section 3) a card is in.

- A **Planet** is a node in the battlefield graph. Some Planets are on the
  graph from the start of the game (each challenger's Homeworld, Section
  8.2); others begin **Unexplored** — not yet on the graph at all — and are
  only added to it by Discovery (Section 8.3).
- A **Wormhole** is an edge in the battlefield graph, connecting exactly two
  Planets. Every Wormhole has a **Length**: a positive integer set when the
  Wormhole is opened (Section 8.3). Length fixes the Fount Point cost of the
  Discovery that opens the Wormhole (Section 8.3) and the Fount Point cost of
  an Assault that uses it (Section 8.6). This rulebook does not define a
  general unit-movement system across Wormholes; a Unit's location is not
  tracked by this section, and Length has no effect beyond the two costs just
  named unless a future card or rule says otherwise.
- A Planet is **controlled** by whichever challenger most recently built a
  Generator on it, Discovered it, or Captured it (Section 8.6). A Planet on
  the graph controlled by neither challenger is **Neutral**. Each
  challenger's Homeworld is controlled by them from the start of the game and
  can never become Neutral or change control (Section 8.2, Section 8.6).
- Two Planets are **adjacent** if a Wormhole that is not Closed (Section 8.5)
  connects them directly. A **path** between two Planets is an unbroken
  sequence of adjacent Planets.

### 8.2 Homeworlds

Each challenger begins the game controlling exactly one Planet: their
**Homeworld**. The two challengers' Homeworlds are never adjacent at the
start of the game — no Wormhole connects them until Discovery (Section 8.3)
builds a path between them. A challenger's first Generator MUST be built on
their Homeworld (Section 4.6); every Generator played after that MAY be built
on any Planet that challenger controls.

A Homeworld is distinct from a challenger's home base (Core Integrity,
Section 2): Core Integrity is an abstract measure of a challenger's
civilization, reduced only by damage, and is never directly changed by which
Planets a challenger controls. A Homeworld MAY be Blockaded (Section 8.6) but
MAY NOT be Captured, and MAY NOT change control by any rule or ability in
this game.

### 8.3 Discovery

Once per turn, during their Main Phase, while the Queue is empty and they
hold priority — the same timing restriction that governs playing a Slow card
(Section 5.3) — the active player MAY take one **Discovery** action, opening
exactly one new Wormhole. To do so:

1. Choose an origin Planet the active player controls.
2. Choose a destination Planet and, with it, which kind of Discovery this is:
   a **Frontier Discovery**, whose destination is an Unexplored Planet not
   yet on the battlefield graph; or a **Contested Discovery**, whose
   destination is any Planet already on the graph that the active player does
   not control (Neutral, or controlled by the opponent).
3. Choose the new Wormhole's Length: any positive integer. There is no fixed
   table of lengths — a longer Wormhole simply costs more, per the next step.
4. Pay the cost, from any combination of the active player's resource pools:
   a Frontier Discovery costs Fount Points equal to the new Wormhole's
   Length; a Contested Discovery costs twice that — Fount Points equal to
   double the new Wormhole's Length. This is the toll aggression pays:
   reaching into unclaimed space is the cheap path, reaching into space the
   opponent already holds costs double.
5. The new Wormhole is added to the battlefield graph, connecting the origin
   and destination Planets, with no Restrictions (Section 8.4) and not
   Closed (Section 8.5). If the destination was Unexplored, it enters the
   graph as a Neutral Planet — Discovery alone does not grant control of it
   (Section 8.1).

A challenger MAY NOT take more than one Discovery action per turn, and MAY
NOT take one unless the Queue is empty and it is their priority. Discovery is
not a card and does not use the Queue.

### 8.4 Wormhole Restrictions

A Wormhole MAY carry any number of Restrictions, granted by whatever card or
effect creates or modifies it. A new Wormhole opened by Discovery starts with
none (Section 8.3).

- A **Directional Restriction** limits a Wormhole to being traversed from one
  named Planet toward the other only, never the reverse. A Wormhole with no
  Directional Restriction may be traversed either way — this is the default.
- A **Team Restriction** limits passage through a Wormhole to a stated
  challenger and their allies; the opposing challenger's Assaults (Section
  8.6) MAY NOT count that Wormhole as part of a path.
- A **Unit-type Restriction** limits passage through a Wormhole to
  permanents of a stated type (for example, "Biology-only"). This rulebook's
  Assault action (Section 8.6) does not move a Unit and is therefore never
  affected by a Unit-type Restriction; the Restriction exists for future
  cards that let a Unit move or deploy between Planets, a design space this
  rulebook leaves open.

A Directional, Team, or Unit-type Restriction on a Wormhole never changes
that Wormhole's Length or its Closed/un-Closed state, and a Wormhole may
carry more than one Restriction of different kinds at once.

### 8.5 Wormhole Closure

A Wormhole MAY be Closed, by whatever card or effect states it — this
rulebook defines no default action that Closes a Wormhole on its own; Closure
is a capability granted to card design, not a base action any challenger may
always take. Once a Wormhole is Closed:

- It is removed from the battlefield graph; the two Planets it connected are
  no longer adjacent unless a different, un-Closed Wormhole also connects
  them.
- It MAY NOT be traversed, MAY NOT be counted along an Assault path (Section
  8.6), and MAY NOT have its Restrictions added, removed, or changed.
- It MAY NOT be reopened. A new Wormhole between the same two Planets
  requires a new Discovery action (Section 8.3), paid for again in full, and
  enters play with no Restrictions of its own, regardless of what the Closed
  Wormhole once carried.

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

### 8.7 Worked Example: Discovery, Blockade, and Capture

This example follows Reva (Homeworld: Solmere) and Toma (Homeworld: Kethis)
across several turns, on a graph that starts as just those two Homeworlds
with no Wormhole between them.

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

This confirms, on paper, that a Planet's Generator can be pressured without
being destroyed (Blockade) and only lost outright through a second, further
Assault (Capture) — and that reaching an enemy Planet costs strictly more
Fount Points the farther the qualifying path runs, exactly as Section 8.6
states.
```

---

## 5. EDIT `design/ideas-inbox.md` — incorporation markers

Find:

```
## 2026-07-26 — Spatial layer: planets, wormholes, generator placement
```

Replace:

```
## 2026-07-26 — Spatial layer: planets, wormholes, generator placement [incorporated: cardgame-spatial-battlefield-rules]
```

Find:

```
## 2026-07-26 (later) — Homeworlds, discovery, wormhole control
```

Replace:

```
## 2026-07-26 (later) — Homeworlds, discovery, wormhole control [incorporated: cardgame-spatial-battlefield-rules]
```

---

## 6. NEW `test/design-battlefield.test.js`

Full file content:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection } = require('./helpers/markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const INBOX_PATH = path.join(__dirname, '..', 'design', 'ideas-inbox.md');

function readRules() {
  return fs.readFileSync(RULES_PATH, 'utf8');
}

function readInbox() {
  return fs.readFileSync(INBOX_PATH, 'utf8');
}

function topLevelSections(content) {
  const sections = parseSections(content);
  return sections
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title));
}

function battlefieldBody() {
  const content = readRules();
  const sections = parseSections(content);
  return sectionText(sections, /spatial battlefield/i);
}

// ---------------------------------------------------------------------------
// AC1: numbered spatial-battlefield rules covering planets as nodes,
// wormholes as edges with length, homeworld start, discovery cheaper for
// unexplored than enemy worlds, wormhole restrictions (direction/team/unit
// type), and wormhole closure.
// ---------------------------------------------------------------------------

test('AC1: rules.md has a numbered top-level Spatial Battlefield section', () => {
  const sections = topLevelSections(readRules());
  const found = sections.some((s) => /spatial battlefield/i.test(s.title));
  assert.ok(
    found,
    `expected a numbered top-level heading mentioning "Spatial Battlefield" among [${sections.map((s) => s.title).join(', ')}]`
  );
});

test('AC1: the top-level numbered sections remain in strict sequence starting at 1', () => {
  const sections = topLevelSections(readRules());
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strict numbering, got [${numbers.join(', ')}]`);
  }
});

test('AC1: covers planets as graph nodes and wormholes as edges with a length attribute', () => {
  const body = battlefieldBody();
  assert.ok(body, 'expected a Spatial Battlefield section');
  assert.ok(/\bnode\b/i.test(body) && /\bplanet\b/i.test(body), 'expected planets described as graph nodes');
  assert.ok(/\bedge\b/i.test(body) && /\bwormhole\b/i.test(body), 'expected wormholes described as graph edges');
  assert.ok(/\blength\b/i.test(body), 'expected wormholes to carry a Length attribute');
});

test('AC1: covers homeworld start', () => {
  const body = battlefieldBody();
  assert.ok(/homeworld/i.test(body), 'expected homeworld rules');
  assert.ok(
    /begins? the game controlling|start(s|ing)? the game/i.test(body),
    'expected an explicit statement that challengers start the game on their Homeworld'
  );
});

test('AC1: discovering an unexplored world costs less than discovering toward an enemy/contested world', () => {
  const body = battlefieldBody();
  assert.ok(
    /frontier discovery/i.test(body) && /contested discovery/i.test(body),
    'expected both a Frontier and a Contested Discovery variant'
  );
  assert.ok(
    /twice|double|2x|x2/i.test(body),
    'expected the Contested Discovery cost to be stated as a multiple of the Frontier cost'
  );
});

test('AC1: wormholes can be restricted by direction, team, and unit type', () => {
  const body = battlefieldBody();
  assert.ok(/directional restriction|one-way/i.test(body), 'expected a direction-based restriction');
  assert.ok(/team restriction|allied/i.test(body), 'expected a team-based restriction');
  assert.ok(/unit-type restriction/i.test(body), 'expected a unit-type restriction');
});

test('AC1: wormholes can be closed, and closure removes the edge from the graph', () => {
  const body = battlefieldBody();
  assert.ok(/\bclosed\b/i.test(body) && /\bclosure\b/i.test(body), 'expected Closure rules');
  assert.ok(
    /removed from the battlefield graph|no longer adjacent/i.test(body),
    'expected Closure to remove the wormhole as a graph edge'
  );
});

// ---------------------------------------------------------------------------
// AC2: Generator rules updated - built on a specific planet, plus what
// happens to a Generator when its planet is contested or lost.
// ---------------------------------------------------------------------------

test('AC2: the Resources section states Generators are built on a specific planet', () => {
  const content = readRules();
  const sections = parseSections(content);
  const body = sectionText(sections, /resources/i);
  assert.ok(body, 'expected a Resources section');
  assert.ok(
    /built on/i.test(body) && /planet/i.test(body),
    'expected Resources to state Generators are built on a specific planet'
  );
});

test('AC2: rules state what happens to a Generator when its planet is contested (Blockaded)', () => {
  const body = battlefieldBody();
  assert.ok(/blockad/i.test(body), 'expected Blockade rules');
  assert.ok(/stops? producing|does not produce/i.test(body), 'expected Blockade to halt Generator production');
});

test('AC2: rules state what happens to a Generator when its planet is lost (Captured)', () => {
  const body = battlefieldBody();
  assert.ok(/captur/i.test(body), 'expected Capture rules');
  assert.ok(/destroyed/i.test(body) && /wreck/i.test(body), 'expected Capture to destroy the Generator, moved to the Wreck');
});

// ---------------------------------------------------------------------------
// AC3: new terms defined in the glossary before substantive use.
// ---------------------------------------------------------------------------

const NEW_GLOSSARY_TERMS = ['planet', 'wormhole', 'homeworld', 'discovery', 'length', 'closure'];

for (const term of NEW_GLOSSARY_TERMS) {
  test(`AC3: the Glossary/Vocabulary section defines "${term}"`, () => {
    const content = readRules();
    const sections = parseSections(content);
    const glossary = sectionText(sections, /glossary|vocabulary/i);
    assert.ok(glossary, 'expected a Glossary/Vocabulary section');
    const re = new RegExp(`\\*\\*[^*\\n]*\\b${term}s?\\b[^*\\n]*\\*\\*`, 'i');
    assert.ok(re.test(glossary), `expected a bolded glossary entry defining "${term}"`);
  });
}

test('AC3: the Glossary/Vocabulary section precedes the Spatial Battlefield section', () => {
  const sections = topLevelSections(readRules());
  const glossaryIdx = sections.findIndex((s) => /glossary|vocabulary/i.test(s.title));
  const battlefieldIdx = sections.findIndex((s) => /spatial battlefield/i.test(s.title));
  assert.notStrictEqual(glossaryIdx, -1, 'expected a Glossary/Vocabulary section');
  assert.notStrictEqual(battlefieldIdx, -1, 'expected a Spatial Battlefield section');
  assert.ok(glossaryIdx < battlefieldIdx, 'expected Glossary to precede Spatial Battlefield');
});

// ---------------------------------------------------------------------------
// AC4: discovery integrated into the existing turn-phase sequence, not
// bolted on as an appendix (still exactly 5 phases).
// ---------------------------------------------------------------------------

test('AC4: the Main Phase references Discovery as an in-phase action', () => {
  const content = readRules();
  const sections = parseSections(content);
  const mainPhase = sectionText(sections, /main phase/i);
  assert.ok(mainPhase, 'expected a Main Phase section');
  assert.ok(/discovery action/i.test(mainPhase), 'expected the Main Phase to reference the Discovery action');
});

test('AC4: Turn Structure still lists exactly 5 phases (Discovery is not a bolted-on 6th phase)', () => {
  const content = readRules();
  const sections = parseSections(content);
  const turnIdx = findSection(sections, /turn structure/i);
  assert.notStrictEqual(turnIdx, -1, 'expected a Turn Structure section');
  const turnLevel = sections[turnIdx].level;
  const phaseHeadings = [];
  for (let i = turnIdx + 1; i < sections.length; i++) {
    if (sections[i].level <= turnLevel) break;
    if (/^\d+\.\d+/.test(sections[i].title)) phaseHeadings.push(sections[i]);
  }
  assert.strictEqual(
    phaseHeadings.length,
    5,
    `expected exactly 5 phase sub-headings, found ${phaseHeadings.length}: ${phaseHeadings.map((s) => s.title).join(', ')}`
  );
});

// ---------------------------------------------------------------------------
// AC5 (held_out): both 2026-07-26 ideas-inbox entries marked incorporated;
// a worked example walks a discovery-then-blockade sequence on a small
// named graph.
// ---------------------------------------------------------------------------

test('AC5: both 2026-07-26 ideas-inbox entries are marked [incorporated: cardgame-spatial-battlefield-rules]', () => {
  const content = readInbox();
  const sections = parseSections(content);
  const entryHeadings = sections.filter((s) => s.level === 2 && /^2026-07-26/.test(s.title));
  assert.strictEqual(
    entryHeadings.length,
    2,
    `expected exactly 2 headings starting "2026-07-26", found ${entryHeadings.length}`
  );
  for (const h of entryHeadings) {
    assert.ok(
      /\[incorporated: cardgame-spatial-battlefield-rules\]/.test(h.title),
      `expected "${h.title}" to be marked incorporated`
    );
  }
});

test('AC5: rules.md contains a worked example walking a discovery-then-blockade sequence on a small named graph', () => {
  const sections = parseSections(readRules());
  const allWorkedExamples = sections.filter((s) => /worked example/i.test(s.title));
  assert.ok(
    allWorkedExamples.length >= 2,
    'expected at least one new worked-example heading in addition to the existing Section 7 example'
  );
  const body = battlefieldBody();
  assert.ok(/discover/i.test(body) && /blockad/i.test(body), 'expected a discovery-then-blockade walkthrough');
  assert.ok(/homeworld/i.test(body), 'expected the walkthrough to reference Homeworlds');
});
```

Expected output: `node --test test/design-battlefield.test.js` → all tests
pass (`# fail 0`).

---

## Verification

1. `node --test` from the repo root — expected: every existing suite
   (`test/smoke.test.js`, `test/design-rules.test.js`,
   `test/design-races.test.js`, `test/design-world.test.js`) still passes
   exactly as before, plus the new `test/design-battlefield.test.js` passes
   in full. Total pass count increases by the number of new tests (21), `#
   fail 0`.
2. `git diff --stat test/design-rules.test.js test/design-races.test.js
   test/design-world.test.js test/smoke.test.js test/helpers/markdown.js` —
   expected: empty output (no changes to any existing test file), which is
   how AC4's "existing design-rules tests still pass unmodified" is
   satisfied literally, not just functionally.
3. Manual read-through of `design/rules.md` top to bottom: sections numbered
   1 through 8 with no gaps or repeats; Section 2 (Glossary) still precedes
   every other numbered section; Section 8's six subsections (8.1-8.6) plus
   worked example (8.7) read as continuous prose with no contradiction of
   Sections 1-7's existing MAY/MAY NOT statements.
4. Manual read-through of `design/ideas-inbox.md`: both 2026-07-26 headings
   now end with `[incorporated: cardgame-spatial-battlefield-rules]`; no
   other entry or content in the file changed.

## Risk self-assessment (FIRE)

- **Reversibility:** high. Every change is to a markdown design document or a
  new `node --test` file; nothing executes game logic, so there is no
  runtime behavior to roll back — `git revert` undoes the entire unit
  cleanly.
- **Security impact:** none. No code path, no network/file/OS surface, no
  user input handling — pure documentation and test-of-documentation.
- **User data:** none touched or introduced.
- **Schema changes:** none — no data format, API, or file schema is defined
  or altered; this is prose rules text plus regex-based structural tests
  matching the existing test suite's own conventions.
- **Worst-case failure mode:** the new rules text is internally inconsistent
  with an existing rule, or a future unit builds on a wrong assumption (e.g.
  assumes Homeworld loss ends the game, which this plan explicitly rules
  out). Mitigated by Design decision 3 (explicit Homeworld/Core-Integrity
  separation stated in the text itself) and Design decision 2 (Assault kept
  fully separate from Section 5.4's attack/block rules, so nothing here can
  contradict them). If the game-balance numbers in Design decision 5 turn out
  wrong for actual play, that is a tuning follow-up, not a rules
  contradiction — nothing else in the plan depends on the exact multiplier.

Overall: standard risk, not ambiguous — `GATE: none`.


## Findings

# Blind Review — cardgame-spatial-battlefield-rules, cycle 2

## Method

Reviewed `design/rules.md` (full current file, read directly), the
`design/ideas-inbox.md` diff, and `test/design-battlefield.test.js` against
unit.md's visible ACs and plan.md. Also re-read the pre-existing
`test/design-rules.test.js` and the `test/helpers/markdown.js` section-parsing
helper to check whether this diff's additions to Section 2 (Glossary),
Section 4 (Resources), and Section 5.3 (Main Phase) could break any
pre-existing assertion. `node --test` could not be executed directly in this
sandbox (shell commands required an approval that wasn't available), so
pass/fail on both test files was verified by static trace against the actual
helper logic and current file content rather than by running them — a real
limitation, noted rather than glossed over.

This review is blind to the Builder's transcript; it does, however, know
this unit's own cycle-1 findings.md content (prior review output is fair game
to check against, since it documents defects, not reasoning) and confirms
below whether those specific defects still exist in the current diff.

## Cycle-1 findings re-checked

- **Finding 1 (cycle 1, gating):** Section 8.1 said Discovery grants control
  while Section 8.3 said it doesn't. **Fixed.** The current Control
  definition — both the Section 2 glossary entry (rules.md:100-103) and
  Section 8.1's bullet (rules.md:364-369) — now reads "controlled by
  whichever challenger most recently built a Generator on it **or Captured
  it**" (Discovery removed from the list) and both add "Discovering a Planet
  does not by itself grant control of it (Section 8.3)." This now agrees
  word-for-word with 8.3 step 5 and with the 8.7 worked example. No
  remaining contradiction.
- **Finding 2 (cycle 1, non-blocking):** Blockade/Capture/Assault were used
  substantively (4.6, 5.3) before being defined, and were never added to the
  Section 2 glossary. **Fixed.** All three now have bolded Section 2 entries
  (rules.md:115-123), preceding their first substantive use in 4.6 and 5.3.

## AC-by-AC accounting

**AC1** (numbered spatial-battlefield rules: planets as nodes, wormholes as
edges with length, homeworld start, discovery cheaper for unexplored than
enemy, wormhole restrictions by direction/team/unit-type, wormhole closure) —
met. `## 8. Spatial Battlefield` (rules.md:340) covers all six items: 8.1
(planet=node, wormhole=edge+Length), 8.2 (homeworld start), 8.3 (Frontier
Discovery costs Length, Contested Discovery costs 2×Length), 8.4
(Directional/Team/Unit-type Restrictions), 8.5 (Closure removes the edge,
forbids reopening). Traced every `design-battlefield.test.js` AC1 assertion
against the prose; all match.

**AC2** (generators built on specific planet; rules for contested/lost
planet) — met. `### 4.6 Positional Generators` (rules.md:201) states
Generators are built on a chosen Planet and never move; `### 8.6 Positional
Generators: Blockade & Capture` (rules.md:461) gives the contested-planet
rule (Blockade halts production) and the lost-planet rule (Capture destroys
the Generator to Wreck).

**AC3** (new terms defined in glossary before substantive use) — met. All
six required terms (planet, wormhole, homeworld, discovery, length, closure)
plus Control, Restriction, Assault, Blockade, and Capture are bolded Section
2 entries (rules.md:92-123), before any of Sections 3-8 use them
substantively. No forward-reference gap remains (see Finding 2 fix above).

**AC4** (discovery integrated into existing phase sequence, not bolted on;
no contradiction of existing numbered rules; existing design-rules tests
pass unmodified) — met. Discovery and Assault are folded into `### 5.3 Main
Phase` as one additional sentence (rules.md:242-245), gated by the same
"Queue empty, active player's priority" restriction already used for Slow
cards in that same paragraph. Turn Structure still lists exactly five `5.x`
sub-headings. Section 5.4's unconditional "an attacking Unit that is
unblocked deals its combat strength ... to Core Integrity" is untouched —
Assault is a separate Fount-Point-paid Main Phase action and never
reinterprets that Conflict Phase statement. Homeworld (the graph anchor) is
kept explicitly distinct from Core Integrity / home base (rules.md:383-388).
Traced every assertion in `test/design-rules.test.js` against the diff: ≥15
distinct glossary terms (now well over), five-then-eight numbered top-level
sections in strict sequence from 1 (still strict), Glossary preceding
Zones/Resources/Turn Structure/Priority&Timing (unchanged), ≥4 phase
sub-headings with MAY/MAY NOT text under Turn Structure (untouched), and the
five Fount sub-sections under Resources present and distinct (4.1-4.5
untouched; the new 4.6 sub-heading doesn't match any Fount-name regex, so
it's simply skipped by that test's per-Fount loop) — none of these break.
`test/design-races.test.js`, `test/design-world.test.js`, and
`test/smoke.test.js` are untouched and read no file this diff modifies.

## Findings

No INTRODUCED findings that gate the merge. Both cycle-1 findings are
resolved as described above, and no new contradiction was found on a full
re-read of Sections 1-8 and the worked examples in 7 and 8.7.

One non-gating observation: Section 8.6's Blockade-clearing payment ("during
their own Main Phase under the same timing restriction") is never folded
into Section 5.3's one-sentence Main Phase summary the way Discovery and
Assault are — a reader skimming only 5.3 could miss that a third
battlefield-related action exists. This doesn't contradict any rule (8.6
states its own timing restriction self-sufficiently) and isn't required by
any visible AC, so it doesn't block approval.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-27T17:06:48.897Z] **bolt:start** — unit=cardgame-spatial-battlefield-rules start_sha=fa7ab5e5ca471c5fdc425eda90f822347b9212cf branch=bolt/cardgame-spatial-battlefield-rules worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-spatial-battlefield-rules
- [2026-07-27T17:06:49.735Z] **baseline:done** — pre-edit test exit=0
- [2026-07-27T17:16:03.643Z] **plan:done** — plan.md written
- [2026-07-27T17:18:04.791Z] **tests:done** — RED verified on test/design-battlefield.test.js (exit=1)
- [2026-07-27T17:21:41.184Z] **build:c1** — tests green, committed
- [2026-07-27T17:25:24.831Z] **review:c1** — NEEDS_WORK
- [2026-07-27T17:26:45.873Z] **build:c2** — tests green, committed
- [2026-07-27T17:31:25.457Z] **review:c2** — APPROVE
- [2026-07-27T17:31:26.403Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-27T17:31:26.654Z] **merge:done** — auto-merged bolt/cardgame-spatial-battlefield-rules into master (worktree)


## Receipt

```json
{
  "start_sha": "fa7ab5e5ca471c5fdc425eda90f822347b9212cf",
  "end_sha": "1affbaf9cee896706d474b0c8a1711dab72445fd",
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
  "cycles": 2,
  "timestamp": "2026-07-27T17:31:26.401Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-spatial-battlefield-rules\\plan.md` (GATE: none).\n\nSummary: the plan adds a new numbered **Section 8 (Spatial Battlefield)** to `design/rules.md` covering planets/wormholes/length, homeworlds, discovery economics (frontier cheaper than contested), typed wormhole restrictions, and closure — plus a `4.6 Positional Generators` stub in Resources, one additive sentence in Main Phase (5.3) integrating Discovery/Assault, 9 new glossary bullets, and a worked example (8.7). It marks both `2026-07-26` ideas-inbox entries incorporated, and adds a new `test/design-battlefield.test.js` (21 tests) without touching any existing test file — which is how \"existing tests pass unmodified\" is guaranteed. Key design call: Generators are positional (capturable/blockade-able via a new self-contained \"Assault\" action), but Units stay location-free to avoid contradicting the existing Conflict Phase rules.",
    "test_writer": "TTS and test execution both require approval that isn't available in this hat's run mode, so I've verified correctness by manual inspection instead.\n\nWrote `test/design-battlefield.test.js` covering the four visible ACs:\n\n- **AC1**: top-level \"Spatial Battlefield\" section exists and sections stay numbered in strict sequence; planets/nodes, wormholes/edges/length, homeworld start, Frontier vs. Contested Discovery cost (2x), direction/team/unit-type restrictions, and closure removing the graph edge.\n- **AC2**: Resources section states Generators are \"built on\" a \"planet\"; Blockade halts production; Capture destroys the Generator to the Wreck.\n- **AC3**: glossary defines planet, wormhole, homeworld, discovery, length, closure, and precedes the Spatial Battlefield section.\n- **AC4**: Main Phase references a \"discovery action\"; Turn Structure still has exactly 5 phase sub-headings; Sections 1–7 remain in order before a new Section 8.\n\nI deliberately left out the plan.md's AC5 block (ideas-inbox incorporation markers + worked example) since that AC was marked `held_out` in plan.md and wasn't in your visible AC list — including it would leak a hidden AC into the visible test suite.\n\nConfirmed RED by inspection (couldn't execute `node --test` — it required approval I couldn't obtain in this run): current `design/rules.md` ends at Section 7 with no \"Spatial Battlefield\" heading, none of the six new glossary terms, and no \"discovery action\" mention in Main Phase — so every new test fails against present-day `rules.md`, and `src/` was never touched. You'll want to run `node --test` yourself to confirm the RED state before implementation starts.",
    "builder_c1": "Full test suite is green (84/84, `fail 0`). I made the four documented edits to `design/rules.md` (glossary bullets, 4.6 Positional Generators, one sentence in 5.3 Main Phase, new Section 8 Spatial Battlefield with 8.1–8.7) and marked both `design/ideas-inbox.md` entries `[incorporated: cardgame-spatial-battlefield-rules]`, exactly per plan.md — no test files were touched (`git diff --stat` on the protected test files is empty).",
    "reviewer_c1": "Findings written to `C:\\github\\AgentBox\\units\\cardgame-spatial-battlefield-rules\\findings.md`.\n\nSummary: AC1–AC4 are all structurally accounted for, and I manually verified (test files read directly, since the sandboxed shell couldn't get command approval to actually run `node --test`) that the untouched test files' assertions still hold against the new content. However, Section 8.1 (and the Section 2 glossary \"Control\" entry) states Discovery is one of three ways to gain control of a Planet, while Section 8.3 explicitly says \"Discovery alone does not grant control of it (Section 8.1)\" — a direct, on-paper contradiction inside the new spatial-battlefield content itself, which the worked example in 8.7 sides against 8.1's own wording. That's an INTRODUCED defect with a concrete failure scenario (a reader following the glossary/8.1 definition draws the opposite conclusion from a reader following 8.3). A secondary, non-blocking finding notes Blockade/Capture/Assault are used before definition and never make it into the Section 2 glossary, unlike the six AC3-required terms.\n\nNEEDS_WORK",
    "builder_c2": "Only `design/rules.md` changed — `test/` untouched. Fixed both reviewer findings: removed the Discovery/Control contradiction (Finding 1) and added glossary entries for Assault/Blockade/Capture before their substantive use (Finding 2). Full suite is green (84/84). Not committing since the user didn't ask me to — this cycle's job was to get tests green, which is done.",
    "reviewer_c2": "Both cycle-1 blocking findings are resolved in this diff — the Discovery/Control contradiction is fixed (Discovery no longer listed as a control-granting action, matching Section 8.3 and the worked example), and Assault/Blockade/Capture now have proper glossary entries. All four visible ACs are met, and I traced the pre-existing `test/design-rules.test.js` assertions against the diff's additions without finding a break. No new contradictions found on a full re-read.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
