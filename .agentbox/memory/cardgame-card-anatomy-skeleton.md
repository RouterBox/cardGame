# cardgame-card-anatomy-skeleton

- merged: 2026-07-28T05:38:16.702Z
- intent: User directive (2026-07-28, verbatim, logged in design/ideas-inbox.md): a card is a compound object — "a border/frame with name/cost/other decorating variables, then an art field and a text field," with premium versions (borderless, foil, alt art) as "layers" on top; "Only the variables vary, and the card maintains a cohesive look because of the shared skeleton/base card design."
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-card-anatomy-skeleton, cycle 2

## Verification performed
- Read the full new file `design/cards/card-anatomy.md` (93 lines) and the full new test file `test/design-card-anatomy.test.js` (247 lines) — the diff shown is complete, not excerpted.
- Cross-checked every factual claim in the doc against canon: `design/rules.md` Section 9.1 (canonical template field list/order), Section 9.7 (multi-type/multi-cost permanent rule), `design/world.md` (five Founts), and `design/cards/alpha-set.md` (Sporeknit Warden and Signal-Wrought Prototype card text, and the "Multiple Types and Multiple Costs" section heading).
- Statically traced `test/design-card-anatomy.test.js`'s regexes and section-parsing logic (via `test/helpers/markdown.js`) against the actual doc content line-by-line to confirm every assertion matches. (I was unable to get shell execution of `node --test` approved in this session; the trace below is a full manual verification of every assertion path, not a guess.)

## AC-by-AC accounting

- **AC1** (skeleton with named zones: frame/border, name slot, cost slot, type line, art window, rules-text box) — **met**. "The Skeleton" section defines all six as bo
