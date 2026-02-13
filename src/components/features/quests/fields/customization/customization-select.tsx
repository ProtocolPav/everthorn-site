import {
    Icon as PhosphorIcon,
    HandGrabbingIcon,
    MapPinAreaIcon,
    HourglassLowIcon, SmileyXEyesIcon, CubeFocusIcon, PlusIcon
} from "@phosphor-icons/react";
import {ObjectiveTypes} from "@/types/quests";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel, SelectSeparator,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";

interface Customization {
    customization_id: string;
    display: string;
    icon: PhosphorIcon;
    // If empty, assumed that it is allowed on all Objective Types
    allowed_objective_types?: ObjectiveTypes[];
}

interface CustomizationSection {
    section_name: string;
    description: string;
    customizations: Customization[];
}

const CUSTOMIZATIONS: CustomizationSection[] = [
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

export const CustomizationSelect = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objective_index: 0
    },

    render: function Render({form, objective_index}) {
        function addCustomization(customization_id: string) {
            form.setFieldValue(`objectives[${objective_index}].customizations.${customization_id}`, {})
        }

        return (
            <Select value={''} onValueChange={addCustomization}>
                <SelectTrigger>
                    <SelectValue className={'opacity-0'} placeholder={(
                        <div className={'flex items-center gap-2'}>
                            <PlusIcon/>
                            Customize Objective
                        </div>
                    )}/>
                </SelectTrigger>
                <SelectContent position={'item-aligned'}>
                    {CUSTOMIZATIONS.map((cust_group, i) => (
                        <>
                            <SelectGroup>
                                <SelectLabel className={'grid gap-1'}>
                                    <div>{cust_group.section_name}</div>
                                </SelectLabel>
                                {cust_group.customizations.map((cust) => (
                                    <SelectItem value={cust.customization_id}>
                                        <cust.icon/>
                                        {cust.display}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                            {i !== CUSTOMIZATIONS.length-1 ? <SelectSeparator/> : null}
                        </>
                    ))}
                </SelectContent>
            </Select>
        )
    }
})