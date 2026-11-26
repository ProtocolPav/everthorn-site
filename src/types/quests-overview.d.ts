/**
 * Concept contract for the future global quest overview endpoint.
 *
 * Proposed route: `GET /v1/guilds/me/quests/statistics/overview`
 *
 * The dashboard renders from this shape. Until the backend ships it,
 * `useQuestsOverview` returns a client-computed fallback (counts only,
 * engagement fields zeroed) so the UI never breaks. Swap the fallback
 * for the real fetcher once the route exists — no component changes needed.
 */
export interface QuestsOverviewCounts {
    total: number;
    active: number;
    scheduled: number;
    expired: number;
    ending_within_7d: number;
}

export interface QuestsOverviewEngagement {
    accepts: number;
    started: number;
    completed: number;
    failed: number;
    unique_players: number;
    avg_completion_rate: number;
    median_completion_seconds: number | null;
}

export interface QuestsOverviewDay {
    date: string;
    accepts: number;
    completions: number;
}

export interface QuestsOverviewTopQuest {
    quest_id: number;
    title: string;
    accepts: number;
    completion_rate: number;
}

export type QuestAttentionReason = "low_start_rate" | "high_dropoff" | "ending_soon_no_completions";

export interface QuestsOverviewAttention {
    quest_id: number;
    title: string;
    reason: QuestAttentionReason;
    detail: string;
}

export interface QuestsOverviewOut {
    counts: QuestsOverviewCounts;
    engagement_30d: QuestsOverviewEngagement;
    daily_rollup_30d: QuestsOverviewDay[];
    top_quests: QuestsOverviewTopQuest[];
    needs_attention: QuestsOverviewAttention[];
}
