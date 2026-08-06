# cardgame-playtest-spatial-wormhole-coverage

**Outcome:** merged (orchestrator recovery, 2026-07-30). Merge commit before 310093b on cardGame master; verified green ON MASTER (1172/1172).

**What shipped:** design/playtest-spatial.md gains a new step (inserted after Step 9, downstream steps renumbered per repo convention) narrating all 8 Wormhole Restriction/Closure cards previously unplayed in any procedure; the five stale hardcoded step numbers in the prior refresh test were bumped mechanically. New test/design-playtest-spatial-wormhole-coverage.test.js.

**Notable — two lessons:** (1) The bolt's builder-touched-test guard voided the build for the exact edit the confirm-gate approval had authorized: gates cannot override that invariant by design. planner.md now instructs plans to assign pre-existing-test edits to the test-writer stage, never the builder. (2) Test-writer escaping bug: site HTML escapes apostrophes (&#39;), so literal includes("Pilgrim's Right of Way") could never match — fixed by unescaping before matching; planner.md carries the reminder.
