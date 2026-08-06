# cardgame-card-authoring-engine: cardGame tool — deterministic card layout renderer

## Header

- unit: cardgame-card-authoring-engine
- title: cardGame tool — deterministic card layout renderer
- project: cardgame
- completed: 2026-07-28
- outcome: merged
- start_sha: 742424b6ddec9218e49c51dd6ca431f2a4f21cda
- end_sha: 5331468dc32f470093febe0202ff67d429a5c604

## Intent

Build the deterministic card authoring engine named in T16: layout code that renders every structured element of a card (frame/border, name slot, cost slot, art window, type line, rules-text box, stats corner) from card data, per design/cards/card-anatomy.md's skeleton, variables, and worked examples. This unit covers layout only — no image generation or art compositing; the Art Window renders as a placeholder rectangle, holding the slot that a future unit will fill by compositing a generated illustration. A single Node script, zero npm dependencies (matching tools/build-site.js's existing pattern), parses card records from design/cards/*.md using the field-prefix convention already used in alpha-set.md (Cost line / Type line / Rules text / Stats/counters line, under ### card-name headings), and renders each as a deterministic, self-contained SVG file. Frame/Border color(s) follow the Fount identity table in card-anatomy.md, split into ordered vertical bands for multi-Fount costs. The Stats Corner is present only for Permanents whose template carries a Stats/counters line, and is omitted entirely (not blank) otherwise, per the anatomy doc's explicit rule. This is authoring/presentation tooling under the T16 bright line — it renders card data, it does not implement or simulate any game rule.

## Acceptance Criteria

- AC1 [inferred]: Running `node tools/render-card.js` exits 0 and produces exactly one SVG file under renders/cards/ for every card entry found in design/cards/alpha-set.md.
- AC2 [paraphrase]: The rendered SVG for Signal-Wrought Prototype (Cost line '1 Signal, 1 Circuit') shows a Frame/Border split into two equal vertical bands, cyan then copper left-to-right, matching card-anatomy.md's worked example.
- AC3 [paraphrase]: The rendered SVG for Sporeknit Warden (Cost line '3 Bloom') shows a single solid green Frame/Border band and a Cost Slot pip reading '3'.
- AC4 [paraphrase]: A Permanent card whose template includes a Stats/counters line (e.g. Sporeknit Warden) renders that text in a Stats Corner element; a Permanent card with no Stats/counters line (e.g. Signal-Wrought Prototype) contains no Stats Corner element at all, not an empty one.
- AC5 [inferred]: The Art Window in every rendered card is a placeholder rectangle only — no illustration, no call to any image-generation service, and no game-rule logic anywhere in the script.
- AC6 [inferred] (held_out): The generator is deterministic: running it twice in a row produces byte-identical SVG output for every file, verifiable by hashing.

## Plan

GATE: none

# Plan — cardgame-card-authoring-engine

## Summary

Add one new, dependency-free Node script, `tools/render-card.js`, that:

1. Parses every card record out of the `###`-level sections of each `design/cards/*.md` file, using the same `Cost line:` / `Type line:` / `Rules text:` / `Stats/counters line:` field-prefix convention `test/design-cards.test.js` already relies on for `design/cards/alpha-set.md`.
2. Renders each parsed card as a self-contained, deterministic SVG file into `renders/cards/<slug>.svg`.
3. Implements the seven layout zones named in the unit intent (frame/border, name slot, cost slot, art window, type line, rules-text box, stats corner) per `design/cards/card-anatomy.md`'s Skeleton/Variables/Worked-Examples sections. The eighth zone named in that doc, Set/Collector Strip, is explicitly out of scope (the unit intent's zone list omits it, and the anatomy doc itself says its content "is out of scope for this document").

No other repo file needs to change. This is a pure-addition unit — no existing file's behavior changes.

This is layout/presentation tooling only: it does not call any image-generation service, does not composite art, and contains no game-rule logic (no resource pools, no turn/phase simulation, no combat resolution) — it only reads text fields and lays out boxes/colors from them. That satisfies AC5 by construction, not by an added check.

## Risk self-assessment (FIRE)

- **Reversibility:** trivially reversible — one new script, one new generated-output directory (`renders/cards/`), nothing overwritten, nothing deleted from existing content.
- **Security impact:** none — no network calls, no dynamic code execution, no shelling out.
- **User data:** none — operates only on the repo's own committed design markdown.
- **Schema changes:** none.

Standard/low risk. `GATE: none`.

## Held-out AC discipline

AC6 (held_out, determinism) is redundant with the general expectation any build-style tool in this repo already meets (`tools/build-site.js` has the identical determinism property, verified the identical way in `test/build-site.test.js`'s `hashTree` helper). The plan below satisfies it structurally: the script contains no `Date.now()`/`Math.random()`/wall-clock/locale-dependent input anywhere, output file order comes from a stable sort of filenames plus each file's natural top-to-bottom document order (never from `Set`/`Map`/object-key iteration order for anything that reaches output), and the output directory is wiped (`fs.rmSync(..., {recursive:true, force:true})`) and recreated before every run so stale files from a previous run can never linger and change the hash. No spec bug to flag here.

## File to create: `tools/render-card.js`

Create this file with exactly the following content:

```javascript
#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const CARDS_DIR = path.join(REPO_ROOT, 'design', 'cards');
const OUT_DIR = path.join(REPO_ROOT, 'renders', 'cards');

// ---------------------------------------------------------------------------
// Fount identity table (design/cards/card-anatomy.md, "The Variables")
// ---------------------------------------------------------------------------

const FOUNT_COLORS = {
  Mass: { name: 'ash-grey', hex: '#8a8d93' },
  Bloom: { name: 'green', hex: '#2f9e44' },
  Signal: { name: 'cyan', hex: '#06b6d4' },
  Circuit: { name: 'copper', hex: '#b5651d' },
  Tangle: { name: 'violet', hex: '#7c3aed' },
};

// ---------------------------------------------------------------------------
// Card layout geometry (all fixed constants — the layout never varies)
// ---------------------------------------------------------------------------

const CARD_WIDTH = 750;
const CARD_HEIGHT = 1050;
const FRAME_MARGIN = 24;

const INNER_X = FRAME_MARGIN;
const INNER_Y = FRAME_MARGIN;
const INNER_WIDTH = CARD_WIDTH - 2 * FRAME_MARGIN;
const INNER_HEIGHT = CARD_HEIGHT - 2 * FRAME_MARGIN;

const NAME_SLOT_HEIGHT = 70;
const ART_WINDOW_HEIGHT = 420;
const TYPE_LINE_HEIGHT = 50;

const RULES_BOX_Y = INNER_Y + NAME_SLOT_HEIGHT + ART_WINDOW_HEIGHT + TYPE_LINE_HEIGHT;
const RULES_BOX_HEIGHT = INNER_HEIGHT - NAME_SLOT_HEIGHT - ART_WINDOW_HEIGHT - TYPE_LINE_HEIGHT;

const STATS_CORNER_WIDTH = 220;
const STATS_CORNER_HEIGHT = 90;
const STATS_CORNER_PADDING = 16;

// ---------------------------------------------------------------------------
// Markdown parsing — design/cards/*.md field-prefix convention
// ---------------------------------------------------------------------------

const FIELD_PREFIXES = ['Cost line:', 'Type line:', 'Rules text:', 'Stats/counters line:'];

function isFieldStart(line) {
  return FIELD_PREFIXES.some((prefix) => line.startsWith(prefix));
}

// `cursor` is a { value: number } box so the shared read position advances
// across sequential calls without every caller re-threading an index.
function consumeField(lines, cursor, prefix) {
  if (cursor.value >= lines.length || !lines[cursor.value].startsWith(prefix)) return null;
  const parts = [lines[cursor.value].slice(prefix.length).trim()];
  cursor.value++;
  while (
    cursor.value < lines.length &&
    lines[cursor.value].trim() !== '' &&
    !isFieldStart(lines[cursor.value])
  ) {
    parts.push(lines[cursor.value].trim());
    cursor.value++;
  }
  return parts.join(' ').trim();
}

function parseCardBody(lines) {
  const cursor = { value: 0 };
  while (cursor.value < lines.length && lines[cursor.value].trim() === '') cursor.value++;

  const costLine = consumeField(lines, cursor, 'Cost line:');
  const typeLine = consumeField(lines, cursor, 'Type line:');
  const rulesText = consumeField(lines, cursor, 'Rules text:');
  const statsLine = consumeField(lines, cursor, 'Stats/counters line:');

  while (cursor.value < lines.length && lines[cursor.value].trim() === '') cursor.value++;
  const flavorLines = [];
  while (cursor.value < lines.length && lines[cursor.value].trim() !== '') {
    flavorLines.push(lines[cursor.value].trim());
    cursor.value++;
  }
  let flavorText = flavorLines.join(' ').trim();
  if (flavorText.startsWith('*')) flavorText = flavorText.slice(1);
  if (flavorText.endsWith('*')) flavorText = flavorText.slice(0, -1);
  flavorText = flavorText.trim();

  return { costLine, typeLine, rulesText, statsLine, flavorText: flavorText || null };
}

// Splits a markdown file into its `###` (level-3) heading sections. Only
// level-3 sections are candidate card records — this matches the convention
// already used by design/cards/alpha-set.md.
function splitIntoH3Sections(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 3) {
        current = { title: heading[2].trim(), lines: [] };
        sections.push(current);
      } else {
        current = null;
      }
      continue;
    }
    if (current) current.lines.push(line);
  }
  return sections;
}

// A level-3 section only counts as a card record if it actually carries the
// three required fields — this is what keeps card-anatomy.md's prose-style
// "### Worked Example: ..." sections from being mistaken for cards (their
// body text mentions "Cost line" mid-sentence, never as a line-start field).
function loadCardsFromFile(absPath) {
  const markdown = fs.readFileSync(absPath, 'utf8');
  const sections = splitIntoH3Sections(markdown);
  const cards = [];
  for (const section of sections) {
    const fields = parseCardBody(section.lines);
    if (fields.costLine && fields.typeLine && fields.rulesText) {
      cards.push({ name: section.title, ...fields });
    }
  }
  return cards;
}

function loadAllCards() {
  const files = fs
    .readdirSync(CARDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
  const cards = [];
  for (const file of files) {
    cards.push(...loadCardsFromFile(path.join(CARDS_DIR, file)));
  }
  return cards;
}

// ---------------------------------------------------------------------------
// Cost line parsing ("1 Signal, 1 Circuit" -> ordered cost items)
// ---------------------------------------------------------------------------

function parseCostItems(costLine) {
  return costLine.split(',').map((entry) => {
    const match = entry.trim().match(/^(\d+)\s+(\S+)$/);
    if (!match) {
      throw new Error(`could not parse cost entry "${entry.trim()}" from cost line "${costLine}"`);
    }
    const [, amount, fount] = match;
    if (!FOUNT_COLORS[fount]) {
      throw new Error(`unknown Fount "${fount}" in cost line "${costLine}"`);
    }
    return { amount, fount };
  });
}

// Unique Founts, in order of first appearance in the Cost line — this is the
// order both the frame bands and the cost pips render in.
function orderedFrameFounts(costItems) {
  const seen = [];
  for (const item of costItems) {
    if (!seen.includes(item.fount)) seen.push(item.fount);
  }
  return seen;
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Greedy word-wrap by character count. This is a fixed-width approximation
// (not real font-metrics measurement) — good enough for a deterministic
// placeholder layout where no specific font is guaranteed to be installed.
function wrapText(text, maxChars) {
  if (!text) return [];
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function textBlock({ x, y, lines, fontSize, lineHeight, fill, fontStyle, fontWeight }) {
  if (lines.length === 0) return '';
  const tspans = lines
    .map((line, idx) => `<tspan x="${x}" dy="${idx === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('');
  const style = [
    `font-size="${fontSize}"`,
    fill ? `fill="${fill}"` : '',
    fontStyle ? `font-style="${fontStyle}"` : '',
    fontWeight ? `font-weight="${fontWeight}"` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return `<text x="${x}" y="${y}" font-family="Georgia, 'Times New Roman', serif" ${style}>${tspans}</text>`;
}

// ---------------------------------------------------------------------------
// SVG rendering
// ---------------------------------------------------------------------------

function renderFrameBands(frameFounts) {
  const bandWidth = CARD_WIDTH / frameFounts.length;
  return frameFounts
    .map((fount, idx) => {
      const color = FOUNT_COLORS[fount];
      return `<rect class="frame-band" data-fount="${fount}" data-color="${color.name}" x="${idx * bandWidth}" y="0" width="${bandWidth}" height="${CARD_HEIGHT}" fill="${color.hex}"/>`;
    })
    .join('\n');
}

function renderCostPips(costItems) {
  const pipDiameter = 56;
  const gap = 10;
  const clusterWidth = costItems.length * pipDiameter + (costItems.length - 1) * gap;
  const startX = INNER_X + INNER_WIDTH - 16 - clusterWidth;
  const centerY = INNER_Y + NAME_SLOT_HEIGHT / 2;

  return costItems
    .map((item, idx) => {
      const color = FOUNT_COLORS[item.fount];
      const cx = startX + idx * (pipDiameter + gap) + pipDiameter / 2;
      return [
        `<g class="cost-pip" data-fount="${item.fount}" data-color="${color.name}">`,
        `<circle cx="${cx}" cy="${centerY}" r="${pipDiameter / 2}" fill="${color.hex}" stroke="#14151a" stroke-width="3"/>`,
        `<text x="${cx}" y="${centerY + 8}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-weight="bold" fill="#14151a">${escapeXml(item.amount)}</text>`,
        `</g>`,
      ].join('\n');
    })
    .join('\n');
}

function renderNameSlot(name) {
  return [
    `<rect class="name-slot" x="${INNER_X}" y="${INNER_Y}" width="${INNER_WIDTH}" height="${NAME_SLOT_HEIGHT}" fill="#f5f1e6"/>`,
    textBlock({
      x: INNER_X + 16,
      y: INNER_Y + NAME_SLOT_HEIGHT / 2 + 10,
      lines: [name],
      fontSize: 32,
      lineHeight: 0,
      fill: '#14151a',
      fontWeight: 'bold',
    }),
  ].join('\n');
}

function renderArtWindow() {
  const y = INNER_Y + NAME_SLOT_HEIGHT;
  return [
    `<rect class="art-window" x="${INNER_X}" y="${y}" width="${INNER_WIDTH}" height="${ART_WINDOW_HEIGHT}" fill="#c9ccd3" stroke="#9a9da5" stroke-width="2"/>`,
    `<text x="${INNER_X + INNER_WIDTH / 2}" y="${y + ART_WINDOW_HEIGHT / 2}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#5a5d66">Art Placeholder</text>`,
  ].join('\n');
}

function renderTypeLine(typeLine) {
  const y = INNER_Y + NAME_SLOT_HEIGHT + ART_WINDOW_HEIGHT;
  return [
    `<rect class="type-line" x="${INNER_X}" y="${y}" width="${INNER_WIDTH}" height="${TYPE_LINE_HEIGHT}" fill="#e4dfd0"/>`,
    textBlock({
      x: INNER_X + 16,
      y: y + TYPE_LINE_HEIGHT / 2 + 7,
      lines: [typeLine],
      fontSize: 20,
      lineHeight: 0,
      fill: '#3a3a3f',
    }),
  ].join('\n');
}

function renderRulesTextBox(rulesText, flavorText) {
  const rulesLines = wrapText(rulesText, 46);
  const parts = [
    `<rect class="rules-text-box" x="${INNER_X}" y="${RULES_BOX_Y}" width="${INNER_WIDTH}" height="${RULES_BOX_HEIGHT}" fill="#faf8f2" stroke="#c9ccd3" stroke-width="2"/>`,
    textBlock({
      x: INNER_X + 16,
      y: RULES_BOX_Y + 32,
      lines: rulesLines,
      fontSize: 20,
      lineHeight: 26,
      fill: '#1c1c22',
    }),
  ];
  if (flavorText) {
    const flavorLines = wrapText(flavorText, 46);
    const flavorY = RULES_BOX_Y + 32 + rulesLines.length * 26 + 20;
    parts.push(
      textBlock({
        x: INNER_X + 16,
        y: flavorY,
        lines: flavorLines,
        fontSize: 18,
        lineHeight: 24,
        fill: '#5a5d66',
        fontStyle: 'italic',
      })
    );
  }
  return parts.join('\n');
}

function renderStatsCorner(statsLine) {
  const x = INNER_X + INNER_WIDTH - STATS_CORNER_WIDTH - STATS_CORNER_PADDING;
  const y = RULES_BOX_Y + RULES_BOX_HEIGHT - STATS_CORNER_HEIGHT - STATS_CORNER_PADDING;
  const lines = wrapText(statsLine, 26);
  return [
    `<g class="stats-corner">`,
    `<rect x="${x}" y="${y}" width="${STATS_CORNER_WIDTH}" height="${STATS_CORNER_HEIGHT}" fill="#1f2126" stroke="#f5f1e6" stroke-width="2"/>`,
    textBlock({
      x: x + 12,
      y: y + 24,
      lines,
      fontSize: 16,
      lineHeight: 20,
      fill: '#f5f1e6',
    }),
    `</g>`,
  ].join('\n');
}

function renderCardSvg(card) {
  const costItems = parseCostItems(card.costLine);
  const frameFounts = orderedFrameFounts(costItems);
  const isPermanent = /\bPermanent\b/.test(card.typeLine);
  const hasStatsCorner = isPermanent && Boolean(card.statsLine);

  const layers = [
    renderFrameBands(frameFounts),
    renderNameSlot(card.name),
    renderArtWindow(),
    renderTypeLine(card.typeLine),
    renderRulesTextBox(card.rulesText, card.flavorText),
    renderCostPips(costItems),
  ];
  if (hasStatsCorner) layers.push(renderStatsCorner(card.statsLine));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}">`,
    `<title>${escapeXml(card.name)}</title>`,
    layers.join('\n'),
    '</svg>',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const cards = loadAllCards();

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const usedSlugs = new Set();
  for (const card of cards) {
    const slug = slugify(card.name);
    if (usedSlugs.has(slug)) {
      throw new Error(`duplicate card filename slug "${slug}" from card name "${card.name}"`);
    }
    usedSlugs.add(slug);

    const svg = renderCardSvg(card);
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.svg`), svg, 'utf8');
  }

  console.log(`Rendered ${cards.length} card(s) into ${path.relative(REPO_ROOT, OUT_DIR).split(path.sep).join('/')}/`);
}

main();
```

## Why this satisfies each AC

- **AC1** — `loadAllCards()` walks every `design/cards/*.md` file (sorted filenames for determinism) and only `design/cards/alpha-set.md` currently contains sections with all three required fields, so exactly its 18 `###` cards become 18 output files in `renders/cards/`, one `.svg` per card, named by `slugify(name)`. Running `node tools/render-card.js` calls `main()` synchronously with no async work and no unhandled-rejection path; if nothing throws, Node exits 0. Expected stdout: `Rendered 18 card(s) into renders/cards/`. Expected files (18, one per card, in this order of appearance in `alpha-set.md`): `unwritten-hour.svg`, `oathbreaker-s-toll.svg`, `echo-recall.svg`, `replicant-foundry-core.svg`, `firmware-sentinel.svg`, `drone-cascade.svg`, `foreknowledge-cipher.svg`, `whispered-contract.svg`, `static-ambush.svg`, `sporeknit-warden.svg`, `feral-bloomcaller.svg`, `rootbind-thicket.svg`, `salvage-wrought-bastion.svg`, `line-fleet-trooper.svg`, `cinder-forged-plating.svg`, `wrought-bloom-graft.svg`, `signal-wrought-prototype.svg`, `tangle-forged-bolt.svg`.
- **AC2** — Signal-Wrought Prototype's Cost line `"1 Signal, 1 Circuit"` parses to `costItems = [{amount:'1',fount:'Signal'}, {amount:'1',fount:'Circuit'}]`; `orderedFrameFounts` returns `['Signal', 'Circuit']` (first-appearance order), so `renderFrameBands` emits two equal-width (`750/2 = 375`px) `<rect class="frame-band" data-fount="Signal" data-color="cyan" ... fill="#06b6d4">` then `data-fount="Circuit" data-color="copper" ... fill="#b5651d"` — left band cyan, right band copper, matching the worked example. `renderCostPips` emits the two `"1"` pips in the same left-to-right order, each carrying `data-color="cyan"`/`"copper"`.
- **AC3** — Sporeknit Warden's Cost line `"3 Bloom"` parses to one cost item, so `orderedFrameFounts` returns `['Bloom']`: `renderFrameBands` emits a single `<rect ... width="750" ... fill="#2f9e44">` (one full-width solid green band, `data-color="green"`). `renderCostPips` emits one pip with text content `"3"`, `data-color="green"`.
- **AC4** — Sporeknit Warden: `typeLine = "Biology — Permanent"` → `isPermanent = true`; `statsLine = "Combat strength 2. Enters with one Growth counter."` is non-null → `hasStatsCorner = true` → the `<g class="stats-corner">` element is appended to `layers` and rendered with that text. Signal-Wrought Prototype: no `Stats/counters line:` field in its source section → `card.statsLine` is `null` from `parseCardBody` → `hasStatsCorner = false` → `renderStatsCorner` is never called and no `<g class="stats-corner">` (nor any other stats-related element) appears anywhere in that file's SVG — the zone is omitted, not rendered empty.
- **AC5** — `renderArtWindow()` draws only a flat-fill `<rect class="art-window">` plus a static `"Art Placeholder"` `<text>` label; it takes no card data as input and calls nothing else. The script has zero `require()`s beyond Node's built-in `fs` and `path`, no `fetch`/`http`/`child_process` calls anywhere, and no code path reads or computes game state (resources, combat, turns) — it only ever formats the four text fields already present in the markdown into boxes and colors.
- **AC6 (held_out)** — no timestamps, no randomness, no environment-dependent input (locale, `Date`, network) anywhere in the script; `renders/cards/` is fully wiped and rebuilt every run; file and card iteration order is always a stable sort (filenames) plus each file's natural document order. Two consecutive runs read the same markdown and must produce byte-identical output. Verify manually with:
  ```
  node tools/render-card.js
  node -e "const{execSync}=require('child_process');const crypto=require('crypto');const fs=require('fs');const path=require('path');function hash(dir){const files=fs.readdirSync(dir).sort();const h=crypto.createHash('sha256');for(const f of files){h.update(f);h.update(fs.readFileSync(path.join(dir,f)));}return h.digest('hex');}console.log(hash('renders/cards'));"
  node tools/render-card.js
  node -e "<same snippet>"
  ```
  Both hash lines must match.

## Test command

`node --test` (per `unit.md`). This unit adds no test file itself — a prior/separate pipeline step writes `test/render-card.test.js` (or similar) from the visible ACs before this plan is built; this plan only concerns the implementation those tests will exercise. After implementation, `node --test` should continue to exit 0 (existing tests untouched, since no existing file changes) plus pass whatever new tests assert the AC1–AC6 behaviors described above.

## Notes for the builder

- Do not add a build step to `package.json` or change `tools/build-site.js` — out of scope, and the unit does not ask for it.
- Do not add the `renders/` directory to any ignore file — `site/` (the analogous generated-output directory from `tools/build-site.js`) is committed to the repo (no `.gitignore` exists), so `renders/` should follow the same convention unless told otherwise.
- Keep all layout numbers as named constants at the top of the file (already done above) — this is what makes the "equal vertical bands" and "same left-to-right order" requirements easy to verify by reading the constants rather than computed magic numbers.


## Findings

# Review Findings — cardgame-card-authoring-engine, cycle 1

## Scope reviewed
- `tools/render-card.js` (new, 410 lines) — matches plan.md's literal script content verbatim.
- `renders/cards/*.svg` (18 new files, one per card in `design/cards/alpha-set.md`).
- `test/render-card.test.js` (new, pre-existing from prior commit `3aa43b8`, included in the unit's overall diff).

## AC accounting

- **AC1** (exits 0, exactly one SVG per alpha-set.md card): `design/cards/alpha-set.md` contains exactly 18 `###` sections, all carrying `Cost line:`/`Type line:`/`Rules text:` as line-start fields, and `renders/cards/` contains exactly 18 `.svg` files whose slugified names match all 18 card titles 1:1 (verified by direct name/slug comparison, not just count). `loadAllCards()` also scans `design/cards/card-anatomy.md` (the only other file in the directory), but grepping that file confirms no line starts with `Cost line:`/`Type line:`/`Rules text:`/`Stats/counters line:` — its Worked Examples describe fields in prose ("Sporeknit Warden is printed ... with Cost line \"3 Bloom\"...") rather than as line-start fields, so it correctly contributes zero card records. Script logic is fully synchronous with no unhandled paths for this input, so it exits 0. **Satisfied.**
- **AC2** (Signal-Wrought Prototype: two equal cyan/copper bands): `signal-wrought-prototype.svg` shows two `frame-band` rects, x=0/width=375 fill `#06b6d4` (cyan/Signal) then x=375/width=375 fill `#b5651d` (copper/Circuit) — equal width, correct left-to-right order matching the Cost line "1 Signal, 1 Circuit". **Satisfied.**
- **AC3** (Sporeknit Warden: single green band + "3" pip): `sporeknit-warden.svg` shows one `frame-band` rect spanning the full card width (750) filled `#2f9e44` (green/Bloom), and one `cost-pip` group with text "3". **Satisfied.**
- **AC4** (Stats Corner present/absent per Permanent + Stats/counters line): Verified across all 18 cards — every Permanent with a source `Stats/counters line:` field (Drone Cascade, Sporeknit Warden, Feral Bloomcaller, Rootbind Thicket, Salvage-Wrought Bastion, Line-Fleet Trooper, Wrought-Bloom Graft) renders a `<g class="stats-corner">` with that exact text; every Permanent without one (Replicant Foundry Core, Firmware Sentinel, Cinder-Forged Plating) and every non-Permanent card omits the element entirely (grepped for `stats-corner` — zero matches in those files). Positioning (bottom-right of the Rules-Text Box) matches card-anatomy.md's "small badge in the bottom corner of the Rules-Text Box" description, and geometry checks out arithmetically against the named layout constants. **Satisfied.**
- **AC5** (Art Window placeholder only, no image/game-rule logic): `renderArtWindow()` emits a flat-fill rect plus a static "Art Placeholder" label and takes no card-specific input. The script requires only `node:fs`/`node:path`, contains no `fetch`/`http`/`child_process` usage, and performs no game-state computation (no resource totals, no combat/turn logic) — it only reformats the four already-authored text fields into boxes. **Satisfied.**
- **AC6** (held_out, determinism) — not gating this review since it's held out, but noted as satisfied by construction per plan.md (no `Date.now`/`Math.random`, stable sorts, output dir wiped+rebuilt each run).

## Findings

None. No INTRODUCED defects found. The diff is a faithful, verified implementation of plan.md with no scope creep — it touches only the new script and its generated output plus the pre-existing test file from the prior commit.

Minor, non-blocking observations (not gating, no AC violated):
- `renderStatsCorner`'s wrap width (26 chars) and the Rules-Text Box's are independently chosen constants; for the current 18-card dataset none of the wrapped stats-corner text or rules/flavor text blocks overlap (verified by hand-checking y-coordinates on every stats-corner-bearing card), but the layout has no runtime overlap guard if a future card's text runs long. This is a forward-looking robustness note, not a violation of any visible AC on the data that exists today.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T07:37:07.552Z] **bolt:start** — unit=cardgame-card-authoring-engine start_sha=742424b6ddec9218e49c51dd6ca431f2a4f21cda branch=bolt/cardgame-card-authoring-engine worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-card-authoring-engine
- [2026-07-28T07:37:10.044Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T07:44:57.968Z] **plan:done** — plan.md written
- [2026-07-28T07:47:51.265Z] **tests:done** — RED verified on test/render-card.test.js (exit=1)
- [2026-07-28T07:49:20.930Z] **build:c1** — tests green, committed
- [2026-07-28T07:53:17.201Z] **review:c1** — APPROVE
- [2026-07-28T07:56:56.218Z] **review:devils-advocate** — APPROVE
- [2026-07-28T07:56:58.985Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-28T07:56:59.281Z] **merge:done** — auto-merged bolt/cardgame-card-authoring-engine into master (worktree)


## Receipt

```json
{
  "start_sha": "742424b6ddec9218e49c51dd6ca431f2a4f21cda",
  "end_sha": "9d053417ef6c605408b12a8662aa3a338f2a1afb",
  "diff_nonempty": true,
  "test_cmd": "node --test",
  "exit_code": 0,
  "criteria_covered": [
    {
      "id": "AC1",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC2",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC3",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC4",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC5",
      "held_out": false,
      "passed": true
    },
    {
      "id": "AC6",
      "held_out": true,
      "passed": true
    }
  ],
  "cycles": 1,
  "timestamp": "2026-07-28T07:56:58.983Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-card-authoring-engine\\plan.md`.\n\nSummary of the plan: a single new file, `tools/render-card.js`, zero dependencies, that parses `###`-level card records from `design/cards/*.md` (via the existing `Cost line:`/`Type line:`/`Rules text:`/`Stats/counters line:` field-prefix convention) and renders each as a self-contained, deterministic SVG into `renders/cards/<slug>.svg` — full working code, geometry constants, Fount color table, and a walkthrough of exactly how each AC (including the held-out determinism one) is satisfied are all in the plan. `GATE: none` — this is a low-risk, fully reversible, pure-addition unit.\n\nTwo things to flag:\n- TTS narration is blocked in this session (the `claude_speak.py` calls required approval each time and I couldn't get it through), so despite the global config asking for constant narration, none of it actually reached you as audio this turn.\n- While drafting, I mistakenly wrote a scratch syntax-check file to `C:\\github\\.agentbox-worktrees\\cardGame\\_scratch_render_card_check.js` (sibling to the repo, to verify the script parses) — that violates the \"plan.md is the only file I write\" rule for this hat. I can't delete it myself; the sandbox blocked both `rm` and `Remove-Item` there since it's outside the allowed working directories. You'll want to delete that file manually — it's not part of the repo or the plan.",
    "test_writer": "This is being blocked by the permission system and needs the user to approve it interactively. Let me ask directly.\n\nI need your approval to run `node --test test/render-card.test.js` in the worktree to verify the new tests actually fail (RED check) before I hand this off. Can you approve that tool call?",
    "builder_c1": "Clean — only new files added (`tools/render-card.js` and generated `renders/`), nothing under `test/` touched. The full suite is green (230/230 passing).",
    "reviewer_c1": "All 5 visible ACs verified against the actual rendered SVGs and script logic (I couldn't execute `node` directly here — sandbox blocked it — but cross-checked geometry, parsing, and card counts by hand against the committed output files). No introduced defects; diff is a faithful, scope-contained implementation of plan.md.\n\nAPPROVE",
    "devils_advocate": "Ran a full static audit of the diff against all five visible ACs — cross-checked every one of the 18 rendered SVGs against `design/cards/alpha-set.md`'s cost lines, type lines, rules text, and stats lines, and against `card-anatomy.md`'s multi-Fount band-ordering and Stats-Corner-omission rules.\n\nFindings:\n- AC1: `loadAllCards()` scans all of `design/cards/*.md`, not just `alpha-set.md` — but the intent text explicitly specifies this wildcard behavior (\"parses card records from design/cards/*.md\"), and I confirmed by grep that `card-anatomy.md` has zero lines starting with the field prefixes (its worked-example prose uses `Cost line \"3 Bloom\"`, no colon), so it contributes zero false-positive cards today. 18 cards in, 18 SVGs out, names match by slug.\n- AC2/AC3: band widths, colors, and ordering (Cost-line order, not alphabetical) verified correct for both split-frame and single-frame cards, including pip amounts.\n- AC4: manually verified every Permanent in the set — including two not named in the ACs (Tangle-Forged Bolt, Replicant Foundry Core) — correctly omit the Stats Corner when no Stats/counters line exists, and render it when one does, with exact source text.\n- AC5: only `art-window` placeholder rect + \"Art Placeholder\" label; no `<image>`/`href`; script only requires `node:fs`/`node:path`; no network/subprocess calls; no game-rule keywords in the script.\n- Committing generated SVGs to the repo matches the existing `tools/build-site.js` → `site/*.html` precedent already in the codebase, so that's not a new pattern.\n\nI couldn't construct a concrete failure scenario against any visible AC. The attack fails.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
