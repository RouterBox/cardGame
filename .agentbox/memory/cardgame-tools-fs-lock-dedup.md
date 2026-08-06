# cardgame-tools-fs-lock-dedup

- merged: 2026-07-30T06:01:39.651Z
- intent: tools/build-site.js's withBuildLock/isLockStale and tools/composite-card-art.js's withOutDirLock independently implement the same cross-process exclusive-lock-with-stale-reclaim pattern (open-or-wait, compare mtimeMs against a 30s staleness threshold, reclaim and retry) with near-duplicate rationale comments but different mechanics. Extract a single shared implementation into lib/fs-lock.js, update both tools to call it instead of declaring their own lock functions, and add a direct unit test for the shared module's mutual-exclusion and stale-reclaim behavior. This is a behavior-preserving refactor verified by passing tests, not a repo-state assertion (avoids the T11 pitfall) — every existing build-site and composite-card-art test must stay green unmodified.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-tools-fs-lock-dedup, cycle 1

## Method note

The diff supplied for review rendered `tools/build-site.js` as `Binary files a/tools/build-site.js and b/tools/build-site.js differ` — git/GNU diff both classify it as binary. I could not review that file's actual changes from the diff text alone, so I checked out both blobs (`HEAD` and `HEAD~1`) from the repo directly and produced a real text diff out-of-band. Root cause: the file contains 4 literal NUL (0x00) bytes embedded inside a template-literal/regex pair used for markdown inline-code token protection (`` `${NUL}${protectedTokens.length}${NUL}` `` and `/${NUL}(\d+)${NUL}/g`). I confirmed the NUL byte count is unchanged (4 in both `HEAD~1` and `HEAD`) and the bytes sit at the same logical code location before and after this diff — **this is pre-existing file corruption/quirk, not introduced by this diff.** It's flagged here for visibility only; it does not gate the merge, and fixing it is out of scope for a "behavior-preserving refactor" unit.

I was also unable to execute `node --test` in this review sandbox (all `node`/`node --test` invocations were blocked pending interactive approval I don't have in t
