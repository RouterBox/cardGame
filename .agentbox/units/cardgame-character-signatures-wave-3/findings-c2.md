# Review — cardgame-character-signatures-wave-3, cycle 2

## Scope of the diff

- New file `design/cards/character-signatures-wave-3.md` (93 lines) — matches plan.md's
  Step 1 content byte-for-byte (verified by direct read).
- `design/DESIGN-READINESS.md` — two edits: adds the Wave 3 bullet to the card-set list,
  and updates the "Total: 54 named cards across 9 files" line to "59 across 10 files".
  Recomputed independently by counting `### ` headings in every `design/cards/*.md` file
  that isn't a brief/spec doc (`alpha-set` 18 + `frontier-set` 5 + `character-signatures`
  5 + `-wave-2` 5 + `-wave-3` 5 + `spatial-race-identity-set` 3 + `-wave-2` 2 +
  `wormhole-closure-cards` 5 + `wormhole-restrictions-set` 5 + `fount-economy-set` 6 = 59
  across 10 files). Matches exactly. This edit is explicitly called out in plan.md Step 3
  as necessary to keep `test/design-readiness.test.js` passing, and `DESIGN-READINESS.md`
  is not one of the unit's protected files (only `character-signatures.md`,
  `character-signatures-wave-2.md`, `design/characters/*`, and other card sets are
  off-limits) — in scope.
- `renders/cards/*.svg` (5 new files, one per new card) — consistent with precedent:
  every character from waves 1 and 2 has a matching SVG already checked in under
  `renders/cards/`.
- `site/**` — full regen output: new `character-signatures-wave-3.html`, updated
  `cards-index.html`, `site/index.html`, `DESIGN-READINESS.html`, and nav-sibling-list
  updates in every other `site/design/cards/*.html` page. This is what a repo-wide
  `tools/build-site.js` run produces; no hand-edited content changes to unrelated sets.
- Confirmed via `git diff cbe9e5e^ cbe9e5e --name-only`: `character-signatures.md`,
  `character-signatures-wave-2.md`, `design/characters/*.md`, and every other
  `design/cards/*.md` file are absent from the diff — byte-for-byte unchanged.

## AC-by-AC

**AC1** (file exists, exactly 5 cards, one per race) — met. The file has 5 H3 cards under
5 H2 race sections, one per file under `design/races/` (Cindral Reach, Mireth Bloom,
Panoptic Concord, Starweave Communion, Wrought Assembly). Verified each card's combined
rules+flavor text contains its own race's exact `# The X` title string once, and only
once across all 5 cards (no cross-contamination between "Bloom-claimed debris field"
style incidental word use and the full race-title strings the test matches on).

**AC3** (no character reused across the three files) — met. The five characters used
(Bren Hollowmelt, Vesk-Aduun, Ilio Marn-Cassity, Ossian Thale, Replica-Sergeant Kess
Ninefold) are drawn from the "still-uncarded" pool the spec names for each race, none of
which overlap the ten characters plan.md lists as already signed by waves 1–2. Verified
against `design/characters/*.md`: each character's exact name (as parsed from its own
`## Name — Role` heading) appears exactly once in its card's rules+flavor text, with no
other roster name appearing as an accidental substring (e.g. Kess's flavor text
references "an Iron-Choir enforcer" and "a Reach salvage crew" — role/race color, not the
literal character or race-title strings the test matches against).

**AC4** (Cost line names race's Fount, template field order) — met for all 5 cards:
Cindral Reach → 3 Mass / Materials — Permanent; Mireth Bloom → 3 Bloom / Biology —
Permanent; Panoptic Concord → 2 Signal / Intelligence (no Permanent, correct per Section
9.4); Starweave Communion → 3 Tangle / Magic (no Permanent, correct per Section 9.2);
Wrought Assembly → 2 Circuit / Technology — Permanent. Field order is Cost line → Type
line → Rules text → (optional) Stats/counters line in every card, and the
Stats/counters line is present only on the three Permanent cards, absent on the two
non-Permanents — matches `test/helpers/card-template.js`'s checks.

**AC5** (site regenerated, other files untouched) — met.
`site/design/cards/character-signatures-wave-3.html` exists and its content is a direct
render of the new markdown. `character-signatures.md`, `character-signatures-wave-2.md`,
and every `design/characters/*.md` file do not appear in the diff at all — confirmed
unchanged.

## Findings

None. No INTRODUCED issues found; the diff is a clean, template-conformant
implementation that matches plan.md exactly and stays within the stated scope.

APPROVE
