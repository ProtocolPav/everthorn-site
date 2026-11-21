import { PlusIcon } from "@phosphor-icons/react";
import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues } from "@/lib/schemas/quest-form.tsx";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    CUSTOMIZATIONS,
    CustomizationId,
    CUSTOMIZATION_SECTIONS
} from "@/config/quests/customization-options.ts";
import {isAllowedForObjectiveType} from "@/lib/customization-helper.ts";

export const CustomizationSelect = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: { objective_index: 0 },

    render: function Render({ form, objective_index }) {
        function addCustomization(customization_id: CustomizationId) {
            form.setFieldValue(
                `objectives[${objective_index}].customizations.${customization_id}` as never,
                CUSTOMIZATIONS[customization_id].defaultValue as never
            )
        }

        return (
            <form.Subscribe
                selector={(state) => ({
                    customizations: state.values.objectives[objective_index]?.customizations,
                    objective_type: state.values.objectives[objective_index]?.objective_type,
                })}
                children={({ customizations, objective_type }) => {
                    const existingIds = new Set(
                        Object.entries(customizations || {})
                            .filter(([, v]) => v !== null && v !== undefined)
                            .map(([k]) => k)
                    )

                    const hasAvailableCustomizations = CUSTOMIZATION_SECTIONS.some(group =>
                        group.customizations.some(
                            c =>
                                !existingIds.has(c.customization_id) &&
                                isAllowedForObjectiveType(c, objective_type)
                        )
                    )

                    return (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    className="w-fit text-muted-foreground"
                                    disabled={!hasAvailableCustomizations}
                                >
                                    <PlusIcon />
                                    Add
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="gap-3 p-2.5">
                                <DialogTitle>Add Customization</DialogTitle>

                                <div className="flex flex-col gap-3">
                                    {CUSTOMIZATION_SECTIONS.map((cust_group, i) => {
                                        const visibleCusts = cust_group.customizations.filter(
                                            c =>
                                                !existingIds.has(c.customization_id) &&
                                                isAllowedForObjectiveType(c, objective_type)
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
