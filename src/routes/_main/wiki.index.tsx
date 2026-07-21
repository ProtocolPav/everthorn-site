import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { useWikiSearch } from "@/hooks/use-wiki-search";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { WikiHero } from "@/components/features/wiki/wiki-hero";
import { WikiCategoryTabs } from "@/components/features/wiki/wiki-category-tabs";
import { WikiArticleCard, WikiArticleCardSkeleton } from "@/components/features/wiki/wiki-article-card";
import { WikiSortPopover } from "@/components/features/wiki/wiki-sort-popover";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon, XCircleIcon, NewspaperClippingIcon } from "@phosphor-icons/react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import type { WikiSearchState } from "@/hooks/use-wiki-search";
import { useListWikiPagesV1GuildsMeWikiGetInfinite } from "@/api/nexuscore/wiki-pages/wiki-pages.ts";
import type { ListWikiPagesV1GuildsMeWikiGetParams } from "@/api/nexuscore/model/listWikiPagesV1GuildsMeWikiGetParams.ts";
import { useEverthornMember } from "@/hooks/use-everthorn-member";

export const Route = createFileRoute("/_main/wiki/")({
    component: WikiBrowsePage,
    validateSearch: (search: Record<string, unknown>): WikiSearchState => ({
        category: (search.category as string) || undefined,
        query: (search.query as string) || undefined,
        sortBy: (search.sortBy as WikiSearchState["sortBy"]) || undefined,
        sortOrder: (search.sortOrder as WikiSearchState["sortOrder"]) || undefined,
        tags: Array.isArray(search.tags) ? (search.tags as string[]) : undefined,
    }),
});

function WikiBrowsePage() {
    const {
        search,
        activeCategory,
        activeSortBy,
        activeSortOrder,
        setCategory,
        setQuery,
        setSort,
    } = useWikiSearch();
    const [localQuery, setLocalQuery] = useState(search.query ?? "");
    const { isCM } = useEverthornMember();

    const params: ListWikiPagesV1GuildsMeWikiGetParams = useMemo(
        () => ({
            published: true,
            category: search.category === "all" ? undefined : search.category,
            search: search.query || undefined,
            sort_by: activeSortBy,
            sort_order: activeSortOrder,
            tags: search.tags,
            page_size: 20,
        }),
        [search.category, search.query, search.tags, activeSortBy, activeSortOrder]
    );

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useListWikiPagesV1GuildsMeWikiGetInfinite(
        { ...params },
        {
            query: {
                initialPageParam: 1,
                getNextPageParam: (lastPage, allPages) => {
                    return lastPage.length < 20 ? undefined : allPages.length + 1
                },
            },
        }
    );

    const articles = useMemo(
        () => data?.pages.flatMap((page) => page ?? []) ?? [],
        [data]
    );

    const handleLoadMore = useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    const sentinelRef = useInfiniteScroll<HTMLDivElement>(
        handleLoadMore,
        isFetchingNextPage,
        !!hasNextPage,
    );

    const handleSearchSubmit = () => {
        setQuery(localQuery);
    };

    const handleSearchClear = () => {
        setLocalQuery("");
        setQuery("");
    };

    return (
        <div className="min-h-screen">
            <WikiHero />

            <div className="sticky top-(--navbar-height) z-20 bg-background/80 backdrop-blur-xl border-b">
                <div className="px-5 md:px-10 py-3 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-md">
                            <InputGroup>
                                <InputGroupInput
                                    placeholder="Search the archives..."
                                    value={localQuery}
                                    onChange={(e) => setLocalQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSearchSubmit();
                                    }}
                                />
                                <InputGroupAddon>
                                    <MagnifyingGlassIcon />
                                </InputGroupAddon>
                                {localQuery && (
                                    <InputGroupAddon align="inline-end">
                                        <Button variant="invisible" size="icon-sm" onClick={handleSearchClear}>
                                            <XCircleIcon className="size-3.5" weight="fill" />
                                        </Button>
                                    </InputGroupAddon>
                                )}
                            </InputGroup>
                        </div>

                        <WikiSortPopover
                            activeSortBy={activeSortBy}
                            activeSortOrder={activeSortOrder}
                            onSortChange={setSort}
                        />
                    </div>

                    <WikiCategoryTabs
                        activeCategory={activeCategory}
                        onCategoryChange={setCategory}
                        isAdmin={isCM}
                    />
                </div>
            </div>

            <div className="px-5 md:px-10 py-8 md:py-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <WikiArticleCardSkeleton key={i} />
                        ))}
                    </div>
                ) : articles.length === 0 ? (
                    <Empty className="py-20">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <NewspaperClippingIcon />
                            </EmptyMedia>
                            <EmptyTitle>No articles found</EmptyTitle>
                            <EmptyDescription>
                                {search.query
                                    ? `No results for "${search.query}". Try a different search.`
                                    : "No articles in this category yet. Be the first to write one."}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.slug}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: Math.min((index % 20) * 0.04, 0.3) }}
                            >
                                <WikiArticleCard article={article} />
                            </motion.div>
                        ))}

                        {isFetchingNextPage &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <WikiArticleCardSkeleton key={`loading-${i}`} />
                            ))}

                        <div ref={sentinelRef} className="col-span-full h-1" />
                    </div>
                )}
            </div>
        </div>
    );
}
