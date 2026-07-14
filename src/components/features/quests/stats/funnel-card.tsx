import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { FunnelChart, Funnel, LabelList, Tooltip } from 'recharts'
import { QuestStatisticsOut } from '@/api/nexuscore/model'
import { FunnelIcon, ArrowDownIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface FunnelCardProps {
    stats: QuestStatisticsOut
}

const chartConfig = {
    accepts:   { label: 'Accepted',  color: 'var(--chart-1)' },
    started:   { label: 'Started',   color: 'var(--chart-2)' },
    completed: { label: 'Completed', color: 'var(--chart-3)' },
} satisfies ChartConfig

const NAME_TO_KEY: Record<string, keyof typeof chartConfig> = {
    Accepted:  'accepts',
    Started:   'started',
    Completed: 'completed',
}

function rateColor(pct: number) {
    if (pct >= 60) return 'text-emerald-500'
    if (pct >= 30) return 'text-amber-500'
    return 'text-red-500'
}

function rateBg(pct: number) {
    if (pct >= 60) return 'bg-emerald-500/10'
    if (pct >= 30) return 'bg-amber-500/10'
    return 'bg-red-500/10'
}

interface StageRowProps {
    color: string
    label: string
    count: number
    pctOfAccepts: number
    isFirst?: boolean
}

function StageRow({ color, label, count, pctOfAccepts, isFirst }: StageRowProps) {
    const barW = Math.max(4, pctOfAccepts)
    return (
        <div className="flex items-center gap-3">
            {/* Bar + label column */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
                        <span className="text-xs font-medium">{label}</span>
                    </div>
                    <span className="text-xs font-bold tabular-nums">{count.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${barW}%`, background: color, opacity: 0.85 }}
                    />
                </div>
            </div>
            {/* Pct badge */}
            {!isFirst && (
                <div className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums min-w-[48px] text-center',
                    rateBg(pctOfAccepts),
                    rateColor(pctOfAccepts),
                )}>
                    {pctOfAccepts.toFixed(1)}%
                </div>
            )}
            {isFirst && (
                <div className="shrink-0 min-w-[48px]" />
            )}
        </div>
    )
}

export function FunnelCard({ stats }: FunnelCardProps) {
    const accepts   = stats.total_accepts
    const started   = stats.total_started
    const completed = stats.total_completed
    const failed    = stats.total_failed

    const startedPct    = accepts > 0 ? (started   / accepts) * 100 : 0
    const completedPct  = accepts > 0 ? (completed / accepts) * 100 : 0
    const failedPct     = accepts > 0 ? (failed    / accepts) * 100 : 0

    // drop-off between stages
    const notStartedPct = accepts > 0 ? ((accepts - started) / accepts) * 100 : 0
    const dropAfterStart = started > 0 ? ((started - completed - failed) / started) * 100 : 0

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                    Player Funnel
                </CardTitle>
                <CardDescription>
                    {accepts.toLocaleString()} accepted — how far players progress
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-1.5">
                <StageRow
                    color="var(--chart-1)"
                    label="Accepted"
                    count={accepts}
                    pctOfAccepts={100}
                    isFirst
                />

                {/* Drop-off: never started */}
                {notStartedPct > 1 && (
                    <div className="flex items-center gap-2 py-0.5 pl-3">
                        <ArrowDownIcon className="h-3 w-3 text-muted-foreground/50" />
                        <span className="text-[10px] text-muted-foreground">
                            {notStartedPct.toFixed(1)}% never started
                        </span>
                    </div>
                )}

                <StageRow
                    color="var(--chart-2)"
                    label="Started"
                    count={started}
                    pctOfAccepts={startedPct}
                />

                {/* Drop-off: abandoned after starting */}
                {dropAfterStart > 1 && (
                    <div className="flex items-center gap-2 py-0.5 pl-3">
                        <ArrowDownIcon className="h-3 w-3 text-muted-foreground/50" />
                        <span className="text-[10px] text-muted-foreground">
                            {dropAfterStart.toFixed(1)}% abandoned after starting
                        </span>
                    </div>
                )}

                <StageRow
                    color="var(--chart-3)"
                    label="Completed"
                    count={completed}
                    pctOfAccepts={completedPct}
                />

                {failed > 0 && (
                    <>
                        <div className="flex items-center gap-2 py-0.5 pl-3">
                            <ArrowDownIcon className="h-3 w-3 text-muted-foreground/50" />
                            <span className="text-[10px] text-muted-foreground">
                                {failedPct.toFixed(1)}% of accepts failed
                            </span>
                        </div>
                        <StageRow
                            color="hsl(var(--destructive))"
                            label="Failed"
                            count={failed}
                            pctOfAccepts={failedPct}
                        />
                    </>
                )}

                {/* Summary footer */}
                <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">Start rate</span>
                        <span className={cn('text-[11px] font-semibold tabular-nums', rateColor(startedPct))}>
                            {startedPct.toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">Completion rate</span>
                        <span className={cn('text-[11px] font-semibold tabular-nums', rateColor(completedPct))}>
                            {completedPct.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
