import { formatDate, formatDistanceToNow } from "date-fns";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

/** Flags a daily an admin has customised (quest.last_edited_at is set). */
export function DailyEditedBadge({ editedAt }: { editedAt: string }) {
    const date = new Date(editedAt);

    return (
        <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
                <Badge variant="amber" className="relative z-10 text-[10px] px-1.5 py-0.5 font-semibold tracking-wide gap-1 cursor-default">
                    <PencilSimpleIcon weight="fill" />
                    Edited
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="top">
                Customised {formatDistanceToNow(date, { addSuffix: true })} ({formatDate(date, "MMM d, h:mmaaa")}).
                Re-rolling this day discards the edits.
            </TooltipContent>
        </Tooltip>
    );
}
