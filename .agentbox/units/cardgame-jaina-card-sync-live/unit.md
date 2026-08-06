name: cardgame-jaina-card-sync-live
title: cardGame tool — live sync of card records to Jaina (extends dry-run tool, slice 2)
project: cardgame
risk_class: security
mode: autopilot
test_cmd: node --test

## Intent

Extend tools/sync-cards-to-jaina.js (added by cardgame-jaina-card-sync-dryrun) so the non-dry-run path performs a real Jaina upsert instead of printing 'not yet implemented' and exiting 1, continuing ideas-inbox.md's 'make heavy use of Jaina the whole way' directive now that the dry-run schema shape has been reviewed. This is content-authoring/presentation tooling (feeding the Jaina-backed design shelf), not gameplay software, so it stays inside the T16 gate opening. Live Jaina calls go through a small injectable client module (lib/jaina-client.js) so the acceptance suite (node --test) can verify the upsert path deterministically with a fake client and never needs real network access or credentials to pass.

## Acceptance Criteria

- AC1 [paraphrase]: Without --dry-run, the script calls an injectable Jaina client's upsert function once per parsed card record, then prints a one-line summary (e.g. record count synced) and exits 0 on success; the production client is constructed only when JAINA_API_KEY and JAINA_PROJECT_ID are both present in the environment.
- AC2 [inferred]: node --test exercises the live-sync (non-dry-run) code path using a fake/injected Jaina client — no require('http'), require('https'), or fetch() call reaches an external host during the test run, keeping the suite network-free and deterministic like every other unit in this repo.
- AC3 [inferred]: If JAINA_API_KEY or JAINA_PROJECT_ID is missing when the script is invoked without --dry-run, it exits 1 and prints a clear 'Jaina credentials not configured' message instead of throwing an unhandled exception or silently no-op'ing.
- AC4 [inferred] (held_out): --dry-run mode's output and behavior are unchanged byte-for-byte from the merged dry-run unit (same NDJSON records, still makes zero client/network calls) — this unit only adds behavior to the no-flag path.
