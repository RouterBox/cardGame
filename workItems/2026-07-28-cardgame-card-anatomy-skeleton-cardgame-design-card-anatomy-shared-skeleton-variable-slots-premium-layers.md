# cardgame-card-anatomy-skeleton: cardGame design — card anatomy: shared skeleton, variable slots, premium layers

## Header

- unit: cardgame-card-anatomy-skeleton
- title: cardGame design — card anatomy: shared skeleton, variable slots, premium layers
- project: cardgame
- completed: 2026-07-28
- outcome: merged
- start_sha: e658e450894a8ced304e271cb9faa42f2aafb26e
- end_sha: 4e79bb408aff8a24a804076eb5cf2f32b5744a5c

## Intent

User directive (2026-07-28, verbatim, logged in design/ideas-inbox.md): a card is a compound object — "a border/frame with name/cost/other decorating variables, then an art field and a text field," with premium versions (borderless, foil, alt art) as "layers" on top; "Only the variables vary, and the card maintains a cohesive look because of the shared skeleton/base card design."

This is a DESIGN unit (T8): output is a markdown specification a human reads, not software and not image files. Write design/cards/card-anatomy.md: the visual/structural anatomy of a card as a layered compound object. This is the bridge document between the text-only design shelf and future graphics work — it must give any future art generation (Leonardo) and any future frame mockup a known shape to fit.

Canon to honor: design/rules.md Section 9 (the canonical text template: Name, Cost line, Type line, Rules text, optional Stats/counters line — the anatomy's slots must map onto these one-to-one, plus the art window and any frame-variable slots), design/cards/alpha-set.md (18 real cards the anatomy must be able to render), design/world.md (five Founts as the natural frame color-identity axis).

Deliverables in the target repo (C:/github/cardGame):

1. `design/cards/card-anatomy.md` containing, in named sections:
   - **The Skeleton** — the shared base every card instantiates: each zone of the card face (frame/border, name slot, cost slot, type line, art window, rules-text box, stats corner, and any others the design needs, e.g. set/collector strip), with each zone's purpose and its relationship to the rules.md Section 9 template fields.
   - **The Variables** — what varies per card and what drives each variable (e.g. cost slot content from the Cost line; frame color identity from the card's Fount(s), including how multi-Fount cards render; stats corner present only for Permanents).
   - **The Layers** — the premium treatment system: base treatment plus at least three premium treatments (e.g. borderless, foil, alt-art), each defined as a layer swap on the same skeleton with an explicit statement of what it may and may not change (cohesion rule: gameplay-relevant slots stay identical and legible across all treatments).
   - **Worked Examples** — at least two cards from alpha-set.md walked through the anatomy zone by zone (one single-Fount, one multi-type/multi-cost), showing what each slot contains for that card.
2. The document must be self-contained prose (plain-language bar T6): a reader who has never seen the rules understands what a card looks like and why premium versions still read as the same game.

## Acceptance Criteria

- AC1 [user]: design/cards/card-anatomy.md exists and defines a shared skeleton with named zones including at minimum a frame/border, name slot, cost slot, type line, art window, and rules-text box.
- AC2 [user]: A section on premium treatments defines at least three treatments (such as borderless, foil, alt-art) each described as a layer on the shared skeleton, and states an explicit cohesion rule about what treatments may not change.
- AC3 [paraphrase]: Every required field of the rules.md Section 9 card template (Name, Cost line, Type line, Rules text, Stats/counters line for Permanents) is mapped to exactly one skeleton zone, and the mapping is stated in the document.
- AC4 [inferred]: The variables section states how frame identity is driven by the card's Fount(s), including the rendering rule for cards with more than one Fount in their cost.
- AC5 [inferred] (held_out): At least two named cards from design/cards/alpha-set.md appear as worked examples walked through the anatomy zone by zone, at least one of which is one of the set's multi-type/multi-cost cards.

## Plan

# Plan: cardgame-card-anatomy-skeleton

GATE: none

Risk self-assessment (FIRE):
- **Reversibility:** Fully reversible. Every change is a new file (one new markdown design doc under `design/cards/`, one new test file under `test/`). No existing file is modified or deleted.
- **Security impact:** None. Pure static markdown content and a read-only `node:test` file (filesystem reads only, no eval, no network, no user input).
- **User data:** None touched — this is fictional game-design content.
- **Schema changes:** None.

Unit size: fits in one bolt. One new content file with no interdependencies beyond citing `design/rules.md` and `design/cards/alpha-set.md` (both read-only references, fully resolved in this plan up front), plus one new test file. No split needed.

Held-out criteria check: AC5 (at least two named alpha-set.md cards walked through the anatomy zone by zone, at least one multi-type/multi-cost) is redundant with the visible intent, not novel. Deliverable #1 in unit.md already requires a "Worked Examples" section covering "at least two cards from alpha-set.md ... (one single-Fount, one multi-type/multi-cost)" — AC5 just restates that requirement in acceptance-criterion form and makes it machine-checkable. Not a spec bug — no action needed beyond what the visible intent already asked for. This plan's worked-examples content is written to satisfy it explicitly (see "Worked Examples" below, and the AC5 test).

## Repo context (verified)

- Repo root (this worktree): `C:\github\.agentbox-worktrees\cardGame\cardgame-card-anatomy-skeleton`, branch `bolt/cardgame-card-anatomy-skeleton`.
- Canon read: `design/rules.md` Section 9.1 (Canonical Card Template: Name, Cost line, Type line, Rules text, optional Stats/counters line) and Section 9.7 (multiple types/multiple costs — total cost is a per-Fount sum, a card is a Permanent if any listed type is a permanent type); `design/cards/alpha-set.md` (18 cards, including the "Multiple Types and Multiple Costs" trio: Wrought-Bloom Graft, Signal-Wrought Prototype, Tangle-Forged Bolt); `design/world.md` (five Founts: the Mass — materials, the Bloom — biology, the Signal — intelligence, the Circuit — technology, the Tangle — magic); `design/ideas-inbox.md` 2026-07-28 entry (the directive this unit implements, verbatim: "a border/frame with name/cost/other decorating variables/ then an art field and a text field... premium versions... like 'layers' of a compound object").
- `design/cards/card-anatomy.md` does not exist yet — this unit creates it. `design/cards/alpha-set.md` already exists and is read-only reference material (do not modify it).
- Test precedent: `test/design-cardtypes.test.js` and `test/design-cards.test.js` are the closest analogs — both mechanically check structural properties of markdown design docs (section presence, field ordering, cross-file invariants against `design/cards/alpha-set.md`) using `test/helpers/markdown.js`'s `parseSections`/`sectionText`/`findSection` helpers, without hardcoding unrelated content. This plan's new test file (`test/design-card-anatomy.test.js`) follows the exact same style.
- `test/helpers/markdown.js` exports `parseSections(content)` (splits on `#`-`######` headings into `{level, title, lines}`), `findSection(sections, titleRegex)`, and `sectionText(sections, titleRegex)` (body of a heading plus all nested subsections, up to the next heading of equal-or-shallower level). Reuse as-is.
- Test command: `node --test` (auto-discovers `test/*.test.js`).

## Design decisions (so the junior doesn't have to invent anything)

**Zones (8 total, in top-to-bottom / left-to-right reading order):** Frame/Border, Name Slot, Cost Slot, Type Line, Art Window, Rules-Text Box, Stats Corner, Set/Collector Strip. The first six satisfy AC1's minimum list; Stats Corner and Set/Collector Strip are the "any others the design needs" zones unit.md calls out by name.

**Field → zone mapping (AC3, one-to-one):**

| rules.md Section 9.1 field | Skeleton zone |
|---|---|
| **Name** | Name Slot |
| **Cost line** | Cost Slot |
| **Type line** | Type Line |
| **Rules text** | Rules-Text Box |
| **Stats/counters line** | Stats Corner |

Frame/Border, Art Window, and Set/Collector Strip carry no Section 9.1 field — they're the "border/frame... and an art field" the skeleton adds on top of the rules text template, plus print bookkeeping.

**Fount → color identity (drives Frame/Border, AC4):** Mass = ash-grey, Bloom = green, Signal = cyan, Circuit = copper, Tangle = violet. Multi-Fount cards split the Frame/Border into one equal band per Fount, ordered left-to-right exactly as the Founts are listed in the Cost line.

**Premium treatments (AC2, 3 required + 1 bonus):** Borderless, Foil, Alt-Art (the three unit.md names explicitly), plus Extended Art as a fourth, all defined as layer swaps with an explicit cohesion rule: the five rules-relevant zones (Name Slot, Cost Slot, Type Line, Rules-Text Box, Stats Corner) may never change in content across treatments — only Frame/Border, Art Window, and Set/Collector Strip may change.

**Worked examples (AC5, 2 required):** Sporeknit Warden (Biology, 3 Bloom — single-Fount) and Signal-Wrought Prototype (Intelligence Technology, 1 Signal + 1 Circuit — multi-type, multi-cost). Both are real cards in `design/cards/alpha-set.md`; Signal-Wrought Prototype is one of the three cards in alpha-set.md's own "Multiple Types and Multiple Costs" section.

## Files to create (2 files, no files modified)

### 1. Create `design/cards/card-anatomy.md`

```markdown
# Card Anatomy — The Shared Skeleton, Variables, and Premium Layers

Every card in the Amaranth Expanse, no matter what it does in play or how much a premium print of it might someday be worth, is built from the same underlying shape. This document describes that shape: the skeleton every card shares, the parts of it that change from card to card, and the "premium" treatments (foil, alt-art, and so on) that dress the same skeleton up without ever changing what the card actually says or does. You do not need to know a single rule of this game to read this document — by the end of it you should know exactly what a physical card looks like, and why a foil version of a card and the plainest common printing of the same card are, underneath the shine, identical in every way that matters to play.

## The Skeleton

Think of a card the way you'd think of a car's chassis: every trim level, every paint job, every model year gets bolted onto the same underlying frame, and that shared frame is what makes them all recognizably one car line. A card's chassis is a fixed set of named zones, laid out in the same relative position on every card ever printed. Below is each zone, in the order a reader's eye naturally moves across a card — top to bottom, left to right within the top band — what it's for, and, where relevant, which field of the card's rules text it displays.

- **Frame/Border** — the outermost edge of the card: the printed border that frames everything else and, on the base treatment, carries the primary color-coded identity of the card's Fount(s) (see The Variables, below). Every other zone sits inside it. The Frame/Border does not itself display any single field from the card's rules-text template — it's the "wrapper" that makes a stack of otherwise very differently-worded cards feel like one deck.
- **Name Slot** — a band across the top of the card, above the art window, holding the card's title in the largest, most prominent lettering on the face. Displays the **Name** field.
- **Cost Slot** — a compact cluster of Fount-colored cost pips or numerals, positioned at the top corner opposite the Name Slot (conventionally the top-right). Displays the **Cost line** field.
- **Type Line** — a horizontal band directly beneath the art window, separating the illustration from the rules text below it. Displays the **Type line** field.
- **Art Window** — the large rectangular window beneath the Name Slot, holding the card's illustration. This is the zone future generated art fills; nothing about its shape or position ever changes card to card, only its contents.
- **Rules-Text Box** — the body of the card beneath the Type Line, holding the card's Fast/Slow timing and its abilities or effects, with any italicized flavor text set beneath that same text in the same box. Displays the **Rules text** field.
- **Stats Corner** — a small badge in the bottom corner of the Rules-Text Box (conventionally bottom-right), present only on cards that carry one and entirely absent from the print on cards that don't. Displays the **Stats/counters line** field.
- **Set/Collector Strip** — a thin strip along the very bottom edge of the card, below the Rules-Text Box, holding print-production information: which set the card belongs to, its collector number, and a rarity marker. This zone has no corresponding field in the rules.md Section 9.1 template — it exists for physical/print bookkeeping, not gameplay, and its exact content is out of scope for this document.

### Field → Zone Mapping

design/rules.md Section 9.1 defines the canonical text template every card's rules-relevant content is written to: Name, Cost line, Type line, Rules text, and, for Permanents only, an optional Stats/counters line. Each of those fields maps to exactly one of the skeleton zones above, and no field maps to more than one zone:

| rules.md Section 9.1 field | Skeleton zone |
|---|---|
| **Name** | Name Slot |
| **Cost line** | Cost Slot |
| **Type line** | Type Line |
| **Rules text** | Rules-Text Box |
| **Stats/counters line** | Stats Corner |

The Frame/Border, Art Window, and Set/Collector Strip zones carry no rules-template field — they're the "border/frame ... then an art field" the skeleton adds on top of the text template so a card is a physical object a player can hold, not just a block of rules text.

## The Variables

The Skeleton section named eight fixed zones. Nothing about their shape or position changes from card to card — what changes is only their content, and each zone's content is driven by a specific, predictable source.

- **Name Slot** content is the card's Name field, verbatim, with no abbreviation or truncation.
- **Cost Slot** content is drawn directly from the Cost line: one pip or numeral per Fount named in the Cost line, each colored in that Fount's identity color (see the color table below), showing the Fount Point amount printed for that Fount.
- **Type Line** content is the Type line field, verbatim, including the word "Permanent" when present.
- **Rules-Text Box** content is the Rules text field, verbatim, plus any flavor text the card carries, set beneath the rules text in the same box.
- **Stats Corner** is present only when the card is a Permanent (its Type line carries the word "Permanent") and its printed template includes a Stats/counters line. A Permanent with no Stats/counters line simply omits this zone from the print entirely, rather than printing it empty — the zone does not reserve visible space on a card that has nothing to put there.
- **Art Window** content is the one zone with no textual field driving it directly — its illustration brief is derived from the card's Name, Type line, and any flavor text, rather than copied from a single template field.

**Frame/Border color identity** is driven by the card's Fount(s), the way `design/world.md` describes each Fount's character:

| Fount | Frame/Border color |
|---|---|
| The Mass (materials) | Ash-grey |
| The Bloom (biology) | Green |
| The Signal (intelligence) | Cyan |
| The Circuit (technology) | Copper |
| The Tangle (magic) | Violet |

A card whose Cost line names exactly one Fount renders its Frame/Border as a single solid band in that Fount's color. A card whose Cost line names more than one Fount does not pick a single frame color: the Frame/Border is instead split into equal vertical bands, one band per Fount named in the Cost line, ordered left-to-right in the same order the Founts are listed in the Cost line, each band colored in that Fount's own identity color from the table above. The Cost Slot's pips follow the same left-to-right ordering, so a reader can match each cost pip to its corresponding frame band at a glance.

## The Layers

A card's base print is just the Skeleton with its Variables filled in. A premium treatment is a **layer swap**: a defined set of changes applied on top of the exact same skeleton, never a different card design. Below are the base treatment and four premium layers.

- **Base Treatment** — the default print described in The Skeleton and The Variables above: standard Frame/Border, a standard art crop inside the Art Window, no special finish.
- **Borderless** (layer swap) — the Frame/Border shrinks to a thin edge or disappears entirely, and the Art Window expands to bleed all the way to the card's physical edge. The Name Slot, Cost Slot, Type Line, Rules-Text Box, and Stats Corner stay in the exact same relative position and show the exact same text, simply reflowed over the expanded art. May change: the Frame/Border's size and visibility, and the Art Window's bleed extent. May not change: the content, position, or legibility of any rules-relevant zone — the Cost Slot's pips, in particular, must still read clearly against the expanded art.
- **Foil** (layer swap) — a reflective, holographic finish is applied across the Frame/Border (and, optionally, the Name Slot's lettering). No zone changes size or position at all. May change: surface finish only. May not change: the position, size, or content of any zone whatsoever.
- **Alt-Art** (layer swap) — the Art Window's illustration is swapped for an alternate illustration of the same subject matter described by the card's Name, Type line, and flavor text. Every other zone keeps the base treatment's placement and content exactly. May change: the Art Window's content only. May not change: any other zone's position or content — the replacement art must still depict a scene consistent with what the card's other zones say the card is, not unrelated art.
- **Extended Art** (layer swap) — the Art Window enlarges to bleed into the space normally occupied by the Name Slot's and Type Line's background, with those zones' text set atop the art on a semi-transparent banner rather than a solid background. May change: the Art Window's bleed extent behind other zones. May not change: the legibility or content of the zones now overlaid on the art — if the art makes the Name Slot or Type Line hard to read, the layer has failed its own rule.

**Cohesion rule:** across every treatment — base or premium — the Name Slot, Cost Slot, Type Line, Rules-Text Box, and Stats Corner (when present) must carry identical text content, in identical reading order, at a legible size. Only the Frame/Border, Art Window, and Set/Collector Strip zones may change between treatments. The five rules-relevant zones may never change in content across a treatment layer — only, at most, in typography or finish, never in what they say. This is what makes a $0.05 common and its foil, alt-art, borderless, or extended-art printing the same card at the table: a player reading any of them for cost, type, rules text, or stats gets the identical answer every time.

## Worked Examples

### Worked Example: Sporeknit Warden (single-Fount)

Sporeknit Warden is printed in `design/cards/alpha-set.md` with Cost line "3 Bloom", Type line "Biology — Permanent", Rules text "Slow.", and Stats/counters line "Combat strength 2. Enters with one Growth counter." Walked zone by zone:

- **Frame/Border:** a single solid green band, since the Cost line names exactly one Fount (the Bloom).
- **Name Slot:** "Sporeknit Warden".
- **Cost Slot:** one green pip reading "3", matching the Cost line's single Bloom entry.
- **Type Line:** "Biology — Permanent".
- **Art Window:** an illustration consistent with a Mireth Bloom Unit — something grown rather than built.
- **Rules-Text Box:** "Slow." — no further ability text on this printing, plus any flavor text carried in alpha-set.md.
- **Stats Corner:** "Combat strength 2. Enters with one Growth counter." — present because Sporeknit Warden's Type line carries "Permanent" and its template includes a Stats/counters line.
- **Set/Collector Strip:** print-production metadata (set symbol, collector number, rarity), not defined by this document.

### Worked Example: Signal-Wrought Prototype (multi-type, multi-cost)

Signal-Wrought Prototype is printed in `design/cards/alpha-set.md`'s "Multiple Types and Multiple Costs" section with Cost line "1 Signal, 1 Circuit", Type line "Intelligence Technology — Permanent", and Rules text "Slow. Spent, usable at instant speed (any time its controller holds priority): look at the top card of your Archive; you may move it to the bottom of your Archive instead of leaving it on top." It carries no Stats/counters line. Walked zone by zone:

- **Frame/Border:** a split frame of two equal vertical bands, left-to-right in Cost-line order — cyan on the left for the Signal, copper on the right for the Circuit — per The Variables' multi-Fount rendering rule.
- **Name Slot:** "Signal-Wrought Prototype".
- **Cost Slot:** two pips, "1" in cyan and "1" in copper, shown in the same left-to-right order as the Cost line's Signal-then-Circuit listing.
- **Type Line:** "Intelligence Technology — Permanent" — because Technology is a permanent Card Type (rules.md Section 9.1/9.7), the whole card is a Permanent even though Intelligence alone would not be.
- **Art Window:** an illustration consistent with the Panoptic Concord — a built object with a sensor-like, watching quality.
- **Rules-Text Box:** the full Slow/instant-speed ability text above, plus this card's flavor text.
- **Stats Corner:** absent entirely from the print — Signal-Wrought Prototype's printed template carries no Stats/counters line, so per The Variables, this zone reserves no space at all.
- **Set/Collector Strip:** print-production metadata, not defined by this document.
```

### 2. Create `test/design-card-anatomy.test.js`

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection } = require('./helpers/markdown');

const ANATOMY_PATH = path.join(__dirname, '..', 'design', 'cards', 'card-anatomy.md');
const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'alpha-set.md');

const CARD_TYPES = ['Magic', 'Technology', 'Intelligence', 'Biology', 'Materials'];
const FOUNTS = ['Tangle', 'Circuit', 'Signal', 'Bloom', 'Mass'];

const REQUIRED_ZONES = [
  'Frame/Border',
  'Name Slot',
  'Cost Slot',
  'Type Line',
  'Art Window',
  'Rules-Text Box',
];

const FIELD_TO_ZONE = [
  ['Name', 'Name Slot'],
  ['Cost line', 'Cost Slot'],
  ['Type line', 'Type Line'],
  ['Rules text', 'Rules-Text Box'],
  ['Stats/counters line', 'Stats Corner'],
];

const REQUIRED_TREATMENTS = ['Borderless', 'Foil', 'Alt-Art'];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readAnatomy() {
  if (!fs.existsSync(ANATOMY_PATH)) return null;
  return fs.readFileSync(ANATOMY_PATH, 'utf8');
}

function readCardsFile() {
  if (!fs.existsSync(CARDS_PATH)) return null;
  return fs.readFileSync(CARDS_PATH, 'utf8');
}

// Each `###` heading in alpha-set.md is one card; its body is the raw lines
// directly under it.
function listAlphaSetCards() {
  const content = readCardsFile();
  if (content === null) return [];
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function isMultiTypeMultiCost(card) {
  const typeMatch = card.body.match(/Type line:\s*([^\n]+)/);
  const costMatch = card.body.match(/Cost line:\s*([^\n]+)/);
  if (!typeMatch || !costMatch) return false;
  const typesFound = CARD_TYPES.filter((t) => new RegExp(`\\b${t}\\b`).test(typeMatch[1]));
  const founstFound = FOUNTS.filter((f) => new RegExp(`\\b${f}\\b`).test(costMatch[1]));
  return typesFound.length >= 2 && founstFound.length >= 2;
}

const anatomyContent = readAnatomy();
const anatomySections = anatomyContent ? parseSections(anatomyContent) : [];
const alphaSetCards = listAlphaSetCards();

// ---------------------------------------------------------------------------
// AC1: design/cards/card-anatomy.md exists and defines a shared skeleton with
// named zones including at minimum a frame/border, name slot, cost slot,
// type line, art window, and rules-text box.
// ---------------------------------------------------------------------------

test('AC1: design/cards/card-anatomy.md exists', () => {
  assert.ok(fs.existsSync(ANATOMY_PATH), `expected ${ANATOMY_PATH} to exist`);
});

test('AC1: has a "The Skeleton" section', () => {
  const idx = findSection(anatomySections, /^the skeleton$/i);
  assert.notStrictEqual(idx, -1, 'expected a heading titled "The Skeleton"');
});

for (const zone of REQUIRED_ZONES) {
  test(`AC1: The Skeleton defines the "${zone}" zone`, () => {
    const body = sectionText(anatomySections, /^the skeleton$/i);
    assert.ok(body, 'expected a "The Skeleton" section to check');
    const re = new RegExp(`\\*\\*${escapeRegExp(zone)}\\*\\*`);
    assert.ok(re.test(body), `expected a bolded "${zone}" zone under The Skeleton`);
  });
}

// ---------------------------------------------------------------------------
// AC3: every required field of the rules.md Section 9 card template (Name,
// Cost line, Type line, Rules text, Stats/counters line) maps to exactly one
// skeleton zone, and the mapping is stated in the document.
// ---------------------------------------------------------------------------

for (const [field, zone] of FIELD_TO_ZONE) {
  test(`AC3: field "${field}" is mapped to skeleton zone "${zone}"`, () => {
    const body = sectionText(anatomySections, /^the skeleton$/i);
    assert.ok(body, 'expected a "The Skeleton" section to check');
    const re = new RegExp(
      `\\|\\s*\\*\\*${escapeRegExp(field)}\\*\\*\\s*\\|\\s*${escapeRegExp(zone)}\\s*\\|`
    );
    assert.ok(re.test(body), `expected a mapping row "| **${field}** | ${zone} |"`);
  });
}

test('AC3: the five mapped fields map to five distinct zones', () => {
  const zones = new Set(FIELD_TO_ZONE.map(([, zone]) => zone));
  assert.strictEqual(zones.size, FIELD_TO_ZONE.length, 'expected each field to map to its own zone');
});

// ---------------------------------------------------------------------------
// AC4: the variables section states how frame identity is driven by the
// card's Fount(s), including the rendering rule for cards with more than one
// Fount in their cost.
// ---------------------------------------------------------------------------

test('AC4: has a "The Variables" section', () => {
  const idx = findSection(anatomySections, /^the variables$/i);
  assert.notStrictEqual(idx, -1, 'expected a heading titled "The Variables"');
});

test('AC4: The Variables ties Frame/Border color identity to the Fount(s)', () => {
  const body = sectionText(anatomySections, /^the variables$/i);
  assert.ok(body, 'expected a "The Variables" section to check');
  assert.ok(/Frame\/Border/.test(body), 'expected the Frame/Border zone to be discussed');
  for (const fount of FOUNTS) {
    assert.ok(new RegExp(`\\b${fount}\\b`).test(body), `expected The Variables to name the ${fount}`);
  }
});

test('AC4: The Variables states a rendering rule for cards with more than one Fount', () => {
  const body = sectionText(anatomySections, /^the variables$/i);
  assert.ok(body, 'expected a "The Variables" section to check');
  assert.ok(
    /more than one Fount/i.test(body),
    'expected an explicit statement covering cards with more than one Fount in their cost'
  );
  assert.ok(/band/i.test(body), 'expected the multi-Fount rendering rule to describe a split/band treatment');
});

// ---------------------------------------------------------------------------
// AC2: a section on premium treatments defines at least three treatments
// (such as borderless, foil, alt-art) each described as a layer on the
// shared skeleton, and states an explicit cohesion rule about what
// treatments may not change.
// ---------------------------------------------------------------------------

test('AC2: has a "The Layers" section', () => {
  const idx = findSection(anatomySections, /^the layers$/i);
  assert.notStrictEqual(idx, -1, 'expected a heading titled "The Layers"');
});

for (const treatment of REQUIRED_TREATMENTS) {
  test(`AC2: The Layers defines the "${treatment}" premium treatment as a layer swap`, () => {
    const body = sectionText(anatomySections, /^the layers$/i);
    assert.ok(body, 'expected a "The Layers" section to check');
    const nameRe = new RegExp(`\\*\\*${escapeRegExp(treatment)}\\*\\*`);
    assert.ok(nameRe.test(body), `expected a bolded "${treatment}" treatment`);
    assert.ok(/layer swap/i.test(body), 'expected treatments to be described as a "layer swap"');
  });
}

test('AC2: The Layers states an explicit cohesion rule about what may not change', () => {
  const body = sectionText(anatomySections, /^the layers$/i);
  assert.ok(body, 'expected a "The Layers" section to check');
  assert.ok(/cohesion rule/i.test(body), 'expected an explicit "Cohesion rule" statement');
  assert.ok(
    /may never change in content/i.test(body),
    'expected the cohesion rule to state what may never change across treatments'
  );
});

// ---------------------------------------------------------------------------
// AC5 (held_out): at least two named cards from alpha-set.md appear as
// worked examples walked through the anatomy zone by zone, at least one of
// which is one of the set's multi-type/multi-cost cards.
// ---------------------------------------------------------------------------

test('AC5: has a "Worked Examples" section', () => {
  const idx = findSection(anatomySections, /^worked examples$/i);
  assert.notStrictEqual(idx, -1, 'expected a heading titled "Worked Examples"');
});

function workedExampleSubsections() {
  const worked = sectionText(anatomySections, /^worked examples$/i);
  if (worked === null) return [];
  const idx = findSection(anatomySections, /^worked examples$/i);
  const level = anatomySections[idx].level;
  const subs = [];
  for (let i = idx + 1; i < anatomySections.length; i++) {
    if (anatomySections[i].level <= level) break;
    subs.push(anatomySections[i]);
  }
  return subs;
}

test('AC5: at least two named alpha-set.md cards appear as worked examples', () => {
  const subs = workedExampleSubsections();
  const alphaNames = new Set(alphaSetCards.map((c) => c.title));
  const matched = subs.filter((s) => {
    const m = s.title.match(/^Worked Example:\s*(.+?)\s*(?:\(|$)/i);
    return m && alphaNames.has(m[1].trim());
  });
  assert.ok(
    matched.length >= 2,
    `expected at least 2 worked examples naming real alpha-set.md cards, found ${matched.length} among [${subs.map((s) => s.title).join(', ')}]`
  );
});

test('AC5: at least one worked example is a multi-type/multi-cost card', () => {
  const subs = workedExampleSubsections();
  const cardsByName = new Map(alphaSetCards.map((c) => [c.title, c]));
  const matchedNames = subs
    .map((s) => {
      const m = s.title.match(/^Worked Example:\s*(.+?)\s*(?:\(|$)/i);
      return m ? m[1].trim() : null;
    })
    .filter((name) => name && cardsByName.has(name));
  const anyMultiType = matchedNames.some((name) => isMultiTypeMultiCost(cardsByName.get(name)));
  assert.ok(
    anyMultiType,
    `expected at least one worked example among [${matchedNames.join(', ')}] to be multi-type/multi-cost per alpha-set.md`
  );
});

for (const zone of REQUIRED_ZONES) {
  test(`AC5: every worked example walks through the "${zone}" zone`, () => {
    const subs = workedExampleSubsections();
    const alphaNames = new Set(alphaSetCards.map((c) => c.title));
    const matched = subs.filter((s) => {
      const m = s.title.match(/^Worked Example:\s*(.+?)\s*(?:\(|$)/i);
      return m && alphaNames.has(m[1].trim());
    });
    assert.ok(matched.length > 0, 'expected at least one worked example to check');
    for (const s of matched) {
      const body = s.lines.join('\n');
      const re = new RegExp(`\\*\\*${escapeRegExp(zone)}:?\\*\\*`);
      assert.ok(re.test(body), `expected worked example "${s.title}" to walk through the "${zone}" zone`);
    }
  });
}
```

## AC → verification mapping

| AC | Covered by |
|---|---|
| AC1 (file exists; skeleton defines the six minimum named zones) | `AC1:` tests |
| AC2 (≥3 premium treatments as layer swaps; explicit cohesion rule) | `AC2:` tests |
| AC3 (every Section 9 field maps to exactly one zone, mapping stated) | `AC3:` tests |
| AC4 (frame identity driven by Fount(s); multi-Fount rendering rule) | `AC4:` tests |
| AC5 (held_out — ≥2 alpha-set.md worked examples, ≥1 multi-type/multi-cost, zone-by-zone) | `AC5:` tests |
| Deliverable #2 (self-contained, plain-language prose) | Not separately auto-checked (qualitative, not structural) — the doc's opening paragraph and every zone/treatment description above are written assuming no prior rules knowledge; verify by reading the rendered file, not by test |

## Verification

Run from the repo root:

```
node --test
```

Expected: all pre-existing tests still pass (smoke, design-world, design-rules, design-races, design-battlefield, design-cardtypes, design-cards, design-characters — untouched), plus every test in the new `test/design-card-anatomy.test.js` passes. Output ends with a summary like:

```
# pass <previous total + new count>
# fail 0
```

Exit code 0. The load-bearing part is `fail 0`.

## Out of scope — do NOT do

- Do not modify `design/cards/alpha-set.md`, `design/rules.md`, `design/world.md`, or `design/ideas-inbox.md` — this unit's deliverable is additive only (one new design doc, one new test file).
- Do not modify any existing file under `test/` (`design-cards.test.js`, `design-cardtypes.test.js`, `design-characters.test.js`, `design-races.test.js`, `design-rules.test.js`, `design-world.test.js`, `design-battlefield.test.js`, `smoke.test.js`) or `test/helpers/markdown.js` — reuse `parseSections`/`sectionText`/`findSection` as-is.
- Do not produce any image files, mockups, or actual art — this is a T8 design unit; the deliverable is markdown prose only, per unit.md's own framing ("output is a markdown specification a human reads, not software and not image files").
- Do not change the zone names, the field→zone mapping, the Fount→color table, the treatment list, or the two worked-example card choices from what's specified above — the test file's regexes are written against this exact wording; renaming a zone (e.g. "Rules Text Box" without the hyphen) or picking different worked-example cards will fail the corresponding AC3/AC5 tests unless the test file is updated to match.
- Do not mark the 2026-07-28 ideas-inbox entry `[incorporated: cardgame-card-anatomy-skeleton]` — that's handled by the archive/merge step for this unit, not by the unit's own file changes.


## Findings

# Blind Review — cardgame-card-anatomy-skeleton, cycle 2

## Verification performed
- Read the full new file `design/cards/card-anatomy.md` (93 lines) and the full new test file `test/design-card-anatomy.test.js` (247 lines) — the diff shown is complete, not excerpted.
- Cross-checked every factual claim in the doc against canon: `design/rules.md` Section 9.1 (canonical template field list/order), Section 9.7 (multi-type/multi-cost permanent rule), `design/world.md` (five Founts), and `design/cards/alpha-set.md` (Sporeknit Warden and Signal-Wrought Prototype card text, and the "Multiple Types and Multiple Costs" section heading).
- Statically traced `test/design-card-anatomy.test.js`'s regexes and section-parsing logic (via `test/helpers/markdown.js`) against the actual doc content line-by-line to confirm every assertion matches. (I was unable to get shell execution of `node --test` approved in this session; the trace below is a full manual verification of every assertion path, not a guess.)

## AC-by-AC accounting

- **AC1** (skeleton with named zones: frame/border, name slot, cost slot, type line, art window, rules-text box) — **met**. "The Skeleton" section defines all six as bolded list items, plus two extra zones (Stats Corner, Set/Collector Strip) the plan called for.
- **AC2** (≥3 premium treatments as layer swaps + explicit cohesion rule) — **met**. "The Layers" defines Borderless, Foil, Alt-Art (plus a bonus Extended Art), each explicitly labeled "(layer swap)" with "May change" / "May not change" clauses, and an explicit "**Cohesion rule:**" paragraph stating the five rules-relevant zones "may never change in content across a treatment layer."
- **AC3** (every Section 9.1 field mapped 1:1 to a skeleton zone, stated in the doc) — **met**. The "Field → Zone Mapping" table maps Name→Name Slot, Cost line→Cost Slot, Type line→Type Line, Rules text→Rules-Text Box, Stats/counters line→Stats Corner. Verified against `rules.md` lines 558–570 — field names and the "Permanents only, optional" qualifier on Stats/counters match canon exactly.
- **AC4** (variables section states Fount→frame-identity rule, incl. multi-Fount rendering) — **met**. "The Variables" gives a Fount-color table (all five Founts, matching `world.md`) and an explicit single-Fount-vs-multi-Fount rendering rule (solid band vs. equal left-to-right vertical bands ordered by Cost-line order).
- Worked examples (Sporeknit Warden, Signal-Wrought Prototype) — both are real `alpha-set.md` cards; Cost line/Type line/Rules text/Stats line quoted in the doc match `alpha-set.md` verbatim, and the claim "Technology is a permanent Card Type... the whole card is a Permanent even though Intelligence alone would not be" matches `rules.md` Section 9.7 (lines 657–665) exactly.

## Cycle 1 finding resolution
Cycle 1's review flagged the zone bullet list contradicting its own "top to bottom" framing (Type Line listed before Art Window despite each zone's own prose stating Art Window sits above Type Line). Re-checked in the current file: the bullet order is now Frame/Border → Name Slot → Cost Slot → **Art Window** → **Type Line** → Rules-Text Box → Stats Corner → Set/Collector Strip (lines 9–16), and both Worked Examples walk the zones in this same corrected order (lines 73–80, 86–93). The contradiction is fixed; verified by direct read, not assumption.

## Findings
None. No INTRODUCED defects found in this cycle's diff — the previously-flagged ordering contradiction is resolved, content is internally consistent, matches canon precisely everywhere it cites canon, and the test file's assertions correspond to the actual document text (traced by hand; `node --test` execution was not available/approved in this review session).

## Non-issues checked and ruled out
- Frame/Fount color assignments (ash-grey/green/cyan/copper/violet) are new design decisions not specified in `world.md`; they don't contradict canon and are a reasonable, plan-documented choice — not a defect.
- Test file's "AC3: the five mapped fields map to five distinct zones" test asserts against its own hardcoded array rather than the doc, making it a tautology that always passes — a minor test-quality nit that doesn't cause a false pass on any AC not independently covered by the other AC3 tests (which do read the doc), so it's not gating.
- All test regexes (zone presence, field-mapping table rows, treatment names, cohesion-rule phrasing, Fount names, worked-example headings/card-name matching, multi-type/multi-cost detection, per-zone walkthrough checks) were traced by hand against the actual document text and all pass.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T05:19:35.769Z] **bolt:start** — unit=cardgame-card-anatomy-skeleton start_sha=e658e450894a8ced304e271cb9faa42f2aafb26e branch=bolt/cardgame-card-anatomy-skeleton worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-card-anatomy-skeleton
- [2026-07-28T05:19:36.972Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T05:25:54.490Z] **plan:done** — plan.md written
- [2026-07-28T05:27:27.677Z] **tests:done** — RED verified on test/design-card-anatomy.test.js (exit=1)
- [2026-07-28T05:28:50.927Z] **build:c1** — tests green, committed
- [2026-07-28T05:33:00.152Z] **review:c1** — NEEDS_WORK
- [2026-07-28T05:33:54.851Z] **build:c2** — tests green, committed
- [2026-07-28T05:38:14.696Z] **review:c2** — APPROVE
- [2026-07-28T05:38:16.181Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-28T05:38:16.466Z] **merge:done** — auto-merged bolt/cardgame-card-anatomy-skeleton into master (worktree)


## Receipt

```json
{
  "start_sha": "e658e450894a8ced304e271cb9faa42f2aafb26e",
  "end_sha": "42449dff158a465d4950bdd14c82ef2106bc9d18",
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
  "timestamp": "2026-07-28T05:38:16.178Z",
  "valid": true,
  "agent_reports": {
    "planner": "The plan file was written correctly. The plan is complete: `plan.md` at `C:\\github\\AgentBox\\units\\cardgame-card-anatomy-skeleton\\plan.md` specifies exact content for two new files (`design/cards/card-anatomy.md` and `test/design-card-anatomy.test.js`), fully written out, with a FIRE risk self-assessment (GATE: none), a held-out AC5 check confirming it's not a spec bug, an AC→verification mapping table, and an out-of-scope section. No repo files were touched — plan.md was the only output.",
    "test_writer": "I need your approval to run `node --test` so I can confirm the new tests fail as expected (RED check) before finishing. Could you approve that command?",
    "builder_c1": "All 215 tests pass (0 fail), and the only change is the new `design/cards/card-anatomy.md` file — no test files were touched. Done for cycle 1.",
    "reviewer_c1": "Findings written to `findings.md`. Summary: all four visible ACs are met and every factual claim (worked examples, field mappings, Fount names, Section 9.7 rule) checks out against canon — but I found one genuine internal contradiction introduced by this diff: the Skeleton's zone list claims to be ordered \"top to bottom\" yet lists the Type Line before the Art Window, directly contradicting each zone's own stated physical position (Art Window sits above Type Line). Since this document's whole purpose is to be an unambiguous shape for future mockups, that's a real defect worth a quick fix (swap two bullets, in both the main list and the two worked examples).\n\nNEEDS_WORK",
    "builder_c2": "Only `design/cards/card-anatomy.md` changed — no test files touched. Fixed the reviewer's ordering issue: swapped Art Window and Type Line in \"The Skeleton\" list (and both worked examples) so the bullet order now matches the doc's own \"top to bottom\" reading claim and each zone's stated physical stacking. Full suite is green: 215 pass, 0 fail.",
    "reviewer_c2": "Findings written to `C:\\github\\AgentBox\\units\\cardgame-card-anatomy-skeleton\\findings.md`. Cycle 1's zone-ordering contradiction (Type Line listed before Art Window despite the doc's own \"top to bottom\" framing) has been fixed in this cycle — Art Window now correctly precedes Type Line in both the skeleton list and both worked examples. All four visible ACs are met, every factual claim checks out against `rules.md` §9.1/§9.7, `world.md`, and `alpha-set.md`, and the new test file's assertions were hand-traced against the doc text with no mismatches.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
