# cardgame-render-engine-premium-layers

- merged: 2026-07-29T06:44:39.781Z
- intent: design/cards/card-anatomy.md (shipped)'s 'The Layers' section defines Base Treatment plus four premium layer swaps — Borderless, Foil, Alt-Art, Extended Art — each stating precisely what 'may change' and 'may not change' relative to Base, plus a Cohesion rule that the Name Slot, Cost Slot, Type Line, Rules-Text Box, and Stats Corner must carry identical content across every treatment. tools/render-card.js (shipped as part of cardgame-card-authoring-engine) is the deterministic layout engine T16 called for, reading card-anatomy.md's zone geometry as its input contract — but its renderCardSvg only ever produces the Base Treatment; there is no treatment parameter, CLI flag, or per-layer branch anywhere in the file, confirmed by test/render-card.test.js's AC5 asserting the script is layout-only. This unit adds a treatment parameter to renderCardSvg (default 'base', preserving today's exact output with no regression) plus 'borderless', 'foil', and 'extended-art' branches implementing exactly the mechanical rules card-anatomy.md already states: Borderless removes/shrinks the frame-band elements to a thin edge and expands the Art Window rect to the card's outer edge; Foil marks each frame-band element with a data-foil="true" attribute while leaving its x/y/width/height/fill identical to Base; Extended Art enlarges the Art Window rect upward to bleed behind the Name Slot's and Type Line's background bands while their text elements keep identical position and content. Alt-Art is explicitly out of scope — it swaps which illustration is composited, a concern of tools/composite-card-art.js's brief-selection step, not this deterministic layout engine, and is left for a follow-on unit. No card file, rules.md, or composite-card-art.js is touched; composite-card-art.js's own call sites keep calling renderCardSvg with no treatment argument and so keep producing Base Treatment output, unaffected by this change.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-render-engine-premium-layers, cycle 2

## Scope of diff

Two files touched, matching plan.md exactly:
- `tools/render-card.js`: adds `treatment` param to `renderCardSvg`, options
  objects to `renderFrameBands`/`renderArtWindow`, and three new branches
  (`borderless`, `foil`, `extended-art`).
- `test/render-card.test.js`: four new tests appended, existing tests
  untouched (these double as the AC1 regression guard).

No card file, `rules.md`, or `composite-card-art.js` touched. No other
files appear in the diff.

## Carried over from cycle 1

Cycle 1's findings.md flagged (non-blocking) that the `borderless`
treatment's full-bleed art window was painted *after* the frame bands and
so fully occluded the shrunk 8px-total "thin edge," making it invisible in
practice even though AC2's literal DOM-attribute checks still passed. This
cycle's diff changes the borderless layer order to
`[artWindow, frameBands, nameSlot, typeLine, rulesTextBox, costPips]` —
the art window now paints *first* and frame bands paint *after* (on top),
with a code comment explicitly calling this out: "its full-bleed Art
Window must sit *behind* the thin frame edge, not in front of it, o
