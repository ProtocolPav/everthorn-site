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
import { useQuest } from '@/hooks/use-quest';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

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
    const { quest: playerQuest, isLoading: questLoading } = usePlayerQuest(thornyId);
    const { quest: questDetails, isLoading: questDetailsLoading } = useQuest(
        playerQuest?.quest_id ? `${playerQuest.quest_id}` : "0"
    );

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
                                <Badge variant="outline" className="text-xs">
                                    #{playerQuest.quest_id}
                                </Badge>
                                {questDetails?.quest_type && (
                                    <Badge variant="secondary" className="text-xs capitalize">
                                        {questDetails.quest_type}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {questLoading || questDetailsLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="h-20 w-full" />
                                ))}
                            </div>
                        ) : (
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
                                    {questDetails?.tags && questDetails.tags.length > 0 && (
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {questDetails.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <Badge variant={playerQuest.status === 'in_progress' ? 'default' : playerQuest.status === 'completed' ? 'secondary' : 'destructive'} className="text-xs capitalize">
                                        {playerQuest.status.replace('_', ' ')}
                                    </Badge>
                                </div>

                                <Separator />

                                {/* Objectives */}
                                <div className="space-y-3">
                                    {playerQuest.objectives.map((userObj, index) => {
                                        // Match user objective with quest objective by order
                                        const questObj = questDetails?.objectives[index];

                                        // Determine objective display name
                                        const getObjectiveDisplay = () => {
                                            if (!questObj) return `Objective ${index + 1}`;

                                            const type = questObj.objective_type;
                                            const capitalizeCase = (str: string) => {
                                                return str.split(' ').map(word =>
                                                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                                ).join(' ');
                                            };

                                            if (type && type !== 'encounter') {
                                                const objectName = questObj.objective
                                                    ? questObj.objective.split(":")[1]?.replaceAll("_", " ") || ''
                                                    : '';
                                                const typeName = capitalizeCase(type);
                                                const formattedObjectName = capitalizeCase(objectName);
                                                return `${typeName} ${questObj.objective_count} ${formattedObjectName}`.trim();
                                            } else if (type === 'encounter' && questObj.display) {
                                                return capitalizeCase(questObj.display);
                                            }
                                            return questObj.display || `Objective ${index + 1}`;
                                        };

                                        const getObjectiveIcon = () => {
                                            if (!questObj) return Target;
                                            const type = questObj.objective_type;
                                            if (type === 'kill') return Sword;
                                            if (type === 'mine' || type === 'break') return Target;
                                            if (type === 'encounter') return Zap;
                                            return Target;
                                        };

                                        const ObjectiveIcon = getObjectiveIcon();

                                        return (
                                            <div
                                                key={userObj.objective_id}
                                                className={cn(
                                                    "p-3 border rounded-lg",
                                                    userObj.status === 'completed'
                                                        ? 'border-green-500/30 bg-green-500/5'
                                                        : userObj.status === 'in_progress'
                                                            ? 'border-blue-500/30 bg-blue-500/5'
                                                            : 'border-red-500/30 bg-red-500/5'
                                                )}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-start gap-2 flex-1">
                                                        <div className={cn(
                                                            "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                                            userObj.status === 'completed'
                                                                ? 'bg-green-500 text-white'
                                                                : userObj.status === 'in_progress'
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'bg-red-500 text-white'
                                                        )}>
                                                            {userObj.status === 'completed' ? (
                                                                <CheckCircle className="h-3.5 w-3.5" />
                                                            ) : userObj.status === 'in_progress' ? (
                                                                <ObjectiveIcon className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <AlertCircle className="h-3.5 w-3.5" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-semibold text-sm mb-0.5">
                                                                {getObjectiveDisplay()}
                                                            </h5>
                                                            {questObj?.description && (
                                                                <p className="text-xs text-muted-foreground mb-2">
                                                                    {questObj.description}
                                                                </p>
                                                            )}

                                                            {/* Objective Details */}
                                                            {questObj && (
                                                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                                    {questObj.objective_timer !== null && questObj.objective_timer > 0 && (
                                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                            <Timer className="h-3 w-3" />
                                                                            <span>{questObj.objective_timer}s</span>
                                                                        </div>
                                                                    )}
                                                                    {questObj.required_location && questObj.required_location.length > 0 && (
                                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                            <MapPin className="h-3 w-3" />
                                                                            <span>
                                                                                {questObj.location_radius && questObj.location_radius > 0
                                                                                    ? `Within ${questObj.location_radius}m`
                                                                                    : 'At location'
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {questObj.required_mainhand && (
                                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                            <Sword className="h-3 w-3" />
                                                                            <span>{questObj.required_mainhand.split(':')[1]?.replaceAll('_', ' ')}</span>
                                                                        </div>
                                                                    )}
                                                                    {questObj.required_deaths && questObj.required_deaths > 0 && (
                                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                            <Skull className="h-3 w-3" />
                                                                            <span>{questObj.required_deaths} death{questObj.required_deaths > 1 ? 's' : ''}</span>
                                                                        </div>
                                                                    )}
                                                                    {questObj.natural_block && (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            Natural only
                                                                        </Badge>
                                                                    )}
                                                                    {questObj.continue_on_fail && (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            Continue on fail
                                                                        </Badge>
                                                                    )}
                                                                    {questObj.rewards && questObj.rewards.length > 0 && (
                                                                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                                                            <Gift className="h-3 w-3" />
                                                                            <span>
                                                                                {questObj.rewards
                                                                                    .map(r => {
                                                                                        if (r.balance && r.balance > 0) return `${r.balance} nugs`;
                                                                                        if (r.item && r.count > 0) {
                                                                                            const itemName = r.display_name || r.item.split(':')[1]?.replaceAll('_', ' ') || 'item';
                                                                                            return `${r.count}x ${itemName}`;
                                                                                        }
                                                                                        return null;
                                                                                    })
                                                                                    .filter(Boolean)
                                                                                    .join(', ') || 'Reward'}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}


                                                            {/* Timing info */}
                                                            {userObj.start && (
                                                                <div className="text-xs text-muted-foreground mt-2">
                                                                    Started {formatDistanceToNow(parseUTCTimestamp(userObj.start), { addSuffix: true })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            userObj.status === 'completed' ? 'default' :
                                                                userObj.status === 'in_progress' ? 'secondary' :
                                                                    'destructive'
                                                        }
                                                        className="text-xs shrink-0"
                                                    >
                                                        {userObj.completion}%
                                                    </Badge>
                                                </div>

                                                <Progress
                                                    value={userObj.completion}
                                                    className={cn(
                                                        "h-1.5",
                                                        userObj.status === 'completed' && '[&>div]:bg-green-500',
                                                        userObj.status === 'in_progress' && '[&>div]:bg-blue-500',
                                                        userObj.status === 'failed' && '[&>div]:bg-red-500'
                                                    )}
                                                />
                                            </div>
                                        );
                                    })}
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

            {/* Additional Info */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Additional Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">Birthday</div>
                            <div className="font-medium">
                                {user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not set'}
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
