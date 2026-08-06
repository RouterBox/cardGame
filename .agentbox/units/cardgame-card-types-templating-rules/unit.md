name: cardgame-card-types-templating-rules
title: Card Types & Templating Rules (Amaranth Expanse rules v3)
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Extend design/rules.md with a Card Types & Templating section that formally defines the five card types named in gamePlan.md (Magic, Technology, Intelligence, Biology, Materials), ties each to the Fount it draws cost from, and specifies the templating structure and multi-type/cost rules every future Alpha card must conform to — the last rules gap identified before card design and Leonardo art briefs can begin under I6, keeping the design phase at full decided scope rather than skipping ahead to cards without a template.

## Acceptance Criteria

- AC1 [user]: design/rules.md gains a new numbered section defining all five card types from gamePlan.md — Magic, Technology, Intelligence, Biology, Materials — each naming which Fount it draws cost from and its behavior class (instant/sorcery-speed resolving vs. permanent), consistent with gamePlan.md's original descriptions.
- AC2 [user]: The section defines a canonical card template (name, cost line, type line, rules text, and for permanents an optional stats/counters line) and gives one fully worked example card for each of the five types, each naming its Fount cost, its type(s), and its rules text.
- AC3 [paraphrase]: The section states the rule for cards with multiple types/costs (gamePlan.md: "cards can have multiple types/costs") — how total cost is computed across multiple Founts and which type-specific rules apply — with at least one worked multi-type example.
- AC4 [inferred]: New terms introduced (e.g. "type line," "rules text") are added to the Section 2 glossary before substantive use, consistent with the document's existing glossary-first discipline.
- AC5 [inferred] (held_out): No existing numbered rule in Sections 1-8 is contradicted or restated differently by the new section — it cross-references Section 4 (Resources/Founts) rather than redefining Fount Point costs from scratch.
