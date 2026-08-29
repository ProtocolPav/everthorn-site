import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
    ArrowLeftIcon,
    PlusIcon,
    SpinnerIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
    useCreateWikiPageV1GuildsMeWikiPost,
    getGetWikiPageV1GuildsMeWikiSlugGetQueryKey,
    invalidateListWikiPagesV1GuildsMeWikiGet,
} from "@/api/nexuscore/wiki-pages/wiki-pages.ts";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { useGetPresignedUploadUrlV1ImagesPresignPost } from "@/api/nexuscore/images/images.ts";
import { getAssignableCategories } from "@/config/wiki-options.ts";
import { WikiAccessDeniedScreen } from "@/components/errors/wiki-access-denied.tsx";
import { WikiPageForm, type WikiPageFormData } from "@/components/features/wiki/editor/wiki-page-form.tsx";
import { WikiArticleCard } from "@/components/features/wiki/article-card.tsx";
import type { PageOut } from "@/api/nexuscore/model/pageOut.ts";

export const Route = createFileRoute("/_main/wiki/new")({
    component: WikiNewPage,
    validateSearch: (search: Record<string, unknown>): { slug?: string } => {
        const slug =
            typeof search.slug === "string" && search.slug.trim().length > 0
                ? search.slug.trim()
                : undefined;
        return { slug };
    },
});

const DEFAULT_CONTENT = [{ type: "p", children: [{ text: "" }] }];

const DIAMOND_LATTICE = `<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#ffffff' stroke-width='0.8'><path d='M30 0L60 30L30 60L0 30Z'/><path d='M30 10L50 30L30 50L10 30Z'/></g></svg>`;

function WikiNewPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { slug: initialSlug } = Route.useSearch();
    const { isCM, isMember, isLoading: memberLoading, thornyUser } = useEverthornMember();
    const createMutation = useCreateWikiPageV1GuildsMeWikiPost();
    const presignMutation = useGetPresignedUploadUrlV1ImagesPresignPost();

    const categoryOptions = getAssignableCategories(isCM);

    const [slugTouched, setSlugTouched] = useState(!!initialSlug);
    const [formData, setFormData] = useState<WikiPageFormData>(() => ({
        title: "",
        summary: null,
        category: categoryOptions[0]?.value ?? "lore",
        tags: [],
        cover_image: null,
        locked: false,
        published: false,
        slug: initialSlug ?? "",
    }));

    const previewArticle = useMemo<PageOut>(
        () => ({
            slug: formData.slug || "preview",
            title: formData.title || "Untitled chronicle",
            summary: formData.summary || "Your summary will appear here.",
            category: formData.category,
            tags: formData.tags,
            cover_image: formData.cover_image,
            published: formData.published,
            locked: formData.locked,
            view_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            author: {
                thorny_id: thornyUser?.thorny_id ?? 0,
                user_id: 0,
                guild_id: 0,
                join_date: new Date().toISOString(),
                username: thornyUser?.username ?? "You",
                birthday: null,
                balance: 0,
                active: true,
                role: null,
                patron: false,
                level: 0,
                xp: 0,
                required_xp: 0,
                last_message: null,
                gamertag: thornyUser?.gamertag ?? null,
                whitelist: null,
                xuid: null,
                location: null,
                dimension: null,
                hidden: false,
                profile: thornyUser?.profile ?? { avatar: null, banner: null, bio: null },
            } as PageOut["author"],
            content: { data: DEFAULT_CONTENT } as unknown as PageOut["content"],
        }),
        [formData, thornyUser],
    );

    const uploadFile = useCallback(
        async (file: File): Promise<string> => {
            const { upload_url, public_url } = await presignMutation.mutateAsync({
                data: { filename: file.name, content_type: file.type as any },
            });
            const res = await fetch(upload_url, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });
            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            return public_url;
        },
        [presignMutation],
    );

    const canSubmit = formData.title.trim().length > 0 && (formData.slug?.length ?? 0) > 0 && !createMutation.isPending;

    const handleCreate = () => {
        if (!canSubmit) return;
        createMutation.mutate(
            {
                data: {
                    slug: formData.slug!,
                    title: formData.title,
                    summary: formData.summary || null,
                    category: formData.category,
                    tags: formData.tags,
                    cover_image: formData.cover_image || null,
                    locked: formData.locked,
                    published: formData.published,
                    author_id: thornyUser?.thorny_id ?? 0,
                    project_id: null,
                    content: {
                        data: DEFAULT_CONTENT,
                        change_note: "Page created",
                        edited_by: thornyUser?.thorny_id ?? 0,
                        editor_type: "plate",
                    },
                },
            },
            {
                onSuccess: (newPage) => {
                    queryClient.setQueryData(getGetWikiPageV1GuildsMeWikiSlugGetQueryKey(newPage.slug), newPage);
                    invalidateListWikiPagesV1GuildsMeWikiGet(queryClient);
                    toast.success("Page created", {
                        description: `"${newPage.title}" is ready — drop into the editor.`,
                    });
                    navigate({
                        to: "/wiki/$slug",
                        params: { slug: newPage.slug },
                    });
                },
                onError: () => {
                    toast.error("Failed to create page", {
                        description: "The slug may already be taken, or the server is unavailable.",
                    });
                },
            },
        );
    };

    if (!isMember || memberLoading) {
        return <WikiAccessDeniedScreen />;
    }

    const encodedPattern = `url("data:image/svg+xml,${encodeURIComponent(DIAMOND_LATTICE)}")`;

    return (
        <div className="min-h-screen relative">
            {/* ── Parchment wash background ────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none dark:hidden"
                style={{
                    background:
                        "linear-gradient(155deg, oklch(0.975 0.012 80) 0%, oklch(0.96 0.018 70) 35%, oklch(0.945 0.022 60) 65%, oklch(0.965 0.015 75) 100%)",
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none hidden dark:block"
                style={{
                    background:
                        "linear-gradient(155deg, oklch(0.18 0.012 60) 0%, oklch(0.16 0.015 50) 35%, oklch(0.145 0.018 45) 65%, oklch(0.17 0.012 55) 100%)",
                }}
            />
            <div className="absolute inset-0 dark:hidden pointer-events-none" style={{ opacity: 0.025, backgroundImage: encodedPattern }} />
            <div className="absolute inset-0 hidden dark:block pointer-events-none" style={{ opacity: 0.035, backgroundImage: encodedPattern }} />

            <div className="relative">
                {/* ── Top bar — sits directly under global SiteHeader ── */}
                <div className="sticky top-[var(--navbar-height)] z-30 bg-background/75 backdrop-blur-xl border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-[52px] flex items-center justify-between gap-4">
                        <Link
                            to="/wiki"
                            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeftIcon className="size-3.5" weight="bold" />
                            Back to Archives
                        </Link>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 text-xs hidden sm:inline-flex" asChild>
                                <Link to="/wiki">Cancel</Link>
                            </Button>
                            <Button size="sm" className="h-8 gap-1.5 text-xs px-4" onClick={handleCreate} disabled={!canSubmit}>
                                {createMutation.isPending ? <SpinnerIcon weight="bold" className="size-3.5 animate-spin" /> : <PlusIcon weight="bold" className="size-3.5" />}
                                {createMutation.isPending ? "Creating…" : "Create article"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Main layout ─────────────────────────────── */}
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 items-start">
                        {/* LEFT — Form (single reusable component) */}
                        <div className="min-w-0">
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-6">
                                <h1 className="font-almendra text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] font-normal leading-none tracking-tight [word-spacing:0.08em]">Inscribe a new page</h1>
                                <p className="text-[13px] text-muted-foreground mt-2.5 leading-relaxed max-w-[52ch]">Set the title, look and visibility.</p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
                                <WikiPageForm
                                    mode="create"
                                    variant="page"
                                    data={formData}
                                    onChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
                                    uploadFile={uploadFile}
                                    autoFocusTitle
                                    slugTouched={slugTouched}
                                    onSlugTouched={() => setSlugTouched(true)}
                                />
                            </motion.div>

                            {/* Mobile actions — inset from edges, safe-area aware */}
                            <div className="mt-8 flex gap-3 lg:hidden px-1 pb-[env(safe-area-inset-bottom)]">
                                <Button size="lg" className="flex-1 h-11 gap-2 text-sm" onClick={handleCreate} disabled={!canSubmit}>
                                    {createMutation.isPending ? <SpinnerIcon weight="bold" className="size-4 animate-spin" /> : <PlusIcon weight="bold" className="size-4" />}
                                    {createMutation.isPending ? "Creating…" : "Create article"}
                                </Button>
                                <Button variant="outline" size="lg" className="h-11 px-6" asChild>
                                    <Link to="/wiki">Cancel</Link>
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT — Live preview (sticky on desktop, padded so it never kisses the viewport edge) */}
                        <div className="hidden lg:block lg:sticky lg:top-[calc(var(--navbar-height)+4rem)]">
                            <div className="pl-2 xl:pl-4 pr-1 pb-6">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Preview</p>

                                <div className={'pointer-events-none'}>
                                    <WikiArticleCard article={previewArticle} />
                                </div>

                                <div className="mt-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm px-4 py-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Page link</p>
                                    <p className="text-xs leading-relaxed text-muted-foreground">People will find your page at</p>
                                    <p className="font-mono text-xs break-all mt-1">
                                        <span className="text-muted-foreground">everthorn.net</span>
                                        <span className="text-foreground">/wiki/{formData.slug || <span className="text-muted-foreground">your-link</span>}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
