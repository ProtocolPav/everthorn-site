import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Activity, Clock, LucideComputer, Server, Users} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {formatPlaytime} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {GuildPlaytime, OnlineUser, ServerStatus} from "@/types/admin";
import {ChartConfig, ChartContainer} from "@/components/ui/chart";
import { Area, AreaChart } from "recharts";
import {Player} from "@/hooks/use-players";

interface Props {
    playtime?: GuildPlaytime;
    playtimeLoading: boolean;
    players: Player[];
    playersLoading: boolean;
    status?: ServerStatus;
    statusLoading: boolean;
}

const chartConfig = {
    playtime: {
        label: "Playtime",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export default function CardOverview({
                                         playtime,
                                         playtimeLoading,
                                         playersLoading,
                                         players,
                                         statusLoading,
                                         status
                                     }: Props) {
    const chartData = (() => {
        const monthlyData = playtime?.monthly_playtime || [];
        let cumulative = 0;
        return monthlyData.map(month => {
            cumulative += month.total;
            return {
                month: month.month,
                cumulative: cumulative
            };
        });
    })();

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {/* Total Playtime Card with Chart Background */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 h-20">
                {/* Background Chart */}
                <div className="absolute inset-0 opacity-30">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                            <Area
                                dataKey="cumulative"
                                type="natural"
                                fill="var(--chart-1)"
                                fillOpacity={0.3}
                                stroke="var(--chart-1)"
                                strokeWidth={1}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>

                {/* Content */}
                <div className="relative z-10 p-3 h-full flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Total Playtime
                        </p>
                        <div className="text-lg font-bold leading-none">
                            {playtimeLoading ? (
                                <Skeleton className="h-5 w-16" />
                            ) : (
                                formatPlaytime(playtime?.total_playtime || 0)
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            That's {Math.round((playtime?.total_playtime || 0) / 3600)} hours!
                        </p>
                    </div>
                    <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 ml-2">
                        <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </Card>

            {/* Unique Players Card */}
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 h-20">
                <div className="p-3 h-full flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Players
                        </p>
                        <div className="text-lg font-bold leading-none">
                            {playtimeLoading ? (
                                <Skeleton className="h-5 w-12" />
                            ) : (
                                playtime?.total_unique_players?.toLocaleString() || '0'
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Since 2021
                        </p>
                    </div>
                    <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 ml-2">
                        <Users className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                </div>
            </Card>

            {/* Online Players Card */}
            <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 h-20">
                <div className="p-3 h-full flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Online
                        </p>
                        <div className="text-lg font-bold leading-none">
                            {playersLoading ? (
                                <Skeleton className="h-5 w-8" />
                            ) : (
                                players?.length || '0'
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Active
                        </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="p-1.5 rounded-md bg-orange-100 dark:bg-orange-900/30">
                            <Activity className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Server Status Card */}
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 h-20">
                <div className="p-3 h-full flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Server
                        </p>
                        <div className="text-lg font-bold leading-none">
                            {statusLoading ? (
                                <Skeleton className="h-5 w-16" />
                            ) : (
                                status?.server_online ? 'Running' : 'Down'
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {status?.uptime ? `${status.uptime.split(' ')[0]} days uptime` : 'No uptime data'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                        {statusLoading ? (
                            <Skeleton className="h-1.5 w-1.5 rounded-full" />
                        ) : (
                            <div className={`w-1.5 h-1.5 rounded-full ${
                                status?.server_online
                                    ? 'bg-green-500 animate-pulse'
                                    : 'bg-red-500 animate-pulse'
                            }`} />
                        )}
                        <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
                            <LucideComputer className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </Card>

        </div>
    )
}
