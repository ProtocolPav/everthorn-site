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
import { SeamlessSelect } from "@/components/common/seamless-select.tsx";
import { getVisibleCategories } from "@/config/wiki-options.ts";
import {
    LinkIcon,
    UploadSimpleIcon,
    SpinnerIcon,
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

interface WikiPageSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: PageDataDraft;
    onChange: (updated: Partial<PageDataDraft>) => void;
    uploadFile: (file: File) => Promise<string>;
    /** Pass true when the current user is a CM or Owner. */
    isAdmin?: boolean;
}

export function WikiPageSettingsSheet({
    open,
    onOpenChange,
    data,
    onChange,
    uploadFile,
    isAdmin = false,
}: WikiPageSettingsDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Exclude "all" — it's a filter, not a real assignable category.
    const categoryOptions = getVisibleCategories(isAdmin, false);

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/*
              * Full-screen minus 12px (p-3) on every side.
              * Override the default centered/sized DialogContent styles completely.
              */}
            <DialogContent
                className="
                    w-full sm:w-2/3 h-5/6
                    max-w-none!
                    flex flex-col gap-0 p-0
                    rounded-xl
                    overflow-hidden
                "
            >
                <DialogHeader className="px-6 py-5 border-b border-border/50 shrink-0">
                    <DialogTitle className="text-base">Page settings</DialogTitle>
                    <DialogDescription className="text-xs">
                        Changes here are saved together with your content.
                    </DialogDescription>
                </DialogHeader>

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
                        <Label className="text-sm font-medium">Category</Label>
                        <SeamlessSelect
                            options={categoryOptions}
                            value={data.category}
                            onValueChange={(value) => onChange({ category: value })}
                            placeholder="Select a category…"
                            className="w-full h-9 px-3 text-sm rounded-md border border-input bg-background shadow-none"
                        />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Tags</Label>
                        <TagsInput
                            defaultTags={data.tags}
                            maxTags={8}
                            onChange={(tags) => onChange({ tags: tags.map((t) => t.label) })}
                        />
                        <p className="text-xs text-muted-foreground">
                            Press Enter to add a tag. Backspace removes the last one.
                        </p>
                    </div>

                    {/* Cover Image */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Cover image</Label>

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
            </DialogContent>
        </Dialog>
    );
}
