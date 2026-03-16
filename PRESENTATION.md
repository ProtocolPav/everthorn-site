# Everthorn Rollback '26 — Presentation Spec

## Overview

**Everthorn Rollback '26** is a Spotify Wrapped-style, awards-show-themed yearly recap for each player on the Everthorn Minecraft Bedrock server. It is a **full-screen, vertically scrolling slide presentation** — one slide snaps into view at a time, navigated by scrolling (swipe on mobile, scroll wheel on desktop). The player can never be caught mid-slide.

The tone is an **awards show**: a charismatic, witty host presents each "award" to the player. The host voice is warm and self-aware — it roasts gently, celebrates genuinely, and always treats the player as the guest of honour. Every slide is personal. There are no server-wide winners — every player wins their own version of every award.

The whole show builds toward a **Final Accolade** — a real in-game item the player receives, with a unique name and description that defines who they are. Every award before it is evidence. The final slide is the verdict.

---

## Tech Stack

- **Framework:** React + Vite, TypeScript
- **Routing/State:** TanStack (Router, Query)
- **Styling:** TailwindCSS + shadcn/ui
- **Motion:** `motion` (formerly Framer Motion)
- **Haptics:** `haptic-web`
- **Fonts:** Serif display font for award titles, clean sans-serif for body/host text

---

## Slide Architecture

The presentation is a **vertically snapping scroll container**. Each slide is `100dvh` tall. On scroll/swipe, the view snaps to the nearest slide — the player can never be mid-transition.

- **Scroll down / swipe up** → next slide
- **Scroll up / swipe down** → previous slide
- **Snap behaviour:** `scroll-snap-type: y mandatory` on the container, `scroll-snap-align: start` on each slide
- **Progress bar:** thin gold bar at the top of the screen (fixed, above the scroll container), fills as the player advances — like Instagram stories
- Each slide is a self-contained component. It receives its data as props and handles its own internal animation sequencing on mount.

---

## Global Design Language

- **Background:** Near-black stage colour `#0a0a0f`
- **Primary accent:** Warm gold `#c9a84c`
- **Secondary accent:** Cream/ivory `#f5f0e8`
- **Text:** Cream for headings, muted warm grey `#9a9080` for subtext
- **Award titles:** Large, serif, gold
- **Host voice text:** Smaller, italicised, cream — appears word by word (typewriter effect)
- **No confetti until it is earned** — reserved for the Final Accolade reveal

---

## The Academy

Throughout the entire presentation, all awards and judgements are attributed to **The Academy** — the authoritative (and slightly theatrical) body that has been watching all year. The Academy is never explained or named beyond this. It simply *exists*, it has *opinions*, and its word is final.

Reference it consistently across all slides:
- *"The Academy noted..."*
- *"The Academy was unanimous."*
- *"The Academy deliberated on this one."*
- *"The Academy has decided."*

Never use "judges", "panel", or "we" — always The Academy.

---

## The Accolade System

> ⚠️ **TODO: Accolades need to be designed before this section can be finalised.**

There are **6 accolades** in total. Each functions like a personality archetype — every player receives the one that best fits the overall shape of their year. It is not a reward for a single stat, but a verdict on who they were.

Each accolade requires:
- **A name** — the title of the accolade (e.g. *"The Midnight Architect"*)
- **An icon** — a Minecraft item texture used as the accolade's visual identity
- **An in-game item description** — 1–2 lines of flavour text in the style of a Minecraft item tooltip
- **A personality archetype** — a plain description of the kind of player who receives this (e.g. *"High builder, low combat, social"*)
- **Assignment logic** — the rules or scoring that determine which players receive this accolade, based on their wrapped data

The presentation assumes the accolade name, icon, and item description are provided by the data layer. Assignment logic lives in the backend.

---

## Data Shape

The exact API contract is **to be decided**. The presentation will consume a single data object fetched once on load. Slide specs in this document reference data fields by descriptive name (e.g. `username`, `arch_nemesis`, `fastest_quest_title`) — the precise shape, endpoint, and field names will be defined when the Nexuscore API route is built.

---

## Awards Overview

The full show arc moves: **Lighthearted → Habitual → Conflict → Quiet → Intimate → Emotional → Warm → Playful → Triumphant → Peak → Verdict.**

| Slide | Name | Driven By |
|---|---|---|
| 0 | Cold Open | `username` |
| 1 | The Accolade Tease | All 6 accolade icons + `username` + server player count + `accolade_hint` |
| 2 | The Chapter | Dominant behaviour type + peak month + stat trio + peak day |
| 3 | The Ritual | Ritual tier (project / block / behaviour) + consistency count + months active |
| 4 | The Nemesis Accord | Top 3 death sources + nemesis K/D + total playtime hours (zero deaths check) |
| 5 | The Soundtrack | TBD |
| 6 | The Handshake | TBD |
| 7 | The Heartbreak | TBD |
| 8 | The Companion Medal | TBD |
| 9 | The Ghost | TBD |
| 10 | The Second Wind | TBD |
| 11 | The Unstoppable Force | TBD |
| 12 | The Final Accolade | Accolade name, icon, item description |

---

---

## Slide 0 — The Cold Open

### Purpose
First impression. Establishes the awards show world. Makes it immediately personal by putting the player's username centre-stage before any stats appear.

### Visuals
- Background: `#0a0a0f` (full black stage)
- Two stage **spotlights** sweep in from off-screen left and right using conic-gradient `<div>` elements, crossing and settling centre-stage with a subtle flicker on arrival
- Once spotlights settle, the **marquee fades in** with a gentle upward drift:

```
EVERTHORN ROLLBACK '26
An Evening in Honour of — [Username]
```

- `[Username]` appears last, slightly delayed, slightly larger than the surrounding text — the reveal moment
- Below the marquee, the **host text types in** word by word with a typewriter effect:

```
"After careful deliberation from our panel of judges —
and by panel, we mean a database —
the results are in."
```

- Slight pause at the em-dash for comedic timing
- Final line appears larger, centred, bold, after a beat:

```
"Welcome to your night."
```

### Typography
- `EVERTHORN ROLLBACK '26` — small caps, tracked wide, cream, medium weight
- `An Evening in Honour of —` — italic, muted warm grey
- `[Username]` — large, gold (`#c9a84c`), serif display font
- Host text — italic, cream, smaller body size

### Animations
| Element | Animation |
|---|---|
| Spotlights | Sweep from off-screen L/R → settle centre. `motion` animate translate + opacity. Subtle flicker (opacity pulse) on landing. |
| Marquee block | `opacity: 0 → 1` + `translateY(12px → 0)` after spotlights land. 600ms ease-out. |
| `[Username]` | Delayed 300ms after rest of marquee. Slightly larger scale on entry. |
| Host text | Typewriter — words revealed one at a time. ~40ms per word. Pause on em-dashes. |
| "Welcome to your night." | Fades in after host text completes. Bold. Slight scale up (1.0 → 1.04) on appear. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Spotlights land | Soft double-pulse — like a gavel. `[80ms, 40ms, 80ms]` |
| `[Username]` appears | Single sharp tap — the personal moment. `[120ms]` |
| "Welcome to your night." | Gentle rolling rumble — distant applause. `[30ms, 20ms, 30ms, 20ms, 30ms]` |

### No confetti on this slide. Confetti is earned.

---

## Slide 1 — The Accolade Tease

### Purpose
Before any awards are presented, the player is shown what is at stake tonight. All 6 accolades are paraded in front of them. One is theirs. They don't know which yet.

### Sequence

**Beat 1 — Host intro (typewriter, same style as Slide 0)**

```
"Each year, the Academy awards one accolade to every player.
Not for a single moment. But for the shape of the whole year."

"Tonight, [N] players receive theirs."
```

Short pause. Then:

```
"These are the candidates."
```

---

**Beat 2 — The Carousel**

All 6 accolade icons scroll through in a **horizontal coverflow carousel**:
- Starts fast — slot machine energy
- Gradually decelerates over ~3 seconds
- The centred icon is scaled up and has a warm gold radial glow behind it
- Icons at the edges are scaled down and dimmed
- The accolade **name** fades in beneath the centred icon only, fading out as it leaves centre
- All 6 names are shown as the carousel slows, so players register them

---

**Beat 3 — The Academy's Opinion**

Once the carousel finishes cycling through all icons (still moving slowly), a single personalised host line appears — a hint without a reveal:

> ⚠️ **TEMPORARY — placeholder lines until accolades are finalised and assignment logic is known.**

Example hint lines keyed to dominant data pattern:
- High blocks placed → *"The Academy will say only this: the world looks different because of you."*
- High mob kills → *"The Academy noted your... enthusiasm."*
- High social (time with others) → *"The Academy was moved by what they found."*
- High quest completion → *"The Academy rarely sees this kind of dedication."*
- High deaths → *"The Academy admires persistence. Truly."*
- Low overall activity → *"The Academy appreciated the quiet ones."*

Once accolades are finalised, these lines should be tied directly to each accolade archetype rather than raw stats.

---

**Beat 4 — The Blackout**

The carousel slows to a stop and settles on a **silhouetted icon** — solid dark shape, no texture visible, surrounded by a cool silver-white glow instead of gold.

Below it, no name. Just `?`

Host line, appearing after a beat:

```
"One of these belongs to [Username]. The Academy has decided."
```

---

**Beat 5 — The Nudge**

A subtle scroll cue appears at the bottom of the slide — small, elegant, not intrusive:

```
"scroll to begin"
```

In muted warm grey, small caps, gently pulsing opacity. This is the only slide that explicitly prompts the player to continue — after this they know the rhythm.

---

### Animations
| Element | Animation |
|---|---|
| Host intro text | Typewriter, same as Slide 0. ~40ms per word. |
| Carousel spin-up | Icons animate in from right, accelerating for ~0.5s then holding fast speed for ~1s |
| Carousel deceleration | Eases out over ~3s using a custom cubic-bezier. Lands centred on a random icon mid-sequence before continuing to the silhouette. |
| Coverflow effect | `motion` `rotateY` + `scale` + `opacity` on each icon relative to its distance from centre |
| Gold glow | Radial gradient behind centred icon, `opacity` fades in/out as icon enters/leaves centre |
| Accolade name | `opacity: 0 → 1` when icon is centred, `0` otherwise. 200ms fade. |
| Silhouette settle | Final carousel stop: icon fades to silhouette (desaturate + darken). Glow shifts gold → silver-white. |
| `?` label | Fades in after silhouette settles. |
| Host closer line | Typewriter, after `?` appears. |
| Scroll nudge | Fades in last. Gentle `opacity` pulse loop (1.0 → 0.4 → 1.0), 2s cycle. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Carousel spin-up | Rapid light taps, increasing in frequency as speed increases. ~`[20ms]` repeating, tightening |
| Each icon passing centre (during slow phase) | Single soft tick. `[30ms]` |
| Carousel settles on silhouette | Heavier thud — like a gavel. `[100ms, 50ms, 150ms]` |
| Host closer line appears | Single sharp tap. `[80ms]` |

---

## Slide 2 — The Chapter

### Purpose
The first real award. Every player has a month that defined their year — not necessarily the one where they played the most, but the one where their dominant behaviour peaked. This slide names that month and makes the case for why it mattered.

### Data Required

**Step 1 — Determine dominant behaviour type** (used across the whole year):
- **Builder** — `events.interactions`: compare `SUM(blocks_placed)` vs `SUM(blocks_mined)` weighted by ratio. High placer = builder tendency.
- **Grinder** — quest completions joined from the quests/events tables: `COUNT` of completed quests relative to total playtime.
- **Social** — `events.sessions_view`: measure time where the player's session overlaps with at least one other player's session, as a proportion of total playtime.

Whichever score is proportionally highest defines the player's dominant behaviour for this slide.

**Step 2 — Find their peak month** using the dominant behaviour:
- Builder → `SELECT DATE_TRUNC('month', timestamp) AS month FROM events.interactions WHERE player_id = ? GROUP BY month ORDER BY SUM(blocks_placed) DESC LIMIT 1`
- Grinder → equivalent query on quest completion events, grouped by month
- Social → `events.sessions_view` overlapping sessions grouped by month, `ORDER BY SUM(overlap_seconds) DESC LIMIT 1`

**Step 3 — Build the stat trio for that month:**
- Dominant stat value that month (e.g. blocks placed, quests completed, or hours with others)
- Total hours played that month — `events.sessions_view` filtered to that month
- Peak day within the month — group by date, order by dominant stat DESC, take top 1

---

### Sequence

**Beat 1 — Host intro (typewriter)**
```
"Every player has a chapter.
A month where everything aligned."

"The Academy reviewed the full year."
```

Pause. Then:

```
"Yours was written in..."
```

Typewriter ends. Cursor blinks twice. Text fades out gently.

---

**Beat 2 — The Reveal**

The month name drops in. Big. Gold. Serif. Centre screen.

```
[MONTH NAME]
[Month] [Year]
```

- Month name: large, gold, serif display font
- `[Month] [Year]` subtitle: small, italic, cream, below
- Soft gold radial glow expands behind the text like a sunrise

---

**Beat 3 — The Evidence Trio**

Three stat pills fade up one by one beneath the month name:
1. Dominant stat that month (e.g. *"4,821 blocks placed"*)
2. Total hours played that month (e.g. *"38 hours"*)
3. Peak day (e.g. *"Best day: 14 March"*)

Each pill: rounded, low-contrast border, icon left, value right. Staggered entry.

---

**Beat 4 — The Closer**

Host line fades in beneath the pills:

```
"This is when the Academy started watching."
```

---

### Visuals
- Background: `#0a0a0f`
- Month name is the centrepiece — large enough to feel like a poster title
- Glow is soft and warm, not harsh — warmth, not spotlight
- Stat pills are subtle: rounded border (`border-white/10`), small icon, readable value

### Animations
| Element | Animation |
|---|---|
| Host intro | Typewriter. Cursor blinks twice after last word. Full block fades out before Beat 2. |
| Month name | Enters from `translateY(-30px)`, slight overshoot spring. 500ms. |
| Glow | Radial gradient scales `0 → full` behind month name. 800ms ease-out. |
| Stat pills | Staggered `opacity + translateY(16px → 0)`. 150ms between each pill. |
| Closer line | Fades in 400ms after last pill lands. Italic. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Month name lands | Satisfying thud + brief rumble. `[150ms, 60ms, 80ms]` |
| Each stat pill appears | Soft tick. `[40ms]` |
| Closer line appears | Gentle double pulse. `[60ms, 40ms, 60ms]` |

---

## Slide 3 — The Ritual

### Purpose
The Chapter told us *when* the player was most themselves. The Ritual tells us *what they always came back to* — the habit that showed up month after month without fail. This isn't the biggest stat. It's the most *reliable* one. The show is starting to know the player.

This is the first slide with a quieter, more sincere tone. No punchline. Just recognition.

### Data Required

The ritual is determined by a **three-tier priority check**. Evaluate in order and use the first tier that yields a clear result:

**Tier 1 — Project** *(most meaningful)*
- Source: projects activity table (TBD — needs to be queryable by `player_id`, `project_id`, and `month`)
- Query: find the project present in the most distinct months of activity for this player
- Threshold: must appear in at least half of the player's active months to qualify
- If found: the project *is* the ritual. Optionally surface the top block placed within that project as a secondary detail.
- Output: `ritual_type = "project"`, `ritual_name = project name`, `ritual_months = N`, `ritual_block = top block within project (optional)`

> ⚠️ **Note for data layer:** Project activity needs to be queryable per player per month. This is required for Tier 1 to work.

**Tier 2 — Ritual Block** *(fallback if no dominant project)*
- Source: `events.interactions`
- Query: `SELECT block_type, COUNT(DISTINCT DATE_TRUNC('month', timestamp)) AS months_present FROM events.interactions WHERE player_id = ? AND action = 'placed' GROUP BY block_type ORDER BY months_present DESC LIMIT 1`
- The block present in the most distinct months is the ritual block
- Output: `ritual_type = "block"`, `ritual_name = block type`, `ritual_months = N`

**Tier 3 — Ritual Behaviour** *(fallback if block spread is too even)*
- Source: `events.interactions` + quest events + `events.sessions_view`
- Query: for each behaviour category (building, combat, questing), count distinct months with any activity. Take the highest.
- Output: `ritual_type = "behaviour"`, `ritual_name = "building" | "combat" | "questing"`, `ritual_months = N`

Also needed: `total_active_months` — count of distinct months where the player had any session, from `events.sessions_view`.

---

### Sequence

**Beat 1 — Host intro (typewriter)**
```
"Some things don't need a reason.
They just happen. Every month. Without fail."
```

Pause. Then:

```
"The Academy calls this a ritual."
```

---

**Beat 2 — The Reveal**

Visual differs slightly by ritual tier:

- **Tier 1 (Project):** Project name in large gold serif text, centred. Below it: *"A place you always returned to."* in muted italic. If a ritual block is available, a small item icon appears beneath as a secondary detail.
- **Tier 2 (Block):** Block item icon fades in large and centred, softly lit. Block name appears below in gold serif.
- **Tier 3 (Behaviour):** A category icon (pickaxe / sword / scroll) fades in. Behaviour label below in gold serif (e.g. *"Building"*).

All tiers share the same supporting line beneath the reveal, in muted warm grey:
```
"Present in [N] of your [M] active months."
```

---

**Beat 3 — The Closer**

For **Tier 1** (project):
```
"Whatever else changed — you always came back."
```

For **Tier 2** (block):
```
"Whatever you were building — it always started here."
```

For **Tier 3** (behaviour):
```
"Whatever else happened — you always showed up."
```

All delivered as a single host line fading in after the reveal settles. Quiet. No joke.

---

### Visuals
- Background: `#0a0a0f`
- Glow behind the centrepiece is cooler and softer than Slide 2 — more like candlelight than a sunrise. Slightly blue-shifted warm white rather than full gold.
- The slide breathes — less density than Slide 2, more space around elements
- Supporting stat line is small and understated — evidence, not headline

### Animations
| Element | Animation |
|---|---|
| Host intro | Typewriter, ~40ms per word. Fades out after "ritual." |
| Centrepiece (icon or name) | Fades in with gentle `scale(0.92 → 1.0)` + `opacity`. 600ms ease-out. Soft and unhurried. |
| Supporting glow | Expands slowly behind centrepiece. 1000ms ease-out. |
| `"Present in N of M months"` | Fades in 300ms after centrepiece settles. Small, no translation. |
| Closer line | Fades in 500ms after supporting stat. Italic. Slow fade — 800ms. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Centrepiece appears | Single soft pulse — gentle, not sharp. `[100ms]` |
| Supporting stat line appears | Near-silent — very faint tick. `[20ms]` |
| Closer line appears | Slow double pulse — like a heartbeat. `[80ms, 600ms, 80ms]` |

---

## Slide 4 — The Nemesis Accord

### Purpose
Re-energises the show after the sincerity of The Ritual. The Academy has reviewed the player's death record and has *thoughts*. The only slide with an interactive element — a nominations quiz before the verdict is read.

### Data Required

**Death source inclusion rules:**
- Include mob deaths: `cause LIKE 'minecraft:%' OR cause LIKE 'amethyst:%'`
- Include player deaths: `cause` value matches a known player gamertag in the players table
- Exclude all other causes (fall damage, fire, drowning, void, etc.) — silently filtered, not mentioned in the display

> ⚠️ **Note for data layer:** Player death attribution requires a join against the players table to check if `cause` matches a known gamertag. The display should show the raw gamertag for player nemeses.

**Nemesis query:**
```sql
SELECT cause, COUNT(*) AS death_count
FROM events.interactions
WHERE player_id = ?
  AND action = 'die'
  AND (cause LIKE 'minecraft:%' OR cause LIKE 'amethyst:%'
       OR cause IN (SELECT gamertag FROM players))
GROUP BY cause
ORDER BY death_count DESC
LIMIT 3
```
Top result = nemesis. 2nd and 3rd = quiz decoys.

**K/D against the nemesis:**
- Deaths: `COUNT` of `action = 'die'` where `cause = nemesis`
- Kills: `COUNT` of `action = 'kill'` where `target = nemesis` from `events.interactions`

**Zero deaths check:** if the above query returns no rows at all, use the zero deaths variant.

**For the zero deaths variant:** also fetch total playtime hours from `events.sessions_view` — used in the host line.

> ⚠️ **Note for assets:** Mob face sprites needed for quiz icons. Check Amethyst addon assets first. Player head rendering needed for player nemeses — render from gamertag.

---

### Sequence (Standard Variant)

**Beat 1 — Host intro (typewriter)**
```
"The Academy reviewed your combat record.
There were... highlights."

"Three suspects have been identified."
```

---

**Beat 2 — The Nominations**

Three large icons appear staggered, centre screen, side by side:
- Mob nominees: face sprite of the mob
- Player nominees: rendered player head

Each icon drops in one at a time with a small bounce — like nominees being called to the stage. Below all three:

```
"Which one gave you the most trouble?"
```

Player taps an icon. Tapped icon gets a gold border.

---

**Beat 3 — The Reveal**

1 second dramatic pause after tap. Then:

- **Correct guess:** tapped icon pulses gold and scales up. Others fade to `opacity: 0.2`.
  > *"The Academy is not surprised you knew."*

- **Wrong guess:** tapped icon shakes (error), fades. Correct icon glows gold and scales up.
  > *"Interesting choice. The Academy notes your denial."*

---

**Beat 4 — The Verdict**

Nemesis icon stays large and centred. Name appears below in gold serif. K/D breakdown fades in:

```
[N] deaths  ·  [K] kills
```

Verdict one-liner based on K/D ratio:
- Deaths significantly > kills → *"The Academy has classified this as an ongoing conflict."*
- Deaths ≈ kills → *"Evenly matched. The Academy respects the rivalry."*
- Kills significantly > deaths → *"You won. The Academy acknowledges this. The nemesis does not."*

---

### Zero Deaths Variant

Skip the quiz entirely. The slide becomes a prestige moment — dry, unhurried, final.

```
"The Academy reviewed your death record."

[1.5s pause]

"There isn't one."

[1s pause]

"In [N] hours on Everthorn. Not once."

[1s pause]

"The Academy has reviewed thousands of records.
It has no further comment on this one."
```

All lines typewriter. No reveal, no quiz, no K/D pills. Just silence doing the work. The Academy's conspicuous lack of fanfare *is* the fanfare.

---

### Visuals
- Nomination icons are large — approx. 80px, equal sizing for mob sprites and player heads
- Selected icon: gold `ring` border, 2px
- Correct reveal: radial gold glow expands behind winning icon
- Wrong reveal: wrong icon `translateX` shake, correct icon glows in from neutral
- K/D pills: same style as Slide 2 stat pills

### Animations
| Element | Animation |
|---|---|
| Host intro | Typewriter, ~40ms per word |
| Nomination icons | Staggered `translateY(-40px → 0)` + spring bounce. 200ms between each icon. |
| Tap selection | Gold ring border fades in on selected icon. 150ms. |
| Reveal — correct | Selected icon `scale(1.0 → 1.15)` + gold glow. Others `opacity → 0.2`. 400ms. |
| Reveal — wrong | Selected icon `translateX` shake (±6px, 3 cycles, 300ms). Then fades. Correct icon glow fades in. |
| Nemesis name | Fades in beneath icon after reveal settles. 400ms. |
| K/D pills | Staggered fade-up, same as Slide 2 pills. 150ms between each. |
| Verdict line | Fades in 400ms after K/D. Italic. |
| Zero deaths lines | Each line typewriter with manual pauses between. No other animations. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Each nomination icon lands | Soft tick. `[40ms]` |
| Player taps an icon | Sharp tap. `[60ms]` |
| Correct reveal | Rolling crowd swell. `[30ms, 20ms, 40ms, 20ms, 50ms]` |
| Wrong reveal | Error thud. `[100ms, 30ms, 100ms]` |
| Verdict line appears | Single measured pulse. `[80ms]` |
| Zero deaths — "There isn't one." | Single deep, slow pulse. `[200ms]` |

---
