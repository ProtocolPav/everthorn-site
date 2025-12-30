// hooks/use-players.ts
import { useQuery } from "@tanstack/react-query";
import {Player} from "@/types/online-players";

const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL;

const fetchPlayers = async (guildId: string): Promise<Player[]> => {
    const res = await fetch(`${API_URL}/v0.2/guilds/${guildId}/online`);
    if (!res.ok) {
        throw new Error("Failed to fetch players");
    }
    return res.json();
};

export function usePlayers(guildId: string | null | undefined) {
    return useQuery({
        queryKey: ["players", guildId],
        queryFn: () => fetchPlayers(guildId as string),
        enabled: !!guildId,
        staleTime: 1_000,
        gcTime: Infinity,
        refetchInterval: 1_000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
}
