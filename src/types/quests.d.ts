// Customizations
import {MinecraftEnchantmentTypes, MinecraftPotionDeliveryTypes, MinecraftPotionEffectTypes} from "@minecraft/vanilla-data";

export interface LocationCustomization {
    coordinates: [number, number, number];
    horizontal_radius: number;
    vertical_radius: number;
}

export interface MainhandCustomization {
    item: string;
}

export interface MaximumDeathsCustomization {
    deaths: number;
    fail: boolean;
}

export interface NaturalBlockCustomization {
    // Empty. Presence indicates TRUE
}

export interface TimerCustomization {
    seconds: number;
    fail: boolean;
}

export interface Customizations {
  mainhand?: MainhandCustomization | null;
  location?: LocationCustomization | null;
  timer?: TimerCustomization | null;
  maximum_deaths?: MaximumDeathsCustomization | null;
  natural_block?: NaturalBlockCustomization | null;
}

// Targets
export interface KillTargetModel {
    target_uuid?: string;
    target_type: "kill";
    count: number;
    entity: string;
}

export interface MineTargetModel {
    target_uuid?: string;
    target_type: "mine";
    count: number;
    block: string;
}

export interface ScriptEventTargetModel {
    target_uuid?: string;
    target_type: "scriptevent";
    count: number;
    script_id: string;
}

export type Target = MineTargetModel | KillTargetModel | ScriptEventTargetModel

// Reward Metadata
export interface DamageModel {
    metadata_type: "damage";
    damage_percentage: number;
}

export interface EnchantmentModel {
    metadata_type: "enchantment";
    enchantment_id: MinecraftEnchantmentTypes;
    enchantment_level: number;
}

export interface LoreModel {
    metadata_type: "lore";
    item_lore: string[];
}

export interface NameModel {
    metadata_type: "name";
    item_name: string;
}

export interface PotionModel {
    metadata_type: "potion";
    potion_effect: MinecraftPotionEffectTypes;
    potion_delivery: MinecraftPotionDeliveryTypes;
}

export interface RandomEnchantmentModel {
    metadata_type: "enchantment_random";
    level_min: number;
    level_max: number;
    treasure: boolean;
}

export type RewardMetadata = EnchantmentModel | RandomEnchantmentModel | LoreModel | NameModel | PotionModel | DamageModel

// Reward
export interface RewardModel {
    balance: number | null;
    item: string | null;
    count: number | null;
    display_name: string | null;
    item_metadata: RewardMetadata[];
    quest_id: number;
    objective_id: number;
    reward_id: number;
}

// Objective
export interface ObjectiveModel {
    description: string;
    display: string | null;
    order_index: number;
    objective_type: "kill" | "mine" | "scriptevent";
    logic: "and" | "or" | "sequential";
    target_count: number | null;
    targets: Target[];
    customizations: Customizations
    quest_id: number;
    objective_id: number;
    rewards: RewardModel[];
}

// Quest
export interface QuestModel {
  start_time: string;
  end_time: string;
  title: string;
  description: string;
  created_by: number;
  tags: string[];
  quest_type: "story" | "side" | "minor";
  quest_id: number;
  objectives: ObjectiveModel[];
}
