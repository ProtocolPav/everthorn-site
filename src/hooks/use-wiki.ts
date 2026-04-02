import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { WikiArticle, WikiArticleStub, WikiParams } from "@/types/wiki";

const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL;

const list_fetcher = async (url: string): Promise<WikiArticleStub[]> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch wiki articles");
    }
    return response.json();
};

const fetcher = async (url: string): Promise<WikiArticle> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch wiki article");
    }
    return response.json();
};

export function useWikiArticles(params: WikiParams = {}) {
    return useQuery({
        queryKey: ["wiki", params],
        queryFn: () => {
            const url = new URL(`${API_URL}/v0.2/wiki/pages`);
            Object.entries(params).forEach(([key, value]) => {
                if (value === undefined || value === null) return;
                if (Array.isArray(value)) {
                    value.forEach((item) => url.searchParams.append(key, String(item)));
                } else {
                    url.searchParams.append(key, String(value));
                }
            });
            return list_fetcher(url.toString());
        },
        placeholderData: keepPreviousData,
        gcTime: Infinity,
    });
}

export function useWikiArticle(pageId: string | null | undefined) {
    return useQuery({
        queryKey: ["wiki", pageId],
        queryFn: () => fetcher(`${API_URL}/v0.2/wiki/pages/${pageId}`),
        enabled: !!pageId,
        gcTime: Infinity,
    });
}

export function useUpdateWikiArticleContent(pageId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({content, edited_by}: {content: any, edited_by: number}) => {
            const response = await fetch(`${API_URL}/v0.2/wiki/pages/${pageId}/content`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    editor_type: "blocknote",
                    change_note: "Updated via Blocknote Editor",
                    edited_by: edited_by
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to update wiki article");
            }
            return response.json() as Promise<WikiArticle>;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(["wiki", pageId], updated);
        },
    });
}

export function useWikiCategories() {
    return useQuery({
        queryKey: ["wiki", "categories"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/v0.2/wiki/categories`);
            if (!response.ok) {
                throw new Error("Failed to fetch wiki categories");
            }
            return response.json() as Promise<{ slug: string; label: string; count: number }[]>;
        },
        gcTime: Infinity,
    });
}
