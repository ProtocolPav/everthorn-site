import {QuestModel} from "@/types/quests";
import {questFormSchema, QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {revalidateLogic, useForm} from "@tanstack/react-form";
import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {cn} from "@/lib/utils.ts";
import {DateTimeRangePicker} from "@/components/ui/custom/date-time-range-picker.tsx";
import {toast} from "sonner";
import {formatDate} from "date-fns";
import {Button} from "@/components/ui/button.tsx";
import {convertApiToZod} from "@/lib/quest-schema-conversion.ts";
import {TagsInput} from "@/components/ui/custom/tags-input.tsx";
import {SeamlessSelect} from "@/components/ui/custom/seamless-select.tsx";
import {QUEST_TYPES} from "@/config/quest-form-options.ts";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {InfoIcon} from "@phosphor-icons/react";

interface QuestEditFormProps {
    quest?: QuestModel
    onSubmit: () => void
}

export function QuestEditForm({quest, onSubmit}: QuestEditFormProps) {
    const empty_values = {
        range: {}
    } as QuestFormValues

    const defaults = quest ? convertApiToZod(quest) : empty_values

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
                quest ?
                `"${value.title}" has been successfully updated!` :
                `"${value.title}" is scheduled for release on ${formatDate(value.range.start, 'PPP HH:mm')}!`
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
            <Card className={'p-0'}>
                <CardContent className={'p-2 flex flex-col gap-2.5'}>
                    <form.Field
                        name="title"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field className="flex-1 min-w-0">
                                    <FieldLabel className="sr-only">Quest Title</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="bg-transparent! text-3xl! focus-visible:bg-muted! focus-visible:ring-0 hover:bg-muted! px-1 border-none font-bold w-full wrap-break-word"
                                        placeholder="Quest Title"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />

                    <div className={'grid sm:flex gap-2'}>
                        <form.Field
                            name="quest_type"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field className="w-fit">
                                        <FieldLabel className="sr-only">Quest Title</FieldLabel>
                                        <SeamlessSelect
                                            options={QUEST_TYPES}
                                            value={field.state.value}
                                            // @ts-ignore
                                            onValueChange={(e) => field.handleChange(e)}
                                            placeholder="Quest Type"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />

                        <form.Field
                            name="range"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field className="w-fit">
                                        <FieldLabel className="sr-only">Quest Dates</FieldLabel>
                                        <DateTimeRangePicker
                                            value={field.state.value}
                                            // @ts-ignore
                                            onChange={(e) => field.handleChange(e)}
                                            disabled={false}
                                            placeholder={'When should the quest start and end?'}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                    </div>

                    <form.Field
                        name="description"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field className="flex-1 min-w-0">
                                    <FieldLabel className="sr-only">Quest Description</FieldLabel>
                                    <Textarea
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={cn('focus-visible:ring-0', isInvalid && 'ring-2 ring-destructive')}
                                        placeholder="Very cool description..."
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />

                    <form.Field
                        name="tags"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field className="flex-1 min-w-0">
                                    <FieldLabel className="sr-only">Quest Dates</FieldLabel>
                                    <div className={'flex gap-1 items-center'}>
                                        <TagsInput
                                            defaultTags={field.state.value}
                                            maxTags={5}
                                            onChange={(e) => field.handleChange(e.map(t => t.label))}
                                            suggestions={['Timed', 'PvE', 'PvP', 'Mining']}
                                        />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type={'button'} variant={'ghost'} size={'icon'}>
                                                    <InfoIcon/>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent align={'end'} side={'bottom'} className={'w-50 text-wrap wrap-normal'}>
                                                Tags are a useful way to show information about the objectives. <br/>
                                                Make them short and to the point. Some tags will be automatically applied,
                                                like Timed, PvP, PvE
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
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