# Blind Review — cardgame-alpha-set-character-signature-cards, cycle 3

## AC accounting

- **AC1** (file exists, exactly 5 distinct named cards, one per race under
  `design/races/`): satisfied. `design/cards/character-signatures.md`
  contains 5 `###` cards, one under each of the 5 `##` race headings
  (Cindral Reach, Mireth Bloom, Panoptic Concord, Starweave Communion,
  Wrought Assembly). `test/design-signature-cards.test.js` mechanically
  checks card count (5), name distinctness, and race-file count (5); "one per
  race" is closed by the AC3 tests, each of which asserts exactly one card
  names a given race's title.
- **AC2** (canonical rules.md §9.1 order — Cost line, Type line, Rules text,
  then, for Permanents only, an optional Stats/counters line): satisfied.
  Every card's fields appear in that order. Kordelia Vess (Materials —
  Permanent) omits the Stats/counters line, which the existing
  `alpha-set.md` convention (e.g. "Firmware Sentinel") already allows since
  the line is optional even for Permanents. Mother-Thread Ilvex and Unit
  0-Prime "Cast-Aside" (both Permanents) carry a Stats/counters line after
  Rules text. Selin Vashti Corr and Meridian Aule (Intelligence, Magic —
  non-Permanents) correctly omit it. `test/design-signature-cards.test.js`'s
  AC2 tests enforce both the field order and the Stats-line-only-if-Permanent
  rule mechanically.
- **AC3** (combined rules+flavor text names both the card's own race title,
  as printed in that race's H1, and one character from that race's own
  `design/characters/` file): satisfied. Each card's flavor paragraph
  contains the literal `The <Race>` string (e.g. "The Cindral Reach's oldest
  law", "The Mireth Bloom still bothers to speak with", "The Panoptic
  Concord's oldest currency", "The Starweave Communion always has", "The
  Wrought Assembly has no word") and the named character's full name in the
  same or the rules-text paragraph. The new test cross-checks each card
  against the *entire* character roster (not just its own race), which
  correctly catches a card naming a character from the wrong race, and a
  companion held-out test (AC4, not one of the 3 visible ACs) checks no two
  cards name the same character.

## Findings

### INTRODUCED, non-blocking: tools still touched, but the cycle-2 blocking defect is resolved

Cycle 2's review (see prior findings below the line) flagged that
`tools/render-card.js` and `tools/sync-cards-to-jaina.js` had been rewritten
to hardcode a single `alpha-set.md` path, permanently deleting their
directory-scanning `loadAllCards()` contract — an undisclosed, unbounded
regression that would have silently foreclosed rendering/syncing for any
future file added to `design/cards/`, not just this unit's file.

This cycle replaces that with a narrow, named, commented exclusion:
`EXCLUDED_CARD_FILES = new Set(['character-signatures.md'])`, restoring the
original `fs.readdirSync`-based multi-file scan and only skipping the one
file that (per plan.md) breaks the pre-existing, out-of-scope
`test/render-card.test.js` / `test/sync-cards-to-jaina.test.js` hardcoded
card-count assertions. This resolves the cycle-2 blocking concern: any other
file dropped into `design/cards/` in the future is still auto-discovered by
both tools, and the exclusion is self-documenting in-code.

A residual, smaller tension remains, which I'm not treating as gating: the
unit's own Intent text says "It deliberately does not touch ... either tool
under the pending Jaina/Leonardo security decisions," and this diff does
touch both tools. plan.md discloses this directly (the "Cycle 3 correction"
section) and gives a concrete reason — AC1 pins the new file to the exact
path `design/cards/character-signatures.md`, inside the same directory both
tools scan, and the pre-existing tests hardcoding counts against
`alpha-set.md` alone are out of scope to edit, so some accommodation was
unavoidable. Neither tool's behavior changes in a way that touches the
pending security decision itself — `sync-cards-to-jaina.js`'s actual sync
path is still gated behind its pre-existing `NOT_IMPLEMENTED_MESSAGE` stub;
only the file-discovery filter changed. No visible AC requires these cards
to be renderable or syncable, so I don't have a concrete failure scenario
where this breaks something the ACs promise — just a literal-text
contradiction of the Intent's scope sentence, disclosed and narrowly scoped
in the plan. Flagging for visibility, not gating.

## Not flagged (pre-existing / expected / out of scope)

- `site/design/cards/character-signatures.html`, the nav-link updates in
  `alpha-set.html`/`art-briefs.html`/`card-anatomy.html`, and the
  `site/index.html` link addition are the expected, mechanical output of
  `tools/build-site.js` (untouched by this diff) re-walking `design/` after a
  new file was added.
- Card content choices (which character/ability per race, Fount alignment)
  are design decisions covered by the plan's prior research and aren't
  mechanically checkable ACs; reviewed only for template/cross-reference
  compliance, which holds.
- The pre-existing hardcoded card-count assumptions in
  `test/render-card.test.js` / `test/sync-cards-to-jaina.test.js` are
  pre-existing fragility (single-file-directory assumption), not introduced
  by this diff.

## Verdict

APPROVE
