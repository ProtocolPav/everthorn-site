// hooks/use-quests.ts
import {useQuery, useMutation, useQueryClient, keepPreviousData, useInfiniteQuery} from '@tanstack/react-query';
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

export interface QuestParams {
    creator_thorny_ids?: number[];
    quest_types?: string[];
    time_start?: string; // ISO Date string
    time_end?: string;   // ISO Date string
    active?: boolean;
    future?: boolean;
    past?: boolean;
    page?: number;
    page_size?: number;
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

export function useQuests(params: QuestParams = {}) {
    return useQuery({
        queryKey: ['quests', params],
        queryFn: () => {
            const url = new URL(`${API_URL}/v0.2/quests`);

            // Helper to append params
            Object.entries(params).forEach(([key, value]) => {
                if (value === undefined || value === null) return;

                if (Array.isArray(value)) {
                    // Handle arrays: creator_thorny_ids=1&creator_thorny_ids=2
                    value.forEach((item) => url.searchParams.append(key, String(item)));
                } else {
                    // Handle primitives
                    url.searchParams.append(key, String(value));
                }
            });

            return list_fetcher(url.toString());
        },
        // Keep previous data while fetching new pages/filters for smoother UI
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
            // Update the specific quest in cache
            queryClient.setQueryData(['quests', variables.questId], data);

            // Invalidate and refetch the quests list
            queryClient.invalidateQueries({ queryKey: ['quests'] });
        },
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

            // Add page params
            url.searchParams.append('page', String(pageParam));
            url.searchParams.append('page_size', String(pageSize));

            // Add standard filters
            Object.entries(params).forEach(([key, value]) => {
                if (value === undefined || value === null || key === 'page_size') return;
                if (Array.isArray(value)) {
                    value.forEach((item) => url.searchParams.append(key, String(item)));
                } else {
                    url.searchParams.append(key, String(value));
                }
            });

            // Assuming list_fetcher returns the raw data.
            // Adjust return type if your API returns { data: [], meta: {} }
            return list_fetcher(url.toString());
        },
        getNextPageParam: (lastPage, allPages) => {
            // If the last page has fewer items than the page size, we've reached the end
            // You might need to adjust this depending on if your API returns a nested 'data' array
            const items = Array.isArray(lastPage) ? lastPage : lastPage.data || [];
            return items.length < pageSize ? undefined : allPages.length + 1;
        },
        gcTime: Infinity,
    });
}
