name: cardgame-race-characters
title: cardGame design — named characters per race with interlinking narratives
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

User directive (2026-07-27, verbatim, logged in design/ideas-inbox.md): "Also want 3 to 5 characters per race with individual but interlinking narratives."

This is a DESIGN unit (taste ledger T8): outputs are markdown documents a human reads for pleasure, not software. Produce a named-character roster for the Amaranth Expanse — 3 to 5 characters for each of the five races (Cindral Reach, Mireth Bloom, Panoptic Concord, Wrought Assembly, Starweave Communion) — where each character has an individual narrative AND the narratives interlink across races so the whole roster reads as one connected galaxy-scale story.

Canon to honor (read before writing): design/world.md (five Founts: The Mass, The Bloom, The Signal, The Circuit, The Tangle — note the magic Fount is THE TANGLE, renamed from an earlier draft), design/races/*.md (race identities, strengths, hooks), design/rules.md (spatial battlefield: homeworlds, wormholes, discovery — good narrative raw material), design/ideas-inbox.md (directives).

Deliverables in the target repo (C:/github/cardGame):

1. `design/characters/<race-name>.md` — five files, one per race, matching the race file basenames under design/races/. Each contains 3 to 5 characters. Per character: a name, a one-line role/title, an identity paragraph (who they are, what they want, what they'd be as a card — hero/legend flavor, not stats), and a "Threads" list of 1+ named cross-race connections (rivalry, debt, shared history, hunt, betrayal — anything that ties their story to a character in ANOTHER race's file).
2. `design/characters/web.md` — the interlink map: a short overview of the galaxy-scale story the roster tells, then one section per major thread naming the characters involved (from at least two different races each) and the shape of the connection. Every character appears in at least one thread here.
3. Consistency: every cross-race connection is bidirectional in spirit — if character A's Threads names character B, B's own entry acknowledges the connection (from B's perspective; the two sides may disagree about what happened, which is encouraged).

Plain-language bar (T6): a reader who has never seen gamePlan.md or the rules understands every document. Evocative prose over spec-sheet tone; these are meant to be read for pleasure and to seed future legendary card designs and Leonardo art briefs.

## Acceptance Criteria

- AC1 [user]: Exactly five files exist under design/characters/, one per race with basenames matching design/races/, and each contains no fewer than 3 and no more than 5 named characters.
- AC2 [user]: Every character entry includes an individual narrative (identity paragraph with their own story and wants) and a Threads list naming at least one character from a different race's file.
- AC3 [paraphrase]: design/characters/web.md exists, names every character from all five race files at least once, and each thread section involves characters from at least two different races.
- AC4 [inferred]: Character names are unique across the whole roster, and every cross-race reference in a Threads list points at a character that actually exists in the named race's file.
- AC5 [inferred] (held_out): Each character file references its race's canon from design/races/ — at least one signature hook, location, or identity element from the race file appears in the character prose — so the roster extends existing canon rather than inventing a parallel one.
