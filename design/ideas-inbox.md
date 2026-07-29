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
  the Communion bending wormhole rules (Tangle), the Reach fortifying them.

## 2026-07-27 — characters per race (from RouterBox, verbatim) [incorporated: cardgame-race-characters]

> "Also want 3 to 5 characters per race with individual but interlinking
> narratives."

Implications to design through:
- 3–5 named characters for EACH of the five races (15–25 total).
- Each character carries an INDIVIDUAL narrative — their own story, wants,
  and arc — usable later as legendary/hero card identities and art briefs.
- The narratives INTERLINK: characters reference and collide with characters
  from other races, so the roster reads as one connected galaxy-scale story,
  not five isolated cast lists.

## 2026-07-28 — card anatomy as layered compound object (from RouterBox, verbatim) [incorporated: cardgame-card-anatomy-skeleton]

> "So thinking about other tcg cards, there is usually a border/frame with
> name/cost/other decorating variables/ then an art field and a text field.
> Then premium versions of cards will do like borderless, foil, alt art, etc
> premium treatments. But think of those as like 'layers' of a compound
> object. Only the variables vary, and the card maintain a cohesive look
> because of the shared skeleton/base care design."

Implications to design through:
- A card is a COMPOUND OBJECT: one shared skeleton/base design (frame,
  name slot, cost slot, type slot, art field, rules-text field, stats slot)
  that every card instantiates — only the variable content differs.
- Premium treatments (borderless, foil, alt art, extended art) are LAYERS
  swapped onto the same skeleton, not separate card designs — cohesion
  comes from the shared base.
- This is the bridge from text design to graphics: the skeleton spec must
  exist before any art is commissioned, so art fields have known shapes,
  and frame variables (e.g. Fount color identity) have defined slots.

## 2026-07-28 — deterministic card authoring engine + gen-AI art only in the art slot (from RouterBox, verbatim) [incorporated: cardgame-card-authoring-engine]

> "yeah and so image generators are notoriously bad at these structured
> elements like text and currency symbols, etc, and will have trouble
> holding the card style together between runs of different cards. what you
> wanna use leonardo for is just the art in the art layer, but you wanna
> more deterministically fill out the structured elements of the card with
> a deterministic card authoring engine that slots in the gen ai art into
> that slot."

Implications to design through:
- Division of labor: Leonardo (gen AI) produces ONLY the art-window image.
  Everything structured — frame, name, cost symbols, type line, rules text,
  stats — is rendered by a DETERMINISTIC card authoring engine (templating/
  layout code), which composites the AI art into the art slot.
- Rationale: image generators are bad at text/symbols and cannot hold a
  consistent card style across separate runs; determinism is what makes
  the shared skeleton actually shared.
- The card-anatomy skeleton spec is therefore also the engine's input
  contract: each zone the anatomy defines becomes a render slot the engine
  fills from card data (alpha-set.md entries are the data source).

## 2026-07-28 — software gate ruling: tools yes, game implementation no (from RouterBox, verbatim) [incorporated: cardgame-design-browser-site]

> "software for the game implementation is off limits but we can build tools
> for content generation and game authoring. For instance I think we also
> need a simple website to browse the game plans and concepts generated. I
> need to be able to see what we got without going over to my computer and
> picking through files and folders"

Implications:
- The software gate is now PARTIALLY open, with a clear line: game
  IMPLEMENTATION (rules engine, gameplay client) stays off-limits; TOOLS
  for content generation and game authoring are allowed — the card
  authoring engine qualifies, as does a design-browser website.
- First tool request: a simple website to browse the design shelf (plans,
  world, races, characters, rules, cards) readable from the phone — no
  file-picking on the computer.

## 2026-07-28 — use Jaina as the content backbone (from RouterBox, verbatim) [incorporated: cardgame-jaina-card-sync-live]

> "Oh also we need to make heavy use of Jaina the whole way which was built
> for this exact thing."

Implications:
- Jaina (RouterBox's own data platform — projects, schemas, records,
  actions, webhooks, codegen) becomes the system of record for structured
  game content: cards, characters, races, Founts, etc. as schema-backed
  records instead of only markdown prose.
- The authoring tools (card engine, design browser) should read from /
  write to Jaina rather than inventing their own storage.
- Markdown design docs remain the narrative/spec layer; Jaina holds the
  structured data layer the tools consume.

## 2026-07-29 — The game's name (verbatim from RouterBox)

> "Wreck Tangle" — "yeah thats the name of the game."

The game is officially named **Wreck Tangle**. (Origin: a play on the Tangle
Fount and the setting's salvaged First Weave wreckage — and, yes, on
"rectangle".) The name should propagate through the rulebook title, the
design-shelf site, the card set docs, and lore references to the game itself.
"The Amaranth Expanse" remains the SETTING name unless RouterBox says
otherwise — Wreck Tangle is the GAME.
