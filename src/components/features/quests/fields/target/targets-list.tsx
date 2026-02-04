import {Button} from "@/components/ui/button";
import {InfoIcon, PlusIcon} from "@phosphor-icons/react";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {TargetItem} from "@/components/features/quests/fields/objective/target-item.tsx";
import {createDefaultTarget, TargetType} from "@/components/features/quests/targets";

export const TargetList = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
    },

    render: function Render({form, objectiveIndex}) {
        return (
            <div className="flex gap-2 text-sm">
                <div className={'flex flex-col gap-2 items-end'}>
                    <form.AppField
                        name={`objectives[${objectiveIndex}].objective_type`}
                        listeners={{
                            onChange: ({value}) => {
                                const defaultTarget = createDefaultTarget(value as TargetType);
                                form.setFieldValue(`objectives[${objectiveIndex}].targets`, [defaultTarget])
                                form.setFieldValue(`objectives[${objectiveIndex}].target_count`, undefined)
                                form.setFieldValue(`objectives[${objectiveIndex}].logic`, 'and')
                            },
                        }}
                        children={(field) => <field.ObjectiveTypeField/>}
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
                                    <div className={'flex items-center gap-2 w-fit'}>
                                        any

                                        <form.AppField
                                            name={`objectives[${objectiveIndex}].target_count`}
                                            listeners={{
                                                onChange: () => {
                                                    targets.forEach((_, i) => {
                                                        form.setFieldValue(`objectives[${objectiveIndex}].targets[${i}].count`, 1)
                                                    })
                                                }
                                            }}
                                            children={(field) => <field.TargetCountField/>}
                                        />

                                        of

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type={'button'} variant={'ghost'} size={'icon'}>
                                                    <InfoIcon/>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent align={'end'} side={'right'} className={'w-50 text-wrap wrap-normal'}>
                                                Optional. Used for OR Logic. Allows for mix-n-match of different targets.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                )
                            }
                        }}
                    />

                    <form.AppField name={`objectives[${objectiveIndex}].targets`} mode="array">
                        {(field) => (
                            <div className="flex flex-1 flex-col gap-2">
                                {field.state.value?.map((_, targetIndex) => {
                                    return (
                                        <TargetItem
                                            key={targetIndex}
                                            form={form}
                                            objectiveIndex={objectiveIndex}
                                            targetIndex={targetIndex}
                                            targetType={form.state.values.objectives[objectiveIndex]?.objective_type}
                                            // If you remove when n=2, set target-count to null and logic to AND
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
                                                    className="w-fit"
                                                    onClick={() => field.pushValue({target_type: form.state.values.objectives[objectiveIndex]?.objective_type})}
                                                >
                                                    <PlusIcon className="mr-2 size-4" />
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
