import useSWR from "swr"

export interface Player {
    thorny_id: number
    user_id: number
    session: string
    username: string
    whitelist: string
    location: number[]
    dimension: string
    xuid: string | null
    //hidden: boolean
}

export function usePlayers(guild_id: string): {players: Player[], isError: any, isLoading: boolean} {
    const fetcher = (...args: [any]) => fetch(...args).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`/nexuscore-api/v0.2/guilds/${guild_id}/online`, fetcher, {refreshInterval: 1000});

    return {
        players: data || [],
        isLoading,
        isError: error
    }
}