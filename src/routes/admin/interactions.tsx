import { createFileRoute } from '@tanstack/react-router';
import { InteractionsFilter } from '@/components/features/interactions/interactions-filter';
import { InteractionsTable } from '@/components/features/interactions/interactions-table';
import {useListInteractionsV1GuildsMeInteractionsGetInfinite} from "@/api/nexuscore/guilds/guilds.ts";
import {useCallback, useMemo, useState} from "react";
import {useDebounce} from "@/hooks/use-debounce.ts";
import {InteractionOut, InteractionOutType, ListInteractionsV1GuildsMeInteractionsGetParams} from "@/api/nexuscore/model";

export const Route = createFileRoute('/admin/interactions')({
    staticData: {
        pageTitle: 'Interactions',
    },
    component: InteractionsPage,
});

const EMPTY_FILTERS: ListInteractionsV1GuildsMeInteractionsGetParams = {
    interaction_types: [],
    dimensions:        [],
    references:        [],
    thorny_ids:        [],
    coordinates:       [],
    coordinates_end:   [],
    time_start:        '',
    time_end:          '',
};

function cleanParams<T extends Record<string, unknown>>(params: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => {
            if (Array.isArray(value)) return value.length > 0;
            return value !== '' && value !== null && value !== undefined;
        }),
    ) as Partial<T>;
}

function InteractionsPage() {
    const [uiFilters, setUiFilters] = useState<ListInteractionsV1GuildsMeInteractionsGetParams>(EMPTY_FILTERS);
    const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);

    const debouncedFilters = useDebounce(uiFilters, 800);

    const params: ListInteractionsV1GuildsMeInteractionsGetParams = useMemo(() => cleanParams({
        coordinates: uiFilters.coordinates ? uiFilters.coordinates : [],
        coordinates_end: uiFilters.coordinates_end ? uiFilters.coordinates_end : [],
        thorny_ids: uiFilters.thorny_ids,
        interaction_types: debouncedFilters.interaction_types as InteractionOutType[],
        references: debouncedFilters.references,
        dimensions: debouncedFilters.dimensions,
        time_start: uiFilters.time_start,
        time_end: uiFilters.time_end,
        page_size: 20
    }), [debouncedFilters, uiFilters]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isError,
        refetch,
    } = useListInteractionsV1GuildsMeInteractionsGetInfinite(params, {
        query: {
            initialPageParam: 1,
            getNextPageParam: (lastPage: InteractionOut[], allPages: InteractionOut[][]) => {
                return lastPage.length < 20 ? undefined : allPages.length + 1
            },
            refetchInterval: isAutoRefreshEnabled ? 10_000 : false,
            refetchOnWindowFocus: isAutoRefreshEnabled,
        },
    });

    const interactions = useMemo(() => data?.pages.flat() ?? [], [data]);

    const activeFilterCount = useMemo(() =>
            Object.values(uiFilters).reduce<number>((count, value) => {
                const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);
                return count + (hasValue ? 1 : 0);
            }, 0),
        [uiFilters]);

    const handleFilterChange = useCallback(<K extends keyof ListInteractionsV1GuildsMeInteractionsGetParams>(
        field: K, value: ListInteractionsV1GuildsMeInteractionsGetParams[K],
    ) => {
        setUiFilters((prev) => ({ ...prev, [field]: value }));
    }, []);

    const clearFilters = useCallback(() => setUiFilters(EMPTY_FILTERS), []);


    return (
        <div className="grid gap-3 p-4 relative">
            <div className="sticky top-0 z-20 grid gap-3">
                <InteractionsFilter
                    uiFilters={uiFilters}
                    activeFilterCount={activeFilterCount}
                    resultCount={interactions.length}
                    isFetching={isFetching}
                    isAutoRefreshEnabled={isAutoRefreshEnabled}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    onRefresh={refetch}
                    onToggleAutoRefresh={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}
                />
            </div>
            <InteractionsTable
                interactions={interactions}
                isFetching={isFetching}
                isFetchingNextPage={isFetchingNextPage}
                isError={isError}
                hasNextPage={hasNextPage}
                onFetchNextPage={fetchNextPage}
                onRetry={refetch}
            />
        </div>
    );
}