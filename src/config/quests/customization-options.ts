import {
    CubeFocusIcon,
    HandGrabbingIcon,
    MapPinAreaIcon,
    HourglassLowIcon,
    SmileyXEyesIcon
} from "@phosphor-icons/react";
import {ObjectiveTypes} from "@/types/quests";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

export type CustomizationId = 'natural_block' | 'mainhand' | 'location' | 'timer' | 'maximum_deaths'

export interface Customization {
    customization_id: CustomizationId;
    display: string;
    icon: PhosphorIcon;
    defaultValue: object;
    // If empty, assumed that it is allowed on all Objective Types
    allowed_objective_types?: ObjectiveTypes[];
    disallowed_objective_types?: ObjectiveTypes[];
}

export interface CustomizationSection {
    section_name: string;
    description: string;
    customizations: Customization[];
}

export const CUSTOMIZATION_SECTIONS: CustomizationSection[] = [
    {
        section_name: "Requirements",
        description: "Add extra requirements that must be met",
        customizations: [
            {
                customization_id: 'natural_block',
                display: 'Require Natural Blocks',
                icon: CubeFocusIcon,
                defaultValue: {},
                allowed_objective_types: ['mine']
            },
            {
                customization_id: 'mainhand',
                display: 'Require Mainhand',
                defaultValue: { item: '' },
                icon: HandGrabbingIcon,
                disallowed_objective_types: ['scriptevent']
            },
            {
                customization_id: 'location',
                display: 'Require Location',
                defaultValue: { coordinates: [0, 0, 0] as [number, number, number], horizontal_radius: 0, vertical_radius: 0 },
                icon: MapPinAreaIcon
            }
        ]
    },
    {
        section_name: "Failables",
        description: "These are customizations which could cause players to fail the objective or quest",
        customizations: [
            {
                customization_id: 'timer',
                display: 'Timer',
                defaultValue: { seconds: 60, fail: false },
                icon: HourglassLowIcon
            },
            {
                customization_id: 'maximum_deaths',
                display: 'Maximum Deaths',
                defaultValue: { deaths: 1, fail: false },
                icon: SmileyXEyesIcon
            }
        ]
    }
]

const CUSTOMIZATION_LIST: Customization[] = CUSTOMIZATION_SECTIONS.flatMap(section => section.customizations)

export const CUSTOMIZATIONS: Record<CustomizationId, Customization> = Object.fromEntries(
    CUSTOMIZATION_LIST.map(c => [c.customization_id, c])
) as Record<CustomizationId, Customization>