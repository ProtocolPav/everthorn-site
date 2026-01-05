// hooks/use-project.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from "@/types/projects";

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

interface UpdateProjectPayload {
    name?: string | null;
    description?: string | null;
    coordinates?: [number, number, number] | null;
    dimension?: string | null;
    owner_id?: number | null;
    pin_id?: number | null;
    thread_id?: number | null;
    started_on?: string | null;
    completed_on?: string | null;
}

const updateProjectFetcher = async (
    projectId: string,
    payload: UpdateProjectPayload
): Promise<Project> => {
    const response = await fetch(`${API_URL}/v0.2/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to update project');
    }

    return response.json();
};

export function useProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: () => list_fetcher(`${API_URL}/v0.2/projects`),
        gcTime: Infinity,
    });
}

export function useProject(projectId: string | null | undefined) {
    return useQuery({
        queryKey: ['projects', projectId],
        queryFn: () => fetcher(`${API_URL}/v0.2/projects/${projectId}`),
        enabled: !!projectId,
        gcTime: Infinity,
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, payload }: { projectId: string; payload: UpdateProjectPayload }) =>
            updateProjectFetcher(projectId, payload),
        onSuccess: (data, variables) => {
            // Update the specific project in cache
            queryClient.setQueryData(['projects', variables.projectId], data);

            // Invalidate and refetch the projects list
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
}
