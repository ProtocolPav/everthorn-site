import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { MainhandCustomization } from "@/types/quests";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "@/config/objective-customization-options.ts";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";
import { MINECRAFT_ITEM_OPTIONS } from "@/config/minecraft-options.ts";
import { cn } from "@/lib/utils.ts";
import { useState } from "react";
import {HandGrabbingIcon} from "@phosphor-icons/react";

export function MainhandField() {
    const field = useFieldContext<MainhandCustomization>();
    const [randomOption] = useState<number>(
        Math.round(Math.random() * (MINECRAFT_ITEM_OPTIONS.length - 1))
    );

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    const selectedItem = field.state.value?.item;
    const selectedLabel = MINECRAFT_ITEM_OPTIONS.find(
        (o) => o.value === selectedItem
    )?.label;

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Mainhand</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.mainhand.display}
                icon={CUSTOMIZATIONS.mainhand.icon}
                hint={"using " + (selectedLabel || "None")}
                onRemove={() => field.setValue(null as any)}
            >
                <div className="flex flex-col gap-2">
                    {/* Current value summary */}
                    <div className="flex text-center gap-2">
                        <HandGrabbingIcon weight={'fill'} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Complete using...
                        </span>
                    </div>

                    {/* Picker */}
                    <VirtualizedCombobox
                        value={selectedItem}
                        onValueChange={(value) =>
                            field.handleChange({ item: value })
                        }
                        options={MINECRAFT_ITEM_OPTIONS}
                        placeholder={`e.g. ${MINECRAFT_ITEM_OPTIONS[randomOption].label}`}
                        allowCustom={false}
                        searchPlaceholder="Search items..."
                        disabled={field.state.meta.isValidating}
                        data-invalid={isInvalid}
                        aria-invalid={isInvalid}
                        className={cn(
                            "w-full",
                            isInvalid &&
                            "ring-2 ring-destructive focus-within:ring-destructive"
                        )}
                    />

                    {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                    )}
                </div>
            </CustomizationCard>
        </Field>
    );
}