import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    ReferenceLine,
} from 'recharts'
import { QuestCompletionBucket } from '@/api/nexuscore/model'
import { formatDuration } from '@/lib/format'
import { ChartLineUpIcon } from '@phosphor-icons/react'

interface CompletionCDFProps {
    buckets: QuestCompletionBucket[]
    avg?: number | null
    median?: number | null
}

const chartConfig = {
    cdf: { label: '% of players', color: 'var(--chart-1)' },
} satisfies ChartConfig

const AVG_COLOR    = 'hsl(217 91% 60%)'
const MEDIAN_COLOR = 'hsl(258 90% 66%)'

export function CompletionCDF({ buckets, avg, median }: CompletionCDFProps) {
    const isEmpty = buckets.length === 0
    const total   = buckets.reduce((s, b) => s + b.count, 0)

    const cdfData = (() => {
        let running = 0
        return buckets
            .slice()
            .sort((a, b) => a.bucket_start_seconds - b.bucket_start_seconds)
            .map((b) => {
                running += b.count
                return {
                    t:                   b.bucket_end_seconds,
                    cdf:                 total > 0 ? parseFloat(((running / total) * 100).toFixed(1)) : 0,
                    raw:                 running,
                    bucket_start_seconds: b.bucket_start_seconds,
                    bucket_end_seconds:   b.bucket_end_seconds,
                    count:               b.count,
                }
            })
    })()

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <ChartLineUpIcon className="h-4 w-4 text-muted-foreground" />
                            Completion Speed
                        </CardTitle>
                        <CardDescription>
                            {isEmpty
                                ? 'No completions yet'
                                : `How quickly ${total.toLocaleString()} player${total !== 1 ? 's' : ''} finished — cumulative`}
                        </CardDescription>
                    </div>

                    {!isEmpty && (avg != null || median != null) && (
                        <div className="flex items-center gap-3 shrink-0 pt-0.5">
                            {avg != null && (
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3 w-0 border-l-2 border-dashed" style={{ borderColor: AVG_COLOR, minHeight: 12 }} />
                                    <span className="text-[10px] text-muted-foreground">
                                        Avg <span className="text-foreground font-medium">{formatDuration(avg)}</span>
                                    </span>
                                </div>
                            )}
                            {median != null && (
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3 w-0 border-l-2 border-dashed" style={{ borderColor: MEDIAN_COLOR, minHeight: 12 }} />
                                    <span className="text-[10px] text-muted-foreground">
                                        Median <span className="text-foreground font-medium">{formatDuration(median)}</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                {isEmpty ? (
                    <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                        No completions recorded yet
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-52 w-full">
                        <AreaChart data={cdfData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="cdfGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="var(--chart-1)" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} strokeDasharray="5 5" />

                            {/* 50% guide line */}
                            <ReferenceLine
                                y={50}
                                stroke="hsl(var(--border))"
                                strokeDasharray="3 3"
                                strokeWidth={1}
                            />

                            <XAxis
                                dataKey="t"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                minTickGap={44}
                                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(v) => formatDuration(v)}
                            />
                            <YAxis
                                domain={[0, 100]}
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tickCount={5}
                                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(v) => `${v}%`}
                            />

                            {({ active, payload }: any) => {
                                if (!active || !payload?.length) return null
                                const d = payload[0].payload as typeof cdfData[0]
                                const intervalLabel = `${formatDuration(d.bucket_start_seconds)} – ${formatDuration(d.bucket_end_seconds)}`
                                return (
                                    <div className="rounded-md border bg-card p-2.5 shadow-md text-xs min-w-[170px]">
                                        <p className="font-semibold mb-1.5">Within {formatDuration(d.bucket_end_seconds)}</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-2 w-2 rounded-full bg-[var(--chart-1)]" />
                                                    <span className="text-muted-foreground">Finished</span>
                                                </div>
                                                <span className="font-bold tabular-nums text-[var(--chart-1)]">{d.cdf}%</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground pl-3.5">Players</span>
                                                <span className="font-semibold tabular-nums">{d.raw.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="mt-1.5 pt-1.5 border-t border-border/50 text-muted-foreground">
                                            +{d.count.toLocaleString()} finished between {intervalLabel}
                                        </div>
                                    </div>
                                )
                            }}

                            {avg != null && (
                                <ReferenceLine
                                    x={avg}
                                    stroke={AVG_COLOR}
                                    strokeWidth={1.5}
                                    strokeDasharray="4 3"
                                    label={{ value: 'Avg', position: 'insideTopLeft', fontSize: 9, fill: AVG_COLOR, dy: -2 }}
                                />
                            )}
                            {median != null && (
                                <ReferenceLine
                                    x={median}
                                    stroke={MEDIAN_COLOR}
                                    strokeWidth={1.5}
                                    strokeDasharray="4 3"
                                    label={{ value: 'Med', position: 'insideTopRight', fontSize: 9, fill: MEDIAN_COLOR, dy: -2 }}
                                />
                            )}

                            <Area
                                dataKey="cdf"
                                type="monotone"
                                stroke="var(--chart-1)"
                                strokeWidth={2}
                                fill="url(#cdfGrad)"
                                dot={false}
                                activeDot={{ r: 3.5, strokeWidth: 0, fill: 'var(--chart-1)' }}
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
