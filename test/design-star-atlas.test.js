'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseSections, sectionText } = require('./helpers/markdown');

const STAR_ATLAS_PATH = path.join(__dirname, '..', 'design', 'star-atlas.md');

const RACES = [
  { name: 'Cindral Reach', fount: /\bthe Mass\b/ },
  { name: 'Mireth Bloom', fount: /\bthe Bloom\b/ },
  { name: 'Panoptic Concord', fount: /\bthe Signal\b/ },
  { name: 'Starweave Communion', fount: /\bthe Tangle\b/ },
  { name: 'Wrought Assembly', fount: /\bthe Circuit\b/ },
];

const FORBIDDEN_NAMES = ['Solmere', 'Kethis'];

const content = fs.existsSync(STAR_ATLAS_PATH) ? fs.readFileSync(STAR_ATLAS_PATH, 'utf8') : '';
const sections = parseSections(content);

test('AC1: design/star-atlas.md exists', () => {
  assert.ok(fs.existsSync(STAR_ATLAS_PATH), `expected ${STAR_ATLAS_PATH} to exist`);
});

test('AC1: has a Homeworlds section with a level-3 subsection per race', () => {
  const homeworldsBody = sectionText(sections, /homeworlds/i);
  assert.ok(homeworldsBody, 'expected a "Homeworlds" section in star-atlas.md');

  const homeworldSections = sections.filter((s) => s.level === 3);
  for (const race of RACES) {
    const matches = homeworldSections.filter((s) => s.title.includes(race.name));
    assert.strictEqual(
      matches.length,
      1,
      `expected exactly one level-3 Homeworld heading naming "${race.name}", found ${matches.length}`
    );
  }
});

test('AC1: each race\'s Homeworld heading carries a distinct proper name', () => {
  const homeworldSections = sections.filter((s) => s.level === 3);
  const namesByRace = RACES.map((race) => {
    const heading = homeworldSections.find((s) => s.title.includes(race.name));
    assert.ok(heading, `expected a Homeworld heading for "${race.name}"`);
    // Heading is expected in the form "<Name> — Homeworld of the <Race>" (or similar);
    // the proper name is whatever text precedes the race name / "Homeworld" wording.
    const nameGuess = heading.title.split(/[—-]/)[0].trim();
    assert.ok(nameGuess.length > 0, `expected a proper name before the race name in heading "${heading.title}"`);
    return nameGuess;
  });

  const unique = new Set(namesByRace);
  assert.strictEqual(
    unique.size,
    namesByRace.length,
    `expected 5 distinct Homeworld names, got [${namesByRace.join(', ')}]`
  );
});

test('AC2: none of the named worlds is "Solmere" or "Kethis"', () => {
  for (const forbidden of FORBIDDEN_NAMES) {
    const re = new RegExp(`\\b${forbidden}\\b`, 'i');
    assert.ok(!re.test(content), `expected star-atlas.md to never mention the placeholder name "${forbidden}"`);
  }
});

test('AC2: no two named worlds in star-atlas.md share the same name', () => {
  // Collect every level-3 heading's leading proper name (Homeworlds + Frontier/Contested worlds).
  const level3 = sections.filter((s) => s.level === 3);
  assert.ok(level3.length >= 5, 'expected at least 5 level-3 world headings (5 Homeworlds + frontier worlds)');

  const names = level3.map((s) => s.title.split(/[—-]/)[0].trim().toLowerCase());
  const unique = new Set(names);
  assert.strictEqual(
    unique.size,
    names.length,
    `expected all world names to be distinct, got [${level3.map((s) => s.title).join(', ')}]`
  );
});

test('AC3: each Homeworld entry names its race\'s primary Fount', () => {
  const homeworldSections = sections.filter((s) => s.level === 3);
  for (const race of RACES) {
    const heading = homeworldSections.find((s) => s.title.includes(race.name));
    assert.ok(heading, `expected a Homeworld heading for "${race.name}"`);
    const body = heading.lines.join(' ');
    assert.ok(
      race.fount.test(body),
      `expected the ${race.name} Homeworld entry to name its Fount (${race.fount}), got body: ${body.slice(0, 200)}`
    );
  }
});

test('AC3: the Mireth Bloom Homeworld entry does not describe it fighting in the Cinderglass War', () => {
  const homeworldSections = sections.filter((s) => s.level === 3);
  const bloomHeading = homeworldSections.find((s) => s.title.includes('Mireth Bloom'));
  assert.ok(bloomHeading, 'expected a Homeworld heading for "Mireth Bloom"');
  const body = bloomHeading.lines.join(' ');
  assert.ok(
    /cinderglass war/i.test(body),
    'expected the Mireth Bloom Homeworld entry to reference the Cinderglass War'
  );
  assert.ok(
    /fought no battles|no battles/i.test(body),
    'expected the Mireth Bloom Homeworld entry to state it fought no battles in the Cinderglass War, consistent with lore.md'
  );
  assert.ok(
    !/\b(Bloom|Fenwreath|it)\s+(fought|waged|launched an? (attack|assault)|raised a fleet)\b/i.test(body),
    `expected the Mireth Bloom Homeworld entry to not describe it fighting battles, got body: ${body.slice(0, 300)}`
  );
});
