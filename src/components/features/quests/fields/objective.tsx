import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CaretDownIcon, PlusIcon, TrashIcon} from "@phosphor-icons/react";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import {useState} from "react";
import {cn} from "@/lib/utils.ts";
import {ObjectiveTypeField} from "./objective/objective-type";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {TargetItem} from "@/components/features/quests/fields/objective/target-item.tsx";

export const QuestObjectiveCard = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        index: 0,
        onRemove: () => {
        },
    },

    render: function Render({form, index, onRemove}) {
        const [open, setOpen] = useState(false);

        return (
            <Collapsible open={open} onOpenChange={setOpen}>
                <Card className="p-0 gap-0 transition-all overflow-hidden">
                    <CollapsibleTrigger asChild>
                        <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0 group hover:bg-input/10">
                            <div className="flex items-center gap-2">
                                <Button variant="invisible" size="icon-sm"/>

                                <CardTitle className="font-medium flex gap-2 items-center">
                                    Objective #{index + 1}
                                    <CaretDownIcon
                                        className={cn(
                                            "transition-all duration-75 group-hover:font-bold",
                                            open ? "rotate-180" : ""
                                        )}
                                    />
                                </CardTitle>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive"
                                onClick={onRemove}
                                type="button"
                            >
                                <TrashIcon />
                            </Button>
                        </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent asChild>
                        <CardContent className="p-2 grid gap-4">
                            <form.AppField
                                name={`objectives[${index}].description`}
                                children={(field) => <field.ObjectiveDescriptionField/>}
                            />

                            <div className="flex gap-2 text-sm">
                                <div className={'flex flex-col gap-2 items-end'}>
                                    <ObjectiveTypeField form={form} index={index}/>

                                    <form.AppField
                                        name={`objectives[${index}].logic`}
                                        children={(field) => <field.TargetLogicField/>}
                                    />
                                </div>

                                <div className={'flex flex-col gap-2 w-full'}>
                                    <div className={'flex items-center gap-2 w-fit'}>
                                        any of

                                        <form.AppField
                                            name={`objectives[${index}].target_count`}
                                            children={(field) => <field.TargetCountField/>}
                                        />
                                    </div>

                                    <form.AppField name={`objectives[${index}].targets`} mode="array">
                                        {(field) => (
                                            <div className="flex flex-1 flex-col gap-3">
                                                {field.state.value?.map((_, targetIndex) => {
                                                    return (
                                                        <TargetItem
                                                            key={targetIndex}
                                                            form={form}
                                                            objectiveIndex={index}
                                                            targetIndex={targetIndex}
                                                            targetType={form.state.values.objectives[index]?.objective_type}
                                                            onRemove={() => {field.removeValue(targetIndex)}}
                                                        />
                                                    )
                                                })}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    type="button"
                                                    className="w-fit"
                                                    onClick={() => field.pushValue({target_type: form.state.values.objectives[index]?.objective_type})}
                                                >
                                                    <PlusIcon className="mr-2 size-4" />
                                                    Add Target
                                                </Button>
                                            </div>
                                        )}
                                    </form.AppField>
                                </div>
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
        );
    },
});
