import {Button} from "@/components/ui/button";
import {PlusIcon} from "@phosphor-icons/react";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues, TargetFormValues} from "@/lib/schemas/quest-form.tsx";
import {FieldInfoTooltip} from "@/components/common/field-info-tooltip.tsx";
import {TargetItem} from "@/components/features/quests/fields/target/target-item.tsx";
import {ObjectiveTypes} from "@/types/quests";
import {TARGET_DEFAULTS} from "@/config/quests/target-options.ts";
import {CustomizationId, CUSTOMIZATIONS} from "@/config/quests/customization-options.ts";
import {isAllowedForObjectiveType} from "@/lib/customization-helper.ts";

export const TargetList = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
    },

    render: function Render({form, objectiveIndex}) {
        function createTarget(target_type: ObjectiveTypes): TargetFormValues {
            const factory = TARGET_DEFAULTS[target_type];
            return factory ? factory() : TARGET_DEFAULTS.kill();
        }

        return (
            <div className="flex gap-2 text-sm">
                <div className={'flex flex-col gap-2 items-end'}>
                    <form.AppField
                        name={`objectives[${objectiveIndex}].objective_type`}
                        listeners={{
                            onChange: ({ value }) => {
                                form.setFieldValue(`objectives[${objectiveIndex}].targets`, [createTarget(value)])
                                form.setFieldValue(`objectives[${objectiveIndex}].logic`, 'and')
                                form.setFieldValue(`objectives[${objectiveIndex}].target_count`, undefined)

                                // Strip customizations that are incompatible with the new objective type
                                const currentCustomizations = form.getFieldValue(
                                    `objectives[${objectiveIndex}].customizations` as never
                                ) as Record<string, unknown> | undefined

                                if (currentCustomizations) {
                                    const filtered = Object.fromEntries(
                                        Object.entries(currentCustomizations).filter(([id, v]) => {
                                            if (v === null || v === undefined) return false
                                            const cust = CUSTOMIZATIONS[id as CustomizationId]
                                            return cust ? isAllowedForObjectiveType(cust, value) : true
                                        })
                                    )
                                    form.setFieldValue(
                                        `objectives[${objectiveIndex}].customizations` as never,
                                        filtered as never
                                    )
                                }
                            },
                        }}
                        children={(field) => <field.ObjectiveTypeField />}
                    />

                    <form.Subscribe
                        selector={(state) => state.values.objectives[objectiveIndex]?.targets}
                        children={(targets) => {
                            if (targets.length > 1) {
                                return (
                                    <form.AppField
                                        name={`objectives[${objectiveIndex}].logic`}
                                        children={(field) => <field.TargetLogicField/>}
                                    />
                                )
                            }
                        }}
                    />
                </div>

                <div className={'flex flex-col gap-2 w-full'}>
                    <form.Subscribe
                        selector={(state) => [state.values.objectives[objectiveIndex]?.targets, state.values.objectives[objectiveIndex]?.logic] as const}
                        children={([targets, logic]) => {
                            if (targets.length > 1 && logic === 'or') {
                                return (
                                    <div className={'flex items-center gap-1.5 w-fit text-sm text-muted-foreground'}>
                                        any

                                        <form.AppField
                                            name={`objectives[${objectiveIndex}].target_count`}
                                            listeners={{
                                                onChange: ({value}) => {
                                                    if (logic === 'or') {
                                                        form.state.values.objectives[objectiveIndex]?.targets.forEach((_, i) => {
                                                            form.setFieldValue(`objectives[${objectiveIndex}].targets[${i}].count`, value ? value : 1)
                                                        })
                                                    }
                                                }
                                            }}
                                            children={(field) => <field.TargetCountField/>}
                                        />

                                        of

                                        <FieldInfoTooltip side="right">
                                            Set how many of the targets must be completed. Leave empty to require all.
                                        </FieldInfoTooltip>
                                    </div>
                                )
                            }
                        }}
                    />

                    <form.AppField
                        mode="array"
                        name={`objectives[${objectiveIndex}].targets`}
                        listeners={{
                            onChange: ({value}) => {
                                if (value.length <= 1) {
                                    form.setFieldValue(`objectives[${objectiveIndex}].logic`, 'and')
                                    form.setFieldValue(`objectives[${objectiveIndex}].target_count`, undefined)
                                }
                            },
                        }}
                    >
                        {(field) => (
                            <div className="flex flex-1 flex-col gap-2">
                                {field.state.value?.map((t, targetIndex) => {
                                    return (
                                        <TargetItem
                                            key={t.target_uuid}
                                            form={form}
                                            objectiveIndex={objectiveIndex}
                                            targetIndex={targetIndex}
                                            targetType={form.state.values.objectives[objectiveIndex]?.objective_type}
                                            onRemove={() => {field.removeValue(targetIndex)}}
                                        />
                                    )
                                })}

                                <form.Subscribe
                                    selector={(state) => state.values.objectives[objectiveIndex]?.targets}
                                    children={(targets) => {
                                        if (targets.length > 0) {
                                            return (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    type="button"
                                                    className="w-fit text-muted-foreground"
                                                    onClick={() => field.pushValue(createTarget(form.state.values.objectives[objectiveIndex]?.objective_type))}
                                                >
                                                    <PlusIcon />
                                                    Add Target
                                                </Button>
                                            )
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </form.AppField>
                </div>
            </div>
        );
    },
});
