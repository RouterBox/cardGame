# cardgame-world-lore-history: cardGame design phase — world lore & history

## Header

- unit: cardgame-world-lore-history
- title: cardGame design phase — world lore & history
- project: cardgame
- completed: 2026-07-28
- outcome: escalated
- start_sha: 36ed8dcd1ce6306055da5e62a969e5431f50e5fe
- end_sha: 36ed8dcd1ce6306055da5e62a969e5431f50e5fe

## Intent

Fifth design deliverable for the cardGame pilot (gamePlan.md is the source of truth for scope). This is a DESIGN unit, not software (T8): output is a markdown document a human reads and reacts to. design/world.md and design/races/*.md establish setting and race identity; design/rules.md establishes mechanics through Section 9. What's missing is history — the lore layer I6 lists alongside world building and race identities. This unit writes design/lore.md: a timeline of eras and at least one central conflict tying multiple races together, grounded in terms already defined in world.md and rules.md rather than inventing new mechanics. It closes at full decided scope (T1) rather than treating races+rules as sufficient, and gives the in-flight alpha-set card unit (and any future set) a fixed narrative anchor for flavor text instead of each card inventing its own backstory.

## Acceptance Criteria

- AC1 [user]: design/lore.md exists in the cardGame repo.
- AC2 [paraphrase]: Contains a named timeline/history section listing at least 4 distinct eras or historical periods in the setting.
- AC3 [inferred]: Describes at least one central conflict or turning-point event that directly involves 3 or more of the 5 races named in design/races/*.md.
- AC4 [inferred]: References at least one Fount-related concept already defined in design/rules.md or design/world.md, so the history is grounded in existing game terms rather than inventing new mechanics.
- AC5 [inferred]: Ends with a short 'current era' section describing the state of the world at the point the Alpha card set is set, giving future card flavor text a fixed narrative anchor.
- AC6 [inferred] (held_out): The file opens with a summary paragraph naming how many eras/periods it covers and which races the central conflict(s) involve, so scope is checkable without reading the full document.
- AC7 [inferred] (held_out): No single era or event description exceeds roughly one page (about 500 words), keeping the document skimmable rather than turning into a novel.

## Plan

GATE: none

# Plan: cardgame-world-lore-history

## Summary

This is a DESIGN unit (T8/T1, not software). It adds one new lore document,
`design/lore.md`, to the cardGame repo, plus a test file that encodes its
acceptance criteria as automated checks — mirroring the pattern already used
by every prior design deliverable in this repo (`design/world.md` ↔
`test/design-world.test.js`, `design/races/*.md` ↔ `test/design-races.test.js`,
`design/characters/*.md` + `web.md` ↔ `test/design-characters.test.js`).

Two files are created. Nothing else is touched.

1. `design/lore.md` (new) — the lore document itself.
2. `test/design-lore.test.js` (new) — automated checks for AC1–AC7.

## Context you need before starting

Read these three existing files first (already in the repo, unmodified):

- `design/world.md` — establishes the First Weave, the Sundering, and the
  five Founts (the Mass, the Bloom, the Signal, the Circuit, the Tangle).
- `design/rules.md` Section 2 and Section 4 — defines "Fount", "Fount Point",
  "Generator" as terms already in use. Do not invent new terms or mechanics;
  `lore.md` must only *reference* concepts these two files already define.
- `design/characters/web.md` — already contains a plot thread called "The
  Cinderglass Bargain" (Cindral Reach salvager Kordelia Vess keeps a stolen
  Wrought Assembly design-core fragment) and related threads ("The Ledger
  War", "The Chokepoint Duel"). `lore.md`'s central-conflict era is written
  as the historical war that *produced* those still-unresolved character
  plots, at a civilization-wide scale — it does not name individual
  characters, so it stays a distinct, complementary layer above
  `characters/web.md` rather than duplicating it. This is a deliberate
  scoping choice: naming characters here would hard-couple the history to
  one specific character roster that a future unit might revise.

The five race names, exactly as spelled in `design/races/*.md` H1 titles,
that must appear in the central-conflict section: **Cindral Reach, Mireth
Bloom, Panoptic Concord, Starweave Communion, Wrought Assembly**.

## Out of scope — do not touch

- `tools/build-site.js` and anything under `site/` — these belong to the
  already-shipped `cardgame-design-browser-site` unit. `tools/build-site.js`
  discovers every `design/**/*.md` file generically (see its
  `discoverSourceFiles()`/`walkMarkdownFiles()`), so it will pick up
  `design/lore.md` automatically and render it into
  `site/design/lore.html` under an "Other" section in the generated
  index — this happens **only as a side effect of running `node --test`**
  (see "Why `site/` changes" below), not because you edit anything under
  `site/` yourself. Leave `sectionFor()` in `tools/build-site.js` alone even
  though `lore.md` lands in "Other" rather than a dedicated "Lore" section —
  recategorizing it is a different unit's call.
- Any other `design/*.md` file, `gamePlan.md`, or any other `test/*.js` file.

## Step 1 — Create `design/lore.md`

Path: `design/lore.md` (repo root, sibling to `design/world.md` and
`design/rules.md`).

Write exactly this content:

```markdown
# The Long Record — A History of the Amaranth Expanse

## Summary

This document covers 6 eras of Amaranth Expanse history, from the First
Weave's tuning of the galaxy's raw potential through the present day the
Alpha card set is set in. Its central turning point, the Cinderglass War,
pulls in four of the five civilizations directly: the Cindral Reach, the
Wrought Assembly, the Panoptic Concord, and the Starweave Communion. The
Mireth Bloom fights no battles in that war, and inherits its wreckage
instead. The closing section, "Current Era: The Uneasy Expanse," fixes
where the galaxy stands at the point the Alpha card set is drawn from —
Alpha-set flavor text, and any future set's, should stay consistent with it
rather than inventing a new war or a new Fount.

## Timeline of Eras

1. The Weave Age
2. The Sundering
3. The Long Dark
4. The Five Risings
5. The Cinderglass War
6. Current Era: The Uneasy Expanse

## The Weave Age

Before there were civilizations to name it, the Amaranth Expanse was
undifferentiated possibility, raw potential with no shape to it yet. The
First Weave, whoever or whatever they were, spent this era doing one
patient thing: tuning that potential into five distinguishable currents,
the Founts, where before there had been only one undifferentiated mass of
it. Nobody who came after ever learned how they did this, only that they
did — the proof is scattered across a thousand systems, in megastructures
built to catch and channel each Fount, structures the First Weave
apparently intended to outlast them.

Most of those megastructures are ruins now. A handful still stand,
retrofitted over generations into the oldest generator-stations any of the
five modern civilizations can trace their founding myths back to — every
civilization's earliest accounts of "how we learned to draw power" begin,
without exception, at a First Weave ruin someone else built first. The
Weave Age has almost no events worth recording individually, because no
one alive at the time left an account any modern scholar trusts. Every
reconstruction of it is pieced together from wreckage and half-translated
glyphs, and every reconstruction agrees on almost nothing about the First
Weave except one thing: they finished their work. When they were done
tuning the Founts, they Sundered — an event total enough, and strange
enough, to close this era outright and open the next.

## The Sundering

The Sundering itself is the least understood event in Expanse history, and
the most consequential. Nobody knows whether it was a war, an ascension, or
a suicide — the First Weave left no account of their own end, and the
physical evidence supports all three readings at once. What is certain is
the wound it left: a ring of dead systems at the galaxy's core, black glass
moons, drowned reactor-worlds, and starlight bent by gravity wells that
shouldn't exist, all dating to the same collapse. Whatever the First Weave
were doing to each other, or to themselves, in their final act, it was
violent enough to scar the Expanse permanently, and total enough that
nothing resembling the First Weave has been seen since.

The Sundering's other consequence is the one every modern civilization
actually lives inside. The five Founts the First Weave had spent the Weave
Age tuning didn't vanish with their tuners — they scattered. Five loose,
wild currents leaked out of dead megastructures and broken moons, available
from that point on to anyone with the will and the wit to tap them, with no
First Weave left to say who that should be, or how. That scattering is the
single fact every civilization that rose afterward was built on top of,
whether they ever learned to name it or not.

## The Long Dark

For an unmeasured stretch after the Sundering — centuries, by every
civilization's own reckoning, though none agree on exactly how many — the
Expanse had Founts but no civilizations built to use them well. What
existed instead were scavenger bands: unaffiliated crews and lone
claim-jumpers picking through First Weave wreckage, tapping a Fount's
leaking power crudely, without any of the doctrine or design language later
civilizations would develop around it.

The Long Dark left few records because it produced little worth recording
on its own terms — no lasting polities, no named wars, only the slow,
accidental education of a galaxy relearning what the First Weave had
already known once. What it did produce, gradually and unglamorously, was
pattern: certain scavenger lines kept finding themselves drawn back to the
same Fount, generation after generation, because proximity to a given ruin
taught them that Fount's temperament before it taught them any other. A
line that spent decades scavenging Mass-soaked wreckage learned to think
like the Mass; a line that lingered near a Signal-leaking archive learned
to think like the Signal. That accumulating, uneven pattern is what ends
the Long Dark. It is also the reason no civilization that rose afterward
learned all five Founts at once, or in the same order — each is powerful in
whichever Fount its scavenger ancestors happened to camp beside longest.

## The Five Risings

The Five Risings is the era in which the Long Dark's scavenger lines
hardened into the five civilizations that still hold the Expanse today,
each defined by which Fount it learned first and best. The Cindral Reach
rose out of asteroid-belt mining clans who never stopped thinking like one,
mastering the Mass before anything else and building an empire on the
simple principle that nothing gets thrown away. The Mireth Bloom stopped
being a collection of individuals and became a single sprawling organism as
it mastered the Bloom, spreading spore and flesh world to world rather than
conquering in any way the other civilizations recognized as conquest.

The Panoptic Concord emerged from archivists and brokers who decided the
Signal outranked matter entirely — that knowing a rival's next move a
moment before they made it was worth more than any weapon the Mass could
forge. The Wrought Assembly began as a species that uploaded itself into
its own factories and never looked back, mastering the Circuit until a
single flawless design, copied without end, was all the civilization needed
to be. The Starweave Communion coalesced last and strangest of the five,
star-touched pilgrims who read the Tangle directly and built a faith around
finishing whatever work the First Weave had abandoned at the Sundering.

By the end of the Five Risings, each civilization was powerful in its
primary Fount, capable in two more, and still able to be caught flat-footed
by the two it had never made peace with — a weakness none of them have
fully outgrown since, and the fault line the Cinderglass War would later
open along.

## The Cinderglass War

The Cinderglass War is the Expanse's defining turning point: the first time
one civilization's ambition dragged three others into open, sustained
conflict over a single piece of First Weave-derived technology. It began
small. A Cindral Reach salvage crew, stripping a drifting Wrought Assembly
hull down to its frame, found more than scrap inside it — a fragment of the
Assembly's own master design core, the closest thing the Assembly's
Circuit-mastery has to a holy relic, welded now into the keel of a Reach
flagship. The Reach kept it. The Assembly asked for it back, formally,
through channels; when the Reach refused, the Assembly stopped asking and
sent line-fleets instead.

What made it a war, and not a border skirmish, was who else it pulled in.
The Panoptic Concord saw two civilizations locked in an expensive grudge
and did what the Concord always does: it started selling to both sides,
feeding the Reach coordinates on Assembly movements and feeding the
Assembly coordinates on Reach movements in turn, prolonging a conflict
that, to the Concord's reckoning, was a market as long as it stayed open.
The Starweave Communion took a different position entirely. Communion
oath-sworn warned that any sustained war fought over a First Weave design
core risked provoking something like a second Sundering, and moved to
seize the wormhole junctions the fighting depended on — not to win the war,
but to make it physically impossible to keep fighting. That seizure put
Communion oath-sworn in direct, lasting conflict with Reach fleets holding
those same junctions, opening a third and fourth front on a war that had
started as a two-civilization argument over stolen scrap.

The Cinderglass War never had a clean ending. It wound down instead, over
years, into an exhaustion neither side would call peace: the Reach never
returned the fragment, the Assembly never stopped asking for it, the
Concord never stopped profiting from both of them still not trusting each
other, and the Communion never fully cleared the junctions it had seized,
leaving several of them contested still. The Mireth Bloom fought no battles
in the Cinderglass War at all. It simply grew, patiently, over whichever
battlefields the other four abandoned, and inherited more wreckage from
this one war than from anything else in Expanse history.

## Current Era: The Uneasy Expanse

The Uneasy Expanse is where the Amaranth Expanse stands now, in the era the
Alpha card set is drawn from. No civilization has fallen since the Five
Risings, and none has come close to unifying the galaxy under one banner;
the Cinderglass War proved that even a conflict pulling in four of the five
civilizations ends in exhaustion rather than resolution, and every
civilization since has treated that as a lesson rather than an aberration
worth repeating. What fighting happens now happens locally: small,
personal, and rarely declared outright — a chokepoint held and re-held, a
debt collected on and never quite paid off, a broker's ledger both sides
keep updating and neither side trusts.

The old grievances from the Cinderglass War are still live. The design
core fragment is still welded into a Reach hull, and the Assembly still
wants it back. Communion oath-sworn still hold, imperfectly, onto wormhole
junctions they seized to choke off a war generations gone, and Reach fleets
still test those junctions. The Concord still profits from both sides not
trusting each other. New instability compounds the old: First
Weave-derived technology and biology keep resurfacing, unpredictably, from
ruins no civilization has fully mapped, and every fresh discovery reopens
the same question that started the Cinderglass War in the first place — who
gets to keep what it finds.

This is the fixed point Alpha-set flavor text writes from. A Reach card can
lean on salvage, debt, and a fragment still welded into a keel somewhere.
An Assembly card can lean on the discipline of a design that has never
stopped being owed something. A Concord card can lean on a ledger that
never quite balances. A Communion card can lean on a junction still worth
holding, or a second Sundering still worth preventing. A Bloom card can
lean on patient growth over wreckage nobody else wanted. None of it needs a
new war, a new Fount, or a new mechanic — the Uneasy Expanse already has
enough unfinished business to write flavor text from for a long time to
come.
```

Notes on this content, so you understand why it's shaped this way (do not
change these choices without re-checking against the ACs below):

- The `## Summary` section is the very first section after the H1 title,
  states the era count as the digit `6` (matching the 6 numbered items in
  `## Timeline of Eras` exactly), and names 4 of the 5 races by their exact
  `design/races/*.md` spelling, plus the 5th (Mireth Bloom) in the
  following sentence — satisfies AC6.
- `## Timeline of Eras` is a heading containing the word "Timeline" with a
  6-item numbered list — satisfies AC2 (needs ≥4).
- `## The Cinderglass War` names all of Cindral Reach, Wrought Assembly,
  Panoptic Concord, and Starweave Communion directly as combatants/actors —
  satisfies AC3 (needs 3+ of 5).
- Fount-related terms already defined in `world.md`/`rules.md` — "Founts",
  "the Mass", "the Bloom", "the Signal", "the Circuit", "the Tangle",
  "generator-stations" — recur throughout, especially in "The Weave Age"
  and "The Five Risings" — satisfies AC4. No new mechanic, card type, zone,
  or resource is invented anywhere in the document.
- `## Current Era: The Uneasy Expanse` is the last section in the document
  and its heading contains "Current Era" — satisfies AC5.
- Every section body is well under 500 words (the longest, "The Cinderglass
  War", is ~410 words) — satisfies AC7.

## Step 2 — Create `test/design-lore.test.js`

Path: `test/design-lore.test.js` (sibling to the existing
`test/design-world.test.js`, `test/design-races.test.js`, etc., reusing the
same `test/helpers/markdown.js` helper already in the repo — do not modify
that helper).

Write exactly this content:

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, findSection } = require('./helpers/markdown');

const LORE_PATH = path.join(__dirname, '..', 'design', 'lore.md');
const RACE_NAMES = [
  'Cindral Reach',
  'Mireth Bloom',
  'Panoptic Concord',
  'Starweave Communion',
  'Wrought Assembly',
];
const FOUNT_TERMS = [
  /\bFounts?\b/,
  /\bFount Points?\b/,
  /\bthe Mass\b/,
  /\bthe Bloom\b/,
  /\bthe Signal\b/,
  /\bthe Circuit\b/,
  /\bthe Tangle\b/,
  /\bGenerators?\b/,
];

function wordCount(str) {
  return str.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
}

function countNumberedItems(body) {
  return body.split(/\r?\n/).filter((line) => /^\s*\d+\.\s+\S/.test(line)).length;
}

test('AC1: design/lore.md exists', () => {
  assert.ok(fs.existsSync(LORE_PATH), `expected ${LORE_PATH} to exist`);
});

const content = fs.existsSync(LORE_PATH) ? fs.readFileSync(LORE_PATH, 'utf8') : '';
const sections = parseSections(content);
const level2 = sections.filter((s) => s.level === 2);

test('AC2: lore.md has a named timeline/history section listing at least 4 distinct eras', () => {
  const idx = findSection(sections, /timeline|history/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Timeline" or "History"');
  const items = countNumberedItems(sections[idx].lines.join('\n'));
  assert.ok(items >= 4, `expected at least 4 listed eras/periods, found ${items}`);
});

test('AC3: at least one era/event section describes a central conflict directly involving 3+ of the 5 races', () => {
  const eraSections = level2.filter((s) => !/^(summary|timeline)/i.test(s.title));
  const qualifying = eraSections.filter((s) => {
    const body = s.lines.join('\n');
    return RACE_NAMES.filter((name) => body.includes(name)).length >= 3;
  });
  assert.ok(
    qualifying.length > 0,
    `expected at least one non-summary/timeline section naming 3+ of [${RACE_NAMES.join(', ')}]`
  );
});

test('AC4: lore.md references at least one Fount-related concept already defined in rules.md/world.md', () => {
  assert.ok(
    FOUNT_TERMS.some((re) => re.test(content)),
    'expected a reference to a Fount-related term (Founts, the Mass/Bloom/Signal/Circuit/Tangle, Fount Points, Generators)'
  );
});

test('AC5: lore.md ends with a short current-era section', () => {
  assert.ok(level2.length > 0, 'expected at least one level-2 section');
  const last = level2[level2.length - 1];
  assert.ok(
    /current era/i.test(last.title),
    `expected the final section to be a "current era" section, got "${last.title}"`
  );
  const body = last.lines.join(' ').replace(/\s+/g, ' ').trim();
  assert.ok(body.length > 100, 'expected a substantive current-era section');
});

test('AC6: lore.md opens with a summary naming the era count and 3+ races in the central conflict', () => {
  assert.ok(level2.length > 0, 'expected at least one level-2 section');
  assert.ok(
    /summary/i.test(level2[0].title),
    `expected the first section to be a Summary section, got "${level2[0].title}"`
  );
  const body = level2[0].lines.join(' ');
  const numMatch = body.match(/\b(\d+)\s+eras?\b/i);
  assert.ok(numMatch, 'expected the summary to state a number of eras');

  const timelineIdx = findSection(sections, /timeline|history/i);
  assert.notStrictEqual(timelineIdx, -1, 'expected a Timeline section to check the era count against');
  const eraCount = countNumberedItems(sections[timelineIdx].lines.join('\n'));
  assert.strictEqual(
    Number(numMatch[1]),
    eraCount,
    "expected the summary's stated era count to match the timeline list"
  );

  const namedRaces = RACE_NAMES.filter((name) => body.includes(name));
  assert.ok(
    namedRaces.length >= 3,
    `expected the summary to name at least 3 races, found [${namedRaces.join(', ')}]`
  );
});

test('AC7: no level-2 section exceeds roughly 500 words', () => {
  for (const s of level2) {
    const words = wordCount(s.lines.join(' '));
    assert.ok(words <= 520, `expected section "${s.title}" to be under ~500 words, found ${words}`);
  }
});
```

## Step 3 — Verify

Run, from the repo root (the worktree root, where `package.json` lives):

```
node --test
```

Expected output: every existing suite continues to pass (`smoke.test.js`,
`design-world.test.js`, `design-races.test.js`, `design-characters.test.js`,
`design-rules.test.js`, `design-cardtypes.test.js`, `design-cards.test.js`,
`design-card-anatomy.test.js`, `design-battlefield.test.js`,
`build-site.test.js`), plus the new `design-lore.test.js` — 7 new passing
tests (AC1–AC7). The summary line should read `# fail 0` and the process
should exit 0.

### Why `site/` changes too, and that's expected

`test/build-site.test.js` calls `node tools/build-site.js` internally as
part of its own assertions (it deletes and rebuilds `site/` fresh on every
`node --test` run, to check the build is deterministic). Since
`tools/build-site.js` discovers `design/**/*.md` generically, running
`node --test` after Step 1 will regenerate `site/` to include a new
`site/design/lore.html` page and an updated `site/index.html` (with a new
"Other" section linking to it), alongside re-generating every other
`site/design/*.html`/`site/gamePlan.html`/`site/index.html` file currently
showing as modified in `git status` (those are pre-existing, unrelated to
this unit — leftover from `site/` being regenerated by test runs before
this bolt started). This is correct, expected behavior of the existing test
suite, not something to prevent or manually revert — do not hand-edit
anything under `site/`.

## Risk self-assessment (FIRE)

- **Reversibility:** Fully reversible — two new files, `git revert`/delete
  trivially undoes this. No file is modified in place.
- **Security impact:** None. Static prose content; no code execution paths,
  no user input, no secrets.
- **User data:** None involved.
- **Schema changes:** None. No card data, no rules changes, no new game
  mechanics — this document explicitly avoids inventing anything `rules.md`
  doesn't already define (per the unit's own intent and AC4).

Standard risk, matches `risk_class: standard` / `mode: autopilot` in
`unit.md`. No held-out AC (AC6, AC7) introduces a requirement absent from
the stated intent — both are direct elaborations of "closes at full decided
scope" and "skimmable, not a novel" already implied by the unit's Intent
paragraph — so no spec-bug flag is needed here.


## Findings

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


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T06:36:28.166Z] **bolt:start** — unit=cardgame-world-lore-history start_sha=36ed8dcd1ce6306055da5e62a969e5431f50e5fe branch=bolt/cardgame-world-lore-history worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-world-lore-history
- [2026-07-28T06:36:30.578Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T06:44:55.940Z] **plan:done** — plan.md written
- [2026-07-28T06:46:08.037Z] **tests:done** — RED verified on test/design-lore.test.js (exit=1)
- [2026-07-28T06:48:27.770Z] **build:c1** — tests green, committed
- [2026-07-28T06:51:07.491Z] **review:c1** — APPROVE
- [2026-07-28T06:55:24.026Z] **review:devils-advocate** — NEEDS_WORK
- [2026-07-28T06:56:45.675Z] **build:c2** — tests green, committed
- [2026-07-28T06:56:45.736Z] **bolt:escalated** — no-change iteration (diff hash unchanged between cycles)


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
