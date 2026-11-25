import type {
    DailyTemplateInObjectiveType,
    LocationOption,
    MainhandOption,
    MaximumDeathsOption,
    NaturalBlockOption,
    RandomCount,
    TimerOption,
} from "@/api/nexuscore/model";

/** Customizations a daily template can randomly add. Waypoints are part of `location`. */
export type TemplateCustomizationId = "mainhand" | "location" | "timer" | "maximum_deaths" | "natural_block";

export const TEMPLATE_CUSTOMIZATION_IDS: TemplateCustomizationId[] = [
    "timer",
    "maximum_deaths",
    "location",
    "mainhand",
    "natural_block",
];

/** Which objective types allow each customization. Mirrors Nexuscore's CUSTOMIZATION_ALLOWED_TYPES. */
export const TEMPLATE_CUSTOMIZATION_ALLOWED: Record<TemplateCustomizationId, DailyTemplateInObjectiveType[]> = {
    mainhand: ["kill", "mine"],
    location: ["kill", "mine", "scriptevent"],
    timer: ["kill", "mine", "scriptevent", "visit"],
    maximum_deaths: ["kill", "mine", "scriptevent", "visit"],
    natural_block: ["mine"],
};

export function isTemplateCustomizationAllowed(
    id: TemplateCustomizationId,
    objectiveType: DailyTemplateInObjectiveType | undefined,
): boolean {
    return !objectiveType || TEMPLATE_CUSTOMIZATION_ALLOWED[id].includes(objectiveType);
}

export function describeAllowedTypes(id: TemplateCustomizationId): string {
    const types = TEMPLATE_CUSTOMIZATION_ALLOWED[id];
    if (types.length === 4) return "All types";
    const labels: Record<DailyTemplateInObjectiveType, string> = { kill: "Kill", mine: "Mine", scriptevent: "Custom Script", visit: "Locate" };
    const names = types.map((type) => labels[type]);
    return names.length === 1 ? `${names[0]} only` : names.join(", ");
}

interface TemplateCustomizationDefaults {
    mainhand: MainhandOption;
    location: LocationOption;
    timer: TimerOption;
    maximum_deaths: MaximumDeathsOption;
    natural_block: NaturalBlockOption;
}

/** Values a customization starts with when added to a template. */
export function getTemplateCustomizationDefault<K extends TemplateCustomizationId>(id: K): TemplateCustomizationDefaults[K] {
    const defaults: TemplateCustomizationDefaults = {
        mainhand: { chance: 0.5, items: [] },
        location: {
            chance: 0.5,
            locations: [{ coordinates: [0, 64, 0], horizontal_radius: 32, vertical_radius: 16 }],
            show_waypoint: true,
        },
        timer: { chance: 0.5, seconds: { min: 600, max: 900 }, fail: true },
        maximum_deaths: { chance: 0.5, deaths: { choices: [1, 2, 3] }, fail: true },
        natural_block: { chance: 1 },
    };
    return defaults[id];
}

/** A target option's count before anyone edits it: exactly one. */
export const DEFAULT_TARGET_COUNT: RandomCount = { choices: [1] };
