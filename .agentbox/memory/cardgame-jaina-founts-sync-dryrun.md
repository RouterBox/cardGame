# cardgame-jaina-founts-sync-dryrun

- merged: 2026-07-30T12:02:12.930Z
- intent: design/DESIGN-READINESS.md's Open Gap 4 names the hole directly: tools/sync-cards-to-jaina.js only syncs card records, and while characters, races, the star atlas, and lore eras are already in flight as open sibling proposals, design/world.md's 'Cosmology: The Five Founts' section — the five currents (Mass, Bloom, Signal, Circuit, Tangle) every race, generator, and card Cost line in the game is built on — remains markdown-only prose with no Jaina schema or sync path. This is the next narrow slice under the same 2026-07-28 ideas-inbox 'use Jaina as the content backbone' directive that produced cardgame-jaina-card-sync-dryrun (T1 discipline: no live write, Founts only — not world.md's 'The Setting' or 'A History in Brief' sections, which are free-form narrative prose with no per-item structure and are explicitly out of scope, matching how the star-atlas and lore proposals each deferred non-parseable prose). Add lib/parse-founts-markdown.js, a shared parser mirroring lib/parse-card-markdown.js's conventions (reusing its exported slugify), that reads design/world.md, locates the '## Cosmology: The Five Founts' section, and extracts one record per '###' subheading inside it: name (the heading text after the em-dash, e.g. '### The Mass — materials' -> 'The Mass'), slug (slugify(name)), domain (the heading text after the em-dash, e.g. 'materials'), and description (that section's full prose paragraph, verbatim). tools/sync-founts-to-jaina.js prints one JSON payload per record in --dry-run mode and, mirroring its sibling dry-run-only proposals, makes no live Jaina API calls in this unit — printing a 'not yet implemented' message and exiting 1 without --dry-run, so no credentials or network access are required by node --test. This is content-authoring tooling under the T16 partial software-gate opening, not game implementation.
- criteria: AC1, AC2, AC3, AC4, AC5 (1 held out)

## Reviewer notes worth keeping

# Blind Review — cardgame-jaina-founts-sync-dryrun, cycle 1

## Scope

Diff adds two new files (`lib/parse-founts-markdown.js`,
`tools/sync-founts-to-jaina.js`) and two new test files. No existing file
is modified. Reviewed against the spec, plan.md, and by reading the actual
`design/world.md` content and the sibling files this unit is required to
mirror (`lib/parse-star-atlas-markdown.js`, `lib/parse-card-markdown.js`).

Note: shell execution of `node --test` was blocked by the sandbox in this
review session ("This command requires approval"), so correctness was
verified by static trace against the real `design/world.md` bytes rather
than by executing the suite. Traced by hand:

- Confirmed `design/world.md`'s heading structure exactly matches what the
  parser expects (`## Cosmology: The Five Founts` at line 15, five `###`
  children at lines 19/23/27/31/35, each `Name — domain` using the same
  U+2014 em dash byte sequence, `cat -A`-verified, as the parser's
  `NAME_DOMAIN_PATTERN` regex literal).
- Confirmed `slugify` is imported and re-exported by reference from
  `lib/parse-card-markdown.js` (not reimplemented) and its algorithm
  produces the exact slugs asserted in the test
