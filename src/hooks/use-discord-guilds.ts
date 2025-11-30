import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client'; // Your BetterAuth client

interface DiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    features: string[];
}

export const useDiscordGuilds = () => {
    return useQuery({
        queryKey: ['discord', 'guilds'],
        queryFn: async (): Promise<DiscordGuild[]> => {
            // Get the access token from BetterAuth
            const tokenResponse = await authClient.getAccessToken({
                providerId: 'discord',
            });

            if (!tokenResponse.data?.accessToken) {
                throw new Error('No Discord access token available');
            }

            // Fetch guilds from Discord API
            const response = await fetch('https://discord.com/api/users/@me/guilds', {
                headers: {
                    Authorization: `Bearer ${tokenResponse.data.accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Discord guilds');
            }

            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
