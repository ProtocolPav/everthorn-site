import { createFileRoute } from '@tanstack/react-router'
import {revalidateLogic, useForm} from "@tanstack/react-form";
import {questFormSchema, QuestFormValues, } from "@/lib/schemas/quest-form.tsx";
import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {SeamlessInput} from "@/components/ui/custom/seamless-input.tsx";
import {DateTimeRangePicker} from "@/components/ui/custom/date-time-range-picker.tsx";
import {cn} from "@/lib/utils.ts";
import {useQuest} from "@/hooks/use-quests.ts";
import {useEffect, useState} from 'react';

export const Route = createFileRoute('/admin/quests/editor/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { data: quest } = useQuest(id)

    const [defaults, setDefaults] = useState({} as QuestFormValues)

    const [timeRange, setTimeRange] = useState<{ start?: Date; end?: Date }>({
        start: undefined,
        end: undefined,
    })

    useEffect(() => {
        if (quest) {
            setTimeRange({
                start: quest.start_time ? new Date(quest.start_time) : undefined,
                end: quest.end_time ? new Date(quest.end_time) : undefined,
            })

            setDefaults(quest as QuestFormValues)
        }
    }, [quest])

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

                <Field className="flex-1 min-w-0">
                    <FieldLabel>Time Range</FieldLabel>
                    <DateTimeRangePicker
                        value={timeRange}
                        onChange={(value) => {
                            setTimeRange(value);
                            form.setFieldValue('start_time', value.start ? value.start.toISOString() : undefined);
                            form.setFieldValue('end_time', value.end ? value.end.toISOString() : undefined);
                        }}
                        disabled={false}
                    />
                    {form.state.fieldMeta.start_time?.isTouched && !form.state.fieldMeta.start_time?.isValid && (
                        <FieldError errors={form.state.fieldMeta.start_time.errors} />
                    )}
                    {form.state.fieldMeta.end_time?.isTouched && !form.state.fieldMeta.end_time?.isValid && (
                        <FieldError errors={form.state.fieldMeta.end_time.errors} />
                    )}
                </Field>

            </form>
        </div>
    )
}
