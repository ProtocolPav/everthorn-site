import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {QuestIn, QuestOut, QuestUpdate} from "@/api/nexuscore/model";

export function convertApiToZod(quest: QuestOut): QuestFormValues {
    const { start_time, end_time, created_by, objectives, ...rest } = quest;

    return {
        range: {
            start: start_time,
            end: end_time
        },
        created_by: created_by.thorny_id,
        ...rest,
        objectives: objectives.map(objective => ({
            ...objective,
            rewards: objective.rewards.map(reward => ({
                ...reward,
                isBalance: reward.balance !== null && reward.balance !== undefined
            }))
        }))
    } as QuestFormValues;
}

interface ConvertZodToApiOptions {
    /**
     * Leave out quest_type, start_time and end_time. Required when updating a
     * daily quest: Nexuscore rejects edits to those fields (400).
     */
    omitSchedule?: boolean;
}

export function convertZodToApi(quest: QuestFormValues, options: ConvertZodToApiOptions = {}): QuestIn | QuestUpdate {
    const { range, ...rest } = quest;

    if (options.omitSchedule) {
        const { quest_type: _questType, ...withoutType } = rest;
        return withoutType as QuestUpdate;
    }

    return {
        start_time: range.start,
        end_time: range.end,
        ...rest
    } as QuestIn | QuestUpdate;
}