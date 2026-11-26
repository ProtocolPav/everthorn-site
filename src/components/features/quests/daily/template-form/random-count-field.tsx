import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { getErrorMessage } from "@/lib/quest-form-errors.ts";
import { RandomCountInput } from "@/components/features/quests/daily/template-form/random-count-input.tsx";
import type { RandomCount } from "@/api/nexuscore/model";

interface RandomCountFieldProps {
    label?: string;
    minimum?: number;
    placeholder?: string;
    className?: string;
}

/** RandomCountInput bound to the current form field, for use as `field.RandomCountField`. */
export function RandomCountField({ label = "Count", minimum = 1, placeholder, className }: RandomCountFieldProps) {
    const field = useFieldContext<RandomCount | null>();
    const submitted = field.form.state.submissionAttempts > 0;
    const isInvalid = (field.state.meta.isTouched || submitted) && !field.state.meta.isValid;
    const message = field.state.meta.errors.map(getErrorMessage).find(Boolean);

    return (
        <Field className="w-fit" title={isInvalid ? message : undefined}>
            <FieldLabel className="sr-only">{label}</FieldLabel>
            <RandomCountInput
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                onBlur={field.handleBlur}
                invalid={isInvalid}
                minimum={minimum}
                placeholder={placeholder}
                aria-label={label}
                className={className}
            />
        </Field>
    );
}
