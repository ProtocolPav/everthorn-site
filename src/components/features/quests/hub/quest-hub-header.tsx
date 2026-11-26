import { Link } from "@tanstack/react-router";
import { ChartBarIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { QuestTypeBadge } from "@/components/features/quests/quest-type-badge";
import { QuestActionsMenu } from "@/components/features/quests/quest-actions-menu";
import { QuestTimeline } from "@/components/features/quests/dashboard/quest-timeline";
import { QuestKpiSkeleton, QuestKpiStrip } from "@/components/features/quests/detail/quest-kpi-strip";
import { getQuestLifecycle } from "@/lib/quest-lifecycle";
import type { QuestOut, QuestStatisticsOut } from "@/api/nexuscore/model";

interface QuestHubHeaderProps {
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
 * The hub's masthead: identity, the two primary doors (Edit + Performance),
 * the lifecycle timeline, and the headline numbers.
 */
export function QuestHubHeader({ quest, stats, statsLoading }: QuestHubHeaderProps) {
    const lifecycle = getQuestLifecycle(quest);
    const id = `${quest.quest_id}`;

    return (
        <header className="flex flex-col gap-5 border-b px-6 py-6">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                <div className="flex min-w-0 max-w-3xl flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className={`size-1.5 rounded-full ${lifecycleDot[lifecycle]}`} aria-hidden="true" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {lifecycle}
                        </span>
                        <QuestTypeBadge type={quest.quest_type} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">{quest.title}</h1>
                    <p className="max-w-[65ch] text-sm font-light leading-relaxed text-muted-foreground">
                        {quest.description || "No description"}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                    <Button size="sm" asChild>
                        <Link to="/admin/quests/editor/$id" params={{ id }}>
                            <PencilSimpleIcon />
                            Edit quest
                        </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                        <Link to="/admin/quests/$id/performance" params={{ id }}>
                            <ChartBarIcon />
                            Performance
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
