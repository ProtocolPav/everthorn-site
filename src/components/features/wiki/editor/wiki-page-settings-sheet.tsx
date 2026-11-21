import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog.tsx";
import { GearIcon } from "@phosphor-icons/react";
import { WikiPageForm, type WikiPageFormData } from "@/components/features/wiki/editor/wiki-page-form.tsx";

// ─── Backwards-compatible type alias ───────────────────────────────
// New code should import WikiPageFormData; existing consumers import this.
export type PageDataDraft = Omit<WikiPageFormData, "slug">;
export type { WikiPageFormData };

interface WikiPageSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: PageDataDraft;
    onChange: (updated: Partial<PageDataDraft>) => void;
    uploadFile: (file: File) => Promise<string>;
    /** Pass true when the current user is a CM or Owner. */
    isAdmin?: boolean;
}

/**
 * Thin dialog wrapper around the shared WikiPageForm.
 *
 * The form itself lives in `wiki-page-form.tsx` and is reused by both
 * the Create page (`wiki.new.tsx`, mode="create") and this edit dialog
 * (mode="edit"). This file only provides the Dialog chrome.
 */
export function WikiPageSettingsDialog({
    open,
    onOpenChange,
    data,
    onChange,
    uploadFile,
}: WikiPageSettingsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
                    w-full sm:max-w-[860px]
                    max-h-[92vh]
                    p-0 gap-0
                    overflow-hidden rounded-2xl
                    bg-card
                    flex flex-col
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
                    <div className="px-6 md:px-8 py-6 pb-8">
                        <WikiPageForm
                            mode="edit"
                            variant="dialog"
                            data={data as WikiPageFormData}
                            onChange={(patch) => onChange(patch as Partial<PageDataDraft>)}
                            uploadFile={uploadFile}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
