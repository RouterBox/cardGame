# cardgame-render-engine-premium-layers: Render engine: implement the Borderless, Foil, and Extended-Art premium layers from card-anatomy.md

## Header

- unit: cardgame-render-engine-premium-layers
- title: Render engine: implement the Borderless, Foil, and Extended-Art premium layers from card-anatomy.md
- project: cardgame
- completed: 2026-07-29
- outcome: merged
- start_sha: c8de43e81eb930547c73f154d340a626cd267dea
- end_sha: e189c11dfbf1db503f84f65b37009313bcb905ab

## Intent

design/cards/card-anatomy.md (shipped)'s 'The Layers' section defines Base Treatment plus four premium layer swaps — Borderless, Foil, Alt-Art, Extended Art — each stating precisely what 'may change' and 'may not change' relative to Base, plus a Cohesion rule that the Name Slot, Cost Slot, Type Line, Rules-Text Box, and Stats Corner must carry identical content across every treatment. tools/render-card.js (shipped as part of cardgame-card-authoring-engine) is the deterministic layout engine T16 called for, reading card-anatomy.md's zone geometry as its input contract — but its renderCardSvg only ever produces the Base Treatment; there is no treatment parameter, CLI flag, or per-layer branch anywhere in the file, confirmed by test/render-card.test.js's AC5 asserting the script is layout-only. This unit adds a treatment parameter to renderCardSvg (default 'base', preserving today's exact output with no regression) plus 'borderless', 'foil', and 'extended-art' branches implementing exactly the mechanical rules card-anatomy.md already states: Borderless removes/shrinks the frame-band elements to a thin edge and expands the Art Window rect to the card's outer edge; Foil marks each frame-band element with a data-foil="true" attribute while leaving its x/y/width/height/fill identical to Base; Extended Art enlarges the Art Window rect upward to bleed behind the Name Slot's and Type Line's background bands while their text elements keep identical position and content. Alt-Art is explicitly out of scope — it swaps which illustration is composited, a concern of tools/composite-card-art.js's brief-selection step, not this deterministic layout engine, and is left for a follow-on unit. No card file, rules.md, or composite-card-art.js is touched; composite-card-art.js's own call sites keep calling renderCardSvg with no treatment argument and so keep producing Base Treatment output, unaffected by this change.

## Acceptance Criteria

- AC1 [paraphrase]: tools/render-card.js's renderCardSvg function accepts a treatment argument with values 'base' (default when omitted), 'borderless', 'foil', and 'extended-art'; calling it with 'base' or with no treatment argument at all produces byte-identical SVG output, for every card currently loaded by loadAllCards(), to what renderCardSvg(card) produces today.
- AC2 [paraphrase]: For the 'borderless' treatment, the rendered SVG contains no frame-band rect element with a width equal to its base-treatment width (each frame-band is either absent or rendered at a fixed thin-edge width materially smaller than the base treatment's), and the art-window element's width and height equal the full card width and height (CARD_WIDTH/CARD_HEIGHT) rather than the base treatment's margin-inset Art Window dimensions.
- AC3 [paraphrase]: For the 'foil' treatment, every frame-band element carries a data-foil="true" attribute, and for the same card each frame-band's x, y, width, height, and fill values are identical between the 'foil' and 'base' treatment outputs.
- AC4 [paraphrase]: For the 'extended-art' treatment, the art-window element's rendered height is greater than its base-treatment height (it bleeds upward into the Name Slot/Type Line region), while the Name Slot's and Type Line's text elements are present with the exact same text content and the exact same x/y coordinates as in the base treatment.
- AC5 [inferred] (held_out): Across all four treatments ('base', 'borderless', 'foil', 'extended-art') rendered for the same card, the Name Slot text, Cost Slot pip values and order, Type Line text, Rules-Text Box text, and Stats Corner presence-and-content (when the card has one) are byte-identical in every treatment's SVG output, and design/cards/*.md and tools/composite-card-art.js remain byte-identical to before this unit.

## Plan

GATE: none

# Plan: cardgame-render-engine-premium-layers

## Summary

`tools/render-card.js`'s `renderCardSvg(card)` only ever renders the Base
Treatment. This unit adds a `treatment` parameter (`'base'` default,
`'borderless'`, `'foil'`, `'extended-art'`) and three new rendering branches
that implement exactly the mechanical rules `design/cards/card-anatomy.md`'s
"The Layers" section already states for those three premium layers. Alt-Art
is out of scope (it's an art-compositing concern, not a layout concern).
`tools/composite-card-art.js`, all `design/cards/*.md` files, and
`design/rules.md` are **not touched** — they keep calling `renderCardSvg`
with no treatment argument and keep getting Base Treatment output.

Only two files change:
1. `tools/render-card.js` — the implementation.
2. `test/render-card.test.js` — new tests appended (existing tests are left
   alone; they double as the regression guard for AC1).

## Background you need before touching code

`tools/render-card.js`'s layout geometry (all module-level consts, already
in the file, do not change these):

```
CARD_WIDTH = 750
CARD_HEIGHT = 1050
FRAME_MARGIN = 24
INNER_X = INNER_Y = 24
INNER_WIDTH = 702, INNER_HEIGHT = 1002
NAME_SLOT_HEIGHT = 70
ART_WINDOW_HEIGHT = 420
TYPE_LINE_HEIGHT = 50
RULES_BOX_Y = INNER_Y + NAME_SLOT_HEIGHT + ART_WINDOW_HEIGHT + TYPE_LINE_HEIGHT   (= 564)
RULES_BOX_HEIGHT = INNER_HEIGHT - NAME_SLOT_HEIGHT - ART_WINDOW_HEIGHT - TYPE_LINE_HEIGHT
```

Today's render order inside `renderCardSvg` (base treatment, unchanged by
this unit): `frameBands, nameSlot, artWindow, typeLine, rulesTextBox,
costPips[, statsCorner]`. Zones are plain SVG `<rect>`/`<text>` elements
painted in that array order — later entries paint over earlier ones where
they overlap.

## File 1: `tools/render-card.js`

### Change 1 — add a constant for the Borderless thin edge

Find this block (around line 27-29):

```js
const CARD_WIDTH = 750;
const CARD_HEIGHT = 1050;
const FRAME_MARGIN = 24;
```

Add a new constant directly after it:

```js
const CARD_WIDTH = 750;
const CARD_HEIGHT = 1050;
const FRAME_MARGIN = 24;

// Borderless treatment: total width of the thinned Frame/Border edge (split
// evenly across however many frame-band Founts a card has), replacing the
// base treatment's full CARD_WIDTH split. Deliberately tiny relative to
// CARD_WIDTH so it's "materially smaller" for any Fount count.
const BORDERLESS_EDGE_WIDTH = 8;
```

### Change 2 — `renderFrameBands`: add `edgeWidth` and `foil` options

Replace the whole function (currently lines 129-137):

```js
function renderFrameBands(frameFounts) {
  const bandWidth = CARD_WIDTH / frameFounts.length;
  return frameFounts
    .map((fount, idx) => {
      const color = FOUNT_COLORS[fount];
      return `<rect class="frame-band" data-fount="${fount}" data-color="${color.name}" x="${idx * bandWidth}" y="0" width="${bandWidth}" height="${CARD_HEIGHT}" fill="${color.hex}"/>`;
    })
    .join('\n');
}
```

with:

```js
function renderFrameBands(frameFounts, { edgeWidth, foil = false } = {}) {
  const totalWidth = edgeWidth != null ? edgeWidth : CARD_WIDTH;
  const bandWidth = totalWidth / frameFounts.length;
  return frameFounts
    .map((fount, idx) => {
      const color = FOUNT_COLORS[fount];
      const foilAttr = foil ? ' data-foil="true"' : '';
      return `<rect class="frame-band" data-fount="${fount}" data-color="${color.name}"${foilAttr} x="${idx * bandWidth}" y="0" width="${bandWidth}" height="${CARD_HEIGHT}" fill="${color.hex}"/>`;
    })
    .join('\n');
}
```

Note why this is byte-identical for base: called with no options,
`edgeWidth` is `undefined` so `totalWidth = CARD_WIDTH` (same formula as
before) and `foilAttr = ''` (adds nothing — the template literal already
has the `" x="` that used to follow `data-color="..."` directly, so an
empty `foilAttr` reproduces the exact original string).

### Change 3 — `renderArtWindow`: accept an override rect

Replace the whole function (currently lines 175-181):

```js
function renderArtWindow() {
  const y = INNER_Y + NAME_SLOT_HEIGHT;
  return [
    `<rect class="art-window" x="${INNER_X}" y="${y}" width="${INNER_WIDTH}" height="${ART_WINDOW_HEIGHT}" fill="#c9ccd3" stroke="#9a9da5" stroke-width="2"/>`,
    `<text x="${INNER_X + INNER_WIDTH / 2}" y="${y + ART_WINDOW_HEIGHT / 2}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#5a5d66">Art Placeholder</text>`,
  ].join('\n');
}
```

with:

```js
function renderArtWindow({
  x = INNER_X,
  y = INNER_Y + NAME_SLOT_HEIGHT,
  width = INNER_WIDTH,
  height = ART_WINDOW_HEIGHT,
} = {}) {
  return [
    `<rect class="art-window" x="${x}" y="${y}" width="${width}" height="${height}" fill="#c9ccd3" stroke="#9a9da5" stroke-width="2"/>`,
    `<text x="${x + width / 2}" y="${y + height / 2}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#5a5d66">Art Placeholder</text>`,
  ].join('\n');
}
```

Called with no args, the defaults reproduce the original `x`, `y`, `width`,
`height` values exactly (`y` default is the same expression the old code
computed into a local `y` variable; `x + width/2` and `y + height/2` are the
same values the old text-position math produced) — byte-identical output.

### Change 4 — `renderCardSvg`: add the `treatment` parameter

Replace the whole function (currently lines 248-272):

```js
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
```

with:

```js
const TREATMENTS = ['base', 'borderless', 'foil', 'extended-art'];

function renderCardSvg(card, treatment = 'base') {
  if (!TREATMENTS.includes(treatment)) {
    throw new Error(`unknown treatment "${treatment}" (expected one of ${TREATMENTS.join(', ')})`);
  }

  const costItems = parseCostItems(card.costLine);
  const frameFounts = orderedFrameFounts(costItems);
  const isPermanent = /\bPermanent\b/.test(card.typeLine);
  const hasStatsCorner = isPermanent && Boolean(card.statsLine);

  const frameBands = renderFrameBands(frameFounts, {
    edgeWidth: treatment === 'borderless' ? BORDERLESS_EDGE_WIDTH : undefined,
    foil: treatment === 'foil',
  });

  let artWindow;
  if (treatment === 'borderless') {
    // Borderless: Frame/Border shrinks to a thin edge, Art Window bleeds to
    // the card's outer physical edge (card-anatomy.md, "The Layers").
    artWindow = renderArtWindow({ x: 0, y: 0, width: CARD_WIDTH, height: CARD_HEIGHT });
  } else if (treatment === 'extended-art') {
    // Extended Art: Art Window enlarges upward to bleed behind the Name
    // Slot's and Type Line's background bands. Width is unchanged — only
    // the top edge and height move.
    artWindow = renderArtWindow({ y: INNER_Y, height: RULES_BOX_Y - INNER_Y });
  } else {
    artWindow = renderArtWindow();
  }

  const nameSlot = renderNameSlot(card.name);
  const typeLine = renderTypeLine(card.typeLine);
  const rulesTextBox = renderRulesTextBox(card.rulesText, card.flavorText);
  const costPips = renderCostPips(costItems);

  // Borderless and extended-art both enlarge the Art Window so it bleeds
  // behind other zones — paint it *before* those zones so their (still
  // opaque) backgrounds stay on top and legible, per the Cohesion rule.
  const artBleedsBehindContent = treatment === 'borderless' || treatment === 'extended-art';

  const layers = artBleedsBehindContent
    ? [frameBands, artWindow, nameSlot, typeLine, rulesTextBox, costPips]
    : [frameBands, nameSlot, artWindow, typeLine, rulesTextBox, costPips];
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
```

Called as `renderCardSvg(card)` or `renderCardSvg(card, 'base')`,
`artBleedsBehindContent` is `false`, `frameBands`/`artWindow` are built with
the exact same calls as the pre-change code, and the `layers` array is in
the exact same order as before — byte-identical output, satisfying AC1.

**Do not change anything else in the file.** `renderNameSlot`,
`renderTypeLine`, `renderRulesTextBox`, `renderCostPips`,
`renderStatsCorner`, `parseCostItems`, `orderedFrameFounts`, `textBlock`,
`escapeXml`, `wrapText`, `main()`, and `module.exports` all stay exactly as
they are today. `main()` still calls `renderCardSvg(card)` with no
treatment argument, so `node tools/render-card.js`'s CLI output is
unaffected. `module.exports` does not need new entries — the test file
below only needs `loadAllCards` and `renderCardSvg`, both already exported.

## File 2: `test/render-card.test.js`

Leave every existing `test(...)` block untouched — they already assert
specific structural facts about Base Treatment output (frame band count/
colors/widths, stats-corner presence, no `<image>`/`href`), so if this
unit's refactor broke Base output, those tests would fail. They are this
unit's regression guard for "no regression to today's output."

### Add a new import

Near the top of the file, alongside the existing `require`s (after the
`parseSections` require, around line 7), add:

```js
const { loadAllCards, renderCardSvg } = require('../tools/render-card');
```

### Append these new tests to the end of the file

```js
// ---------------------------------------------------------------------------
// Premium layer treatments (renderCardSvg's `treatment` parameter)
// ---------------------------------------------------------------------------

function extractNameSlotText(svg) {
  // font-size="32" is unique to the Name Slot's textBlock() call.
  const match = /<text[^>]*font-size="32"[^>]*>[\s\S]*?<\/text>/.exec(svg);
  assert.ok(match, 'expected a Name Slot text element');
  return match[0];
}

function extractTypeLineText(svg) {
  // font-size="20" fill="#3a3a3f" is unique to the Type Line's textBlock() call.
  const match = /<text[^>]*font-size="20" fill="#3a3a3f"[^>]*>[\s\S]*?<\/text>/.exec(svg);
  assert.ok(match, 'expected a Type Line text element');
  return match[0];
}

function extractRulesText(svg) {
  // font-size="20" fill="#1c1c22" is unique to the Rules-Text Box's main paragraph.
  const match = /<text[^>]*font-size="20" fill="#1c1c22"[^>]*>[\s\S]*?<\/text>/.exec(svg);
  assert.ok(match, 'expected a Rules-Text Box text element');
  return match[0];
}

function extractFlavorText(svg) {
  const match = /<text[^>]*font-size="18"[^>]*font-style="italic"[^>]*>[\s\S]*?<\/text>/.exec(svg);
  return match ? match[0] : null;
}

function extractCostPips(svg) {
  return svg.match(/<g[^>]*class="cost-pip"[\s\S]*?<\/g>/g) || [];
}

function extractStatsCorner(svg) {
  const match = /<g class="stats-corner">[\s\S]*?<\/g>/.exec(svg);
  return match ? match[0] : null;
}

test("Treatment AC1: treatment 'base' and an omitted treatment argument render identically for every card", () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  for (const card of loadAllCards()) {
    const withDefault = renderCardSvg(card);
    const withBase = renderCardSvg(card, 'base');
    assert.strictEqual(withDefault, withBase, `expected renderCardSvg(card) === renderCardSvg(card, 'base') for "${card.name}"`);
  }
});

test('Treatment AC2: borderless shrinks frame bands to a thin edge and expands the art window to the full card', () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  for (const card of loadAllCards()) {
    const baseSvg = renderCardSvg(card, 'base');
    const borderlessSvg = renderCardSvg(card, 'borderless');

    const baseBands = baseSvg.match(/<rect[^>]*class="frame-band"[^>]*\/>/g) || [];
    const borderlessBands = borderlessSvg.match(/<rect[^>]*class="frame-band"[^>]*\/>/g) || [];
    assert.ok(baseBands.length > 0, `expected at least one base frame band for "${card.name}"`);

    const baseWidth = Number(/\bwidth="([-\d.]+)"/.exec(baseBands[0])[1]);
    for (const band of borderlessBands) {
      const width = Number(/\bwidth="([-\d.]+)"/.exec(band)[1]);
      assert.notStrictEqual(width, baseWidth, `expected borderless frame band width to differ from base for "${card.name}"`);
      assert.ok(width < baseWidth, `expected borderless frame band width (${width}) to be materially smaller than base (${baseWidth}) for "${card.name}"`);
    }

    const viewBoxMatch = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(borderlessSvg);
    const cardWidth = Number(viewBoxMatch[1]);
    const cardHeight = Number(viewBoxMatch[2]);
    const borderlessArtWindow = /<rect[^>]*class="art-window"[^>]*\/>/.exec(borderlessSvg)[0];
    const width = Number(/\bwidth="([-\d.]+)"/.exec(borderlessArtWindow)[1]);
    const height = Number(/\bheight="([-\d.]+)"/.exec(borderlessArtWindow)[1]);
    assert.strictEqual(width, cardWidth, `expected borderless art window width to equal card width for "${card.name}"`);
    assert.strictEqual(height, cardHeight, `expected borderless art window height to equal card height for "${card.name}"`);
  }
});

test('Treatment AC3: foil marks every frame band with data-foil="true" and keeps x/y/width/height/fill identical to base', () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  for (const card of loadAllCards()) {
    const baseSvg = renderCardSvg(card, 'base');
    const foilSvg = renderCardSvg(card, 'foil');

    const baseBands = baseSvg.match(/<rect[^>]*class="frame-band"[^>]*\/>/g) || [];
    const foilBands = foilSvg.match(/<rect[^>]*class="frame-band"[^>]*\/>/g) || [];
    assert.strictEqual(foilBands.length, baseBands.length, `expected same frame band count for "${card.name}"`);

    for (let i = 0; i < baseBands.length; i++) {
      assert.ok(/data-foil="true"/.test(foilBands[i]), `expected foil frame band ${i} to carry data-foil="true" for "${card.name}"`);
      for (const attr of ['x', 'y', 'width', 'height', 'fill']) {
        const baseVal = new RegExp(`\\b${attr}="([^"]+)"`).exec(baseBands[i])[1];
        const foilVal = new RegExp(`\\b${attr}="([^"]+)"`).exec(foilBands[i])[1];
        assert.strictEqual(foilVal, baseVal, `expected foil frame band ${i} attribute "${attr}" to match base for "${card.name}"`);
      }
    }
  }
});

test('Treatment AC4: extended-art enlarges the art window upward while Name Slot/Type Line text stay identical', () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  for (const card of loadAllCards()) {
    const baseSvg = renderCardSvg(card, 'base');
    const extendedSvg = renderCardSvg(card, 'extended-art');

    const baseArtWindow = /<rect[^>]*class="art-window"[^>]*\/>/.exec(baseSvg)[0];
    const extendedArtWindow = /<rect[^>]*class="art-window"[^>]*\/>/.exec(extendedSvg)[0];
    const baseHeight = Number(/\bheight="([-\d.]+)"/.exec(baseArtWindow)[1]);
    const extendedHeight = Number(/\bheight="([-\d.]+)"/.exec(extendedArtWindow)[1]);
    assert.ok(extendedHeight > baseHeight, `expected extended-art window height (${extendedHeight}) to exceed base (${baseHeight}) for "${card.name}"`);

    assert.strictEqual(extractNameSlotText(extendedSvg), extractNameSlotText(baseSvg), `expected Name Slot text unchanged for "${card.name}"`);
    assert.strictEqual(extractTypeLineText(extendedSvg), extractTypeLineText(baseSvg), `expected Type Line text unchanged for "${card.name}"`);
  }
});

test('Treatment AC5 (held-out): rules-relevant zones stay byte-identical across all four treatments', () => {
  assert.ok(!runError, 'render script must succeed before its output can be checked');
  const TREATMENTS = ['base', 'borderless', 'foil', 'extended-art'];
  for (const card of loadAllCards()) {
    const svgs = TREATMENTS.map((t) => renderCardSvg(card, t));
    const [baseSvg, ...others] = svgs;
    const baseline = {
      name: extractNameSlotText(baseSvg),
      type: extractTypeLineText(baseSvg),
      rules: extractRulesText(baseSvg),
      flavor: extractFlavorText(baseSvg),
      pips: extractCostPips(baseSvg),
      stats: extractStatsCorner(baseSvg),
    };
    others.forEach((svg, idx) => {
      const treatment = TREATMENTS[idx + 1];
      assert.strictEqual(extractNameSlotText(svg), baseline.name, `Name Slot text differs in "${treatment}" for "${card.name}"`);
      assert.strictEqual(extractTypeLineText(svg), baseline.type, `Type Line text differs in "${treatment}" for "${card.name}"`);
      assert.strictEqual(extractRulesText(svg), baseline.rules, `Rules text differs in "${treatment}" for "${card.name}"`);
      assert.strictEqual(extractFlavorText(svg), baseline.flavor, `Flavor text differs in "${treatment}" for "${card.name}"`);
      assert.deepStrictEqual(extractCostPips(svg), baseline.pips, `Cost pips differ in "${treatment}" for "${card.name}"`);
      assert.strictEqual(extractStatsCorner(svg), baseline.stats, `Stats Corner differs in "${treatment}" for "${card.name}"`);
    });
  }
});

test('Treatment AC5 (held-out): composite-card-art.js stays unaware of the treatment parameter', () => {
  // composite-card-art.js is not touched by this unit and its own
  // test/composite-card-art.test.js (unmodified) is the behavioral proof its
  // Base Treatment output is unaffected. This is a lightweight guard against
  // this unit accidentally editing that file.
  const source = fs.readFileSync(path.join(REPO_ROOT, 'tools', 'composite-card-art.js'), 'utf8');
  assert.ok(!/treatment/i.test(source), 'expected composite-card-art.js to remain unaware of the treatment parameter');
});
```

Notes on why these tests are written this way:

- `fs`, `path`, and `assert` are already imported at the top of the test
  file — no new imports needed for those.
- `runError` is the existing module-level variable set in the existing
  `test.before()` block (runs `node tools/render-card.js` once) — reused
  here exactly as the existing tests reuse it.
- The `extract*Text` helpers key off each zone's distinct `font-size`/`fill`
  combination (already present in `textBlock()` calls today) rather than
  adding new `class`/`data-*` attributes to text elements — adding any such
  attribute unconditionally would itself break AC1's byte-identical
  requirement, so the tests work around this by reading the geometry/style
  values the code already emits.
- AC5's "design/cards/*.md ... remain byte-identical" half isn't given a
  dedicated file-diff test: this unit's implementation never opens or
  writes those files (only `tools/render-card.js` and
  `test/render-card.test.js` are touched — see plan scope above), so the
  constraint is satisfied by scope discipline, not by a fragile
  git-diff-based test. The AgentBox build/review step for this bolt should
  confirm via `git diff --stat` that no `design/cards/*.md` file appears in
  the diff.

## Manual verification (for the person running the bolt)

1. `node tools/render-card.js` — should still print
   `Rendered <N> card(s) into renders/cards/` (same N as before this
   change) and exit 0.
2. `node --test` — should report all existing tests passing plus 6 new
   ones (5 in `test/render-card.test.js` "Treatment AC*" tests, one of
   which is split into two — count is: AC1, AC2, AC3, AC4, AC5a, AC5b = 6
   new `test(...)` blocks), zero failures.
3. Quick manual sanity check (optional, not required by any AC):
   ```
   node -e "
   const { loadAllCards, renderCardSvg } = require('./tools/render-card');
   const card = loadAllCards()[0];
   console.log(renderCardSvg(card, 'foil').includes('data-foil=\"true\"'));
   "
   ```
   should print `true`.

## Expected `node --test` output shape

```
# tests <total including new 6>
# pass <total>
# fail 0
```
No new files are written under `renders/` beyond what `main()` already
writes (Base Treatment only) — the new treatments are only exercised via
direct `renderCardSvg(card, treatment)` calls in tests, never through the
CLI, matching the unit's scope (no CLI flag requested by any AC).

## Design decisions worth flagging (not spec bugs, just choices made)

- **Extended Art's exact bleed amount**: AC4 only requires the art window's
  rendered height to exceed the base height. This plan extends it to cover
  the Name Slot + Art Window + Type Line span (`RULES_BOX_Y - INNER_Y`,
  i.e. up through where the Rules-Text Box begins) rather than only into
  the Name Slot. Any value greater than `ART_WINDOW_HEIGHT` satisfies AC4;
  this one was chosen because card-anatomy.md says Extended Art bleeds
  behind *both* the Name Slot and the Type Line's backgrounds.
- **No semi-transparent banner treatment for Name Slot/Type Line in
  extended-art**: card-anatomy.md's general Layers section mentions the
  overlaid zones get "a semi-transparent banner rather than a solid
  background," but this unit's own Intent paragraph (the operative scope
  for this bolt) only requires the art window to bleed and the Name
  Slot/Type Line text to keep identical position/content — it does not
  mention opacity. No AC tests background opacity. Per this repo's
  "simplest solution first, don't add unrequested behavior" rule, the
  Name Slot/Type Line rects keep their solid `fill` exactly as in base.
  Reviewer should confirm this is acceptable; if not, revisit by giving
  `renderNameSlot`/`renderTypeLine` an opt-in `bannerOpacity` param —
  this is straightforward to add later without touching anything already
  covered by AC1's byte-identical requirement (the option would default to
  off).
- **Borderless frame bands are visually hidden**: because the full-bleed
  Art Window paints after the (now-tiny) frame bands, the thin edge is not
  actually visible in the rendered SVG — it exists in the DOM (satisfying
  AC2's element-level checks) but sits underneath the art window rect. No
  AC tests visibility/z-order, and this is a deterministic layout-only
  placeholder engine (confirmed by the existing AC5 in
  `test/render-card.test.js`, which asserts no game-rule or
  image-generation logic belongs in this file) — a real visual polish pass
  is out of scope here. Flagging so a reviewer isn't surprised by it.

## Risk assessment (FIRE)

- **Reversibility**: fully reversible — plain git-tracked source and test
  file edits, no migrations, no external state.
- **Security impact**: none — no new I/O, network, or subprocess calls;
  purely string/geometry logic over already-loaded in-memory card data.
- **User data**: none — no user data involved anywhere in this repo's
  design-tool scope.
- **Schema changes**: none — `card` object shape, `design/cards/*.md`
  format, and `renders/` output layout are all unchanged.

Given the above, this is a low-risk, fully test-covered change confined to
two files. **GATE: none.**


## Findings

# Blind Review — cardgame-render-engine-premium-layers, cycle 2

## Scope of diff

Two files touched, matching plan.md exactly:
- `tools/render-card.js`: adds `treatment` param to `renderCardSvg`, options
  objects to `renderFrameBands`/`renderArtWindow`, and three new branches
  (`borderless`, `foil`, `extended-art`).
- `test/render-card.test.js`: four new tests appended, existing tests
  untouched (these double as the AC1 regression guard).

No card file, `rules.md`, or `composite-card-art.js` touched. No other
files appear in the diff.

## Carried over from cycle 1

Cycle 1's findings.md flagged (non-blocking) that the `borderless`
treatment's full-bleed art window was painted *after* the frame bands and
so fully occluded the shrunk 8px-total "thin edge," making it invisible in
practice even though AC2's literal DOM-attribute checks still passed. This
cycle's diff changes the borderless layer order to
`[artWindow, frameBands, nameSlot, typeLine, rulesTextBox, costPips]` —
the art window now paints *first* and frame bands paint *after* (on top),
with a code comment explicitly calling this out: "its full-bleed Art
Window must sit *behind* the thin frame edge, not in front of it, or the
edge is invisible — so the frame bands paint last (on top) there." The
cycle-1 observation is resolved.

## AC-by-AC trace

**AC1 — `treatment` param, base/default byte-identical.** With `treatment`
omitted or `'base'`: `renderFrameBands(frameFounts, {edgeWidth: undefined,
foil: false})` reduces to the exact original formula (`totalWidth =
CARD_WIDTH`, empty `foilAttr` — the space before `x=` was already part of
the original literal, not contributed by `foilAttr`, so the string is
reproduced byte-for-byte). `renderArtWindow()` with no args reproduces the
original `x`/`y`/`width`/`height` defaults exactly. For any treatment other
than `'borderless'`/`'extended-art'` (i.e. `'base'` or unset), the `else`
branch of the layer-order conditional yields `[frameBands, nameSlot,
artWindow, typeLine, rulesTextBox, costPips]` (+ `statsCorner` if
applicable) — identical to the original `layers` array. Traced line-by-line
against the diff's removed lines for `renderFrameBands`, `renderArtWindow`,
and `renderCardSvg`; every default-path branch collapses to the original
code exactly. Satisfied.

**AC2 — borderless: shrunk frame bands, full-card art window.**
`BORDERLESS_EDGE_WIDTH = 8` makes every band's `width` = `8 /
frameFounts.length`, always far below the base `CARD_WIDTH /
frameFounts.length` for any realistic Fount count (1–5) — "materially
smaller" holds. `artWindow = renderArtWindow({x:0, y:0, width:CARD_WIDTH,
height:CARD_HEIGHT})`, and since the SVG's `viewBox` (read by the test's
`cardDimensions()`) is `0 0 CARD_WIDTH CARD_HEIGHT` regardless of
treatment, the width/height equality check in AC2 holds exactly. With the
paint-order fix (art window first, frame bands after), the thin edge is
also now actually visible rather than merely present in the DOM. Satisfied.

**AC3 — foil: `data-foil="true"` with identical x/y/width/height/fill.**
`foil: true` with `edgeWidth: undefined` keeps `totalWidth = CARD_WIDTH`
and thus the same `bandWidth`/`x`/`y`/`width`/`height`/`fill` as base;
`data-foil="true"` is spliced in between `data-color` and the (unchanged)
`" x="` literal, so it can't perturb any of the five compared attributes.
Foil's layer order falls into the same `else` branch as base (unaffected
paint order). Satisfied.

**AC4 — extended-art: taller art window, unchanged Name Slot/Type Line
text.** `artWindow = renderArtWindow({y: INNER_Y, height: RULES_BOX_Y -
INNER_Y})` → `y=24, height=540` vs. base's `y=94, height=420`. New range
`[24, 564]` vs. base's `[94, 514]` extends both upward behind the Name
Slot (y 24–94) and downward behind the Type Line (y 514–564) — matching
the Intent's "enlarges upward to bleed behind the Name Slot's and Type
Line's background bands." `540 > 420` satisfies the height assertion.
`renderNameSlot(card.name)` / `renderTypeLine(card.typeLine)` are called
identically to base, so their text elements are byte-identical in content
and x/y (verified against the test's font-size/fill-based extraction
regexes — Name Slot is uniquely `font-size="32"` + `font-weight="bold"`,
Type Line is uniquely `font-size="20" fill="#3a3a3f"` with no other zone
sharing that pair). Layer order `[frameBands, artWindow, nameSlot,
typeLine, rulesTextBox, costPips]` paints the enlarged art window before
the Name Slot/Type Line's opaque backgrounds, preserving their visible
appearance per the Cohesion rule. Satisfied.

All four visible ACs are accounted for and hold under static trace against
the diff and the current file state.

## Findings

None. No INTRODUCED defects found against the visible ACs; the design
concern raised in cycle 1 (borderless frame edge invisible due to paint
order) has been fixed in this cycle by reordering the borderless layer
array so the art window paints behind the frame bands rather than in
front of them.

## PRE-EXISTING (not gating)

None observed within this diff's surface area — both touched files are
additive to code the plan walked through line-by-line, and no other files
were modified.

## Verdict

All 4 visible ACs are satisfied. The cycle-1 non-blocking observation is
resolved. No introduced findings to gate on.

APPROVE


## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-29T06:21:22.418Z] **bolt:start** — unit=cardgame-render-engine-premium-layers start_sha=c8de43e81eb930547c73f154d340a626cd267dea branch=bolt/cardgame-render-engine-premium-layers worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-render-engine-premium-layers
- [2026-07-29T06:21:29.882Z] **baseline:done** — pre-edit test exit=0
- [2026-07-29T06:29:03.558Z] **plan:done** — plan.md written
- [2026-07-29T06:31:33.376Z] **tests:done** — RED verified on test/render-card.test.js (exit=1)
- [2026-07-29T06:33:14.851Z] **build:c1** — tests green, committed
- [2026-07-29T06:37:23.202Z] **review:c1** — APPROVE
- [2026-07-29T06:39:46.927Z] **review:devils-advocate** — NEEDS_WORK
- [2026-07-29T06:40:57.990Z] **build:c2** — tests green, committed
- [2026-07-29T06:44:31.849Z] **review:c2** — APPROVE
- [2026-07-29T06:44:39.310Z] **receipt:done** — valid=true exit=0 diff=true
- [2026-07-29T06:44:39.604Z] **merge:done** — auto-merged bolt/cardgame-render-engine-premium-layers into master (worktree)


## Receipt

```json
{
  "start_sha": "c8de43e81eb930547c73f154d340a626cd267dea",
  "end_sha": "44ca07358739664a5a04716031c3c939a35be4ce",
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
      "held_out": true,
      "passed": true
    }
  ],
  "cycles": 2,
  "timestamp": "2026-07-29T06:44:39.309Z",
  "valid": true,
  "agent_reports": {
    "planner": "Plan written to `C:\\github\\AgentBox\\units\\cardgame-render-engine-premium-layers\\plan.md`.\n\nSummary: the plan modifies only `tools/render-card.js` (adds `treatment` param to `renderCardSvg`, options to `renderFrameBands`/`renderArtWindow`, and reorders layers so the art window can bleed behind other zones for borderless/extended-art) and appends 6 new tests to `test/render-card.test.js`. Full before/after code, exact test bodies, manual verification steps, and expected `node --test` output are all included. `GATE: none` — the change is fully reversible, test-covered, and touches no design files or `composite-card-art.js`. I flagged three deliberate design choices (extended-art bleed extent, no semi-transparent banner since it's untested and out of the unit's own Intent scope, and borderless frame bands being DOM-present but visually occluded) for the reviewer to sanity-check.",
    "test_writer": "I attempted to run `node --test` on the test file to verify the new tests actually fail right now (the RED check), but the command requires your approval and hasn't been granted. Could you approve running:\n\n```\nnode --test \"C:/github/.agentbox-worktrees/cardGame/cardgame-render-engine-premium-layers/test/render-card.test.js\"\n```\n\nso I can confirm the tests are correctly red before I hand this off?",
    "builder_c1": "Only `tools/render-card.js` changed, matching the plan's scope (the test file was already committed in a prior cycle). Test suite is green: 594/594 passing.",
    "reviewer_c1": "Findings written to `findings.md`. All four visible ACs trace correctly through the diff (verified by hand: base-treatment byte-identity, borderless band-shrink/art-window expansion, foil attribute-only diff, extended-art height/text preservation). Only touched files are `tools/render-card.js` and `test/render-card.test.js`, matching the plan's stated boundary; `composite-card-art.js` call sites confirmed unaffected. One non-blocking observation noted: the borderless treatment's full-bleed art window fully occludes the shrunk frame-band rects (visually indistinguishable from removal), but AC2's literal wording permits this reading, so it doesn't gate the merge.\n\nAPPROVE",
    "devils_advocate": "## Devil's Advocate Review\n\n**Finding: Borderless treatment's frame band is completely invisible — occluded by its own full-bleed art window.**\n\n`tools/render-card.js:301-303`:\n\n```js\nconst artBleedsBehindContent = treatment === 'borderless' || treatment === 'extended-art';\nconst layers = artBleedsBehindContent\n  ? [frameBands, artWindow, nameSlot, typeLine, rulesTextBox, costPips]\n  : [frameBands, nameSlot, artWindow, typeLine, rulesTextBox, costPips];\n```\n\nFor `borderless`, `frameBands` is painted first (bottom layer), and `artWindow` is painted immediately after with `x:0, y:0, width:CARD_WIDTH, height:CARD_HEIGHT` (`render-card.js:281`) — the full card canvas, opaque fill `#c9ccd3` (`render-card.js:190`).\n\nThe frame band rects for `borderless` occupy `x: 0..8, y: 0..1050` (`BORDERLESS_EDGE_WIDTH = 8`, `render-card.js:135-145`), which is a strict subset of the art window's `0,0..750,1050` footprint. Since SVG paints later elements on top (painter's algorithm) and the art window has no transparency, the \"thin edge\" frame band is 100% covered by the full-bleed art window that's drawn directly on top of it. The result: a rendered borderless card shows *no visible border at all* — visually indistinguishable from a hypothetical zero-frame treatment, not the \"shrinks to a thin edge\" the unit's own intent describes and card-anatomy.md defines.\n\nContrast with `extended-art`, where the same ordering pattern is actually correct: the art window there is bounded by `RULES_BOX_Y` and sits *behind* the Name Slot/Type Line's own opaque background rects, which are drawn after it and cover it back up in their zones — exactly the \"bleed behind, background re-covers\" effect the design calls for. That mechanism only works because those zones' own backgrounds get drawn after the art window. Borderless has no such re-covering layer for the frame band — it's always bottom-most, and here the art window that's drawn on top of it is sized to be a strict superset of it, so nothing ever re-",
    "builder_c2": "Only `tools/render-card.js` changed, test suite is green (594/594). The fix reorders paint layers so the borderless treatment's frame band paints on top of the full-bleed art window instead of underneath it, making the thin edge actually visible instead of fully occluded — resolving the reviewer's finding without touching any tests.",
    "reviewer_c2": "Findings written to `C:\\github\\AgentBox\\units\\cardgame-render-engine-premium-layers\\findings.md`. All 4 visible ACs are satisfied by static trace; the cycle-1 non-blocking observation (borderless frame edge fully occluded by the full-bleed art window) has been fixed in this cycle by reordering the borderless paint order so the art window sits behind the frame bands. No introduced findings gate the merge.\n\nAPPROVE"
  }
}
```

## Comments

(no comments.md)
