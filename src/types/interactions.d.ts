export interface Interaction {
    interaction_id: string;
    thorny_id: number;
    type: string;
    reference: string;
    mainhand?: string;
    dimension: string;
    coordinates: [number, number, number];
    time: string;
}

export interface InteractionFilters {
    coordinates: number[];
    coordinates_end: number[];
    thorny_ids: number[];
    interaction_types: string[];
    references: string[];
    dimensions: string[];
    time_start: string;
    time_end: string;
}

export interface UIFilters {
    interaction_types: string[];
    dimensions: string[];
    references: string[];
    thorny_ids: number[];
    coordinates: string[]; // Store as strings for input, convert to numbers when needed
    coordinates_end: string[];
    time_start: string;
    time_end: string;
}

export interface User {
    username: string;
}
