import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {DateTimeRange, DateTimeRangePicker} from "@/components/common/date-time-range-picker.tsx";
import {useFieldValidity} from "@/hooks/use-field-validity.ts";

export function QuestTimeField() {
    const field = useFieldContext<DateTimeRange>()
    const { isInvalid } = useFieldValidity()

    return (
        <Field className="w-fit">
            <FieldLabel className="sr-only">Quest Dates</FieldLabel>
            <DateTimeRangePicker
                value={field.state.value}
                onChange={(e) => field.handleChange(e)}
                disabled={false}
                placeholder={'When should the quest start and end?'}
                defaultTime={{hours: 16, min: 0}}
            />
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}
