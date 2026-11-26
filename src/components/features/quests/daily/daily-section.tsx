import type { ReactNode } from "react";
import { QUEST_GRID } from "@/components/features/quests/dashboard/quest-section.tsx";
import { cn } from "@/lib/utils.ts";

interface DailySectionProps {
    title: string;
    count: number;
    /** Dot colour class, e.g. "bg-emerald-500". */
    tone: string;
    /** Shown instead of the grid when there is nothing to list. */
    empty?: ReactNode;
    children?: ReactNode;
}

/** A titled card grid, same header as the quest hub's QuestSection. */
export function DailySection({ title, count, tone, empty, children }: DailySectionProps) {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex min-h-8 items-center gap-2">
                <span className={cn("size-1.5 rounded-full", tone)} aria-hidden="true" />
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</h2>
                <span className="text-[11px] tabular-nums text-muted-foreground/70">{count}</span>
            </div>
            {count === 0 ? (empty ?? null) : <div className={QUEST_GRID}>{children}</div>}
        </section>
    );
}
