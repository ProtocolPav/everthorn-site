import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {TrendingDownIcon, TrendingUpIcon} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {formatDate} from "date-fns";
import {GuildDailyPlaytime, GuildPlaytimeAnalysis} from "@/api/nexuscore/model";
import {useMemo} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

const chartConfig = {
    daily: {
        label: "Playtime",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

function formatPlaytime(totalSeconds: number | null | undefined, precision: "full" | "hours" = "full"): string {
    if (totalSeconds == null) return "—";

    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (precision === "hours") {
        return `${hours}h`;
    }

    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
}

export function DailyPlaytimeAreaChart({className, chartData}: {className?: string, chartData?: GuildPlaytimeAnalysis}) {
    const reversed_data = chartData?.daily_playtime?.slice().reverse() || [];
    const chart_data = reversed_data.slice(7, 14)

    const weekTrend = useMemo(() => {
        if (reversed_data.length < 14) return null;
        const recent = reversed_data.slice(-7).reduce((s, d) => s + (d.total ?? 0), 0);
        const prior  = reversed_data.slice(-14, -7).reduce((s, d) => s + (d.total ?? 0), 0);
        if (prior === 0) return null;
        return ((recent - prior) / prior) * 100;
    }, [reversed_data]);

    const isUp = (weekTrend ?? 0) >= 0;

    const yAxisWidth = useMemo(() => {
        if (!reversed_data.length) return 40;

        const maxValue = Math.max(...reversed_data.map(d => d.total ?? 0));
        const maxLabel = formatPlaytime(maxValue, "hours");

        // Measure using a canvas context
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return 40;

        ctx.font = "11px sans-serif";
        const width = ctx.measureText(maxLabel).width;

        return Math.ceil(width) + 2
    }, [reversed_data]);

    return (
        <Card className={cn('p-3 border-0', className)}>
            <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2">
                    Daily Playtime
                    {weekTrend !== null && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "border-none font-medium gap-1 cursor-default",
                                        isUp
                                            ? "text-green-500 bg-green-500/10"
                                            : "text-red-500 bg-red-500/10"
                                    )}
                                >
                                    {isUp
                                        ? <TrendingUpIcon className="h-3.5 w-3.5" />
                                        : <TrendingDownIcon className="h-3.5 w-3.5" />
                                    }
                                    <span>{Math.abs(weekTrend).toFixed(1)}%</span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent side={'bottom'}>
                                <p className={'text-xs'}>
                                    {isUp ? "Up" : "Down"} {Math.abs(weekTrend).toFixed(1)}% vs. the previous 7 days
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </CardTitle>

                <CardDescription>
                    Last {chart_data.length} days
                </CardDescription>
            </CardHeader>

            <CardContent className={'p-0'}>
                <ChartContainer className={'h-50 w-full'} config={chartConfig}>
                    <AreaChart accessibilityLayer data={chart_data}>
                        <CartesianGrid vertical={false} strokeDasharray="5 5" />

                        <XAxis
                            dataKey="day"
                            tickLine={{ stroke: '#222222' }}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={30}
                            interval="preserveStartEnd"
                            tickFormatter={(value) => formatDate(new Date(value), "do MMM")}
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
                            cursor={{ fill: 'var(--muted)', opacity: 0.7 }}
                            content={({active, payload, label}) => {
                                if (!active || !payload || payload.length === 0) return null;

                                const data: GuildDailyPlaytime = payload[0].payload;

                                return (
                                    <div
                                        className="bg-background/70 backdrop-blur-sm border border-border rounded-md shadow-lg p-3 pt-0 min-w-[200px]">
                                        {/* Compact header with full date */}
                                        <div className="pb-2 mb-2 border-b border-border/50">
                                            <p className="font-semibold text-foreground text-xs">
                                                {new Date(label).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        {/* Compact metrics with vertical bars */}
                                        <div className="space-y-2">
                                            {/* Total Playtime */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-1 h-4 rounded-sm"
                                                        style={{backgroundColor: chartConfig.daily.color}}
                                                    />
                                                    <span className="text-xs text-muted-foreground">Total Playtime</span>
                                                </div>
                                                <span
                                                    className="font-semibold text-xs"
                                                    style={{color: chartConfig.daily.color}}
                                                >
                                            {formatPlaytime(data.total!)}
                                        </span>
                                            </div>

                                            {/* Players */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-4 rounded-sm bg-emerald-500"/>
                                                    <span className="text-xs text-muted-foreground">Players</span>
                                                </div>
                                                <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                                            {data.unique_players.toLocaleString()}
                                        </span>
                                            </div>

                                            {/* Sessions */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-4 rounded-sm bg-violet-500"/>
                                                    <span className="text-xs text-muted-foreground">Sessions</span>
                                                </div>
                                                <span className="font-semibold text-xs text-violet-600 dark:text-violet-400">
                                            {data.total_sessions.toLocaleString()}
                                        </span>
                                            </div>

                                            {/* Average per session */}
                                            {data.total_sessions > 0 && (
                                                <div className="flex items-center justify-between pt-1 border-t border-border/30">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1 h-4 rounded-sm bg-amber-500"/>
                                                        <span className="text-xs text-muted-foreground">Avg. per session</span>
                                                    </div>
                                                    <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">
                                                {formatPlaytime(data.average_playtime_per_session!)}
                                            </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        />

                        <defs>
                            <DottedBackgroundPattern config={chartConfig} />
                        </defs>

                        <Area
                            dataKey="total"
                            type="monotone"
                            fill="url(#dotted-background-pattern-daily)"
                            fillOpacity={0.4}
                            stroke="var(--color-daily)"
                            stackId="a"
                            strokeWidth={0.8}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

const DottedBackgroundPattern = ({ config }: { config: ChartConfig }) => {
    const items = Object.fromEntries(
        Object.entries(config).map(([key, value]) => [key, value.color])
    );
    return (
        <>
            {Object.entries(items).map(([key, value]) => (
                <pattern
                    key={key}
                    id={`dotted-background-pattern-${key}`}
                    x="0"
                    y="0"
                    width="7"
                    height="7"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="5" cy="5" r="1.5" fill={value} opacity={0.5}></circle>
                </pattern>
            ))}
        </>
    );
};
