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

/**
 * Returns a formatter that drops unnecessary precision based on the
 * largest duration in the dataset.
 *
 * >= 1 hour  in dataset  → show h + m only (no seconds)
 * >= 1 min   in dataset  → show m + s, but drop s if s === 0
 * < 1 min                → show seconds only
 */
function makeFmt(maxSeconds: number) {
    if (maxSeconds >= 3600) {
        // hour-scale: show "3h 20m", never seconds
        return (s: number) => {
            const h = Math.floor(s / 3600)
            const m = Math.floor((s % 3600) / 60)
            if (h === 0) return `${m}m`
            if (m === 0) return `${h}h`
            return `${h}h ${m}m`
        }
    }
    if (maxSeconds >= 60) {
        // minute-scale: show "4m 30s", drop s when clean
        return (s: number) => {
            const m = Math.floor(s / 60)
            const sec = s % 60
            if (m === 0) return `${sec}s`
            if (sec === 0) return `${m}m`
            return `${m}m ${sec}s`
        }
    }
    // second-scale
    return (s: number) => `${s}s`
}

export function CompletionCDF({ buckets, avg, median }: CompletionCDFProps) {
    const isEmpty = !buckets || buckets.length === 0
    const total   = buckets.reduce((s, b) => s + b.count, 0)

    const sorted = buckets
        .slice()
        .sort((a, b) => a.bucket_start_seconds - b.bucket_start_seconds)

    const maxSeconds = sorted[sorted.length - 1]?.bucket_end_seconds ?? 0
    const fmt = makeFmt(maxSeconds)

    const cdfData = (() => {
        let running = 0
        return sorted.map((b) => {
            running += b.count
            return {
                t:     b.bucket_end_seconds,
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

            <CardContent className="pt-0">
                {isEmpty ? (
                    <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
                        No completions recorded yet
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-56 w-full">
                        <AreaChart
                            data={cdfData}
                            margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="cdfGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="var(--chart-1)" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="4 4"
                                stroke="hsl(var(--border))"
                                strokeOpacity={0.5}
                            />

                            {/* 50% guide */}
                            <ReferenceLine
                                y={50}
                                stroke="hsl(var(--muted-foreground))"
                                strokeDasharray="3 4"
                                strokeWidth={1}
                                strokeOpacity={0.35}
                            />

                            <XAxis
                                dataKey="t"
                                type="number"
                                scale="linear"
                                domain={[xMin, xMax]}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                minTickGap={56}
                                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={fmt}
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
                                    // How many players finished in this bucket specifically
                                    const bucketPct = total > 0
                                        ? ((d.count / total) * 100).toFixed(1)
                                        : '0'
                                    return (
                                        <div className="rounded-lg border bg-card shadow-lg text-xs px-3 py-2.5 min-w-[186px]">
                                            <p className="font-semibold text-[13px] mb-2">
                                                Within {fmt(d.end)}
                                            </p>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between gap-8">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-2 w-2 rounded-full" style={{ background: 'var(--chart-1)' }} />
                                                        <span className="text-muted-foreground">Finished</span>
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
                                                    <span className="text-muted-foreground">Finished between {fmt(d.start)}–{fmt(d.end)}</span>
                                                    <span className="font-semibold tabular-nums">
                                                        {d.count} <span className="text-muted-foreground font-normal">({bucketPct}%)</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }}
                            />

                            {avg != null && (
                                <ReferenceLine
                                    x={avg}
                                    stroke={AVG_COLOR}
                                    strokeWidth={1.5}
                                    strokeDasharray="5 3"
                                    label={{
                                        value: `Avg ${fmt(avg)}`,
                                        position: 'insideTopLeft',
                                        fontSize: 9,
                                        fill: AVG_COLOR,
                                        dy: -10,
                                    }}
                                />
                            )}

                            {median != null && (
                                <ReferenceLine
                                    x={median}
                                    stroke={MEDIAN_COLOR}
                                    strokeWidth={1.5}
                                    strokeDasharray="5 3"
                                    label={{
                                        value: `Med ${fmt(median)}`,
                                        position: 'insideTopRight',
                                        fontSize: 9,
                                        fill: MEDIAN_COLOR,
                                        dy: -10,
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
                )}
            </CardContent>
        </Card>
    )
}
