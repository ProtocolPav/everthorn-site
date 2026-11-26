/**
 * Shape of the quests overview shown above the quest search.
 *
 * Built client-side by `useQuestsOverview` from each live quest's
 * `/statistics` response. If the backend ever ships
 * `GET /v1/guilds/me/quests/statistics/overview`, it should return this shape
 * so the hook can swap its fetcher without component changes.
 */
export interface QuestsOverviewCounts {
    total: number;
    active: number;
    scheduled: number;
    expired: number;
    ending_within_7d: number;
}

export interface QuestsOverviewEngagement {
    /** Accepts across all tracked quests inside the window. */
    accepts: number;
    completed: number;
    failed: number;
    abandoned: number;
    /** completed / accepts inside the window, 0 when there are no accepts. */
    completion_rate: number;
    /** Same figures for the window before, for the trend arrow. Null if no data. */
    previous_accepts: number | null;
    previous_completion_rate: number | null;
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

export type QuestAttentionReason = "low_start_rate" | "high_dropoff" | "giving_up" | "ending_soon_no_completions";

export interface QuestsOverviewAttention {
    quest_id: number;
    title: string;
    reason: QuestAttentionReason;
    tone: "warn" | "bad";
    label: string;
    detail: string;
}

export interface QuestsOverviewOut {
    window_days: number;
    /** How many quests' statistics fed the figures below. */
    tracked_quests: number;
    counts: QuestsOverviewCounts;
    engagement: QuestsOverviewEngagement;
    daily: QuestsOverviewDay[];
    top_quests: QuestsOverviewTopQuest[];
    needs_attention: QuestsOverviewAttention[];
}
