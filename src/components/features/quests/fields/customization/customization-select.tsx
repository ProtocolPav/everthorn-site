import { PlusIcon } from "@phosphor-icons/react";
import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues } from "@/lib/schemas/quest-form.tsx";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    CUSTOMIZATIONS,
    CustomizationId,
    CUSTOMIZATION_SECTIONS
} from "../../../../../config/objective-customization-options.ts";

export const CustomizationSelect = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: { objective_index: 0 },

    render: function Render({ form, objective_index }) {
        function addCustomization(customization_id: CustomizationId) {
            form.setFieldValue(
                // @ts-ignore
                `objectives[${objective_index}].customizations.${customization_id}`,
                CUSTOMIZATIONS[customization_id].defaultValue
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

                    const hasAvailableCustomizations = CUSTOMIZATION_SECTIONS.some(group =>
                        group.customizations.some(c => !existingIds.has(c.customization_id))
                    )

                    const availableCustomizations = Object.keys(CUSTOMIZATIONS).length - existingIds.size

                    if (!hasAvailableCustomizations) return null

                    return (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Card className="flex transition-all bg-background/20 hover:bg-background/50 p-0 rounded-lg text-sm justify-center">
                                    <CardContent className="p-2 gap-1">
                                        <div className="flex items-center gap-1 h-8">
                                            <PlusIcon size={16} weight="bold" />
                                            Add Customization
                                        </div>
                                        <div className="text-hint">
                                            {availableCustomizations} available
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>

                            <DialogContent className="gap-3 p-2.5">
                                <DialogTitle>Add Customization</DialogTitle>

                                <div className="flex flex-col gap-3">
                                    {CUSTOMIZATION_SECTIONS.map((cust_group, i) => {
                                        const visibleCusts = cust_group.customizations.filter(
                                            c => !existingIds.has(c.customization_id)
                                        )
                                        if (visibleCusts.length === 0) return null

                                        return (
                                            <div key={cust_group.section_name} className="flex flex-col gap-1.5">
                                                <span className="text-section-label">
                                                    {cust_group.section_name}
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {visibleCusts.map((cust) => {
                                                        const Icon = cust.icon;
                                                        return (
                                                            <Button
                                                                key={cust.customization_id}
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-1.5"
                                                                onClick={() => addCustomization(cust.customization_id as CustomizationId)}
                                                            >
                                                                <Icon size={14} />
                                                                {cust.display}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                                {i !== CUSTOMIZATION_SECTIONS.length - 1 && (
                                                    <Separator className="mt-1" />
                                                )}
                                            </div>
                                        )
                                    }).filter(Boolean)}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )
                }}
            />
        )
    }
})