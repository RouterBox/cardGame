name: cardgame-alpha-set-art-briefs
title: cardGame design — Leonardo art briefs for the Alpha set (words before art, T9)
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

T9 states 'Compelling world/art/card design precedes any code ... Art briefs precede art; Leonardo passes come after the words are approved.' The shipped cardgame-card-authoring-engine renders every Alpha set card's Art Window as an empty placeholder rectangle, explicitly deferring 'a later Leonardo compositing pass.' This unit is the design deliverable that must exist before that compositing pass can start: a written art brief for every card in design/cards/alpha-set.md (18 cards), each brief giving a human or a Leonardo prompt-writer enough to generate a single Art Window illustration — subject/scene, the card's Fount-driven mood and palette, key visual elements pulled from the card's own rules text/type line, and a composition note matching the Art Window's shape from design/cards/card-anatomy.md. This is a DESIGN unit (T8): the deliverable is markdown a human reads and approves before any image generation happens; it makes zero Leonardo API calls and contains no code. It directly unblocks the next authoring-engine unit (art compositing) without skipping ahead of the words-first discipline (T9).

## Acceptance Criteria

- AC1 [user]: design/cards/art-briefs.md exists and contains exactly one brief section for each of the 18 cards in design/cards/alpha-set.md, matched by name/heading.
- AC2 [paraphrase]: Each brief names the card's Fount-driven color/mood palette (matching the Fount identity table in design/cards/card-anatomy.md) and lists at least 2 concrete visual elements drawn from the card's own rules text or type line, not generic filler.
- AC3 [inferred]: Each brief includes a one-line composition note referencing the Art Window's aspect ratio/shape as defined in design/cards/card-anatomy.md, so a future compositing pass can generate art that actually fits the slot.
- AC4 [inferred] (held_out): design/cards/art-briefs.md contains no code, API calls, or references to a specific image-generation implementation — pure creative-brief prose, keeping this a words-first design deliverable per T9.
