'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-character-markdown.js');
const CARD_LIB_PATH = path.join(__dirname, '..', 'lib', 'parse-card-markdown.js');

// ---------------------------------------------------------------------------
// AC1: lib/parse-character-markdown.js no longer declares its own local
// slugify function — it imports the canonical implementation from
// lib/parse-card-markdown.js, the way lib/parse-lore-markdown.js and
// lib/parse-founts-markdown.js already do.
// ---------------------------------------------------------------------------

test('AC1: parse-character-markdown.js does not declare a local slugify function', () => {
  const source = fs.readFileSync(LIB_PATH, 'utf8');
  assert.ok(
    !/function\s+slugify\s*\(/.test(source),
    'expected no local "function slugify(...)" declaration in lib/parse-character-markdown.js'
  );
});

test('AC1: parse-character-markdown.js imports slugify from ./parse-card-markdown', () => {
  const source = fs.readFileSync(LIB_PATH, 'utf8');
  assert.ok(
    /require\(\s*['"]\.\/parse-card-markdown['"]\s*\)/.test(source),
    "expected a require('./parse-card-markdown') import in lib/parse-character-markdown.js"
  );
});

// ---------------------------------------------------------------------------
// AC2: module.exports still includes slugify, and it is the very same
// function reference as lib/parse-card-markdown.js's slugify (not merely an
// algorithmically-identical re-declaration).
// ---------------------------------------------------------------------------

test('AC2: exported slugify is the imported reference and still produces the expected values', () => {
  const { slugify } = require(LIB_PATH);
  const { slugify: cardSlugify } = require(CARD_LIB_PATH);

  // The behavior-preservation claim in AC2 only means something once slugify
  // is actually the imported function rather than a same-algorithm copy —
  // assert that wiring first so this test is red until the refactor lands.
  assert.strictEqual(
    slugify,
    cardSlugify,
    'expected the exported slugify to be the same function reference as parse-card-markdown.js\'s slugify'
  );
  assert.strictEqual(slugify('Torel Ashgrave'), 'torel-ashgrave');
  assert.strictEqual(slugify('Kordelia Vess'), 'kordelia-vess');
});

// ---------------------------------------------------------------------------
// AC4: loadAllCharacters() called against the real design/characters/ files
// still returns the same character records (including slug values) as
// before the refactor, now produced via the shared imported slugify.
// ---------------------------------------------------------------------------

test('AC4: loadAllCharacters() records are slugged via the shared parse-card-markdown.js slugify and are otherwise unchanged', () => {
  const { loadAllCharacters, slugify } = require(LIB_PATH);
  const { slugify: cardSlugify } = require(CARD_LIB_PATH);

  // Same rationale as AC2 above: pin the wiring first so this fails now.
  assert.strictEqual(
    slugify,
    cardSlugify,
    'expected lib/parse-character-markdown.js to slug characters using the imported parse-card-markdown.js slugify'
  );

  const characters = loadAllCharacters();
  assert.strictEqual(characters.length, 20, `expected exactly 20 characters, found ${characters.length}`);

  const torel = characters.find((c) => c.name === 'Torel Ashgrave');
  assert.ok(torel, 'expected a "Torel Ashgrave" record from design/characters/');
  assert.strictEqual(torel.slug, 'torel-ashgrave');

  for (const character of characters) {
    assert.strictEqual(character.slug, slugify(character.name));
  }
});
