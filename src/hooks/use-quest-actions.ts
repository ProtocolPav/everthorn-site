import { toast } from "sonner";
import { QUEST_EXTENSION_DAYS } from "@/config/quests/constants.ts";
import {
    invalidateListQuestsV1GuildsMeQuestsGet,
    usePartialUpdateQuestV1GuildsMeQuestsQuestIdPatch
} from "@/api/nexuscore/quests/quests.ts";
import {QuestOut} from "@/api/nexuscore/model";
import {useQueryClient} from "@tanstack/react-query";

export function useQuestActions(quest: QuestOut) {
    const queryClient = useQueryClient();
    const updateQuest = usePartialUpdateQuestV1GuildsMeQuestsQuestIdPatch()

    function expireNow() {
        updateQuest.mutate(
            { questId: quest.quest_id, data: { end_time: new Date().toISOString() } },
            {
                onSuccess: async () => {
                    await invalidateListQuestsV1GuildsMeQuestsGet(queryClient)
                    toast.success(`Quest "${quest.title}" has been expired`)
                },
                onError: () => toast.error('Failed to expire quest'),
            }
        );
    }

    function extend() {
        const dateEnd = new Date(quest.end_time);
        dateEnd.setDate(dateEnd.getDate() + QUEST_EXTENSION_DAYS);
        updateQuest.mutate(
            { questId: quest.quest_id, data: { end_time: dateEnd.toISOString() } },
            {
                onSuccess: async () => {
                    await invalidateListQuestsV1GuildsMeQuestsGet(queryClient)
                    toast.success(`Quest "${quest.title}" extended by ${QUEST_EXTENSION_DAYS} days`)
                },
                onError: () => toast.error('Failed to extend quest'),
            }
        );
    }

    function resume() {
        const dateNow = new Date();
        dateNow.setDate(dateNow.getDate() + QUEST_EXTENSION_DAYS);
        updateQuest.mutate(
            { questId: quest.quest_id, data: { end_time: dateNow.toISOString() } },
            {
                onSuccess: async () => {
                    await invalidateListQuestsV1GuildsMeQuestsGet(queryClient)
                    toast.success(`Quest "${quest.title}" resumed for ${QUEST_EXTENSION_DAYS} days`)
                },
                onError: () => toast.error('Failed to resume quest'),
            }
        );
    }

    function startNow() {
        updateQuest.mutate(
            { questId: quest.quest_id, data: { start_time: new Date().toISOString() } },
            {
                onSuccess: async () => {
                    await invalidateListQuestsV1GuildsMeQuestsGet(queryClient)
                    toast.success(`Quest "${quest.title}" will start now`)
                },
                onError: () => toast.error('Failed to start quest'),
            }
        );
    }

    function exportJson() {
        navigator.clipboard.writeText(JSON.stringify(quest, null, 2));
        toast.info('Copied to clipboard!');
    }

    return { expireNow, extend, resume, startNow, exportJson };
}
