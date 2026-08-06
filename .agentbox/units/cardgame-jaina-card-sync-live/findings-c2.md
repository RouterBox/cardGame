# Blind Review — cardgame-jaina-card-sync-live, cycle 2

## Verification notes

`git show fe27e67 --stat` (the only commit on this branch implementing this unit) confirms
the diff shown for review is complete: only `lib/jaina-client.js` (new) and
`tools/sync-cards-to-jaina.js` (modified) changed, 138 lines total.

Checked file history directly:
- `git log --oneline -- test/sync-cards-to-jaina.test.js` → last touched by `3872ece`, a
  commit from the *prior* `cardgame-jaina-card-sync-dryrun` unit. `fe27e67` never touches
  it.
- `git log --oneline --all -- test/jaina-client.test.js` → **empty**. This file has never
  existed in any commit on any branch in this repo.

So plan.md Step 3 (update `test/sync-cards-to-jaina.test.js`) and Step 4 (create
`test/jaina-client.test.js`) were both entirely skipped in this cycle. (Note: a stale
`findings.md` was present in the unit directory before this review, dated "cycle 1",
describing both test files as if they existed with full AC1–AC3 coverage and an APPROVE
verdict — that description does not match any commit in this repo's history and has been
overwritten by this review. Flagging in case it indicates a lost/uncommitted prior attempt,
but it is not evidence bearing on the actual diff under review here.)

## AC accounting

- **AC1** (live path calls injectable client's `upsert` once per record, prints one-line
  summary, exits 0; client constructed only when both env vars present): behaviorally
  satisfied by the code — `runLiveSync` loops the cards, calls
  `client.upsert(buildRecord(card))` per card, logs `Synced N card record(s)...`, falls
  through to exit 0; `resolveLiveClient` gates client construction on both
  `JAINA_API_KEY` and `JAINA_PROJECT_ID`. Behavior: met. Not exercised by any test — see
  Finding 1.
- **AC2** (node --test exercises the live-sync path via a fake/injected client; no
  http/https/fetch reaches an external host during the test run): **NOT met**. No test in
  the diff, or anywhere in the repo, invokes `runLiveSync`, `resolveLiveClient`, or
  `main()`'s non-dry-run branch with an injected fake client. See Finding 1.
- **AC3** (missing credentials → exit 1, clear "Jaina credentials not configured" message,
  no unhandled exception/no-op): behaviorally satisfied — `CREDENTIALS_MISSING_MESSAGE`
  starts with exactly that phrase, and `main()` prints it to stderr, sets
  `exitCode = 1`, and returns before touching `loadAllCards`/the client. The *existing*
  `test/sync-cards-to-jaina.test.js` "AC3" test (unmodified, still asserting the old
  "not yet implemented" wording from the previous unit) happens to still pass against this
  new message purely by text-overlap coincidence (`/not yet implemented/i` and `/live
  sync/i` both still appear inside `CREDENTIALS_MISSING_MESSAGE`'s longer sentence) — it
  was never updated to actually assert the new message or exercise the new behavior
  deliberately. See Finding 1.

All three visible ACs accounted for.

## Findings

### Finding 1 — INTRODUCED — AC2 unmet: no test exercises the live-sync path at all

`plan.md` step 3 required replacing the obsolete AC3 test in
`test/sync-cards-to-jaina.test.js` and adding tests for the new live-sync call pattern;
step 4 required a new `test/jaina-client.test.js`. Neither happened.

**Failure scenario:** `node --test` today never calls `runLiveSync`, `resolveLiveClient`,
or the non-dry-run branch of `main()` with a fake client. AC2's explicit requirement —
"node --test exercises the live-sync (non-dry-run) code path using a fake/injected Jaina
client" — is unmet by anything in the suite. The module *does* export
`{ buildRecord, runLiveSync, resolveLiveClient, CREDENTIALS_MISSING_MESSAGE }` specifically
to make this seam testable, but nothing imports and exercises it. A regression that broke
`runLiveSync` (e.g. calling `upsert` with the wrong shape, or calling it zero times, or
never printing the summary) would pass `node --test` silently. The lone test that happens
to still run in this area (`test/sync-cards-to-jaina.test.js`'s untouched, stale "AC3"
test) passes only because the new `CREDENTIALS_MISSING_MESSAGE` text coincidentally
contains the substrings it checks for — it is not a real test of the new behavior.

### Finding 2 — INTRODUCED — `lib/jaina-client.js` ignores the `projectId` argument it requires

`createJainaClient({ apiKey, projectId, baseUrl })` throws if `projectId` is falsy and
includes it in error-message text (`Jaina record list failed for project "${projectId}"`),
but never uses it to build the actual request URL. `recordsUrl` is built entirely from
module-level hardcoded constants (`PROJECT_SLUG = 'cardgame'`, `SCHEMA_SLUG = 'card'`,
`PACKAGE_SLUG = 'alpha'`) — `projectId` (sourced from the `JAINA_PROJECT_ID` env var via
`resolveLiveClient`) plays no role in routing the request.

**Failure scenario:** an operator sets `JAINA_PROJECT_ID=some-other-project`, reasonably
expecting the live sync to write into that project — that's the only stated reason AC1
requires the env var to be present before constructing the client. Every card record
instead silently gets PUT/POSTed against the hardcoded `cardgame` project's `card`
schema/`alpha` package regardless of what `JAINA_PROJECT_ID` actually holds. There is no
error, no warning — the mismatch between "configured project" and "actual project written
to" is invisible until someone inspects the target project and finds the wrong data (or no
data). This is a genuine correctness defect introduced by this diff, separate from the
plan's flagged "unverified endpoint" caveat (which was about the URL/verb/envelope, not
about an accepted, validated argument being silently discarded).

## Other observations (non-gating)

- The diff's live-client implementation (list-then-cache-then-PUT/POST against
  `https://jaina.dev/api/v1` with hardcoded schema/package slugs) differs substantially
  from plan.md's stated best-effort placeholder (`PUT
  https://api.jaina.app/v1/projects/:projectId/cards/:slug`), and its header comment now
  asserts this is "the real contract, not a placeholder... verified against the Jaina
  server source and SDK by the orchestrator." Because no test exercises this code path
  (Finding 1), that claim is unverified by anything visible to this review. Not gating on
  its own — plan.md is explicit that no AC depends on the URL being correct — but it
  compounds with Finding 1: there is currently no automated way to know if this contract is
  right or wrong before someone runs it for real.

## Verdict

AC2 explicitly demands test coverage of the live-sync path with an injected fake client and
zero external network reachability during `node --test`; that coverage does not exist
anywhere in the repo history for this branch. Combined with a silent correctness bug in the
new client (Finding 2 — the validated `projectId` is never actually used for routing), this
cycle needs another pass.

NEEDS_WORK
