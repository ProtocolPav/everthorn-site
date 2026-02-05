// components/fields/target-block-field.tsx
import { Field, FieldLabel } from "@/components/ui/field"
import { VirtualizedCombobox } from "@/components/features/common/virtualized-combobox"
import { useFieldContext } from "@/hooks/use-form-context"
import { MINECRAFT_BLOCK_OPTIONS } from "@/config/minecraft-options.ts"
import { cn } from "@/lib/utils"

export function TargetBlockField() {
    const field = useFieldContext<string>()

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    const errorMessage = field.state.meta.errors?.[0]

    return (
        <Field className="flex-1 min-w-0">
            <FieldLabel className="sr-only">Block</FieldLabel>
            <VirtualizedCombobox
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
                options={MINECRAFT_BLOCK_OPTIONS}
                placeholder="Block (e.g., minecraft:diamond_ore)"
                searchPlaceholder="Search blocks..."
                disabled={field.state.meta.isValidating}
                className={cn(
                    isInvalid && "ring-2 ring-destructive focus:ring-destructive"
                )}
            />
            {isInvalid && errorMessage && (
                <p className="text-xs text-destructive mt-1.5">
                    {errorMessage}
                </p>
            )}
        </Field>
    )
}
