# cardgame-targeting-rules: cardGame rules — Section 13: Targeting (legal targets, illegal-target fizzling)

## Header

- unit: cardgame-targeting-rules
- title: cardGame rules — Section 13: Targeting (legal targets, illegal-target fizzling)
- project: cardgame
- completed: 2026-07-28
- outcome: escalated
- start_sha: 70f972d7aa1f4a1c505d37cb908c9bda8a087f1b
- end_sha: 70f972d7aa1f4a1c505d37cb908c9bda8a087f1b

## Intent

Extend design/rules.md with a new numbered top-level section, Targeting, closing a gap that Section 9's card examples (Cinderfall Bolt, Reactive Turret) and Section 2's Glossary leave open: several printed cards' rules text names a target ("any Unit") as part of resolving, but no section ever defines what a target is, when a challenger locks one in, or what happens if the chosen target stops being legal before the effect resolves (for example, a Response destroys the only targeted Unit first, per the existing Section 6 priority/Queue model). The section must state: a target is chosen at the moment the targeting card or ability is added to the Queue (Section 6), not when it resolves; a target must be legal both when chosen and rechecked immediately before the entry resolves (Section 6's Resolve); if an entry has one target and that target is not legal at the recheck, the entry does nothing and is still removed from the Queue (fizzles) rather than resolving against nothing or being replaced; this is appended after Section 12 (Combat Resolution) following the same append-only, no-renumbering pattern every prior rules-extension unit (spatial-battlefield-rules, deck-construction-rules, combat-resolution-rules) has used. This continues I6's MTG-Comprehensive-Rules-rigor bar (T9), the decided full scope of the design phase (T1) rather than stopping at the currently-complete-looking rules.md, and T14's game-only focus — acceptance criteria are mechanical document checks, per the working pattern for rules units.

## Acceptance Criteria

- AC1 [paraphrase]: design/rules.md contains a new numbered top-level section titled 'Targeting' appended immediately after the current Section 12 (Combat Resolution), and every previously-existing section keeps its original number and title unchanged.
- AC2 [inferred]: The Targeting section states that a target is chosen at the moment the targeting card or ability is added to the Queue (Section 6), not later, and that the target must be legal at that moment.
- AC3 [inferred]: The Targeting section states that a target's legality is rechecked immediately before the entry resolves, and states what happens if an entry with exactly one target finds that target illegal at that recheck (the entry does nothing and is removed from the Queue, i.e. fizzles).
- AC4 [inferred] (held_out): The Targeting section includes a worked example, in the style of Sections 7/8.7/10.3/12.5, tracing a Fast card (e.g. Cinderfall Bolt) whose sole target is destroyed by a Response before it resolves, confirming the card fizzles instead of resolving against nothing; a new test/design-targeting.test.js asserts section numbering, the definition/timing rule, the fizzle rule, and the presence of this worked example.

## Plan

GATE: none

# Plan: cardgame-targeting-rules

## Summary

Append one new numbered top-level section, `## 13. Targeting`, to the end of
`design/rules.md`. It closes the gap the unit spec names: Section 9's card
examples (Cinderfall Bolt, Reactive Turret) name a target ("any Unit") as
part of resolving, but no section ever defines what a target is, when it is
chosen, or what happens if the chosen target stops being legal before the
effect resolves. This is a purely additive, docs-only change, following the
exact append-only pattern already used by Sections 10, 11, and 12
(`cardgame-winning-losing-conditions-rules`, `cardgame-deck-construction-rules`,
`cardgame-combat-resolution-rules`):

- No existing line in `design/rules.md` is edited, moved, or renumbered.
- One new test file, `test/design-targeting.test.js`, is created to check the
  four acceptance criteria mechanically, using the existing shared helper
  `test/helpers/markdown.js` (unchanged).

This is small enough for a single bolt. No split needed.

## Risk self-assessment (FIRE matrix)

- **Reversibility**: trivial — a markdown append and a new test file, both
  revertible with `git checkout`.
- **Security impact**: none — no code execution paths, no user input, no
  network/IO changes.
- **User data**: none touched — this repo has no runtime user data; this is
  a design document and its test.
- **Schema changes**: none.

Net risk is minimal and the requirements are unambiguous. `GATE: none`.

## Step 1 — Append to `design/rules.md`

File: `C:\github\.agentbox-worktrees\cardGame\cardgame-targeting-rules\design\rules.md`
(repo-relative: `design/rules.md`)

Do **not** touch anything above the file's current final line (which ends
`... exactly as Sections 12.1-12.4 state.`, the end of Section 12's worked
example). Open the file, go to the very end, and append exactly the
following block. Keep the file's existing convention: one blank line
between the end of the prior content and the new `##` heading, and one
blank line between every paragraph/heading below (mirror the spacing
already used for Sections 11 and 12 elsewhere in the file).

Append this text verbatim as new content after the file's final existing
line:

```markdown

## 13. Targeting

Section 9's card examples — Cinderfall Bolt (Section 9.2) and Reactive
Turret (Section 9.7) — both name a target ("any Unit") as part of
resolving, but Section 2's Glossary never defines what a target is, when a
challenger locks one in, or what happens if the chosen target stops being
legal before the effect resolves. This section closes that gap. Nothing in
this section changes or restates any rule already stated in Sections 1-12;
where a rule already exists, this section cross-references it by section
number instead.

### 13.1 Targets and Choosing a Target

- **Target** — a permanent, challenger, or other game object that a card's
  or ability's rules text names as what its effect applies to, chosen from
  among the game objects that meet whatever restriction that rules text
  states (for example, Cinderfall Bolt's "any Unit", Section 9.2). Not
  every card or ability has a target; a card or ability only has one if
  its rules text names one.
- **Legal target** — a game object that meets every restriction stated by
  the targeting rules text, at the moment being checked (Section 13.2).

A target is chosen the instant the targeting card or ability is added to
the Queue (Section 2's Queue; Section 6) — never later, and never at the
moment it resolves. This applies equally to a card a challenger plays and
to a triggered ability that enters the Queue on its own (Section 2's
Trigger/Triggered ability). The challenger playing the card, or
controlling the triggered ability, chooses its target(s) as part of
adding it to the Queue, and every target chosen MUST be a legal target at
that moment; a card or ability that names a target but has no legal
target available to choose MAY NOT be added to the Queue at all.

Once chosen, a target is fixed: nothing in this section lets a target be
reselected or changed after the card or ability that named it is already
in the Queue. This matches how every other Queue entry in this rulebook
behaves — Section 6 already treats the Queue as an ordered, fixed sequence
of entries once something is added to it, and a target chosen at that
same moment is no different.

### 13.2 Legality Recheck and Fizzling

A target's legality is not only checked once, at the moment it is chosen
(Section 13.1). It is rechecked immediately before the entry that named
it resolves (Section 2's Resolve; Section 6) — the last possible moment
before its effect would apply.

If an entry has exactly one target, and that target is not a legal target
(Section 13.1) at this recheck, the entry **fizzles**: it does nothing —
none of its rules text takes effect — and it is still removed from the
Queue exactly as though it had resolved (Section 2's Resolve). A fizzled
entry never resolves against nothing, and nothing in this section lets a
fizzled entry's controller pick a new, legal target in place of the one
that stopped being legal — an illegal target simply ends the entry's
effect, not its target.

This section does not state a rule for an entry with more than one
target, since no card printed under this rulebook so far has more than
one (Section 9's examples each name at most one target); a future card
doing so would need its own rules text to state what happens if only some
of its targets are illegal at the recheck.

### 13.3 Worked Example: A Fizzled Response

This example follows one Main Phase exchange between Reva (active player)
and Toma (non-active player), continuing in the same style as Section 7's
worked example. Toma controls a single Unit, Scrap Sentinel, combat
strength 2 with no damage marked against it. Reva controls no Units.

1. It is Reva's Main Phase. The Queue is empty and Reva holds priority.
   Reva plays Cinderfall Bolt (Section 9.2: Fast, "deal 3 damage to any
   Unit"), naming Scrap Sentinel as its target — the only Unit on the
   Field and therefore the only legal target available (Section 13.1).
   Cinderfall Bolt is added to the Queue with Scrap Sentinel locked in as
   its target. Reva passes.
2. Priority moves to Toma. The Queue is not empty, so Toma may respond
   (Section 2's Response). Toma plays a second copy of Cinderfall Bolt,
   naming Scrap Sentinel — Toma's own Unit — as its target, and passes.
   Toma's card, played later, sits above Reva's in the Queue (Section 6)
   and so resolves first.
3. Both challengers pass in succession, the priority window closes, and
   Toma's Cinderfall Bolt resolves: it deals 3 damage to Scrap Sentinel,
   whose combat strength is 2, destroying it (Section 12.3). Scrap
   Sentinel is moved to Toma's Wreck (Section 3).
4. A new priority window opens; both challengers pass again, and Reva's
   Cinderfall Bolt — still the Queue's only entry — is about to resolve.
   Immediately before it resolves, its target is rechecked (Section
   13.2): Scrap Sentinel is no longer on the Field, so it is no longer a
   legal target. Reva's Cinderfall Bolt has exactly one target and that
   target is illegal at the recheck, so it fizzles: it deals no damage to
   anything, and is removed from the Queue exactly as though it had
   resolved.
5. The Queue is now empty. Play continues to the Conflict Phase with Toma
   controlling no Units and having taken no damage from Reva's card.

This confirms, on paper, that a Fast card's target is locked in when it
is added to the Queue (Section 13.1), not when it resolves; that a
Response resolving first (Section 6) can remove the only legal target an
already-queued entry had; and that losing its sole target this way
fizzles the entry — it does nothing and leaves the Queue, rather than
resolving against nothing or letting its controller retarget it (Section
13.2).
```

That is the entire append — nothing else in the file changes.

## Step 2 — Create `test/design-targeting.test.js`

File: `C:\github\.agentbox-worktrees\cardGame\cardgame-targeting-rules\test\design-targeting.test.js`
(repo-relative: `test/design-targeting.test.js` — new file)

This follows the exact pattern already used by `test/design-combat.test.js`
and its siblings: it uses the shared `test/helpers/markdown.js`
(`parseSections`, `sectionText`, `findSection`), which already exists and
needs no changes.

Create the file with exactly this content:

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection } = require('./helpers/markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');

function readRules() {
  return fs.readFileSync(RULES_PATH, 'utf8');
}

function rulesSections() {
  return parseSections(readRules());
}

function topLevelSections(content) {
  const sections = parseSections(content);
  return sections
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title));
}

function targetingBody() {
  return sectionText(rulesSections(), /^13\.\s+targeting/i);
}

function workedExampleBody() {
  return sectionText(rulesSections(), /^13\.3\s+worked example/i);
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md contains a new numbered top-level section titled
// "Targeting" appended immediately after the current Section 12 (Combat
// Resolution), and every previously-existing section keeps its original
// number and title unchanged.
// ---------------------------------------------------------------------------

const EXPECTED_TOP_LEVEL_TITLES = [
  '1. Game Concepts',
  '2. Glossary & Vocabulary',
  '3. Zones',
  '4. Resources',
  '5. Turn Structure',
  '6. Priority & Timing',
  '7. Worked Example: A Priority Exchange',
  '8. Spatial Battlefield',
  '9. Card Types & Templating',
  '10. Winning & Losing Conditions',
  '11. Deck Construction',
  '12. Combat Resolution',
  '13. Targeting',
];

test('AC1: rules.md appends "13. Targeting" after "12. Combat Resolution", with every earlier section\'s number and title unchanged', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  assert.deepStrictEqual(
    titles,
    EXPECTED_TOP_LEVEL_TITLES,
    `expected exactly ${JSON.stringify(EXPECTED_TOP_LEVEL_TITLES)}, got ${JSON.stringify(titles)}`
  );
});

test('AC1: "13. Targeting" has numbered 13.x subsections in strict order', () => {
  const sections = rulesSections();
  const targetingIdx = findSection(sections, /^13\.\s+targeting/i);
  assert.notStrictEqual(targetingIdx, -1, 'expected a "13. Targeting" heading');
  const subheadings = [];
  for (let i = targetingIdx + 1; i < sections.length; i++) {
    if (sections[i].level <= sections[targetingIdx].level) break;
    if (/^13\.\d+/.test(sections[i].title)) subheadings.push(sections[i].title);
  }
  assert.ok(
    subheadings.length >= 3,
    `expected at least 3 numbered 13.x subsections, found ${subheadings.length}: ${subheadings.join(', ')}`
  );
  const numbers = subheadings.map((t) => parseInt(t.match(/^13\.(\d+)/)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected sequential 13.x subsections starting at 13.1, got [${numbers.join(', ')}]`);
  }
});

// ---------------------------------------------------------------------------
// AC2: a target is chosen at the moment the targeting card or ability is
// added to the Queue, not later, and must be legal at that moment.
// ---------------------------------------------------------------------------

test('AC2: Targeting states a target is chosen when the card/ability is added to the Queue, not when it resolves, and must be legal at that moment', () => {
  const body = targetingBody();
  assert.ok(body, 'expected a Targeting section body');
  assert.ok(
    /target is chosen the instant[^.]*added to the Queue/i.test(body),
    'expected the section to state a target is chosen the instant the card/ability is added to the Queue'
  );
  assert.ok(
    /never later[^.]*never at the moment it resolves/i.test(body),
    'expected the section to explicitly rule out choosing a target later or at resolution'
  );
  assert.ok(
    /must be a legal target at that moment/i.test(body),
    'expected the section to state a chosen target must be legal at the moment it is chosen'
  );
});

// ---------------------------------------------------------------------------
// AC3: legality is rechecked immediately before the entry resolves, and an
// entry with exactly one illegal target at recheck fizzles: does nothing
// and is removed from the Queue.
// ---------------------------------------------------------------------------

test('AC3: Targeting states target legality is rechecked immediately before the entry resolves, and a sole illegal target fizzles the entry', () => {
  const body = targetingBody();
  assert.ok(body, 'expected a Targeting section body');
  assert.ok(
    /rechecked immediately before the entry[^.]*resolves/i.test(body),
    'expected the section to state legality is rechecked immediately before the entry resolves'
  );
  assert.ok(
    /exactly one target[^.]*not a legal target[^.]*fizzles/i.test(body),
    'expected the section to state an entry with exactly one illegal target at recheck fizzles'
  );
  assert.ok(/does nothing/i.test(body), 'expected the section to state a fizzled entry does nothing');
  assert.ok(/removed from the Queue/i.test(body), 'expected the section to state a fizzled entry is removed from the Queue');
});

// ---------------------------------------------------------------------------
// AC4 (held_out): a worked example, in the style of Sections 7/8.7/10.3/12.5,
// tracing a Fast card (Cinderfall Bolt) whose sole target is destroyed by a
// Response before it resolves, confirming the card fizzles instead of
// resolving against nothing.
// ---------------------------------------------------------------------------

test('AC4: Targeting includes a "13.3 Worked Example" section', () => {
  const sections = rulesSections();
  const idx = findSection(sections, /^13\.3\s+worked example/i);
  assert.notStrictEqual(idx, -1, 'expected a "13.3 Worked Example" heading');
  const body = workedExampleBody();
  assert.ok(body && body.trim().length > 0, 'expected the worked example section to have body content');
});

test('AC4: the worked example traces a Fast card whose sole target is destroyed by a Response, and confirms it fizzles instead of resolving', () => {
  const body = workedExampleBody();
  assert.ok(body, 'expected a worked example body');
  assert.ok(/Cinderfall Bolt/i.test(body), 'expected the worked example to use Cinderfall Bolt');
  assert.ok(/\bResponse\b/i.test(body), 'expected the worked example to involve a Response');
  assert.ok(/\bfizzles\b/i.test(body), 'expected the worked example to state the card fizzles');
  assert.ok(
    /no longer a legal target/i.test(body),
    'expected the worked example to state the sole target became illegal before resolving'
  );
});
```

## Step 3 — Run the test suite

From the repo root, run:

```
node --test
```

### Expected output

- Every pre-existing `test/*.test.js` file still passes (this change never
  edits any line before the new Section 13 append, so nothing pre-existing
  can regress).
- The new `test/design-targeting.test.js` contributes exactly 6 passing
  tests:
  1. `AC1: rules.md appends "13. Targeting" after "12. Combat Resolution", with every earlier section's number and title unchanged`
  2. `AC1: "13. Targeting" has numbered 13.x subsections in strict order`
  3. `AC2: Targeting states a target is chosen when the card/ability is added to the Queue, not when it resolves, and must be legal at that moment`
  4. `AC3: Targeting states target legality is rechecked immediately before the entry resolves, and a sole illegal target fizzles the entry`
  5. `AC4: Targeting includes a "13.3 Worked Example" section`
  6. `AC4: the worked example traces a Fast card whose sole target is destroyed by a Response, and confirms it fizzles instead of resolving`
- The `node --test` summary line reports `# fail 0`, and the overall exit
  code is `0`.

## Notes for the implementer

- Do not touch `design/rules.md` above the new `## 13. Targeting` heading —
  the append is the only change to that file.
- Do not renumber or retitle any existing section (1 through 12) or
  subsection — Section 13 only cross-references them by number, exactly
  like Sections 10, 11, and 12 already do.
- The Section 13 text above already accounts for every regex the new test
  file checks; if you retype it, keep the phrases `target is chosen the
  instant`, `added to the Queue`, `never later`, `never at the moment it
  resolves`, `must be a legal target at that moment`, `rechecked
  immediately before the entry`, `resolves`, `exactly one target`, `not a
  legal target`, `fizzles`, `does nothing`, `removed from the Queue`,
  `Cinderfall Bolt`, `Response`, and `no longer a legal target` intact,
  since the tests match on this exact wording pattern (case insensitive).
- `test/helpers/markdown.js` already exists and is shared by several other
  `test/design-*.test.js` files — do not modify it.
- Section 2's Glossary is intentionally left untouched: like Section 10.1's
  "Eliminated" and Section 11.2's per-Name limit before it, Section 13
  defines its own new terms (`Target`, `Legal target`) inline where they
  are first needed, rather than editing the existing Glossary section — this
  matches the established append-only pattern for this rulebook.

## Held-out criteria check

AC4 (held_out) asks for a worked example in the style of Sections
7/8.7/10.3/12.5, tracing a Fast card whose sole target is destroyed by a
Response before it resolves, plus a test file asserting section numbering,
the definition/timing rule, the fizzle rule, and the presence of the worked
example. This is exactly what the visible intent paragraph already
describes (it names Cinderfall Bolt and "a Response destroys the only
targeted Unit first" explicitly), novel only in requiring the concrete
worked example and its mechanical test coverage. It is redundant with the
visible intent, not a new requirement. No spec bug to flag.


## Findings

(no findings.md)

## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T15:37:22.468Z] **bolt:start** — unit=cardgame-targeting-rules start_sha=70f972d7aa1f4a1c505d37cb908c9bda8a087f1b branch=bolt/cardgame-targeting-rules worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-targeting-rules
- [2026-07-28T15:37:33.068Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T15:40:34.165Z] **plan:done** — plan.md written
- [2026-07-28T15:42:01.221Z] **tests:done** — RED verified on test/design-targeting.test.js (exit=1)
- [2026-07-28T15:46:40.872Z] **build:c1** — tests still red (exit=1)
- [2026-07-28T15:49:42.754Z] **build:c2** — tests still red (exit=1)
- [2026-07-28T15:53:54.705Z] **bolt:escalated** — circuit breaker after 3 cycles


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
