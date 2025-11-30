// hooks/use-thorny-user.ts
import { useQuery, useQueries } from '@tanstack/react-query';

export interface ThornyUser {
    username: string;
    birthday: string;
    balance: number;
    active: boolean;
    role: string;
    patron: boolean;
    level: number;
    xp: number;
    required_xp: number;
    last_message: string;
    gamertag: string;
    whitelist: string;
    thorny_id: number;
    user_id: string;
    guild_id: string;
    join_date: string;
    profile: {
        slogan: string;
        aboutme: string;
        lore: string;
        character_name: string;
        character_age: number;
        character_race: string;
        character_role: string;
        character_origin: string;
        character_beliefs: string;
        agility: number;
        valor: number;
        strength: number;
        charisma: number;
        creativity: number;
        ingenuity: number;
        thorny_id: number;
    };
}

const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL

const fetcher = async (url: string): Promise<ThornyUser> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    return response.json();
};

export function useThornyUser(thornyId: number | null | undefined) {
    return useQuery({
        queryKey: ['user', thornyId],
        queryFn: () => fetcher(`${API_URL}/v0.2/users/${thornyId}`),
        enabled: !!thornyId,
        staleTime: Infinity,
        gcTime: Infinity, // Replaces cacheTime in v5
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}

export function useThornyUsers(thornyIds: number[]) {
    const results = useQueries({
        queries: thornyIds.map((id) => ({
            queryKey: ['user', id],
            queryFn: () => fetcher(`${API_URL}/v0.2/users/${id}`),
            staleTime: 60000, // 1 minute
            gcTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: (failureCount: number) => {
                // Don't retry on 404s
                return failureCount < 2;
            },
        })),
    });

    return {
        users: results
            .map((result) => result.data)
            .filter(Boolean) as ThornyUser[],
        isLoading: results.some((result) => result.isLoading),
        errors: results
            .filter((result) => result.error)
            .map((result) => result.error),
        results, // Raw results for more control
    };
}

export function useThornyUserByDiscordId(
    discordId: string | null | undefined,
    guildId: string | null | undefined
) {
    return useQuery({
        queryKey: ['user', 'guild', guildId, discordId],
        queryFn: async (): Promise<ThornyUser> => {
            const response = await fetch(
                `${API_URL}/v0.2/users/guild/${guildId}/${discordId}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.status}`);
            }

            return response.json();
        },
        enabled: !!discordId && !!guildId,
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}
