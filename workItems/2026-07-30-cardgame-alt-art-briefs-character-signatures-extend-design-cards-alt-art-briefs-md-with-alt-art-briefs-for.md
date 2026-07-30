# cardgame-alt-art-briefs-character-signatures: Extend design/cards/alt-art-briefs.md with alt-art briefs for the 5 Character Signatures cards — first alt-art coverage for the design's legendary/hero identities

## Header

- unit: cardgame-alt-art-briefs-character-signatures
- title: Extend design/cards/alt-art-briefs.md with alt-art briefs for the 5 Character Signatures cards — first alt-art coverage for the design's legendary/hero identities
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: c054910a17399263b6c859fa8306cfec0a1ea19c
- end_sha: fc3db04af83c2c78d2f3b0abe8e60474e332f341

## Intent

design/cards/alt-art-briefs.md implements the Alt-Art premium-treatment layer from design/cards/card-anatomy.md's "The Layers" section for exactly 5 cards today, all generic Fount Generators drawn from alpha-set.md. design/ideas-inbox.md's 2026-07-27 characters entry states named characters are "usable later as legendary/hero card identities and art briefs" — design/cards/character-signatures.md already delivers the legendary/hero cards themselves (Kordelia Vess, Salvage-Marshal of the Cinder Yards; Mother-Thread Ilvex, First Voice of the Sprawl; Selin Vashti Corr, Whisper-Broker of the Glass Spires; Meridian Aule, Star-Read Oracle of the Tangle; Unit 0-Prime "Cast-Aside", the First Flaw) and design/cards/art-briefs.md already gives each a base brief, but no alt-art brief exists for any of them. Add 5 new "###" sections to design/cards/alt-art-briefs.md, one per character-signatures.md card, titled with the card's exact name, each following the file's established template (Palette, Subject/Scene, Key visual elements bulleted list, Composition) and its own stated discipline that an alt-art brief "describes a genuinely different scene from that card's existing base brief, not a restatement of it." Update the file's intro paragraph to reflect 10 sections across two source sets instead of 5 from one. Update test/design-alt-art-briefs.test.js's EXPECTED_TITLES constant to include all 10 titles so its existing generalized per-title test loops (AC1 field-shape checks, AC2 Subject/Scene-divergence-from-base-brief checks) automatically cover the 5 new sections without new test logic. Do not touch design/cards/art-briefs.md, design/cards/character-signatures.md, design/cards/alpha-set.md, or the 5 existing Generator alt-art sections' content — this unit only adds 5 new sections and extends the existing test's title list.

## Acceptance Criteria

- AC1 [inferred]: design/cards/alt-art-briefs.md contains exactly 10 "###" brief sections: the 5 existing Generator titles (Sporeknit Warden, Salvage-Wrought Bastion, Replicant Foundry Core, Foreknowledge Cipher, Unwritten Hour) plus the 5 character-signatures.md card names, verbatim
- AC2 [inferred]: Each of the 5 new sections has Palette:, Subject/Scene:, a "Key visual elements:" bulleted list of 2 or more items, and Composition: fields, matching the existing 5 sections' shape
- AC3 [paraphrase] (held_out): For each of the 5 new sections, the Subject/Scene text shares fewer than half its significant words with that same card's base brief Subject/Scene text in design/cards/art-briefs.md — a genuinely different scene, not a restatement
- AC4 [inferred]: The 5 existing Generator sections in alt-art-briefs.md are byte-for-byte unchanged, and design/cards/art-briefs.md, design/cards/character-signatures.md, and design/cards/alpha-set.md are byte-for-byte unchanged
- AC5 [paraphrase]: test/design-alt-art-briefs.test.js passes with its EXPECTED_TITLES constant extended to all 10 titles, exercising both the AC1 field-shape loop and the AC2 Subject/Scene-divergence loop against the 5 new sections

## Plan

GATE: confirm

Reason for the gate: this unit's own scope (see "Spec gap found" below) requires
touching one test file (`test/composite-card-art-alt.test.js`) that unit.md
neither lists as a target nor forbids. The fix is a one-line mechanical number
change, not a behavior change, but it's outside the literal file list in
unit.md's closing sentence ("this unit only adds 5 new sections and extends
the existing test's title list"), so a human should confirm the interpretation
before the builder touches that file. Everything else in this plan is
low-risk, reversible prose/text editing with no schema, security, or user-data
impact.

# Plan: cardgame-alt-art-briefs-character-signatures

## Spec gap found (read this first)

`design/cards/alt-art-briefs.md` is consumed by more than the one test named
in unit.md. `test/composite-card-art-alt.test.js` parses the file live at
test-load time and hardcodes an expectation of exactly 5 "###" sections:

```js
// test/composite-card-art-alt.test.js, lines 55-57
test('AC3: design/cards/alt-art-briefs.md names exactly 5 alt briefs (sanity check on fixture)', () => {
  assert.strictEqual(ALT_TITLES.length, 5, `expected exactly 5 alt briefs, found ${ALT_TITLES.length}`);
});
```

Once this unit adds 5 more "###" sections (10 total), `ALT_TITLES.length` will
be 10 and this assertion fails, which fails `node --test` — the unit's own
stated Test command — even though every AC in unit.md is otherwise satisfied.
unit.md's file list does not mention this test file at all (neither as a
target nor as a do-not-touch), so this is a gap in the spec, not something
this plan invents work around silently.

**Verified not a problem elsewhere:** `test/composite-card-art.test.js` computes
`titles.length + altTitles.length` dynamically (no hardcoded count) — safe.
`test/design-readiness-gap3-jaina-sync-fix.test.js` only checks a byte-for-byte
verbatim substring already present in `design/DESIGN-READINESS.md` (a
different, untouched file) — safe, but see the FYI at the bottom of this plan.
`tools/composite-card-art.js` derives everything from the live file — no
hardcoded count. Confirmed via repo-wide grep for `alt-art-briefs`,
`ALT_TITLES`, `altTitles`, and `5.{0,20}alt` — no other hits.

**Planned fix (Step 3 below):** update the same hardcoded `5` → `10` in
`test/composite-card-art-alt.test.js`, the same kind of mechanical fixture-count
edit unit.md already asks for in `test/design-alt-art-briefs.test.js`. Do not
touch anything else in that file.

## Step 1 — `design/cards/alt-art-briefs.md`: update the intro paragraph

File: `design/cards/alt-art-briefs.md`

Replace the intro paragraph (everything after the `# Alt-Art Briefs` heading,
before the first `### Sporeknit Warden` section) so it describes 10 sections
across two source sets instead of 5 from one.

Find this exact text (lines 3–13 today):

```
This document gives one Alt-Art brief for each of five cards already
briefed in `design/cards/art-briefs.md`, one card from each of the game's
five Founts: Bloom, Mass, Circuit, Signal, and Tangle. Per the Alt-Art layer
defined in `design/cards/card-anatomy.md`'s
"The Layers" section, an Alt-Art brief swaps only the Art Window's
illustration for an alternate illustration of the same subject matter —
every other zone keeps the base treatment's placement and content exactly.
Each brief below follows the same Palette/Subject-Scene/Key visual
elements/Composition template `art-briefs.md` already uses, but describes
a genuinely different scene from that card's existing base brief, not a
restatement of it.
```

Replace it with:

```
This document gives one Alt-Art brief for each of ten cards already
briefed in `design/cards/art-briefs.md`, drawn from two source sets: five
generic Fount Generators in `design/cards/alpha-set.md`, one from each of
the game's five Founts (Bloom, Mass, Circuit, Signal, and Tangle), and the
five named legendary/hero cards in `design/cards/character-signatures.md`.
Per the Alt-Art layer defined in `design/cards/card-anatomy.md`'s
"The Layers" section, an Alt-Art brief swaps only the Art Window's
illustration for an alternate illustration of the same subject matter —
every other zone keeps the base treatment's placement and content exactly.
Each brief below follows the same Palette/Subject-Scene/Key visual
elements/Composition template `art-briefs.md` already uses, but describes
a genuinely different scene from that card's existing base brief, not a
restatement of it.
```

Do not touch anything from `### Sporeknit Warden` through the end of the
`### Unwritten Hour` section (the file's current final line) — that is the
"5 existing Generator sections... byte-for-byte unchanged" AC4 requires.

## Step 2 — `design/cards/alt-art-briefs.md`: append 5 new sections

File: `design/cards/alt-art-briefs.md`

Append the following at the very end of the file, after the existing
`### Unwritten Hour` section's last line ("...frame's edges."), separated by
one blank line — the same spacing pattern used between every existing
section in the file. Do not reorder or edit any existing section.

Each Subject/Scene below has been checked against its base brief's
Subject/Scene in `design/cards/art-briefs.md` using the exact algorithm
`test/design-alt-art-briefs.test.js` uses (lowercase, tokens of 4+ letters
matching `[a-z][a-z'-]{3,}`, minus the file's stopword list, overlap counted
by exact string match). Computed overlap ratios are noted per section so you
can trust the numbers without re-deriving them — but if you reword any
Subject/Scene line, recompute the ratio before assuming it still passes.

Append exactly this text:

```
### Kordelia Vess, Salvage-Marshal of the Cinder Yards

Palette: Ash-grey — the Mass's industrial endurance, seen here in the raw,
unsorted yards long before she imposed any order on them.
Subject/Scene: Decades before she ran the yards, a young scavenger claws a
single dented plate free from a mountain of Cinder Reach wreckage, unaware
that the salvage law she is about to write will bear her name.
Key visual elements:
- A young, not-yet-named Kordelia Vess digging alone through open wreckage, decades before she commanded anything
- One dented salvage plate pulled free by hand, the found object that seeds her future law that nothing leaves as less than useful
- Vast, unsorted junk mountains stretching to the horizon, showing the yards with no order imposed on them yet
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — place the young scavenger low
in the foreground, dwarfed by towering junk piles receding to the horizon.

### Mother-Thread Ilvex, First Voice of the Sprawl

Palette: Green — the Bloom's patient growth, here caught in its dormant
infancy rather than mid-spread.
Subject/Scene: Long before any thread reached outward, a single seed-body
burrows alone into barren soil under a starless Mireth sky, patiently
waiting out its earliest silent season with nothing yet grown around it.
Key visual elements:
- A single dormant seed-body, the very first form Mother-Thread Ilvex took, with no growth-network yet surrounding it
- Barren, unbroken soil stretching in every direction, emphasizing total solitude rather than a spreading Sprawl
- A starless night sky overhead, marking this as a private beginning long before any other Biology permanent took root nearby
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — center the lone seed-body small
within a vast, empty expanse of bare soil.

### Selin Vashti Corr, Whisper-Broker of the Glass Spires

Palette: Cyan — the Signal's cool analytic watchfulness, turned inward on
her own hoarded secrets rather than an opponent's.
Subject/Scene: Alone in a spire chamber long after midnight, a broker sorts
stacks of gathered secrets into locked drawers by cyan lamplight,
cataloguing whispers she has already collected rather than reaching for a
new one.
Key visual elements:
- Selin Vashti Corr working entirely alone, with no opponent or opposing Hand anywhere in the scene
- Locked drawers of already-gathered secrets being filed and catalogued, not a live reading in progress
- A private spire chamber lit only by cyan lamplight, emphasizing hoarding and record-keeping over active brokering
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep the broker seated low and
central, surrounded by the locked drawers and stacked secrets.

### Meridian Aule, Star-Read Oracle of the Tangle

Palette: Violet — the Tangle's uncanny ritual mood, paid out afterward
rather than spent in the moment of reading.
Subject/Scene: Days after the vision fades, an exhausted seer lies
half-conscious on a cushioned pallet while faint violet afterimages of
drifting starlight still flicker uselessly across the ceiling above her.
Key visual elements:
- Meridian Aule shown days later, spent and half-conscious, rather than actively hovering cards above her Archive
- Faint, fading violet afterimages of the reading drifting uselessly overhead, no Archive or cards visible in the scene
- A quiet recovery setting — a cushioned pallet in a dim room — emphasizing the toll her reading costs rather than the ritual itself
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — keep the reclining seer low and
central, with the fading violet afterimages drifting across the frame's
upper half.

### Unit 0-Prime "Cast-Aside", the First Flaw

Palette: Copper — the Circuit's warm mechanized precision, caught here in
the instant it first goes wrong.
Subject/Scene: Deep inside a churning assembly line, a single stamping die
slips for one fraction of a second, pressing an unplanned scar into fresh
plating just before the still-glowing chassis is racked alongside its
flawless siblings.
Key visual elements:
- The stamping die itself caught mid-slip, the exact mechanical instant the flaw is made rather than a finished Unit displaying it
- A single fresh scar pressed into glowing, still-warm plating, shown as a fresh accident rather than an old mark
- Rows of flawless siblings already racked and finished nearby, emphasizing that this one chassis has not yet joined them
Composition: wide, landscape rectangle (~5:3), the large rectangular window
beneath the Name Slot per card-anatomy.md — center the stamping die and
scarring plate with the flawless racked units receding into the
background.
```

Computed Subject/Scene overlap ratios against `design/cards/art-briefs.md`
(must be `< 0.5` per AC3; all pass with margin):

| Card | Shared / total significant words | Ratio |
|---|---|---|
| Kordelia Vess | 3/19 (`free`, `cinder`, `yards`) | 0.16 |
| Mother-Thread Ilvex | 0/19 | 0.00 |
| Selin Vashti Corr | 1/19 (`cyan`) | 0.05 |
| Meridian Aule | 1/18 (`violet`) | 0.06 |
| Unit 0-Prime "Cast-Aside" | 2/22 (`assembly`, `plating`) | 0.09 |

## Step 3 — `test/design-alt-art-briefs.test.js`: extend EXPECTED_TITLES

File: `test/design-alt-art-briefs.test.js`

Replace this line (line 11 today):

```js
const EXPECTED_TITLES = ['Sporeknit Warden', 'Salvage-Wrought Bastion', 'Replicant Foundry Core', 'Foreknowledge Cipher', 'Unwritten Hour'];
```

with:

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
];
```

Then replace the hardcoded count check (lines 74–86 today) — **this literal
`5` must become `10`, or the test fails even with EXPECTED_TITLES correctly
extended**:

```js
test('AC1: alt-art-briefs.md has exactly 5 "###" sections titled verbatim', () => {
  const titles = altSections.map((s) => s.title);
  assert.strictEqual(
    titles.length,
    5,
    `expected exactly 5 brief sections, found ${titles.length}: [${titles.join(', ')}]`
  );
  assert.deepStrictEqual(
    [...titles].sort(),
    [...EXPECTED_TITLES].sort(),
    `expected titles ${JSON.stringify(EXPECTED_TITLES)}, got ${JSON.stringify(titles)}`
  );
});
```

with:

```js
test('AC1: alt-art-briefs.md has exactly 10 "###" sections titled verbatim', () => {
  const titles = altSections.map((s) => s.title);
  assert.strictEqual(
    titles.length,
    10,
    `expected exactly 10 brief sections, found ${titles.length}: [${titles.join(', ')}]`
  );
  assert.deepStrictEqual(
    [...titles].sort(),
    [...EXPECTED_TITLES].sort(),
    `expected titles ${JSON.stringify(EXPECTED_TITLES)}, got ${JSON.stringify(titles)}`
  );
});
```

Do not change anything else in this file — the two `for (const title of
EXPECTED_TITLES)` loops (AC1 field-shape checks and AC2 divergence checks)
need no changes; they automatically pick up all 10 titles once the constant
above is extended.

## Step 4 — `test/composite-card-art-alt.test.js`: fix the now-stale fixture count

File: `test/composite-card-art-alt.test.js`

This edit exists only because of the spec gap described at the top of this
plan — it is not in unit.md's file list, but is required for `node --test`
to pass. Get explicit confirmation on the GATE before making this edit.

Replace (lines 55–57 today):

```js
test('AC3: design/cards/alt-art-briefs.md names exactly 5 alt briefs (sanity check on fixture)', () => {
  assert.strictEqual(ALT_TITLES.length, 5, `expected exactly 5 alt briefs, found ${ALT_TITLES.length}`);
});
```

with:

```js
test('AC3: design/cards/alt-art-briefs.md names exactly 10 alt briefs (sanity check on fixture)', () => {
  assert.strictEqual(ALT_TITLES.length, 10, `expected exactly 10 alt briefs, found ${ALT_TITLES.length}`);
});
```

Do not change anything else in this file. Every other assertion in it
(`composite-card-art.test.js` and `composite-card-art-alt.test.js`'s other
tests) already derives its expectations from `ALT_TITLES`/`listAltBriefTitles()`
dynamically, so they need no changes and will automatically cover all 10
alt briefs.

## Do NOT touch (per unit.md, verified untouched by every edit above)

- `design/cards/art-briefs.md`
- `design/cards/character-signatures.md`
- `design/cards/alpha-set.md`
- The 5 existing Generator `###` sections inside `design/cards/alt-art-briefs.md`
  (Sporeknit Warden, Salvage-Wrought Bastion, Replicant Foundry Core,
  Foreknowledge Cipher, Unwritten Hour) — only the file's intro paragraph
  changes, and only new content is appended after them.

## FYI — pre-existing stale doc, out of scope

`design/DESIGN-READINESS.md` Section 4 still says (verbatim, byte-for-byte
required by `test/design-readiness-gap3-jaina-sync-fix.test.js`):
`"- **\`design/cards/alt-art-briefs.md\`** — 5 alternate-art briefs for the
fount Generators (...)."` This becomes inaccurate prose once this unit ships
(the file will have 10 sections, not 5, and will cover character cards too),
but that test only checks a static verbatim string already in
`DESIGN-READINESS.md` — it does not read `alt-art-briefs.md` live, so it will
keep passing untouched. unit.md does not list `DESIGN-READINESS.md` as
in-scope and updating stale-but-passing prose in an unrelated doc is outside
this unit's job (see project CLAUDE.md: "don't touch unrelated code"). Leave
it; a future unit can true it up.

## Expected outputs

Run, in order:

1. `node --test test/design-alt-art-briefs.test.js`
   Expect all tests green: 2 fixed tests (file exists, exactly-10-titled-sections)
   + 10 AC1 field-shape tests + 10 AC2 divergence tests = **22 passing, 0
   failing**.

2. `node --test test/composite-card-art-alt.test.js`
   Expect all 5 tests green (sanity-check-on-fixture now expects 10; the
   `node tools/composite-card-art.js` run under `test.before()` succeeds
   because every one of the 10 alt-brief titles — including the 5 new
   character names — has a matching `###` section in
   `design/cards/art-briefs.md` to composite against, per the "has no base
   brief" error path in `tools/composite-card-art.js`, which none of these
   trigger).

3. `node --test test/composite-card-art.test.js`
   Expect all tests green, no changes needed — it already computes
   `titles.length + altTitles.length` dynamically at line 240 of that file.

4. `node --test` (full suite, the unit's stated Test command)
   Expect 0 failing tests overall. No other file in the repo hardcodes a
   count derived from `design/cards/alt-art-briefs.md` (verified by grep for
   `alt-art-briefs`, `ALT_TITLES`, `altTitles`).

## Risk self-assessment (FIRE matrix)

- **Reversibility:** fully reversible — plain-text/markdown edits and one
  numeric literal change per test file, trivially revertible via git.
- **Security impact:** none — no code execution paths touched, no
  credentials, no network calls.
- **User data:** none — design-doc and test-fixture content only.
- **Schema changes:** none.

GATE is set to **confirm** solely because of the out-of-scope
`test/composite-card-art-alt.test.js` edit (Step 4) needed to keep `node
--test` green — not because of any risk in the edit itself.


## Findings

# Review: cardgame-alt-art-briefs-character-signatures, cycle 1

## AC accounting

- **AC1** (exactly 10 "###" sections, verbatim titles): PASS. `design/cards/alt-art-briefs.md` now has the 5 original Generator titles plus the 5 `character-signatures.md` titles, confirmed byte-identical against `character-signatures.md`'s own `###` headers (Kordelia Vess…, Mother-Thread Ilvex…, Selin Vashti Corr…, Meridian Aule…, Unit 0-Prime "Cast-Aside"…). `test/design-alt-art-briefs.test.js`'s `EXPECTED_TITLES` was extended to match, and its `AC1: alt-art-briefs.md has exactly 10 "###" sections` test enforces the count strictly.
- **AC2** (Palette/Subject-Scene/Key visual elements (2+)/Composition shape): PASS. All 5 new sections have all four fields; each "Key visual elements:" list has 3 bullets (≥2).
- **AC3** (held_out, Subject/Scene divergence from base brief): not gating per instructions, but verified anyway by hand-computing the test's own overlap algorithm against each new section vs. its `art-briefs.md` base brief — all 5 pairs come out well under the 50% threshold (worst case ~21%, e.g. Kordelia Vess: 4/19 shared significant words). No concern.
- **AC4** (existing Generator sections + art-briefs.md/character-signatures.md/alpha-set.md byte-for-byte unchanged): PASS. Diff only touches `alt-art-briefs.md`'s intro paragraph and appends after the existing `### Unwritten Hour` section; the other three files don't appear in the diff at all, confirming no changes.
- **AC5** (test/design-alt-art-briefs.test.js passes with EXPECTED_TITLES extended to 10, exercising AC1/AC2 loops against the new sections): PASS by construction — `EXPECTED_TITLES` now lists all 10 titles verbatim, and the existing per-title loops (field-shape, Subject/Scene-divergence) iterate over it with no new test logic added, exactly as specified.

## Scope-boundary items (checked, not gating)

- `test/composite-card-art-alt.test.js`'s hardcoded `ALT_TITLES.length === 5` sanity check was updated to `>= 10` — this file wasn't in unit.md's file list (neither target nor do-not-touch), and the plan flagged this exact gap with an explicit `GATE: confirm` before the builder touched it. Since the cycle proceeded, the gate was presumably confirmed; the fix itself is the mechanical, narrowly-scoped one the plan described (no other line in that file changed).
- `site/design/cards/alt-art-briefs.html` and 5 new `renders/cards-composited/*-alt.svg` files aren't mentioned in unit.md either, but checking git history shows this is the established convention for every prior alt-art/art-brief unit in this repo (e.g. `ebe03c0` "add Signal and Tangle alt-art briefs", `4510d14` "art-briefs-spatial-race-identity-wave-2") — each one regenerates the dependent site HTML and composited SVGs alongside the markdown change. Not scope creep; consistent with repo convention and required for `composite-card-art-alt.test.js`'s own generation-and-verification tests to pass.
- No `renders/cards-live/*.svg` files were added for the 5 new cards, unlike one earlier alt-art unit's commit — but `cards-live/` is only populated by an explicit `--live` (real Leonardo API) run, not the default mock `composite-card-art.js` invocation this test suite triggers. Absence is correct, not a gap.
- Confirmed `test/composite-card-art.test.js` (the non-alt test file) computes `titles.length + altTitles.length` dynamically, as the plan claimed — no hardcoded count there to break.

## Findings

None. Everything in the diff is either directly required by a visible AC or is the established, previously-reviewed pattern (site/render regeneration, the one gated test-file edit) for this class of unit.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T20:30:35.142Z] **bolt:start** — unit=cardgame-alt-art-briefs-character-signatures start_sha=c054910a17399263b6c859fa8306cfec0a1ea19c branch=bolt/cardgame-alt-art-briefs-character-signatures worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-alt-art-briefs-character-signatures
- [2026-07-30T20:30:48.943Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T20:37:54.000Z] **plan:done** — plan.md written
- [2026-07-30T20:37:54.012Z] **gate:raised** — confirm — waiting for decision (file or API)
- [2026-07-30T21:03:26.557Z] **gate-confirm:done** — approved — Approved including the out-of-list one-line fix to test/composite-card-art-alt.test.js � the spec gap is real and the fix is required for the unit's own test command to pass. Preference: instead of re-pinning the count at exactly 10 (which freezes repo state and will break on the next alt-art wave, the same class as the 52->54 and 28-brief pins we have already unfrozen twice today), change the assertion to ALT_TITLES.length >= 10 with a message noting 10 existed when written. If the test-writer or builder judges the exact-count to be load-bearing for AC3's fixture-sanity intent, exactly-10 is acceptable; do not let this choice burn a cycle.
- [2026-07-30T21:04:48.391Z] **tests:done** — RED verified on test/design-alt-art-briefs.test.js (exit=1)
- [2026-07-30T21:10:11.378Z] **build:c1** — tests green, committed
- [2026-07-30T21:14:23.233Z] **review:c1** — APPROVE
- [2026-07-30T21:18:50.236Z] **review:devils-advocate** — APPROVE
- [2026-07-30T21:19:00.706Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T21:19:01.134Z] **merge:done** — auto-merged bolt/cardgame-alt-art-briefs-character-signatures into master (worktree)


## Receipt

```json
{
  "start_sha": "c054910a17399263b6c859fa8306cfec0a1ea19c",
  "end_sha": "32eaf08cd9f6d28e09f68e77558700722871f537",
  "diff_nonempty": true,
  "test_cmd": "node --test",
  "exit_code": 0,
  "criteria_covered": [
    {
      "id": "AC1",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC2",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC3",
      "held_out": true,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC5",
      "held_out": false,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-30T21:19:00.704Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-alt-art-briefs-character-signatures\\plan.md`.\n\nKey points:\n- **GATE: confirm** — while researching, I found `test/composite-card-art-alt.test.js` hardcodes an expectation of exactly 5 alt-brief sections (a sanity check on the same file this unit edits). Adding 5 new sections breaks that test unless its literal `5`→`10` is also fixed, but that file isn't in unit.md's scope list either way. The fix itself is trivial and low-risk, but it's outside the letter of unit.md's scope, so I flagged it for confirmation rather than silently expanding scope.\n- The plan gives complete, ready-to-paste text for all 5 new alt-art briefs, each Subject/Scene checked word-for-word against the test's actual overlap algorithm (all pass with 0–16% overlap, well under the 50% AC3 threshold).\n- Also included the necessary (but easy to miss) fix to the hardcoded `5` in `design-alt-art-briefs.test.js`'s count assertion, since just extending `EXPECTED_TITLES` alone wouldn't be enough.\n- Verified via repo-wide grep that no other file depends on the alt-art-briefs section count, and noted one pre-existing stale doc (`DESIGN-READINESS.md`) that's out of scope and unaffected.",
    "test_writer": "Confirmed: the design doc currently has only the 5 existing Generator sections, so the updated test (expecting 10 titled sections including the 5 character-signatures cards) will fail until the Builder adds them — satisfying the RED requirement. The harness will run the RED check itself; I don't have shell approval in this hat to run `node --test` directly.\n\n**Summary of changes** (test/ only, no src/ touched):\n- `test/design-alt-art-briefs.test.js`: extended `EXPECTED_TITLES` from 5 to 10 (added the 5 character-signatures.md card names verbatim), and updated the hardcoded count assertion from 5 to 10.\n- The existing `for (const title of EXPECTED_TITLES)` loops for AC1 (field-shape) and AC2 (Subject/Scene divergence) automatically now cover the 5 new titles — no new test logic needed, per the unit's intent.\n- Left `test/composite-card-art-alt.test.js` untouched — the plan flags editing it as outside this unit's explicit file list and gated for human confirmation; that's a Builder/gate decision, not part of writing tests from this unit's visible ACs.",
    "builder_c1": "Working tree is clean and the only test/ change is the plan-gated, human-approved fix to `test/composite-card-art-alt.test.js`.\n\nSummary of what was implemented for cycle 1:\n- `design/cards/alt-art-briefs.md`: updated the intro paragraph to describe 10 sections across two source sets, and appended 5 new alt-art briefs for the character-signatures.md cards (Kordelia Vess, Mother-Thread Ilvex, Selin Vashti Corr, Meridian Aule, Unit 0-Prime \"Cast-Aside\").\n- `test/design-alt-art-briefs.test.js` was already updated by the test-writer phase (commit a5ae301) with all 10 `EXPECTED_TITLES` — untouched by me.\n- `test/composite-card-art-alt.test.js`: fixed the stale hardcoded `ALT_TITLES.length === 5` fixture-sanity assertion to a `>= 10` floor, per the plan's gate (already human-approved in the ledger) and its stated preference to avoid re-freezing an exact count.\n- Regenerated the derived `renders/cards-composited/*-alt.svg` outputs and `site/design/cards/alt-art-briefs.html`, and committed everything (design content + derived renders/site + the one approved test fix) as `builder cycle 1`, matching this repo's established convention for keeping the \"byte-identical committed baseline\" test green.\n\nFull suite: 1133/1133 passing, working tree clean.",
    "reviewer_c1": "I reviewed the diff against unit.md's spec and plan.md, verified all 5 visible ACs (AC1, AC2, AC4, AC5) plus the held-out AC3 by hand-computing the test's own overlap algorithm, and checked the three off-spec-list file changes (site HTML, composited SVGs, the gated test-file edit) against git history — all three match established convention from prior alt-art-briefs units in this repo, not scope creep. No introduced defects found.\n\nAPPROVE",
    "devils_advocate": "Devil's-advocate pass complete. Summary of what I attacked and why each attempt failed:\n\n1. **Scope-creep attack**: the unit intent says \"this unit only adds 5 new sections and extends the existing test's title list,\" yet the diff also touches `renders/cards-composited/*.svg` (5 new files), `site/design/cards/alt-art-briefs.html`, and `test/composite-card-art-alt.test.js`. Verified via `git ls-files` that `renders/cards-composited/` is an established, checked-in build artifact directory (pre-existing alt SVGs like `foreknowledge-cipher-alt.svg` are already tracked), and the site HTML is a synced mirror of the markdown — both are pre-existing patterns this repo follows for every prior card-adding unit, not new scope. The `composite-card-art-alt.test.js` change was a forced, mechanical consequence of the fixture file changing (its old `strictEqual(5)` sanity check would otherwise fail against the new 10-section file) — not gratuitous.\n\n2. **Byte-identical-baseline attack** (strongest candidate): `test/leonardo-art-client.test.js` has a pre-existing, untouched test asserting `git status --porcelain -- renders/cards-composited` is empty after running the tool in mock mode — i.e., the committed SVGs must exactly match deterministic tool output (SHA-256-hash-derived hue per `tools/composite-card-art.js`). I could not execute code to verify this directly (sandbox correctly blocks the Reviewer from mutating the repo). But the new SVGs' structure (exact type-lines, rules text, flavor text, cost pips, stats-corner blocks matching `character-signatures.md`'s actual card data, hash-derived HSL placeholder colors) is far too structurally precise to have been hand-authored — this is exactly what running `tools/composite-card-art.js` produces. Strong circumstantial evidence this is genuine regenerated output, not a mismatched fabrication.\n\n3. **Content-shape attack (AC1/AC2)**: verified titles match `character-signatures.md` headings verbatim (byte comparison), all 5 new sections "
  }
}
```

## Comments

(no comments.md)
