import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";

export function ObjectiveDisplayField() {
    const field = useFieldContext<string>()

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className="flex-1 min-w-0">
            <FieldLabel className="sr-only">objective Display</FieldLabel>
            <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="focus-visible:ring-0 w-full wrap-break-word"
                placeholder="Custom Objective Display Text (OPTIONAL)"
            />
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}