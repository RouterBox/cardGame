# Work Item Manifest

Append-only requirements traceability log — one section per archived work item, listing the acceptance criteria it satisfied and their receipt verdicts.

## 2026-07-26-cardgame-world-races-cardgame-design-phase-1-world-bible-and-five-race-identities.md

- AC1 [user]: design/world.md exists in the cardgame repo and contains a galaxy/setting overview plus a cosmology section that names and grounds all five categories from gamePlan.md — materials, biology, intelligence, technology, and magic — as in-universe forces. — PASS
- AC2 [user]: Exactly five files exist under design/races/, and each contains an identity paragraph, one declared primary strength, two complementary strengths, and two countering weaknesses drawn from the five-category list. — PASS
- AC3 [paraphrase]: Across the five race files, each of the five categories appears as a primary strength exactly once, and no race lists the same category twice across its primary/complementary/countering slots. — PASS
- AC4 [inferred]: Each race file includes 3-5 signature hooks (named, one-line mechanics-flavored concepts) and a visual-identity paragraph suitable as an art-brief seed for Leonardo. — PASS
- AC5 [inferred] (held_out): design/world.md references at least three of the five races by name in its setting prose, so the world bible and the race files read as one connected universe rather than disconnected documents. — PASS

## 2026-07-27-cardgame-spatial-battlefield-rules-cardgame-rules-v2-spatial-battlefield-homeworlds-discovery-wormholes.md

- AC1 [user]: design/rules.md gains numbered spatial-battlefield rules covering: planets as graph nodes, wormholes as edges with length, homeworld start, discovery of unexplored worlds cheaper than wormholes toward enemy worlds, wormhole restrictions by direction/team/unit-type, and wormhole closure. — PASS
- AC2 [user]: Generator rules are updated so generators are built on specific planets and the rules state what happens to generators when their planet is contested or lost. — PASS
- AC3 [paraphrase]: New terms (planet, wormhole, homeworld, discovery, length, closure) are defined in the glossary before substantive use, consistent with the document's glossary-first discipline. — PASS
- AC4 [inferred]: The discovery action is integrated into the existing numbered turn-phase sequence (not bolted on as an appendix), and no new rule contradicts an existing numbered rule — the existing design-rules tests still pass unmodified. — PASS
- AC5 [inferred] (held_out): Both 2026-07-26 entries in design/ideas-inbox.md are marked [incorporated: cardgame-spatial-battlefield-rules], and at least one worked example in the rules walks a discovery-then-blockade sequence on a small named graph. — PASS

## 2026-07-28-cardgame-race-characters-cardgame-design-named-characters-per-race-with-interlinking-narratives.md

- AC1 [user]: Exactly five files exist under design/characters/, one per race with basenames matching design/races/, and each contains no fewer than 3 and no more than 5 named characters. — no receipt (escalated before receipt computation)
- AC2 [user]: Every character entry includes an individual narrative (identity paragraph with their own story and wants) and a Threads list naming at least one character from a different race's file. — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: design/characters/web.md exists, names every character from all five race files at least once, and each thread section involves characters from at least two different races. — no receipt (escalated before receipt computation)
- AC4 [inferred]: Character names are unique across the whole roster, and every cross-race reference in a Threads list points at a character that actually exists in the named race's file. — no receipt (escalated before receipt computation)
- AC5 [inferred] (held_out): Each character file references its race's canon from design/races/ — at least one signature hook, location, or identity element from the race file appears in the character prose — so the roster extends existing canon rather than inventing a parallel one. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-alpha-set-starter-cards-cardgame-design-phase-4-alpha-set-starter-cards.md

- AC1 [user]: design/cards/alpha-set.md exists in the cardGame repo and contains at least 15 distinct named cards. — PASS
- AC2 [user]: Every card uses the canonical template from rules.md Section 9.1 in order (Name, Cost line, Type line, Rules text, and for Permanents an optional Stats/counters line) with no required field missing. — PASS
- AC3 [paraphrase]: The set includes at least one card for each of the five Card Types (Magic, Technology, Intelligence, Biology, Materials) and at least one card costed from each of the five Founts. — PASS
- AC4 [inferred]: Each of the five races (design/races/*.md) has at least one card in the set whose Rules text or flavor ties back to that race's own primary Fount strength as named in its race file. — PASS
- AC5 [inferred]: At least one card demonstrates the multi-type/multi-cost rule from rules.md Section 9.7 — a card listing more than one Card Type and drawing cost from more than one Fount. — PASS
- AC6 [inferred] (held_out): No card's Rules text references a Fount, Card Type, zone, or template field not already defined in rules.md — every card is legible against the existing rulebook without inventing new terms. — PASS
- AC7 [inferred] (held_out): The file opens with a short summary stating how many cards it contains and which races/Founts/types they span, so coverage is checkable without counting by hand. — PASS

## 2026-07-28-cardgame-card-anatomy-skeleton-cardgame-design-card-anatomy-shared-skeleton-variable-slots-premium-layers.md

- AC1 [user]: design/cards/card-anatomy.md exists and defines a shared skeleton with named zones including at minimum a frame/border, name slot, cost slot, type line, art window, and rules-text box. — PASS
- AC2 [user]: A section on premium treatments defines at least three treatments (such as borderless, foil, alt-art) each described as a layer on the shared skeleton, and states an explicit cohesion rule about what treatments may not change. — PASS
- AC3 [paraphrase]: Every required field of the rules.md Section 9 card template (Name, Cost line, Type line, Rules text, Stats/counters line for Permanents) is mapped to exactly one skeleton zone, and the mapping is stated in the document. — PASS
- AC4 [inferred]: The variables section states how frame identity is driven by the card's Fount(s), including the rendering rule for cards with more than one Fount in their cost. — PASS
- AC5 [inferred] (held_out): At least two named cards from design/cards/alpha-set.md appear as worked examples walked through the anatomy zone by zone, at least one of which is one of the set's multi-type/multi-cost cards. — PASS

## 2026-07-28-cardgame-design-browser-site-cardgame-tool-design-shelf-browser-website-read-what-we-have-from-the-phone.md

- AC1 [user]: Running `node tools/build-site.js` exits 0 and produces `site/index.html` plus one HTML page for every markdown file under `design/` (recursively) and for `gamePlan.md`. — no receipt (escalated before receipt computation)
- AC2 [user]: The index page links to every generated page, grouped into named sections covering at least World, Races, Characters, Cards, and Rules, with each link's text taken from the source file's first H1 heading. — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: Generated pages render markdown structure as real HTML — a page generated from a design doc containing a table, a bulleted list, and a blockquote contains corresponding table/ul/blockquote elements, not raw markdown syntax. — no receipt (escalated before receipt computation)
- AC4 [inferred]: Every generated page contains a nav element linking back to index.html, and pages contain no external resource references (no http/https URLs in src or href of assets; document links to other generated pages are relative). — no receipt (escalated before receipt computation)
- AC5 [inferred]: The generator is deterministic — running it twice in a row produces identical bytes for every file in site/ (verifiable by hashing). — no receipt (escalated before receipt computation)
- AC6 [inferred] (held_out): The site contains no JavaScript that implements game behavior — generated pages are readable documents only; any script tag present is limited to navigation/display conveniences, and none of the generator's code interprets game rules. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-world-lore-history-cardgame-design-phase-world-lore-history.md

- AC1 [user]: design/lore.md exists in the cardGame repo. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: Contains a named timeline/history section listing at least 4 distinct eras or historical periods in the setting. — no receipt (escalated before receipt computation)
- AC3 [inferred]: Describes at least one central conflict or turning-point event that directly involves 3 or more of the 5 races named in design/races/*.md. — no receipt (escalated before receipt computation)
- AC4 [inferred]: References at least one Fount-related concept already defined in design/rules.md or design/world.md, so the history is grounded in existing game terms rather than inventing new mechanics. — no receipt (escalated before receipt computation)
- AC5 [inferred]: Ends with a short 'current era' section describing the state of the world at the point the Alpha card set is set, giving future card flavor text a fixed narrative anchor. — no receipt (escalated before receipt computation)
- AC6 [inferred] (held_out): The file opens with a summary paragraph naming how many eras/periods it covers and which races the central conflict(s) involve, so scope is checkable without reading the full document. — no receipt (escalated before receipt computation)
- AC7 [inferred] (held_out): No single era or event description exceeds roughly one page (about 500 words), keeping the document skimmable rather than turning into a novel. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-card-authoring-engine-cardgame-tool-deterministic-card-layout-renderer.md

- AC1 [inferred]: Running `node tools/render-card.js` exits 0 and produces exactly one SVG file under renders/cards/ for every card entry found in design/cards/alpha-set.md. — PASS
- AC2 [paraphrase]: The rendered SVG for Signal-Wrought Prototype (Cost line '1 Signal, 1 Circuit') shows a Frame/Border split into two equal vertical bands, cyan then copper left-to-right, matching card-anatomy.md's worked example. — PASS
- AC3 [paraphrase]: The rendered SVG for Sporeknit Warden (Cost line '3 Bloom') shows a single solid green Frame/Border band and a Cost Slot pip reading '3'. — PASS
- AC4 [paraphrase]: A Permanent card whose template includes a Stats/counters line (e.g. Sporeknit Warden) renders that text in a Stats Corner element; a Permanent card with no Stats/counters line (e.g. Signal-Wrought Prototype) contains no Stats Corner element at all, not an empty one. — PASS
- AC5 [inferred]: The Art Window in every rendered card is a placeholder rectangle only — no illustration, no call to any image-generation service, and no game-rule logic anywhere in the script. — PASS
- AC6 [inferred] (held_out): The generator is deterministic: running it twice in a row produces byte-identical SVG output for every file, verifiable by hashing. — PASS

## 2026-07-28-cardgame-tools-shared-parser-dedup-cardgame-tooling-extract-shared-markdown-card-parser-module-dedup-not-growth.md

- AC1 [paraphrase]: lib/parse-card-markdown.js exists and exports a parseCardMarkdown(markdown) function implementing the field-prefix parsing convention ('Cost line:', 'Type line:', 'Rules text:', 'Stats/counters line:') currently duplicated across tools/render-card.js and tools/build-site.js, plus a slugify(name) function matching the existing algorithm. — PASS
- AC2 [inferred]: tools/render-card.js and tools/build-site.js both import parseCardMarkdown and slugify from lib/parse-card-markdown.js; grepping either file for the literal strings 'Cost line:', 'Type line:', 'Rules text:', or 'Stats/counters line:' finds no matches outside lib/parse-card-markdown.js. — PASS
- AC3 [inferred]: node --test passes, and the existing render-card and build-site tests assert the identical output they asserted before this refactor — no behavioral change, pure extraction. — PASS
- AC4 [inferred] (held_out): lib/parse-card-markdown.js has its own direct unit tests (not just exercised indirectly through render-card/build-site) covering at least one card with all four field-prefix lines and one card missing an optional field. — PASS

## 2026-07-28-cardgame-alpha-set-art-briefs-cardgame-design-leonardo-art-briefs-for-the-alpha-set-words-before-art-t9.md

- AC1 [user]: design/cards/art-briefs.md exists and contains exactly one brief section for each of the 18 cards in design/cards/alpha-set.md, matched by name/heading. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: Each brief names the card's Fount-driven color/mood palette (matching the Fount identity table in design/cards/card-anatomy.md) and lists at least 2 concrete visual elements drawn from the card's own rules text or type line, not generic filler. — no receipt (escalated before receipt computation)
- AC3 [inferred]: Each brief includes a one-line composition note referencing the Art Window's aspect ratio/shape as defined in design/cards/card-anatomy.md, so a future compositing pass can generate art that actually fits the slot. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): design/cards/art-briefs.md contains no code, API calls, or references to a specific image-generation implementation — pure creative-brief prose, keeping this a words-first design deliverable per T9. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-jaina-card-sync-dryrun-cardgame-tool-dry-run-sync-of-card-data-into-jaina-content-backbone-slice-1.md

- AC1 [paraphrase]: node tools/sync-cards-to-jaina.js --dry-run exits 0 and prints exactly one JSON object per card record found under design/cards/ (18 for the current alpha-set.md), each object carrying name, slug, costLine, typeLine, rulesText, and statsLine fields sourced by the same 'Cost line:'/'Type line:'/'Rules text:'/'Stats/counters line:' field-prefix parsing convention render-card.js and build-site.js already use. — PASS
- AC2 [inferred]: slug is computed with the identical slugify(name) algorithm already used in tools/render-card.js (lowercase, non-alphanumeric runs collapsed to a single hyphen, leading/trailing hyphens trimmed), so the same card produces the same slug across the card-authoring engine and this sync tool. — PASS
- AC3 [inferred]: Without --dry-run, the script makes no Jaina API calls in this unit — it prints a message that live sync is not yet implemented and exits 1 — so no Jaina credentials or network access are required by node --test or by this unit's acceptance checks. — PASS
- AC4 [inferred] (held_out): Running the dry-run twice in a row against unchanged markdown produces byte-identical stdout output (deterministic: no timestamps, no randomness, stable card and field ordering). — PASS

## 2026-07-28-cardgame-spatial-map-setup-and-playtest-procedure-cardgame-rules-map-setup-section-playtest-on-paper-procedure-for-the-spatial-battlefield.md

- AC1 [paraphrase]: design/rules.md contains a numbered '### 8.8 Map Setup' heading (or equivalent numbered subsection under Section 8) that explicitly states whether the starting map is fixed, drafted, or symmetric, and specifies the starting Planet count and their placement relative to each Homeworld. — PASS
- AC2 [paraphrase]: design/playtest-spatial.md exists and contains a numbered step-by-step procedure that two humans can follow with physical materials (e.g. a drawn graph, tokens, index cards) to set up and play a full game using the Spatial Battlefield rules. — PASS
- AC3 [inferred]: design/playtest-spatial.md's steps cite specific rules.md Section 8 subsection numbers (8.1 through 8.7, plus the new 8.8) at the points where each spatial mechanic first comes into play, so a playtester can cross-check any step against the exact rule text. — PASS
- AC4 [inferred] (held_out): The new 8.8 Map Setup section does not silently redefine any term already defined in Section 2's Glossary (per rules.md's own stated convention that later sections may repeat but not redefine a term). — PASS

## 2026-07-28-cardgame-design-shelf-server-design-shelf-lan-server.md

- AC1 [paraphrase]: tools/serve-site.js exists and starts a Node http server that serves files from the site/ directory — no receipt (escalated before receipt computation)
- AC2 [inferred]: An npm script named site:serve runs tools/serve-site.js — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: The server binds host 0.0.0.0 by default (overridable) so it is reachable from other devices on the same LAN, not just localhost — no receipt (escalated before receipt computation)
- AC4 [inferred]: GET / returns HTTP 200 and the design-shelf index.html body — no receipt (escalated before receipt computation)
- AC5 [inferred] (held_out): Requests for a nonexistent path return HTTP 404 instead of crashing the server process — no receipt (escalated before receipt computation)
- AC6 [inferred] (held_out): Served .html and .svg files include correct Content-Type response headers — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-ideas-inbox-incorporated-tags-cardgame-design-mark-ideas-inbox-md-entries-incorporated-for-four-already-shipped-directives.md

- AC1 [user]: design/ideas-inbox.md's 'characters per race' heading ends with '[incorporated: cardgame-race-characters]'. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: design/ideas-inbox.md's 'card anatomy as layered compound object' and 'deterministic card authoring engine' headings end with '[incorporated: cardgame-card-anatomy-skeleton]' and '[incorporated: cardgame-card-authoring-engine]' respectively. — no receipt (escalated before receipt computation)
- AC3 [inferred]: design/ideas-inbox.md's 'software gate ruling' heading ends with '[incorporated: cardgame-design-browser-site]', and the 'use Jaina as the content backbone' heading remains untagged since its corresponding unit has not shipped yet. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): design/ideas-inbox.md still contains exactly 6 '## ' entry headings after the edit (none added, none removed, none reordered) and every '>' verbatim quote block is byte-identical to before — this unit changes only heading-line tags. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-art-compositing-dryrun-cardgame-tool-mocked-art-compositing-pass-fills-the-art-window-from-the-written-briefs.md

- AC1 [user]: tools/composite-card-art.js exists; running `node tools/composite-card-art.js` exits 0 and writes exactly one composited SVG per brief section in design/cards/art-briefs.md into renders/cards-composited/. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: Each composited SVG's Art Window slot contains an <image> element (not the placeholder rect) positioned and sized to match the Art Window bounds defined in design/cards/card-anatomy.md. — no receipt (escalated before receipt computation)
- AC3 [inferred]: Image generation goes through an injectable client; the default/test client is a deterministic mock that makes no network calls and requires no Leonardo API key, so `node --test` runs fully offline. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): Running the script twice in a row with the mock client produces byte-identical output across all composited SVGs, verifiable by hashing. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-tools-loader-dedup-cardgame-tools-dedupe-loadcardsfromfile-loadallcards-into-lib-parse-card-markdown-js.md

- AC1 [paraphrase]: lib/parse-card-markdown.js exports loadCardsFromFile and loadAllCards, which read design/cards/*.md filenames in sorted order and parse each via parseCardMarkdown. — PASS
- AC2 [inferred]: tools/render-card.js no longer declares its own loadCardsFromFile or loadAllCards functions; it imports both from lib/parse-card-markdown.js. — PASS
- AC3 [inferred]: tools/sync-cards-to-jaina.js no longer declares its own loadCardsFromFile or loadAllCards functions; it imports both from lib/parse-card-markdown.js. — PASS
- AC4 [inferred] (held_out): A new test/tools-loader-dedup.test.js statically asserts neither tools/render-card.js nor tools/sync-cards-to-jaina.js source text contains a local function declaration named loadCardsFromFile or loadAllCards, and the existing render-card/sync-cards-to-jaina/composite-card-art test suites still pass unmodified. — PASS

## 2026-07-28-cardgame-deck-construction-rules-cardgame-rules-section-11-deck-construction.md

- AC1 [paraphrase]: design/rules.md contains a new numbered top-level section titled 'Deck Construction', and it is the sole new section — Sections 1 through 10 remain present, in order, with their original numbers and titles unchanged. — PASS
- AC2 [inferred]: The Deck Construction section states a single fixed minimum number of cards an Archive/deck must contain at the start of a game. — PASS
- AC3 [inferred]: The Deck Construction section states a maximum number of copies of any one uniquely-named card permitted in a single deck. — PASS
- AC4 [inferred] (held_out): The Deck Construction section cross-references Section 10.1's draw-with-empty-Archive elimination condition by section number rather than restating its wording, and a new test/design-deckbuilding.test.js asserts this cross-reference alongside the numbering and content checks above. — PASS

## 2026-07-28-cardgame-frontier-set-spatial-cards-cardgame-cards-frontier-set-5-cards-that-actually-use-the-spatial-battlefield-graph.md

- AC1 [paraphrase]: design/cards/frontier-set.md exists and contains exactly 5 distinct named cards, one per race under design/races/. — no receipt (escalated before receipt computation)
- AC2 [inferred]: Every card uses the canonical template from rules.md Section 9.1 in order (Cost line, then Type line, then Rules text, and, only for Permanents, an optional Stats/counters line after Rules text). — no receipt (escalated before receipt computation)
- AC3 [inferred]: Each card's rules text names at least one of: Discovery, Restriction, Closure, Assault, Blockade, or Capture, and cites the specific rules.md Section 8 subsection number that defines the named term. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): No two Frontier Set cards name the same race, and a new test/design-frontier-cards.test.js asserts this alongside the count, template-order, and spatial-term-citation checks above. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-combat-resolution-rules-cardgame-rules-combat-resolution-blocked-damage-multi-block-assignment-lethal-destruction.md

- AC1 [paraphrase]: design/rules.md contains a new numbered top-level section titled 'Combat Resolution' appended after the current last top-level section, and every previously-existing section keeps its original number and title unchanged. — no receipt (escalated before receipt computation)
- AC2 [inferred]: The Combat Resolution section states that a blocked attacker deals its combat strength as damage to its blocker(s) rather than to the non-active player's Core Integrity. — no receipt (escalated before receipt computation)
- AC3 [inferred]: The Combat Resolution section states who chooses the damage assignment order when a single attacker has more than one blocker. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): The Combat Resolution section states that a Unit with accumulated damage at least equal to its combat strength is destroyed and moved to its owner's Wreck, and states when marked damage on Units is cleared; a new test/design-combat.test.js asserts both facts alongside the section-numbering and blocked-damage checks above. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-targeting-rules-cardgame-rules-section-13-targeting-legal-targets-illegal-target-fizzling.md

- AC1 [paraphrase]: design/rules.md contains a new numbered top-level section titled 'Targeting' appended immediately after the current Section 12 (Combat Resolution), and every previously-existing section keeps its original number and title unchanged. — no receipt (escalated before receipt computation)
- AC2 [inferred]: The Targeting section states that a target is chosen at the moment the targeting card or ability is added to the Queue (Section 6), not later, and that the target must be legal at that moment. — no receipt (escalated before receipt computation)
- AC3 [inferred]: The Targeting section states that a target's legality is rechecked immediately before the entry resolves, and states what happens if an entry with exactly one target finds that target illegal at that recheck (the entry does nothing and is removed from the Queue, i.e. fizzles). — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): The Targeting section includes a worked example, in the style of Sections 7/8.7/10.3/12.5, tracing a Fast card (e.g. Cinderfall Bolt) whose sole target is destroyed by a Response before it resolves, confirming the card fizzles instead of resolving against nothing; a new test/design-targeting.test.js asserts section numbering, the definition/timing rule, the fizzle rule, and the presence of this worked example. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-alpha-full-game-playtest-procedure-cardgame-full-game-playtest-on-paper-procedure-using-the-shipped-alpha-signature-frontier-card-sets.md

- AC1 [paraphrase]: design/playtest-full-game.md exists and contains a numbered, step-by-step procedure two human players can follow with physical materials, starting from deck construction and ending at an explicit win condition being reached. — PASS
- AC2 [inferred]: Every card named in the walkthrough exists by exact name in one of design/cards/alpha-set.md, design/cards/character-signatures.md, or design/cards/frontier-set.md. — PASS
- AC3 [inferred]: Each major step (turn start, resource use, combat, capture/win) cites the specific rules.md section number that governs it, and a new test verifies every cited section number corresponds to a section that actually exists in rules.md. — PASS
- AC4 [inferred] (held_out): The unit does not modify design/rules.md, design/cards/alpha-set.md, design/cards/character-signatures.md, or design/cards/frontier-set.md — it only reads and cites them, carrying zero merge-conflict risk with the concurrently in-flight cardgame-targeting-rules unit. — PASS

## 2026-07-28-cardgame-jaina-card-sync-live-cardgame-tool-live-sync-of-card-records-to-jaina-extends-dry-run-tool-slice-2.md

- AC1 [paraphrase]: Without --dry-run, the script calls an injectable Jaina client's upsert function once per parsed card record, then prints a one-line summary (e.g. record count synced) and exits 0 on success; the production client is constructed only when JAINA_API_KEY and JAINA_PROJECT_ID are both present in the environment. — no receipt (escalated before receipt computation)
- AC2 [inferred]: node --test exercises the live-sync (non-dry-run) code path using a fake/injected Jaina client — no require('http'), require('https'), or fetch() call reaches an external host during the test run, keeping the suite network-free and deterministic like every other unit in this repo. — no receipt (escalated before receipt computation)
- AC3 [inferred]: If JAINA_API_KEY or JAINA_PROJECT_ID is missing when the script is invoked without --dry-run, it exits 1 and prints a clear 'Jaina credentials not configured' message instead of throwing an unhandled exception or silently no-op'ing. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): --dry-run mode's output and behavior are unchanged byte-for-byte from the merged dry-run unit (same NDJSON records, still makes zero client/network calls) — this unit only adds behavior to the no-flag path. — no receipt (escalated before receipt computation)

## 2026-07-28-cardgame-art-live-leonardo-client-real-leonardo-art-client-for-the-card-compositing-tool.md

- AC1 [inferred]: Passing --live to tools/composite-card-art.js constructs a LeonardoArtClient that sends one image-generation request per brief using LEONARDO_API_KEY; tests inject a mock HTTP transport (no real network call, no real spend) and assert the request is well-formed. — PASS
- AC2 [paraphrase]: With no --live flag, behavior is unchanged from the merged dry-run: the deterministic mock client runs, no LEONARDO_API_KEY is read, and output is byte-identical to the existing renders/cards-composited/ baseline. — PASS
- AC3 [inferred]: If --live is passed but LEONARDO_API_KEY is unset, the script exits non-zero with an error naming the missing env var instead of attempting a malformed request. — PASS
- AC4 [inferred] (held_out): The live client's prompt for each card is built from that specific card's art-briefs.md section (palette, subject/scene, key visual elements) rather than a generic template, so each of the 18 cards yields a distinct prompt. — PASS

## 2026-07-29-cardgame-jaina-card-sync-live-cardgame-tool-live-sync-of-card-records-to-jaina-extends-dry-run-tool-slice-2.md

- AC1 [paraphrase]: Without --dry-run, the script calls an injectable Jaina client's upsert function once per parsed card record, then prints a one-line summary (e.g. record count synced) and exits 0 on success; the production client is constructed only when JAINA_API_KEY and JAINA_PROJECT_ID are both present in the environment. — no receipt (escalated before receipt computation)
- AC2 [inferred]: node --test exercises the live-sync (non-dry-run) code path using a fake/injected Jaina client — no require('http'), require('https'), or fetch() call reaches an external host during the test run, keeping the suite network-free and deterministic like every other unit in this repo. — no receipt (escalated before receipt computation)
- AC3 [inferred]: If JAINA_API_KEY or JAINA_PROJECT_ID is missing when the script is invoked without --dry-run, it exits 1 and prints a clear 'Jaina credentials not configured' message instead of throwing an unhandled exception or silently no-op'ing. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): --dry-run mode's output and behavior are unchanged byte-for-byte from the merged dry-run unit (same NDJSON records, still makes zero client/network calls) — this unit only adds behavior to the no-flag path. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-ideas-inbox-jaina-sync-tag-tag-the-jaina-content-backbone-idea-as-incorporated.md

- AC1 [user]: design/ideas-inbox.md's 'use Jaina as the content backbone' heading ends with '[incorporated: cardgame-jaina-card-sync-live]'. — FAIL
- AC2 [paraphrase]: test/design-ideas-inbox.test.js's existing test asserting that heading 'remains untagged' is replaced with a test asserting it now ends with '[incorporated: cardgame-jaina-card-sync-live]'; no other existing test in the file is weakened, removed, or renamed. — FAIL
- AC3 [inferred]: All six other '## ' headings and their existing [incorporated: ...] tags in design/ideas-inbox.md are byte-identical to before this edit, and every '>' verbatim quote block in the file is unchanged. — FAIL
- AC4 [inferred] (held_out): design/ideas-inbox.md still contains exactly 7 '## ' entry headings after the edit, in the same order, none added or removed, and `node --test` passes with no other test file needing modification. — FAIL

## 2026-07-29-cardgame-keyword-abilities-rules-keyword-abilities-rules-amaranth-expanse-rules-evergreen-combat-utility-keywords.md

- AC1 [inferred]: design/rules.md gains a new numbered section (e.g. 'Keyword Abilities') defining at least 5 distinct named keyword abilities, each explicitly tied to exactly one of the five Founts (Mass, Bloom, Signal, Circuit, Tangle) and consistent with that Fount's identity as established in design/world.md and the corresponding race file. — no receipt (escalated before receipt computation)
- AC2 [inferred]: Each keyword ability has its own numbered subsection stating its full rules-text meaning precisely enough that a future card could invoke the keyword by name alone with no further explanation needed. — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: Each new keyword's name is added to the Section 2 glossary before its substantive use later in the document, consistent with rules.md's existing glossary-first discipline already followed by every prior section. — no receipt (escalated before receipt computation)
- AC4 [paraphrase]: The new section includes at least one numbered worked example applying one or more of the new keywords to a concrete hypothetical game state, matching the same worked-example rigor used by Section 7, 8.7, 10.3, 12.5, and 13.3. — no receipt (escalated before receipt computation)
- AC5 [inferred] (held_out): design/cards/alpha-set.md, frontier-set.md, and character-signatures.md are byte-identical to before this unit — no existing card's rules text is rewritten to use a new keyword, and no other rules.md section is altered besides the new section and its Section 2 glossary additions. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-fount-economy-generators-close-the-bloom-signal-tangle-generator-gap-the-full-game-playtest-found.md

- AC1 [paraphrase]: design/cards/fount-economy-set.md exists and contains exactly 6 distinct named cards, each with Cost line, Type line, and Rules text in that order (and a Stats/counters line, only if present, only on Permanents) — the same template test/design-frontier-cards.test.js already enforces for frontier-set.md. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: Exactly one of the 6 cards is a Permanent whose rules text reads as a Generator attuned to Bloom, exactly one to Signal, and exactly one to Tangle, each producing 1 point of that Fount during the Generation Phase and citing Section 5.2, matching the existing 'This permanent is a Generator attuned to the <Fount>' pattern used by Salvage-Wrought Bastion and Replicant Foundry Core. — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: Exactly one of the 6 cards (distinct from the three Generators above) has a Cost line of exactly '1 Circuit', exactly one has 'exactly 1 Bloom', and exactly one has exactly '1 Tangle'. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): design/cards/alpha-set.md, design/cards/frontier-set.md, and design/cards/character-signatures.md are byte-identical to before this unit, and each new card's flavor text names the correct race per the existing Cindral Reach/Mireth Bloom/Panoptic Concord/Starweave Communion/Wrought Assembly-to-Fount mapping used in frontier-set.md. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-world-star-atlas-name-each-race-s-homeworld-and-a-shared-star-atlas-of-frontier-worlds.md

- AC1 [paraphrase]: design/star-atlas.md exists and names exactly one Homeworld, with a distinct proper name, for each of the five races as titled in their design/races/<race>.md files — Cindral Reach, Mireth Bloom, Panoptic Concord, Starweave Communion, and Wrought Assembly. — PASS
- AC2 [inferred]: None of the 5 Homeworld names, nor any of the additional frontier-world names, is 'Solmere' or 'Kethis' (rules.md Section 8.2's illustration-only placeholder names), and no two named worlds in star-atlas.md share the same name. — PASS
- AC3 [paraphrase]: Each Homeworld's description names its race's primary Fount (Mass/Bloom/Signal/Circuit/Tangle, per design/world.md's Cosmology section) and is consistent with that race's role in design/lore.md's Cinderglass War section (in particular, the Mireth Bloom's Homeworld entry must not describe it fighting battles in the Cinderglass War, consistent with lore.md's statement that the Bloom inherits the war's wreckage rather than fighting in it). — PASS
- AC4 [inferred] (held_out): design/star-atlas.md separately names at least 3 additional worlds that are not listed as any race's Homeworld, each with at least one sentence of description; design/world.md, design/lore.md, design/rules.md, design/playtest-spatial.md, and every file under design/races/ and design/cards/ remain byte-identical to before this unit. — PASS

## 2026-07-29-cardgame-character-signature-cards-wave-2-second-wave-of-character-signature-cards-one-more-per-race.md

- AC1 [paraphrase]: design/cards/character-signatures-wave-2.md exists and contains exactly 5 distinct named cards, one per race under design/races/, and none of the 5 names collides with any name in design/cards/character-signatures.md. — FAIL
- AC2 [paraphrase]: Every card in the new file has a Cost line, Type line, and Rules text in that order, and only carries a Stats/counters line after Rules text when its Type line contains 'Permanent' — the same template enforced by test/design-signature-cards.test.js for the shipped wave. — FAIL
- AC3 [inferred]: Each of the 5 new cards' combined rules text and flavor text names both its own race's title (as printed in that race's design/races/ file) and exactly one character drawn from that race's own design/characters/ file, and that named character is not the one already named in design/cards/character-signatures.md. — FAIL
- AC4 [inferred] (held_out): design/cards/character-signatures.md, design/cards/alpha-set.md, design/cards/frontier-set.md, and all files under design/characters/ and design/races/ are byte-identical to before this unit — only the new card file and its new test file are added. — FAIL

## 2026-07-29-cardgame-art-briefs-frontier-signatures-extend-art-briefs-to-the-frontier-set-and-character-signatures-cards.md

- AC1 [paraphrase]: design/cards/art-briefs.md gains exactly one new '###' brief section per card in design/cards/frontier-set.md and design/cards/character-signatures.md (10 new sections total), each titled to match that card's heading verbatim, with no duplicates and none of the 18 existing alpha-set.md brief sections removed, renamed, or altered. — PASS
- AC2 [paraphrase]: Each of the 10 new brief sections has a 'Palette:' line naming the correct Fount-driven color(s) from card-anatomy.md's Fount identity table, matching the Founts named in that card's own Cost line. — PASS
- AC3 [paraphrase]: Each of the 10 new brief sections has a 'Key visual elements:' list of at least 2 bullets that are card-specific (overlap at least 2 significant words with that card's own Rules text or Type line) rather than generic filler phrasing. — PASS
- AC4 [inferred] (held_out): Each of the 10 new brief sections has a 'Composition:' line referencing the Art Window's rectangular/landscape shape and an aspect ratio (matching the existing alpha-set briefs' composition-note pattern), and design/cards/alpha-set.md, frontier-set.md, and character-signatures.md are byte-identical to before this unit — only art-briefs.md and its test file change. — PASS

## 2026-07-29-cardgame-keyword-abilities-rules-keyword-abilities-rules-amaranth-expanse-rules-evergreen-combat-utility-keywords.md

- AC1 [inferred]: design/rules.md gains a new numbered section (e.g. 'Keyword Abilities') defining at least 5 distinct named keyword abilities, each explicitly tied to exactly one of the five Founts (Mass, Bloom, Signal, Circuit, Tangle) and consistent with that Fount's identity as established in design/world.md and the corresponding race file. — PASS
- AC2 [inferred]: Each keyword ability has its own numbered subsection stating its full rules-text meaning precisely enough that a future card could invoke the keyword by name alone with no further explanation needed. — PASS
- AC3 [paraphrase]: Each new keyword's name is added to the Section 2 glossary before its substantive use later in the document, consistent with rules.md's existing glossary-first discipline already followed by every prior section. — PASS
- AC4 [paraphrase]: The new section includes at least one numbered worked example applying one or more of the new keywords to a concrete hypothetical game state, matching the same worked-example rigor used by Section 7, 8.7, 10.3, 12.5, and 13.3. — PASS
- AC5 [inferred] (held_out): design/cards/alpha-set.md, frontier-set.md, and character-signatures.md are byte-identical to before this unit — no existing card's rules text is rewritten to use a new keyword, and no other rules.md section is altered besides the new section and its Section 2 glossary additions. — PASS

## 2026-07-29-cardgame-wormhole-restriction-cards-wormhole-restriction-cards-the-locks-keys-tolls-design-space-rules-md-left-open.md

- AC1 [paraphrase]: design/cards/wormhole-restrictions-set.md exists and contains exactly 5 distinct named cards, one per race under design/races/, each with a Cost line, Type line, and Rules text in that order, and a Stats/counters line only when its Type line contains 'Permanent' — the same template test/design-frontier-cards.test.js enforces for frontier-set.md. — PASS
- AC2 [paraphrase]: Every one of the 5 cards' Rules text explicitly places a Directional Restriction or a Team Restriction (as defined in rules.md Section 8.4) onto a Wormhole, and cites 'Section 8.4' by number; no card's Rules text creates or references a Unit-type Restriction. — PASS
- AC3 [paraphrase]: Each card's Cost line names exactly the Fount matching its race per the existing race-to-Fount mapping used in frontier-set.md (Cindral Reach/Mass, Mireth Bloom/Bloom, Panoptic Concord/Signal, Starweave Communion/Tangle, Wrought Assembly/Circuit). — PASS
- AC4 [inferred] (held_out): design/rules.md, design/cards/alpha-set.md, design/cards/frontier-set.md, and design/cards/character-signatures.md are byte-identical to before this unit, and none of the 5 new card names collides with any card name already printed in those three files. — PASS

## 2026-07-29-cardgame-render-engine-premium-layers-render-engine-implement-the-borderless-foil-and-extended-art-premium-layers-from-card-anatomy-md.md

- AC1 [paraphrase]: tools/render-card.js's renderCardSvg function accepts a treatment argument with values 'base' (default when omitted), 'borderless', 'foil', and 'extended-art'; calling it with 'base' or with no treatment argument at all produces byte-identical SVG output, for every card currently loaded by loadAllCards(), to what renderCardSvg(card) produces today. — PASS
- AC2 [paraphrase]: For the 'borderless' treatment, the rendered SVG contains no frame-band rect element with a width equal to its base-treatment width (each frame-band is either absent or rendered at a fixed thin-edge width materially smaller than the base treatment's), and the art-window element's width and height equal the full card width and height (CARD_WIDTH/CARD_HEIGHT) rather than the base treatment's margin-inset Art Window dimensions. — PASS
- AC3 [paraphrase]: For the 'foil' treatment, every frame-band element carries a data-foil="true" attribute, and for the same card each frame-band's x, y, width, height, and fill values are identical between the 'foil' and 'base' treatment outputs. — PASS
- AC4 [paraphrase]: For the 'extended-art' treatment, the art-window element's rendered height is greater than its base-treatment height (it bleeds upward into the Name Slot/Type Line region), while the Name Slot's and Type Line's text elements are present with the exact same text content and the exact same x/y coordinates as in the base treatment. — PASS
- AC5 [inferred] (held_out): Across all four treatments ('base', 'borderless', 'foil', 'extended-art') rendered for the same card, the Name Slot text, Cost Slot pip values and order, Type Line text, Rules-Text Box text, and Stats Corner presence-and-content (when the card has one) are byte-identical in every treatment's SVG output, and design/cards/*.md and tools/composite-card-art.js remain byte-identical to before this unit. — PASS

## 2026-07-29-cardgame-alt-art-briefs-compositing-alt-art-briefs-and-compositing-the-fourth-layer-treatment-card-anatomy-md-defines-but-no-tool-touches.md

- AC1 [paraphrase]: design/cards/alt-art-briefs.md exists and contains exactly 3 '###' brief sections, titled 'Sporeknit Warden', 'Salvage-Wrought Bastion', and 'Replicant Foundry Core' verbatim, each with Palette/Subject-Scene/Key-visual-elements/Composition lines in the same shape art-briefs.md's existing briefs use. — no receipt (escalated before receipt computation)
- AC2 [inferred]: Each of the 3 new briefs' Subject/Scene line has fewer than half its significant words in common with that same card's existing base brief in design/cards/art-briefs.md, so it describes a genuinely alternate scene rather than a restatement. — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: Running node tools/composite-card-art.js (mock client) writes renders/cards-composited/<slug>.svg for all 18 alpha-set cards unchanged in content from a run before this unit, plus exactly 3 new files named <slug>-alt.svg for the three cards named in alt-art-briefs.md, and no other card gets a '-alt.svg' file. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): For each of the 3 cards, the Name Slot, Cost Slot, Type Line, Rules-Text Box, and Stats Corner content in <slug>-alt.svg is byte-identical to the same elements in <slug>.svg from the same run, and only the art-window image element's href differs; design/cards/art-briefs.md, alpha-set.md, frontier-set.md, character-signatures.md, and tools/render-card.js remain byte-identical to before this unit. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-spatial-rules-notes-reconciliation-reconcile-routerbox-s-unresolved-inline-design-notes-in-rules-md-section-8-into-finished-rules-text.md

- AC1 [paraphrase]: design/rules.md contains no remaining <strikethrough> tags and no lines beginning with a `//` inline comment anywhere in the document. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: Section 8.1 states, in finished numbered-rules prose (not a struck-through or commented passage), that each Unit occupies and has a tracked location at a specific Planet, and Section 8.4's Unit-type Restriction subsection no longer states the Restriction is inert or exists only for future cards. — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: Section 8.3's Discovery cost rule states that, for Discoveries of the same kind (Frontier or Contested), a Wormhole of lesser Length costs more Fount Points to open than one of greater Length, while a Contested Discovery still costs exactly double what a Frontier Discovery of the same Length costs. — no receipt (escalated before receipt computation)
- AC4 [paraphrase]: Section 8.6 states that Blockading a Planet requires the assaulting challenger's Units to be present at that Planet and to deal damage totaling at least the number of Generators on it, and that Capturing an already-Blockaded Planet requires dealing that same damage total again. — no receipt (escalated before receipt computation)
- AC5 [inferred] (held_out): Every assertion in test/design-battlefield.test.js that existed before this unit (Blockade halts Generator production, Capture destroys the Generator into the Wreck, wormholes remain restrictable by direction/team/unit-type, Sections 1-7 remain unchanged and in order before Section 8) still passes against the rewritten Section 8 text. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-card-template-test-helper-dedup-extract-the-duplicated-section-9-1-card-template-check-into-a-shared-test-helper.md

- AC1 [paraphrase]: test/helpers/card-template.js exists and exports a function that, given a card's title and body text, registers the same two checks currently duplicated in design-cards.test.js, design-frontier-cards.test.js, and design-signature-cards.test.js: Cost line -> Type line -> Rules text ordering, and Stats/counters line only present and only after Rules text when the Type line contains 'Permanent'. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: design-cards.test.js, design-frontier-cards.test.js, and design-signature-cards.test.js no longer contain their own inline implementation of the Cost/Type/Rules-text-order and Stats-line-only-if-Permanent checks — each calls the shared helper from test/helpers/card-template.js instead. — no receipt (escalated before receipt computation)
- AC3 [inferred] (held_out): Running `node --test` produces the same number of passing and failing tests for design-cards.test.js, design-frontier-cards.test.js, and design-signature-cards.test.js after the refactor as it did before, run against the current unmodified design/cards/*.md files. — no receipt (escalated before receipt computation)
- AC4 [inferred]: No file under design/ is modified by this unit — git diff against design/ is empty; only files under test/ change. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-wormhole-closure-cards-wormhole-closure-cards-the-cut-a-chokepoint-strand-a-fleet-half-of-the-spatial-layer-directive-rules-md-leaves-unused.md

- AC1 [paraphrase]: design/cards/wormhole-closure-cards.md exists and contains exactly 5 distinct named cards, one per race under design/races/, each with a Cost line, Type line, and Rules text in that order, and a Stats/counters line only when its Type line contains 'Permanent' — the same template test/design-frontier-cards.test.js enforces for frontier-set.md. — PASS
- AC2 [paraphrase]: Every one of the 5 cards' Rules text explicitly Closes a Wormhole (as defined in rules.md Section 8.5) and cites 'Section 8.5' by number; no card's Rules text merely adds, removes, or modifies a Restriction (Section 8.4) without also Closing the Wormhole. — PASS
- AC3 [paraphrase]: Each card's Cost line names exactly the Fount matching its race per the existing race-to-Fount mapping used in frontier-set.md (Cindral Reach/Mass, Mireth Bloom/Bloom, Panoptic Concord/Signal, Starweave Communion/Tangle, Wrought Assembly/Circuit). — PASS
- AC4 [inferred] (held_out): design/rules.md, design/cards/alpha-set.md, design/cards/frontier-set.md, and design/cards/character-signatures.md are byte-identical to before this unit, and none of the 5 new card names collides with any card name already printed in those three files. — PASS

## 2026-07-29-cardgame-site-embeds-composited-card-art-show-composited-card-art-on-the-design-shelf-site-s-card-pages.md

- AC1 [paraphrase]: For every card whose name (from a design/cards/*.md '###' heading) matches a file renders/cards-composited/<slug>.svg (slug computed via lib/parse-card-markdown.js's slugify, the same function tools/composite-card-art.js uses to name its output), running node tools/build-site.js produces a site/ page containing an <img> tag whose src, resolved relative to that page's own output path, points at an existing file inside site/ whose bytes are byte-identical to the source renders/cards-composited/<slug>.svg. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: For a card with no matching file in renders/cards-composited/, the generated page for that card's source file contains no <img class="card-art"> tag referencing that card, and node tools/build-site.js exits 0 (does not throw) when some or all cards in a page lack a composited render. — no receipt (escalated before receipt computation)
- AC3 [inferred]: Every copied site/-local card-art SVG file lives at a path under site/ that tools/serve-site.js's resolveFilePath() (from test/build-site.test.js's existing SITE_DIR-containment convention) would resolve and serve successfully, i.e. no card-art <img src> is an absolute filesystem path or a path that escapes site/. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): Running node tools/composite-card-art.js then node tools/build-site.js twice in a row produces a byte-identical site/ tree (including the copied card-art SVGs) on the second run as the first, and every existing assertion in test/build-site.test.js against pages for non-card sections (World, Races, Characters, Rules, Plans & Ideas) still passes unchanged. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-spatial-rules-notes-reconciliation-reconcile-routerbox-s-unresolved-inline-design-notes-in-rules-md-section-8-into-finished-rules-text.md

- AC1 [paraphrase]: design/rules.md contains no remaining <strikethrough> tags and no lines beginning with a `//` inline comment anywhere in the document. — PASS
- AC2 [paraphrase]: Section 8.1 states, in finished numbered-rules prose (not a struck-through or commented passage), that each Unit occupies and has a tracked location at a specific Planet, and Section 8.4's Unit-type Restriction subsection no longer states the Restriction is inert or exists only for future cards. — PASS
- AC3 [paraphrase]: Section 8.3's Discovery cost rule states that, for Discoveries of the same kind (Frontier or Contested), a Wormhole of lesser Length costs more Fount Points to open than one of greater Length, while a Contested Discovery still costs exactly double what a Frontier Discovery of the same Length costs. — PASS
- AC4 [paraphrase]: Section 8.6 states that Blockading a Planet requires the assaulting challenger's Units to be present at that Planet and to deal damage totaling at least the number of Generators on it, and that Capturing an already-Blockaded Planet requires dealing that same damage total again. — PASS
- AC5 [inferred] (held_out): Every assertion in test/design-battlefield.test.js that existed before this unit (Blockade halts Generator production, Capture destroys the Generator into the Wreck, wormholes remain restrictable by direction/team/unit-type, Sections 1-7 remain unchanged and in order before Section 8) still passes against the rewritten Section 8 text. — PASS

## 2026-07-29-cardgame-site-all-cards-index-cardgame-design-shelf-site-one-browsable-all-cards-index-across-every-card-set-file.md

- AC1 [inferred]: After running node tools/build-site.js, site/cards-index.html exists and contains exactly one entry per card across every design/cards/*.md file — the same total count loadAllCards() (or an equivalent full walk of design/cards/) returns for the current catalog. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: Each entry in cards-index.html shows that card's name, its Cost line text, and its Type line text, and its name links via a relative href to the generated page for the design/cards/*.md file it came from. — no receipt (escalated before receipt computation)
- AC3 [inferred]: site/index.html contains a link to cards-index.html; running node tools/build-site.js twice in a row produces byte-identical site/ output (including cards-index.html) on both runs. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): No pre-existing generated page's content changes as a result of this unit (per-file card pages render identically to before), and every existing assertion in test/build-site.test.js still passes. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-spatial-race-identity-cards-race-identity-spatial-cards-concord-s-cheap-discovery-communion-s-bent-restrictions-reach-s-fortified-wormholes.md

- AC1 [paraphrase]: design/cards/spatial-race-identity-set.md exists and contains exactly 3 distinct named cards — one under Panoptic Concord, one under Starweave Communion, one under Cindral Reach (per design/races/) — each with a Cost line, Type line, and Rules text in that order, and a Stats/counters line only when its Type line contains 'Permanent', matching the template test/design-frontier-cards.test.js enforces for frontier-set.md. — PASS
- AC2 [paraphrase]: The Panoptic Concord card's Cost line names the Signal Fount, and its Rules text explicitly reduces the Fount Point cost of a Discovery action, citing 'Section 8.3' by number. — PASS
- AC3 [paraphrase]: The Starweave Communion card's Cost line names the Tangle Fount, and its Rules text explicitly lets its controller's Assault treat a Directional or Team Restriction on a Wormhole as absent for the purpose of counting that Assault's path, citing both 'Section 8.4' and 'Section 8.6' by number. — PASS
- AC4 [inferred] (held_out): The Cindral Reach card's Cost line names the Mass Fount, its Rules text explicitly prevents a specified Wormhole from being Closed while a stated condition holds, citing 'Section 8.5' by number; design/rules.md and every other file under design/cards/ remain byte-identical to before this unit, and none of the 3 new card names collides with any card name already printed in alpha-set.md, frontier-set.md, or character-signatures.md. — PASS

## 2026-07-29-cardgame-art-briefs-fount-economy-art-briefs-for-the-fount-economy-set-the-one-card-file-composite-card-art-js-can-never-render.md

- AC1 [paraphrase]: design/cards/art-briefs.md gains exactly 6 new '###' sections, titled exactly 'Cradle-Root Colony', 'Sporeling Latch', 'Panoptic Relay Spire', 'Communion Waystone', 'Whispered Rite', and 'Stamped Chassis Unit' verbatim, with none of the pre-existing brief sections (alpha-set.md's 18, plus any already added for frontier-set.md/character-signatures.md) removed, renamed, or altered. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: Each of the 6 new briefs' Palette line names the Fount-driven color from card-anatomy.md's Fount identity table for every Fount named in that card's own Cost line — e.g. Panoptic Relay Spire (Cost: 1 Signal, 1 Circuit) names both Cyan and Copper; Communion Waystone (Cost: 1 Tangle, 1 Mass) names both Violet and Ash-grey. — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: Each of the 6 new briefs has a 'Key visual elements:' list of at least 2 bullets sharing at least 2 significant words with that card's own Type line or Rules text (not generic filler phrasing), and a 'Composition:' line naming the Art Window's rectangular/landscape shape and an aspect ratio. — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): test/design-art-briefs-fount-economy.test.js exists and enforces the above against the real, current fount-economy-set.md and art-briefs.md content; design/cards/alpha-set.md, frontier-set.md, character-signatures.md, and fount-economy-set.md, plus the pre-existing test/design-art-briefs.test.js, remain byte-identical to before this unit. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-graph-driven-generation-resolve-rules-md-section-5-2-s-unbuilt-graph-economy-note-fount-points-tied-to-planets-controlled-not-just-generators.md

- AC1 [paraphrase]: design/rules.md contains a numbered subsection titled 'Graph-Driven Generation' under Section 4 (Resources), immediately after the existing 4.6 Positional Generators subsection. — PASS
- AC2 [paraphrase]: That subsection states the active player gains one bonus Fount Point, of a single Fount they choose, during the Generation Phase, for every Planet beyond their Homeworld that they currently control. — PASS
- AC3 [paraphrase]: Section 5.2 (Generation Phase) contains no line beginning with a `//` inline comment, and its prose references the new Graph-Driven Generation subsection by number. — PASS
- AC4 [inferred] (held_out): design/rules.md's top-level section numbering remains strictly sequential starting at 1, Sections 1-3 and 6-10 are byte-identical to before this unit, and every pre-existing assertion in test/design-battlefield.test.js and test/design-rules.test.js still passes. — PASS

## 2026-07-29-cardgame-conflict-phase-movement-rules-rewrite-rules-md-section-5-4-conflict-phase-to-define-unit-movement-and-location-aware-attacking-blocking-replacing-the-placeholder-combat-text.md

- AC1 [paraphrase]: design/rules.md Section 5.4 contains no lines beginning with a `//` inline comment. — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: Section 5.4 states, in numbered rules prose, that the active player may take a Movement action during the Conflict Phase moving one of their Ready Units across a single Wormhole to an adjacent Planet. — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: Section 5.4 states that a Unit that moved this turn cannot be declared as an attacker this turn, unless a card or ability specifically says otherwise. — no receipt (escalated before receipt computation)
- AC4 [paraphrase]: Section 5.4 states that a Unit may only be declared as a blocker against an attacker if that Unit occupies the same Planet as the Planet being attacked. — no receipt (escalated before receipt computation)
- AC5 [inferred]: Section 5.4 states a Fount Point cost for the Movement action equal to the traversed Wormhole's Length. — no receipt (escalated before receipt computation)
- AC6 [inferred] (held_out): Every pre-existing assertion in test/design-rules.test.js and test/design-combat.test.js continues to pass against the rewritten Section 5.4 text. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-site-world-section-categorization-design-shelf-site-buries-lore-md-and-star-atlas-md-in-a-generic.md

- AC1 [paraphrase]: sectionFor('design/lore.md') and sectionFor('design/star-atlas.md') both return 'World' — verified by running node tools/build-site.js and checking that the generated site/index.html's World section contains links to both lore.html and star-atlas.html alongside world.html. — PASS
- AC2 [paraphrase]: No generated page for design/lore.md or design/star-atlas.md appears under an 'Other' section heading in site/index.html after this unit. — PASS
- AC3 [inferred]: Every other existing section's membership (Races, Characters, Cards, Rules, Plans & Ideas) is unchanged from before this unit, and design/playtest-full-game.md and design/playtest-spatial.md remain classified as 'Other' (not moved by this unit). — PASS
- AC4 [inferred] (held_out): Running node tools/build-site.js twice in a row produces byte-identical site/ output on both runs, matching the existing determinism guarantee already covered by test/build-site.test.js. — PASS
- AC5 [inferred] (held_out): test/build-site.test.js is updated to assert the new World-section membership against the real, current design/lore.md and design/star-atlas.md files, and every pre-existing assertion in that file still passes. — PASS

## 2026-07-29-cardgame-art-briefs-character-signatures-wave-2-art-briefs-for-character-signatures-wave-2-the-one-shipped.md

- AC1 [paraphrase]: design/cards/art-briefs.md gains exactly 5 new '###' sections, titled exactly 'Torel Ashgrave, Line-Captain of the Ember Vanguard', 'Rathe Ossuary-Kin, Spore-Hound of the Sprawl', 'Doran Vex Amaranthine, Ledger-Warden of the Foreknowledge Archive', 'Ysolde Thane, Pilgrim of the Unwritten Sign', and 'Foreman-Prime Yssa Ductile, Keeper of the First Pattern' verbatim, with no pre-existing brief section removed, renamed, or altered. — PASS
- AC2 [paraphrase]: Each new brief's Palette line names the single Fount-driven color from card-anatomy.md's Fount identity table matching the Fount named in that card's own Cost line (Ash-grey for Mass, Green for Bloom, Cyan for Signal, Violet for Tangle, Copper for Circuit). — PASS
- AC3 [paraphrase]: Each new brief has a 'Key visual elements:' list of at least 2 bullets sharing at least 2 significant words with that card's own Rules text or flavor text (not generic filler phrasing), and a 'Composition:' line naming the Art Window's rectangular/landscape shape and an aspect ratio. — PASS
- AC4 [inferred] (held_out): test/design-art-briefs-character-signatures-wave-2.test.js exists and enforces the above against the real, current character-signatures-wave-2.md and art-briefs.md content; every other card file and the pre-existing art-briefs test files remain byte-identical to before this unit. — PASS

## 2026-07-29-cardgame-playtest-fount-economy-refresh-correct-playtest-full-game-md-s-stale-only-mass-and-circuit-are-su.md

- AC1 [paraphrase]: design/playtest-full-game.md's 'What This Playtest Surfaced' table no longer states 'none' in the Generator column for the Bloom, Signal, or Tangle rows; each names an actual Generator card (Cradle-Root Colony, Panoptic Relay Spire, Communion Waystone respectively). — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: The prose in 'What This Playtest Surfaced' no longer claims Combat cannot occur through ordinary play with 'the 28 cards currently named' unqualified by the existence of fount-economy-set.md's 6 additional cards. — no receipt (escalated before receipt computation)
- AC3 [paraphrase]: A new Worked Example subsection demonstrates a Bloom-Fount economy: Cradle-Root Colony producing Bloom Points across Generation Phases until Feral Bloomcaller or Rootbind Thicket is played and later declared as an attacker in the Conflict Phase, citing exact rules.md section numbers throughout, in the same style as the file's pre-existing Combat and Capture Worked Examples. — no receipt (escalated before receipt computation)
- AC4 [inferred]: Every card named in the new Worked Example exists by exact name in design/cards/alpha-set.md or design/cards/fount-economy-set.md. — no receipt (escalated before receipt computation)
- AC5 [inferred] (held_out): The file's two pre-existing 40-card decklists (Ada's Mass deck, Kestrel's Circuit deck) and every numbered Procedure step outside 'What This Playtest Surfaced' and the Worked Examples area are left unchanged. — no receipt (escalated before receipt computation)
- AC6 [inferred] (held_out): `node --test` passes, including every pre-existing assertion in test/design-full-game-playtest.test.js. — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-rules-game-start-procedure-formalize-the-game-start-procedure-shuffling-first-player-determinatio.md

- AC1 [paraphrase]: design/rules.md gains a new top-level section '## 15. Starting the Game' appearing immediately after Section 14 (Keyword Abilities) ends; every existing Section 1-14 heading and its numbering is byte-identical to before this unit. — PASS
- AC2 [paraphrase]: The new section states, in rules prose, that each challenger shuffles their Archive before the game begins, cross-referencing Section 3 (Zones) and Section 11.1's 40-card minimum, and states a specific, unambiguous numbered procedure for determining which challenger takes the first turn of the game. — PASS
- AC3 [paraphrase]: The new section states a specific numeric opening hand size and a mulligan procedure (shuffle the hand back into the Archive, redraw the same size) with an explicit stated cap on how many times a single challenger may take it, and that procedure is written to remain consistent with Section 5.1's existing 'first-turn challenger does not draw during their first Dawn Phase' exception rather than contradict it. — PASS
- AC4 [paraphrase]: A Worked Example subsection, in the same cited, numbered style as the file's existing Worked Examples (e.g. Sections 8.7, 10.3, 11.3), walks through game start for two challengers — shuffling, first-player determination, opening hands dealt, one challenger taking a mulligan — citing exact section numbers throughout. — PASS
- AC5 [inferred] (held_out): test/design-rules-game-start.test.js exists and enforces all of the above against the real, current design/rules.md content; every pre-existing test file's assertions still pass unchanged. — PASS

## 2026-07-29-cardgame-art-briefs-wormhole-restrictions-art-briefs-for-the-wormhole-restrictions-set-the-one-shipped-car.md

- AC1 [paraphrase]: design/cards/art-briefs.md gains exactly 5 new '###' sections, titled exactly 'Bastion Lockdown Line', 'Conveyance Directive', 'Rootbound Corridor', 'Vector Interdiction', and 'Pilgrim's Right of Way' verbatim, with no pre-existing brief section removed, renamed, or altered. — PASS
- AC2 [paraphrase]: Each new brief's Palette line names the single Fount-driven color from card-anatomy.md's Fount identity table matching the one Fount named in that card's own Cost line (Ash-grey for Mass, Copper for Circuit, Green for Bloom, Cyan for Signal, Violet for Tangle). — PASS
- AC3 [paraphrase]: Each new brief has a 'Key visual elements:' list of at least 2 bullets sharing at least 2 significant words with that card's own rules text or flavor text (not generic filler phrasing), and a 'Composition:' line naming the Art Window's rectangular/landscape shape and an aspect ratio. — PASS
- AC4 [inferred] (held_out): test/design-art-briefs-wormhole-restrictions.test.js exists and enforces the above against the real, current wormhole-restrictions-set.md and art-briefs.md content; every other card file and every pre-existing test file remain byte-identical to before this unit. — PASS

## 2026-07-29-cardgame-alt-art-briefs-signal-tangle-alt-art-briefs-for-signal-and-tangle-closing-the-last-2-of-5-fount-g.md

- AC1 [paraphrase]: design/cards/alt-art-briefs.md gains exactly 2 new '###' sections, titled 'Foreknowledge Cipher' and 'Unwritten Hour' verbatim, bringing the file to 5 total sections (one per Fount: Sporeknit Warden/Bloom, Salvage-Wrought Bastion/Mass, Replicant Foundry Core/Circuit, Foreknowledge Cipher/Signal, Unwritten Hour/Tangle); no pre-existing alt brief section is removed, renamed, or altered. — PASS
- AC2 [paraphrase]: Each new alt brief has Palette/Subject-Scene/Key-visual-elements(2+ bullets)/Composition lines in the same shape the 3 existing alt briefs use, and its Subject/Scene line shares fewer than half its significant words with that same card's base brief Subject/Scene line in design/cards/art-briefs.md. — PASS
- AC3 [inferred]: test/design-alt-art-briefs.test.js's EXPECTED_TITLES list and 'exactly N sections' assertion, and test/composite-card-art-alt.test.js's 'exactly 3 alt briefs' sanity-check assertion, are updated to 5; running node tools/composite-card-art.js (mock client) writes exactly 5 <slug>-alt.svg files, one per alt brief, with each card's base <slug>.svg unchanged alongside it. — PASS
- AC4 [inferred] (held_out): No file other than design/cards/alt-art-briefs.md, test/design-alt-art-briefs.test.js, and test/composite-card-art-alt.test.js is created or modified; design/cards/art-briefs.md, every design/cards/*.md card file, and tools/composite-card-art.js remain byte-identical to before this unit; node --test is green. — PASS

## 2026-07-29-cardgame-playtest-spatial-restriction-refresh-fix-playtest-spatial-md-step-8-it-says-no-card-grants-a-dire.md

- AC1 [paraphrase]: design/playtest-spatial.md Step 8 no longer contains the sentence 'this rulebook has no default action that grants one, so for this playtest simply declare which card would' or any equivalent claim that no card grants a Restriction. — PASS
- AC2 [paraphrase]: Step 8 names 'Bastion Lockdown Line' and its Cost line (2 Mass) as the card being played to place the Directional Restriction it walks. — PASS
- AC3 [paraphrase]: Step 8 still ends with the same physical action (writing 'one-way: [origin]→[destination]' on the line) and the same aloud-confirmation that a Wormhole with no such note defaults to two-way travel, unchanged from before this unit. — PASS
- AC4 [inferred] (held_out): Steps 1-7 and 9-12, the Materials list, and the 'What to watch for while playtesting' section of playtest-spatial.md are byte-identical to their content before this unit, and every existing assertion in test/design-map-setup-playtest.test.js still passes. — PASS

## 2026-07-29-cardgame-playtest-fount-economy-refresh-correct-playtest-full-game-md-s-stale-only-mass-and-circuit-are-su.md

- AC1 [paraphrase]: design/playtest-full-game.md's 'What This Playtest Surfaced' table no longer states 'none' in the Generator column for the Bloom, Signal, or Tangle rows; each names an actual Generator card (Cradle-Root Colony, Panoptic Relay Spire, Communion Waystone respectively). — PASS
- AC2 [paraphrase]: The prose in 'What This Playtest Surfaced' no longer claims Combat cannot occur through ordinary play with 'the 28 cards currently named' unqualified by the existence of fount-economy-set.md's 6 additional cards. — PASS
- AC3 [paraphrase]: A new Worked Example subsection demonstrates a Bloom-Fount economy: Cradle-Root Colony producing Bloom Points across Generation Phases until Feral Bloomcaller or Rootbind Thicket is played and later declared as an attacker in the Conflict Phase, citing exact rules.md section numbers throughout, in the same style as the file's pre-existing Combat and Capture Worked Examples. — PASS
- AC4 [inferred]: Every card named in the new Worked Example exists by exact name in design/cards/alpha-set.md or design/cards/fount-economy-set.md. — PASS
- AC5 [inferred] (held_out): The file's two pre-existing 40-card decklists (Ada's Mass deck, Kestrel's Circuit deck) and every numbered Procedure step outside 'What This Playtest Surfaced' and the Worked Examples area are left unchanged. — PASS
- AC6 [inferred] (held_out): `node --test` passes, including every pre-existing assertion in test/design-full-game-playtest.test.js. — PASS

## 2026-07-29-cardgame-site-index-search-add-a-client-side-search-box-to-the-design-shelf-index-the-site-has-28-pages-an.md

- AC1 [paraphrase]: The generated site/index.html contains an <input type="search" id="site-search"> element positioned before the first <section>. — PASS
- AC2 [paraphrase]: site/index.html contains an inline <script> defining a standalone matching function that performs case-insensitive substring matching between a title and a query, and treats an empty/whitespace-only query as matching every title. — PASS
- AC3 [inferred]: The extracted matching function, evaluated directly in the test process against real titles from the current design shelf (e.g. a card title from alpha-set.md and one from wormhole-closure-cards.md), returns true for a substring query matching that title case-insensitively and false for a query matching none of its words. — PASS
- AC4 [inferred] (held_out): The script wires the search input via an 'input' event listener that sets the visibility of each <li> in the index and hides a <section> entirely once none of its <li> items remain visible, without triggering a page navigation or reload. — PASS
- AC5 [inferred] (held_out): No file other than tools/build-site.js and the new test/build-site-index-search.test.js is created or modified; sectionFor(), SECTION_ORDER, buildPageHtml, renderMarkdown, and cardArtImgHtml behavior are unchanged from before this unit, and every pre-existing assertion in test/build-site.test.js still passes. — PASS

## 2026-07-29-cardgame-art-brief-coverage-warning-composite-card-art-js-warns-on-cards-with-no-matching-art-brief-instea.md

- AC1 [user]: Running `node tools/composite-card-art.js` prints a warning line naming any card (loaded via loadAllCards()) that has no matching brief in design/cards/art-briefs.md, and the process still exits 0. — PASS
- AC2 [paraphrase]: A card that DOES have a matching brief still produces its composited SVG in renders/cards-composited/ exactly as before — no change in output for already-covered cards. — PASS
- AC3 [inferred]: The warning text names the specific card (e.g. 'no art brief for "Card Name"'), not just an aggregate count, so the gap is actionable without re-deriving the diff by hand. — PASS
- AC4 [inferred] (held_out): Running the script twice in a row against the same fixture data produces the same set of warnings, in the same order, and byte-identical composited SVGs both times — the new check introduces no nondeterminism. — PASS

## 2026-07-29-cardgame-playtest-spatial-closure-refresh-fix-playtest-spatial-md-step-9-it-narrates-closing-a-wormhole-wi.md

- AC1 [paraphrase]: design/playtest-spatial.md Step 9 no longer instructs playtesters to cross out a line and narrate Wormhole Closure without naming any card producing it. — PASS
- AC2 [paraphrase]: Step 9 names 'Chokepoint Demolition Charge' and its Cost line (2 Circuit) as the card being played to Close the Wormhole it walks. — PASS
- AC3 [paraphrase]: Step 9 still ends with the same physical action (crossing out the line fully) and the same aloud-confirmation that the line may never be redrawn and a new Discovery action would be required to reconnect those Planets, unchanged from before this unit. — PASS
- AC4 [inferred] (held_out): Steps 1-8 and 10-12, the Materials list, and the 'What to watch for while playtesting' section of playtest-spatial.md are byte-identical to their content before this unit, and every existing assertion in test/design-map-setup-playtest.test.js still passes. — PASS

## 2026-07-29-cardgame-design-readiness-review-cardgame-design-readiness-review.md

- AC1 [paraphrase]: design/DESIGN-READINESS.md is created and is non-empty markdown — no receipt (escalated before receipt computation)
- AC2 [inferred]: The document names every numbered rulebook section (rules.md) by its section number and title — no receipt (escalated before receipt computation)
- AC3 [inferred]: The document names every shipped card set/wave (Alpha starters, Frontier spatial cards, character signature waves, spatial race identity waves, wormhole restriction/closure cards, fount economy cards) with a file citation for each — no receipt (escalated before receipt computation)
- AC4 [inferred]: The document names the world lore eras and the races/star atlas content with file citations — no receipt (escalated before receipt computation)
- AC5 [paraphrase]: The document closes with a numbered list of at least 3 concrete open gaps or unresolved questions, each citing specific evidence (a file or section) — no receipt (escalated before receipt computation)
- AC6 [inferred] (held_out): test/design-readiness.test.js asserts the document's card-set list, when cross-checked against design/cards/*.md loaded via the existing shared parser (lib/parse-card-markdown.js), does not omit any set present on disk — no receipt (escalated before receipt computation)
- AC7 [inferred] (held_out): test/design-readiness.test.js fails (RED) before the document exists and passes (GREEN) after, run via `node --test` — no receipt (escalated before receipt computation)

## 2026-07-29-cardgame-rename-wreck-tangle-the-game-is-named-wreck-tangle-propagate-the-title.md

- AC1 [user]: design/rules.md opens with Wreck Tangle as the game title, presenting The Amaranth Expanse as the setting, and the rules structure integrity test still passes — no receipt (escalated before receipt computation)
- AC2 [paraphrase]: The generated site index page title and header lead with Wreck Tangle (rebuild via tools/build-site.js), and existing site tests pass — no receipt (escalated before receipt computation)
- AC3 [inferred]: A test asserts the string Wreck Tangle appears in design/rules.md and in site/index.html so future edits cannot silently drop the name — no receipt (escalated before receipt computation)
- AC4 [inferred] (held_out): No card file, race file, character file, or file path is renamed by this unit � the diff touches only titles/headers/prose that name the game itself — no receipt (escalated before receipt computation)

## 2026-07-30-cardgame-card-catalog-name-collision-check-one-mechanical-no-duplicate-card-name-check-across-the-whole-de.md

- AC1 [inferred]: lib/card-catalog.js exists and exports a function that, given an array of card records each with a `name` field, returns the list of names that appear more than once (comparing case-insensitively, so 'Wormhole Ledger' and 'wormhole ledger' count as the same name). — PASS
- AC2 [inferred]: test/card-catalog-collision.test.js proves detection with fixture data: given a synthetic set of card records containing one name repeated across two entries (including at least one case-only variant), the function returns that name as a duplicate; given a synthetic set with no repeated names, it returns an empty list. — PASS
- AC3 [paraphrase]: test/card-catalog-collision.test.js also calls the same function against the real card catalog returned by lib/parse-card-markdown.js's loadAllCards(), and asserts it currently returns zero duplicate names. — PASS
- AC4 [inferred] (held_out): No file under design/cards/, lib/parse-card-markdown.js, or any pre-existing test/*.js file is modified by this unit — only lib/card-catalog.js and test/card-catalog-collision.test.js are added, and every pre-existing test file's pass/fail outcome under `node --test` is unchanged. — PASS

## 2026-07-30-cardgame-spatial-race-identity-cards-wave-2-race-identity-spatial-cards-wave-2-the-bloom-s-contested-groun.md

- AC1 [paraphrase]: design/cards/spatial-race-identity-set-wave-2.md exists and contains exactly 2 distinct named cards — one under Mireth Bloom, one under Wrought Assembly (per design/races/) — each with a Cost line, Type line, and Rules text in that order, and a Stats/counters line only when its Type line contains 'Permanent', matching the template test/design-frontier-cards.test.js enforces for frontier-set.md. — PASS
- AC2 [paraphrase]: The Mireth Bloom card's Cost line names the Bloom Fount, its Type line identifies it as a Generator, and its Rules text explicitly states it may be built on a Planet its controller does not control, citing 'Section 4.6' by number. — PASS
- AC3 [paraphrase]: The Wrought Assembly card's Cost line names the Circuit Fount, its Type line identifies it as a Generator, and its Rules text explicitly reduces its own Circuit Point cost when built on a Planet that entered the battlefield graph via a Discovery action taken that game, citing 'Section 8.3' by number. — PASS
- AC4 [inferred] (held_out): design/rules.md and every other file under design/cards/ (including spatial-race-identity-set.md if it exists by then) remain byte-identical to before this unit, and neither of the 2 new card names collides with any card name already printed in alpha-set.md, frontier-set.md, character-signatures.md, or spatial-race-identity-set.md. — PASS

## 2026-07-30-cardgame-art-briefs-wormhole-closure-art-briefs-for-the-wormhole-closure-cards-the-newest-shipped-card-fil.md

- AC1 [paraphrase]: design/cards/art-briefs.md gains exactly 5 new '###' sections, titled exactly 'Bastion Seal Detachment', 'Withering Conduit Rot', 'Severance Directive', 'Rite of the Sealed Tangle', and 'Chokepoint Demolition Charge' verbatim, with no pre-existing brief section removed, renamed, or altered. — PASS
- AC2 [paraphrase]: Each new brief's Palette line names the single Fount-driven color from card-anatomy.md's Fount identity table matching the one Fount named in that card's own Cost line (Ash-grey for Mass, Green for Bloom, Cyan for Signal, Copper for Circuit, Violet for Tangle). — PASS
- AC3 [paraphrase]: Each new brief has a 'Key visual elements:' list of at least 2 bullets sharing at least 2 significant words with that card's own rules text or flavor text (not generic filler phrasing), and a 'Composition:' line naming the Art Window's rectangular/landscape shape and an aspect ratio. — PASS
- AC4 [inferred] (held_out): test/design-art-briefs-wormhole-closure.test.js exists and enforces the above against the real, current wormhole-closure-cards.md and art-briefs.md content; every other card file and every pre-existing test file remain byte-identical to before this unit. — PASS

## 2026-07-30-cardgame-main-phase-discovery-crossref-resolve-rules-md-section-5-3-s-leftover-discovery-timing-dev-note-t.md

- AC1 [paraphrase]: design/rules.md no longer contains any line reading exactly '//discovering new planets, and creating new wormholes goes in this phase.' anywhere in the file. — PASS
- AC2 [paraphrase]: Section 5.3 (Main Phase)'s prose explicitly states, in a full sentence (not a comment), that the Discovery action creates new Planets and/or Wormholes on the battlefield graph, and cross-references Section 8.3. — PASS
- AC3 [paraphrase]: Every other existing `//`-prefixed note in design/rules.md (Section 5.2 line ~275, Section 5.4 lines ~294-300, and Section 8's five notes) remains present, word-for-word unchanged, and no section other than 5.3 is modified. — PASS
- AC4 [inferred] (held_out): test/design-rules-main-phase-discovery-note.test.js exists and enforces all three criteria above against the real, current design/rules.md content. — PASS

## 2026-07-30-cardgame-tools-fs-lock-dedup-extract-the-two-independently-reinvented-cross-process-file-locks-in-tools-in.md

- AC1 [inferred]: lib/fs-lock.js exists and exports a lock function implementing exclusive acquire-or-wait plus stale-lock reclaim (lock older than a threshold is treated as abandoned and reclaimed rather than blocking forever) — PASS
- AC2 [inferred]: tools/build-site.js contains no local withBuildLock/isLockStale function declarations and instead requires the lock helper from lib/fs-lock.js; test/build-site.test.js passes unmodified — PASS
- AC3 [inferred]: tools/composite-card-art.js contains no local withOutDirLock function declaration and instead requires the lock helper from lib/fs-lock.js; test/composite-card-art.test.js passes unmodified — PASS
- AC4 [inferred] (held_out): A new test/fs-lock-dedup.test.js exercises lib/fs-lock.js directly: a second concurrent acquire attempt is excluded until the first releases, and a lock left behind by a killed process (mtime older than the stale threshold) is automatically reclaimed rather than hanging — PASS
- AC5 [paraphrase]: Full `node --test` run is green (pre-existing suite plus the new fs-lock tests) — PASS

## 2026-07-30-cardgame-playtest-decklist-refresh-full-game-playtest-decklists-still-build-from-cards-the-file-itself-now.md

- AC1 [inferred]: Deck A and Deck B in Step 1 each name at least one card from design/cards/fount-economy-set.md — PASS
- AC2 [inferred]: No line in either decklist in Step 1 is annotated 'dead' or 'can never be paid' — PASS
- AC3 [inferred]: The 'Only 10 of the 28 cards currently named across the three card files can ever be paid for' sentence is replaced with a count consistent with the current pool across alpha-set.md, frontier-set.md, character-signatures.md, and fount-economy-set.md — PASS
- AC4 [inferred]: Both decklists still total exactly 40 cards with no more than 3 copies of any one card Name (Section 11.1, Section 11.2) — PASS
- AC5 [inferred] (held_out): test/design-full-game-playtest.test.js parses both decklists from the document and asserts at least one payable card per Fount is present in at least one deck — PASS
- AC6 [inferred] (held_out): No file other than design/playtest-full-game.md, site/design/playtest-full-game.html, and test/design-full-game-playtest.test.js is modified — PASS

## 2026-07-30-cardgame-art-briefs-spatial-race-identity-art-briefs-for-the-spatial-race-identity-set-3-cards.md

- AC1 [paraphrase]: design/cards/art-briefs.md contains exactly one '###' section titled verbatim 'Preemptive Survey', one titled 'Unbound Passage', and one titled 'Chokepoint Garrison' (the 3 card titles in design/cards/spatial-race-identity-set.md), with no pre-existing brief sections removed, renamed, or altered — PASS
- AC2 [paraphrase]: The 'Preemptive Survey' brief's Palette line names Cyan (Signal), the 'Unbound Passage' brief's Palette line names Violet (Tangle), and the 'Chokepoint Garrison' brief's Palette line names Ash-grey (Mass), matching each card's own Cost line per card-anatomy.md's Fount identity table — PASS
- AC3 [paraphrase] (held_out): Each of the 3 new briefs has a 'Key visual elements:' list of at least 2 bullets that share at least 2 significant words with that card's own Type line/Rules text, and none of the bullets use generic filler phrases like 'epic composition' or 'stunning artwork' — PASS
- AC4 [paraphrase]: Each of the 3 new briefs has a 'Composition:' line naming the Art Window's rectangular/landscape shape and an explicit aspect ratio (e.g. '5:3'), consistent with card-anatomy.md's Art Window description — PASS
- AC5 [inferred]: Running tools/composite-card-art.js in its default (mock) mode no longer prints 'no art brief for "Preemptive Survey"', 'no art brief for "Unbound Passage"', or 'no art brief for "Chokepoint Garrison"' — PASS
