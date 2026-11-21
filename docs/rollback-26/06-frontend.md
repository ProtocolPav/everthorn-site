# 06 — Frontend (everthorn-tanstack)

Follow `AGENTS.md` (function declarations, named exports, kebab-case files, `.ts`/`.tsx` import extensions, `cn()`, Phosphor icons). Read `02-design-system.md` before writing any component.

## Route

`src/routes/(no-layout)/rollback.index.tsx` → **`/rollback`**. It's in the `(no-layout)` group, so there's no header or footer, and it's full-screen. Code-split automatically by TanStack Router, so nothing rollback-related ships with other pages.

- `head()`: title `Everthorn Rollback '26`, `theme-color #0a0a0f`, OG image `public/og/rollback-26.png` (a static image to design: the six carved totems on the stage).
- `loader`: calls `getMyRollback()` (below) and `getRollbackSeason()`. Don't use the orval-generated **hooks** for the per-player endpoint; use only the generated **types**.
- `pendingComponent`: the loading state (`03-slides.md` § Loading). `errorComponent`: the error gate.
- Dev-only search params (validated with Zod, ignored in production builds): `fixture` (a fixture name), `slide` (start index), `beat`, `autoplay=0` (disable beat auto-advance).
- Add a "Rollback '26" entry to `src/config/navigation.ts` only once the season is published (a feature check against `SeasonOut.published`).

## Data flow and security

```
browser ──(cookie)──► getMyRollback (createServerFn, runs on the server)
                         1. auth.api.getSession({ headers: getRequestHeaders() })  → no session → { state: 'signed_out' }
                         2. session.user.discord_id → GET /guilds/me/users/lookup  → none → { state: 'not_member' }
                         3. isCM = role in ('Community Manager','Owner')
                         4. GET /guilds/me/rollback/2026/users/{thorny_id}?preview={isCM}
                              using the ROLLBACK client token (server-only env, never returned)
                              → 403 not published → { state: 'not_published', published_at }
                              → 404             → { state: 'no_data' }
                              → 200             → { state: 'ready', payload }
```

- File: `src/lib/rollback/server.ts`. A token cache like `nexuscore-token.ts`, but for `NEXUSCORE_ROLLBACK_CLIENT_ID/SECRET`, and **the token function is not exported as a server function**. It's a plain server-only module function, so it can't be called from the client.
- The return type is a discriminated union (`RollbackState`). The route renders the matching gate or the show.
- No thorny_id, discord_id or gamertag is ever accepted from the client. There's no `/rollback/$gamertag` route.
- Add the two env vars to `.env.example`.

## Folder structure

```
src/
├── routes/(no-layout)/rollback.index.tsx
├── lib/rollback/
│   ├── server.ts            # getMyRollback, getRollbackSeason (server fns)
│   ├── types.ts             # re-exports orval models + RollbackState, SlideId, CameraMark
│   ├── motion.ts            # tokens (ease, dur, spring, stagger, title) — see 02
│   ├── camera.ts            # the 4 camera marks (wide, pedestal, wall, low) as transform values
│   ├── sprites.ts           # minecraft id → sprite URL map with "?" fallback
│   ├── haptics.ts           # named vibration patterns, feature-detected
│   ├── copy.ts              # ALL Academy lines, as functions of data
│   ├── build-show.ts        # payload → ordered SlideDefinition[] (availability + variants)
│   ├── assets.ts            # collects every sprite URL a deck needs; preload()
│   └── fixtures/            # dev payloads (see Fixtures)
├── hooks/
│   └── use-rollback-deck.ts # the deck state machine
└── components/features/rollback/
    ├── rollback-show.tsx    # top-level: LazyMotion, Stage, ProgressBar, Deck
    ├── gates/               # signed-out, not-member, no-data, not-published (countdown), error, loading
    ├── stage/               # the permanent 3D set: stage.tsx (world group + camera motion values), floor.tsx,
    │                        # front-lip.tsx, footlights.tsx, back-wall.tsx, curtains.tsx, top-beam.tsx,
    │                        # lanterns.tsx, spotlight.tsx, sky.tsx (day cycle), particles.tsx (one canvas)
    ├── voxel/               # cube.tsx (6-face textured cube), plane.tsx, billboard.tsx (always faces camera)
    ├── deck/                # deck.tsx (input capture + transitions), progress-slots.tsx (hotbar-style progress)
    ├── ui/                  # Minecraft UI vocabulary: title-text, subtitle-text, academy-line, sign, item-frame,
    │                        # tooltip, hotbar, xp-bar, advancement-toast, pedestal, prop, nametag, mc-button,
    │                        # count-up, nudge
    ├── slides/              # one file per slide: s00-cold-open.tsx … s13-credits.tsx, each exporting its SlideDefinition
    └── pieces/              # slide-specific props: rewind, totem-parade, calendar-page, month-markers, suspect-lineup,
                             # jukebox, liner-page, signature-pad, seats, hour-skyline, minecart-rail, totem-pop,
                             # credits-roll, share-card
```

## Slide definition

Each file in `slides/` exports one of these:

```ts
interface BeatSpec {
  camera: CameraMark                 // 'wide' | 'pedestal' | 'wall' | 'low'
  holdMs?: number                    // auto-advance hold after settling (default 1200)
  waitForInput?: boolean             // quiz, liner notes, signature, silhouette hold, final actions
  lighting?: { footlights?: number; totemColour?: boolean }   // only when it changes (02 § Lighting)
}

interface SlideDefinition<T> {
  id: SlideId
  isAvailable: (p: RollbackPayload) => boolean
  select: (p: RollbackPayload) => T                 // picks this slide's data and variant
  beats: (data: T) => BeatSpec[]                    // variants may have different beats
  Component: React.FC<{ data: T; beat: number; onBeatSettled: () => void }>
}
```

## The deck engine (`use-rollback-deck.ts`)

A small state machine. **Not** native scroll-snap: a controlled deck so we own every frame.

```ts
interface DeckState {
  slideIndex: number
  beat: number
  beatStatus: 'animating' | 'settled'
  direction: 1 | -1
  transitioning: boolean      // true during the slide-change window (~0.6s): input is ignored
}
// actions: advance(), back(), beatSettled(), jumpTo(i)
```

- `advance()`: if `transitioning`, ignore. If the beat is `animating`, mark it **complete instantly** (components listen to a `skip` signal via context and jump to their end state). If `settled` and there are beats left, `beat + 1`. Otherwise go to the next slide.
- **Auto-advance:** when a beat settles, start a hold timer (`slide.holdMs[beat] ?? 1200`). On expiry, `advance()`. Beats flagged `waitForInput` (the nemesis quiz, liner notes, signature, totem silhouette hold, the last slide) never auto-advance.
- **Input (in `deck.tsx`):**
  - Tap or click: right 70% of the screen → advance; left 30% → back (Wrapped convention). Ignore taps on interactive children (`data-rb-interactive`).
  - Wheel: accumulate `deltaY`; trigger at 60px, then **lock for 700ms** (trackpad inertia otherwise skips several slides).
  - Touch swipe: vertical swipe > 50px or velocity > 0.4px/ms → advance (up) or back (down).
  - Keyboard: `→ ↓ Space Enter` advance, `← ↑` back, `Esc` opens a minimal pause menu (restart, exit).
  - Prevent page scroll and pull-to-refresh: `overscroll-behavior: none`, `touch-action: none` on the deck.
- **Pausing:** pause hold timers when the tab is hidden (`visibilitychange`), and while a long-press is held (hold to pause, like stories).
- **Progress persistence:** store `{slideIndex}` in `sessionStorage` (wrapped in try/catch) so an accidental refresh resumes; "Watch again" clears it.

## Transitions (`deck.tsx`)

The `<Stage>` is permanent and never unmounts. Slides render **props into the stage's world group** (through a React portal or a `StageSlot` context), not full-screen layers. Use `AnimatePresence` keyed by slide id so the outgoing props run their "sink into the stage" exit while the incoming slide starts (see `02-design-system.md` § Slide transitions). Each beat declares a camera mark. The deck passes the current mark to `<Stage>`, which animates its camera motion values (`useSpring`/`animate` on rotateX, rotateY, translateY, translateZ). Interrupting a camera move mid-flight must blend smoothly from the current values, never snap. The stage's lighting state (footlights on or dimmed, totem colour) is also a prop, set by the beats that need it (02 § Lighting). Flat UI that isn't part of the world (Academy lines, title text, toasts, the hotbar, progress slots) renders in a 2D overlay layer above the stage.

## UI component behaviour under skip

Every component in `ui/` and `pieces/` reads `useBeatControl()` → `{ active: boolean; skipped: boolean }`:

- `active` false → render the hidden initial state (not mounted for later beats, or opacity 0).
- `skipped` true → render the final state immediately (motion `animate` with `duration: 0`, CountUp shows the final value).

That makes "tap to complete" consistent everywhere, without slide-specific code.

## Fixtures

`src/lib/rollback/fixtures/*.ts`, typed as `RollbackPayload`. Build the whole UI against these before the API exists.

| Fixture | Covers |
|---|---|
| `veteran` | Every slide present, Undying tier, project ritual, player nemesis |
| `builder` | Mason Gilded, block ritual, no comeback |
| `flawless` | Zero deaths (nemesis variant), unbroken heartbreak |
| `newcomer` | First season, 6 hours: short show (< 8 slides), Cracked |
| `ghost` | One 3-minute session: the 5-slide minimum show |
| `no-disc` | Assigned soundtrack |
| `night-owl` | Night owl persona with ghost sessions |

The route uses `?fixture=` in dev (bypassing `getMyRollback`). Also add a dev-only `/rollback?fixture=veteran&slide=12` workflow note to the README in this folder.

## Testing

Vitest + React Testing Library are configured with no tests yet. Add:

- `build-show.test.ts`: the deck composition for every fixture (which slides, which variants, the short-show flag).
- `copy.test.ts`: every copy function returns a non-empty string for every fixture, and no output contains `undefined`, `NaN` or `null`.
- `use-rollback-deck.test.ts`: advance and skip semantics, the wheel lock, auto-advance holds, waitForInput beats.

Visual and motion quality is verified by hand (see `07-implementation-plan.md` § Polish).

## Dependencies

| Add | Why |
|---|---|
| `html-to-image` | Share card → PNG (slide 13) |

Already installed and to be used: `motion`, `canvas-confetti`, `zod`, `@tanstack/react-start`. Don't add `haptic-web`, GSAP, Lenis or three.js.
