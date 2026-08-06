name: cardgame-art-compositing-dryrun
title: cardGame tool — mocked art-compositing pass fills the Art Window from the written briefs
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

T16 named the art-compositing step explicitly: 'Leonardo/gen-AI produces ONLY the art-window image, composited into its slot, because generators can't do text/symbols or hold a style across runs.' The layout engine (cardgame-card-authoring-engine) already renders every other zone from data and leaves the Art Window a placeholder rectangle for exactly this follow-up. This unit builds tools/composite-card-art.js: it reads design/cards/art-briefs.md, turns each brief into a generation request, and replaces the Art Window placeholder with an <image> element sized to the Art Window bounds from design/cards/card-anatomy.md. The art-generation call goes through an injectable client interface so the default path (and the whole test suite) uses a deterministic mock and makes zero real Leonardo API calls or spend — mirroring the dry-run-before-live pattern the ledger already validated for the Jaina sync tool (T17/T19/T20), so wiring a real Leonardo key stays a separate, later decision rather than bundled into this unit.

## Acceptance Criteria

- AC1 [user]: tools/composite-card-art.js exists; running `node tools/composite-card-art.js` exits 0 and writes exactly one composited SVG per brief section in design/cards/art-briefs.md into renders/cards-composited/.
- AC2 [paraphrase]: Each composited SVG's Art Window slot contains an <image> element (not the placeholder rect) positioned and sized to match the Art Window bounds defined in design/cards/card-anatomy.md.
- AC3 [inferred]: Image generation goes through an injectable client; the default/test client is a deterministic mock that makes no network calls and requires no Leonardo API key, so `node --test` runs fully offline.
- AC4 [inferred] (held_out): Running the script twice in a row with the mock client produces byte-identical output across all composited SVGs, verifiable by hashing.
