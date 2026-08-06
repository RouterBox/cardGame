GATE: none

# Plan: cardgame-playtest-frontier-worlds-refresh

## Summary

`design/playtest-spatial.md` narrates every other shipped card set (Wormhole
Restriction, Wormhole Closure, Spatial Race Identity — steps 8, 9, 10, 12)
but never narrates `design/cards/frontier-worlds-set.md`'s 5 cards. This
plan adds one new step, following the established "Narrate the ... cards on
this same graph." sub-step pattern (steps 10 and 12), inserted immediately
before the closing "Play to a conclusion" step. That closing step is the
only thing that gets renumbered (14 → 15) — every other existing step keeps
both its number and its text untouched.

Two files change:

1. `design/playtest-spatial.md` — insert new step 14; renumber old step 14
   ("Play to a conclusion.") to step 15. Nothing else in the file changes.
2. `test/design-playtest-frontier-worlds-refresh.test.js` — **new file**,
   verifies the above.

No other file needs to change. In particular:
- `design/cards/frontier-worlds-set.md` is read-only ground truth — do not
  touch it.
- `tools/build-site.js` is markdown-generic (confirmed: it contains no
  hardcoded step numbers or step counts for `playtest-spatial.md`), so no
  site-generation code changes are needed. The unit's acceptance criteria
  do not require a site-regeneration assertion in the new test, so the new
  test file does not add one.
- No pre-existing `test/*.js` file needs editing for this unit — there is
  nothing to hand off to a test-writer-only lane; the single new test file
  is the entire test surface.

## Held-out criteria check

AC4 (world attribution) and AC6 (steps/Materials/"What to watch for"
unchanged aside from renumbering) are both held out. Both are redundant
with the visible intent (AC1–AC3, AC5, AC7) — AC4 just spells out the
per-card world pairing the unit description already states explicitly
(Halvorne Junction / Kelmourn Drift / Tallowfen), and AC6 is the same
"otherwise untouched aside from renumbering" statement already in the
Intent paragraph, split out as its own checkable criterion. No spec bug
found; nothing to flag.

Note also: unlike the sibling `cardgame-playtest-spatial-race-identity-refresh`
unit, neither AC6 nor the Intent paragraph asks for a new "What to watch
for" bullet — that section must be **byte-for-byte unchanged**, not just
"unchanged aside from renumbering" (it contains no step-14/15 references to
renumber anyway). Do not add a bullet.

---

## Step 1 (builder): edit `design/playtest-spatial.md`

File path: `C:\github\.agentbox-worktrees\cardGame\cardgame-playtest-frontier-worlds-refresh\design\playtest-spatial.md`
(repo-relative: `design/playtest-spatial.md`)

### 1a. Locate the exact insertion point

Find this exact text (the start of the current closing step, lines ~307–311
of the file as it stands today):

```
14. **Play to a conclusion.** Keep alternating turns (Section 5), taking
    further Discovery and Assault actions as the graph and each side's
    Fount Point income allow, until either challenger's Core Integrity
    tally reaches 0, or a challenger must draw from an empty Archive and
    cannot (Section 1) — either ends the game.
```

### 1b. Replace it with the new step 14 followed by the renumbered step 15

Replace the block above with the following (new step 14, then the old step
14 content renumbered to 15 — its body text is copied verbatim, only the
leading number changes from `14.` to `15.`):

```
14. **Narrate the Frontier Worlds Set cards on this same graph.** Revisit
    the physical state already on the table from steps 6 and 11, and
    narrate the 5 Frontier Worlds Set cards resolving against it, in turn
    (see *design/cards/frontier-worlds-set.md*):
    a. **Halvorne Reclamation Fleet** (Cost line: 2 Mass, Type line:
       Materials — Permanent, the Cindral Reach card in *design/cards/
       frontier-worlds-set.md*) — using step 6's Contested Discovery
       pattern, point to (or, if none yet names it, perform a fresh
       Contested Discovery to) a Planet card labeled **Halvorne
       Junction**, and place a Fortification counter on a Generator
       marker there (building one first per step 7 if none is there
       yet), narrating that Halvorne Reclamation Fleet is the card just
       played to place it, because a Contested Discovery action was
       taken this turn (Section 8.3, which defines Contested Discovery)
       whose destination was Halvorne Junction. Confirm aloud that if
       the Planet labeled Halvorne Junction had instead been reached
       only by a Frontier Discovery this turn, this Spent ability could
       not trigger — only a Contested Discovery destination satisfies
       its condition.
    b. **Tanglekeeper's Vigil** (Cost line: 2 Tangle, Type line: Magic,
       the Starweave Communion card in *design/cards/frontier-worlds-
       set.md*) — using step 6's Frontier Discovery pattern, point to
       (or perform a fresh Frontier Discovery, of Wormhole Length 3 or
       less, to) a different Planet card also labeled **Halvorne
       Junction** for this narration, and look at the top card of your
       Archive, putting it on the bottom instead of leaving it on top
       if desired, narrating that Tanglekeeper's Vigil is the card just
       played to resolve this way, because a Frontier Discovery action
       was taken this turn (Section 8.3, which defines Frontier
       Discovery and Wormhole Length) whose Wormhole Length was 3 or
       less and whose destination was Halvorne Junction. Confirm aloud
       that a Frontier Discovery of Wormhole Length 4 or more to the
       same Planet would NOT satisfy this card's condition, unlike
       Halvorne Reclamation Fleet's Contested-Discovery condition in
       sub-step a, which carries no Length limit of its own.
    c. **Kelmourn Wreck-Bloom** (Cost line: 2 Bloom, Type line: Biology
       — Permanent, the Mireth Bloom card in *design/cards/frontier-
       worlds-set.md*) — using step 6's Contested Discovery pattern,
       point to (or perform a fresh Contested Discovery to) a Planet
       card labeled **Kelmourn Drift**, and place a Growth counter on
       Kelmourn Wreck-Bloom (playing it there first, at Combat strength
       1 with no counters, if it isn't already on the Field), narrating
       that Kelmourn Wreck-Bloom is the card just played to place it,
       because a Contested Discovery action was taken this turn
       (Section 8.3, which defines Contested Discovery and Neutral
       Planet) whose destination was Kelmourn Drift. Confirm aloud that
       Kelmourn Wreck-Bloom resolves at instant speed, any time its
       controller holds priority, unlike Halvorne Reclamation Fleet's
       and Tanglekeeper's Vigil's Slow timing in sub-steps a and b.
    d. **Kelmourn Claim Ledger** (Cost line: 1 Signal, Type line:
       Intelligence, the Panoptic Concord card in *design/cards/
       frontier-worlds-set.md*) — point to the same Planet labeled
       Kelmourn Drift from sub-step c, confirm it still carries no
       control token (it remains a Neutral Planet on the battlefield
       graph), and look at the top card of your Archive, putting it on
       the bottom instead of leaving it on top if desired, narrating
       that Kelmourn Claim Ledger is the card just played to resolve
       this way, because Kelmourn Drift is on the battlefield graph as
       a Neutral Planet (Section 8.3, which defines Neutral Planet).
       Confirm aloud that Kelmourn Claim Ledger is Fast, so — unlike
       Kelmourn Wreck-Bloom's Spent ability in sub-step c, which needs
       a Contested Discovery taken that same turn — this card's
       condition only needs Kelmourn Drift's control status checked at
       the moment it resolves.
    e. **Tallowfen Chokepoint Works** (Cost line: 2 Circuit, Type line:
       Technology — Permanent, the Wrought Assembly card in *design/
       cards/frontier-worlds-set.md*) — using step 11's Assault pattern,
       point to (or perform a fresh Assault choosing Blockade against)
       a Planet card labeled **Tallowfen**, and create an exact token
       copy of Tallowfen Chokepoint Works, putting it directly onto the
       Field under the Blockading challenger's control, narrating that
       Tallowfen Chokepoint Works is the card whose Spent ability
       triggered, because an Assault action that resulted in a Blockade
       of Tallowfen (Section 8.6, which defines Blockade) was taken
       this turn. Confirm aloud that Tallowfen Chokepoint Works is also
       a Generator attuned to the Circuit, producing 1 Circuit Point
       every Generation Phase for as long as it and its token copy
       remain on the Field — an ongoing income none of the other four
       Frontier Worlds Set cards narrated in this step grant.

15. **Play to a conclusion.** Keep alternating turns (Section 5), taking
    further Discovery and Assault actions as the graph and each side's
    Fount Point income allow, until either challenger's Core Integrity
    tally reaches 0, or a challenger must draw from an empty Archive and
    cannot (Section 1) — either ends the game.
```

### 1c. Do not touch anything else in the file

- Steps 1–13: leave every character as-is (number and body).
- `## Materials`: leave as-is.
- `## What to watch for while playtesting`: leave as-is — no new bullet.

### Verify each fact used above against the on-disk source before typing it in

These are already confirmed against the current repo state as of this
plan, but re-check if the source files have moved on:

- `design/cards/frontier-worlds-set.md` Cost/Type lines (exact):
  - Halvorne Reclamation Fleet — `Cost line: 2 Mass` / `Type line: Materials — Permanent`
  - Tanglekeeper's Vigil — `Cost line: 2 Tangle` / `Type line: Magic`
  - Kelmourn Wreck-Bloom — `Cost line: 2 Bloom` / `Type line: Biology — Permanent`
  - Kelmourn Claim Ledger — `Cost line: 1 Signal` / `Type line: Intelligence`
  - Tallowfen Chokepoint Works — `Cost line: 2 Circuit` / `Type line: Technology — Permanent`
- Section citations already used by each card's own Rules text: 8.3 for
  the first four (Contested Discovery / Frontier Discovery+Wormhole Length
  / Contested Discovery+Neutral Planet / Neutral Planet), 8.6 for Tallowfen
  Chokepoint Works (Blockade).
- World attributions (from `design/cards/frontier-worlds-set.md`'s own
  Rules text, matching `design/star-atlas.md`'s "Frontier & Contested
  Worlds" section): Halvorne Junction (Halvorne Reclamation Fleet,
  Tanglekeeper's Vigil), Kelmourn Drift (Kelmourn Wreck-Bloom, Kelmourn
  Claim Ledger), Tallowfen (Tallowfen Chokepoint Works).

---

## Step 2 (builder or test-writer — no pre-existing test file is touched,
## so either lane is safe; this unit has no test/*.js ownership conflict):
## create `test/design-playtest-frontier-worlds-refresh.test.js`

File path: `C:\github\.agentbox-worktrees\cardGame\cardgame-playtest-frontier-worlds-refresh\test\design-playtest-frontier-worlds-refresh.test.js`
(repo-relative: `test/design-playtest-frontier-worlds-refresh.test.js`)

This is a **new** file — nothing pre-existing is modified, so the
test-writer-only-touches-test/ constraint does not create any conflict
here regardless of which stage authors it.

Full file content:

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const PLAYTEST_PATH = path.join(REPO_ROOT, 'design', 'playtest-spatial.md');
const CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'frontier-worlds-set.md');

function readFile(p) {
  assert.ok(fs.existsSync(p), `expected ${p} to exist`);
  return fs.readFileSync(p, 'utf8');
}

// Extracts the body text of numbered procedure step `n` from
// playtest-spatial.md: from the "^n. " marker up to (not including) the
// next "^(n+1). " marker. Whitespace is collapsed to single spaces so
// assertions don't care where the source happens to wrap a line.
function stepText(content, n) {
  const startRe = new RegExp(`^${n}\\.\\s+`, 'm');
  const endRe = new RegExp(`^${n + 1}\\.\\s+`, 'm');
  const startMatch = startRe.exec(content);
  assert.ok(startMatch, `expected a "${n}. " numbered step in playtest-spatial.md`);
  const rest = content.slice(startMatch.index);
  const endMatch = endRe.exec(rest);
  const body = endMatch ? rest.slice(0, endMatch.index) : rest;
  return body.replace(/\s+/g, ' ').trim();
}

function cardBlock(cardsContent, headingName) {
  const idx = cardsContent.indexOf(`### ${headingName}`);
  assert.notStrictEqual(idx, -1, `expected an exact "### ${headingName}" heading`);
  return cardsContent.slice(idx, idx + 400);
}

// Slices step 14's body from one card's name up to the next named card (or
// end of the step) so per-card assertions (world, section) can't
// accidentally match text that belongs to a different card.
function narrationFor(body, cardName, allNames) {
  const idx = body.indexOf(cardName);
  assert.notStrictEqual(idx, -1, `expected step 14 to name "${cardName}"`);
  let end = body.length;
  for (const other of allNames) {
    if (other === cardName) continue;
    const otherIdx = body.indexOf(other, idx + cardName.length);
    if (otherIdx !== -1 && otherIdx < end) end = otherIdx;
  }
  return body.slice(idx, end);
}

function step14() {
  return stepText(readFile(PLAYTEST_PATH), 14);
}

const CARDS = [
  { name: 'Halvorne Reclamation Fleet', cost: '2 Mass', type: 'Materials', world: 'Halvorne Junction', section: '8.3' },
  { name: "Tanglekeeper's Vigil", cost: '2 Tangle', type: 'Magic', world: 'Halvorne Junction', section: '8.3' },
  { name: 'Kelmourn Wreck-Bloom', cost: '2 Bloom', type: 'Biology', world: 'Kelmourn Drift', section: '8.3' },
  { name: 'Kelmourn Claim Ledger', cost: '1 Signal', type: 'Intelligence', world: 'Kelmourn Drift', section: '8.3' },
  { name: 'Tallowfen Chokepoint Works', cost: '2 Circuit', type: 'Technology', world: 'Tallowfen', section: '8.6' },
];
const CARD_NAMES = CARDS.map((c) => c.name);

// ---------------------------------------------------------------------------
// AC1: a new step 14 exists, follows the established sub-step pattern, and
// is inserted immediately before the renumbered "Play to a conclusion" step.
// ---------------------------------------------------------------------------

test('AC1: step 14 narrates the Frontier Worlds Set, following the established sub-step pattern', () => {
  const body = step14();
  assert.ok(
    /Narrate the Frontier Worlds Set cards on this same graph\./.test(body),
    'expected step 14 to open with the "Narrate the ... cards on this same graph." pattern used by steps 10 and 12'
  );
});

test('AC1: step 13 is unchanged and step 15 is the renumbered "Play to a conclusion" step', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    stepText(content, 13).includes("Replay Section 8.7's worked example"),
    'expected step 13 to still be the worked-example replay step, unchanged'
  );
  assert.ok(
    stepText(content, 15).includes('Play to a conclusion.'),
    'expected step 15 to be the renumbered "Play to a conclusion" step'
  );
  assert.ok(
    !/^16\.\s+/m.test(content),
    'expected no step 16 — only one step (old 14 -> 15) should have been renumbered'
  );
});

// ---------------------------------------------------------------------------
// AC2: step 14 names all 5 Frontier Worlds Set cards verbatim.
// ---------------------------------------------------------------------------

test('AC2: step 14 names all 5 Frontier Worlds Set cards verbatim', () => {
  const body = step14();
  for (const card of CARDS) {
    assert.ok(body.includes(card.name), `expected step 14 to name "${card.name}"`);
  }
});

// ---------------------------------------------------------------------------
// AC3: each card's Cost line in step 14 matches frontier-worlds-set.md
// exactly (checked both ways: step 14 says the right thing, and the
// hardcoded expectation above still matches the on-disk source).
// ---------------------------------------------------------------------------

test("AC3: step 14 cites each card's exact Cost line", () => {
  const body = step14();
  for (const card of CARDS) {
    const nearby = narrationFor(body, card.name, CARD_NAMES);
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(nearby),
      `expected step 14 to cite "${card.name}"'s Cost line "${card.cost}"`
    );
  }
});

test("AC3: each card's Cost/Type line in frontier-worlds-set.md matches what step 14 narrates", () => {
  const cardsContent = readFile(CARDS_PATH);
  for (const card of CARDS) {
    const block = cardBlock(cardsContent, card.name);
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(block),
      `expected ${card.name}'s Cost line in frontier-worlds-set.md to read "${card.cost}"`
    );
    assert.ok(
      new RegExp(`Type line:\\s*${card.type}`).test(block),
      `expected ${card.name}'s Type line in frontier-worlds-set.md to start with "${card.type}"`
    );
  }
});

// ---------------------------------------------------------------------------
// AC4 (held_out): step 14 names the correct Frontier/Contested world for
// each card, matching frontier-worlds-set.md's own world attributions.
// ---------------------------------------------------------------------------

test('AC4: step 14 names the correct world for each card', () => {
  const body = step14();
  for (const card of CARDS) {
    const nearby = narrationFor(body, card.name, CARD_NAMES);
    assert.ok(
      nearby.includes(card.world),
      `expected step 14's narration of "${card.name}" to name "${card.world}"`
    );
  }
});

test("AC4: each card's own Rules text in frontier-worlds-set.md names the same world", () => {
  const cardsContent = readFile(CARDS_PATH);
  for (const card of CARDS) {
    const idx = cardsContent.indexOf(`### ${card.name}`);
    assert.notStrictEqual(idx, -1, `expected an exact "### ${card.name}" heading`);
    const nextIdx = cardsContent.indexOf('###', idx + 1);
    const block = cardsContent.slice(idx, nextIdx === -1 ? undefined : nextIdx);
    assert.ok(
      block.includes(card.world),
      `expected "${card.name}"'s block in frontier-worlds-set.md to name "${card.world}"`
    );
  }
});

// ---------------------------------------------------------------------------
// AC5: step 14 cites Section 8.3 or 8.6 by number for each card, matching
// whichever section that card's own Rules text already cites.
// ---------------------------------------------------------------------------

test('AC5: step 14 cites the correct rules.md section for each card', () => {
  const body = step14();
  for (const card of CARDS) {
    const nearby = narrationFor(body, card.name, CARD_NAMES);
    assert.ok(
      new RegExp(`Section ${card.section.replace('.', '\\.')}`).test(nearby),
      `expected step 14 to cite Section ${card.section} for ${card.name}`
    );
  }
});

test("AC5: each card's own Rules text in frontier-worlds-set.md cites the same section", () => {
  const cardsContent = readFile(CARDS_PATH);
  for (const card of CARDS) {
    const idx = cardsContent.indexOf(`### ${card.name}`);
    assert.notStrictEqual(idx, -1, `expected an exact "### ${card.name}" heading`);
    const nextIdx = cardsContent.indexOf('###', idx + 1);
    const block = cardsContent.slice(idx, nextIdx === -1 ? undefined : nextIdx);
    assert.ok(
      new RegExp(`Section ${card.section.replace('.', '\\.')}`).test(block),
      `expected "${card.name}"'s Rules text in frontier-worlds-set.md to cite Section ${card.section}`
    );
  }
});

// ---------------------------------------------------------------------------
// AC6 (held_out): all previously existing numbered steps, Materials, and
// "What to watch for" are unchanged aside from the one renumbering (old
// step 14 -> 15) this insertion causes.
// ---------------------------------------------------------------------------

test('AC6: steps 1-13 are unchanged', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    stepText(content, 1).includes('Lay out the two starting Planets.'),
    'expected step 1 to be unchanged'
  );
  assert.ok(
    stepText(content, 6).includes('Take a Discovery action.'),
    'expected step 6 to be unchanged'
  );
  assert.ok(
    stepText(content, 8).includes(
      'Confirm aloud that a Wormhole with no such note may still be traversed either way, since no-Restriction is the default.'
    ),
    'expected step 8 to still end with its unchanged aloud confirmation'
  );
  assert.ok(
    stepText(content, 9).includes(
      'Confirm aloud that this line MAY NOT be redrawn — reconnecting those same two Planets later would require paying for a brand-new Discovery action from scratch.'
    ),
    'expected step 9 to still end with its unchanged aloud confirmation'
  );
  assert.ok(
    stepText(content, 10).includes(
      'Revisit the physical state already on the table from steps 6, 8, and 9'
    ),
    'expected step 10 to be unchanged'
  );
  assert.ok(
    stepText(content, 11).includes('A Homeworld card MAY be Blockaded this way'),
    'expected step 11 (Assault) to be unchanged'
  );
  assert.ok(
    stepText(content, 12).includes(
      'Revisit the physical state already on the table from steps 6, 8, 9, and 10'
    ),
    'expected step 12 (Spatial Race Identity) to be unchanged, including its own internal step references'
  );
  assert.ok(
    stepText(content, 13).includes("Replay Section 8.7's worked example"),
    'expected step 13 to be unchanged'
  );
});

test('AC6: Materials section is unchanged', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(content.includes('## Materials'), 'expected "## Materials" heading to still exist');
  assert.ok(
    content.includes("Five small piles of counters (or a tally sheet), one pile per Fount"),
    'expected the Fount-piles Materials bullet to be unchanged'
  );
});

test('AC6: "What to watch for" section is unchanged, with no new bullet added', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    content.includes("that's a signal Section 8.8's Map Setup rule isn't landing as written."),
    'expected the step-2 "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    content.includes('That\'s the "aggression costs more" toll Section 8.3 states.'),
    'expected the step-6 "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    content.includes('materials should make the difference obvious at a glance.'),
    'expected the step-10-referencing "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    /After step 11,.*signal this coverage gap existed/s.test(content),
    'expected the step-11-referencing "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    !content.includes('After step 14') && !content.includes('After step 12,'),
    'expected no new "What to watch for" bullet referencing the new step'
  );
});
```

---

## Expected outputs

Run from the repo root:

```
node --test
```

Expected: every existing test file continues to pass, plus the new
`test/design-playtest-frontier-worlds-refresh.test.js` reports all of its
`test(...)` blocks passing (13 tests: 2 for AC1, 1 for AC2, 2 for AC3, 2 for
AC4, 2 for AC5, 3 for AC6). Node's TAP-style summary line should read
something like `# pass N` with `# fail 0`, where N is the previous total
plus these 13. No existing test file's pass/fail count should change,
since `design/cards/frontier-worlds-set.md`, `design/star-atlas.md`, and
every other `design/*.md` file are untouched by this unit.

If `node tools/build-site.js` is run manually afterward (not required by
any AC here, but harmless to sanity-check), `site/design/playtest-spatial.html`
will simply pick up the new step text automatically — `build-site.js` has
no hardcoded step numbers or counts for this file.

## Risk self-assessment (FIRE matrix)

- **Reversibility**: fully reversible — a documentation-only markdown edit
  plus one new, independent test file. `git revert` trivially undoes it.
- **Security impact**: none. No code paths, no user input, no auth.
- **User data**: none touched. This is a design/playtest document.
- **Schema changes**: none.

This is a low-risk, purely additive documentation unit. GATE: none.
