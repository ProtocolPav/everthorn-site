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

export function convertZodToApi(quest: QuestFormValues): QuestIn | QuestUpdate {
    const { range, ...rest } = quest;

    return {
        start_time: range.start,
        end_time: range.end,
        ...rest
    } as QuestIn | QuestUpdate;
}