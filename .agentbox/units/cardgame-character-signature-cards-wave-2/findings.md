# Blind Review — cardgame-character-signature-cards-wave-2, cycle 3

## AC coverage

**AC1** — `design/cards/character-signatures-wave-2.md` exists, contains exactly
5 H3 card sections (verified: Torel Ashgrave / Rathe Ossuary-Kin / Doran Vex
Amaranthine / Ysolde Thane / Foreman-Prime Yssa Ductile), one per race file
under `design/races/` (Cindral Reach, Mireth Bloom, Panoptic Concord,
Starweave Communion, Wrought Assembly — confirmed by grepping the `# The X`
H1 in each race file). None of the 5 full card-heading names collides with
any of the 5 wave-1 card names in `design/cards/character-signatures.md`
(spot-checked both files directly). **Satisfied.**

**AC2** — Every new card has Cost line → Type line → Rules text in that
order (verified against the raw markdown for all 5 cards). Stats/counters
lines appear only on the two Permanent Unit cards (Torel Ashgrave —
Materials/Permanent/Unit; Rathe Ossuary-Kin — Biology/Permanent/Unit); the
Technology/Permanent Generator card (Foreman-Prime) correctly omits it,
matching rules.md §9.3's own "Foundry Works" example (Permanent Generator,
no stats line) and §9.6's "Materials may be Generator, Unit, or neither."
The two non-Permanent cards (Doran — Intelligence, Ysolde — Magic) correctly
carry no Stats line, matching §9.2/§9.4 ("never a Permanent"). **Satisfied.**

**AC3** — Cross-checked all 5 characters against `design/characters/*.md`:
Torel Ashgrave (cindral-reach.md), Rathe Ossuary-Kin (mireth-bloom.md), Doran
Vex Amaranthine (panoptic-concord.md), Ysolde Thane (starweave-communion.md),
Foreman-Prime Yssa Ductile (wrought-assembly.md) — each is a real, named
character from that race's own file, and none is the character wave 1
already used for that race (Kordelia Vess, Mother-Thread Ilvex, Selin Vashti
Corr, Meridian Aule, Unit 0-Prime "Cast-Aside" respectively — confirmed
distinct). Each card's rules text + flavor text names its own race's exact
title string (e.g. "The Cindral Reach has never used hard enough") and its
character's name, verified by direct read of all 5 cards' prose. No
cross-contamination (no card's text accidentally names a second race or a
second character). **Satisfied.**

**AC4 (held out, not directly gated)** — `design/cards/character-signatures.md`
and `test/design-signature-cards.test.js` are absent from the diff entirely
(byte-identical, confirmed no hunks touch them). `design/characters/*.md`
and `design/races/*.md` are likewise untouched by this diff (read-only
lookups by the new test). Held-out AC respected.

## Other diff contents

- `renders/cards/*.svg` (5 new files) and `site/design/cards/*.html` (nav
  sibling-link updates across existing pages + new
  `character-signatures-wave-2.html`) + `site/index.html` — these match the
  repo's existing generated-asset convention: wave-1 cards
  (`kordelia-vess-...svg`, etc.) already live in `renders/cards/`, and
  `tools/build-site.js` / `tools/render-card.js` exist to regenerate exactly
  this kind of output from `design/cards/*.md`. The diff only adds a sibling
  nav link to already-shipped HTML pages (e.g.
  `site/design/cards/character-signatures.html`'s only change is one nav
  line); no shipped page's own content/body changed. Treated as expected
  build output, not a hand-edit risk.
- `test/design-signature-cards-wave-2.test.js` is a new, self-contained test
  file; it does not modify `test/helpers/markdown.js` or
  `lib/parse-card-markdown.js` (both reused as-is, matching plan.md).

## Findings

None. No INTRODUCED defects found. Static verification (file reads, greps,
regex tracing of the new test's assertions against the actual character/race
files) all confirm the shipped content and test logic are internally
consistent and satisfy all 3 visible ACs.

Note: I was unable to execute `node --test` in this session (shell commands
require interactive approval that wasn't granted), so this review relies on
manual/static tracing of the test file's logic against the actual repo
content rather than an actual green test run. The tracing was thorough
(every card's fields, every race title, every character name, every
cross-file collision check was hand-verified against source files), and
nothing in that tracing suggests a failing assertion.

## Verdict

APPROVE
