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

export function FunnelCard({ stats }: FunnelCardProps) {
    const data = [
        { name: 'Accepted',  value: stats.total_accepts,   fill: 'var(--chart-1)' },
        { name: 'Started',   value: stats.total_started,   fill: 'var(--chart-2)' },
        { name: 'Completed', value: stats.total_completed, fill: 'var(--chart-3)' },
    ]

    const startedPct    = stats.started_rate * 100
    const completionPct = stats.completion_rate * 100

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
                                const entry = payload[0].payload as typeof data[0]
                                const cfgKey = NAME_TO_KEY[entry.name]
                                const color  = cfgKey ? chartConfig[cfgKey].color : entry.fill
                                const pct    = stats.total_accepts > 0
                                    ? ((entry.value / stats.total_accepts) * 100).toFixed(1)
                                    : '0.0'
                                return (
                                    <div className="rounded-md border bg-card p-2.5 shadow-md text-xs min-w-[130px]">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <div className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
                                            <p className="font-semibold">{entry.name}</p>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-muted-foreground">Players</span>
                                            <span className="font-semibold tabular-nums">{entry.value.toLocaleString()}</span>
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

                <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-muted/40 px-2 py-2 text-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--chart-1)] mx-auto mb-1" />
                        <p className="text-sm font-bold tabular-nums text-[var(--chart-1)]">
                            {stats.total_accepts.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Accepted</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 px-2 py-2 text-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--chart-2)] mx-auto mb-1" />
                        <p className={`text-sm font-bold tabular-nums ${rateColor(startedPct)}`}>
                            {startedPct.toFixed(1)}%
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            {stats.total_started.toLocaleString()} started
                        </p>
                    </div>
                    <div className="rounded-lg bg-muted/40 px-2 py-2 text-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--chart-3)] mx-auto mb-1" />
                        <p className={`text-sm font-bold tabular-nums ${rateColor(completionPct)}`}>
                            {completionPct.toFixed(1)}%
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            {stats.total_completed.toLocaleString()} completed
                        </p>
                    </div>
                </div>

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
