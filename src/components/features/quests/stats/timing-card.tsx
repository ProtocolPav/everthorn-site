import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { QuestStatisticsOut } from '@/api/nexuscore/model'
import { formatDuration } from '@/lib/format'
import { ClockIcon, TimerIcon, RocketLaunchIcon, HourglassLowIcon } from '@phosphor-icons/react'

interface TimingCardProps {
    stats: QuestStatisticsOut
}

export const AVG_COLOR    = 'hsl(217 91% 60%)'
export const MEDIAN_COLOR = 'hsl(258 90% 66%)'

function TimingChip({
    label,
    icon: Icon,
    value,
    iconColor,
    valueColor,
}: {
    label: string
    icon: React.ElementType
    value: number | null | undefined
    iconColor: string
    valueColor?: string
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border bg-muted/20 px-4 py-4">
            <div className="rounded-lg bg-muted/40 p-2.5">
                <Icon className="h-5 w-5 shrink-0" style={{ color: iconColor }} weight="duotone" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground leading-none mb-1">{label}</p>
                <p
                    className="text-xl font-bold tabular-nums tracking-tight leading-none"
                    style={valueColor ? { color: valueColor } : undefined}
                >
                    {value != null
                        ? formatDuration(value)
                        : <span className="text-muted-foreground font-normal text-base">—</span>}
                </p>
            </div>
        </div>
    )
}

export function TimingCard({ stats }: TimingCardProps) {
    const hasAny =
        stats.avg_completion_time_seconds != null ||
        stats.median_completion_time_seconds != null ||
        stats.fastest_completion_seconds != null ||
        stats.slowest_completion_seconds != null

    const fastest = stats.fastest_completion_seconds
    const slowest = stats.slowest_completion_seconds
    const hasRange = fastest != null && slowest != null && slowest > fastest

    const avgPct = hasRange && stats.avg_completion_time_seconds != null
        ? ((stats.avg_completion_time_seconds - fastest!) / (slowest! - fastest!)) * 100
        : null
    const medianPct = hasRange && stats.median_completion_time_seconds != null
        ? ((stats.median_completion_time_seconds - fastest!) / (slowest! - fastest!)) * 100
        : null

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <TimerIcon className="h-4 w-4 text-muted-foreground" />
                    Completion Timing
                </CardTitle>
                <CardDescription>
                    {hasAny
                        ? `Based on ${stats.total_completed.toLocaleString()} completed run${stats.total_completed !== 1 ? 's' : ''}`
                        : 'No completions recorded yet'}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <TimingChip label="Average"  icon={ClockIcon}        value={stats.avg_completion_time_seconds}    iconColor={AVG_COLOR}           valueColor={AVG_COLOR} />
                    <TimingChip label="Median"   icon={ClockIcon}        value={stats.median_completion_time_seconds} iconColor={MEDIAN_COLOR}        valueColor={MEDIAN_COLOR} />
                    <TimingChip label="Fastest"  icon={RocketLaunchIcon} value={stats.fastest_completion_seconds}     iconColor="hsl(142 71% 45%)" />
                    <TimingChip label="Slowest"  icon={HourglassLowIcon} value={stats.slowest_completion_seconds}     iconColor="hsl(38 92% 50%)" />
                </div>

                {hasRange && (
                    <div className="space-y-2 pt-1">
                        {/* Range bar */}
                        <div className="relative h-3 w-full rounded-full overflow-hidden bg-muted/60">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/40 via-muted/10 to-amber-500/40" />
                            {avgPct != null && (
                                <div
                                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-1 rounded-full shadow-sm"
                                    style={{ left: `${avgPct}%`, background: AVG_COLOR }}
                                />
                            )}
                            {medianPct != null && (
                                <div
                                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-1 rounded-full shadow-sm"
                                    style={{ left: `${medianPct}%`, background: MEDIAN_COLOR }}
                                />
                            )}
                        </div>
                        {/* Range labels */}
                        <div className="flex justify-between text-[11px] text-muted-foreground px-0.5">
                            <span className="font-medium text-emerald-500">{formatDuration(fastest!)}</span>
                            <span className="text-muted-foreground/60">fastest — slowest</span>
                            <span className="font-medium text-amber-500">{formatDuration(slowest!)}</span>
                        </div>
                        {/* Legend */}
                        <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground pt-1">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block h-2.5 w-1 rounded-full" style={{ background: AVG_COLOR }} />
                                Average
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block h-2.5 w-1 rounded-full" style={{ background: MEDIAN_COLOR }} />
                                Median
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
