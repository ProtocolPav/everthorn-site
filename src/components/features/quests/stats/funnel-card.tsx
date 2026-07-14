import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { QuestStatisticsOut } from '@/api/nexuscore/model'
import { FunnelChart, Funnel, LabelList, Tooltip } from 'recharts'
import { FunnelIcon } from '@phosphor-icons/react'

interface FunnelCardProps {
    stats: QuestStatisticsOut
}

function rateColor(pct: number) {
    if (pct >= 60) return '#22c55e'
    if (pct >= 30) return '#f59e0b'
    return '#ef4444'
}

const chartConfig = {
    accepts:   { label: 'Accepted',  color: 'var(--chart-1)' },
    started:   { label: 'Started',   color: 'var(--chart-2)' },
    completed: { label: 'Completed', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function FunnelCard({ stats }: FunnelCardProps) {
    const top = Math.max(stats.total_accepts, 1)

    const data = [
        {
            name:      'Accepted',
            value:     stats.total_accepts,
            fill:      'var(--chart-1)',
            pctOfTop:  100,
            pctOfPrev: 100,
            dropped:   0,
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

    const failedPct = (stats.total_failed / top) * 100

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                    Player Funnel
                </CardTitle>
                <CardDescription>
                    {stats.total_accepts.toLocaleString()} accepted — how far players progress
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 pb-3">
                <ChartContainer config={chartConfig} className="h-52 w-full">
                    <FunnelChart margin={{ top: 4, right: 40, left: 40, bottom: 4 }}>
                        <Tooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null
                                const d = payload[0].payload as typeof data[number]
                                return (
                                    <div className="rounded-lg border bg-card shadow-lg text-xs px-3 py-2.5 min-w-[190px]">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <div className="h-2.5 w-2.5 rounded-sm" style={{ background: d.fill }} />
                                            <span className="font-semibold text-[13px]">{d.name}</span>
                                        </div>
                                        <div className="space-y-1">
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
                                                    <div className="border-t border-border/40 pt-1 mt-1 flex justify-between gap-8">
                                                        <span className="text-muted-foreground">Dropped off</span>
                                                        <span className="font-semibold tabular-nums text-destructive">
                                                            −{d.dropped.toLocaleString()}
                                                        </span>
                                                    </div>
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
                            animationDuration={600}
                            animationEasing="ease-out"
                            lastShapeType="rectangle"
                        >
                            <LabelList
                                position="center"
                                content={({ x, y, width, height, value, index }) => {
                                    if (x == null || y == null || width == null || height == null) return null
                                    const d      = data[index as number]
                                    const cx     = Number(x) + Number(width) / 2
                                    const cy     = Number(y) + Number(height) / 2
                                    const narrow = Number(width) < 80
                                    return (
                                        <g style={{ pointerEvents: 'none' }}>
                                            {/* Stage name */}
                                            <text
                                                x={cx} y={cy - (narrow ? 0 : 9)}
                                                textAnchor="middle" dominantBaseline="middle"
                                                fontSize={11} fontWeight={600}
                                                fill="rgba(255,255,255,0.85)"
                                            >
                                                {d.name}
                                            </text>
                                            {/* Count */}
                                            {!narrow && (
                                                <text
                                                    x={cx} y={cy + 8}
                                                    textAnchor="middle" dominantBaseline="middle"
                                                    fontSize={13} fontWeight={700}
                                                    fill="#fff"
                                                >
                                                    {Number(value).toLocaleString()}
                                                </text>
                                            )}
                                        </g>
                                    )
                                }}
                            />
                        </Funnel>
                    </FunnelChart>
                </ChartContainer>

                {/* Failed pill */}
                {stats.total_failed > 0 && (
                    <div className="flex justify-center mt-1 mb-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-0.5 text-[11px] font-semibold text-destructive">
                            {stats.total_failed.toLocaleString()} failed · {failedPct.toFixed(1)}% of accepted
                        </span>
                    </div>
                )}

                {/* Summary strip */}
                <div className="mt-2 grid grid-cols-3 gap-2 border-t border-border/40 pt-3">
                    {[
                        {
                            label:   'Start rate',
                            pct:     (stats.started_rate ?? 0) * 100,
                            count:   stats.total_started,
                            sublabel: 'of accepted',
                        },
                        {
                            label:   'Completion rate',
                            pct:     (stats.completion_rate ?? 0) * 100,
                            count:   stats.total_completed,
                            sublabel: 'of accepted',
                        },
                        {
                            label:   'Never finished',
                            pct:     100 - (stats.completion_rate ?? 0) * 100,
                            count:   stats.total_accepts - stats.total_completed,
                            sublabel: 'of accepted',
                            invert:  true,
                        },
                    ].map(({ label, pct, count, sublabel, invert }) => (
                        <div key={label} className="flex flex-col items-center gap-0.5 rounded-md bg-muted/30 px-2 py-2">
                            <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
                            <span
                                className="text-[15px] font-bold tabular-nums leading-none mt-0.5"
                                style={{ color: rateColor(invert ? 100 - pct : pct) }}
                            >
                                {pct.toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-muted-foreground tabular-nums">
                                {count.toLocaleString()} players
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
