# Slide 3 — The Ritual

### Purpose
The Chapter told us *when*. The Ritual tells us *what they always came back to* — the habit that showed up month after month without fail. Not the biggest stat. The most *reliable* one.

First slide with a quieter, more sincere tone. No punchline. Just recognition.

---

### Data Required

Determined by a **three-tier priority check** — evaluate in order, use first tier that yields a clear result:

**Tier 1 — Project** *(most meaningful)*
- Find the project present in the most distinct months of activity for this player
- Threshold: must appear in at least half of the player's active months
- Output: `ritual_type = "project"`, `ritual_name`, `ritual_months`, `ritual_block` (optional top block)

> ⚠️ **Note for data layer:** Project activity needs to be queryable per player per month.

**Tier 2 — Ritual Block** *(fallback)*
- `SELECT block_type, COUNT(DISTINCT DATE_TRUNC('month', timestamp)) AS months_present FROM events.interactions WHERE player_id = ? AND action = 'placed' GROUP BY block_type ORDER BY months_present DESC LIMIT 1`
- Output: `ritual_type = "block"`, `ritual_name`, `ritual_months`

**Tier 3 — Ritual Behaviour** *(fallback)*
- For each behaviour (building, combat, questing), count distinct months with any activity. Take highest.
- Output: `ritual_type = "behaviour"`, `ritual_name = "building" | "combat" | "questing"`, `ritual_months`

Also needed: `total_active_months` from `events.sessions_view`.

---

### Sequence

**Beat 1 — Host intro (typewriter)**
```
"Some things don't need a reason.
They just happen. Every month. Without fail."

"The Academy calls this a ritual."
```

---

**Beat 2 — The Reveal**

- **Tier 1 (Project):** Project name large gold serif. Below: *"A place you always returned to."* Optional ritual block icon beneath.
- **Tier 2 (Block):** Block icon large centred. Block name below in gold serif.
- **Tier 3 (Behaviour):** Category icon (pickaxe / sword / scroll). Behaviour label below in gold serif.

All tiers:
```
"Present in [N] of your [M] active months."
```

---

**Beat 3 — The Closer**

- Tier 1 → *"Whatever else changed — you always came back."*
- Tier 2 → *"Whatever you were building — it always started here."*
- Tier 3 → *"Whatever else happened — you always showed up."*

---

### Visuals
- Glow is cooler and softer than Slide 2 — candlelight, not sunrise. Slightly blue-shifted warm white.
- More breathing room — less density than Slide 2
- Supporting stat line is small and understated

### Animations
| Element | Animation |
|---|---|
| Host intro | Typewriter, ~40ms per word. Fades out after "ritual." |
| Centrepiece | `scale(0.92 → 1.0)` + `opacity`. 600ms ease-out. |
| Supporting glow | Expands slowly. 1000ms ease-out. |
| Supporting stat | Fades in 300ms after centrepiece. No translation. |
| Closer line | Fades in 500ms after stat. Italic. 800ms fade. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Centrepiece appears | Single soft pulse. `[100ms]` |
| Supporting stat appears | Near-silent tick. `[20ms]` |
| Closer line appears | Heartbeat double pulse. `[80ms, 600ms, 80ms]` |
