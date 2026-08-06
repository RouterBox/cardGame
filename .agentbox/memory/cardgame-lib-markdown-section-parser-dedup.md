# cardgame-lib-markdown-section-parser-dedup

**Outcome:** merged (orchestrator recovery, 2026-07-30). Merge commit before 624a10b on cardGame master.

**What shipped:** lib/markdown-sections.js — shared H2/H3-section-splitting and paragraph-extraction helpers extracted from the 4 newer lib/parse-*-markdown.js files (character/race/star-atlas/founts), which now import it. New test/markdown-sections.test.js.

**Notable:** Same T27 recovery as playtest-character-signatures-wave-2-refresh: unit was green, master was red from stranded orchestrator commits. Merged green master into branch; suite 1054/1054.
