# Plan: cardgame-ideas-inbox-jaina-sync-tag

GATE: none

## Summary

Two-file, two-edit unit. Tag the last untagged ideas-inbox.md heading with
`[incorporated: cardgame-jaina-card-sync-live]`, and update the one test that
currently asserts that heading stays untagged so it asserts the new tag
instead. Both files are small and both target locations are already known
exactly (found by reading the files during planning) — no ambiguity, no
research needed at build time.

## File 1: `design/ideas-inbox.md`

Current heading (line 121):

```
## 2026-07-28 — use Jaina as the content backbone (from RouterBox, verbatim)
```

Change to (append the tag, same pattern as the other five tagged headings —
a space then `[incorporated: <unit-name>]`):

```
## 2026-07-28 — use Jaina as the content backbone (from RouterBox, verbatim) [incorporated: cardgame-jaina-card-sync-live]
```

This is a single-line edit. Do not touch anything else in the file: not the
quote block on lines 123-125, not the "Implications" bullets on lines 126-134,
not any of the other six `## ` headings (lines 8, 26, 49, 62, 82, 104), not
the intro paragraph (lines 1-6).

Use a targeted string replacement (e.g. `Edit` tool with `old_string` set to
the exact current heading line and `new_string` set to the tagged version
above) rather than rewriting the file, to guarantee byte-identical output
everywhere else.

## File 2: `test/design-ideas-inbox.test.js`

Current test (lines 76-83) — this is the ONLY test to change:

```js
test('AC3: "use Jaina as the content backbone" heading remains untagged', () => {
  const idx = findSection(headings, /use jaina as the content backbone/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "use Jaina as the content backbone"');
  assert.ok(
    !headings[idx].title.includes('[incorporated:'),
    `expected heading "${headings[idx].title}" to NOT contain an [incorporated: ...] tag`
  );
});
```

Replace it with (mirrors the style of the other AC1/AC2/AC3 "ends with"
assertions already in this same file, e.g. lines 29-36 and 67-74):

```js
test('AC3: "use Jaina as the content backbone" heading ends with [incorporated: cardgame-jaina-card-sync-live]', () => {
  const idx = findSection(headings, /use jaina as the content backbone/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "use Jaina as the content backbone"');
  assert.ok(
    headings[idx].title.endsWith('[incorporated: cardgame-jaina-card-sync-live]'),
    `expected heading "${headings[idx].title}" to end with [incorporated: cardgame-jaina-card-sync-live]`
  );
});
```

Do not touch the block comment above it (lines 61-65, "AC3: the 'software
gate ruling' heading...") — leave it as-is even though it currently mentions
"remains untagged"; that comment also describes the still-unchanged
`software gate ruling` test directly above (lines 67-74). Do NOT edit that
comment block: the unit's own AC2 forbids weakening/removing/renaming *tests*,
and touching the comment is not required by any AC — leave it exactly as it
is to minimize the diff. (If the builder judges the stale phrase in the
comment confusing, it may update just the trailing clause about the Jaina
heading, but this is optional and must not change the comment's coverage of
the "software gate ruling" test above it.)

Do not touch any other test in this file (AC1 heading tests, AC2 heading
tests, the file-exists test, the "software gate ruling" test).

## Why this is correct / matches ACs

- AC1: heading now ends with `[incorporated: cardgame-jaina-card-sync-live]`. ✓ (File 1 edit)
- AC2: the old "remains untagged" test is replaced with an "ends with ..." test; no other test in the file is touched. ✓ (File 2 edit)
- AC3: only the one heading's text changes in `design/ideas-inbox.md`; the other six `## ` headings (lines 8, 26, 49, 62, 82, 104) and all `>` quote blocks are left byte-identical because the edit is a single targeted line replacement. ✓
- AC4 (held_out): still exactly 7 `## ` headings, same order, none added/removed — the edit only appends text to an existing heading line, it doesn't add/remove/reorder headings. `node --test` will run this file plus the full existing suite; no other test file needs modification because no other file references this heading's tag state. ✓

## Expected outputs

Run: `node --test` from the repo root (`C:\github\.agentbox-worktrees\cardGame\cardgame-ideas-inbox-jaina-sync-tag`, or wherever the unit is built).

Expected:
- All tests pass, including the full `test/design-ideas-inbox.test.js` file (5 tests: file-exists, AC1 characters-per-race, AC2 card-anatomy, AC2 card-authoring-engine, AC3 software-gate-ruling, AC3 use-jaina — note: that's actually 6 tests total in the file after edit, same count as before since we replaced one test with one test, added none, removed none).
- No other test file's pass/fail status changes as a result of this edit (`design/ideas-inbox.md`'s only consumer in `test/` is `design-ideas-inbox.test.js`; confirm via a grep of `test/` for `ideas-inbox` if you want a belt-and-suspenders check before finishing — expect only `test/design-ideas-inbox.test.js` to match).
- `node --test` overall summary line shows 0 failing.

## Verification steps for the builder

1. Make the two edits above.
2. Read back `design/ideas-inbox.md` in full and diff mentally against the
   original: confirm only line 121 changed (one line got one trailing
   ` [incorporated: cardgame-jaina-card-sync-live]` appended), every other
   line is identical, and the file still has exactly 7 lines starting with
   `## `.
3. Read back `test/design-ideas-inbox.test.js` in full and confirm: exactly
   one test block changed (the former "remains untagged" test), its name and
   body now assert `.endsWith('[incorporated: cardgame-jaina-card-sync-live]')`,
   and every other test in the file is untouched (same names, same bodies).
4. Run `node --test` and confirm 0 failures.

## Risk assessment (FIRE)

- **Reversibility**: trivial — a two-line text diff, fully reversible via git revert.
- **Security impact**: none — markdown design doc and its test, no code paths, no secrets, no user input handling.
- **User data**: none touched.
- **Schema changes**: none.

This is a minimal-risk documentation/test-sync unit. No confirmation gate needed.
