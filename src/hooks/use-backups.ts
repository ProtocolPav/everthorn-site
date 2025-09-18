import useSWR from "swr";

export interface Backup {
    full_path: string;
    name: string;
    type: "hourly" | "daily" | "monthly" | string;
    timestamp: string; // UTC ISO string
    size_bytes: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useBackups() {
    const { data, error, mutate, isLoading } = useSWR<Backup[]>("/amethyst/backups/", fetcher);
    return {
        backups: data,
        error,
        mutate,
        isLoading,
    };
}
