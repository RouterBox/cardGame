# cardgame-deck-construction-rules

- merged: 2026-07-28T13:58:09.977Z
- intent: Extend design/rules.md with a new numbered top-level section, Deck Construction, giving the Amaranth Expanse rulebook the one core-loop rule gamePlan.md names ("build your deck, and play") but rules.md has never stated: a fixed minimum Archive size and a maximum number of copies of any single named card permitted in one deck. The section is appended after the existing Section 10 (Winning & Losing Conditions) so no already-numbered section is renumbered, matching the pattern every prior rules-extension unit (spatial-battlefield-rules, map-setup-and-playtest-procedure, winning-losing) has followed. It must explicitly cross-reference Section 10.1's 'required to draw with an empty Archive' elimination condition by section number, since that condition is currently unformalizable without a stated deck size — this closes that gap rather than leaving it implicit. This continues I6's MTG-Comprehensive-Rules-rigor bar (T9) and the decided full scope of the design phase (T1), with acceptance criteria as mechanical document checks per T8.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-deck-construction-rules, cycle 1

## Method

Reviewed spec, plan.md, and diff. Note: sandboxed command execution
(Bash/PowerShell) was unavailable in this session (all invocations were
rejected with "This command requires approval"), so `node --test` could not
be run directly. Verification was instead done statically: read the full
current `design/rules.md` (all section headings, and the full text of
Sections 3, 5.1, 9, 10, and the new Section 11), read
`test/helpers/markdown.js` to hand-trace the test helpers' logic against the
new section's actual heading structure and body text, and grepped the repo
for section-count assumptions in sibling test files that a new Section 11
could break.

## AC-by-AC accounting

**AC1** — `design/rules.md` gains one new numbered top-level section,
`## 11. Deck Construction`, appended immediately after the end of the
existing `## 10. Winning & Losing Conditions` content (confirmed via
`git grep -n '^## \d+\.'`: headings run `1.`...`10.` unchanged, in order,
then `11. Deck Construction`). Titles for Sections 1-10 are byte-identical
to the pre-diff file (diff only appends after the last line). Satisfied.

**AC2** — Section 11
