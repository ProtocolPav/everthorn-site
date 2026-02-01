import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {SeamlessSelect} from "@/components/features/common/seamless-select.tsx";
import {OBJECTIVE_TYPES} from "@/config/quest-form-options.ts";

export function ObjectiveTypeField() {
    const field = useFieldContext<string>()

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className="w-fit">
            <FieldLabel className="sr-only">Quest Title</FieldLabel>
            <SeamlessSelect
                options={OBJECTIVE_TYPES}
                value={field.state.value}
                onValueChange={(e) => field.handleChange(e)}
                placeholder="Objective Type"
            />
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}