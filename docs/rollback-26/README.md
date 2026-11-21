# Everthorn Rollback '26 — Design & Implementation Plan

> **For Claude Code: read this whole folder before writing any code.** It is the single source of truth for the Rollback. It spans two repositories:
>
> - **everthorn-tanstack** (this repo, branch `rollback-26`) — the presentation UI
> - **nexuscore** (`~/PycharmProjects/nexuscore`, branch off `develop` as `rollback-26`) — the data layer and API

## ⚠️ Step zero: reset everything that came before

Earlier rollback work was an exploratory draft and is **superseded in full** by this folder. Before starting:

1. **Delete** `PRESENTATION.md` and the entire `presentation/` directory in everthorn-tanstack. Do not port, merge or reference anything from them. Where an idea survived, it has been rewritten here.
2. There is no rollback code in `src/` or in nexuscore yet. If you find any (anything named `rollback`, `wrapped`, `accolade`), delete it as well.
3. The only rollback assets to **keep** are the ones this folder references:
   - `public/rollback/totems/*.png` — 24 totem textures (16×16)
   - `public/rollback/textures/*.png`: **real vanilla Minecraft textures** (blocks, items, mob heads, UI sprites) extracted from Mojang's bedrock-samples (see `02-design-system.md` § Textures)
   - `docs/rollback-26/assets/`: `generate_totems.py`, `extract_vanilla_textures.py` and the totem preview sheet
4. Also **delete** these leftovers from an earlier draft (procedurally drawn placeholders, superseded by the real textures): `docs/rollback-26/assets/generate_stage_textures.py` and, in `public/rollback/textures/`, `planks.png`, `plank_side.png`, `quartz.png`, `blackstone.png`, `pickaxe.png`, `sword.png`, `map.png`, `bricks_icon.png`, `disc.png`, `head_green.png`, `head_bone.png`, `head_dark.png`, `head_player.png`.
5. Commit the reset on its own (`chore(rollback): reset to new design`) before any feature work.

## Documents

| File | What's in it |
|---|---|
| [`01-concept.md`](01-concept.md) | Theme, the Academy's voice, show arc, season window, short-show rules |
| [`02-design-system.md`](02-design-system.md) | Visual language and the **motion system** (read this before touching any component) |
| [`03-slides.md`](03-slides.md) | All 14 slides: purpose, data, beats, copy, motion, variants |
| [`04-totems.md`](04-totems.md) | The 6 totems × 4 tiers, scoring, reveal, in-game items |
| [`05-backend.md`](05-backend.md) | Nexuscore: migration, materialized views, snapshot tables, endpoints, payload contract |
| [`06-frontend.md`](06-frontend.md) | Frontend architecture: route, auth gating, deck engine, stage, primitives, fixtures |
| [`07-implementation-plan.md`](07-implementation-plan.md) | Phased task list with acceptance criteria — **work through this in order** |
| [`assets/`](assets/) | `generate_totems.py`, `extract_vanilla_textures.py` and `totem-preview-sheet.png` |
| Claude Design canvas | **"Everthorn Rollback '26: Stage & Motion"**: the visual and motion reference (link below). Match its look and feel. |

**Claude Design canvas:** https://claude.ai/artifact/NA5JbEhnQ7TcmzCnEi3zBR. It holds the stage, key slides (0, 2, 4, 11, 12 with a playable totem pop, 13), the UI vocabulary, the live motion system and the totem sheet. The design uses the same real Minecraft textures committed in `public/rollback/textures/`.

Dev workflow: `/rollback?fixture=veteran&slide=12&beat=0&autoplay=0` (dev builds only).

## Non-negotiables

1. **Motion is the product.** Every element enters with intent, and nothing pops in. Transitions never stutter, never jump and never leave the player mid-slide. See `02-design-system.md`.
2. **A player can only ever see their own Rollback.** It's enforced server-side; see `05-backend.md` § Security and `06-frontend.md` § Data flow.
3. **Every player gets a show.** Slides with no data are skipped or swapped for a variant. Nobody sees an empty or broken slide, and nobody sees "0".
4. **Totems are permanent.** Once a season is locked, a player's totem never changes.
5. **All Academy copy lives in one file** (`src/lib/rollback/copy.ts`), so tone can be edited in one place.
