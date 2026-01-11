import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import ServerDailyPlaytime from "@/components/features/charts/server-daily-playtime";
import {formatPlaytime} from "@/lib/utils";
import {GuildPlaytime, OnlineUser, ServerStatus} from "@/types/admin";
import ServerMonthlyPlaytime from "@/components/features/charts/server-monthly-playtime";
import {ClockCountdown, ChartBar, Minus, TrendUp, TrendDown, Calendar, Users, Info} from "@phosphor-icons/react";
import {Badge} from "@/components/ui/badge";
import ServerWeeklyPlaytime from "@/components/features/charts/server-weekly-playtime";
import OnlinePlayersChart from "@/components/features/charts/online-players";
import {Activity} from "lucide-react";
import OnlinePlayersList from "@/app/(admin)/admin/_components/dashboard/online-players";
import * as React from "react";
import {Player} from "@/hooks/use-players";

interface Props {
    playtime?: GuildPlaytime;
    playtimeLoading: boolean;
    players: Player[];
    playersLoading: boolean;
    status?: ServerStatus;
    statusLoading: boolean;
}

export default function Statistics({
   playtime,
   playtimeLoading,
   playersLoading,
   players,
   statusLoading,
   status
}: Props) {
    // Calculate trend percentage
    const calculateTrend = (data: Array<{month: string; total: number}>) => {
        if (data.length < 2) return null;

        const sortedData = [...data].sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
        const currentMonth = sortedData[sortedData.length - 1];
        const previousMonth = sortedData[sortedData.length - 2];

        if (!currentMonth || !previousMonth || previousMonth.total === 0) return null;

        const percentChange = ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100;
        return Math.round(percentChange);
    };

    const trendPercentage = calculateTrend(playtime?.monthly_playtime || []);

    const getTrendIcon = (percentage: number | null) => {
        if (percentage === null) return <Minus />;
        if (percentage > 0) return <TrendUp />;
        if (percentage < 0) return <TrendDown />;
        return <Minus />;
    };

    const getTrendVariant = (percentage: number | null) => {
        if (percentage === null) return "default";
        if (percentage > 0) return "info";
        if (percentage < 0) return "red";
        return "default";
    };

    // Generate fake data for the last 24 hours
    const generateFakeData = () => {
        const data = [];
        const now = new Date();

        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);

            // Simulate realistic player count patterns
            const hour = time.getHours();
            let baseCount;

            // Peak hours: 7-9 PM
            if (hour >= 19 && hour <= 21) {
                baseCount = 15 + Math.random() * 8;
            }
            // Evening hours: 6-11 PM
            else if (hour >= 18 && hour <= 23) {
                baseCount = 10 + Math.random() * 6;
            }
            // Afternoon: 2-6 PM
            else if (hour >= 14 && hour <= 18) {
                baseCount = 8 + Math.random() * 4;
            }
            // Late night/early morning: 12-8 AM
            else if (hour >= 0 && hour <= 8) {
                baseCount = 2 + Math.random() * 3;
            }
            // Morning/noon: 8 AM - 2 PM
            else {
                baseCount = 5 + Math.random() * 4;
            }

            data.push({
                time: time.toISOString(),
                players: Math.floor(baseCount),
                hour: time.getHours()
            });
        }

        return data;
    };

    const playerData = generateFakeData();
    const currentPlayers = playerData[playerData.length - 1]?.players || 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="lg:col-span-2 p-4 bg-card/40">
                <CardHeader className="px-0">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <ClockCountdown />
                                Monthly Playtime
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Compare monthly playtime and see trends
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={'outline'} className={'hidden lg:flex'}>
                                <ChartBar />
                                Showing last 12 months
                            </Badge>

                            {trendPercentage !== null && (
                                <Badge variant={getTrendVariant(trendPercentage)}>
                                    {getTrendIcon(trendPercentage)}
                                    {trendPercentage > 0 ? '+' : ''}{trendPercentage}%
                                    vs last month
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-0 grid gap-3">
                    <div className="h-70">
                        <ServerMonthlyPlaytime data={playtime?.monthly_playtime || []} />
                    </div>

                    {/* Enhanced footer with additional context */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-xs bg-chart-2" />
                                <span>Monthly Playtime</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-xs bg-chart-3 opacity-80" />
                                <span>Predictions</span>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground/70 flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                            Live data
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="p-4 bg-card/40">
                <CardHeader className="px-0">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Calendar />
                                Daily Playtime
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                See the current trends and plan accordingly
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={'outline'}>
                                <ChartBar />
                                Showing last 7 days
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-0 grid gap-3">
                    <div className="h-40">
                        <ServerDailyPlaytime data={playtime?.daily_playtime || []} />
                    </div>

                    {/* Enhanced footer with additional context */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-xs bg-chart-1" />
                                <span>Daily Playtime</span>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground/70 flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                            Live data
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="p-4 bg-card/40">
                <CardHeader className="px-0">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Calendar />
                                Weekly Playtime
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                See the current trends and plan accordingly
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={'outline'}>
                                <ChartBar />
                                Showing last 8 weeks
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-0 grid gap-3">
                    <div className="h-40">
                        <ServerWeeklyPlaytime data={playtime?.weekly_playtime || []} />
                    </div>

                    {/* Enhanced footer with additional context */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-xs bg-chart-4" />
                                <span>Weekly Playtime</span>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground/70 flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                            Live data
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="p-4 bg-card/40">
                <CardHeader className="px-0">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Users />
                                Active Players
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Currently online players and their activity
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={'outline'}>
                                <Activity />
                                {playersLoading ? 'Loading...' : `${players?.length || 0} online`}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-0 grid gap-3">
                    <OnlinePlayersList players={players} playersLoading={playersLoading} />

                    {/* Enhanced footer with additional context */}
                    <div className="flex items-center justify-end pt-2 border-t border-border/30">
                        <div className="text-xs text-muted-foreground/70 flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                            Live data • Updated {new Date().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric',
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}