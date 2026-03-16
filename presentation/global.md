# Global Spec — Everthorn Rollback '26

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

The exact API contract is **to be decided**. The presentation will consume a single data object fetched once on load. Slide specs reference data fields by descriptive name (e.g. `username`, `arch_nemesis`, `fastest_quest_title`) — the precise shape, endpoint, and field names will be defined when the Nexuscore API route is built.
