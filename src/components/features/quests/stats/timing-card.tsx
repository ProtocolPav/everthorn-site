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
        <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2">
            <Icon className="h-4 w-4 shrink-0" style={{ color: iconColor }} weight="duotone" />
            <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
                <p
                    className="text-sm font-bold tabular-nums tracking-tight leading-none"
                    style={valueColor ? { color: valueColor } : undefined}
                >
                    {value != null
                        ? formatDuration(value)
                        : <span className="text-muted-foreground font-normal">—</span>}
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
            <CardHeader className="pb-3">
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
            <CardContent className="pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <TimingChip label="Average"  icon={ClockIcon}        value={stats.avg_completion_time_seconds}    iconColor={AVG_COLOR}           valueColor={AVG_COLOR} />
                    <TimingChip label="Median"   icon={ClockIcon}        value={stats.median_completion_time_seconds} iconColor={MEDIAN_COLOR}        valueColor={MEDIAN_COLOR} />
                    <TimingChip label="Fastest"  icon={RocketLaunchIcon} value={stats.fastest_completion_seconds}     iconColor="hsl(142 71% 45%)" />
                    <TimingChip label="Slowest"  icon={HourglassLowIcon} value={stats.slowest_completion_seconds}     iconColor="hsl(38 92% 50%)" />
                </div>

                {hasRange && (
                    <div className="space-y-1 pt-1">
                        <div className="relative h-1.5 w-full rounded-full overflow-hidden bg-muted/60">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/50 via-muted/10 to-amber-500/50" />
                            {avgPct != null && (
                                <div
                                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-0.5 rounded-full"
                                    style={{ left: `${avgPct}%`, background: AVG_COLOR }}
                                />
                            )}
                            {medianPct != null && (
                                <div
                                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-0.5 rounded-full"
                                    style={{ left: `${medianPct}%`, background: MEDIAN_COLOR }}
                                />
                            )}
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{formatDuration(fastest!)}</span>
                            <span className="text-muted-foreground/60">fastest — slowest</span>
                            <span>{formatDuration(slowest!)}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
