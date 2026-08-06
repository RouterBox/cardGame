name: cardgame-design-browser-site
title: cardGame tool — design-shelf browser website (read what we have from the phone)
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

User directive (2026-07-28, verbatim, logged in design/ideas-inbox.md): "we can build tools for content generation and game authoring. For instance I think we also need a simple website to browse the game plans and concepts generated. I need to be able to see what we got without going over to my computer and picking through files and folders."

This is the first TOOL unit under the T16 gate ruling (game implementation stays off-limits; authoring/presentation tools are allowed). Build a static-site generator that turns the existing design shelf into a browsable website, so RouterBox can read everything from a phone.

Constraints (simplest thing that works, T2/user's global rules):

- Node-only, zero npm dependencies (match the repo: plain node, node:test). A single script `tools/build-site.js` reads the markdown under `design/` (including subdirectories `races/`, `characters/`, `cards/`) plus `gamePlan.md`, converts each to an HTML page, and writes a self-contained site to `site/` (gitignored or committed — commit it, so it can be statically served/deployed with no build step).
- Markdown conversion may be minimal but must correctly render the constructs the design docs actually use: headings, paragraphs, bold/italic, bullet and numbered lists, blockquotes, tables, fenced code blocks, and internal links. No external CDN assets — one inline CSS block, readable on a phone (max-width column, legible font sizes, dark-friendly).
- Site structure: an index page grouping documents by shelf area (World, Races, Characters, Rules, Cards, Plans/Ideas) with document titles taken from each file's first H1; every page gets a persistent nav back to the index and to its section siblings.
- The generator is deterministic: same inputs produce byte-identical outputs (no timestamps, no randomness) — rerunning it after a design merge refreshes the site.
- NO game logic anywhere in this unit: it renders documents; it does not interpret rules or simulate anything (T16 bright line).

## Acceptance Criteria

- AC1 [user]: Running `node tools/build-site.js` exits 0 and produces `site/index.html` plus one HTML page for every markdown file under `design/` (recursively) and for `gamePlan.md`.
- AC2 [user]: The index page links to every generated page, grouped into named sections covering at least World, Races, Characters, Cards, and Rules, with each link's text taken from the source file's first H1 heading.
- AC3 [paraphrase]: Generated pages render markdown structure as real HTML — a page generated from a design doc containing a table, a bulleted list, and a blockquote contains corresponding table/ul/blockquote elements, not raw markdown syntax.
- AC4 [inferred]: Every generated page contains a nav element linking back to index.html, and pages contain no external resource references (no http/https URLs in src or href of assets; document links to other generated pages are relative).
- AC5 [inferred]: The generator is deterministic — running it twice in a row produces identical bytes for every file in site/ (verifiable by hashing).
- AC6 [inferred] (held_out): The site contains no JavaScript that implements game behavior — generated pages are readable documents only; any script tag present is limited to navigation/display conveniences, and none of the generator's code interprets game rules.
