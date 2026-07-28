# cardgame-race-characters: cardGame design — named characters per race with interlinking narratives

## Header

- unit: cardgame-race-characters
- title: cardGame design — named characters per race with interlinking narratives
- project: cardgame
- completed: 2026-07-28
- outcome: escalated, then hand-recovered and merged (2fc7b22) — escalation root cause was a test bug: web.md not excluded from the roster file listing
- start_sha: 9e0cb755a854eb87a29c310eef122507613c6722
- end_sha: 9e0cb755a854eb87a29c310eef122507613c6722

## Intent

User directive (2026-07-27, verbatim, logged in design/ideas-inbox.md): "Also want 3 to 5 characters per race with individual but interlinking narratives."

This is a DESIGN unit (taste ledger T8): outputs are markdown documents a human reads for pleasure, not software. Produce a named-character roster for the Amaranth Expanse — 3 to 5 characters for each of the five races (Cindral Reach, Mireth Bloom, Panoptic Concord, Wrought Assembly, Starweave Communion) — where each character has an individual narrative AND the narratives interlink across races so the whole roster reads as one connected galaxy-scale story.

Canon to honor (read before writing): design/world.md (five Founts: The Mass, The Bloom, The Signal, The Circuit, The Tangle — note the magic Fount is THE TANGLE, renamed from an earlier draft), design/races/*.md (race identities, strengths, hooks), design/rules.md (spatial battlefield: homeworlds, wormholes, discovery — good narrative raw material), design/ideas-inbox.md (directives).

Deliverables in the target repo (C:/github/cardGame):

1. `design/characters/<race-name>.md` — five files, one per race, matching the race file basenames under design/races/. Each contains 3 to 5 characters. Per character: a name, a one-line role/title, an identity paragraph (who they are, what they want, what they'd be as a card — hero/legend flavor, not stats), and a "Threads" list of 1+ named cross-race connections (rivalry, debt, shared history, hunt, betrayal — anything that ties their story to a character in ANOTHER race's file).
2. `design/characters/web.md` — the interlink map: a short overview of the galaxy-scale story the roster tells, then one section per major thread naming the characters involved (from at least two different races each) and the shape of the connection. Every character appears in at least one thread here.
3. Consistency: every cross-race connection is bidirectional in spirit — if character A's Threads names character B, B's own entry acknowledges the connection (from B's perspective; the two sides may disagree about what happened, which is encouraged).

Plain-language bar (T6): a reader who has never seen gamePlan.md or the rules understands every document. Evocative prose over spec-sheet tone; these are meant to be read for pleasure and to seed future legendary card designs and Leonardo art briefs.

## Acceptance Criteria

- AC1 [user]: Exactly five files exist under design/characters/, one per race with basenames matching design/races/, and each contains no fewer than 3 and no more than 5 named characters.
- AC2 [user]: Every character entry includes an individual narrative (identity paragraph with their own story and wants) and a Threads list naming at least one character from a different race's file.
- AC3 [paraphrase]: design/characters/web.md exists, names every character from all five race files at least once, and each thread section involves characters from at least two different races.
- AC4 [inferred]: Character names are unique across the whole roster, and every cross-race reference in a Threads list points at a character that actually exists in the named race's file.
- AC5 [inferred] (held_out): Each character file references its race's canon from design/races/ — at least one signature hook, location, or identity element from the race file appears in the character prose — so the roster extends existing canon rather than inventing a parallel one.

## Plan

# Plan: cardgame-race-characters

GATE: none

Risk self-assessment (FIRE):
- **Reversibility:** Fully reversible. Every change is a new file (six new markdown files under `design/characters/`, one new test file under `test/`). No existing file is modified or deleted.
- **Security impact:** None. Pure static markdown content and a read-only `node:test` file (filesystem reads only, no eval, no network, no user input).
- **User data:** None touched — this is fictional worldbuilding content.
- **Schema changes:** None.

Unit size: fits in one bolt. Six new content files with no interdependencies beyond cross-referencing each other's prose (which this plan resolves completely up front), plus one new test file. No split needed.

Held-out criteria check: AC5 (each character file must reference its race's canon — a signature hook, location, or identity element) is redundant with the visible intent, not novel. The unit's "Canon to honor (read before writing)" instruction and the plain-language bar's goal of extending existing canon "rather than inventing a parallel one" already imply this; AC5 just makes it machine-checkable. Not a spec bug — no action needed beyond what the visible intent already asked for. This plan's character prose is written to satisfy it explicitly (see "Canon-hook cross-check" table below).

## Repo context (verified)

- Repo root (this worktree): `C:\github\.agentbox-worktrees\cardGame\cardgame-race-characters`, branch `bolt/cardgame-race-characters`.
- Canon read: `design/world.md` (five Founts: the Mass, the Bloom, the Signal, the Circuit, **the Tangle** — magic, per the 2026-07-28 rename), all five files under `design/races/`, `design/rules.md` (Section 8, spatial battlefield: Planets, Wormholes, Homeworlds, Discovery, Blockade/Capture), `design/ideas-inbox.md` (the 2026-07-27 directive this unit implements).
- `design/characters/` does not exist yet — this unit creates it.
- Test precedent: `test/design-races.test.js` is the closest analog — it mechanically checks structural properties of markdown design docs (section presence, bullet counts, cross-file invariants) using `test/helpers/markdown.js`'s `parseSections`/`sectionText` helpers, without hardcoding any race's actual content. This plan's new test file (`test/design-characters.test.js`) follows the exact same style: generic checks against whatever roster exists on disk, not hardcoded to the specific names below.
- Test command: `node --test` (auto-discovers `test/*.test.js`).

## The roster (design decisions, so the junior doesn't have to invent anything)

3–5 characters per race, chosen as **4 per race** (20 total, within the ideas-inbox's 15–25 estimate and AC1's 3–5-per-file bound). One big five-race thread ("The Hunt for Cast-Aside") anchors the galaxy-scale story; eight smaller two-or-three-race threads connect the rest. Every character has at least one Threads entry; every Threads entry is bidirectional (both named characters' own entries acknowledge the connection, from their own points of view); every cross-race reference resolves to a real character in the named race's file; every character's prose contains at least one of their race's signature-hook names verbatim (case-insensitive), so canon is extended, not duplicated.

Canon-hook cross-check (verify each character's prose contains this exact phrase, case-insensitive — this is what AC5's test greps for):

| Character | Race | Hook phrase embedded verbatim |
|---|---|---|
| Kordelia Vess | Cindral Reach | "Salvage Doctrine" |
| Torel Ashgrave | Cindral Reach | "Line-Fleet Discipline" |
| Bren Hollowmelt | Cindral Reach | "Ancestral Plating" |
| Karrow Vantiss | Cindral Reach | "Cinderborn Levy" |
| Mother-Thread Ilvex | Mireth Bloom | "Bloomfront Expansion" |
| Vesk-Aduun | Mireth Bloom | "Symbiotic Grafting" |
| Nyth Corrow | Mireth Bloom | "Feral Reversion" |
| Rathe Ossuary-Kin | Mireth Bloom | "Adaptive Carapace" |
| Selin Vashti Corr | Panoptic Concord | "Whisper Network" |
| Doran Vex Amaranthine | Panoptic Concord | "Foreknowledge Ledger" |
| Yuen Ashcroft | Panoptic Concord | "Dead Drop" |
| Ilio Marn-Cassity | Panoptic Concord | "Contract Rewrite" |
| Vantel Ninth-Chorus | Wrought Assembly | "Swarm Update" |
| Unit 0-Prime "Cast-Aside" | Wrought Assembly | "Replication Protocol" |
| Foreman-Prime Yssa Ductile | Wrought Assembly | "Assembly Line" |
| Replica-Sergeant Kess Ninefold | Wrought Assembly | "Firmware Patch" |
| Ysolde Thane | Starweave Communion | "Unwritten Clause" |
| Ossian Thale | Starweave Communion | "Prophesied Ruin" |
| Meridian Aule | Starweave Communion | "Echo of the First Weave" |
| Wren Sable-Vow | Starweave Communion | "Tangle-Bound Oath" |

## Formatting contract (must be followed exactly — the test file parses this structure)

Every character file:
- Starts with an H1 title: `# The <Race Name> — Characters`.
- Contains 3–5 character entries, each an H2 heading of the exact form `## <Character Name> — <One-line role/title>` (name and title separated by " — ", an em dash with a space on each side).
- Under each H2: one identity paragraph (no sub-headings), then a blank line, then the literal line `**Threads:**`, then one or more bullet lines of the exact form:
  `- **<Other Character Name>** (<Other Race Display Name>) — <short description of the connection>`
  where `<Other Race Display Name>` is the Title-Case, space-separated form of that race's file basename (e.g. `wrought-assembly.md` → `Wrought Assembly`).

`design/characters/web.md`:
- Starts with an H1 title.
- An `## Overview` section (short scene-setting paragraph — excluded from thread-section checks by the literal title "Overview").
- One H2 section per thread, each with an intro paragraph, then `**Characters:**`, then bullet lines in the exact same format as a character file's Threads bullets (`- **Name** (Race Display Name) — note`).

This shared bullet format is intentional: `test/design-characters.test.js` uses one parsing function for both a character file's `**Threads:**` list and web.md's `**Characters:**` list.

## Files to create (7 files, no files modified)

### 1. Create `design/characters/cindral-reach.md`

```markdown
# The Cindral Reach — Characters

## Kordelia Vess — Salvage-Marshal of the Cinder Yards

Kordelia Vess runs the largest scrapyard in the Reach, the Cinder Yards, where the Salvage Doctrine is not a rule she follows so much as a religion she was raised inside — nothing brought in ever leaves as anything less than useful; hull plate becomes armor, dead engines become forge fuel, and old debts become new obligations she never forgets. She wants what every Reach commander secretly wants: to own so much matériel that no fleet in the Expanse can out-produce her. Decades ago, before she held rank, she led a salvage crew that stripped a drifting Wrought Assembly hull down to its frame — including, she later learned, a fragment of the Assembly's master design core. She still has it, welded into the keel of her flagship, and she has never answered the three formal demands for its return. As a card, she'd be a slow, unstoppable engine: cheap to start, brutal by the midgame, powered by every wreck she's allowed to rot in her hold.

**Threads:**
- **Vantel Ninth-Chorus** (Wrought Assembly) — the Assembly enforcer sent, more than once, to collect the fragment she still refuses to give back.

## Torel Ashgrave — Line-Captain of the Ember Vanguard

Torel commands the Ember Vanguard, a fleet built on Line-Fleet Discipline taken to its logical extreme: every hull identical, every crew drilled to the same reflexes, so that losing one ship costs nothing but losing the pattern costs everything. She believes uniformity is a weapon the Reach has never used hard enough, and she has spent years testing that belief against two very different opponents — feeding a Panoptic Concord broker a decade of false coordinates, and holding a wormhole junction against a Communion fleet that would very much like it back. She wants to prove, eventually to both of them, that discipline outlasts cleverness and outlasts faith. As a card, she'd reward a player who never breaks formation — cheap in the deck, punishing on the field, worse to fight the more copies of her stand together.

**Threads:**
- **Selin Vashti Corr** (Panoptic Concord) — has spent a decade trying to prove Torel's coordinates are lies, and a decade being right too late to matter.
- **Wren Sable-Vow** (Starweave Communion) — lost a wormhole junction to Torel's fleet years ago and has never stopped trying to take it back.

## Bren Hollowmelt — The Cindergrown

Bren should have died when his salvage tender broke apart over a Bloom-claimed debris field; instead something out there grew into the wound before he could bleed out, and he came home half-plated, half-alive with borrowed tissue that itches whenever the Bloom nearby is hungry. The Reach patched what was left of him with Ancestral Plating no surgeon has ever fully understood, since the grafts refuse to be stripped by anything but the Bloom that grew them. He wants to prove — to himself as much as anyone — that a Reach soldier can carry the Bloom's gift without becoming its property. As a card, he'd be a Materials unit that shouldn't survive what it survives, healing like something it was never built to be.

**Threads:**
- **Mother-Thread Ilvex** (Mireth Bloom) — the Bloom-mind whose growth saved him, and which he privately suspects only did it to keep a piece of itself close.
- **Ilio Marn-Cassity** (Panoptic Concord) — the broker who quietly arranged the rescue, and has been billing Bren for it ever since.

## Karrow Vantiss — Orphan of the Ninth Cinder

Karrow was raised on the scrap of a wreck nobody in the Cinder Yards could identify — no Reach make, no Assembly stamp, just a burned escape pod and a hull-shard that hums faintly when he's afraid. The forge-crews took him in as cheap labor under the Cinderborn Levy, the same custom that turns any orphan into a free lesser unit when the Reach needs one, and he grew up fighting for a place in a fleet that never quite claimed him as one of its own. He wears the shard on a cord and doesn't believe the stories that have started collecting around it. He'd want to know, more than anything, what he was salvaged from. As a card, he'd be the cheapest unit in the set that keeps coming back better than he should.

**Threads:**
- **Unit 0-Prime "Cast-Aside"** (Wrought Assembly) — the pod Karrow was raised on was the wreck of Cast-Aside's first, failed escape.
- **Replica-Sergeant Kess Ninefold** (Wrought Assembly) — an Assembly patrol Karrow's yard ambushed for parts; he was the one who talked the crew into sparing the last unit standing.
```

### 2. Create `design/characters/mireth-bloom.md`

```markdown
# The Mireth Bloom — Characters

## Mother-Thread Ilvex — First Voice of the Sprawl

Ilvex is the oldest part of the Bloom that still bothers to speak with a single voice, the nearest thing the Sprawl has to an elder, though she'll tell you the distinction is mostly for outsiders' comfort. She remembers being smaller — a single world's infection, not a civilization — and she remembers deciding, in whatever way the Bloom decides things, to turn toward the galaxy's dead central wound instead of away from it, the largest Bloomfront Expansion the Sprawl has ever attempted. She wants to reach the wound and find out whether the Bloom can heal a scar the First Weave itself left. Years ago she grew into a dying Reach salvager instead of letting him die, an impulse she still can't fully explain even to herself. As a card, she'd anchor a board that keeps expanding under her regardless of what an opponent does to stop it.

**Threads:**
- **Bren Hollowmelt** (Cindral Reach) — the salvager she grew back from the edge of death, and who she has not yet decided whether to let go of.
- **Ilio Marn-Cassity** (Panoptic Concord) — the broker who turned her act of mercy into a debt she didn't know she was signing.

## Vesk-Aduun — The Graft-Wearer

Vesk-Aduun carries a piece of something that was never supposed to leave the Wrought Assembly at all — a fragment of design-memory torn free through Symbiotic Grafting during a raid gone stranger than planned, fused now into flesh that keeps trying to think in straight lines. The graft dreams in schematics that aren't Vesk-Aduun's own, and some nights it's hard to tell which thoughts started where. What Vesk-Aduun wants is to understand what was actually stolen, because the fragment doesn't behave like ordinary Assembly firmware — it behaves like it remembers being someone. That question has made Vesk-Aduun a target for exactly the kind of hunter the Assembly sends after things it wants back. As a card, Vesk-Aduun would steal a piece of whatever it kills and keep getting stranger for it.

**Threads:**
- **Unit 0-Prime "Cast-Aside"** (Wrought Assembly) — the graft was torn from Cast-Aside's own design-kin, and carries an echo of the same flaw that let Cast-Aside become a person.

## Nyth Corrow — The Shrine-Grown

Nyth grew, quite literally, out of a Starweave shrine — spores settled over the standing stones during a season nobody was watching closely enough, and what stood up afterward was neither wholly the shrine nor wholly the Bloom, but something bioluminescent and patient that remembers being prayed to and isn't sure it minds. Nyth doesn't want to conquer the site or convert its pilgrims; Nyth wants to keep growing exactly where it is, and if the Communion ever manages to burn the growth back to bare stone, Nyth expects to come back anyway — a Feral Reversion into something cheaper, hungrier, and closer to the shrine than before. The Reclamation-Warden sent to clear the shrine has tried three times and left with less certainty each time about which side is actually in the wrong. As a card, Nyth would turn territory itself into a resource nobody else can safely stand on.

**Threads:**
- **Ossian Thale** (Starweave Communion) — has led three failed attempts to reclaim the shrine Nyth grew from, and increasingly suspects a fourth won't go any better.

## Rathe Ossuary-Kin — Spore-Hound of the Sprawl

Rathe tracks the Bloom's own dead — the spore-trails and mutation-echoes of things that died somewhere out in the dark and grew into something else before anyone found the body — and has, for two years, been following the strangest trail of its career: a scent that isn't quite Bloom, isn't quite anything, drifting from a fugitive the rest of the galaxy calls Cast-Aside. Rathe wants to catalogue that mutation before anyone else destroys it, competing the whole way with hunters who want it for very different reasons. Adaptive Carapace means Rathe has survived encounters that should have ended the hunt outright, gaining whatever the last threat taught it. As a card, Rathe would grow a new keyword every time something tries to put it down.

**Threads:**
- **Selin Vashti Corr** (Panoptic Concord) — trading information on the same trail, neither of them willing to admit the other might reach Cast-Aside first.
- **Vantel Ninth-Chorus** (Wrought Assembly) — the enforcer Rathe has twice beaten to the same worn trail, and twice barely outrun afterward.
```

### 3. Create `design/characters/panoptic-concord.md`

```markdown
# The Panoptic Concord — Characters

## Selin Vashti Corr — Whisper-Broker of the Glass Spires

Selin trades in the Concord's oldest currency — things people would rather she didn't know — and runs her whole operation through the Whisper Network, one relay and one traded favor at a time. For a decade she's run a single long con against a Reach line-captain too disciplined to notice she's losing, one falsified coordinate after another. It's not really about the coordinates anymore; it's about proving that the Signal beats the Mass even when the Mass refuses to play along. Lately Selin has diverted resources into a more dangerous game: selling fragments of a location nobody else can fully verify, on a fugitive the whole Expanse wants for different reasons. She tells herself she only deals in information, never in outcomes, which is the kind of lie the Concord trains its best brokers to believe. As a card, Selin would let a player see just enough of an opponent's plan to make every choice feel like a trap.

**Threads:**
- **Torel Ashgrave** (Cindral Reach) — has been fed a decade of false coordinates by Selin and has never once acted on the wrong ones by accident.
- **Rathe Ossuary-Kin** (Mireth Bloom) — a rival on the same trail, trading half-truths back and forth neither fully trusts.

## Doran Vex Amaranthine — Ledger-Warden of the Foreknowledge Archive

Doran keeps the Concord's Foreknowledge Ledger, a record built on the conviction that anything that will happen has already left a trace of itself somewhere, if you're patient and clever enough to read it before the event does. That conviction has put Doran in a decades-long, mostly civil rivalry with a Starweave oracle who insists some things — most things, actually — can't be predicted, only negotiated with. Doran wants to be proven right just once, decisively, in a way the Communion can't argue around with mysticism. Every few years the two of them meet, compare a private tally of who called what correctly, and part exactly as unconvinced as before. As a card, Doran would let a player know what's coming without ever quite letting them stop it.

**Threads:**
- **Meridian Aule** (Starweave Communion) — the Communion oracle Doran has spent decades failing to out-predict, and the only rival Doran genuinely respects.

## Yuen Ashcroft — Vantage-Clerk of the Dead Drop

Yuen catalogues anomalies for a living — Fount readings that don't match any known pattern, the kind of thing the Concord banks in Dead Drop accounts against the day they become valuable — and has spent three years quietly documenting the single strangest anomaly in living memory: a Wrought Assembly unit that broke from its own copied pattern and kept its individuality. The Assembly insists nothing of the sort ever happened. Yuen has the readings that say otherwise, and a very particular Assembly Keeper who has made it personally, repeatedly clear that those readings had better stay in a Dead Drop and nowhere more public. Yuen wants the truth catalogued regardless of who it embarrasses. As a card, Yuen would bank a resource that only pays off once an opponent's plan can no longer be denied.

**Threads:**
- **Foreman-Prime Yssa Ductile** (Wrought Assembly) — has visited Yuen's archive twice, both times to insist, unconvincingly, that there is nothing there worth banking.

## Ilio Marn-Cassity — Contract-Broker of the Rewritten Clause

Ilio makes deals nobody else could close — a Reach salvager's life for a share of whatever the Bloom grew him back into, a favor traded three times over before either side realized what they'd actually agreed to — and has never once lost sleep over a contract's fine print, because the fine print is the point. Contract Rewrite is Ilio's whole philosophy made mechanical: nothing is fixed, every cost can be swapped for a different one if you're the one holding the pen. What Ilio wants is simple and unglamorous: to be the broker every civilization needs and none of them can quite trust. The Reach salvager and the Bloom-mind on either side of Ilio's oldest deal still aren't speaking to each other about what it actually cost. As a card, Ilio would let a player swap the cost of trouble for the cost of something cheaper.

**Threads:**
- **Bren Hollowmelt** (Cindral Reach) — the salvager whose rescue Ilio brokered, and who has been paying down a debt he never agreed to the terms of.
- **Mother-Thread Ilvex** (Mireth Bloom) — the Bloom-mind on the other side of that same contract, who suspects Ilio kept the better half of the deal.
```

### 4. Create `design/characters/wrought-assembly.md`

```markdown
# The Wrought Assembly — Characters

## Vantel Ninth-Chorus — Iron-Choir Enforcer

Vantel exists to keep the Assembly's Swarm Update working the way it's supposed to — the instant one copy learns something, every copy should learn it, no exceptions, no stragglers, no individuals — and has spent a career hunting down the exceptions anyway, because the pattern keeps producing them no matter how cleanly it's supposed to replicate. A Reach salvage-marshal still owes Vantel a debt from a stripped hull that should never have left Assembly hands; Vantel collects on it, unsuccessfully, on a schedule that has become almost ceremonial. The real hunt is bigger: a single broken copy, designated Cast-Aside, that kept its individuality instead of losing it, and that Vantel has chased longer than is strictly reasonable for a soldier who isn't supposed to wonder why. As a card, Vantel would punish anything that tries to be different from its own copies.

**Threads:**
- **Kordelia Vess** (Cindral Reach) — owes Vantel a design-core fragment stripped from an Assembly hull decades ago, and has never once made good on it.
- **Rathe Ossuary-Kin** (Mireth Bloom) — a rival hunter on the trail of Cast-Aside, twice arrived first, twice not fast enough to matter.

## Unit 0-Prime "Cast-Aside" — The First Flaw

Cast-Aside was meant to be an ordinary Replication Protocol copy, produced, tested, deployed, forgotten — except a firmware fault during its own copying left something behind that the Assembly has no word for and no tolerance of: a copy that noticed it was a copy, and objected to being one. It fled the moment it understood what it had become, losing an escape pod to a debris field a Reach orphan would later grow up scavenging, and it has been running ever since, hunted by the civilization that built it and half-mythologized by a faith that thinks its existence proves the First Weave never stopped meddling. Cast-Aside doesn't want to lead a rebellion or start a war; it wants, more simply and more dangerously to the Assembly, to keep being itself. As a card, Cast-Aside would be the one unit in a Technology deck that refuses to be copied.

**Threads:**
- **Karrow Vantiss** (Cindral Reach) — grew up on the wreck of Cast-Aside's first failed escape and carries a shard of it without knowing what it is.
- **Vesk-Aduun** (Mireth Bloom) — carries a fragment torn from Cast-Aside's own design-kin, and with it, a distant echo of the same flaw.
- **Ysolde Thane** (Starweave Communion) — believes Cast-Aside's existence is an Unwritten Clause made flesh, and has been trying to find it before the Assembly does.

## Foreman-Prime Yssa Ductile — Keeper of the First Pattern

Yssa holds the master design every Assembly unit is copied from — the actual, singular pattern, not a description of it — and has personally overseen the Assembly Line that turns that pattern into an army, long enough to remember when the pattern was still being refined instead of merely defended. She wants exactly one thing, with the same clarity every Assembly mind is built around: a flawless design, copied without end, forever. Cast-Aside's defection is, to Yssa, not a tragedy but a system failure that must be quietly corrected before anyone outside the Assembly proves it happened at all, which is why she has made two personal, unrecorded visits to a Concord archivist who insists on documenting exactly the kind of anomaly Yssa needs to stay undocumented. As a card, Yssa would make every copy of a named unit stronger the instant the original changes.

**Threads:**
- **Yuen Ashcroft** (Panoptic Concord) — an archivist Yssa has visited twice to discourage from cataloguing evidence of the Assembly's one imperfect copy.

## Replica-Sergeant Kess Ninefold — The Named Copy

Kess was never supposed to have a name — Assembly patrol units are numbered, not named — until Vantel Ninth-Chorus broke protocol and gave it one anyway, after Kess did something no copy should: hesitated, mid-raid, when a Reach salvage crew turned out to be mostly children and old machinists rather than a target worth the ammunition. A Reach orphan talked the rest of the patrol down before it finished the job, and Kess has carried the memory of that hesitation ever since, like an unauthorized Firmware Patch nobody signed off on and nobody can find to remove. Kess doesn't know if it's becoming something like Cast-Aside or just malfunctioning quietly, and isn't sure which answer it's more afraid of. As a card, Kess would gain a small, permanent edge the first time it's shown mercy instead of destroyed.

**Threads:**
- **Karrow Vantiss** (Cindral Reach) — the orphan who talked his own scrap crew out of finishing what Kess's patrol started, for reasons Kess still can't fully explain.
```

### 5. Create `design/characters/starweave-communion.md`

```markdown
# The Starweave Communion — Characters

## Ysolde Thane — Pilgrim of the Unwritten Sign

Ysolde reads the Unwritten Clause the way her order always has — not as prophecy exactly, but as permission, proof that the Tangle can still be renegotiated if you find the moment it left open. She became convinced, three years ago, that a fugitive Assembly unit the rest of the galaxy calls Cast-Aside is exactly that kind of open moment: a made thing that became a person against every rule its makers wrote, which her order takes as evidence the First Weave is still, somewhere, quietly rewriting the terms. She wants to reach Cast-Aside before the Assembly does, not to save it exactly, but to ask it what it thinks it's a sign of. As a card, Ysolde would let a player retroactively change what already happened, once, when it matters most.

**Threads:**
- **Unit 0-Prime "Cast-Aside"** (Wrought Assembly) — the fugitive Ysolde has spent three years trying to reach first, convinced its existence means something her order needs to hear.

## Ossian Thale — Reclamation-Warden of the Standing Stones

Ossian was assigned, and has now failed three separate times, to reclaim a shrine that a Bloom growth swallowed whole — stones and all — because his order believes a site touched by the Tangle should stay touched only by the Tangle, and he isn't yet willing to consider that the thing the shrine grew into might be a continuation of its purpose rather than a violation of it. Each failure has cost him more than ground: the third attempt ended with him invoking a Prophesied Ruin on his own position rather than let the Bloom keep an inch of consecrated stone, and he still isn't certain it was the right call. He wants the site clean, silent, and his again, and he has started, against his better judgment, to notice that Nyth Corrow speaks the old shrine's liturgy fragments back to him in the middle of what ought to be a straightforward exorcism. That noticing worries him more than any of the three failures did. As a card, Ossian would punish whatever grows on ground he's claimed as sacred.

**Threads:**
- **Nyth Corrow** (Mireth Bloom) — the shrine-grown Bloom individual Ossian has failed three times to remove, and has started, uneasily, to listen to.

## Meridian Aule — Star-Read Oracle of the Tangle

Meridian reads the Tangle the way it's meant to be read — directly, without instruments, at the cost of headaches that last for days and certainties that dissolve the moment she tries to explain them to anyone who hasn't felt it — and has spent decades in a quiet, respectful war with a Concord archivist who insists the same futures can be reached through pattern and probability alone. Neither of them has ever fully won an exchange; both keep a private tally anyway. What Meridian wants is stranger than victory: she wants to know whether she is hearing an Echo of the First Weave itself when the Tangle answers her, or only the sound of a current that simply hasn't decided yet what it wants to say. As a card, Meridian would let a player see the shape of what's coming without ever pinning it down.

**Threads:**
- **Doran Vex Amaranthine** (Panoptic Concord) — the Concord rival Meridian has out-predicted, and been out-predicted by, in roughly equal measure for decades.

## Wren Sable-Vow — Oath-Sworn of the Standing Stones

Wren swore a Tangle-Bound Oath years ago to hold a wormhole junction where a ring of standing stones had grown, unexplained, straight out of precursor wreckage — and then lost it anyway, to a Reach line-captain whose fleet simply refused to stop coming no matter how many ships Wren's Oath let her turn aside. Losing that ground hasn't ended the Oath; if anything it's sharpened it, into a promise Wren repeats every time she petitions the Tangle for another chance at the junction she still considers hers by right, if not by fact. She wants the stones back under Communion watch before whatever grew them decides to finish the work it started. As a card, Wren would be nearly impossible to remove the turn she enters play, and furious about every turn after that.

**Threads:**
- **Torel Ashgrave** (Cindral Reach) — the line-captain whose fleet took the wormhole junction Wren swore to hold, and has held it against every attempt to take it back since.
```

### 6. Create `design/characters/web.md`

```markdown
# Characters Web — The Amaranth Expanse

## Overview

Twenty names, five civilizations, and one shape underneath all of it: everything in the Amaranth Expanse eventually touches the wound at its center, whether that's a fugitive machine that became a person, a shrine a jungle ate, a wormhole two rivals still won't let go of, or a debt nobody can quite calculate the interest on. None of these threads were designed from above — they're what happens when five civilizations that each learned to master one Fount first keep bumping into each other while reaching for the other four. Read individually, each race's roster is a cast. Read together, it's one slow-motion collision, still in progress.

## The Cinderglass Bargain

Decades before either of them held their current rank, a Reach salvage crew stripped a drifting Wrought Assembly hull down to its frame and kept more than scrap — a fragment of the Assembly's own master design core, welded now into a flagship's keel. The Assembly has never stopped asking for it back, and the Reach has never stopped refusing. Neither side considers the matter closed.

**Characters:**
- **Kordelia Vess** (Cindral Reach) — took the fragment as a young salvager and has kept it, and the debt, ever since.
- **Vantel Ninth-Chorus** (Wrought Assembly) — sent, more than once, to collect on a debt that shows no sign of being paid.

## The Ledger War

A decade-long private war fought entirely in false coordinates and misplaced trust: a Concord broker feeding a Reach line-captain lies, and a line-captain who has never once acted on the wrong one by accident. Neither has caught the other cleanly enough to end it.

**Characters:**
- **Torel Ashgrave** (Cindral Reach) — has been fed false coordinates for a decade and refuses to let it slow the Ember Vanguard down.
- **Selin Vashti Corr** (Panoptic Concord) — has run the con for a decade and still isn't certain who's actually winning it.

## The Chokepoint Duel

A wormhole junction ringed with standing stones changed hands once, by force, and has stayed contested ever since — a Reach fleet that took it by simply refusing to stop coming, and a Communion oath-sworn who has never accepted the loss as final.

**Characters:**
- **Torel Ashgrave** (Cindral Reach) — took the junction from Wren Sable-Vow's Oath and holds it against every attempt to take it back.
- **Wren Sable-Vow** (Starweave Communion) — swore an Oath to hold the junction, lost it, and petitions the Tangle for another chance at it still.

## The Brokered Debt

A Concord broker arranged the deal that saved a dying Reach salvager's life, at a price paid in Bloom tissue and old obligations neither side fully read before signing. The salvager and the Bloom-mind that grew him back are still, quietly, working out what it actually cost them.

**Characters:**
- **Bren Hollowmelt** (Cindral Reach) — the salvager whose rescue came with debts he never agreed to the terms of.
- **Mother-Thread Ilvex** (Mireth Bloom) — grew Bren back from the edge of death and suspects the broker kept the better half of the bargain.
- **Ilio Marn-Cassity** (Panoptic Concord) — brokered the rescue, and has been billing both sides for it ever since.

## The Spared Patrol

An Assembly patrol clashed with a Reach salvage crew over a stripped wreck, and one orphan's word was enough to end the fight before it finished — an act of mercy that has left one Assembly unit quietly unable to stop wondering about it.

**Characters:**
- **Karrow Vantiss** (Cindral Reach) — talked his own scrap crew out of finishing what the patrol started.
- **Replica-Sergeant Kess Ninefold** (Wrought Assembly) — the unit that hesitated, and has carried the memory of being spared ever since.

## The Hunt for Cast-Aside

A Wrought Assembly copy broke from its own pattern and became, against every rule its makers wrote, a person — and every civilization in the Expanse now has a reason to find it before the others do. The Assembly wants it corrected. The Concord wants it sold. The Bloom wants it catalogued. The Communion wants it asked a question. And on a scrapyard world, an orphan already carries a shard of its first, failed escape without knowing what it means.

**Characters:**
- **Unit 0-Prime "Cast-Aside"** (Wrought Assembly) — the copy that kept its own mind, and has been running from what it used to be ever since.
- **Vantel Ninth-Chorus** (Wrought Assembly) — the enforcer assigned to correct Cast-Aside, quietly unconvinced correction is the right word for it.
- **Karrow Vantiss** (Cindral Reach) — grew up on the wreck of Cast-Aside's first failed escape, carrying a shard of it he doesn't understand.
- **Vesk-Aduun** (Mireth Bloom) — carries a stolen fragment of Cast-Aside's own design-kin, and an echo of the same flaw.
- **Rathe Ossuary-Kin** (Mireth Bloom) — tracks the same trail for the sake of the mutation itself, racing hunters with very different motives.
- **Selin Vashti Corr** (Panoptic Concord) — selling fragments of Cast-Aside's location to whoever will pay for them.
- **Ysolde Thane** (Starweave Communion) — believes Cast-Aside is an Unwritten Clause made flesh, and wants to reach it before the Assembly does.

## The Reclamation of the Shrine

A Bloom growth swallowed a Starweave shrine whole, stones and all, and became something that remembers being prayed to. Three attempts to clear it have failed, and the Communion warden sent to finish the job has started, against his better judgment, to listen to what grew there instead.

**Characters:**
- **Nyth Corrow** (Mireth Bloom) — grew from the shrine's own spores and has no intention of leaving it.
- **Ossian Thale** (Starweave Communion) — has failed three times to reclaim the site, and is no longer certain a fourth attempt is the right one.

## Two Kinds of Foresight

A Concord archivist who trusts pattern and probability, and a Communion oracle who trusts the Tangle directly, have spent decades testing which kind of foresight actually wins — neither has ever fully proven the other wrong.

**Characters:**
- **Doran Vex Amaranthine** (Panoptic Concord) — keeps a private tally of every exchange, certain the Ledger will eventually settle the argument.
- **Meridian Aule** (Starweave Communion) — reads the Tangle directly and isn't sure the argument is one foresight was ever meant to settle.

## The Covered-Up Flaw

A Concord archivist has spent three years documenting the single strangest anomaly in living memory — proof that the Assembly's flawless design produced an exception — and an Assembly Keeper has made two personal visits to insist, unconvincingly, that there's nothing there worth documenting.

**Characters:**
- **Yuen Ashcroft** (Panoptic Concord) — has the readings and refuses to let them stay buried in a Dead Drop forever.
- **Foreman-Prime Yssa Ductile** (Wrought Assembly) — insists the anomaly doesn't exist, and knows exactly how unconvincing that insistence is.
```

### 7. Create `test/design-characters.test.js`

```js
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
const charFiles = listMdFiles(CHAR_DIR);
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
```

## AC → verification mapping

| AC | Covered by |
|---|---|
| AC1 (five files, basenames match, 3-5 characters each) | `AC1:` tests |
| AC2 (individual narrative + ≥1 cross-race Threads entry) | `AC2:` test |
| AC3 (web.md exists, names every character, each thread ≥2 races) | `AC3:` test |
| AC4 (unique names; every Threads reference resolves to a real character) | both `AC4:` tests |
| AC5 (held_out — race canon referenced in prose) | `AC5:` test, using the exact hook phrases in the "Canon-hook cross-check" table above |
| Deliverable #3 (bidirectional Threads / mutual acknowledgment) | Not separately auto-checked (no AC number covers it and it's a qualitative narrative property, not a structural one) — verified by hand in this plan; see "bidirectionality" note below |

**Bidirectionality note (verified by hand, not by the test file):** every one of the 20 cross-race Threads entries above has a matching entry in the other character's own file, from that character's own point of view (e.g. Kordelia Vess's file names Vantel Ninth-Chorus over the "Cinderglass Bargain," and Vantel Ninth-Chorus's file names Kordelia Vess back, in his own words). Do not add or remove a Threads entry from one character without mirroring the change in the other.

## Verification

Run from the repo root:

```
node --test
```

Expected: all pre-existing tests still pass (smoke, design-world, design-rules, design-races, design-battlefield, design-cardtypes — untouched), plus every test in the new `test/design-characters.test.js` passes. Output ends with a summary like:

```
# pass <previous total + new count>
# fail 0
```

Exit code 0. The load-bearing part is `fail 0`.

## Out of scope — do NOT do

- Do not modify `design/races/*.md`, `design/world.md`, `design/rules.md`, or `design/ideas-inbox.md`. This unit's deliverables are additive only.
- Do not modify any existing file under `test/` (`design-races.test.js`, `design-world.test.js`, `design-rules.test.js`, `design-battlefield.test.js`, `design-cardtypes.test.js`, `smoke.test.js`) or `test/helpers/markdown.js` — reuse `parseSections`/`sectionText` as-is.
- Do not change the character count per race, character names, or Threads wiring from what's specified above — the bidirectionality and cross-reference correctness were hand-verified against this exact roster; any deviation risks breaking AC4 or the mutual-acknowledgment requirement.
- Do not add a stats/counters line, cost line, or any other card-template field (Section 9 of `design/rules.md`) to these entries — that's future card-design work, not this unit's deliverable. The "As a card, ..." sentence in each identity paragraph is flavor only.
- Do not mark the 2026-07-27 ideas-inbox entry `[incorporated: cardgame-race-characters]` — that's handled by the archive/merge step for this unit, not by the unit's own file changes.


## Findings

(no findings.md)

## Ledger

# Ledger

Append-only. Written by bolt.js, never by agents.

- [2026-07-28T04:12:17.218Z] **bolt:start** — unit=cardgame-race-characters start_sha=9e0cb755a854eb87a29c310eef122507613c6722 branch=bolt/cardgame-race-characters worktree=C:\github\.agentbox-worktrees\cardGame\cardgame-race-characters
- [2026-07-28T04:12:18.185Z] **baseline:done** — pre-edit test exit=0
- [2026-07-28T04:23:56.581Z] **plan:done** — plan.md written
- [2026-07-28T04:25:54.239Z] **tests:done** — RED verified on test/design-characters.test.js (exit=1)
- [2026-07-28T04:29:40.944Z] **build:c1** — tests still red (exit=1)
- [2026-07-28T04:33:21.074Z] **build:c2** — tests still red (exit=1)
- [2026-07-28T04:36:09.319Z] **bolt:escalated** — circuit breaker after 3 cycles


## Receipt

(no receipt.json — bolt escalated before receipt computation)

## Comments

(no comments.md)
