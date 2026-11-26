import { MapPinAreaIcon } from "@phosphor-icons/react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { LocationAreaInput } from "@/components/features/quests/fields/location-area-input.tsx";
import { CUSTOMIZATIONS } from "@/config/quests/customization-options.ts";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { ANY_HEIGHT_RADIUS, isAnyHeight } from "@/lib/coordinates.ts";
import { LocationCustomization } from "@/api/nexuscore/model";

const label = "text-sm text-muted-foreground";

export function LocationField() {
    const field = useFieldContext<LocationCustomization>();

    const isInvalid = !field.state.meta.isValid;

    const coords = field.state.value?.coordinates;
    const h = field.state.value?.horizontal_radius;
    const v = field.state.value?.vertical_radius;

    const coordStr = coords
        ? `(${coords[0] ?? '?'}, ${coords[1] ?? '?'}, ${coords[2] ?? '?'})`
        : '(?, ?, ?)';
    const radiusStr = h !== undefined && h === v ? `◯ ${h}` : `↔ ${h ?? '?'}  ↕ ${isAnyHeight(v, h) ? 'any' : v}`;
    const hint = `Around ${coordStr}  ${radiusStr}`;

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Location</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.location.display}
                icon={CUSTOMIZATIONS.location.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
                hasErrors={isInvalid}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <MapPinAreaIcon weight="fill" className="text-muted-foreground" />
                        <span className={label}>Complete around...</span>
                    </div>

                    <LocationAreaInput
                        value={field.state.value}
                        anyHeightAs={ANY_HEIGHT_RADIUS}
                        isInvalid={isInvalid}
                        onChange={(area) => field.handleChange(area as LocationCustomization)}
                    />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
            </CustomizationCard>
        </Field>
    );
}
