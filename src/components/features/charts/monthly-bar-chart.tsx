import { TrendingUp } from "lucide-react";
import {Bar, BarChart, XAxis} from "recharts";
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
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {GuildPlaytime} from "@/types/guild-playtime";
import {cn} from "@/lib/utils.ts";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
    },
    predicted: {
        label: "Predicted",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

interface MonthlyDataWithPrediction {
    month: string
    total: number
    predicted?: number
}

export function MonthlyBarChart({className, chartData}: {className?: string, chartData?: GuildPlaytime}) {
    const predictedTotal = chartData?.daily_playtime.slice(0, 30)?.reduce((sum, day) => sum + day.total, 0) || 0;

    const monthlyData: MonthlyDataWithPrediction[] = chartData?.monthly_playtime?.slice() || [];

    if (monthlyData.length > 0) {
        monthlyData[0] = { ...monthlyData[0], predicted: predictedTotal - monthlyData[0].total };
    }

    return (
        <Card className={cn('p-3 border-0', className)}>
            <CardHeader className={'px-0'}>
                <CardTitle>
                    Monthly Playtime
                    <Badge
                        variant="outline"
                        className="text-green-500 bg-green-500/10 border-none ml-2"
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span>5.2%</span>
                    </Badge>
                </CardTitle>

                <CardDescription>
                    Showing last 13 months
                </CardDescription>
            </CardHeader>

            <CardContent className={'p-0'}>
                <ChartContainer className={'h-50 w-full'} config={chartConfig}>
                    <BarChart accessibilityLayer data={monthlyData}>
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="85%"
                            fill="url(#default-pattern-dots)"
                        />
                        <defs>
                            <DottedBackgroundPattern />
                        </defs>

                        <XAxis
                            reversed={true}
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />

                        <Bar
                            stackId={'a'}
                            dataKey="total"
                            fill="var(--color-desktop)"
                            radius={4}
                        />

                        <Bar
                            stackId={'a'}
                            dataKey="predicted"
                            shape={<CustomHatchedBar/>}
                            fill="var(--color-predicted)"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

const CustomHatchedBar = (props: React.SVGProps<SVGRectElement>) => {
    const { fill, x, y, width, height } = props;

    return (
        <>
            <rect
                rx={4}
                x={x}
                y={y}
                width={width}
                height={height}
                stroke="none"
                fill="url(#hatched-bar-pattern)"
            />
            <defs>
                <pattern
                    id="hatched-bar-pattern"
                    x="0"
                    y="0"
                    width="8"
                    height="5"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(-45)"
                >
                    <rect width="10" height="10" opacity={0.5} fill={fill}></rect>
                    <rect width="1" height="10" fill={fill}></rect>
                </pattern>
            </defs>
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
