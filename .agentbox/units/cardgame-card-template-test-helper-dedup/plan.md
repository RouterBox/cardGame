GATE: none

# Plan: cardgame-card-template-test-helper-dedup

## Summary

`test/design-cards.test.js`, `test/design-frontier-cards.test.js`, and
`test/design-signature-cards.test.js` each contain a byte-for-byte (module
whitespace aside) copy of two `node:test` assertions per card, checking the
Section 9.1 canonical card template: Cost line -> Type line -> Rules text
ordering, and "Stats/counters line only appears, and only after Rules text,
when the Type line contains `Permanent`". Extract that pair of assertions
into a new shared helper, `test/helpers/card-template.js`, alongside the
existing `test/helpers/markdown.js`. Update all three test files to call the
helper instead of defining their own copies.

This is a pure test-code refactor. No file under `design/` changes. No
assertion text, test name, or pass/fail outcome changes — only where the
code that registers each assertion lives.

## Step 1 — create `test/helpers/card-template.js`

Create the file with this exact content:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert');

// Registers the Section 9.1 canonical-card-template checks shared by
// design-cards.test.js, design-frontier-cards.test.js, and
// design-signature-cards.test.js: Cost line -> Type line -> Rules text
// ordering, and Stats/counters line only present, and only after Rules
// text, when the Type line contains "Permanent".
function registerCardTemplateChecks(title, body) {
  test(`AC2: "${title}" has Cost line, Type line, and Rules text in order`, () => {
    const costIdx = body.indexOf('Cost line:');
    const typeIdx = body.indexOf('Type line:');
    const rulesIdx = body.indexOf('Rules text:');
    assert.notStrictEqual(costIdx, -1, `expected a "Cost line:" field in "${title}"`);
    assert.notStrictEqual(typeIdx, -1, `expected a "Type line:" field in "${title}"`);
    assert.notStrictEqual(rulesIdx, -1, `expected a "Rules text:" field in "${title}"`);
    assert.ok(
      costIdx < typeIdx && typeIdx < rulesIdx,
      `expected Cost line -> Type line -> Rules text order in "${title}"`
    );
  });

  test(`AC2: "${title}" only carries a Stats/counters line after Rules text, and only if a Permanent`, () => {
    const rulesIdx = body.indexOf('Rules text:');
    const statsIdx = body.indexOf('Stats/counters line:');
    if (statsIdx === -1) return;
    assert.ok(rulesIdx !== -1 && statsIdx > rulesIdx, `expected Stats/counters line to follow Rules text in "${title}"`);
    const typeMatch = body.match(/Type line:\s*([^\n]+)/);
    assert.ok(typeMatch, `expected a Type line to check permanence in "${title}"`);
    assert.ok(
      /\bPermanent\b/.test(typeMatch[1]),
      `expected "${title}" to be a Permanent since it carries a Stats/counters line, got type line: ${typeMatch[1]}`
    );
  });
}

module.exports = { registerCardTemplateChecks };
```

Notes for the implementer:
- `test` and `assert` are required inside the helper module itself (not
  passed in as parameters). `node:test`'s `test()` registers into the
  current test file's run regardless of which module actually calls it, so
  this works exactly like the existing pattern where `parseSections` is a
  plain imported function with no such wiring concerns — the only
  difference here is `card-template.js` also imports `node:test` and
  `node:assert` directly, which `markdown.js` does not need to do.
- The assertion strings, test-name template literals, and logic are copied
  verbatim from `test/design-cards.test.js` lines 85–111. Do not
  paraphrase or "clean up" any message string — AC3 requires the exact same
  pass/fail outcomes, and changing a message string is safe for pass/fail
  but changing any comparison logic is not. Copy-paste, don't retype.

## Step 2 — update `test/design-cards.test.js`

File: `test/design-cards.test.js`

**Edit A** — add the new import right after the existing `parseSections` import (line 6):

Old:
```js
const { parseSections } = require('./helpers/markdown');
```

New:
```js
const { parseSections } = require('./helpers/markdown');
const { registerCardTemplateChecks } = require('./helpers/card-template');
```

**Edit B** — replace the two inline `test(...)` calls inside the `for (const card of cardsToCheck)` loop (currently lines 84–112) with a single call to the helper.

Old (lines 84–112):
```js
for (const card of cardsToCheck) {
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
```

New:
```js
for (const card of cardsToCheck) {
  registerCardTemplateChecks(card.title, card.body);
}
```

Everything else in the file (AC1, AC3, AC4, AC5 blocks) stays untouched.

## Step 3 — update `test/design-frontier-cards.test.js`

File: `test/design-frontier-cards.test.js`

**Edit A** — add the new import right after the existing `parseSections` import (line 6):

Old:
```js
const { parseSections } = require('./helpers/markdown');
```

New:
```js
const { parseSections } = require('./helpers/markdown');
const { registerCardTemplateChecks } = require('./helpers/card-template');
```

**Edit B** — replace the two inline `test(...)` calls inside the `for (const card of cardsToCheck)` loop (currently lines 109–140) with a call to the helper.

Old (lines 109–140):
```js
for (const card of cardsToCheck) {
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
    assert.ok(
      rulesIdx !== -1 && statsIdx > rulesIdx,
      `expected Stats/counters line to follow Rules text in "${card.title}"`
    );
    const typeMatch = body.match(/Type line:\s*([^\n]+)/);
    assert.ok(typeMatch, `expected a Type line to check permanence in "${card.title}"`);
    assert.ok(
      /\bPermanent\b/.test(typeMatch[1]),
      `expected "${card.title}" to be a Permanent since it carries a Stats/counters line, got type line: ${typeMatch[1]}`
    );
  });
}
```

New:
```js
for (const card of cardsToCheck) {
  registerCardTemplateChecks(card.title, card.body);
}
```

Note: this file's copy has slightly different whitespace on the second
`assert.ok(...)` call (multi-line vs. single-line in `design-cards.test.js`)
but is otherwise the same logic and message text — the replacement is still
a single call to the shared helper, since the helper's behavior matches
both formattings exactly.

Everything else in the file (AC1 and AC3 blocks) stays untouched.

## Step 4 — update `test/design-signature-cards.test.js`

File: `test/design-signature-cards.test.js`

**Edit A** — add the new import right after the existing `parseSections` import (line 8):

Old:
```js
const { parseSections } = require('./helpers/markdown');
```

New:
```js
const { parseSections } = require('./helpers/markdown');
const { registerCardTemplateChecks } = require('./helpers/card-template');
```

**Edit B** — replace the two inline `test(...)` calls inside the `for (const card of sectionsToCheck)` loop (currently lines 115–143) with a call to the helper. Note this file's loop variable is `sectionsToCheck`, not `cardsToCheck` — do not rename it, just change what happens inside the loop body.

Old (lines 115–143):
```js
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
```

New:
```js
for (const card of sectionsToCheck) {
  registerCardTemplateChecks(card.title, card.body);
}
```

Everything else in the file (AC1, AC3, AC4 blocks, the `readCards`/
`parseCardMarkdown`-based `cardsToCheck` array used by AC1/AC4, etc.) stays
untouched. `sectionsToCheck` (built from `readCardSections()`, i.e. raw
markdown section title+body) is a different array from `cardsToCheck` (built
from `parseCardMarkdown`) already in this file today — do not conflate them
or try to unify them; this unit only touches the Section 9.1 template-check
loop.

## Step 5 — verify

Run:

```
node --test
```

Expected output: same total pass count as before the change, with no new
failures. In particular, confirm these three files still register the same
test names as before (only their location moved):
- `test/design-cards.test.js`: still runs one `AC2: "<title>" has Cost
  line, Type line, and Rules text in order` and one `AC2: "<title>" only
  carries a Stats/counters line after Rules text, and only if a Permanent`
  test per card in `design/cards/alpha-set.md` (15+ cards today).
- `test/design-frontier-cards.test.js`: same two tests per card in
  `design/cards/frontier-set.md` (5 cards today).
- `test/design-signature-cards.test.js`: same two tests per card section in
  `design/cards/character-signatures.md` (5 cards today).

Also run, to double check no `design/` file was touched:

```
git status --porcelain design
```

Expected output: empty (no lines printed). If anything under `design/`
shows as modified, something went wrong — this unit must only touch files
under `test/`.

## Files touched by this unit

- `test/helpers/card-template.js` (new)
- `test/design-cards.test.js` (modified: +1 import line, loop body replaced)
- `test/design-frontier-cards.test.js` (modified: +1 import line, loop body replaced)
- `test/design-signature-cards.test.js` (modified: +1 import line, loop body replaced)

No other files change. No file under `design/` changes.

## Risk assessment (FIRE)

- **Reversibility**: trivial — pure refactor of test-only code, one `git
  revert` away from a clean rollback. Low risk.
- **Security impact**: none. No production code, no user input, no
  network/file-write surface beyond existing test reads of `design/*.md`.
- **User data**: none touched.
- **Schema changes**: none.

Overall: low-risk, mechanical, precedented (same shape as the already-shipped
`cardgame-tools-shared-parser-dedup` and `cardgame-tools-loader-dedup`
units). `GATE: none`.

## Held-out criteria note

AC3 and AC4 are both faithfully redundant with the stated intent (identical
pass/fail behavior; no `design/` changes) and require no special handling
beyond what Steps 1–4 already produce. No spec bug found in the held-out
criteria.
