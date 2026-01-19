import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig, ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {GuildPlaytime} from "@/types/guild-playtime";
import {formatDate} from "date-fns";

const chartConfig = {
    weekly: {
        label: "Playtime",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig;

export function WeeklyPlaytimeAreaChart({className, chartData}: {className?: string, chartData?: GuildPlaytime}) {
    return (
        <Card className={cn('p-3 border-0', className)}>
            <CardHeader className={'px-0'}>
                <CardTitle>
                    Weekly Playtime
                    <Badge
                        variant="outline"
                        className="text-green-500 bg-green-500/10 border-none ml-2"
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span>5.2%</span>
                    </Badge>
                </CardTitle>

                <CardDescription>
                    Showing last 7 weeks
                </CardDescription>
            </CardHeader>

            <CardContent className={'p-0'}>
                <ChartContainer className={'h-50 w-full'} config={chartConfig}>
                    <AreaChart accessibilityLayer data={chartData?.weekly_playtime}>
                        <CartesianGrid vertical={false} strokeDasharray="5 5" />

                        <XAxis
                            reversed={true}
                            dataKey="week"
                            tickLine={{ stroke: '#222222' }}
                            axisLine={false}
                            tickMargin={8}
                            interval="preserveStartEnd"
                            tickFormatter={(value) => formatDate(new Date(value), "'wk'w")}
                        />

                        <ChartTooltip cursor={false} content={<ChartTooltipContent/>} />

                        <defs>
                            <DottedBackgroundPattern config={chartConfig} />
                        </defs>

                        <Area
                            dataKey="total"
                            type="monotone"
                            fill="url(#dotted-background-pattern-weekly)"
                            fillOpacity={0.4}
                            stroke="var(--color-weekly)"
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
