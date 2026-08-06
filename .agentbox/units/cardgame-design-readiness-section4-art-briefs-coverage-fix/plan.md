GATE: none

# Plan: cardgame-design-readiness-section4-art-briefs-coverage-fix

## Summary

`design/DESIGN-READINESS.md` Section 4 ("Card Anatomy & Art Brief Coverage")
has two stale claims:

1. The `art-briefs.md` coverage bullet says "44 art-brief sections" and lists
   only 6 covered files (missing `wormhole-closure-cards.md` and
   `spatial-race-identity-set.md`).
2. The "Known gap" bullet claims those same two files' 8 cards
   (3 + 5) have no brief yet.

Both are now false. Verified on disk (`grep -c "^### " design/cards/art-briefs.md`)
that `art-briefs.md` currently has **52** `###` sections, across **8** files
(the original 6 plus the two now-covered sets). Section 6 ("Open Gaps") of
the same document has *already* been updated by a prior merged unit to say
Open Gap 1 is resolved — Section 4 just wasn't updated to match. This unit
brings Section 4 in line with Section 6 and with reality.

This is a pure prose edit to two bullets in one file. No code, no tests to
write — the existing test suite has no assertion pinned to the old "44" text
or the old 6-file list (confirmed by reading `test/design-readiness.test.js`
in full), so nothing needs updating there.

## Risk assessment (FIRE)

- **Reversibility**: trivial — a markdown text edit, fully reversible via git.
- **Security impact**: none.
- **User data**: none.
- **Schema changes**: none.

Low risk, well-scoped. `GATE: none`.

## Exact edit

File: `design/DESIGN-READINESS.md`

Locate this exact block (currently at lines 123–134, but match on text, not
line number, in case the file has shifted by the time this bolt runs):

```
- **`design/cards/art-briefs.md`** — 44 art-brief sections, covering every
  card in `alpha-set.md`, `frontier-set.md`, `character-signatures.md`,
  `character-signatures-wave-2.md`, `fount-economy-set.md`, and
  `wormhole-restrictions-set.md`.
- **`design/cards/alt-art-briefs.md`** — 5 alternate-art briefs for the
  fount Generators (Sporeknit Warden, Salvage-Wrought Bastion, Replicant
  Foundry Core, Foreknowledge Cipher, Unwritten Hour).
- **Known gap:** the 3 cards in `spatial-race-identity-set.md` and the 5
  cards in `wormhole-closure-cards.md` (8 cards total) have no brief in
  `art-briefs.md` yet. `tools/composite-card-art.js` already surfaces this
  live via a `no art brief for "<name>"` warning on every run (see Open Gap
  1 below).
```

Replace it with:

```
- **`design/cards/art-briefs.md`** — 52 art-brief sections, covering every
  card in `alpha-set.md`, `frontier-set.md`, `character-signatures.md`,
  `character-signatures-wave-2.md`, `fount-economy-set.md`,
  `wormhole-restrictions-set.md`, `wormhole-closure-cards.md`, and
  `spatial-race-identity-set.md`.
- **`design/cards/alt-art-briefs.md`** — 5 alternate-art briefs for the
  fount Generators (Sporeknit Warden, Salvage-Wrought Bastion, Replicant
  Foundry Core, Foreknowledge Cipher, Unwritten Hour).
- **Known gap — resolved:** the 3 cards in `spatial-race-identity-set.md`
  and the 5 cards in `wormhole-closure-cards.md` (8 cards total) previously
  had no brief in `art-briefs.md`; both sets are now fully covered, closed
  by the merged units `cardgame-art-briefs-wormhole-closure` and
  `cardgame-art-briefs-spatial-race-identity` (see Open Gap 1 in Section 6
  below, which already reflects this).
```

### What changed, precisely

- Coverage bullet: `44` → `52`; file list gains `wormhole-closure-cards.md`
  and `spatial-race-identity-set.md` (comma-joined, "and" before the last
  item, matching the existing list's style — note the list is now 8 items
  so it needs an extra line wrap, shown above).
- "Known gap" bullet: reworded from an open-gap claim to a resolved-gap
  note, still naming both files and both card counts (3 and 5) so a reader
  scanning history understands what was closed, but no longer asserting
  they lack briefs. Cites both merged unit names, matching the unit spec's
  instruction.

### Do NOT touch

- Section 3's card-set inventory (lines ~62–108, the "Card Sets & Waves"
  section with the "Total: 54 named cards across 9 files" line). Leave
  byte-for-byte identical.
- Section 6's "Open Gaps & Unresolved Questions" list (the "Resolved —
  art-brief coverage..." Open Gap 1 entry and everything else in that
  section). Leave byte-for-byte identical — it is already correct and is
  the subject of two other in-flight proposals.
- Every other section, and every other bullet within Section 4 (the
  `card-anatomy.md` bullet stays untouched).

## How to apply (junior instructions)

1. Open `design/DESIGN-READINESS.md`.
2. Find the three-bullet block quoted above under "Locate this exact
   block" (it's the last three bullets of Section 4, "## 4. Card Anatomy &
   Art Brief Coverage").
3. Replace it with the "Replace it with" block above, verbatim (preserve
   the `- **bold-title**` markdown bullet style and the 2-space continuation
   indent used throughout this document for wrapped bullet lines).
4. Do not change anything else in the file — no other bullet, section
   heading, or whitespace outside this block.
5. Save.

## Verification

Run:

```
node --test
```

Expected output: all existing test files pass, same pass count as before
this change (no test in the repo currently asserts the old "44" text or the
old 6-file list — confirmed by reading `test/design-readiness.test.js`,
`test/design-readiness-gap1-resolved.test.js`, and
`test/design-readiness-gap2-resolved.test.js` in full — so none of them can
newly fail from this edit). Look for a final line like:

```
# pass 958
# fail 0
```

(exact pass count may differ slightly by the time this bolt runs, depending
on what else has merged — the acceptance bar is `# fail 0`, not a specific
count).

Additionally, spot-check by hand (not a new automated test — the unit does
not ask for one, and adding one would be scope creep beyond a doc-prose
fix):

- `grep -n "44 art-brief" design/DESIGN-READINESS.md` → no match.
- `grep -n "52 art-brief" design/DESIGN-READINESS.md` → one match, inside
  Section 4.
- `grep -n "wormhole-closure-cards.md" design/DESIGN-READINESS.md` → now
  appears in Section 3, Section 4's coverage bullet, Section 4's Known-gap
  note, and Section 6 (four occurrences total, up from three before this
  change).
- `git diff design/DESIGN-READINESS.md` → touches only the one block in
  Section 4; no other lines in the diff.

## Acceptance-criteria mapping

- AC1: satisfied by the coverage bullet's file list gaining both names.
- AC2: satisfied by `44` → `52` in that same bullet.
- AC3: satisfied by rewording the "Known gap" bullet to no longer claim any
  card lacks a brief.
- AC4 (held_out): satisfied by leaving Section 3 and Section 6 untouched —
  verify with `git diff` showing changes confined to the Section 4 block
  above.
- AC5: satisfied because no existing test is pinned to the old text (see
  Verification section); `node --test` must still show `# fail 0`.

## Note on held-out AC4

AC4 is redundant with the unit spec's own explicit instruction ("Do not
touch Section 3's card-set inventory, Section 6's Open Gaps list ... or any
other section's substance") — it is not a novel requirement, just the
held-out phrasing of the same constraint. No spec-bug flag needed.
