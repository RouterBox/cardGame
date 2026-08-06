# cardgame-card-catalog-name-collision-check

- merged: 2026-07-30T05:16:33.915Z
- intent: lib/parse-card-markdown.js's loadAllCards() (shipped) already reads every file in design/cards/ into one flat array of card records, but nothing in the repo ever uses that full-catalog view to check for duplicate names — every existing uniqueness check (test/design-cards.test.js AC1, and the equivalent checks in design-frontier-cards.test.js and design-signature-cards.test.js) only compares names within its own single file via a Set, so a card added in a new file (frontier-set.md, character-signatures.md, or any of the several new card-set files currently open as proposals or in-flight as units) could silently reuse a name already printed in another file with nothing catching it except each proposal's own manually-written, non-enforced promise not to collide. This unit adds a new lib/card-catalog.js exporting a function that takes the array loadAllCards() already produces (or any array of {name} records) and returns the list of names that occur more than once, comparing case-insensitively so trivial-casing variants also collide. It does not modify lib/parse-card-markdown.js, any file under design/cards/, or any existing test file — it only adds the new lib file and a new test/card-catalog-collision.test.js that (a) proves detection works via fixture data containing an injected duplicate (including a same-name-different-case pair), and (b) runs the same function against the real, current design/cards/ catalog via loadAllCards() and asserts zero duplicates today. This gives every future card-adding unit — including the six already sitting in the queue or in-flight — a single, real, mechanical safety net instead of a held-out promise repeated per-proposal, directly serving the concurrency stress-test RouterBox set up on purpose (T19) at a moment when several parallel card-authoring bolts are running at once.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review: cardgame-card-catalog-name-collision-check (cycle 1)

## Diff scope

`git diff HEAD~2 HEAD --name-status` confirms exactly two new files, no
existing file touched:

```
A   lib/card-catalog.js
A   test/card-catalog-collision.test.js
```

This matches the intent's claim of not modifying `lib/parse-card-markdown.js`,
anything under `design/cards/`, or any existing test file.

## AC-by-AC verification

**AC1** — `lib/card-catalog.js` exists and exports `findDuplicateNames`,
which takes an array of `{ name }` records and returns names occurring
more than once, case-insensitively. Read the file: it lowercases each
`card.name` as a map key, records the first-seen original-cased name,
and pushes into `duplicates` (deduped via a `flagged` Set) the first
time a key repeats. Matches AC1 exactly, including the not-explicitly-
required-but-correct behavior of reporting a 3+-times-repeated name
only once. Satisfied.

**AC2** — `test/card-catalog-collision.test.js` fixture tests:
- Test 1: 4 records incl. `'Wormhole Ledger'` / `'wormhole ledger'` →
  asserts exactly one duplicate, case-insensitively equal to
  `'wormhole ledger'`. Traced by hand against the implementation:
  corr
