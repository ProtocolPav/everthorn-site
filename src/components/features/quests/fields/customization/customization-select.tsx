import { PlusIcon } from "@phosphor-icons/react";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {
    CUSTOMIZATIONS,
    CUSTOMIZATION_DEFAULTS,
    CustomizationId, CUSTOMIZATION_META
} from "./customizations-constants";

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

                    const availableCustomizations = Object.keys(CUSTOMIZATION_META).length - existingIds.size

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
                                            {availableCustomizations} Available
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