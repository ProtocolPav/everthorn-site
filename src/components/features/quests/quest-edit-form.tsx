import {QuestModel} from "@/types/quests";
import {ObjectiveFormValues, questFormSchema, QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {revalidateLogic} from "@tanstack/react-form";
import {toast} from "sonner";
import {formatDate} from "date-fns";
import {Button} from "@/components/ui/button.tsx";
import {convertApiToZod} from "@/lib/quest-schema-conversion.ts";
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestObjectiveCard} from "@/components/features/quests/fields/objective.tsx";
import {PlusIcon} from "@phosphor-icons/react";
import {Sortable, SortableContent, SortableItem, SortableItemHandle} from "@/components/ui/sortable.tsx";
import {GripVertical} from "lucide-react";

interface QuestEditFormProps {
    quest?: QuestModel
    onSubmit: () => void
}

export function QuestEditForm({quest, onSubmit}: QuestEditFormProps) {
    const empty_values = {
        range: {},
        objectives: [createObjective(0)]
    }

    // @ts-ignore
    const defaults: QuestFormValues = quest ? convertApiToZod(quest) : empty_values

    const form = useQuestForm({
        defaultValues: defaults,
        validationLogic: revalidateLogic({ mode: 'change' }),
        validators: {
            //@ts-ignore
            onDynamic: questFormSchema,
        },
        onSubmit: async ({ value }) => {
            onSubmit()

            console.log(value)

            toast.success(
                quest ?
                `"${value.title}" has been successfully updated!` :
                `"${value.title}" is scheduled for release on ${formatDate(value.range.start, 'PPP HH:mm')}!`
            )
        }
    });

    function createObjective(index: number): ObjectiveFormValues {
        return {
            order_index: index,
            description: '',
            display: '',
            logic: 'and',
            objective_type: 'kill',
            // @ts-ignore
            targets: [{target_type: 'kill', count: undefined, entity: undefined}],
            target_count: undefined,
            customizations: {},
            rewards: []
        }
    }

    return (
        <form
            id="quest-editor"
            onSubmit={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                await form.handleSubmit()
            }}
        >
            <Card className={'p-0 gap-0 overflow-hidden'}>
                <CardContent className={'p-2 flex flex-col gap-2.5'}>
                    <form.AppField
                        name="title"
                        children={(field) => <field.QuestTitleField />}
                    />

                    <div className={'grid sm:flex gap-2'}>
                        <form.AppField
                            name="quest_type"
                            children={(field) => <field.QuestTypeField/>}
                        />

                        <form.AppField
                            name="range"
                            children={(field) => <field.QuestTimeField/>}
                        />
                    </div>

                    <form.AppField
                        name="description"
                        children={(field) => <field.QuestDescriptionField/>}
                    />

                    <form.AppField
                        name="tags"
                        children={(field) => <field.QuestTagsField/>}
                    />

                    <div className={'font-bold pt-2 flex gap-2 items-center'}>
                        Objectives <Separator className={'flex-1'} />
                    </div>

                    <form.AppField name="objectives" mode="array">
                        {(field) => (
                            <div className="flex flex-col gap-3">
                                <Sortable
                                    getItemValue={(item) => item.order_index}
                                    value={field.state.value}
                                    onValueChange={e => field.setValue(e)}
                                >
                                    <SortableContent className={'grid gap-2'}>
                                        {field.state.value.map((v, i) => (
                                            <SortableItem value={v.order_index} key={v.order_index} asChild>
                                                <div className={'relative group'}>
                                                    <SortableItemHandle className={'absolute top-2 left-2'} asChild>
                                                        <Button variant="ghost" size="icon-sm">
                                                            <GripVertical />
                                                        </Button>
                                                    </SortableItemHandle>

                                                    <QuestObjectiveCard
                                                        form={form}
                                                        onRemove={() => {field.removeValue(i)}}
                                                        index={i}
                                                    />
                                                </div>
                                            </SortableItem>
                                        ))}
                                    </SortableContent>
                                </Sortable>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    type="button"
                                    className="w-full"
                                    onClick={() => field.pushValue(createObjective(field.state.value.length))}
                                >
                                    <PlusIcon className="mr-2 size-4" />
                                    Add Objective
                                </Button>
                            </div>
                        )}
                    </form.AppField>

                </CardContent>

                <Separator />

                <CardFooter className={'sticky bottom-0 bg-zinc-900 p-1.5 gap-2 justify-between'}>
                    <Button variant={'outline'} type={'submit'} className={'w-fit'}>
                        Schedule Quest
                    </Button>

                    <Button variant={'outline'} className={'w-fit'} type={'button'} onClick={()=> {console.log(form.state.values)}}>
                        Get values
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}