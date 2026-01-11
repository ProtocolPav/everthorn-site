// hooks/useUser.ts
import useSWR from 'swr';

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
    xuid: string;
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

const fetcher = async (url: string): Promise<ThornyUser> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    return response.json();
};

export function useUser(thornyId: number) {
    const { data, error, isLoading, mutate } = useSWR<ThornyUser>(
        thornyId ? `/nexuscore-api/v0.2/users/${thornyId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: Infinity,
            revalidateIfStale: false,
        }
    );

    return {
        user: data,
        isLoading,
        isError: error,
        mutate,
    };
}

// ✅ FIXED: Use a single SWR call instead of multiple conditional hooks
export function useUsers(thornyIds: number[]) {
    // Create a stable key for the SWR cache
    const key = thornyIds.length > 0 ? `users-${thornyIds.sort().join(',')}` : null;

    const { data, error, isLoading, mutate } = useSWR(
        key,
        async () => {
            if (thornyIds.length === 0) return [];

            // Fetch all users in parallel
            const promises = thornyIds.map(id =>
                fetch(`/nexuscore-api/v0.2/users/${id}`)
                    .then(res => res.ok ? res.json() : null)
                    .catch(() => null)
            );

            const results = await Promise.all(promises);
            return results.filter(Boolean) as ThornyUser[];
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000,
        }
    );

    return {
        users: data || [],
        isLoading,
        errors: error ? [error] : [],
        mutateAll: mutate,
    };
}
