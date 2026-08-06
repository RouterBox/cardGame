GATE: none

# Plan: cardgame-card-types-templating-rules

This is a DESIGN unit (T8, not software) — the deliverable is an addition to a
single markdown file, `design/rules.md`, in the **`cardGame` repo**
(`C:\github\cardGame` — NOT this AgentBox repo; `AgentBox` is only where the
unit/bolt bookkeeping lives). Per the standing recipe for this unit family
(already used twice, on `cardgame-core-rules` and `cardgame-spatial-battlefield-rules`):
write a RED document-structure test first, then write the markdown content
that turns it GREEN.

There are two files to touch, in this order:

1. `C:\github\cardGame\test\design-cardtypes.test.js` (new file — Test Writer
   step, must be committed and RED before `design/rules.md` is touched)
2. `C:\github\cardGame\design\rules.md` (two additive edits — Builder step,
   makes the new test GREEN without breaking any existing test)

Do not modify any other file. In particular do not touch `design/world.md`,
`design/races/*.md`, `test/design-world.test.js`, `test/design-races.test.js`,
`test/design-rules.test.js`, `test/design-battlefield.test.js`, or
`test/helpers/markdown.js` — all already shipped, all out of scope. Reuse
`test/helpers/markdown.js` (`parseSections`, `findSection`, `sectionText`) as-is.

## Source material already read (do not re-derive differently)

- `C:\github\cardGame\gamePlan.md` — the five card types and their gameplay
  flavor: `magic - instants/sorceries/global enchantments`,
  `technology - artifacts with instant/sorcery speed abilities`,
  `intelligence - cost modifications, resources, information discovery`,
  `biology - creatures`, `materials - weapons/equipments/vehicles/units/artifacts/production facilities (factories)`,
  and the line `cards can have multiple types/costs`.
- `C:\github\cardGame\design\world.md` — the five Founts and what each is
  named for: **The Mass** (materials), **The Bloom** (biology), **The
  Signal** (intelligence), **The Circuit** (technology), **The Skein**
  (magic).
- `C:\github\cardGame\design\rules.md` — current file is 529 lines, Sections
  1-8 (Game Concepts, Glossary & Vocabulary, Zones, Resources, Turn
  Structure, Priority & Timing, Worked Example, Spatial Battlefield).
  Section 4.4 (the Circuit) **already uses the exact phrase "Technology
  permanent"** — `"A challenger may spend Circuit Points equal to a
  Technology permanent's printed cost..."` — this is the load-bearing
  precedent that fixes Technology's card-type/Fount/permanence mapping; the
  new section must not contradict it.

### Type → Fount → behavior-class mapping this plan uses (derived, not stated outright anywhere — this is the actual design decision)

| Card Type    | Fount   | Behavior class                     | Why |
|--------------|---------|-------------------------------------|-----|
| Magic        | Skein   | instant/sorcery-speed resolving     | gamePlan: "instants/sorceries" |
| Technology   | Circuit | permanent                           | gamePlan: "artifacts..."; rules.md 4.4 already says "Technology permanent" |
| Intelligence | Signal  | instant/sorcery-speed resolving     | gamePlan: "cost modifications, resources, information discovery" reads as one-shot effects, matching the Signal's existing resolve-once mechanic (4.3) |
| Biology      | Bloom   | permanent                           | gamePlan: "creatures" = Units, which are permanents (Section 2) |
| Materials    | Mass    | permanent                           | gamePlan: "...production facilities (factories)..." etc. = Generators/Units, which are permanents |

This mapping is internally consistent (no two types get the same Fount, all
five Founts from `design/world.md` are used exactly once) and does not
contradict anything already printed in Sections 1-8.

## Risk self-assessment (FIRE)

- **Reversibility:** Full. One new test file, two additive edits (new
  glossary bullets appended at the end of the Section 2 list; a new Section
  9 appended at the end of the file). No existing line is deleted or
  reworded. Trivially revertable with `git revert` / `git checkout`.
- **Security impact:** None. No dependencies, no code execution beyond
  `node --test` running plain `assert` checks against file text.
- **User data:** None touched.
- **Schema changes:** None.

Nothing here is ambiguous or destructive — proceed without a design gate.

## Held-out AC note (AC5)

AC5 — "No existing numbered rule in Sections 1-8 is contradicted or restated
differently by the new section — it cross-references Section 4
(Resources/Founts) rather than redefining Fount Point costs from scratch" —
is held out but is a direct restatement of the unit's own intent text
("keeping the design phase at full decided scope" without touching decided
rules) and of the family's established pattern (`cardgame-spatial-battlefield-rules`
plan.md: "Nothing in this section changes any rule already stated in
Sections 1-7; it adds a spatial layer on top of them"). It is satisfied by
construction, not by a new mechanic:

- Every Fount Point cost/production rule in Section 4 is left byte-for-byte
  unchanged. The new Section 9 only ever says costs are "paid from that
  Fount's own resource pool (Section 4)" — a cross-reference, never a
  restatement of how a resource pool works.
- Sections 1-8 are not edited at all except for five new bullets *appended*
  to the end of the existing Section 2 glossary list (same technique
  Section 8's own terms used when they were added — appended at the end, in
  the order the new section uses them, nothing repositioned or reworded).
- No existing sentence in Sections 3-8 is touched.

Per precedent (`cardgame-core-rules` plan.md, `cardgame-spatial-battlefield-rules`
AC5), a held-out AC this redundant does **not** get its own automated test —
only AC1-AC4 (the visible ACs) get RED tests below. AC5 is satisfied by the
additive-only, cross-referencing structure of the edit itself, and should be
checked manually by the reviewer against the final diff.

---

## Step 0 — create `C:\github\cardGame\test\design-cardtypes.test.js`

This is the Test Writer's deliverable, and must exist and be **RED** (failing,
because `design/rules.md` doesn't yet have Section 9) before `design/rules.md`
is touched. Create the file with **exactly** this content:

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

function topLevelSections(content) {
  const sections = parseSections(content);
  return sections
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.level === 2 && /^\d+\.\s+\S/.test(s.title));
}

const TYPES = [
  { name: 'Magic', fount: 'Skein', behavior: 'resolving' },
  { name: 'Technology', fount: 'Circuit', behavior: 'permanent' },
  { name: 'Intelligence', fount: 'Signal', behavior: 'resolving' },
  { name: 'Biology', fount: 'Bloom', behavior: 'permanent' },
  { name: 'Materials', fount: 'Mass', behavior: 'permanent' },
];

function typeHeadingRegex(t) {
  return new RegExp(`${t.name}\\s*[—-]\\s*the\\s+${t.fount}`, 'i');
}

// ---------------------------------------------------------------------------
// AC1: design/rules.md gains a new numbered section defining all five card
// types from gamePlan.md, each naming which Fount it draws cost from and its
// behavior class (instant/sorcery-speed resolving vs. permanent).
// ---------------------------------------------------------------------------

test('AC1: rules.md has a numbered top-level Card Types & Templating section', () => {
  const sections = topLevelSections(readRules());
  const found = sections.some((s) => /card types.{0,10}templating/i.test(s.title));
  assert.ok(
    found,
    `expected a numbered top-level heading mentioning "Card Types & Templating" among [${sections.map((s) => s.title).join(', ')}]`
  );
});

test('AC1: the top-level numbered sections remain in strict sequence starting at 1', () => {
  const sections = topLevelSections(readRules());
  const numbers = sections.map((s) => parseInt(s.title.match(/^(\d+)\./)[1], 10));
  for (let i = 0; i < numbers.length; i++) {
    assert.strictEqual(numbers[i], i + 1, `expected strict numbering, got [${numbers.join(', ')}]`);
  }
});

for (const t of TYPES) {
  test(`AC1: ${t.name} names the ${t.fount} Fount and is classed as ${t.behavior}`, () => {
    const sections = parseSections(readRules());
    const body = sectionText(sections, typeHeadingRegex(t));
    assert.ok(body, `expected a subsection heading naming ${t.name} and the ${t.fount}`);
    assert.ok(
      new RegExp(`${t.name}\\s+cards\\s+draw\\s+their\\s+cost\\s+from\\s+the\\s+${t.fount}`, 'i').test(body),
      `expected ${t.name}'s subsection to state it draws cost from the ${t.fount}`
    );
    if (t.behavior === 'permanent') {
      assert.ok(/\bare\s+permanent\b/i.test(body), `expected ${t.name} to be classed as permanent`);
    } else {
      assert.ok(
        /\bare\s+instant\/sorcery-speed\s+resolving\b/i.test(body),
        `expected ${t.name} to be classed as instant/sorcery-speed resolving`
      );
    }
  });
}

// ---------------------------------------------------------------------------
// AC2: a canonical card template (name, cost line, type line, rules text,
// optional stats/counters line for permanents) and one fully worked example
// per type, each naming its Fount cost, its type(s), and its rules text.
// ---------------------------------------------------------------------------

test('AC2: has a Canonical Card Template subsection', () => {
  const sections = parseSections(readRules());
  const idx = findSection(sections, /canonical card template/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Canonical Card Template"');
});

const TEMPLATE_FIELDS = ['Name', 'Cost line', 'Type line', 'Rules text', 'Stats/counters line'];

for (const field of TEMPLATE_FIELDS) {
  test(`AC2: the Canonical Card Template defines the "${field}" field`, () => {
    const sections = parseSections(readRules());
    const body = sectionText(sections, /canonical card template/i);
    assert.ok(body, 'expected a Canonical Card Template section to check');
    const re = new RegExp(`\\*\\*${field.replace(/\//g, '\\/')}\\*\\*`);
    assert.ok(re.test(body), `expected a bolded "${field}" field in the template`);
  });
}

for (const t of TYPES) {
  test(`AC2: ${t.name} has a worked example card naming its ${t.fount} cost, its type, and rules text`, () => {
    const sections = parseSections(readRules());
    const typeBody = sectionText(sections, typeHeadingRegex(t));
    assert.ok(typeBody, `expected a subsection for ${t.name}`);
    assert.ok(
      new RegExp(`Cost line:\\s*\\d+\\s+${t.fount}`).test(typeBody),
      `expected a worked example card naming its ${t.fount} cost`
    );
    assert.ok(
      new RegExp(`Type line:\\s*${t.name}`).test(typeBody),
      `expected a worked example card naming its type as ${t.name}`
    );
    assert.ok(/Rules text:/.test(typeBody), 'expected a worked example card with rules text');
  });
}

// ---------------------------------------------------------------------------
// AC3: the rule for cards with multiple types/costs — how total cost is
// computed across multiple Founts and which type-specific rules apply — with
// at least one worked multi-type example.
// ---------------------------------------------------------------------------

test('AC3: has a Multiple Types and Multiple Costs subsection', () => {
  const sections = parseSections(readRules());
  const idx = findSection(sections, /multiple types.{0,10}multiple costs/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "Multiple Types and Multiple Costs"');
});

test("AC3: states total cost across multiple Founts is a sum, paid from each Fount's own pool", () => {
  const sections = parseSections(readRules());
  const body = sectionText(sections, /multiple types.{0,10}multiple costs/i);
  assert.ok(body, 'expected a Multiple Types and Multiple Costs section to check');
  assert.ok(/\bsum\b/i.test(body), 'expected the total cost to be described as a sum');
  assert.ok(/\bMAY NOT\b/.test(body), 'expected an explicit MAY NOT on substituting one Fount for another');
});

test('AC3: states which type-specific rules apply when a card lists multiple types', () => {
  const sections = parseSections(readRules());
  const body = sectionText(sections, /multiple types.{0,10}multiple costs/i);
  assert.ok(body, 'expected a Multiple Types and Multiple Costs section to check');
  assert.ok(
    /every rule stated for each of its listed types/i.test(body),
    'expected a stated rule for which type-specific rules apply on a multi-type card'
  );
});

test('AC3: gives a worked multi-type example card with more than one Fount and more than one type', () => {
  const sections = parseSections(readRules());
  const body = sectionText(sections, /multiple types.{0,10}multiple costs/i);
  assert.ok(body, 'expected a Multiple Types and Multiple Costs section to check');
  const costMatch = body.match(/Cost line:\s*([^\n]+)/);
  assert.ok(costMatch, 'expected a worked example cost line');
  const founts = ['Mass', 'Bloom', 'Signal', 'Circuit', 'Skein'].filter((f) =>
    new RegExp(`\\b${f}\\b`).test(costMatch[1])
  );
  assert.ok(founts.length >= 2, `expected the example's cost line to name at least 2 Founts, got: ${costMatch[1]}`);
  const typeMatch = body.match(/Type line:\s*([^\n]+)/);
  assert.ok(typeMatch, 'expected a worked example type line');
  const types = TYPES.filter((t) => new RegExp(`\\b${t.name}\\b`).test(typeMatch[1]));
  assert.ok(types.length >= 2, `expected the example's type line to name at least 2 Card Types, got: ${typeMatch[1]}`);
});

// ---------------------------------------------------------------------------
// AC4: new terms ("type line," "rules text," etc.) are added to the Section 2
// glossary before substantive use.
// ---------------------------------------------------------------------------

const NEW_GLOSSARY_TERMS = ['Card Type', 'Cost line', 'Type line', 'Rules text', 'Stats/counters line'];

for (const term of NEW_GLOSSARY_TERMS) {
  test(`AC4: the Glossary/Vocabulary section defines "${term}"`, () => {
    const sections = parseSections(readRules());
    const glossary = sectionText(sections, /glossary|vocabulary/i);
    assert.ok(glossary, 'expected a Glossary/Vocabulary section');
    const re = new RegExp(`\\*\\*${term.replace(/\//g, '\\/')}\\*\\*`);
    assert.ok(re.test(glossary), `expected a bolded glossary entry defining "${term}"`);
  });
}

test('AC4: the Glossary/Vocabulary section precedes the Card Types & Templating section', () => {
  const sections = topLevelSections(readRules());
  const glossaryIdx = sections.findIndex((s) => /glossary|vocabulary/i.test(s.title));
  const cardTypesIdx = sections.findIndex((s) => /card types.{0,10}templating/i.test(s.title));
  assert.notStrictEqual(glossaryIdx, -1, 'expected a Glossary/Vocabulary section');
  assert.notStrictEqual(cardTypesIdx, -1, 'expected a Card Types & Templating section');
  assert.ok(glossaryIdx < cardTypesIdx, 'expected Glossary to precede Card Types & Templating');
});
```

**Expected output right after Step 0** (from `C:\github\cardGame`, run
`node --test`): the pre-existing test files (`smoke.test.js`,
`design-world.test.js`, `design-races.test.js`, `design-rules.test.js`,
`design-battlefield.test.js`) all still pass; every test in the new
`design-cardtypes.test.js` **fails** (RED), because `design/rules.md` has no
Section 9, no "Canonical Card Template" heading, and no new glossary terms
yet. The overall `node --test` summary line will report a nonzero `fail`
count equal to the number of new tests (24: 1 section-exists + 1
strict-sequence + 5 type/Fount/behavior + 1 template-exists + 5 template
fields + 5 worked examples + 1 multi-type-section-exists + 2 multi-type
content + 1 multi-type example + 5 glossary terms + 1 glossary-ordering).

---

## Step 1 — edit `C:\github\cardGame\design\rules.md`: append 5 glossary bullets to Section 2

Find this exact text near the end of Section 2 (the last bullet before
`## 3. Zones`):

```
- **Capture** — the result of a further Assault against an already-Blockaded
  Planet: control passes to the assaulting challenger and every Generator on
  the Planet is destroyed — moved to its owner's Wreck (Section 3).

## 3. Zones
```

Replace it with (adding five new bullets, changing nothing else):

```
- **Capture** — the result of a further Assault against an already-Blockaded
  Planet: control passes to the assaulting challenger and every Generator on
  the Planet is destroyed — moved to its owner's Wreck (Section 3).
- **Card Type** — one of the five categories a card may belong to: Magic,
  Technology, Intelligence, Biology, or Materials (Section 9); a card may
  belong to more than one (Section 9.7).
- **Cost line** — the field of a card's printed template (Section 9.1)
  stating the Fount Points, by Fount, required to play the card.
- **Type line** — the field of a card's printed template (Section 9.1)
  stating a card's Card Type(s) and, for a Permanent, the word "Permanent".
- **Rules text** — the field of a card's printed template (Section 9.1)
  stating a card's Fast card / Slow card timing and its abilities or
  effects.
- **Stats/counters line** — the optional field of a Permanent's printed
  template (Section 9.1) stating a Unit's combat strength or any counters
  the permanent enters play with.

## 3. Zones
```

## Step 2 — edit `C:\github\cardGame\design\rules.md`: append Section 9 at the end of the file

Find this exact text at the very end of the file (the closing paragraph of
Section 8.7):

```
This confirms, on paper, that a Planet's Generator can be pressured without
being destroyed (Blockade) and only lost outright through a second, further
Assault (Capture) — and that reaching an enemy Planet costs strictly more
Fount Points the farther the qualifying path runs, exactly as Section 8.6
states.
```

Append immediately after it (keep everything above unchanged; add a blank
line, then the new section):

```

## 9. Card Types & Templating

Every card belongs to one or more of five Card Types — Magic, Technology,
Intelligence, Biology, and Materials — and each Card Type draws its cost
from exactly one Fount (Section 4) by default: Magic from the Skein,
Technology from the Circuit, Intelligence from the Signal, Biology from the
Bloom, and Materials from the Mass. This section defines the five Card
Types, the template every card is printed with, and the rule for a card
that spans more than one Card Type or Fount. Where a Fount's own mechanic
matters, this section cross-references Section 4 rather than restating it.

### 9.1 The Canonical Card Template

Every card is printed with the following fields, always in this order:

1. **Name** — the card's title.
2. **Cost line** — the Fount Points required to play the card, broken out
   by Fount (Section 4). A card that draws cost from a single Fount lists
   just that Fount's cost; a card that draws cost from more than one Fount
   lists each Fount's cost separately (Section 9.7).
3. **Type line** — the card's Card Type(s) (Sections 9.2-9.6), and, if the
   card is a Permanent (Section 2), the word "Permanent".
4. **Rules text** — the card's Fast card / Slow card timing (Section 2)
   and any abilities or effects, written using terms this Glossary
   (Section 2) has already defined wherever possible.
5. **Stats/counters line** (Permanents only, optional) — for a Unit, its
   combat strength; for any Permanent, any counters it enters play with. A
   card that is not a Permanent never carries this line.

Each Card Type falls into exactly one of two behavior classes, stated on
its type line by the presence or absence of the word "Permanent": a
**permanent** Card Type means the card is a Permanent (Section 2) that
remains on the Field once played; an **instant/sorcery-speed resolving**
Card Type means the card resolves once (Section 2's Resolve) and is then
placed in its owner's Wreck, never remaining on the Field. A card's Fast
card / Slow card status is a separate fact, stated in its rules text, and
does not depend on its behavior class.

### 9.2 Magic — the Skein

Magic cards draw their cost from the Skein and are instant/sorcery-speed
resolving (Section 9.1): a Magic card is never a Permanent.

> **Cinderfall Bolt**
> Cost line: 2 Skein
> Type line: Magic
> Rules text: Fast. When this resolves, deal 3 damage to any Unit.

### 9.3 Technology — the Circuit

Technology cards draw their cost from the Circuit and are permanent
(Section 9.1): a Technology card is always a Permanent, matching Section
4.4's own use of the term "Technology permanent." A Technology card's
abilities may still be used at instant or sorcery speed, per its own rules
text — the card's permanence and the timing of its abilities are separate
facts about it.

> **Signal Relay**
> Cost line: 2 Circuit
> Type line: Technology — Permanent
> Rules text: Slow. Spent, usable at instant speed (any time its
> controller holds priority): look at the top card of your Archive; you
> may put it on the bottom of your Archive instead of leaving it on top.

### 9.4 Intelligence — the Signal

Intelligence cards draw their cost from the Signal and are
instant/sorcery-speed resolving (Section 9.1), in the same sense as Magic
(Section 9.2): never a Permanent, always resolving once to the Wreck.

> **Foresight Ping**
> Cost line: 1 Signal
> Type line: Intelligence
> Rules text: Fast. When this resolves, look at the top card of your
> Archive; you may put it on the bottom of your Archive instead of leaving
> it on top.

### 9.5 Biology — the Bloom

Biology cards draw their cost from the Bloom and are permanent (Section
9.1): every Biology card is a Unit (Section 2), and so always carries a
stats/counters line stating its combat strength.

> **Spore Warden**
> Cost line: 3 Bloom
> Type line: Biology — Permanent
> Rules text: Slow.
> Stats/counters line: Combat strength 3. Enters with no counters.

### 9.6 Materials — the Mass

Materials cards draw their cost from the Mass and are permanent (Section
9.1). A Materials card may be a Generator (Section 2), a Unit, or a
Permanent that is neither, depending on its own rules text.

> **Foundry Works**
> Cost line: 2 Mass
> Type line: Materials — Permanent
> Rules text: Slow. This permanent is a Generator (Section 4) attuned to
> the Mass: during the Generation Phase (Section 5.2), it produces 1 Mass
> Point, added to its controller's Mass resource pool.

### 9.7 Multiple Types and Multiple Costs

A card may list more than one Card Type on its type line, and may draw its
cost from more than one Fount on its cost line, independently of each
other.

**Cost:** when a card's cost line names more than one Fount, its total
cost is the sum of the Fount Points listed for each Fount, and each
Fount's share MUST be paid from that Fount's own resource pool (Section
4) — a challenger MAY NOT pay one Fount's share of a cost with another
Fount's points.

**Type-specific rules:** when a card lists more than one Card Type, every
rule stated for each of its listed types (Sections 9.2-9.6) applies to the
card at once. Because a permanent behavior class (Section 9.1) is a
stronger claim than an instant/sorcery-speed resolving one, a card that
lists at least one permanent Card Type (Technology, Biology, or Materials)
is a Permanent, even if it also lists an instant/sorcery-speed resolving
Card Type (Magic or Intelligence); a card is instant/sorcery-speed
resolving only if every one of its listed Card Types is
instant/sorcery-speed resolving.

> **Reactive Turret**
> Cost line: 1 Skein, 1 Circuit
> Type line: Magic Technology — Permanent
> Rules text: Slow. Spent: deal 1 damage to any Unit.

Reactive Turret's total cost is 2 Fount Points: 1 paid from the Skein
resource pool and 1 from the Circuit resource pool, never 2 from either
pool alone. Its type line lists Magic, an instant/sorcery-speed resolving
type, and Technology, a permanent type; per the rule above, the presence
of Technology makes the whole card a Permanent, so Reactive Turret stays
on the Field once played rather than resolving to the Wreck.
```

---

## Expected output after Step 2

From `C:\github\cardGame`, run `node --test` (or `npm test`, which
`package.json` defines as exactly `node --test`). All test files —
`smoke.test.js`, `design-world.test.js`, `design-races.test.js`,
`design-rules.test.js`, `design-battlefield.test.js`, and the new
`design-cardtypes.test.js` — pass; the summary block ends with `# fail 0`
(or the equivalent Node test-runner TAP summary showing 0 failures). No
existing test's assertions change outcome, because Sections 1-8 and the
existing glossary bullets are byte-for-byte unchanged — only additions were
made (5 glossary bullets, 1 new top-level section).

Observably: `design/rules.md` now has 9 numbered top-level sections instead
of 8, ending with `## 9. Card Types & Templating`, which a human reading the
file can check against `gamePlan.md`'s five card types and see each one
tied to its Fount, its behavior class, a worked example card, and a rule for
combining types/costs — closing the last rules gap called out in the unit's
intent before card design and Leonardo art briefs begin under I6.
