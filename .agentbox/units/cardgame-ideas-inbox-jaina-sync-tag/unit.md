name: cardgame-ideas-inbox-jaina-sync-tag
title: Tag the Jaina content-backbone idea as incorporated
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Now that the live Jaina card-sync tool has merged, close the loop on design/ideas-inbox.md's tracked-idea ledger: the 'use Jaina as the content backbone' entry is the only one of seven still untagged, and its own test file still hard-asserts that it must stay untagged. This unit updates the heading with the standard [incorporated: <unit-name>] tag (matching the pattern already used for the other five entries) and updates test/design-ideas-inbox.test.js so its AC3 test asserts the new tag instead of the tag's absence, without touching any other heading, quote block, or test in either file.

## Acceptance Criteria

- AC1 [user]: design/ideas-inbox.md's 'use Jaina as the content backbone' heading ends with '[incorporated: cardgame-jaina-card-sync-live]'.
- AC2 [paraphrase]: test/design-ideas-inbox.test.js's existing test asserting that heading 'remains untagged' is replaced with a test asserting it now ends with '[incorporated: cardgame-jaina-card-sync-live]'; no other existing test in the file is weakened, removed, or renamed.
- AC3 [inferred]: All six other '## ' headings and their existing [incorporated: ...] tags in design/ideas-inbox.md are byte-identical to before this edit, and every '>' verbatim quote block in the file is unchanged.
- AC4 [inferred] (held_out): design/ideas-inbox.md still contains exactly 7 '## ' entry headings after the edit, in the same order, none added or removed, and `node --test` passes with no other test file needing modification.
