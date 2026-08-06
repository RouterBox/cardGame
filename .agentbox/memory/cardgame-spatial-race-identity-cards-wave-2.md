# cardgame-spatial-race-identity-cards-wave-2

- merged: 2026-07-30T05:29:34.838Z
- intent: design/ideas-inbox.md's first 2026-07-26 spatial-layer entry claims the battlefield graph 'Interacts with every race identity,' offering a materials race and an intelligence race only as illustrative examples ('e.g.'), not an exhaustive list. The already-open cardgame-spatial-race-identity-cards proposal realizes the later, narrower 2026-07-26 entry naming exactly Panoptic Concord (Signal), Starweave Communion (Tangle), and Cindral Reach (Mass) in a new design/cards/spatial-race-identity-set.md — leaving Mireth Bloom and Wrought Assembly with no card anywhere that references a Planet, Wormhole, or Discovery. Both races already carry shipped identity text this unit grounds directly: design/races/mireth-bloom.md's signature hook 'Bloomfront Expansion — Biology generators can be built directly onto contested territory' is an unbuilt exception to rules.md Section 4.6 ('every Generator played after that MAY be built on any Planet that challenger controls'); design/races/wrought-assembly.md's identity paragraph describing a civilization that wants 'a single flawless design, copied without end across every system it can reach' is an unbuilt discount on replicating a Generator onto a Planet reached via Section 8.3 Discovery. This unit adds design/cards/spatial-race-identity-set-wave-2.md with exactly 2 cards, following the same Cost/Type/Rules-text/Stats-line template test/design-frontier-cards.test.js already enforces for frontier-set.md: a Mireth Bloom Generator (Bloom Fount) whose Rules text explicitly lets it be built on a Planet its controller does not currently control, citing 'Section 4.6' by number as the restriction it overrides; and a Wrought Assembly Generator (Circuit Fount) whose Rules text reduces its own Circuit Point cost when built on a Planet that was added to the battlefield graph by a Discovery action taken that game, citing 'Section 8.3' by number. No rules.md change is needed or made — both effects are stated exceptions to already-shipped defaults, the same pattern the sibling wave-1 proposal uses — and no other card file's names or content are touched.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Review — cardgame-spatial-race-identity-cards-wave-2, cycle 2

## AC coverage

- **AC1** (file exists, exactly 2 distinct named cards, one Mireth Bloom /
  one Wrought Assembly, Cost→Type→Rules-text order, Stats/counters line only
  when Permanent): met. `design/cards/spatial-race-identity-set-wave-2.md`
  contains exactly two `###` cards — Bloom Fount (flavor text names "the
  Mireth Bloom") and Circuit Fount (flavor text names "the Wrought
  Assembly"). Both follow Cost line → Type line → Rules text order. Bloom
  Fount is `Biology — Permanent` and carries a Stats/counters line
  (matching the repo convention that Biology Generators are always Units
  with a stats line); Circuit Fount is `Technology — Permanent` and
  correctly carries no Stats/counters line (matching the convention that
  Technology Permanents never do — verified against every existing
  Technology-Generator card in the repo). The reused
  `test/helpers/card-template.js` checker enforces exactly this.
- **AC2** (Bloom Fount: Cost line names it, Type line/Rules text identify
  Generator, Rules text permits building on a Planet its controller does
  not control, citing "Section 4.6"): met. Verified `design/rules
