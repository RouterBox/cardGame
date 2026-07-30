'use strict';

// Given an array of card records each with a `name` field, returns the
// list of names (in their first-seen casing) that occur more than once,
// comparing case-insensitively so casing-only variants also collide.
function findDuplicateNames(cards) {
  const firstSeen = new Map(); // lowercased name -> first-seen original name
  const duplicates = [];
  const flagged = new Set(); // lowercased names already added to duplicates

  for (const card of cards) {
    const key = card.name.toLowerCase();
    if (firstSeen.has(key)) {
      if (!flagged.has(key)) {
        duplicates.push(firstSeen.get(key));
        flagged.add(key);
      }
    } else {
      firstSeen.set(key, card.name);
    }
  }

  return duplicates;
}

module.exports = { findDuplicateNames };
