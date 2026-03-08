import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { MainhandCustomization } from "@/types/quests";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "../../../../../config/objective-customization-options.ts";

export function MainhandField() {
    const field = useFieldContext<MainhandCustomization>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Mainhand</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.mainhand.display}
                icon={CUSTOMIZATIONS.mainhand.icon}
                hint={"Mainhand: " + (field.state.value?.item || 'None')}
                onRemove={() => field.setValue(null as any)}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center flex-wrap gap-2 text-base">
                        <span>Player must hold</span>
                        <Input
                            placeholder="minecraft:stone"
                            value={field.state.value?.item || ''}
                            onChange={(e) => field.handleChange({ item: e.target.value })}
                            className="w-40 border-b-2 border-x-0 border-t-0 bg-transparent rounded-none px-1 text-center font-bold focus-visible:ring-0 focus-visible:border-primary shadow-none data-[invalid=true]:border-destructive"
                            data-invalid={isInvalid}
                            aria-invalid={isInvalid}
                        />
                        <span>in their main hand.</span>
                    </div>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </CustomizationCard>
        </Field>
    );
}
