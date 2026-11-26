import { z } from "zod";
import { locationCustomizationSchema, rewardMetadataSchema } from "@/lib/schemas/quest-form.tsx";
import {
    isTemplateCustomizationAllowed,
    TEMPLATE_CUSTOMIZATION_IDS,
} from "@/config/quests/daily-template-options.ts";

/**
 * Client-side validation for daily templates. Mirrors Nexuscore's
 * DailyTemplateIn / RandomCount validators so most mistakes are caught
 * before saving or previewing.
 */

// ---------- RandomCount ----------

const randomCountShape = z.object({
    min: z.number().int().nullable().optional(),
    max: z.number().int().nullable().optional(),
    choices: z.array(z.number().int()).nullable().optional(),
});

/**
 * A `{min, max}` range or a list of `{choices}`, never both.
 * `minimum` is the smallest value it may roll (0, or 1 for counts).
 */
export function randomCountSchema(minimum = 0) {
    return randomCountShape.superRefine((value, ctx) => {
        const hasChoices = value.choices != null;
        const hasRange = value.min != null || value.max != null;

        if (hasChoices && hasRange) {
            ctx.addIssue({ code: "custom", message: "Use a range or choices, not both" });
            return;
        }

        if (hasChoices) {
            if (value.choices!.length === 0) {
                ctx.addIssue({ code: "custom", message: "Add at least one value" });
            } else if (value.choices!.some((choice) => choice < minimum)) {
                ctx.addIssue({ code: "custom", message: `Values must be at least ${minimum}` });
            }
            return;
        }

        if (value.min == null || value.max == null) {
            ctx.addIssue({ code: "custom", message: "Set a minimum and maximum" });
        } else if (value.min < minimum) {
            ctx.addIssue({ code: "custom", message: `The minimum must be at least ${minimum}` });
        } else if (value.min > value.max) {
            ctx.addIssue({ code: "custom", message: "Min can't be larger than max" });
        }
    });
}

export type RandomCountValue = z.infer<typeof randomCountShape>;

const chanceSchema = z.number().min(0, "Chance must be 0–100%").max(1, "Chance must be 0–100%");

// ---------- Target options ----------

const targetUuid = z.string().default(() => crypto.randomUUID());
const targetCount = randomCountSchema(1);

const killTargetOptionSchema = z.object({
    target_uuid: targetUuid,
    target_type: z.literal("kill"),
    count: targetCount,
    entity: z.string().min(1, "Entity is required"),
});

const mineTargetOptionSchema = z.object({
    target_uuid: targetUuid,
    target_type: z.literal("mine"),
    count: targetCount,
    block: z.string().min(1, "Block is required"),
});

const scriptEventTargetOptionSchema = z.object({
    target_uuid: targetUuid,
    target_type: z.literal("scriptevent"),
    count: targetCount,
    script_id: z.string().min(1, "Script ID is required"),
});

const visitTargetOptionSchema = z.object({
    target_uuid: targetUuid,
    target_type: z.literal("visit"),
    count: targetCount,
    helper_text: z.string().min(1, "Helper text is required"),
    coordinates: z.tuple([z.coerce.number(), z.coerce.number(), z.coerce.number()]),
    horizontal_radius: z.coerce.number().min(0),
    vertical_radius: z.coerce.number().nullable().optional(),
    seconds: z.coerce.number().min(1),
});

export const targetOptionSchema = z.discriminatedUnion("target_type", [
    killTargetOptionSchema,
    mineTargetOptionSchema,
    scriptEventTargetOptionSchema,
    visitTargetOptionSchema,
]);

// ---------- Customization options ----------

export const templateCustomizationsSchema = z.object({
    mainhand: z
        .object({
            chance: chanceSchema,
            items: z.array(z.string().min(1)).min(1, "Pick at least one item"),
        })
        .nullable()
        .optional(),
    location: z
        .object({
            chance: chanceSchema,
            locations: z.array(locationCustomizationSchema).min(1, "Add at least one location"),
            show_waypoint: z.boolean().default(true),
        })
        .nullable()
        .optional(),
    timer: z
        .object({
            chance: chanceSchema,
            seconds: randomCountSchema(1),
            fail: z.boolean().default(true),
        })
        .nullable()
        .optional(),
    maximum_deaths: z
        .object({
            chance: chanceSchema,
            deaths: randomCountSchema(1),
            fail: z.boolean().default(true),
        })
        .nullable()
        .optional(),
    natural_block: z.object({ chance: chanceSchema }).nullable().optional(),
});

// ---------- Reward options ----------

export const rewardOptionSchema = z
    .object({
        balance: randomCountSchema(0).nullable().optional(),
        item: z.string().nullable().optional(),
        count: randomCountSchema(1).nullable().optional(),
        display_name: z.string().nullable().optional(),
        item_metadata: z.array(rewardMetadataSchema).default([]),
    })
    .superRefine((reward, ctx) => {
        const hasBalance = reward.balance != null;
        const hasItem = reward.item != null && reward.item.length > 0;

        if (hasBalance && hasItem) {
            ctx.addIssue({ code: "custom", message: "A reward can't have both a balance and an item", path: ["item"] });
        } else if (!hasBalance && !hasItem) {
            ctx.addIssue({ code: "custom", message: "Select an item", path: ["item"] });
        }
        if (hasItem && reward.count == null) {
            ctx.addIssue({ code: "custom", message: "An item reward needs a count", path: ["count"] });
        }
    });

// ---------- Template ----------

export const dailyTemplateFormSchema = z
    .object({
        name: z.string().trim().min(1, "Give the template a name"),
        enabled: z.boolean().default(true),
        weight: z.coerce.number().int("Weight must be a whole number").min(1, "Weight must be at least 1"),
        created_by: z.coerce.number({ error: "Pick who the quests are credited to" }),
        title: z.string().trim().min(1, "Title is required"),
        description: z.string().trim().min(1, "Description is required"),
        objective_description: z.string().trim().min(1, "Objective description is required"),
        objective_display: z.string().nullable().optional(),
        objective_type: z.enum(["kill", "mine", "scriptevent", "visit"]),
        logic: z.enum(["and", "or", "sequential"]),
        targets: z.array(targetOptionSchema).min(1, "Add at least one target"),
        target_picks: randomCountSchema(1).nullable().optional(),
        target_count: randomCountSchema(1).nullable().optional(),
        customizations: templateCustomizationsSchema.default({}),
        rewards: z.array(rewardOptionSchema).default([]),
        reward_picks: z.coerce.number().int().min(0, "Can't be negative"),
    })
    .superRefine((template, ctx) => {
        template.targets.forEach((target, index) => {
            if (target.target_type !== template.objective_type) {
                ctx.addIssue({
                    code: "custom",
                    message: "Every target must match the objective type",
                    path: ["targets", index],
                });
            }
        });

        if (template.logic === "or" && template.target_count == null) {
            ctx.addIssue({ code: "custom", message: "Set how many in total for “any”", path: ["target_count"] });
        }

        for (const id of TEMPLATE_CUSTOMIZATION_IDS) {
            if (template.customizations[id] != null && !isTemplateCustomizationAllowed(id, template.objective_type)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Not allowed on ${template.objective_type} objectives`,
                    path: ["customizations", id],
                });
            }
        }
    });

export type DailyTemplateFormValues = z.infer<typeof dailyTemplateFormSchema>;
export type TargetOptionFormValues = z.infer<typeof targetOptionSchema>;
export type RewardOptionFormValues = z.infer<typeof rewardOptionSchema>;
export type TemplateCustomizationsFormValues = z.infer<typeof templateCustomizationsSchema>;
