# 02 — Design System & Motion

> Motion is the product. If you're unsure, slow it down slightly and make it smoother, not faster and busier.
> **Visual reference: the Claude Design canvas "Everthorn Rollback '26: Stage & Motion"** (link in `README.md`). Match its look and feel; this document is the precise spec behind it.

## The idea: a Minecraft stage

The whole show takes place on **one block-built theatre stage**, seen in 3D from the audience. There are no flat "slides", no cards and no generic UI. Everything the player sees is something that could exist in Minecraft: blocks on a stage, signs, item frames on the wall, floating title text, item tooltips, the hotbar, the XP bar, advancement toasts.

Slides don't replace the screen. They **bring props onto the stage and take them off again**, and the **camera** moves between a few marks. The set itself never disappears.

### The set

Built with CSS 3D (`perspective` + `transform-style: preserve-3d`), using **planes, not hundreds of cubes**, so it stays cheap. **The stage is full-bleed:** it always fills the full width of the screen (the framing of the Cold Open artboard on the canvas is the reference). There are no side pillars. The set is built wider than the viewport, so its edges are never visible, even when the camera is at `wide`.

| Part | Texture (`public/rollback/textures/`) | Build and notes |
|---|---|---|
| **Stage floor** | `dark_oak_planks.png` | One plane wider than the screen, tilted away from the camera, with slight darkening toward the back |
| **Front lip** | `dark_oak_log.png` | One vertical strip under the floor's front edge; gives the platform its thickness |
| **Footlights** | `glowstone.png` | 5 real cubes spread across the full width of the front edge. Each casts a warm radial glow upward (a pre-rendered gradient plane, opacity-animated). |
| **Back wall** | `deepslate_bricks.png` | Full-width plane behind everything; holds item frames and banners when slides need them |
| **Curtains** | `red_wool.png` | Two planes, each half the screen wide and split into 4 vertical strips. **Open:** the strips slide outward and bunch up (scaleX ≈ 0.45), ending **partly off the screen edges**, so only a sliver of red shows at each side and they never cover a prop. **Closed:** they meet in the middle. They open on the cold open and close at the end of the credits. |
| **Top beam** | `polished_blackstone.png` | Full-width beam across the top of the stage opening; the lanterns hang from it |
| **Lanterns** | `lantern.png` on `chain.png` | 3 hanging lanterns (sprite planes that always face the camera). Gentle sway (rotateZ ±2°, about 4–5s per loop, offset per lantern). |
| **Spotlight** | — (gradient) | One light cone from above (`mix-blend-mode: screen`). Moves to wherever the current prop is. The only light that ever moves. |
| **Pedestal** | `quartz_block_side.png`, `quartz_block_top.png` | One real cube, centre stage. Where each slide's hero prop sits. |
| **Audience** | — | A row of silhouetted heads along the bottom edge, plus a vignette |

### Textures: real Minecraft textures

- Every block, item, mob and UI texture is **the real vanilla Minecraft (Bedrock) texture**, taken from Mojang's official **`bedrock-samples`** resource pack (github.com/Mojang/bedrock-samples). The only original art is the 24 totems in `public/rollback/totems/` (they're new custom items, so they need their own textures).
- The textures the show uses are already extracted into **`public/rollback/textures/`** by `docs/rollback-26/assets/extract_vanilla_textures.py`. To add more, unzip a bedrock-samples release into `.tmp/` (already gitignored), add the file to the script's `copy` table, and run `python3 docs/rollback-26/assets/extract_vanilla_textures.py .tmp/resource_pack/textures public/rollback/textures`. **Never commit the whole pack**, only the files the show uses.
- **Mob and player heads** (`head_creeper.png`, `head_zombie.png`, `head_skeleton.png`, `head_spider.png`, `head_steve.png`) are the 8×8 front face cropped from each entity skin and upscaled to 16×16 (nearest neighbour). For a nemesis or co-star that isn't in the set, crop more the same way. For **player** heads, render the player's actual skin when available, falling back to Steve.
- **UI sprites** are real game UI too: `ui_hotbar_slot.png` (20×22, the hotbar and progress slots), `ui_hotbar_selected.png` (24×24, the selector), `ui_xp_empty.png` / `ui_xp_full.png` (13×5 tiles, the XP bar), and `item_frame_background.png` (the item frame's leather back, with an oak-plank border).
- Items currently included: `clock`, `diamond_sword`, `diamond_pickaxe`, `netherite_pickaxe`, `book`, `written_book`, `filled_map`, `brick`, `paper`, `compass`, `name_tag`, `campfire`, `minecart`, `lantern`, `item_frame`, `oak_sign`, `dark_oak_sign`, `music_disc_pigstep`; blocks `jukebox_side`, `jukebox_top`, `rail`, `oak_planks`, `stone_bricks`, `stripped_dark_oak_log`.
- Render everything with `image-rendering: pixelated` at integer scales (×2, ×3, ×4…).
- Mob faces, block and item sprites used *as data* (nemesis, ritual block, companion item, disc) come from a sprite map (`src/lib/rollback/sprites.ts`, Minecraft id → texture path). Missing sprites fall back to a "?" block, never a broken image.
- Textures are Mojang's property, used for this non-commercial community site under the Minecraft Usage Guidelines. Keep a one-line credit in the site footer ("Minecraft textures © Mojang"), and don't offer them for download.

### Lighting

There are **no colour "scenes"**. The stage has one constant warm lighting state: footlights on, lanterns lit, everything else in darkness. Lighting changes only at these moments:

1. **Cold open:** the stage starts completely dark. The footlights come on one by one (left to right), then the lanterns, then the curtains open.
2. **Every reveal:** the spotlight snaps to the prop (see Motion), and the rest of the stage dims to 70% for the length of the reveal.
3. **The Flawless variant** (slide 4) and **the Heartbreak** (slide 7): the footlights dim to 40%. The only "mood" change in the show.
4. **The finale** (slides 12–13): after the totem pops, the spotlight and footlight glows take on the **totem's colour** (`--rb-totem`) and stay that way through the credits.

### Colour tokens

| Token | Value | Use |
|---|---|---|
| `--rb-void` | `#07070b` | Everything outside the stage |
| `--rb-light` | `#ffd98a` | Footlight and spotlight glow |
| `--rb-mc-white` | `#ffffff` | Minecraft text |
| `--rb-mc-shadow` | `#3f3f3f` | Minecraft text shadow (white text) |
| `--rb-mc-gold` | `#ffaa00` | Minecraft gold (`§6`): award titles |
| `--rb-mc-gold-shadow` | `#2a2a00` | Shadow for gold text |
| `--rb-mc-yellow` | `#ffff55` | Minecraft yellow (`§e`): numbers, the advancement header |
| `--rb-mc-gray` | `#aaaaaa` | Minecraft gray (`§7`): secondary text |
| `--rb-mc-dark-gray` | `#555555` | Minecraft dark gray (`§8`): footnotes |
| `--rb-tooltip-bg` | `#100010` at 94% | Item tooltip background |
| `--rb-tooltip-border` | `#5000ff` → `#28007f` (vertical gradient) | Item tooltip border |
| `--rb-totem` | *per player* | The totem's `light` palette colour; finale only |

Scope them under a `.rollback` class in `globals.css` (Tailwind v4 `@theme inline` for utilities).

## Typography: Minecraft fonts only

The two Minecraft fonts are already loaded in `globals.css`: `--font-minecraft-ten` and `--font-minecraft-seven`. **No other fonts appear in the show.**

| Role | Font | Style |
|---|---|---|
| **Title text**: award reveal words (month, nemesis, totem name), the marquee | **Minecraft Ten** | Large (48–72px mobile), `--rb-mc-gold` or white, with the **Minecraft text shadow**: `text-shadow: 0.125em 0.125em 0 <shadow>` (no blur, ever). Mimics `/title`. |
| **Subtitle text**: under a title | Minecraft Seven | 18–22px, white or gray, Minecraft shadow. Mimics the `/title subtitle`. |
| **The Academy (host voice)** | Minecraft Seven | 16–18px, white, Minecraft shadow, word-by-word reveal. Shown as a **floating nametag-style line**: a translucent black box (`rgb(0 0 0 / 0.25)`) behind the text, hovering above the stage like an NPC talking. |
| **Signs, tooltips, the hotbar, toasts** | Minecraft Seven | Sizes as in-game, scaled with the stage. Numbers in `--rb-mc-yellow`. |

Rules: pixel fonts render only at **integer multiples** of their design size (Minecraft Seven at 8px → 16, 24, 32px; Ten likewise), so they never blur. Use `-webkit-font-smoothing: none` and `font-smooth: never` on the show root. Never use italic, letter-spacing or faux bold on the Minecraft fonts.

## UI vocabulary (replaces cards and pills)

Every piece of information is shown with one of these. **There are no pills, cards or chips.**

| Component | Looks like | Used for |
|---|---|---|
| `<TitleText>` | Minecraft `/title`: big Minecraft Ten with a hard shadow, centred over the stage, optional `<SubtitleText>` | Every award reveal word |
| `<AcademyLine>` | Floating nametag text above the stage | Everything the Academy says |
| `<Sign>` | An oak sign (oak-plank board on a post) standing on the stage floor, with up to 4 lines of 15 characters (the in-game limit, so copy must fit) | Short stats: "38 hours / that month", "Best day: / 14 March" |
| `<ItemFrame>` | An item frame on the back wall (real leather back, oak border) holding a sprite; the item rotates in 45° steps when it "lands", like in-game | Showing a block, item, disc or mob trophy on the wall |
| `<Tooltip>` | The purple-bordered item tooltip box, with a coloured title line then gray lines | Details for anything held up or framed; the totem's final tooltip |
| `<Hotbar>` | The 9-slot hotbar (real `ui_hotbar_slot` and `ui_hotbar_selected` sprites), with items in slots and stack counts in the corner (white Minecraft Seven with shadow; large numbers abbreviated: `48k`, `1.2M`) | The big totals (slide 11) and the share card |
| `<XpBar>` | The real XP bar (`ui_xp_empty` / `ui_xp_full` tiles) with a level number above it in green (`#80ff20`) | Any proportion: months active, objectives done, "more than 91% of the server" |
| `<AdvancementToast>` | "Advancement Made!" toast that slides in from the top-right corner (yellow header, white body, an item icon) | Small bonus facts that don't deserve their own beat ("Ghost sessions: 9") |
| `<Pedestal>` + `<Prop>` | The quartz cube centre stage, with a prop (block, sprite, entity face, totem) floating 0.5 blocks above it, bobbing and slowly rotating | The hero object of each slide |
| `<Nudge>` | Gray Minecraft Seven text at the bottom: `tap to continue`, breathing opacity | Shown only if the player hasn't advanced 4s after a beat settles |

The progress indicator is a **row of real hotbar slots** (`ui_hotbar_slot`, with `ui_hotbar_selected` on the current slide) at the top of the screen (one per slide in this player's deck): the past ones hold a dim item, the current one is outlined with the white hotbar selector, and the future ones are empty.

---

## Motion system

All motion uses `motion` (v12, already installed) via `motion/react`. Wrap the show in `<LazyMotion features={domAnimation} strict>` and use `m.` components.

### Tokens (`src/lib/rollback/motion.ts`)

Never write raw durations or easings in components.

```ts
export const ease = {
  out:      [0.22, 1, 0.36, 1],    // default entrance
  inOut:    [0.65, 0, 0.35, 1],    // camera moves, curtains
  in:       [0.55, 0, 1, 0.45],    // exits only
  dramatic: [0.16, 1, 0.3, 1],     // big reveals: long, soft settle
} as const

export const dur = { micro: 0.15, fast: 0.3, base: 0.6, slow: 0.9, camera: 1.4 } as const

export const spring = {
  soft:   { type: 'spring', stiffness: 120, damping: 20 },             // general settle
  drop:   { type: 'spring', stiffness: 300, damping: 16, mass: 1.1 },  // a block landing on the stage
  heavy:  { type: 'spring', stiffness: 90,  damping: 14, mass: 1.4 },  // title text
  snappy: { type: 'spring', stiffness: 420, damping: 30 },             // UI: tooltips, toasts, hotbar
} as const

export const stagger = { tight: 0.06, base: 0.12, loose: 0.2 } as const

// Minecraft /title timing, in seconds (in-game default is 0.5 / 3.5 / 1.0)
export const title = { fadeIn: 0.5, stay: 2.4, fadeOut: 0.6 } as const
```

### The rules

1. **Things arrive the way they would in Minecraft.**
   - **Blocks and props** *drop* onto the stage from above (`y −3 blocks → 0`, `spring.drop`), with a tiny squash on landing (`scaleY 1 → 0.92 → 1`, 0.18s) and a puff of 6–8 square "dust" particles at their base.
   - **Signs** pop up from the floor (`scaleY 0 → 1`, origin bottom, `spring.drop`).
   - **Item frames** fade in on the wall, then their item drops into the frame and does one 45° rotation click.
   - **Title text** follows `/title` timing: fade in over `title.fadeIn` while scaling 1.12 → 1.0 (`ease.dramatic`). It stays as long as the beat needs, then fades out.
   - **The Academy's lines** reveal word by word: each word `opacity 0 → 1, y 4px → 0` (no blur), staggered `0.05s`, with an extra `0.35s` pause after `—`, `…` and sentence ends.
   - **Tooltips, toasts and the hotbar** are UI, so they're quick and snappy (`spring.snappy`). The tooltip scales from 0.92 with its origin at the item it describes. The toast slides in from the right edge, holds for 2.5s, and slides back out.
2. **Exit faster than you enter.** Props exit by **sinking into the stage** (`y 0 → +0.5 block, opacity → 0`, 0.35s, `ease.in`) or, for title text, by fading out (`title.fadeOut`). Nothing flies off-screen.
3. **One focal motion at a time.** Beats are sequenced. The next starts when the previous one settles. Ambient motion (lantern sway, prop bob, footlight flicker, dust motes) keeps running underneath.
4. **Animate only `transform`, `opacity` and `filter: brightness()`.** Never animate layout properties, box-shadow or `text-shadow`. Glows are pre-rendered gradient planes.
5. **Hard edges stay hard.** No blur on anything pixel-based. Depth is shown with darkness (brightness), not blur.
6. **Reduced motion** (`prefers-reduced-motion: reduce`): the camera cuts instead of dollying, props fade in place, particles, sway and bob are off, and the curtains are already open. The beat sequencing stays the same.

### Camera

The camera is the 3D transform on the stage's `world` group (rotateX, rotateY, translateZ, translate). It's driven by motion values, so it can be interrupted and blended smoothly. There are only **four marks**:

| Mark | Framing | Used for |
|---|---|---|
| `wide` | The stage filling the full screen width, slightly above (scale ≈ 1.28 of the set) | Cold open, most slides, transitions, the credits |
| `pedestal` | Pushed in on the pedestal (≈ 1.48) | Reveals of a single prop |
| `wall` | Tilted up toward the back wall (≈ 1.4, shifted down) | Item frames, banners |
| `low` | Low and close, looking up at the pedestal (≈ 1.72) | Big moments: the nemesis verdict, the totem pop |

Camera moves take `dur.camera` with `ease.inOut`, and always include a small amount of rotateY drift (±2°) so the motion feels hand-held rather than robotic. Each beat declares its mark; the camera only moves when the mark changes.

### Slide transitions

1. The props of the outgoing slide **sink** into the stage (rule 2), in reverse order, `stagger.tight`.
2. **At the same time** the camera eases back toward `wide` (or straight to the next slide's first mark if that's `wide` too).
3. 0.25s after the exit starts, the incoming slide's first beat begins.
4. Going **back** jumps to the previous slide's final state (all props in place, no intro replay) with a quick camera move (`dur.base`).

The stage, curtains, lanterns and footlights never animate out between slides.

### Beats and input

Every slide is a sequence of beats (one focal moment each), owned by the deck engine (`06-frontend.md`). Beats auto-advance after a hold. A tap while a beat is animating **completes it instantly**; a tap on a settled beat goes to the next one. Interactive beats (the nemesis quiz, the liner notes, the signature, the silhouette hold) wait for input.

### Counting numbers

Numbers count up from 0 (`<CountUp>`, 0.9–1.4s, `ease.out`, locale-formatted). In the hotbar, the stack count ticks up while the slot's item does a small bounce when it reaches its final value. Numbers are always `--rb-mc-yellow` or white, never coloured pills.

### Haptics

`src/lib/rollback/haptics.ts`: a feature-detected `navigator.vibrate` wrapper; a no-op on iOS and under reduced motion. Don't add `haptic-web`.

| Name | Pattern (ms) | Used for |
|---|---|---|
| `tick` | `[20]` | Sign pops up, hotbar slot fills, carousel pass |
| `land` | `[50, 20, 30]` | A block or prop lands on the stage |
| `tap` | `[60]` | Player selection |
| `gavel` | `[80, 40, 80]` | Title text lands |
| `thud` | `[120, 50, 160]` | Major reveal |
| `applause` | `[30, 20, 30, 20, 40, 20, 50]` | Correct quiz answer, totem pop |
| `heartbeat` | `[80, 500, 80]` | Sincere moments |
| `error` | `[100, 30, 100]` | Wrong quiz answer |

### Particles

One shared canvas layer over the stage, for:

- **Dust motes:** 20–30 tiny square pixels drifting up through the spotlight. Always on (except reduced motion).
- **Landing puffs:** square, gray-white, 6–8 per landing, outward and down, 0.4s.
- **Totem burst:** see slide 12. Square, in totem colours plus Minecraft's yellow-green totem particles (`#f5e06b`, `#9be23c`).
- **Confetti** (`canvas-confetti`, square shapes) **only at the totem pop**. Nowhere else.

All particles are squares. No circles anywhere in the show.

### Performance budget

- **60fps** on a mid-range Android (Chrome DevTools CPU 4× throttle). No long tasks over 50ms during transitions.
- The 3D set is **at most ~30 planes and ~8 real cubes**. It's wider than the viewport, but anything off-screen costs almost nothing. Repeat textures with `background-repeat`, not extra elements.
- **Preload everything** during the loading state: fonts (`document.fonts.load` for both Minecraft fonts), stage textures, and every sprite the payload needs (`img.decode()`), with a 4s cap.
- Mount only the current slide's props. The set is permanent.
- The rollback route is code-split.
