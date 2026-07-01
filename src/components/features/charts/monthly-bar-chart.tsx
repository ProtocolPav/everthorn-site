import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { formatDate } from "date-fns";
import {GuildPlaytimeAnalysis, GuildMonthlyPlaytime, GuildDailyPlaytime} from "@/api/nexuscore/model";
import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {formatPlaytime} from "@/lib/format.ts";

const chartConfig = {
    total: {
        label: "Total",
        color: "var(--chart-2)",
    },
    predicted: {
        label: "Predicted",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig;

interface MonthlyDataWithPrediction extends GuildMonthlyPlaytime {
    predicted?: number;
}

function buildMonthlyDataWithPrediction(
    monthlyPlaytime: GuildMonthlyPlaytime[],
    dailyPlaytime: GuildDailyPlaytime[],
): MonthlyDataWithPrediction[] {
    const data: MonthlyDataWithPrediction[] = monthlyPlaytime.slice().reverse();
    if (data.length === 0) return data;

    const now = new Date();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = now.getDate();
    const daysRemaining = Math.max(0, totalDaysInMonth - daysElapsed);

    if (daysRemaining === 0) return data;

    // Signal 1: Recent daily average (last 7 days) — captures current momentum
    const recentDays = dailyPlaytime.slice(0, 7);
    const recentDailyAvg =
        recentDays.length > 0
            ? recentDays.reduce((s, d) => s + (d.total ?? 0), 0) / recentDays.length
            : 0;

    // Signal 2: This month's daily run rate so far — what the current month is actually pacing at
    const currentMonthTotal = data[data.length - 1]?.total ?? 0;
    const currentMonthDailyRate = daysElapsed > 0 ? currentMonthTotal / daysElapsed : 0;

    // Signal 3: Same month last year (if available) — captures seasonal patterns
    // monthly_playtime is ordered newest first, so index 12 = same month last year
    const sameMonthLastYear = monthlyPlaytime[12]?.total ?? null;
    const sameMonthLastYearDailyRate =
        sameMonthLastYear !== null ? sameMonthLastYear / totalDaysInMonth : null;

    // Weighted blend — recent momentum matters most, current pace second, seasonality third
    // If we're early in the month (< 7 days), trust recent daily avg more
    // If we're late in the month (> 20 days), trust current month rate more
    const monthProgress = daysElapsed / totalDaysInMonth;
    const recentWeight    = Math.max(0.2, 0.6 - monthProgress * 0.4); // 0.6 → 0.2 as month progresses
    const currentWeight   = Math.min(0.6, 0.2 + monthProgress * 0.4); // 0.2 → 0.6 as month progresses
    const seasonalWeight  = sameMonthLastYearDailyRate !== null ? 0.2 : 0;

    const totalWeight = recentWeight + currentWeight + seasonalWeight;

    const blendedDailyRate =
        (recentDailyAvg * recentWeight +
            currentMonthDailyRate * currentWeight +
            (sameMonthLastYearDailyRate ?? 0) * seasonalWeight) / totalWeight;

    const predicted = blendedDailyRate * daysRemaining;

    const lastIndex = data.length - 1;
    data[lastIndex] = {
        ...data[lastIndex],
        predicted: Math.max(0, predicted),
    };

    return data;
}

export function MonthlyPlaytimeBarChart({className, chartData}: {className?: string, chartData?: GuildPlaytimeAnalysis}) {
    const monthlyData = useMemo(
        () => buildMonthlyDataWithPrediction(
            chartData?.monthly_playtime ?? [],
            chartData?.daily_playtime ?? [],
        ),
        [chartData],
    );

    // Trend: last 3 months avg vs prior 3 months avg
    const monthTrend = useMemo(() => {
        const data = chartData?.monthly_playtime;
        if (!data || data.length < 6) return null;

        const recent = data.slice(0, 3);
        const prior  = data.slice(3, 6);

        const recentAvg = recent.reduce((s, d) => s + (d.total ?? 0), 0) / recent.length;
        const priorAvg  = prior.reduce((s, d) => s + (d.total ?? 0), 0) / prior.length;

        if (priorAvg === 0) return null;

        return {
            percent:   ((recentAvg - priorAvg) / priorAvg) * 100,
            diff:      recentAvg - priorAvg,
            recentAvg,
            priorAvg,
            maxAvg:    Math.max(recentAvg, priorAvg),
        };
    }, [chartData]);

    const isUp = (monthTrend?.percent ?? 0) >= 0;

    const yAxisWidth = useMemo(() => {
        if (!monthlyData.length) return 40;
        const maxValue = Math.max(...monthlyData.map(d => (d.total ?? 0) + (d.predicted ?? 0)));
        const maxLabel = formatPlaytime(maxValue, "hours");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return 40;
        ctx.font = "11px sans-serif";
        return Math.ceil(ctx.measureText(maxLabel).width) + 2;
    }, [monthlyData]);

    return (
        <Card className={cn('p-2 border-0', className)}>
            <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2">
                    Monthly Playtime
                    {monthTrend !== null && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "border-none font-medium gap-1 cursor-default",
                                        isUp ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
                                    )}
                                >
                                    {isUp
                                        ? <TrendingUpIcon className="h-3.5 w-3.5" />
                                        : <TrendingDownIcon className="h-3.5 w-3.5" />
                                    }
                                    <span>{Math.abs(monthTrend.percent).toFixed(1)}%</span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="start" className="p-1.5 max-w-[180px]">
                                <div className="flex flex-col gap-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                            <div>Previous 3mo avg</div>
                                            <div className="tabular-nums">{formatPlaytime(monthTrend.priorAvg)}</div>
                                        </div>
                                        <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-muted-foreground/30 transition-all duration-500"
                                                style={{ width: `${(monthTrend.priorAvg / monthTrend.maxAvg) * 100}%` }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                            <div>Current 3mo avg</div>
                                            <div className={cn("tabular-nums font-medium", isUp ? "text-green-500" : "text-red-500")}>
                                                {formatPlaytime(monthTrend.recentAvg)}
                                            </div>
                                        </div>
                                        <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-500", isUp ? "bg-green-500" : "bg-red-500")}
                                                style={{ width: `${(monthTrend.recentAvg / monthTrend.maxAvg) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-muted-foreground leading-relaxed border-t border-border/50 pt-2">
                                        <span className={cn("font-medium inline-flex items-center gap-0.5", isUp ? "text-green-500" : "text-red-500")}>
                                            {isUp ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />}
                                            {formatPlaytime(Math.abs(monthTrend.diff))} / month
                                        </span>
                                        {" "}vs. last 3 months
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </CardTitle>
                <CardDescription>Last {monthlyData.length} months</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <ChartContainer className="h-50 w-full" config={chartConfig}>
                    <BarChart accessibilityLayer data={monthlyData} margin={{ right: 16 }}>
                        <defs>
                            <DottedBackgroundPattern />
                        </defs>

                        <rect x="0" y="0" width="100%" height="85%" fill="url(#default-pattern-dots)" />

                        <CartesianGrid vertical={false} strokeDasharray="5 5" />

                        <XAxis
                            dataKey="month"
                            tickLine={{ stroke: '#222222' }}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={30}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                            tickFormatter={(value) => formatDate(new Date(value), "MMM Y")}
                        />

                        <YAxis
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={0}
                            width={yAxisWidth}
                            tickCount={4}
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                            tickFormatter={(v) => formatPlaytime(v, "hours")}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload, label }) => {
                                if (!active || !payload || payload.length === 0) return null;
                                const data: MonthlyDataWithPrediction = payload[0].payload;

                                return (
                                    <div className="p-2 bg-background/35 backdrop-blur-sm border rounded-md shadow-xl">
                                        <p className="font-semibold text-foreground text-xs">
                                            {formatDate(new Date(label), "MMMM yyyy")}
                                        </p>

                                        <Separator className="my-1" />

                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-4 rounded-sm" style={{ backgroundColor: chartConfig.total.color }} />
                                                    <div className="text-xs text-muted-foreground">Total Playtime</div>
                                                </div>
                                                <div className="font-semibold text-xs" style={{ color: chartConfig.total.color }}>
                                                    {formatPlaytime(data.total, "hours")}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-4 rounded-sm bg-purple-500" />
                                                    <div className="text-xs text-muted-foreground">Players</div>
                                                </div>
                                                <div className="font-semibold text-xs text-purple-600 dark:text-purple-400">
                                                    {data.unique_players.toLocaleString()}
                                                </div>
                                            </div>

                                            {data.predicted != null && data.predicted > 0 && (
                                                <>
                                                    <Separator />
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1 h-4 rounded-sm" style={{ backgroundColor: chartConfig.predicted.color }} />
                                                            <div className="text-xs text-muted-foreground">Predicted</div>
                                                        </div>
                                                        <div className="font-semibold text-xs" style={{ color: chartConfig.predicted.color }}>
                                                            {formatPlaytime(data.predicted, "hours")}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        />

                        <Bar
                            stackId="a"
                            dataKey="total"
                            fill="var(--color-total)"
                            radius={[4, 4, 0, 0]}
                        />

                        <Bar
                            stackId="a"
                            dataKey="predicted"
                            shape={<CustomHatchedBar />}
                            fill="var(--color-predicted)"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

const CustomHatchedBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const patternId = `hatch-${x}`;

    return (
        <>
            <defs>
                <pattern
                    id={patternId}
                    width="6" height="6"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                >
                    <line x1="0" y1="0" x2="0" y2="6" stroke={fill} strokeWidth="2" strokeOpacity="0.4" />
                </pattern>
            </defs>
            <rect rx={4} x={x} y={y} width={width} height={height} fill={`url(#${patternId})`} />
            <rect rx={4} x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.05} />
        </>
    );
};

const DottedBackgroundPattern = () => {
    return (
        <pattern
            id="default-pattern-dots"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
        >
            <circle
                className="dark:text-muted/40 text-muted"
                cx="2"
                cy="2"
                r="1"
                fill="currentColor"
            />
        </pattern>
    );
};
