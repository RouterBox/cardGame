# Blind Review — cardgame-fount-economy-generators (cycle 2)

## AC coverage

- **AC1** (exactly 6 cards, Cost/Type/Rules-text order, Stats/counters only on Permanents): card content in `design/cards/fount-economy-set.md` satisfies this — 6 distinct names, correct field order, Stats/counters lines present only on the two Biology Permanents. See INTRODUCED-1 below for why the accompanying test can't be trusted to confirm this reliably (it shares the same file/parsing approach, though the specific bug below doesn't happen to hit the AC1 assertions).
- **AC2** (exactly one Generator each for Bloom/Signal/Tangle, producing 1 point, citing Section 5.2, matching the "This permanent is a Generator attuned to the `<Fount>`" pattern): the card *content* does this correctly (Cradle-Root Colony/Bloom, Panoptic Relay Spire/Signal, Communion Waystone/Tangle). However the *test* added to verify it is broken — see INTRODUCED-1. This is the blocking finding.
- **AC3** (exactly one non-Generator card each costed exactly "1 Circuit" / "1 Bloom" / "1 Tangle"): satisfied by content (Stamped Chassis Unit, Sporeling Latch, Whispered Rite) and correctly verified by the test (its Generator-exclusion regex is a substring check that isn't affected by the bug below).

## Findings

### INTRODUCED-1 (blocking): AC2's core regex can never match the card text it's meant to verify

`test/design-fount-economy-cards.test.js` builds each card's `body` as the raw
markdown lines joined with `'\n'` (no whitespace normalization):

```js
return sections
  .filter((s) => s.level === 3)
  .map((s) => ({ title: s.title, body: s.lines.join('\n') }));
```

`isGeneratorAttunedTo` then matches against that raw body with a plain regex
that requires a literal space between "to" and "the `<Fount>`":

```js
function isGeneratorAttunedTo(card, fount) {
  return new RegExp(`This permanent is a Generator attuned to the ${fount}\\b`).test(card.body);
}
```

But in `design/cards/fount-economy-set.md`, all three Generators wrap their
rules text at exactly that point, e.g. Cradle-Root Colony:

```
Rules text: Slow. This permanent is a Generator attuned to
the Bloom: during the Generation Phase
...
```

The literal source text is `"...attuned to\nthe Bloom:..."` — a newline, not
a space, sits between "to" and "the". A plain space character in a JS regex
only matches U+0020, never `\n`, so `isGeneratorAttunedTo` returns `false`
for all three Generator cards (Cradle-Root Colony/Bloom, Panoptic Relay
Spire/Signal, Communion Waystone/Tangle) — despite the content genuinely
satisfying AC2.

**Failure scenario:** run `node --test test/design-fount-economy-cards.test.js`.
Every test built on `isGeneratorAttunedTo` fails with 0-matches-instead-of-1:
- `AC2: exactly one card is a Generator attuned to the Bloom` (and Signal, Tangle)
- `AC2: the <Fount> Generator produces 1 <Fount> Point, cites Section 5.2, and is a Permanent` (all three — the `assert.ok(match, ...)` fires first since `match` is `undefined`)
- `AC4: the <Fount> Generator names the <Race>` (all three, same root cause)

That's at least 9 failing tests in a suite whose entire purpose is to gate
this merge on AC2. The unit cannot be considered to have verified AC2 in its
current state.

The pre-existing helper `test/helpers/markdown.js` already ships a
`normalizeProse()` function built for exactly this situation — its own
comment says it "Collapses all whitespace runs (including newlines from the
rulebook's ~75-char line wrapping) to a single space... Lets prose regex
assertions match phrases regardless of where the source markdown happens to
wrap a line." The new test file imports only `parseSections` from that
helper and never uses `normalizeProse`, so none of the established handling
for wrapped rules text was applied here. Fix is either: normalize `body`
(or run `isGeneratorAttunedTo`'s regex against a normalized copy) before
matching, or replace the literal space in the regex with `\s+` (consistent
with how `Section\s+5\.2` is already written a few lines below it in the
same file).

## Summary

Card content is well-formed and does satisfy AC1–AC3 as written (the file,
races, costs, and Generator rules text all line up with the plan's
dual-typing resolution for Signal/Tangle). The blocker is that the test
suite this unit ships to verify AC2 (and the held-out AC4) does not actually
run green against that content, due to a whitespace-handling bug in the new
test file's Generator-matching regex.
