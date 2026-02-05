import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {VirtualizedCombobox} from "@/components/features/common/virtualized-combobox.tsx";
import {MINECRAFT_ENTITY_OPTIONS} from "@/config/minecraft-options.ts";
import {cn} from "@/lib/utils.ts";
import {useState} from "react";

export function TargetEntityField() {
    const field = useFieldContext<string>()
    const [randomOption] = useState<number>(Math.round(Math.random() * MINECRAFT_ENTITY_OPTIONS.length))

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className="flex-1 w-0 min-w-0">
            <FieldLabel className="sr-only">Block</FieldLabel>
            <VirtualizedCombobox
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
                options={MINECRAFT_ENTITY_OPTIONS}
                placeholder={`e.g. ${MINECRAFT_ENTITY_OPTIONS[randomOption].label}`}
                searchPlaceholder="Search entities..."
                disabled={field.state.meta.isValidating}
                className={cn(
                    isInvalid && "ring-2 ring-destructive focus:ring-destructive"
                )}
            />
        </Field>
    )
}
