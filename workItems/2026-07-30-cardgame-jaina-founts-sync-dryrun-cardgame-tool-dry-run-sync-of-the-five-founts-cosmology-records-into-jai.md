# cardgame-jaina-founts-sync-dryrun: cardGame tool — dry-run sync of the Five Founts cosmology records into Jaina (content backbone, slice 6)

## Header

- unit: cardgame-jaina-founts-sync-dryrun
- title: cardGame tool — dry-run sync of the Five Founts cosmology records into Jaina (content backbone, slice 6)
- project: cardgame
- completed: 2026-07-30
- outcome: merged
- start_sha: 1372ce65c5a63818debbc11128c4c7f6ca364ead
- end_sha: 3b01fbf0c08b490d1aef309962906c8b1a4e7358

## Intent

design/DESIGN-READINESS.md's Open Gap 4 names the hole directly: tools/sync-cards-to-jaina.js only syncs card records, and while characters, races, the star atlas, and lore eras are already in flight as open sibling proposals, design/world.md's 'Cosmology: The Five Founts' section — the five currents (Mass, Bloom, Signal, Circuit, Tangle) every race, generator, and card Cost line in the game is built on — remains markdown-only prose with no Jaina schema or sync path. This is the next narrow slice under the same 2026-07-28 ideas-inbox 'use Jaina as the content backbone' directive that produced cardgame-jaina-card-sync-dryrun (T1 discipline: no live write, Founts only — not world.md's 'The Setting' or 'A History in Brief' sections, which are free-form narrative prose with no per-item structure and are explicitly out of scope, matching how the star-atlas and lore proposals each deferred non-parseable prose). Add lib/parse-founts-markdown.js, a shared parser mirroring lib/parse-card-markdown.js's conventions (reusing its exported slugify), that reads design/world.md, locates the '## Cosmology: The Five Founts' section, and extracts one record per '###' subheading inside it: name (the heading text after the em-dash, e.g. '### The Mass — materials' -> 'The Mass'), slug (slugify(name)), domain (the heading text after the em-dash, e.g. 'materials'), and description (that section's full prose paragraph, verbatim). tools/sync-founts-to-jaina.js prints one JSON payload per record in --dry-run mode and, mirroring its sibling dry-run-only proposals, makes no live Jaina API calls in this unit — printing a 'not yet implemented' message and exiting 1 without --dry-run, so no credentials or network access are required by node --test. This is content-authoring tooling under the T16 partial software-gate opening, not game implementation.

## Acceptance Criteria

- AC1 [paraphrase]: node tools/sync-founts-to-jaina.js --dry-run exits 0 and prints exactly 5 JSON objects, one per '###' heading inside design/world.md's 'Cosmology: The Five Founts' section, in file order: The Mass, The Bloom, The Signal, The Circuit, The Tangle
- AC2 [paraphrase]: Each printed record has name, slug, domain, and description fields; slug is computed with the identical slugify(name) function already exported by lib/parse-card-markdown.js, so the same Fount name produces the same slug anywhere else in the repo
- AC3 [inferred] (held_out): Each record's domain field matches the word(s) after the em-dash in that Fount's own heading (The Mass -> 'materials', The Bloom -> 'biology', The Signal -> 'intelligence', The Circuit -> 'technology', The Tangle -> 'magic'), and description is non-empty and does not contain the literal heading text of any other Fount (no bleed-through from an adjacent section)
- AC4 [inferred]: Without --dry-run, the script makes no Jaina API calls, no network access, and no credentials are required by node --test — it prints a message that live sync is not yet implemented for Founts and exits 1
- AC5 [inferred]: Running the dry-run twice in a row against unchanged markdown produces byte-identical stdout output (deterministic: no timestamps, no randomness, stable record ordering matching the section's own heading order)

## Plan

GATE: none

# Plan: cardgame-jaina-founts-sync-dryrun

## Summary

Add a Founts parser + dry-run-only sync tool for `design/world.md`'s
"Cosmology: The Five Founts" section, mirroring the already-merged sibling
units for cards/characters/races/star-atlas/lore. Two new files, two new
test files. No existing file is modified. No live Jaina API calls, no
network access, no credentials required by `node --test`.

This unit is right-sized for one bolt: two small new files + two test
files, following an extremely well-established in-repo pattern (5 prior
sibling `parse-*-markdown.js` / `sync-*-to-jaina.js` pairs already exist).
No split needed.

## Risk self-assessment (FIRE matrix)

- **Reversibility**: trivial. New files only; deleting them fully reverts.
- **Security impact**: none. No network calls, no `fetch`, no
  `child_process`, no dependency on `lib/jaina-client.js`. The no-flag path
  prints a message and exits 1.
- **User data**: none touched. Reads a static markdown file already in the
  repo; writes nothing.
- **Schema changes**: none. This unit does not create or touch any live
  Jaina schema — it only prints a JSON preview of what a future live-sync
  step would send.

GATE: none — this is a narrow, low-risk, precedented slice.

## Held-out criteria discipline

AC3 (held out) asks that `domain` match the em-dash text in each Fount's
own heading, and that `description` be non-empty with no bleed-through from
an adjacent section. This is fully redundant with the visible intent
("domain (the heading text after the em-dash...)" and "description (that
section's full prose paragraph, verbatim)" are both stated in the unit's
Intent paragraph) — it is novel only in pinning down the specific expected
domain values (materials/biology/intelligence/technology/magic) and adding
an explicit no-bleed-through check. Not a spec bug; plan accordingly (the
implementation below satisfies it by construction, since each `###` section's
`lines` are bounded by the next heading of any level).

## Source material (read-only — do not modify)

`design/world.md`'s relevant section (confirmed via `Grep ^##`):

```
15:## Cosmology: The Five Founts
19:### The Mass — materials
23:### The Bloom — biology
27:### The Signal — intelligence
31:### The Circuit — technology
35:### The Tangle — magic
```

Each `###` section is exactly one non-blank prose line (no soft-wrapping in
the source file), so `description` is that line, trimmed, verbatim —
including any inline `*emphasis*` markers inside it (do NOT strip markdown
emphasis; the spec says "verbatim").

Sibling files already in the repo that this unit must mirror exactly:

- `lib/parse-star-atlas-markdown.js` — same shape of problem (one file, one
  `##` holds many `###` records, each `###` tagged with its parent `##`).
  Use its `splitIntoH3SectionsWithParent` helper as the direct template.
- `lib/parse-lore-markdown.js` — the pattern for **reusing** (not
  reimplementing) `slugify` via
  `const { slugify } = require('./parse-card-markdown');` and re-exporting
  the same function reference. The unit's Intent explicitly says "reusing
  its exported slugify", so follow lore's reuse pattern, not star-atlas's
  (star-atlas duplicates its own local `slugify` — do not copy that part of
  it).
- `tools/sync-star-atlas-to-jaina.js` / `tools/sync-lore-eras-to-jaina.js` —
  direct template for the sync tool's `--dry-run` / not-yet-implemented
  shape.
- `test/sync-star-atlas-to-jaina.test.js`, `test/parse-star-atlas-markdown.test.js`,
  `test/sync-lore-eras-to-jaina.test.js`, `test/parse-lore-markdown.test.js`,
  `test/helpers/markdown.js` — direct templates for the two new test files.

## File 1 (create): `lib/parse-founts-markdown.js`

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { slugify } = require('./parse-card-markdown');

const WORLD_PATH = path.join(__dirname, '..', 'design', 'world.md');

const FOUNTS_SECTION_TITLE = 'Cosmology: The Five Founts';

// ---------------------------------------------------------------------------
// Markdown parsing — design/world.md's single "## Cosmology: The Five
// Founts" section holding one `###` per Fount. Mirrors
// lib/parse-star-atlas-markdown.js's splitIntoH3SectionsWithParent, since
// one file holds all records and each `###` section must remember which
// `##` section it fell under.
// ---------------------------------------------------------------------------

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

// "The Mass — materials" -> { name: 'The Mass', domain: 'materials' }. Split
// on the em dash (U+2014), the same way
// lib/parse-star-atlas-markdown.js's splitNameAndSubtitle does.
const NAME_DOMAIN_PATTERN = /^(.+?)\s+—\s+(.+)$/;

function splitNameAndDomain(heading) {
  const match = heading.match(NAME_DOMAIN_PATTERN);
  if (!match) return { name: heading.trim(), domain: null };
  return { name: match[1].trim(), domain: match[2].trim() };
}

// Joins a section's non-blank lines into a single prose paragraph — the
// same blank-line-delimited convention lib/parse-race-markdown.js's
// extractParagraph uses.
function extractParagraph(lines) {
  const trimmed = lines.map((line) => line.trim()).filter((line) => line !== '');
  const joined = trimmed.join(' ').trim();
  return joined || null;
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
      description: extractParagraph(section.lines),
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

Notes for the junior implementing this:

- `slugify` here MUST be the same function reference imported from
  `./parse-card-markdown`, not a re-implemented copy — `module.exports`
  re-exports the destructured import directly. This is what lets a test
  assert `mod.slugify === require('../lib/parse-card-markdown').slugify`.
- Do not strip the `*cultivate*` inline emphasis inside The Bloom's
  paragraph — descriptions must be verbatim.

## File 2 (create): `tools/sync-founts-to-jaina.js`

```js
#!/usr/bin/env node
'use strict';

const { loadAllFounts } = require('../lib/parse-founts-markdown');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for Founts in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'fount' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(fount) {
  return {
    name: fount.name,
    slug: fount.slug,
    domain: fount.domain,
    description: fount.description,
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

  const founts = loadAllFounts();
  for (const fount of founts) {
    console.log(JSON.stringify(buildRecord(fount)));
  }
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
```

This is a byte-for-byte structural copy of
`tools/sync-lore-eras-to-jaina.js` / `tools/sync-star-atlas-to-jaina.js`
with the entity renamed to "Founts" and the record shape swapped to
name/slug/domain/description. Keep `console.error` (stderr) + `process.exitCode = 1`
for the not-implemented path, and `console.log` (stdout) per record for
`--dry-run` — matches every sibling script and is what the AC4 test's
stdout/stderr split checks rely on.

## File 3 (create): `test/parse-founts-markdown.test.js`

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-founts-markdown.js');
const CARD_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');

const FOUNT_NAMES = ['The Mass', 'The Bloom', 'The Signal', 'The Circuit', 'The Tangle'];
const FOUNT_SLUGS = ['the-mass', 'the-bloom', 'the-signal', 'the-circuit', 'the-tangle'];
const FOUNT_DOMAINS = ['materials', 'biology', 'intelligence', 'technology', 'magic'];

test('AC2: lib/parse-founts-markdown.js exists and exports parseFountsMarkdown, slugify, and loadAllFounts', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseFountsMarkdown, 'function', 'expected an exported parseFountsMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
  assert.strictEqual(typeof mod.loadAllFounts, 'function', 'expected an exported loadAllFounts function');
});

test('AC2: slugify is the identical function reused from lib/parse-card-markdown.js', () => {
  const mod = require(LIB_PATH);
  const cardParse = require(CARD_LIB_PATH);

  assert.strictEqual(
    mod.slugify,
    cardParse.slugify,
    'expected the same slugify function reference to be re-exported, not a duplicate implementation'
  );

  FOUNT_NAMES.forEach((name, i) => {
    assert.strictEqual(mod.slugify(name), FOUNT_SLUGS[i], `expected slugify("${name}") to be "${FOUNT_SLUGS[i]}"`);
  });
});

test('AC1/AC2/AC3: parseFountsMarkdown extracts one record per Fount from a well-formed sample, ignoring non-Founts sections', () => {
  const { parseFountsMarkdown } = require(LIB_PATH);

  const markdown = `# Test World

## The Setting

Free-form prose that should never be mistaken for a Fount record.

## Cosmology: The Five Founts

Intro prose for the cosmology section itself.

### Test Alpha — alpha-domain

Alpha's own prose, describing only Alpha. It spans one paragraph.

### Test Beta — beta-domain

Beta's own prose, describing only Beta. It spans one paragraph.

## A History in Brief

### Not A Fount

This heading is a \`###\` under a non-Founts \`##\` section and must be ignored.
`;

  const founts = parseFountsMarkdown(markdown);
  assert.deepStrictEqual(founts, [
    {
      name: 'Test Alpha',
      slug: 'test-alpha',
      domain: 'alpha-domain',
      description: "Alpha's own prose, describing only Alpha. It spans one paragraph.",
    },
    {
      name: 'Test Beta',
      slug: 'test-beta',
      domain: 'beta-domain',
      description: "Beta's own prose, describing only Beta. It spans one paragraph.",
    },
  ]);
});

test('AC1: loadAllFounts returns exactly 5 records in file order', () => {
  const { loadAllFounts } = require(LIB_PATH);

  const founts = loadAllFounts();
  assert.strictEqual(founts.length, 5, `expected exactly 5 Founts, found ${founts.length}`);
  assert.deepStrictEqual(founts.map((f) => f.name), FOUNT_NAMES);
  assert.deepStrictEqual(founts.map((f) => f.slug), FOUNT_SLUGS);
  assert.deepStrictEqual(founts.map((f) => f.domain), FOUNT_DOMAINS);
});

test('AC2: every loaded Fount carries exactly the 4 required fields with correct shapes', () => {
  const { loadAllFounts, slugify } = require(LIB_PATH);

  const founts = loadAllFounts();
  for (const fount of founts) {
    assert.deepStrictEqual(
      Object.keys(fount).sort(),
      ['description', 'domain', 'name', 'slug'],
      `expected record for "${fount.name}" to carry exactly the 4 required fields`
    );
    assert.strictEqual(fount.slug, slugify(fount.name));
    assert.strictEqual(typeof fount.domain, 'string');
    assert.ok(fount.domain.length > 0, `expected non-empty domain for "${fount.name}"`);
    assert.strictEqual(typeof fount.description, 'string');
    assert.ok(fount.description.length > 0, `expected non-empty description for "${fount.name}"`);
  }
});

test('AC3 (held out): no Fount description contains the literal heading text of another Fount', () => {
  const { loadAllFounts } = require(LIB_PATH);

  const founts = loadAllFounts();
  for (const fount of founts) {
    for (const other of founts) {
      if (other.name === fount.name) continue;
      assert.ok(
        !fount.description.includes(other.name),
        `expected "${fount.name}"'s description not to contain the literal heading text of "${other.name}"`
      );
    }
  }
});
```

## File 4 (create): `test/sync-founts-to-jaina.test.js`

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseSections } = require('./helpers/markdown');

const REPO_ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(REPO_ROOT, 'tools', 'sync-founts-to-jaina.js');
const WORLD_PATH = path.join(REPO_ROOT, 'design', 'world.md');

const FOUNTS_SECTION_TITLE = 'Cosmology: The Five Founts';

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Independently derives the expected Fount records straight from
// design/world.md, mirroring the "## Cosmology: The Five Founts, each
// holding `###` per-Fount sections" convention documented in the unit's
// plan — without depending on lib/parse-founts-markdown.js itself.
function listExpectedFounts() {
  const content = fs.readFileSync(WORLD_PATH, 'utf8');
  const sections = parseSections(content);

  const founts = [];
  let currentH2 = null;
  for (const section of sections) {
    if (section.level === 2) {
      currentH2 = section.title;
      continue;
    }
    if (section.level !== 3) continue;
    if (currentH2 !== FOUNTS_SECTION_TITLE) continue;

    const match = section.title.match(/^(.+?)\s+—\s+(.+)$/);
    const name = match ? match[1].trim() : section.title.trim();
    const domain = match ? match[2].trim() : null;
    const description = section.lines.map((l) => l.trim()).filter(Boolean).join(' ').trim();

    founts.push({ name, slug: slugify(name), domain, description });
  }
  return founts;
}

function runDryRun() {
  return execFileSync('node', [SCRIPT_PATH, '--dry-run'], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseLines(stdout) {
  return stdout.split('\n').filter((line) => line.trim() !== '');
}

// ---------------------------------------------------------------------------
// AC1: --dry-run exits 0 and prints exactly 5 JSON objects, one per `###`
// heading in design/world.md's Founts section, in file order.
// ---------------------------------------------------------------------------

test('AC1: --dry-run exits 0 and prints exactly 5 JSON objects, one per Fount section', () => {
  let stdout;
  assert.doesNotThrow(() => {
    stdout = runDryRun();
  }, 'expected `node tools/sync-founts-to-jaina.js --dry-run` to exit 0');

  const lines = parseLines(stdout);
  assert.strictEqual(lines.length, 5, `expected exactly 5 JSON lines, got ${lines.length}`);

  const records = lines.map((line, i) => {
    let record;
    assert.doesNotThrow(() => {
      record = JSON.parse(line);
    }, `expected line ${i + 1} to be valid JSON: ${line}`);
    return record;
  });

  const expected = listExpectedFounts();
  assert.deepStrictEqual(
    records.map((r) => r.name),
    expected.map((r) => r.name)
  );
  assert.deepStrictEqual(
    records.map((r) => r.name),
    ['The Mass', 'The Bloom', 'The Signal', 'The Circuit', 'The Tangle']
  );
});

// ---------------------------------------------------------------------------
// AC2: every printed record has exactly name/slug/domain/description; slug
// matches slugify(name) using the identical algorithm as
// lib/parse-card-markdown.js.
// ---------------------------------------------------------------------------

test('AC2: each record carries exactly the 4 required fields, and slug matches slugify(name)', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.strictEqual(records.length, 5);
  for (const record of records) {
    assert.deepStrictEqual(
      Object.keys(record).sort(),
      ['description', 'domain', 'name', 'slug'],
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
// AC3 (held out): domain matches the word(s) after the em-dash in that
// Fount's own heading; description is non-empty and contains no
// bleed-through from an adjacent Fount's heading text.
// ---------------------------------------------------------------------------

test('AC3: domain matches the heading em-dash text, and description has no cross-Fount bleed-through', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));
  const expected = listExpectedFounts();

  assert.strictEqual(records.length, expected.length);
  for (let i = 0; i < records.length; i++) {
    assert.strictEqual(records[i].domain, expected[i].domain, `domain mismatch for "${records[i].name}"`);
    assert.strictEqual(records[i].description, expected[i].description, `description mismatch for "${records[i].name}"`);
  }

  const expectedDomains = ['materials', 'biology', 'intelligence', 'technology', 'magic'];
  records.forEach((record, i) => {
    assert.strictEqual(record.domain, expectedDomains[i]);
  });

  for (const record of records) {
    assert.ok(record.description.length > 0, `expected non-empty description for "${record.name}"`);
    for (const other of records) {
      if (other.name === record.name) continue;
      assert.ok(
        !record.description.includes(other.name),
        `expected "${record.name}"'s description not to contain "${other.name}"`
      );
    }
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

  assert.ok(error, 'expected `node tools/sync-founts-to-jaina.js` (no flag) to exit non-zero');
  assert.strictEqual(error.status, 1, `expected exit code 1, got ${error.status}`);

  const output = `${error.stdout || ''}${error.stderr || ''}`;
  assert.ok(/not yet implemented/i.test(output), `expected a "not yet implemented" message, got: ${output}`);
  assert.ok(/founts/i.test(output), `expected the message to mention Founts, got: ${output}`);
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

test('AC5: --dry-run output order is the-mass, the-bloom, the-signal, the-circuit, the-tangle', () => {
  const stdout = runDryRun();
  const records = parseLines(stdout).map((line) => JSON.parse(line));

  assert.deepStrictEqual(
    records.map((r) => r.slug),
    ['the-mass', 'the-bloom', 'the-signal', 'the-circuit', 'the-tangle']
  );
});
```

## Expected outputs

### `node tools/sync-founts-to-jaina.js --dry-run`

Exits 0. Prints exactly 5 lines to stdout, one JSON object per line, in this
exact order (verified against the current `design/world.md` content read
during planning — reconfirm against the file at implementation time in case
it has since changed):

```
{"name":"The Mass","slug":"the-mass","domain":"materials","description":"The Mass is the oldest and least glamorous of the Founts: the simple, stubborn fact that matter exists and can be bent to a purpose. It is ore that wants to be armor, rock that wants to be a hull, a dead star's core that wants to be a weapon. Civilizations that listen closely to the Mass build things that last — hulls that shrug off void-frost, blades that don't dull, factories that outlive the wars they were built to win. The Mass has no opinions and no cleverness; it simply endures, which is its own kind of power and its own kind of limitation."}
{"name":"The Bloom","slug":"the-bloom","domain":"biology","description":"The Bloom is the current of things that grow, adapt, and refuse to stay dead. Where the Mass gives you a hull, the Bloom gives you a hull that heals, or better, a hull that was never a hull at all but something that grew into the shape of one. Civilizations attuned to the Bloom don't build so much as *cultivate* — they seed a battlefield and come back later to harvest whatever it became. The Bloom answers threats by mutating past them, which makes it nearly impossible to out-plan and disturbingly easy to out-think, if you're patient enough to find the pattern underneath the growth."}
{"name":"The Signal","slug":"the-signal","domain":"intelligence","description":"The Signal is the current of pattern, prediction, and knowing things a moment before they happen. It runs through every archive, every sensor net, every trade contract with fine print nobody else read closely enough. Civilizations that draw on the Signal rarely win by force; they win by already being three moves ahead, by knowing the price of a thing before the seller does, by turning an enemy's own plan into the weapon that beats them. The Signal is devastating against anything that follows a fixed shape — and nearly useless against a threat too blunt, too alive, or too fast to be predicted at all."}
{"name":"The Circuit","slug":"the-circuit","domain":"technology","description":"The Circuit is the current of the made thing that keeps making more of itself: the self-assembling factory, the drone that repairs the drone that built it, the artifact whose instructions are baked into its own architecture. Civilizations that master the Circuit turn a single working idea into an army of identical, tireless copies. Its gift is scale without fatigue; its curse is that it can only ever be as clever as its last update — a Circuit-built force that meets something genuinely unpredictable can find every one of its perfect copies wrong in exactly the same way."}
{"name":"The Tangle","slug":"the-tangle","domain":"magic","description":"The Tangle is the current nobody can fully explain, not even the civilizations that live inside it: the thread connecting cause to effect that can, with enough will, be tied differently. It is the Fount closest to whatever the First Weave actually were, and the one most likely to still be watching. Civilizations that draw on the Tangle don't obey the Expanse's ordinary rules of distance, sequence, or probability so much as negotiate with them. The Tangle can undo a plan that was already perfect — and it is, in exactly the moments that matter, the least reliable current of all."}
```

### `node tools/sync-founts-to-jaina.js` (no flag)

Exits 1. Prints to stderr:

```
Live sync to Jaina is not yet implemented for Founts in this unit. Re-run with --dry-run to preview the record payloads a future live-sync step would write.
```

### `node --test`

All existing tests continue to pass unmodified (no existing file is
touched). The two new test files add ~15-20 passing tests covering AC1-AC5.
Final summary line reads `# pass <N>` with `# fail 0`, where N is the prior
total plus the new tests.

## Implementation order

1. Create `lib/parse-founts-markdown.js` (File 1).
2. Create `tools/sync-founts-to-jaina.js` (File 2).
3. Create `test/parse-founts-markdown.test.js` (File 3).
4. Create `test/sync-founts-to-jaina.test.js` (File 4).
5. Run `node --test` from the repo root and confirm all tests pass,
   including the two new files.
6. Manually run `node tools/sync-founts-to-jaina.js --dry-run` and diff
   against the "Expected outputs" block above.
7. Manually run `node tools/sync-founts-to-jaina.js` (no flag) and confirm
   exit code 1 + stderr message.

Do not modify `design/world.md`, `lib/parse-card-markdown.js`, or any other
existing file — this unit is additive only.


## Findings

# Blind Review — cardgame-jaina-founts-sync-dryrun, cycle 1

## Scope

Diff adds two new files (`lib/parse-founts-markdown.js`,
`tools/sync-founts-to-jaina.js`) and two new test files. No existing file
is modified. Reviewed against the spec, plan.md, and by reading the actual
`design/world.md` content and the sibling files this unit is required to
mirror (`lib/parse-star-atlas-markdown.js`, `lib/parse-card-markdown.js`).

Note: shell execution of `node --test` was blocked by the sandbox in this
review session ("This command requires approval"), so correctness was
verified by static trace against the real `design/world.md` bytes rather
than by executing the suite. Traced by hand:

- Confirmed `design/world.md`'s heading structure exactly matches what the
  parser expects (`## Cosmology: The Five Founts` at line 15, five `###`
  children at lines 19/23/27/31/35, each `Name — domain` using the same
  U+2014 em dash byte sequence, `cat -A`-verified, as the parser's
  `NAME_DOMAIN_PATTERN` regex literal).
- Confirmed `slugify` is imported and re-exported by reference from
  `lib/parse-card-markdown.js` (not reimplemented) and its algorithm
  produces the exact slugs asserted in the tests (`the-mass`, `the-bloom`,
  etc.).
- Confirmed each Fount's paragraph is a single non-blank line bounded by
  blank lines and the next heading, so `extractParagraph` yields exactly
  one verbatim paragraph per record, with no bleed from the section's own
  intro prose (which sits before any `###` and is correctly dropped since
  `current` is `null` there) and no bleed from adjacent Founts (grep of
  capitalized "The X" names across the section shows each only appears
  within its own heading + paragraph block; cross-references to other
  Founts inside prose are consistently lowercase, e.g. "the Mass gives you
  a hull" inside The Bloom's paragraph — not "The Mass" — so the AC3
  no-bleed-through substring check does not false-positive).
- `splitIntoH3SectionsWithParent` in the new lib file is a verbatim copy of
  the same helper in `lib/parse-star-atlas-markdown.js`, as the plan
  directed.
- `tools/sync-founts-to-jaina.js` makes no network/subprocess/`jaina-client`
  calls; the no-flag path sets `process.exitCode = 1` and prints the
  not-yet-implemented message to stderr before returning — matches AC4.
- The sync test file independently re-derives expected records from
  `design/world.md` via `test/helpers/markdown.js` (pre-existing, unmodified
  helper) rather than depending on the library under test, which is good
  test hygiene — AC1/AC2/AC3 assertions aren't circular.

## AC coverage

- **AC1** (dry-run exits 0, exactly 5 JSON objects in file order: Mass,
  Bloom, Signal, Circuit, Tangle) — satisfied. Verified via direct
  inspection of `design/world.md` heading order and the parser logic.
- **AC2** (name/slug/domain/description fields; slug via the shared,
  identical `slugify`) — satisfied. Reference-identity test
  (`mod.slugify === cardParse.slugify`) plus field-shape assertions cover
  this.
- **AC4** (no `--dry-run` ⇒ no API/network calls, no credentials needed,
  "not yet implemented" message, exit 1) — satisfied. No `fetch`,
  `child_process`, or `jaina-client` reference anywhere in the new tool
  file; verified by both source-grep tests and behavioral tests with
  `JAINA_API_KEY`/`JAINA_PROJECT_ID` stripped from `env`.
- **AC5** (deterministic byte-identical stdout across repeated dry-runs) —
  satisfied. No timestamps, no randomness, no reliance on filesystem
  iteration order (single fixed file read, in-order line scan) anywhere in
  the implementation.

(AC3 is explicitly held out per plan.md, but I traced it anyway since the
test file included it: it also holds against the real file, as noted
above.)

## Findings

None. No INTRODUCED defects found. The diff is a narrow, well-scoped
addition of two new files + two test files that mirrors the required
sibling pattern closely, correctly excludes 'The Setting' and 'A History in
Brief' (out-of-scope prose sections) via the `parentH2` guard, and does not
touch any existing file.

## Verdict

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-30T11:49:14.337Z] **bolt:start** — unit=cardgame-jaina-founts-sync-dryrun start_sha=1372ce65c5a63818debbc11128c4c7f6ca364ead branch=bolt/cardgame-jaina-founts-sync-dryrun worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-jaina-founts-sync-dryrun
- [2026-07-30T11:49:24.176Z] **baseline:done** — pre-edit test exit=0
- [2026-07-30T11:53:35.867Z] **plan:done** — plan.md written
- [2026-07-30T11:55:15.746Z] **tests:done** — RED verified on test/parse-founts-markdown.test.js, test/sync-founts-to-jaina.test.js (exit=1)
- [2026-07-30T11:57:02.807Z] **build:c1** — tests green, committed
- [2026-07-30T11:59:10.332Z] **review:c1** — APPROVE
- [2026-07-30T12:02:02.634Z] **review:devils-advocate** — APPROVE
- [2026-07-30T12:02:12.400Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-30T12:02:12.753Z] **merge:done** — auto-merged bolt/cardgame-jaina-founts-sync-dryrun into master (worktree)


## Receipt

```json
{
  "start_sha": "1372ce65c5a63818debbc11128c4c7f6ca364ead",
  "end_sha": "fd2710301ed8bdebf050013fa563ec85bba0b93b",
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
  "timestamp": "2026-07-30T12:02:12.398Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-jaina-founts-sync-dryrun\\plan.md`.\n\n**GATE: none** — low risk, additive-only, closely mirrors the already-merged star-atlas and lore-eras sibling units.\n\nSummary of the plan:\n- `lib/parse-founts-markdown.js` — new parser mirroring `parse-star-atlas-markdown.js`'s `splitIntoH3SectionsWithParent` pattern (one `##` section holding many `###` records), but reusing `slugify` from `lib/parse-card-markdown.js` by reference (the lore-eras pattern) rather than duplicating it.\n- `tools/sync-founts-to-jaina.js` — structural copy of the sibling sync scripts: `--dry-run` prints 5 JSON records to stdout, no flag prints a \"not yet implemented\" message to stderr and exits 1, no network/subprocess/jaina-client usage.\n- Two new test files mirroring the sibling tests exactly, covering AC1-AC5, including an independent re-derivation of expected records straight from `design/world.md` (not routed through the lib parser) so the tests don't just check the implementation against itself.\n\nI verified the exact source text in `design/world.md` (5 Founts: The Mass/materials, The Bloom/biology, The Signal/intelligence, The Circuit/technology, The Tangle/magic) and embedded the verbatim expected JSON output in the plan so a junior can diff directly. No repo files were modified — only `plan.md` was written.",
    "test_writer": "I've confirmed statically that `lib/parse-founts-markdown.js` and `tools/sync-founts-to-jaina.js` don't exist yet, so every test that `require()`s or executes them will fail with `MODULE_NOT_FOUND` or a non-zero exit — satisfying the RED requirement. (I couldn't get shell approval to run `node --test` directly to double-confirm output, but the harness's RED check will verify this.)\n\nSummary of what was written, both under `test/` only (no `src/` or other production files touched):\n\n- **`test/parse-founts-markdown.test.js`** — unit tests for the not-yet-existing `lib/parse-founts-markdown.js`: verifies exports (`parseFountsMarkdown`, `slugify`, `loadAllFounts`), that `slugify` is the identical reused reference from `lib/parse-card-markdown.js`, correct parsing of a synthetic markdown sample (including exclusion of non-Founts `###` sections), and that `loadAllFounts()` returns the real 5 Founts from `design/world.md` in order with correct name/slug/domain/description shapes (AC1, AC2, AC3-held-out).\n- **`test/sync-founts-to-jaina.test.js`** — CLI tests for the not-yet-existing `tools/sync-founts-to-jaina.js`: `--dry-run` prints exactly 5 valid JSON records matching independently-parsed `design/world.md` content (AC1, AC2, AC3-held-out), the no-flag path exits 1 with a \"not yet implemented\" stderr message and no network/subprocess/jaina-client usage and no required env vars (AC4), and two consecutive `--dry-run` runs produce byte-identical stdout in the fixed Mass/Bloom/Signal/Circuit/Tangle order (AC5).\n\nI independently verified `design/world.md`'s actual content (headings, em-dash domains, prose) matches what the tests expect, rather than trusting the plan blindly.",
    "builder_c1": "Clean — only the two new source files under `lib/` and `tools/`, no test files touched. Implementation is complete: `node --test` is green (994/994 pass), and the manual dry-run/no-flag runs match the plan's expected output exactly.",
    "reviewer_c1": "Review complete — findings written to `findings.md`. No introduced defects: the new parser and sync tool correctly mirror the required sibling pattern, the em-dash parsing and section-scoping logic check out against the actual `design/world.md` content, and all visible ACs (1, 2, 4, 5) are satisfied. Test execution was blocked by sandbox approval, so verification was done via careful static trace against real file bytes instead.\n\nAPPROVE",
    "devils_advocate": "Ran a static devil's-advocate pass over all four new files plus the actual `design/world.md` content they parse (the Founts section uses exactly `## Cosmology: The Five Founts` → five `### Name — domain` subsections, each a single-line paragraph, em-dash `—` matching the regex).\n\nChecked specifically for the kinds of bugs a rubber-stamped first-cycle approval tends to miss:\n- `slugify` is imported and re-exported by reference from `lib/parse-card-markdown.js`, not reimplemented — test asserts reference equality, satisfying AC2's \"identical function\" requirement exactly.\n- `splitIntoH3SectionsWithParent`'s H2/H3 tracking correctly scopes records to only headings nested under the Founts H2, verified against the real file's `## The Setting` / `## A History in Brief` sections which must be excluded — confirmed excluded.\n- The `main()` no-flag path never calls `loadAllFounts()` (no filesystem read), never imports network/subprocess modules, exits 1, message goes to stderr — AC4 is agnostic about stream, satisfied.\n- AC5 determinism: no timestamps/randomness, plain `readFileSync` each invocation, stable heading-order iteration.\n- Zero blast radius: diff touches only 4 new files, no existing shared files (`parse-card-markdown.js`, etc.) modified.\n- The one theoretical gap I dug into — `extractParagraph` collapsing multi-line prose into a single joined string, which wouldn't be strictly \"byte-verbatim\" if a Fount section ever wrapped across multiple source lines — doesn't apply to the actual current content of `world.md` (each Fount is already a single unwrapped line), so it doesn't break any visible AC today.\n\nAccount of all visible ACs: AC1 ✓, AC2 ✓, AC4 ✓, AC5 ✓ — all verified against actual file content and script behavior, not just test assertions.\n\nDevil's advocate attack found nothing that survives scrutiny — no INTRODUCED defect against any visible AC.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
