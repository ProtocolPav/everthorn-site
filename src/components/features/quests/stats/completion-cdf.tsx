import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import {
    AreaChart, Area, CartesianGrid,
    XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts'
import { QuestCompletionBucket } from '@/api/nexuscore/model'
import { formatDuration } from '@/lib/format'
import { ChartLineUpIcon } from '@phosphor-icons/react'
import { AVG_COLOR, MEDIAN_COLOR } from './timing-card'

interface CompletionCDFProps {
    buckets: QuestCompletionBucket[]
    avg?: number | null
    median?: number | null
}

const chartConfig = {
    cdf: { label: '% completed', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function CompletionCDF({ buckets, avg, median }: CompletionCDFProps) {
    const isEmpty = !buckets || buckets.length === 0
    const total   = buckets.reduce((s, b) => s + b.count, 0)

    const cdfData = (() => {
        let running = 0
        return buckets
            .slice()
            .sort((a, b) => a.bucket_start_seconds - b.bucket_start_seconds)
            .map((b) => {
                running += b.count
                return {
                    t:     b.bucket_end_seconds,        // numeric seconds — used as XAxis domain value
                    cdf:   total > 0 ? parseFloat(((running / total) * 100).toFixed(1)) : 0,
                    raw:   running,
                    start: b.bucket_start_seconds,
                    end:   b.bucket_end_seconds,
                    count: b.count,
                }
            })
    })()

    const xMin = cdfData[0]?.t ?? 0
    const xMax = cdfData[cdfData.length - 1]?.t ?? 1

    // Y value at avg/median for the dot label on the area curve
    function cdfAtX(x: number) {
        const after = cdfData.find((d) => d.t >= x)
        return after?.cdf ?? null
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <ChartLineUpIcon className="h-4 w-4 text-muted-foreground" />
                    Completion Speed Distribution
                </CardTitle>
                <CardDescription>
                    {isEmpty
                        ? 'No completions yet'
                        : `Cumulative % of ${total.toLocaleString()} player${total !== 1 ? 's' : ''} by finish time`}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
                {isEmpty ? (
                    <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
                        No completions recorded yet
                    </div>
                ) : (
                    <>
                        <ChartContainer config={chartConfig} className="h-52 w-full">
                            <AreaChart
                                data={cdfData}
                                margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="cdfGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="var(--chart-1)" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="hsl(var(--border))" strokeOpacity={0.5} />

                                {/* 50% guide line */}
                                <ReferenceLine
                                    y={50}
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeDasharray="3 4"
                                    strokeWidth={1}
                                    strokeOpacity={0.4}
                                />

                                <XAxis
                                    dataKey="t"
                                    type="number"
                                    scale="linear"
                                    domain={[xMin, xMax]}
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={8}
                                    minTickGap={52}
                                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                    tickFormatter={(v) => formatDuration(v)}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tickCount={6}
                                    width={36}
                                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                    tickFormatter={(v) => `${v}%`}
                                />

                                <Tooltip
                                    cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1.5 }}
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null
                                        const d = payload[0].payload as typeof cdfData[0]
                                        return (
                                            <div className="rounded-lg border bg-card shadow-lg text-xs px-3 py-2.5 min-w-[178px]">
                                                <p className="font-semibold text-[13px] mb-2">
                                                    Within {formatDuration(d.end)}
                                                </p>
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between gap-8">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="h-2 w-2 rounded-full" style={{ background: 'var(--chart-1)' }} />
                                                            <span className="text-muted-foreground">Completed</span>
                                                        </div>
                                                        <span className="font-bold tabular-nums" style={{ color: 'var(--chart-1)' }}>
                                                            {d.cdf}%
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between gap-8">
                                                        <span className="text-muted-foreground pl-3.5">Players</span>
                                                        <span className="font-semibold tabular-nums">{d.raw.toLocaleString()}</span>
                                                    </div>
                                                    <div className="border-t border-border/40 pt-1.5 flex justify-between gap-8">
                                                        <span className="text-muted-foreground">This bucket</span>
                                                        <span className="font-semibold tabular-nums">
                                                            +{d.count} ({formatDuration(d.start)}–{formatDuration(d.end)})
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }}
                                />

                                {/* Avg reference line — x is numeric seconds, works on type="number" XAxis */}
                                {avg != null && (
                                    <ReferenceLine
                                        x={avg}
                                        stroke={AVG_COLOR}
                                        strokeWidth={1.5}
                                        strokeDasharray="5 3"
                                        label={{
                                            value: `Avg ${formatDuration(avg)}`,
                                            position: 'insideTopLeft',
                                            fontSize: 9,
                                            fill: AVG_COLOR,
                                            dy: -8,
                                        }}
                                    />
                                )}

                                {/* Median reference line */}
                                {median != null && (
                                    <ReferenceLine
                                        x={median}
                                        stroke={MEDIAN_COLOR}
                                        strokeWidth={1.5}
                                        strokeDasharray="5 3"
                                        label={{
                                            value: `Med ${formatDuration(median)}`,
                                            position: 'insideTopRight',
                                            fontSize: 9,
                                            fill: MEDIAN_COLOR,
                                            dy: -8,
                                        }}
                                    />
                                )}

                                <Area
                                    dataKey="cdf"
                                    type="monotone"
                                    stroke="var(--chart-1)"
                                    strokeWidth={2}
                                    fill="url(#cdfGrad)"
                                    dot={false}
                                    activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--chart-1)' }}
                                />
                            </AreaChart>
                        </ChartContainer>

                        {/* Stat pills */}
                        {(avg != null || median != null) && (
                            <div className="flex gap-2">
                                {avg != null && (
                                    <div className="flex-1 flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: `${AVG_COLOR}40`, background: `${AVG_COLOR}0d` }}>
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-0.5 rounded-full" style={{ background: AVG_COLOR }} />
                                            <span className="text-[11px] text-muted-foreground">Average</span>
                                        </div>
                                        <span className="text-[13px] font-bold tabular-nums" style={{ color: AVG_COLOR }}>
                                            {formatDuration(avg)}
                                        </span>
                                    </div>
                                )}
                                {median != null && (
                                    <div className="flex-1 flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: `${MEDIAN_COLOR}40`, background: `${MEDIAN_COLOR}0d` }}>
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-0.5 rounded-full" style={{ background: MEDIAN_COLOR }} />
                                            <span className="text-[11px] text-muted-foreground">Median</span>
                                        </div>
                                        <span className="text-[13px] font-bold tabular-nums" style={{ color: MEDIAN_COLOR }}>
                                            {formatDuration(median)}
                                        </span>
                                    </div>
                                )}
                                {avg != null && median != null && (
                                    <div className="flex-1 flex items-center justify-between rounded-md border border-border/40 bg-muted/20 px-3 py-2">
                                        <span className="text-[11px] text-muted-foreground">50th %ile</span>
                                        <span className="text-[13px] font-bold tabular-nums">
                                            {cdfAtX(median) != null ? `${cdfAtX(median)?.toFixed(0)}%` : '—'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
