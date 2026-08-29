import { useRef, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Button } from "@/components/ui/button.tsx";
import { TagsInput } from "@/components/common/tags-input.tsx";
import {
    LinkIcon,
    UploadSimpleIcon,
    SpinnerIcon,
    EyeIcon,
    LockIcon,
    ImageIcon,
    TagIcon,
    ArticleIcon,
    CopyIcon,
    CheckIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useEverthornMember } from "@/hooks/use-everthorn-member";
import { getVisibleCategories, getAssignableCategories, getFallbackCoverStyle } from "@/config/wiki-options.ts";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────

export interface WikiPageFormData {
    title: string;
    summary: string | null;
    category: string;
    tags: string[];
    cover_image: string | null;
    locked: boolean;
    published: boolean;
    /** Only used in create mode — omitted in edit mode (slug is immutable) */
    slug?: string;
}

interface WikiPageFormProps {
    data: WikiPageFormData;
    onChange: (patch: Partial<WikiPageFormData>) => void;
    uploadFile: (file: File) => Promise<string>;
    mode: "create" | "edit";
    /** When true, card chrome uses dialog-optimized spacing (no extra shadows) */
    variant?: "page" | "dialog";
    /** Title input autofocus — only on create */
    autoFocusTitle?: boolean;
    /** Slug touched flag for create mode — controls auto-generation hint text */
    slugTouched?: boolean;
    onSlugTouched?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

// ─── Reusable section shells ───────────────────────────────────────

function SectionHeader({ number, title, description }: { number: string | number; title: string; description: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="size-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold shrink-0">
                {number}
            </span>
            <div>
                <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function SectionLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Icon weight="duotone" className="size-3.5" />
            {children}
        </div>
    );
}

// ─── Main form ───────────────────────────────────────────────────────

export function WikiPageForm({
    data,
    onChange,
    uploadFile,
    mode,
    variant = "page",
    autoFocusTitle,
    slugTouched,
    onSlugTouched,
}: WikiPageFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [slugCopied, setSlugCopied] = useState(false);
    const { isCM } = useEverthornMember();

    const isCreate = mode === "create";
    const categoryOptions = isCreate ? getAssignableCategories(isCM) : getVisibleCategories(isCM, false);
    const activeCategory = categoryOptions.find((c) => c.value === data.category);

    // Card shell — same visual language on both page and dialog, density adjusts via variant
    const cardClass = variant === "dialog"
        ? "rounded-xl border border-border/50 bg-card"
        : "rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden";

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file", { description: "Please select an image file." });
            return;
        }
        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            onChange({ cover_image: url });
            toast.success("Cover uploaded");
        } catch {
            toast.error("Upload failed", { description: "Could not upload the cover image." });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextTitle = e.target.value;
        if (isCreate && !slugTouched) {
            onChange({ title: nextTitle, slug: slugify(nextTitle) });
        } else {
            onChange({ title: nextTitle });
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSlugTouched?.();
        onChange({ slug: slugify(e.target.value) });
    };

    const handleCopySlug = async () => {
        if (!data.slug) return;
        await navigator.clipboard.writeText(`/wiki/${data.slug}`);
        setSlugCopied(true);
        setTimeout(() => setSlugCopied(false), 1200);
    };

    return (
        <div className={cn("flex flex-col", variant === "dialog" ? "gap-6" : "gap-5")}>
            {/* ── Identity ────────────────────────────────────────── */}
            <section className={cardClass}>
                <div className={cn(variant === "dialog" ? "p-6" : "px-5 md:px-7 py-7", "flex flex-col gap-6")}>
                    {variant === "page" ? (
                        <SectionHeader number={1} title="Identity" description="Title and address on the shelves" />
                    ) : (
                        <SectionLabel icon={ArticleIcon}>Identity</SectionLabel>
                    )}

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor={isCreate ? "page-title-create" : "page-title-edit"}
                            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                            Title
                        </Label>
                        <div className="relative group">
                            <input
                                id={isCreate ? "page-title-create" : "page-title-edit"}
                                value={data.title}
                                onChange={handleTitleChange}
                                placeholder={isCreate ? "The Dragon War of Aeloria…" : "Page title"}
                                autoFocus={autoFocusTitle}
                                className={cn(
                                    "w-full bg-transparent border-0 border-b border-border/70 focus:border-primary rounded-none px-0 placeholder:text-muted-foreground/40 focus:outline-none focus-visible:ring-0 transition-colors",
                                    variant === "dialog" ? "py-2.5 font-almendra text-2xl" : "py-3 font-almendra text-2xl md:text-3xl",
                                )}
                            />
                            <div className="absolute bottom-0 left-0 h-px w-0 group-focus-within:w-full bg-primary transition-all duration-300" />
                        </div>
                        {isCreate && (
                            <div className="flex justify-between text-[11px] text-muted-foreground">
                                <span>{data.title.length === 0 ? "A memorable title helps readers find this page." : `${data.title.length} characters`}</span>
                                <span className={cn(data.title.length > 60 && "text-amber-600")}>{data.title.length}/80</span>
                            </div>
                        )}
                    </div>

                    {/* Page link — create only (user-friendly: hide "slug" jargon) */}
                    {isCreate && (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="page-slug" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Page link
                            </Label>
                            <p className="text-[11px] text-muted-foreground leading-relaxed -mt-1">People will use this to find your page. Built from the title — you can change it. Must be unique.</p>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground select-none pointer-events-none">
                                    /wiki/
                                </span>
                                <Input
                                    id="page-slug"
                                    value={data.slug ?? ""}
                                    onChange={handleSlugChange}
                                    placeholder="dragon-war-of-aeloria"
                                    className="pl-[3.6rem] pr-9 h-10 font-mono text-xs bg-muted/30"
                                />
                                <button
                                    type="button"
                                    onClick={handleCopySlug}
                                    disabled={!data.slug}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                                    aria-label="Copy link"
                                >
                                    {slugCopied ? <CheckIcon weight="bold" className="size-3.5 text-emerald-600" /> : <CopyIcon weight="regular" className="size-3.5" />}
                                </button>
                            </div>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                <LinkIcon className="size-3" />
                                {data.slug ? `everthorn.net/wiki/${data.slug}` : "Your link will appear here once you add a title."}
                            </p>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor={isCreate ? "page-summary-create" : "page-summary-edit"} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Summary
                            </Label>
                            <span className={cn("text-[11px] font-mono", (data.summary?.length ?? 0) > 180 ? "text-amber-600" : "text-muted-foreground")}>
                                {data.summary?.length ?? 0}/200
                            </span>
                        </div>
                        <Textarea
                            id={isCreate ? "page-summary-create" : "page-summary-edit"}
                            value={data.summary ?? ""}
                            onChange={(e) => onChange({ summary: e.target.value.slice(0, 200) || null })}
                            placeholder={isCreate ? "A single evocative sentence — what will a reader learn here?" : "A single sentence — what will a reader discover here?"}
                            className="resize-none text-sm min-h-[84px] bg-muted/20"
                            rows={3}
                        />
                    </div>
                </div>
            </section>

            {/* ── Classification ──────────────────────────────────── */}
            <section className={cardClass}>
                <div className={cn(variant === "dialog" ? "p-6" : "px-5 md:px-7 py-7", "flex flex-col gap-6")}>
                    {variant === "page" ? (
                        <SectionHeader number={2} title="Classification" description="Where this belongs on the shelves" />
                    ) : (
                        <SectionLabel icon={TagIcon}>Classification</SectionLabel>
                    )}

                    <div className="flex flex-col gap-3">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {categoryOptions.map((opt) => {
                                const Icon = opt.icon;
                                const selected = data.category === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => onChange({ category: opt.value })}
                                        className={cn(
                                            "group relative rounded-xl border px-3 py-3.5 text-left transition-all flex flex-col gap-2",
                                            selected
                                                ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.01]"
                                                : "bg-muted/30 hover:bg-muted/60 border-border/50 hover:border-border hover:shadow-sm",
                                            variant === "dialog" && selected && "scale-100",
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
                        {activeCategory && variant === "page" && (
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
                                key={`${data.category}-${data.tags.join(",")}`}
                                defaultTags={data.tags}
                                maxTags={8}
                                onChange={(t) => onChange({ tags: t.map((x) => x.label) })}
                            />
                        </div>
                        <p className="text-[11px] text-muted-foreground">Press Enter to add · up to 8 tags · Backspace removes the last one</p>
                    </div>
                </div>
            </section>

            {/* ── Cover ───────────────────────────────────────────── */}
            <section className={cardClass}>
                <div className={cn(variant === "dialog" ? "p-6" : "px-5 md:px-7 py-7", "flex flex-col gap-5")}>
                    {variant === "page" ? (
                        <SectionHeader number={3} title="Cover" description="Shown on the card and article header" />
                    ) : (
                        <SectionLabel icon={ImageIcon}>Cover image</SectionLabel>
                    )}

                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={cn(
                            "relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all",
                            variant === "dialog" ? "px-4 py-6" : "px-4 py-8",
                            dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/60 bg-muted/20 hover:bg-muted/30 hover:border-border",
                            isUploading && "pointer-events-none opacity-60",
                        )}
                    >
                        <span className="size-10 rounded-xl bg-card border border-border/50 shadow-sm grid place-items-center">
                            {isUploading ? <SpinnerIcon weight="bold" className="size-5 animate-spin text-muted-foreground" /> : <ImageIcon weight="duotone" className="size-5 text-muted-foreground" />}
                        </span>
                        <div>
                            <p className="text-sm font-medium">{isUploading ? "Uploading…" : variant === "dialog" ? "Drop image or click to browse" : "Drop an image or click to browse"}</p>
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
                        <Input
                            value={data.cover_image ?? ""}
                            onChange={(e) => onChange({ cover_image: e.target.value || null })}
                            placeholder="https://…"
                            className="pl-8 h-10 font-mono text-xs bg-muted/30"
                        />
                        {data.cover_image && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                                onClick={() => onChange({ cover_image: null })}
                            >
                                Clear
                            </Button>
                        )}
                    </div>

                    {data.cover_image ? (
                        <div className="rounded-xl overflow-hidden border border-border/50 aspect-[16/9] bg-muted/20">
                            <img src={data.cover_image} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                        </div>
                    ) : variant === "page" ? (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                            No cover yet — a generated parchment gradient will be used.
                        </p>
                    ) : (
                        <div className="rounded-xl border border-border/40 aspect-[16/7] overflow-hidden relative">
                            <div className="absolute inset-0" style={getFallbackCoverStyle(data.title || "preview", data.category)} />
                            <div className="absolute inset-0 grid place-items-center">
                                <p className="text-xs text-white/70 font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">No cover — parchment fallback will be used</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Visibility ──────────────────────────────────────── */}
            <section className={cardClass}>
                <div className={cn(variant === "dialog" ? "p-6" : "px-5 md:px-7 py-7", "flex flex-col gap-5")}>
                    {variant === "page" ? (
                        <SectionHeader number={4} title="Visibility" description="Who can see and edit this" />
                    ) : (
                        <SectionLabel icon={EyeIcon}>Visibility</SectionLabel>
                    )}

                    <div className="grid gap-3">
                        <label className={cn("flex items-center justify-between gap-4 rounded-xl border px-4 py-4 cursor-pointer transition-colors", data.published ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50" : "bg-muted/20 border-border/50 hover:bg-muted/30")}>
                            <div className="flex gap-3">
                                <span className={cn("size-9 rounded-lg grid place-items-center border shrink-0", data.published ? "bg-emerald-600 text-white border-emerald-600" : "bg-card border-border/50 text-muted-foreground")}>
                                    <EyeIcon weight={data.published ? "fill" : "duotone"} className="size-4" />
                                </span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium leading-none">Published</span>
                                    <span className="text-xs text-muted-foreground leading-relaxed">
                                        {isCreate
                                            ? data.published
                                                ? "Visible to all members in the archives"
                                                : "Draft — only you can see it (via My Drafts)"
                                            : data.published
                                              ? "Visible to all members"
                                              : "Draft — only you can see it"}
                                    </span>
                                </div>
                            </div>
                            <Switch checked={data.published} onCheckedChange={(v) => onChange({ published: v })} className="shrink-0" />
                        </label>

                        <label className={cn("flex items-center justify-between gap-4 rounded-xl border px-4 py-4 cursor-pointer transition-colors", data.locked ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50" : "bg-muted/20 border-border/50 hover:bg-muted/30")}>
                            <div className="flex gap-3">
                                <span className={cn("size-9 rounded-lg grid place-items-center border shrink-0", data.locked ? "bg-amber-600 text-white border-amber-600" : "bg-card border-border/50 text-muted-foreground")}>
                                    <LockIcon weight={data.locked ? "fill" : "duotone"} className="size-4" />
                                </span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium leading-none">Locked</span>
                                    <span className="text-xs text-muted-foreground leading-relaxed">
                                        {data.locked ? "Only you and staff can edit" : isCreate ? "Any member can propose edits" : "Any member can edit"}
                                    </span>
                                </div>
                            </div>
                            <Switch checked={data.locked} onCheckedChange={(v) => onChange({ locked: v })} className="shrink-0" />
                        </label>
                    </div>
                    {variant === "dialog" && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Remember to <span className="font-medium text-foreground">Save</span> after changing settings — they are staged with your content.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
