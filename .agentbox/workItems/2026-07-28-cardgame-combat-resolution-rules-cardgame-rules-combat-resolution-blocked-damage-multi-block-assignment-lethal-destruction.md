# cardgame-combat-resolution-rules: cardGame rules — Combat Resolution (blocked damage, multi-block assignment, lethal destruction)

## Header

- unit: cardgame-combat-resolution-rules
- title: cardGame rules — Combat Resolution (blocked damage, multi-block assignment, lethal destruction)
- project: cardgame
- completed: 2026-07-28
- outcome: escalated
- start_sha: c81c2facf75995dd735d6f4b6b5dddc5bb532d64
- end_sha: c81c2facf75995dd735d6f4b6b5dddc5bb532d64

## Intent

Extend design/rules.md with a new numbered top-level section, Combat Resolution, closing the gap Section 5.4 (Conflict Phase) leaves open: it defines the unblocked-attacker case (damage to Core Integrity) but never states what happens when an attacker IS blocked. The section must state that a blocked attacker deals its combat strength as damage to its blocker(s) instead of Core Integrity; that when more than one blocker is declared against a single attacker, the attacking player chooses the order in which damage is assigned among them (mirroring the existing convention in Section 6.1 that ties order-choice to the acting/active player); that a Unit carrying accumulated damage at least equal to its combat strength is destroyed and moved to its owner's Wreck (Section 3); and when damage marked on Units is cleared (end of the Conflict Phase or end of turn — the unit must pick one and state it). It is appended after whichever section is currently last, matching the pattern every prior rules-extension unit (spatial-battlefield-rules, map-setup-and-playtest-procedure, deck-construction-rules) has followed, so no already-numbered section is renumbered. This continues I6's MTG-Comprehensive-Rules-rigor bar (T9) and the decided full scope of the design phase (T1), with acceptance criteria as mechanical document checks per T8.

## Acceptance Criteria

- AC1 [paraphrase]: design/rules.md contains a new numbered top-level section titled 'Combat Resolution' appended after the current last top-level section, and every previously-existing section keeps its original number and title unchanged.
- AC2 [inferred]: The Combat Resolution section states that a blocked attacker deals its combat strength as damage to its blocker(s) rather than to the non-active player's Core Integrity.
- AC3 [inferred]: The Combat Resolution section states who chooses the damage assignment order when a single attacker has more than one blocker.
- AC4 [inferred] (held_out): The Combat Resolution section states that a Unit with accumulated damage at least equal to its combat strength is destroyed and moved to its owner's Wreck, and states when marked damage on Units is cleared; a new test/design-combat.test.js asserts both facts alongside the section-numbering and blocked-damage checks above.

## Plan

GATE: none

# Plan: cardgame-combat-resolution-rules

## Summary

Append one new numbered top-level section, `## 12. Combat Resolution`, to the
end of `design/rules.md`. It closes the gap Section 5.4 (Conflict Phase)
leaves open — Section 5.4 only states what happens to an *unblocked*
attacker (damage to Core Integrity); it never says what happens when an
attacker is blocked. This is a purely additive, docs-only change:

- No existing line in `design/rules.md` is edited, moved, or renumbered.
- One new test file, `test/design-combat.test.js`, is created to check the
  four acceptance criteria mechanically.

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

File: `C:\github\.agentbox-worktrees\cardGame\cardgame-combat-resolution-rules\design\rules.md`
(repo-relative: `design/rules.md`)

Do **not** touch anything above line 857 (the current end of the file, which
ends with `... than 40 cards.` on the last line of Section 11 / 11.2). Open
the file, go to the very end, and append exactly the following block. Keep
the file's existing convention: one blank line between the end of the prior
content and the new `##` heading, and one blank line between every
paragraph/heading below (mirror the spacing already used for Sections 10 and
11 elsewhere in the file).

Append this text verbatim as new content after the file's final existing
line (`...no legal Archive can ever hold fewer than 40 cards.`):

```markdown

## 12. Combat Resolution

Section 5.4's Conflict Phase already states what happens when an attacking
Unit is unblocked: it deals its combat strength as damage to the
non-active player's Core Integrity. This section states the other half of
that same event — what happens when an attacker is blocked — and states,
for the first time in this rulebook, how the damage that combat marks
against a Unit (Section 2's Damage) accumulates, destroys, and clears.
Nothing in this section changes or restates any rule already stated in
Sections 1-11; where a rule already exists, this section cross-references
it by section number instead.

### 12.1 Damage to Blockers

An attacking Unit that is blocked (Section 5.4) deals its combat strength
as damage to its blocker(s) instead of to the non-active player's Core
Integrity. A blocked attacker never deals damage to Core Integrity, no
matter how many blockers are declared against it or how that damage is
divided among them (Section 12.2).

Each blocking Unit also deals its own combat strength as damage to the
attacking Unit it is blocking, at the same time. When more than one
blocker is declared against a single attacker (Section 5.4), the attacker
receives the combined combat strength of every one of its blockers as
damage, marked against it exactly as any other damage (Section 2, Section
12.3).

### 12.2 Damage Assignment Order

When more than one blocker is declared against a single attacker (Section
5.4), the damage that attacker deals (Section 12.1) is still divided among
its blockers one at a time rather than dealt to all of them at once with
no assignment. The attacking player — the active player, who declared that
attacker (Section 5.4) — chooses the order in which the attacker's combat
strength is assigned among its blockers, and chooses how much of it each
blocker receives, provided the amounts assigned across all of that
attacker's blockers sum to exactly the attacker's combat strength. This
mirrors the existing convention, already stated in Section 6.1's
Simultaneous Triggers, that ties an order-choice to the acting or active
player: there, the active player orders their own triggers before the
non-active player's; here, the active player likewise orders how their own
attacker's damage lands among the non-active player's blockers.

### 12.3 Unit Destruction by Damage

A Unit that has damage marked against it (Section 2's Damage) equal to or
greater than its own combat strength (Section 9.1's Stats/counters line)
is destroyed: it is removed from the Field and moved to its owner's Wreck
(Section 3), exactly as any other destroyed permanent. This destruction
check applies the instant qualifying damage is marked, to any Unit with
marked damage — not only to Units attacking or blocking in the current
Conflict Phase — since any card or ability that marks damage against a
Unit (Section 2) can bring that Unit's marked damage up to or past its
combat strength.

### 12.4 Clearing Damage

Damage marked against a Unit (Section 2) is not permanent. It clears at
the end of the turn: at the same moment Section 5.5 already fixes for
resource pools emptying, once the Dusk Phase's Queue is empty and both
players have passed in succession. A Unit that survives the Conflict
Phase with damage marked against it — because that damage was less than
its combat strength (Section 12.3) — keeps that damage marked through the
rest of the turn, including the Dusk Phase, and loses it only when the
turn ends; no Unit carries marked damage into the next turn.

### 12.5 Worked Example: A Multi-Blocker Exchange

This example follows one Conflict Phase (Section 5.4) between Reva (active
player) and Toma (non-active player). Reva controls Ironclad Vanguard,
combat strength 5. Toma controls two Ready Units: Scrap Sentinel, combat
strength 2, and Bramble Warden, combat strength 4.

1. Reva declares Ironclad Vanguard as an attacker; it becomes Spent. Toma
   declares both Scrap Sentinel and Bramble Warden as blockers against it
   (Section 5.4).
2. Because Ironclad Vanguard is blocked, it deals its combat strength as
   damage to its blockers rather than to Toma's Core Integrity (Section
   12.1). Reva, the active player, chooses the assignment order and
   amounts: 2 damage to Scrap Sentinel first, then the remaining 3 damage
   to Bramble Warden (Section 12.2).
3. Scrap Sentinel now has 2 damage marked against it, equal to its own
   combat strength of 2, so it is destroyed and moved to Toma's Wreck
   (Section 12.3, Section 3). Bramble Warden has 3 damage marked against
   it, less than its combat strength of 4, so it survives, carrying that
   damage.
4. Both of Toma's blockers also deal their combat strength as damage to
   Ironclad Vanguard at the same time (Section 12.1): 2 from Scrap
   Sentinel and 4 from Bramble Warden, for 6 damage total. Ironclad
   Vanguard's combat strength is 5, so 6 damage destroys it; it is moved
   to Reva's Wreck (Section 12.3, Section 3).
5. The Conflict Phase ends and the turn continues to the Dusk Phase
   (Section 5.5). Bramble Warden's 3 marked damage is not cleared yet — it
   clears only once the turn itself ends (Section 12.4), so if anything
   this turn still cared about Bramble Warden's marked damage, it would
   still see 3.

This confirms, on paper, that a blocked attacker's damage lands on its
blockers rather than Core Integrity, that the active player's assignment
choice can eliminate one blocker while sparing another sharing the same
attacker, and that surviving damage persists until the fixed clearing
moment this section commits to, exactly as Sections 12.1-12.4 state.
```

That is the entire append — nothing else in the file changes.

## Step 2 — Create `test/design-combat.test.js`

File: `C:\github\.agentbox-worktrees\cardGame\cardgame-combat-resolution-rules\test\design-combat.test.js`
(repo-relative: `test/design-combat.test.js` — new file)

This follows the exact pattern already used by `test/design-rules.md`'s
sibling test files (`test/design-map-setup-playtest.test.js`,
`test/design-rules.test.js`): it uses the shared
`test/helpers/markdown.js` (`parseSections`, `sectionText`, `findSection`),
which already exists and needs no changes.

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

function combatBody() {
  return sectionText(rulesSections(), /^12\.\s+combat resolution/i);
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md contains a new numbered top-level section titled
// "Combat Resolution" appended after the current last top-level section,
// and every previously-existing section keeps its original number and
// title unchanged.
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
];

test('AC1: rules.md appends "12. Combat Resolution" after the prior last section, with every earlier section\'s number and title unchanged', () => {
  const sections = topLevelSections(readRules());
  const titles = sections.map((s) => s.title);
  assert.deepStrictEqual(
    titles,
    EXPECTED_TOP_LEVEL_TITLES,
    `expected exactly ${JSON.stringify(EXPECTED_TOP_LEVEL_TITLES)}, got ${JSON.stringify(titles)}`
  );
});

test('AC1: "12. Combat Resolution" has numbered 12.x subsections in strict order', () => {
  const sections = rulesSections();
  const combatIdx = findSection(sections, /^12\.\s+combat resolution/i);
  assert.notStrictEqual(combatIdx, -1, 'expected a "12. Combat Resolution" heading');
  const subheadings = [];
  for (let i = combatIdx + 1; i < sections.length; i++) {
    if (sections[i].level <= sections[combatIdx].level) break;
    if (/^12\.\d+/.test(sections[i].title)) subheadings.push(sections[i].title);
  }
  assert.ok(
    subheadings.length >= 4,
    `expected at least 4 numbered 12.x subsections, found ${subheadings.length}: ${subheadings.join(', ')}`
  );
  const numbers = subheadings.map((t) => parseInt(t.match(/^12\.(\d+)/)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected sequential 12.x subsections starting at 12.1, got [${numbers.join(', ')}]`);
  }
});

// ---------------------------------------------------------------------------
// AC2: a blocked attacker deals its combat strength as damage to its
// blocker(s) rather than to the non-active player's Core Integrity.
// ---------------------------------------------------------------------------

test('AC2: Combat Resolution states a blocked attacker deals its combat strength as damage to its blocker(s) instead of Core Integrity', () => {
  const body = combatBody();
  assert.ok(body, 'expected a Combat Resolution section body');
  assert.ok(/\bblocked\b/i.test(body) && /\bblocker/i.test(body), 'expected the section to discuss blocked attackers and blockers');
  assert.ok(
    /combat strength as damage to (its|their) blocker/i.test(body),
    'expected the section to state a blocked attacker deals its combat strength as damage to its blocker(s)'
  );
  assert.ok(
    (/instead of/i.test(body) || /rather than/i.test(body)) && /core integrity/i.test(body),
    'expected the section to state this damage goes to blockers instead of Core Integrity'
  );
});

// ---------------------------------------------------------------------------
// AC3: who chooses the damage assignment order when a single attacker has
// more than one blocker.
// ---------------------------------------------------------------------------

test('AC3: Combat Resolution states the attacking/active player chooses damage assignment order among multiple blockers', () => {
  const body = combatBody();
  assert.ok(body, 'expected a Combat Resolution section body');
  assert.ok(/more than one blocker/i.test(body), 'expected the section to address the multiple-blocker case');
  assert.ok(
    /(attacking player|active player)[^.]*chooses[^.]*order/i.test(body),
    'expected the section to state the attacking/active player chooses the damage assignment order'
  );
});

// ---------------------------------------------------------------------------
// AC4 (held_out): a Unit with accumulated damage at least equal to its
// combat strength is destroyed and moved to its owner's Wreck; and when
// marked damage on Units is cleared.
// ---------------------------------------------------------------------------

test('AC4: Combat Resolution states a Unit with damage at least equal to its combat strength is destroyed and moved to its owner\'s Wreck', () => {
  const body = combatBody();
  assert.ok(body, 'expected a Combat Resolution section body');
  assert.ok(
    /damage[^.]*(equal to or greater than|at least)[^.]*combat strength/i.test(body),
    'expected the section to state a Unit is destroyed once its marked damage is at least its combat strength'
  );
  assert.ok(/\bdestroyed\b/i.test(body), 'expected the section to state the Unit is destroyed');
  assert.ok(/\bwreck\b/i.test(body), "expected the section to state the Unit moves to its owner's Wreck");
});

test('AC4: Combat Resolution states a single, explicit moment when marked damage on Units is cleared', () => {
  const body = combatBody();
  assert.ok(body, 'expected a Combat Resolution section body');
  assert.ok(/\bclear/i.test(body), 'expected the section to state when damage is cleared');
  assert.ok(
    /end of the turn|end of turn/i.test(body),
    'expected the section to commit to a single clearing moment (end of turn) and state it'
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
  edits any line before the new Section 12 append, so nothing pre-existing
  can regress).
- The new `test/design-combat.test.js` contributes exactly 6 passing tests:
  1. `AC1: rules.md appends "12. Combat Resolution" after the prior last section, with every earlier section's number and title unchanged`
  2. `AC1: "12. Combat Resolution" has numbered 12.x subsections in strict order`
  3. `AC2: Combat Resolution states a blocked attacker deals its combat strength as damage to its blocker(s) instead of Core Integrity`
  4. `AC3: Combat Resolution states the attacking/active player chooses damage assignment order among multiple blockers`
  5. `AC4: Combat Resolution states a Unit with damage at least equal to its combat strength is destroyed and moved to its owner's Wreck`
  6. `AC4: Combat Resolution states a single, explicit moment when marked damage on Units is cleared`
- The `node --test` summary line reports `# fail 0`, and the overall exit
  code is `0`.

## Notes for the implementer

- Do not touch `design/rules.md` above the new `## 12. Combat Resolution`
  heading — the append is the only change to that file.
- Do not renumber or retitle Section 5.4, Section 6.1, Section 3, or Section
  9.1 — Section 12 only cross-references them by number, exactly like every
  other cross-referencing section in this file already does (see Section
  8.6, Section 10, Section 11 for the existing pattern).
- The Section 12 text above already accounts for every regex the new test
  file checks; if you retype it, keep the phrases `combat strength as
  damage to its blocker`, `instead of ... Core Integrity`, `more than one
  blocker`, `active player ... chooses ... order`, `equal to or greater
  than ... combat strength`, `destroyed`, `Wreck`, `clear`, and `end of the
  turn` intact, since the tests match on this exact wording pattern (case
  insensitive).
- `test/helpers/markdown.js` already exists and is shared by several other
  `test/design-*.test.js` files — do not modify it.

## Held-out criteria check

AC4 (held_out) asks for exactly what the visible intent paragraph already
spells out verbatim — including the explicit instruction to "pick one and
state it" for when damage clears. It is redundant with the visible intent,
novel only in requiring the new test file to check it mechanically. No spec
bug to flag.


## Findings

(no findings.md)

## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T14:37:43.962Z] **bolt:start** — unit=cardgame-combat-resolution-rules start_sha=c81c2facf75995dd735d6f4b6b5dddc5bb532d64 branch=bolt/cardgame-combat-resolution-rules worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-combat-resolution-rules
- [2026-07-28T14:37:56.074Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T14:41:33.631Z] **plan:done** — plan.md written
- [2026-07-28T14:43:28.965Z] **tests:done** — RED verified on test/design-combat.test.js (exit=1)
- [2026-07-28T14:48:49.309Z] **build:c1** — tests still red (exit=1)
- [2026-07-28T14:51:23.758Z] **build:c2** — tests still red (exit=1)
- [2026-07-28T14:53:35.972Z] **bolt:escalated** — circuit breaker after 3 cycles


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
