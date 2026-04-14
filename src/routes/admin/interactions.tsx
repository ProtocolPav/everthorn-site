import { createFileRoute } from '@tanstack/react-router';
import { useInteractions } from '@/hooks/use-interactions';
import { InteractionsFilter } from '@/components/features/interactions/interactions-filter';
import { InteractionsTable } from '@/components/features/interactions/interactions-table';

export const Route = createFileRoute('/admin/interactions')({
    staticData: {
        pageTitle: 'Interactions',
    },
    component: InteractionsPage,
});

function InteractionsPage() {
    const {
        uiFilters,
        interactions,
        activeFilterCount,
        handleFilterChange,
        clearFilters,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isError,
        refetch,
        isAutoRefreshEnabled,
        setIsAutoRefreshEnabled,
    } = useInteractions();

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
                hasNextPage={!!hasNextPage}
                onFetchNextPage={fetchNextPage}
                onRetry={refetch}
            />
        </div>
    );
}