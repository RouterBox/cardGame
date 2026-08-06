# cardgame-spatial-race-identity-cards

- merged: 2026-07-29T08:27:32.280Z
- intent: design/ideas-inbox.md's 2026-07-26 (later) spatial-layer entry lists five implications to design through; four have since been built into rules.md Section 8 and into the wormhole-restriction-cards/wormhole-closure-cards card sets (generic, same-effect-per-race), but the fifth — 'Combos with race identity: the Concord discovering more cheaply (Signal), the Communion bending wormhole rules (Tangle), the Reach fortifying them' — has never been realized by any printed card. rules.md already fully specifies the mechanics each of these three cards needs: Section 8.3 fixes Discovery's Fount Point cost (Length for Frontier, double for Contested) as a number a card can modify; Section 8.4 defines Directional and Team Restrictions as limits on which Assault paths may count a Wormhole (Section 8.6), which a card can state an exception to; Section 8.5 defines Closure as an action only 'whatever card or effect states it' can take, meaning a card can equally state a condition that blocks it; and Section 4.1 already establishes the Mass's Fortification-counter pattern (paying Mass Points to protect a permanent from destruction) as the precedent for the Reach's fortifying identity. This unit adds a new design/cards/spatial-race-identity-set.md with exactly 3 cards, one each for Panoptic Concord, Starweave Communion, and Cindral Reach, following the same Cost/Type/Rules-text/Stats-line template test/design-frontier-cards.test.js already enforces for frontier-set.md, each card's Rules text citing the relevant rules.md section by number the same way frontier-set.md's cards do. No rules.md change is needed or made — every effect is expressible entirely within a card's own Rules text as a stated exception to an already-shipped default, and no other card file's names or content are touched.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-spatial-race-identity-cards, cycle 1

## Scope of diff

- New `design/cards/spatial-race-identity-set.md` — 3 cards (one per race).
- New `renders/cards/{preemptive-survey,unbound-passage,chokepoint-garrison}.svg`.
- New `site/design/cards/spatial-race-identity-set.html`, plus sidebar-nav
  updates in 8 sibling `site/design/cards/*.html` files and one new `<li>`
  in `site/index.html`.
- New `test/design-spatial-race-identity-cards.test.js`.

## AC-by-AC verification

**AC1** — `design/cards/spatial-race-identity-set.md` exists, contains
exactly 3 distinctly-named `###` cards ("Preemptive Survey", "Unbound
Passage", "Chokepoint Garrison"), one under each of `## The Panoptic
Concord`, `## The Starweave Communion`, `## The Cindral Reach`. Verified the
race names against `design/races/{panoptic-concord,starweave-communion,
cindral-reach}.md` (`# The <Name>` titles) — each card's italic flavor line
names its own race exactly once, matching `test/helpers/card-template.js`'s
regex convention and `design-frontier-cards.test.js`'s pattern. Field order
is Cost line → Type line → Rules text in all three; only the one Materials —
Permanent card ("Chokepoint Garrison"
