import { useState } from "react";
import { Field, FieldError, FieldLabel, FieldGroup } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { MaximumDeathsCustomization } from "@/types/quests";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "../../../../../config/objective-customization-options.ts";

export function MaximumDeathsField() {
    const field = useFieldContext<MaximumDeathsCustomization>();

    const [deathsValue, setDeathsValue] = useState(String(field.state.value?.deaths || 1));

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid;

    const d = field.state.value?.deaths || 1;
    const f = field.state.value?.fail;
    const hint = `Max Deaths: ${d}${f ? ' (fail)' : ''}`;

    return (
        <Field className="w-fit">
            <FieldLabel className="sr-only">Maximum Deaths</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.maximum_deaths.display}
                icon={CUSTOMIZATIONS.maximum_deaths.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
            >
                <FieldGroup>
                    <Field>
                        <FieldLabel>Maximum Deaths</FieldLabel>
                        <Input
                            type="number"
                            value={deathsValue}
                            onChange={(e) => setDeathsValue(e.target.value)}
                            onBlur={() => {
                                const num = +deathsValue || 1;
                                field.handleChange({ ...field.state.value, deaths: num });
                                setDeathsValue(String(num));
                            }}
                        />
                    </Field>
                    <Field orientation="horizontal">
                        <FieldLabel>Fail on excess deaths</FieldLabel>
                        <Checkbox
                            checked={field.state.value?.fail || false}
                            onCheckedChange={(checked) => field.handleChange({ ...field.state.value, fail: !!checked })}
                        />
                    </Field>
                </FieldGroup>
            </CustomizationCard>

            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    );
}