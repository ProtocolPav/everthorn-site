import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    CopyIcon,
    CheckIcon,
    PencilSimpleIcon,
    CaretDownIcon,
    WarningCircleIcon,
    CheckCircleIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useEverthornMember } from "@/hooks/use-everthorn-member";
import { getVisibleCategories, getAssignableCategories, getFallbackCoverStyle } from "@/config/wiki-options.ts";
import { useGetWikiPageV1GuildsMeWikiSlugGet } from "@/api/nexuscore/wiki-pages/wiki-pages.ts";
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
    slug?: string;
}

interface WikiPageFormProps {
    data: WikiPageFormData;
    onChange: (patch: Partial<WikiPageFormData>) => void;
    uploadFile: (file: File) => Promise<string>;
    mode: "create" | "edit";
    variant?: "page" | "dialog";
    autoFocusTitle?: boolean;
    slugTouched?: boolean;
    onSlugTouched?: () => void;
}

function slugify(value: string): string {
    return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function OrnamentalDivider() {
    return (
        <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-border/40" />
            <span className="size-1.5 rotate-45 border border-border/60 bg-card" aria-hidden />
            <div className="h-px flex-1 bg-border/40" />
        </div>
    );
}

// ─── Main — configuration atelier, not a form ──────────────────────

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
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [showAdvancedLink, setShowAdvancedLink] = useState(false);
    const { isCM } = useEverthornMember();

    const isCreate = mode === "create";
    const categoryOptions = isCreate ? getAssignableCategories(isCM) : getVisibleCategories(isCM, false);

    // ── Slug availability check (create only) ───────────────────────
    const [debouncedSlug, setDebouncedSlug] = useState(data.slug ?? "");
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSlug(data.slug ?? ""), 400);
        return () => clearTimeout(t);
    }, [data.slug]);

    const slugToCheck = isCreate && debouncedSlug && debouncedSlug.length >= 2 ? debouncedSlug : "";

    const {
        data: existingPage,
        isFetching: isCheckingSlug,
        isError: slugNotFound,
    } = useGetWikiPageV1GuildsMeWikiSlugGet(slugToCheck, {
        query: {
            enabled: !!slugToCheck,
            retry: false,
            staleTime: 0,
            gcTime: 0,
            refetchOnWindowFocus: false,
        },
    } as any);

    const isSlugTaken = !!slugToCheck && !!existingPage && !slugNotFound;
    const isSlugAvailable = !!slugToCheck && slugNotFound && !isCheckingSlug;

    useEffect(() => {
        if (isSlugTaken) setShowAdvancedLink(true);
    }, [isSlugTaken]);

    const slugSuggestions = useMemo(() => {
        if (!isSlugTaken || !debouncedSlug) return [];
        const base = debouncedSlug.replace(/-\d+$/, "");
        const candidates = [`${base}-2`, `${base}-${data.category}`, `${base}-chronicle`].filter((s) => s !== debouncedSlug);
        return candidates.slice(0, 3);
    }, [isSlugTaken, debouncedSlug, data.category]);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file", { description: "Please select an image file." });
            return;
        }
        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            onChange({ cover_image: url });
            toast.success("Cover updated");
        } catch {
            toast.error("Upload failed", { description: "Could not upload the cover image." });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        if (isCreate && !slugTouched) onChange({ title: next, slug: slugify(next) });
        else onChange({ title: next });
    };
    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSlugTouched?.();
        onChange({ slug: slugify(e.target.value) });
    };
    const handleCopySlug = async () => {
        if (!data.slug) return;
        await navigator.clipboard.writeText(`everthorn.net/wiki/${data.slug}`);
        setSlugCopied(true);
        setTimeout(() => setSlugCopied(false), 1200);
    };

    const isPage = variant === "page";

    return (
        <div className={cn("flex flex-col", isPage ? "gap-7" : "gap-6")}>
            <div className="flex flex-col">
                {/* ── Manuscript header — title is the hero ── */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                    className={cn(
                        "relative z-10 overflow-hidden",
                        isPage
                            ? "rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm shadow-sm"
                            : "rounded-xl border border-border/50 bg-card",
                    )}
                >
                <div className={cn(isPage ? "px-5 md:px-7 pt-6 pb-5" : "p-5", "flex flex-col gap-5")}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={isCreate ? "page-title-create" : "page-title-edit"} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                                    "w-full bg-transparent border-0 border-b border-border/60 focus:border-primary rounded-none px-0 placeholder:text-muted-foreground/35 focus:outline-none focus-visible:ring-0 transition-colors",
                                    isPage ? "py-3 font-almendra text-[1.95rem] md:text-[2.05rem] leading-none" : "py-2.5 font-almendra text-2xl",
                                )}
                            />
                            <div className="absolute bottom-0 left-0 h-px w-0 group-focus-within:w-full bg-primary transition-all duration-300" />
                        </div>
                        {isCreate && (
                            <div className="flex justify-end">
                                <span className={cn("text-[11px] font-mono", data.title.length > 60 ? "text-amber-600" : "text-muted-foreground/70")}>{data.title.length}/80</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor={isCreate ? "page-summary-create" : "page-summary-edit"} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Summary
                            </Label>
                            <span className={cn("text-[11px] font-mono", (data.summary?.length ?? 0) > 180 ? "text-amber-600" : "text-muted-foreground/70")}>
                                {data.summary?.length ?? 0}/200
                            </span>
                        </div>
                        <Textarea
                            id={isCreate ? "page-summary-create" : "page-summary-edit"}
                            value={data.summary ?? ""}
                            onChange={(e) => onChange({ summary: e.target.value.slice(0, 200) || null })}
                            placeholder="One line that tells readers what this page is about."
                            className="resize-none text-sm min-h-[72px] bg-muted/20 border-border/50 focus-visible:ring-1"
                            rows={2}
                        />
                    </div>
                </div>
            </motion.div>

            {/* ── Page link — extension tucked behind the title card ── */}
            {isCreate && (
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                    className={cn(
                        "relative z-0 -mt-4 mx-1 rounded-b-2xl border border-t-0 overflow-hidden",
                        isPage ? "bg-muted/35 dark:bg-zinc-900/70 backdrop-blur-sm border-border/40 shadow-[0_4px_10px_-4px_oklch(0_0_0/0.12)]" : "bg-muted/25 border-border/40",
                    )}
                >
                    <button
                        type="button"
                        onClick={() => setShowAdvancedLink((v) => !v)}
                        className="group w-full flex items-center gap-2 px-3 pt-5 pb-2 text-left"
                        aria-expanded={showAdvancedLink || isSlugTaken}
                    >
                        <span className="hidden sm:grid size-5 rounded-md bg-card/60 border border-border/30 place-items-center shrink-0">
                            <LinkIcon weight="duotone" className="size-3 text-muted-foreground" />
                        </span>
                        <div className="min-w-0 flex-1 flex items-center gap-1.5">
                            <p className="text-[11px] font-mono truncate text-muted-foreground">
                                <span className="hidden sm:inline">everthorn.net/wiki/</span>
                                <span className="sm:hidden">/wiki/</span>
                                <span className={cn("font-medium", isSlugTaken ? "text-destructive" : "text-foreground/80")}>{data.slug || "your-link"}</span>
                            </p>
                            {isCheckingSlug && slugToCheck ? (
                                <SpinnerIcon weight="bold" className="size-3 animate-spin text-muted-foreground shrink-0" />
                            ) : isSlugTaken ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 border border-destructive/20 px-1.5 py-0.5 text-[10px] font-medium text-destructive shrink-0">
                                    <WarningCircleIcon weight="fill" className="size-3" /> Taken
                                </span>
                            ) : isSlugAvailable && data.slug ? (
                                <CheckCircleIcon weight="fill" className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : null}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground/50 group-hover:text-muted-foreground border border-transparent group-hover:border-border/30 group-hover:bg-card/50 rounded-md px-1.5 py-0.5 transition-colors shrink-0">
                            <PencilSimpleIcon weight="regular" className="size-3" />
                            <span className="hidden sm:inline">{showAdvancedLink || isSlugTaken ? "Done" : "Edit"}</span>
                            <CaretDownIcon weight="bold" className={cn("size-3 transition-transform hidden sm:block", (showAdvancedLink || isSlugTaken) && "rotate-180")} />
                        </span>
                    </button>

                    <AnimatePresence initial={false}>
                        {(showAdvancedLink || isSlugTaken) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="px-3.5 pb-3.5 pt-3 border-t border-border/30 bg-muted/20 flex flex-col gap-3">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground select-none pointer-events-none">everthorn.net/wiki/</span>
                                        <Input
                                            id="page-slug"
                                            value={data.slug ?? ""}
                                            onChange={handleSlugChange}
                                            placeholder="dragon-war-of-aeloria"
                                            aria-invalid={isSlugTaken}
                                            className={cn(
                                                "pl-[10.6rem] pr-9 h-9 font-mono text-xs bg-card",
                                                isSlugTaken ? "border-destructive/40 focus-visible:ring-destructive/20 focus-visible:border-destructive/50" : "border-border/50",
                                            )}
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
                                    {isSlugTaken ? (
                                        <div className="rounded-lg border border-border/40 bg-muted/20 p-2.5 flex flex-col gap-2">
                                            <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                                <span className="size-1.5 rounded-full bg-destructive shrink-0" aria-hidden /> That link is already used — try one of these:
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {slugSuggestions.map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => onChange({ slug: s })}
                                                        className="inline-flex items-center rounded-md bg-card border border-border/50 px-2.5 py-1 text-xs font-mono hover:bg-muted transition-colors"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                )}
            </div>

            {/* ── Cover — the tapestry, not a file picker ── */}
            <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                className={cn(
                    "overflow-hidden",
                    isPage ? "rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm shadow-sm" : "rounded-xl border border-border/50 bg-card",
                )}
            >
                <div className={cn(isPage ? "px-5 md:px-7 pt-5 pb-5" : "p-5", "flex flex-col gap-4")}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <span className="size-8 rounded-md bg-muted border border-border/50 grid place-items-center">
                                <ImageIcon weight="duotone" className="size-4 text-muted-foreground" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold leading-none">Cover</p>
                                <p className="text-xs text-muted-foreground">Card and header image — 16:9</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {data.cover_image && (
                                <Button variant="ghost" size="sm" className="h-7 text-xs px-2.5" onClick={() => onChange({ cover_image: null })}>
                                    Remove
                                </Button>
                            )}
                            <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 gap-1.5" onClick={() => setShowUrlInput((v) => !v)} type="button">
                                <LinkIcon className="size-3.5" />
                                URL
                            </Button>
                        </div>
                    </div>

                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={cn(
                            "group relative rounded-xl overflow-hidden border aspect-[16/9] cursor-pointer transition-all bg-muted",
                            dragOver ? "border-primary ring-2 ring-primary/20" : "border-border/50 hover:border-border",
                            isUploading && "pointer-events-none opacity-60",
                        )}
                    >
                        {data.cover_image ? (
                            <img src={data.cover_image} alt="Cover" className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                        ) : (
                            <div className="absolute inset-0" style={getFallbackCoverStyle(data.title || "preview", data.category)} />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/95 text-zinc-900 px-3 py-1.5 text-xs font-medium shadow">
                                {isUploading ? <><SpinnerIcon weight="bold" className="size-3.5 animate-spin" /> Uploading…</> : <><UploadSimpleIcon weight="bold" className="size-3.5" /> {data.cover_image ? "Change cover" : "Add cover image"}</>}
                            </span>
                            <span className="text-[11px] text-white/80">Drop an image or click · PNG, JPG, WebP</span>
                        </div>
                        {!data.cover_image && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none group-hover:opacity-0 transition-opacity">
                                <ImageIcon weight="duotone" className="size-6 text-white/70" />
                                <span className="text-xs font-medium text-white/85">No cover yet</span>
                                <span className="text-[11px] text-white/65">Parchment gradient will be used</span>
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-black/55 backdrop-blur px-2 py-1 text-[10px] font-medium text-white border border-white/10">
                                <PencilSimpleIcon weight="bold" className="size-3" />
                                Edit
                            </span>
                        </div>
                    </div>

                    {showUrlInput && (
                        <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                            <LinkIcon weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                            <Input
                                value={data.cover_image ?? ""}
                                onChange={(e) => onChange({ cover_image: e.target.value || null })}
                                placeholder="Or paste an image URL…"
                                className="pl-8 h-9 font-mono text-xs bg-muted/20 border-border/50"
                            />
                        </div>
                    )}
                </div>
            </motion.section>

            {/* ── Status — visibility as two tactile switches, not a footer ── */}
            <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                className={cn(
                    "overflow-hidden",
                    isPage ? "rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm shadow-sm" : "rounded-xl border border-border/50 bg-card",
                )}
            >
                <div className={cn(isPage ? "px-5 md:px-7 py-5" : "p-5", "flex flex-col gap-4")}>
                    <div>
                        <p className="text-sm font-semibold leading-none">Visibility & access</p>
                        <p className="text-xs text-muted-foreground mt-1">Who can see and edit this page</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={cn("group flex items-center justify-between gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors", data.published ? "bg-emerald-50 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-900/40" : "bg-muted/20 border-border/50 hover:bg-muted/30")}>
                            <div className="flex gap-2.5 min-w-0">
                                <span className={cn("size-8 rounded-md grid place-items-center border shrink-0 transition-colors", data.published ? "bg-emerald-600 text-white border-emerald-600" : "bg-card border-border/50 text-muted-foreground group-hover:text-foreground")}>
                                    <EyeIcon weight={data.published ? "fill" : "duotone"} className="size-4" />
                                </span>
                                <div className="min-w-0">
                                    <span className="text-sm font-medium leading-none block">Published</span>
                                    <span className="text-xs text-muted-foreground leading-snug block mt-0.5">{data.published ? "Visible to everyone" : "Only you · My Drafts"}</span>
                                </div>
                            </div>
                            <Switch checked={data.published} onCheckedChange={(v) => onChange({ published: v })} className="shrink-0" />
                        </label>

                        <label className={cn("group flex items-center justify-between gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors", data.locked ? "bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/40" : "bg-muted/20 border-border/50 hover:bg-muted/30")}>
                            <div className="flex gap-2.5 min-w-0">
                                <span className={cn("size-8 rounded-md grid place-items-center border shrink-0 transition-colors", data.locked ? "bg-amber-600 text-white border-amber-600" : "bg-card border-border/50 text-muted-foreground group-hover:text-foreground")}>
                                    <LockIcon weight={data.locked ? "fill" : "duotone"} className="size-4" />
                                </span>
                                <div className="min-w-0">
                                    <span className="text-sm font-medium leading-none block">Locked</span>
                                    <span className="text-xs text-muted-foreground leading-snug block mt-0.5">{data.locked ? "Only you & staff" : "Anyone can edit"}</span>
                                </div>
                            </div>
                            <Switch checked={data.locked} onCheckedChange={(v) => onChange({ locked: v })} className="shrink-0" />
                        </label>
                    </div>
                </div>
            </motion.section>

            <OrnamentalDivider />

            {/* ── Organize — shelf, not form ── */}
            <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                className={cn(
                    "overflow-hidden",
                    isPage ? "rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm shadow-sm" : "rounded-xl border border-border/50 bg-card",
                )}
            >
                <div className={cn(isPage ? "px-5 md:px-7 py-6" : "p-5", "flex flex-col gap-5")}>
                    <div>
                        <p className="text-sm font-semibold leading-none">Organize</p>
                        <p className="text-xs text-muted-foreground mt-1">Category and tags help people discover your page</p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {categoryOptions.map((opt) => {
                                const Icon = opt.icon;
                                const selected = data.category === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => onChange({ category: opt.value })}
                                        className={cn(
                                            "group relative rounded-xl border px-3 py-3 text-left transition-all flex items-center gap-2.5",
                                            selected
                                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                : "bg-muted/20 hover:bg-muted/40 border-border/50 hover:border-border",
                                        )}
                                    >
                                        {Icon && <Icon weight={selected ? "fill" : "duotone"} className={cn("size-[18px] shrink-0", selected ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />}
                                        <span className={cn("text-xs font-semibold", selected ? "text-primary-foreground" : "text-foreground")}>{opt.label}</span>
                                        {selected && <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary-foreground/80" aria-hidden />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tags</Label>
                        <div className="rounded-xl border border-border/50 bg-muted/20 p-2.5">
                            <TagsInput key={`${data.category}-${data.tags.join(",")}`} defaultTags={data.tags} maxTags={8} onChange={(t) => onChange({ tags: t.map((x) => x.label) })} />
                        </div>
                        <p className="text-[11px] text-muted-foreground">Press Enter to add · up to 8</p>
                    </div>

                    {variant === "dialog" && (
                        <p className="text-[11px] leading-relaxed text-muted-foreground border-t border-border/40 pt-4 -mb-1">
                            Staged with your content — <span className="font-medium text-foreground">Save</span> in the editor to publish.
                        </p>
                    )}
                </div>
            </motion.section>
        </div>
    );
}
