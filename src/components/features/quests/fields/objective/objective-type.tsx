import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {SeamlessSelect} from "@/components/common/seamless-select.tsx";
import {OBJECTIVE_TYPES} from "@/config/quests/form-options.ts";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {useFieldValidity} from "@/hooks/use-field-validity.ts";

export function ObjectiveTypeField() {
    const field = useFieldContext<string>()
    const { isInvalid } = useFieldValidity()

    return (
        <Field className="w-fit">
            <FieldLabel className="sr-only">Objective Type</FieldLabel>
            <SeamlessSelect
                options={OBJECTIVE_TYPES}
                value={field.state.value}
                onValueChange={(e) => field.handleChange(e)}
                placeholder="Objective Type"
            />
            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
        </Field>
    )
}
