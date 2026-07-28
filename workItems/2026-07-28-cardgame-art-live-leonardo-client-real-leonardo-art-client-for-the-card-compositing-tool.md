# cardgame-art-live-leonardo-client: Real Leonardo art client for the card compositing tool

## Header

- unit: cardgame-art-live-leonardo-client
- title: Real Leonardo art client for the card compositing tool
- project: cardgame
- completed: 2026-07-28
- outcome: merged
- start_sha: 19198fba638a7706ee08333955125d7b0ab62313
- end_sha: 976b15361e1c589d209beb91a18ae78f4a4ee3cf

## Intent

Extend the Alpha set's card-art compositing tool with a real, opt-in Leonardo-backed art-generation client behind the same injectable generateArt seam the dry-run unit built, so the 18 approved art briefs in design/cards/art-briefs.md can produce actual illustrated card art instead of mock color swatches, while the default (no-flag) path keeps making zero network calls and needing no API key.

## Acceptance Criteria

- AC1 [inferred]: Passing --live to tools/composite-card-art.js constructs a LeonardoArtClient that sends one image-generation request per brief using LEONARDO_API_KEY; tests inject a mock HTTP transport (no real network call, no real spend) and assert the request is well-formed.
- AC2 [paraphrase]: With no --live flag, behavior is unchanged from the merged dry-run: the deterministic mock client runs, no LEONARDO_API_KEY is read, and output is byte-identical to the existing renders/cards-composited/ baseline.
- AC3 [inferred]: If --live is passed but LEONARDO_API_KEY is unset, the script exits non-zero with an error naming the missing env var instead of attempting a malformed request.
- AC4 [inferred] (held_out): The live client's prompt for each card is built from that specific card's art-briefs.md section (palette, subject/scene, key visual elements) rather than a generic template, so each of the 18 cards yields a distinct prompt.

## Plan

# Plan: cardgame-art-live-leonardo-client

GATE: confirm

**Why gated:** Two judgment calls here are not fully dictated by the ACs and are
worth a human glance before the bolt spends build tokens:

1. **AC1 says "sends one image-generation request per brief."** Leonardo's real
   generation API is asynchronous — the `POST /generations` call only returns a
   `generationId`; the actual image URL is only available by polling
   `GET /generations/{id}` until its status is `COMPLETE`. A literal "exactly one
   HTTP call, period" client cannot return a real image href — it would
   contradict the unit's own intent ("produce actual illustrated card art
   instead of mock color swatches"). This plan reads AC1's "one
   image-generation request" as the one `POST` that *starts* generation, and
   treats the follow-up `GET` polls as status checks, not "image-generation
   requests." The plan below implements create-then-poll. If the reviewer
   wants a stricter "literally one HTTP call, full stop" client (accepting
   that `--live` alone wouldn't yet resolve to a finished image), say so and
   the poll loop should be dropped in favor of returning a placeholder/job
   reference instead.
2. **Leonardo API field names below are from training knowledge, not
   independently re-verified against `docs.leonardo.ai` this session** (WebFetch
   and Perplexity were both unavailable/unauthorized in this planning
   session). This does not affect `node --test` — every test injects a mock
   `fetchImpl`, so no real HTTP call or real field-name compatibility is ever
   exercised by the test suite. It only matters the first time someone runs
   `--live` for real. The builder should sanity-check the request/response
   shape against Leonardo's docs before a real `--live` run, and adjust
   `lib/leonardo-art-client.js` if field names differ — that change is
   isolated to one file and doesn't affect any test contract described here.

Everything else in this plan is unambiguous and safe to build as written.

## Intent (recap)

Add a real, opt-in Leonardo-backed art client behind the existing injectable
`generateArt` seam in `tools/composite-card-art.js` (built in the prior
`cardgame-card-authoring-engine`-line unit). `--live` should make one real
generation request per brief in `design/cards/art-briefs.md` (18 cards) using
`LEONARDO_API_KEY`. The default (no-flag) path must stay exactly as it is
today: deterministic mock client, zero network calls, no env var read, output
byte-identical to what's already committed in `renders/cards-composited/`.

## Risk self-assessment (FIRE)

- **Reversibility:** Fully reversible. Two new files (`lib/leonardo-art-client.js`,
  `test/leonardo-art-client.test.js`), and a small, additive change to
  `tools/composite-card-art.js` (new `runCli` export + a 6-line CLI dispatch
  change). No existing exports, function signatures, or file layouts are
  removed or altered. `git revert` cleanly undoes this unit.
- **Security impact:** Real API key handling (`LEONARDO_API_KEY` from the
  environment) and one outbound HTTPS call path are introduced, but only when
  a human explicitly passes `--live`. The key is only ever read from
  `process.env` (never logged, never written to disk, never embedded in
  output files) and is sent only as a `Bearer` auth header to
  `https://cloud.leonardo.ai`. No secrets are hard-coded anywhere in this
  plan or the code it describes.
- **User data:** None. No user input, no PII, no persistence beyond the
  existing `renders/cards-composited/*.svg` output files this tool already
  writes.
- **Schema changes:** None. Card/brief markdown formats, the Art Window
  geometry, and the composited-SVG output format are all untouched.

Unit size: fits in one bolt. Two small new files plus a minimal, additive
edit to one existing file; no refactor of `render-card.js`,
`parse-card-markdown.js`, or the existing mock-client path.

## Held-out criteria discipline

AC4 (held_out) — "each of the 18 cards yields a distinct prompt, built from
that card's own brief" — is redundant with the visible intent (the whole
point of `--live` is to stop using the generic mock-swatch template and
instead generate real, brief-specific art). Not a spec bug. It's trivially
satisfiable: the 18 `design/cards/art-briefs.md` sections already have
distinct `Palette:`/`Subject/Scene:`/`Key visual elements:` text per card
(confirmed by inspection); embedding that text verbatim into the prompt
guarantees per-card distinctness without needing a parser. Plan accordingly
below (`buildPrompt` just interpolates the full brief text — no need to
regex out individual fields).

## Repo context (verified)

- Repo root for this worktree:
  `C:\github\.agentbox-worktrees\cardGame\cardgame-art-live-leonardo-client`,
  branch `bolt/cardgame-art-live-leonardo-client`. Node `v23.11.0` — global
  `fetch` is available, no new dependency needed (`package.json` has zero
  runtime dependencies today; keep it that way).
- `tools/composite-card-art.js` (existing, from the merged dry-run unit)
  already has exactly the injectable seam this unit needs:
  - `main(client = createMockLeonardoClient())` loops
    `design/cards/art-briefs.md` briefs (via `loadBriefs()`), calls
    `await client.generateArt({ cardName, brief })` once per brief, and
    composites the returned `{ href }` into the card SVG.
  - The CLI entry point is:
    ```js
    if (require.main === module) {
      main().catch((err) => {
        console.error(err.stack || err.message || String(err));
        process.exitCode = 1;
      });
    }
    ```
  - `createMockLeonardoClient()` is the deterministic, network-free default —
    do not touch it.
- `test/composite-card-art.test.js` (existing, from the merged dry-run unit)
  has a test that **statically greps the source text of
  `tools/composite-card-art.js`** for `fetch(`, `require('http'|'https')`,
  and `process.env.*LEONARDO*` (lines 173–184: `AC3: default art-generation
  path has no fetch/http calls and never reads a Leonardo API key`). This is
  a real constraint on *where* the new code can live: if the live client's
  `fetch(...)` call or `process.env.LEONARDO_API_KEY` read is written
  directly inside `tools/composite-card-art.js`, that existing test breaks —
  and per "don't touch unrelated code," this plan does **not** touch that
  test. Instead, all real-network code and the `LEONARDO_API_KEY` read live
  in a **new file**, `lib/leonardo-art-client.js`, which
  `tools/composite-card-art.js` only ever references via
  `require('../lib/leonardo-art-client')` — a string that matches none of
  that test's three regexes. This keeps the existing test green with zero
  edits to it, and is also the cleaner design regardless (mirrors how
  `lib/parse-card-markdown.js` is already split out from `tools/`).
- Art Window target aspect: `tools/render-card.js` defines `INNER_WIDTH = 702`
  and `ART_WINDOW_HEIGHT = 420` (≈ 5:3 landscape, confirmed by reading the
  file). The Leonardo request below asks for `1024×616` (also multiples of 8,
  Leonardo's requirement), which is ≈1.66:1 — a close match, close enough that
  no cropping logic is needed beyond the existing
  `preserveAspectRatio="xMidYMid slice"` already on the composited `<image>`
  tag (untouched, in `compositeArtWindow`).
- `design/cards/art-briefs.md` has 18 `###` sections, each with `Palette:`,
  `Subject/Scene:`, `Key visual elements:`, and `Composition:` lines (verified
  by reading the file). `loadBriefs()` in `tools/composite-card-art.js`
  already turns each section into `{ cardName, text }` where `text` is that
  whole section's body, newline-joined and trimmed — this is exactly the
  string this plan's `buildPrompt` embeds into the Leonardo prompt.
- Test style precedent (`test/sync-cards-to-jaina.test.js`,
  `test/composite-card-art.test.js`): `execFileSync('node', [SCRIPT_PATH,
  '--flag'], { cwd: REPO_ROOT, encoding: 'utf8' })` for CLI-level checks;
  `process.argv.includes('--dry-run')` is the existing flag-parsing idiom
  (`tools/sync-cards-to-jaina.js:30`) — this plan's `--live` follows the same
  idiom.

## Design

### `lib/leonardo-art-client.js` (new)

Exports `createLeonardoArtClient(options)`:
- Reads `LEONARDO_API_KEY` from `process.env` at construction time. Throws
  immediately (before any network call) if it's missing, with a message that
  names the variable — this is what satisfies AC3.
- `options.fetchImpl` (default: global `fetch`) and `options.sleepImpl`
  (default: real `setTimeout`-based delay) are both injectable, so tests never
  touch the network or the clock. This is the "mock HTTP transport" AC1 refers
  to.
- `generateArt({ cardName, brief })`:
  1. `POST https://cloud.leonardo.ai/api/rest/v1/generations` with the built
     prompt — this is "the" one image-generation request per brief (AC1).
  2. Polls `GET https://cloud.leonardo.ai/api/rest/v1/generations/{id}` (a
     status check, not a generation request) until `status === 'COMPLETE'`,
     then returns `{ href: <first generated image URL> }`. If the mock
     transport resolves the status as `COMPLETE` on the very first poll (as
     the example test below does), **zero calls to `sleepImpl` happen** —
     so a test author doesn't need to know or care about the polling/timing
     internals to keep tests fast.
- `buildPrompt({ cardName, brief })` (also exported, for the AC4 test) —
  interpolates the card name and the *entire* brief section text into the
  prompt. No brief-field parsing needed: the brief text already contains
  `Palette:`, `Subject/Scene:`, `Key visual elements:`, `Composition:` labeled
  lines, so embedding it verbatim satisfies AC4 for free and keeps the code
  simple.

Full file contents:

```js
'use strict';

const GENERATIONS_URL = 'https://cloud.leonardo.ai/api/rest/v1/generations';
const DEFAULT_POLL_INTERVAL_MS = 2000;
const DEFAULT_MAX_POLL_ATTEMPTS = 30;

// ---------------------------------------------------------------------------
// Prompt building — the whole brief section (Palette/Subject-Scene/Key
// visual elements/Composition) goes straight into the prompt, so every one
// of the 18 cards in design/cards/art-briefs.md yields a distinct,
// brief-specific prompt rather than a generic template.
// ---------------------------------------------------------------------------

function buildPrompt({ cardName, brief }) {
  return `Trading card illustration for "${cardName}". ${brief}`.trim();
}

function generationStatusUrl(generationId) {
  return `${GENERATIONS_URL}/${generationId}`;
}

async function readJson(response, context) {
  if (!response.ok) {
    const body = typeof response.text === 'function' ? await response.text().catch(() => '') : '';
    throw new Error(
      `Leonardo API request failed (${context}): ${response.status || ''} ${response.statusText || ''} ${body}`.trim()
    );
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// createLeonardoArtClient — the real, opt-in art-generation client behind
// the same generateArt({ cardName, brief }) -> Promise<{ href }> seam the
// mock client implements in tools/composite-card-art.js.
//
// fetchImpl/sleepImpl are injectable so tests never make a real network
// call or wait on a real timer (AC1's "mock HTTP transport").
// ---------------------------------------------------------------------------

function createLeonardoArtClient({
  fetchImpl = fetch,
  sleepImpl = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
  maxPollAttempts = DEFAULT_MAX_POLL_ATTEMPTS,
} = {}) {
  const apiKey = process.env.LEONARDO_API_KEY;
  if (!apiKey) {
    throw new Error(
      'LEONARDO_API_KEY environment variable is required to run tools/composite-card-art.js --live'
    );
  }

  return {
    async generateArt({ cardName, brief }) {
      const prompt = buildPrompt({ cardName, brief });

      const createResponse = await fetchImpl(GENERATIONS_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ prompt, num_images: 1, width: 1024, height: 616 }),
      });
      const created = await readJson(createResponse, `creating generation for "${cardName}"`);
      const generationId = created && created.sdGenerationJob && created.sdGenerationJob.generationId;
      if (!generationId) {
        throw new Error(
          `Leonardo API did not return a generationId for "${cardName}": ${JSON.stringify(created)}`
        );
      }

      for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
        const statusResponse = await fetchImpl(generationStatusUrl(generationId), {
          method: 'GET',
          headers: { accept: 'application/json', authorization: `Bearer ${apiKey}` },
        });
        const statusBody = await readJson(statusResponse, `polling generation "${generationId}" for "${cardName}"`);
        const generation = statusBody && statusBody.generations_by_pk;

        if (generation && generation.status === 'COMPLETE') {
          const image = generation.generated_images && generation.generated_images[0];
          if (!image || !image.url) {
            throw new Error(`Leonardo generation "${generationId}" completed with no image URL for "${cardName}"`);
          }
          return { href: image.url };
        }
        if (generation && generation.status === 'FAILED') {
          throw new Error(`Leonardo generation "${generationId}" failed for "${cardName}"`);
        }
        await sleepImpl(pollIntervalMs);
      }
      throw new Error(
        `Leonardo generation "${generationId}" for "${cardName}" did not complete after ${maxPollAttempts} polls`
      );
    },
  };
}

module.exports = { createLeonardoArtClient, buildPrompt };
```

### `tools/composite-card-art.js` (modify)

Two changes only. Everything else in the file (the mock client, `main()`,
`compositeArtWindow`, `loadBriefs`, the `ART_WINDOW_*` exports) stays exactly
as it is.

1. Replace the `if (require.main === module) { ... }` block (currently lines
   124–129) with an exported `runCli` plus the same dispatch, so the CLI
   wiring is directly unit-testable in-process (no subprocess needed) and so
   `--live` construction is provably exercised by a test:

   ```js
   async function runCli(argv = process.argv) {
     const useLive = argv.includes('--live');
     const client = useLive ? require('../lib/leonardo-art-client').createLeonardoArtClient() : undefined;
     await main(client);
   }

   if (require.main === module) {
     runCli().catch((err) => {
       console.error(err.stack || err.message || String(err));
       process.exitCode = 1;
     });
   }
   ```

   Note: `require('../lib/leonardo-art-client')` is called lazily, only
   inside the `useLive` branch — so running with no flags never even loads
   that module, let alone reads `LEONARDO_API_KEY` (AC2). And because the
   literal strings `fetch(`, `require('http')`/`require('https')`, and
   `process.env.LEONARDO...` never appear in this file's source, the existing
   static-source-scan test (`test/composite-card-art.test.js` lines 173–184)
   keeps passing unmodified.

2. Add `runCli` to the `module.exports` at the bottom:

   ```js
   module.exports = {
     main,
     runCli,
     createMockLeonardoClient,
     compositeArtWindow,
     loadBriefs,
     ART_WINDOW_X,
     ART_WINDOW_Y,
     ART_WINDOW_WIDTH,
     ART_WINDOW_HEIGHT,
   };
   ```

Do not touch `test/composite-card-art.test.js` at all — it should need zero
edits. If, when actually running `node --test`, any of its existing
assertions fail because of this change, that's a signal something above
leaked into the default path and needs fixing, not a signal to relax that
test.

### `test/leonardo-art-client.test.js` (new)

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const { createLeonardoArtClient, buildPrompt } = require('../lib/leonardo-art-client');
const { loadBriefs, runCli } = require('../tools/composite-card-art');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'composite-card-art.js');

function withEnv(key, value, fn) {
  const previous = process.env[key];
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
  try {
    return fn();
  } finally {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
}

function mockTransport() {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (options.method === 'POST') {
      return { ok: true, status: 200, json: async () => ({ sdGenerationJob: { generationId: 'gen-1' } }) };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({
        generations_by_pk: {
          status: 'COMPLETE',
          generated_images: [{ url: 'https://cdn.leonardo.ai/gen-1/image-0.png' }],
        },
      }),
    };
  };
  return { calls, fetchImpl };
}

// ---------------------------------------------------------------------------
// AC1: --live constructs a LeonardoArtClient that sends one image-generation
// request per brief using LEONARDO_API_KEY; a mock transport captures the
// request instead of hitting the network.
// ---------------------------------------------------------------------------

test('AC1: generateArt sends one well-formed POST /generations request using LEONARDO_API_KEY', async () => {
  await withEnv('LEONARDO_API_KEY', 'test-key-123', async () => {
    const { calls, fetchImpl } = mockTransport();
    const client = createLeonardoArtClient({ fetchImpl });

    const result = await client.generateArt({
      cardName: 'Unwritten Hour',
      brief: 'Palette: Violet. Subject/Scene: a ritualist at a star-mapped dais.',
    });

    const postCalls = calls.filter((c) => c.options.method === 'POST');
    assert.strictEqual(postCalls.length, 1, 'expected exactly one image-generation (POST) request');
    const [createCall] = postCalls;
    assert.ok(createCall.url.includes('/generations'), 'expected the generations endpoint');
    assert.strictEqual(createCall.options.headers.authorization, 'Bearer test-key-123');
    const body = JSON.parse(createCall.options.body);
    assert.ok(body.prompt.includes('Unwritten Hour'));
    assert.ok(body.prompt.includes('ritualist at a star-mapped dais'));
    assert.strictEqual(result.href, 'https://cdn.leonardo.ai/gen-1/image-0.png');
  });
});

test('AC1: --live wiring in tools/composite-card-art.js uses the real Leonardo client end to end', async () => {
  await withEnv('LEONARDO_API_KEY', 'test-key-123', async () => {
    const { fetchImpl } = mockTransport();
    const previousFetch = global.fetch;
    global.fetch = fetchImpl;
    try {
      await assert.doesNotReject(runCli(['node', SCRIPT_PATH, '--live']));
    } finally {
      global.fetch = previousFetch;
    }
  });
  // Restore renders/cards-composited/ to the checked-in default-mock output
  // so a plain `node --test` run afterward leaves the directory the way
  // AC2 promises (byte-identical to the committed baseline), not test
  // residue from the --live run above.
  const composite = require('../tools/composite-card-art');
  await composite.main();
});

// ---------------------------------------------------------------------------
// AC3: --live without LEONARDO_API_KEY exits non-zero, naming the missing var.
// ---------------------------------------------------------------------------

test('AC3: --live without LEONARDO_API_KEY exits non-zero and names the missing env var', () => {
  const env = { ...process.env };
  delete env.LEONARDO_API_KEY;
  assert.throws(
    () => execFileSync('node', [SCRIPT_PATH, '--live'], { cwd: REPO_ROOT, encoding: 'utf8', env }),
    (err) => {
      assert.notStrictEqual(err.status, 0, 'expected a non-zero exit code');
      assert.match(String(err.stderr), /LEONARDO_API_KEY/);
      return true;
    }
  );
});

test('AC3: constructing the client directly without LEONARDO_API_KEY throws naming the var', () => {
  withEnv('LEONARDO_API_KEY', undefined, () => {
    assert.throws(() => createLeonardoArtClient(), /LEONARDO_API_KEY/);
  });
});

// ---------------------------------------------------------------------------
// AC4 (held_out): prompts are built from each card's own brief, not a
// generic template — so every card's prompt is distinct.
// ---------------------------------------------------------------------------

test('AC4 (held_out): prompts differ per card and include that card\'s own brief content', () => {
  const promptA = buildPrompt({ cardName: 'Unwritten Hour', brief: 'Palette: Violet. A queue of glowing tokens reorders.' });
  const promptB = buildPrompt({ cardName: 'Firmware Sentinel', brief: 'Palette: Copper. A stationary sentinel tracks a Unit.' });
  assert.notStrictEqual(promptA, promptB);
  assert.ok(promptA.includes('Unwritten Hour') && promptA.includes('glowing tokens'));
  assert.ok(promptB.includes('Firmware Sentinel') && promptB.includes('stationary sentinel'));
});

test('AC4 (held_out): all 18 art-briefs.md sections yield distinct prompts', () => {
  const briefs = loadBriefs();
  assert.strictEqual(briefs.length, 18, 'expected 18 briefs in design/cards/art-briefs.md');
  const prompts = briefs.map((b) => buildPrompt({ cardName: b.cardName, brief: b.text }));
  assert.strictEqual(new Set(prompts).size, prompts.length, 'expected every prompt to be unique');
});
```

Notes on this test file:
- It never sets `LEONARDO_API_KEY` outside a `withEnv(...)` scope, and always
  restores the previous value (mirrors the existing pattern in
  `test/composite-card-art.test.js`'s AC3 test).
- The end-to-end `--live` test monkeypatches `global.fetch` (Node's `fetch`
  is a real global, reassignable) rather than spawning a subprocess, because
  a subprocess can't have a mock transport injected into it. It restores
  `global.fetch` in a `finally`, and — like the existing "AC3: image
  generation is injected via a client argument" test in
  `test/composite-card-art.test.js` — re-runs the plain default `main()`
  afterward so `renders/cards-composited/` is left in its normal committed
  state, not `--live`-test residue.
- The missing-key test uses `execFileSync`, which is the only practical way
  to assert a real *process exit code*; it costs one real `node` spawn but
  makes no network call (the client throws before any `fetch`).

## Expected outputs

- `node --test` (from repo root): all existing test files continue to pass
  unmodified, plus the new `test/leonardo-art-client.test.js` reports 6
  passing tests (2× AC1, 2× AC3, 2× AC4). Total test count increases by 6;
  nothing else in the existing suite should change pass/fail state.
- `node tools/composite-card-art.js` (no flags): unchanged — exits 0, prints
  `Composited 18 card art window(s) into renders/cards-composited/`, and
  `git status --porcelain renders/ site/` shows no diff (the regenerated
  files match what's already committed, byte-for-byte) — this is the manual
  check for AC2 the builder should run once locally after implementing.
- `node tools/composite-card-art.js --live` with `LEONARDO_API_KEY` unset:
  exits non-zero, stderr includes the string `LEONARDO_API_KEY`, and
  `renders/cards-composited/` is left untouched (the error is thrown before
  the output directory is ever cleared, since client construction happens
  before `main()` runs).
- `node tools/composite-card-art.js --live` with a real `LEONARDO_API_KEY`
  set: makes real network calls to `cloud.leonardo.ai` (one `POST` +
  up to 30 polling `GET`s per brief, ~18 briefs) and writes real
  Leonardo-generated art into `renders/cards-composited/`. This is not
  exercised by `node --test` and should not be run casually (real API
  spend) — only run it deliberately, with a real key, outside the test
  suite.

## Out of scope / explicit non-goals

- No retry/backoff beyond the fixed poll loop; no rate-limiting or
  cost-tracking. If real `--live` runs turn out to need those, that's a
  follow-up unit.
- No change to `render-card.js`, `parse-card-markdown.js`, the mock client,
  or any `design/cards/*.md` content.
- No new npm dependency — uses Node's built-in global `fetch`.


## Findings

# Blind Review — cardgame-art-live-leonardo-client, cycle 3

## AC coverage

- **AC1** (`--live` builds a `LeonardoArtClient`, one POST `/generations` per brief, `Bearer` auth from `LEONARDO_API_KEY`, mock-transport-tested): `lib/leonardo-art-client.js`'s `createLeonardoArtClient()` reads `LEONARDO_API_KEY` at construction and throws if absent; `generateArt()` issues exactly one `POST {GENERATIONS_URL}` with `authorization: Bearer <key>` and a prompt embedding `cardName`/`brief`, then polls `GET .../{id}` (injectable `fetchImpl`/`sleepImpl`, no real network/timers) until `COMPLETE`. `runCli()` wires `--live` to construct this client. `test/leonardo-art-client.test.js` asserts exactly one POST, the Bearer header, prompt content, and (via `runCli(['--live'])` against a mock transport) one POST per brief in `art-briefs.md`. **Met.**
- **AC2** (no `--live`: unchanged mock path, no env read, byte-identical `renders/cards-composited/` output): `runCli()` only builds the live client when `argv.includes('--live')`; the default path still runs `createMockLeonardoClient()` via `main()`, unmodified. A test asserts `git status --porcelain -- renders/cards-composited` is empty after a default run. **Met** — see Finding 1 for a narrow, non-gating robustness gap in how a *different* test's cleanup path protects this same baseline.
- **AC3** (`--live` with no `LEONARDO_API_KEY` exits non-zero, names the var, no malformed request attempted): `createLeonardoArtClient()` validates `process.env.LEONARDO_API_KEY` synchronously and throws (message includes `LEONARDO_API_KEY`) before any `fetchImpl` call; `runCli()` constructs the client eagerly, so the top-level `.catch` reports it via `console.error` + `process.exitCode = 1`. Verified by a CLI-level `execFileSync` test (non-zero exit, `/LEONARDO_API_KEY/` stderr match) and a direct-construction test asserting `fetchImpl` is never called. **Met.**

## Prior-cycle findings — verified fixed

- **Cycle 2 Finding 1** (concurrent `node --test` files racing an unlocked `git status` read against another file's corrupt-then-restore swap): `package.json`'s `test` script now runs `node --test --test-concurrency=1`, serializing test files so this interleaving can no longer occur. Confirmed fixed.
- **Cycle 2 Finding 2** (non-atomic `rmSync(OUT_DIR)` + `renameSync(tmpDir, OUT_DIR)` could leave `OUT_DIR` permanently missing if the rename failed after the removal succeeded): `main()`'s swap now renames the existing `OUT_DIR` to a backup path first, then renames `tmpDir` into place, and — if that second rename throws — renames the backup back before rethrowing. The failure mode cycle 2 flagged (delete succeeds, replace fails, directory left missing) is closed: the "delete" is now a reversible rename. Confirmed fixed.

## Findings

### Finding 1 — INTRODUCED, non-gating — `--live` CLI-wiring test skips its own cleanup if a preceding assertion fails

`test/leonardo-art-client.test.js`'s `'AC1: --live wiring sends one image-generation request per brief...'` test runs `runCli(['node', SCRIPT_PATH, '--live'])` against the real, git-tracked `OUT_DIR` (not an isolated copy) with a monkey-patched `global.fetch`, then relies on a trailing `await compositeMain();` — placed *after* the `await withEnv(...)` block closes, not in a `finally` — to restore the committed default-mock baseline.

**Failure scenario:** if any assertion inside that `withEnv(...)` callback throws (e.g. the `postCalls.length === briefs.length` check, or a future regression in request formatting), the callback's rejection propagates straight out of the test function, and the `await compositeMain();` restore line is never reached. `renders/cards-composited/*.svg` is left containing the mock transport's fake `https://cdn.leonardo.ai/gen-1/image-0.png` href instead of the real baseline, which would then also fail the separate AC2 test's `git status` check — turning one clear failure into two, with the second one misdiagnosable as unrelated. Recovery is a manual `git checkout -- renders/cards-composited`.

This exact contamination-on-failure shape already exists, unaddressed, in the pre-existing `test/composite-card-art.test.js` (`'AC3: image generation is injected via a client argument...'`, restored via a similarly bare trailing `await composite.main();`), so this diff is continuing an established pattern in this codebase rather than inventing a new class of risk, and the consequence is self-evident (shows up in `git status`) and trivially reversible rather than silent or destructive. For that reason I'm not gating on it, but it's real, newly-instantiated-in-this-diff, and cheap to close (wrap the live run + restore in `try/finally`, or point this one test at an isolated output directory instead of the real `OUT_DIR`) — worth a follow-up.

## Not flagged (pre-existing / out of scope)

- Leonardo API field names (`sdGenerationJob.generationId`, `generations_by_pk`, etc.) are unverified against live docs by the test suite — by design, every test injects a mock transport. plan.md records this as a known, accepted risk to be checked before a real `--live` run; not a test-contract gate.
- The create-then-poll interpretation of AC1 ("one POST counts as the request; GET polls are status checks, not additional generation requests") is the plan's explicitly stated, gated reading. Implementation matches it.
- Serializing the whole suite via `--test-concurrency=1` (package.json) is a real, permanent cost to future CI wall-clock time as more test files are added, but it's the direct, minimal fix for a real race a prior reviewer flagged (cycle 2 Finding 1) — not undisclosed scope creep in this cycle's context.

## Verdict rationale

Both substantive findings from cycle 2 are verified fixed by this diff, with no new correctness regressions introduced by either fix. All three visible ACs are implemented and covered by tests that exercise the behavior they claim to. The one new observation (Finding 1) is real but low-materiality: it only manifests as a secondary symptom of an already-failing assertion, produces a self-evident and trivially-reversible artifact rather than a false pass/fail or data loss, and mirrors a pattern already present twice elsewhere in this codebase without prior objection. Not gating-worthy on its own.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T22:35:49.366Z] **bolt:start** — unit=cardgame-art-live-leonardo-client start_sha=19198fba638a7706ee08333955125d7b0ab62313 branch=bolt/cardgame-art-live-leonardo-client worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-art-live-leonardo-client
- [2026-07-28T22:35:57.468Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T22:43:57.195Z] **plan:done** — plan.md written
- [2026-07-28T22:43:57.207Z] **gate:raised** — confirm — waiting for decision (file or API)
- [2026-07-28T23:01:03.862Z] **gate-confirm:done** — approved — Approved by orchestrator on RouterBox's explicit phone go-ahead (both security gates). Verified API contracts written to feedback.md - read it before building the client module.
- [2026-07-28T23:03:01.498Z] **tests:done** — RED verified on test/leonardo-art-client.test.js (exit=1)
- [2026-07-28T23:07:12.840Z] **build:c1** — tests green, committed
- [2026-07-28T23:11:15.772Z] **review:c1** — NEEDS_WORK
- [2026-07-28T23:19:34.088Z] **build:c2** — tests green, committed
- [2026-07-28T23:23:11.314Z] **review:c2** — NEEDS_WORK
- [2026-07-28T23:24:47.045Z] **build:c3** — tests green, committed
- [2026-07-28T23:29:39.548Z] **review:c3** — APPROVE
- [2026-07-28T23:29:46.883Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-28T23:29:46.931Z] **gate:raised** — validate — security zone touched, waiting for decision
- [2026-07-28T23:38:37.777Z] **gate-validate:done** — approved — Validate approved by orchestrator under RouterBox phone go-ahead for this security unit. Receipt valid, 3-cycle review chain with substantive findings all resolved, held-out AC4 passing, --live remains operator-initiated.
- [2026-07-28T23:38:38.142Z] **merge:done** — auto-merged bolt/cardgame-art-live-leonardo-client into master (worktree)


## Receipt

```json
{
  "start_sha": "19198fba638a7706ee08333955125d7b0ab62313",
  "end_sha": "0e677895bcea80faad9e579602c447950b22b0d7",
  "diff_nonempty": true,
  "test_cmd": "node --test",
  "exit_code": 0,
  "criteria_covered": [
    {
      "id": "AC1",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC2",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC3",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": true,
      "passed": true
    }
  ],
  "cycles": 3,
  "timestamp": "2026-07-28T23:29:46.881Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-art-live-leonardo-client\\plan.md`.\n\nSummary of the plan:\n- **New file** `lib/leonardo-art-client.js` — real Leonardo client (`createLeonardoArtClient`), POST to create a generation + poll to completion, injectable `fetchImpl`/`sleepImpl` for testing, throws naming `LEONARDO_API_KEY` if missing.\n- **Modified** `tools/composite-card-art.js` — minimal, additive: extract CLI dispatch into an exported `runCli(argv)` that only requires the Leonardo client module when `--live` is passed. This keeps the literal strings `fetch(`/`process.env.LEONARDO...` out of that file entirely, so the existing static-source-scan test from the prior merged unit stays green untouched.\n- **New file** `test/leonardo-art-client.test.js` — covers AC1 (well-formed request via mock transport, end-to-end `--live` wiring via monkeypatched `global.fetch`), AC3 (missing-key exits non-zero naming the var), and AC4/held-out (distinct per-card prompts across all 18 real briefs).\n\nI gated the plan (`GATE: confirm`) on two judgment calls worth a human look: (1) reading AC1's \"one image-generation request\" as the initiating POST rather than literally one HTTP call total (since Leonardo's real API is async and a true one-shot design couldn't return a real image), and (2) that I couldn't independently verify Leonardo's exact field names this session (WebFetch/Perplexity were unauthorized) — doesn't affect `node --test` since everything is mocked, but matters before a real `--live` run.",
    "test_writer": "I need your approval to run `node --test test/leonardo-art-client.test.js` in this repo to confirm the new tests actually fail (RED) as required. Can you approve running this command?",
    "builder_c1": "Implementation complete and green. Summary:\n\n- **`lib/leonardo-art-client.js`** (new): `createLeonardoArtClient` — reads `LEONARDO_API_KEY` at construction (throws naming the var if missing, satisfying AC3), does one `POST /generations` per brief with an injectable `fetchImpl`/`sleepImpl`, then polls `GET /generations/{id}` until `COMPLETE`, returning `{ href }`. Also exports `buildPrompt`, which embeds the full brief text so prompts are per-card distinct (AC4).\n- **`tools/composite-card-art.js`** (modified): added `runCli(argv)` — lazily requires and constructs the Leonardo client only when `--live` is passed, otherwise the untouched mock path runs (AC2); exported `runCli`. Also fixed a real cross-process race: `node --test` runs test files as concurrent processes, and both `composite-card-art.test.js` and the new `leonardo-art-client.test.js` call `main()`/`runCli()` against the same shared `renders/cards-composited/` directory, causing intermittent ENOENT/EPERM/ENOTEMPTY crashes from the delete-then-recreate step. Added a cross-process mutex (atomic `mkdirSync` lock directory) around that critical section — this isn't in the plan but was required to make the suite reliably green without touching tests.\n\nNo files under `test/` were modified. Full suite: 443/443 passing, verified stable across 4 consecutive runs. `git status` shows only the intended new/modified files — `renders/cards-composited/` remains byte-identical to the committed baseline.",
    "reviewer_c1": "Findings written to `C:\\github\\AgentBox\\units\\cardgame-art-live-leonardo-client\\findings.md`. Summary: AC1–AC3 are all functionally implemented and covered by tests, but this diff also introduces a new cross-process filesystem-lock scheme (not requested by the plan) to serialize access to the shared `renders/cards-composited/` fixture across the new test file and the existing one. That scheme has two concrete introduced bugs: (1) the lock has no timeout/staleness handling, so a killed/interrupted `--live` run (plausible given the ~60s-per-brief poll loop) leaves a stale lock directory that hangs every future `main()` call forever; (2) the lock doesn't cover the \"corrupt-then-restore\" pattern used by two different test files running as concurrent processes under `node --test`, so AC2's `git status`-based byte-identical check can observe another file's mid-flight corrupted state and fail spuriously.\n\nNEEDS_WORK",
    "builder_c2": "Cycle 2 complete. Summary:\n\n**What I fixed** (both reviewer findings, in `tools/composite-card-art.js` only — no test files touched):\n\n1. **Finding 1 (indefinite hang risk)**: The old `withOutDirLock` looped `mkdirSync`/`EEXIST` forever with no escape if a holder was killed mid-run. Fixed by (a) shrinking what the lock guards down to just the final `rmSync`+`renameSync` swap (a couple of fast fs calls) instead of the entire brief-generation loop — the slow work now happens in a private per-process temp directory first — and (b) adding staleness detection: a lock directory older than 30s is treated as abandoned and reclaimed automatically.\n\n2. **Finding 2 (AC2 git-status race)**: The temp-dir-then-swap approach shrinks the window where `renders/cards-composited/` could be observed in an inconsistent state from \"the whole generation loop\" down to milliseconds. I verified this empirically — I initially tried removing the lock entirely (relying only on the temp-dir swap), which surfaced a real Windows `EPERM` race between concurrent `node --test` processes; restoring the lock (now scoped just to the swap) eliminated it. Ran the full suite 8 consecutive times after the fix: 443/443 green every time, with no leftover `.lock`/`.tmp-*` directories.\n\n`git status` is clean except for the one modified source file — no test residue, byte-identical `renders/cards-composited/` output preserved.",
    "reviewer_c2": "Findings written to `findings.md`. AC1 and AC3 are met; AC2 is met on paper but the new AC2 test's `git status` check races unlocked against the pre-existing corrupt-then-restore test in `composite-card-art.test.js` under `node --test`'s default file concurrency — a direct carryover of cycle 1's Finding 2 that this cycle's lock-staleness fix didn't address. A secondary, lower-likelihood finding: a rename failure after `rmSync(OUT_DIR)` succeeds can permanently delete the output directory with no recovery path in the error handler.\n\nNEEDS_WORK",
    "builder_c3": "Both cycle-2 reviewer findings are resolved, all 443 tests pass, and no files under `test/` were touched:\n\n- **Finding 1** (racy `git status` read against another test file's corrupt/restore cycle): fixed by adding `--test-concurrency=1` to the `test` script in `package.json`, so `node --test` runs test files sequentially instead of as concurrent processes — the cross-file race can no longer occur.\n- **Finding 2** (non-atomic `rmSync`+`renameSync` risking permanent data loss): fixed in `tools/composite-card-art.js` by renaming the old `OUT_DIR` aside as a backup before renaming `tmpDir` into place, and restoring that backup if the second rename fails — `OUT_DIR` can no longer be left missing on a mid-swap failure.\n\nCommitted as `0e67789`.",
    "reviewer_c3": "Findings written to `findings.md`. Both substantive cycle-2 findings (the file-race on `git status` and the non-atomic rename data-loss risk) are verified fixed in this diff via `--test-concurrency=1` and the backup-rename-rollback swap. All three visible ACs are met. One new, non-gating observation: the `--live` CLI-wiring test's cleanup (`compositeMain()` restore) isn't wrapped in `try/finally`, so a failing assertion in that test would leave the tracked baseline transiently corrupted — real but low-materiality (self-evident via `git status`, trivially reversible, mirrors an existing unaddressed pattern elsewhere in the repo).\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
