# Blind Review — cardgame-alt-art-briefs-compositing, cycle 2

## AC accounting

**AC1** — `design/cards/alt-art-briefs.md` exists, contains exactly 3 `###`
sections titled `Sporeknit Warden`, `Salvage-Wrought Bastion`, `Replicant
Foundry Core` verbatim, each with Palette/Subject-Scene/Key visual
elements/Composition lines in the same shape as `art-briefs.md`. **PASS.**
Verified directly from the diff content and cross-checked against
`design/cards/art-briefs.md`'s existing template shape (Palette: / Subject/Scene: /
Key visual elements: — bulleted / Composition:). All three sections present,
titled exactly as required, same field shape as the base briefs.

**AC2** — Each alt brief's Subject/Scene shares <50% significant words with
that card's base brief's Subject/Scene. **PASS.** Independently
hand-recomputed the word-overlap rule described in
`test/design-alt-art-briefs.test.js` (`significantWords`/stopword list) against
the actual base-brief text in `design/cards/art-briefs.md` for all three
cards:
- Sporeknit Warden: shared {warden, fungal, growth} = 3/24 alt words ≈ 12.5%
- Salvage-Wrought Bastion: shared {bastion, cindral, reach} = 3/23 alt words ≈ 13%
- Replicant Foundry Core: shared {} = 0/~22 alt words (plural/singular and
  synonym near-misses like "cores"/"core", "glow"/"glowing" don't
  string-match, by design of the rule)

All three comfortably clear the <50% bar. Matches the plan's own hand-count
table.

**AC3** — Running `composite-card-art.js` (mock client) leaves the 18
alpha-set `<slug>.svg` files unchanged, adds exactly 3 `<slug>-alt.svg`
files for the three alt-art cards, and no other card gets a `-alt.svg`.
**PASS for this run.** The base-brief loop in `main()` is untouched in its
SVG-generating logic (only the surrounding I/O plumbing changed), so base
`<slug>.svg` content should be byte-identical to a pre-unit run. The new alt
loop iterates only `alt-art-briefs.md`'s 3 sections and writes
`<slug>-alt.svg` for exactly those three. See the "Introduced" finding below
for a related but non-blocking regression in the output-merge mechanism.

## Findings

### INTRODUCED — `tools/render-card.js` was modified in direct violation of the plan's explicit "do not touch" list

**File:** `tools/render-card.js`
**Summary:** The diff makes a 94-line change to `tools/render-card.js`
(new `crypto` import, a new cross-process lock, a tmp-dir-then-rename
rewrite of `main()`) even though both the Intent ("No existing brief, card
file, or `tools/render-card.js` is touched — this only adds a second,
optional brief source and a second, additively-named output file to the
already-shipped compositing tool.") and plan.md ("Files that must remain
byte-identical to their current state (per AC4, held out): ... `tools/render-card.js`.
Do not open these files in an editor and save them even without changes —
just don't touch them.") explicitly forbid it.

**Failure scenario:** This is a hard scope violation regardless of whether
the change itself is sound. Concretely, `git diff c8de43e HEAD -- tools/render-card.js`
shows the file changed from `af1eeb0` to `4573404` — not byte-identical.
Any downstream check that verifies AC4 (held out, presumably a byte-identity
check against this file) will fail this unit outright.

**Root cause (also worth fixing, not just reverting):** The new
`test/composite-card-art-alt.test.js` added by this diff calls
`execFileSync('node', [RENDER_SCRIPT_PATH])` in its own `test.before()` —
but this test file never reads from `renders/cards/` (`PLACEHOLDER_DIR`)
at all; it only asserts against `renders/cards-composited/` (`OUT_DIR`),
and `composite-card-art.js`'s `renderCardSvg()` is called in-process
(imported straight from `render-card.js`), never reading
`renders/cards/*.svg` off disk. The `render-card.js` invocation in the new
test file's `before()` is dead setup with no consumer. Because node's test
runner runs each `*.test.js` file in its own process, and now *two* files
independently spawn `node tools/render-card.js` against the same shared
`renders/cards/` directory (the pre-existing `composite-card-art.test.js`
already did this; the new alt test file duplicates it unnecessarily), a
race was created that didn't exist before this diff. The Builder's fix for
that self-inflicted race was to add locking/tmp-dir logic to
`render-card.js` — the correct fix is instead to simply delete the
unneeded `execFileSync('node', [RENDER_SCRIPT_PATH])` call (and the
`renderError` plumbing around it) from `composite-card-art-alt.test.js`'s
`before()`, which removes both the race and the need to touch a
byte-identical-required file.

### INTRODUCED — output-merge in `composite-card-art.js` no longer purges stale files from `OUT_DIR`

**File:** `tools/composite-card-art.js` (`main()`, the `withOutDirLock` block)
**Summary:** The prior implementation did a whole-directory swap (rename
`OUT_DIR` aside, rename `tmpDir` into place, delete the backup), so
`OUT_DIR` after each run contained *exactly* the files produced by that
run — nothing else could survive. The new implementation instead merges
individual files one rename at a time into an `OUT_DIR` that is only
`mkdirSync(..., {recursive: true})`'d, never cleared, so any file already
present in `OUT_DIR` that isn't regenerated this run (e.g. a `-alt.svg`
for a card later removed from `alt-art-briefs.md`, or a base `.svg` for a
card removed from `art-briefs.md`) is left behind permanently.
**Failure scenario:** Not exercised by this diff's own test run (nothing
is being removed in this unit), so AC3 passes as written today. But it
silently weakens a guarantee the shipped tool used to provide — "no other
card gets a `-alt.svg` file" — from an invariant enforced by construction
every run, to one that only holds until the first alt brief is ever
renamed or removed, at which point its stale `-alt.svg` lingers
undetected. Given this is presented as the justification/pattern reused to
also rewrite `render-card.js` (see finding above), it's worth flagging as
a real behavior change even though no visible AC currently catches it.

## Not reviewed / out of scope
`site/**/*.html` and `site/index.html` changes are generated nav-link
diffs from adding a new page to the site index; content is otherwise
unchanged and consistent with adding one new sibling page. Not flagged.
