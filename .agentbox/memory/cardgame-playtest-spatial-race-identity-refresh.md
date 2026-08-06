# cardgame-playtest-spatial-race-identity-refresh

**Outcome:** merged (orchestrator recovery, 2026-07-30). Merge commit on cardGame master after f8d5e2c push.

**What shipped:** design/playtest-spatial.md gains a Spatial Race Identity worked example — the set's 5 cards' first appearance in any playtest procedure. New test/design-playtest-spatial-race-identity-refresh.test.js (265 lines).

**Notable:** The escalation that hit this unit finally named the whole transient-red class, thanks to the new redTail ledger digest: "The command line is too long." resolveCmd expanded `node --test` into absolute test-file paths; ~100 test files x a long worktree prefix crossed cmd.exe's 8191-char limit, so every worktree test run (baseline included) died instantly with exit=1. Main-checkout runs stayed under the limit, which is why hand verification always passed. Fixed in workflows/lib/receipt.js: repo-relative paths + shell-less node spawn (32k CreateProcess ceiling). Verified by running the fixed runTests green (1009/1009) in a deliberately long-named worktree.
