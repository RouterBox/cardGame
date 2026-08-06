# cardgame-rules-restriction-movement-contradiction-fix

**Outcome:** merged (orchestrator recovery, 2026-07-31). Merge before 797a3e7 on cardGame master; verified green ON MASTER (1245/1245).

**What shipped:** rules.md Sections 8.1/8.4 no longer hedge on whether Restrictions govern future Unit movement — the "is an open question this section does not resolve" contradiction is resolved. New unit test file.

**Notable:** Escalation was the frozen-snapshot class again: the older main-phase-discovery-note unit's AC3 froze Section 8's hedge verbatim, so resolving the hedge (this unit's entire purpose) could never pass. That assertion is now scoped to the surviving provisional-deployment note with a comment explaining why. Also added the ENOENT-swap retry to composite test's readPlaceholderBounds (renders/cards/ race, sibling of the cards-composited one).
