import { useState, useCallback, useMemo, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useDebounce } from './use-debounce';
import type { APIQuestSchema } from '@/types/quest';

// Constants
const PAGE_SIZE = 100;

// Types
interface UIQuestFilters {
    creator_thorny_ids: number[];
    quest_types: string[];
    time_start: string;
    time_end: string;
}

interface APIQuestFilters {
    creator_thorny_ids: number[];
    quest_types: string[];
    time_start: string;
    time_end: string;
    page: number;
    page_size: number;
}

// Utility functions
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const buildQuery = (filters: Partial<APIQuestFilters>): string => {
    const params = new URLSearchParams();

    if (filters.creator_thorny_ids && filters.creator_thorny_ids.length > 0) {
        filters.creator_thorny_ids.forEach(id => params.append('creator_thorny_ids', id.toString()));
    }

    if (filters.quest_types && filters.quest_types.length > 0) {
        filters.quest_types.forEach(type => params.append('quest_types', type));
    }

    if (filters.time_start) {
        params.append('time_start', filters.time_start);
    }

    if (filters.time_end) {
        params.append('time_end', filters.time_end);
    }

    if (filters.page) {
        params.append('page', filters.page.toString());
    }

    if (filters.page_size) {
        params.append('page_size', filters.page_size.toString());
    }

    return params.toString();
};

// Main hook
export function useQuestList() {
    const [uiFilters, setUiFilters] = useState<UIQuestFilters>({
        creator_thorny_ids: [],
        quest_types: [],
        time_start: '',
        time_end: '',
    });

    // Debounce the filters
    const debouncedFilters = useDebounce(uiFilters, 800);

    // API filters - convert UI filters to API format
    const apiFilters = useMemo((): Omit<APIQuestFilters, 'page' | 'page_size'> => ({
        creator_thorny_ids: debouncedFilters.creator_thorny_ids,
        quest_types: debouncedFilters.quest_types,
        time_start: uiFilters.time_start,
        time_end: uiFilters.time_end,
    }), [debouncedFilters, uiFilters]);

    const getActiveFilterCount = useCallback(() => {
        let count = 0;
        if (uiFilters.creator_thorny_ids.length > 0) count++;
        if (uiFilters.quest_types.length > 0) count++;
        if (uiFilters.time_start) count++;
        if (uiFilters.time_end) count++;
        return count;
    }, [uiFilters]);

    // SWR getKey
    const getKey = useCallback((pageIndex: number, previousPageData: any) => {
        if (previousPageData && previousPageData.length === 0) return null;
        const query = buildQuery({
            ...apiFilters,
            page: pageIndex + 1,
            page_size: PAGE_SIZE,
        });
        return `/nexuscore-api/v0.2/quests?${query}`;
    }, [apiFilters]);

    const { data, size, setSize, isValidating, error } = useSWRInfinite<APIQuestSchema[]>(
        getKey,
        fetcher,
        {
            revalidateFirstPage: true,
            persistSize: true,
        }
    );

    const quests = data ? data.flat() : [];
    const isLoadingMore = isValidating && data && data[data.length - 1];
    const isEmpty = data?.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
    const isLoading = !data && !error;

    // Handle filter change
    const handleFilterChange = useCallback((field: keyof UIQuestFilters, value: any) => {
        setUiFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    // Clear filters
    const clearFilters = useCallback(() => {
        setUiFilters({
            creator_thorny_ids: [],
            quest_types: [],
            time_start: '',
            time_end: '',
        });
        setSize(1);
    }, [setSize]);

    // Reset pagination when API filters change
    useEffect(() => {
        setSize(1);
    }, [apiFilters, setSize]);

    return {
        quests,
        uiFilters,
        debouncedFilters,
        getActiveFilterCount,
        handleFilterChange,
        clearFilters,
        size,
        setSize,
        isValidating,
        isLoading,
        isLoadingMore,
        isReachingEnd,
        isError: error,
        error,
    };
}
