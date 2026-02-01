import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";

export function TargetBlockField() {
    const field = useFieldContext<string>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <Field className="flex-1 min-w-0">
            <FieldLabel className="sr-only">Block</FieldLabel>
            <Input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Block (e.g., minecraft:diamond_ore)"
                className={isInvalid ? "ring-2 ring-destructive" : ""}
            />
            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
        </Field>
    );
}
