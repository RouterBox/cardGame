# cardgame-card-authoring-engine

- merged: 2026-07-28T07:56:59.490Z
- intent: Build the deterministic card authoring engine named in T16: layout code that renders every structured element of a card (frame/border, name slot, cost slot, art window, type line, rules-text box, stats corner) from card data, per design/cards/card-anatomy.md's skeleton, variables, and worked examples. This unit covers layout only — no image generation or art compositing; the Art Window renders as a placeholder rectangle, holding the slot that a future unit will fill by compositing a generated illustration. A single Node script, zero npm dependencies (matching tools/build-site.js's existing pattern), parses card records from design/cards/*.md using the field-prefix convention already used in alpha-set.md (Cost line / Type line / Rules text / Stats/counters line, under ### card-name headings), and renders each as a deterministic, self-contained SVG file. Frame/Border color(s) follow the Fount identity table in card-anatomy.md, split into ordered vertical bands for multi-Fount costs. The Stats Corner is present only for Permanents whose template carries a Stats/counters line, and is omitted entirely (not blank) otherwise, per the anatomy doc's explicit rule. This is authoring/presentation tooling under the T16 bright line — it renders card data, it does not implement or simulate any game rule.
- criteria: AC1, AC2, AC3, AC4, AC5, AC6 (1 held out)

## Reviewer notes worth keeping

# Review Findings — cardgame-card-authoring-engine, cycle 1

## Scope reviewed
- `tools/render-card.js` (new, 410 lines) — matches plan.md's literal script content verbatim.
- `renders/cards/*.svg` (18 new files, one per card in `design/cards/alpha-set.md`).
- `test/render-card.test.js` (new, pre-existing from prior commit `3aa43b8`, included in the unit's overall diff).

## AC accounting

- **AC1** (exits 0, exactly one SVG per alpha-set.md card): `design/cards/alpha-set.md` contains exactly 18 `###` sections, all carrying `Cost line:`/`Type line:`/`Rules text:` as line-start fields, and `renders/cards/` contains exactly 18 `.svg` files whose slugified names match all 18 card titles 1:1 (verified by direct name/slug comparison, not just count). `loadAllCards()` also scans `design/cards/card-anatomy.md` (the only other file in the directory), but grepping that file confirms no line starts with `Cost line:`/`Type line:`/`Rules text:`/`Stats/counters line:` — its Worked Examples describe fields in prose ("Sporeknit Warden is printed ... with Cost line \"3 Bloom\"...") rather than as line-start fields, so it correctly contributes zero card records. Script logic is fully synchronous wi
