GATE: none

# Plan: cardgame-lib-markdown-section-parser-dedup

## Summary

Four domain parsers under `lib/` each hand-roll the same three low-level
markdown helpers instead of sharing them:

| helper | duplicated verbatim in |
|---|---|
| `splitIntoH2Sections` | `lib/parse-race-markdown.js`, `lib/parse-lore-markdown.js` |
| `splitIntoH3SectionsWithParent` | `lib/parse-star-atlas-markdown.js`, `lib/parse-founts-markdown.js` |
| `extractParagraph` (cosmetic variants: `extractSummary` in lore, `lines`-param variant in star-atlas/founts) | all four |
| `slugify` (already correctly imported in 2 of 4; redeclared in the other 2) | `lib/parse-race-markdown.js`, `lib/parse-star-atlas-markdown.js` redeclare it; `lib/parse-lore-markdown.js`, `lib/parse-founts-markdown.js` already import it from `lib/parse-card-markdown.js` |

This is a pure internal refactor: create `lib/markdown-sections.js` holding
the three shared helpers, then make all four parser files import from it
(and import `slugify` from `lib/parse-card-markdown.js`) instead of
redeclaring their own copies. **No parser's public exports, field names,
record shape, or markdown convention changes.** Do not touch
`lib/parse-card-markdown.js`, `lib/parse-character-markdown.js`,
`design/races/`, `design/star-atlas.md`, `design/lore.md`, `design/world.md`,
or any `tools/*` file — none of those are in scope and none need to change.

## Why this is safe (read before you start)

- None of the four existing test files (`test/parse-race-markdown.test.js`,
  `test/parse-lore-markdown.test.js`, `test/parse-star-atlas-markdown.test.js`,
  `test/parse-founts-markdown.test.js`) assert on the *module's own*
  `Object.keys(...)` shape or inspect `splitIntoH2Sections` /
  `splitIntoH3SectionsWithParent` directly — they only call
  `parse*Markdown`, `slugify`, and `loadAll*`. Confirmed by reading all four
  files in full before writing this plan.
- Only `loadAllRaces`, `loadAllEras`, `loadAllWorlds`, `loadAllFounts` are
  consumed outside `lib/` (by `tools/sync-races-to-jaina.js`,
  `tools/sync-lore-eras-to-jaina.js`, `tools/sync-star-atlas-to-jaina.js`,
  `tools/sync-founts-to-jaina.js`). Confirmed via grep — nothing external
  requires `splitIntoH2Sections` etc. from these four files.
- The unit spec says "do not change any parser's public exports" — so even
  though `splitIntoH2Sections` / `splitIntoH3SectionsWithParent` become
  *imported* functions instead of locally-declared ones, each parser file's
  `module.exports` must keep exporting them under the exact same key names
  it does today (this is just re-exporting the imported reference — see the
  per-file sections below). This mirrors the pattern
  `parse-lore-markdown.js` / `parse-founts-markdown.js` already use for
  `slugify` today.
- `extractParagraph` has one real (not just cosmetic) implementation
  difference to reconcile:
  - `parse-race-markdown.js`'s version takes a `section` object, null-guards
    it, and returns `null` on empty.
  - `parse-star-atlas-markdown.js` / `parse-founts-markdown.js`'s version
    takes a `lines` array directly (always called as
    `extractParagraph(section.lines)`) and returns `null` on empty.
  - `parse-lore-markdown.js`'s version is named `extractSummary`, takes a
    `section` object, has **no** null guard, and returns `''` (not `null`)
    on empty.
  - The shared `lib/markdown-sections.js` will export the `section`-object,
    null-returning form (verbatim from `parse-race-markdown.js`, since it's
    the most general of the three — it null-guards where the others don't
    need to). Call sites adapt as follows, with **zero output change**:
    - `parse-race-markdown.js`: no change needed, same signature already.
    - `parse-star-atlas-markdown.js` / `parse-founts-markdown.js`: change
      `extractParagraph(section.lines)` → `extractParagraph(section)`.
      Internally the shared function does `section.lines.map(...)` — same
      array, same result, byte-for-byte identical output. `section` is
      never null at either call site (always a real loop item), so the
      added null-guard is inert here.
    - `parse-lore-markdown.js`: change `extractSummary(section)` →
      `extractParagraph(section) || ''`. This exactly reproduces
      `extractSummary`'s old behavior: non-empty section → identical joined
      string either way; all-blank section → old code returned `''`, new
      code's `extractParagraph` would return `null`, and `|| ''` maps that
      back to `''`. I traced this by hand against the exact current
      implementations (both read in full below) — no design/lore.md era is
      actually blank today, so this edge case doesn't currently fire, but
      the fallback keeps the *type* (`string`, never `null`) identical
      regardless.
- I confirmed by manual trace (not by running unverified code) exactly what
  each shared helper returns for the fixtures used in the new
  `test/markdown-sections.test.js` file below — see "Test 1/3" derivations
  in the file's comments if you want to re-derive them yourself; the
  expected values in the file are correct as written.

## FIRE risk self-assessment

- **F**ile scope: 4 existing `lib/*.js` files edited, 1 new `lib/*.js` file,
  1 new `test/*.test.js` file. No `design/`, `tools/`, or config changes.
- **I**rreversibility: fully reversible (`git revert`); no data, no deploy,
  no migration.
- **R**isk to running systems: none — this repo has no running service;
  `node --test` is the only "execution."
- **E**xternal/security/user-data impact: none. No schema change, no
  secrets, no network calls, no user data.
- Overall: low risk, mechanical refactor. `GATE: none`.

---

## Step 1 — Create `lib/markdown-sections.js`

Create this new file with this exact content:

```js
'use strict';

// ---------------------------------------------------------------------------
// Shared low-level markdown-section helpers used by lib/parse-race-markdown.js,
// lib/parse-lore-markdown.js, lib/parse-star-atlas-markdown.js, and
// lib/parse-founts-markdown.js. Moved here verbatim from those four files —
// no behavior change.
// ---------------------------------------------------------------------------

// Splits a markdown file into its `##` (level-2) heading sections. Any
// heading that isn't level-2 (H1, H3, ...) resets the current section, so
// lines under a non-H2 heading are dropped until the next H2 heading.
function splitIntoH2Sections(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 2) {
        current = { title: heading[2].trim(), lines: [] };
        sections.push(current);
      } else {
        current = null;
      }
      continue;
    }
    if (current) current.lines.push(line);
  }
  return sections;
}

// Splits a markdown file into its `###` (level-3) heading sections, tagging
// each with the text of the nearest preceding `##` (level-2) heading (or
// `null` if none preceded it) so callers can tell which H2 group a record
// fell under.
function splitIntoH3SectionsWithParent(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let currentH2 = null;
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 2) {
        currentH2 = heading[2].trim();
        current = null;
      } else if (level === 3) {
        current = { title: heading[2].trim(), parentH2: currentH2, lines: [] };
        sections.push(current);
      } else {
        current = null;
      }
      continue;
    }
    if (current) current.lines.push(line);
  }
  return sections;
}

// Joins a section's non-blank lines into a single prose paragraph: trims
// each line, drops blank ones, and joins what's left with a single space.
// Returns null for a null section or a section with no non-blank lines.
function extractParagraph(section) {
  if (!section) return null;
  const lines = section.lines.map((line) => line.trim()).filter((line) => line !== '');
  const joined = lines.join(' ').trim();
  return joined || null;
}

module.exports = { splitIntoH2Sections, splitIntoH3SectionsWithParent, extractParagraph };
```

---

## Step 2 — Rewrite `lib/parse-race-markdown.js`

Replace the entire file with this exact content (only the imports at the
top and the removal of the now-redundant `splitIntoH2Sections`,
`extractParagraph`, and `slugify` function bodies change; every other
function is untouched):

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');
const { splitIntoH2Sections, extractParagraph } = require('./markdown-sections');

const RACES_DIR = path.join(__dirname, '..', 'design', 'races');

// ---------------------------------------------------------------------------
// Markdown parsing — design/races/{race}.md "H1 name + fixed H2 sections"
// convention: Identity / Strengths & Weaknesses / Signature Hooks / Visual
// Identity. One file = exactly one race record (unlike the card/character
// parsers, which split one file into many `###`/`##` record sections).
// ---------------------------------------------------------------------------

function findSection(sections, titleRegex) {
  return sections.find((section) => titleRegex.test(section.title)) || null;
}

function extractH1(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  for (const line of lines) {
    const heading = line.match(/^#\s+(.+?)\s*$/);
    if (heading) return heading[1].trim();
  }
  return null;
}

const PRIMARY_STRENGTH_PATTERN = /^-\s+\*\*Primary strength:\*\*\s*(.+)$/;
const COMPLEMENTARY_STRENGTHS_PATTERN = /^-\s+\*\*Complementary strengths:\*\*\s*(.+)$/;
const COUNTERING_WEAKNESSES_PATTERN = /^-\s+\*\*Countering weaknesses:\*\*\s*(.+)$/;

function splitCategoryList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractStrengths(section) {
  const result = { primaryStrength: null, complementaryStrengths: [], counteringWeaknesses: [] };
  if (!section) return result;
  for (const rawLine of section.lines) {
    const line = rawLine.trim();
    const primary = line.match(PRIMARY_STRENGTH_PATTERN);
    if (primary) {
      result.primaryStrength = primary[1].trim();
      continue;
    }
    const complementary = line.match(COMPLEMENTARY_STRENGTHS_PATTERN);
    if (complementary) {
      result.complementaryStrengths = splitCategoryList(complementary[1]);
      continue;
    }
    const countering = line.match(COUNTERING_WEAKNESSES_PATTERN);
    if (countering) {
      result.counteringWeaknesses = splitCategoryList(countering[1]);
    }
  }
  return result;
}

// "- **Salvage Doctrine** — destroyed Cindral units leave behind scrap
// tokens..." -> { name: 'Salvage Doctrine', description: 'destroyed...' },
// split on the em dash (U+2014), the same way
// lib/parse-character-markdown.js's NAME_TITLE_PATTERN splits "Name — Title".
const SIGNATURE_HOOK_PATTERN = /^-\s+\*\*(.+?)\*\*\s+—\s+(.+)$/;

function extractSignatureHooks(section) {
  if (!section) return [];
  const hooks = [];
  for (const rawLine of section.lines) {
    const match = rawLine.trim().match(SIGNATURE_HOOK_PATTERN);
    if (match) {
      hooks.push({ name: match[1].trim(), description: match[2].trim() });
    }
  }
  return hooks;
}

// A file only produces a record if it has an H1 name — this is the same
// required-field gate parseCardMarkdown/parseCharacterMarkdown use to skip
// non-record content, applied here even though every current design/races/
// file does carry an H1.
function parseRaceMarkdown(markdown) {
  const name = extractH1(markdown);
  if (!name) return null;

  const sections = splitIntoH2Sections(markdown);
  const identitySection = findSection(sections, /^identity$/i);
  const strengthsSection = findSection(sections, /^strengths\s*&\s*weaknesses$/i);
  const hooksSection = findSection(sections, /^signature hooks$/i);
  const visualSection = findSection(sections, /^visual identity$/i);

  const { primaryStrength, complementaryStrengths, counteringWeaknesses } =
    extractStrengths(strengthsSection);

  return {
    name,
    slug: slugify(name),
    identity: extractParagraph(identitySection),
    primaryStrength,
    complementaryStrengths,
    counteringWeaknesses,
    signatureHooks: extractSignatureHooks(hooksSection),
    visualIdentity: extractParagraph(visualSection),
  };
}

// ---------------------------------------------------------------------------
// Race loading — design/races/*.md via parseRaceMarkdown above
// ---------------------------------------------------------------------------

function loadRaceFromFile(absPath) {
  const markdown = fs.readFileSync(absPath, 'utf8');
  return parseRaceMarkdown(markdown);
}

function loadAllRaces() {
  const files = fs
    .readdirSync(RACES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
  const races = [];
  for (const file of files) {
    const race = loadRaceFromFile(path.join(RACES_DIR, file));
    if (race) races.push(race);
  }
  return races;
}

module.exports = {
  parseRaceMarkdown,
  slugify,
  splitIntoH2Sections,
  loadRaceFromFile,
  loadAllRaces,
};
```

---

## Step 3 — Rewrite `lib/parse-lore-markdown.js`

Replace the entire file with this exact content:

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');
const { splitIntoH2Sections, extractParagraph } = require('./markdown-sections');

const LORE_PATH = path.join(__dirname, '..', 'design', 'lore.md');

const SUMMARY_TITLE = 'Summary';
const TIMELINE_TITLE = 'Timeline of Eras';

// ---------------------------------------------------------------------------
// Markdown parsing — design/lore.md "## Summary / ## Timeline of Eras /
// one `##` section per era" convention. The Timeline of Eras list is the
// authoritative source of each era's 1-based `order`, independent of the
// era sections' own order in the file.
// ---------------------------------------------------------------------------

// Reads the numbered list inside '## Timeline of Eras' ("1. The Weave
// Age", ...) and returns era names in list order.
function extractTimelineOrder(sections) {
  const timelineSection = sections.find((section) => section.title === TIMELINE_TITLE);
  if (!timelineSection) return [];
  const names = [];
  for (const rawLine of timelineSection.lines) {
    const match = rawLine.trim().match(/^\d+\.\s+(.+)$/);
    if (match) names.push(match[1].trim());
  }
  return names;
}

// A `##` section only counts as an era record if it isn't Summary/Timeline
// of Eras itself, and its heading text appears in the Timeline of Eras
// list — that lookup is what fixes the record's `order` field. Records are
// returned sorted by `order` so output order matches Timeline-of-Eras order
// even if a future edit reshuffled the era sections within the file.
function parseLoreMarkdown(markdown) {
  const sections = splitIntoH2Sections(markdown);
  const timelineOrder = extractTimelineOrder(sections);

  const eras = [];
  for (const section of sections) {
    if (section.title === SUMMARY_TITLE || section.title === TIMELINE_TITLE) continue;
    const position = timelineOrder.indexOf(section.title);
    if (position === -1) continue;
    eras.push({
      name: section.title,
      slug: slugify(section.title),
      order: position + 1,
      summary: extractParagraph(section) || '',
    });
  }

  eras.sort((a, b) => a.order - b.order);
  return eras;
}

// ---------------------------------------------------------------------------
// Era loading — design/lore.md via parseLoreMarkdown above
// ---------------------------------------------------------------------------

function loadAllEras() {
  const markdown = fs.readFileSync(LORE_PATH, 'utf8');
  return parseLoreMarkdown(markdown);
}

module.exports = {
  parseLoreMarkdown,
  slugify,
  splitIntoH2Sections,
  loadAllEras,
};
```

Note the `summary: extractParagraph(section) || ''` — do not simplify this
to `extractParagraph(section)`. The old `extractSummary` returned `''` (not
`null`) for an all-blank section; the `|| ''` preserves that exact return
type so `typeof era.summary === 'string'` always holds, matching what
`test/parse-lore-markdown.test.js`'s "every loaded era carries exactly the 4
required fields with correct shapes" test already asserts.

---

## Step 4 — Rewrite `lib/parse-star-atlas-markdown.js`

Replace the entire file with this exact content:

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');
const { splitIntoH3SectionsWithParent, extractParagraph } = require('./markdown-sections');

const STAR_ATLAS_PATH = path.join(__dirname, '..', 'design', 'star-atlas.md');

const HOMEWORLDS_TITLE = 'Homeworlds';
const FRONTIER_TITLE = 'Frontier & Contested Worlds';

// ---------------------------------------------------------------------------
// Markdown parsing — design/star-atlas.md "## Homeworlds / ## Frontier &
// Contested Worlds, each holding `###` per-world sections" convention. One
// file holds all records (unlike lib/parse-race-markdown.js, where one file
// = one record) so, unlike splitIntoH2Sections, each `###` section here must
// remember which `##` section it fell under.
// ---------------------------------------------------------------------------

// "Ashkeel — Homeworld of the Cindral Reach" -> { name: 'Ashkeel', subtitle:
// 'Homeworld of the Cindral Reach' }; "Halvorne Junction" (no em dash) ->
// { name: 'Halvorne Junction', subtitle: null }. Split on the em dash
// (U+2014), the same way lib/parse-character-markdown.js's NAME_TITLE_PATTERN
// splits "Name — Title".
const NAME_SUBTITLE_PATTERN = /^(.+?)\s+—\s+(.+)$/;

function splitNameAndSubtitle(heading) {
  const match = heading.match(NAME_SUBTITLE_PATTERN);
  if (!match) return { name: heading.trim(), subtitle: null };
  return { name: match[1].trim(), subtitle: match[2].trim() };
}

// "Homeworld of the Cindral Reach" -> "Cindral Reach".
const HOMEWORLD_OF_PREFIX = /^Homeworld of the\s+/;

function raceFromSubtitle(subtitle) {
  if (!subtitle) return null;
  return subtitle.replace(HOMEWORLD_OF_PREFIX, '').trim();
}

// A `###` section only counts as a world record if it fell under one of the
// two known `##` parents — this is what would exclude any future prose
// subsection from being mistaken for a world, the same way
// parseCardBody/parseCharacterBody gate on required shape elsewhere in this
// repo's lib/ parsers.
function parseStarAtlasMarkdown(markdown) {
  const sections = splitIntoH3SectionsWithParent(markdown);
  const worlds = [];
  for (const section of sections) {
    const isHomeworld = section.parentH2 === HOMEWORLDS_TITLE;
    const isFrontier = section.parentH2 === FRONTIER_TITLE;
    if (!isHomeworld && !isFrontier) continue;

    const { name, subtitle } = splitNameAndSubtitle(section.title);
    worlds.push({
      name,
      slug: slugify(name),
      type: isHomeworld ? 'homeworld' : 'frontier',
      race: isHomeworld ? raceFromSubtitle(subtitle) : null,
      description: extractParagraph(section),
    });
  }
  return worlds;
}

// ---------------------------------------------------------------------------
// World loading — design/star-atlas.md via parseStarAtlasMarkdown above
// ---------------------------------------------------------------------------

function loadAllWorlds() {
  const markdown = fs.readFileSync(STAR_ATLAS_PATH, 'utf8');
  return parseStarAtlasMarkdown(markdown);
}

module.exports = {
  parseStarAtlasMarkdown,
  slugify,
  splitIntoH3SectionsWithParent,
  loadAllWorlds,
};
```

Note `description: extractParagraph(section)` — this changed from the old
`extractParagraph(section.lines)`. Passing the whole `section` object (not
`section.lines`) is required because the shared helper's signature takes a
section; internally it does `section.lines.map(...)`, so the output is
byte-for-byte identical to before.

---

## Step 5 — Rewrite `lib/parse-founts-markdown.js`

Replace the entire file with this exact content:

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');
const { splitIntoH3SectionsWithParent, extractParagraph } = require('./markdown-sections');

const WORLD_PATH = path.join(__dirname, '..', 'design', 'world.md');

const FOUNTS_SECTION_TITLE = 'Cosmology: The Five Founts';

// ---------------------------------------------------------------------------
// Markdown parsing — design/world.md's single "## Cosmology: The Five
// Founts" section holding one `###` per Fount. Mirrors
// lib/parse-star-atlas-markdown.js's use of splitIntoH3SectionsWithParent,
// since one file holds all records and each `###` section must remember
// which `##` section it fell under.
// ---------------------------------------------------------------------------

// "The Mass — materials" -> { name: 'The Mass', domain: 'materials' }. Split
// on the em dash (U+2014), the same way
// lib/parse-star-atlas-markdown.js's splitNameAndSubtitle does.
const NAME_DOMAIN_PATTERN = /^(.+?)\s+—\s+(.+)$/;

function splitNameAndDomain(heading) {
  const match = heading.match(NAME_DOMAIN_PATTERN);
  if (!match) return { name: heading.trim(), domain: null };
  return { name: match[1].trim(), domain: match[2].trim() };
}

// A `###` section only counts as a Fount record if it fell directly under
// '## Cosmology: The Five Founts' — this is what excludes 'The Setting' and
// 'A History in Brief' (free-form narrative prose, explicitly out of scope
// per the unit spec) from being mistaken for Fount records.
function parseFountsMarkdown(markdown) {
  const sections = splitIntoH3SectionsWithParent(markdown);
  const founts = [];
  for (const section of sections) {
    if (section.parentH2 !== FOUNTS_SECTION_TITLE) continue;
    const { name, domain } = splitNameAndDomain(section.title);
    founts.push({
      name,
      slug: slugify(name),
      domain,
      description: extractParagraph(section),
    });
  }
  return founts;
}

// ---------------------------------------------------------------------------
// Fount loading — design/world.md via parseFountsMarkdown above
// ---------------------------------------------------------------------------

function loadAllFounts() {
  const markdown = fs.readFileSync(WORLD_PATH, 'utf8');
  return parseFountsMarkdown(markdown);
}

module.exports = {
  parseFountsMarkdown,
  slugify,
  splitIntoH3SectionsWithParent,
  loadAllFounts,
};
```

Same note as Step 4: `description: extractParagraph(section)`, not
`extractParagraph(section.lines)`.

---

## Step 6 — Create `test/markdown-sections.test.js` (satisfies AC5)

Create this new file with this exact content. Every expected value below
was derived by hand-tracing the exact algorithm in Step 1 against each
fixture (not guessed) — do not "simplify" or re-derive them differently.

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'markdown-sections.js');

test('AC1/AC5: lib/markdown-sections.js exists and exports splitIntoH2Sections, splitIntoH3SectionsWithParent, and extractParagraph', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.splitIntoH2Sections, 'function', 'expected an exported splitIntoH2Sections function');
  assert.strictEqual(typeof mod.splitIntoH3SectionsWithParent, 'function', 'expected an exported splitIntoH3SectionsWithParent function');
  assert.strictEqual(typeof mod.extractParagraph, 'function', 'expected an exported extractParagraph function');
});

test('AC5: splitIntoH2Sections groups lines under the nearest preceding level-2 heading', () => {
  const { splitIntoH2Sections } = require(LIB_PATH);

  const markdown = [
    '# Title',
    '',
    '## Alpha',
    '',
    'alpha line one',
    'alpha line two',
    '',
    '## Beta',
    '',
    'beta line one',
    '',
  ].join('\n');

  const sections = splitIntoH2Sections(markdown);
  assert.deepStrictEqual(sections.map((s) => s.title), ['Alpha', 'Beta']);
  assert.deepStrictEqual(sections[0].lines, ['', 'alpha line one', 'alpha line two', '']);
  assert.deepStrictEqual(sections[1].lines, ['', 'beta line one', '']);
});

test('AC5: splitIntoH2Sections resets the current section on any non-H2 heading (H1, H3, ...)', () => {
  const { splitIntoH2Sections } = require(LIB_PATH);

  const markdown = [
    '## Alpha',
    '',
    'alpha body',
    '',
    '# Interrupting H1',
    '',
    'orphaned line, should not belong to any section',
    '',
  ].join('\n');

  const sections = splitIntoH2Sections(markdown);
  assert.strictEqual(sections.length, 1);
  assert.strictEqual(sections[0].title, 'Alpha');
  assert.deepStrictEqual(sections[0].lines, ['', 'alpha body', '']);
});

test('AC5: splitIntoH3SectionsWithParent tags each H3 section with its nearest preceding H2 heading', () => {
  const { splitIntoH3SectionsWithParent } = require(LIB_PATH);

  const markdown = [
    '## Group One',
    '',
    '### Item A',
    '',
    'item a body',
    '',
    '### Item B',
    '',
    'item b body',
    '',
    '## Group Two',
    '',
    '### Item C',
    '',
    'item c body',
    '',
  ].join('\n');

  const sections = splitIntoH3SectionsWithParent(markdown);
  assert.deepStrictEqual(
    sections.map((s) => ({ title: s.title, parentH2: s.parentH2 })),
    [
      { title: 'Item A', parentH2: 'Group One' },
      { title: 'Item B', parentH2: 'Group One' },
      { title: 'Item C', parentH2: 'Group Two' },
    ]
  );
});

test('AC5: splitIntoH3SectionsWithParent records a null parentH2 for an H3 with no preceding H2', () => {
  const { splitIntoH3SectionsWithParent } = require(LIB_PATH);

  const markdown = ['# Title', '', '### Orphan Item', '', 'orphan body', ''].join('\n');

  const sections = splitIntoH3SectionsWithParent(markdown);
  assert.strictEqual(sections.length, 1);
  assert.strictEqual(sections[0].title, 'Orphan Item');
  assert.strictEqual(sections[0].parentH2, null);
});

test('AC5: extractParagraph trims each line, drops blanks, and joins the rest with a single space', () => {
  const { extractParagraph } = require(LIB_PATH);

  const section = { lines: ['  First line.  ', '', 'Second line.', '   ', 'Third line.'] };
  assert.strictEqual(extractParagraph(section), 'First line. Second line. Third line.');
});

test('AC5: extractParagraph returns null for a null section or an all-blank section', () => {
  const { extractParagraph } = require(LIB_PATH);

  assert.strictEqual(extractParagraph(null), null);
  assert.strictEqual(extractParagraph({ lines: ['', '   ', ''] }), null);
});
```

---

## Verification

Run:

```
node --test
```

Expected output:
- No failures. The summary line (`# fail 0`) must read `0`.
- `# pass` increases by exactly 7 versus the pre-refactor run (the 7 new
  tests in `test/markdown-sections.test.js`).
- All pre-existing tests in `test/parse-race-markdown.test.js`,
  `test/parse-lore-markdown.test.js`, `test/parse-star-atlas-markdown.test.js`,
  `test/parse-founts-markdown.test.js`, `test/sync-races-to-jaina.test.js`,
  `test/sync-lore-eras-to-jaina.test.js`, `test/sync-star-atlas-to-jaina.test.js`,
  `test/sync-founts-to-jaina.test.js`, `test/design-races.test.js`,
  `test/design-lore.test.js`, `test/design-star-atlas.test.js` still pass
  unmodified (AC3) — these files are not edited by this plan.

Also manually sanity-check AC1/AC2 with a quick grep after implementing:

```
grep -n "function splitIntoH2Sections\|function splitIntoH3SectionsWithParent\|function extractParagraph\|function extractSummary\|function slugify" lib/parse-race-markdown.js lib/parse-lore-markdown.js lib/parse-star-atlas-markdown.js lib/parse-founts-markdown.js
```

Expected output: no matches (all four files should have zero local
declarations of these five function names after the refactor — they're all
imported now).

## Do NOT touch

- `lib/parse-card-markdown.js`, `lib/parse-character-markdown.js` — out of
  scope; `parse-character-markdown.js` has its own separate
  `splitIntoH2Sections` copy that this unit does not cover.
- `design/races/*.md`, `design/star-atlas.md`, `design/lore.md`,
  `design/world.md`.
- `tools/sync-races-to-jaina.js`, `tools/sync-lore-eras-to-jaina.js`,
  `tools/sync-star-atlas-to-jaina.js`, `tools/sync-founts-to-jaina.js`, or
  any other `tools/*` file.
- Any of the four existing `test/parse-*-markdown.test.js` files — they
  must pass unmodified (AC3).

## Held-out AC note

AC4 (held out — "loadAllRaces/loadAllWorlds/loadAllEras/loadAllFounts
against real design/ files return the same records after the refactor") is
redundant with the visible intent ("no behavior change — same regexes, same
trimming, same return shapes") — it's just the black-box version of the
same guarantee the unit already asks for. Not a spec bug; no flag needed.
