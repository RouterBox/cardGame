# Blind review — cardgame-jaina-card-sync-live, cycle 1

## AC coverage

- **AC1** (live path calls injectable client's `upsert` once per card, prints one-line
  summary, exits 0; production client only constructed when both env vars present):
  Satisfied. `runLiveSync` (tools/sync-cards-to-jaina.js) loops `cards` calling
  `client.upsert(buildRecord(card))` once per card, then logs
  `Synced ${cards.length} card record(s) to Jaina.`. `resolveLiveClient` only calls
  `createJainaClient` when both `JAINA_API_KEY` and `JAINA_PROJECT_ID` are present, else
  returns `{ error }`. No `process.exitCode` is set on the success path, so the process
  exits 0. Covered by "Live sync AC1: production client is constructed only when both env
  vars are present" and "Live sync AC1 & AC2: runLiveSync calls upsert once per card and
  prints a summary, network-free" in test/sync-cards-to-jaina.test.js.

- **AC2** (live-sync path exercised via fake/injected client under `node --test`; no
  `require('http')`/`require('https')`/`fetch()` reaches an external host): Satisfied.
  The in-process test calls `runLiveSync` directly with a hand-rolled `fakeClient`
  (never touching `lib/jaina-client.js`'s real `fetch`), and a separate source-scan test
  ("Live sync AC2b") asserts the sync script itself contains no `require('http'|'https')`
  or `fetch(` calls. `test/jaina-client.test.js` exercises the one file that is allowed to
  call `fetch` exclusively through a monkey-patched `global.fetch`, restored in a
  `finally` block so no leakage between tests. The one subprocess-spawning test (AC3,
  below) explicitly strips `JAINA_API_KEY`/`JAINA_PROJECT_ID` from the child's env before
  spawning, so even that path can't reach `resolveLiveClient`'s client-construction branch
  — the suite is network-free end to end regardless of the host machine's ambient env.

- **AC3** (missing `JAINA_API_KEY` or `JAINA_PROJECT_ID` on a non-dry-run invocation exits
  1 with a clear "credentials not configured" message, no unhandled exception, no silent
  no-op): Satisfied. `resolveLiveClient` returns `{ error: CREDENTIALS_MISSING_MESSAGE }`
  when either var is missing; `main()` prints it via `console.error` and sets
  `process.exitCode = 1` before returning. Covered by "Live sync AC3: without --dry-run and
  without credentials, exits 1 with a clear message" (spawns the real script with the two
  vars stripped from a copy of `process.env`, asserts exit code 1 and message content) and
  by the direct-call assertions in the AC1 gating test above (missing either var alone also
  yields `client: undefined`).

All three visible ACs are accounted for and exercised by tests that match their wording.

## Other observations (non-blocking)

- `lib/jaina-client.js`'s shipped content differs from the literal code block in plan.md
  Step 1 (different base URL, and added `SCHEMA_SLUG`/`PACKAGE_SLUG` path segments), with a
  comment claiming the new shape was "verified against the Jaina server source and SDK by
  the orchestrator." plan.md's `GATE: confirm` explicitly anticipated this exact
  uncertainty and required exactly this kind of confirmation before shipping a corrected
  contract, and no visible AC depends on the endpoint being right (AC1–AC3 only exercise
  the injectable-client seam with fakes). Given the gate's own text, this reads as the
  intended resolution of that gate rather than a defect — flagging only so a human can
  confirm the "verified" claim is trustworthy before anyone runs the script live with real
  credentials, per plan.md's own closing instruction.
- Classification: not a functional bug against any visible AC; not gating.

## Verdict

No INTRODUCED defect breaks a visible AC or the network-free test guarantee. The one
notable deviation from plan.md (client contract details) is plan.md's own anticipated gate
resolution, not a regression, and carries no AC dependency.

APPROVE
