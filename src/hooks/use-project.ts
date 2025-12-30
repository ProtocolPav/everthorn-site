// hooks/use-project.ts
import { useQuery } from '@tanstack/react-query';
import {Project} from "@/types/projects";

const API_URL = import.meta.env.VITE_NEXUSCORE_API_URL;

const list_fetcher = async (url: string): Promise<Project[]> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch projects data');
    }
    return response.json();
};

const fetcher = async (url: string): Promise<Project> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch projects data');
    }
    return response.json();
};

export function useProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: () => list_fetcher(`${API_URL}/v0.2/projects`),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
    });
}

export function useProject(projectId: string | null | undefined) {
    return useQuery({
        queryKey: ['projects', projectId],
        queryFn: () => fetcher(`${API_URL}/v0.2/projects/${projectId}`).then(),
        enabled: !!projectId,
        staleTime: 5 * 60 * 1000,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}
