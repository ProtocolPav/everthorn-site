// hooks/use-guild-playtime.ts
import { useQuery } from '@tanstack/react-query';
import {GuildPlaytime} from "@/types/guild-playtime";

const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL

const fetcher = async (url: string): Promise<GuildPlaytime> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    return response.json();
};

export function useGuildPlaytime(guildId: string | null | undefined) {
    return useQuery({
        queryKey: ['guilds', guildId, 'playtime'],
        queryFn: () => fetcher(`${API_URL}/v0.2/guilds/${guildId}/playtime`),
        enabled: !!guildId,
        staleTime: Infinity,
        gcTime: Infinity, // Replaces cacheTime in v5
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}
