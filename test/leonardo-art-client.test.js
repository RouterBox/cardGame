'use strict';
const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'composite-card-art.js');

// Requiring both modules at load time is intentional: neither
// lib/leonardo-art-client.js nor a `runCli` export on
// tools/composite-card-art.js exists yet, so this throws and the whole file
// is reported as failing — the expected RED state before the unit is built.
const { createLeonardoArtClient } = require('../lib/leonardo-art-client');
const { loadBriefs, runCli, main: compositeMain } = require('../tools/composite-card-art');

function withEnv(key, value, fn) {
  const previous = process.env[key];
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      if (previous === undefined) delete process.env[key];
      else process.env[key] = previous;
    });
}

// A minimal fake Leonardo HTTP transport: POST /generations returns a
// generationId immediately, and the very first status GET reports COMPLETE
// — so tests never touch the network or a real timer.
function mockTransport() {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    if ((options.method || 'GET').toUpperCase() === 'POST') {
      return {
        ok: true,
        status: 200,
        json: async () => ({ sdGenerationJob: { generationId: 'gen-1' } }),
      };
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
// AC1: --live constructs a LeonardoArtClient that sends one
// image-generation request per brief using LEONARDO_API_KEY; a mock HTTP
// transport captures the request (no real network call, no real spend) so
// the test can assert the request is well-formed.
// ---------------------------------------------------------------------------

test('AC1: generateArt sends exactly one well-formed POST /generations request, authorized with LEONARDO_API_KEY', async () => {
  await withEnv('LEONARDO_API_KEY', 'test-key-123', async () => {
    const { calls, fetchImpl } = mockTransport();
    const client = createLeonardoArtClient({ fetchImpl });

    const result = await client.generateArt({
      cardName: 'Unwritten Hour',
      brief: 'Palette: Violet. Subject/Scene: a ritualist at a star-mapped dais.',
    });

    const postCalls = calls.filter((c) => (c.options.method || '').toUpperCase() === 'POST');
    assert.strictEqual(postCalls.length, 1, 'expected exactly one image-generation (POST) request');

    const [createCall] = postCalls;
    assert.ok(createCall.url.includes('/generations'), 'expected the generations endpoint to be requested');
    assert.strictEqual(
      createCall.options.headers.authorization,
      'Bearer test-key-123',
      'expected the request to be authorized with LEONARDO_API_KEY via a Bearer header'
    );

    const body = JSON.parse(createCall.options.body);
    assert.ok(typeof body.prompt === 'string' && body.prompt.length > 0, 'expected a non-empty prompt in the request body');
    assert.ok(body.prompt.includes('Unwritten Hour'), 'expected the prompt to reference the card name');

    assert.strictEqual(result.href, 'https://cdn.leonardo.ai/gen-1/image-0.png', 'expected generateArt to resolve with the generated image href');
  });
});

test('AC1: constructing a live client without LEONARDO_API_KEY set never happens implicitly — requires an explicit env value', async () => {
  await withEnv('LEONARDO_API_KEY', undefined, async () => {
    assert.throws(() => createLeonardoArtClient(), 'expected client construction to require LEONARDO_API_KEY');
  });
});

test('AC1: --live wiring sends one image-generation request per brief in design/cards/art-briefs.md', async () => {
  await withEnv('LEONARDO_API_KEY', 'test-key-123', async () => {
    const briefs = loadBriefs();
    assert.ok(briefs.length > 0, 'expected at least one brief in design/cards/art-briefs.md');

    const { calls, fetchImpl } = mockTransport();
    const previousFetch = global.fetch;
    global.fetch = fetchImpl;
    try {
      await assert.doesNotReject(
        runCli(['node', SCRIPT_PATH, '--live']),
        'expected runCli(["--live"]) to construct a LeonardoArtClient and complete using the mock transport'
      );
    } finally {
      global.fetch = previousFetch;
    }

    const postCalls = calls.filter((c) => (c.options.method || '').toUpperCase() === 'POST');
    assert.strictEqual(
      postCalls.length,
      briefs.length,
      `expected exactly one image-generation request per brief (${briefs.length}), saw ${postCalls.length}`
    );
  });

  // The --live run above wrote mock-transport hrefs into
  // renders/cards-composited/; restore the committed default-mock output so
  // a subsequent AC2 check (and a plain `node --test` re-run) sees the
  // normal, non-live state rather than residue from this test.
  await compositeMain();
});

// ---------------------------------------------------------------------------
// AC2: with no --live flag, behavior is unchanged from the merged dry-run —
// the deterministic mock client runs, LEONARDO_API_KEY is never read, and
// output is byte-identical to the existing renders/cards-composited/
// baseline already committed to the repo.
// ---------------------------------------------------------------------------

test('AC2: default (no --live) path never reads LEONARDO_API_KEY and leaves renders/cards-composited/ byte-identical to the committed baseline', async () => {
  const previousKey = process.env.LEONARDO_API_KEY;
  delete process.env.LEONARDO_API_KEY;
  try {
    await assert.doesNotReject(
      runCli(['node', SCRIPT_PATH]),
      'expected the default (no-flag) CLI path to run the mock client without requiring LEONARDO_API_KEY'
    );
  } finally {
    if (previousKey !== undefined) process.env.LEONARDO_API_KEY = previousKey;
  }

  const gitStatus = execFileSync(
    'git',
    ['status', '--porcelain', '--', 'renders/cards-composited'],
    { cwd: REPO_ROOT, encoding: 'utf8' }
  );
  assert.strictEqual(
    gitStatus.trim(),
    '',
    `expected no diff in renders/cards-composited/ after the default run, got:\n${gitStatus}`
  );
});

// ---------------------------------------------------------------------------
// AC3: if --live is passed but LEONARDO_API_KEY is unset, the script exits
// non-zero with an error naming the missing env var instead of attempting a
// malformed request.
// ---------------------------------------------------------------------------

test('AC3: `node tools/composite-card-art.js --live` with no LEONARDO_API_KEY exits non-zero and names the missing env var', () => {
  const env = { ...process.env };
  delete env.LEONARDO_API_KEY;
  assert.throws(
    () => execFileSync('node', [SCRIPT_PATH, '--live'], { cwd: REPO_ROOT, encoding: 'utf8', env }),
    (err) => {
      assert.notStrictEqual(err.status, 0, 'expected a non-zero exit code');
      assert.match(String(err.stderr), /LEONARDO_API_KEY/, 'expected stderr to name the missing env var');
      return true;
    }
  );
});

test('AC3: constructing the live client directly without LEONARDO_API_KEY throws naming the var, before any request is attempted', async () => {
  await withEnv('LEONARDO_API_KEY', undefined, async () => {
    let fetchCalled = false;
    const fetchImpl = async () => {
      fetchCalled = true;
      throw new Error('fetch should never be called when LEONARDO_API_KEY is missing');
    };
    assert.throws(
      () => createLeonardoArtClient({ fetchImpl }),
      /LEONARDO_API_KEY/,
      'expected construction to throw an error naming LEONARDO_API_KEY'
    );
    assert.strictEqual(fetchCalled, false, 'expected no request to be attempted before the missing-key error');
  });
});
