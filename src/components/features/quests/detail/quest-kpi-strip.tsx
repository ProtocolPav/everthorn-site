import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/format";
import type { QuestStatisticsOut } from "@/api/nexuscore/model";

export interface QuestHealth {
    label: string;
    tone: "good" | "warn" | "bad" | "idle";
    reason: string;
}

export function getQuestHealth(stats: QuestStatisticsOut): QuestHealth {
    if (stats.total_accepts === 0) {
        return { label: "No data yet", tone: "idle", reason: "Nobody has accepted this quest." };
    }
    if (stats.started_rate < 0.4) {
        return {
            label: "Players aren't starting",
            tone: "bad",
            reason: `Only ${(stats.started_rate * 100).toFixed(0)}% begin after accepting. The first objective may be unclear.`,
        };
    }
    if (stats.completion_rate < 0.3 && stats.total_started > 0) {
        return {
            label: "Players are dropping off",
            tone: "warn",
            reason: `Only ${(stats.completion_rate * 100).toFixed(0)}% finish. The objective breakdown shows where they stop.`,
        };
    }
    return {
        label: "Running well",
        tone: "good",
        reason: `${(stats.completion_rate * 100).toFixed(0)}% of accepts are completed.`,
    };
}

const toneDot: Record<QuestHealth["tone"], string> = {
    good: "bg-emerald-500",
    warn: "bg-amber-500",
    bad: "bg-rose-500",
    idle: "bg-muted-foreground/40",
};

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
