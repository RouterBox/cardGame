# Blind review — cardgame-jaina-card-sync-live, cycle 3

## Verification notes

Cross-checked the diff shown for review against actual repo history to confirm scope:

- `git log --oneline 390ba60..HEAD -- test/` → **empty**. No commit in this attempt
  (cycle 1 `fe27e67`, cycle 2/fix `9d981b7`) has ever touched anything under `test/`.
  `test/jaina-client.test.js` does not exist anywhere in this repo's history.
- `git show 9d981b7` (the cycle-3 commit under review) is a 1-file, 3-line diff to
  `lib/jaina-client.js`: it removes the hardcoded `PROJECT_SLUG = 'cardgame'` constant and
  routes the records URL off the validated `projectId` argument instead. Its own commit
  message states: *"Finding 1 (no test exercises the live-sync path) is not fixable here:
  it requires new coverage under test/, which builders cannot touch."* — i.e. the builder
  itself confirms AC2 remains unaddressed in this diff.

## AC accounting

- **AC1** (live path calls injectable client's `upsert` once per record, prints a
  one-line summary, exits 0; client constructed only when both env vars present) —
  behaviorally satisfied by the code: `runLiveSync` loops `cards`, calls
  `client.upsert(buildRecord(card))` once per card, logs
  `Synced N card record(s) to Jaina.`, and falls through to exit 0; `resolveLiveClient`
  gates client construction on both `JAINA_API_KEY` and `JAINA_PROJECT_ID`. Correct on
  read, but unexercised by any test — see Finding 1.
- **AC2** (`node --test` exercises the live-sync path via a fake/injected client; no
  http/https/fetch reaches an external host during the test run) — **NOT met**. See
  Finding 1.
- **AC3** (missing credentials → exit 1, clear "Jaina credentials not configured"
  message, no unhandled exception/no-op) — behaviorally satisfied: `main()` prints
  `CREDENTIALS_MISSING_MESSAGE` (which begins with exactly that phrase) to stderr, sets
  `exitCode = 1`, and returns before calling `loadAllCards`/constructing a client. The
  pre-existing `test/sync-cards-to-jaina.test.js` "AC3" test (untouched by any commit in
  this attempt) still passes against the new message only because
  `CREDENTIALS_MISSING_MESSAGE`'s longer sentence happens to still contain the substrings
  `/not yet implemented/i` and `/live sync/i` that test checks for — it was never updated
  to deliberately assert the new credentials-gated behavior. Not a regression, but not a
  real test of AC3 either.

All three visible ACs accounted for.

## Findings

### Finding 1 — INTRODUCED — AC2 unmet: no test exercises the live-sync path

`plan.md` step 3 called for `test/sync-cards-to-jaina.test.js` to gain tests for the new
live-sync call pattern (fake client, one `upsert` call per record, credentials-missing via
env override) and step 4 called for a new `test/jaina-client.test.js`. Neither exists.
Confirmed via `git log` above and by grepping `test/` for `runLiveSync`, `resolveLiveClient`,
`createJainaClient`, and `jaina-client` — no matches anywhere in the suite.

**Failure scenario:** `runLiveSync`, `resolveLiveClient`, or the `buildRecord`→`client.upsert`
wiring in `tools/sync-cards-to-jaina.js` could regress (wrong record shape passed to
`upsert`, cards silently skipped, the summary line never printed, credentials check
inverted) and `node --test` would still pass end to end — nothing in the suite ever
constructs a fake client and drives the non-dry-run branch of `main()`. The module exports
`{ buildRecord, runLiveSync, resolveLiveClient, CREDENTIALS_MISSING_MESSAGE }` specifically
to make this seam testable, but nothing imports and exercises it. This is exactly the gap
AC2 exists to close.

This is INTRODUCED by this unit: the live-sync code path did not exist before this unit: it
now exists, unshielded by any test, in violation of an explicit AC and the stated intent
("the acceptance suite ... can verify the upsert path deterministically with a fake
client"). The cycle-3 commit's own message acknowledges the gap and states it is
structurally unfixable by the builder role (test-writing is out of scope for builders in
this pipeline) — which means this needs to route back through a step that can touch
`test/`, not another builder cycle.

### Finding 2 — resolved this cycle, noted for completeness

The prior review's Finding 2 (`createJainaClient` validated `projectId` but silently
discarded it, routing every request against a hardcoded `PROJECT_SLUG = 'cardgame'`
instead) is fixed by this cycle's commit (`9d981b7`): `PROJECT_SLUG` is removed and
`recordsUrl` is now built from the validated `projectId` argument
(`${resolvedBaseUrl}/projects/${encodeURIComponent(projectId)}/schemas/${SCHEMA_SLUG}/records`).
Verified by reading current `lib/jaina-client.js` — no longer a finding.

## Other observations (non-gating)

- `lib/jaina-client.js`'s implementation (list-then-cache-name→id, then
  PUT-if-known/POST-if-new, against `https://jaina.dev/api/v1` with hardcoded
  `card`/`alpha` schema+package slugs) is materially different from `plan.md`'s stated
  best-effort placeholder, justified by an in-file comment and `feedback.md` claiming the
  contract was verified against Jaina's server source/SDK by the orchestrator between
  cycles. No AC depends on this contract being correct, so it doesn't gate — but because
  Finding 1 means nothing exercises this code at all, there is currently no automated way
  to catch it if that verified contract is wrong.

## Verdict

AC2 explicitly requires `node --test` to exercise the live-sync path with an injected fake
client; that coverage does not exist in this diff or anywhere in this unit's commit
history, and the builder's own cycle-3 commit message confirms it is out of scope for
further builder cycles to add. That is a concrete, INTRODUCED gap against a stated AC.

NEEDS_WORK
