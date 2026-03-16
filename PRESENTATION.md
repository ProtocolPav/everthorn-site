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

The presentation is structured as an awards show. Each "award" is a slide. The full show builds toward the **Final Accolade**.

| Slide | Name | Driven By |
|---|---|---|
| 0 | Cold Open | `username` |
| 1 | The Accolade Tease | All 6 accolade icons + `username` + server player count + `accolade_hint` |
| ... | Awards (TBD as spec grows) | Various data fields |
| Last | The Final Accolade | Accolade name, icon, item description |

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
