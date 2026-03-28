import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {TagsInput} from "@/components/common/tags-input.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {InfoIcon} from "@phosphor-icons/react";

export function QuestTagsField() {
    const field = useFieldContext<string[]>()

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
                        <span className="text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-default">
                            <InfoIcon size={14} weight="fill" />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent align={'end'} side={'bottom'}>
                        Tags are a useful way to show information about the objectives. <br/>
                        Make them short and the point. Some tags will be automatically applied,
                        like Timed, PvP, PvE
                    </TooltipContent>
                </Tooltip>
            </div>
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}