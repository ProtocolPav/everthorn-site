import { ArrowDownRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { QuestsOverviewOut } from "@/types/quests-overview.d.ts";

interface TrendProps {
    /** Signed change; positive is up. */
    delta: number;
    /** Already-formatted magnitude, e.g. "12%" or "4 pts". */
    label: string;
}

function Trend({ delta, label }: TrendProps) {
    if (delta === 0) return <span className="text-muted-foreground">No change</span>;
    const up = delta > 0;
    const Icon = up ? ArrowUpRightIcon : ArrowDownRightIcon;

    return (
        <span
            data-slot="overview-trend"
            className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
            )}
        >
            <Icon className="size-3" weight="bold" aria-hidden="true" />
            <span className="sr-only">{up ? "Up" : "Down"}</span>
            {label}
        </span>
    );
}

interface StatTileProps {
    label: string;
    value: string;
    sub: React.ReactNode;
    tone?: "default" | "warn";
}

function StatTile({ label, value, sub, tone = "default" }: StatTileProps) {
    return (
        <div data-slot="overview-stat" className="flex min-w-0 flex-col gap-1 bg-card px-4 py-3.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
            <span
                className={cn(
                    "text-2xl font-bold tabular-nums leading-none tracking-tight",
                    tone === "warn" && "text-amber-600 dark:text-amber-400",
                )}
            >
                {value}
            </span>
            <span className="truncate text-[11px] tabular-nums text-muted-foreground">{sub}</span>
        </div>
    );
}

// gap-px over a border-coloured background draws hairline dividers at every breakpoint.
const TILE_GRID = "grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4";

/** Headline numbers for the quests home: what's live, what's ending, and how players respond. */
export function OverviewStats({ overview }: { overview: QuestsOverviewOut }) {
    const { counts, engagement, window_days } = overview;

    const acceptsDelta =
        engagement.previous_accepts != null
            ? (engagement.accepts - engagement.previous_accepts) / engagement.previous_accepts
            : null;
    const rateDelta =
        engagement.previous_completion_rate != null
            ? (engagement.completion_rate - engagement.previous_completion_rate) * 100
            : null;

    return (
        <div data-slot="overview-stats" className={TILE_GRID}>
            <StatTile
                label="Active now"
                value={counts.active.toLocaleString()}
                sub={`${counts.scheduled.toLocaleString()} scheduled · ${counts.total.toLocaleString()} total`}
            />
            <StatTile
                label="Ending this week"
                value={counts.ending_within_7d.toLocaleString()}
                tone={counts.ending_within_7d > 0 ? "warn" : "default"}
                sub={counts.ending_within_7d > 0 ? "Extend or let them close" : "Nothing closing soon"}
            />
            <StatTile
                label={`Accepts · ${window_days}d`}
                value={engagement.accepts.toLocaleString()}
                sub={
                    acceptsDelta != null ? (
                        <>
                            <Trend delta={acceptsDelta} label={`${Math.abs(acceptsDelta * 100).toFixed(0)}%`} /> vs
                            previous {window_days}d
                        </>
                    ) : (
                        `${engagement.completed.toLocaleString()} completed`
                    )
                }
            />
            <StatTile
                label={`Completion · ${window_days}d`}
                value={engagement.accepts > 0 ? `${(engagement.completion_rate * 100).toFixed(0)}%` : "—"}
                sub={
                    rateDelta != null && engagement.accepts > 0 ? (
                        <>
                            <Trend delta={Math.round(rateDelta)} label={`${Math.abs(rateDelta).toFixed(0)} pts`} /> vs
                            previous {window_days}d
                        </>
                    ) : (
                        `${engagement.completed.toLocaleString()} of ${engagement.accepts.toLocaleString()} accepts`
                    )
                }
            />
        </div>
    );
}

export function OverviewStatsSkeleton() {
    return (
        <div className={TILE_GRID}>
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2 bg-card px-4 py-3.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-3 w-28" />
                </div>
            ))}
        </div>
    );
}
