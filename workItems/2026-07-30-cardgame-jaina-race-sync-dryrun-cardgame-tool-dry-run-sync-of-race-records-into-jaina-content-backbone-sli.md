# cardgame-jaina-race-sync-dryrun: cardGame tool — dry-run sync of race records into Jaina (content backbone, slice 3)

## Header

- unit: cardgame-jaina-race-sync-dryrun
- title: cardGame tool — dry-run sync of race records into Jaina (content backbone, slice 3)
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: 6c8f9220ef4de428671a89073b460a22f7d66fed
- end_sha: 646714d1172bc0ece4761012ff780672fa837363

## Intent

design/DESIGN-READINESS.md's Open Gap 4 names the hole directly: only card records (and, once its sibling proposal merges, character records) are wired to Jaina, while design/races/ (5 files, one per race) remains markdown-only prose with no Jaina schema or sync path. This is the next narrow slice under the same 2026-07-28 ideas-inbox directive that produced cardgame-jaina-card-sync-dryrun and cardgame-jaina-character-sync-dryrun (T1 discipline: no live write, races only, not the full remaining scope in one shot). Add lib/parse-race-markdown.js, a shared parser mirroring lib/parse-card-markdown.js's conventions, that reads each design/races/{race}.md file and extracts one record: name (the H1 heading text, e.g. 'The Cindral Reach'), slug (the identical slugify algorithm used by lib/parse-card-markdown.js), identity (the '## Identity' section's prose paragraph), primaryStrength (the 'Primary strength:' bullet value), complementaryStrengths and counteringWeaknesses (the two-item lists from their respective bullets), signatureHooks (an array of {name, description} pairs parsed from the '## Signature Hooks' bold-name-plus-description bullets), and visualIdentity (the '## Visual Identity' section's prose paragraph). tools/sync-races-to-jaina.js prints one JSON payload per record in --dry-run mode; without --dry-run it makes no Jaina API calls or network access, printing a message that live sync is not yet implemented for races and exiting 1, so no credentials are required by node --test. This is content-authoring tooling under the T16 partial software-gate opening, not game implementation.

## Acceptance Criteria

- AC1 [paraphrase]: node tools/sync-races-to-jaina.js --dry-run exits 0 and prints exactly 5 JSON objects, one per file in design/races/: cindral-reach.md, mireth-bloom.md, panoptic-concord.md, starweave-communion.md, and wrought-assembly.md
- AC2 [paraphrase]: Each printed record has name, slug, identity, primaryStrength, complementaryStrengths, counteringWeaknesses, signatureHooks, and visualIdentity fields; slug is computed with the identical slugify(name) algorithm already used by lib/parse-card-markdown.js, so the same race name produces the same slug anywhere else in the repo
- AC3 [inferred] (held_out): complementaryStrengths and counteringWeaknesses are each arrays of exactly 2 strings matching that race file's own bullets, and signatureHooks is an array of exactly 5 {name, description} objects matching that race file's own '## Signature Hooks' bullet list verbatim
- AC4 [inferred]: Without --dry-run, the script makes no Jaina API calls, no network access, and no credentials are required by node --test — it prints a message that live sync is not yet implemented for races and exits 1
- AC5 [inferred]: Running the dry-run twice in a row against unchanged markdown produces byte-identical stdout output (deterministic: no timestamps, no randomness, stable record ordering: cindral-reach, mireth-bloom, panoptic-concord, starweave-communion, wrought-assembly)

## Plan

# Plan: cardgame-jaina-race-sync-dryrun

GATE: none

This unit is a narrow, mechanical repeat of the pattern already merged twice
in this repo — `lib/parse-card-markdown.js` / `tools/sync-cards-to-jaina.js`
(live-sync-capable) and, more closely, `lib/parse-character-markdown.js` /
`tools/sync-characters-to-jaina.js` (dry-run-only, exactly this unit's shape).
No live Jaina writes, no network access, no schema changes, no credentials
required. Risk is low on every FIRE axis:

- **F**ix/reversibility: pure addition of two new files (+2 new test files);
  nothing existing is modified. Trivially revertable.
- **I**mpact/security: no network calls, no auth, no secrets touched.
- **R**eversibility of data: no writes anywhere — dry-run only prints to
  stdout; the non-dry-run path is a hard `exitCode = 1` before any I/O.
- **E**xposure/user data: none. Content-authoring tooling over static
  markdown already committed to the repo.

## Held-out AC discipline

AC3 (held out) asserts `complementaryStrengths`/`counteringWeaknesses` have
exactly 2 entries and `signatureHooks` has exactly 5, "matching that race
file's own bullets verbatim." I read all 5 files under `design/races/` (see
below) and confirmed every one of them currently has exactly 2 complementary
strengths, exactly 2 countering weaknesses, and exactly 5 signature-hook
bullets. This is redundant with the visible intent (unit.md already names
these as "the two-item lists" and an array of hook pairs) plus the actual
current file contents — not a novel requirement invented out of nowhere, so
no spec-bug flag needed. Note `test/design-races.test.js`'s own AC4 only
requires "3-5" signature hooks (a looser bound for future race edits); this
unit's AC3 is a stricter snapshot check against the files as they exist
today, which is fine since it only has to hold for the current markdown.

## Source files inspected (read-only — do not modify)

- `lib/parse-card-markdown.js` — canonical `slugify(name)` algorithm to
  mirror exactly.
- `lib/parse-character-markdown.js` — closest structural sibling: same
  `splitIntoH2Sections` helper shape, same "extract prose paragraph by
  joining non-blank lines" convention for bio-like fields.
- `tools/sync-characters-to-jaina.js` — the sync-tool shape to mirror
  exactly (dry-run-only; no `lib/jaina-client.js` dependency; no-flag path
  prints a "not yet implemented" message and exits 1).
- `test/sync-characters-to-jaina.test.js`, `test/parse-character-markdown.test.js`
  — the test shape/structure to mirror.
- `test/helpers/markdown.js` — reusable `parseSections`/`sectionText` used by
  `test/design-races.test.js`; reuse these in the new test file rather than
  hand-rolling new markdown-walking helpers.
- `test/design-races.test.js` — already asserts the race-file structure this
  parser depends on (Identity paragraph, 1 primary + 2 complementary + 2
  countering strengths drawn from `Materials/Biology/Intelligence/Technology/Magic`,
  3-5 signature hooks, Visual Identity paragraph). This unit's parser and
  tests are consistent with those invariants.
- `design/races/cindral-reach.md`, `mireth-bloom.md`, `panoptic-concord.md`,
  `starweave-communion.md`, `wrought-assembly.md` — all 5 read in full.
  Every file has the identical shape:

  ```
  # <The Race Name>

  ## Identity

  <one prose paragraph>

  ## Strengths & Weaknesses

  - **Primary strength:** <Category>
  - **Complementary strengths:** <Category>, <Category>
  - **Countering weaknesses:** <Category>, <Category>

  ## Signature Hooks

  - **<Hook Name>** — <hook description>
  - **<Hook Name>** — <hook description>
  - **<Hook Name>** — <hook description>
  - **<Hook Name>** — <hook description>
  - **<Hook Name>** — <hook description>

  ## Visual Identity

  <one prose paragraph>
  ```

  The em dash in "Signature Hooks" bullets is U+2014 (`—`), the same
  character `lib/parse-character-markdown.js`'s `NAME_TITLE_PATTERN` splits
  on for "Name — Title" headings — this repo consistently uses U+2014 for
  this separator, not a hyphen or en dash.

## File 1 (new): `lib/parse-race-markdown.js`

Create this file with exactly this content:

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RACES_DIR = path.join(__dirname, '..', 'design', 'races');

// ---------------------------------------------------------------------------
// Markdown parsing — design/races/{race}.md "H1 name + fixed H2 sections"
// convention: Identity / Strengths & Weaknesses / Signature Hooks / Visual
// Identity. One file = exactly one race record (unlike the card/character
// parsers, which split one file into many `###`/`##` record sections).
// ---------------------------------------------------------------------------

// Splits a markdown file into its `##` (level-2) heading sections, mirroring
// lib/parse-character-markdown.js's splitIntoH2Sections.
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

function findSection(sections, titleRegex) {
  return sections.find((section) => titleRegex.test(section.title)) || null;
}

// Joins a section's non-blank lines into a single prose paragraph — the same
// blank-line-delimited convention lib/parse-character-markdown.js uses for
// bio text, applied here to the Identity / Visual Identity sections.
function extractParagraph(section) {
  if (!section) return null;
  const lines = section.lines.map((line) => line.trim()).filter((line) => line !== '');
  const joined = lines.join(' ').trim();
  return joined || null;
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
// split on the em dash (U+2014) the same way
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

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

Notes for the junior implementing this:

- `RACES_DIR` files sort alphabetically as `cindral-reach.md`,
  `mireth-bloom.md`, `panoptic-concord.md`, `starweave-communion.md`,
  `wrought-assembly.md` — already the exact order AC5 requires, no extra
  sort key needed.
- `name` is the H1 text **verbatim**, e.g. `"The Cindral Reach"` — do not
  strip the leading "The". `slug` is `slugify("The Cindral Reach")` =
  `"the-cindral-reach"`. This is intentionally a different slug than the
  bare race name `"Cindral Reach"` used elsewhere (e.g.
  `lib/parse-character-markdown.js`'s `race` field on character records) —
  AC2 only requires the *algorithm* be identical to
  `lib/parse-card-markdown.js`'s `slugify`, not that this unit's slug values
  match some other domain's slug values.

## File 2 (new): `tools/sync-races-to-jaina.js`

Create this file with exactly this content (mirrors
`tools/sync-characters-to-jaina.js` line for line, swapped to races):

```js
#!/usr/bin/env node
'use strict';

const { loadAllRaces } = require('../lib/parse-race-markdown');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for races in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'races' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(race) {
  return {
    name: race.name,
    slug: race.slug,
    identity: race.identity,
    primaryStrength: race.primaryStrength,
    complementaryStrengths: race.complementaryStrengths,
    counteringWeaknesses: race.counteringWeaknesses,
    signatureHooks: race.signatureHooks,
    visualIdentity: race.visualIdentity,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!dryRun) {
    console.error(NOT_IMPLEMENTED_MESSAGE);
    process.exitCode = 1;
    return;
  }

  const races = loadAllRaces();
  for (const race of races) {
    console.log(JSON.stringify(buildRecord(race)));
  }
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
```

Note this file deliberately has **no** `require('../lib/jaina-client')` and
**no** `child_process`/network usage anywhere — that's what lets AC4's test
assert `node --test` needs no credentials, and lets the no-flag path exit 1
before touching anything.

## File 3 (new): `test/parse-race-markdown.test.js`

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-race-markdown.js');
const CARD_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');

test('AC2: lib/parse-race-markdown.js exists and exports parseRaceMarkdown, slugify, and loadAllRaces', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseRaceMarkdown, 'function', 'expected an exported parseRaceMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
  assert.strictEqual(typeof mod.loadAllRaces, 'function', 'expected an exported loadAllRaces function');
});

test('AC2: slugify matches lib/parse-card-markdown.js\'s existing algorithm', () => {
  const { slugify } = require(LIB_PATH);
  const { slugify: cardSlugify } = require(CARD_LIB_PATH);

  assert.strictEqual(slugify('The Cindral Reach'), 'the-cindral-reach');
  assert.strictEqual(slugify('  Multiple   Spaces  '), 'multiple-spaces');

  const samples = ['The Cindral Reach', 'The Mireth Bloom', 'The Panoptic Concord', "The Starweave Communion"];
  for (const name of samples) {
    assert.strictEqual(slugify(name), cardSlugify(name), `expected slugify("${name}") to match the card parser's slugify`);
  }
});

test('AC1/AC2: parseRaceMarkdown extracts all 8 fields from a well-formed race file', () => {
  const { parseRaceMarkdown } = require(LIB_PATH);

  const markdown = `# The Test Reach

## Identity

This is a test race that exists only to exercise the parser. It spans
one paragraph.

## Strengths & Weaknesses

- **Primary strength:** Materials
- **Complementary strengths:** Biology, Intelligence
- **Countering weaknesses:** Technology, Magic

## Signature Hooks

- **First Hook** — the first hook's description.
- **Second Hook** — the second hook's description.

## Visual Identity

A visual identity paragraph for the test race.
`;

  const race = parseRaceMarkdown(markdown);
  assert.deepStrictEqual(race, {
    name: 'The Test Reach',
    slug: 'the-test-reach',
    identity: 'This is a test race that exists only to exercise the parser. It spans one paragraph.',
    primaryStrength: 'Materials',
    complementaryStrengths: ['Biology', 'Intelligence'],
    counteringWeaknesses: ['Technology', 'Magic'],
    signatureHooks: [
      { name: 'First Hook', description: "the first hook's description." },
      { name: 'Second Hook', description: "the second hook's description." },
    ],
    visualIdentity: 'A visual identity paragraph for the test race.',
  });
});

test('AC1: parseRaceMarkdown returns null when the markdown has no H1', () => {
  const { parseRaceMarkdown } = require(LIB_PATH);
  const race = parseRaceMarkdown('## Identity\n\nNo H1 heading here.\n');
  assert.strictEqual(race, null);
});

test('AC1: loadAllRaces returns exactly 5 records, in cindral/mireth/panoptic/starweave/wrought file order', () => {
  const { loadAllRaces } = require(LIB_PATH);

  const races = loadAllRaces();
  assert.strictEqual(races.length, 5, `expected exactly 5 races, found ${races.length}`);

  assert.deepStrictEqual(
    races.map((r) => r.name),
    [
      'The Cindral Reach',
      'The Mireth Bloom',
      'The Panoptic Concord',
      'The Starweave Communion',
      'The Wrought Assembly',
    ]
  );
});

test('AC2/AC3: every loaded race carries exactly the 8 required fields with correct shapes', () => {
  const { loadAllRaces, slugify } = require(LIB_PATH);

  const races = loadAllRaces();
  for (const race of races) {
    assert.deepStrictEqual(
      Object.keys(race).sort(),
      [
        'complementaryStrengths',
        'counteringWeaknesses',
        'identity',
        'name',
        'primaryStrength',
        'signatureHooks',
        'slug',
        'visualIdentity',
      ],
      `expected record for "${race.name}" to carry exactly the 8 required fields`
    );
    assert.strictEqual(race.slug, slugify(race.name));
    assert.strictEqual(typeof race.identity, 'string');
    assert.ok(race.identity.length > 0, `expected non-empty identity for "${race.name}"`);
    assert.strictEqual(typeof race.visualIdentity, 'string');
    assert.ok(race.visualIdentity.length > 0, `expected non-empty visualIdentity for "${race.name}"`);
    assert.strictEqual(typeof race.primaryStrength, 'string');
    assert.strictEqual(race.complementaryStrengths.length, 2, `expected 2 complementary strengths for "${race.name}"`);
    assert.strictEqual(race.counteringWeaknesses.length, 2, `expected 2 countering weaknesses for "${race.name}"`);
    assert.strictEqual(race.signatureHooks.length, 5, `expected 5 signature hooks for "${race.name}"`);
    for (const hook of race.signatureHooks) {
      assert.strictEqual(typeof hook.name, 'string');
      assert.strictEqual(typeof hook.description, 'string');
      assert.ok(hook.name.length > 0);
      assert.ok(hook.description.length > 0);
    }
  }
});
```

## File 4 (new): `test/sync-races-to-jaina.test.js`

This mirrors `test/sync-characters-to-jaina.test.js`'s structure, but
independently re-derives expected records straight from the raw markdown
(via `test/helpers/markdown.js`'s existing `parseSections`/`sectionText`,
already used by `test/design-races.test.js`) rather than depending on
`lib/parse-race-markdown.js` itself — so a bug shared between the parser and
the test can't hide.

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections, sectionText } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-races-to-jaina.js');
const RACES_DIR = path.join(REPO_ROOT, 'design', 'races');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractH1(content) {
  const match = content.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1].trim() : null;
}

function paragraphFromBody(body) {
  if (!body) return '';
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}

// Independently derives the expected race record straight from the
// design/races/*.md source files, mirroring the H1 / Identity / Strengths &
// Weaknesses / Signature Hooks / Visual Identity convention documented in
// the unit's plan — without depending on lib/parse-race-markdown.js itself.
function listExpectedRaces() {
  const files = fs.readdirSync(RACES_DIR).filter((f) => f.endsWith('.md')).sort();

  return files.map((file) => {
    const content = fs.readFileSync(path.join(RACES_DIR, file), 'utf8');
    const name = extractH1(content);
    const sections = parseSections(content);

    const identity = paragraphFromBody(sectionText(sections, /^identity$/i));
    const visualIdentity = paragraphFromBody(sectionText(sections, /^visual identity$/i));

    const strengthsBody = sectionText(sections, /^strengths\s*&\s*weaknesses$/i) || '';
    const primaryMatch = strengthsBody.match(/^-\s+\*\*Primary strength:\*\*\s*(.+)$/m);
    const complementaryMatch = strengthsBody.match(/^-\s+\*\*Complementary strengths:\*\*\s*(.+)$/m);
    const counteringMatch = strengthsBody.match(/^-\s+\*\*Countering weaknesses:\*\*\s*(.+)$/m);
    const splitList = (m) => (m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : []);

    const hooksBody = sectionText(sections, /^signature hooks$/i) || '';
    const signatureHooks = hooksBody
      .split(/\r?\n/)
      .map((line) => line.trim())
      .map((line) => line.match(/^-\s+\*\*(.+?)\*\*\s+—\s+(.+)$/))
      .filter(Boolean)
      .map((m) => ({ name: m[1].trim(), description: m[2].trim() }));

    return {
      name,
      slug: slugify(name),
      identity,
      primaryStrength: primaryMatch ? primaryMatch[1].trim() : null,
      complementaryStrengths: splitList(complementaryMatch),
      counteringWeaknesses: splitList(counteringMatch),
      signatureHooks,
      visualIdentity,
    };
  });
}

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly 5 JSON objects, one per file
// under design/races/.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints exactly 5 JSON objects, one per design/races/*.md file', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-races-to-jaina.js --dry-run` to exit 0');

  const lines = parseLines(stdout);
  assert.strictEqual(lines.length, 5, `expected exactly 5 JSON lines, got ${lines.length}`);

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  const expected = listExpectedRaces();
  assert.deepStrictEqual(
    records.map((r) => r.name),
    expected.map((r) => r.name)
  );
});

// ---------------------------------------------------------------------------
// AC2: every printed record has exactly the 8 required fields; slug matches
// slugify(name) using the identical algorithm as lib/parse-card-markdown.js.
// ---------------------------------------------------------------------------

test('AC2: each record carries exactly the 8 required fields, and slug matches slugify(name)', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.strictEqual(records.length, 5);
  for (const record of records) {
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      [
        'complementaryStrengths',
        'counteringWeaknesses',
        'identity',
        'name',
        'primaryStrength',
        'signatureHooks',
        'slug',
        'visualIdentity',
      ],
      `expected record for "${record.name}" to carry exactly the 8 required fields`
    );
    assert.strictEqual(
      record.slug,
      slugify(record.name),
      `expected slug "${record.slug}" for "${record.name}" to match slugify(name)`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3 (held out): complementaryStrengths / counteringWeaknesses are each
// exactly 2 strings, and signatureHooks is exactly 5 {name, description}
// objects, all matching each race file's own bullets verbatim.
// ---------------------------------------------------------------------------

test('AC3: complementaryStrengths/counteringWeaknesses have exactly 2 entries and signatureHooks exactly 5, verbatim vs source', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));
  const expected = listExpectedRaces();

  assert.strictEqual(records.length, expected.length);
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const exp = expected[i];

    assert.strictEqual(record.complementaryStrengths.length, 2, `expected 2 complementary strengths for "${record.name}"`);
    assert.strictEqual(record.counteringWeaknesses.length, 2, `expected 2 countering weaknesses for "${record.name}"`);
    assert.strictEqual(record.signatureHooks.length, 5, `expected 5 signature hooks for "${record.name}"`);

    assert.deepStrictEqual(record.complementaryStrengths, exp.complementaryStrengths, `complementaryStrengths mismatch for "${record.name}"`);
    assert.deepStrictEqual(record.counteringWeaknesses, exp.counteringWeaknesses, `counteringWeaknesses mismatch for "${record.name}"`);
    assert.deepStrictEqual(record.signatureHooks, exp.signatureHooks, `signatureHooks mismatch for "${record.name}"`);
    assert.strictEqual(record.identity, exp.identity, `identity mismatch for "${record.name}"`);
    assert.strictEqual(record.primaryStrength, exp.primaryStrength, `primaryStrength mismatch for "${record.name}"`);
    assert.strictEqual(record.visualIdentity, exp.visualIdentity, `visualIdentity mismatch for "${record.name}"`);
  }
});

// ---------------------------------------------------------------------------
// AC4: without --dry-run, the script makes no Jaina API calls, requires no
// network access or credentials, prints a "not yet implemented" message, and
// exits 1.
// ---------------------------------------------------------------------------

test('AC4: without --dry-run, exits 1 with a "not yet implemented" message and makes no network/subprocess calls', () => {
  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-races-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(/not yet implemented/i.test(output), `expected a "not yet implemented" message, got: ${output}`);
  assert.ok(/races/i.test(output), `expected the message to mention races, got: ${output}`);
  assert.ok(/--dry-run/.test(output), `expected the message to point at --dry-run, got: ${output}`);

  const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');
  assert.ok(
    !/require\(\s*['"](?:https?|child_process)['"]\s*\)/.test(scriptSource),
    'expected no network or subprocess module usage in the sync script'
  );
  assert.ok(!/\bfetch\s*\(/.test(scriptSource), 'expected no direct fetch() calls in the tool file');
  assert.ok(
    !/jaina-client/.test(scriptSource),
    'expected no dependency on lib/jaina-client.js in this dry-run-only unit'
  );
});

test('AC4: node --test needs no JAINA_API_KEY / JAINA_PROJECT_ID to exercise the no-flag path', () => {
  const env = { ...process.env };
  delete env.JAINA_API_KEY;
  delete env.JAINA_PROJECT_ID;

  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8', env });
  } catch (err) {
    error = err;
  }
  assert.ok(error, 'expected the no-flag path to exit non-zero even without Jaina credentials in the environment');
  assert.strictEqual(error.status, 1);
});

// ---------------------------------------------------------------------------
// AC5: running --dry-run twice in a row against unchanged markdown produces
// byte-identical stdout (deterministic ordering, no timestamps/randomness).
// ---------------------------------------------------------------------------

test('AC5: running --dry-run twice in a row produces byte-identical stdout', () => {
  const first = runDryRun();
  const second = runDryRun();
  assert.strictEqual(first, second, 'expected two consecutive --dry-run runs to produce identical stdout');
});

test('AC5: --dry-run output order is cindral-reach, mireth-bloom, panoptic-concord, starweave-communion, wrought-assembly', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.deepStrictEqual(
    records.map((r) => r.name),
    [
      'The Cindral Reach',
      'The Mireth Bloom',
      'The Panoptic Concord',
      'The Starweave Communion',
      'The Wrought Assembly',
    ]
  );
});
```

## Expected outputs

### `node tools/sync-races-to-jaina.js --dry-run`

Exits 0. Prints exactly 5 lines of JSON, one per race, in this order:
Cindral Reach, Mireth Bloom, Panoptic Concord, Starweave Communion, Wrought
Assembly. First line (pretty-printed here for readability; actual output is
one compact `JSON.stringify` line):

```json
{
  "name": "The Cindral Reach",
  "slug": "the-cindral-reach",
  "identity": "The Cindral Reach began as asteroid-belt mining clans and became an empire that never stopped thinking like one: nothing is wasted, nothing is thrown away, and everything — a hull, a soldier, a dead enemy's warship — can be melted down and remade into something the Reach needs more. They want simple, absolute things: territory, matériel, and the certainty that comes from owning enough hardware that losing a battle is an inconvenience, not a crisis. Playing the Reach feels like accumulating weight — slow at first, then unstoppable, then very hard for anyone else to out-produce.",
  "primaryStrength": "Materials",
  "complementaryStrengths": ["Biology", "Intelligence"],
  "counteringWeaknesses": ["Technology", "Magic"],
  "signatureHooks": [
    { "name": "Salvage Doctrine", "description": "destroyed Cindral units leave behind scrap tokens that make your next rebuild cheaper." },
    { "name": "Line-Fleet Discipline", "description": "Materials units get stronger for every other copy of them you control." },
    { "name": "Ancestral Plating", "description": "equipment attached to a Cindral unit can't be stripped by non-Materials effects." },
    { "name": "The Long Refit", "description": "a Materials generator that survives three turns starts producing bonus points." },
    { "name": "Cinderborn Levy", "description": "spend leftover Materials points to deploy a lesser unit for free." }
  ],
  "visualIdentity": "Rusted ochre and iron-grey war-hulls patched with generations of salvage plating; industrial gothic silhouettes bristling with exposed girders and glowing forge-vents; warriors sealed in heavy exosuits fused at the joints from decades of continuous wear; ships shaped like cathedrals of scrap, trailing slag and cinder in their wake."
}
```

### `node tools/sync-races-to-jaina.js` (no flag)

Prints to stderr:

```
Live sync to Jaina is not yet implemented for races in this unit. Re-run with --dry-run to preview the record payloads a future live-sync step would write.
```

Exits with code 1. No stdout.

### `node --test`

All existing test files continue to pass unmodified (this unit adds files,
touches nothing else). The two new test files add roughly 15 new passing
tests (7 in `parse-race-markdown.test.js`, 8 in `sync-races-to-jaina.test.js`).
Final summary line should read `# pass <N>` with `# fail 0`, where `N` is the
prior total plus these ~15.

## Out of scope (do not implement)

- No live Jaina API calls, no `lib/jaina-client.js` usage, no schema
  creation in Jaina itself — that's explicitly deferred future work per the
  unit's "not yet implemented" message.
- No changes to `design/races/*.md` content.
- No changes to `design/DESIGN-READINESS.md` (Open Gap 4 still won't be
  fully closed after this unit — world/lore/star-atlas sync remains out of
  scope, same T1-discipline narrow-slice pattern as the card and character
  sync units before it).
- No changes to any existing `lib/`, `tools/`, or `test/` file.


## Findings

# Blind Review: cardgame-jaina-race-sync-dryrun (cycle 1)

## Scope

Reviewed `lib/parse-race-markdown.js`, `tools/sync-races-to-jaina.js`, and the two
new test files, against unit.md's visible ACs, plan.md, and the actual
`design/races/*.md` source files (read all 5 in full, not just the diff's own
tests, to independently verify parser correctness against real content).

## AC-by-AC

- **AC1** (dry-run exits 0, prints exactly 5 JSON objects, one per
  `design/races/*.md` file): Satisfied. `loadAllRaces()` reads
  `design/races/`, filters `.md` files, sorts by filename (alphabetical order
  = cindral-reach, mireth-bloom, panoptic-concord, starweave-communion,
  wrought-assembly — matches AC5's required order too), and
  `main()`'s dry-run branch prints one `JSON.stringify(buildRecord(race))`
  line per loaded race with no explicit non-zero exit. Verified `extractH1`
  successfully extracts a name from all 5 real files (each starts with a
  single `# The ...` H1), so none are silently dropped.

- **AC2** (name/slug/identity/primaryStrength/complementaryStrengths/
  counteringWeaknesses/signatureHooks/visualIdentity fields; slug uses the
  identical `slugify` algorithm as `lib/parse-card-markdown.js`): Satisfied.
  `buildRecord` in the tool emits exactly these 8 keys. Diffed the new
  `slugify` in `lib/parse-race-markdown.js` character-for-character against
  `lib/parse-card-markdown.js`'s exported `slugify` — identical
  (`toLowerCase` → `replace(/[^a-z0-9]+/g,'-')` →
  `replace(/^-+|-+$/g,'')`).

- **AC4** (no `--dry-run`: no Jaina API calls/network/credentials, prints a
  "not yet implemented" message mentioning races and `--dry-run`, exits 1):
  Satisfied. The no-flag branch only does `console.error(NOT_IMPLEMENTED_MESSAGE)`
  (message contains "not yet implemented for races" and "--dry-run") and sets
  `process.exitCode = 1`. `tools/sync-races-to-jaina.js` requires only
  `../lib/parse-race-markdown` — no `http(s)`, `child_process`, `fetch`, or
  `jaina-client` reference anywhere in the tool or lib file.

- **AC5** (two consecutive dry-runs byte-identical; stable order
  cindral/mireth/panoptic/starweave/wrought): Satisfied. No use of `Date`,
  `Math.random`, or any non-deterministic input; `loadAllRaces` sorts
  filenames explicitly before mapping, so ordering is stable and matches the
  required sequence.

## Static verification against real race files

Independently grepped all 5 `design/races/*.md` files (not relying on the
diff's own test fixtures) to confirm the parser's regexes actually match the
live content, since the plan claims a very specific fixed shape per file:

- `^-\s+\*\*Primary strength:\*\*\s*.+$` → exactly 1 match per file (5/5 files).
- `^-\s+\*\*(Complementary strengths|Countering weaknesses):\*\*\s*.+$` →
  exactly 2 matches per file (10/10 total).
- `^-\s+\*\*.+\*\*\s+—\s+` (literal U+2014 em dash, matching
  `SIGNATURE_HOOK_PATTERN` exactly) → exactly 5 matches per file (25/25
  total), confirming every file uses the same em-dash bullet convention the
  parser expects, with no strays.

All 5 files share the identical H1 → `## Identity` → `## Strengths &
Weaknesses` (3 bullets) → `## Signature Hooks` (5 bullets) → `## Visual
Identity` structure the plan documents. `splitIntoH2Sections`/`findSection`/
`extractParagraph`/`extractStrengths`/`extractSignatureHooks` correctly
extract from this shape (each Identity/Visual Identity paragraph is a single
non-wrapped line in the actual files, so the paragraph-join logic is a no-op
concatenation, no edge case there).

## Findings

None. No INTRODUCED defects found. The diff is a narrow, mechanical mirror of
`lib/parse-card-markdown.js` / `tools/sync-characters-to-jaina.js` as
described in plan.md: no live Jaina writes, no network access, no schema
changes, pure addition of 2 new lib/tool files + 2 new test files with
nothing pre-existing modified.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T10:30:23.782Z] **bolt:start** — unit=cardgame-jaina-race-sync-dryrun start_sha=6c8f9220ef4de428671a89073b460a22f7d66fed branch=bolt/cardgame-jaina-race-sync-dryrun worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-jaina-race-sync-dryrun
- [2026-07-30T10:30:34.681Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T10:34:31.298Z] **plan:done** — plan.md written
- [2026-07-30T10:36:14.503Z] **tests:done** — RED verified on test/parse-race-markdown.test.js, test/sync-races-to-jaina.test.js (exit=1)
- [2026-07-30T10:37:16.931Z] **build:c1** — tests green, committed
- [2026-07-30T10:39:53.871Z] **review:c1** — APPROVE
- [2026-07-30T10:42:09.871Z] **review:devils-advocate** — APPROVE
- [2026-07-30T10:42:18.758Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T10:42:19.150Z] **merge:done** — auto-merged bolt/cardgame-jaina-race-sync-dryrun into master (worktree)


## Receipt

```json
{
  "start_sha": "6c8f9220ef4de428671a89073b460a22f7d66fed",
  "end_sha": "283fcf2a2fac3fbebcab83a69a181500c92e4990",
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
      "held_out": true,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC5",
      "held_out": false,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-30T10:42:18.756Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-jaina-race-sync-dryrun\\plan.md`.\n\n**Summary:** GATE: none — this is a low-risk, mechanical repeat of the already-merged `parse-character-markdown.js`/`sync-characters-to-jaina.js` pattern, applied to `design/races/`. The plan specifies exact code for two new source files (`lib/parse-race-markdown.js`, `tools/sync-races-to-jaina.js`) and two new test files, verified against all 5 actual race markdown files (confirmed identical structure: H1 name, Identity, Strengths & Weaknesses with 1+2+2 categories, exactly 5 Signature Hooks, Visual Identity). The held-out AC3 (exact counts of 2/2/5) was checked against real file content and flagged as redundant with visible intent, not a spec bug.",
    "test_writer": "I need explicit permission to run the test suite. Could you approve running `node --test` (or the equivalent) so I can confirm the new tests fail red as expected?",
    "builder_c1": "Clean — only the two new files (`lib/parse-race-markdown.js`, `tools/sync-races-to-jaina.js`) were added; nothing under `test/` was touched. Full suite is green: 950 pass, 0 fail.",
    "reviewer_c1": "APPROVE",
    "devils_advocate": "I reviewed the diff against all 5 actual `design/races/*.md` files (not just the test fixtures) and the existing `lib/parse-card-markdown.js` slugify implementation to check for edge cases the first-cycle reviewer might have missed.\n\n**Attack attempted:**\n- Checked `slugify` byte-for-byte against `lib/parse-card-markdown.js` — identical.\n- Checked every regex (`SIGNATURE_HOOK_PATTERN`, `PRIMARY_STRENGTH_PATTERN`, section-title matchers) against the real em-dash (—), bullet, and heading formatting in all 5 race files — all match exactly, no silent-null or mis-parse cases.\n- Checked `loadAllRaces`' alphabetical sort produces the exact AC5-required order (cindral-reach, mireth-bloom, panoptic-concord, starweave-communion, wrought-assembly) — correct, and defensively sorted rather than relying on filesystem enumeration order.\n- Checked `tools/sync-races-to-jaina.js` for network/credential leakage — only requires the local parser, no `fetch`/`http`/`child_process`/`jaina-client`.\n- Checked CRLF handling (`\\r\\n` normalization, `\\s` consuming trailing `\\r`) — safe on this Windows checkout.\n- Checked exit-code/stderr handling for the no-flag path — `process.exitCode = 1` without `process.exit()`, message correctly goes to stderr and is captured by the AC4 test.\n- Looked for scope creep or untouched-file edits — diff is additive only (2 new lib/tool files + 2 new test files), nothing pre-existing touched.\n\nNo introduced defect survived — every field-extraction path was verified against the real content it will actually run against, not just the synthetic fixture in the test file.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
