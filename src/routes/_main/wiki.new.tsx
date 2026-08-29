import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useCallback, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeftIcon,
    PlusIcon,
    SpinnerIcon,
    LinkIcon,
    UploadSimpleIcon,
    EyeIcon,
    LockIcon,
    PencilSimpleIcon,
    CopyIcon,
    CheckIcon,
    ImageIcon,
    CalendarBlankIcon,
    UserIcon,
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
import { getAssignableCategories, getFallbackCoverStyle, getCategoryBadge } from "@/config/wiki-options.ts";
import { TagsInput } from "@/components/common/tags-input";
import { WikiAccessDeniedScreen } from "@/components/errors/wiki-access-denied.tsx";
import { cn } from "@/lib/utils";

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

const DIAMOND_LATTICE = `<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#ffffff' stroke-width='0.8'><path d='M30 0L60 30L30 60L0 30Z'/><path d='M30 10L50 30L30 50L10 30Z'/></g></svg>`;

function WikiNewPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isCM, isMember, isLoading: memberLoading, thornyUser } = useEverthornMember();
    const createMutation = useCreateWikiPageV1GuildsMeWikiPost();
    const presignMutation = useGetPresignedUploadUrlV1ImagesPresignPost();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [slugCopied, setSlugCopied] = useState(false);
    const [dragOver, setDragOver] = useState(false);

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

    const activeCategory = useMemo(() => categoryOptions.find((c) => c.value === category), [category, categoryOptions]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (!slugTouched) setSlug(slugify(e.target.value));
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlugTouched(true);
        setSlug(slugify(e.target.value));
    };

    const handleCopySlug = async () => {
        await navigator.clipboard.writeText(`/wiki/${slug}`);
        setSlugCopied(true);
        setTimeout(() => setSlugCopied(false), 1200);
    };

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

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file", { description: "Please select an image file." });
            return;
        }
        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            setCoverImage(url);
            toast.success("Cover uploaded");
        } catch {
            toast.error("Upload failed", { description: "Could not upload the cover image." });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await handleFile(file);
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
                {/* ── Top bar ─────────────────────────────────── */}
                <div className="sticky top-0 z-20 bg-background/70 backdrop-blur-xl border-b border-border/50">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-[56px] flex items-center justify-between gap-4">
                        <Link
                            to="/wiki"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeftIcon className="size-3.5" weight="bold" />
                            Back to Archives
                        </Link>
                        <div className="hidden sm:flex items-center gap-2 text-[11px] tracking-wider font-semibold uppercase">
                            <span className={cn("px-2 py-1 rounded-full border", title.trim() ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border/50")}>1 Identity</span>
                            <span className="size-1 rounded-full bg-border" />
                            <span className={cn("px-2 py-1 rounded-full border", category ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border/50")}>2 Category</span>
                            <span className="size-1 rounded-full bg-border" />
                            <span className="px-2 py-1 rounded-full border bg-muted text-muted-foreground border-border/50">3 Publish</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 text-xs hidden sm:inline-flex" asChild>
                                <Link to="/wiki">Cancel</Link>
                            </Button>
                            <Button size="sm" className="h-8 gap-1.5 text-xs px-4" onClick={handleCreate} disabled={!canSubmit}>
                                {createMutation.isPending ? <SpinnerIcon weight="bold" className="size-3.5 animate-spin" /> : <PlusIcon weight="bold" className="size-3.5" />}
                                {createMutation.isPending ? "Creating…" : "Create & edit"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Main layout ─────────────────────────────── */}
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 items-start">

                        {/* LEFT — Form */}
                        <div className="min-w-0">
                            {/* Page intro */}
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
                                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300 mb-3">
                                    <PencilSimpleIcon weight="duotone" className="size-3.5" />
                                    New chronicle entry
                                </div>
                                <h1 className="font-almendra text-[1.9rem] md:text-[2.25rem] font-normal leading-none tracking-tight">
                                    Inscribe a new page
                                </h1>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl">
                                    Your article starts as a draft. Set its identity and appearance — the editor opens right after you create it.
                                </p>
                            </motion.div>

                            {/* Card: Identity */}
                            <motion.section
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.05 }}
                                className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden"
                            >
                                <div className="px-5 md:px-7 py-7 flex flex-col gap-6">
                                    <div className="flex items-center gap-3">
                                        <span className="size-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">1</span>
                                        <div>
                                            <h2 className="text-sm font-semibold tracking-tight">Identity</h2>
                                            <p className="text-xs text-muted-foreground">Title and address on the shelves</p>
                                        </div>
                                    </div>

                                    {/* Title — editorial large field */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="new-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Title
                                        </Label>
                                        <div className="relative group">
                                            <input
                                                id="new-title"
                                                value={title}
                                                onChange={handleTitleChange}
                                                placeholder="The Dragon War of Aeloria…"
                                                autoFocus
                                                className="w-full bg-transparent border-0 border-b border-border/70 focus:border-primary rounded-none px-0 py-3 font-almendra text-2xl md:text-3xl placeholder:text-muted-foreground/40 focus:outline-none focus-visible:ring-0 transition-colors"
                                            />
                                            <div className="absolute bottom-0 left-0 h-px w-0 group-focus-within:w-full bg-primary transition-all duration-300" />
                                        </div>
                                        <div className="flex justify-between text-[11px] text-muted-foreground">
                                            <span>{title.length === 0 ? "A memorable title helps readers find this page." : `${title.length} characters`}</span>
                                            <span className={cn(title.length > 60 && "text-amber-600")}>{title.length}/80</span>
                                        </div>
                                    </div>

                                    {/* Slug */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="new-slug" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Address <span className="normal-case font-normal tracking-normal">· must be unique</span>
                                        </Label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground select-none pointer-events-none">/wiki/</span>
                                            <Input
                                                id="new-slug"
                                                value={slug}
                                                onChange={handleSlugChange}
                                                placeholder="dragon-war-of-aeloria"
                                                className="pl-[3.6rem] pr-9 h-10 font-mono text-xs bg-muted/30"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCopySlug}
                                                disabled={!slug}
                                                className="absolute right-1.5 top-1/2 -translate-y-1/2 size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                                                aria-label="Copy slug"
                                            >
                                                {slugCopied ? <CheckIcon weight="bold" className="size-3.5 text-emerald-600" /> : <CopyIcon weight="regular" className="size-3.5" />}
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                            <LinkIcon className="size-3" />
                                            {slug ? `everthorn.gg/wiki/${slug}` : "Slug auto-generates from title — you can edit it."}
                                        </p>
                                    </div>

                                    {/* Summary */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="new-summary" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Summary
                                            </Label>
                                            <span className={cn("text-[11px] font-mono", summary.length > 180 ? "text-amber-600" : "text-muted-foreground")}>{summary.length}/200</span>
                                        </div>
                                        <Textarea
                                            id="new-summary"
                                            value={summary}
                                            onChange={(e) => setSummary(e.target.value.slice(0, 200))}
                                            placeholder="A single evocative sentence — what will a reader learn here?"
                                            className="resize-none text-sm min-h-[84px] bg-muted/30"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </motion.section>

                            {/* Card: Category & Tags */}
                            <motion.section
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.1 }}
                                className="mt-5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden"
                            >
                                <div className="px-5 md:px-7 py-7 flex flex-col gap-6">
                                    <div className="flex items-center gap-3">
                                        <span className="size-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">2</span>
                                        <div>
                                            <h2 className="text-sm font-semibold tracking-tight">Classification</h2>
                                            <p className="text-xs text-muted-foreground">Where this belongs on the shelves</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                            {categoryOptions.map((opt) => {
                                                const Icon = opt.icon;
                                                const selected = category === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setCategory(opt.value)}
                                                        className={cn(
                                                            "group relative rounded-xl border px-3 py-3.5 text-left transition-all flex flex-col gap-2",
                                                            selected
                                                                ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.01]"
                                                                : "bg-muted/30 hover:bg-muted/60 border-border/50 hover:border-border hover:shadow-sm",
                                                        )}
                                                    >
                                                        {Icon && (
                                                            <Icon
                                                                weight={selected ? "fill" : "duotone"}
                                                                className={cn("size-5", selected ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")}
                                                            />
                                                        )}
                                                        <span className={cn("text-xs font-semibold leading-none", selected ? "text-primary-foreground" : "text-foreground")}>{opt.label}</span>
                                                        {selected && <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary-foreground/80" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {activeCategory && (
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                                <span className="size-1.5 rounded-full" style={{ background: `hsl(${activeCategory.hue} 60% 50%)` }} />
                                                Filed under <span className="font-medium text-foreground">{activeCategory.label}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</Label>
                                        <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                                            <TagsInput
                                                defaultTags={[]}
                                                maxTags={8}
                                                onChange={(t) => setTags(t.map((x) => x.label))}
                                            />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">Press Enter to add · up to 8 tags · Backspace removes the last one</p>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Card: Cover */}
                            <motion.section
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.15 }}
                                className="mt-5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden"
                            >
                                <div className="px-5 md:px-7 py-7 flex flex-col gap-5">
                                    <div className="flex items-center gap-3">
                                        <span className="size-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">3</span>
                                        <div>
                                            <h2 className="text-sm font-semibold tracking-tight">Cover</h2>
                                            <p className="text-xs text-muted-foreground">Shown on the card and article header</p>
                                        </div>
                                    </div>

                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                                    {/* Dropzone */}
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setDragOver(false);
                                            const file = e.dataTransfer.files?.[0];
                                            if (file) handleFile(file);
                                        }}
                                        onClick={() => !isUploading && fileInputRef.current?.click()}
                                        className={cn(
                                            "relative rounded-xl border-2 border-dashed px-4 py-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all",
                                            dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/60 bg-muted/20 hover:bg-muted/30 hover:border-border",
                                            isUploading && "pointer-events-none opacity-60",
                                        )}
                                    >
                                        <span className="size-10 rounded-xl bg-card border border-border/50 shadow-sm grid place-items-center">
                                            {isUploading ? <SpinnerIcon weight="bold" className="size-5 animate-spin text-muted-foreground" /> : <ImageIcon weight="duotone" className="size-5 text-muted-foreground" />}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium">{isUploading ? "Uploading…" : "Drop an image or click to browse"}</p>
                                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP · max 10 MB</p>
                                        </div>
                                        {!isUploading && (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                                                <UploadSimpleIcon weight="bold" className="size-3.5" /> Upload image
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-px flex-1 bg-border/50" />
                                        <span className="text-[11px] tracking-wider uppercase font-semibold text-muted-foreground">or paste a URL</span>
                                        <div className="h-px flex-1 bg-border/50" />
                                    </div>

                                    <div className="relative">
                                        <LinkIcon weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                                        <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://…" className="pl-8 h-10 font-mono text-xs bg-muted/30" />
                                        {coverImage && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                                                onClick={() => setCoverImage("")}
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>

                                    {coverImage && (
                                        <div className="rounded-xl overflow-hidden border border-border/50 aspect-[16/9] bg-muted/20">
                                            <img
                                                src={coverImage}
                                                alt="Cover preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                                            />
                                        </div>
                                    )}
                                    {!coverImage && (
                                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                                            No cover yet — a generated parchment gradient will be used.
                                        </p>
                                    )}
                                </div>
                            </motion.section>

                            {/* Card: Visibility */}
                            <motion.section
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.2 }}
                                className="mt-5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden"
                            >
                                <div className="px-5 md:px-7 py-7 flex flex-col gap-5">
                                    <div className="flex items-center gap-3">
                                        <span className="size-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">4</span>
                                        <div>
                                            <h2 className="text-sm font-semibold tracking-tight">Visibility</h2>
                                            <p className="text-xs text-muted-foreground">Who can see and edit this</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <label className={cn("flex items-center justify-between gap-4 rounded-xl border px-4 py-4 cursor-pointer transition-colors", published ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50" : "bg-muted/20 border-border/50 hover:bg-muted/30")}>
                                            <div className="flex gap-3">
                                                <span className={cn("size-9 rounded-lg grid place-items-center border shrink-0", published ? "bg-emerald-600 text-white border-emerald-600" : "bg-card border-border/50 text-muted-foreground")}>
                                                    <EyeIcon weight={published ? "fill" : "duotone"} className="size-4" />
                                                </span>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-medium leading-none">Published</span>
                                                    <span className="text-xs text-muted-foreground leading-relaxed">{published ? "Visible to all members in the archives" : "Draft — only you can see it (via My Drafts)"}</span>
                                                </div>
                                            </div>
                                            <Switch checked={published} onCheckedChange={setPublished} className="shrink-0" />
                                        </label>

                                        <label className={cn("flex items-center justify-between gap-4 rounded-xl border px-4 py-4 cursor-pointer transition-colors", locked ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50" : "bg-muted/20 border-border/50 hover:bg-muted/30")}>
                                            <div className="flex gap-3">
                                                <span className={cn("size-9 rounded-lg grid place-items-center border shrink-0", locked ? "bg-amber-600 text-white border-amber-600" : "bg-card border-border/50 text-muted-foreground")}>
                                                    <LockIcon weight={locked ? "fill" : "duotone"} className="size-4" />
                                                </span>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-medium leading-none">Locked</span>
                                                    <span className="text-xs text-muted-foreground leading-relaxed">{locked ? "Only you and staff can edit" : "Any member can propose edits"}</span>
                                                </div>
                                            </div>
                                            <Switch checked={locked} onCheckedChange={setLocked} className="shrink-0" />
                                        </label>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Mobile actions */}
                            <div className="mt-6 flex gap-3 lg:hidden">
                                <Button size="lg" className="flex-1 h-11 gap-2 text-sm" onClick={handleCreate} disabled={!canSubmit}>
                                    {createMutation.isPending ? <SpinnerIcon weight="bold" className="size-4 animate-spin" /> : <PlusIcon weight="bold" className="size-4" />}
                                    {createMutation.isPending ? "Creating…" : "Create article"}
                                </Button>
                                <Button variant="outline" size="lg" className="h-11" asChild>
                                    <Link to="/wiki">Cancel</Link>
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT — Live preview (sticky on desktop) */}
                        <div className="hidden lg:block lg:sticky lg:top-[72px]">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Live preview</p>

                            {/* Card preview */}
                            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
                                {/* Card image area mimicking WikiArticleCard */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    {coverImage ? (
                                        <img src={coverImage} alt={title || "Preview"} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0" style={getFallbackCoverStyle(slug || "preview", category)} />
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                        <Badge className={cn("border text-[9px] uppercase tracking-wider backdrop-blur-sm", getCategoryBadge(category))}>{activeCategory?.label ?? category}</Badge>
                                        {locked && (
                                            <Badge variant="outline" className="text-[9px] gap-1 bg-black/40 text-white border-white/20 backdrop-blur-sm">
                                                <LockIcon weight="bold" className="size-2.5" /> Locked
                                            </Badge>
                                        )}
                                        {!published && (
                                            <Badge variant="outline" className="text-[9px] border-amber-500/40 text-amber-200 bg-black/40 backdrop-blur-sm">Draft</Badge>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="font-almendra font-normal text-xl leading-snug text-white line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] [word-spacing:0.1em]">
                                            {title || "Untitled chronicle"}
                                        </h3>
                                        <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                            {summary || "Your summary will appear here — a single evocative line."}
                                        </p>
                                        <div className="flex items-center gap-2 mt-3 text-[10px] text-white/60">
                                            <span className="flex items-center gap-1"><UserIcon weight="duotone" className="size-3" /> {thornyUser?.username ?? "You"}</span>
                                            <span className="flex items-center gap-1"><CalendarBlankIcon weight="duotone" className="size-3" /> just now</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 py-3 flex flex-wrap gap-1.5 border-t border-border/50 bg-muted/20">
                                    {tags.length > 0 ? tags.map((t) => (
                                        <span key={t} className="inline-flex items-center rounded-full bg-card border border-border/50 px-2.5 py-1 text-[11px] font-medium">
                                            #{t}
                                        </span>
                                    )) : <span className="text-xs text-muted-foreground">Tags will appear here…</span>}
                                </div>
                            </div>

                            {/* URL preview */}
                            <div className="mt-4 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Article address</p>
                                <p className="font-mono text-xs break-all">
                                    <span className="text-muted-foreground">everthorn.gg</span>
                                    <span className="text-foreground">/wiki/{slug || <span className="text-muted-foreground">your-slug</span>}</span>
                                </p>
                            </div>

                            {/* Hint */}
                            <div className="mt-4 rounded-xl border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/70 dark:bg-amber-950/20 px-4 py-3 flex gap-2.5">
                                <span className="size-6 rounded-full bg-amber-500 text-white grid place-items-center shrink-0 mt-0.5">
                                    <PencilSimpleIcon weight="bold" className="size-3" />
                                </span>
                                <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                                    After creating, you'll land in the editor. Write with <span className="font-mono font-medium">/ </span> for blocks, paste images, and hit <span className="font-medium">⌘ S</span> to save.
                                </p>
                            </div>

                            <div className="mt-4 hidden lg:flex gap-2">
                                <Button size="sm" className="flex-1 h-10 gap-1.5" onClick={handleCreate} disabled={!canSubmit}>
                                    {createMutation.isPending ? <SpinnerIcon weight="bold" className="size-4 animate-spin" /> : <PlusIcon weight="bold" className="size-4" />}
                                    Create & open editor
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
