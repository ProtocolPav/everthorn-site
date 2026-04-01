import type { ComponentType } from "react";
import type { CustomizationId } from "@/config/quests/customization-options.ts";
import { NaturalBlocksField } from "@/components/features/quests/fields/customization/natural-blocks-field.tsx";
import { LocationField } from "@/components/features/quests/fields/customization/location-field.tsx";
import { MainhandField } from "@/components/features/quests/fields/customization/mainhand-field.tsx";
import { TimerField } from "@/components/features/quests/fields/customization/timer-field.tsx";
import { MaximumDeathsField } from "@/components/features/quests/fields/customization/maximum-deaths-field.tsx";

export const CUSTOMIZATION_FIELD_MAP: Record<CustomizationId, ComponentType> = {
    natural_block: NaturalBlocksField,
    location: LocationField,
    mainhand: MainhandField,
    timer: TimerField,
    maximum_deaths: MaximumDeathsField,
};
