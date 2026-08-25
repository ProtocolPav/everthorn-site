import type { ComponentType } from "react";
import { NaturalBlocksField } from "@/components/features/quests/fields/customization/natural-blocks-field.tsx";
import { LocationField } from "@/components/features/quests/fields/customization/location-field.tsx";
import { MainhandField } from "@/components/features/quests/fields/customization/mainhand-field.tsx";
import { TimerField } from "@/components/features/quests/fields/customization/timer-field.tsx";
import { MaximumDeathsField } from "@/components/features/quests/fields/customization/maximum-deaths-field.tsx";
import { WaypointField } from "@/components/features/quests/fields/customization/waypoint-field.tsx";
import {Customizations} from "@/api/nexuscore/model";

export const CUSTOMIZATION_FIELD_MAP: Record<keyof Customizations, ComponentType> = {
    natural_block: NaturalBlocksField,
    location: LocationField,
    mainhand: MainhandField,
    timer: TimerField,
    maximum_deaths: MaximumDeathsField,
    waypoint: WaypointField,
};
