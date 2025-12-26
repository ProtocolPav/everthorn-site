// types/admin.ts
import {APIQuestSchema, ObjectiveSchema} from "@/types/quest";

export interface OnlineUser {
    thorny_id: number;
    discord_id: number;
    session: string;
}

export interface LeaderboardEntry {
    value: number;
    thorny_id: number;
    discord_id: number;
}

export interface PlaytimeData {
    thorny_id: number;
    total: number;
    session: string;
    daily: Array<{
        day: string;
        playtime: number;
    }>;
    monthly: Array<{
        month: string;
        playtime: number;
    }>;
}

// --- Target Progress Types ---
export interface MineTargetProgress {
    target_uuid?: string;
    target_type: 'mine';
    count: number;
}

export interface KillTargetProgress {
    target_uuid?: string;
    target_type: 'kill';
    count: number;
}

export interface ScriptEventTargetProgress {
    target_uuid?: string;
    target_type: 'scriptevent';
    count: number;
}

export type TargetProgress = MineTargetProgress | KillTargetProgress | ScriptEventTargetProgress;

// --- Customization Progress Types ---
export interface DeathCustomizationProgress {
    deaths: number;
}

export interface CustomizationProgress {
    maximum_deaths?: DeathCustomizationProgress | null;
    // Add other customization progress types here as they appear in your schema
}

// --- Main Progress Interfaces ---
export interface ObjectiveProgress {
    start_time: string | null;
    end_time: string | null;
    status: 'active' | 'pending' | 'completed' | 'failed';

    // The specific progress list for this objective's targets
    target_progress: TargetProgress[];

    // The specific progress for customizations (e.g. deaths tracked)
    customization_progress: CustomizationProgress;

    progress_id: number;   // ID of the parent QuestProgress
    objective_id: number;  // ID linking to the static ObjectiveSchema
}

export interface QuestProgress {
    accept_time: string;
    start_time: string | null;
    end_time: string | null;
    status: 'active' | 'pending' | 'completed' | 'failed';

    progress_id: number;
    thorny_id: number;
    quest_id: number;

    objectives: ObjectiveProgress[];
}

export interface GuildPlaytime {
    total_playtime: number;
    total_unique_players: number;
    daily_playtime: Array<{
        day: string;
        total: number;
        unique_players: number;
        total_sessions: number;
        average_playtime_per_session: number;
    }>;
    weekly_playtime: Array<{
        week: number;
        total: number;
        unique_players: number;
        total_sessions: number;
        average_playtime_per_session: number;
    }>;
    monthly_playtime: Array<{
        month: string;
        total: number;
    }>;
    peak_playtime_periods: any;
    peak_active_periods: any;
    daily_playtime_distribution: any;
    anomalies: any;
    predictive_insights: any;
}

export interface ServerStatus {
    server_online: boolean;
    server_status: string;
    status_check: boolean;
    update: boolean;
    server_start: string;
    uptime: string;
    usage: any;
    last_backup: string;
}
