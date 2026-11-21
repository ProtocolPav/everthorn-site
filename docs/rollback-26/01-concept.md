# 01 — Concept

## The pitch

**Everthorn Rollback '26** is a Spotify Wrapped–style recap of a player's year on the Everthorn Bedrock server, staged as an **awards ceremony**. A theatrical, all-seeing body called **The Academy** has watched the whole year and presents the player with a sequence of personal awards. The evening ends with the player receiving a **Totem**: a trophy that names the shape of their year and is then **given to them in-game** as a real item.

Three ideas hold it together:

1. **It's a rewind.** "Rollback" is literal: the show opens by scrubbing the year backwards from December to January, then plays it forward as a story.
2. **It's an awards night.** Spotlights, a stage, a host, nominations and a final envelope. There are no server-wide winners: every player wins their own version of every award.
3. **The trophy is a Totem of Undying.** "Everyone who survived 2026 receives a totem." Everything before the reveal is evidence, and the totem is the verdict.

## Season

| | |
|---|---|
| Season window | **1 January 2026 00:00 → 28 December 2026 23:59:59, Europe/London** (end-exclusive `2026-12-29 00:00 Europe/London`) |
| Data | Frozen at season end. Views are built once after the window closes, then the season is **locked**. |
| Release | Controlled by `rollback.season.published_at`. Community Managers can preview before release. |
| Who gets a show | Every user with **at least one session** in the window |
| Access | Logged-in Discord user → their own Everthorn member → their own Rollback. **Nobody can view anyone else's.** |

## The Academy (voice)

The Academy is the host, the judge and the narrator. It's never explained. It simply exists, has opinions, and its word is final.

- Warm, dry and theatrical. It roasts gently and celebrates sincerely. It always treats the player as the guest of honour.
- Speaks *about* itself in the third person: "The Academy noted…", "The Academy was unanimous.", "The Academy deliberated on this one."
- Never says "we", "judges" or "panel". The single exception is the cold open joke ("our panel of judges — and by panel, we mean a database").
- Never says a number is low. Small numbers are framed as intent ("a focused year", "quality over quantity").
- British spelling (honour, colour, favourite).
- All copy lives in `src/lib/rollback/copy.ts` as functions of the payload, so it can be edited without touching components.

## Show arc

The emotional shape matters as much as the data. Slides alternate energy so the show breathes.

```
Cold Open → Candidates → Chapter → Ritual → Nemesis → Soundtrack → Handshake
lighthearted  anticipation  habitual  sincere  conflict   quiet       intimate

→ Heartbreak → Companion → Ghost → Second Wind → Unstoppable Force → Final Accolade → Credits
   emotional     warm       playful  triumphant      peak              verdict         afterglow
```

## Full show vs short show

There is **one show** made of slides that each decide whether they can run. The deck is assembled from the payload at load time (`buildShow(payload)` in `src/lib/rollback/build-show.ts`).

- **Always present:** 0 Cold Open, 1 Candidates, 11 Unstoppable Force, 12 Final Accolade, 13 Credits
- **Conditional:** every other slide declares an `isAvailable(payload)` rule and, where relevant, a **variant** (see `03-slides.md`). When a variant exists (zero deaths, no jukebox, no failed quests), the slide runs as that variant instead of being skipped.
- **Short-show framing:** if the assembled deck has **fewer than 8 slides**, the cold open uses the short-programme line ("The Academy has prepared a shorter programme this evening. It is, frankly, a relief.") and the progress bar shows the real, shorter count. A short show must feel *intentional*, never like something is missing.
- **Minimum data:** a player with a single 3-minute session still gets 0, 1, 11 (one stat: their time), 12 (a totem) and 13. That's five slides, about 90 seconds, and still a complete evening.

The backend never decides which slides to show. It returns everything it knows, with `null` for missing data, and the frontend decides. That keeps show logic in one place and testable with fixtures.
