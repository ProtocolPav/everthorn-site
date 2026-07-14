import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { FunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts'
import { QuestStatisticsOut } from '@/api/nexuscore/model'
import { FunnelIcon } from '@phosphor-icons/react'

interface FunnelCardProps {
    stats: QuestStatisticsOut
}

const chartConfig = {
    accepts:   { label: 'Accepted',  color: 'var(--chart-1)' },
    pending:   { label: 'Pending',   color: 'var(--chart-4)' },
    started:   { label: 'Started',   color: 'var(--chart-2)' },
    completed: { label: 'Completed', color: 'var(--chart-3)' },
} satisfies ChartConfig

function rateColor(pct: number) {
    if (pct >= 60) return 'hsl(142 71% 45%)'
    if (pct >= 30) return 'hsl(38 92% 50%)'
    return 'hsl(0 84% 60%)'
}

export function FunnelCard({ stats }: FunnelCardProps) {
    const top = Math.max(stats.total_accepts, 1)

    const data = [
        {
            name:      'Accepted',
            value:     stats.total_accepts,
            fill:      'var(--chart-1)',
            pctOfTop:  100,
            pctOfPrev: 100,
            dropped:   null as number | null,
        },
        {
            name:      'Started',
            value:     stats.total_started,
            fill:      'var(--chart-2)',
            pctOfTop:  (stats.total_started / top) * 100,
            pctOfPrev: (stats.total_started / top) * 100,
            dropped:   stats.total_accepts - stats.total_started,
        },
        {
            name:      'Completed',
            value:     stats.total_completed,
            fill:      'var(--chart-3)',
            pctOfTop:  (stats.total_completed / top) * 100,
            pctOfPrev: (stats.total_completed / Math.max(stats.total_started, 1)) * 100,
            dropped:   stats.total_started - stats.total_completed,
        },
    ]

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                    Player Funnel
                </CardTitle>
                <CardDescription>
                    {stats.total_accepts.toLocaleString()} accepted &middot; how far players progress
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 pb-3 space-y-3">
                <ChartContainer config={chartConfig} className="h-56 w-full">
                    <FunnelChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                        <Tooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null
                                const d = payload[0].payload as typeof data[number]
                                return (
                                    <div className="rounded-lg border bg-card shadow-lg text-xs px-3 py-2.5 min-w-[188px]">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <div className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: d.fill }} />
                                            <span className="font-semibold text-[13px]">{d.name}</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between gap-8">
                                                <span className="text-muted-foreground">Players</span>
                                                <span className="font-bold tabular-nums">{d.value.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between gap-8">
                                                <span className="text-muted-foreground">% of accepted</span>
                                                <span className="font-semibold tabular-nums" style={{ color: rateColor(d.pctOfTop) }}>
                                                    {d.pctOfTop.toFixed(1)}%
                                                </span>
                                            </div>
                                            {d.name !== 'Accepted' && (
                                                <>
                                                    <div className="flex justify-between gap-8">
                                                        <span className="text-muted-foreground">% of prev step</span>
                                                        <span className="font-semibold tabular-nums" style={{ color: rateColor(d.pctOfPrev) }}>
                                                            {d.pctOfPrev.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    {d.dropped != null && d.dropped > 0 && (
                                                        <div className="flex justify-between gap-8 border-t border-border/40 pt-1.5">
                                                            <span className="text-muted-foreground">Dropped off</span>
                                                            <span className="font-semibold tabular-nums text-destructive">
                                                                &minus;{d.dropped.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            }}
                        />
                        <Funnel
                            dataKey="value"
                            data={data}
                            isAnimationActive
                            animationDuration={500}
                            animationEasing="ease-out"
                            lastShapeType="rectangle"
                        >
                            {data.map((d) => (
                                <Cell key={d.name} fill={d.fill} />
                            ))}
                            <LabelList
                                position="center"
                                content={(props) => {
                                    const { x, y, width, height, index } = props as any
                                    if (x == null) return null
                                    const d   = data[index]
                                    const cx  = Number(x) + Number(width) / 2
                                    const cy  = Number(y) + Number(height) / 2
                                    const too_narrow = Number(width) < 72
                                    return (
                                        <g style={{ pointerEvents: 'none' }}>
                                            <text
                                                x={cx} y={cy + (too_narrow ? 0 : -9)}
                                                textAnchor="middle" dominantBaseline="middle"
                                                fontSize={11} fontWeight={600}
                                                fill="rgba(255,255,255,0.9)"
                                            >
                                                {d.name}
                                            </text>
                                            {!too_narrow && (
                                                <text
                                                    x={cx} y={cy + 9}
                                                    textAnchor="middle" dominantBaseline="middle"
                                                    fontSize={13} fontWeight={700}
                                                    fill="#fff"
                                                >
                                                    {d.value.toLocaleString()}
                                                </text>
                                            )}
                                        </g>
                                    )
                                }}
                            />
                        </Funnel>
                    </FunnelChart>
                </ChartContainer>

                {/* Step conversion rates */}
                <div className="flex items-center justify-center gap-1 text-[11px] flex-wrap">
                    {data.slice(1).map((d, i) => (
                        <span key={d.name} className="flex items-center gap-1">
                            {i > 0 && <span className="text-border mx-1">&middot;</span>}
                            <span className="text-muted-foreground">{data[i].name} → {d.name}</span>
                            <span className="font-bold" style={{ color: rateColor(d.pctOfPrev) }}>
                                {d.pctOfPrev.toFixed(1)}%
                            </span>
                        </span>
                    ))}
                </div>

                {/* Stat strip */}
                <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-3">
                    {[
                        { label: 'Accepted',        value: stats.total_accepts,   pct: 100,                                    color: 'var(--chart-1)' },
                        { label: 'Start rate',       value: stats.total_started,   pct: (stats.started_rate ?? 0) * 100,        color: rateColor((stats.started_rate ?? 0) * 100) },
                        { label: 'Completion rate',  value: stats.total_completed, pct: (stats.completion_rate ?? 0) * 100,     color: rateColor((stats.completion_rate ?? 0) * 100) },
                    ].map(({ label, value, pct, color }) => (
                        <div key={label} className="flex flex-col items-center gap-0.5 rounded-md bg-muted/30 px-2 py-2">
                            <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
                            <span className="text-[15px] font-bold tabular-nums leading-none mt-0.5" style={{ color }}>
                                {label === 'Accepted' ? value.toLocaleString() : `${pct.toFixed(1)}%`}
                            </span>
                            <span className="text-[10px] text-muted-foreground tabular-nums">
                                {label === 'Accepted' ? 'players' : `${value.toLocaleString()} players`}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Pending + Failed side notes */}
                {(stats.total_pending > 0 || stats.total_failed > 0) && (
                    <div className="flex gap-2">
                        {stats.total_pending > 0 && (
                            <div className="flex-1 flex items-center justify-between rounded-md bg-muted/20 border border-border/30 px-2.5 py-1.5">
                                <span className="text-[11px] text-muted-foreground">Pending (never started)</span>
                                <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
                                    {stats.total_pending.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {stats.total_failed > 0 && (
                            <div className="flex-1 flex items-center justify-between rounded-md bg-destructive/5 border border-destructive/20 px-2.5 py-1.5">
                                <span className="text-[11px] text-muted-foreground">Failed</span>
                                <span className="text-[11px] font-semibold text-destructive tabular-nums">
                                    {stats.total_failed.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
