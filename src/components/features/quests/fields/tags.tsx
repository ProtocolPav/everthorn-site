import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {TagsInput} from "@/components/common/tags-input.tsx";
import {FieldInfoTooltip} from "@/components/common/field-info-tooltip.tsx";
import {useFieldValidity} from "@/hooks/use-field-validity.ts";

export function QuestTagsField() {
    const field = useFieldContext<string[]>()
    const { isInvalid } = useFieldValidity()

    return (
        <Field className="flex-1 min-w-0">
            <FieldLabel className="sr-only">Quest Tags</FieldLabel>
            <div className="relative">
                <TagsInput
                    defaultTags={field.state.value}
                    maxTags={5}
                    onChange={(e) => field.handleChange(e.map(t => t.label))}
                    suggestions={['Timed', 'PvE', 'PvP', 'Mining']}
                    className="pr-9"
                />
                <div className="absolute top-2.5 right-3">
                    <FieldInfoTooltip>
                        Labels shown on the quest card. Keep them brief. <br/>
                        Some tags like Timed, PvP, and PvE are applied automatically.
                    </FieldInfoTooltip>
                </div>
            </div>
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}
