import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TrashIcon } from "@phosphor-icons/react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    invalidateListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet,
    invalidateListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet,
    useDeleteDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdDelete,
} from "@/api/nexuscore/daily-quests/daily-quests.ts";
import { getSubmitErrorMessage } from "@/lib/quest-orval-errors.ts";
import type { DailyTemplateOut } from "@/api/nexuscore/model";

interface DeleteTemplateDialogProps {
    template: Pick<DailyTemplateOut, "template_id" | "name" | "enabled">;
    /** Called after a successful delete, e.g. to leave the editor. */
    onDeleted?: () => void;
    /** Custom trigger; defaults to a small trash icon button. */
    trigger?: ReactNode;
}

/**
 * Confirms deleting a template. Days already generated from it are kept;
 * Nexuscore sets their template_id to null.
 */
export function DeleteTemplateDialog({ template, onDeleted, trigger }: DeleteTemplateDialogProps) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const remove = useDeleteDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdDelete();

    async function confirm() {
        try {
            await remove.mutateAsync({ templateId: template.template_id });
            await Promise.all([
                invalidateListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet(queryClient),
                invalidateListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet(queryClient),
            ]);
            setOpen(false);
            toast.success(`Deleted ${template.name}`);
            onDeleted?.();
        } catch (error) {
            toast.error(`Couldn't delete ${template.name}`, { description: getSubmitErrorMessage(error) });
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {trigger ?? (
                    <Button
                        variant="ghost"
                        size="xs"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Delete ${template.name}`}
                    >
                        <TrashIcon weight="bold" />
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete “{template.name}”?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Days already generated from it are kept. This can't be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button variant="destructive" disabled={remove.isPending} onClick={confirm}>
                        <TrashIcon />
                        Delete template
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
