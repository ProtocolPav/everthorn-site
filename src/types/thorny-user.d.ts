export interface ThornyUserProfile {
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
}

export interface ThornyUser {
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
    thorny_id: number;
    user_id: string;
    guild_id: string;
    join_date: string;
    profile: ThornyUserProfile;
}
