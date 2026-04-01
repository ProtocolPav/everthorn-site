import { QuestModel } from "@/types/quests";
import { useUpdateQuest } from "@/hooks/use-quests";
import { toast } from "sonner";
import { QUEST_EXTENSION_DAYS } from "@/config/quests/constants.ts";

export function useQuestActions(quest: QuestModel) {
    const updateQuest = useUpdateQuest();

    function expireNow() {
        updateQuest.mutate(
            { questId: String(quest.quest_id), payload: { end_time: new Date().toISOString() } },
            {
                onSuccess: () => toast.success(`Quest "${quest.title}" has been expired`),
                onError: () => toast.error('Failed to expire quest'),
            }
        );
    }

    function extend() {
        const dateEnd = new Date(quest.end_time);
        dateEnd.setDate(dateEnd.getDate() + QUEST_EXTENSION_DAYS);
        updateQuest.mutate(
            { questId: String(quest.quest_id), payload: { end_time: dateEnd.toISOString() } },
            {
                onSuccess: () => toast.success(`Quest "${quest.title}" extended by ${QUEST_EXTENSION_DAYS} days`),
                onError: () => toast.error('Failed to extend quest'),
            }
        );
    }

    function resume() {
        const dateNow = new Date();
        dateNow.setDate(dateNow.getDate() + QUEST_EXTENSION_DAYS);
        updateQuest.mutate(
            { questId: String(quest.quest_id), payload: { end_time: dateNow.toISOString() } },
            {
                onSuccess: () => toast.success(`Quest "${quest.title}" resumed for ${QUEST_EXTENSION_DAYS} days`),
                onError: () => toast.error('Failed to resume quest'),
            }
        );
    }

    function startNow() {
        updateQuest.mutate(
            { questId: String(quest.quest_id), payload: { start_time: new Date().toISOString() } },
            {
                onSuccess: () => toast.success(`Quest "${quest.title}" will start now`),
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
