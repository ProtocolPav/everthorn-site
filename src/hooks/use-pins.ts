// hooks/use-pins.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Pin } from "@/types/pins";

const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL;

const fetchPins = async (): Promise<Pin[]> => {
    const res = await fetch(`${API_URL}/v0.2/pins`);
    if (!res.ok) {
        throw new Error("Failed to fetch pins");
    }
    return res.json();
};

export function usePins() {
    return useQuery({
        queryKey: ["pins"],
        queryFn: fetchPins,
        staleTime: 30_000,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
}

const patchPinRequest = async (pinId: number, payload: Partial<Pin>) => {
    const res = await fetch(`${API_URL}/v0.2/pins/${pinId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("Failed to update pin");
    }
    return res;
};

const postPinRequest = async (payload: Partial<Pin>) => {
    const res = await fetch(`${API_URL}/v0.2/pins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("Failed to create pin");
    }
    return res;
};

export function usePatchPin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ pinId, payload }: { pinId: number; payload: Partial<Pin> }) =>
            patchPinRequest(pinId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pins"] });
        },
    });
}

export function usePostPin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Partial<Pin>) => postPinRequest(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pins"] });
        },
    });
}
