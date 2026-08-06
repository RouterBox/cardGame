## Devil's Advocate — cardgame-jaina-card-sync-live

**Attack: the "upsert" doesn't match Jaina's real record contract, and the diff's own comment admits it.**

`lib/jaina-client.js` sends `PUT {base}/projects/{projectId}/schemas/card/records/{record.slug}` and treats a 2xx as success. But Jaina's actual records API (confirmed against the live `jaina` MCP tool schemas, not speculation):

- `jaina_update_record` and `jaina_get_record` are keyed by `record_id`, explicitly documented as a **"Record UUID"** — there is no update/get-by-slug endpoint.
- `jaina_list_records` supports `filter: { field_slug: value }` (e.g. filter by `slug`) specifically because you're expected to look up a record's UUID before you can update it.
- `jaina_create_record` is a separate operation entirely (no upsert primitive exists).

So the "list-then-create flow Jaina's contract requires for a never-before-seen record" that the diff's own comment in `lib/jaina-client.js` (lines ~14-19) explicitly calls out as *skipped* isn't just missing for new cards — it's missing for the lookup step every update needs, new or existing. A raw `PUT .../records/{slug}` is very likely hitting a URL Jaina's real API doesn't serve at all (slug ≠ record_id), which means this "real Jaina upsert" is likely to fail on **every card**, not just first-time ones.

This is invisible to the acceptance suite by design: AC2 requires the test to fake `fetch` and never touch a real host, so nothing in `test/jaina-client.test.js` or `test/sync-cards-to-jaina.test.js` exercises whether the URL shape is one Jaina actually serves — the tests only confirm the code calls *a* URL with the right substrings, not a *correct* one. The intent explicitly promises "performs a real Jaina upsert" instead of the dry-run stub; what shipped is a same-shape-as-dry-run PUT that the diff's own comment admits is scoped to "the tool's real usage" (all cards already exist) rather than a general upsert, and that assumption isn't backed by any lookup call to obtain the record UUID the real API requires.

This is a correctness defect fully introduced by this diff (`lib/jaina-client.js` and its call sites are new), it's concrete (verified against the actual Jaina API surface, not hypothetical), and it undermines the primary promised capability (AC1: "performs a real Jaina upsert") for the tool's actual future use — syncing newly-authored or re-slugged cards, which is the entire point of "sync."

NEEDS_WORK