import { formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import { formatCountdown, getQuestLifecycle, getQuestProgress } from "@/lib/quest-lifecycle.ts";
import type { QuestOut } from "@/api/nexuscore/model";

interface QuestTimelineProps {
    quest: Pick<QuestOut, "start_time" | "end_time">;
    className?: string;
    compact?: boolean;
}

const lifecycleDot: Record<string, string> = {
    active: "bg-emerald-500",
    scheduled: "bg-amber-500",
    expired: "bg-rose-500",
};

/**
 * Signature lifecycle visual: a hairline track from start to end with a
 * "now" marker. Position is real data (elapsed share), not decoration.
 */
export function QuestTimeline({ quest, className, compact = false }: QuestTimelineProps) {
    const lifecycle = getQuestLifecycle(quest);
    const elapsed = getQuestProgress(quest);

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <div className="relative h-px bg-border" role="img" aria-label={`${lifecycle}, ${formatCountdown(quest)}`}>
                <span className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/40" style={{ left: "0%" }} />
                <span className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/40" style={{ left: "100%" }} />
                {lifecycle !== "expired" && (
                    <span
                        className={cn("absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-background", lifecycleDot[lifecycle])}
                        style={{ left: `${elapsed * 100}%` }}
                    />
                )}
            </div>
            {!compact && (
                <div className="flex items-baseline justify-between text-[11px]">
                    <span className="text-muted-foreground">
                        {formatDate(new Date(quest.start_time), "MMM d, yyyy")}
                    </span>
                    <span className="font-semibold tabular-nums text-foreground">
                        {formatCountdown(quest)}
                    </span>
                    <span className="text-muted-foreground">
                        {formatDate(new Date(quest.end_time), "MMM d, yyyy")}
                    </span>
                </div>
            )}
        </div>
    );
}
