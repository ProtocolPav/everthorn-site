import { z } from "zod";
import {MinecraftEnchantmentTypes, MinecraftPotionDeliveryTypes, MinecraftPotionEffectTypes} from "@minecraft/vanilla-data";

// =========================================
// 1. Customizations Schemas
// =========================================

export const locationCustomizationSchema = z.object({
    coordinates: z.tuple([
        z.coerce.number(),
        z.coerce.number(),
        z.coerce.number()
    ]),
    horizontal_radius: z.coerce.number().min(0),
    vertical_radius: z.coerce.number().min(0),
});

export const mainhandCustomizationSchema = z.object({
    item: z.string().min(1, "Item name is required"),
});

export const maximumDeathsCustomizationSchema = z.object({
    deaths: z.coerce.number().min(1),
    fail: z.boolean().default(true),
});

export const naturalBlockCustomizationSchema = z.object({
    // Empty object as per interface; presence implies true in your logic
});

export const timerCustomizationSchema = z.object({
    seconds: z.coerce.number().min(1),
    fail: z.boolean().default(true),
});

export const customizationsSchema = z.object({
    mainhand: mainhandCustomizationSchema.nullable().optional(),
    location: locationCustomizationSchema.nullable().optional(),
    timer: timerCustomizationSchema.nullable().optional(),
    maximum_deaths: maximumDeathsCustomizationSchema.nullable().optional(),
    natural_block: naturalBlockCustomizationSchema.nullable().optional(),
});

// =========================================
// 2. Targets Schemas (Discriminated Union)
// =========================================

const killTargetSchema = z.object({
    target_type: z.literal("kill"),
    count: z.coerce.number().min(1),
    entity: z.string().min(1, "Entity is required"),
});

const mineTargetSchema = z.object({
    target_type: z.literal("mine"),
    count: z.coerce.number().min(1),
    block: z.string().min(1, "Block is required"),
});

const scriptEventTargetSchema = z.object({
    target_type: z.literal("scriptevent"),
    count: z.coerce.number().min(1),
    script_id: z.string().min(1, "Script ID is required"),
});

export const targetSchema = z.discriminatedUnion("target_type", [
    killTargetSchema,
    mineTargetSchema,
    scriptEventTargetSchema,
]);

// =========================================
// 3. Reward Metadata Schemas (Discriminated Union)
// =========================================

const damageModelSchema = z.object({
    metadata_type: z.literal("damage"),
    damage_percentage: z.coerce.number(),
});

const enchantmentModelSchema = z.object({
    metadata_type: z.literal("enchantment"),
    enchantment_id: z.enum(MinecraftEnchantmentTypes),
    enchantment_level: z.coerce.number().min(1),
});

const loreModelSchema = z.object({
    metadata_type: z.literal("lore"),
    item_lore: z.array(z.string()),
});

const nameModelSchema = z.object({
    metadata_type: z.literal("name"),
    item_name: z.string().min(1),
});

const potionModelSchema = z.object({
    metadata_type: z.literal("potion"),
    potion_effect: z.enum(MinecraftPotionEffectTypes),
    potion_delivery: z.enum(MinecraftPotionDeliveryTypes)
});

const randomEnchantmentModelSchema = z.object({
    metadata_type: z.literal("enchantment_random"),
    level_min: z.coerce.number().min(1),
    level_max: z.coerce.number().min(1),
    treasure: z.boolean(),
});

export const rewardMetadataSchema = z.discriminatedUnion("metadata_type", [
    damageModelSchema,
    enchantmentModelSchema,
    loreModelSchema,
    nameModelSchema,
    potionModelSchema,
    randomEnchantmentModelSchema,
]);

// =========================================
// 4. Reward Schema
// =========================================

export const rewardSchema = z.object({
    balance: z.coerce.number().nullable().optional(),
    item: z.string().nullable().optional(),
    count: z.coerce.number().nullable().optional(),
    display_name: z.string().nullable().optional(),
    item_metadata: z.array(rewardMetadataSchema).default([]),
});

// =========================================
// 5. Objective Schema
// =========================================

export const objectiveSchema = z.object({
    description: z.string().min(1, "Description is required"),
    display: z.string().nullable().optional(),
    order_index: z.coerce.number().default(0),
    objective_type: z.enum(["kill", "mine", "scriptevent"]),
    logic: z.enum(["and", "or", "sequential"]),
    target_count: z.coerce.number().nullable().optional(),
    targets: z.array(targetSchema).default([]),
    customizations: customizationsSchema.default({}),
    rewards: z.array(rewardSchema).default([]),
});

// =========================================
// 6. Main Quest Form Schema
// =========================================

export const questFormSchema = z.object({
    start_time: z.iso.datetime({offset: true, error: "aaaa"}),
    end_time: z.iso.datetime({offset: true, error: "bbbb"}),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(300, "Woah! This is a bit too long eh?"),
    created_by: z.coerce.number(),
    tags: z.array(z.string()).default([]),
    quest_type: z.enum(["minor", "side", "story", "weekly"]),
    objectives: z.array(objectiveSchema).default([]),
});

// Export inferred types for usage in your Tanstack Form components
export type QuestFormValues = z.infer<typeof questFormSchema>;
export type ObjectiveFormValues = z.infer<typeof objectiveSchema>;
export type TargetFormValues = z.infer<typeof targetSchema>;
export type RewardFormValues = z.infer<typeof rewardSchema>;
