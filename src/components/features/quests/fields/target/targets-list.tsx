import {Button} from "@/components/ui/button";
import {InfoIcon, PlusIcon} from "@phosphor-icons/react";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues, TargetFormValues} from "@/lib/schemas/quest-form.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {TargetItem} from "@/components/features/quests/fields/objective/target-item.tsx";

export const TargetList = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
    },

    render: function Render({form, objectiveIndex}) {
        function createTarget(target_type: 'kill' | 'mine' | 'scriptevent'): TargetFormValues {
            if (target_type === 'kill') {
                return {
                    target_uuid: crypto.randomUUID(),
                    target_type: 'kill',
                    // @ts-ignore
                    count: undefined,
                    entity: ''
                }
            } else if (target_type === 'mine') {
                return {
                    target_uuid: crypto.randomUUID(),
                    target_type: 'mine',
                    // @ts-ignore
                    count: undefined,
                    block: ''
                }
            } else if (target_type === 'scriptevent') {
                return {
                    target_uuid: crypto.randomUUID(),
                    target_type: 'scriptevent',
                    // @ts-ignore
                    count: undefined,
                    script_id: ''
                }
            }

            return {
                target_uuid: crypto.randomUUID(),
                target_type: 'kill',
                // @ts-ignore
                count: undefined,
                entity: ''
            }
        }

        return (
            <div className="flex gap-2 text-sm">
                <div className={'flex flex-col gap-2 items-end'}>
                    {/* Objective Type */}
                    <form.AppField
                        name={`objectives[${objectiveIndex}].objective_type`}
                        listeners={{
                            onChange: ({value}) => {
                                form.setFieldValue(`objectives[${objectiveIndex}].targets`, [createTarget(value)])
                                form.setFieldValue(`objectives[${objectiveIndex}].logic`, 'and')
                                form.setFieldValue(`objectives[${objectiveIndex}].target_count`, undefined)
                            },
                        }}
                        children={(field) => <field.ObjectiveTypeField/>}
                    />

                    {/* Objective Logic */}
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
                    {/* OR Target Count */}
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

                    {/* Targets */}
                    <form.AppField name={`objectives[${objectiveIndex}].targets`} mode="array">
                        {(field) => (
                            <div className="flex flex-1 flex-col gap-2">
                                {field.state.value?.map((_, targetIndex) => {
                                    return (
                                        <TargetItem
                                            key={_.target_uuid}
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
                                                    onClick={() => field.pushValue(createTarget(form.state.values.objectives[objectiveIndex]?.objective_type))}
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
