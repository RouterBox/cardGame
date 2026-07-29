# cardgame-keyword-abilities-rules: Keyword Abilities Rules (Amaranth Expanse rules — evergreen combat/utility keywords)

## Header

- unit: cardgame-keyword-abilities-rules
- title: Keyword Abilities Rules (Amaranth Expanse rules — evergreen combat/utility keywords)
- project: cardgame
- completed: 2026-07-29
- outcome: escalated
- start_sha: 3a889feeec5c166f98b622fa55846886d389f160
- end_sha: 3a889feeec5c166f98b622fa55846886d389f160

## Intent

design/rules.md's 13 existing sections define every core system of the game (turns, resources, priority/timing, spatial battlefield, card types, winning/losing, deck construction, combat, targeting), each written to the MTG Comprehensive Rules structural bar named in T9 — numbered subsections, glossary-first vocabulary defined in Section 2 before substantive use, and at least one worked example per major chapter (Section 7, 8.7, 10.3, 12.5, 13.3 all follow this pattern). One CR-shape chapter is conspicuously absent: Keyword Abilities. Every card printed so far (alpha-set.md, frontier-set.md, character-signatures.md) spells its effect out in full sentences because no named, reusable rules-text shorthand exists. This unit adds a new numbered section defining at least 5 keyword abilities, one bound to each Fount's already-established identity from world.md and the race files, following the same glossary-first, worked-example discipline as every other rules.md chapter. It adds vocabulary only — no existing card file is touched, and no card is retextualized to use a new keyword (that is left as a follow-on unit); this is pure design/rules text, no game software (T8).

## Acceptance Criteria

- AC1 [inferred]: design/rules.md gains a new numbered section (e.g. 'Keyword Abilities') defining at least 5 distinct named keyword abilities, each explicitly tied to exactly one of the five Founts (Mass, Bloom, Signal, Circuit, Tangle) and consistent with that Fount's identity as established in design/world.md and the corresponding race file.
- AC2 [inferred]: Each keyword ability has its own numbered subsection stating its full rules-text meaning precisely enough that a future card could invoke the keyword by name alone with no further explanation needed.
- AC3 [paraphrase]: Each new keyword's name is added to the Section 2 glossary before its substantive use later in the document, consistent with rules.md's existing glossary-first discipline already followed by every prior section.
- AC4 [paraphrase]: The new section includes at least one numbered worked example applying one or more of the new keywords to a concrete hypothetical game state, matching the same worked-example rigor used by Section 7, 8.7, 10.3, 12.5, and 13.3.
- AC5 [inferred] (held_out): design/cards/alpha-set.md, frontier-set.md, and character-signatures.md are byte-identical to before this unit — no existing card's rules text is rewritten to use a new keyword, and no other rules.md section is altered besides the new section and its Section 2 glossary additions.

## Plan

(no plan.md)

## Findings

(no findings.md)

## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T05:20:50.979Z] **bolt:start** — unit=cardgame-keyword-abilities-rules start_sha=3a889feeec5c166f98b622fa55846886d389f160 branch=bolt/cardgame-keyword-abilities-rules worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-keyword-abilities-rules
- [2026-07-29T05:20:58.396Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T05:30:52.544Z] **bolt:escalated** — Planner produced no plan.md


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
