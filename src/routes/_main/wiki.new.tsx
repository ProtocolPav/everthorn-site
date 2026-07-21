import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ArrowLeftIcon,
    PlusIcon,
    SpinnerIcon,
    FileTextIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateWikiPageV1GuildsMeWikiPost } from "@/api/nexuscore/wiki-pages/wiki-pages.ts";
import { getGetWikiPageV1GuildsMeWikiSlugGetQueryKey } from "@/api/nexuscore/wiki-pages/wiki-pages.ts";
import { invalidateListWikiPagesV1GuildsMeWikiGet } from "@/api/nexuscore/wiki-pages/wiki-pages.ts";
import { WikiPageSettingsDialog, type PageDataDraft } from "@/components/features/wiki/editor/wiki-page-settings-sheet.tsx";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { useGetPresignedUploadUrlV1ImagesPresignPost } from "@/api/nexuscore/images/images.ts";
import { getVisibleCategories } from "@/config/wiki-options.ts";

export const Route = createFileRoute("/_main/wiki/new")({
    component: WikiNewPage,
});

/** Convert a human-readable title to a URL-safe slug. */
function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

const DEFAULT_CATEGORY = getVisibleCategories(false, false)[0]?.value ?? "lore";

function WikiNewPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const everthornMember = useEverthornMember();
    const createMutation = useCreateWikiPageV1GuildsMeWikiPost();
    const presignMutation = useGetPresignedUploadUrlV1ImagesPresignPost();

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [slugTouched, setSlugTouched] = useState(false);
    const [pageData, setPageData] = useState<PageDataDraft>({
        title: "",
        summary: null,
        category: DEFAULT_CATEGORY,
        tags: [],
        cover_image: null,
        locked: false,
        published: false,
    });
    const [slug, setSlug] = useState("");

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setPageData((prev) => ({ ...prev, title }));
        if (!slugTouched) setSlug(slugify(title));
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlugTouched(true);
        setSlug(slugify(e.target.value));
    };

    const uploadFile = useCallback(async (file: File): Promise<string> => {
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
    }, [presignMutation]);

    const canSubmit =
        pageData.title.trim().length > 0 &&
        slug.length > 0 &&
        !createMutation.isPending;

    const handleCreate = () => {
        if (!canSubmit) return;

        createMutation.mutate(
            {
                data: {
                    slug,
                    title: pageData.title,
                    summary: pageData.summary,
                    category: pageData.category,
                    tags: pageData.tags,
                    cover_image: pageData.cover_image,
                    locked: pageData.locked,
                    published: pageData.published,
                    author_id: everthornMember.thornyUser?.thorny_id ?? 0,
                    project_id: null,
                    content: {
                        data: [],
                        change_note: "Page created",
                        edited_by: everthornMember.thornyUser?.thorny_id ?? 0,
                        editor_type: "blocknote",
                    },
                },
            },
            {
                onSuccess: (newPage) => {
                    // Seed the cache so the article page loads instantly.
                    queryClient.setQueryData(
                        getGetWikiPageV1GuildsMeWikiSlugGetQueryKey(newPage.slug),
                        newPage,
                    );
                    // Invalidate the list so the index picks up the new page.
                    invalidateListWikiPagesV1GuildsMeWikiGet(queryClient);

                    toast.success("Page created", {
                        description: `"${newPage.title}" is ready to edit.`,
                    });

                    // Navigate straight into the editor.
                    navigate({
                        to: "/wiki/$slug",
                        params: { slug: newPage.slug },
                        search: { edit: true },
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

    return (
        <div className="min-h-screen px-3 md:px-8 py-8">
            <div className="max-w-2xl mx-auto">
                <Link
                    to="/wiki"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeftIcon className="size-3" weight="bold" />
                    Back to Archives
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center size-9 rounded-lg bg-muted/40 border border-border/50">
                        <FileTextIcon weight="duotone" className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                        <h1 className="font-almendra text-2xl font-normal leading-tight">
                            New Article
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Fill in the basics — you can edit content after creation.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="new-title" className="text-sm font-medium">
                            Title
                        </Label>
                        <Input
                            id="new-title"
                            value={pageData.title}
                            onChange={handleTitleChange}
                            placeholder="The Dragon War of Aeloria…"
                            className="h-9"
                            autoFocus
                        />
                    </div>

                    {/* Slug */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="new-slug" className="text-sm font-medium">
                            Slug
                            <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                                (URL identifier — must be unique)
                            </span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none select-none">
                                /wiki/
                            </span>
                            <Input
                                id="new-slug"
                                value={slug}
                                onChange={handleSlugChange}
                                placeholder="dragon-war-of-aeloria"
                                className="h-9 pl-[3.25rem] font-mono text-xs"
                            />
                        </div>
                    </div>

                    {/* More settings */}
                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 text-xs gap-1.5"
                            onClick={() => setSettingsOpen(true)}
                            type="button"
                        >
                            More settings
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            Category: <span className="text-foreground/70">{pageData.category}</span>
                            {pageData.published && " · Published"}
                            {pageData.locked && " · Locked"}
                        </span>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2 border-t border-border/50">
                        <Button
                            size="sm"
                            className="h-9 gap-1.5 text-xs"
                            onClick={handleCreate}
                            disabled={!canSubmit}
                        >
                            {createMutation.isPending ? (
                                <SpinnerIcon weight="bold" className="size-3.5 animate-spin" />
                            ) : (
                                <PlusIcon weight="bold" className="size-3.5" />
                            )}
                            {createMutation.isPending ? "Creating…" : "Create article"}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 text-xs"
                            asChild
                        >
                            <Link to="/wiki">Cancel</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <WikiPageSettingsDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                data={pageData}
                onChange={(updated) => setPageData((prev) => ({ ...prev, ...updated }))}
                uploadFile={uploadFile}
            />
        </div>
    );
}
