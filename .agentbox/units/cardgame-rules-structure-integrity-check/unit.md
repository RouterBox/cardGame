name: cardgame-rules-structure-integrity-check
title: One mechanical test that design/rules.md's section numbering is sequential and has no leftover `//` review notes, replacing per-proposal repeated promises
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/rules.md (shipped) uses MTG-Comprehensive-Rules-style numbered sections and decimal subsections per the T9 structural bar (Section 4.6, 5.2, 5.4, 8.1, 8.3, 8.4, 8.6, 12 are all referenced by number across already-filed proposals) — but nothing in the repo ever mechanically verifies that numbering stays sequential and well-formed, or that RouterBox's raw `//` review-note markers get fully removed as sections are finished. Instead, each rules-editing proposal writes its own held-out promise re-asserting these two facts by hand (T11's exact pattern: N proposals, N repeated manual promises, zero shared mechanism). This unit adds one new, independent test/design-rules-structure.test.js that parses design/rules.md's heading structure and asserts: (a) top-level section numbers run strictly sequentially starting at 1 with no gaps or duplicates; (b) within each top-level section, decimal subsection numbers (e.g. 4.6, 4.7) are strictly increasing with no duplicates and correctly nest under their parent number; (c) no line anywhere in the file begins with a raw `//` comment marker. The test is purely diagnostic and read-only — it does not modify design/rules.md, does not touch test/design-rules.test.js or any other existing test file, and has no dependency on which rules.md proposal lands first. This gives every current and future rules.md-editing unit a real, mechanical safety net (T3: enforcement should be mechanical, not prompt doctrine) instead of a per-proposal manual promise, directly following the same reasoning already applied to card names in the open card-catalog-collision-check proposal.

## Acceptance Criteria

- AC1 [inferred]: test/design-rules-structure.test.js exists and, run against the real, current design/rules.md, asserts that top-level section numbers appear in strictly sequential order starting at 1 with no gaps or duplicates.
- AC2 [inferred]: The same test asserts that every decimal subsection number (e.g. 4.6, 4.7, 8.1, 8.3) is strictly increasing with no duplicates within its parent top-level section, and correctly shares that parent's leading number.
- AC3 [paraphrase]: The same test asserts design/rules.md contains no line beginning with a raw `//` comment marker anywhere in the file.
- AC4 [inferred] (held_out): The test's checking logic is exercised against fixture data containing an injected numbering gap, an injected duplicate section number, and an injected leftover `//` line, and fails with a specific, named violation for each — not just a generic assertion failure.
- AC5 [inferred]: No file other than test/design-rules-structure.test.js is created or modified by this unit; design/rules.md and every pre-existing test file remain byte-identical to before.
