import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/format";
import { getQuestHealth, toneDot } from "@/lib/quest-health";
import type { QuestStatisticsOut } from "@/api/nexuscore/model";

function rate(part: number, total: number): number {
    return total > 0 ? part / total : 0;
}

function LedgerFigure({ value, label, sub }: { value: string; label: string; sub: string }) {
    return (
        <div className="flex min-w-0 flex-col gap-0.5 px-5 first:pl-0 last:pr-0">
            <span className="text-xl font-bold tabular-nums leading-none tracking-tight">{value}</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
            <span className="truncate text-[11px] tabular-nums text-muted-foreground/70">{sub}</span>
        </div>
    );
}

/**
 * The quest's headline numbers, always visible above the tabs.
 * With no accepts there is nothing to measure, so it collapses to one line
 * instead of a row of zeros.
 */
export function QuestKpiStrip({ stats }: { stats: QuestStatisticsOut }) {
    const health = getQuestHealth(stats);
    const hasData = stats.total_accepts > 0;

    return (
        <div className="flex flex-col gap-3 border-y py-4">
            {hasData && (
                <div className="flex flex-wrap items-stretch gap-y-4 divide-x divide-border">
                    <LedgerFigure
                        value={stats.unique_players.toLocaleString()}
                        label="Players"
                        sub={`${stats.repeat_attempt_players.toLocaleString()} tried again`}
                    />
                    <LedgerFigure
                        value={`${(stats.started_rate * 100).toFixed(1)}%`}
                        label="Started"
                        sub={`${stats.total_started.toLocaleString()} of ${stats.total_accepts.toLocaleString()} accepts`}
                    />
                    <LedgerFigure
                        value={`${(stats.completion_rate * 100).toFixed(1)}%`}
                        label="Completed"
                        sub={`${stats.total_completed.toLocaleString()} of ${stats.total_accepts.toLocaleString()} accepts`}
                    />
                    <LedgerFigure
                        value={`${(rate(stats.total_failed, stats.total_accepts) * 100).toFixed(1)}%`}
                        label="Failed"
                        sub={`${stats.total_failed.toLocaleString()} of ${stats.total_accepts.toLocaleString()} accepts`}
                    />
                    <LedgerFigure
                        value={`${(rate(stats.total_abandoned, stats.total_accepts) * 100).toFixed(1)}%`}
                        label="Abandoned"
                        sub={`${stats.total_abandoned.toLocaleString()} dropped or expired`}
                    />
                    <LedgerFigure
                        value={stats.median_completion_time_seconds != null ? formatDuration(stats.median_completion_time_seconds) : "—"}
                        label="Median time"
                        sub={stats.avg_completion_time_seconds != null ? `avg ${formatDuration(stats.avg_completion_time_seconds)}` : "no completions yet"}
                    />
                </div>
            )}
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`size-1.5 shrink-0 rounded-full ${toneDot[health.tone]}`} aria-hidden="true" />
                <span className="font-semibold text-foreground">{health.label}.</span>
                <span className="font-light">{health.reason}</span>
            </p>
        </div>
    );
}

export function QuestKpiSkeleton() {
    return (
        <div className="border-y py-4">
            <Skeleton className="h-[68px] w-full" />
        </div>
    );
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
