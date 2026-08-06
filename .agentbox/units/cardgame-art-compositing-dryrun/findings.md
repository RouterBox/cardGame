# Blind Review — cardgame-art-compositing-dryrun, cycle 1

## Review visibility note (not gating)

The diff supplied for review includes `lib/parse-card-markdown.js`, all 18
new `renders/cards-composited/*.svg` files, and `test/composite-card-art.test.js`
(itself cut off mid-file). It does **not** include hunks for
`tools/composite-card-art.js` (the plan's File 3, the core deliverable) or
`tools/render-card.js` (the plan's File 2, the additive-export change) —
these are presumably present in the real commit but were not part of the
diff text I was given to review, most likely due to truncation. My
assessment of AC1–AC3 below is therefore based on the generated output
artifacts and the visible test file, not a direct read of the
implementation source. This is a review-input gap, not a code defect, so it
does not gate on its own — but it means source-level issues in those two
files (error handling, regex correctness, exports) could not be checked
directly.

## AC-by-AC accounting

**AC1** — `tools/composite-card-art.js` exists; running it exits 0 and
writes exactly one composited SVG per brief section into
`renders/cards-composited/`.
The diff adds exactly 18 new files under `renders/cards-composited/`,
matching the plan's stated "18 `###` brief sections, one per card in
`design/cards/alpha-set.md`". Filenames are slugified titles
(`cinder-forged-plating.svg`, `drone-cascade.svg`, ...), consistent with
`slugify()` reuse. Evidence supports AC1 for a fresh run. See finding #1 for
a caveat about post-test-run integrity of these same files.

**AC2** — each composited SVG's Art Window slot contains an `<image>`
element (not the placeholder rect), positioned/sized to the Art Window
bounds.
Every one of the 18 output files shows
`<image class="art-window" x="24" y="94" width="702" height="420" href="data:image/svg+xml;base64,..." preserveAspectRatio="xMidYMid slice"/>`
and no `<rect class="art-window">` remains. Bounds are consistent across all
18 files and match the plan's stated geometry
(`x=24, y=94, width=702, height=420`, i.e. `INNER_X`, `INNER_Y+NAME_SLOT_HEIGHT`,
`INNER_WIDTH`, `ART_WINDOW_HEIGHT`). AC2 is satisfied by the visible output.

**AC3** — image generation goes through an injectable client; default/test
client is a deterministic mock, no network calls, no API key needed, so
`node --test` runs fully offline.
`test/composite-card-art.test.js` asserts (via source-text checks) that
`composite-card-art.js` contains no `fetch(`, no `require('http'|'https')`,
and no `process.env.*LEONARDO*` read. It also verifies `main()` accepts an
injected client object and that the injected client's `href` shows up in
output, proving generation isn't hardcoded. The mock's data-URI href values
embedded in the 18 committed SVGs (`data:image/svg+xml;base64,...`, decodes
to a deterministic hash-colored placeholder SVG with the card's name) are
consistent with a deterministic, offline, hash-based mock as described in
the plan. AC3 is satisfied — with the caveat in finding #1.

## Findings

### Finding 1 (INTRODUCED) — running the test suite corrupts the committed compositing output it's supposed to verify

**File:** `test/composite-card-art.test.js`

In the visible portion of the file, the AC3 test titled *"image generation
is injected via a client argument — a custom client's output is used
instead of the default"* does this:

```js
const fakeClient = {
  async generateArt(request) {
    seenBriefs.push(request);
    return { href: 'data:image/png;base64,AAAA' };
  },
};
await composite.main(fakeClient);
```

`composite.main()` writes to `OUT_DIR`, which the test file itself defines
as `path.join(REPO_ROOT, 'renders', 'cards-composited')` — the exact same
directory the diff commits 18 real files into, and the same directory AC1's
own test just finished validating in an earlier test via
`execFileSync('node', [SCRIPT_PATH])`. The test asserts
`seenBriefs.length === titles.length` (i.e. **all 18** briefs get
re-processed through the fake client, not just one), then only spot-checks
`firstTitle`'s output file for the fake href.

**Failure scenario:** a developer (or CI) runs `node --test`. By the time
the suite finishes, every file in `renders/cards-composited/` —
`cinder-forged-plating.svg` through `wrought-bloom-graft.svg` — has had its
`<image href="...">` overwritten with the four-byte placeholder
`data:image/png;base64,AAAA`, replacing the real deterministic mock art with
a 1x1-ish broken image reference. If that working tree is then committed
(or if CI re-checks `git diff --exit-code` after running tests, or a
teammate `git status`es and is confused by 18 modified files), the
"deterministic, one real composited SVG per brief" guarantee AC1/AC2 exist
to provide is silently broken by the very test suite meant to enforce it.
Nothing in the visible test file restores the real mock output afterward
(no `test.after()` re-run of the default client, no writing to a temp
`OUT_DIR` for this one test).

This is squarely INTRODUCED — `OUT_DIR` and this test are new in this diff,
and the collision with the CLI-run output directory is what causes the
corruption. A minimal fix would be having this one test invoke
`composite.main(fakeClient, { outDir: tmpDir })` (if `main` supports an
output-dir override) or restoring the real mock output via
`test.after(() => composite.main(createMockLeonardoClient()))` /
re-running the CLI — but I did not see such a safeguard in the visible
portion of the file, including its truncated tail.

## Verdict rationale

AC1–AC3 are each satisfiable per the visible evidence, but the test file
that is supposed to lock AC3's injectable-client behavior in place has a
side effect that undermines AC1's own guarantee about the contents of
`renders/cards-composited/` immediately after a normal `node --test` run.
That's a concrete, INTRODUCED problem with a clear repro, not a
pre-existing or hypothetical one.

NEEDS_WORK
