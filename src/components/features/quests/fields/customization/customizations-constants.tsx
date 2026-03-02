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

export const CUSTOMIZATION_DEFAULTS: Record<CustomizationId, object> = {
    natural_block: {},
    mainhand: { item: '' },
    location: { coordinates: [0, 0, 0] as [number, number, number], horizontal_radius: 0, vertical_radius: 0 },
    timer: { seconds: 60, fail: true },
    maximum_deaths: { deaths: 1, fail: true },
}

export interface Customization {
    customization_id: CustomizationId;
    display: string;
    icon: PhosphorIcon;
    // If empty, assumed that it is allowed on all Objective Types
    allowed_objective_types?: ObjectiveTypes[];
}

export interface CustomizationSection {
    section_name: string;
    description: string;
    customizations: Customization[];
}

export const CUSTOMIZATIONS: CustomizationSection[] = [
    {
        section_name: "Requirements",
        description: "Add extra requirements that must be met",
        customizations: [
            {
                customization_id: 'natural_block',
                display: 'Require Natural Blocks',
                icon: CubeFocusIcon,
                allowed_objective_types: ['mine']
            },
            {
                customization_id: 'mainhand',
                display: 'Require Mainhand',
                icon: HandGrabbingIcon
            },
            {
                customization_id: 'location',
                display: 'Require Location',
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
                icon: HourglassLowIcon
            },
            {
                customization_id: 'maximum_deaths',
                display: 'Maximum Deaths',
                icon: SmileyXEyesIcon
            }
        ]
    }
]

export const CUSTOMIZATION_META: Record<CustomizationId, { display: string; icon: PhosphorIcon; hint: string }> = {
    natural_block: {
        display: 'Require Natural Blocks',
        icon: CubeFocusIcon,
        hint: 'All blocks naturally generated'
    },
    mainhand: {
        display: 'Require Mainhand',
        icon: HandGrabbingIcon,
        hint: 'using Diamond Sword'
    },
    location: {
        display: 'Require Location',
        icon: MapPinAreaIcon,
        hint: 'around [300, -24]'
    },
    timer: {
        display: 'Timer',
        icon: HourglassLowIcon,
        hint: 'within 5m 40s'
    },
    maximum_deaths: {
        display: 'Maximum Deaths',
        icon: SmileyXEyesIcon,
        hint: 'no more than 5 deaths'
    }
}