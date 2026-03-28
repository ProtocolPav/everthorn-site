import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {cn} from "@/lib/utils.ts";
import {FieldInfoTooltip} from "@/components/common/field-info-tooltip.tsx";

export function ObjectiveDescriptionField() {
    const field = useFieldContext<string>()

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className="flex-1 min-w-0">
            <FieldLabel className="sr-only">Objective Description</FieldLabel>
            <div className="relative">
                <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={cn('focus-visible:ring-0 pr-9', isInvalid && 'ring-2 ring-destructive')}
                    placeholder="What should the player know? Story context, tips, or additional instructions..."
                />
                <div className="absolute top-2.5 right-3">
                    <FieldInfoTooltip>
                        Shown alongside the task summary. Use for tips, lore, or special instructions.
                    </FieldInfoTooltip>
                </div>
            </div>
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}