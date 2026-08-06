GATE: none

# Plan: cardgame-conflict-phase-movement-rules

## Scope (hard limit)

Touch exactly two files:

1. `design/rules.md` — rewrite Section 5.4 ("Conflict Phase") only. No other
   section, heading, or line changes.
2. `test/design-rules.test.js` — append new tests covering the unit's ACs.

Do not touch `design/rules.md` Section 8.1 even though it contains stale
cross-references to Section 5.4's "open notes" (see **Known residual
inconsistency** at the end of this plan — explicitly out of scope).

Do not touch any card file, `site/`, or any other test file. (Running
`node --test` will regenerate `site/design/rules.html` and `site/index.html`
as an automatic side effect of `test/build-site.test.js` — that is expected
and fine, see **Expected output** below; it is not something you edit by
hand.)

## Background: why the repo doesn't look like unit.md describes

`unit.md` describes Section 5.4 as containing raw `//` comments. That was
true historically (see commit `3a889fe`), but an earlier, unrelated unit
(`cardgame-spatial-rules-notes-reconciliation`) already converted every
raw `//` comment in the document into italic `*...*` "open design question"
prose, including the ones in Section 5.4 — but explicitly left Section
5.4's *content* unresolved (see `test/design-battlefield.test.js` lines
205-209, which says in a comment that Sections 5.2/5.4 carry "separately
unresolved RouterBox notes this unit does not charter fixing").

So today:
- AC1 ("no lines beginning with `//`") is **already true** for Section 5.4.
  Just don't reintroduce any `//` line.
- AC2-AC5 are **not yet true** — Section 5.4 still has the unresolved
  italic aside and the "place-holder" combat text with no Planet/Movement
  model. This plan replaces that with the finished numbered rules prose.

## Step 1 — Rewrite `design/rules.md` Section 5.4

File: `C:\github\.agentbox-worktrees\cardGame\cardgame-conflict-phase-movement-rules\design\rules.md`

Use the Edit tool. First re-read lines 297-320 with the Read tool immediately
before editing (to get a byte-exact `old_string` — do not retype it from
memory, copy it verbatim from what Read returns) — as of this plan's writing
that block is:

```
### 5.4 Conflict Phase

*Open design questions (unresolved): whether and how Units move around the
battlefield graph — between Planets, through Wormholes — and attack Planets
by doing so; whether moving a Unit costs that Unit its ability to attack the
same turn by default, though an effect could change that; whether moving
through a Wormhole costs time, resources, or some tradeoff of the two
(possibly varying by race); whether a blocking Unit must be located at the
same Planet as the attacker it blocks; and whether attacking or blocking
across a Wormhole is possible at all — are not decided by this section.
Section 8.1 tracks a Unit's location as a real, current fact once the Unit
is on the Field, but grants no action, on its own, that relocates it; these
open questions are exactly the design space that gap leaves for a future
rule or card.*

The combat mechanic below is a placeholder pending resolution of the open
questions above:

The active player MAY declare any number of their Ready Units as attackers,
becoming Spent as they do; the non-active player MAY then declare any of their own
Ready Units as blockers, one blocker or more per attacker. An attacking Unit that
is unblocked deals its combat strength as damage to the non-active player's Core
Integrity. A Unit that did not attack MAY NOT deal combat damage this phase, and a
Spent Unit MAY NOT be declared as either an attacker or a blocker.
```

(This block runs from the `### 5.4 Conflict Phase` heading up to, and
including, the final line ending "...as either an attacker or a blocker."
— stop before the blank line that precedes `### 5.5 Dusk Phase`. Do not
include the `### 5.5 Dusk Phase` heading in `old_string`.)

Replace it with exactly this `new_string` (note the trailing em dash
character is `—`, U+2014, matching the rest of the document — copy it as a
literal character, not `--`):

```
### 5.4 Conflict Phase

During the Conflict Phase, the active player takes the following actions,
in order:

1. **Movement.** The active player MAY take any number of Movement
   actions during the Conflict Phase. A Movement action moves one Ready
   Unit the active player controls across a single Wormhole, from the
   Planet where it is located to an adjacent Planet (Section 8.1),
   provided the Wormhole is not Closed (Section 8.5) and its Restrictions
   (Section 8.4) permit the move. Taking a Movement action costs Fount
   Points, from any combination of the active player's resource pools,
   equal to that Wormhole's Length (Section 8.1).
2. **Declaring attackers.** The active player MAY declare any number of
   their Ready Units as attackers, becoming Spent as they do; declaring a
   Unit as an attacker names the Planet it is attacking — the Planet
   being attacked. A Unit that moved this turn, whether by a Movement
   action (Rule 1) or by any other effect, MAY NOT be declared as an
   attacker this turn, unless a card or ability specifically says
   otherwise.
3. **Declaring blockers.** The non-active player MAY then declare any of
   their own Ready Units as blockers, one blocker or more per attacker. A
   Unit MAY only be declared as a blocker against an attacker if that
   Unit occupies the same Planet (Section 8.1) as the Planet being
   attacked.
4. **Unblocked damage.** An attacking Unit that is unblocked deals its
   combat strength as damage to the non-active player's Core Integrity. A
   Unit that did not attack MAY NOT deal combat damage this phase, and a
   Spent Unit MAY NOT be declared as either an attacker or a blocker.
```

Sanity checks after this edit, before moving on:
- `design/rules.md` still has exactly one `### 5.4 Conflict Phase` heading
  and it is immediately followed (further down) by `### 5.5 Dusk Phase`
  unchanged.
- No line in the new text starts with `//`.
- You did not touch Section 8.1, Section 12, or Section 14.5, even though
  they mention "Section 5.4" — those cross-references are by section
  number only and require no edits.

## Step 2 — Add tests to `test/design-rules.test.js`

File: `C:\github\.agentbox-worktrees\cardGame\cardgame-conflict-phase-movement-rules\test\design-rules.test.js`

This file currently ends at line 294/295 with the last `AC5: Priority &
Timing resolves at least one concrete timing edge case on paper` test (and
its closing `});`). Append the following new block at the end of the file
(after the last existing `});`, i.e. as new content starting at what is
currently line 295+):

```js

// ---------------------------------------------------------------------------
// Unit cardgame-conflict-phase-movement-rules — Section 5.4 Conflict Phase
// movement rules (AC1-AC5 of that unit; AC6 is "existing assertions in this
// file and in design-combat.test.js still pass", which is covered by simply
// running the full suite, not by a dedicated test here).
// ---------------------------------------------------------------------------

function conflictPhaseSection() {
  const sections = parseSections(readRules());
  const idx = findSection(sections, /^5\.4\s+conflict phase/i);
  return idx === -1 ? null : sections[idx];
}

function conflictPhaseProse() {
  const section = conflictPhaseSection();
  return section === null ? null : normalizeProse(section.lines.join('\n'));
}

test('movement-rules AC1: Section 5.4 has no lines beginning with a "//" inline comment', () => {
  const section = conflictPhaseSection();
  assert.ok(section, 'expected a "5.4 Conflict Phase" heading');
  const commentLines = section.lines.filter((line) => /^\s*\/\//.test(line));
  assert.deepStrictEqual(
    commentLines,
    [],
    `expected no "//" comment lines in Section 5.4, found: ${JSON.stringify(commentLines)}`
  );
});

test('movement-rules AC2: Section 5.4 states the active player may take a Movement action moving a Ready Unit across a single Wormhole to an adjacent Planet', () => {
  const body = conflictPhaseProse();
  assert.ok(body, 'expected a "5.4 Conflict Phase" section body');
  assert.ok(
    /active player MAY take[^.]*Movement action/i.test(body),
    'expected the active player MAY take a Movement action'
  );
  assert.ok(/Ready Unit/i.test(body), 'expected the Movement action to move a Ready Unit');
  assert.ok(/single Wormhole/i.test(body), 'expected the Movement action to cross a single Wormhole');
  assert.ok(/adjacent Planet/i.test(body), 'expected the Movement action to move to an adjacent Planet');
});

test('movement-rules AC3: Section 5.4 states a Unit that moved this turn cannot be declared as an attacker unless a card or ability says otherwise', () => {
  const body = conflictPhaseProse();
  assert.ok(body, 'expected a "5.4 Conflict Phase" section body');
  assert.ok(
    /Unit that moved this turn[^.]*MAY NOT be declared as an attacker/i.test(body),
    'expected a Unit that moved this turn MAY NOT be declared as an attacker this turn'
  );
  assert.ok(
    /unless a card or ability specifically says otherwise/i.test(body),
    'expected the default-no-attack rule to carry a card/ability exception'
  );
});

test('movement-rules AC4: Section 5.4 states a Unit may only be declared as a blocker if it occupies the same Planet as the Planet being attacked', () => {
  const body = conflictPhaseProse();
  assert.ok(body, 'expected a "5.4 Conflict Phase" section body');
  assert.ok(
    /MAY only be declared as a blocker[^.]*occupies the same Planet[^.]*Planet being attacked/i.test(body),
    'expected a blocker declaration to require occupying the same Planet as the Planet being attacked'
  );
});

test("movement-rules AC5: Section 5.4 states the Movement action costs Fount Points equal to the traversed Wormhole's Length", () => {
  const body = conflictPhaseProse();
  assert.ok(body, 'expected a "5.4 Conflict Phase" section body');
  assert.ok(
    /Movement action costs Fount Points[^.]*equal to[^.]*Wormhole's Length/i.test(body),
    "expected the Movement action to cost Fount Points equal to the traversed Wormhole's Length"
  );
});
```

Notes on this addition:
- `parseSections`, `findSection`, `normalizeProse`, and `readRules` are all
  already imported/defined at the top of this file (lines 1-13) — do not
  re-import or redefine them.
- `conflictPhaseSection()` reads `section.lines` directly (the raw,
  non-normalized lines under the `### 5.4 Conflict Phase` heading, stopping
  at the next heading of any level — this is how `parseSections` works, see
  `test/helpers/markdown.js`) so the AC1 "//"-comment check sees the exact
  source lines rather than whitespace-collapsed prose.
- `conflictPhaseProse()` reuses the same lines but normalized, for the
  prose-pattern assertions (AC2-AC5), matching the pattern already used by
  `combatProse()` in `test/design-combat.test.js` and `keywordProse()` in
  `test/design-keyword-abilities.test.js`.

## Step 3 — Run the test command

```
node --test
```

Expected output: every test file passes, including the 5 new tests above
and every pre-existing test in `test/design-rules.test.js` and
`test/design-combat.test.js` (AC6). The final summary line should read
something like:

```
# pass 750+
# fail 0
```

(exact pass count will be higher than on `main` by the 5 tests added here;
don't hand-verify the exact number, just confirm `# fail 0`).

If `test/build-site.test.js` runs as part of the same `node --test` pass, it
will regenerate `site/design/rules.html` (and `site/index.html`) from the
new `design/rules.md` content as a normal side effect of that test calling
`tools/build-site.js` — `git status` will show those two files as modified
afterward. That is expected; it is the same "site: regenerate" pattern used
by prior units in this repo's history (see e.g. commit `12b8a5c`). Leave
those regenerated files as-is; do not hand-edit HTML.

## Why this satisfies each AC

- **AC1**: no `//`-prefixed line appears anywhere in the new Section 5.4
  text (verified by the new AC1 test, which greps the section's raw
  lines).
- **AC2**: Rule 1 ("Movement") states, in numbered prose, that the active
  player MAY take a Movement action moving one Ready Unit across a single
  Wormhole to an adjacent Planet.
- **AC3**: Rule 2 ("Declaring attackers") states a Unit that moved this
  turn MAY NOT be declared as an attacker this turn, unless a card or
  ability specifically says otherwise.
- **AC4**: Rule 3 ("Declaring blockers") states a Unit MAY only be
  declared as a blocker against an attacker if it occupies the same
  Planet as the Planet being attacked (the Planet named when the attacker
  was declared, per Rule 2).
- **AC5**: Rule 1 states the Movement action costs Fount Points equal to
  the traversed Wormhole's Length — the same direct Length-equals-cost
  model already used for Assault (Section 8.6: "Fount Points equal to the
  sum of the Lengths of every Wormhole on the path"), not Discovery's
  inverted `10 - Length` formula and not any per-race asymmetry. This
  matches the unit's explicit instruction to pick "the single concrete,
  already-implied Length-based Fount Point cost consistent with
  Discovery/Assault rather than inventing untested per-race asymmetry."
- **AC6 (held out)**: verified by re-running the full suite (Step 3); no
  test in `design-rules.test.js` or `design-combat.test.js` inspects the
  literal old placeholder text of Section 5.4 (confirmed during planning —
  `design-combat.test.js` only inspects Section 12's body; the pre-existing
  `design-rules.test.js` AC3 test only requires each Turn Structure phase's
  body to contain `/\bmay\b/i` and one of
  `/\bmay not\b|\bcannot\b|\bno player\b|\bnever\b/i`, both of which the
  rewritten Section 5.4 still satisfies abundantly).

The vaguer, explicitly speculative aside from the original notes ("maybe
two races need mainly time, two races need mainly resources") is
intentionally dropped, not preserved or resolved — it was never decided
design, and the unit's Intent says to leave it alone rather than invent an
answer.

## Held-out criteria discipline

AC6 (held out) is a redundant restatement of "don't break other tests" — it
names no requirement absent from AC1-AC5 or ordinary regression hygiene, so
it is not a spec bug and needs no special handling beyond running the full
suite.

## Known residual inconsistency (flagged, not fixed — out of scope)

`design/rules.md` Section 8.1 (lines ~438-449, untouched by this plan)
currently reads:

> "(This deployment freedom is provisional: Section 5.4 already carries
> open, unresolved notes contemplating a costed wormhole-movement system,
> and adopting one may narrow where a Unit may be deployed.) ... this
> rulebook currently defines no action, on its own, that relocates an
> already-deployed Unit — the actions that grant movement are deliberately
> left to future rules or cards, a design space Section 5.4's open notes
> already flag."

After this unit, Section 5.4 no longer carries "open, unresolved notes" —
it defines a concrete Movement action. Section 8.1's text becomes stale
(it describes as future/unresolved what 5.4 now resolves). The unit's
Intent explicitly restricts scope to "design/rules.md's Section 5.4 and
its owning test file" only, and states "No card file and no code outside
the test file is touched." Per that explicit instruction, this plan does
NOT edit Section 8.1. A follow-up unit should reconcile Section 8.1's
language with the new Section 5.4 (likely by pointing at the new Movement
action there instead of calling it "unresolved"), the same way
`cardgame-spatial-rules-notes-reconciliation` previously reconciled the
rest of Section 8. No test in the current suite currently checks Section
8.1's prose against Section 5.4's, so this inconsistency will not fail
`node --test` — it is a documentation-quality gap, not a graded defect.

## FIRE risk self-assessment

- **Reversibility**: fully reversible — a `git revert` of one commit
  restores the prior text exactly; no runtime state, migrations, or
  external systems involved.
- **Security impact**: none — this is prose in a design document plus
  unit tests; no executable game logic, no user input handling.
- **User data impact**: none.
- **Schema changes**: none.

Overall risk: minimal. `GATE: none`.
