import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { formatDate, subDays } from "date-fns";
import {
    getGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGetQueryOptions,
    useListQuestsV1GuildsMeQuestsGet,
} from "@/api/nexuscore/quests/quests.ts";
import { daysUntil, getQuestLifecycle, isEndingSoon } from "@/lib/quest-lifecycle.ts";
import { getQuestHealth } from "@/lib/quest-health.ts";
import { REGULAR_QUEST_LIST_PARAMS } from "@/config/quests/constants.ts";
import type { QuestOut, QuestStatisticsOut } from "@/api/nexuscore/model";
import type {
    QuestsOverviewAttention,
    QuestsOverviewDay,
    QuestsOverviewOut,
} from "@/types/quests-overview.d.ts";

/** Length of the overview window. The previous window of the same length drives trends. */
export const OVERVIEW_WINDOW_DAYS = 30;

/** Upper bound on per-quest statistics requests the overview fires. */
const MAX_TRACKED_QUESTS = 40;

interface QuestsOverviewResult {
    data: QuestsOverviewOut | undefined;
    /** True until the quest list and at least the first statistics batch are in. */
    isLoading: boolean;
    isError: boolean;
}

const dayKey = (date: Date) => formatDate(date, "yyyy-MM-dd");

/**
 * Quests whose activity can land inside the current or previous window:
 * anything running now, plus anything that ended within the last two windows.
 */
function pickTrackedQuests(quests: QuestOut[], now: Date): QuestOut[] {
    const cutoff = subDays(now, OVERVIEW_WINDOW_DAYS * 2).getTime();
    return quests
        .filter((quest) => {
            const lifecycle = getQuestLifecycle(quest, now);
            if (lifecycle === "active") return true;
            return lifecycle === "expired" && new Date(quest.end_time).getTime() >= cutoff;
        })
        .sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
        .slice(0, MAX_TRACKED_QUESTS);
}

function buildAttention(quest: QuestOut, stats: QuestStatisticsOut, now: Date): QuestsOverviewAttention | null {
    if (stats.total_accepts === 0) return null;

    if (stats.total_completed === 0 && isEndingSoon(quest, 3, now)) {
        const days = Math.max(0, daysUntil(new Date(quest.end_time), now));
        return {
            quest_id: quest.quest_id,
            title: quest.title,
            reason: "ending_soon_no_completions",
            tone: "bad",
            label: "Ending with no completions",
            detail: `${stats.total_accepts.toLocaleString()} accepts, none finished, ${days === 0 ? "ends today" : `${days}d left`}.`,
        };
    }

    const health = getQuestHealth(stats);
    if (health.tone !== "warn" && health.tone !== "bad") return null;
    if (health.kind === "healthy" || health.kind === "no_data") return null;

    return {
        quest_id: quest.quest_id,
        title: quest.title,
        reason: health.kind,
        tone: health.tone,
        label: health.label,
        detail: health.reason,
    };
}

function aggregate(quests: QuestOut[], tracked: QuestOut[], statsById: Map<number, QuestStatisticsOut>, now: Date): QuestsOverviewOut {
    let active = 0;
    let scheduled = 0;
    let expired = 0;
    let ending_within_7d = 0;
    for (const quest of quests) {
        const lifecycle = getQuestLifecycle(quest, now);
        if (lifecycle === "active") active += 1;
        else if (lifecycle === "scheduled") scheduled += 1;
        else expired += 1;
        if (isEndingSoon(quest, 7, now)) ending_within_7d += 1;
    }

    // Pre-fill every day so the chart has a continuous axis even on quiet days.
    const days = new Map<string, QuestsOverviewDay>();
    for (let offset = OVERVIEW_WINDOW_DAYS - 1; offset >= 0; offset--) {
        const date = dayKey(subDays(now, offset));
        days.set(date, { date, accepts: 0, completions: 0 });
    }
    const windowStart = dayKey(subDays(now, OVERVIEW_WINDOW_DAYS - 1));
    const previousStart = dayKey(subDays(now, OVERVIEW_WINDOW_DAYS * 2 - 1));

    let accepts = 0;
    let completed = 0;
    let failed = 0;
    let abandoned = 0;
    let previousAccepts = 0;
    let previousCompleted = 0;

    const top: QuestsOverviewOut["top_quests"] = [];
    const attention: QuestsOverviewAttention[] = [];

    for (const quest of tracked) {
        const stats = statsById.get(quest.quest_id);
        if (!stats) continue;

        let questAccepts = 0;
        let questCompleted = 0;
        for (const entry of stats.daily_activity) {
            const date = entry.date.slice(0, 10);
            if (date >= windowStart) {
                const day = days.get(date);
                if (day) {
                    day.accepts += entry.accepts;
                    day.completions += entry.completions;
                }
                accepts += entry.accepts;
                completed += entry.completions;
                failed += entry.failures;
                abandoned += entry.abandonments;
                questAccepts += entry.accepts;
                questCompleted += entry.completions;
            } else if (date >= previousStart) {
                previousAccepts += entry.accepts;
                previousCompleted += entry.completions;
            }
        }

        if (questAccepts > 0) {
            top.push({
                quest_id: quest.quest_id,
                title: quest.title,
                accepts: questAccepts,
                completion_rate: questCompleted / questAccepts,
            });
        }

        if (getQuestLifecycle(quest, now) === "active") {
            const flag = buildAttention(quest, stats, now);
            if (flag) attention.push(flag);
        }
    }

    top.sort((a, b) => b.accepts - a.accepts);
    attention.sort((a, b) => (a.tone === b.tone ? 0 : a.tone === "bad" ? -1 : 1));

    return {
        window_days: OVERVIEW_WINDOW_DAYS,
        tracked_quests: statsById.size,
        counts: { total: quests.length, active, scheduled, expired, ending_within_7d },
        engagement: {
            accepts,
            completed,
            failed,
            abandoned,
            completion_rate: accepts > 0 ? completed / accepts : 0,
            previous_accepts: previousAccepts > 0 ? previousAccepts : null,
            previous_completion_rate: previousAccepts > 0 ? previousCompleted / previousAccepts : null,
        },
        daily: [...days.values()],
        top_quests: top.slice(0, 5),
        needs_attention: attention,
    };
}

/**
 * Overview figures for the quests home: lifecycle counts, a 30-day activity
 * series, top quests and quests that need attention.
 *
 * There is no guild-wide statistics endpoint, so this fans out to each live or
 * recently-ended quest's `/statistics` (shared cache with the quest hub) and
 * sums the results. Quests without statistics yet are simply left out.
 */
export function useQuestsOverview(): QuestsOverviewResult {
    const questsQuery = useListQuestsV1GuildsMeQuestsGet(REGULAR_QUEST_LIST_PARAMS);
    const quests = questsQuery.data;

    // Rounded to the hour so the memo below doesn't recompute on every render.
    const hour = Math.floor(Date.now() / 3_600_000);
    const tracked = useMemo(
        () => (quests ? pickTrackedQuests(quests, new Date(hour * 3_600_000)) : []),
        [quests, hour],
    );

    const statsQueries = useQueries({
        queries: tracked.map((quest) =>
            getGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGetQueryOptions(quest.quest_id),
        ),
    });

    // useQueries returns a new array each render; key the memo on what changed.
    const statsKey = statsQueries.map((query) => query.dataUpdatedAt).join(",");
    const statsPending = statsQueries.some((query) => query.isPending);

    const data = useMemo<QuestsOverviewOut | undefined>(() => {
        if (!quests) return undefined;
        const statsById = new Map<number, QuestStatisticsOut>();
        statsQueries.forEach((query, index) => {
            if (query.data) statsById.set(tracked[index].quest_id, query.data);
        });
        return aggregate(quests, tracked, statsById, new Date());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quests, tracked, statsKey]);

    return {
        data,
        isLoading: questsQuery.isLoading || (tracked.length > 0 && statsPending),
        isError: questsQuery.isError,
    };
}
