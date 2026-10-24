import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { QuestTypeBadge } from "@/components/features/quests/quest-type-badge";
import { QuestActionsMenu } from "@/components/features/quests/quest-actions-menu";
import { QuestTimeline } from "@/components/features/quests/dashboard/quest-timeline";
import { QuestKpiSkeleton, QuestKpiStrip } from "./quest-kpi-strip";
import { getQuestLifecycle } from "@/lib/quest-lifecycle";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import type { QuestOut, QuestStatisticsOut } from "@/api/nexuscore/model";

interface QuestHeaderProps {
    quest: QuestOut;
    stats: QuestStatisticsOut | undefined;
    statsLoading: boolean;
}

const lifecycleDot = {
    active: "bg-emerald-500",
    scheduled: "bg-amber-500",
    expired: "bg-rose-500",
} as const;

/**
 * Persistent above the tabs: who this quest is, when it runs, how it's doing,
 * and the only management controls (Edit + the actions menu) on the page.
 */
export function QuestHeader({ quest, stats, statsLoading }: QuestHeaderProps) {
    const lifecycle = getQuestLifecycle(quest);

    return (
        <header className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="flex min-w-0 max-w-3xl flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className={`size-1.5 rounded-full ${lifecycleDot[lifecycle]}`} aria-hidden="true" />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {lifecycle}
                        </p>
                        <QuestTypeBadge type={quest.quest_type} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-balance">{quest.title}</h1>
                    <p className="max-w-[65ch] text-sm font-light leading-relaxed text-muted-foreground">
                        {quest.description || "No description"}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                    <Button size="sm" asChild>
                        <Link to="/admin/quests/editor/$id" params={{ id: `${quest.quest_id}` }}>
                            <PencilSimpleIcon />
                            Edit
                        </Link>
                    </Button>
                    <QuestActionsMenu quest={quest} />
                </div>
            </div>

            <QuestTimeline quest={quest} className="max-w-2xl" />

            {statsLoading ? <QuestKpiSkeleton /> : stats ? <QuestKpiStrip stats={stats} /> : null}
        </header>
    );
}
