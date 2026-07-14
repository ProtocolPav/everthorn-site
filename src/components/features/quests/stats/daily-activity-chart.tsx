import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart'
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts'
import { formatDate } from 'date-fns'
import { DailyActivityEntry } from '@/api/nexuscore/model'
import { CalendarBlankIcon } from '@phosphor-icons/react'

interface DailyActivityChartProps {
    data: DailyActivityEntry[]
}

const chartConfig = {
    accepts:     { label: 'Accepts',     color: 'var(--chart-1)' },
    completions: { label: 'Completions', color: 'var(--chart-3)' },
    failures:    { label: 'Failures',    color: 'var(--chart-5)' },
} satisfies ChartConfig

export function DailyActivityChart({ data }: DailyActivityChartProps) {
    const isEmpty = data.length === 0

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarBlankIcon className="h-4 w-4 text-muted-foreground" />
                    Daily Activity
                </CardTitle>
                <CardDescription>
                    {isEmpty ? 'No activity recorded yet' : `${data.length} day${data.length !== 1 ? 's' : ''} of data`}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                {isEmpty ? (
                    <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                        No player activity yet
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-56 w-full">
                        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="5 5" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                minTickGap={40}
                                interval="preserveStartEnd"
                                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(v) => formatDate(new Date(v), 'MMM d')}
                            />
                            <YAxis
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={4}
                                tickCount={4}
                                allowDecimals={false}
                                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <ChartTooltip
                                content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null
                                    return (
                                        <div className="rounded-md border bg-card p-2.5 shadow-md text-xs min-w-[140px]">
                                            <p className="font-semibold mb-1.5">
                                                {formatDate(new Date(label), 'EEE, MMM d yyyy')}
                                            </p>
                                            {payload.map((p) => (
                                                <div key={p.dataKey} className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                                                        <span className="text-muted-foreground">{chartConfig[p.dataKey as keyof typeof chartConfig]?.label}</span>
                                                    </div>
                                                    <span className="font-semibold tabular-nums">{(p.value as number).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Line dataKey="accepts"     type="monotone" stroke="var(--chart-1)" strokeWidth={1.5} dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
                            <Line dataKey="completions" type="monotone" stroke="var(--chart-3)" strokeWidth={1.5} dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
                            <Line dataKey="failures"    type="monotone" stroke="var(--chart-5)" strokeWidth={1.5} dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
