import type { QuestOut } from "@/api/nexuscore/model";

export type QuestLifecycle = "active" | "scheduled" | "expired";

export function getQuestLifecycle(quest: Pick<QuestOut, "start_time" | "end_time">, now: Date = new Date()): QuestLifecycle {
    const start = new Date(quest.start_time).getTime();
    const end = new Date(quest.end_time).getTime();
    const t = now.getTime();
    if (t < start) return "scheduled";
    if (t > end) return "expired";
    return "active";
}

export function getQuestBoundary(quest: Pick<QuestOut, "start_time" | "end_time">, lifecycle?: QuestLifecycle): Date {
    const status = lifecycle ?? getQuestLifecycle(quest);
    return new Date(status === "scheduled" ? quest.start_time : quest.end_time);
}

/** Share of the quest window already elapsed, clamped to 0–1. */
export function getQuestProgress(quest: Pick<QuestOut, "start_time" | "end_time">, now: Date = new Date()): number {
    const start = new Date(quest.start_time).getTime();
    const end = new Date(quest.end_time).getTime();
    return Math.min(1, Math.max(0, (now.getTime() - start) / Math.max(end - start, 1)));
}

/** Whole days until a boundary date (negative = past). */
export function daysUntil(date: Date, now: Date = new Date()): number {
    return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isEndingSoon(quest: Pick<QuestOut, "start_time" | "end_time">, withinDays = 7, now: Date = new Date()): boolean {
    if (getQuestLifecycle(quest, now) !== "active") return false;
    const d = daysUntil(new Date(quest.end_time), now);
    return d >= 0 && d <= withinDays;
}

/** Short human countdown: "in 3d", "in 5h" (scheduled), "2d left", "5h left" (active), "Ended". */
export function formatCountdown(quest: Pick<QuestOut, "start_time" | "end_time">, now: Date = new Date()): string {
    const lifecycle = getQuestLifecycle(quest, now);
    const boundary = getQuestBoundary(quest, lifecycle);
    const diffMs = boundary.getTime() - now.getTime();
    if (lifecycle === "expired" || diffMs <= 0) return "Ended";

    const mins = Math.max(1, Math.floor(diffMs / 60000));
    const hours = Math.floor(mins / 60);
    const amount = mins < 60 ? `${mins}m` : hours < 48 ? `${hours}h` : `${Math.ceil(hours / 24)}d`;
    return lifecycle === "scheduled" ? `in ${amount}` : `${amount} left`;
}

export type QuestUrgency = "none" | "soon" | "imminent";

/** How close an active quest is to ending: <1h imminent, <24h soon, else none. */
export function getQuestUrgency(quest: Pick<QuestOut, "start_time" | "end_time">, now: Date = new Date()): QuestUrgency {
    if (getQuestLifecycle(quest, now) !== "active") return "none";
    const remaining = new Date(quest.end_time).getTime() - now.getTime();
    if (remaining <= 60 * 60 * 1000) return "imminent";
    if (remaining <= 24 * 60 * 60 * 1000) return "soon";
    return "none";
}

/** Compact duration for a positive span: "2d 4h", "5h 12m", "12m". */
export function formatDurationCompact(ms: number): string {
    const totalMinutes = Math.max(1, Math.floor(ms / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    return `${minutes}m`;
}

/**
 * Rich client-side search across title, description, tags and quest id.
 * Used by the archive grid; cheap enough to run per keystroke on <1k quests.
 */
export function matchesQuestQuery(quest: QuestOut, query: string): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    if (String(quest.quest_id).includes(q)) return true;
    if (quest.title.toLowerCase().includes(q)) return true;
    if (quest.description?.toLowerCase().includes(q)) return true;
    if (quest.tags?.some((t) => t.toLowerCase().includes(q))) return true;
    return false;
}
