// hooks/use-interactions.ts
import { useState, useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from './use-debounce';
import type { Interaction, UIFilters, InteractionFilters } from '@/types/interactions';

const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL;
const PAGE_SIZE = 50;

const EMPTY_FILTERS: UIFilters = {
    interaction_types: [],
    dimensions:        [],
    references:        [],
    thorny_ids:        [],
    coordinates:       [],
    coordinates_end:   [],
    time_start:        '',
    time_end:          '',
};

function parseCoordinates(coords: string[]): number[] {
    return coords.flatMap((coord) => {
        const parts = coord.split(',').map((p) => parseFloat(p.trim()));
        return parts.length === 3 && parts.every(isFinite) ? parts : [];
    });
}

async function fetchInteractionsPage(url: string): Promise<Interaction[]> {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch interactions');
    return response.json();
}

export function useInteractions() {
    const [uiFilters, setUiFilters] = useState<UIFilters>(EMPTY_FILTERS);
    const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);

    const debouncedFilters = useDebounce(uiFilters, 800);

    const apiFilters = useMemo((): InteractionFilters => ({
        coordinates:       parseCoordinates(uiFilters.coordinates),
        coordinates_end:   parseCoordinates(uiFilters.coordinates_end),
        thorny_ids:        uiFilters.thorny_ids,
        interaction_types: debouncedFilters.interaction_types,
        references:        debouncedFilters.references,
        dimensions:        debouncedFilters.dimensions,
        time_start:        uiFilters.time_start,
        time_end:          uiFilters.time_end,
    }), [debouncedFilters, uiFilters]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isError,
        error,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['interactions', 'infinite', apiFilters],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const url = new URL(`${API_URL}/v0.2/events/interactions`);
            url.searchParams.append('page', String(pageParam));
            url.searchParams.append('page_size', String(PAGE_SIZE));

            Object.entries(apiFilters).forEach(([key, value]) => {
                if (value === undefined || value === null) return;
                if (Array.isArray(value)) {
                    value.forEach((v) => url.searchParams.append(key, String(v)));
                } else if (String(value).trim()) {
                    url.searchParams.append(key, String(value));
                }
            });

            return fetchInteractionsPage(url.toString());
        },
        getNextPageParam: (lastPage, allPages) => {
            const items = Array.isArray(lastPage) ? lastPage : [];
            return items.length < PAGE_SIZE ? undefined : allPages.length + 1;
        },
        refetchInterval:      isAutoRefreshEnabled ? 10_000 : false,
        refetchOnWindowFocus: isAutoRefreshEnabled,
        staleTime:            2_000,
        gcTime:               Infinity,
    });

    const interactions = useMemo(() => data?.pages.flat() ?? [], [data]);

    const activeFilterCount = useMemo(() =>
            Object.values(uiFilters).reduce<number>((count, value) => {
                const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);
                return count + (hasValue ? 1 : 0);
            }, 0),
        [uiFilters]);

    const handleFilterChange = useCallback(<K extends keyof UIFilters>(
        field: K,
        value: UIFilters[K],
    ) => {
        setUiFilters((prev) => ({ ...prev, [field]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setUiFilters(EMPTY_FILTERS);
    }, []);

    return {
        // Filters
        uiFilters,
        debouncedFilters,
        activeFilterCount,
        handleFilterChange,
        clearFilters,

        // Data
        interactions,
        hasNextPage,
        fetchNextPage,

        // State
        isFetching,
        isFetchingNextPage,
        isError,
        error,

        // Refresh
        refetch,
        isAutoRefreshEnabled,
        setIsAutoRefreshEnabled,
    };
}