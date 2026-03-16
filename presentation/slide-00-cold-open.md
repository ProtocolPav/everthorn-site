# Slide 0 — The Cold Open

### Purpose
First impression. Establishes the awards show world. Makes it immediately personal by putting the player's username centre-stage before any stats appear.

---

### Visuals
- Background: `#0a0a0f` (full black stage)
- Two stage **spotlights** sweep in from off-screen left and right using conic-gradient `<div>` elements, crossing and settling centre-stage with a subtle flicker on arrival
- Once spotlights settle, the **marquee fades in** with a gentle upward drift:

```
EVERTHORN ROLLBACK '26
An Evening in Honour of — [Username]
```

- `[Username]` appears last, slightly delayed, slightly larger than the surrounding text — the reveal moment
- Below the marquee, the **host text types in** word by word:

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

---

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
