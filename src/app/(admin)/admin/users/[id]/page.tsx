// admin/users/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { usePlayerPlaytime, usePlayerQuest } from '@/hooks/use-admin-data';
import {
    Clock, Target, Calendar, ArrowLeft, User, Activity, TrendingUp, Gamepad2, Trophy, Zap, CheckCircle, AlertCircle, Play,
    Pickaxe, Sword, Code, Hand, Skull, Gift
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {Timer} from "@phosphor-icons/react";
import {useQuest} from "@/hooks/use-quest";

const chartConfig = {
    playtime: {
        label: "Daily Playtime",
        color: "var(--chart-1)",
    },
    monthly: {
        label: "Monthly Playtime",
        color: "var(--chart-2)",
    },
    progress: {
        label: "Quest Progress",
        color: "var(--chart-3)",
    },
};

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const thornyId = parseInt(params.id as string);

    const { playtime, isLoading: playtimeLoading } = usePlayerPlaytime(thornyId);
    const { progress, isLoading: progressLoading } = usePlayerQuest(thornyId);
    const { quest, isLoading: questLoading } = useQuest(progress?.quest_id ? String(progress.quest_id) : undefined);

    const isLoading = progressLoading || (!!progress?.quest_id && questLoading);
    const hasQuest = !!progress && !!quest;

    const formatPlaytime = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    };

    const parseUTCTimestamp = (utcTimestamp?: string | null) => {
        if (!utcTimestamp) return new Date();
        const utcString = utcTimestamp?.includes('Z') ? utcTimestamp : utcTimestamp + 'Z';
        return new Date(utcString);
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <User className="h-8 w-8" />
                            Player {thornyId}
                        </h1>
                        <p className="text-muted-foreground">Detailed player statistics and information</p>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Playtime Card */}
                    <Card className="p-4 relative overflow-hidden">
                        {/* Background Chart */}
                        <div className="absolute inset-0 opacity-10">
                            <ChartContainer config={chartConfig} className="h-full w-full">
                                <AreaChart
                                    data={playtime?.daily.reverse() || []}
                                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                                >
                                    <Area
                                        dataKey="playtime"
                                        type="natural"
                                        fill="hsl(var(--chart-1))"
                                        fillOpacity={0.8}
                                        stroke="hsl(var(--chart-1))"
                                        strokeWidth={1}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>

                        {/* Content Layer */}
                        <div className="relative z-10">
                            <CardHeader className="flex flex-row items-center justify-between px-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Playtime</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-0">
                                <div className="text-2xl font-bold">
                                    {playtimeLoading ? (
                                        <Skeleton className="h-8 w-24" />
                                    ) : (
                                        formatPlaytime(playtime?.total || 0)
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    That's {Math.round((playtime?.total || 0) / 3600)} hours
                                </p>
                            </CardContent>
                        </div>
                    </Card>

                    {/* Current Session Card */}
                    <Card className="p-4">
                        <CardHeader className="flex flex-row items-center justify-between px-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Session</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="text-2xl font-bold">
                                {playtimeLoading ? (
                                    <Skeleton className="h-8 w-20" />
                                ) : playtime?.session ? (
                                    formatDistanceToNow(parseUTCTimestamp(playtime.session), { addSuffix: false })
                                ) : (
                                    'Offline'
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {playtimeLoading ? (
                                    <Skeleton className="h-3 w-24" />
                                ) : playtime?.session ? (
                                    `Started ${formatDistanceToNow(parseUTCTimestamp(playtime.session), { addSuffix: true })}`
                                ) : (
                                    'Player not online'
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Quest Status Card */}
                    <Card className="p-4">
                        <CardHeader className="flex flex-row items-center justify-between px-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Quest</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="text-2xl font-bold">
                                {questLoading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : quest ? (
                                    `#${quest.quest_id}`
                                ) : (
                                    'None'
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {questLoading ? (
                                    <Skeleton className="h-3 w-20" />
                                ) : quest ? (
                                    `${quest.objectives.length} objectives`
                                ) : (
                                    'No active quest'
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Daily Average Card */}
                    <Card className="p-4">
                        <CardHeader className="flex flex-row items-center justify-between px-0 pb-2">
                            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="text-2xl font-bold">
                                {playtimeLoading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : playtime?.daily ? (
                                    formatPlaytime(playtime.daily.reduce((sum, day) => sum + day.playtime, 0) / playtime.daily.length)
                                ) : (
                                    '0m'
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Last {playtime?.daily?.length || 0} days
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Activity Chart */}
                    <Card className="p-4 bg-card/40">
                        <CardHeader className="px-0">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Calendar />
                                        Daily Activity
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Player activity over the last 30 days
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={'outline'}>
                                        <Activity />
                                        Last {playtime?.daily?.length || 0} days
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="px-0 grid gap-3">
                            <ChartContainer config={chartConfig} className="h-64 w-full">
                                <AreaChart
                                    accessibilityLayer
                                    data={playtime?.daily.reverse() || []}
                                    margin={{
                                        right: 15,
                                        top: 15,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        strokeDasharray="3 3"
                                        className="stroke-muted"
                                    />

                                    <XAxis
                                        dataKey="day"
                                        tickLine={false}
                                        axisLine={false}
                                        reversed={true}
                                        tickMargin={8}
                                        className="text-xs fill-muted-foreground"
                                        tickFormatter={(value) => {
                                            try {
                                                return new Date(value).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                });
                                            } catch {
                                                return value;
                                            }
                                        }}
                                    />

                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={4}
                                        width={60}
                                        domain={[0, 'auto']}
                                        allowDecimals={false}
                                        className="text-xs fill-muted-foreground"
                                        tickFormatter={(value) => formatPlaytime(value)}
                                    />

                                    <ChartTooltip
                                        cursor={{ fill: 'var(--muted)', opacity: 0.7 }}
                                        content={({active, payload, label}) => {
                                            if (!active || !payload || payload.length === 0) return null;

                                            const data = payload[0].payload;

                                            return (
                                                <div className="bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-lg p-3 min-w-[200px]">
                                                    <div className="pb-2 mb-2 border-b border-border/50">
                                                        <p className="font-semibold text-foreground text-xs">
                                                            {new Date(label).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-1 h-4 rounded-sm"
                                                                    style={{backgroundColor: chartConfig.playtime.color}}
                                                                />
                                                                <span className="text-xs text-muted-foreground">Daily Playtime</span>
                                                            </div>
                                                            <span
                                                                className="font-semibold text-xs"
                                                                style={{color: chartConfig.playtime.color}}
                                                            >
                                                                {formatPlaytime(data.playtime)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />

                                    <Area
                                        dataKey="playtime"
                                        type="natural"
                                        fill={chartConfig.playtime.color}
                                        fillOpacity={0.2}
                                        stroke={chartConfig.playtime.color}
                                        strokeWidth={2}
                                    />

                                </AreaChart>
                            </ChartContainer>

                            {/* Enhanced footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-sm bg-chart-1" />
                                        <span>Daily Playtime</span>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground/70 flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                    Live data • Player {thornyId}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Playtime Chart */}
                    <Card className="p-4 bg-card/40">
                        <CardHeader className="px-0">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <TrendingUp />
                                        Monthly Overview
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Monthly playtime trends and patterns
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={'outline'}>
                                        <Calendar />
                                        {playtime?.monthly?.length || 0} months
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="px-0 grid gap-3">
                            <ChartContainer config={chartConfig} className="h-64 w-full">
                                <BarChart
                                    accessibilityLayer
                                    data={playtime?.monthly || []}
                                    margin={{
                                        right: 15,
                                        top: 15,
                                        left: 12,
                                        bottom: 12,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        strokeDasharray="3 3"
                                        className="stroke-muted"
                                    />

                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        reversed={true}
                                        tickMargin={8}
                                        className="text-xs fill-muted-foreground"
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: '2-digit'
                                            });
                                        }}
                                    />

                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={4}
                                        width={60}
                                        domain={[0, 'auto']}
                                        allowDecimals={false}
                                        className="text-xs fill-muted-foreground"
                                        tickFormatter={(value) => formatPlaytime(value)}
                                    />

                                    <ChartTooltip
                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                                        content={({active, payload, label}) => {
                                            if (!active || !payload || payload.length === 0) return null;

                                            const data = payload[0].payload;

                                            return (
                                                <div className="bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-lg p-3 min-w-[200px]">
                                                    <div className="pb-2 mb-2 border-b border-border/50">
                                                        <p className="font-semibold text-foreground text-xs">
                                                            {new Date(label).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-1 h-4 rounded-sm"
                                                                    style={{backgroundColor: chartConfig.monthly.color}}
                                                                />
                                                                <span className="text-xs text-muted-foreground">Monthly Playtime</span>
                                                            </div>
                                                            <span
                                                                className="font-semibold text-xs"
                                                                style={{color: chartConfig.monthly.color}}
                                                            >
                                                                {formatPlaytime(data.playtime)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />

                                    <Bar
                                        dataKey="playtime"
                                        fill={chartConfig.monthly.color}
                                        radius={[4, 4, 0, 0]}
                                    />

                                </BarChart>
                            </ChartContainer>

                            {/* Enhanced footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-sm bg-chart-2" />
                                        <span>Monthly Playtime</span>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground/70 flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                    Live data • Updated now
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quest Progress Section */}
                <Card className="p-4 bg-card/40">
                    <CardHeader className="px-0">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                    <Target />
                                    Quest Progress
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    Current quest objectives and completion status
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                {progress && (
                                    <Badge variant={'outline'}>
                                        <Gamepad2 />
                                        Quest #{progress.quest_id}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-0 grid gap-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                <div className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="p-3 border rounded-lg space-y-3">
                                            <Skeleton className="h-4 w-28" />
                                            <Skeleton className="h-2 w-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (progress && quest) ? (
                            <div className="space-y-6">
                                {/* Quest Header */}
                                <div className="p-6 border-2 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                                <Trophy className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{quest.title}</h3>
                                                <Badge
                                                    variant={progress.status === 'active' ? 'default' : 'secondary'}
                                                    className="mt-1 uppercase"
                                                >
                                                    {progress.status === 'active' && <Play className="h-3 w-3 mr-1" />}
                                                    {progress.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm text-muted-foreground">
                                            {progress.start_time && (
                                                <div className="flex items-center gap-2 mb-1 justify-end">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Started {formatDistanceToNow(new Date(progress.start_time), { addSuffix: true })}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 justify-end">
                                                <Clock className="h-3 w-3" />
                                                <span>Accepted {formatDistanceToNow(new Date(progress.accept_time), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {quest.description && (
                                        <p className="text-sm text-muted-foreground mb-4 p-3 bg-background/30 rounded-lg">
                                            {quest.description}
                                        </p>
                                    )}

                                    {/* Overall Progress Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-background/50 rounded-lg">
                                            <div className="text-2xl font-bold text-primary">{quest.objectives.length}</div>
                                            <div className="text-xs text-muted-foreground">Total Objectives</div>
                                        </div>
                                        <div className="text-center p-3 bg-background/50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">
                                                {progress.objectives.filter(obj => obj.status === 'completed').length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Completed</div>
                                        </div>
                                        <div className="text-center p-3 bg-background/50 rounded-lg">
                                            {(() => {
                                                let totalRequired = 0;
                                                let totalCurrent = 0;

                                                quest.objectives.forEach((obj, idx) => {
                                                    const progObj = progress.objectives.find(p => p.objective_id === (obj as any).objective_id) || progress.objectives[idx];
                                                    if (!progObj) return;

                                                    obj.targets.forEach((t, tIdx) => {
                                                        totalRequired += t.count;
                                                        const current = progObj.target_progress[tIdx]?.count || 0;
                                                        totalCurrent += Math.min(current, t.count);
                                                    });
                                                });

                                                const percentage = totalRequired > 0
                                                    ? Math.round((totalCurrent / totalRequired) * 100)
                                                    : 0;

                                                return (
                                                    <>
                                                        <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
                                                        <div className="text-xs text-muted-foreground">Overall Progress</div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {quest.tags && quest.tags.length > 0 && (
                                        <div className="flex gap-2 mt-4 flex-wrap">
                                            {quest.tags.map((tag, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Objectives List */}
                                <div>
                                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                                        <Target className="h-4 w-4" />
                                        Objectives ({quest.objectives.length})
                                    </h4>
                                    <div className="grid gap-4">
                                        {quest.objectives
                                            .sort((a, b) => a.order_index - b.order_index)
                                            .map((staticObj, index) => {
                                                // Match static definition with user progress
                                                const progressObj = progress.objectives.find(
                                                    p => p.objective_id === (staticObj as any).objective_id
                                                ) || progress.objectives[index];

                                                if (!progressObj) return null;

                                                // Calculate Objective-level percentage
                                                const objTotal = staticObj.targets.reduce((sum, t) => sum + t.count, 0);
                                                // Get current sum based on matching indices
                                                let objCurrent = 0;
                                                staticObj.targets.forEach((t, i) => {
                                                    const c = progressObj.target_progress[i]?.count || 0;
                                                    objCurrent += Math.min(c, t.count);
                                                });

                                                const progressPercent = objTotal > 0
                                                    ? Math.round((objCurrent / objTotal) * 100)
                                                    : 0;

                                                const getObjectiveIcon = (type: string) => {
                                                    switch (type?.toLowerCase()) {
                                                        case 'mine': return <Pickaxe className="h-4 w-4" />;
                                                        case 'kill': return <Sword className="h-4 w-4" />;
                                                        case 'scriptevent': return <Code className="h-4 w-4" />;
                                                        default: return <Target className="h-4 w-4" />;
                                                    }
                                                };

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`p-4 border-2 rounded-xl transition-all ${
                                                            progressObj.status === 'completed'
                                                                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                                                                : progressObj.status === 'active'
                                                                    ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'
                                                                    : 'border-border bg-muted/20'
                                                        }`}
                                                    >
                                                        {/* Objective Header */}
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                                    progressObj.status === 'completed'
                                                                        ? 'bg-green-500 text-white'
                                                                        : progressObj.status === 'active'
                                                                            ? 'bg-blue-500 text-white'
                                                                            : 'bg-muted text-muted-foreground'
                                                                }`}>
                                                                    {progressObj.status === 'completed' ? (
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    ) : progressObj.status === 'active' ? (
                                                                        <Zap className="h-4 w-4" />
                                                                    ) : (
                                                                        <AlertCircle className="h-4 w-4" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h5 className="font-medium">
                                                                            {staticObj.display || `Objective ${index + 1}`}
                                                                        </h5>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {getObjectiveIcon(staticObj.objective_type)}
                                                                            <span className="ml-1">{staticObj.objective_type}</span>
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Step {index + 1} of {quest.objectives.length}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant={
                                                                    progressObj.status === 'completed' ? 'default' :
                                                                        progressObj.status === 'active' ? 'secondary' :
                                                                            'outline'
                                                                }
                                                                className="capitalize"
                                                            >
                                                                {progressObj.status}
                                                            </Badge>
                                                        </div>

                                                        {staticObj.description && (
                                                            <p className="text-sm text-muted-foreground mb-3 pl-11">
                                                                {staticObj.description}
                                                            </p>
                                                        )}

                                                        {/* Targets List */}
                                                        <div className="pl-11 mb-4 space-y-2">
                                                            {staticObj.targets.map((target, tIdx) => {
                                                                const currentCount = progressObj.target_progress[tIdx]?.count ?? 0;
                                                                const isDone = currentCount >= target.count;

                                                                return (
                                                                    <div key={tIdx} className="flex items-center justify-between text-sm bg-background/50 p-2 rounded border">
                                                                        <div className="flex items-center gap-2">
                                                                            {'block' in target && (
                                                                                <>
                                                                                    <Pickaxe className="h-3 w-3 text-muted-foreground" />
                                                                                    <span>Mine <b>{target.block}</b></span>
                                                                                </>
                                                                            )}
                                                                            {'entity' in target && (
                                                                                <>
                                                                                    <Sword className="h-3 w-3 text-muted-foreground" />
                                                                                    <span>Kill <b>{target.entity}</b></span>
                                                                                </>
                                                                            )}
                                                                            {'script_id' in target && (
                                                                                <>
                                                                                    <Code className="h-3 w-3 text-muted-foreground" />
                                                                                    <span>Trigger <b>{target.script_id}</b></span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        <div className="font-mono text-xs">
                                                            <span className={isDone ? "text-green-600 font-bold" : ""}>
                                                                {currentCount}
                                                            </span>
                                                                            <span className="text-muted-foreground"> / {target.count}</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Customizations */}
                                                        {staticObj.customizations && (
                                                            <div className="pl-11 mb-3 flex flex-wrap gap-2">
                                                                {staticObj.customizations.mainhand && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        <Hand className="h-3 w-3 mr-1" />
                                                                        Requires: {staticObj.customizations.mainhand.item}
                                                                    </Badge>
                                                                )}
                                                                {staticObj.customizations.timer && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        <Timer className="h-3 w-3 mr-1" />
                                                                        {staticObj.customizations.timer.seconds}s limit
                                                                    </Badge>
                                                                )}
                                                                {staticObj.customizations.maximum_deaths && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        <Skull className="h-3 w-3 mr-1" />
                                                                        Max deaths: {progressObj.customization_progress?.maximum_deaths?.deaths ?? 0} / {staticObj.customizations.maximum_deaths.deaths}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="font-medium">Progress</span>
                                                                <span className="font-bold">{progressPercent}%</span>
                                                            </div>
                                                            <Progress
                                                                value={progressPercent}
                                                                className={`h-3 ${
                                                                    progressObj.status === 'completed' ? '[&>div]:bg-green-500' :
                                                                        progressObj.status === 'active' ? '[&>div]:bg-blue-500' :
                                                                            '[&>div]:bg-muted-foreground'
                                                                }`}
                                                            />

                                                            {/* Rewards */}
                                                            {staticObj.rewards && staticObj.rewards.length > 0 && (
                                                                <div className="pt-3 border-t border-border/30 mt-3">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Gift className="h-3 w-3 text-amber-500" />
                                                                        <span className="text-xs font-medium">Rewards:</span>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {staticObj.rewards.map((reward, rewardIdx) => (
                                                                            <Badge key={rewardIdx} variant="outline" className="text-xs bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400">
                                                                                {reward.balance !== null && (
                                                                                    <>💰 {reward.balance} coins</>
                                                                                )}
                                                                                {reward.item && (
                                                                                    <span className="capitalize">
                                                                        {reward.display_name || reward.item} x{reward.count}
                                                                    </span>
                                                                                )}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                                    <Target className="h-10 w-10 opacity-50" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">No Active Quest</h3>
                                <p className="text-sm">This player doesn't have any active quests at the moment.</p>
                                <p className="text-xs mt-1">Completed quests and new assignments will appear here.</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-border/30">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-sm bg-chart-3" />
                                    <span>Quest Progress</span>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground/70 flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                Live data • Updated now
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
