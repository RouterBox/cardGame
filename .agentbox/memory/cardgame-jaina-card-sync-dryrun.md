# cardgame-jaina-card-sync-dryrun

- merged: 2026-07-28T10:46:47.256Z
- intent: User directive (2026-07-28, verbatim, logged in design/ideas-inbox.md): "Oh also we need to make heavy use of Jaina the whole way which was built for this exact thing." ideas-inbox.md notes the authoring tools (card engine, design browser) should read from/write to Jaina rather than inventing their own storage, with markdown remaining the narrative/spec layer and Jaina holding the structured data layer. This is the first, deliberately narrow slice under that directive (T1 discipline: no decided schema exists yet, so this unit does not claim the full 'heavy use... the whole way' scope) — a dry-run sync tool, tools/sync-cards-to-jaina.js, that parses design/cards/*.md with the same field-prefix convention tools/render-card.js and tools/build-site.js already use, and prints the exact JSON record payloads a future live-sync step would write to a Jaina 'cards' schema. No live Jaina API calls are made by this unit — that follow-up is deferred until RouterBox reviews the printed schema shape, keeping this unit's acceptance checks network-free and deterministic under node --test. This is content-authoring tooling, not game implementation, so it falls within the T16 partial software-gate opening.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-jaina-card-sync-dryrun, cycle 1

## Diff summary
Two new files, matching plan.md verbatim:
- `tools/sync-cards-to-jaina.js` — dry-run NDJSON preview of the future Jaina `cards` record shape, sourced via the pre-existing shared parser `lib/parse-card-markdown.js` (not touched by this diff).
- `test/sync-cards-to-jaina.test.js` — tests for AC1–AC3 plus a held-out AC4 (byte-identical stdout across two runs).

No existing files are modified.

## AC verification

**AC1** (`--dry-run` exits 0, prints exactly one JSON object per card with name/slug/costLine/typeLine/rulesText/statsLine) — verified statically:
- `design/cards/` contains only `alpha-set.md` (confirmed via directory listing), so `loadAllCards()` reads exactly that file.
- `alpha-set.md` has exactly 18 `###` (level-3) headings (confirmed via grep), each formatted with `Cost line:`/`Type line:`/`Rules text:` as line-start prefixes (spot-checked), matching both the test's `listExpectedCards` filter and the real parser's stricter field-prefix logic in `lib/parse-card-markdown.js`.
- `buildRecord()` in the tool emits exactly the six required keys, one `console.log(JSON.stringify(...))` per card, nothing 
