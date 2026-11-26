import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {DateTimeRange, DateTimeRangePicker} from "@/components/common/date-time-range-picker.tsx";
import {useFieldValidity} from "@/hooks/use-field-validity.ts";

interface QuestTimeFieldProps {
    /** Locks the picker, e.g. for generated daily quests. */
    disabled?: boolean
}

export function QuestTimeField({ disabled = false }: QuestTimeFieldProps) {
    const field = useFieldContext<DateTimeRange>()
    const { isInvalid } = useFieldValidity()

    return (
        <Field className="w-fit">
            <FieldLabel className="sr-only">Quest Dates</FieldLabel>
            <DateTimeRangePicker
                value={field.state.value}
                onChange={(e) => field.handleChange(e)}
                disabled={disabled}
                placeholder={'When should the quest start and end?'}
                defaultTime={{hours: 16, min: 0}}
            />
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}
