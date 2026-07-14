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

const AVG_COLOR    = 'hsl(217 91% 60%)'
const MEDIAN_COLOR = 'hsl(258 90% 66%)'

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
        <div className="flex flex-col gap-1 rounded-xl border bg-muted/30 p-3">
            <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} weight="duotone" />
                <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
            <p className="text-xl font-bold tabular-nums tracking-tight" style={valueColor ? { color: valueColor } : undefined}>
                {value != null
                    ? formatDuration(value)
                    : <span className="text-muted-foreground text-sm font-normal">—</span>}
            </p>
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
        ? ((stats.avg_completion_time_seconds - fastest) / (slowest - fastest)) * 100
        : null
    const medianPct = hasRange && stats.median_completion_time_seconds != null
        ? ((stats.median_completion_time_seconds - fastest) / (slowest - fastest)) * 100
        : null

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
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
            <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2">
                    <TimingChip
                        label="Average"
                        icon={ClockIcon}
                        value={stats.avg_completion_time_seconds}
                        iconColor={AVG_COLOR}
                        valueColor={AVG_COLOR}
                    />
                    <TimingChip
                        label="Median"
                        icon={ClockIcon}
                        value={stats.median_completion_time_seconds}
                        iconColor={MEDIAN_COLOR}
                        valueColor={MEDIAN_COLOR}
                    />
                    <TimingChip
                        label="Fastest"
                        icon={RocketLaunchIcon}
                        value={stats.fastest_completion_seconds}
                        iconColor="hsl(142 71% 45%)"
                    />
                    <TimingChip
                        label="Slowest"
                        icon={HourglassLowIcon}
                        value={stats.slowest_completion_seconds}
                        iconColor="hsl(38 92% 50%)"
                    />
                </div>

                {/* Fastest → slowest range bar with avg + median markers */}
                {hasRange && (
                    <div className="mt-3 space-y-1.5">
                        <div className="relative h-2 w-full rounded-full bg-muted/60 overflow-visible">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/40 via-muted/20 to-amber-500/40" />
                            {avgPct != null && (
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 h-3.5 w-0.5 rounded-full"
                                    style={{ left: `${avgPct}%`, background: AVG_COLOR }}
                                />
                            )}
                            {medianPct != null && (
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 h-3.5 w-0.5 rounded-full"
                                    style={{ left: `${medianPct}%`, background: MEDIAN_COLOR }}
                                />
                            )}
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{formatDuration(fastest!)}</span>
                            <span>{formatDuration(slowest!)}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
