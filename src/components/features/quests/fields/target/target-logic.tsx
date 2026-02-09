import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {SeamlessSelect} from "@/components/common/seamless-select.tsx";
import {LOGIC_OPTIONS} from "@/config/quest-form-options.ts";

export function TargetLogicField() {
    const field = useFieldContext<string>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <Field className="w-fit">
            <FieldLabel className="sr-only">Target Logic</FieldLabel>
            <SeamlessSelect
                options={LOGIC_OPTIONS}
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
                placeholder="Logic"
            />
            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
        </Field>
    );
}
