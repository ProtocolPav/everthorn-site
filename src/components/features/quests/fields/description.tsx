import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {cn} from "@/lib/utils.ts";

export function QuestDescriptionField() {
    const field = useFieldContext<string>()

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
}