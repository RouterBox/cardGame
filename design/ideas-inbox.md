# Ideas Inbox

RouterBox's design directives, captured verbatim with date. The Producer reads
this file when proposing design units; each idea graduates into rules.md /
world.md / card designs through a unit that cites it. Ideas are never deleted —
mark them `[incorporated: <unit-name>]` when a shipped unit lands them.

## 2026-07-26 — Spatial layer: planets, wormholes, generator placement [incorporated: cardgame-spatial-battlefield-rules]

> "planets are nodes on a graph connected by wormholes of variable lengths.
> Generators are built on planets."

Implications to design through (Producer: propose units against these, cite T9/I6):
- The battlefield is a GRAPH, not abstract rows: planets are nodes, wormholes
  are edges with a length attribute (travel time / range in turns).
- Generators — the resource engine — are placed on specific planets, which makes
  them positional: capturable, defensible, blockade-able. Losing a planet can
  mean losing the generators on it.
- Movement/range becomes a first-class rules concept: units traverse wormholes,
  and wormhole length gates how fast pressure reaches an opponent.
- Map setup is part of game setup (fixed maps? drafted maps? symmetric?) — needs
  a rules.md section and playtest-on-paper procedures.
- Interacts with every race identity (e.g. a materials race that fortifies
  chokepoints vs an intelligence race that sees more of the graph).

## 2026-07-26 (later) — Homeworlds, discovery, wormhole control [incorporated: cardgame-spatial-battlefield-rules]

> "the game starts on homeworlds and players can 'discover' new worlds by
> opening wormholes of various lengths, but discovering unexplored worlds is
> cheaper and easier than opening a wormhole to an enemy world. wormholes can
> be restricted in various ways; direction, team, unit types. Worm holes can
> be closed."

Implications to design through (extends the spatial-layer entry above):
- Each player begins on a HOMEWORLD — the anchor node of their side of the graph;
  presumably where the first generator lives and a likely win-condition target.
- The map GROWS during play: discovery is an action. Opening a wormhole to an
  unexplored world is the cheap/easy expansion route; punching a wormhole toward
  an enemy world costs more — so aggression pays a toll and turtling/expansion
  have real economy.
- Wormholes are typed, not plain edges: restrictable by direction (one-way),
  team (allied-only passage), and unit type (e.g. Biology-only, no vehicles).
  Restriction effects become a whole card design space (locks, keys, tolls).
- Wormholes can be CLOSED — edges are destructible, so the graph topology is
  itself a battlefield: cut a chokepoint, strand a fleet, seal your flank.
- Combos with race identity: the Concord discovering more cheaply (Signal),
  the Communion bending wormhole rules (Skein), the Reach fortifying them.
