# 07 — Implementation Plan

Work through the phases **in order**. Each phase ends with its acceptance criteria met and a commit (or several). Frontend phases 3–5 can start as soon as phase 0's reset is done, because they run on fixtures; they don't wait for the backend.

Use the TaskCreate/TaskUpdate list to track phases. When something in this plan turns out to be wrong (the data says otherwise, or a motion idea doesn't work in practice), update the relevant doc in this folder in the same commit, so the docs stay the source of truth.

---

## Phase 0: Reset and discovery

**everthorn-tanstack**
- [ ] Delete `PRESENTATION.md` and `presentation/` (see `README.md` § Step zero). Commit `chore(rollback): reset to new design`.
- [ ] Delete the leftover placeholder textures listed in `README.md` § Step zero. Confirm `public/rollback/totems/` has 24 PNGs and `public/rollback/textures/` has only real Minecraft textures.

**nexuscore**
- [ ] Create branch `rollback-26` off `develop`.
- [ ] Run every query in `05-backend.md` § Phase 0 against production (read-only). Write the results and decisions to `docs/rollback-26/data-discovery.md` in everthorn-tanstack.
- [ ] Update `05-backend.md` and `03-slides.md` wherever the data contradicts an assumption (death references, player kills, jukebox, session caps).

**Accept when:** the reset commit exists, and `data-discovery.md` answers every question in the decision table.

---

## Phase 1: Nexuscore data layer

- [ ] Migration `rollback_season`: schema, `season` (+ the 2026 row), `totem_award`, `recap`, all materialized views with unique indexes, and `downgrade()`.
- [ ] `mv_player_scores` implementing `04-totems.md` § Scoring exactly.
- [ ] `EXPLAIN ANALYZE` every view on a production-sized copy; each refresh should finish in minutes, not hours. Add indexes where it doesn't.
- [ ] `src/utils/minecraft_names.py` (id → display name, with a title-case fallback) and the `DISCS` / `ENVIRONMENTAL_DEATHS` constants.

**Accept when:** `alembic upgrade head` then `downgrade -1` both work on a clean database; all views refresh; manually checking 3 real players' totals against existing endpoints (`/users/{id}/playtime`, `/interactions`) gives the same numbers for the window.

---

## Phase 2: Nexuscore API and build

- [ ] Scopes `rollback:read` and `rollback:admin`; the new `RollbackNotPublished` error.
- [ ] Models (`src/models/rollback/`), repository, service (including `build()`), DI wiring, router, and registration in `api_router`.
- [ ] Every endpoint in `05-backend.md` § Endpoints.
- [ ] CLI `python -m src.scripts.rollback_build 2026`.
- [ ] Tests from `05-backend.md` § Tests.
- [ ] Create the `everthorn-web-rollback` auth client (`guilds.members:read`, `rollback:read`); hand its credentials to the maintainer, never commit them.
- [ ] Run a build on staging, then `GET /2026/stats` to check the archetype distribution (no archetype above 35%). Tune and rebuild if needed, and record the final constants.

**Accept when:** the build completes for all players; `GET /2026/users/{id}?preview=true` returns a valid payload for a veteran, a newcomer and a one-session player; the per-player endpoint rejects tokens without `rollback:read`; tests pass.

---

## Phase 3: Frontend foundation (on fixtures)

- [ ] Tokens: `.rollback` CSS variables, `motion.ts`, `camera.ts`, `haptics.ts`. Pixel-font rendering rules (02 § Typography).
- [ ] Textures: the real Minecraft textures the design needs are in `public/rollback/textures/`. For anything missing, add it with `extract_vanilla_textures.py` from bedrock-samples (02 § Textures). Build `sprites.ts` (Minecraft id → texture).
- [ ] `voxel/` (cube, plane, billboard) and the **permanent stage**: floor, front lip, footlights, back wall, curtains, proscenium, lanterns, spotlight, sky, the particles canvas, and camera motion values with the 4 marks.
- [ ] `ui/` vocabulary: title-text, subtitle-text, academy-line, sign, item-frame, tooltip, hotbar, xp-bar, advancement-toast, pedestal, prop, nametag, mc-button, count-up, nudge. Each one supports `active` / `skipped` (06 § skip).
- [ ] The deck engine + `deck.tsx` input handling + progress slots.
- [ ] Fixtures (all 7), `build-show.ts`, `copy.ts` (all copy from `03-slides.md`), and the dev search params.
- [ ] Route `/rollback` with fixture mode, plus a **dev playground** (`?fixture=veteran&slide=…&beat=…&autoplay=0`).
- [ ] Unit tests: `build-show`, `copy` (including the 15-character sign-line limit), deck engine.

**Accept when:** on a phone (or Chrome device mode with 4× CPU throttle), the empty stage holds 60fps with lantern sway, dust and a camera move between all 4 marks. Every `ui/` component can be seen entering, skipping and exiting in the playground. Advance, skip, back, wheel lock and keyboard behave as specified.

---

## Phase 4: Slides (on fixtures)

Build them **in show order**, each with all its variants, and review each one against `03-slides.md` and the Claude Design canvas before moving on:

- [ ] 0 Cold Open (rewind, lights, curtains, marquee, short-show line)
- [ ] 1 Candidates (parade with spotlight sweep, silhouette)
- [ ] 2 Chapter
- [ ] 3 Ritual (all three tiers)
- [ ] 4 Nemesis (standard with correct and wrong paths, flawless)
- [ ] 5 Soundtrack (standard, assigned, liner page, pixel signature)
- [ ] 6 Handshake
- [ ] 7 Heartbreak (standard, unbroken)
- [ ] 8 Companion Medal
- [ ] 9 Ghost (all four personas, ghost sessions)
- [ ] 10 Second Wind
- [ ] 11 Unstoppable Force (hotbar with 2–6 slots)
- [ ] 12 Final Accolade (**the pop**: budget real time to iterate on it; check all 6 archetypes × 4 tiers)
- [ ] 13 Credits (roll, curtain call, share card, save image, watch again)

**Accept when:** every fixture plays start to finish with no empty states, no `undefined`/`NaN`, no layout jumps, and no clipped text at 360×640. The short-show and minimum-show fixtures feel complete, not broken.

---

## Phase 5: Gates, data and security

- [ ] `src/lib/rollback/server.ts`: `getMyRollback` and `getRollbackSeason` exactly as in `06-frontend.md` § Data flow (session → lookup → rollback client token, server-only).
- [ ] All gates (signed out, not a member, no data, not published with countdown, error) and the loading state.
- [ ] Regenerate the orval client against the new nexuscore OpenAPI, and use its models in `types.ts`.
- [ ] `.env.example` gets `NEXUSCORE_ROLLBACK_CLIENT_ID` / `NEXUSCORE_ROLLBACK_CLIENT_SECRET`.
- [ ] Preview for CMs before `published_at`.
- [ ] Navigation entry shown only when published.

**Accept when:** with real staging data, a logged-in player sees only their own show; there's no way from the browser to request another player's (inspect the network tab: no thorny_id parameter and no rollback token reach the client); every gate renders.

---

## Phase 6: Polish and performance

- [ ] Profile every slide transition and the totem pop on a mid-range Android and an iPhone. Fix any frame drops (flatten DOM, reduce planes, pre-decode sprites).
- [ ] Reduced-motion pass: walk through the whole show with reduced motion on.
- [ ] Haptics pass on Android: patterns feel right and aren't excessive.
- [ ] Pixel-perfect pass: no blurry fonts or sprites at any of the test viewports (integer scaling only).
- [ ] Desktop: a centred portrait frame with the stage extending around it, plus keyboard controls.
- [ ] OG image `public/og/rollback-26.png`.
- [ ] Final copy review in `copy.ts` with the maintainer.

**Accept when:** the maintainer has watched three different players' shows on their phone and signs off on the motion.

---

## Phase 7: Launch and in-game delivery

- [ ] After 28 December: production build → review stats → **lock** → set `published_at`.
- [ ] Claim endpoints verified with the bot/addon team (`04-totems.md` § In-game items). Hand over the textures and item spec.
- [ ] Monitor: errors on `/rollback`, the latency of the per-player endpoint, and the claim rate.

**Accept when:** the season is locked and published, the first totems have been claimed in-game, and no totem has changed since locking.
