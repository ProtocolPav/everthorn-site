// hooks/use-project.ts
import { useQuery } from '@tanstack/react-query';

export interface Project {
    name: string;
    description: string;
    coordinates: [number, number, number];
    dimension: string;
    owner_id: number;
    pin_id: number;
    project_id: string;
    thread_id: number;
    started_on: string;
    completed_on: string | null;
    status: 'ongoing' | 'completed' | 'abandoned';
    status_since: string;
    owner: {
        username: string;
        birthday: string;
        balance: number;
        active: boolean;
        role: string;
        patron: boolean;
        level: number;
        xp: number;
        required_xp: number;
        last_message: string;
        gamertag: string;
        whitelist: string;
        location: [number, number, number];
        dimension: string;
        hidden: boolean;
        thorny_id: number;
        user_id: string;
        guild_id: string;
        join_date: string;
        profile: {
            slogan: string;
            aboutme: string;
            lore: string;
            character_name: string;
            character_age: number;
            character_race: string;
            character_role: string;
            character_origin: string;
            character_beliefs: string;
            agility: number;
            valor: number;
            strength: number;
            charisma: number;
            creativity: number;
            ingenuity: number;
            thorny_id: number;
        };
    };
}

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
