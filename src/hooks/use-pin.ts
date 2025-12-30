// hooks/use-pin.ts
import { useQuery } from '@tanstack/react-query';
import {Pin} from "@/types/pins";

const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL;

const list_fetcher = async (url: string): Promise<Pin[]> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch pins data');
    }
    return response.json();
};

const fetcher = async (url: string): Promise<Pin> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch pins data');
    }
    return response.json();
};

export function usePins() {
    return useQuery({
        queryKey: ['pins'],
        queryFn: () => list_fetcher(`${API_URL}/v0.2/pins`),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
    });
}

export function usePin(pinId: string | null | undefined) {
    return useQuery({
        queryKey: ['pins', pinId],
        queryFn: () => fetcher(`${API_URL}/v0.2/pins/${pinId}`).then(),
        enabled: !!pinId,
        staleTime: 5 * 60 * 1000,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}
