GATE: confirm

**Why gated:** `lib/jaina-client.js` (step 2 below) has to pick a concrete Jaina REST
endpoint URL / HTTP verb / payload envelope for the real (non-test) upsert call. This
session's `jaina` MCP connector exposes tool *signatures* that confirm the
project/package/schema/record data model (`jaina.records.create(project, schema, data)`,
`jaina.records.update(project, schema, id, data)`), but the `jaina_sdk_reference` /
`jaina_help` tools that would give the exact REST contract require an interactive
permission grant this non-interactive planning session couldn't get. The plan below ships
a clearly-labelled best-effort placeholder endpoint (`PUT
https://api.jaina.app/v1/projects/:projectId/cards/:slug`, bearer auth, JSON body of the
record) behind a single `JAINA_API_BASE_URL` override, and **no acceptance criterion
depends on this URL being correct** — AC1–AC3 only exercise the injectable-client seam
with a fake client, never the real network call. Ship it as planned, but before anyone
runs this script for real (no `--dry-run`, real `JAINA_API_KEY`/`JAINA_PROJECT_ID` set),
confirm the real Jaina REST contract (run `jaina_sdk_reference` interactively, or check
Jaina's docs) and fix the request in `lib/jaina-client.js` if it doesn't match. That
correction is a small, isolated edit — everything else in this plan is unaffected by it.

---

# Unit: cardgame-jaina-card-sync-live

## Intent recap

`tools/sync-cards-to-jaina.js` (added by `cardgame-jaina-card-sync-dryrun`, merged) has
two modes: `--dry-run` prints one NDJSON record per card and works today. The no-flag
("live") path currently just prints "not yet implemented" and exits 1. This unit makes
the no-flag path actually upsert every card record into Jaina, through a small injectable
client module so the test suite can verify the call pattern with a fake client and never
touch the network.

## Files touched

1. **New** `lib/jaina-client.js` — the only file in the repo allowed to call `fetch()`
   against a real Jaina host.
2. **Modify** `tools/sync-cards-to-jaina.js` — replace the "not yet implemented" stub with
   real wiring: resolve credentials from the environment, build the real client, call
   `runLiveSync`.
3. **Modify** `test/sync-cards-to-jaina.test.js` — replace the obsolete AC3 test (asserted
   the old "not yet implemented" message) with a credentials-missing test, and add tests
   for the new live-sync call pattern. Existing dry-run tests (AC1, AC2, AC4 in that file's
   own numbering) are untouched.
4. **New** `test/jaina-client.test.js` — unit tests for the real client's request shape,
   using a monkey-patched `global.fetch` (never the real network).

No other files change. Do not touch `lib/parse-card-markdown.js`, `tools/render-card.js`,
or any `design/**` content — none of it is in scope.

---

## Step 1 — `lib/jaina-client.js` (new file)

Create `lib/jaina-client.js` with exactly this content:

```js
'use strict';

// ---------------------------------------------------------------------------
// Live Jaina client — the only place in this repo allowed to make a real
// network call to Jaina. tools/sync-cards-to-jaina.js never calls fetch()
// itself; it always goes through the upsert(record) seam below so the
// acceptance test suite can swap in a fake client and stay network-free.
//
// NOTE: the base URL / endpoint path / payload envelope below are a
// best-effort placeholder — they were not verified against live Jaina API
// docs in the planning session that wrote this file (the jaina-dev MCP
// connector needs interactive auth this session didn't have). Confirm the
// real contract before the first production sync run; JAINA_API_BASE_URL
// lets you point at the right host without editing this file.
// ---------------------------------------------------------------------------

const DEFAULT_API_BASE_URL = 'https://api.jaina.app/v1';

function createJainaClient({ apiKey, projectId, baseUrl } = {}) {
  if (!apiKey) throw new Error('createJainaClient requires apiKey');
  if (!projectId) throw new Error('createJainaClient requires projectId');

  const resolvedBaseUrl = baseUrl || process.env.JAINA_API_BASE_URL || DEFAULT_API_BASE_URL;

  async function upsert(record) {
    const url = `${resolvedBaseUrl}/projects/${encodeURIComponent(projectId)}/cards/${encodeURIComponent(record.slug)}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(
        `Jaina upsert failed for "${record.name}" (${res.status} ${res.statusText}): ${body}`
      );
    }

    return res.json();
  }

  return { upsert };
}

module.exports = { createJainaClient, DEFAULT_API_BASE_URL };
```

Notes for the implementer:
- `createJainaClient()` does **no I/O** — it only validates its arguments and returns an
  object. The network call happens lazily, inside `upsert()`. This is what makes it safe
  to unit-test "is the client constructed" without ever touching the network (Step 3).
- Repo Node version is v23 (`node -v` → `v23.11.0`), so the global `fetch` is available
  with no import — `test/serve-site.test.js` already relies on the same global in this
  repo.
- Method name is `upsert`, matching AC1's literal phrasing ("an injectable Jaina client's
  upsert function").

---

## Step 2 — `tools/sync-cards-to-jaina.js` (rewrite)

Replace the entire file content with:

```js
#!/usr/bin/env node
'use strict';

const { slugify, loadCardsFromFile, loadAllCards } = require('../lib/parse-card-markdown');
const { createJainaClient } = require('../lib/jaina-client');

const CREDENTIALS_MISSING_MESSAGE =
  'Jaina credentials not configured: set JAINA_API_KEY and JAINA_PROJECT_ID to run a live ' +
  'sync (or re-run with --dry-run to preview the record payloads without any credentials).';

// ---------------------------------------------------------------------------
// Jaina 'cards' schema record shape — shared by --dry-run preview and the
// live upsert path so they can never drift from each other.
// ---------------------------------------------------------------------------

function buildRecord(card) {
  return {
    name: card.name,
    slug: slugify(card.name),
    costLine: card.costLine,
    typeLine: card.typeLine,
    rulesText: card.rulesText,
    statsLine: card.statsLine,
  };
}

// ---------------------------------------------------------------------------
// Live sync — upserts one record per card through an injected client so
// tests can swap in a fake and never touch the real network.
// ---------------------------------------------------------------------------

async function runLiveSync(client, cards) {
  for (const card of cards) {
    await client.upsert(buildRecord(card));
  }
  console.log(`Synced ${cards.length} card record(s) to Jaina.`);
}

// Resolves the live client from the environment. createJainaClient() does no
// I/O (see lib/jaina-client.js), so this function is safe to unit-test
// directly without touching the network.
function resolveLiveClient(env) {
  const apiKey = env.JAINA_API_KEY;
  const projectId = env.JAINA_PROJECT_ID;
  if (!apiKey || !projectId) {
    return { error: CREDENTIALS_MISSING_MESSAGE };
  }
  return { client: createJainaClient({ apiKey, projectId }) };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!dryRun) {
    const resolved = resolveLiveClient(process.env);
    if (resolved.error) {
      console.error(resolved.error);
      process.exitCode = 1;
      return;
    }
    const cards = loadAllCards();
    await runLiveSync(resolved.client, cards);
    return;
  }

  const cards = loadAllCards();
  for (const card of cards) {
    console.log(JSON.stringify(buildRecord(card)));
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err && err.message ? err.message : String(err));
    process.exitCode = 1;
  });
}

module.exports = { buildRecord, runLiveSync, resolveLiveClient, CREDENTIALS_MISSING_MESSAGE };
```

Notes for the implementer:
- The `--dry-run` branch is untouched in behavior and ordering from the merged
  dry-run unit: `loadAllCards()` then one `console.log(JSON.stringify(buildRecord(card)))`
  per card. This is what keeps AC4 (byte-identical dry-run output) true — don't reorder or
  rewrap this branch.
- `require.main === module` / `module.exports` at the bottom is the existing repo
  convention for testable CLI scripts — see `tools/render-card.js:299-311` and
  `tools/composite-card-art.js:124-138` for the same pattern.
- Keep the unused `loadCardsFromFile` import exactly as it was in the pre-existing file
  (it was already imported-but-unused before this unit; not in scope to clean up).
- Do not add a `require('http')`, `require('https')`, or a `fetch(` call anywhere in this
  file — all network access must go through `lib/jaina-client.js`. A test enforces this
  (Step 3, "Live sync AC2b").

---

## Step 3 — `test/sync-cards-to-jaina.test.js` (edit existing file)

The existing file has 4 tests labelled `AC1`–`AC4`, which are the *dry-run* unit's own
acceptance criteria (a different numbering than this unit's AC1–AC4). Keep `AC1`, `AC2`,
and `AC4` exactly as-is — they still pass unmodified and, together, they *are* this unit's
held-out AC4 (dry-run output/behavior unchanged). Only the `AC3` test needs to change,
because it asserted the old "not yet implemented" stub behavior that this unit removes.

### 3a. Replace the existing `AC3` test

Find this block (currently lines 126–154):

```js
// ---------------------------------------------------------------------------
// AC3: without --dry-run, the script makes no Jaina API calls — it prints a
// message that live sync is not yet implemented and exits 1.
// ---------------------------------------------------------------------------

test('AC3: without --dry-run, the script exits 1 and prints a live-sync-not-implemented message', () => {
  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-cards-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(
    /not yet implemented/i.test(output) && /live sync/i.test(output),
    `expected a "live sync ... not yet implemented" message, got: ${output}`
  );

  const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(
    !/require\(\s*['"](?:https?|child_process)['"]\s*\)/.test(scriptSource),
    'expected no network or subprocess module usage in the sync script'
  );
  assert.ok(!/\bfetch\s*\(/.test(scriptSource), 'expected no fetch() calls to a Jaina API');
});
```

Replace it with:

```js
// ---------------------------------------------------------------------------
// Live sync AC3: without --dry-run and without Jaina credentials configured,
// the script exits 1 and prints a clear "credentials not configured" message
// instead of throwing or silently no-op'ing.
// ---------------------------------------------------------------------------

test('Live sync AC3: without --dry-run and without credentials, exits 1 with a clear message', () => {
  // Strip any ambient JAINA_API_KEY / JAINA_PROJECT_ID from this process's env
  // before spawning, so the test is deterministic regardless of the host
  // machine's environment.
  const env = { ...process.env };
  delete env.JAINA_API_KEY;
  delete env.JAINA_PROJECT_ID;

  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8', env });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-cards-to-jaina.js` (no flag, no credentials) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(
    /Jaina credentials not configured/i.test(output),
    `expected a "Jaina credentials not configured" message, got: ${output}`
  );
});

// ---------------------------------------------------------------------------
// Live sync AC2b: the sync script itself never touches the network directly
// — every real call must go through lib/jaina-client.js's injectable seam.
// ---------------------------------------------------------------------------

test('Live sync AC2b: the sync script has no direct fetch/http/https calls', () => {
  const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(
    !/require\(\s*['"](?:https?)['"]\s*\)/.test(scriptSource),
    'expected no direct http/https module usage in the sync script'
  );
  assert.ok(!/\bfetch\s*\(/.test(scriptSource), 'expected no direct fetch() calls in the sync script');
});

// ---------------------------------------------------------------------------
// Live sync AC1 (client gating): the production Jaina client is constructed
// only when both JAINA_API_KEY and JAINA_PROJECT_ID are present. Calling
// resolveLiveClient() never performs I/O (createJainaClient() is pure
// construction — see lib/jaina-client.js), so this is safe and network-free.
// ---------------------------------------------------------------------------

test('Live sync AC1: production client is constructed only when both env vars are present', () => {
  const { resolveLiveClient, CREDENTIALS_MISSING_MESSAGE } = require(SCRIPT_PATH);

  assert.strictEqual(resolveLiveClient({}).client, undefined);
  assert.strictEqual(resolveLiveClient({}).error, CREDENTIALS_MISSING_MESSAGE);

  assert.strictEqual(resolveLiveClient({ JAINA_API_KEY: 'k' }).client, undefined);
  assert.strictEqual(resolveLiveClient({ JAINA_PROJECT_ID: 'p' }).client, undefined);

  const resolved = resolveLiveClient({ JAINA_API_KEY: 'k', JAINA_PROJECT_ID: 'p' });
  assert.strictEqual(resolved.error, undefined);
  assert.strictEqual(typeof resolved.client.upsert, 'function');
});

// ---------------------------------------------------------------------------
// Live sync AC1 & AC2: without --dry-run, the script calls the injected
// client's upsert() once per parsed card record and prints a one-line
// summary — exercised in-process with a fake client (never the real
// tools/sync-cards-to-jaina.js -> lib/jaina-client.js -> fetch path), so no
// require('http'), require('https'), or fetch() call reaches an external
// host during this test.
// ---------------------------------------------------------------------------

test('Live sync AC1 & AC2: runLiveSync calls upsert once per card and prints a summary, network-free', async () => {
  const { runLiveSync, buildRecord } = require(SCRIPT_PATH);

  const fakeCards = [
    { name: 'Fake Card One', costLine: '1', typeLine: 'Unit', rulesText: 'Does a thing.', statsLine: '1/1' },
    { name: 'Fake Card Two', costLine: '2', typeLine: 'Unit', rulesText: 'Does another thing.', statsLine: null },
  ];

  const upsertedRecords = [];
  const fakeClient = {
    upsert: async (record) => {
      upsertedRecords.push(record);
      return { id: `fake-${upsertedRecords.length}` };
    },
  };

  const originalLog = console.log;
  const logLines = [];
  console.log = (line) => logLines.push(line);
  try {
    await runLiveSync(fakeClient, fakeCards);
  } finally {
    console.log = originalLog;
  }

  assert.strictEqual(upsertedRecords.length, fakeCards.length, 'expected upsert to be called once per card');
  for (let i = 0; i < fakeCards.length; i++) {
    assert.deepStrictEqual(upsertedRecords[i], buildRecord(fakeCards[i]));
  }

  assert.strictEqual(logLines.length, 1, 'expected exactly one summary line to be printed');
  assert.ok(
    logLines[0].includes(String(fakeCards.length)),
    `expected the summary line to mention the record count (${fakeCards.length}), got: ${logLines[0]}`
  );
});
```

### 3b. Leave everything else in the file untouched

That includes: the header requires, `slugify()`, `listExpectedCards()`, `runDryRun()`,
`parseLines()`, the `AC1` dry-run test, the `AC2` slug test, and the `AC4` held-out
byte-identical-dry-run test at the bottom of the file. Do not renumber or rename those.

---

## Step 4 — `test/jaina-client.test.js` (new file)

Create `test/jaina-client.test.js` with exactly this content:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { createJainaClient } = require('../lib/jaina-client');

// Swaps global.fetch for a fake for the duration of `fn`, always restoring
// the original afterward (even on failure) — this is what keeps every test
// in this file from ever reaching a real host.
async function withFakeFetch(impl, fn) {
  const original = global.fetch;
  global.fetch = impl;
  try {
    await fn();
  } finally {
    global.fetch = original;
  }
}

test('createJainaClient throws without apiKey or projectId', () => {
  assert.throws(() => createJainaClient({ projectId: 'p' }), /apiKey/);
  assert.throws(() => createJainaClient({ apiKey: 'k' }), /projectId/);
});

test('upsert() PUTs the record with bearer auth (fetch faked, no real network)', async () => {
  let capturedUrl;
  let capturedOptions;

  await withFakeFetch(
    async (url, options) => {
      capturedUrl = url;
      capturedOptions = options;
      return { ok: true, json: async () => ({ id: 'fake-id' }) };
    },
    async () => {
      const client = createJainaClient({ apiKey: 'test-key', projectId: 'test-project' });
      const result = await client.upsert({ name: 'Test Card', slug: 'test-card' });
      assert.deepStrictEqual(result, { id: 'fake-id' });
    }
  );

  assert.ok(capturedUrl.includes('test-project'), `expected URL to include project id, got: ${capturedUrl}`);
  assert.ok(capturedUrl.includes('test-card'), `expected URL to include record slug, got: ${capturedUrl}`);
  assert.strictEqual(capturedOptions.method, 'PUT');
  assert.strictEqual(capturedOptions.headers.Authorization, 'Bearer test-key');
  assert.strictEqual(JSON.parse(capturedOptions.body).name, 'Test Card');
});

test('upsert() throws a descriptive error on a non-ok response (fetch faked, no real network)', async () => {
  await withFakeFetch(
    async () => ({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'boom',
    }),
    async () => {
      const client = createJainaClient({ apiKey: 'k', projectId: 'p' });
      await assert.rejects(() => client.upsert({ name: 'Test Card', slug: 'test-card' }), /500/);
    }
  );
});
```

---

## Expected output after implementation

Run `node --test` from the repo root. Expected:
- All pre-existing tests across every `test/*.test.js` file still pass (nothing else in
  the repo changed).
- `test/sync-cards-to-jaina.test.js` now has 6 tests, all passing: the original `AC1`,
  `AC2`, `AC4` (dry-run, unchanged) plus the new/replaced `Live sync AC3`, `Live sync
  AC2b`, `Live sync AC1` (client gating), `Live sync AC1 & AC2` (runLiveSync).
- `test/jaina-client.test.js` is a new file with 3 passing tests.
- Final summary line from `node --test` shows `# pass` increased by roughly 8 relative to
  the pre-unit baseline (2 tests removed/replaced net +1, 3 new tests added to the sync
  test file, 3 new tests in the new client test file) and `# fail 0`.

Manual smoke check (not part of the automated suite, credentials intentionally absent):

```
$ node tools/sync-cards-to-jaina.js
Jaina credentials not configured: set JAINA_API_KEY and JAINA_PROJECT_ID to run a live sync (or re-run with --dry-run to preview the record payloads without any credentials).
$ echo $?
1
```

```
$ node tools/sync-cards-to-jaina.js --dry-run | head -1
{"name":"...","slug":"...","costLine":"...","typeLine":"...","rulesText":"...","statsLine":"..."}
```
(identical to pre-unit output — do not run this against a real Jaina project; there is no
real endpoint confirmed yet, see the GATE note at the top of this plan.)

---

## Acceptance criteria mapping

- **AC1** (upsert once per card, one-line summary, exit 0, client gated on both env vars)
  → Step 2's `runLiveSync`/`resolveLiveClient`/`main()`; verified by the two new "Live
  sync AC1..." tests in Step 3.
- **AC2** (tests exercise the live path via a fake client, no real `http`/`https`/`fetch`
  reaches an external host) → Step 3's "Live sync AC1 & AC2" test calls `runLiveSync`
  in-process with a fake client; "Live sync AC2b" statically confirms the sync script
  itself never calls `fetch`/`require('http')`/`require('https')`; `test/jaina-client.test.js`
  only ever exercises `lib/jaina-client.js`'s real `fetch()` call path with `global.fetch`
  monkey-patched.
- **AC3** (missing credentials → exit 1, clear message, no throw/no-op) → Step 2's
  `resolveLiveClient` + `main()`; verified by Step 3's replaced "Live sync AC3" test.
- **AC4** (held out — dry-run unchanged byte-for-byte) → Step 2 keeps the `--dry-run`
  branch's logic and ordering identical to the merged dry-run unit; verified by the
  pre-existing (untouched) `AC4` test in `test/sync-cards-to-jaina.test.js`. This AC is
  redundant with the unit's own intent statement ("this unit only adds behavior to the
  no-flag path") — no spec-bug concern here.

No held-out AC introduces a requirement absent from the visible intent; AC4 is exactly the
kind of "novel only in specifics" restatement the held-out discipline expects.
