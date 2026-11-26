import type { QuestStatisticsOut } from "@/api/nexuscore/model";

export interface QuestHealth {
    label: string;
    tone: "good" | "warn" | "bad" | "idle";
    reason: string;
}

export function getQuestHealth(stats: QuestStatisticsOut): QuestHealth {
    if (stats.total_accepts === 0) {
        return { label: "No data yet", tone: "idle", reason: "Nobody has accepted this quest." };
    }
    if (stats.started_rate < 0.4) {
        return {
            label: "Players aren't starting",
            tone: "bad",
            reason: `Only ${(stats.started_rate * 100).toFixed(0)}% begin after accepting. The first objective may be unclear.`,
        };
    }
    const abandonShare = stats.total_started > 0 ? stats.total_abandoned / stats.total_started : 0;
    if (abandonShare >= 0.4) {
        return {
            label: "Players are giving up",
            tone: "warn",
            reason: `${(abandonShare * 100).toFixed(0)}% of players who start drop the quest or let it expire.`,
        };
    }
    if (stats.completion_rate < 0.3 && stats.total_started > 0) {
        return {
            label: "Players are dropping off",
            tone: "warn",
            reason: `Only ${(stats.completion_rate * 100).toFixed(0)}% finish. The objective breakdown shows where they stop.`,
        };
    }
    return {
        label: "Running well",
        tone: "good",
        reason: `${(stats.completion_rate * 100).toFixed(0)}% of accepts are completed.`,
    };
}

/** Dot colour per health tone, shared by the hub header and the quests overview. */
export const toneDot: Record<QuestHealth["tone"], string> = {
    good: "bg-emerald-500",
    warn: "bg-amber-500",
    bad: "bg-rose-500",
    idle: "bg-muted-foreground/40",
};
