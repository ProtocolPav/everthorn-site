import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { LocationCustomization } from "@/types/quests";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "@/config/quests/customization-options.ts";
import {ArrowsDownUpIcon, XIcon, MapPinAreaIcon} from "@phosphor-icons/react";
import { useState } from "react";

const label = "text-sm text-muted-foreground";

export function LocationField() {
    const field = useFieldContext<LocationCustomization>();

    const isInvalid = !field.state.meta.isValid;

    const [verticalOpen, setVerticalOpen] = useState(
        !!field.state.value?.vertical_radius
    );

    const coords = field.state.value?.coordinates;
    const h = field.state.value?.horizontal_radius;
    const v = field.state.value?.vertical_radius;

    const coordStr = coords
        ? `(${coords[0] ?? '?'}, ${coords[1] ?? '?'}, ${coords[2] ?? '?'})`
        : '(?, ?, ?)';
    const hint = `Around ${coordStr}  ↔ ${h ?? '?'}${v ? `  ↕ ${v}` : ''}`;

    function handleCoordChange(coordIndex: 0 | 1 | 2, rawValue: string) {
        const newCoords = [...(field.state.value?.coordinates || [0, 0, 0])];
        newCoords[coordIndex] = rawValue === '' ? (undefined as any) : parseFloat(rawValue);
        field.handleChange({ ...field.state.value, coordinates: newCoords as [number, number, number] });
    }

    function handleVerticalToggle(open: boolean) {
        setVerticalOpen(open);
        if (!open) {
            field.handleChange({ ...field.state.value, vertical_radius: undefined as any });
        }
    }

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

                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <MapPinAreaIcon weight="fill" className="text-muted-foreground" />
                        <span className={label}>Complete around...</span>
                    </div>

                    {/* Coordinates */}
                    <div className="flex items-center flex-wrap gap-2">
                        <span className={label}>X:</span>
                        <Input
                            type="number" step="any"
                            className="w-16"
                            data-invalid={isInvalid} aria-invalid={isInvalid}
                            value={coords?.[0] ?? ''}
                            onChange={(e) => handleCoordChange(0, e.target.value)}
                        />
                        <span className={label}>Y:</span>
                        <Input
                            type="number" step="any"
                            className="w-16"
                            data-invalid={isInvalid} aria-invalid={isInvalid}
                            value={coords?.[1] ?? ''}
                            onChange={(e) => handleCoordChange(1, e.target.value)}
                        />
                        <span className={label}>Z:</span>
                        <Input
                            type="number" step="any"
                            className="w-16"
                            data-invalid={isInvalid} aria-invalid={isInvalid}
                            value={coords?.[2] ?? ''}
                            onChange={(e) => handleCoordChange(2, e.target.value)}
                        />
                    </div>

                    {/* Horizontal radius */}
                    <div className="flex items-center flex-wrap gap-2">
                        <span className={label}>↔ within</span>
                        <Input
                            type="number" step="any"
                            className="w-16"
                            data-invalid={isInvalid} aria-invalid={isInvalid}
                            value={field.state.value?.horizontal_radius ?? ''}
                            onChange={(e) => field.handleChange({ ...field.state.value, horizontal_radius: e.target.value === '' ? (undefined as any) : parseFloat(e.target.value) })}
                        />
                        <span className={label}>blocks horizontally</span>
                    </div>

                    {/* Vertical radius — optional */}
                    <Collapsible open={verticalOpen} onOpenChange={handleVerticalToggle}>
                        <CollapsibleTrigger asChild>
                            {!verticalOpen && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    className="gap-2 text-muted-foreground justify-start"
                                >
                                    <ArrowsDownUpIcon size={14} />
                                    Add vertical constraint
                                </Button>
                            )}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="flex items-center flex-wrap gap-2">
                                <span className={label}>↕ within</span>
                                <Input
                                    type="number" step="any"
                                    className="w-16"
                                    data-invalid={isInvalid} aria-invalid={isInvalid}
                                    value={field.state.value?.vertical_radius ?? ''}
                                    onChange={(e) => field.handleChange({ ...field.state.value, vertical_radius: e.target.value === '' ? (undefined as any) : parseFloat(e.target.value) })}
                                />
                                <span className={label}>blocks vertically</span>
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        type="button"
                                        className="text-muted-foreground/40 hover:text-destructive"
                                    >
                                        <XIcon size={12} />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
            </CustomizationCard>
        </Field>
    );
}