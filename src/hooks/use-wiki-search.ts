import { useSearch, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

export interface WikiSearchState {
    category?: string;
    query?: string;
    sort?: string;
}

export function useWikiSearch() {
    const search = useSearch({ from: "/_main/wiki/" });
    const navigate = useNavigate({ from: "/wiki" });

    const activeCategory = search.category ?? "all";
    const activeSort = search.sort ?? "newest";

    const setCategory = useCallback((category: string) => {
        navigate({
            search: (prev) => ({
                ...prev,
                category: category === "all" ? undefined : category,
            }),
        });
    }, [navigate]);

    const setQuery = useCallback((query: string) => {
        navigate({
            search: (prev) => ({
                ...prev,
                query: query || undefined,
            }),
        });
    }, [navigate]);

    const setSort = useCallback((sort: string) => {
        navigate({
            search: (prev) => ({
                ...prev,
                sort,
            }),
        });
    }, [navigate]);

    return {
        search,
        activeCategory,
        activeSort,
        setCategory,
        setQuery,
        setSort,
    };
}
