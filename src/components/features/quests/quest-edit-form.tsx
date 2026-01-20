import {QuestModel} from "@/types/quests";
import {useEffect, useState} from "react";
import {questFormSchema, QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {revalidateLogic, useForm} from "@tanstack/react-form";
import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {SeamlessInput} from "@/components/ui/custom/seamless-input.tsx";
import {cn} from "@/lib/utils.ts";
import {DateTimeRangePicker} from "@/components/ui/custom/date-time-range-picker.tsx";
import {toast} from "sonner";
import {formatDate} from "date-fns";
import {Button} from "@/components/ui/button.tsx";

interface QuestEditFormProps {
    quest?: QuestModel
    onSubmit: () => void
}

export function QuestEditForm({quest, onSubmit}: QuestEditFormProps) {
    const [editing, setEditing] = useState(!!quest)

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
            onSubmit()

            console.log(value)

            toast.success(
                editing ?
                `"${value.title}" has been successfully updated!` :
                `"${value.title}" is scheduled for release on ${formatDate(value.start_time, 'PPP at HH:mm')}!`
            )
        },
    });

    return (
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

            {/*
                ISSUE: We want this to be 2 separate form.Fields, which is not possible
                without changing either the formSchema, or having 2 separate fields which would be worse for the UI.

                Currently, it doesn't re-validate, and does not accept the API's formatting.

            */}
            <Field className="flex-1 max-w-2/3">
                <FieldLabel>Time Range</FieldLabel>
                <DateTimeRangePicker
                    value={timeRange}
                    onChange={(newValue) => {
                        setTimeRange(newValue)

                        form.setFieldValue('start_time', newValue.start?.toISOString())
                        form.setFieldValue('end_time', newValue.end?.toISOString())
                    }}
                    disabled={false}
                />
                {/* 4. Handle Errors separately or aggregated */}
                <form.Subscribe
                    selector={(state) => [
                        state.fieldMeta.start_time?.errors,
                        state.fieldMeta.end_time?.errors
                    ]}
                    children={([startErrors, endErrors]) => {
                        const errors = [...(startErrors || []), ...(endErrors || [])]
                        return errors.length > 0 ? (
                            <p className="text-[0.8rem] font-medium text-destructive mt-2">
                                {JSON.stringify(errors[0])}
                            </p>
                        ) : null
                    }}
                />
            </Field>

            <Button type={'submit'} onClick={() => {form.validateAllFields('submit'); console.log(form.getAllErrors().form.errors); console.log(form.state.values.end_time)}}>
                Schedule Quest
            </Button>
        </form>
    )
}