import { ThornyUser } from "@/types/thorny-user";

export interface WikiArticle {
    title: string;
    summary: string;
    category: string;
    tags: string[];
    cover_image: string | null;
    published: boolean;
    locked: boolean;
    page_id: string;
    author_id: number;
    author: ThornyUser;
    created_at: string;
    updated_at: string;
    view_count: number;
    content: BlockNoteContent | null;
}

export interface BlockNoteContent {
    type: "doc";
    content: Record<string, unknown>[];
}

export interface WikiArticleStub {
    title: string;
    summary: string;
    category: string;
    tags: string[];
    cover_image: string | null;
    published: boolean;
    locked: boolean;
    page_id: string;
    author_id: number;
    author: Pick<ThornyUser, "username" | "gamertag" | "thorny_id" | "profile">;
    created_at: string;
    updated_at: string;
    view_count: number;
}

export interface WikiCategory {
    slug: string;
    label: string;
    count: number;
}

export interface WikiParams {
    category?: string;
    tags?: string[];
    search?: string;
    author_id?: number;
    published?: boolean;
    sort?: "newest" | "oldest" | "popular" | "updated";
    page?: number;
    page_size?: number;
}
