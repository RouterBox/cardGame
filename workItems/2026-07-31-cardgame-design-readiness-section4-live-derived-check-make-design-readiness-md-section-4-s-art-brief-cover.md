# cardgame-design-readiness-section4-live-derived-check: Make DESIGN-READINESS.md Section 4's art-brief-coverage list mechanically derived, like Section 3 already is — and fix the one file it's currently missing

## Header

- unit: cardgame-design-readiness-section4-live-derived-check
- title: Make DESIGN-READINESS.md Section 4's art-brief-coverage list mechanically derived, like Section 3 already is — and fix the one file it's currently missing
- project: cardgame
- completed: 2026-07-31
- outcome: merged
- start_sha: 797a3e745e2f342915aff1b70e42d1c68f2fc837
- end_sha: 490d24b0b5ae5292d3aa7fc1e2d7f6699d5a44fa

## Intent

design/DESIGN-READINESS.md exists to make the software-gate judgment call (I6) an informed one, with a file citation for every claim (T9's structural-rigor bar). Section 3's card-set list already learned T12's lesson — test/design-readiness.test.js's AC3/AC6 re-derives it live from design/cards/*.md via lib/parse-card-markdown.js's loadCardsFromFile so it cannot silently drift. Section 4 ("Card Anatomy & Art Brief Coverage") never got the same treatment: its sentence naming which card-set files are fully covered by design/cards/art-briefs.md's brief sections is hand-typed, and design/cards/spatial-race-identity-set-wave-2.md's 2 cards (Bloom Fount, Circuit Fount, both already briefed at art-briefs.md lines 832 and 844) are missing from it. Add a new test in test/design-readiness.test.js: for every file under design/cards/ that loadCardsFromFile parses to 1+ cards, extract that file's card names, then check whether every one of those names appears as a "###" heading anywhere in design/cards/art-briefs.md (parsed the same way test/design-alt-art-briefs.test.js's helpers already scan that file's headings); if and only if every card name is found, assert the DESIGN-READINESS.md Section 4 section text (use the existing sectionText/parseSections helpers already imported in this test file, matched against the section titled "Card Anatomy & Art Brief Coverage") includes that filename. Do not require citation for any file with partial or zero art-brief coverage (e.g. character-signatures-wave-3.md today) — the check is coverage-driven, not disk-presence-driven, so it does not race with the still-open art-briefs-character-signatures-wave-3 proposal. Then update design/DESIGN-READINESS.md Section 4's sentence (lines 126-130) to add "spatial-race-identity-set-wave-2.md" to the list of covered files, making the new test GREEN. Do not change Section 4's card-anatomy paragraph, alt-art-briefs.md paragraph, the "Known gap — resolved" bullet, any other section of DESIGN-READINESS.md, or any file under design/cards/ — this unit only adds the one missing filename to Section 4's existing sentence and adds the new mechanical test. Regenerate site/ via tools/build-site.js.

## Acceptance Criteria

- AC1 [inferred]: test/design-readiness.test.js contains a new test asserting that for every design/cards/*.md file parsing to 1+ cards via lib/parse-card-markdown.js, if all of that file's card names appear as "###" headings in design/cards/art-briefs.md, the filename is cited in DESIGN-READINESS.md's Section 4 ("Card Anatomy & Art Brief Coverage") text
- AC2 [paraphrase]: design/DESIGN-READINESS.md's Section 4 sentence is updated to cite "spatial-race-identity-set-wave-2.md" alongside the 8 files it already names, and this is the only content change made to the file
- AC3 [paraphrase] (held_out): The new test does not require design/cards/character-signatures-wave-3.md (currently 0% art-brief coverage) to be cited in Section 4 — proving the check keys off actual brief coverage, not mere file existence on disk
- AC4 [inferred]: No section of design/DESIGN-READINESS.md other than Section 4's covered-files sentence, and no file under design/cards/, is changed from its content before this unit
- AC5 [paraphrase]: All pre-existing AC1-AC5 tests in test/design-readiness.test.js continue to pass unmodified, and site/design/DESIGN-READINESS.html is regenerated via tools/build-site.js to match the updated markdown

## Plan

GATE: none

# Plan: cardgame-design-readiness-section4-live-derived-check

## Spec-accuracy note (read first — do not silently plan around this)

The unit intent's example is stale relative to the current repo state, but
the fix below still fully satisfies AC1–AC5 as written. Details:

- The intent text says `design/cards/character-signatures-wave-3.md` is
  "currently 0% art-brief coverage" and uses it as the reason AC3's
  coverage-driven (not disk-driven) check matters. That is no longer true:
  a separate unit (`cardgame-art-briefs-character-signatures-wave-3`,
  already merged per `git log` — see commits `bed9924`/`e0aeefb`) added all
  5 of that file's art briefs to `art-briefs.md` (headings at lines
  859/876/893/908/925). `character-signatures-wave-3.md` is **already
  fully covered and already cited** in Section 4's sentence today.
- This does not break AC3's *intent*. There is a real, currently-existing
  negative example that exercises the same "coverage-driven, not
  disk-driven" branch: `design/cards/frontier-worlds-set.md` (5 cards:
  Halvorne Reclamation Fleet, Tanglekeeper's Vigil, Kelmourn Wreck-Bloom,
  Kelmourn Claim Ledger, Tallowfen Chokepoint Works) has **zero** of its
  card names as `###` headings anywhere in `art-briefs.md`, and today's
  Section 4 sentence correctly does not cite it. Because the new test (see
  below) computes coverage live from disk rather than hardcoding
  `character-signatures-wave-3.md` as "the uncovered example," it
  automatically exercises this negative case via `frontier-worlds-set.md`
  without needing to name it. AC3 is satisfied by construction, not by
  coincidence — do not add any special-casing for either filename.
- I verified by hand (reading both files and grepping `^### ` in
  `art-briefs.md`) that after this unit's Section 4 edit, all 10
  card-set files with 1+ parsed cards that are fully covered by
  `art-briefs.md` will be cited in Section 4, and the 1 file that is not
  covered (`frontier-worlds-set.md`) correctly remains uncited there (it
  *is* cited in Section 3, which is a separate, already-passing check).
  No file under `design/cards/` needs to change — AC4 holds.

No confirmation needed from the user; this is just context so the builder
doesn't "fix" the intent text or contort the test to match the stale
example. Proceed with the plan below as written.

## Files touched

1. `test/design-readiness.test.js` — add one new test (builder may write
   this; it is a new test, not an edit to a pre-existing assertion, so it
   does not trigger the "existing-test edits go to the test-writer" rule).
2. `design/DESIGN-READINESS.md` — edit exactly one sentence in Section 4.
3. `site/` (generated) — regenerate via `node tools/build-site.js`.

Do not touch any other file. Do not touch any file under `design/cards/`.

---

## Step 1 — add the new test to `test/design-readiness.test.js`

Current imports at the top of the file already include everything needed:

```js
const { parseSections, sectionText } = require('./helpers/markdown');
const { loadCardsFromFile } = require('../lib/parse-card-markdown');
```

and module-scope constants/values already exist:

```js
const DOC_PATH = path.join(__dirname, '..', 'design', 'DESIGN-READINESS.md');
const CARDS_DIR = path.join(__dirname, '..', 'design', 'cards');
...
const content = fs.existsSync(DOC_PATH) ? fs.readFileSync(DOC_PATH, 'utf8') : '';
const sections = parseSections(content);
```

Add a new `const ART_BRIEFS_PATH` near the top, alongside the other
`*_PATH` constants (after `const RACES_DIR = ...` on line 14):

```js
const ART_BRIEFS_PATH = path.join(__dirname, '..', 'design', 'cards', 'art-briefs.md');
```

Then append this new test at the **end of the file**, after the existing
`AC5: closes with a numbered list of at least 3 open gaps` test (i.e.
after the current final `});` and closing comment block, so it reads as
the newest addition):

```js
// ---------------------------------------------------------------------------
// AC7 (new, mechanical): Section 4's art-brief-coverage sentence is derived
// live from actual brief coverage, not hand-typed. For every design/cards/
// file that parses to 1+ real cards, if every one of that file's card names
// appears as a "###" heading anywhere in art-briefs.md, the filename must be
// cited in the "Card Anatomy & Art Brief Coverage" section text. Files with
// partial or zero art-brief coverage are NOT required to be cited — this is
// what keeps the check from racing with an art-briefs proposal that's still
// in flight for some other file.
// ---------------------------------------------------------------------------

test('AC7: every card-set file fully covered by art-briefs.md is cited in Section 4\'s coverage sentence', () => {
  const artBriefsContent = fs.readFileSync(ART_BRIEFS_PATH, 'utf8');
  const briefTitles = new Set(
    parseSections(artBriefsContent)
      .filter((s) => s.level === 3)
      .map((s) => s.title)
  );

  const section4 = sectionText(sections, /card anatomy & art brief coverage/i);
  assert.ok(
    section4,
    'expected a "Card Anatomy & Art Brief Coverage" section in design/DESIGN-READINESS.md'
  );

  const files = fs
    .readdirSync(CARDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();

  const cardSetFiles = files.filter(
    (file) => loadCardsFromFile(path.join(CARDS_DIR, file)).length > 0
  );
  assert.ok(cardSetFiles.length > 0, 'expected at least one real card-set file under design/cards/');

  for (const file of cardSetFiles) {
    const cardNames = loadCardsFromFile(path.join(CARDS_DIR, file)).map((c) => c.name);
    const fullyCovered = cardNames.every((name) => briefTitles.has(name));
    if (!fullyCovered) continue;

    assert.ok(
      section4.includes(file),
      `expected Section 4 ("Card Anatomy & Art Brief Coverage") to cite "${file}" — ` +
        `all ${cardNames.length} of its card(s) already have an art-brief section in art-briefs.md`
    );
  }
});
```

Notes for whoever types this in:

- `sectionText(sections, /card anatomy & art brief coverage/i)` matches
  against the module-scope `sections` (parsed from `DESIGN-READINESS.md`),
  the same pattern `AC5`'s test already uses one section up
  (`sectionText(sections, /open gaps|unresolved questions/i)`). It returns
  the section's body text (excluding its own heading line) — that's fine,
  because the filenames we're checking for live in the body, not the
  heading.
- `briefTitles` reuses the exact same "parse `###` headings out of a file"
  approach `test/design-alt-art-briefs.test.js`'s `briefSections()` helper
  already uses (`parseSections(content).filter(s => s.level === 3)`) — do
  not import that helper (it's private to that test file), just inline the
  one-liner as shown above.
- Do not special-case any filename (not `character-signatures-wave-3.md`,
  not `frontier-worlds-set.md`, not `spatial-race-identity-set-wave-2.md`).
  The test must stay purely computed from disk + the doc text.

---

## Step 2 — edit `design/DESIGN-READINESS.md` Section 4

Find this exact paragraph in Section 4 ("## 4. Card Anatomy & Art Brief
Coverage") — currently:

```
- **`design/cards/art-briefs.md`** — 59 art-brief sections, covering every
  card in `alpha-set.md`, `frontier-set.md`, `character-signatures.md`,
  `character-signatures-wave-2.md`, `character-signatures-wave-3.md`,
  `fount-economy-set.md`, `wormhole-restrictions-set.md`,
  `wormhole-closure-cards.md`, and `spatial-race-identity-set.md`.
```

Replace it with (only change: append `spatial-race-identity-set-wave-2.md`
to the list; do not touch the "59 art-brief sections" count — it is
already correct and already includes Bloom Fount / Circuit Fount):

```
- **`design/cards/art-briefs.md`** — 59 art-brief sections, covering every
  card in `alpha-set.md`, `frontier-set.md`, `character-signatures.md`,
  `character-signatures-wave-2.md`, `character-signatures-wave-3.md`,
  `fount-economy-set.md`, `wormhole-restrictions-set.md`,
  `wormhole-closure-cards.md`, `spatial-race-identity-set.md`, and
  `spatial-race-identity-set-wave-2.md`.
```

Do not touch:
- The `card-anatomy.md` bullet immediately above it.
- The `alt-art-briefs.md` bullet immediately below it.
- The "**Known gap — resolved:**" bullet below that.
- Any other section of the file (Sections 1, 2, 3, 5, 6, ...).

(The unit's intent text cites "lines 126-130" for this sentence; in the
current file on this branch it is around lines 131-135. Locate it by the
exact text shown above, not by line number — other merges may have shifted
it further by the time this bolt runs.)

---

## Step 3 — regenerate the site

From the repo root, run:

```
node tools/build-site.js
```

This is the same invocation `test/build-site.test.js` uses
(`execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT })`). It
rewrites `site/design/DESIGN-READINESS.html` (and every other generated
page) from the current markdown sources. Confirm
`site/design/DESIGN-READINESS.html` now contains the string
`spatial-race-identity-set-wave-2.md` in its rendered Section 4 (a quick
`grep` or an editor search is sufficient).

---

## Step 4 — verify

Run the full suite from the repo root:

```
node --test
```

Expected output: all tests pass, including:
- The new `AC7: every card-set file fully covered by art-briefs.md is cited in Section 4's coverage sentence` test in `test/design-readiness.test.js` (PASS).
- The pre-existing `AC1`–`AC5` tests in `test/design-readiness.test.js` (all still PASS, unmodified).
- `test/build-site.test.js` and any other test that reads
  `site/design/DESIGN-READINESS.html` (still PASS, since Step 3 already
  regenerated it to match).

No test count regression — the suite should show one additional passing
test versus the pre-unit baseline, zero failures.

---

## Risk assessment (FIRE)

- **Reversibility**: trivial — a one-sentence markdown edit, one new test,
  and a regenerated static site directory. Fully revertible with `git
  checkout`.
- **Security impact**: none. No code paths touched beyond test/doc/static
  site generation.
- **User data**: none involved.
- **Schema changes**: none.

Risk class: standard, matches `unit.md`'s own `risk_class: standard`. No
gate needed.


## Findings

# Blind Review — cardgame-design-readiness-section4-live-derived-check (cycle 1)

## Verification performed

Read the diff, then cross-checked against the actual repo file state (not just
the diff text): `design/DESIGN-READINESS.md` Section 4, `test/design-readiness.test.js`
(full file), `lib/parse-card-markdown.js`, `test/helpers/markdown.js`, and grepped
`### ` headings in every `design/cards/*.md` file plus `art-briefs.md`.

- `art-briefs.md` has exactly 59 `###` headings — matches the unchanged "59
  art-brief sections" count in Section 4.
- `spatial-race-identity-set-wave-2.md` has exactly 2 cards: "Bloom Fount"
  (line 30) and "Circuit Fount" (line 48), both present verbatim as `###`
  headings in `art-briefs.md` (lines 832, 844). Fully covered — the new
  filename citation is correct.
- Manually re-derived full coverage for all 10 card-set files the new AC7
  test will assert citation for (alpha-set.md, frontier-set.md,
  character-signatures.md, character-signatures-wave-2.md,
  character-signatures-wave-3.md, fount-economy-set.md,
  wormhole-restrictions-set.md, wormhole-closure-cards.md,
  spatial-race-identity-set.md, spatial-race-identity-set-wave-2.md): every
  card name in each file matches a `###` heading in art-briefs.md exactly.
  All 10 are cited in the post-edit Section 4 sentence.
- `frontier-worlds-set.md` (5 cards) has zero of its card names anywhere in
  `art-briefs.md` (confirmed via grep) — correctly stays uncited in Section
  4, exercising the "coverage-driven, not disk-driven" negative branch the
  new test needs, exactly as the plan's spec-accuracy note predicted.
- `test/design-readiness.test.js`: only change is the added `ART_BRIEFS_PATH`
  const and the new AC7 test appended at the end. AC1–AC5 test bodies are
  byte-identical to before — pre-existing tests are unmodified per AC5.
- `sectionText(sections, /card anatomy & art brief coverage/i)` correctly
  targets Section 4 only (verified `parseSections`/`sectionText` logic in
  `test/helpers/markdown.js`) — it's a substring match against the "## 4.
  Card Anatomy & Art Brief Coverage" heading title, scoped by heading level,
  so it can't accidentally match Section 3 or bleed into Section 5.
- `design/DESIGN-READINESS.md`: diff touches only the one sentence in
  Section 4 (adds `spatial-race-identity-set-wave-2.md` to the file list).
  The card-anatomy paragraph, alt-art-briefs.md paragraph, and "Known gap —
  resolved" bullet are untouched, matching the surrounding unmodified lines
  shown in the diff context.
- `site/design/DESIGN-READINESS.html`: the diff hunk is a mechanical
  reflection of the single markdown sentence change (same `<code>`-wrapping
  pattern used elsewhere in that generated file) — consistent with a plain
  `tools/build-site.js` regeneration, not a hand-edit.
- No file under `design/cards/` is touched by this diff.

## AC-by-AC accounting

- **AC1** — satisfied. `test/design-readiness.test.js` gains exactly the
  described test: for every `design/cards/*.md` file parsing to 1+ cards via
  `loadCardsFromFile`, if all its card names are `###` headings in
  `art-briefs.md`, it asserts the filename appears in Section 4's text.
  Verified by hand that the assertion is true for the current repo state.
- **AC2** — satisfied. Section 4's sentence now cites
  `spatial-race-identity-set-wave-2.md` alongside the 8 pre-existing files
  (9 total before, matches "alongside the 8 files it already names"). Diff
  shows this is the only content change to the file.
- **AC4** — satisfied. Diff touches no other section of
  `design/DESIGN-READINESS.md` and no file under `design/cards/`.
- **AC5** — satisfied. AC1–AC5 test bodies unmodified (only a new const and
  a new test appended). `site/design/DESIGN-READINESS.html` diff matches the
  markdown change and is consistent with a `tools/build-site.js` run.

Note: the unit's visible AC list jumps AC1→AC2→AC4→AC5 (no AC3 listed) —
accounted for as-given; nothing was skipped.

## Findings

None. Could not execute `node --test` in this review sandbox (command
execution was blocked by the harness's permission gate for this hat), so
correctness was established by manual/static verification instead: reading
the full test file, the shared markdown-section-parsing helper, the card
parser, and grepping every card-set file's `###` headings against
`art-briefs.md`'s `###` headings by hand. All match what the diff claims.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-31T01:10:33.710Z] **bolt:start** — unit=cardgame-design-readiness-section4-live-derived-check start_sha=797a3e745e2f342915aff1b70e42d1c68f2fc837 branch=bolt/cardgame-design-readiness-section4-live-derived-check worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-design-readiness-section4-live-derived-check
- [2026-07-31T01:10:44.724Z] **baseline:done** — pre-edit test exit=0
- [2026-07-31T01:15:40.473Z] **plan:done** — plan.md written
- [2026-07-31T01:17:43.409Z] **tests:done** — RED verified on test/design-readiness.test.js (exit=1)
- [2026-07-31T01:19:58.639Z] **build:c1** — tests green, committed
- [2026-07-31T01:22:05.011Z] **review:c1** — APPROVE
- [2026-07-31T01:26:04.625Z] **review:devils-advocate** — APPROVE
- [2026-07-31T01:26:16.358Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-31T01:26:16.736Z] **merge:done** — auto-merged bolt/cardgame-design-readiness-section4-live-derived-check into master (worktree)


## Receipt

```json
{
  "start_sha": "797a3e745e2f342915aff1b70e42d1c68f2fc837",
  "end_sha": "2726f31070c868e0cdb1af1d708d0aa171f80ecb",
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
  "timestamp": "2026-07-31T01:26:16.356Z",
  "valid": true,
  "agent_reports": {
    "planner": "Working tree is clean — the repo itself is untouched; `plan.md` is the only file written.\n\n**Summary:** Wrote the plan to `C:\\github\\AgentBox\\units\\cardgame-design-readiness-section4-live-derived-check\\plan.md` (`GATE: none`). It specifies:\n\n1. A new live-derived test in `test/design-readiness.test.js` that, for every `design/cards/*.md` file parsing to 1+ cards, checks whether all its card names appear as `###` headings in `art-briefs.md`, and if so asserts the filename is cited in Section 4's text.\n2. The exact one-sentence edit to `design/DESIGN-READINESS.md` Section 4, adding `spatial-race-identity-set-wave-2.md` to the covered-files list.\n3. Regenerating `site/` via `node tools/build-site.js`.\n\nI flagged one spec-accuracy issue in the plan: the unit's premise that `character-signatures-wave-3.md` is \"currently 0% covered\" is stale — I verified by hand it's actually already fully covered and cited (a separate unit landed that art-brief set). The good news is `frontier-worlds-set.md` (0% coverage today, correctly uncited in Section 4) already serves as the real negative example the test needs, so AC3's intent is still satisfied without any special-casing — I documented this so the builder doesn't try to \"fix\" the intent text or hardcode either filename.",
    "test_writer": "Confirmed both card names are covered as `###` headings in art-briefs.md, and Section 4's text doesn't currently cite `spatial-race-identity-set-wave-2.md` — so the new AC7 test will fail right now, exactly as required for a Test Writer bolt. I wasn't able to execute `node --test` directly in this session (all `node`/`npm` invocations require approval that isn't being granted), but I verified the RED condition by direct source inspection instead.\n\nSummary of what I did:\n- Added `ART_BRIEFS_PATH` constant and a new `AC7` test to `test/design-readiness.test.js` (per plan.md's Step 1, verbatim) that mechanically checks: for every `design/cards/*.md` file parsing to 1+ cards, if all its card names appear as `###` headings in `art-briefs.md`, the filename must be cited in DESIGN-READINESS.md's Section 4 text.\n- No files under `src/` or `design/` were touched — only `test/design-readiness.test.js`.\n- Verified by reading the source files that `spatial-race-identity-set-wave-2.md`'s two cards (Bloom Fount, Circuit Fount) are already briefed in `art-briefs.md`, but Section 4 doesn't cite that filename yet — so AC7 fails now, confirming RED status.",
    "builder_c1": "All 1246 tests pass. Suite is green.\n\n**Summary:** Section 4 of `design/DESIGN-READINESS.md` now cites `spatial-race-identity-set-wave-2.md` alongside the other 9 fully-covered card-set files. The new `AC7` test (already present in `test/design-readiness.test.js` from the test-writer stage) derives coverage live from `art-briefs.md`'s `###` headings, so this can't drift again. Regenerated `site/design/DESIGN-READINESS.html` via `tools/build-site.js`, and committed both files as `feat(cardgame-design-readiness-section4-live-derived-check): ...` (matching this repo's established builder-commits-its-own-work pattern, which is what satisfies the pre-existing `card-template-helper.test.js` AC4 check that the `design/` working tree stays clean).",
    "reviewer_c1": "No findings — the diff matches the spec exactly. I manually verified every AC against actual repo state (card names, art-brief headings, section text scoping) since command execution was blocked in this review sandbox; everything checked out.\n\nAPPROVE",
    "devils_advocate": "I attacked this from several angles: whether AC7's coverage-detection logic (substring citation match, `###`-heading extraction, `loadCardsFromFile` gating) could produce false positives/negatives against the *actual* current repo state — not just the two files this unit touches — and whether the diff's scope actually stayed within the stated bounds.\n\nFindings from static verification (bash execution of `node --test`/`node tools/build-site.js` was blocked by sandbox in this session, so this is diff+source tracing, not a live run):\n\n- Verified `design/cards/art-briefs.md` has exactly 59 `###` headings, including \"Bloom Fount\" (line 832) and \"Circuit Fount\" (line 844) — matches the claim that wave-2's 2 cards are already briefed.\n- Checked every other card-set file under `design/cards/` (including the untouched `frontier-worlds-set.md`, which is *not* cited in Section 4) against those 59 headings — none of its 5 card names appear, so AC7 correctly skips it rather than wrongly demanding a citation. No false-positive failure risk from files this diff didn't touch.\n- Substring-match risk (`section4.includes(file)`) checked for collision, e.g. `spatial-race-identity-set.md` vs. `...-wave-2.md`: the `.md` suffix boundary prevents any false match either direction.\n- `git diff --stat` across the unit's two commits confirms only the 3 expected files changed (doc sentence, regenerated HTML, new test) — satisfies AC2/AC4's \"only content change\" constraint.\n- HTML diff mirrors the markdown's line-join/double-space wrapping convention already present elsewhere in the same file, consistent with script regeneration rather than hand-editing.\n\nNo INTRODUCED defect survived scrutiny — the mechanism is spec-compliant and doesn't collide with any file it wasn't supposed to touch.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
