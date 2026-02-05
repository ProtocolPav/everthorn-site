import { Field, FieldLabel } from "@/components/ui/field"
import { VirtualizedCombobox } from "@/components/features/common/virtualized-combobox"
import { useFieldContext } from "@/hooks/use-form-context"
import {CUSTOM_BLOCK_OPTIONS} from "@/config/minecraft-options.ts"
import { cn } from "@/lib/utils"
import {useState} from "react";

export function TargetBlockField() {
    const field = useFieldContext<string>()
    const [randomOption] = useState<number>(Math.round(Math.random() * CUSTOM_BLOCK_OPTIONS.length))

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className="flex-1 w-0 min-w-0">
            <FieldLabel className="sr-only">Block</FieldLabel>
            <VirtualizedCombobox
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
                options={CUSTOM_BLOCK_OPTIONS}
                placeholder={`e.g. ${CUSTOM_BLOCK_OPTIONS[randomOption].label}`}
                allowCustom={true}
                searchPlaceholder="Search blocks..."
                disabled={field.state.meta.isValidating}
                className={cn(
                    isInvalid && "ring-2 ring-destructive focus:ring-destructive"
                )}
            />
        </Field>
    )
}
