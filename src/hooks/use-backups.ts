import { queryOptions, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

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

const restoreFetcher = async (url: string, fullPath: string, restoreType: "full" | "world") => {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ full_path: fullPath, restore_type: restoreType }),
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to restore backup");
};

export const backupsQueryOptions = queryOptions({
    queryKey: ["backups"],
    queryFn: () => backupsFetcher(`${GEODE_URL}/backups/`),
});

export function useBackups() {
    const queryClient = useQueryClient();
    const { data, isLoading, error, refetch } = useQuery(backupsQueryOptions);

    async function restoreBackup(fullPath: string, restoreType: "full" | "world" = "full") {
        await restoreFetcher(`${GEODE_URL}/backups/restore`, fullPath, restoreType);
        await queryClient.invalidateQueries({ queryKey: backupsQueryOptions.queryKey });
    }

    return { backups: data, isLoading, error, refetch, restoreBackup };
}