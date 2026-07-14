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

function TimingChip({
    label,
    icon: Icon,
    value,
    iconClass,
}: {
    label: string
    icon: React.ElementType
    value: number | null | undefined
    iconClass?: string
}) {
    return (
        <div className="flex flex-col gap-1 rounded-xl border bg-muted/30 p-3">
            <div className="flex items-center gap-1.5">
                <Icon className={`h-3.5 w-3.5 ${iconClass ?? 'text-muted-foreground'}`} weight="duotone" />
                <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
            <p className="text-xl font-bold tabular-nums tracking-tight">
                {value != null ? formatDuration(value) : <span className="text-muted-foreground text-sm font-normal">—</span>}
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
                        iconClass="text-blue-500"
                    />
                    <TimingChip
                        label="Median"
                        icon={ClockIcon}
                        value={stats.median_completion_time_seconds}
                        iconClass="text-violet-500"
                    />
                    <TimingChip
                        label="Fastest"
                        icon={RocketLaunchIcon}
                        value={stats.fastest_completion_seconds}
                        iconClass="text-emerald-500"
                    />
                    <TimingChip
                        label="Slowest"
                        icon={HourglassLowIcon}
                        value={stats.slowest_completion_seconds}
                        iconClass="text-amber-500"
                    />
                </div>

                {/* Pending / started breakdown */}
                <div className="mt-3 flex gap-2">
                    <div className="flex-1 rounded-lg bg-muted/40 px-3 py-1.5 text-center">
                        <p className="text-sm font-bold tabular-nums">{stats.total_pending.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Never started</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-muted/40 px-3 py-1.5 text-center">
                        <p className="text-sm font-bold tabular-nums">{stats.total_started.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Started</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-muted/40 px-3 py-1.5 text-center">
                        <p className="text-sm font-bold tabular-nums">{(stats.started_rate * 100).toFixed(1)}%</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Start rate</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
