'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {Trophy, Crown, Coins, Target, Clock, TrendingUp, Medal, Award, Sparkles, ArrowRight} from 'lucide-react';
import { useLeaderboards } from '@/hooks/use-admin-data';
import {ThornyUser, useUsers} from '@/hooks/use-thorny-user';
import { cn } from '@/lib/utils';

const leaderboardTypes = [
    {
        id: 'playtime',
        label: 'Playtime',
        icon: Clock,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/50',
        hasMonth: true,
        formatValue: (value: number) => {
            const days = Math.floor(value / 86400);
            const hours = Math.floor((value % 86400) / 3600);
            const minutes = Math.floor((value % 3600) / 60);
            if (days > 0) return `${days}d ${hours}h`;
            if (hours > 0) return `${hours}h ${minutes}m`;
            return `${minutes}m`;
        }
    },
    {
        id: 'levels',
        label: 'Levels',
        icon: TrendingUp,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
        hasMonth: false,
        formatValue: (value: number) => `Lv. ${value.toLocaleString()}`
    },
    {
        id: 'currency',
        label: 'Currency',
        icon: Coins,
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/50',
        hasMonth: false,
        formatValue: (value: number) => `${value.toLocaleString()}`
    },
    {
        id: 'quests',
        label: 'Quests',
        icon: Target,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-950/50',
        hasMonth: false,
        formatValue: (value: number) => `${value.toLocaleString()}`
    }
];

const getRankDisplay = (rank: number) => {
    switch (rank) {
        case 1: return { icon: <Crown className="h-3.5 w-3.5" />, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/50' };
        case 2: return { icon: <Medal className="h-3.5 w-3.5" />, color: 'text-slate-400 bg-slate-50 dark:bg-slate-950/50' };
        case 3: return { icon: <Award className="h-3.5 w-3.5" />, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' };
        default: return null;
    }
};

const LeaderboardRow = ({ entry, rank, userData, isUserLoading, currentLeaderboard, onClick }: {
    entry: any;
    rank: number;
    userData: ThornyUser | undefined;
    isUserLoading: boolean;
    currentLeaderboard: any;
    onClick: () => void;
}) => {
    const rankDisplay = getRankDisplay(rank);
    const isTopThree = rank <= 3;

    return (
        <button
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/30 transition-colors text-left group",
                isTopThree && "border-primary/20 bg-primary/[0.02]"
            )}
            onClick={onClick}
        >
            {/* Rank */}
            <div className="flex items-center justify-center w-9 shrink-0">
                {rankDisplay ? (
                    <div className={cn("rounded-full p-1.5", rankDisplay.color)}>
                        {rankDisplay.icon}
                    </div>
                ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                        {rank}
                    </span>
                )}
            </div>

            {/* Avatar */}
            <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 shrink-0",
                userData?.patron
                    ? "bg-gradient-to-br from-pink-500/10 to-pink-400/5 border-pink-500/20 text-pink-600 dark:text-pink-400"
                    : "bg-muted/50 border-border text-muted-foreground"
            )}>
                {isUserLoading ? (
                    <Skeleton className="w-7 h-7 rounded-full" />
                ) : (
                    userData?.username?.slice(0, 2).toUpperCase() || <Skeleton className="w-7 h-7 rounded-full" />
                )}
            </div>

            {/* Username */}
            <div className="flex-1 min-w-0">
                {isUserLoading ? (
                    <Skeleton className="h-4 w-28" />
                ) : (
                    <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm truncate">
                            {userData?.username || `Player ${entry.thorny_id}`}
                        </span>
                        {userData?.patron && (
                            <Sparkles className="h-3.5 w-3.5 text-pink-500 flex-shrink-0" />
                        )}
                    </div>
                )}
            </div>

            {/* Value */}
            <div className="shrink-0">
                {isUserLoading ? (
                    <Skeleton className="h-4 w-16" />
                ) : (
                    <div className={cn("font-semibold text-sm tabular-nums", currentLeaderboard?.color)}>
                        {currentLeaderboard?.formatValue(entry.value)}
                    </div>
                )}
            </div>

            {/* Arrow */}
            <div className="shrink-0 ml-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
        </button>
    );
};

export default function LeaderboardsPage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState('playtime');
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const currentDate = new Date();
        return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`;
    });
    const [selectedGuildId] = useState('611008530077712395');

    const currentLeaderboard = leaderboardTypes.find(lb => lb.id === selectedType);
    const { leaderboard, isLoading: leaderboardLoading } = useLeaderboards(
        selectedGuildId,
        selectedType,
        currentLeaderboard?.hasMonth ? selectedMonth : undefined
    );

    const thornyIds = useMemo(() =>
            leaderboard?.map(entry => entry.thorny_id) || [],
        [leaderboard]
    );

    const { users, isLoading: usersLoading } = useUsers(thornyIds);

    const userMap = useMemo(() =>
            users.reduce((acc, user) => {
                acc[user.thorny_id] = user;
                return acc;
            }, {} as Record<number, ThornyUser>),
        [users]
    );

    const isLoading = leaderboardLoading || usersLoading;

    const viewUserProfile = (thornyId: number) => {
        router.push(`/admin/users/${thornyId}`);
    };

    const generateMonthOptions = () => {
        const months = [];
        const currentDate = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const value = date.toISOString().split('T')[0].substring(0, 8) + '01';
            const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            months.push({ value, label });
        }
        return months;
    };

    return (
        <div className="space-y-4">
            {/* Type Selector Cards - Compact Design */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {leaderboardTypes.map((type) => {
                    const isSelected = selectedType === type.id;
                    const Icon = type.icon;

                    return (
                        <button
                            key={type.id}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                                isSelected
                                    ? 'border-primary/30 bg-primary/5'
                                    : 'border-border bg-card hover:border-primary/30 hover:bg-accent/50'
                            )}
                            onClick={() => setSelectedType(type.id)}
                        >
                            {/* Icon */}
                            <div className={cn(
                                "rounded-md p-2 shrink-0",
                                isSelected ? type.bgColor : 'bg-muted/50'
                            )}>
                                <Icon className={cn("h-4 w-4", isSelected ? type.color : 'text-muted-foreground')} />
                            </div>

                            {/* Label & Count */}
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium truncate">
                                    {type.label}
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className={cn(
                                        "text-lg font-semibold tabular-nums",
                                        isSelected ? type.color : 'text-muted-foreground'
                                    )}>
                                        {isSelected ? leaderboard?.length || 0 : '-'}
                                    </span>
                                                <span className="text-xs text-muted-foreground">
                                        players
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>


            {/* Month Selector */}
            {currentLeaderboard?.hasMonth && (
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    <div className="flex gap-2 pb-2">
                        {generateMonthOptions().map(({ value, label }) => (
                            <Badge
                                key={value}
                                variant={selectedMonth === value ? "default" : "outline"}
                                className="cursor-pointer shrink-0 text-xs"
                                onClick={() => setSelectedMonth(value)}
                            >
                                {label}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Leaderboard Table */}
            <Card className={'p-0'}>
                <CardContent className="p-2">
                    {/* Leaderboard Cards */}
                    <div className="space-y-3">
                        {isLoading ? (
                            <>
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border-2 bg-card">
                                        <Skeleton className="w-10 h-10 rounded-xl" />
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                        <Skeleton className="h-5 w-32 flex-1" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                ))}
                            </>
                        ) : leaderboard?.length > 0 ? (
                            <>
                                {leaderboard.map((entry, index) => (
                                    <LeaderboardRow
                                        key={entry.thorny_id}
                                        entry={entry}
                                        rank={index + 1}
                                        userData={userMap[entry.thorny_id]}
                                        isUserLoading={usersLoading}
                                        currentLeaderboard={currentLeaderboard}
                                        onClick={() => viewUserProfile(entry.thorny_id)}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Trophy className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">No rankings available</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
