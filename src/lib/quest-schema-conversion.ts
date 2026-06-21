import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {QuestOut} from "@/api/nexuscore/model";

export function convertApiToZod(quest: QuestOut): QuestFormValues {
    const { start_time, end_time, ...rest } = quest;

    // @ts-ignore
    return {
        range: {
            start: start_time,
            end: end_time
        },
        ...rest
    } as QuestFormValues;
}

export function convertZodToApi(quest: QuestFormValues): QuestOut {
    const { range, ...rest } = quest;

    // @ts-ignore
    return {
        start_time: range.start,
        end_time: range.end,
        ...rest
    } as QuestOut;
}