'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText } = require('./helpers/markdown');

const RACES_DIR = path.join(__dirname, '..', 'design', 'races');
const CHAR_DIR = path.join(__dirname, '..', 'design', 'characters');

function listMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
}

function raceDisplayName(basename) {
  return basename
    .replace(/\.md$/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Parses "## Name — Title" character sections out of a character file's
// markdown, along with each character's identity prose and connections list.
function parseCharacters(content) {
  const sections = parseSections(content);
  const chars = [];
  for (const s of sections) {
    if (s.level !== 2) continue;
    const m = s.title.match(/^(.+?)\s+—\s+(.+)$/);
    if (!m) continue;
    const name = m[1].trim();
    const role = m[2].trim();
    const body = s.lines.join('\n');
    chars.push({ name, role, ...parseConnections(body) });
  }
  return chars;
}

// Shared by a character file's "**Threads:**" list and web.md's
// "**Characters:**" list — both use the same bullet format:
// - **Name** (Race Display Name) — note
function parseConnections(body) {
  const idx = body.search(/\*\*(?:Threads|Characters):?\*\*/i);
  const identity = (idx === -1 ? body : body.slice(0, idx)).replace(/\s+/g, ' ').trim();
  const listBlock = idx === -1 ? '' : body.slice(idx);
  const links = [];
  const re = /^-\s+\*\*(.+?)\*\*\s*\(([^)]+)\)\s*—\s*(.+)$/gm;
  let match;
  while ((match = re.exec(listBlock))) {
    links.push({ name: match[1].trim(), race: match[2].trim(), note: match[3].trim() });
  }
  return { identity, threads: links };
}

function extractHookNames(raceContent) {
  const sections = parseSections(raceContent);
  const body = sectionText(sections, /signature hooks/i) || '';
  const names = [];
  const re = /^-\s+\*\*([^*]+)\*\*/gm;
  let match;
  while ((match = re.exec(body))) {
    names.push(match[1].trim());
  }
  return names;
}

const raceFiles = listMdFiles(RACES_DIR);
// web.md is the interlink map, a sibling deliverable in the same directory —
// it is not a race roster file and has its own AC3 tests below.
const charFiles = listMdFiles(CHAR_DIR).filter((f) => f !== 'web.md');
const filesToCheck = charFiles.length ? charFiles : ['<no character files found under design/characters/>'];

// Parsed once at module load (fresh per test run).
const rosterByRace = {};
for (const file of charFiles) {
  const content = fs.readFileSync(path.join(CHAR_DIR, file), 'utf8');
  rosterByRace[file] = parseCharacters(content);
}

test('AC1: design/characters/ has exactly five files matching design/races/ basenames', () => {
  assert.ok(fs.existsSync(CHAR_DIR), `expected ${CHAR_DIR} to exist`);
  assert.strictEqual(raceFiles.length, 5, `expected exactly 5 files under design/races/, found ${raceFiles.length}`);
  assert.deepStrictEqual(
    charFiles,
    raceFiles,
    `expected design/characters/ basenames to match design/races/ exactly, got [${charFiles.join(', ')}]`
  );
});

for (const file of filesToCheck) {
  const filePath = path.join(CHAR_DIR, file);
  const raceName = raceDisplayName(file);

  test(`AC1: ${file} has 3-5 named characters`, () => {
    const chars = rosterByRace[file] || [];
    assert.ok(chars.length >= 3 && chars.length <= 5, `expected 3-5 characters in ${file}, found ${chars.length}`);
  });

  test(`AC2: ${file} characters each have an identity paragraph and a cross-race Threads entry`, () => {
    const chars = rosterByRace[file] || [];
    for (const c of chars) {
      assert.ok(c.identity.length > 120, `expected a substantive identity paragraph for "${c.name}" in ${file}`);
      assert.ok(c.role.length > 0, `expected a one-line role/title for "${c.name}" in ${file}`);
      assert.ok(c.threads.length >= 1, `expected at least one Threads entry for "${c.name}" in ${file}`);
      assert.ok(
        c.threads.some((t) => t.race !== raceName),
        `expected "${c.name}" in ${file} to name at least one character from a different race`
      );
    }
  });

  test(`AC5: ${file} references its race's canon (a signature hook) in character prose`, () => {
    const raceFilePath = path.join(RACES_DIR, file);
    assert.ok(fs.existsSync(raceFilePath), `expected matching race file ${raceFilePath} to exist`);
    const raceContent = fs.readFileSync(raceFilePath, 'utf8');
    const hooks = extractHookNames(raceContent);
    assert.ok(hooks.length > 0, `expected to find signature hooks in ${raceFilePath}`);
    const charContent = fs.readFileSync(filePath, 'utf8').toLowerCase();
    assert.ok(
      hooks.some((h) => charContent.includes(h.toLowerCase())),
      `expected ${file} to reference at least one of its race's signature hooks (${hooks.join(', ')}) in character prose`
    );
  });
}

test('AC4: character names are unique across the whole roster', () => {
  const allNames = charFiles.flatMap((f) => (rosterByRace[f] || []).map((c) => c.name));
  assert.strictEqual(
    new Set(allNames).size,
    allNames.length,
    `expected all character names to be unique, got [${allNames.join(', ')}]`
  );
});

test('AC4: every cross-race Threads reference points at a character that exists in the named race file', () => {
  const byRaceName = {};
  for (const f of charFiles) {
    byRaceName[raceDisplayName(f)] = new Set((rosterByRace[f] || []).map((c) => c.name));
  }
  for (const f of charFiles) {
    for (const c of rosterByRace[f] || []) {
      for (const t of c.threads) {
        assert.ok(
          Object.prototype.hasOwnProperty.call(byRaceName, t.race),
          `"${c.name}" in ${f} names an unknown race "${t.race}" in its Threads list`
        );
        assert.ok(
          byRaceName[t.race].has(t.name),
          `"${c.name}" in ${f} names "${t.name}" (${t.race}) in its Threads list, but no such character exists in that race's file`
        );
      }
    }
  }
});

test('AC3: design/characters/web.md exists, names every character, and each thread involves 2+ races', () => {
  const webPath = path.join(CHAR_DIR, 'web.md');
  assert.ok(fs.existsSync(webPath), `expected ${webPath} to exist`);
  const webContent = fs.readFileSync(webPath, 'utf8');

  const allChars = charFiles.flatMap((f) => rosterByRace[f] || []);
  for (const c of allChars) {
    assert.ok(webContent.includes(c.name), `expected web.md to name "${c.name}" at least once`);
  }

  const sections = parseSections(webContent);
  const threadSections = sections.filter((s) => s.level === 2 && !/^overview$/i.test(s.title));
  assert.ok(threadSections.length > 0, 'expected at least one thread section in web.md');

  for (const s of threadSections) {
    const { threads } = parseConnections(s.lines.join('\n'));
    assert.ok(threads.length > 0, `expected a Characters list in web.md section "${s.title}"`);
    const races = new Set(threads.map((t) => t.race));
    assert.ok(
      races.size >= 2,
      `expected thread "${s.title}" in web.md to involve characters from at least two different races, got [${[...races].join(', ')}]`
    );
  }
});
