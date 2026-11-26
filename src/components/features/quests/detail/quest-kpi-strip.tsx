import { StatTile, StatTiles, StatTilesSkeleton } from "@/components/features/quests/stat-tiles";
import { formatDuration } from "@/lib/format";
import { getQuestHealth, toneDot, type QuestHealth } from "@/lib/quest-health";
import { cn } from "@/lib/utils";
import type { QuestStatisticsOut } from "@/api/nexuscore/model";

function rate(part: number, total: number): number {
    return total > 0 ? part / total : 0;
}

const healthSurface: Record<QuestHealth["tone"], string> = {
    good: "border-emerald-500/20 bg-emerald-500/5",
    warn: "border-amber-500/25 bg-amber-500/5",
    bad: "border-rose-500/25 bg-rose-500/5",
    idle: "bg-muted/30",
};

/** One-line verdict on how the quest is doing, tinted by its health tone. */
export function QuestHealthCallout({ stats }: { stats: QuestStatisticsOut }) {
    const health = getQuestHealth(stats);

    return (
        <p
            data-slot="quest-health"
            className={cn(
                "flex items-start gap-2 rounded-lg border px-3 py-2 text-xs text-muted-foreground",
                healthSurface[health.tone],
            )}
        >
            <span className={cn("mt-1 size-1.5 shrink-0 rounded-full", toneDot[health.tone])} aria-hidden="true" />
            <span>
                <span className="font-semibold text-foreground">{health.label}.</span>{" "}
                <span className="font-light">{health.reason}</span>
            </span>
        </p>
    );
}

/**
 * The quest's headline numbers. With no accepts there is nothing to measure,
 * so only the health callout shows instead of a row of zeros.
 */
export function QuestKpiStrip({ stats }: { stats: QuestStatisticsOut }) {
    const hasData = stats.total_accepts > 0;
    const accepts = stats.total_accepts.toLocaleString();

    return (
        <div data-slot="quest-kpis" className="flex flex-col gap-3">
            {hasData && (
                <StatTiles columns={6}>
                    <StatTile
                        label="Players"
                        value={stats.unique_players.toLocaleString()}
                        sub={`${stats.repeat_attempt_players.toLocaleString()} tried again`}
                    />
                    <StatTile
                        label="Started"
                        value={`${(stats.started_rate * 100).toFixed(1)}%`}
                        sub={`${stats.total_started.toLocaleString()} of ${accepts} accepts`}
                    />
                    <StatTile
                        label="Completed"
                        value={`${(stats.completion_rate * 100).toFixed(1)}%`}
                        sub={`${stats.total_completed.toLocaleString()} of ${accepts} accepts`}
                    />
                    <StatTile
                        label="Failed"
                        value={`${(rate(stats.total_failed, stats.total_accepts) * 100).toFixed(1)}%`}
                        sub={`${stats.total_failed.toLocaleString()} of ${accepts} accepts`}
                    />
                    <StatTile
                        label="Abandoned"
                        value={`${(rate(stats.total_abandoned, stats.total_accepts) * 100).toFixed(1)}%`}
                        sub={`${stats.total_abandoned.toLocaleString()} dropped or expired`}
                    />
                    <StatTile
                        label="Median time"
                        value={stats.median_completion_time_seconds != null ? formatDuration(stats.median_completion_time_seconds) : "—"}
                        sub={stats.avg_completion_time_seconds != null ? `avg ${formatDuration(stats.avg_completion_time_seconds)}` : "no completions yet"}
                    />
                </StatTiles>
            )}
            <QuestHealthCallout stats={stats} />
        </div>
    );
}

export function QuestKpiSkeleton() {
    return <StatTilesSkeleton columns={6} />;
}

export function QuestHealthDot({ stats }: { stats: QuestStatisticsOut }) {
    const health = getQuestHealth(stats);
    if (health.tone === "idle") return null;
    return (
        <span
            className={`size-1.5 rounded-full ${toneDot[health.tone]}`}
            title={`${health.label}. ${health.reason}`}
            role="img"
            aria-label={health.label}
        />
    );
}
