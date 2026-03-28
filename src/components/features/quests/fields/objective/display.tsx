import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {InfoIcon} from "@phosphor-icons/react";

export function ObjectiveDisplayField() {
    const field = useFieldContext<string>()

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className="flex-1 min-w-0">
            <FieldLabel className="sr-only">objective Display</FieldLabel>
            <div className={'flex gap-1 items-center'}>
                <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="focus-visible:ring-0 w-full wrap-break-word placeholder:text-muted-foreground/50"
                    placeholder="Custom task display text"
                />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-default">
                            <InfoIcon size={14} weight="fill" />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent align={'end'} side={'bottom'}>
                        Any text you enter here will override the default Objective Task Display. This is useful
                        for when you have too many Targets, and you want to display a cleaner task. Always write any
                        additional information in the Description.
                    </TooltipContent>
                </Tooltip>
            </div>
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}