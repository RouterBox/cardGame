# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T11:05:00.000Z] **resolution:retired** — orchestrator: scope conflict with cardgame-jaina-card-sync-dryrun (both claim tools/sync-cards-to-jaina.js with incompatible ACs — dryrun's AC3 requires no-flag invocation to exit 1 'not yet implemented'; this unit requires the same invocation to live-upsert). The dryrun unit launched first and is the right sequencing (dry-run before live writes). Producer should re-file the live-sync step AFTER dryrun merges, specced as extending the existing tool (replacing the exit-1 stub with the live path) rather than contradicting it.
