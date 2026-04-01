import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useWikiArticles } from "@/hooks/use-wiki";
import { WikiHero } from "@/components/features/wiki/wiki-hero";
import { WikiCategoryTabs } from "@/components/features/wiki/wiki-category-tabs";
import { WikiArticleCard, WikiArticleCardSkeleton } from "@/components/features/wiki/wiki-article-card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
    MagnifyingGlassIcon,
    XCircleIcon,
    NewspaperClippingIcon,
    SortAscendingIcon,
} from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import type { WikiParams } from "@/types/wiki";

interface WikiSearchState {
    category?: string;
    query?: string;
    sort?: string;
}

export const Route = createFileRoute("/_main/wiki/")({
    component: WikiBrowsePage,
    validateSearch: (search: Record<string, unknown>): WikiSearchState => ({
        category: (search.category as string) || undefined,
        query: (search.query as string) || undefined,
        sort: (search.sort as string) || undefined,
    }),
});

const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Viewed" },
    { value: "updated", label: "Recently Updated" },
];

function WikiBrowsePage() {
    const search = useSearch({ from: "/_main/wiki/" });
    const [localQuery, setLocalQuery] = useState(search.query ?? "");

    const params: WikiParams = useMemo(() => ({
        category: search.category === "all" ? undefined : search.category,
        search: search.query || undefined,
        sort: (search.sort as WikiParams["sort"]) || "newest",
        published: true,
    }), [search.category, search.query, search.sort]);

    const { data: articles, isLoading } = useWikiArticles(params);

    const activeCategory = search.category ?? "all";
    const activeSort = search.sort ?? "newest";

    return (
        <div className="min-h-screen">
            <WikiHero totalArticles={articles?.length} />

            {/* Controls bar */}
            <div className="sticky top-(--navbar-height) z-20 bg-background/80 backdrop-blur-xl border-b">
                <div className="px-5 md:px-10 py-3 space-y-3">
                    {/* Search + Sort row */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-md">
                            <InputGroup>
                                <InputGroupInput
                                    placeholder="Search the archives..."
                                    value={localQuery}
                                    onChange={(e) => setLocalQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const url = new URL(window.location.href);
                                            if (localQuery) {
                                                url.searchParams.set("query", localQuery);
                                            } else {
                                                url.searchParams.delete("query");
                                            }
                                            window.history.replaceState({}, "", url.toString());
                                        }
                                    }}
                                />
                                <InputGroupAddon>
                                    <MagnifyingGlassIcon />
                                </InputGroupAddon>
                                {localQuery && (
                                    <InputGroupAddon align="inline-end">
                                        <Button
                                            variant="invisible"
                                            size="icon-sm"
                                            onClick={() => {
                                                setLocalQuery("");
                                                const url = new URL(window.location.href);
                                                url.searchParams.delete("query");
                                                window.history.replaceState({}, "", url.toString());
                                            }}
                                        >
                                            <XCircleIcon className="size-3.5" weight="fill" />
                                        </Button>
                                    </InputGroupAddon>
                                )}
                            </InputGroup>
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                    <SortAscendingIcon className="size-3.5" />
                                    {SORT_OPTIONS.find((o) => o.value === activeSort)?.label}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[180px] p-1" align="end" sideOffset={4}>
                                {SORT_OPTIONS.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => {
                                            const url = new URL(window.location.href);
                                            url.searchParams.set("sort", option.value);
                                            window.history.replaceState({}, "", url.toString());
                                        }}
                                        className={cn(
                                            "flex cursor-pointer items-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                                            activeSort === option.value
                                                ? "bg-primary/5 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Category tabs */}
                    <WikiCategoryTabs
                        activeCategory={activeCategory}
                        onCategoryChange={(cat) => {
                            const url = new URL(window.location.href);
                            if (cat === "all") {
                                url.searchParams.delete("category");
                            } else {
                                url.searchParams.set("category", cat);
                            }
                            window.history.replaceState({}, "", url.toString());
                        }}
                    />
                </div>
            </div>

            {/* Article grid */}
            <div className="px-5 md:px-10 py-8 md:py-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <WikiArticleCardSkeleton className="sm:col-span-2 sm:row-span-2" />
                        {Array.from({ length: 7 }).map((_, i) => (
                            <WikiArticleCardSkeleton key={i} />
                        ))}
                    </div>
                ) : !articles || articles.length === 0 ? (
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
                                key={article.page_id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
                            >
                                <WikiArticleCard article={article} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
