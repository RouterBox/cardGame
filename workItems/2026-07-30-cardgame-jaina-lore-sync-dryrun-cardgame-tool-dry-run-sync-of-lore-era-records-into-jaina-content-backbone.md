# cardgame-jaina-lore-sync-dryrun: cardGame tool — dry-run sync of lore era records into Jaina (content backbone, slice 5)

## Header

- unit: cardgame-jaina-lore-sync-dryrun
- title: cardGame tool — dry-run sync of lore era records into Jaina (content backbone, slice 5)
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: b094d79ccbda8808e3a720be464cf6290c99b158
- end_sha: fba9f0de6ffea0a7a4f9e7136d4d7c3fb73b7294

## Intent

design/DESIGN-READINESS.md's Open Gap 4 names the hole directly: only card records (and, once their sibling proposals merge, character/race/star-atlas records) are wired to Jaina, while design/lore.md's 6-era chronicle remains markdown-only prose with no Jaina schema or sync path. This is the next narrow slice under the same 2026-07-28 ideas-inbox 'use Jaina as the content backbone' directive that produced cardgame-jaina-card-sync-dryrun (T1 discipline: no live write, lore eras only — not design/world.md's Cosmology/Founts content, which has a different section shape and is explicitly out of scope here, matching how the star-atlas proposal deferred both world.md and lore.md). Add lib/parse-lore-markdown.js, a shared parser mirroring lib/parse-card-markdown.js's conventions (reusing its exported slugify), that reads design/lore.md, locates the ordered era names inside the '## Timeline of Eras' numbered list, and then extracts one record per matching '##' era section (excluding '## Summary' and '## Timeline of Eras' themselves): name (the heading text, verbatim), slug (slugify(name)), order (the era's 1-based position in the Timeline of Eras list), and summary (the full prose text of that section — every paragraph between this heading and the next '##' heading or end of file, joined). tools/sync-lore-eras-to-jaina.js prints one JSON payload per record in --dry-run mode and, mirroring its sibling dry-run-only proposals, makes no live Jaina API calls in this unit — printing a 'not yet implemented' message and exiting 1 without --dry-run, so no credentials or network access are required by node --test. This is content-authoring tooling under the T16 partial software-gate opening, not game implementation.

## Acceptance Criteria

- AC1 [paraphrase]: node tools/sync-lore-eras-to-jaina.js --dry-run exits 0 and prints exactly 6 JSON objects, one per era heading in design/lore.md, in Timeline-of-Eras order: The Weave Age, The Sundering, The Long Dark, The Five Risings, The Cinderglass War, Current Era: The Uneasy Expanse
- AC2 [paraphrase]: Each printed record has name, slug, order, and summary fields; slug is computed with the identical slugify(name) function already exported by lib/parse-card-markdown.js, so the same era name produces the same slug anywhere else in the repo
- AC3 [inferred]: Each record's order field is its 1-based position in the '## Timeline of Eras' numbered list (The Weave Age is 1, Current Era: The Uneasy Expanse is 6), and order values across the 6 records are the unique integers 1 through 6 with no gaps or repeats
- AC4 [inferred] (held_out): Each record's summary field contains that era's own prose text only — it must not contain the literal heading text of any other era (no bleed-through from an adjacent section), and must be non-empty
- AC5 [inferred]: Without --dry-run, the script makes no Jaina API calls, no network access, and no credentials are required by node --test — it prints a message that live sync is not yet implemented for lore eras and exits 1; running the dry-run twice in a row against unchanged markdown produces byte-identical stdout output

## Plan

GATE: none

# Plan: cardgame-jaina-lore-sync-dryrun

## Summary

Add a parser for `design/lore.md`'s 6-era chronicle and a dry-run-only sync
tool that prints one JSON payload per era, mirroring the sibling
`cardgame-jaina-star-atlas-sync-dryrun` unit's shape
(`lib/parse-star-atlas-markdown.js` + `tools/sync-star-atlas-to-jaina.js`).
No live Jaina writes, no network access, no credentials required by
`node --test`. Four files, all new:

1. `lib/parse-lore-markdown.js` (new)
2. `tools/sync-lore-eras-to-jaina.js` (new)
3. `test/parse-lore-markdown.test.js` (new)
4. `test/sync-lore-eras-to-jaina.test.js` (new)

Do not touch `design/lore.md`, `design/DESIGN-READINESS.md`, or any other
existing file — this unit is additive only. (DESIGN-READINESS.md's Open Gap
3/4 text still says lore is "markdown-only" after this unit lands; updating
that doc is out of scope here, same as how the star-atlas sibling unit left
its own gap-doc line stale until a separate archival step.)

## Source shape being parsed (already verified in the repo)

`design/lore.md` has exactly this structure today:

- `# The Long Record — A Chronicle of the Amaranth Expanse` (H1, ignore)
- `## Summary` (H2 — exclude from records)
- `## Timeline of Eras` (H2 — exclude from records; contains the ordered
  numbered list that fixes each era's `order`)
- Six `## <Era Name>` H2 sections, in this exact file order, which is also
  the exact Timeline-of-Eras order:
  1. `## The Weave Age`
  2. `## The Sundering`
  3. `## The Long Dark`
  4. `## The Five Risings`
  5. `## The Cinderglass War`
  6. `## Current Era: The Uneasy Expanse`

The `## Timeline of Eras` section body is:

```
1. The Weave Age
2. The Sundering
3. The Long Dark
4. The Five Risings
5. The Cinderglass War
6. Current Era: The Uneasy Expanse
```

Each era's own prose body never contains another era's heading text
verbatim (capitalized, mid-sentence) — every cross-reference to another era
in the document uses a lowercase "the" (e.g. "the Weave Age", "the
Cinderglass War"), never the capitalized heading form ("The Weave Age").
This was verified by reading the full file; it's what makes held-out AC4
(no bleed-through) satisfiable by a straightforward case-sensitive substring
check. Do not modify `design/lore.md` to "fix" this — it already supports
the acceptance criteria as written.

Expected `slugify(name)` values (using `lib/parse-card-markdown.js`'s
existing algorithm — lowercase, non-`[a-z0-9]` runs collapsed to `-`, then
leading/trailing `-` stripped):

| name | slug | order |
|---|---|---|
| The Weave Age | `the-weave-age` | 1 |
| The Sundering | `the-sundering` | 2 |
| The Long Dark | `the-long-dark` | 3 |
| The Five Risings | `the-five-risings` | 4 |
| The Cinderglass War | `the-cinderglass-war` | 5 |
| Current Era: The Uneasy Expanse | `current-era-the-uneasy-expanse` | 6 |

(`"Current Era: The Uneasy Expanse"` → lowercase → `"current era: the
uneasy expanse"` → the space+colon+space between "Era" and "The" collapses
to a single `-` → `current-era-the-uneasy-expanse`.)

## File 1: `lib/parse-lore-markdown.js` (new file)

Mirrors `lib/parse-star-atlas-markdown.js`'s structure, but reuses
`slugify` directly from `lib/parse-card-markdown.js` instead of redefining
it locally (unit.md explicitly requires "reusing its exported slugify", a
stricter requirement than the star-atlas/race parsers, which each keep
their own duplicate copy).

Write exactly:

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');

const LORE_PATH = path.join(__dirname, '..', 'design', 'lore.md');

const SUMMARY_TITLE = 'Summary';
const TIMELINE_TITLE = 'Timeline of Eras';

// ---------------------------------------------------------------------------
// Markdown parsing — design/lore.md "## Summary / ## Timeline of Eras /
// one `##` section per era" convention. The Timeline of Eras list is the
// authoritative source of each era's 1-based `order`, independent of the
// era sections' own order in the file.
// ---------------------------------------------------------------------------

// Splits a markdown file into its `##` (level-2) heading sections, the same
// way lib/parse-race-markdown.js's splitIntoH2Sections does.
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

// Joins a section's non-blank lines into a single prose paragraph — the
// same blank-line-delimited convention lib/parse-race-markdown.js's
// extractParagraph uses.
function extractSummary(section) {
  const lines = section.lines.map((line) => line.trim()).filter((line) => line !== '');
  return lines.join(' ').trim();
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
      summary: extractSummary(section),
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

## File 2: `tools/sync-lore-eras-to-jaina.js` (new file)

Mirrors `tools/sync-star-atlas-to-jaina.js` exactly in shape. Write:

```js
#!/usr/bin/env node
'use strict';

const { loadAllEras } = require('../lib/parse-lore-markdown');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for lore eras in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'lore era' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(era) {
  return {
    name: era.name,
    slug: era.slug,
    order: era.order,
    summary: era.summary,
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

  const eras = loadAllEras();
  for (const era of eras) {
    console.log(JSON.stringify(buildRecord(era)));
  }
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
```

Note: `process.exitCode = 1` (not `process.exit(1)`), matching the
star-atlas sibling — this lets `main()` return normally while still failing
the process, and is what the AC4 test below relies on.

## File 3: `test/parse-lore-markdown.test.js` (new file)

Mirrors `test/parse-star-atlas-markdown.test.js`. Write:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-lore-markdown.js');
const CARD_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');

const ERA_NAMES = [
  'The Weave Age',
  'The Sundering',
  'The Long Dark',
  'The Five Risings',
  'The Cinderglass War',
  'Current Era: The Uneasy Expanse',
];
const ERA_SLUGS = [
  'the-weave-age',
  'the-sundering',
  'the-long-dark',
  'the-five-risings',
  'the-cinderglass-war',
  'current-era-the-uneasy-expanse',
];

test('AC2: lib/parse-lore-markdown.js exists and exports parseLoreMarkdown, slugify, and loadAllEras', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseLoreMarkdown, 'function', 'expected an exported parseLoreMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
  assert.strictEqual(typeof mod.loadAllEras, 'function', 'expected an exported loadAllEras function');
});

test('AC2: slugify is the identical function reused from lib/parse-card-markdown.js', () => {
  const mod = require(LIB_PATH);
  const cardParse = require(CARD_LIB_PATH);

  assert.strictEqual(mod.slugify, cardParse.slugify, 'expected the same slugify function reference to be re-exported, not a duplicate implementation');

  ERA_NAMES.forEach((name, i) => {
    assert.strictEqual(mod.slugify(name), ERA_SLUGS[i], `expected slugify("${name}") to be "${ERA_SLUGS[i]}"`);
  });
});

test('AC1/AC3: parseLoreMarkdown extracts one record per era from a well-formed sample, ordered by the Timeline of Eras list', () => {
  const { parseLoreMarkdown } = require(LIB_PATH);

  const markdown = `# Test Chronicle

## Summary

This is a summary paragraph that should not become an era record.

## Timeline of Eras

1. Era Alpha
2. Era Beta

## Era Beta

Beta's own prose, describing only Beta. It spans one paragraph.

## Era Alpha

Alpha's own prose, describing only Alpha. It spans one paragraph.
`;

  const eras = parseLoreMarkdown(markdown);
  assert.deepStrictEqual(eras, [
    {
      name: 'Era Alpha',
      slug: 'era-alpha',
      order: 1,
      summary: 'Alpha\'s own prose, describing only Alpha. It spans one paragraph.',
    },
    {
      name: 'Era Beta',
      slug: 'era-beta',
      order: 2,
      summary: 'Beta\'s own prose, describing only Beta. It spans one paragraph.',
    },
  ]);
});

test('AC1: loadAllEras returns exactly 6 records in Timeline-of-Eras order', () => {
  const { loadAllEras } = require(LIB_PATH);

  const eras = loadAllEras();
  assert.strictEqual(eras.length, 6, `expected exactly 6 eras, found ${eras.length}`);
  assert.deepStrictEqual(eras.map((e) => e.name), ERA_NAMES);
  assert.deepStrictEqual(eras.map((e) => e.slug), ERA_SLUGS);
  assert.deepStrictEqual(eras.map((e) => e.order), [1, 2, 3, 4, 5, 6]);
});

test('AC2: every loaded era carries exactly the 4 required fields with correct shapes', () => {
  const { loadAllEras, slugify } = require(LIB_PATH);

  const eras = loadAllEras();
  for (const era of eras) {
    assert.deepStrictEqual(
      Object.keys(era).sort(),
      ['name', 'order', 'slug', 'summary'],
      `expected record for "${era.name}" to carry exactly the 4 required fields`
    );
    assert.strictEqual(era.slug, slugify(era.name));
    assert.strictEqual(typeof era.order, 'number');
    assert.strictEqual(typeof era.summary, 'string');
    assert.ok(era.summary.length > 0, `expected non-empty summary for "${era.name}"`);
  }
});

test('AC3: order values are the unique integers 1..6 with no gaps or repeats', () => {
  const { loadAllEras } = require(LIB_PATH);

  const orders = loadAllEras().map((e) => e.order);
  assert.deepStrictEqual([...orders].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6]);
  assert.strictEqual(new Set(orders).size, 6, 'expected 6 unique order values');
});

test('AC4 (held out): no era summary contains the literal heading text of another era', () => {
  const { loadAllEras } = require(LIB_PATH);

  const eras = loadAllEras();
  for (const era of eras) {
    for (const other of eras) {
      if (other.name === era.name) continue;
      assert.ok(
        !era.summary.includes(other.name),
        `expected "${era.name}"'s summary not to contain the literal heading text of "${other.name}"`
      );
    }
  }
});
```

## File 4: `test/sync-lore-eras-to-jaina.test.js` (new file)

Mirrors `test/sync-star-atlas-to-jaina.test.js`. Write:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-lore-eras-to-jaina.js');

const ERA_NAMES = [
  'The Weave Age',
  'The Sundering',
  'The Long Dark',
  'The Five Risings',
  'The Cinderglass War',
  'Current Era: The Uneasy Expanse',
];
const ERA_SLUGS = [
  'the-weave-age',
  'the-sundering',
  'the-long-dark',
  'the-five-risings',
  'the-cinderglass-war',
  'current-era-the-uneasy-expanse',
];

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly 6 JSON objects, one per era
// heading in design/lore.md, in Timeline-of-Eras order.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints exactly 6 JSON objects, in Timeline-of-Eras order', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-lore-eras-to-jaina.js --dry-run` to exit 0');

  const lines = parseLines(stdout);
  assert.strictEqual(lines.length, 6, `expected exactly 6 JSON lines, got ${lines.length}`);

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  assert.deepStrictEqual(records.map((r) => r.name), ERA_NAMES);
});

// ---------------------------------------------------------------------------
// AC2: every printed record has exactly name/slug/order/summary; slug
// matches slugify(name) using the identical algorithm as
// lib/parse-card-markdown.js.
// ---------------------------------------------------------------------------

test('AC2: each record carries exactly the 4 required fields, and slug matches slugify(name)', () => {
  const { slugify } = require(path.join(REPO_ROOT, 'lib', 'parse-card-markdown.js'));
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.strictEqual(records.length, 6);
  for (const record of records) {
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      ['name', 'order', 'slug', 'summary'],
      `expected record for "${record.name}" to carry exactly the 4 required fields`
    );
    assert.strictEqual(
      record.slug,
      slugify(record.name),
      `expected slug "${record.slug}" for "${record.name}" to match slugify(name)`
    );
  }
});

// ---------------------------------------------------------------------------
// AC3: order is the 1-based Timeline-of-Eras position; 1..6 unique, no
// gaps or repeats.
// ---------------------------------------------------------------------------

test('AC3: order values are 1..6 in Timeline-of-Eras order with no gaps or repeats', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.deepStrictEqual(records.map((r) => r.order), [1, 2, 3, 4, 5, 6]);
  assert.strictEqual(records[0].name, 'The Weave Age');
  assert.strictEqual(records[0].order, 1);
  assert.strictEqual(records[5].name, 'Current Era: The Uneasy Expanse');
  assert.strictEqual(records[5].order, 6);
});

// ---------------------------------------------------------------------------
// AC4 (held out): no record's summary contains the literal heading text of
// any other era, and every summary is non-empty.
// ---------------------------------------------------------------------------

test('AC4 (held out): no record summary contains another era\'s literal heading text, and all are non-empty', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  for (const record of records) {
    assert.ok(record.summary.length > 0, `expected non-empty summary for "${record.name}"`);
    for (const other of records) {
      if (other.name === record.name) continue;
      assert.ok(
        !record.summary.includes(other.name),
        `expected "${record.name}"'s summary not to contain "${other.name}"`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// AC5: without --dry-run, the script makes no Jaina API calls, requires no
// network access or credentials, prints a "not yet implemented" message,
// and exits 1.
// ---------------------------------------------------------------------------

test('AC5: without --dry-run, exits 1 with a "not yet implemented" message and makes no network/subprocess calls', () => {
  let error;
  try {
    execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    error = err;
  }

  assert.ok(error, 'expected `node tools/sync-lore-eras-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(/not yet implemented/i.test(output), `expected a "not yet implemented" message, got: ${output}`);
  assert.ok(/lore eras?/i.test(output), `expected the message to mention lore eras, got: ${output}`);
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

test('AC5: node --test needs no JAINA_API_KEY / JAINA_PROJECT_ID to exercise the no-flag path', () => {
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

test('AC5: --dry-run slug order is the-weave-age .. current-era-the-uneasy-expanse', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));
  assert.deepStrictEqual(records.map((r) => r.slug), ERA_SLUGS);
});
```

## Expected outputs

Running `node tools/sync-lore-eras-to-jaina.js --dry-run` from the repo
root prints exactly 6 lines to stdout (one compact JSON object per line, no
pretty-printing) and exits 0. First and last lines look like:

```
{"name":"The Weave Age","slug":"the-weave-age","order":1,"summary":"Before there were civilizations to name it, ..."}
...
{"name":"Current Era: The Uneasy Expanse","slug":"current-era-the-uneasy-expanse","order":6,"summary":"The Uneasy Expanse is where the Amaranth Expanse stands now, ..."}
```

Running `node tools/sync-lore-eras-to-jaina.js` (no flag) prints to stderr:

```
Live sync to Jaina is not yet implemented for lore eras in this unit. Re-run with --dry-run to preview the record payloads a future live-sync step would write.
```

and exits with code 1.

Running the full suite:

```
node --test
```

should show all new tests passing (10 new tests across the two new test
files: 6 in `parse-lore-markdown.test.js`, plus however many are counted
individually in `sync-lore-eras-to-jaina.test.js` — 8 tests as written
above), with zero changes to any existing test's pass/fail status. No
`JAINA_API_KEY` / `JAINA_PROJECT_ID` env vars or network access are
required for any of it.

## Risk self-assessment (FIRE matrix)

- **Reversibility**: fully reversible — 4 new files, no edits to existing
  files, no schema/data changes, nothing deleted.
- **Security impact**: none — no network calls, no credential handling, no
  live Jaina writes (mirrors the sibling dry-run-only units).
- **User data**: none touched — this only reads a static markdown file
  already checked into the repo.
- **Schema changes**: none — this unit defines a payload shape in code
  comments/JSON only; it does not create or modify any actual Jaina schema
  (that's explicitly deferred to a future, non-dry-run unit, same as the
  star-atlas/card sibling units).

Net: low risk, GATE: none.

## Held-out AC discipline note

AC4 (held out) — "no bleed-through between era summaries" — is redundant
with the visible intent that each record's `summary` be that era's own
prose (AC2's "summary" field description, AC1's "one JSON object per era").
It is novel only in specifics (which exact substrings to check), not in
requirement. Verified during planning that `design/lore.md`'s existing prose
already satisfies this (see "Source shape" section above) — no spec bug to
flag.


## Findings

# Review: cardgame-jaina-lore-sync-dryrun (cycle 1)

## Scope

Diff adds exactly the 4 planned files, all new:
- `lib/parse-lore-markdown.js`
- `tools/sync-lore-eras-to-jaina.js`
- `test/parse-lore-markdown.test.js`
- `test/sync-lore-eras-to-jaina.test.js`

No existing file is touched (confirmed against the diff — no modifications to
`design/lore.md`, `design/DESIGN-READINESS.md`, or anything else). Matches the
plan's "additive only" constraint.

## AC-by-AC verification

**AC1** — `--dry-run` exits 0, prints exactly 6 JSON objects in Timeline-of-Eras order.
Verified `design/lore.md`'s actual heading structure (`grep -n "^#"`) is exactly
Summary / Timeline of Eras / 6 era `##` sections in the order the plan claims,
and each heading text matches its Timeline-of-Eras list entry verbatim. `main()`
in the tool prints one `JSON.stringify(buildRecord(era))` line per era from
`loadAllEras()`, which returns records sorted by `order`. Satisfied.

**AC2** — name/slug/order/summary fields; slug via the identical exported `slugify`.
`lib/parse-lore-markdown.js` imports `{ slugify } = require('./parse-card-markdown')`
and re-exports the same reference (not a re-implementation) — confirmed
`lib/parse-card-markdown.js`'s `slugify` is `.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')`,
identical algorithm assumed by the plan's slug table. `buildRecord` in the tool
emits exactly the 4 fields. Satisfied.

**AC3** — order is the 1-based Timeline-of-Eras position, 1..6 unique/no gaps.
`parseLoreMarkdown` computes `order` from `timelineOrder.indexOf(section.title) + 1`
(the Timeline-of-Eras list), not from file iteration order, then sorts by
`order` — so order is decoupled from section file-order as the code comment
states. Satisfied.

**AC5** — no `--dry-run` → no network/API calls, prints "not yet implemented"
message mentioning lore eras and `--dry-run`, exits 1; dry-run output is
deterministic/repeatable. `main()` takes the `!dryRun` branch straight to
`console.error(NOT_IMPLEMENTED_MESSAGE); process.exitCode = 1; return` — no
`fetch`, no `child_process`, no `jaina-client` import anywhere in the tool file.
Output has no timestamps/randomness so two consecutive dry-runs are
byte-identical. Satisfied.

## Held-out AC4 (no bleed-through) — checked anyway for quality

Manually verified against the live `design/lore.md`: every capitalized,
verbatim era heading string (e.g. `"The Cinderglass War"`) appears in the file
only within that era's own `##` section (its heading line + self-referencing
sentences), never inside another era's section body. Cross-references to other
eras in the prose consistently use the lowercase form (`"the Cinderglass War"`,
`"the Weave Age"`), exactly as the plan claims. This makes the case-sensitive
substring check in the test suite valid against the real file, not just the
synthetic AC1/AC3 fixture.

## Other notes (non-gating)

- `tools/sync-lore-eras-to-jaina.js` calls `main()` unconditionally at module
  scope (not guarded by `require.main === module`), so `require()`-ing this
  file as a library would trigger a live run as a side effect. This is a
  pre-existing convention copied verbatim from the sibling
  `tools/sync-star-atlas-to-jaina.js` (also unconditional `main()`), and no
  test in this diff `require()`s the tool directly — it only shells out via
  `execFileSync`. PRE-EXISTING pattern, not something this diff introduces
  net-new; not gating.
- Test suite is thorough: dry-run JSON shape/order/uniqueness, the no-flag exit
  code/message/no-network checks, credential-free `node --test` execution, and
  determinism (byte-identical repeat runs) are all directly exercised.

## Verdict

No INTRODUCED findings. All visible ACs (AC1, AC2, AC3, AC5) are satisfied by
the diff, and the held-out AC4 also checks out against the real `design/lore.md`.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T11:22:20.108Z] **bolt:start** — unit=cardgame-jaina-lore-sync-dryrun start_sha=b094d79ccbda8808e3a720be464cf6290c99b158 branch=bolt/cardgame-jaina-lore-sync-dryrun worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-jaina-lore-sync-dryrun
- [2026-07-30T11:22:29.484Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T11:26:45.582Z] **plan:done** — plan.md written
- [2026-07-30T11:28:20.176Z] **tests:done** — RED verified on test/parse-lore-markdown.test.js, test/sync-lore-eras-to-jaina.test.js (exit=1)
- [2026-07-30T11:29:21.167Z] **build:c1** — tests green, committed
- [2026-07-30T11:31:44.820Z] **review:c1** — APPROVE
- [2026-07-30T11:34:45.433Z] **review:devils-advocate** — APPROVE
- [2026-07-30T11:34:54.500Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T11:34:54.843Z] **merge:done** — auto-merged bolt/cardgame-jaina-lore-sync-dryrun into master (worktree)


## Receipt

```json
{
  "start_sha": "b094d79ccbda8808e3a720be464cf6290c99b158",
  "end_sha": "886effeefac30e7bcc63ae9695f171304d92ecbd",
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
    },
    {
      "id": "AC5",
      "held_out": false,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-30T11:34:54.498Z",
  "valid": true,
  "agent_reports": {
    "planner": "Verified the key risk (AC4 bleed-through) with a direct grep across `design/lore.md`: every literal capitalized era-heading match falls either in the excluded `## Summary`/`## Timeline of Eras` sections, or within that same era's own section body — never in another era's summary. The plan's parser design and tests hold up against the actual file.\n\nPlan written to `C:\\github\\AgentBox\\units\\cardgame-jaina-lore-sync-dryrun\\plan.md`:\n- `GATE: none` — additive-only, no live Jaina calls, no schema/data changes.\n- 4 new files specified with complete code: `lib/parse-lore-markdown.js` (reuses `slugify` directly from `lib/parse-card-markdown.js` per the spec's explicit requirement), `tools/sync-lore-eras-to-jaina.js` (dry-run/not-yet-implemented, mirroring `sync-star-atlas-to-jaina.js`), and matching test files for both.\n- Includes the exact expected slugs/order table, sample stdout, and a note on why held-out AC4 is satisfiable without touching `design/lore.md`.",
    "test_writer": "The test run requires interactive approval that isn't coming through — but I don't need it to verify RED status. Both test files `require()` `lib/parse-lore-markdown.js` and execute `tools/sync-lore-eras-to-jaina.js` directly, neither of which exists in `src/`-equivalent production paths (`lib/`, `tools/`) yet — confirmed via `ls` above (both \"No such file or directory\"). Every test will fail immediately on the `require`/`execFileSync` call, satisfying RED.\n\nSummary:\n- Wrote `test/parse-lore-markdown.test.js` (7 tests covering AC1–AC4) and `test/sync-lore-eras-to-jaina.test.js` (8 tests covering AC1–AC5), taken verbatim from the unit's plan.md.\n- No files under `lib/` or `tools/` (this repo's production-code paths) were created or modified.\n- Tests currently fail by construction: `lib/parse-lore-markdown.js` and `tools/sync-lore-eras-to-jaina.js` don't exist yet, so every test either throws on `require()` or gets a non-zero/missing-file error from `execFileSync`.",
    "builder_c1": "All 981 tests pass, 0 failures. Both new files (`lib/parse-lore-markdown.js`, `tools/sync-lore-eras-to-jaina.js`) implement the plan exactly as specified, and no test files were modified — the suite is green.",
    "reviewer_c1": "Findings written to `findings.md`. No introduced issues — the parser correctly derives `order` from the Timeline-of-Eras list (decoupled from file section order), reuses the identical `slugify` reference from `lib/parse-card-markdown.js`, and the dry-run/no-flag paths match all visible ACs. Cross-checked against the live `design/lore.md` and confirmed the held-out no-bleed-through AC also holds. One non-gating note: the tool's unconditional `main()` call is a pre-existing pattern copied from the sibling star-atlas tool, not introduced here.\n\nAPPROVE",
    "devils_advocate": "I reviewed the diff blind against the actual `design/lore.md` content (unchanged by this diff) to check whether the parser's real-world behavior matches the tests' expectations, rather than just trusting the tests in isolation.\n\nFindings from tracing the parser against the real file:\n- `splitIntoH2Sections` in `lib/parse-lore-markdown.js` is a byte-for-byte duplicate of the same function already exported by `lib/parse-race-markdown.js` (which itself says it \"mirrors `lib/parse-character-markdown.js`\"). The unit's intent only calls for reusing `slugify`, not the section-splitter, so this isn't a violation of stated intent — just a DRY smell with no concrete failure scenario (no divergence exists today; it's a future-maintenance risk at most, not a merge blocker).\n- I manually traced every cross-era mention of an era name in `design/lore.md` (e.g., \"The Long Dark\" section says \"after the Sundering,\" \"The Five Risings\" mentions \"the Sundering\" and \"the Cinderglass War,\" etc.) against the held-out AC4 check (`summary.includes(otherEra.name)`). Every cross-reference in the real prose uses lowercase \"the\" before the era name, while era names are stored capitalized (\"The Sundering\"), so the case-sensitive `.includes` check never trips. This looks deliberately safe in the underlying lore text (which this diff didn't touch), not a bug in the new code.\n- Heading/list regexes, order derivation from the Timeline-of-Eras list (independent of file order), slug re-export identity, exit-code handling for the no-flag path, and the \"no network/subprocess\" source checks all check out against the actual script and file content.\n\nI couldn't find an introduced defect with a real, reachable failure scenario — the closest candidate (duplicated `splitIntoH2Sections`) is a style nit, not something that breaks an AC or produces wrong output against real data.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
