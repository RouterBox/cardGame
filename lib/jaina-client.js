'use strict';

// ---------------------------------------------------------------------------
// Live Jaina client — the only place in this repo allowed to make a real
// network call to Jaina. tools/sync-cards-to-jaina.js never calls fetch()
// itself; it always goes through the upsert(record) seam below so the
// acceptance test suite can swap in a fake client and stay network-free.
//
// Base URL / auth / schema+package slugs verified against the Jaina server
// source and SDK by the orchestrator (see unit feedback) — this is the real
// contract, not a placeholder. Jaina's record API has no update-by-slug
// endpoint: records are only addressable by their UUID `id`, so upsert()
// lists the schema/package once (filtered by the card's unique `name`
// field), caches a name->id index on the client instance, and then PUTs an
// existing id or POSTs a new record accordingly.
// ---------------------------------------------------------------------------

const DEFAULT_API_BASE_URL = 'https://jaina.dev/api/v1';
const SCHEMA_SLUG = 'card';
const PACKAGE_SLUG = 'alpha';

function createJainaClient({ apiKey, projectId, baseUrl } = {}) {
  if (!apiKey) throw new Error('createJainaClient requires apiKey');
  if (!projectId) throw new Error('createJainaClient requires projectId');

  const resolvedBaseUrl = baseUrl || process.env.JAINA_API_BASE_URL || DEFAULT_API_BASE_URL;
  const recordsUrl = `${resolvedBaseUrl}/projects/${encodeURIComponent(projectId)}/schemas/${SCHEMA_SLUG}/records`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  // Lazily fetches the full record list for this schema/package exactly
  // once per client instance, then reuses the cached name->id index for
  // every subsequent upsert() call — this is the "list once" batching the
  // real contract calls for, instead of a list call per card.
  let indexPromise = null;
  async function loadNameIndex() {
    if (!indexPromise) {
      indexPromise = (async () => {
        const url = `${recordsUrl}?package_slug=${encodeURIComponent(PACKAGE_SLUG)}`;
        const res = await fetch(url, { headers });
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          throw new Error(
            `Jaina record list failed for project "${projectId}" (${res.status} ${res.statusText}): ${body}`
          );
        }
        const body = await res.json();
        const records = Array.isArray(body.data) ? body.data : [];
        const index = new Map();
        for (const rec of records) {
          const name = rec && rec.data && rec.data.name;
          if (name) index.set(name, rec.id);
        }
        return index;
      })();
    }
    return indexPromise;
  }

  async function upsert(record) {
    const index = await loadNameIndex();
    const existingId = index.get(record.name);
    const body = JSON.stringify({ package_slug: PACKAGE_SLUG, ...toWireFields(record) });

    const res = await fetch(
      existingId ? `${recordsUrl}/${encodeURIComponent(existingId)}` : recordsUrl,
      { method: existingId ? 'PUT' : 'POST', headers, body }
    );

    if (!res.ok) {
      const responseBody = await res.text().catch(() => '');
      throw new Error(
        `Jaina upsert failed for "${record.name}" (${res.status} ${res.statusText}): ${responseBody}`
      );
    }

    const result = await res.json();
    if (!existingId && result && result.id) {
      index.set(record.name, result.id);
    }
    return result;
  }

  return { upsert };
}

// Translates a buildRecord() record (the repo-side camelCase shape the
// dry-run prints and every test asserts on) into the cardgame `card`
// schema's actual field slugs, verified live against the deployed schema
// (jaina_get_schema_fields, 2026-07-29): name, cost_line, type_line,
// rules_text, stats_line. The schema has no `slug` field — the record's
// slug stays repo-side only — and optional stats_line is omitted when null
// rather than sent as an explicit null.
function toWireFields(record) {
  const wire = {
    name: record.name,
    cost_line: record.costLine,
    type_line: record.typeLine,
    rules_text: record.rulesText,
  };
  if (record.statsLine !== null && record.statsLine !== undefined) {
    wire.stats_line = record.statsLine;
  }
  return wire;
}

module.exports = { createJainaClient, DEFAULT_API_BASE_URL };
