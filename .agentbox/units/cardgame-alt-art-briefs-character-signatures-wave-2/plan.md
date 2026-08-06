GATE: none

# Plan: cardgame-alt-art-briefs-character-signatures-wave-2

## Summary

Append 5 new "###" Alt-Art brief sections to `design/cards/alt-art-briefs.md`
(one each for the 5 `character-signatures-wave-2.md` cards), and extend
`test/design-alt-art-briefs.test.js`'s `EXPECTED_TITLES` array (plus two
hardcoded `10` literals that do NOT auto-generalize — see "Spec-bug flag"
below) so the suite covers 15 sections instead of 10.

This is a pure content-addition unit: no source code changes, no schema
changes, low risk, fully reversible (it's a markdown append + one test
array edit). Confirmed via direct inspection of the repo (paths below all
exist and were read in full before writing this plan).

## Spec-bug flag (read before assigning the test-writer step)

unit.md says: "Extend test/design-alt-art-briefs.test.js's EXPECTED_TITLES
array to include the 5 new titles (10 -> 15) — its existing AC1
(section-shape) and AC2 (Subject/Scene overlap-vs-base) tests already
generalize over EXPECTED_TITLES with no other code change needed."

This is almost true but not quite: the AC2 tests and the "each brief has
Palette/Subject-Scene/..." AC1 tests do generalize automatically (they
`for (const title of EXPECTED_TITLES)` loop). **But** the one test titled
`AC1: alt-art-briefs.md has exactly 10 "###" sections titled verbatim`
(current file, lines 85-97) hardcodes the number `10` twice — once in the
test's own title string, once in the `assert.strictEqual(titles.length,
10, ...)` call and its error-message template literal. That number does
NOT derive from `EXPECTED_TITLES.length`; it's a literal `10`. If only the
array is extended and this literal is left alone, `titles.length` will be
15 while the assertion still expects 10, and the test will fail.

This is not a new requirement invented by the test-writer — it's the exact
same "AC1: exactly N sections, matching EXPECTED_TITLES" check the unit
already mandates (AC1 says "gains exactly 5 new sections... with none of
the 10 pre-existing sections altered"; 10 existing + 5 new = 15 total is
already implied). So: **change that literal `10` to `15`** in both the
test title string and the assertion/message, as part of the same
test-writer edit that extends the array. This keeps AC1 satisfied exactly
as specified; it is not scope creep.

## Files to touch

1. `design/cards/alt-art-briefs.md` — **builder** edit (append-only, no
   existing content touched).
2. `test/design-alt-art-briefs.test.js` — **test-writer** edit only (per
   CLAUDE.md machine-safety rule: builder must never touch files under
   `test/`; assign this whole edit to the test-writer stage, not the
   builder).

Do NOT touch: `design/cards/character-signatures-wave-2.md`,
`design/cards/art-briefs.md`, `design/cards/card-anatomy.md`, or any of the
10 pre-existing `alt-art-briefs.md` sections.

## Background facts verified from the repo

- `design/cards/card-anatomy.md`'s Fount/color table (confirmed exact):
  Mass -> Ash-grey, Bloom -> Green, Signal -> Cyan, Circuit -> Copper,
  Tangle -> Violet.
- `design/cards/character-signatures-wave-2.md` Cost lines (confirmed
  exact): Torel Ashgrave = 2 Mass, Rathe Ossuary-Kin = 3 Bloom, Doran Vex
  Amaranthine = 2 Signal, Ysolde Thane = 2 Tangle, Foreman-Prime Yssa
  Ductile = 4 Circuit. This matches the Palette colors unit.md specifies.
- `design/cards/art-briefs.md` already has a `### <title>` base-brief
  section for each of these 5 cards (lines 552-628 in the current file),
  each with its own Subject/Scene line the new alt briefs must diverge
  from per AC4.
- `test/helpers/markdown.js`'s `parseSections` splits on `^#{1,6}\s+`,
  giving `{level, title, lines}` per heading — this is what
  `design-alt-art-briefs.test.js` uses for both files, so heading level
  (`###`) and exact title text (verbatim, no trailing punctuation
  differences) must match precisely.
- The test's `significantWords()` tokenizer: lowercases, matches
  `[a-z][a-z'-]{3,}` (so hyphenated compounds like `line-captain` count as
  ONE token, and apostrophe words like `bloom's` are one token), then
  drops a fixed stopword list (see file, includes `before`, `after`,
  `from`, `into`, `toward`, etc. but NOT domain nouns). AC4 requires:
  `overlap.length < altWords.size / 2` between the alt Subject/Scene's
  token set and the base Subject/Scene's token set for the same title.
  All 5 drafts below were hand-checked against this exact tokenizer and
  each has overlap well under the 50% threshold (see "Overlap check" per
  section below) — copy the text verbatim, don't paraphrase further, or
  you risk drifting the count.
- The existing file uses CRLF line endings (`\r\n`) throughout and ends
  with `...background.\r\n` (no trailing blank line, no trailing blank
  section separator). Each existing section is separated from the next by
  exactly one blank line before the next `### `. **Match CRLF line endings
  when appending** — if your editor normalizes to LF you will produce a
  mixed-line-ending file; verify with `git diff` that only additions
  appear and no line-ending-only changes touch the pre-existing 10
  sections (AC5 requires those 10 sections stay byte-for-byte unchanged).

## Step 1 (builder): append 5 sections to design/cards/alt-art-briefs.md

Open `design/cards/alt-art-briefs.md`. It currently ends (last two lines)
with:

```
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — center the stamping die and
scarring plate with the flawless racked units receding into the
background.
```

...and that's the end of the file (no trailing blank line after
"background."). Append the following, starting with a blank line, then
the 5 new sections in this exact order, each separated from the next by
one blank line, matching the existing template shape exactly (Palette /
Subject/Scene / Key visual elements bullets / Composition). Use CRLF line
endings to match the rest of the file.

```

### Torel Ashgrave, Line-Captain of the Ember Vanguard

Palette: Ash-grey — the Mass's industrial endurance, drilled alone into
her stance long before any line ever stood behind it.
Subject/Scene: Years before any line existed to command, a lone recruit
drills alone at dawn in an empty yard, matching her own motions again and
again until they look just like everyone else's.
Key visual elements:
- A young, not-yet-ranked Torel Ashgrave training entirely by herself, decades before any Ember Vanguard hull ever stood behind her
- Her own stance repeated obsessively into uniformity, the private origin of the identical discipline she will one day demand of a whole formation
- An empty, unremarkable drill yard at dawn, with no rank insignia earned and no formation anywhere in view
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — place the lone recruit small
and centered in the empty yard, dawn light spreading flat and even across
the frame.

### Rathe Ossuary-Kin, Spore-Hound of the Sprawl

Palette: Green — the Bloom's patient growth, settled now into a stillness
far quieter than any battlefield.
Subject/Scene: Long after his last fight has ended, a lone hunter dozes
undisturbed in a hushed stretch of the Sprawl, his hide gone still and
quiet with nothing new taking root anywhere on him.
Key visual elements:
- Rathe Ossuary-Kin resting utterly alone, long after the fight that would normally mark him has already ended
- No fresh counter or new growth anywhere on his hide, only old scars gone still and settled
- A hushed, undisturbed stretch of the Sprawl around him, emphasizing quiet recovery over an active wound
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep the dozing hunter low and
central, the Sprawl's stillness filling the frame's edges.

### Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive

Palette: Cyan — the Signal's cool analytic watchfulness, turned only on
records he has already made his own.
Subject/Scene: Alone in a private vault long after any reading ends, a
keeper sorts stacks of his own ledger entries already gathered, sealing
each one into its place with no opposing hand anywhere in sight.
Key visual elements:
- Doran Vex Amaranthine working entirely by himself, with no opponent's Archive or opposing hand anywhere in the scene
- Stacks of his own already-gathered ledger entries being sorted and sealed away, not a single card mid-read
- A private vault setting, emphasizing quiet record-keeping long after any working has ended
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep the keeper seated low and
central, surrounded by his own sealed stacks of entries.

### Ysolde Thane, Pilgrim of the Unwritten Sign

Palette: Violet — the Tangle's uncanny ritual mood, not yet awakened, just
an open road ahead of it.
Subject/Scene: Long before any reading calls her to kneel, a lone traveler
walks a dusty road at dawn, drawn only by rumor of a distant shrine,
nothing yet lifted into view and no choice yet made.
Key visual elements:
- A young, not-yet-named Ysolde Thane walking entirely alone, long before she ever reaches any Archive to read
- An open dusty road at dawn, with no violet working cast and no card suspended anywhere in view
- A distant, still-unreached shrine on the horizon, marking this as a private pilgrimage before the Unwritten Sign is ever found
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — place the lone traveler small
on the road, the distant shrine and open sky filling the frame's upper
half.

### Foreman-Prime Yssa Ductile, Keeper of the First Pattern

Palette: Copper — the Circuit's warm mechanized repetition, cast just once
before it was ever copied.
Subject/Scene: Long before any copy ever left the line, a lone artisan
forges the very first design by hand in an empty workshop, the singular
original taking shape with no other unit yet made to match it.
Key visual elements:
- A young, not-yet-titled Foreman-Prime Yssa Ductile shaping the singular First Pattern entirely by hand, before any Generator core or resource pool exists to attend
- An empty workshop with no Circuit Point yet flowing and no reproduced units anywhere nearby
- The very first design taking shape alone, emphasizing origin and singularity over the pattern's later mass production
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — center the lone artisan and the
half-shaped original design, the empty workshop receding into shadow
behind them.
```

Note: the four `Key visual elements:` bullets above are written as single
long lines (one line per bullet) rather than soft-wrapped across multiple
lines — this matches the existing file's own bullet style (every existing
`- ...` bullet in the file is one physical line, unlike the Subject/Scene
and Composition fields which do soft-wrap). Do not wrap the bullets.

### Overlap check per section (AC4 — do not skip verifying this)

For each new section, `significantWords(altSubjectScene)` vs
`significantWords(baseSubjectScene)` (base pulled from `art-briefs.md`)
must satisfy `overlap.length < altWords.size / 2`:

- Torel Ashgrave: alt has 20 significant words, overlap = 1 (`own`). 1 < 10. Pass.
- Rathe Ossuary-Kin: alt has 19 significant words, overlap = 1 (`sprawl`). 1 < 9.5. Pass.
- Doran Vex Amaranthine: alt has 21 significant words, overlap = 1 (`reading`). 1 < 10.5. Pass.
- Ysolde Thane: alt has 20 significant words, overlap = 1 (`view`). 1 < 10. Pass.
- Foreman-Prime Yssa Ductile: alt has 23 significant words, overlap = 3 (`first`, `other`, `unit`). 3 < 11.5. Pass.

If you paraphrase the Subject/Scene lines instead of copying them verbatim,
re-run this check by hand (or just run `node --test test/design-alt-art-briefs.test.js`,
which is exact and authoritative) before considering the step done.

## Step 2 (test-writer only — builder must not touch this file)

Edit `test/design-alt-art-briefs.test.js`:

1. Replace the `EXPECTED_TITLES` array (current lines 11-22) with:

```js
const EXPECTED_TITLES = [
  'Sporeknit Warden',
  'Salvage-Wrought Bastion',
  'Replicant Foundry Core',
  'Foreknowledge Cipher',
  'Unwritten Hour',
  'Kordelia Vess, Salvage-Marshal of the Cinder Yards',
  'Mother-Thread Ilvex, First Voice of the Sprawl',
  'Selin Vashti Corr, Whisper-Broker of the Glass Spires',
  'Meridian Aule, Star-Read Oracle of the Tangle',
  'Unit 0-Prime "Cast-Aside", the First Flaw',
  'Torel Ashgrave, Line-Captain of the Ember Vanguard',
  'Rathe Ossuary-Kin, Spore-Hound of the Sprawl',
  'Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive',
  'Ysolde Thane, Pilgrim of the Unwritten Sign',
  'Foreman-Prime Yssa Ductile, Keeper of the First Pattern',
];
```

2. Update the "exactly 10 sections" test (current lines 85-97) so its
   literal count matches the new total of 15 — this is the one place that
   does NOT auto-generalize over `EXPECTED_TITLES` (see "Spec-bug flag"
   above). Change:

```js
test('AC1: alt-art-briefs.md has exactly 10 "###" sections titled verbatim', () => {
  const titles = altSections.map((s) => s.title);
  assert.strictEqual(
    titles.length,
    10,
    `expected exactly 10 brief sections, found ${titles.length}: [${titles.join(', ')}]`
  );
```

   to:

```js
test('AC1: alt-art-briefs.md has exactly 15 "###" sections titled verbatim', () => {
  const titles = altSections.map((s) => s.title);
  assert.strictEqual(
    titles.length,
    15,
    `expected exactly 15 brief sections, found ${titles.length}: [${titles.join(', ')}]`
  );
```

   Leave the rest of that test (the `deepStrictEqual` against
   `EXPECTED_TITLES`) unchanged — it already generalizes.

3. Everything else in the file (the per-title AC1 shape loop, the AC2
   overlap loop, `FIELD_PREFIXES`, `extractField`, `significantWords`,
   `STOPWORDS`) needs no edit — they already iterate over
   `EXPECTED_TITLES`.

## Expected output

Running `node --test` from the repo root (working directory: the repo
root, not the unit dir) should show `design-alt-art-briefs.test.js` fully
green with more passing subtests than before (previously 1 + 1 + 10 + 10 =
22 tests in this file — file existence, section-count, 10×shape, 10×AC2 —
now 1 + 1 + 15 + 15 = 32 tests in this file), and the full suite's overall
pass count should increase by exactly 10 (5 new "AC1: shape" tests + 5 new
"AC2: overlap" tests) with zero failures and zero pre-existing tests
newly failing. No other test file should change behavior, since no other
file was touched.

Concretely, expect a line like:

```
# pass 1295
# fail 0
```

(exact total pass count depends on the current suite size at build time —
verify it only goes up from whatever `node --test` reports on `master`
before this unit's changes, by exactly +10, and that `fail 0` holds).

## Risk assessment (FIRE matrix)

- **Reversibility**: trivial — pure markdown append + one test array/literal
  edit, easily revertable with `git diff` / `git checkout`.
- **Security impact**: none — no code paths, no user input, no secrets.
- **User data**: none touched.
- **Schema changes**: none.

Overall: minimal risk, single-bolt-sized unit. `GATE: none`.
