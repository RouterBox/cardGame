'use strict';

const test = require('node:test');
const assert = require('node:assert');

// Registers the Section 9.1 canonical-card-template checks shared by
// design-cards.test.js, design-frontier-cards.test.js, and
// design-signature-cards.test.js: Cost line -> Type line -> Rules text
// ordering, and Stats/counters line only present, and only after Rules
// text, when the Type line contains "Permanent".
function registerCardTemplateChecks(title, body) {
  test(`AC2: "${title}" has Cost line, Type line, and Rules text in order`, () => {
    const costIdx = body.indexOf('Cost line:');
    const typeIdx = body.indexOf('Type line:');
    const rulesIdx = body.indexOf('Rules text:');
    assert.notStrictEqual(costIdx, -1, `expected a "Cost line:" field in "${title}"`);
    assert.notStrictEqual(typeIdx, -1, `expected a "Type line:" field in "${title}"`);
    assert.notStrictEqual(rulesIdx, -1, `expected a "Rules text:" field in "${title}"`);
    assert.ok(
      costIdx < typeIdx && typeIdx < rulesIdx,
      `expected Cost line -> Type line -> Rules text order in "${title}"`
    );
  });

  test(`AC2: "${title}" only carries a Stats/counters line after Rules text, and only if a Permanent`, () => {
    const rulesIdx = body.indexOf('Rules text:');
    const statsIdx = body.indexOf('Stats/counters line:');
    if (statsIdx === -1) return;
    assert.ok(rulesIdx !== -1 && statsIdx > rulesIdx, `expected Stats/counters line to follow Rules text in "${title}"`);
    const typeMatch = body.match(/Type line:\s*([^\n]+)/);
    assert.ok(typeMatch, `expected a Type line to check permanence in "${title}"`);
    assert.ok(
      /\bPermanent\b/.test(typeMatch[1]),
      `expected "${title}" to be a Permanent since it carries a Stats/counters line, got type line: ${typeMatch[1]}`
    );
  });
}

module.exports = { registerCardTemplateChecks };
