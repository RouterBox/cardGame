# cardgame-art-live-leonardo-client

- merged: 2026-07-28T23:38:38.325Z
- intent: Extend the Alpha set's card-art compositing tool with a real, opt-in Leonardo-backed art-generation client behind the same injectable generateArt seam the dry-run unit built, so the 18 approved art briefs in design/cards/art-briefs.md can produce actual illustrated card art instead of mock color swatches, while the default (no-flag) path keeps making zero network calls and needing no API key.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-art-live-leonardo-client, cycle 3

## AC coverage

- **AC1** (`--live` builds a `LeonardoArtClient`, one POST `/generations` per brief, `Bearer` auth from `LEONARDO_API_KEY`, mock-transport-tested): `lib/leonardo-art-client.js`'s `createLeonardoArtClient()` reads `LEONARDO_API_KEY` at construction and throws if absent; `generateArt()` issues exactly one `POST {GENERATIONS_URL}` with `authorization: Bearer <key>` and a prompt embedding `cardName`/`brief`, then polls `GET .../{id}` (injectable `fetchImpl`/`sleepImpl`, no real network/timers) until `COMPLETE`. `runCli()` wires `--live` to construct this client. `test/leonardo-art-client.test.js` asserts exactly one POST, the Bearer header, prompt content, and (via `runCli(['--live'])` against a mock transport) one POST per brief in `art-briefs.md`. **Met.**
- **AC2** (no `--live`: unchanged mock path, no env read, byte-identical `renders/cards-composited/` output): `runCli()` only builds the live client when `argv.includes('--live')`; the default path still runs `createMockLeonardoClient()` via `main()`, unmodified. A test asserts `git status --porcelain -- renders/cards-composited` is empty after a default r
