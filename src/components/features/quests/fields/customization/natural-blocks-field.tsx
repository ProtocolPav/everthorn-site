import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {NaturalBlockCustomization} from "@/types/quests";
import {CustomizationCard} from "@/components/features/quests/fields/customization/customization-card.tsx";
import {CUSTOMIZATIONS} from "../../../../../config/objective-customization-options.ts";

export function NaturalBlocksField() {
    const field = useFieldContext<NaturalBlockCustomization>()

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className={'w-fit'} data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Natural Block</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.natural_block.display}
                icon={CUSTOMIZATIONS.natural_block.icon}
                hint={"All blocks naturally generated"}
                onRemove={() => field.setValue(null as any)}
            />

            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}