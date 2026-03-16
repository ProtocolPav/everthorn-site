# Slide 5 — The Soundtrack

### Purpose
A palette cleanser after the combat energy of Slide 4. The show slows down, puts on a record, and gets personal in a different way. The only slide where the player leaves a physical mark.

---

### Data Required

**Most-played disc:**
- Source: `events.interactions` — filter by jukebox disc play events (TBD exact `action` value and disc identifier field)
- Query: find the music disc triggered most frequently for this player across the year
- Output: `disc_name`, `disc_play_count`, `is_assigned: false`

> ⚠️ **Note for data layer:** Confirm exact `action` value and disc type field for jukebox interactions in `events.interactions`.

**No disc data — assigned variant:**
- If no jukebox interactions exist for this player, assign a disc deterministically:
  - `disc = DISC_LIST[hash(player_id) % DISC_LIST.length]`
  - Evaluated server-side so the same player always receives the same disc
  - Frontend receives `disc_name` and `is_assigned: true`
  - No play count needed for the assigned variant

> ⚠️ **Note for data layer:** `DISC_LIST` should be defined server-side as the full list of vanilla Minecraft music discs. Confirm which discs are available/obtainable on the server and restrict the pool accordingly.

**Liner note stats** (both variants):
- Total active months — from `events.sessions_view`
- Total blocks placed — `SUM` from `events.interactions` where `action = 'placed'`
- Total quests completed — `COUNT` from quest completion events

---

### Sequence

**Beat 1 — Host intro (typewriter)**

*Standard (disc found):*
```
"Every great evening needs a soundtrack."

"The Academy consulted the jukebox."
```

*Assigned (no disc data):*
```
"Every great evening needs a soundtrack."

"The Academy consulted the jukebox."

"The jukebox had no record of you."

[pause]

"The Academy selected one on your behalf."
```

---

**Beat 2 — The Jukebox Animation**

A jukebox block sprite appears centre screen. The music disc item floats in from above, hovers briefly, then drops into the slot with a click.

After the disc lands, small musical note characters (`♪`) drift upward from the jukebox in a loop.

---

**Beat 3 — The Disc Reveal**

Disc name fades in below the jukebox in gold serif:
```
[Disc Name]
```

*Standard host line:*
```
"This one played in your world more than any other."
```

*Assigned host line:*
```
"The Academy felt this one suited you."
```

Conditional personality line based on disc identity (applies to both variants — the Academy picked with intention either way):

> ⚠️ **TEMPORARY — disc-conditional lines need finalising once the full available disc list is confirmed.**

- Common/upbeat disc (e.g. *Cat*, *Blocks*) → *"The Academy approves of the energy."*
- Eerie/ambient disc (e.g. *11*, *13*) → *"The Academy reviewed this choice at length. It has questions."*
- Rare disc (e.g. *Otherside*, *Pigstep*) → *"Rare taste. The Academy took note."*
- Default fallback → *"The Academy has taste. Apparently, so do you."*

---

**Beat 4 — The Liner Notes**

A small prompt fades in below the disc name:
```
"read the liner notes"
```

Small caps, muted warm grey, gently pulsing opacity. Player taps it.

The disc performs a **3D card flip** (`rotateY 0° → 180°`) revealing the back — a cream liner note card:

```
EVERTHORN ROLLBACK '26
————————————————————————

[Liner note — generated from stats]

e.g. "Recorded across 8 months. 14,302 blocks placed.
      22 quests completed.
      No regrets were reported to the Academy."


_______________________
                              sign here
```

*Assigned variant footnote — small grey text at the bottom of the card:*
```
* selected by the Academy on your behalf
```

---

**Beat 5 — The Signature**

Player draws on the signature line with finger or mouse.

- Desktop: mouse drag draws
- Mobile: touch draw
- Ink colour: dark (`#1a1a1a`) on cream card
- Signature canvas: transparent `<canvas>` overlay constrained to the signature line area
- No "done" button — the closer triggers automatically when the player **lifts their finger or releases the mouse** after drawing at least a minimal stroke

After release:

```
"The Academy has your statement on record."
```

Host closer fades in beneath the signature. Quiet. Final. No wax seal, no fanfare.

---

### Visuals
- Jukebox: Minecraft block sprite, ~120px, centred
- Disc item: smaller sprite, floats from `translateY(-60px)`, drops into slot
- Musical notes: `♪` characters, cream, drift upward with random `translateY` + `opacity` fade. Loop while disc "plays".
- Liner note card: cream (`#f5f0e8`) background, dark serif text, rounded corners, subtle drop shadow
- Card flip: `rotateY` on card container. Front = disc face. Back = liner note. `backface-visibility: hidden` on both faces.
- Signature canvas: transparent overlay on the liner note, constrained to signature line area

### Animations
| Element | Animation |
|---|---|
| Host intro | Typewriter, ~40ms per word |
| Jukebox | Fades in with `scale(0.9 → 1.0)`. 400ms ease-out. |
| Disc float-in | `translateY(-60px → slot)`. 600ms, slight deceleration on land. |
| Disc lands | Brief `scale(1.0 → 1.05 → 1.0)` squash on jukebox. 200ms. |
| Musical notes | Staggered upward drift, random offsets, `opacity: 1 → 0` over 1.5s. Loop. |
| Disc name | Fades in 500ms after disc lands. |
| Host line | Typewriter after disc name. |
| "read the liner notes" prompt | Fades in last. Gentle opacity pulse. |
| Card flip | `rotateY(0° → 180°)` on tap. 500ms ease-in-out. |
| Closer line | Fades in after mouse/finger release on signature. 600ms. Italic. |

### Haptics (`haptic-web`)
| Trigger | Pattern |
|---|---|
| Disc lands in jukebox | Click-thud. `[60ms, 20ms, 40ms]` |
| "read the liner notes" tap | Single soft tick. `[30ms]` |
| Card flip lands (back side) | Paper-soft thud. `[50ms]` |
| Drawing signature | Very faint continuous tick while drawing. `[15ms]` repeating on stroke |
| Finger/mouse release after signing | Single clean tap — like a full stop. `[80ms]` |
