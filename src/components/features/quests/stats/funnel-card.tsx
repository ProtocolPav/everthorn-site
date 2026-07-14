import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart'
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
    failed:    { label: 'Failed',    color: 'var(--chart-5)' },
} satisfies ChartConfig

export function FunnelCard({ stats }: FunnelCardProps) {
    const data = [
        { name: 'Accepted',  value: stats.total_accepts,   fill: 'var(--chart-1)' },
        { name: 'Started',   value: stats.total_started,   fill: 'var(--chart-2)' },
        { name: 'Completed', value: stats.total_completed, fill: 'var(--chart-3)' },
    ]

    const startedPct = stats.total_accepts > 0
        ? ((stats.total_started / stats.total_accepts) * 100).toFixed(1)
        : '0.0'
    const completionPct = stats.total_accepts > 0
        ? ((stats.total_completed / stats.total_accepts) * 100).toFixed(1)
        : '0.0'

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
                                return (
                                    <div className="rounded-md border bg-card p-2 shadow-md text-xs">
                                        <p className="font-semibold">{d.name}</p>
                                        <p className="text-muted-foreground">{(d.value as number).toLocaleString()} players</p>
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

                {/* Stat chips below the chart */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                        { label: 'Accepted', value: stats.total_accepts, color: 'text-[var(--chart-1)]' },
                        { label: 'Started',  value: `${startedPct}%`,    color: 'text-[var(--chart-2)]' },
                        { label: 'Completed',value: `${completionPct}%`, color: 'text-[var(--chart-3)]' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-lg bg-muted/40 px-2 py-1.5 text-center">
                            <p className={`text-sm font-bold tabular-nums ${color}`}>{value}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Failed row */}
                {stats.total_failed > 0 && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-destructive/5 border border-destructive/10 px-3 py-1.5">
                        <span className="text-xs text-muted-foreground">Failed</span>
                        <span className="text-xs font-semibold text-destructive">{stats.total_failed.toLocaleString()}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
