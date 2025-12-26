// hooks/use-admin-data.ts
import useSWR from 'swr';
import {
    GuildPlaytime,
    OnlineUser,
    LeaderboardEntry,
    PlaytimeData,
    ServerStatus,
    QuestProgress,
    CombinedQuest
} from '@/types/admin';
import {APIQuestSchema} from "@/types/quest";
import {useMemo} from "react";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGuildPlaytime(guildId: string) {
    const { data, error, isLoading } = useSWR<GuildPlaytime>(
        `/nexuscore-api/v0.2/guilds/${guildId}/playtime`,
        fetcher
    );

    return {
        playtime: data,
        isLoading,
        isError: error
    };
}

export function useOnlinePlayers(guildId: string) {
    const { data, error, isLoading } = useSWR<{ users: OnlineUser[] }>(
        `/nexuscore-api/v0.2/guilds/${guildId}/online`,
        fetcher,
        { refreshInterval: 5000 }
    );

    return {
        players: data?.users || [],
        isLoading,
        isError: error
    };
}

export function useLeaderboards(guildId: string, type: string, month?: string) {
    const endpoint = type === 'playtime'
        ? `/nexuscore-api/v0.2/guilds/${guildId}/leaderboard/playtime/${month}`
        : `/nexuscore-api/v0.2/guilds/${guildId}/leaderboard/${type}`;

    const { data, error, isLoading } = useSWR<{ leaderboard: LeaderboardEntry[] }>(
        endpoint,
        fetcher
    );

    return {
        leaderboard: data?.leaderboard || [],
        isLoading,
        isError: error
    };
}

export function usePlayerPlaytime(thornyId: number) {
    const { data, error, isLoading } = useSWR<PlaytimeData>(
        thornyId ? `/nexuscore-api/v0.2/users/${thornyId}/playtime` : null,
        fetcher
    );

    return {
        playtime: data,
        isLoading,
        isError: error
    };
}

export function usePlayerQuest(thornyId: number) {
    const {
        data,
        error,
        isLoading
    } = useSWR<QuestProgress>(
        thornyId ? `/nexuscore-api/v0.2/quests/progress/${thornyId}/active` : null,
        fetcher
    );

    return {
        progress: data,
        isLoading,
        isError: error
    };
}

export function useServerStatus() {
    const { data, error, isLoading } = useSWR<ServerStatus>(
        '/amethyst/server/details',
        fetcher,
        { refreshInterval: 10000 }
    );

    return {
        status: data,
        isLoading,
        isError: error
    };
}
