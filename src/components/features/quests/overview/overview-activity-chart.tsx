import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatDate } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { QuestsOverviewDay } from "@/types/quests-overview.d.ts";

// Same colours as the per-quest daily activity chart so accepts/completions read the same everywhere.
const chartConfig = {
    accepts: { label: "Accepts", color: "var(--chart-1)" },
    completions: { label: "Completions", color: "var(--chart-3)" },
} satisfies ChartConfig;

const parseDay = (value: string) => new Date(`${value}T00:00:00`);

interface OverviewActivityChartProps {
    days: QuestsOverviewDay[];
    windowDays: number;
    trackedQuests: number;
}

/** Accepts vs completions per day, summed across every tracked quest. */
export function OverviewActivityChart({ days, windowDays, trackedQuests }: OverviewActivityChartProps) {
    const isEmpty = days.every((day) => day.accepts === 0 && day.completions === 0);

    return (
        <Card data-slot="overview-activity" className="gap-3 py-4 shadow-none">
            <CardHeader className="px-4">
                <CardTitle className="text-sm font-semibold">Player activity</CardTitle>
                <CardDescription className="text-xs">
                    Last {windowDays} days across {trackedQuests.toLocaleString()} live and recent quest
                    {trackedQuests === 1 ? "" : "s"}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
                {isEmpty ? (
                    <div className="flex h-52 items-center justify-center text-sm font-light text-muted-foreground">
                        No accepts or completions in the last {windowDays} days.
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-52 w-full">
                        <AreaChart data={days} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                            <defs>
                                {(Object.keys(chartConfig) as (keyof typeof chartConfig)[]).map((key) => (
                                    <linearGradient key={key} id={`overview-fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={`var(--color-${key})`} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={`var(--color-${key})`} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="4 4" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                minTickGap={48}
                                tickFormatter={(value: string) => formatDate(parseDay(value), "MMM d")}
                            />
                            <YAxis
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={4}
                                tickCount={4}
                                width={32}
                                allowDecimals={false}
                            />
                            <ChartTooltip
                                cursor={{ strokeDasharray: "3 3" }}
                                content={
                                    <ChartTooltipContent
                                        indicator="line"
                                        labelFormatter={(value: string) => formatDate(parseDay(value), "EEE, MMM d")}
                                    />
                                }
                            />
                            <ChartLegend verticalAlign="top" content={<ChartLegendContent className="justify-start pb-3 pt-0" />} />
                            <Area
                                dataKey="accepts"
                                type="monotone"
                                stroke="var(--color-accepts)"
                                strokeWidth={2}
                                isAnimationActive={false}
                                fill="url(#overview-fill-accepts)"
                                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--background)" }}
                            />
                            <Area
                                dataKey="completions"
                                type="monotone"
                                stroke="var(--color-completions)"
                                strokeWidth={2}
                                isAnimationActive={false}
                                fill="url(#overview-fill-completions)"
                                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--background)" }}
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}

export function OverviewActivityChartSkeleton() {
    return (
        <Card className="gap-3 py-4 shadow-none">
            <CardHeader className="px-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent className="px-4">
                <Skeleton className="h-52 w-full" />
            </CardContent>
        </Card>
    );
}
