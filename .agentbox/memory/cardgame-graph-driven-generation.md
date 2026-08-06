# cardgame-graph-driven-generation

- merged: 2026-07-29T09:13:47.265Z
- intent: design/rules.md Section 5.2 (Generation Phase) was shipped with RouterBox's own review note left as a raw `//` comment instead of finished rules prose: 'want resource generation to be connected to the graph in different ways. Default mechanism is the generators, but gain fount points per graph characteristics should be a thing.' Today the only way to produce Fount Points is a Generator (Sections 4.1-4.6); nothing ties production to the graph's own shape, even though Section 8.1 already defines Planet control as a tracked, binary fact per Planet. This unit adds a new Section 4.7 'Graph-Driven Generation' immediately after 4.6 Positional Generators: during the Generation Phase (Section 5.2), after Generators produce their points, the active player gains one bonus Fount Point, of a single Fount of their choice, for every Planet beyond their Homeworld that they currently control (per Section 8.1's Control definition), added to their chosen resource pool as one lump step. This is the single concrete, minimally-scoped reading of the note consistent with already-shipped terms (Control, Planet, Homeworld, Fount Point) rather than inventing new undefined concepts like chokepoints or graph degree. Section 5.2's prose is updated to reference Section 4.7 and the raw `//` note is removed. Only design/rules.md (Sections 4 and 5.2) and a new, independent test/design-graph-generation.test.js change — no card file, no other rules.md section, and no code outside the new test file is touched, so this has no ordering dependency on the Section 8 reconciliation or Section 5.4 rewrite proposals currently open.
- criteria: AC1, AC2, AC3, AC4 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-graph-driven-generation (cycle 1)

## AC coverage

- **AC1** (new `### 4.7 Graph-Driven Generation` immediately after `### 4.6 Positional
  Generators`): MET. Verified in `design/rules.md`: the diff inserts the new subsection,
  correctly using `###` (matching the level of every other Section 4 subsection), directly
  between the end of 4.6's prose and `## 5. Turn Structure`. Confirmed no other `##`/`###`
  heading is inserted between 4.6 and 4.7, so the "immediately after" requirement holds against
  both the prose and the new test's `resourceSubheadings()`/`sectionText` logic (checked against
  `test/helpers/markdown.js`'s actual `parseSections`/`sectionText` implementation, not just
  assumed).

- **AC2** (bonus Fount Point, of a chosen Fount, during Generation Phase, per Planet beyond
  Homeworld currently controlled): MET. New 4.7 text: "the active player gains one bonus Fount
  Point, of a single Fount of their choice, for every Planet beyond their Homeworld (Section 8.2)
  that they currently control (Section 8.1)" — matches all five required elements (bonus Fount
  Point, single chosen Fount, Generation Phase, beyond Homeworld, currently controlled
