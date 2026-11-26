import { StatTile, StatTiles, StatTilesSkeleton, StatTrend } from "@/components/features/quests/stat-tiles.tsx";
import type { QuestsOverviewOut } from "@/types/quests-overview.d.ts";

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
        <StatTiles data-slot="overview-stats">
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
                            <StatTrend delta={acceptsDelta} label={`${Math.abs(acceptsDelta * 100).toFixed(0)}%`} /> vs
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
                            <StatTrend delta={Math.round(rateDelta)} label={`${Math.abs(rateDelta).toFixed(0)} pts`} /> vs
                            previous {window_days}d
                        </>
                    ) : (
                        `${engagement.completed.toLocaleString()} of ${engagement.accepts.toLocaleString()} accepts`
                    )
                }
            />
        </StatTiles>
    );
}

export function OverviewStatsSkeleton() {
    return <StatTilesSkeleton />;
}
