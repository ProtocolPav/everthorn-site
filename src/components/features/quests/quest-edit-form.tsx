import {QuestModel} from "@/types/quests";
import {questFormSchema, QuestFormValues} from "@/lib/schemas/quest-form.tsx";
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

interface QuestEditFormProps {
    quest?: QuestModel
    onSubmit: () => void
}

export function QuestEditForm({quest, onSubmit}: QuestEditFormProps) {
    const empty_values = {
        range: {},
        objectives: []
    } as QuestFormValues

    const defaults = quest ? convertApiToZod(quest) : empty_values

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

                    <Separator />

                    <form.AppField name="objectives" mode="array">
                        {(field) => (
                            <div className="flex flex-col gap-3">
                                {field.state.value.map((_, i) => (
                                    <form.AppForm>
                                        <QuestObjectiveCard
                                            onRemove={() => {field.removeValue(i)}}
                                            index={i}
                                        />
                                    </form.AppForm>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    className="w-full border-dashed text-muted-foreground hover:text-foreground"
                                    onClick={() => field.pushValue({description: ''})}
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