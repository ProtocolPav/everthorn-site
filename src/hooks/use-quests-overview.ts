import { useMemo } from "react";
import { useListQuestsV1GuildsMeQuestsGet } from "@/api/nexuscore/quests/quests.ts";
import { getQuestLifecycle, isEndingSoon } from "@/lib/quest-lifecycle.ts";
import type { QuestsOverviewOut } from "@/types/quests-overview.d.ts";

export const QUESTS_OVERVIEW_URL = "/v1/guilds/me/quests/statistics/overview";

interface QuestsOverviewResult {
    data: QuestsOverviewOut | undefined;
    isLoading: boolean;
    isError: boolean;
    /** True while the backend route above doesn't exist — counts are client-computed. */
    isConceptFallback: boolean;
}

/**
 * Concept hook for the dashboard stats strip.
 *
 * TODO(backend): replace the client fallback with a real query once
 * `GET ${QUESTS_OVERVIEW_URL}` ships. Response must match `QuestsOverviewOut`.
 * Until then engagement/top/attention sections are empty and the strip
 * renders lifecycle counts only.
 */
export function useQuestsOverview(): QuestsOverviewResult {
    const { data: quests, isLoading, isError } = useListQuestsV1GuildsMeQuestsGet();

    const data = useMemo<QuestsOverviewOut | undefined>(() => {
        if (!quests) return undefined;
        let active = 0;
        let scheduled = 0;
        let expired = 0;
        let ending_within_7d = 0;
        for (const q of quests) {
            const lifecycle = getQuestLifecycle(q);
            if (lifecycle === "active") active += 1;
            else if (lifecycle === "scheduled") scheduled += 1;
            else expired += 1;
            if (isEndingSoon(q)) ending_within_7d += 1;
        }
        return {
            counts: { total: quests.length, active, scheduled, expired, ending_within_7d },
            engagement_30d: {
                accepts: 0,
                started: 0,
                completed: 0,
                failed: 0,
                unique_players: 0,
                avg_completion_rate: 0,
                median_completion_seconds: null,
            },
            daily_rollup_30d: [],
            top_quests: [],
            needs_attention: [],
        };
    }, [quests]);

    return { data, isLoading, isError, isConceptFallback: true };
}
