import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Cell, ReferenceLine } from 'recharts'
import { QuestCompletionBucket, QuestStatisticsOut } from '@/api/nexuscore/model'
import { formatDuration } from '@/lib/format'
import { ChartBarIcon } from '@phosphor-icons/react'

interface CompletionHistogramProps {
    buckets: QuestCompletionBucket[]
    avg?: number | null
    median?: number | null
}

const chartConfig = {
    count: { label: 'Completions', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function CompletionHistogram({ buckets, avg, median }: CompletionHistogramProps) {
    const isEmpty = buckets.length === 0
    const maxCount = isEmpty ? 0 : Math.max(...buckets.map(b => b.count))
    const total = buckets.reduce((s, b) => s + b.count, 0)

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
                            Completion Time Distribution
                        </CardTitle>
                        <CardDescription>
                            {isEmpty ? 'No completions yet' : `${total.toLocaleString()} total completion${total !== 1 ? 's' : ''}`}
                        </CardDescription>
                    </div>
                    {/* Avg / Median legend */}
                    {!isEmpty && (avg != null || median != null) && (
                        <div className="flex items-center gap-3 shrink-0 pt-0.5">
                            {avg != null && (
                                <div className="flex items-center gap-1">
                                    <div className="h-2.5 w-px bg-blue-500" style={{ minHeight: 10 }} />
                                    <span className="text-[10px] text-muted-foreground">Avg <span className="text-foreground font-medium">{formatDuration(avg)}</span></span>
                                </div>
                            )}
                            {median != null && (
                                <div className="flex items-center gap-1">
                                    <div className="h-2.5 w-px bg-violet-500" style={{ minHeight: 10 }} />
                                    <span className="text-[10px] text-muted-foreground">Median <span className="text-foreground font-medium">{formatDuration(median)}</span></span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                {isEmpty ? (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                        No completions recorded yet
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-48 w-full">
                        <BarChart
                            data={buckets}
                            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="5 5" />
                            <XAxis
                                dataKey="bucket_start_seconds"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                minTickGap={40}
                                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(v) => formatDuration(v)}
                            />
                            <YAxis
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tickCount={4}
                                allowDecimals={false}
                                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null
                                    const b: QuestCompletionBucket = payload[0].payload
                                    return (
                                        <div className="rounded-md border bg-card p-2.5 shadow-md text-xs">
                                            <p className="font-semibold mb-1">
                                                {formatDuration(b.bucket_start_seconds)} – {formatDuration(b.bucket_end_seconds)}
                                            </p>
                                            <p className="text-muted-foreground">
                                                <span className="font-semibold text-foreground">{b.count.toLocaleString()}</span> completion{b.count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    )
                                }}
                            />
                            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                                {buckets.map((b, i) => (
                                    <Cell
                                        key={i}
                                        fill={b.count === maxCount ? 'var(--chart-1)' : 'var(--chart-2)'}
                                        fillOpacity={0.8 + (b.count / maxCount) * 0.2}
                                    />
                                ))}
                            </Bar>

                            {/* Average reference line */}
                            {avg != null && (
                                <ReferenceLine
                                    x={avg}
                                    stroke="var(--color-blue-500, #3b82f6)"
                                    strokeWidth={1.5}
                                    strokeDasharray="4 3"
                                    label={{
                                        value: 'Avg',
                                        position: 'insideTopLeft',
                                        fontSize: 9,
                                        fill: '#3b82f6',
                                        dy: -2,
                                    }}
                                />
                            )}

                            {/* Median reference line */}
                            {median != null && (
                                <ReferenceLine
                                    x={median}
                                    stroke="var(--color-violet-500, #8b5cf6)"
                                    strokeWidth={1.5}
                                    strokeDasharray="4 3"
                                    label={{
                                        value: 'Med',
                                        position: 'insideTopRight',
                                        fontSize: 9,
                                        fill: '#8b5cf6',
                                        dy: -2,
                                    }}
                                />
                            )}
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
