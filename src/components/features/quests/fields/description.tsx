import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {cn} from "@/lib/utils.ts";
import {FieldInfoTooltip} from "@/components/common/field-info-tooltip.tsx";
import {useFieldValidity} from "@/hooks/use-field-validity.ts";

const DEFAULT_PLACEHOLDER =
    "You should hook in players into accepting this quest." +
    " Give background info, and tease what's coming..."

interface QuestDescriptionFieldProps {
    placeholder?: string
    /** Tooltip text next to the field. */
    info?: string
}

export function QuestDescriptionField({
    placeholder = DEFAULT_PLACEHOLDER,
    info = "Shown to players when they view the quest. Set the tone and give context.",
}: QuestDescriptionFieldProps) {
    const field = useFieldContext<string>()
    const { isInvalid } = useFieldValidity()

    return (
        <Field className="flex-1 min-w-0">
            <FieldLabel className="sr-only">Quest Description</FieldLabel>
            <div className="relative">
                <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={cn('focus-visible:ring-0 pr-9', isInvalid && 'ring-2 ring-destructive')}
                    placeholder={placeholder}
                />
                <div className="absolute top-2.5 right-3">
                    <FieldInfoTooltip>
                        {info}
                    </FieldInfoTooltip>
                </div>
            </div>
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}
