import { ThornyUser } from "@/types/thorny-user";

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
    image_url?: string;
    owner: ThornyUser;
}
