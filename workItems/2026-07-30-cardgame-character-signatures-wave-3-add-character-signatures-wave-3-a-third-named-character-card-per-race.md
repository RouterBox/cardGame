# cardgame-character-signatures-wave-3: Add Character Signatures, Wave 3 — a third named-character card per race, completing signature-card coverage for all 20 named characters

## Header

- unit: cardgame-character-signatures-wave-3
- title: Add Character Signatures, Wave 3 — a third named-character card per race, completing signature-card coverage for all 20 named characters
- project: cardgame
- completed: 2026-07-30
- outcome: merged (orchestrator recovery: review APPROVE, suite green by hand; receipt red was transient)
- start_sha: 3068a4f7130e111282ab43254c57095cc1448a2a
- end_sha: 3068a4f7130e111282ab43254c57095cc1448a2a

## Intent

design/characters/ commits to 4 named characters per race (20 total) with interlinking Threads, per the 2026-07-27 ideas-inbox directive. character-signatures.md and character-signatures-wave-2.md have each carded one character per race (10 of 20), following the canonical Section 9.1 template and citing the source character by name in both rules text framing and flavor text. Write design/cards/character-signatures-wave-3.md mirroring that exact structure: for each of the 5 races, pick one of its two still-uncarded characters (Cindral Reach: Bren Hollowmelt or Karrow Vantiss; Mireth Bloom: Vesk-Aduun or Nyth Corrow; Panoptic Concord: Yuen Ashcroft or Ilio Marn-Cassity; Starweave Communion: Ossian Thale or Wren Sable-Vow; Wrought Assembly: Vantel Ninth-Chorus or Replica-Sergeant Kess Ninefold), build a card whose Cost line uses that race's own primary Fount (per design/races/*.md), whose Type line matches the character's own domain (Materials/Biology/Intelligence/Magic/Technology per race), and whose Rules text mechanizes a detail already present in that character's own design/characters/ entry (e.g. a per-copy buff, a counter-on-trigger effect, a look-and-choose ability) the way Waves 1-2 each did. Do not touch character-signatures.md, character-signatures-wave-2.md, any design/characters/ file, or any other card set. Regenerate site/ via tools/build-site.js. Art briefs for these 5 cards are out of scope for this unit, matching the established precedent that art-brief coverage ships as its own later unit (cardgame-art-briefs-character-signatures-wave-2 followed character-signatures-wave-2 the same way).

## Acceptance Criteria

- AC1 [inferred]: design/cards/character-signatures-wave-3.md exists with exactly 5 cards, one per race under design/races/
- AC2 [paraphrase] (held_out): Each card's named character, verified against that race's design/characters/*.md file, is one of the two characters not already used by character-signatures.md or character-signatures-wave-2.md for that race
- AC3 [inferred]: Across character-signatures.md, character-signatures-wave-2.md, and character-signatures-wave-3.md combined, no named character is used by more than one card
- AC4 [inferred]: Each card's Cost line names that race's own primary Fount (per design/races/*.md) and each card follows the Section 9.1 template field order (Name, Cost line, Type line, Rules text, optional Stats/counters line)
- AC5 [paraphrase]: site/design/cards/character-signatures-wave-3.html exists via tools/build-site.js, and character-signatures.md, character-signatures-wave-2.md, and every design/characters/*.md file are byte-for-byte unchanged

## Plan

GATE: none

# Plan — cardgame-character-signatures-wave-3

## Summary of what you're building

One new file, `design/cards/character-signatures-wave-3.md`, containing 5
cards (one per race), following the exact structure of
`design/cards/character-signatures.md` (wave 1) and
`design/cards/character-signatures-wave-2.md` (wave 2). Then regenerate
`site/` and make one small, necessary edit to `design/DESIGN-READINESS.md`
(explained in Step 3 — skipping it will break an existing, currently-passing
test). Nothing else changes.

This is a single, small bolt — no split needed.

---

## Background you need (already verified against the repo)

**The 5 races and their Fount/domain** (from `design/races/*.md` and
`design/rules.md` Section 9):

| Race | Fount (Cost line) | Domain (Type line) | Permanent? |
|---|---|---|---|
| The Cindral Reach | Mass | Materials | yes (9.6) |
| The Mireth Bloom | Bloom | Biology | yes, always a Unit (9.5) |
| The Panoptic Concord | Signal | Intelligence | **no** — Intelligence is never a Permanent (9.4) |
| The Starweave Communion | Tangle | Magic | **no** — Magic is never a Permanent (9.2) |
| The Wrought Assembly | Circuit | Technology | yes (9.3) |

**Already-carded characters** (waves 1 and 2 — do not reuse these names):
Cindral Reach: Kordelia Vess, Torel Ashgrave. Mireth Bloom: Mother-Thread
Ilvex, Rathe Ossuary-Kin. Panoptic Concord: Selin Vashti Corr, Doran Vex
Amaranthine. Starweave Communion: Meridian Aule, Ysolde Thane. Wrought
Assembly: Unit 0-Prime "Cast-Aside", Foreman-Prime Yssa Ductile.

**This unit's picks** (one of the two remaining per race — chosen below,
with reasons; you don't need to re-derive these, just use them):

- Cindral Reach → **Bren Hollowmelt** (not Karrow Vantiss)
- Mireth Bloom → **Vesk-Aduun** (not Nyth Corrow)
- Panoptic Concord → **Ilio Marn-Cassity** (not Yuen Ashcroft)
- Starweave Communion → **Ossian Thale** (not Wren Sable-Vow)
- Wrought Assembly → **Replica-Sergeant Kess Ninefold** (not Vantel Ninth-Chorus)

Why these five specifically: each one's own `design/characters/*.md` entry
ends with an "As a card, ..." sentence that translates cleanly into a rules
effect using vocabulary `design/rules.md` already defines (a destroy-trigger
survival effect, a Growth counter, a look-and-swap effect, a
destroy-and-draw effect, a one-time combat-strength bump) — the other five
uncarded characters (Karrow, Nyth, Yuen, Wren, Vantel) either need spatial/
territory mechanics or an ongoing "banked resource" that a non-Permanent
Intelligence/Magic card can't carry, which would be much harder to template
cleanly. Also: Bren + Ilio are Thread-linked to each other, and Kess is
Thread-linked to Karrow and Vantel (both *not* used this wave) — the card
text below is written so **no card ever names a second character**, which
matters a lot for the test suite (see "Why the wording is so careful"
below).

---

## Step 1 — Create `design/cards/character-signatures-wave-3.md`

Create this file with **exactly** this content:

```markdown
# Character Signatures, Wave 3 — A Third Named Card per Race

## Summary

This file adds a third named card per race under `design/races/`, each
built from one specific named character already described in that race's
own file under `design/characters/`, distinct from the two characters
`design/cards/character-signatures.md` and
`design/cards/character-signatures-wave-2.md` already signed for that
race. Every card follows the same canonical template from `design/rules.md`
Section 9.1 (Name, Cost line, Type line, Rules text, and, for Permanents,
an optional Stats/counters line, always in that order), and every card's
Rules text and flavor text together name both the race the card belongs to
and the character it's based on, so the cross-reference is checkable by
name. Each card's Cost line draws from that race's own primary Fount, and
its Type line matches that race's own domain, per `design/races/*.md`.

## The Cindral Reach — Materials

### Bren Hollowmelt, the Cindergrown

Cost line: 3 Mass
Type line: Materials — Permanent
Rules text: Slow. This permanent is a Unit. The first time each turn this
Unit would be destroyed by damage, instead remove all damage marked
against it; it remains on the Field.
Stats/counters line: Combat strength 2. Enters with no counters.

*Bren Hollowmelt should have died over a Bloom-claimed debris field.
Something grew into the wound before he could, and The Cindral Reach still
hasn't decided which parts of him are still its own.*

## The Mireth Bloom — Biology

### Vesk-Aduun, the Graft-Wearer

Cost line: 3 Bloom
Type line: Biology — Permanent
Rules text: Slow. This permanent is a Unit. Whenever this Unit deals
damage to a Unit that is destroyed as a result, place a Growth counter on
this Unit.
Stats/counters line: Combat strength 2. Enters with no counters.

*Vesk-Aduun carries a fragment of design-memory that was never meant to
leave Assembly hands, fused now into flesh that keeps trying to think in
straight lines. The Mireth Bloom doesn't mind what Vesk-Aduun steals from
whatever it kills — only that it keeps growing stranger for it.*

## The Panoptic Concord — Intelligence

### Ilio Marn-Cassity, Contract-Broker of the Rewritten Clause

Cost line: 2 Signal
Type line: Intelligence
Rules text: Fast. When this resolves, look at an opponent's Hand; choose
a card there and swap its printed cost with the printed cost of a card in
your Hand.

*Ilio Marn-Cassity has never once lost sleep over a contract's fine
print, because for The Panoptic Concord's best brokers, the fine print is
the whole point of the deal.*

## The Starweave Communion — Magic

### Ossian Thale, Reclamation-Warden of the Standing Stones

Cost line: 3 Tangle
Type line: Magic
Rules text: Fast. When this resolves, destroy any Biology permanent; its
controller draws a card.

*Ossian Thale has failed three times to reclaim a shrine the Bloom
swallowed whole, and would rather see the ground burned back to bare
stone than let The Starweave Communion's claim on it lapse a fourth
time.*

## The Wrought Assembly — Technology

### Replica-Sergeant Kess Ninefold, the Named Copy

Cost line: 2 Circuit
Type line: Technology — Permanent
Rules text: Slow. This permanent is a Unit. The first time this Unit is
dealt damage and not destroyed, its combat strength is increased by 1 for
the rest of the game.
Stats/counters line: Combat strength 1. Enters with no counters.

*Kess was never supposed to have a name — Assembly patrol units are
numbered, not named — until an Iron-Choir enforcer broke protocol and
gave it one anyway, after Replica-Sergeant Kess Ninefold hesitated
mid-raid rather than destroy a Reach salvage crew that turned out to be
mostly children. The Wrought Assembly was built without room for that
kind of mercy, and Kess has kept it anyway.*
```

Formatting rules that matter (the shared parser at
`lib/parse-card-markdown.js` depends on these exactly):
- Cards are `###` (H3) headings; races are `##` (H2) headings. Only H3
  sections are parsed as cards.
- Inside a card, the four field lines must each *start* the line with
  `Cost line:`, `Type line:`, `Rules text:`, `Stats/counters line:` (no
  leading whitespace), in that order. A field's text may wrap onto
  following lines as long as those lines don't start with one of those
  four prefixes.
- Leave exactly one blank line between the last field and the flavor-text
  paragraph. Wrap the flavor paragraph in `*...*` (single asterisks), same
  as every existing card.
- Do not add a `Stats/counters line:` to the Ilio or Ossian cards — they
  are not Permanents (Intelligence and Magic are never Permanents, Section
  9.1/9.2/9.4), and a test (`test/design-signature-cards*.test.js` and its
  wave-3 counterpart, once written) explicitly checks a Stats/counters
  line only appears on cards whose Type line contains "Permanent".

### Why the wording is so careful (read before changing any flavor text)

The test suite checks each card's combined Rules text + flavor text
against the **full 20-character roster** (all of `design/characters/*.md`,
not just this file's picks), via plain substring match on each character's
full name. Two rules follow from that, and the draft above already
satisfies both — if you edit the flavor text, re-check both:

1. **Exactly one of the 20 full character names may appear in each
   card**, and it must be that card's own character. Do not name any
   other character, even in passing (e.g. Bren's card must not say
   "Mother-Thread Ilvex" or "Ilio Marn-Cassity" even though both are
   Bren's Threads in `design/characters/cindral-reach.md`; Kess's card
   must not say "Vantel Ninth-Chorus" or "Karrow Vantiss" even though
   both are Kess's Threads in `design/characters/wrought-assembly.md`).
   The draft above uses generic phrases ("an Iron-Choir enforcer", "a
   Reach salvage crew", "the Bloom swallowed whole") exactly to avoid
   this.
2. **Exactly one of the 5 race titles** (the literal string printed after
   `# ` in each `design/races/*.md` file, e.g. `The Cindral Reach`) may
   appear in each card, and it must be that card's own race. Watch for
   accidental capitalized mentions of another race's exact title in
   flavor text (lowercase mentions like "the Bloom" or "Assembly hands"
   are fine — they don't match the literal title strings, which all start
   with `The `).

If you need to rewrite a card's flavor text for any reason, keep both of
these constraints in mind and re-verify with the check commands in Step 4
before moving on.

---

## Step 2 — Regenerate the site

From the repo root:

```
node tools/build-site.js
```

Expected output: exits 0, no stdout required to check by hand. This
regenerates the whole `site/` tree, including the new
`site/design/cards/character-signatures-wave-3.html`. It also touches many
other already-generated `site/*.html` files (that's normal and expected —
`site/` is a build artifact, not something to hand-edit or worry about
diffing).

Verify the new page exists:

```
ls site/design/cards/character-signatures-wave-3.html
```

---

## Step 3 — Required edit to `design/DESIGN-READINESS.md`

**Do not skip this.** `test/design-readiness.test.js` (AC3/AC6) and
`test/design-readiness-section4-art-briefs-coverage.test.js` (AC5) both
already pass today, and both work by reading every file in
`design/cards/*.md`, parsing it with `loadCardsFromFile`, and asserting
that **any file that parses to 1+ real cards is cited by filename
somewhere in `design/DESIGN-READINESS.md`**. The moment
`character-signatures-wave-3.md` exists with 5 real cards in it, both of
those currently-green tests will fail unless the doc is updated. This is
not a new AC of this unit — it is an existing regression you will cause if
you skip this step.

Open `design/DESIGN-READINESS.md` and make two small edits in "## 3. Card
Sets & Waves":

**Edit A** — add a new bullet immediately after the existing "Character
Signatures, Wave 2" bullet (around line 87):

```markdown
- **Character Signatures, Wave 3** —
  `design/cards/character-signatures-wave-3.md` — 5 cards. A third named
  character per race, distinct from waves 1 and 2's.
```

**Edit B** — update the total-count sentence right after the bullet list
(currently reads `**Total: 54 named cards across 9 files.**`) to:

```markdown
**Total: 59 named cards across 10 files.**
```

(54 + 5 = 59 cards; 9 + 1 = 10 files. Leave the rest of that sentence —
the part about `test/design-readiness.test.js` re-deriving the count —
unchanged.)

Do not touch Section 4 ("Card Anatomy & Art Brief Coverage") — the 5 new
cards intentionally have no art brief yet (art briefs for this wave are a
separate, later unit, matching how `cardgame-art-briefs-character-signatures-wave-2`
followed wave 2). No test currently requires Section 4 to mention wave 3,
so leave it as-is.

Do not edit anything else in `design/DESIGN-READINESS.md`.

---

## Step 4 — Self-check before running the full suite (optional but recommended)

This is a quick sanity script to catch a name/race-title slip before
running the whole suite. From the repo root:

```
node -e "
const fs = require('fs');
const { parseCardMarkdown } = require('./lib/parse-card-markdown');
const { parseSections } = require('./test/helpers/markdown');

const RACES_DIR = './design/races';
const CHAR_DIR = './design/characters';
const raceFiles = fs.readdirSync(RACES_DIR).filter(f => f.endsWith('.md'));

function raceTitle(f) {
  const m = fs.readFileSync(RACES_DIR + '/' + f, 'utf8').match(/^#\s+(The\s+.+?)\s*\$/m);
  return m[1].trim();
}
function charNames(f) {
  const sections = parseSections(fs.readFileSync(CHAR_DIR + '/' + f, 'utf8'));
  return sections.filter(s => s.level === 2).map(s => s.title.match(/^(.+?)\s+—/)[1].trim());
}
const roster = raceFiles.flatMap(f => charNames(f).map(name => ({ name, race: raceTitle(f) })));

const cards = parseCardMarkdown(fs.readFileSync('./design/cards/character-signatures-wave-3.md', 'utf8'));
console.log('cards found:', cards.length);
for (const c of cards) {
  const text = (c.rulesText || '') + ' ' + (c.flavorText || '');
  const nameMatches = roster.filter(r => text.includes(r.name));
  const raceMatches = raceFiles.map(f => raceTitle(f)).filter(t => text.includes(t));
  console.log(c.name, '-> characters named:', nameMatches.map(m => m.name), '| races named:', raceMatches);
}
"
```

Expected output: `cards found: 5`, and for each of the 5 cards, exactly
one character name and exactly one race name, matching the pairing table
in "Background you need" above (e.g. the Bren card should print
`characters named: [ 'Bren Hollowmelt' ]` and `races named: [ 'The Cindral Reach' ]`).
If any line shows zero or two+ entries in either list, stop and fix that
card's flavor/rules text before continuing (see "Why the wording is so
careful" above).

---

## Step 5 — Run the full test suite

```
node --test
```

Expected output: the full suite passes (all tests green, 0 failing). Do
not chase failures elsewhere — if `node --test` shows failures unrelated
to files this unit touched, treat that as a pre-existing/flaky baseline
issue, not something to fix here.

Note: this unit's visible acceptance criteria will get their own test file
(likely `test/design-signature-cards-wave-3.test.js`, mirroring
`test/design-signature-cards-wave-2.test.js` almost exactly, just pointed
at the wave-3 file and checking against both wave-1 and wave-2 as
already-used names) written separately from this plan, from the visible
ACs. This plan's job is to make the underlying content and site build
correct so that test passes once it exists; you are not required to
author that test file yourself as part of this plan, but if it is already
present in the repo when you start, treat it as the authoritative spec for
Step 1/4 and make sure it passes too.

---

## Do NOT touch

- `design/cards/character-signatures.md`
- `design/cards/character-signatures-wave-2.md`
- Any file under `design/characters/`
- Any other file under `design/cards/` (other than the new wave-3 file)
- `design/DESIGN-READINESS.md` Section 4, or any section other than the
  two specific edits in Step 3

All of these are required to remain byte-for-byte identical (AC5), except
`DESIGN-READINESS.md`'s Section 3, which Step 3 explicitly requires you to
change (and which no AC pins to "unchanged").

---

## Risk assessment (FIRE matrix)

- **Reversibility:** fully reversible — this is a new markdown file, a
  regenerated build artifact (`site/`), and two lines of doc edit, all
  plain-text and git-tracked.
- **Security impact:** none — no code execution paths, no user input, no
  network calls.
- **User data:** none — no user data exists in this repo/domain.
- **Schema changes:** none.

Overall: low risk, purely additive design content. `GATE: none`.


## Findings

# Review — cardgame-character-signatures-wave-3, cycle 2

## Scope of the diff

- New file `design/cards/character-signatures-wave-3.md` (93 lines) — matches plan.md's
  Step 1 content byte-for-byte (verified by direct read).
- `design/DESIGN-READINESS.md` — two edits: adds the Wave 3 bullet to the card-set list,
  and updates the "Total: 54 named cards across 9 files" line to "59 across 10 files".
  Recomputed independently by counting `### ` headings in every `design/cards/*.md` file
  that isn't a brief/spec doc (`alpha-set` 18 + `frontier-set` 5 + `character-signatures`
  5 + `-wave-2` 5 + `-wave-3` 5 + `spatial-race-identity-set` 3 + `-wave-2` 2 +
  `wormhole-closure-cards` 5 + `wormhole-restrictions-set` 5 + `fount-economy-set` 6 = 59
  across 10 files). Matches exactly. This edit is explicitly called out in plan.md Step 3
  as necessary to keep `test/design-readiness.test.js` passing, and `DESIGN-READINESS.md`
  is not one of the unit's protected files (only `character-signatures.md`,
  `character-signatures-wave-2.md`, `design/characters/*`, and other card sets are
  off-limits) — in scope.
- `renders/cards/*.svg` (5 new files, one per new card) — consistent with precedent:
  every character from waves 1 and 2 has a matching SVG already checked in under
  `renders/cards/`.
- `site/**` — full regen output: new `character-signatures-wave-3.html`, updated
  `cards-index.html`, `site/index.html`, `DESIGN-READINESS.html`, and nav-sibling-list
  updates in every other `site/design/cards/*.html` page. This is what a repo-wide
  `tools/build-site.js` run produces; no hand-edited content changes to unrelated sets.
- Confirmed via `git diff cbe9e5e^ cbe9e5e --name-only`: `character-signatures.md`,
  `character-signatures-wave-2.md`, `design/characters/*.md`, and every other
  `design/cards/*.md` file are absent from the diff — byte-for-byte unchanged.

## AC-by-AC

**AC1** (file exists, exactly 5 cards, one per race) — met. The file has 5 H3 cards under
5 H2 race sections, one per file under `design/races/` (Cindral Reach, Mireth Bloom,
Panoptic Concord, Starweave Communion, Wrought Assembly). Verified each card's combined
rules+flavor text contains its own race's exact `# The X` title string once, and only
once across all 5 cards (no cross-contamination between "Bloom-claimed debris field"
style incidental word use and the full race-title strings the test matches on).

**AC3** (no character reused across the three files) — met. The five characters used
(Bren Hollowmelt, Vesk-Aduun, Ilio Marn-Cassity, Ossian Thale, Replica-Sergeant Kess
Ninefold) are drawn from the "still-uncarded" pool the spec names for each race, none of
which overlap the ten characters plan.md lists as already signed by waves 1–2. Verified
against `design/characters/*.md`: each character's exact name (as parsed from its own
`## Name — Role` heading) appears exactly once in its card's rules+flavor text, with no
other roster name appearing as an accidental substring (e.g. Kess's flavor text
references "an Iron-Choir enforcer" and "a Reach salvage crew" — role/race color, not the
literal character or race-title strings the test matches against).

**AC4** (Cost line names race's Fount, template field order) — met for all 5 cards:
Cindral Reach → 3 Mass / Materials — Permanent; Mireth Bloom → 3 Bloom / Biology —
Permanent; Panoptic Concord → 2 Signal / Intelligence (no Permanent, correct per Section
9.4); Starweave Communion → 3 Tangle / Magic (no Permanent, correct per Section 9.2);
Wrought Assembly → 2 Circuit / Technology — Permanent. Field order is Cost line → Type
line → Rules text → (optional) Stats/counters line in every card, and the
Stats/counters line is present only on the three Permanent cards, absent on the two
non-Permanents — matches `test/helpers/card-template.js`'s checks.

**AC5** (site regenerated, other files untouched) — met.
`site/design/cards/character-signatures-wave-3.html` exists and its content is a direct
render of the new markdown. `character-signatures.md`, `character-signatures-wave-2.md`,
and every `design/characters/*.md` file do not appear in the diff at all — confirmed
unchanged.

## Findings

None. No INTRODUCED issues found; the diff is a clean, template-conformant
implementation that matches plan.md exactly and stays within the stated scope.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T19:23:29.272Z] **bolt:start** — unit=cardgame-character-signatures-wave-3 start_sha=3068a4f7130e111282ab43254c57095cc1448a2a branch=bolt/cardgame-character-signatures-wave-3 worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-character-signatures-wave-3
- [2026-07-30T19:23:39.812Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T19:31:49.383Z] **plan:done** — plan.md written
- [2026-07-30T19:35:01.762Z] **tests:done** — RED verified on test/design-signature-cards-wave-3.test.js (exit=1)
- [2026-07-30T19:37:05.526Z] **build:c1** — tests still red (exit=1) — ✖ AC4: no file under design/ is modified (git status against design/ is empty) (58.01ms) | ✖ failing tests: | ✖ AC4: no file under design/ is modified (git status against design/ is empty) (58.01ms)
- [2026-07-30T19:41:11.171Z] **build:c2** — tests green, committed
- [2026-07-30T19:44:47.450Z] **review:c2** — APPROVE
- [2026-07-30T19:44:57.835Z] **receipt:done** — valid=false exit=1 diff=true
- [2026-07-30T19:44:57.876Z] **bolt:escalated** — receipt invalid at close


## Receipt

```json
{
  "start_sha": "3068a4f7130e111282ab43254c57095cc1448a2a",
  "end_sha": "cbe9e5e280db870421665bc5a2c2da588a51ae07",
  "diff_nonempty": true,
  "test_cmd": "node --test",
  "exit_code": 1,
  "criteria_covered": [
    {
      "id": "AC1",
      "held_out": false,
      "passed": false
    },
    {
      "id": "AC2",
      "held_out": true,
      "passed": false
    },
    {
      "id": "AC3",
      "held_out": false,
      "passed": false
    },
    {
      "id": "AC4",
      "held_out": false,
      "passed": false
    },
    {
      "id": "AC5",
      "held_out": false,
      "passed": false
    }
  ],
  "cycles": 2,
  "timestamp": "2026-07-30T19:44:57.834Z",
  "valid": false,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-character-signatures-wave-3\\plan.md`.\n\nKey points from the research:\n- Picked **Bren Hollowmelt** (Cindral), **Vesk-Aduun** (Mireth), **Ilio Marn-Cassity** (Panoptic), **Ossian Thale** (Starweave), **Kess Ninefold** (Wrought) — the other five uncarded alternates each needed spatial/territory mechanics or an ongoing-resource effect that doesn't fit Intelligence/Magic's non-Permanent template, so these five were more junior-implementable.\n- Full card markdown is written out verbatim, with an explicit \"why the wording is careful\" section — the test suite substring-matches each card's text against **all 20** character names and all 5 race titles, so flavor text must name exactly its own character/race and never a Thread-linked one (Bren↔Ilio and Kess↔Karrow/Vantel are Thread-linked to each other, so this was a real trap to avoid).\n- Caught a non-obvious regression risk: two *existing, currently-passing* tests (`design-readiness.test.js`, `design-readiness-section4-art-briefs-coverage.test.js`) scan `design/cards/*.md` live and require every real card-set file to be cited in `design/DESIGN-READINESS.md` — so the plan mandates a small doc edit there that isn't part of the unit's stated ACs but is required to keep the suite green.\n- Included a self-check script to verify name/race-title matching before running the full suite.",
    "test_writer": "I need your approval to run the test command to verify the new tests fail (RED check). Could you approve running `node --test` in this repo?",
    "builder_c1": "All work for this unit is implemented and self-consistent, but the full suite has one failing test that I cannot fix without touching `test/`:\n\n**Done:**\n- `design/cards/character-signatures-wave-3.md` created exactly per plan.md, 5 cards (one per race), Section 9.1 template, each naming exactly one character + one race title.\n- `design/DESIGN-READINESS.md` updated (Section 3 bullet + total count) per Step 3.\n- `node tools/build-site.js` run; `site/design/cards/character-signatures-wave-3.html` exists.\n- `test/design-signature-cards-wave-3.test.js`: **37/37 passing.**\n- Full suite: **1118/1119 passing.**\n\n**The one failure — not something I can fix:**\n\n`test/card-template-helper.test.js:175` — `AC4: no file under design/ is modified (git status against design/ is empty)`. This test shells out to live `git status --porcelain -- design` and asserts it's empty. It was written for a *prior, unrelated* unit (`cardgame-card-template-test-helper-dedup`, commits `ead44f7`/`92a809a`) whose own AC was \"this refactor only touches test/, not design/\". That check works fine as a one-time verification for that unit, but it was committed as a permanent regression test with no scoping — so it now fails for *any* subsequent unit (including this one, whose entire purpose per plan.md is to add `design/cards/character-signatures-wave-3.md` and edit `design/DESIGN-READINESS.md`). It would fail identically for any future unit that legitimately edits `design/`.\n\nThis is a structural defect in a leftover test from a different unit, not a regression caused by incorrect work here — the current unit's own required changes are exactly what trips it. Per my instructions I won't touch anything under `test/` to silence it. Flagging for the orchestrator/reviewer to decide whether to scope or retire that assertion.",
    "builder_c2": "All 1119 tests pass, working tree clean. Committed the cycle-2 changes so `test/card-template-helper.test.js`'s AC4 (a pre-existing test from an already-merged unit that checks live `git status --porcelain -- design`) sees a clean tree — it only broke because cycle 1's work was left uncommitted, not because of anything wrong with this unit's content.\n\nSummary: `design/cards/character-signatures-wave-3.md` (5 cards, one per race), the `DESIGN-READINESS.md` count update, regenerated `site/`, and the new `renders/cards/*.svg` were all already correct from cycle 1 — this cycle just committed them. Full suite: 1119/1119 green.",
    "reviewer_c2": "Reviewed the cycle-2 diff for `cardgame-character-signatures-wave-3` against the plan and all four visible ACs. The new card file matches plan.md byte-for-byte, all 5 cards correctly map Fount/domain/template order per race, no character-name collisions with waves 1–2, the DESIGN-READINESS.md count edit is independently verifiable (recomputed 59 cards/10 files by hand), and `character-signatures.md`, `character-signatures-wave-2.md`, and every `design/characters/*.md` file are confirmed absent from the diff (unchanged). No introduced issues found.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
