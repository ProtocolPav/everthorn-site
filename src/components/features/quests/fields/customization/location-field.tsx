import { useState } from 'react';
import {Field, FieldError, FieldLabel, FieldGroup} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {LocationCustomization} from "@/types/quests";
import {CustomizationCard} from "@/components/features/quests/fields/customization/customization-card.tsx";
import {CUSTOMIZATIONS} from "../../../../../config/objective-customization-options.ts";

export function LocationField() {
    const field = useFieldContext<LocationCustomization>()

    const [localValueX, setLocalValueX] = useState(String(field.state.value?.coordinates?.[0] || 0));
    const [localValueY, setLocalValueY] = useState(String(field.state.value?.coordinates?.[1] || 0));
    const [localValueZ, setLocalValueZ] = useState(String(field.state.value?.coordinates?.[2] || 0));
    const [hVal, setHVal] = useState(String(field.state.value?.horizontal_radius || 0));
    const [vVal, setVVal] = useState(String(field.state.value?.vertical_radius || 0));

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    const coords = field.state.value?.coordinates || [0,0,0];
    const h = field.state.value?.horizontal_radius || 0;
    const v = field.state.value?.vertical_radius || 0;
    const hint = "X:"+coords[0]+" Y:"+coords[1]+" Z:"+coords[2]+" (H:"+h+", V:"+v+")";

    return (
        <Field className={'w-fit'} data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Location</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.location.display}
                icon={CUSTOMIZATIONS.location.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
            >
                <FieldGroup>
                    <Field data-invalid={isInvalid}>
                        <FieldLabel>X Coordinate</FieldLabel>
                         <Input
                             type="number"
                             step="0.5"
                             value={localValueX}
                             onChange={(e) => setLocalValueX(e.target.value)}
                             onBlur={() => { const num = parseFloat(localValueX) || 0; const current = field.state.value; const newCoords = [...(current?.coordinates || [0,0,0])]; newCoords[0] = num; field.handleChange({ ...current, coordinates: newCoords as [number, number, number] }); setLocalValueX(String(num)); }}
                             aria-invalid={isInvalid}
                         />
                    </Field>
                    <Field data-invalid={isInvalid}>
                        <FieldLabel>Y Coordinate</FieldLabel>
                         <Input
                             type="number"
                             step="0.5"
                             value={localValueY}
                             onChange={(e) => setLocalValueY(e.target.value)}
                             onBlur={() => { const num = parseFloat(localValueY) || 0; const current = field.state.value; const newCoords = [...(current?.coordinates || [0,0,0])]; newCoords[1] = num; field.handleChange({ ...current, coordinates: newCoords as [number, number, number] }); setLocalValueY(String(num)); }}
                             aria-invalid={isInvalid}
                         />
                    </Field>
                    <Field data-invalid={isInvalid}>
                        <FieldLabel>Z Coordinate</FieldLabel>
                         <Input
                             type="number"
                             step="0.5"
                             value={localValueZ}
                             onChange={(e) => setLocalValueZ(e.target.value)}
                             onBlur={() => { const num = parseFloat(localValueZ) || 0; const current = field.state.value; const newCoords = [...(current?.coordinates || [0,0,0])]; newCoords[2] = num; field.handleChange({ ...current, coordinates: newCoords as [number, number, number] }); setLocalValueZ(String(num)); }}
                             aria-invalid={isInvalid}
                         />
                    </Field>
                    <Field data-invalid={isInvalid}>
                        <FieldLabel>Horizontal Radius</FieldLabel>
                         <Input
                             type="number"
                             min="0"
                             step="0.5"
                             value={hVal}
                             onChange={(e) => setHVal(e.target.value)}
                             onBlur={() => { const num = Math.max(0, parseFloat(hVal) || 0); field.handleChange({ ...field.state.value, horizontal_radius: num }); setHVal(String(num)); }}
                             aria-invalid={isInvalid}
                         />
                    </Field>
                    <Field data-invalid={isInvalid}>
                        <FieldLabel>Vertical Radius</FieldLabel>
                         <Input
                             type="number"
                             min="0"
                             step="0.5"
                             value={vVal}
                             onChange={(e) => setVVal(e.target.value)}
                             onBlur={() => { const num = Math.max(0, parseFloat(vVal) || 0); field.handleChange({ ...field.state.value, vertical_radius: num }); setVVal(String(num)); }}
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