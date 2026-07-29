'use strict';
const test = require('node:test');
const assert = require('node:assert');

const { createJainaClient, DEFAULT_API_BASE_URL } = require('../lib/jaina-client');

// ---------------------------------------------------------------------------
// All tests drive lib/jaina-client.js through a mocked global.fetch — no real
// network call is ever made (AC2). The mock records every call so assertions
// can verify the exact contract: one list GET per client instance, then
// PUT /records/{uuid} for existing records and POST /records for new ones.
// ---------------------------------------------------------------------------

function jsonResponse(body) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

function errorResponse(status, statusText, body = '') {
  return {
    ok: false,
    status,
    statusText,
    json: async () => ({}),
    text: async () => body,
  };
}

// Routes list GETs and record PUT/POSTs to canned responses, recording calls.
function installMockFetch(t, { listRecords = [], mutateResponse } = {}) {
  const calls = [];
  const originalFetch = global.fetch;
  global.fetch = async (url, opts = {}) => {
    const method = (opts.method || 'GET').toUpperCase();
    calls.push({ url: String(url), method, headers: opts.headers || {}, body: opts.body });
    if (method === 'GET') return jsonResponse({ data: listRecords });
    if (mutateResponse) return mutateResponse({ url: String(url), method });
    return jsonResponse({ id: 'created-id' });
  };
  t.after(() => {
    global.fetch = originalFetch;
  });
  return calls;
}

test('createJainaClient requires apiKey and projectId', () => {
  assert.throws(() => createJainaClient({ projectId: 'p' }), /apiKey/);
  assert.throws(() => createJainaClient({ apiKey: 'k' }), /projectId/);
});

test('upsert of an existing record: one list GET, then PUT to /records/{uuid} with bearer auth and flat body', async (t) => {
  const calls = installMockFetch(t, {
    listRecords: [{ id: 'uuid-123', data: { name: 'Aegis Vanguard' } }],
  });
  const client = createJainaClient({ apiKey: 'test-key', projectId: 'cardgame', baseUrl: 'https://jaina.test/api/v1' });

  await client.upsert({ name: 'Aegis Vanguard', slug: 'aegis-vanguard', costLine: '2 Mass' });

  assert.strictEqual(calls.length, 2, 'expected exactly one list GET and one PUT');

  const [list, put] = calls;
  assert.strictEqual(list.method, 'GET');
  assert.ok(
    list.url.startsWith('https://jaina.test/api/v1/projects/cardgame/schemas/card/records'),
    `expected list URL under .../projects/cardgame/schemas/card/records, got ${list.url}`
  );
  assert.ok(list.url.includes('package_slug=alpha'), 'expected list to filter by package_slug=alpha');
  assert.strictEqual(list.headers.Authorization, 'Bearer test-key');

  assert.strictEqual(put.method, 'PUT');
  assert.strictEqual(
    put.url,
    'https://jaina.test/api/v1/projects/cardgame/schemas/card/records/uuid-123',
    'expected the update to address the record by its UUID id from the list response — there is no update-by-slug endpoint'
  );
  assert.strictEqual(put.headers.Authorization, 'Bearer test-key');
  const body = JSON.parse(put.body);
  assert.strictEqual(body.package_slug, 'alpha');
  assert.strictEqual(body.name, 'Aegis Vanguard');
  assert.strictEqual(
    body.cost_line,
    '2 Mass',
    'expected record fields translated to the card schema\'s snake_case slugs (cost_line/type_line/rules_text/stats_line), flat at the top level'
  );
  assert.strictEqual(body.costLine, undefined, 'camelCase repo-side names must not reach the wire');
  assert.strictEqual(body.slug, undefined, 'the card schema has no slug field — slug stays repo-side');
});

test('upsert of a never-before-seen record: POST to /records, and the returned id joins the index', async (t) => {
  const calls = installMockFetch(t, {
    listRecords: [],
    mutateResponse: ({ method }) =>
      method === 'POST' ? jsonResponse({ id: 'new-uuid-9' }) : jsonResponse({ id: 'new-uuid-9' }),
  });
  const client = createJainaClient({ apiKey: 'k', projectId: 'cardgame', baseUrl: 'https://jaina.test/api/v1' });

  await client.upsert({ name: 'Fresh Card', slug: 'fresh-card' });
  const post = calls[1];
  assert.strictEqual(post.method, 'POST');
  assert.strictEqual(post.url, 'https://jaina.test/api/v1/projects/cardgame/schemas/card/records');

  // Upserting the same name again must now PUT to the id the POST returned.
  await client.upsert({ name: 'Fresh Card', slug: 'fresh-card' });
  const second = calls[2];
  assert.strictEqual(second.method, 'PUT');
  assert.ok(second.url.endsWith('/records/new-uuid-9'), `expected PUT to the created id, got ${second.url}`);
});

test('the record list is fetched once per client instance, not once per upsert', async (t) => {
  const calls = installMockFetch(t, {
    listRecords: [
      { id: 'id-a', data: { name: 'Card A' } },
      { id: 'id-b', data: { name: 'Card B' } },
    ],
  });
  const client = createJainaClient({ apiKey: 'k', projectId: 'cardgame' });

  await client.upsert({ name: 'Card A' });
  await client.upsert({ name: 'Card B' });

  const gets = calls.filter((c) => c.method === 'GET');
  assert.strictEqual(gets.length, 1, 'expected the name->id index list to be fetched exactly once');
});

test('defaults to the real jaina.dev base URL when none is injected', async (t) => {
  const calls = installMockFetch(t, { listRecords: [] });
  const client = createJainaClient({ apiKey: 'k', projectId: 'cardgame' });
  await client.upsert({ name: 'Anything' });
  assert.strictEqual(DEFAULT_API_BASE_URL, 'https://jaina.dev/api/v1');
  assert.ok(
    calls[0].url.startsWith('https://jaina.dev/api/v1/'),
    `expected default base URL jaina.dev/api/v1, got ${calls[0].url}`
  );
});

test('a failed list or upsert response surfaces a clear error instead of a silent no-op', async (t) => {
  installMockFetch(t, { listRecords: [] });
  // First: failed list.
  global.fetch = async () => errorResponse(401, 'Unauthorized', 'bad key');
  const client = createJainaClient({ apiKey: 'wrong', projectId: 'cardgame' });
  await assert.rejects(() => client.upsert({ name: 'X' }), /401/);

  // Then: good list, failed mutate.
  let call = 0;
  global.fetch = async () => {
    call++;
    if (call === 1) return jsonResponse({ data: [] });
    return errorResponse(500, 'Internal Server Error', 'boom');
  };
  const client2 = createJainaClient({ apiKey: 'k', projectId: 'cardgame' });
  await assert.rejects(() => client2.upsert({ name: 'X' }), /500/);
});
