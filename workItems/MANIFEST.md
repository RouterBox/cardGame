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
