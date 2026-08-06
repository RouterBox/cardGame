# cardgame-alpha-set-starter-cards

- merged: 2026-07-28T05:05:03.414Z
- intent: Fourth design deliverable for the cardGame pilot (gamePlan.md is the source of truth for scope). This is a DESIGN unit, not software (T8): output is a markdown document a human reads and reacts to. design/rules.md is shipped through Section 9, giving every future card a canonical template (Name, Cost line, Type line, Rules text, optional Stats/counters line), five Card Types each tied to one Fount, and the multi-type/multi-cost rule. This unit writes design/cards/alpha-set.md: the first batch of real Alpha-set cards built against that template rather than worked examples inside the rulebook itself. Cards should draw on design/world.md and the five design/races/*.md files so the set reads as belonging to this setting, not generic reskins. Completing this is the first concrete step toward I6's end goal — a card set compelling enough that RouterBox eventually opens the software gate — and keeps design moving at full decided scope (T1) rather than stalling after rules.
- criteria: AC1, AC2, AC3, AC4, AC5, AC6, AC7 (2 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-alpha-set-starter-cards, cycle 1

## Scope

Diff adds `design/cards/alpha-set.md` (18 named cards) and `test/design-cards.test.js`
(the test file was authored in an earlier phase per plan.md; it appears in this
diff only because the review is against the full unit diff). No other files are
touched — additive only, matching plan.md's stated scope.

## Verification method

This is a T8 design unit with no executable business logic, so review consisted of:
- Reading `design/rules.md` §9 (Card Types & Templating) in full, since it is the
  canonical spec every card must conform to.
- Reading all five `design/races/*.md` files to independently verify the "Primary
  strength" and race-title claims the plan makes, rather than trusting the plan's
  narrative.
- Reading `test/helpers/markdown.js` to confirm `parseSections()` actually slices
  `###`-level card bodies the way `test/design-cards.test.js` assumes (it does:
  any heading match starts a new section; `level 3` filter picks up exactly the
  18 card headings; body lines accumulate until the next heading of any level).
- Hand-tracing every one of the 18 cards in the diff against the AC1–AC5 logic in
  `test/
