import { queryOptions, useQuery } from "@tanstack/react-query";

export interface ServerInfo {
    minecraft_version: string;
    geode_version: string;
    server_start: string;
    geode_start: string;
    status: "stopped" | "started" | "backup" | "map_update" | string;
    tasks: { name: string; coro: string }[];
}

const GEODE_URL = import.meta.env.VITE_GEODE_URL;

const infoFetcher = async (url: string): Promise<ServerInfo> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch server info");
    return response.json();
};

const statusFetcher = async (url: string): Promise<{ status: ServerInfo["status"] }> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch server status");
    return response.json();
};

export const serverInfoQueryOptions = queryOptions({
    queryKey: ["server", "info"],
    queryFn: () => infoFetcher(`${GEODE_URL}/info/`),
    refetchInterval: 5000,
});

export const serverStatusQueryOptions = queryOptions({
    queryKey: ["server", "status"],
    queryFn: () => statusFetcher(`${GEODE_URL}/info/status`),
    refetchInterval: 5000,
});

export function useServerInfo() {
    const { data, isLoading, error, refetch } = useQuery(serverInfoQueryOptions);
    return { info: data, isLoading, error, refetch };
}

export function useServerStatus() {
    const { data, isLoading, error, refetch } = useQuery(serverStatusQueryOptions);
    return { status: data?.status, isLoading, error, refetch };
}