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
