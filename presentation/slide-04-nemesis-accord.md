# Slide 4 — The Nemesis Accord

### Purpose
Re-energises the show after the sincerity of The Ritual. The Academy has reviewed the player's death record and has *thoughts*. The only slide with an interactive element — a nominations quiz before the verdict is read.

---

### Data Required

**Death source inclusion rules:**
- Include mob deaths: `cause LIKE 'minecraft:%' OR cause LIKE 'amethyst:%'`
- Include player deaths: `cause` matches a known gamertag in the players table
- Exclude all other causes (fall damage, fire, drowning, void) — silently filtered, not mentioned

> ⚠️ **Note for data layer:** Player death attribution requires a join against the players table on `cause = gamertag`. Display raw gamertag for player nemeses.

**Nemesis query:**
```sql
SELECT cause, COUNT(*) AS death_count
FROM events.interactions
WHERE player_id = ?
  AND action = 'die'
  AND (
    cause LIKE 'minecraft:%'
    OR cause LIKE 'amethyst:%'
    OR cause IN (SELECT gamertag FROM players)
  )
GROUP BY cause
ORDER BY death_count DESC
LIMIT 3
```
Top result = nemesis. 2nd and 3rd = quiz decoys.

**K/D against the nemesis:**
- Deaths: `COUNT` of `action = 'die'` where `cause = nemesis`
- Kills: `COUNT` of `action = 'kill'` where `target = nemesis`

**Zero deaths check:** if query returns no rows, use the zero deaths variant.

**Zero deaths variant also needs:** total playtime hours from `events.sessions_view`.

> ⚠️ **Note for assets:** Mob face sprites needed for quiz icons — check Amethyst addon assets first. Player head rendering from gamertag needed for player nemeses.

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
- Mob nominees: face sprite
- Player nominees: rendered player head

Each drops in with a small bounce. Below:
```
"Which one gave you the most trouble?"
```

Player taps an icon → gold ring border appears on selection.

---

**Beat 3 — The Reveal**

1 second dramatic pause after tap. Then:

- **Correct:** tapped icon pulses gold, scales up. Others fade to `opacity: 0.2`.
  > *"The Academy is not surprised you knew."*

- **Wrong:** tapped icon shakes, fades. Correct icon glows in.
  > *"Interesting choice. The Academy notes your denial."*

---

**Beat 4 — The Verdict**

Nemesis icon stays centred. Name fades in below in gold serif. K/D breakdown:
```
[N] deaths  ·  [K] kills
```

Verdict one-liner:
- Deaths >> kills → *"The Academy has classified this as an ongoing conflict."*
- Deaths ≈ kills → *"Evenly matched. The Academy respects the rivalry."*
- Kills >> deaths → *"You won. The Academy acknowledges this. The nemesis does not."*

---

### Zero Deaths Variant

Skip quiz entirely. The Academy's conspicuous lack of fanfare *is* the fanfare.

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

All lines typewriter. No quiz, no K/D pills. Silence does the work.

---

### Animations
| Element | Animation |
|---|---|
| Host intro | Typewriter, ~40ms per word |
| Nomination icons | Staggered `translateY(-40px → 0)` + spring bounce. 200ms between each. |
| Tap selection | Gold ring border fades in. 150ms. |
| Reveal — correct | `scale(1.0 → 1.15)` + gold glow. Others `opacity → 0.2`. 400ms. |
| Reveal — wrong | `translateX` shake (±6px, 3 cycles, 300ms). Correct icon glow fades in. |
| Nemesis name | Fades in beneath icon after reveal. 400ms. |
| K/D pills | Staggered fade-up, same as Slide 2 pills. 150ms between each. |
| Verdict line | Fades in 400ms after K/D. Italic. |
| Zero deaths lines | Each line typewriter with manual pauses. No other animations. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Each nomination icon lands | Soft tick. `[40ms]` |
| Player taps an icon | Sharp tap. `[60ms]` |
| Correct reveal | Rolling crowd swell. `[30ms, 20ms, 40ms, 20ms, 50ms]` |
| Wrong reveal | Error thud. `[100ms, 30ms, 100ms]` |
| Verdict line appears | Single measured pulse. `[80ms]` |
| Zero deaths — "There isn't one." | Single deep slow pulse. `[200ms]` |
