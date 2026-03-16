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

## The Accolade System

The **Final Accolade** is not just a label — it is a real in-game item the player receives after viewing their Rollback. Each accolade has:

- **A name** — a title that captures the player's identity (e.g. *"The Midnight Architect"*, *"The Tireless Wanderer"*)
- **An in-game item description** — flavour text written in the style of a Minecraft item tooltip, 1–2 lines, that reads like a legend about the player
- **Derived from** the pattern of their awards — not a single stat, but the overall shape of their year

The accolade system and the logic for deriving which accolade a player receives (based on their data) is **to be designed separately**. The presentation spec assumes the accolade name, item description, and any associated visual (item icon) are provided by the data layer.

---

## Data Shape

The exact API contract is **to be decided**. The presentation will consume a single data object fetched once on load. Slide specs in this document reference data fields by descriptive name (e.g. `username`, `arch_nemesis`, `fastest_quest_title`) — the precise shape, endpoint, and field names will be defined when the Nexuscore API route is built.

---

## Awards Overview

The presentation is structured as an awards show. Each "award" is a slide. The full show builds toward the **Final Accolade**.

| Slide | Name | Driven By |
|---|---|---|
| 0 | Cold Open | `username` |
| 1 | The Accolade Tease | Static / accolade concept intro |
| ... | Awards (TBD as spec grows) | Various data fields |
| Last | The Final Accolade | Accolade name, item, description |

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
