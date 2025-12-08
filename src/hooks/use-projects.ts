// hooks/use-projects.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project } from "@/types/projects";

const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL;

const fetchProjects = async (): Promise<Project[]> => {
    const res = await fetch(`${API_URL}/v0.2/projects`);
    if (!res.ok) {
        throw new Error("Failed to fetch projects");
    }
    return res.json();
};

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
        staleTime: 60_000,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
}

const patchProjectRequest = async (
    projId: string,
    payload: Partial<Project>,
) => {
    const res = await fetch(`${API_URL}/v0.2/projects/${projId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("Failed to update project");
    }
    return res;
};

const postStatusRequest = async (
    projId: string,
    payload: { status: string },
) => {
    const res = await fetch(`${API_URL}/v0.2/projects/${projId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("Failed to update project status");
    }
    return res;
};

export function usePatchProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         projId,
                         payload,
                     }: {
            projId: string;
            payload: Partial<Project>;
        }) => patchProjectRequest(projId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

export function usePostStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         projId,
                         payload,
                     }: {
            projId: string;
            payload: { status: string };
        }) => postStatusRequest(projId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}
