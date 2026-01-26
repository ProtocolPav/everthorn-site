import {QuestModel} from "@/types/quests";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";

export function convertApiToZod(quest: QuestModel): QuestFormValues {
    const { start_time, end_time, ...rest } = quest;

    return {
        range: {
            start: start_time,
            end: end_time
        },
        ...rest
    } as QuestFormValues;
}

export function convertZodToApi(quest: QuestFormValues): QuestModel {
    const { range, ...rest } = quest;

    return {
        start_time: range.start,
        end_time: range.end,
        ...rest
    } as QuestModel;
}