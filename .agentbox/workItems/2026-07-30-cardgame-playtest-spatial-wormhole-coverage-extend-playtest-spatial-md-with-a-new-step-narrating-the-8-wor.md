# cardgame-playtest-spatial-wormhole-coverage: Extend playtest-spatial.md with a new step narrating the 8 Wormhole Restriction/Closure cards Steps 8-9 still leave unplayed

## Header

- unit: cardgame-playtest-spatial-wormhole-coverage
- title: Extend playtest-spatial.md with a new step narrating the 8 Wormhole Restriction/Closure cards Steps 8-9 still leave unplayed
- project: cardgame
- completed: 2026-07-30
- outcome: merged (orchestrator recovery: guard fired on gate-authorized test renumber; work completed by hand)
- start_sha: 8b17fc026e2129bad499a217a5e3e7a4903dd8b0
- end_sha: 044e61940437e675017bfe6299a96a0638953571

## Intent

design/playtest-spatial.md is the on-paper Spatial Battlefield Playtest Procedure that cites exact rules.md sections for every physical action so playtesters can cross-check the table against rule text. Its Step 8 ('Add a Restriction to a Wormhole') narrates only Bastion Lockdown Line (2 Mass, Cindral Reach) from design/cards/wormhole-restrictions-set.md's 5 cards, and Step 9 ('Close a Wormhole') narrates only Chokepoint Demolition Charge (2 Circuit, Wrought Assembly) from design/cards/wormhole-closure-cards.md's 5 cards — both refreshed from a card-less placeholder to a named card by the already-merged cardgame-playtest-spatial-restriction-refresh and cardgame-playtest-spatial-closure-refresh units. The other 8 cards across those two files — Conveyance Directive (2 Circuit, Wrought Assembly), Rootbound Corridor (2 Bloom, Mireth Bloom), Vector Interdiction (1 Signal, Panoptic Concord), and Pilgrim's Right of Way (2 Tangle, Starweave Communion) from wormhole-restrictions-set.md; Bastion Seal Detachment (2 Mass, Cindral Reach), Withering Conduit Rot (2 Bloom, Mireth Bloom), Severance Directive (1 Signal, Panoptic Concord), and Rite of the Sealed Tangle (2 Tangle, Starweave Communion) from wormhole-closure-cards.md — have never been named in any playtest procedure. Add a new numbered step to design/playtest-spatial.md's Procedure, positioned after the existing Step 9 and before the existing Assault step, following Step 11's own established pattern for narrating multiple cards against the graph already on the table: for each of the 4 remaining Restriction cards, write the same 'one-way' or Team-claim note Step 8 already teaches, naming that specific card and its Cost line; for each of the 4 remaining Closure cards, cross out a different line the same way Step 9 already teaches, naming that specific card and its Cost line. Do not alter the existing text of Steps 1-9, Step 11, the Materials list, or the 'What to watch for' section — this unit is purely additive. Add one new, independent test file verifying the new step names all 8 cards by exact name and Cost line as printed in their source files. Regenerate site/design/playtest-spatial.html via tools/build-site.js.

## Acceptance Criteria

- AC1 [inferred]: design/playtest-spatial.md's new step names all 4 remaining Wormhole Restrictions Set cards by exact name and Cost line: Conveyance Directive (2 Circuit), Rootbound Corridor (2 Bloom), Vector Interdiction (1 Signal), Pilgrim's Right of Way (2 Tangle)
- AC2 [inferred]: design/playtest-spatial.md's new step names all 4 remaining Wormhole Closure Cards cards by exact name and Cost line: Bastion Seal Detachment (2 Mass), Withering Conduit Rot (2 Bloom), Severance Directive (1 Signal), Rite of the Sealed Tangle (2 Tangle)
- AC3 [paraphrase] (held_out): For each of the 8 newly narrated cards, the new step ties its narration to a distinct physical action matching that card's Rules text (a Restriction note for the 4 restriction cards, a crossed-out line for the 4 closure cards), not a generic restatement of Step 8 or Step 9's own action
- AC4 [inferred]: Steps 1 through 9 and Step 11 of design/playtest-spatial.md, the Materials list, and the 'What to watch for' section are present byte-for-byte unchanged from before this unit
- AC5 [paraphrase]: site/design/playtest-spatial.html is regenerated via tools/build-site.js from the updated markdown and contains all 8 newly narrated card names; the new test file mechanically asserts all 8 card names and Cost lines appear in design/playtest-spatial.md

## Plan

GATE: confirm

# Plan: cardgame-playtest-spatial-wormhole-coverage

## Why GATE: confirm (read this before implementing)

The unit says the new step must be "positioned after the existing Step 9
and before the existing Assault step" (Assault is currently **Step 10**),
and separately says "Do not alter the existing text of Steps 1-9, **Step
11** ... this unit is purely additive."

Inserting a new numbered step between Step 9 and Step 10 necessarily
renumbers everything after it: Assault 10→11, "Narrate the Spatial Race
Identity cards" 11→12, "Replay Section 8.7's worked example" 12→13, "Play
to a conclusion" 13→14. The *body text* of the old Step 10 and Step 11
stays byte-for-byte identical (only their leading digit changes) — this is
exactly the same convention this repo already used the last time a step
was inserted here (see `test/design-playtest-spatial-race-identity-refresh.test.js`'s
own `AC4: renumbered steps 12 and 13 carry the old step 11/12 content`
test, from when *that* unit pushed the old steps 11/12 to 12/13). So "Step
11 ... unchanged" is best read as "the content that is currently Step 11
is unchanged," not "stays numbered 11" — consistent with precedent.

**The catch:** `test/design-playtest-spatial-race-identity-refresh.test.js`
(from the already-merged `cardgame-playtest-spatial-race-identity-refresh`
unit) hardcodes `stepText(content, 10)` for the Assault step and
`stepText(content, 11)` for the Spatial Race Identity step in several of
its own assertions (lines 54, 65, 96, 145-146). If Step 10 becomes the new
step and Step 11 becomes Assault, those specific assertions start reading
the wrong step's body and will fail under `node --test` — not because
anything about their *intent* changed, but because their hardcoded step
numbers are now stale.

This plan resolves the conflict by bumping those five hardcoded numbers in
that one existing test file (10→11, 11→12, 12→13, 13→14 — purely
mechanical, no assertion logic changes, no design text changes). That is
the smallest fix that keeps `node --test` green while honoring the
insertion point the unit asks for. Flagging this because it means the
build touches a file outside `design/playtest-spatial.md` and the one new
test file — confirm this is acceptable before building, or say so if a
different insertion point / a different resolution is preferred.

Everything else about this unit is low-risk: additive markdown prose plus
one new, independent test file plus a deterministic site rebuild. No
schema, security, or user-data surface at all.

---

## 1. Background (already verified by reading the repo)

- `design/playtest-spatial.md` currently has Steps 1-13. Step 8 (Add a
  Restriction) narrates **Bastion Lockdown Line** only. Step 9 (Close a
  Wormhole) narrates **Chokepoint Demolition Charge** only. Step 10 is
  Assault. Step 11 ("Narrate the Spatial Race Identity cards on this same
  graph") is the pattern to imitate: a lettered list `a.`-`e.`, each item
  citing `(Cost line: X, Type line: Y, the RACE card in *source file*)`,
  describing a physical action, and ending in a "Confirm aloud that ..."
  sentence tied to something specific that card's text does.
- `design/cards/wormhole-restrictions-set.md` has 5 cards. Step 8 already
  covers **Bastion Lockdown Line** (Cindral Reach, 2 Mass, Directional
  Restriction). The 4 remaining:
  - **Conveyance Directive** (Wrought Assembly) — Cost line: 2 Circuit,
    Type line: Technology — Permanent. Also a Generator (produces 1
    Circuit Point/turn) in addition to granting a Directional Restriction.
  - **Rootbound Corridor** (Mireth Bloom) — Cost line: 2 Bloom, Type line:
    Biology — Permanent. Grants a **Team** Restriction. "Spent, usable at
    instant speed (any time its controller holds priority)."
  - **Vector Interdiction** (Panoptic Concord) — Cost line: 1 Signal, Type
    line: Intelligence. Grants a **Team** Restriction. Fast.
  - **Pilgrim's Right of Way** (Starweave Communion) — Cost line: 2
    Tangle, Type line: Magic. Grants a **Team** Restriction. Slow.
- `design/cards/wormhole-closure-cards.md` has 5 cards. Step 9 already
  covers **Chokepoint Demolition Charge** (Wrought Assembly, 2 Circuit,
  Fast). The 4 remaining:
  - **Bastion Seal Detachment** (Cindral Reach) — Cost line: 2 Mass, Type
    line: Materials — Permanent. Slow. Has a Stats/counters line: "Combat
    strength 1. Enters with no counters." (the only remaining Closure card
    with a stats line — it's also a creature-like permanent.)
  - **Withering Conduit Rot** (Mireth Bloom) — Cost line: 2 Bloom, Type
    line: Biology (no "— Permanent"). Slow.
  - **Severance Directive** (Panoptic Concord) — Cost line: 1 Signal, Type
    line: Intelligence. Fast (same timing as Chokepoint Demolition
    Charge).
  - **Rite of the Sealed Tangle** (Starweave Communion) — Cost line: 2
    Tangle, Type line: Magic. Slow.
- `tools/build-site.js` deterministically rebuilds `site/**` from
  `design/**`; it skips rewriting any output file whose bytes are
  unchanged (see `writeFileAtomic`), so running it after this change
  should only touch `site/design/playtest-spatial.html`.
- Test convention in this repo (see the three existing
  `test/design-playtest-spatial-*.test.js` files): each test file defines
  its own local `stepText(content, n)` helper (extracts the body of
  numbered step `n` by regex, collapses whitespace) rather than importing
  a shared one — follow that pattern for the new file too.

---

## 2. Edit `design/playtest-spatial.md`

Make exactly 4 edits. Do not touch anything else in the file (Steps 1-9,
Materials, "What to watch for" are all left completely alone — this
includes the "What to watch for" bullets that say "After step 10..." and
"After step 11...", which will become slightly stale after renumbering;
that is expected and required by the unit — do not "fix" them).

### Edit 1 — insert the new Step 10, renumber old Step 10 to 11

Find this exact text (it appears once, at the start of the current Step
10):

```
10. **Take an Assault action.** Once a challenger has a qualifying path
```

Replace it with (note: this inserts the entire new Step 10 block, followed
by a blank line, followed by the old Step 10 heading renumbered to `11.`
— everything after "Once a challenger..." on the original line is
untouched, only the leading `10.` on that one line becomes `11.`):

```
10. **Narrate the remaining Wormhole Restriction and Closure cards on
    this same graph.** Revisit the physical state already on the table
    from steps 6, 8, and 9, and narrate one remaining Wormhole
    Restriction or Wormhole Closure card resolving against it, in turn
    (see *design/cards/wormhole-restrictions-set.md* and
    *design/cards/wormhole-closure-cards.md*):
    a. **Conveyance Directive** (Cost line: 2 Circuit, Type line:
       Technology — Permanent, the Wrought Assembly card in
       *design/cards/wormhole-restrictions-set.md*) — pick a different
       drawn line on the table with an endpoint at a Planet the active
       player controls, and write "one-way: [origin]→[destination]" on
       it — with that controlled Planet as the origin — narrating that
       Conveyance Directive is the card just played to grant it a
       Directional Restriction (Section 8.4), the same kind of note
       step 8's Bastion Lockdown Line teaches. Because Conveyance
       Directive is also a Generator attuned to the Circuit, place a
       "Generator" marker on the Planet that played it if none is
       there yet, narrating that this permanent additionally produces
       1 Circuit Point every Generation Phase — an ongoing income
       Bastion Lockdown Line's own text does not grant. Confirm aloud
       that a Wormhole with no such note may still be traversed either
       way, since no-Restriction is the default.
    b. **Rootbound Corridor** (Cost line: 2 Bloom, Type line: Biology
       — Permanent, the Mireth Bloom card in *design/cards/wormhole-
       restrictions-set.md*) — pick a different drawn line on the
       table with an endpoint at a Planet the active player controls,
       and write "Team Restriction: [active player]" on it, narrating
       that Rootbound Corridor is the card just played to grant it a
       Team Restriction (Section 8.4) naming the active player, so the
       opposing challenger's Assaults may not count that line as part
       of a path. Confirm aloud that Rootbound Corridor's own text
       lets it resolve at instant speed, any time its controller holds
       priority, unlike a Slow card that can only be played on that
       controller's own Main Phase.
    c. **Vector Interdiction** (Cost line: 1 Signal, Type line:
       Intelligence, the Panoptic Concord card in *design/cards/
       wormhole-restrictions-set.md*) — pick a different drawn line on
       the table with an endpoint at a Planet the active player
       controls, and write "Team Restriction: [active player]" on it,
       narrating that Vector Interdiction is the card just played to
       grant it a Team Restriction (Section 8.4) naming the active
       player, so the opposing challenger's Assaults may not count
       that line as part of a path. Confirm aloud that Vector
       Interdiction is Fast, so — unlike the Slow cards narrated in
       this step — it could resolve any time the active player holds
       priority, not only on their own Main Phase.
    d. **Pilgrim's Right of Way** (Cost line: 2 Tangle, Type line:
       Magic, the Starweave Communion card in *design/cards/wormhole-
       restrictions-set.md*) — pick a different drawn line on the
       table with an endpoint at a Planet the active player controls,
       and write "Team Restriction: [active player]" on it, narrating
       that Pilgrim's Right of Way is the card just played to grant it
       a Team Restriction (Section 8.4) naming the active player, so
       the opposing challenger's Assaults may not count that line as
       part of a path. Confirm aloud that Pilgrim's Right of Way is
       Slow, unlike Vector Interdiction's Fast timing, and that a
       Restriction card has now been named for each of the five races
       across step 8 and this step.
    e. **Bastion Seal Detachment** (Cost line: 2 Mass, Type line:
       Materials — Permanent, the Cindral Reach card in *design/cards/
       wormhole-closure-cards.md*) — pick a different drawn line on
       the table with an endpoint at a Planet the active player
       controls, cross it out fully, narrating that Bastion Seal
       Detachment is the card just played to Close it (Section 8.5),
       and note that the two Planets it connected are no longer
       adjacent unless some other, un-Closed line also connects them.
       Confirm aloud that Bastion Seal Detachment carries a Combat
       strength of 1 and enters with no counters, unlike step 9's
       Chokepoint Demolition Charge, which has no combat stats of its
       own.
    f. **Withering Conduit Rot** (Cost line: 2 Bloom, Type line:
       Biology, the Mireth Bloom card in *design/cards/wormhole-
       closure-cards.md*) — pick a different drawn line on the table
       with an endpoint at a Planet the active player controls, cross
       it out fully, narrating that Withering Conduit Rot is the card
       just played to Close it (Section 8.5), and note that the two
       Planets it connected are no longer adjacent unless some other,
       un-Closed line also connects them. Confirm aloud that Withering
       Conduit Rot's Biology Type line carries no Permanent tag, so —
       unlike Bastion Seal Detachment just narrated — nothing stays
       behind on the table once it resolves; only the crossed-out line
       shows it was ever played.
    g. **Severance Directive** (Cost line: 1 Signal, Type line:
       Intelligence, the Panoptic Concord card in *design/cards/
       wormhole-closure-cards.md*) — pick a different drawn line on
       the table with an endpoint at a Planet the active player
       controls, cross it out fully, narrating that Severance
       Directive is the card just played to Close it (Section 8.5),
       and note that the two Planets it connected are no longer
       adjacent unless some other, un-Closed line also connects them.
       Confirm aloud that Severance Directive is Fast, so — like step
       9's Chokepoint Demolition Charge — it could resolve any time
       the active player holds priority, not only on their own Main
       Phase.
    h. **Rite of the Sealed Tangle** (Cost line: 2 Tangle, Type line:
       Magic, the Starweave Communion card in *design/cards/wormhole-
       closure-cards.md*) — pick a different drawn line on the table
       with an endpoint at a Planet the active player controls, cross
       it out fully, narrating that Rite of the Sealed Tangle is the
       card just played to Close it (Section 8.5), and note that the
       two Planets it connected are no longer adjacent unless some
       other, un-Closed line also connects them. Confirm aloud that
       Rite of the Sealed Tangle is Slow, and that a Closure card has
       now been named for each of the five races across step 9 and
       this step.

11. **Take an Assault action.** Once a challenger has a qualifying path
```

### Edit 2 — renumber old Step 11 to 12 (body unchanged)

Find (unique, exact):
```
11. **Narrate the Spatial Race Identity cards on this same graph.**
```
Replace with:
```
12. **Narrate the Spatial Race Identity cards on this same graph.**
```
Nothing else on this line or in the rest of that step's body changes —
including the sub-clause "from steps 6, 8, 9, and 10", which stays
literally as-is even though Assault is now step 11, not step 10. That
staleness is required by the unit's "do not alter Step 11" instruction;
do not correct it.

### Edit 3 — renumber old Step 12 to 13

Find (unique, exact):
```
12. **Replay Section 8.7's worked example once, on this same table.**
```
Replace with:
```
13. **Replay Section 8.7's worked example once, on this same table.**
```

### Edit 4 — renumber old Step 13 to 14

Find (unique, exact):
```
13. **Play to a conclusion.**
```
Replace with:
```
14. **Play to a conclusion.**
```

After these 4 edits, verify by eye that the "Materials" section and
"What to watch for" section (untouched) still read exactly as before, and
that Steps 1-9 are byte-for-byte identical to before this unit.

---

## 3. Fix the one existing test file whose hardcoded step numbers shift

File: `test/design-playtest-spatial-race-identity-refresh.test.js`

Make these 6 mechanical edits (numbers only — no assertion logic changes):

### Edit A (comment, cosmetic but do it for clarity)

Find:
```
// ---------------------------------------------------------------------------
// AC4: steps 1-10, Materials, and existing "What to watch for" bullets are
// unchanged; only additive changes were made (new step 11, renumbered
// 12/13, one new "What to watch for" bullet).
// ---------------------------------------------------------------------------
```
Replace with:
```
// ---------------------------------------------------------------------------
// AC4: steps 1-10, Materials, and existing "What to watch for" bullets are
// unchanged; only additive changes were made (new step 11, renumbered
// 12/13, one new "What to watch for" bullet). NOTE: the step numbers 11+
// referenced below were bumped by +1 when the later
// cardgame-playtest-spatial-wormhole-coverage unit inserted its own new
// step 10, pushing Assault (10->11), this step's own content (11->12), and
// the trailing two steps (12->13, 13->14).
// ---------------------------------------------------------------------------
```

### Edit B

Find:
```
test('AC1: step 11 names all 5 Spatial Race Identity cards verbatim', () => {
  const body = stepText(readFile(PLAYTEST_PATH), 11);
  for (const card of CARDS) {
    assert.ok(body.includes(card.name), `expected step 11 to name "${card.name}"`);
  }
});
```
Replace with:
```
test('AC1: step 12 names all 5 Spatial Race Identity cards verbatim', () => {
  const body = stepText(readFile(PLAYTEST_PATH), 12);
  for (const card of CARDS) {
    assert.ok(body.includes(card.name), `expected step 12 to name "${card.name}"`);
  }
});
```

### Edit C

Find:
```
test('AC2: step 11 cites each card\'s exact Cost line', () => {
  const body = stepText(readFile(PLAYTEST_PATH), 11);
  for (const card of CARDS) {
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(body),
      `expected step 11 to cite "${card.name}"'s Cost line "${card.cost}"`
    );
  }
});
```
Replace with:
```
test('AC2: step 12 cites each card\'s exact Cost line', () => {
  const body = stepText(readFile(PLAYTEST_PATH), 12);
  for (const card of CARDS) {
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(body),
      `expected step 12 to cite "${card.name}"'s Cost line "${card.cost}"`
    );
  }
});
```

### Edit D

Find:
```
test('AC3: step 11 cites the correct rules.md section(s) for each card', () => {
  const body = stepText(readFile(PLAYTEST_PATH), 11);
  for (const card of CARDS) {
    for (const section of card.sections) {
      assert.ok(
        new RegExp(`Section ${section.replace('.', '\\.')}`).test(body),
        `expected step 11 to cite Section ${section} for ${card.name}`
      );
    }
  }
});
```
Replace with:
```
test('AC3: step 12 cites the correct rules.md section(s) for each card', () => {
  const body = stepText(readFile(PLAYTEST_PATH), 12);
  for (const card of CARDS) {
    for (const section of card.sections) {
      assert.ok(
        new RegExp(`Section ${section.replace('.', '\\.')}`).test(body),
        `expected step 12 to cite Section ${section} for ${card.name}`
      );
    }
  }
});
```

### Edit E

Find:
```
  assert.ok(
    stepText(content, 10).includes('A Homeworld card MAY be Blockaded this way'),
    'expected step 10 to be unchanged'
  );
```
Replace with:
```
  assert.ok(
    stepText(content, 11).includes('A Homeworld card MAY be Blockaded this way'),
    'expected step 11 (Assault, renumbered from 10 by the wormhole-coverage unit) to be unchanged'
  );
```

### Edit F

Find:
```
test('AC4: renumbered steps 12 and 13 carry the old step 11/12 content', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    stepText(content, 12).includes("Replay Section 8.7's worked example"),
    'expected renumbered step 12 to be the old worked-example replay step'
  );
  assert.ok(
    stepText(content, 13).includes('Play to a conclusion.'),
    'expected renumbered step 13 to be the old play-to-a-conclusion step'
  );
});
```
Replace with:
```
test('AC4: renumbered steps 13 and 14 carry the old step 11/12 content', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    stepText(content, 13).includes("Replay Section 8.7's worked example"),
    'expected renumbered step 13 to be the old worked-example replay step'
  );
  assert.ok(
    stepText(content, 14).includes('Play to a conclusion.'),
    'expected renumbered step 14 to be the old play-to-a-conclusion step'
  );
});
```

Leave every other test in this file (Materials, steps 1/6/8/9 unchanged,
"What to watch for" bullets) exactly as-is — those don't reference a
number that moved.

---

## 4. New test file: `test/design-playtest-spatial-wormhole-coverage.test.js`

Create this file with the following complete content:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const PLAYTEST_PATH = path.join(REPO_ROOT, 'design', 'playtest-spatial.md');
const RESTRICTIONS_CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'wormhole-restrictions-set.md');
const CLOSURE_CARDS_PATH = path.join(REPO_ROOT, 'design', 'cards', 'wormhole-closure-cards.md');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'tools', 'build-site.js');
const SITE_HTML_PATH = path.join(REPO_ROOT, 'site', 'design', 'playtest-spatial.html');

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

function step10() {
  return stepText(readFile(PLAYTEST_PATH), 10);
}

const RESTRICTION_CARDS = [
  { name: 'Conveyance Directive', cost: '2 Circuit' },
  { name: 'Rootbound Corridor', cost: '2 Bloom' },
  { name: 'Vector Interdiction', cost: '1 Signal' },
  { name: "Pilgrim's Right of Way", cost: '2 Tangle' },
];

const CLOSURE_CARDS = [
  { name: 'Bastion Seal Detachment', cost: '2 Mass' },
  { name: 'Withering Conduit Rot', cost: '2 Bloom' },
  { name: 'Severance Directive', cost: '1 Signal' },
  { name: 'Rite of the Sealed Tangle', cost: '2 Tangle' },
];

// ---------------------------------------------------------------------------
// AC1: step 10 names all 4 remaining Wormhole Restrictions Set cards by
// exact name and Cost line.
// ---------------------------------------------------------------------------

test('AC1: step 10 names all 4 remaining Wormhole Restrictions Set cards verbatim', () => {
  const body = step10();
  for (const card of RESTRICTION_CARDS) {
    assert.ok(body.includes(card.name), `expected step 10 to name "${card.name}"`);
  }
});

test('AC1: step 10 cites each remaining Restriction card\'s exact Cost line', () => {
  const body = step10();
  for (const card of RESTRICTION_CARDS) {
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(body),
      `expected step 10 to cite "${card.name}"'s Cost line "${card.cost}"`
    );
  }
});

test('AC1: each remaining Restriction card\'s Cost line in its source file matches what step 10 narrates', () => {
  const cards = readFile(RESTRICTIONS_CARDS_PATH);
  for (const card of RESTRICTION_CARDS) {
    const block = cardBlock(cards, card.name);
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(block),
      `expected ${card.name}'s Cost line in wormhole-restrictions-set.md to read "${card.cost}"`
    );
  }
});

// ---------------------------------------------------------------------------
// AC2: step 10 names all 4 remaining Wormhole Closure Cards cards by exact
// name and Cost line.
// ---------------------------------------------------------------------------

test('AC2: step 10 names all 4 remaining Wormhole Closure Cards cards verbatim', () => {
  const body = step10();
  for (const card of CLOSURE_CARDS) {
    assert.ok(body.includes(card.name), `expected step 10 to name "${card.name}"`);
  }
});

test('AC2: step 10 cites each remaining Closure card\'s exact Cost line', () => {
  const body = step10();
  for (const card of CLOSURE_CARDS) {
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(body),
      `expected step 10 to cite "${card.name}"'s Cost line "${card.cost}"`
    );
  }
});

test('AC2: each remaining Closure card\'s Cost line in its source file matches what step 10 narrates', () => {
  const cards = readFile(CLOSURE_CARDS_PATH);
  for (const card of CLOSURE_CARDS) {
    const block = cardBlock(cards, card.name);
    assert.ok(
      new RegExp(`Cost line:\\s*${card.cost}`).test(block),
      `expected ${card.name}'s Cost line in wormhole-closure-cards.md to read "${card.cost}"`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3 (held_out): each of the 8 cards ties to a distinct physical action
// grounded in that card's own Rules text, not a bare repeat of step 8 or
// step 9's own action.
// ---------------------------------------------------------------------------

test('AC3: the 3 remaining Team-Restriction cards are tied to a Team Restriction note, distinct from step 8\'s one-way note', () => {
  const body = step10();
  for (const card of ['Rootbound Corridor', 'Vector Interdiction', "Pilgrim's Right of Way"]) {
    const idx = body.indexOf(card);
    assert.notStrictEqual(idx, -1, `expected step 10 to name "${card}"`);
    const nearby = body.slice(idx, idx + 500);
    assert.ok(
      /Team Restriction/.test(nearby),
      `expected ${card}'s narration to mention a Team Restriction, not a one-way note`
    );
  }
});

test('AC3: Conveyance Directive is tied to its own Generator ability, not just a bare one-way note', () => {
  const body = step10();
  const idx = body.indexOf('Conveyance Directive');
  assert.notStrictEqual(idx, -1, 'expected step 10 to name "Conveyance Directive"');
  const nearby = body.slice(idx, idx + 700);
  assert.ok(/one-way/.test(nearby), 'expected Conveyance Directive to still get a one-way note like step 8');
  assert.ok(
    /Generator/.test(nearby) && /Circuit Point/.test(nearby),
    'expected Conveyance Directive\'s narration to mention its own Generator/Circuit Point ability'
  );
});

test('AC3: each of the 4 remaining Closure cards is tied to a distinct card-specific detail, not identical boilerplate', () => {
  const body = step10();
  const distinguishers = {
    'Bastion Seal Detachment': /Combat strength/,
    'Withering Conduit Rot': /no Permanent tag/,
    'Severance Directive': /Fast/,
    'Rite of the Sealed Tangle': /five races/,
  };
  for (const [card, distinguisher] of Object.entries(distinguishers)) {
    const idx = body.indexOf(card);
    assert.notStrictEqual(idx, -1, `expected step 10 to name "${card}"`);
    const nearby = body.slice(idx, idx + 700);
    assert.ok(
      distinguisher.test(nearby),
      `expected ${card}'s narration to include a detail distinct from the other Closure cards' narration`
    );
  }
});

// ---------------------------------------------------------------------------
// AC4: Steps 1-9 and (the content that used to be) Step 11 are unchanged;
// Materials and "What to watch for" are unchanged; steps renumbered by
// this unit's insertion carry the expected old content.
// ---------------------------------------------------------------------------

test('AC4: steps 1-9 are unchanged', () => {
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
    stepText(content, 8).includes('Bastion Lockdown Line') &&
      stepText(content, 8).includes(
        'Confirm aloud that a Wormhole with no such note may still be traversed either way, since no-Restriction is the default.'
      ),
    'expected step 8 to still narrate only Bastion Lockdown Line, unchanged'
  );
  assert.ok(
    stepText(content, 9).includes('Chokepoint Demolition Charge') &&
      stepText(content, 9).includes(
        'Confirm aloud that this line MAY NOT be redrawn — reconnecting those same two Planets later would require paying for a brand-new Discovery action from scratch.'
      ),
    'expected step 9 to still narrate only Chokepoint Demolition Charge, unchanged'
  );
});

test('AC4: renumbered step 11 carries the old step 10 Assault content, unchanged', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    stepText(content, 11).includes('Take an Assault action.') &&
      stepText(content, 11).includes('A Homeworld card MAY be Blockaded this way'),
    'expected renumbered step 11 to be the old Assault step, unchanged'
  );
});

test('AC4: renumbered step 12 carries the old step 11 Spatial Race Identity content, unchanged', () => {
  const content = readFile(PLAYTEST_PATH);
  const body = stepText(content, 12);
  assert.ok(
    body.includes('Narrate the Spatial Race Identity cards on this same graph.'),
    'expected renumbered step 12 to be the old Spatial Race Identity step'
  );
  assert.ok(
    body.includes('Revisit the physical state already on the table from steps 6, 8, 9, and 10'),
    'expected step 12\'s body text to be byte-for-byte unchanged, including its now-stale "step 10" reference'
  );
});

test('AC4: renumbered steps 13 and 14 carry the old steps 12/13 content', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    stepText(content, 13).includes("Replay Section 8.7's worked example"),
    'expected renumbered step 13 to be the old worked-example replay step'
  );
  assert.ok(
    stepText(content, 14).includes('Play to a conclusion.'),
    'expected renumbered step 14 to be the old play-to-a-conclusion step'
  );
});

test('AC4: Materials section is unchanged', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(content.includes('## Materials'), 'expected "## Materials" heading to still exist');
  assert.ok(
    content.includes('Five small piles of counters (or a tally sheet), one pile per Fount'),
    'expected the Fount-piles Materials bullet to be unchanged'
  );
});

test('AC4: "What to watch for" section is unchanged (no new bullet added)', () => {
  const content = readFile(PLAYTEST_PATH);
  assert.ok(
    content.includes("that's a signal Section 8.8's Map Setup rule isn't landing as written."),
    'expected the step-2 "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    content.includes('materials should make the difference obvious at a glance.'),
    'expected the step-10-referencing "What to watch for" bullet to be unchanged'
  );
  assert.ok(
    /After step 11,.*signal this coverage gap existed/s.test(content),
    'expected the step-11-referencing "What to watch for" bullet to be unchanged'
  );
});

// ---------------------------------------------------------------------------
// AC5: site/design/playtest-spatial.html is regenerated via
// tools/build-site.js and contains all 8 newly narrated card names.
// ---------------------------------------------------------------------------

test('AC5: node tools/build-site.js regenerates playtest-spatial.html with all 8 newly narrated card names', () => {
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: REPO_ROOT, stdio: 'pipe' });
  const html = readFile(SITE_HTML_PATH);
  for (const card of [...RESTRICTION_CARDS, ...CLOSURE_CARDS]) {
    assert.ok(html.includes(card.name), `expected site/design/playtest-spatial.html to contain "${card.name}"`);
  }
});
```

---

## 5. Regenerate the site

Run, from the repo root:

```
node tools/build-site.js
```

Expected output: `Built <N> pages into site/`. `git status` afterwards
should show only `site/design/playtest-spatial.html` as modified (every
other output page is byte-identical, and `writeFileAtomic` skips
rewriting unchanged files) — do not commit anything else in `site/`
unless the diff genuinely shows other files changed.

---

## 6. Run the full suite

```
node --test
```

Expected: all suites pass, including:
- The new `test/design-playtest-spatial-wormhole-coverage.test.js` (12
  tests, all green).
- `test/design-playtest-spatial-restriction-refresh.test.js` and
  `test/design-playtest-spatial-closure-refresh.test.js` — untouched,
  still pass (they only ever look at steps 8 and 9, which don't move).
- `test/design-playtest-spatial-race-identity-refresh.test.js` — passes
  *after* the 6 mechanical renumbering edits in section 3 above; will fail
  four different ways if those edits are skipped.
- `test/design-full-game-playtest.test.js`,
  `test/design-full-game-playtest-2.test.js`,
  `test/design-map-setup-playtest.test.js` — unaffected (no hardcoded step
  numbers beyond what's covered above).

---

## 7. Held-out AC3 assessment

AC3 ("each of the 8 newly narrated cards ties to a distinct physical
action matching that card's Rules text ... not a generic restatement of
Step 8 or Step 9's own action") is redundant with the visible intent text
("following Step 11's own established pattern for narrating multiple
cards") — it's not introducing a new requirement, just making explicit
that copy-pasting Step 8/9's action 8 times with only the name swapped
would not be enough. The plan's Step 10 draft satisfies this by grounding
each card's distinguishing detail in something that is actually different
in its Rules/Type/Stats text (Directional vs. Team Restriction, Generator
side-ability, instant-speed vs. Slow vs. Fast timing, Combat strength
stats line, Permanent vs. non-Permanent Type line). No spec bug found here.


## Findings

(no findings.md)

## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T21:34:35.556Z] **bolt:start** — unit=cardgame-playtest-spatial-wormhole-coverage start_sha=8b17fc026e2129bad499a217a5e3e7a4903dd8b0 branch=bolt/cardgame-playtest-spatial-wormhole-coverage worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-playtest-spatial-wormhole-coverage
- [2026-07-30T21:34:49.762Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T21:44:03.966Z] **plan:done** — plan.md written
- [2026-07-30T21:44:03.977Z] **gate:raised** — confirm — waiting for decision (file or API)
- [2026-07-30T22:44:39.836Z] **gate-confirm:done** — approved — Approved as planned: insert the new step after Step 9, renumber downstream steps (body text byte-identical, only leading digits change � the same convention the spatial-race-identity-refresh insertion used), and bump the five hardcoded step numbers in test/design-playtest-spatial-race-identity-refresh.test.js mechanically. Touching that one extra test file is authorized; "Step 11 unchanged" means the CONTENT currently numbered 11, per precedent.
- [2026-07-30T22:46:12.662Z] **tests:done** — RED verified on test/design-playtest-spatial-wormhole-coverage.test.js (exit=1)
- [2026-07-30T22:52:07.687Z] **bolt:escalated** — builder touched test/: test/design-playtest-spatial-race-identity-refresh.test.js
- [2026-07-30T22:52:07.966Z] **worktree:wip-commit** — preserved uncommitted builder work at cycle 1


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
