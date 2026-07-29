# cardgame-design-readiness-review: Cardgame Design Readiness Review

## Header

- unit: cardgame-design-readiness-review
- title: Cardgame Design Readiness Review
- project: cardgame
- completed: 2026-07-29
- outcome: escalated
- start_sha: c22baba76f6fee8862b7de4bdffd8c8946cc2b49
- end_sha: 4cba3b04e3999aff6a3f8cc33a241c9065409e63

## Intent

Add design/DESIGN-READINESS.md to the cardGame repo: a single markdown document that inventories the design-phase deliverables shipped to date (rulebook sections by number and title, world lore eras, races, star atlas, every card set/wave by name, art brief coverage, the authoring/render/site tooling) with a citation (file path) for each claim, and closes with a named, numbered list of at least three concrete open gaps or unresolved questions relevant to whether the design is compelling enough to ungate game software per I6. The document must be generated/checked so its card-set list is derived programmatically from design/cards/*.md (via the existing shared parser) rather than a hand-typed count that goes stale, matching the lesson in T12 about frozen counts drifting from reality. This is a new standalone file with no edits to existing design or rules content, avoiding any shared-file collision with concurrently running bolts.

## Acceptance Criteria

- AC1 [paraphrase]: design/DESIGN-READINESS.md is created and is non-empty markdown
- AC2 [inferred]: The document names every numbered rulebook section (rules.md) by its section number and title
- AC3 [inferred]: The document names every shipped card set/wave (Alpha starters, Frontier spatial cards, character signature waves, spatial race identity waves, wormhole restriction/closure cards, fount economy cards) with a file citation for each
- AC4 [inferred]: The document names the world lore eras and the races/star atlas content with file citations
- AC5 [paraphrase]: The document closes with a numbered list of at least 3 concrete open gaps or unresolved questions, each citing specific evidence (a file or section)
- AC6 [inferred] (held_out): test/design-readiness.test.js asserts the document's card-set list, when cross-checked against design/cards/*.md loaded via the existing shared parser (lib/parse-card-markdown.js), does not omit any set present on disk
- AC7 [inferred] (held_out): test/design-readiness.test.js fails (RED) before the document exists and passes (GREEN) after, run via `node --test`

## Plan

GATE: none

# Plan: cardgame-design-readiness-review

## Intent recap

Add one new standalone document, `design/DESIGN-READINESS.md`, that inventories
every design-phase deliverable shipped to date in this repo (rulebook sections,
world/lore/races/star-atlas, every card set/wave, art-brief coverage, and the
authoring/render/site/sync tooling), with a file-path citation for every claim,
and closes with a numbered list of at least 3 concrete open gaps relevant to
whether the design is compelling enough to lift the I6 "software gate" (see
`design/ideas-inbox.md`'s "software gate ruling" entry — game *implementation*
stays off-limits, content/authoring *tools* are allowed; this document is a
readiness check against that line, not new content itself).

Per the unit's T12 instruction, the document's card-set list must be checked
programmatically against `design/cards/*.md` via the existing shared parser
(`lib/parse-card-markdown.js`), not left as a hand-typed count that can drift.
That check lives in a new test file, `test/design-readiness.test.js`.

This unit touches **only two new files** — `design/DESIGN-READINESS.md` and
`test/design-readiness.test.js` — and edits nothing else. No existing design
file, rules content, or tool is modified, so there is no merge-conflict
surface with any other concurrently running bolt.

## Facts verified by inspection (do not re-derive by hand — these are given so
you don't need to run anything to write the doc; the test file re-derives the
card-set facts programmatically at run time so it can never go stale)

### Rulebook sections — `design/rules.md`

`design/rules.md` currently has exactly 15 numbered top-level (`## N. Title`)
sections, in this order:

1. Game Concepts
2. Glossary & Vocabulary
3. Zones
4. Resources
5. Turn Structure
6. Priority & Timing
7. Worked Example: A Priority Exchange
8. Spatial Battlefield
9. Card Types & Templating
10. Winning & Losing Conditions
11. Deck Construction
12. Combat Resolution
13. Targeting
14. Keyword Abilities
15. Starting the Game

### World, Lore, Races, Star Atlas

- `design/world.md` — "The Amaranth Expanse": a setting-overview section
  ("The Setting"), a brief history ("A History in Brief" — the First Weave and
  the Sundering), and the cosmology section "Cosmology: The Five Founts"
  naming all five Founts: **the Mass** (materials), **the Bloom** (biology),
  **the Signal** (intelligence), **the Circuit** (technology), **the Tangle**
  (magic).
- `design/lore.md` — "The Long Record": 6 named eras in its "Timeline of
  Eras" section, in order: **The Weave Age**, **The Sundering**, **The Long
  Dark**, **The Five Risings**, **The Cinderglass War**, **Current Era: The
  Uneasy Expanse**. The Cinderglass War pulls in 4 of the 5 races (Cindral
  Reach, Wrought Assembly, Panoptic Concord, Starweave Communion); the Mireth
  Bloom fights no battles in it and inherits its wreckage instead.
- `design/star-atlas.md` — 5 named Homeworlds (one per race) plus 3 named
  Frontier/Contested worlds:
  - Ashkeel — Homeworld of the Cindral Reach
  - Fenwreath — Homeworld of the Mireth Bloom
  - Vantaris — Homeworld of the Panoptic Concord
  - Ansareth — Homeworld of the Starweave Communion
  - Corewright — Homeworld of the Wrought Assembly
  - Halvorne Junction, Kelmourn Drift, Tallowfen (frontier/contested, no
    Homeworld)
- `design/races/*.md` — exactly 5 files, one per race: `cindral-reach.md`,
  `mireth-bloom.md`, `panoptic-concord.md`, `starweave-communion.md`,
  `wrought-assembly.md`.
- `design/characters/*.md` — 5 race files (4 named characters each, 20
  total, verified by grepping `^## ` in each file) plus `web.md`, which
  interlinks all 20 across races (its own Overview states "Twenty names,
  five civilizations, and one shape underneath all of it").

### Card sets/waves — `design/cards/*.md`, verified via `lib/parse-card-markdown.js`

Running the shared parser (`loadCardsFromFile`) against every file in
`design/cards/` today gives exactly 8 files that parse to 1-or-more real
cards (each `###` heading followed by `Cost line:`/`Type line:`/`Rules
text:`), totalling **52 cards**:

| File | Cards | What it is |
|---|---|---|
| `design/cards/alpha-set.md` | 18 | Alpha starters (first cards) |
| `design/cards/frontier-set.md` | 5 | Frontier spatial cards (one per race, uses the battlefield graph) |
| `design/cards/character-signatures.md` | 5 | Character signature wave 1 (one per race, tied to a named character) |
| `design/cards/character-signatures-wave-2.md` | 5 | Character signature wave 2 (one more per race) |
| `design/cards/spatial-race-identity-set.md` | 3 | Spatial race identity wave (wormhole mechanics as race identity) |
| `design/cards/wormhole-restrictions-set.md` | 5 | Wormhole restriction cards (locks/keys/tolls, Section 8.4) |
| `design/cards/wormhole-closure-cards.md` | 5 | Wormhole closure cards (Section 8.5) |
| `design/cards/fount-economy-set.md` | 6 | Fount economy cards (Bloom/Signal/Tangle generators + cheap replays) |

Three more files live in `design/cards/` but are **not** card sets — they are
prose/spec documents whose `###` sections don't carry the card-template
fields, so the shared parser correctly returns 0 cards for each:
`card-anatomy.md` (shared skeleton + premium-treatment spec),
`art-briefs.md` (44 art-brief sections — see below), `alt-art-briefs.md` (5
alt-art-brief sections). Do not list these three as card sets in the
document.

### Art brief coverage

- `design/cards/art-briefs.md` has 44 `###` brief sections, covering every
  card in `alpha-set.md` (18), `frontier-set.md` (5),
  `character-signatures.md` (5), `character-signatures-wave-2.md` (5),
  `fount-economy-set.md` (6), and `wormhole-restrictions-set.md` (5) — that's
  18+5+5+5+6+5 = 44.
- `design/cards/alt-art-briefs.md` has 5 alternate-art brief sections
  (Sporeknit Warden, Salvage-Wrought Bastion, Replicant Foundry Core,
  Foreknowledge Cipher, Unwritten Hour).
- **Gap (verified live, not stale):** none of the 3 cards in
  `spatial-race-identity-set.md` (Preemptive Survey, Unbound Passage,
  Chokepoint Garrison) or the 5 cards in `wormhole-closure-cards.md`
  (Bastion Seal Detachment, Withering Conduit Rot, Severance Directive, Rite
  of the Sealed Tangle, Chokepoint Demolition Charge) have a brief in
  `art-briefs.md` — 8 of the 52 shipped cards have no brief at all.
  `tools/composite-card-art.js` already surfaces this itself at runtime via a
  `no art brief for "<name>"` warning (see
  `workItems/2026-07-29-cardgame-art-brief-coverage-warning-*.md`), so this is
  a confirmed, currently-live gap, not a guess.

### Tooling

- `lib/parse-card-markdown.js` — the shared markdown parser
  (`parseCardMarkdown`, `slugify`, `loadCardsFromFile`, `loadAllCards`) every
  other tool and this unit's own test import from, so there is exactly one
  place the card-template parsing convention lives.
- `tools/render-card.js` — deterministic card-layout renderer; writes
  `renders/cards/*.svg`; supports `base`/`borderless`/`foil`/`extended-art`
  treatments; no illustration, no network call, no game-rule logic.
- `tools/composite-card-art.js` — composites art (mock client by default,
  `--live` Leonardo client with `LEONARDO_API_KEY`) into the Art Window slot;
  writes `renders/cards-composited/*.svg` (+ `*-alt.svg` for alt-art briefs);
  warns (does not fail) on cards with no matching brief.
- `tools/generate-phoenix-card.js` — one-card-at-a-time live Leonardo
  generation producing a fully self-contained `renders/cards-phoenix/*.svg`
  (raw art cached in `renders/art-raw-phoenix/`).
- `tools/build-site.js` — generates the whole design-shelf `site/` (one page
  per `design/**/*.md` plus `gamePlan.md`, `site/cards-index.html`,
  deterministic byte-identical reruns).
- `tools/serve-site.js` — LAN HTTP server for `site/` (binds an OS-assigned
  ephemeral port by design; `PORT`/`HOST` env override for a fixed address).
- `tools/sync-cards-to-jaina.js` — dry-run and `--live` sync of parsed card
  records to Jaina.
- `site/` — the generated design-shelf pages, `site/cards-index.html`,
  `site/phoenix-gallery.html`, `site/presentation/presentation.html` (the
  narrated AgentBox deck).
- All of the above are **tools for content generation and game authoring**,
  not a game implementation — consistent with `design/ideas-inbox.md`'s
  "software gate ruling" entry (I6): no file under `tools/`, `lib/`, or
  `site/` implements game rules or a playable client.

None of this needs to be re-verified by running anything — it is restated in
the document below. The **only** thing that must stay live-checked is the
card-set list, which the new test file re-derives from `loadAllCards()` /
`loadCardsFromFile()` every run, per T12.

## File to create: `design/DESIGN-READINESS.md`

Create this file with exactly the following content (a junior can copy this
verbatim — it is complete, not a sketch):

```markdown
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
```

Notes for the junior implementer on this content:
- Copy it byte-for-byte — every file path, section title, era name, and card
  count above was verified against the current repo state (see "Facts
  verified by inspection" above) and every count is also re-checked
  programmatically by the new test file below.
- Do not add, remove, or reorder any existing file — this is the only file
  this unit creates.

## File to create: `test/design-readiness.test.js`

Create this file with exactly the following content:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText } = require('./helpers/markdown');
const { loadCardsFromFile } = require('../lib/parse-card-markdown');

const DOC_PATH = path.join(__dirname, '..', 'design', 'DESIGN-READINESS.md');
const CARDS_DIR = path.join(__dirname, '..', 'design', 'cards');
const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const LORE_PATH = path.join(__dirname, '..', 'design', 'lore.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');

const content = fs.existsSync(DOC_PATH) ? fs.readFileSync(DOC_PATH, 'utf8') : '';
const sections = parseSections(content);

// ---------------------------------------------------------------------------
// AC1: the document exists and is non-empty markdown.
// ---------------------------------------------------------------------------

test('AC1: design/DESIGN-READINESS.md exists and is non-empty', () => {
  assert.ok(fs.existsSync(DOC_PATH), `expected ${DOC_PATH} to exist`);
  assert.ok(content.trim().length > 0, 'expected design/DESIGN-READINESS.md to be non-empty');
});

// ---------------------------------------------------------------------------
// AC2: every numbered rulebook section is named by number and title.
// Derived live from design/rules.md itself, so this can't drift if rules.md
// gains or renames a section later.
// ---------------------------------------------------------------------------

test('AC2: every numbered rulebook section in design/rules.md is named by number and title', () => {
  const rulesContent = fs.readFileSync(RULES_PATH, 'utf8');
  const rulesSections = parseSections(rulesContent).filter(
    (s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title)
  );
  assert.ok(rulesSections.length > 0, 'expected design/rules.md to have numbered top-level sections');

  for (const section of rulesSections) {
    assert.ok(
      content.includes(section.title),
      `expected design/DESIGN-READINESS.md to name rulebook section "${section.title}"`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3 / AC6 (held_out): every card set/wave that actually parses to 1+ real
// cards under design/cards/*.md (via the shared parser) is cited by filename
// in the document. This is the T12-driven check: it reads design/cards/ at
// run time, so it fails the moment a new set lands without a doc update.
// ---------------------------------------------------------------------------

test('AC3/AC6: every real card-set file under design/cards/ is cited in the readiness doc', () => {
  const files = fs
    .readdirSync(CARDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();

  const cardSetFiles = files.filter(
    (file) => loadCardsFromFile(path.join(CARDS_DIR, file)).length > 0
  );

  assert.ok(cardSetFiles.length > 0, 'expected at least one real card-set file under design/cards/');

  for (const file of cardSetFiles) {
    assert.ok(
      content.includes(file),
      `expected design/DESIGN-READINESS.md to cite "${file}" (a real card set on disk) but it did not`
    );
  }
});

// ---------------------------------------------------------------------------
// AC4: world lore eras and races/star atlas are named with citations.
// Era titles are derived live from lore.md's own "Timeline of Eras" list.
// ---------------------------------------------------------------------------

test('AC4: world lore eras and races/star atlas are named with file citations', () => {
  assert.ok(content.includes('design/world.md'), 'expected a citation to design/world.md');
  assert.ok(content.includes('design/lore.md'), 'expected a citation to design/lore.md');
  assert.ok(content.includes('design/star-atlas.md'), 'expected a citation to design/star-atlas.md');

  const loreContent = fs.readFileSync(LORE_PATH, 'utf8');
  const loreSections = parseSections(loreContent);
  const timeline = sectionText(loreSections, /timeline of eras/i);
  assert.ok(timeline, 'expected design/lore.md to have a "Timeline of Eras" section');

  const eraLines = timeline
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^\d+\.\s+\S/.test(l));
  assert.ok(eraLines.length >= 4, 'expected at least 4 eras in lore.md\'s own timeline');

  for (const line of eraLines) {
    const title = line.replace(/^\d+\.\s+/, '').trim();
    assert.ok(
      content.includes(title),
      `expected design/DESIGN-READINESS.md to name lore era "${title}"`
    );
  }

  const raceFiles = fs.readdirSync(RACES_DIR).filter((f) => f.endsWith('.md'));
  assert.ok(raceFiles.length > 0, 'expected race files under design/races/');
  for (const raceFile of raceFiles) {
    assert.ok(
      content.includes(raceFile),
      `expected design/DESIGN-READINESS.md to cite design/races/${raceFile}`
    );
  }
});

// ---------------------------------------------------------------------------
// AC5: closes with a numbered list of at least 3 open gaps, scoped to the
// document's own "Open Gaps" section (not any other numbered list in the
// doc, e.g. the rulebook or era lists).
// ---------------------------------------------------------------------------

test('AC5: closes with a numbered list of at least 3 open gaps', () => {
  const gapsBody = sectionText(sections, /open gaps|unresolved questions/i);
  assert.ok(gapsBody, 'expected an "Open Gaps & Unresolved Questions" section in design/DESIGN-READINESS.md');

  const items = gapsBody.match(/^\d+\.\s+\S.*/gm) || [];
  assert.ok(
    items.length >= 3,
    `expected at least 3 numbered open-gap items, found ${items.length}`
  );
});
```

Notes for the junior implementer on this test file:
- It imports `parseSections`/`sectionText` from the existing
  `test/helpers/markdown.js` (already used by `test/design-star-atlas.test.js`
  and others) rather than writing new markdown-parsing logic — reuse, not
  growth.
- It imports `loadCardsFromFile` from `../lib/parse-card-markdown` directly
  (the same module `tools/render-card.js`, `tools/composite-card-art.js`, and
  `tools/sync-cards-to-jaina.js` already import from) — this is the "existing
  shared parser" AC6 requires the cross-check to go through.
- `content`/`sections` are computed once at module scope from whatever is on
  disk *right now* (empty string before the doc exists, real content after).
  This is what makes the file naturally RED before `design/DESIGN-READINESS.md`
  exists (every test that reads `content` fails) and GREEN after, satisfying
  AC7 with no special-casing.
- Do not hardcode the rulebook section titles, era names, race filenames, or
  card-set filenames anywhere in this test — every one of those lists is
  re-derived from the actual source file at run time (`rules.md`, `lore.md`,
  `design/races/`, `design/cards/`). This is what keeps the test itself from
  becoming another frozen count that drifts, matching the T12 lesson the unit
  calls out.

## Commands to run, and expected output

1. **Before creating either file (RED check):**
   ```
   node --test test/design-readiness.test.js
   ```
   Fails immediately — `test/design-readiness.test.js` does not exist yet, so
   `node --test` reports 0 test files matched / a "could not find" style
   error. This is the starting RED state.

2. **Create `test/design-readiness.test.js` only (still RED, proves the gate
   is real):**
   ```
   node --test test/design-readiness.test.js
   ```
   Now the file loads, but every test fails because
   `design/DESIGN-READINESS.md` doesn't exist yet:
   - `AC1: design/DESIGN-READINESS.md exists and is non-empty` — fails on the
     `fs.existsSync` assertion.
   - `AC2`, `AC3/AC6`, `AC4`, `AC5` — all fail because `content` is `''` and
     none of the `content.includes(...)` / `sectionText(...)` assertions can
     pass against an empty string.
   Expected summary line: `# fail 5` (or however many `test(...)` calls are in
   the file — 5 as written above), `# pass 0`.

3. **Create `design/DESIGN-READINESS.md` with the exact content above, then
   run the full suite:**
   ```
   node --test
   ```
   Expected: every existing suite still passes unchanged (this unit edits no
   other file), plus all 5 new tests in `test/design-readiness.test.js` pass.
   Final summary line reads `# fail 0`.

## Risk self-assessment (FIRE)

- **Reversibility**: trivial. Two brand-new files, zero edits to any existing
  file. `git revert` (or simply deleting both files) fully undoes this unit
  with no side effects anywhere else in the repo.
- **Security impact**: none. No new inputs, no network calls, no new
  dependencies, no code path that executes user-controlled data — the test
  file only reads markdown already committed to the repo.
- **User data**: none touched — this is a design document and a test file.
- **Schema changes**: none. No change to the card-markdown template, the
  shared parser's output shape, or any other tool's behavior.

This is a low-risk, purely additive unit (one new doc, one new test file)
well within a single bolt — no split needed.

## Held-out AC audit

- **AC6** ("test/design-readiness.test.js asserts the document's card-set
  list ... does not omit any set present on disk") is redundant with the
  visible intent's explicit instruction to derive the card-set list
  programmatically via the shared parser (per T12) — it is the mechanical
  enforcement of AC3, not a new requirement. Not a spec bug.
- **AC7** ("test/design-readiness.test.js fails (RED) before the document
  exists and passes (GREEN) after") is the standard TDD gate already implied
  by AC1 ("is created and is non-empty") — any correct test file that checks
  `fs.existsSync`/content will naturally satisfy this without special-casing,
  which is exactly how the test file above is written (module-scope `content`
  read once from whatever is on disk). Not a spec bug.

No held-out AC in this unit smuggles in a requirement absent from the visible
intent or the other ACs — both are mechanical/structural restatements.


## Findings

(no findings.md)

## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T17:50:09.173Z] **bolt:start** — unit=cardgame-design-readiness-review start_sha=c22baba76f6fee8862b7de4bdffd8c8946cc2b49 branch=bolt/cardgame-design-readiness-review worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-design-readiness-review
- [2026-07-29T17:50:18.016Z] **baseline:done** — pre-edit test exit=1
- [2026-07-29T17:59:21.299Z] **plan:done** — plan.md written
- [2026-07-29T18:00:20.697Z] **tests:done** — RED verified on test/design-readiness.test.js (exit=1)
- [2026-07-29T18:04:47.092Z] **build:c1** — tests still red (exit=1)
- [2026-07-29T18:06:29.210Z] **build:c2** — tests still red (exit=1)
- [2026-07-29T18:07:35.560Z] **bolt:escalated** — circuit breaker after 3 cycles


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
