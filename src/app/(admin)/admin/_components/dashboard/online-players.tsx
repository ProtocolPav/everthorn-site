// admin/_components/dashboard/OnlinePlayersList.tsx
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from "next/navigation";
import { useUsers } from '@/hooks/use-thorny-user';
import { ArrowRightIcon, UsersIcon, CrownIcon, StarIcon, GameControllerIcon, SwordIcon, HammerIcon, CoinsIcon, LeafIcon, MountainsIcon, MusicNoteIcon, AxeIcon, DiscordLogoIcon, ActivityIcon } from "@phosphor-icons/react";
import {cn} from "@/lib/utils";
import {Player} from "@/hooks/use-players";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User} from "lucide-react";
import React from "react";

interface OnlinePlayersListProps {
    players: Player[];
    playersLoading: boolean;
}

const parseUTCTimestamp = (utcTimestamp: string) => {
    const utcString = utcTimestamp.includes('Z') ? utcTimestamp : utcTimestamp + 'Z';
    return new Date(utcString);
};

const getRoleConfig = (role: string) => {
    const configs = {
        owner: {
            icon: CrownIcon,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500/10',
            priority: 1
        },
        'community manager': {
            icon: UsersIcon,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            priority: 2
        },
        'new recruit': {
            icon: StarIcon,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            priority: 10
        },
        knight: {
            icon: SwordIcon,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10',
            priority: 3
        },
        builder: {
            icon: HammerIcon,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10',
            priority: 4
        },
        merchant: {
            icon: CoinsIcon,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10',
            priority: 5
        },
        gatherer: {
            icon: LeafIcon,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10',
            priority: 6
        },
        stoner: {
            icon: MountainsIcon,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10',
            priority: 7
        },
        bard: {
            icon: MusicNoteIcon,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10',
            priority: 8
        },
        miner: {
            icon: AxeIcon,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10',
            priority: 9
        },
    };

    return configs[role.toLowerCase() as keyof typeof configs] || null;
};

const PlayerSkeleton = () => (
    <div className="flex items-center justify-between p-4 border rounded-xl bg-card/50">
        <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
        <Skeleton className="h-5 w-5" />
    </div>
);

const PlayerCard = ({ player, userData, isUserLoading, onClick }: {
    player: Player;
    userData: any;
    isUserLoading: boolean;
    onClick: () => void;
}) => {
    const roleConfig = userData?.role ? getRoleConfig(userData.role) : null;
    const RoleIcon = roleConfig?.icon;

    return (
        <div
            className="group flex items-center justify-between p-4 border rounded-xl bg-card/50 hover:bg-accent/50 hover:border-primary/20 cursor-pointer transition-all duration-200 hover:shadow-sm"
            onClick={onClick}
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className={cn(
                        "w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/10",
                        userData?.patron && "border-pink-500"
                    )}>
                        {
                            userData?.xuid ? (
                                <Avatar>
                                    <AvatarImage
                                        src={`https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/${userData.xuid}/image/head`}
                                        alt={'Minecraft Avatar'}
                                    />
                                    <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                </Avatar>
                            ) : (
                                <User className="w-4 h-4" />
                            )
                        }
                    </div>

                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                        <GameControllerIcon size={8} className="text-white" />
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    {isUserLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ) : (
                        <>
                            {/* Name and Role */}
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-foreground truncate">
                                    {userData?.whitelist || `Player ${player.thorny_id}`}
                                </h4>

                                {RoleIcon && roleConfig && (
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleConfig.bgColor} ${roleConfig.color}`}>
                                        <RoleIcon size={10} />
                                        <span>{userData.role}</span>
                                    </div>
                                )}
                            </div>

                            {/* Session and Level Info */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <ActivityIcon/>
                                    {formatDistanceToNow(new Date(player.session), { addSuffix: true })}
                                </span>
                                <span>•</span>
                                <span className="flex gap-1 items-center">
                                    <DiscordLogoIcon weight={'fill'} /> {userData?.username}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 ml-3">
                <ArrowRightIcon
                    size={18}
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                />
            </div>
        </div>
    );
};

const EmptyState = () => (
    <div className="h-72 flex flex-col items-center justify-center text-center text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <UsersIcon size={24} className="opacity-50" />
        </div>
        <h3 className="text-sm font-semibold mb-1">No players online</h3>
        <p className="text-xs opacity-75">Players will appear here when they join the server</p>
    </div>
);

const MorePlayersIndicator = ({ count }: { count: number }) => (
    <div className="text-center pt-4 border-t border-border/30">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            +{count} more players online
        </div>
    </div>
);

export default function OnlinePlayersList({ players, playersLoading }: OnlinePlayersListProps) {
    const router = useRouter();
    const thornyIds = players.map(player => player.thorny_id);
    const { users, isLoading: usersLoading } = useUsers(thornyIds);

    const viewUserProfile = (thornyId: number) => {
        router.push(`/admin/users/${thornyId}`);
    };

    // Loading state
    if (playersLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <PlayerSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Empty state
    if (!players || players.length === 0) {
        return <EmptyState />;
    }

    const displayedPlayers = players.slice(0, 8);
    const remainingCount = players.length - 8;

    return (
        <div className="space-y-3 h-72 overflow-hidden">
            <div className="space-y-2 overflow-y-auto max-h-full pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {displayedPlayers.map((player) => {
                    const userData = users.find(user => user.thorny_id === player.thorny_id);
                    const isUserLoading = usersLoading && !userData;

                    return (
                        <PlayerCard
                            key={player.thorny_id}
                            player={player}
                            userData={userData}
                            isUserLoading={isUserLoading}
                            onClick={() => viewUserProfile(player.thorny_id)}
                        />
                    );
                })}
            </div>

            {remainingCount > 0 && <MorePlayersIndicator count={remainingCount} />}
        </div>
    );
}
