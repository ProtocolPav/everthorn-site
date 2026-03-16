# Everthorn Rollback '26 — Presentation Spec

## Overview

**Everthorn Rollback '26** is a Spotify Wrapped-style, awards-show-themed yearly recap for each player on the Everthorn Minecraft Bedrock server. It is a **full-screen, slide-based React presentation** — one slide at a time, navigated by tapping/clicking, designed primarily for mobile but functional on desktop.

The tone is an **awards show**: a charismatic, witty host presents each "award" to the player. The host voice is warm and self-aware — it roasts gently, celebrates genuinely, and always treats the player as the guest of honour. Every slide is personal. There are no server-wide winners — every player wins their own version of every award.

The whole show builds toward a **final accolade** — a single title that defines who this player is, derived from the pattern of everything that came before it. This is introduced at the start and revealed at the end.

---

## Tech Stack

- **Framework:** React (Next.js), TypeScript
- **Styling:** TailwindCSS
- **Animations:** CSS keyframes + Framer Motion where needed
- **Haptics:** `haptic-web` library
- **Data source:** Nexuscore API (`/wrapped/2026/{thorny_id}`)
- **Fonts:** Serif display font for award titles, clean sans-serif for body/host text

---

## Slide Architecture

Each slide is a full-screen component. The presentation is a controlled array of slide components rendered one at a time. Navigation:
- **Tap/click right half** → advance
- **Tap/click left half** → go back
- **Progress bar** at the top (thin, gold, like Instagram stories)

Each slide receives its relevant data as props from the top-level wrapped data object fetched once on load.

---

## Global Design Language

- **Background:** Near-black stage colour `#0a0a0f`
- **Primary accent:** Warm gold `#c9a84c`
- **Secondary accent:** Cream/ivory `#f5f0e8`
- **Text:** Cream for headings, muted warm grey `#9a9080` for subtext
- **Award titles:** Large, serif, gold
- **Host voice text:** Smaller, italicised, cream — appears word by word (typewriter effect)
- **No confetti until it is earned** — reserved for the final accolade reveal

---

## Data Shape (from Nexuscore API)

The presentation expects a single JSON object at load time. Shape reference:

```ts
interface WrappedData {
  thorny_id: number
  username: string

  playtime: {
    total_seconds: number
    highest_day: string          // ISO date
    highest_day_seconds: number
    most_active_hour: number     // 0–23
    most_active_hour_sessions: number
    most_active_hour_seconds: number
  }

  quests: {
    total_accepted: number
    total_completed: number
    total_failed: number
    completion_rate: number
    fastest_quest_title: string
    fastest_quest_start_time: string
    fastest_quest_completion_time: string
    fastest_quest_duration_seconds: number
  }

  rewards: {
    total_rewards: number
    total_balance_earned: number
    total_items_earned: number
    unique_items: number
  }

  interactions: {
    blocks_placed: number
    blocks_mined: number
    net_difference: number
    player_type: string          // "Creator" | "Destroyer" | "Balanced Builder"
    arch_nemesis: string         // mob name
    death_count: number
    kill_counts: { mob_type: string; kill_count: number }[]
    block_timeline: {
      category: string           // "placed" | "mined"
      month_name: string
      month_number: number
      favorite_block: string
      count: number
    }[]
  }

  projects: {
    favourite_project_name: string
    favourite_project_blocks_placed: number
    most_active_project_name: string
    most_active_project_total_activity: number
  }

  grind_day: {
    grind_date: string
    sessions: number
    hours_played: number
    first_login: string
    last_logout: string
    blocks: number
    blocks_placed: number
    blocks_mined: number
    mob_kills: number
    interactions: number
    quests_completed: number
    total_combined_actions: number
  }

  social: {
    favourite_people: {
      other_player_id: number
      username: string
      seconds_played_together: number
    }[]
  }
}
```

---

## Awards Overview

The presentation is structured as an awards show. Each "award" is a slide. The full show builds toward the **Final Accolade** — a generated title that defines this player's identity on Everthorn in 2026.

| Slide | Name | Driven By |
|---|---|---|
| 0 | Cold Open | Static / username |
| 1 | The Accolade Tease | Static intro to the concept |
| ... | Awards (TBD as spec grows) | Various data fields |
| Last | The Final Accolade | Composite of all awards |

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
| Spotlights | Sweep from off-screen L/R → settle centre. CSS `@keyframes` translate + opacity. Subtle flicker (opacity pulse) on landing. |
| Marquee block | `opacity: 0 → 1` + `translateY(12px → 0)` after spotlights land. 600ms ease-out. |
| `[Username]` | Delayed 300ms after rest of marquee. Slightly larger scale on entry. |
| Host text | Typewriter — characters revealed one at a time with `setTimeout` or a character-reveal component. ~40ms per word. |
| "Welcome to your night." | Fades in after host text completes. Bold. Slight scale up (1.0 → 1.04) on appear. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Spotlights land | Soft double-pulse — like a gavel. `[80ms, 40ms, 80ms]` |
| `[Username]` appears | Single sharp tap — the personal moment. `[120ms]` |
| "Welcome to your night." | Gentle rolling rumble — distant applause. `[30ms, 20ms, 30ms, 20ms, 30ms]` |

### No confetti on this slide. Confetti is earned.

---
