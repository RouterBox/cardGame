# Work Item Manifest

Append-only requirements traceability log — one section per archived work item, listing the acceptance criteria it satisfied and their receipt verdicts.

## 2026-07-26-cardgame-world-races-cardgame-design-phase-1-world-bible-and-five-race-identities.md

- AC1 [user]: design/world.md exists in the cardgame repo and contains a galaxy/setting overview plus a cosmology section that names and grounds all five categories from gamePlan.md — materials, biology, intelligence, technology, and magic — as in-universe forces. — PASS
- AC2 [user]: Exactly five files exist under design/races/, and each contains an identity paragraph, one declared primary strength, two complementary strengths, and two countering weaknesses drawn from the five-category list. — PASS
- AC3 [paraphrase]: Across the five race files, each of the five categories appears as a primary strength exactly once, and no race lists the same category twice across its primary/complementary/countering slots. — PASS
- AC4 [inferred]: Each race file includes 3-5 signature hooks (named, one-line mechanics-flavored concepts) and a visual-identity paragraph suitable as an art-brief seed for Leonardo. — PASS
- AC5 [inferred] (held_out): design/world.md references at least three of the five races by name in its setting prose, so the world bible and the race files read as one connected universe rather than disconnected documents. — PASS

## 2026-07-27-cardgame-spatial-battlefield-rules-cardgame-rules-v2-spatial-battlefield-homeworlds-discovery-wormholes.md

- AC1 [user]: design/rules.md gains numbered spatial-battlefield rules covering: planets as graph nodes, wormholes as edges with length, homeworld start, discovery of unexplored worlds cheaper than wormholes toward enemy worlds, wormhole restrictions by direction/team/unit-type, and wormhole closure. — PASS
- AC2 [user]: Generator rules are updated so generators are built on specific planets and the rules state what happens to generators when their planet is contested or lost. — PASS
- AC3 [paraphrase]: New terms (planet, wormhole, homeworld, discovery, length, closure) are defined in the glossary before substantive use, consistent with the document's glossary-first discipline. — PASS
- AC4 [inferred]: The discovery action is integrated into the existing numbered turn-phase sequence (not bolted on as an appendix), and no new rule contradicts an existing numbered rule — the existing design-rules tests still pass unmodified. — PASS
- AC5 [inferred] (held_out): Both 2026-07-26 entries in design/ideas-inbox.md are marked [incorporated: cardgame-spatial-battlefield-rules], and at least one worked example in the rules walks a discovery-then-blockade sequence on a small named graph. — PASS

## 2026-07-28-cardgame-race-characters-cardgame-design-named-characters-per-race-with-interlinking-narratives.md

- AC1 [user]: Exactly five files exist under design/characters/, one per race with basenames matching design/races/, and each contains no fewer than 3 and no more than 5 named characters. — no receipt (escalated before receipt computation)
- AC2 [user]: Every character entry includes an individual narrative (identity paragraph with their own story and wants) and a Threads list naming at least one character from a different race's file. — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: design/characters/web.md exists, names every character from all five race files at least once, and each thread section involves characters from at least two different races. — no receipt (escalated before receipt computation)
- AC4 [inferred]: Character names are unique across the whole roster, and every cross-race reference in a Threads list points at a character that actually exists in the named race's file. — no receipt (escalated before receipt computation)
- AC5 [inferred] (held_out): Each character file references its race's canon from design/races/ — at least one signature hook, location, or identity element from the race file appears in the character prose — so the roster extends existing canon rather than inventing a parallel one. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-alpha-set-starter-cards-cardgame-design-phase-4-alpha-set-starter-cards.md

- AC1 [user]: design/cards/alpha-set.md exists in the cardGame repo and contains at least 15 distinct named cards. — PASS
- AC2 [user]: Every card uses the canonical template from rules.md Section 9.1 in order (Name, Cost line, Type line, Rules text, and for Permanents an optional Stats/counters line) with no required field missing. — PASS
- AC3 [paraphrase]: The set includes at least one card for each of the five Card Types (Magic, Technology, Intelligence, Biology, Materials) and at least one card costed from each of the five Founts. — PASS
- AC4 [inferred]: Each of the five races (design/races/*.md) has at least one card in the set whose Rules text or flavor ties back to that race's own primary Fount strength as named in its race file. — PASS
- AC5 [inferred]: At least one card demonstrates the multi-type/multi-cost rule from rules.md Section 9.7 — a card listing more than one Card Type and drawing cost from more than one Fount. — PASS
- AC6 [inferred] (held_out): No card's Rules text references a Fount, Card Type, zone, or template field not already defined in rules.md — every card is legible against the existing rulebook without inventing new terms. — PASS
- AC7 [inferred] (held_out): The file opens with a short summary stating how many cards it contains and which races/Founts/types they span, so coverage is checkable without counting by hand. — PASS

## 2026-07-28-cardgame-card-anatomy-skeleton-cardgame-design-card-anatomy-shared-skeleton-variable-slots-premium-layers.md

- AC1 [user]: design/cards/card-anatomy.md exists and defines a shared skeleton with named zones including at minimum a frame/border, name slot, cost slot, type line, art window, and rules-text box. — PASS
- AC2 [user]: A section on premium treatments defines at least three treatments (such as borderless, foil, alt-art) each described as a layer on the shared skeleton, and states an explicit cohesion rule about what treatments may not change. — PASS
- AC3 [paraphrase]: Every required field of the rules.md Section 9 card template (Name, Cost line, Type line, Rules text, Stats/counters line for Permanents) is mapped to exactly one skeleton zone, and the mapping is stated in the document. — PASS
- AC4 [inferred]: The variables section states how frame identity is driven by the card's Fount(s), including the rendering rule for cards with more than one Fount in their cost. — PASS
- AC5 [inferred] (held_out): At least two named cards from design/cards/alpha-set.md appear as worked examples walked through the anatomy zone by zone, at least one of which is one of the set's multi-type/multi-cost cards. — PASS
