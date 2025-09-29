import useSWR from "swr";

export interface ServerInfo {
    minecraft_version: string;
    geode_version: string;
    server_start: string;
    geode_start: string;
    status: "stopped" | "started" | "backup" | "map_update" | string;
    tasks: { name: string; coro: string }[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useServerInfo() {
    const { data, error, mutate } = useSWR<ServerInfo>("/amethyst/info/", fetcher, { refreshInterval: 5000 });
    return {
        info: data,
        isLoading: !data && !error,
        error,
        mutate,
    };
}

export function useServerStatus() {
    // Separate fetch for status
    const { data, error, mutate } = useSWR<{ status: ServerInfo["status"] }>("/amethyst/info/status", fetcher, { refreshInterval: 5000 });
    return {
        status: data?.status,
        isLoading: !data && !error,
        error,
        mutate,
    };
}
