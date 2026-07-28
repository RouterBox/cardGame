# Amaranth Expanse — Core Rules

## 1. Game Concepts

Two challengers face each other, each commanding a civilization drawn from one of
the five Founts described in *design/world.md*: the Mass, the Bloom, the Signal,
the Circuit, and the Skein. Each challenger brings a deck of cards representing
that civilization's generators, combatants, and effects, and begins the game
defending a home base.

A game ends the moment one challenger's home base is reduced to nothing, or the
moment a challenger must draw a card and has none left to draw. Everything else in
this rulebook exists to answer one question: at any given moment, exactly what is a
challenger allowed to do, and in what order?

Section 2 defines every term this rulebook uses before it is used anywhere else.
Section 3 lays out where cards physically live over the course of a game. Section
4 explains what fuels playing them. Section 5 lays out the fixed sequence every
turn follows. Section 6 gives the fine-grained rules for who may act, and when.
Section 7 closes with a fully worked example, so any rule above can be checked
against a concrete case.

## 2. Glossary & Vocabulary

Terms below are defined once, here, before any of them is used substantively
elsewhere in this document. Later sections may repeat a term but will not silently
redefine it.

- **Active player** — the challenger whose turn it currently is. The other
  challenger is the non-active player for that turn.
- **Turn** — one complete pass through the five phases in Section 5, taken by a
  single active player. Turns alternate between the two challengers.
- **Phase** — one of the five fixed segments of a turn (Section 5), each with its
  own rule for what may and may not be done.
- **Zone** — one of the five defined places a card can be during a game: the Hand,
  the Field, the Archive, the Wreck, or the Void (Section 3).
- **Hand** — the zone holding a challenger's drawn, unplayed cards, hidden from
  their opponent.
- **Field** — the shared zone where permanents are put into play by both
  challengers.
- **Archive** — a challenger's own face-down deck of cards, drawn from during the
  game.
- **Wreck** — the zone where a challenger's destroyed or discarded cards are placed
  face-up.
- **Void** — the zone for cards removed from the game entirely; once a card is in
  the Void, no rule or ability may bring it back to any other zone.
- **Permanent** — a card that, once played, remains on the Field rather than
  resolving once and going to the Wreck. Generators and Units are both
  permanents.
- **Generator** — a permanent that produces Fount Points during the Generation
  Phase (Section 5.2).
- **Unit** — a permanent that can be declared as an attacker or blocker during the
  Conflict Phase (Section 5.4).
- **Ready** — the default state of a permanent: available to attack, block, or use
  an ability that requires becoming Spent.
- **Spent** — a permanent that has already been used this turn in a way that
  required it; a Spent permanent cannot attack, block, or use a Spent-requiring
  ability again until it is next made Ready.
- **Fount** — one of the five cosmic currents named in *design/world.md* (the
  Mass, the Bloom, the Signal, the Circuit, the Skein) that a Generator draws its
  power from.
- **Fount Point** — a single unit of a Fount's power, produced by a matching
  Generator and spent to pay costs.
- **Resource pool** — a challenger's bank of unspent Fount Points of one
  particular Fount. Each challenger has one resource pool per Fount.
- **Cost** — the Fount Points, and any other stated price, required to play a card
  or use an ability.
- **Home base** — a challenger's Core, tracked by Core Integrity; a challenger who
  reaches 0 Core Integrity loses immediately.
- **Core Integrity** — a numeric measure of how intact a challenger's home base
  is, reduced by damage dealt to it.
- **Damage** — a numeric amount subtracted from Core Integrity, or marked against
  a Unit, as a result of a card or ability.
- **Priority** — the right to act next: to play a card, use an ability, or pass,
  before anything already in the Queue resolves.
- **Priority window** — the span of time beginning when a challenger receives
  priority and ending when it closes (Section 6).
- **Pass** — to decline to act while holding priority, offering it onward instead.
- **Queue** — the ordered list of cards and abilities that have been played or
  triggered but have not yet resolved.
- **Resolve** — for an entry at the front of the Queue to take its full effect and
  be removed from the Queue.
- **Response** — a Fast card or ability played by a challenger while they hold
  priority and the Queue is not empty.
- **Fast card** — a card that may be played by whichever challenger holds
  priority, at any time, including during the other challenger's turn.
- **Slow card** — a card that may only be played by the active player, during
  their Main Phase, while they hold priority and the Queue is empty.
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
  most recently built a Generator on it or Captured it (Section 8.1, Section
  8.6); Discovering a Planet does not by itself grant control of it (Section
  8.3). A Planet on the graph controlled by neither challenger is Neutral.
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
- **Assault** — an action a challenger may take against a Planet they do not
  control, along a qualifying path of Wormholes, costing Fount Points equal
  to the summed Length of that path; an Assault either Blockades or Captures
  its target (Section 8.6).
- **Blockade** — the state of a Planet under Assault that halts the Fount
  Point production of every Generator on it until cleared (Section 8.6).
- **Capture** — the result of a further Assault against an already-Blockaded
  Planet: control passes to the assaulting challenger and every Generator on
  the Planet is destroyed (Section 8.6).
- **Card Type** — one of the five categories a card may belong to: Magic,
  Technology, Intelligence, Biology, or Materials (Section 9); a card may
  belong to more than one (Section 9.7).
- **Cost line** — the field of a card's printed template (Section 9.1)
  stating the Fount Points, by Fount, required to play the card.
- **Type line** — the field of a card's printed template (Section 9.1)
  stating a card's Card Type(s) and, for a Permanent, the word "Permanent".
- **Rules text** — the field of a card's printed template (Section 9.1)
  stating a card's Fast card / Slow card timing and its abilities or
  effects.
- **Stats/counters line** — the optional field of a Permanent's printed
  template (Section 9.1) stating a Unit's combat strength or any counters
  the permanent enters play with.

## 3. Zones

Every card in the game is, at all times, in exactly one of five zones.

- **Hand** — Each challenger keeps their unplayed cards here, hidden from their
  opponent. A challenger may look through their own Hand at any time.
- **Field** — Both challengers' permanents (Generators and Units) sit in this
  single shared zone once played. A permanent stays in the Field until something
  removes it.
- **Archive** — Each challenger's deck: a face-down pile a challenger draws from,
  from the top only, and never looks through except when a card or ability
  explicitly allows it.
- **Wreck** — A face-up pile, one per challenger, where that challenger's
  destroyed permanents and discarded or resolved non-permanent cards come to
  rest. Either challenger may look through either Wreck at any time.
- **Void** — Cards removed from the game entirely, face-up, one shared pile. A
  card that enters the Void cannot be returned to any other zone by any rule or
  ability in this game.

A card changes zones only as a direct result of a rule or an ability; it never
moves on its own. When a card changes zones, any counters, attachments, or
temporary effects tied to it end, unless a rule or ability says otherwise.

## 4. Resources

Every Generator on the Field is attuned to exactly one of the five Founts. During
the Generation Phase (Section 5.2), each Generator produces Fount Points of its own
Fount, added to its controller's matching resource pool. Unless a card says
otherwise, a resource pool empties completely at the end of each turn — Fount
Points do not carry over.

Each Fount converts its points into a different kind of advantage, matching the
nature of the Fount it comes from.

### 4.1 The Mass

Generators attuned to the Mass produce **Mass Points**. A challenger may spend
Mass Points, one point per counter, to place a Fortification counter on any
permanent they control. A permanent with one or more Fortification counters
removes one Fortification counter instead of being destroyed, the first time each
turn something would destroy it; if it has no Fortification counters left, it is
destroyed as normal. This is how the Mass makes things endure.

### 4.2 The Bloom

Generators attuned to the Bloom produce **Bloom Points**. A challenger may spend
Bloom Points, one point per counter, to place a Growth counter on a Unit they
control; a Unit with at least one Growth counter gets +1 to its combat strength
for each Growth counter on it. The first time each game a Unit with Growth
counters on it would be destroyed, its controller may instead remove all Growth
counters from it and return it to the Field with no counters, rather than letting
it be destroyed. This is how the Bloom answers threats by mutating past them
rather than enduring them outright.

### 4.3 The Signal

Generators attuned to the Signal produce **Signal Points**. A challenger may spend
one Signal Point to look at the top card of their own Archive; they may then
either leave it on top or move it to the bottom of their Archive. This is how the
Signal turns foresight into an advantage before anything else happens.

### 4.4 The Circuit

Generators attuned to the Circuit produce **Circuit Points**. A challenger may
spend Circuit Points equal to a Technology permanent's printed cost to create an
exact token copy of that permanent, put directly onto the Field under their
control. This is how the Circuit turns one working idea into scale.

### 4.5 The Skein

Generators attuned to the Skein produce **Skein Points**. A challenger may spend
Skein Points equal to the number of entries currently in the Queue to move one of
their own entries already in the Queue to the front, so that it resolves next,
ahead of anything else waiting. This is how the Skein renegotiates cause and
effect rather than obeying it.

### 4.6 Positional Generators

Every Generator is built on a specific Planet (Section 8.1), chosen when it
is played; a challenger's first Generator MUST be built on their Homeworld
(Section 8.2), and a Generator's Planet never changes once played. Because
Generators sit on Planets, and Planets are Blockade-able and Capturable
(Section 8.6), a Generator surviving being played is not the same as it
producing forever — Section 8.6 states exactly what happens to a Generator
when its Planet is contested (Blockaded) or lost (Captured).

## 5. Turn Structure

Every turn consists of the same five phases, always in this order. A phase never
repeats within a turn, and a turn never skips a phase.

### 5.1 Dawn Phase

The active player readies all Spent permanents they control, making them Ready
again, and then draws one card from their Archive. The active player MAY NOT play
cards, use abilities, or generate Fount Points during the Dawn Phase, and no
player may take any action of their own during another challenger's Dawn Phase;
drawing happens automatically once. Exception: the challenger who takes the very
first turn of the game does not draw during their first Dawn Phase.

### 5.2 Generation Phase

Every Generator the active player controls produces Fount Points as described in
Section 4, added to the active player's matching resource pools. The active
player MAY choose the order in which their Generators produce points, if the
order could matter for an ability. No player MAY play cards or use
non-Generation abilities during this phase, and the non-active player never acts
during another challenger's Generation Phase.

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

The active player MAY declare any number of their Ready Units as attackers,
becoming Spent as they do; the non-active player MAY then declare any of their own
Ready Units as blockers, one blocker or more per attacker. An attacking Unit that
is unblocked deals its combat strength as damage to the non-active player's Core
Integrity. A Unit that did not attack MAY NOT deal combat damage this phase, and a
Spent Unit MAY NOT be declared as either an attacker or a blocker.

### 5.5 Dusk Phase

Any triggered ability that cares about the end of the turn is added to the Queue
and resolves. Both players MAY take Fast actions here, exactly as in the Main
Phase. Once the Queue is empty and both players have passed in succession, all
resource pools empty and the turn ends; no player MAY carry unspent Fount Points
into the next turn, and a Slow card MAY NOT be played during the Dusk Phase under
any circumstance.

## 6. Priority & Timing

At almost every moment in the game, exactly one challenger holds priority: the
right to play a Fast card, use an ability, or pass, before anything already in the
Queue resolves. The active player receives priority first in every phase. A
challenger with priority may act any number of times in a row, or pass
immediately.

When a challenger passes, priority moves to the other challenger. If that
challenger also passes without acting — passing in succession — the current
priority window closes. Closing a priority window does one of two things: if the
Queue is not empty, its topmost entry resolves and the active player receives
priority again to open a new window; if the Queue is empty, the game moves to the
next phase (or, at the end of the Dusk Phase, the next turn). A challenger who
takes any action instead of passing re-opens the window: priority returns first to
the challenger who just acted, then would need to pass again for the window to
close.

A Response added to the Queue always resolves before anything it was played in
response to, since it sits above that entry in the Queue.

### 6.1 Edge Case: Simultaneous Triggers

If two or more triggered abilities would be added to the Queue as a result of the
same event, they do not enter in an undefined order. The active player first adds
all of their own triggers to the Queue, in whatever order they choose; the
non-active player then adds all of their own triggers to the Queue, above the
active player's, again in whatever order they choose. Because the Queue resolves
from the top down, this means the non-active player's triggers from that event
resolve first, followed by the active player's, in the order each player chose
for their own triggers. Neither player may interleave their own triggers with the
other's, and neither may change this ordering once both sets of triggers have been
added.

### 6.2 Edge Case: A Response Arriving During Resolution

Resolving an entry from the Queue is not itself an action that can be responded
to — but a card or ability can still create new entries partway through its own
resolution (for example, an effect that says "resolve this, then do X"). When
that happens, the entry currently resolving finishes resolving completely first;
any new entries it creates are added to the Queue only once it has finished, and
only then does either challenger receive priority to respond to those new
entries. A challenger may never gain priority in the middle of a single entry's
resolution, only between one entry finishing and the next opening.

## 7. Worked Example: A Priority Exchange

This example follows one Main Phase exchange between two challengers, Reva
(active player, drawing on the Circuit) and Toma (non-active player, drawing on
the Skein), continuing directly from Section 6.

1. It is Reva's Main Phase. The Queue is empty and Reva holds priority. Reva
   plays a Fast card that deals 2 damage to a Unit Toma controls. This card is
   added to the Queue. Reva could act again, but instead passes.
2. Priority moves to Toma. The Queue is not empty (Reva's damage effect is in
   it), so Toma may respond. Toma plays a Fast card of their own that would give
   the threatened Unit +2 toughness. Toma's card is added above Reva's in the
   Queue. Toma passes.
3. Priority returns to Reva, who has no further response and passes as well.
   Both challengers have now passed in succession with the Queue non-empty, so
   the current priority window closes and the topmost entry resolves: Toma's +2
   toughness effect resolves first, since it was added above Reva's card.
4. The Queue is not yet empty, so a new priority window opens with the active
   player, Reva, receiving priority again. Neither challenger acts, and both
   pass in succession a second time. The window closes again; the Queue's
   remaining entry, Reva's 2 damage effect, resolves. Because Toma's Unit
   already gained +2 toughness before this damage was ever marked against it,
   the Unit survives.
5. The Queue is now empty and both challengers have passed, so the Main Phase
   priority window closes for good and play moves to the Conflict Phase.

This confirms, on paper, that in this rules set the last Fast card played is
always the first to resolve — exactly the ordering the Simultaneous Triggers edge
case in Section 6.1 and the general passing rule both depend on.

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
  Generator on it or Captured it (Section 8.6); Discovering a Planet does not
  by itself grant control of it (Section 8.3). A Planet on the graph
  controlled by neither challenger is **Neutral**. Each challenger's
  Homeworld is controlled by them from the start of the game and can never
  become Neutral or change control (Section 8.2, Section 8.6).
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

## 9. Card Types & Templating

Every card belongs to one or more of five Card Types — Magic, Technology,
Intelligence, Biology, and Materials — and each Card Type draws its cost
from exactly one Fount (Section 4) by default: Magic from the Skein,
Technology from the Circuit, Intelligence from the Signal, Biology from the
Bloom, and Materials from the Mass. This section defines the five Card
Types, the template every card is printed with, and the rule for a card
that spans more than one Card Type or Fount. Where a Fount's own mechanic
matters, this section cross-references Section 4 rather than restating it.

### 9.1 The Canonical Card Template

Every card is printed with the following fields, always in this order:

1. **Name** — the card's title.
2. **Cost line** — the Fount Points required to play the card, broken out
   by Fount (Section 4). A card that draws cost from a single Fount lists
   just that Fount's cost; a card that draws cost from more than one Fount
   lists each Fount's cost separately (Section 9.7).
3. **Type line** — the card's Card Type(s) (Sections 9.2-9.6), and, if the
   card is a Permanent (Section 2), the word "Permanent".
4. **Rules text** — the card's Fast card / Slow card timing (Section 2)
   and any abilities or effects, written using terms this Glossary
   (Section 2) has already defined wherever possible.
5. **Stats/counters line** (Permanents only, optional) — for a Unit, its
   combat strength; for any Permanent, any counters it enters play with. A
   card that is not a Permanent never carries this line.

Each Card Type falls into exactly one of two behavior classes, stated on
its type line by the presence or absence of the word "Permanent": a
**permanent** Card Type means the card is a Permanent (Section 2) that
remains on the Field once played; an **instant/sorcery-speed resolving**
Card Type means the card resolves once (Section 2's Resolve) and is then
placed in its owner's Wreck, never remaining on the Field. A card's Fast
card / Slow card status is a separate fact, stated in its rules text, and
does not depend on its behavior class.

### 9.2 Magic — the Skein

Magic cards draw their cost from the Skein and are instant/sorcery-speed
resolving (Section 9.1): a Magic card is never a Permanent.

> **Cinderfall Bolt**
> Cost line: 2 Skein
> Type line: Magic
> Rules text: Fast. When this resolves, deal 3 damage to any Unit.

### 9.3 Technology — the Circuit

Technology cards draw their cost from the Circuit and are permanent
(Section 9.1): a Technology card is always a Permanent, matching Section
4.4's own use of the term "Technology permanent." A Technology card's
abilities may still be used at instant or sorcery speed, per its own rules
text — the card's permanence and the timing of its abilities are separate
facts about it.

> **Signal Relay**
> Cost line: 2 Circuit
> Type line: Technology — Permanent
> Rules text: Slow. Spent, usable at instant speed (any time its
> controller holds priority): look at the top card of your Archive; you
> may put it on the bottom of your Archive instead of leaving it on top.

### 9.4 Intelligence — the Signal

Intelligence cards draw their cost from the Signal and are
instant/sorcery-speed resolving (Section 9.1), in the same sense as Magic
(Section 9.2): never a Permanent, always resolving once to the Wreck.

> **Foresight Ping**
> Cost line: 1 Signal
> Type line: Intelligence
> Rules text: Fast. When this resolves, look at the top card of your
> Archive; you may put it on the bottom of your Archive instead of leaving
> it on top.

### 9.5 Biology — the Bloom

Biology cards draw their cost from the Bloom and are permanent (Section
9.1): every Biology card is a Unit (Section 2), and so always carries a
stats/counters line stating its combat strength.

> **Spore Warden**
> Cost line: 3 Bloom
> Type line: Biology — Permanent
> Rules text: Slow.
> Stats/counters line: Combat strength 3. Enters with no counters.

### 9.6 Materials — the Mass

Materials cards draw their cost from the Mass and are permanent (Section
9.1). A Materials card may be a Generator (Section 2), a Unit, or a
Permanent that is neither, depending on its own rules text.

> **Foundry Works**
> Cost line: 2 Mass
> Type line: Materials — Permanent
> Rules text: Slow. This permanent is a Generator (Section 4) attuned to
> the Mass: during the Generation Phase (Section 5.2), it produces 1 Mass
> Point, added to its controller's Mass resource pool.

### 9.7 Multiple Types and Multiple Costs

A card may list more than one Card Type on its type line, and may draw its
cost from more than one Fount on its cost line, independently of each
other.

**Cost:** when a card's cost line names more than one Fount, its total
cost is the sum of the Fount Points listed for each Fount, and each
Fount's share MUST be paid from that Fount's own resource pool (Section
4) — a challenger MAY NOT pay one Fount's share of a cost with another
Fount's points.

**Type-specific rules:** when a card lists more than one Card Type,
every rule stated for each of its listed types (Sections 9.2-9.6) applies
to the card at once. Because a permanent behavior class (Section 9.1) is a
stronger claim than an instant/sorcery-speed resolving one, a card that
lists at least one permanent Card Type (Technology, Biology, or Materials)
is a Permanent, even if it also lists an instant/sorcery-speed resolving
Card Type (Magic or Intelligence); a card is instant/sorcery-speed
resolving only if every one of its listed Card Types is
instant/sorcery-speed resolving.

> **Reactive Turret**
> Cost line: 1 Skein, 1 Circuit
> Type line: Magic Technology — Permanent
> Rules text: Slow. Spent: deal 1 damage to any Unit.

Reactive Turret's total cost is 2 Fount Points: 1 paid from the Skein
resource pool and 1 from the Circuit resource pool, never 2 from either
pool alone. Its type line lists Magic, an instant/sorcery-speed resolving
type, and Technology, a permanent type; per the rule above, the presence
of Technology makes the whole card a Permanent, so Reactive Turret stays
on the Field once played rather than resolving to the Wreck.
