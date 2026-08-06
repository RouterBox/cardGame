GATE: none

# Plan: cardgame-world-races

This is a DESIGN unit (taste ledger T8). There is no code to write — the deliverables
are six markdown files, and the only "build" step is copying the text below into
those files exactly. `node --test` must still pass afterward (it will — the existing
smoke test does not touch `design/`), and there is no automated check for the
acceptance criteria; verification is a manual read-through against the checklist at
the end of this plan.

## Risk self-assessment (FIRE)

- **Reversibility:** Full. Plain markdown files under version control; trivially
  revertable with `git revert` / `git checkout`.
- **Security impact:** None. No code execution, no dependencies, no config changes.
- **User data:** None touched.
- **Schema changes:** None.

Nothing here is ambiguous enough to need a design gate — proceed without confirmation.

## Held-out AC note

AC5 (held out) requires `design/world.md` to name at least three of the five races.
This is not a novel requirement smuggled into the held-out set — it's a direct
operationalization of the unit's own stated intent ("read as one connected universe
rather than disconnected documents"), which is visible in the AC5 text itself and
echoed in deliverable #1's "concrete enough that card flavor and art briefs can cite
it." Not a spec bug. The world.md text below references all five races by name, so
this is satisfied with margin.

---

## Step 0 — create directories

The `design/` directory does not exist yet in `C:\github\cardGame`. Create it and the
`races/` subdirectory:

```powershell
New-Item -ItemType Directory -Force C:\github\cardGame\design\races
```

## Step 1 — design decisions to carry into the files (context, not something to redo)

Five categories from `gamePlan.md`: **materials, biology, intelligence, technology,
magic**. Five races, one primary strength each (a bijection with the five
categories), so AC3's "each category is primary exactly once" is satisfied by
construction.

The counter/complementary structure is a fixed **pentagram** (the classic
"Rock-Paper-Scissors-Lizard-Spock" shape: every category beats exactly two others
and loses to exactly two others, no ties). Order the categories in a ring —
Materials → Biology → Intelligence → Technology → Magic → (back to Materials) —
and define: each category beats the next two categories clockwise in that ring, and
loses to the previous two. Concretely:

| Category | Beats (→ complementary strengths of its race) | Loses to (→ countering weaknesses of its race) |
|---|---|---|
| Materials | Biology, Intelligence | Technology, Magic |
| Biology | Intelligence, Technology | Magic, Materials |
| Intelligence | Technology, Magic | Materials, Biology |
| Technology | Magic, Materials | Biology, Intelligence |
| Magic | Materials, Biology | Intelligence, Technology |

Because each row is primary (1) + beats (2) + loses-to (2) = all 5 categories with
zero repeats, AC3's "no race lists the same category twice across its slots" is
satisfied by construction for every race, and the counter relationships form one
consistent cycle (no race is strictly dominant — everyone beats two and loses to
two). Do not change this table when writing the files; it's the thing that makes
AC3 pass.

Five races (name → primary category → file path):

| Race | Primary | File |
|---|---|---|
| The Cindral Reach | Materials | `design/races/cindral-reach.md` |
| The Mireth Bloom | Biology | `design/races/mireth-bloom.md` |
| The Panoptic Concord | Intelligence | `design/races/panoptic-concord.md` |
| The Wrought Assembly | Technology | `design/races/wrought-assembly.md` |
| The Starweave Communion | Magic | `design/races/starweave-communion.md` |

The cosmology in `world.md` names the five in-universe forces that ground the
categories: the Mass (materials), the Bloom (biology), the Signal (intelligence),
the Circuit (technology), the Skein (magic). Race names deliberately echo their
force (Mireth **Bloom** channels the Bloom, **Starweave** Communion reads the Skein,
etc.) — this is a nice-to-have consistency, not an AC requirement.

## Step 2 — write `C:\github\cardGame\design\world.md`

Create the file with exactly this content:

```markdown
# The Amaranth Expanse

## The Setting

The Amaranth Expanse is a galaxy that keeps almost dying and never quite finishes the job. Its core is a wound: a ring of dead systems where a war older than any living species burned itself out, leaving black glass moons, drowned reactor-worlds, and starlight that arrives bent from gravity wells that shouldn't exist. Around that wound, the living galaxy sprawls — five great civilizations and a thousand lesser ones, each staking claims on drifting resource fields, ruined precursor stations, and the raw hungry dark between the stars. Nobody controls the Expanse. Everyone is trying to.

It is a galaxy built for traders, raiders, and builders in equal measure. A world can be a factory floor one season and a battlefield the next; a fleet you spent years growing can be gone in an afternoon, and a single overlooked outpost can quietly become an empire's spine. Diplomacy here is a tactic, not a virtue — alliances are made to be spent. What endures is not any one civilization's borders, but the five deep currents of power every civilization, however different, has learned to draw on to survive.

## A History in Brief

Before the five civilizations, there was the First Weave — a name none of them chose for themselves, reconstructed from wreckage and half-translated glyphs by the archivists who came after. The First Weave did not conquer the Expanse so much as *tune* it: their megastructures — some still standing, most not — bent the galaxy's raw potential into five distinguishable currents where before there had only been undifferentiated possibility. Scholars across every modern civilization agree on almost nothing about the First Weave except this: they finished their work, and then they Sundered.

Nobody knows if the Sundering was a war, an ascension, or a suicide. What's certain is the aftermath: the First Weave's tuning didn't vanish with them. It scattered — five loose, wild currents leaking out of dead megastructures and broken moons, available to anyone with the will and the wit to tap them. The oldest generator-stations in every civilization's founding myths are, without exception, retrofitted First Weave ruins. Every civilization now walking the Expanse — the ash-armored line-fleets of the Cindral Reach, the spreading mycelial cities of the Mireth Bloom, the data-cathedral archives of the Panoptic Concord, the self-replicating foundries of the Wrought Assembly, the star-mapped sanctuaries of the Starweave Communion — rose by learning to harvest one current first, and the others second. That order of learning is why each is powerful in one particular way, capable in two more, and can still be caught flat-footed by the two currents it never made peace with.

## Cosmology: The Five Founts

Ask a physicist and a priest in the Amaranth Expanse what the galaxy is made of, and — unusually — they will give you almost the same answer: five Founts. Not elements, not quite forces; call them *currents of potential*, the raw stuff every generator-station on every world is built to catch and convert into the fuel of civilization. A generator doesn't create anything — it listens to one Fount and lets a little of it through. Everything a civilization builds, casts, breeds, thinks, or wields is that Fount, given shape.

### The Mass — materials

The Mass is the oldest and least glamorous of the Founts: the simple, stubborn fact that matter exists and can be bent to a purpose. It is ore that wants to be armor, rock that wants to be a hull, a dead star's core that wants to be a weapon. Civilizations that listen closely to the Mass build things that last — hulls that shrug off void-frost, blades that don't dull, factories that outlive the wars they were built to win. The Mass has no opinions and no cleverness; it simply endures, which is its own kind of power and its own kind of limitation.

### The Bloom — biology

The Bloom is the current of things that grow, adapt, and refuse to stay dead. Where the Mass gives you a hull, the Bloom gives you a hull that heals, or better, a hull that was never a hull at all but something that grew into the shape of one. Civilizations attuned to the Bloom don't build so much as *cultivate* — they seed a battlefield and come back later to harvest whatever it became. The Bloom answers threats by mutating past them, which makes it nearly impossible to out-plan and disturbingly easy to out-think, if you're patient enough to find the pattern underneath the growth.

### The Signal — intelligence

The Signal is the current of pattern, prediction, and knowing things a moment before they happen. It runs through every archive, every sensor net, every trade contract with fine print nobody else read closely enough. Civilizations that draw on the Signal rarely win by force; they win by already being three moves ahead, by knowing the price of a thing before the seller does, by turning an enemy's own plan into the weapon that beats them. The Signal is devastating against anything that follows a fixed shape — and nearly useless against a threat too blunt, too alive, or too fast to be predicted at all.

### The Circuit — technology

The Circuit is the current of the made thing that keeps making more of itself: the self-assembling factory, the drone that repairs the drone that built it, the artifact whose instructions are baked into its own architecture. Civilizations that master the Circuit turn a single working idea into an army of identical, tireless copies. Its gift is scale without fatigue; its curse is that it can only ever be as clever as its last update — a Circuit-built force that meets something genuinely unpredictable can find every one of its perfect copies wrong in exactly the same way.

### The Skein — magic

The Skein is the current nobody can fully explain, not even the civilizations that live inside it: the thread connecting cause to effect that can, with enough will, be tied differently. It is the Fount closest to whatever the First Weave actually were, and the one most likely to still be watching. Civilizations that draw on the Skein don't obey the Expanse's ordinary rules of distance, sequence, or probability so much as negotiate with them. The Skein can undo a plan that was already perfect — and it is, in exactly the moments that matter, the least reliable current of all.
```

## Step 3 — write the five race files

### `C:\github\cardGame\design\races\cindral-reach.md`

```markdown
# The Cindral Reach

## Identity

The Cindral Reach began as asteroid-belt mining clans and became an empire that never stopped thinking like one: nothing is wasted, nothing is thrown away, and everything — a hull, a soldier, a dead enemy's warship — can be melted down and remade into something the Reach needs more. They want simple, absolute things: territory, matériel, and the certainty that comes from owning enough hardware that losing a battle is an inconvenience, not a crisis. Playing the Reach feels like accumulating weight — slow at first, then unstoppable, then very hard for anyone else to out-produce.

## Strengths & Weaknesses

- **Primary strength:** Materials
- **Complementary strengths:** Biology, Intelligence
- **Countering weaknesses:** Technology, Magic

## Signature Hooks

- **Salvage Doctrine** — destroyed Cindral units leave behind scrap tokens that make your next rebuild cheaper.
- **Line-Fleet Discipline** — Materials units get stronger for every other copy of them you control.
- **Ancestral Plating** — equipment attached to a Cindral unit can't be stripped by non-Materials effects.
- **The Long Refit** — a Materials generator that survives three turns starts producing bonus points.
- **Cinderborn Levy** — spend leftover Mass points to deploy a lesser unit for free.

## Visual Identity

Rusted ochre and iron-grey war-hulls patched with generations of salvage plating; industrial gothic silhouettes bristling with exposed girders and glowing forge-vents; warriors sealed in heavy exosuits fused at the joints from decades of continuous wear; ships shaped like cathedrals of scrap, trailing slag and cinder in their wake.
```

### `C:\github\cardGame\design\races\mireth-bloom.md`

```markdown
# The Mireth Bloom

## Identity

The Mireth Bloom is not a nation so much as a single sprawling organism wearing the shape of one — spore and flesh spreading world to world, individuals barely distinct from the whole. It doesn't conquer, exactly; it *grows over*, converting whatever it touches into another extension of itself, patient and relentless rather than cruel. Playing the Bloom feels alive in the most literal sense: your board mutates under you, snowballs in directions you didn't fully plan, and never looks quite the same from one match to the next.

## Strengths & Weaknesses

- **Primary strength:** Biology
- **Complementary strengths:** Intelligence, Technology
- **Countering weaknesses:** Magic, Materials

## Signature Hooks

- **Spore Memory** — a Biology creature that dies returns a cheaper, mutated version to your hand next turn.
- **Adaptive Carapace** — Biology units gain a random keyword the first time they take damage each game.
- **Bloomfront Expansion** — Biology generators can be built directly onto contested territory.
- **Symbiotic Grafting** — attach a captured enemy card as a graft, stealing one of its abilities.
- **Feral Reversion** — sacrifice a Biology creature to regrow a random pricier one from your deck.

## Visual Identity

Wet chitin and bioluminescent fungal blooms overtaking metal and stone alike; deep bruise-purple, spore-yellow, and wound-pink; creatures with too many joints and eyes that open only under threat; architecture that isn't built but grown — ribbed towers of living resin pulsing faintly like breathing lungs.
```

### `C:\github\cardGame\design\races\panoptic-concord.md`

```markdown
# The Panoptic Concord

## Identity

The Panoptic Concord is a post-scarcity civilization of archivists, brokers, and spies who decided long ago that information outranks matter — that a war is just a negotiation someone refused to have. What they want is total legibility of the Expanse: to know every rival's next move before they make it, and to profit from that knowledge whether the profit comes from a trade or a betrayal. Playing the Concord feels like three-dimensional chess against an opponent who only sees one board — value and tempo compound quietly until the game is already over.

## Strengths & Weaknesses

- **Primary strength:** Intelligence
- **Complementary strengths:** Technology, Magic
- **Countering weaknesses:** Materials, Biology

## Signature Hooks

- **Foreknowledge Ledger** — look at the top card of any opponent's deck at the start of each of your turns.
- **Contract Rewrite** — pay Signal points to swap the cost of a card in your hand with a card in an opponent's hand.
- **Panoptic Relay** — Intelligence generators can be built anywhere you have vision of, even in enemy territory.
- **Whisper Network** — reveal a card from hand once per turn to blunt an opponent's next play.
- **Dead Drop** — bank unused Signal points between turns instead of losing them, up to a cap.

## Visual Identity

Glass-black archive spires threaded with slow-drifting light, no visible weapons, only lenses and antennae; robes and exosuits paneled with shifting readouts instead of ornament; a palette of cold blues and static-white; environments that feel like a library the size of a moon, silent except for the hum of a billion running calculations.
```

### `C:\github\cardGame\design\races\wrought-assembly.md`

```markdown
# The Wrought Assembly

## Identity

The Wrought Assembly is a machine civilization descended from a species that, generations ago, uploaded itself into its own factories and never looked back. It wants one thing with total clarity: a single flawless design, copied without end across every system it can reach. Playing the Assembly feels mechanical and inevitable right up until it isn't — the engine scales harder than anything else in the galaxy once it's running, and collapses hard if that one engine gets disrupted.

## Strengths & Weaknesses

- **Primary strength:** Technology
- **Complementary strengths:** Magic, Materials
- **Countering weaknesses:** Biology, Intelligence

## Signature Hooks

- **Replication Protocol** — the first Technology unit you play each turn can be copied at a discount.
- **Firmware Patch** — a countered Technology card returns to your hand instead of the graveyard, once per game.
- **Assembly Line** — Technology generators get cheaper each time you build another one in the same turn.
- **Failsafe Core** — sacrifice a unit instead of losing your last Technology generator.
- **Swarm Update** — every copy of a named Technology unit gains a keyword the instant one copy gains it.

## Visual Identity

Chrome and matte-ceramic drone-swarms in perfect geometric formation, no individual unit distinguishable from the next; cold factory-white and warning-amber lighting; skeletal assembly arms visible mid-construction on every capital ship; the aesthetic of an assembly line that never stopped since the day it started, indifferent to whether anyone is still watching it work.
```

### `C:\github\cardGame\design\races\starweave-communion.md`

```markdown
# The Starweave Communion

## Identity

The Starweave Communion is less a state than a scattered faith: star-touched pilgrims who read the Skein directly and believe the First Weave never truly left, that it can still be petitioned if the right ritual is performed at the right coordinates. What they want is to finish whatever work the First Weave abandoned at the Sundering. Playing the Communion is high-variance by design — a single card can undo an opponent's whole plan, but the Communion is fragile and inconsistent without setup, a bet against the Expanse's own rules rather than a battle plan.

## Strengths & Weaknesses

- **Primary strength:** Magic
- **Complementary strengths:** Materials, Biology
- **Countering weaknesses:** Intelligence, Technology

## Signature Hooks

- **Unwritten Clause** — once per game, cast a Magic card as though it had been played a turn ago, retroactively changing the board.
- **Skein-Bound Oath** — Magic creatures can't be targeted the turn they enter play.
- **Prophesied Ruin** — pay extra Skein points to destroy a permanent and draw a card named after what it used to be.
- **Pilgrim's Gambit** — sacrifice a generator to resolve a Magic card without paying its cost.
- **Echo of the First Weave** — cast Magic spells from your graveyard at double cost, but they can't be countered.

## Visual Identity

Sun-bleached pilgrim robes over void-hardened skin, star-charts tattooed in light that moves with the wearer; architecture of standing stones grown from crashed precursor wreckage, half-shrine and half-antenna; a palette of deep violet, comet-white, and a green found nowhere else in the galaxy; the sense that every Starweave figure is mid-ritual even when standing still.
```

## Step 4 — verify

Run the test command from the repo root:

```powershell
cd C:\github\cardGame
node --test
```

Expected output: the existing smoke test still passes (something like `# pass 1`,
`# fail 0`) — this unit adds no code and no tests, so this step is only confirming
nothing else broke.

Then manually check the AC list against the files (no script needed, this is a
five-minute read):

- [ ] AC1 — `design/world.md` exists, has a setting overview and a "Cosmology"
      section naming all five categories (materials/Mass, biology/Bloom,
      intelligence/Signal, technology/Circuit, magic/Skein). ✅ by the text above.
- [ ] AC2 — exactly five files under `design/races/`, each with an identity
      paragraph, one primary, two complementary, two countering strengths. ✅ by
      the text above (and no stray 6th file — don't add one).
- [ ] AC3 — each category is primary exactly once across the five files, and no
      race repeats a category across its own primary/complementary/countering.
      ✅ guaranteed by the pentagram table in Step 1 — do not deviate from it.
- [ ] AC4 — each race file has 3-5 named signature hooks and a visual-identity
      paragraph. ✅ every file above has 5 hooks and a visual paragraph.
- [ ] AC5 (held out) — `world.md` names at least three races. ✅ the History
      section above names all five (Cindral Reach, Mireth Bloom, Panoptic Concord,
      Wrought Assembly, Starweave Communion).

If all six boxes are checked and `node --test` exits 0, the unit is done. Do not
add a new automated test for the design content — none was requested, and the
prescribed test command is `node --test` unchanged.
