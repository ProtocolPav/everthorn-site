import { DEFAULT_TARGET_COUNT } from "@/config/quests/daily-template-options.ts";
import { templateToInput } from "@/lib/daily-quests.ts";
import type { DailyTemplateFormValues, TargetOptionFormValues } from "@/lib/schemas/daily-template-form.tsx";
import type { DailyTemplateIn, DailyTemplateOut } from "@/api/nexuscore/model";

/** A new target option of the given type, counting exactly one. */
export function createTargetOption(type: DailyTemplateFormValues["objective_type"]): TargetOptionFormValues {
    const base = { target_uuid: crypto.randomUUID(), count: { ...DEFAULT_TARGET_COUNT } };
    switch (type) {
        case "kill":
            return { ...base, target_type: "kill", entity: "" };
        case "mine":
            return { ...base, target_type: "mine", block: "" };
        case "scriptevent":
            return { ...base, target_type: "scriptevent", script_id: "" };
        case "visit":
            return {
                ...base,
                target_type: "visit",
                helper_text: "",
                coordinates: [0, 64, 0],
                horizontal_radius: 7,
                vertical_radius: null,
                seconds: 2,
            };
    }
}

export function newTemplateFormValues(createdBy: number | undefined): DailyTemplateFormValues {
    return {
        name: "",
        enabled: true,
        weight: 1,
        created_by: createdBy as number,
        title: "",
        description: "",
        objective_description: "Kill {targets}",
        objective_display: null,
        objective_type: "kill",
        logic: "and",
        targets: [createTargetOption("kill")],
        target_picks: null,
        target_count: null,
        customizations: {},
        rewards: [],
        reward_picks: 1,
    };
}

export function templateToFormValues(template: DailyTemplateOut): DailyTemplateFormValues {
    const input = templateToInput(template);
    return {
        ...input,
        enabled: input.enabled ?? true,
        weight: input.weight ?? 1,
        logic: input.logic ?? "and",
        objective_display: input.objective_display ?? null,
        targets: input.targets.map((target) => ({
            ...target,
            target_uuid: target.target_uuid ?? crypto.randomUUID(),
            count: target.count ?? { ...DEFAULT_TARGET_COUNT },
        })) as DailyTemplateFormValues["targets"],
        target_picks: input.target_picks ?? null,
        target_count: input.target_count ?? null,
        customizations: (input.customizations ?? {}) as DailyTemplateFormValues["customizations"],
        // API metadata types use plain strings where the form schema uses vanilla-data enums.
        rewards: (input.rewards ?? []).map((reward) => ({
            ...reward,
            item_metadata: reward.item_metadata ?? [],
        })) as DailyTemplateFormValues["rewards"],
        reward_picks: input.reward_picks ?? 1,
    };
}

/** Form values as a request body: drops unused or empty optional parts. */
export function formValuesToTemplate(values: DailyTemplateFormValues): DailyTemplateIn {
    const customizations = Object.fromEntries(
        Object.entries(values.customizations ?? {}).filter(([, option]) => option != null),
    );

    return {
        ...values,
        objective_display: values.objective_display?.trim() ? values.objective_display : null,
        // A total only applies to "any" logic.
        target_count: values.logic === "or" ? (values.target_count ?? null) : null,
        target_picks: values.target_picks ?? null,
        customizations,
        rewards: values.rewards.map((reward) =>
            reward.balance != null
                ? { balance: reward.balance, item_metadata: [] }
                : {
                      item: reward.item,
                      count: reward.count,
                      display_name: reward.display_name?.trim() ? reward.display_name : null,
                      item_metadata: reward.item_metadata,
                  },
        ),
    } as DailyTemplateIn;
}
