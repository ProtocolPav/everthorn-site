// hooks/use-quests.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QuestModel } from "@/types/quests";

const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL;

const list_fetcher = async (url: string): Promise<QuestModel[]> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch quests data');
    }
    return response.json();
};

const fetcher = async (url: string): Promise<QuestModel> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch quests data');
    }
    return response.json();
};

interface UpdateQuestPayload {
    title?: string | null;
    description?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    quest_type?: "story" | "side" | "minor" | null;
    tags?: string[] | null;
}

const updateQuestFetcher = async (
    questId: string,
    payload: UpdateQuestPayload
): Promise<QuestModel> => {
    const response = await fetch(`${API_URL}/v0.2/quests/${questId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to update quest');
    }

    return response.json();
};

export function useQuests() {
    return useQuery({
        queryKey: ['quests'],
        queryFn: () => list_fetcher(`${API_URL}/v0.2/quests`),
        gcTime: Infinity,
    });
}

export function useQuest(questId: string | null | undefined) {
    return useQuery({
        queryKey: ['quests', questId],
        queryFn: () => fetcher(`${API_URL}/v0.2/quests/${questId}`),
        enabled: !!questId,
        gcTime: Infinity,
    });
}

export function useUpdateQuest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ questId, payload }: { questId: string; payload: UpdateQuestPayload }) =>
            updateQuestFetcher(questId, payload),
        onSuccess: (data, variables) => {
            // Update the specific quest in cache
            queryClient.setQueryData(['quests', variables.questId], data);

            // Invalidate and refetch the quests list
            queryClient.invalidateQueries({ queryKey: ['quests'] });
        },
    });
}
