interface RewardSchema {
    balance: number | null,
    display_name: string | null,
    item: string | null,
    count: number,
    item_metadata: object[]
}

interface ObjectiveSchema {
    display: string | null,
    order_index: number,
    description: string,
    objective_type: string,
    target_count: number,
    logic: string,
    targets: (MineTarget | KillTarget | EncounterTarget)[],
    customizations: (MainhandCustomization | TimerCustomization | MaximumDeathsCustomization | NaturalBlockCustomization | LocationCustomization)[],
    rewards: RewardSchema[] | null
}

interface OldObjectiveSchema {
    objective: string,
    display: string | null,
    order: number,
    description: string,
    objective_count: number,
    objective_type: string,
    natural_block: boolean,
    objective_timer: number | null,
    required_mainhand: string | null,
    location_radius: number | null,
    required_location: number[] | null,
    continue_on_fail: boolean,
    required_deaths: number | null,
    rewards: RewardSchema[] | null
}

export interface QuestSchema {
    start_time: string,
    end_time: string,
    title: string,
    description: string,
    created_by: number,
    tags: string[],
    quest_type: string,
    objectives: (ObjectiveSchema | OldObjectiveSchema)[]
}

export interface APIQuestSchema {
    quest_id: number,
    start_time: string,
    end_time: string,
    title: string,
    description: string,
    created_by: number,
    tags: string[],
    quest_type: string,
    objectives: (ObjectiveSchema | OldObjectiveSchema)[]
}

// Objective Targets

export interface MineTarget {
    target_type: string,
    count: number,
    block: string
}

export interface KillTarget {
    target_type: string,
    count: number,
    entity: string
}

export interface EncounterTarget {
    target_type: string,
    count: number,
    script_id: string
}

// Objective Customizations

export interface MainhandCustomization {
    customization_type: string,
    item: string
}

export interface LocationCustomization {
    customization_type: string,
    coordinates: number[],
    horizontal_radius: number,
    vertical_radius: number
}

export interface NaturalBlockCustomization {
    customization_type: string
}

export interface TimerCustomization {
    customization_type: string,
    seconds: number,
    fail: boolean
}

export interface MaximumDeathsCustomization {
    customization_type: string,
    deaths: number,
    fail: boolean
}