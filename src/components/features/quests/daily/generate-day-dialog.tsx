import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarPlusIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
    invalidateListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet,
    useGenerateDailyQuestV1GuildsMeQuestsDailyGeneratePost,
    useListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet,
} from "@/api/nexuscore/daily-quests/daily-quests.ts";
import { invalidateListQuestsV1GuildsMeQuestsGet } from "@/api/nexuscore/quests/quests.ts";
import { formatQuestDate, toUtcDateString } from "@/lib/daily-quests.ts";
import { getSubmitErrorMessage } from "@/lib/quest-orval-errors.ts";

/** A calendar day (local midnight, as the picker uses) as a daily's "YYYY-MM-DD". */
function toQuestDate(day: Date): string {
    return format(day, "yyyy-MM-dd");
}

function fromQuestDate(questDate: string): Date {
    const [year, month, day] = questDate.split("-").map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Generates the daily for a chosen future date (POST /daily/generate?quest_date=),
 * e.g. beyond the 7-day backlog. Past and already generated days are disabled;
 * those are re-rolled from their card instead.
 */
export function GenerateDayDialog() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Date | undefined>();
    const { data: upcoming } = useListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet();
    const generate = useGenerateDailyQuestV1GuildsMeQuestsDailyGeneratePost();

    const today = toUtcDateString(new Date());
    const generated = useMemo(() => new Set((upcoming ?? []).map((daily) => daily.quest_date)), [upcoming]);
    const generatedDays = useMemo(() => [...generated].map(fromQuestDate), [generated]);
    const questDate = selected ? toQuestDate(selected) : null;

    function handleOpenChange(next: boolean) {
        setOpen(next);
        if (!next) setSelected(undefined);
    }

    async function submit() {
        if (!questDate) return;
        try {
            const quest = await generate.mutateAsync({ params: { quest_date: questDate } });
            await Promise.all([
                invalidateListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet(queryClient),
                invalidateListQuestsV1GuildsMeQuestsGet(queryClient),
            ]);
            handleOpenChange(false);
            toast.success(`Generated ${formatQuestDate(questDate)}: ${quest.title}`, {
                action: {
                    label: "View",
                    onClick: () => void navigate({ to: "/admin/quests/$id", params: { id: `${quest.quest_id}` } }),
                },
            });
        } catch (error) {
            toast.error(`Couldn't generate ${formatQuestDate(questDate)}`, { description: getSubmitErrorMessage(error) });
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <CalendarPlusIcon />
                    Generate day
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Generate a day</DialogTitle>
                    <DialogDescription>
                        Roll a daily for any future date, including beyond the 7-day backlog. Days that already have one
                        can be re-rolled from their card.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-2">
                    <Calendar
                        mode="single"
                        selected={selected}
                        onSelect={setSelected}
                        disabled={(day) => {
                            const date = toQuestDate(day);
                            return date < today || generated.has(date);
                        }}
                        modifiers={{ generated: generatedDays }}
                        modifiersClassNames={{
                            generated:
                                "relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-amber-500",
                        }}
                        className="rounded-lg border"
                    />
                    <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <span className="size-1 rounded-full bg-amber-500" aria-hidden="true" />
                            Already generated
                        </span>
                        <span>Past days disabled</span>
                    </div>
                </div>

                {questDate && (
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{formatQuestDate(questDate)}</span> starts at
                        00:00 UTC and runs for 30 hours. It's rolled from the current templates, and you can edit it
                        afterwards.
                    </p>
                )}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button disabled={!questDate || generate.isPending} onClick={submit}>
                        {generate.isPending && <SpinnerGapIcon className="animate-spin" />}
                        {questDate ? `Generate ${formatQuestDate(questDate)}` : "Pick a day"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
