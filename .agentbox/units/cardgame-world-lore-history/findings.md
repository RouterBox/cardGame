# Review Findings — cardgame-world-lore-history (cycle 1)

Blind review of diff against unit.md (visible ACs) and plan.md. Verified statically
(regex/section tracing through `test/helpers/markdown.js`'s `parseSections`) plus
direct inspection of `design/world.md` and `design/races/*.md` H1 titles, since
`node --test` / `npm test` execution was blocked by the sandbox's approval gate in
this session.

## AC coverage

- **AC1** — `design/lore.md` exists at repo root, sibling to `world.md`/`rules.md`. Confirmed
  present on disk. Satisfied.
- **AC2** — `## Timeline of Eras` heading lists 6 numbered eras (Weave Age, Sundering, Long
  Dark, Five Risings, Cinderglass War, Current Era). Exceeds the 4-era minimum. Satisfied.
- **AC3** — `## The Cinderglass War` section names 4 of the 5 races directly as combatants
  (Cindral Reach, Wrought Assembly, Panoptic Concord, Starweave Communion) plus the 5th
  (Mireth Bloom) as the non-combatant who inherits the wreckage — exceeds the 3-race minimum
  by a wide margin. Race names verified against the exact H1 spellings in
  `design/races/*.md` (`# The Cindral Reach`, `# The Mireth Bloom`, `# The Panoptic Concord`,
  `# The Starweave Communion`, `# The Wrought Assembly`). Satisfied.
- **AC4** — Verified `design/world.md` independently defines "Cosmology: The Five Founts"
  with the same five current names (the Mass, the Bloom, the Signal, the Circuit, the
  Tangle) referenced in `lore.md`'s "Five Risings" section. No new Fount or mechanic is
  invented; the document explicitly disclaims doing so ("None of it needs a new war, a new
  Fount, or a new mechanic"). Satisfied.
- **AC5** — Final `##` section is `Current Era: The Uneasy Expanse`, describing the state of
  the galaxy at the point the Alpha set is drawn from and explicitly tying each race to a
  flavor-text hook. Substantive (multiple paragraphs, well over the 100-char floor the test
  checks). Satisfied.

## Findings

None. No INTRODUCED defects found.

### Note (non-blocking, informational only)

plan.md's "Write exactly this content" block titles the document "The Long Record — A
**History** of the Amaranth Expanse," but the file actually shipped titles it "The Long
Record — A **Chronicle** of the Amaranth Expanse" (consistently — in the `# H1`, the
generated `site/design/lore.html` `<title>`, and the `site/index.html` link text all agree
with each other). This is a harmless wording deviation from the plan's literal draft, not a
defect: it doesn't affect any AC, isn't internally inconsistent, and doesn't collide with
any other document's naming. Mentioning only for the record.

## Out-of-scope / side-effect files

`site/design/lore.html` (new) and `site/index.html` (+6 lines, new "Other" section entry)
are both auto-generated side effects of `tools/build-site.js` running during `node --test`,
exactly as plan.md's "Out of scope" section predicts and pre-authorizes. `tools/build-site.js`
itself is untouched. No other `design/*.md`, `gamePlan.md`, or unrelated `test/*.js` files
are touched. Scope matches the plan.

## Verdict

APPROVE
