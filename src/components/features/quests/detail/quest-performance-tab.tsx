import { FunnelCard } from "@/components/features/quests/stats/funnel-card";
import { DailyActivityChart } from "@/components/features/quests/stats/daily-activity-chart";
import { CompletionCDF } from "@/components/features/quests/stats/completion-cdf";
import { ObjectivesFunnelTable } from "@/components/features/quests/stats/objectives-funnel-table";
import type { QuestStatisticsOut } from "@/api/nexuscore/model";

/**
 * One flat page instead of nested tabs: the funnel and completion speed answer
 * "how far do players get, and how fast", daily activity adds "when", and the
 * objective table closes with "where exactly do they stop".
 */
export function QuestPerformanceTab({ stats }: { stats: QuestStatisticsOut }) {
    if (stats.total_accepts === 0) {
        return (
            <p className="py-10 text-sm font-light text-muted-foreground">
                Charts will appear once players start accepting this quest.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <FunnelCard stats={stats} />
                <CompletionCDF
                    buckets={stats.completion_time_histogram}
                    avg={stats.avg_completion_time_seconds}
                    median={stats.median_completion_time_seconds}
                    fastest={stats.fastest_completion_seconds}
                    slowest={stats.slowest_completion_seconds}
                />
            </div>
            <DailyActivityChart data={stats.daily_activity} />
            <ObjectivesFunnelTable objectives={stats.objectives} />
        </div>
    );
}
