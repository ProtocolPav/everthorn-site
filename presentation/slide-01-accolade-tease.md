# Slide 1 — The Accolade Tease

### Purpose
Before any awards are presented, the player is shown what is at stake tonight. All 6 accolades are paraded in front of them. One is theirs. They don't know which yet.

---

### Sequence

**Beat 1 — Host intro (typewriter)**

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

Once the carousel finishes cycling, a single personalised host line appears — a hint without a reveal:

> ⚠️ **TEMPORARY — placeholder lines until accolades are finalised and assignment logic is known.**

- High blocks placed → *"The Academy will say only this: the world looks different because of you."*
- High mob kills → *"The Academy noted your... enthusiasm."*
- High social (time with others) → *"The Academy was moved by what they found."*
- High quest completion → *"The Academy rarely sees this kind of dedication."*
- High deaths → *"The Academy admires persistence. Truly."*
- Low overall activity → *"The Academy appreciated the quiet ones."*

Once accolades are finalised, these lines should be tied directly to each accolade archetype.

---

**Beat 4 — The Blackout**

The carousel settles on a **silhouetted icon** — solid dark shape, no texture, surrounded by a cool silver-white glow.

Below it, no name. Just `?`

```
"One of these belongs to [Username]. The Academy has decided."
```

---

**Beat 5 — The Nudge**

```
"scroll to begin"
```

Muted warm grey, small caps, pulsing opacity. Only slide that explicitly prompts continuation.

---

### Animations
| Element | Animation |
|---|---|
| Host intro text | Typewriter, ~40ms per word. |
| Carousel spin-up | Icons animate in from right, accelerating for ~0.5s then holding fast speed for ~1s |
| Carousel deceleration | Eases out over ~3s using a custom cubic-bezier. |
| Coverflow effect | `motion` `rotateY` + `scale` + `opacity` on each icon relative to distance from centre |
| Gold glow | Radial gradient behind centred icon, `opacity` fades in/out as icon enters/leaves centre |
| Accolade name | `opacity: 0 → 1` when icon is centred, `0` otherwise. 200ms fade. |
| Silhouette settle | Icon fades to silhouette. Glow shifts gold → silver-white. |
| `?` label | Fades in after silhouette settles. |
| Host closer line | Typewriter, after `?` appears. |
| Scroll nudge | Fades in last. `opacity` pulse loop (1.0 → 0.4 → 1.0), 2s cycle. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Carousel spin-up | Rapid light taps, tightening in frequency. ~`[20ms]` repeating |
| Each icon passing centre (slow phase) | Single soft tick. `[30ms]` |
| Carousel settles on silhouette | Heavier thud. `[100ms, 50ms, 150ms]` |
| Host closer line appears | Single sharp tap. `[80ms]` |
