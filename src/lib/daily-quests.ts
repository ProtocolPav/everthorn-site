import { formatNamespacedId } from "@/config/minecraft-options.ts";
import type { DailyQuestOut, ObjectiveOut, QuestOut } from "@/api/nexuscore/model";

/**
 * Helpers for daily quests. Dailies are keyed by a UTC date ("YYYY-MM-DD")
 * and start at 00:00 UTC on that date.
 */

/** The UTC date of `date` as "YYYY-MM-DD". */
export function toUtcDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

/** Shifts a "YYYY-MM-DD" date by whole days. */
export function addUtcDays(questDate: string, days: number): string {
    const date = parseQuestDate(questDate);
    date.setUTCDate(date.getUTCDate() + days);
    return toUtcDateString(date);
}

/** Midnight UTC of a "YYYY-MM-DD" date. */
export function parseQuestDate(questDate: string): Date {
    return new Date(`${questDate}T00:00:00Z`);
}

const shortDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

/** "Wed 25 Nov". Formatted in UTC so the label matches the daily's date everywhere. */
export function formatQuestDate(questDate: string): string {
    return shortDate.format(parseQuestDate(questDate));
}

export function isDailyEdited(daily: DailyQuestOut): boolean {
    return Boolean(daily.quest.last_edited_at);
}

/** Total rewards across the quest's objectives. */
export function countQuestRewards(quest: QuestOut): number {
    return quest.objectives.reduce((total, objective) => total + objective.rewards.length, 0);
}

export function getObjectiveVerb(objectiveType: ObjectiveOut["objective_type"]): string {
    switch (objectiveType) {
        case "kill":
            return "Kill";
        case "mine":
            return "Mine";
        case "scriptevent":
            return "Initiate Scriptevent";
        case "visit":
            return "Locate";
    }
}

/** Any target or daily template target option: only the identifying fields matter. */
type AnyTarget =
    | { target_type: "kill"; entity: string }
    | { target_type: "mine"; block: string }
    | { target_type: "scriptevent"; script_id: string }
    | { target_type: "visit"; helper_text: string };

export function getTargetLabel(target: AnyTarget): string {
    switch (target.target_type) {
        case "kill":
            return target.entity ? formatNamespacedId(target.entity) : "";
        case "mine":
            return target.block ? formatNamespacedId(target.block) : "";
        case "scriptevent":
            return target.script_id ? formatNamespacedId(target.script_id) : "";
        case "visit":
            return target.helper_text;
    }
}
