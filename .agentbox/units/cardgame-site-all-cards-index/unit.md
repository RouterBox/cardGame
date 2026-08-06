name: cardgame-site-all-cards-index
title: cardGame design-shelf site — one browsable All Cards index across every card-set file
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

tools/build-site.js (shipped) renders one HTML page per markdown file and an index.html grouping those file-level links by shelf section (World, Races, Characters, Cards, Rules), but nothing in the generator ever produces a view of cards themselves — a reader has to already know which of the growing set of design/cards/*.md files holds the card they want. This unit adds a card-level index: while build-site.js renders each design/cards/*.md page (it already walks that directory file-by-file, and within each file section-by-section, per the same '###' card-heading iteration the in-flight site-embeds-composited-card-art unit relies on), it collects {name, costLine, typeLine, source page path} for every card it renders, then after all pages are built emits one new site/cards-index.html: a single table/list, one row per card, each row's name linking (via the same relative-href convention buildNav() already uses) to that card's source page. site/index.html gains one additional link to cards-index.html alongside its existing section links. The generator's existing determinism guarantee (AC5 of the shipped design-browser-site unit) extends to this new page. No design/cards/*.md file, art-briefs.md, lib/parse-card-markdown.js, or tools/composite-card-art.js is touched — only tools/build-site.js gains the collection-and-emit step and a new test file verifies it.

## Acceptance Criteria

- AC1 [inferred]: After running node tools/build-site.js, site/cards-index.html exists and contains exactly one entry per card across every design/cards/*.md file — the same total count loadAllCards() (or an equivalent full walk of design/cards/) returns for the current catalog.
- AC2 [paraphrase]: Each entry in cards-index.html shows that card's name, its Cost line text, and its Type line text, and its name links via a relative href to the generated page for the design/cards/*.md file it came from.
- AC3 [inferred]: site/index.html contains a link to cards-index.html; running node tools/build-site.js twice in a row produces byte-identical site/ output (including cards-index.html) on both runs.
- AC4 [inferred] (held_out): No pre-existing generated page's content changes as a result of this unit (per-file card pages render identically to before), and every existing assertion in test/build-site.test.js still passes.
