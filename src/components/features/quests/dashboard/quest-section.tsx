import { cn } from "@/lib/utils";
import { QuestCard } from "@/components/features/quests/quest-card";
import type { QuestLifecycle } from "@/lib/quest-lifecycle";
import type { QuestOut } from "@/api/nexuscore/model";

/** One-column on phones, fluid cards on larger screens. */
export const QUEST_GRID = "grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]";

const lifecycleTone: Record<QuestLifecycle, string> = {
    active: "bg-emerald-500",
    scheduled: "bg-amber-500",
    expired: "bg-muted-foreground/40",
};

interface QuestSectionProps {
    lifecycle: QuestLifecycle;
    title: string;
    /** Total in the section, which can exceed the rendered cards when paginated. */
    count: number;
    quests: QuestOut[];
    /** Hidden when the toolbar is already filtered to a single lifecycle. */
    showHeader?: boolean;
    empty?: React.ReactNode;
    footer?: React.ReactNode;
}

/** A lifecycle section of the unified browse view. */
export function QuestSection({
    lifecycle,
    title,
    count,
    quests,
    showHeader = true,
    empty,
    footer,
}: QuestSectionProps) {
    return (
        <section className="flex flex-col gap-2">
            {showHeader && (
                <div className="flex min-h-8 items-center gap-2">
                    <span className={cn("size-1.5 rounded-full", lifecycleTone[lifecycle])} aria-hidden="true" />
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {title}
                    </h2>
                    <span className="text-[11px] tabular-nums text-muted-foreground/70">{count}</span>
                </div>
            )}

            {quests.length === 0 ? (
                empty ?? null
            ) : (
                <div className={QUEST_GRID}>
                    {quests.map((quest) => (
                        <QuestCard key={quest.quest_id} quest={quest} />
                    ))}
                </div>
            )}

            {footer}
        </section>
    );
}
