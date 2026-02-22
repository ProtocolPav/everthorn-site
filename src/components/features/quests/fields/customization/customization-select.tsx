import {
    Icon as PhosphorIcon,
    HandGrabbingIcon,
    MapPinAreaIcon,
    HourglassLowIcon, SmileyXEyesIcon, CubeFocusIcon, PlusIcon
} from "@phosphor-icons/react";
import {ObjectiveTypes} from "@/types/quests";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";

type CustomizationId = 'natural_block' | 'mainhand' | 'location' | 'timer' | 'maximum_deaths'

const CUSTOMIZATION_DEFAULTS: Record<CustomizationId, object> = {
    natural_block: {},
    mainhand: { item: '' },
    location: { coordinates: [0, 0, 0] as [number, number, number], horizontal_radius: 0, vertical_radius: 0 },
    timer: { seconds: 60, fail: true },
    maximum_deaths: { deaths: 1, fail: true },
}

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

const CUSTOMIZATION_META: Record<CustomizationId, { display: string; icon: PhosphorIcon; hint: string }> = {
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

export { CUSTOMIZATION_META }

export const CustomizationSelect = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objective_index: 0
    },

    render: function Render({form, objective_index}) {
        function addCustomization(customization_id: CustomizationId) {
            form.setFieldValue(
                // @ts-ignore
                `objectives[${objective_index}].customizations.${customization_id}`,
                CUSTOMIZATION_DEFAULTS[customization_id]
            )
        }

        return (
            <form.Subscribe
                selector={(state) => state.values.objectives[objective_index]?.customizations}
                children={(customizations) => {
                    const existingIds = new Set(
                        Object.entries(customizations || {})
                            .filter(([, v]) => v !== null && v !== undefined)
                            .map(([k]) => k)
                    )

                    const hasAvailableCustomizations = CUSTOMIZATIONS.some(group =>
                        group.customizations.some(c => !existingIds.has(c.customization_id))
                    )

                    if (!hasAvailableCustomizations) {
                        return null
                    }

                    return (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Card className={'flex transition-all bg-background/20 hover:bg-background/50 p-0 rounded-lg text-sm justify-center'}>
                                    <CardContent className={'p-2 gap-1'}>
                                        <div className="flex items-center gap-1 h-8">
                                            <PlusIcon size={18} weight={'bold'}/>
                                            Add Customization
                                        </div>
                                        <div className={'text-muted-foreground font-mono'}>
                                            6 Available
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent>
                                {CUSTOMIZATIONS.map((cust_group, i) => {
                                    const visibleCusts = cust_group.customizations.filter(
                                        c => !existingIds.has(c.customization_id)
                                    )
                                    if (visibleCusts.length === 0) return null

                                    return (
                                        <div key={cust_group.section_name}>
                                            <div className={'grid gap-1'}>
                                                <div>{cust_group.section_name}</div>
                                            </div>
                                            {visibleCusts.map((cust) => (
                                                <div key={cust.customization_id} onClick={() => addCustomization(cust.customization_id as CustomizationId)}>
                                                    <cust.icon/>
                                                    {cust.display}
                                                </div>
                                            ))}
                                            {i !== CUSTOMIZATIONS.length - 1 && visibleCusts.length > 0 ? <Separator/> : null}
                                        </div>
                                    )
                                }).filter(Boolean)}
                            </DialogContent>
                        </Dialog>
                    )
                }}
            />
        )
    }
})