'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, findSection } = require('./helpers/markdown');

const INBOX_PATH = path.join(__dirname, '..', 'design', 'ideas-inbox.md');

function readInbox() {
  if (!fs.existsSync(INBOX_PATH)) return null;
  return fs.readFileSync(INBOX_PATH, 'utf8');
}

const inboxContent = readInbox();
const headings = inboxContent
  ? parseSections(inboxContent).filter((s) => s.level === 2)
  : [];

// ---------------------------------------------------------------------------
// AC1: the 'characters per race' heading ends with
// '[incorporated: cardgame-race-characters]'.
// ---------------------------------------------------------------------------

test('AC1: design/ideas-inbox.md exists', () => {
  assert.ok(fs.existsSync(INBOX_PATH), `expected ${INBOX_PATH} to exist`);
});

test('AC1: "characters per race" heading ends with [incorporated: cardgame-race-characters]', () => {
  const idx = findSection(headings, /characters per race/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "characters per race"');
  assert.ok(
    headings[idx].title.endsWith('[incorporated: cardgame-race-characters]'),
    `expected heading "${headings[idx].title}" to end with [incorporated: cardgame-race-characters]`
  );
});

// ---------------------------------------------------------------------------
// AC2: 'card anatomy as layered compound object' and 'deterministic card
// authoring engine' headings end with their respective incorporated tags.
// ---------------------------------------------------------------------------

test('AC2: "card anatomy as layered compound object" heading ends with [incorporated: cardgame-card-anatomy-skeleton]', () => {
  const idx = findSection(headings, /card anatomy as layered compound object/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "card anatomy as layered compound object"');
  assert.ok(
    headings[idx].title.endsWith('[incorporated: cardgame-card-anatomy-skeleton]'),
    `expected heading "${headings[idx].title}" to end with [incorporated: cardgame-card-anatomy-skeleton]`
  );
});

test('AC2: "deterministic card authoring engine" heading ends with [incorporated: cardgame-card-authoring-engine]', () => {
  const idx = findSection(headings, /deterministic card authoring engine/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "deterministic card authoring engine"');
  assert.ok(
    headings[idx].title.endsWith('[incorporated: cardgame-card-authoring-engine]'),
    `expected heading "${headings[idx].title}" to end with [incorporated: cardgame-card-authoring-engine]`
  );
});

// ---------------------------------------------------------------------------
// AC3: the 'software gate ruling' heading ends with
// '[incorporated: cardgame-design-browser-site]', and the 'use Jaina as the
// content backbone' heading remains untagged.
// ---------------------------------------------------------------------------

test('AC3: "software gate ruling" heading ends with [incorporated: cardgame-design-browser-site]', () => {
  const idx = findSection(headings, /software gate ruling/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "software gate ruling"');
  assert.ok(
    headings[idx].title.endsWith('[incorporated: cardgame-design-browser-site]'),
    `expected heading "${headings[idx].title}" to end with [incorporated: cardgame-design-browser-site]`
  );
});

test('AC3: "use Jaina as the content backbone" heading ends with [incorporated: cardgame-jaina-card-sync-live]', () => {
  const idx = findSection(headings, /use jaina as the content backbone/i);
  assert.notStrictEqual(idx, -1, 'expected a heading containing "use Jaina as the content backbone"');
  assert.ok(
    headings[idx].title.endsWith('[incorporated: cardgame-jaina-card-sync-live]'),
    `expected heading "${headings[idx].title}" to end with [incorporated: cardgame-jaina-card-sync-live]`
  );
});
