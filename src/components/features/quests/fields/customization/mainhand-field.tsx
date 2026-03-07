import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {FieldGroup} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {MainhandCustomization} from "@/types/quests";
import {CustomizationCard} from "@/components/features/quests/fields/customization/customization-card.tsx";
import {CUSTOMIZATIONS} from "../../../../../config/objective-customization-options.ts";

export function MainhandField() {
    const field = useFieldContext<MainhandCustomization>()

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className={'w-fit'} data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Mainhand</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.mainhand.display}
                icon={CUSTOMIZATIONS.mainhand.icon}
                hint={"Mainhand: " + (field.state.value?.item || 'None')}
                onRemove={() => field.setValue(null as any)}
            >
                <FieldGroup>
                    <Field data-invalid={isInvalid}>
                        <FieldLabel>Item</FieldLabel>
                        <Input
                            value={field.state.value?.item || ''}
                            onChange={(e) => field.handleChange({ item: e.target.value })}
                            aria-invalid={isInvalid}
                        />
                    </Field>
                </FieldGroup>
            </CustomizationCard>

            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}