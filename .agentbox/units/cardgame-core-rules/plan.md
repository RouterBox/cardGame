GATE: none

# Plan: cardgame-core-rules

This is a DESIGN unit (T8, not software) — the deliverable is a single markdown
file, `design/rules.md`, in the `cardGame` repo (`C:\github\cardGame`). Per
`feedback.md` on this unit, the correct recipe (already proven once on the sibling
unit `cardgame-world-races`) is: write a RED document-structure test first, then
write the markdown content that turns it GREEN. `node --test` is the gate; there is
no other automated check for prose quality, only for structure.

There are two files to create, in this order:

1. `C:\github\cardGame\test\design-rules.test.js` (Test Writer step — must be
   committed and RED before any content exists)
2. `C:\github\cardGame\design\rules.md` (Builder step — makes the test GREEN)

Do not modify any other file. In particular, do not touch `design/world.md`,
`design/races/*.md`, `test/design-world.test.js`, `test/design-races.test.js`, or
`test/helpers/markdown.js` — all already shipped, all out of scope, and the
existing helper module (`parseSections`, `findSection`, `sectionText`) is reused
as-is by the new test.

## Risk self-assessment (FIRE)

- **Reversibility:** Full. Two new markdown/JS files, plain text, trivially
  revertable with `git revert` / `git checkout`. No file is edited in place.
- **Security impact:** None. No dependencies, no code execution beyond `node --test`
  running plain `assert` checks against file text.
- **User data:** None touched.
- **Schema changes:** None.

Nothing here is ambiguous or destructive — proceed without a design gate.

## Held-out AC note

AC6 (worked example) and AC7 (no code/API/database/software mention) are both held
out, but neither smuggles a novel requirement:

- AC6 is a direct restatement of the unit's own intent text: "priority/timing rules
  resolving at least one basic edge case **on paper**" and the T9 structural bar of
  "edge cases resolved in the text rather than left ambiguous." A worked-example
  walkthrough is the natural way to demonstrate that on paper.
- AC7 is a direct restatement of "This is a DESIGN unit, not software (T8)" and
  "keeps the software gate closed per T8" from the unit's own intent paragraph.

Neither is a spec bug. Per the sibling unit's precedent (`cardgame-world-races`
plan.md, AC5 held out), held-out ACs that are this redundant get satisfied by
construction and checked manually — they do **not** need their own automated test.
Only AC1-AC5 (the visible ACs) get RED tests below, matching what `feedback.md`
asked for.

---

## Step 0 — create `C:\github\cardGame\test\design-rules.test.js`

This is the Test Writer's deliverable. Create the file with **exactly** this
content (it reuses the existing `test/helpers/markdown.js`, already shipped —
do not recreate or modify that helper):

```javascript
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText, findSection } = require('./helpers/markdown');

const RULES_PATH = path.join(__dirname, '..', 'design', 'rules.md');
const FOUNTS = ['Mass', 'Bloom', 'Signal', 'Circuit', 'Skein'];

function readRules() {
  return fs.readFileSync(RULES_PATH, 'utf8');
}

function topLevelSections(content) {
  const sections = parseSections(content);
  return sections
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title));
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md exists with a numbered top-level section structure
// (1., 2., 3., ...) covering at minimum Game Concepts, Turn Structure,
// Resources, Priority & Timing, and Zones.
// ---------------------------------------------------------------------------

test('AC1: design/rules.md exists', () => {
  assert.ok(fs.existsSync(RULES_PATH), `expected ${RULES_PATH} to exist`);
});

test('AC1: has a numbered top-level section structure (1., 2., 3., ...) in strict sequence', () => {
  const content = readRules();
  const sections = topLevelSections(content);
  assert.ok(
    sections.length >= 5,
    `expected at least 5 numbered top-level sections (e.g. "1. Game Concepts"), found ${sections.length}: ${sections.map((s) => s.title).join(', ')}`
  );
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(
      numbers[i],
      i + 1,
      `expected numbered top-level sections in strict sequence starting at 1, got [${numbers.join(', ')}]`
    );
  }
});

const REQUIRED_TOP_LEVEL_TOPICS = [
  { name: 'Game Concepts', re: /game concepts/i },
  { name: 'Turn Structure', re: /turn structure/i },
  { name: 'Resources', re: /resources/i },
  { name: 'Priority & Timing', re: /priority.{0,5}timing/i },
  { name: 'Zones', re: /\bzones\b/i },
];

for (const topic of REQUIRED_TOP_LEVEL_TOPICS) {
  test(`AC1: has a numbered top-level section covering "${topic.name}"`, () => {
    const content = readRules();
    const sections = topLevelSections(content);
    const found = sections.some((s) => topic.re.test(s.title));
    assert.ok(
      found,
      `expected a numbered top-level heading matching ${topic.re} among [${sections.map((s) => s.title).join(', ')}]`
    );
  });
}

// ---------------------------------------------------------------------------
// AC2: a glossary/vocabulary section defines every game term (e.g. priority,
// zone, resource pool) before or at its first substantive use elsewhere.
// ---------------------------------------------------------------------------

test('AC2: has a Glossary/Vocabulary section', () => {
  const content = readRules();
  const sections = parseSections(content);
  const idx = findSection(sections, /glossary|vocabulary/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Glossary" or "Vocabulary"');
});

test('AC2: the Glossary/Vocabulary section defines a substantial number of distinct terms', () => {
  const content = readRules();
  const sections = parseSections(content);
  const glossary = sectionText(sections, /glossary|vocabulary/i);
  assert.ok(glossary, 'expected a Glossary/Vocabulary section to check');
  const boldedTerms = glossary.match(/\*\*[^*\n]+\*\*/g) || [];
  const distinctTerms = new Set(boldedTerms.map((t) => t.toLowerCase()));
  assert.ok(
    distinctTerms.size >= 15,
    `expected at least 15 distinct bolded glossary term definitions, found ${distinctTerms.size}`
  );
});

const EXAMPLE_GLOSSARY_TERMS = ['priority', 'zone', 'resource pool'];

for (const term of EXAMPLE_GLOSSARY_TERMS) {
  test(`AC2: the Glossary/Vocabulary section explicitly defines "${term}"`, () => {
    const content = readRules();
    const sections = parseSections(content);
    const glossary = sectionText(sections, /glossary|vocabulary/i);
    assert.ok(glossary, 'expected a Glossary/Vocabulary section to check');
    const re = new RegExp(`\\*\\*[^*\\n]*\\b${term.replace(/ /g, '\\s+')}s?\\b[^*\\n]*\\*\\*`, 'i');
    assert.ok(re.test(glossary), `expected a bolded glossary entry defining "${term}" (e.g. "**${term}** — ...")`);
  });
}

test('AC2: the Glossary/Vocabulary section precedes the Zones, Resources, Turn Structure, and Priority & Timing sections', () => {
  const content = readRules();
  const sections = topLevelSections(content);
  const glossaryIdx = sections.findIndex((s) => /glossary|vocabulary/i.test(s.title));
  assert.notStrictEqual(glossaryIdx, -1, 'expected a numbered top-level Glossary/Vocabulary section');
  for (const topic of REQUIRED_TOP_LEVEL_TOPICS.filter((t) => t.name !== 'Game Concepts')) {
    const otherIdx = sections.findIndex((s) => topic.re.test(s.title));
    assert.notStrictEqual(otherIdx, -1, `expected a section matching ${topic.re}`);
    assert.ok(
      glossaryIdx < otherIdx,
      `expected the Glossary/Vocabulary section to come before the "${topic.name}" section`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3: the Turn Structure section lists the full phase sequence for one turn
// as a numbered sub-list, stating what a player may and may not do in each.
// ---------------------------------------------------------------------------

test('AC3: the Turn Structure section has a numbered sub-list of at least 4 phases', () => {
  const content = readRules();
  const sections = parseSections(content);
  const turnIdx = findSection(sections, /turn structure/i);
  assert.notStrictEqual(turnIdx, -1, 'expected a Turn Structure section');
  const turnLevel = sections[turnIdx].level;
  const phaseHeadings = [];
  for (let i = turnIdx + 1; i < sections.length; i++) {
    if (sections[i].level <= turnLevel) break;
    if (/^\d+\.\d+/.test(sections[i].title)) phaseHeadings.push(sections[i]);
  }
  assert.ok(
    phaseHeadings.length >= 4,
    `expected at least 4 numbered phase sub-headings under Turn Structure, found ${phaseHeadings.length}: ${phaseHeadings.map((s) => s.title).join(', ')}`
  );
});

test('AC3: each phase in Turn Structure states what a player may and may not do', () => {
  const content = readRules();
  const sections = parseSections(content);
  const turnIdx = findSection(sections, /turn structure/i);
  assert.notStrictEqual(turnIdx, -1, 'expected a Turn Structure section');
  const turnLevel = sections[turnIdx].level;
  const phaseHeadings = [];
  for (let i = turnIdx + 1; i < sections.length; i++) {
    if (sections[i].level <= turnLevel) break;
    if (/^\d+\.\d+/.test(sections[i].title)) phaseHeadings.push(sections[i]);
  }
  assert.ok(phaseHeadings.length > 0, 'expected at least one numbered phase sub-heading to check (see prior test)');
  for (const phase of phaseHeadings) {
    const body = phase.lines.join('\n');
    assert.ok(/\bmay\b/i.test(body), `expected phase "${phase.title}" to state what a player MAY do`);
    assert.ok(
      /\bmay not\b|\bcannot\b|\bno player\b|\bnever\b/i.test(body),
      `expected phase "${phase.title}" to state what a player may NOT do`
    );
  }
});

// ---------------------------------------------------------------------------
// AC4: each of the five Founts (Mass, Bloom, Signal, Circuit, Skein) has an
// explicit resource/mechanic rule in Resources naming the Fount, tied to a
// mechanic — not restated flavor text.
// ---------------------------------------------------------------------------

test('AC4: the Resources section exists', () => {
  const content = readRules();
  const sections = parseSections(content);
  const idx = findSection(sections, /resources/i);
  assert.notStrictEqual(idx, -1, 'expected a Resources section');
});

for (const fount of FOUNTS) {
  test(`AC4: Resources has a named mechanic for the ${fount} Fount`, () => {
    const content = readRules();
    const sections = parseSections(content);
    const resourcesIdx = findSection(sections, /resources/i);
    assert.notStrictEqual(resourcesIdx, -1, 'expected a Resources section');
    const resourcesLevel = sections[resourcesIdx].level;
    let subheading = null;
    for (let i = resourcesIdx + 1; i < sections.length; i++) {
      if (sections[i].level <= resourcesLevel) break;
      if (new RegExp(`\\b${fount}\\b`, 'i').test(sections[i].title)) {
        subheading = sections[i];
        break;
      }
    }
    assert.ok(subheading, `expected a Resources sub-heading naming the ${fount} Fount`);
    const body = subheading.lines.join(' ').replace(/\s+/g, ' ').trim();
    assert.ok(
      body.length > 80,
      `expected a substantive mechanic description (>80 chars) for the ${fount} Fount, got ${body.length} chars`
    );
    assert.ok(
      /\bpoints?\b/i.test(body),
      `expected the ${fount} Fount's mechanic to reference its Points, not just restate flavor text`
    );
  });
}

test('AC4: the five Fount mechanics are distinct from one another', () => {
  const content = readRules();
  const sections = parseSections(content);
  const resourcesIdx = findSection(sections, /resources/i);
  assert.notStrictEqual(resourcesIdx, -1, 'expected a Resources section');
  const resourcesLevel = sections[resourcesIdx].level;
  const bodies = [];
  for (const fount of FOUNTS) {
    for (let i = resourcesIdx + 1; i < sections.length; i++) {
      if (sections[i].level <= resourcesLevel) break;
      if (new RegExp(`\\b${fount}\\b`, 'i').test(sections[i].title)) {
        bodies.push(sections[i].lines.join(' ').replace(/\s+/g, ' ').trim().toLowerCase());
        break;
      }
    }
  }
  assert.strictEqual(bodies.length, FOUNTS.length, 'expected to find a mechanic body for each of the 5 Founts (see prior tests)');
  assert.strictEqual(new Set(bodies).size, bodies.length, 'expected each Fount to have a distinct mechanic description, not a copy-pasted one');
});

// ---------------------------------------------------------------------------
// AC5: Priority & Timing defines active-player priority, passing, what closes
// a priority window, and resolves at least one concrete timing edge case.
// ---------------------------------------------------------------------------

test('AC5: has a Priority & Timing section', () => {
  const content = readRules();
  const sections = parseSections(content);
  const idx = findSection(sections, /priority.{0,5}timing/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Priority" and "Timing"');
});

test('AC5: Priority & Timing defines active-player priority', () => {
  const content = readRules();
  const sections = parseSections(content);
  const body = sectionText(sections, /priority.{0,5}timing/i);
  assert.ok(body, 'expected a Priority & Timing section to check');
  assert.ok(
    /active player/i.test(body) && /priority/i.test(body),
    'expected the Priority & Timing section to define what priority means for the active player'
  );
});

test('AC5: Priority & Timing defines passing', () => {
  const content = readRules();
  const sections = parseSections(content);
  const body = sectionText(sections, /priority.{0,5}timing/i);
  assert.ok(body, 'expected a Priority & Timing section to check');
  assert.ok(/\bpass(es|ing|ed)?\b/i.test(body), 'expected the Priority & Timing section to define passing');
});

test('AC5: Priority & Timing defines what closes a priority window', () => {
  const content = readRules();
  const sections = parseSections(content);
  const body = sectionText(sections, /priority.{0,5}timing/i);
  assert.ok(body, 'expected a Priority & Timing section to check');
  assert.ok(
    /priority window/i.test(body) && /\bclose(s|d)?\b/i.test(body),
    'expected the Priority & Timing section to define what closes a priority window'
  );
});

test('AC5: Priority & Timing resolves at least one concrete timing edge case on paper', () => {
  const content = readRules();
  const sections = parseSections(content);
  const priorityIdx = findSection(sections, /priority.{0,5}timing/i);
  assert.notStrictEqual(priorityIdx, -1, 'expected a Priority & Timing section');
  const priorityLevel = sections[priorityIdx].level;
  const edgeCaseHeadings = [];
  for (let i = priorityIdx + 1; i < sections.length; i++) {
    if (sections[i].level <= priorityLevel) break;
    if (/edge case|simultaneous|during resolution/i.test(sections[i].title)) edgeCaseHeadings.push(sections[i]);
  }
  assert.ok(
    edgeCaseHeadings.length >= 1,
    'expected at least one edge-case sub-heading under Priority & Timing (e.g. simultaneous triggers, or a response arriving during resolution)'
  );
  const body = edgeCaseHeadings[0].lines.join(' ').replace(/\s+/g, ' ').trim();
  assert.ok(body.length > 100, `expected the edge case to be resolved with substantive text (>100 chars), got ${body.length} chars`);
});
```

### Step 0 verification — confirm RED

```powershell
cd C:\github\cardGame
node --test
```

Expected output at this point: every test in `test/design-rules.test.js` fails
(the very first one, `AC1: design/rules.md exists`, fails because the file does
not exist yet — several downstream tests will also throw when `readRules()` hits
`ENOENT`). The pre-existing suites (`design-world.test.js`, `design-races.test.js`,
whatever else is in `test/`) must still all pass. Overall exit code non-zero,
with a summary line like `# fail 15` (exact count doesn't matter — what matters is
that the new file's tests are the only ones failing, RED as expected before content
exists).

---

## Step 1 — write `C:\github\cardGame\design\rules.md`

This is the Builder's deliverable. Create the file with **exactly** this content:

```markdown
# Amaranth Expanse — Core Rules

## 1. Game Concepts

Two challengers face each other, each commanding a civilization drawn from one of
the five Founts described in *design/world.md*: the Mass, the Bloom, the Signal,
the Circuit, and the Skein. Each challenger brings a deck of cards representing
that civilization's generators, combatants, and effects, and begins the game
defending a home base.

A game ends the moment one challenger's home base is reduced to nothing, or the
moment a challenger must draw a card and has none left to draw. Everything else in
this rulebook exists to answer one question: at any given moment, exactly what is a
challenger allowed to do, and in what order?

Section 2 defines every term this rulebook uses before it is used anywhere else.
Section 3 lays out where cards physically live over the course of a game. Section
4 explains what fuels playing them. Section 5 lays out the fixed sequence every
turn follows. Section 6 gives the fine-grained rules for who may act, and when.
Section 7 closes with a fully worked example, so any rule above can be checked
against a concrete case.

## 2. Glossary & Vocabulary

Terms below are defined once, here, before any of them is used substantively
elsewhere in this document. Later sections may repeat a term but will not silently
redefine it.

- **Active player** — the challenger whose turn it currently is. The other
  challenger is the non-active player for that turn.
- **Turn** — one complete pass through the five phases in Section 5, taken by a
  single active player. Turns alternate between the two challengers.
- **Phase** — one of the five fixed segments of a turn (Section 5), each with its
  own rule for what may and may not be done.
- **Zone** — one of the five defined places a card can be during a game: the Hand,
  the Field, the Archive, the Wreck, or the Void (Section 3).
- **Hand** — the zone holding a challenger's drawn, unplayed cards, hidden from
  their opponent.
- **Field** — the shared zone where permanents are put into play by both
  challengers.
- **Archive** — a challenger's own face-down deck of cards, drawn from during the
  game.
- **Wreck** — the zone where a challenger's destroyed or discarded cards are placed
  face-up.
- **Void** — the zone for cards removed from the game entirely; once a card is in
  the Void, no rule or ability may bring it back to any other zone.
- **Permanent** — a card that, once played, remains on the Field rather than
  resolving once and going to the Wreck. Generators and Units are both
  permanents.
- **Generator** — a permanent that produces Fount Points during the Generation
  Phase (Section 5.2).
- **Unit** — a permanent that can be declared as an attacker or blocker during the
  Conflict Phase (Section 5.4).
- **Ready** — the default state of a permanent: available to attack, block, or use
  an ability that requires becoming Spent.
- **Spent** — a permanent that has already been used this turn in a way that
  required it; a Spent permanent cannot attack, block, or use a Spent-requiring
  ability again until it is next made Ready.
- **Fount** — one of the five cosmic currents named in *design/world.md* (the
  Mass, the Bloom, the Signal, the Circuit, the Skein) that a Generator draws its
  power from.
- **Fount Point** — a single unit of a Fount's power, produced by a matching
  Generator and spent to pay costs.
- **Resource pool** — a challenger's bank of unspent Fount Points of one
  particular Fount. Each challenger has one resource pool per Fount.
- **Cost** — the Fount Points, and any other stated price, required to play a card
  or use an ability.
- **Home base** — a challenger's Core, tracked by Core Integrity; a challenger who
  reaches 0 Core Integrity loses immediately.
- **Core Integrity** — a numeric measure of how intact a challenger's home base
  is, reduced by damage dealt to it.
- **Damage** — a numeric amount subtracted from Core Integrity, or marked against
  a Unit, as a result of a card or ability.
- **Priority** — the right to act next: to play a card, use an ability, or pass,
  before anything already in the Queue resolves.
- **Priority window** — the span of time beginning when a challenger receives
  priority and ending when it closes (Section 6).
- **Pass** — to decline to act while holding priority, offering it onward instead.
- **Queue** — the ordered list of cards and abilities that have been played or
  triggered but have not yet resolved.
- **Resolve** — for an entry at the front of the Queue to take its full effect and
  be removed from the Queue.
- **Response** — a Fast card or ability played by a challenger while they hold
  priority and the Queue is not empty.
- **Fast card** — a card that may be played by whichever challenger holds
  priority, at any time, including during the other challenger's turn.
- **Slow card** — a card that may only be played by the active player, during
  their Main Phase, while they hold priority and the Queue is empty.
- **Trigger / Triggered ability** — an ability that is added to the Queue
  automatically when its stated condition happens, rather than being played by a
  challenger's choice.

## 3. Zones

Every card in the game is, at all times, in exactly one of five zones.

- **Hand** — Each challenger keeps their unplayed cards here, hidden from their
  opponent. A challenger may look through their own Hand at any time.
- **Field** — Both challengers' permanents (Generators and Units) sit in this
  single shared zone once played. A permanent stays in the Field until something
  removes it.
- **Archive** — Each challenger's deck: a face-down pile a challenger draws from,
  from the top only, and never looks through except when a card or ability
  explicitly allows it.
- **Wreck** — A face-up pile, one per challenger, where that challenger's
  destroyed permanents and discarded or resolved non-permanent cards come to
  rest. Either challenger may look through either Wreck at any time.
- **Void** — Cards removed from the game entirely, face-up, one shared pile. A
  card that enters the Void cannot be returned to any other zone by any rule or
  ability in this game.

A card changes zones only as a direct result of a rule or an ability; it never
moves on its own. When a card changes zones, any counters, attachments, or
temporary effects tied to it end, unless a rule or ability says otherwise.

## 4. Resources

Every Generator on the Field is attuned to exactly one of the five Founts. During
the Generation Phase (Section 5.2), each Generator produces Fount Points of its own
Fount, added to its controller's matching resource pool. Unless a card says
otherwise, a resource pool empties completely at the end of each turn — Fount
Points do not carry over.

Each Fount converts its points into a different kind of advantage, matching the
nature of the Fount it comes from.

### 4.1 The Mass

Generators attuned to the Mass produce **Mass Points**. A challenger may spend
Mass Points, one point per counter, to place a Fortification counter on any
permanent they control. A permanent with one or more Fortification counters
removes one Fortification counter instead of being destroyed, the first time each
turn something would destroy it; if it has no Fortification counters left, it is
destroyed as normal. This is how the Mass makes things endure.

### 4.2 The Bloom

Generators attuned to the Bloom produce **Bloom Points**. A challenger may spend
Bloom Points, one point per counter, to place a Growth counter on a Unit they
control; a Unit with at least one Growth counter gets +1 to its combat strength
for each Growth counter on it. The first time each game a Unit with Growth
counters on it would be destroyed, its controller may instead remove all Growth
counters from it and return it to the Field with no counters, rather than letting
it be destroyed. This is how the Bloom answers threats by mutating past them
rather than enduring them outright.

### 4.3 The Signal

Generators attuned to the Signal produce **Signal Points**. A challenger may spend
one Signal Point to look at the top card of their own Archive; they may then
either leave it on top or move it to the bottom of their Archive. This is how the
Signal turns foresight into an advantage before anything else happens.

### 4.4 The Circuit

Generators attuned to the Circuit produce **Circuit Points**. A challenger may
spend Circuit Points equal to a Technology permanent's printed cost to create an
exact token copy of that permanent, put directly onto the Field under their
control. This is how the Circuit turns one working idea into scale.

### 4.5 The Skein

Generators attuned to the Skein produce **Skein Points**. A challenger may spend
Skein Points equal to the number of entries currently in the Queue to move one of
their own entries already in the Queue to the front, so that it resolves next,
ahead of anything else waiting. This is how the Skein renegotiates cause and
effect rather than obeying it.

## 5. Turn Structure

Every turn consists of the same five phases, always in this order. A phase never
repeats within a turn, and a turn never skips a phase.

### 5.1 Dawn Phase

The active player readies all Spent permanents they control, making them Ready
again, and then draws one card from their Archive. The active player MAY NOT play
cards, use abilities, or generate Fount Points during the Dawn Phase, and no
player may take any action of their own during another challenger's Dawn Phase;
drawing happens automatically once. Exception: the challenger who takes the very
first turn of the game does not draw during their first Dawn Phase.

### 5.2 Generation Phase

Every Generator the active player controls produces Fount Points as described in
Section 4, added to the active player's matching resource pools. The active
player MAY choose the order in which their Generators produce points, if the
order could matter for an ability. No player MAY play cards or use
non-Generation abilities during this phase, and the non-active player never acts
during another challenger's Generation Phase.

### 5.3 Main Phase

The active player MAY play any number of Slow cards from their Hand, one
Generator at most per turn, paying each card's cost from their resource pools as
they play it. The active player MAY also play Fast cards and use activated
abilities here. Both players MAY take Fast actions here once the active player has
passed priority (Section 6). No player MAY play more than one Generator in a
single turn, and a challenger MAY NOT play a Slow card unless the Queue is empty
and it is their priority.

### 5.4 Conflict Phase

The active player MAY declare any number of their Ready Units as attackers,
becoming Spent as they do; the non-active player MAY then declare any of their own
Ready Units as blockers, one blocker or more per attacker. An attacking Unit that
is unblocked deals its combat strength as damage to the non-active player's Core
Integrity. A Unit that did not attack MAY NOT deal combat damage this phase, and a
Spent Unit MAY NOT be declared as either an attacker or a blocker.

### 5.5 Dusk Phase

Any triggered ability that cares about the end of the turn is added to the Queue
and resolves. Both players MAY take Fast actions here, exactly as in the Main
Phase. Once the Queue is empty and both players have passed in succession, all
resource pools empty and the turn ends; no player MAY carry unspent Fount Points
into the next turn, and a Slow card MAY NOT be played during the Dusk Phase under
any circumstance.

## 6. Priority & Timing

At almost every moment in the game, exactly one challenger holds priority: the
right to play a Fast card, use an ability, or pass, before anything already in the
Queue resolves. The active player receives priority first in every phase. A
challenger with priority may act any number of times in a row, or pass
immediately.

When a challenger passes, priority moves to the other challenger. If that
challenger also passes without acting — passing in succession — the current
priority window closes. Closing a priority window does one of two things: if the
Queue is not empty, its topmost entry resolves and the active player receives
priority again to open a new window; if the Queue is empty, the game moves to the
next phase (or, at the end of the Dusk Phase, the next turn). A challenger who
takes any action instead of passing re-opens the window: priority returns first to
the challenger who just acted, then would need to pass again for the window to
close.

A Response added to the Queue always resolves before anything it was played in
response to, since it sits above that entry in the Queue.

### 6.1 Edge Case: Simultaneous Triggers

If two or more triggered abilities would be added to the Queue as a result of the
same event, they do not enter in an undefined order. The active player first adds
all of their own triggers to the Queue, in whatever order they choose; the
non-active player then adds all of their own triggers to the Queue, above the
active player's, again in whatever order they choose. Because the Queue resolves
from the top down, this means the non-active player's triggers from that event
resolve first, followed by the active player's, in the order each player chose
for their own triggers. Neither player may interleave their own triggers with the
other's, and neither may change this ordering once both sets of triggers have been
added.

### 6.2 Edge Case: A Response Arriving During Resolution

Resolving an entry from the Queue is not itself an action that can be responded
to — but a card or ability can still create new entries partway through its own
resolution (for example, an effect that says "resolve this, then do X"). When
that happens, the entry currently resolving finishes resolving completely first;
any new entries it creates are added to the Queue only once it has finished, and
only then does either challenger receive priority to respond to those new
entries. A challenger may never gain priority in the middle of a single entry's
resolution, only between one entry finishing and the next opening.

## 7. Worked Example: A Priority Exchange

This example follows one Main Phase exchange between two challengers, Reva
(active player, drawing on the Circuit) and Toma (non-active player, drawing on
the Skein), continuing directly from Section 6.

1. It is Reva's Main Phase. The Queue is empty and Reva holds priority. Reva
   plays a Fast card that deals 2 damage to a Unit Toma controls. This card is
   added to the Queue. Reva could act again, but instead passes.
2. Priority moves to Toma. The Queue is not empty (Reva's damage effect is in
   it), so Toma may respond. Toma plays a Fast card of their own that would give
   the threatened Unit +2 toughness. Toma's card is added above Reva's in the
   Queue. Toma passes.
3. Priority returns to Reva, who has no further response and passes as well.
   Both challengers have now passed in succession with the Queue non-empty, so
   the current priority window closes and the topmost entry resolves: Toma's +2
   toughness effect resolves first, since it was added above Reva's card.
4. The Queue is not yet empty, so a new priority window opens with the active
   player, Reva, receiving priority again. Neither challenger acts, and both
   pass in succession a second time. The window closes again; the Queue's
   remaining entry, Reva's 2 damage effect, resolves. Because Toma's Unit
   already gained +2 toughness before this damage was ever marked against it,
   the Unit survives.
5. The Queue is now empty and both challengers have passed, so the Main Phase
   priority window closes for good and play moves to the Conflict Phase.

This confirms, on paper, that in this rules set the last Fast card played is
always the first to resolve — exactly the ordering the Simultaneous Triggers edge
case in Section 6.1 and the general passing rule both depend on.
```

### Step 1 verification — confirm GREEN

```powershell
cd C:\github\cardGame
node --test
```

Expected output: every test now passes, including all of `test/design-rules.test.js`
alongside the pre-existing suites. A summary line like `# pass N`, `# fail 0`, exit
code 0.

---

## Step 2 — manual AC checklist (no script needed, five-minute read)

- [ ] AC1 — `design/rules.md` exists, numbered `## 1.` through `## 7.` in strict
      order, covering Game Concepts, Glossary & Vocabulary, Zones, Resources,
      Turn Structure, Priority & Timing, Worked Example. ✅ by the text above.
- [ ] AC2 — Section 2 (Glossary & Vocabulary) bolds 27 distinct terms including
      **Priority**, **Zone**, **Resource pool**, and precedes Zones/Resources/Turn
      Structure/Priority & Timing (it's section 2; they're sections 3-6). ✅.
- [ ] AC3 — Section 5 has five numbered phase sub-headings (5.1-5.5), each using
      "MAY" and "MAY NOT"/"cannot" language. ✅.
- [ ] AC4 — Section 4 has five sub-headings (4.1-4.5), one per Fount, each naming
      its Fount, each with a distinct mechanic that spends that Fount's Points.
      ✅.
- [ ] AC5 — Section 6 defines active-player priority, passing, and what closes a
      priority window, plus two Edge Case sub-sections (simultaneous triggers;
      a response during resolution), each resolved with substantive text. ✅.
- [ ] AC6 (held out) — Section 7 is a 5-step numbered walkthrough of one concrete
      priority exchange, tying back to the Section 6.1 edge case. ✅.
- [ ] AC7 (held out) — scan the file above for "code", "API", "database",
      "software", "app", "engine", "algorithm", "server", "implementation" — none
      appear anywhere in `design/rules.md`. ✅ (verify this by eye when done;
      don't rely on this plan's own prose, re-check the actual file written).

If all seven boxes are checked and `node --test` exits 0 with no failures anywhere
in the suite, the unit is done. Do not add any further automated tests beyond
`test/design-rules.test.js` above — AC6/AC7 are satisfied by construction, not by
a script, matching how the sibling unit `cardgame-world-races` handled its own
held-out AC.
