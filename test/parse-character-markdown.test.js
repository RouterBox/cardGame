'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-character-markdown.js');

// ---------------------------------------------------------------------------
// AC2 (groundwork): lib/parse-character-markdown.js exists and exports a
// parseCharacterMarkdown(markdown, race) function plus a slugify(name)
// function that is byte-identical to lib/parse-card-markdown.js's algorithm,
// so the same character name produces the same slug anywhere in the repo.
// ---------------------------------------------------------------------------

test('AC2: lib/parse-character-markdown.js exists and exports parseCharacterMarkdown, slugify, and loadAllCharacters', () => {
  let mod;
  assert.doesNotThrow(() => {
    mod = require(LIB_PATH);
  }, `expected ${LIB_PATH} to exist and be requireable`);

  assert.strictEqual(typeof mod.parseCharacterMarkdown, 'function', 'expected an exported parseCharacterMarkdown function');
  assert.strictEqual(typeof mod.slugify, 'function', 'expected an exported slugify function');
  assert.strictEqual(typeof mod.loadAllCharacters, 'function', 'expected an exported loadAllCharacters function');
});

test('AC2: slugify matches lib/parse-card-markdown.js\'s existing algorithm', () => {
  const { slugify } = require(LIB_PATH);
  const { slugify: cardSlugify } = require(path.join(__dirname, '..', 'lib', 'parse-card-markdown.js'));

  assert.strictEqual(slugify('Kordelia Vess'), 'kordelia-vess');
  assert.strictEqual(slugify('Mother-Thread Ilvex'), 'mother-thread-ilvex');
  assert.strictEqual(slugify('Unit 0-Prime "Cast-Aside"'), 'unit-0-prime-cast-aside');
  assert.strictEqual(slugify('  Multiple   Spaces  '), 'multiple-spaces');

  // Same algorithm as the card parser, not just the same output by coincidence.
  const samples = ['Kordelia Vess', "Oathbreaker's Toll", 'Mother-Thread Ilvex', 'Unit 0-Prime "Cast-Aside"'];
  for (const name of samples) {
    assert.strictEqual(slugify(name), cardSlugify(name), `expected slugify("${name}") to match the card parser's slugify`);
  }
});

// ---------------------------------------------------------------------------
// AC1 (parser-level): parseCharacterMarkdown extracts one record per
// "## Name — Title" (em dash) section, with name/slug/race/title/bio/threads.
// ---------------------------------------------------------------------------

test('AC1: parseCharacterMarkdown parses a "## Name — Title" section with a bio and Threads list', () => {
  const { parseCharacterMarkdown } = require(LIB_PATH);

  const markdown = `# The Cindral Reach — Characters

## Kordelia Vess — Salvage-Marshal of the Cinder Yards

Kordelia Vess runs the largest scrapyard in the Reach. She wants what every
Reach commander secretly wants.

**Threads:**
- **Vantel Ninth-Chorus** (Wrought Assembly) — the Assembly enforcer sent to collect the fragment.
`;

  const characters = parseCharacterMarkdown(markdown, 'Cindral Reach');
  assert.strictEqual(characters.length, 1, 'expected exactly one parsed character');
  assert.deepStrictEqual(characters[0], {
    name: 'Kordelia Vess',
    slug: 'kordelia-vess',
    race: 'Cindral Reach',
    title: 'Salvage-Marshal of the Cinder Yards',
    bio: 'Kordelia Vess runs the largest scrapyard in the Reach. She wants what every Reach commander secretly wants.',
    threads: ['**Vantel Ninth-Chorus** (Wrought Assembly) — the Assembly enforcer sent to collect the fragment.'],
  });
});

test('AC1: parseCharacterMarkdown returns an empty threads array when no "**Threads:**" list follows the bio', () => {
  const { parseCharacterMarkdown } = require(LIB_PATH);

  const markdown = `## Solo Wanderer — The Unaffiliated

A character with no cross-race connections recorded yet.
`;

  const characters = parseCharacterMarkdown(markdown, 'Cindral Reach');
  assert.strictEqual(characters.length, 1);
  assert.deepStrictEqual(characters[0].threads, []);
});

test('AC1: parseCharacterMarkdown ignores H2 sections that are not "Name — Title" shaped (e.g. web.md\'s "## Overview")', () => {
  const { parseCharacterMarkdown } = require(LIB_PATH);

  const markdown = `## Overview

This is a narrative index section, not a character record.

## The Cinderglass Bargain

Another thread section heading with no em-dash name/title split.

## Kordelia Vess — Salvage-Marshal of the Cinder Yards

Kordelia Vess runs the largest scrapyard in the Reach.
`;

  const characters = parseCharacterMarkdown(markdown, 'Cindral Reach');
  assert.strictEqual(characters.length, 1, 'expected only the "Name — Title" section to be parsed as a character');
  assert.strictEqual(characters[0].name, 'Kordelia Vess');
});

test('AC1: parseCharacterMarkdown splits on the em dash (U+2014), not a plain hyphen, so hyphenated names survive intact', () => {
  const { parseCharacterMarkdown } = require(LIB_PATH);

  const markdown = `## Mother-Thread Ilvex — First Voice of the Sprawl

She speaks for the Sprawl.
`;

  const characters = parseCharacterMarkdown(markdown, 'Mireth Bloom');
  assert.strictEqual(characters.length, 1);
  assert.strictEqual(characters[0].name, 'Mother-Thread Ilvex');
  assert.strictEqual(characters[0].title, 'First Voice of the Sprawl');
});

// ---------------------------------------------------------------------------
// AC1 (repo-level): loadAllCharacters() reads design/characters/, excludes
// web.md, and returns exactly 20 records (4 per race file x 5 race files).
// ---------------------------------------------------------------------------

test('AC1: loadAllCharacters returns exactly 20 records across the 5 race files, excluding web.md', () => {
  const { loadAllCharacters } = require(LIB_PATH);

  const characters = loadAllCharacters();
  assert.strictEqual(characters.length, 20, `expected exactly 20 characters, found ${characters.length}`);

  const expectedRaces = new Set([
    'Cindral Reach',
    'Mireth Bloom',
    'Panoptic Concord',
    'Starweave Communion',
    'Wrought Assembly',
  ]);
  for (const character of characters) {
    assert.ok(expectedRaces.has(character.race), `unexpected race "${character.race}" for character "${character.name}"`);
  }

  // web.md's "## Overview" / thread headings must never surface as characters.
  assert.ok(
    !characters.some((c) => c.name === 'Overview' || c.title === undefined),
    'expected no records derived from web.md'
  );
});

test('AC1: loadAllCharacters gives every record exactly the name/slug/race/title/bio/threads fields', () => {
  const { loadAllCharacters, slugify } = require(LIB_PATH);

  const characters = loadAllCharacters();
  for (const character of characters) {
    assert.deepStrictEqual(
      Object.keys(character).sort(),
      ['bio', 'name', 'race', 'slug', 'threads'].concat(['title']).sort(),
      `expected record for "${character.name}" to carry exactly name/slug/race/title/bio/threads`
    );
    assert.strictEqual(character.slug, slugify(character.name));
    assert.strictEqual(typeof character.bio, 'string');
    assert.ok(character.bio.length > 0, `expected a non-empty bio for "${character.name}"`);
    assert.ok(Array.isArray(character.threads), `expected threads to be an array for "${character.name}"`);
  }
});
