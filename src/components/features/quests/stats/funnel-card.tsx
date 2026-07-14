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
import { FunnelIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface FunnelCardProps {
    stats: QuestStatisticsOut
}

const chartConfig = {
    accepts:   { label: 'Accepted',  color: 'var(--chart-1)' },
    started:   { label: 'Started',   color: 'var(--chart-2)' },
    completed: { label: 'Completed', color: 'var(--chart-3)' },
} satisfies ChartConfig

const STAGES = [
    { key: 'accepts',   color: 'var(--chart-1)', label: 'Accepted'  },
    { key: 'started',   color: 'var(--chart-2)', label: 'Started'   },
    { key: 'completed', color: 'var(--chart-3)', label: 'Completed' },
] as const

export function FunnelCard({ stats }: FunnelCardProps) {
    const data = [
        { name: 'Accepted',  value: stats.total_accepts,   fill: 'var(--chart-1)' },
        { name: 'Started',   value: stats.total_started,   fill: 'var(--chart-2)' },
        { name: 'Completed', value: stats.total_completed, fill: 'var(--chart-3)' },
    ]

    // Percentages relative to accepts (top of funnel)
    const startedPct     = stats.total_accepts > 0
        ? (stats.started_rate * 100).toFixed(1)
        : '0.0'
    const completionPct  = stats.total_accepts > 0
        ? (stats.completion_rate * 100).toFixed(1)
        : '0.0'

    // Chip colour logic
    function chipColor(pct: string) {
        const n = parseFloat(pct)
        if (n >= 60) return 'text-emerald-500'
        if (n >= 30) return 'text-amber-500'
        return 'text-red-500'
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                    Player Funnel
                </CardTitle>
                <CardDescription>Accepts → Started → Completed</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <ChartContainer config={chartConfig} className="h-44 w-full">
                    <FunnelChart>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null
                                const d = payload[0]
                                const val  = d.value as number
                                const pct  = stats.total_accepts > 0
                                    ? ((val / stats.total_accepts) * 100).toFixed(1)
                                    : '0.0'
                                const cfg  = chartConfig[d.name?.toLowerCase() as keyof typeof chartConfig]
                                return (
                                    <div className="rounded-md border bg-card p-2.5 shadow-md text-xs min-w-[130px]">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div
                                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                                style={{ background: cfg?.color ?? d.payload?.fill }}
                                            />
                                            <p className="font-semibold">{d.name}</p>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-muted-foreground">Players</span>
                                            <span className="font-semibold tabular-nums">{val.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-muted-foreground">of Accepts</span>
                                            <span className="font-semibold tabular-nums">{pct}%</span>
                                        </div>
                                    </div>
                                )
                            }}
                        />
                        <Funnel dataKey="value" data={data} isAnimationActive>
                            <LabelList
                                position="inside"
                                fill="#fff"
                                stroke="none"
                                fontSize={11}
                                fontWeight={600}
                                formatter={(v: number) => v.toLocaleString()}
                            />
                        </Funnel>
                    </FunnelChart>
                </ChartContainer>

                {/* Stat chips */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-muted/40 px-2 py-1.5 text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--chart-1)]" />
                        </div>
                        <p className="text-sm font-bold tabular-nums text-[var(--chart-1)]">
                            {stats.total_accepts.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Accepted</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 px-2 py-1.5 text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--chart-2)]" />
                        </div>
                        <p className={cn('text-sm font-bold tabular-nums', chipColor(startedPct))}>
                            {startedPct}%
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Started</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 px-2 py-1.5 text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--chart-3)]" />
                        </div>
                        <p className={cn('text-sm font-bold tabular-nums', chipColor(completionPct))}>
                            {completionPct}%
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Completed</p>
                    </div>
                </div>

                {/* Failed row */}
                {stats.total_failed > 0 && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-destructive/5 border border-destructive/10 px-3 py-1.5">
                        <span className="text-xs text-muted-foreground">Failed</span>
                        <span className="text-xs font-semibold text-destructive">
                            {stats.total_failed.toLocaleString()}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
