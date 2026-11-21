# 05 — Backend (nexuscore)

Work on a `rollback-26` branch off `develop` in nexuscore. Follow `AGENTS.md` and the `new-model` skill (`.agents/skills/new-model/SKILL.md`) exactly: raw-SQL Alembic migrations via `op.execute`, Router → Service → Repository, `DB`/`Out` models, errors from `src/errors.py`, and DI in `src/dependencies/`.

## Architecture in one picture

```
events.connections ─┐
events.interactions ├─► materialized views (rollback.mv_*)  ──►  build step (Python service)  ──►  rollback.recap        (one JSON payload per player, frozen)
quests_v3.*         │      heavy SQL aggregates, refreshed          per-player narrative choices       rollback.totem_award  (permanent totems + claim state)
projects.*          ┘      once per build                           (ritual tier, nemesis decoys,
users."user"                                                         disc hash, copy keys…)
                                                                                                    GET /rollback/{year}/me ◄── frontend server fn
```

- **Materialized views** do the heavy, set-based aggregation across the whole season.
- **The build step** (`RollbackService.build(year)`) reads the views, makes the per-player choices in Python, and writes **one frozen payload per player** to `rollback.recap`. It also upserts `rollback.totem_award`.
- **The request path** is then a single primary-key read plus the live claim status. It's fast and consistent, and nothing changes under a player mid-show.

---

## Phase 0: data discovery (do this first, record the answers)

Several facts aren't knowable from the code. Run these against the production database (read-only) and record the results in `docs/rollback-26/data-discovery.md` in everthorn-tanstack, then adjust the SQL below accordingly.

```sql
-- 0. Postgres version (range_agg needs PG 14+)
SELECT version();

-- 1. Volume in the window
SELECT type, count(*) FROM events.interactions
WHERE time >= '2026-01-01 00:00 Europe/London' AND time < '2026-12-29 00:00 Europe/London' GROUP BY 1;

-- 2. What does a death reference look like? (mobs vs players vs environment)
SELECT reference, count(*) FROM events.interactions WHERE type='die' GROUP BY 1 ORDER BY 2 DESC LIMIT 80;

-- 3. How are player kills recorded? (gamertag? minecraft:player?)
SELECT reference, count(*) FROM events.interactions
WHERE type='kill' AND reference NOT LIKE '%:%' GROUP BY 1 ORDER BY 2 DESC LIMIT 30;

-- 4. Jukebox / music discs
SELECT reference, mainhand, count(*) FROM events.interactions
WHERE type='use' AND (reference ILIKE '%jukebox%' OR mainhand ILIKE '%music_disc%') GROUP BY 1,2 ORDER BY 3 DESC;

-- 5. scriptevent references (anything useful?)
SELECT reference, count(*) FROM events.interactions WHERE type='scriptevent' GROUP BY 1 ORDER BY 2 DESC LIMIT 50;

-- 6. Data completeness
SELECT count(*) FILTER (WHERE mainhand IS NULL) AS no_mainhand,
       count(*) FILTER (WHERE coordinates IS NULL) AS no_coords, count(*) AS total
FROM events.interactions WHERE time >= '2026-01-01';

-- 7. Session sanity: missing disconnects, absurd lengths
SELECT count(*) FILTER (WHERE disconnect_time IS NULL) AS open_sessions,
       percentile_cont(ARRAY[0.5,0.95,0.99]) WITHIN GROUP (ORDER BY extract(epoch FROM playtime)/3600) AS hours_p50_p95_p99,
       max(playtime) FROM events.sessions_view WHERE connect_time >= '2026-01-01';

-- 8. Quest progress statuses in the window
SELECT status, count(*) FROM quests_v3.quest_progress WHERE accept_time >= '2026-01-01' GROUP BY 1;

-- 9. Projects with usable coordinates
SELECT count(*) FILTER (WHERE coordinates IS NOT NULL), count(*) FROM projects.project;

-- 10. Item display names available?
SELECT count(*) FROM "server".items;
```

Decisions that depend on the answers:

| Question | If… | Then… |
|---|---|---|
| (2) environmental deaths | they're namespaced, e.g. `minecraft:fall` | Keep a constant `ENVIRONMENTAL_DEATHS` set in the repository and exclude it |
| (3) player kills | the gamertag is in `reference` | Nemesis can be a player. Kills against a player nemesis = `type='kill' AND reference = gamertag`. |
| (4) jukebox | no rows | Everyone gets the assigned disc. Keep the code path for '27. |
| (7) session lengths | p99 is plausible | Keep the 12h cap. Otherwise lower it. |
| (0) PG < 14 | — | Compute company hours in Python during the build instead of `range_agg` |

---

## Migration

`alembic revision -m "rollback_season"` → `src/migrations/versions/<hash>_rollback_season.py`. Everything goes in a new `rollback` schema. `downgrade()` drops the schema with `CASCADE`.

### Tables

```sql
CREATE SCHEMA IF NOT EXISTS rollback;

CREATE TABLE rollback.season (
    year          int4        NOT NULL,
    starts_at     timestamptz NOT NULL,
    ends_at       timestamptz NOT NULL,          -- exclusive
    published_at  timestamptz NULL,              -- null = not released
    locked_at     timestamptz NULL,              -- non-null = totems frozen
    built_at      timestamptz NULL,
    CONSTRAINT season_pk PRIMARY KEY (year),
    CONSTRAINT season_window_chk CHECK (ends_at > starts_at)
);

INSERT INTO rollback.season (year, starts_at, ends_at)
VALUES (2026, '2026-01-01 00:00:00 Europe/London', '2026-12-29 00:00:00 Europe/London');

CREATE TABLE rollback.totem_award (
    year        int4        NOT NULL,
    thorny_id   int8        NOT NULL,
    archetype   varchar     NOT NULL,   -- mason | vanguard | hearthkeeper | pathfinder | questbearer | evergreen
    tier        varchar     NOT NULL,   -- cracked | carved | gilded | undying
    scores      jsonb       NOT NULL,   -- percentiles per dimension, for auditing
    awarded_at  timestamptz DEFAULT now() NOT NULL,
    claimed_at  timestamptz NULL,
    CONSTRAINT totem_award_pk PRIMARY KEY (year, thorny_id),
    CONSTRAINT totem_award_season_fk FOREIGN KEY (year) REFERENCES rollback.season(year),
    CONSTRAINT totem_award_user_fk FOREIGN KEY (thorny_id) REFERENCES users."user"(thorny_id),
    CONSTRAINT totem_award_archetype_chk CHECK (archetype IN ('mason','vanguard','hearthkeeper','pathfinder','questbearer','evergreen')),
    CONSTRAINT totem_award_tier_chk CHECK (tier IN ('cracked','carved','gilded','undying'))
);
CREATE INDEX idx_rollback_totem_award_unclaimed ON rollback.totem_award (year) WHERE claimed_at IS NULL;

CREATE TABLE rollback.recap (
    year            int4        NOT NULL,
    thorny_id       int8        NOT NULL,
    schema_version  int2        NOT NULL,   -- bump when the payload shape changes
    payload         jsonb       NOT NULL,   -- RollbackPayload, minus live fields (claim)
    built_at        timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT recap_pk PRIMARY KEY (year, thorny_id),
    CONSTRAINT recap_season_fk FOREIGN KEY (year) REFERENCES rollback.season(year),
    CONSTRAINT recap_user_fk FOREIGN KEY (thorny_id) REFERENCES users."user"(thorny_id)
);
```

### Materialized views

All views are season-aware (join `rollback.season`, carry `year`), so '27 is just a new season row. Each one gets a **unique index** so `REFRESH MATERIALIZED VIEW CONCURRENTLY` works. These are sketches: verify against Phase 0 results, and `EXPLAIN ANALYZE` each one.

**`rollback.mv_sessions`**: sessions clipped to the season and capped.

```sql
CREATE MATERIALIZED VIEW rollback.mv_sessions AS
WITH raw AS (
    SELECT sv.connect_event_id AS session_id, sv.thorny_id, sv.connect_time, sv.disconnect_time,
           lead(sv.connect_time) OVER (PARTITION BY sv.thorny_id ORDER BY sv.connect_time) AS next_connect
    FROM events.sessions_view sv
), capped AS (
    SELECT s.year, r.session_id, r.thorny_id,
           tstzrange(
               greatest(r.connect_time, s.starts_at),
               least(coalesce(r.disconnect_time, r.next_connect, r.connect_time + interval '4 hours'),
                     r.next_connect,                       -- never overlap the next session
                     r.connect_time + interval '12 hours', -- crash / missing disconnect cap
                     s.ends_at),
               '[)') AS span
    FROM raw r
    JOIN rollback.season s ON r.connect_time < s.ends_at
                          AND coalesce(r.disconnect_time, r.connect_time) >= s.starts_at
)
SELECT * FROM capped WHERE NOT isempty(span);

CREATE UNIQUE INDEX idx_rollback_mv_sessions_pk   ON rollback.mv_sessions (year, session_id);
CREATE INDEX        idx_rollback_mv_sessions_user ON rollback.mv_sessions (year, thorny_id);
CREATE INDEX        idx_rollback_mv_sessions_span ON rollback.mv_sessions USING gist (span);
```

(`least()` ignores NULLs, so a null `next_connect` is fine.)

**`rollback.mv_interactions`**: the season's interactions, pre-filtered (the base table is large; this keeps every downstream query cheap).

```sql
CREATE MATERIALIZED VIEW rollback.mv_interactions AS
SELECT s.year, i.interaction_id, i.thorny_id, i.type, i.reference, i.mainhand, i.dimension, i.time,
       (i.time AT TIME ZONE 'Europe/London') AS local_time,
       CASE WHEN i.coordinates IS NOT NULL
            THEN floor(i.coordinates[1] / 16.0)::int END AS chunk_x,
       CASE WHEN i.coordinates IS NOT NULL
            THEN floor(i.coordinates[3] / 16.0)::int END AS chunk_z,
       i.coordinates
FROM events.interactions i
JOIN rollback.season s ON i.time >= s.starts_at AND i.time < s.ends_at;

CREATE UNIQUE INDEX idx_rollback_mv_interactions_pk ON rollback.mv_interactions (year, interaction_id);
CREATE INDEX idx_rollback_mv_interactions_user ON rollback.mv_interactions (year, thorny_id, type, reference);
```

**`rollback.mv_player_monthly`**: one row per player per month (1–12, London time).

```sql
CREATE MATERIALIZED VIEW rollback.mv_player_monthly AS
WITH hours AS (
    SELECT year, thorny_id, extract(month FROM lower(span) AT TIME ZONE 'Europe/London')::int AS month,
           sum(extract(epoch FROM upper(span) - lower(span))) / 3600.0 AS hours,
           count(*) AS sessions
    FROM rollback.mv_sessions GROUP BY 1, 2, 3
), acts AS (
    SELECT year, thorny_id, extract(month FROM local_time)::int AS month,
           count(*) FILTER (WHERE type = 'place') AS placed,
           count(*) FILTER (WHERE type = 'mine')  AS mined,
           count(*) FILTER (WHERE type = 'kill')  AS kills,
           count(*) FILTER (WHERE type = 'die')   AS deaths
    FROM rollback.mv_interactions GROUP BY 1, 2, 3
), quests AS (
    SELECT s.year, qp.thorny_id, extract(month FROM qp.end_time AT TIME ZONE 'Europe/London')::int AS month,
           count(*) AS quests_completed
    FROM quests_v3.quest_progress qp
    JOIN rollback.season s ON qp.end_time >= s.starts_at AND qp.end_time < s.ends_at
    WHERE qp.status = 'completed' GROUP BY 1, 2, 3
)
SELECT coalesce(h.year, a.year, q.year) AS year,
       coalesce(h.thorny_id, a.thorny_id, q.thorny_id) AS thorny_id,
       coalesce(h.month, a.month, q.month) AS month,
       coalesce(h.hours, 0) AS hours, coalesce(h.sessions, 0) AS sessions,
       coalesce(a.placed, 0) AS placed, coalesce(a.mined, 0) AS mined,
       coalesce(a.kills, 0) AS kills, coalesce(a.deaths, 0) AS deaths,
       coalesce(q.quests_completed, 0) AS quests_completed
FROM hours h
FULL JOIN acts a   USING (year, thorny_id, month)
FULL JOIN quests q USING (year, thorny_id, month);
-- NB: with USING on FULL JOINs, select the merged columns directly; adjust if Postgres complains.

CREATE UNIQUE INDEX idx_rollback_mv_player_monthly_pk ON rollback.mv_player_monthly (year, thorny_id, month);
```

Hours are attributed to the month the session *started*, which is an acceptable approximation.

**`rollback.mv_overlap`**: pairwise time together (the Handshake slide).

```sql
CREATE MATERIALIZED VIEW rollback.mv_overlap AS
SELECT a.year, a.thorny_id, b.thorny_id AS other_id,
       sum(extract(epoch FROM upper(a.span * b.span) - lower(a.span * b.span))) / 3600.0 AS hours_together,
       min(lower(a.span * b.span)) AS first_together
FROM rollback.mv_sessions a
JOIN rollback.mv_sessions b ON a.year = b.year AND a.thorny_id <> b.thorny_id AND a.span && b.span
GROUP BY 1, 2, 3;

CREATE UNIQUE INDEX idx_rollback_mv_overlap_pk ON rollback.mv_overlap (year, thorny_id, other_id);
```

**`rollback.mv_player_hours`**: minutes per hour of day (the Ghost slide).

```sql
CREATE MATERIALIZED VIEW rollback.mv_player_hours AS
SELECT s.year, s.thorny_id,
       extract(hour FROM h AT TIME ZONE 'Europe/London')::int AS hour,
       sum(extract(epoch FROM upper(s.span * tstzrange(h, h + interval '1 hour'))
                            - lower(s.span * tstzrange(h, h + interval '1 hour')))) / 60.0 AS minutes
FROM rollback.mv_sessions s,
     LATERAL generate_series(date_trunc('hour', lower(s.span)), upper(s.span), interval '1 hour') AS h
WHERE s.span && tstzrange(h, h + interval '1 hour')
GROUP BY 1, 2, 3;

CREATE UNIQUE INDEX idx_rollback_mv_player_hours_pk ON rollback.mv_player_hours (year, thorny_id, hour);
```

**`rollback.mv_player_totals`**: one row per player per season. Includes company hours (union of overlaps, so simultaneous companions count once), active weeks, chunks and dimensions.

```sql
CREATE MATERIALIZED VIEW rollback.mv_player_totals AS
WITH sess AS (
    SELECT year, thorny_id,
           sum(extract(epoch FROM upper(span) - lower(span))) / 3600.0 AS hours,
           count(*) AS sessions,
           max(extract(epoch FROM upper(span) - lower(span))) / 60.0 AS longest_session_minutes,
           count(DISTINCT date_trunc('week', lower(span) AT TIME ZONE 'Europe/London')) AS active_weeks,
           count(DISTINCT date_trunc('month', lower(span) AT TIME ZONE 'Europe/London')) AS active_months,
           count(*) FILTER (WHERE upper(span) - lower(span) < interval '2 minutes') AS ghost_sessions
    FROM rollback.mv_sessions GROUP BY 1, 2
), company AS (   -- PG14+: range_agg merges overlapping companion ranges
    SELECT a.year, a.thorny_id,
           (SELECT sum(extract(epoch FROM upper(r) - lower(r))) FROM unnest(range_agg(a.span * b.span)) r) / 3600.0
             AS company_hours
    FROM rollback.mv_sessions a
    JOIN rollback.mv_sessions b ON a.year = b.year AND a.thorny_id <> b.thorny_id AND a.span && b.span
    GROUP BY 1, 2
), acts AS (
    SELECT year, thorny_id,
           count(*) FILTER (WHERE type = 'place') AS blocks_placed,
           count(*) FILTER (WHERE type = 'mine')  AS blocks_mined,
           count(*) FILTER (WHERE type = 'kill')  AS kills,
           count(*) FILTER (WHERE type = 'die')   AS deaths,
           count(DISTINCT (dimension, chunk_x, chunk_z)) FILTER (WHERE chunk_x IS NOT NULL) AS chunks,
           count(DISTINCT dimension) AS dimensions
    FROM rollback.mv_interactions GROUP BY 1, 2
), quests AS (
    SELECT year, thorny_id, sum(quests_completed) AS quests_completed
    FROM rollback.mv_player_monthly GROUP BY 1, 2
)
SELECT s.*, coalesce(c.company_hours, 0) AS company_hours,
       coalesce(a.blocks_placed, 0) AS blocks_placed, coalesce(a.blocks_mined, 0) AS blocks_mined,
       coalesce(a.kills, 0) AS kills, coalesce(a.deaths, 0) AS deaths,
       coalesce(a.chunks, 0) AS chunks, greatest(coalesce(a.dimensions, 1), 1) AS dimensions,
       coalesce(q.quests_completed, 0) AS quests_completed
FROM sess s
LEFT JOIN company c USING (year, thorny_id)
LEFT JOIN acts a    USING (year, thorny_id)
LEFT JOIN quests q  USING (year, thorny_id);

CREATE UNIQUE INDEX idx_rollback_mv_player_totals_pk ON rollback.mv_player_totals (year, thorny_id);
```

**`rollback.mv_player_scores`**: rates, percentiles, archetype and tier. Implement exactly the rules in `04-totems.md` § Scoring: shrinkage `(hours + 3)`, percentiles over the eligible set (`hours >= 2`) with non-eligible players placed into that distribution, argmax with the fixed tie-break order, the `pathfinder` fallback, and tier thresholds from the hours `percent_rank()` across all players. Output columns: `year, thorny_id, p_mason, p_vanguard, p_hearthkeeper, p_pathfinder, p_questbearer, p_evergreen, p_hours, archetype, tier`. Unique index on `(year, thorny_id)`.

Refresh order (dependencies): `mv_sessions` → `mv_interactions` → `mv_player_monthly` → `mv_overlap` → `mv_player_hours` → `mv_player_totals` → `mv_player_scores`.

---

## Build step (`RollbackService.build(year)`)

Runs from the admin endpoint (and optionally as a CLI: `python -m src.scripts.rollback_build 2026`).

1. Refresh all views in order (`REFRESH MATERIALIZED VIEW CONCURRENTLY`; the first refresh after migration can't be concurrent).
2. For each player in `mv_player_totals` for that year:
   - Upsert `rollback.totem_award` from `mv_player_scores`. **If the season is locked, insert only (`ON CONFLICT DO NOTHING`).**
   - Assemble the payload (the per-slide rules from `03-slides.md`) using small per-player repository queries against the `mv_*` views:
     - `chapter`: from `mv_player_monthly` plus the top percentile → behaviour; the peak day comes from a grouped query on `mv_interactions` / `mv_sessions` for that month.
     - `ritual`: project tier (interactions within **64 blocks** (x/z) of a project's `coordinates` in the same `dimension`, grouped by month; it counts if months ≥ half of `active_months`); otherwise the block tier (the `place` reference in the most distinct months); otherwise the behaviour tier.
     - `nemesis`: top 3 qualifying `die` references (`ENVIRONMENTAL_DEATHS` excluded; gamertags resolved against `users."user".gamertag`), plus kills against the top one.
     - `soundtrack`: the most-played disc from `use` events (per Phase 0), else `DISCS[thorny_id_hash % len(DISCS)]` using a **stable** hash (`hashlib.sha256(f"{year}:{thorny_id}")`, not Python's `hash()`).
     - `costar`: the top row in `mv_overlap`. `social.distinct_players` = count of rows with `hours_together >= 1/6`.
     - `heartbreak`: the failed quest with the best `objectives_done / objectives_total` (`quests_v3.objective_progress`), tie-break most recent.
     - `companion`: `mode()` of `mainhand` (non-null) with count ≥ 50, plus its most common `type`.
     - `ghost`: the 24-bucket histogram from `mv_player_hours`, the persona, the latest session end (local time of day, using a 04:00 day boundary so 01:00 counts as "late", not "early"), and `ghost_sessions`.
     - `comeback`: the largest gap between consecutive sessions (`lag` over `mv_sessions`) ≥ 14 days with a session after it, plus hours in the 30 days after returning.
     - `totals` and `percentiles`: from `mv_player_totals` / `mv_player_scores`.
     - `display_name` for blocks and items: from a static id → name map (`src/utils/minecraft_names.py`, a title-cased fallback) or `server.items` if it has names.
   - Upsert `rollback.recap` (`schema_version = 1`).
3. Set `season.built_at`. Return `BuildResultOut` (players built, duration, archetype and tier distribution).

Do all of this inside a single transaction per player batch (e.g. 50 players), so a failure doesn't leave half a season.

---

## Security: "only your own Rollback"

**The problem:** the frontend's existing nexuscore token (`getNexuscoreToken`) is returned to the browser, and it carries guild-wide read scopes. Any endpoint that accepts a `thorny_id` and is readable with that token would let a curious user read anyone's Rollback.

**The design:**

1. Add scopes to `Scope` in `src/models/auth.py` (with descriptions): `ROLLBACK_READ = "rollback:read"` and `ROLLBACK_ADMIN = "rollback:admin"`.
2. Create a **separate auth client** for the frontend *server* (`everthorn-web-rollback`) with scopes `guilds.members:read` + `rollback:read`. Its credentials are new server-only env vars in everthorn-tanstack: `NEXUSCORE_ROLLBACK_CLIENT_ID` / `NEXUSCORE_ROLLBACK_CLIENT_SECRET`. **Its token is never sent to the browser.** It's used only inside the `getMyRollback` server function.
3. **Do not** grant `rollback:read` to the existing browser-exposed client.
4. The frontend server function resolves identity from the **better-auth session cookie** (server-side) → `discord_id` → the nexuscore lookup → `thorny_id`. The browser never supplies a thorny_id.

> Pre-existing issue (outside this scope, flag it to the maintainer): `getNexuscoreToken` exposes the general guild token to any visitor. It's worth fixing separately, by proxying calls through server functions.

---

## Endpoints

Router file `src/routes/rollback.py`, `rollback_router = APIRouter(prefix='/guilds/me/rollback', tags=['Rollback'])`, registered in `src/routes/__init__.py`. All are guild-scoped via `get_guild_client`.

| Method & path | Scope | Purpose |
|---|---|---|
| `GET /{year}` | `guilds:read` | `SeasonOut`: `year`, `published` (bool), `published_at`, `player_count`, `totems[]` (6 definitions: id, name, tooltip, palette, textures per tier), `credits[]` (gamertags, alphabetical). Public-safe. |
| `GET /{year}/users/{thorny_id}` | `rollback:read` | `RollbackOut` = the recap payload plus the live `claim`. `NotFound` if no recap. `RollbackNotPublished` (a new error, 403) if `published_at` is null or in the future **unless** `preview=true` is passed. Only the frontend server function holds this scope, and it sets `preview` only for CMs. |
| `GET /{year}/awards/{thorny_id}` | `guilds.members:read` | `TotemAwardOut` (archetype, tier, item id `everthorn:rollback26_{archetype}_{tier}`, `claim.status`). For the in-game delivery. |
| `POST /{year}/awards/{thorny_id}/claim` | `guilds.members:write` | Sets `claimed_at` if null; idempotent; returns `TotemAwardOut`. |
| `POST /{year}/build` | `rollback:admin` | Runs the build step; returns `BuildResultOut`. Long-running: allow a long request timeout, or run it as the CLI. |
| `POST /{year}/lock` | `rollback:admin` | Sets `locked_at`. Refuses (`BadRequest`) if never built. |
| `PATCH /{year}` | `rollback:admin` | `SeasonUpdate`: set `published_at`. |
| `GET /{year}/stats` | `rollback:admin` | Archetype × tier distribution, player counts per show length, data-coverage counts (how many have a nemesis, co-star, comeback…). Use it to tune before locking. |

Files to add, per the new-model skill: `src/models/rollback/{season,recap,award,payload}.py`, `src/repositories/rollback.py`, `src/services/rollback.py`, DI factories in `src/dependencies/repositories.py` and `services.py`, the router, and the new error class in `src/errors.py`.

---

## Contract: `RollbackOut`

Defined as Pydantic models in `src/models/rollback/payload.py` (one sub-model per slide block, all optional where the slide is conditional). Frontend types are generated by orval from the OpenAPI schema. **Every slide block is `null` when there's no data for it; never send zeros to mean "nothing".**

```jsonc
{
  "schema_version": 1,
  "year": 2026,
  "player": {
    "thorny_id": 543, "gamertag": "Pavel", "first_season": false,
    "totem": {
      "archetype": "mason", "tier": "gilded",
      "name": "The Mason's Totem", "tier_name": "Gilded",
      "tooltip": "Laid stone where there was none. The world remembers the weight.",
      "tier_line": "Gilded by a year well spent.",
      "archetype_line": "Awarded to those who leave the world more built than they found it.",
      "hint_line": "The Academy will say only this: the world looks different because of you.",
      "texture": "/rollback/totems/mason_gilded.png",
      "palette": { "outline": "#2b1d14", "dark": "#7a4a2e", "mid": "#b06a3e", "light": "#d9935c", "accent": "#f0c08a" },
      "item_id": "everthorn:rollback26_mason_gilded"
    },
    "claim": { "status": "pending", "claimed_at": null }        // live, not stored in recap
  },
  "totals": {
    "hours": 212.4, "sessions": 318, "longest_session_minutes": 431,
    "active_months": 11, "active_weeks": 44,
    "blocks_placed": 48211, "blocks_mined": 61022, "mobs_killed": 3304, "deaths": 87,
    "chunks_explored": 2104, "dimensions": 3, "quests_completed": 22
  },
  "percentiles": { "hours": 0.91, "mason": 0.97, "vanguard": 0.55, "hearthkeeper": 0.62,
                   "pathfinder": 0.71, "questbearer": 0.80, "evergreen": 0.88 },
  "chapter": { "month": 3, "behaviour": "building", "headline_value": 4821, "hours": 38.2,
               "sessions": 41, "peak_day": "2026-03-14", "peak_day_value": 912 },
  "ritual": { "type": "project", "name": "Thornhold Keep", "reference": "thornhold",
              "months": 9, "active_months": 11, "month_flags": [true,true,true,false,true,true,true,true,false,true,true,false] },
  "nemesis": {
    "reference": "minecraft:creeper", "kind": "mob", "display_name": "Creeper",
    "deaths": 14, "kills_against": 61,
    "decoys": [ { "reference": "minecraft:skeleton", "kind": "mob", "display_name": "Skeleton" },
                { "reference": "Steve123", "kind": "player", "display_name": "Steve123" } ]
  },
  "soundtrack": { "disc": "minecraft:music_disc_pigstep", "display_name": "Pigstep",
                  "plays": 23, "is_assigned": false, "flavour": "rare" },
  "costar": { "gamertag": "Wren", "hours_together": 64.5, "first_together": "2026-01-03" },
  "social": { "distinct_players": 27, "share_with_company": 0.71 },
  "heartbreak": { "quest_title": "The Drowned Bell", "objectives_done": 4,
                  "objectives_total": 5, "failed_on": "2026-08-02" },
  "companion": { "item": "minecraft:netherite_pickaxe", "display_name": "Netherite Pickaxe",
                 "uses": 41022, "top_action": "mine" },
  "ghost": { "hour_histogram": [/* 24 numbers, minutes */], "persona": "night_owl",
             "latest_session_end": "04:12", "ghost_sessions": 9 },
  "comeback": { "gap_days": 37, "left_on": "2026-06-02", "returned_on": "2026-07-09", "hours_after": 41.0 }
}
```

`SeasonOut.totems[]` carries the same totem fields (name, tooltip, palette, textures for all 4 tiers) for the slide 1 parade, so the frontend has no hard-coded totem copy (only the archetype ids).

---

## Tests

There's no test suite in nexuscore yet, so at minimum add `tests/rollback/` with pytest:

- Unit tests for the pure Python choices: ritual tier selection, nemesis decoy padding, disc hashing stability, ghost persona and day boundary, verdict thresholds.
- One integration test that runs the migration plus the views against a seeded Postgres (docker) with 4–5 synthetic players covering the edge cases (zero deaths, no quests, a single 3-minute session, a crash session with no disconnect, overlapping friends), and asserts the recap payloads.
