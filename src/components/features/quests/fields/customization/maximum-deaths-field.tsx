import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "@/config/quests/customization-options.ts";
import { SmileyXEyesIcon } from "@phosphor-icons/react";
import { useFieldValidity } from "@/hooks/use-field-validity.ts";
import { ConsequenceToggle } from "@/components/features/quests/fields/customization/consequence-toggle.tsx";
import {MaximumDeathsCustomization} from "@/api/nexuscore/model";

export function MaximumDeathsField() {
    const field = useFieldContext<MaximumDeathsCustomization>();
    const { isInvalid } = useFieldValidity();

    const d = field.state.value?.deaths ?? '?';
    const fail = field.state.value?.fail;
    const hint = `max. ${d} deaths`;

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Maximum Deaths</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.maximum_deaths.display}
                icon={CUSTOMIZATIONS.maximum_deaths.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
                warning={fail}
                hasErrors={isInvalid}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <SmileyXEyesIcon weight="fill" className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Don't die...</span>
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                        <span className="text-sm text-muted-foreground">Die no more than</span>
                        <Input
                            type="number"
                            className="w-16"
                            value={field.state.value?.deaths ?? ''}
                            onChange={(e) =>
                                field.handleChange({
                                    ...field.state.value,
                                    deaths: e.target.value === '' ? (undefined as any) : parseInt(e.target.value),
                                })
                            }
                            data-invalid={isInvalid}
                            aria-invalid={isInvalid}
                        />
                        <span className="text-sm text-muted-foreground">times.</span>
                    </div>

                    <ConsequenceToggle
                        value={fail ?? false}
                        onChange={(fail) => field.handleChange({ ...field.state.value, fail })}
                    />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
            </CustomizationCard>
        </Field>
    );
}
