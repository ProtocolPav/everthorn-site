import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {FieldInfoTooltip} from "@/components/common/field-info-tooltip.tsx";
import {useFieldValidity} from "@/hooks/use-field-validity.ts";

export function ObjectiveDisplayField() {
    const field = useFieldContext<string>()
    const { isInvalid } = useFieldValidity()

    return (
        <Field className="flex-1 min-w-0">
            <FieldLabel className="sr-only">Objective Display</FieldLabel>
            <div className="relative">
                <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="focus-visible:ring-0 w-full wrap-break-word placeholder:text-muted-foreground/50 pr-9"
                    placeholder="Custom task display text"
                />
                <div className="absolute top-2.5 right-3">
                    <FieldInfoTooltip>
                        Overrides the auto-generated task summary. Use when the default text is too long or unclear.
                    </FieldInfoTooltip>
                </div>
            </div>
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}
