name: cardgame-ideas-inbox-incorporated-tags
title: cardGame design — mark ideas-inbox.md entries [incorporated] for four already-shipped directives
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/ideas-inbox.md states its own convention: 'Ideas are never deleted — mark them [incorporated: <unit-name>] when a shipped unit lands them.' Only the two 2026-07-26 spatial-layer entries currently carry that tag. Four later entries already have shipped, merged units satisfying them — characters per race (2026-07-27) landed as cardgame-race-characters; card anatomy as layered compound object (2026-07-28) landed as cardgame-card-anatomy-skeleton; the deterministic authoring engine directive (2026-07-28) landed as cardgame-card-authoring-engine; the software-gate ruling (2026-07-28) landed as cardgame-design-browser-site — yet none carry the tag the file's own rule requires. This is a pure bookkeeping edit to a tracked design document (T8's markdown-checks discipline, not repo/branch state per T11): add the four tags, touch nothing else. It keeps the design ledger trustworthy so the Producer (and RouterBox skimming from the phone) can tell at a glance what is already done, directly serving I3's shrink-attention-cost goal alongside I6.

## Acceptance Criteria

- AC1 [user]: design/ideas-inbox.md's 'characters per race' heading ends with '[incorporated: cardgame-race-characters]'.
- AC2 [paraphrase]: design/ideas-inbox.md's 'card anatomy as layered compound object' and 'deterministic card authoring engine' headings end with '[incorporated: cardgame-card-anatomy-skeleton]' and '[incorporated: cardgame-card-authoring-engine]' respectively.
- AC3 [inferred]: design/ideas-inbox.md's 'software gate ruling' heading ends with '[incorporated: cardgame-design-browser-site]', and the 'use Jaina as the content backbone' heading remains untagged since its corresponding unit has not shipped yet.
- AC4 [inferred] (held_out): design/ideas-inbox.md still contains exactly 6 '## ' entry headings after the edit (none added, none removed, none reordered) and every '>' verbatim quote block is byte-identical to before — this unit changes only heading-line tags.
