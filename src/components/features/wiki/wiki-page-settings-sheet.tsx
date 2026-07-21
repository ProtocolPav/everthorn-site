import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "@phosphor-icons/react";

export interface PageDataDraft {
    title: string;
    cover_image: string | null;
    locked: boolean;
    published: boolean;
}

interface WikiPageSettingsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: PageDataDraft;
    onChange: (updated: Partial<PageDataDraft>) => void;
}

export function WikiPageSettingsSheet({
    open,
    onOpenChange,
    data,
    onChange,
}: WikiPageSettingsSheetProps) {
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

                    {/* Cover Image */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cover-image" className="text-sm font-medium">
                            Cover image
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <LinkIcon
                                    weight="regular"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
                                />
                                <Input
                                    id="cover-image"
                                    value={data.cover_image ?? ""}
                                    onChange={(e) =>
                                        onChange({ cover_image: e.target.value || null })
                                    }
                                    placeholder="https://…"
                                    className="h-9 pl-8 font-mono text-xs"
                                />
                            </div>
                            {data.cover_image && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-3 text-xs text-destructive hover:text-destructive"
                                    onClick={() => onChange({ cover_image: null })}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                        {data.cover_image && (
                            <div className="rounded-md overflow-hidden border border-border/50 mt-1 aspect-video">
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
                    <div className="flex flex-col gap-4">
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
