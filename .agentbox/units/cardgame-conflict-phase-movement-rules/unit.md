name: cardgame-conflict-phase-movement-rules
title: Rewrite rules.md Section 5.4 Conflict Phase to define Unit movement and location-aware attacking/blocking, replacing the placeholder combat text
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

design/rules.md Section 5.4 (Conflict Phase) was shipped with RouterBox's own review notes left as raw `//` comments instead of finished rules prose, and the combat text immediately below them is explicitly marked `//place-holder magic combat` — attackers and blockers are declared with no reference to Planet location at all, contradicting the corrected model Section 8.1 already establishes elsewhere (a Unit occupies a specific Planet; the graph is the battlefield). This unit rewrites Section 5.4 into clean numbered prose: it defines a Movement action (moving a Ready Unit across one adjacent Wormhole, costing Fount Points equal to that Wormhole's Length), states that a Unit which moved this turn cannot attack this turn by default, and restates attacker/blocker declaration so a blocker must occupy the same Planet as the Planet under attack. The vaguer, explicitly speculative aside in the same notes ("maybe two races need mainly time, two races need mainly resources") is not decided design and is left alone — this unit picks the single concrete, already-implied Length-based Fount Point cost consistent with Discovery/Assault rather than inventing untested per-race asymmetry. Only design/rules.md's Section 5.4 and its owning test file, test/design-rules.test.js, change; Section 12's damage-resolution mechanics, which already cross-reference Section 5.4's attacker/blocker declaration by number, need no rewrite since they never assumed a location-agnostic model. No card file and no code outside the test file is touched — this is pure design/rules-text work (T8), not game software.

## Acceptance Criteria

- AC1 [paraphrase]: design/rules.md Section 5.4 contains no lines beginning with a `//` inline comment.
- AC2 [paraphrase]: Section 5.4 states, in numbered rules prose, that the active player may take a Movement action during the Conflict Phase moving one of their Ready Units across a single Wormhole to an adjacent Planet.
- AC3 [paraphrase]: Section 5.4 states that a Unit that moved this turn cannot be declared as an attacker this turn, unless a card or ability specifically says otherwise.
- AC4 [paraphrase]: Section 5.4 states that a Unit may only be declared as a blocker against an attacker if that Unit occupies the same Planet as the Planet being attacked.
- AC5 [inferred]: Section 5.4 states a Fount Point cost for the Movement action equal to the traversed Wormhole's Length.
- AC6 [inferred] (held_out): Every pre-existing assertion in test/design-rules.test.js and test/design-combat.test.js continues to pass against the rewritten Section 5.4 text.
