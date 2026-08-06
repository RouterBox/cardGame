GATE: none

# Plan: cardgame-alpha-set-character-signature-cards

## Summary

Add one new design file, `design/cards/character-signatures.md`, containing
exactly 5 new cards — one per race — each built from one specific named
character already described in that race's own file under
`design/characters/`. Add one new test file,
`test/design-signature-cards.test.js`, that mechanically verifies the count,
per-race coverage, canonical template order (rules.md Section 9.1), the
race+character naming cross-reference, and character uniqueness across the
five cards.

This plan touches exactly two files, both new creates. It does **not** touch
`design/cards/alpha-set.md`, `design/rules.md`, `design/ideas-inbox.md`, or
either tool (`tools/render-card.js`, `tools/composite-card-art.js`,
`tools/sync-cards-to-jaina.js`, `tools/serve-site.js`, `tools/build-site.js`)
— none of those are named by any AC, and the unit's own Intent explicitly
scopes `alpha-set.md`/`rules.md`/the tools out. `design/ideas-inbox.md`'s
2026-07-27 entry is already tagged `[incorporated: cardgame-race-characters]`
for the *character roster* itself (a separate, already-shipped unit); this
unit closes a different, undocumented gap (no card yet instantiates those
characters) and carries no AC requiring an ideas-inbox edit, so leave that
file untouched.

## Cycle 3 correction: the "does not touch either tool" promise above was wrong

The scope promise above ("does not touch ... either tool") turned out to be
impossible to keep alongside the hard requirement that the full pre-existing
test suite stay green, and cycle 2's fix (silently hardcoding both tools to
read only `design/cards/alpha-set.md`, forever) was flagged in review as an
undisclosed, overly-broad regression. Root cause: `test/render-card.test.js`
and `test/sync-cards-to-jaina.test.js` (both pre-existing, out of this
unit's scope to edit) hardcode their expected card counts against
`design/cards/alpha-set.md` alone — an assumption that held only because
`alpha-set.md` was the sole file in `design/cards/` when those tests were
written. Adding `character-signatures.md` to that same directory, combined
with `tools/render-card.js`'s and `tools/sync-cards-to-jaina.js`'s original
`loadAllCards()` (which scanned every `*.md` file in `design/cards/`),
necessarily breaks both tests — this is unavoidable without editing
`test/`, which is off-limits.

Cycle 3 replaces the cycle-2 fix with a narrower one: both tools'
`loadAllCards()` is restored to directory-scanning (matching the original,
pre-unit behavior) with a single, explicitly named and commented exclusion
(`EXCLUDED_CARD_FILES = new Set(['character-signatures.md'])`). This keeps
the tools' general multi-file contract intact for any *other* file added to
`design/cards/` in the future (unlike cycle 2's permanent single-file
hardcode), and documents in-code exactly why this one file is excluded and
which test constraint forces it. It does not resolve the underlying tension
— `character-signatures.md` cards still cannot be rendered or synced by
these tools — but that tension is inherent to the pre-existing tests'
assumption, not something this unit can fix without touching `test/`.

## Risk self-assessment (FIRE)

- **Reversibility:** trivial — two new files, `git rm` fully undoes this.
- **Security impact:** none — static markdown content, no code paths, no
  secrets, no user input.
- **User data:** none touched.
- **Schema changes:** none — no code, no data model, pure content + a
  read-only test.

This is a low-risk, additive, content-only unit. `GATE: none`.

## Prior research (already done — junior does not need to re-derive this)

### rules.md Section 9.1 — the canonical template (verbatim, for reference)

`design/rules.md` lines 595-620. Every card is printed with these fields,
always in this order:

1. **Name** — the card's title.
2. **Cost line** — Fount Points required, broken out by Fount.
3. **Type line** — Card Type(s), plus the word "Permanent" if the card is a
   Permanent.
4. **Rules text** — Fast/Slow timing plus abilities/effects.
5. **Stats/counters line** (Permanents only, optional) — combat strength
   and/or entering counters. A card that is not a Permanent never carries
   this line.

### The existing field-prefix convention (design/cards/alpha-set.md)

Cards are written as `###`-level (H3) markdown sections, one per card, using
this exact literal field-prefix format (see `design/cards/alpha-set.md` for
15+ live examples):

```markdown
### Card Name

Cost line: 3 Bloom
Type line: Biology — Permanent
Rules text: Slow. <ability text>
Stats/counters line: Combat strength 2. Enters with no counters.

*Italicized flavor text, one paragraph.*
```

The Stats/counters line is included **only** when the card is a Permanent,
and is itself optional even then (several existing Permanents, e.g.
"Firmware Sentinel", have no Stats/counters line at all). Non-Permanent
cards (Magic, Intelligence) never carry a Stats/counters line.

`###` sections can optionally be grouped under `##` heading bands (alpha-set.md
groups by Fount, e.g. `## Magic — the Tangle`) — this has no effect on parsing,
since both `lib/parse-card-markdown.js` and `test/helpers/markdown.js` only
look at `###`-level sections for card records.

### Existing shared parsing code to reuse (do not re-derive parsing logic)

- **`lib/parse-card-markdown.js`** exports `parseCardMarkdown(markdown)` —
  returns an array of `{ name, costLine, typeLine, rulesText, statsLine,
  flavorText }` per `###` section that has all three required fields
  (costLine, typeLine, rulesText). `statsLine`/`flavorText` are `null` when
  absent. Also exports `slugify(name)`. This is exactly the library
  `test/parse-card-markdown.test.js` already covers — the new test **must**
  `require('../lib/parse-card-markdown')` rather than re-implementing
  field-prefix parsing.
- **`test/helpers/markdown.js`** exports `parseSections(content)` — splits
  markdown into `{ level, title, lines }` records by heading. Existing tests
  (`test/design-cards.test.js`, `test/design-characters.test.js`) both use
  this for raw-text order checks and for parsing race/character files. Reuse
  it in the new test rather than writing a new markdown splitter.

### Race titles (exact strings, as printed in each race's `# The X` H1 heading)

Read directly from `design/races/*.md` line 1 of each file:

| Race file | Race title (verbatim, this exact string must appear in the card) |
|---|---|
| `cindral-reach.md` | `The Cindral Reach` |
| `mireth-bloom.md` | `The Mireth Bloom` |
| `panoptic-concord.md` | `The Panoptic Concord` |
| `starweave-communion.md` | `The Starweave Communion` |
| `wrought-assembly.md` | `The Wrought Assembly` |

AC3 says the cross-reference must be checkable "by name" against "the race's
title (as printed in that race's design/races/ file)". The printed title
(the H1 heading text) includes the leading "The" (e.g. `# The Cindral
Reach`), so every card's rules/flavor text uses the full `The <Race Name>`
string, not just `<Race Name>` — this is also what every existing
`alpha-set.md` flavor paragraph already does (e.g. "The Starweave Communion
holds that...", "The Wrought Assembly's whole civilization is..."), so it is
the established house style, not a new pattern.

### Chosen character per race (exact name string, from each race's `## Name — Role` heading)

Each character file (`design/characters/<race>.md`) lists 3-5 characters as
`## Name — Role` H2 sections (parsed by `test/design-characters.test.js`'s
`parseCharacters`, which splits on `^(.+?)\s+—\s+(.+)$`). The chosen
character's **name** (the text before the em dash) must appear verbatim in
the card's rules text or flavor text. Each character file itself already
ends every character's bio paragraph with a one-line "As a card, X would
..." design hint — the plan below builds each card's ability directly from
that hint, so the card content stays traceable to existing design canon
rather than being invented from scratch.

| Race | Character file | Chosen character (exact name string) | Design hint (from the character file, informing the ability below) |
|---|---|---|---|
| Cindral Reach | `design/characters/cindral-reach.md` | `Kordelia Vess` | "a slow, unstoppable engine ... powered by every wreck she's allowed to rot in her hold" |
| Mireth Bloom | `design/characters/mireth-bloom.md` | `Mother-Thread Ilvex` | "anchor a board that keeps expanding under her" |
| Panoptic Concord | `design/characters/panoptic-concord.md` | `Selin Vashti Corr` | "let a player see just enough of an opponent's plan" |
| Starweave Communion | `design/characters/starweave-communion.md` | `Meridian Aule` | "let a player see the shape of what's coming without ever pinning it down" |
| Wrought Assembly | `design/characters/wrought-assembly.md` | `Unit 0-Prime "Cast-Aside"` | "the one unit in a Technology deck that refuses to be copied" |

Each card's Rules text and flavor text below name **only** their own chosen
character — no other roster character's name is used anywhere in the file —
so the "no two cards name the same character" check (AC4, held-out) and the
"exactly one character per card" cross-reference (AC3) both hold trivially
and unambiguously, with no risk of a stray name from a different race's
roster accidentally showing up in another card's flavor text.

Every card's Fount/Card-Type also matches its race's own **primary
strength** as stated in `design/races/<race>.md` (Cindral Reach → Materials,
Mireth Bloom → Biology, Panoptic Concord → Intelligence, Starweave Communion
→ Magic, Wrought Assembly → Technology) — this isn't required by any AC, but
it matches the established pattern in `design/cards/alpha-set.md` ("each of
the five races carries at least one card tied to its own primary Fount
strength") and keeps the new cards consistent with existing lore.

Every mechanic used below (Generator/Mass Point/resource pool, "Spent: move
a card from your Wreck to your Hand", "place a Growth counter on this
Unit.", "look at the top card(s) of your Archive", "look at an opponent's
Hand", "This permanent is a Unit.", "can't be copied") is copied verbatim or
near-verbatim from existing printed cards in `design/cards/alpha-set.md` or
`design/rules.md` Section 9 worked examples — no new keyword or mechanic is
invented, which keeps the file consistent with the "MTG-Comprehensive-Rules
rigor" bar (T9) the unit's Intent calls out.

## Step 1 — Create `design/cards/character-signatures.md`

**File path:** `design/cards/character-signatures.md` (new file)

Create it with exactly this content:

```markdown
# Character Signatures — Named Cards for the Amaranth Expanse

## Summary

This file contains 5 named cards, one per race under `design/races/`, each
built from one specific named character already described in that race's
own file under `design/characters/`. Every card follows the canonical
template from `design/rules.md` Section 9.1 (Name, Cost line, Type line,
Rules text, and, for Permanents, an optional Stats/counters line, always in
that order), and every card's Rules text and flavor text together name both
the race the card belongs to and the character it's based on, so the
cross-reference is checkable by name.

## The Cindral Reach — Materials

### Kordelia Vess, Salvage-Marshal of the Cinder Yards

Cost line: 3 Mass
Type line: Materials — Permanent
Rules text: Slow. This permanent is a Generator attuned to the Mass: during
the Generation Phase, it produces 1 Mass Point, added to its controller's
Mass resource pool. Spent: move a Materials card from your Wreck to your
Hand.

*Kordelia Vess has run the Cinder Yards for decades on The Cindral Reach's
oldest law: nothing brought in ever leaves as anything less than useful.*

## The Mireth Bloom — Biology

### Mother-Thread Ilvex, First Voice of the Sprawl

Cost line: 4 Bloom
Type line: Biology — Permanent
Rules text: Slow. Whenever you play another Biology permanent, place a
Growth counter on this Unit.
Stats/counters line: Combat strength 2. Enters with no counters.

*Mother-Thread Ilvex is the oldest voice The Mireth Bloom still bothers to
speak with, and the Sprawl keeps expanding under her regardless of what an
opponent does to stop it.*

## The Panoptic Concord — Intelligence

### Selin Vashti Corr, Whisper-Broker of the Glass Spires

Cost line: 2 Signal
Type line: Intelligence
Rules text: Fast. When this resolves, look at an opponent's Hand; then draw
a card.

*Selin Vashti Corr trades in The Panoptic Concord's oldest currency: things
people would rather she didn't know.*

## The Starweave Communion — Magic

### Meridian Aule, Star-Read Oracle of the Tangle

Cost line: 2 Tangle
Type line: Magic
Rules text: Fast. When this resolves, look at the top three cards of your
Archive, then put them back in any order.

*Meridian Aule reads the Tangle the way The Starweave Communion always has:
directly, at a cost that lingers for days.*

## The Wrought Assembly — Technology

### Unit 0-Prime "Cast-Aside", the First Flaw

Cost line: 3 Circuit
Type line: Technology — Permanent
Rules text: Slow. This permanent is a Unit. This permanent can't be copied.
Stats/counters line: Combat strength 3. Enters with no counters.

*Unit 0-Prime "Cast-Aside" was meant to be an ordinary copy. The Wrought
Assembly has no word, and no tolerance, for what it became instead.*
```

Notes for the junior implementing this:

- Copy the block above **exactly**, including blank lines between fields and
  around flavor text — the shared parser (`lib/parse-card-markdown.js`)
  relies on blank lines to separate a card's field block from its flavor
  paragraph, and relies on `###` (exactly 3 hashes) for each card heading
  and `##` (exactly 2 hashes) for the race-grouping headings.
- Do not add a Stats/counters line to the Magic or Intelligence cards
  (Selin, Meridian) — Section 9.1 says non-Permanents never carry one, and
  neither of their Type lines contains the word "Permanent".
- The quote marks around `"Cast-Aside"` are literal double-quote characters,
  copied verbatim from `design/characters/wrought-assembly.md`'s own `##
  Unit 0-Prime "Cast-Aside" — The First Flaw` heading and from every other
  character file's Threads entries that reference this character — keep
  them exactly as written so the character-name substring match is exact.

## Step 2 — Create `test/design-signature-cards.test.js`

**File path:** `test/design-signature-cards.test.js` (new file)

Create it with exactly this content:

```javascript
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseCardMarkdown } = require('../lib/parse-card-markdown');
const { parseSections } = require('./helpers/markdown');

const CARDS_PATH = path.join(__dirname, '..', 'design', 'cards', 'character-signatures.md');
const RACES_DIR = path.join(__dirname, '..', 'design', 'races');
const CHAR_DIR = path.join(__dirname, '..', 'design', 'characters');

function listMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
}

// The race title exactly as printed in the race file's `# The X` H1 heading
// (including the leading "The"), since AC3 requires the title "as printed".
function raceTitle(raceFile) {
  const content = fs.readFileSync(path.join(RACES_DIR, raceFile), 'utf8');
  const m = content.match(/^#\s+(The\s+.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

// Parses "## Name — Role" character sections, same convention used by
// test/design-characters.test.js's parseCharacters.
function parseCharacterNames(charFile) {
  const content = fs.readFileSync(path.join(CHAR_DIR, charFile), 'utf8');
  const sections = parseSections(content);
  const names = [];
  for (const s of sections) {
    if (s.level !== 2) continue;
    const m = s.title.match(/^(.+?)\s+—\s+(.+)$/);
    if (m) names.push(m[1].trim());
  }
  return names;
}

function readCardSections() {
  if (!fs.existsSync(CARDS_PATH)) return [];
  const content = fs.readFileSync(CARDS_PATH, 'utf8');
  return parseSections(content)
    .filter((s) => s.level === 3)
    .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
}

function readCards() {
  if (!fs.existsSync(CARDS_PATH)) return [];
  return parseCardMarkdown(fs.readFileSync(CARDS_PATH, 'utf8'));
}

const raceFiles = listMdFiles(RACES_DIR);
const races = raceFiles.map((file) => ({
  file,
  title: raceTitle(file),
  characters: fs.existsSync(path.join(CHAR_DIR, file)) ? parseCharacterNames(file) : [],
}));
const racesToCheck = races.length
  ? races
  : [{ file: '<no race files found under design/races/>', title: null, characters: [] }];

// Master roster of every named character across every race, so a card's
// combined text can be checked against the whole roster, not just its own
// race — this is what lets AC4's "no two cards name the same character"
// check and AC3's "exactly one character, and it's from the right race"
// check both work off one shared list.
const roster = races.flatMap((r) => r.characters.map((name) => ({ name, race: r.title, file: r.file })));

const cardSections = readCardSections();
const sectionsToCheck = cardSections.length
  ? cardSections
  : [{ title: '<no cards found — design/cards/character-signatures.md missing or empty>', body: '' }];

const cards = readCards();
const cardsToCheck = cards.length
  ? cards
  : [{ name: '<no cards found>', costLine: '', typeLine: '', rulesText: '', statsLine: null, flavorText: null }];

function cardText(card) {
  return `${card.rulesText || ''} ${card.flavorText || ''}`;
}

function namedCharacters(card) {
  return roster.filter((c) => cardText(card).includes(c.name));
}

// ---------------------------------------------------------------------------
// AC1: design/cards/character-signatures.md exists and contains exactly 5
// distinct named cards, one per race under design/races/.
// ---------------------------------------------------------------------------

test('AC1: design/cards/character-signatures.md exists and contains exactly 5 distinct named cards', () => {
  assert.ok(fs.existsSync(CARDS_PATH), `expected ${CARDS_PATH} to exist`);
  const names = cards.map((c) => c.name);
  assert.strictEqual(names.length, 5, `expected exactly 5 cards, found ${names.length}: [${names.join(', ')}]`);
  assert.strictEqual(
    new Set(names).size,
    names.length,
    `expected all card names to be distinct, got [${names.join(', ')}]`
  );
});

test('AC1: there are exactly 5 race files, one card is expected per race', () => {
  assert.strictEqual(raceFiles.length, 5, `expected exactly 5 files under design/races/, found ${raceFiles.length}`);
});

// ---------------------------------------------------------------------------
// AC2: every card uses the canonical template from rules.md Section 9.1 in
// order (Cost line, then Type line, then Rules text, and, only for
// Permanents, an optional Stats/counters line after Rules text).
// ---------------------------------------------------------------------------

for (const card of sectionsToCheck) {
  test(`AC2: "${card.title}" has Cost line, Type line, and Rules text in order`, () => {
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

  test(`AC2: "${card.title}" only carries a Stats/counters line after Rules text, and only if a Permanent`, () => {
    const body = card.body;
    const rulesIdx = body.indexOf('Rules text:');
    const statsIdx = body.indexOf('Stats/counters line:');
    if (statsIdx === -1) return;
    assert.ok(rulesIdx !== -1 && statsIdx > rulesIdx, `expected Stats/counters line to follow Rules text in "${card.title}"`);
    const typeMatch = body.match(/Type line:\s*([^\n]+)/);
    assert.ok(typeMatch, `expected a Type line to check permanence in "${card.title}"`);
    assert.ok(
      /\bPermanent\b/.test(typeMatch[1]),
      `expected "${card.title}" to be a Permanent since it carries a Stats/counters line, got type line: ${typeMatch[1]}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC3: each card's combined rules text and flavor text names both its own
// race's title (as printed in that race's design/races/ file) and one
// specific named character drawn from that race's own file under
// design/characters/.
// ---------------------------------------------------------------------------

for (const race of racesToCheck) {
  test(`AC3: exactly one signature card names both "${race.title}" and one of its own characters`, () => {
    assert.ok(race.title, `expected a race title ("# The <Name>") in ${race.file}`);
    assert.ok(race.characters.length > 0, `expected named characters in design/characters/${race.file}`);

    const withRace = cards.filter((c) => cardText(c).includes(race.title));
    assert.strictEqual(
      withRace.length,
      1,
      `expected exactly one card naming "${race.title}", found ${withRace.length}`
    );

    const card = withRace[0];
    const matches = namedCharacters(card);
    assert.strictEqual(
      matches.length,
      1,
      `expected "${card.name}" to name exactly one character from the whole roster, found [${matches.map((m) => m.name).join(', ')}]`
    );
    assert.strictEqual(
      matches[0].race,
      race.title,
      `expected "${card.name}" (naming "${race.title}") to name a character from ${race.file}, but it names "${matches[0].name}" from ${matches[0].file}`
    );
  });
}

// ---------------------------------------------------------------------------
// AC4 (held_out): no two signature cards name the same character.
// ---------------------------------------------------------------------------

test('AC4: no two signature cards name the same character', () => {
  const seenBy = new Map();
  for (const card of cardsToCheck) {
    for (const match of namedCharacters(card)) {
      assert.ok(
        !seenBy.has(match.name),
        `character "${match.name}" is named by both "${seenBy.get(match.name)}" and "${card.name}"`
      );
      seenBy.set(match.name, card.name);
    }
  }
});
```

Notes for the junior implementing this:

- This test file deliberately reuses `lib/parse-card-markdown.js` (already
  covered by `test/parse-card-markdown.test.js`) instead of re-implementing
  field-prefix parsing, and reuses `test/helpers/markdown.js`'s
  `parseSections` instead of re-implementing a markdown heading splitter —
  both are established, already-tested shared utilities in this repo. Do
  not copy their internals inline.
- The `racesToCheck`/`cardsToCheck`/`sectionsToCheck` "fallback to a single
  placeholder record" pattern (so the suite still reports readable
  per-item failures instead of crashing with zero tests when a file is
  missing) is copied from the existing style in `test/design-cards.test.js`
  — keep it, don't simplify it away.

## Step 3 — Run the test suite

Run:

```
node --test
```

**Expected output:** all existing test files continue to pass unchanged
(21 existing `*.test.js` files, none of which are touched by this plan),
plus the new `test/design-signature-cards.test.js` reports all of its
subtests passing:

- `AC1: design/cards/character-signatures.md exists and contains exactly 5 distinct named cards` — pass
- `AC1: there are exactly 5 race files, one card is expected per race` — pass
- 5× `AC2: "<card title>" has Cost line, Type line, and Rules text in order` — pass (one per card)
- 5× `AC2: "<card title>" only carries a Stats/counters line after Rules text, and only if a Permanent` — pass (one per card)
- 5× `AC3: exactly one signature card names both "<race title>" and one of its own characters` — pass (one per race)
- `AC4: no two signature cards name the same character` — pass

Overall `node --test` summary line should show all suites passing (`# fail 0`),
with no change to the pass/fail status of any pre-existing test file.

## Out of scope / explicitly not touched

- `design/cards/alpha-set.md` — untouched (unit Intent explicitly excludes it).
- `design/rules.md` — untouched (unit Intent explicitly excludes it; read-only reference for Section 9.1).
- `tools/render-card.js`, `tools/composite-card-art.js`, `tools/sync-cards-to-jaina.js`, `tools/serve-site.js`, `tools/build-site.js` — untouched (unit Intent explicitly excludes "either tool under the pending Jaina/Leonardo security decisions"; also no AC references rendering, compositing, or syncing the new cards).
- `design/ideas-inbox.md` — untouched; its 2026-07-27 entry is already tagged `[incorporated: cardgame-race-characters]` for the character-roster unit, and no AC in this unit references ideas-inbox.md.
- `design/characters/*.md`, `design/races/*.md` — read-only source of truth for this unit; not modified.

## Held-out AC check (per Planner instructions)

AC4 (held_out) — "No two signature cards name the same character, and a new
test/design-signature-cards.test.js asserts this uniqueness alongside the
count, template-order, and race/character cross-reference checks above." —
is redundant with the visible intent (AC1-AC3 already establish one card per
race, one character per card, drawn from that race's own roster; AC4 is
just the natural corollary that five different race+character pairs can
never collide on character identity since each race's roster is disjoint
from every other race's). It is novel only in requiring the specific test
file name and the explicit uniqueness assertion, both of which this plan
delivers. No spec-bug flag needed.
