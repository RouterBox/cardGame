# cardgame-art-briefs-spatial-race-identity

- merged: 2026-07-30T09:54:51.686Z
- intent: design/cards/art-briefs.md documents an art brief for every card in most shipped card sets, but design/cards/spatial-race-identity-set.md's 3 cards (Preemptive Survey — Panoptic Concord, Unbound Passage — Starweave Communion, Chokepoint Garrison — Cindral Reach) have none. DESIGN-READINESS.md's Open Gap 1 names this hole explicitly, and tools/composite-card-art.js already surfaces it live via its own 'no art brief for "<name>"' warning on every run. Add one brief per card, following the established format every prior art-briefs unit has used (Palette, Subject/Scene, Key visual elements, Composition), naming the Fount-driven palette color for each card's own Cost line (Signal→Cyan, Tangle→Violet, Mass→Ash-grey per card-anatomy.md's Fount identity table) and a Composition line citing the Art Window's rectangular/landscape shape and aspect ratio — so these 3 cards can go through the compositing pipeline like every other shipped card set.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-art-briefs-spatial-race-identity (cycle 1)

## Method note
Test execution (`node --test`) required interactive approval unavailable in
this session, so verification was done statically: read the actual repo
files at HEAD (the diff is already committed on this branch), traced the
test file's regexes by hand against the real card source text, and
cross-checked cited facts (Fount→color table, Art Window description)
against `design/cards/card-anatomy.md`.

## AC-by-AC accounting

**AC1** — `design/cards/art-briefs.md` gains exactly one `###` section per
card, titled verbatim, no pre-existing content touched.
- Confirmed via `git show` on the commit: the diff is a pure append (44
  lines) after the prior file's last line ("frame's edge."); nothing above
  that line changed.
- Grepped the final file for `### (Preemptive Survey|Unbound
  Passage|Chokepoint Garrison)` — exactly one match each (lines 791, 804,
  817), no duplicates, no clash with pre-existing titles (e.g. the existing
  "Chokepoint Demolition Charge" is a distinct title from "Chokepoint
  Garrison").
- Verified `spatial-race-identity-set.md` has exactly these 3 card titles.
- **PASS.**

**AC2** — 
