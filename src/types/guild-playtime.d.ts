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