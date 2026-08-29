import { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { TagsInput } from "@/components/common/tags-input.tsx";
import { getVisibleCategories, getFallbackCoverStyle } from "@/config/wiki-options.ts";
import {
    LinkIcon,
    UploadSimpleIcon,
    SpinnerIcon,
    EyeIcon,
    LockIcon,
    GearIcon,
    ImageIcon,
    TagIcon,
    ArticleIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useEverthornMember } from "@/hooks/use-everthorn-member";
import { cn } from "@/lib/utils";

export interface PageDataDraft {
    title: string;
    summary: string | null;
    category: string;
    tags: string[];
    cover_image: string | null;
    locked: boolean;
    published: boolean;
}

interface WikiPageSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: PageDataDraft;
    onChange: (updated: Partial<PageDataDraft>) => void;
    uploadFile: (file: File) => Promise<string>;
    isAdmin?: boolean;
}

export function WikiPageSettingsDialog({
    open,
    onOpenChange,
    data,
    onChange,
    uploadFile,
}: WikiPageSettingsDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const { isCM } = useEverthornMember();

    const categoryOptions = getVisibleCategories(isCM, false);

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
            toast.error("Upload failed", {
                description: "Could not upload the cover image. Please try again.",
            });
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
                    w-full sm:max-w-[860px]
                    max-h-[92vh]
                    p-0 gap-0
                    overflow-hidden rounded-2xl
                    bg-card
                "
            >
                {/* Header — parchment tint + icon */}
                <DialogHeader className="px-6 md:px-8 py-6 border-b border-border/50 shrink-0 bg-gradient-to-br from-muted/40 via-card to-card">
                    <div className="flex items-start gap-3">
                        <span className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0">
                            <GearIcon weight="bold" className="size-4" />
                        </span>
                        <div className="min-w-0">
                            <DialogTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
                                Page settings
                                <span className="inline-flex items-center rounded-full bg-muted border border-border/50 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                                    {data.published ? "Published" : "Draft"}
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-xs leading-relaxed mt-1">
                                Changes here are staged with your content — hit <span className="font-medium text-foreground">Save</span> to publish them together.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="overflow-y-auto flex-1">
                    <div className="px-6 md:px-8 py-6 flex flex-col gap-8">

                        {/* ── Title & Summary ─────────────────── */}
                        <section className="flex flex-col gap-5">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                <ArticleIcon weight="duotone" className="size-3.5" />
                                Identity
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="page-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Title
                                </Label>
                                <input
                                    id="page-title"
                                    value={data.title}
                                    onChange={(e) => onChange({ title: e.target.value })}
                                    placeholder="Page title"
                                    className="w-full bg-transparent border-0 border-b border-border/70 focus:border-primary rounded-none px-0 py-2.5 font-almendra text-2xl placeholder:text-muted-foreground/40 focus:outline-none focus-visible:ring-0"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="page-summary" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Summary
                                    </Label>
                                    <span className={cn("text-[11px] font-mono", (data.summary?.length ?? 0) > 180 ? "text-amber-600" : "text-muted-foreground")}>
                                        {data.summary?.length ?? 0}/200
                                    </span>
                                </div>
                                <Textarea
                                    id="page-summary"
                                    value={data.summary ?? ""}
                                    onChange={(e) => onChange({ summary: e.target.value.slice(0, 200) || null })}
                                    placeholder="A single sentence — what will a reader discover here?"
                                    className="resize-none text-sm min-h-[72px] bg-muted/20"
                                    rows={3}
                                />
                            </div>
                        </section>

                        <div className="h-px bg-border/50" />

                        {/* ── Category — visual cards ─────────── */}
                        <section className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                <TagIcon weight="duotone" className="size-3.5" />
                                Classification
                            </div>
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
                                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                    : "bg-muted/20 hover:bg-muted/40 border-border/50 hover:border-border",
                                            )}
                                        >
                                            {Icon && <Icon weight={selected ? "fill" : "duotone"} className={cn("size-5", selected ? "text-primary-foreground" : "text-muted-foreground")} />}
                                            <span className={cn("text-xs font-semibold", selected ? "text-primary-foreground" : "text-foreground")}>{opt.label}</span>
                                            {selected && <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary-foreground/80" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* ── Tags ─────────────────────────────── */}
                        <section className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</Label>
                            <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                                <TagsInput
                                    defaultTags={data.tags}
                                    maxTags={8}
                                    onChange={(tags) => onChange({ tags: tags.map((t) => t.label) })}
                                />
                            </div>
                            <p className="text-[11px] text-muted-foreground">Press Enter to add · up to 8</p>
                        </section>

                        <div className="h-px bg-border/50" />

                        {/* ── Cover Image ──────────────────────── */}
                        <section className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                <ImageIcon weight="duotone" className="size-3.5" />
                                Cover image
                            </div>

                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className={cn(
                                    "relative rounded-xl border-2 border-dashed px-4 py-6 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition-all",
                                    dragOver ? "border-primary bg-primary/5" : "border-border/60 bg-muted/10 hover:bg-muted/20",
                                    isUploading && "pointer-events-none opacity-60",
                                )}
                            >
                                <span className="size-9 rounded-xl bg-card border border-border/50 shadow-sm grid place-items-center">
                                    {isUploading ? <SpinnerIcon weight="bold" className="size-4 animate-spin text-muted-foreground" /> : <UploadSimpleIcon weight="bold" className="size-4 text-muted-foreground" />}
                                </span>
                                <p className="text-xs font-medium">{isUploading ? "Uploading…" : "Drop image or click to browse"}</p>
                                <p className="text-[11px] text-muted-foreground">PNG, JPG or WebP · max 10 MB</p>
                            </div>

                            <div className="relative">
                                <LinkIcon weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                                <Input
                                    value={data.cover_image ?? ""}
                                    onChange={(e) => onChange({ cover_image: e.target.value || null })}
                                    placeholder="Or paste a URL…"
                                    className="h-9 pl-8 font-mono text-xs bg-muted/20"
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
                                <div className="rounded-xl overflow-hidden border border-border/50 aspect-video bg-muted/20">
                                    <img
                                        src={data.cover_image}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                                    />
                                </div>
                            ) : (
                                <div className="rounded-xl border border-border/40 aspect-[16/7] overflow-hidden relative">
                                    <div className="absolute inset-0" style={getFallbackCoverStyle(data.title || "preview", data.category)} />
                                    <div className="absolute inset-0 grid place-items-center">
                                        <p className="text-xs text-white/70 font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">No cover — parchment fallback will be used</p>
                                    </div>
                                </div>
                            )}
                        </section>

                        <div className="h-px bg-border/50" />

                        {/* ── Toggles — card style ─────────────── */}
                        <section className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                <EyeIcon weight="duotone" className="size-3.5" />
                                Visibility
                            </div>

                            <div className="grid gap-3">
                                <label className={cn("flex items-center justify-between gap-4 rounded-xl border px-4 py-4 cursor-pointer transition-colors", data.published ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50" : "bg-muted/20 border-border/50 hover:bg-muted/30")}>
                                    <div className="flex gap-3">
                                        <span className={cn("size-9 rounded-lg grid place-items-center border shrink-0", data.published ? "bg-emerald-600 text-white border-emerald-600" : "bg-card border-border/50 text-muted-foreground")}>
                                            <EyeIcon weight={data.published ? "fill" : "duotone"} className="size-4" />
                                        </span>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium leading-none">Published</span>
                                            <span className="text-xs text-muted-foreground leading-relaxed">{data.published ? "Visible to all members" : "Draft — only you can see it"}</span>
                                        </div>
                                    </div>
                                    <Switch checked={data.published} onCheckedChange={(checked) => onChange({ published: checked })} />
                                </label>

                                <label className={cn("flex items-center justify-between gap-4 rounded-xl border px-4 py-4 cursor-pointer transition-colors", data.locked ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50" : "bg-muted/20 border-border/50 hover:bg-muted/30")}>
                                    <div className="flex gap-3">
                                        <span className={cn("size-9 rounded-lg grid place-items-center border shrink-0", data.locked ? "bg-amber-600 text-white border-amber-600" : "bg-card border-border/50 text-muted-foreground")}>
                                            <LockIcon weight={data.locked ? "fill" : "duotone"} className="size-4" />
                                        </span>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium leading-none">Locked</span>
                                            <span className="text-xs text-muted-foreground leading-relaxed">{data.locked ? "Only you & staff can edit" : "Any member can edit"}</span>
                                        </div>
                                    </div>
                                    <Switch checked={data.locked} onCheckedChange={(checked) => onChange({ locked: checked })} />
                                </label>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Remember to <span className="font-medium text-foreground">Save</span> after changing settings — they are staged with your content.
                            </p>
                        </section>
                    </div>
                </div>

                <div className="px-6 md:px-8 py-4 border-t border-border/50 bg-muted/10 flex items-center justify-between gap-3 shrink-0">
                    <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <p className="text-[11px] text-muted-foreground hidden sm:block">Changes are not saved until you hit Save in the editor.</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
