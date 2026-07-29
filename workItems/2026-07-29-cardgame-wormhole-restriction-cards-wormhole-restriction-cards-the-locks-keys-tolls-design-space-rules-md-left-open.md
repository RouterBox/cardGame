# cardgame-wormhole-restriction-cards: Wormhole Restriction cards — the 'locks, keys, tolls' design space rules.md left open

## Header

- unit: cardgame-wormhole-restriction-cards
- title: Wormhole Restriction cards — the 'locks, keys, tolls' design space rules.md left open
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: c8de43e81eb930547c73f154d340a626cd267dea
- end_sha: d3ad8f5e072680261f752960047d98bb4b12b282

## Intent

design/rules.md Section 8.4 (shipped, part of cardgame-spatial-battlefield-rules) fully defines three kinds of Wormhole Restriction — Directional, Team, and Unit-type — but its own text states the Unit-type Restriction currently has no operative effect because no card yet lets a Unit move or deploy between Planets ('a design space this rulebook leaves open'), while a Directional or Team Restriction already changes what Section 8.6's Assault action can legally path through today. Across alpha-set.md, frontier-set.md, and character-signatures.md (28 cards total), only Wormhole Ledger (frontier-set.md, Panoptic Concord) ever reads a Restriction — no card creates one, even though the 2026-07-26 ideas-inbox spatial-layer directive explicitly named 'Restriction effects become a whole card design space (locks, keys, tolls)' as an implication to design through. This unit adds a new design/cards/wormhole-restrictions-set.md with 5 cards, one per race, each with Rules text that places a Directional Restriction or a Team Restriction (never a Unit-type Restriction, which stays out of scope per rules.md's own inert-until-future-cards statement) onto an existing Wormhole, citing Section 8.4 by number the same way frontier-set.md's cards cite their sections, and paid in that race's own Fount (Cindral Reach/Mass, Mireth Bloom/Bloom, Panoptic Concord/Signal, Starweave Communion/Tangle, Wrought Assembly/Circuit) consistent with every other shipped card file. No rules.md, alpha-set.md, frontier-set.md, or character-signatures.md change is needed or made — this only exercises an already-defined mechanic that has sat unused since it shipped.

## Acceptance Criteria

- AC1 [paraphrase]: design/cards/wormhole-restrictions-set.md exists and contains exactly 5 distinct named cards, one per race under design/races/, each with a Cost line, Type line, and Rules text in that order, and a Stats/counters line only when its Type line contains 'Permanent' — the same template test/design-frontier-cards.test.js enforces for frontier-set.md.
- AC2 [paraphrase]: Every one of the 5 cards' Rules text explicitly places a Directional Restriction or a Team Restriction (as defined in rules.md Section 8.4) onto a Wormhole, and cites 'Section 8.4' by number; no card's Rules text creates or references a Unit-type Restriction.
- AC3 [paraphrase]: Each card's Cost line names exactly the Fount matching its race per the existing race-to-Fount mapping used in frontier-set.md (Cindral Reach/Mass, Mireth Bloom/Bloom, Panoptic Concord/Signal, Starweave Communion/Tangle, Wrought Assembly/Circuit).
- AC4 [inferred] (held_out): design/rules.md, design/cards/alpha-set.md, design/cards/frontier-set.md, and design/cards/character-signatures.md are byte-identical to before this unit, and none of the 5 new card names collides with any card name already printed in those three files.

## Plan

GATE: none

# Plan: cardgame-wormhole-restriction-cards

## Summary

Add one new content file, `design/cards/wormhole-restrictions-set.md`, with 5
cards (one per race) that each place a Directional Restriction or a Team
Restriction — as already fully defined in `design/rules.md` Section 8.4 — onto
an existing Wormhole. Add one new test file,
`test/design-wormhole-restrictions-cards.test.js`, that enforces AC1-AC4,
mirroring the existing `test/design-frontier-cards.test.js` and
`test/design-fount-economy-cards.test.js` conventions exactly.

**No other file is touched.** `design/rules.md`, `design/cards/alpha-set.md`,
`design/cards/frontier-set.md`, and `design/cards/character-signatures.md` are
read-only references for this unit — do not open them in an editor that could
save whitespace changes, and do not "fix" anything in them even if something
looks odd.

This is a pure content-addition unit: no rules changes, no schema changes, no
touched shared files, fully reversible (delete the two new files to undo). Risk
is low; hence `GATE: none`.

## Why this is safe / not too big for one bolt

This unit is the same shape, same size, and follows the same precedent as two
already-shipped units: the one that added `design/cards/frontier-set.md` +
`test/design-frontier-cards.test.js`, and the one that added
`design/cards/fount-economy-set.md` + `test/design-fount-economy-cards.test.js`.
Both are read below and this plan reuses their exact structure. Two files, ~110
lines of markdown + ~140 lines of test code. One bolt is correct.

## Held-out AC note (AC4)

AC4 is redundant with the intent paragraph, which already states "No rules.md,
alpha-set.md, frontier-set.md, or character-signatures.md change is needed or
made." It is not a novel requirement — just the intent restated as a checkable
fact, plus a name-collision check that is a natural consequence of picking new
card names. Not a spec bug; plan around it normally (see Step 3's manual
verification note — the "byte-identical" half of AC4 cannot be usefully
automated inside the test suite itself, since there is no stored baseline to
diff against in-repo; the existing `test/design-fount-economy-cards.test.js`
handles the analogous held-out AC the same way, with a comment pointing at its
plan.md's manual verification step instead of an automated file-diff test).

---

## Step 1 — Create `design/cards/wormhole-restrictions-set.md`

Create this file with **exactly** the following content (copy verbatim,
including blank lines and line wrapping):

```markdown
# Wormhole Restrictions Set — Locks on the Battlefield Graph

## Summary

This file contains 5 named cards, one per race, each placing a Directional
Restriction or a Team Restriction (as defined in *design/rules.md* Section
8.4) onto an existing Wormhole: the Cindral Reach (Materials, a Directional
lockdown), the Wrought Assembly (Technology, a Directional lockdown), the
Mireth Bloom (Biology, a Team claim), the Panoptic Concord (Intelligence, a
Team claim), and the Starweave Communion (Magic, a Team claim). None of
these cards creates or references a Unit-type Restriction — Section 8.4
itself states that kind of Restriction has no operative effect until some
future card lets a Unit move or deploy between Planets, a design space this
file leaves untouched. Every card follows the canonical template of
*design/rules.md* Section 9.1, and each is paid for from the one Fount
matching its race, per the mapping *design/cards/frontier-set.md* already
uses.

## The Cindral Reach

### Bastion Lockdown Line

Cost line: 2 Mass
Type line: Materials — Permanent
Rules text: Slow. Spent: choose a Wormhole with an endpoint at a Planet you
control; place a Directional Restriction (Section 8.4, which defines
Restriction) on it, permitting travel only from that Planet toward its
other endpoint, never the reverse.

*The Cindral Reach welds the door shut behind every convoy it sends out —
leaving is easy; arriving uninvited is not.*

## The Wrought Assembly

### Conveyance Directive

Cost line: 2 Circuit
Type line: Technology — Permanent
Rules text: Slow. This permanent is a Generator attuned to the Circuit:
during the Generation Phase, it produces 1 Circuit Point, added to its
controller's Circuit resource pool. Spent: choose a Wormhole with an
endpoint at a Planet you control; place a Directional Restriction (Section
8.4, which defines Restriction) on it, permitting travel only from that
Planet toward its other endpoint, never the reverse.

*The Wrought Assembly builds one design, copied without end, and needs the
line running only one way — everything it makes flows outward, nothing
flows back to interrupt it.*

## The Mireth Bloom

### Rootbound Corridor

Cost line: 2 Bloom
Type line: Biology — Permanent
Rules text: Slow. Spent, usable at instant speed (any time its controller
holds priority): choose a Wormhole with an endpoint at a Planet you
control; place a Team Restriction (Section 8.4, which defines Restriction)
on it naming yourself, so the opposing challenger's Assaults may not count
it as part of a path.
Stats/counters line: Combat strength 1. Enters with no counters.

*The Mireth Bloom doesn't ask a Wormhole's permission before growing
through it — once it takes root there, the path belongs to it alone.*

## The Panoptic Concord

### Vector Interdiction

Cost line: 1 Signal
Type line: Intelligence
Rules text: Fast. When this resolves, choose a Wormhole with an endpoint at
a Planet you control; place a Team Restriction (Section 8.4, which defines
Restriction) on it naming yourself, so the opposing challenger's Assaults
may not count it as part of a path.

*The Panoptic Concord doesn't need to fight for a route once it already
knows which route matters — it simply writes its own name on the manifest
and every rival Assault stops reading past that line.*

## The Starweave Communion

### Pilgrim's Right of Way

Cost line: 2 Tangle
Type line: Magic
Rules text: Slow. When this resolves, choose a Wormhole with an endpoint at
a Planet you control; place a Team Restriction (Section 8.4, which defines
Restriction) on it naming yourself, so the opposing challenger's Assaults
may not count it as part of a path.

*The Starweave Communion calls this a rite of passage, but the passage
only ever answers to the faithful — the Tangle itself is petitioned to
forget the other challenger's claim.*
```

### Why this content satisfies each AC

- **AC1**: 5 distinct `###` headings, one per race directory file under
  `design/races/` (each card's flavor paragraph names its race in full — e.g.
  "The Cindral Reach", "Wrought Assembly", "Mireth Bloom", "Panoptic Concord",
  "Starweave Communion" — matching the same convention
  `test/design-frontier-cards.test.js` checks against). Every card has Cost
  line → Type line → Rules text in that order. Only "Rootbound Corridor" (a
  Permanent) carries a Stats/counters line, placed after Rules text.
- **AC2**: "Bastion Lockdown Line" and "Conveyance Directive" each place a
  **Directional Restriction**; "Rootbound Corridor", "Vector Interdiction",
  and "Pilgrim's Right of Way" each place a **Team Restriction**. Every card
  cites "Section 8.4" by number and none mentions "Unit-type Restriction" or
  Unit movement at all.
- **AC3**: Cost lines are exactly `2 Mass` (Cindral Reach), `2 Circuit`
  (Wrought Assembly), `2 Bloom` (Mireth Bloom), `1 Signal` (Panoptic Concord),
  `2 Tangle` (Starweave Communion) — each naming only its race's own Fount, no
  other Fount mentioned on the same line.
- **AC4**: none of "Bastion Lockdown Line", "Conveyance Directive",
  "Rootbound Corridor", "Vector Interdiction", "Pilgrim's Right of Way"
  matches any existing card name in `alpha-set.md`, `frontier-set.md`, or
  `character-signatures.md` (verified against the current card lists below —
  re-check `grep -n "^### " design/cards/*.md` before finalizing if any of
  those files have changed since this plan was written).

---

## Step 2 — Create `test/design-wormhole-restrictions-cards.test.js`

Create this file with **exactly** the following content:

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections } = require('./helpers/markdown');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'wormhole-restrictions-set.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');
const ALPHA_PATH = path.join(__dirname, '..', 'design', 'cards', 'alpha-set.md');
const FRONTIER_PATH = path.join(__dirname, '..', 'design', 'cards', 'frontier-set.md');
const SIGNATURES_PATH = path.join(__dirname, '..', 'design', 'cards', 'character-signatures.md');

// Race -> the one Fount its Cost line must name, per the mapping
// design/cards/frontier-set.md already uses.
const RACE_TO_FOUNT = {
  'Cindral Reach': 'Mass',
  'Mireth Bloom': 'Bloom',
  'Panoptic Concord': 'Signal',
  'Starweave Communion': 'Tangle',
  'Wrought Assembly': 'Circuit',
};
const ALL_FOUNTS = Object.values(RACE_TO_FOUNT);

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readFile(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

// Each `###` heading is one card; its body is the raw lines directly under
// it — same convention as design/cards/frontier-set.md and
// test/design-frontier-cards.test.js.
function listCards() {
  const content = readFile(CARDS_PATH);
  if (content === null) return [];
  const sections = parseSections(content);
  return sections
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function listRaces() {
  if (!fs.existsSync(RACES_DIR)) return [];
  return fs
    .readdirSync(RACES_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const content = fs.readFileSync(path.join(RACES_DIR, file), 'utf8');
      const titleMatch = content.match(/^#\s+The\s+(.+)$/m);
      return { file, raceName: titleMatch ? titleMatch[1].trim() : null };
    });
}

function costLine(card) {
  const m = card.body.match(/Cost line:\s*([^\n]+)/);
  return m ? m[1].trim() : '';
}

function raceForCard(card) {
  return Object.keys(RACE_TO_FOUNT).find((race) => new RegExp(escapeRegExp(race)).test(card.body));
}

function existingCardNames(cardsPath) {
  const content = readFile(cardsPath);
  if (content === null) return [];
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => s.title);
}

const cards = listCards();
const cardsToCheck = cards.length
  ? cards
  : [{ title: '<no cards found — design/cards/wormhole-restrictions-set.md missing or empty>', body: '' }];

const races = listRaces();
const racesToCheck = races.length
  ? races
  : [{ file: '<no race files found under design/races/>', raceName: null }];

// ---------------------------------------------------------------------------
// AC1: design/cards/wormhole-restrictions-set.md exists and contains exactly
// 5 distinct named cards, one per race under design/races/, each with a Cost
// line, Type line, and Rules text in that order, and a Stats/counters line
// only when its Type line contains 'Permanent' — the same template
// test/design-frontier-cards.test.js enforces for frontier-set.md.
// ---------------------------------------------------------------------------

test('AC1: design/cards/wormhole-restrictions-set.md exists', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
});

test('AC1: wormhole-restrictions-set.md contains exactly 5 distinct named cards', () => {
  const names = cards.map((c) => c.title);
  assert.strictEqual(names.length, 5, `expected exactly 5 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

for (const race of racesToCheck) {
  test(`AC1: exactly one Wormhole Restriction card is tied to the race in ${race.file}`, () => {
    assert.ok(race.raceName, `expected a race title ("# The <Name>") in ${race.file}`);
    const raceNameRe = new RegExp(escapeRegExp(race.raceName));
    const matches = cards.filter((c) => raceNameRe.test(c.body));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one Wormhole Restriction card naming "${race.raceName}", found ${matches.length}: [${matches
        .map((m) => m.title)
        .join(', ')}]`
    );
  });
}

for (const card of cardsToCheck) {
  test(`AC1: "${card.title}" has Cost line, Type line, and Rules text in order`, () => {
    const body = card.body;
    const costIdx = body.indexOf('Cost line:');
    const typeIdx = body.indexOf('Type line:');
    const rulesIdx = body.indexOf('Rules text:');
    assert.notStrictEqual(costIdx, -1, `expected a "Cost line:" field in "${card.title}"`);
    assert.notStrictEqual(typeIdx, -1, `expected a "Type line:" field in "${card.title}"`);
    assert.notStrictEqual(rulesIdx, -1, `expected a "Rules text:" field in "${card.title}"`);
    assert.ok(
      costIdx < typeIdx && typeIdx < rulesIdx,
      `expected Cost line -> Type line -> Rules text order in "${card.title}"`
    );
  });

  test(`AC1: "${card.title}" only carries a Stats/counters line after Rules text, and only if a Permanent`, () => {
    const body = card.body;
    const rulesIdx = body.indexOf('Rules text:');
    const statsIdx = body.indexOf('Stats/counters line:');
    if (statsIdx === -1) return;
    assert.ok(
      rulesIdx !== -1 && statsIdx > rulesIdx,
      `expected Stats/counters line to follow Rules text in "${card.title}"`
    );
    const typeMatch = body.match(/Type line:\s*([^\n]+)/);
    assert.ok(typeMatch, `expected a Type line to check permanence in "${card.title}"`);
    assert.ok(
      /\bPermanent\b/.test(typeMatch[1]),
      `expected "${card.title}" to be a Permanent since it carries a Stats/counters line, got type line: ${typeMatch[1]}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC2: every card's Rules text explicitly places a Directional Restriction
// or a Team Restriction (as defined in rules.md Section 8.4) onto a
// Wormhole, cites 'Section 8.4' by number, and never creates or references a
// Unit-type Restriction.
// ---------------------------------------------------------------------------

for (const card of cardsToCheck) {
  test(`AC2: "${card.title}" places a Directional or Team Restriction and cites Section 8.4`, () => {
    const body = card.body;
    const placesDirectional = /place a Directional Restriction\b/.test(body);
    const placesTeam = /place a Team Restriction\b/.test(body);
    assert.ok(
      placesDirectional || placesTeam,
      `expected "${card.title}" to place a Directional Restriction or a Team Restriction onto a Wormhole`
    );
    assert.match(body, /Section\s+8\.4\b/, `expected "${card.title}" to cite Section 8.4 by number`);
    assert.ok(/\bWormhole\b/.test(body), `expected "${card.title}" to place its Restriction onto a Wormhole`);
  });

  test(`AC2: "${card.title}" never creates or references a Unit-type Restriction`, () => {
    assert.ok(
      !/Unit-type Restriction/i.test(card.body),
      `expected "${card.title}" not to mention a Unit-type Restriction`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3: each card's Cost line names exactly the Fount matching its race, per
// the Cindral Reach/Mass, Mireth Bloom/Bloom, Panoptic Concord/Signal,
// Starweave Communion/Tangle, Wrought Assembly/Circuit mapping already used
// in frontier-set.md.
// ---------------------------------------------------------------------------

for (const card of cardsToCheck) {
  test(`AC3: "${card.title}" Cost line names exactly the Fount matching its race`, () => {
    const race = raceForCard(card);
    assert.ok(race, `expected "${card.title}" to name one of the five races`);
    if (!race) return;
    const expectedFount = RACE_TO_FOUNT[race];
    const cost = costLine(card);
    assert.match(
      cost,
      new RegExp(`\\b${expectedFount}\\b`),
      `expected "${card.title}"'s Cost line ("${cost}") to name the ${expectedFount}, matching its race ${race}`
    );
    const otherFounts = ALL_FOUNTS.filter((f) => f !== expectedFount);
    for (const other of otherFounts) {
      assert.ok(
        !new RegExp(`\\b${other}\\b`).test(cost),
        `expected "${card.title}"'s Cost line ("${cost}") not to name any Fount besides ${expectedFount}, but it also names ${other}`
      );
    }
  });
}

// ---------------------------------------------------------------------------
// AC4 (held-out): none of the 5 new card names collides with any card name
// already printed in alpha-set.md, frontier-set.md, or
// character-signatures.md. The "rules.md, alpha-set.md, frontier-set.md, and
// character-signatures.md stay byte-identical to before this unit" half of
// AC4 is not automated here — see plan.md's Step 3 verification note
// (same approach test/design-fount-economy-cards.test.js takes for its
// analogous held-out AC).
// ---------------------------------------------------------------------------

test('AC4: none of the 5 new card names collides with alpha-set.md, frontier-set.md, or character-signatures.md', () => {
  const existing = new Set([
    ...existingCardNames(ALPHA_PATH),
    ...existingCardNames(FRONTIER_PATH),
    ...existingCardNames(SIGNATURES_PATH),
  ]);
  const collisions = cards.map((c) => c.title).filter((name) => existing.has(name));
  assert.strictEqual(
    collisions.length,
    0,
    `expected no new card name to collide with an existing card name, found collisions: [${collisions.join(', ')}]`
  );
});
```

---

## Step 3 — Verify

1. Run the full suite:

   ```
   node --test
   ```

   Expected: every test file passes, including the new
   `test/design-wormhole-restrictions-cards.test.js` (test names as listed in
   Step 2 above, all green). Node's test runner reports a final summary line
   like `# pass N` / `# fail 0` with `N` equal to the previous total plus this
   file's new test count. No pre-existing test should newly fail.

   Two existing generic tests scan `design/cards/*.md` dynamically and will
   automatically pick up the 5 new cards — this is expected and requires no
   changes on your part:
   - `test/sync-cards-to-jaina.test.js` (AC1) asserts `expectedCards.length >=
     18`; it will simply see a larger count and still pass.
   - `test/render-card.test.js` (AC1) recomputes `expectedCards.length` from
     the live directory each run, so it will expect (and produce) 5 more
     rendered SVGs than before, with no hardcoded number to update.

2. Run just the new file in isolation for a faster loop while iterating:

   ```
   node --test test/design-wormhole-restrictions-cards.test.js
   ```

   Expected: all tests in that file pass (roughly 5 + 5 + 5*2 + 5*2 + 1 = ~26
   individual `test(...)` cases, depending on race/card counts at run time).

3. Manually verify the un-automatable half of AC4 — that `design/rules.md`,
   `design/cards/alpha-set.md`, `design/cards/frontier-set.md`, and
   `design/cards/character-signatures.md` are byte-identical to before this
   unit:

   ```
   git status --porcelain
   ```

   Expected output: only two new (untracked) files —
   `design/cards/wormhole-restrictions-set.md` and
   `test/design-wormhole-restrictions-cards.test.js` — and nothing else
   listed as modified. If `git status` shows any of the four protected files
   as modified (`M` prefix), something touched them and that change must be
   reverted before this unit is considered complete — this repo's `git`
   history is otherwise the source of truth here, not this plan.

## Risk self-assessment (FIRE matrix)

- **Reversibility**: Fully reversible — delete the two new files; nothing
  else is touched.
- **Security impact**: None. No new executable code paths beyond a
  markdown-parsing test file using the exact same helpers
  (`test/helpers/markdown.js`) every sibling card-set test already uses.
- **User data**: None. This is a design-document repo with no runtime user
  data.
- **Schema changes**: None. No change to `design/rules.md`, no change to how
  any existing tool (`lib/parse-card-markdown.js`, `tools/render-card.js`,
  `tools/sync-cards-to-jaina.js`) parses cards.

`GATE: none`.


## Findings

# Blind Review — cardgame-wormhole-restriction-cards, cycle 1

## AC coverage

**AC1** — `design/cards/wormhole-restrictions-set.md` exists with exactly 5
distinct `###` cards, one per race directory under `design/races/`
(Cindral Reach, Wrought Assembly, Mireth Bloom, Panoptic Concord, Starweave
Communion). Verified by direct inspection of the file's heading structure
(`# Wormhole Restrictions Set` → five `## The <Race>` → one `### <Card>`
each). Every card has Cost line → Type line → Rules text in that order.
Only "Rootbound Corridor" (Mireth Bloom) carries a Stats/counters line, and
its Type line contains "Permanent" — satisfied. "Bastion Lockdown Line" and
"Conveyance Directive" are Permanents without a Stats/counters line, which
is allowed: rules.md defines Stats/counters line as *optional* even for
Permanents (§9.1 template def, line 144-146), and the shipped
`frontier-set.md` precedent ("Replication Beachhead", a Generator
Permanent) already omits it the same way. Satisfied.

**AC2** — Checked rules.md §8.4 (lines 477-498) against each card's Rules
text:
- "Bastion Lockdown Line" and "Conveyance Directive" place a **Directional
  Restriction**, worded as "permitting travel only from that Planet toward
  its other endpoint, never the reverse" — a faithful paraphrase of §8.4's
  Directional Restriction definition.
- "Rootbound Corridor", "Vector Interdiction", and "Pilgrim's Right of Way"
  place a **Team Restriction**, worded as "so the opposing challenger's
  Assaults may not count it as part of a path" — a faithful paraphrase of
  §8.4's Team Restriction definition, and matches the exact citation style
  already used in frontier-set.md's "Wormhole Ledger" ("Section 8.4, which
  defines Restriction").
- All 5 cards cite "Section 8.4" by number.
- None of the 5 cards' text contains "Unit-type Restriction" or references
  Unit movement/deployment between Planets — grepped for it, zero matches.
Satisfied.

**AC3** — Cost lines: Cindral Reach → `2 Mass`, Wrought Assembly →
`2 Circuit`, Mireth Bloom → `2 Bloom`, Panoptic Concord → `1 Signal`,
Starweave Communion → `2 Tangle`. Each names exactly one Fount, matching
the race-to-Fount mapping used throughout frontier-set.md, and no Cost line
names a second Fount. Satisfied.

## Test file

`test/design-wormhole-restrictions-cards.test.js` mirrors
`test/design-frontier-cards.test.js`'s structure line-for-line (same
`parseSections` helper, same race-matching pattern, same Cost/Type/Rules
ordering check, same Stats/counters-implies-Permanent check), adapted for
this unit's AC2/AC3 instead of frontier-set's AC3 (spatial-term citation).
The logic was traced by hand against the actual card file content — every
assertion the test makes matches what is actually in
`wormhole-restrictions-set.md`. (I was not able to execute the suite in
this sandbox — Bash/PowerShell commands were blocked pending approval that
never arrived non-interactively — so this is verified by static trace, not
a green run.)

## Derived site/render output

The diff also regenerates `renders/cards/*.svg` (5 files),
`site/design/cards/wormhole-restrictions-set.html`, and updates the
cross-link nav (`.siblings`) in every other `site/design/cards/*.html` plus
`site/index.html`. This isn't mentioned in plan.md's "no other file is
touched" line, but that line is scoped to the four *content* references
(rules.md/alpha-set.md/frontier-set.md/character-signatures.md), and this
output is mechanically generated by `tools/build-site.js` /
`tools/render-card.js` the same way it is for every other shipped card
file (frontier-set.md, fount-economy-set.md, etc. all have matching
renders/site entries). Checked the Fount color palette used in the new
SVGs (`Mass`→`#8a8d93`, `Circuit`→`#b5651d`, `Bloom`→`#2f9e44`,
`Signal`→`#06b6d4`, `Tangle`→`#7c3aed`, and matching cost-pip numbers)
against `tools/render-card.js`'s `FOUNT` table — exact match, confirming
this is real tool output, not hand-authored drift. PRE-EXISTING convention,
not a new pattern this diff invented.

## AC4 (held out)

plan.md explicitly holds out AC4 (no rules.md/alpha-set.md/frontier-set.md/
character-signatures.md diff, and no card-name collision) as untestable-
in-repo and not a novel requirement — it restates the intent paragraph.
Checked independently: `git diff` touches none of those four files, and
grepped all shipped `### ` card headings across alpha-set.md,
frontier-set.md, character-signatures.md, character-signatures-wave-2.md,
and fount-economy-set.md for the 5 new card names — zero collisions.

## Findings

None. No INTRODUCED defects found. This is a straightforward content
addition, faithfully implementing an already-fully-specified rules
mechanic (§8.4), following the exact template and citation conventions of
the precedent file (frontier-set.md) it's explicitly modeled on.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T06:21:23.210Z] **bolt:start** — unit=cardgame-wormhole-restriction-cards start_sha=c8de43e81eb930547c73f154d340a626cd267dea branch=bolt/cardgame-wormhole-restriction-cards worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-wormhole-restriction-cards
- [2026-07-29T06:21:30.817Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T06:28:53.496Z] **plan:done** — plan.md written
- [2026-07-29T06:30:37.160Z] **tests:done** — RED verified on test/design-wormhole-restrictions-cards.test.js (exit=1)
- [2026-07-29T06:31:41.543Z] **build:c1** — tests green, committed
- [2026-07-29T06:34:49.797Z] **review:c1** — APPROVE
- [2026-07-29T06:40:16.418Z] **review:devils-advocate** — APPROVE
- [2026-07-29T06:40:23.754Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T06:40:24.082Z] **merge:done** — auto-merged bolt/cardgame-wormhole-restriction-cards into master (worktree)


## Receipt

```json
{
  "start_sha": "c8de43e81eb930547c73f154d340a626cd267dea",
  "end_sha": "514e113a693e46f371d23801262c1df7d8edbaf4",
  "diff_nonempty": true,
  "test_cmd": "node --test",
  "exit_code": 0,
  "criteria_covered": [
    {
      "id": "AC1",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC2",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC3",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": true,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-29T06:40:23.752Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-wormhole-restriction-cards\\plan.md`.\n\nSummary of the plan:\n- **GATE: none** — pure content addition, fully reversible, no shared files touched.\n- **Step 1**: create `design/cards/wormhole-restrictions-set.md` with 5 complete cards (one per race), each placing a Directional Restriction (Cindral Reach, Wrought Assembly) or Team Restriction (Mireth Bloom, Panoptic Concord, Starweave Communion) onto a Wormhole, citing \"Section 8.4\" by number, never mentioning Unit-type Restriction, each costed in exactly its race's Fount.\n- **Step 2**: create `test/design-wormhole-restrictions-cards.test.js`, mirroring the existing `design-frontier-cards.test.js`/`design-fount-economy-cards.test.js` conventions, enforcing AC1-AC4 (including a name-collision check for AC4).\n- **Step 3**: verification instructions — full `node --test` run, isolated test-file run, and a manual `git status --porcelain` check for the byte-identical half of AC4 (not automatable in-repo, same approach the fount-economy unit used).\n\nI verified against the actual repo (rules.md §8.4, frontier-set.md's template/citation style, the shared `lib/parse-card-markdown.js` parser, and the generic `design/cards/*.md`-scanning tests) that this plan won't collide with existing card names or break other tests.",
    "test_writer": "Done. `test/design-wormhole-restrictions-cards.test.js` is the only new file (nothing under `src/` touched), covering AC1–AC3 with the same structure/helpers as `test/design-frontier-cards.test.js`:\n\n- **AC1**: file existence, exactly 5 distinct cards, one per race in `design/races/`, Cost→Type→Rules order, Stats/counters only on Permanents.\n- **AC2**: each card places a Directional or Team Restriction onto a Wormhole, cites \"Section 8.4\", and never mentions a Unit-type Restriction.\n- **AC3**: each Cost line names exactly its race's Fount and no other.\n\nI couldn't execute `node --test` myself in this session (all shell commands required approval that wasn't granted), but since `design/cards/wormhole-restrictions-set.md` doesn't exist yet, every test resolves against the empty-placeholder fallback and fails by construction (missing file, missing fields, no race matches) — confirmed by static trace. The harness's RED check will verify this directly.\n\nNote: I left out AC4 (the held-out, un-automatable name-collision/byte-identical check mentioned in plan.md) since it wasn't part of the visible ACs given to me.",
    "builder_c1": "No changes under `test/` or the four protected design files — `test/` wasn't modified, and `rules.md`/`alpha-set.md`/`frontier-set.md`/`character-signatures.md` are byte-identical to before. The `site/*.html` and `renders/cards/*.svg` diffs are generated build artifacts regenerated by the test suite itself (render-card/build-site tools), not manual edits.\n\nSummary: created `design/cards/wormhole-restrictions-set.md` with the 5 cards per the plan (verbatim). Full suite: **622 pass, 0 fail**.",
    "reviewer_c1": "APPROVE",
    "devils_advocate": "## Devil's Advocate Review — cardgame-wormhole-restriction-cards\n\n**Attempted attack 1 — rules-citation accuracy.** Checked every card's paraphrase of Directional/Team Restriction against rules.md §8.4's actual definitions. Both match word-for-sense: Directional (\"traversed from one named Planet toward the other only, never the reverse\") and Team (\"opposing challenger's Assaults MAY NOT count that Wormhole as part of a path\"). No drift found.\n\n**Attempted attack 2 — repo-wide scanning tests.** `render-card.test.js` and `sync-cards-to-jaina.test.js` both scan *all* of `design/cards/*.md` (not just the new file), so this is where an unnoticed regression would most likely hide. Checked: no card-name collisions with any of the other 23 cards repo-wide, `slugify()` output for `Pilgrim's Right of Way` matches the committed `pilgrim-s-right-of-way.svg`/`.html` naming exactly, and both scripts regenerate their outputs at test time rather than diffing against committed artifacts, so staleness in the checked-in SVGs/HTML isn't a failure mode anyway.\n\n**Attempted attack 3 — site regeneration fidelity.** Compared the hand-matching paragraph-joining behavior in the new `wormhole-restrictions-set.html` against the already-shipped `frontier-set.html` output for the identical \"Cost line / Type line / Rules text\" markdown pattern — byte-for-byte same joining convention. Not hand-diverged from the generator's behavior.\n\n**Attempted attack 4 — scope creep (Conveyance Directive's bonus Generator ability).** Flagged internally as a candidate, but frontier-set.md's `Replication Beachhead` (also Wrought Assembly, Technology) carries the identical \"Generator attuned to the Circuit... 1 Circuit Point\" boilerplate plus its own Spent ability — established precedent, not an introduced anomaly.\n\n**Attempted attack 5 — power-level balance (Vector Interdiction: 1 Signal for a permanent lockout).** Real design question, but no visible AC governs power level, and rules.md defines no removal mechani"
  }
}
```

## Comments

(no comments.md)
