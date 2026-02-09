import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {SeamlessSelect} from "@/components/common/seamless-select.tsx";
import {QUEST_TYPES} from "@/config/quest-form-options.ts";

export function QuestTypeField() {
    const field = useFieldContext<string>()

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className="w-fit">
            <FieldLabel className="sr-only">Quest Title</FieldLabel>
            <SeamlessSelect
                options={QUEST_TYPES}
                value={field.state.value}
                onValueChange={(e) => field.handleChange(e)}
                placeholder="Quest Type"
            />
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}