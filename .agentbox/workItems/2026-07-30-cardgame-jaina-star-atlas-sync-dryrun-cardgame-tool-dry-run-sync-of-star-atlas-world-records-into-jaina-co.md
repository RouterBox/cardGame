# cardgame-jaina-star-atlas-sync-dryrun: cardGame tool — dry-run sync of star atlas world records into Jaina (content backbone, slice 4)

## Header

- unit: cardgame-jaina-star-atlas-sync-dryrun
- title: cardGame tool — dry-run sync of star atlas world records into Jaina (content backbone, slice 4)
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: ef933b69d9f5f9248635745796616122dc60adf5
- end_sha: 447372ce5939646e599f2a9455882f81949ec69f

## Intent

design/DESIGN-READINESS.md's Open Gap 4 names the hole directly: tools/sync-cards-to-jaina.js only syncs card records, and while the character and race slices are already in flight as open sibling proposals, design/star-atlas.md (5 Homeworld sections plus 3 Frontier & Contested World sections, 8 total) remains markdown-only prose with no Jaina schema or sync path. This is the next narrow slice under the same 2026-07-28 ideas-inbox 'use Jaina as the content backbone' directive that produced cardgame-jaina-card-sync-dryrun (T1 discipline: no live write, star atlas only, not world.md's or lore.md's free-form prose in the same shot — those need their own parsing approach and are explicitly left out of scope here). Add lib/parse-star-atlas-markdown.js, a shared parser mirroring lib/parse-card-markdown.js's conventions, that reads design/star-atlas.md and extracts one record per '###' section: name (the heading text before any em-dash), slug (the identical slugify algorithm already used by lib/parse-card-markdown.js), type ('homeworld' for the 5 sections under '## Homeworlds', 'frontier' for the 3 sections under '## Frontier & Contested Worlds'), race (the civilization named after the heading's em-dash for Homeworld sections, e.g. 'Ashkeel — Homeworld of the Cindral Reach' -> race 'Cindral Reach'; null for Frontier sections, which have no em-dash), and description (that section's prose paragraph). tools/sync-star-atlas-to-jaina.js prints one JSON payload per record in --dry-run mode and, mirroring the dry-run-only scope of its sibling proposals, makes no live Jaina API calls in this unit — printing a 'not yet implemented' message and exiting 1 without --dry-run, so no credentials or network access are required by node --test. This is content-authoring tooling under the T16 partial software-gate opening, not game implementation.

## Acceptance Criteria

- AC1 [paraphrase]: node tools/sync-star-atlas-to-jaina.js --dry-run exits 0 and prints exactly 8 JSON objects, one per '###' heading in design/star-atlas.md, in the same order they appear in the file (Ashkeel, Fenwreath, Vantaris, Ansareth, Corewright, Halvorne Junction, Kelmourn Drift, Tallowfen)
- AC2 [paraphrase]: Each printed record has name, slug, type, race, and description fields; slug is computed with the identical slugify(name) algorithm already used by lib/parse-card-markdown.js, so the same world name produces the same slug anywhere else in the repo
- AC3 [inferred] (held_out): The 5 records parsed from sections under '## Homeworlds' have type 'homeworld' and a race field matching the civilization named after the em-dash in that section's own heading (e.g. Ashkeel's race is 'Cindral Reach'); the 3 records parsed from sections under '## Frontier & Contested Worlds' have type 'frontier' and race null
- AC4 [inferred]: Without --dry-run, the script makes no Jaina API calls, no network access, and no credentials are required by node --test — it prints a message that live sync is not yet implemented for the star atlas and exits 1
- AC5 [inferred]: Running the dry-run twice in a row against unchanged markdown produces byte-identical stdout output (deterministic: no timestamps, no randomness, stable record ordering matching the file's own section order)

## Plan

GATE: none

# Plan: cardgame-jaina-star-atlas-sync-dryrun

## Summary

Add a shared parser (`lib/parse-star-atlas-markdown.js`) that reads
`design/star-atlas.md` and extracts one record per `###` world section (8
total: 5 Homeworlds + 3 Frontier & Contested Worlds), plus a dry-run-only
sync tool (`tools/sync-star-atlas-to-jaina.js`) that prints one JSON payload
per record. This exactly mirrors the already-landed sibling units for
characters and races (`lib/parse-race-markdown.js` /
`tools/sync-races-to-jaina.js`, and the character equivalents) — same
`slugify`, same dry-run/not-yet-implemented split, same test shape. No live
Jaina API calls, no network, no credentials, in this unit.

Risk self-assessment (FIRE): fully reversible (new files only, pure
read/parse/print, no writes anywhere), no security impact (no network, no
credentials touched), no user data involved, no schema changes (dry-run
print only, no Jaina API calls). Low risk — proceeding without a
confirmation gate.

Scope check: this unit is the same shape and size as the already-completed
`cardgame-jaina-race-sync-dryrun` sibling (one lib file, one tool file, two
test files). It fits in a single bolt.

## Source structure being parsed (already read, not to be modified)

`design/star-atlas.md` layout:

```
# The Star Atlas

(intro prose)

## Homeworlds

(intro prose)

### Ashkeel — Homeworld of the Cindral Reach

(one prose paragraph)

### Fenwreath — Homeworld of the Mireth Bloom

(one prose paragraph)

### Vantaris — Homeworld of the Panoptic Concord

(one prose paragraph)

### Ansareth — Homeworld of the Starweave Communion

(one prose paragraph)

### Corewright — Homeworld of the Wrought Assembly

(one prose paragraph)

## Frontier & Contested Worlds

(intro prose)

### Halvorne Junction

(one prose paragraph)

### Kelmourn Drift

(one prose paragraph)

### Tallowfen

(one prose paragraph)
```

Every `###` heading under `## Homeworlds` is `Name — Homeworld of the
<Race>` (em dash, U+2014). Every `###` heading under `## Frontier &
Contested Worlds` has no em dash — just a bare world name. This is the only
signal needed to derive `type` and `race`.

## File 1 (new): `lib/parse-star-atlas-markdown.js`

Mirrors `lib/parse-race-markdown.js`'s structure and comment style, but
needs to track which `##` parent a `###` section falls under (races doesn't
need this since one file = one record). Write exactly:

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const STAR_ATLAS_PATH = path.join(__dirname, '..', 'design', 'star-atlas.md');

const HOMEWORLDS_TITLE = 'Homeworlds';
const FRONTIER_TITLE = 'Frontier & Contested Worlds';

// ---------------------------------------------------------------------------
// Markdown parsing — design/star-atlas.md "## Homeworlds / ## Frontier &
// Contested Worlds, each holding `###` per-world sections" convention. One
// file holds all records (unlike lib/parse-race-markdown.js, where one file
// = one record) so, unlike splitIntoH2Sections in that file, each `###`
// section here must remember which `##` section it fell under.
// ---------------------------------------------------------------------------

// Splits a markdown file into its `###` (level-3) heading sections, the same
// way lib/parse-card-markdown.js's splitIntoH3Sections does, but additionally
// tags each section with the text of the nearest preceding `##` (level-2)
// heading, so callers can tell a Homeworlds world from a Frontier one.
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

// Joins a section's non-blank lines into a single prose paragraph — the same
// blank-line-delimited convention lib/parse-race-markdown.js's
// extractParagraph uses for the Identity / Visual Identity sections.
function extractParagraph(lines) {
  const trimmed = lines.map((line) => line.trim()).filter((line) => line !== '');
  const joined = trimmed.join(' ').trim();
  return joined || null;
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
      description: extractParagraph(section.lines),
    });
  }
  return worlds;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

Notes for the implementer:
- This is a brand-new file. Do not modify `lib/parse-card-markdown.js`,
  `lib/parse-race-markdown.js`, or `lib/parse-character-markdown.js`.
- `slugify` here is a byte-for-byte copy of the one in
  `lib/parse-card-markdown.js` — that identity is what AC2 tests.

## File 2 (new): `tools/sync-star-atlas-to-jaina.js`

Mirrors `tools/sync-races-to-jaina.js` exactly in shape. Write exactly:

```js
#!/usr/bin/env node
'use strict';

const { loadAllWorlds } = require('../lib/parse-star-atlas-markdown');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for the star atlas in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'star atlas' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(world) {
  return {
    name: world.name,
    slug: world.slug,
    type: world.type,
    race: world.race,
    description: world.description,
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

  const worlds = loadAllWorlds();
  for (const world of worlds) {
    console.log(JSON.stringify(buildRecord(world)));
  }
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
```

Notes for the implementer:
- No `require('node:https')`, no `fetch`, no `child_process`, no
  `lib/jaina-client.js` — this file must not need network or credentials, by
  design (that's what AC4 checks).
- Exit code: `process.exitCode = 1` (not `process.exit(1)`), matching the
  sibling tool's convention of letting node's event loop drain naturally.

## File 3 (new): `test/parse-star-atlas-markdown.test.js`

Unit tests for the lib, mirroring `test/parse-race-markdown.test.js`. Write
exactly:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-star-atlas-markdown.js');
const CARD_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');

test('AC2: lib/parse-star-atlas-markdown.js exists and exports parseStarAtlasMarkdown, slugify, and loadAllWorlds', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseStarAtlasMarkdown, 'function', 'expected an exported parseStarAtlasMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
  assert.strictEqual(typeof mod.loadAllWorlds, 'function', 'expected an exported loadAllWorlds function');
});

test('AC2: slugify matches lib/parse-card-markdown.js\'s existing algorithm', () => {
  const { slugify } = require(LIB_PATH);
  const { slugify: cardSlugify } = require(CARD_LIB_PATH);

  assert.strictEqual(slugify('Halvorne Junction'), 'halvorne-junction');
  assert.strictEqual(slugify('  Multiple   Spaces  '), 'multiple-spaces');

  const samples = ['Ashkeel', 'Fenwreath', 'Vantaris', 'Ansareth', 'Corewright', 'Halvorne Junction', 'Kelmourn Drift', 'Tallowfen'];
  for (const name of samples) {
    assert.strictEqual(slugify(name), cardSlugify(name), `expected slugify("${name}") to match the card parser's slugify`);
  }
});

test('AC1/AC2/AC3: parseStarAtlasMarkdown extracts a homeworld and a frontier record from a well-formed sample', () => {
  const { parseStarAtlasMarkdown } = require(LIB_PATH);

  const markdown = `# The Test Atlas

## Homeworlds

### Testhome — Homeworld of the Test Reach

Testhome is a paragraph describing the world in prose. It spans one
paragraph for testing purposes only.

## Frontier & Contested Worlds

### Testfrontier

Testfrontier is a frontier world used only to exercise the parser.
`;

  const worlds = parseStarAtlasMarkdown(markdown);
  assert.deepStrictEqual(worlds, [
    {
      name: 'Testhome',
      slug: 'testhome',
      type: 'homeworld',
      race: 'Test Reach',
      description: 'Testhome is a paragraph describing the world in prose. It spans one paragraph for testing purposes only.',
    },
    {
      name: 'Testfrontier',
      slug: 'testfrontier',
      type: 'frontier',
      race: null,
      description: 'Testfrontier is a frontier world used only to exercise the parser.',
    },
  ]);
});

test('AC1: loadAllWorlds returns exactly 8 records in file order with correct type/race per section', () => {
  const { loadAllWorlds } = require(LIB_PATH);

  const worlds = loadAllWorlds();
  assert.strictEqual(worlds.length, 8, `expected exactly 8 worlds, found ${worlds.length}`);

  assert.deepStrictEqual(
    worlds.map((w) => w.name),
    ['Ashkeel', 'Fenwreath', 'Vantaris', 'Ansareth', 'Corewright', 'Halvorne Junction', 'Kelmourn Drift', 'Tallowfen']
  );

  const homeworlds = worlds.slice(0, 5);
  const expectedRaces = ['Cindral Reach', 'Mireth Bloom', 'Panoptic Concord', 'Starweave Communion', 'Wrought Assembly'];
  homeworlds.forEach((world, i) => {
    assert.strictEqual(world.type, 'homeworld', `expected "${world.name}" to be type 'homeworld'`);
    assert.strictEqual(world.race, expectedRaces[i], `expected "${world.name}" race to be "${expectedRaces[i]}"`);
  });

  const frontierWorlds = worlds.slice(5);
  for (const world of frontierWorlds) {
    assert.strictEqual(world.type, 'frontier', `expected "${world.name}" to be type 'frontier'`);
    assert.strictEqual(world.race, null, `expected "${world.name}" race to be null`);
  }
});

test('AC2: every loaded world carries exactly the 5 required fields with correct shapes', () => {
  const { loadAllWorlds, slugify } = require(LIB_PATH);

  const worlds = loadAllWorlds();
  for (const world of worlds) {
    assert.deepStrictEqual(
      Object.keys(world).sort(),
      ['description', 'name', 'race', 'slug', 'type'],
      `expected record for "${world.name}" to carry exactly the 5 required fields`
    );
    assert.strictEqual(world.slug, slugify(world.name));
    assert.ok(['homeworld', 'frontier'].includes(world.type), `expected type to be 'homeworld' or 'frontier' for "${world.name}"`);
    assert.strictEqual(typeof world.description, 'string');
    assert.ok(world.description.length > 0, `expected non-empty description for "${world.name}"`);
  }
});
```

## File 4 (new): `test/sync-star-atlas-to-jaina.test.js`

Integration tests for the tool, mirroring
`test/sync-races-to-jaina.test.js`. This file independently re-derives the
expected records straight from `design/star-atlas.md` using the shared
`test/helpers/markdown.js` (`parseSections`), rather than importing
`lib/parse-star-atlas-markdown.js` — so a bug shared between the lib and the
tool doesn't also hide in the test. Write exactly:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-star-atlas-to-jaina.js');
const STAR_ATLAS_PATH = path.join(REPO_ROOT, 'design', 'star-atlas.md');

const HOMEWORLDS_TITLE = 'Homeworlds';
const FRONTIER_TITLE = 'Frontier & Contested Worlds';

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Independently derives the expected world records straight from
// design/star-atlas.md, mirroring the "## Homeworlds / ## Frontier &
// Contested Worlds, each holding `###` per-world sections" convention
// documented in the unit's plan — without depending on
// lib/parse-star-atlas-markdown.js itself.
function listExpectedWorlds() {
  const content = fs.readFileSync(STAR_ATLAS_PATH, 'utf8');
  const sections = parseSections(content);

  const worlds = [];
  let currentH2 = null;
  for (const section of sections) {
    if (section.level === 2) {
      currentH2 = section.title;
      continue;
    }
    if (section.level !== 3) continue;
    if (currentH2 !== HOMEWORLDS_TITLE && currentH2 !== FRONTIER_TITLE) continue;

    const match = section.title.match(/^(.+?)\s+—\s+(.+)$/);
    const name = match ? match[1].trim() : section.title.trim();
    const subtitle = match ? match[2].trim() : null;
    const type = currentH2 === HOMEWORLDS_TITLE ? 'homeworld' : 'frontier';
    const race = type === 'homeworld' && subtitle ? subtitle.replace(/^Homeworld of the\s+/, '').trim() : null;
    const description = section.lines.map((l) => l.trim()).filter(Boolean).join(' ').trim();

    worlds.push({ name, slug: slugify(name), type, race, description });
  }
  return worlds;
}

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly 8 JSON objects, one per `###`
// heading in design/star-atlas.md, in file order.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints exactly 8 JSON objects, one per world section', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-star-atlas-to-jaina.js --dry-run` to exit 0');

  const lines = parseLines(stdout);
  assert.strictEqual(lines.length, 8, `expected exactly 8 JSON lines, got ${lines.length}`);

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  const expected = listExpectedWorlds();
  assert.deepStrictEqual(
    records.map((r) => r.name),
    expected.map((r) => r.name)
  );
  assert.deepStrictEqual(
    records.map((r) => r.name),
    ['Ashkeel', 'Fenwreath', 'Vantaris', 'Ansareth', 'Corewright', 'Halvorne Junction', 'Kelmourn Drift', 'Tallowfen']
  );
});

// ---------------------------------------------------------------------------
// AC2: every printed record has exactly name/slug/type/race/description;
// slug matches slugify(name) using the identical algorithm as
// lib/parse-card-markdown.js.
// ---------------------------------------------------------------------------

test('AC2: each record carries exactly the 5 required fields, and slug matches slugify(name)', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.strictEqual(records.length, 8);
  for (const record of records) {
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      ['description', 'name', 'race', 'slug', 'type'],
      `expected record for "${record.name}" to carry exactly the 5 required fields`
    );
    assert.strictEqual(
      record.slug,
      slugify(record.name),
      `expected slug "${record.slug}" for "${record.name}" to match slugify(name)`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3 (held out): the 5 Homeworlds records have type 'homeworld' and race
// matching the civilization named after the heading's em-dash; the 3
// Frontier records have type 'frontier' and race null.
// ---------------------------------------------------------------------------

test('AC3: Homeworlds records are type homeworld with correct race; Frontier records are type frontier with race null', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));
  const expected = listExpectedWorlds();

  assert.strictEqual(records.length, expected.length);
  for (let i = 0; i < records.length; i++) {
    assert.strictEqual(records[i].type, expected[i].type, `type mismatch for "${records[i].name}"`);
    assert.strictEqual(records[i].race, expected[i].race, `race mismatch for "${records[i].name}"`);
    assert.strictEqual(records[i].description, expected[i].description, `description mismatch for "${records[i].name}"`);
  }

  const homeworldRecords = records.slice(0, 5);
  const expectedRaces = ['Cindral Reach', 'Mireth Bloom', 'Panoptic Concord', 'Starweave Communion', 'Wrought Assembly'];
  homeworldRecords.forEach((record, i) => {
    assert.strictEqual(record.type, 'homeworld');
    assert.strictEqual(record.race, expectedRaces[i]);
  });

  const frontierRecords = records.slice(5);
  for (const record of frontierRecords) {
    assert.strictEqual(record.type, 'frontier');
    assert.strictEqual(record.race, null);
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

  assert.ok(error, 'expected `node tools/sync-star-atlas-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(/not yet implemented/i.test(output), `expected a "not yet implemented" message, got: ${output}`);
  assert.ok(/star atlas/i.test(output), `expected the message to mention the star atlas, got: ${output}`);
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

test('AC5: --dry-run output order is ashkeel, fenwreath, vantaris, ansareth, corewright, halvorne-junction, kelmourn-drift, tallowfen', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.deepStrictEqual(
    records.map((r) => r.slug),
    ['ashkeel', 'fenwreath', 'vantaris', 'ansareth', 'corewright', 'halvorne-junction', 'kelmourn-drift', 'tallowfen']
  );
});
```

## Expected outputs

- `node tools/sync-star-atlas-to-jaina.js --dry-run` exits 0 and prints
  exactly 8 lines to stdout, each a JSON object like:
  ```json
  {"name":"Ashkeel","slug":"ashkeel","type":"homeworld","race":"Cindral Reach","description":"Ashkeel is a moon-sized ball of ore and slag ... every formal Assembly request to give it back."}
  ```
  ... and:
  ```json
  {"name":"Halvorne Junction","slug":"halvorne-junction","type":"frontier","race":null,"description":"Halvorne Junction is a wormhole-transit world with no permanent population ... neither side has ever fully controlled it since."}
  ```
- `node tools/sync-star-atlas-to-jaina.js` (no flag) prints to stderr:
  `Live sync to Jaina is not yet implemented for the star atlas in this unit. Re-run with --dry-run to preview the record payloads a future live-sync step would write.`
  and exits with code 1.
- `node --test` runs all four new test files (plus every pre-existing test
  file unmodified) and reports all passing, with no network calls and no
  `JAINA_API_KEY`/`JAINA_PROJECT_ID` required.

## Explicitly out of scope (per unit.md)

- `design/world.md` and `design/lore.md` free-form prose — not touched,
  need their own parsing approach per a future unit.
- Any live Jaina API call / `lib/jaina-client.js` usage for star atlas
  records — left for a future unit, same as the sibling character/race
  proposals.
- No changes to `tools/sync-cards-to-jaina.js`, `tools/sync-races-to-jaina.js`,
  `tools/sync-characters-to-jaina.js`, or any `lib/parse-*-markdown.js` file
  other than the new one.


## Findings

# Review: cardgame-jaina-star-atlas-sync-dryrun (cycle 1)

## Verification performed

Static trace of the diff against the actual (unmodified) `design/star-atlas.md`
and `lib/parse-card-markdown.js` in the worktree (dynamic `node --test`
execution was blocked by this session's command-approval gate, so correctness
was confirmed by manual trace + targeted `Grep` checks instead of running the
suite):

- `lib/parse-card-markdown.js`'s `slugify` (lines 98-103) is byte-for-byte
  identical to the new `slugify` in `lib/parse-star-atlas-markdown.js` — AC2's
  cross-file identity claim holds.
- `design/star-atlas.md` (untouched by this diff) has exactly 8 `###`
  sections: 5 under `## Homeworlds` (each titled `Name — Homeworld of the
  <Race>`), 3 under `## Frontier & Contested Worlds` (bare names, no em
  dash) — confirmed via `Grep`, including confirming the heading dash is the
  literal U+2014 em dash the parser's `NAME_SUBTITLE_PATTERN` (and the repo's
  own file) both use, so the split isn't silently failing on an en dash/hyphen
  lookalike.
- Traced `splitIntoH3SectionsWithParent` → `splitNameAndSubtitle` →
  `raceFromSubtitle` by hand against all 8 real headings: name/type/race come
  out exactly as AC1/AC2 (and the held-out AC3) require, in file order
  (Ashkeel, Fenwreath, Vantaris, Ansareth, Corewright, Halvorne Junction,
  Kelmourn Drift, Tallowfen).
- `## Homeworlds`' own intro prose (before the first `###`) is correctly
  dropped: `current` is `null` while at H2 depth, so those lines never
  attach to a world record.
- `test/sync-star-atlas-to-jaina.test.js` requires `./helpers/markdown`
  (`parseSections`) — verified this pre-existing shared test helper already
  exists in the repo (used by earlier sibling units), so this isn't a
  dangling reference introduced by this diff.
- `tools/sync-star-atlas-to-jaina.js` only requires
  `../lib/parse-star-atlas-markdown`; no network/`child_process`/`fetch`/
  `jaina-client` usage anywhere in the new tool file.
- No pre-existing file is modified by this diff (only 4 new files); no
  regression surface on other tests.

## AC coverage

- **AC1** (exits 0, prints exactly 8 JSON objects in file order) — met.
  Parser correctly extracts all 8 sections in document order; tool prints
  one `JSON.stringify` per line via `console.log`.
- **AC2** (name/slug/type/race/description fields; slug uses the identical
  `slugify` from `lib/parse-card-markdown.js`) — met, confirmed identical
  algorithm byte-for-byte.
- **AC4** (no `--dry-run` ⇒ no API/network calls, no credentials needed,
  "not yet implemented" message, exit 1) — met. `main()` takes the
  early-return branch, writes `NOT_IMPLEMENTED_MESSAGE` (mentions "not yet
  implemented", "star atlas", "--dry-run") to stderr, sets
  `process.exitCode = 1` (lets stdio flush before exit, no `process.exit()`
  truncation risk). No network-capable modules imported anywhere in the tool.
- **AC5** (deterministic, byte-identical repeat runs, stable file-order) —
  met. No timestamps/randomness; output is a pure function of the static
  `design/star-atlas.md` content re-read from disk each run.

(AC3 is explicitly held out of the visible AC list in the intent/plan and is
covered only by a held-out test — not gating this review.)

## Findings

None. No INTRODUCED defects found; nothing in the diff touches pre-existing
files.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T10:56:29.755Z] **bolt:start** — unit=cardgame-jaina-star-atlas-sync-dryrun start_sha=ef933b69d9f5f9248635745796616122dc60adf5 branch=bolt/cardgame-jaina-star-atlas-sync-dryrun worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-jaina-star-atlas-sync-dryrun
- [2026-07-30T10:56:40.054Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T11:00:07.654Z] **plan:done** — plan.md written
- [2026-07-30T11:02:22.741Z] **tests:done** — RED verified on test/parse-star-atlas-markdown.test.js, test/sync-star-atlas-to-jaina.test.js (exit=1)
- [2026-07-30T11:03:27.047Z] **build:c1** — tests green, committed
- [2026-07-30T11:06:28.279Z] **review:c1** — APPROVE
- [2026-07-30T11:08:37.737Z] **review:devils-advocate** — APPROVE
- [2026-07-30T11:08:46.862Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T11:08:47.200Z] **merge:done** — auto-merged bolt/cardgame-jaina-star-atlas-sync-dryrun into master (worktree)


## Receipt

```json
{
  "start_sha": "ef933b69d9f5f9248635745796616122dc60adf5",
  "end_sha": "20c23af8bbc3d397c55854348e77a575f016f6cf",
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
  "timestamp": "2026-07-30T11:08:46.860Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-jaina-star-atlas-sync-dryrun\\plan.md`.\n\nSummary: `GATE: none` (pure read/parse/print, no network, no schema changes, low risk). The plan mirrors the already-landed race/character sibling units exactly — new `lib/parse-star-atlas-markdown.js` (with a parent-H2-tracking `###` splitter to distinguish Homeworlds from Frontier sections, plus identical `slugify`), new `tools/sync-star-atlas-to-jaina.js` (dry-run print / not-yet-implemented exit-1 split), and two full test files covering all 5 ACs, with complete code for every file a junior would need to type in verbatim.",
    "test_writer": "The sandbox is gating actual `node` execution behind manual approval (only `node -v` went through), so I can't run the suite directly here — the harness will run its own RED check. Static verification confirms the tests will fail as required: `lib/parse-star-atlas-markdown.js` and `tools/sync-star-atlas-to-jaina.js` don't exist yet (only `tools/sync-races-to-jaina.js`, `sync-characters-to-jaina.js`, `sync-cards-to-jaina.js` and the sibling `lib/parse-*-markdown.js` files are present), so every `require(LIB_PATH)` / `execFileSync(node, [SCRIPT_PATH...])` call in the new tests will throw/exit non-zero.\n\nTwo test files written, touching only `test/`:\n- `test/parse-star-atlas-markdown.test.js` — unit tests for the not-yet-existing `lib/parse-star-atlas-markdown.js` (AC1, AC2)\n- `test/sync-star-atlas-to-jaina.test.js` — integration tests for the not-yet-existing `tools/sync-star-atlas-to-jaina.js` (AC1, AC2, AC3, AC4, AC5), independently re-deriving expected records from `design/star-atlas.md` via the existing `test/helpers/markdown.js` so the test doesn't share a bug with the lib.\n\nNo files under `lib/` or `tools/` were created or modified.",
    "builder_c1": "All 966 tests pass, 0 failures. The unit is implemented and green.",
    "reviewer_c1": "Findings written to `C:\\github\\AgentBox\\units\\cardgame-jaina-star-atlas-sync-dryrun\\findings.md`. Verified the parser logic by hand-tracing it against the actual `design/star-atlas.md` (unmodified by this diff) and confirmed `slugify` is byte-identical to `lib/parse-card-markdown.js`'s. All four visible ACs (AC1, AC2, AC4, AC5) are met with no introduced defects; the diff touches only new files.\n\nAPPROVE",
    "devils_advocate": "Traced the parser against the actual `design/star-atlas.md` content line-by-line (headings, em-dash splits, race extraction, paragraph joins) and everything lines up exactly with the ACs — 8 sections in the stated order, correct type/race assignment, deterministic paragraph joining, correct dry-run/no-flag exit codes and messaging. Confirmed the em-dash character used in the parser regex matches the one actually in the markdown file (not a lookalike en-dash/hyphen). Confirmed `test/helpers/markdown.js` and `lib/parse-race-markdown.js`/`lib/parse-character-markdown.js` referenced in comments already exist pre-diff, so no dangling references. Sandbox denied running `node --test` directly, but static tracing found no discrepancy between implementation and expected output.\n\nThe closest thing to a real concern is that the \"independent\" test derivation in `test/sync-star-atlas-to-jaina.test.js` reimplements the identical em-dash/prefix regexes and slugify algorithm rather than testing against a truly separate oracle — a shared-bug risk if the parsing convention were ever subtly wrong. But since I hand-verified the actual output against the real file content byte-for-byte and it's correct, this is a verification-design nitpick, not a concrete introduced failure scenario with wrong output today.\n\nNo INTRODUCED defect found that would cause an AC to fail or produce wrong output.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
