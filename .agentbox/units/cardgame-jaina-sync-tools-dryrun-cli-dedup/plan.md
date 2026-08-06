GATE: none

# Plan: cardgame-jaina-sync-tools-dryrun-cli-dedup

## Summary

Three Jaina sync tools (`tools/sync-lore-eras-to-jaina.js`, `tools/sync-founts-to-jaina.js`,
`tools/sync-star-atlas-to-jaina.js`) currently inline the same dry-run/not-implemented CLI
control flow that `tools/sync-characters-to-jaina.js` and `tools/sync-races-to-jaina.js`
already delegate to `lib/run-jaina-dryrun-cli.js`'s `runDryRunSyncCli`. This plan replaces
each file's inlined `main()` body with a call to the shared helper, exactly mirroring the
pattern already used in `sync-characters-to-jaina.js`. No other file changes.

This is a small, low-risk, mechanical refactor — one bolt is sufficient.

## Reference pattern (already in repo, do not touch)

`tools/sync-characters-to-jaina.js` (lines 1-42) is the model to mirror:

```js
#!/usr/bin/env node
'use strict';

const { loadAllCharacters } = require('../lib/parse-character-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

const NOT_IMPLEMENTED_MESSAGE =
  'Live sync to Jaina is not yet implemented for characters in this unit. Re-run with ' +
  '--dry-run to preview the record payloads a future live-sync step would write.';

// ---------------------------------------------------------------------------
// Jaina 'characters' schema record shape (dry-run preview only — no API calls)
// ---------------------------------------------------------------------------

function buildRecord(character) {
  return {
    name: character.name,
    slug: character.slug,
    race: character.race,
    title: character.title,
    bio: character.bio,
    threads: character.threads,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  runDryRunSyncCli({
    loadItems: loadAllCharacters,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
```

The shared helper (`lib/run-jaina-dryrun-cli.js`, DO NOT MODIFY) is:

```js
function runDryRunSyncCli({ loadItems, buildRecord, notImplementedMessage, argv }) {
  const dryRun = argv.includes('--dry-run');

  if (!dryRun) {
    console.error(notImplementedMessage);
    process.exitCode = 1;
    return;
  }

  const items = loadItems();
  for (const item of items) {
    console.log(JSON.stringify(buildRecord(item)));
  }
}
```

Behavior is identical to what each of the 3 target files currently does inline: same
`process.exitCode = 1` (not `process.exit(1)`), same `console.error`/`console.log` calls,
same JSON-per-line output shape. This is a pure delegation swap — no observable behavior
change, so the existing black-box subprocess tests must pass unmodified.

## Files to change (exactly 3, each an identical shape of edit)

### 1. `tools/sync-lore-eras-to-jaina.js`

Current content (45 lines) — full file for reference:

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

**Edit A** — add the `runDryRunSyncCli` require directly below the existing `loadAllEras`
require (line 4), mirroring `sync-characters-to-jaina.js`'s import placement:

Replace:
```js
const { loadAllEras } = require('../lib/parse-lore-markdown');
```
With:
```js
const { loadAllEras } = require('../lib/parse-lore-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');
```

**Edit B** — replace the `main()` body (lines 27-40) with a delegating call:

Replace:
```js
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
```
With:
```js
function main() {
  runDryRunSyncCli({
    loadItems: loadAllEras,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}
```

Everything else in the file (the `NOT_IMPLEMENTED_MESSAGE` constant, `buildRecord`, the
`main();` call, and `module.exports`) stays byte-for-byte identical.

Resulting full file:

```js
#!/usr/bin/env node
'use strict';

const { loadAllEras } = require('../lib/parse-lore-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

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
  runDryRunSyncCli({
    loadItems: loadAllEras,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
```

### 2. `tools/sync-founts-to-jaina.js`

Same shape of edit. Current `main()` is at lines 27-40.

**Edit A** — replace:
```js
const { loadAllFounts } = require('../lib/parse-founts-markdown');
```
With:
```js
const { loadAllFounts } = require('../lib/parse-founts-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');
```

**Edit B** — replace:
```js
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
```
With:
```js
function main() {
  runDryRunSyncCli({
    loadItems: loadAllFounts,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}
```

Resulting full file:

```js
#!/usr/bin/env node
'use strict';

const { loadAllFounts } = require('../lib/parse-founts-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

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
  runDryRunSyncCli({
    loadItems: loadAllFounts,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
```

### 3. `tools/sync-star-atlas-to-jaina.js`

Same shape of edit. Current `main()` is at lines 28-41 (one line lower than the other two
because `buildRecord` here has 5 fields instead of 4 — do not let that shift confuse the
edit; anchor on the code content, not the line numbers).

**Edit A** — replace:
```js
const { loadAllWorlds } = require('../lib/parse-star-atlas-markdown');
```
With:
```js
const { loadAllWorlds } = require('../lib/parse-star-atlas-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');
```

**Edit B** — replace:
```js
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
```
With:
```js
function main() {
  runDryRunSyncCli({
    loadItems: loadAllWorlds,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}
```

Resulting full file:

```js
#!/usr/bin/env node
'use strict';

const { loadAllWorlds } = require('../lib/parse-star-atlas-markdown');
const { runDryRunSyncCli } = require('../lib/run-jaina-dryrun-cli');

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
  runDryRunSyncCli({
    loadItems: loadAllWorlds,
    buildRecord,
    notImplementedMessage: NOT_IMPLEMENTED_MESSAGE,
    argv: process.argv,
  });
}

main();

module.exports = { buildRecord, NOT_IMPLEMENTED_MESSAGE };
```

## Explicitly out of scope — do not touch

- `lib/run-jaina-dryrun-cli.js`
- `tools/sync-characters-to-jaina.js`
- `tools/sync-races-to-jaina.js`
- `tools/sync-cards-to-jaina.js`
- Any file under `test/*.js`, including but not limited to `test/sync-lore-eras-to-jaina.test.js`,
  `test/sync-founts-to-jaina.test.js`, `test/sync-star-atlas-to-jaina.test.js`,
  `test/run-jaina-dryrun-cli.test.js`

These four `tools`/`lib` files must remain byte-for-byte unchanged (AC4, held-out). If a diff
tool or editor auto-touches whitespace/EOL in any of them, revert before finishing the bolt.

## Verification

Run the full suite:

```
node --test
```

Expected: all tests pass, same total pass count as before the change (no test file is
modified, no test is added or removed). In particular:

- `test/sync-lore-eras-to-jaina.test.js`, `test/sync-founts-to-jaina.test.js`,
  `test/sync-star-atlas-to-jaina.test.js` pass unmodified — these spawn each tool as a
  subprocess (`node tools/sync-*-to-jaina.js` with and without `--dry-run`) and assert on
  stdout JSON lines and exit code. Since `runDryRunSyncCli`'s behavior is identical to the
  inlined code it replaces (same `console.error` + `process.exitCode = 1` on missing
  `--dry-run`; same per-item `console.log(JSON.stringify(buildRecord(item)))` loop on
  `--dry-run`), stdout/exit-code assertions are unaffected.
- `test/run-jaina-dryrun-cli.test.js` continues to pass since `lib/run-jaina-dryrun-cli.js`
  is untouched.

As an additional manual sanity check (optional, not required by ACs), from the repo root:

```
node tools/sync-lore-eras-to-jaina.js
```
should print the `NOT_IMPLEMENTED_MESSAGE` string to stderr and exit with code 1, and:
```
node tools/sync-lore-eras-to-jaina.js --dry-run
```
should print one JSON line per era to stdout and exit 0 — identical to pre-change behavior.
Same pattern applies to `sync-founts-to-jaina.js` and `sync-star-atlas-to-jaina.js`.

## Risk assessment (FIRE matrix)

- **Reversibility**: trivial — pure refactor of 3 files, each a 1-line import add + a
  ~13-line-to-6-line function body swap. Fully reversible via git revert.
- **Security impact**: none. No new I/O, no new external calls, no change to data read/written.
- **User data**: none touched — these are local CLI tools operating on markdown files in the
  repo; behavior is unchanged.
- **Schema changes**: none. `buildRecord` output shapes are untouched per-file.

Overall: low risk, mechanical, single bolt is appropriate. No confirmation gate needed.

## Held-out AC note

AC4 (byte-for-byte unchanged files) is redundant with the unit's explicit "Do not touch ...
or any test/*.js file" instruction and AC3's "no changes made to any file under test/" — it
is a specifics-only extension of the same constraint already stated in the intent, not a
novel requirement. No spec-bug flag needed.
