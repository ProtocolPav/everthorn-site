# 03 — Slides

Every slide follows the same structure: purpose, availability, data (payload paths from `05-backend.md` § Contract), beats (what's on stage, the camera mark, motion), and variants. Copy shown here is the **starting draft**; the canonical copy lives in `src/lib/rollback/copy.ts`.

Vocabulary (all defined in `02-design-system.md` § UI vocabulary): **Academy** = `<AcademyLine>`, **Title** = `<TitleText>` (+ subtitle), **Sign**, **Frame** = `<ItemFrame>`, **Tooltip**, **Hotbar**, **XP** = `<XpBar>`, **Toast** = `<AdvancementToast>`, **Prop** = an object on the pedestal. Camera marks: `wide`, `pedestal`, `wall`, `low`. Numbers always count up.

> **Sign copy limit:** 4 lines × 15 characters. Every Sign line below fits. Keep it that way in `copy.ts` (a unit test enforces it).

---

## Gates (before the show)

These are shown on the same stage with the curtains **closed** and only the footlights on. The text is Minecraft Seven on a Sign standing in front of the curtain.

| State | When | Content |
|---|---|---|
| **Invitation required** | Not logged in | Sign: `THE ACADEMY / REQUIRES AN / INVITATION.` plus a Minecraft-style button underneath (gray stone button texture, white text, hover → blue-ish highlight like in-game menus): "Sign in with Discord" |
| **Not on the guest list** | No Everthorn member | Sign: `NO RECORD OF / YOU. PERHAPS / NEXT YEAR.` + button "Back to Everthorn" |
| **No season data** | Member with no sessions in the window | Sign: `THE ACADEMY / SEARCHED 2026. / YOU WEREN'T IN / IT. SEE YOU '27` |
| **Doors not open** | Before `published_at` (and not a CM) | Sign: `THE CEREMONY / BEGINS IN` + a countdown below in Minecraft Ten (`12d 04h 31m`) whose digits flip with a vertical roll |
| **Error** | Fetch failed | Sign: `TECHNICAL / DIFFICULTIES / BACKSTAGE.` + button "Try again" |

### Loading

The stage is fully dark. One footlight flickers on and off slowly (a breathing glow), with `THE ACADEMY IS TAKING ITS SEAT` below in gray Minecraft Seven. It lasts at least 800ms and waits for fonts, textures and sprites (4s cap). Then slide 0 begins **from that same darkness**, so loading flows straight into the cold open.

---

## Slide 0 — The Cold Open

**Purpose:** build the world, make it personal, and introduce the rewind. **Availability:** always.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Rewind | `wide` | Still dark. Month names scrub backwards in **Title** text, `DECEMBER → … → JANUARY`, each flashing for about 70ms at the start and slowing to about 220ms by February. Two thin horizontal "tracking" lines (VHS rewind) roll over the screen. `JANUARY` holds, then fades with the `/title` fade-out. Reduced motion: skip. Haptic `tick` per month in the slow phase. |
| 1 · Lights | `wide` | The footlights switch on **one by one, left to right** (each 0.12s apart: glow opacity 0 → 1 with a single flicker), then the three lanterns light. Haptic `tick` per footlight. |
| 2 · Curtains | `wide` | The curtains open: each curtain's 4 strips slide outward with `stagger.tight` and bunch up at the screen edges, ending partly off-screen (`ease.inOut`, 1.4s). The camera eases in very slightly at the same time. The empty stage and pedestal are revealed under the spotlight. Haptic `gavel` when the curtains settle. |
| 3 · Marquee | `wide` | **Title** `EVERTHORN ROLLBACK '26` (white), subtitle `An evening in honour of`, then the player's **gamertag** drops onto the pedestal **as a floating nametag** (white Minecraft Seven on a translucent black box, like a player's name above their head), with landing dust. Haptic `land`. |
| 4 · Host | `wide` | Academy: *"After careful deliberation by our panel of judges — and by panel, we mean a database — the results are in."* Then **Title** (gold): `WELCOME TO YOUR NIGHT`. Then the Nudge `tap to begin` (this beat waits for input; the tap also unlocks haptics). |

**Short-show variant (deck < 8 slides):** beat 4's Academy line becomes *"The Academy has prepared a shorter programme this evening. It is, frankly, a relief."*

---

## Slide 1 — The Candidates

**Purpose:** six totems are paraded; one of them is theirs. **Availability:** always.
**Data:** `season.totems[]`, `season.player_count`, `player.totem.hint_line`.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `pedestal` | Academy: *"Each year, the Academy awards one totem to every player. Not for a single moment — for the shape of the whole year."* / *"Tonight, {player_count} players receive theirs."* |
| 1 · Parade | `wide` | **Six small quartz pedestals** rise out of the stage floor in a gentle arc (`scaleY 0 → 1`, `stagger.base`, `spring.drop`). A Carved totem drops onto each with landing dust. Then the spotlight **sweeps** across them left to right and back, decelerating over about 3s (one motion value drives the spotlight's x; on each totem it passes, that totem brightens and a **Tooltip** with its name pops above it, then hides as the light moves on). Haptic `tick` per pass in the slow phase. |
| 2 · Hint | `wide` | The spotlight settles in the middle, between totems. Academy: the player's `hint_line`. |
| 3 · Silhouette | `pedestal` | The six totems **sink** back into their pedestals, which sink into the floor. On the centre pedestal, a **silhouetted totem** drops in (solid `#141418`, a 1px white pixel rim) with a nametag reading `?`. Academy: *"One of these belongs to {gamertag}. The Academy has decided."* Haptic `thud`. |

The silhouette comes back in slide 12 in exactly the same place.

---

## Slide 2 — The Chapter

**Purpose:** the month that defined their year. **Availability:** `chapter != null`.
**Data:** `chapter.month`, `chapter.behaviour`, `chapter.headline_value`, `chapter.hours`, `chapter.sessions`, `chapter.peak_day`, `chapter.peak_day_value`.

**Logic (backend):** the dominant behaviour is the player's highest percentile dimension (the totem scores). The peak month is the month with the highest value of it. With no signal, the behaviour is `playtime` and the month with the most hours wins.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `pedestal` | Academy: *"Every player has a chapter. A month where everything aligned."* / *"Yours was written in…"* (the ellipsis holds 0.8s) |
| 1 · Reveal | `pedestal` | A **calendar-page prop** (a paper-textured block with the month number) drops onto the pedestal, then **Title** `{MONTH}` (gold) with subtitle `2026`. Haptic `thud`. |
| 2 · Evidence | `wide` | **Three Signs** pop up across the front of the stage, left to right (`stagger.base`), e.g. `4,821 BLOCKS / PLACED` · `38 HOURS / THAT MONTH` · `BEST DAY: / 14 MARCH`. A **Frame** on the back wall shows the behaviour's item (building → bricks, combat → iron sword, questing → book, social → campfire, playtime → clock). Haptic `tick` per sign. |
| 3 · Closer | `wide` | Academy: *"This is when the Academy started watching."* |

Headline sign text by behaviour: building → `BLOCKS / PLACED`, combat → `MOBS / DEFEATED`, questing → `QUESTS / COMPLETED`, social → `HOURS WITH / COMPANY`, playtime → `HOURS ON / EVERTHORN` (and sign 2 becomes `{n} SESSIONS`).

---

## Slide 3 — The Ritual

**Purpose:** what they always came back to. Sincere, with no punchline. **Availability:** `ritual != null && ritual.months >= 2`.
**Data:** `ritual.type` (`project` | `block` | `behaviour`), `ritual.name`, `ritual.reference`, `ritual.months`, `ritual.active_months`, `ritual.month_flags[12]`.

Tiers (picked by the backend): project → block → behaviour (see `05-backend.md`).

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `pedestal` | Academy (slower, 0.065s word stagger): *"Some things don't need a reason. They just happen. Every month. Without fail."* / *"The Academy calls this a ritual."* Footlights dim to 70%. |
| 1 · Centrepiece | `pedestal` | **Block:** that block (a real textured cube) slowly lowers onto the pedestal, not dropped but placed with care (`ease.dramatic`, 1.2s). **Project:** a banner on the back wall unrolls (`scaleY 0 → 1`, origin top) carrying the project name, while the camera goes to `wall`. **Behaviour:** a tool prop (pickaxe / sword / book). Then **Title** `{name}` (white, not gold, since this is sincere). Haptic `heartbeat`. |
| 2 · Count | `wide` | Along the front lip of the stage, **12 footlights' worth of small month markers** (12 tiny blocks); the ritual months light up gold in calendar order (`stagger.tight`), the others stay dark. Sign: `{months} OF {active} / ACTIVE MONTHS`. |
| 3 · Closer | `wide` | Academy: project → *"Whatever else changed — you always came back."* · block → *"Whatever you were building — it always started here."* · behaviour → *"Whatever else happened — you always showed up."* Footlights return to 100%. |

---

## Slide 4 — The Nemesis Accord

**Purpose:** re-energise with a quiz, then the verdict on who killed them most. **Availability:** always; **standard** if `nemesis != null`, else **flawless**.
**Data:** `nemesis.*` (`reference`, `kind`, `display_name`, `deaths`, `kills_against`, `decoys[]`), `totals.hours`.

**Standard**

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `wide` | Academy: *"The Academy reviewed your combat record. There were… highlights."* / *"Three suspects have been identified."* |
| 1 · Line-up | `wide` | **Three pedestals** rise; on each a suspect drops in: a mob **head block** (a cube with the mob face texture) or a **player head** for a player nemesis. Order is a deterministic shuffle by thorny_id. A nametag above each one. Academy: *"Which one gave you the most trouble?"* Pressing a suspect lifts it 2px and outlines it with the white hotbar-selector border. **Waits for a tap.** Haptic `land` per suspect. |
| 2 · Reveal | `low` | 1s of tension: the spotlight flickers between the three. **Correct:** the spotlight lands on the chosen one, which rises and spins 360°, and the others sink. Toast: `Advancement Made! / Know Thy Enemy`. Academy: *"The Academy is not surprised you knew."* Haptic `applause`. **Wrong:** the chosen one shakes (x ±2px, 3 cycles) and sinks; the spotlight swings to the real nemesis. Academy: *"Interesting choice. The Academy notes your denial."* Haptic `error`. |
| 3 · Verdict | `low` → `pedestal` | The nemesis moves to the centre pedestal. **Title** `{display_name}` (gold). Two Signs: `{deaths} DEATHS` · `{kills} KILLS`. Academy verdict: deaths ≥ 2× kills → *"The Academy has classified this as an ongoing conflict."* · within 2× → *"Evenly matched. The Academy respects the rivalry."* · kills ≥ 2× deaths → *"You won. The Academy acknowledges this. The nemesis does not."* |

**Flawless (no qualifying deaths):** no line-up. The footlights dim to 40% and the camera stays `wide` on an empty stage. Academy: *"The Academy reviewed your death record."* → 1.5s of silence → **Title** `THERE ISN'T ONE` (white) → Academy: *"{hours} hours on Everthorn. Not once."* → *"The Academy has reviewed many records. It has no further comment on this one."* Haptic `[200]` on the title. The empty stage *is* the fanfare.

---

## Slide 5 — The Soundtrack

**Purpose:** a palette cleanser. A record plays, and the player signs the liner notes. **Availability:** always; **standard** if `soundtrack.is_assigned == false`, else **assigned**.
**Data:** `soundtrack.disc`, `display_name`, `plays`, `is_assigned`, `flavour`; `totals.active_months`, `blocks_placed`, `quests_completed`.

> Jukebox data **must be confirmed** in Phase 0. The assigned disc is chosen server-side by a stable hash. **No audio plays.**

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `pedestal` | Academy: *"Every great evening needs a soundtrack. The Academy consulted the jukebox."* Assigned adds: *"The jukebox had no record of you."* / *"The Academy selected one on your behalf."* |
| 1 · Jukebox | `pedestal` | A **jukebox block** drops onto the pedestal. The **disc item** floats down from above and slots in (0.7s, `ease.out`), and the jukebox squashes once. Pixel music notes (the in-game note particle shape, in varying colours) float up from it in a loop. Haptic `land`. |
| 2 · Title | `pedestal` | **Title** `{display_name}` (gold). Standard subtitle: `Played {plays} times in your world`. Assigned subtitle: `Selected by the Academy`. Academy: the flavour line (upbeat / eerie / rare / default, in `copy.ts`). |
| 3 · Liner notes | `pedestal` → close | Nudge `tap to read the liner notes` (waits). On tap, the disc lifts out and **flips** (`rotateY 0 → 180°`, 0.6s) into a **book-and-quill page** (paper texture, Minecraft Seven, dark text) that fills the frame: `EVERTHORN ROLLBACK '26` / *"Recorded across {active_months} months. {blocks_placed} blocks placed. {quests_completed} quests completed. No regrets were reported to the Academy."* (clauses with 0 omitted), and a `Sign here: ______` line at the bottom. Assigned footnote in dark gray: `* selected by the Academy on your behalf`. |
| 4 · Signature | close | The player draws on the signature line (canvas, pointer events, ink `#2b1d14`). **The ink is pixelated:** strokes are snapped to a 2px grid so it looks hand-drawn in Minecraft. On release after at least 40px of total stroke: Academy *"The Academy has your statement on record."* A small gray `skip` button is available. The signature is not stored. Haptic `tap` on release. |

---

## Slide 6 — The Handshake

**Purpose:** "Best Supporting Player". **Availability:** `costar != null && costar.hours_together >= 1`.
**Data:** `costar.gamertag`, `hours_together`, `first_together`; `social.distinct_players`, `social.share_with_company`.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `wide` | Academy: *"No one gets through a year alone. The Academy would like to recognise your co-star."* |
| 1 · Two chairs | `wide` | **Two stair blocks** (as seats) drop onto the stage side by side. The player's nametag floats above the left one. Above the right one, a nametag that reads `???`. |
| 2 · Reveal | `pedestal` | The `???` nametag **glitches** (3 quick character swaps) and resolves to **{costar.gamertag}**, with their player head dropping onto the right seat. **Title** `BEST SUPPORTING PLAYER` (gold), subtitle `{costar.gamertag}`. Haptic `gavel`. |
| 3 · Evidence | `wide` | Signs: `{hours} HOURS / TOGETHER` · `SINCE / {3 JAN}`. Toast: `Advancement Made! / Crossed paths with {distinct_players} players`. |
| 4 · Closer | `wide` | share_with_company ≥ 0.6 → *"You rarely played alone. The Academy finds this deeply reassuring."* · else → *"You kept good company — when you kept any at all."* |

---

## Slide 7 — The Heartbreak

**Purpose:** the one that got away, gently. **Availability:** always; **standard** if `heartbreak != null`, else **unbroken**.
**Data:** `heartbreak.quest_title`, `objectives_done`, `objectives_total`, `failed_on`.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `pedestal` | Footlights dim to 40%. Academy (slow): *"Not every story has a happy ending. The Academy found one that got away."* |
| 1 · Reveal | `pedestal` | A **written book** prop lowers onto the pedestal. **Title** `{quest_title}` (white), subtitle `Failed on {date}`. Over 1.5s the book's brightness drops to 0.6. It fades like a memory. Haptic `heartbeat`. |
| 2 · So close | `pedestal` | An **XP bar** fills to `done/total`… and stops short, with a small backward sag. The level number above it reads `{done}/{total}`. |
| 3 · Closer | `pedestal` | done/total ≥ 0.75 → *"So close. The Academy felt that one too."* · else → *"The Academy believes in second chances. Conveniently, there's a slide about that."* Footlights return to 100% on exit. |

**Unbroken:** footlights at 40%. Academy: *"The Academy looked for a heartbreak."* → **Title** `IT FOUND NONE` → if quests were completed, a full XP bar `{n}/{n}` and *"Every promise kept."*; with no quests at all, *"Then again, you never made it any promises."*

---

## Slide 8 — The Companion Medal

**Purpose:** the item always in their hand. **Availability:** `companion != null`.
**Data:** `companion.item`, `display_name`, `uses`, `top_action`.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `pedestal` | Academy: *"Some companions don't talk back. The Academy wishes to honour one of them."* |
| 1 · Frame | `wall` | A **gold-bordered item frame** (a variant frame with a gold rim) fades in on the back wall, and the item drops into it with the 45° click rotation, then does a slow full turn. Haptic `land`. |
| 2 · Tooltip | `wall` | A **Tooltip** pops beside the frame: title line `{display_name}` in gold, then gray lines `The Companion Medal` · `By your side for {uses} {verb}` (verb by top_action: mine → swings, place → placements, kill → battles, use → uses). |
| 3 · Closer | `wall` → `wide` | Academy: *"It never once asked for a break. The Academy suggests you give it a name."* |

---

## Slide 9 — The Ghost

**Purpose:** playful. When they haunted the server. **Availability:** `ghost != null`.
**Data:** `ghost.hour_histogram[24]`, `persona`, `latest_session_end`, `ghost_sessions`.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `wide` | Academy: *"The Academy kept track of when you appeared."* |
| 1 · Day cycle | `wide` | **The sky behind the stage** (above the back wall, normally black) runs **one full day–night cycle** in 2.4s: a pixel sun rises, crosses and sets, and a pixel moon follows. At the same time, a row of **24 small blocks** along the front lip rises to a height proportional to the minutes in each hour, in clock order, like a skyline of their day. |
| 2 · Persona | `pedestal` | The cycle stops on the persona's time of day (moon for night owl, sunrise for early bird, high sun for afternoon, sunset for evening). **Title**: `THE NIGHT OWL` / `THE EARLY BIRD` / `THE AFTERNOON REGULAR` / `THE EVENING HEADLINER`. Academy: night owl → *"Your latest night ended at {time}. The Academy was asleep. Mostly."* · early bird → *"You were here before the sun. The Academy was not."* · afternoon → *"Reliable, civilised hours. The Academy approves."* · evening → *"Prime time. You always did know how to make an entrance."* |
| 3 · Ghost sessions | `wide` | Only if `ghost_sessions >= 3`: a translucent white pixel ghost (an original sprite) drifts across the stage (sine bob, 2.5s, opacity 0.6). Toast: `Advancement Made! / Ghost Sessions: {n}`. Academy: *"{n} times you logged in for less than two minutes. The Academy has questions. It will not be asking them."* |

---

## Slide 10 — The Second Wind

**Purpose:** triumph. They left, and they came back. **Availability:** `comeback != null` (largest gap ≥ 14 days, with play afterwards).
**Data:** `comeback.gap_days`, `left_on`, `returned_on`, `hours_after`.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `pedestal` | Academy: *"Everyone needs a break. Yours lasted…"* |
| 1 · Gap | `wide` | **Title** `{gap_days} DAYS`. Along the front of the stage, a **minecart rail** runs left to right (the rail texture tiles in as it draws). There's a visible missing section in the middle: the gap. A minecart rolls along it and stops at the gap. |
| 2 · Return | `wide` | The missing rails **place themselves** one by one (drop + dust, `stagger.tight`), and the minecart continues across and off-stage. Academy: *"And then, on {returned_on}, you came back."* Haptic `thud`. |
| 3 · Evidence | `wide` | Sign: `{hours_after} HOURS / IN YOUR FIRST / MONTH BACK`. |
| 4 · Closer | `wide` | Academy: *"The Academy never doubted you. (The Academy doubted you a little.)"* |

---

## Slide 11 — The Unstoppable Force

**Purpose:** the peak. All the big numbers at once. **Availability:** always.
**Data:** `totals.*`, `percentiles.hours`.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `wide` | Academy: *"The Academy has saved the numbers for last. Brace yourself."* |
| 1 · Hours | `pedestal` | A **clock** item rises on the pedestal. **Title** `{hours} HOURS` (gold, counting up over 1.6s), subtitle `on Everthorn`. If `percentiles.hours >= 0.5`, an **XP bar** fills to the percentile with the level text `MORE THAN {pct}% OF THE SERVER`. Haptic `thud`. |
| 2 · The hotbar | `wide` | A full-size **Hotbar** slides up from the bottom of the screen (`spring.snappy`). Slot by slot (`stagger.base`), items drop in with their **stack counts counting up**: bricks (blocks placed), pickaxe (blocks mined), sword (mobs killed), map (chunks explored), book (quests completed), clock (longest session, `7h`). Only non-zero stats get a slot; empty slots stay empty. The selector moves across each slot as it fills, and a **Tooltip** above names the stat (`Blocks Placed`, `48,211`). Haptic `tick` per slot. |
| 3 · Closer | `wide` | pct ≥ 0.9 → *"The Academy has run out of adjectives."* · ≥ 0.5 → *"A force of nature. The Academy has seen it with its own eyes."* · else → *"Quality over quantity. The Academy respects a focused year."* |

---

## Slide 12 — The Final Accolade

**Purpose:** the verdict. Their totem is revealed and promised in-game. **Availability:** always.
**Data:** `player.totem.*`, `player.claim.status`.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Host | `pedestal` | The footlights go out one by one, right to left, and the lanterns dim. Only the spotlight remains. Academy: *"The Academy has reviewed the evidence. All of it."* / *"It is ready to deliver its verdict."* |
| 1 · Silhouette | `pedestal` | The silhouetted totem from slide 1 lowers onto the pedestal with its `?` nametag. 1.2s of silence (no auto-advance before that). Haptic `thud`. |
| 2 · **The pop** | `low` | **The Totem of Undying activation, recreated.** The silhouette shudders (x ±1px, 0.3s) → a white flash fills the screen (opacity 0 → 0.85 → 0, 0.5s) → the **totem texture rushes at the camera** (scale 1 → 5, slight rotation wobble, 0.5s, `ease.out`), holds for a beat filling the view, then settles back onto the pedestal at ×12 with `spring.heavy` → a ring of square totem particles (totem palette + `#f5e06b` + `#9be23c`) bursts outward and drifts down → **confetti** (square). The footlights snap back on **in the totem's colour**, all at once. Haptic `applause`. This is the most important two seconds of the show; iterate until it feels incredible. |
| 3 · Name | `pedestal` | **Title** `{name}` in the totem's light colour, subtitle `{TIER}` (gray). |
| 4 · Tooltip | `pedestal` | The full in-game **Tooltip** appears next to the totem: title line in the totem colour, the tier line (gray), the flavour tooltip (gray), and `Everthorn Rollback '26` (dark gray). Academy: the archetype line (*"Awarded to those who leave the world more built than they found it."*). Undying tier: the enchant glint sweeps over the totem every 3s. |
| 5 · Delivery | `pedestal` | Toast: `Item Received! / {name}`. Academy: pending → *"Your totem is waiting for you in-game. Log in to Everthorn to claim it."* · claimed → *"Already in your inventory. The Academy saw you pick it up."* |

---

## Slide 13 — The Credits

**Purpose:** afterglow: everyone who made the year, then a card to share. **Availability:** always.
**Data:** `season.credits[]`, the player's summary.

| Beat | Camera | On stage & motion |
|---|---|---|
| 0 · Credits roll | `wide` | The camera tilts up past the back wall into the dark sky, and the credits roll upward in Minecraft Seven, like the End Poem credits: `STARRING` → the player's gamertag (gold) → `WITH` → every other gamertag in two columns → `AND THE ACADEMY, WHO SAW EVERYTHING.` Constant ~40px/s, fade masks at the top and bottom. A tap fast-forwards. |
| 1 · Curtain call | `wide` | The camera tilts back down. The player's totem is on the pedestal in the spotlight. The **curtains close** (the reverse of the opening). |
| 2 · Share card | — | The **share card** rises in front of the closed curtains (`spring.soft`), then its parts reveal in sequence (`stagger.base`): totem, nametag, title, stats, footer. See the card spec below. |
| 3 · Actions | — | Minecraft-style menu buttons: **Save image** and **Share** side by side (`html-to-image` → a PNG at 1080×1920; `navigator.share` with the file where supported), then **Watch again** (back to slide 0, beat 1, skipping the rewind). |

### The share card

A 9:16 poster built to be screenshotted and posted (Instagram story, Discord). The reference is the S13 artboard on the canvas.

- **Frame:** a dark-oak-plank border (`dark_oak_planks`) with a glowstone block at each corner and a hard black outline.
- **Background:** deepslate bricks, darkened, with a large radial glow in the **totem's colour** behind the totem and slowly rotating **pixel light rays** (a `repeating-conic-gradient` with hard stops, masked to fade out, a 40s rotation). The rays are frozen in the exported image.
- **Header:** `EVERTHORN` in gray Minecraft Seven, then **`ROLLBACK '26`** in Minecraft Ten whose letters are **filled with the glowstone texture** (`background-clip: text`) with a hard drop shadow, like the Minecraft logo.
- **Hero:** the totem at ×8 (128px), gently bobbing, with twinkling square sparkles around it.
- **Identity:** a nametag with the player's head and gamertag; then the totem name in Minecraft Ten in the totem's colour; the tier between two gold bars (`— GILDED —`); and the one-line flavour tooltip in gray.
- **Stats:** a 2×2 grid of item frames, each with an icon and two lines: hours (clock), chapter month (written book), nemesis (mob head) or "Flawless" (totem of the archetype), and co-star (player head) or ritual (block). Uppercase white value plus gray label.
- **Footer strip:** `everthorn.net` on the left. On the right, **all six totems as tiny icons, with the player's one lit and outlined** and the others grayed out. It makes people compare and ask "which did you get?".
- Never shows rankings or anyone else's stats beyond the co-star's gamertag.

The share card contains only the player's own data plus the co-star's gamertag. No public URL is ever created.
