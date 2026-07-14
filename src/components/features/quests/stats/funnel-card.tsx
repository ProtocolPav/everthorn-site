import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { QuestStatisticsOut } from '@/api/nexuscore/model'
import {
    BarChart, Bar, Cell, XAxis, YAxis, Tooltip,
    LabelList, ResponsiveContainer,
} from 'recharts'
import { FunnelIcon } from '@phosphor-icons/react'

interface Props { stats: QuestStatisticsOut }

const STAGES = [
    { key: 'accepts',   label: 'Accepted',  color: 'var(--chart-1)' },
    { key: 'started',   label: 'Started',   color: 'var(--chart-2)' },
    { key: 'completed', label: 'Completed', color: 'var(--chart-3)' },
] as const

function rateColor(pct: number) {
    if (pct >= 60) return 'hsl(142 71% 45%)'
    if (pct >= 30) return 'hsl(38 92% 50%)'
    return 'hsl(0 84% 60%)'
}

function fmtSeconds(s?: number | null) {
    if (!s) return null
    if (s < 60) return `${Math.round(s)}s`
    if (s < 3600) return `${Math.round(s / 60)}m`
    return `${(s / 3600).toFixed(1)}h`
}

export function FunnelCard({ stats }: Props) {
    const top = Math.max(stats.total_accepts, 1)

    const data = [
        {
            stage:     'Accepted',
            value:     stats.total_accepts,
            pct:       100,
            pctOfPrev: 100,
            dropped:   0,
            color:     'var(--chart-1)',
        },
        {
            stage:     'Started',
            value:     stats.total_started,
            pct:       (stats.total_started / top) * 100,
            pctOfPrev: (stats.total_started / top) * 100,
            dropped:   stats.total_accepts - stats.total_started,
            color:     'var(--chart-2)',
        },
        {
            stage:     'Completed',
            value:     stats.total_completed,
            pct:       (stats.total_completed / top) * 100,
            pctOfPrev: (stats.total_completed / Math.max(stats.total_started, 1)) * 100,
            dropped:   stats.total_started - stats.total_completed,
            color:     'var(--chart-3)',
        },
    ]

    const summaryStats = [
        {
            label: 'Start rate',
            value: `${((stats.started_rate ?? 0) * 100).toFixed(1)}%`,
            sub:   `${stats.total_started.toLocaleString()} players`,
            pct:   (stats.started_rate ?? 0) * 100,
        },
        {
            label: 'Completion rate',
            value: `${((stats.completion_rate ?? 0) * 100).toFixed(1)}%`,
            sub:   `${stats.total_completed.toLocaleString()} players`,
            pct:   (stats.completion_rate ?? 0) * 100,
        },
        {
            label: 'Pending',
            value: `${((stats.total_pending / top) * 100).toFixed(1)}%`,
            sub:   `${stats.total_pending.toLocaleString()} players`,
            pct:   100 - (stats.total_pending / top) * 100,
            // high pending = bad, so invert: treat as if lower is worse
            invert: true,
        },
        ...( stats.total_failed > 0 ? [{
            label: 'Failed',
            value: `${((stats.total_failed / top) * 100).toFixed(1)}%`,
            sub:   `${stats.total_failed.toLocaleString()} players`,
            pct:   100 - (stats.total_failed / top) * 100,
            invert: true,
        }] : []),
    ]

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                    Player Funnel
                </CardTitle>
                <CardDescription>
                    {stats.total_accepts.toLocaleString()} players accepted
                    {stats.unique_players !== stats.total_accepts && (
                        <> &middot; {stats.unique_players.toLocaleString()} unique</>
                    )}
                    {stats.repeat_attempt_players > 0 && (
                        <> &middot; {stats.repeat_attempt_players.toLocaleString()} re-attempted</>
                    )}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 pb-3 space-y-4">
                {/* ── Funnel bars ── */}
                <ChartContainer
                    config={{
                        value: { label: 'Players' },
                    }}
                    className="h-[152px] w-full"
                >
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 0, right: 56, bottom: 0, left: 72 }}
                        barCategoryGap="18%"
                    >
                        <XAxis type="number" domain={[0, top]} hide />
                        <YAxis
                            type="category"
                            dataKey="stage"
                            axisLine={false}
                            tickLine={false}
                            tick={({ x, y, payload }) => (
                                <text
                                    x={x - 4} y={y}
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                    fontSize={12}
                                    fontWeight={500}
                                    fill="hsl(var(--muted-foreground))"
                                >
                                    {payload.value}
                                </text>
                            )}
                            width={68}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4, radius: 4 }}
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null
                                const d = payload[0].payload as typeof data[number]
                                return (
                                    <div className="rounded-lg border bg-card shadow-lg text-xs px-3 py-2.5 min-w-[188px]">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <div className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                                            <span className="font-semibold text-[13px]">{d.stage}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <Row label="Players"       value={d.value.toLocaleString()} />
                                            <Row label="% of accepted" value={`${d.pct.toFixed(1)}%`}  color={rateColor(d.pct)} />
                                            {d.stage !== 'Accepted' && (
                                                <>
                                                    <Row
                                                        label="% of prev step"
                                                        value={`${d.pctOfPrev.toFixed(1)}%`}
                                                        color={rateColor(d.pctOfPrev)}
                                                    />
                                                    <div className="border-t border-border/40 mt-1 pt-1">
                                                        <Row
                                                            label="Dropped off"
                                                            value={`−${d.dropped.toLocaleString()}`}
                                                            color="hsl(var(--destructive))"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            }}
                        />
                        <Bar dataKey="value" radius={4} maxBarSize={36} isAnimationActive animationDuration={500}>
                            {data.map((d) => (
                                <Cell key={d.stage} fill={d.color} />
                            ))}
                            {/* right-side label: count + % */}
                            <LabelList
                                dataKey="value"
                                position="right"
                                content={({ x, y, width, height, value, index }) => {
                                    if (x == null || y == null || width == null || height == null) return null
                                    const d   = data[index as number]
                                    const lx  = Number(x) + Number(width) + 6
                                    const ly  = Number(y) + Number(height) / 2
                                    return (
                                        <text x={lx} y={ly} dominantBaseline="middle" fontSize={11} fill="hsl(var(--foreground))">
                                            <tspan fontWeight={700}>{Number(value).toLocaleString()}</tspan>
                                            <tspan fill="hsl(var(--muted-foreground))" dx={3}>{d.pct.toFixed(0)}%</tspan>
                                        </text>
                                    )
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>

                {/* ── Conversion arrows ── */}
                <div className="flex items-center justify-center gap-2 -mt-2">
                    {data.slice(1).map((d) => (
                        <div key={d.stage} className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground">
                                {data[data.indexOf(d) - 1]?.stage} → {d.stage}
                            </span>
                            <span
                                className="text-[11px] font-bold"
                                style={{ color: rateColor(d.pctOfPrev) }}
                            >
                                {d.pctOfPrev.toFixed(1)}%
                            </span>
                            {data.indexOf(d) < data.length - 1 && (
                                <span className="text-muted-foreground/40">·</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Summary strip ── */}
                <div
                    className={`grid gap-2 border-t border-border/40 pt-3`}
                    style={{ gridTemplateColumns: `repeat(${summaryStats.length}, minmax(0, 1fr))` }}
                >
                    {summaryStats.map(({ label, value, sub, pct, invert }) => (
                        <div key={label} className="flex flex-col items-center gap-0.5 rounded-md bg-muted/30 px-2 py-2">
                            <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
                            <span
                                className="text-[15px] font-bold tabular-nums leading-none mt-0.5"
                                style={{ color: rateColor(invert ? 100 - pct : pct) }}
                            >
                                {value}
                            </span>
                            <span className="text-[10px] text-muted-foreground tabular-nums">{sub}</span>
                        </div>
                    ))}
                </div>

                {/* ── Avg completion time (if data exists) ── */}
                {stats.avg_completion_time_seconds != null && (
                    <div className="flex items-center justify-between rounded-md bg-muted/20 border border-border/40 px-3 py-2 text-xs">
                        <span className="text-muted-foreground">Avg completion time</span>
                        <div className="flex items-center gap-3">
                            <span className="font-semibold">{fmtSeconds(stats.avg_completion_time_seconds)} avg</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{fmtSeconds(stats.median_completion_time_seconds)} median</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{fmtSeconds(stats.fastest_completion_seconds)} fastest</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div className="flex justify-between gap-8">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold tabular-nums" style={color ? { color } : undefined}>{value}</span>
        </div>
    )
}
