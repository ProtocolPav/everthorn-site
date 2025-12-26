'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import {
    ArrowLeft,
    User,
    Coins,
    TrendingUp,
    Calendar,
    Sparkles,
    Shield,
    Sword,
    Zap,
    Lightbulb,
    Target,
    MessageSquare,
    Gamepad2,
    Award,
    Clock,
    Activity,
    Trophy,
    CheckCircle,
    AlertCircle,
    Play,
    Gift,
    MapPin,
    Timer,
    Skull
} from 'lucide-react';
import { useUser } from '@/hooks/use-thorny-user';
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
        color: "hsl(217, 91%, 60%)",
    },
    monthly: {
        label: "Monthly Playtime",
        color: "hsl(142, 71%, 45%)",
    },
};

const StatCard = ({ icon: Icon, label, value, color, isLoading }: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
    isLoading?: boolean;
}) => (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
        <div className={cn("rounded-md p-2", color)}>
            <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">{label}</div>
            {isLoading ? (
                <Skeleton className="h-5 w-16 mt-1" />
            ) : (
                <div className="text-base font-semibold truncate">{value}</div>
            )}
        </div>
    </div>
);

const AttributeBar = ({ icon: Icon, label, value, max, color }: {
    icon: any;
    label: string;
    value: number;
    max: number;
    color: string;
}) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
                <Icon className={cn("h-3.5 w-3.5", color)} />
                <span className="font-medium">{label}</span>
            </div>
            <span className="font-semibold tabular-nums">{value}/{max}</span>
        </div>
        <Progress value={(value / max) * 100} className="h-2" />
    </div>
);

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const thornyId = parseInt(params.id as string);

    const { user, isLoading } = useUser(thornyId);
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
            return `${days}d ${hours}h`;
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

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <User className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h2 className="text-xl font-semibold mb-2">User not found</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    No user exists with ID {thornyId}
                </p>
                <Button onClick={() => router.back()} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </Button>
            </div>
        );
    }

    const xpProgress = (user.xp / user.required_xp) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className={cn(
                            "w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold border-2",
                            user.patron
                                ? "bg-gradient-to-br from-pink-500/20 to-pink-400/10 border-pink-500/30 text-pink-600 dark:text-pink-400"
                                : "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 text-primary"
                        )}>
                            {user.username.slice(0, 2).toUpperCase()}
                        </div>

                        {/* User Info */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold">{user.username}</h1>
                                {user.patron && (
                                    <Sparkles className="h-5 w-5 text-pink-500" />
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {user.role && (
                                    <Badge variant="secondary" className="text-xs">
                                        {user.role}
                                    </Badge>
                                )}
                                {user.whitelist && (
                                    <Badge variant="outline" className="text-xs">
                                        {user.whitelist}
                                    </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                    ID: {user.thorny_id}
                                </Badge>
                                <Badge
                                    variant={user.active ? "default" : "secondary"}
                                    className="text-xs"
                                >
                                    {user.active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard
                    icon={TrendingUp}
                    label="Level"
                    value={`Lv. ${user.level}`}
                    color="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                />
                <StatCard
                    icon={Coins}
                    label="Balance"
                    value={user.balance.toLocaleString()}
                    color="bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                />
                <StatCard
                    icon={Clock}
                    label="Total Playtime"
                    value={playtimeLoading ? "..." : formatPlaytime(playtime?.total || 0)}
                    color="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                    isLoading={playtimeLoading}
                />
                <StatCard
                    icon={Activity}
                    label="Current Session"
                    value={playtimeLoading ? "..." : playtime?.session ? formatDistanceToNow(parseUTCTimestamp(playtime.session), { addSuffix: false }) : 'Offline'}
                    color="bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400"
                    isLoading={playtimeLoading}
                />
                <StatCard
                    icon={Target}
                    label="Active Quest"
                    value={questLoading ? "..." : playerQuest ? `#${playerQuest.quest_id}` : 'None'}
                    color="bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400"
                    isLoading={questLoading}
                />
                <StatCard
                    icon={Calendar}
                    label="Joined"
                    value={formatDistanceToNow(new Date(user.join_date), { addSuffix: true })}
                    color="bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400"
                />
            </div>

            {/* XP Progress */}
            <Card>
                <CardContent className="p-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-primary" />
                                <span className="font-medium">Experience Progress</span>
                            </div>
                            <span className="font-semibold tabular-nums">
                                {user.xp.toLocaleString()} / {user.required_xp.toLocaleString()} XP
                            </span>
                        </div>
                        <Progress value={xpProgress} className="h-3" />
                        <div className="text-xs text-muted-foreground text-right">
                            {Math.round(xpProgress)}% to Level {user.level + 1}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Daily Activity Chart */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Daily Activity
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                                {playtime?.daily?.length || 0} days
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                        {playtimeLoading ? (
                            <Skeleton className="h-48 w-full" />
                        ) : (
                            <ChartContainer config={chartConfig} className="h-48 w-full">
                                <AreaChart
                                    data={playtime?.daily?.slice().reverse() || []}
                                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        strokeDasharray="3 3"
                                        className="stroke-muted/30"
                                    />
                                    <XAxis
                                        dataKey="day"
                                        tickLine={false}
                                        axisLine={false}
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
                                    <YAxis hide />
                                    <ChartTooltip
                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                                        content={({ active, payload, label }) => {
                                            if (!active || !payload || payload.length === 0) return null;
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
                                                    <div className="pb-2 mb-2 border-b">
                                                        <p className="font-semibold text-xs">
                                                            {new Date(label).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-xs text-muted-foreground">Playtime</span>
                                                        <span className="font-semibold text-xs" style={{ color: chartConfig.playtime.color }}>
                                                            {formatPlaytime(data.playtime)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Area
                                        dataKey="playtime"
                                        type="monotone"
                                        fill={chartConfig.playtime.color}
                                        fillOpacity={0.2}
                                        stroke={chartConfig.playtime.color}
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Overview Chart */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Monthly Overview
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                                {playtime?.monthly?.length || 0} months
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                        {playtimeLoading ? (
                            <Skeleton className="h-48 w-full" />
                        ) : (
                            <ChartContainer config={chartConfig} className="h-48 w-full">
                                <BarChart
                                    data={playtime?.monthly || []}
                                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        strokeDasharray="3 3"
                                        className="stroke-muted/30"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
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
                                    <YAxis hide />
                                    <ChartTooltip
                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                                        content={({ active, payload, label }) => {
                                            if (!active || !payload || payload.length === 0) return null;
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
                                                    <div className="pb-2 mb-2 border-b">
                                                        <p className="font-semibold text-xs">
                                                            {new Date(label).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-xs text-muted-foreground">Playtime</span>
                                                        <span className="font-semibold text-xs" style={{ color: chartConfig.monthly.color }}>
                                                            {formatPlaytime(data.playtime)}
                                                        </span>
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
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quest Progress Section */}
            {playerQuest && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    {questDetailsLoading ? 'Quest Progress' : questDetails?.title || `Quest #${playerQuest.quest_id}`}
                                </CardTitle>
                                {questDetails?.description && (
                                    <CardDescription className="mt-1 text-xs">
                                        {questDetails.description}
                                    </CardDescription>
                                )}
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
                                {/* Quest Meta */}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" />
                                        <span>Started {formatDistanceToNow(parseUTCTimestamp(playerQuest.started_on), { addSuffix: true })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3" />
                                        <span>Accepted {formatDistanceToNow(parseUTCTimestamp(playerQuest.accepted_on), { addSuffix: true })}</span>
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
                                            ))}
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
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Character Profile & Attributes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Character Profile */}
                {user.profile && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Character Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {user.profile.character_name && (
                                <div>
                                    <div className="text-base font-semibold mb-1">
                                        {user.profile.character_name}
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {user.profile.character_age && (
                                            <Badge variant="outline" className="text-xs">
                                                Age {user.profile.character_age}
                                            </Badge>
                                        )}
                                        {user.profile.character_race && (
                                            <Badge variant="outline" className="text-xs">
                                                {user.profile.character_race}
                                            </Badge>
                                        )}
                                        {user.profile.character_role && (
                                            <Badge variant="outline" className="text-xs">
                                                {user.profile.character_role}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {user.profile.slogan && (
                                <>
                                    <Separator />
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Slogan</div>
                                        <div className="text-sm italic">"{user.profile.slogan}"</div>
                                    </div>
                                </>
                            )}

                            {user.profile.character_origin && (
                                <>
                                    <Separator />
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Origin</div>
                                        <div className="text-sm">{user.profile.character_origin}</div>
                                    </div>
                                </>
                            )}

                            {user.profile.character_beliefs && (
                                <>
                                    <Separator />
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Beliefs</div>
                                        <div className="text-sm">{user.profile.character_beliefs}</div>
                                    </div>
                                </>
                            )}

                            {user.profile.aboutme && (
                                <>
                                    <Separator />
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-2">About</div>
                                        <div className="max-h-20 overflow-y-auto">
                                            <div className="text-sm whitespace-pre-wrap pr-2">
                                                {user.profile.aboutme}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {user.profile.lore && (
                                <>
                                    <Separator />
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-2">Lore</div>
                                        <div className="max-h-24 overflow-y-auto">
                                            <div className="text-sm whitespace-pre-wrap pr-2">
                                                {user.profile.lore}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Attributes */}
                {user.profile && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Character Attributes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <AttributeBar
                                icon={Target}
                                label="Agility"
                                value={user.profile.agility}
                                max={6}
                                color="text-blue-600 dark:text-blue-400"
                            />
                            <AttributeBar
                                icon={Shield}
                                label="Valor"
                                value={user.profile.valor}
                                max={6}
                                color="text-red-600 dark:text-red-400"
                            />
                            <AttributeBar
                                icon={Sword}
                                label="Strength"
                                value={user.profile.strength}
                                max={6}
                                color="text-orange-600 dark:text-orange-400"
                            />
                            <AttributeBar
                                icon={MessageSquare}
                                label="Charisma"
                                value={user.profile.charisma}
                                max={6}
                                color="text-pink-600 dark:text-pink-400"
                            />
                            <AttributeBar
                                icon={Sparkles}
                                label="Creativity"
                                value={user.profile.creativity}
                                max={6}
                                color="text-purple-600 dark:text-purple-400"
                            />
                            <AttributeBar
                                icon={Lightbulb}
                                label="Ingenuity"
                                value={user.profile.ingenuity}
                                max={6}
                                color="text-yellow-600 dark:text-yellow-400"
                            />

                            <Separator />

                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Total Points</span>
                                <span className="font-bold text-base">
                                    {user.profile.agility + user.profile.valor + user.profile.strength +
                                        user.profile.charisma + user.profile.creativity + user.profile.ingenuity}
                                    <span className="text-muted-foreground font-normal text-sm">/36</span>
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border/30">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-sm bg-chart-3" />
                                    <span>Quest Progress</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">Last Message</div>
                            <div className="font-medium">
                                {user.last_message ? formatDistanceToNow(new Date(user.last_message), { addSuffix: true }) : 'Never'}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">User ID</div>
                            <div className="font-mono text-xs">{user.user_id}</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">Guild ID</div>
                            <div className="font-mono text-xs">{user.guild_id}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
