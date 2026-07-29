# Design Readiness Review — The Amaranth Expanse

This document inventories every design-phase deliverable shipped in this
repository to date, with a file citation for each claim, and closes with a
numbered list of open gaps relevant to `design/ideas-inbox.md`'s "software
gate ruling" entry (I6): game *implementation* (a rules engine, a playable
client) stays off-limits until the design is compelling enough to earn it;
tools for content generation and game authoring are already allowed and
several are shipped. This review exists to make that judgment call an
informed one instead of a guess.

## 1. Rulebook — `design/rules.md`

`design/rules.md` ("Amaranth Expanse — Core Rules") currently defines 15
numbered top-level sections:

- **1. Game Concepts**
- **2. Glossary & Vocabulary**
- **3. Zones**
- **4. Resources**
- **5. Turn Structure**
- **6. Priority & Timing**
- **7. Worked Example: A Priority Exchange**
- **8. Spatial Battlefield**
- **9. Card Types & Templating**
- **10. Winning & Losing Conditions**
- **11. Deck Construction**
- **12. Combat Resolution**
- **13. Targeting**
- **14. Keyword Abilities**
- **15. Starting the Game**

Sections 7, 8.7, 10.3, 12.5, 13.3, 14.6, and 15.5 each carry a worked
example, and Section 2 is a glossary every later section defines new terms
into before using them — a discipline the rulebook has followed
consistently since Section 5 ("Turn Structure") through Section 15
("Starting the Game").

## 2. World, Lore, Races & Star Atlas

- **`design/world.md`** — "The Amaranth Expanse": a galaxy/setting overview
  ("The Setting"), a brief history of the First Weave and the Sundering ("A
  History in Brief"), and the cosmology section "Cosmology: The Five
  Founts," naming and grounding all five categories as in-universe forces:
  **the Mass** (materials), **the Bloom** (biology), **the Signal**
  (intelligence), **the Circuit** (technology), **the Tangle** (magic).
- **`design/lore.md`** — "The Long Record": 6 named eras in its "Timeline of
  Eras" section — **The Weave Age**, **The Sundering**, **The Long Dark**,
  **The Five Risings**, **The Cinderglass War**, **Current Era: The Uneasy
  Expanse**. The Cinderglass War is the central turning point, pulling in
  the Cindral Reach, the Wrought Assembly, the Panoptic Concord, and the
  Starweave Communion directly; the Mireth Bloom fights no battles in it and
  inherits its wreckage instead. "Current Era: The Uneasy Expanse" is the
  fixed narrative anchor every card set's flavor text writes from.
- **`design/star-atlas.md`** — names one Homeworld per race (Ashkeel /
  Cindral Reach, Fenwreath / Mireth Bloom, Vantaris / Panoptic Concord,
  Ansareth / Starweave Communion, Corewright / Wrought Assembly) plus three
  Frontier/Contested worlds belonging to no race (Halvorne Junction, Kelmourn
  Drift, Tallowfen).
- **`design/races/`** — exactly 5 files, one per race: `cindral-reach.md`,
  `mireth-bloom.md`, `panoptic-concord.md`, `starweave-communion.md`,
  `wrought-assembly.md`. Each states an identity paragraph, one primary
  Fount strength, two complementary strengths, and two countering
  weaknesses.
- **`design/characters/`** — one file per race (4 named characters each, 20
  total) plus `design/characters/web.md`, which interlinks all 20 across
  race lines (its own Overview: "Twenty names, five civilizations, and one
  shape underneath all of it").

## 3. Card Sets & Waves — `design/cards/*.md`

Every shipped card set/wave, parsed via the shared parser
(`lib/parse-card-markdown.js`'s `loadCardsFromFile`/`loadAllCards`, which
every authoring tool in this repo already uses instead of each tool
re-implementing its own parsing):

- **Alpha Set** — `design/cards/alpha-set.md` — 18 cards. The Alpha starters:
  at least one card per Card Type and per Fount, at least one per race tied
  to that race's own primary Fount.
- **Frontier Set** — `design/cards/frontier-set.md` — 5 cards. One per race,
  each mechanically tied to the battlefield graph (`rules.md` Section 8).
- **Character Signatures** — `design/cards/character-signatures.md` — 5
  cards. One per race, each built from a specific named character in
  `design/characters/`.
- **Character Signatures, Wave 2** —
  `design/cards/character-signatures-wave-2.md` — 5 cards. A second named
  character per race, distinct from wave 1's.
- **Spatial Race Identity Set** — `design/cards/spatial-race-identity-set.md`
  — 3 cards. Race identity combined with the wormhole/battlefield graph.
- **Wormhole Restrictions Set** —
  `design/cards/wormhole-restrictions-set.md` — 5 cards. One per race,
  each placing a Directional or Team Restriction on a Wormhole (Section
  8.4).
- **Wormhole Closure Cards** — `design/cards/wormhole-closure-cards.md` — 5
  cards. One per race, each Closing a Wormhole (Section 8.5).
- **Fount Economy Set** — `design/cards/fount-economy-set.md` — 6 cards.
  Closes the Bloom/Signal/Tangle Generator gap `design/playtest-full-game.md`
  surfaced.

**Total: 52 named cards across 8 files.** This list is not a hand-typed
count: `test/design-readiness.test.js` re-derives it from
`design/cards/*.md` via `lib/parse-card-markdown.js` on every test run and
fails if any set on disk is missing from this section, so it cannot go
stale the way a frozen count would.

Three further files live in `design/cards/` but are design-spec/brief
documents, not card sets, and correctly parse to 0 cards:
`design/cards/card-anatomy.md`, `design/cards/art-briefs.md`,
`design/cards/alt-art-briefs.md` (see below).

## 4. Card Anatomy & Art Brief Coverage

- **`design/cards/card-anatomy.md`** — the shared card skeleton (Frame/
  Border, Name Slot, Cost Slot, Art Window, Type Line, Rules-Text Box, Stats
  Corner, Set/Collector Strip), the mapping from every `rules.md` Section
  9.1 template field to exactly one zone, and the premium-treatment layers
  (borderless, foil, extended art) that dress the same skeleton without
  changing what a card says or does.
- **`design/cards/art-briefs.md`** — 44 art-brief sections, covering every
  card in `alpha-set.md`, `frontier-set.md`, `character-signatures.md`,
  `character-signatures-wave-2.md`, `fount-economy-set.md`, and
  `wormhole-restrictions-set.md`.
- **`design/cards/alt-art-briefs.md`** — 5 alternate-art briefs for the
  fount Generators (Sporeknit Warden, Salvage-Wrought Bastion, Replicant
  Foundry Core, Foreknowledge Cipher, Unwritten Hour).
- **Known gap:** the 3 cards in `spatial-race-identity-set.md` and the 5
  cards in `wormhole-closure-cards.md` (8 cards total) have no brief in
  `art-briefs.md` yet. `tools/composite-card-art.js` already surfaces this
  live via a `no art brief for "<name>"` warning on every run (see Open Gap
  1 below).

## 5. Authoring, Render, Site & Sync Tooling

Per `design/ideas-inbox.md`'s "software gate ruling" entry (I6): game
*implementation* stays off-limits; tools for content generation and game
authoring are allowed. Every tool below is authoring/presentation tooling —
none implements game rules or a playable client:

- **`lib/parse-card-markdown.js`** — the single shared card-markdown parser
  (`parseCardMarkdown`, `slugify`, `loadCardsFromFile`, `loadAllCards`)
  every tool below, and this document's own test, import instead of
  re-implementing.
- **`tools/render-card.js`** — deterministic card-layout renderer
  (`renders/cards/*.svg`), base/borderless/foil/extended-art treatments, no
  illustration, no network call, no game logic.
- **`tools/composite-card-art.js`** — composites generated art (mock client
  by default, `--live` real Leonardo client) into the Art Window
  (`renders/cards-composited/*.svg`, `*-alt.svg`); warns, never fails, on
  cards missing a brief.
- **`tools/generate-phoenix-card.js`** — one-card live-Leonardo generation
  producing a fully self-contained `renders/cards-phoenix/*.svg`.
- **`tools/build-site.js`** — generates the whole design-shelf `site/`
  (one page per design markdown file plus `gamePlan.md`,
  `site/cards-index.html`), deterministically.
- **`tools/serve-site.js`** — LAN HTTP server for `site/` (ephemeral port by
  design).
- **`tools/sync-cards-to-jaina.js`** — dry-run and `--live` sync of parsed
  card records into Jaina.
- **`site/`** — the generated, browsable design shelf, including
  `site/cards-index.html`, `site/phoenix-gallery.html`, and
  `site/presentation/presentation.html`.

## 6. Open Gaps & Unresolved Questions

1. **Art-brief coverage has an 8-card hole.** None of the 3 cards in
   `design/cards/spatial-race-identity-set.md` or the 5 cards in
   `design/cards/wormhole-closure-cards.md` have a matching entry in
   `design/cards/art-briefs.md`, so `tools/composite-card-art.js` cannot
   generate art for them — confirmed live by that tool's own
   `no art brief for "<name>"` warning (see
   `workItems/2026-07-29-cardgame-art-brief-coverage-warning-*.md`). No
   unit has yet been proposed to close it.

2. **The Spatial Race Identity Set only speaks for 3 of 5 races.**
   `design/cards/spatial-race-identity-set.md` realizes
   `design/ideas-inbox.md`'s 2026-07-26 (later) entry — wormhole mechanics
   as race identity — for the Panoptic Concord, Starweave Communion, and
   Cindral Reach only. The Mireth Bloom and the Wrought Assembly have no
   card in this wave, even though that same ideas-inbox entry frames the
   mechanic as combining with "every race identity."

3. **No digital implementation of the design has ever been built or run.**
   `design/ideas-inbox.md`'s "software gate ruling" entry (I6 — the gate
   this review exists to inform) has, so far, kept every shipped unit to
   content-authoring tools. Nobody has yet tested whether the spatial
   battlefield graph, the five-Fount economy, or the Conflict Phase's
   priority/response system actually play well in real time; the only
   games ever run against this design are the two on-paper procedures in
   `design/playtest-spatial.md` and `design/playtest-full-game.md`, each a
   single walkthrough of one prewritten deck pairing.

4. **Jaina is wired up for card records only.** `design/ideas-inbox.md`'s
   "use Jaina as the content backbone" entry asked to make heavy use of
   Jaina "the whole way," but `tools/sync-cards-to-jaina.js` only syncs
   parsed card records. Characters (`design/characters/`), races
   (`design/races/`), world/lore (`design/world.md`, `design/lore.md`), and
   the star atlas (`design/star-atlas.md`) remain markdown-only prose with
   no Jaina schema or sync path yet.
