import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    ArrowLeftIcon,
    PlusIcon,
    SpinnerIcon,
    LinkIcon,
    UploadSimpleIcon,
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
import { SeamlessSelect } from "@/components/common/seamless-select";
import { TagsInput } from "@/components/common/tags-input";

export const Route = createFileRoute("/_main/wiki/new")({
    component: WikiNewPage,
});

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

const DEFAULT_CONTENT = [{ type: "paragraph", content: [] }];

function WikiNewPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isCM, thornyUser } = useEverthornMember();
    const createMutation = useCreateWikiPageV1GuildsMeWikiPost();
    const presignMutation = useGetPresignedUploadUrlV1ImagesPresignPost();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const categoryOptions = getAssignableCategories(isCM);

    const [slugTouched, setSlugTouched] = useState(false);
    const [slug, setSlug] = useState("");
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [category, setCategory] = useState(categoryOptions[0]?.value ?? "lore");
    const [tags, setTags] = useState<string[]>([]);
    const [coverImage, setCoverImage] = useState("");
    const [published, setPublished] = useState(false);
    const [locked, setLocked] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (!slugTouched) setSlug(slugify(e.target.value));
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            setCoverImage(url);
        } catch {
            toast.error("Upload failed", { description: "Could not upload the cover image." });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const canSubmit = title.trim().length > 0 && slug.length > 0 && !createMutation.isPending;

    const handleCreate = () => {
        if (!canSubmit) return;
        createMutation.mutate(
            {
                data: {
                    slug,
                    title,
                    summary: summary || null,
                    category,
                    tags,
                    cover_image: coverImage || null,
                    locked,
                    published,
                    author_id: thornyUser?.thorny_id ?? 0,
                    project_id: null,
                    content: {
                        data: DEFAULT_CONTENT,
                        change_note: "Page created",
                        edited_by: thornyUser?.thorny_id ?? 0,
                        editor_type: "blocknote",
                    },
                },
            },
            {
                onSuccess: (newPage) => {
                    queryClient.setQueryData(
                        getGetWikiPageV1GuildsMeWikiSlugGetQueryKey(newPage.slug),
                        newPage,
                    );
                    invalidateListWikiPagesV1GuildsMeWikiGet(queryClient);
                    toast.success("Page created", {
                        description: `"${newPage.title}" is ready to edit.`,
                    });
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
        <div className="min-h-screen px-4 md:px-8 py-10">
            <div className="max-w-2xl mx-auto">

                {/* Back */}
                <Link
                    to="/wiki"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-10"
                >
                    <ArrowLeftIcon className="size-3" weight="bold" />
                    Back to Archives
                </Link>

                {/* Header */}
                <div className="mb-10">
                    <h1 className="font-almendra text-3xl font-normal leading-tight">
                        New Article
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        Set up your article. You'll be dropped into the editor once it's created.
                    </p>
                </div>

                <div className="flex flex-col gap-8">

                    {/* ── Identity ─────────────────────────── */}
                    <section className="flex flex-col gap-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Identity</p>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="new-title">Title</Label>
                            <Input
                                id="new-title"
                                value={title}
                                onChange={handleTitleChange}
                                placeholder="The Dragon War of Aeloria…"
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="new-slug">
                                Slug
                                <span className="ml-1.5 text-xs text-muted-foreground font-normal">(must be unique)</span>
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
                                    className="pl-[3.25rem] font-mono text-xs"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="new-summary">Summary</Label>
                            <Textarea
                                id="new-summary"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="A short description of this article…"
                                className="resize-none text-sm min-h-[72px]"
                                rows={3}
                            />
                        </div>
                    </section>

                    {/* ── Categorisation ───────────────────── */}
                    <section className="flex flex-col gap-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categorisation</p>

                        <div className="flex flex-col gap-2">
                            <Label>Category</Label>
                            <SeamlessSelect
                                options={categoryOptions}
                                value={category}
                                onValueChange={setCategory}
                                placeholder="Select a category…"
                                className="w-full h-9 px-3 text-sm rounded-md border border-input bg-background shadow-none"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Tags</Label>
                            <TagsInput
                                defaultTags={[]}
                                maxTags={8}
                                onChange={(t) => setTags(t.map((x) => x.label))}
                            />
                            <p className="text-xs text-muted-foreground">
                                Press Enter to add · Backspace removes the last one
                            </p>
                        </div>
                    </section>

                    {/* ── Cover image ──────────────────────── */}
                    <section className="flex flex-col gap-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cover image</p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 gap-2 text-xs flex-1"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                {isUploading
                                    ? <SpinnerIcon weight="bold" className="size-3.5 animate-spin" />
                                    : <UploadSimpleIcon weight="bold" className="size-3.5" />}
                                {isUploading ? "Uploading…" : "Upload image"}
                            </Button>
                            {coverImage && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-3 text-xs text-destructive hover:text-destructive"
                                    onClick={() => setCoverImage("")}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>

                        <div className="relative">
                            <LinkIcon
                                weight="regular"
                                className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
                            />
                            <Input
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="Or paste a URL…"
                                className="pl-8 font-mono text-xs"
                            />
                        </div>

                        {coverImage && (
                            <div className="rounded-md overflow-hidden border border-border/50 aspect-video bg-muted/20">
                                <img
                                    src={coverImage}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                                />
                            </div>
                        )}
                    </section>

                    {/* ── Visibility ───────────────────────── */}
                    <section className="flex flex-col gap-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visibility</p>

                        <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium">Published</span>
                                <span className="text-xs text-muted-foreground">Visible to all members</span>
                            </div>
                            <Switch checked={published} onCheckedChange={setPublished} />
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium">Locked</span>
                                <span className="text-xs text-muted-foreground">Only admins can edit</span>
                            </div>
                            <Switch checked={locked} onCheckedChange={setLocked} />
                        </div>
                    </section>

                    {/* ── Actions ──────────────────────────── */}
                    <div className="flex gap-3 pt-2 border-t border-border/50">
                        <Button
                            size="sm"
                            className="h-9 gap-1.5 text-xs"
                            onClick={handleCreate}
                            disabled={!canSubmit}
                        >
                            {createMutation.isPending
                                ? <SpinnerIcon weight="bold" className="size-3.5 animate-spin" />
                                : <PlusIcon weight="bold" className="size-3.5" />}
                            {createMutation.isPending ? "Creating…" : "Create article"}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 text-xs" asChild>
                            <Link to="/wiki">Cancel</Link>
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
