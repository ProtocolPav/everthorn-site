# Slide 2 — The Chapter

### Purpose
The first real award. Every player has a month that defined their year — not necessarily the highest playtime, but the one where their dominant behaviour peaked. This slide names that month and makes the case for why it mattered.

---

### Data Required

**Step 1 — Determine dominant behaviour type:**
- **Builder** — `events.interactions`: compare `SUM(blocks_placed)` vs `SUM(blocks_mined)` weighted by ratio.
- **Grinder** — quest completions joined from quests/events tables: `COUNT` of completed quests relative to total playtime.
- **Social** — `events.sessions_view`: proportion of total playtime where player's session overlaps with at least one other player.

**Step 2 — Find peak month:**
- Builder → `SELECT DATE_TRUNC('month', timestamp) AS month FROM events.interactions WHERE player_id = ? GROUP BY month ORDER BY SUM(blocks_placed) DESC LIMIT 1`
- Grinder → equivalent query on quest completion events, grouped by month
- Social → `events.sessions_view` overlapping sessions grouped by month, `ORDER BY SUM(overlap_seconds) DESC LIMIT 1`

**Step 3 — Build the stat trio for that month:**
- Dominant stat value that month
- Total hours played that month — `events.sessions_view` filtered to that month
- Peak day within the month — group by date, order by dominant stat DESC, take top 1

---

### Sequence

**Beat 1 — Host intro (typewriter)**
```
"Every player has a chapter.
A month where everything aligned."

"The Academy reviewed the full year."

"Yours was written in..."
```

Typewriter ends. Cursor blinks twice. Text fades out.

---

**Beat 2 — The Reveal**

```
[MONTH NAME]
[Month] [Year]
```

- Month name: large, gold, serif display font
- Subtitle: small, italic, cream
- Soft gold radial glow expands behind text

---

**Beat 3 — The Evidence Trio**

Three stat pills fade up one by one:
1. Dominant stat that month (e.g. *"4,821 blocks placed"*)
2. Total hours played (e.g. *"38 hours"*)
3. Peak day (e.g. *"Best day: 14 March"*)

Each pill: rounded, low-contrast border, icon left, value right. Staggered entry.

---

**Beat 4 — The Closer**
```
"This is when the Academy started watching."
```

---

### Animations
| Element | Animation |
|---|---|
| Host intro | Typewriter. Cursor blinks twice. Full block fades out before Beat 2. |
| Month name | Enters from `translateY(-30px)`, slight overshoot spring. 500ms. |
| Glow | Radial gradient scales `0 → full`. 800ms ease-out. |
| Stat pills | Staggered `opacity + translateY(16px → 0)`. 150ms between each. |
| Closer line | Fades in 400ms after last pill. Italic. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Month name lands | Thud + brief rumble. `[150ms, 60ms, 80ms]` |
| Each stat pill appears | Soft tick. `[40ms]` |
| Closer line appears | Gentle double pulse. `[60ms, 40ms, 60ms]` |
