import { queryOptions, useQuery } from "@tanstack/react-query";

export interface Backup {
    full_path: string;
    name: string;
    type: "hourly" | "daily" | "monthly" | string;
    timestamp: string;
    size_bytes: number;
}

const GEODE_URL = import.meta.env.VITE_GEODE_URL;

const backupsFetcher = async (url: string): Promise<Backup[]> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch backups");
    return response.json();
};

export const backupsQueryOptions = queryOptions({
    queryKey: ["backups"],
    queryFn: () => backupsFetcher(`${GEODE_URL}/backups/`),
});

export function useBackups() {
    const { data, isLoading, error, refetch } = useQuery(backupsQueryOptions);
    return { backups: data, isLoading, error, refetch };
}