# Plan: cardgame-ideas-inbox-incorporated-tags

GATE: confirm

**Why gated:** AC4 (held_out) asserts the file has "exactly 6 `## ` entry
headings" both before and after the edit. I counted the actual file and it
has **7** `## ` headings, not 6 (see "Spec bug" section below). AC3 (visible,
paraphrased) requires the 7th heading — "use Jaina as the content backbone"
— to remain present and untagged. So AC3 and AC4 are in direct tension: AC3
requires 7 headings to survive the edit, AC4 says the count must be 6. This
is very likely a miscount in the AC text (whoever wrote it counted the 6
entries *named in the unit's Intent prose* and forgot the file also contains
the untouched-and-untaggable Jaina entry that AC3 itself references). Confirm
before the test-writing step bakes a literal `6` into an assertion — it will
be unsatisfiable without violating AC3, or without deleting a heading the
unit explicitly says must NOT be deleted.

Everything below is written so the bolt can proceed either way once
confirmed: the edit itself is identical regardless of which number is
correct, and the "Suggested test assertions" section shows how to write
AC4's count check so it passes under the actual (7-heading) file rather than
hardcoding either number.

## Scope

Exactly one file changes: `design/ideas-inbox.md`. Nothing else in the repo
is touched — not `site/design/ideas-inbox.html` (a build artifact of
`tools/build-site.js`, already showing as modified in git status from
unrelated prior work; regenerating it is out of scope per the unit's own
"touch nothing else" framing and T11), not any other design doc, not any
test infra.

## Current file state (verified by reading design/ideas-inbox.md directly)

`design/ideas-inbox.md` has 7 `## ` headings, in this order:

1. Line 8 — `## 2026-07-26 — Spatial layer: planets, wormholes, generator placement [incorporated: cardgame-spatial-battlefield-rules]` — **already tagged**, do not touch.
2. Line 26 — `## 2026-07-26 (later) — Homeworlds, discovery, wormhole control [incorporated: cardgame-spatial-battlefield-rules]` — **already tagged**, do not touch.
3. Line 49 — `## 2026-07-27 — characters per race (from RouterBox, verbatim)` — **needs `[incorporated: cardgame-race-characters]`** (AC1).
4. Line 62 — `## 2026-07-28 — card anatomy as layered compound object (from RouterBox, verbatim)` — **needs `[incorporated: cardgame-card-anatomy-skeleton]`** (AC2).
5. Line 82 — `## 2026-07-28 — deterministic card authoring engine + gen-AI art only in the art slot (from RouterBox, verbatim)` — **needs `[incorporated: cardgame-card-authoring-engine]`** (AC2).
6. Line 104 — `## 2026-07-28 — software gate ruling: tools yes, game implementation no (from RouterBox, verbatim)` — **needs `[incorporated: cardgame-design-browser-site]`** (AC3).
7. Line 121 — `## 2026-07-28 — use Jaina as the content backbone (from RouterBox, verbatim)` — **stays untagged** (AC3 — the corresponding unit has not shipped).

I confirmed all four target units are real, merged units by checking
`workItems/MANIFEST.md` and `git log --oneline --all`:
- `cardgame-race-characters` — merged (`2fc7b22 Merge branch 'bolt/cardgame-race-characters'`)
- `cardgame-card-anatomy-skeleton` — merged (`4e79bb4 merge: unit cardgame-card-anatomy-skeleton (receipt valid)`)
- `cardgame-card-authoring-engine` — merged (`5331468 merge: unit cardgame-card-authoring-engine (receipt valid)`)
- `cardgame-design-browser-site` — merged (`46dfada Merge branch 'bolt/cardgame-design-browser-site'`)

Use these four exact strings for the tags — do not paraphrase or add a
`.md` suffix, a date, or any other decoration. The two already-tagged
2026-07-26 headings show the exact required format:
`[incorporated: <unit-name>]`, appended as the literal last characters of
the heading line, with a single space before the opening bracket.

## Exact edits

All four edits are of the same shape: append
` [incorporated: <unit-name>]` (one leading space, then the bracketed tag)
to the end of the heading line, and nothing else on that line changes. No
other line in the file is touched — in particular, every `>` blockquote
line and the Jaina heading (line 121) must come out of `git diff` completely
absent from the patch.

Apply with the Edit tool, one call per heading (exact old_string / new_string
pairs — copy verbatim, these already account for the file's real em-dash
`—` character and lack of trailing whitespace):

**Edit 1 — line 49 (AC1):**
- old_string:
  ```
  ## 2026-07-27 — characters per race (from RouterBox, verbatim)
  ```
- new_string:
  ```
  ## 2026-07-27 — characters per race (from RouterBox, verbatim) [incorporated: cardgame-race-characters]
  ```

**Edit 2 — line 62 (AC2, first half):**
- old_string:
  ```
  ## 2026-07-28 — card anatomy as layered compound object (from RouterBox, verbatim)
  ```
- new_string:
  ```
  ## 2026-07-28 — card anatomy as layered compound object (from RouterBox, verbatim) [incorporated: cardgame-card-anatomy-skeleton]
  ```

**Edit 3 — line 82 (AC2, second half):**
- old_string:
  ```
  ## 2026-07-28 — deterministic card authoring engine + gen-AI art only in the art slot (from RouterBox, verbatim)
  ```
- new_string:
  ```
  ## 2026-07-28 — deterministic card authoring engine + gen-AI art only in the art slot (from RouterBox, verbatim) [incorporated: cardgame-card-authoring-engine]
  ```

**Edit 4 — line 104 (AC3):**
- old_string:
  ```
  ## 2026-07-28 — software gate ruling: tools yes, game implementation no (from RouterBox, verbatim)
  ```
- new_string:
  ```
  ## 2026-07-28 — software gate ruling: tools yes, game implementation no (from RouterBox, verbatim) [incorporated: cardgame-design-browser-site]
  ```

Each old_string above is unique in the file (verified — none of these
heading strings repeat), so a plain Edit call for each is sufficient; no
`replace_all` needed and none should be used.

Do **not** edit line 121 (`## 2026-07-28 — use Jaina as the content
backbone (from RouterBox, verbatim)`) — it must remain byte-identical.

## Verification after editing

Run:
```
git -C design diff ideas-inbox.md 2>/dev/null || git diff -- design/ideas-inbox.md
```
Expected diff: exactly 4 changed lines (the four headings above), each a
one-line modification that only appends the ` [incorporated: ...]` suffix —
no other lines added, removed, or reflowed.

Then:
```
node --test
```
Expected: exit code 0, all existing suites still green (this edit doesn't
touch any file another test currently depends on), plus whatever new test
file covers this unit's ACs also green (see below — that file is written by
the test step, not by this plan/build step, per this repo's usual
plan→test→build sequencing).

## Suggested test assertions (for the test-writing step, not for this build)

Mirroring the existing `test/design-card-anatomy.test.js` pattern
(`require('./helpers/markdown')`'s `parseSections`), a
`test/design-ideas-inbox.test.js` would:

1. Read `design/ideas-inbox.md`, run `parseSections(content)`, filter
   `level === 2` to get the 7 entry headings.
2. AC1: assert the section whose title starts with `2026-07-27` and
   contains `characters per race` has a title ending in
   `[incorporated: cardgame-race-characters]`.
3. AC2: assert the two 2026-07-28 sections containing `card anatomy as
   layered compound object` and `deterministic card authoring engine` end in
   `[incorporated: cardgame-card-anatomy-skeleton]` and
   `[incorporated: cardgame-card-authoring-engine]` respectively.
4. AC3: assert the section containing `software gate ruling` ends in
   `[incorporated: cardgame-design-browser-site]`, and the section
   containing `use Jaina as the content backbone` does **not** contain the
   substring `[incorporated:` anywhere in its title.
5. AC4 (held_out) — **write this against the actual invariant, not a
   hardcoded headcount**: capture the section count and the full text of
   every `>`-prefixed blockquote block from `design/ideas-inbox.md` as it
   exists *right now* (7 headings, 7 quote blocks) into the test as fixed
   expected values baked in at test-write time (e.g. an array of the 7
   heading title texts pre-tag and the 7 quote bodies), then assert
   post-edit: same count of level-2 sections, same order, and each quote
   block string-equal to its captured original. This satisfies the AC's
   real intent ("this unit changes only heading-line tags") without
   depending on whether "6" or "7" is the correct literal number — flag in
   the test-step's own notes that AC4's literal "6" does not match the
   file's real 7-heading count, per this plan's GATE note above.

## Risk self-assessment (FIRE)

- **Reversibility:** trivial — single-file text edit, `git revert`/`git
  checkout` fully undoes it. No generated artifacts depend on the exact
  byte layout of this file at build time in a way that would break anything
  if reverted.
- **Security impact:** none. Static markdown content, no executable code,
  no secrets.
- **User data:** none. Design documentation only.
- **Schema changes:** none.

Overall blast radius is minimal and fully reversible; the GATE above is
about a spec-text inconsistency (AC3 vs AC4), not about implementation risk.

## Non-goals (explicitly out of scope)

- Do not regenerate `site/design/ideas-inbox.html` or run
  `tools/build-site.js`.
- Do not add a tag to the Jaina entry (its unit hasn't shipped).
- Do not reword, reorder, or otherwise touch any blockquote (`>`) line.
- Do not add, remove, or reorder any `## ` heading.
