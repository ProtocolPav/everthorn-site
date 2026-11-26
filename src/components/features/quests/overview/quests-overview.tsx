import { OverviewStats, OverviewStatsSkeleton } from "./overview-stats.tsx";
import { OverviewActivityChart, OverviewActivityChartSkeleton } from "./overview-activity-chart.tsx";
import { OverviewInsights, OverviewInsightsSkeleton } from "./overview-insights.tsx";
import type { QuestsOverviewOut } from "@/types/quests-overview.d.ts";

const PANEL_GRID = "grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]";

interface QuestsOverviewProps {
    overview: QuestsOverviewOut | undefined;
    isLoading: boolean;
}

/** Stats, activity and insights band at the top of the quests home. */
export function QuestsOverview({ overview, isLoading }: QuestsOverviewProps) {
    if (isLoading || !overview) return <QuestsOverviewSkeleton />;

    return (
        <section data-slot="quests-overview" aria-label="Quests overview" className="flex flex-col gap-4">
            <OverviewStats overview={overview} />
            <div className={PANEL_GRID}>
                <OverviewActivityChart
                    days={overview.daily}
                    windowDays={overview.window_days}
                    trackedQuests={overview.tracked_quests}
                />
                <OverviewInsights
                    attention={overview.needs_attention}
                    topQuests={overview.top_quests}
                    windowDays={overview.window_days}
                />
            </div>
        </section>
    );
}

export function QuestsOverviewSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <OverviewStatsSkeleton />
            <div className={PANEL_GRID}>
                <OverviewActivityChartSkeleton />
                <OverviewInsightsSkeleton />
            </div>
        </div>
    );
}
