import {createFileRoute, Link} from "@tanstack/react-router";
import { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { useWikiSearch } from "@/hooks/use-wiki-search";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { WikiHero } from "@/components/features/wiki/hero.tsx";
import { WikiCategoryTabs } from "@/components/features/wiki/category-tabs.tsx";
import { WikiArticleCard } from "@/components/features/wiki/article-card.tsx";
import {WikiSortMenu} from "@/components/features/wiki/sort-menu.tsx";
import {MagnifyingGlassIcon, XCircleIcon, NewspaperClippingIcon, PlusIcon} from "@phosphor-icons/react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import type { WikiSearchState } from "@/hooks/use-wiki-search";
import { useListWikiPagesV1GuildsMeWikiGetInfinite } from "@/api/nexuscore/wiki-pages/wiki-pages.ts";
import type { ListWikiPagesV1GuildsMeWikiGetParams } from "@/api/nexuscore/model/listWikiPagesV1GuildsMeWikiGetParams.ts";
import { useEverthornMember } from "@/hooks/use-everthorn-member";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";

export const Route = createFileRoute("/_main/wiki/")({
    component: WikiBrowsePage,
    validateSearch: (search: Record<string, unknown>): WikiSearchState => ({
        category: (search.category as string) || undefined,
        query: (search.query as string) || undefined,
        sortBy: (search.sortBy as WikiSearchState["sortBy"]) || undefined,
        sortOrder: (search.sortOrder as WikiSearchState["sortOrder"]) || undefined,
        tags: Array.isArray(search.tags) ? (search.tags as string[]) : undefined,
    }),
    head: () => ({
        meta: [
            {
                property: 'og:title',
                content: `Everthorn Chronicles`,
            },
            {
                property: 'og:description',
                content: "A community-made encyclopedia of Everthorn.",
            },
            {
                property: 'og:image',
                content: `${import.meta.env.VITE_BASE_URL}/og/wiki.png`,
            },
            {
                property: 'og:url',
                content: `${import.meta.env.VITE_BASE_URL}/wiki`,
            },
            {
                name: 'twitter:title',
                content: `Everthorn Chronicles`
            },
            {
                name: 'twitter:description',
                content: "A community-made encyclopedia of Everthorn."
            },
            {
                name: 'twitter:image',
                content: `${import.meta.env.VITE_BASE_URL}/og/wiki.png`,
            },
            {
                name: 'twitter:url',
                content: `${import.meta.env.VITE_BASE_URL}/wiki`,
            }
        ],
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
    const { thornyUser } = useEverthornMember();

    const isDraftsTab = activeCategory === "drafts";

    const params: ListWikiPagesV1GuildsMeWikiGetParams = useMemo(
        () => ({
            // Drafts tab: fetch unpublished; everything else: published only.
            published: !isDraftsTab,
            // "all" and "drafts" are UI-only — don't send them as a category filter.
            category: (search.category === "all" || search.category === "drafts")
                ? undefined
                : search.category,
            search: search.query || undefined,
            sort_by: activeSortBy,
            sort_order: activeSortOrder,
            tags: search.tags,
            page_size: 20,
        }),
        [isDraftsTab, search.category, search.query, search.tags, activeSortBy, activeSortOrder]
    );

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useListWikiPagesV1GuildsMeWikiGetInfinite(
        { ...params },
        {
            query: {
                initialPageParam: 1,
                getNextPageParam: (lastPage, allPages) => {
                    return lastPage.length < 20 ? undefined : allPages.length + 1;
                },
            },
        }
    );

    const articles = useMemo(() => {
        const flat = data?.pages.flatMap((page) => page ?? []) ?? [];
        // Drafts tab: client-side filter to only show the current user's own drafts.
        if (isDraftsTab && thornyUser?.thorny_id != null) {
            return flat.filter((a) => a.author.thorny_id === thornyUser.thorny_id);
        }
        return flat;
    }, [data, isDraftsTab, thornyUser?.thorny_id]);

    const handleLoadMore = useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    const sentinelRef = useInfiniteScroll<HTMLDivElement>(
        handleLoadMore,
        isFetchingNextPage,
        hasNextPage,
    );

    const handleSearchSubmit = () => {
        setQuery(localQuery);
    };

    const handleSearchClear = () => {
        setLocalQuery("");
        setQuery("");
    };

    const emptyDescription = isDraftsTab
        ? "You haven't written any drafts yet. Create a new article to get started."
        : search.query
            ? `No results for "${search.query}". Try a different search.`
            : "No articles in this category yet. Be the first to write one.";

    return (
        <div className="min-h-screen">
            <WikiHero />

            {/* Toolbar / Control Center */}
            <div className="sticky top-(--navbar-height) z-30 bg-background border-b shadow-sm">
                <div className="px-5 md:px-10 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Left side: Categories (scrollable on mobile) */}
                    <div
                        className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 -mb-1 md:mb-0 [&::-webkit-scrollbar]:hidden"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <WikiCategoryTabs
                            activeCategory={activeCategory}
                            onCategoryChange={setCategory}
                            hasMember={thornyUser?.thorny_id != null}
                        />
                    </div>


                    {/* Right side: Search & Sort */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-[280px] group">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none transition-colors group-focus-within:text-primary" />

                            <Input
                                type="text"
                                placeholder="Search the chronicles..."
                                value={localQuery}
                                onChange={(e) => {
                                    setLocalQuery(e.target.value);
                                    handleSearchSubmit();
                                }}
                                className="w-full h-9 pl-9 pr-9 bg-muted/30 border-input/50 text-[16px] md:text-sm shadow-sm transition-all focus-visible:bg-background placeholder:text-muted-foreground"
                            />

                            {localQuery && (
                                <Button
                                    variant="ghost"
                                    onClick={handleSearchClear}
                                    // Custom sizing to make it fit perfectly inside the input
                                    className="absolute right-1 top-1/2 -translate-y-1/2 size-7 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
                                    aria-label="Clear search"
                                >
                                    <XCircleIcon className="size-4.5" weight="fill" />
                                </Button>
                            )}
                        </div>


                        {/* Visual divider to group actions */}
                        <div className="w-px h-5 bg-border hidden md:block mx-1" />

                        <WikiSortMenu
                            activeSortBy={activeSortBy}
                            activeSortOrder={activeSortOrder}
                            onSortChange={setSort}
                        />

                        {/* 3. Create Page Button (New) */}
                        <Button
                            asChild
                            size="icon"
                            className="size-9 shrink-0 shadow-sm"
                        >
                            <Link to="/wiki/new">
                                <PlusIcon weight="bold" className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>


            <div className="px-5 md:px-10 py-8 md:py-12">
                {articles.length === 0 ? (
                    <Empty className="py-20">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <NewspaperClippingIcon />
                            </EmptyMedia>
                            <EmptyTitle>No articles found</EmptyTitle>
                            <EmptyDescription>{emptyDescription}</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 24,
                                    delay: Math.min((index % 20) * 0.025, 0.15)
                                }}
                            >
                                <WikiArticleCard article={article} />
                            </motion.div>
                        ))}

                        <div ref={sentinelRef} className="col-span-full h-1" />
                    </div>
                )}
            </div>
        </div>
    );
}
