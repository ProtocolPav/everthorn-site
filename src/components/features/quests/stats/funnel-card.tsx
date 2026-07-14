import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Cell,
    PieChart,
    Pie,
    Label,
} from 'recharts'
import { QuestStatisticsOut } from '@/api/nexuscore/model'
import { FunnelIcon, UsersThreeIcon } from '@phosphor-icons/react'

interface FunnelCardProps {
    stats: QuestStatisticsOut
}

const barConfig = {
    pending:   { label: 'Never Started', color: 'var(--chart-4)' },
    started:   { label: 'In Progress',   color: 'var(--chart-2)' },
    completed: { label: 'Completed',     color: 'var(--chart-3)' },
    failed:    { label: 'Failed',        color: 'var(--chart-5)' },
} satisfies ChartConfig

const donutConfig = {
    first_timers: { label: 'First-timers', color: 'var(--chart-1)' },
    repeat:       { label: 'Repeat',       color: 'var(--chart-4)' },
} satisfies ChartConfig

export function FunnelCard({ stats }: FunnelCardProps) {
    const barData = [
        {
            name: 'Players',
            pending:   stats.total_pending,
            started:   stats.total_started,
            completed: stats.total_completed,
            failed:    stats.total_failed,
        },
    ]

    const firstTimers = Math.max(0, stats.unique_players - stats.repeat_attempt_players)
    const donutData = [
        { name: 'first_timers', value: firstTimers,                   fill: 'var(--chart-1)' },
        { name: 'repeat',       value: stats.repeat_attempt_players,  fill: 'var(--chart-4)' },
    ]
    const totalUnique = stats.unique_players

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                    Player Outcomes
                </CardTitle>
                <CardDescription>
                    {stats.total_accepts.toLocaleString()} total accept{stats.total_accepts !== 1 ? 's' : ''} · {(stats.completion_rate * 100).toFixed(1)}% completion
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                {/* Two-column layout: stacked bar + repeat donut */}
                <div className="flex gap-3 items-center">
                    {/* Stacked horizontal bar */}
                    <ChartContainer config={barConfig} className="h-20 flex-1 min-w-0">
                        <BarChart
                            data={barData}
                            layout="vertical"
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            barCategoryGap={0}
                        >
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null
                                    return (
                                        <div className="rounded-md border bg-card p-2 shadow-md text-xs space-y-1">
                                            {payload.map((p) => (
                                                <div key={p.dataKey} className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                                                        <span className="text-muted-foreground">
                                                            {barConfig[p.dataKey as keyof typeof barConfig]?.label}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold tabular-nums">{(p.value as number).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }}
                            />
                            <Bar dataKey="pending"   stackId="a" radius={[4, 0, 0, 4]} fill="var(--chart-4)" fillOpacity={0.7} />
                            <Bar dataKey="started"   stackId="a" fill="var(--chart-2)" fillOpacity={0.85} />
                            <Bar dataKey="completed" stackId="a" fill="var(--chart-3)" fillOpacity={0.9} />
                            <Bar dataKey="failed"    stackId="a" radius={[0, 4, 4, 0]} fill="var(--chart-5)" fillOpacity={0.85} />
                        </BarChart>
                    </ChartContainer>

                    {/* Repeat players donut */}
                    <div className="flex flex-col items-center shrink-0">
                        <ChartContainer config={donutConfig} className="h-20 w-20">
                            <PieChart>
                                <ChartTooltip
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null
                                        const d = payload[0]
                                        return (
                                            <div className="rounded-md border bg-card p-2 shadow-md text-xs">
                                                <p className="font-semibold">
                                                    {donutConfig[d.name as keyof typeof donutConfig]?.label}
                                                </p>
                                                <p className="text-muted-foreground">{(d.value as number).toLocaleString()} players</p>
                                            </div>
                                        )
                                    }}
                                />
                                <Pie
                                    data={donutData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={22}
                                    outerRadius={34}
                                    strokeWidth={0}
                                    paddingAngle={2}
                                >
                                    {donutData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.fill} />
                                    ))}
                                    <Label
                                        content={({ viewBox }) => {
                                            const { cx, cy } = viewBox as { cx: number; cy: number }
                                            return (
                                                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                                                    <tspan x={cx} y={cy - 5} fontSize={12} fontWeight={700} fill="hsl(var(--foreground))">
                                                        {totalUnique.toLocaleString()}
                                                    </tspan>
                                                    <tspan x={cx} y={cy + 8} fontSize={8} fill="hsl(var(--muted-foreground))">
                                                        unique
                                                    </tspan>
                                                </text>
                                            )
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-[var(--chart-4)]" />
                                <span className="text-[9px] text-muted-foreground">Repeat</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend chips */}
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                    {[
                        { key: 'pending',   value: stats.total_pending,   pct: null },
                        { key: 'started',   value: stats.total_started,   pct: `${(stats.started_rate * 100).toFixed(1)}%` },
                        { key: 'completed', value: stats.total_completed, pct: `${(stats.completion_rate * 100).toFixed(1)}%` },
                        { key: 'failed',    value: stats.total_failed,    pct: null },
                    ].map(({ key, value, pct }) => {
                        const cfg = barConfig[key as keyof typeof barConfig]
                        return (
                            <div key={key} className="rounded-lg bg-muted/40 px-1.5 py-1.5 text-center">
                                <div className="flex items-center justify-center gap-1 mb-0.5">
                                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.color }} />
                                </div>
                                <p className="text-xs font-bold tabular-nums">{value.toLocaleString()}</p>
                                {pct && <p className="text-[9px] text-muted-foreground">{pct}</p>}
                                <p className="text-[9px] text-muted-foreground leading-tight">{cfg.label}</p>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
