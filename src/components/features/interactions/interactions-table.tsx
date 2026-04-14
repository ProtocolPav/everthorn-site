import { useCallback } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BoxArrowDownIcon } from '@phosphor-icons/react';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import type { Interaction } from '@/types/interactions';
import {InteractionCard} from "@/components/features/interactions/interaction-card.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";

interface InteractionsTableProps {
    interactions: Interaction[];
    isFetching: boolean;
    isFetchingNextPage: boolean;
    isError: boolean;
    hasNextPage: boolean;
    onFetchNextPage: () => void;
    onRetry: () => void;
}

export function InteractionsTable({
                                      interactions,
                                      isFetching,
                                      isFetchingNextPage,
                                      isError,
                                      hasNextPage,
                                      onFetchNextPage,
                                      onRetry,
                                  }: InteractionsTableProps) {
    const loadMore = useCallback(() => {
        if (!isFetchingNextPage && hasNextPage) onFetchNextPage();
    }, [isFetchingNextPage, hasNextPage, onFetchNextPage]);

    const loadingRef = useInfiniteScroll(loadMore, isFetchingNextPage, hasNextPage);

    return (
        <Card className="p-0 max-w-screen">
            <CardContent className="p-0">
                <ScrollArea className="h-130 rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[140px]">User</TableHead>
                                <TableHead className="w-[120px]">Action</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Mainhand</TableHead>
                                <TableHead className="w-[160px]">Location</TableHead>
                                <TableHead className="w-[150px]">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {interactions.map((interaction, index) => (
                                <InteractionCard
                                    key={`${interaction.interaction_id}-${index}`}
                                    interaction={interaction}
                                />
                            ))}

                            {isFetching && Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={`skeleton-${i}`}>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                </TableRow>
                            ))}

                            <TableRow ref={loadingRef}>
                                <TableCell colSpan={6} className="py-5">
                                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                        {isFetching ? (
                                            <>
                                                <Spinner />
                                                <p className="text-sm">Loading interactions...</p>
                                            </>
                                        ) : isError ? (
                                            <>
                                                <p className="text-sm font-medium text-destructive">
                                                    Failed to load interactions
                                                </p>
                                                <Button variant="outline" size="sm" onClick={onRetry}>
                                                    Try again
                                                </Button>
                                            </>
                                        ) : interactions.length === 0 ? (
                                            <>
                                                <BoxArrowDownIcon className="size-10 opacity-60" />
                                                <p className="text-base font-medium">No interactions found</p>
                                                <p className="text-sm text-muted-foreground/80">
                                                    Try adjusting your filters or search terms
                                                </p>
                                            </>
                                        ) : !hasNextPage ? (
                                            <>
                                                <p className="text-sm font-medium">All caught up 🎉</p>
                                                <p className="text-xs opacity-70">
                                                    {interactions.length} total interactions loaded
                                                </p>
                                            </>
                                        ) : null}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
}