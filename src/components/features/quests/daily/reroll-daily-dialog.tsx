import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowsClockwiseIcon, UsersIcon, WarningIcon } from "@phosphor-icons/react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
    invalidateGetDailyQuestV1GuildsMeQuestsDailyGet,
    invalidateListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet,
    useGenerateDailyQuestV1GuildsMeQuestsDailyGeneratePost,
} from "@/api/nexuscore/daily-quests/daily-quests.ts";
import {
    invalidateListQuestsV1GuildsMeQuestsGet,
    useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet,
} from "@/api/nexuscore/quests/quests.ts";
import { formatQuestDate, isDailyEdited } from "@/lib/daily-quests.ts";
import { getQuestLifecycle } from "@/lib/quest-lifecycle.ts";
import { getSubmitErrorMessage } from "@/lib/quest-orval-errors.ts";
import type { DailyQuestOut, QuestStatisticsOut } from "@/api/nexuscore/model";

interface RerollDailyDialogProps {
    daily: DailyQuestOut;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/** Players with an unfinished attempt: accepted but not started, or started and not finished. */
function countInProgress(stats: QuestStatisticsOut): number {
    const finishedAfterStart = stats.total_completed + stats.total_failed + stats.total_abandoned;
    return stats.total_pending + Math.max(0, stats.total_started - finishedAfterStart);
}

/**
 * Confirms re-rolling a day (POST /daily/generate?force=true). Re-rolling
 * replaces the quest, discards admin edits and abandons players' unfinished
 * progress, so edited days need an explicit tick before the button unlocks.
 */
export function RerollDailyDialog({ daily, open, onOpenChange }: RerollDailyDialogProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [discardEdits, setDiscardEdits] = useState(false);
    const edited = isDailyEdited(daily);
    const live = getQuestLifecycle(daily.quest) === "active";
    const dateLabel = formatQuestDate(daily.quest_date);

    const statsQuery = useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet(daily.quest.quest_id, {
        query: { enabled: open && live },
    });
    const inProgress = statsQuery.data ? countInProgress(statsQuery.data) : null;

    const generate = useGenerateDailyQuestV1GuildsMeQuestsDailyGeneratePost();

    function handleOpenChange(next: boolean) {
        if (!next) setDiscardEdits(false);
        onOpenChange(next);
    }

    async function reroll() {
        try {
            const quest = await generate.mutateAsync({ params: { quest_date: daily.quest_date, force: true } });
            await Promise.all([
                invalidateListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet(queryClient),
                invalidateGetDailyQuestV1GuildsMeQuestsDailyGet(queryClient),
                invalidateListQuestsV1GuildsMeQuestsGet(queryClient),
            ]);
            handleOpenChange(false);
            toast.success(`${dateLabel} re-rolled: ${quest.title}`, {
                action: {
                    label: "View",
                    onClick: () => void navigate({ to: "/admin/quests/$id", params: { id: `${quest.quest_id}` } }),
                },
            });
        } catch (error) {
            toast.error(`Couldn't re-roll ${dateLabel}`, { description: getSubmitErrorMessage(error) });
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Re-roll {dateLabel}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Replaces “{daily.quest.title}” with a new roll.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {edited && (
                    <Alert variant="destructive" className="bg-destructive/5">
                        <WarningIcon weight="fill" />
                        <AlertTitle>Your edits will be lost</AlertTitle>
                        <AlertDescription>This day was customised. This can't be undone.</AlertDescription>
                    </Alert>
                )}

                {live && (
                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                        <UsersIcon className="mt-0.5 size-4 shrink-0" />
                        <span>
                            {inProgress === null
                                ? "Players on this day"
                                : `${inProgress.toLocaleString()} player${inProgress === 1 ? "" : "s"} on this day`}{" "}
                            will have their progress abandoned.
                        </span>
                    </p>
                )}

                {edited && (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="reroll-discard-edits"
                            checked={discardEdits}
                            onCheckedChange={(checked) => setDiscardEdits(checked === true)}
                        />
                        <Label htmlFor="reroll-discard-edits">Discard my edits</Label>
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel>{edited ? "Keep edits" : "Cancel"}</AlertDialogCancel>
                    <Button
                        variant={edited ? "destructive" : "default"}
                        disabled={generate.isPending || (edited && !discardEdits)}
                        onClick={reroll}
                    >
                        <ArrowsClockwiseIcon className={generate.isPending ? "animate-spin" : undefined} />
                        {edited ? "Discard & re-roll" : "Re-roll"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
