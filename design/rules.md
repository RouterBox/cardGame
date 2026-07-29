# Amaranth Expanse — Core Rules

## 1. Game Concepts

Two challengers face each other, each commanding a civilization drawn from one of
the five Founts described in *design/world.md*: the Mass, the Bloom, the Signal,
the Circuit, and the Tangle. Each challenger brings a deck of cards representing
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
  Mass, the Bloom, the Signal, the Circuit, the Tangle) that a Generator draws its
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
  to the summed Length of that path; an Assault attempts to Blockade or
  Capture its target, succeeding only if the assaulting challenger's Units
  meet that target's damage requirement (Section 8.6).
- **Blockade** — the state of a Planet, reached by a successful Assault,
  that halts the Fount Point production of every Generator on it until
  cleared (Section 8.6).
- **Capture** — the result of a further, successful Assault against an
  already-Blockaded Planet: control passes to the assaulting challenger and
  every Generator on the Planet is destroyed (Section 8.6).
- **Eliminated** — a challenger removed from the rest of the game because
  they have met an elimination condition (Section 10.1); an Eliminated
  challenger takes no further turns and receives no further priority
  (Section 10.2).
- **Game end** — the moment, defined in Section 10.2, at which the game
  stops: either because only one challenger remains un-Eliminated, or
  because every challenger is Eliminated at the same instant. Nothing
  changes in the game after Game End.
- **Draw** — the Game End (Section 10.2) result when every challenger is
  Eliminated at the same instant; a draw has no winner.
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

### 4.5 The Tangle

Generators attuned to the Tangle produce **Tangle Points**. A challenger may spend
Tangle Points equal to the number of entries currently in the Queue to move one of
their own entries already in the Queue to the front, so that it resolves next,
ahead of anything else waiting. This is how the Tangle renegotiates cause and
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

*Open design question (unresolved): whether resource generation should also
connect to the battlefield graph in other ways beyond the Generator mechanic
above — for example, gaining Fount Points from graph characteristics
directly — is not decided by this section.*

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
Queue is empty and it is the active player's priority. Discovery (Section
8.3), which can add a new Planet to the graph and always opens a new
Wormhole, is one of the two special actions permitted here.

### 5.4 Conflict Phase

During the Conflict Phase, the active player takes the following actions,
in order:

1. **Movement.** The active player MAY take any number of Movement
   actions during the Conflict Phase. A Movement action moves one Ready
   Unit the active player controls across a single Wormhole, from the
   Planet where it is located to an adjacent Planet (Section 8.1),
   provided the Wormhole is not Closed (Section 8.5) and its Restrictions
   (Section 8.4) permit the move. Taking a Movement action costs Fount
   Points, from any combination of the active player's resource pools,
   equal to that Wormhole's Length (Section 8.1).
2. **Declaring attackers.** The active player MAY declare any number of
   their Ready Units as attackers, becoming Spent as they do; declaring a
   Unit as an attacker names the Planet it is attacking — the Planet
   being attacked. A Unit that moved this turn, whether by a Movement
   action (Rule 1) or by any other effect, MAY NOT be declared as an
   attacker this turn, unless a card or ability specifically says
   otherwise.
3. **Declaring blockers.** The non-active player MAY then declare any of
   their own Ready Units as blockers, one blocker or more per attacker. A
   Unit MAY only be declared as a blocker against an attacker if that
   Unit occupies the same Planet as the Planet being attacked (Section
   8.1).
4. **Unblocked damage.** An attacking Unit that is unblocked deals its
   combat strength as damage to the non-active player's Core Integrity. A
   Unit that did not attack MAY NOT deal combat damage this phase, and a
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
the Tangle), continuing directly from Section 6.

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
  has no bearing on any card's zone (above). A Unit's controller chooses
  which Planet it is located at as they play it, and unlike a Generator
  (Section 4.6), that choice is not limited to a Planet the controller
  controls — a Unit MAY be played located at any Planet already on the
  battlefield graph, whether Neutral or controlled by either challenger.
  (This deployment freedom is provisional: Section 5.4 already carries open,
  unresolved notes contemplating a costed wormhole-movement system, and
  adopting one may narrow where a Unit may be deployed.) Once a Unit is on
  the Field, its location changes only if some rule or card effect
  explicitly moves it; this rulebook currently defines no action, on its
  own, that relocates an already-deployed Unit — the actions that grant
  movement are deliberately left to future rules or cards, a design space
  Section 5.4's open notes already flag. Any such movement, however granted,
  must still traverse a Wormhole that is not Closed (Section 8.5) and whose
  Restrictions (Section 8.4) permit it. The graph is the battlefield: a
  Unit's location on it, once the Unit is on the Field, is a real fact this
  rulebook tracks and checks (Section 8.6), not a detail left untracked.
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
   table of lengths — a shorter Wormhole simply costs more, per the next
   step, since a shorter Wormhole is easier to traverse and therefore more
   valuable.
4. Pay the cost, from any combination of the active player's resource pools:
   a Frontier Discovery costs Fount Points equal to 10 minus the new
   Wormhole's Length, with a minimum of 1 Fount Point no matter how long the
   Wormhole is; a Contested Discovery costs twice that — Fount Points equal
   to double the Frontier cost for a Wormhole of that Length. This is the
   toll ease of passage pays: the shorter and more easily-traveled a
   Wormhole is, the more Fount Points it costs to open, while a long,
   sprawling Wormhole is comparatively cheap to open; reaching into space
   the opponent already holds still costs exactly double what reaching into
   unclaimed space of the same Length would.
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
  permanents of a stated type (for example, "Biology-only"): a Unit whose
  printed type does not match a Wormhole's Unit-type Restriction MAY NOT
  move across that Wormhole, however that movement is granted (Section
  8.1). This rulebook's Assault action (Section 8.6) does not move a Unit
  and is therefore never affected by a Unit-type Restriction; the
  Restriction instead governs Unit movement between Planets whenever a
  future rule or card grants it (Section 8.1) — a real, current limit on
  that movement, not a placeholder.

A Directional, Team, or Unit-type Restriction on a Wormhole never changes
that Wormhole's Length or its Closed/un-Closed state, and a Wormhole may
carry more than one Restriction of different kinds at once. Whether a
Directional or Team Restriction also limits a future rule's or card's Unit
movement (Section 8.1), and not only an Assault's path (Section 8.6), is an
open question this section does not resolve; only the Unit-type Restriction
is stated, by this rulebook, to govern such movement directly.

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
chosen path. Paying this cost lets the assaulting challenger attempt to
Blockade or Capture the target Planet; it does not by itself do either — the
Unit-and-damage requirement below decides whether the attempt succeeds.

An Assault does one of the following, the assaulting challenger's choice:

- **Blockade** the target Planet: this requires the assaulting challenger to
  control one or more Units located (Section 8.1) at the target Planet at
  the moment the Assault action is taken. Those Units' combined combat
  strength (Section 9.1) is dealt as damage to the Planet — this rulebook's
  Damage concept (Section 2) extended to a Planet, alongside Core Integrity
  and a Unit, exactly as an attacking Unit deals its combat strength as
  damage elsewhere in this rulebook (Section 12.1). If that damage totals at
  least the number of Generators on the Planet, every Generator on it stops
  producing Fount Points, starting with the Generation Phase (Section 5.2)
  of the assaulted challenger's next turn, for as long as the Blockade
  lasts; if the damage falls short, the Assault still costs its Fount Points
  but the Planet is not Blockaded. A Blockade lasts until the Planet's
  controller pays Fount Points, from any combination of their own resource
  pools, equal to the Assault's original cost, during their own Main Phase
  under the same timing restriction — the only way to clear a Blockade.
- **Capture** the target Planet, if it is already Blockaded by the
  assaulting challenger: this requires meeting the same Unit-and-damage
  requirement as Blockade, above, a second time — the assaulting
  challenger's Units located at the target Planet dealing combined damage
  totaling at least the Planet's Generator count once again. If they do,
  control of the Planet passes to the assaulting challenger immediately, and
  every Generator on it is destroyed — moved to its owner's Wreck (Section
  3). If the damage falls short, the Assault still costs its Fount Points
  but the Planet is not Captured and remains Blockaded. Capture is
  permanent: control does not revert on its own, and a destroyed Generator
  must be replayed, on some Planet its owner controls, like any other
  Generator, subject to the one-Generator-per-turn limit (Section 5.3).

A Homeworld MAY be Blockaded like any other Planet, but MAY NOT be Captured
— Homeworlds never change control (Section 8.2).

### 8.7 Worked Example: Discovery, Blockade, and Capture

This example follows Reva (Homeworld: Solmere) and Toma (Homeworld: Kethis)
across several turns, on a graph that starts as just those two Homeworlds
with no Wormhole between them.

1. On an early turn, Reva takes a Discovery action: a Frontier Discovery from
   Solmere to an Unexplored Planet, naming it Ordinal Reach, with a Wormhole
   of Length 2. A Frontier Discovery costs Fount Points equal to 10 minus the
   new Wormhole's Length, so Reva pays 8. Ordinal Reach joins the battlefield
   graph as a Neutral Planet, adjacent to Solmere.
2. On a later turn, Reva plays a Generator and builds it on Ordinal Reach.
   Ordinal Reach is now controlled by Reva (Section 8.1).
3. On an earlier turn, Toma had separately Discovered a Wormhole connecting
   Kethis to Solmere. On a later turn, Toma plays a Unit with combat
   strength 3, choosing to deploy it located at Ordinal Reach (Section 8.1)
   — a Planet Toma does not control, which this rulebook's deployment rule
   for a Unit allows even though Ordinal Reach is Reva's, unlike a Generator
   (Section 4.6), which may only be built on a Planet its controller
   already controls.
4. Toma, on their own Main Phase, takes an Assault action against Ordinal
   Reach. The only path from a Planet Toma controls (Kethis) to Ordinal
   Reach runs Kethis, through the Wormhole to Solmere, then the Length-2
   Wormhole on to Ordinal Reach; Toma pays Fount Points equal to the sum of
   both Wormholes' Lengths on that path. Toma's Unit, already located at
   Ordinal Reach (step 3), has combat strength 3 — at least Ordinal Reach's
   single Generator — so Toma chooses to Blockade rather than Capture: the
   Unit deals 3 damage to Ordinal Reach, meeting the 1-Generator requirement
   (Section 8.6). Ordinal Reach is now Blockaded: starting with Reva's next
   Generation Phase, the Generator there stops producing Fount Points,
   though it is not destroyed and Reva still controls the Planet.
5. Reva does not clear the Blockade (that would cost Fount Points equal to
   Toma's Assault, paid during Reva's own Main Phase). Toma's Unit remains
   located at Ordinal Reach throughout (Section 8.1: nothing in this
   rulebook moves it away on its own). On a following turn, Toma takes a
   second Assault action along the same path, paying the Fount Point cost
   again, and this time chooses to Capture: the Unit again deals 3 damage to
   Ordinal Reach, once more meeting the 1-Generator requirement (Section
   8.6). Control of Ordinal Reach passes to Toma immediately, and Reva's
   Generator there is destroyed, moved to Reva's Wreck. Reva may later
   replay a Generator, but only on a Planet Reva still controls, and only
   one per turn (Section 5.3).

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
3. Each Homeworld's placement relative to the other Homeworld is simply
   unconnected: map setup draws no Wormhole between them, so no adjacency
   or path connects the two nodes and no distance or direction can be
   measured across (Section 8.2, which already states the two Homeworlds
   are never adjacent at the start of the game). No other Wormhole is
   drawn during map setup either.
4. Every Planet besides the two Homeworlds begins the game Unexplored
   (Section 8.1): off the battlefield graph entirely, not named, numbered,
   or positioned during map setup. Each one joins the graph only later,
   one at a time, the moment some Discovery (Section 8.3) names it as a
   destination.

This is the same starting graph the worked example in Section 8.7 already
assumes; this subsection states it as a rule of general game setup rather
than leaving it implicit.

## 9. Card Types & Templating

Every card belongs to one or more of five Card Types — Magic, Technology,
Intelligence, Biology, and Materials — and each Card Type draws its cost
from exactly one Fount (Section 4) by default: Magic from the Tangle,
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

### 9.2 Magic — the Tangle

Magic cards draw their cost from the Tangle and are instant/sorcery-speed
resolving (Section 9.1): a Magic card is never a Permanent.

> **Cinderfall Bolt**
> Cost line: 2 Tangle
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
> Cost line: 1 Tangle, 1 Circuit
> Type line: Magic Technology — Permanent
> Rules text: Slow. Spent: deal 1 damage to any Unit.

Reactive Turret's total cost is 2 Fount Points: 1 paid from the Tangle
resource pool and 1 from the Circuit resource pool, never 2 from either
pool alone. Its type line lists Magic, an instant/sorcery-speed resolving
type, and Technology, a permanent type; per the rule above, the presence
of Technology makes the whole card a Permanent, so Reactive Turret stays
on the Field once played rather than resolving to the Wreck.

## 10. Winning & Losing Conditions

Section 1 already states, in prose, the two ways a challenger's game can
end: a challenger's home base being reduced to nothing, or a challenger
being unable to draw a required card. This section gives those events a
name — **Elimination** — states exactly when the game itself ends, and
resolves a concrete edge case at the same rigor as Section 8's Blockade
and Capture rules. Nothing in this section changes or restates any rule
already stated in Sections 1-9; where a rule already exists, this section
cross-references it by section number instead.

### 10.1 Player Elimination

A challenger is **Eliminated** the instant either of the following happens:

1. Their Core Integrity is reduced to 0 (Section 2's Home base and Core
   Integrity terms; Section 1).
2. They are required to draw a card during their Dawn Phase (Section 5.1)
   and their Archive holds no card to draw (Section 1).

Elimination happens immediately when its condition is met — even in the
middle of a single Queue entry's resolution (Section 6.2) or during
another challenger's turn — and is never itself added to the Queue, so it
cannot be responded to.

Capturing a Planet (Section 8.6) is not, on its own, an elimination
condition, and this section does not add one. A Homeworld specifically
may not be captured (Section 8.2, Section 8.6), so Capture never reduces
a challenger's Core Integrity directly. Capturing a non-Homeworld Planet
does destroy every Generator on it (Section 8.6), which can starve a
challenger of Fount Points and make it easier for their opponent to
eventually force the Core Integrity condition above — but that later
reduction of Core Integrity, not the Capture itself, is what would
Eliminate them.

### 10.2 Game End

The game ends the instant only one challenger remains un-Eliminated
(Section 10.1); that challenger wins immediately.

Every game under this rulebook is played between exactly two challengers
(Section 1). Because of this, Eliminating either challenger always leaves
exactly one challenger un-Eliminated, except in the simultaneous case
below — so Elimination and Game End are the same event: the instant one
challenger is Eliminated, the other has already won, and no further turn
is taken. The turn structure of Section 5 does not continue past the turn
in which the Elimination happened, no matter which phase that turn had
reached. Since a challenger only ever holds priority as part of a turn's
phases (Section 6), no further turn being taken also means neither
challenger receives priority again once the game has ended.

If both challengers meet an elimination condition (Section 10.1) at the
same instant, the game ends in a **draw**: neither challenger wins, and,
as above, no further turn is taken and no further priority is received.

### 10.3 Worked Example: Simultaneous Elimination

This example picks up during Reva's Main Phase (Section 5.3), with Reva's
Core Integrity at 4 and Toma's Core Integrity at 4. One entry already sits
in the Queue: a Fast card Toma played earlier this Main Phase, reading
"When this resolves, deal 4 damage to each challenger."

1. The Queue holds only this one entry, and both challengers have now
   passed in succession (Section 6), so the current priority window
   closes and the entry resolves.
2. Resolving deals 4 damage to Reva and 4 damage to Toma, as part of the
   same, single resolution (Section 6.2: an entry finishes resolving
   completely before anything else happens). Reva's Core Integrity drops
   from 4 to 0 and Toma's drops from 4 to 0, in the same instant.
3. Both challengers meet the Core Integrity elimination condition (Section
   10.1) at that same instant, so the game ends in a draw (Section 10.2).
   Neither the rest of the Main Phase, nor the Conflict Phase, nor any
   later phase of this turn is reached — the turn, and the game, end here.

This confirms, on paper, that because this rules set resolves a Queue
entry's full effect atomically before anything else happens (Section
6.2), a single symmetric effect can Eliminate both challengers in the same
instant, ending the game in a draw rather than letting whichever
challenger happened to be checked first "win" a race the shared effect
never created.

## 11. Deck Construction

*design/gamePlan.md* names one rule this rulebook has never formally stated:
"build your deck, and play." This section states it: a fixed minimum Archive
size, and a maximum number of copies of any one uniquely-named card. Doing so
closes a real gap in Section 10.1 — that section's second elimination
condition (a challenger required to draw a card during their Dawn Phase,
Section 5.1, with no card left in their Archive) has, until now, had no
stated floor on how large an Archive starts, so nothing has fixed how soon
that condition could ever be reached. Nothing in this section changes or
restates any rule already stated in Sections 1-10; where a rule already
exists, this section cross-references it by section number instead.

### 11.1 Minimum Archive Size

Each challenger's Archive (Section 3) MUST contain at least 40 cards at the
start of a game, before shuffling and before that challenger's opening hand
is drawn from it. A challenger MAY NOT begin a game with an Archive
containing fewer than 40 cards. This is the number Section 10.1's
draw-with-an-empty-Archive elimination condition depends on to mean anything
concrete: the fewer cards an Archive holds relative to how many turns a game
runs, the sooner a challenger is forced to draw from an empty Archive and is
Eliminated (Section 10.1) as a result. An Archive MAY contain more than 40
cards; this section fixes a floor, not a ceiling.

### 11.2 Maximum Copies of a Single Named Card

A challenger's Archive MAY NOT contain more than 3 cards sharing the same Name
(Section 9.1's Name field). This limit applies per uniquely-named card,
independent of which Card Type(s) or Fount(s) that card lists (Section 9):
a challenger's Archive could, for example, hold 3 copies of Spore Warden and
3 copies of Foundry Works at once (Section 9.5, Section 9.6), but never a
4th copy of either.

### 11.3 Worked Example: A Legal and an Illegal Archive

This example checks two Archives a challenger might try to bring to a game,
built from cards already printed as examples in Section 9.

1. Challenger A's Archive contains 40 cards total: 3 copies each of
   Cinderfall Bolt, Signal Relay, Foresight Ping, Spore Warden, Foundry
   Works, and Reactive Turret (18 cards), plus 22 further cards, none of
   them sharing a Name with each other or with any of those six. This
   Archive is legal: it meets the 40-card minimum (Section 11.1) exactly,
   and no Name appears more than 3 times (Section 11.2).
2. Challenger B's Archive contains 45 cards total, comfortably above the
   minimum, but 4 of them are copies of Cinderfall Bolt. This Archive is
   illegal: it clears the 40-card minimum (Section 11.1), but the 4th copy
   of Cinderfall Bolt violates the per-Name limit (Section 11.2) regardless
   of the Archive's total size.

This confirms, on paper, that the two limits in this section are checked
independently — an Archive can fail either one without failing the other —
and that Section 10.1's draw-with-empty-Archive elimination condition now
has a concrete floor to reason about: no legal Archive can ever hold fewer
than 40 cards.

## 12. Combat Resolution

Section 5.4's Conflict Phase already states what happens when an attacking
Unit is unblocked: it deals its combat strength as damage to the
non-active player's Core Integrity. This section states the other half of
that same event — what happens when an attacker is blocked — and states,
for the first time in this rulebook, how the damage that combat marks
against a Unit (Section 2's Damage) accumulates, destroys, and clears.
Nothing in this section changes or restates any rule already stated in
Sections 1-11; where a rule already exists, this section cross-references
it by section number instead.

### 12.1 Damage to Blockers

An attacking Unit that is blocked (Section 5.4) deals its
combat strength as damage to its blocker(s) instead of to the non-active
player's Core Integrity. A blocked attacker never deals damage to Core Integrity, no
matter how many blockers are declared against it or how that damage is
divided among them (Section 12.2).

Each blocking Unit also deals its own combat strength as damage to the
attacking Unit it is blocking, at the same time. When more than one
blocker is declared against a single attacker (Section 5.4), the attacker
receives the combined combat strength of every one of its blockers as
damage, marked against it exactly as any other damage (Section 2, Section
12.3).

### 12.2 Damage Assignment Order

When more than one blocker is declared against a single attacker (Section
5.4), the damage that attacker deals (Section 12.1) is still divided among
its blockers one at a time rather than dealt to all of them at once with
no assignment. The attacking player — the active player, who declared that
attacker (Section 5.4) — chooses the order in which the attacker's combat
strength is assigned among its blockers, and chooses how much of it each
blocker receives, provided the amounts assigned across all of that
attacker's blockers sum to exactly the attacker's combat strength. This
mirrors the existing convention, already stated in Section 6.1's
Simultaneous Triggers, that ties an order-choice to the acting or active
player: there, the active player orders their own triggers before the
non-active player's; here, the active player likewise orders how their own
attacker's damage lands among the non-active player's blockers.

### 12.3 Unit Destruction by Damage

A Unit that has damage marked against it (Section 2's Damage) equal to or
greater than its own combat strength (Section 9.1's Stats/counters line)
is destroyed: it is removed from the Field and moved to its owner's Wreck
(Section 3), exactly as any other destroyed permanent. This destruction
check applies the instant qualifying damage is marked, to any Unit with
marked damage — not only to Units attacking or blocking in the current
Conflict Phase — since any card or ability that marks damage against a
Unit (Section 2) can bring that Unit's marked damage up to or past its
combat strength.

### 12.4 Clearing Damage

Damage marked against a Unit (Section 2) is not permanent. It clears at
the end of the turn: at the same moment Section 5.5 already fixes for
resource pools emptying, once the Dusk Phase's Queue is empty and both
players have passed in succession. A Unit that survives the Conflict
Phase with damage marked against it — because that damage was less than
its combat strength (Section 12.3) — keeps that damage marked through the
rest of the turn, including the Dusk Phase, and loses it only when the
turn ends; no Unit carries marked damage into the next turn.

### 12.5 Worked Example: A Multi-Blocker Exchange

This example follows one Conflict Phase (Section 5.4) between Reva (active
player) and Toma (non-active player). Reva controls Ironclad Vanguard,
combat strength 5. Toma controls two Ready Units: Scrap Sentinel, combat
strength 2, and Bramble Warden, combat strength 4.

1. Reva declares Ironclad Vanguard as an attacker; it becomes Spent. Toma
   declares both Scrap Sentinel and Bramble Warden as blockers against it
   (Section 5.4).
2. Because Ironclad Vanguard is blocked, it deals its combat strength as
   damage to its blockers rather than to Toma's Core Integrity (Section
   12.1). Reva, the active player, chooses the assignment order and
   amounts: 2 damage to Scrap Sentinel first, then the remaining 3 damage
   to Bramble Warden (Section 12.2).
3. Scrap Sentinel now has 2 damage marked against it, equal to its own
   combat strength of 2, so it is destroyed and moved to Toma's Wreck
   (Section 12.3, Section 3). Bramble Warden has 3 damage marked against
   it, less than its combat strength of 4, so it survives, carrying that
   damage.
4. Both of Toma's blockers also deal their combat strength as damage to
   Ironclad Vanguard at the same time (Section 12.1): 2 from Scrap
   Sentinel and 4 from Bramble Warden, for 6 damage total. Ironclad
   Vanguard's combat strength is 5, so 6 damage destroys it; it is moved
   to Reva's Wreck (Section 12.3, Section 3).
5. The Conflict Phase ends and the turn continues to the Dusk Phase
   (Section 5.5). Bramble Warden's 3 marked damage is not cleared yet — it
   clears only once the turn itself ends (Section 12.4), so if anything
   this turn still cared about Bramble Warden's marked damage, it would
   still see 3.

This confirms, on paper, that a blocked attacker's damage lands on its
blockers rather than Core Integrity, that the active player's assignment
choice can eliminate one blocker while sparing another sharing the same
attacker, and that surviving damage persists until the fixed clearing
moment this section commits to, exactly as Sections 12.1-12.4 state.

## 13. Targeting

Section 9's card examples — Cinderfall Bolt (Section 9.2) and Reactive
Turret (Section 9.7) — both name a target ("any Unit") as part of
resolving, but Section 2's Glossary never defines what a target is, when a
challenger locks one in, or what happens if the chosen target stops being
legal before the effect resolves. This section closes that gap. Nothing in
this section changes or restates any rule already stated in Sections 1-12;
where a rule already exists, this section cross-references it by section
number instead.

### 13.1 Targets and Choosing a Target

- **Target** — a permanent, challenger, or other game object that a card's
  or ability's rules text names as what its effect applies to, chosen from
  among the game objects that meet whatever restriction that rules text
  states (for example, Cinderfall Bolt's "any Unit", Section 9.2). Not
  every card or ability has a target; a card or ability only has one if
  its rules text names one.
- **Legal target** — a game object that meets every restriction stated by
  the targeting rules text, at the moment being checked (Section 13.2).

A target is chosen the instant the targeting card or ability is
added to the Queue (Section 2's Queue; Section 6) — never later, and never at the
moment it resolves. This applies equally to a card a challenger plays and
to a triggered ability that enters the Queue on its own (Section 2's
Trigger/Triggered ability). The challenger playing the card, or
controlling the triggered ability, chooses its target(s) as part of
adding it to the Queue, and every target chosen
MUST be a legal target at that moment; a card or ability that names a target but has no legal
target available to choose MAY NOT be added to the Queue at all.

Once chosen, a target is fixed: nothing in this section lets a target be
reselected or changed after the card or ability that named it is already
in the Queue. This matches how every other Queue entry in this rulebook
behaves — Section 6 already treats the Queue as an ordered, fixed sequence
of entries once something is added to it, and a target chosen at that
same moment is no different.

### 13.2 Legality Recheck and Fizzling

A target's legality is not only checked once, at the moment it is chosen
(Section 13.1). It is rechecked immediately before the entry that named
it resolves (Section 2's Resolve; Section 6) — the last possible moment
before its effect would apply.

If an entry has exactly one target, and that target is
not a legal target at this recheck per the definition above, the entry **fizzles**: it does nothing —
none of its rules text takes effect — and it is still removed from the
Queue exactly as though it had resolved (Section 2's Resolve). A fizzled
entry never resolves against nothing, and nothing in this section lets a
fizzled entry's controller pick a new, legal target in place of the one
that stopped being legal — an illegal target simply ends the entry's
effect, not its target.

This section does not state a rule for an entry with more than one
target, since no card printed under this rulebook so far has more than
one (Section 9's examples each name at most one target); a future card
doing so would need its own rules text to state what happens if only some
of its targets are illegal at the recheck.

### 13.3 Worked Example: A Fizzled Response

This example follows one Main Phase exchange between Reva (active player)
and Toma (non-active player), continuing in the same style as Section 7's
worked example. Toma controls a single Unit, Scrap Sentinel, combat
strength 2 with no damage marked against it. Reva controls no Units.

1. It is Reva's Main Phase. The Queue is empty and Reva holds priority.
   Reva plays Cinderfall Bolt (Section 9.2: Fast, "deal 3 damage to any
   Unit"), naming Scrap Sentinel as its target — the only Unit on the
   Field and therefore the only legal target available (Section 13.1).
   Cinderfall Bolt is added to the Queue with Scrap Sentinel locked in as
   its target. Reva passes.
2. Priority moves to Toma. The Queue is not empty, so Toma may respond
   (Section 2's Response). Toma plays a second copy of Cinderfall Bolt,
   naming Scrap Sentinel — Toma's own Unit — as its target, and passes.
   Toma's card, played later, sits above Reva's in the Queue (Section 6)
   and so resolves first.
3. Both challengers pass in succession, the priority window closes, and
   Toma's Cinderfall Bolt resolves: it deals 3 damage to Scrap Sentinel,
   whose combat strength is 2, destroying it (Section 12.3). Scrap
   Sentinel is moved to Toma's Wreck (Section 3).
4. A new priority window opens; both challengers pass again, and Reva's
   Cinderfall Bolt — still the Queue's only entry — is about to resolve.
   Immediately before it resolves, its target is rechecked (Section
   13.2): Scrap Sentinel is no longer on the Field, so it is no longer a
   legal target. Reva's Cinderfall Bolt has exactly one target and that
   target is illegal at the recheck, so it fizzles: it deals no damage to
   anything, and is removed from the Queue exactly as though it had
   resolved.
5. The Queue is now empty. Play continues to the Conflict Phase with Toma
   controlling no Units and having taken no damage from Reva's card.

This confirms, on paper, that a Fast card's target is locked in when it
is added to the Queue (Section 13.1), not when it resolves; that a
Response resolving first (Section 6) can remove the only legal target an
already-queued entry had; and that losing its sole target this way
fizzles the entry — it does nothing and leaves the Queue, rather than
resolving against nothing or letting its controller retarget it (Section
13.2).

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
