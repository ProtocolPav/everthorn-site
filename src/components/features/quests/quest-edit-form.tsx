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
import {Sortable, SortableContent, SortableItem} from "@/components/ui/sortable.tsx";
import {arrayMove} from "@dnd-kit/sortable";

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
            objective_id: index,
            order_index: index,
            description: '',
            display: '',
            logic: 'and',
            objective_type: 'kill',
            // @ts-ignore
            targets: [{target_uuid: crypto.randomUUID(), target_type: 'kill', count: undefined, entity: undefined}],
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
                <CardContent className={'pt-3 pb-2.5 px-3 flex flex-col gap-3'}>
                    <form.AppField
                        name="title"
                        children={(field) => <field.QuestTitleField />}
                    />

                    <div className={'flex flex-wrap gap-2'}>
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
                </CardContent>

                <Separator />

                <div className={'px-3 py-2'}>
                    <div className={'text-section-label flex gap-3 items-center mb-2'}>
                        Objectives <Separator className={'flex-1'} />
                    </div>

                    <form.AppField name="objectives" mode="array">
                        {(field) => (
                            <div className="flex flex-col gap-1.5">
                                <form.Subscribe
                                    selector={(state) => state.values.objectives}
                                    children={(objectives) => (
                                        <Sortable
                                            getItemValue={(item) => item.objective_id}
                                            value={objectives}
                                            onMove={({ activeIndex, overIndex }) => {
                                                const reordered = arrayMove(objectives, activeIndex, overIndex);

                                                const withUpdatedIndices = reordered.map((item, index) => ({
                                                    ...item,
                                                    order_index: index
                                                }));

                                                field.setValue(withUpdatedIndices);
                                            }}
                                        >
                                            <SortableContent className={'grid gap-1.5'}>
                                                {objectives.map((v, i) => (
                                                    <SortableItem value={v.objective_id} key={v.objective_id} asChild>
                                                        <div className={'relative group'}>
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
                                    )}
                                />

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    className="w-fit text-muted-foreground"
                                    onClick={() => field.pushValue(createObjective(field.state.value.length))}
                                >
                                    <PlusIcon className="size-3.5" />
                                    Add Objective
                                </Button>
                            </div>
                        )}
                    </form.AppField>
                </div>

                <Separator />

                <CardFooter className={'sticky bottom-0 bg-card/95 backdrop-blur-sm px-3 py-2'}>
                    <Button variant={'default'} type={'submit'} className={'w-full'}>
                        Schedule Quest
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}