import { createFileRoute } from '@tanstack/react-router'
import {revalidateLogic, useForm} from "@tanstack/react-form";
import {questFormSchema, QuestFormValues, } from "@/lib/schemas/quest-form.tsx";
import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {SeamlessInput} from "@/components/ui/custom/seamless-input.tsx";
import {cn} from "@/lib/utils.ts";
import {useQuest} from "@/hooks/use-quests.ts";

export const Route = createFileRoute('/admin/quests/editor/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    let defaults: QuestFormValues = {} as QuestFormValues;

    if (!isNaN(Number(id))) {
        const { data: quest } = useQuest(id)
        defaults = quest as QuestFormValues;
    }

    const form = useForm({
        defaultValues: defaults,
        validationLogic: revalidateLogic({ mode: 'change' }),
        validators: {
            //@ts-ignore
            onDynamic: questFormSchema,
        },
        onSubmit: async ({ value }) => {
            // value is fully typed as QuestFormValues
            console.log(value)
        },
    });

    return (
        <div className={'flex p-6'}>
            <form
                id="quest-editor"
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <form.Field
                    name="title"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field className="flex-1 min-w-0">
                                <FieldLabel className="sr-only">Quest Title</FieldLabel>
                                <SeamlessInput
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground px-0 -ml-2 py-2 w-full wrap-break-word"
                                    placeholder="Quest Title"
                                />
                                {isInvalid && (
                                    <FieldError errors={field.state.meta.errors} />
                                )}
                            </Field>
                        )
                    }}
                />

                <form.Field
                    name="description"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field className="flex-1 min-w-0">
                                <FieldLabel className="sr-only">Quest Description</FieldLabel>
                                <SeamlessInput
                                    as={'textarea'}
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={cn(
                                        "text-base min-h-fit text-foreground/80 ml-0 px-3 py-2",
                                        isInvalid && 'ring-2 ring-destructive'
                                    )}
                                    placeholder="Very cool description..."
                                />
                                {isInvalid && (
                                    <FieldError errors={field.state.meta.errors} />
                                )}
                            </Field>
                        )
                    }}
                />
            </form>
        </div>
    )
}
