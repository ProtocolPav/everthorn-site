// hooks/use-wrapped.ts
import useSWR from 'swr';
import { EverthornWrapped } from '@/types/wrapped';

const fetcher = async (url: string): Promise<EverthornWrapped> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch wrapped data');
    }
    return response.json();
};

export function useWrapped(thornyId: number | null) {
    const { data, error, isLoading, mutate } = useSWR<EverthornWrapped>(
        thornyId ? `/nexuscore-api/v0.2/wrapped/${thornyId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: Infinity,
            revalidateIfStale: false,
        }
    );

    return {
        wrapped: data,
        isLoading,
        isError: error,
        mutate,
    };
}
