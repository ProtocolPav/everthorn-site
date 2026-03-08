import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { MaximumDeathsCustomization } from "@/types/quests";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "../../../../../config/objective-customization-options.ts";

export function MaximumDeathsField() {
    const field = useFieldContext<MaximumDeathsCustomization>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    const d = field.state.value?.deaths ?? '?';
    const f = field.state.value?.fail;
    const hint = `Max Deaths: ${d}${f ? ' (fail)' : ''}`;

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Maximum Deaths</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.maximum_deaths.display}
                icon={CUSTOMIZATIONS.maximum_deaths.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center flex-wrap gap-2 text-base">
                        <span>Player can die at most</span>
                        <Input
                            type="number"
                            value={field.state.value?.deaths ?? ''}
                            onChange={(e) =>
                                field.handleChange({
                                    ...field.state.value,
                                    deaths: e.target.value === '' ? (undefined as any) : parseInt(e.target.value),
                                })
                            }
                            className="w-16 border-b-2 border-x-0 border-t-0 bg-transparent rounded-none px-1 text-center font-bold focus-visible:ring-0 focus-visible:border-primary shadow-none data-[invalid=true]:border-destructive"
                            data-invalid={isInvalid}
                            aria-invalid={isInvalid}
                        />
                        <span>times.</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Checkbox
                            id="maximum-deaths-fail"
                            checked={field.state.value?.fail || false}
                            onCheckedChange={(checked) =>
                                field.handleChange({ ...field.state.value, fail: !!checked })
                            }
                        />
                        <label htmlFor="maximum-deaths-fail" className="cursor-pointer">Fail quest on exceed.</label>
                    </div>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </CustomizationCard>
        </Field>
    );
}
