// hooks/use-quests.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { QuestModel, QuestParams, UpdateQuestPayload } from "@/types/quests";

export type { QuestParams };

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

const updateQuestFetcher = async (
    questId: string,
    payload: UpdateQuestPayload
): Promise<QuestModel> => {
    const response = await fetch(`${API_URL}/v0.2/quests/${questId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to update quest');
    return response.json();
};

export function useQuests(params: QuestParams = {}) {
    return useQuery({
        queryKey: ['quests', params],
        queryFn: () => {
            const url = new URL(`${API_URL}/v0.2/quests`);
            Object.entries(params).forEach(([key, value]) => {
                if (value === undefined || value === null) return;
                if (Array.isArray(value)) {
                    value.forEach((item) => url.searchParams.append(key, String(item)));
                } else {
                    url.searchParams.append(key, String(value));
                }
            });
            return list_fetcher(url.toString());
        },
        placeholderData: keepPreviousData,
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
            queryClient.setQueryData(['quests', variables.questId], data);
            queryClient.invalidateQueries({ queryKey: ['quests'] });
        },
    });
}

const createQuestFetcher = async (payload: object): Promise<QuestModel> => {
    const response = await fetch(`${API_URL}/v0.2/quests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to create quest');
    return response.json();
};

export function useCreateQuest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: object) => createQuestFetcher(payload),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['quests'] }); },
    });
}

// Omit 'page' from the params since the hook controls it
type InfiniteQuestParams = Omit<QuestParams, 'page'>;

export function useInfiniteQuests(params: InfiniteQuestParams = {}) {
    const pageSize = params.page_size || 100;
    return useInfiniteQuery({
        queryKey: ['quests', 'infinite', params],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const url = new URL(`${API_URL}/v0.2/quests`);
            url.searchParams.append('page', String(pageParam));
            url.searchParams.append('page_size', String(pageSize));
            Object.entries(params).forEach(([key, value]) => {
                if (value === undefined || value === null || key === 'page_size') return;
                if (Array.isArray(value)) {
                    value.forEach((item) => url.searchParams.append(key, String(item)));
                } else {
                    url.searchParams.append(key, String(value));
                }
            });
            return list_fetcher(url.toString());
        },
        getNextPageParam: (lastPage, allPages) => {
            const items = Array.isArray(lastPage) ? lastPage : (lastPage as { data?: QuestModel[] }).data || [];
            return items.length < pageSize ? undefined : allPages.length + 1;
        },
        gcTime: Infinity,
    });
}
