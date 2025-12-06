// types/wrapped.ts
import { ThornyUser } from '@/hooks/use-thorny-user';

export interface PlaytimeMetrics {
    total_seconds: number;
    highest_day: string;
    highest_day_seconds: number;
    most_active_hour: number;
    most_active_hour_sessions: number;
    most_active_hour_seconds: number;
}

export interface QuestMetrics {
    total_accepted: number;
    total_completed: number;
    total_failed: number;
    completion_rate: number;
    fastest_quest_title: string;
    fastest_quest_start_time: string;
    fastest_quest_completion_time: string;
    fastest_quest_duration_seconds: number;
}

export interface RewardMetrics {
    total_rewards: number;
    total_balance_earned: number;
    total_items_earned: number;
    unique_items: number;
}

export interface KillCount {
    mob_type: string;
    kill_count: number;
}

export interface FavouriteBlock {
    category: 'placed' | 'mined';
    month_name: string;
    month_number: number;
    favorite_block: string;
    count: number;
}

export interface InteractionMetrics {
    blocks_placed: number;
    blocks_mined: number;
    net_difference: number;
    player_type: 'Creator' | 'Destroyer' | 'Balanced Builder';
    arch_nemesis: string;
    death_count: number;
    kill_counts: KillCount[];
    block_timeline: FavouriteBlock[];
}

export interface ProjectMetrics {
    favourite_project_id: string;
    favourite_project_name: string;
    favourite_project_blocks_placed: number;
    most_active_project_id: string;
    most_active_project_name: string;
    most_active_project_blocks_placed: number;
    most_active_project_blocks_mined: number;
    most_active_project_interactions: number;
    most_active_project_total_activity: number;
}

export interface GrindDayMetrics {
    grind_date: string;
    sessions: number;
    hours_played: number;
    first_login: string;
    last_logout: string;
    blocks: number;
    blocks_placed: number;
    blocks_mined: number;
    mob_kills: number;
    interactions: number;
    quests_completed: number;
    total_combined_actions: number;
}

export interface FavouritePerson {
    other_player_id: number;
    username: string;
    seconds_played_together: number;
}

export interface SocialMetrics {
    favourite_people: FavouritePerson[];
}

export interface EverthornWrapped {
    thorny_id: number;
    username: string;
    playtime: PlaytimeMetrics | null;
    quests: QuestMetrics | null;
    rewards: RewardMetrics | null;
    interactions: InteractionMetrics | null;
    projects: ProjectMetrics | null;
    grind_day: GrindDayMetrics | null;
    social: SocialMetrics | null;
}

export interface FavouritePersonEnriched extends FavouritePerson {
    user: ThornyUser | null;
}

export interface SocialMetricsEnriched {
    favourite_people: FavouritePersonEnriched[];
}

export interface EverthornWrappedEnriched extends Omit<EverthornWrapped, 'social'> {
    social: SocialMetricsEnriched | null;
}

