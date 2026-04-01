import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { DiscordGuild } from '@/types/discord-guild';

export const useDiscordGuilds = () => {
    return useQuery({
        queryKey: ['discord', 'guilds'],
        queryFn: async (): Promise<DiscordGuild[]> => {
            const tokenResponse = await authClient.getAccessToken({ providerId: 'discord' });
            if (!tokenResponse.data?.accessToken) {
                throw new Error('No Discord access token available');
            }
            const response = await fetch('https://discord.com/api/users/@me/guilds', {
                headers: { Authorization: `Bearer ${tokenResponse.data.accessToken}` },
            });
            if (!response.ok) throw new Error('Failed to fetch Discord guilds');
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
    });
};
