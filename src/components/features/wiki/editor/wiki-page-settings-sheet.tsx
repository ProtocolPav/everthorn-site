import { useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
    LinkIcon,
    UploadSimpleIcon,
    XIcon,
    SpinnerIcon,
    PlusIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

export interface PageDataDraft {
    title: string;
    summary: string | null;
    category: string;
    tags: string[];
    cover_image: string | null;
    locked: boolean;
    published: boolean;
}

interface WikiPageSettingsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: PageDataDraft;
    onChange: (updated: Partial<PageDataDraft>) => void;
    uploadFile: (file: File) => Promise<string>;
}

export function WikiPageSettingsSheet({
    open,
    onOpenChange,
    data,
    onChange,
    uploadFile,
}: WikiPageSettingsSheetProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [tagInput, setTagInput] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            onChange({ cover_image: url });
        } catch {
            toast.error("Upload failed", {
                description: "Could not upload the cover image. Please try again.",
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const addTag = () => {
        const trimmed = tagInput.trim();
        if (!trimmed || data.tags.includes(trimmed)) return;
        onChange({ tags: [...data.tags, trimmed] });
        setTagInput("");
    };

    const removeTag = (tag: string) => {
        onChange({ tags: data.tags.filter((t) => t !== tag) });
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
                <SheetHeader className="px-6 py-5 border-b border-border/50">
                    <SheetTitle className="text-base">Page settings</SheetTitle>
                    <SheetDescription className="text-xs">
                        Changes here are saved together with your content.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="page-title" className="text-sm font-medium">
                            Title
                        </Label>
                        <Input
                            id="page-title"
                            value={data.title}
                            onChange={(e) => onChange({ title: e.target.value })}
                            placeholder="Page title"
                            className="h-9"
                        />
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="page-summary" className="text-sm font-medium">
                            Summary
                        </Label>
                        <Textarea
                            id="page-summary"
                            value={data.summary ?? ""}
                            onChange={(e) => onChange({ summary: e.target.value || null })}
                            placeholder="A short description of this page…"
                            className="resize-none text-sm min-h-[72px]"
                            rows={3}
                        />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="page-category" className="text-sm font-medium">
                            Category
                        </Label>
                        <Input
                            id="page-category"
                            value={data.category}
                            onChange={(e) => onChange({ category: e.target.value })}
                            placeholder="e.g. lore, guides, mechanics"
                            className="h-9"
                        />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Tags</Label>
                        {data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {data.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="gap-1 pr-1 text-xs font-normal"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="rounded-sm opacity-60 hover:opacity-100 transition-opacity ml-0.5"
                                        >
                                            <XIcon weight="bold" className="size-2.5" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="Add a tag…"
                                className="h-9 text-sm"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 px-3"
                                onClick={addTag}
                                disabled={!tagInput.trim()}
                            >
                                <PlusIcon weight="bold" className="size-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Press Enter or comma to add a tag.
                        </p>
                    </div>

                    {/* Cover Image */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Cover image</Label>

                        {/* Upload button */}
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
                                {isUploading ? (
                                    <SpinnerIcon weight="bold" className="size-3.5 animate-spin" />
                                ) : (
                                    <UploadSimpleIcon weight="bold" className="size-3.5" />
                                )}
                                {isUploading ? "Uploading…" : "Upload image"}
                            </Button>
                            {data.cover_image && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-3 text-xs text-destructive hover:text-destructive"
                                    onClick={() => onChange({ cover_image: null })}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>

                        {/* URL fallback */}
                        <div className="relative">
                            <LinkIcon
                                weight="regular"
                                className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
                            />
                            <Input
                                value={data.cover_image ?? ""}
                                onChange={(e) =>
                                    onChange({ cover_image: e.target.value || null })
                                }
                                placeholder="Or paste a URL…"
                                className="h-9 pl-8 font-mono text-xs"
                            />
                        </div>

                        {/* Preview */}
                        {data.cover_image && (
                            <div className="rounded-md overflow-hidden border border-border/50 mt-1 aspect-video bg-muted/20">
                                <img
                                    src={data.cover_image}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                        ((e.target as HTMLImageElement).style.display = "none")
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium">Published</span>
                                <span className="text-xs text-muted-foreground">
                                    Visible to all members
                                </span>
                            </div>
                            <Switch
                                checked={data.published}
                                onCheckedChange={(checked) => onChange({ published: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium">Locked</span>
                                <span className="text-xs text-muted-foreground">
                                    Only admins can edit
                                </span>
                            </div>
                            <Switch
                                checked={data.locked}
                                onCheckedChange={(checked) => onChange({ locked: checked })}
                            />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
