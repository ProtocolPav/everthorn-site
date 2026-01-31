import {QuestModel} from "@/types/quests";
import {questFormSchema, QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {createFormHook, revalidateLogic} from "@tanstack/react-form";
import {toast} from "sonner";
import {formatDate} from "date-fns";
import {Button} from "@/components/ui/button.tsx";
import {convertApiToZod} from "@/lib/quest-schema-conversion.ts";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {fieldContext, formContext} from "@/hooks/use-form-context.ts";
import {QuestTitleField} from "@/components/features/quests/fields/title.tsx";
import {QuestTypeField} from "@/components/features/quests/fields/quest-type.tsx";
import {QuestTimeField} from "@/components/features/quests/fields/time-range.tsx";
import {QuestDescriptionField} from "@/components/features/quests/fields/description.tsx";
import {QuestTagsField} from "@/components/features/quests/fields/tags.tsx";

const { useAppForm: useQuestForm} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        QuestTitleField,
        QuestTypeField,
        QuestTimeField,
        QuestDescriptionField,
        QuestTagsField,
    },
    formComponents: {}
})

interface QuestEditFormProps {
    quest?: QuestModel
    onSubmit: () => void
}

export function QuestEditForm({quest, onSubmit}: QuestEditFormProps) {
    const empty_values = {
        range: {}
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
            <Card className={'p-0'}>
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

                    <Button type={'submit'} className={'w-fit'}>
                        Schedule Quest
                    </Button>

                    <Button className={'w-fit'} type={'button'} onClick={()=> {console.log(form.state.values)}}>
                        Get values
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}