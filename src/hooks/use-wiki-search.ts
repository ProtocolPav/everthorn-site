import { useSearch, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

export interface WikiSearchState {
    category?: string;
    query?: string;
    sortBy?: "created_at" | "title" | "updated_at";
    sortOrder?: "asc" | "desc";
    tags?: string[];
}

export function useWikiSearch() {
    const search = useSearch({ from: "/_main/wiki/" });
    const navigate = useNavigate({ from: "/wiki" });

    const activeCategory = search.category ?? "all";
    const activeSortBy = search.sortBy ?? "created_at";
    const activeSortOrder = search.sortOrder ?? "desc";
    const activeTags = search.tags ?? [];

    const setCategory = useCallback(
        (category: string) => {
            navigate({
                search: (prev) => ({
                    ...prev,
                    category: category === "all" ? undefined : category,
                }),
                resetScroll: false,
                replace: true,
            });
        },
        [navigate]
    );

    const setQuery = useCallback(
        (query: string) => {
            navigate({
                search: (prev) => ({
                    ...prev,
                    query: query || undefined,
                }),
                resetScroll: false,
                replace: true,
            });
        },
        [navigate]
    );

    const setSort = useCallback(
        (sortBy: WikiSearchState["sortBy"], sortOrder: WikiSearchState["sortOrder"]) => {
            navigate({
                search: (prev) => ({
                    ...prev,
                    sortBy,
                    sortOrder,
                }),
                resetScroll: false,
                replace: true,
            });
        },
        [navigate]
    );

    const setTags = useCallback(
        (tags: string[]) => {
            navigate({
                search: (prev) => ({
                    ...prev,
                    tags: tags.length ? tags : undefined,
                }),
                resetScroll: false,
                replace: true,
            });
        },
        [navigate]
    );

    return {
        search,
        activeCategory,
        activeSortBy,
        activeSortOrder,
        activeTags,
        setCategory,
        setQuery,
        setSort,
        setTags,
    };
}