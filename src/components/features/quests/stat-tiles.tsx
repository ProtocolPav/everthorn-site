import { ArrowDownRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatTrendProps {
    /** Signed change; positive is up. */
    delta: number;
    /** Already-formatted magnitude, e.g. "12%" or "4 pts". */
    label: string;
}

/** Green up / red down arrow with a magnitude, for "vs previous period" sub-lines. */
function StatTrend({ delta, label }: StatTrendProps) {
    if (delta === 0) return <span className="text-muted-foreground">No change</span>;
    const up = delta > 0;
    const Icon = up ? ArrowUpRightIcon : ArrowDownRightIcon;

    return (
        <span
            data-slot="stat-trend"
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
    sub?: React.ReactNode;
    tone?: "default" | "warn";
}

function StatTile({ label, value, sub, tone = "default" }: StatTileProps) {
    return (
        <div data-slot="stat-tile" className="flex min-w-0 flex-col gap-1 bg-card px-4 py-3.5">
            <span className="truncate text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {label}
            </span>
            <span
                className={cn(
                    "text-2xl font-bold tabular-nums leading-none tracking-tight",
                    tone === "warn" && "text-amber-600 dark:text-amber-400",
                )}
            >
                {value}
            </span>
            {sub && <span className="truncate text-[11px] tabular-nums text-muted-foreground">{sub}</span>}
        </div>
    );
}

const columnClass = {
    4: "grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-6",
} as const;

interface StatTilesProps extends React.ComponentProps<"div"> {
    columns?: keyof typeof columnClass;
}

/**
 * Bordered row of stat tiles. gap-px over a border-coloured background draws
 * hairline dividers that stay correct at every breakpoint.
 */
function StatTiles({ columns = 4, className, ...props }: StatTilesProps) {
    return (
        <div
            data-slot="stat-tiles"
            className={cn("grid gap-px overflow-hidden rounded-xl border bg-border", columnClass[columns], className)}
            {...props}
        />
    );
}

function StatTilesSkeleton({ columns = 4 }: { columns?: keyof typeof columnClass }) {
    return (
        <StatTiles columns={columns}>
            {Array.from({ length: columns }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2 bg-card px-4 py-3.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-3 w-28" />
                </div>
            ))}
        </StatTiles>
    );
}

export { StatTile, StatTiles, StatTilesSkeleton, StatTrend };
